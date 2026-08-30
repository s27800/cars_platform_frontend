import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  IoCarSportOutline,
  IoSearchOutline,
  IoStatsChartOutline,
  IoDocumentTextOutline,
  IoSpeedometerOutline,
  IoPeopleOutline,
  IoShieldCheckmarkOutline,
  IoRocketOutline,
} from 'react-icons/io5';
import { Card } from '../components/ui';


const AboutPage = () => {
  const { t } = useTranslation('pages');

  const features = [
    {
      icon: IoSearchOutline,
      title: t('about.features.search.title'),
      description: t('about.features.search.description'),
    },
    {
      icon: IoStatsChartOutline,
      title: t('about.features.comparison.title'),
      description: t('about.features.comparison.description'),
    },
    {
      icon: IoDocumentTextOutline,
      title: t('about.features.reviews.title'),
      description: t('about.features.reviews.description'),
    },
    {
      icon: IoSpeedometerOutline,
      title: t('about.features.fuel.title'),
      description: t('about.features.fuel.description'),
    },
    {
      icon: IoShieldCheckmarkOutline,
      title: t('about.features.moderated.title'),
      description: t('about.features.moderated.description'),
    },
    {
      icon: IoPeopleOutline,
      title: t('about.features.community.title'),
      description: t('about.features.community.description'),
    },
  ];

  const stats = [
    { value: '500+', label: t('about.stats.carModels') },
    { value: '50+', label: t('about.stats.brands') },
    { value: '1000+', label: t('about.stats.reviews') },
    { value: '5000+', label: t('about.stats.fuelReports') },
  ];

  const steps = [
    { step: 1, title: t('about.howItWorks.step1.title'), description: t('about.howItWorks.step1.description') },
    { step: 2, title: t('about.howItWorks.step2.title'), description: t('about.howItWorks.step2.description') },
    { step: 3, title: t('about.howItWorks.step3.title'), description: t('about.howItWorks.step3.description') },
    { step: 4, title: t('about.howItWorks.step4.title'), description: t('about.howItWorks.step4.description') },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 to-primary-800 dark:from-primary-800 dark:to-primary-950 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white/10 rounded-2xl">
              <IoCarSportOutline className="w-16 h-16 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t('about.title')}
          </h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto leading-relaxed">
            {t('about.subtitle')}
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 bg-white dark:bg-neutral-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">
              {t('about.mission.title')}
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              {t('about.mission.description')}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map(({ value, label }) => (
              <Card key={label} variant="bordered" padding="lg" className="text-center">
                <p className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-1">
                  {value}
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {label}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-neutral-50 dark:bg-neutral-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">
              {t('about.features.title')}
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              {t('about.features.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, description }) => (
              <Card key={title} variant="bordered" padding="lg" className="hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
                    <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">
                      {title}
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-white dark:bg-neutral-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">
              {t('about.howItWorks.title')}
            </h2>
          </div>

          <div className="space-y-8">
            {steps.map(({ step, title, description }) => (
              <div key={step} className="flex items-start gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  {step}
                </div>
                <div className="pt-2">
                  <h3 className="font-semibold text-neutral-900 dark:text-white mb-1">
                    {title}
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
              <IoRocketOutline className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
            {t('about.cta.title')}
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-8 max-w-lg mx-auto">
            {t('about.cta.description')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/cars"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors"
            >
              <IoSearchOutline className="w-5 h-5" />
              {t('about.cta.button')}
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white font-medium rounded-xl border border-neutral-200 dark:border-neutral-700 transition-colors"
            >
              {t('about.cta.createAccount')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
