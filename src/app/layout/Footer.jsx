import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  IoCarSportOutline,
  IoLogoFacebook,
  IoLogoInstagram,
  IoLogoTwitter,
  IoChevronForwardOutline,
  IoMailOutline,
} from 'react-icons/io5';


// Site footer: brand blurb, secondary navigation and contact details
const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { path: '/about', label: t('footer.aboutUs') },
    { path: '/faq', label: t('footer.faq') },
    { path: '/terms', label: t('footer.terms') },
    { path: '/cars', label: t('navigation.cars') },
    { path: '/comparison', label: t('navigation.comparison') },
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
              aria-label={t('a11y.homeLink')}
            >
              <IoCarSportOutline className="h-8 w-8 text-primary-600 dark:text-primary-400" />
              <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                CarsPlatform
              </span>
            </Link>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-xs">
              {t('footer.description')}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wider mb-4">
              {t('footer.navigation')}
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
              {t('footer.followUs')}
            </h3>
            <div className="flex gap-2 mb-6">
              {socialLinks.map(({ name, url, icon }) => (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  aria-label={t('a11y.visitUsOn', { network: name })}
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
            {t('footer.copyright', { year: currentYear })}
          </p>
          <div className="flex gap-6 text-sm">
            <Link to="/terms" className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors">
              {t('footer.terms')}
            </Link>
            <Link to="/privacy" className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors">
              {t('footer.privacy')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
