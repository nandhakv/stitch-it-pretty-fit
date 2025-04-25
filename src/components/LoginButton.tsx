import React from 'react';
import { LogIn } from 'lucide-react';
import { useAuth } from '../utils/AuthContext';
import { Button } from '@/components/ui/button';

interface LoginButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  label?: string;
  className?: string;
}

const LoginButton: React.FC<LoginButtonProps> = ({ 
  variant = 'default', 
  size = 'md', 
  showIcon = true,
  label = 'Sign In',
  className = ''
}) => {
  const { isAuthenticated, showLoginSheet } = useAuth();

  if (isAuthenticated) {
    return null;
  }

  // Size classes
  const sizeClasses = {
    sm: 'py-1 px-3 text-sm',
    md: 'py-2 px-4',
    lg: 'py-3 px-6 text-lg'
  };

  // Variant classes
  const variantClasses = {
    default: 'bg-plum text-white hover:bg-plum/90',
    outline: 'border border-plum text-plum hover:bg-plum/10',
    ghost: 'text-plum hover:bg-plum/10'
  };

  return (
    <Button
      onClick={showLoginSheet}
      className={`${sizeClasses[size]} ${variantClasses[variant]} rounded-lg flex items-center ${className}`}
    >
      {showIcon && <LogIn className="h-4 w-4 mr-2" />}
      {label}
    </Button>
  );
};

export default LoginButton;
