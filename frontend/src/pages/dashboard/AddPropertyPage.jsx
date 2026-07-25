import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, X, Plus, Image as ImageIcon, Video, MapPin,
  Home, Info, DollarSign, Check, ChevronRight, ChevronLeft,
} from 'lucide-react';
import api from '../../lib/api';
import toast from 'react-hot-toast';

const STEPS = ['Basic Info', 'Details', 'Location', 'Media'];

const amenitiesList = [
  'WiFi', 'Power Backup', 'Air Conditioning', 'Gym', 'Swimming Pool',
  'Security', 'Garden', 'Clubhouse', 'Lift', 'Intercom',
  'CCTV', 'Water Supply 24x7', 'Modular Kitchen', 'Balcony',
];

export default function AddPropertyPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    title: '', description: '', property_type: 'apartment', listing_type: 'rent',
    price: '', price_period: 'month', bedrooms: '2', bathrooms: '2',
    area: '', area_unit: 'sqft', address: '', city: '', state: '', country: 'India',
    latitude: '', longitude: '', furnished: false, parking: false, pet_friendly: false,
    amenities: [], nearby_schools: '', nearby_hospitals: '', nearby_metro: '',
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const toggleAmenity = (amenity) => {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 10) {
      toast.error('Maximum 10 images allowed');
      return;
    }
    setImages((prev) => [...prev, ...files]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreviews((prev) => [...prev, ev.target.result]);
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) { toast.error('Please upload at least one image'); return; }
    if (!form.title || !form.description || !form.price || !form.address || !form.city) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === 'amenities') formData.append(key, JSON.stringify(value));
        else formData.append(key, value);
      });
      images.forEach((img) => formData.append('images', img));

      await api.post('/properties', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Property submitted for review! 🎉');
      navigate('/dashboard/listings');
    } catch (error) {
      toast.error(error.response?.data?.message || error.response?.data?.errors?.[0]?.msg || 'Failed to submit property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Property</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Fill in the details to list your property.</p>
      </div>

      {/* Steps */}
      <div className="flex gap-1 mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex-1 flex items-center gap-1">
            <div className="flex-1">
              <div className={`h-1.5 rounded-full transition-all ${i <= step ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-800'}`} />
              <p className={`text-xs mt-1 font-medium transition-colors ${i === step ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400'}`}>
                {s}
              </p>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-card p-6">
        <AnimatePresence mode="wait">
          {/* Step 1: Basic Info */}
          {step === 0 && (
            <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
              <div>
                <label className="input-label">Property Title *</label>
                <input type="text" name="title" value={form.title} onChange={handleChange}
                  placeholder="e.g. Spacious 3BHK Apartment in Koramangala" className="input-field" required />
              </div>
              <div>
                <label className="input-label">Description *</label>
                <textarea name="description" value={form.description} onChange={handleChange}
                  placeholder="Describe your property in detail (min. 50 characters)..." rows={4} className="input-field resize-none" required />
                <p className="text-xs text-gray-400 mt-1">{form.description.length} / 50 min chars</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="input-label">Property Type *</label>
                  <select name="property_type" value={form.property_type} onChange={handleChange} className="input-field">
                    <option value="apartment">Apartment</option>
                    <option value="villa">Villa</option>
                    <option value="house">House</option>
                    <option value="studio">Studio</option>
                    <option value="commercial">Commercial</option>
                    <option value="plot">Plot</option>
                  </select>
                </div>
                <div>
                  <label className="input-label">Listing Type *</label>
                  <select name="listing_type" value={form.listing_type} onChange={handleChange} className="input-field">
                    <option value="rent">For Rent</option>
                    <option value="buy">For Sale</option>
                    <option value="lease">Lease</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="input-label">Price (₹) *</label>
                  <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="e.g. 25000" className="input-field" required />
                </div>
                {form.listing_type === 'rent' && (
                  <div>
                    <label className="input-label">Price Period</label>
                    <select name="price_period" value={form.price_period} onChange={handleChange} className="input-field">
                      <option value="month">Per Month</option>
                      <option value="year">Per Year</option>
                      <option value="day">Per Day</option>
                    </select>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 2: Details */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="input-label">Bedrooms *</label>
                  <select name="bedrooms" value={form.bedrooms} onChange={handleChange} className="input-field">
                    {['0', '1', '2', '3', '4', '5', '6'].map(n => <option key={n}>{n}</option>)}
                  </select>
                </div>
                <div>
                  <label className="input-label">Bathrooms *</label>
                  <select name="bathrooms" value={form.bathrooms} onChange={handleChange} className="input-field">
                    {['1', '2', '3', '4', '5'].map(n => <option key={n}>{n}</option>)}
                  </select>
                </div>
                <div>
                  <label className="input-label">Area *</label>
                  <div className="flex gap-2">
                    <input type="number" name="area" value={form.area} onChange={handleChange} placeholder="e.g. 1200" className="input-field flex-1" required />
                    <select name="area_unit" value={form.area_unit} onChange={handleChange} className="input-field w-auto">
                      <option value="sqft">sqft</option>
                      <option value="sqm">sqm</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { name: 'furnished', label: '🛋️ Furnished' },
                  { name: 'parking', label: '🚗 Parking' },
                  { name: 'pet_friendly', label: '🐾 Pet Friendly' },
                ].map(({ name, label }) => (
                  <label key={name} className={`flex items-center justify-between p-3 rounded-xl cursor-pointer border-2 transition-all
                    ${form[name] ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700'}`}>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
                    <input type="checkbox" name={name} checked={form[name]} onChange={handleChange} className="hidden" />
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${form[name] ? 'bg-primary-600 border-primary-600' : 'border-gray-300'}`}>
                      {form[name] && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </label>
                ))}
              </div>

              {/* Amenities */}
              <div>
                <label className="input-label">Amenities</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {amenitiesList.map((amenity) => (
                    <button key={amenity} type="button" onClick={() => toggleAmenity(amenity)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border-2 transition-all
                        ${form.amenities.includes(amenity) ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300'}`}>
                      {form.amenities.includes(amenity) && <Check className="w-3 h-3 text-primary-600" />}
                      {amenity}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Location */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <div>
                <label className="input-label">Full Address *</label>
                <input type="text" name="address" value={form.address} onChange={handleChange}
                  placeholder="e.g. 42, 3rd Cross, Koramangala 5th Block" className="input-field" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="input-label">City *</label>
                  <input type="text" name="city" value={form.city} onChange={handleChange} placeholder="e.g. Bangalore" className="input-field" required />
                </div>
                <div>
                  <label className="input-label">State *</label>
                  <input type="text" name="state" value={form.state} onChange={handleChange} placeholder="e.g. Karnataka" className="input-field" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="input-label">Latitude (optional)</label>
                  <input type="number" name="latitude" value={form.latitude} onChange={handleChange} placeholder="e.g. 12.9716" className="input-field" step="any" />
                </div>
                <div>
                  <label className="input-label">Longitude (optional)</label>
                  <input type="number" name="longitude" value={form.longitude} onChange={handleChange} placeholder="e.g. 77.5946" className="input-field" step="any" />
                </div>
              </div>
              <div>
                <label className="input-label">Nearby Schools (comma-separated)</label>
                <input type="text" name="nearby_schools" value={form.nearby_schools} onChange={handleChange}
                  placeholder="e.g. Delhi Public School (0.5km), Ryan International (1.2km)" className="input-field" />
              </div>
              <div>
                <label className="input-label">Nearby Hospitals (comma-separated)</label>
                <input type="text" name="nearby_hospitals" value={form.nearby_hospitals} onChange={handleChange}
                  placeholder="e.g. Apollo Hospital (1km), Fortis (2.5km)" className="input-field" />
              </div>
              <div>
                <label className="input-label">Nearby Metro Stations</label>
                <input type="text" name="nearby_metro" value={form.nearby_metro} onChange={handleChange}
                  placeholder="e.g. Koramangala Metro (0.8km)" className="input-field" />
              </div>
            </motion.div>
          )}

          {/* Step 4: Media */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
              <div>
                <label className="input-label">Property Photos * (max 10)</label>
                <div
                  className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-8 text-center hover:border-primary-400 transition-colors cursor-pointer"
                  onClick={() => document.getElementById('imageInput').click()}
                >
                  <ImageIcon className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Drop images here or click to browse</p>
                  <p className="text-xs text-gray-400">JPG, PNG, WEBP up to 10MB each</p>
                  <input id="imageInput" type="file" accept="image/*" multiple onChange={handleImageSelect} className="hidden" />
                </div>
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-3">
                    {imagePreviews.map((src, i) => (
                      <div key={i} className="relative group aspect-square rounded-xl overflow-hidden">
                        <img src={src} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        {i === 0 && (
                          <span className="absolute bottom-1 left-1 text-xs bg-black/60 text-white px-1.5 py-0.5 rounded font-medium">Cover</span>
                        )}
                      </div>
                    ))}
                    {imagePreviews.length < 10 && (
                      <button
                        type="button"
                        onClick={() => document.getElementById('imageInput').click()}
                        className="aspect-square rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex items-center justify-center hover:border-primary-400 transition-colors"
                      >
                        <Plus className="w-5 h-5 text-gray-400" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                <p className="text-xs font-semibold text-amber-800 dark:text-amber-300 mb-1">📋 Submission Note</p>
                <p className="text-xs text-amber-700 dark:text-amber-400">
                  Your property will be reviewed by our team within 24 hours. You'll receive an email notification once it's approved and goes live.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-4 border-t border-gray-100 dark:border-gray-800">
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 0}
            className="btn-secondary gap-2 disabled:opacity-30"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              className="btn-primary gap-2"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button type="submit" disabled={loading} className="btn-primary gap-2">
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Submit Property
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
