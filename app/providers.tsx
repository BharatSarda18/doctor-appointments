"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            {children}
            <Toaster 
                position="top-right"
                toastOptions={{
                    success: {
                        style: {
                            background: '#22c55e',
                            color: 'white',
                        },
                        iconTheme: {
                            primary: 'white',
                            secondary: '#22c55e',
                        },
                    },
                    error: {
                        style: {
                            background: '#ef4444',
                            color: 'white',
                        },
                        iconTheme: {
                            primary: 'white',
                            secondary: '#ef4444',
                        },
                    },
                }}
            />
        </SessionProvider>
    );
}

