import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import UserManagement from './components/UserManagement';
import PasienPage from './components/PasienPage';
import RujukanPage from './components/RujukanPage';
import FaskesPage from './components/FaskesPage';
import MapPage from './components/MapPage';
import TempatTidurPage from './components/TempatTidurPage';
import LaporanPage from './components/LaporanPage';
import SearchPage from './components/SearchPage';
import TrackingPage from './components/TrackingPage';
import AmbulanceTracker from './components/AmbulanceTracker';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <div className="App">
            <Routes>
                            <Route path="/login" element={<Login />} />
              <Route
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route
                path="/user-management" 
                element={
                  <ProtectedRoute>
                    <UserManagement />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/pasien" 
                element={
                  <ProtectedRoute>
                    <PasienPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/rujukan" 
                element={
                  <ProtectedRoute>
                    <RujukanPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/peta" 
                element={
                  <ProtectedRoute>
                    <MapPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/tempat-tidur" 
                element={
                  <ProtectedRoute>
                    <TempatTidurPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/laporan" 
                element={
                  <ProtectedRoute>
                    <LaporanPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/faskes" 
                element={
                  <ProtectedRoute>
                    <FaskesPage />
                  </ProtectedRoute>
                } 
              />
                              <Route 
                  path="/search" 
                  element={
                    <ProtectedRoute>
                      <SearchPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/tracking" 
                  element={
                    <ProtectedRoute>
                      <TrackingPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/ambulance-tracker" 
                  element={
                    <ProtectedRoute>
                      <AmbulanceTracker />
                    </ProtectedRoute>
                  } 
                />
              <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
