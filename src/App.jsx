import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout';
import { 
  HomePage, 
  LoginPage, 
  RegisterPage, 
  CarsSearchPage, 
  CarDetailsPage, 
  ComparisonPage, 
  ProfilePage,
  AdminDashboard,
  AdminProposalsPage,
  AdminReviewsPage,
  AdminFuelReportsPage,
  AboutPage,
  TermsPage,
  FAQPage,
} from './pages';


function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/cars" element={<CarsSearchPage />} />
          <Route path="/cars/:id" element={<CarDetailsPage />} />
          <Route path="/comparison" element={<ComparisonPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/reviews" element={<Navigate to="/profile" replace />} />
          <Route path="/profile/reports" element={<Navigate to="/profile" replace />} />
          <Route path="/profile/proposals" element={<Navigate to="/profile" replace />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/reviews" element={<AdminReviewsPage />} />
          <Route path="/admin/fuel-reports" element={<AdminFuelReportsPage />} />
          <Route path="/admin/proposals" element={<AdminProposalsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/faq" element={<FAQPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
