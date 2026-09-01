import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  IoHelpCircleOutline,
  IoChevronDownOutline,
  IoSearchOutline,
  IoPersonOutline,
  IoCarSportOutline,
  IoDocumentTextOutline,
  IoSpeedometerOutline,
  IoShieldCheckmarkOutline,
  IoSettingsOutline,
} from 'react-icons/io5';
import { Card } from '../../shared/components/ui';


// One collapsible question
const FAQItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="border-b border-neutral-200 dark:border-neutral-700 last:border-b-0">
      <button
        onClick={onClick}
        className="flex items-center justify-between w-full py-5 px-4 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
        aria-expanded={isOpen}
      >
        <span className="font-medium text-neutral-900 dark:text-white pr-4">
          {question}
        </span>
        <IoChevronDownOutline
          className={`w-5 h-5 text-neutral-500 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="px-4 pb-5 text-neutral-600 dark:text-neutral-400 leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
};


// A group of questions under one heading
const FAQCategory = ({ icon: Icon, title, faqs }) => {
  const [openIndices, setOpenIndices] = useState(new Set());

  const toggleItem = (index) => {
    setOpenIndices(prev => {
      const newSet = new Set(prev);

      if (newSet.has(index))
        newSet.delete(index);
      else
        newSet.add(index);

      return newSet;
    });
  };

  return (
    <Card variant="bordered" padding="none" className="overflow-hidden">
      <div className="flex items-center gap-3 p-4 bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-700">
        <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
          <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
        </div>
        <h2 className="font-semibold text-neutral-900 dark:text-white">
          {title}
        </h2>
      </div>
      <div>
        {faqs.map((faq, index) => (
          <FAQItem
            key={index}
            question={faq.question}
            answer={faq.answer}
            isOpen={openIndices.has(index)}
            onClick={() => toggleItem(index)}
          />
        ))}
      </div>
    </Card>
  );
};


// Static page with the frequently asked questions
const FAQPage = () => {
  const { t } = useTranslation('pages');

  const faqCategories = [
    {
      icon: IoPersonOutline,
      title: t('faq.categories.account.title'),
      faqs: [
        { question: t('faq.categories.account.q1'), answer: t('faq.categories.account.a1') },
        { question: t('faq.categories.account.q2'), answer: t('faq.categories.account.a2') },
        { question: t('faq.categories.account.q3'), answer: t('faq.categories.account.a3') },
        { question: t('faq.categories.account.q4'), answer: t('faq.categories.account.a4') },
      ],
    },
    {
      icon: IoCarSportOutline,
      title: t('faq.categories.search.title'),
      faqs: [
        { question: t('faq.categories.search.q1'), answer: t('faq.categories.search.a1') },
        { question: t('faq.categories.search.q2'), answer: t('faq.categories.search.a2') },
        { question: t('faq.categories.search.q3'), answer: t('faq.categories.search.a3') },
        { question: t('faq.categories.search.q4'), answer: t('faq.categories.search.a4') },
      ],
    },
    {
      icon: IoSearchOutline,
      title: t('faq.categories.comparison.title'),
      faqs: [
        { question: t('faq.categories.comparison.q1'), answer: t('faq.categories.comparison.a1') },
        { question: t('faq.categories.comparison.q2'), answer: t('faq.categories.comparison.a2') },
        { question: t('faq.categories.comparison.q3'), answer: t('faq.categories.comparison.a3') },
      ],
    },
    {
      icon: IoDocumentTextOutline,
      title: t('faq.categories.reviews.title'),
      faqs: [
        { question: t('faq.categories.reviews.q1'), answer: t('faq.categories.reviews.a1') },
        { question: t('faq.categories.reviews.q2'), answer: t('faq.categories.reviews.a2') },
        { question: t('faq.categories.reviews.q3'), answer: t('faq.categories.reviews.a3') },
        { question: t('faq.categories.reviews.q4'), answer: t('faq.categories.reviews.a4') },
      ],
    },
    {
      icon: IoSpeedometerOutline,
      title: t('faq.categories.fuel.title'),
      faqs: [
        { question: t('faq.categories.fuel.q1'), answer: t('faq.categories.fuel.a1') },
        { question: t('faq.categories.fuel.q2'), answer: t('faq.categories.fuel.a2') },
        { question: t('faq.categories.fuel.q3'), answer: t('faq.categories.fuel.a3') },
      ],
    },
    {
      icon: IoShieldCheckmarkOutline,
      title: t('faq.categories.proposals.title'),
      faqs: [
        { question: t('faq.categories.proposals.q1'), answer: t('faq.categories.proposals.a1') },
        { question: t('faq.categories.proposals.q2'), answer: t('faq.categories.proposals.a2') },
        { question: t('faq.categories.proposals.q3'), answer: t('faq.categories.proposals.a3') },
      ],
    },
    {
      icon: IoSettingsOutline,
      title: t('faq.categories.technical.title'),
      faqs: [
        { question: t('faq.categories.technical.q1'), answer: t('faq.categories.technical.a1') },
        { question: t('faq.categories.technical.q2'), answer: t('faq.categories.technical.a2') },
        { question: t('faq.categories.technical.q3'), answer: t('faq.categories.technical.a3') },
        { question: t('faq.categories.technical.q4'), answer: t('faq.categories.technical.a4') },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">

      {/* Header */}
      <section className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
              <IoHelpCircleOutline className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
                {t('faq.title')}
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400">
                {t('faq.subtitle')}
              </p>
            </div>
          </div>
          <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl">
            {t('faq.contact')}{' '}
            <a href="mailto:contact@carsplatform.com" className="text-primary-600 dark:text-primary-400 hover:underline">
              contact@carsplatform.com
            </a>
          </p>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {faqCategories.map((category, index) => (
            <FAQCategory
              key={index}
              icon={category.icon}
              title={category.title}
              faqs={category.faqs}
            />
          ))}
        </div>
      </section>

      {/* Still have questions */}
      <section className="py-12 px-4 bg-white dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
            {t('faq.stillHaveQuestions.title')}
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-8 max-w-lg mx-auto">
            {t('faq.stillHaveQuestions.description')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="mailto:contact@carsplatform.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors"
            >
              {t('faq.stillHaveQuestions.contactSupport')}
            </a>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 text-neutral-900 dark:text-white font-medium rounded-xl transition-colors"
            >
              {t('faq.stillHaveQuestions.aboutUs')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQPage;
