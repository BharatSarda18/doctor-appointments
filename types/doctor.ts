import { User } from "./user";

export interface ScheduleDay {
    dayOfWeek: number; // 0=Sunday - 6=Saturday
    startTime: string; // "09:00"
    endTime: string; // "17:00"
    slotDurationMinutes: number; // e.g 30
}

export interface Doctor {
    id: string;
    user: User | string;
    specialization: string;
    experienceYears: number;
    consultationFee: number;
    about?: string;
    clinicName?: string;
    clinicAddress?: string;
    city?: string;
    isApproved: boolean;
    schedule: ScheduleDay[];
    blockedDates: Date[];
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateDoctorInput {
    specialization: string;
    experienceYears: number;
    consultationFee: number;
    about?: string;
    clinicName?: string;
    clinicAddress?: string;
    city?: string;
    schedule: ScheduleDay[];
}

