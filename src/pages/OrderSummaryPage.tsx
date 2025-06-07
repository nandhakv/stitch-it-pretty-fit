
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../utils/OrderContext';
import { 
  MapPin, 
  Calendar, 
  Scissors, 
  Package, 
  Ruler, 
  ChevronRight, 
  Check, 
  ArrowRight,
  Clock,
  CreditCard
} from 'lucide-react';
import { Button } from '@/components/ui/button';



const OrderSummaryPage: React.FC = () => {
  const navigate = useNavigate();
  const { order } = useOrder();
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  
  const handleContinue = () => {
    // If we have a boutique and service ID, navigate to measurement page
    if (order.boutique?.id && order.service?.id) {
      navigate(`/boutique/${order.boutique.id}/service/${order.service.id}/measurement`);
    } else {
      // Otherwise, navigate to the measurement page directly
      navigate('/measurement');
    }
  };
  
  const calculatePrice = () => {
    let total = 0;
    
    // Add design costs if not custom uploads
    if (order.designType === "predesigned" && order.predesignedStyle) {
      total += order.predesignedStyle.price;
    } else if (order.designType === "custom" && order.customDesign) {
      // If there are custom uploads, price will be calculated after review
      const hasCustomUploads = order.customDesign.customUploads && 
                              Object.keys(order.customDesign.customUploads).length > 0;
      
      if (!hasCustomUploads) {
        // Add prices of all selected design options
        for (const key in order.customDesign) {
          if (key !== 'customUploads' && order.customDesign[key as keyof typeof order.customDesign]) {
            total += (order.customDesign[key as keyof typeof order.customDesign] as any)?.price || 0;
          }
        }
      }
    }
    
    // Add cloth costs if using boutique cloth
    if (order.clothOption === "boutique" && order.boutiqueCloth) {
      total += order.boutiqueCloth.price;
    }
    
    return total;
  };
  
  const hasCustomUploads = order.designType === "custom" && 
                         order.customDesign?.customUploads && 
                         Object.keys(order.customDesign.customUploads).length > 0;
  
  const totalPrice = calculatePrice();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-plum/5 to-white pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-medium">Order Summary</h1>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-6 max-w-lg">
        
        <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-plum/90 to-plum p-4 text-white">
            <h2 className="text-lg font-medium">Order Summary</h2>
          </div>
          
          <div className="p-5">
            {/* Boutique & Service */}
            {order.boutique && (
              <div className="mb-6">
                <h3 className="text-sm text-gray-500 uppercase tracking-wider mb-3">Selected Boutique</h3>
                <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                  <div className="w-16 h-16 mr-4 rounded-md overflow-hidden">
                    <img 
                      src={order.boutique.image || order.boutique.imageUrls?.[0]} 
                      alt={order.boutique.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{order.boutique.name}</p>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <MapPin className="w-3 h-3 mr-1" />
                      <span>{order.boutique.address?.city || order.boutique.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-plum mt-1">
                      <span className="flex items-center">
                        <span className="text-yellow-500 mr-1">★</span> 
                        {order.boutique.rating}
                      </span>
                      <span className="mx-2">•</span>
                      <span>{order.boutique.reviewCount} reviews</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {order.service && (
              <div className="mb-6">
                <h3 className="text-sm text-gray-500 uppercase tracking-wider mb-3">Selected Service</h3>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-medium text-gray-900">{order.service.name}</p>
                  <p className="text-sm text-gray-600 mt-1">{order.service.description}</p>
                </div>
              </div>
            )}
          
            {/* Design */}
            <div className="mb-6">
              <h3 className="text-sm text-gray-500 uppercase tracking-wider mb-3">Design Option</h3>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center mb-2">
                  <Scissors className="w-5 h-5 text-plum mr-2" />
                  <h3 className="text-md font-medium text-gray-900">{order.designType === "predesigned" ? "Pre-designed Style" : "Custom Design"}</h3>
                </div>
            
              <p>
                {order.designType === "predesigned" 
                  ? "Pre-designed Style" 
                  : "Custom Design"}
              </p>
              
              {order.designType === "custom" && order.customDesign && (
                <div className="mt-2 text-sm">
                  {Object.keys(order.customDesign)
                    .filter(key => key !== 'customUploads' && order.customDesign?.[key as keyof typeof order.customDesign])
                    .map(key => {
                      const option = order.customDesign?.[key as keyof typeof order.customDesign] as any;
                      return (
                        <div key={key} className="flex justify-between mb-1">
                          <span>{key.replace(/([A-Z])/g, ' $1').trim()}: {option.name}</span>
                          <span>₹{option.price}</span>
                        </div>
                      );
                    })
                  }
                  
                  {order.customDesign.customUploads && 
                   Object.keys(order.customDesign.customUploads).length > 0 && (
                    <div className="text-plum italic mt-1">
                      * Custom design uploads will be priced after review
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
            {/* Cloth */}
            <div className="mb-6">
              <h3 className="text-sm text-gray-500 uppercase tracking-wider mb-3">Cloth Option</h3>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center mb-2">
                  <Package className="w-5 h-5 text-plum mr-2" />
                  <h3 className="text-md font-medium text-gray-900">{order.clothOption === "own" ? "Using Own Cloth" : "Using Boutique-provided Cloth"}</h3>
                </div>
            
              {order.clothOption === "own" ? (
                <div>
                  <p>Using Own Cloth</p>
                  {order.ownClothDetails && (
                    <div className="text-sm text-gray-600 mt-1">
                      <p>Material: {order.ownClothDetails.material}</p>
                      <p>Color: {order.ownClothDetails.color}</p>
                      <p>Quantity: {order.ownClothDetails.quantity}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <p>Using Boutique-provided Cloth</p>
                  {order.boutiqueCloth && (
                    <div className="flex justify-between mt-2">
                      <div className="flex items-center">
                        <div className="w-10 h-10 mr-2">
                          <img 
                            src={order.boutiqueCloth.image} 
                            alt={order.boutiqueCloth.name} 
                            className="w-full h-full object-cover rounded-md"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{order.boutiqueCloth.name}</p>
                          <p className="text-sm text-gray-500">{order.boutiqueCloth.type}</p>
                        </div>
                      </div>
                      <p>₹{order.boutiqueCloth.price}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
            {/* Measurements */}
            <div className="mb-6">
              <h3 className="text-sm text-gray-500 uppercase tracking-wider mb-3">Measurement Option</h3>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center mb-2">
                  <Ruler className="w-5 h-5 text-plum mr-2" />
                  <h3 className="text-md font-medium text-gray-900">
                    {order.measurementOption === "manual" ? "Manual Measurements" : 
                     order.measurementOption === "homeService" ? "Home Measurement Service" : 
                     "Sending Old Garment"}
                  </h3>
                </div>
            
              {order.measurementOption === "manual" && order.measurements && (
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-600">
                  {Object.entries(order.measurements).map(([key, value]) => {
                    if (key === 'additional') return null;
                    return (
                      <div key={key} className="bg-white p-2 rounded border border-gray-100">
                        <span className="font-medium">
                          {key.replace(/([A-Z])/g, ' $1').trim()}:
                        </span>{' '}
                        {value}"
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          
          {/* Delivery Address */}
          {order.deliveryAddress && (
            <div className="mb-6">
              <h3 className="text-sm text-gray-500 uppercase tracking-wider mb-3">Delivery Address</h3>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center mb-2">
                  <MapPin className="w-5 h-5 text-plum mr-2" />
                  <h3 className="text-md font-medium text-gray-900">{order.deliveryAddress.fullName}</h3>
                </div>
              
                <div className="text-sm text-gray-600">
                  <p>
                    {order.deliveryAddress.doorNo}, {order.deliveryAddress.addressLine1}
                  </p>
                  <p>
                    {order.deliveryAddress.area}, {order.deliveryAddress.pincode}
                  </p>
                  <p className="mt-1">Phone: {order.deliveryAddress.phone}</p>
                </div>
              </div>
            </div>
          )}
          
            {/* Pricing & Timeline */}
            <div className="mt-8 bg-plum/5 p-4 rounded-lg border-l-4 border-plum">
              <h3 className="text-sm text-gray-500 uppercase tracking-wider mb-3">Order Details</h3>
            
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">
                    {hasCustomUploads ? "Will be calculated after review" : `₹${totalPrice}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee:</span>
                  <span className="font-medium">₹100</span>
                </div>
                <div className="flex justify-between font-medium text-lg mt-4 pt-4 border-t border-plum/10">
                  <span className="text-gray-900">Total:</span>
                  <span className="text-plum">
                    {hasCustomUploads ? "Will be calculated after review" : `₹${totalPrice + 100}`}
                  </span>
                </div>
              </div>
              
              <div className="mt-6 flex items-center p-3 bg-white rounded-lg border border-gray-100">
                <Clock className="w-5 h-5 text-plum mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Estimated Delivery</p>
                  <p className="text-sm text-gray-600">7-10 business days</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 mb-6">
          <div className="flex items-start mb-6 bg-white p-4 rounded-lg border border-gray-100">
            <input
              type="checkbox"
              id="terms"
              checked={acceptedTerms}
              onChange={() => setAcceptedTerms(!acceptedTerms)}
              className="mt-1 w-5 h-5 text-plum focus:ring-plum rounded"
            />
            <label htmlFor="terms" className="ml-3 text-sm text-gray-700">
              I agree to the <a href="#" className="text-plum font-medium">Terms of Service</a> and <a href="#" className="text-plum font-medium">Privacy Policy</a>. I understand that my order details will be processed according to these terms.
            </label>
          </div>
          
          <Button
            onClick={handleContinue}
            className="w-full bg-plum hover:bg-plum/90 text-white py-6 rounded-lg font-medium text-base flex items-center justify-center"
            disabled={!acceptedTerms}
          >
            Continue to Measurements
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummaryPage;
