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
    phone: z.string().regex(/^[0-9]{10}$/, "Invalid phone number (10 digits required)").optional(),
    avatar: z.string().optional(),
    
    // Vehicle
    vehicle: z.object({
        type: z.enum(["Bicycle", "Motorcycle", "Car", "Scooter"], {
            message: "Please select a vehicle type"
        }),
        number: z.string().min(4, "Invalid vehicle number").max(15),
        model: z.string().optional().or(z.literal('')),
    }),

    // KYC
    kycStatus: z.enum(["Pending", "In Review", "Verified", "Rejected"]).optional(),
    documents: z.object({
        aadhaar: z.object({
            number: z.string().optional().or(z.literal('')),
            frontImage: z.string().optional().or(z.literal('')),
            backImage: z.string().optional().or(z.literal('')),
            status: z.enum(["Pending", "Approved", "Rejected"]).optional(),
        }).optional(),
        pan: z.object({
            number: z.string().optional().or(z.literal('')),
            image: z.string().optional().or(z.literal('')),
            status: z.enum(["Pending", "Approved", "Rejected"]).optional(),
        }).optional(),
        drivingLicense: z.object({
            number: z.string().optional().or(z.literal('')),
            image: z.string().optional().or(z.literal('')),
            expiryDate: z.string().optional().or(z.literal('')), // Use string for input then convert to Date
            status: z.enum(["Pending", "Approved", "Rejected"]).optional(),
        }).optional(),
    }).optional(),

    // Financials
    walletBalance: z.coerce.number().optional(),
    totalEarnings: z.coerce.number().optional(),

    // Status
    isOnline: z.boolean().optional(),
    isActive: z.boolean().optional(),
    isVerified: z.boolean().optional(),
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
