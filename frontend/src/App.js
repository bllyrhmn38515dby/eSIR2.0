import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { LastPageProvider } from './context/LastPageContext';
import ErrorBoundary from './components/ErrorBoundary';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import Dashboard from './components/Dashboard';
import UserManagement from './components/UserManagement';
import PasienPage from './components/PasienPage';
import RujukanPage from './components/RujukanPage';
import EnhancedRujukanPage from './components/EnhancedRujukanPage';
import FaskesPage from './components/FaskesPage';
import MapPage from './components/MapPage';
import TempatTidurPage from './components/TempatTidurPage';
import LaporanPage from './components/LaporanPage';
import SearchPage from './components/SearchPage';
import TrackingPage from './components/TrackingPage';
import TrackingDashboard from './components/TrackingDashboard';
import AmbulanceTracker from './components/AmbulanceTracker';
import DriverDashboard from './pages/DriverDashboard';
import DesignPreview from './pages/DesignPreview';
import PatientPreview from './pages/PatientPreview';
import ReferralPreview from './pages/ReferralPreview';
import AmbulanceTrackerPreview from './pages/AmbulanceTrackerPreview';
import FaskesPreview from './pages/FaskesPreview';
import DashboardPreview from './pages/DashboardPreview';
import TrackingPreview from './pages/TrackingPreview';
import ReportsPreview from './pages/ReportsPreview';
import LiveMapPreview from './pages/LiveMapPreview';
import NotFoundPage from './components/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute';
import ToastContainer from './components/ToastContainer';
import DesignSystemDemo from './components/examples/DesignSystemDemo';
import 'leaflet/dist/leaflet.css';
// import PWAInstall from './components/PWAInstall'; // DISABLED
import './App.css';
import './styles/design-system.css';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <SocketProvider>
          <Router>
            <LastPageProvider>
              <div className="App">
                  <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
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
                      path="/rujukan-enhanced" 
                      element={
                        <ProtectedRoute>
                          <EnhancedRujukanPage />
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
                      path="/tracking-dashboard" 
                      element={
                        <ProtectedRoute>
                          <TrackingDashboard />
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
                    <Route 
                      path="/driver" 
                      element={
                        <ProtectedRoute>
                          <DriverDashboard />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/design-preview" 
                      element={
                        <ProtectedRoute>
                          <DesignPreview />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/patient-preview" 
                      element={
                        <ProtectedRoute>
                          <PatientPreview />
                        </ProtectedRoute>
                      } 
                    />
        <Route
          path="/referral-preview"
          element={
            <ProtectedRoute>
              <ReferralPreview />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ambulance-tracker-preview"
          element={
            <ProtectedRoute>
              <AmbulanceTrackerPreview />
            </ProtectedRoute>
          }
        />
        <Route
          path="/faskes-preview"
          element={
            <ProtectedRoute>
              <FaskesPreview />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard-preview"
          element={
            <ProtectedRoute>
              <DashboardPreview />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tracking-preview"
          element={
            <ProtectedRoute>
              <TrackingPreview />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports-preview"
          element={
            <ProtectedRoute>
              <ReportsPreview />
            </ProtectedRoute>
          }
        />
        <Route
          path="/live-map-preview"
          element={
            <ProtectedRoute>
              <LiveMapPreview />
            </ProtectedRoute>
          }
        />
        <Route
          path="/design-system-demo"
          element={
            <ProtectedRoute>
              <DesignSystemDemo />
            </ProtectedRoute>
          }
        />
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                  
                  {/* Toast Container for notifications */}
                  <ToastContainer position="top-right" maxToasts={5} />
                  
                  {/* PWA Install Component - DISABLED */}
                  {/* <PWAInstall /> */}
                </div>
              </LastPageProvider>
            </Router>
          </SocketProvider>
        </AuthProvider>
      </ErrorBoundary>
    );
  }

export default App;
