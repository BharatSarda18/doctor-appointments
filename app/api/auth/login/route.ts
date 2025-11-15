import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/app/lib/responses";
import { loginSchema } from "@/utils/validators/authSchema";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validation = loginSchema.safeParse(body);

        if (!validation.success) {
            return errorResponse("Validation failed", 400, validation.error.flatten().fieldErrors);
        }

        // Note: Login is handled by NextAuth on the client side
        // This endpoint can be used for validation or custom login logic if needed
        return successResponse(
            { message: "Login credentials validated" },
            "Login credentials validated"
        );
    } catch (error: any) {
        console.error("Login error:", error);
        return errorResponse(error.message || "Login failed", 500);
    }
}

