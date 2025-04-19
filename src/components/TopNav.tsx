
import React, { useState } from 'react';
import { User, MapPin, MapPinOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOrder } from '../utils/OrderContext';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import AddressSelector from './AddressSelector';

const TopNav = () => {
  const { order } = useOrder();
  const [isAddressSheetOpen, setIsAddressSheetOpen] = useState(false);

  const handleLocationClick = () => {
    setIsAddressSheetOpen(true);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-white border-b border-border/40 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center">
          <div className="flex flex-1 items-center justify-between">
            {/* Logo/Brand */}
            <div className="font-playfair text-xl font-medium text-plum">Stitch</div>

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
              
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <Sheet open={isAddressSheetOpen} onOpenChange={setIsAddressSheetOpen}>
        <SheetContent side="bottom" className="h-[90vh]">
          <SheetHeader>
            <SheetTitle>Select Your Location</SheetTitle>
            <SheetDescription>
              Help us find the best tailoring services near you
            </SheetDescription>
          </SheetHeader>
          <AddressSelector onSubmit={(pincode) => {
            setIsAddressSheetOpen(false);
          }} />
        </SheetContent>
      </Sheet>
    </>
  );
};

export default TopNav;
