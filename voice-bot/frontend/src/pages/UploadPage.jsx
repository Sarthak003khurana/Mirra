import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import GlowCard from '../components/GlowCard';
import { uploadResume } from '../services/api';

const UploadPage = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('idle'); // idle | uploading | done | error
  const [error, setError] = useState('');

  const onDrop = useCallback((accepted) => {
    if (accepted.length > 0) {
      setFile(accepted[0]);
      setStatus('idle');
      setError('');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'application/msword': ['.doc'], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  });

  const handleUpload = async () => {
    if (!file) return;
    setStatus('uploading');
    setProgress(0);
    setError('');
    try {
      await uploadResume(file, setProgress);
      setStatus('done');
      setTimeout(() => navigate('/interview'), 1500);
    } catch (err) {
      setStatus('error');
      setError('Upload failed. Please check your connection and try again.');
    }
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="min-h-screen bg-void pt-24 pb-16 relative">
      {/* Background */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(0,102,255,0.15) 0%, transparent 70%)' }} />

      <div className="max-w-3xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
            style={{ background: 'rgba(0,245,255,0.08)', border: '1px solid rgba(0,245,255,0.2)' }}>
            <span className="text-neon-cyan font-mono text-xs tracking-widest">STEP 1 OF 3</span>
          </div>
          <h1 className="font-display font-black text-4xl md:text-5xl text-white mb-3">
            Upload Your <span className="gradient-text">Resume</span>
          </h1>
          <p className="text-white/40 font-body">Our AI will analyze your profile and craft personalized interview questions.</p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-2 mb-10"
        >
          {['Upload Resume', 'AI Interview', 'Get Report'].map((step, i) => (
            <React.Fragment key={i}>
              <div className={`flex items-center gap-2 ${i === 0 ? '' : 'opacity-40'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-display font-bold
                  ${i === 0 ? 'bg-gradient-to-br from-neon-blue to-neon-cyan text-void' : 'border border-white/20 text-white/40'}`}>
                  {i + 1}
                </div>
                <span className={`text-xs font-body hidden sm:block ${i === 0 ? 'text-white' : 'text-white/30'}`}>{step}</span>
              </div>
              {i < 2 && <div className="w-8 h-px bg-white/10" />}
            </React.Fragment>
          ))}
        </motion.div>

        {/* Drop Zone */}
        <GlowCard className="p-2 mb-6" glowColor={isDragActive ? 'cyan' : 'blue'} delay={0.1}>
          <div
            {...getRootProps()}
            className={`relative rounded-xl p-12 text-center cursor-pointer transition-all duration-300
              ${isDragActive
                ? 'border-2 border-dashed border-neon-cyan/60 bg-neon-cyan/5'
                : 'border-2 border-dashed border-white/10 hover:border-neon-cyan/30 hover:bg-neon-cyan/3'}`}
          >
            <input {...getInputProps()} />

            <AnimatePresence mode="wait">
              {!file ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  {/* Upload Icon */}
                  <motion.div
                    animate={isDragActive ? { scale: 1.15, rotate: 5 } : { scale: 1, rotate: 0 }}
                    className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center"
                    style={{ background: 'rgba(0,102,255,0.12)', border: '1px solid rgba(0,245,255,0.2)' }}
                  >
                    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                      <path d="M18 24V12M18 12L12 18M18 12L24 18" stroke="#00f5ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <rect x="4" y="26" width="28" height="2" rx="1" fill="rgba(0,245,255,0.3)"/>
                      <rect x="1" y="4" width="34" height="22" rx="3" stroke="rgba(0,245,255,0.2)" strokeWidth="1" fill="none"/>
                    </svg>
                  </motion.div>
                  <h3 className="font-display font-semibold text-white text-xl mb-2">
                    {isDragActive ? 'Release to Upload' : 'Drag & Drop Your Resume'}
                  </h3>
                  <p className="text-white/40 font-body text-sm mb-4">or click to browse files</p>
                  <div className="flex items-center justify-center gap-4 text-xs font-mono text-white/25">
                    <span>PDF</span><span>•</span><span>DOC</span><span>•</span><span>DOCX</span>
                    <span className="ml-2">Max 10MB</span>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="file"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-4 text-left"
                >
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.3)' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8L14 2z" stroke="#00ff88" strokeWidth="1.5"/>
                      <polyline points="14,2 14,8 20,8" stroke="#00ff88" strokeWidth="1.5"/>
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-body font-medium truncate">{file.name}</p>
                    <p className="text-white/40 font-mono text-xs mt-1">{formatSize(file.size)}</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setFile(null); setStatus('idle'); }}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-neon-red hover:bg-neon-red/10 transition-all"
                  >
                    ✕
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </GlowCard>

        {/* Upload Progress */}
        <AnimatePresence>
          {status === 'uploading' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="glass-card p-5 mb-6"
            >
              <div className="flex justify-between items-center mb-3">
                <span className="text-white/60 font-body text-sm">Uploading & Analyzing...</span>
                <span className="text-neon-cyan font-mono text-sm">{progress}%</span>
              </div>
              <div className="progress-bar">
                <motion.div
                  className="progress-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <div className="flex gap-6 mt-4">
                {['Parsing document', 'Extracting skills', 'Building questions'].map((step, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full"
                      animate={{ opacity: progress > i * 33 ? [0.5, 1, 0.5] : 0.2 }}
                      transition={{ duration: 1, repeat: Infinity }}
                      style={{ background: progress > i * 33 ? '#00f5ff' : 'rgba(255,255,255,0.2)' }}
                    />
                    <span className="text-xs font-mono" style={{ color: progress > i * 33 ? 'rgba(0,245,255,0.8)' : 'rgba(255,255,255,0.2)' }}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {status === 'done' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-5 mb-6 flex items-center gap-4"
              style={{ borderColor: 'rgba(0,255,136,0.3)', boxShadow: '0 0 20px rgba(0,255,136,0.1)' }}
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(0,255,136,0.15)' }}>
                <span className="text-neon-green text-lg">✓</span>
              </div>
              <div>
                <p className="text-neon-green font-display font-semibold">Upload Complete!</p>
                <p className="text-white/40 text-sm font-body">Redirecting to your interview...</p>
              </div>
              <div className="ml-auto">
                <div className="w-6 h-6 border-2 border-neon-green/30 border-t-neon-green rounded-full animate-spin" />
              </div>
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card p-4 mb-6"
              style={{ borderColor: 'rgba(255,45,85,0.3)' }}
            >
              <p className="text-neon-red text-sm font-body">⚠ {error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <button
            onClick={handleUpload}
            disabled={!file || status === 'uploading' || status === 'done'}
            className="btn-primary w-full py-4 text-base disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none"
          >
            {status === 'uploading' ? (
              <span className="flex items-center justify-center gap-3">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing Resume...
              </span>
            ) : status === 'done' ? 'Starting Interview...' : 'Analyze Resume & Begin'}
          </button>
        </motion.div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3"
        >
          {[
            { icon: '🔒', text: 'Your data is encrypted and private' },
            { icon: '⚡', text: 'Analysis completes in under 10 seconds' },
            { icon: '🗑️', text: 'Files deleted after your session' },
          ].map((tip, i) => (
            <div key={i} className="flex items-center gap-2 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span className="text-base">{tip.icon}</span>
              <span className="text-white/30 text-xs font-body">{tip.text}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default UploadPage;
