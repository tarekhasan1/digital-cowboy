"use client";
import Image from "next/image";
import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const FeaturedProjects: React.FC = () => {
    useEffect(() => {
        AOS.init({
            duration: 2000, // You can customize the duration
        });
    }, []);

    const projects = [
        {
            title: "AudioMate",
            description:
                "The Audio Transcription project offers an all-in-one solution for high-quality audio editing and transcription. It features automated clean-up tools for noise, mouth sounds, and other disruptions, as well as audio summary and shownotes generation. Users can easily build spots with voiceovers and music, auto-tag audio segments, and utilize a basic editor for trimming and adding intros, jingles, and background music. Additionally, it includes screen recording with direct upload for editing and automatic volume adjustment for optimal sound quality, all with a single click.",
            imageUrl: "/projects/audiomate-min.png", // Replace with actual image path
            projectUrl: "https://www.audiomate.studio", // Replace with actual project link
            technologies: [
                "React",
                "Next.js",
                "Tailwind CSS",
                "MongoDB",
                "Paddle"
            ], // List of technologies used
        },
        {
            title: "NQ Fishing Adventures",
            description:
                "At NQ Fishing Adventures, we've developed a user-friendly website to enhance your booking experience. Our design focuses on simplicity and clarity, making it easy to navigate and find detailed information about our fishing adventures, boat options, and host services. The site features a streamlined booking system for checking availability and securing reservations with a 10% deposit, an interactive map for directions, and straightforward contact forms for inquiries. We’ve ensured that the website is fully responsive, offering a great viewing experience on both desktop and mobile devices. High-quality images and engaging content highlight our location and amenities, while secure payment options and data protection measures safeguard your information. This thoughtful design and feature integration aim to provide a seamless and enjoyable experience for all our guests.",
            imageUrl: "/projects/nqfishing-min.png", // Replace with actual image path
            projectUrl: "https://www.nqfishingadventures.com", // Replace with actual project link
            technologies: ["Nextjs", "TailwindCSS", "TypeScript", "Stripe", "MongoDB"], // List of technologies used
        },
        // Add more projects as needed
    ];

    return (
        <div className="max-w-7xl mx-auto px-6 py-16">
            <h2 className="text-center text-gray-600 text-2xl md:text-4xl mb-12 font-bold">
                Featured Projects
            </h2>
            {projects.map((project, index) => (
                <div
                    key={index}
                    className="md:h-[550px] flex flex-col md:flex-row items-center bg-white rounded-lg shadow-lg overflow-hidden mb-12"
                >
                    {/* Project Image */}
                    <div
                        data-aos="zoom-in"
                        data-aos-easing="ease-out-cubic"
                        data-aos-duration="2000"
                        className="w-full md:w-1/2"
                    >
                        <Image
                            src={project.imageUrl}
                            alt={project.title}
                            width={400}
                            height={800}
                            className="w-full h-full object-bottom"
                        />
                    </div>

                    {/* Project Details */}
                    <div
                        data-aos="fade-left"
                        data-aos-offset="300"
                        data-aos-easing="ease-in-sine"
                        className="w-full md:w-1/2 p-8"
                    >
                        <h3 className="text-3xl font-semibold mb-4">
                            {project.title}
                        </h3>
                        <p className="text-gray-700 text-xs md:text-sm mb-6">
                            {project.description}
                        </p>
                        <div className="mb-4">
                            <h4 className="text-xl font-semibold">
                                Technologies Used:
                            </h4>
                            <ul className="list-disc list-inside text-gray-600">
                                {project.technologies.map((tech, techIndex) => (
                                    <li key={techIndex}>{tech}</li>
                                ))}
                            </ul>
                        </div>
                        <a
                            target="_blank"
                            href={project.projectUrl}
                            className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition duration-300"
                        >
                            View Project
                        </a>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FeaturedProjects;
