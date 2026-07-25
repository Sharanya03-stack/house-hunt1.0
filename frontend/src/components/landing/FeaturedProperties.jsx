import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { Heart, BedDouble, Bath, Maximize2, MapPin, ArrowRight, Star } from 'lucide-react';
import { usePropertyStore } from '../../store/propertyStore';
import PropertyCard from '../property/PropertyCard';

export default function FeaturedProperties() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const { featured } = usePropertyStore();

  // Mock data when no backend connected
  const mockProperties = [
    {
      id: '1', title: 'Luxurious 3BHK Villa with Pool', price: 85000, price_period: 'month',
      city: 'Bangalore', bedrooms: 3, bathrooms: 3, area: 2800, property_type: 'villa', listing_type: 'rent',
      avg_rating: 4.8, review_count: 24, is_featured: true,
      property_images: [{ url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600', is_primary: true }],
      users: { name: 'Rajesh Kumar', avatar_url: null },
    },
    {
      id: '2', title: 'Modern 2BHK in Tech Hub', price: 32000, price_period: 'month',
      city: 'Hyderabad', bedrooms: 2, bathrooms: 2, area: 1200, property_type: 'apartment', listing_type: 'rent',
      avg_rating: 4.6, review_count: 18,
      property_images: [{ url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600', is_primary: true }],
      users: { name: 'Priya Singh', avatar_url: null },
    },
    {
      id: '3', title: 'Premium Studio, Bandra West', price: 22000, price_period: 'month',
      city: 'Mumbai', bedrooms: 1, bathrooms: 1, area: 650, property_type: 'studio', listing_type: 'rent',
      avg_rating: 4.9, review_count: 31,
      property_images: [{ url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600', is_primary: true }],
      users: { name: 'Amit Patel', avatar_url: null },
    },
    {
      id: '4', title: 'Spacious 4BHK Independent House', price: 1.2, price_period: 'crore',
      city: 'Pune', bedrooms: 4, bathrooms: 4, area: 3500, property_type: 'house', listing_type: 'buy',
      avg_rating: 4.7, review_count: 12,
      property_images: [{ url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600', is_primary: true }],
      users: { name: 'Meera Joshi', avatar_url: null },
    },
    {
      id: '5', title: 'High-Rise 2BHK, Koramangala', price: 45000, price_period: 'month',
      city: 'Bangalore', bedrooms: 2, bathrooms: 2, area: 1100, property_type: 'apartment', listing_type: 'rent',
      avg_rating: 4.5, review_count: 22,
      property_images: [{ url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600', is_primary: true }],
      users: { name: 'Suresh Menon', avatar_url: null },
    },
    {
      id: '6', title: 'Beachside Villa, ECR', price: 75000, price_period: 'month',
      city: 'Chennai', bedrooms: 3, bathrooms: 3, area: 2200, property_type: 'villa', listing_type: 'rent',
      avg_rating: 4.9, review_count: 8,
      property_images: [{ url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600', is_primary: true }],
      users: { name: 'Deepa Nair', avatar_url: null },
    },
  ];

  const displayProperties = featured?.length > 0 ? featured : mockProperties;

  return (
    <section ref={ref} className="py-20">
      <div className="page-container">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              className="text-primary-600 dark:text-primary-400 font-semibold text-sm uppercase tracking-widest mb-2"
            >
              Handpicked For You
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="section-title"
            >
              Featured Properties
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.2 }}
              className="section-subtitle"
            >
              Discover our curated selection of premium homes, villas, and apartments.
            </motion.p>
          </div>
          <Link to="/properties" className="hidden md:flex btn-secondary gap-2">
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayProperties.slice(0, 6).map((property, i) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
            >
              <PropertyCard property={property} />
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <Link to="/properties" className="btn-primary gap-2 px-8">
            Explore All Properties
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
