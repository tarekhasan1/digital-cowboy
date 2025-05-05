// components/Banner2.tsx
import Image from "next/image";

const Banner = () => {
    return (
        <section className="bg-black min-h-screen text-white flex flex-col md:flex-row items-center justify-between px-6 md:px-16 py-12 gap-10 relative mt-[60px] md:mt-0 overflow-hidden mx-auto">
            {/* Left Section */}
            <div className="flex flex-col items-center justify-center md:items-start max-w-md mx-auto md:w-1/2">
                <Image
                    src="/white-logo-name.png"
                    width={400}
                    height={250}
                    alt="digital cowboy logo"
                />
                <p className="mt-8 text-2xl font-light">
                    Get started from just{" "}
                    <span className="font-semibold">$990!</span>
                </p>
                <a href="mailto:hello@digitalcowboy.com.au" className="mt-6 border-2 border-[#A1D9B0] text-[#A1D9B0] font-bold py-3 px-6 hover:bg-[#A1D9B0] hover:text-white transition">
                    ORDER NOW
                </a>
            </div>

            {/* Right Section - Images */}
            <div className="flex-1 flex justify-center items-center relative">
                {/* Top circle image */}
                <div className="w-[300px] h-[300px] md:w-[330px] md:h-[330px] lg:w-[230px] lg:h-[230px] xl:w-[270px] xl:h-[270px] 2xl:w-[350px] 2xl:h-[350px] rounded-full overflow-hidden border-4 border-white z-20">
                    <Image
                        src="/cowboy-banner-2.jpg" // First image (place in /public)
                        alt="Laptop showcase"
                        width={400}
                        height={400}
                        className="object-cover w-full h-full"
                    />
                </div>
                {/* Bottom circle image */}
                <div className="w-60 h-60 md:w-[350px] md:h-[350px] lg:w-[230px] lg:h-[230px] xl:w-[270px] xl:h-[270px] 2xl:w-[350px] 2xl:h-[350px] rounded-full overflow-hidden border-4 border-white mt-[260px] z-10 hidden lg:block">
                    <Image
                        src="/cowboy-banner.jpg" // Second image (place in /public)
                        alt="Multiple devices"
                        width={400}
                        height={400}
                        className="object-cover w-full h-full"
                    />
                </div>
            </div>
        </section>
    );
};

export default Banner;
