export type WorkType = 'Remote (Pan-India)' | 'Hybrid' | 'On-site';

export type IndianLocation = 
  | 'Bengaluru, Karnataka'
  | 'Hyderabad, Telangana'
  | 'Pune, Maharashtra'
  | 'Gurugram, NCR'
  | 'Noida, NCR'
  | 'Mumbai, Maharashtra'
  | 'Chennai, Tamil Nadu'
  | 'Remote (Pan-India)';

export type RoleCategory = 
  | 'Software Engineering (SDE)'
  | 'AI & Machine Learning'
  | 'Product Design (UI/UX)'
  | 'Product Management (APM)'
  | 'Data Science & Analytics'
  | 'Cloud & DevOps Engineering'
  | 'Fintech & Quant Research'
  | 'Growth & Marketing';

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  isAuthenticated: boolean;
  hasCompletedQualification: boolean;
  avatarInitials?: string;
}

export interface Internship {
  id: string;
  title: string;
  company: string;
  companyDescription: string;
  location: string;
  city: string;
  workType: WorkType;
  category: RoleCategory;
  stipend: string; // e.g. "₹65,000 / month"
  stipendNumeric: number; // e.g. 65000 for sorting
  duration: string; // e.g. "Summer 2026 (2-3 Months)" or "6-Month Semester Internship"
  term: string; // e.g. "Summer 2026" or "Jan - June 2026"
  deadline: string;
  educationRequirement: 'B.Tech / B.E. (All Branches)' | 'B.Tech CSE / IT / ECE' | 'BCA / MCA' | 'B.Des / M.Des' | 'Dual Degree / M.Tech' | 'All Students';
  applicantsCount: number;
  ppoConversionRate: string; // Pre-Placement Offer rate, e.g. "86% PPO Conversion (₹22 LPA Full-time)"
  mentor: {
    name: string;
    title: string;
    avatarInitials: string;
  };
  description: string;
  responsibilities: string[];
  requiredSkills: string[];
  preferredSkills: string[];
  perks: string[];
  featured?: boolean;
  postedDate: string;
  isRealtime?: boolean;
  liveBadge?: 'JUST POSTED' | 'LIVE INFLUX' | 'HIGH APPLICANTS' | 'FAST TRACK';
  postedMinutesAgo?: number;
  liveViewersCount?: number;
}

export interface StudentProfile {
  fullName: string;
  email: string;
  phone: string;
  university: string; // e.g. "BITS Pilani", "IIT Bombay", "NIT Trichy", "VIT Vellore"
  degree: string; // e.g. "B.Tech in Computer Science"
  major: string;
  graduationYear: string; // e.g. "2027"
  cgpa: string; // e.g. "8.85 / 10 CGPA"
  currentCity: string;
  workPreference: WorkType | 'Any';
  targetRoles: string[];
  skills: string[];
  bio: string;
  projects: {
    title: string;
    description: string;
    technologies: string[];
    link?: string;
  }[];
  experience: {
    role: string;
    company: string;
    duration: string;
    highlights: string;
  }[];
  hackathonsOrAwards?: string[];
  resumeText?: string;
}

export interface MatchRecommendation {
  internshipId: string;
  matchScore: number; // 0 to 100
  matchTier: 'Strong Match' | 'Good Match' | 'Growth Match';
  whyYouFit: string;
  matchedSkills: string[];
  missingSkills: string[];
  personalizedPitch: string;
  suggestedAction: string;
}

export interface AiMatchAnalysisResult {
  profileSummary: string;
  readinessScore: number;
  topStrengths: string[];
  priorityGrowthAreas: string[];
  recommendations: MatchRecommendation[];
  careerTips: string[];
}

export interface TrackedMilestone {
  id: string;
  title: string;
  completed: boolean;
  category: 'prep' | 'assessment' | 'interview' | 'followup';
  aiTip?: string;
}

export interface ApplicationNoteEntry {
  id: string;
  timestamp: string;
  text: string;
  aiCoachReply?: string;
}

export interface ApplicationItem {
  id: string;
  internshipId: string;
  company: string;
  title: string;
  location: string;
  stipend: string;
  appliedDate: string;
  status: 'Draft' | 'Submitted' | 'Under Review' | 'Technical Round / OA' | 'Interview Scheduled' | 'PPO / Offer Extended' | 'Archived';
  tailoredNote: string;
  interviewDate?: string;
  oaDeadline?: string;
  isRealtimeTracked?: boolean;
  aiReadinessScore?: number;
  aiNextAction?: string;
  aiUrgency?: 'High' | 'Medium' | 'Normal';
  milestones?: TrackedMilestone[];
  notesLog?: ApplicationNoteEntry[];
}

export interface PriorityActionItem {
  applicationId: string;
  company: string;
  title: string;
  urgency: 'High' | 'Medium' | 'Normal';
  headline: string;
  actionStep: string;
  deadlineNotice?: string;
}

export interface RealtimePipelineAuditResult {
  overallHealth: 'Excellent' | 'On Track' | 'Needs Attention';
  pipelineHealthScore: number; // 0-100
  predictedPpoLikelihood: string; // e.g. "82% likelihood across current pipeline"
  activeApplicationsCount: number;
  highPriorityCount: number;
  weeklyStrategy: string;
  urgentActionItems: PriorityActionItem[];
  perApplicationInsights: {
    applicationId: string;
    nextImmediateAction: string;
    aiCoachNote: string;
    readinessScore: number;
    recommendedMilestones: string[];
  }[];
}

export interface RealtimeJobAlert {
  id: string;
  internship: Internship;
  matchScore: number;
  timestamp: string;
}

export type InterviewRoundType = 
  | 'Technical Round 1: DSA & Problem Solving' 
  | 'Technical Round 2: System Architecture & Concurrency' 
  | 'Round 3: Core CS Fundamentals (DBMS, OS, Networks)' 
  | 'Hiring Manager / PPO Behavioral';

export type InterviewDifficulty = 'Standard Campus' | 'Challenging Unicorn' | 'Elite / Staff Tier';

export interface GeneratedInterviewQuestion {
  id: string;
  questionTitle: string;
  roundType: InterviewRoundType;
  difficulty: InterviewDifficulty;
  scenario: string;
  constraints: string[];
  hint?: string;
  interviewerFocus: string;
  sampleInputOutput?: string;
}

export interface InterviewRubric {
  correctness: number; // 0-100
  complexity: number; // 0-100
  edgeCases: number; // 0-100
  communication: number; // 0-100
}

export interface InterviewAnswerEvaluation {
  overallScore: number;
  verdict: 'Strong Hire (PPO Track)' | 'Hire' | 'Borderline / Needs Work' | 'No Hire';
  rubric: InterviewRubric;
  strengths: string[];
  areasForImprovement: string[];
  modelAnswer: string;
  panelDebriefNote: string;
  skillDeltas: {
    dsa: number;
    systemDesign: number;
    coreCS: number;
    communication: number;
  };
}

export interface InterviewSessionRecord {
  id: string;
  timestamp: string;
  internshipId: string;
  company: string;
  role: string;
  question: GeneratedInterviewQuestion;
  candidateAnswer: string;
  timeSpentSeconds: number;
  evaluation: InterviewAnswerEvaluation;
}

export interface SkillProgressionStats {
  totalSessions: number;
  averageScore: number;
  highestScore: number;
  dsaProficiency: number; // 0-100
  systemDesignProficiency: number; // 0-100
  coreCsProficiency: number; // 0-100
  communicationProficiency: number; // 0-100
  masteryLevel: 'Emerging Candidate' | 'Competitive Candidate' | 'PPO Ready' | 'Top 1% Campus Elite';
}

