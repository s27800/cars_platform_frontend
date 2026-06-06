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
          <Route path="/admin/reviews" element={<AdminDashboard />} />
          <Route path="/admin/fuel-reports" element={<AdminDashboard />} />
          <Route path="/admin/proposals" element={<AdminProposalsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
