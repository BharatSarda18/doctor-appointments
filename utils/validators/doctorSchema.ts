import { z } from "zod";

const scheduleDaySchema = z.object({
    dayOfWeek: z.number().min(0).max(6),
    startTime: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
    endTime: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
    slotDurationMinutes: z.number().min(15).max(120),
});

export const createDoctorSchema = z.object({
    specialization: z.string().min(2, "Specialization is required"),
    experienceYears: z.number().min(0, "Experience years must be non-negative"),
    consultationFee: z.number().min(0, "Consultation fee must be non-negative"),
    about: z.string().optional(),
    clinicName: z.string().optional(),
    clinicAddress: z.string().optional(),
    city: z.string().min(2, "City/Place is required"),
    schedule: z.array(scheduleDaySchema).min(1, "At least one schedule day is required"),
});

export type CreateDoctorInput = z.infer<typeof createDoctorSchema>;

