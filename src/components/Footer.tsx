'use client';

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FaEnvelope, FaMapMarkerAlt, FaFacebookF, FaWhatsapp, FaLinkedin } from "react-icons/fa";

const Footer: React.FC = () => {
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

    return (
        <footer id="about" className="bg-gradient-to-r from-black via-gray-900 to-black text-white py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* About Us Section */}
                    <div>
                        <Image
                            src="/white-logo.png"
                            width={100}
                            height={30}
                            alt="digital cowboy log"
                            className="mb-4"
                        />
                        <p className="text-white text-opacity-80">
                            We wrangle pixels. We tame tech. We build websites that make you say yeeha!
                        </p>
                    </div>

                    {/* Quick Links Section */}
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Quick Links</h2>
                        <ul className="space-y-1 text-xs">
                            {["Home", "About", "Services", "Pricing", "Blog"].map((item) => (
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
                        <h2 className="text-2xl font-bold mb-4">Contact Info</h2>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start gap-2">
                                <FaEnvelope className="text-[#A1D9B0] mt-1" />
                                <a
                                    href="mailto:hello@digitalcowboy.com.au"
                                    className="hover:text-[#a2e4b4]"
                                >
                                    hello@digitalcowboy.com.au
                                </a>
                            </li>
                            <li className="flex items-start gap-2">
                                <FaMapMarkerAlt className="text-[#A1D9B0] mt-1" />
                                <span>
                                    Townsville, Queensland, Australia, 4810
                                </span>
                            </li>
                            <li className="flex gap-4 mt-4 text-lg">
                                <a href="https://web.facebook.com/profile.php?id=61565491041352" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                                    <FaFacebookF className="hover:text-[#a2e4b4]" />
                                </a>
                                <a href="https://www.linkedin.com/in/digitalcowboy-agency?fbclid=IwY2xjawKGJBpleHRuA2FlbQIxMABicmlkETFLT1Vqd2xkQ1Nzdm1JZHhkAR5L9kM8ejJ6HHyk7C1MnL2_e08kHgW4hicHyfIWvIsAf_zzDcBR2H6301xkcw_aem_eYzDN-8elAwkW3ELmztLWQ" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                                    <FaLinkedin className="hover:text-[#a2e4b4]" />
                                </a>
                                <a href="https://wa.me/+61427929500" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                                    <FaWhatsapp className="hover:text-[#a2e4b4]" />
                                </a>
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
