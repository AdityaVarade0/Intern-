import React, { useState } from 'react';
import { X, Sparkles, Lock, Mail, User, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { AuthUser, StudentProfile } from '../types';
import { SAMPLE_PROFILES } from '../data/sampleProfiles';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AuthUser, initialProfile?: Partial<StudentProfile>, needsOnboarding?: boolean) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  if (!isOpen) return null;

  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Please enter email and password.');
      return;
    }

    if (authMode === 'signup' && !fullName.trim()) {
      setErrorMessage('Please provide your full name.');
      return;
    }

    const user: AuthUser = {
      id: `user-${Date.now()}`,
      fullName: authMode === 'signup' ? fullName.trim() : (email.split('@')[0] || 'Student'),
      email,
      isAuthenticated: true,
      hasCompletedQualification: authMode === 'signin', // If sign up, always launch qualification screen!
      avatarInitials: (authMode === 'signup' ? fullName : email).slice(0, 2).toUpperCase()
    };

    onLoginSuccess(user, { fullName: user.fullName, email: user.email }, authMode === 'signup');
    onClose();
  };

  const handleQuickDemoLogin = (sampleIndex: number) => {
    const sample = SAMPLE_PROFILES[sampleIndex].profile;
    const user: AuthUser = {
      id: `demo-user-${sampleIndex}`,
      fullName: sample.fullName,
      email: sample.email,
      isAuthenticated: true,
      hasCompletedQualification: true,
      avatarInitials: sample.fullName.split(' ').map(w => w[0]).join('')
    };

    onLoginSuccess(user, sample, false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
              IL
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {authMode === 'signup' ? 'Create Student Account' : 'Sign In to InternLaunch'}
              </h2>
              <span className="text-[11px] text-slate-500">Access verified Indian internships & AI matching</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle (Sign Up vs Sign In) */}
        <div className="p-1 bg-slate-100 mx-6 mt-5 rounded-xl flex text-xs font-semibold">
          <button
            type="button"
            onClick={() => { setAuthMode('signup'); setErrorMessage(''); }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              authMode === 'signup' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            New Student Sign Up
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('signin'); setErrorMessage(''); }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              authMode === 'signin' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Existing User Sign In
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
          
          {errorMessage && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs font-medium">
              {errorMessage}
            </div>
          )}

          {authMode === 'signup' && (
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Aditya Sharma"
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">College / Personal Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. student@university.ac.in"
                className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            <span>{authMode === 'signup' ? 'Continue to Qualification Setup →' : 'Sign In to Dashboard'}</span>
          </button>

          <p className="text-[11px] text-slate-500 text-center pt-1">
            {authMode === 'signup' 
              ? 'Next screen: Specify your branch, course, CGPA, and technical skills.' 
              : 'Forgot password? Use 1-click test login below.'}
          </p>

          {/* Quick Demo Switcher */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <span className="text-[11px] font-semibold text-slate-600 block text-center">
              Or 1-Click Test Sign In as Student:
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin(0)}
                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-left transition-colors"
              >
                <strong className="block text-slate-800 text-[11px]">Aditya Sharma</strong>
                <span className="text-[10px] text-slate-500">BITS Pilani · CSE (SDE)</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin(1)}
                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-left transition-colors"
              >
                <strong className="block text-slate-800 text-[11px]">Pooja Iyer</strong>
                <span className="text-[10px] text-slate-500">IIT Bombay · Design (UI/UX)</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
