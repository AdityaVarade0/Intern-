import React, { useState } from 'react';
import { Sparkles, User, PlusCircle, LogIn, LogOut, GraduationCap } from 'lucide-react';
import { StudentProfile, AuthUser } from '../types';

interface NavbarProps {
  activeTab: 'explore' | 'matchmaker' | 'toolkit' | 'applications';
  setActiveTab: (tab: 'explore' | 'matchmaker' | 'toolkit' | 'applications') => void;
  profile: StudentProfile;
  user: AuthUser | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenProfile: () => void;
  onOpenOnboarding: () => void;
  onOpenPostInternship: () => void;
  savedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  profile,
  user,
  onOpenAuth,
  onLogout,
  onOpenProfile,
  onOpenOnboarding,
  onOpenPostInternship,
  savedCount
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <button 
          onClick={() => setActiveTab('explore')}
          className="text-left group flex items-center gap-2.5 focus:outline-none"
        >
          <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm tracking-wider">
            IL
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 group-hover:text-indigo-600 transition-colors">
            InternLaunch India
          </span>
        </button>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => setActiveTab('explore')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'explore'
                ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600'
                : 'hover:text-slate-900'
            }`}
          >
            Explore Cohorts
          </button>
          
          <button
            onClick={() => setActiveTab('matchmaker')}
            className={`flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'matchmaker'
                ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600'
                : 'hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-indigo-500" />
            AI Match & PPO Audit
          </button>

          <button
            onClick={() => setActiveTab('toolkit')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'toolkit'
                ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600'
                : 'hover:text-slate-900'
            }`}
          >
            OA & Interview Prep
          </button>

          <button
            onClick={() => setActiveTab('applications')}
            className={`flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'applications'
                ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600'
                : 'hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>AI Tracker</span>
            {savedCount > 0 && (
              <span className="text-[11px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-mono font-semibold">
                {savedCount}
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: Primary Action & Auth Controls */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenPostInternship}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap shrink-0 border border-slate-200"
          >
            <PlusCircle className="w-3.5 h-3.5 text-slate-500" />
            Post Indian Role
          </button>

          {user?.isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-all whitespace-nowrap shrink-0"
              >
                <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">
                  {user.avatarInitials || user.fullName.slice(0, 2).toUpperCase()}
                </div>
                <span className="max-w-[120px] truncate">{user.fullName.split(' ')[0]}</span>
              </button>

              {/* User Dropdown */}
              {isDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 text-xs z-50 animate-in fade-in zoom-in-95 duration-100"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <div className="px-3.5 py-2 border-b border-slate-100">
                    <span className="font-bold text-slate-900 block truncate">{user.fullName}</span>
                    <span className="text-[11px] text-slate-500 block truncate">{profile.major || profile.degree}</span>
                    <span className="text-[10px] text-indigo-600 font-medium">{profile.university.split(' ')[0]}</span>
                  </div>

                  <button
                    onClick={onOpenOnboarding}
                    className="w-full px-3.5 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                  >
                    <GraduationCap className="w-4 h-4 text-indigo-600" />
                    <span>Set Branch & Course</span>
                  </button>

                  <button
                    onClick={onOpenProfile}
                    className="w-full px-3.5 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                  >
                    <User className="w-4 h-4 text-slate-500" />
                    <span>Edit Profile Details</span>
                  </button>

                  <div className="border-t border-slate-100 my-1" />

                  <button
                    onClick={onLogout}
                    className="w-full px-3.5 py-2 text-left hover:bg-rose-50 text-rose-600 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-all whitespace-nowrap shrink-0"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In / Register</span>
            </button>
          )}
        </div>

      </div>

      {/* Mobile nav bar row */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-100 px-2 py-2 bg-slate-50 text-xs font-medium text-slate-600">
        <button
          onClick={() => setActiveTab('explore')}
          className={`px-2 py-1 rounded ${activeTab === 'explore' ? 'text-indigo-600 font-semibold bg-white' : ''}`}
        >
          Explore
        </button>
        <button
          onClick={() => setActiveTab('matchmaker')}
          className={`px-2 py-1 rounded flex items-center gap-1 ${activeTab === 'matchmaker' ? 'text-indigo-600 font-semibold bg-white' : ''}`}
        >
          <Sparkles className="w-3 h-3 text-indigo-500" />
          AI Match
        </button>
        <button
          onClick={() => setActiveTab('toolkit')}
          className={`px-2 py-1 rounded ${activeTab === 'toolkit' ? 'text-indigo-600 font-semibold bg-white' : ''}`}
        >
          OA Toolkit
        </button>
        <button
          onClick={() => setActiveTab('applications')}
          className={`px-2 py-1 rounded ${activeTab === 'applications' ? 'text-indigo-600 font-semibold bg-white' : ''}`}
        >
          Apps ({savedCount})
        </button>
      </div>
    </header>
  );
};
