import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import GlowCard from '../components/GlowCard';
import SoundWave from '../components/SoundWave';
import AIAvatar from '../components/AIAvatar';
import ParticleBackground from '../components/ParticleBackground';

const features = [
  {
    icon: '🧠',
    title: 'Resume Intelligence',
    desc: 'Deep AI analysis of your resume extracts skills, experience, and role fit — generating targeted interview questions.',
    color: 'cyan',
    grad: 'from-neon-cyan/20 to-transparent',
  },
  {
    icon: '👁️',
    title: 'Eye Contact Detection',
    desc: 'Real-time computer vision tracks gaze direction and confidence signals, giving you a live focus score throughout.',
    color: 'purple',
    grad: 'from-neon-purple/20 to-transparent',
  },
  {
    icon: '🎙️',
    title: 'Voice Intelligence',
    desc: 'AI listens, transcribes, and evaluates your answers — analyzing tone, pace, clarity, and domain knowledge.',
    color: 'blue',
    grad: 'from-neon-blue/20 to-transparent',
  },
  {
    icon: '🔁',
    title: 'Dynamic Follow-ups',
    desc: 'No static question banks. Our AI adapts in real time, probing deeper based on your actual responses.',
    color: 'green',
    grad: 'from-neon-green/20 to-transparent',
  },
  {
    icon: '📊',
    title: 'Confidence Metering',
    desc: 'Composite confidence score combines vocal stability, eye contact, response quality, and answer completeness.',
    color: 'cyan',
    grad: 'from-neon-cyan/20 to-transparent',
  },
  {
    icon: '📋',
    title: 'Instant AI Report',
    desc: 'Receive a detailed PDF report with scores, strengths, weaknesses, and personalized improvement strategies.',
    color: 'purple',
    grad: 'from-neon-purple/20 to-transparent',
  },
];

const stats = [
  { value: 98, suffix: '%', label: 'Accuracy Rate', color: '#00f5ff' },
  { value: 50, suffix: 'K+', label: 'Interviews Conducted', color: '#7b2fff' },
  { value: 94, suffix: '%', label: 'User Success Rate', color: '#00ff88' },
  { value: 3, suffix: 'x', label: 'Faster Preparation', color: '#0066ff' },
];

const steps = [
  { num: '01', title: 'Upload Resume', desc: 'Drop your resume — we parse and understand your full professional profile.' },
  { num: '02', title: 'AI Calibration', desc: 'Our model generates role-specific questions tailored exactly to your background.' },
  { num: '03', title: 'Live Interview', desc: 'Speak naturally. AI listens, evaluates, and follows up intelligently.' },
  { num: '04', title: 'Full Report', desc: 'Get a comprehensive performance report with actionable growth insights.' },
];

const StatCard = ({ value, suffix, label, color }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="text-center">
      <div className="font-display font-black text-4xl md:text-5xl mb-1" style={{ color }}>
        {inView ? <CountUp end={value} duration={2} suffix={suffix} /> : '0'}
      </div>
      <p className="text-white/40 font-body text-sm">{label}</p>
    </div>
  );
};

const LandingPage = () => {
  const [avatarState] = useState({ speaking: true, listening: false });

  return (
    <div className="min-h-screen bg-void overflow-hidden">
      <ParticleBackground />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center pt-24 pb-16">
        <div className="absolute inset-0 bg-hero-gradient pointer-events-none" />
        <div className="absolute inset-0 grid-bg opacity-50" />

        <div className="relative max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center z-10">
          {/* Left */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-8"
              style={{ background: 'rgba(0,245,255,0.08)', border: '1px solid rgba(0,245,255,0.2)' }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
              <span className="text-neon-cyan font-mono text-xs tracking-widest uppercase">AI Interview v2.0 — Live</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display font-black text-5xl md:text-6xl xl:text-7xl leading-none mb-6"
            >
              <span className="text-white">Practice Like</span>
              <br />
              <span className="gradient-text">It's Real.</span>
              <br />
              <span className="text-white">Perform Like</span>
              <br />
              <span className="text-white">A </span>
              <span className="gradient-text">Pro.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-white/50 text-lg font-body leading-relaxed mb-10 max-w-lg"
            >
              NexusAI conducts real-time AI mock interviews — analyzing your voice, tracking your gaze, and adapting questions to your unique profile. Land your dream role.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link to="/upload" className="btn-primary text-center">
                Start Free Interview
              </Link>
              <button className="btn-ghost flex items-center justify-center gap-2">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="6.5" stroke="rgba(255,255,255,0.4)" />
                  <path d="M5.5 4.5l4 2.5-4 2.5V4.5z" fill="rgba(255,255,255,0.6)" />
                </svg>
                Watch Demo
              </button>
            </motion.div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex items-center gap-4 mt-10"
            >
              <div className="flex -space-x-2">
                {['#0066ff', '#7b2fff', '#00ff88', '#ff2d55'].map((c, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-void flex items-center justify-center font-display font-bold text-xs text-white"
                    style={{ background: `radial-gradient(circle at 40% 40%, ${c}cc, ${c}44)` }}>
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <div>
                <div className="text-yellow-400 text-xs">★★★★★</div>
                <p className="text-white/30 text-xs font-body">Trusted by 50,000+ job seekers</p>
              </div>
            </motion.div>
          </div>

          {/* Right - AI Avatar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col items-center gap-8"
          >
            <div className="relative">
              <AIAvatar speaking={avatarState.speaking} size={280} />
              {/* Floating status cards */}
              <motion.div
                className="absolute -left-16 top-8 glass-card px-3 py-2 rounded-xl"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                  <span className="text-white/70 text-xs font-mono">Confidence: 87%</span>
                </div>
              </motion.div>
              <motion.div
                className="absolute -right-12 bottom-16 glass-card px-3 py-2 rounded-xl"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
                  <span className="text-white/70 text-xs font-mono">Eye Contact: 92%</span>
                </div>
              </motion.div>
            </div>

            {/* Live question card */}
            <motion.div
              className="glass-card p-5 max-w-md w-full neon-border-cyan"
              animate={{ boxShadow: ['0 0 20px rgba(0,245,255,0.1)', '0 0 40px rgba(0,245,255,0.25)', '0 0 20px rgba(0,245,255,0.1)'] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
                <span className="text-neon-cyan font-mono text-xs tracking-widest">AI INTERVIEWER</span>
                <SoundWave active bars={5} height={16} className="ml-auto" />
              </div>
              <p className="text-white/80 font-body text-sm leading-relaxed">
                "Tell me about a time you led a cross-functional team under a tight deadline. How did you prioritize and what was the outcome?"
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-white/20 text-xs font-mono tracking-widest">SCROLL</span>
          <div className="w-px h-8 bg-gradient-to-b from-neon-cyan/50 to-transparent" />
        </motion.div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-glass-border bg-panel/30">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <StatCard {...s} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-hero-gradient opacity-30 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-neon-cyan font-mono text-xs tracking-widest uppercase mb-3"
            >
              — Platform Capabilities —
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display font-black text-4xl md:text-5xl text-white mb-4"
            >
              Intelligence At Every Layer
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-white/40 font-body max-w-xl mx-auto"
            >
              From the moment you upload your resume to the final report download — every step is powered by advanced AI.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <GlowCard key={i} glowColor={f.color} delay={i * 0.1} className="p-6">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.grad} border border-white/10 flex items-center justify-center text-2xl mb-4`}>
                  {f.icon}
                </div>
                <h3 className="font-display font-semibold text-white text-lg mb-2">{f.title}</h3>
                <p className="text-white/40 font-body text-sm leading-relaxed">{f.desc}</p>
              </GlowCard>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-panel/20 border-y border-glass-border">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-neon-cyan font-mono text-xs tracking-widest uppercase mb-3">— Process —</p>
            <h2 className="font-display font-black text-4xl text-white">Four Steps to Mastery</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Connector line */}
            <div className="hidden lg:block absolute top-8 left-24 right-24 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(0,245,255,0.3), rgba(123,47,255,0.3), transparent)' }} />

            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative"
              >
                <div className="glass-card p-6 text-center">
                  <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center font-display font-black text-xl gradient-text"
                    style={{ background: 'rgba(0,102,255,0.1)', border: '1px solid rgba(0,245,255,0.2)' }}>
                    {step.num}
                  </div>
                  <h4 className="font-display font-semibold text-white text-base mb-2">{step.title}</h4>
                  <p className="text-white/40 text-xs font-body leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(0,102,255,0.15) 0%, transparent 70%)' }} />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto px-6 text-center relative z-10"
        >
          <p className="text-neon-cyan font-mono text-xs tracking-widest uppercase mb-4">— Ready? —</p>
          <h2 className="font-display font-black text-5xl md:text-6xl text-white mb-6 leading-none">
            Your Next Interview<br /><span className="gradient-text">Starts Now.</span>
          </h2>
          <p className="text-white/40 font-body text-lg mb-10">
            Join 50,000+ professionals who use NexusAI to land their dream roles. First interview is completely free.
          </p>
          <Link to="/upload" className="btn-primary text-base py-4 px-12 inline-block">
            Begin Your Interview
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default LandingPage;
