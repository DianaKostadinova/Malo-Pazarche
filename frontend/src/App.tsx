import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Navbar } from '@components/Navbar';
import { HomePage } from '@pages/HomePage';
import { LoginPage } from '@pages/LoginPage';
import { RegisterPage } from '@pages/RegisterPage';
import { SearchPage } from '@pages/SearchPage';
import { ChatPage } from '@pages/ChatPage';
import { SellPage } from '@pages/SellPage';
import { ProfilePage } from '@pages/ProfilePage';
import { FavoritesPage } from '@pages/FavoritesPage';
import { ProductPage } from '@pages/ProductPage';
import { PublicRoute } from '@utils/routes';
import { useAuth } from '@hooks/useAuth';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const hideNavbar = ['/login', '/register'].includes(location.pathname);

  return (
    <>
      {!hideNavbar && isAuthenticated && <Navbar />}
      <Routes>
        <Route path="/login"     element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register"  element={<PublicRoute><RegisterPage /></PublicRoute>} />
        <Route path="/"          element={isAuthenticated ? <HomePage />     : <Navigate to="/login" replace />} />
        <Route path="/search"    element={isAuthenticated ? <SearchPage />   : <Navigate to="/login" replace />} />
        <Route path="/sell"      element={isAuthenticated ? <SellPage />     : <Navigate to="/login" replace />} />
        <Route path="/favorites" element={isAuthenticated ? <FavoritesPage />: <Navigate to="/login" replace />} />
        <Route path="/profile"   element={isAuthenticated ? <ProfilePage />  : <Navigate to="/login" replace />} />
        <Route path="/chat"      element={isAuthenticated ? <ChatPage />     : <Navigate to="/login" replace />} />
        <Route path="/product/:id" element={isAuthenticated ? <ProductPage /> : <Navigate to="/login" replace />} />
        <Route path="*"          element={<Navigate to={isAuthenticated ? '/' : '/login'} replace />} />
      </Routes>
    </>
  );
};

const App: React.FC = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;