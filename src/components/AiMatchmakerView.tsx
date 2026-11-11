import React, { useState } from 'react';
import { 
  Sparkles, ArrowRight, CheckCircle2, AlertCircle, RefreshCw, 
  Briefcase, TrendingUp, BookOpen, Layers, Award, ExternalLink, Loader2, MapPin
} from 'lucide-react';
import { StudentProfile, Internship, AiMatchAnalysisResult, MatchRecommendation } from '../types';

interface AiMatchmakerViewProps {
  profile: StudentProfile;
  internships: Internship[];
  matchResults: AiMatchAnalysisResult | null;
  isLoading: boolean;
  onRefreshMatches: () => void;
  onSelectInternship: (internship: Internship) => void;
  onOpenProfileDrawer: () => void;
  onApplyDirect: (internship: Internship, pitch: string) => void;
}

export const AiMatchmakerView: React.FC<AiMatchmakerViewProps> = ({
  profile,
  internships,
  matchResults,
  isLoading,
  onRefreshMatches,
  onSelectInternship,
  onOpenProfileDrawer,
  onApplyDirect
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'strong' | 'good'>('all');

  const filteredRecs = (matchResults?.recommendations || []).filter(rec => {
    if (selectedFilter === 'strong') return rec.matchTier === 'Strong Match';
    if (selectedFilter === 'good') return rec.matchTier === 'Good Match' || rec.matchTier === 'Strong Match';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>Gemini 3.8 AI Recommendation Engine — Indian Tech Hiring</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Indian Tech Internship Match & PPO Readiness Audit
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Benchmarking your {profile.degree} credentials, CGPA, and portfolio against verified live cohorts in Bengaluru, Hyderabad, Pune, and Gurugram.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenProfileDrawer}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            Edit Qualifications
          </button>
          
          <button
            onClick={onRefreshMatches}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Analyzing...' : 'Re-run AI Matching'}</span>
          </button>
        </div>
      </div>

      {/* Candidate Profile Summary Strip */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-900 text-white font-bold flex items-center justify-center text-sm">
            {profile.fullName.split(' ').map(w => w[0]).join('')}
          </div>
          <div>
            <span className="font-bold text-slate-900 text-sm block">{profile.fullName}</span>
            <span className="text-slate-500">
              {profile.degree} · {profile.university} ({profile.cgpa || '8.8 CGPA'}) · Class of {profile.graduationYear}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-500">Target Roles:</span>
          {profile.targetRoles.map((role, i) => (
            <span key={i} className="font-medium text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded">
              {role}
            </span>
          ))}
          <span className="text-slate-400 pl-2">· {profile.skills.length} skills evaluated</span>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="py-16 text-center space-y-4 bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">
            Synthesizing Qualification Matches with Gemini AI...
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Evaluating candidate {profile.fullName} against technical hiring bars and OA requirements for top Indian engineering hubs.
          </p>
        </div>
      )}

      {/* Results View */}
      {!isLoading && matchResults && (
        <div className="space-y-8">
          
          {/* Executive Overview Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            
            {/* Box 1: Readiness Score (4 cols) */}
            <div className="md:col-span-4 p-5 rounded-2xl bg-slate-900 text-white flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-indigo-300 font-semibold flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-indigo-400" />
                  Indian Campus & PPO Market Readiness
                </span>
                <div className="flex items-baseline gap-2 mt-3">
                  <span className="text-5xl font-black font-mono tabular-nums text-white">
                    {matchResults.readinessScore}%
                  </span>
                  <span className="text-xs text-emerald-400 font-semibold">Tier-1 Shortlist Track</span>
                </div>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {matchResults.profileSummary}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400">
                Calibrated across Razorpay, Swiggy, Jio, PhonePe, and top Indian unicorn standards.
              </div>
            </div>

            {/* Box 2: Strengths & Growth Areas (8 cols) */}
            <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Strengths */}
              <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5 mb-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Top Competitive Strengths
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-700">
                    {matchResults.topStrengths.map((str, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="text-[11px] text-emerald-800 font-medium pt-3 mt-3 border-t border-emerald-100">
                  Highlight these prominently in your resume summary and LinkedIn headline.
                </div>
              </div>

              {/* Priority Growth Areas */}
              <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-100 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5 mb-3">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    Key Topics to Bridge Before OA
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-700">
                    {matchResults.priorityGrowthAreas.map((area, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-amber-600 font-bold">→</span>
                        <span>{area}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="text-[11px] text-amber-800 font-medium pt-3 mt-3 border-t border-amber-100">
                  Targeted practice on these areas maximizes shortlisting chances.
                </div>
              </div>

            </div>

          </div>

          {/* Section: Recommended Roles List */}
          <div className="space-y-4">
            
            {/* Filter Tabs (Zero-pill discipline) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Ranked Internship Recommendations in India ({filteredRecs.length} roles)
                </h3>
                <p className="text-xs text-slate-500">Ordered by qualification compatibility and likelihood of OA shortlist</p>
              </div>

              {/* Segmented filter buttons */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium">
                <button
                  onClick={() => setSelectedFilter('all')}
                  className={`px-3 py-1.5 rounded-md transition-colors ${
                    selectedFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All Matches ({matchResults.recommendations.length})
                </button>
                <button
                  onClick={() => setSelectedFilter('strong')}
                  className={`px-3 py-1.5 rounded-md transition-colors ${
                    selectedFilter === 'strong' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Strong Matches (85%+)
                </button>
                <button
                  onClick={() => setSelectedFilter('good')}
                  className={`px-3 py-1.5 rounded-md transition-colors ${
                    selectedFilter === 'good' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Good & Strong (70%+)
                </button>
              </div>
            </div>

            {/* Recommendations Grid */}
            <div className="space-y-4">
              {filteredRecs.map((rec, idx) => {
                const internship = internships.find(i => i.id === rec.internshipId);
                if (!internship) return null;

                const isStrong = rec.matchTier === 'Strong Match';

                return (
                  <div
                    key={rec.internshipId || idx}
                    className={`p-5 rounded-2xl border transition-all bg-white hover:shadow-md ${
                      isStrong ? 'border-indigo-200 bg-gradient-to-r from-white via-white to-indigo-50/20' : 'border-slate-200'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      
                      {/* Left: Role Info + Match Rationale */}
                      <div className="space-y-3 flex-1">
                        
                        {/* Title & Badge */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{internship.company}</span>
                          <span className="text-slate-300">·</span>
                          <span className="text-xs text-slate-600 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {internship.location}
                          </span>
                          <span className="text-slate-300">·</span>
                          <span className="text-xs font-mono font-bold text-slate-900">{internship.stipend}</span>
                          <span className="text-slate-300">·</span>
                          <span className="text-xs text-emerald-700 font-semibold">{internship.ppoConversionRate}</span>
                        </div>

                        <h4 
                          onClick={() => onSelectInternship(internship)}
                          className="text-base sm:text-lg font-bold text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer"
                        >
                          {internship.title}
                        </h4>

                        {/* Why You Fit Explanation */}
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-700 leading-relaxed">
                          <strong className="text-indigo-900 font-semibold block mb-0.5">AI Fit Analysis for {internship.company}:</strong>
                          {rec.whyYouFit}
                        </div>

                        {/* Matched vs Missing Skills */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-emerald-800">Your Matched Skills:</span>
                            <div className="flex flex-wrap gap-1">
                              {rec.matchedSkills.map((s, i) => (
                                <span key={i} className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded text-[11px] font-medium border border-emerald-100">
                                  ✓ {s}
                                </span>
                              ))}
                            </div>
                          </div>

                          {rec.missingSkills && rec.missingSkills.length > 0 && (
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-amber-800">Topics to review:</span>
                              <div className="flex flex-wrap gap-1">
                                {rec.missingSkills.map((s, i) => (
                                  <span key={i} className="bg-amber-50 text-amber-800 px-2 py-0.5 rounded text-[11px] font-medium border border-amber-100">
                                    → {s}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Personalized Pitch */}
                        <div className="text-xs text-slate-600 bg-indigo-50/40 p-2.5 rounded-lg border border-indigo-100/60">
                          <span className="font-semibold text-indigo-900">Custom Recruiter Note: </span>
                          <span className="italic">"{rec.personalizedPitch}"</span>
                        </div>

                      </div>

                      {/* Right: Score Gauge & Actions */}
                      <div className="lg:w-56 flex flex-row lg:flex-col items-center lg:items-end justify-between gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                        
                        <div className="text-left lg:text-right">
                          <div className="flex items-baseline gap-1 lg:justify-end">
                            <span className="text-2xl sm:text-3xl font-black font-mono tabular-nums text-indigo-600">
                              {rec.matchScore}%
                            </span>
                            <span className="text-xs font-semibold text-slate-500">Fit</span>
                          </div>
                          <span className={`text-[11px] font-semibold uppercase tracking-wider block ${
                            isStrong ? 'text-indigo-700' : 'text-slate-600'
                          }`}>
                            {rec.matchTier}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onSelectInternship(internship)}
                            className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
                          >
                            Details
                          </button>
                          
                          <button
                            onClick={() => onApplyDirect(internship, rec.personalizedPitch)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors whitespace-nowrap shrink-0"
                          >
                            <span>Apply</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>

                      </div>

                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Career Strategy Advisory Strip for Indian Engineers */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              Indian Tech Campus & Off-Campus Hiring Strategy
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-700">
              {matchResults.careerTips.map((tip, i) => (
                <div key={i} className="p-3 bg-white rounded-xl border border-slate-200/80 space-y-1">
                  <span className="font-bold text-indigo-600 font-mono">0{i + 1}.</span>
                  <p className="leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
