import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/app/lib/db";
import User from "@/app/models/User";
import { successResponse, errorResponse } from "@/app/lib/responses";
import { registerSchema } from "@/utils/validators/authSchema";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validation = registerSchema.safeParse(body);

        if (!validation.success) {
            return errorResponse("Validation failed", 400, validation.error.flatten().fieldErrors);
        }

        const { name, email, password, phone, role } = validation.data;

        await connectDB();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return errorResponse("User with this email already exists", 409);
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            passwordHash,
            phone,
            role: role || "PATIENT",
        });

        return successResponse(
            {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            "User registered successfully",
            201
        );
    } catch (error: any) {
        console.error("Registration error:", error);
        return errorResponse(error.message || "Registration failed", 500);
    }
}

