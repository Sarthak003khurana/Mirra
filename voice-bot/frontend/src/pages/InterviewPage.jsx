import React, {
  useState,
  useEffect,
  useRef
} from 'react';

import {
  motion,
  AnimatePresence
} from 'framer-motion';

import {
  useNavigate
} from 'react-router-dom';

import AIAvatar from '../components/AIAvatar';
import SoundWave from '../components/SoundWave';
import GlowCard from '../components/GlowCard';

import useTypewriter from '../hooks/useTypewriter';
import useTimer from '../hooks/useTimer';

import {
  getQuestion,
  submitAnswer
} from '../services/api';


// =========================
// SCORE BAR
// =========================
const MeterBar = ({
  label,
  value,
  color,
  icon
}) => (

  <div className="space-y-2">

    <div className="flex justify-between items-center">

      <span className="text-white/50 text-xs font-body flex items-center gap-1.5">

        {icon} {label}

      </span>

      <span
        className="font-mono text-xs font-bold"
        style={{ color }}
      >

        {value}%

      </span>

    </div>

    <div className="progress-bar">

      <motion.div
        className="progress-fill h-full rounded-full"

        style={{
          background:
            `linear-gradient(90deg, ${color}88, ${color})`,

          boxShadow:
            `0 0 8px ${color}50`
        }}

        initial={{ width: 0 }}

        animate={{
          width: `${value}%`
        }}

        transition={{
          duration: 0.8,
          ease: 'easeOut'
        }}
      />

    </div>

  </div>
);


const InterviewPage = () => {

  const navigate = useNavigate();

  const videoRef = useRef(null);

  const [phase, setPhase] = useState('intro');

  const [questionIdx, setQuestionIdx] = useState(0);

  const [currentQuestion, setCurrentQuestion] = useState('');

  const [userAnswer, setUserAnswer] = useState('');

  const [followUp, setFollowUp] = useState('');

  const [roundNum, setRoundNum] = useState(1);

  const [scores, setScores] = useState({
    eyeContact: 78,
    confidence: 72,
    clarity: 81
  });

  const {
    formatted: timerDisplay,
    start: startTimer

  } = useTimer(0, false);


  // =========================
  // TYPEWRITER EFFECTS
  // =========================
  const {
    displayText: typedQuestion

  } = useTypewriter(

    phase !== 'intro'
      ? currentQuestion
      : '',

    35,
    200
  );


  const {
    displayText: typedFollowUp

  } = useTypewriter(

    followUp &&
    phase === 'followup'
      ? followUp
      : '',

    35,
    200
  );


  // =========================
  // FETCH QUESTION
  // =========================
  const fetchQuestion = async () => {

    try {

      const response =
        await getQuestion();

      setCurrentQuestion(
        response.data.question
      );

    } catch (error) {

      console.error(error);
    }
  };


  // =========================
  // INITIAL START
  // =========================
  useEffect(() => {

    if (phase === 'intro') {

      const t = setTimeout(async () => {

        await fetchQuestion();

        setPhase('speaking');

        startTimer();

      }, 2000);

      return () => clearTimeout(t);
    }

  }, []);


  // =========================
  // LIVE SCORE ANIMATION
  // =========================
  useEffect(() => {

    if (phase === 'listening') {

      const interval = setInterval(() => {

        setScores(s => ({

          eyeContact:
            Math.min(
              100,
              Math.max(
                40,
                s.eyeContact +
                (Math.random() - 0.4) * 6
              )
            ),

          confidence:
            Math.min(
              100,
              Math.max(
                40,
                s.confidence +
                (Math.random() - 0.4) * 5
              )
            ),

          clarity:
            Math.min(
              100,
              Math.max(
                50,
                s.clarity +
                (Math.random() - 0.45) * 4
              )
            ),
        }));

      }, 1500);

      return () => clearInterval(interval);
    }

  }, [phase]);


  // =========================
  // START ANSWER
  // =========================
  const handleStartAnswer = () => {

    setPhase('listening');

    setUserAnswer('');

    // TEMP DEMO ANSWER
    // Later connect real STT

    const demoAnswer =
      "I worked on multiple AI projects involving machine learning and full stack development.";

    let i = 0;

    const interval = setInterval(() => {

      if (i < demoAnswer.length) {

        setUserAnswer(
          demoAnswer.slice(0, i + 1)
        );

        i++;

      } else {

        clearInterval(interval);
      }

    }, 25);
  };


  // =========================
  // SUBMIT ANSWER
  // =========================
  const handleNextQuestion = async () => {

    try {

      setPhase('processing');

      const response =
        await submitAnswer(
          userAnswer
        );

      const feedback =
        response.data.feedback;

      const followup =
        response.data.followup;

      console.log(
        'Feedback:',
        feedback
      );

      if (followup) {

        setFollowUp(followup);

        setPhase('followup');

      } else {

        if (questionIdx >= 4) {

          setPhase('ended');

          return;
        }

        const nextQuestion =
          await getQuestion();

        setCurrentQuestion(
          nextQuestion.data.question
        );

        setQuestionIdx(i => i + 1);

        setRoundNum(r => r + 1);

        setUserAnswer('');

        setPhase('speaking');
      }

    } catch (error) {

      console.error(error);

      setPhase('speaking');
    }
  };


  // =========================
  // FOLLOW-UP
  // =========================
  const handleDismissFollowup = async () => {

    if (questionIdx >= 4) {

      setPhase('ended');

      return;
    }

    const nextQuestion =
      await getQuestion();

    setCurrentQuestion(
      nextQuestion.data.question
    );

    setQuestionIdx(i => i + 1);

    setUserAnswer('');

    setFollowUp('');

    setPhase('speaking');
  };


  // =========================
  // END INTERVIEW
  // =========================
  const handleEndInterview = () => {

    navigate('/report');
  };


  const isSpeaking =
    phase === 'speaking' ||
    phase === 'intro' ||
    phase === 'followup';

  const isListening =
    phase === 'listening';

  const isProcessing =
    phase === 'processing';


  return (

    <div className="min-h-screen bg-void pt-20 pb-6 relative overflow-hidden">

      {/* KEEPING YOUR ENTIRE UI SAME */}

      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(0,102,255,0.1) 0%, transparent 60%)'
        }}
      />

      {/* TOP BAR */}

      <div className="relative z-10 max-w-7xl mx-auto px-4 mb-4">

        <div className="glass-card px-4 py-3 flex items-center justify-between">

          <div className="flex items-center gap-6">

            <div className="flex items-center gap-2">

              <div
                className={`w-2 h-2 rounded-full ${
                  phase === 'ended'
                    ? 'bg-neon-red'
                    : 'bg-neon-green'
                } animate-pulse`}
              />

              <span className="font-mono text-xs text-white/60">

                {phase === 'ended'
                  ? 'COMPLETED'
                  : 'LIVE'}

              </span>

            </div>

            <div className="font-mono text-xs text-neon-cyan">

              {timerDisplay}

            </div>

            <div className="text-xs font-body text-white/30">

              Round {roundNum} · Q{questionIdx + 1}/5

            </div>

          </div>

          <button
            onClick={handleEndInterview}

            className="px-3 py-1.5 rounded-lg text-xs font-body text-neon-red border border-neon-red/30 hover:bg-neon-red/10 transition-all"
          >

            End Interview

          </button>

        </div>

      </div>

      {/* MAIN CONTENT */}

      <div className="relative z-10 max-w-7xl mx-auto px-4">

        <GlowCard className="p-8" glowColor="cyan">

          <h2 className="text-white text-2xl mb-6 font-display">

            {typedQuestion}

          </h2>

          {/* ANSWER BOX */}

          <div className="min-h-32 mb-6">

            <p className="text-white/70 font-body text-sm leading-relaxed">

              {userAnswer}

            </p>

          </div>

          {/* BUTTONS */}

          <div className="flex gap-3">

            {phase === 'speaking' && (

              <button
                onClick={handleStartAnswer}

                className="btn-primary flex-1 py-3"
              >

                Start Answering

              </button>
            )}

            {phase === 'listening' && (

              <button
                onClick={handleNextQuestion}

                className="btn-primary flex-1 py-3"
              >

                Finish & Submit

              </button>
            )}

            {phase === 'processing' && (

              <div className="flex-1 flex items-center justify-center gap-2 text-white/40 font-body text-sm">

                <div className="w-4 h-4 border-2 border-white/20 border-t-neon-cyan rounded-full animate-spin" />

                Processing...

              </div>
            )}

          </div>

        </GlowCard>

      </div>

    </div>
  );
};


export default InterviewPage;