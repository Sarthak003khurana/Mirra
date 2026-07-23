import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid } from 'recharts';
import ScoreCircle from '../components/ScoreCircle';
import GlowCard from '../components/GlowCard';
import { Link } from 'react-router-dom';

const mockReport = {
  overallScore: 82,
  result: 'PASS',
  eyeContact: 87,
  confidence: 79,
  communication: 84,
  technicalKnowledge: 76,
  problemSolving: 88,
  culturalFit: 85,
  strengths: [
    'Strong narrative structure in behavioral answers',
    'Clear articulation of technical concepts',
    'Excellent problem decomposition skills',
    'Maintained consistent eye contact throughout',
  ],
  weaknesses: [
    'Occasionally uses filler words (um, uh) under pressure',
    'Technical depth could be expanded on scalability topics',
    'Answer pacing was slightly rushed in Q3',
  ],
  questionBreakdown: [
    { q: 'Q1', score: 88 },
    { q: 'Q2', score: 75 },
    { q: 'Q3', score: 70 },
    { q: 'Q4', score: 85 },
    { q: 'Q5', score: 90 },
  ],
  eyeContactTimeline: [
    { t: '0:00', score: 72 },
    { t: '2:00', score: 85 },
    { t: '4:00', score: 79 },
    { t: '6:00', score: 91 },
    { t: '8:00', score: 87 },
    { t: '10:00', score: 83 },
  ],
  radarData: [
    { skill: 'Confidence', value: 79 },
    { skill: 'Clarity', value: 84 },
    { skill: 'Technical', value: 76 },
    { skill: 'Leadership', value: 82 },
    { skill: 'Problem Solving', value: 88 },
    { skill: 'Culture Fit', value: 85 },
  ],
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card px-3 py-2 text-xs font-mono">
      <p className="text-neon-cyan">{label}: <span className="text-white">{payload[0]?.value}%</span></p>
    </div>
  );
};

const ReportPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const isPassed = mockReport.result === 'PASS';

  return (
    <div className="min-h-screen bg-void pt-24 pb-16 relative">
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 40% at 50% 0%, rgba(123,47,255,0.12) 0%, transparent 60%)' }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <p className="text-neon-cyan font-mono text-xs tracking-widest uppercase mb-2">Interview Complete · May 2025</p>
              <h1 className="font-display font-black text-4xl text-white">Performance <span className="gradient-text">Report</span></h1>
            </div>
            <div className="flex gap-3">
              <button className="btn-ghost flex items-center gap-2 text-sm">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1v8M4 6l3 3 3-3M1 10v1a2 2 0 002 2h8a2 2 0 002-2v-1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
                Download PDF
              </button>
              <Link to="/upload" className="btn-primary text-sm py-2.5">New Interview</Link>
            </div>
          </div>
        </motion.div>

        {/* Result Hero Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-8 mb-6 relative overflow-hidden"
          style={{
            borderColor: isPassed ? 'rgba(0,255,136,0.3)' : 'rgba(255,45,85,0.3)',
            boxShadow: isPassed ? '0 0 40px rgba(0,255,136,0.08)' : '0 0 40px rgba(255,45,85,0.08)',
          }}
        >
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
            style={{ background: isPassed ? 'radial-gradient(circle, rgba(0,255,136,0.05) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(255,45,85,0.05) 0%, transparent 70%)' }} />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-center">
            <ScoreCircle
              score={mockReport.overallScore}
              size={150}
              label="Overall Score"
              color={isPassed ? '#00ff88' : '#ff2d55'}
            />
            <div className="md:col-span-2">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="px-4 py-2 rounded-lg font-display font-black text-2xl tracking-wider"
                  style={{
                    background: isPassed ? 'rgba(0,255,136,0.15)' : 'rgba(255,45,85,0.15)',
                    border: `2px solid ${isPassed ? 'rgba(0,255,136,0.4)' : 'rgba(255,45,85,0.4)'}`,
                    color: isPassed ? '#00ff88' : '#ff2d55',
                    textShadow: isPassed ? '0 0 20px rgba(0,255,136,0.6)' : '0 0 20px rgba(255,45,85,0.6)',
                  }}>
                  {isPassed ? '✓ PASS' : '✕ RETRY'}
                </div>
              </div>
              <h2 className="font-display font-bold text-white text-2xl mb-2">
                {isPassed ? 'Excellent Performance!' : 'Keep Practicing!'}
              </h2>
              <p className="text-white/40 font-body text-sm max-w-sm">
                {isPassed
                  ? 'You demonstrated strong communication, good eye contact, and solid technical knowledge. You are well-prepared for your target role.'
                  : 'Good effort! Focus on the improvement areas below and practice again to boost your score.'}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Eye Contact', val: mockReport.eyeContact, color: '#00f5ff' },
                { label: 'Confidence', val: mockReport.confidence, color: '#7b2fff' },
                { label: 'Communication', val: mockReport.communication, color: '#00ff88' },
                { label: 'Technical', val: mockReport.technicalKnowledge, color: '#0066ff' },
              ].map((m) => (
                <div key={m.label} className="text-center p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="font-display font-bold text-xl" style={{ color: m.color }}>{m.val}</div>
                  <div className="text-white/30 text-xs font-body mt-0.5">{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl mb-6"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', display: 'inline-flex' }}>
          {['overview', 'analytics', 'feedback'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg font-body text-sm font-medium capitalize transition-all duration-200 ${
                activeTab === tab
                  ? 'text-void font-semibold'
                  : 'text-white/40 hover:text-white/70'
              }`}
              style={activeTab === tab ? { background: 'linear-gradient(135deg, #00f5ff, #0066ff)' } : {}}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Radar Chart */}
            <GlowCard className="p-6 lg:col-span-2" glowColor="blue" delay={0}>
              <h3 className="font-display text-sm font-semibold tracking-widest text-white/50 uppercase mb-6">Skill Radar</h3>
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={mockReport.radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.06)" />
                  <PolarAngleAxis dataKey="skill" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'Syne' }} />
                  <Radar name="Score" dataKey="value" stroke="#00f5ff" fill="#00f5ff" fillOpacity={0.15}
                    strokeWidth={2} dot={{ r: 3, fill: '#00f5ff' }} />
                </RadarChart>
              </ResponsiveContainer>
            </GlowCard>

            {/* Q Breakdown */}
            <GlowCard className="p-6" glowColor="purple" delay={0.1}>
              <h3 className="font-display text-sm font-semibold tracking-widest text-white/50 uppercase mb-6">Per Question</h3>
              <div className="space-y-3">
                {mockReport.questionBreakdown.map((q, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-white/60 text-xs font-mono">{q.q}</span>
                      <span className="font-display font-bold text-sm" style={{ color: q.score >= 80 ? '#00ff88' : q.score >= 70 ? '#00f5ff' : '#ff2d55' }}>{q.score}%</span>
                    </div>
                    <div className="progress-bar">
                      <motion.div
                        className="progress-fill"
                        style={{ background: q.score >= 80 ? 'linear-gradient(90deg, #00ff88, #00f5ff)' : q.score >= 70 ? 'linear-gradient(90deg, #0066ff, #00f5ff)' : 'linear-gradient(90deg, #ff2d55, #ff6b88)' }}
                        initial={{ width: 0 }}
                        animate={{ width: `${q.score}%` }}
                        transition={{ delay: i * 0.1 + 0.3 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </GlowCard>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlowCard className="p-6" glowColor="cyan">
              <h3 className="font-display text-sm font-semibold tracking-widest text-white/50 uppercase mb-6">Eye Contact Over Time</h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={mockReport.eyeContactTimeline}>
                  <CartesianGrid stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="t" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} />
                  <YAxis domain={[60, 100]} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="score" stroke="#00f5ff" strokeWidth={2} dot={{ r: 3, fill: '#00f5ff' }} />
                </LineChart>
              </ResponsiveContainer>
            </GlowCard>
            <GlowCard className="p-6" glowColor="purple">
              <h3 className="font-display text-sm font-semibold tracking-widest text-white/50 uppercase mb-6">Question Scores</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={mockReport.questionBreakdown}>
                  <CartesianGrid stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="q" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="score" fill="url(#barGrad)" radius={[4, 4, 0, 0]}>
                    <defs>
                      <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#7b2fff" />
                        <stop offset="100%" stopColor="#0066ff" />
                      </linearGradient>
                    </defs>
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </GlowCard>
          </div>
        )}

        {activeTab === 'feedback' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlowCard className="p-6" glowColor="green">
              <h3 className="font-display text-sm font-semibold tracking-widest text-neon-green uppercase mb-5 flex items-center gap-2">
                <span>✓</span> Strengths
              </h3>
              <div className="space-y-3">
                {mockReport.strengths.map((s, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                    className="flex gap-3 p-3 rounded-xl"
                    style={{ background: 'rgba(0,255,136,0.05)', border: '1px solid rgba(0,255,136,0.12)' }}>
                    <div className="w-4 h-4 rounded-full flex items-center justify-center text-xs bg-neon-green/20 text-neon-green flex-shrink-0 mt-0.5">✓</div>
                    <p className="text-white/70 font-body text-sm">{s}</p>
                  </motion.div>
                ))}
              </div>
            </GlowCard>
            <GlowCard className="p-6" glowColor="blue">
              <h3 className="font-display text-sm font-semibold tracking-widest text-neon-cyan uppercase mb-5 flex items-center gap-2">
                <span>↗</span> Areas to Improve
              </h3>
              <div className="space-y-3">
                {mockReport.weaknesses.map((w, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                    className="flex gap-3 p-3 rounded-xl"
                    style={{ background: 'rgba(0,102,255,0.05)', border: '1px solid rgba(0,102,255,0.15)' }}>
                    <div className="w-4 h-4 rounded-full flex items-center justify-center text-xs bg-neon-blue/20 text-neon-blue flex-shrink-0 mt-0.5">→</div>
                    <p className="text-white/70 font-body text-sm">{w}</p>
                  </motion.div>
                ))}
              </div>
            </GlowCard>

            {/* AI Recommendation */}
            <div className="md:col-span-2">
              <GlowCard className="p-6" glowColor="purple" delay={0.2}>
                <h3 className="font-display text-sm font-semibold tracking-widest text-white/50 uppercase mb-4">AI Recommendation</h3>
                <p className="text-white/60 font-body text-sm leading-relaxed">
                  Based on your interview performance, you demonstrate strong communication and leadership qualities. 
                  Focus on expanding your technical depth — particularly around system scalability and distributed systems. 
                  Practice the STAR method for behavioral questions to reduce filler words under pressure. 
                  Your eye contact and confidence scores are above average, which will make a strong impression in real interviews. 
                  We recommend one more practice session focusing on technical depth before your target interview.
                </p>
              </GlowCard>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportPage;
