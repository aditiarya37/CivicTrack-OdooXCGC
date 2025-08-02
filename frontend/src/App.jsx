import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/providers/AuthProvider';
import { useAuth } from './services/auth';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Loading from './components/common/Loading';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './pages/Dashboard';
import ReportIssue from './pages/ReportIssue';
import Categories from './pages/Categories';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <Loading />;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/report" element={
                <ProtectedRoute>
                  <ReportIssue />
                </ProtectedRoute>
              } />
              <Route path="/categories" element={<Categories />} />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute adminOnly={true}>
                  <AdminPanel />
                </ProtectedRoute>
              } />
              <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;