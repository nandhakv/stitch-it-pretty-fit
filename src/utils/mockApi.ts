
import { 
  Address, 
  Boutique, 
  ClothOption, 
  DesignOption, 
  MeasurementOption, 
  PickupSlot, 
  User 
} from "./types";

// Mock user data
const mockUser: User = {
  id: "user123",
  name: "Priya Sharma",
  phone: "9876543210",
  email: "priya.sharma@example.com",
  addresses: [
    {
      fullName: "Priya Sharma",
      phone: "9876543210",
      addressLine1: "Flat 301, Sunshine Apartments",
      addressLine2: "MG Road",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560001",
      isDefault: true,
    }
  ]
};

// Mock boutiques
const mockBoutiques: Boutique[] = [
  {
    id: "b1",
    name: "Elegant Creations",
    image: "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGluZGlhbiUyMGJvdXRpcXVlfGVufDB8fDB8fHww",
    rating: 4.8,
    reviewCount: 124,
    location: "Bangalore",
    services: [
      {
        id: "s1",
        name: "Designer Blouses",
        description: "Exclusive designer blouses with intricate embroidery and perfect fit",
        image: "https://images.unsplash.com/photo-1610030469668-8e9f693c62ec?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmxvdXNlfGVufDB8fDB8fHww",
        type: "blouse"
      },
      {
        id: "s2",
        name: "Custom Lehengas",
        description: "Bespoke lehengas tailored to your style and measurements",
        image: "https://images.unsplash.com/photo-1594463750939-ebb28c3f7f75?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bGVoZW5nYXxlbnwwfHwwfHx8MA%3D%3D",
        type: "lehenga"
      }
    ]
  },
  {
    id: "b2",
    name: "Royal Threads",
    image: "https://images.unsplash.com/photo-1612871689353-cccf581d667b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGluZGlhbiUyMGJvdXRpcXVlfGVufDB8fDB8fHww",
    rating: 4.6,
    reviewCount: 98,
    location: "Delhi",
    services: [
      {
        id: "s3",
        name: "Traditional Blouses",
        description: "Classic blouses with traditional designs and modern comfort",
        image: "https://images.unsplash.com/photo-1636022334895-059a72b1e5e9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGJsb3VzZXxlbnwwfHwwfHx8MA%3D%3D",
        type: "blouse"
      },
      {
        id: "s4",
        name: "Wedding Lehengas",
        description: "Exquisite wedding lehengas with detailed craftsmanship",
        image: "https://images.unsplash.com/photo-1630601352785-2d3e737a1d2f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8bGVoZW5nYXxlbnwwfHwwfHx8MA%3D%3D",
        type: "lehenga"
      }
    ]
  },
  {
    id: "b3",
    name: "Fashion Heritage",
    image: "https://images.unsplash.com/photo-1613567064508-536f88d44fca?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8aW5kaWFuJTIwYm91dGlxdWV8ZW58MHx8MHx8fDA%3D",
    rating: 4.5,
    reviewCount: 87,
    location: "Mumbai",
    services: [
      {
        id: "s5",
        name: "Contemporary Blouses",
        description: "Modern blouse designs with a touch of traditional aesthetics",
        image: "https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzR8fGJsb3VzZXxlbnwwfHwwfHx8MA%3D%3D",
        type: "blouse"
      },
      {
        id: "s6",
        name: "Designer Lehengas",
        description: "Trendsetting lehenga designs for all occasions",
        image: "https://images.unsplash.com/photo-1601823984263-b87b59798b70?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGxlaGVuZ2F8ZW58MHx8MHx8fDA%3D",
        type: "lehenga"
      }
    ]
  }
];

// Mock design options
const mockDesignOptions: DesignOption[] = [
  // Embroidery Types
  {
    id: "e1",
    name: "Zari Work",
    image: "https://images.unsplash.com/photo-1573515227985-f01bb7d83836?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjB8fGVtYnJvaWRlcnl8ZW58MHx8MHx8fDA%3D",
    price: 2500,
    type: "embroidery"
  },
  {
    id: "e2",
    name: "Beadwork",
    image: "https://plus.unsplash.com/premium_photo-1661654778619-d3026951f10c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YmVhZHdvcmt8ZW58MHx8MHx8fDA%3D",
    price: 1800,
    type: "embroidery"
  },
  {
    id: "e3",
    name: "Thread Work",
    image: "https://images.unsplash.com/photo-1626504202235-225d5d17951c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZW1icm9pZGVyeXxlbnwwfHwwfHx8MA%3D%3D",
    price: 1500,
    type: "embroidery"
  },
  
  // Neck Front Styles
  {
    id: "nf1",
    name: "Sweetheart",
    image: "https://images.unsplash.com/photo-1602697196016-6841bbf5cb91?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTl8fG5lY2tsaW5lfGVufDB8fDB8fHww",
    price: 800,
    type: "neckFront"
  },
  {
    id: "nf2",
    name: "V-Neck",
    image: "https://images.unsplash.com/photo-1477600500630-3f7aac394f19?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8ODR8fG5lY2tsaW5lfGVufDB8fDB8fHww",
    price: 600,
    type: "neckFront"
  },
  {
    id: "nf3",
    name: "Round",
    image: "https://images.unsplash.com/photo-1553111348-592676487799?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjV8fG5lY2tsaW5lfGVufDB8fDB8fHww",
    price: 500,
    type: "neckFront"
  },
  
  // Neck Back Styles
  {
    id: "nb1",
    name: "Deep Back",
    image: "https://images.unsplash.com/photo-1511424322270-14653e309c95?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGJhY2slMjBkcmVzc3xlbnwwfHwwfHx8MA%3D%3D",
    price: 900,
    type: "neckBack"
  },
  {
    id: "nb2",
    name: "Tie-Back",
    image: "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YmFjayUyMGRyZXNzfGVufDB8fDB8fHww",
    price: 750,
    type: "neckBack"
  },
  {
    id: "nb3",
    name: "High-Back",
    image: "https://plus.unsplash.com/premium_photo-1673460233823-46bef9054fc7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aGlnaCUyMGJhY2t8ZW58MHx8MHx8fDA%3D",
    price: 600,
    type: "neckBack"
  },
];

// Mock cloth options
const mockClothOptions: ClothOption[] = [
  {
    id: "c1",
    name: "Silk",
    image: "https://images.unsplash.com/photo-1603104144264-f5e2c4de1cb9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c2lsayUyMGZhYnJpY3xlbnwwfHwwfHx8MA%3D%3D",
    type: "Premium",
    price: 3500
  },
  {
    id: "c2",
    name: "Cotton",
    image: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y290dG9uJTIwZmFicmljfGVufDB8fDB8fHww",
    type: "Comfortable",
    price: 1200
  },
  {
    id: "c3",
    name: "Georgette",
    image: "https://plus.unsplash.com/premium_photo-1661669717314-a80b83831040?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Z2VvcmdldHRlJTIwZmFicmljfGVufDB8fDB8fHww",
    type: "Flowy",
    price: 1800
  },
  {
    id: "c4",
    name: "Velvet",
    image: "https://images.unsplash.com/photo-1520951669017-c5f8622dc2e4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dmVsdmV0JTIwZmFicmljfGVufDB8fDB8fHww",
    type: "Luxurious",
    price: 2800
  },
];

// Mock measurement options
const mockMeasurementOptions: MeasurementOption[] = [
  {
    id: "manual",
    name: "Enter Manually",
    description: "Enter your measurements yourself",
    icon: "pencil"
  },
  {
    id: "homeService",
    name: "Home Measurement Service",
    description: "Our professional will visit your home for measurements",
    icon: "home"
  },
  {
    id: "oldGarment",
    name: "Send Old Garment",
    description: "Send your old well-fitted garment for reference",
    icon: "package"
  }
];

// Mock pickup slots
const mockPickupSlots: PickupSlot[] = [
  {
    date: "2025-04-20",
    slots: [
      { id: "s1", time: "10:00 AM - 12:00 PM", available: true },
      { id: "s2", time: "12:00 PM - 2:00 PM", available: true },
      { id: "s3", time: "3:00 PM - 5:00 PM", available: false },
      { id: "s4", time: "5:00 PM - 7:00 PM", available: true },
    ]
  },
  {
    date: "2025-04-21",
    slots: [
      { id: "s5", time: "10:00 AM - 12:00 PM", available: true },
      { id: "s6", time: "12:00 PM - 2:00 PM", available: false },
      { id: "s7", time: "3:00 PM - 5:00 PM", available: true },
      { id: "s8", time: "5:00 PM - 7:00 PM", available: true },
    ]
  },
  {
    date: "2025-04-22",
    slots: [
      { id: "s9", time: "10:00 AM - 12:00 PM", available: false },
      { id: "s10", time: "12:00 PM - 2:00 PM", available: true },
      { id: "s11", time: "3:00 PM - 5:00 PM", available: true },
      { id: "s12", time: "5:00 PM - 7:00 PM", available: false },
    ]
  }
];

// Mock API Functions
export const mockApi = {
  getUser: () => {
    return new Promise<User>((resolve) => {
      setTimeout(() => resolve(mockUser), 500);
    });
  },
  
  getBoutiques: () => {
    return new Promise<Boutique[]>((resolve) => {
      setTimeout(() => resolve(mockBoutiques), 700);
    });
  },
  
  getBoutique: (id: string) => {
    return new Promise<Boutique | undefined>((resolve) => {
      setTimeout(() => {
        const boutique = mockBoutiques.find(b => b.id === id);
        resolve(boutique);
      }, 500);
    });
  },
  
  getDesignOptions: (type: string) => {
    return new Promise<DesignOption[]>((resolve) => {
      setTimeout(() => {
        const options = mockDesignOptions.filter(option => option.type === type);
        resolve(options);
      }, 600);
    });
  },
  
  getClothOptions: () => {
    return new Promise<ClothOption[]>((resolve) => {
      setTimeout(() => resolve(mockClothOptions), 600);
    });
  },
  
  getMeasurementOptions: () => {
    return new Promise<MeasurementOption[]>((resolve) => {
      setTimeout(() => resolve(mockMeasurementOptions), 400);
    });
  },
  
  getPickupSlots: () => {
    return new Promise<PickupSlot[]>((resolve) => {
      setTimeout(() => resolve(mockPickupSlots), 800);
    });
  }
};
