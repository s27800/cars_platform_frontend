import { Link } from 'react-router-dom';
import {
  IoFlashOutline,
  IoTrendingUpOutline,
  IoPeopleOutline,
  IoBatteryChargingOutline,
  IoDocumentTextOutline,
  IoBarChartOutline,
  IoFlameOutline,
  IoStarOutline,
  IoSearchOutline,
  IoChevronForwardOutline,
  IoArrowForwardOutline,
} from 'react-icons/io5';
import { Button } from '../components/ui';


const HomePage = () => {
  const quickFilters = [
    {
      title: 'Economical',
      description: 'Cars with low fuel consumption',
      icon: <IoFlashOutline className="w-8 h-8" />,
      link: '/cars?tags=economical',
      color: 'bg-green-500',
    },
    {
      title: 'Sporty',
      description: 'Powerful and dynamic cars',
      icon: <IoTrendingUpOutline className="w-8 h-8" />,
      link: '/cars?tags=sporty',
      color: 'bg-red-500',
    },
    {
      title: 'Family',
      description: 'Spacious and comfortable',
      icon: <IoPeopleOutline className="w-8 h-8" />,
      link: '/cars?bodyTypes=estate,suv',
      color: 'bg-blue-500',
    },
    {
      title: 'Electric',
      description: 'Electric only vehicles',
      icon: <IoBatteryChargingOutline className="w-8 h-8" />,
      link: '/cars?fuelTypes=electric',
      color: 'bg-yellow-500',
    },
  ];

  const popularBrands = [
    { name: 'Audi', slug: 'audi' },
    { name: 'BMW', slug: 'bmw' },
    { name: 'Mercedes', slug: 'mercedes' },
    { name: 'Volkswagen', slug: 'volkswagen' },
    { name: 'Toyota', slug: 'toyota' },
    { name: 'Ford', slug: 'ford' },
    { name: 'Skoda', slug: 'skoda' },
    { name: 'Opel', slug: 'opel' },
  ];

  const stats = [
    { value: '500+', label: 'Car models' },
    { value: '10k+', label: 'User reviews' },
    { value: '25k+', label: 'Fuel reports' },
    { value: '50+', label: 'Brands in database' },
  ];

  const features = [
    {
      title: 'Detailed specifications',
      description: 'Complete technical data for every model',
      icon: <IoDocumentTextOutline className="w-6 h-6" />,
    },
    {
      title: 'Model comparison',
      description: 'Compare multiple cars side by side',
      icon: <IoBarChartOutline className="w-6 h-6" />,
    },
    {
      title: 'Real fuel consumption',
      description: 'Data from users, not manufacturers',
      icon: <IoFlameOutline className="w-6 h-6" />,
    },
    {
      title: 'Owner reviews',
      description: 'Reviews from real drivers',
      icon: <IoStarOutline className="w-6 h-6" />,
    },
  ];

  return (
    <div className="space-y-16 pb-16">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-neutral-50 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-800" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary-200/30 dark:bg-primary-900/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-secondary-200/20 dark:bg-secondary-900/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900 dark:text-white leading-tight">
                Find your dream{' '}
                <span className="text-primary-600 dark:text-primary-400">car</span>
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-neutral-600 dark:text-neutral-300 max-w-2xl">
                Compare specifications, read user reviews, and analyze real fuel consumption data. All in one place.
              </p>
              
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  to="/cars"
                  size="lg"
                  leftIcon={<IoSearchOutline className="w-5 h-5" />}
                  className="shadow-lg shadow-primary-600/25 hover:shadow-xl hover:shadow-primary-600/30 hover:-translate-y-0.5"
                >
                  Browse cars
                </Button>
                <Button
                  to="/comparison"
                  variant="outline"
                  size="lg"
                  leftIcon={<IoBarChartOutline className="w-5 h-5" />}
                  className="hover:-translate-y-0.5"
                >
                  Compare models
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="
                    bg-white/80 dark:bg-neutral-800/80
                    backdrop-blur-sm
                    rounded-2xl p-6
                    border border-neutral-200/50 dark:border-neutral-700/50
                    shadow-lg
                    text-center
                  "
                >
                  <div className="text-3xl sm:text-4xl font-bold text-primary-600 dark:text-primary-400">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Search Section */}
      <section aria-labelledby="quick-search-heading" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 id="quick-search-heading" className="text-3xl font-bold text-neutral-900 dark:text-white">
            Quick search
          </h2>
          <p className="mt-3 text-lg text-neutral-600 dark:text-neutral-400">
            Choose a category and find a car tailored to your needs
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickFilters.map((filter, index) => (
            <Link
              key={index}
              to={filter.link}
              className="
                group relative
                bg-white dark:bg-neutral-800
                rounded-2xl p-6
                border border-neutral-200 dark:border-neutral-700
                shadow-card hover:shadow-card-hover
                transition-all duration-300
                hover:-translate-y-1
              "
            >
              <div className={`
                inline-flex items-center justify-center
                w-14 h-14 rounded-xl
                ${filter.color} text-white
                mb-4
                group-hover:scale-110 transition-transform duration-300
              `}>
                {filter.icon}
              </div>

              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-1">
                {filter.title}
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {filter.description}
              </p>

              <div className="absolute top-6 right-6 text-neutral-300 dark:text-neutral-600 group-hover:text-primary-500 transition-colors">
                <IoChevronForwardOutline className="w-5 h-5" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Brands Section */}
      <section aria-labelledby="brands-heading" className="bg-neutral-50 dark:bg-neutral-800/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 id="brands-heading" className="text-3xl font-bold text-neutral-900 dark:text-white">
              Popular brands
            </h2>
            <p className="mt-3 text-lg text-neutral-600 dark:text-neutral-400">
              Browse cars by manufacturer
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {popularBrands.map((brand) => (
              <Link
                key={brand.slug}
                to={`/cars?brand=${brand.slug}`}
                className="
                  flex flex-col items-center justify-center
                  bg-white dark:bg-neutral-800
                  rounded-xl p-4
                  border border-neutral-200 dark:border-neutral-700
                  hover:border-primary-300 dark:hover:border-primary-600
                  hover:shadow-md
                  transition-all duration-200
                  group
                "
              >
                <div className="
                  w-12 h-12 rounded-full
                  bg-neutral-100 dark:bg-neutral-700
                  flex items-center justify-center
                  text-xl font-bold text-neutral-400 dark:text-neutral-500
                  group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30
                  group-hover:text-primary-600 dark:group-hover:text-primary-400
                  transition-colors
                ">
                  {brand.name.charAt(0)}
                </div>
                <span className="mt-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {brand.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section aria-labelledby="features-heading" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 id="features-heading" className="text-3xl font-bold text-neutral-900 dark:text-white">
            Why CarsPlatform?
          </h2>
          <p className="mt-3 text-lg text-neutral-600 dark:text-neutral-400">
            Everything you need to make an informed decision
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="
                bg-white dark:bg-neutral-800
                rounded-2xl p-6
                border border-neutral-200 dark:border-neutral-700
                shadow-card
              "
            >
              <div className="
                inline-flex items-center justify-center
                w-12 h-12 rounded-xl
                bg-primary-100 dark:bg-primary-900/30
                text-primary-600 dark:text-primary-400
                mb-4
              ">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="
          relative overflow-hidden
          bg-gradient-to-r from-primary-600 to-primary-700
          rounded-3xl
          p-8 sm:p-12
          text-center
        ">
          <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-60 h-60 bg-white/10 rounded-full translate-x-1/3 translate-y-1/3" />
          
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to find your car?
            </h2>
            <p className="text-lg text-primary-100 max-w-2xl mx-auto mb-8">
              Join thousands of users who already use our platform to compare and choose the best cars.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                to="/cars"
                variant="white"
                size="lg"
                rightIcon={<IoArrowForwardOutline className="w-5 h-5" />}
              >
                Start searching
              </Button>
              <Button
                to="/register"
                variant="ghost-light"
                size="lg"
              >
                Create account
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
