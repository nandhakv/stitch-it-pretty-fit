
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import StepProgress from '../components/StepProgress';
import { mockApi } from '../utils/mockApi';
import { ClothOption } from '../utils/types';
import { useOrder } from '../utils/OrderContext';

const steps = ["Address", "Boutique", "Design", "Cloth", "Measure", "Order", "Pickup"];

const ClothSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { order, updateOrder } = useOrder();
  const [clothOption, setClothOption] = useState<"own" | "boutique" | null>(null);
  const [boutiqueClothes, setBoutiqueClothes] = useState<ClothOption[]>([]);
  const [selectedCloth, setSelectedCloth] = useState<ClothOption | null>(null);
  const [ownClothDetails, setOwnClothDetails] = useState({
    material: '',
    color: '',
    quantity: ''
  });
  const [loading, setLoading] = useState(false);
  
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
    navigate('/measurement');
  };
  
  const isFormValid = clothOption === "own" 
    ? ownClothDetails.material && ownClothDetails.color && ownClothDetails.quantity
    : selectedCloth !== null;

  return (
    <div className="min-h-screen bg-cream">
      <Header title="Cloth Selection" />
      
      <div className="step-container">
        <StepProgress steps={steps} currentStep={3} />
        
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <h2 className="text-lg font-medium mb-4">Select Cloth Option</h2>
          
          <div className="grid grid-cols-1 gap-4 mb-6">
            <div
              className={`border rounded-lg p-4 cursor-pointer ${
                clothOption === "own" ? 'border-plum bg-plum/5' : 'border-gray-200'
              }`}
              onClick={() => setClothOption("own")}
            >
              <div className="flex items-center">
                <div className={`w-5 h-5 rounded-full border-2 mr-3 ${
                  clothOption === "own" ? 'border-plum bg-plum' : 'border-gray-300'
                }`}>
                  {clothOption === "own" && (
                    <svg className="w-full h-full text-white p-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div>
                  <h3 className="font-medium">Use My Own Cloth</h3>
                  <p className="text-sm text-gray-500 mt-1">Provide your own cloth for stitching</p>
                </div>
              </div>
            </div>
            
            <div
              className={`border rounded-lg p-4 cursor-pointer ${
                clothOption === "boutique" ? 'border-plum bg-plum/5' : 'border-gray-200'
              }`}
              onClick={() => setClothOption("boutique")}
            >
              <div className="flex items-center">
                <div className={`w-5 h-5 rounded-full border-2 mr-3 ${
                  clothOption === "boutique" ? 'border-plum bg-plum' : 'border-gray-300'
                }`}>
                  {clothOption === "boutique" && (
                    <svg className="w-full h-full text-white p-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
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
            <div className="mt-4">
              <h3 className="text-md font-medium mb-3">Tell us about your cloth</h3>
              
              <div className="mb-3">
                <label className="form-label">Material</label>
                <input
                  type="text"
                  name="material"
                  value={ownClothDetails.material}
                  onChange={handleOwnClothChange}
                  className="input-field"
                  placeholder="e.g., Cotton, Silk, etc."
                />
              </div>
              
              <div className="mb-3">
                <label className="form-label">Color</label>
                <input
                  type="text"
                  name="color"
                  value={ownClothDetails.color}
                  onChange={handleOwnClothChange}
                  className="input-field"
                  placeholder="e.g., Red, Blue, etc."
                />
              </div>
              
              <div className="mb-3">
                <label className="form-label">Quantity</label>
                <input
                  type="text"
                  name="quantity"
                  value={ownClothDetails.quantity}
                  onChange={handleOwnClothChange}
                  className="input-field"
                  placeholder="e.g., 2 meters, 3 yards, etc."
                />
              </div>
              
              <div className="text-sm text-gray-500 mt-3">
                Note: Our team will arrange pickup for your cloth along with measurements
              </div>
            </div>
          )}
          
          {clothOption === "boutique" && (
            <div className="mt-4">
              <h3 className="text-md font-medium mb-3">Select a Fabric</h3>
              
              {loading ? (
                <div className="flex justify-center my-6">
                  <div className="w-8 h-8 border-4 border-plum/30 border-t-plum rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {boutiqueClothes.map((cloth) => (
                    <div
                      key={cloth.id}
                      className={`border rounded-lg overflow-hidden cursor-pointer ${
                        selectedCloth?.id === cloth.id ? 'border-plum ring-2 ring-plum/20' : 'border-gray-200'
                      }`}
                      onClick={() => handleClothSelect(cloth)}
                    >
                      <div>
                        <img
                          src={cloth.image}
                          alt={cloth.name}
                          className="w-full h-28 object-cover"
                        />
                        <div className="p-2">
                          <h4 className="font-medium">{cloth.name}</h4>
                          <p className="text-xs text-gray-500">{cloth.type}</p>
                          <p className="text-sm text-plum font-medium mt-1">₹{cloth.price}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        
        <button
          onClick={handleContinue}
          className="btn-primary"
          disabled={!isFormValid}
        >
          Continue to Measurements
        </button>
      </div>
    </div>
  );
};

export default ClothSelectionPage;
