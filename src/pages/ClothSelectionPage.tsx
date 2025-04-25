import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Check, Sparkles, Ruler, ShoppingBag } from 'lucide-react';
import { mockApi } from '../utils/mockApi';
import { ClothOption } from '../utils/types';
import { useOrder } from '../utils/OrderContext';

const ClothSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { boutiqueId, serviceId } = useParams<{ boutiqueId: string; serviceId: string }>();
  const { order, updateOrder } = useOrder();
  const [clothOption, setClothOption] = useState<"own" | "boutique" | null>(order.clothOption || null);
  const [boutiqueClothes, setBoutiqueClothes] = useState<ClothOption[]>([]);
  const [selectedCloth, setSelectedCloth] = useState<ClothOption | null>(order.boutiqueCloth || null);
  const [ownClothDetails, setOwnClothDetails] = useState({
    material: order.ownClothDetails?.material || '',
    color: order.ownClothDetails?.color || '',
    quantity: order.ownClothDetails?.quantity || ''
  });
  const [loading, setLoading] = useState(false);
  const pricingSummaryRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (clothOption === "boutique") {
      setLoading(true);
      mockApi.getClothOptions().then((data) => {
        setBoutiqueClothes(data);
        setLoading(false);
      });
    }
  }, [clothOption]);
  
  const handleOwnClothChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setOwnClothDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleClothSelect = (cloth: ClothOption) => {
    setSelectedCloth(cloth);
  };
  
  const handleContinue = () => {
    updateOrder({
      clothOption,
      ownClothDetails: clothOption === "own" ? ownClothDetails : undefined,
      boutiqueCloth: clothOption === "boutique" ? selectedCloth : undefined
    });
    
    // Use nested route if params are available, otherwise use fallback route
    if (boutiqueId && serviceId) {
      navigate(`/boutique/${boutiqueId}/service/${serviceId}/measurement`);
    } else {
      navigate('/measurement');
    }
  };
  
  // Form is valid if any cloth option is selected
  // For own cloth, no additional inputs are required
  // For boutique cloth, a fabric must be selected
  const isFormValid = clothOption === "own" || (clothOption === "boutique" && selectedCloth !== null);
    
  // Calculate prices
  const fabricPrice = selectedCloth ? selectedCloth.price : 0;
  const designPrice = order.customDesign ? Object.values(order.customDesign)
    .filter(item => typeof item === 'object' && 'price' in item)
    .reduce((sum, item: any) => sum + (item.price || 0), 0) : 0;
  
  // Service base price (safely handle potential undefined price)
  const servicePrice = order.service && 'price' in order.service ? (order.service.price as number) : 0;
  
  // Calculate total price
  const totalPrice = fabricPrice + designPrice + servicePrice;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page header with design info - hidden on mobile */}
      <div className="hidden md:block bg-gradient-to-r from-plum/90 to-plum/70 text-white py-5 md:py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">Cloth Selection</h1>
          <p className="text-white/80 max-w-2xl text-sm md:text-base">
            Choose the perfect fabric for your {order.service?.name || "item"} to ensure the best quality and comfort.
          </p>
        </div>
      </div>
      
      {/* Main content */}
      <div className="container mx-auto md:p-6 lg:p-8 max-w-4xl px-0 md:px-4 pt-0 md:pt-6">
        {/* Cloth option selection */}
        <div className="bg-white md:rounded-xl shadow-sm overflow-hidden mb-6 rounded-none md:rounded-xl p-0">
          <div className="p-5">
            <h2 className="text-lg font-medium mb-4 flex items-center">
              <ShoppingBag className="w-5 h-5 mr-2 text-plum" />
              Select Cloth Option
            </h2>
            
            <div className="grid grid-cols-1 gap-3 mb-6">
              <div
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  clothOption === "own" ? 'border-plum bg-plum/5' : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setClothOption("own")}
              >
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 ${
                    clothOption === "own" ? 'border-plum bg-plum' : 'border-gray-300'
                  }`}>
                    {clothOption === "own" && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">Use My Own Cloth</h3>
                    <p className="text-sm text-gray-500 mt-1">Provide your own cloth for stitching</p>
                  </div>
                </div>
              </div>
              
              <div
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  clothOption === "boutique" ? 'border-plum bg-plum/5' : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setClothOption("boutique")}
              >
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 ${
                    clothOption === "boutique" ? 'border-plum bg-plum' : 'border-gray-300'
                  }`}>
                    {clothOption === "boutique" && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">Boutique-provided Cloth</h3>
                    <p className="text-sm text-gray-500 mt-1">Select from our premium fabric collection</p>
                  </div>
                </div>
              </div>
            </div>
            
            {clothOption === "own" && (
              <div className="mt-4 border-t border-gray-100 pt-4">
                <div className="text-sm text-gray-600 bg-blue-50 p-4 rounded-md border border-blue-200">
                  <h3 className="font-medium text-blue-800 mb-2 flex items-center">
                    <Ruler className="w-4 h-4 mr-2" />
                    Using Your Own Cloth
                  </h3>
                  <p className="mb-2">
                    You've chosen to use your own cloth for this order. Our team will contact you to arrange pickup of your fabric along with the measurement session.
                  </p>
                  <p className="font-medium">
                    Tips for preparing your fabric:
                  </p>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>Ensure the fabric is clean and pressed</li>
                    <li>Have at least 2-3 meters ready (depending on your design)</li>
                    <li>If you're unsure about quantity, our experts will advise you</li>
                  </ul>
                </div>
                
                <div className="mt-4 text-sm text-gray-500 bg-gray-50 p-3 rounded-md border border-gray-200">
                  <p className="font-medium text-gray-700 mb-1">Note:</p>
                  If you'd like to provide additional details about your fabric, you can do so during the measurement appointment or contact our customer service.
                </div>
              </div>
            )}
            
            {clothOption === "boutique" && (
              <div className="mt-4 border-t border-gray-100 pt-4">
                <h3 className="text-md font-medium mb-3 flex items-center">
                  <Sparkles className="w-4 h-4 mr-2 text-plum" />
                  Select a Fabric
                </h3>
                
                {loading ? (
                  <div className="flex justify-center my-6">
                    <div className="w-8 h-8 border-4 border-plum/30 border-t-plum rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {boutiqueClothes.map((cloth) => (
                      <div
                        key={cloth.id}
                        className={`border rounded-lg overflow-hidden cursor-pointer transition-all ${
                          selectedCloth?.id === cloth.id ? 'border-plum ring-2 ring-plum/20' : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleClothSelect(cloth)}
                      >
                        <div className="relative">
                          <img
                            src={cloth.image}
                            alt={cloth.name}
                            className="w-full h-24 sm:h-28 object-cover"
                          />
                          {selectedCloth?.id === cloth.id && (
                            <div className="absolute top-1 right-1 bg-plum text-white p-1 rounded-full">
                              <Check className="w-3 h-3" />
                            </div>
                          )}
                        </div>
                        <div className="p-2">
                          <div className="flex flex-col">
                            <h4 className="text-xs font-medium text-gray-800 truncate">{cloth.name}</h4>
                            <p className="text-xs text-gray-500 truncate">{cloth.type}</p>
                            <div className="text-xs bg-plum/10 text-plum font-medium px-1.5 py-0.5 rounded mt-1 self-start">
                              ₹{cloth.price}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {selectedCloth && (
                  <div className="mt-6 pt-4 border-t border-gray-100" ref={pricingSummaryRef}>
                    <h3 className="font-medium text-gray-800 mb-3">Price Summary</h3>
                    
                    <div className="space-y-2 mb-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Service Base Price:</span>
                        <span className="font-medium">₹{servicePrice}</span>
                      </div>
                      
                      {designPrice > 0 && (
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">Design Customizations:</span>
                          <span className="font-medium">₹{designPrice}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Selected Fabric:</span>
                        <span className="font-medium">₹{fabricPrice}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                      <span className="font-medium text-gray-800">Total Price:</span>
                      <span className="text-lg font-semibold text-plum">₹{totalPrice}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Help section */}
        <div className="bg-gray-50 border border-gray-200 md:rounded-xl p-4 md:p-6 mb-6 mx-4 md:mx-0">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Fabric Tips</h3>
          <p className="text-gray-600 mb-2">
            Choose fabrics that are appropriate for the season and occasion. Lighter fabrics like cotton are great for summer, while heavier materials like wool are better for winter.
          </p>
          <p className="text-gray-600">
            If you're unsure about fabric quantity, our experts will help you determine the right amount during the measurement process.
          </p>
        </div>
        
        {/* Spacer to ensure content isn't hidden behind sticky button */}
        <div className="h-24 md:h-20"></div>
        
        {/* Sticky Continue button */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:p-3 z-40 md:max-w-md md:mx-auto md:right-0 md:left-0 md:rounded-lg md:shadow-lg md:border md:bottom-6">
          {clothOption === "boutique" && selectedCloth && (
            <div 
              className="bg-gray-50 border border-gray-200 rounded-md py-1.5 px-3 text-xs mb-2 cursor-pointer hover:bg-gray-100 transition-colors flex items-center justify-between"
              onClick={() => pricingSummaryRef.current?.scrollIntoView({ behavior: 'smooth' })}
            >
              <div className="flex items-center">
                <span className="font-medium text-gray-700 mr-1">Total:</span>
                <span className="font-semibold text-plum">₹{totalPrice}</span>
              </div>
              <div className="flex items-center text-gray-500">
                <span className="text-xs text-gray-400 mr-2">Service + Design + Fabric</span>
                Details →
              </div>
            </div>
          )}
          
          <button 
            onClick={handleContinue}
            className={`w-full py-3.5 md:py-3 rounded-xl font-medium transition-colors ${isFormValid ? 'bg-plum hover:bg-plum/90 text-white md:text-base md:tracking-wide md:font-semibold md:shadow-sm' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
            disabled={!isFormValid}
          >
            {isFormValid ? (
              "Continue to Measurements"
            ) : (
              clothOption === null ? "Select a cloth option" : 
              clothOption === "boutique" ? "Select a fabric" : 
              "Continue to Measurements"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClothSelectionPage;
