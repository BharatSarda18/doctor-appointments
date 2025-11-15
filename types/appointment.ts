import { Doctor } from "./doctor";
import { User } from "./user";

export type AppointmentStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
export type AppointmentMode = "ONLINE" | "OFFLINE";

export interface Appointment {
    id: string;
    doctor: Doctor | string;
    patient: User | string;
    startTime: Date;
    endTime: Date;
    status: AppointmentStatus;
    mode: AppointmentMode;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface BookAppointmentInput {
    doctorId: string;
    startTime: string; // ISO string
    endTime: string; // ISO string
    mode?: AppointmentMode;
    notes?: string;
}

