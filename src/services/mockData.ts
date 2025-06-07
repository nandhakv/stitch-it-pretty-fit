// Mock data for the Stitch-it-Pretty-Fit app
// This provides fallback data when API calls fail

import { StylesResponse, PredesignedStyle, MaterialsResponse, Service } from './api';

// Mock data for predesigned styles
export const mockPredesignedStyles: StylesResponse = {
  styles: [
    {
      id: "style1",
      name: "Minimalist Chic",
      description: "A sleek and simple blouse with clean lines and minimal embellishments.",
      imageUrls: [
        "https://firebasestorage.googleapis.com/v0/b/stitch-it-pretty-fit.appspot.com/o/services%2Fblouse4.jpg?alt=media",
        "https://firebasestorage.googleapis.com/v0/b/stitch-it-pretty-fit.appspot.com/o/services%2Fblouse2.jpg?alt=media"
      ],
      thumbnail: "https://firebasestorage.googleapis.com/v0/b/stitch-it-pretty-fit.appspot.com/o/services%2Fblouse4.jpg?alt=media",
      price: 1299,
      category: "Cap Sleeve",
      tags: ["Minimal", "Modern", "Versatile"],
      rating: 4.8,
      reviewCount: 42,
      customizationCategories: ["collar", "sleeve", "fabric"],
      hasCustomizations: true
    },
    {
      id: "style2",
      name: "Modern Cut",
      description: "A contemporary design with unique cuts and stylish elements.",
      imageUrls: [
        "https://firebasestorage.googleapis.com/v0/b/stitch-it-pretty-fit.appspot.com/o/services%2Fblouse2.jpg?alt=media",
        "https://firebasestorage.googleapis.com/v0/b/stitch-it-pretty-fit.appspot.com/o/services%2Fblouse3.jpg?alt=media"
      ],
      thumbnail: "https://firebasestorage.googleapis.com/v0/b/stitch-it-pretty-fit.appspot.com/o/services%2Fblouse2.jpg?alt=media",
      price: 1499,
      category: "Sleeveless",
      tags: ["Contemporary", "Stylish", "Elegant"],
      rating: 4.6,
      reviewCount: 35,
      customizationCategories: ["collar", "embroidery"],
      hasCustomizations: true
    },
    {
      id: "style3",
      name: "Traditional Elegance",
      description: "A traditional design with intricate embroidery and classic elements.",
      imageUrls: [
        "https://firebasestorage.googleapis.com/v0/b/stitch-it-pretty-fit.appspot.com/o/services%2Fblouse3.jpg?alt=media",
        "https://firebasestorage.googleapis.com/v0/b/stitch-it-pretty-fit.appspot.com/o/services%2Fblouse1.jpg?alt=media"
      ],
      thumbnail: "https://firebasestorage.googleapis.com/v0/b/stitch-it-pretty-fit.appspot.com/o/services%2Fblouse3.jpg?alt=media",
      price: 1899,
      category: "Full Sleeve",
      tags: ["Traditional", "Embroidered", "Elegant"],
      rating: 4.9,
      reviewCount: 58,
      customizationCategories: ["collar", "embroidery", "sleeve"],
      hasCustomizations: true
    }
  ],
  pagination: {
    totalItems: 3,
    totalPages: 1,
    currentPage: 1,
    itemsPerPage: 10
  },
  filters: {
    categories: ["Princess Cut", "Sleeveless", "Full Sleeve", "Cap Sleeve", "Elbow Length", "Short Sleeve"],
    priceRange: {
      min: 1299,
      max: 1899
    }
  }
};

// Mock data for materials
export const mockMaterials: MaterialsResponse = {
  sellsMaterial: true,
  acceptsCustomMaterial: true,
  materials: [
    {
      id: "silk",
      name: "Pure Silk",
      description: "100% Pure Silk fabric perfect for luxurious blouses",
      images: ["/images/fabrics/silk.jpg"],
      thumbnail: "/images/fabrics/silk.jpg",
      price: 2500,
      pricePerUnit: "per meter",
      type: "Silk",
      colors: [
        { name: "Off-white", code: "#f8f8f0", image: "/images/fabrics/silk.jpg", inStock: true }
      ],
      availableQuantity: 50,
      minimumOrder: 1,
      properties: {
        weight: "Light",
        stretch: "Minimal",
        opacity: "Semi-opaque",
        care: ["Dry clean only", "Iron on low heat"],
        composition: "100% Pure Silk"
      },
      rating: 4.9,
      reviewCount: 65
    },
    {
      id: "cotton",
      name: "Cotton",
      description: "100% Organic Cotton fabric suitable for everyday wear",
      images: ["/images/fabrics/cotton.jpg"],
      thumbnail: "/images/fabrics/cotton.jpg",
      price: 1000,
      pricePerUnit: "per meter",
      type: "Cotton",
      colors: [
        { name: "White", code: "#ffffff", image: "/images/fabrics/cotton.jpg", inStock: true }
      ],
      availableQuantity: 100,
      minimumOrder: 1,
      properties: {
        weight: "Medium",
        stretch: "Minimal",
        opacity: "Opaque",
        care: ["Machine wash cold", "Tumble dry low"],
        composition: "100% Organic Cotton"
      },
      rating: 4.7,
      reviewCount: 98
    }
  ],
  pagination: {
    totalItems: 2,
    totalPages: 1,
    currentPage: 1,
    itemsPerPage: 10
  },
  filters: {
    materialTypes: ["Silk", "Cotton", "Georgette", "Chiffon", "Crepe", "Satin"],
    priceRange: {
      min: 1000,
      max: 2500
    },
    colors: ["White", "Off-white", "Cream", "Beige"]
  }
};
