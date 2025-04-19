
import React from 'react';
import { User } from 'lucide-react';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOrder } from '../utils/OrderContext';

const TopNav = () => {
  const { order } = useOrder();

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-border/40 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="flex flex-1 items-center justify-between">
          {/* Logo/Brand */}
          <div className="font-playfair text-xl font-medium text-plum">Stitch</div>

          {/* Address & Profile */}
          <div className="flex items-center gap-4">
            {order.deliveryPincode && (
              <Button variant="ghost" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{order.deliveryPincode}</span>
              </Button>
            )}
            
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNav;
