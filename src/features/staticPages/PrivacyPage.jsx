import { Link } from 'react-router-dom';
import {
  IoShieldCheckmarkOutline,
  IoPersonOutline,
  IoServerOutline,
  IoLockClosedOutline,
  IoGlobeOutline,
  IoMailOutline,
  IoTrashOutline,
  IoTimeOutline,
} from 'react-icons/io5';
import { Card } from '../../shared/components/ui';


// Static page with the privacy policy
const PrivacyPage = () => {
  const sections = [
    {
      id: 'introduction',
      icon: IoShieldCheckmarkOutline,
      title: '1. Introduction',
      content: [
        'CarsPlatform is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.',
        '',
        'By using CarsPlatform, you consent to the data practices described in this policy. If you do not agree with this policy, please do not use our services.',
      ].join('\n'),
    },
    {
      id: 'data-collection',
      icon: IoServerOutline,
      title: '2. Information We Collect',
      content: [
        'We collect information you provide directly to us:',
        '',
        '• Account information: email address, username, and password',
        '• Profile information: display name and preferences',
        '• User-generated content: reviews, fuel consumption reports, and data correction proposals',
        '• Communication data: messages you send to us',
        '',
        'We automatically collect certain information:',
        '',
        '• Device information: browser type, operating system',
        '• Usage data: pages visited, features used, time spent on the platform',
        '• Log data: IP address, access times, referring URLs',
      ].join('\n'),
    },
    {
      id: 'data-usage',
      icon: IoPersonOutline,
      title: '3. How We Use Your Information',
      content: [
        'We use the collected information to:',
        '',
        '• Provide, maintain, and improve our services',
        '• Process and manage your account',
        '• Display your reviews and fuel reports to other users',
        '• Moderate user-generated content',
        '• Respond to your comments, questions, and requests',
        '• Send you technical notices and security alerts',
        '• Analyze usage patterns to improve user experience',
        '• Detect, prevent, and address technical issues',
      ].join('\n'),
    },
    {
      id: 'data-sharing',
      icon: IoGlobeOutline,
      title: '4. Information Sharing',
      content: [
        'We may share your information in the following situations:',
        '',
        '• Public content: Your reviews, ratings, and fuel reports are visible to all users',
        '• Service providers: We may share data with third-party vendors who assist in operating our platform',
        '• Legal requirements: We may disclose information if required by law or to protect our rights',
        '• Business transfers: In the event of a merger or acquisition, your data may be transferred',
        '',
        'We do not sell your personal information to third parties.',
      ].join('\n'),
    },
    {
      id: 'cookies',
      icon: IoServerOutline,
      title: '5. Cookies and Tracking',
      content: [
        'We use cookies and similar technologies to:',
        '',
        '• Keep you logged in to your account',
        '• Remember your preferences',
        '• Understand how you use our platform',
        '• Improve our services based on usage patterns',
        '',
        'You can control cookies through your browser settings. Disabling cookies may affect some platform functionality.',
      ].join('\n'),
    },
    {
      id: 'security',
      icon: IoLockClosedOutline,
      title: '6. Data Security',
      content: [
        'We implement appropriate security measures to protect your information:',
        '',
        '• Encrypted data transmission (HTTPS)',
        '• Secure password storage using industry-standard hashing',
        '• Regular security assessments',
        '• Access controls for our team members',
        '',
        'However, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security of your data.',
      ].join('\n'),
    },
    {
      id: 'retention',
      icon: IoTimeOutline,
      title: '7. Data Retention',
      content: [
        'We retain your information for as long as:',
        '',
        '• Your account is active',
        '• Needed to provide you services',
        '• Required by law or for legitimate business purposes',
        '',
        'When you delete your account, we will delete or anonymize your personal data within 30 days, except where retention is required by law.',
      ].join('\n'),
    },
    {
      id: 'rights',
      icon: IoTrashOutline,
      title: '8. Your Rights',
      content: [
        'You have the right to:',
        '',
        '• Access: Request a copy of your personal data',
        '• Correction: Update or correct inaccurate information',
        '• Deletion: Request deletion of your account and personal data',
        '• Portability: Receive your data in a structured, machine-readable format',
        '• Objection: Object to certain processing of your data',
        '• Withdraw consent: Withdraw previously given consent at any time',
        '',
        'To exercise these rights, please contact us using the information below.',
      ].join('\n'),
    },
    {
      id: 'changes',
      icon: IoShieldCheckmarkOutline,
      title: '9. Changes to This Policy',
      content: [
        'We may update this Privacy Policy from time to time:',
        '',
        '• Changes will be posted on this page with an updated effective date',
        '• We will notify registered users of significant changes via email',
        '• Continued use of the platform after changes constitutes acceptance',
        '',
        'We encourage you to review this policy periodically.',
      ].join('\n'),
    },
    {
      id: 'contact',
      icon: IoMailOutline,
      title: '10. Contact Us',
      content: [
        'If you have questions about this Privacy Policy or our data practices, please contact us:',
        '',
        'Email: privacy@carsplatform.com',
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
              <IoShieldCheckmarkOutline className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
                Privacy Policy
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400">
                Last updated: June 2026
              </p>
            </div>
          </div>
          <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl">
            Your privacy is important to us. This policy describes how we collect,
            use, and protect your personal information.
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
            By using CarsPlatform, you acknowledge that you have read and understood this Privacy Policy.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors"
            >
              Return to Home
            </Link>
            <Link
              to="/terms"
              className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 text-neutral-900 dark:text-white font-medium rounded-xl transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPage;
