import React, { useState } from 'react';
import { 
  X, MapPin, DollarSign, Calendar, Clock, Sparkles, CheckCircle2, 
  AlertCircle, FileText, Send, UserCheck, ShieldCheck, ArrowRight, Loader2, Copy, Check, TrendingUp
} from 'lucide-react';
import { Internship, StudentProfile, MatchRecommendation } from '../types';
import { fetchSingleInternshipAudit, fetchGeneratedCoverLetter } from '../services/api';

interface InternshipDetailModalProps {
  internship: Internship | null;
  onClose: () => void;
  profile: StudentProfile;
  matchInfo?: MatchRecommendation;
  onApply: (internship: Internship, note: string) => void;
  isApplied: boolean;
  isTracked?: boolean;
  onTrackWithAi?: (internship: Internship) => void;
}

export const InternshipDetailModal: React.FC<InternshipDetailModalProps> = ({
  internship,
  onClose,
  profile,
  matchInfo,
  onApply,
  isApplied,
  isTracked,
  onTrackWithAi
}) => {
  if (!internship) return null;

  const [activeTab, setActiveTab] = useState<'overview' | 'aiAudit' | 'coverLetter'>('overview');
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditData, setAuditData] = useState<any | null>(null);
  
  const [isGeneratingLetter, setIsGeneratingLetter] = useState(false);
  const [coverLetter, setCoverLetter] = useState<string>('');
  const [copiedLetter, setCopiedLetter] = useState(false);

  const [applicationNote, setApplicationNote] = useState(
    matchInfo?.personalizedPitch || `I am excited to apply for the ${internship.title} position at ${internship.company} in ${internship.city}.`
  );
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleRunAudit = async () => {
    setIsAuditing(true);
    try {
      const res = await fetchSingleInternshipAudit(profile, internship);
      setAuditData(res);
      if (res.applicationPitch) {
        setApplicationNote(res.applicationPitch);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAuditing(false);
    }
  };

  const handleGenerateLetter = async () => {
    setIsGeneratingLetter(true);
    try {
      const res = await fetchGeneratedCoverLetter(profile, internship);
      setCoverLetter(res.letterText);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingLetter(false);
    }
  };

  const handleCopyLetter = () => {
    if (!coverLetter) return;
    navigator.clipboard.writeText(coverLetter);
    setCopiedLetter(true);
    setTimeout(() => setCopiedLetter(false), 2000);
  };

  const handleSubmitApplication = () => {
    onApply(internship, applicationNote);
    setSubmittedSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div 
        className="relative bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-start justify-between gap-4 bg-slate-50/70">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-white font-bold text-base flex items-center justify-center shrink-0">
              {internship.company.split(' ').map(w => w[0]).join('').slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{internship.company}</span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-indigo-600 font-medium">{internship.category}</span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-slate-600 font-medium">{internship.location}</span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">
                {internship.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Nav Tabs (Zero-pill discipline) */}
        <div className="flex border-b border-slate-200 px-6 bg-white gap-6 text-sm">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 font-semibold transition-colors border-b-2 ${
              activeTab === 'overview'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Role & PPO Overview
          </button>

          <button
            onClick={() => {
              setActiveTab('aiAudit');
              if (!auditData && !isAuditing) handleRunAudit();
            }}
            className={`py-3 font-semibold transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'aiAudit'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-indigo-500" />
            AI Fit & OA / Interview Audit
          </button>

          <button
            onClick={() => {
              setActiveTab('coverLetter');
              if (!coverLetter && !isGeneratingLetter) handleGenerateLetter();
            }}
            className={`py-3 font-semibold transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'coverLetter'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4 text-slate-400" />
            Tailored Cover Letter
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Quick Key Facts Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500 block">Monthly Stipend:</span>
                  <span className="font-bold text-slate-900 text-sm font-mono">{internship.stipend}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Location:</span>
                  <span className="font-semibold text-slate-800">{internship.location}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Cohort Duration:</span>
                  <span className="font-semibold text-slate-800">{internship.duration}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">PPO Full-Time Conversion:</span>
                  <span className="font-bold text-emerald-700">{internship.ppoConversionRate}</span>
                </div>
              </div>

              {/* Mentor Spotlight Card */}
              <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/50 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                    {internship.mentor.avatarInitials}
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-indigo-700 uppercase tracking-wider block">Assigned Technical Mentor</span>
                    <h4 className="text-sm font-bold text-slate-900">{internship.mentor.name}</h4>
                    <p className="text-xs text-slate-600">{internship.mentor.title}</p>
                  </div>
                </div>
                <div className="text-right text-xs text-slate-500 hidden sm:block">
                  <span className="font-medium text-slate-700">Weekly 1-on-1 Sprints</span>
                  <span className="block text-[11px]">Direct PPO performance evaluation</span>
                </div>
              </div>

              {/* About Role & Company */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">About {internship.company}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {internship.companyDescription}
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {internship.description}
                </p>
              </div>

              {/* Key Responsibilities */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Key Responsibilities</h4>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {internship.responsibilities.map((resp, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold">·</span>
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Required & Preferred Skills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">Required Skills & Education</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {internship.requiredSkills.map((skill, i) => (
                      <span key={i} className="text-xs font-medium text-slate-800 bg-slate-100 px-2.5 py-1 rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">Preferred Tech / Bonus Experience</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {internship.preferredSkills.map((skill, i) => (
                      <span key={i} className="text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Perks */}
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Intern Benefits & Perks</h4>
                <div className="flex flex-wrap gap-2 text-xs text-slate-600">
                  {internship.perks.map((perk, i) => (
                    <span key={i} className="flex items-center gap-1 bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded border border-emerald-100 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      {perk}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: AI QUALIFICATION FIT & INTERVIEW AUDIT */}
          {activeTab === 'aiAudit' && (
            <div className="space-y-6">
              
              {isAuditing && (
                <div className="py-12 text-center space-y-3">
                  <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
                  <p className="text-sm font-semibold text-slate-800">
                    Gemini AI is analyzing your {profile.degree} credentials, CGPA, and code projects against {internship.title}...
                  </p>
                  <p className="text-xs text-slate-500">
                    Benchmarking candidate {profile.fullName} ({profile.university}) for Indian hiring rounds
                  </p>
                </div>
              )}

              {!isAuditing && auditData && (
                <div className="space-y-5">
                  
                  {/* Match Score Banner */}
                  <div className="p-4 rounded-xl bg-slate-900 text-white flex items-center justify-between">
                    <div>
                      <span className="text-xs text-indigo-300 font-medium uppercase tracking-wider">PPO Candidacy Assessment</span>
                      <h3 className="text-xl font-bold mt-0.5">{auditData.matchLevel || 'High Match'}</h3>
                      <p className="text-xs text-slate-300 mt-1">Based on {profile.degree} from {profile.university} ({profile.cgpa || '8.8 CGPA'})</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-extrabold text-indigo-400 font-mono tabular-nums">
                        {auditData.fitScore || 90}%
                      </div>
                      <span className="text-[11px] text-slate-400">Match Confidence</span>
                    </div>
                  </div>

                  {/* Strengths & Gaps Two-Column */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Strengths */}
                    <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100 space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Key Strengths for Indian Recruiter Screen
                      </h4>
                      <ul className="space-y-1.5 text-xs text-slate-700">
                        {(auditData.matchedHighlights || []).map((item: string, i: number) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-emerald-600 font-bold">✓</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Gaps */}
                    <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-100 space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        Targeted Topics to Revise Before OA
                      </h4>
                      <ul className="space-y-1.5 text-xs text-slate-700">
                        {(auditData.skillGaps || []).map((gap: string, i: number) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-amber-600 font-bold">→</span>
                            <span>{gap}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>

                  {/* Tailored Application Pitch */}
                  <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                      Personalized 1-Click Elevator Pitch for {internship.company}
                    </h4>
                    <p className="text-xs text-slate-700 leading-relaxed italic bg-white p-3 rounded-lg border border-indigo-100">
                      "{auditData.applicationPitch}"
                    </p>
                    <button
                      onClick={() => setApplicationNote(auditData.applicationPitch)}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                      Use as my application note ↓
                    </button>
                  </div>

                  {/* Expected Interview & OA Questions */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                      Expected OA / Interview Questions for {internship.company}
                    </h4>
                    <div className="space-y-3">
                      {(auditData.likelyInterviewQuestions || []).map((q: any, i: number) => (
                        <div key={i} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2 text-xs">
                          <p className="font-bold text-slate-900">
                            Q{i + 1}: {q.question}
                          </p>
                          <div className="text-slate-600">
                            <span className="font-semibold text-slate-700">Recruiter Expectations: </span>
                            {q.whatInterviewerWants}
                          </div>
                          <div className="p-2.5 rounded bg-white border border-slate-200 text-slate-700">
                            <span className="font-semibold text-indigo-600">Recommended Framing: </span>
                            {q.recommendedAnswerStrategy}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

            </div>
          )}

          {/* TAB 3: TAILORED COVER LETTER */}
          {activeTab === 'coverLetter' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">AI Tailored Pitch Letter for Indian Recruiters</h4>
                  <p className="text-xs text-slate-500">Customized specifically for {internship.company} referencing your {profile.degree} and projects</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleGenerateLetter}
                    disabled={isGeneratingLetter}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors disabled:opacity-50"
                  >
                    Regenerate
                  </button>
                  <button
                    onClick={handleCopyLetter}
                    disabled={!coverLetter}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {copiedLetter ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLetter ? 'Copied' : 'Copy Letter'}</span>
                  </button>
                </div>
              </div>

              {isGeneratingLetter ? (
                <div className="py-12 text-center space-y-3 bg-slate-50 rounded-xl border border-slate-200">
                  <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
                  <p className="text-sm font-semibold text-slate-800">
                    Drafting personalized cover letter for {internship.company}...
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 font-sans text-xs text-slate-800 whitespace-pre-line leading-relaxed">
                  {coverLetter}
                </div>
              )}
            </div>
          )}

          {/* Application Submission Block */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Application Note / Pitch to {internship.company}
              </span>
              <span className="text-[11px] text-slate-500">
                Applying as: <strong className="text-slate-800">{profile.fullName} ({profile.university})</strong>
              </span>
            </div>

            <textarea
              value={applicationNote}
              onChange={(e) => setApplicationNote(e.target.value)}
              rows={3}
              placeholder="Write a brief personal note or paste the AI pitch above..."
              className="w-full text-xs p-3 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
            />

            {submittedSuccess ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Application submitted to {internship.company}! Tracked in your "Applications" pipeline.</span>
              </div>
            ) : isApplied ? (
              <div className="p-3 bg-slate-100 rounded-lg text-slate-700 text-xs font-semibold flex items-center justify-between">
                <span>Already applied to this cohort.</span>
                <span className="text-indigo-600 font-medium">Tracked in Applications Tab</span>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  Your profile qualifications will be routed directly to {internship.company}'s campus recruiter.
                </span>
                
                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  {!isTracked && onTrackWithAi && (
                    <button
                      type="button"
                      onClick={() => onTrackWithAi(internship)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-indigo-700 bg-white hover:bg-indigo-50 border border-indigo-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Track with AI</span>
                    </button>
                  )}

                  <button
                    onClick={handleSubmitApplication}
                    className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit & Track</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
