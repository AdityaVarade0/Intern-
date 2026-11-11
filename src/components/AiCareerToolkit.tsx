import React, { useState } from 'react';
import { 
  Sparkles, FileText, Wand2, MessageSquare, Copy, Check, 
  ArrowRight, Loader2, CheckCircle2, ChevronRight 
} from 'lucide-react';
import { StudentProfile, Internship } from '../types';
import { fetchGeneratedCoverLetter, fetchPolishedBullet } from '../services/api';
import { AiInterviewSimulator } from './AiInterviewSimulator';

interface AiCareerToolkitProps {
  profile: StudentProfile;
  internships: Internship[];
  onOpenProfileDrawer: () => void;
}

export const AiCareerToolkit: React.FC<AiCareerToolkitProps> = ({
  profile,
  internships,
  onOpenProfileDrawer
}) => {
  const [activeTool, setActiveTool] = useState<'coverLetter' | 'bulletPolisher' | 'interviewPrep'>('coverLetter');

  // Cover Letter Tool State
  const [selectedInternshipId, setSelectedInternshipId] = useState<string>(internships[0]?.id || '');
  const [customCompany, setCustomCompany] = useState('');
  const [customRole, setCustomRole] = useState('');
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [isGeneratingLetter, setIsGeneratingLetter] = useState(false);
  const [copiedLetter, setCopiedLetter] = useState(false);

  // Resume Bullet Polisher State
  const [roughBullet, setRoughBullet] = useState(
    'Built a full stack web app with React and Node to help college students split hostel and mess bills with UPI'
  );
  const [targetRole, setTargetRole] = useState('Software Engineering (SDE)');
  const [polishedBullets, setPolishedBullets] = useState<any[]>([]);
  const [isPolishing, setIsPolishing] = useState(false);
  const [copiedBulletIdx, setCopiedBulletIdx] = useState<number | null>(null);

  const handleGenerateCoverLetter = async () => {
    setIsGeneratingLetter(true);
    try {
      const targetInternship = internships.find(i => i.id === selectedInternshipId) || {
        ...internships[0],
        company: customCompany || 'Swiggy Labs',
        title: customRole || 'SDE Intern',
        location: 'Bengaluru'
      };

      const res = await fetchGeneratedCoverLetter(profile, targetInternship);
      setGeneratedLetter(res.letterText);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingLetter(false);
    }
  };

  const handlePolishBullet = async () => {
    setIsPolishing(true);
    try {
      const res = await fetchPolishedBullet(roughBullet, targetRole);
      setPolishedBullets(res.improvedBullets || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsPolishing(false);
    }
  };

  const handleCopyLetter = () => {
    if (!generatedLetter) return;
    navigator.clipboard.writeText(generatedLetter);
    setCopiedLetter(true);
    setTimeout(() => setCopiedLetter(false), 2000);
  };

  const handleCopyBullet = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedBulletIdx(idx);
    setTimeout(() => setCopiedBulletIdx(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="pb-6 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
          <Wand2 className="w-4 h-4 text-indigo-500" />
          <span>AI Career Accelerator — Indian Ecosystem</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Application & OA/Interview Intelligence Suite
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Tailored tools calibrated for Indian tech recruiting across Razorpay, Swiggy, Jio, PhonePe, CRED, and top startups.
        </p>
      </div>

      {/* Tool Navigation Tabs (Zero-pill discipline) */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTool('coverLetter')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeTool === 'coverLetter'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>AI Indian Tech Cover Letter</span>
        </button>

        <button
          onClick={() => {
            setActiveTool('bulletPolisher');
            if (polishedBullets.length === 0 && !isPolishing) handlePolishBullet();
          }}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeTool === 'bulletPolisher'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Resume Bullet Polisher</span>
        </button>

        <button
          onClick={() => setActiveTool('interviewPrep')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeTool === 'interviewPrep'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>AI Interview Prep & Simulator</span>
        </button>
      </div>

      {/* TOOL 1: COVER LETTER GENERATOR */}
      {activeTool === 'coverLetter' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Form (5 cols) */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-5">
            <h3 className="text-base font-bold text-slate-900">Target Role Parameters</h3>
            
            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-700 block">
                Select from Active Indian Cohorts:
              </label>
              <select
                value={selectedInternshipId}
                onChange={(e) => setSelectedInternshipId(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
              >
                {internships.map(i => (
                  <option key={i.id} value={i.id}>
                    {i.title} — {i.company} ({i.location.split(',')[0]})
                  </option>
                ))}
              </select>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-600 space-y-1">
              <span className="font-semibold text-slate-800 block">Candidate Source Data:</span>
              <p>Name: {profile.fullName} ({profile.university})</p>
              <p>Degree: {profile.degree} ({profile.cgpa || '8.8 CGPA'})</p>
              <p>Flagship Project: {profile.projects[0]?.title || 'SplitPay UPI'}</p>
              <button 
                onClick={onOpenProfileDrawer}
                className="text-indigo-600 font-semibold hover:underline pt-1 block"
              >
                Update Qualifications →
              </button>
            </div>

            <button
              onClick={handleGenerateCoverLetter}
              disabled={isGeneratingLetter}
              className="w-full py-2.5 px-4 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isGeneratingLetter ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>{isGeneratingLetter ? 'Drafting with Gemini AI...' : 'Generate Pitch Letter'}</span>
            </button>
          </div>

          {/* Right Preview (7 cols) */}
          <div className="lg:col-span-7 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-base font-bold text-slate-900">Generated Cover Letter</h3>
                <span className="text-xs text-slate-500">Ready to send to Indian engineering recruiter</span>
              </div>
              
              <button
                onClick={handleCopyLetter}
                disabled={!generatedLetter}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-50"
              >
                {copiedLetter ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLetter ? 'Copied to Clipboard' : 'Copy Text'}</span>
              </button>
            </div>

            {isGeneratingLetter ? (
              <div className="py-20 text-center space-y-3">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
                <p className="text-xs text-slate-600">Drafting 3 structured paragraphs referencing your Indian university and projects...</p>
              </div>
            ) : generatedLetter ? (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-sans text-slate-800 leading-relaxed whitespace-pre-line">
                {generatedLetter}
              </div>
            ) : (
              <div className="py-20 text-center space-y-2 text-slate-400">
                <FileText className="w-10 h-10 mx-auto text-slate-300" />
                <p className="text-xs font-medium text-slate-500">
                  Click "Generate Pitch Letter" to draft an impactful pitch letter.
                </p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* TOOL 2: RESUME BULLET POLISHER */}
      {activeTool === 'bulletPolisher' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Input (5 cols) */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-5">
            <h3 className="text-base font-bold text-slate-900">Input Rough Bullet Point</h3>
            
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">
                Target Role Discipline:
              </label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Software Engineering (SDE)">Software Engineering (SDE)</option>
                <option value="AI & Machine Learning">AI & Machine Learning</option>
                <option value="Product Design (UI/UX)">Product Design (UI/UX)</option>
                <option value="Fintech & Quant Research">Fintech & Quant Research</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">
                Rough Project or College Experience Bullet:
              </label>
              <textarea
                value={roughBullet}
                onChange={(e) => setRoughBullet(e.target.value)}
                rows={4}
                className="w-full text-xs p-3 rounded-lg border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                placeholder="e.g. Worked on an app using React that helped users split hostel bills with UPI"
              />
            </div>

            <button
              onClick={handlePolishBullet}
              disabled={isPolishing || !roughBullet.trim()}
              className="w-full py-2.5 px-4 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isPolishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>{isPolishing ? 'Polishing Bullet...' : 'Rewrite with Scale & Metrics'}</span>
            </button>
          </div>

          {/* Right Results (7 cols) */}
          <div className="lg:col-span-7 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              High-Impact Resume Bullet Alternatives
            </h3>
            
            {isPolishing ? (
              <div className="py-20 text-center space-y-3">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
                <p className="text-xs text-slate-600">Rewriting with active verbs and quantifiable high-concurrency scale...</p>
              </div>
            ) : polishedBullets.length > 0 ? (
              <div className="space-y-3">
                {polishedBullets.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">
                        Option {idx + 1}: {item.version}
                      </span>
                      <button
                        onClick={() => handleCopyBullet(item.text, idx)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white px-2.5 py-1 rounded border border-slate-200 transition-colors"
                      >
                        {copiedBulletIdx === idx ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedBulletIdx === idx ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>

                    <p className="text-xs text-slate-900 font-medium leading-relaxed bg-white p-3 rounded-lg border border-slate-200/80">
                      • {item.text}
                    </p>

                    <p className="text-[11px] text-slate-500">
                      <strong>Why this works:</strong> {item.keyChange}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center space-y-2 text-slate-400">
                <Sparkles className="w-10 h-10 mx-auto text-slate-300" />
                <p className="text-xs font-medium text-slate-500">
                  Enter a bullet point on the left to see recruiter-optimized variations.
                </p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* TOOL 3: AI-POWERED INTERVIEW SIMULATOR & SKILL TRACKER */}
      {activeTool === 'interviewPrep' && (
        <AiInterviewSimulator
          profile={profile}
          internships={internships}
          onOpenProfileDrawer={onOpenProfileDrawer}
        />
      )}

    </div>
  );
};
