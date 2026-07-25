import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, BedDouble, Bath, Maximize2, Heart, Share2, Flag, Calendar,
  Phone, MessageCircle, Star, ChevronLeft, ChevronRight, Check,
  Home, Wifi, Car, PawPrint, Wind, Dumbbell, Shield, X, ArrowLeft,
} from 'lucide-react';
import { usePropertyStore } from '../../store/propertyStore';
import { useAuthStore } from '../../store/authStore';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import PropertyCard from '../../components/property/PropertyCard';

const amenityIcons = {
  wifi: { icon: Wifi, label: 'WiFi' },
  parking: { icon: Car, label: 'Parking' },
  'pet-friendly': { icon: PawPrint, label: 'Pet Friendly' },
  'air-conditioning': { icon: Wind, label: 'Air Conditioning' },
  gym: { icon: Dumbbell, label: 'Gym' },
  security: { icon: Shield, label: '24/7 Security' },
  pool: { label: 'Swimming Pool', emoji: '🏊' },
  garden: { label: 'Garden', emoji: '🌿' },
  lift: { label: 'Elevator', emoji: '🛗' },
  power: { label: 'Power Backup', emoji: '⚡' },
};

export default function PropertyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchProperty, currentProperty, toggleFavorite, isFavorite } = usePropertyStore();
  const { isAuthenticated, user } = useAuthStore();

  const [galleryIndex, setGalleryIndex] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  const [bookingModal, setBookingModal] = useState(false);
  const [booking, setBooking] = useState({ visit_date: '', visit_time: '10:00', message: '' });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [relatedProperties, setRelatedProperties] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

  const property = currentProperty;

  useEffect(() => {
    fetchProperty(id).then((p) => {
      if (p?.city) {
        // Fetch similar properties
        api.get(`/properties?city=${p.city}&limit=3`)
          .then(({ data }) => setRelatedProperties(data.data?.properties?.filter(pr => pr.id !== id) || []))
          .catch(() => {});
      }
    }).catch(() => navigate('/properties'));
  }, [id]);

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading property...</p>
        </div>
      </div>
    );
  }

  const images = property.property_images || [];
  const primaryOwner = property.users;
  const saved = isFavorite(id);

  const formatPrice = (price, period, type) => {
    if (type === 'buy') {
      if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Crore`;
      if (price >= 100000) return `₹${(price / 100000).toFixed(1)} Lakh`;
    }
    return `₹${price?.toLocaleString('en-IN')}/${period || 'month'}`;
  };

  const handleFavorite = async () => {
    if (!isAuthenticated) { toast.error('Login to save properties'); return; }
    try {
      const result = await toggleFavorite(id);
      toast.success(result.saved ? '💙 Saved!' : 'Removed from favorites');
    } catch { toast.error('Failed'); }
  };

  const handleShare = async () => {
    try {
      await navigator.share({ title: property.title, url: window.location.href });
    } catch {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied!');
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { toast.error('Please login to book a visit'); return; }
    if (!booking.visit_date) { toast.error('Please select a date'); return; }

    setBookingLoading(true);
    try {
      await api.post(`/user/bookings/${id}`, booking);
      toast.success('Visit booked! Owner will confirm shortly. 🎉');
      setBookingModal(false);
      setBooking({ visit_date: '', visit_time: '10:00', message: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { toast.error('Login to write a review'); return; }
    try {
      await api.post(`/user/reviews/${id}`, newReview);
      toast.success('Review submitted!');
      fetchProperty(id);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-16">
      {/* Breadcrumb */}
      <div className="page-container pt-4 pb-2">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <span>/</span>
          <Link to="/properties" className="hover:text-gray-900 dark:hover:text-white">Properties</Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white truncate max-w-48">{property.title}</span>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="page-container py-4">
        <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[420px] rounded-2xl overflow-hidden">
          {/* Main image */}
          <div
            className="col-span-4 md:col-span-2 row-span-2 relative cursor-pointer overflow-hidden"
            onClick={() => setShowGallery(true)}
          >
            <img
              src={images[0]?.url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'}
              alt={property.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center">
              <span className="opacity-0 hover:opacity-100 transition-opacity bg-black/50 text-white px-3 py-1.5 rounded-lg text-sm font-medium">View All Photos</span>
            </div>
          </div>
          {/* Thumbnails */}
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="hidden md:block relative cursor-pointer overflow-hidden"
              onClick={() => { setGalleryIndex(i); setShowGallery(true); }}
            >
              {images[i] ? (
                <img src={images[i].url} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                  <Home className="w-6 h-6 text-gray-400" />
                </div>
              )}
              {i === 4 && images.length > 5 && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">+{images.length - 5}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="page-container pb-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Property Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Actions */}
            <div>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className={`badge font-semibold capitalize ${property.listing_type === 'rent' ? 'badge-primary' : 'badge-success'}`}>
                      For {property.listing_type === 'buy' ? 'Sale' : property.listing_type}
                    </span>
                    <span className="badge badge-purple capitalize">{property.property_type}</span>
                    {property.furnished && <span className="badge badge-warning">Furnished</span>}
                    {property.is_featured && <span className="badge bg-amber-100 text-amber-700">⭐ Featured</span>}
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white leading-tight">
                    {property.title}
                  </h1>
                  <div className="flex items-center gap-1 mt-2 text-gray-500 dark:text-gray-400">
                    <MapPin className="w-4 h-4 text-primary-500" />
                    <span className="text-sm">{property.address}, {property.city}, {property.state}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button onClick={handleFavorite} className={`btn-secondary p-2.5 ${saved ? 'text-red-500 border-red-200 bg-red-50 dark:bg-red-900/20' : ''}`}>
                    <Heart className={`w-5 h-5 ${saved ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>
                  <button onClick={handleShare} className="btn-secondary p-2.5">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-end gap-2 mt-4">
                <span className="text-4xl font-bold text-primary-600 dark:text-primary-400">
                  {formatPrice(property.price, property.price_period, property.listing_type)}
                </span>
                {property.avg_rating > 0 && (
                  <div className="flex items-center gap-1 pb-1">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="font-semibold text-gray-700 dark:text-gray-300">{property.avg_rating?.toFixed(1)}</span>
                    <span className="text-gray-400 text-sm">({property.review_count} reviews)</span>
                  </div>
                )}
              </div>
            </div>

            {/* Key Specs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: BedDouble, label: 'Bedrooms', value: property.bedrooms || 'N/A' },
                { icon: Bath, label: 'Bathrooms', value: property.bathrooms || 'N/A' },
                { icon: Maximize2, label: 'Area', value: `${property.area?.toLocaleString('en-IN')} ${property.area_unit || 'sqft'}` },
                { icon: Home, label: 'Type', value: property.property_type?.charAt(0).toUpperCase() + property.property_type?.slice(1) },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center">
                  <div className="w-10 h-10 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center mb-2">
                    <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <span className="font-bold text-gray-900 dark:text-white text-sm">{value}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</span>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
              <h2 className="font-bold text-gray-900 dark:text-white text-lg mb-3">About This Property</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                {property.description || 'No description provided.'}
              </p>
            </div>

            {/* Amenities */}
            {(property.amenities?.length > 0 || property.furnished || property.parking || property.pet_friendly) && (
              <div>
                <h2 className="font-bold text-gray-900 dark:text-white text-lg mb-4">Amenities & Features</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {property.furnished && (
                    <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
                      <span className="text-lg">🛋️</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Furnished</span>
                    </div>
                  )}
                  {property.parking && (
                    <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
                      <span className="text-lg">🚗</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Parking</span>
                    </div>
                  )}
                  {property.pet_friendly && (
                    <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
                      <span className="text-lg">🐾</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Pet Friendly</span>
                    </div>
                  )}
                  {property.amenities?.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Nearby */}
            {(property.nearby_schools?.length > 0 || property.nearby_hospitals?.length > 0 || property.nearby_metro?.length > 0) && (
              <div>
                <h2 className="font-bold text-gray-900 dark:text-white text-lg mb-4">Nearby Places</h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  {[
                    { label: 'Schools', items: property.nearby_schools, emoji: '🏫' },
                    { label: 'Hospitals', items: property.nearby_hospitals, emoji: '🏥' },
                    { label: 'Metro Stations', items: property.nearby_metro, emoji: '🚇' },
                  ].map(({ label, items, emoji }) => (
                    items?.length > 0 && (
                      <div key={label} className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-2">{emoji} {label}</h3>
                        <ul className="space-y-1.5">
                          {items.slice(0, 3).map((place, i) => (
                            <li key={i} className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 bg-primary-400 rounded-full" />
                              {typeof place === 'object' ? `${place.name} (${place.distance})` : place}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}

            {/* Map Placeholder */}
            <div>
              <h2 className="font-bold text-gray-900 dark:text-white text-lg mb-3">Location</h2>
              <div className="h-60 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 relative border border-gray-200 dark:border-gray-700">
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                  <MapPin className="w-8 h-8 text-primary-500" />
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{property.city}, {property.state}</p>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(`${property.address}, ${property.city}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary text-xs py-2 px-4 mt-1"
                  >
                    Open in Google Maps
                  </a>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div>
              <h2 className="font-bold text-gray-900 dark:text-white text-lg mb-4">
                Reviews {property.review_count > 0 && <span className="text-base font-normal text-gray-500">({property.review_count})</span>}
              </h2>
              {property.reviews?.length > 0 ? (
                <div className="space-y-4 mb-6">
                  {property.reviews.map((review) => (
                    <div key={review.id} className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
                      <div className="flex items-center gap-3 mb-2">
                        <img
                          src={review.users?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.users?.name)}&background=3b82f6&color=fff`}
                          alt={review.users?.name}
                          className="w-9 h-9 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white text-sm">{review.users?.name}</p>
                          <div className="flex">
                            {Array.from({ length: review.rating }).map((_, i) => (
                              <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">No reviews yet. Be the first to review!</p>
              )}

              {/* Write review */}
              {isAuthenticated && user?.role === 'seeker' && (
                <form onSubmit={handleReview} className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Write a Review</h3>
                  <div className="flex gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((r) => (
                      <button key={r} type="button" onClick={() => setNewReview({ ...newReview, rating: r })}>
                        <Star className={`w-6 h-6 ${r <= newReview.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300 dark:text-gray-600'}`} />
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    placeholder="Share your experience..."
                    rows={3}
                    className="input-field resize-none mb-3"
                    required
                  />
                  <button type="submit" className="btn-primary text-sm py-2.5">Submit Review</button>
                </form>
              )}
            </div>
          </div>

          {/* Right: Owner Card + Actions */}
          <div className="space-y-4">
            {/* Sticky wrapper */}
            <div className="lg:sticky lg:top-24 space-y-4">
              {/* Price Card */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-card p-6">
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {formatPrice(property.price, property.price_period, property.listing_type)}
                </div>
                {property.listing_type === 'rent' && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">per month</p>
                )}

                <div className="grid grid-cols-2 gap-2 mb-4 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                  <div><span className="font-semibold text-gray-900 dark:text-white block">{property.bedrooms}</span>Bedrooms</div>
                  <div><span className="font-semibold text-gray-900 dark:text-white block">{property.bathrooms}</span>Bathrooms</div>
                  <div><span className="font-semibold text-gray-900 dark:text-white block">{property.area?.toLocaleString('en-IN')}</span>Sq. Ft.</div>
                  <div><span className="font-semibold text-gray-900 dark:text-white block capitalize">{property.property_type}</span>Type</div>
                </div>

                <button onClick={() => setBookingModal(true)} className="btn-primary w-full mb-2">
                  <Calendar className="w-4 h-4" />
                  Book a Visit
                </button>
                <a
                  href={`tel:${primaryOwner?.phone}`}
                  className="btn-secondary w-full justify-center text-sm py-2.5"
                  onClick={(e) => { if (!primaryOwner?.phone) { e.preventDefault(); toast.error('Contact info not available'); } }}
                >
                  <Phone className="w-4 h-4" />
                  Contact Owner
                </a>
              </div>

              {/* Owner Card */}
              {primaryOwner && (
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-card p-5">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-3">Listed by</h3>
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={primaryOwner.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(primaryOwner.name)}&background=3b82f6&color=fff`}
                      alt={primaryOwner.name}
                      className="w-12 h-12 rounded-2xl object-cover border-2 border-gray-100 dark:border-gray-800"
                    />
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">{primaryOwner.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Property Owner</p>
                    </div>
                  </div>
                  {primaryOwner.bio && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-3">{primaryOwner.bio}</p>
                  )}
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <Shield className="w-3.5 h-3.5 text-green-500" />
                    Verified Owner
                  </div>
                </div>
              )}

              {/* Views */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-3 text-center text-xs text-gray-500 dark:text-gray-400">
                👁️ {property.views?.toLocaleString('en-IN')} people viewed this property
              </div>

              {/* Report */}
              <button className="w-full flex items-center justify-center gap-2 text-xs text-gray-400 hover:text-red-500 transition-colors py-2">
                <Flag className="w-3.5 h-3.5" />
                Report this listing
              </button>
            </div>
          </div>
        </div>

        {/* Similar Properties */}
        {relatedProperties.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800">
            <h2 className="font-bold text-gray-900 dark:text-white text-xl mb-6">Similar Properties in {property.city}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {relatedProperties.slice(0, 3).map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Gallery */}
      <AnimatePresence>
        {showGallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50 flex items-center justify-center"
          >
            <button onClick={() => setShowGallery(false)} className="absolute top-4 right-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10">
              <X className="w-5 h-5" />
            </button>
            <button onClick={() => setGalleryIndex((i) => (i - 1 + images.length) % images.length)}
              className="absolute left-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={() => setGalleryIndex((i) => (i + 1) % images.length)}
              className="absolute right-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20">
              <ChevronRight className="w-5 h-5" />
            </button>
            <img src={images[galleryIndex]?.url} alt="" className="max-h-screen max-w-full object-contain px-16" />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
              {galleryIndex + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Booking Modal */}
      <AnimatePresence>
        {bookingModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setBookingModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              className="fixed inset-x-4 bottom-4 sm:inset-auto sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl z-50 p-6"
            >
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg">Book a Property Visit</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Schedule a time with the owner</p>
                </div>
                <button onClick={() => setBookingModal(false)} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <form onSubmit={handleBooking} className="space-y-4">
                <div>
                  <label className="input-label">Preferred Visit Date</label>
                  <input type="date" value={booking.visit_date} onChange={(e) => setBooking({ ...booking, visit_date: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="input-field" required />
                </div>
                <div>
                  <label className="input-label">Preferred Time</label>
                  <select value={booking.visit_time} onChange={(e) => setBooking({ ...booking, visit_time: e.target.value })} className="input-field">
                    {['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00'].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="input-label">Message to Owner (optional)</label>
                  <textarea value={booking.message} onChange={(e) => setBooking({ ...booking, message: e.target.value })}
                    placeholder="Any specific requirements or questions..."
                    rows={2} className="input-field resize-none" />
                </div>
                <button type="submit" disabled={bookingLoading} className="btn-primary w-full">
                  {bookingLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Booking...
                    </span>
                  ) : 'Confirm Visit Booking'}
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
