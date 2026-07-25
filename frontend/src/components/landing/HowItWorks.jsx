import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const steps = [
  {
    step: '01',
    title: 'Search & Discover',
    desc: 'Browse thousands of verified properties using our smart search and advanced filters.',
    icon: '🔍',
    color: 'from-blue-500 to-blue-600',
  },
  {
    step: '02',
    title: 'Schedule a Visit',
    desc: 'Book a property visit directly with the owner. No brokers, no middlemen.',
    icon: '📅',
    color: 'from-purple-500 to-purple-600',
  },
  {
    step: '03',
    title: 'Connect with Owner',
    desc: 'Chat or call the property owner directly. Get all your questions answered instantly.',
    icon: '💬',
    color: 'from-emerald-500 to-emerald-600',
  },
  {
    step: '04',
    title: 'Move In & Enjoy',
    desc: 'Finalize the deal securely and settle into your new home hassle-free.',
    icon: '🏠',
    color: 'from-rose-500 to-rose-600',
  },
];

export default function HowItWorks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="py-20 bg-white dark:bg-gray-950">
      <div className="page-container">
        <div className="text-center mb-14">
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            className="text-primary-600 dark:text-primary-400 font-semibold text-sm uppercase tracking-widest mb-2"
          >
            Simple & Easy
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="section-title"
          >
            How HouseHunt Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="section-subtitle mx-auto text-center"
          >
            From search to move-in, we make the entire process seamless in just 4 steps.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connecting line */}
          <div className="absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-rose-200 dark:from-blue-900 dark:via-purple-900 dark:to-rose-900 hidden lg:block mx-24" />

          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.12 }}
              className="relative flex flex-col items-center text-center"
            >
              {/* Icon circle */}
              <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-2xl mb-5 shadow-lg z-10`}>
                {step.icon}
                <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-white dark:bg-gray-950 rounded-full flex items-center justify-center border-2 border-gray-100 dark:border-gray-800">
                  <span className="text-xs font-bold text-gray-600 dark:text-gray-400">{step.step}</span>
                </div>
              </div>

              <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">{step.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
