'use client';

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const Banner = () => {
    return (
        <section className="bg-black min-h-screen text-white flex flex-col md:flex-row items-center justify-between px-6 md:px-16 py-12 gap-10 relative mt-[60px] md:mt-0 overflow-hidden mx-auto">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute top-20 left-10 w-72 h-72 bg-[#A1D9B0] opacity-10 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        x: [0, 50, 0],
                        y: [0, 30, 0],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
                <motion.div
                    className="absolute bottom-20 right-10 w-96 h-96 bg-[#A1D9B0] opacity-10 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.3, 1],
                        x: [0, -50, 0],
                        y: [0, -30, 0],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            </div>

            {/* Left Section */}
            <motion.div
                className="flex flex-col items-center justify-center md:items-start max-w-md mx-auto md:w-1/2 z-10"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <Image
                        src="/white-logo-name.png"
                        width={400}
                        height={250}
                        alt="digital cowboy logo"
                        className="w-full max-w-[400px] h-auto"
                    />
                </motion.div>
                
                <motion.p
                    className="mt-8 text-2xl md:text-3xl font-light"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    Get started from just{" "}
                    <motion.span
                        className="font-semibold text-[#A1D9B0]"
                        animate={{
                            scale: [1, 1.05, 1],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        $990!
                    </motion.span>
                </motion.p>
                
                <motion.a
                    href="mailto:hello@digitalcowboy.com.au"
                    className="mt-6 group relative border-2 border-[#A1D9B0] text-[#A1D9B0] font-bold py-3 px-8 hover:bg-[#A1D9B0] hover:text-black transition-all duration-300 flex items-center gap-2 overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <span className="relative z-10">ORDER NOW</span>
                    <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                    <motion.div
                        className="absolute inset-0 bg-[#A1D9B0]"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: 0 }}
                        transition={{ duration: 0.3 }}
                    />
                </motion.a>
            </motion.div>

            {/* Right Section - Images */}
            <motion.div
                className="flex-1 flex justify-center items-center relative z-10"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            >
                {/* Top circle image */}
                <motion.div
                    className="w-[300px] h-[300px] md:w-[330px] md:h-[330px] lg:w-[230px] lg:h-[230px] xl:w-[270px] xl:h-[270px] 2xl:w-[350px] 2xl:h-[350px] rounded-full overflow-hidden border-4 border-white z-20 relative"
                    initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 0.8, delay: 0.5, type: "spring", stiffness: 100 }}
                    whileHover={{ scale: 1.05, rotate: 5 }}
                >
                    <Image
                        src="/cowboy-banner-2.jpg"
                        alt="Laptop showcase"
                        width={400}
                        height={400}
                        className="object-cover w-full h-full"
                    />
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                    />
                </motion.div>
                
                {/* Bottom circle image */}
                <motion.div
                    className="w-60 h-60 md:w-[350px] md:h-[350px] lg:w-[230px] lg:h-[230px] xl:w-[270px] xl:h-[270px] 2xl:w-[350px] 2xl:h-[350px] rounded-full overflow-hidden border-4 border-white mt-[260px] z-10 hidden lg:block relative"
                    initial={{ opacity: 0, scale: 0.5, rotate: 10 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 0.8, delay: 0.7, type: "spring", stiffness: 100 }}
                    whileHover={{ scale: 1.05, rotate: -5 }}
                >
                    <Image
                        src="/cowboy-banner.jpg"
                        alt="Multiple devices"
                        width={400}
                        height={400}
                        className="object-cover w-full h-full"
                    />
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                    />
                </motion.div>

                {/* Floating particles */}
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-[#A1D9B0] rounded-full opacity-60"
                        style={{
                            left: `${20 + i * 15}%`,
                            top: `${30 + i * 10}%`,
                        }}
                        animate={{
                            y: [0, -20, 0],
                            opacity: [0.6, 1, 0.6],
                            scale: [1, 1.2, 1],
                        }}
                        transition={{
                            duration: 3 + i * 0.5,
                            repeat: Infinity,
                            delay: i * 0.3,
                            ease: "easeInOut",
                        }}
                    />
                ))}
            </motion.div>
        </section>
    );
};

export default Banner;
