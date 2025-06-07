import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star } from 'lucide-react';
import OptimizedImage from "@/components/ui/optimized-image";
import { PredesignedStyle } from '@/pages/BoutiqueDetailPage';

// Define the customization options that will be available for all services
interface CustomizationOption {
  id: string;
  name: string;
  imageUrl: string;
  type: string;
}

interface StyleCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceName: string;
  preselectedStyle?: PredesignedStyle; // Optional, for when customizing a predesigned style
  uploadedImageUrl?: string; // Optional, for when customizing from an uploaded image
  onComplete: (customizations: Record<string, string>) => void;
}

const StyleCustomizationModal: React.FC<StyleCustomizationModalProps> = ({
  isOpen,
  onClose,
  serviceName,
  preselectedStyle,
  uploadedImageUrl,
  onComplete
}) => {
  // Get available customization tabs based on service type
  const getCustomizationTabs = () => {
    // This would be dynamic based on service type in a real implementation
    return [
      { id: 'frontNeck', name: 'Front Neck' },
      { id: 'backNeck', name: 'Back Neck' },
      { id: 'sleeve', name: 'Sleeve' },
      { id: 'embroidery', name: 'Embroidery' }
    ];
  };
  
  const tabs = getCustomizationTabs();
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  
  // Mock data - in a real app, this would come from an API
  const getMockOptionsForType = (type: string): CustomizationOption[] => {
    switch (type) {
      case 'frontNeck':
        return [
          { id: 'round', name: 'Round Neck', imageUrl: '/images/round-neck.jpg', type },
          { id: 'v-neck', name: 'V Neck', imageUrl: '/images/v-neck.jpg', type },
          { id: 'square', name: 'Square Neck', imageUrl: '/images/square-neck.jpg', type },
          { id: 'sweetheart', name: 'Sweetheart', imageUrl: '/images/sweetheart-neck.jpg', type },
          { id: 'boat', name: 'Boat Neck', imageUrl: '/images/boat-neck.jpg', type }
        ];
      case 'backNeck':
        return [
          { id: 'round-back', name: 'Round Back', imageUrl: '/images/round-back.jpg', type },
          { id: 'v-back', name: 'V Back', imageUrl: '/images/v-back.jpg', type },
          { id: 'u-back', name: 'U Back', imageUrl: '/images/u-back.jpg', type },
          { id: 'deep-back', name: 'Deep Back', imageUrl: '/images/deep-back.jpg', type },
          { id: 'keyhole', name: 'Keyhole Back', imageUrl: '/images/keyhole-back.jpg', type }
        ];
      case 'sleeve':
        return [
          { id: 'sleeveless', name: 'Sleeveless', imageUrl: '/images/sleeveless.jpg', type },
          { id: 'cap', name: 'Cap Sleeve', imageUrl: '/images/cap-sleeve.jpg', type },
          { id: 'half', name: 'Half Sleeve', imageUrl: '/images/half-sleeve.jpg', type },
          { id: 'three-quarter', name: '3/4 Sleeve', imageUrl: '/images/three-quarter-sleeve.jpg', type },
          { id: 'full', name: 'Full Sleeve', imageUrl: '/images/full-sleeve.jpg', type }
        ];
      case 'embroidery':
        return [
          { id: 'none', name: 'No Embroidery', imageUrl: '/images/no-embroidery.jpg', type },
          { id: 'simple', name: 'Simple Pattern', imageUrl: '/images/simple-embroidery.jpg', type },
          { id: 'floral', name: 'Floral Pattern', imageUrl: '/images/floral-embroidery.jpg', type },
          { id: 'geometric', name: 'Geometric Pattern', imageUrl: '/images/geometric-embroidery.jpg', type },
          { id: 'sequin', name: 'Sequin Work', imageUrl: '/images/sequin-embroidery.jpg', type }
        ];
      default:
        return [];
    }
  };

  // Determine the initially selected options based on preselected style
  const getInitialSelections = () => {
    const initial: Record<string, string> = {};
    
    // Preset selections if a predesigned style is provided
    if (preselectedStyle) {
      initial.frontNeck = preselectedStyle.configurations.frontNeck === 'Round' ? 'round' : 
                         preselectedStyle.configurations.frontNeck === 'V-Neck' ? 'v-neck' : 
                         preselectedStyle.configurations.frontNeck === 'Square' ? 'square' : 
                         preselectedStyle.configurations.frontNeck === 'Sweetheart' ? 'sweetheart' : 'round';
                         
      initial.backNeck = preselectedStyle.configurations.backNeck === 'Round' ? 'round-back' : 
                        preselectedStyle.configurations.backNeck === 'V-Shape' ? 'v-back' : 
                        preselectedStyle.configurations.backNeck === 'Deep U' ? 'deep-back' : 
                        preselectedStyle.configurations.backNeck === 'Keyhole' ? 'keyhole' : 'round-back';
                        
      initial.embroidery = preselectedStyle.configurations.embroidery === 'Floral' ? 'floral' :
                          preselectedStyle.configurations.embroidery === 'Minimal' ? 'simple' :
                          preselectedStyle.configurations.embroidery === 'Heavy Gold' ? 'geometric' :
                          preselectedStyle.configurations.embroidery === 'Sequin' ? 'sequin' : 'none';
                          
      initial.sleeve = preselectedStyle.configurations.blouseType === 'Sleeveless' ? 'sleeveless' :
                      preselectedStyle.configurations.blouseType === 'Full Sleeve' ? 'full' :
                      preselectedStyle.configurations.blouseType === 'Cap Sleeve' ? 'cap' : 'half';
    } else {
      // Default selections
      initial.frontNeck = 'round';
      initial.backNeck = 'round-back';
      initial.sleeve = 'half';
      initial.embroidery = 'none';
    }
    
    return initial;
  };
  
  const [selections, setSelections] = useState<Record<string, string>>(getInitialSelections());
  
  const handleSelect = (optionId: string, type: string) => {
    setSelections(prev => ({
      ...prev,
      [type]: optionId
    }));
  };
  
  const handleComplete = () => {
    onComplete(selections);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center text-gray-800">
            Customize Your {serviceName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {/* Display the reference image if provided */}
          {uploadedImageUrl && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Your Reference Image:</p>
              <img 
                src={uploadedImageUrl} 
                alt="Reference Design" 
                className="w-full max-h-40 object-contain border rounded-lg"
              />
            </div>
          )}
          
          {/* Enhanced style details section with description, pricing and boutique info */}
          {preselectedStyle && !uploadedImageUrl && (
            <div className="mb-6 space-y-4">
              {/* Style image and name */}
              <div className="relative rounded-lg overflow-hidden">
                <OptimizedImage 
                  src={preselectedStyle.imageUrl} 
                  alt={preselectedStyle.name} 
                  className="w-full h-52 object-cover"
                  fallbackSrc="/images/placeholder-style.jpg"
                  aspectRatio="aspect-video"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <h3 className="absolute bottom-2 left-3 text-lg font-semibold text-white">{preselectedStyle.name}</h3>
              </div>
              
              {/* Description */}
              <div className="px-1">
                <p className="text-gray-700">{preselectedStyle.description}</p>
              </div>
              
              {/* Pricing with strikethrough and discount */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 line-through text-sm">₹{preselectedStyle.price}</span>
                      <span className="px-1.5 py-0.5 bg-green-100 text-green-800 rounded-md text-xs font-medium">{preselectedStyle.discount}% off</span>
                    </div>
                    <span className="text-xl font-bold text-gray-900">₹{preselectedStyle.finalPrice}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span>Est. delivery: {preselectedStyle.estimatedDays} days</span>
                  </div>
                </div>
              </div>
              
              {/* Boutique profile information */}
              {preselectedStyle.boutique && (
                <div className="flex items-center p-3 bg-white border rounded-lg">
                  <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-200 mr-3">
                    <OptimizedImage 
                      src={preselectedStyle.boutique.coverImageUrl || '/images/placeholder-boutique.jpg'} 
                      alt={preselectedStyle.boutique.name} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{preselectedStyle.boutique.name}</h4>
                    <div className="flex items-center mt-1">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="ml-1 text-sm font-medium text-gray-700">{preselectedStyle.boutique.ratings}</span>
                      </div>
                      <span className="mx-1 text-gray-400">•</span>
                      <span className="text-sm text-gray-600">{preselectedStyle.boutique.reviewCount} reviews</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Customization tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full flex">
              {tabs.map(tab => (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.id}
                  className="flex-1"
                >
                  {tab.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {tabs.map(tab => (
              <TabsContent key={tab.id} value={tab.id}>
                <div className="mb-2 flex justify-between items-center">
                  <h3 className="font-medium text-gray-800">Select {tab.name} Style</h3>
                  
                  {/* Show "preselected" indicator if this option came from a predesigned style */}
                  {preselectedStyle && (
                    <div className="text-xs px-2 py-1 bg-plum/10 text-plum rounded-full">
                      Preselected from style
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-2">
                  {getMockOptionsForType(tab.id).map(option => (
                    <div 
                      key={option.id}
                      className={`
                        aspect-square border rounded-md overflow-hidden cursor-pointer transition-all relative
                        ${selections[tab.id] === option.id ? 'border-plum ring-2 ring-plum/20' : 'border-gray-200 hover:border-plum/50'}
                      `}
                      onClick={() => handleSelect(option.id, tab.id)}
                    >
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <div className="text-xs text-center p-1">{option.name}</div>
                      </div>
                      
                      {selections[tab.id] === option.id && (
                        <div className="absolute top-1 right-1 bg-plum rounded-full p-0.5">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                            <path d="M20 6 9 17l-5-5" />
                          </svg>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          
          <Button 
            onClick={handleComplete}
            className="flex-1 bg-plum hover:bg-plum/90"
          >
            Continue to Measurements
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StyleCustomizationModal;
