import React from 'react';
import { X, MapPin, Home, Briefcase, Loader, Plus, Navigation, Check } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/components/ui/use-toast';
import { Address } from '../utils/types';
import { useNavigate } from 'react-router-dom';

interface AddressSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAddress: (address: Address) => void;
  addresses: Address[];
  selectedAddressId?: string;
  loadingAddresses: boolean;
  isAuthenticated: boolean;
  title: string;
  placeholderText: string;
  onManualPincodeSubmit: (pincode: string) => void;
}

const AddressSheet: React.FC<AddressSheetProps> = ({
  isOpen,
  onClose,
  onSelectAddress,
  addresses,
  selectedAddressId,
  loadingAddresses,
  isAuthenticated,
  title,
  placeholderText,
  onManualPincodeSubmit
}) => {
  const navigate = useNavigate();
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white w-full sm:w-[480px] sm:rounded-t-xl sm:rounded-xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-plum/90 to-plum text-white">
          <h3 className="text-lg font-medium">{title}</h3>
          <button 
            className="p-1 rounded-full hover:bg-white/10 transition-colors" 
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          {loadingAddresses ? (
            <div className="flex flex-col justify-center items-center py-16">
              <Loader className="w-8 h-8 text-plum animate-spin mb-3" />
              <span className="text-gray-600 font-medium">Loading addresses...</span>
            </div>
          ) : isAuthenticated ? (
            <>
              {addresses.length > 0 ? (
                <RadioGroup defaultValue={selectedAddressId}>
                  <div className="space-y-4">
                    {addresses.map((address) => (
                      <div 
                        key={address.id} 
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all shadow-sm hover:shadow ${selectedAddressId === address.id ? 'border-plum bg-plum/5 shadow' : 'border-gray-100 hover:border-plum/30'}`}
                        onClick={() => onSelectAddress(address)}
                      >
                        <div className="flex items-start">
                          <div className="mr-3 mt-0.5">
                            {selectedAddressId === address.id ? (
                              <div className="w-5 h-5 rounded-full bg-plum flex items-center justify-center text-white">
                                <Check className="w-3 h-3" />
                              </div>
                            ) : (
                              <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center mb-1">
                              <span className="font-medium text-gray-900">{address.fullName}</span>
                              {address.isDefault && (
                                <span className="ml-2 text-xs bg-plum/10 text-plum px-2 py-0.5 rounded-full font-medium">Default</span>
                              )}
                              {address.type === 'home' && <Home className="ml-auto w-4 h-4 text-plum" />}
                              {address.type === 'work' && <Briefcase className="ml-auto w-4 h-4 text-plum" />}
                              {address.type === 'other' && <MapPin className="ml-auto w-4 h-4 text-plum" />}
                            </div>
                            <div className="text-sm text-gray-700">
                              {address.addressLine1}
                            </div>
                            <div className="text-sm text-gray-700">
                              {address.area}, {address.pincode}
                            </div>
                            <div className="text-sm text-gray-700 mt-1 font-medium">
                              {address.phone}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              ) : (
                <div className="text-center py-10">
                  <div className="w-16 h-16 rounded-full bg-plum/10 flex items-center justify-center mx-auto mb-4">
                    <MapPin className="h-8 w-8 text-plum" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No addresses found</h3>
                  <p className="text-gray-600 mb-6 max-w-xs mx-auto">You don't have any saved addresses yet. Add a new address to continue.</p>
                  <button 
                    className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-plum rounded-md hover:bg-plum/90 shadow-sm transition-all hover:shadow"
                    onClick={() => navigate('/addresses')}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add New Address
                  </button>
                </div>
              )}
              
              <div className="border-t border-gray-100 mt-6 pt-6">
                <button 
                  className="w-full flex items-center justify-center px-5 py-3 text-sm font-medium text-plum border-2 border-plum/20 rounded-lg hover:bg-plum/5 hover:border-plum/30 transition-all"
                  onClick={() => navigate('/addresses')}
                >
                  <Plus className="mr-2 h-4 w-4" /> Add New Address
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-plum/10 flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-plum" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">{placeholderText}</h3>
                <p className="text-gray-600 mb-6 max-w-xs mx-auto">Please enter your pincode to check service availability in your area.</p>
                
                <form className="max-w-xs mx-auto" onSubmit={(e) => {
                  e.preventDefault();
                  const input = e.currentTarget.querySelector('input');
                  if (input && input.value.length === 6) {
                    onManualPincodeSubmit(input.value);
                  }
                }}>
                  <div className="flex shadow-sm">
                    <input 
                      type="text" 
                      pattern="[0-9]*" 
                      inputMode="numeric" 
                      maxLength={6}
                      className="flex-1 px-4 py-3 border-2 border-gray-100 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-plum/30 focus:border-plum/30 text-lg" 
                      placeholder="Enter 6-digit pincode"
                    />
                    <button 
                      type="submit" 
                      className="bg-plum text-white px-6 py-3 rounded-r-lg hover:bg-plum/90 font-medium transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                </form>
              </div>
              
              <div className="text-center mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-100"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white px-4 text-sm text-gray-500 font-medium">OR</span>
                  </div>
                </div>
                
                <button 
                  className="mt-6 inline-flex items-center justify-center px-5 py-3 text-sm font-medium text-plum border-2 border-plum/20 rounded-lg hover:bg-plum/5 hover:border-plum/30 transition-all w-full max-w-xs"
                  onClick={() => {
                    // Get current location logic would go here
                    toast({
                      title: "Getting your location",
                      description: "Please allow location access when prompted."
                    });
                  }}
                >
                  <Navigation className="mr-2 h-4 w-4" /> Use current location
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddressSheet;
