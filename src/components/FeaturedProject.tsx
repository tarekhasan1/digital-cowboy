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
            title: "Project Name 1",
            description: "A brief description of the first project highlighting its features and what makes it stand out.",
            imageUrl: "/DEMO.png", // Replace with actual image path
            projectUrl: "#", // Replace with actual project link
            technologies: ["React", "Next.js", "Tailwind CSS"], // List of technologies used
        },
        {
            title: "Project Name 2",
            description: "A brief description of the second project highlighting its features and what makes it stand out.",
            imageUrl: "/DEMO.png", // Replace with actual image path
            projectUrl: "#", // Replace with actual project link
            technologies: ["Vue.js", "Nuxt.js", "Bootstrap"], // List of technologies used
        },
        // Add more projects as needed
    ];

    return (
        <div className="max-w-7xl mx-auto px-6 py-16">
            <h2 className="text-center text-gray-600 text-2xl md:text-4xl mb-12 font-bold">
                Featured Projects
            </h2>
            {projects.map((project, index) => (
                <div key={index} className="h-[550px] flex flex-col md:flex-row items-center bg-white rounded-lg shadow-lg overflow-hidden mb-12">
                    {/* Project Image */}
                    <div data-aos="slide-right" className="w-full md:w-1/2">
                        <Image
                            src={project.imageUrl}
                            alt={project.title}
                            width={600}
                            height={800}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Project Details */}
                    <div data-aos="slide-left" className="w-full md:w-1/2 p-8">
                        <h3 className="text-3xl font-semibold mb-4">{project.title}</h3>
                        <p className="text-gray-700 mb-6">{project.description}</p>
                        <div className="mb-4">
                            <h4 className="text-xl font-semibold">Technologies Used:</h4>
                            <ul className="list-disc list-inside text-gray-600">
                                {project.technologies.map((tech, techIndex) => (
                                    <li key={techIndex}>{tech}</li>
                                ))}
                            </ul>
                        </div>
                        <a
                            href={project.projectUrl}
                            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
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
