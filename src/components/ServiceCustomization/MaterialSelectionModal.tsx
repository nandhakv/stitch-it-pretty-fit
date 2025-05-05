import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Sparkles, CheckCircle2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { ApiService } from '@/pages/BoutiqueDetailPage';
import FabricSelectionModal from './FabricSelectionModal';

// Define fabric options
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

export interface MaterialSelection {
  buyFromUs: boolean;
  fabricDetails: typeof fabricOptions[0] | null;
}

interface MaterialSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: ApiService | null;
  onContinue: (materialSelection: MaterialSelection, option: 'predesigned' | 'custom') => void;
}

const MaterialSelectionModal: React.FC<MaterialSelectionModalProps> = ({
  isOpen,
  onClose,
  service,
  onContinue
}) => {
  // All hooks must be called unconditionally at the top level
  // Initialize states with no default selection
  const [buyCloth, setBuyCloth] = useState<boolean | null>(null);
  const [selectedFabric, setSelectedFabric] = useState<typeof fabricOptions[0] | null>(null);
  const [selectedOption, setSelectedOption] = useState<'predesigned' | 'custom' | null>(null);
  const [showFabricModal, setShowFabricModal] = useState(false);
  
  // Reset selections when modal opens, but not design type during re-renders
  useEffect(() => {
    if (isOpen) {
      // Only reset state the first time the modal opens
      if (buyCloth === null && selectedOption === null) {
        setBuyCloth(null);
      }
    } else {
      // Reset all state when modal closes
      setSelectedOption(null);
      setBuyCloth(null);
    }
  }, [isOpen, buyCloth, selectedOption]);
  const isMobile = useMediaQuery("(max-width: 640px)");

  // Early return after all hooks have been called
  if (!service) return null;

  const handleContinue = () => {
    if (buyCloth === null || !selectedOption) {
      return;
    }
    
    if (buyCloth === false) {
      // If using own fabric, proceed directly
      onContinue(
        { buyFromUs: false, fabricDetails: null },
        selectedOption
      );
    } else {
      // If buying fabric, show the fabric selection modal
      setShowFabricModal(true);
    }
  };
  
  const handleFabricSelected = (fabric: typeof fabricOptions[0]) => {
    setSelectedFabric(fabric);
    setShowFabricModal(false);
    
    // Proceed to next step with selected fabric
    onContinue(
      { buyFromUs: true, fabricDetails: fabric },
      selectedOption as 'predesigned' | 'custom' // We know it's not null here
    );
  };

  // Render content for desktop only
  // For mobile, we use a different layout directly in the return statement
  const renderDesktopContent = () => (
    <>
      <div className="max-h-[calc(90vh-8rem)] overflow-y-auto px-1 pb-2 -mx-1">
        {/* Design Option Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Design Type</h3>
          <div className="grid grid-cols-2 gap-4">
            <div 
              className={`p-4 border rounded-lg flex flex-col items-center cursor-pointer transition-all ${
                selectedOption === 'predesigned' 
                  ? 'border-plum bg-plum/5' 
                  : 'border-gray-200 hover:border-plum/60 hover:bg-plum/5'
              }`}
              onClick={() => {
                setSelectedOption('predesigned');
                // Keep only one handler to prevent state fluctuation
              }}
            >
              <div className="w-14 h-14 rounded-full bg-plum/10 flex items-center justify-center mb-3">
                <Sparkles className="h-7 w-7 text-plum" />
              </div>
              <h3 className="font-medium text-center">Pre-designed Styles</h3>
              <p className="text-xs text-gray-500 text-center mt-1">
                Ready-made design patterns with predefined configurations
              </p>
            </div>
            
            <div 
              className={`p-4 border rounded-lg flex flex-col items-center cursor-pointer transition-all ${
                selectedOption === 'custom' 
                  ? 'border-plum bg-plum/5' 
                  : 'border-gray-200 hover:border-plum/60 hover:bg-plum/5'
              }`}
              onClick={() => {
                setSelectedOption('custom');
                // Keep only one handler to prevent state fluctuation
              }}
            >
              <div className="w-14 h-14 rounded-full bg-plum/10 flex items-center justify-center mb-3">
                <Sparkles className="h-7 w-7 text-plum" />
              </div>
              <h3 className="font-medium text-center">Custom Design</h3>
              <p className="text-xs text-gray-500 text-center mt-1">
                Create your own unique design from scratch
              </p>
            </div>
          </div>
        </div>

        {/* Material Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Material Selection</h3>
          <p className="text-sm text-gray-600 mb-4">
            Choose whether you want to purchase fabric from us or use your own material.
          </p>
          
          <div className="mb-6">
            <div className="flex flex-row gap-4">
              <Button 
                variant={buyCloth === true ? "default" : "outline"} 
                className={`flex-1 py-3 rounded-md ${buyCloth === true ? 'bg-plum text-white' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                onClick={() => setBuyCloth(true)}
              >
                Yes, buy fabric from us
              </Button>
              <Button 
                variant={buyCloth === false ? "default" : "outline"} 
                className={`flex-1 py-3 rounded-md ${buyCloth === false ? 'bg-plum text-white' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                onClick={() => {
                  setBuyCloth(false);
                  setSelectedFabric(null);
                }}
              >
                No, I have my own fabric
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Desktop Buttons */}
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
            buyCloth === null || !selectedOption
              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
              : 'bg-plum hover:bg-plum/90 text-white'
          }`}
          disabled={buyCloth === null || !selectedOption}
          onClick={handleContinue}
        >
          Continue
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* First modal - Design type and material source selection */}
      {isMobile ? (
        <Sheet open={isOpen && !showFabricModal} onOpenChange={onClose}>
          <SheetContent side="bottom" className="h-[90vh] p-0 flex flex-col">
            <SheetHeader className="p-4 pb-0 flex-shrink-0">
              <SheetTitle>{`Choose Your ${service?.name} Material`}</SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-auto px-4 pt-2 pb-24">
              <div className="space-y-4">
                {/* Design type and material selection content */}
                <div className="max-h-full overflow-y-auto">
                  {/* Design Option Selection */}
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-3">Design Type</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div 
                        className={`p-4 border rounded-lg flex flex-col items-center cursor-pointer transition-all ${
                          selectedOption === 'predesigned' 
                            ? 'border-plum bg-plum/5' 
                            : 'border-gray-200 hover:border-plum/60 hover:bg-plum/5'
                        }`}
                        onClick={() => {
                          setSelectedOption('predesigned');
                          // Keep only one handler to prevent state fluctuation
                        }}
                      >
                        <div className="w-14 h-14 rounded-full bg-plum/10 flex items-center justify-center mb-3">
                          <Sparkles className="h-7 w-7 text-plum" />
                        </div>
                        <h3 className="font-medium text-center">Pre-designed Styles</h3>
                        <p className="text-xs text-gray-500 text-center mt-1">
                          Ready-made design patterns with predefined configurations
                        </p>
                      </div>
                      
                      <div 
                        className={`p-4 border rounded-lg flex flex-col items-center cursor-pointer transition-all ${
                          selectedOption === 'custom' 
                            ? 'border-plum bg-plum/5' 
                            : 'border-gray-200 hover:border-plum/60 hover:bg-plum/5'
                        }`}
                        onClick={() => {
                          setSelectedOption('custom');
                          // Keep only one handler to prevent state fluctuation
                        }}
                      >
                        <div className="w-14 h-14 rounded-full bg-plum/10 flex items-center justify-center mb-3">
                          <Sparkles className="h-7 w-7 text-plum" />
                        </div>
                        <h3 className="font-medium text-center">Custom Design</h3>
                        <p className="text-xs text-gray-500 text-center mt-1">
                          Create your own unique design from scratch
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Material Selection */}
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-3">Material Selection</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Choose whether you want to purchase fabric from us or use your own material.
                    </p>
                    
                    <div className="mb-6">
                      <div className="flex flex-col gap-4">
                        <Button 
                          variant={buyCloth === true ? "default" : "outline"} 
                          className={`w-full py-3 rounded-md ${buyCloth === true ? 'bg-plum text-white' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                          onClick={() => setBuyCloth(true)}
                        >
                          Yes, buy fabric from us
                        </Button>
                        <Button 
                          variant={buyCloth === false ? "default" : "outline"} 
                          className={`w-full py-3 rounded-md ${buyCloth === false ? 'bg-plum text-white' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                          onClick={() => {
                            setBuyCloth(false);
                            setSelectedFabric(null);
                          }}
                        >
                          No, I have my own fabric
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Fixed bottom action buttons */}
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
                    buyCloth === null || !selectedOption
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      : 'bg-plum hover:bg-plum/90 text-white'
                  }`}
                  disabled={buyCloth === null || !selectedOption}
                  onClick={handleContinue}
                  type="button"
                >
                  Continue
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      ) : (
        <Dialog open={isOpen && !showFabricModal} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-md max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>{`Choose Your ${service?.name} Material`}</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {renderDesktopContent()}
            </div>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Second modal - Fabric selection */}
      {showFabricModal && (
        <FabricSelectionModal
          isOpen={showFabricModal}
          onClose={() => setShowFabricModal(false)}
          service={service}
          designType={selectedOption}
          onComplete={handleFabricSelected}
        />
      )}
    </>
  );
};

export default MaterialSelectionModal;
