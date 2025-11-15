import { NextRequest } from "next/server";
import connectDB from "@/app/lib/db";
import Doctor from "@/app/models/Doctor";
import Appointment from "@/app/models/Appointment";
import { successResponse, errorResponse, notFoundResponse } from "@/app/lib/responses";
import { generateTimeSlots } from "@/app/lib/slotGenerator";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const searchParams = request.nextUrl.searchParams;
        const dateParam = searchParams.get("date");

        if (!dateParam) {
            return errorResponse("Date parameter is required", 400);
        }

        const date = new Date(dateParam);
        if (isNaN(date.getTime())) {
            return errorResponse("Invalid date format", 400);
        }

        await connectDB();

        const doctor = await Doctor.findById(id);
        if (!doctor) {
            return notFoundResponse("Doctor not found");
        }

        if (!doctor.isApproved) {
            return errorResponse("Doctor profile is not approved", 403);
        }

        // Get existing appointments for this doctor on this date
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const existingAppointments = await Appointment.find({
            doctor: id,
            startTime: { $gte: startOfDay, $lte: endOfDay },
            status: { $in: ["PENDING", "CONFIRMED"] },
        }).select("startTime endTime");

        const slots = generateTimeSlots(
            doctor.schedule,
            date,
            existingAppointments,
            doctor.blockedDates
        );

        return successResponse(
            { slots, date: date.toISOString().split("T")[0] },
            "Slots retrieved successfully"
        );
    } catch (error: any) {
        console.error("Get slots error:", error);
        return errorResponse(error.message || "Failed to retrieve slots", 500);
    }
}

