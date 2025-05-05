import React from "react";

type PricingItem = {
    title: string;
    price: string;
    description: string[];
};

const pricingData: PricingItem[] = [
    {
        title: "Basic Website",
        price: "Starting from $990",
        description: [
            "Ideal for small businesses or personal projects.",
            "Includes up to 5 pages (Home, About, Services, Blog, Contact).",
            "Mobile-friendly and works well across all devices.",
            "Simple design customised to suit your brand.",
            "Basic search engine optimisation (SEO) included.",
            "Easy to update using a content management system.",
        ],
    },
    {
        title: "Advanced Website",
        price: "Starting from $3,500",
        description: [
            "Perfect for growing businesses needing more features.",
            "Includes up to 15 pages with advanced design and layout.",
            "Custom features like enquiry forms or interactive sections.",
            "Built-in eCommerce support if needed.",
            "Enhanced SEO and performance tuning.",
            "Integration with third-party tools like booking systems or CRMs.",
        ],
    },
    {
        title: "App Development",
        price: "Starting from $10,000",
        description: [
            "Fully customised mobile app for iOS and Android.",
            "Includes design, development, testing, and launching.",
            "Built using secure and modern technologies.",
            "Integrated with APIs or systems as needed.",
        ],
    },
    {
        title: "Enterprise Web Development",
        price: "Starting from $9,500",
        description: [
            "Bespoke websites or web apps for large-scale needs.",
            "Custom workflows and system integration for your organisation.",
            "Advanced security, speed, and scalability.",
            "Ongoing support and maintenance options available.",
        ],
    },
    {
        title: "Website Redesign",
        price: "Starting from $1,200",
        description: [
            "Give your old website a fresh, modern look.",
            "Revamped layout and improved navigation for better user experience.",
            "Mobile optimised and SEO-ready.",
            "Tailored to match your updated brand style.",
        ],
    },
    // {
    //     title: "API Integrations",
    //     price: "Starting from $600",
    //     description: [
    //         "Connect your website or app to third-party services.",
    //         "Payment gateways (e.g. Stripe, PayPal), social media, CRMs, and more.",
    //         "Secure, reliable, and fully customised to your needs.",
    //     ],
    // },
    // {
    //     title: "Landing Page Design",
    //     price: "$560",
    //     description: [
    //         "Custom-designed homepage layout for desktop, tablet, and mobile.",
    //         "Includes headers, menus, hero images, and footers.",
    //         "Clean, on-brand design optimised for search engines.",
    //     ],
    // },
    // {
    //     title: "Extra Pages",
    //     price: "$150 per page",
    //     description: [
    //         "Add extra subpages to your website.",
    //         "Content and layout matched with the main site design.",
    //         "SEO-ready and fully responsive.",
    //     ],
    // },
    {
        title: "E-commerce Shop",
        price: "$3,500",
        description: [
            "Complete online store set-up using WooCommerce or similar.",
            "Design of shop, product pages, cart, and checkout.",
            "Includes categories, shipping options, and coupon setup.",
            "Connect payment gateways like Stripe or PayPal.",
            "Add sample products (bulk import may cost extra depending on file format).",
        ],
    },
    {
        title: "SEO, Reporting & Search Engine Submission",
        price: "$420",
        description: [
            "Basic SEO set-up to help your site appear in Google.",
            "Includes meta tags, sitemap, and performance tweaks.",
            "Set-up of Google Analytics, Search Console, and Tag Manager.",
        ],
    },
    {
        title: "90-Day SEO Package",
        price: "$690",
        description: [
            "3 months of SEO tracking and support.",
            "We will review your site, suggest improvements, and implement key updates.",
            "Monthly progress reports to track keyword rankings.",
        ],
    },
    // {
    //     title: "Website Training",
    //     price: "$50/hr",
    //     description: [
    //         "One-on-one training on how to manage your website.",
    //         "Learn how to update text, images, and add new pages.",
    //         "Includes shop management for eCommerce clients.",
    //     ],
    // },
];

const PricingList: React.FC = () => {
    return (
        <div className="bg-black text-white py-16 px-6 md:px-12">
            <h1 className="text-center text-[#a2e4b4]  text-2xl md:text-4xl font-bold mb-6 mt-[50px]">
                Our Services & Pricing
            </h1>
            <p className="max-w-5xl mx-auto text-sm md:text-base text-gray-300 text-center mb-12">
                We offer tailored packages based on your needs and budget.
                Whether you're after a simple website or a complex app, we'll
                work with you to create the perfect solution. <br /><br />
                <strong className="text-white">
                    Contact us today to chat about your project and receive a
                    customised quote.
                </strong>
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {pricingData.map((item, index) => (
                    <div
                        key={index}
                        className="bg-gray-900 border border-gray-700 rounded-xl p-6 shadow-md hover:shadow-lg transition"
                    >
                        <h2 className="text-xl font-semibold mb-3 text-white">
                            {item.title}
                        </h2>
                        <p className="text-lg font-bold text-[#A1D9B0] mb-4">
                            {item.price}
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-300 text-sm">
                            {item.description.map((desc, i) => (
                                <li key={i}>{desc}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PricingList;
