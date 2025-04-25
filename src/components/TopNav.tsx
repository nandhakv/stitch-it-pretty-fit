import React, { useState, useEffect } from 'react';
import { 
  User, 
  MapPin, 
  MapPinOff, 
  ChevronLeft, 
  LogIn, 
  ShoppingBag, 
  Heart, 
  Settings,
  LogOut,
  HelpCircle,
  Home,
  ChevronRight,
  Ruler,
  BookmarkCheck,
  Loader
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOrder } from '../utils/OrderContext';
import { useAuth } from '../utils/AuthContext';
import ResponsiveDialog from "@/components/ui/responsive-dialog";
import AddressSelector from './AddressSelector';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Address } from '../utils/types';
import { toast } from '@/components/ui/use-toast';

const TopNav = () => {
  const { order, updateOrder } = useOrder();
  const { user, firebaseUser, isAuthenticated, logout, showLoginSheet } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if pincode exists in localStorage
  const hasPincode = !!localStorage.getItem('userPincode');
  
  // Set initial state of address sheet to closed
  const [isAddressSheetOpen, setIsAddressSheetOpen] = useState(false);
  
  // State for profile dropdown and drawer
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);
  
  // State for addresses
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | undefined>(order.selectedAddressId);
  
  // Ref for profile dropdown
  const profileMenuRef = React.useRef<HTMLDivElement>(null);
  const profileButtonRef = React.useRef<HTMLButtonElement>(null);

  // Load saved pincode and address ID from localStorage on component mount
  useEffect(() => {
    const savedPincode = localStorage.getItem('userPincode');
    const savedAddressId = localStorage.getItem('selectedAddressId');
    
    if (savedPincode) {
      // If we have a pincode, update the context and keep sheet closed
      updateOrder({ 
        deliveryPincode: savedPincode,
        // Only set the selectedAddressId if it exists
        ...(savedAddressId ? { selectedAddressId } : {})
      });
      
      // Set the selected address ID for highlighting only if it exists
      if (savedAddressId) {
        setSelectedAddressId(savedAddressId);
      } else {
        // Clear any selected address ID if we only have a pincode
        setSelectedAddressId(undefined);
      }
    } else if (location.pathname !== '/') {
      // If no pincode and not on homepage, show address sheet
      setIsAddressSheetOpen(true);
    }
  }, []);
  
  // Debug logging to help diagnose the issue
  useEffect(() => {
    console.log('TopNav - Auth status:', isAuthenticated);
    console.log('TopNav - User:', user);
    console.log('TopNav - User addresses:', user?.addresses);
  }, [isAuthenticated, user]);
  
  // Handle clicks outside of profile dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showProfileMenu &&
        profileMenuRef.current &&
        profileButtonRef.current &&
        !profileMenuRef.current.contains(event.target as Node) &&
        !profileButtonRef.current.contains(event.target as Node)
      ) {
        setShowProfileMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileMenu]);
  
  // Fetch addresses from API
  const fetchAddresses = async () => {
    if (!firebaseUser) return;
    
    try {
      setLoadingAddresses(true);
      const firebaseToken = await firebaseUser.getIdToken();
      
      console.log('Fetching addresses with token:', firebaseToken.substring(0, 10) + '...');
      
      const response = await fetch('http://localhost:3001/api/users/addresses', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${firebaseToken}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        console.log('Addresses fetched successfully:', data.addresses);
        setAddresses(data.addresses);
        
        // Check if we should highlight an address
        const savedAddressId = localStorage.getItem('selectedAddressId');
        if (savedAddressId) {
          // Only highlight if the address exists in the fetched addresses
          const addressExists = data.addresses.some(addr => addr.id === savedAddressId);
          if (addressExists) {
            setSelectedAddressId(savedAddressId);
          } else {
            // If the saved address ID doesn't exist in fetched addresses, clear it
            localStorage.removeItem('selectedAddressId');
            setSelectedAddressId(undefined);
          }
        } else {
          // No saved address ID, make sure nothing is highlighted
          setSelectedAddressId(undefined);
        }
      } else {
        console.error('Failed to fetch addresses:', data.message);
        toast({
          title: "Failed to load addresses",
          description: data.message || "There was an error loading your addresses.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
      toast({
        title: "Failed to load addresses",
        description: "There was an error loading your addresses. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoadingAddresses(false);
    }
  };

  const handleLocationClick = () => {
    // Fetch addresses when opening the sheet
    if (isAuthenticated && firebaseUser) {
      fetchAddresses();
    } else {
      // If not authenticated, ensure no address is highlighted
      setSelectedAddressId(undefined);
    }
    setIsAddressSheetOpen(true);
  };
  
  const handleAddressSelect = (address: Address) => {
    // Update selected address ID
    setSelectedAddressId(address.id);
    
    // Update order context with the selected address, pincode, and address ID
    updateOrder({
      deliveryAddress: address,
      deliveryPincode: address.pincode,
      selectedAddressId: address.id
    });
    
    // Save pincode and address ID to localStorage
    localStorage.setItem('userPincode', address.pincode);
    localStorage.setItem('selectedAddressId', address.id);
    
    // Close the address sheet
    setIsAddressSheetOpen(false);
    
    // Show success toast
    toast({
      title: "Address Selected",
      description: `Delivery location set to ${address.area}, ${address.pincode}`,
    });
  };
  


  return (
    <>
      <nav className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between h-16">
            {/* Logo & Back Button */}
            <div className="flex items-center">
              {/* Show back button on non-home pages */}
              {location.pathname !== '/' && (
                <button 
                  onClick={() => navigate(-1)} 
                  className="mr-2 p-2 rounded-full hover:bg-gray-100"
                  aria-label="Go back"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}
              
              {/* Logo/Brand */}
              <div 
                className="font-playfair text-xl font-medium text-plum cursor-pointer hover:text-plum/80 transition-colors"
                onClick={() => navigate('/')}
              >
                Stitch
              </div>
            </div>

            {/* Address & Profile */}
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={handleLocationClick}
                className="flex items-center gap-2"
              >
                {order.deliveryPincode ? (
                  <>
                    <MapPin className="h-4 w-4" />
                    <span>{order.deliveryPincode}</span>
                  </>
                ) : (
                  <>
                    <MapPinOff className="h-4 w-4" />
                    <span>Set Location</span>
                  </>
                )}
              </Button>
              
              {isAuthenticated ? (
                <div className="relative">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    ref={profileButtonRef}
                    onClick={() => {
                      // On mobile, open drawer; on desktop, toggle dropdown
                      if (window.innerWidth < 768) {
                        setIsProfileDrawerOpen(true);
                      } else {
                        setShowProfileMenu(!showProfileMenu);
                      }
                    }}
                    className="relative"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                  
                  {/* Profile dropdown menu (desktop only) */}
                  {showProfileMenu && (
                    <div 
                      ref={profileMenuRef}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200 hidden md:block"
                    >
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.phone}</p>
                      </div>
                      
                      <Link 
                        to="/profile" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <User className="h-4 w-4 mr-2" />
                        My Profile
                      </Link>
                      
                      <Link 
                        to="/orders" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        My Orders
                      </Link>
                      
                      <Link 
                        to="/addresses" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <MapPin className="h-4 w-4 mr-2" />
                        Saved Addresses
                      </Link>
                      
                      <Link 
                        to="/measurements" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <Ruler className="h-4 w-4 mr-2" />
                        Saved Measurements
                      </Link>
                      
                      <Link 
                        to="/wishlist" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <Heart className="h-4 w-4 mr-2" />
                        Wishlist
                      </Link>
                      
                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button 
                          onClick={() => {
                            setShowProfileMenu(false);
                            logout().then(success => {
                              if (success) navigate('/');
                            });
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Button 
                  variant="ghost" 
                  onClick={showLoginSheet}
                  className="flex items-center gap-1 text-sm"
                >
                  <LogIn className="h-4 w-4 mr-1" />
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Address Dialog */}
      <ResponsiveDialog 
        isOpen={isAddressSheetOpen} 
        onClose={() => setIsAddressSheetOpen(false)}
        title="Select Your Location"
        description="Choose from your saved addresses or enter a pincode to see available services in your area"
        position="bottom"
      >
        <div className="p-6">
          {isAuthenticated ? (
            <>
              {loadingAddresses ? (
                <div className="flex justify-center items-center py-4">
                  <Loader className="w-6 h-6 text-plum animate-spin" />
                  <span className="ml-2 text-sm text-gray-600">Loading addresses...</span>
                </div>
              ) : addresses && addresses.length > 0 ? (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-medium">Your Saved Addresses</h3>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-xs text-plum"
                      onClick={() => {
                        setIsAddressSheetOpen(false);
                        navigate('/addresses');
                      }}
                    >
                      Manage
                    </Button>
                  </div>
                  
                  {/* Horizontal scrollable container */}
                  <div className="relative">
                    <div className="overflow-x-auto pb-2 px-2 hide-scrollbar">
                      <div className="flex space-x-4 min-w-full py-1">
                        {addresses.map((address) => (
                          <div 
                            key={address.id} 
                            className={`rounded-lg border-2 p-3 relative cursor-pointer transition-all flex-shrink-0 w-[250px] max-w-[80vw] ${selectedAddressId === address.id ? 'bg-plum/5 border-plum shadow-md' : 'bg-white border-gray-200 shadow-sm hover:border-plum hover:shadow-md'}`}
                            onClick={() => handleAddressSelect(address)}
                          >
                            <div className="flex items-start">
                              <div className="w-8 h-8 rounded-full bg-plum/10 flex items-center justify-center text-plum mr-2 flex-shrink-0">
                                <MapPin className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center">
                                  <h3 className="font-medium text-gray-800 truncate mr-1">{address.fullName}</h3>
                                  {address.isDefault && (
                                    <span className="text-xs bg-plum/10 text-plum px-1.5 py-0.5 rounded-full flex-shrink-0 whitespace-nowrap">
                                      Default
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-500 mt-0.5 truncate">{address.phone}</p>
                                <div className="text-xs text-gray-600 mt-1.5 space-y-0.5">
                                  <p className="truncate">{address.doorNo}, {address.addressLine1}</p>
                                  <p className="truncate">{address.area}{address.landmark ? `, ${address.landmark}` : ''}</p>
                                </div>
                                <p className="text-sm font-medium text-plum mt-1.5">Pincode: {address.pincode}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Scroll indicators */}
                    <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
                    <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
                  </div>
                  
                  <div className="relative mt-6 mb-4">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Or use other options</span>
                    </div>
                  </div>
                </div>
              ) : !loadingAddresses ? (
                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Enter your location</span>
                  </div>
                </div>
              ) : null}
            </>
          ) : null}
          
          <AddressSelector 
            onSubmit={(pincode) => setIsAddressSheetOpen(false)}
            onAddressSelect={handleAddressSelect} 
          />
        </div>
      </ResponsiveDialog>
      
      {/* Profile Dialog */}
      <ResponsiveDialog 
        isOpen={isProfileDrawerOpen} 
        onClose={() => setIsProfileDrawerOpen(false)}
        title="My Account"
        position="right"
        className="p-0"
      >
        {isAuthenticated && user ? (
          <div className="flex flex-col h-full">
            {/* User info header */}
            <div className="bg-plum/10 p-6">
              <div className="flex items-center">
                <div className="w-14 h-14 bg-plum/20 rounded-full flex items-center justify-center text-plum mr-4">
                  <User className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">{user.name || 'User'}</h3>
                  <p className="text-gray-600 text-sm">+91 {user.phone}</p>
                  {user.email && <p className="text-gray-600 text-sm">{user.email}</p>}
                </div>
              </div>
              <Link 
                to="/profile" 
                className="mt-4 text-sm text-plum font-medium flex items-center"
                onClick={() => setIsProfileDrawerOpen(false)}
              >
                View Profile
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            
            {/* Menu items */}
            <div className="flex-1 overflow-auto">
              <div className="py-2">
                <Link 
                  to="/profile" 
                  className="flex items-center justify-between px-6 py-3.5 hover:bg-gray-50"
                  onClick={() => setIsProfileDrawerOpen(false)}
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mr-3">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-gray-800">My Profile</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>
                
                <Link 
                  to="/orders" 
                  className="flex items-center justify-between px-6 py-3.5 hover:bg-gray-50"
                  onClick={() => setIsProfileDrawerOpen(false)}
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center mr-3">
                      <ShoppingBag className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-gray-800">My Orders</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>
                
                <Link 
                  to="/addresses" 
                  className="flex items-center justify-between px-6 py-3.5 hover:bg-gray-50"
                  onClick={() => setIsProfileDrawerOpen(false)}
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center mr-3">
                      <MapPin className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="text-gray-800">Saved Addresses</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>
                
                <Link 
                  to="/measurements" 
                  className="flex items-center justify-between px-6 py-3.5 hover:bg-gray-50"
                  onClick={() => setIsProfileDrawerOpen(false)}
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center mr-3">
                      <Ruler className="w-4 h-4 text-amber-600" />
                    </div>
                    <span className="text-gray-800">Saved Measurements</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>
                
                <Link 
                  to="/wishlist" 
                  className="flex items-center justify-between px-6 py-3.5 hover:bg-gray-50"
                  onClick={() => setIsProfileDrawerOpen(false)}
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center mr-3">
                      <Heart className="w-4 h-4 text-red-600" />
                    </div>
                    <span className="text-gray-800">Wishlist</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>
              </div>
            </div>
            
            {/* Logout button */}
            <div className="border-t border-gray-200 p-6">
              <button 
                onClick={() => {
                  setIsProfileDrawerOpen(false);
                  logout().then(success => {
                    if (success) navigate('/');
                  });
                }}
                className="flex items-center text-red-600 font-medium"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 flex flex-col items-center justify-center h-full">
            <div className="w-20 h-20 bg-plum/10 rounded-full flex items-center justify-center text-plum mb-6">
              <User className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-medium mb-2">Login to Your Account</h3>
            <p className="text-gray-600 text-center mb-6">Sign in to access your profile, orders, and more</p>
            <button 
              onClick={() => {
                setIsProfileDrawerOpen(false);
                showLoginSheet();
              }}
              className="w-full py-3 px-4 bg-plum text-white rounded-lg font-medium flex items-center justify-center"
            >
              <LogIn className="w-5 h-5 mr-2" />
              Login / Register
            </button>
          </div>
        )}
      </ResponsiveDialog>
    </>
  );
};

export default TopNav;
