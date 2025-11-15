"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader } from "@/components/ui/Loader";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const [checkingProfile, setCheckingProfile] = useState(true);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
            return;
        }

        if (status === "authenticated" && session?.user) {
            const userRole = (session.user as any)?.role;
            
            // Check if doctor has a profile
            if (userRole === "DOCTOR" && pathname?.startsWith("/dashboard/doctor")) {
                checkDoctorProfile();
            } else {
                setCheckingProfile(false);
            }
        }
    }, [status, session, pathname, router]);

    const checkDoctorProfile = async () => {
        try {
            // Check if current user has a doctor profile
            const response = await fetch("/api/doctors?isApproved=false");
            const data = await response.json();
            
            if (data.success) {
                const user = session?.user as any;
                // Check if any doctor profile belongs to current user
                const hasProfile = data.data.some((doctor: any) => {
                    const doctorUserId = typeof doctor.user === "object" 
                        ? doctor.user._id?.toString() || doctor.user.id?.toString()
                        : doctor.user?.toString();
                    return doctorUserId === user.id;
                });
                
                if (!hasProfile && pathname !== "/doctor/setup" && !pathname?.includes("/doctor/setup")) {
                    router.push("/doctor/setup");
                }
            }
        } catch (error) {
            console.error("Error checking doctor profile:", error);
        } finally {
            setCheckingProfile(false);
        }
    };

    if (status === "loading" || checkingProfile) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader size="lg" />
            </div>
        );
    }

    if (!session) {
        return null;
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow py-8 px-4">{children}</main>
            <Footer />
        </div>
    );
}

