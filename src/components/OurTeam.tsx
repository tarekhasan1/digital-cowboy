"use client";
import Image from "next/image";
import React from "react";

const OurTeam: React.FC = () => {
    const teamMembers = [
        {
            name: "Allison Rasmussen",
            role: "Founder & CEO",
            responsibilities:
                "Leads the company’s strategic vision and growth initiatives, ensuring alignment with long-term objectives and fostering innovation. Oversees relationships with clients and collaborators to drive success and maintain strong partnerships.",
            image: "/team/ally.jpeg", // Replace with actual image path
        },
        {
            name: "Tarek Hasan",
            role: "Founder & CTO",
            responsibilities:
                "Responsible for guiding the company’s vision and strategic direction, ensuring sustained growth and innovation. Oversees all technical aspects of the organization, maintaining high standards of quality across every project.",
            image: "/team/tarek.jpg",
        },
        {
            name: "Naim Toki",
            role: "Lead UI/UX Designer",
            responsibilities:
                "Oversee the design process to create intuitive and visually compelling user interfaces, lead design strategy and research, and ensure that user experience principles are effectively integrated into the development process",
            image: "/team/toki.jpg",
        },
        {
            name: "Faridul Islam",
            role: "Lead Developer",
            responsibilities:
                "Guide and oversee the development team, drive technical strategy and architecture, and ensure the successful delivery of complex projects through effective leadership and mentorship.",
            image: "/team/faridul.jpeg",
        },
        {
            name: "Abdullah Munna",
            role: "Backend Developer",
            responsibilities:
                "Develop and maintain server-side applications and databases, ensuring robust functionality, performance, and security to support seamless user interactions and data management.",
            image: "/team/munna.png",
        },
        {
            name: "Rownok Basunia",
            role: "Front-End Developer",
            responsibilities:
                "Create and maintain visually appealing and responsive user interfaces using modern web technologies, ensuring optimal performance and user experience across devices.",
            image: "/team/rownok.jpg",
        },
        {
            name: "Kajol Chowdhury",
            role: "Marketing Officer",
            responsibilities:
                "Design and implement marketing campaigns, analyze market trends, optimize for SEO, and oversee brand development to effectively reach and engage target audiences.",
            image: "/team/kajol.jpg",
        },
        {
            name: "Hiring...",
            role: "Marketing Coordinator",
            responsibilities:
                "execute marketing strategies, coordinate promotional activities, manage social media campaigns, and analyze performance metrics to enhance brand presence and drive engagement.",
            image: "/team/user-icon.jpg",
        },
        {
            name: "Hiring...",
            role: "Sales Manager",
            responsibilities:
                "Lead and motivate the sales team, develop sales strategies, manage key accounts, and drive revenue growth through effective client relationship management and market analysis.",
            image: "/team/user-icon.jpg",
        },
    ];

    return (
        <div
            className="max-w-7xl mx-auto px-6 py-16"
            style={{
                backgroundImage: "url('/bg3.gif')",
                background: "contain",
            }}
        >
            <h2 className="text-center text-gray-600 text-2xl md:text-4xl mb-12 font-bold">
                Meet Our Team
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8  mx-auto">
                {teamMembers.map((member, index) => (
                    <div
                        key={index}
                        className="bg-white shadow-lg rounded-lg p-6 text-center"
                    >
                        <Image
                            src={member.image}
                            alt={member.name}
                            width={100}
                            height={100}
                            className="w-32 h-32 mx-auto rounded-full mb-4 object-cover"
                        />
                        <h3 className="text-xl font-semibold">{member.name}</h3>
                        <p className="text-blue-600 mb-2">{member.role}</p>
                        <p className="text-gray-700">
                            {member.responsibilities}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OurTeam;
