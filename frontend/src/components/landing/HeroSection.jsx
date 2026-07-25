import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Star, Shield, Zap } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-[20s] hover:scale-110"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1800)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950/90 via-primary-950/80 to-gray-950/70" />
        {/* Radial highlight */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(37,99,235,0.15),transparent_60%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 page-container py-24 pt-32">
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-medium mb-6"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            India's #1 Property Marketplace
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-6"
          >
            Find Your Perfect{' '}
            <span className="relative">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-300 to-accent-300">
                Dream Home
              </span>
              <motion.svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 300 12"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.8, duration: 1 }}
              >
                <path d="M2 8 Q75 2 150 6 Q225 10 298 4" stroke="url(#grad)" strokeWidth="3" fill="none" strokeLinecap="round" />
                <defs>
                  <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#93c5fd" />
                    <stop offset="100%" stopColor="#d8b4fe" />
                  </linearGradient>
                </defs>
              </motion.svg>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="text-lg sm:text-xl text-white/70 max-w-xl mb-10 leading-relaxed"
          >
            Explore 50,000+ verified properties across India. Zero brokerage, transparent pricing, and direct owner connections.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="flex flex-wrap gap-4"
          >
            <Link to="/properties" className="btn-primary text-base px-7 py-3.5 gap-2.5">
              Explore Properties
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/register?role=owner"
              className="flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold text-base hover:bg-white/20 transition-all"
            >
              List Your Property
            </Link>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex flex-wrap items-center gap-6 mt-12"
          >
            {[
              { icon: Shield, text: 'Verified Listings' },
              { icon: Star, text: '4.8/5 Rating' },
              { icon: Zap, text: 'Instant Booking' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-white/60 text-sm">
                <Icon className="w-4 h-4 text-white/40" />
                <span>{text}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Floating Property Cards */}
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="absolute right-8 bottom-20 hidden xl:block"
        >
          <div className="space-y-3">
            {[
              { img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=200', title: '3BHK Villa, Whitefield', price: '₹65,000/mo', badge: 'Featured' },
              { img: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=200', title: '2BHK Apartment, HSR', price: '₹28,000/mo', badge: 'New' },
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + i * 0.15 }}
                className="flex items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-3 w-64"
              >
                <img src={card.img} alt={card.title} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                <div>
                  <p className="text-white text-xs font-semibold leading-tight">{card.title}</p>
                  <p className="text-primary-300 text-sm font-bold mt-0.5">{card.price}</p>
                  <span className={`inline-block text-xs font-medium px-1.5 py-0.5 rounded mt-0.5 ${i === 0 ? 'bg-amber-500/30 text-amber-300' : 'bg-green-500/30 text-green-300'}`}>{card.badge}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2">
          <div className="w-1 h-2 bg-white/60 rounded-full" />
        </div>
        <span className="text-white/40 text-xs">Scroll</span>
      </motion.div>
    </section>
  );
}
