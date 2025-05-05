import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Upload, CheckCircle2, X, Sparkles, Camera, Image, ArrowLeft, Save, Plus } from 'lucide-react';
import { mockApi } from '../utils/mockApi';
import { DesignOption } from '../utils/types';
import { useOrder } from '../utils/OrderContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';

const sections = [
  { id: "embroidery", title: "Embroidery Type" },
  { id: "neckFront", title: "Neck Style (Front)" },
  { id: "neckBack", title: "Neck Style (Back)" },
  { id: "blouseType", title: "Blouse Type" }
];



const CustomDesignPage: React.FC = () => {
  const navigate = useNavigate();
  const { boutiqueId, serviceId } = useParams<{ boutiqueId: string; serviceId: string }>();
  const { order, updateOrder } = useOrder();
  const [activeSection, setActiveSection] = useState<string>(sections[0].id);
  const [options, setOptions] = useState<DesignOption[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [customUploads, setCustomUploads] = useState<Record<string, string>>({});
  const [selections, setSelections] = useState<Record<string, DesignOption>>({});
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [allSectionsComplete, setAllSectionsComplete] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pricingSummaryRef = useRef<HTMLDivElement>(null);
  
  // Load design options when active section changes
  useEffect(() => {
    setLoading(true);
    mockApi.getDesignOptions(activeSection).then((data) => {
      setOptions(data);
      setLoading(false);
    });
  }, [activeSection]);
  
  // Calculate total price whenever selections change
  useEffect(() => {
    let price = 0;
    // Add design options price
    Object.values(selections).forEach(option => {
      price += option.price || 0;
    });
    
    // Material price is now handled outside of this page
    
    setTotalPrice(price);
    
    // Check if all sections have selections
    const requiredSections = sections.map(s => s.id);
    const selectedSections = Object.keys(selections);
    const completed = requiredSections.every(section => selectedSections.includes(section));
    setAllSectionsComplete(completed);
  }, [selections]);
  
  // Check if the designs are in order context
  useEffect(() => {
    if (order.customDesign) {
      if (order.customDesign.customUploads?.referenceImage) {
        setSelectedImage(order.customDesign.customUploads.referenceImage);
      }
      
      // Extract selections from order context
      const savedSelections: Record<string, DesignOption> = {};
      for (const [key, value] of Object.entries(order.customDesign)) {
        if (key !== 'customUploads' && key !== 'material' && value && typeof value === 'object' && 'id' in value) {
          savedSelections[key] = value as DesignOption;
        }
      }
      
      if (Object.keys(savedSelections).length > 0) {
        setSelections(savedSelections);
      }
      
      // Extract custom uploads
      if (order.customDesign.customUploads) {
        setCustomUploads(order.customDesign.customUploads as Record<string, string>);
      }
      
      // Material info is now handled at higher level
    }
  }, [order.customDesign]);
  
  // Handler for selecting a design option
  const handleOptionSelect = (option: DesignOption) => {
    setSelections(prev => ({
      ...prev,
      [activeSection]: option
    }));
    
    toast({
      title: `${option.name} selected`,
      description: option.price > 0 ? `Price: ₹${option.price}` : "Added to your design",
      duration: 2000
    });
  };
  
  // Handler for custom image upload
  const handleCustomUpload = (sectionId: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setCustomUploads(prev => ({
            ...prev,
            [sectionId]: result
          }));
        };
        reader.readAsDataURL(file);
      }
    };
    
    input.click();
  };
  
  // Handler to trigger file input click for reference image
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  // Handler for file selection of reference image
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setSelectedImage(result);
        // Store the image in the customUploads
        setCustomUploads(prev => ({
          ...prev,
          'referenceImage': result
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle the camera capture (mock for now)
  const handleCameraCapture = () => {
    toast({
      title: "Camera functionality",
      description: "Camera access would be requested here on a real device",
      duration: 3000
    });
  };
  
  // Handler to save the custom design to order context and navigate to next step
  const handleSaveDesign = () => {
    // If user has selected image but not customized anything, allow them to continue
    const hasImageOnly = selectedImage && Object.keys(selections).length === 0;
    
    // If user has started customizing but not completed, show error
    if (!hasImageOnly && !allSectionsComplete) {
      // Scroll to the pricing summary which shows what's missing
      pricingSummaryRef.current?.scrollIntoView({ behavior: 'smooth' });
      toast({
        title: "Incomplete design",
        description: "Please complete all sections before continuing",
        variant: "destructive"
      });
      return;
    }
    
    // Save to order context
    updateOrder({
      ...order,
      customDesign: {
        ...selections,
        customUploads: customUploads
        // Material info is now handled separately
      }
    });
    
    // Navigate to next step (typically measurement page)
    navigate(`/boutique/${boutiqueId}/service/${serviceId}/measurement`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-[2rem] md:pt-[3.8rem] pb-24">
      {/* Top Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-10 flex items-center px-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 mr-3 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900 flex-1">
          Customize Your Design
        </h1>
      </div>

      <div className="px-4 pt-2">


        {/* Upload Reference Image Section - Above tabs */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
            <Upload className="w-5 h-5 text-plum mr-2" />
            Upload Reference Image
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Upload a reference image to help us understand your design vision better.
          </p>
          
          {selectedImage ? (
            <div className="w-full relative mb-6">
              <img 
                src={selectedImage} 
                alt="Reference design" 
                className="w-full max-h-[300px] object-contain rounded-lg"
              />
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          ) : (
            <div 
              className="w-full h-[200px] border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center mb-6 hover:border-plum/40 hover:bg-plum/5 transition-colors cursor-pointer"
              onClick={handleUploadClick}
            >
              <Upload className="w-10 h-10 text-gray-400 mb-3" />
              <p className="text-sm text-gray-500">Click to upload an image</p>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG or GIF (max. 5MB)</p>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
          )}
          
          <div className="flex gap-4 mb-4">
            <Button
              variant="outline"
              className="flex-1 flex items-center justify-center"
              onClick={handleUploadClick}
            >
              <Image className="w-4 h-4 mr-2" />
              Gallery
            </Button>
            <Button
              variant="outline"
              className="flex-1 flex items-center justify-center"
              onClick={handleCameraCapture}
            >
              <Camera className="w-4 h-4 mr-2" />
              Camera
            </Button>
          </div>
          
          {selectedImage && (
            <Button
              className="w-full bg-plum hover:bg-plum/90 py-6"
              onClick={handleSaveDesign}
            >
              Continue with this image
            </Button>
          )}
        </div>
        
        {/* Section Navigation using Tabs - Sticky on Mobile */}
        <div className="sticky top-16 bg-white z-20 -mx-4 px-4 py-2 border-b border-gray-200">
          <Tabs defaultValue={activeSection} onValueChange={setActiveSection}>
            <TabsList className="w-full justify-start overflow-x-auto whitespace-nowrap">
              {sections.map(section => (
                <TabsTrigger 
                  key={section.id} 
                  value={section.id} 
                  className="relative"
                >
                  {section.title}
                  {selections[section.id] && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
          
        {/* Tab Content */}
        <div className="mt-4">

          {/* Design Options */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
              <Sparkles className="w-5 h-5 text-plum mr-2" />
              Select {sections.find(s => s.id === activeSection)?.title}
            </h3>
            
            {loading ? (
              <div className="h-32 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-plum"></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                {options.map(option => (
                  <div key={option.id} className="relative">
                    <button
                      className={`w-full h-full flex flex-col items-center rounded-md border-2 p-3 transition-colors ${
                        selections[activeSection]?.id === option.id 
                          ? 'border-plum bg-plum/5' 
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                      onClick={() => handleOptionSelect(option)}
                    >
                      <div className="aspect-square w-full mb-2 rounded-md overflow-hidden bg-gray-100">
                        {option.image ? (
                          <img src={option.image} alt={option.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <Sparkles className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <span className="text-sm">{option.name}</span>
                      {option.price > 0 && (
                        <span className="text-xs text-plum mt-1">+₹{option.price}</span>
                      )}
                      
                      {selections[activeSection]?.id === option.id && (
                        <div className="absolute top-2 right-2 bg-plum rounded-full p-1">
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </button>
                  </div>
                ))}
                
                {/* Upload Custom Option */}
                <div className="relative">
                  <button 
                    className="w-full h-full flex flex-col items-center rounded-md border-2 border-dashed border-gray-300 p-3 hover:border-plum/40 hover:bg-plum/5 transition-colors"
                    onClick={() => handleCustomUpload(activeSection)}
                  >
                    <div className="aspect-square w-full mb-2 rounded-md overflow-hidden bg-gray-50 flex flex-col items-center justify-center">
                      <Plus className="w-6 h-6 text-gray-400 mb-1" />
                      <span className="text-xs text-gray-500">Upload</span>
                    </div>
                    <span className="text-sm">Custom Design</span>
                  </button>
                </div>
              </div>
            )}
            
            {customUploads[activeSection] && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-700">Custom Upload</h4>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      const newUploads = {...customUploads};
                      delete newUploads[activeSection];
                      setCustomUploads(newUploads);
                    }}
                    className="h-6 text-xs"
                  >
                    <X className="w-3 h-3 mr-1" /> Remove
                  </Button>
                </div>
                <div className="aspect-video rounded-md overflow-hidden bg-gray-100">
                  <img 
                    src={customUploads[activeSection]} 
                    alt={`Custom ${sections.find(s => s.id === activeSection)?.title}`} 
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            )}
          </div>
          

          
          {/* Pricing Summary */}
          <div ref={pricingSummaryRef} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-20">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Design Summary</h2>
            
            <div className="space-y-3 mb-6">

              
              {/* Design options */}
              {sections.map(section => (
                <div key={section.id} className="flex justify-between items-center p-2 border-b border-gray-100">
                  <div className="flex items-center">
                    {selections[section.id] ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300 mr-2"></div>
                    )}
                    <span className="text-gray-700">{section.title}</span>
                  </div>
                  <div className="text-right">
                    {selections[section.id] ? (
                      <>
                        <div className="font-medium text-gray-900">{selections[section.id].name}</div>
                        {selections[section.id].price > 0 && (
                          <div className="text-sm text-plum">₹{selections[section.id].price}</div>
                        )}
                      </>
                    ) : (
                      <span className="text-sm text-gray-500">Not selected</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between items-center text-lg font-semibold pt-2">
              <span>Total Price</span>
              <span className="text-plum">₹{totalPrice}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Action Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-10">
        <Button
          className={`w-full py-6 rounded-xl font-medium text-white ${
            selectedImage && (allSectionsComplete || Object.keys(selections).length === 0)
              ? 'bg-plum hover:bg-plum/90' 
              : 'bg-gray-400 cursor-not-allowed'
          }`}
          disabled={!selectedImage || (!allSectionsComplete && Object.keys(selections).length > 0)}
          onClick={handleSaveDesign}
        >
          <Save className="w-5 h-5 mr-2" />
          {selectedImage && Object.keys(selections).length === 0 
            ? 'Continue with Basic Design' 
            : allSectionsComplete 
              ? 'Confirm Design & Continue' 
              : 'Please Complete All Sections'}
        </Button>
      </div>
    </div>
  );
};

export default CustomDesignPage;
