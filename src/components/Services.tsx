"use client";
import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Image from "next/image";

const Services: React.FC = () => {
    useEffect(() => {
        AOS.init({
            duration: 2000, // You can customize the duration
        });
    }, []);

    const services = [
        // {
        //     title: "Digital Products",
        //     description:
        //         "We turn ideas into immersive digital experiences, seamlessly blending aesthetics and functionality to transform your vision into compelling digital realities.",
        //     image: "/services/digital-product.png", // Add image URL
        // },
        {
            title: "Software Development",
            description:
                "Our software development services merge creativity with technical expertise, crafting robust and user-friendly software tailored to your needs.",
            image: "/services/software-dev.jpg",
        },
        {
            title: "Web Development",
            description:
                "We build stunning, user-centric websites that drive engagement and conversions, ensuring responsive, high-performance websites that stand out.",
            image: "/services/web-dev.png",
        },
        {
            title: "Mobile App Development",
            description:
                "We build innovative, user-friendly apps with seamless experiences across platforms, creating apps that stand out in a crowded market.",
            image: "/services/app-dev.jpg",
        },
        // {
        //     title: "Customer Relationship Management (CRM)",
        //     description:
        //         "Our tailored CRM solutions empower you to build lasting relationships, drive sales, and enhance customer satisfaction with advanced analytics and automation.",
        //     image: "/services/crm.png",
        // },
        // {
        //     title: "Enterprise Resource Planning (ERP)",
        //     description:
        //         "Streamline operations and enhance efficiency with our tailored ERP solutions, driving informed decision-making and scalability.",
        //     image: "/services/erp.png",
        // },
        {
            title: "Web Consultation and Strategy",
            description:
                "Providing expert advice and strategic guidance to clients for effective online presence and growth.",
            image: "/services/web-consultation.jpg",
        },
        {
            title: "Web UX/UI Design",
            description:
                "Create intuitive, visually captivating interfaces that guide users seamlessly through a delightful digital experience.",
            image: "/services/ui-ux.png",
        },
        {
            title: "Website Development",
            description:
                "Build high-performing, responsive websites that drive results and enhance user engagement.",
            image: "/services/website-dev.png",
        },
        {
            title: "Functionality & Integrations",
            description:
                "Web connections to CRM systems, analytics, payment gateways, marketing tools, and social media platforms.",
            image: "/services/functionality.png",
        },
        {
            title: "Content Strategy & Production",
            description:
                "Planning and production of quality website content: Copywriting, Photography, Video.",
            image: "/services/content-strategy.png",
        },
        {
            title: "Training and Support",
            description:
                "Offering training sessions and ongoing support for clients to manage and update their websites independently.",
            image: "/services/traning-support.png",
        },
        {
            title: "E-Commerce Website Design",
            description:
                "Designing online stores with user-friendly interfaces, secure payment gateways, and effective product displays.",
            image: "/services/ecommerce.png",
        },
        {
            title: "Custom Web Applications",
            description:
                "Developing bespoke web applications tailored to meet specific business requirements.",
            image: "/services/custom-web-app.jpg",
        },
        {
            title: "Website Redesign",
            description:
                "Revamping existing websites to enhance visual appeal, functionality, and overall user experience.",
            image: "/services/website-redesign.png",
        },
        {
            title: "Search Engine Optimisation (SEO)",
            description:
                "Integrating SEO best practices to improve the website's visibility on search engines.",
            image: "/services/seo.png",
        },
        {
            title: "Web Performance Optimisation",
            description:
                "Enhancing website speed and performance for optimal user experience and search engine rankings.",
            image: "/services/web-performance.png",
        },
        {
            title: "Web Hosting and Maintenance",
            description:
                "Providing hosting solutions and ongoing maintenance services to ensure the website's security and performance.",
            image: "/services/web-hosting.png",
        },
        // Add the rest of your services with images here...
    ];

    return (
        <div id="services"
            className="max-w-7xl mx-auto px-6 py-16"
            style={{ backgroundImage: "url('/bg5.gif')" }}
        >
            <h2 className="text-center text-gray-600 text-2xl md:text-4xl mb-12 font-bold">
                Our Services
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map((service, index) => (
                    <div
                        data-aos="slide-up"
                        key={index}
                        className="p-6 bg-white rounded-lg shadow-lg"
                    >
                        <Image
                            src={service.image}
                            alt={service.title}
                            width={200}
                            height={100}
                            className="w-full h-48 object-contain rounded-t-lg mb-4"
                        />
                        <h3 className="text-2xl font-semibold mb-4">
                            {service.title}
                        </h3>
                        <p className="text-gray-700">{service.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Services;
