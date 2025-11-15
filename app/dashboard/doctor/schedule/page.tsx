"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Loader } from "@/components/ui/Loader";
import { ScheduleDay } from "@/types/doctor";

const DAYS_OF_WEEK = [
    { value: "0", label: "Sunday" },
    { value: "1", label: "Monday" },
    { value: "2", label: "Tuesday" },
    { value: "3", label: "Wednesday" },
    { value: "4", label: "Thursday" },
    { value: "5", label: "Friday" },
    { value: "6", label: "Saturday" },
];

export default function DoctorSchedulePage() {
    const router = useRouter();
    const [schedule, setSchedule] = useState<ScheduleDay[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const addScheduleDay = () => {
        setSchedule([
            ...schedule,
            {
                dayOfWeek: 1,
                startTime: "09:00",
                endTime: "17:00",
                slotDurationMinutes: 30,
            },
        ]);
    };

    const updateScheduleDay = (index: number, field: keyof ScheduleDay, value: any) => {
        const updated = [...schedule];
        updated[index] = { ...updated[index], [field]: value };
        setSchedule(updated);
    };

    const removeScheduleDay = (index: number) => {
        setSchedule(schedule.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // This would typically update the doctor's schedule via API
            // For now, we'll just show a success message
            alert("Schedule saved successfully!");
            router.push("/dashboard/doctor");
        } catch (error) {
            alert("Failed to save schedule");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Manage Schedule</h1>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Weekly Schedule</CardTitle>
                        <Button variant="primary" onClick={addScheduleDay}>
                            Add Day
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {schedule.length === 0 ? (
                        <p className="text-gray-600 text-center py-8">
                            No schedule days added. Click "Add Day" to get started.
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {schedule.map((day, index) => (
                                <Card key={index}>
                                    <CardContent className="p-4">
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
                                                    variant="danger"
                                                    size="sm"
                                                    className="ml-2"
                                                    onClick={() => removeScheduleDay(index)}
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    <div className="mt-6 flex justify-end space-x-4">
                        <Button variant="outline" onClick={() => router.back()}>
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleSave}
                            isLoading={saving}
                            disabled={schedule.length === 0}
                        >
                            Save Schedule
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

