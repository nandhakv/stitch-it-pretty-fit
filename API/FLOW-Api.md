# Stitch-it-Pretty-Fit API Documentation

## Introduction

This document outlines the API structure needed to support dynamic service-based workflows in the Stitch-it-Pretty-Fit application. The APIs are designed to accommodate two primary user flow patterns:

1. **Boutique-First Flow**: Users navigate from home page to boutique details, then to service selection
   - Specific boutique and service combination must be supported
   - When two boutiques offer the same service, they must show their specific pricing and options

2. **Service-First Flow**: Users navigate directly from home page to services
   - Users can view all boutiques offering a particular service
   - Users can compare options across multiple boutiques

For consistency, certain elements like customization flows and measurement templates remain standardized by service type across all boutiques, while price, material availability, and other boutique-specific details can vary.

## Table of Contents

### API Endpoints
1. [Service APIs](#service-apis)
   - [Service Details API](#service-details-api)
   - [Boutiques Offering Service API](#boutiques-offering-service-api)
2. [Design APIs](#design-apis)
   - [Pre-designed Styles List API](#pre-designed-styles-list-api)
   - [Pre-designed Style Details API](#pre-designed-style-details-api)
   - [Style Customization Options API](#specific-style-customization-options-api)
   - [Custom Design Upload API](#custom-design-upload-api)
3. [Materials APIs](#materials-apis)
   - [Materials API for Service](#materials-api-for-service)
   - [Material Details API](#material-details-api)
4. [Measurements APIs](#measurements-apis)
   - [Customization Flow API](#customization-flow-api)
   - [Measurement Templates API](#measurement-templates-api)
   - [Measurement Submission API](#measurement-submission-api)
5. [Order Management APIs](#order-management-apis)
   - [Order Creation API](#order-creation-api)
   - [Order Details API](#order-details-api)
   - [Order Payment API](#order-payment-api)
   - [Order List API](#order-list-api)

### Implementation Guidelines
6. [Implementation Strategy](#implementation-strategy)
7. [Example Flow Implementation](#example-flow-implementation)
8. [Order Context Updates](#order-context-updates)
9. [Routing Structure](#routing-structure)
10. [Data Validation and Error Handling](#data-validation-and-error-handling)
11. [Backend Implementation Guide](#backend-implementation-guide)
12. [Next Steps](#next-steps)

# API Endpoints

## Service APIs

### Service Details API
```
GET /api/services/{serviceId}
```

**Query Parameters:**
- `boutiqueId` (string, optional): ID of specific boutique offering the service

**Response:**
```json
{
  "id": "service123",
  "name": "Tailoring Service",
  "description": "Custom tailoring of various garments",
  "designOptions": {
    "hasPredesigned": true,
    "hasCustom": true
  },
  "materialOptions": {
    "sellsMaterial": true,
    "acceptsCustomMaterial": true
  },
  "boutiqueSpecific": {
    "id": "boutique123",
    "name": "Elite Tailors",
    "priceRange": "₹1500 - ₹5000",
    "rating": 4.8,
    "reviewCount": 120,
    "availableSlots": 5,
    "estimatedDeliveryDays": "7-10",
    "specialOffers": ["10% off on first order", "Free delivery on orders above ₹3000"]
  }
}
```

**Note:** When `boutiqueId` is provided, the response includes boutique-specific details for that service. When not provided, the `boutiqueSpecific` field is omitted.

### Boutiques Offering Service API
```
GET /api/services/{serviceId}/boutiques
```

**Query Parameters:**
- `location` (string, optional): Filter by location
- `rating` (number, optional): Minimum rating filter
- `priceMin` (number, optional): Minimum price filter
- `priceMax` (number, optional): Maximum price filter
- `sort` (string, optional): Sort order ("rating", "price_asc", "price_desc", "popularity")
- `page` (number, optional): Page number for pagination (default: 1)
- `limit` (number, optional): Results per page (default: 10)

**Response:**
```json
{
  "boutiques": [
    {
      "id": "boutique123",
      "name": "Elite Tailors",
      "description": "Luxury tailoring services for all your needs",
      "image": "url-to-image",
      "location": "MG Road, Bangalore",
      "rating": 4.8,
      "reviewCount": 120,
      "priceRange": "₹1500 - ₹5000",
      "availableSlots": 5,
      "estimatedDeliveryDays": "7-10",
      "specialOffers": ["10% off on first order", "Free delivery on orders above ₹3000"]
    },
    {
      "id": "boutique456",
      "name": "Fashion Tailors",
      "description": "Affordable tailoring with quality craftsmanship",
      "image": "url-to-image",
      "location": "Jayanagar, Bangalore",
      "rating": 4.5,
      "reviewCount": 85,
      "priceRange": "₹1000 - ₹3500",
      "availableSlots": 8,
      "estimatedDeliveryDays": "10-14",
      "specialOffers": ["Free alterations for 3 months"]
    }
    // More boutiques
  ],
  "pagination": {
    "totalItems": 15,
    "totalPages": 2,
    "currentPage": 1,
    "itemsPerPage": 10
  }
}
```



## Design APIs

### Pre-designed Styles List API
```
GET /api/services/{serviceId}/predesigned-styles
```

**Query Parameters:**
- `boutiqueId` (string, optional): Filter by specific boutique
- `category` (string, optional): Filter by category (e.g., "shirts", "pants", "dresses")
- `priceMin` (number, optional): Minimum price filter
- `priceMax` (number, optional): Maximum price filter
- `sort` (string, optional): Sort order ("price_asc", "price_desc", "popularity", "newest")
- `page` (number, optional): Page number for pagination (default: 1)
- `limit` (number, optional): Results per page (default: 20)
- `search` (string, optional): Search term to filter by name or description

**Response:**
```json
{
  "styles": [
    {
      "id": "style123",
      "name": "Classic Shirt",
      "description": "Traditional formal shirt with button-down collar",
      "imageUrls": ["url1", "url2"],
      "thumbnail": "thumbnail-url",
      "price": 1500,
      "category": "shirts",
      "tags": ["formal", "classic", "business"],
      "rating": 4.5,
      "reviewCount": 120,
      "customizationCategories": ["collar", "sleeves", "buttons"],
      "hasCustomizations": true,
      "boutique": {
        "id": "boutique123",
        "name": "Elite Tailors",
        "location": "MG Road, Bangalore",
        "rating": 4.8,
        "priceVariation": "+₹0"
      }
    },
    {
      "id": "style123",
      "name": "Classic Shirt",
      "description": "Traditional formal shirt with button-down collar",
      "imageUrls": ["url1", "url2"],
      "thumbnail": "thumbnail-url",
      "price": 1700,
      "category": "shirts",
      "tags": ["formal", "classic", "business"],
      "rating": 4.5,
      "reviewCount": 78,
      "customizationCategories": ["collar", "sleeves", "buttons"],
      "hasCustomizations": true,
      "boutique": {
        "id": "boutique456",
        "name": "Fashion Tailors",
        "location": "Jayanagar, Bangalore",
        "rating": 4.5,
        "priceVariation": "+₹200"
      }
    }
    // More styles
  ],
  "pagination": {
    "totalItems": 150,
    "totalPages": 8,
    "currentPage": 1,
    "itemsPerPage": 20
  },
  "filters": {
    "categories": ["shirts", "pants", "dresses"],
    "priceRange": {
      "min": 800,
      "max": 5000
    },
    "boutiques": ["boutique123", "boutique456", "boutique789"]
  }
}
```

### Pre-designed Style Details API
```
GET /api/predesigned-styles/{styleId}
```

**Response:**
```json
{
  "id": "style123",
  "name": "Classic Shirt",
  "description": "Traditional formal shirt with button-down collar, perfect for business meetings and formal events. Made with premium cotton fabric for comfort and durability.",
  "imageUrls": ["url1", "url2", "url3", "url4"],
  "price": 1500,
  "basePrice": 1200,
  "category": "shirts",
  "tags": ["formal", "classic", "business"],
  "rating": 4.5,
  "reviewCount": 120,
  "availability": true,
  "estimatedDeliveryDays": 7,
  "customizationOptions": [
    {
      "id": "collar",
      "name": "Collar Style",
      "description": "Choose your preferred collar style",
      "required": true,
      "options": [
        {
          "id": "collar1",
          "name": "Regular Collar",
          "image": "url",
          "price": 0,
          "isDefault": true
        },
        {
          "id": "collar2",
          "name": "Button Down",
          "image": "url",
          "price": 100,
          "isDefault": false
        },
        {
          "id": "collar3",
          "name": "Spread Collar",
          "image": "url",
          "price": 150,
          "isDefault": false
        }
      ]
    },
    {
      "id": "sleeves",
      "name": "Sleeve Style",
      "description": "Select your preferred sleeve style",
      "required": true,
      "options": [
        {
          "id": "sleeve1",
          "name": "Full Sleeves",
          "image": "url",
          "price": 0,
          "isDefault": true
        },
        {
          "id": "sleeve2",
          "name": "Half Sleeves",
          "image": "url",
          "price": 0,
          "isDefault": false
        }
      ]
    },
    {
      "id": "buttons",
      "name": "Button Style",
      "description": "Choose your button style",
      "required": false,
      "options": [
        {
          "id": "button1",
          "name": "Standard Buttons",
          "image": "url",
          "price": 0,
          "isDefault": true
        },
        {
          "id": "button2",
          "name": "Premium Buttons",
          "image": "url",
          "price": 200,
          "isDefault": false
        }
      ]
    }
  ],
  "relatedStyles": ["style456", "style789"],
  "fabricOptions": ["cotton", "linen", "silk"]
}
```

### Specific Style Customization Options API
```
GET /api/styles/{styleId}/customization-options
```

**Response:**
```json
{
  "customizationOptions": [
    {
      "id": "collar",
      "name": "Collar Style",
      "description": "Choose your preferred collar style",
      "options": [
        {
          "id": "collar1",
          "name": "Regular Collar",
          "image": "url",
          "price": 0
        },
        {
          "id": "collar2",
          "name": "Button Down",
          "image": "url",
          "price": 100
        }
        // More options
      ]
    }
    // More customization categories
  ]
}
```

## Materials APIs

### Materials API for Service
```
GET /api/services/{serviceId}/materials
```

**Query Parameters:**
- `boutiqueId` (string, optional): Filter by specific boutique
- `type` (string, optional): Filter by material type (e.g., "cotton", "silk", "wool")
- `priceMin` (number, optional): Minimum price filter
- `priceMax` (number, optional): Maximum price filter
- `color` (string, optional): Filter by color availability
- `sort` (string, optional): Sort order ("price_asc", "price_desc", "popularity")
- `page` (number, optional): Page number for pagination (default: 1)
- `limit` (number, optional): Results per page (default: 20)

**Response:**
```json
{
  "sellsMaterial": true,
  "acceptsCustomMaterial": true,
  "materials": [
    {
      "id": "material123",
      "name": "Premium Cotton Blend",
      "description": "Smooth cotton blend fabric with superior comfort and durability",
      "images": ["url1", "url2"],
      "thumbnail": "thumbnail-url",
      "price": 800,
      "pricePerUnit": "per meter",
      "type": "Cotton",
      "colors": [
        {
          "name": "Navy Blue",
          "code": "#000080",
          "image": "blue-fabric-url",
          "inStock": true
        },
        {
          "name": "Pure White",
          "code": "#FFFFFF",
          "image": "white-fabric-url",
          "inStock": true
        },
        {
          "name": "Charcoal Black",
          "code": "#36454F",
          "image": "black-fabric-url",
          "inStock": false,
          "restockDate": "2025-06-01"
        }
      ],
      "availableQuantity": 50,
      "minimumOrder": 1,
      "properties": {
        "weight": "Medium",
        "stretch": "Minimal",
        "opacity": "High",
        "care": ["Machine wash cold", "Tumble dry low"],
        "composition": "80% Cotton, 20% Polyester"
      },
      "rating": 4.7,
      "reviewCount": 86,
      "boutique": {
        "id": "boutique123",
        "name": "Elite Tailors",
        "location": "MG Road, Bangalore",
        "rating": 4.8
      }
    },
    {
      "id": "material123",
      "name": "Premium Cotton Blend",
      "description": "Smooth cotton blend fabric with superior comfort and durability",
      "images": ["url1", "url2"],
      "thumbnail": "thumbnail-url",
      "price": 750,
      "pricePerUnit": "per meter",
      "type": "Cotton",
      "colors": [
        {
          "name": "Navy Blue",
          "code": "#000080",
          "image": "blue-fabric-url",
          "inStock": true
        },
        {
          "name": "Pure White",
          "code": "#FFFFFF",
          "image": "white-fabric-url",
          "inStock": true
        }
      ],
      "availableQuantity": 30,
      "minimumOrder": 2,
      "properties": {
        "weight": "Medium",
        "stretch": "Minimal",
        "opacity": "High",
        "care": ["Machine wash cold", "Tumble dry low"],
        "composition": "80% Cotton, 20% Polyester"
      },
      "rating": 4.5,
      "reviewCount": 65,
      "boutique": {
        "id": "boutique456",
        "name": "Fashion Tailors",
        "location": "Jayanagar, Bangalore",
        "rating": 4.5
      }
    }
    // More materials
  ],
  "pagination": {
    "totalItems": 35,
    "totalPages": 2,
    "currentPage": 1,
    "itemsPerPage": 20
  },
  "filters": {
    "materialTypes": ["Cotton", "Silk", "Wool", "Linen", "Polyester", "Blends"],
    "priceRange": {
      "min": 300,
      "max": 2500
    },
    "colors": ["Blue", "White", "Black", "Red", "Green", "Yellow"]
  }
}
```

### Material Details API
```
GET /api/materials/{materialId}
```

**Response:**
```json
{
  "id": "material123",
  "name": "Premium Cotton Blend",
  "description": "Smooth cotton blend fabric with superior comfort and durability. Perfect for shirts, dresses, and lightweight outerwear. This premium blend offers the breathability of cotton with added durability from polyester.",
  "images": ["url1", "url2", "url3", "url4"],
  "price": 800,
  "basePrice": 800,
  "pricePerUnit": "per meter",
  "type": "Cotton",
  "subtype": "Blend",
  "colors": [
    {
      "name": "Navy Blue",
      "code": "#000080",
      "image": "blue-fabric-url",
      "inStock": true
    },
    {
      "name": "Pure White",
      "code": "#FFFFFF",
      "image": "white-fabric-url",
      "inStock": true
    },
    {
      "name": "Charcoal Black",
      "code": "#36454F",
      "image": "black-fabric-url",
      "inStock": false,
      "restockDate": "2025-06-01"
    }
  ],
  "availableQuantity": 50,
  "minimumOrder": 1,
  "maximumOrder": 20,
  "dimensions": {
    "width": "58 inches"
  },
  "properties": {
    "weight": "Medium",
    "stretch": "Minimal",
    "opacity": "High",
    "care": ["Machine wash cold", "Tumble dry low"],
    "composition": "80% Cotton, 20% Polyester",
    "seasonality": ["Spring", "Summer", "Fall"],
    "texture": "Smooth with slight texture",
    "breathability": "High"
  },
  "rating": 4.7,
  "reviewCount": 86,
  "recommendedFor": ["shirts", "dresses", "casual wear"],
  "relatedMaterials": ["material456", "material789"]
}
```

## Measurements APIs

### Customization Flow API
```
GET /api/services/{serviceId}/customization-flow
```

**Note: This API provides the standardized customization flow for a service, which is consistent across all boutiques offering the same service.**

**Response:**
```json
{
  "steps": [
    {
      "id": "step1",
      "name": "Base Design Selection",
      "order": 1,
      "required": true
    },
    {
      "id": "step2",
      "name": "Material Selection",
      "order": 2,
      "required": true,
      "description": "Select cloth from boutique options or use your own cloth. This step is required for all services."
    },
    {
      "id": "step3",
      "name": "Design Customizations",
      "order": 3,
      "required": false,
      "conditionalOn": {
        "field": "designType",
        "value": "predesigned"
      }
    },
    {
      "id": "step4",
      "name": "Pattern Upload",
      "order": 4,
      "required": false,
      "conditionalOn": {
        "field": "designType",
        "value": "custom"
      }
    }
    // More steps
  ]
}
```

### Custom Design Upload API
```
POST /api/services/{serviceId}/custom-uploads
```

**Request (multipart/form-data):**
```
designType: "sketch" | "reference" | "pattern"
file: [Binary file data]
description: "Description of the custom design upload"
preferredStyle: "Casual" | "Formal" | "Traditional" | etc.
additionalNotes: "Any specific requirements or preferences"
```

**Response:**
```json
{
  "id": "upload123",
  "designType": "sketch",
  "fileUrl": "https://example.com/uploads/sketch123.jpg",
  "thumbnailUrl": "https://example.com/uploads/thumbnails/sketch123.jpg",
  "description": "Front design for traditional blouse",
  "preferredStyle": "Traditional",
  "additionalNotes": "Please focus on the embroidery pattern",
  "uploadDate": "2025-05-07T09:30:45Z",
  "status": "uploaded",
  "estimatedReviewTime": "24-48 hours"
}
```

### Measurement Templates API
```
GET /api/services/{serviceId}/measurement-templates
```

**Note: This API provides the standardized measurement templates for a service, which are consistent across all boutiques offering the same service.**

**Response:**
```json
{
  "measurementOptions": {
    "manual": true,
    "homeService": true,
    "oldGarment": true
  },
  "templates": [
    {
      "id": "shirt",
      "name": "Shirt Measurements",
      "description": "Measurements required for shirt tailoring",
      "fields": [
        {
          "id": "neck",
          "name": "Neck",
          "description": "Measure around the base of the neck",
          "unit": "inches",
          "required": true,
          "guideImage": "url-to-neck-measurement-guide",
          "videoGuide": "url-to-neck-measurement-video",
          "defaultValue": null,
          "minValue": 12,
          "maxValue": 24
        },
        {
          "id": "chest",
          "name": "Chest",
          "description": "Measure around the fullest part of the chest",
          "unit": "inches",
          "required": true,
          "guideImage": "url-to-chest-measurement-guide",
          "videoGuide": "url-to-chest-measurement-video",
          "defaultValue": null,
          "minValue": 30,
          "maxValue": 60
        },
        // More measurement fields
      ]
    },
    {
      "id": "pants",
      "name": "Pants Measurements",
      "description": "Measurements required for pants tailoring",
      "fields": [
        // Pants-specific measurement fields
      ]
    }
  ]
}
```

### Measurement Submission API
```
POST /api/orders/{orderId}/measurements
```

**Request:**
```json
{
  "measurementType": "manual",
  "templateId": "shirt",
  "values": {
    "neck": 16.5,
    "chest": 42,
    "waist": 36,
    "hips": 40,
    "shoulder": 18.5,
    "sleeveLength": 25,
    "additional": "Please make the cuffs slightly looser"
  }
}
```

**Response:**
```json
{
  "id": "measurement123",
  "orderId": "order123",
  "measurementType": "manual",
  "templateId": "shirt",
  "values": {
    "neck": 16.5,
    "chest": 42,
    "waist": 36,
    "hips": 40,
    "shoulder": 18.5,
    "sleeveLength": 25,
    "additional": "Please make the cuffs slightly looser"
  },
  "submittedAt": "2025-05-07T10:15:30Z",
  "status": "submitted",
  "validationIssues": []
}
```

# Implementation Guidelines

## Implementation Strategy

### Frontend Implementation

1. **Service Selection Page**:
   - When a user selects a boutique and service, fetch the service details using the Service Details API
   - Dynamically render UI elements based on available options

2. **Design Type Selection**:
   - Check `designOptions` directly from the service details API response
   - Show design options based on `hasPredesigned` and `hasCustom` values
   - If only one option is available, potentially skip this step

3. **Material Selection**:
   - Check `materialOptions` from the service details
   - If `sellsMaterial` is true, fetch and display materials
   - If `acceptsCustomMaterial` is true, show the option for users to bring their own material

4. **Style Selection** (For predesigned):
   - Fetch styles specific to the selected service
   - For each style, show available customization options

5. **Customization Flow**:
   - Use the Customization Steps API to determine the order and conditional display of customization screens
   - Some services might have simple customizations, others more complex

### Backend Implementation

1. **Database Schema**:
   - Create flexible schemas that can handle varying design options and customizations per service
   - Use relationship tables to connect services with their specific options

2. **Service Configuration**:
   - Admin panel to configure which options are available for each service
   - Ability to add/update customization steps per service

3. **Conditional Logic**:
   - Implement logic to determine which steps are shown based on previous selections
   - Handle edge cases where certain combinations are not valid

## Example Flow Implementation

Here's how we can implement this in React by updating the existing structure:

```tsx
// ServiceDetailsPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrder } from '../utils/OrderContext';

const ServiceDetailsPage = () => {
  const { boutiqueId, serviceId } = useParams();
  const navigate = useNavigate();
  const { updateOrder } = useOrder();
  
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        const response = await fetch(`/api/services/${serviceId}`);
        const data = await response.json();
        setService(data);
        updateOrder({ service: data });
      } catch (error) {
        console.error('Error fetching service details:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchServiceDetails();
  }, [serviceId, updateOrder]);
  
  const handleContinue = () => {
    // Determine next screen based on service options
    if (service.designOptions.hasPredesigned && service.designOptions.hasCustom) {
      // If both options are available, go to design selection
      navigate(`/boutique/${boutiqueId}/service/${serviceId}/design-selection`);
    } else if (service.designOptions.hasPredesigned) {
      // If only predesigned is available, skip to predesigned styles
      navigate(`/boutique/${boutiqueId}/service/${serviceId}/predesigned-styles`);
    } else if (service.designOptions.hasCustom) {
      // If only custom is available, skip to custom design
      navigate(`/boutique/${boutiqueId}/service/${serviceId}/custom-design`);
    }
  };
  
  if (loading) {
    return <div>Loading service details...</div>;
  }
  
  return (
    <div>
      <h1>{service.name}</h1>
      <p>{service.description}</p>
      <button onClick={handleContinue}>Continue</button>
    </div>
  );
};

export default ServiceDetailsPage;
```

## Order Context Updates

We'll need to extend the current Order context to handle the dynamic service options:

```tsx
// OrderContext.tsx
import React, { createContext, useState, useContext } from 'react';

interface OrderContextType {
  order: Order;
  updateOrder: (updates: Partial<Order>) => void;
  resetOrder: () => void;
}

export const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC = ({ children }) => {
  const [order, setOrder] = useState<Order>({
    // Basic order info
    boutique: null,
    service: null,
    designType: null,
    
    // Dynamic service-specific options
    serviceOptions: {
      availableDesignTypes: [],
      availableMaterialOptions: [],
      customizationFlow: null,
    },
    
    // Design specifics
    predesignedStyle: null,
    customDesign: null,
    
    // Material specifics
    clothOption: null,
    boutiqueCloth: null,
    ownClothDetails: null,
    
    // ... other order properties
  });
  
  const updateOrder = (updates: Partial<Order>) => {
    setOrder(prev => ({ ...prev, ...updates }));
  };
  
  const resetOrder = () => {
    setOrder({
      // Reset to initial state
    });
  };
  
  return (
    <OrderContext.Provider value={{ order, updateOrder, resetOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};
```

## Routing Structure

Update the routing to handle dynamic flows:

```tsx
// App.tsx (routing update)
<Routes>
  <Route path="/boutique/:boutiqueId/service/:serviceId" element={<ServiceDetailsPage />} />
  
  {/* Conditional routes based on service options */}
  <Route path="/boutique/:boutiqueId/service/:serviceId/design-selection" element={<DesignSelectionPage />} />
  <Route path="/boutique/:boutiqueId/service/:serviceId/predesigned-styles" element={<PredesignedStylesPage />} />
  <Route path="/boutique/:boutiqueId/service/:serviceId/custom-design" element={<CustomDesignPage />} />
  
  {/* Dynamic customization routes */}
  <Route path="/boutique/:boutiqueId/service/:serviceId/style/:styleId/customize" element={<StyleCustomizationPage />} />
  
  {/* Material selection routes */}
  <Route path="/boutique/:boutiqueId/service/:serviceId/material-selection" element={<MaterialSelectionPage />} />
  
  {/* Common routes that apply to all services */}
  <Route path="/boutique/:boutiqueId/service/:serviceId/measurement" element={<MeasurementPage />} />
  {/* ... other common routes */}
</Routes>
```

## Order Management APIs

### Order Creation API
```
POST /api/orders
```

**Request:**
```json
{
  "userId": "user123",
  "boutiqueId": "boutique123",
  "serviceId": "service123",
  "designType": "predesigned",
  "styleId": "style123",
  "customizations": {
    "collar": "collar2",
    "sleeves": "sleeve1",
    "buttons": "button2"
  },
  "clothOption": "boutique",
  "materialId": "material123",
  "materialColor": "Navy Blue",
  "materialQuantity": 3,
  "measurementOption": "manual",
  "deliveryAddressId": "address123"
}
```

**Response:**
```json
{
  "id": "order123",
  "userId": "user123",
  "createdAt": "2025-05-07T15:30:00Z",
  "status": "created",
  "boutiqueDetails": {
    "id": "boutique123",
    "name": "Elite Tailors"
  },
  "serviceDetails": {
    "id": "service123",
    "name": "Premium Shirt Tailoring"
  },
  "designDetails": {
    "type": "predesigned",
    "styleId": "style123",
    "styleName": "Classic Shirt",
    "customizations": {
      "collar": {
        "id": "collar2",
        "name": "Button Down",
        "price": 100
      },
      "sleeves": {
        "id": "sleeve1",
        "name": "Full Sleeves",
        "price": 0
      },
      "buttons": {
        "id": "button2",
        "name": "Premium Buttons",
        "price": 200
      }
    }
  },
  "materialDetails": {
    "option": "boutique",
    "material": {
      "id": "material123",
      "name": "Premium Cotton Blend",
      "color": "Navy Blue",
      "price": 800,
      "quantity": 3
    }
  },
  "measurementOption": "manual",
  "measurementStatus": "pending",
  "deliveryAddressId": "address123",
  "pricing": {
    "basePrice": 1200,
    "customizationCost": 300,
    "materialCost": 2400,
    "deliveryCharge": 100,
    "tax": 300,
    "totalAmount": 4300
  },
  "nextSteps": [
    {
      "step": "measurement",
      "url": "/api/orders/order123/measurements",
      "required": true
    },
    {
      "step": "payment",
      "url": "/api/orders/order123/payment",
      "required": true
    }
  ]
}
```

### Order Details API
```
GET /api/orders/{orderId}
```

**Response:** Same as Order Creation response

### Order Payment API
```
POST /api/orders/{orderId}/payment
```

**Request:**
```json
{
  "paymentMethod": "card",
  "paymentDetails": {
    "cardToken": "tok_visa",
    "saveCard": true
  },
  "amount": 4300,
  "currency": "INR"
}
```

**Response:**
```json
{
  "id": "payment123",
  "orderId": "order123",
  "status": "success",
  "amount": 4300,
  "currency": "INR",
  "paymentMethod": "card",
  "transactionId": "txn_123456",
  "receipt": "https://example.com/receipts/order123.pdf",
  "createdAt": "2025-05-07T15:35:00Z",
  "orderStatus": "confirmed",
  "estimatedDelivery": {
    "start": "2025-05-14",
    "end": "2025-05-17"
  }
}
```

### Order List API
```
GET /api/users/{userId}/orders
```

**Query Parameters:**
- `status` (string, optional): Filter by order status ("created", "confirmed", "in_progress", "ready", "delivered", "cancelled")
- `page` (number, optional): Page number for pagination (default: 1)
- `limit` (number, optional): Results per page (default: 10)
- `sort` (string, optional): Sort order ("date_desc", "date_asc")

**Response:**
```json
{
  "orders": [
    {
      "id": "order123",
      "createdAt": "2025-05-07T15:30:00Z",
      "status": "confirmed",
      "boutiqueDetails": {
        "id": "boutique123",
        "name": "Elite Tailors"
      },
      "serviceDetails": {
        "id": "service123",
        "name": "Premium Shirt Tailoring"
      },
      "designDetails": {
        "type": "predesigned",
        "styleName": "Classic Shirt"
      },
      "totalAmount": 4300,
      "estimatedDelivery": {
        "start": "2025-05-14",
        "end": "2025-05-17"
      }
    }
    // More orders
  ],
  "pagination": {
    "totalItems": 24,
    "totalPages": 3,
    "currentPage": 1,
    "itemsPerPage": 10
  }
}
```

## Data Validation and Error Handling

Each API should include proper validation and error handling:

```json
{
  "status": "error",
  "code": "SERVICE_NOT_AVAILABLE",
  "message": "The requested service is currently not available",
  "details": {
    "serviceId": "service123",
    "reason": "maintenance"
  }
}
```

## Common Error Codes

| Code | Description | HTTP Status |
|------|-------------|-------------|
| `INVALID_REQUEST` | The request is invalid or missing required fields | 400 |
| `RESOURCE_NOT_FOUND` | The requested resource doesn't exist | 404 |
| `SERVICE_NOT_AVAILABLE` | The service is temporarily unavailable | 503 |
| `AUTHENTICATION_FAILED` | Authentication failed | 401 |
| `AUTHORIZATION_FAILED` | User not authorized for this action | 403 |
| `VALIDATION_FAILED` | Input validation failed | 422 |
| `RESOURCE_CONFLICT` | Resource already exists | 409 |
| `INTERNAL_ERROR` | Unexpected server error | 500 |

## Backend Implementation Guide

### Database Schema Recommendations

#### Core Entities

1. **Service**
   - Standard attributes (id, name, description)
   - Design options flags (hasPredesigned, hasCustom)
   - Material options flags (sellsMaterial, acceptsCustomMaterial)

2. **Boutique**
   - Basic info (id, name, description, location, etc.)
   - Rating and reviews

3. **BoutiqueService** (Junction Table)
   - Links boutiques to services they offer
   - Stores boutique-specific service customizations (price ranges, delivery times, etc.)

4. **PredesignedStyle**
   - Core style attributes (name, description, base price, etc.)
   - Foreign keys to service

5. **StyleCustomizationOption**
   - Customization categories and options
   - Price modifications

6. **BoutiqueStyleOffering** (Junction Table)
   - Links boutiques to styles they offer
   - Stores boutique-specific pricing/variations

7. **Material**
   - Basic material attributes
   - Service association
   - Type and properties

8. **BoutiqueMaterial** (Junction Table)
   - Links boutiques to materials they offer
   - Stores boutique-specific pricing and inventory

### API Implementation Notes

1. **Dynamic Service Configuration**
   - Service details should be configurable by admin
   - Service-specific flows should be defined in configuration
   - Common elements (measurement templates) should be shared across boutiques

2. **Caching Strategy**
   - Consider caching service details and boutique-independent data
   - Set appropriate cache invalidation for data that changes rarely

3. **Query Optimization**
   - For boutique-specific endpoints, use direct joins
   - For service-wide endpoints that aggregate boutique data, consider denormalizing
   - Add indexes on frequently queried fields (serviceId, boutiqueId)

4. **Security Considerations**
   - Implement rate limiting for public endpoints
   - Add authorization checks for order operations
   - Validate all user inputs, especially measurement values

5. **Testing Approach**
   - Create integration tests covering both user flow patterns
   - Build fixtures with multiple boutiques offering the same service
   - Test edge cases like out-of-stock materials

### Development Priority Order

1. Core Service/Boutique APIs
2. Material and Pre-designed Styles APIs
3. Customization and Measurement APIs
4. Order Creation and Management
5. Payment Integration

## Next Steps

1. **Create API Stubs**: Develop mock APIs that follow this structure for testing
2. **Update Component Logic**: Modify existing components to handle conditional rendering
3. **Create Database Schema**: Implement the database design based on the recommendations
4. **Build Admin Dashboard**: Create interfaces for configuring service options
5. **Testing**: Test various service configurations to ensure all flows work
6. **Documentation**: Keep this document updated as the API evolves
