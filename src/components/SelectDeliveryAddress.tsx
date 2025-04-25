import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Plus, 
  Check,
  Home,
  Building,
  Briefcase,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../utils/AuthContext';
import { Address } from '../utils/types';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface SelectDeliveryAddressProps {
  selectedAddress?: Address | null;
  onAddressSelect: (address: Address) => void;
}

const SelectDeliveryAddress: React.FC<SelectDeliveryAddressProps> = ({ 
  selectedAddress,
  onAddressSelect
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  // Load addresses from user data
  useEffect(() => {
    if (user && user.addresses) {
      setAddresses(user.addresses);
      
      // If there's a default address and no address is selected, select the default
      if (!selectedAddress) {
        const defaultAddress = user.addresses.find(addr => addr.isDefault);
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress.id);
          onAddressSelect(defaultAddress);
        } else if (user.addresses.length > 0) {
          // If no default, select the first address
          setSelectedAddressId(user.addresses[0].id);
          onAddressSelect(user.addresses[0]);
        }
      } else {
        setSelectedAddressId(selectedAddress.id);
      }
    }
  }, [user, selectedAddress, onAddressSelect]);

  const handleAddressSelect = (addressId: string) => {
    const address = addresses.find(addr => addr.id === addressId);
    if (address) {
      setSelectedAddressId(addressId);
      onAddressSelect(address);
    }
  };

  const getAddressTypeIcon = (type: string = 'home') => {
    switch (type.toLowerCase()) {
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
    switch (type.toLowerCase()) {
      case 'work':
        return 'bg-green-50 text-green-600';
      case 'office':
        return 'bg-purple-50 text-purple-600';
      case 'home':
      default:
        return 'bg-blue-50 text-blue-600';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Delivery Address</h2>
        <Button 
          variant="ghost" 
          className="text-plum hover:text-plum/80 p-0 h-auto"
          onClick={() => navigate('/addresses')}
        >
          Manage
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      {addresses.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <div className="w-16 h-16 bg-plum/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="h-8 w-8 text-plum" />
          </div>
          <h3 className="text-base font-medium mb-2">No Addresses Found</h3>
          <p className="text-gray-500 mb-4 text-sm">
            You haven't added any addresses yet. Add an address to continue.
          </p>
          <Button 
            onClick={() => navigate('/addresses')}
            className="bg-plum hover:bg-plum/90 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Address
          </Button>
        </div>
      ) : (
        <RadioGroup 
          value={selectedAddressId || ''} 
          onValueChange={handleAddressSelect}
          className="space-y-3"
        >
          {addresses.map((address) => (
            <div 
              key={address.id} 
              className={`bg-white rounded-lg shadow-sm border p-4 relative ${
                selectedAddressId === address.id ? 'border-plum' : 'border-gray-100'
              }`}
            >
              <RadioGroupItem 
                value={address.id} 
                id={address.id} 
                className="absolute top-4 right-4 text-plum"
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
      )}
    </div>
  );
};

export default SelectDeliveryAddress;
