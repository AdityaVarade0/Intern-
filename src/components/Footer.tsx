import React from 'react';
import { Sparkles } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: 'explore' | 'matchmaker' | 'toolkit' | 'applications') => void;
  onOpenProfile: () => void;
  onOpenPostInternship: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenProfile,
  onOpenPostInternship
}) => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
          
          {/* Brand info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                IL
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                InternLaunch India
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering Indian students, engineering graduates, and early-career builders with verified high-stipend internships and PPO pathways across India’s premier tech hubs.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Platform</h4>
            <ul className="space-y-1.5">
              <li>
                <button onClick={() => onNavigate('explore')} className="hover:text-white transition-colors">
                  Explore Indian Cohorts
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('matchmaker')} className="hover:text-white transition-colors">
                  AI Qualification & PPO Matcher
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('toolkit')} className="hover:text-white transition-colors">
                  OA & LeetCode Interview Prep
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('applications')} className="hover:text-white transition-colors">
                  Applications Tracker
                </button>
              </li>
            </ul>
          </div>

          {/* Candidates & Recruiters */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Indian Tech Ecosystem</h4>
            <ul className="space-y-1.5">
              <li>
                <button onClick={onOpenProfile} className="hover:text-white transition-colors">
                  My Candidate Profile & CGPA
                </button>
              </li>
              <li>
                <button onClick={onOpenPostInternship} className="hover:text-white transition-colors">
                  Post an Internship in India
                </button>
              </li>
              <li>
                <span className="text-slate-500">Bengaluru, Hyderabad, Pune, Gurugram</span>
              </li>
              <li>
                <span className="text-slate-500">100% Verified Paid Monthly Stipends (₹)</span>
              </li>
            </ul>
          </div>

          {/* Standards & Transparency */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Our Commitments</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every internship listed on InternLaunch India guarantees assigned 1-on-1 staff mentorship, no unpaid labor, and transparent Pre-Placement Offer (PPO) criteria.
            </p>
            <div className="pt-2 text-[11px] text-slate-500">
              Powered by Google Gemini 3.8 AI models.
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} InternLaunch India. Built for ambitious Indian engineers, product designers, and quant builders.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span>·</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span>·</span>
            <span className="hover:text-slate-400 cursor-pointer">Indian Employer Guidelines</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
