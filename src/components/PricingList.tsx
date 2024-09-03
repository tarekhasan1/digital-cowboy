import React from "react";

type PricingItem = {
    title: string;
    price: string;
    description: string[];
};

const pricingData: PricingItem[] = [
    {
        title: "Basic Website Building",
        price: "Starting from $500 + GST",
        description: [
            "Creation of a simple, yet professional website suitable for small businesses or personal use.",
            "Includes: Up to 5 pages (Home, About, Services, Blog, Contact), Responsive Design for Desktop and Mobile, Basic SEO Optimisation.",
            "Easy-to-use content management system for self-updates.",
            "Customisable design to reflect your brand identity.",
        ],
    },
    {
        title: "Advanced Website Building",
        price: "Starting from $2,500",
        description: [
            "Development of a feature-rich website tailored for businesses with more complex needs.",
            "Includes: Up to 15 pages, Advanced Functionality (e.g., interactive elements, custom forms), E-Commerce Capabilities, Enhanced SEO Optimisation, Performance Tuning.",
            "Responsive Design for all devices and browsers.",
            "Integration with third-party services and custom analytics.",
        ],
    },
    {
        title: "App Development",
        price: "Starting from $10,000",
        description: [
            "Design and development of custom mobile applications for iOS and Android.",
            "Includes: UI/UX Design, Development, Testing, and Deployment.",
            "Built with modern technologies for optimal performance and security.",
            "Integration with necessary APIs and third-party services.",
        ],
    },
    {
        title: "Enterprise Web Development",
        price: "Starting from $9,500",
        description: [
            "Development of scalable and robust web solutions for large enterprises.",
            "Includes: Custom Web Application Development, Integration with Enterprise Systems, Security Enhancements, and Performance Optimisation.",
            "Tailored to meet the specific needs and workflows of your organisation.",
            "Ongoing support and maintenance options available.",
        ],
    },
    {
        title: "Website Redesign",
        price: "Starting from $1,200",
        description: [
            "Revamp your existing website with a modern design and improved functionality.",
            "Includes: UI/UX Overhaul, Enhanced Navigation, Updated Content Layout, and Visual Elements.",
            "Optimised for all devices and built with best practices in SEO.",
            "Aims to improve user experience and engagement.",
        ],
    },
    {
        title: "Functionality & Integrations",
        price: "$1,000",
        description: [
            "Add advanced functionalities and integrate third-party services to enhance your website or application.",
            "Includes: Custom Feature Development, API Integrations, and Workflow Automation.",
            "Ensures seamless operation and data flow between systems.",
            "Enhances user experience with advanced features and connectivity.",
        ],
    },
    {
        title: "API Integrations",
        price: "Starting from $600",
        description: [
            "Integrate various APIs to expand the functionality of your website or application.",
            "Includes: Integration with Payment Gateways, Social Media Platforms, and Other Third-Party Services.",
            "Ensures reliable and secure data exchange between systems.",
            "Custom integration solutions tailored to your specific needs.",
        ],
    },
    {
        title: "Landing Page Design",
        price: "$560",
        description: [
            "Create Responsive home page template for Desktop, Tablet and Mobiles.",
            "Including: Page Layout, Menus, Hero Image/Slider, Footers",
            "Built to adhere to Search Engine Protocols",
            "Clean professional design to match your branding.",
        ],
    },
    {
        title: "Extra Pages",
        price: "$150 per page",
        description: [
            "Set up Website Sub Pages.",
            "Design and add content to other pages to match styling of home page.",
            "Built to adhere to Search Engine Protocols",
        ],
    },
    {
        title: "Portfolio or Blog",
        price: "$320",
        description: [
            "Set up Website Portfolio or Blog Section",
            "Create Landing Page Design and Click through to Portfolio or Blog Pages",
        ],
    },
    {
        title: "Woocommerce Shop",
        price: "$2500",
        description: [
            "Add in Shop",
            "Layout and Design of Shop",
            "Set up Category, Product Pages, Cart, Checkout and Terms/Shipping page",
            "Add Shipping Methods",
            "Add Coupons",
            "Connect payment Gateway such as Stripe or Paypal",
            "Sample Products Entered",
            "Products may be imported into Woocommerce - may be an extra cost depending on files available.",
        ],
    },
    {
        title: "SEO, Reporting and Search Engine Submission",
        price: "$420",
        description: [
            "Add Meta Data to Site",
            "Optimise for SEO",
            "Add Sitemap",
            "Add Search Console",
            "Add Google Analytics",
            "Add Google Tag Manager",
            "Set up Monthly Analytics Report",
        ],
    },
    {
        title: "90 Days Search Engine Optimisation",
        price: "$650",
        description: [
            "90 Days of SEO Tracking",
            "Recommendations and changes to site to increase Google Ranking for keywords and keyphrases",
            "Monthly Progress Report",
        ],
    },
    {
        title: "Training on Site Management",
        price: "$50 per hour",
        description: [
            "Training on managing your site",
            "How to edit pages",
            "How to add new images and content",
            "How to manage a shop",
        ],
    },
    // {
    //     title: "Website Hosting",
    //     price: "$155",
    //     description: [
    //         "Business Standard 10 GB Hosting 10GB Monthly Bandwidth",
    //         "Website Hosting with Auto SSL",
    //         "Daily Off Site Back Up",
    //         "Immunify Security",
    //         "Litespeed Cache",
    //         "Server Management",
    //     ],
    // },
    // {
    //     title: "Plugin Licenses and Software Updates",
    //     price: "$220",
    //     description: [
    //         "WordPress Plugin Licenses and WordPress/Plugin Update Management.",
    //         "Includes Essential Addons, Gravity Forms, Smush Pro, Elementor Pro, SmartCrawl Pro",
    //         "One Month Free Licenses included from commencement of site design. Billed Annually",
    //     ],
    // },
];

const PricingList: React.FC = () => {
    return (
        <div className="container mx-auto p-6">
            <h1 className="text-center text-gray-600 text-2xl md:text-4xl font-bold mt-16 mb-6">
                Our Services & Pricing
            </h1>
            <p className="max-w-7xl mx-auto text-sm md:text-base text-gray-500 text-center mb-8">
                We always offer customizable packages tailored to your specific
                preferences and needs. Whether you’re looking for a simple
                solution or a complex, feature-rich design, our team will work
                with you to create the perfect package that aligns with your
                goals and vision. <br />{" "}
                <strong>
                    Contact us to discuss your project and exclusive pricing
                    options.
                </strong>
            </p>

            <div className="space-y-8">
                {pricingData.map((item, index) => (
                    <div
                        key={index}
                        className="p-6 border border-gray-300 rounded-lg shadow-lg"
                    >
                        <h2 className="text-2xl font-semibold mb-4">
                            {item.title}
                        </h2>
                        <p className="text-xl font-bold text-blue-600 mb-4">
                            {item.price}
                        </p>
                        <ul className="list-disc list-inside space-y-2">
                            {item.description.map((desc, i) => (
                                <li key={i} className="text-gray-700">
                                    {desc}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PricingList;
