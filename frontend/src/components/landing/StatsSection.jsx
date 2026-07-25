import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const stats = [
  { value: '50,000+', label: 'Properties Listed', icon: '🏠', color: 'from-blue-500 to-blue-600' },
  { value: '200+', label: 'Cities Covered', icon: '🌏', color: 'from-emerald-500 to-emerald-600' },
  { value: '2M+', label: 'Happy Users', icon: '❤️', color: 'from-rose-500 to-rose-600' },
  { value: '₹0', label: 'Brokerage Fee', icon: '💰', color: 'from-amber-500 to-amber-600' },
];

export default function StatsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-16 bg-gray-50 dark:bg-gray-900/50 mt-10">
      <div className="page-container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white dark:bg-gray-900 rounded-2xl p-6 text-center border border-gray-100 dark:border-gray-800 shadow-card hover:shadow-card-hover transition-all group"
            >
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-3 text-xl shadow-md group-hover:-translate-y-1 transition-transform`}>
                {stat.icon}
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
