import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Footer = () => (
  <footer className="border-t border-glass-border bg-panel/50 backdrop-blur-sm">
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        {/* Brand */}
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="9" r="3" fill="#00f5ff" />
                <path d="M9 1v3M9 14v3M1 9h3M14 9h3" stroke="#00f5ff" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="font-display font-bold text-lg gradient-text">NEXUSAI</span>
          </div>
          <p className="text-white/40 text-sm font-body leading-relaxed max-w-sm">
            The next generation AI interview platform. Practice smarter, perform better, and unlock your career potential with real-time intelligence.
          </p>
          <div className="flex gap-3 mt-6">
            {['twitter', 'linkedin', 'github'].map((social) => (
              <div key={social}
                className="w-9 h-9 rounded-lg glass-card flex items-center justify-center cursor-pointer hover:border-neon-cyan/40 transition-all duration-300 hover:shadow-neon-cyan">
                <span className="text-white/40 text-xs font-mono">{social[0].toUpperCase()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Links */}
        <div>
          <h4 className="font-display text-xs font-semibold tracking-widest text-neon-cyan mb-4 uppercase">Platform</h4>
          <div className="flex flex-col gap-2.5">
            {[['/', 'Home'], ['/upload', 'Upload Resume'], ['/interview', 'Live Interview'], ['/report', 'View Report']].map(([path, label]) => (
              <Link key={path} to={path} className="text-white/40 text-sm font-body hover:text-neon-cyan transition-colors duration-200">{label}</Link>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display text-xs font-semibold tracking-widest text-neon-cyan mb-4 uppercase">Company</h4>
          <div className="flex flex-col gap-2.5">
            {['About', 'Careers', 'Privacy', 'Terms', 'Contact'].map((item) => (
              <span key={item} className="text-white/40 text-sm font-body hover:text-white transition-colors duration-200 cursor-pointer">{item}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-glass-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-white/25 text-xs font-mono">© 2025 NexusAI Inc. All rights reserved.</p>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
          <span className="text-white/30 text-xs font-mono">All systems operational</span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
