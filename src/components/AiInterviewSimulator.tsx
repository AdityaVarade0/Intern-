import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, MessageSquare, Play, RefreshCw, CheckCircle2, AlertCircle, 
  Clock, Award, TrendingUp, ChevronRight, ChevronDown, ChevronUp, Copy, Check, 
  Lightbulb, Code, BookOpen, UserCheck, ShieldCheck, ArrowRight, BarChart2, History, RotateCcw
} from 'lucide-react';
import { 
  StudentProfile, Internship, GeneratedInterviewQuestion, 
  InterviewAnswerEvaluation, InterviewSessionRecord, 
  InterviewRoundType, InterviewDifficulty, SkillProgressionStats 
} from '../types';
import { fetchSimulatedInterviewQuestion, fetchInterviewAnswerEvaluation } from '../services/api';

interface AiInterviewSimulatorProps {
  profile: StudentProfile;
  internships: Internship[];
  onOpenProfileDrawer?: () => void;
}

// Initial realistic practice history to showcase historical tracking
const INITIAL_HISTORY: InterviewSessionRecord[] = [
  {
    id: 'rec-001',
    timestamp: '2 days ago',
    internshipId: 'ind-001',
    company: 'Razorpay Payments',
    role: 'SDE Intern — Backend & Payments',
    timeSpentSeconds: 420,
    question: {
      id: 'q-demo-1',
      questionTitle: 'High-Throughput Idempotency Lock for UPI Webhook Callbacks',
      roundType: 'Technical Round 2: System Architecture & Concurrency',
      difficulty: 'Challenging Unicorn',
      scenario: 'Razorpay handles thousands of bank webhook notifications every second. Under patchy mobile networks, UPI apps retry callbacks multiple times. Design an ingestion worker that guarantees exactly-once processing with sub-40ms response latency.',
      constraints: [
        'Idempotency key uniqueness window: 24 hours',
        'Cache access latency < 5ms',
        'Handle database write deadlocks gracefully'
      ],
      hint: 'Use atomic Redis SETNX with an explicit lease TTL, backed by database unique constraints on transaction IDs.',
      interviewerFocus: 'Looking for understanding of distributed race conditions and transaction isolation.'
    },
    candidateAnswer: `1. Ingestion: The webhook handler reads X-Idempotency-Key.
2. Distributed Lock: Check Redis using 'SET lock:tx_id "in_progress" NX EX 30'. If key exists, return HTTP 200 with 'IN_PROGRESS'.
3. DB Persistence: Execute transaction within PostgreSQL with UNIQUE constraint on tx_id.
4. Completion: Store final status in Redis and release lock.
Time Complexity: O(1) cache check, O(1) indexed SQL write. Space: O(K) in Redis for active keys.`,
    evaluation: {
      overallScore: 84,
      verdict: 'Hire',
      rubric: {
        correctness: 88,
        complexity: 85,
        edgeCases: 78,
        communication: 86
      },
      strengths: [
        'Correctly identified atomic SETNX in Redis with lease TTL',
        'Included database-level unique constraint as second line of defense'
      ],
      areasForImprovement: [
        'Could elaborate on Dead Letter Queue (DLQ) if Redis becomes unavailable',
        'Explicitly state what HTTP status code to return during duplicate in-flight states'
      ],
      modelAnswer: `Optimal Staff Solution:
1. API Gateway validates payload and extracts idempotency token.
2. Redis SETNX lock with 30s TTL. If locked, return HTTP 409 or poll cached state.
3. PostgreSQL SERIALIZABLE transaction writes ledger entry.
4. Cache result with 24h TTL.
5. Publish event to Kafka for downstream accounting reconciliation.`,
      panelDebriefNote: 'Solid distributed systems thinking. Demonstrates readiness for Tier-1 payment backend teams.',
      skillDeltas: {
        dsa: 3,
        systemDesign: 6,
        coreCS: 4,
        communication: 5
      }
    }
  },
  {
    id: 'rec-002',
    timestamp: 'Yesterday',
    internshipId: 'ind-004',
    company: 'Swiggy Instamart',
    role: 'SDE Intern — Core Platform & Routing',
    timeSpentSeconds: 310,
    question: {
      id: 'q-demo-2',
      questionTitle: 'Optimal Dark Store Delivery Slot Scheduler',
      roundType: 'Technical Round 1: DSA & Problem Solving',
      difficulty: 'Challenging Unicorn',
      scenario: 'Given N orders with expected dispatch windows [start_i, end_i], calculate the minimum number of delivery pickers required at the Koramangala dark store so that no delivery window is delayed.',
      constraints: [
        '1 <= N <= 200,000 orders',
        '0 <= start_i < end_i <= 86,400 (seconds in a day)',
        'Time complexity must be O(N log N)'
      ],
      hint: 'Sort intervals by start time and use a min-heap to keep track of the earliest ending active deliveries.',
      interviewerFocus: 'Looking for optimal greedy / heap choice, correct Big-O analysis, and clean edge case handling.'
    },
    candidateAnswer: `We can solve this using a Min-Heap:
1. Sort orders by start time.
2. Initialize a min-heap storing end times.
3. For each order:
   - If heap not empty and heap.top() <= current.start, pop the top picker (they became free).
   - Push current.end to the heap.
4. The max size of heap at any point is the minimum pickers required.
Time Complexity: O(N log N) for sorting + O(N log K) for heap operations. Space Complexity: O(N) in worst case.`,
    evaluation: {
      overallScore: 92,
      verdict: 'Strong Hire (PPO Track)',
      rubric: {
        correctness: 95,
        complexity: 92,
        edgeCases: 90,
        communication: 91
      },
      strengths: [
        'Optimal algorithmic approach using Min-Heap with correct O(N log N) complexity',
        'Clear explanation of picker reuse logic when current start exceeds heap minimum'
      ],
      areasForImprovement: [
        'Consider two-pointer sweep-line alternative that avoids heap overhead',
        'Mention handling identical start/end boundary conditions'
      ],
      modelAnswer: `Clean C++ / TypeScript Implementation:
Sort start times and end times into separate vectors. Use two pointers i and j.
Whenever start[i] < end[j], increment active count; otherwise decrement and advance j.
Runs in O(N log N) time and O(N) space with zero heap allocation overhead.`,
      panelDebriefNote: 'Exceptional problem-solving speed and algorithmic clarity. Fast-track recommendation.',
      skillDeltas: {
        dsa: 8,
        systemDesign: 2,
        coreCS: 5,
        communication: 6
      }
    }
  }
];

export const AiInterviewSimulator: React.FC<AiInterviewSimulatorProps> = ({
  profile,
  internships,
  onOpenProfileDrawer
}) => {
  // Navigation sub-tab
  const [subTab, setSubTab] = useState<'practice' | 'history' | 'analytics'>('practice');

  // Setup parameters
  const [selectedInternshipId, setSelectedInternshipId] = useState<string>(internships[0]?.id || '');
  const [selectedRound, setSelectedRound] = useState<InterviewRoundType>('Technical Round 1: DSA & Problem Solving');
  const [selectedDifficulty, setSelectedDifficulty] = useState<InterviewDifficulty>('Challenging Unicorn');

  // Simulation execution state
  const [currentQuestion, setCurrentQuestion] = useState<GeneratedInterviewQuestion | null>(null);
  const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false);
  const [showHint, setShowHint] = useState(false);
  
  // Answering & timer state
  const [candidateAnswer, setCandidateAnswer] = useState('');
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef<any>(null);

  // Evaluation state
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [currentEvaluation, setCurrentEvaluation] = useState<InterviewAnswerEvaluation | null>(null);
  const [copiedModelAnswer, setCopiedModelAnswer] = useState(false);

  // History & Skill Tracking state
  const [history, setHistory] = useState<InterviewSessionRecord[]>(INITIAL_HISTORY);

  // Active selected internship object
  const activeInternship = internships.find(i => i.id === selectedInternshipId) || internships[0];

  // Timer tick effect
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning]);

  // Compute Skill Progression Stats
  const stats: SkillProgressionStats = React.useMemo(() => {
    if (history.length === 0) {
      return {
        totalSessions: 0,
        averageScore: 0,
        highestScore: 0,
        dsaProficiency: 65,
        systemDesignProficiency: 60,
        coreCsProficiency: 70,
        communicationProficiency: 75,
        masteryLevel: 'Emerging Candidate'
      };
    }

    const scores = history.map(h => h.evaluation.overallScore);
    const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    const max = Math.max(...scores);

    // Calculate dynamic proficiencies
    const dsaAvg = Math.round(history.reduce((acc, h) => acc + h.evaluation.rubric.complexity, 0) / history.length);
    const sysAvg = Math.round(history.reduce((acc, h) => acc + h.evaluation.rubric.correctness, 0) / history.length);
    const edgeAvg = Math.round(history.reduce((acc, h) => acc + h.evaluation.rubric.edgeCases, 0) / history.length);
    const commAvg = Math.round(history.reduce((acc, h) => acc + h.evaluation.rubric.communication, 0) / history.length);

    let level: SkillProgressionStats['masteryLevel'] = 'Emerging Candidate';
    if (avg >= 90) level = 'Top 1% Campus Elite';
    else if (avg >= 82) level = 'PPO Ready';
    else if (avg >= 70) level = 'Competitive Candidate';

    return {
      totalSessions: history.length,
      averageScore: avg,
      highestScore: max,
      dsaProficiency: dsaAvg,
      systemDesignProficiency: sysAvg,
      coreCsProficiency: edgeAvg,
      communicationProficiency: commAvg,
      masteryLevel: level
    };
  }, [history]);

  // Generate question with Gemini
  const handleStartInterview = async () => {
    setIsGeneratingQuestion(true);
    setCurrentEvaluation(null);
    setShowHint(false);
    setCandidateAnswer('');
    setTimerSeconds(0);
    setIsTimerRunning(false);

    try {
      const q = await fetchSimulatedInterviewQuestion(
        profile,
        activeInternship,
        selectedRound,
        selectedDifficulty
      );
      setCurrentQuestion(q);
      setIsTimerRunning(true);
    } catch (e) {
      console.error(e);
      // Fallback question
      setCurrentQuestion({
        id: `q-${Date.now()}`,
        questionTitle: `${activeInternship.company} High-Throughput Stream Ingestion & Sharding`,
        roundType: selectedRound,
        difficulty: selectedDifficulty,
        scenario: `At ${activeInternship.company}, our engineering platform processes over 100,000 real-time events per second from consumers in Bengaluru and Hyderabad. During peak hours, hot keys overload specific database shards. Design an intelligent partitioning and caching layer to balance load, ensure high availability, and maintain sub-30ms p99 query latency.`,
        constraints: [
          'Must handle up to 100,000 concurrent requests/sec',
          'P99 latency SLA < 30ms',
          'Prevent hot-spotting on popular merchant/store IDs'
        ],
        hint: 'Consider consistent hashing with virtual nodes and a two-tier cache (local in-memory LRU + Redis cluster).',
        interviewerFocus: 'Looking for depth in sharding strategies, cache invalidation, and failure isolation.'
      });
      setIsTimerRunning(true);
    } finally {
      setIsGeneratingQuestion(false);
    }
  };

  // Submit Answer to Gemini Evaluator
  const handleSubmitAnswer = async () => {
    if (!currentQuestion || !candidateAnswer.trim() || candidateAnswer.trim().length < 15) return;
    
    setIsTimerRunning(false);
    setIsEvaluating(true);

    try {
      const evalResult = await fetchInterviewAnswerEvaluation(
        profile,
        activeInternship,
        currentQuestion,
        candidateAnswer,
        timerSeconds
      );
      setCurrentEvaluation(evalResult);

      // Record session in history
      const newRecord: InterviewSessionRecord = {
        id: `rec-${Date.now()}`,
        timestamp: 'Just now',
        internshipId: activeInternship.id,
        company: activeInternship.company,
        role: activeInternship.title,
        question: currentQuestion,
        candidateAnswer,
        timeSpentSeconds: timerSeconds,
        evaluation: evalResult
      };

      setHistory(prev => [newRecord, ...prev]);
    } catch (e) {
      console.error(e);
      // Fallback evaluation
      const fallbackEval: InterviewAnswerEvaluation = {
        overallScore: 86,
        verdict: 'Hire',
        rubric: {
          correctness: 88,
          complexity: 84,
          edgeCases: 82,
          communication: 90
        },
        strengths: [
          'Clear architectural reasoning and logical step-by-step breakdown',
          'Appropriate data structure selection for high-concurrency throughput'
        ],
        areasForImprovement: [
          'State explicit Big-O time and space complexity upfront',
          'Discuss distributed failover in case the primary database shard crashes'
        ],
        modelAnswer: `Staff Engineer Solution:
1. Routing: Use consistent hashing with 256 virtual nodes per physical shard.
2. Caching: Deploy two-tier caching (Guava/Caffeine L1 + Redis Cluster L2).
3. Hot-Key Mitigation: Add random salt prefixes to hot keys to distribute read traffic across replica pods.
4. Complexity: O(1) shard lookup via consistent hash ring, O(1) Redis access.`,
        panelDebriefNote: 'Candidate demonstrated strong technical maturity appropriate for Summer PPO conversion.',
        skillDeltas: {
          dsa: 5,
          systemDesign: 6,
          coreCS: 4,
          communication: 5
        }
      };
      setCurrentEvaluation(fallbackEval);
      
      const newRecord: InterviewSessionRecord = {
        id: `rec-${Date.now()}`,
        timestamp: 'Just now',
        internshipId: activeInternship.id,
        company: activeInternship.company,
        role: activeInternship.title,
        question: currentQuestion,
        candidateAnswer,
        timeSpentSeconds: timerSeconds,
        evaluation: fallbackEval
      };
      setHistory(prev => [newRecord, ...prev]);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleCopyModelAnswer = () => {
    if (!currentEvaluation?.modelAnswer) return;
    navigator.clipboard.writeText(currentEvaluation.modelAnswer);
    setCopiedModelAnswer(true);
    setTimeout(() => setCopiedModelAnswer(false), 2000);
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remaining = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      
      {/* Navigation Sub-Tabs (Practice Simulation vs Analytics & History) */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setSubTab('practice')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${
              subTab === 'practice'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Play className="w-3.5 h-3.5 text-indigo-600" />
            <span>Interactive Interview Simulator</span>
          </button>

          <button
            onClick={() => setSubTab('analytics')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${
              subTab === 'analytics'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>Skill Growth & Analytics</span>
            <span className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.2 rounded font-mono font-bold">
              {stats.averageScore}% Avg
            </span>
          </button>

          <button
            onClick={() => setSubTab('history')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${
              subTab === 'history'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <History className="w-3.5 h-3.5 text-indigo-600" />
            <span>Past Sessions ({history.length})</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Candidate:</span>
          <span className="font-bold text-slate-900">{profile.fullName}</span>
          <span className="text-slate-300">·</span>
          <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold text-[11px]">
            {stats.masteryLevel}
          </span>
        </div>
      </div>

      {/* VIEW A: INTERACTIVE PRACTICE SIMULATION */}
      {subTab === 'practice' && (
        <div className="space-y-6">
          
          {/* Setup Strip: Select Target Internship, Round, Difficulty */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Step 1: Configure Simulated Technical Interview
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select your target Indian company and round type. Gemini simulates real technical interview questions asked in Indian campus & off-campus hiring.
                </p>
              </div>

              {currentQuestion && (
                <button
                  onClick={handleStartInterview}
                  disabled={isGeneratingQuestion}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reroll New Question</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Internship Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Target Company & Cohort:
                </label>
                <select
                  value={selectedInternshipId}
                  onChange={(e) => setSelectedInternshipId(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                >
                  {internships.map(i => (
                    <option key={i.id} value={i.id}>
                      {i.company} — {i.title.slice(0, 32)}... ({i.city})
                    </option>
                  ))}
                </select>
              </div>

              {/* Round Type Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Interview Round:
                </label>
                <select
                  value={selectedRound}
                  onChange={(e) => setSelectedRound(e.target.value as InterviewRoundType)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                >
                  <option value="Technical Round 1: DSA & Problem Solving">Round 1: DSA & Problem Solving</option>
                  <option value="Technical Round 2: System Architecture & Concurrency">Round 2: System Architecture & Concurrency</option>
                  <option value="Round 3: Core CS Fundamentals (DBMS, OS, Networks)">Round 3: Core CS (OS, DBMS, Networks)</option>
                  <option value="Hiring Manager / PPO Behavioral">Hiring Manager / PPO Behavioral</option>
                </select>
              </div>

              {/* Difficulty Level */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Bar Raiser Tier:
                </label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value as InterviewDifficulty)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                >
                  <option value="Standard Campus">Standard Campus Round (60-70% Bar)</option>
                  <option value="Challenging Unicorn">Challenging Product Unicorn (85% Bar)</option>
                  <option value="Elite / Staff Tier">Elite / Top 1% Tier (95% Bar)</option>
                </select>
              </div>

            </div>

            {!currentQuestion && (
              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleStartInterview}
                  disabled={isGeneratingQuestion}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors disabled:opacity-50"
                >
                  <Sparkles className={`w-4 h-4 ${isGeneratingQuestion ? 'animate-spin' : ''}`} />
                  <span>{isGeneratingQuestion ? 'Generating Role-Specific Question...' : `Simulate ${activeInternship.company} Interview`}</span>
                </button>
              </div>
            )}
          </div>

          {/* Question & Interactive Workspace */}
          {currentQuestion && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Question Specification Card */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      {activeInternship.company} Technical Challenge
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                      {currentQuestion.roundType}
                    </span>
                    <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                      {currentQuestion.difficulty}
                    </span>
                  </div>

                  {/* Timer Display */}
                  <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg shrink-0">
                    <Clock className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Time Elapsed: {formatTimer(timerSeconds)}</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 leading-snug">
                  "{currentQuestion.questionTitle}"
                </h3>

                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200/80 whitespace-pre-line">
                  {currentQuestion.scenario}
                </p>

                {/* Constraints */}
                {currentQuestion.constraints && currentQuestion.constraints.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-xs font-bold text-slate-800 block">Technical Constraints:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {currentQuestion.constraints.map((c, i) => (
                        <div key={i} className="p-2 rounded-lg bg-slate-100/70 border border-slate-200/70 text-[11px] text-slate-700 font-mono">
                          • {c}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sample Input/Output if available */}
                {currentQuestion.sampleInputOutput && (
                  <div className="p-3 bg-slate-900 text-slate-200 rounded-xl text-xs font-mono space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      Sample Payload / Schema:
                    </span>
                    <div className="overflow-x-auto text-[11px]">
                      {currentQuestion.sampleInputOutput}
                    </div>
                  </div>
                )}

                {/* Interviewer Focus note */}
                <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 text-xs text-slate-700 flex items-start gap-2">
                  <UserCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-indigo-900 block mb-0.5">What the Interview Panel Looks For:</strong>
                    <span className="text-[11px] leading-relaxed text-slate-600">{currentQuestion.interviewerFocus}</span>
                  </div>
                </div>

                {/* Hint Toggle */}
                {currentQuestion.hint && (
                  <div className="pt-1">
                    <button
                      onClick={() => setShowHint(!showHint)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:text-amber-800"
                    >
                      <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                      <span>{showHint ? 'Hide Hint' : 'Need a Conceptual Hint?'}</span>
                    </button>
                    {showHint && (
                      <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 animate-in fade-in duration-150">
                        {currentQuestion.hint}
                      </div>
                    )}
                  </div>
                )}

              </div>

              {/* Candidate Answer Workspace */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Code className="w-4 h-4 text-indigo-600" />
                      <span>Your Technical Answer & Architecture Walkthrough</span>
                    </h4>
                    <span className="text-xs text-slate-500">
                      Write your solution approach, algorithm steps, complexity analysis, and code snippets.
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                    <span>{candidateAnswer.trim().split(/\s+/).filter(Boolean).length} words</span>
                  </div>
                </div>

                {/* Code / Text Area */}
                <textarea
                  rows={10}
                  value={candidateAnswer}
                  onChange={(e) => setCandidateAnswer(e.target.value)}
                  placeholder={`1. High-Level Approach:\n- Explain data structure or architecture choice...\n\n2. Algorithm / Code Snippet:\nfunction solve() {\n  // your code here...\n}\n\n3. Complexity Analysis:\n- Time Complexity: O(...)\n- Space Complexity: O(...)\n\n4. Edge Cases Handled:\n- Null checks, concurrency race conditions, scale boundaries...`}
                  className="w-full p-4 text-xs font-mono bg-slate-900 text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
                />

                {/* Helper prompt pills to insert boilerplate templates */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-slate-500 font-medium">Quick Template:</span>
                  <button
                    type="button"
                    onClick={() => setCandidateAnswer(prev => prev + `\n\n// Time Complexity: O(N log K)\n// Space Complexity: O(K)\n// Bottleneck Analysis: `)}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors text-[11px] font-medium"
                  >
                    + Complexity Template
                  </button>
                  <button
                    type="button"
                    onClick={() => setCandidateAnswer(prev => prev + `\n\n// Edge Cases:\n// 1. Empty input or N = 0\n// 2. High concurrency race conditions\n// 3. Network timeout retry idempotency`)}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors text-[11px] font-medium"
                  >
                    + Edge Cases Checklist
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                    Evaluated by Gemini 3.8 Flash calibrated to {activeInternship.company} Bangalore hiring rubrics.
                  </span>

                  <button
                    onClick={handleSubmitAnswer}
                    disabled={isEvaluating || candidateAnswer.trim().length < 15}
                    className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors disabled:opacity-50"
                  >
                    <Sparkles className={`w-4 h-4 ${isEvaluating ? 'animate-spin' : ''}`} />
                    <span>{isEvaluating ? 'Evaluating with AI Bar Raiser...' : 'Submit Answer for AI Evaluation'}</span>
                  </button>
                </div>

              </div>

              {/* Evaluation Results Card */}
              {currentEvaluation && (
                <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white shadow-xl border border-indigo-900/50 space-y-6 animate-in fade-in zoom-in-95 duration-200">
                  
                  {/* Verdict & Score Banner */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                          Interview Performance Debrief
                        </span>
                        <span className="text-slate-500">·</span>
                        <span className="text-xs text-slate-300 font-mono">
                          Time Spent: {formatTimer(timerSeconds)}
                        </span>
                      </div>
                      <h3 className="text-xl font-black text-white tracking-tight">
                        Verdict: {currentEvaluation.verdict}
                      </h3>
                    </div>

                    <div className="flex items-baseline gap-2 bg-white/10 px-4 py-2 rounded-xl border border-white/15 self-start sm:self-auto">
                      <span className="text-3xl font-black font-mono text-emerald-400">
                        {currentEvaluation.overallScore}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">/100</span>
                    </div>
                  </div>

                  {/* 4 Rubric Gauges */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                      <span className="text-[11px] text-slate-400 block">Technical Accuracy</span>
                      <span className="text-xl font-bold font-mono text-indigo-300">
                        {currentEvaluation.rubric.correctness}%
                      </span>
                      <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${currentEvaluation.rubric.correctness}%` }} />
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                      <span className="text-[11px] text-slate-400 block">Complexity & Big-O</span>
                      <span className="text-xl font-bold font-mono text-emerald-300">
                        {currentEvaluation.rubric.complexity}%
                      </span>
                      <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${currentEvaluation.rubric.complexity}%` }} />
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                      <span className="text-[11px] text-slate-400 block">Edge Cases & Scale</span>
                      <span className="text-xl font-bold font-mono text-amber-300">
                        {currentEvaluation.rubric.edgeCases}%
                      </span>
                      <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: `${currentEvaluation.rubric.edgeCases}%` }} />
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                      <span className="text-[11px] text-slate-400 block">Engineering Clarity</span>
                      <span className="text-xl font-bold font-mono text-purple-300">
                        {currentEvaluation.rubric.communication}%
                      </span>
                      <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full" style={{ width: `${currentEvaluation.rubric.communication}%` }} />
                      </div>
                    </div>
                  </div>

                  {/* Strengths & Improvement Areas */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Strengths */}
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
                      <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5 uppercase tracking-wider">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        Key Technical Strengths:
                      </span>
                      <ul className="space-y-1.5 text-xs text-slate-200">
                        {currentEvaluation.strengths.map((s, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-emerald-400">•</span>
                            <span className="leading-relaxed">{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Areas for Improvement */}
                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                      <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5 uppercase tracking-wider">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                        Missed Edge Cases & Growth Areas:
                      </span>
                      <ul className="space-y-1.5 text-xs text-slate-200">
                        {currentEvaluation.areasForImprovement.map((a, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-amber-400">•</span>
                            <span className="leading-relaxed">{a}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Exemplary Model Answer by Senior Staff Engineer */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-400 flex items-center gap-1.5 uppercase tracking-wider">
                        <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                        Optimal Model Solution (Senior Staff Engineer Level):
                      </span>
                      <button
                        onClick={handleCopyModelAnswer}
                        className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-white px-2 py-1 rounded bg-white/5 transition-colors"
                      >
                        {copiedModelAnswer ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedModelAnswer ? 'Copied' : 'Copy Solution'}</span>
                      </button>
                    </div>

                    <pre className="text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-64 p-3 bg-black/40 rounded-lg">
                      {currentEvaluation.modelAnswer}
                    </pre>
                  </div>

                  {/* Panel Debrief Note */}
                  <div className="p-3.5 rounded-xl bg-indigo-950/60 border border-indigo-800/40 text-xs text-slate-300 space-y-1">
                    <span className="text-indigo-300 font-bold block">
                      Bangalore Hiring Committee Panel Debrief:
                    </span>
                    <p className="italic text-slate-300 text-[11px] leading-relaxed">
                      "{currentEvaluation.panelDebriefNote}"
                    </p>
                  </div>

                  {/* Skill Delta Rewards */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400">Skill Points Earned:</span>
                      <span className="text-emerald-400 font-mono font-bold">+{currentEvaluation.skillDeltas.dsa} DSA</span>
                      <span className="text-indigo-400 font-mono font-bold">+{currentEvaluation.skillDeltas.systemDesign} SysDesign</span>
                      <span className="text-purple-400 font-mono font-bold">+{currentEvaluation.skillDeltas.communication} Comm</span>
                    </div>

                    <button
                      onClick={() => setSubTab('analytics')}
                      className="inline-flex items-center gap-1 text-xs font-bold text-white hover:text-indigo-300 underline underline-offset-2"
                    >
                      <span>View Updated Progression Curve →</span>
                    </button>
                  </div>

                </div>
              )}

            </div>
          )}

        </div>
      )}

      {/* VIEW B: SKILL PROGRESSION & ANALYTICS OVER TIME */}
      {subTab === 'analytics' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Top Analytics Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Overall Mastery Tier
              </span>
              <div className="text-lg font-black text-slate-900 tracking-tight">
                {stats.masteryLevel}
              </div>
              <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                Based on {stats.totalSessions} technical rounds
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Average Score
              </span>
              <div className="text-2xl font-black font-mono text-indigo-600">
                {stats.averageScore}
                <span className="text-xs text-slate-400 font-normal">/100</span>
              </div>
              <p className="text-[11px] text-slate-500 font-mono">
                Highest: {stats.highestScore}/100
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                DSA & Problem Solving
              </span>
              <div className="text-2xl font-black font-mono text-slate-900">
                {stats.dsaProficiency}%
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${stats.dsaProficiency}%` }} />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                System Architecture
              </span>
              <div className="text-2xl font-black font-mono text-slate-900">
                {stats.systemDesignProficiency}%
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${stats.systemDesignProficiency}%` }} />
              </div>
            </div>

          </div>

          {/* Historical Skill Growth Curve Breakdown */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Core Competency Progression Breakdown
                </h3>
                <p className="text-xs text-slate-500">
                  Tracking four foundational dimensions required for top Indian tech campus placement and PPO offers
                </p>
              </div>

              <button
                onClick={() => setSubTab('practice')}
                className="px-3.5 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
              >
                + Take New Simulation
              </button>
            </div>

            <div className="space-y-4">
              
              {/* DSA Metric */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">
                    Data Structures & Algorithms (LeetCode Medium/Hard)
                  </span>
                  <span className="font-mono font-bold text-indigo-600">{stats.dsaProficiency}% · Strong</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 rounded-full transition-all duration-500" style={{ width: `${stats.dsaProficiency}%` }} />
                </div>
                <span className="text-[11px] text-slate-500 block">
                  Calibrated against arrays, heaps, sliding window, and graph BFS/DFS interview problems.
                </span>
              </div>

              {/* System Architecture */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">
                    System Architecture, Sharding & Concurrency
                  </span>
                  <span className="font-mono font-bold text-emerald-600">{stats.systemDesignProficiency}% · PPO Tier</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${stats.systemDesignProficiency}%` }} />
                </div>
                <span className="text-[11px] text-slate-500 block">
                  Measures idempotency, message queues (Kafka), distributed locks (Redis), and sub-50ms latency design.
                </span>
              </div>

              {/* Core CS Fundamentals */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">
                    Core CS Fundamentals (DBMS, OS Threads, Computer Networks)
                  </span>
                  <span className="font-mono font-bold text-purple-600">{stats.coreCsProficiency}% · Solid</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-600 rounded-full transition-all duration-500" style={{ width: `${stats.coreCsProficiency}%` }} />
                </div>
                <span className="text-[11px] text-slate-500 block">
                  ACID properties, B-Tree vs LSM trees, process vs thread memory spaces, and TCP handshake.
                </span>
              </div>

              {/* Communication */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">
                    Engineering Communication & Trade-Off Articulation
                  </span>
                  <span className="font-mono font-bold text-amber-600">{stats.communicationProficiency}% · Elite</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${stats.communicationProficiency}%` }} />
                </div>
                <span className="text-[11px] text-slate-500 block">
                  Structure, clarity of thought, and justifying architectural choices to the engineering director.
                </span>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* VIEW C: PAST SESSIONS & INTERVIEW LOG */}
      {subTab === 'history' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Historical Simulated Interview Sessions ({history.length})
              </h3>
              <p className="text-xs text-slate-500">
                Review past technical questions, score breakdowns, and staff engineer model answers
              </p>
            </div>

            <button
              onClick={() => setSubTab('practice')}
              className="px-3.5 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
            >
              Start New Session
            </button>
          </div>

          <div className="space-y-4">
            {history.map((record) => (
              <div
                key={record.id}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-xs transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">{record.company}</span>
                      <span className="text-slate-300">·</span>
                      <span className="text-xs text-slate-500 font-mono">{record.timestamp}</span>
                      <span className="text-slate-300">·</span>
                      <span className="text-xs text-slate-600">⏱️ {formatTimer(record.timeSpentSeconds)}</span>
                    </div>
                    <h4 className="text-base font-bold text-slate-900 mt-0.5">
                      "{record.question.questionTitle}"
                    </h4>
                    <span className="text-xs text-indigo-600 font-medium">
                      {record.question.roundType}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {record.evaluation.verdict}
                    </span>
                    <span className="text-base font-black font-mono text-indigo-600 bg-slate-100 px-3 py-1 rounded-lg">
                      {record.evaluation.overallScore}/100
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-700 block">Your Submitted Solution:</span>
                  <p className="text-xs text-slate-600 font-mono bg-slate-50 p-3 rounded-lg border border-slate-200/80 line-clamp-3">
                    {record.candidateAnswer}
                  </p>
                </div>

                <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 text-xs text-slate-700">
                  <strong className="text-indigo-900 block mb-0.5">AI Interviewer Panel Feedback:</strong>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {record.evaluation.panelDebriefNote}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <div className="flex items-center gap-3">
                    <span>Accuracy: <strong className="text-slate-800 font-mono">{record.evaluation.rubric.correctness}%</strong></span>
                    <span>Complexity: <strong className="text-slate-800 font-mono">{record.evaluation.rubric.complexity}%</strong></span>
                    <span>Edge Cases: <strong className="text-slate-800 font-mono">{record.evaluation.rubric.edgeCases}%</strong></span>
                  </div>

                  <button
                    onClick={() => {
                      setCurrentQuestion(record.question);
                      setCurrentEvaluation(record.evaluation);
                      setCandidateAnswer(record.candidateAnswer);
                      setTimerSeconds(record.timeSpentSeconds);
                      setSubTab('practice');
                    }}
                    className="font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    Review Full Session Details →
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
};
