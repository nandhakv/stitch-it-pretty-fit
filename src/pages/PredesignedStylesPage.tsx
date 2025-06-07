import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Heart } from 'lucide-react';
import ImageWithFallback from '../components/ImageWithFallback';
import { useOrder } from '../utils/OrderContext';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { PredesignedStyle as ApiPredesignedStyle } from './BoutiqueDetailPage';

// Define a local interface for our component's use that doesn't extend ApiPredesignedStyle
interface StyleItem {
  id: string;
  name: string;
  description: string;
  imageUrl: string; // For display in our component
  price: number;
  discount?: number;
  estimatedDays?: number;
  isCustomizable?: boolean;
  configurations: {
    frontNeck: string;
    backNeck: string;
    embroidery: string;
    blouseType: string;
  };
}
// Import API services from the consolidated API file
import { getPredesignedStyles } from '../services/api';

const PredesignedStylesPage: React.FC = () => {
  const navigate = useNavigate();
  const { boutiqueId, serviceId } = useParams();
  const { order, updateOrder } = useOrder();
  
  // States
  const [styles, setStyles] = useState<StyleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch predesigned styles
    fetchStyles();
  }, [serviceId]);
  
  // Fetch styles from API
  const fetchStyles = async () => {
    setLoading(true);
    setError(null);
    try {
      // Use the API service to fetch styles
      if (!serviceId) {
        throw new Error('Service ID is required');
      }
      
      const options: any = {
        // Set default pagination params
        page: 1,
        limit: 20
      };
      
      // If we're in boutique-first flow, include boutiqueId
      if (boutiqueId) {
        options.boutiqueId = boutiqueId;
      }
      
      // Call the API to get predesigned styles
      const response = await getPredesignedStyles(serviceId, options);
      
      // Check for proper response structure based on the API format
      if (!response.data || !response.data.styles) {
        throw new Error('Invalid API response format');
      }
      
      // Convert API response to PredesignedStyle format for compatibility
      const apiStyles: StyleItem[] = response.data.styles.map(style => {
        // Parse the attributes if it's a string
        let attributes: Record<string, string[]> = {};
        try {
          if (style.attributes && typeof style.attributes === 'string') {
            attributes = JSON.parse(style.attributes);
          }
        } catch (e) {
          console.warn('Failed to parse style attributes:', e);
        }
        
        // Get the image URL (it might be a string or an array)
        const imageUrl = typeof style.imageUrls === 'string' 
          ? style.imageUrls 
          : (Array.isArray(style.imageUrls) && style.imageUrls.length > 0 
              ? style.imageUrls[0] 
              : '/images/placeholder-design.jpg');
              
        // Use attributes to determine configurations if available
        const necklineOptions = attributes?.neckline || [];
        const backOptions = attributes?.back || [];
        const sleeveOptions = attributes?.sleeve || [];
        
        return {
          ...style,
          // Add compatibility fields for our app's usage
          imageUrl: imageUrl, // Add imageUrl property needed by StyleItem interface
          thumbnail: imageUrl,
          configurations: {
            frontNeck: necklineOptions[0] || '',
            backNeck: backOptions[0] || '',
            embroidery: '',
            blouseType: sleeveOptions[0] || ''
          }
        };
      });
      
      setStyles(apiStyles);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching styles:', error);
      setLoading(false);
      setError(error instanceof Error ? error.message : 'Failed to load predesigned styles');
      
      // Show error toast
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to load predesigned styles',
        variant: "destructive"
      });
      
      // Set empty styles array - don't use fallback data
      setStyles([]);
    }
  };
  
  // Handle navigation to style details
  const handleStyleClick = (style: StyleItem) => {
    if (boutiqueId && serviceId) {
      // If boutique and service IDs are available, use them in the route
      navigate(`/boutique/${boutiqueId}/service/${serviceId}/predesigned-styles/${style.id}`);
    } else if (serviceId) {
      // If only service ID is available
      navigate(`/service/${serviceId}/style/${style.id}`);
    } else {
      // Standalone route
      navigate(`/predesigned-styles/${style.id}`);
    }
  };

  // Component rendering logic
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-plum"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-[2rem] md:pt-[3.8rem] pb-20">
      {/* Top Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-10 flex items-center px-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 mr-3 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900 flex-1">Predesigned Styles</h1>
      </div>
      
      <div className="px-4 pt-2 pb-16">
        {/* Display count of styles */}
        <div className="flex justify-end items-center mb-4">
          <div className="text-xs text-gray-500">
            {styles.length} style{styles.length !== 1 ? 's' : ''} found
          </div>
        </div>
        
        {/* Welcome Banner */}
        <div className="mb-4 bg-gradient-to-r from-plum/10 to-plum/5 rounded-xl p-4 border border-plum/10">
          <div className="flex">
            <div className="flex-1">
              <h2 className="text-lg font-semibold mb-1">Choose Your Style</h2>
              <p className="text-sm text-gray-600 mb-3">Select from our predesigned styles to get started. Click on any design to view details and customize.</p>
              <div className="flex items-center">
                <CheckCircle2 className="w-4 h-4 text-plum mr-1" />
                <span className="text-xs text-gray-700">Customizable</span>
                <CheckCircle2 className="w-4 h-4 text-plum ml-3 mr-1" />
                <span className="text-xs text-gray-700">High Quality</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Error state */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
            <h3 className="text-red-700 font-medium">Error Loading Styles</h3>
            <p className="text-red-600 text-sm">{error}</p>
            <Button
              variant="outline"
              className="mt-2 text-sm"
              onClick={fetchStyles}
            >
              Try Again
            </Button>
          </div>
        )}
        
        {/* Empty state */}
        {!loading && styles.length === 0 && !error && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
            <h3 className="text-gray-700 font-medium mb-2">No Styles Found</h3>
            <p className="text-gray-600 text-sm mb-4">We couldn't find any predesigned styles for this service.</p>
          </div>
        )}
        
        {/* Styles Grid */}
        {styles.length > 0 && (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
            {styles.map((style) => (
              <div key={style.id} className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                <div 
                  className="w-full aspect-[3/4] relative cursor-pointer"
                  onClick={() => handleStyleClick(style)}
                >
                  <ImageWithFallback 
                    src={style.imageUrl}
                    alt={style.name}
                    className="w-full h-full object-cover" 
                    fallbackSrc="/images/placeholder-design.jpg"
                    loading="lazy"
                    maxRetries={0}
                  />
                  <button 
                    className="absolute top-2 right-2 w-8 h-8 bg-white/70 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Toggle favorite (to be implemented)
                      toast({
                        title: "Feature Coming Soon",
                        description: "Saving favorites will be available soon.",
                      });
                    }}
                  >
                    <Heart className="h-4 w-4 text-gray-700" />
                  </button>
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-sm line-clamp-1">{style.name}</h3>
                  <div className="flex justify-between items-center mt-1">
                    <div className="text-plum font-medium">₹{style.price}</div>
                    <div className="text-xs text-gray-500">{style.configurations.blouseType}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PredesignedStylesPage;
