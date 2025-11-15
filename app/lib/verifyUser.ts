import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { unauthorizedResponse, forbiddenResponse } from "./responses";

export async function verifyAuth(request: NextRequest): Promise<
    | { error: ReturnType<typeof unauthorizedResponse>; user?: never }
    | { user: any; error?: never }
> {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
        return { error: unauthorizedResponse("Authentication required") };
    }

    return { user: session.user };
}

export async function verifyRole(
    request: NextRequest,
    allowedRoles: string[]
): Promise<
    | { error: ReturnType<typeof unauthorizedResponse | typeof forbiddenResponse>; user?: never }
    | { user: any; error?: never }
> {
    const authResult = await verifyAuth(request);
    
    if ("error" in authResult) {
        return authResult;
    }

    const userRole = (authResult.user as any)?.role;
    
    if (!allowedRoles.includes(userRole)) {
        return { error: forbiddenResponse("Insufficient permissions") };
    }

    return { user: authResult.user };
}

export async function verifyPatient(request: NextRequest) {
    return verifyRole(request, ["PATIENT"]);
}

export async function verifyDoctor(request: NextRequest) {
    return verifyRole(request, ["DOCTOR"]);
}

export async function verifyAdmin(request: NextRequest) {
    return verifyRole(request, ["ADMIN"]);
}

