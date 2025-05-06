import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Address } from '../utils/types';
import SelectDeliveryAddress from '../components/SelectDeliveryAddress';
import { useAuth } from '../utils/AuthContext';
import { useOrder } from '../utils/OrderContext';
import { toast } from '@/components/ui/use-toast';

const DeliveryAddressPage: React.FC = () => {
  const navigate = useNavigate();
  const { boutiqueId, serviceId } = useParams<{ boutiqueId: string; serviceId: string }>();
  const { user } = useAuth();
  const { order, updateOrder } = useOrder();
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(order.deliveryAddress || null);

  const handleAddressSelect = (address: Address) => {
    setSelectedAddress(address);
  };

  // Update order with selected address when it changes
  useEffect(() => {
    if (selectedAddress) {
      updateOrder({
        deliveryAddress: selectedAddress,
        deliveryPincode: selectedAddress.pincode
      });
    }
  }, [selectedAddress, updateOrder]);

  const handleContinue = () => {
    if (!selectedAddress) {
      toast({
        title: "No address selected",
        description: "Please select a delivery address to continue",
        variant: "destructive"
      });
      return;
    }

    // Save the selected address and pincode to the order context
    updateOrder({
      deliveryAddress: selectedAddress,
      deliveryPincode: selectedAddress.pincode
    });

    // Navigate to order summary page
    navigate('/order-summary');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-plum/5 to-white pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-lg font-semibold">Select Delivery Address</h1>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <p className="text-gray-700 mb-4">
            Please select an address where you'd like your measurements to be taken. Our tailoring expert will visit this location on the scheduled date.
          </p>
          
          <SelectDeliveryAddress
            selectedAddress={selectedAddress}
            onAddressSelect={handleAddressSelect}
          />
        </div>
        
        {/* Continue Button */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:static md:bg-transparent md:border-0 md:p-0 md:mt-6">
          <div className="container mx-auto max-w-3xl">
            <Button 
              className="w-full bg-plum hover:bg-plum/90 text-white py-6 rounded-lg shadow-md"
              onClick={handleContinue}
              disabled={!selectedAddress}
            >
              Continue
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryAddressPage;
