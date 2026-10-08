"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getBookingWindow, getAvailableSlots, createBooking } from "@/actions/bookings";
import { CheckCircle2, Loader2, AlertCircle, ArrowLeft, Calendar, Clock } from "lucide-react";
import AnimatedBackground from "@/components/backgrounds/AnimatedBackground";

const WEEKDAY_IDS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

function formatDateLabel(dateISO: string) {
  const [y, m, d] = dateISO.split('-').map(Number);
  return new Intl.DateTimeFormat('en-AU', { weekday: 'short', day: 'numeric', month: 'short' }).format(new Date(y, m - 1, d));
}

function formatTimeLabel(dateISO: string, time: string) {
  const instant = new Date(`${dateISO}T${time}:00+10:00`);
  return new Intl.DateTimeFormat('en-AU', { timeZone: 'Australia/Brisbane', hour: 'numeric', minute: '2-digit', hour12: true }).format(instant);
}

function formatFullDateTime(dateISO: string, time: string) {
  const instant = new Date(`${dateISO}T${time}:00+10:00`);
  return new Intl.DateTimeFormat('en-AU', {
    timeZone: 'Australia/Brisbane',
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true,
  }).format(instant);
}

export default function BookPage() {
  const [step, setStep] = useState<1 | 2 | 3 | 'success'>(1);
  const [window_, setWindow] = useState<{ todayISO: string; daysAhead: number; enabledDays: string[]; blackoutDates: string[] } | null>(null);
  const [loadingWindow, setLoadingWindow] = useState(true);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [slots, setSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', company: '', service: '', notes: '' });

  useEffect(() => {
    getBookingWindow().then(res => {
      if (res.success) setWindow(res as any);
      setLoadingWindow(false);
    });
  }, []);

  const candidateDates = (() => {
    if (!window_) return [];
    const dates: string[] = [];
    const [y, m, d] = window_.todayISO.split('-').map(Number);
    for (let i = 0; i < window_.daysAhead; i++) {
      const dt = new Date(y, m - 1, d + i);
      const iso = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
      const weekday = WEEKDAY_IDS[dt.getDay()];
      if (window_.enabledDays.includes(weekday) && !window_.blackoutDates.includes(iso)) {
        dates.push(iso);
      }
    }
    return dates;
  })();

  const handlePickDate = async (dateISO: string) => {
    setSelectedDate(dateISO);
    setSelectedTime(null);
    setLoadingSlots(true);
    setStep(2);
    const res = await getAvailableSlots(dateISO);
    setSlots(res.success ? res.slots : []);
    setLoadingSlots(false);
  };

  const handlePickTime = (time: string) => {
    setSelectedTime(time);
    setStep(3);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) return;
    setSubmitting(true);
    setError('');
    const res = await createBooking({ dateISO: selectedDate, startTime: selectedTime, ...formData });
    if (res.success) {
      setStep('success');
    } else {
      setError(res.error || 'Something went wrong. Please try another time.');
    }
    setSubmitting(false);
  };

  return (
    <main className="flex flex-col min-h-screen bg-background pt-24">
      <section className="py-12 relative overflow-hidden">
        <AnimatedBackground variant="section" accent="emerald" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Book a Discovery Call
          </h1>
          <p className="text-lg text-white/60 leading-relaxed">
            Free, no-pressure 15 minutes to figure out the smartest way forward for your business.
          </p>
        </div>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-sm"
          >
            {step === 'success' ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">You're booked!</h2>
                <p className="text-white/60 text-lg mb-2">
                  {selectedDate && selectedTime && formatFullDateTime(selectedDate, selectedTime)}
                </p>
                <p className="text-white/50 mb-8">A confirmation has been sent to {formData.email}.</p>
              </motion.div>
            ) : (
              <>
                {/* Progress indicator */}
                <div className="flex items-center gap-2 mb-8">
                  {[1, 2, 3].map(n => (
                    <div key={n} className={`h-1 flex-1 rounded-full ${step >= n ? 'bg-primary' : 'bg-white/10'}`} />
                  ))}
                </div>

                {step === 1 && (
                  <div>
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-primary" /> Pick a date
                    </h2>
                    {loadingWindow ? (
                      <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-white/40" /></div>
                    ) : candidateDates.length === 0 ? (
                      <p className="text-white/50 text-center py-12">No availability right now — please reach out via the contact form instead.</p>
                    ) : (
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                        {candidateDates.map(dateISO => (
                          <button
                            key={dateISO}
                            onClick={() => handlePickDate(dateISO)}
                            className="px-3 py-4 rounded-xl text-sm font-medium bg-background border border-white/10 text-white hover:border-primary/50 hover:bg-primary/5 transition-colors"
                          >
                            {formatDateLabel(dateISO)}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <button onClick={() => setStep(1)} className="flex items-center gap-1 text-sm text-white/50 hover:text-white mb-6">
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary" /> Pick a time — {selectedDate && formatDateLabel(selectedDate)}
                    </h2>
                    {loadingSlots ? (
                      <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-white/40" /></div>
                    ) : slots.length === 0 ? (
                      <p className="text-white/50 text-center py-12">No times left on this day — please pick another date.</p>
                    ) : (
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                        {slots.map(time => (
                          <button
                            key={time}
                            onClick={() => handlePickTime(time)}
                            className="px-3 py-3 rounded-xl text-sm font-medium bg-background border border-white/10 text-white hover:border-primary/50 hover:bg-primary/5 transition-colors"
                          >
                            {selectedDate && formatTimeLabel(selectedDate, time)}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {step === 3 && (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <button type="button" onClick={() => setStep(2)} className="flex items-center gap-1 text-sm text-white/50 hover:text-white">
                        <ArrowLeft className="w-4 h-4" /> Back
                      </button>
                      <p className="text-xs text-white/50">
                        {selectedDate && selectedTime && formatFullDateTime(selectedDate, selectedTime)}
                      </p>
                    </div>

                    {error && (
                      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <p className="text-red-400/80 text-sm">{error}</p>
                      </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-white/80">Name *</label>
                        <input required name="name" value={formData.name} onChange={handleChange} type="text" className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow" placeholder="Your name" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-white/80">Business / Company</label>
                        <input name="company" value={formData.company} onChange={handleChange} type="text" className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow" placeholder="Company name" />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-white/80">Email *</label>
                        <input required name="email" value={formData.email} onChange={handleChange} type="email" className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow" placeholder="you@company.com" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-white/80">Phone</label>
                        <input name="phone" value={formData.phone} onChange={handleChange} type="tel" className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow" placeholder="Optional" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-white/80">What do you need?</label>
                      <select name="service" value={formData.service} onChange={handleChange} className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow appearance-none">
                        <option value="">Select an option</option>
                        <option value="website">Website</option>
                        <option value="webapp">Web Application</option>
                        <option value="mobile">Mobile App</option>
                        <option value="ai">AI Automation</option>
                        <option value="seo">SEO</option>
                        <option value="marketing">Digital Marketing</option>
                        <option value="ecommerce">eCommerce</option>
                        <option value="other">Something else</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-white/80">Anything we should know beforehand?</label>
                      <textarea name="notes" value={formData.notes} onChange={handleChange} rows={2} className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow resize-none" placeholder="Optional" />
                    </div>

                    <button disabled={submitting} type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] flex items-center justify-center gap-2 mt-2">
                      {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                      {submitting ? 'Booking...' : 'Confirm Booking'}
                    </button>
                  </form>
                )}
              </>
            )}
          </motion.div>
        </div>
      </section>
    </main>
  );
}
