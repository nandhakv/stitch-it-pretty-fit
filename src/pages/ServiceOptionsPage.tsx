
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Sparkles, Palette, CheckCircle2 } from 'lucide-react';
import { useOrder } from '../utils/OrderContext';

// Design option images
const designOptions = [
  {
    id: "predesigned",
    title: "Pre-designed Styles",
    description: "Choose from our curated collection of designs for a quick and hassle-free experience.",
    image: "https://images.unsplash.com/photo-1604335398354-d8fb81b99cd9?w=800&auto=format&fit=crop&q=80",
    features: ["Ready to customize", "Trending designs", "Quick delivery", "Budget-friendly"]
  },
  {
    id: "custom",
    title: "Custom Design",
    description: "Create your own unique design by customizing every aspect or upload your own design.",
    image: "https://images.unsplash.com/photo-1595341595379-cf1cd0fb7fb1?w=800&auto=format&fit=crop&q=80",
    features: ["Complete customization", "Unique designs", "Personal touch", "Premium experience"]
  }
];

const ServiceOptionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { order, updateOrder } = useOrder();
  
  const { boutiqueId, serviceId } = useParams<{ boutiqueId: string; serviceId: string }>();
  
  const handleOptionSelect = (type: "predesigned" | "custom") => {
    updateOrder({ designType: type });
    
    // Use nested route if params are available, otherwise use fallback route
    if (boutiqueId && serviceId) {
      if (type === "predesigned") {
        navigate(`/boutique/${boutiqueId}/service/${serviceId}/predesigned-styles`);
      } else {
        navigate(`/boutique/${boutiqueId}/service/${serviceId}/custom-design`);
      }
    } else {
      if (type === "predesigned") {
        navigate('/predesigned-styles');
      } else {
        navigate('/custom-design');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Page header with service info - hidden on mobile, visible on desktop */}
      <div className="hidden md:block bg-gradient-to-r from-plum/90 to-plum/70 text-white py-4 md:py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">Design Your {order.service?.name || "Item"}</h1>
          <p className="text-white/80 max-w-2xl text-sm md:text-base">
            Choose how you'd like to design your {order.service?.name || "item"} from {order.boutique?.name || "our boutique"}.
            Each option offers a unique experience tailored to your preferences.
          </p>
        </div>
      </div>
      
      {/* Main content - full height on mobile */}
      <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-4xl mt-0 md:mt-0">
        {/* Design options - visible on page load */}
        <div className="grid gap-6 md:gap-8 md:grid-cols-2 mt-2 md:mt-4">
          {designOptions.map((option) => (
            <div 
              key={option.id}
              className="bg-white rounded-2xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-all border border-gray-100 hover:border-plum/30 flex flex-col h-full"
              onClick={() => handleOptionSelect(option.id as "predesigned" | "custom")}
            >
              <div className="relative">
                <img 
                  src={option.image} 
                  alt={option.title}
                  className="w-full h-40 md:h-52 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <div className="flex items-center">
                    {option.id === "predesigned" ? (
                      <Sparkles className="w-4 h-4 md:w-5 md:h-5 mr-2 text-yellow-300" />
                    ) : (
                      <Palette className="w-4 h-4 md:w-5 md:h-5 mr-2 text-pink-300" />
                    )}
                    <h3 className="text-lg md:text-xl font-bold">{option.title}</h3>
                  </div>
                </div>
              </div>
              
              <div className="p-4 md:p-5 flex-1 flex flex-col">
                <p className="text-gray-700 mb-3 md:mb-4 text-sm md:text-base">{option.description}</p>
                
                <div className="mt-auto">
                  <h4 className="font-medium text-gray-800 mb-2 text-sm md:text-base">Features:</h4>
                  <div className="grid grid-cols-2 gap-y-1.5 md:gap-y-2 gap-x-2 md:gap-x-4">
                    {option.features.map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5 md:mr-2 text-plum" />
                        <span className="text-xs md:text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <button 
                    className="w-full mt-4 md:mt-6 bg-plum hover:bg-plum/90 text-white font-medium text-sm md:text-base py-2.5 md:py-3 rounded-xl transition-colors"
                    onClick={() => handleOptionSelect(option.id as "predesigned" | "custom")}
                  >
                    Select {option.title}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Help section */}
        <div className="mt-8 md:mt-12 bg-gray-50 border border-gray-200 rounded-xl p-4 md:p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Not sure which option to choose?</h3>
          <p className="text-gray-600">
            Pre-designed styles are perfect if you want a quick, hassle-free experience with proven designs. 
            Custom design gives you complete control over every aspect of your {order.service?.name || "item"}.
          </p>
          <p className="text-gray-600 mt-2">
            Both options will be tailored to your measurements for a perfect fit.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServiceOptionsPage;
