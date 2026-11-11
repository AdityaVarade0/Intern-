import React, { useState } from 'react';
import { X, Sparkles, Plus, Trash2, CheckCircle2, User, BookOpen } from 'lucide-react';
import { StudentProfile } from '../types';
import { SAMPLE_PROFILES } from '../data/sampleProfiles';

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  onSaveProfile: (profile: StudentProfile) => void;
}

export const ProfileDrawer: React.FC<ProfileDrawerProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile
}) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState<StudentProfile>({ ...profile });
  const [newSkill, setNewSkill] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    if (!formData.skills.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill.trim()]
      });
    }
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(s => s !== skillToRemove)
    });
  };

  const handleToggleTargetRole = (role: string) => {
    const exists = formData.targetRoles.includes(role);
    setFormData({
      ...formData,
      targetRoles: exists 
        ? formData.targetRoles.filter(r => r !== role)
        : [...formData.targetRoles, role]
    });
  };

  const handleSave = () => {
    onSaveProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  const handleLoadSample = (sample: StudentProfile) => {
    setFormData({ ...sample });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex justify-end">
      <div 
        className="w-full max-w-xl bg-white h-full min-h-screen shadow-2xl flex flex-col justify-between overflow-y-auto border-l border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Drawer Header */}
        <div>
          <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-0.5">
                <User className="w-3.5 h-3.5" />
                <span>Candidate Qualifications (India)</span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900">
                Edit Student / Graduate Profile
              </h2>
            </div>
            
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Preset Selector for Indian candidates */}
          <div className="p-4 bg-indigo-50/50 border-b border-indigo-100 space-y-2">
            <span className="text-xs font-semibold text-indigo-900 block">
              Quick Load Indian Student Archetypes:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {SAMPLE_PROFILES.map((sample, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleLoadSample(sample.profile)}
                  className="text-xs px-2.5 py-1 rounded bg-white border border-indigo-200 text-indigo-900 hover:bg-indigo-100 font-medium transition-colors"
                >
                  {sample.label.split('(')[0]} ({sample.profile.university.split(' ')[0]})
                </button>
              ))}
            </div>
          </div>

          {/* Form Fields */}
          <div className="p-6 space-y-5">
            
            {/* Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* University & Degree in India */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">College / University</label>
                <input
                  type="text"
                  value={formData.university}
                  onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. BITS Pilani, IIT Bombay, NIT Trichy"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Degree Program</label>
                <input
                  type="text"
                  value={formData.degree}
                  onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. B.Tech Computer Science"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">CGPA / Grade</label>
                <input
                  type="text"
                  value={formData.cgpa || ''}
                  onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  placeholder="8.85 / 10 CGPA"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Graduation Year</label>
                <input
                  type="text"
                  value={formData.graduationYear}
                  onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  placeholder="2027"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Current City</label>
                <input
                  type="text"
                  value={formData.currentCity || ''}
                  onChange={(e) => setFormData({ ...formData, currentCity: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Bengaluru / Pune"
                />
              </div>
            </div>

            {/* Work Preference */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Work Style Preference in India</label>
              <div className="flex flex-wrap gap-2">
                {['Remote (Pan-India)', 'Hybrid', 'On-site', 'Any'].map((style) => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => setFormData({ ...formData, workPreference: style as any })}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                      formData.workPreference === style
                        ? 'bg-slate-900 text-white shadow-xs font-semibold'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Role Categories */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Target Internship Roles</label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Software Engineering (SDE)',
                  'AI & Machine Learning',
                  'Product Design (UI/UX)',
                  'Product Management (APM)',
                  'Data Science & Analytics',
                  'Fintech & Quant Research'
                ].map((role) => {
                  const isChecked = formData.targetRoles.includes(role);
                  return (
                    <button
                      key={role}
                      type="button"
                      onClick={() => handleToggleTargetRole(role)}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                        isChecked
                          ? 'bg-indigo-600 text-white border-indigo-600 font-semibold'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {isChecked ? '✓ ' : '+ '}
                      {role}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Skills Tags */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Technical & Design Skills ({formData.skills.length})
              </label>
              
              <div className="flex flex-wrap gap-1.5 mb-2.5">
                {formData.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-medium"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-slate-400 hover:text-rose-600 ml-0.5"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <form onSubmit={handleAddSkill} className="flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add skill (e.g. Java, Spring Boot, React, LeetCode, PyTorch)..."
                  className="flex-1 text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="px-3 py-2 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800"
                >
                  Add
                </button>
              </form>
            </div>

            {/* Resume Text Snippet */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Paste Resume Text or LinkedIn Summary (Optional)
              </label>
              <textarea
                value={formData.resumeText || ''}
                onChange={(e) => setFormData({ ...formData, resumeText: e.target.value })}
                rows={5}
                className="w-full text-xs p-3 rounded-lg border border-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Paste your B.Tech coursework, LeetCode rating, project bullets, or past internship experience..."
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                The Gemini AI model reads this directly during Indian qualification matching.
              </span>
            </div>

          </div>
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-6 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            <span>{savedSuccess ? 'Saved!' : 'Save & Re-Score Matches'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
