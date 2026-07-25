import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, MapPin, BedDouble, Bath, Maximize2, Trash2 } from 'lucide-react';
import { usePropertyStore } from '../../store/propertyStore';
import toast from 'react-hot-toast';

export default function SeekerFavorites() {
  const { favorites, fetchFavorites, toggleFavorite } = usePropertyStore();

  useEffect(() => { fetchFavorites(); }, []);

  const handleRemove = async (propertyId) => {
    try {
      await toggleFavorite(propertyId);
      fetchFavorites();
      toast.success('Removed from favorites');
    } catch { toast.error('Failed'); }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Saved Properties</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{favorites.length} saved properties</p>
      </div>

      {favorites.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 py-16 text-center">
          <Heart className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="font-semibold text-gray-900 dark:text-white">No saved properties</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 mb-5">Browse properties and save your favorites.</p>
          <Link to="/properties" className="btn-primary">Browse Properties</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {favorites.map((fav, i) => {
            const p = fav.properties;
            if (!p) return null;
            const img = p.property_images?.find(img => img.is_primary) || p.property_images?.[0];
            return (
              <motion.div
                key={fav.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="property-card group"
              >
                <div className="relative overflow-hidden aspect-[4/3]">
                  <img src={img?.url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400'} alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <button onClick={() => handleRemove(p.id)}
                    className="absolute top-3 right-3 w-8 h-8 bg-white/80 dark:bg-gray-900/80 rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all">
                    <Trash2 className="w-3.5 h-3.5 text-gray-500" />
                  </button>
                  <span className={`absolute top-3 left-3 badge font-semibold capitalize ${p.listing_type === 'rent' ? 'bg-primary-600 text-white' : 'bg-green-600 text-white'}`}>
                    For {p.listing_type === 'buy' ? 'Sale' : p.listing_type}
                  </span>
                </div>
                <div className="p-4">
                  <p className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                    ₹{p.price?.toLocaleString('en-IN')}/{p.price_period || 'mo'}
                  </p>
                  <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm mb-2 line-clamp-2">{p.title}</p>
                  <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-xs mb-3">
                    <MapPin className="w-3.5 h-3.5" />
                    {p.city}
                  </div>
                  <div className="flex items-center gap-3 pt-3 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1"><BedDouble className="w-3.5 h-3.5" />{p.bedrooms}</span>
                    <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" />{p.bathrooms}</span>
                    {p.area && <span className="flex items-center gap-1 ml-auto"><Maximize2 className="w-3.5 h-3.5" />{p.area} sqft</span>}
                  </div>
                  <Link to={`/properties/${p.id}`} className="btn-primary w-full mt-3 text-sm py-2.5 justify-center">
                    View Property
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
