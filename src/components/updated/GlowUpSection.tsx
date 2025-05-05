/* eslint-disable react/no-unescaped-entities */
'use client';

import Image from 'next/image';
import React from 'react';

const GlowUpSection = () => {
  return (
    <section className="w-full  min-h-[90vh] px-6 py-12 md:px-16 bg-white border border-black rounded-[2rem]">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        {/* Left: Heading and Image */}
        <div className="flex-1 text-center lg:text-left">
          <h2 className="text-5xl sm:text-6xl font-bold mb-8 leading-tight">
            Ready for your <br className="hidden sm:inline" /> glow-up?
          </h2>
          <div className="mx-auto lg:mx-0 max-w-xs sm:max-w-md">
            <Image
              src="/laptop.png" // <-- Replace with your actual image path
              alt="Laptop illustration"
              width={500}
              height={400}
              className="w-full h-auto"
            />
          </div>
        </div>

        {/* Right: Descriptions */}
        <div className="flex-1 space-y-12">
          <div>
            <h3 className="text-2xl font-semibold mb-2">Tradies</h3>
            <p className="text-gray-800">
              You’re busy fixing, building, and getting the job done. Your website should do the same without the fluff. We build simple, lead generating tradie websites that make it easy for customers to find you, call you, and book you. No tech headaches, just more jobs in your calendar.
            </p>
            <hr className="mt-4 border-black" />
          </div>

          <div>
            <h3 className="text-2xl font-semibold mb-2">Start Ups</h3>
            <p className="text-gray-800">
              Got a brilliant business idea? Let’s make sure your website looks like you’ve been doing this for years. Affordable, professional, and built to grow with you because first impressions matter, and DIY just won’t cut it.
            </p>
            <hr className="mt-4 border-black" />
          </div>

          <div>
            <h3 className="text-2xl font-semibold mb-2">Services</h3>
            <p className="text-gray-800">
              Whether you're a hairdresser, consultant, or personal trainer, your website should be your best employee, taking bookings, answering FAQs, and making you money while you sleep. We build sleek, smart sites that automate your hustle so you can focus on what you do best.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GlowUpSection;
