import React from 'react';
import { Button } from "@/components/ui/button";
import { Palette, Upload, Ruler } from 'lucide-react';
import { ApiService } from '@/pages/BoutiqueDetailPage';
import { BottomSheet } from "@/components/ui/bottom-sheet";

interface DesignOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: ApiService | null;
  onSelectOption: (option: 'predesigned' | 'custom') => void;
}

const DesignOptionsModal: React.FC<DesignOptionsModalProps> = ({
  isOpen,
  onClose,
  service,
  onSelectOption
}) => {
  if (!service) return null;

  return (
    <BottomSheet 
      open={isOpen} 
      onOpenChange={onClose}
      title={`Choose Your ${service.name} Design Option`}
      className="sm:max-w-[425px]"
    >
      <div className="grid gap-4 py-4">
          <div 
            className="p-4 border border-gray-200 rounded-lg hover:border-plum hover:bg-plum/5 cursor-pointer transition-all flex flex-col items-center"
            onClick={() => onSelectOption('predesigned')}
          >
            <div className="w-12 h-12 bg-plum/10 rounded-full flex items-center justify-center mb-3">
              <Palette className="w-6 h-6 text-plum" />
            </div>
            <h3 className="font-medium text-gray-800 mb-1">Browse & Select a Style</h3>
            <p className="text-sm text-gray-500 text-center">
              Choose from our collection of pre-designed styles
            </p>
          </div>
          
          <div 
            className="p-4 border border-gray-200 rounded-lg hover:border-plum hover:bg-plum/5 cursor-pointer transition-all flex flex-col items-center"
            onClick={() => onSelectOption('custom')}
          >
            <div className="w-12 h-12 bg-plum/10 rounded-full flex items-center justify-center mb-3">
              <Upload className="w-6 h-6 text-plum" />
            </div>
            <h3 className="font-medium text-gray-800 mb-1">Upload a Reference Image</h3>
            <p className="text-sm text-gray-500 text-center">
              Upload your own design for custom creation
            </p>
          </div>
        </div>
        
        <div className="flex justify-center">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="w-full"
          >
            Cancel
          </Button>
        </div>
    </BottomSheet>
  );
};

export default DesignOptionsModal;
