
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, User, Search } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Header from '../components/Header';
import StepProgress from '../components/StepProgress';
import { mockApi } from '../utils/mockApi';
import { addressSchema } from '../utils/validation';
import { useOrder } from '../utils/OrderContext';
import { Address } from '../utils/types';

const steps = ["Address", "Boutique", "Design", "Cloth", "Measure", "Order", "Pickup"];

const AddressPage: React.FC = () => {
  const navigate = useNavigate();
  const { order, updateOrder } = useOrder();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<Address>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      pincode: '',
      isDefault: false
    }
  });

  useEffect(() => {
    // Simulate checking login status
    const checkLoginStatus = setTimeout(() => {
      setIsLoggedIn(true);
      
      // If logged in, fetch user data and addresses
      mockApi.getUser().then(user => {
        setAddresses(user.addresses);
        
        // If user has default address, select it
        const defaultAddress = user.addresses.find(addr => addr.isDefault);
        if (defaultAddress) {
          setSelectedAddress(defaultAddress);
        }
      });
    }, 1000);
    
    return () => clearTimeout(checkLoginStatus);
  }, []);

  const onAddressSubmit = (data: Address) => {
    const newAddress = { ...data };
    setAddresses(prev => [...prev, newAddress]);
    setSelectedAddress(newAddress);
    setIsAddressFormOpen(false);
    reset();
  };

  const handleAddressSelect = (address: Address) => {
    setSelectedAddress(address);
  };

  const handleContinue = () => {
    if (selectedAddress) {
      updateOrder({
        pickupDetails: {
          ...order.pickupDetails,
          address: selectedAddress
        }
      });
      navigate('/boutiques');
    }
  };

  const handleLogin = () => {
    // For demo, just set logged in to true
    setIsLoggedIn(true);
  };

  return (
    <div className="min-h-screen bg-cream">
      <Header title="Location & Address" showBackButton={false} />
      
      <div className="step-container">
        <StepProgress steps={steps} currentStep={0} />
        
        <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for your location"
              className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-plum"
            />
          </div>
          
          {!isLoggedIn ? (
            <div className="mt-6 text-center">
              <p className="text-gray-600 mb-3">Login to access your saved addresses</p>
              <button 
                onClick={handleLogin}
                className="btn-primary"
              >
                Login with Mobile
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-lg font-medium mt-6 mb-3">Saved Addresses</h2>
              
              {addresses.length > 0 ? (
                <div>
                  {addresses.map((address, index) => (
                    <div 
                      key={index}
                      onClick={() => handleAddressSelect(address)}
                      className={`border p-3 rounded-lg mb-3 cursor-pointer ${
                        selectedAddress === address ? 'border-plum bg-plum/5' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-start">
                        <div className="mr-3 mt-1">
                          <MapPin className="w-5 h-5 text-plum" />
                        </div>
                        <div>
                          <div className="font-medium">{address.fullName}</div>
                          <div className="text-sm text-gray-600">
                            {address.addressLine1}, {address.addressLine2 && `${address.addressLine2}, `}
                            {address.city}, {address.state} - {address.pincode}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            <Phone className="w-3 h-3 inline mr-1" /> {address.phone}
                          </div>
                          {address.isDefault && (
                            <div className="inline-block bg-plum/10 text-plum text-xs px-2 py-1 rounded mt-2">
                              Default
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
              
              {!isAddressFormOpen ? (
                <button
                  onClick={() => setIsAddressFormOpen(true)}
                  className="flex items-center justify-center w-full mt-3 py-2 border border-plum text-plum rounded-lg"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Add New Address
                </button>
              ) : (
                <form onSubmit={handleSubmit(onAddressSubmit)} className="mt-4">
                  <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <input
                        {...register('fullName')}
                        className={`input-field pl-10 ${errors.fullName ? 'border-red-500' : ''}`}
                        placeholder="Enter your full name"
                      />
                    </div>
                    {errors.fullName && <p className="error-text">{errors.fullName.message}</p>}
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <input
                        {...register('phone')}
                        className={`input-field pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                        placeholder="Enter your mobile number"
                      />
                    </div>
                    {errors.phone && <p className="error-text">{errors.phone.message}</p>}
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Address Line 1</label>
                    <input
                      {...register('addressLine1')}
                      className={`input-field ${errors.addressLine1 ? 'border-red-500' : ''}`}
                      placeholder="House/Flat No., Building, Street"
                    />
                    {errors.addressLine1 && <p className="error-text">{errors.addressLine1.message}</p>}
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Landmark (Optional)</label>
                    <input
                      {...register('landmark')}
                      className="input-field"
                      placeholder="Nearby landmark"
                    />
                  </div>
                  
                  <div className="flex mb-3 gap-3">
                    <div className="flex-1">
                      <label className="form-label">Area</label>
                      <input
                        {...register('area')}
                        className={`input-field ${errors.area ? 'border-red-500' : ''}`}
                        placeholder="Area"
                      />
                      {errors.area && <p className="error-text">{errors.area.message}</p>}
                    </div>
                    <div className="flex-1">
                      <label className="form-label">Door No</label>
                      <input
                        {...register('doorNo')}
                        className={`input-field ${errors.doorNo ? 'border-red-500' : ''}`}
                        placeholder="Door/Flat No"
                      />
                      {errors.doorNo && <p className="error-text">{errors.doorNo.message}</p>}
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Pincode</label>
                    <input
                      {...register('pincode')}
                      className={`input-field ${errors.pincode ? 'border-red-500' : ''}`}
                      placeholder="6-digit pincode"
                    />
                    {errors.pincode && <p className="error-text">{errors.pincode.message}</p>}
                  </div>
                  
                  <div className="mb-4 flex items-center">
                    <input
                      type="checkbox"
                      id="isDefault"
                      {...register('isDefault')}
                      className="w-4 h-4 text-plum focus:ring-plum rounded"
                    />
                    <label htmlFor="isDefault" className="ml-2 text-sm text-gray-700">
                      Set as default address
                    </label>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setIsAddressFormOpen(false)}
                      className="btn-secondary flex-1"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary flex-1"
                    >
                      Save Address
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
        
        {selectedAddress && (
          <button onClick={handleContinue} className="btn-primary">
            Continue
          </button>
        )}
      </div>
    </div>
  );
};

export default AddressPage;
