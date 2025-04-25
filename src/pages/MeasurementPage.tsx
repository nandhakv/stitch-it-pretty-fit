import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Ruler, Home, Package, Check, Info, ChevronRight, MapPin, Calendar, Clock } from 'lucide-react';
import AddressSelector from '../components/AddressSelector';
import { useOrder } from '../utils/OrderContext';
import { mockApi } from '../utils/mockApi';
import { MeasurementOption } from '../utils/types';

const MeasurementPage: React.FC = () => {
  const navigate = useNavigate();
  const { boutiqueId, serviceId } = useParams<{ boutiqueId: string; serviceId: string }>();
  const { order, updateOrder } = useOrder();
  const [measurementOptions, setMeasurementOptions] = useState<MeasurementOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<"manual" | "homeService" | "oldGarment" | null>(order.measurementOption || null);
  const [loading, setLoading] = useState(true);
  const formRef = useRef<HTMLFormElement>(null);
  
  // State for address selection
  const [showAddressSelector, setShowAddressSelector] = useState(false);
  const [addressSelected, setAddressSelected] = useState(false);
  
  // State for scheduling
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  
  // Available time slots
  const timeSlots = [
    "9:00 AM - 11:00 AM",
    "11:00 AM - 1:00 PM",
    "2:00 PM - 4:00 PM",
    "4:00 PM - 6:00 PM"
  ];
  
  // Get available dates (next 7 days)
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    // Start from tomorrow
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        value: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
      });
    }
    
    return dates;
  };
  
  const availableDates = getAvailableDates();
  
  // State for manual measurements
  const [measurements, setMeasurements] = useState({
    bust: order.measurements?.bust || '',
    waist: order.measurements?.waist || '',
    hips: order.measurements?.hips || '',
    shoulderToWaist: order.measurements?.shoulderToWaist || '',
    armLength: order.measurements?.armLength || '',
    armHole: order.measurements?.armHole || '',
    armCircumference: order.measurements?.armCircumference || '',
    neckDepthFront: order.measurements?.neckDepthFront || '',
    neckDepthBack: order.measurements?.neckDepthBack || '',
    additional: order.measurements?.additional || ''
  });
  
  // Track form validity
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isFormValid, setIsFormValid] = useState(false);
  
  useEffect(() => {
    mockApi.getMeasurementOptions().then((data) => {
      setMeasurementOptions(data);
      setLoading(false);
    });
  }, []);
  
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'pencil':
        return <Ruler className="h-5 w-5 text-plum" />;
      case 'home':
        return <Home className="h-5 w-5 text-plum" />;
      case 'package':
        return <Package className="h-5 w-5 text-plum" />;
      default:
        return <Ruler className="h-5 w-5 text-plum" />;
    }
  };
  
  const handleOptionSelect = (id: "manual" | "homeService" | "oldGarment") => {
    setSelectedOption(id);
  };
  
  // Handle input change for manual measurements
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMeasurements(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };
  
  // Validate manual measurements form and scheduling
  useEffect(() => {
    if (selectedOption === 'manual') {
      const requiredFields = [
        'bust', 'waist', 'hips', 'shoulderToWaist', 
        'armLength', 'armHole', 'armCircumference', 
        'neckDepthFront', 'neckDepthBack'
      ];
      
      const errors: Record<string, string> = {};
      let valid = true;
      
      requiredFields.forEach(field => {
        if (!measurements[field as keyof typeof measurements]) {
          errors[field] = `${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required`;
          valid = false;
        }
      });
      
      setFormErrors(errors);
      setIsFormValid(valid);
    }
  }, [measurements, selectedOption]);
  
  const handleAddressSubmit = (pincode: string) => {
    setAddressSelected(true);
    setShowAddressSelector(false);
  };
  
  const isSchedulingValid = () => {
    return selectedDate && selectedTimeSlot;
  };
  
  const handleContinue = () => {
    // For home service, validate address and scheduling
    if (selectedOption === 'homeService') {
      if (!addressSelected) {
        setShowAddressSelector(true);
        return;
      }
      
      if (!isSchedulingValid()) {
        return;
      }
    }
    
    // For manual measurements, validate the form
    if (selectedOption === 'manual') {
      const requiredFields = [
        'bust', 'waist', 'hips', 'shoulderToWaist', 
        'armLength', 'armHole', 'armCircumference', 
        'neckDepthFront', 'neckDepthBack'
      ];
      
      const errors: Record<string, string> = {};
      let valid = true;
      
      requiredFields.forEach(field => {
        if (!measurements[field as keyof typeof measurements]) {
          errors[field] = `${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required`;
          valid = false;
        }
      });
      
      setFormErrors(errors);
      
      if (!valid) {
        return;
      }
    }
    
    updateOrder({
      measurementOption: selectedOption,
      measurements: selectedOption === 'manual' ? measurements : undefined,
      scheduledDate: selectedOption === 'homeService' ? selectedDate : undefined,
      scheduledTime: selectedOption === 'homeService' ? selectedTimeSlot : undefined
    });
    
    // Use nested route if params are available, otherwise use fallback route
    if (boutiqueId && serviceId) {
      navigate(`/boutique/${boutiqueId}/service/${serviceId}/order-summary`);
    } else {
      navigate('/order-summary');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page header with design info - hidden on mobile */}
      <div className="hidden md:block bg-gradient-to-r from-plum/90 to-plum/70 text-white py-5 md:py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">Measurements</h1>
          <p className="text-white/80 max-w-2xl text-sm md:text-base">
            Choose how you'd like to provide measurements for your {order.service?.name || "item"} to ensure the perfect fit.
          </p>
        </div>
      </div>
      
      {/* Main content */}
      <div className="container mx-auto md:p-6 lg:p-8 max-w-4xl px-0 md:px-4 pt-0 md:pt-6">
        {/* Measurement options */}
        <div className="bg-white md:rounded-xl shadow-sm overflow-hidden mb-6 rounded-none md:rounded-xl p-0">
          <div className="p-5">
            <h2 className="text-lg font-medium mb-4 flex items-center">
              <Ruler className="w-5 h-5 mr-2 text-plum" />
              Select Measurement Option
            </h2>
            
            {loading ? (
              <div className="flex justify-center my-6">
                <div className="w-8 h-8 border-4 border-plum/30 border-t-plum rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 mb-6">
                {measurementOptions.map((option) => (
                  <div
                    key={option.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedOption === option.id ? 'border-plum bg-plum/5' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleOptionSelect(option.id)}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-plum/10 flex items-center justify-center mr-3">
                        {getIconComponent(option.icon)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{option.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                      </div>
                      <div className="ml-3 flex-shrink-0">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedOption === option.id ? 'border-plum bg-plum' : 'border-gray-300'
                        }`}>
                          {selectedOption === option.id && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {selectedOption === "homeService" && (
              <div className="border-t border-gray-100 pt-4 mt-4">
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-sm text-blue-800 mb-4">
                  <h3 className="font-medium mb-2 flex items-center">
                    <Home className="w-4 h-4 mr-2" />
                    Home Measurement Service
                  </h3>
                  <p className="mb-2">
                    Our professional tailor will visit your address to take accurate measurements.
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Service available within city limits</li>
                    <li>Appointment scheduling required</li>
                    <li>₹200 service charge applies</li>
                  </ul>
                </div>
                
                {showAddressSelector ? (
                  <div className="mb-4">
                    <h3 className="text-md font-medium mb-3 flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-plum" />
                      Select Delivery Address
                    </h3>
                    <AddressSelector onSubmit={handleAddressSubmit} />
                  </div>
                ) : addressSelected ? (
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-md font-medium flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-plum" />
                        Delivery Address
                      </h3>
                      <button 
                        className="text-xs text-plum hover:text-plum/80 font-medium"
                        onClick={() => setShowAddressSelector(true)}
                      >
                        Change
                      </button>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-md border border-gray-200 mb-6">
                      <p className="text-sm font-medium text-gray-800">Home</p>
                      <p className="text-xs text-gray-600 mt-1">123 Main Street, Apartment 4B</p>
                      <p className="text-xs text-gray-600">Mumbai, Maharashtra 400001</p>
                      <p className="text-xs text-gray-600">+91 9876543210</p>
                    </div>
                    
                    <div className="mb-4">
                      <h3 className="text-md font-medium mb-3 flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-plum" />
                        Select Appointment Date
                      </h3>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-4">
                        {availableDates.map(date => (
                          <button
                            key={date.value}
                            className={`text-xs p-2 border rounded-md ${selectedDate === date.value ? 'bg-plum/10 border-plum text-plum font-medium' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}
                            onClick={() => setSelectedDate(date.value)}
                          >
                            {date.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {selectedDate && (
                      <div className="mb-4">
                        <h3 className="text-md font-medium mb-3 flex items-center">
                          <Clock className="w-4 h-4 mr-2 text-plum" />
                          Select Time Slot
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                          {timeSlots.map(slot => (
                            <button
                              key={slot}
                              className={`text-xs p-2 border rounded-md ${selectedTimeSlot === slot ? 'bg-plum/10 border-plum text-plum font-medium' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}
                              onClick={() => setSelectedTimeSlot(slot)}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    className="w-full py-2.5 rounded-md bg-plum/10 text-plum font-medium hover:bg-plum/20 transition-colors mb-4 flex items-center justify-center"
                    onClick={() => setShowAddressSelector(true)}
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Select Delivery Address
                  </button>
                )}
              </div>
            )}
            
            {selectedOption === "oldGarment" && (
              <div className="border-t border-gray-100 pt-4 mt-4">
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-sm text-blue-800">
                  <h3 className="font-medium mb-2 flex items-center">
                    <Package className="w-4 h-4 mr-2" />
                    Using Existing Garment
                  </h3>
                  <p className="mb-2">
                    You'll need to send us a well-fitting garment similar to what you're ordering.
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Clean and press the garment before sending</li>
                    <li>Our pickup service will collect it along with any fabric</li>
                    <li>The garment will be returned with your order</li>
                  </ul>
                </div>
              </div>
            )}
            
            {selectedOption === "manual" && (
              <div className="border-t border-gray-100 pt-4 mt-4">
                <div className="flex items-center mb-4">
                  <Info className="w-4 h-4 text-blue-500 mr-2" />
                  <p className="text-sm text-gray-600">Enter your measurements in inches. For the most accurate results, use a fabric measuring tape.</p>
                </div>
                
                <form ref={formRef} className="mt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bust</label>
                      <input
                        type="text"
                        name="bust"
                        value={measurements.bust}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-plum/50 focus:border-plum ${formErrors.bust ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="e.g., 36"
                      />
                      {formErrors.bust && <p className="text-red-500 text-xs mt-1">{formErrors.bust}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Waist</label>
                      <input
                        type="text"
                        name="waist"
                        value={measurements.waist}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-plum/50 focus:border-plum ${formErrors.waist ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="e.g., 28"
                      />
                      {formErrors.waist && <p className="text-red-500 text-xs mt-1">{formErrors.waist}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Hips</label>
                      <input
                        type="text"
                        name="hips"
                        value={measurements.hips}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-plum/50 focus:border-plum ${formErrors.hips ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="e.g., 38"
                      />
                      {formErrors.hips && <p className="text-red-500 text-xs mt-1">{formErrors.hips}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Shoulder to Waist</label>
                      <input
                        type="text"
                        name="shoulderToWaist"
                        value={measurements.shoulderToWaist}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-plum/50 focus:border-plum ${formErrors.shoulderToWaist ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="e.g., 16"
                      />
                      {formErrors.shoulderToWaist && <p className="text-red-500 text-xs mt-1">{formErrors.shoulderToWaist}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Arm Length</label>
                      <input
                        type="text"
                        name="armLength"
                        value={measurements.armLength}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-plum/50 focus:border-plum ${formErrors.armLength ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="e.g., 24"
                      />
                      {formErrors.armLength && <p className="text-red-500 text-xs mt-1">{formErrors.armLength}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Arm Hole</label>
                      <input
                        type="text"
                        name="armHole"
                        value={measurements.armHole}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-plum/50 focus:border-plum ${formErrors.armHole ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="e.g., 16"
                      />
                      {formErrors.armHole && <p className="text-red-500 text-xs mt-1">{formErrors.armHole}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Arm Circumference</label>
                      <input
                        type="text"
                        name="armCircumference"
                        value={measurements.armCircumference}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-plum/50 focus:border-plum ${formErrors.armCircumference ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="e.g., 12"
                      />
                      {formErrors.armCircumference && <p className="text-red-500 text-xs mt-1">{formErrors.armCircumference}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Neck Depth (Front)</label>
                      <input
                        type="text"
                        name="neckDepthFront"
                        value={measurements.neckDepthFront}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-plum/50 focus:border-plum ${formErrors.neckDepthFront ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="e.g., 3"
                      />
                      {formErrors.neckDepthFront && <p className="text-red-500 text-xs mt-1">{formErrors.neckDepthFront}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Neck Depth (Back)</label>
                      <input
                        type="text"
                        name="neckDepthBack"
                        value={measurements.neckDepthBack}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-plum/50 focus:border-plum ${formErrors.neckDepthBack ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="e.g., 2"
                      />
                      {formErrors.neckDepthBack && <p className="text-red-500 text-xs mt-1">{formErrors.neckDepthBack}</p>}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes (Optional)</label>
                    <textarea
                      name="additional"
                      value={measurements.additional}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-plum/50 focus:border-plum min-h-[80px]"
                      placeholder="Any specific requirements or details..."
                    ></textarea>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
        
        {/* Help section */}
        <div className="bg-gray-50 border border-gray-200 md:rounded-xl p-4 md:p-6 mb-6 mx-4 md:mx-0">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Measurement Tips</h3>
          <p className="text-gray-600 mb-2">
            For the most accurate measurements, wear form-fitting clothes and stand straight with your arms relaxed at your sides.
          </p>
          <p className="text-gray-600">
            If you're unsure about taking measurements yourself, our home measurement service or using an existing garment are excellent alternatives.
          </p>
        </div>
        
        {/* Spacer to ensure content isn't hidden behind sticky button */}
        <div className="h-24 md:h-20"></div>
        
        {/* Sticky Continue button */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:p-3 z-40 md:max-w-md md:mx-auto md:right-0 md:left-0 md:rounded-lg md:shadow-lg md:border md:bottom-6">
          <button 
            onClick={handleContinue}
            className={`w-full py-3.5 md:py-3 rounded-xl font-medium transition-colors ${(selectedOption && 
              ((selectedOption === 'manual' && isFormValid) || 
               (selectedOption === 'oldGarment') || 
               (selectedOption === 'homeService' && addressSelected && isSchedulingValid()))) ? 
              'bg-plum hover:bg-plum/90 text-white md:text-base md:tracking-wide md:font-semibold md:shadow-sm' : 
              'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
            disabled={!selectedOption || 
              (selectedOption === 'manual' && !isFormValid) || 
              (selectedOption === 'homeService' && (!addressSelected || !isSchedulingValid()))}
          >
            {!selectedOption ? (
              "Select a measurement option"
            ) : selectedOption === 'manual' && !isFormValid ? (
              "Complete all measurements"
            ) : selectedOption === 'homeService' && !addressSelected ? (
              "Select delivery address"
            ) : selectedOption === 'homeService' && !isSchedulingValid() ? (
              "Select appointment date and time"
            ) : (
              <span className="flex items-center justify-center">
                Continue to Order Summary
                <ChevronRight className="w-4 h-4 ml-1" />
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MeasurementPage;
