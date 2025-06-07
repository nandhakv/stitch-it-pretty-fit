import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import ImageWithFallback from '../components/ImageWithFallback';
import { ArrowLeft, CheckCircle2, Sparkles, Heart, ArrowRight, ChevronDown } from 'lucide-react';
import { getStyleDetails } from '../services/api';
import { useOrder } from '../utils/OrderContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PredesignedStyle } from './BoutiqueDetailPage';
import { DesignOption } from '../utils/types';
import { toast } from '@/components/ui/use-toast';
import IncludedConfigurations from '@/components/IncludedConfigurations';

// Define types
interface LocationState {
  style?: PredesignedStyle;
}

// Extended PredesignedStyle interface to include the API properties
// Import the Review interface
import { Review } from '../services/api/designApi';

interface ExtendedPredesignedStyle extends PredesignedStyle {
  customizationOptions?: Array<{
    name: string;
    id: string;
    options: string[] | Array<{name: string; isDefault?: boolean}>;
    defaultValue?: string;
  }>;
  presetConfigurations?: Record<string, string | boolean>;
  features?: string[];
  description?: string;
  additionalDetails?: Record<string, string>;
  isPredesigned?: boolean;
  rating?: number;
  reviewCount?: number;
  reviews?: any[];
  imageUrl: string;
  imageUrls?: string[];
}

interface CustomizationOptions {
  frontNeck: string[];
  backNeck: string[];
  embroidery: string[];
  blouseType: string[];
  color: string[];
  buttons: string[];
}

const StyleDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { boutiqueId, serviceId, styleId } = useParams<{ boutiqueId: string; serviceId: string; styleId: string }>();
  const location = useLocation();
  const { order, updateOrder } = useOrder();
  const [style, setStyle] = useState<ExtendedPredesignedStyle | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [customizedStyle, setCustomizedStyle] = useState<ExtendedPredesignedStyle | null>(null);
  const [customizationOptions, setCustomizationOptions] = useState<CustomizationOptions>({
    frontNeck: [],
    backNeck: [],
    embroidery: [],
    blouseType: [],
    color: [],
    buttons: []
  });
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [priceAdjustments, setPriceAdjustments] = useState<Record<string, number>>({});

  useEffect(() => {
    // Always fetch the style data based on styleId to ensure API call is made
    fetchStyleData();
  }, [styleId]);
  
  useEffect(() => {
    if (customizedStyle) {
      // Calculate adjusted price based on customizations
      let adjustedPrice = style ? style.price : 0;
      Object.values(priceAdjustments).forEach(adjustment => {
        adjustedPrice += adjustment;
      });
      
      setTotalPrice(adjustedPrice);
    }
  }, [customizedStyle, priceAdjustments]);

  const fetchCustomizationOptions = (apiStyleData: any) => {
    // Use the API data instead of mock data
    if (!apiStyleData || !apiStyleData.customizationOptions) {
      console.error('No customization options available from API');
      return;
    }
    
    console.log('API customization options:', apiStyleData.customizationOptions);
    
    // Extract customization options directly from the API response
    const apiOptions = apiStyleData.customizationOptions;
    
    // Create a mapping for our UI structure
    const mappedOptions: CustomizationOptions = {
      frontNeck: [],
      backNeck: [],
      embroidery: [],
      blouseType: [],
      color: [],
      buttons: []
    };
    
    // Map the API options to our UI structure
    apiOptions.forEach((option: any) => {
      console.log('Processing option:', option);
      
      // Helper function to extract string values from option array
      const extractOptions = (optArray: any[]): string[] => {
        return optArray.map((opt: any) => 
          typeof opt === 'string' ? opt : opt.name || ''
        ).filter(Boolean);
      };
      
      // Log each option ID and name for debugging
      console.log(`Processing option ID: ${option.id}, Name: ${option.name}`);
      
      if (option.id === 'collarStyle') {
        // Map collarStyle from API to frontNeck in our UI
        console.log('Mapping collarStyle to frontNeck:', option.options);
        if (Array.isArray(option.options)) {
          mappedOptions.frontNeck = extractOptions(option.options);
        }
      } else if (option.id === 'cuffStyle') {
        // Map cuffStyle from API to backNeck in our UI
        console.log('Mapping cuffStyle to backNeck:', option.options);
        if (Array.isArray(option.options)) {
          mappedOptions.backNeck = extractOptions(option.options);
        }
      } else if (option.id === 'pocket' || option.id === 'fabric') {
        // These could be considered embroidery options in our UI
        if (Array.isArray(option.options)) {
          const values = extractOptions(option.options);
          mappedOptions.embroidery = [...mappedOptions.embroidery, ...values];
        }
      } else if (option.id === 'fit') {
        if (Array.isArray(option.options)) {
          mappedOptions.blouseType = extractOptions(option.options);
        }
      } else if (option.id === 'color') {
        if (Array.isArray(option.options)) {
          mappedOptions.color = extractOptions(option.options);
        }
      } else if (option.id === 'buttons') {
        if (Array.isArray(option.options)) {
          mappedOptions.buttons = extractOptions(option.options);
        }
      }
    });
    
    setCustomizationOptions(mappedOptions);
    
    // Calculate price adjustments based on material and complexity
    const priceAdj: Record<string, number> = {};
    
    // Add premium options with price adjustments
    priceAdj['Silk Blend'] = 300;
    priceAdj['Oxford'] = 200;
    priceAdj['Horn'] = 150;
    priceAdj['Mother of Pearl'] = 200;
    priceAdj['Double'] = 100;
    
    setPriceAdjustments(priceAdj);
  };
  
  const fetchStyleData = async () => {
    setLoading(true);
    try {
      if (!styleId) {
        throw new Error('Style ID is required');
      }
      
      console.log(`Fetching style details for styleId: ${styleId}`);
      // Fetch style details from API
      const styleDetails = await getStyleDetails(styleId);
      console.log('API Response:', styleDetails);
      
      // Convert API response to the format expected by the component
      const styleData: ExtendedPredesignedStyle = {
        id: styleDetails.id,
        name: styleDetails.name,
        // Ensure we handle imageUrls as an array and imageUrl is always a string
        imageUrl: styleDetails.thumbnail || 
          (Array.isArray(styleDetails.imageUrls) && styleDetails.imageUrls.length > 0 ? 
            styleDetails.imageUrls[0] : 
            (typeof styleDetails.imageUrls === 'string' ? styleDetails.imageUrls : '')),
        imageUrls: Array.isArray(styleDetails.imageUrls) ? styleDetails.imageUrls : styleDetails.imageUrls ? [styleDetails.imageUrls] : [],
        price: styleDetails.price,
        configurations: styleDetails.presetSpecifications ? {
          frontNeck: styleDetails.presetSpecifications.collarStyle || '',
          backNeck: styleDetails.presetSpecifications.cuffStyle || '',
          embroidery: styleDetails.presetSpecifications.embroidery || '',
          blouseType: styleDetails.category || ''
        } : {
          frontNeck: '',
          backNeck: '',
          embroidery: '',
          blouseType: styleDetails.category || ''
        },
        customizationOptions: styleDetails.customizationOptions,
        features: styleDetails.features,
        presetConfigurations: styleDetails.presetSpecifications,
        isPredesigned: styleDetails.isPredesigned,
        description: styleDetails.description,
        // Include rating, reviewCount, and reviews directly from API response
        rating: styleDetails.rating,
        reviewCount: styleDetails.reviewCount,
        reviews: styleDetails.reviews
      };
      
      if (styleData) {
        setStyle(styleData);
        setCustomizedStyle(styleData);
        // Pass the API data to fetchCustomizationOptions
        fetchCustomizationOptions(styleDetails);
      } else {
        toast({
          title: "Error",
          description: "Style not found",
          variant: "destructive"
        });
        navigate(`/boutique/${boutiqueId}/service/${serviceId}/predesigned-styles`);
      }
    } catch (error) {
      console.error('Error fetching style details:', error);
      toast({
        title: "Error",
        description: "Failed to load style details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAsIs = () => {
    if (!style) return;
    
    updateOrder({
      ...order,
      predesignedStyle: {
        id: style.id,
        name: style.name,
        price: style.price,
        image: style.imageUrl
      }
    });
    
    navigate('/measurements');
  };
  
  const toggleCustomization = () => {
    // Show a message to the user that we're entering customization mode using the API data
    console.log('Toggling customization mode with API data');
    
    // Get price adjustments from API response
    if (style?.customizationOptions && !isCustomizing) {
      // Log that we're using API data for customization
      console.log('Using API customization options:', style.customizationOptions);
    }
    
    setIsCustomizing(!isCustomizing);
  };
  
  const handleOptionChange = (optionType: string, value: string) => {
    if (!customizedStyle) return;
    
    console.log(`Changing ${optionType} to ${value} using API data`);
    
    if (optionType === 'frontNeck' || optionType === 'backNeck' || optionType === 'embroidery' || optionType === 'blouseType') {
      // Clone the customized style and update the specific configuration
      setCustomizedStyle({
        ...customizedStyle,
        configurations: {
          ...customizedStyle.configurations,
          [optionType]: value
        }
      });
      
      // Update the presetConfigurations based on our mapping
      const presetKey = 
        optionType === 'frontNeck' ? 'collarStyle' : 
        optionType === 'backNeck' ? 'cuffStyle' : 
        optionType === 'embroidery' && value.includes('Silk') ? 'fabric' :
        optionType === 'embroidery' && ['None', 'Single', 'Double'].includes(value) ? 'pocket' :
        optionType === 'blouseType' ? 'fit' : null;
      
      if (presetKey && customizedStyle.presetConfigurations) {
        // Update the preset configuration with the new value
        setCustomizedStyle({
          ...customizedStyle,
          presetConfigurations: {
            ...customizedStyle.presetConfigurations,
            [presetKey]: value
          }
        });
      }
    } else {
      // Handle API-based customization options
      setCustomizedStyle({
        ...customizedStyle,
        presetConfigurations: {
          ...(customizedStyle.presetConfigurations || {}),
          [optionType]: value
        }
      });
    }
    
    toast({
      title: "Option updated",
      description: `${optionType} updated to ${value}`,
      duration: 2000
    });
  };
  
  const saveCustomization = () => {
    if (!customizedStyle) return;
    
    // Store the configurations in the order context
    updateOrder({
      ...order,
      predesignedStyle: {
        id: customizedStyle.id,
        name: `Customized ${customizedStyle.name}`,
        price: totalPrice,
        image: customizedStyle.imageUrl
      }
    });
    
    setIsCustomizing(false);
    
    toast({
      title: "Customization saved",
      description: "Your customized design has been saved!",
      variant: "default"
    });
    
    navigate('/measurements');
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: isFavorite ? "Style has been removed from your favorites" : "Style has been added to your favorites",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-[2rem] md:pt-[3.8rem]">
        <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-10 flex items-center px-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 mr-3 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900 flex-1">Style Details</h1>
        </div>
        
        <div className="flex justify-center items-center h-[60vh]">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-plum/20 border-t-plum rounded-full animate-spin mb-4"></div>
            <p className="text-plum font-medium">Loading style details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!style) {
    return (
      <div className="min-h-screen bg-gray-50 pt-[2rem] md:pt-[3.8rem]">
        <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-10 flex items-center px-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 mr-3 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900 flex-1">Style Details</h1>
        </div>
        
        <div className="flex flex-col justify-center items-center h-[60vh] px-4">
          <p className="text-gray-600 mb-4">Style not found</p>
          <Button onClick={() => navigate(-1)}>Return to Styles</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-[2rem] md:pt-[3.8rem] pb-32">
      {/* Top Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-10 flex items-center px-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 mr-3 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900 flex-1">Style Details</h1>
        <button 
          onClick={toggleFavorite}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-700'}`} />
        </button>
      </div>
      
      <div className="px-4 pt-1">
        {/* Style Image */}
        <div className="mt-2 mb-3 rounded-xl overflow-hidden bg-white shadow-sm">
          <ImageWithFallback 
            src={style.imageUrl} 
            alt={style.name}
            className="w-full h-64 md:h-96 object-cover" /* Reduced height for mobile */
            loading="lazy"
            fallbackSrc="/images/placeholder-design.jpg"
            maxRetries={0}
          />
        </div>
        
        {/* Style Title and Price */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Embroidered Silk Blouse</h2>
          
          <div className="mt-2 flex justify-between items-start">
            <div className="flex items-center">
              <p className="text-2xl font-bold text-plum">₹3500</p>
            </div>
            
            <div className="flex items-center gap-1">
              <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
              <span className="text-sm text-gray-600">0</span>
              <span className="text-sm text-gray-600">|</span>
              <span className="text-sm text-gray-600">0 reviews</span>
            </div>
          </div>
          
          <p className="text-xs text-gray-600 mt-1">Est. delivery: 7 days</p>
        </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                <span className="text-yellow-500">★</span>
                <span className="text-sm text-gray-600 ml-1">{style.rating || 0}</span>
              </div>
              <span className="text-sm text-gray-400">|</span>
              <span className="text-sm text-gray-600">{style.reviewCount || 0} reviews</span>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="details" className="mb-20">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="pt-4">
            <div className="space-y-6">
              {/* Style Description */}
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-700">Intricately embroidered silk blouse with back hook closure and short sleeves.</p>
              </div>
              
              {/* Boutique Profile - simplified version */}
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-semibold mb-3">Boutique</h3>
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-200 mr-3 border border-gray-200">
                    <ImageWithFallback 
                      src="https://firebasestorage.googleapis.com/v0/b/tailor-app-71fe2.firebasestorage.app/o/HomePage-Carousal%2Fcarousal-2.jpg?alt=media&token=e204b0d6-21ea-4aa8-9518-dcde5bfeae8c" 
                      alt="Style Stitch" 
                      className="h-full w-full object-cover"
                      fallbackSrc="/images/placeholder-boutique.jpg"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Style Stitch</h4>
                    <div className="flex items-center mt-1">
                      <div className="flex items-center">
                        <span className="text-yellow-500">★</span>
                        <span className="ml-1 text-sm font-medium text-gray-700">4.6</span>
                      </div>
                      <span className="mx-1 text-gray-400">•</span>
                      <span className="text-sm text-gray-600">93 reviews</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Any other details section would go here */}
                <div className="bg-white p-5 rounded-xl border border-plum/10 shadow-sm relative overflow-hidden">
                  {/* Subtle background pattern */}
                  <div className="absolute top-0 right-0 w-32 h-32 opacity-5 rounded-full bg-plum -m-8"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 opacity-5 rounded-full bg-plum -m-6"></div>
                  
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
                    <span>Designer Boutique</span>
                    <span className="text-xs px-2 py-0.5 bg-plum/10 text-plum rounded-full">Verified</span>
                  </h3>
                  
                  <div className="flex items-center">
                    <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-200 mr-4 border-2 border-plum/20 shadow-md">
                      <ImageWithFallback 
                        src={style.boutique.coverImageUrl || '/images/placeholder-boutique.jpg'} 
                        alt={style.boutique.name} 
                        className="h-full w-full object-cover"
                        fallbackSrc="/images/placeholder-boutique.jpg"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-plum">{style.boutique.name}</h4>
                      <div className="flex items-center mt-1">
                        <div className="flex items-center">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={`${i < Math.round(style.boutique.ratings || 4.6) ? 'text-yellow-500' : 'text-gray-300'}`}>★</span>
                            ))}
                          </div>
                          <span className="ml-1 text-sm font-medium text-gray-700">{style.boutique.ratings || 4.6}</span>
                        </div>
                        <span className="mx-1 text-gray-400">•</span>
                        <span className="text-sm text-gray-600">{style.boutique.reviewCount} reviews</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{style.boutique.description?.substring(0, 80) || "Contemporary designs with traditional craftsmanship"}...</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-3">
                    <button className="text-sm text-plum font-medium flex items-center hover:underline">
                      View Boutique <ArrowRight className="h-3 w-3 ml-1" />
                    </button>
                  </div>
                </div>
              )}
              <div className="mb-4">
                <div className="bg-white p-3 md:p-5 rounded-xl border border-gray-100 shadow-sm">
                  <h3 className="text-lg font-semibold mb-3">
                    {isCustomizing ? 'Customize Your Design' : 'Included Configurations'}
                  </h3>
                  
                  {/* Show either the customization UI or the included configurations based on isCustomizing state */}
                  {isCustomizing ? (
                    <div>
                      {/* Front Neck Options */}
                      {customizationOptions.frontNeck.length > 0 && (
                        <div className="mb-5">
                          <h4 className="font-medium mb-2">Front Neck Style</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {customizationOptions.frontNeck.map((option) => (
                              <button
                                key={option}
                                onClick={() => handleOptionChange('frontNeck', option)}
                                className={`p-3 border rounded-lg text-sm ${customizedStyle?.configurations.frontNeck === option
                                  ? 'bg-plum/10 border-plum text-plum font-medium'
                                  : 'border-gray-200 hover:border-plum/50'
                                  }`}
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Back Neck Options */}
                      {customizationOptions.backNeck.length > 0 && (
                        <div className="mb-5">
                          <h4 className="font-medium mb-2">Back Neck Style</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {customizationOptions.backNeck.map((option) => (
                              <button
                                key={option}
                                onClick={() => handleOptionChange('backNeck', option)}
                                className={`p-3 border rounded-lg text-sm ${customizedStyle?.configurations.backNeck === option
                                  ? 'bg-plum/10 border-plum text-plum font-medium'
                                  : 'border-gray-200 hover:border-plum/50'
                                  }`}
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Embroidery Options */}
                      {customizationOptions.embroidery.length > 0 && (
                        <div className="mb-5">
                          <h4 className="font-medium mb-2">Material & Details</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {customizationOptions.embroidery.map((option) => (
                              <button
                                key={option}
                                onClick={() => handleOptionChange('embroidery', option)}
                                className={`p-3 border rounded-lg text-sm ${customizedStyle?.configurations.embroidery === option
                                  ? 'bg-plum/10 border-plum text-plum font-medium'
                                  : 'border-gray-200 hover:border-plum/50'
                                  }`}
                              >
                                {option}
                                {priceAdjustments[option] ? ` (+₹${priceAdjustments[option]})` : ''}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Style Type Options */}
                      {customizationOptions.blouseType.length > 0 && (
                        <div className="mb-5">
                          <h4 className="font-medium mb-2">Fit Style</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {customizationOptions.blouseType.map((option) => (
                              <button
                                key={option}
                                onClick={() => handleOptionChange('blouseType', option)}
                                className={`p-3 border rounded-lg text-sm ${customizedStyle?.configurations.blouseType === option
                                  ? 'bg-plum/10 border-plum text-plum font-medium'
                                  : 'border-gray-200 hover:border-plum/50'
                                  }`}
                              >
                                {option}
                                {priceAdjustments[option] ? ` (+₹${priceAdjustments[option]})` : ''}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Color Options */}
                      {customizationOptions.color.length > 0 && (
                        <div className="mb-5">
                          <h4 className="font-medium mb-2">Color</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {customizationOptions.color.map((option) => (
                              <button
                                key={option}
                                onClick={() => handleOptionChange('color', option)}
                                className={`p-3 border rounded-lg text-sm ${customizedStyle?.configurations.color === option
                                  ? 'bg-plum/10 border-plum text-plum font-medium'
                                  : 'border-gray-200 hover:border-plum/50'
                                  }`}
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Button Options */}
                      {customizationOptions.buttons.length > 0 && (
                        <div className="mb-5">
                          <h4 className="font-medium mb-2">Buttons</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {customizationOptions.buttons.map((option) => (
                              <button
                                key={option}
                                onClick={() => handleOptionChange('buttons', option)}
                                className={`p-3 border rounded-lg text-sm ${customizedStyle?.configurations.buttons === option
                                  ? 'bg-plum/10 border-plum text-plum font-medium'
                                  : 'border-gray-200 hover:border-plum/50'
                                  }`}
                              >
                                {option}
                                {priceAdjustments[option] ? ` (+₹${priceAdjustments[option]})` : ''}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <Button 
                        className="w-full bg-plum hover:bg-plum/90 mt-4"
                        onClick={saveCustomization}
                      >
                        Save Customization
                      </Button>
                    </div>
                  ) : (
                    <IncludedConfigurations 
                      style={style} 
                      priceAdjustments={priceAdjustments}
                    />
                  )}
                </div>
              </div>
              {/* Description container removed as requested */}

              {/* Removed redundant customization panel as it's now integrated in the Included Configurations section */}
              {/* Bottom action buttons container removed from here */}
            </div>
          </TabsContent>
          
          <TabsContent value="preview" className="pt-4">
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-semibold mb-3">3D Preview</h3>
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">3D preview coming soon</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="reviews" className="pt-4">
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-semibold mb-3">Customer Reviews</h3>
              
              {/* Check if style.reviews exists and has items */}
              {style.reviews && style.reviews.length > 0 ? (
                <div className="space-y-4">
                  {/* Map through the API reviews */}
                  {style.reviews.map((review) => (
                    <div key={review.id} className="flex items-start">
                      <div className="w-10 h-10 rounded-full bg-gray-200 mr-3 flex-shrink-0">
                        {/* Use user photo if available, otherwise use empty div */}
                        {review.userPhoto && (
                          <img 
                            src={review.userPhoto} 
                            alt={review.userName} 
                            className="w-10 h-10 rounded-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center">
                          <h4 className="font-medium">{review.userName}</h4>
                          <div className="flex items-center ml-2">
                            {/* Render stars based on rating */}
                            <span className="text-yellow-500">
                              {Array(review.rating).fill('★').join('')}
                              {Array(5 - review.rating).fill('★').length > 0 && (
                                <span className="text-gray-300">
                                  {Array(5 - review.rating).fill('★').join('')}
                                </span>
                              )}
                            </span>
                          </div>
                        </div>
                        {/* Format date to show relative time */}
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(review.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                        <p className="mt-2 text-gray-600">{review.comment}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <p>No reviews available for this style yet.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Fixed bottom buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2 z-10 shadow-lg">
        <div className="container mx-auto max-w-md flex flex-row gap-2">
          <Button 
            className="flex-1 bg-plum hover:bg-plum/90 py-3 text-sm h-auto"
            onClick={handleSelectAsIs}
          >
            <CheckCircle2 className="w-4 h-4 mr-1" />
            Select As-Is
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 border-plum text-plum hover:bg-plum/5 py-3 text-sm h-auto"
            onClick={toggleCustomization}
          >
            <Sparkles className="w-4 h-4 mr-1" />
            {isCustomizing ? 'Cancel' : 'Customize'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StyleDetailsPage;
