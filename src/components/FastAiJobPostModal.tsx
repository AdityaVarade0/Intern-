import React, { useState } from 'react';
import { X, Sparkles, Building, MapPin, DollarSign, CheckCircle2, ArrowRight } from 'lucide-react';
import { Internship } from '../types';
import { parseRawJobPostWithAi } from '../services/api';

interface FastAiJobPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRealtimeInternship: (internship: Internship) => void;
}

export const FastAiJobPostModal: React.FC<FastAiJobPostModalProps> = ({
  isOpen,
  onClose,
  onAddRealtimeInternship
}) => {
  if (!isOpen) return null;

  const [rawText, setRawText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [parsedPreview, setParsedPreview] = useState<Internship | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sampleJDs = [
    {
      label: 'Swiggy SDE Intern',
      text: `Swiggy India is hiring Summer 2026 SDE Interns for our Bengaluru headquarters. We are looking for B.Tech/BCA/Dual degree students with strong fundamentals in Go/Java, React, and MySQL. You will build microservices for our food delivery dispatch engine. Stipend: ₹80,000 per month. High PPO conversion rate (88%) for full-time offers. Apply by Dec 20, 2026.`
    },
    {
      label: 'Blinkit Quick-Commerce Quant',
      text: `Blinkit (Zomato) is seeking Quantitative Analytics & ML Interns in Gurugram, India. Stipend ₹75,000/month. We need candidates skilled in Python, SQL, predictive forecasting, and demand elasticity modeling for 10-minute grocery fulfillment. Open to all engineering branches.`
    }
  ];

  const handleParse = async () => {
    if (!rawText.trim() || rawText.trim().length < 20) {
      setError('Please provide at least a couple of sentences of the job description.');
      return;
    }

    setIsParsing(true);
    setError(null);
    try {
      const parsed = await parseRawJobPostWithAi(rawText);
      setParsedPreview(parsed);
    } catch (e: any) {
      console.error(e);
      setError('Failed to parse with AI. Please try again or check connection.');
    } finally {
      setIsParsing(false);
    }
  };

  const handlePublish = () => {
    if (!parsedPreview) return;
    onAddRealtimeInternship(parsedPreview);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div 
        className="relative bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Instant AI Job Description Parser & Live Post
              </h3>
              <p className="text-xs text-slate-500">
                Paste any unstructured Indian internship JD text — Gemini will parse and publish in real-time
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          
          {/* Sample quick fills */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-semibold">Try Quick Sample:</span>
            {sampleJDs.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setRawText(s.text)}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors font-medium text-[11px]"
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Text Area */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Raw Internship Description / LinkedIn / Email Announcement:
            </label>
            <textarea
              rows={5}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Paste raw JD here (e.g. 'Razorpay is hiring SDE Interns for Summer 2026. Looking for candidates skilled in Go, React, and MySQL. Stipend: ₹80,000/month in Bengaluru...')"
              className="w-full p-3 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed font-sans"
            />
          </div>

          {error && (
            <p className="text-xs text-rose-600 font-medium">{error}</p>
          )}

          {/* Parse Button */}
          <button
            type="button"
            onClick={handleParse}
            disabled={isParsing || !rawText.trim()}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${isParsing ? 'animate-spin' : ''}`} />
            <span>{isParsing ? 'AI Parsing Internship Specifications...' : 'Parse & Extract with Gemini 3.8 Flash'}</span>
          </button>

          {/* Parsed Preview Card */}
          {parsedPreview && (
            <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div>
                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                    AI Parsed Structure · Ready for Live Stream
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">{parsedPreview.title}</h4>
                </div>
                <span className="font-mono font-bold text-indigo-700 text-sm">
                  {parsedPreview.stipend}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                <div><strong className="text-slate-800">Company:</strong> {parsedPreview.company}</div>
                <div><strong className="text-slate-800">Location:</strong> {parsedPreview.location}</div>
                <div><strong className="text-slate-800">Category:</strong> {parsedPreview.category}</div>
                <div><strong className="text-slate-800">PPO Rate:</strong> {parsedPreview.ppoConversionRate}</div>
              </div>

              <div>
                <strong className="text-xs text-slate-800 block mb-1">Required Skills:</strong>
                <div className="flex flex-wrap gap-1">
                  {parsedPreview.requiredSkills.map((sk, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 font-medium">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-end">
                <button
                  type="button"
                  onClick={handlePublish}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Broadcast to Real-Time Feed</span>
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
