
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Navigation, Home, Building, Briefcase, Check, Loader } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import { useOrder } from '../utils/OrderContext';
import { useAuth } from '../utils/AuthContext';
import { Address } from '../utils/types';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface AddressSelectorProps {
  onSubmit: (pincode: string) => void;
  onAddressSelect?: (address: Address) => void;
}

const AddressSelector: React.FC<AddressSelectorProps> = ({ onSubmit, onAddressSelect }) => {
  const { updateOrder } = useOrder();
  const { user, isAuthenticated } = useAuth();
  const [pincode, setPincode] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  
  // Debug logging to help diagnose the issue
  useEffect(() => {
    console.log('Auth status:', isAuthenticated);
    console.log('User object:', user);
    console.log('User addresses:', user?.addresses);
  }, [isAuthenticated, user]);

  // Load saved pincode and set default address if available
  useEffect(() => {
    const savedPincode = localStorage.getItem('userPincode');
    if (savedPincode) {
      setPincode(savedPincode);
    }
    
    // If user has addresses, try to find the default one or use the first one
    if (user?.addresses && user.addresses.length > 0) {
      console.log('Setting up addresses from user data:', user.addresses);
      const defaultAddress = user.addresses.find(addr => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
      } else {
        setSelectedAddressId(user.addresses[0].id);
      }
    }
  }, [user]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length === 6) {
      // Save to localStorage
      localStorage.setItem('userPincode', pincode);
      
      // Clear any selected address ID when manually entering a pincode
      localStorage.removeItem('selectedAddressId');
      setSelectedAddressId(null); // Reset the selected address in this component
      
      // Update order context
      updateOrder({ 
        deliveryPincode: pincode,
        selectedAddressId: undefined,  // Clear any selected address ID
        deliveryAddress: undefined     // Also clear any saved address object
      });
      
      // Call the onSubmit callback if provided
      if (onSubmit) {
        onSubmit(pincode);
      }
      
      toast({
        title: "Pincode Updated",
        description: `Your delivery location has been set to pincode ${pincode}`,
      });
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation Error",
        description: "Geolocation is not supported by your browser.",
        variant: "destructive"
      });
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Print latitude and longitude to console
          console.log('Latitude:', latitude);
          console.log('Longitude:', longitude);
          
          // Use OpenStreetMap Nominatim API to get address details
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            {
              headers: {
                'User-Agent': 'StitchItPrettyFit/1.0'
              }
            }
          );
          
          if (!response.ok) {
            throw new Error('Failed to fetch location data');
          }
          
          const data = await response.json();
          console.log('Location data:', data);
          
          // Extract postal code (pincode)
          let extractedPincode = '';
          
          if (data.address && data.address.postcode) {
            extractedPincode = data.address.postcode;
            // In India, remove any spaces from the pincode
            extractedPincode = extractedPincode.replace(/\s/g, '');
            
            // Ensure it's a 6-digit code for India
            if (/^\d{6}$/.test(extractedPincode)) {
              setPincode(extractedPincode);
              
              // Clear any selected address ID when using geolocation
              localStorage.removeItem('selectedAddressId');
              setSelectedAddressId(null); // Reset the selected address in this component
              
              // Update order context
              updateOrder({ 
                deliveryPincode: extractedPincode,
                selectedAddressId: undefined,  // Clear any selected address ID
                deliveryAddress: undefined     // Also clear any saved address object
              });
              
              // Submit the form with the extracted pincode
              if (onSubmit) {
                onSubmit(extractedPincode);
              }
              
              toast({
                title: "Location Detected",
                description: `Your pincode is ${extractedPincode}`,
              });
            } else {
              throw new Error('Invalid pincode format');
            }
          } else {
            throw new Error('Pincode not found in the response');
          }
        } catch (error) {
          toast({
            title: "Error",
            description: "Could not determine your location",
            variant: "destructive"
          });
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        toast({
          title: "Error",
          description: "Could not access your location",
          variant: "destructive"
        });
        setIsLocating(false);
      }
    );
  };

  const convertCoordinatesToPincode = async (latitude: number, longitude: number): Promise<string> => {
    try {
      // Using OpenCage Geocoding API (free tier available)
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=YOUR_API_KEY&countrycode=in`
      );
      
      if (!response.ok) {
        throw new Error('Geocoding API request failed');
      }
      
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        // Extract postal code from results
        const postalCode = data.results[0].components.postcode;
        if (postalCode) {
          return postalCode;
        }
      }
      
      throw new Error('Could not find postal code in the response');
    } catch (error) {
      console.error('Error converting coordinates to pincode:', error);
      // Fallback to a default pincode for demo purposes
      return '400001';
    }
  };

  const getAddressTypeIcon = (type: string = 'home') => {
    switch (type?.toLowerCase()) {
      case 'work':
        return <Building className="h-4 w-4" />;
      case 'office':
        return <Briefcase className="h-4 w-4" />;
      case 'home':
      default:
        return <Home className="h-4 w-4" />;
    }
  };

  const getAddressTypeColor = (type: string = 'home') => {
    switch (type?.toLowerCase()) {
      case 'work':
        return 'bg-green-50 text-green-600';
      case 'office':
        return 'bg-purple-50 text-purple-600';
      case 'home':
      default:
        return 'bg-blue-50 text-blue-600';
    }
  };

  const handleAddressSelect = (addressId: string) => {
    if (!user?.addresses) return;
    
    const address = user.addresses.find(addr => addr.id === addressId);
    if (address) {
      setSelectedAddressId(addressId);
      setPincode(address.pincode);
      
      // Save to localStorage
      localStorage.setItem('userPincode', address.pincode);
      
      // Update order context
      updateOrder({ 
        deliveryPincode: address.pincode,
        deliveryAddress: address
      });
      
      // Call the onSubmit callback
      onSubmit(address.pincode);
      
      // Call the onAddressSelect callback if provided
      if (onAddressSelect) {
        onAddressSelect(address);
      }
    }
  };

  // Check if user has addresses - force evaluation for debugging
  const hasAddresses = user?.addresses && user.addresses.length > 0;
  console.log('Has addresses evaluation:', hasAddresses, user?.addresses);
  
  return (
    <div className="space-y-6">
      {/* Saved Addresses Section - Always shown first if available */}
      {user && user.addresses && user.addresses.length > 0 ? (
        <div className="mb-4">
          <h3 className="text-base font-medium mb-3">Your Saved Addresses</h3>
          <RadioGroup 
            value={selectedAddressId || ''} 
            onValueChange={handleAddressSelect}
            className="space-y-3"
          >
            {user.addresses.map((address) => (
              <div 
                key={address.id} 
                className={`bg-white rounded-lg border p-3 relative ${selectedAddressId === address.id ? 'border-plum' : 'border-gray-100'}`}
              >
                <RadioGroupItem 
                  value={address.id} 
                  id={address.id} 
                  className="absolute top-3 right-3 text-plum"
                />
                
                <div className="flex items-start pr-8">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${getAddressTypeColor(address.type)}`}>
                    {getAddressTypeIcon(address.type)}
                  </div>
                  <div>
                    <div className="flex items-center">
                      <h3 className="font-medium text-gray-800">{address.fullName}</h3>
                      {address.type && (
                        <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${getAddressTypeColor(address.type)}`}>
                          {address.type}
                        </span>
                      )}
                      {address.isDefault && (
                        <span className="ml-2 text-xs bg-plum/10 text-plum px-2 py-0.5 rounded-full flex items-center">
                          <Check className="h-3 w-3 mr-1" />
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-0.5">{address.phone}</p>
                    <div className="text-sm text-gray-700 mt-2 space-y-0.5">
                      <p>{address.doorNo}, {address.addressLine1}</p>
                      <p>{address.area}{address.landmark ? `, ${address.landmark}` : ''}</p>
                      <p>Pincode: {address.pincode}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </RadioGroup>
          
          {/* Divider */}
          <div className="relative mt-6 mb-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or use other options</span>
            </div>
          </div>
        </div>
      ) : null}
      
      {/* Combined Location Input */}
      <form onSubmit={handleManualSubmit} className="mt-2">
        <div className="relative">
          <Input
            type="text"
            placeholder="Enter Pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            className="pr-[120px] pl-10"
            maxLength={6}
          />
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          
          {/* Current Location Button */}
          <Button 
            type="button"
            onClick={getCurrentLocation} 
            variant="outline" 
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 text-xs font-normal border-plum text-plum hover:bg-plum/10"
            disabled={isLocating}
          >
            {isLocating ? (
              <>
                <Loader className="w-3 h-3 animate-spin mr-1" />
                Locating...
              </>
            ) : (
              <>
                <Navigation className="w-3 h-3 mr-1" />
                Locate me
              </>
            )}
          </Button>
        </div>
        
        <Button 
          type="submit" 
          disabled={pincode.length !== 6}
          className="w-full mt-3 bg-plum hover:bg-plum/90"
        >
          Confirm Location
        </Button>
      </form>
    </div>
  );
};

export default AddressSelector;
