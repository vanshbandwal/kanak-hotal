import { z } from 'zod';

export const phoneSchema = z.object({
    phone: z.string().regex(/^[0-9]{10}$/, "Invalid phone number (10 digits required)"),
});

export const otpSchema = z.object({
    otp: z.string().length(4, "OTP must be exactly 4 digits"),
});

export const partnerDetailsSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(50),
    email: z.string().email("Invalid email address").optional().or(z.literal('')),
    vehicleType: z.enum(["Bicycle", "Motorcycle", "Car", "Scooter"], {
        errorMap: () => ({ message: "Please select a vehicle type" })
    }),
    vehicleNumber: z.string().min(4, "Invalid vehicle number").max(15),
});

export type PhoneFormData = z.infer<typeof phoneSchema>;
export type OtpFormData = z.infer<typeof otpSchema>;
export type PartnerDetailsFormData = z.infer<typeof partnerDetailsSchema>;

export const kycAuditSchema = z.object({
    docType: z.enum(['aadhaar', 'pan', 'drivingLicense']),
    status: z.enum(['Approved', 'Rejected']),
    reason: z.string().optional(),
});

export type KycAuditFormData = z.infer<typeof kycAuditSchema>;
