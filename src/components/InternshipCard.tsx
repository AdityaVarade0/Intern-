import React from 'react';
import { MapPin, Sparkles, Bookmark, BookmarkCheck, ArrowUpRight, Award, TrendingUp, CheckCircle2, Zap } from 'lucide-react';
import { Internship, MatchRecommendation } from '../types';

interface InternshipCardProps {
  internship: Internship;
  matchInfo?: MatchRecommendation;
  isSaved: boolean;
  isTracked?: boolean;
  onToggleSave: (id: string) => void;
  onSelect: (internship: Internship) => void;
  onQuickApply: (internship: Internship) => void;
  onTrackWithAi?: (internship: Internship) => void;
}

export const InternshipCard: React.FC<InternshipCardProps> = ({
  internship,
  matchInfo,
  isSaved,
  isTracked,
  onToggleSave,
  onSelect,
  onQuickApply,
  onTrackWithAi
}) => {
  return (
    <div className="group relative bg-white rounded-xl border border-slate-200 hover:border-slate-300 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
      
      {/* Top Header Row */}
      <div>
        <div className="flex items-start justify-between gap-4 mb-3">
          
          <div className="flex items-start gap-3">
            {/* Company Initials Avatar */}
            <div className="w-11 h-11 rounded-lg bg-slate-900 text-white font-bold text-sm flex items-center justify-center shrink-0">
              {internship.company.split(' ').map(w => w[0]).join('').slice(0, 2)}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">{internship.company}</span>
                {internship.isRealtime ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-1.5 py-0.5 rounded">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{internship.liveBadge || 'REAL-TIME'}</span>
                    {internship.postedMinutesAgo !== undefined && (
                      <span className="text-emerald-600 font-mono">· {internship.postedMinutesAgo}m ago</span>
                    )}
                  </span>
                ) : internship.featured ? (
                  <span className="text-[11px] font-medium text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                    High PPO
                  </span>
                ) : null}
              </div>

              <h3 
                onClick={() => onSelect(internship)}
                className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors cursor-pointer mt-0.5 leading-snug"
              >
                {internship.title}
              </h3>
            </div>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(internship.id);
            }}
            className={`p-2 rounded-lg transition-colors shrink-0 ${
              isSaved 
                ? 'text-indigo-600 bg-indigo-50' 
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
            title={isSaved ? 'Remove bookmark' : 'Bookmark role'}
          >
            {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          </button>
        </div>

        {/* Unboxed Metadata Line (Zero-pill discipline) */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mb-4">
          <span className="flex items-center gap-1 font-medium text-slate-700">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            {internship.location}
          </span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span>{internship.workType}</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span>{internship.duration}</span>
        </div>

        {/* AI Qualification Match Snippet (If available) */}
        {matchInfo && (
          <div className="mb-4 p-2.5 rounded-lg bg-indigo-50/70 border border-indigo-100 text-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-indigo-900 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-600" />
                Qualification Match
              </span>
              <span className="font-bold text-indigo-700 font-mono tabular-nums">
                {matchInfo.matchScore}% ({matchInfo.matchTier})
              </span>
            </div>
            <p className="text-slate-700 text-[11px] line-clamp-2">
              {matchInfo.whyYouFit}
            </p>
          </div>
        )}

        {/* PPO Rate Badge Snippet */}
        <div className="mb-3 flex items-center gap-1.5 text-xs text-emerald-800 font-medium">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
          <span>{internship.ppoConversionRate}</span>
        </div>

        {/* Description snippet */}
        <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
          {internship.description}
        </p>

        {/* Required Skills list */}
        <div className="flex flex-wrap gap-1 mb-4">
          {internship.requiredSkills.slice(0, 4).map((skill, i) => (
            <span
              key={i}
              className="text-[11px] font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded"
            >
              {skill}
            </span>
          ))}
          {internship.requiredSkills.length > 4 && (
            <span className="text-[11px] text-slate-400 self-center pl-1">
              +{internship.requiredSkills.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Card Footer: Stipend, Deadline & Actions */}
      <div className="pt-3 border-t border-slate-100 mt-auto">
        <div className="flex items-center justify-between">
          
          <div>
            <div className="text-base font-bold text-slate-900 font-mono tabular-nums">
              {internship.stipend}
            </div>
            <div className="text-[11px] text-slate-500">
              Apply by: {internship.deadline}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {isTracked ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Tracked</span>
              </span>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTrackWithAi?.(internship);
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/70 rounded-lg transition-colors whitespace-nowrap shrink-0"
                title="Keep track of this role with AI"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Track with AI</span>
              </button>
            )}

            <button
              onClick={() => onSelect(internship)}
              className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              Details
            </button>
            <button
              onClick={() => onQuickApply(internship)}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors whitespace-nowrap shrink-0"
            >
              <span>Apply</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};
