import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from './Header';
import Footer from './Footer';


/**
 * Main layout component
 *
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Optional children content
 */
const MainLayout = ({ children }) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-900">
      <Header />

      <main className="flex-grow" aria-label={t('a11y.mainContent')}>
        {children || <Outlet />}
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;
