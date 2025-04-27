
import React from 'react';
import { Outlet } from 'react-router-dom';  // 👉 import Outlet
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-6">
        <Outlet /> {/* 👉 This will render the current page */}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
