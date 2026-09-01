import { Link } from 'react-router-dom';
import {
  IoDocumentTextOutline,
  IoShieldCheckmarkOutline,
  IoPersonOutline,
  IoCreateOutline,
  IoWarningOutline,
  IoMailOutline,
} from 'react-icons/io5';
import { Card } from '../../shared/components/ui';


// Static page with the terms of service
const TermsPage = () => {
  const sections = [
    {
      id: 'acceptance',
      icon: IoDocumentTextOutline,
      title: '1. Acceptance of Terms',
      content: [
        'By accessing and using CarsPlatform, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use this Platform.',
        '',
        'These Terms of Service apply to all users of the Platform, including non-registered users.',
      ].join('\n'),
    },
    {
      id: 'accounts',
      icon: IoPersonOutline,
      title: '2. User Accounts',
      content: [
        'To access certain features of the Platform, you must register for an account. When you register:',
        '',
        '• You must provide accurate and complete information',
        '• You are responsible for maintaining the security of your account credentials',
        '• You are responsible for all activities that occur under your account',
        '• You must notify us immediately of any unauthorized use of your account',
        '• You must be at least 16 years old to create an account',
        '',
        'We reserve the right to suspend or terminate accounts that violate these terms.',
      ].join('\n'),
    },
    {
      id: 'content',
      icon: IoCreateOutline,
      title: '3. User Content',
      content: [
        'Users may submit content including reviews, fuel consumption reports, and data correction proposals. By submitting content, you:',
        '',
        '• Grant us a non-exclusive, worldwide, royalty-free license to use, display, and distribute your content',
        '• Represent that you have the right to submit such content',
        '• Agree that your content does not violate any third-party rights',
        '• Understand that all submitted content is subject to moderation',
        '',
        'We reserve the right to remove any content that violates these terms or is deemed inappropriate.',
      ].join('\n'),
    },
    {
      id: 'conduct',
      icon: IoShieldCheckmarkOutline,
      title: '4. Acceptable Use',
      content: [
        'You agree not to use the Platform to:',
        '',
        '• Submit false, misleading, or fraudulent information',
        '• Harass, abuse, or harm other users',
        '• Attempt to gain unauthorized access to the Platform or other user accounts',
        '• Upload malicious code or interfere with the Platform\'s operation',
        '• Scrape or collect user data without permission',
        '• Use automated systems to access the Platform without our consent',
        '• Violate any applicable laws or regulations',
        '',
        'Violation of these rules may result in immediate account termination.',
      ].join('\n'),
    },
    {
      id: 'moderation',
      icon: IoShieldCheckmarkOutline,
      title: '5. Content Moderation',
      content: [
        'All user-submitted content (reviews, fuel reports, data proposals) is subject to moderation by our admin team:',
        '',
        '• Content is reviewed before being published',
        '• We may approve, reject, or request modifications to submitted content',
        '• Rejected content will be removed from the Platform',
        '• Users will be notified of moderation decisions',
        '• Repeated violations may result in account restrictions',
        '',
        'Our moderation decisions are final, though users may contact support for clarification.',
      ].join('\n'),
    },
    {
      id: 'data',
      icon: IoDocumentTextOutline,
      title: '6. Data Accuracy',
      content: [
        'While we strive to maintain accurate car specifications and data:',
        '',
        '• We do not guarantee the accuracy of all information on the Platform',
        '• Car specifications are sourced from manufacturers and may contain errors',
        '• User-submitted reviews and fuel reports reflect individual experiences',
        '• Users should verify important information with official sources',
        '• We welcome data correction proposals from users to improve accuracy',
      ].join('\n'),
    },
    {
      id: 'liability',
      icon: IoWarningOutline,
      title: '7. Limitation of Liability',
      content: [
        'To the fullest extent permitted by law:',
        '',
        '• The Platform is provided "as is" without warranties of any kind',
        '• We are not liable for any damages arising from your use of the Platform',
        '• We are not responsible for decisions made based on Platform information',
        '• We do not endorse any specific car models or manufacturers',
        '• We are not liable for user-generated content',
      ].join('\n'),
    },
    {
      id: 'changes',
      icon: IoDocumentTextOutline,
      title: '8. Changes to Terms',
      content: [
        'We reserve the right to modify these Terms of Service at any time:',
        '',
        '• Changes will be posted on this page with an updated effective date',
        '• Continued use of the Platform after changes constitutes acceptance',
        '• We may notify registered users of significant changes via email',
        '• It is your responsibility to review these terms periodically',
      ].join('\n'),
    },
    {
      id: 'contact',
      icon: IoMailOutline,
      title: '9. Contact Information',
      content: [
        'If you have questions about these Terms of Service, please contact us:',
        '',
        'Email: contact@carsplatform.com',
        '',
        'We will respond to inquiries within 48 business hours.',
      ].join('\n'),
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">

      {/* Header */}
      <section className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
              <IoDocumentTextOutline className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
                Terms of Service
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400">
                Last updated: June 2026
              </p>
            </div>
          </div>
          <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl">
            Please read these terms carefully before using CarsPlatform.
            By using our platform, you agree to be bound by these terms.
          </p>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="py-8 px-4 bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-4">
            Table of Contents
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {sections.map(({ id, title }) => (
              <a
                key={id}
                href={`#${id}`}
                className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
              >
                {title}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {sections.map(({ id, icon: Icon, title, content }) => (
            <Card key={id} id={id} variant="bordered" padding="lg" className="scroll-mt-24">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-neutral-100 dark:bg-neutral-700 rounded-lg flex-shrink-0">
                  <Icon className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">
                    {title}
                  </h2>
                  <div className="text-neutral-600 dark:text-neutral-400 whitespace-pre-line leading-relaxed">
                    {content}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-12 px-4 bg-white dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            By using CarsPlatform, you acknowledge that you have read and understood these Terms of Service.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors"
            >
              Return to Home
            </Link>
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

export default TermsPage;
