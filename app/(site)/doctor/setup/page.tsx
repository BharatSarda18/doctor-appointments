"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Loader } from "@/components/ui/Loader";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const DAYS_OF_WEEK = [
    { value: "0", label: "Sunday" },
    { value: "1", label: "Monday" },
    { value: "2", label: "Tuesday" },
    { value: "3", label: "Wednesday" },
    { value: "4", label: "Thursday" },
    { value: "5", label: "Friday" },
    { value: "6", label: "Saturday" },
];

interface ScheduleDay {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    slotDurationMinutes: number;
}

export default function DoctorSetupPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [formData, setFormData] = useState({
        specialization: "",
        experienceYears: "",
        consultationFee: "",
        about: "",
        clinicName: "",
        clinicAddress: "",
        city: "",
        schedule: [] as ScheduleDay[],
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Redirect to login if not authenticated
        if (status === "unauthenticated") {
            router.push("/login?callbackUrl=/doctor/setup");
        }
        // Check if user is a doctor
        if (status === "authenticated" && session?.user) {
            const userRole = (session.user as any)?.role;
            if (userRole !== "DOCTOR") {
                router.push("/dashboard/patient");
            }
        }
    }, [status, session, router]);

    const addScheduleDay = () => {
        setFormData({
            ...formData,
            schedule: [
                ...formData.schedule,
                {
                    dayOfWeek: 1,
                    startTime: "09:00",
                    endTime: "17:00",
                    slotDurationMinutes: 30,
                },
            ],
        });
    };

    const updateScheduleDay = (index: number, field: keyof ScheduleDay, value: any) => {
        const updated = [...formData.schedule];
        updated[index] = { ...updated[index], [field]: value };
        setFormData({ ...formData, schedule: updated });
    };

    const removeScheduleDay = (index: number) => {
        setFormData({
            ...formData,
            schedule: formData.schedule.filter((_, i) => i !== index),
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (formData.schedule.length === 0) {
            setError("Please add at least one schedule day");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("/api/doctors", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    specialization: formData.specialization,
                    experienceYears: parseInt(formData.experienceYears),
                    consultationFee: parseFloat(formData.consultationFee),
                    about: formData.about || undefined,
                    clinicName: formData.clinicName || undefined,
                    clinicAddress: formData.clinicAddress || undefined,
                    city: formData.city,
                    schedule: formData.schedule,
                }),
            });

            const data = await response.json();

            if (data.success) {
                // Redirect to doctor dashboard after profile creation
                router.push("/dashboard/doctor");
            } else {
                setError(data.message || "Failed to create doctor profile");
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Show loading while checking authentication
    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader size="lg" />
            </div>
        );
    }

    // Don't render if not authenticated
    if (status === "unauthenticated" || !session) {
        return null;
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow py-8 px-4">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8">Complete Your Doctor Profile</h1>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <Card className="mb-6">
                            <CardHeader>
                                <CardTitle>Basic Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Input
                                    label="Specialization"
                                    required
                                    placeholder="e.g., Cardiologist, General Physician"
                                    value={formData.specialization}
                                    onChange={(e) =>
                                        setFormData({ ...formData, specialization: e.target.value })
                                    }
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input
                                        label="Years of Experience"
                                        type="number"
                                        min="0"
                                        required
                                        value={formData.experienceYears}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                experienceYears: e.target.value,
                                            })
                                        }
                                    />
                                    <Input
                                        label="Consultation Fee (₹)"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        required
                                        value={formData.consultationFee}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                consultationFee: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <Input
                                    label="City/Place"
                                    required
                                    placeholder="e.g., Mumbai, Delhi, Bangalore"
                                    value={formData.city}
                                    onChange={(e) =>
                                        setFormData({ ...formData, city: e.target.value })
                                    }
                                />
                                <Input
                                    label="Clinic Name"
                                    placeholder="Name of your clinic (optional)"
                                    value={formData.clinicName}
                                    onChange={(e) =>
                                        setFormData({ ...formData, clinicName: e.target.value })
                                    }
                                />
                                <Input
                                    label="Clinic Address"
                                    placeholder="Full address of your clinic (optional)"
                                    value={formData.clinicAddress}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            clinicAddress: e.target.value,
                                        })
                                    }
                                />
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        About
                                    </label>
                                    <textarea
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        rows={4}
                                        placeholder="Tell patients about yourself and your expertise..."
                                        value={formData.about}
                                        onChange={(e) =>
                                            setFormData({ ...formData, about: e.target.value })
                                        }
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="mb-6">
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <CardTitle>Weekly Schedule</CardTitle>
                                    <Button type="button" variant="outline" onClick={addScheduleDay}>
                                        Add Day
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {formData.schedule.length === 0 ? (
                                    <p className="text-gray-600 text-center py-4">
                                        No schedule days added. Click "Add Day" to get started.
                                    </p>
                                ) : (
                                    <div className="space-y-4">
                                        {formData.schedule.map((day, index) => (
                                            <div
                                                key={index}
                                                className="border border-gray-200 rounded-lg p-4"
                                            >
                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                    <Select
                                                        label="Day"
                                                        value={String(day.dayOfWeek)}
                                                        onChange={(e) =>
                                                            updateScheduleDay(
                                                                index,
                                                                "dayOfWeek",
                                                                parseInt(e.target.value)
                                                            )
                                                        }
                                                        options={DAYS_OF_WEEK}
                                                    />
                                                    <Input
                                                        label="Start Time"
                                                        type="time"
                                                        value={day.startTime}
                                                        onChange={(e) =>
                                                            updateScheduleDay(
                                                                index,
                                                                "startTime",
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                    <Input
                                                        label="End Time"
                                                        type="time"
                                                        value={day.endTime}
                                                        onChange={(e) =>
                                                            updateScheduleDay(
                                                                index,
                                                                "endTime",
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                    <div className="flex items-end">
                                                        <Input
                                                            label="Slot Duration (min)"
                                                            type="number"
                                                            min="15"
                                                            max="120"
                                                            step="15"
                                                            value={day.slotDurationMinutes}
                                                            onChange={(e) =>
                                                                updateScheduleDay(
                                                                    index,
                                                                    "slotDurationMinutes",
                                                                    parseInt(e.target.value)
                                                                )
                                                            }
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="danger"
                                                            size="sm"
                                                            className="ml-2"
                                                            onClick={() => removeScheduleDay(index)}
                                                        >
                                                            Remove
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <div className="flex justify-end space-x-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.push("/login")}
                            >
                                Skip for Now
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                isLoading={isLoading}
                                disabled={formData.schedule.length === 0}
                            >
                                Complete Profile
                            </Button>
                        </div>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
}

