import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FilterSection = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-100 dark:border-gray-800 pb-4 mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-left mb-3"
      >
        <span className="font-semibold text-gray-900 dark:text-white text-sm">{title}</span>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      {open && children}
    </div>
  );
};

const Toggle = ({ label, checked, onChange }) => (
  <label className="flex items-center justify-between cursor-pointer py-1.5 group">
    <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{label}</span>
    <div
      onClick={onChange}
      className={`relative w-10 h-5 rounded-full transition-colors ${checked ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'}`}
    >
      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? 'left-5' : 'left-0.5'}`} />
    </div>
  </label>
);

export default function PropertyFilters({ filters, onChange }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
      <h3 className="font-bold text-gray-900 dark:text-white mb-4">Refine Search</h3>

      {/* Listing Type */}
      <FilterSection title="Listing Type">
        <div className="flex gap-2 flex-wrap">
          {['', 'rent', 'buy', 'lease'].map((type) => (
            <button
              key={type}
              onClick={() => onChange({ listing_type: type })}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
                ${filters.listing_type === type
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
            >
              {type === '' ? 'All' : type === 'buy' ? 'For Sale' : `For ${type.charAt(0).toUpperCase() + type.slice(1)}`}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range">
        <div className="space-y-2">
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">Min (₹)</label>
              <input
                type="number"
                placeholder="0"
                value={filters.min_price || ''}
                onChange={(e) => onChange({ min_price: e.target.value })}
                className="input-field py-2 text-sm"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">Max (₹)</label>
              <input
                type="number"
                placeholder="Any"
                value={filters.max_price || ''}
                onChange={(e) => onChange({ max_price: e.target.value })}
                className="input-field py-2 text-sm"
              />
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {['5000', '10000', '25000', '50000', '100000'].map((p) => (
              <button
                key={p}
                onClick={() => onChange({ max_price: p })}
                className={`px-2.5 py-1 text-xs rounded-lg transition-all font-medium
                  ${filters.max_price === p ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}
              >
                ≤ ₹{parseInt(p).toLocaleString('en-IN')}
              </button>
            ))}
          </div>
        </div>
      </FilterSection>

      {/* Property Type */}
      <FilterSection title="Property Type">
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: '', label: 'All Types', icon: '🏘️' },
            { value: 'apartment', label: 'Apartment', icon: '🏢' },
            { value: 'villa', label: 'Villa', icon: '🏡' },
            { value: 'house', label: 'House', icon: '🏠' },
            { value: 'studio', label: 'Studio', icon: '🛋️' },
            { value: 'commercial', label: 'Commercial', icon: '🏪' },
          ].map(({ value, label, icon }) => (
            <button
              key={value}
              onClick={() => onChange({ property_type: value })}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all
                ${filters.property_type === value
                  ? 'bg-primary-50 border-2 border-primary-500 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                  : 'bg-gray-50 dark:bg-gray-800 border-2 border-transparent text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
            >
              <span>{icon}</span>
              {label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Bedrooms */}
      <FilterSection title="Bedrooms">
        <div className="flex gap-2">
          {['', '1', '2', '3', '4'].map((b) => (
            <button
              key={b}
              onClick={() => onChange({ bedrooms: b })}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all
                ${filters.bedrooms === b
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
            >
              {b === '' ? 'Any' : b === '4' ? '4+' : `${b} BHK`}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Bathrooms */}
      <FilterSection title="Bathrooms">
        <div className="flex gap-2">
          {['', '1', '2', '3'].map((b) => (
            <button
              key={b}
              onClick={() => onChange({ bathrooms: b })}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all
                ${filters.bathrooms === b
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}
            >
              {b === '' ? 'Any' : `${b}+`}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Amenities */}
      <FilterSection title="Amenities">
        <div className="space-y-1">
          <Toggle
            label="Furnished"
            checked={filters.furnished === 'true'}
            onChange={() => onChange({ furnished: filters.furnished === 'true' ? '' : 'true' })}
          />
          <Toggle
            label="Parking Available"
            checked={filters.parking === 'true'}
            onChange={() => onChange({ parking: filters.parking === 'true' ? '' : 'true' })}
          />
          <Toggle
            label="Pet Friendly"
            checked={filters.pet_friendly === 'true'}
            onChange={() => onChange({ pet_friendly: filters.pet_friendly === 'true' ? '' : 'true' })}
          />
        </div>
      </FilterSection>

      {/* City */}
      <FilterSection title="City" defaultOpen={false}>
        <input
          type="text"
          placeholder="Enter city name..."
          value={filters.city || ''}
          onChange={(e) => onChange({ city: e.target.value })}
          className="input-field text-sm py-2"
        />
      </FilterSection>

      <button
        onClick={() => onChange({ city: '', min_price: '', max_price: '', property_type: '', listing_type: '', bedrooms: '', bathrooms: '', furnished: '', parking: '', pet_friendly: '' })}
        className="w-full py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors font-medium mt-2"
      >
        Clear All Filters
      </button>
    </div>
  );
}
