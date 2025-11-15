"use client";

import React from "react";
import { TimeSlot } from "@/app/lib/slotGenerator";
import { Button } from "./ui/Button";
import { cn } from "@/utils/cn";

interface AppointmentSlotProps {
    slot: TimeSlot;
    onSelect?: (slot: TimeSlot) => void;
    selected?: boolean;
}

export const AppointmentSlot: React.FC<AppointmentSlotProps> = ({
    slot,
    onSelect,
    selected = false,
}) => {
    return (
        <button
            onClick={() => slot.available && onSelect?.(slot)}
            disabled={!slot.available}
            className={cn(
                "px-4 py-2 rounded-lg border-2 transition-colors text-sm font-medium",
                slot.available
                    ? selected
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-gray-300 bg-white text-gray-700 hover:border-blue-500 hover:bg-blue-50"
                    : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
            )}
        >
            {slot.startTime} - {slot.endTime}
        </button>
    );
};

