import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { UserProvider } from './context/UserContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import KnowledgeArchive from './pages/archive/KnowledgeArchive';

// Farmer Pages
import FarmerDashboard from './pages/farmer/FarmerDashboard';
import AddSeasonRecord from './pages/farmer/AddSeasonRecord';
import YieldSummary from './pages/farmer/YieldSummary';
import ShareExperience from './pages/farmer/ShareExperience';
import RecordHarvest from './components/farmer/RecordHarvest';



// Labor Pages
import LaborDashboard from './pages/labor/LaborDashboard';
import WorkHistory from './pages/labor/WorkHistory';

// Admin Pages
import AdminModeration from './pages/admin/AdminModeration';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <BrowserRouter>
          <div className="App flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/archive" element={<KnowledgeArchive />} />

                {/* Farmer Routes */}
                <Route
                  path="/farmer/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['farmer']}>
                      <FarmerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/farmer/add-season"
                  element={
                    <ProtectedRoute allowedRoles={['farmer']}>
                      <AddSeasonRecord />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/farmer/yield-summary"
                  element={
                    <ProtectedRoute allowedRoles={['farmer']}>
                      <YieldSummary />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/farmer/share-experience"
                  element={
                    <ProtectedRoute allowedRoles={['farmer']}>
                      <ShareExperience />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/farmer/record-harvest/:seasonId"
                  element={
                    <ProtectedRoute allowedRoles={['farmer']}>
                      <RecordHarvest />
                    </ProtectedRoute>
                  }
                />

                                {/* Edit Season Route */}
                <Route
                  path="/farmer/edit-season/:seasonId"
                  element={
                    <ProtectedRoute allowedRoles={['farmer']}>
                      <AddSeasonRecord />
                    </ProtectedRoute>
                  }
                />

                {/* Labor Routes */}
                <Route
                  path="/labor/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['labor']}>
                      <LaborDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/labor/work-history"
                  element={
                    <ProtectedRoute allowedRoles={['labor']}>
                      <WorkHistory />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Routes */}
                <Route
                  path="/admin/moderation"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminModeration />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
