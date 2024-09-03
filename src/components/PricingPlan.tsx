"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const PricingPlan: React.FC = () => {
    useEffect(() => {
        AOS.init({
            duration: 2000, // You can customize the duration
        });
    }, []);
    const plans = [
        {
            title: "Basic Websites",
            description:
                "Designed with simplicity and functionality in mind. Affordable yet professional websites to showcase your products or services, connect with customers, and grow your brand.",
            price: "Starting at $500 + GST",
        },
        {
            title: "Advanced Websites",
            description:
                "Fully responsive custom websites made for medium-sized businesses seeking a robust online presence with advanced e-commerce capabilities.",
            price: "Starting at $2,500",
        },
        {
            title: "Enterprise Websites",
            description:
                "Websites designed and developed from the ground up, with custom-built features and integrations tailored to cater to the complex needs of enterprises, including CRM integration.",
            price: "Starting at $9,500",
        },
    ];

    const mode = ["flip-left", "zoom-in", "flip-right"];

    return (
        <div className="max-w-7xl mx-auto px-6 py-16">
            <h2 className="text-center text-gray-600 text-2xl md:text-4xl mb-12 font-bold">
                Our Pricing Plans
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {plans.map((plan, index) => (
                    <div
                        data-aos={mode[index]}
                        data-aos-easing="ease-out-cubic"
                        data-aos-duration="2000"
                        key={index}
                        className="relative bg-white shadow-lg rounded-lg p-8"
                    >
                        <h3 className="text-2xl font-semibold mb-4 text-center">
                            {plan.title}
                        </h3>
                        <p className="text-gray-700 mb-6 text-center">
                            {plan.description}
                        </p>
                        <p className="text-xl font-bold text-center text-blue-600 mb-6">
                            {plan.price}
                        </p>
                        <Link
                            href="/pricing"
                            className="absolute bottom-2 right-2 p-2 rounded-md font-semibold text-orange-500 hover:text-orange-600 hover:font-bold text-sm"
                        >
                            More Details
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PricingPlan;
