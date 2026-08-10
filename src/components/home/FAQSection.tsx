"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    question: "How much does a DigitalCowboy project cost?",
    answer: "Pricing depends on the scope and complexity of your requirements. Our Launch websites start from A$1,490, Growth websites from A$3,500, and Custom Software from A$10,000+. Every project is scoped around your specific business needs."
  },
  {
    question: "Do you work outside Townsville?",
    answer: "Yes. While we are proudly based in Townsville, Queensland, we work with ambitious businesses across Australia and internationally. Everything we build is managed efficiently online."
  },
  {
    question: "Do you provide ongoing support?",
    answer: "Yes. We offer DigitalCowboy Care and Growth plans starting from A$180/month to handle security, updates, SEO, and continuous improvements so you can focus on running your business."
  },
  {
    question: "Can you build custom software?",
    answer: "Absolutely. We build complex web applications, SaaS products, customer portals, and internal business tools tailored exactly to how your business operates."
  },
  {
    question: "Can you integrate AI into an existing business?",
    answer: "Yes. We can introduce practical AI solutions like automated lead qualification, AI customer support assistants, and workflow automation into your existing systems to save time and reduce manual work."
  },
  {
    question: "How long does a website take?",
    answer: "Timelines depend entirely on complexity. A straightforward Launch website might take 2-4 weeks, while custom software or a complex eCommerce platform can take 2-4 months. We define realistic timelines during the planning phase."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-black border-t border-white/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6"
          >
            Frequently asked questions
          </motion.h2>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
              >
                <span className="text-lg font-semibold text-white pr-8">{faq.question}</span>
                <ChevronDown 
                  className={`flex-shrink-0 text-white/50 transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""}`}
                  size={24}
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="p-6 pt-0 text-white/60 leading-relaxed border-t border-white/5 mt-2">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
