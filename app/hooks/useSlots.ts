"use client";

import { useState, useEffect } from "react";
import { TimeSlot } from "@/app/lib/slotGenerator";

export function useSlots(doctorId: string | null, date: string | null) {
    const [slots, setSlots] = useState<TimeSlot[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!doctorId || !date) {
            setSlots([]);
            return;
        }

        const fetchSlots = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(
                    `/api/doctors/${doctorId}/slots?date=${date}`
                );
                const data = await response.json();

                if (data.success) {
                    setSlots(data.data.slots || []);
                } else {
                    setError(data.message || "Failed to fetch slots");
                    setSlots([]);
                }
            } catch (err: any) {
                setError(err.message || "Failed to fetch slots");
                setSlots([]);
            } finally {
                setLoading(false);
            }
        };

        fetchSlots();
    }, [doctorId, date]);

    return { slots, loading, error };
}

