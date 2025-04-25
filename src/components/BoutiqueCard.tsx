
import React from 'react';
import { Boutique } from '../utils/types';
import { Star, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BoutiqueCardProps {
  boutique: Boutique;
}

const BoutiqueCard: React.FC<BoutiqueCardProps> = ({ boutique }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/boutique/${boutique.id}`);
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
      onClick={handleClick}
    >
      <img 
        src={boutique.imageUrls?.[0] || boutique.image || '/images/placeholder-boutique.jpg'} 
        alt={boutique.name}
        className="w-full h-28 sm:h-32 object-cover"
        onError={(e) => {
          e.currentTarget.src = '/images/placeholder-boutique.jpg';
        }}
      />
      <div className="p-2 sm:p-3">
        <h3 className="text-sm font-medium text-plum truncate">{boutique.name}</h3>
        <div className="flex items-center justify-between mt-0.5">
          <div className="flex items-center">
            <Star className="w-3 h-3 fill-gold text-gold" />
            <span className="ml-1 text-xs font-medium">
              {boutique.rating} ({boutique.reviewCount})
            </span>
          </div>
          {boutique.isOpen !== undefined && (
            <div className="flex items-center">
              <Clock className="w-3 h-3 text-gray-500" />
              <span className={`ml-1 text-xs font-medium ${boutique.isOpen ? 'text-green-600' : 'text-red-500'}`}>
                {boutique.isOpen ? 'Open' : 'Closed'}
              </span>
            </div>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-0.5 truncate">
          {boutique.location || `${boutique.address?.city}, ${boutique.address?.pincode}`}
        </p>
      </div>
    </div>
  );
};

export default BoutiqueCard;
