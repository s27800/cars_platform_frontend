import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';


/**
 * Main layout component
 * 
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Optional children content
 */
const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-900">
      <Header />

      <main 
        className="flex-grow"
        role="main"
        aria-label="Main content"
      >
        {children || <Outlet />}
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;
