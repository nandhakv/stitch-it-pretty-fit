import { apiRequest, USE_MOCK_API } from './index';

// Types for Customization Flow and Measurement APIs
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

export interface CustomizationFlowResponse {
  steps: CustomizationStep[];
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

export interface MeasurementTemplatesResponse {
  measurementOptions: {
    manual: boolean;
    homeService: boolean;
    oldGarment: boolean;
  };
  templates: MeasurementTemplate[];
}

export interface MeasurementSubmissionRequest {
  measurementType: string;
  templateId: string;
  values: Record<string, any>;
}

export interface MeasurementSubmissionResponse {
  id: string;
  orderId: string;
  measurementType: string;
  templateId: string;
  values: Record<string, any>;
  submittedAt: string;
  status: string;
  validationIssues: string[];
}

// Mock data for development
const mockCustomizationFlow: CustomizationFlowResponse = {
  steps: [
    {
      id: "step1",
      name: "Base Design Selection",
      order: 1,
      required: true
    },
    {
      id: "step2",
      name: "Material Selection",
      order: 2,
      required: true,
      description: "Select cloth from boutique options or use your own cloth. This step is required for all services."
    },
    {
      id: "step3",
      name: "Design Customizations",
      order: 3,
      required: false,
      conditionalOn: {
        field: "designType",
        value: "predesigned"
      }
    },
    {
      id: "step4",
      name: "Pattern Upload",
      order: 4,
      required: false,
      conditionalOn: {
        field: "designType",
        value: "custom"
      }
    },
    {
      id: "step5",
      name: "Measurements",
      order: 5,
      required: true
    },
    {
      id: "step6",
      name: "Delivery Details",
      order: 6,
      required: true
    }
  ]
};

const mockMeasurementTemplates: MeasurementTemplatesResponse = {
  measurementOptions: {
    manual: true,
    homeService: true,
    oldGarment: true
  },
  templates: [
    {
      id: "shirt",
      name: "Shirt Measurements",
      description: "Measurements required for shirt tailoring",
      fields: [
        {
          id: "neck",
          name: "Neck",
          description: "Measure around the base of the neck",
          unit: "inches",
          required: true,
          guideImage: "url-to-neck-measurement-guide",
          videoGuide: "url-to-neck-measurement-video",
          defaultValue: null,
          minValue: 12,
          maxValue: 24
        },
        {
          id: "chest",
          name: "Chest",
          description: "Measure around the fullest part of the chest",
          unit: "inches",
          required: true,
          guideImage: "url-to-chest-measurement-guide",
          videoGuide: "url-to-chest-measurement-video",
          defaultValue: null,
          minValue: 30,
          maxValue: 60
        },
        {
          id: "waist",
          name: "Waist",
          description: "Measure around the natural waistline",
          unit: "inches",
          required: true,
          guideImage: "url-to-waist-measurement-guide",
          videoGuide: "url-to-waist-measurement-video",
          defaultValue: null,
          minValue: 26,
          maxValue: 50
        },
        {
          id: "shoulder",
          name: "Shoulder Width",
          description: "Measure from shoulder point to shoulder point",
          unit: "inches",
          required: true,
          guideImage: "url-to-shoulder-measurement-guide",
          videoGuide: "url-to-shoulder-measurement-video",
          defaultValue: null,
          minValue: 14,
          maxValue: 24
        },
        {
          id: "sleeveLength",
          name: "Sleeve Length",
          description: "Measure from shoulder to wrist",
          unit: "inches",
          required: true,
          guideImage: "url-to-sleeve-measurement-guide",
          videoGuide: "url-to-sleeve-measurement-video",
          defaultValue: null,
          minValue: 20,
          maxValue: 30
        }
      ]
    },
    {
      id: "blouse",
      name: "Blouse Measurements",
      description: "Measurements required for blouse tailoring",
      fields: [
        {
          id: "bust",
          name: "Bust",
          description: "Measure around the fullest part of the bust",
          unit: "inches",
          required: true,
          guideImage: "url-to-bust-measurement-guide",
          videoGuide: "url-to-bust-measurement-video",
          defaultValue: null,
          minValue: 28,
          maxValue: 50
        },
        {
          id: "waist",
          name: "Waist",
          description: "Measure around the natural waistline",
          unit: "inches",
          required: true,
          guideImage: "url-to-waist-measurement-guide",
          videoGuide: "url-to-waist-measurement-video",
          defaultValue: null,
          minValue: 22,
          maxValue: 46
        },
        {
          id: "shoulder",
          name: "Shoulder Width",
          description: "Measure from shoulder point to shoulder point",
          unit: "inches",
          required: true,
          guideImage: "url-to-shoulder-measurement-guide",
          videoGuide: "url-to-shoulder-measurement-video",
          defaultValue: null,
          minValue: 12,
          maxValue: 20
        },
        {
          id: "armhole",
          name: "Armhole",
          description: "Measure the circumference around the armhole",
          unit: "inches",
          required: true,
          guideImage: "url-to-armhole-measurement-guide",
          videoGuide: "url-to-armhole-measurement-video",
          defaultValue: null,
          minValue: 14,
          maxValue: 24
        },
        {
          id: "sleeveLength",
          name: "Sleeve Length",
          description: "Measure from shoulder to desired sleeve end",
          unit: "inches",
          required: true,
          guideImage: "url-to-sleeve-measurement-guide",
          videoGuide: "url-to-sleeve-measurement-video",
          defaultValue: null,
          minValue: 0,
          maxValue: 24
        },
        {
          id: "backNeckDepth",
          name: "Back Neck Depth",
          description: "Measure from base of neck to desired back neck depth",
          unit: "inches",
          required: true,
          guideImage: "url-to-back-neck-depth-guide",
          videoGuide: "url-to-back-neck-depth-video",
          defaultValue: null,
          minValue: 0.5,
          maxValue: 10
        }
      ]
    }
  ]
};

// API functions
export const getCustomizationFlow = async (serviceId: string): Promise<CustomizationFlowResponse> => {
  if (USE_MOCK_API) {
    return new Promise(resolve => {
      setTimeout(() => resolve(mockCustomizationFlow), 500);
    });
  }
  
  return apiRequest<CustomizationFlowResponse>(`/api/services/${serviceId}/customization-flow`);
};

export const getMeasurementTemplates = async (serviceId: string): Promise<MeasurementTemplatesResponse> => {
  if (USE_MOCK_API) {
    return new Promise(resolve => {
      setTimeout(() => resolve(mockMeasurementTemplates), 500);
    });
  }
  
  return apiRequest<MeasurementTemplatesResponse>(`/api/services/${serviceId}/measurement-templates`);
};

export const submitMeasurements = async (
  orderId: string,
  data: MeasurementSubmissionRequest
): Promise<MeasurementSubmissionResponse> => {
  if (USE_MOCK_API) {
    const response: MeasurementSubmissionResponse = {
      id: "measurement123",
      orderId: orderId,
      measurementType: data.measurementType,
      templateId: data.templateId,
      values: data.values,
      submittedAt: new Date().toISOString(),
      status: "submitted",
      validationIssues: []
    };
    
    return new Promise(resolve => {
      setTimeout(() => resolve(response), 1000);
    });
  }
  
  return apiRequest<MeasurementSubmissionResponse>(`/api/orders/${orderId}/measurements`, {
    method: 'POST',
    body: JSON.stringify(data)
  });
};
