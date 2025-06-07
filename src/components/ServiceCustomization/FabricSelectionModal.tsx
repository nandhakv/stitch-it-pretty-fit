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
import { Material, MaterialsResponse } from '@/services/api';

// Define fabric options as fallback
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
  materialsData?: MaterialsResponse | null;
  designType: 'predesigned' | 'custom' | null;
  onComplete: (fabric: Material) => void;
}

const FabricSelectionModal: React.FC<FabricSelectionModalProps> = ({
  isOpen,
  onClose,
  service,
  materialsData,
  designType,
  onComplete
}) => {
  const [selectedFabric, setSelectedFabric] = useState<Material | null>(null);
  const isMobile = useMediaQuery("(max-width: 640px)");
  
  // Reset selection when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedFabric(null);
    }
  }, [isOpen]);

  if (!service) return null;

  // Create a Material object from fabric option for backward compatibility
  const createMaterialFromFabric = (fabric: typeof fabricOptions[0]): Material => {
    return {
      id: fabric.id,
      name: fabric.name,
      description: `${fabric.material} in ${fabric.color}`,
      images: [fabric.image],
      thumbnail: fabric.image,
      price: fabric.price,
      pricePerUnit: 'per meter',
      type: fabric.material,
      colors: [{ name: fabric.color, code: '', image: fabric.image, inStock: true }],
      availableQuantity: 100,
      minimumOrder: 1,
      properties: {
        weight: 'medium',
        stretch: 'low',
        opacity: 'medium',
        care: ['Dry clean only'],
        composition: fabric.material
      },
      rating: 0,
      reviewCount: 0
    };
  };
  
  const handleContinue = () => {
    if (!selectedFabric) return;
    
    // Call onComplete with the selected fabric
    // The parent component (BoutiqueDetailPage) will handle navigation
    // to either the predesigned styles page or custom design page
    // based on the designType selection
    onComplete(selectedFabric);
    
    // Close this modal
    onClose();
  };

  const renderContent = () => (
    <>
      <div className="max-h-[calc(90vh-8rem)] overflow-y-auto px-1 pb-2 -mx-1">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Select Your Fabric</h3>
        <p className="text-sm text-gray-600 mb-4">
          Choose the fabric you'd like to use for your {designType === 'predesigned' ? 'pre-designed' : 'custom'} {service.name}.
        </p>
        
        <div className="grid grid-cols-2 gap-4 mt-6">
          {materialsData && materialsData.materials && materialsData.materials.length > 0 ? (
            // Display materials from API
            materialsData.materials.map((material) => (
              <div 
                key={material.id}
                className={`border p-4 rounded-lg cursor-pointer transition-all ${
                  selectedFabric?.id === material.id ? 'border-plum bg-plum/5' : 'border-gray-200 hover:border-plum/60'
                }`}
                onClick={() => setSelectedFabric(material)}
              >
                <div className="aspect-square rounded-lg overflow-hidden mb-3">
                  <img 
                    src={material.images && material.images.length > 0 ? material.images[0] : '/images/placeholder-fabric.jpg'} 
                    alt={material.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/images/placeholder-fabric.jpg';
                    }}
                  />
                </div>
                <h4 className="font-medium">{material.name}</h4>
                <div className="flex justify-between mt-1">
                  <span className="text-sm text-gray-500">{material.type || 'Fabric'}</span>
                  <span className="text-sm font-medium">₹{material.price}</span>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  {material.colors && material.colors.length > 0 ? (
                    <>Colors: {material.colors.map(c => c.name || c.code).join(', ')}</>
                  ) : 'Standard color'}
                </div>
              </div>
            ))
          ) : (
            // Fallback to hardcoded fabric options
            fabricOptions.map((fabric) => (
              <div 
                key={fabric.id}
                className={`border p-4 rounded-lg cursor-pointer transition-all ${
                  selectedFabric?.id === fabric.id ? 'border-plum bg-plum/5' : 'border-gray-200 hover:border-plum/60'
                }`}
                onClick={() => {
                  const materialFabric = createMaterialFromFabric(fabric);
                  setSelectedFabric(materialFabric);
                }}
              >
                <div className="aspect-square rounded-lg overflow-hidden mb-3">
                  <img 
                    src={fabric.image} 
                    alt={fabric.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/images/placeholder-fabric.jpg';
                    }}
                  />
                </div>
                <h4 className="font-medium">{fabric.name}</h4>
                <div className="flex justify-between mt-1">
                  <span className="text-sm text-gray-500">{fabric.material}</span>
                  <span className="text-sm font-medium">₹{fabric.price}</span>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Color: {fabric.color}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button 
          disabled={!selectedFabric} 
          onClick={handleContinue}
          className="bg-plum hover:bg-plum/90"
        >
          Continue
        </Button>
      </div>
    </>
  );
  
  const ModalComponent = isMobile ? Sheet : Dialog;
  const ContentComponent = isMobile ? SheetContent : DialogContent;
  const HeaderComponent = isMobile ? SheetHeader : DialogHeader;
  const TitleComponent = isMobile ? SheetTitle : DialogTitle;
  
  return (
    <ModalComponent open={isOpen} onOpenChange={onClose}>
      <ContentComponent className={isMobile ? "pt-10" : "max-w-2xl p-8"}>
        <HeaderComponent className={isMobile ? "" : "pb-4"}>
          <TitleComponent className="text-xl font-semibold">
            Material Selection
          </TitleComponent>
          {isMobile && (
            <Button 
              size="icon" 
              variant="ghost" 
              className="absolute right-4 top-4 p-0 h-8 w-8" 
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </HeaderComponent>
        {renderContent()}
      </ContentComponent>
    </ModalComponent>
  );
};

export default FabricSelectionModal;
