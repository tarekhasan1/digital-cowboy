"use client";
import React from "react";

const StatsSection: React.FC = () => {
    return (
        <div className="max-w-6xl mx-auto py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center px-4">
            {/* 100% Client Satisfaction */}
            <div className="p-6 bg-gradient-to-b from-green-300 to-green-600 text-white rounded-lg shadow-lg">
                <div className="text-5xl font-bold mb-2">100%</div>
                <h3 className="text-lg font-semibold">Client Satisfaction</h3>
                <p className="mt-2 text-sm">
                    We pride ourselves on delivering exceptional services with every project.
                </p>
            </div>

            {/* 50+ Successful Projects */}
            <div className="p-6 bg-gradient-to-b from-blue-300 to-blue-600 text-white rounded-lg shadow-lg">
                <div className="text-5xl font-bold mb-2">50+</div>
                <h3 className="text-lg font-semibold">Successful Projects</h3>
                <p className="mt-2 text-sm">
                    With over 50 projects completed, we have a proven track record of success.
                </p>
            </div>

            {/* 3+ Years of Experience */}
            <div className="p-6 bg-gradient-to-b from-yellow-300 to-yellow-600 text-white rounded-lg shadow-lg">
                <div className="text-5xl font-bold mb-2">3+</div>
                <h3 className="text-lg font-semibold">Years of Experience</h3>
                <p className="mt-2 text-sm">
                    Our team has more than 3 years of industry experience in delivering top-quality solutions.
                </p>
            </div>

            {/* 24/7 Customer Support */}
            <div className="p-6 bg-gradient-to-b from-purple-300 to-purple-600 text-white rounded-lg shadow-lg">
                <div className="text-5xl font-bold mb-2">24/7</div>
                <h3 className="text-lg font-semibold">Customer Support</h3>
                <p className="mt-2 text-sm">
                    We provide around-the-clock support to ensure your satisfaction.
                </p>
            </div>
        </div>
    );
};

export default StatsSection;
