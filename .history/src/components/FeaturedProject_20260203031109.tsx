'use client';

import Image from "next/image";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, ChevronLeft, ChevronRight, Code, Globe } from "lucide-react";

const FeaturedProjects: React.FC = () => {
    const [selectedIndex, setSelectedIndex] = useState(0);

const projects = [
    {
        title: "Hat Business",
        description:
            "Hat Business is a playful children’s podcast platform filled with imaginative stories and adventures that inspire curiosity, courage, and creativity. It offers episodes packed with fun narratives and calming routines for young listeners and families.",
        imageUrl: "/projects/hatbusiness-min.png",
        logoUrl: "/projects/logos/hatbusiness.png",
        projectUrl: "https://www.hatbusiness.com.au",
        technologies: ["NextJs","TypeScript", 
            "Framer Motion", "Firebase", "Firestore NoSQL Database" ,"Responsive Web", "Custom Audio Streaming"],
    },
    {
        title: "BWG Colman Radio",
        description:
            "BWG Colman Radio is a community-focused radio station broadcasting from Palm Island, Australia. The site offers live streaming of local news, music, and Indigenous content at 97.3 FM for its audience.",
        imageUrl: "/projects/bwgcolmanradio-min.png",
        logoUrl: "/projects/logos/bwgcolman-logo.png",
        projectUrl: "https://www.bwgcolmanradio.com.au",
        technologies: ["Live Stream", "Community Radio Web", "Responsive Design"],
    },
    {
        title: "SPOTTO!",
        description:
            "SPOTTO! is an online interactive platform where users can keep score, settle arguments, and compete in fun challenges with friends, crowned by an ultimate SPOTTO champion system.",
        imageUrl: "/projects/spotto-min.png",
        logoUrl: "/projects/logos/spotto.jpeg",
        projectUrl: "https://www.spotto.online",
        technologies: ["Interactive Web App", "Real-Time Scoring", "Responsive UI"],
    },

    {
        title: "AudioMate",
        description:
            "AudioMate is a powerful all-in-one platform for professional-grade audio editing and transcription. It streamlines podcast and voiceover workflows by offering advanced features such as noise and mouth sound reduction, automated transcription, audio summarization, and shownote generation.",
        imageUrl: "/projects/audiomate-min.png",
        logoUrl: "/projects/logos/audiomate-logo.png",
        projectUrl: "https://www.audiomate.studio",
        technologies: ["React", "Next.js", "Tailwind CSS", "MongoDB", "Paddle"],
    },
    {
        title: "NQ Fishing Adventures",
        description:
            "NQ Fishing Adventures features a modern, mobile-friendly website designed for seamless trip planning. It showcases detailed boat options, location highlights, and service information with high-resolution visuals.",
        imageUrl: "/projects/nqfishing-min.png",
        logoUrl: "",
        projectUrl: "https://www.nqfishingadventures.com",
        technologies: ["Nextjs", "TailwindCSS", "TypeScript", "Stripe", "MongoDB"],
    },
    {
        title: "Tap A Deal",
        description:
            "Tap A Deal is a high-performance, locally tailored platform connecting users in Townsville with the best local offers, events, and services. Built with a modern tech stack, it delivers lightning-fast performance.",
        imageUrl: "/projects/tapdeal-min.png",
        logoUrl: "/projects/logos/tapadeal-logo.png",
        projectUrl: "https://www.tapadeal.com.au",
        technologies: ["Nextjs", "TailwindCSS", "TypeScript"],
    },
    {
        title: "TSV Alterations & Formal Wear",
        description:
            "TSV Alterations & Formal Wear delivers a professional online presence for a trusted Townsville-based tailoring service. The website highlights alteration offerings, formal wear rentals, and appointment booking.",
        imageUrl: "/projects/tsvalteration-min.png",
        logoUrl: "",
        projectUrl: "https://www.tsvalterationsandformalwear.com",
        technologies: ["Next.js", "TailwindCSS", "TypeScript", "Firebase"],
    },
    {
        title: "NQ Interiors",
        description:
            "NQ Interiors showcases elegant interior design through a sophisticated and user-friendly website. With an emphasis on high-quality visuals, the platform offers an immersive experience for browsing design projects.",
        imageUrl: "/projects/nqinterior-min.png",
        logoUrl: "/projects/logos/nqinteriors-logo.png",
        projectUrl: "https://www.nqinteriors.com.au",
        technologies: ["Next.js", "TailwindCSS", "TypeScript", "Cloudinary"],
    }
];


    const nextProject = () => {
        setSelectedIndex((prev) => (prev + 1) % projects.length);
    };

    const prevProject = () => {
        setSelectedIndex((prev) => (prev - 1 + projects.length) % projects.length);
    };

    const selectedProject = projects[selectedIndex];

    return (
        <section className="w-full bg-black text-white py-20 px-6 md:px-16 relative overflow-hidden">
            {/* Background effects */}
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

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: -30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-[#A1D9B0] to-white bg-clip-text text-transparent">
                        Featured Projects
                    </h2>
                    <p className="text-gray-400 text-lg">Showcasing our best work</p>
                </motion.div>

                {/* Main Project Display */}
                <div className="mb-12">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={selectedIndex}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.5 }}
                            className="bg-gradient-to-br from-gray-900 to-black rounded-3xl overflow-hidden border border-gray-800 shadow-2xl"
                        >
                            <div className="flex flex-col lg:flex-row">
                                {/* Image Section */}
                                <motion.div
                                    className="w-full lg:w-1/2 h-[400px] lg:h-[500px] relative overflow-hidden"
                                    initial={{ scale: 1 }}
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <Image
                                        src={selectedProject.imageUrl}
                                        alt={selectedProject.title}
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                </motion.div>

                                {/* Content Section */}
                                <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        {selectedProject.logoUrl ? (
                                            <div className="mb-6">
                                                <Image
                                                    src={selectedProject.logoUrl}
                                                    alt={selectedProject.title}
                                                    width={120}
                                                    height={120}
                                                    className="object-contain"
                                                />
                                            </div>
                                        ) : (
                                            <h3 className="text-4xl md:text-5xl font-bold mb-6 text-[#A1D9B0]">
                                                {selectedProject.title}
                                            </h3>
                                        )}
                                    </motion.div>

                                    <motion.p
                                        className="text-gray-300 text-xs md:text-base mb-8 leading-relaxed"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        {selectedProject.description}
                                    </motion.p>

                                    <motion.div
                                        className="mb-8"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        <div className="flex items-center gap-2 mb-4">
                                            <Code className="w-5 h-5 text-[#A1D9B0]" />
                                            <h4 className="text-xl font-semibold text-gray-200">
                                                Technologies
                                            </h4>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedProject.technologies.map((tech, idx) => (
                                                <motion.span
                                                    key={idx}
                                                    className="px-4 py-2 bg-gray-800 text-gray-300 rounded-full text-sm font-medium border border-gray-700"
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: 0.5 + idx * 0.1 }}
                                                    whileHover={{ scale: 1.1, borderColor: "#A1D9B0" }}
                                                >
                                                    {tech}
                                                </motion.span>
                                            ))}
                                        </div>
                                    </motion.div>

                                    <motion.a
                                        href={selectedProject.projectUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group inline-flex items-center gap-2 bg-[#A1D9B0] text-black px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#8bc99f] transition-all duration-300 overflow-hidden relative"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6 }}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Globe className="w-5 h-5" />
                                        <span>Visit Website</span>
                                        <ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </motion.a>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Navigation Controls */}
                <div className="flex items-center justify-center gap-4 mb-12">
                    <motion.button
                        onClick={prevProject}
                        className="p-3 bg-gray-800 rounded-full text-white hover:bg-[#A1D9B0] hover:text-black transition-all duration-300 border border-gray-700"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </motion.button>
                    
                    <div className="flex gap-2">
                        {projects.map((_, idx) => (
                            <motion.button
                                key={idx}
                                onClick={() => setSelectedIndex(idx)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                    selectedIndex === idx
                                        ? "bg-[#A1D9B0] w-8"
                                        : "bg-gray-600 hover:bg-gray-500"
                                }`}
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                            />
                        ))}
                    </div>

                    <motion.button
                        onClick={nextProject}
                        className="p-3 bg-gray-800 rounded-full text-white hover:bg-[#A1D9B0] hover:text-black transition-all duration-300 border border-gray-700"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <ChevronRight className="w-6 h-6" />
                    </motion.button>
                </div>

                {/* Project Thumbnails */}
                <motion.div
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    {projects.map((project, idx) => (
                        <motion.button
                            key={idx}
                            onClick={() => setSelectedIndex(idx)}
                            className={`group relative overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                                selectedIndex === idx
                                    ? "border-[#A1D9B0] scale-105"
                                    : "border-gray-700 hover:border-gray-600"
                            }`}
                            whileHover={{ y: -5 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            {project.logoUrl ? (
                                <div className="aspect-square bg-gray-900 p-4 flex items-center justify-center">
                                    <Image
                                        src={project.logoUrl}
                                        alt={project.title}
                                        width={80}
                                        height={80}
                                        className="object-contain"
                                    />
                                </div>
                            ) : (
                                <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center p-4">
                                    <p className="text-xs text-gray-300 text-center font-semibold">
                                        {project.title}
                                    </p>
                                </div>
                            )}
                            <div
                                className={`absolute inset-0 bg-[#A1D9B0] opacity-0 group-hover:opacity-10 transition-opacity ${
                                    selectedIndex === idx ? "opacity-20" : ""
                                }`}
                            />
                        </motion.button>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default FeaturedProjects;
