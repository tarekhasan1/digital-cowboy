// components/NoGeekSpeak.tsx
import Image from "next/image";
import Link from "next/link";

const NoGeekSpeak = () => {
  return (
    <section className="w-full  min-h-[80vh] px-6 py-12 md:px-16 bg-white border border-black rounded-[2rem]">
      <div className="flex-1 flex flex-col md:flex-row justify-between gap-20 md:gap-10">
        {/* Left text */}
        <div className="flex-1">
          <h2 className="text-4xl md:text-6xl font-semibold leading-tight text-black">
            No geek <br /> speak, just <br /> great sites
          </h2>
        </div>

        {/* Right content */}
        <div className="flex-1 flex flex-col items-center justify-between text-center md:items-end md:text-right md:min-h-[60vh]">
          {/* Arrow image */}
          <div className="w-60 h-20 md:w-80 md:h-30 relative mb-6 gradient-border">
            <Image
              src="/arrow.png" // Put your gradient arrow image in /public
              alt="Arrow"
              fill
              className="object-contain"
            />
          </div>

          {/* Paragraph */}
          <div>
          <p className="text-base md:text-lg text-black mb-4 max-w-md">
            We’re a Townsville based team that builds beautiful, functional, 
            “OMG, is that really mine?!” websites without the techy blah blah.
          </p>

          {/* Button */}
          <Link href="/about" className="bg-black text-white font-bold py-3 px-6 hover:bg-gray-800 transition">
            LEARN MORE
          </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NoGeekSpeak;
