import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const locations = [
  {
    city: 'Mumbai',
    state: 'Maharashtra',
    count: 8420,
    img: 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=600',
    color: 'from-blue-900/70',
  },
  {
    city: 'Bangalore',
    state: 'Karnataka',
    count: 12350,
    img: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600',
    color: 'from-emerald-900/70',
  },
  {
    city: 'Delhi',
    state: 'NCR',
    count: 9800,
    img: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=600',
    color: 'from-orange-900/70',
  },
  {
    city: 'Hyderabad',
    state: 'Telangana',
    count: 7200,
    img: 'https://images.unsplash.com/photo-1569152811536-fb47aced8409?w=600',
    color: 'from-purple-900/70',
  },
  {
    city: 'Pune',
    state: 'Maharashtra',
    count: 5600,
    img: 'https://images.unsplash.com/photo-1562979314-bee7453e911c?w=600',
    color: 'from-rose-900/70',
  },
  {
    city: 'Chennai',
    state: 'Tamil Nadu',
    count: 4800,
    img: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600',
    color: 'from-teal-900/70',
  },
];

export default function PopularLocations() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="py-20 bg-gray-50 dark:bg-gray-900/50">
      <div className="page-container">
        <div className="text-center mb-12">
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            className="text-primary-600 dark:text-primary-400 font-semibold text-sm uppercase tracking-widest mb-2"
          >
            Explore by Location
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="section-title"
          >
            Popular Cities
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="section-subtitle mx-auto text-center"
          >
            Find your perfect property in India's most sought-after cities.
          </motion.p>
        </div>

        {/* Grid: 1 large + 5 small */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {locations.map((loc, i) => (
            <motion.div
              key={loc.city}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.07 }}
              className={`relative overflow-hidden rounded-2xl cursor-pointer group ${i === 0 ? 'col-span-2 lg:col-span-1 lg:row-span-2' : ''}`}
              style={{ minHeight: i === 0 ? '320px' : '160px' }}
            >
              <Link to={`/properties?city=${loc.city}`} className="absolute inset-0">
                <img
                  src={loc.img}
                  alt={loc.city}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${loc.color} to-transparent opacity-80 group-hover:opacity-90 transition-opacity`} />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-bold text-lg leading-tight">{loc.city}</h3>
                  <p className="text-white/70 text-xs">{loc.state}</p>
                  <p className="text-white/90 text-sm font-medium mt-1">
                    {loc.count.toLocaleString('en-IN')} properties
                  </p>
                </div>
                <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="w-3.5 h-3.5 text-white" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
