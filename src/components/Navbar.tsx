"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="fixed z-50 w-full bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Image src="/logo.png" width={100} height={40} alt="logo" className="w-[150px]"/>
                    </div>
                    <div className="hidden md:flex items-center">
                        <div className="ml-10 flex items-baseline space-x-6">
                            {["Home", "About", "Services", "Blog"].map(
                                (item) => (
                                    <Link
                                        className="relative text-black hover:text-orange-700 px-4 py-2 rounded-lg text-lg font-semibold transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
                                        key={item}
                                        href={`/${item.toLowerCase()}`}
                                    >
                                        {item}
                                    </Link>
                                )
                            )}
                        </div>
                        <Link
                            className="ml-6 bg-orange-700 text-white hover:bg-white hover:text-orange-700 px-4 py-2 rounded-lg text-lg font-semibold transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110 hidden md:inline-block"
                            href="/contact"
                        >
                            Contact Us
                        </Link>
                    </div>
                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={toggleMenu}
                            className="text-orange-700 hover:text-orange-800 inline-flex items-center justify-center p-2 border-orange-700 border rounded-full focus:outline-none"
                        >
                            <svg
                                className="h-6 w-6"
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                {isOpen ? (
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M18.364 5.636a1 1 0 0 1 1.415 1.415L13.414 13l6.365 6.364a1 1 0 0 1-1.415 1.415L12 14.414l-6.364 6.365a1 1 0 0 1-1.415-1.415L10.586 13 4.222 6.636a1 1 0 1 1 1.415-1.415L12 11.586l6.364-6.365z"
                                        fill="currentColor"
                                    />
                                ) : (
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M4 6h16M4 12h16m-7 6h7"
                                        fill="currentColor"
                                    />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-orange-700 shadow-lg">
                        {["Home", "About", "Services", "Blog"].map(
                            (item) => (
                                <Link
                                    onClick={() => setIsOpen(false)}
                                    className="block text-white hover:bg-orange-800 px-3 py-2 rounded-lg text-lg font-medium transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
                                    key={item}
                                    href={`/${item.toLowerCase()}`}
                                >
                                    {item}
                                </Link>
                            )
                        )}
                        <Link
                            onClick={() => setIsOpen(false)}
                            className="block bg-white text-orange-700 hover:bg-orange-800 hover:text-white px-4 py-2 rounded-lg text-lg font-semibold transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
                            href="/contact"
                        >
                            Contact Us
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
