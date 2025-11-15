import { NextRequest } from "next/server";
import connectDB from "@/app/lib/db";
import Doctor from "@/app/models/Doctor";
import { successResponse, errorResponse } from "@/app/lib/responses";
import { verifyAuth } from "@/app/lib/verifyUser";
import { createDoctorSchema } from "@/utils/validators/doctorSchema";

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const searchParams = request.nextUrl.searchParams;
        const specialization = searchParams.get("specialization");
        const city = searchParams.get("city");
        const isApproved = searchParams.get("isApproved");

        const query: any = {};
        if (specialization) query.specialization = new RegExp(specialization, "i");
        if (city) query.city = new RegExp(city, "i");
        // By default, show only approved doctors unless explicitly requested
        if (isApproved !== null && isApproved !== undefined) {
            query.isApproved = isApproved === "true";
        } else {
            query.isApproved = true; // Default to showing only approved doctors
        }

        const doctors = await Doctor.find(query)
            .populate("user", "name email phone")
            .select("-__v");

        return successResponse(doctors, "Doctors retrieved successfully");
    } catch (error: any) {
        console.error("Get doctors error:", error);
        return errorResponse(error.message || "Failed to retrieve doctors", 500);
    }
}

export async function POST(request: NextRequest) {
    try {
        const authResult = await verifyAuth(request);
        if ("error" in authResult) return authResult.error;

        const body = await request.json();
        const validation = createDoctorSchema.safeParse(body);

        if (!validation.success) {
            return errorResponse("Validation failed", 400, validation.error.flatten().fieldErrors);
        }

        await connectDB();

        const user = authResult.user as any;
        const existingDoctor = await Doctor.findOne({ user: user.id });

        if (existingDoctor) {
            return errorResponse("Doctor profile already exists", 409);
        }

        const doctor = await Doctor.create({
            user: user.id,
            ...validation.data,
        });

        const populatedDoctor = await Doctor.findById(doctor._id)
            .populate("user", "name email phone");

        return successResponse(
            populatedDoctor,
            "Doctor profile created successfully",
            201
        );
    } catch (error: any) {
        console.error("Create doctor error:", error);
        return errorResponse(error.message || "Failed to create doctor profile", 500);
    }
}

