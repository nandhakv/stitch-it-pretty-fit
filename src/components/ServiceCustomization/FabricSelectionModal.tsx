import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Sparkles, CheckCircle2, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { ApiService } from '@/pages/BoutiqueDetailPage';

// Define fabric options - same as in MaterialSelectionModal
const fabricOptions = [
  { 
    id: "silk", 
    name: "Pure Silk", 
    color: "Off-white",
    material: "100% Pure Silk",
    price: 2500, 
    image: "/images/fabrics/silk.jpg" 
  },
  { 
    id: "cotton", 
    name: "Cotton", 
    color: "White",
    material: "100% Organic Cotton",
    price: 1000, 
    image: "/images/fabrics/cotton.jpg" 
  },
  { 
    id: "georgette", 
    name: "Georgette", 
    color: "Cream",
    material: "Polyester Georgette",
    price: 1500, 
    image: "/images/fabrics/georgette.jpg" 
  },
  { 
    id: "chiffon", 
    name: "Chiffon", 
    color: "Light Beige",
    material: "Polyester Chiffon",
    price: 1200, 
    image: "/images/fabrics/chiffon.jpg" 
  },
  { 
    id: "crepe", 
    name: "Crepe", 
    color: "Ivory",
    material: "Polyester Crepe",
    price: 1800, 
    image: "/images/fabrics/crepe.jpg" 
  },
  { 
    id: "satin", 
    name: "Satin", 
    color: "Pearl White",
    material: "Polyester Satin",
    price: 1600, 
    image: "/images/fabrics/satin.jpg" 
  }
];

export interface FabricSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: ApiService | null;
  designType: 'predesigned' | 'custom' | null;
  onComplete: (fabric: typeof fabricOptions[0]) => void;
}

const FabricSelectionModal: React.FC<FabricSelectionModalProps> = ({
  isOpen,
  onClose,
  service,
  designType,
  onComplete
}) => {
  const [selectedFabric, setSelectedFabric] = useState<typeof fabricOptions[0] | null>(null);
  
  // Reset selection when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedFabric(null);
    }
  }, [isOpen]);

  if (!service) return null;

  const handleContinue = () => {
    if (!selectedFabric) return;
    onComplete(selectedFabric);
  };

  const renderContent = () => (
    <>
      <div className="max-h-[calc(90vh-8rem)] overflow-y-auto px-1 pb-2 -mx-1">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Select Your Fabric</h3>
        <p className="text-sm text-gray-600 mb-4">
          Choose the fabric you'd like to use for your {designType === 'predesigned' ? 'pre-designed' : 'custom'} {service.name}.
        </p>
        
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {fabricOptions.map(fabric => (
              <div key={fabric.id} className="relative">
                <button
                  className={`w-full flex flex-row sm:flex-col items-start sm:items-center rounded-md border-2 p-3 transition-colors ${
                    selectedFabric?.id === fabric.id 
                      ? 'border-plum bg-plum/5' 
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    setSelectedFabric(fabric);
                    // Single handler to prevent state fluctuation
                  }}
                >
                  <div className="h-16 w-16 sm:h-auto sm:w-full aspect-square flex-shrink-0 mb-0 sm:mb-2 mr-3 sm:mr-0 rounded-md overflow-hidden bg-gray-100">
                    {fabric.image ? (
                      <img src={fabric.image} alt={fabric.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <Sparkles className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col items-start sm:items-center text-left sm:text-center">
                    <span className="text-sm font-medium">{fabric.name}</span>
                    <span className="text-xs text-gray-500">{fabric.material}</span>
                    <span className="text-xs text-gray-500">{fabric.color}</span>
                    <span className="text-xs text-plum mt-1 font-medium">₹{fabric.price}</span>
                  </div>
                  
                  {selectedFabric?.id === fabric.id && (
                    <div className="absolute top-2 right-2 bg-plum rounded-full p-1">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Continue Button */}
      <div className="flex flex-row gap-4 pt-2">
        <Button 
          variant="outline" 
          className="flex-1 py-3 rounded-md border-gray-300 text-gray-700 hover:bg-gray-50"
          onClick={onClose}
        >
          Back
        </Button>
        <Button 
          className={`flex-1 py-3 rounded-md ${
            !selectedFabric
              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
              : 'bg-plum hover:bg-plum/90 text-white'
          }`}
          disabled={!selectedFabric}
          onClick={handleContinue}
        >
          Continue
        </Button>
      </div>
    </>
  );

  const isMobile = useMediaQuery("(max-width: 640px)");
  
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="bottom" className="h-[90vh] p-0 flex flex-col">
          <SheetHeader className="p-4 pb-0 flex-shrink-0">
            <SheetTitle>{`Choose Fabric for ${service?.name}`}</SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-auto px-4 pt-2 pb-24">
            {renderContent()}
          </div>
          
          {/* Fixed bottom buttons */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 z-10">
            <div className="flex flex-row gap-4">
              <Button 
                variant="outline" 
                className="flex-1 py-3 rounded-md border-gray-300 text-gray-700 hover:bg-gray-50"
                onClick={onClose}
                type="button"
              >
                Back
              </Button>
              <Button 
                className={`flex-1 py-3 rounded-md ${
                  !selectedFabric
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : 'bg-plum hover:bg-plum/90 text-white'
                }`}
                disabled={!selectedFabric}
                onClick={handleContinue}
                type="button"
              >
                Continue
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>{`Choose Fabric for ${service.name}`}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {renderContent()}
          <div className="flex flex-row gap-4 pt-2">
            <Button 
              variant="outline" 
              className="flex-1 py-3 rounded-md border-gray-300 text-gray-700 hover:bg-gray-50"
              onClick={onClose}
            >
              Back
            </Button>
            <Button 
              className={`flex-1 py-3 rounded-md ${
                !selectedFabric
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  : 'bg-plum hover:bg-plum/90 text-white'
              }`}
              disabled={!selectedFabric}
              onClick={handleContinue}
            >
              Continue
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FabricSelectionModal;
