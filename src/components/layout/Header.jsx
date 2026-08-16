import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  IoCarSportOutline,
  IoChevronDownOutline,
  IoMenuOutline,
  IoCloseOutline,
  IoPersonOutline,
  IoSettingsOutline,
  IoLogOutOutline,
  IoSunnyOutline,
  IoMoonOutline,
} from 'react-icons/io5';
import { useAuth, useTheme, useLanguage } from '../../hooks';
import { Button, NavLink, Avatar, Dropdown, IconButton, LanguageSwitcher } from '../ui';
import { GlobalSearch } from '../shared';


const Header = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { language, changeLanguage, availableLanguages } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navLinks = [
    { path: '/cars', label: t('navigation.cars') },
    { path: '/comparison', label: t('navigation.comparison') },
  ];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserDropdownOpen(false);
  }, [location.pathname]);

  const isActiveLink = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleMobileSearchSubmit = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <nav 
      className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 sticky top-0 z-50"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo and desktop nav */}
          <div className="flex items-center gap-8">
            <Link 
              to="/" 
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              aria-label="CarsPlatform - Home"
            >
              <IoCarSportOutline className="h-9 w-9 text-primary-600 dark:text-primary-400" />
              <span className="text-xl font-bold text-primary-600 dark:text-primary-400 hidden sm:block">
                CarsPlatform
              </span>
            </Link>

            {/* Desktop navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(({ path, label }) => (
                <NavLink key={path} to={path} isActive={isActiveLink(path)}>
                  {label}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Desktop search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <GlobalSearch className="w-full" />
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-3">

            {/* Language switcher */}
            <LanguageSwitcher />

            {/* Theme toggle */}
            <IconButton
              onClick={toggleTheme}
              label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-pressed={isDark}
            >
              {isDark ? (
                <IoSunnyOutline className="w-5 h-5" />
              ) : (
                <IoMoonOutline className="w-5 h-5" />
              )}
            </IconButton>

            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 transition-colors"
                  aria-expanded={isUserDropdownOpen}
                  aria-haspopup="true"
                >
                  <Avatar name={user?.username} size="sm" />
                  <span className="hidden sm:block text-sm font-medium max-w-[120px] truncate">
                    {user?.username || 'User'}
                  </span>
                  <IoChevronDownOutline className={`w-4 h-4 transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <Dropdown isOpen={isUserDropdownOpen} align="right">
                  <Dropdown.Header>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                      {user?.username}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                      {user?.email}
                    </p>
                  </Dropdown.Header>

                  <Dropdown.Item as={Link} to="/profile" icon={<IoPersonOutline className="w-4 h-4" />}>
                    {t('navigation.profile')}
                  </Dropdown.Item>

                  {isAdmin && (
                    <>
                      <Dropdown.Divider />
                      <Dropdown.Item as={Link} to="/admin" variant="primary" icon={<IoSettingsOutline className="w-4 h-4" />}>
                        {t('navigation.admin')}
                      </Dropdown.Item>
                    </>
                  )}

                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout} variant="danger" icon={<IoLogOutOutline className="w-4 h-4" />}>
                    {t('navigation.logout')}
                  </Dropdown.Item>
                </Dropdown>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Button to="/login" variant="ghost">{t('navigation.login')}</Button>
                <Button to="/register" variant="primary">{t('navigation.register')}</Button>
              </div>
            )}

            {/* Mobile menu toggle */}
            <IconButton
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? <IoCloseOutline className="w-6 h-6" /> : <IoMenuOutline className="w-6 h-6" />}
            </IconButton>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div 
          id="mobile-menu"
          className="md:hidden border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
        >
          <div className="px-4 py-4 space-y-4">

            {/* Mobile search */}
            <GlobalSearch 
              className="w-full" 
              size="lg"
              onSearchSubmit={handleMobileSearchSubmit}
            />

            {/* Mobile nav links */}
            <div className="space-y-1">
              {navLinks.map(({ path, label }) => (
                <NavLink key={path} to={path} isActive={isActiveLink(path)} variant="mobile">
                  {label}
                </NavLink>
              ))}
            </div>

            {/* Mobile theme toggle */}
            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
              <button
                onClick={toggleTheme}
                className="flex items-center justify-between w-full px-4 py-3 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <span className="flex items-center gap-3">
                  {isDark ? (
                    <IoSunnyOutline className="w-5 h-5" />
                  ) : (
                    <IoMoonOutline className="w-5 h-5" />
                  )}
                  <span>{isDark ? t('profile:settings.themeLight') : t('profile:settings.themeDark')}</span>
                </span>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  {isDark ? t('profile:settings.themeDark') : t('profile:settings.themeLight')}
                </span>
              </button>

              {/* Mobile language toggle */}
              <div className="mt-2">
                <div className="flex items-center justify-between w-full px-4 py-3 text-neutral-700 dark:text-neutral-200">
                  <span className="flex items-center gap-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    <span>{t('profile:settings.language')}</span>
                  </span>
                </div>
                <div className="flex gap-2 px-4">
                  {availableLanguages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-colors
                        ${language === lang.code
                          ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 border border-primary-300 dark:border-primary-700'
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                        }`}
                    >
                      {lang.code === 'en' ? (
                        <svg className="w-5 h-4 rounded-sm shadow-sm" viewBox="0 0 60 30">
                          <clipPath id="gb-s"><path d="M0,0 v30 h60 v-30 z"/></clipPath>
                          <clipPath id="gb-t"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/></clipPath>
                          <g clipPath="url(#gb-s)">
                            <path d="M0,0 v30 h60 v-30 z" fill="#012169"/>
                            <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
                            <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#gb-t)" stroke="#C8102E" strokeWidth="4"/>
                            <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
                            <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
                          </g>
                        </svg>
                      ) : (
                        <svg className="w-5 h-4 rounded-sm shadow-sm" viewBox="0 0 16 10">
                          <rect width="16" height="5" fill="#fff"/>
                          <rect y="5" width="16" height="5" fill="#DC143C"/>
                        </svg>
                      )}
                      {lang.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile auth buttons */}
            {!isAuthenticated && (
              <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700 space-y-2">
                <Button to="/login" variant="secondary" fullWidth size="lg">
                  {t('navigation.login')}
                </Button>
                <Button to="/register" variant="primary" fullWidth size="lg">
                  {t('navigation.register')}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
