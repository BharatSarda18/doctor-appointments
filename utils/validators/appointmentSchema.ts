import { z } from "zod";

export const bookAppointmentSchema = z.object({
    doctorId: z.string().min(1, "Doctor ID is required"),
    startTime: z.string().datetime("Invalid start time format"),
    endTime: z.string().datetime("Invalid end time format"),
    mode: z.enum(["ONLINE", "OFFLINE"]).optional(),
    notes: z.string().optional(),
}).refine(
    (data) => new Date(data.endTime) > new Date(data.startTime),
    {
        message: "End time must be after start time",
        path: ["endTime"],
    }
);

export type BookAppointmentInput = z.infer<typeof bookAppointmentSchema>;

