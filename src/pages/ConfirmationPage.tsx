
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { useOrder } from '../utils/OrderContext';

const ConfirmationPage: React.FC = () => {
  const navigate = useNavigate();
  const { order, resetOrder } = useOrder();
  
  const handleGoHome = () => {
    resetOrder();
    navigate('/');
  };
  
  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <div className="flex-1 flex items-center justify-center">
        <div className="container max-w-md mx-auto px-4 py-10 text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle className="w-24 h-24 text-plum" />
          </div>
          
          <h1 className="text-2xl font-bold mb-4 text-plum font-playfair">Order Confirmed!</h1>
          
          <p className="text-gray-700 mb-6">
            Thank you for your order. We have received your request and will process it shortly.
          </p>
          
          <div className="bg-white p-5 rounded-lg shadow-sm mb-6">
            {order.pickupDetails && (
              <>
                <h2 className="text-lg font-medium mb-3">Pickup Details</h2>
                <p className="mb-1">
                  <span className="font-medium">Date: </span>
                  {new Date(order.pickupDetails.date || '').toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
                <p className="mb-4">
                  <span className="font-medium">Time: </span>
                  {order.pickupDetails.slot}
                </p>
              </>
            )}
            
            <h2 className="text-lg font-medium mb-3">Order Summary</h2>
            <p>
              <span className="font-medium">Boutique: </span>
              {order.boutique?.name}
            </p>
            <p>
              <span className="font-medium">Service: </span>
              {order.service?.name}
            </p>
            <p className="mt-4">
              <span className="font-medium">Design Option: </span>
              {order.designType === "predesigned" ? "Pre-designed Style" : "Custom Design"}
            </p>
            <p>
              <span className="font-medium">Cloth Option: </span>
              {order.clothOption === "own" ? "Using Own Cloth" : "Boutique-provided Cloth"}
            </p>
            <p>
              <span className="font-medium">Measurement Option: </span>
              {order.measurementOption === "manual" 
                ? "Manual Measurements" 
                : order.measurementOption === "homeService"
                  ? "Home Measurement Service"
                  : "Sending Old Garment"}
            </p>
          </div>
          
          <p className="text-gray-600 mb-6">
            You will receive updates about your order status via SMS.
          </p>
          
          <button 
            onClick={handleGoHome}
            className="btn-primary flex items-center justify-center"
          >
            Continue Shopping
            <ArrowRight className="ml-2 w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;
