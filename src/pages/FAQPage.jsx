import { useState } from 'react';
import { Link } from 'react-router-dom';
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
import { Card } from '../components/ui';


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


const FAQPage = () => {
  const faqCategories = [
    {
      icon: IoPersonOutline,
      title: 'Account & Registration',
      faqs: [
        {
          question: 'How do I create an account?',
          answer: 'Click on "Sign Up" in the top navigation bar. Fill in your username, email, password, and personal details. After registration, you can immediately start using all platform features.',
        },
        {
          question: 'Is registration free?',
          answer: 'Yes, all features, including registration, are available at no cost.',
        },
        {
          question: 'How do I change my password?',
          answer: 'Go to your Profile page, click on the "Password" tab, and use the password change form. You\'ll need to enter your current password and the new password twice for confirmation.',
        },
        {
          question: 'Can I delete my account?',
          answer: 'Currently, account deletion is not available.',
        },
      ],
    },
    {
      icon: IoCarSportOutline,
      title: 'Searching & Browsing Cars',
      faqs: [
        {
          question: 'How do I search for a specific car?',
          answer: 'Use the search bar in the navigation, or go to the Cars page and use the advanced filters.',
        },
        {
          question: 'What filters are available?',
          answer: 'Our advanced search includes: brand, model, generation, body type, tags, engine type and more.',
        },
        {
          question: 'How accurate is the car data?',
          answer: 'We try our best to provide accurate and up-to-date information. However, users can submit data correction proposals if they find inaccuracies. All proposals are reviewed by our admin team before being applied.',
        },
        {
          question: 'Why can\'t I find a specific car model?',
          answer: 'Our database is continuously expanding. If a car model is missing, it may be added in future updates.',
        },
      ],
    },
    {
      icon: IoSearchOutline,
      title: 'Car Comparison',
      faqs: [
        {
          question: 'How do I compare cars?',
          answer: 'Find a car you want to compare, then click the "Add to Compare" button in the car detail page. Next, go to the Comparison page from the navigation menu. You can compare up to 4 cars side by side.',
        },
        {
          question: 'What data is shown in comparisons?',
          answer: 'Comparisons show all available car data.',
        },
        {
          question: 'Are my comparison selections saved?',
          answer: 'Yes, your comparison list is saved in your browser. It will persist even if you close the browser, but won\'t sync across different devices.',
        },
      ],
    },
    {
      icon: IoDocumentTextOutline,
      title: 'Reviews',
      faqs: [
        {
          question: 'How do I write a review?',
          answer: 'Navigate to any car\'s detail page and scroll to the Reviews section. Click "+ Add Review" (only logged in users). Fill in ratings for all categories and add your comment.',
        },
        {
          question: 'What categories are rated in reviews?',
          answer: 'Reviews rate 11 categories (from 1 to 5): Engine, Transmission, Steering, Suspension, Visibility, Ergonomics, Sound Proofing, Interior Space, Maintenance, Price/Quality Ratio, and Reliability.',
        },
        {
          question: 'Why isn\'t my review visible yet?',
          answer: 'All reviews go through a moderation process before being published to ensure quality and accuracy.',
        },
        {
          question: 'Can I edit or delete my review?',
          answer: 'Currently, you cannot edit reviews after submission. You can view all your submitted reviews in your Profile.',
        },
      ],
    },
    {
      icon: IoSpeedometerOutline,
      title: 'Fuel Reports',
      faqs: [
        {
          question: 'What is a fuel report?',
          answer: 'Fuel reports are user-submitted real-world fuel consumption data. They help other users understand actual fuel efficiency beyond manufacturer claims.',
        },
        {
          question: 'How do I submit a fuel report?',
          answer: 'Go to a car\'s detail page, scroll to the Fuel Reports section, and click "+ Add Report". Enter your measured fuel consumption (L/100km) and optionally add a comment about driving conditions.',
        },
        {
          question: 'How is the average consumption calculated?',
          answer: 'The average shown is calculated from all approved fuel reports for that car.',
        },
      ],
    },
    {
      icon: IoShieldCheckmarkOutline,
      title: 'Data Proposals & Moderation',
      faqs: [
        {
          question: 'How can I suggest a data correction?',
          answer: 'On any car\'s detail page, click "Suggest Correction". Select the category (Engine, Transmission, etc.), describe what needs to be changed, and provide the correct values.',
        },
        {
          question: 'How long does moderation take?',
          answer: 'Moderation time varies depending on the complexity of the proposal and the number of other proposals submitted. You can check the status of your proposals in Profile -> My Activity -> Proposals.',
        },
        {
          question: 'What happens if my proposal is rejected?',
          answer: 'If rejected, you\'ll see the status change in your Profile. The admin may provide a comment explaining why. You can submit a new proposal with corrections if needed.',
        },
      ],
    },
    {
      icon: IoSettingsOutline,
      title: 'Technical & Other',
      faqs: [
        {
          question: 'Does the platform have a dark mode?',
          answer: 'Yes, click the sun/moon icon in the navigation bar to toggle between light and dark mode. Your preference is saved automatically in your browser.',
        },
        {
          question: 'Is there a mobile app?',
          answer: 'No, but our website is fully adapted for mobile devices.',
        },
        {
          question: 'How do I report a bug or suggest a feature?',
          answer: 'Currently, reporting a bug or suggesting a feature is not available. Please contact us at contact@carsplatform.com with details about the bug or your feature suggestion. We appreciate all feedback.',
        },
        {
          question: 'Who can I contact for support?',
          answer: 'For any questions or issues, email us at contact@carsplatform.com.',
        },
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
                Frequently Asked Questions
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400">
                Find answers to common questions
              </p>
            </div>
          </div>
          <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl">
            Can't find what you're looking for? Contact us at{' '}
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
            Still have questions?
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-8 max-w-lg mx-auto">
            If you couldn't find the answer you were looking for, feel free to reach out to our support team.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="mailto:contact@carsplatform.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors"
            >
              Contact Support
            </a>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 text-neutral-900 dark:text-white font-medium rounded-xl transition-colors"
            >
              About Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQPage;
