'use client';

import Image from "next/image";
import Link from "next/link";

const About = () => {
    return (
        <main className="bg-black text-white px-6 py-16 md:px-12 mx-auto">
            {/* Header */}
            <section className="text-center max-w-3xl mx-auto mb-16 mt-[40px]">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#a2e4b4]">
                    About Us
                </h1>
                <p className="text-lg md:text-xl text-gray-300">
                    We build websites that work hard and look great, from smart, sleek economy sites to bougie custom builds with all the digital bells and whistles.
                </p>
            </section>

            {/* Body Content */}
            <section className="max-w-7xl mx-auto text-gray-300 space-y-8 text-lg leading-relaxed">
                <p>
                    At <span className="text-white font-semibold">Digital Cowboy</span>, we’re all about making the web feel simple (even when it’s not). Whether you’re launching a side hustle or need something sleek and powerful for your growing business, we’ve got a solution that fits.
                </p>
                <p>
                    Need a basic-but-beautiful online presence? <span className="text-white font-semibold">We got you.</span>
                </p>
                <p>
                    We keep things <span className="text-white font-semibold">human, helpful</span>, and zero jargon.
                </p>
                <p>
                    So whether you’re a small biz, a big dreamer, or a startup with sass, we’ll help you show up online like a total boss.
                </p>
                <p className="text-[#a2e4b4] font-semibold text-2xl">
                    Saddle up and let’s make something clever, clean, and custom — just like your brand deserves.
                </p>
            </section>

            {/* Contact Section */}
            <section className="mt-24 border-t border-gray-700 pt-12 flex flex-col md:flex-row justify-center items-center gap-12 mx-auto max-w-7xl">
                {/* Logo and Call to Action */}
                <div className="text-center md:text-left md:w-1/2">
                    <Link href="/">
                        <Image
                            src="/white-logo.png"
                            width={100}
                            height={50}
                            alt="Digital Cowboy Logo"
                            className="mx-auto md:mx-0 mb-6"
                        />
                    </Link>
                    <h3 className="text-2xl font-semibold mb-4">Let’s build something smart.</h3>
                    <p className="text-gray-400 mb-6">
                        Automate and simplify your business operations with easy and secure solutions.
                    </p>
                    <a href="mailto:hello@digitalcowboy.com.au" className="border-2 border-[#a2e4b4] text-[#a1e4b4]font-bold py-3 px-6 hover:bg-[#a2e4b4]  hover:text-black transition mt-4">
                        START TODAY
                    </a>
                </div>

                {/* Contact Info */}
                <div className="flex flex-col items-end text-center md:text-left md:w-1/2">
                    <Image
                        src="/mail-envelope.png"
                        alt="Envelope Graphic"
                        width={300}
                        height={300}
                        className="mx-auto md:mx-0 mb-6"
                    />
                    <p className="text-sm md:text-base">
                        EMAIL:{" "}
                        <a
                            href="mailto:hello@digitalcowboy.com.au"
                            className="underline text-white"
                        >
                            HELLO@DIGITALCOWBOY.COM.AU
                        </a>
                    </p>
                </div>
            </section>
        </main>
    );
};

export default About;
