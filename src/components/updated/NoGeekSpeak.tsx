'use client';

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const NoGeekSpeak = () => {
  return (
    <section className="w-full min-h-[80vh] px-6 py-12 md:px-16 bg-white border border-black rounded-[2rem] relative overflow-hidden">
      {/* Subtle background animation */}
      <motion.div
        className="absolute top-0 right-0 w-96 h-96 bg-[#A1D9B0] opacity-5 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, -50, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="flex-1 flex flex-col md:flex-row justify-between gap-20 md:gap-10 relative z-10">
        {/* Left text */}
        <motion.div
          className="flex-1"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            className="text-4xl md:text-6xl font-semibold leading-tight text-black"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            No geek <br /> speak, just <br /> great sites
          </motion.h2>
        </motion.div>

        {/* Right content */}
        <motion.div
          className="flex-1 flex flex-col items-center justify-between text-center md:items-end md:text-right md:min-h-[60vh]"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Arrow image */}
          <motion.div
            className="w-60 h-20 md:w-80 md:h-30 relative mb-6"
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4, type: "spring" }}
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <Image
              src="/arrow.png"
              alt="Arrow"
              fill
              className="object-contain"
            />
          </motion.div>

          {/* Paragraph */}
          <div>
            <motion.p
              className="text-base md:text-lg text-black mb-4 max-w-md"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              We're a Townsville based team that builds beautiful, functional, 
              "OMG, is that really mine?!" websites without the techy blah blah.
            </motion.p>

            {/* Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Link
                href="/about"
                className="group relative inline-flex items-center gap-2 bg-black text-white font-bold py-3 px-6 hover:bg-gray-800 transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10">LEARN MORE</span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                <motion.div
                  className="absolute inset-0 bg-gray-800"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default NoGeekSpeak;
