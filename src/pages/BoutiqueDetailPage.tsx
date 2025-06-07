import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Star, MapPin, Phone, ChevronLeft, Clock, CheckCircle2, Heart, Share2, MessageCircle, Scissors, ExternalLink, Palette, Shirt, PenTool, Sparkles, Brush, Ruler, Loader, ArrowRight } from 'lucide-react';
import { Service } from '../utils/types';
import { useOrder } from '../utils/OrderContext';
import { toast } from "@/components/ui/use-toast";
import { DesignOptionsModal, StyleGalleryModal, UploadReferenceModal, StyleCustomizationModal } from '@/components/ServiceCustomization';
import MaterialSelectionModal, { MaterialSelection } from '@/components/ServiceCustomization/MaterialSelectionModal';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import OptimizedImage from '@/components/ui/optimized-image';
import { getServiceDetails, getPredesignedStyles, getMaterials, MaterialsResponse } from '../services/api';

// Define extended types to match the API response
export interface ApiService {
  id: string;
  name: string;
  description: string;
  price: {
    min: number;
    max: number;
  };
  imageUrl: string;
}

interface ApiBoutique {
  id: string;
  name: string;
  description: string;
  about?: string;
  ratings: number; // Note: using ratings (not rating) to match our Boutique interface
  reviewCount: number;
  coverImageUrl: string;
  phoneNumber?: string;
  email?: string;
  specializations?: string[];
  services: ApiService[];
  // For backward compatibility with existing code
  imageUrls?: string[];
  image?: string;
  isOpen?: boolean;
  featured?: boolean;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
}

// Define types for design options
export interface Boutique {
  id: string;
  name: string;
  description: string;
  ratings: number;
  reviewCount: number;
  coverImageUrl: string;
  phoneNumber?: string;
  email?: string;
}

export interface PredesignedStyle {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  discount: number;
  finalPrice: number;
  estimatedDays: number;
  isCustomizable: boolean;
  thumbnail?: string;
  imageUrls?: string[];
  category?: string;
  popularity?: number;
  boutique?: Boutique;
  presetSpecifications?: {
    collarStyle?: string;
    cuffStyle?: string;
    embroidery?: string;
    fabric?: string;
    color?: string;
    [key: string]: any;
  };
  configurations: {
    frontNeck: string;
    backNeck: string;
    embroidery: string;
    blouseType: string;
    color?: string;
    buttons?: string;
  };
}

// Add a custom hook for media query if it doesn't exist
const useMediaQueryFallback = (query: string): boolean => {
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);
    
    const listener = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };
    
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);
  
  return matches;
};

const BoutiqueDetailPage: React.FC = () => {
  const { boutiqueId } = useParams<{ boutiqueId: string }>();
  const navigate = useNavigate();
  const { updateOrder } = useOrder();
  const [boutique, setBoutique] = useState<ApiBoutique | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Use our media query hook
  const isDesktop = useMediaQueryFallback("(min-width: 768px)");
  
  // New state for dialogs and selection flow
  const [selectedService, setSelectedService] = useState<ApiService | null>(null);
  const [showMaterialDialog, setShowMaterialDialog] = useState(false);
  const [showPredesignedDialog, setShowPredesignedDialog] = useState(false);
  const [predesignedStyles, setPredesignedStyles] = useState<PredesignedStyle[]>([]);
  const [showServiceDetailsSheet, setShowServiceDetailsSheet] = useState(false);
  const [serviceDetailsLoading, setServiceDetailsLoading] = useState(false);
  const [serviceDetails, setServiceDetails] = useState<any>(null);
  const [materialsData, setMaterialsData] = useState<MaterialsResponse | null>(null);
  const [materialsLoading, setMaterialsLoading] = useState(false);

  useEffect(() => {
    const fetchBoutiqueDetails = async () => {
      if (!boutiqueId) {
        setError('Boutique ID is missing');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3001/api/boutiques/${boutiqueId}`);
        const data = await response.json();

        if (data.success) {
          console.log('Boutique details fetched:', data.data.boutique);
          setBoutique(data.data.boutique);
        } else {
          console.error('Failed to fetch boutique details:', data.error);
          setError(data.error || 'Failed to fetch boutique details');
          toast({
            title: "Error",
            description: data.error || "Failed to load boutique details",
            variant: "destructive"
          });
        }
      } catch (err) {
        console.error('Error fetching boutique details:', err);
        setError('Failed to fetch boutique details');
        toast({
          title: "Error",
          description: "Failed to load boutique details",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBoutiqueDetails();
  }, [boutiqueId]);

  const handleServiceSelect = async (serviceId: string) => {
    if (boutique) {
      const service = boutique.services.find((s) => s.id === serviceId);
      if (service) {
        setSelectedService(service);
        setMaterialsLoading(true);
        
        try {
          // Fetch service details and materials data in parallel
          const [serviceDetailsResponse, materialsResponse] = await Promise.all([
            getServiceDetails(serviceId, boutiqueId),
            getMaterials(serviceId, { boutiqueId })
          ]);
          
          console.log('Service details API response:', serviceDetailsResponse);
          console.log('Materials API response:', materialsResponse);
          
          setServiceDetails(serviceDetailsResponse);
          setMaterialsData(materialsResponse);
          
          // Skip showing service details sheet and directly open material dialog
          setShowMaterialDialog(true);
        } catch (error) {
          console.error('Error fetching service data:', error);
          toast({
            title: "Error",
            description: "Failed to load service data. Please try again.",
            variant: "destructive"
          });
        } finally {
          setServiceDetailsLoading(false);
          setMaterialsLoading(false);
        }
      }
    }
  };
  
  // Function to proceed to service options
  const handleProceedToServiceOptions = () => {
    setShowServiceDetailsSheet(false);
    setShowMaterialDialog(true);
  };

  // State for new popup-based flow modals
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCustomizationModal, setShowCustomizationModal] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedPredesignedStyle, setSelectedPredesignedStyle] = useState<PredesignedStyle | null>(null);
  
  // Handler for material selection and design option selection
  const handleMaterialAndDesignSelect = (
    materialSelection: MaterialSelection,
    option: 'predesigned' | 'custom'
  ) => {
    console.log('Material and design selection handler called:', { materialSelection, option });
    
    if (selectedService && boutique) {
      // Convert the API service format to the app's Service type
      const appService: Service = {
        id: selectedService.id,
        name: selectedService.name,
        description: selectedService.description,
        image: selectedService.imageUrl,
        type: getServiceType(selectedService.name) as 'blouse' | 'lehenga'
      };
      
      // Convert the API boutique format to the app's Boutique type
      const appBoutique: Boutique = {
        id: boutique.id,
        name: boutique.name,
        description: boutique.description,
        address: boutique.address,
        rating: boutique.rating,
        reviewCount: boutique.reviewCount,
        imageUrls: boutique.imageUrls,
        services: boutique.services.map(s => s.id),
        isOpen: boutique.isOpen,
        featured: boutique.featured,
        image: boutique.imageUrls[0],
        location: boutique.address && boutique.address.city ? `${boutique.address.city}, ${boutique.address.pincode || ''}` : 'Unknown location'
      };
      
      // Update order context with selection including material info
      updateOrder({ 
        boutique: appBoutique, 
        service: appService,
        designType: option,
        materialSelection: materialSelection
      });
      
      // First close the modal
      setShowMaterialDialog(false);
      
      // Then perform navigation based on user selection
      console.log(`Navigating to ${option === 'predesigned' ? 'predesigned styles' : 'custom design'} page`);
      
      // Execute navigation with a small delay to ensure state updates complete
      setTimeout(() => {
        if (option === 'predesigned') {
          navigate(`/boutique/${boutique.id}/service/${selectedService.id}/predesigned-styles`);
        } else {
          navigate(`/boutique/${boutique.id}/service/${selectedService.id}/custom-design`);
        }
      }, 100);
    } else {
      console.error('Missing service or boutique data for navigation');
      // Close the modal even if there's an error
      setShowMaterialDialog(false);
    }
  };

  // Fetch predesigned styles
  const fetchPredesignedStyles = async () => {
    if (!selectedService) return;
    
    try {
      setLoading(true);
      
      // Fetch predesigned styles from API using selectedService.id
      if (!selectedService || !selectedService.id) {
        throw new Error('Service ID is required');
      }
      
      const options = {
        // Add any required filters
      };
      
      // Call the API to get predesigned styles
      const response = await getPredesignedStyles(selectedService.id, options);
      
      // Check for proper response structure based on the API format
      if (!response.data || !response.data.styles) {
        throw new Error('Invalid API response format');
      }
      
      // Process the API response and map to PredesignedStyle format
      const apiStyles = response.data.styles.map(style => {
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
            : '');
        
        // Use attributes to determine configurations
        const necklineOptions = attributes?.neckline || [];
        const backOptions = attributes?.back || [];
        const sleeveOptions = attributes?.sleeve || [];

        return {
          id: style.id,
          name: style.name,
          imageUrl: imageUrl,
          price: style.price,
          configurations: {
            frontNeck: necklineOptions[0] || '',
            backNeck: backOptions[0] || '',
            embroidery: '',
            blouseType: sleeveOptions[0] || style.category || ''
          }
        };
      });
      
      setPredesignedStyles(apiStyles);
      setShowPredesignedDialog(true);
    } catch (error) {
      console.error('Error fetching predesigned styles:', error);
      toast({
        title: "Error",
        description: "Failed to load predesigned styles",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle predesigned style selection - when user chooses "Select As Is"
  const handlePredesignedSelect = (style: PredesignedStyle) => {
    setShowPredesignedDialog(false);
    
    if (selectedService && boutique) {
      // Convert to app types
      const appService: Service = {
        id: selectedService.id,
        name: selectedService.name,
        description: selectedService.description,
        image: selectedService.imageUrl,
        type: getServiceType(selectedService.name) as 'blouse' | 'lehenga' // Get service type based on name
      };
      
      const appBoutique: Boutique = {
        id: boutique.id,
        name: boutique.name,
        description: boutique.description,
        address: boutique.address,
        rating: boutique.rating,
        reviewCount: boutique.reviewCount,
        imageUrls: boutique.imageUrls,
        services: boutique.services.map(s => s.id),
        isOpen: boutique.isOpen,
        featured: boutique.featured,
        image: boutique.imageUrls[0],
        location: boutique.address && boutique.address.city ? `${boutique.address.city}, ${boutique.address.pincode || ''}` : 'Unknown location'
      };
      
      // Update order context with predesigned selection
      updateOrder({ 
        boutique: appBoutique, 
        service: appService,
        designType: 'predesigned',
        predesignedStyle: {
          id: style.id,
          name: style.name,
          price: style.price,
          image: style.imageUrl
        }
      });
      
      // Navigate to measurements page
      navigate(`/measurements`);
    }
  };
  
  // Handle "Customize This Style" for predesigned styles
  const handleCustomizePredesignedStyle = (style: PredesignedStyle) => {
    setShowPredesignedDialog(false);
    setSelectedPredesignedStyle(style);
    setShowCustomizationModal(true);
  };
  
  // Handle uploaded image
  const handleImageUploaded = (imageUrl: string) => {
    setShowUploadModal(false);
    setUploadedImage(imageUrl);
    setShowCustomizationModal(true);
  };
  
  // Handle completion of customization
  const handleCustomizationComplete = (customizations: Record<string, string>) => {
    setShowCustomizationModal(false);
    
    if (selectedService && boutique) {
      // Convert to app types
      const appService: Service = {
        id: selectedService.id,
        name: selectedService.name,
        description: selectedService.description,
        image: selectedService.imageUrl,
        type: getServiceType(selectedService.name) as 'blouse' | 'lehenga' // Get service type based on name
      };
      
      const appBoutique: Boutique = {
        id: boutique.id,
        name: boutique.name,
        description: boutique.description,
        address: boutique.address,
        rating: boutique.rating,
        reviewCount: boutique.reviewCount,
        imageUrls: boutique.imageUrls,
        services: boutique.services.map(s => s.id),
        isOpen: boutique.isOpen,
        featured: boutique.featured,
        image: boutique.imageUrls[0],
        location: boutique.address && boutique.address.city ? `${boutique.address.city}, ${boutique.address.pincode || ''}` : 'Unknown location'
      };
      
      // Determine design type and update order context
      const designType = selectedPredesignedStyle ? 'predesigned-customized' : 'custom';
      const orderUpdate: any = { 
        boutique: appBoutique, 
        service: appService,
        designType,
        customizations
      };
      
      // Add uploaded image or predesigned style info if applicable
      if (uploadedImage) {
        orderUpdate.referenceImage = uploadedImage;
      }
      
      if (selectedPredesignedStyle) {
        orderUpdate.predesignedStyle = {
          id: selectedPredesignedStyle.id,
          name: selectedPredesignedStyle.name,
          price: selectedPredesignedStyle.price,
          image: selectedPredesignedStyle.imageUrl
        };
      }
      
      updateOrder(orderUpdate);
      
      // Navigate to measurements page
      navigate(`/measurements`);
    }
  };
  
  // Helper function to determine service type based on service name
  const getServiceType = (serviceName: string): string => {
    const nameLower = serviceName.toLowerCase();
    if (nameLower.includes('blouse')) return 'blouse';
    if (nameLower.includes('dress')) return 'dress';
    if (nameLower.includes('skirt')) return 'skirt';
    if (nameLower.includes('shirt') || nameLower.includes('top')) return 'top';
    if (nameLower.includes('pant') || nameLower.includes('trouser')) return 'pants';
    if (nameLower.includes('saree')) return 'saree';
    if (nameLower.includes('kurta')) return 'kurta';
    return 'other';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="fixed inset-0 flex justify-center items-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-plum/20 border-t-plum rounded-full animate-spin mb-4"></div>
            <p className="text-plum font-medium">Loading boutique details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!boutique || error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="p-4">
          {!isDesktop && (
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 mb-4"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              <span>Back</span>
            </button>
          )}
          <div className="text-center py-8">
            <p className="text-gray-500">{error || 'Boutique not found'}</p>
            <button 
              onClick={() => navigate('/boutiques')}
              className="mt-4 bg-plum hover:bg-plum/90 text-white font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Browse All Boutiques
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Boutique Hero Image with Parallax Effect */}
      <div className="relative h-48 md:h-56 overflow-hidden">
        <OptimizedImage
          src={boutique.coverImageUrl || boutique.imageUrls?.[0] || boutique.image || '/images/placeholder-boutique.jpg'}
          alt={boutique.name}
          className="transform scale-105"
          objectFit="cover"
          fallbackSrc="/images/placeholder-boutique.jpg"
          priority={true} /* Hero image loads with priority for better UX */
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        
        {/* Boutique name and rating */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div>
            <h1 className="text-3xl font-bold">{boutique.name}</h1>
          </div>
          
          <div className="flex items-center mt-2">
            <div className="flex items-center bg-white/20 px-2.5 py-1 rounded-full">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="ml-1 text-sm font-medium">
                {boutique.ratings || boutique.rating}
              </span>
            </div>
            <span className="ml-2 text-sm opacity-90">({boutique.reviewCount} reviews)</span>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        {/* Desktop layout with side-by-side About and Services */}
        <div className="md:flex md:gap-8 mb-8">
          {/* Services Section - First on mobile, Right side on desktop */}
          <div className="md:order-2 md:w-2/3 lg:w-3/4 mb-8 md:mb-0">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Services</h3>
            </div>
            
            <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {boutique.services.map((service) => (
                <div
                  key={service.id}
                  className="group relative aspect-square overflow-hidden rounded-lg cursor-pointer"
                  onClick={() => handleServiceSelect(service.id)}
                >
                  {/* Compact image display */}
                  <OptimizedImage 
                    src={service.imageUrl || '/images/placeholder-service.jpg'} 
                    alt={service.name}
                    className="transition-transform duration-300 group-hover:scale-105"
                    objectFit="cover"
                    fallbackSrc="/images/placeholder-service.jpg"
                    aspectRatio="aspect-auto"
                  />
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-90"></div>
                  
                  {/* Minimal content overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-2 flex flex-col justify-end text-white">
                    <div className="flex flex-col">
                      <h4 className="text-xs font-semibold line-clamp-1 text-white">{service.name}</h4>
                      <div className="text-white/90 text-[10px] font-medium mt-0.5">
                        From ₹{service.price?.min || 499}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="rounded-full bg-plum text-white text-[10px] px-2.5 py-0.5 font-medium flex items-center">
                        View Details <span className="ml-1">→</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* About Section - Second on mobile, Left side on desktop */}
          <div className="md:order-1 md:w-1/3 lg:w-1/4">
            <div className="sticky top-20">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-800">About</h3>
              </div>
              
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="p-5">
                  <p className="text-gray-700 leading-relaxed">
                    {boutique.about || boutique.description}
                  </p>
                  
                  {/* Only show specializations if they're coming from the API */}
                  {boutique.specializations && boutique.specializations.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {boutique.specializations.map((specialization, index) => (
                        <div key={index} className="flex items-center">
                          <CheckCircle2 className="w-4 h-4 mr-2 text-plum" />
                          <span className="text-sm text-gray-700">{specialization}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="mt-6 flex flex-wrap gap-2">
                    {boutique.specializations?.map((specialization, index) => (
                      <span key={index} className="bg-plum/10 text-plum text-xs px-3 py-1 rounded-full">{specialization}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Reviews Teaser */}
      <div className="container mx-auto px-4 mb-8">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Customer Reviews</h3>
            <span className="text-plum text-sm font-medium">See all</span>
          </div>
          
          <div className="px-5 py-4">
            <div className="flex items-center mb-4">
              <div className="flex mr-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < Math.floor(boutique.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                ))}
              </div>
              <span className="text-lg font-medium">{boutique.rating}</span>
              <span className="text-gray-500 text-sm ml-2">({boutique.reviewCount} reviews)</span>
            </div>
            
            <div className="space-y-4">
              {[1, 2].map((_, i) => (
                <div key={i} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-200 mr-2"></div>
                      <span className="font-medium">Customer {i+1}</span>
                    </div>
                    <div className="flex">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className={`w-3 h-3 ${j < 5 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">Excellent service and quality. The tailoring was perfect and delivered on time. Would definitely recommend!</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      </div>
      
      {/* Material and Design Selection Modal */}
      <MaterialSelectionModal
        isOpen={showMaterialDialog}
        onClose={() => setShowMaterialDialog(false)}
        service={selectedService}
        materialsData={materialsData}
        materialsLoading={materialsLoading}
        onContinue={handleMaterialAndDesignSelect}
      />
      
      <StyleGalleryModal
        isOpen={showPredesignedDialog}
        onClose={() => setShowPredesignedDialog(false)}
        styles={predesignedStyles}
        serviceName={selectedService?.name || 'Style'}
        onSelectStyle={handlePredesignedSelect}
        onCustomizeStyle={handleCustomizePredesignedStyle}
        isLoading={loading}
      />
      
      <UploadReferenceModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        serviceName={selectedService?.name || 'Design'}
        onImageUploaded={handleImageUploaded}
      />
      
      <StyleCustomizationModal
        isOpen={showCustomizationModal}
        onClose={() => setShowCustomizationModal(false)}
        serviceName={selectedService?.name || 'Design'}
        preselectedStyle={selectedPredesignedStyle || undefined}
        uploadedImageUrl={uploadedImage || undefined}
        onComplete={handleCustomizationComplete}
      />
      
      {/* Service Details Bottom Sheet */}
      <Sheet open={showServiceDetailsSheet} onOpenChange={setShowServiceDetailsSheet}>
        <SheetContent className="w-full sm:max-w-md p-0">
          <div className="h-full flex flex-col">
            {/* Header */}
            <SheetHeader className="p-6 border-b">
              <SheetTitle className="text-xl">{selectedService?.name || 'Service Details'}</SheetTitle>
            </SheetHeader>
            
            {/* Content */}
            <div className="flex-1 overflow-auto p-6">
              {serviceDetailsLoading ? (
                <div className="flex justify-center items-center h-40">
                  <Loader className="w-8 h-8 animate-spin text-plum" />
                </div>
              ) : serviceDetails ? (
                <div className="space-y-6">
                  {/* Service Image */}
                  <div className="bg-gray-100 rounded-lg overflow-hidden aspect-video">
                    <OptimizedImage 
                      src={selectedService?.imageUrl || '/images/placeholder-service.jpg'} 
                      alt={selectedService?.name || 'Service'}
                      objectFit="cover"
                      fallbackSrc="/images/placeholder-service.jpg"
                      aspectRatio="aspect-video"
                    />
                  </div>
                  
                  {/* Service Details */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{serviceDetails.name}</h3>
                    <p className="text-gray-600 mt-2">{serviceDetails.description}</p>
                  </div>
                  
                  {/* Pricing Info */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Pricing</h4>
                    {boutiqueId && serviceDetails.boutiqueSpecific ? (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Price Range</span>
                        <span className="font-semibold text-gray-900">{serviceDetails.boutiqueSpecific.priceRange}</span>
                      </div>
                    ) : (
                      <div className="text-gray-600">
                        Price depends on design complexity and material selection.
                      </div>
                    )}
                  </div>
                  
                  {/* Design Options */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Design Options</h4>
                    <div className="space-y-2">
                      {serviceDetails.designOptions?.hasPredesigned && (
                        <div className="flex items-center">
                          <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                          <span className="text-gray-600">Pre-designed styles available</span>
                        </div>
                      )}
                      {serviceDetails.designOptions?.hasCustom && (
                        <div className="flex items-center">
                          <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                          <span className="text-gray-600">Custom designs accepted</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Material Options */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Material Options</h4>
                    <div className="space-y-2">
                      {serviceDetails.materialOptions?.sellsMaterial && (
                        <div className="flex items-center">
                          <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                          <span className="text-gray-600">Boutique provides materials</span>
                        </div>
                      )}
                      {serviceDetails.materialOptions?.acceptsCustomMaterial && (
                        <div className="flex items-center">
                          <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                          <span className="text-gray-600">You can bring your own material</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Boutique-specific Information */}
                  {boutiqueId && serviceDetails.boutiqueSpecific && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Additional Information</h4>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Available Slots</span>
                          <span className="font-semibold text-gray-900">{serviceDetails.boutiqueSpecific.availableSlots}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Estimated Delivery</span>
                          <span className="font-semibold text-gray-900">{serviceDetails.boutiqueSpecific.estimatedDeliveryDays}</span>
                        </div>
                        
                        {serviceDetails.boutiqueSpecific.specialOffers?.length > 0 && (
                          <div className="pt-2">
                            <h5 className="text-sm font-medium text-gray-700 mb-2">Special Offers</h5>
                            <ul className="space-y-1">
                              {serviceDetails.boutiqueSpecific.specialOffers.map((offer: string, idx: number) => (
                                <li key={idx} className="text-sm text-gray-600 flex items-start">
                                  <span className="text-plum mr-2">•</span>
                                  {offer}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Service details could not be loaded.
                </div>
              )}
            </div>
            
            {/* Footer with action button */}
            <div className="border-t p-6">
              <Button 
                className="w-full bg-plum hover:bg-plum/90" 
                onClick={handleProceedToServiceOptions}
                disabled={serviceDetailsLoading}
              >
                Proceed to Customization <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default BoutiqueDetailPage;
