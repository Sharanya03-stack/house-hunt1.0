import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Aditya Sharma',
    role: 'Software Engineer, Bangalore',
    avatar: 'https://i.pravatar.cc/80?img=8',
    rating: 5,
    text: 'Found my dream apartment in Koramangala within 3 days of signing up! The search filters are incredibly powerful and the owner verification gave me complete peace of mind.',
  },
  {
    id: 2,
    name: 'Priya Nair',
    role: 'Marketing Manager, Mumbai',
    avatar: 'https://i.pravatar.cc/80?img=47',
    rating: 5,
    text: "HouseHunt saved me ₹60,000 in brokerage! I connected directly with the owner and got a beautiful 2BHK in Bandra. The booking process was super smooth.",
  },
  {
    id: 3,
    name: 'Rahul Patel',
    role: 'Property Owner, Pune',
    avatar: 'https://i.pravatar.cc/80?img=12',
    rating: 5,
    text: 'As a property owner, the dashboard analytics are amazing. I can track views, inquiries, and manage bookings all in one place. My property rented out in just 5 days!',
  },
  {
    id: 4,
    name: 'Sneha Reddy',
    role: 'Doctor, Hyderabad',
    avatar: 'https://i.pravatar.cc/80?img=45',
    rating: 5,
    text: 'The map view feature helped me find a flat near my hospital. The property visit booking was seamless and the owner was genuine. Highly recommend HouseHunt!',
  },
  {
    id: 5,
    name: 'Karthik Menon',
    role: 'Startup Founder, Chennai',
    avatar: 'https://i.pravatar.cc/80?img=14',
    rating: 5,
    text: 'I moved from Mumbai to Chennai and HouseHunt made the transition so easy. Found a fully furnished apartment with all amenities. Excellent platform!',
  },
];

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const next = () => setCurrent((c) => (c + 1) % testimonials.length);
  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);

  return (
    <section ref={ref} className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-950">
      <div className="page-container">
        <div className="text-center mb-12">
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            className="text-primary-600 dark:text-primary-400 font-semibold text-sm uppercase tracking-widest mb-2"
          >
            Real Stories
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="section-title"
          >
            What Our Users Say
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="section-subtitle mx-auto text-center"
          >
            Join over 2 million happy users who found their home with HouseHunt.
          </motion.p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Main testimonial */}
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="bg-white dark:bg-gray-900 rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 dark:border-gray-800 relative"
          >
            <Quote className="w-10 h-10 text-primary-100 dark:text-primary-900 absolute top-6 right-8" />

            <div className="flex gap-1 mb-4">
              {Array.from({ length: testimonials[current].rating }).map((_, i) => (
                <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
              ))}
            </div>

            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-8 font-medium italic">
              "{testimonials[current].text}"
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={testimonials[current].avatar}
                  alt={testimonials[current].name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-primary-100 dark:border-primary-900"
                />
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">{testimonials[current].name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{testimonials[current].role}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={prev}
                  className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-primary-100 dark:hover:bg-primary-900/30 flex items-center justify-center transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
                <button
                  onClick={next}
                  className="w-10 h-10 rounded-xl bg-primary-600 hover:bg-primary-700 flex items-center justify-center transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all duration-300 ${i === current ? 'w-8 bg-primary-600' : 'w-2 bg-gray-300 dark:bg-gray-700'}`}
              />
            ))}
          </div>

          {/* Avatar grid */}
          <div className="flex justify-center mt-8 -space-x-3">
            {testimonials.map((t) => (
              <img key={t.id} src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-950 object-cover" />
            ))}
            <div className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-950 bg-primary-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">2M+</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
