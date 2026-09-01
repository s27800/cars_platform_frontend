import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout } from './layout';
import { ProtectedRoute } from '../shared/components';
import { Spinner } from '../shared/components/ui';


// One chunk per route, so the first load only carries what it needs
const HomePage = lazy(() => import('../features/home/HomePage'));
const LoginPage = lazy(() => import('../features/auth/LoginPage'));
const RegisterPage = lazy(() => import('../features/auth/RegisterPage'));
const CarsSearchPage = lazy(() => import('../features/cars/CarsSearchPage'));
const CarDetailsPage = lazy(() => import('../features/cars/CarDetailsPage'));
const BrandDetailsPage = lazy(() => import('../features/brands/BrandDetailsPage'));
const BrandsListPage = lazy(() => import('../features/brands/BrandsListPage'));
const ModelDetailsPage = lazy(() => import('../features/brands/ModelDetailsPage'));
const GenerationDetailsPage = lazy(() => import('../features/brands/GenerationDetailsPage'));
const ComparisonPage = lazy(() => import('../features/comparison/ComparisonPage'));
const ProfilePage = lazy(() => import('../features/profile/ProfilePage'));
const AdminDashboardPage = lazy(() => import('../features/admin/AdminDashboardPage'));
const AdminProposalsPage = lazy(() => import('../features/admin/AdminProposalsPage'));
const AdminReviewsPage = lazy(() => import('../features/admin/AdminReviewsPage'));
const AdminFuelReportsPage = lazy(() => import('../features/admin/AdminFuelReportsPage'));
const AboutPage = lazy(() => import('../features/staticPages/AboutPage'));
const TermsPage = lazy(() => import('../features/staticPages/TermsPage'));
const FAQPage = lazy(() => import('../features/staticPages/FAQPage'));
const PrivacyPage = lazy(() => import('../features/staticPages/PrivacyPage'));
const NotFoundPage = lazy(() => import('../features/staticPages/NotFoundPage'));


// Shown while a route chunk is downloading
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <Spinner size="lg" />
  </div>
);


const App = () => (
  <Router>
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/cars" element={<CarsSearchPage />} />
          <Route path="/cars/:id" element={<CarDetailsPage />} />
          <Route path="/brands" element={<BrandsListPage />} />
          <Route path="/brands/:id" element={<BrandDetailsPage />} />
          <Route path="/models/:id" element={<ModelDetailsPage />} />
          <Route path="/generations/:id" element={<GenerationDetailsPage />} />
          <Route path="/comparison" element={<ComparisonPage />} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/profile/password" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/profile/reviews" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/profile/reports" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/profile/proposals" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminDashboardPage /></ProtectedRoute>} />
          <Route path="/admin/reviews" element={<ProtectedRoute requireAdmin><AdminReviewsPage /></ProtectedRoute>} />
          <Route path="/admin/fuel-reports" element={<ProtectedRoute requireAdmin><AdminFuelReportsPage /></ProtectedRoute>} />
          <Route path="/admin/proposals" element={<ProtectedRoute requireAdmin><AdminProposalsPage /></ProtectedRoute>} />
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

export default App;
