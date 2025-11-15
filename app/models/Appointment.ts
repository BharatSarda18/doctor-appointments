import mongoose, { Schema, Document, Types } from "mongoose";

export interface IAppointment extends Document {
    doctor: Types.ObjectId;
    patient: Types.ObjectId; // User (role PATIENT)
    startTime: Date;
    endTime: Date;
    status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
    mode: "ONLINE" | "OFFLINE";
    notes?: string;
    createdAt: Date;
}

const AppointmentSchema = new Schema<IAppointment>(
    {
        doctor: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
        patient: { type: Schema.Types.ObjectId, ref: "User", required: true },
        startTime: { type: Date, required: true },
        endTime: { type: Date, required: true },
        status: {
            type: String,
            enum: ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"],
            default: "PENDING",
        },
        mode: { type: String, enum: ["ONLINE", "OFFLINE"], default: "OFFLINE" },
        notes: String,
    },
    { timestamps: true }
);

export default mongoose.models.Appointment ||
    mongoose.model<IAppointment>("Appointment", AppointmentSchema);
