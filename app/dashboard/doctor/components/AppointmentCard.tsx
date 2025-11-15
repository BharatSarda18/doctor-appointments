"use client";

import React from "react";
import { Appointment } from "@/types/appointment";
import { Card, CardContent } from "@/components/ui/Card";
import { formatDate } from "@/utils/formatDate";
import { formatTimeRange } from "@/utils/formatTime";

interface AppointmentCardProps {
    appointment: Appointment;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment }) => {
    const patient = typeof appointment.patient === "object" ? appointment.patient : null;

    const statusColors = {
        PENDING: "bg-yellow-100 text-yellow-800",
        CONFIRMED: "bg-green-100 text-green-800",
        CANCELLED: "bg-red-100 text-red-800",
        COMPLETED: "bg-blue-100 text-blue-800",
    };

    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-xl font-semibold mb-1">
                            {patient?.name || "Unknown Patient"}
                        </h3>
                        <p className="text-gray-600">{patient?.email}</p>
                        {patient?.phone && (
                            <p className="text-gray-600">Phone: {patient.phone}</p>
                        )}
                    </div>
                    <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            statusColors[appointment.status]
                        }`}
                    >
                        {appointment.status}
                    </span>
                </div>

                <div className="space-y-2 text-gray-600">
                    <p>
                        <span className="font-medium">Date:</span> {formatDate(appointment.startTime)}
                    </p>
                    <p>
                        <span className="font-medium">Time:</span>{" "}
                        {formatTimeRange(appointment.startTime, appointment.endTime)}
                    </p>
                    <p>
                        <span className="font-medium">Mode:</span> {appointment.mode}
                    </p>
                    {appointment.notes && (
                        <p>
                            <span className="font-medium">Notes:</span> {appointment.notes}
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

