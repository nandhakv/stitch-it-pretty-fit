// API client for Stitch-it-Pretty-Fit
// This file provides real API implementations for all the endpoints from FLOW-Api.md

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

// Types for Design API responses
export interface PredesignedStyle {
  id: string;
  name: string;
  description: string;
  serviceId?: string;
  boutiqueId?: string;
  price: number;
  discount?: number;
  estimatedDays?: number;
  isCustomizable?: boolean;
  attributes?: string; // JSON string of attributes
  materials?: string; // JSON string of materials
  popularity?: number;
  isActive?: boolean;
  createdAt?: any;
  updatedAt?: any;
  imageUrls: string | string[];
  // These are compatibility fields we'll add for our app's internal use
  thumbnail?: string;
  category?: string;
  customizationCategories?: string[];
  // For backward compatibility with existing code
  presetSpecifications?: {
    collarStyle?: string;
    cuffStyle?: string;
    embroidery?: string;
    fabric?: string;
    color?: string;
    [key: string]: any;
  };
}

export interface StylesResponse {
  success: boolean;
  message: string;
  data: {
    styles: PredesignedStyle[];
    totalCount: number;
    pagination: {
      page: number;
      limit: number;
      totalPages: number;
    };
    filterOptions: any;
  };
}

export interface StyleDetailResponse {
  id: string;
  name: string;
  description: string;
  imageUrls: string[] | string;
  thumbnail?: string;
  price: number;
  basePrice: number;
  category: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  availability: boolean;
  estimatedDeliveryDays: number;
  customizationOptions?: Array<{
    name: string;
    id: string;
    options: string[] | Array<{name: string; isDefault?: boolean}>;
    defaultValue?: string;
  }>;
  relatedStyles: string[];
  reviews?: any[];
  fabricOptions: string[];
  isPredesigned?: boolean;
  features?: string[];
  presetSpecifications?: Record<string, any>;
}

export interface CustomizationCategory {
  id: string;
  name: string;
  description: string;
  required: boolean;
  options: CustomizationOption[];
}

export interface CustomizationOption {
  id: string;
  name: string;
  image: string;
  price: number;
  isDefault: boolean;
}

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

export interface CustomizationStep {
  id: string;
  name: string;
  order: number;
  required: boolean;
  description?: string;
  conditionalOn?: {
    field: string;
    value: string;
  };
}

export interface MeasurementField {
  id: string;
  name: string;
  description: string;
  unit: string;
  required: boolean;
  guideImage: string;
  videoGuide: string;
  defaultValue: number | null;
  minValue: number;
  maxValue: number;
}

export interface MeasurementTemplate {
  id: string;
  name: string;
  description: string;
  fields: MeasurementField[];
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

import { getApiBaseUrl } from '../utils/environment';

// Base API configuration - use environment settings or fallback to localhost
const getBaseUrl = (): string => {
  // For the predesigned-styles page, we need to use the correct localhost URL
  return 'http://localhost:3001/api';
};

// Common headers for all API requests
const getHeaders = () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  
  // Add authentication token if available
  const token = localStorage.getItem('auth_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// Generic API request function with improved error handling
const apiRequest = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const baseUrl = getBaseUrl();
  
  try {
    console.log(`API Request: ${baseUrl}${endpoint}`);
    const response = await fetch(`${baseUrl}${endpoint}`, {
      ...options,
      headers: {
        ...getHeaders(),
        ...options.headers,
      },
    });

    if (!response.ok) {
      let errorMessage: string;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || `API request failed with status ${response.status}`;
      } catch (jsonError) {
        // If JSON parsing fails, use status text
        errorMessage = `API request failed: ${response.statusText} (${response.status})`;
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Request Error for ${endpoint}:`, error);
    throw error;
  }
};

// API functions
import { mockPredesignedStyles, mockMaterials } from './mockData';

export const getPredesignedStyles = async (
  serviceId: string,
  options?: {
    boutiqueId?: string;
    category?: string;
    priceMin?: number;
    priceMax?: number;
    sort?: string;
    page?: number;
    limit?: number;
    search?: string;
  }
): Promise<StylesResponse> => {
  // Format endpoint according to the provided curl example
  // http://localhost:3001/api/boutiques/boutique002/services/service003/predesigned-styles
  let endpoint;
  if (options?.boutiqueId) {
    endpoint = `/boutiques/${options.boutiqueId}/services/${serviceId}/predesigned-styles`;
  } else {
    endpoint = `/services/${serviceId}/predesigned-styles`;
  }
  
  const queryParams = new URLSearchParams();
  
  // Add query parameters
  if (options) {
    if (options.category) queryParams.append('category', options.category);
    if (options.priceMin) queryParams.append('priceMin', options.priceMin.toString());
    if (options.priceMax) queryParams.append('priceMax', options.priceMax.toString());
    if (options.sort) queryParams.append('sort', options.sort);
    if (options.page) queryParams.append('page', options.page.toString() || '1');
    if (options.limit) queryParams.append('limit', options.limit.toString() || '20');
    if (options.search) queryParams.append('search', options.search);
  } else {
    // Default pagination params
    queryParams.append('page', '1');
    queryParams.append('limit', '20');
  }
  
  const queryString = queryParams.toString();
  if (queryString) {
    endpoint += `?${queryString}`;
  }
  
  // No try/catch here - let the error bubble up
  return apiRequest<StylesResponse>(endpoint);
};

export const getStyleDetails = async (styleId: string): Promise<StyleDetailResponse> => {
  const response = await apiRequest<StyleDetailResponse>(`/predesigned-styles/${styleId}`);
  
  // Ensure imageUrls is always treated as an array
  if (response.imageUrls && !Array.isArray(response.imageUrls)) {
    response.imageUrls = [response.imageUrls];
  }
  
  return response;
};

export const getStyleCustomizationOptions = async (styleId: string): Promise<CustomizationCategory[]> => {
  return apiRequest<CustomizationCategory[]>(`/styles/${styleId}/customization-options`);
};

export const uploadCustomDesign = async (
  serviceId: string,
  data: {
    designType: "sketch" | "reference" | "pattern";
    file: File;
    description: string;
    preferredStyle?: string;
    additionalNotes?: string;
  }
): Promise<any> => {
  const formData = new FormData();
  formData.append('designType', data.designType);
  formData.append('file', data.file);
  formData.append('description', data.description);
  
  if (data.preferredStyle) {
    formData.append('preferredStyle', data.preferredStyle);
  }
  
  if (data.additionalNotes) {
    formData.append('additionalNotes', data.additionalNotes);
  }
  
  return apiRequest(`/services/${serviceId}/custom-uploads`, {
    method: 'POST',
    body: formData,
    headers: {} // Let fetch set content-type with boundary for multipart/form-data
  });
};

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
  // Format endpoint according to the provided curl example pattern
  let endpoint;
  if (options?.boutiqueId) {
    endpoint = `/boutiques/${options.boutiqueId}/services/${serviceId}/materials`;
  } else {
    endpoint = `/services/${serviceId}/materials`;
  }
  
  const queryParams = new URLSearchParams();
  
  // Add query parameters
  if (options) {
    if (options.type) queryParams.append('type', options.type);
    if (options.priceMin) queryParams.append('priceMin', options.priceMin.toString());
    if (options.priceMax) queryParams.append('priceMax', options.priceMax.toString());
    if (options.color) queryParams.append('color', options.color);
    if (options.sort) queryParams.append('sort', options.sort);
    if (options.page) queryParams.append('page', options.page.toString() || '1');
    if (options.limit) queryParams.append('limit', options.limit.toString() || '20');
  } else {
    // Default pagination params
    queryParams.append('page', '1');
    queryParams.append('limit', '20');
  }
  
  const queryString = queryParams.toString();
  if (queryString) {
    endpoint += `?${queryString}`;
  }
  
  // No try/catch here - let the error bubble up
  return apiRequest<MaterialsResponse>(endpoint);
};

export const getMaterialDetails = async (materialId: string): Promise<MaterialDetailResponse> => {
  return apiRequest<MaterialDetailResponse>(`/materials/${materialId}`);
};

// Service API functions
export const getServiceDetails = async (serviceId: string, boutiqueId?: string): Promise<Service> => {
  let endpoint = `/services/${serviceId}`;
  
  if (boutiqueId) {
    endpoint += `?boutiqueId=${boutiqueId}`;
  }
  
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
  let endpoint = `/services/${serviceId}/boutiques`;
  
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

// Measurement API functions
export const getCustomizationFlow = async (serviceId: string): Promise<CustomizationStep[]> => {
  return apiRequest<CustomizationStep[]>(`/services/${serviceId}/customization-flow`);
};

export const getMeasurementTemplates = async (serviceId: string): Promise<MeasurementTemplate[]> => {
  return apiRequest<MeasurementTemplate[]>(`/services/${serviceId}/measurement-templates`);
};

export const submitMeasurements = async (orderId: string, data: any): Promise<any> => {
  return apiRequest(`/orders/${orderId}/measurements`, {
    method: 'POST',
    body: JSON.stringify(data)
  });
};

// Order API functions
export const createOrder = async (data: any): Promise<any> => {
  return apiRequest('/orders', {
    method: 'POST',
    body: JSON.stringify(data)
  });
};

export const getOrderDetails = async (orderId: string): Promise<any> => {
  return apiRequest(`/orders/${orderId}`);
};

export const processPayment = async (orderId: string, paymentData: any): Promise<any> => {
  return apiRequest(`/orders/${orderId}/payment`, {
    method: 'POST',
    body: JSON.stringify(paymentData)
  });
};

export const getUserOrders = async (userId: string, options?: any): Promise<any> => {
  let endpoint = `/users/${userId}/orders`;
  
  if (options) {
    const queryParams = new URLSearchParams();
    
    if (options.status) queryParams.append('status', options.status);
    if (options.page) queryParams.append('page', options.page.toString());
    if (options.limit) queryParams.append('limit', options.limit.toString());
    if (options.sort) queryParams.append('sort', options.sort);
    
    const queryString = queryParams.toString();
    if (queryString) {
      endpoint += `?${queryString}`;
    }
  }
  
  return apiRequest(endpoint);
};
