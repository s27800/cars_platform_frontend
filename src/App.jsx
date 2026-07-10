import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout';
import { Spinner } from './components/ui';


// Lazy-loaded pages for code splitting
const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const CarsSearchPage = lazy(() => import('./pages/CarsSearchPage'));
const CarDetailsPage = lazy(() => import('./pages/CarDetailsPage'));
const BrandDetailsPage = lazy(() => import('./pages/BrandDetailsPage'));
const ComparisonPage = lazy(() => import('./pages/ComparisonPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminProposalsPage = lazy(() => import('./pages/AdminProposalsPage'));
const AdminReviewsPage = lazy(() => import('./pages/AdminReviewsPage'));
const AdminFuelReportsPage = lazy(() => import('./pages/AdminFuelReportsPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const FAQPage = lazy(() => import('./pages/FAQPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));


// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <Spinner size="lg" />
  </div>
);


function App() {
  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/cars" element={<CarsSearchPage />} />
            <Route path="/cars/:id" element={<CarDetailsPage />} />
            <Route path="/brands/:id" element={<BrandDetailsPage />} />
            <Route path="/comparison" element={<ComparisonPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/password" element={<ProfilePage />} />
            <Route path="/profile/reviews" element={<ProfilePage />} />
            <Route path="/profile/reports" element={<ProfilePage />} />
            <Route path="/profile/proposals" element={<ProfilePage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/reviews" element={<AdminReviewsPage />} />
            <Route path="/admin/fuel-reports" element={<AdminFuelReportsPage />} />
            <Route path="/admin/proposals" element={<AdminProposalsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
