import Link from "next/link";
import React from "react";

const Services = () => {
    return (
        <section id="services" className="bg-black min-h-[95vh] flex flex-col justify-center items-center text-white px-6 py-16 text-center">
            <h2 className="text-5xl sm:text-6xl font-bold text-rose-400 mb-16">
                SERVICES
            </h2>

            <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
                {/* Card 1 */}
                <div className="flex flex-col items-center gap-4">
                    <div className="w-40 h-40 rounded-full bg-pink-400"></div>
                    <h3 className="text-2xl font-semibold">Basic</h3>
                    <p className="max-w-xs">Perfect for startups & tradies.</p>
                </div>

                {/* Card 2 */}
                <div className="flex flex-col items-center gap-4">
                    <div className="w-40 h-40 rounded-full bg-cyan-700"></div>
                    <h3 className="text-2xl font-semibold">Custom</h3>
                    <p className="max-w-xs">
                        You dream it, we build it. Sell stuff. Book clients.
                        Easy.
                    </p>
                </div>

                {/* Card 3 */}
                <div className="flex flex-col sm:col-span-2 lg:col-span-1 items-center gap-4">
                    <div className="w-40 h-40 rounded-full bg-yellow-300"></div>
                    <h3 className="text-2xl font-semibold">APP</h3>
                    <p className="max-w-xs">
                        Fancy tech without the fancy price.
                    </p>
                </div>
            </div>

            {/* Explore Button */}
            <div className="mt-16">
                <Link href="/pricing" className="px-8 py-3 border-2 border-[#a2e4b4]  text-[#a2e4b4]  font-bold tracking-wide hover:bg-[#a2e4b4]  hover:text-black transition-all">
                    EXPLORE
                </Link>
            </div>
        </section>
    );
};

export default Services;
