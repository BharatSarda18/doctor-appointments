import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function AppointmentSuccessPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow flex items-center justify-center bg-gray-50 py-12 px-4">
                <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
                    <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                            className="w-8 h-8 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold mb-4">Appointment Booked Successfully!</h1>
                    <p className="text-gray-600 mb-6">
                        Your appointment has been confirmed. You will receive a confirmation email
                        shortly.
                    </p>
                    <div className="space-y-3">
                        <Link href="/dashboard/patient" className="block">
                            <Button variant="primary" className="w-full">
                                View My Appointments
                            </Button>
                        </Link>
                        <Link href="/doctors" className="block">
                            <Button variant="outline" className="w-full">
                                Book Another Appointment
                            </Button>
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

