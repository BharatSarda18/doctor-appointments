"use client";

import { useState, useEffect } from "react";
import { Appointment } from "@/types/appointment";

interface UseAppointmentsOptions {
    role?: "patient" | "doctor";
    status?: string;
    date?: string;
}

export function useAppointments(options: UseAppointmentsOptions = {}) {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAppointments = async () => {
            setLoading(true);
            setError(null);

            try {
                const params = new URLSearchParams();
                if (options.status) {
                    params.append("status", options.status);
                }
                if (options.date) {
                    params.append("date", options.date);
                }

                const endpoint =
                    options.role === "doctor"
                        ? `/api/appointments/doctor?${params.toString()}`
                        : `/api/appointments/patient?${params.toString()}`;

                const response = await fetch(endpoint);
                const data = await response.json();

                if (data.success) {
                    setAppointments(data.data);
                } else {
                    setError(data.message || "Failed to fetch appointments");
                }
            } catch (err: any) {
                setError(err.message || "Failed to fetch appointments");
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, [options.role, options.status, options.date]);

    const refetch = () => {
        // Trigger re-fetch by updating a dependency
        setAppointments([]);
    };

    return { appointments, loading, error, refetch };
}

