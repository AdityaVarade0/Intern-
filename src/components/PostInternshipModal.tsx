import React, { useState } from 'react';
import { X, Plus, CheckCircle2, Building, DollarSign, MapPin } from 'lucide-react';
import { Internship, RoleCategory, WorkType } from '../types';
import { CATEGORIES, INDIAN_CITIES } from '../data/internships';

interface PostInternshipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddInternship: (internship: Internship) => void;
}

export const PostInternshipModal: React.FC<PostInternshipModalProps> = ({
  isOpen,
  onClose,
  onAddInternship
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [companyDescription, setCompanyDescription] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [location, setLocation] = useState('Koramangala, Bengaluru (Hybrid)');
  const [workType, setWorkType] = useState<WorkType>('Hybrid');
  const [category, setCategory] = useState<RoleCategory>('Software Engineering (SDE)');
  const [stipend, setStipend] = useState('₹65,000 / month');
  const [duration, setDuration] = useState('2-3 Months (Summer 2026)');
  const [term, setTerm] = useState('Summer 2026');
  const [deadline, setDeadline] = useState('May 31, 2026');
  const [ppoConversionRate, setPpoConversionRate] = useState('85% PPO Rate (₹22 LPA Full-time)');
  const [mentorName, setMentorName] = useState('Nitin Gupta');
  const [mentorTitle, setMentorTitle] = useState('Senior Staff Engineer');
  const [description, setDescription] = useState('');
  const [requiredSkillsStr, setRequiredSkillsStr] = useState('Data Structures & Algorithms, Java or Python, React, PostgreSQL');
  const [perksStr, setPerksStr] = useState('Pre-Placement Offer (PPO) Track, Bengaluru Relocation Grant, Free Meals, MacBook Pro');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !company) return;

    const newRole: Internship = {
      id: `ind-${Date.now()}`,
      title,
      company,
      companyDescription: companyDescription || `${company} builds high-scale consumer and enterprise software in India.`,
      location: location || `${city}, India`,
      city,
      workType,
      category,
      stipend,
      stipendNumeric: parseInt(stipend.replace(/[^0-9]/g, ''), 10) || 60000,
      duration,
      term,
      deadline,
      educationRequirement: 'B.Tech / B.E. (All Branches)',
      applicantsCount: 1,
      ppoConversionRate,
      mentor: {
        name: mentorName,
        title: mentorTitle,
        avatarInitials: mentorName.split(' ').map(w => w[0]).join('')
      },
      description: description || `Join ${company} for an intensive internship solving high-concurrency challenges with senior Indian tech leadership.`,
      responsibilities: [
        'Design and deploy production-grade API endpoints handling real-time Indian traffic.',
        'Write robust, unit-tested code complying with team architectural guidelines.',
        'Participate in sprint demos and 1-on-1 mentor pairings towards a PPO evaluation.'
      ],
      requiredSkills: requiredSkillsStr.split(',').map(s => s.trim()).filter(Boolean),
      preferredSkills: ['Problem Solving', 'System Design basics', 'Git'],
      perks: perksStr.split(',').map(p => p.trim()).filter(Boolean),
      featured: true,
      postedDate: 'Just now'
    };

    onAddInternship(newRole);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Post an Internship Cohort in India</h2>
            <p className="text-xs text-slate-500 mt-0.5">Hire top B.Tech, MCA, and design talent from premier Indian universities</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Internship Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. SDE Intern (Backend & Payments)"
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Company / Organization *</label>
              <input
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. BharatFintech Technologies"
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Discipline</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as RoleCategory)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Hub City in India</label>
              <select
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  setLocation(`${e.target.value}, India`);
                }}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {INDIAN_CITIES.filter(c => c !== 'All Cities').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Monthly Stipend (₹) *</label>
              <input
                type="text"
                required
                value={stipend}
                onChange={(e) => setStipend(e.target.value)}
                placeholder="e.g. ₹75,000 / month"
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Location Details</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Hitec City, Hyderabad (Hybrid)"
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">PPO Conversion Estimate</label>
              <input
                type="text"
                value={ppoConversionRate}
                onChange={(e) => setPpoConversionRate(e.target.value)}
                placeholder="e.g. 85% PPO Rate (₹24 LPA Full-time)"
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Role Description & What the Intern Will Build</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail the technical stack, systems, and deliverables the intern will own..."
              className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Required Skills (comma-separated)
            </label>
            <input
              type="text"
              value={requiredSkillsStr}
              onChange={(e) => setRequiredSkillsStr(e.target.value)}
              placeholder="Java, Spring Boot, React, LeetCode, PostgreSQL"
              className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Assigned Technical Mentor Name</label>
              <input
                type="text"
                value={mentorName}
                onChange={(e) => setMentorName(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Mentor Title</label>
              <input
                type="text"
                value={mentorTitle}
                onChange={(e) => setMentorTitle(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
            >
              Publish Indian Cohort Listing
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
