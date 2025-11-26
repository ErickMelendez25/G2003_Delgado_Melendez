import { useEffect } from "react";   // ⬅️ FALTABA ESTO

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthProvider from './context/AuthContext';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

import History from "./pages/History";
import HistoryDetail from "./pages/HistoryDetail";

import AdminDashboard from "./pages/AdminDashboard";
import AdminAnalysisDetail from "./pages/AdminAnalysisDetail";
import AdminRoute from "./components/AdminRoute";

import Navbar from "./components/Navbar";


export default function App() {


  return (
    <AuthProvider>
      <BrowserRouter>

        <Navbar />

        <Routes>

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/history" 
            element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/history/:id" 
            element={
              <ProtectedRoute>
                <HistoryDetail />
              </ProtectedRoute>
            } 
          />

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/history/:id"
            element={
              <AdminRoute>
                <AdminAnalysisDetail />
              </AdminRoute>
            }
          />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
