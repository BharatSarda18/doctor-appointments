import { NextResponse } from "next/server";

export function successResponse<T>(data: T, message?: string, status = 200) {
    return NextResponse.json(
        {
            success: true,
            message: message || "Success",
            data,
        },
        { status }
    );
}

export function errorResponse(
    message: string,
    status = 400,
    errors?: Record<string, string[]>
) {
    return NextResponse.json(
        {
            success: false,
            message,
            ...(errors && { errors }),
        },
        { status }
    );
}

export function unauthorizedResponse(message = "Unauthorized") {
    return errorResponse(message, 401);
}

export function forbiddenResponse(message = "Forbidden") {
    return errorResponse(message, 403);
}

export function notFoundResponse(message = "Not found") {
    return errorResponse(message, 404);
}

export function serverErrorResponse(message = "Internal server error") {
    return errorResponse(message, 500);
}

