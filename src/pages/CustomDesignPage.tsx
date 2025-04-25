import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Upload, CheckCircle2, X, Sparkles } from 'lucide-react';
import DesignOptionCard from '../components/DesignOptionCard';
import { mockApi } from '../utils/mockApi';
import { DesignOption } from '../utils/types';
import { useOrder } from '../utils/OrderContext';

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
  const pricingSummaryRef = React.useRef<HTMLDivElement>(null);
  
  // Load design options when active section changes
  useEffect(() => {
    setLoading(true);
    mockApi.getDesignOptions(activeSection).then((data) => {
      setOptions(data);
      setLoading(false);
    });
  }, [activeSection]);
  
  // Initialize selections and uploads from order context when component mounts
  useEffect(() => {
    if (order.customDesign) {
      // Extract selections and custom uploads from order context
      const savedSelections: Record<string, DesignOption> = {};
      const savedUploads: Record<string, string> = {};
      
      // Process the saved design data
      Object.entries(order.customDesign).forEach(([key, value]) => {
        if (key === 'customUploads') {
          // Handle custom uploads
          if (value && typeof value === 'object') {
            Object.entries(value).forEach(([uploadKey, uploadValue]) => {
              if (typeof uploadValue === 'string') {
                savedUploads[uploadKey] = uploadValue;
              }
            });
          }
        } else if (value && typeof value === 'object' && 'id' in value) {
          // Handle selections (design options)
          savedSelections[key] = value as DesignOption;
        }
      });
      
      // Update state with saved values
      if (Object.keys(savedSelections).length > 0) {
        setSelections(savedSelections);
      }
      
      if (Object.keys(savedUploads).length > 0) {
        setCustomUploads(savedUploads);
      }
    }
  }, [order.customDesign]);
  
  useEffect(() => {
    // Calculate total price based on selections
    let price = 0;
    for (const key in selections) {
      price += selections[key].price;
    }
    setTotalPrice(price);
    
    // Check if all sections have selections (either a design option or a custom upload)
    const completedSections = new Set<string>();
    
    // Add sections with selected designs
    Object.keys(selections).forEach(sectionId => {
      completedSections.add(sectionId);
    });
    
    // Add sections with custom uploads
    Object.keys(customUploads).forEach(sectionId => {
      completedSections.add(sectionId);
    });
    
    // Check if all sections are complete
    const isComplete = sections.every(section => completedSections.has(section.id));
    setAllSectionsComplete(isComplete);
  }, [selections, customUploads]);
  
  const handleOptionSelect = (option: DesignOption) => {
    // Add the selection
    setSelections(prev => ({
      ...prev,
      [activeSection]: option
    }));
    
    // Remove any existing custom upload for this section
    if (customUploads[activeSection]) {
      setCustomUploads(prev => {
        const updated = { ...prev };
        delete updated[activeSection];
        return updated;
      });
    }
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target?.result) {
          // Add the custom upload
          setCustomUploads(prev => ({
            ...prev,
            [activeSection]: event.target?.result as string
          }));
          
          // Remove any existing selection for this section
          if (selections[activeSection]) {
            setSelections(prev => {
              const updated = { ...prev };
              delete updated[activeSection];
              return updated;
            });
          }
        }
      };
      
      reader.readAsDataURL(file);
    }
  };
  
  const handleContinue = () => {
    if (!allSectionsComplete) return;
    
    updateOrder({
      customDesign: {
        ...selections,
        customUploads
      }
    });
    // Use nested route if params are available, otherwise use fallback route
    if (boutiqueId && serviceId) {
      navigate(`/boutique/${boutiqueId}/service/${serviceId}/cloth-selection`);
    } else {
      navigate('/cloth-selection');
    }
  };
  
  const hasUploadsOrSelections = Object.keys(selections).length > 0 || Object.keys(customUploads).length > 0;
  
  // Count how many sections are complete
  const completedSectionsCount = new Set<string>([...Object.keys(selections), ...Object.keys(customUploads)]).size;
  const totalSections = sections.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page header with design info - hidden on mobile */}
      <div className="hidden md:block bg-gradient-to-r from-plum/90 to-plum/70 text-white py-5 md:py-8 px-4 mt-0 pt-6 pb-0 mb-0">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">Custom Design</h1>
          <p className="text-white/80 max-w-2xl text-sm md:text-base pb-2">
            Personalize every aspect of your {order.service?.name || "item"} to create a unique design that's perfect for you.
          </p>
        </div>
      </div>
      
      {/* Fixed tab headers in a 2x2 grid layout */}
      <div className="sticky top-14 z-40 w-full bg-white border-b border-border/40 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="container grid grid-cols-2 grid-rows-2 md:flex md:items-center w-full bg-white/90 h-24 md:h-12 mb-0 pb-0">
          {sections.map((section) => {
            const hasSelection = !!selections[section.id] || !!customUploads[section.id];
            
            return (
              <button
                key={section.id}
                className={`h-12 px-2 md:px-5 text-xs md:text-sm whitespace-nowrap transition-colors relative w-full flex items-center justify-center ${
                  activeSection === section.id
                    ? 'text-plum font-medium border-b-2 border-plum'
                    : 'text-gray-600 hover:text-gray-900 border-b-2 border-transparent'
                }`}
                onClick={() => setActiveSection(section.id)}
              >
                <div className="flex items-center justify-center">
                  {section.title}
                  {hasSelection && (
                    <span className="ml-1.5 text-xs text-plum/90 bg-plum/10 px-1 py-0.5 rounded-sm">
                      ✓
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Main content - with padding to account for taller sticky header */}
      <div className="container mx-auto md:p-6 lg:p-8 max-w-4xl px-0 md:px-4 pt-0 md:pt-6">
        {/* Design section content */}
        <div className="bg-white md:rounded-xl shadow-sm overflow-hidden mb-6 rounded-none md:rounded-xl p-0 border-t-0 -mt-0.5 md:mt-0">
          <div className="p-5">
            {loading ? (
              <div className="flex justify-center my-8">
                <div className="w-10 h-10 border-4 border-plum/30 border-t-plum rounded-full animate-spin"></div>
              </div>
            ) : (
              <>
                <div>
                  <h3 className="text-lg font-medium mb-4 flex items-center">
                    <Sparkles className="w-5 h-5 mr-2 text-plum" />
                    Select from our designs
                  </h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3">
                    {options.map((option) => (
                      <div 
                        key={option.id}
                        className={`border rounded-lg overflow-hidden cursor-pointer transition-all ${selections[activeSection]?.id === option.id ? 'border-plum ring-2 ring-plum/20' : 'border-gray-200 hover:border-gray-300'}`}
                        onClick={() => handleOptionSelect(option)}
                      >
                        <div className="relative">
                          <img 
                            src={option.image} 
                            alt={option.name} 
                            className="w-full h-24 sm:h-28 object-cover"
                          />
                          {selections[activeSection]?.id === option.id && (
                            <div className="absolute top-1 right-1 bg-plum text-white p-1 rounded-full">
                              <CheckCircle2 className="w-3 h-3" />
                            </div>
                          )}
                        </div>
                        <div className="p-2">
                          <div className="flex flex-col">
                            <h4 className="text-xs font-medium text-gray-800 truncate">{option.name}</h4>
                            <div className="text-xs bg-plum/10 text-plum font-medium px-1.5 py-0.5 rounded mt-1 self-start">
                              ₹{option.price}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <h3 className="text-lg font-medium mb-3 flex items-center">
                    <Upload className="w-5 h-5 mr-2 text-plum" />
                    Upload Your Design
                  </h3>
                  <label className="block">
                    <div className="flex items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                      <div className="text-center">
                        <div className="w-14 h-14 bg-plum/10 rounded-full flex items-center justify-center mx-auto mb-2">
                          <Upload className="w-7 h-7 text-plum" />
                        </div>
                        <p className="font-medium text-gray-700">Upload your own {activeSection} design</p>
                        <p className="mt-1 text-sm text-gray-500">Drag and drop or click to browse</p>
                      </div>
                    </div>
                  </label>
                  
                  {customUploads[activeSection] && (
                    <div className="mt-4 relative bg-white rounded-xl overflow-hidden border border-gray-200">
                      <div className="p-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                        <span className="font-medium text-sm text-gray-700">Your uploaded design</span>
                        <button
                          className="text-red-500 hover:text-red-700 transition-colors"
                          onClick={() => {
                            setCustomUploads(prev => {
                              const updated = { ...prev };
                              delete updated[activeSection];
                              return updated;
                            });
                          }}
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      <img
                        src={customUploads[activeSection]}
                        alt="Uploaded design"
                        className="w-full h-48 object-contain p-4"
                      />
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* Selection Summary */}
        <div className="bg-white md:rounded-xl shadow-sm overflow-hidden mb-6">
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <h3 className="font-medium text-gray-800">Your Selections</h3>
          </div>
          <div className="p-5">
            {hasUploadsOrSelections ? (
              <>
                <div className="space-y-4">
                  {Object.keys(selections).map(sectionId => {
                    const section = sections.find(s => s.id === sectionId);
                    const option = selections[sectionId];
                    return (
                      <div key={sectionId} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-12 h-12 rounded-md overflow-hidden mr-3">
                            <img src={option.image} alt={option.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">{section?.title}</span>
                            <p className="font-medium text-gray-800">{option.name}</p>
                          </div>
                        </div>
                        <div className="text-plum font-medium">₹{option.price}</div>
                      </div>
                    );
                  })}
                  
                  {Object.keys(customUploads).map(sectionId => {
                    const section = sections.find(s => s.id === sectionId);
                    if (!selections[sectionId]) { // Only show if not already in selections
                      return (
                        <div key={`upload-${sectionId}`} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-12 h-12 rounded-md overflow-hidden mr-3 bg-gray-100 flex items-center justify-center">
                              <Upload className="w-6 h-6 text-gray-400" />
                            </div>
                            <div>
                              <span className="text-sm text-gray-500">{section?.title}</span>
                              <p className="font-medium text-gray-800">Custom Upload</p>
                            </div>
                          </div>
                          <div className="text-gray-500 font-medium">Price on review</div>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-100" ref={pricingSummaryRef}>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-800">Design Total:</span>
                    <span className="text-lg font-semibold text-plum">
                      {Object.keys(customUploads).length > 0 ? (
                        "Will be calculated after review"
                      ) : (
                        `₹${totalPrice}`
                      )}
                    </span>
                  </div>
                  
                  {hasUploadsOrSelections && !allSectionsComplete && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800 mt-4">
                      <div className="font-medium mb-1">Please complete all sections</div>
                      <div className="flex items-center justify-between">
                        <span>Completed {completedSectionsCount} of {totalSections} sections</span>
                        <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                          {totalSections - completedSectionsCount} remaining
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <p>No selections yet. Choose design options above.</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Help section */}
        <div className="bg-gray-50 border border-gray-200 md:rounded-xl p-4 md:p-6 mb-6 mx-4 md:mx-0">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Design Tips</h3>
          <p className="text-gray-600 mb-2">
            Mix and match different elements to create your perfect design. You can select from our curated options or upload your own designs.  
          </p>
          <p className="text-gray-600">
            Custom uploads will be reviewed by our designers who will contact you with pricing information.
          </p>
        </div>
        
        {/* Spacer to ensure content isn't hidden behind sticky button */}
        <div className="h-24 md:h-20"></div>
        
        {/* Sticky Continue button */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:p-3 z-40 md:max-w-lg md:mx-auto md:right-4 md:left-auto md:rounded-lg md:shadow-md md:border md:bottom-4">
          <div 
            className="bg-gray-50 border border-gray-200 rounded-md py-1.5 px-3 text-xs mb-2 cursor-pointer hover:bg-gray-100 transition-colors flex items-center justify-between"
            onClick={() => pricingSummaryRef.current?.scrollIntoView({ behavior: 'smooth' })}
          >
            <div className="flex items-center">
              <span className="font-medium text-gray-700 mr-1">Total:</span>
              <span className="font-semibold text-plum">
                {Object.keys(customUploads).length > 0 ? (
                  "Will be calculated after review"
                ) : (
                  `₹${totalPrice}`
                )}
              </span>
            </div>
            <div className="text-gray-500">
              {!allSectionsComplete && `${completedSectionsCount}/${totalSections} complete • Details →`}
            </div>
          </div>
          
          <button 
            onClick={handleContinue}
            className={`w-full py-3.5 md:py-2.5 rounded-xl font-medium transition-colors ${allSectionsComplete ? 'bg-plum hover:bg-plum/90 text-white' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
            disabled={!allSectionsComplete}
          >
            {allSectionsComplete ? (
              "Continue to Cloth Selection"
            ) : (
              `Complete ${totalSections - completedSectionsCount} more section${totalSections - completedSectionsCount !== 1 ? 's' : ''}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomDesignPage;
