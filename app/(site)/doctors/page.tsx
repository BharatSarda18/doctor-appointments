"use client";

import { useState } from "react";
import { useDoctors } from "@/app/hooks/useDoctors";
import { DoctorCard } from "@/components/DoctorCard";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Loader } from "@/components/ui/Loader";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function DoctorsPage() {
    const [specialization, setSpecialization] = useState("");
    const [city, setCity] = useState("");
    const { doctors, loading, error } = useDoctors({
        specialization: specialization || undefined,
        city: city || undefined,
        isApproved: true,
    });

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow py-8 px-4">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8">Find Doctors</h1>

                    {/* Filters */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Specialization"
                                placeholder="e.g., Cardiologist"
                                value={specialization}
                                onChange={(e) => setSpecialization(e.target.value)}
                            />
                            <Input
                                label="City"
                                placeholder="e.g., Mumbai"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Doctors List */}
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <Loader size="lg" />
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    ) : doctors.length === 0 ? (
                        <div className="text-center py-12 text-gray-600">
                            No doctors found. Try adjusting your filters.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {doctors.map((doctor) => (
                                <DoctorCard
                                    key={typeof doctor.id === "string" ? doctor.id : doctor._id}
                                    doctor={doctor}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}

