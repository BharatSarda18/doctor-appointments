export type UserRole = "PATIENT" | "DOCTOR" | "ADMIN";

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    phone?: string;
    createdAt: Date;
}

export interface CreateUserInput {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role?: UserRole;
}

