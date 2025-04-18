
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ruler, Home, Package } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Header from '../components/Header';
import StepProgress from '../components/StepProgress';
import { mockApi } from '../utils/mockApi';
import { MeasurementOption } from '../utils/types';
import { measurementsSchema } from '../utils/validation';
import { useOrder } from '../utils/OrderContext';

const steps = ["Address", "Boutique", "Design", "Cloth", "Measure", "Order", "Pickup"];

const MeasurementPage: React.FC = () => {
  const navigate = useNavigate();
  const { order, updateOrder } = useOrder();
  const [measurementOptions, setMeasurementOptions] = useState<MeasurementOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<MeasurementOption["id"] | null>(null);
  const [loading, setLoading] = useState(true);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(measurementsSchema)
  });
  
  useEffect(() => {
    mockApi.getMeasurementOptions().then((data) => {
      setMeasurementOptions(data);
      setLoading(false);
    });
  }, []);
  
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'pencil':
        return <Ruler className="h-6 w-6 text-plum" />;
      case 'home':
        return <Home className="h-6 w-6 text-plum" />;
      case 'package':
        return <Package className="h-6 w-6 text-plum" />;
      default:
        return <Ruler className="h-6 w-6 text-plum" />;
    }
  };
  
  const handleOptionSelect = (id: MeasurementOption["id"]) => {
    setSelectedOption(id);
  };
  
  const onSubmitMeasurements = (data: any) => {
    updateOrder({
      measurementOption: selectedOption,
      measurements: selectedOption === "manual" ? data : undefined
    });
    navigate('/order-summary');
  };

  return (
    <div className="min-h-screen bg-cream">
      <Header title="Measurements" />
      
      <div className="step-container">
        <StepProgress steps={steps} currentStep={4} />
        
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <h2 className="text-lg font-medium mb-4">Select Measurement Option</h2>
          
          {loading ? (
            <div className="flex justify-center my-6">
              <div className="w-8 h-8 border-4 border-plum/30 border-t-plum rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 mb-6">
              {measurementOptions.map((option) => (
                <div
                  key={option.id}
                  className={`border rounded-lg p-4 cursor-pointer ${
                    selectedOption === option.id ? 'border-plum bg-plum/5' : 'border-gray-200'
                  }`}
                  onClick={() => handleOptionSelect(option.id)}
                >
                  <div className="flex items-start">
                    <div className="mr-3 mt-1">
                      {getIconComponent(option.icon)}
                    </div>
                    <div>
                      <h3 className="font-medium">{option.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                    </div>
                    <div className="ml-auto">
                      <div className={`w-5 h-5 rounded-full border-2 ${
                        selectedOption === option.id ? 'border-plum bg-plum' : 'border-gray-300'
                      }`}>
                        {selectedOption === option.id && (
                          <svg className="w-full h-full text-white p-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {selectedOption === "manual" && (
            <form onSubmit={handleSubmit(onSubmitMeasurements)}>
              <h3 className="text-md font-medium mb-3">Enter your measurements (in inches)</h3>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="form-label">Bust</label>
                  <input
                    {...register("bust")}
                    className={`input-field ${errors.bust ? 'border-red-500' : ''}`}
                    placeholder="e.g., 36"
                  />
                  {errors.bust && <p className="error-text">{errors.bust.message as string}</p>}
                </div>
                
                <div>
                  <label className="form-label">Waist</label>
                  <input
                    {...register("waist")}
                    className={`input-field ${errors.waist ? 'border-red-500' : ''}`}
                    placeholder="e.g., 28"
                  />
                  {errors.waist && <p className="error-text">{errors.waist.message as string}</p>}
                </div>
                
                <div>
                  <label className="form-label">Hips</label>
                  <input
                    {...register("hips")}
                    className={`input-field ${errors.hips ? 'border-red-500' : ''}`}
                    placeholder="e.g., 38"
                  />
                  {errors.hips && <p className="error-text">{errors.hips.message as string}</p>}
                </div>
                
                <div>
                  <label className="form-label">Shoulder to Waist</label>
                  <input
                    {...register("shoulderToWaist")}
                    className={`input-field ${errors.shoulderToWaist ? 'border-red-500' : ''}`}
                    placeholder="e.g., 16"
                  />
                  {errors.shoulderToWaist && <p className="error-text">{errors.shoulderToWaist.message as string}</p>}
                </div>
                
                <div>
                  <label className="form-label">Arm Length</label>
                  <input
                    {...register("armLength")}
                    className={`input-field ${errors.armLength ? 'border-red-500' : ''}`}
                    placeholder="e.g., 24"
                  />
                  {errors.armLength && <p className="error-text">{errors.armLength.message as string}</p>}
                </div>
                
                <div>
                  <label className="form-label">Arm Hole</label>
                  <input
                    {...register("armHole")}
                    className={`input-field ${errors.armHole ? 'border-red-500' : ''}`}
                    placeholder="e.g., 16"
                  />
                  {errors.armHole && <p className="error-text">{errors.armHole.message as string}</p>}
                </div>
                
                <div>
                  <label className="form-label">Arm Circumference</label>
                  <input
                    {...register("armCircumference")}
                    className={`input-field ${errors.armCircumference ? 'border-red-500' : ''}`}
                    placeholder="e.g., 12"
                  />
                  {errors.armCircumference && <p className="error-text">{errors.armCircumference.message as string}</p>}
                </div>
                
                <div>
                  <label className="form-label">Neck Depth (Front)</label>
                  <input
                    {...register("neckDepthFront")}
                    className={`input-field ${errors.neckDepthFront ? 'border-red-500' : ''}`}
                    placeholder="e.g., 3"
                  />
                  {errors.neckDepthFront && <p className="error-text">{errors.neckDepthFront.message as string}</p>}
                </div>
                
                <div>
                  <label className="form-label">Neck Depth (Back)</label>
                  <input
                    {...register("neckDepthBack")}
                    className={`input-field ${errors.neckDepthBack ? 'border-red-500' : ''}`}
                    placeholder="e.g., 2"
                  />
                  {errors.neckDepthBack && <p className="error-text">{errors.neckDepthBack.message as string}</p>}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="form-label">Additional Notes (Optional)</label>
                <textarea
                  {...register("additional")}
                  className="input-field min-h-[80px]"
                  placeholder="Any specific requirements or details..."
                ></textarea>
              </div>
              
              <button type="submit" className="btn-primary">Continue to Order Summary</button>
            </form>
          )}
          
          {(selectedOption === "homeService" || selectedOption === "oldGarment") && (
            <button 
              onClick={() => onSubmitMeasurements({})}
              className="btn-primary mt-4"
            >
              Continue to Order Summary
            </button>
          )}
        </div>
        
        {!selectedOption && (
          <button
            className="btn-primary opacity-50 cursor-not-allowed"
            disabled
          >
            Please Select a Measurement Option
          </button>
        )}
      </div>
    </div>
  );
};

export default MeasurementPage;
