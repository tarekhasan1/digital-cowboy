'use client';

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FaEnvelope, FaMapMarkerAlt, FaFacebookF, FaWhatsapp, FaLinkedin } from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white py-16 border-t border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <Image
                src="/white-logo.png"
                width={140}
                height={42}
                alt="DigitalCowboy"
                className="w-auto h-8"
              />
            </Link>
            <h3 className="text-xl font-bold mb-2">Build. Automate. Grow.</h3>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Digital products, AI automation and growth systems for ambitious businesses.
            </p>
            <div className="flex gap-4 text-white/50">
              <a href="https://web.facebook.com/profile.php?id=61565491041352" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                <FaFacebookF size={18} />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="https://www.linkedin.com/in/digitalcowboy-agency" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                <FaLinkedin size={18} />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a href="https://wa.me/+61427929500" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                <FaWhatsapp size={18} />
                <span className="sr-only">WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/90 mb-5">Services</h4>
            <ul className="space-y-3">
              {[
                { name: 'Websites', href: '/services/website-development' },
                { name: 'Software', href: '/services/software-development' },
                { name: 'Mobile Apps', href: '/services/software-development' },
                { name: 'AI Automation', href: '/services/ai-automation' },
                { name: 'SEO', href: '/services/digital-marketing' },
                { name: 'Digital Marketing', href: '/services/digital-marketing' },
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-white/60 hover:text-white transition-colors text-sm">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/90 mb-5">Company</h4>
            <ul className="space-y-3">
              {[
                { name: 'About', href: '/about' },
                { name: 'Work', href: '/work' },
                { name: 'Insights', href: '/insights' },
                { name: 'Pricing', href: '/pricing' },
                { name: 'Contact', href: '/contact' },
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-white/60 hover:text-white transition-colors text-sm">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/90 mb-5">Contact</h4>
            <ul className="space-y-4">
              <li>
                <a href="mailto:hello@digitalcowboy.com.au" className="group flex items-start gap-3 text-white/60 hover:text-white transition-colors text-sm">
                  <FaEnvelope className="text-primary mt-0.5 group-hover:text-primary/80" />
                  <span>hello@digitalcowboy.com.au</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-white/60 text-sm">
                <FaMapMarkerAlt className="text-primary mt-0.5 flex-shrink-0" />
                <span>Townsville, Queensland, Australia</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-sm">
            &copy; {new Date().getFullYear()} DigitalCowboy. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-white/40">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
