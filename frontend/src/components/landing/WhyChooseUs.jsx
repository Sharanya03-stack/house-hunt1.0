import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Shield, Zap, Search, MessageCircle, BarChart2, Heart } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Verified Properties',
    desc: 'Every listing is manually verified by our team. No fraud, no fake listings.',
    color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
  },
  {
    icon: Zap,
    title: 'Zero Brokerage',
    desc: 'Connect directly with property owners. Save thousands in brokerage fees.',
    color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20',
  },
  {
    icon: Search,
    title: 'Smart Search',
    desc: 'AI-powered search with 20+ filters to find exactly what you need.',
    color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20',
  },
  {
    icon: MessageCircle,
    title: 'Direct Communication',
    desc: 'Chat and call property owners directly through our secure platform.',
    color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20',
  },
  {
    icon: BarChart2,
    title: 'Market Insights',
    desc: 'Get real-time pricing trends and market analytics for informed decisions.',
    color: 'text-rose-600 bg-rose-50 dark:bg-rose-900/20',
  },
  {
    icon: Heart,
    title: 'Personalized Experience',
    desc: 'Save, compare, and track properties. Get alerts for new listings matching your criteria.',
    color: 'text-pink-600 bg-pink-50 dark:bg-pink-900/20',
  },
];

export default function WhyChooseUs() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="py-20 bg-white dark:bg-gray-950">
      <div className="page-container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"
                alt="Modern home"
                className="w-full rounded-3xl shadow-2xl object-cover aspect-[4/5]"
              />
              {/* Floating card */}
              <motion.div
                className="absolute -right-8 top-1/4 bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-xl border border-gray-100 dark:border-gray-800"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                    <span className="text-xl">✅</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white text-sm">Verified</p>
                    <p className="text-xs text-gray-500">50,000+ listings</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="absolute -left-6 bottom-1/4 bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-xl border border-gray-100 dark:border-gray-800"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                    <span className="text-xl">⭐</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white text-sm">4.8/5 Rating</p>
                    <p className="text-xs text-gray-500">2M+ happy users</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right: Features */}
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              className="text-primary-600 dark:text-primary-400 font-semibold text-sm uppercase tracking-widest mb-3"
            >
              Why HouseHunt
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="section-title mb-4"
            >
              Everything You Need to Find Your Home
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.2 }}
              className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed"
            >
              We've built HouseHunt to be the smartest, safest, and most transparent property marketplace in India.
            </motion.p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
                  className="flex gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-primary-200 dark:hover:border-primary-800 transition-all group"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${feature.color} group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-0.5">{feature.title}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
