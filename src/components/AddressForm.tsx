import React, { useState, useEffect } from 'react';
import { Address } from '../utils/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Home, Briefcase, Building } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface AddressFormProps {
  initialData?: Address;
  onSubmit: (address: Address) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

// List of Indian states
const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

const AddressForm: React.FC<AddressFormProps> = ({ 
  initialData, 
  onSubmit, 
  onCancel,
  isLoading = false
}) => {
  const [addressType, setAddressType] = useState<string>(initialData?.type || 'home');
  const [fullName, setFullName] = useState(initialData?.fullName || '');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [doorNo, setDoorNo] = useState(initialData?.doorNo || '');
  const [addressLine1, setAddressLine1] = useState(initialData?.addressLine1 || '');
  const [area, setArea] = useState(initialData?.area || '');
  const [landmark, setLandmark] = useState(initialData?.landmark || '');
  const [pincode, setPincode] = useState(initialData?.pincode || '');

  const [isDefault, setIsDefault] = useState(initialData?.isDefault || false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validate the form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!phone.trim()) newErrors.phone = 'Phone number is required';
    if (phone.trim() && !/^\d{10}$/.test(phone)) newErrors.phone = 'Please enter a valid 10-digit phone number';
    if (!doorNo.trim()) newErrors.doorNo = 'Door/Flat/House No. is required';
    if (!addressLine1.trim()) newErrors.addressLine1 = 'Address is required';
    if (!area.trim()) newErrors.area = 'Area/Street/Sector/Village is required';
    if (!pincode.trim()) newErrors.pincode = 'Pincode is required';
    if (pincode.trim() && !/^\d{6}$/.test(pincode)) newErrors.pincode = 'Please enter a valid 6-digit pincode';


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Form validation failed",
        description: "Please check the form for errors and try again.",
        variant: "destructive"
      });
      return;
    }
    
    const addressData: Address = {
      id: initialData?.id || `address_${Date.now()}`,
      type: addressType,
      fullName,
      phone,
      doorNo,
      addressLine1,
      area,
      landmark,
      pincode,
      isDefault
    };
    
    onSubmit(addressData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 py-2">
      {/* Address Type */}
      <div className="space-y-3">
        <Label className="text-gray-700 font-medium">Address Type</Label>
        <RadioGroup 
          value={addressType} 
          onValueChange={setAddressType}
          className="flex space-x-3"
        >
          <div className={`flex items-center space-x-2 border rounded-md p-2 flex-1 cursor-pointer ${addressType === 'home' ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'}`}>
            <RadioGroupItem value="home" id="home" className="text-blue-600" />
            <Label htmlFor="home" className="flex items-center cursor-pointer">
              <Home className="h-4 w-4 mr-2 text-blue-600" />
              Home
            </Label>
          </div>
          
          <div className={`flex items-center space-x-2 border rounded-md p-2 flex-1 cursor-pointer ${addressType === 'work' ? 'bg-green-50 border-green-200' : 'hover:bg-gray-50'}`}>
            <RadioGroupItem value="work" id="work" className="text-green-600" />
            <Label htmlFor="work" className="flex items-center cursor-pointer">
              <Briefcase className="h-4 w-4 mr-2 text-green-600" />
              Work
            </Label>
          </div>
          
          <div className={`flex items-center space-x-2 border rounded-md p-2 flex-1 cursor-pointer ${addressType === 'office' ? 'bg-purple-50 border-purple-200' : 'hover:bg-gray-50'}`}>
            <RadioGroupItem value="office" id="office" className="text-purple-600" />
            <Label htmlFor="office" className="flex items-center cursor-pointer">
              <Building className="h-4 w-4 mr-2 text-purple-600" />
              Office
            </Label>
          </div>
        </RadioGroup>
      </div>
      
      {/* Contact Information */}
      <div className="space-y-2">
        <Label htmlFor="fullName" className="text-gray-700 font-medium">Full Name</Label>
        <Input
          id="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Enter your full name"
          className={`py-6 ${errors.fullName ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-plum/50 focus:border-plum"}`}
        />
        {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone" className="text-gray-700 font-medium">Mobile Number</Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 text-sm">+91</span>
          </div>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
            placeholder="10-digit mobile number"
            maxLength={10}
            className={`py-6 pl-12 ${errors.phone ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-plum/50 focus:border-plum"}`}
          />
        </div>
        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
      </div>
      
      {/* Address Details */}
      <div className="space-y-2">
        <Label htmlFor="doorNo">Door/Flat/House No.</Label>
        <Input
          id="doorNo"
          value={doorNo}
          onChange={(e) => setDoorNo(e.target.value)}
          placeholder="e.g., Flat 101, 4th Floor"
          className={errors.doorNo ? "border-red-500" : ""}
        />
        {errors.doorNo && <p className="text-red-500 text-xs">{errors.doorNo}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="addressLine1">House Address</Label>
        <Textarea
          id="addressLine1"
          value={addressLine1}
          onChange={(e) => setAddressLine1(e.target.value)}
          placeholder="e.g., Building name, Society name"
          className={errors.addressLine1 ? "border-red-500" : ""}
          rows={2}
        />
        {errors.addressLine1 && <p className="text-red-500 text-xs">{errors.addressLine1}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="area">Area/Street/Sector/Village</Label>
        <Input
          id="area"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          placeholder="e.g., Koramangala, Indira Nagar"
          className={errors.area ? "border-red-500" : ""}
        />
        {errors.area && <p className="text-red-500 text-xs">{errors.area}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="landmark">Landmark (Optional)</Label>
        <Input
          id="landmark"
          value={landmark}
          onChange={(e) => setLandmark(e.target.value)}
          placeholder="e.g., Near Apollo Hospital"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="pincode">Pincode</Label>
        <Input
          id="pincode"
          value={pincode}
          onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
          placeholder="6-digit pincode"
          maxLength={6}
          className={errors.pincode ? "border-red-500" : ""}
        />
        {errors.pincode && <p className="text-red-500 text-xs">{errors.pincode}</p>}
      </div>
      
      {/* Default Address Checkbox */}
      <div className="flex items-center space-x-3 pt-6 pb-2">
        <Checkbox 
          id="isDefault" 
          checked={isDefault}
          onCheckedChange={(checked) => setIsDefault(checked as boolean)}
          className="h-5 w-5 text-plum border-gray-300 data-[state=checked]:bg-plum data-[state=checked]:border-plum rounded"
        />
        <Label htmlFor="isDefault" className="cursor-pointer text-gray-700 font-medium">
          Make this my default address
        </Label>
      </div>
      
      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-8">
        <Button 
          type="button" 
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 py-6 px-6"
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          disabled={isLoading}
          className="bg-plum hover:bg-plum/90 text-white py-6 px-8"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
              {initialData ? 'Updating...' : 'Saving...'}
            </>
          ) : (
            initialData ? 'Update Address' : 'Save Address'
          )}
        </Button>
      </div>
    </form>
  );
};

export default AddressForm;
