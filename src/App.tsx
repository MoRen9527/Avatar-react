import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoginPage from './pages/LoginPage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import ChatHistoryPage from './pages/ChatHistoryPage-TABLET-0BGCRCP5';
import HomePage from './pages/HomePage';
import ChatOnlyPage from './pages/ChatOnlyPage';
import DashboardOnlyPage from './pages/DashboardOnlyPage';
import InfoCardPage from './pages/InfoCardPage';
import GameFiPage from './pages/GameFiPage';
import SciFiDemo from './components/ui/SciFiDemo';
import I18nDashboard from './pages/I18nDashboard';
import { RootState } from './store';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from './store';
import { checkAuth } from './store/authSlice';


const App = () => {
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const hasToken = !!localStorage.getItem('token');

  const authGate = (element: React.ReactElement) => {
    // When a token exists but we are still hydrating auth state, don't bounce to /login.
    if (hasToken && loading) {
      return (
        <div style={{ fontFamily: 'system-ui, Segoe UI, Arial', maxWidth: 720, margin: '12vh auto', padding: 16 }}>
          <h2>Signing in…</h2>
          <p>正在加载用户信息…</p>
        </div>
      );
    }
    return isAuthenticated ? element : <Navigate to="/login" replace />;
  };

  useEffect(() => {
    // Hydrate auth state from stored token
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} 
        />
        <Route 
          path="/chathistory" 
          element={authGate(<ChatHistoryPage />)} 
        />
        <Route 
          path="/chat-only" 
          element={<ChatOnlyPage /> } 
        />
        {/* 暂时用独立页面，后期需要判断是否登录 */}
        <Route 
          path="/dashboard-only" 
          element={<DashboardOnlyPage />} 
        />


        <Route 
          path="/info-card/:cardType" 
          element={<InfoCardPage />} 
        />
        <Route 
          path="/gamefi" 
          element={<GameFiPage />} 
        />
        <Route 
          path="/sci-fi-demo" 
          element={<SciFiDemo />} 
        />
        <Route 
          path="/__i18n" 
          element={<I18nDashboard />} 
        />
        <Route 
          path="/" 
          element={authGate(<HomePage />)} 
        />
      </Routes>
    </Router>
  );
};

export default App;