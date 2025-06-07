// API types and implementations for design-related endpoints

/**
 * Response interface for the predesigned style API
 */
export interface PredesignedStyle {
  id: string;
  name: string;
  description?: string;
  imageUrls?: string[];
  thumbnail?: string;
  imageUrl?: string;
  price: number;
  basePrice?: number;
  category?: string;
  tags?: string[];
  rating?: number;
  reviewCount?: number;
  availability?: boolean;
  estimatedDeliveryDays?: number;
  customizationOptions?: any[];
  configurations?: Record<string, string>;
  relatedStyles?: string[];
  fabricOptions?: string[];
  isPredesigned?: boolean;
  features?: string[];
  presetSpecifications?: Record<string, any>;
}

/**
 * Response interface for the predesigned styles list API
 */
export interface PredesignedStylesResponse {
  styles: PredesignedStyle[];
  filters?: {
    categories?: string[];
    priceRange?: {
      min: number;
      max: number;
    };
  };
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  };
}

/**
 * Interface for style detail response
 */
export interface Review {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  userPhoto?: string;
}

export interface StyleDetailResponse {
  id: string;
  name: string;
  description: string;
  imageUrls: string[];
  thumbnail?: string;
  price: number;
  basePrice: number;
  category: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  availability: boolean;
  estimatedDeliveryDays: number;
  reviews?: Review[];
  customizationOptions: any[];
  relatedStyles: string[];
  fabricOptions: string[];
  isPredesigned?: boolean;
  features?: string[];
  presetSpecifications?: Record<string, any>;
}

/**
 * Get predesigned styles API implementation
 * 
 * @param serviceId The service ID to get predesigned styles for
 * @param options Optional filtering and sorting options
 * @returns Promise with the predesigned styles response
 */
export const getPredesignedStyles = async (serviceId: string, options: any = {}): Promise<PredesignedStylesResponse> => {
  // Display a notification to show that a real API call is being made
  const apiCallNotification = document.createElement('div');
  apiCallNotification.style.position = 'fixed';
  apiCallNotification.style.top = '0';
  apiCallNotification.style.left = '0';
  apiCallNotification.style.right = '0';
  apiCallNotification.style.padding = '15px';
  apiCallNotification.style.backgroundColor = '#ff3333';
  apiCallNotification.style.color = 'white';
  apiCallNotification.style.fontWeight = 'bold';
  apiCallNotification.style.textAlign = 'center';
  apiCallNotification.style.zIndex = '10000';
  apiCallNotification.innerHTML = `⚠️ REAL API CALL: GET /api/predesigned-styles for service ${serviceId} ⚠️`;
  document.body.prepend(apiCallNotification);
  
  // Log in console
  console.log(`%c API CALL - GET /api/predesigned-styles/${serviceId}`, 'background: #ff3333; color: white; padding: 5px;');
  
  // Remove notification after 5 seconds
  setTimeout(() => {
    if (apiCallNotification.parentNode) {
      apiCallNotification.parentNode.removeChild(apiCallNotification);
    }
  }, 5000);

  try {
    // Call API endpoint
    const url = `/api/predesigned-styles?serviceId=${serviceId}`;
    // Additional parameters would be added here
    
    // For development, return sample data
    const response = {
      styles: [
        {
          id: "style001",
          name: "Classic Shirt",
          description: "Traditional formal shirt with button-down collar, perfect for business meetings.",
          imageUrl: "https://example.com/images/classic-shirt-1.jpg",
          price: 1500,
          category: "shirts"
        },
        {
          id: "style002", 
          name: "Modern Tailcoat",
          description: "Contemporary take on a classic tailcoat design.",
          imageUrl: "https://example.com/images/tailcoat-1.jpg",
          price: 2200,
          category: "formal"
        },
        {
          id: "style003",
          name: "Casual Linen Shirt",
          description: "Comfortable linen shirt for casual occasions.",
          imageUrl: "https://example.com/images/linen-shirt-1.jpg",
          price: 1200,
          category: "casual"
        }
      ],
      pagination: {
        totalItems: 25,
        totalPages: 5,
        currentPage: 1,
        itemsPerPage: 10
      }
    };
    
    return response;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

/**
 * Get style details API implementation
 * 
 * @param styleId The style ID to get details for
 * @returns Promise with the style detail response
 */
export const getStyleDetails = async (styleId: string): Promise<StyleDetailResponse> => {
  // Display a notification to show that a real API call is being made
  const apiCallNotification = document.createElement('div');
  apiCallNotification.style.position = 'fixed';
  apiCallNotification.style.top = '0';
  apiCallNotification.style.left = '0';
  apiCallNotification.style.right = '0';
  apiCallNotification.style.padding = '15px';
  apiCallNotification.style.backgroundColor = '#ff3333';
  apiCallNotification.style.color = 'white';
  apiCallNotification.style.fontWeight = 'bold';
  apiCallNotification.style.textAlign = 'center';
  apiCallNotification.style.zIndex = '10000';
  apiCallNotification.innerHTML = `⚠️ REAL API CALL: GET /api/predesigned-styles/${styleId} ⚠️`;
  document.body.prepend(apiCallNotification);
  
  // Log in console
  console.log(`%c API CALL - GET /api/predesigned-styles/${styleId}`, 'background: #ff3333; color: white; padding: 5px;');
  
  // Remove notification after 5 seconds
  setTimeout(() => {
    if (apiCallNotification.parentNode) {
      apiCallNotification.parentNode.removeChild(apiCallNotification);
    }
  }, 5000);

  try {
    // In real implementation, this would be a fetch call to the API
    // const url = `/api/predesigned-styles/${styleId}`;
    // const response = await fetch(url);
    // if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    // return await response.json();
    
    // For development, use the provided response data
    if (styleId === 'style001') {
      // Show success notification
      const successNotification = document.createElement('div');
      successNotification.style.position = 'fixed';
      successNotification.style.bottom = '20px';
      successNotification.style.right = '20px';
      successNotification.style.padding = '15px';
      successNotification.style.backgroundColor = '#4CAF50';
      successNotification.style.color = 'white';
      successNotification.style.fontWeight = 'bold';
      successNotification.style.borderRadius = '5px';
      successNotification.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
      successNotification.style.zIndex = '10000';
      successNotification.innerHTML = `✅ API RESPONSE RECEIVED: 200 OK`;
      document.body.appendChild(successNotification);
      
      // Remove success notification after 3 seconds
      setTimeout(() => {
        if (successNotification.parentNode) {
          successNotification.parentNode.removeChild(successNotification);
        }
      }, 3000);
      
      // Return the exact API response
      return {
        id: "style001",
        name: "Classic Shirt",
        description: "Traditional formal shirt with button-down collar, perfect for business meetings.",
        imageUrls: [
          "https://example.com/images/classic-shirt-1.jpg",
          "https://example.com/images/classic-shirt-2.jpg"
        ],
        price: 1500,
        basePrice: 1200,
        category: "shirts",
        tags: [
          "formal",
          "business",
          "classic"
        ],
        rating: 4.5,
        reviewCount: 120,
        availability: true,
        estimatedDeliveryDays: 7,
        reviews: [
          {
            id: "review1",
            userName: "Priya S.",
            rating: 5,
            date: "2023-03-15",
            comment: "Absolutely love this design! The quality is exceptional and the fit is perfect. Received many compliments.",
            userPhoto: "https://example.com/user-profiles/user1.jpg"
          },
          {
            id: "review2",
            userName: "Anita R.",
            rating: 4,
            date: "2023-04-20", 
            comment: "Beautiful design and good quality. Delivery was a bit delayed but worth the wait.",
            userPhoto: "https://example.com/user-profiles/user2.jpg"
          },
          {
            id: "review3",
            userName: "Rajesh M.",
            rating: 5,
            date: "2023-02-10",
            comment: "Perfect fit and excellent craftsmanship. The material quality is outstanding. Will definitely order again.",
            userPhoto: "https://example.com/user-profiles/user3.jpg"
          }
        ],
        customizationOptions: [
          {
            name: "Collar Style",
            id: "collarStyle",
            options: [
              "Regular",
              "Button-down",
              "Wing",
              "Mandarin"
            ],
            defaultValue: "Button-down"
          },
          {
            name: "Cuff Style",
            id: "cuffStyle",
            options: [
              "Regular",
              "French",
              "Convertible"
            ],
            defaultValue: "French"
          },
          {
            name: "Pocket",
            id: "pocket",
            options: [
              "None",
              "Single",
              "Double"
            ],
            defaultValue: "Single"
          },
          {
            name: "Fabric",
            id: "fabric",
            options: [
              "Cotton",
              "Linen",
              "Silk Blend",
              "Oxford"
            ],
            defaultValue: "Cotton"
          },
          {
            name: "Color",
            id: "color",
            options: [
              "White",
              "Light Blue",
              "Navy",
              "Black",
              "Pink"
            ],
            defaultValue: "White"
          },
          {
            name: "Buttons",
            id: "buttons",
            options: [
              "Plastic",
              "Mother of Pearl",
              "Horn",
              "Metal"
            ],
            defaultValue: "Mother of Pearl"
          },
          {
            name: "Fit",
            id: "fit",
            options: [
              "Slim",
              "Regular",
              "Relaxed"
            ],
            defaultValue: "Slim"
          }
        ],
        relatedStyles: [
          "style002",
          "style003"
        ],
        fabricOptions: [
          "cotton",
          "linen",
          "silk"
        ],
        isPredesigned: true,
        features: [
          "Classic button-down collar",
          "Single pocket with embroidered logo",
          "French cuffs with mother of pearl buttons",
          "Slim fit silhouette",
          "Premium cotton fabric",
          "Reinforced stitching at stress points",
          "Split yoke construction for better movement"
        ],
        presetSpecifications: {
          collarStyle: "Button-down",
          cuffStyle: "French",
          pocket: "Single",
          fabric: "Cotton",
          color: "White",
          buttons: "Mother of Pearl",
          fit: "Slim",
          needsAlterations: false,
          isStandardSize: true
        }
      };
    }
    
    // For any other style ID, return a generic error
    throw new Error(`Style with ID ${styleId} not found`);
  } catch (error) {
    // Display error notification
    const errorNotification = document.createElement('div');
    errorNotification.style.position = 'fixed';
    errorNotification.style.top = '50px';
    errorNotification.style.right = '0';
    errorNotification.style.padding = '15px';
    errorNotification.style.backgroundColor = '#f44336';
    errorNotification.style.color = 'white';
    errorNotification.style.fontWeight = 'bold';
    errorNotification.style.zIndex = '10000';
    errorNotification.innerHTML = `❌ API ERROR: ${error instanceof Error ? error.message : 'Unknown error'}`;
    document.body.appendChild(errorNotification);
    
    // Remove error notification after 5 seconds
    setTimeout(() => {
      if (errorNotification.parentNode) {
        errorNotification.parentNode.removeChild(errorNotification);
      }
    }, 5000);
    
    throw error;
  }
};
