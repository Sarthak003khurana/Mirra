import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const NavLink = ({ to, children, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`relative font-body text-sm font-medium tracking-wide transition-all duration-300 py-1
        ${isActive ? 'text-neon-cyan' : 'text-white/60 hover:text-white'}`}
    >
      {children}
      {isActive && (
        <motion.div
          layoutId="nav-underline"
          className="absolute -bottom-1 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, #00f5ff, transparent)' }}
        />
      )}
    </Link>
  );
};

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-void/80 backdrop-blur-xl border-b border-glass-border' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-neon-blue to-neon-purple opacity-80" />
            <div className="absolute inset-0 rounded-lg flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="9" r="3" fill="#00f5ff" />
                <path d="M9 1v3M9 14v3M1 9h3M14 9h3" stroke="#00f5ff" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="9" cy="9" r="7" stroke="#00f5ff" strokeWidth="0.5" strokeDasharray="2 3"/>
              </svg>
            </div>
          </div>
          <span className="font-display font-bold text-lg tracking-wider gradient-text">
            NEXUS<span className="text-white/40 font-light">AI</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/upload">Resume</NavLink>
          <NavLink to="/interview">Interview</NavLink>
          <NavLink to="/report">Report</NavLink>
          <NavLink to="/settings">Settings</NavLink>
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/upload" className="btn-primary text-xs py-2.5 px-5">
            Start Free
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden w-8 h-8 flex flex-col justify-center items-center gap-1.5"
        >
          <motion.span animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
            className="block w-5 h-px bg-neon-cyan transition-all" />
          <motion.span animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
            className="block w-5 h-px bg-white/60" />
          <motion.span animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
            className="block w-5 h-px bg-neon-cyan transition-all" />
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-panel/95 backdrop-blur-xl border-b border-glass-border px-6 py-4 flex flex-col gap-4"
          >
            {[['/', 'Home'], ['/upload', 'Resume Upload'], ['/interview', 'Live Interview'], ['/report', 'Report'], ['/settings', 'Settings']].map(([path, label]) => (
              <NavLink key={path} to={path} onClick={() => setMenuOpen(false)}>{label}</NavLink>
            ))}
            <Link to="/upload" className="btn-primary text-center text-xs py-2.5" onClick={() => setMenuOpen(false)}>
              Start Free Interview
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
