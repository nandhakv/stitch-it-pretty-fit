import { apiRequest, USE_MOCK_API } from './index';

// Types for Material API responses
export interface MaterialColor {
  name: string;
  code: string;
  image: string;
  inStock: boolean;
  restockDate?: string;
}

export interface MaterialProperties {
  weight: string;
  stretch: string;
  opacity: string;
  care: string[];
  composition: string;
  seasonality?: string[];
  texture?: string;
  breathability?: string;
}

export interface Material {
  id: string;
  name: string;
  description: string;
  images: string[];
  thumbnail: string;
  price: number;
  pricePerUnit: string;
  type: string;
  colors: MaterialColor[];
  availableQuantity: number;
  minimumOrder: number;
  properties: MaterialProperties;
  rating: number;
  reviewCount: number;
  boutique?: {
    id: string;
    name: string;
    location: string;
    rating: number;
  };
}

export interface MaterialsResponse {
  sellsMaterial: boolean;
  acceptsCustomMaterial: boolean;
  materials: Material[];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  };
  filters: {
    materialTypes: string[];
    priceRange: {
      min: number;
      max: number;
    };
    colors: string[];
  };
}

export interface MaterialDetailResponse {
  id: string;
  name: string;
  description: string;
  images: string[];
  price: number;
  basePrice: number;
  pricePerUnit: string;
  type: string;
  subtype: string;
  colors: MaterialColor[];
  availableQuantity: number;
  minimumOrder: number;
  maximumOrder: number;
  dimensions: {
    width: string;
  };
  properties: MaterialProperties;
  rating: number;
  reviewCount: number;
  recommendedFor: string[];
  relatedMaterials: string[];
}

// Mock data for development
const mockMaterials: Material[] = [
  {
    id: "material123",
    name: "Premium Cotton Blend",
    description: "Smooth cotton blend fabric with superior comfort and durability",
    images: ["url1", "url2"],
    thumbnail: "thumbnail-url",
    price: 800,
    pricePerUnit: "per meter",
    type: "Cotton",
    colors: [
      {
        name: "Navy Blue",
        code: "#000080",
        image: "blue-fabric-url",
        inStock: true
      },
      {
        name: "Pure White",
        code: "#FFFFFF",
        image: "white-fabric-url",
        inStock: true
      },
      {
        name: "Charcoal Black",
        code: "#36454F",
        image: "black-fabric-url",
        inStock: false,
        restockDate: "2025-06-01"
      }
    ],
    availableQuantity: 50,
    minimumOrder: 1,
    properties: {
      weight: "Medium",
      stretch: "Minimal",
      opacity: "High",
      care: ["Machine wash cold", "Tumble dry low"],
      composition: "80% Cotton, 20% Polyester"
    },
    rating: 4.7,
    reviewCount: 86,
    boutique: {
      id: "boutique123",
      name: "Elite Tailors",
      location: "MG Road, Bangalore",
      rating: 4.8
    }
  },
  {
    id: "material456",
    name: "Premium Cotton Blend",
    description: "Smooth cotton blend fabric with superior comfort and durability",
    images: ["url1", "url2"],
    thumbnail: "thumbnail-url",
    price: 750,
    pricePerUnit: "per meter",
    type: "Cotton",
    colors: [
      {
        name: "Navy Blue",
        code: "#000080",
        image: "blue-fabric-url",
        inStock: true
      },
      {
        name: "Pure White",
        code: "#FFFFFF",
        image: "white-fabric-url",
        inStock: true
      }
    ],
    availableQuantity: 30,
    minimumOrder: 2,
    properties: {
      weight: "Medium",
      stretch: "Minimal",
      opacity: "High",
      care: ["Machine wash cold", "Tumble dry low"],
      composition: "80% Cotton, 20% Polyester"
    },
    rating: 4.5,
    reviewCount: 65,
    boutique: {
      id: "boutique456",
      name: "Fashion Tailors",
      location: "Jayanagar, Bangalore",
      rating: 4.5
    }
  },
  {
    id: "material789",
    name: "Pure Silk",
    description: "Luxurious pure silk fabric for premium garments",
    images: ["url1", "url2"],
    thumbnail: "thumbnail-url",
    price: 2500,
    pricePerUnit: "per meter",
    type: "Silk",
    colors: [
      {
        name: "Royal Blue",
        code: "#4169E1",
        image: "blue-silk-url",
        inStock: true
      },
      {
        name: "Crimson Red",
        code: "#DC143C",
        image: "red-silk-url",
        inStock: true
      }
    ],
    availableQuantity: 15,
    minimumOrder: 1,
    properties: {
      weight: "Light",
      stretch: "Minimal",
      opacity: "Medium",
      care: ["Dry clean only"],
      composition: "100% Silk"
    },
    rating: 4.9,
    reviewCount: 45,
    boutique: {
      id: "boutique123",
      name: "Elite Tailors",
      location: "MG Road, Bangalore",
      rating: 4.8
    }
  }
];

const mockMaterialDetail: MaterialDetailResponse = {
  id: "material123",
  name: "Premium Cotton Blend",
  description: "Smooth cotton blend fabric with superior comfort and durability. Perfect for shirts, dresses, and lightweight outerwear. This premium blend offers the breathability of cotton with added durability from polyester.",
  images: ["url1", "url2", "url3", "url4"],
  price: 800,
  basePrice: 800,
  pricePerUnit: "per meter",
  type: "Cotton",
  subtype: "Blend",
  colors: [
    {
      name: "Navy Blue",
      code: "#000080",
      image: "blue-fabric-url",
      inStock: true
    },
    {
      name: "Pure White",
      code: "#FFFFFF",
      image: "white-fabric-url",
      inStock: true
    },
    {
      name: "Charcoal Black",
      code: "#36454F",
      image: "black-fabric-url",
      inStock: false,
      restockDate: "2025-06-01"
    }
  ],
  availableQuantity: 50,
  minimumOrder: 1,
  maximumOrder: 20,
  dimensions: {
    width: "58 inches"
  },
  properties: {
    weight: "Medium",
    stretch: "Minimal",
    opacity: "High",
    care: ["Machine wash cold", "Tumble dry low"],
    composition: "80% Cotton, 20% Polyester",
    seasonality: ["Spring", "Summer", "Fall"],
    texture: "Smooth with slight texture",
    breathability: "High"
  },
  rating: 4.7,
  reviewCount: 86,
  recommendedFor: ["shirts", "dresses", "casual wear"],
  relatedMaterials: ["material456", "material789"]
};

// API functions
export const getMaterials = async (
  serviceId: string,
  options?: {
    boutiqueId?: string;
    type?: string;
    priceMin?: number;
    priceMax?: number;
    color?: string;
    sort?: string;
    page?: number;
    limit?: number;
  }
): Promise<MaterialsResponse> => {
  if (USE_MOCK_API) {
    // Filter materials based on provided options
    let filteredMaterials = [...mockMaterials];
    
    if (options?.boutiqueId) {
      filteredMaterials = filteredMaterials.filter(material => 
        material.boutique && material.boutique.id === options.boutiqueId
      );
    }
    
    if (options?.type) {
      filteredMaterials = filteredMaterials.filter(material => 
        material.type.toLowerCase() === options.type?.toLowerCase()
      );
    }
    
    if (options?.color) {
      filteredMaterials = filteredMaterials.filter(material => 
        material.colors.some(color => 
          color.name.toLowerCase().includes(options.color?.toLowerCase() || '')
        )
      );
    }
    
    // Apply price filters if needed
    if (options?.priceMin) {
      filteredMaterials = filteredMaterials.filter(material => 
        material.price >= (options.priceMin || 0)
      );
    }
    
    if (options?.priceMax) {
      filteredMaterials = filteredMaterials.filter(material => 
        material.price <= (options.priceMax || Infinity)
      );
    }
    
    const response: MaterialsResponse = {
      sellsMaterial: true,
      acceptsCustomMaterial: true,
      materials: filteredMaterials,
      pagination: {
        totalItems: filteredMaterials.length,
        totalPages: 1,
        currentPage: options?.page || 1,
        itemsPerPage: options?.limit || 20
      },
      filters: {
        materialTypes: ["Cotton", "Silk", "Wool", "Linen", "Polyester", "Blends"],
        priceRange: {
          min: 300,
          max: 2500
        },
        colors: ["Blue", "White", "Black", "Red", "Green", "Yellow"]
      }
    };
    
    return new Promise(resolve => {
      setTimeout(() => resolve(response), 500);
    });
  }
  
  // Real API implementation
  let endpoint = `/api/services/${serviceId}/materials`;
  
  if (options) {
    const queryParams = new URLSearchParams();
    
    if (options.boutiqueId) queryParams.append('boutiqueId', options.boutiqueId);
    if (options.type) queryParams.append('type', options.type);
    if (options.priceMin) queryParams.append('priceMin', options.priceMin.toString());
    if (options.priceMax) queryParams.append('priceMax', options.priceMax.toString());
    if (options.color) queryParams.append('color', options.color);
    if (options.sort) queryParams.append('sort', options.sort);
    if (options.page) queryParams.append('page', options.page.toString());
    if (options.limit) queryParams.append('limit', options.limit.toString());
    
    const queryString = queryParams.toString();
    if (queryString) {
      endpoint += `?${queryString}`;
    }
  }
  
  return apiRequest<MaterialsResponse>(endpoint);
};

export const getMaterialDetails = async (materialId: string): Promise<MaterialDetailResponse> => {
  if (USE_MOCK_API) {
    // Mock implementation
    return new Promise(resolve => {
      setTimeout(() => resolve(mockMaterialDetail), 500);
    });
  }
  
  // Real API implementation
  return apiRequest<MaterialDetailResponse>(`/api/materials/${materialId}`);
};
