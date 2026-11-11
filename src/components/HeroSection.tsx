import React from 'react';
import { Sparkles, ArrowRight, CheckCircle2, ShieldCheck, Users, Briefcase, MapPin } from 'lucide-react';
import { StudentProfile } from '../types';
import { SAMPLE_PROFILES } from '../data/sampleProfiles';

interface HeroSectionProps {
  onGoToMatchmaker: () => void;
  onExploreRoles: () => void;
  currentProfile: StudentProfile;
  onSelectSampleProfile: (profile: StudentProfile) => void;
  onOpenProfileDrawer: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onGoToMatchmaker,
  onExploreRoles,
  currentProfile,
  onSelectSampleProfile,
  onOpenProfileDrawer
}) => {
  return (
    <section className="relative overflow-hidden bg-white border-b border-slate-200 pt-8 pb-12 lg:pt-12 lg:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Split Grid: Proposition + Indian Tech Hub Photography */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Kicker tag (Zero-pill discipline) */}
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span>India’s Leading AI Internship & PPO Matchmaker</span>
            </div>

            {/* Headline with balanced wrap */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.12]" style={{ textWrap: 'balance' }}>
              Land high-paying internships in India matched to your qualifications.
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              Connect with top tech product companies and unicorns across Bengaluru, Hyderabad, Pune, Gurugram, and remote India. Our AI matches your CGPA, projects, and skills to recommend where you have the highest winning and PPO conversion probability.
            </p>

            {/* Active Candidate Profile Switcher */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span className="font-semibold text-slate-800">Active Student / Graduate Profile:</span>
                <button
                  onClick={onOpenProfileDrawer}
                  className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline"
                >
                  Edit Custom Qualifications →
                </button>
              </div>

              {/* Archetype buttons */}
              <div className="flex flex-wrap gap-1.5">
                {SAMPLE_PROFILES.map((sample, idx) => {
                  const isSelected = currentProfile.fullName === sample.profile.fullName;
                  return (
                    <button
                      key={idx}
                      onClick={() => onSelectSampleProfile(sample.profile)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap shrink-0 ${
                        isSelected
                          ? 'bg-slate-900 text-white shadow-xs font-semibold'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {sample.profile.fullName} ({sample.profile.university.split(' ')[0]} · {sample.profile.degree.split(' ')[0]})
                    </button>
                  );
                })}
              </div>

              <div className="text-xs text-slate-500 flex flex-wrap items-center gap-3 pt-1">
                <span>{currentProfile.university}</span>
                <span aria-hidden="true">·</span>
                <span>{currentProfile.cgpa || '8.8 CGPA'}</span>
                <span aria-hidden="true">·</span>
                <span>Class of {currentProfile.graduationYear}</span>
                <span aria-hidden="true">·</span>
                <span>{currentProfile.skills.length} skills evaluated</span>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onGoToMatchmaker}
                className="inline-flex items-center gap-2.5 px-6 py-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs hover:shadow-md transition-all group whitespace-nowrap shrink-0"
              >
                <Sparkles className="w-4 h-4 text-indigo-200 group-hover:rotate-12 transition-transform" />
                <span>Run AI Qualification Match</span>
                <ArrowRight className="w-4 h-4 text-indigo-200 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={onExploreRoles}
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors whitespace-nowrap shrink-0"
              >
                <span>Browse Bengaluru, Pune & Gurugram Roles</span>
              </button>
            </div>

          </div>

          {/* Right Column: Authentic Indian Tech Hub Image (5 cols) */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100 group">
              <img
                src="/src/assets/images/india_interns_tech_hub_1794369192457.jpg"
                alt="Young Indian engineers and product designers collaborating at a modern Bengaluru tech workspace"
                className="w-full h-[340px] sm:h-[400px] object-cover group-hover:scale-[1.02] transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              
              {/* Overlay card */}
              <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md rounded-xl p-3.5 border border-slate-200/80 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-xs font-semibold text-slate-900">Summer & Semester Cohorts 2026</span>
                  </div>
                  <span className="text-xs text-slate-600 font-mono font-semibold">Verified Paid</span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Razorpay, Swiggy, Jio, PhonePe, CRED, Zomato, and high-growth Indian startups hiring engineering & design interns.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Full-width 4-Column Proof & Metrics Strip in Indian Context */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-8 border-t border-slate-100">
          
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/60">
            <div className="flex items-center gap-2 text-indigo-600 mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Monthly Stipend</span>
            </div>
            <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">₹40k–₹1.2L/mo</div>
            <div className="text-xs text-slate-600 mt-0.5">100% paid stipends with corporate accommodation / cab allowance</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/60">
            <div className="flex items-center gap-2 text-indigo-600 mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">PPO Track</span>
            </div>
            <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">88% PPO Rate</div>
            <div className="text-xs text-slate-600 mt-0.5">Direct Pre-Placement Offers to ₹18–₹32 LPA CTC</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/60">
            <div className="flex items-center gap-2 text-indigo-600 mb-1">
              <MapPin className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Top Hubs</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">7+ Tech Hubs</div>
            <div className="text-xs text-slate-600 mt-0.5">Bengaluru, Hyderabad, Pune, Gurugram, Noida, Mumbai & Remote</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/60">
            <div className="flex items-center gap-2 text-indigo-600 mb-1">
              <Briefcase className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">AI Gap Audit</span>
            </div>
            <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">Instant DSA/Skill Match</div>
            <div className="text-xs text-slate-600 mt-0.5">Identify exact LeetCode & system topics to reach 95%+ fit</div>
          </div>

        </div>

      </div>
    </section>
  );
};
