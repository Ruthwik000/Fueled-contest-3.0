import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Import pages
import LandingScreen from './pages/LandingScreen';
import TerminalSurvey from './pages/TerminalSurvey';
import CelebrityGrid from './pages/CelebrityGrid';
import CategoryGrid from './pages/CategoryGrid';
import ProductGrid from './pages/ProductGrid';
import ProductDetail from './pages/ProductDetail';

// Import components
import Loader from './components/Loader';
import CartModal from './components/CartModal';
import WishlistModal from './components/WishlistModal';
import MLApiTest from './components/MLApiTest';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <AnimatePresence mode="wait">
          <Routes>
            {/* 6 Main Pages */}
            <Route path="/" element={<LandingScreen />} />
            <Route path="/survey" element={<TerminalSurvey />} />
            <Route path="/loading" element={<Loader />} />
            <Route path="/celebrities" element={<CelebrityGrid />} />
            <Route path="/categories" element={<CategoryGrid />} />
            <Route path="/products" element={<ProductGrid />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/test-ml" element={<MLApiTest />} />

            {/* Redirect any unknown routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>

        {/* Global Modals */}
        <CartModal />
        <WishlistModal />
      </div>
    </Router>
  );
}

export default App;