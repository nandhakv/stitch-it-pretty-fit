
import React from 'react';
import { DesignOption } from '../utils/types';

interface DesignOptionCardProps {
  option: DesignOption;
  selected: boolean;
  onSelect: (option: DesignOption) => void;
}

const DesignOptionCard: React.FC<DesignOptionCardProps> = ({ option, selected, onSelect }) => {
  return (
    <div 
      className={`border rounded-lg overflow-hidden mb-3 cursor-pointer transition-all ${
        selected ? 'border-plum ring-2 ring-plum/20' : 'border-gray-200'
      }`}
      onClick={() => onSelect(option)}
    >
      <div className="flex items-center">
        <div className="flex-shrink-0 w-24 h-24">
          <img 
            src={option.image} 
            alt={option.name} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-3 flex-1">
          <h4 className="font-medium text-gray-800">{option.name}</h4>
          <div className="text-sm text-plum font-medium mt-1">₹{option.price}</div>
        </div>
        <div className="p-3">
          {selected ? (
            <div className="w-5 h-5 rounded-full bg-plum flex items-center justify-center">
              <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 5L4 8L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          ) : (
            <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DesignOptionCard;
