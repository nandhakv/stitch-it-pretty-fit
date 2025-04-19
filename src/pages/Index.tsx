
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../utils/OrderContext';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation } from 'lucide-react';
import AddressSelector from '../components/AddressSelector';

const Index: React.FC = () => {
  const [isAddressSheetOpen, setIsAddressSheetOpen] = useState(true);
  const { updateOrder } = useOrder();
  const navigate = useNavigate();

  const handleAddressSubmit = (pincode: string) => {
    updateOrder({ deliveryPincode: pincode });
    setIsAddressSheetOpen(false);
    navigate('/boutiques');
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6 text-plum">Welcome to Tailoring Services</h1>
        <p className="text-xl text-gray-600 mb-8">Find the best tailors near you</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Add some featured services or categories here */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Custom Designs</h3>
            <p>Create your perfect outfit with our expert tailors</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Alterations</h3>
            <p>Professional clothing alterations and repairs</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Boutique Selection</h3>
            <p>Choose from our curated list of premium boutiques</p>
          </div>
        </div>
      </div>

      {/* Address Sheet */}
      <Sheet open={isAddressSheetOpen} onOpenChange={setIsAddressSheetOpen}>
        <SheetContent side="bottom" className="h-[90vh]">
          <SheetHeader>
            <SheetTitle>Select Your Location</SheetTitle>
            <SheetDescription>
              Help us find the best tailoring services near you
            </SheetDescription>
          </SheetHeader>
          <AddressSelector onSubmit={handleAddressSubmit} />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Index;
