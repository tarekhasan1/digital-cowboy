"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface SliderItemProps {
    image?: string;
    title: string;
    type: string;
}

const Testimonials: React.FC = () => {
    const [margin, setMargin] = useState<number>(0);
    const [currentIndex, setCurrentIndex] = useState<number>(1);
    const numberOfItems = 6;

    useEffect(() => {
        const handleResize = () => {
            setMargin(0);
            setCurrentIndex(1);
        };

        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const previous = () => {
        const width = window.innerWidth;
        if (width < 640 && currentIndex > 1) {
            setMargin((prev) => prev + 87);
            setCurrentIndex((prev) => prev - 1);
        } else if (width < 1024 && currentIndex > 1) {
            setMargin((prev) => prev + 47);
            setCurrentIndex((prev) => prev - 1);
        } else if (width >= 1024 && currentIndex > 1) {
            setMargin((prev) => prev + 30.5);
            setCurrentIndex((prev) => prev - 1);
        }
    };

    const next = () => {
        const width = window.innerWidth;
        if (width < 640 && currentIndex < numberOfItems) {
            setMargin((prev) => prev - 87);
            setCurrentIndex((prev) => prev + 1);
        } else if (width < 1024 && currentIndex <= numberOfItems - 2) {
            setMargin((prev) => prev - 47);
            setCurrentIndex((prev) => prev + 1);
        } else if (width >= 1024 && currentIndex <= numberOfItems - 3) {
            setMargin((prev) => prev - 30.5);
            setCurrentIndex((prev) => prev + 1);
        }
    };

    const SliderItem: React.FC<SliderItemProps> = ({ image, title, type }) => (
        <div className="w-[87vw] sm:w-[43vw] lg:w-[29vw] px-[1px]">
            <div className="p-5 border border-cyan-600 rounded-2xl h-[360px] relative">
                <Image
                    className="w-24 h-24 rounded-lg mx-auto"
                    src={image || "/user.png"}
                    alt={type}
                    width={100}
                    height={100}
                />
                <p className="my-5 text-center">{title}</p>
                <div className="absolute bottom-5 right-5">
                    <p className="font-bold">Client.</p>
                    <p>{type}</p>
                </div>
            </div>
        </div>
    );

    return (
        <section className="mt-14">
            <h1 className="text-center text-gray-600 text-2xl md:text-4xl mb-12 font-bold">
                Clients Say
            </h1>
            <div className="relative">
                <div className="overflow-hidden w-[87vw] sm:w-[90vw] mx-auto">
                    <div
                        style={{
                            marginLeft: `${margin}vw`,
                            transition: "0.3s",
                        }}
                        className="flex gap-0 sm:gap-[4vw] lg:gap-[1.5vw] w-fit"
                    >
                        <SliderItem
                            title="DigitalCowboy’s web development team transformed our vision into a stunning, fully functional website."
                            type="Web Development"
                        />
                        <SliderItem
                            title="Our app development experience with DigitalCowboy was exceptional. They delivered a robust and intuitive app on time."
                            type="App Development"
                        />
                        <SliderItem
                            title="DigitalCowboy’s SEO services significantly boosted our website’s visibility and search engine ranking."
                            type="SEO Services"
                        />
                        <SliderItem
                            title="The web development services provided by DigitalCowboy were top-notch, with a keen eye for detail and user experience."
                            type="Web Development"
                        />
                        <SliderItem
                            title="Our app’s performance and functionality have greatly improved thanks to the expert development team at DigitalCowboy."
                            type="App Development"
                        />
                        <SliderItem
                            title="Thanks to DigitalCowboy’s comprehensive SEO strategy, we saw a noticeable increase in organic traffic."
                            type="SEO Services"
                        />
                    </div>
                </div>
                <button
                    onClick={previous}
                    className="angle-btn left"
                    value={"previous"}
                >
                    <Image
                        src="icons/left-solid.svg"
                        alt="left angle bracket"
                        width={20}
                        height={20}
                    />
                </button>
                <button
                    onClick={next}
                    className="angle-btn right"
                    value={"next"}
                >
                    <Image
                        src="icons/right-solid.svg"
                        alt="right angle bracket"
                        width={20}
                        height={20}
                    />
                </button>
            </div>
        </section>
    );
};

export default Testimonials;
