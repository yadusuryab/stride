"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import {
  Crown,
  Gem,
  Shield,
  Truck,
  RefreshCw,
  MessageCircle,
  Sparkles,
  Star,
  ArrowRight,
  TrendingUp,
  CheckCircle,
} from "lucide-react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import ss from "@/public/ss.png";
import Link from "next/link";

export default function AboutUsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredService, setHoveredService] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.1 });
  const isStatsInView = useInView(statsRef, { once: false, amount: 0.3 });

  // Enhanced parallax effects
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [-30, 30]);
  const y2 = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 15]);
  const rotate2 = useTransform(scrollYProgress, [0, 1], [0, -15]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { 
        duration: 0.8, 
        ease: [0.25, 0.46, 0.45, 0.94] 
      },
    },
  };

  const services = [
    {
      icon: <Crown className="w-6 h-6" />,
      title: "Premium First-Copy",
      description: "Hand-picked watches that look like the originals — clean finishes, solid feel, high value for the price.",
      features: ["Premium Materials", "1:1 Craftsmanship", "Luxury Finishing"],
      position: "left",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Quality-Checked",
      description: "Every piece gets a quick quality check before packing — no nonsense, just reliable looks.",
      features: ["Thorough Inspection", "Quality Assurance", "Reliable Performance"],
      position: "left",
    },
    {
      icon: <Gem className="w-6 h-6" />,
      title: "COD Available",
      description: "Cash on Delivery across India — order without worry and pay when the parcel arrives.",
      features: ["Secure Payment", "Nationwide COD", "Risk-Free Shopping"],
      position: "left",
    },
  ];

  const stats = [
    { 
      icon: <Crown className="w-6 h-6" />, 
      value: 3, 
      label: "Years of Excellence", 
      suffix: "+",
      color: "from-amber-500 to-yellow-500"
    },
    { 
      icon: <TrendingUp className="w-6 h-6" />, 
      value: 6246, 
      label: "Luxury Community", 
      suffix: "+",
      color: "from-emerald-500 to-teal-500"
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      value: 17423,
      label: "Satisfied Clients",
      suffix: "+",
      color: "from-blue-500 to-cyan-500"
    },
  ];

  return (
    <section
      id="about-section"
      ref={sectionRef}
      className="w-full px-4 py-32 bg-gradient-to-br from-slate-50 via-white to-amber-50/30 overflow-hidden relative"
    >
      {/* Luxury background elements */}
      <motion.div
        className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-amber-200/10 to-transparent rounded-full blur-3xl"
        style={{ y: y1, rotate: rotate1, opacity }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tl from-slate-200/10 to-transparent rounded-full blur-3xl"
        style={{ y: y2, rotate: rotate2, opacity }}
      />
      
      {/* Floating luxury elements */}
      <motion.div
        className="absolute top-20 left-20 w-2 h-2 bg-amber-400 rounded-full"
        animate={{
          y: [0, -20, 0],
          opacity: [0.3, 1, 0.3],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-32 right-32 w-3 h-3 bg-slate-400 rounded-full"
        animate={{
          y: [0, 25, 0],
          opacity: [0.4, 1, 0.4],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      <motion.div
        className="container mx-auto max-w-7xl relative z-10"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        {/* Header Section */}
        <motion.div
          className="flex flex-col items-center mb-20"
         
        >
          <motion.div
            className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-6 py-3 rounded-full mb-6 shadow-lg shadow-amber-500/25"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-semibold tracking-wider">EXCLUSIVE LUXURY COLLECTION</span>
            <Sparkles className="w-4 h-4" />
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-light text-slate-900 mb-6 text-center tracking-tight">
            The Art of <span className="font-serif italic">Timeless</span> Elegance
          </h2>
          
          <motion.div
            className="w-32 h-0.5 bg-gradient-to-r from-amber-500 to-transparent"
            initial={{ width: 0 }}
            animate={{ width: 128 }}
            transition={{ duration: 1.2, delay: 0.8 }}
          />
        </motion.div>

        {/* Main Content */}
        <motion.p
          className="text-center max-w-3xl mx-auto mb-20 text-lg text-slate-600 leading-relaxed font-light"
         
        >
          For over three years, <span className="font-semibold text-slate-900">watchz</span> has been the trusted destination 
          for connoisseurs seeking premium timepieces. Based in Tirur, we curate exceptional first-copy watches 
          that embody luxury without compromise.
        </motion.p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 relative">
          {/* Services Column */}
          <div className="space-y-8">
            {services.map((service, index) => (
              <LuxuryServiceItem
                key={index}
                {...service}
                index={index}
                isHovered={hoveredService === index}
                onHover={() => setHoveredService(index)}
                onLeave={() => setHoveredService(null)}
              />
            ))}
          </div>

          {/* Center Image Showcase */}
          <div className="flex justify-center items-center order-first lg:order-none mb-12 lg:mb-0">
            <motion.div
              className="relative w-full max-w-md"
             
            >
              <motion.div
                className="relative rounded-3xl overflow-hidden shadow-2xl"
                initial={{ scale: 0.95, opacity: 0, rotateY: 10 }}
                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                whileHover={{ 
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
              >
                {/* Premium image container */}
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={ss.src}
                    alt="Luxury Watch Collection"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-slate-900/20" />
                  
                  {/* Overlay content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-8">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 1 }}
                    >
                      <Link href={process.env.NEXT_PUBLIC_INSTA || ''}>
                        <motion.button
                          className="bg-white/95 backdrop-blur-sm text-slate-900 px-8 py-4 rounded-2xl flex items-center gap-3 font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white"
                          whileHover={{ scale: 1.05, x: 5 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Sparkles className="w-4 h-4" />
                          Explore Our Gallery
                          <ArrowRight className="w-4 h-4" />
                        </motion.button>
                      </Link>
                    </motion.div>
                  </div>
                </div>
                
                {/* Decorative border */}
                <div className="absolute inset-0 rounded-3xl border border-white/20 pointer-events-none" />
              </motion.div>

              {/* Floating badges */}
              <motion.div
                className="absolute -top-4 -right-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-4 py-2 rounded-full shadow-lg"
                initial={{ opacity: 0, scale: 0, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
              >
                <span className="text-sm font-semibold">Premium</span>
              </motion.div>
            </motion.div>
          </div>

          {/* Features Column */}
          <div className="space-y-8">
            <LuxuryFeature
              icon={<Shield className="w-6 h-6" />}
              title="Authentic Craftsmanship"
              description="Every piece reflects the precision and elegance of original designs"
            />
            <LuxuryFeature
              icon={<Truck className="w-6 h-6" />}
              title="Nationwide Delivery"
              description="Secure shipping with premium packaging across India"
            />
            <LuxuryFeature
              icon={<CheckCircle className="w-6 h-6" />}
              title="Quality Guarantee"
              description="Rigorous quality checks ensure perfection in every detail"
            />
          </div>
        </div>

        {/* Enhanced Stats Section */}
        <motion.div
          ref={statsRef}
          className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8"
          initial="hidden"
          animate={isStatsInView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          {stats.map((stat, index) => (
            <LuxuryStatCounter
              key={index}
              {...stat}
              delay={index * 0.15}
            />
          ))}
        </motion.div>

        {/* Premium CTA Section */}
        <motion.div
          className="mt-24 bg-gradient-to-r from-slate-900 to-slate-800 p-12 rounded-3xl relative overflow-hidden"
          initial={{ opacity: 0, y: 40 }}
          animate={isStatsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:20px_20px]" />
          </div>
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex-1 text-center lg:text-left">
              <h3 className="text-5xl font-light text-white mb-4">
                Experience <span className="font-serif italic">Luxury</span> Timekeeping
              </h3>
              <p className="text-slate-300 text-lg font-light">
                Connect with our luxury consultants for personalized service
              </p>
            </div>
            <Link href={`https://wa.me/${process.env.NEXT_PUBLIC_PHONE}?text=Hi+${process.env.NEXT_PUBLIC_APP_NAME}`}>
              <motion.button
                className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white px-10 py-4 rounded-2xl flex items-center gap-3 font-semibold shadow-2xl hover:shadow-amber-500/25 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <MessageCircle className="w-5 h-5" />
                Begin Conversation
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

// Luxury Service Item Component
function LuxuryServiceItem({ 
  icon, 
  title, 
  description, 
  features, 
  index, 
  isHovered, 
  onHover, 
  onLeave 
}: any) {
  return (
    <motion.div
      className="group relative p-8 rounded-2xl bg-white/70 backdrop-blur-sm border border-slate-200/50 hover:border-amber-200/50 transition-all duration-500 cursor-pointer"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      whileHover={{ 
        y: -8,
        scale: 1.02,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
      }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Hover gradient */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10">
        <motion.div 
          className="flex items-center gap-4 mb-4"
          animate={isHovered ? { x: 5 } : { x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="p-3 rounded bg-gradient-to-br from-amber-500 to-yellow-500 text-white shadow-lg"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            {icon}
          </motion.div>
          <h3 className="text-2xl font-semibold text-slate-900 group-hover:text-amber-600 transition-colors duration-300">
            {title}
          </h3>
        </motion.div>
        
        <motion.p
          className="text-slate-600 leading-relaxed mb-4 font-light"
          animate={isHovered ? { opacity: 1 } : { opacity: 0.8 }}
        >
          {description}
        </motion.p>

        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="flex flex-wrap gap-2"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {features?.map((feature: string, i: number) => (
                <motion.span
                  key={i}
                  className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  {feature}
                </motion.span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// Luxury Feature Component
function LuxuryFeature({ icon, title, description }: any) {
  return (
    <motion.div
      className="flex items-start gap-4 p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-slate-200/30 hover:border-slate-300/50 transition-all duration-300 group"
      whileHover={{ y: -4, backgroundColor: "rgba(255, 255, 255, 0.8)" }}
    >
      <motion.div
        className="p-3 rounded bg-slate-100 text-slate-700 group-hover:bg-amber-100 group-hover:text-amber-600 transition-colors duration-300"
        whileHover={{ scale: 1.1 }}
      >
        {icon}
      </motion.div>
      <div>
        <h4 className="font-semibold text-slate-900 mb-2">{title}</h4>
        <p className="text-slate-600 text-sm font-light leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
}

// Enhanced Luxury Stat Counter
function LuxuryStatCounter({ icon, value, label, suffix, color, delay }: any) {
  const countRef = useRef(null);
  const isInView = useInView(countRef, { once: false });
  const [hasAnimated, setHasAnimated] = useState(false);

  const springValue = useSpring(0, {
    stiffness: 30,
    damping: 10,
  });

  useEffect(() => {
    if (isInView && !hasAnimated) {
      springValue.set(value);
      setHasAnimated(true);
    }
  }, [isInView, value, springValue, hasAnimated]);

  const displayValue = useTransform(springValue, (latest) =>
    Math.floor(latest)
  );

  return (
    <motion.div
      ref={countRef}
      className="relative p-8 rounded-3xl bg-white/80 backdrop-blur-sm border border-slate-200/50 group hover:bg-white transition-all duration-500 overflow-hidden"
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.8, delay },
        },
      }}
      whileHover={{ y: -8, scale: 1.02 }}
    >
      {/* Animated background on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
      
      <div className="relative z-10 text-center">
        <motion.div
          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center mb-6 mx-auto border border-slate-200/50 group-hover:scale-110 transition-transform duration-300"
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.8 }}
        >
          <div className={`bg-gradient-to-br ${color} bg-clip-text text-transparent`}>
            {icon}
          </div>
        </motion.div>
        
        <motion.div
          className={`text-5xl font-bold bg-gradient-to-br ${color} bg-clip-text text-transparent mb-2`}
        >
          <motion.span>{displayValue}</motion.span>
          <span>{suffix}</span>
        </motion.div>
        
        <p className="text-slate-600 font-light text-sm tracking-wide">
          {label}
        </p>
        
        <motion.div
          className="w-12 h-0.5 bg-gradient-to-r from-transparent via-slate-300 to-transparent mx-auto mt-4 group-hover:w-20 transition-all duration-500"
          initial={{ width: 48 }}
          whileHover={{ width: 80 }}
        />
      </div>
    </motion.div>
  );
}