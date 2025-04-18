
import React from 'react';
import { Boutique } from '../utils/types';
import { Star } from 'lucide-react';
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
      className="bg-white rounded-lg shadow-md overflow-hidden mb-4 cursor-pointer"
      onClick={handleClick}
    >
      <img 
        src={boutique.image} 
        alt={boutique.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-medium text-plum">{boutique.name}</h3>
        <div className="flex items-center mt-1">
          <Star className="w-4 h-4 fill-gold text-gold" />
          <span className="ml-1 text-sm font-medium">
            {boutique.rating} ({boutique.reviewCount} reviews)
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-1">{boutique.location}</p>
      </div>
    </div>
  );
};

export default BoutiqueCard;
