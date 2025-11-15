import { NextRequest } from "next/server";
import connectDB from "@/app/lib/db";
import Appointment from "@/app/models/Appointment";
import Doctor from "@/app/models/Doctor";
import { successResponse, errorResponse } from "@/app/lib/responses";
import { verifyDoctor } from "@/app/lib/verifyUser";

export async function GET(request: NextRequest) {
    try {
        const authResult = await verifyDoctor(request);
        if ("error" in authResult) return authResult.error;

        await connectDB();

        const user = authResult.user as any;
        const doctor = await Doctor.findOne({ user: user.id });

        if (!doctor) {
            return errorResponse("Doctor profile not found", 404);
        }

        const searchParams = request.nextUrl.searchParams;
        const status = searchParams.get("status");
        const date = searchParams.get("date");

        const query: any = { doctor: doctor._id };
        if (status) {
            query.status = status;
        }
        if (date) {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);
            query.startTime = { $gte: startOfDay, $lte: endOfDay };
        }

        const appointments = await Appointment.find(query)
            .populate("doctor", "specialization consultationFee")
            .populate("patient", "name email phone")
            .sort({ startTime: 1 })
            .select("-__v");

        return successResponse(appointments, "Appointments retrieved successfully");
    } catch (error: any) {
        console.error("Get doctor appointments error:", error);
        return errorResponse(error.message || "Failed to retrieve appointments", 500);
    }
}

