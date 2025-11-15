export interface TimeSlot {
    startTime: string;
    endTime: string;
    available: boolean;
}

export interface ScheduleDay {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    slotDurationMinutes: number;
}

export function generateTimeSlots(
    schedule: ScheduleDay[],
    date: Date,
    existingAppointments: { startTime: Date; endTime: Date }[],
    blockedDates: Date[] = []
): TimeSlot[] {
    const dayOfWeek = date.getDay();
    const daySchedule = schedule.find((s) => s.dayOfWeek === dayOfWeek);

    if (!daySchedule) {
        return [];
    }

    // Check if date is blocked
    const isBlocked = blockedDates.some(
        (blockedDate) =>
            blockedDate.toDateString() === date.toDateString()
    );

    if (isBlocked) {
        return [];
    }

    const slots: TimeSlot[] = [];
    const [startHour, startMinute] = daySchedule.startTime
        .split(":")
        .map(Number);
    const [endHour, endMinute] = daySchedule.endTime.split(":").map(Number);

    const startDateTime = new Date(date);
    startDateTime.setHours(startHour, startMinute, 0, 0);

    const endDateTime = new Date(date);
    endDateTime.setHours(endHour, endMinute, 0, 0);

    let currentTime = new Date(startDateTime);

    while (currentTime < endDateTime) {
        const slotEndTime = new Date(
            currentTime.getTime() + daySchedule.slotDurationMinutes * 60000
        );

        if (slotEndTime > endDateTime) {
            break;
        }

        // Check if slot conflicts with existing appointments
        const isBooked = existingAppointments.some((apt) => {
            const aptStart = new Date(apt.startTime);
            const aptEnd = new Date(apt.endTime);
            return (
                (currentTime >= aptStart && currentTime < aptEnd) ||
                (slotEndTime > aptStart && slotEndTime <= aptEnd) ||
                (currentTime <= aptStart && slotEndTime >= aptEnd)
            );
        });

        slots.push({
            startTime: formatTime(currentTime),
            endTime: formatTime(slotEndTime),
            available: !isBooked,
        });

        currentTime = slotEndTime;
    }

    return slots;
}

function formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
}

export function isSlotAvailable(
    slotStart: Date,
    slotEnd: Date,
    existingAppointments: { startTime: Date; endTime: Date }[]
): boolean {
    return !existingAppointments.some((apt) => {
        const aptStart = new Date(apt.startTime);
        const aptEnd = new Date(apt.endTime);
        return (
            (slotStart >= aptStart && slotStart < aptEnd) ||
            (slotEnd > aptStart && slotEnd <= aptEnd) ||
            (slotStart <= aptStart && slotEnd >= aptEnd)
        );
    });
}

