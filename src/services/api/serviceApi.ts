import { apiRequest, USE_MOCK_API } from './index';

// Types for Service API responses
export interface Service {
  id: string;
  name: string;
  description: string;
  designOptions: {
    hasPredesigned: boolean;
    hasCustom: boolean;
  };
  materialOptions: {
    sellsMaterial: boolean;
    acceptsCustomMaterial: boolean;
  };
  boutiqueSpecific?: {
    id: string;
    name: string;
    priceRange: string;
    rating: number;
    reviewCount: number;
    availableSlots: number;
    estimatedDeliveryDays: string;
    specialOffers: string[];
  };
}

export interface BoutiqueForService {
  id: string;
  name: string;
  description: string;
  image: string;
  location: string;
  rating: number;
  reviewCount: number;
  priceRange: string;
  availableSlots: number;
  estimatedDeliveryDays: string;
  specialOffers: string[];
}

export interface BoutiquesResponse {
  boutiques: BoutiqueForService[];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  };
}

// Mock data for development
const mockServices: Record<string, Service> = {
  "service123": {
    id: "service123",
    name: "Tailoring Service",
    description: "Custom tailoring of various garments",
    designOptions: {
      hasPredesigned: true,
      hasCustom: true
    },
    materialOptions: {
      sellsMaterial: true,
      acceptsCustomMaterial: true
    }
  },
  "service456": {
    id: "service456",
    name: "Blouse Stitching",
    description: "Custom blouse stitching with perfect fit",
    designOptions: {
      hasPredesigned: true,
      hasCustom: true
    },
    materialOptions: {
      sellsMaterial: true,
      acceptsCustomMaterial: true
    }
  },
  "service789": {
    id: "service789",
    name: "Embroidery",
    description: "Custom embroidery designs for your garments",
    designOptions: {
      hasPredesigned: true,
      hasCustom: false
    },
    materialOptions: {
      sellsMaterial: false,
      acceptsCustomMaterial: true
    }
  }
};

const mockBoutiques: BoutiqueForService[] = [
  {
    id: "boutique123",
    name: "Elite Tailors",
    description: "Luxury tailoring services for all your needs",
    image: "url-to-image",
    location: "MG Road, Bangalore",
    rating: 4.8,
    reviewCount: 120,
    priceRange: "₹1500 - ₹5000",
    availableSlots: 5,
    estimatedDeliveryDays: "7-10",
    specialOffers: ["10% off on first order", "Free delivery on orders above ₹3000"]
  },
  {
    id: "boutique456",
    name: "Fashion Tailors",
    description: "Affordable tailoring with quality craftsmanship",
    image: "url-to-image",
    location: "Jayanagar, Bangalore",
    rating: 4.5,
    reviewCount: 85,
    priceRange: "₹1000 - ₹3500",
    availableSlots: 8,
    estimatedDeliveryDays: "10-14",
    specialOffers: ["Free alterations for 3 months"]
  }
];

// API functions
export const getServiceDetails = async (serviceId: string, boutiqueId?: string): Promise<Service> => {
  if (USE_MOCK_API) {
    // Mock implementation
    const serviceData = { ...mockServices[serviceId] };
    
    // If boutiqueId is provided, add boutique-specific details
    if (boutiqueId) {
      const boutique = mockBoutiques.find(b => b.id === boutiqueId);
      if (boutique) {
        serviceData.boutiqueSpecific = {
          id: boutique.id,
          name: boutique.name,
          priceRange: boutique.priceRange,
          rating: boutique.rating,
          reviewCount: boutique.reviewCount,
          availableSlots: boutique.availableSlots,
          estimatedDeliveryDays: boutique.estimatedDeliveryDays,
          specialOffers: boutique.specialOffers
        };
      }
    }
    
    return new Promise(resolve => {
      setTimeout(() => resolve(serviceData), 500);
    });
  }
  
  // Real API implementation
  const endpoint = boutiqueId 
    ? `/api/services/${serviceId}?boutiqueId=${boutiqueId}`
    : `/api/services/${serviceId}`;
    
  return apiRequest<Service>(endpoint);
};

export const getBoutiquesForService = async (
  serviceId: string, 
  options?: {
    location?: string;
    rating?: number;
    priceMin?: number;
    priceMax?: number;
    sort?: 'rating' | 'price_asc' | 'price_desc' | 'popularity';
    page?: number;
    limit?: number;
  }
): Promise<BoutiquesResponse> => {
  if (USE_MOCK_API) {
    // Mock implementation
    const response: BoutiquesResponse = {
      boutiques: mockBoutiques,
      pagination: {
        totalItems: mockBoutiques.length,
        totalPages: 1,
        currentPage: 1,
        itemsPerPage: 10
      }
    };
    
    return new Promise(resolve => {
      setTimeout(() => resolve(response), 500);
    });
  }
  
  // Real API implementation
  let endpoint = `/api/services/${serviceId}/boutiques`;
  
  if (options) {
    const queryParams = new URLSearchParams();
    
    if (options.location) queryParams.append('location', options.location);
    if (options.rating) queryParams.append('rating', options.rating.toString());
    if (options.priceMin) queryParams.append('priceMin', options.priceMin.toString());
    if (options.priceMax) queryParams.append('priceMax', options.priceMax.toString());
    if (options.sort) queryParams.append('sort', options.sort);
    if (options.page) queryParams.append('page', options.page.toString());
    if (options.limit) queryParams.append('limit', options.limit.toString());
    
    const queryString = queryParams.toString();
    if (queryString) {
      endpoint += `?${queryString}`;
    }
  }
  
  return apiRequest<BoutiquesResponse>(endpoint);
};
