"use client";
import React from "react";
import Link from "next/link";

const Footer: React.FC = () => {
    return (
        <footer className="bg-gradient-to-r from-gray-900 via-gray-700 to-orange-700 text-white py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* About Us Section */}
                    <div>
                        <h2 className="text-2xl font-bold mb-4">About Us</h2>
                        <p className="text-white text-opacity-80">
                            DigitalCowboy is a cutting-edge platform delivering innovative solutions to modern problems. We believe in harnessing technology to empower businesses and individuals.
                        </p>
                    </div>

                    {/* Quick Links Section */}
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Quick Links</h2>
                        <ul className="space-y-2">
                            {["Home", "About", "Services", "Blog", "Contact"].map((item) => (
                                <li key={item}>
                                    <Link href={`/${item.toLowerCase()}`}>
                                        <span className="text-white hover:text-orange-300 transition duration-300 ease-in-out cursor-pointer">
                                            {item}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info Section */}
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Contact Info</h2>
                        <ul className="space-y-2">
                            <li>
                                <span className="text-white text-opacity-80">Email: contact@digitalcowboy.com</span>
                            </li>
                            <li>
                                <span className="text-white text-opacity-80">Phone: +1 (123) 456-7890</span>
                            </li>
                            <li>
                                <span className="text-white text-opacity-80">Address: 123 Cowboy Lane, Tech City, TX</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 text-center text-white text-opacity-50">
                    &copy; {new Date().getFullYear()} DigitalCowboy. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
