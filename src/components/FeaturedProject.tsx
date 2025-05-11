"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const FeaturedProjects: React.FC = () => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const sliderRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        AOS.init({ duration: 2000 });
    }, []);

    const projects = [
        {
            title: "AudioMate",
            description:
                "AudioMate is a powerful all-in-one platform for professional-grade audio editing and transcription. It streamlines podcast and voiceover workflows by offering advanced features such as noise and mouth sound reduction, automated transcription, audio summarization, and shownote generation. With built-in screen recording, intuitive editing tools, and single-click audio enhancements, AudioMate empowers users to produce polished content efficiently and effortlessly.",
            imageUrl: "/projects/audiomate-min.png",
            logoUrl: "/projects/logos/audiomate-logo.png",
            projectUrl: "https://www.audiomate.studio",
            technologies: ["React", "Next.js", "Tailwind CSS", "MongoDB", "Paddle"],
        },
        {
            title: "NQ Fishing Adventures",
            description:
                "NQ Fishing Adventures features a modern, mobile-friendly website designed for seamless trip planning. It showcases detailed boat options, location highlights, and service information with high-resolution visuals. The site includes an easy-to-use booking system with deposit handling, an interactive map for navigation, and secure forms for communication. Its intuitive layout and responsive design provide an excellent user experience on both desktop and mobile platforms.",
            imageUrl: "/projects/nqfishing-min.png",
            logoUrl: "",
            projectUrl: "https://www.nqfishingadventures.com",
            technologies: ["Nextjs", "TailwindCSS", "TypeScript", "Stripe", "MongoDB"],
        },
        {
            title: "Tap A Deal",
            description:
                "Tap A Deal is a high-performance, locally tailored platform connecting users in Townsville with the best local offers, events, and services. Built with a modern tech stack, it delivers lightning-fast performance and smooth user interactions across all devices. Its design prioritizes user convenience, while robust architecture ensures reliability, speed, and secure access to hyper-local deals and promotions.",
            imageUrl: "/projects/tapdeal-min.png",
            logoUrl: "/projects/logos/tapadeal-logo.png",
            projectUrl: "https://www.tapadeal.com.au",
            technologies: ["Nextjs", "TailwindCSS", "TypeScript"],
        },
        {
            title: "She Said What?!",
            description:
                "She Said What?! is a bold and engaging podcast platform that dives into real conversations, trending topics, and powerful female voices. Built with performance and user experience in mind, the platform offers seamless audio streaming, episode browsing, and integrated subscriptions for listeners to access the premium contents. Its mobile-first design ensures smooth playback on any device, while the backend allows for efficient episode management and audio uploads.",
            imageUrl: "/projects/shesaidwhatpodcast-min.png", // Replace with your actual image
            logoUrl: "/projects/logos/shesaidwhat-logo.png", // Replace with the actual logo if available
            projectUrl: "https://www.shesaidwhat.au", // Replace with actual URL if different
            technologies: ["Next.js", "TailwindCSS", "TypeScript", "Firebase"],
        },
        {
            title: "TSV Alterations & Formal Wear",
            description:
                "TSV Alterations & Formal Wear delivers a professional online presence for a trusted Townsville-based tailoring service. The website highlights alteration offerings, formal wear rentals, and appointment booking, all within a stylish, easy-to-navigate layout. Optimized for mobile users, the site includes a detailed service guide, customer testimonials, and quick contact forms to streamline client engagement.",
            imageUrl: "/projects/tsvalteration-min.png",
            logoUrl: "",
            projectUrl: "https://www.tsvalterations.com.au",
            technologies: ["Next.js", "TailwindCSS", "TypeScript", "Firebase"],
        },
        {
            title: "NQ Interiors",
            description:
                "NQ Interiors showcases elegant interior design through a sophisticated and user-friendly website. With an emphasis on high-quality visuals, the platform offers an immersive experience for browsing residential and commercial design projects. It includes a service breakdown, inquiry forms, and an aesthetic layout that reflects the brand’s premium feel, while maintaining fast load times and responsive performance across devices.",
            imageUrl: "/projects/nqinterior-min.png",
            logoUrl: "/projects/logos/nqinteriors-logo.png",
            projectUrl: "https://www.nqinteriors.com.au",
            technologies: ["Next.js", "TailwindCSS", "TypeScript", "Cloudinary"],
        }
        
    ];
    

    const scroll = (direction: "left" | "right") => {
        if (sliderRef.current) {
            const scrollAmount = 300;
            sliderRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    const selectedProject = projects[selectedIndex];

    return (
        <div className="w-full mx-auto px-6 py-16">
            <h2 className="text-center text-gray-2
            text-2xl md:text-4xl mb-12 text-gray-100 font-bold">
                Featured Projects
            </h2>

            {/* Top section – only selected project */}
            <div className="md:h-[450px] flex flex-col md:flex-row items-center bg-gray-600 rounded-2xl shadow-lg overflow-hidden border border-white mb-12">
                {/* Image */}
                <div
                    data-aos="zoom-in"
                    className="w-full md:w-1/2 h-[400px] md:h-full"
                >
                    <Image
                        src={selectedProject.imageUrl}
                        alt={selectedProject.title}
                        width={400}
                        height={800}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Content */}
                <div
                    data-aos="fade-left"
                    className="w-full md:w-1/2 p-8"
                >
                    <h3 className="text-3xl text-gray-100 font-semibold mb-4">
                        {selectedProject.title}
                    </h3>
                    <p className="text-gray-100 text-xs md:text-sm mb-6">
                        {selectedProject.description}
                    </p>
                    <div className="mb-4">
                        <h4 className="text-xl text-gray-100 font-semibold">
                            Technologies Used:
                        </h4>
                        <ul className="list-disc list-inside text-gray-200">
                            {selectedProject.technologies.map((tech, idx) => (
                                <li key={idx}>{tech}</li>
                            ))}
                        </ul>
                    </div>
                    <a
                        target="_blank"
                        href={selectedProject.projectUrl}
                        className="inline-block bg-teal-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-600 transition duration-300"
                    >
                        Visit
                    </a>
                </div>
            </div>

            {/* Bottom Slider Section */}
            <div className="relative mt-12">
                {/* Arrows */}
                <button
                    onClick={() => scroll("left")}
                    className="absolute hidden md:block left-0 top-1/2 transform -translate-y-1/2 bg-white shadow-md rounded-full p-3 z-10"
                >
                    <FaArrowLeft />
                </button>
                <button
                    onClick={() => scroll("right")}
                    className="absolute hidden md:block right-0 top-1/2 transform -translate-y-1/2 bg-white shadow-md rounded-full p-3 z-10"
                >
                    <FaArrowRight />
                </button>

                {/* Slider */}
<div
    ref={sliderRef}
    className="flex overflow-x-auto no-scrollbar gap-6 px-4 py-6 scroll-smooth"
>
    {projects.map((project, idx) => (
        <button
            key={idx}
            onClick={() => setSelectedIndex(idx)}
            className={`flex flex-col items-center justify-start flex-shrink-0 w-[200px] h-[220px] cursor-pointer transition-transform duration-300 ${
                selectedIndex === idx
                    ? "scale-110"
                    : "opacity-60 hover:opacity-100"
            }`}
        >
            {project.logoUrl ? (
                <Image
                    src={project.logoUrl}
                    alt={project.title}
                    width={100}
                    height={100}
                    className="w-[100px] h-[100px] object-contain mb-2 rounded-full"
                />
            ) : (
                <div className="w-[100px] h-[100px] border-2 border-white rounded-full flex items-center justify-center">
                    <h2 className="text-sm text-gray-400 text-center px-4">
                        {project.title}
                    </h2>
                </div>
            )}
            <p className="text-sm font-semibold text-white text-center mt-4">
                {project.title}
            </p>
        </button>
    ))}
</div>

            </div>
        </div>
    );
};

export default FeaturedProjects;
