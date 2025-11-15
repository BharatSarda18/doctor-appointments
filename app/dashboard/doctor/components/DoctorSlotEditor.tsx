"use client";

import React, { useState } from "react";
import { ScheduleDay } from "@/types/doctor";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

interface DoctorSlotEditorProps {
    schedule: ScheduleDay[];
    onUpdate: (schedule: ScheduleDay[]) => void;
}

const DAYS_OF_WEEK = [
    { value: "0", label: "Sunday" },
    { value: "1", label: "Monday" },
    { value: "2", label: "Tuesday" },
    { value: "3", label: "Wednesday" },
    { value: "4", label: "Thursday" },
    { value: "5", label: "Friday" },
    { value: "6", label: "Saturday" },
];

export const DoctorSlotEditor: React.FC<DoctorSlotEditorProps> = ({
    schedule,
    onUpdate,
}) => {
    const addDay = () => {
        onUpdate([
            ...schedule,
            {
                dayOfWeek: 1,
                startTime: "09:00",
                endTime: "17:00",
                slotDurationMinutes: 30,
            },
        ]);
    };

    const updateDay = (index: number, field: keyof ScheduleDay, value: any) => {
        const updated = [...schedule];
        updated[index] = { ...updated[index], [field]: value };
        onUpdate(updated);
    };

    const removeDay = (index: number) => {
        onUpdate(schedule.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-4">
            {schedule.map((day, index) => (
                <Card key={index}>
                    <CardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <Select
                                label="Day"
                                value={String(day.dayOfWeek)}
                                onChange={(e) =>
                                    updateDay(index, "dayOfWeek", parseInt(e.target.value))
                                }
                                options={DAYS_OF_WEEK}
                            />
                            <Input
                                label="Start Time"
                                type="time"
                                value={day.startTime}
                                onChange={(e) =>
                                    updateDay(index, "startTime", e.target.value)
                                }
                            />
                            <Input
                                label="End Time"
                                type="time"
                                value={day.endTime}
                                onChange={(e) =>
                                    updateDay(index, "endTime", e.target.value)
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
                                        updateDay(
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
                                    onClick={() => removeDay(index)}
                                >
                                    Remove
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
            <Button variant="outline" onClick={addDay} className="w-full">
                Add Day
            </Button>
        </div>
    );
};

