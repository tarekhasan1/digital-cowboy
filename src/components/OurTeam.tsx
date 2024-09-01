"use client";
import Image from "next/image";
import React from "react";

const OurTeam: React.FC = () => {
    const teamMembers = [
        {
            name: "Allison Rusmussen",
            role: "CEO & Founder",
            responsibilities: "Leads the company vision and strategy, ensuring growth and innovation. Oversees relationship with clients and collaborators.",
            image: "/user.jpg", // Replace with actual image path
        },
        {
            name: "Tarek Hasan",
            role: "Founder & Chief Technology Officer",
            responsibilities: "Involved in the leading of company vision and strategy, ensuring growth and innovation. Oversees all technical aspects of the company, ensuring top-notch quality in every project.",
            image: "/user.jpg",
        },
        {
            name: "Naim Toki",
            role: "Head of Design",
            responsibilities: "Guides the creative vision for projects, ensuring visually compelling and user-friendly designs.",
            image: "/user.jpg",
        },
        {
            name: "Faridul Islam",
            role: "Lead Developer",
            responsibilities: "Leads the development team, ensuring code quality and technical innovation.",
            image: "/user.jpg",
        },
        {
            name: "Kajol Chowdhury",
            role: "Marketing Director",
            responsibilities: "Drives marketing strategies that enhance brand presence and engagement.",
            image: "/user.jpg",
        },
        {
            name: "salesman 1",
            role: "Project Manager",
            responsibilities: "Manages project timelines, client communication, and team coordination.",
            image: "/user.jpg",
        },
        {
            name: "salesman 2",
            role: "Project Manager",
            responsibilities: "Manages project timelines, client communication, and team coordination.",
            image: "/user.jpg",
        },
        {
            name: "Muhammad Munna",
            role: "Backend Developer",
            responsibilities: "Designs databse, develops backends, and security management.",
            image: "/user.jpg",
        },
        {
            name: "Rownok Basunia",
            role: "Front-End Developer",
            responsibilities: "Manages project front-ends, feature implementations, and ensures best user experiences.",
            image: "/user.jpg",
        },
    ];

    return (
        <div className="max-w-7xl mx-auto px-6 py-16" style={{ backgroundImage: "url('/bg3.gif')" }}>
            <h2 className="text-center text-gray-600 text-2xl md:text-4xl mb-12 font-bold">Meet Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {teamMembers.map((member, index) => (
                    <div key={index} className="bg-white shadow-lg rounded-lg p-6 text-center">
                        <Image
                            src={member.image}
                            alt={member.name}
                            width={100}
                            height={100}
                            className="w-32 h-32 mx-auto rounded-full mb-4 object-cover"
                        />
                        <h3 className="text-xl font-semibold">{member.name}</h3>
                        <p className="text-blue-600 mb-2">{member.role}</p>
                        <p className="text-gray-700">{member.responsibilities}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OurTeam;
