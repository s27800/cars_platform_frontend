import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  IoCarSportOutline,
  IoSearchOutline,
  IoChevronDownOutline,
  IoMenuOutline,
  IoCloseOutline,
  IoPersonOutline,
  IoStarOutline,
  IoSpeedometerOutline,
  IoSettingsOutline,
  IoLogOutOutline,
  IoSunnyOutline,
  IoMoonOutline,
} from 'react-icons/io5';
import { useAuth, useTheme } from '../../hooks';
import { Button, Input, NavLink, Avatar, Dropdown, IconButton } from '../ui';


const Header = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);

  const navLinks = [
    { path: '/cars', label: 'Cars' },
    { path: '/comparison', label: 'Comparison' },
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

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/cars?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMobileMenuOpen(false);
    }
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
            <form onSubmit={handleSearch} className="w-full">
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for a car..."
                leftIcon={<IoSearchOutline className="w-5 h-5" />}
                aria-label="Search for a car"
              />
            </form>
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-3">

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
                    My profile
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/my-reviews" icon={<IoStarOutline className="w-4 h-4" />}>
                    My reviews
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/my-fuel-reports" icon={<IoSpeedometerOutline className="w-4 h-4" />}>
                    Fuel reports
                  </Dropdown.Item>

                  {isAdmin && (
                    <>
                      <Dropdown.Divider />
                      <Dropdown.Item as={Link} to="/admin" variant="primary" icon={<IoSettingsOutline className="w-4 h-4" />}>
                        Admin panel
                      </Dropdown.Item>
                    </>
                  )}

                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout} variant="danger" icon={<IoLogOutOutline className="w-4 h-4" />}>
                    Log out
                  </Dropdown.Item>
                </Dropdown>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Button to="/login" variant="ghost">Sign In</Button>
                <Button to="/register" variant="primary">Sign Up</Button>
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
            <form onSubmit={handleSearch}>
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for a car..."
                size="lg"
                aria-label="Search for a car"
              />
            </form>

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
                  <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                </span>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  {isDark ? 'Dark' : 'Light'}
                </span>
              </button>
            </div>

            {/* Mobile auth buttons */}
            {!isAuthenticated && (
              <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700 space-y-2">
                <Button to="/login" variant="secondary" fullWidth size="lg">
                  Sign In
                </Button>
                <Button to="/register" variant="primary" fullWidth size="lg">
                  Sign Up
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
