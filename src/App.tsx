import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Sparkles, SlidersHorizontal, MapPin, 
  DollarSign, CheckCircle2, ArrowRight, BookOpen, Layers, Users, X, TrendingUp, GraduationCap
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { InternshipCard } from './components/InternshipCard';
import { InternshipDetailModal } from './components/InternshipDetailModal';
import { AiMatchmakerView } from './components/AiMatchmakerView';
import { AiCareerToolkit } from './components/AiCareerToolkit';
import { ApplicationsTracker } from './components/ApplicationsTracker';
import { ProfileDrawer } from './components/ProfileDrawer';
import { PostInternshipModal } from './components/PostInternshipModal';
import { StipendDistributionChart } from './components/StipendDistributionChart';
import { SalaryTrendsChart } from './components/SalaryTrendsChart';
import { RealtimeInternshipBanner } from './components/RealtimeInternshipBanner';
import { FastAiJobPostModal } from './components/FastAiJobPostModal';
import { AuthModal } from './components/AuthModal';
import { QualificationOnboardingScreen } from './components/QualificationOnboardingScreen';
import { Footer } from './components/Footer';

import { INITIAL_INTERNSHIPS, CATEGORIES, INDIAN_CITIES } from './data/internships';
import { REALTIME_INCOMING_INTERNSHIPS } from './data/realtimeInternshipsPool';
import { SAMPLE_PROFILES } from './data/sampleProfiles';
import { Internship, StudentProfile, AiMatchAnalysisResult, ApplicationItem, RoleCategory, WorkType, AuthUser } from './types';
import { fetchAiMatchRecommendations } from './services/api';

export function App() {
  const [activeTab, setActiveTab] = useState<'explore' | 'matchmaker' | 'toolkit' | 'applications'>('explore');
  
  // Auth state
  const [currentUser, setCurrentUser] = useState<AuthUser | null>({
    id: 'user-default',
    fullName: SAMPLE_PROFILES[0].profile.fullName,
    email: SAMPLE_PROFILES[0].profile.email,
    isAuthenticated: true,
    hasCompletedQualification: true,
    avatarInitials: 'AS'
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  // Data state
  const [internships, setInternships] = useState<Internship[]>(INITIAL_INTERNSHIPS);
  const [currentProfile, setCurrentProfile] = useState<StudentProfile>(SAMPLE_PROFILES[0].profile);
  const [matchResults, setMatchResults] = useState<AiMatchAnalysisResult | null>(null);
  const [isMatching, setIsMatching] = useState(false);
  
  // User interactions
  const [savedIds, setSavedIds] = useState<string[]>(['ind-001', 'ind-004']);
  const [applications, setApplications] = useState<ApplicationItem[]>([
    {
      id: 'app-ind-1',
      internshipId: 'ind-001',
      company: 'Razorpay Payments',
      title: 'Software Development Engineer (SDE) Intern — Backend & Payments',
      location: 'Koramangala, Bengaluru (Hybrid)',
      stipend: '₹80,000 / month',
      appliedDate: 'Nov 8, 2026',
      status: 'Technical Round / OA',
      tailoredNote: 'As a B.Tech CSE student at BITS Pilani skilled in TypeScript, React, and Go, I can immediately contribute to Razorpay routing engines and high-concurrency payment webhooks.',
      interviewDate: 'Nov 18, 2026'
    }
  ]);

  // Modals & Drawers
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Explore Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCity, setSelectedCity] = useState<string>('All Cities');
  const [selectedWorkType, setSelectedWorkType] = useState<string>('All');
  const [minStipend, setMinStipend] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'recommended' | 'highestStipend' | 'deadline'>('recommended');
  const [analyticsView, setAnalyticsView] = useState<'trends' | 'distribution' | 'both'>('trends');

  // Real-Time Internship Stream State
  const [isAutoInfluxActive, setIsAutoInfluxActive] = useState(true);
  const [realtimePoolIndex, setRealtimePoolIndex] = useState(0);
  const [latestAlertRole, setLatestAlertRole] = useState<Internship | null>(null);
  const [isFastAiPostOpen, setIsFastAiPostOpen] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Run AI matching for the current profile
  const runAiMatching = async (profileToMatch = currentProfile) => {
    setIsMatching(true);
    try {
      const results = await fetchAiMatchRecommendations(profileToMatch, internships);
      setMatchResults(results);
    } catch (e) {
      console.error('Matching error:', e);
    } finally {
      setIsMatching(false);
    }
  };

  // Initial load
  useEffect(() => {
    runAiMatching(currentProfile);
  }, []);

  // Trigger Next Real-Time Influx Role
  const handleTriggerRealtimeDrop = () => {
    const nextTemplate = REALTIME_INCOMING_INTERNSHIPS[realtimePoolIndex % REALTIME_INCOMING_INTERNSHIPS.length];
    setRealtimePoolIndex(prev => prev + 1);

    const newRole: Internship = {
      ...nextTemplate,
      id: `rt-${Date.now()}`,
      isRealtime: true,
      liveBadge: 'JUST POSTED',
      postedMinutesAgo: 1,
      liveViewersCount: Math.floor(Math.random() * 25) + 15,
      postedDate: 'Just now'
    };

    setInternships(prev => [newRole, ...prev]);
    setLatestAlertRole(newRole);
    showToast(`⚡ Real-Time Influx: ${newRole.company} posted ${newRole.title}!`);
    runAiMatching(currentProfile);
  };

  // Auto-stream interval effect
  useEffect(() => {
    if (!isAutoInfluxActive) return;

    const interval = setInterval(() => {
      handleTriggerRealtimeDrop();
    }, 45000); // Influx new opportunity every 45s

    return () => clearInterval(interval);
  }, [isAutoInfluxActive, realtimePoolIndex, currentProfile]);

  // Track with AI action
  const handleTrackWithAi = (internship: Internship) => {
    const existing = applications.find(a => a.internshipId === internship.id);
    if (existing) {
      showToast(`Already tracking ${internship.company} in your AI Tracker!`);
      setActiveTab('applications');
      return;
    }

    const newApp: ApplicationItem = {
      id: `app-${Date.now()}`,
      internshipId: internship.id,
      company: internship.company,
      title: internship.title,
      location: internship.location,
      stipend: internship.stipend,
      appliedDate: 'Just now',
      status: 'Submitted',
      tailoredNote: `Tracking ${internship.company} ${internship.title} via AI Pipeline Copilot.`,
      isRealtimeTracked: true,
      aiReadinessScore: 89,
      aiNextAction: `Review ${internship.company}'s engineering architecture and complete 5 timed LeetCode medium questions.`
    };

    setApplications(prev => [newApp, ...prev]);
    showToast(`🎯 Added ${internship.company} to your AI Application Tracker!`);
  };

  // Update specific application in state
  const handleUpdateApplication = (updatedApp: ApplicationItem) => {
    setApplications(prev => prev.map(a => a.id === updatedApp.id ? updatedApp : a));
  };

  // Auth & Onboarding Handlers
  const handleLoginSuccess = (
    user: AuthUser, 
    initialPartial?: Partial<StudentProfile>, 
    needsOnboarding: boolean = false
  ) => {
    setCurrentUser(user);
    if (initialPartial) {
      setCurrentProfile(prev => ({
        ...prev,
        ...initialPartial
      }));
    }

    if (needsOnboarding || !user.hasCompletedQualification) {
      setIsOnboardingOpen(true);
      showToast(`Welcome ${user.fullName}! Let's set up your branch and academic qualifications.`);
    } else {
      runAiMatching({
        ...currentProfile,
        ...(initialPartial as any)
      });
      showToast(`Welcome back, ${user.fullName}!`);
    }
  };

  const handleCompleteOnboarding = (completedProfile: StudentProfile) => {
    setCurrentProfile(completedProfile);
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        fullName: completedProfile.fullName,
        hasCompletedQualification: true
      });
    }
    setIsOnboardingOpen(false);
    runAiMatching(completedProfile);
    showToast(`Qualification profile saved for ${completedProfile.major}! AI matches re-scored.`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    showToast('Logged out of session');
  };

  // Profile Drawer Save
  const handleSaveProfile = (updatedProfile: StudentProfile) => {
    setCurrentProfile(updatedProfile);
    runAiMatching(updatedProfile);
    showToast(`Qualifications updated for ${updatedProfile.fullName}! Matches re-scored.`);
  };

  const handleSelectSampleProfile = (sample: StudentProfile) => {
    setCurrentProfile(sample);
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        fullName: sample.fullName,
        email: sample.email,
        avatarInitials: sample.fullName.split(' ').map(w => w[0]).join('')
      });
    }
    runAiMatching(sample);
    showToast(`Switched active candidate to ${sample.fullName} (${sample.university}).`);
  };

  const handleToggleSave = (id: string) => {
    if (savedIds.includes(id)) {
      setSavedIds(savedIds.filter(item => item !== id));
      showToast('Removed bookmark');
    } else {
      setSavedIds([...savedIds, id]);
      showToast('Saved to your bookmarks');
    }
  };

  const handleApply = (internship: Internship, note: string) => {
    const existing = applications.find(a => a.internshipId === internship.id);
    if (existing) {
      showToast('You already applied to this role!');
      return;
    }

    const newApp: ApplicationItem = {
      id: `app-${Date.now()}`,
      internshipId: internship.id,
      company: internship.company,
      title: internship.title,
      location: internship.location,
      stipend: internship.stipend,
      appliedDate: 'Just now',
      status: 'Submitted',
      tailoredNote: note
    };

    setApplications([newApp, ...applications]);
    showToast(`Application submitted to ${internship.company}!`);
  };

  const handleUpdateAppStatus = (id: string, newStatus: ApplicationItem['status']) => {
    setApplications(applications.map(app => 
      app.id === id ? { ...app, status: newStatus } : app
    ));
    showToast(`Updated status to "${newStatus}"`);
  };

  const handleRemoveApp = (id: string) => {
    setApplications(applications.filter(app => app.id !== id));
    showToast('Application removed from tracker');
  };

  const handleAddInternship = (newRole: Internship) => {
    const updated = [newRole, ...internships];
    setInternships(updated);
    runAiMatching(currentProfile);
    showToast(`Published "${newRole.title}" in ${newRole.city}!`);
  };

  // Filter and sort internships
  const filteredInternships = internships.filter(item => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchCompany = item.company.toLowerCase().includes(q);
      const matchSkill = item.requiredSkills.some(s => s.toLowerCase().includes(q));
      const matchCat = item.category.toLowerCase().includes(q);
      const matchCity = item.location.toLowerCase().includes(q);
      if (!matchTitle && !matchCompany && !matchSkill && !matchCat && !matchCity) return false;
    }

    if (selectedCategory !== 'All' && item.category !== selectedCategory) {
      return false;
    }

    if (selectedCity !== 'All Cities' && item.city !== selectedCity) {
      return false;
    }

    if (selectedWorkType !== 'All' && item.workType !== selectedWorkType) {
      return false;
    }

    if (item.stipendNumeric < minStipend) {
      return false;
    }

    return true;
  });

  filteredInternships.sort((a, b) => {
    if (sortBy === 'highestStipend') {
      return b.stipendNumeric - a.stipendNumeric;
    }
    if (sortBy === 'deadline') {
      return a.deadline.localeCompare(b.deadline);
    }
    const scoreA = matchResults?.recommendations.find(r => r.internshipId === a.id)?.matchScore || 50;
    const scoreB = matchResults?.recommendations.find(r => r.internshipId === b.id)?.matchScore || 50;
    return scoreB - scoreA;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-indigo-600 selection:text-white">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg border border-slate-800 text-xs font-semibold flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={currentProfile}
        user={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onOpenProfile={() => setIsProfileDrawerOpen(true)}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        onOpenPostInternship={() => setIsPostModalOpen(true)}
        savedCount={applications.length}
      />

      {/* Qualification Bar Banner when logged in */}
      {currentUser?.isAuthenticated && (
        <div className="bg-indigo-900 text-white px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-3 border-b border-indigo-950">
          <div className="flex items-center gap-2 max-w-2xl truncate">
            <GraduationCap className="w-4 h-4 text-indigo-300 shrink-0" />
            <span className="font-semibold text-indigo-200">Logged in candidate:</span>
            <span className="font-bold text-white">{currentProfile.fullName}</span>
            <span className="text-indigo-300">·</span>
            <span className="text-indigo-100 truncate">{currentProfile.degree} ({currentProfile.major}) at {currentProfile.university}</span>
            <span className="text-indigo-300">·</span>
            <span className="font-mono text-emerald-300">{currentProfile.cgpa || '8.8 CGPA'}</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsOnboardingOpen(true)}
              className="text-xs font-semibold text-indigo-200 hover:text-white underline underline-offset-2 transition-colors whitespace-nowrap shrink-0"
            >
              Update Course & Branch Qualifications →
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* VIEW 1: EXPLORE INTERNSHIPS */}
        {activeTab === 'explore' && (
          <div>
            
            {/* Hero Section */}
            <HeroSection
              onGoToMatchmaker={() => setActiveTab('matchmaker')}
              onExploreRoles={() => {
                const el = document.getElementById('roles-catalog');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              currentProfile={currentProfile}
              onSelectSampleProfile={handleSelectSampleProfile}
              onOpenProfileDrawer={() => setIsProfileDrawerOpen(true)}
            />

            {/* Catalog Section */}
            <section id="roles-catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
              
              {/* Real-time Influx Banner & Live Control Strip */}
              <RealtimeInternshipBanner
                isAutoInfluxActive={isAutoInfluxActive}
                onToggleAutoInflux={() => setIsAutoInfluxActive(!isAutoInfluxActive)}
                onTriggerRealtimeDrop={handleTriggerRealtimeDrop}
                onOpenFastAiPost={() => setIsFastAiPostOpen(true)}
                realtimeCount={internships.filter(i => i.isRealtime).length}
                latestAlertRole={latestAlertRole}
                onTrackAlertRole={(role) => {
                  handleTrackWithAi(role);
                  setLatestAlertRole(null);
                }}
                onViewAlertRole={(role) => {
                  setSelectedInternship(role);
                  setLatestAlertRole(null);
                }}
                onDismissAlert={() => setLatestAlertRole(null)}
              />

              {/* Search & Filter Bar */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                
                {/* Search Input Row */}
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search Indian roles by company (Razorpay, Swiggy, Jio), skills (React, Java, PyTorch), or city..."
                      className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 placeholder:text-slate-400"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* City Hub Filter Dropdown */}
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="text-xs px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {INDIAN_CITIES.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>

                    {/* Sort Dropdown */}
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="text-xs px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="recommended">Sort: Highest AI Match</option>
                      <option value="highestStipend">Sort: Highest Stipend (₹/mo)</option>
                      <option value="deadline">Sort: Deadline Soonest</option>
                    </select>
                  </div>
                </div>

                {/* Category Segmented Buttons */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                  <button
                    onClick={() => setSelectedCategory('All')}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap shrink-0 ${
                      selectedCategory === 'All'
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                    }`}
                  >
                    All Disciplines ({internships.length})
                  </button>

                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap shrink-0 ${
                        selectedCategory === cat
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

              </div>

              {/* D3 Internship Compensation & Growth Analytics Hub */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Indian Compensation Analytics Hub
                    </span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 font-mono px-2 py-0.5 rounded font-semibold">
                      Interactive D3.js Visualizations
                    </span>
                  </div>

                  {/* View Mode Switcher */}
                  <div className="flex items-center bg-slate-100 p-1 rounded-lg self-start sm:self-auto">
                    <button
                      onClick={() => setAnalyticsView('trends')}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                        analyticsView === 'trends'
                          ? 'bg-white text-slate-900 shadow-xs font-semibold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      📈 Multi-Year Trends (2022–2026)
                    </button>
                    <button
                      onClick={() => setAnalyticsView('distribution')}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                        analyticsView === 'distribution'
                          ? 'bg-white text-slate-900 shadow-xs font-semibold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      📊 Role & City Distribution
                    </button>
                    <button
                      onClick={() => setAnalyticsView('both')}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                        analyticsView === 'both'
                          ? 'bg-white text-slate-900 shadow-xs font-semibold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      View Both
                    </button>
                  </div>
                </div>

                {/* Secondary D3 Visualization: Salary Trends Over Time */}
                {(analyticsView === 'trends' || analyticsView === 'both') && (
                  <SalaryTrendsChart />
                )}

                {/* Primary D3 Visualization: Filtered Stipend Distribution */}
                {(analyticsView === 'distribution' || analyticsView === 'both') && (
                  <StipendDistributionChart internships={filteredInternships} />
                )}
              </div>

              {/* Roles Grid Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                    Verified Indian Tech Internships ({filteredInternships.length})
                  </h2>
                  <p className="text-xs text-slate-500">
                    Showing verified stipends in INR (₹) · Sorted by {sortBy === 'recommended' ? 'AI Qualification Match' : sortBy === 'highestStipend' ? 'Stipend Rate' : 'Deadline'}
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('matchmaker')}
                  className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>View Full PPO & Qualification Breakdown →</span>
                </button>
              </div>

              {/* Cards Grid */}
              {filteredInternships.length === 0 ? (
                <div className="py-20 text-center space-y-3 bg-white rounded-2xl border border-slate-200 p-8">
                  <Search className="w-10 h-10 text-slate-300 mx-auto" />
                  <h3 className="text-base font-bold text-slate-800">No internships match your active filters</h3>
                  <p className="text-xs text-slate-500">Try clearing the search query or selecting "All Cities".</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                      setSelectedCity('All Cities');
                    }}
                    className="px-4 py-2 text-xs font-bold text-white bg-slate-900 rounded-lg hover:bg-slate-800"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredInternships.map(internship => {
                    const matchInfo = matchResults?.recommendations.find(r => r.internshipId === internship.id);
                    const isSaved = savedIds.includes(internship.id);

                    return (
                      <InternshipCard
                        key={internship.id}
                        internship={internship}
                        matchInfo={matchInfo}
                        isSaved={isSaved}
                        isTracked={applications.some(a => a.internshipId === internship.id)}
                        onToggleSave={handleToggleSave}
                        onSelect={(item) => setSelectedInternship(item)}
                        onQuickApply={(item) => {
                          setSelectedInternship(item);
                        }}
                        onTrackWithAi={handleTrackWithAi}
                      />
                    );
                  })}
                </div>
              )}

              {/* Indian Ecosystem Showcase Banner */}
              <div className="mt-16 rounded-3xl bg-white border border-slate-200 p-8 lg:p-10 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5 rounded-2xl overflow-hidden border border-slate-200">
                  <img
                    src="/src/assets/images/internship_tech_summit_1794368504926.jpg"
                    alt="University students networking at tech innovation campus career fair in India"
                    className="w-full h-72 sm:h-80 object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                
                <div className="lg:col-span-7 space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                    The Indian Tech Career Launchpad
                  </span>
                  <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight" style={{ textWrap: 'balance' }}>
                    Why top engineering graduates and university builders recruit on InternLaunch India
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    No unpaid chores or vague consultancy gigs. Every cohort listed on InternLaunch India guarantees clear monthly stipends (₹40,000 to ₹1,20,000/mo), assigned 1-on-1 staff engineering mentors, and transparent Pre-Placement Offer (PPO) conversion standards.
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                    <div>
                      <span className="text-xl font-black font-mono text-slate-900">₹40k–₹1.2L</span>
                      <p className="text-xs text-slate-500 mt-0.5">Monthly verified stipend</p>
                    </div>
                    <div>
                      <span className="text-xl font-black font-mono text-slate-900">88%</span>
                      <p className="text-xs text-slate-500 mt-0.5">PPO conversion rate</p>
                    </div>
                    <div>
                      <span className="text-xl font-black font-mono text-slate-900">₹18–₹35 LPA</span>
                      <p className="text-xs text-slate-500 mt-0.5">Average new grad full-time CTC</p>
                    </div>
                  </div>
                </div>
              </div>

            </section>

          </div>
        )}

        {/* VIEW 2: AI MATCHMAKER & QUALIFICATION ENGINE */}
        {activeTab === 'matchmaker' && (
          <AiMatchmakerView
            profile={currentProfile}
            internships={internships}
            matchResults={matchResults}
            isLoading={isMatching}
            onRefreshMatches={() => runAiMatching(currentProfile)}
            onSelectInternship={(item) => setSelectedInternship(item)}
            onOpenProfileDrawer={() => setIsProfileDrawerOpen(true)}
            onApplyDirect={(item, pitch) => {
              handleApply(item, pitch);
              setActiveTab('applications');
            }}
          />
        )}

        {/* VIEW 3: AI CAREER TOOLKIT */}
        {activeTab === 'toolkit' && (
          <AiCareerToolkit
            profile={currentProfile}
            internships={internships}
            onOpenProfileDrawer={() => setIsProfileDrawerOpen(true)}
          />
        )}

        {/* VIEW 4: APPLICATIONS TRACKER */}
        {activeTab === 'applications' && (
          <ApplicationsTracker
            applications={applications}
            profile={currentProfile}
            internships={internships}
            onUpdateStatus={handleUpdateAppStatus}
            onUpdateApplication={handleUpdateApplication}
            onRemoveApplication={handleRemoveApp}
            onExploreRoles={() => setActiveTab('explore')}
            onSelectInternshipById={(id) => {
              const item = internships.find(i => i.id === id);
              if (item) setSelectedInternship(item);
            }}
            onOpenAddCustomModal={() => setIsFastAiPostOpen(true)}
          />
        )}

      </main>

      {/* Auth Modal (Sign In / Register) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Dedicated Onboarding / Qualification Wizard Screen */}
      {isOnboardingOpen && (
        <QualificationOnboardingScreen
          user={currentUser || {
            id: 'temp-user',
            fullName: currentProfile.fullName,
            email: currentProfile.email,
            isAuthenticated: true,
            hasCompletedQualification: false
          }}
          initialProfile={currentProfile}
          onComplete={handleCompleteOnboarding}
          onCancel={() => setIsOnboardingOpen(false)}
        />
      )}

      {/* Detail Modal */}
      {selectedInternship && (
        <InternshipDetailModal
          internship={selectedInternship}
          onClose={() => setSelectedInternship(null)}
          profile={currentProfile}
          matchInfo={matchResults?.recommendations.find(r => r.internshipId === selectedInternship.id)}
          onApply={handleApply}
          isApplied={applications.some(a => a.internshipId === selectedInternship.id)}
          isTracked={applications.some(a => a.internshipId === selectedInternship.id)}
          onTrackWithAi={handleTrackWithAi}
        />
      )}

      {/* Fast AI Job Post & Raw JD Parser Modal */}
      <FastAiJobPostModal
        isOpen={isFastAiPostOpen}
        onClose={() => setIsFastAiPostOpen(false)}
        onAddRealtimeInternship={(newRole) => {
          setInternships(prev => [newRole, ...prev]);
          setLatestAlertRole(newRole);
          showToast(`⚡ Real-time Influx: "${newRole.company}" posted ${newRole.title}!`);
          runAiMatching(currentProfile);
        }}
      />

      {/* Profile Edit Drawer */}
      <ProfileDrawer
        isOpen={isProfileDrawerOpen}
        onClose={() => setIsProfileDrawerOpen(false)}
        profile={currentProfile}
        onSaveProfile={handleSaveProfile}
      />

      {/* Post Internship Modal */}
      <PostInternshipModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onAddInternship={handleAddInternship}
      />

      {/* Footer */}
      <Footer
        onNavigate={setActiveTab}
        onOpenProfile={() => setIsProfileDrawerOpen(true)}
        onOpenPostInternship={() => setIsPostModalOpen(true)}
      />

    </div>
  );
}
