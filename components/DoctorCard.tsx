"use client";

import React from "react";
import Link from "next/link";
import { Doctor } from "@/types/doctor";
import { Card, CardContent } from "./ui/Card";
import { Button } from "./ui/Button";

interface DoctorCardProps {
    doctor: Doctor;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => {
    const user = typeof doctor.user === "object" ? doctor.user : null;

    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardContent>
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">
                            {user?.name || "Dr. Unknown"}
                        </h3>
                        <p className="text-blue-600 font-medium">{doctor.specialization}</p>
                    </div>
                    {doctor.isApproved && (
                        <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                            Verified
                        </span>
                    )}
                </div>

                {doctor.about && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {doctor.about}
                    </p>
                )}

                <div className="space-y-2 mb-4">
                    {doctor.clinicName && (
                        <p className="text-sm text-gray-600">
                            <span className="font-medium">Clinic:</span> {doctor.clinicName}
                        </p>
                    )}
                    {doctor.city && (
                        <p className="text-sm text-gray-600">
                            <span className="font-medium">Location:</span> {doctor.city}
                        </p>
                    )}
                    <p className="text-sm text-gray-600">
                        <span className="font-medium">Experience:</span> {doctor.experienceYears} years
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                        ₹{doctor.consultationFee} consultation fee
                    </p>
                </div>

                <Link href={`/doctors/${typeof doctor.id === "string" ? doctor.id : doctor._id}`}>
                    <Button variant="primary" className="w-full">
                        View Profile & Book
                    </Button>
                </Link>
            </CardContent>
        </Card>
    );
};

