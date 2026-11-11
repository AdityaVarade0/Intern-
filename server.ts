import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Server-side Gemini Client Initialization
const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || '';
const ai = apiKey ? new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
}) : null;

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(apiKey),
    timestamp: new Date().toISOString()
  });
});

// Endpoint: AI Full Match & Qualification Recommendations for Indian Tech Internships
app.post('/api/ai/match-recommendations', async (req, res) => {
  try {
    const { profile, internships } = req.body;

    if (!profile) {
      return res.status(400).json({ error: 'Missing candidate profile data.' });
    }

    if (!internships || !Array.isArray(internships) || internships.length === 0) {
      return res.status(400).json({ error: 'Missing internships to evaluate.' });
    }

    // If Gemini API is available, generate deep personalized AI analysis
    if (ai) {
      const prompt = `You are a premier university campus recruiting director and technical talent advisor in India (specializing in hiring for top Indian tech companies, unicorns, and GCCs in Bengaluru, Hyderabad, Pune, Gurugram, Mumbai).
Analyze this Indian student / graduate candidate's qualifications, degree (B.Tech/MCA/B.Des/Dual Degree), CGPA, projects, and target roles against the listed internships.

CANDIDATE QUALIFICATIONS (INDIA CONTEXT):
Name: ${profile.fullName}
Degree: ${profile.degree} in ${profile.major}
College/University: ${profile.university} (Class of ${profile.graduationYear}, CGPA: ${profile.cgpa || 'N/A'})
Location / City Preference: ${profile.workPreference} (${profile.currentCity || 'India'})
Target Roles: ${(profile.targetRoles || []).join(', ')}
Skills: ${(profile.skills || []).join(', ')}
Bio: ${profile.bio || 'None'}
Projects: ${JSON.stringify(profile.projects || [])}
Past Internships/Experience: ${JSON.stringify(profile.experience || [])}
Hackathons & Awards: ${(profile.hackathonsOrAwards || []).join(', ')}
Resume snippet: ${profile.resumeText ? profile.resumeText.slice(0, 1500) : 'None'}

INTERNSHIPS TO EVALUATE (${internships.length} total):
${internships.map((i: any) => `
[ID: ${i.id}]
Title: ${i.title} at ${i.company}
Category: ${i.category}
Location: ${i.location} (${i.workType})
Stipend: ${i.stipend}
PPO Conversion: ${i.ppoConversionRate}
Required Skills: ${(i.requiredSkills || []).join(', ')}
Preferred Skills: ${(i.preferredSkills || []).join(', ')}
Requirements: ${i.educationRequirement}
`).join('\n')}

INSTRUCTIONS:
1. Evaluate candidate's holistic fit against each Indian internship role.
2. Calculate an honest matchScore between 30 and 98 based on skill overlap, projects (e.g. UPI apps, distributed backends, Indic ML), academic foundation, and target roles.
3. Classify tier: "Strong Match" (85-100), "Good Match" (70-84), or "Growth Match" (<70).
4. Identify 2-4 exact matched skills, 1-3 missing or desirable skills to learn.
5. Provide a punchy 2-sentence rationale for why they fit and what makes them stand out for top Indian recruiters.
6. Draft a tailored 1-sentence personalized elevator pitch sentence the candidate can use in their application note.
7. Include 1 actionable suggestion to boost their odds (e.g. practicing high-frequency LeetCode graph/tree patterns, deploying a demo on Vercel/Render, or revising DBMS/OS concepts).
8. Compute an overall candidate profile readinessScore (0-100), topStrengths (3 items), and priorityGrowthAreas (2-3 items).

OUTPUT STRICTLY VALID JSON MATCHING THIS SCHEMA:
{
  "profileSummary": "concise 2-sentence summary of candidate market positioning in the Indian tech market",
  "readinessScore": 88,
  "topStrengths": ["Strength 1", "Strength 2", "Strength 3"],
  "priorityGrowthAreas": ["Growth area 1", "Growth area 2"],
  "recommendations": [
    {
      "internshipId": "string ID matching input",
      "matchScore": 92,
      "matchTier": "Strong Match",
      "whyYouFit": "detailed reason",
      "matchedSkills": ["skill1", "skill2"],
      "missingSkills": ["skill3"],
      "personalizedPitch": "personalized pitch sentence",
      "suggestedAction": "actionable tip"
    }
  ],
  "careerTips": [
    "Tip 1 for Indian tech hiring (e.g. LeetCode/DSA, PPO conversion tips, cold-reachout strategy on LinkedIn)",
    "Tip 2",
    "Tip 3"
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        }
      });

      const responseText = response.text || '{}';
      const parsedData = JSON.parse(responseText);
      return res.json(parsedData);
    }

    // Heuristic Fallback when API key is not yet set
    const fallbackResults = generateHeuristicMatches(profile, internships);
    return res.json(fallbackResults);
  } catch (error: any) {
    console.error('Error generating AI recommendations:', error);
    try {
      const fallbackResults = generateHeuristicMatches(req.body.profile, req.body.internships);
      return res.json(fallbackResults);
    } catch (e) {
      return res.status(500).json({ error: 'Failed to process AI recommendations.' });
    }
  }
});

// Endpoint: Deep Single-Internship Audit
app.post('/api/ai/analyze-internship', async (req, res) => {
  try {
    const { profile, internship } = req.body;
    if (!profile || !internship) {
      return res.status(400).json({ error: 'Missing profile or internship.' });
    }

    if (ai) {
      const prompt = `Indian Candidate:
Name: ${profile.fullName}
Degree: ${profile.degree} in ${profile.major} (${profile.university}, CGPA: ${profile.cgpa || '8.5+'})
Skills: ${(profile.skills || []).join(', ')}
Projects: ${JSON.stringify(profile.projects || [])}
Experience: ${JSON.stringify(profile.experience || [])}

Target Internship in India:
${internship.title} at ${internship.company} (${internship.location})
Category: ${internship.category}
Stipend: ${internship.stipend}
PPO Conversion: ${internship.ppoConversionRate}
Required: ${(internship.requiredSkills || []).join(', ')}
Preferred: ${(internship.preferredSkills || []).join(', ')}
Responsibilities: ${(internship.responsibilities || []).join('; ')}

Perform a deep qualification audit tailored to Indian campus and off-campus hiring.
Output strictly JSON:
{
  "fitScore": 91,
  "matchLevel": "Strong Fit for PPO Track",
  "matchedHighlights": ["Specific strength 1", "Specific strength 2", "Specific strength 3"],
  "skillGaps": ["Area to review or learn 1", "Area 2"],
  "applicationPitch": "A high-impact 3-sentence application pitch specifically connecting their past work to ${internship.company}'s engineering challenges in India.",
  "likelyInterviewQuestions": [
    {
      "question": "Realistic Online Assessment (OA) / Technical interview question for ${internship.company}",
      "whatInterviewerWants": "What the technical interviewer in India is looking for",
      "recommendedAnswerStrategy": "How this candidate should frame their response using their background"
    },
    {
      "question": "System design or behavioral question",
      "whatInterviewerWants": "Context",
      "recommendedAnswerStrategy": "Strategy"
    }
  ],
  "preparationChecklist": [
    "Step 1 to prepare for OA / Round 1",
    "Step 2 to prepare for System/Design round",
    "Step 3 to prepare for Managerial / HR PPO discussion"
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        }
      });

      return res.json(JSON.parse(response.text || '{}'));
    }

    // Heuristic fallback
    return res.json({
      fitScore: 88,
      matchLevel: 'Strong Fit for PPO Track',
      matchedHighlights: [
        `Strong technical alignment with ${profile.skills.slice(0, 3).join(', ')}`,
        `Solid academic record from ${profile.university} with ${profile.cgpa || 'strong CGPA'}`,
        `Demonstrated initiative with practical projects like ${profile.projects?.[0]?.title || 'full-stack applications'}`
      ],
      skillGaps: ['Review high-concurrency system architecture and LeetCode medium DP / graph problems'],
      applicationPitch: `As a ${profile.degree} student at ${profile.university} skilled in ${profile.skills.slice(0, 3).join(', ')}, I am keen to apply my hands-on project experience to ${internship.company}'s engineering scale in ${internship.city || 'India'} this ${internship.term}.`,
      likelyInterviewQuestions: [
        {
          question: `Can you walk us through the database optimization and caching choices you implemented in your recent project?`,
          whatInterviewerWants: 'Evaluation of index design, concurrency, and real-world latency considerations',
          recommendedAnswerStrategy: 'Detail the bottleneck identified, how you used caching or schema tuning, and the quantifiable latency reduction.'
        },
        {
          question: `How would you handle sudden peak spikes in traffic during festive or flash sales?`,
          whatInterviewerWants: 'Knowledge of message queues (Kafka/RabbitMQ), rate-limiting, and graceful degradation',
          recommendedAnswerStrategy: 'Discuss asynchronous task queuing, idempotent APIs, and circuit breakers.'
        }
      ],
      preparationChecklist: [
        `Brush up on Core CS fundamentals (OS memory management, DBMS normalization, ACID properties)`,
        `Review 20 most frequent LeetCode questions for ${internship.company}`,
        `Prepare a 2-minute walkthrough of ${profile.projects?.[0]?.title || 'your key project'} focusing on architectural decisions`
      ]
    });
  } catch (error: any) {
    console.error('Error analyzing internship fit:', error);
    return res.status(500).json({ error: 'Failed to analyze internship fit.' });
  }
});

// Endpoint: Generate Tailored Cover Letter for Indian Tech Companies
app.post('/api/ai/generate-cover-letter', async (req, res) => {
  try {
    const { profile, internship } = req.body;
    if (!profile || !internship) {
      return res.status(400).json({ error: 'Missing profile or internship.' });
    }

    if (ai) {
      const prompt = `Write an authentic, highly professional 3-paragraph internship cover letter for ${profile.fullName} applying for the ${internship.title} role at ${internship.company} (${internship.location}).
Candidate Details:
- College/University: ${profile.university}, Degree: ${profile.degree} in ${profile.major} (CGPA: ${profile.cgpa || '8.5+'})
- Key Skills: ${(profile.skills || []).join(', ')}
- Projects: ${(profile.projects || []).map((p: any) => `${p.title}: ${p.description}`).join('; ')}
- Achievements: ${(profile.hackathonsOrAwards || []).join(', ') || 'Active competitive programming and hackathon finalist'}

Internship Details:
- Company: ${internship.company} (${internship.companyDescription})
- Role: ${internship.title}
- Term: ${internship.term}

Tone: Professional, ambitious, articulate, and tailored to Indian engineering managers. Highlight concrete problem-solving skills and genuine passion for ${internship.company}'s product.

Output strictly JSON:
{
  "subject": "Application for ${internship.title} — ${profile.fullName} (${profile.university})",
  "letterText": "Full 3-paragraph cover letter formatted with clean line breaks."
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        }
      });

      return res.json(JSON.parse(response.text || '{}'));
    }

    // Heuristic Fallback
    const letter = `Dear Hiring Team at ${internship.company},

I am writing to express my enthusiastic interest in the ${internship.title} opportunity for ${internship.term}. As a student at ${profile.university} pursuing a ${profile.degree} (CGPA: ${profile.cgpa || '8.8/10'}), I have dedicated my academic and personal projects to mastering ${profile.skills.slice(0, 4).join(', ')}. I have closely followed ${internship.company}'s engineering scale in India, and I am inspired by your team's focus on high-reliability, developer-centric products.

Through my hands-on work developing "${profile.projects?.[0]?.title || 'high-scale applications'}", I built end-to-end features, designed performant database schemas, and resolved real-world latency bottlenecks. This experience taught me how to take ownership of complex technical challenges, quickly ramp up on unfamiliar codebases, and write clean, thoroughly tested code. I am eager to contribute this same technical discipline to ${internship.company}.

I would be thrilled to bring my passion and engineering background to your team this ${internship.term}, with the goal of contributing meaningfully to your product roadmap and earning a Pre-Placement Offer (PPO). Thank you for your time and consideration, and I look forward to the opportunity to discuss my qualifications further.

Warm regards,
${profile.fullName}
${profile.email} | ${profile.phone || '+91 98201 44521'}
${profile.university}`;

    return res.json({
      subject: `Application for ${internship.title} — ${profile.fullName} (${profile.university})`,
      letterText: letter
    });
  } catch (error: any) {
    console.error('Error generating cover letter:', error);
    return res.status(500).json({ error: 'Failed to generate cover letter.' });
  }
});

// Endpoint: AI Resume Bullet Polisher
app.post('/api/ai/polish-bullet', async (req, res) => {
  try {
    const { roughBullet, targetRole } = req.body;
    if (!roughBullet) {
      return res.status(400).json({ error: 'Missing bullet point to polish.' });
    }

    if (ai) {
      const prompt = `Act as an expert technical resume coach for top Indian tech companies (Razorpay, Swiggy, Google India, Microsoft IDC, Flipkart, CRED).
Transform this rough student resume bullet point into 3 high-impact, quantifiable, action-verb-driven options tailored for an Indian ${targetRole || 'Software Engineering'} internship.

Rough Bullet:
"${roughBullet}"

Output strictly JSON:
{
  "improvedBullets": [
    {
      "version": "Metric & Scale Focused",
      "text": "Engineered...",
      "keyChange": "Added quantifiable outcome, latency improvement, and scale"
    },
    {
      "version": "Technical Depth & Architecture",
      "text": "Architected...",
      "keyChange": "Highlighted technical stack, design patterns, and reliability"
    },
    {
      "version": "Problem-Solving & Efficiency",
      "text": "Spearheaded...",
      "keyChange": "Emphasized algorithmic optimization and measurable user impact"
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        }
      });

      return res.json(JSON.parse(response.text || '{}'));
    }

    // Heuristic fallback
    return res.json({
      improvedBullets: [
        {
          version: 'Metric & Scale Focused',
          text: `Engineered scalable microservices for ${roughBullet.slice(0, 45)}, cutting peak p99 API latency by 38% and supporting 10,000+ daily concurrent requests.`,
          keyChange: 'Integrated concrete latency and concurrent scale metrics'
        },
        {
          version: 'Technical Depth & Architecture',
          text: `Architected distributed pipeline and normalized database schemas with Redis caching, accelerating query response times by 3.2x.`,
          keyChange: 'Emphasized technical stack and architectural depth'
        },
        {
          version: 'Problem-Solving & Efficiency',
          text: `Spearheaded end-to-end implementation of automated validation pipelines, reducing manual verification time by 40%.`,
          keyChange: 'Highlighted ownership and operational efficiency'
        }
      ]
    });
  } catch (error: any) {
    console.error('Error polishing bullet:', error);
    return res.status(500).json({ error: 'Failed to polish bullet.' });
  }
});

// Endpoint: Real-Time AI Pipeline Audit & Application Copilot
app.post('/api/ai/track-copilot', async (req, res) => {
  try {
    const { profile, applications, internships } = req.body;
    if (!profile || !applications || !Array.isArray(applications)) {
      return res.status(400).json({ error: 'Missing profile or applications array.' });
    }

    if (applications.length === 0) {
      return res.json({
        overallHealth: 'Needs Attention',
        pipelineHealthScore: 40,
        predictedPpoLikelihood: '15% (No active applications currently tracked)',
        activeApplicationsCount: 0,
        highPriorityCount: 0,
        weeklyStrategy: 'Submit at least 3-5 verified high-PPO summer internship applications this week to build early pipeline momentum.',
        urgentActionItems: [],
        perApplicationInsights: []
      });
    }

    if (ai) {
      const prompt = `You are a Chief Campus Placement Officer and Career Strategist for top Indian engineering & tech talent (specializing in top product companies & unicorns in Bengaluru, Hyderabad, Gurugram, Pune, Mumbai).
Analyze this candidate's currently tracked internship application pipeline.

CANDIDATE:
Name: ${profile.fullName}
Degree: ${profile.degree} in ${profile.major} (${profile.university}, CGPA: ${profile.cgpa || '8.5+'})
Skills: ${(profile.skills || []).join(', ')}

APPLICATIONS CURRENTLY BEING TRACKED (${applications.length} total):
${applications.map((app: any, idx: number) => `
[App #${idx + 1} - ID: ${app.id}]
Company: ${app.company}
Role: ${app.title}
Location: ${app.location}
Status: ${app.status}
Applied: ${app.appliedDate}
OA Deadline / Schedule: ${app.oaDeadline || 'Not specified'}
Interview Date: ${app.interviewDate || 'Not specified'}
Candidate Note: ${app.tailoredNote || 'None'}
User Journal/Notes: ${(app.notesLog || []).map((n: any) => n.text).join('; ') || 'None'}
`).join('\n')}

TASK:
1. Conduct a real-time assessment of pipeline health, urgency distribution, and upcoming milestones.
2. For each tracked application, prescribe:
   - nextImmediateAction: 1 highly specific, realistic next step (e.g., if OA: exact topics/algorithms to solve; if Interview: company-specific architecture/questions; if Under Review: follow-up timing and message strategy).
   - aiCoachNote: 2-sentence tactical coaching note referencing the company's hiring style in India.
   - readinessScore: 0 to 100 based on candidate fit and interview stage.
   - recommendedMilestones: 3-4 progressive action checkboxes for the student.
3. Identify top urgentActionItems that need immediate attention this week (e.g. impending OAs, prep for Round 1).
4. Compute overallHealth ("Excellent" | "On Track" | "Needs Attention"), pipelineHealthScore (0-100), predictedPpoLikelihood, and weeklyStrategy.

OUTPUT STRICTLY VALID JSON:
{
  "overallHealth": "On Track",
  "pipelineHealthScore": 86,
  "predictedPpoLikelihood": "78% likelihood of at least one Tier-1 PPO",
  "activeApplicationsCount": ${applications.length},
  "highPriorityCount": 2,
  "weeklyStrategy": "Specific 2-sentence weekly focus plan for the Indian recruitment season.",
  "urgentActionItems": [
    {
      "applicationId": "id string",
      "company": "Company name",
      "title": "Role title",
      "urgency": "High",
      "headline": "Action headline",
      "actionStep": "Specific step to take",
      "deadlineNotice": "Within 48 hours"
    }
  ],
  "perApplicationInsights": [
    {
      "applicationId": "id string",
      "nextImmediateAction": "Concrete next step",
      "aiCoachNote": "Tactical coaching advice",
      "readinessScore": 88,
      "recommendedMilestones": [
        "Milestone 1",
        "Milestone 2",
        "Milestone 3"
      ]
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        }
      });

      return res.json(JSON.parse(response.text || '{}'));
    }

    // Heuristic Fallback
    const highUrgencyCount = applications.filter(a => a.status === 'Technical Round / OA' || a.status === 'Interview Scheduled').length;
    const healthScore = Math.min(95, 60 + applications.length * 8 + (highUrgencyCount > 0 ? 15 : 0));

    return res.json({
      overallHealth: healthScore >= 80 ? 'Excellent' : healthScore >= 65 ? 'On Track' : 'Needs Attention',
      pipelineHealthScore: healthScore,
      predictedPpoLikelihood: `${Math.min(92, 45 + applications.length * 10)}% estimated PPO conversion rate across active pipeline`,
      activeApplicationsCount: applications.length,
      highPriorityCount: Math.max(1, highUrgencyCount),
      weeklyStrategy: 'Dedicate 60% of your time to coding speed on timed HackerRank/LeetCode assessments, and review core CS fundamentals (OS, DBMS, Computer Networks) before technical rounds.',
      urgentActionItems: applications.map(app => ({
        applicationId: app.id,
        company: app.company,
        title: app.title,
        urgency: (app.status === 'Technical Round / OA' || app.status === 'Interview Scheduled' ? 'High' : 'Medium') as 'High' | 'Medium',
        headline: app.status === 'Technical Round / OA' 
          ? `Complete ${app.company} Online Assessment`
          : app.status === 'Interview Scheduled'
          ? `Prepare for ${app.company} Technical Interview Round`
          : `Monitor application status with ${app.company}`,
        actionStep: app.status === 'Technical Round / OA'
          ? 'Solve 4 standard medium problems on arrays, DP, and graphs under a 60-minute timer.'
          : app.status === 'Interview Scheduled'
          ? 'Rehearse your project architecture walkthrough and explain database indexing trade-offs.'
          : 'Connect with 2 college alumni working at the company on LinkedIn with a polite note.',
        deadlineNotice: app.status === 'Technical Round / OA' ? 'Active Assessment' : 'This Week'
      })).slice(0, 3),
      perApplicationInsights: applications.map(app => ({
        applicationId: app.id,
        nextImmediateAction: app.status === 'Technical Round / OA'
          ? `Revise DSA time complexities and write clean modular code for ${app.company} OA.`
          : app.status === 'Interview Scheduled'
          ? `Review system design fundamentals and your flagship project implementation details.`
          : `Keep an eye on email inbox and prepare core CS interview cheat sheets.`,
        aiCoachNote: `Indian recruiters at ${app.company} look for proactive candidates who understand practical scalability and write production-quality code.`,
        readinessScore: app.status === 'Interview Scheduled' ? 92 : app.status === 'Technical Round / OA' ? 85 : 75,
        recommendedMilestones: [
          `Review ${app.company}'s recent technical stack and engineering blog`,
          `Complete mock assessment on HackerRank / LeetCode`,
          `Prepare 3 thoughtful questions to ask the technical interviewer`,
          `Follow up with recruiter within 4 business days`
        ]
      }))
    });
  } catch (error: any) {
    console.error('Error generating AI track copilot audit:', error);
    return res.status(500).json({ error: 'Failed to generate AI pipeline audit.' });
  }
});

// Endpoint: AI Coaching Feedback on Student Journal / Notes
app.post('/api/ai/coaching-note', async (req, res) => {
  try {
    const { noteText, company, role, status, profile } = req.body;
    if (!noteText) {
      return res.status(400).json({ error: 'Missing candidate note text.' });
    }

    if (ai) {
      const prompt = `A student candidate in India (${profile?.degree || 'B.Tech'} student at ${profile?.university || 'top engineering college'}) logged this personal note regarding their internship application for ${role} at ${company} (Current Status: ${status}):
"${noteText}"

Act as a mentor and senior engineering lead in Bengaluru. Provide an insightful, encouraging 2-sentence response evaluating what they learned, plus 1 concrete actionable recommendation for their next step.

Output strictly JSON:
{
  "reply": "2-sentence encouraging expert feedback",
  "suggestedAction": "1 concrete actionable step"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        }
      });

      return res.json(JSON.parse(response.text || '{}'));
    }

    // Heuristic Fallback
    return res.json({
      reply: `Great progress on your ${company} application. Recording key questions and technical challenges directly accelerates your retention for subsequent rounds.`,
      suggestedAction: `Review the specific concepts mentioned and document an optimized solution in your GitHub notes.`
    });
  } catch (error: any) {
    console.error('Error in AI coaching note:', error);
    return res.status(500).json({ error: 'Failed to process AI coaching note.' });
  }
});

// Endpoint: Instant AI Parsing of Raw Job Descriptions into Verified Indian Internship
app.post('/api/ai/parse-job-post', async (req, res) => {
  try {
    const { rawText } = req.body;
    if (!rawText || rawText.trim().length < 20) {
      return res.status(400).json({ error: 'Job description text is too short.' });
    }

    if (ai) {
      const prompt = `Parse this raw job description or hiring announcement into a structured Indian tech internship profile.
Raw Job Post:
"""${rawText}"""

Extract or infer realistic fields tailored to the Indian tech ecosystem (Bengaluru, Hyderabad, Gurugram, Pune, Mumbai, etc.):
- title: string
- company: string
- companyDescription: string (1 sentence)
- location: string (e.g. "Koramangala, Bengaluru", "Hitec City, Hyderabad", or "Remote (Pan-India)")
- city: string (one of: Bengaluru, Hyderabad, Pune, Gurugram, Mumbai, Chennai, Noida, Remote)
- workType: "Remote (Pan-India)" | "Hybrid" | "On-site"
- category: one of: "Software Engineering (SDE)", "AI & Machine Learning", "Product Design (UI/UX)", "Product Management (APM)", "Data Science & Analytics", "Cloud & DevOps Engineering", "Fintech & Quant Research", "Growth & Marketing"
- stipend: string in INR (e.g. "₹75,000 / month")
- stipendNumeric: number (e.g. 75000)
- duration: string (e.g. "Summer 2026 (2-3 Months)")
- term: string (e.g. "Summer 2026")
- deadline: string (e.g. "Dec 15, 2026")
- educationRequirement: one of "B.Tech / B.E. (All Branches)", "B.Tech CSE / IT / ECE", "BCA / MCA", "B.Des / M.Des", "Dual Degree / M.Tech", "All Students"
- applicantsCount: number (e.g. 18)
- ppoConversionRate: string (e.g. "85% PPO Conversion (₹20 LPA Full-time)")
- description: string (summary)
- responsibilities: array of 4 strings
- requiredSkills: array of 4-6 strings
- preferredSkills: array of 2-3 strings
- perks: array of 3-4 strings (e.g. "Cab reimbursement & free meals", "MacBook Pro M3 provided")

Output strictly JSON matching this structure.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        }
      });

      const parsed = JSON.parse(response.text || '{}');
      parsed.id = `realtime-${Date.now()}`;
      parsed.isRealtime = true;
      parsed.liveBadge = 'JUST POSTED';
      parsed.postedMinutesAgo = 1;
      parsed.liveViewersCount = Math.floor(Math.random() * 20) + 12;
      parsed.postedDate = 'Just now';
      parsed.mentor = parsed.mentor || {
        name: 'Technical Hiring Lead',
        title: 'Engineering Director',
        avatarInitials: parsed.company ? parsed.company.slice(0, 2).toUpperCase() : 'HR'
      };

      return res.json(parsed);
    }

    // Heuristic Fallback
    const fallbackId = `realtime-${Date.now()}`;
    return res.json({
      id: fallbackId,
      title: 'Full-Stack Software Development Engineer Intern',
      company: 'TechCorp India',
      companyDescription: 'Fast-growing high-scale digital platforms in India.',
      location: 'Bengaluru, Karnataka (Hybrid)',
      city: 'Bengaluru',
      workType: 'Hybrid',
      category: 'Software Engineering (SDE)',
      stipend: '₹70,000 / month',
      stipendNumeric: 70000,
      duration: 'Summer 2026 (2-3 Months)',
      term: 'Summer 2026',
      deadline: 'Dec 10, 2026',
      educationRequirement: 'B.Tech / B.E. (All Branches)',
      applicantsCount: 14,
      ppoConversionRate: '82% PPO Conversion (₹18-24 LPA Full-time)',
      description: rawText.slice(0, 200) + '...',
      responsibilities: [
        'Develop responsive web frontend components and RESTful API microservices',
        'Write high-coverage automated unit and integration tests',
        'Collaborate with product managers and senior staff engineers on release sprints',
        'Optimize database queries and cache layers to reduce response latency'
      ],
      requiredSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Data Structures & Algorithms'],
      preferredSkills: ['Docker', 'AWS/GCP', 'Redis'],
      perks: ['Pre-Placement Offer (PPO) fast track', 'MacBook provided', 'Wellness allowance'],
      isRealtime: true,
      liveBadge: 'JUST POSTED',
      postedMinutesAgo: 1,
      liveViewersCount: 19,
      postedDate: 'Just now',
      mentor: {
        name: 'Arjun Mehta',
        title: 'Engineering Manager',
        avatarInitials: 'AM'
      }
    });
  } catch (error: any) {
    console.error('Error parsing raw job post:', error);
    return res.status(500).json({ error: 'Failed to parse raw job post.' });
  }
});

// Endpoint: AI-Powered Technical Interview Question Simulator
app.post('/api/ai/simulate-interview-question', async (req, res) => {
  try {
    const { profile, internship, roundType, difficulty } = req.body;
    if (!profile || !internship) {
      return res.status(400).json({ error: 'Missing profile or internship details.' });
    }

    const selectedRound = roundType || 'Technical Round 1: DSA & Problem Solving';
    const selectedDifficulty = difficulty || 'Challenging Unicorn';

    if (ai) {
      try {
        const prompt = `You are a Principal Engineering Lead and Technical Interview Director at ${internship.company || 'Top Tech'} in ${internship.city || 'Bengaluru'}, India.
You are interviewing an Indian candidate for the ${internship.title || 'SDE Intern'} position (${internship.category || 'Software Engineering'}).
Candidate:
- Name: ${profile.fullName}
- University: ${profile.university} (${profile.degree} in ${profile.major}, CGPA: ${profile.cgpa || '8.5+'})
- Key Skills: ${(profile.skills || []).slice(0, 8).join(', ')}
- Target Role Category: ${internship.category || 'Software Engineering'}
- Required Role Skills: ${(internship.requiredSkills || []).join(', ')}

INTERVIEW SIMULATION PARAMETERS:
- Round Type: ${selectedRound}
- Difficulty Level: ${selectedDifficulty}

INSTRUCTIONS:
1. Formulate a realistic, highly engaging technical interview problem that directly mirrors the real-world engineering challenges at ${internship.company} (e.g., payment routing/idempotency for Razorpay, real-time dark store picker heuristics for Zepto, order dispatch for Swiggy, vernacular embeddings for PhonePe, low-latency credit scoring for CRED).
2. The problem must test depth of algorithmic thought, concurrency/architecture, data structures, and production trade-offs.
3. Provide clear scenario details, realistic constraints (e.g. latency budgets, peak concurrency, scale), a helpful conceptual hint, and explicit interviewer focus notes.

OUTPUT STRICTLY VALID JSON MATCHING THIS SCHEMA:
{
  "id": "q-${Date.now()}",
  "questionTitle": "Concise technical problem title",
  "roundType": "${selectedRound}",
  "difficulty": "${selectedDifficulty}",
  "scenario": "Detailed 2-paragraph technical problem description with real-world Indian tech context and concrete problem statement.",
  "constraints": [
    "Constraint 1 (e.g. Time complexity must be O(N log K))",
    "Constraint 2 (e.g. Space complexity O(K))",
    "Constraint 3 (e.g. Must handle up to 50,000 concurrent requests/sec)"
  ],
  "sampleInputOutput": "Sample input/output or API payload illustrating the problem",
  "hint": "A subtle, high-level algorithmic hint that nudges them in the right direction without spoiling the solution.",
  "interviewerFocus": "2-3 sentences explaining exactly what signals the engineering interview panel is looking for."
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          }
        });

        const parsed = JSON.parse(response.text || '{}');
        if (parsed.questionTitle) {
          return res.json(parsed);
        }
      } catch (geminiErr) {
        console.warn('Gemini question generator warning, using heuristic fallback:', geminiErr);
      }
    }

    // Resilient Fallback tailored to the company
    const company = internship.company || 'TechCorp India';
    return res.json({
      id: `q-${Date.now()}`,
      questionTitle: `${company} Distributed Idempotency & Concurrency Worker`,
      roundType: selectedRound,
      difficulty: selectedDifficulty,
      scenario: `At ${company}, our core transaction engine handles over 80,000 events/minute across Indian metro hubs. During peak flash-sales, network drops and client retries cause duplicate webhook callbacks. Design an idempotent ingestion worker that prevents double-processing while maintaining a strict sub-30ms p99 response time. Explain your choice of distributed lock, cache storage, and database persistence guarantees.`,
      constraints: [
        'Must guarantee strict exactly-once processing semantics',
        'Cache access latency must be under 5ms (Redis or Aerospike)',
        'Storage footprint per transaction key must expire after 24 hours (TTL)'
      ],
      sampleInputOutput: 'Input Payload: { "order_id": "ord_99812", "amount_paise": 650000, "status": "CAPTURED", "retry_attempt": 2 }',
      hint: 'Consider using an atomic Redis SETNX operation with a short lease TTL combined with database unique constraints on the idempotent transaction key.',
      interviewerFocus: 'The panel will assess whether you understand race conditions between parallel retries, cache failure fallbacks, and database transaction isolation levels.'
    });
  } catch (error: any) {
    console.error('Error generating interview question:', error);
    return res.status(500).json({ error: 'Failed to generate interview question.' });
  }
});

// Endpoint: AI-Powered Technical Interview Answer Evaluation & Rubric
app.post('/api/ai/evaluate-interview-answer', async (req, res) => {
  try {
    const { profile, internship, question, candidateAnswer, timeSpentSeconds } = req.body;
    if (!candidateAnswer || candidateAnswer.trim().length < 15) {
      return res.status(400).json({ error: 'Candidate answer is too brief to evaluate.' });
    }

    if (ai) {
      try {
        const prompt = `You are a Senior Staff Engineer and Interview Bar Raiser evaluating a candidate's technical interview answer for ${internship?.company || 'Top Indian Unicorn'} (${internship?.title || 'SDE Intern'}).
CANDIDATE:
Name: ${profile?.fullName || 'Candidate'} (${profile?.university || 'Engineering University'}, ${profile?.degree || 'B.Tech'})

QUESTION ASKED:
Title: ${question?.questionTitle}
Round: ${question?.roundType}
Difficulty: ${question?.difficulty}
Scenario: ${question?.scenario}
Constraints: ${(question?.constraints || []).join('; ')}

CANDIDATE'S SUBMITTED ANSWER:
"""
${candidateAnswer}
"""
Time Spent: ${timeSpentSeconds || 320} seconds

EVALUATION TASK:
Conduct a rigorous, constructive evaluation calibrated to top Indian tech hiring standards (Razorpay, Swiggy, Google IDC, Atlassian, CRED, Zepto).
1. Grade the overall score between 40 and 98.
2. Select verdict: "Strong Hire (PPO Track)" (>=88), "Hire" (75-87), "Borderline / Needs Work" (60-74), or "No Hire" (<60).
3. Score each rubric category (0-100):
   - correctness: technical accuracy, logic soundness
   - complexity: time and space complexity efficiency, O-notation analysis
   - edgeCases: handling concurrency, failure modes, nulls, boundaries
   - communication: structure, clarity, engineering reasoning
4. List 2-3 concrete strengths.
5. List 2-3 specific missed edge cases, gaps, or areas for improvement.
6. Provide an exemplary "modelAnswer": how a Staff Engineer would explain and structure the optimal solution with clean code/architecture and complexity analysis.
7. Provide a "panelDebriefNote" summarizing the interview committee's discussion in Bengaluru.
8. Calculate skill deltas (+2 to +8 points for DSA, systemDesign, coreCS, communication).

OUTPUT STRICTLY VALID JSON:
{
  "overallScore": 88,
  "verdict": "Strong Hire (PPO Track)",
  "rubric": {
    "correctness": 90,
    "complexity": 85,
    "edgeCases": 82,
    "communication": 94
  },
  "strengths": [
    "Strength 1",
    "Strength 2"
  ],
  "areasForImprovement": [
    "Area 1",
    "Area 2"
  ],
  "modelAnswer": "Full exemplary answer with optimal code, complexity, and architecture",
  "panelDebriefNote": "Summary of panel discussion and hiring recommendation",
  "skillDeltas": {
    "dsa": 5,
    "systemDesign": 6,
    "coreCS": 4,
    "communication": 5
  }
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          }
        });

        const parsed = JSON.parse(response.text || '{}');
        if (parsed.overallScore) {
          return res.json(parsed);
        }
      } catch (geminiErr) {
        console.warn('Gemini evaluation warning, using heuristic fallback:', geminiErr);
      }
    }

    // Heuristic Fallback
    const length = candidateAnswer.trim().length;
    const baseScore = Math.min(94, Math.max(65, Math.floor(length / 25) + 60));

    return res.json({
      overallScore: baseScore,
      verdict: baseScore >= 85 ? 'Strong Hire (PPO Track)' : baseScore >= 72 ? 'Hire' : 'Borderline / Needs Work',
      rubric: {
        correctness: Math.min(95, baseScore + 2),
        complexity: Math.min(95, baseScore - 2),
        edgeCases: Math.min(90, baseScore - 5),
        communication: Math.min(96, baseScore + 4)
      },
      strengths: [
        'Structured your technical approach with clear step-by-step problem decomposition',
        'Identified the core bottleneck and applied appropriate caching and data structures'
      ],
      areasForImprovement: [
        'State explicit Big-O time and space complexity at the start of your explanation',
        'Discuss distributed network partitions (e.g. what happens if the Redis master fails during write)'
      ],
      modelAnswer: `Staff Engineer Approach:
1. Architecture: Introduce an API Gateway layer that checks an idempotency key header (X-Idempotency-Key: UUID).
2. Concurrency Lock: Execute Redis SETNX 'lock:order_id' with a 30-second TTL to avoid deadlock.
3. Processing: If the key is already set, return HTTP 409 or return cached response payload.
4. Database: Wrap state mutation in a serializable SQL transaction:
   UPDATE orders SET status = 'CAPTURED' WHERE id = :id AND status != 'CAPTURED';
5. Complexity: O(1) cache lookup, O(1) indexed SQL write. Space complexity is O(K) where K is active transactions in the TTL window.`,
      panelDebriefNote: 'The candidate showed promising algorithmic intuition and clear communication. With more focus on distributed failure modes, they will be a strong contender for full-time PPO conversion.',
      skillDeltas: {
        dsa: 4,
        systemDesign: 5,
        coreCS: 3,
        communication: 5
      }
    });
  } catch (error: any) {
    console.error('Error evaluating interview answer:', error);
    return res.status(500).json({ error: 'Failed to evaluate interview answer.' });
  }
});

// Algorithmic Matchmaker Helper for Indian context
function generateHeuristicMatches(profile: any, internships: any[]) {
  const candidateSkills = (profile.skills || []).map((s: string) => s.toLowerCase());
  const candidateTargetRoles = (profile.targetRoles || []).map((r: string) => r.toLowerCase());

  const recommendations = internships.map((internship: any) => {
    let score = 60;

    // Category match
    if (candidateTargetRoles.some((tr: string) => internship.category.toLowerCase().includes(tr) || tr.includes(internship.category.toLowerCase()))) {
      score += 20;
    }

    // Skill overlap
    const required = (internship.requiredSkills || []).map((s: string) => s.toLowerCase());
    const matchedSkills = (internship.requiredSkills || []).filter((s: string) =>
      candidateSkills.some((cs: string) => cs.includes(s.toLowerCase()) || s.toLowerCase().includes(cs))
    );
    const missingSkills = (internship.requiredSkills || []).filter((s: string) => !matchedSkills.includes(s));

    const matchRatio = required.length > 0 ? matchedSkills.length / required.length : 0.5;
    score += Math.round(matchRatio * 15);

    // Location / Work preference match
    if (profile.workPreference === 'Any' || profile.workPreference === internship.workType) {
      score += 5;
    }

    // Cap score at 96
    const finalScore = Math.min(96, Math.max(50, score));
    const matchTier = finalScore >= 82 ? 'Strong Match' : finalScore >= 70 ? 'Good Match' : 'Growth Match';

    return {
      internshipId: internship.id,
      matchScore: finalScore,
      matchTier,
      whyYouFit: `Your academic background at ${profile.university} (${profile.cgpa || '8.5+ CGPA'}) and practical experience with ${matchedSkills.slice(0, 2).join(' & ') || 'core fundamentals'} match ${internship.company}'s ${internship.category} hiring bar in ${internship.city}.`,
      matchedSkills: matchedSkills.length > 0 ? matchedSkills : [internship.requiredSkills[0]],
      missingSkills: missingSkills.length > 0 ? missingSkills.slice(0, 2) : ['Kafka & High Concurrency'],
      personalizedPitch: `As a ${profile.degree} student at ${profile.university} with experience in ${matchedSkills.slice(0, 2).join(', ')}, I am excited to apply my engineering skills to ${internship.company}'s product scale in ${internship.city}.`,
      suggestedAction: missingSkills.length > 0 
        ? `Solve 10 medium graph/tree LeetCode problems and brush up on ${missingSkills[0]}.`
        : `Highlight your ${profile.projects?.[0]?.title || 'flagship project'} in your application note.`
    };
  });

  recommendations.sort((a, b) => b.matchScore - a.matchScore);

  return {
    profileSummary: `${profile.fullName} possesses a strong competitive profile from ${profile.university} with solid fundamentals in ${profile.major} and hands-on project implementation.`,
    readinessScore: 89,
    topStrengths: [
      `High academic credibility at ${profile.university} (${profile.cgpa || 'Top 10%'})`,
      `Practical full-stack and algorithmic problem-solving implementation`,
      `Versatile proficiency across ${profile.skills.slice(0, 3).join(', ')}`
    ],
    priorityGrowthAreas: [
      'Practice Online Assessment (OA) speed on LeetCode Medium/Hard DP and graph patterns',
      'Add system design notes (load balancers, caching, sharding) to project repositories'
    ],
    recommendations,
    careerTips: [
      'Apply early within 48 hours of cohort opening to be shortlisted in the first screening batch.',
      'Highlight open-source contributions and live deployed URLs (Vercel/Render) in your resume.',
      'Prepare for standard Indian tech hiring rounds: Online Assessment (DSA) → Technical Round 1 → Technical Round 2 → Hiring Manager / HR PPO discussion.'
    ]
  };
}

// Development or Production static serving
async function setupServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    try {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
      console.log('Vite middleware mounted in development mode.');
    } catch (e) {
      console.error('Failed to mount Vite middleware, falling back to static:', e);
      serveStaticFallback();
    }
  } else {
    serveStaticFallback();
  }

  function serveStaticFallback() {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    } else {
      app.use(express.static(__dirname));
      app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port http://0.0.0.0:${PORT}`);
  });
}

setupServer();
