
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import StepProgress from '../components/StepProgress';
import { useOrder } from '../utils/OrderContext';

const steps = ["Address", "Boutique", "Design", "Cloth", "Measure", "Order", "Pickup"];

const ServiceOptionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { order, updateOrder } = useOrder();
  
  const handleOptionSelect = (type: "predesigned" | "custom") => {
    updateOrder({ designType: type });
    if (type === "predesigned") {
      navigate('/predesigned-styles');
    } else {
      navigate('/custom-design');
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <Header title="Choose Design Option" />
      
      <div className="step-container">
        <StepProgress steps={steps} currentStep={2} />
        
        <div className="mb-4">
          <h2 className="text-center text-xl font-medium mb-6">
            How would you like to design your {order.service?.name || "item"}?
          </h2>
          
          <div 
            className="bg-white rounded-lg shadow-md overflow-hidden mb-4 cursor-pointer"
            onClick={() => handleOptionSelect("predesigned")}
          >
            <img 
              src="https://images.unsplash.com/photo-1604335398354-d8fb81b99cd9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGluZGlhbiUyMGJsb3VzZXxlbnwwfHwwfHx8MA%3D%3D"
              alt="Pre-designed styles"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-medium text-plum">Pre-designed Styles</h3>
              <p className="text-sm text-gray-600 mt-1">
                Choose from our curated collection of designs for a quick and hassle-free experience.
              </p>
            </div>
          </div>
          
          <div 
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
            onClick={() => handleOptionSelect("custom")}
          >
            <img 
              src="https://images.unsplash.com/photo-1595341595379-cf1cd0fb7fb1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGluZGlhbiUyMGJsb3VzZXxlbnwwfHwwfHx8MA%3D%3D" 
              alt="Custom design"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-medium text-plum">Custom Design</h3>
              <p className="text-sm text-gray-600 mt-1">
                Create your own unique design by customizing every aspect or upload your own design.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceOptionsPage;
