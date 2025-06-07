import { apiRequest, USE_MOCK_API } from './index';

// Types for Order Management APIs
export interface OrderCreationRequest {
  userId: string;
  boutiqueId: string;
  serviceId: string;
  designType: 'predesigned' | 'custom';
  styleId?: string;
  customizations?: Record<string, string>;
  clothOption: 'boutique' | 'own';
  materialId?: string;
  materialColor?: string;
  materialQuantity?: number;
  measurementOption: 'manual' | 'homeService' | 'oldGarment';
  deliveryAddressId: string;
}

export interface OrderResponse {
  id: string;
  userId: string;
  createdAt: string;
  status: string;
  boutiqueDetails: {
    id: string;
    name: string;
  };
  serviceDetails: {
    id: string;
    name: string;
  };
  designDetails: {
    type: 'predesigned' | 'custom';
    styleId?: string;
    styleName?: string;
    customizations?: Record<string, {
      id: string;
      name: string;
      price: number;
    }>;
  };
  materialDetails: {
    option: 'boutique' | 'own';
    material?: {
      id: string;
      name: string;
      color: string;
      price: number;
      quantity: number;
    };
  };
  measurementOption: string;
  measurementStatus: string;
  deliveryAddressId: string;
  pricing: {
    basePrice: number;
    customizationCost: number;
    materialCost: number;
    deliveryCharge: number;
    tax: number;
    totalAmount: number;
  };
  nextSteps: {
    step: string;
    url: string;
    required: boolean;
  }[];
}

export interface PaymentRequest {
  paymentMethod: 'card' | 'upi' | 'wallet' | 'cod';
  paymentDetails: {
    cardToken?: string;
    saveCard?: boolean;
    upiId?: string;
    walletProvider?: string;
  };
  amount: number;
  currency: string;
}

export interface PaymentResponse {
  id: string;
  orderId: string;
  status: 'success' | 'failed' | 'pending';
  amount: number;
  currency: string;
  paymentMethod: string;
  transactionId: string;
  receipt: string;
  createdAt: string;
  orderStatus: string;
  estimatedDelivery: {
    start: string;
    end: string;
  };
}

export interface OrderListResponse {
  orders: {
    id: string;
    createdAt: string;
    status: string;
    boutiqueDetails: {
      id: string;
      name: string;
    };
    serviceDetails: {
      id: string;
      name: string;
    };
    designDetails: {
      type: string;
      styleName?: string;
    };
    totalAmount: number;
    estimatedDelivery: {
      start: string;
      end: string;
    };
  }[];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  };
}

// Mock data for development
const mockOrderResponse: OrderResponse = {
  id: "order123",
  userId: "user123",
  createdAt: "2025-05-07T15:30:00Z",
  status: "created",
  boutiqueDetails: {
    id: "boutique123",
    name: "Elite Tailors"
  },
  serviceDetails: {
    id: "service123",
    name: "Premium Shirt Tailoring"
  },
  designDetails: {
    type: "predesigned",
    styleId: "style123",
    styleName: "Classic Shirt",
    customizations: {
      "collar": {
        id: "collar2",
        name: "Button Down",
        price: 100
      },
      "sleeves": {
        id: "sleeve1",
        name: "Full Sleeves",
        price: 0
      },
      "buttons": {
        id: "button2",
        name: "Premium Buttons",
        price: 200
      }
    }
  },
  materialDetails: {
    option: "boutique",
    material: {
      id: "material123",
      name: "Premium Cotton Blend",
      color: "Navy Blue",
      price: 800,
      quantity: 3
    }
  },
  measurementOption: "manual",
  measurementStatus: "pending",
  deliveryAddressId: "address123",
  pricing: {
    basePrice: 1200,
    customizationCost: 300,
    materialCost: 2400,
    deliveryCharge: 100,
    tax: 300,
    totalAmount: 4300
  },
  nextSteps: [
    {
      step: "measurement",
      url: "/api/orders/order123/measurements",
      required: true
    },
    {
      step: "payment",
      url: "/api/orders/order123/payment",
      required: true
    }
  ]
};

const mockPaymentResponse: PaymentResponse = {
  id: "payment123",
  orderId: "order123",
  status: "success",
  amount: 4300,
  currency: "INR",
  paymentMethod: "card",
  transactionId: "txn_123456",
  receipt: "https://example.com/receipts/order123.pdf",
  createdAt: "2025-05-07T15:35:00Z",
  orderStatus: "confirmed",
  estimatedDelivery: {
    start: "2025-05-14",
    end: "2025-05-17"
  }
};

const mockOrderList: OrderListResponse = {
  orders: [
    {
      id: "order123",
      createdAt: "2025-05-07T15:30:00Z",
      status: "confirmed",
      boutiqueDetails: {
        id: "boutique123",
        name: "Elite Tailors"
      },
      serviceDetails: {
        id: "service123",
        name: "Premium Shirt Tailoring"
      },
      designDetails: {
        type: "predesigned",
        styleName: "Classic Shirt"
      },
      totalAmount: 4300,
      estimatedDelivery: {
        start: "2025-05-14",
        end: "2025-05-17"
      }
    },
    {
      id: "order456",
      createdAt: "2025-05-01T12:15:00Z",
      status: "delivered",
      boutiqueDetails: {
        id: "boutique456",
        name: "Fashion Tailors"
      },
      serviceDetails: {
        id: "service456",
        name: "Blouse Stitching"
      },
      designDetails: {
        type: "custom",
      },
      totalAmount: 3500,
      estimatedDelivery: {
        start: "2025-05-08",
        end: "2025-05-12"
      }
    }
  ],
  pagination: {
    totalItems: 2,
    totalPages: 1,
    currentPage: 1,
    itemsPerPage: 10
  }
};

// API functions
export const createOrder = async (data: OrderCreationRequest): Promise<OrderResponse> => {
  if (USE_MOCK_API) {
    return new Promise(resolve => {
      setTimeout(() => resolve(mockOrderResponse), 1000);
    });
  }
  
  return apiRequest<OrderResponse>('/api/orders', {
    method: 'POST',
    body: JSON.stringify(data)
  });
};

export const getOrderDetails = async (orderId: string): Promise<OrderResponse> => {
  if (USE_MOCK_API) {
    return new Promise(resolve => {
      setTimeout(() => resolve(mockOrderResponse), 500);
    });
  }
  
  return apiRequest<OrderResponse>(`/api/orders/${orderId}`);
};

export const processPayment = async (
  orderId: string,
  paymentData: PaymentRequest
): Promise<PaymentResponse> => {
  if (USE_MOCK_API) {
    return new Promise(resolve => {
      setTimeout(() => resolve(mockPaymentResponse), 1500);
    });
  }
  
  return apiRequest<PaymentResponse>(`/api/orders/${orderId}/payment`, {
    method: 'POST',
    body: JSON.stringify(paymentData)
  });
};

export const getUserOrders = async (
  userId: string,
  options?: {
    status?: 'created' | 'confirmed' | 'in_progress' | 'ready' | 'delivered' | 'cancelled';
    page?: number;
    limit?: number;
    sort?: 'date_desc' | 'date_asc';
  }
): Promise<OrderListResponse> => {
  if (USE_MOCK_API) {
    // Filter orders based on status if provided
    let filteredOrders = [...mockOrderList.orders];
    
    if (options?.status) {
      filteredOrders = filteredOrders.filter(order => order.status === options.status);
    }
    
    // Sort orders if needed
    if (options?.sort) {
      filteredOrders.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        
        return options.sort === 'date_asc' 
          ? dateA - dateB 
          : dateB - dateA;
      });
    }
    
    const response: OrderListResponse = {
      orders: filteredOrders,
      pagination: {
        totalItems: filteredOrders.length,
        totalPages: 1,
        currentPage: options?.page || 1,
        itemsPerPage: options?.limit || 10
      }
    };
    
    return new Promise(resolve => {
      setTimeout(() => resolve(response), 500);
    });
  }
  
  let endpoint = `/api/users/${userId}/orders`;
  
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
  
  return apiRequest<OrderListResponse>(endpoint);
};
