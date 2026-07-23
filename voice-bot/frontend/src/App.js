import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import MainLayout from './layouts/MainLayout';
import LandingPage from './pages/LandingPage';
import UploadPage from './pages/UploadPage';
import InterviewPage from './pages/InterviewPage';
import ReportPage from './pages/ReportPage';
import SettingsPage from './pages/SettingsPage';

const App = () => (
  <BrowserRouter>
    <AnimatePresence mode="wait">
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
        {/* Interview page uses full-screen layout, no footer */}
        <Route element={<MainLayout showFooter={false} />}>
          <Route path="/interview" element={<InterviewPage />} />
        </Route>
      </Routes>
    </AnimatePresence>
  </BrowserRouter>
);

export default App;
