// lib/validations.ts
import { z } from "zod";

export const checkoutSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  phoneNumber: z.string().min(10, "Phone must be at least 10 digits"),
  alternatePhone: z.string().optional(),
  instagramId: z.string().optional(),
  address: z.string().min(10, "Address must be at least 10 characters"),
  district: z.string().min(2, "District is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().min(6, "Pincode must be 6 digits"),
  landmark: z.string().optional(),
});