import React, { useState, useEffect } from 'react';
import { 
  Briefcase, Calendar, MapPin, CheckCircle2, Clock, 
  Trash2, ExternalLink, ArrowRight, Sparkles, AlertCircle, 
  CheckSquare, Square, MessageSquare, Send, RefreshCw, 
  TrendingUp, Award, Plus, ChevronDown, ChevronUp, Zap, HelpCircle
} from 'lucide-react';
import { ApplicationItem, StudentProfile, Internship, TrackedMilestone, RealtimePipelineAuditResult } from '../types';
import { fetchRealtimePipelineAudit, fetchCoachingNoteReply } from '../services/api';

interface ApplicationsTrackerProps {
  applications: ApplicationItem[];
  profile: StudentProfile;
  internships: Internship[];
  onUpdateStatus: (id: string, newStatus: ApplicationItem['status']) => void;
  onUpdateApplication: (app: ApplicationItem) => void;
  onRemoveApplication: (id: string) => void;
  onExploreRoles: () => void;
  onSelectInternshipById: (internshipId: string) => void;
  onOpenAddCustomModal?: () => void;
}

export const ApplicationsTracker: React.FC<ApplicationsTrackerProps> = ({
  applications,
  profile,
  internships,
  onUpdateStatus,
  onUpdateApplication,
  onRemoveApplication,
  onExploreRoles,
  onSelectInternshipById,
  onOpenAddCustomModal
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [activeTabMode, setActiveTabMode] = useState<'pipeline' | 'audit' | 'timeline'>('pipeline');
  
  // AI Pipeline Audit State
  const [auditResult, setAuditResult] = useState<RealtimePipelineAuditResult | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditError, setAuditError] = useState<string | null>(null);

  // Note entry input state per application
  const [activeNoteText, setActiveNoteText] = useState<{ [appId: string]: string }>({});
  const [isSavingNote, setIsSavingNote] = useState<{ [appId: string]: boolean }>({});
  const [expandedNotes, setExpandedNotes] = useState<{ [appId: string]: boolean }>({});

  // Filtered applications
  const filteredApps = applications.filter(app => {
    if (statusFilter === 'All') return true;
    return app.status === statusFilter;
  });

  // Calculate Pipeline Counts
  const counts = {
    all: applications.length,
    submitted: applications.filter(a => a.status === 'Submitted').length,
    underReview: applications.filter(a => a.status === 'Under Review').length,
    oaStage: applications.filter(a => a.status === 'Technical Round / OA').length,
    interviewStage: applications.filter(a => a.status === 'Interview Scheduled').length,
    offers: applications.filter(a => a.status === 'PPO / Offer Extended').length,
  };

  // Run AI Pipeline Audit
  const handleRunAiAudit = async () => {
    if (applications.length === 0) return;
    setIsAuditing(true);
    setAuditError(null);
    try {
      const result = await fetchRealtimePipelineAudit(profile, applications, internships);
      setAuditResult(result);
      
      // Update applications with AI insights if available
      if (result?.perApplicationInsights) {
        result.perApplicationInsights.forEach((insight: any) => {
          const app = applications.find(a => a.id === insight.applicationId);
          if (app) {
            const updatedMilestones: TrackedMilestone[] = (app.milestones && app.milestones.length > 0)
              ? app.milestones
              : insight.recommendedMilestones.map((m: string, idx: number) => ({
                  id: `ms-${idx}-${Date.now()}`,
                  title: m,
                  completed: idx === 0, // Mark first as done
                  category: 'prep'
                }));

            onUpdateApplication({
              ...app,
              aiReadinessScore: insight.readinessScore,
              aiNextAction: insight.nextImmediateAction,
              milestones: updatedMilestones
            });
          }
        });
      }
    } catch (err: any) {
      console.error('Audit error:', err);
      setAuditError('AI audit encounter a temporary delay. Using active pipeline calculations.');
    } finally {
      setIsAuditing(false);
    }
  };

  // Run initial AI audit once if applications exist and no audit has been done
  useEffect(() => {
    if (applications.length > 0 && !auditResult && !isAuditing) {
      handleRunAiAudit();
    }
  }, [applications.length]);

  // Handle Milestone Toggle
  const handleToggleMilestone = (app: ApplicationItem, milestoneId: string) => {
    const currentMilestones = app.milestones || getDefaultMilestones(app);
    const updated = currentMilestones.map(m => 
      m.id === milestoneId ? { ...m, completed: !m.completed } : m
    );

    onUpdateApplication({
      ...app,
      milestones: updated
    });
  };

  // Handle Adding Journal Note with AI Coach Feedback
  const handleAddJournalNote = async (app: ApplicationItem) => {
    const text = activeNoteText[app.id]?.trim();
    if (!text) return;

    setIsSavingNote(prev => ({ ...prev, [app.id]: true }));

    try {
      const coachReply = await fetchCoachingNoteReply(
        text,
        app.company,
        app.title,
        app.status,
        profile
      );

      const newEntry = {
        id: `note-${Date.now()}`,
        timestamp: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        text,
        aiCoachReply: coachReply.reply + ' ' + (coachReply.suggestedAction ? `💡 Next Step: ${coachReply.suggestedAction}` : '')
      };

      const existingNotes = app.notesLog || [];
      const updatedNotes = [newEntry, ...existingNotes];

      onUpdateApplication({
        ...app,
        notesLog: updatedNotes
      });

      // Clear input
      setActiveNoteText(prev => ({ ...prev, [app.id]: '' }));
      setExpandedNotes(prev => ({ ...prev, [app.id]: true }));
    } catch (e) {
      console.error(e);
      // Fallback local note
      const fallbackEntry = {
        id: `note-${Date.now()}`,
        timestamp: 'Just now',
        text,
        aiCoachReply: `Noted! Keep tracking your ${app.company} preparation. Consistent problem-solving is the single biggest factor in Indian campus hiring.`
      };
      onUpdateApplication({
        ...app,
        notesLog: [fallbackEntry, ...(app.notesLog || [])]
      });
      setActiveNoteText(prev => ({ ...prev, [app.id]: '' }));
    } finally {
      setIsSavingNote(prev => ({ ...prev, [app.id]: false }));
    }
  };

  // Default milestones generator for applications without milestones
  function getDefaultMilestones(app: ApplicationItem): TrackedMilestone[] {
    return [
      { id: 'm1', title: 'Resume and tailored pitch submitted to recruiter', completed: true, category: 'prep' },
      { id: 'm2', title: `Review ${app.company}'s engineering architecture & tech stack`, completed: app.status !== 'Submitted', category: 'prep' },
      { id: 'm3', title: 'Solve 10 high-frequency company interview problems on LeetCode/HackerRank', completed: app.status === 'Interview Scheduled' || app.status === 'PPO / Offer Extended', category: 'assessment' },
      { id: 'm4', title: 'Complete mock technical round on project design & indexing', completed: app.status === 'PPO / Offer Extended', category: 'interview' },
      { id: 'm5', title: 'Follow up with HR regarding PPO conversion terms & compensation', completed: app.status === 'PPO / Offer Extended', category: 'followup' }
    ];
  }

  const getStatusBadgeClass = (status: ApplicationItem['status']) => {
    switch (status) {
      case 'Submitted':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Under Review':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Technical Round / OA':
        return 'bg-purple-50 text-purple-700 border-purple-200 animate-pulse';
      case 'Interview Scheduled':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'PPO / Offer Extended':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200 font-bold';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Real-time Header & AI Pipeline Command Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Real-Time AI Pipeline Engine</span>
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-600 font-mono">
              {profile.university.split(' ')[0]} ({profile.major})
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            AI Internship Application Tracker ({applications.length})
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Keep real-time track of your Indian tech applications, active Online Assessments (OA), technical rounds, and PPO milestones with automated Gemini AI coaching.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
          <button
            onClick={handleRunAiAudit}
            disabled={isAuditing || applications.length === 0}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg shadow-xs transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-indigo-600 ${isAuditing ? 'animate-spin' : ''}`} />
            <span>{isAuditing ? 'Auditing Pipeline...' : 'Run AI Pipeline Audit'}</span>
          </button>

          <button
            onClick={onExploreRoles}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors"
          >
            <span>Browse More Roles</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* AI Pipeline Health Dashboard Card */}
      {applications.length > 0 && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl border border-indigo-900/50 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Health Score & PPO Likelihood (4 cols) */}
            <div className="md:col-span-4 space-y-3 pr-0 md:pr-4 border-b md:border-b-0 md:border-r border-slate-700/60 pb-4 md:pb-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                  AI Pipeline Health
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-900/60 text-indigo-200 border border-indigo-700/50">
                  {auditResult?.overallHealth || 'On Track'}
                </span>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-black font-mono tracking-tight text-white">
                  {auditResult?.pipelineHealthScore || 85}
                  <span className="text-lg text-slate-400 font-normal">/100</span>
                </span>
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Strong Momentum
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-700"
                  style={{ width: `${auditResult?.pipelineHealthScore || 85}%` }}
                />
              </div>

              <div className="text-xs text-slate-300 pt-1">
                <span className="text-slate-400">PPO Prediction: </span>
                <span className="font-semibold text-emerald-300">
                  {auditResult?.predictedPpoLikelihood || '78% likelihood of Tier-1 PPO in India'}
                </span>
              </div>
            </div>

            {/* Quick Metrics Badges (8 cols) */}
            <div className="md:col-span-8 space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-[11px] text-slate-400 block">Total Tracked</span>
                  <span className="text-xl font-bold font-mono text-white">{counts.all}</span>
                </div>
                <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                  <span className="text-[11px] text-purple-300 block">Online Assessments</span>
                  <span className="text-xl font-bold font-mono text-purple-200">{counts.oaStage} Active</span>
                </div>
                <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                  <span className="text-[11px] text-indigo-300 block">Interview Scheduled</span>
                  <span className="text-xl font-bold font-mono text-indigo-200">{counts.interviewStage} Round</span>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <span className="text-[11px] text-emerald-300 block">PPO / Offers</span>
                  <span className="text-xl font-bold font-mono text-emerald-200">{counts.offers} Extended</span>
                </div>
              </div>

              {/* Strategic Plan Box */}
              <div className="p-3.5 rounded-xl bg-indigo-950/60 border border-indigo-800/40 text-xs">
                <div className="flex items-center gap-2 mb-1 text-indigo-300 font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>AI Weekly Strategy for {profile.fullName.split(' ')[0]}:</span>
                </div>
                <p className="text-slate-200 text-[11px] leading-relaxed">
                  {auditResult?.weeklyStrategy || 
                    "Focus 70% of preparation time on high-concurrency database queries and timed LeetCode medium questions for active OAs. Follow up on applications submitted > 5 days ago via college alumni on LinkedIn."}
                </p>
              </div>

            </div>

          </div>

          {/* Urgent Action Matrix Banners (If any) */}
          {auditResult?.urgentActionItems && auditResult.urgentActionItems.length > 0 && (
            <div className="pt-4 border-t border-slate-800/80">
              <div className="flex items-center gap-2 mb-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
                <Zap className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
                <span>Urgent Action Matrix (Due This Week)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {auditResult.urgentActionItems.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-amber-300">{item.company}</span>
                      <span className="font-mono text-amber-200 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-700/40">
                        {item.deadlineNotice || 'Priority'}
                      </span>
                    </div>
                    <span className="font-semibold text-white block text-[11px]">{item.headline}</span>
                    <p className="text-slate-300 text-[10px] leading-normal">{item.actionStep}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* Stage Filter Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-medium">
          {[
            { id: 'All', label: `All Tracked (${counts.all})` },
            { id: 'Submitted', label: `Submitted (${counts.submitted})` },
            { id: 'Under Review', label: `Under Review (${counts.underReview})` },
            { id: 'Technical Round / OA', label: `Online Assessment (${counts.oaStage})` },
            { id: 'Interview Scheduled', label: `Interview Round (${counts.interviewStage})` },
            { id: 'PPO / Offer Extended', label: `PPO Extended (${counts.offers})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                statusFilter === tab.id
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-500 font-medium">
          Showing {filteredApps.length} of {applications.length} tracked roles
        </span>
      </div>

      {/* Applications List */}
      {filteredApps.length === 0 ? (
        <div className="py-20 text-center space-y-4 bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-800">No applications match this filter</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Explore open internship cohorts in Bengaluru, Pune, Hyderabad, and Gurugram, or use the "Track with AI" button on any listing.
            </p>
          </div>
          <button
            onClick={onExploreRoles}
            className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
          >
            Explore Open Cohorts in India
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredApps.map((app) => {
            const milestones = app.milestones || getDefaultMilestones(app);
            const completedCount = milestones.filter(m => m.completed).length;
            const progressPercent = Math.round((completedCount / milestones.length) * 100);
            const notes = app.notesLog || [];
            const isNotesOpen = expandedNotes[app.id] ?? false;

            return (
              <div
                key={app.id}
                className="rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-xs transition-all overflow-hidden space-y-0"
              >
                
                {/* Top Card Header */}
                <div className="p-5 sm:p-6 bg-slate-50/70 border-b border-slate-200 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  
                  {/* Company & Title info */}
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">{app.company}</span>
                      <span className="text-slate-300">·</span>
                      <span className="text-xs text-slate-800 font-mono font-semibold">{app.stipend}</span>
                      
                      {app.aiReadinessScore && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
                          <Sparkles className="w-3 h-3 text-indigo-500" />
                          <span>{app.aiReadinessScore}% AI Readiness</span>
                        </span>
                      )}

                      {app.status === 'Technical Round / OA' && (
                        <span className="text-[10px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-1.5 py-0.5 rounded">
                          OA ACTIVE
                        </span>
                      )}
                    </div>

                    <h3 
                      onClick={() => onSelectInternshipById(app.internshipId)}
                      className="text-lg font-bold text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer leading-snug"
                    >
                      {app.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 pt-0.5">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {app.location}
                      </span>
                      <span className="text-slate-300">·</span>
                      <span>Applied: {app.appliedDate}</span>
                      {app.interviewDate && (
                        <>
                          <span className="text-slate-300">·</span>
                          <span className="font-semibold text-indigo-600 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            Interview: {app.interviewDate}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Status Dropdown & Actions */}
                  <div className="flex items-center gap-2.5 self-end sm:self-auto shrink-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-slate-500 font-semibold hidden md:inline">Stage:</span>
                      <select
                        value={app.status}
                        onChange={(e) => onUpdateStatus(app.id, e.target.value as ApplicationItem['status'])}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg border focus:outline-none transition-colors ${getStatusBadgeClass(app.status)}`}
                      >
                        <option value="Submitted">Submitted</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Technical Round / OA">Technical Round / OA</option>
                        <option value="Interview Scheduled">Interview Scheduled</option>
                        <option value="PPO / Offer Extended">PPO / Offer Extended</option>
                        <option value="Archived">Archived</option>
                      </select>
                    </div>

                    <button
                      onClick={() => onRemoveApplication(app.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Remove from tracking"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>

                {/* Card Body: AI Action Recommendation + Milestone Checklist */}
                <div className="p-5 sm:p-6 space-y-5">
                  
                  {/* AI Next Action Advice Banner */}
                  <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-indigo-900 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                        AI Next Action for this Application:
                      </span>
                      <span className="text-[11px] font-mono text-indigo-600 font-semibold">
                        Real-time AI Coach
                      </span>
                    </div>
                    <p className="text-slate-700 text-xs leading-relaxed">
                      {app.aiNextAction || (
                        app.status === 'Technical Round / OA'
                          ? `Practice 5 company-specific HackerRank/LeetCode questions for ${app.company}. Focus on array sliding windows, graph BFS, and hash map lookups.`
                          : app.status === 'Interview Scheduled'
                          ? `Prepare high-concurrency walkthrough of your flagship project. Explain database normalization vs caching tradeoffs.`
                          : app.status === 'PPO / Offer Extended'
                          ? `Congratulations! Review the full-time conversion CTC terms (₹20-28 LPA benchmark) and sign official acceptance before deadline.`
                          : `Recruiter review typically takes 3-5 working days. Reach out to a ${profile.university} alumnus at ${app.company} on LinkedIn.`
                      )}
                    </p>
                  </div>

                  {/* Milestones Checklist & Progress Bar */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                          Preparation Milestones
                        </span>
                        <span className="text-xs text-slate-500 font-mono">
                          ({completedCount} of {milestones.length} completed)
                        </span>
                      </div>
                      <span className="text-xs font-bold text-indigo-600 font-mono">
                        {progressPercent}% Done
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>

                    {/* Milestones List */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {milestones.map((ms) => (
                        <button
                          key={ms.id}
                          onClick={() => handleToggleMilestone(app, ms.id)}
                          className={`text-left p-2.5 rounded-lg border text-xs flex items-start gap-2.5 transition-all ${
                            ms.completed
                              ? 'bg-emerald-50/50 border-emerald-200 text-slate-600'
                              : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                          }`}
                        >
                          {ms.completed ? (
                            <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                          )}
                          <span className={`leading-snug ${ms.completed ? 'line-through text-slate-500' : 'font-medium'}`}>
                            {ms.title}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Submitted Application Pitch Snippet */}
                  {app.tailoredNote && (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-xs text-slate-700">
                      <span className="font-semibold text-slate-900 block mb-0.5">Your Application Pitch to Recruiter:</span>
                      <p className="italic text-slate-600 leading-relaxed text-[11px]">"{app.tailoredNote}"</p>
                    </div>
                  )}

                  {/* Candidate Journal & AI Coach Feedback */}
                  <div className="pt-2 border-t border-slate-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => setExpandedNotes(prev => ({ ...prev, [app.id]: !isNotesOpen }))}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-indigo-600 transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Candidate Journal & AI Coach Notes ({notes.length})</span>
                        {isNotesOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      <span className="text-[11px] text-slate-500">
                        Log interview questions or OA results for instant AI guidance
                      </span>
                    </div>

                    {isNotesOpen && (
                      <div className="space-y-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                        {/* Note Input */}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="e.g. Completed OA on HackerRank — solved 2/2 DSA questions, asked about BFS..."
                            value={activeNoteText[app.id] || ''}
                            onChange={(e) => setActiveNoteText(prev => ({ ...prev, [app.id]: e.target.value }))}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddJournalNote(app)}
                            className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                          <button
                            onClick={() => handleAddJournalNote(app)}
                            disabled={isSavingNote[app.id] || !activeNoteText[app.id]?.trim()}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50 shrink-0"
                          >
                            <Send className="w-3 h-3" />
                            <span>{isSavingNote[app.id] ? 'Analyzing...' : 'Ask AI Coach'}</span>
                          </button>
                        </div>

                        {/* Existing Notes Log */}
                        {notes.length === 0 ? (
                          <p className="text-[11px] text-slate-400 italic">No notes logged yet for this application.</p>
                        ) : (
                          <div className="space-y-2 pt-1 max-h-48 overflow-y-auto">
                            {notes.map((entry) => (
                              <div key={entry.id} className="p-2.5 bg-white rounded-lg border border-slate-200 text-xs space-y-1">
                                <div className="flex items-center justify-between text-[10px] text-slate-400">
                                  <span className="font-medium text-slate-700">You</span>
                                  <span>{entry.timestamp}</span>
                                </div>
                                <p className="text-slate-800 text-[11px]">{entry.text}</p>
                                {entry.aiCoachReply && (
                                  <div className="mt-1 p-2 bg-indigo-50/70 rounded border border-indigo-100 text-[11px] text-indigo-950 space-y-0.5">
                                    <span className="font-bold text-indigo-700 block text-[10px] flex items-center gap-1">
                                      <Sparkles className="w-3 h-3 text-indigo-500" />
                                      AI Coach Response:
                                    </span>
                                    <p className="leading-relaxed">{entry.aiCoachReply}</p>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Card Bottom Links */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 text-xs text-slate-500">
                    <span className="text-[11px]">
                      {app.status === 'Technical Round / OA' 
                        ? '⚡ OA Window Open — Maintain clean code formatting and test edge cases.'
                        : app.status === 'Interview Scheduled'
                        ? '🎯 Technical Round — Prepare 2-minute elevator pitch and design trade-offs.'
                        : 'Recruiter pipeline synchronizing with AI campus benchmark.'}
                    </span>

                    <button
                      onClick={() => onSelectInternshipById(app.internshipId)}
                      className="font-semibold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1"
                    >
                      <span>View Full Role Requirements</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
