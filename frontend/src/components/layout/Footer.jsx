import { Link } from 'react-router-dom';
import { Home, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';

const footerLinks = {
  Company: [
    { label: 'About Us', to: '/about' },
    { label: 'Careers', to: '/careers' },
    { label: 'Press', to: '/press' },
    { label: 'Blog', to: '/blog' },
  ],
  Properties: [
    { label: 'For Rent', to: '/properties?listing_type=rent' },
    { label: 'For Sale', to: '/properties?listing_type=buy' },
    { label: 'New Projects', to: '/properties?sort=newest' },
    { label: 'Featured', to: '/properties?featured=true' },
  ],
  Support: [
    { label: 'Help Center', to: '/help' },
    { label: 'Safety Tips', to: '/safety' },
    { label: 'Contact Us', to: '/contact' },
    { label: 'FAQ', to: '/faq' },
  ],
  Legal: [
    { label: 'Privacy Policy', to: '/privacy' },
    { label: 'Terms of Service', to: '/terms' },
    { label: 'Cookie Policy', to: '/cookies' },
  ],
};

const socials = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Youtube, href: '#', label: 'YouTube' },
];

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300">
      {/* Main Footer */}
      <div className="page-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-accent-600 rounded-xl flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-white">
                House<span className="text-primary-400">Hunt</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
              India's most trusted premium property marketplace. Find your perfect home with verified listings and zero brokerage.
            </p>

            {/* Contact */}
            <div className="space-y-2.5">
              <a href="mailto:hello@househunt.in" className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors">
                <Mail className="w-4 h-4 text-primary-400 flex-shrink-0" />
                hello@househunt.in
              </a>
              <a href="tel:+918001234567" className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors">
                <Phone className="w-4 h-4 text-primary-400 flex-shrink-0" />
                +91 800-123-4567
              </a>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <MapPin className="w-4 h-4 text-primary-400 flex-shrink-0" />
                Bangalore, Karnataka, India
              </div>
            </div>

            {/* Socials */}
            <div className="flex items-center gap-3 mt-6">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-xl bg-gray-800 hover:bg-primary-600 flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-white font-semibold text-sm mb-4">{title}</h3>
              <ul className="space-y-2.5">
                {links.map(({ label, to }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className="text-gray-400 hover:text-white text-sm transition-colors hover:translate-x-0.5 inline-block"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-white font-semibold mb-1">Stay Updated</h3>
              <p className="text-gray-400 text-sm">Get the latest property listings and market insights.</p>
            </div>
            <form className="flex gap-2 w-full max-w-md" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button type="submit" className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl text-sm transition-colors flex-shrink-0">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="page-container py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-gray-500 text-xs">© {new Date().getFullYear()} HouseHunt Technologies Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/terms" className="text-gray-500 hover:text-gray-300 text-xs transition-colors">Terms</Link>
            <Link to="/privacy" className="text-gray-500 hover:text-gray-300 text-xs transition-colors">Privacy</Link>
            <span className="text-gray-600 text-xs">🇮🇳 India</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
