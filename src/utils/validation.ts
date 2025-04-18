
import { z } from "zod";

export const phoneSchema = z
  .string()
  .min(10, "Phone number must be at least 10 digits")
  .max(10, "Phone number must not exceed 10 digits")
  .regex(/^\d+$/, "Phone number must contain only digits");

export const addressSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  phone: phoneSchema,
  addressLine1: z.string().min(1, "Address line 1 is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z
    .string()
    .min(6, "Pincode must be 6 digits")
    .max(6, "Pincode must be 6 digits")
    .regex(/^\d+$/, "Pincode must contain only digits"),
  isDefault: z.boolean().optional().default(false),
});

export const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: phoneSchema,
  email: z.string().email("Invalid email format").optional(),
});

export const ownClothSchema = z.object({
  material: z.string().min(1, "Material is required"),
  color: z.string().min(1, "Color is required"),
  quantity: z.string().min(1, "Quantity is required"),
});

export const measurementsSchema = z.object({
  bust: z.string().min(1, "Bust measurement is required"),
  waist: z.string().min(1, "Waist measurement is required"),
  hips: z.string().min(1, "Hip measurement is required"),
  shoulderToWaist: z.string().min(1, "Shoulder to waist measurement is required"),
  armLength: z.string().min(1, "Arm length is required"),
  armHole: z.string().min(1, "Arm hole measurement is required"),
  armCircumference: z.string().min(1, "Arm circumference is required"),
  neckDepthFront: z.string().min(1, "Front neck depth is required"),
  neckDepthBack: z.string().min(1, "Back neck depth is required"),
  additional: z.string().optional(),
});
