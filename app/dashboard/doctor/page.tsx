"use client";

import { useState } from "react";
import { useAppointments } from "@/app/hooks/useAppointments";
import { AppointmentCard } from "./components/AppointmentCard";
import { Loader } from "@/components/ui/Loader";
import { formatDateInput } from "@/utils/formatDate";
import { Input } from "@/components/ui/Input";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function DoctorDashboardPage() {
    const today = formatDateInput(new Date());
    const [selectedDate, setSelectedDate] = useState(today);
    const { appointments, loading, error } = useAppointments({
        role: "doctor",
        date: selectedDate,
    });

    const todayAppointments = appointments.filter((apt) => {
        const aptDate = new Date(apt.startTime).toDateString();
        const todayDate = new Date().toDateString();
        return aptDate === todayDate;
    });

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Doctor Dashboard</h1>
                <Link href="/dashboard/doctor/schedule">
                    <Button variant="primary">Manage Schedule</Button>
                </Link>
            </div>

            <div className="mb-6">
                <Input
                    label="View Appointments for Date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={formatDateInput(new Date())}
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
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">Today's Appointments</h2>
                        {todayAppointments.length === 0 ? (
                            <p className="text-gray-600">No appointments for today.</p>
                        ) : (
                            <div className="space-y-4">
                                {todayAppointments.map((appointment) => (
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
                        <h2 className="text-2xl font-semibold mb-4">
                            Appointments for {selectedDate}
                        </h2>
                        {appointments.length === 0 ? (
                            <p className="text-gray-600">No appointments for this date.</p>
                        ) : (
                            <div className="space-y-4">
                                {appointments.map((appointment) => (
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

