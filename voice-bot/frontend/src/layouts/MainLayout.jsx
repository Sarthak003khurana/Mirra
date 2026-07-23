import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MainLayout = ({ showFooter = true }) => (
  <div className="min-h-screen bg-void flex flex-col">
    <Navbar />
    <main className="flex-1">
      <Outlet />
    </main>
    {showFooter && <Footer />}
  </div>
);

export default MainLayout;
