import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  MapPin, 
  Edit, 
  Trash2, 
  Check,
  Home,
  Building,
  Briefcase
} from 'lucide-react';
import { useAuth } from '../utils/AuthContext';
import { Address } from '../utils/types';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import AddressForm from '../components/AddressForm';
import PageLoader from '../components/PageLoader';
import { toast } from '@/components/ui/use-toast';

const AddressesPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, firebaseUser, isLoading: isAuthLoading, showLoginSheet, updateUserProfile } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<Address | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);

  // The PrivateRoute component now handles authentication redirects

  // Load addresses from API
  useEffect(() => {
    const fetchAddresses = async () => {
      if (!firebaseUser) return;
      
      try {
        setIsDataLoading(true);
        const firebaseToken = await firebaseUser.getIdToken();
        
        // Log for debugging
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
          setAddresses(data.addresses);
        } else {
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
        setIsDataLoading(false);
      }
    };
    
    fetchAddresses();
  }, [firebaseUser]);



  const handleAddAddress = async (address: Address) => {
    setIsLoading(true);
    
    try {
      if (!firebaseUser) return;
      const firebaseToken = await firebaseUser.getIdToken();
      
      const response = await fetch('http://localhost:3001/api/users/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${firebaseToken}`
        },
        body: JSON.stringify(address)
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Refresh the address list
        const listResponse = await fetch('http://localhost:3001/api/users/addresses', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${firebaseToken}`
          }
        });
        
        const listData = await listResponse.json();
        
        if (listData.success) {
          setAddresses(listData.addresses);
        }
        
        setIsAddDialogOpen(false);
        toast({
          title: "Address added",
          description: "Your address has been added successfully.",
        });
      } else {
        toast({
          title: "Failed to add address",
          description: data.message || "There was an error adding your address. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error adding address:', error);
      toast({
        title: "Failed to add address",
        description: "There was an error adding your address. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditAddress = async (updatedAddress: Address) => {
    if (!currentAddress) return;
    setIsLoading(true);
    
    try {
      if (!firebaseUser) return;
      const firebaseToken = await firebaseUser.getIdToken();
      
      const response = await fetch(`http://localhost:3001/api/users/addresses/${currentAddress.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${firebaseToken}`
        },
        body: JSON.stringify(updatedAddress)
      });
      
      const data = await response.json();
      
      if (data.success) {
        // If this address is marked as default, make it default using the API
        if (updatedAddress.isDefault && !currentAddress.isDefault) {
          await fetch(`http://localhost:3001/api/users/addresses/${updatedAddress.id}/default`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${firebaseToken}`
            }
          });
        }
        
        // Refresh the address list
        const listResponse = await fetch('http://localhost:3001/api/users/addresses', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${firebaseToken}`
          }
        });
        
        const listData = await listResponse.json();
        
        if (listData.success) {
          setAddresses(listData.addresses);
        }
        
        setIsEditDialogOpen(false);
        setCurrentAddress(null);
        toast({
          title: "Address updated",
          description: "Your address has been updated successfully.",
        });
      } else {
        toast({
          title: "Failed to update address",
          description: data.message || "There was an error updating your address. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error updating address:', error);
      toast({
        title: "Failed to update address",
        description: "There was an error updating your address. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAddress = async () => {
    if (!currentAddress) return;
    
    setIsLoading(true);
    
    try {
      if (!firebaseUser) return;
      const firebaseToken = await firebaseUser.getIdToken();
      
      const response = await fetch(`http://localhost:3001/api/users/addresses/${currentAddress.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${firebaseToken}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        // If the deleted address was the default and there are other addresses,
        // make another address the default
        if (currentAddress.isDefault && addresses.length > 1) {
          const nextDefaultAddress = addresses.find(addr => addr.id !== currentAddress.id);
          if (nextDefaultAddress) {
            await fetch(`http://localhost:3001/api/users/addresses/${nextDefaultAddress.id}/default`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${firebaseToken}`
              }
            });
          }
        }
        
        // Refresh the address list
        const listResponse = await fetch('http://localhost:3001/api/users/addresses', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${firebaseToken}`
          }
        });
        
        const listData = await listResponse.json();
        
        if (listData.success) {
          setAddresses(listData.addresses);
        }
        
        setIsDeleteDialogOpen(false);
        setCurrentAddress(null);
        toast({
          title: "Address deleted",
          description: "Your address has been deleted successfully.",
        });
      } else {
        toast({
          title: "Failed to delete address",
          description: data.message || "There was an error deleting your address. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      toast({
        title: "Failed to delete address",
        description: "There was an error deleting your address. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetDefault = async (address: Address) => {
    if (address.isDefault) return;
    
    setIsLoading(true);
    
    try {
      if (!firebaseUser) return;
      const firebaseToken = await firebaseUser.getIdToken();
      
      const response = await fetch(`http://localhost:3001/api/users/addresses/${address.id}/default`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${firebaseToken}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Refresh the address list
        const listResponse = await fetch('http://localhost:3001/api/users/addresses', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${firebaseToken}`
          }
        });
        
        const listData = await listResponse.json();
        
        if (listData.success) {
          setAddresses(listData.addresses);
        }
        
        toast({
          title: "Default address updated",
          description: "Your default address has been updated successfully.",
        });
      } else {
        toast({
          title: "Failed to update default address",
          description: data.message || "There was an error updating your default address. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error updating default address:', error);
      toast({
        title: "Failed to update default address",
        description: "There was an error updating your default address. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getAddressTypeIcon = (type: string = 'home') => {
    switch (type.toLowerCase()) {
      case 'work':
        return <Briefcase className="h-4 w-4" />;
      case 'office':
        return <Building className="h-4 w-4" />;
      case 'home':
      default:
        return <Home className="h-4 w-4" />;
    }
  };

  // The PrivateRoute component now handles authentication loading and redirects

  return (
    <div className="min-h-screen bg-gradient-to-b from-plum/5 to-white pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm py-4 px-4">
        <h1 className="text-lg font-semibold">Saved Addresses</h1>
      </div>
      
      {/* Loading state */}
      {isDataLoading && (
        <PageLoader message="Loading your addresses..." />
      )}
      
      {/* Content */}
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        {/* Add Address Button */}
        <Button 
          className="w-full flex items-center justify-center gap-2 mb-8 bg-plum hover:bg-plum/90 text-white py-6 rounded-lg shadow-md"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <Plus className="h-5 w-5" />
          Add New Address
        </Button>

        {/* Address List */}
        {!isDataLoading && addresses.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-10 text-center">
            <div className="w-24 h-24 bg-plum/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <MapPin className="h-12 w-12 text-plum" />
            </div>
            <h3 className="text-xl font-medium mb-3">No Addresses Found</h3>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">
              You haven't added any addresses yet. Add an address to make checkout easier and faster.
            </p>
            <Button 
              variant="outline" 
              className="mx-auto border-plum text-plum hover:bg-plum/10 py-6 px-6"
              onClick={() => setIsAddDialogOpen(true)}
            >
              <Plus className="h-5 w-5 mr-2" />
              Add New Address
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {addresses.map((address, index) => (
              <div 
                key={index} 
                className={`bg-white rounded-lg shadow-md p-5 relative ${
                  address.isDefault ? 'border-2 border-plum' : 'border border-gray-100'
                }`}
              >
                {address.isDefault && (
                  <div className="absolute top-3 right-3 bg-plum text-white text-xs px-3 py-1 rounded-full flex items-center shadow-sm">
                    <Check className="h-3 w-3 mr-1" />
                    Default
                  </div>
                )}
                
                <div className="flex items-start mb-4">
                  <div className="w-10 h-10 rounded-full bg-plum/10 flex items-center justify-center text-plum mr-3 flex-shrink-0">
                    {getAddressTypeIcon(address.type)}
                  </div>
                  <div>
                    <div className="flex items-center">
                      <h3 className="font-medium text-gray-800">{address.fullName}</h3>
                      {address.type && (
                        <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${address.type === 'home' ? 'bg-blue-50 text-blue-600' : address.type === 'work' ? 'bg-green-50 text-green-600' : 'bg-purple-50 text-purple-600'}`}>
                          {address.type}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-0.5">{address.phone}</p>
                  </div>
                </div>
                
                <div className="text-sm text-gray-700 mb-5 pl-[3.25rem] space-y-1">
                  <p>{address.doorNo}, {address.addressLine1}</p>
                  <p>{address.area}{address.landmark ? `, ${address.landmark}` : ''}</p>
                  <p>Pincode: {address.pincode}</p>
                </div>
                
                <div className="flex items-center justify-between border-t border-gray-100 pt-4 pl-[3.25rem]">
                  <div className="flex gap-4">
                    <button 
                      className="text-sm text-gray-600 flex items-center hover:text-plum transition-colors py-1"
                      onClick={() => {
                        setCurrentAddress(address);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-1.5" />
                      Edit
                    </button>
                    <button 
                      className="text-sm text-red-600 flex items-center hover:text-red-700 transition-colors py-1"
                      onClick={() => {
                        setCurrentAddress(address);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-1.5" />
                      Delete
                    </button>
                  </div>
                  
                  {!address.isDefault && (
                    <button 
                      className="text-sm text-plum flex items-center hover:bg-plum/5 px-3 py-1.5 rounded-full transition-colors"
                      onClick={() => handleSetDefault(address)}
                      disabled={isLoading}
                    >
                      <Check className="h-4 w-4 mr-1.5" />
                      Set as Default
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Address Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="bg-plum/10 p-4 border-b border-gray-100">
            <DialogTitle className="text-gray-800">Add New Address</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <AddressForm 
              onSubmit={handleAddAddress} 
              isLoading={isLoading}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Address Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="bg-plum/10 p-4 border-b border-gray-100">
            <DialogTitle className="text-gray-800">Edit Address</DialogTitle>
          </DialogHeader>
          {currentAddress && (
            <div className="p-4">
              <AddressForm 
                initialData={currentAddress}
                onSubmit={handleEditAddress} 
                isLoading={isLoading}
                onCancel={() => {
                  setIsEditDialogOpen(false);
                  setCurrentAddress(null);
                }}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px] p-0">
          <DialogHeader className="bg-red-50 p-4 border-b border-red-100">
            <DialogTitle className="text-red-700 flex items-center">
              <Trash2 className="h-5 w-5 mr-2 text-red-500" />
              Delete Address
            </DialogTitle>
          </DialogHeader>
          <div className="p-6">
            <p className="font-medium">Are you sure you want to delete this address?</p>
            <p className="text-sm text-gray-500 mt-2">This action cannot be undone.</p>
          </div>
          <DialogFooter className="p-4 bg-gray-50 border-t border-gray-100">
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isLoading}
              className="border-gray-300"
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteAddress}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddressesPage;
