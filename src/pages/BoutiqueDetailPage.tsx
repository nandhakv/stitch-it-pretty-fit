import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Star, MapPin, Phone, ChevronLeft, Clock, CheckCircle2, Heart, Share2, MessageCircle, Scissors, ExternalLink, Palette, Shirt, PenTool, Sparkles, Brush, Ruler } from 'lucide-react';
import { Boutique, Service } from '../utils/types';
import { useOrder } from '../utils/OrderContext';
import { toast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

// Define extended types to match the API response
interface ApiService {
  id: string;
  name: string;
  description: string;
  price: {
    min: number;
    max: number;
  };
  imageUrl: string;
}

interface ApiBoutique extends Omit<Boutique, 'services'> {
  about?: string;
  specializations?: string[];
  services: ApiService[];
}

// Define types for design options
interface PredesignedStyle {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  configurations: {
    frontNeck: string;
    backNeck: string;
    embroidery: string;
    blouseType: string;
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
  const [showOptionsDialog, setShowOptionsDialog] = useState(false);
  const [showPredesignedDialog, setShowPredesignedDialog] = useState(false);
  const [predesignedStyles, setPredesignedStyles] = useState<PredesignedStyle[]>([]);

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

  const handleServiceSelect = (serviceId: string) => {
    if (boutique) {
      const service = boutique.services.find((s) => s.id === serviceId);
      if (service) {
        setSelectedService(service);
        setShowOptionsDialog(true);
      }
    }
  };

  // Handler for design option selection
  const handleDesignOptionSelect = (option: 'predesigned' | 'custom') => {
    setShowOptionsDialog(false);
    
    if (option === 'predesigned') {
      // Fetch predesigned styles and show dialog
      fetchPredesignedStyles();
    } else {
      // Navigate to the customization screen under nested routes for custom design
      if (selectedService && boutique) {
        // Convert the API service format to the app's Service type
        const appService: Service = {
          id: selectedService.id,
          name: selectedService.name,
          description: selectedService.description,
          image: selectedService.imageUrl,
          type: 'blouse' // Default type
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
          location: `${boutique.address.city}, ${boutique.address.pincode}`
        };
        
        updateOrder({ 
          boutique: appBoutique, 
          service: appService,
          designType: 'custom'
        });
        
        // Navigate to the customization screen under nested routes
        navigate(`/boutique/${boutique.id}/service/${selectedService.id}/custom-design`);
      }
    }
  };

  // Fetch predesigned styles
  const fetchPredesignedStyles = async () => {
    if (!selectedService) return;
    
    try {
      setLoading(true);
      // Mock data for now - would be replaced with actual API call
      const mockStyles: PredesignedStyle[] = [
        {
          id: "style1",
          name: "Classic Embroidered",
          imageUrl: "https://firebasestorage.googleapis.com/v0/b/stitch-it-pretty-fit.appspot.com/o/services%2Fblouse1.jpg?alt=media",
          price: 1299,
          configurations: {
            frontNeck: "Round",
            backNeck: "V-Shape",
            embroidery: "Floral",
            blouseType: "Princess Cut"
          }
        },
        {
          id: "style2",
          name: "Modern Cut",
          imageUrl: "https://firebasestorage.googleapis.com/v0/b/stitch-it-pretty-fit.appspot.com/o/services%2Fblouse2.jpg?alt=media",
          price: 1499,
          configurations: {
            frontNeck: "Sweetheart",
            backNeck: "Deep U",
            embroidery: "Minimal",
            blouseType: "Sleeveless"
          }
        },
        {
          id: "style3",
          name: "Traditional Silk",
          imageUrl: "https://firebasestorage.googleapis.com/v0/b/stitch-it-pretty-fit.appspot.com/o/services%2Fblouse3.jpg?alt=media",
          price: 1699,
          configurations: {
            frontNeck: "Square",
            backNeck: "Round",
            embroidery: "Heavy Gold",
            blouseType: "Full Sleeve"
          }
        },
        {
          id: "style4",
          name: "Contemporary Chic",
          imageUrl: "https://firebasestorage.googleapis.com/v0/b/stitch-it-pretty-fit.appspot.com/o/services%2Fblouse4.jpg?alt=media",
          price: 1899,
          configurations: {
            frontNeck: "Boat Neck",
            backNeck: "Keyhole",
            embroidery: "Sequin",
            blouseType: "Cap Sleeve"
          }
        }
      ];
      
      setPredesignedStyles(mockStyles);
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

  // Handle predesigned style selection
  const handlePredesignedSelect = (style: PredesignedStyle) => {
    setShowPredesignedDialog(false);
    
    if (selectedService && boutique) {
      // Convert to app types
      const appService: Service = {
        id: selectedService.id,
        name: selectedService.name,
        description: selectedService.description,
        image: selectedService.imageUrl,
        type: 'blouse' // Default type
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
        location: `${boutique.address.city}, ${boutique.address.pincode}`
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
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 mb-4"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            <span>Back</span>
          </button>
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
        <img
          src={boutique.imageUrls?.[0] || boutique.image || '/images/placeholder-boutique.jpg'}
          alt={boutique.name}
          className="w-full h-full object-cover transform scale-105"
          loading="eager" /* Hero image loads eagerly for better UX */
          onError={(e) => {
            e.currentTarget.src = '/images/placeholder-boutique.jpg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        
        {/* Boutique name and rating */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">{boutique.name}</h1>
            
            {/* Share and like buttons moved here */}
            <div className="flex items-center space-x-2">
              <button className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors" aria-label="Share boutique">
                <Share2 className="w-5 h-5 text-white" />
              </button>
              <button className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors" aria-label="Save to favorites">
                <Heart className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
          
          <div className="flex items-center mt-2">
            <div className="flex items-center bg-white/20 px-2.5 py-1 rounded-full">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="ml-1 text-sm font-medium">
                {boutique.rating}
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
                  <img 
                    src={service.imageUrl || '/images/placeholder-service.jpg'} 
                    alt={service.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = '/images/placeholder-service.jpg';
                    }}
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
                      <div className="flex items-center text-[10px] text-white/90">
                        <CheckCircle2 className="w-2.5 h-2.5 mr-1 text-green-300" />
                        <span>7-10d</span>
                      </div>
                      
                      <div className="rounded-full bg-plum text-white text-[10px] px-2.5 py-0.5 font-medium flex items-center">
                        Book Now <span className="ml-1">→</span>
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
                    {boutique.about || boutique.description || `${boutique.name} is a premium tailoring boutique specializing in custom-made women's clothing. With expert craftsmanship and attention to detail, we create beautiful garments tailored to your measurements and style preferences.`}
                  </p>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center">
                      <CheckCircle2 className="w-4 h-4 mr-2 text-plum" />
                      <span className="text-sm text-gray-700">Premium Fabrics</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle2 className="w-4 h-4 mr-2 text-plum" />
                      <span className="text-sm text-gray-700">Custom Designs</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle2 className="w-4 h-4 mr-2 text-plum" />
                      <span className="text-sm text-gray-700">Expert Tailors</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle2 className="w-4 h-4 mr-2 text-plum" />
                      <span className="text-sm text-gray-700">Alterations</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex flex-wrap gap-2">
                    {boutique.specializations?.map((specialization, index) => (
                      <span key={index} className="bg-plum/10 text-plum text-xs px-3 py-1 rounded-full">{specialization}</span>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Location */}
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden mt-6">
                <div className="p-5">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Location</h4>
                  
                  <div className="flex items-start mb-4">
                    <MapPin className="w-5 h-5 text-plum mr-3 mt-0.5" />
                    <div>
                      <p className="text-gray-700">
                        {boutique.address ? (
                          <>
                            {boutique.address.line1}<br />
                            {boutique.address.line2 && <>{boutique.address.line2}<br /></>}
                            {boutique.address.city}, {boutique.address.state}<br />
                            {boutique.address.pincode}
                          </>
                        ) : (
                          boutique.location || 'Address not available'
                        )}
                      </p>
                      <a 
                        href={`https://maps.google.com/?q=${boutique.address?.line1},${boutique.address?.city},${boutique.address?.pincode}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-plum text-sm font-medium mt-1 inline-flex items-center"
                      >
                        Get Directions
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </div>
                  </div>
                  
                  {/* Opening Hours */}
                  <div className="flex items-start">
                    <Clock className="w-5 h-5 text-plum mr-3 mt-0.5" />
                    <div>
                      <p className="text-gray-700">
                        {boutique.isOpen ? (
                          <span className="text-green-600 font-medium">Open now</span>
                        ) : (
                          <span className="text-red-500 font-medium">Closed now</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Contact Info */}
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden mt-6">
                <div className="p-5">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Contact</h4>
                  
                  <div className="flex items-start mb-4">
                    <Phone className="w-5 h-5 text-plum mr-3 mt-0.5" />
                    <div>
                      <p className="text-gray-700">+91 98765 43210</p>
                      <p className="text-gray-500 text-sm mt-0.5">Mon-Sat, 10am-8pm</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MessageCircle className="w-5 h-5 text-plum mr-3 mt-0.5" />
                    <div>
                      <p className="text-gray-700">Chat with us</p>
                      <p className="text-gray-500 text-sm mt-0.5">Usually responds within 30 mins</p>
                    </div>
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
      
      {/* Responsive Design Options - Dialog on Desktop, Sheet on Mobile */}
      {isDesktop ? (
        <Dialog open={showOptionsDialog} onOpenChange={setShowOptionsDialog}>
          <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
              <DialogTitle>Choose Design Option</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-3 py-2">
              <div 
                className="flex flex-col border rounded-lg overflow-hidden cursor-pointer hover:border-plum hover:shadow-sm transition-all"
                onClick={() => handleDesignOptionSelect('predesigned')}
              >
                <div className="h-28 bg-gradient-to-br from-plum/5 to-plum/20 flex items-center justify-center">
                  <div className="flex flex-col items-center">
                    <div className="bg-white rounded-full p-4 shadow-sm mb-2">
                      <Shirt className="w-10 h-10 text-plum" strokeWidth={1.5} />
                    </div>
                    <div className="flex items-center">
                      <Scissors className="w-3.5 h-3.5 text-plum mr-1" />
                      <Sparkles className="w-3.5 h-3.5 text-plum" />
                    </div>
                  </div>
                </div>
                <div className="p-2.5">
                  <h3 className="font-medium text-sm">Predesigned Styles</h3>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">Choose from our curated designs</p>
                </div>
              </div>
              
              <div 
                className="flex flex-col border rounded-lg overflow-hidden cursor-pointer hover:border-plum hover:shadow-sm transition-all"
                onClick={() => handleDesignOptionSelect('custom')}
              >
                <div className="h-28 bg-gradient-to-br from-blue-500/5 to-blue-500/20 flex items-center justify-center">
                  <div className="flex flex-col items-center">
                    <div className="bg-white rounded-full p-4 shadow-sm mb-2">
                      <Brush className="w-10 h-10 text-blue-500" strokeWidth={1.5} />
                    </div>
                    <div className="flex items-center">
                      <PenTool className="w-3.5 h-3.5 text-blue-500 mr-1" />
                      <Ruler className="w-3.5 h-3.5 text-blue-500" />
                    </div>
                  </div>
                </div>
                <div className="p-2.5">
                  <h3 className="font-medium text-sm">Custom Design</h3>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">Create your own unique design</p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      ) : (
        <Sheet open={showOptionsDialog} onOpenChange={setShowOptionsDialog}>
          <SheetContent side="bottom" className="h-[60vh] rounded-t-3xl">
            <SheetHeader className="text-left pb-0">
              <SheetTitle>Choose Design Option</SheetTitle>
            </SheetHeader>
            <div className="mt-4 space-y-3 overflow-auto">
              <div 
                className="flex border rounded-lg overflow-hidden cursor-pointer hover:border-plum"
                onClick={() => handleDesignOptionSelect('predesigned')}
              >
                <div className="w-24 h-24 bg-gradient-to-br from-plum/5 to-plum/20 flex-shrink-0 flex items-center justify-center">
                  <div className="bg-white rounded-full p-3 shadow-sm">
                    <Shirt className="w-8 h-8 text-plum" strokeWidth={1.5} />
                  </div>
                </div>
                <div className="p-3 flex-1 flex flex-col justify-center">
                  <h3 className="font-medium text-sm">Predesigned Styles</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Choose from our curated designs</p>
                </div>
              </div>
              
              <div 
                className="flex border rounded-lg overflow-hidden cursor-pointer hover:border-plum"
                onClick={() => handleDesignOptionSelect('custom')}
              >
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500/5 to-blue-500/20 flex-shrink-0 flex items-center justify-center">
                  <div className="bg-white rounded-full p-3 shadow-sm">
                    <Brush className="w-8 h-8 text-blue-500" strokeWidth={1.5} />
                  </div>
                </div>
                <div className="p-3 flex-1 flex flex-col justify-center">
                  <h3 className="font-medium text-sm">Custom Design</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Create your own unique design</p>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}
      
      {/* Predesigned Styles - Dialog on Desktop, Sheet on Mobile */}
      {isDesktop ? (
        <Dialog open={showPredesignedDialog} onOpenChange={setShowPredesignedDialog}>
          <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Select a Predesigned Style</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              {predesignedStyles.map(style => (
                <div 
                  key={style.id}
                  className="border rounded-lg overflow-hidden cursor-pointer hover:border-plum hover:shadow-md transition-all"
                  onClick={() => handlePredesignedSelect(style)}
                >
                  <img 
                    src={style.imageUrl} 
                    alt={style.name}
                    className="w-full h-48 object-cover transition-transform hover:scale-105 duration-300"
                    loading="lazy"
                  />
                  <div className="p-4">
                    <h3 className="font-medium text-lg">{style.name}</h3>
                    <p className="text-sm text-plum font-medium mt-1">₹{style.price}</p>
                    <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2">
                      <div className="text-xs text-gray-600 flex items-center">
                        <span className="w-2 h-2 bg-plum/60 rounded-full mr-1.5"></span>
                        Front: {style.configurations.frontNeck}
                      </div>
                      <div className="text-xs text-gray-600 flex items-center">
                        <span className="w-2 h-2 bg-plum/60 rounded-full mr-1.5"></span>
                        Back: {style.configurations.backNeck}
                      </div>
                      <div className="text-xs text-gray-600 flex items-center">
                        <span className="w-2 h-2 bg-plum/60 rounded-full mr-1.5"></span>
                        Embroidery: {style.configurations.embroidery}
                      </div>
                      <div className="text-xs text-gray-600 flex items-center">
                        <span className="w-2 h-2 bg-plum/60 rounded-full mr-1.5"></span>
                        Type: {style.configurations.blouseType}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      ) : (
        <Sheet open={showPredesignedDialog} onOpenChange={setShowPredesignedDialog}>
          <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl">
            <SheetHeader className="text-left pb-0">
              <SheetTitle>Select a Predesigned Style</SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-4 overflow-auto pb-6">
              {predesignedStyles.map(style => (
                <div 
                  key={style.id}
                  className="border rounded-xl overflow-hidden cursor-pointer hover:border-plum mb-4"
                  onClick={() => handlePredesignedSelect(style)}
                >
                  <img 
                    src={style.imageUrl} 
                    alt={style.name}
                    className="w-full h-48 object-cover"
                    loading="lazy"
                  />
                  <div className="p-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">{style.name}</h3>
                      <p className="text-sm text-plum font-medium">₹{style.price}</p>
                    </div>
                    <div className="mt-3 space-y-1.5">
                      <div className="text-xs text-gray-600 flex items-center">
                        <span className="w-2 h-2 bg-plum/60 rounded-full mr-1.5"></span>
                        Front: {style.configurations.frontNeck}
                      </div>
                      <div className="text-xs text-gray-600 flex items-center">
                        <span className="w-2 h-2 bg-plum/60 rounded-full mr-1.5"></span>
                        Back: {style.configurations.backNeck}
                      </div>
                      <div className="text-xs text-gray-600 flex items-center">
                        <span className="w-2 h-2 bg-plum/60 rounded-full mr-1.5"></span>
                        Embroidery: {style.configurations.embroidery}
                      </div>
                      <div className="text-xs text-gray-600 flex items-center">
                        <span className="w-2 h-2 bg-plum/60 rounded-full mr-1.5"></span>
                        Type: {style.configurations.blouseType}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      )}
  </>
  );
};

export default BoutiqueDetailPage;
