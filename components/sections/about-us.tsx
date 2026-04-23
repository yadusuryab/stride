"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import {
  Award,
  Users,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  PackageCheck,
  Banknote,
} from "lucide-react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useSpring,
  MotionValue,
} from "framer-motion";
import ss from "@/public/ss2.jpeg";
import Link from "next/link";
import { Iphone } from "../ui/iphone";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { IconBrandInstagram } from "@tabler/icons-react";

/* ─────────────────────────────────────────
   Data
───────────────────────────────────────── */
const instagramAccounts = [
  { id: "stride.shoppe",     label: "Main Store" },
 
];
const services = [
  {
    icon: ShieldCheck,
    title: "Premium High Quality Watches",
    description:
      "Hand-picked watches that look like the originals — clean finishes, solid feel, high value for the price.",
  },
  {
    icon: PackageCheck,
    title: "Quality-Checked",
    description:
      "Every piece gets a thorough quality check before packing — no nonsense, just reliable looks.",
  },
  // {
  //   icon: Banknote,
  //   title: "COD Available",
  //   description:
  //     "Cash on Delivery across India — order without worry and pay when the parcel arrives.",
  // },
];

const stats = [
  { icon: Award,      value: 3,     label: "Years in Market",      suffix: "+" },
  { icon: Users,      value: 5757,  label: "Instagram Followers",  suffix: "+" },
  { icon: TrendingUp, value: 42346, label: "Happy Customers",      suffix: "+" },
];

/* ─────────────────────────────────────────
   Animation variants
───────────────────────────────────────── */
const fadeUp :any= {
  hidden:  { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1], delay },
  }),
};

const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

/* ─────────────────────────────────────────
   Main component
───────────────────────────────────────── */
export default function AboutUsSection() {
  const sectionRef  = useRef<HTMLDivElement>(null);
  const statsRef    = useRef<HTMLDivElement>(null);
  const isInView    = useInView(sectionRef, { once: true, amount: 0.08 });
  const isStatsView = useInView(statsRef,   { once: true, amount: 0.2  });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const blobY1 = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const blobY2 = useTransform(scrollYProgress, [0, 1], [0,  40]);

  return (
    <section
      id="about-section"
      ref={sectionRef}
      className="relative w-full py-24 overflow-hidden"
    >
      {/* ── Ambient blobs ── */}
      <motion.div
        style={{ y: blobY1 }}
        className="pointer-events-none absolute top-16 -left-20 w-72 h-72 rounded-full bg-primary/6 blur-[80px]"
      />
      <motion.div
        style={{ y: blobY2 }}
        className="pointer-events-none absolute bottom-16 -right-20 w-96 h-96 rounded-full bg-primary/4 blur-[100px]"
      />

      {/* Floating dots */}
      {[
        { top: "30%", left: "18%", size: 5,  dur: 3,   delay: 0   },
        { top: "65%", right: "22%", size: 7, dur: 4,   delay: 1.2 },
        { top: "15%", right: "35%", size: 4, dur: 3.5, delay: 0.6 },
      ].map((dot, i) => (
        <motion.span
          key={i}
          className="pointer-events-none absolute rounded-full bg-primary/25"
          style={{
            width: dot.size, height: dot.size,
            top: dot.top, left: (dot as any).left, right: (dot as any).right,
          }}
          animate={{ y: [0, -12, 0], opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: dot.dur, repeat: Infinity, ease: "easeInOut", delay: dot.delay }}
        />
      ))}

      <div className="container mx-auto max-w-6xl px-4 relative z-10">

        {/* ── Section heading ── */}
        <motion.div
          className="flex flex-col items-center mb-6 text-center"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={stagger}
        >
          <motion.span
            variants={fadeUp}
            custom={0}
            className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.18em] uppercase text-primary mb-3"
          >
            <span className="w-5 h-px bg-primary/60 rounded-full" />
            Discover Our Story
            <span className="w-5 h-px bg-primary/60 rounded-full" />
          </motion.span>

          <motion.h2
            variants={fadeUp}
            custom={0.1}
            className="text-3xl md:text-4xl font-hd tracking-tight mb-4"
          >
            About{" "}
            <span className="text-primary">stride.</span>
          </motion.h2>

          <motion.div
            variants={fadeUp}
            custom={0.2}
            className="overflow-hidden"
          >
            <motion.div
              className="h-[3px] w-20 rounded-full bg-primary/30 mx-auto"
              initial={{ scaleX: 0, originX: 0 }}
              animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 0.9, delay: 0.5, ease: [0.4, 0, 0.2, 1] }}
            />
          </motion.div>
        </motion.div>
        <motion.p
  className="text-center max-w-xl mx-auto text-sm md:text-base font-semibold mb-12 text-muted-foreground leading-tight px-4"
  initial="hidden"
  animate={isInView ? "visible" : "hidden"}
  variants={fadeUp}
  custom={0.3}
>
  We're Stride, a premium fashion store based in Kannur, Kerala, trusted for years.
  We offer high-quality watches and fashion accessories inspired by Rolex, Omega, and Casio—at everyday prices with all-India delivery.
</motion.p>
        {/* ── 3-col layout ── */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-10 items-center">

          {/* Services list */}
          <motion.div
            className="space-y-8"
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={stagger}
          >
            {services.map((s, i) => (
              <ServiceCard key={i} {...s} delay={i * 0.1} />
            ))}
          </motion.div>

          {/* Centre image */}
          <motion.div
            className="order-first md:order-none flex justify-center"
            initial={{ opacity: 0, scale: 0.88 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.88 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="relative w-56 md:w-64 shrink-0">
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-3xl bg-primary/10 blur-2xl scale-110 -z-10" />

              <motion.div
                whileHover={{ scale: 1.025, transition: { duration: 0.3 } }}
              >
                <Iphone
                  src={ss.src}
                
                />

                {/* Overlay CTA */}
                <div className="absolute inset-0 flex items-end justify-center p-4 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <Link href={process.env.NEXT_PUBLIC_INSTA || "#"}>
                    <motion.span
                      className="inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-foreground text-xs font-semibold px-4 py-2 rounded-full shadow"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.96 }}
                    >
                      Our Instagram <ArrowRight className="w-3.5 h-3.5" />
                    </motion.span>
                  </Link>
                </div>
              </motion.div>

              {/* Always-visible Instagram pill below image */}
              <motion.div
  className="mt-4 flex flex-col items-center gap-2"
  initial={{ opacity: 0, y: 10 }}
  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
  transition={{ delay: 0.9, duration: 0.5 }}
>
  {instagramAccounts.map((acc) => (
  <Link key={acc.id} href={`https://instagram.com/${acc.id}`} target="_blank">
  <Button
    className="w-full md:min-w-[400px]  rounded-full flex  justify-between"
    variant="secondary"
    size={'lg'}
  >
      <IconBrandInstagram className="w-4 h-4 text-primary shrink-0" />
      <span className="font-medium">{acc.label}</span>
    <Badge  className="rounded-full  font-normal">
      @{acc.id} 
    </Badge>
  </Button>
</Link>
  ))}
</motion.div>
            </div>
          </motion.div>

          {/* Right column placeholder — keeps symmetry when right services are commented out */}
          <div className="hidden md:block" />
        </div>

        {/* ── Stats ── */}
        <motion.div
          ref={statsRef}
          className="mt-24 flex flex-wrap justify-center sm:grid-cols-3 gap-3"
          initial="hidden"
          animate={isStatsView ? "visible" : "hidden"}
          variants={stagger}
        >
          {stats.map((s, i) => (
            <StatCard key={i} {...s} delay={i * 0.1} isInView={isStatsView} />
          ))}
        </motion.div>

        {/* ── CTA banner ── */}
        <motion.div
          className="mt-16 rounded-2xl bg-secondary text-secondary-foreground border border-border/50 backdrop-blur-sm p-8 flex flex-col sm:flex-row items-center justify-between gap-6"
          initial={{ opacity: 0, y: 32 }}
          animate={isStatsView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
          transition={{ duration: 0.7, delay: 0.45, ease: [0.4, 0, 0.2, 1] }}
        >
          <div>
            <h3 className="text-xl font-hd mb-1">Want to talk to us?</h3>
            <p className="text-sm text-muted-foreground">Let's chat on WhatsApp — we reply fast.</p>
          </div>
          <Link
            href={`https://wa.me/${process.env.NEXT_PUBLIC_PHONE}?text=Hi+${process.env.NEXT_PUBLIC_APP_NAME}`}
          >
            <motion.span
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              Send Message <ArrowRight className="w-4 h-4" />
            </motion.span>
          </Link>
        </motion.div>

      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   ServiceCard
───────────────────────────────────────── */
function ServiceCard({
  icon: Icon,
  title,
  description,
  delay,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  delay: number;
}) {
  return (
    <motion.div
      className="group flex items-start gap-4"
      variants={fadeUp}
      custom={delay}
      whileHover={{ x: 4, transition: { duration: 0.2 } }}
    >
      <motion.div
        className="shrink-0 flex items-center justify-center w-11 h-11 rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary/20"
        whileHover={{ rotate: [0, -8, 8, -4, 0], transition: { duration: 0.45 } }}
      >
        <Icon size={18} strokeWidth={1.8} />
      </motion.div>
      <div className="min-w-0">
        <h3 className="text-sm font-semibold mb-1 group-hover:text-primary transition-colors duration-200">
          {title}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   StatCard
───────────────────────────────────────── */
function StatCard({
  icon: Icon,
  value,
  label,
  suffix,
  delay,
  isInView,
}: {
  icon: React.ElementType;
  value: number;
  label: string;
  suffix: string;
  delay: number;
  isInView: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const spring = useSpring(0, { stiffness: 45, damping: 12 });

  useEffect(() => {
    spring.set(isInView ? value : 0);
  }, [isInView, value, spring]);

  // Integer display derived from spring
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const unsub = spring.on("change", (v) => setDisplay(Math.floor(v)));
    return unsub;
  }, [spring]);

  return (
    <motion.div
      ref={ref}
      className="group relative flex flex-col items-center min-w-38 text-center p-4 rounded-2xl  transition-all duration-300"
      variants={fadeUp}
      custom={delay}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <motion.div
        className="w-12 h-12 rounded-full  flex items-center justify-center mb-4 text-primary group-hover:bg-primary/15 transition-colors duration-300"
        whileHover={{ rotate: 360, transition: { duration: 0.7 } }}
      >
        <Icon size={20} strokeWidth={1.8} />
      </motion.div>

      <div className="text-3xl font-hd tabular-nums">
        {display.toLocaleString()}
        <span className="text-primary">{suffix}</span>
      </div>
      <p className="text-xs text-muted-foreground mt-1 font-medium">{label}</p>

      <motion.div
        className="mt-3 h-[2px] rounded-full bg-primary/30"
        initial={{ width: 0 }}
        animate={isInView ? { width: 40 } : { width: 0 }}
        transition={{ duration: 0.7, delay: delay + 0.4 }}
      />
    </motion.div>
  );
}