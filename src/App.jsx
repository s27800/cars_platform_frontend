import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout';
import { HomePage, LoginPage, RegisterPage, CarsSearchPage } from './pages';


function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/cars" element={<CarsSearchPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
