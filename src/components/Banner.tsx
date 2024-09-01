"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import AOS from 'aos';
import 'aos/dist/aos.css';

const Banner: React.FC = () => {
    useEffect(() => {
        AOS.init({
            duration: 2000, // You can customize the duration
        });
    }, []);

    return (
        <div className="relative h-screen w-full flex flex-col lg:flex-row" style={{ backgroundImage: "url('/bg1.gif')" }}>
            {/* Content Section */}
            <div data-aos="slide-up" className="flex-1 flex items-center justify-center p-4 text-center text-white">
                <div className="mt-20 md:mt-0">
                    <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold p-2 mb-4 text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-orange-600 animate__animated animate__fadeIn">
                        DigitalCowboy
                    </h1>
                    <p data-aos="slide-left" className="text-lg md:text-2xl font-light mb-8 animate__animated animate__fadeIn animate__delay-1s text-gray-800">
                    Digital Solutions with a Maverick’s Edge.
                    </p>
                    <Link href="/services">
                        <span className="inline-block bg-gradient-to-r from-orange-500 to-gray-400 text-white hover:from-orange-600 hover:to-gray-500 px-8 py-4 rounded-full text-lg font-semibold transition duration-300 ease-in-out cursor-pointer animate__animated animate__fadeIn animate__delay-2s">
                            Explore Our Services
                        </span>
                    </Link>
                </div>
            </div>

            {/* Image Section */}
            <div className="flex-1 relative m-8 rounded-lg">
                <div className="absolute inset-0 bg-cover bg-center"></div>
                <div className="absolute top-0 md:top-10 left-0 w-full h-[90%] bg-cover bg-center rounded-xl" style={{ backgroundImage: "url('/banner.gif')" }}></div>
            </div>
        </div>
    );
};

export default Banner;
