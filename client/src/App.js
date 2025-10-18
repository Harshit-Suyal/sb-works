import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Home from './pages/Home';
import AdminDashboard from './pages/admin/AdminDashboard';
import ClientDashboard from './pages/client/ClientDashboard';
import NewProject from './pages/client/NewProject';
import ProjectApplications from './pages/client/ProjectApplications';
import FreelancerDashboard from './pages/freelancer/FreelancerDashboard';
import AllProjects from './pages/freelancer/AllProjects';
import MyApplications from './pages/freelancer/MyApplications';
import MyProjects from './pages/freelancer/MyProjects';
import ProjectDetails from './pages/ProjectDetails';
import Chat from './pages/Chat';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <div className="container mt-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              
              {/* Client Routes */}
              <Route path="/client/dashboard" element={<ClientDashboard />} />
              <Route path="/client/new-project" element={<NewProject />} />
              <Route path="/client/project/:projectId/applications" element={<ProjectApplications />} />
              
              {/* Freelancer Routes */}
              <Route path="/freelancer/dashboard" element={<FreelancerDashboard />} />
              <Route path="/freelancer/projects" element={<AllProjects />} />
              <Route path="/freelancer/applications" element={<MyApplications />} />
              <Route path="/freelancer/my-projects" element={<MyProjects />} />
              
              {/* Common Routes */}
              <Route path="/project/:projectId" element={<ProjectDetails />} />
              <Route path="/chat/:chatId" element={<Chat />} />
              
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;