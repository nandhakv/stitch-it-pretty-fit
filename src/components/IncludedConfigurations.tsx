import React from 'react';
import { Sparkles, Edit, CheckCircle2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

// Define the shape of customization options from the API
interface ConfigOption {
  name: string;
  id: string;
  options: string[] | Array<{name: string; isDefault?: boolean}>;
  defaultValue?: string;
}

interface IncludedConfigurationsProps {
  style: any; // Using any to accommodate different style formats
  isCustomizing?: boolean;
  toggleCustomization?: () => void;
  onCustomizationChange?: (optionId: string, value: string) => void;
  onSaveCustomization?: () => void;
  priceAdjustments?: Record<string, number>;
}

const IncludedConfigurations: React.FC<IncludedConfigurationsProps> = ({
  style,
  isCustomizing,
  toggleCustomization,
  onCustomizationChange,
  onSaveCustomization,
  priceAdjustments = {}
}) => {
  // Function to handle option changes
  const handleOptionChange = (optionId: string, value: string) => {
    console.log(`Changed ${optionId} to ${value}`);
    if (onCustomizationChange) {
      onCustomizationChange(optionId, value);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <Sparkles className="w-5 h-5 text-plum mr-2" />
          {isCustomizing ? 'Customize Style' : 'Features & Specifications'}
          {style && style.isPredesigned && 
            <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
              Predesigned
            </span>
          }
        </h3>
        
        {toggleCustomization && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleCustomization}
            className="flex items-center text-plum">
            {isCustomizing ? (
              <>
                <Edit className="w-4 h-4 mr-1" /> Cancel
              </>
            ) : (
              <>
                <Edit className="w-4 h-4 mr-1" /> Customize
              </>
            )}
          </Button>
        )}
      </div>
      
      {isCustomizing ? (
        <div className="space-y-6">
          {/* API-based customization options */}
          {style && style.customizationOptions && Array.isArray(style.customizationOptions) && 
            style.customizationOptions.map((option: ConfigOption) => {
              const optionId = option.id || option.name.toLowerCase().replace(/\s+/g, '-');
              const optionName = option.name;
              const optionValues = Array.isArray(option.options) 
                ? option.options.map(opt => typeof opt === 'string' ? opt : opt.name)
                : [];
              const defaultValue = option.defaultValue || '';
              
              return (
                <div key={optionId} className="mb-4">
                  <Label className="text-gray-500 text-sm mb-2 block">{optionName}</Label>
                  <Select 
                    defaultValue={defaultValue} 
                    onValueChange={(value) => handleOptionChange(optionId, value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={`Select ${optionName.toLowerCase()}`} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {optionValues.map((value) => (
                          <SelectItem key={`${optionId}-${value}`} value={value}>
                            {value}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              );
            })
          }
          
          {/* Save button */}
          {onSaveCustomization && (
            <Button 
              className="w-full mt-4 bg-plum hover:bg-plum/90"
              onClick={onSaveCustomization}
            >
              <Save className="w-4 h-4 mr-2" />
              Save & Continue
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {/* Display preset configurations if available */}
          {style && style.presetConfigurations && Object.keys(style.presetConfigurations).length > 0 && (
            <div className="space-y-3">
              {Object.entries(style.presetConfigurations).map(([key, value]) => {
                // Skip boolean values
                if (typeof value === 'boolean' || !value) return null;
                
                return (
                  <div key={key} className="flex items-center py-1 border-b border-gray-100">
                    <CheckCircle2 className="w-4 h-4 text-plum mr-2 flex-shrink-0" />
                    <div>
                      <span className="text-gray-500 block text-sm capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className="font-medium">{String(value)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          {/* Display standard configurations if no preset configs */}
          {(!style?.presetConfigurations || Object.keys(style.presetConfigurations || {}).length === 0) && 
           style?.configurations && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
              {Object.entries(style.configurations).map(([key, value]) => {
                if (!value) return null;
                
                return (
                  <div key={key} className="flex items-center">
                    <CheckCircle2 className="w-4 h-4 text-plum mr-2 flex-shrink-0" />
                    <div>
                      <span className="text-gray-500 block text-sm capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className="font-medium">{String(value)}</span>
                      {priceAdjustments[String(value)] > 0 && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          +₹{priceAdjustments[String(value)]}
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          {/* Features section removed as requested */}
        </div>
      )}
    </div>
  );
};

export default IncludedConfigurations;
