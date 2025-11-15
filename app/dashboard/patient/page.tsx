"use client";

import { useState } from "react";
import { useAppointments } from "@/app/hooks/useAppointments";
import { AppointmentCard } from "./components/AppointmentCard";
import { Loader } from "@/components/ui/Loader";
import { Select } from "@/components/ui/Select";

export default function PatientDashboardPage() {
    const [statusFilter, setStatusFilter] = useState("");
    const { appointments, loading, error } = useAppointments({
        role: "patient",
        status: statusFilter || undefined,
    });

    const upcomingAppointments = appointments.filter(
        (apt) => new Date(apt.startTime) >= new Date()
    );
    const pastAppointments = appointments.filter(
        (apt) => new Date(apt.startTime) < new Date()
    );

    return (
        <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">My Appointments</h1>

            <div className="mb-6">
                <Select
                    label="Filter by Status"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    options={[
                        { value: "", label: "All" },
                        { value: "PENDING", label: "Pending" },
                        { value: "CONFIRMED", label: "Confirmed" },
                        { value: "CANCELLED", label: "Cancelled" },
                        { value: "COMPLETED", label: "Completed" },
                    ]}
                />
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader size="lg" />
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            ) : (
                <>
                    <section className="mb-12">
                        <h2 className="text-2xl font-semibold mb-4">Upcoming Appointments</h2>
                        {upcomingAppointments.length === 0 ? (
                            <p className="text-gray-600">No upcoming appointments.</p>
                        ) : (
                            <div className="space-y-4">
                                {upcomingAppointments.map((appointment) => (
                                    <AppointmentCard
                                        key={
                                            typeof appointment.id === "string"
                                                ? appointment.id
                                                : appointment._id
                                        }
                                        appointment={appointment}
                                    />
                                ))}
                            </div>
                        )}
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">Past Appointments</h2>
                        {pastAppointments.length === 0 ? (
                            <p className="text-gray-600">No past appointments.</p>
                        ) : (
                            <div className="space-y-4">
                                {pastAppointments.map((appointment) => (
                                    <AppointmentCard
                                        key={
                                            typeof appointment.id === "string"
                                                ? appointment.id
                                                : appointment._id
                                        }
                                        appointment={appointment}
                                    />
                                ))}
                            </div>
                        )}
                    </section>
                </>
            )}
        </div>
    );
}

