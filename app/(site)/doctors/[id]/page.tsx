"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDoctor } from "@/app/hooks/useDoctors";
import { useSlots } from "@/app/hooks/useSlots";
import { AppointmentSlot } from "@/components/AppointmentSlot";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Loader } from "@/components/ui/Loader";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { formatDateInput } from "@/utils/formatDate";
import { TimeSlot } from "@/app/lib/slotGenerator";

export default function DoctorDetailPage() {
    const params = useParams();
    const router = useRouter();
    const doctorId = params.id as string;

    const [selectedDate, setSelectedDate] = useState(
        formatDateInput(new Date())
    );
    const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
    const [isBooking, setIsBooking] = useState(false);

    const { doctor, loading: doctorLoading, error: doctorError } = useDoctor(doctorId);
    const { slots, loading: slotsLoading } = useSlots(doctorId, selectedDate);

    const handleBookAppointment = async () => {
        if (!selectedSlot || !doctor) return;

        setIsBooking(true);
        try {
            const startTime = new Date(`${selectedDate}T${selectedSlot.startTime}`);
            const endTime = new Date(`${selectedDate}T${selectedSlot.endTime}`);

            const response = await fetch("/api/appointments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    doctorId: typeof doctor.id === "string" ? doctor.id : doctor._id,
                    startTime: startTime.toISOString(),
                    endTime: endTime.toISOString(),
                    mode: "OFFLINE",
                }),
            });

            const data = await response.json();

            if (data.success) {
                router.push("/appointment/success");
            } else {
                alert(data.message || "Failed to book appointment");
            }
        } catch (error) {
            alert("An error occurred. Please try again.");
        } finally {
            setIsBooking(false);
        }
    };

    if (doctorLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader size="lg" />
            </div>
        );
    }

    if (doctorError || !doctor) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Doctor not found</h1>
                    <Button onClick={() => router.push("/doctors")}>
                        Back to Doctors
                    </Button>
                </div>
            </div>
        );
    }

    const user = typeof doctor.user === "object" ? doctor.user : null;

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow py-8 px-4">
                <div className="max-w-4xl mx-auto">
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle className="text-2xl">
                                {user?.name || "Dr. Unknown"}
                            </CardTitle>
                            <p className="text-blue-600 font-medium text-lg">
                                {doctor.specialization}
                            </p>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {doctor.about && (
                                    <div>
                                        <h3 className="font-semibold mb-2">About</h3>
                                        <p className="text-gray-600">{doctor.about}</p>
                                    </div>
                                )}
                                <div className="grid grid-cols-2 gap-4">
                                    {doctor.clinicName && (
                                        <div>
                                            <span className="font-semibold">Clinic: </span>
                                            {doctor.clinicName}
                                        </div>
                                    )}
                                    {doctor.city && (
                                        <div>
                                            <span className="font-semibold">Location: </span>
                                            {doctor.city}
                                        </div>
                                    )}
                                    <div>
                                        <span className="font-semibold">Experience: </span>
                                        {doctor.experienceYears} years
                                    </div>
                                    <div>
                                        <span className="font-semibold">Fee: </span>
                                        ₹{doctor.consultationFee}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Book Appointment</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <Input
                                    label="Select Date"
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    min={formatDateInput(new Date())}
                                />

                                {slotsLoading ? (
                                    <Loader />
                                ) : slots.length === 0 ? (
                                    <p className="text-gray-600">
                                        No available slots for this date.
                                    </p>
                                ) : (
                                    <>
                                        <div>
                                            <h3 className="font-semibold mb-4">Available Slots</h3>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                {slots.map((slot, index) => (
                                                    <AppointmentSlot
                                                        key={index}
                                                        slot={slot}
                                                        selected={
                                                            selectedSlot?.startTime ===
                                                            slot.startTime
                                                        }
                                                        onSelect={setSelectedSlot}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        {selectedSlot && (
                                            <Button
                                                variant="primary"
                                                className="w-full"
                                                onClick={handleBookAppointment}
                                                isLoading={isBooking}
                                            >
                                                Book Appointment
                                            </Button>
                                        )}
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    );
}

