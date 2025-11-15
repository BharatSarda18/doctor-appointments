"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "./ui/Button";

export const Navbar: React.FC = () => {
    const { data: session, status } = useSession();

    return (
        <nav className="bg-white shadow-md border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <Link href="/" className="text-xl font-bold text-blue-600">
                            DoctorApp
                        </Link>
                        <div className="ml-10 flex space-x-4">
                            <Link
                                href="/doctors"
                                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Doctors
                            </Link>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        {status === "loading" ? (
                            <div className="text-gray-500">Loading...</div>
                        ) : session?.user ? (
                            <>
                                <Link
                                    href={
                                        (session.user as any).role === "DOCTOR"
                                            ? "/dashboard/doctor"
                                            : "/dashboard/patient"
                                    }
                                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Dashboard
                                </Link>
                                <span className="text-gray-700 text-sm">
                                    {session.user.name}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => signOut()}
                                >
                                    Sign Out
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link href="/login">
                                    <Button variant="ghost" size="sm">
                                        Login
                                    </Button>
                                </Link>
                                <Link href="/register">
                                    <Button variant="primary" size="sm">
                                        Register
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

