import { NextRequest } from "next/server";
import connectDB from "@/app/lib/db";
import User from "@/app/models/User";
import { successResponse, errorResponse } from "@/app/lib/responses";
import { verifyAuth } from "@/app/lib/verifyUser";

export async function GET(request: NextRequest) {
    try {
        const authResult = await verifyAuth(request);
        if ("error" in authResult) return authResult.error;

        await connectDB();

        const user = authResult.user as any;
        const userDoc = await User.findById(user.id).select("-passwordHash -__v");

        if (!userDoc) {
            return errorResponse("User not found", 404);
        }

        return successResponse(userDoc, "User profile retrieved successfully");
    } catch (error: any) {
        console.error("Get user error:", error);
        return errorResponse(error.message || "Failed to retrieve user profile", 500);
    }
}

