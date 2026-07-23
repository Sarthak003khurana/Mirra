import React, { useState } from 'react';
import { motion } from 'framer-motion';
import GlowCard from '../components/GlowCard';

const Toggle = ({ value, onChange, label, desc, color = '#00f5ff' }) => (
  <div className="flex items-center justify-between py-4 border-b border-glass-border last:border-0">
    <div>
      <p className="font-body font-medium text-white text-sm">{label}</p>
      {desc && <p className="text-white/30 text-xs font-body mt-0.5">{desc}</p>}
    </div>
    <button
      onClick={() => onChange(!value)}
      className="relative w-12 h-6 rounded-full transition-all duration-300 flex-shrink-0"
      style={{ background: value ? `${color}33` : 'rgba(255,255,255,0.08)', border: `1px solid ${value ? color : 'rgba(255,255,255,0.1)'}` }}
    >
      <motion.div
        animate={{ x: value ? 24 : 2 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="absolute top-0.5 w-5 h-5 rounded-full"
        style={{ background: value ? color : 'rgba(255,255,255,0.3)', boxShadow: value ? `0 0 8px ${color}80` : 'none' }}
      />
    </button>
  </div>
);

const Select = ({ label, value, onChange, options }) => (
  <div className="py-4 border-b border-glass-border last:border-0">
    <label className="block font-body font-medium text-white text-sm mb-2">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2.5 rounded-xl font-body text-sm text-white/70 bg-transparent outline-none cursor-pointer"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value} style={{ background: '#060d18' }}>{o.label}</option>
      ))}
    </select>
  </div>
);

const voices = [
  { value: 'aria', label: 'Aria — Professional Female' },
  { value: 'echo', label: 'Echo — Neutral & Clear' },
  { value: 'nexus', label: 'Nexus — Deep Male' },
  { value: 'sage', label: 'Sage — Warm & Friendly' },
];

const mics = [
  { value: 'default', label: 'Default System Microphone' },
  { value: 'ext', label: 'External USB Microphone' },
  { value: 'headset', label: 'Headset Microphone' },
];

const cameras = [
  { value: 'default', label: 'Default Webcam' },
  { value: 'ext', label: 'External Camera' },
];

const difficultyOptions = [
  { value: 'easy', label: 'Entry Level — Warm Up' },
  { value: 'medium', label: 'Mid Level — Standard' },
  { value: 'hard', label: 'Senior Level — Rigorous' },
  { value: 'expert', label: 'Expert — FAANG Style' },
];

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    mic: 'default',
    camera: 'default',
    voice: 'aria',
    difficulty: 'medium',
    eyeTracking: true,
    noiseCancel: true,
    autoFollow: true,
    videoEnabled: true,
    speechFeedback: false,
    notifications: true,
  });
  const [saved, setSaved] = useState(false);

  const set = (key, val) => setSettings((s) => ({ ...s, [key]: val }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="min-h-screen bg-void pt-24 pb-16 relative">
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <p className="text-neon-cyan font-mono text-xs tracking-widest uppercase mb-2">Configuration</p>
          <h1 className="font-display font-black text-4xl text-white">Platform <span className="gradient-text">Settings</span></h1>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Audio */}
          <GlowCard className="p-6" glowColor="cyan" delay={0}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
                style={{ background: 'rgba(0,245,255,0.1)', border: '1px solid rgba(0,245,255,0.2)' }}>🎙️</div>
              <h2 className="font-display font-semibold text-white">Audio Settings</h2>
            </div>
            <Select label="Microphone Device" value={settings.mic} onChange={(v) => set('mic', v)} options={mics} />
            <Toggle label="Noise Cancellation" desc="Filter background noise for clearer audio" value={settings.noiseCancel} onChange={(v) => set('noiseCancel', v)} />
            <Toggle label="Real-time Speech Feedback" desc="Get live pronunciation hints during interview" value={settings.speechFeedback} onChange={(v) => set('speechFeedback', v)} />
          </GlowCard>

          {/* Camera */}
          <GlowCard className="p-6" glowColor="purple" delay={0.1}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
                style={{ background: 'rgba(123,47,255,0.1)', border: '1px solid rgba(123,47,255,0.2)' }}>📷</div>
              <h2 className="font-display font-semibold text-white">Camera Settings</h2>
            </div>
            <Select label="Camera Device" value={settings.camera} onChange={(v) => set('camera', v)} options={cameras} />
            <Toggle label="Enable Video" desc="Show your webcam feed during interviews" value={settings.videoEnabled} onChange={(v) => set('videoEnabled', v)} color="#7b2fff" />
            <Toggle label="Eye Contact Tracking" desc="AI tracks gaze to measure focus score" value={settings.eyeTracking} onChange={(v) => set('eyeTracking', v)} color="#7b2fff" />
          </GlowCard>

          {/* AI Voice */}
          <GlowCard className="p-6" glowColor="blue" delay={0.2}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
                style={{ background: 'rgba(0,102,255,0.1)', border: '1px solid rgba(0,102,255,0.2)' }}>🤖</div>
              <h2 className="font-display font-semibold text-white">AI Interviewer</h2>
            </div>
            <Select label="AI Voice Persona" value={settings.voice} onChange={(v) => set('voice', v)} options={voices} />
            <Select label="Interview Difficulty" value={settings.difficulty} onChange={(v) => set('difficulty', v)} options={difficultyOptions} />
            <Toggle label="Smart Follow-up Questions" desc="AI adapts and generates follow-ups based on answers" value={settings.autoFollow} onChange={(v) => set('autoFollow', v)} color="#0066ff" />
          </GlowCard>

          {/* General */}
          <GlowCard className="p-6" glowColor="green" delay={0.3}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
                style={{ background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.2)' }}>⚙️</div>
              <h2 className="font-display font-semibold text-white">General</h2>
            </div>
            <Toggle label="Email Notifications" desc="Get report summaries sent to your inbox" value={settings.notifications} onChange={(v) => set('notifications', v)} color="#00ff88" />

            {/* API URL config */}
            <div className="py-4 border-b border-glass-border">
              <label className="block font-body font-medium text-white text-sm mb-2">Backend API URL</label>
              <input
                type="text"
                defaultValue="http://localhost:8000"
                className="w-full px-4 py-2.5 rounded-xl font-mono text-sm text-white/60 bg-transparent outline-none"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
              />
              <p className="text-white/25 text-xs font-body mt-1.5">FastAPI backend endpoint for API calls</p>
            </div>

            {/* Clear Data */}
            <div className="py-4">
              <label className="block font-body font-medium text-white text-sm mb-1">Clear Session Data</label>
              <p className="text-white/30 text-xs font-body mb-3">Remove all stored interview history and settings</p>
              <button className="px-4 py-2 rounded-lg text-xs font-body text-neon-red border border-neon-red/30 hover:bg-neon-red/10 transition-all">
                Clear All Data
              </button>
            </div>
          </GlowCard>
        </div>

        {/* Save */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex justify-end mt-8 gap-4"
        >
          <button className="btn-ghost">Reset Defaults</button>
          <button onClick={handleSave} className="btn-primary px-8 relative overflow-hidden">
            {saved ? (
              <span className="flex items-center gap-2">
                <span className="text-neon-green">✓</span> Saved!
              </span>
            ) : 'Save Settings'}
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default SettingsPage;
