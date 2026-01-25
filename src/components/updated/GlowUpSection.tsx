'use client';

import Image from 'next/image';
import React from 'react';
import { motion } from 'framer-motion';
import { Wrench, Rocket, Briefcase } from 'lucide-react';

const GlowUpSection = () => {
  const sections = [
    {
      title: 'Tradies',
      description: "You're busy fixing, building, and getting the job done. Your website should do the same without the fluff. We build simple, lead generating tradie websites that make it easy for customers to find you, call you, and book you. No tech headaches, just more jobs in your calendar.",
      Icon: Wrench,
      delay: 0.1,
    },
    {
      title: 'Start Ups',
      description: "Got a brilliant business idea? Let's make sure your website looks like you've been doing this for years. Affordable, professional, and built to grow with you because first impressions matter, and DIY just won't cut it.",
      Icon: Rocket,
      delay: 0.2,
    },
    {
      title: 'Services',
      description: "Whether you're a hairdresser, consultant, or personal trainer, your website should be your best employee, taking bookings, answering FAQs, and making you money while you sleep. We build sleek, smart sites that automate your hustle so you can focus on what you do best.",
      Icon: Briefcase,
      delay: 0.3,
    },
  ];

  return (
    <section className="w-full min-h-[90vh] px-6 py-12 md:px-16 bg-white border border-black rounded-[2rem] relative overflow-hidden">
      {/* Background animation */}
      <motion.div
        className="absolute bottom-0 left-0 w-96 h-96 bg-[#A1D9B0] opacity-5 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, 50, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 relative z-10">
        {/* Left: Heading and Image */}
        <motion.div
          className="flex-1 text-center lg:text-left"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            className="text-5xl sm:text-6xl font-bold mb-8 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Ready for your <br className="hidden sm:inline" /> glow-up?
          </motion.h2>
          <motion.div
            className="mx-auto lg:mx-0 max-w-xs sm:max-w-md"
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4, type: "spring" }}
            whileHover={{ scale: 1.05, y: -10 }}
          >
            <Image
              src="/laptop.png"
              alt="Laptop illustration"
              width={500}
              height={400}
              className="w-full h-auto"
            />
          </motion.div>
        </motion.div>

        {/* Right: Descriptions */}
        <motion.div
          className="flex-1 space-y-12"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {sections.map((section, index) => {
            const IconComponent = section.Icon;
            return (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: section.delay }}
                whileHover={{ x: 10 }}
                className="group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <motion.div
                    className="text-[#A1D9B0] group-hover:text-[#8bc99f] transition-colors"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <IconComponent className="w-8 h-8" />
                  </motion.div>
                  <h3 className="text-2xl font-semibold">{section.title}</h3>
                </div>
                <p className="text-gray-800 ml-11">
                  {section.description}
                </p>
                {index < sections.length - 1 && (
                  <motion.hr
                    className="mt-4 border-black"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: section.delay + 0.3 }}
                  />
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default GlowUpSection;
