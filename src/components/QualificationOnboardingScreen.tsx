import React, { useState, useEffect } from 'react';
import { 
  Sparkles, CheckCircle2, GraduationCap, BookOpen, Layers, 
  MapPin, Award, ArrowRight, ArrowLeft, Plus, X, Briefcase, FileText
} from 'lucide-react';
import { StudentProfile, AuthUser, WorkType } from '../types';
import { 
  INDIAN_ACADEMIC_COURSES, 
  SUGGESTED_SKILLS_BY_BRANCH, 
  COMMON_INDIAN_UNIVERSITIES 
} from '../data/coursesAndBranches';

interface QualificationOnboardingScreenProps {
  user: AuthUser;
  initialProfile: StudentProfile;
  onComplete: (profile: StudentProfile) => void;
  onCancel?: () => void;
}

export const QualificationOnboardingScreen: React.FC<QualificationOnboardingScreenProps> = ({
  user,
  initialProfile,
  onComplete,
  onCancel
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [degreeCategory, setDegreeCategory] = useState<string>(
    INDIAN_ACADEMIC_COURSES[0].degreeCategory
  );
  const [degreeName, setDegreeName] = useState<string>(
    INDIAN_ACADEMIC_COURSES[0].degrees[0].name
  );
  const [branch, setBranch] = useState<string>(
    INDIAN_ACADEMIC_COURSES[0].degrees[0].branches[0]
  );
  const [customBranch, setCustomBranch] = useState<string>('');

  const [university, setUniversity] = useState<string>(initialProfile.university || COMMON_INDIAN_UNIVERSITIES[0]);
  const [customUniversity, setCustomUniversity] = useState<string>('');
  
  const [gradingType, setGradingType] = useState<'cgpa' | 'percentage'>('cgpa');
  const [gradeValue, setGradeValue] = useState<string>('8.65');
  const [graduationYear, setGraduationYear] = useState<string>('2027');
  const [currentCity, setCurrentCity] = useState<string>('Bengaluru');
  const [workPreference, setWorkPreference] = useState<WorkType>('Hybrid');

  // Skills
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    initialProfile.skills.length > 0 
      ? initialProfile.skills 
      : SUGGESTED_SKILLS_BY_BRANCH['Computer Science & Engineering (CSE)'] || []
  );
  const [newSkillInput, setNewSkillInput] = useState('');

  // Target Roles
  const [targetRoles, setTargetRoles] = useState<string[]>(
    initialProfile.targetRoles.length > 0 
      ? initialProfile.targetRoles 
      : ['Software Engineering (SDE)', 'AI & Machine Learning']
  );

  // Projects & Experience
  const [projectTitle, setProjectTitle] = useState(
    initialProfile.projects?.[0]?.title || 'Campus Web Portal & Splitter'
  );
  const [projectDescription, setProjectDescription] = useState(
    initialProfile.projects?.[0]?.description || 'Built a full-stack platform using modern web technologies to streamline student workflows.'
  );
  const [portfolioLink, setPortfolioLink] = useState(initialProfile.projects?.[0]?.link || '');
  const [resumeText, setResumeText] = useState(initialProfile.resumeText || '');

  // When branch changes, auto-suggest relevant skills if current skills list is minimal
  useEffect(() => {
    const suggested = SUGGESTED_SKILLS_BY_BRANCH[branch] || SUGGESTED_SKILLS_BY_BRANCH['Default'];
    if (suggested && suggested.length > 0) {
      // Add missing suggested skills
      const merged = Array.from(new Set([...selectedSkills.slice(0, 3), ...suggested.slice(0, 6)]));
      setSelectedSkills(merged);
    }
  }, [branch]);

  // Available branches for current selected degree
  const currentCategoryObj = INDIAN_ACADEMIC_COURSES.find(c => c.degreeCategory === degreeCategory);
  const currentDegreeObj = currentCategoryObj?.degrees.find(d => d.name === degreeName);
  const availableBranches = currentDegreeObj?.branches || [];

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillInput.trim()) return;
    if (!selectedSkills.includes(newSkillInput.trim())) {
      setSelectedSkills([...selectedSkills, newSkillInput.trim()]);
    }
    setNewSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSelectedSkills(selectedSkills.filter(s => s !== skillToRemove));
  };

  const handleToggleRole = (role: string) => {
    if (targetRoles.includes(role)) {
      setTargetRoles(targetRoles.filter(r => r !== role));
    } else {
      setTargetRoles([...targetRoles, role]);
    }
  };

  const handleFinalSubmit = () => {
    const finalUniversity = university === 'Other University / Institute in India' && customUniversity.trim()
      ? customUniversity.trim()
      : university;

    const finalBranch = branch === 'Other Engineering Branch' && customBranch.trim()
      ? customBranch.trim()
      : branch;

    const finalProfile: StudentProfile = {
      fullName: user.fullName || initialProfile.fullName,
      email: user.email || initialProfile.email,
      phone: initialProfile.phone || '+91 98201 44521',
      university: finalUniversity,
      degree: degreeName.split('(')[0].trim(),
      major: finalBranch,
      graduationYear,
      cgpa: gradingType === 'cgpa' ? `${gradeValue} / 10 CGPA` : `${gradeValue}%`,
      currentCity,
      workPreference,
      targetRoles: targetRoles.length > 0 ? targetRoles : ['Software Engineering (SDE)'],
      skills: selectedSkills,
      bio: `${user.fullName} is pursuing ${degreeName.split('(')[0]} in ${finalBranch} at ${finalUniversity} (Class of ${graduationYear}).`,
      projects: [
        {
          title: projectTitle || 'Key Academic Project',
          description: projectDescription || 'Demonstrated practical problem solving and engineering rigor.',
          technologies: selectedSkills.slice(0, 4),
          link: portfolioLink
        }
      ],
      experience: initialProfile.experience || [],
      hackathonsOrAwards: initialProfile.hackathonsOrAwards || ['Smart India Hackathon Finalist'],
      resumeText: resumeText || `${user.fullName}\n${finalUniversity} — ${finalBranch}\nSkills: ${selectedSkills.join(', ')}`
    };

    onComplete(finalProfile);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div 
        className="relative bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header with Step Progress */}
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/80">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span>Step {step} of 4 · Complete Your Qualification Profile</span>
            </div>
            {onCancel && (
              <button
                onClick={onCancel}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            {step === 1 && 'Select Your Degree Course & Branch'}
            {step === 2 && 'University & Academic Performance (CGPA / %)'}
            {step === 3 && 'Core Technical Skills & Target Disciplines'}
            {step === 4 && 'Key Project, Portfolio & Work Location'}
          </h2>

          {/* Stepper Bar */}
          <div className="grid grid-cols-4 gap-2 mt-3">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all ${
                  s <= step ? 'bg-indigo-600' : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* STEP 1: DEGREE & BRANCH (FOR EVERY COURSE) */}
          {step === 1 && (
            <div className="space-y-5">
              
              <div className="p-3.5 bg-indigo-50/60 rounded-xl border border-indigo-100 text-xs text-indigo-950 flex items-start gap-2.5">
                <GraduationCap className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">Open to All Indian Colleges & Degrees:</strong>
                  Whether you are in B.Tech (CSE, ECE, Mechanical, Civil), BCA/MCA, Design, Management (BBA/B.Com), or Sciences, our AI matches your specific curriculum with relevant companies.
                </div>
              </div>

              {/* Course Category */}
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1.5">
                  1. Degree Category / Discipline Stream *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {INDIAN_ACADEMIC_COURSES.map((course) => (
                    <button
                      key={course.degreeCategory}
                      type="button"
                      onClick={() => {
                        setDegreeCategory(course.degreeCategory);
                        setDegreeName(course.degrees[0].name);
                        setBranch(course.degrees[0].branches[0]);
                      }}
                      className={`text-xs p-3 rounded-xl border text-left transition-all ${
                        degreeCategory === course.degreeCategory
                          ? 'border-indigo-600 bg-indigo-50/50 font-bold text-indigo-900 shadow-xs'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {course.degreeCategory}
                    </button>
                  ))}
                </div>
              </div>

              {/* Specific Degree */}
              {currentCategoryObj && (
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1.5">
                    2. Specific Degree Program *
                  </label>
                  <select
                    value={degreeName}
                    onChange={(e) => {
                      setDegreeName(e.target.value);
                      const deg = currentCategoryObj.degrees.find(d => d.name === e.target.value);
                      if (deg && deg.branches.length > 0) {
                        setBranch(deg.branches[0]);
                      }
                    }}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {currentCategoryObj.degrees.map((deg) => (
                      <option key={deg.name} value={deg.name}>{deg.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Branch / Specialization */}
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1.5">
                  3. Branch / Department / Major *
                </label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {availableBranches.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>

                {branch.includes('Other') && (
                  <div className="mt-2">
                    <input
                      type="text"
                      value={customBranch}
                      onChange={(e) => setCustomBranch(e.target.value)}
                      placeholder="Type your exact branch name..."
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                )}
              </div>

            </div>
          )}

          {/* STEP 2: UNIVERSITY & ACADEMICS */}
          {step === 2 && (
            <div className="space-y-5">
              
              {/* College / University Select */}
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1.5">
                  College / Institute / University *
                </label>
                <select
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {COMMON_INDIAN_UNIVERSITIES.map((uni) => (
                    <option key={uni} value={uni}>{uni}</option>
                  ))}
                </select>

                {university === 'Other University / Institute in India' && (
                  <div className="mt-2">
                    <input
                      type="text"
                      value={customUniversity}
                      onChange={(e) => setCustomUniversity(e.target.value)}
                      placeholder="Enter your college / university name..."
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                )}
              </div>

              {/* Grading System (CGPA vs %) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1.5">
                    Grading Metric
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => { setGradingType('cgpa'); setGradeValue('8.65'); }}
                      className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-all ${
                        gradingType === 'cgpa'
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      CGPA (Scale of 10.0)
                    </button>
                    <button
                      type="button"
                      onClick={() => { setGradingType('percentage'); setGradeValue('84'); }}
                      className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-all ${
                        gradingType === 'percentage'
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      Percentage (%)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1.5">
                    {gradingType === 'cgpa' ? 'Cumulative CGPA' : 'Aggregate Percentage'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={gradeValue}
                    onChange={(e) => setGradeValue(e.target.value)}
                    placeholder={gradingType === 'cgpa' ? 'e.g. 8.75' : 'e.g. 82.5%'}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 font-bold"
                  />
                </div>
              </div>

              {/* Graduation Year & Current City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1.5">
                    Expected Graduation Year
                  </label>
                  <select
                    value={graduationYear}
                    onChange={(e) => setGraduationYear(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="2025">2025 (Recent Graduate / Final Year)</option>
                    <option value="2026">2026 (Final Year / Pre-Placement)</option>
                    <option value="2027">2027 (Pre-final Year / 3rd Year)</option>
                    <option value="2028">2028 (2nd Year / Sophomore)</option>
                    <option value="2029">2029 (1st Year / Freshman)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1.5">
                    Current Location / College Town
                  </label>
                  <input
                    type="text"
                    value={currentCity}
                    onChange={(e) => setCurrentCity(e.target.value)}
                    placeholder="e.g. Bengaluru, Pune, Hyderabad, Pilani, Delhi"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                  />
                </div>
              </div>

            </div>
          )}

          {/* STEP 3: SKILLS & TARGET ROLES */}
          {step === 3 && (
            <div className="space-y-5">
              
              {/* Skills Tags */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-800">
                    Technical & Domain Skills for {branch} ({selectedSkills.length})
                  </label>
                  <span className="text-[11px] text-slate-500">Add tools you are familiar with</span>
                </div>

                <div className="flex flex-wrap gap-1.5 p-3 rounded-xl border border-slate-200 bg-slate-50/50 min-h-[60px] mb-2.5">
                  {selectedSkills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 text-xs bg-white text-slate-800 border border-slate-200 px-2.5 py-1 rounded-lg font-medium shadow-2xs"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-slate-400 hover:text-rose-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                <form onSubmit={handleAddSkill} className="flex gap-2">
                  <input
                    type="text"
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    placeholder="Type skill & press enter (e.g. React, Java, CAD, Figma, LeetCode, SQL)..."
                    className="flex-1 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold bg-slate-900 text-white rounded-xl hover:bg-slate-800"
                  >
                    Add
                  </button>
                </form>
              </div>

              {/* Target Role Categories */}
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1.5">
                  Target Internship Disciplines in India *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    'Software Engineering (SDE)',
                    'AI & Machine Learning',
                    'Product Design (UI/UX)',
                    'Product Management (APM)',
                    'Data Science & Analytics',
                    'Cloud & DevOps Engineering',
                    'Fintech & Quant Research',
                    'Growth & Marketing'
                  ].map((role) => {
                    const isSelected = targetRoles.includes(role);
                    return (
                      <button
                        key={role}
                        type="button"
                        onClick={() => handleToggleRole(role)}
                        className={`text-xs p-2.5 rounded-xl border text-left transition-colors flex items-center justify-between ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600 font-semibold'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <span>{role}</span>
                        <span>{isSelected ? '✓' : '+'}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Work Style */}
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1.5">
                  Work Style Preference
                </label>
                <div className="flex gap-2">
                  {['Hybrid', 'Remote (Pan-India)', 'On-site'].map((style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setWorkPreference(style as any)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                        workPreference === style
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* STEP 4: PROJECTS & RESUME TEXT */}
          {step === 4 && (
            <div className="space-y-5">
              
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Flagship Academic or Personal Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="e.g. SplitPay UPI / High-Throughput Ingestion Engine"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Project Description & Key Technical Highlights
                </label>
                <textarea
                  rows={3}
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  placeholder="What architecture or tools did you use? What problem did it solve?"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  GitHub / Portfolio / Project URL (Optional)
                </label>
                <input
                  type="url"
                  value={portfolioLink}
                  onChange={(e) => setPortfolioLink(e.target.value)}
                  placeholder="https://github.com/yourusername/project"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Paste Resume Snippet or Coursework List (Optional)
                </label>
                <textarea
                  rows={4}
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your past internships, hackathon wins, or key engineering subjects..."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  The Gemini AI models parse this directly to evaluate your qualification score for Indian recruiters.
                </span>
              </div>

            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-slate-200 bg-slate-50/80 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((step - 1) as any)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep((step + 1) as any)}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
            >
              <span>Next Step →</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinalSubmit}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs hover:shadow-md transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Save & Run AI Matching for My Branch</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
