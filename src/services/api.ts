import { 
  StudentProfile, Internship, AiMatchAnalysisResult, 
  GeneratedInterviewQuestion, InterviewAnswerEvaluation, 
  InterviewRoundType, InterviewDifficulty 
} from '../types';

export async function fetchAiMatchRecommendations(
  profile: StudentProfile,
  internships: Internship[]
): Promise<AiMatchAnalysisResult> {
  const response = await fetch('/api/ai/match-recommendations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profile, internships })
  });

  if (!response.ok) {
    throw new Error(`AI matching failed: ${response.statusText}`);
  }

  return response.json();
}

export async function fetchSingleInternshipAudit(
  profile: StudentProfile,
  internship: Internship
) {
  const response = await fetch('/api/ai/analyze-internship', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profile, internship })
  });

  if (!response.ok) {
    throw new Error(`Audit failed: ${response.statusText}`);
  }

  return response.json();
}

export async function fetchGeneratedCoverLetter(
  profile: StudentProfile,
  internship: Internship
): Promise<{ subject: string; letterText: string }> {
  const response = await fetch('/api/ai/generate-cover-letter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profile, internship })
  });

  if (!response.ok) {
    throw new Error(`Cover letter generation failed: ${response.statusText}`);
  }

  return response.json();
}

export async function fetchPolishedBullet(
  roughBullet: string,
  targetRole: string
): Promise<{ improvedBullets: { version: string; text: string; keyChange: string }[] }> {
  const response = await fetch('/api/ai/polish-bullet', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ roughBullet, targetRole })
  });

  if (!response.ok) {
    throw new Error(`Bullet polish failed: ${response.statusText}`);
  }

  return response.json();
}

export async function fetchRealtimePipelineAudit(
  profile: StudentProfile,
  applications: any[],
  internships: Internship[]
) {
  const response = await fetch('/api/ai/track-copilot', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profile, applications, internships })
  });

  if (!response.ok) {
    throw new Error(`Pipeline audit failed: ${response.statusText}`);
  }

  return response.json();
}

export async function fetchCoachingNoteReply(
  noteText: string,
  company: string,
  role: string,
  status: string,
  profile: StudentProfile
): Promise<{ reply: string; suggestedAction: string }> {
  const response = await fetch('/api/ai/coaching-note', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ noteText, company, role, status, profile })
  });

  if (!response.ok) {
    throw new Error(`Coaching note failed: ${response.statusText}`);
  }

  return response.json();
}

export async function parseRawJobPostWithAi(rawText: string): Promise<Internship> {
  const response = await fetch('/api/ai/parse-job-post', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rawText })
  });

  if (!response.ok) {
    throw new Error(`AI Job post parse failed: ${response.statusText}`);
  }

  return response.json();
}

export async function fetchSimulatedInterviewQuestion(
  profile: StudentProfile,
  internship: Internship,
  roundType: InterviewRoundType,
  difficulty: InterviewDifficulty
): Promise<GeneratedInterviewQuestion> {
  const response = await fetch('/api/ai/simulate-interview-question', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profile, internship, roundType, difficulty })
  });

  if (!response.ok) {
    throw new Error(`Interview question generation failed: ${response.statusText}`);
  }

  return response.json();
}

export async function fetchInterviewAnswerEvaluation(
  profile: StudentProfile,
  internship: Internship,
  question: GeneratedInterviewQuestion,
  candidateAnswer: string,
  timeSpentSeconds: number
): Promise<InterviewAnswerEvaluation> {
  const response = await fetch('/api/ai/evaluate-interview-answer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profile, internship, question, candidateAnswer, timeSpentSeconds })
  });

  if (!response.ok) {
    throw new Error(`Interview evaluation failed: ${response.statusText}`);
  }

  return response.json();
}

