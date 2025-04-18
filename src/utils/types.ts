
export interface Address {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  addresses: Address[];
}

export interface Boutique {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviewCount: number;
  location: string;
  services: Service[];
}

export interface Service {
  id: string;
  name: string;
  description: string;
  image: string;
  type: "blouse" | "lehenga";
}

export interface DesignOption {
  id: string;
  name: string;
  image: string;
  price: number;
  type: "embroidery" | "neckFront" | "neckBack" | "blouseType" | "puff" | "knot" | "lays" | "sareeFall";
}

export interface ClothOption {
  id: string;
  name: string;
  image: string;
  type: string;
  price: number;
}

export interface MeasurementOption {
  id: "manual" | "homeService" | "oldGarment";
  name: string;
  description: string;
  icon: string;
}

export interface Measurements {
  bust: string;
  waist: string;
  hips: string;
  shoulderToWaist: string;
  armLength: string;
  armHole: string;
  armCircumference: string;
  neckDepthFront: string;
  neckDepthBack: string;
  additional?: string;
}

export interface PickupSlot {
  date: string;
  slots: {
    id: string;
    time: string;
    available: boolean;
  }[];
}

export interface OrderDetails {
  boutique?: Boutique;
  service?: Service;
  designType?: "predesigned" | "custom";
  predesignedStyle?: {
    id: string;
    image: string;
    name: string;
    price: number;
  };
  customDesign?: {
    embroidery?: DesignOption;
    neckFront?: DesignOption;
    neckBack?: DesignOption;
    blouseType?: DesignOption;
    puff?: DesignOption;
    knot?: DesignOption;
    lays?: DesignOption;
    sareeFall?: DesignOption;
    customUploads?: Record<string, string>; // section -> image url
  };
  clothOption?: "own" | "boutique";
  ownClothDetails?: {
    material: string;
    color: string;
    quantity: string;
  };
  boutiqueCloth?: ClothOption;
  measurementOption?: MeasurementOption["id"];
  measurements?: Measurements;
  pickupDetails?: {
    date: string;
    slot: string;
    address: Address;
  };
  deliveryEstimate?: string;
  totalPrice?: number;
}
