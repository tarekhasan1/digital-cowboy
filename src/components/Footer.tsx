"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

const Footer: React.FC = () => {
    const getLink = (item: any) => {
        switch (item.toLowerCase()) {
            case "home":
                return "/";
            case "services":
            case "about":
            case "contact":
                return `/#${item.toLowerCase()}`;
            case "pricing":
            case "blog":
                return `/${item.toLowerCase()}`;
            default:
                return "/"; // Fallback for any unhandled items
        }
    };
    return (
        <footer id="about" className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-800 text-white py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* About Us Section */}
                    <div>
                        <Image
                            src="/logo.png"
                            width={100}
                            height={30}
                            alt="digital cowboy log"
                            className="text-2xl font-bold mb-4"
                        />
                        <p className="text-white text-opacity-80">
                            DigitalCowboy is a cutting-edge platform delivering
                            innovative solutions to modern problems. We believe
                            in harnessing technology to empower businesses and
                            individuals.
                        </p>
                    </div>

                    {/* Quick Links Section */}
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Quick Links</h2>
                        <ul className="space-y-1  text-xs">
                            {[
                                "Home",
                                "About",
                                "Services",
                                "Pricing",
                                "Blog",
                                "Contact",
                            ].map((item) => (
                                <li key={item}>
                                    <Link href={getLink(item)}>
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
                        <h2 className="text-2xl font-bold mb-4">
                            Contact Info
                        </h2>
                        <ul className="space-y-2">
                            <li>
                                <a
                                    href="mailto:hello@digitalcowboy.com.au"
                                    className="text-orange-300 hover:text-orange-400"
                                >
                                    <span className="text-white text-opacity-80">
                                        Email:
                                    </span>{" "}
                                    hello@digitalcowboy.com.au
                                </a>
                            </li>
                            <li>
                                <span className="text-white text-opacity-80">
                                    Address: Townsville, Queensland, Australia,
                                    4810
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 text-center text-white text-opacity-50">
                    &copy; {new Date().getFullYear()} DigitalCowboy. All rights
                    reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
