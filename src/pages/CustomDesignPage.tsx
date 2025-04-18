
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload } from 'lucide-react';
import Header from '../components/Header';
import StepProgress from '../components/StepProgress';
import DesignOptionCard from '../components/DesignOptionCard';
import { mockApi } from '../utils/mockApi';
import { DesignOption } from '../utils/types';
import { useOrder } from '../utils/OrderContext';

const steps = ["Address", "Boutique", "Design", "Cloth", "Measure", "Order", "Pickup"];
const sections = [
  { id: "embroidery", title: "Embroidery Type" },
  { id: "neckFront", title: "Neck Style (Front)" },
  { id: "neckBack", title: "Neck Style (Back)" },
  { id: "blouseType", title: "Blouse Type" }
];

const CustomDesignPage: React.FC = () => {
  const navigate = useNavigate();
  const { order, updateOrder } = useOrder();
  const [activeSection, setActiveSection] = useState<string>(sections[0].id);
  const [options, setOptions] = useState<DesignOption[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [customUploads, setCustomUploads] = useState<Record<string, string>>({});
  const [selections, setSelections] = useState<Record<string, DesignOption>>({});
  const [totalPrice, setTotalPrice] = useState<number>(0);
  
  useEffect(() => {
    setLoading(true);
    mockApi.getDesignOptions(activeSection).then((data) => {
      setOptions(data);
      setLoading(false);
    });
  }, [activeSection]);
  
  useEffect(() => {
    // Calculate total price based on selections
    let price = 0;
    for (const key in selections) {
      price += selections[key].price;
    }
    setTotalPrice(price);
  }, [selections]);
  
  const handleOptionSelect = (option: DesignOption) => {
    setSelections(prev => ({
      ...prev,
      [activeSection]: option
    }));
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target?.result) {
          setCustomUploads(prev => ({
            ...prev,
            [activeSection]: event.target?.result as string
          }));
        }
      };
      
      reader.readAsDataURL(file);
    }
  };
  
  const handleContinue = () => {
    updateOrder({
      customDesign: {
        ...selections,
        customUploads
      }
    });
    navigate('/cloth-selection');
  };
  
  const hasUploadsOrSelections = Object.keys(selections).length > 0 || Object.keys(customUploads).length > 0;

  return (
    <div className="min-h-screen bg-cream">
      <Header title="Custom Design" />
      
      <div className="step-container">
        <StepProgress steps={steps} currentStep={2} />
        
        <div className="mb-6">
          <div className="flex items-center border-b border-gray-200 mb-4">
            {sections.map((section) => (
              <button
                key={section.id}
                className={`pb-2 pt-1 px-3 text-sm whitespace-nowrap ${
                  activeSection === section.id
                    ? 'border-b-2 border-plum text-plum font-medium'
                    : 'text-gray-500'
                }`}
                onClick={() => setActiveSection(section.id)}
              >
                {section.title}
              </button>
            ))}
          </div>
          
          <div className="mt-4">
            {loading ? (
              <div className="flex justify-center my-8">
                <div className="w-10 h-10 border-4 border-plum/30 border-t-plum rounded-full animate-spin"></div>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <label className="block mb-3">
                    <div className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                      <div className="text-center">
                        <Upload className="w-6 h-6 mx-auto text-gray-400" />
                        <p className="mt-1 text-sm text-gray-500">Upload your own {activeSection} design</p>
                      </div>
                    </div>
                  </label>
                  
                  {customUploads[activeSection] && (
                    <div className="mt-2 relative">
                      <img
                        src={customUploads[activeSection]}
                        alt="Uploaded design"
                        className="w-full h-40 object-cover rounded-lg"
                      />
                      <button
                        className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md"
                        onClick={() => {
                          setCustomUploads(prev => {
                            const updated = { ...prev };
                            delete updated[activeSection];
                            return updated;
                          });
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Select from our designs</h3>
                  
                  {options.map((option) => (
                    <DesignOptionCard
                      key={option.id}
                      option={option}
                      selected={selections[activeSection]?.id === option.id}
                      onSelect={handleOptionSelect}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
        
        {hasUploadsOrSelections && (
          <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
            <div className="flex justify-between mb-2">
              <span>Design Total:</span>
              <span className="font-medium">
                {Object.keys(customUploads).length > 0 ? (
                  "Will be calculated after review"
                ) : (
                  `₹${totalPrice}`
                )}
              </span>
            </div>
          </div>
        )}
        
        <button 
          onClick={handleContinue}
          className="btn-primary"
          disabled={!hasUploadsOrSelections}
        >
          Continue to Cloth Selection
        </button>
      </div>
    </div>
  );
};

export default CustomDesignPage;
