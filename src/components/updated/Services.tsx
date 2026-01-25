'use client';

import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Zap, Code } from "lucide-react";

const Services = () => {
    const services = [
        {
            title: "Basic",
            description: "Perfect for startups & tradies.",
            icon: <Sparkles className="w-16 h-16" />,
            color: "bg-pink-400",
            hoverColor: "hover:bg-pink-500",
            delay: 0.1,
        },
        {
            title: "Custom",
            description: "You dream it, we build it. Sell stuff. Book clients. Easy.",
            icon: <Code className="w-16 h-16" />,
            color: "bg-cyan-700",
            hoverColor: "hover:bg-cyan-800",
            delay: 0.2,
        },
        {
            title: "APP",
            description: "Fancy tech without the fancy price.",
            icon: <Zap className="w-16 h-16" />,
            color: "bg-yellow-300",
            hoverColor: "hover:bg-yellow-400",
            delay: 0.3,
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 50, scale: 0.9 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15,
            },
        },
    };

    return (
        <section id="services" className="bg-black min-h-[95vh] flex flex-col justify-center items-center text-white px-6 py-16 text-center relative overflow-hidden">
            {/* Background gradient effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute top-0 left-1/4 w-96 h-96 bg-rose-400 opacity-5 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        x: [0, 100, 0],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
                <motion.div
                    className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-700 opacity-5 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        x: [0, -100, 0],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            </div>

            <motion.h2
                className="text-5xl sm:text-6xl md:text-7xl font-bold text-rose-400 mb-16 relative z-10"
                initial={{ opacity: 0, y: -30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                SERVICES
            </motion.h2>

            <motion.div
                className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto relative z-10"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
            >
                {services.map((service, index) => (
                    <motion.div
                        key={index}
                        className="flex flex-col items-center gap-6 group"
                        variants={cardVariants}
                        whileHover={{ y: -10 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <motion.div
                            className={`w-40 h-40 rounded-full ${service.color} ${service.hoverColor} flex items-center justify-center text-white transition-all duration-300 shadow-lg group-hover:shadow-2xl group-hover:scale-110`}
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.6 }}
                        >
                            {service.icon}
                        </motion.div>
                        <motion.h3
                            className="text-2xl font-semibold"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: service.delay + 0.3 }}
                        >
                            {service.title}
                        </motion.h3>
                        <motion.p
                            className="max-w-xs text-gray-300"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: service.delay + 0.4 }}
                        >
                            {service.description}
                        </motion.p>
                    </motion.div>
                ))}
            </motion.div>

            {/* Explore Button */}
            <motion.div
                className="mt-16 relative z-10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.6 }}
            >
                <Link
                    href="/pricing"
                    className="group relative px-8 py-3 border-2 border-[#a2e4b4] text-[#a2e4b4] font-bold tracking-wide hover:bg-[#a2e4b4] hover:text-black transition-all duration-300 overflow-hidden inline-block"
                >
                    <span className="relative z-10">EXPLORE</span>
                    <motion.div
                        className="absolute inset-0 bg-[#a2e4b4]"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: 0 }}
                        transition={{ duration: 0.3 }}
                    />
                </Link>
            </motion.div>
        </section>
    );
};

export default Services;
