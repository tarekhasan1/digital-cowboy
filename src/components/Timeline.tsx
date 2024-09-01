"use client"
import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const Timeline: React.FC = () => {
    useEffect(() => {
        AOS.init({
            duration: 2000, // You can customize the duration
        });
    }, []);
    return (
        <div className="max-w-4xl mx-auto px-4 py-8" style={{ backgroundImage: "url('/bg6.gif')" }}>
            <h1 className="text-center text-gray-600 text-2xl md:text-4xl mb-12 font-bold">Work Process</h1>
            <div className="relative">
                {/* Vertical Dashed Line */}
                <div
                    className="absolute left-1/2 transform -translate-x-1/2 w-px border-l-2 border-dashed border-gray-300"
                    style={{ top: "40px", bottom: "40px" }}
                ></div>

                {/* Step 1 - Left Side */}
                <div data-aos="slide-right" className="mb-8 flex items-center w-full">
                    <div className="w-1/2 pr-8 text-right">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            Project Scoping
                        </h3>
                        <p className="text-gray-600 text-xs md:text-base">
                            The process of defining the scope, goals, timeline,
                            and resources required for a new IT project or
                            service.
                        </p>
                    </div>
                    <div
                        className="relative max-w-[82px] sm:w-[70px] h-16 flex items-center justify-center bg-gradient-to-b from-blue-300 to-blue-600 text-white font-bold text-2xl rounded-full mx-auto"
                        style={{ aspectRatio: "1/1" }}
                    >
                        1
                    </div>
                    <div className="w-1/2"></div>
                </div>

                {/* Step 2 - Right Side */}
                <div data-aos="slide-left" data-aos-duration="4000" className="mb-8 flex items-center w-full">
                    <div className="w-1/2"></div>
                    <div
                        className="relative max-w-[82px] sm:w-[70px] h-16 flex items-center justify-center bg-gradient-to-b from-green-300 to-green-600 text-white font-bold text-2xl rounded-full mx-auto"
                        style={{ aspectRatio: "1/1" }}
                    >
                        2
                    </div>
                    <div className="w-1/2 pl-8 text-left">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            Planning and Design
                        </h3>
                        <p className="text-gray-600 text-xs md:text-base">
                            The process of designing the architecture, software,
                            and hardware required to implement the project or
                            service.
                        </p>
                    </div>
                </div>

                {/* Step 3 - Left Side */}
                <div data-aos="slide-right" data-aos-duration="6000" className="mb-8 flex items-center w-full">
                    <div className="w-1/2 pr-8 text-right">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            Development and Testing
                        </h3>
                        <p className="text-gray-600 text-xs md:text-base">
                            The process of coding, developing, and testing the
                            software and hardware components required for the
                            project or service.
                        </p>
                    </div>
                    <div
                        className="relative max-w-[82px] sm:w-[70px] h-16 flex items-center justify-center bg-gradient-to-b from-red-300 to-red-600 text-white font-bold text-2xl rounded-full mx-auto"
                        style={{ aspectRatio: "1/1" }}
                    >
                        3
                    </div>
                    <div className="w-1/2"></div>
                </div>

                {/* Step 4 - Right Side */}
                <div data-aos="slide-left" data-aos-duration="8000" className="flex items-center w-full">
                    <div className="w-1/2"></div>
                    <div
                        className="relative max-w-[82px] sm:w-[70px] h-16 flex items-center justify-center bg-gradient-to-b from-purple-300 to-purple-600 text-white font-bold text-2xl rounded-full mx-auto"
                        style={{ aspectRatio: "1/1" }}
                    >
                        4
                    </div>
                    <div className="w-1/2 pl-8 text-left">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            Maintenance and Support
                        </h3>
                        <p className="text-gray-600 text-xs md:text-base">
                            The ongoing process of maintaining and updating the
                            software and hardware components, providing
                            technical support.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Timeline;
