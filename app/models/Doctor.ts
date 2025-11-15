import mongoose, { Schema, Document, Types } from "mongoose";

export interface IDoctor extends Document {
    user: Types.ObjectId; // reference to User
    specialization: string;
    experienceYears: number;
    consultationFee: number;
    about?: string;
    clinicName?: string;
    clinicAddress?: string;
    city?: string;
    isApproved: boolean;
    schedule: {
        dayOfWeek: number; // 0=Sunday - 6=Saturday
        startTime: string; // "09:00"
        endTime: string;   // "12:00"
        slotDurationMinutes: number; // e.g 30
    }[];
    blockedDates: Date[];
}

const DoctorSchema = new Schema<IDoctor>(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        specialization: { type: String, required: true },
        experienceYears: { type: Number, default: 0 },
        consultationFee: { type: Number, default: 0 },
        about: String,
        clinicName: String,
        clinicAddress: String,
        city: String,
        isApproved: { type: Boolean, default: false },
        schedule: [
            {
                dayOfWeek: Number,
                startTime: String,
                endTime: String,
                slotDurationMinutes: Number,
            },
        ],
        blockedDates: [Date],
    },
    { timestamps: true }
);

export default mongoose.models.Doctor ||
    mongoose.model<IDoctor>("Doctor", DoctorSchema);
