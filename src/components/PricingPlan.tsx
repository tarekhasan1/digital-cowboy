import React from "react";

const PricingPlan: React.FC = () => {
    const plans = [
        {
            title: "Basic Websites",
            description:
                "Designed with simplicity and functionality in mind. Affordable yet professional websites to showcase your products or services, connect with customers, and grow your brand.",
            price: "Starting at $500 + GST",
        },
        {
            title: "Advanced Websites",
            description:
                "Fully responsive custom websites made for medium-sized businesses seeking a robust online presence with advanced e-commerce capabilities.",
            price: "Starting at $2,500",
        },
        {
            title: "Enterprise Websites",
            description:
                "Websites designed and developed from the ground up, with custom-built features and integrations tailored to cater to the complex needs of enterprises, including CRM integration.",
            price: "Starting at $9,500",
        },
    ];

    return (
        <div className="max-w-7xl mx-auto px-6 py-16">
            <h2 className="text-center text-gray-600 text-2xl md:text-4xl mb-12 font-bold">
                Our Pricing Plans
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {plans.map((plan, index) => (
                    <div key={index} className="bg-white shadow-lg rounded-lg p-8">
                        <h3 className="text-2xl font-semibold mb-4 text-center">
                            {plan.title}
                        </h3>
                        <p className="text-gray-700 mb-6 text-center">
                            {plan.description}
                        </p>
                        <p className="text-xl font-bold text-center text-blue-600">
                            {plan.price}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PricingPlan;
