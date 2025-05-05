"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation"; // ✅ Import usePathname

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname(); // ✅ Get current route

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const getLink = (item: string) => {
        switch (item.toLowerCase()) {
            case "home":
                return "/";
            case "services":
                return `/#${item.toLowerCase()}`;
            case "about":
            case "pricing":
            case "blog":
                return `/${item.toLowerCase()}`;
            default:
                return "/";
        }
    };

    const isActive = (item: string) => {
        const link = getLink(item);
        return link === "/" ? pathname === "/" : pathname.startsWith(link);
    };

    return (
        <nav className="fixed z-50 w-full bg-black text-white">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/">
                            <Image
                                src="/white-logo.png"
                                width={80}
                                height={30}
                                alt="logo"
                                className="w-[100px]"
                            />
                        </Link>
                    </div>
                    <div className="hidden md:flex items-center">
                        <div className="ml-8 flex items-baseline space-x-4 lg:space-x-6">
                            {["Home", "About", "Services", "Pricing", "Blog"].map((item) => (
                                <Link
                                    key={item}
                                    href={getLink(item)}
                                    className={`relative px-4 py-2 rounded-lg text-lg md:text-base xl:text-lg font-semibold transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110 ${
                                        isActive(item)
                                            ? "text-[#A1D9B0]"
                                            : "text-white hover:text-[#A1D9B0]"
                                    }`}
                                >
                                    {item}
                                </Link>
                            ))}
                        </div>
                        <a href="mailto:hello@digitalcowboy.com.au"
                            className="lg:ml-6 bg-[#A1D9B0] text-white hover:bg-white hover:text-[#a2eeb7] px-2 py-1 rounded-lg text-lg md:text-base lg:text-lg font-semibold transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 hidden md:inline-block"
                        >
                            Contact Us
                        </a>
                    </div>
                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={toggleMenu}
                            className="text-[#A1D9B0] hover:text-[#a2eeb7] inline-flex items-center justify-center p-2 border-[#A1D9B0] border rounded-full focus:outline-none"
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
                    <div className="px-2 pt-2 pb-6 space-y-1 sm:px-3 bg-[#A1D9B0] shadow-lg">
                        {["Home", "About", "Services", "Pricing", "Blog"].map((item) => (
                            <Link
                                key={item}
                                onClick={() => setIsOpen(false)}
                                href={getLink(item)}
                                className={`block px-3 py-2 rounded-lg text-lg font-medium transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110 ${
                                    isActive(item)
                                        ? "bg-white text-[#A1D9B0]"
                                        : "text-white hover:bg-[#a2eeb7]"
                                }`}
                            >
                                {item}
                            </Link>
                        ))}
                        <a
                            onClick={() => setIsOpen(false)}
                            className="block w-fit bg-white text-[#A1D9B0] hover:bg-[#a2eeb7] hover:text-white px-4 py-2 rounded-lg text-lg font-semibold transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
                            href="mailto:hello@digitalcowboy.com.au"
                        >
                            Contact Us
                        </a>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
