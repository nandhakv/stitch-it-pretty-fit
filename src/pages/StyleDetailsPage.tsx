import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Sparkles, Heart, ArrowRight, ChevronDown, Edit, Save, X } from 'lucide-react';
import { useOrder } from '../utils/OrderContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
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

interface LocationState {
  style?: PredesignedStyle;
}

interface CustomizationOptions {
  frontNeck: string[];
  backNeck: string[];
  embroidery: string[];
  blouseType: string[];
}

const StyleDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { boutiqueId, serviceId, styleId } = useParams<{ boutiqueId: string; serviceId: string; styleId: string }>();
  const location = useLocation();
  const { order, updateOrder } = useOrder();
  const [style, setStyle] = useState<PredesignedStyle | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [customizedStyle, setCustomizedStyle] = useState<PredesignedStyle | null>(null);
  const [customizationOptions, setCustomizationOptions] = useState<CustomizationOptions>({
    frontNeck: [],
    backNeck: [],
    embroidery: [],
    blouseType: []
  });
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [priceAdjustments, setPriceAdjustments] = useState<Record<string, number>>({});

  useEffect(() => {
    // Check if style was passed through location state
    const locationState = location.state as LocationState;
    if (locationState?.style) {
      setStyle(locationState.style);
      setCustomizedStyle(locationState.style);
      fetchCustomizationOptions();
      setLoading(false);
      return;
    }

    // Otherwise fetch the style data based on styleId
    fetchStyleData();
  }, [styleId, location.state]);
  
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

  const fetchCustomizationOptions = async () => {
    // This would normally be an API call to fetch available options
    // Mock data for now
    setCustomizationOptions({
      frontNeck: ["Round", "Square", "V-Neck", "Sweetheart", "Boat Neck", "Halter"],
      backNeck: ["Round", "V-Shape", "U-Shape", "Deep U", "Keyhole", "Square"],
      embroidery: ["Floral", "Minimal", "Heavy Gold", "Sequin", "Beaded", "Traditional", "None"],
      blouseType: ["Princess Cut", "Sleeveless", "Full Sleeve", "Cap Sleeve", "Elbow Length", "Peplum"]
    });
    
    // Set price adjustments for premium options
    setPriceAdjustments({
      "Heavy Gold": 300,
      "Sequin": 250,
      "Beaded": 400,
      "Full Sleeve": 150,
      "Peplum": 200
    });
  };
  
  const fetchStyleData = async () => {
    setLoading(true);
    try {
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
      
      const foundStyle = mockStyles.find(s => s.id === styleId);
      if (foundStyle) {
        setStyle(foundStyle);
        setCustomizedStyle(foundStyle);
        fetchCustomizationOptions();
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
    setIsCustomizing(!isCustomizing);
  };
  
  const handleOptionChange = (optionType: 'frontNeck' | 'backNeck' | 'embroidery' | 'blouseType', value: string) => {
    if (!customizedStyle) return;
    
    // Clone the customized style and update the specific configuration
    setCustomizedStyle({
      ...customizedStyle,
      configurations: {
        ...customizedStyle.configurations,
        [optionType]: value
      }
    });
    
    toast({
      title: "Option updated",
      description: `${optionType} updated to ${value}`,
      duration: 2000
    });
  };
  
  const saveCustomization = () => {
    if (!customizedStyle) return;
    
    // Store the configurations in the order context's customDesign field 
    updateOrder({
      ...order,
      predesignedStyle: {
        id: customizedStyle.id,
        name: `Customized ${customizedStyle.name}`,
        price: totalPrice,
        image: customizedStyle.imageUrl
      },
      customDesign: {
        // Store configuration details in the customDesign field using the expected structure
        neckFront: generateDesignOption('neckFront', customizedStyle.configurations.frontNeck),
        neckBack: generateDesignOption('neckBack', customizedStyle.configurations.backNeck),
        embroidery: generateDesignOption('embroidery', customizedStyle.configurations.embroidery),
        blouseType: generateDesignOption('blouseType', customizedStyle.configurations.blouseType)
      }
    });
    
    setIsCustomizing(false);
    
    toast({
      title: "Customization saved",
      description: "Your customized design has been saved!",
      variant: "default"
    });
    
    // Navigate to measurements after saving customization
    navigate('/measurements');
  };

  const handleCustomize = () => {
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
    
    navigate(`/boutique/${boutiqueId}/service/${serviceId}/custom-design`);
  };

    // Helper function to generate compliant DesignOption objects
  const generateDesignOption = (type: 'embroidery' | 'blouseType' | 'neckFront' | 'neckBack', value: string): DesignOption => {
    return {
      id: `${type}-${value.toLowerCase().replace(/\s+/g, '-')}`,
      name: value,
      type: type,
      image: `/images/design-options/${type}/${value.toLowerCase().replace(/\s+/g, '-')}.jpg`,
      price: priceAdjustments[value] || 0
    };
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
    <div className="min-h-screen bg-gray-50 pt-[2rem] md:pt-[3.8rem] pb-36">
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
          <img 
            src={style.imageUrl} 
            alt={style.name}
            className="w-full h-96 object-cover"
            onError={(e) => {
              e.currentTarget.src = '/images/placeholder-design.jpg';
            }}
          />
        </div>
        
        {/* Style Title and Price */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">{style.name}</h2>
          <div className="flex justify-between items-center mt-1">
            <p className="text-xl font-bold text-plum">₹{style.price}</p>
            <div className="flex items-center text-sm text-green-600">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></div>
              <span>Available Now</span>
            </div>
          </div>
        </div>
        
        {/* Tabs for Style Information */}
        <Tabs defaultValue="details" className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="pt-4">
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Sparkles className="w-5 h-5 text-plum mr-2" />
                    {isCustomizing ? 'Customize Style' : 'Included Configurations'}
                  </h3>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={toggleCustomization}
                    className="flex items-center text-plum">
                    {isCustomizing ? (
                      <>
                        <X className="w-4 h-4 mr-1" /> Cancel
                      </>
                    ) : (
                      <>
                        <Edit className="w-4 h-4 mr-1" /> Customize
                      </>
                    )}
                  </Button>
                </div>
                
                {isCustomizing ? (
                  <div className="space-y-6">
                    {/* Front Neck Selection */}
                    <div>
                      <Label className="text-gray-500 text-sm mb-2 block">Front Neck Style</Label>
                      <Select 
                        defaultValue={customizedStyle?.configurations.frontNeck} 
                        onValueChange={(value) => handleOptionChange('frontNeck', value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select front neck style" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {customizationOptions.frontNeck.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Back Neck Selection */}
                    <div>
                      <Label className="text-gray-500 text-sm mb-2 block">Back Neck Style</Label>
                      <Select 
                        defaultValue={customizedStyle?.configurations.backNeck} 
                        onValueChange={(value) => handleOptionChange('backNeck', value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select back neck style" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {customizationOptions.backNeck.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Embroidery Selection */}
                    <div>
                      <Label className="text-gray-500 text-sm mb-2 block">Embroidery Style</Label>
                      <RadioGroup 
                        defaultValue={customizedStyle?.configurations.embroidery} 
                        onValueChange={(value) => handleOptionChange('embroidery', value)}
                        className="grid grid-cols-2 gap-2"
                      >
                        {customizationOptions.embroidery.map((option) => {
                          const hasExtraCharge = priceAdjustments[option] > 0;
                          return (
                            <div key={option} className="relative">
                              <RadioGroupItem value={option} id={`embroidery-${option}`} className="peer sr-only" />
                              <Label 
                                htmlFor={`embroidery-${option}`} 
                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-3 hover:bg-gray-50 hover:border-gray-200 peer-data-[state=checked]:border-plum peer-data-[state=checked]:bg-plum/5"
                              >
                                <span>{option}</span>
                                {hasExtraCharge && (
                                  <span className="text-xs text-gray-500 mt-1">+₹{priceAdjustments[option]}</span>
                                )}
                              </Label>
                            </div>
                          );
                        })}
                      </RadioGroup>
                    </div>
                    
                    {/* Blouse Type Selection */}
                    <div>
                      <Label className="text-gray-500 text-sm mb-2 block">Blouse Type</Label>
                      <RadioGroup 
                        defaultValue={customizedStyle?.configurations.blouseType} 
                        onValueChange={(value) => handleOptionChange('blouseType', value)}
                        className="grid grid-cols-2 gap-2"
                      >
                        {customizationOptions.blouseType.map((option) => {
                          const hasExtraCharge = priceAdjustments[option] > 0;
                          return (
                            <div key={option} className="relative">
                              <RadioGroupItem value={option} id={`blouse-${option}`} className="peer sr-only" />
                              <Label 
                                htmlFor={`blouse-${option}`} 
                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-3 hover:bg-gray-50 peer-data-[state=checked]:border-plum peer-data-[state=checked]:bg-plum/5"
                              >
                                <span>{option}</span>
                                {hasExtraCharge && (
                                  <span className="text-xs text-gray-500 mt-1">+₹{priceAdjustments[option]}</span>
                                )}
                              </Label>
                            </div>
                          );
                        })}
                      </RadioGroup>
                    </div>
                    
                    {/* Price Calculation */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Total Price:</span>
                        <span className="text-lg font-bold text-plum">₹{totalPrice}</span>
                      </div>
                      {totalPrice !== style?.price && (
                        <p className="text-xs text-gray-500 mt-1">Includes customization charges</p>
                      )}
                    </div>
                    
                    <Button 
                      className="w-full mt-2 bg-plum hover:bg-plum/90"
                      onClick={saveCustomization}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save & Continue
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                    <div className="flex items-center">
                      <CheckCircle2 className="w-5 h-5 text-plum mr-3 flex-shrink-0" />
                      <div>
                        <span className="text-gray-500 block text-sm">Front Neck</span>
                        <span className="font-medium">{customizedStyle?.configurations.frontNeck || style?.configurations.frontNeck}</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle2 className="w-5 h-5 text-plum mr-3 flex-shrink-0" />
                      <div>
                        <span className="text-gray-500 block text-sm">Back Neck</span>
                        <span className="font-medium">{customizedStyle?.configurations.backNeck || style?.configurations.backNeck}</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle2 className="w-5 h-5 text-plum mr-3 flex-shrink-0" />
                      <div>
                        <span className="text-gray-500 block text-sm">Embroidery</span>
                        <span className="font-medium">{customizedStyle?.configurations.embroidery || style?.configurations.embroidery}</span>
                        {customizedStyle?.configurations.embroidery && priceAdjustments[customizedStyle.configurations.embroidery] > 0 && (
                          <Badge variant="secondary" className="ml-2 text-xs">+₹{priceAdjustments[customizedStyle.configurations.embroidery]}</Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle2 className="w-5 h-5 text-plum mr-3 flex-shrink-0" />
                      <div>
                        <span className="text-gray-500 block text-sm">Blouse Type</span>
                        <span className="font-medium">{customizedStyle?.configurations.blouseType || style?.configurations.blouseType}</span>
                        {customizedStyle?.configurations.blouseType && priceAdjustments[customizedStyle.configurations.blouseType] > 0 && (
                          <Badge variant="secondary" className="ml-2 text-xs">+₹{priceAdjustments[customizedStyle.configurations.blouseType]}</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-semibold mb-3">Description</h3>
                <p className="text-gray-600">
                  A beautifully crafted {style.name.toLowerCase()} with {style.configurations.embroidery.toLowerCase()} embroidery, 
                  featuring a {style.configurations.frontNeck.toLowerCase()} front neck design and 
                  {style.configurations.backNeck.toLowerCase()} back style. Perfect for both casual and formal occasions.
                </p>
                
                <h3 className="text-lg font-semibold mt-6 mb-3">Features</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Premium quality fabric</li>
                  <li>Hand-crafted {style.configurations.embroidery} detailing</li>
                  <li>Contemporary {style.configurations.blouseType} design</li>
                  <li>Perfect fit with customized measurements</li>
                </ul>
              </div>
              
              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-semibold mb-3">Delivery Information</h3>
                <p className="text-gray-600 mb-3">
                  Standard delivery in 7-10 business days after measurements. Rush delivery available for an additional fee.
                </p>
                <div className="flex items-center text-sm text-gray-600 mt-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                  <span>Free alterations within 15 days of delivery</span>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="preview" className="pt-4">
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex justify-center items-center h-80 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-gray-500">3D preview coming soon</p>
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-gray-600 mb-4">
                  Interactive 3D previews allow you to see the style from all angles before making your choice.
                </p>
                <p className="text-sm text-gray-500">
                  This feature is currently in development and will be available soon.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="reviews" className="pt-4">
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-yellow-400 fill-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                <span className="text-lg font-medium ml-2">4.8</span>
                <span className="text-gray-500 text-sm ml-2">(24 reviews)</span>
              </div>
              
              <div className="space-y-4">
                {[
                  { name: "Priya S.", date: "2 weeks ago", comment: "Absolutely love this design! The embroidery work is exquisite and the fit is perfect." },
                  { name: "Meera K.", date: "1 month ago", comment: "Beautiful craftsmanship and attention to detail. Received many compliments!" }
                ].map((review, index) => (
                  <div key={index} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-medium">{review.name}</div>
                      <div className="text-gray-500 text-sm">{review.date}</div>
                    </div>
                    <div className="flex mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} className="w-4 h-4 text-yellow-400 fill-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>
              
              <Button className="w-full mt-4" variant="outline">
                View All Reviews
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Bottom Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-10">
        {!isCustomizing && (
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="flex-1 border-plum text-plum hover:bg-plum/10"
              onClick={toggleCustomization}
            >
              Customize This Style
            </Button>
            <Button 
              className="flex-1 bg-plum hover:bg-plum/90"
              onClick={handleSelectAsIs}
            >
              Select As Is
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StyleDetailsPage;
