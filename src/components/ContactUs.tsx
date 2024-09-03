"use client";
import Image from "next/image";
import React from "react";

const ContactUs: React.FC = () => {
    return (
        <div id="contact" className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Image Section */}
            <div>
                <Image
                    src="/contact-us.gif" // Replace with your image path
                    alt="Contact Us"
                    width={500}
                    height={400}
                    className="w-full h-auto rounded-lg shadow-lg"
                />
            </div>

            {/* Contact Information Section */}
            <div className="flex flex-col justify-center">
                <h2 className="text-center text-gray-600 text-2xl md:text-4xl mb-12 font-bold">Contact Us</h2>
                <p className="text-gray-700 mb-4">
                    Have questions or need assistance? Feel free to reach out to us via email. We’re here to help!
                </p>
                <a
                    href="mailto:info@digitalcowboy.com" // Replace with your actual email
                    className="text-white w-1/2 mx-auto bg-orange-600 px-6 py-3 rounded-lg text-lg font-semibold hover:bg-orange-700 transition duration-300 text-center"
                >
                    Email Us
                </a>
            </div>
        </div>
    );
};

export default ContactUs;
