
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react';
import Header from '../components/Header';
import StepProgress from '../components/StepProgress';
import { mockApi } from '../utils/mockApi';
import { PickupSlot } from '../utils/types';
import { useOrder } from '../utils/OrderContext';

const steps = ["Address", "Boutique", "Design", "Cloth", "Measure", "Order", "Pickup"];

const PickupSchedulingPage: React.FC = () => {
  const navigate = useNavigate();
  const { order, updateOrder } = useOrder();
  const [pickupSlots, setPickupSlots] = useState<PickupSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  
  useEffect(() => {
    mockApi.getPickupSlots().then((data) => {
      setPickupSlots(data);
      if (data.length > 0) {
        setSelectedDate(data[0].date);
      }
      setLoading(false);
    });
  }, []);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      day: 'numeric',
      month: 'short'
    });
  };
  
  const getAvailableSlots = () => {
    if (!selectedDate) return [];
    
    const dateObj = pickupSlots.find(ps => ps.date === selectedDate);
    return dateObj ? dateObj.slots.filter(slot => slot.available) : [];
  };
  
  const handleConfirm = () => {
    if (selectedDate && selectedSlot && order.pickupDetails?.address) {
      updateOrder({
        pickupDetails: {
          ...order.pickupDetails,
          date: selectedDate,
          slot: selectedSlot
        }
      });
      
      // In a real app, submit the order here
      navigate('/confirmation');
    }
  };
  
  const availableSlots = getAvailableSlots();

  return (
    <div className="min-h-screen bg-cream">
      <Header title="Schedule Pickup" />
      
      <div className="step-container">
        <StepProgress steps={steps} currentStep={6} />
        
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <h2 className="text-lg font-medium mb-4">
            {order.clothOption === "own" || order.measurementOption === "oldGarment"
              ? "Schedule Pickup"
              : order.measurementOption === "homeService"
                ? "Schedule Home Visit"
                : "Schedule Delivery"
            }
          </h2>
          
          {loading ? (
            <div className="flex justify-center my-6">
              <div className="w-8 h-8 border-4 border-plum/30 border-t-plum rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <CalendarIcon className="w-5 h-5 text-plum mr-2" />
                  <h3 className="text-md font-medium">Select Date</h3>
                </div>
                
                <div className="flex overflow-x-auto pb-2 gap-2">
                  {pickupSlots.map((dateObj) => (
                    <div
                      key={dateObj.date}
                      className={`flex-shrink-0 py-2 px-3 border rounded-md cursor-pointer ${
                        selectedDate === dateObj.date 
                          ? 'border-plum bg-plum text-white' 
                          : 'border-gray-200'
                      }`}
                      onClick={() => {
                        setSelectedDate(dateObj.date);
                        setSelectedSlot(null);
                      }}
                    >
                      {formatDate(dateObj.date)}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <Clock className="w-5 h-5 text-plum mr-2" />
                  <h3 className="text-md font-medium">Select Time Slot</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  {availableSlots.map((slot) => (
                    <div
                      key={slot.id}
                      className={`py-2 px-3 border rounded-md text-center cursor-pointer ${
                        selectedSlot === slot.id 
                          ? 'border-plum bg-plum text-white' 
                          : 'border-gray-200'
                      }`}
                      onClick={() => setSelectedSlot(slot.id)}
                    >
                      {slot.time}
                    </div>
                  ))}
                </div>
                
                {availableSlots.length === 0 && (
                  <p className="text-center text-gray-500 my-4">No available slots on this date</p>
                )}
              </div>
              
              {order.pickupDetails?.address && (
                <div>
                  <div className="flex items-center mb-2">
                    <MapPin className="w-5 h-5 text-plum mr-2" />
                    <h3 className="text-md font-medium">Pickup Address</h3>
                  </div>
                  
                  <div className="border border-gray-200 rounded-md p-3">
                    <p className="font-medium">{order.pickupDetails.address.fullName}</p>
                    <p className="text-sm">
                      {order.pickupDetails.address.addressLine1}, 
                      {order.pickupDetails.address.addressLine2 && ` ${order.pickupDetails.address.addressLine2},`}
                    </p>
                    <p className="text-sm">
                      {order.pickupDetails.address.city}, {order.pickupDetails.address.state} - {order.pickupDetails.address.pincode}
                    </p>
                    <p className="text-sm mt-1">Phone: {order.pickupDetails.address.phone}</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        
        <button
          onClick={handleConfirm}
          className="btn-primary"
          disabled={!selectedDate || !selectedSlot}
        >
          Confirm Order
        </button>
      </div>
    </div>
  );
};

export default PickupSchedulingPage;
