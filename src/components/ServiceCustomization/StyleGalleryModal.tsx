import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { InfoIcon } from 'lucide-react';
import { PredesignedStyle } from '@/pages/BoutiqueDetailPage';

interface StyleGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  styles: PredesignedStyle[];
  serviceName: string;
  onSelectStyle: (style: PredesignedStyle) => void;
  onCustomizeStyle: (style: PredesignedStyle) => void;
  isLoading: boolean;
}

const StyleGalleryModal: React.FC<StyleGalleryModalProps> = ({
  isOpen,
  onClose,
  styles,
  serviceName,
  onSelectStyle,
  onCustomizeStyle,
  isLoading
}) => {
  const [selectedStyle, setSelectedStyle] = React.useState<PredesignedStyle | null>(null);

  // Reset selected style when modal closes
  React.useEffect(() => {
    if (!isOpen) {
      setSelectedStyle(null);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center text-gray-800">
            Predesigned {serviceName} Styles
          </DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="w-8 h-8 border-4 border-plum/20 border-t-plum rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 py-4">
              {styles.map((style) => (
                <div 
                  key={style.id}
                  className={`
                    border rounded-lg overflow-hidden cursor-pointer transition-all
                    ${selectedStyle?.id === style.id ? 'border-plum ring-2 ring-plum/20' : 'border-gray-200 hover:border-plum/50'}
                  `}
                  onClick={() => setSelectedStyle(style)}
                >
                  <div className="aspect-square relative">
                    <img 
                      src={style.imageUrl} 
                      alt={style.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/images/placeholder-design.jpg';
                      }}
                    />
                    {selectedStyle?.id === style.id && (
                      <div className="absolute inset-0 bg-plum/10 flex items-center justify-center">
                        <div className="bg-white rounded-full p-1">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-plum">
                            <path d="M20 6 9 17l-5-5" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-gray-800">{style.name}</h3>
                    <p className="text-plum font-medium mt-1">₹{style.price}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {selectedStyle && (
              <div className="mt-2 bg-gray-50 p-4 rounded-lg">
                <div className="flex items-start gap-2 mb-3">
                  <InfoIcon className="w-5 h-5 text-plum mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-600">
                    This style includes the following configurations that you can customize further
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Front Neck:</span>
                    <span className="font-medium">{selectedStyle.configurations.frontNeck}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Back Neck:</span>
                    <span className="font-medium">{selectedStyle.configurations.backNeck}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Embroidery:</span>
                    <span className="font-medium">{selectedStyle.configurations.embroidery}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Blouse Type:</span>
                    <span className="font-medium">{selectedStyle.configurations.blouseType}</span>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <Button 
                variant="outline" 
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              
              {selectedStyle && (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => onCustomizeStyle(selectedStyle)}
                    className="flex-1 border-plum text-plum hover:bg-plum/10"
                  >
                    Customize This Style
                  </Button>
                  <Button 
                    onClick={() => onSelectStyle(selectedStyle)}
                    className="flex-1 bg-plum hover:bg-plum/90"
                  >
                    Select As Is
                  </Button>
                </>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default StyleGalleryModal;
