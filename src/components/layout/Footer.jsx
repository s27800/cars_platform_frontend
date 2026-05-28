import { Link } from 'react-router-dom';
import {
  IoCarSportOutline,
  IoLogoFacebook,
  IoLogoInstagram,
  IoLogoTwitter,
  IoChevronForwardOutline,
  IoMailOutline,
} from 'react-icons/io5';


const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { path: '/about', label: 'About us' },
    { path: '/terms', label: 'Terms of service' },
    { path: '/cars', label: 'Cars' },
    { path: '/comparison', label: 'Comparison' },
  ];

  const socialLinks = [
    { name: 'Facebook', url: 'https://facebook.com', icon: <IoLogoFacebook className="w-5 h-5" /> },
    { name: 'Instagram', url: 'https://instagram.com', icon: <IoLogoInstagram className="w-5 h-5" /> },
    { name: 'Twitter', url: 'https://twitter.com', icon: <IoLogoTwitter className="w-5 h-5" /> },
  ];

  return (
    <footer className="bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Brand section */}
          <div>
            <Link 
              to="/" 
              className="flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity"
              aria-label="CarsPlatform - Home"
            >
              <IoCarSportOutline className="h-8 w-8 text-primary-600 dark:text-primary-400" />
              <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                CarsPlatform
              </span>
            </Link>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-xs">
              Your comprehensive source of car information. 
              Compare models, read reviews, analyze fuel reports and find your dream car.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wider mb-4">
              Navigation
            </h3>
            <ul className="space-y-2">
              {footerLinks.map(({ path, label }) => (
                <li key={path}>
                  <Link
                    to={path}
                    className="inline-flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    <IoChevronForwardOutline className="w-3 h-3" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials & Contact */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wider mb-4">
              Follow us
            </h3>
            <div className="flex gap-2 mb-6">
              {socialLinks.map(({ name, url, icon }) => (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  aria-label={`Visit us on ${name}`}
                >
                  {icon}
                </a>
              ))}
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 flex items-center gap-2">
              <IoMailOutline className="w-4 h-4" />
              contact@carsplatform.com
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-neutral-500">
            © {currentYear} CarsPlatform. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link to="/terms" className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors">
              Terms of service
            </Link>
            <Link to="/privacy" className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors">
              Privacy policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
