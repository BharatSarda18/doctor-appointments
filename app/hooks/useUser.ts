"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { User } from "@/types/user";

export function useUser() {
    const { data: session, status } = useSession();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "loading") {
            setLoading(true);
            return;
        }

        if (status === "unauthenticated" || !session?.user) {
            setUser(null);
            setLoading(false);
            return;
        }

        // Fetch full user profile
        fetch("/api/users")
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setUser(data.data);
                }
            })
            .catch((error) => {
                console.error("Error fetching user:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [session, status]);

    return {
        user,
        session,
        loading,
        isAuthenticated: !!session?.user,
    };
}

