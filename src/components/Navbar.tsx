"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "Solutions", href: "/solutions" },
  { label: "About", href: "/about" },
  { label: "Insights", href: "/insights" },
  { label: "Pricing", href: "/pricing" },
];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-md border-b border-white/10 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/white-logo.png"
                width={120}
                height={36}
                alt="DigitalCowboy"
                className="w-auto h-7 sm:h-8"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <div className="flex items-center space-x-1 mr-6 bg-white/5 rounded-full px-2 py-1 border border-white/10">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? "bg-white/10 text-white"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center space-x-3">
              <Link
                href="/contact"
                className="text-sm font-medium text-white/90 hover:text-white transition-colors px-3 py-2 hidden xl:block"
              >
                Book a Discovery Call
              </Link>
              <Link
                href="/contact"
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-5 py-2.5 rounded-full text-sm font-medium transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              >
                Start a Project
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-white hover:text-primary transition-colors p-2"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100vh" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden absolute top-full left-0 w-full bg-background/95 backdrop-blur-xl border-t border-white/10 overflow-hidden"
          >
            <div className="px-4 py-8 space-y-4 h-full flex flex-col">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  onClick={() => setIsOpen(false)}
                  href={item.href}
                  className={`block px-4 py-3 rounded-lg text-xl font-medium transition-colors ${
                    isActive(item.href)
                      ? "bg-white/10 text-white"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              
              <div className="pt-6 mt-6 border-t border-white/10 space-y-4">
                <Link
                  onClick={() => setIsOpen(false)}
                  href="/contact"
                  className="block w-full text-center bg-primary text-primary-foreground hover:bg-primary/90 px-5 py-4 rounded-xl text-lg font-medium transition-colors"
                >
                  Start a Project
                </Link>
                <Link
                  onClick={() => setIsOpen(false)}
                  href="/contact"
                  className="block w-full text-center bg-transparent border border-white/20 text-white hover:bg-white/5 px-5 py-4 rounded-xl text-lg font-medium transition-colors"
                >
                  Book a Discovery Call
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
