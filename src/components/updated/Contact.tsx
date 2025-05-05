"use client";

import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaInstagram } from "react-icons/fa";

const Contact = () => {
    return (
        <section className="bg-black max-w-[2000px] mx-auto border border-white text-white py-12 px-6 md:px-8">
            <div className="flex flex-col md:flex-row items-center justify-center gap-12 mx-auto max-w-[1440px]">
                {/* Left section */}
                <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left max-w-lg">
                    <Link href="/">
                        <Image
                            src="/white-logo.png"
                            width={800}
                            height={400}
                            alt="logo"
                            className="w-[100px] mx-auto md:mx-0"
                        />
                    </Link>
                    <h2 className="mt-6 text-3xl font-semibold">
                        Innovate with us
                    </h2>
                    <p className="mt-4 text-lg text-gray-300">
                        Automate and simplify your business operations with easy and
                        secure solutions
                    </p>
                    <a href="mailto:hello@digitalcowboy.com.au" className="mt-6 border-2 border-red-400 text-yellow-300 font-bold py-3 px-6 hover:bg-red-600 transition">
                        START TODAY
                    </a>
                </div>

                {/* Right section */}
                <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
                    <Image
                        src="/mail-envelope.png"
                        alt="Envelope Graphic"
                        width={400}
                        height={400}
                        className="max-w-full h-auto"
                    />

                    {/* Contact Info */}
                    <div className="mt-6">
                        <p className="text-sm md:text-base">
                            EMAIL:{" "}
                            <a
                                href="mailto:hello@digitalcowboy.com.au"
                                className="underline"
                            >
                                HELLO@DIGITALCOWBOY.COM.AU
                            </a>
                        </p>
                        <div className="flex justify-center md:justify-start mt-2 gap-4 text-xl">
                            <a href="#" aria-label="Facebook">
                                <FaFacebookF />
                            </a>
                            <a href="#" aria-label="Instagram">
                                <FaInstagram />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
