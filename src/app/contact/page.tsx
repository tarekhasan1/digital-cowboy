"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { submitContactForm } from "@/actions/messages";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    service: '',
    budget: '',
    description: '',
    timeline: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const result = await submitContactForm(formData);
      if (result.success) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          company: '',
          email: '',
          phone: '',
          service: '',
          budget: '',
          description: '',
          timeline: '',
        });
      } else {
        setSubmitStatus('error');
        setErrorMessage(result.error || 'Failed to submit form.');
      }
    } catch (error: any) {
      setSubmitStatus('error');
      setErrorMessage('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex flex-col min-h-screen bg-background pt-24">
      <section className="py-20 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white mb-6">
            Let's build something useful.
          </h1>
          <p className="text-xl text-white/60 leading-relaxed">
            Tell us what you're trying to achieve. We'll help you figure out the best way to get there.
          </p>
        </div>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl backdrop-blur-sm"
          >
            {submitStatus === 'success' ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">Project Enquiry Sent!</h2>
                <p className="text-white/60 text-lg mb-8">
                  Thanks for reaching out. We've received your details and will get back to you within 24 hours.
                </p>
                <button 
                  onClick={() => setSubmitStatus('idle')}
                  className="bg-white/5 border border-white/10 text-white hover:bg-white/10 px-8 py-3 rounded-xl font-medium transition-colors"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                {submitStatus === 'error' && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-red-500 font-medium text-sm">Submission Failed</h3>
                      <p className="text-red-400/80 text-sm mt-1">{errorMessage}</p>
                    </div>
                  </div>
                )}
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80">Name *</label>
                    <input required name="name" value={formData.name} onChange={handleChange} type="text" className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow" placeholder="Your name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80">Business / Company</label>
                    <input name="company" value={formData.company} onChange={handleChange} type="text" className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow" placeholder="Company name" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80">Email *</label>
                    <input required name="email" value={formData.email} onChange={handleChange} type="email" className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow" placeholder="you@company.com" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80">Phone</label>
                    <input name="phone" value={formData.phone} onChange={handleChange} type="tel" className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow" placeholder="Optional" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">What do you need? *</label>
                  <select required name="service" value={formData.service} onChange={handleChange} className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow appearance-none">
                    <option value="" disabled>Select an option</option>
                    <option value="website">Website</option>
                    <option value="webapp">Web Application</option>
                    <option value="mobile">Mobile App</option>
                    <option value="ai">AI Automation</option>
                    <option value="seo">SEO</option>
                    <option value="marketing">Digital Marketing</option>
                    <option value="ecommerce">eCommerce</option>
                    <option value="redesign">Website Redesign</option>
                    <option value="other">Something else</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">Approximate project budget *</label>
                  <select required name="budget" value={formData.budget} onChange={handleChange} className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow appearance-none">
                    <option value="" disabled>Select a range</option>
                    <option value="under_2k">Under A$2,000</option>
                    <option value="2k_5k">A$2,000–5,000</option>
                    <option value="5k_10k">A$5,000–10,000</option>
                    <option value="10k_25k">A$10,000–25,000</option>
                    <option value="over_25k">A$25,000+</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">Tell us about your project *</label>
                  <textarea required name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow resize-none" placeholder="What are you trying to achieve?"></textarea>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">Desired timeline *</label>
                  <input required name="timeline" value={formData.timeline} onChange={handleChange} type="text" className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow" placeholder="e.g. Asap, 1 month, 3 months" />
                </div>

                <div className="pt-4 flex flex-col sm:flex-row gap-4">
                  <button disabled={isSubmitting} type="submit" className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 px-8 py-4 rounded-xl text-base font-bold transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] flex items-center justify-center gap-2">
                    {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
                    {isSubmitting ? 'Sending...' : 'Send Project Enquiry'}
                  </button>
                  <button type="button" className="flex-1 bg-white/5 border border-white/10 text-white hover:bg-white/10 px-8 py-4 rounded-xl text-base font-bold transition-colors">
                    Book a Discovery Call
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </main>
  );
}
