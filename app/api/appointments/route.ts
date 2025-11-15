import { NextRequest } from "next/server";
import connectDB from "@/app/lib/db";
import Appointment from "@/app/models/Appointment";
import Doctor from "@/app/models/Doctor";
import { successResponse, errorResponse } from "@/app/lib/responses";
import { verifyPatient } from "@/app/lib/verifyUser";
import { bookAppointmentSchema } from "@/utils/validators/appointmentSchema";
import { isSlotAvailable } from "@/app/lib/slotGenerator";

export async function POST(request: NextRequest) {
    try {
        const authResult = await verifyPatient(request);
        if ("error" in authResult) return authResult.error;

        const body = await request.json();
        const validation = bookAppointmentSchema.safeParse(body);

        if (!validation.success) {
            return errorResponse("Validation failed", 400, validation.error.flatten().fieldErrors);
        }

        await connectDB();

        const user = authResult.user as any;
        const { doctorId, startTime, endTime, mode, notes } = validation.data;

        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return errorResponse("Doctor not found", 404);
        }

        if (!doctor.isApproved) {
            return errorResponse("Doctor profile is not approved", 403);
        }

        const startDateTime = new Date(startTime);
        const endDateTime = new Date(endTime);

        // Check if slot is available
        const existingAppointments = await Appointment.find({
            doctor: doctorId,
            startTime: { $gte: startDateTime, $lte: endDateTime },
            status: { $in: ["PENDING", "CONFIRMED"] },
        });

        if (!isSlotAvailable(startDateTime, endDateTime, existingAppointments)) {
            return errorResponse("Time slot is not available", 409);
        }

        const appointment = await Appointment.create({
            doctor: doctorId,
            patient: user.id,
            startTime: startDateTime,
            endTime: endDateTime,
            mode: mode || "OFFLINE",
            notes,
            status: "PENDING",
        });

        const populatedAppointment = await Appointment.findById(appointment._id)
            .populate("doctor", "specialization consultationFee")
            .populate("patient", "name email phone");

        return successResponse(
            populatedAppointment,
            "Appointment booked successfully",
            201
        );
    } catch (error: any) {
        console.error("Book appointment error:", error);
        return errorResponse(error.message || "Failed to book appointment", 500);
    }
}

