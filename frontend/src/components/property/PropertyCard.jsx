import { Link } from 'react-router-dom';
import { Heart, BedDouble, Bath, Maximize2, MapPin, Star, Home } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { usePropertyStore } from '../../store/propertyStore';
import toast from 'react-hot-toast';

const formatPrice = (price, period, listing_type) => {
  if (!price) return 'Price on request';
  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0,
  }).format(price);

  if (listing_type === 'buy') {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)} Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(1)} L`;
    return formatted;
  }

  return `${formatted}/${period === 'month' ? 'mo' : period}`;
};

export default function PropertyCard({ property, className = '' }) {
  const { isAuthenticated } = useAuthStore();
  const { toggleFavorite, isFavorite } = usePropertyStore();
  const saved = isFavorite(property.id);

  const primaryImage = property.property_images?.find((img) => img.is_primary) || property.property_images?.[0];
  const imageUrl = primaryImage?.url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600';

  const handleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please login to save properties');
      return;
    }
    try {
      const result = await toggleFavorite(property.id);
      toast.success(result.saved ? '💙 Saved to favorites' : 'Removed from favorites');
    } catch {
      toast.error('Failed to update favorites');
    }
  };

  return (
    <Link to={`/properties/${property.id}`} className={`property-card block ${className}`}>
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={imageUrl}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Overlay badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <span className={`badge font-semibold text-xs capitalize
            ${property.listing_type === 'rent' ? 'bg-primary-600 text-white' : 'bg-green-600 text-white'}`}>
            For {property.listing_type === 'buy' ? 'Sale' : property.listing_type}
          </span>
          {property.is_featured && (
            <span className="badge bg-amber-500 text-white">
              ⭐ Featured
            </span>
          )}
        </div>

        {/* Favorite */}
        <button
          onClick={handleFavorite}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full backdrop-blur-sm flex items-center justify-center transition-all duration-200 hover:scale-110
            ${saved ? 'bg-red-500 text-white' : 'bg-white/80 dark:bg-gray-900/80 text-gray-600 dark:text-gray-300 hover:bg-red-50 hover:text-red-500'}`}
          aria-label={saved ? 'Remove from favorites' : 'Save property'}
        >
          <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
        </button>

        {/* Property type */}
        <div className="absolute bottom-3 right-3">
          <span className="badge bg-black/50 backdrop-blur-sm text-white capitalize">
            <Home className="w-3 h-3" />
            {property.property_type}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Price */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <p className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
            {formatPrice(property.price, property.price_period, property.listing_type)}
          </p>
          {property.avg_rating > 0 && (
            <div className="flex items-center gap-1 flex-shrink-0 mt-0.5">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{property.avg_rating?.toFixed(1)}</span>
              <span className="text-xs text-gray-400">({property.review_count})</span>
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-snug mb-2 line-clamp-2">
          {property.title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-xs mb-3">
          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">{property.address ? `${property.address}, ` : ''}{property.city}</span>
        </div>

        {/* Specs */}
        <div className="flex items-center gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
          {property.bedrooms > 0 && (
            <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
              <BedDouble className="w-3.5 h-3.5 text-gray-400" />
              <span>{property.bedrooms} {property.bedrooms === 1 ? 'Bed' : 'Beds'}</span>
            </div>
          )}
          {property.bathrooms > 0 && (
            <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
              <Bath className="w-3.5 h-3.5 text-gray-400" />
              <span>{property.bathrooms} {property.bathrooms === 1 ? 'Bath' : 'Baths'}</span>
            </div>
          )}
          {property.area && (
            <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 ml-auto">
              <Maximize2 className="w-3.5 h-3.5 text-gray-400" />
              <span>{property.area?.toLocaleString('en-IN')} sqft</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
