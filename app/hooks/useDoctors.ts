"use client";

import { useState, useEffect } from "react";
import { Doctor } from "@/types/doctor";

interface UseDoctorsOptions {
    specialization?: string;
    city?: string;
    isApproved?: boolean;
}

export function useDoctors(options: UseDoctorsOptions = {}) {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDoctors = async () => {
            setLoading(true);
            setError(null);

            try {
                const params = new URLSearchParams();
                if (options.specialization) {
                    params.append("specialization", options.specialization);
                }
                if (options.city) {
                    params.append("city", options.city);
                }
                if (options.isApproved !== undefined) {
                    params.append("isApproved", String(options.isApproved));
                }

                const response = await fetch(`/api/doctors?${params.toString()}`);
                const data = await response.json();

                if (data.success) {
                    setDoctors(data.data);
                } else {
                    setError(data.message || "Failed to fetch doctors");
                }
            } catch (err: any) {
                setError(err.message || "Failed to fetch doctors");
            } finally {
                setLoading(false);
            }
        };

        fetchDoctors();
    }, [options.specialization, options.city, options.isApproved]);

    return { doctors, loading, error, refetch: () => {} };
}

export function useDoctor(id: string | null) {
    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) {
            setLoading(false);
            return;
        }

        const fetchDoctor = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`/api/doctors/${id}`);
                const data = await response.json();

                if (data.success) {
                    setDoctor(data.data);
                } else {
                    setError(data.message || "Failed to fetch doctor");
                }
            } catch (err: any) {
                setError(err.message || "Failed to fetch doctor");
            } finally {
                setLoading(false);
            }
        };

        fetchDoctor();
    }, [id]);

    return { doctor, loading, error };
}

