
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, User } from 'lucide-react';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  showProfile?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  title, 
  showBackButton = true, 
  showProfile = true 
}) => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate(-1);
  };

  const handleProfileClick = () => {
    // For demo, this would navigate to profile page
    console.log('Navigate to profile');
  };

  return (
    <header className="sticky top-0 bg-white z-10 shadow-sm">
      <div className="container max-w-md mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          {showBackButton && (
            <button 
              onClick={handleBack}
              className="mr-3 p-1"
              aria-label="Go back"
            >
              <ChevronLeft className="w-5 h-5 text-plum" />
            </button>
          )}
          {title && <h1 className="text-lg font-medium text-plum font-playfair">{title}</h1>}
        </div>
        
        {showProfile && (
          <button 
            onClick={handleProfileClick}
            className="p-1"
            aria-label="User profile"
          >
            <User className="w-5 h-5 text-plum" />
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
