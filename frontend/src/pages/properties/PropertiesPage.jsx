import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, Grid3X3, List, X, Search, Database, ArrowRight } from 'lucide-react';
import { usePropertyStore } from '../../store/propertyStore';
import PropertyCard from '../../components/property/PropertyCard';
import PropertyFilters from '../../components/property/PropertyFilters';
import PropertyCardSkeleton from '../../components/property/PropertyCardSkeleton';

// ── Demo properties shown when DB has no data yet ──────────────────────────
const DEMO_PROPERTIES = [
  {
    id: 'demo-1', title: 'Luxurious 3BHK Villa with Swimming Pool', price: 85000, price_period: 'month',
    city: 'Bangalore', address: 'Whitefield', bedrooms: 3, bathrooms: 3, area: 2800,
    property_type: 'villa', listing_type: 'rent', avg_rating: 4.8, review_count: 24,
    is_featured: true, status: 'approved',
    property_images: [{ url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600', is_primary: true }],
    users: { name: 'Rajesh Kumar', avatar_url: null },
  },
  {
    id: 'demo-2', title: 'Modern 2BHK Apartment in Tech Hub', price: 32000, price_period: 'month',
    city: 'Hyderabad', address: 'HITEC City', bedrooms: 2, bathrooms: 2, area: 1200,
    property_type: 'apartment', listing_type: 'rent', avg_rating: 4.6, review_count: 18, status: 'approved',
    property_images: [{ url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600', is_primary: true }],
    users: { name: 'Priya Singh', avatar_url: null },
  },
  {
    id: 'demo-3', title: 'Premium Studio Apartment, Bandra West', price: 22000, price_period: 'month',
    city: 'Mumbai', address: 'Bandra West', bedrooms: 1, bathrooms: 1, area: 650,
    property_type: 'studio', listing_type: 'rent', avg_rating: 4.9, review_count: 31, status: 'approved',
    property_images: [{ url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600', is_primary: true }],
    users: { name: 'Amit Patel', avatar_url: null },
  },
  {
    id: 'demo-4', title: 'Spacious 4BHK Independent House', price: 12000000, price_period: 'total',
    city: 'Pune', address: 'Koregaon Park', bedrooms: 4, bathrooms: 4, area: 3500,
    property_type: 'house', listing_type: 'buy', avg_rating: 4.7, review_count: 12, status: 'approved',
    property_images: [{ url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600', is_primary: true }],
    users: { name: 'Meera Joshi', avatar_url: null },
  },
  {
    id: 'demo-5', title: 'High-Rise 2BHK, Koramangala', price: 45000, price_period: 'month',
    city: 'Bangalore', address: 'Koramangala 5th Block', bedrooms: 2, bathrooms: 2, area: 1100,
    property_type: 'apartment', listing_type: 'rent', avg_rating: 4.5, review_count: 22, status: 'approved',
    property_images: [{ url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600', is_primary: true }],
    users: { name: 'Suresh Menon', avatar_url: null },
  },
  {
    id: 'demo-6', title: 'Beachside Villa with Sea View', price: 75000, price_period: 'month',
    city: 'Chennai', address: 'ECR Road', bedrooms: 3, bathrooms: 3, area: 2200,
    property_type: 'villa', listing_type: 'rent', avg_rating: 4.9, review_count: 8, status: 'approved',
    property_images: [{ url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600', is_primary: true }],
    users: { name: 'Deepa Nair', avatar_url: null },
  },
  {
    id: 'demo-7', title: 'Furnished 1BHK near Metro', price: 18000, price_period: 'month',
    city: 'Delhi', address: 'Dwarka Sector 12', bedrooms: 1, bathrooms: 1, area: 700,
    property_type: 'apartment', listing_type: 'rent', avg_rating: 4.3, review_count: 9, status: 'approved',
    property_images: [{ url: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600', is_primary: true }],
    users: { name: 'Ankit Sharma', avatar_url: null },
  },
  {
    id: 'demo-8', title: 'Commercial Space in Business District', price: 95000, price_period: 'month',
    city: 'Bangalore', address: 'MG Road', bedrooms: 0, bathrooms: 2, area: 3000,
    property_type: 'commercial', listing_type: 'rent', avg_rating: 4.4, review_count: 5, status: 'approved',
    property_images: [{ url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600', is_primary: true }],
    users: { name: 'Vikram Reddy', avatar_url: null },
  },
  {
    id: 'demo-9', title: 'Gated Community 3BHK Apartment', price: 55000, price_period: 'month',
    city: 'Hyderabad', address: 'Gachibowli', bedrooms: 3, bathrooms: 3, area: 1800,
    property_type: 'apartment', listing_type: 'rent', avg_rating: 4.7, review_count: 15, status: 'approved',
    property_images: [{ url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600', is_primary: true }],
    users: { name: 'Kavitha Rao', avatar_url: null },
  },
  {
    id: 'demo-10', title: 'Budget Studio near IT Park', price: 12000, price_period: 'month',
    city: 'Pune', address: 'Hinjewadi Phase 1', bedrooms: 1, bathrooms: 1, area: 450,
    property_type: 'studio', listing_type: 'rent', avg_rating: 4.1, review_count: 20, status: 'approved',
    property_images: [{ url: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600', is_primary: true }],
    users: { name: 'Rohit Gupta', avatar_url: null },
  },
  {
    id: 'demo-11', title: 'Luxury Penthouse with Terrace', price: 150000, price_period: 'month',
    city: 'Mumbai', address: 'Worli Sea Face', bedrooms: 4, bathrooms: 4, area: 4500,
    property_type: 'apartment', listing_type: 'rent', avg_rating: 5.0, review_count: 6,
    is_featured: true, status: 'approved',
    property_images: [{ url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600', is_primary: true }],
    users: { name: 'Nisha Kapoor', avatar_url: null },
  },
  {
    id: 'demo-12', title: 'Plot in Growing Township', price: 4500000, price_period: 'total',
    city: 'Bangalore', address: 'Sarjapur Road', bedrooms: 0, bathrooms: 0, area: 1200,
    property_type: 'plot', listing_type: 'buy', avg_rating: 4.2, review_count: 3, status: 'approved',
    property_images: [{ url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600', is_primary: true }],
    users: { name: 'Sanjay Nair', avatar_url: null },
  },
];

// Filter demo properties client-side to match active filters
const filterDemoProperties = (demos, filters) => {
  return demos.filter((p) => {
    if (filters.city && !p.city.toLowerCase().includes(filters.city.toLowerCase())) return false;
    if (filters.listing_type && p.listing_type !== filters.listing_type) return false;
    if (filters.property_type && p.property_type !== filters.property_type) return false;
    if (filters.bedrooms && p.bedrooms < parseInt(filters.bedrooms)) return false;
    if (filters.bathrooms && p.bathrooms < parseInt(filters.bathrooms)) return false;
    if (filters.min_price && p.price < parseFloat(filters.min_price)) return false;
    if (filters.max_price && p.price > parseFloat(filters.max_price)) return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (!p.title.toLowerCase().includes(q) && !p.city.toLowerCase().includes(q) && !p.address.toLowerCase().includes(q)) return false;
    }
    return true;
  });
};

export default function PropertiesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const { properties, filters, pagination, isLoading, error, fetchProperties, setFilters } = usePropertyStore();

  // Sync URL params → filters on first load
  useEffect(() => {
    const urlFilters = {};
    ['city', 'listing_type', 'property_type', 'min_price', 'max_price',
     'bedrooms', 'bathrooms', 'furnished', 'parking', 'pet_friendly', 'search'].forEach((key) => {
      const val = searchParams.get(key);
      if (val) urlFilters[key] = val;
    });
    setFilters(urlFilters);
    fetchProperties({ ...urlFilters, page: 1 });
  }, []);

  // Detect when DB is empty → switch to demo mode
  useEffect(() => {
    if (!isLoading && pagination.total === 0 && Object.values(filters).every(v => !v)) {
      setIsDemoMode(true);
    } else if (pagination.total > 0) {
      setIsDemoMode(false);
    }
  }, [isLoading, pagination.total]);

  const handleFilterChange = useCallback((newFilters) => {
    const merged = { ...filters, ...newFilters };
    setFilters(merged);
    const params = new URLSearchParams();
    Object.entries(merged).forEach(([k, v]) => { if (v) params.set(k, v); });
    setSearchParams(params);
    fetchProperties({ ...merged, page: 1 });
  }, [filters]);

  const handlePageChange = (page) => {
    fetchProperties({ page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  // Determine what to display
  const demoFiltered = filterDemoProperties(DEMO_PROPERTIES, filters);
  const displayProperties = isDemoMode ? demoFiltered : properties;
  const displayTotal = isDemoMode ? demoFiltered.length : pagination.total;
  const showEmpty = !isLoading && displayProperties.length === 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20">
      {/* Sticky header bar */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-16 z-30">
        <div className="page-container py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Search */}
            <div className="flex-1 max-w-lg relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title, city, or keyword..."
                value={filters.search || ''}
                onChange={(e) => handleFilterChange({ search: e.target.value })}
                className="input-field pl-10 py-2.5 text-sm"
              />
              {filters.search && (
                <button onClick={() => handleFilterChange({ search: '' })} className="absolute right-3.5 top-1/2 -translate-y-1/2">
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Sort */}
              <select
                className="input-field py-2.5 text-sm w-auto"
                onChange={(e) => handleFilterChange({ sort: e.target.value })}
              >
                <option value="created_at">Newest First</option>
                <option value="price">Price: Low to High</option>
                <option value="views">Most Viewed</option>
                <option value="avg_rating">Top Rated</option>
              </select>

              {/* Filter button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`relative btn-secondary py-2.5 text-sm gap-2 ${showFilters ? 'border-primary-500 text-primary-600 dark:text-primary-400' : ''}`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* View Toggle */}
              <div className="flex border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                {[{ mode: 'grid', icon: Grid3X3 }, { mode: 'list', icon: List }].map(({ mode, icon: Icon }) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`p-2.5 transition-colors ${viewMode === mode ? 'bg-primary-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Active filter chips */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {Object.entries(filters).map(([key, value]) => {
                if (!value) return null;
                return (
                  <span key={key} className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 text-xs font-medium rounded-full border border-primary-200 dark:border-primary-800">
                    {key.replace(/_/g, ' ')}: {value}
                    <button onClick={() => handleFilterChange({ [key]: '' })}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                );
              })}
              <button
                onClick={() => handleFilterChange({ city: '', min_price: '', max_price: '', property_type: '', listing_type: '', bedrooms: '', bathrooms: '', furnished: '', parking: '', pet_friendly: '', search: '' })}
                className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 font-medium"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="page-container py-6">
        {/* Demo mode banner */}
        {isDemoMode && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 mb-5"
          >
            <Database className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">Showing demo properties</p>
              <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                Your database has no listings yet. To see real properties, run <code className="bg-amber-100 dark:bg-amber-900/40 px-1 rounded font-mono">database/schema.sql</code> in Supabase and add listings from the owner dashboard.
              </p>
            </div>
            <Link to="/register?role=owner" className="flex-shrink-0 text-xs font-semibold text-amber-700 dark:text-amber-400 hover:underline whitespace-nowrap flex items-center gap-1">
              Add Listing <ArrowRight className="w-3 h-3" />
            </Link>
          </motion.div>
        )}

        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.aside
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-72 flex-shrink-0 hidden lg:block"
              >
                <PropertyFilters filters={filters} onChange={handleFilterChange} />
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Results */}
          <div className="flex-1 min-w-0">
            {/* Result count */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isLoading ? (
                  <span className="skeleton h-4 w-32 inline-block rounded" />
                ) : (
                  <>
                    Showing <strong className="text-gray-900 dark:text-white">{displayProperties.length}</strong>
                    {!isDemoMode && <> of <strong className="text-gray-900 dark:text-white">{displayTotal}</strong></>} properties
                    {isDemoMode && <span className="ml-2 badge badge-warning">Demo data</span>}
                  </>
                )}
              </p>
            </div>

            {/* Property Grid / List */}
            {isLoading ? (
              <div className={`grid gap-5 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                {Array.from({ length: 6 }).map((_, i) => <PropertyCardSkeleton key={i} />)}
              </div>
            ) : showEmpty ? (
              /* Empty state */
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No properties found</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-xs mx-auto">
                  {activeFilterCount > 0
                    ? 'No properties match your current filters. Try broadening your search.'
                    : 'No properties are available right now. Check back soon or add your own listing.'}
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  {activeFilterCount > 0 && (
                    <button
                      onClick={() => handleFilterChange({ city: '', min_price: '', max_price: '', property_type: '', listing_type: '', bedrooms: '', bathrooms: '', furnished: '', parking: '', pet_friendly: '', search: '' })}
                      className="btn-secondary"
                    >
                      Clear All Filters
                    </button>
                  )}
                  <Link to="/register?role=owner" className="btn-primary gap-2">
                    List a Property
                  </Link>
                </div>
              </div>
            ) : (
              <div className={`grid gap-5 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                {displayProperties.map((property, i) => (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <PropertyCard property={property} />
                  </motion.div>
                ))}
              </div>
            )}

            {/* Pagination (only for real DB data) */}
            {!isDemoMode && pagination.totalPages > 1 && (
              <div className="flex justify-center mt-10 gap-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="btn-secondary py-2 px-4 text-sm disabled:opacity-40"
                >
                  Previous
                </button>
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${pagination.page === page ? 'bg-primary-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-primary-400'}`}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="btn-secondary py-2 px-4 text-sm disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowFilters(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30 }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-white dark:bg-gray-900 z-50 p-6 overflow-y-auto lg:hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 dark:text-white">Filters</h3>
                <button onClick={() => setShowFilters(false)}>
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <PropertyFilters filters={filters} onChange={handleFilterChange} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
