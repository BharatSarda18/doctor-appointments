import React from "react";
import Link from "next/link";

export const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-800 text-white mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold mb-4">DoctorApp</h3>
                        <p className="text-gray-400">
                            Your trusted platform for booking doctor appointments online.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-md font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li>
                                <Link href="/doctors" className="hover:text-white">
                                    Find Doctors
                                </Link>
                            </li>
                            <li>
                                <Link href="/register" className="hover:text-white">
                                    Register
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-md font-semibold mb-4">Contact</h4>
                        <p className="text-gray-400">
                            Email: support@doctorapp.com
                            <br />
                            Phone: +1 (555) 123-4567
                        </p>
                    </div>
                </div>
                <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
                    <p>&copy; {new Date().getFullYear()} DoctorApp. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

