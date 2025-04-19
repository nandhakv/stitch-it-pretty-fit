
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Navigation } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";

interface AddressSelectorProps {
  onSubmit: (pincode: string) => void;
}

const AddressSelector: React.FC<AddressSelectorProps> = ({ onSubmit }) => {
  const [pincode, setPincode] = useState('');
  const [isLocating, setIsLocating] = useState(false);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length !== 6) {
      toast({
        title: "Invalid Pincode",
        description: "Please enter a valid 6-digit pincode",
        variant: "destructive"
      });
      return;
    }
    onSubmit(pincode);
  };

  const getCurrentLocation = () => {
    setIsLocating(true);
    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "Geolocation is not supported by your browser",
        variant: "destructive"
      });
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          // Here you would typically make an API call to convert coordinates to pincode
          // For demo purposes, we'll just use a mock pincode
          const mockPincode = "400001";
          setPincode(mockPincode);
          onSubmit(mockPincode);
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

  return (
    <div className="space-y-6 mt-6">
      <Button 
        onClick={getCurrentLocation} 
        variant="outline" 
        className="w-full flex items-center justify-center gap-2"
        disabled={isLocating}
      >
        <Navigation className="w-4 h-4" />
        {isLocating ? "Detecting Location..." : "Use Current Location"}
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or enter pincode</span>
        </div>
      </div>

      <form onSubmit={handleManualSubmit} className="space-y-4">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Enter Pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            className="flex-1"
            maxLength={6}
          />
          <Button type="submit" disabled={pincode.length !== 6}>
            <MapPin className="w-4 h-4 mr-2" />
            Confirm
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddressSelector;
