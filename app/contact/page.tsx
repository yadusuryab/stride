"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { IconBrandInstagram, IconMail, IconPhone } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

// ── Contact channels ──────────────────────────────────────────────────────────
const CHANNELS = [
  {
    icon: (
    <IconMail/>
    ),
    label: "Email",
    value: process.env.NEXT_PUBLIC_EMAIL,
    href: `mailto:${process.env.NEXT_PUBLIC_EMAIL}`,
    hint: "We reply within 24 hours",
  },
  {
    icon: (
     <IconPhone/>
    ),
    label: "Phone / WhatsApp",
    value:process.env.NEXT_PUBLIC_PHONE,
    href: process.env.NEXT_PUBLIC_WHATSAPP,
    hint: "Mon – Sat, 9 am – 8 pm IST",
  },
  {
    icon: (
     <IconBrandInstagram/>
    ),
    label: "Instagram",
    value: "@watchz_in_kerala",
    href: process.env.NEXT_PUBLIC_INSTA,
    hint: "DM us anytime",
  },
];

type FormState = "idle" | "sending" | "sent" | "error";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<FormState>("idle");
  const [focused, setFocused] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    
    setStatus("sending");
    
    try {
      // Get WhatsApp number from environment variable
      const whatsappNumber = process.env.NEXT_PUBLIC_PHONE;
      
      if (!whatsappNumber) {
        throw new Error("WhatsApp number not configured");
      }
      
      // Format the message
      const message = `*New Contact Form Submission*%0a%0a*Name:* ${form.name}%0a*Email:* ${form.email}%0a*Message:* ${form.message}`;
      
      // Create WhatsApp URL (remove any non-numeric characters from phone number)
      const cleanNumber = whatsappNumber.replace(/\D/g, '');
      const whatsappUrl = `https://wa.me/${cleanNumber}?text=${message}`;
      
      // Open WhatsApp in a new tab
      window.open(whatsappUrl, '_blank');
      
      // Optional: Also simulate API call or track submission
      await new Promise((r) => setTimeout(r, 500));
      
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
      
      // Reset status after 3 seconds
      setTimeout(() => setStatus("idle"), 3000);
      
    } catch (error) {
      console.error("Error:", error);
      setStatus("error");
      
      // Reset error status after 3 seconds
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const inputBase = `w-full bg-transparent text-sm font-light leading-relaxed
     outline-none resize-none
    transition-colors duration-200`;

  const fieldWrapper = (name: string) =>
    `relative border rounded-xl px-4 py-3.5 transition-all duration-250
    ${focused === name
      ? "ring-2 ring-primary"
      : "ring-none"}`;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=DM+Sans:wght@300;400;500&display=swap');



        .glass {
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--border);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }

        .gradient-line {
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(20,184,154,0.3), transparent);
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.65s cubic-bezier(0.16,1,0.3,1) both; }
        .d1 { animation-delay: 0.05s; }
        .d2 { animation-delay: 0.13s; }
        .d3 { animation-delay: 0.22s; }
        .d4 { animation-delay: 0.32s; }

        .channel-card {
          transition: border-color 0.25s ease, background 0.25s ease, transform 0.25s ease;
        }
        .channel-card:hover {
          border-color: rgba(20,184,154,0.3);
          background: rgba(20,184,154,0.04);
          transform: translateY(-2px);
        }

        .submit-btn {
          background: linear-gradient(135deg, #0d6e5e 0%, #14b89a 100%);
          transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s;
        }
        .submit-btn:hover:not(:disabled) {
          opacity: 0.88;
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(20,184,154,0.25);
        }
        .submit-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        .teal-dot {
          display: inline-block;
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--teal-light);
          box-shadow: 0 0 8px rgba(20,184,154,0.6);
        }
      `}</style>

      <div >
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-16 md:py-24">

          {/* ── Header ── */}
          <div className="mb-14 md:mb-20">
            <div className="fade-up d1 flex items-center gap-3 mb-5">
              <span className="text-[10px] tracking-[0.3em] uppercase font-mono">
                Get in touch
              </span>
            </div>
            <h1 className="fade-up d2 serif text-2xl font-bold
              leading-[0.92] tracking-tight ">
              We'd love to<br /><em className="text-primary">hear from you.</em>
            </h1>
            <p className="fade-up d3 mt-5 text-muted-foreground text-sm md:text-base font-light
              leading-relaxed max-w-sm">
              Questions, order support, or just want to say hi — we're quick to reply.
            </p>
          </div>


          {/* ── Two-column layout ── */}
          <div className="grid md:grid-cols-[1fr_1.1fr] gap-10 md:gap-16 items-start">

            {/* LEFT — contact channels ── */}
            <div className="fade-up d3 space-y-3">
              <p className="text-[10px] tracking-[0.25em] uppercase font-mono  mb-6">
                Reach us directly
              </p>

              {CHANNELS.map((ch) => (
                <Link
                  key={ch.label}
                  href={ch.href || ''}
                target="_blank"
                  rel="noopener noreferrer"
                  className="channel-card ring-1 ring-primary/20  flex  justify-between items-start gap-4 p-5 rounded-2xl no-underline block"
                >
                  <div className="flex gap-2">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0
                     bg-primary/10 text-primary 
                   ">
                    {ch.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs tracking-[0.18em]  uppercase font-mono mb-0.5">
                      {ch.label}
                    </p>
                    <p className="text-sm text-primary font-bold text-wrap max-w-[200px]">{ch.value}</p>
                    <p className="text-[11.5px] text-muted-foreground mt-0.5 font-light">{ch.hint}</p>
                  </div>
                  </div>
                 
                 <ArrowRight className="text-primary"/>
                </Link>
              ))}

              {/* Business hours */}
          
            </div>

            {/* RIGHT — message form ── */}
            <div className="fade-up d4">
              <div className=" rounded-3xl p-7 md:p-9 relative overflow-hidden">
                {/* Glow */}
                <div className="absolute -bottom-12 -right-12 w-56 h-56 rounded-full
                   blur-3xl pointer-events-none" />

                <div className="relative">
                  <p className="text-[10px] tracking-[0.25em] uppercase font-mono  mb-7">
                    Send a message
                  </p>

                  {status === "sent" ? (
                    <div className="text-center py-10">
                      <div className="w-14 h-14 rounded-full  border 
                        flex items-center justify-center mx-auto mb-5 ">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      </div>
                      <h3 className="serif text-2xl font-light  mb-2">Message sent!</h3>
                      <p className="text-sm text-muted-foreground font-light mb-7">
                        We'll get back to you within 24 hours.
                      </p>
                      <button
                        onClick={() => setStatus("idle")}
                        className="text-xs tracking-[0.15em] uppercase font-mono 
                          border-b  pb-px 
                          transition-colors duration-200"
                      >
                        Send another
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Name */}
                      <div className={fieldWrapper("name")}>
                        <label className="block text-[9px] tracking-[0.22em] uppercase font-mono
                          text-muted-foreground mb-1.5">
                          Your name
                        </label>
                        <input
                          type="text"
                          value={form.name}
                          onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                          onFocus={() => setFocused("name")}
                          onBlur={() => setFocused(null)}
                          placeholder="John Doe"
                          required
                          className={inputBase}
                        />
                      </div>

                      {/* Email */}
                      <div className={fieldWrapper("email")}>
                        <label className="block text-[9px] tracking-[0.22em] uppercase font-mono
                          text-muted-foreground mb-1.5">
                          Email address
                        </label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                          onFocus={() => setFocused("email")}
                          onBlur={() => setFocused(null)}
                          placeholder="you@example.com"
                          required
                          className={inputBase}
                        />
                      </div>

                      {/* Message */}
                      <div className={fieldWrapper("message")}>
                        <label className="block text-[9px] tracking-[0.22em] uppercase font-mono
                          text-muted-foreground mb-1.5">
                          Message
                        </label>
                        <textarea
                          value={form.message}
                          onChange={(e) => setForm(f => ({ ...f, message: e.target.value }))}
                          onFocus={() => setFocused("message")}
                          onBlur={() => setFocused(null)}
                          placeholder="How can we help you?"
                          rows={4}
                          required
                          className={inputBase}
                        />
                      </div>

                      {status === "error" && (
                        <p className="text-[11.5px] text-red-400/80 font-light">
                          Something went wrong. Please try WhatsApp or email directly.
                        </p>
                      )}

                      <Button
                        type="submit"
                        disabled={status === "sending" || !form.name || !form.email || !form.message}
                       className="w-full"
                      >
                        {status === "sending" ? (
                          <>
                            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeOpacity="0.25"/>
                              <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                            Sending…
                          </>
                        ) : (
                          <>
                            Send Message
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </>
                        )}
                      </Button>

                      <p className="text-[10.5px] text-white/20 text-center font-light leading-relaxed">
                        Or reach us faster on{" "}
                        <Link href={process.env.NEXT_PUBLIC_WHATSAPP || ''} target="_blank" rel="noopener noreferrer"
                          className=" hover:opacity-100 transition-opacity">
                          WhatsApp
                        </Link>
                        {" "}or{" "}
                        <Link href={process.env.NEXT_PUBLIC_INSTAGRAM || ''} target="_blank" rel="noopener noreferrer"
                          className=" hover:opacity-100 transition-opacity">
                          Instagram DM
                        </Link>
                      </p>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}