import { NextRequest } from "next/server";
import connectDB from "@/app/lib/db";
import Doctor from "@/app/models/Doctor";
import { successResponse, errorResponse, notFoundResponse } from "@/app/lib/responses";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await connectDB();

        const doctor = await Doctor.findById(id)
            .populate("user", "name email phone")
            .select("-__v");

        if (!doctor) {
            return notFoundResponse("Doctor not found");
        }

        return successResponse(doctor, "Doctor retrieved successfully");
    } catch (error: any) {
        console.error("Get doctor error:", error);
        return errorResponse(error.message || "Failed to retrieve doctor", 500);
    }
}

