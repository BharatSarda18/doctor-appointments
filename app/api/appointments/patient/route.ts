import { NextRequest } from "next/server";
import connectDB from "@/app/lib/db";
import Appointment from "@/app/models/Appointment";
import { successResponse, errorResponse } from "@/app/lib/responses";
import { verifyPatient } from "@/app/lib/verifyUser";

export async function GET(request: NextRequest) {
    try {
        const authResult = await verifyPatient(request);
        if ("error" in authResult) return authResult.error;

        await connectDB();

        const user = authResult.user as any;
        const searchParams = request.nextUrl.searchParams;
        const status = searchParams.get("status");

        const query: any = { patient: user.id };
        if (status) {
            query.status = status;
        }

        const appointments = await Appointment.find(query)
            .populate("doctor", "specialization consultationFee")
            .populate("patient", "name email phone")
            .sort({ startTime: -1 })
            .select("-__v");

        return successResponse(appointments, "Appointments retrieved successfully");
    } catch (error: any) {
        console.error("Get patient appointments error:", error);
        return errorResponse(error.message || "Failed to retrieve appointments", 500);
    }
}

