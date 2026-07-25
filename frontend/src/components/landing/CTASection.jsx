import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Home, PlusCircle } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="py-20">
      <div className="page-container">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-primary-700 to-accent-700 p-12 md:p-16 text-center">
          {/* Background decorations */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full" />
            <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-white/5 rounded-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/3 rounded-full" />
          </div>

          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 text-white/90 text-sm font-medium mb-6"
            >
              🏠 Join HouseHunt Today — It's Free
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4"
            >
              Find Your Perfect Home<br />in Minutes
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-white/70 text-lg max-w-xl mx-auto mb-10"
            >
              Join 2 million users who trust HouseHunt to find their dream property. Zero fees. Zero hassle.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <Link
                to="/properties"
                className="flex items-center gap-2 px-7 py-3.5 bg-white text-primary-700 font-bold rounded-xl hover:bg-gray-50 transition-all hover:shadow-lg group"
              >
                <Home className="w-5 h-5" />
                Browse Properties
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/register?role=owner"
                className="flex items-center gap-2 px-7 py-3.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold rounded-xl hover:bg-white/20 transition-all"
              >
                <PlusCircle className="w-5 h-5" />
                List Your Property
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
