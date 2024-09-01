/* eslint-disable react/no-unescaped-entities */
import React from "react";

const AboutUs: React.FC = () => {
    return (
        <div className="mx-auto px-6 py-16">
            {/* Who We Are Section */}
            <div className="mb-16">
                <h2 className="text-center text-gray-600 text-2xl md:text-4xl mb-12 font-bold">Who We Are</h2>
                <p className="text-gray-700 text-lg text-center mx-auto mb-4">
                    <strong>Digital Cowboy</strong> is your strategic partner, dedicated to crafting digital solutions for ambitious enterprises. We understand that your website is the heart of your brand identity and marketing efforts. With years of experience, we excel at embedding your brand's essence into a standout online presence, addressing complex business challenges with innovative solutions.
                </p>
            </div>

            {/* What We Do Section */}
            <div>
                <h2 className="text-center text-gray-600 text-2xl md:text-4xl mb-12 font-bold">What We Do</h2>
                <p className="text-gray-700 text-lg text-center mx-auto">
                    At Digital Cowboy, we specialise in creating tailor-made digital products. With end-to-end support and expert guidance, we offer a comprehensive range of services, from transforming existing experiences to innovating new solutions.
                </p>
            </div>
        </div>
    );
};

export default AboutUs;
