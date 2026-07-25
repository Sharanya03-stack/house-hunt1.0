import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, Home as HomeIcon, BedDouble, SlidersHorizontal } from 'lucide-react';

const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad'];

export default function SearchBar() {
  const [query, setQuery] = useState({ city: '', listing_type: 'rent', property_type: '', search: '' });
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <section className="relative z-20 -mt-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 p-2">
          {/* Type Tabs */}
          <div className="flex gap-1 mb-2 px-2 pt-1">
            {['rent', 'buy', 'lease'].map((type) => (
              <button
                key={type}
                onClick={() => setQuery({ ...query, listing_type: type })}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold capitalize transition-all
                  ${query.listing_type === type
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
              >
                For {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2 p-1">
            {/* City */}
            <div className="flex items-center gap-2 flex-1 px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-100 dark:focus-within:ring-primary-900/30 transition-all">
              <MapPin className="w-4 h-4 text-primary-500 flex-shrink-0" />
              <input
                list="cities"
                placeholder="City or location..."
                value={query.city}
                onChange={(e) => setQuery({ ...query, city: e.target.value })}
                className="bg-transparent flex-1 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
              />
              <datalist id="cities">
                {cities.map((c) => <option key={c} value={c} />)}
              </datalist>
            </div>

            {/* Property Type */}
            <div className="flex items-center gap-2 flex-1 px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus-within:border-primary-400 transition-all">
              <HomeIcon className="w-4 h-4 text-primary-500 flex-shrink-0" />
              <select
                value={query.property_type}
                onChange={(e) => setQuery({ ...query, property_type: e.target.value })}
                className="bg-transparent flex-1 text-sm text-gray-900 dark:text-white focus:outline-none"
              >
                <option value="">All Property Types</option>
                <option value="apartment">Apartment</option>
                <option value="villa">Villa</option>
                <option value="house">House</option>
                <option value="studio">Studio</option>
                <option value="commercial">Commercial</option>
                <option value="plot">Plot</option>
              </select>
            </div>

            {/* Keyword */}
            <div className="flex items-center gap-2 flex-1 px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus-within:border-primary-400 transition-all">
              <Search className="w-4 h-4 text-primary-500 flex-shrink-0" />
              <input
                placeholder="Keyword (e.g. 2BHK, pool...)"
                value={query.search}
                onChange={(e) => setQuery({ ...query, search: e.target.value })}
                className="bg-transparent flex-1 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
              />
            </div>

            <button type="submit" className="btn-primary px-8 md:px-6 whitespace-nowrap">
              <Search className="w-4 h-4" />
              Search
            </button>
          </form>
        </div>
      </motion.div>
    </section>
  );
}
