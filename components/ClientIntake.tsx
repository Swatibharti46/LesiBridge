import React, { useState } from 'react';
import { analyzeLegalIntake, IntakeAnalysisResult } from '../services/geminiService';
import { Sparkles, ArrowRight, Check, AlertCircle } from 'lucide-react';
import { CaseData, CaseStatus } from '../types';

interface ClientIntakeProps {
  onCaseCreated: (newCase: CaseData) => void;
  onCancel: () => void;
}

export const ClientIntake: React.FC<ClientIntakeProps> = ({ onCaseCreated, onCancel }) => {
  const [description, setDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<IntakeAnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!description.trim()) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeLegalIntake(description);
      setAnalysis(result);
    } catch (e) {
      alert("Something went wrong with the AI analysis. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePostCase = () => {
    if (!analysis) return;
    
    const newCase: CaseData = {
      id: Math.random().toString(36).substr(2, 9),
      title: analysis.title,
      rawDescription: description,
      aiSummary: analysis.summary,
      keyIssues: analysis.keyIssues,
      suggestedBudgetRange: analysis.estimatedBudget,
      status: CaseStatus.OPEN,
      bids: [],
      createdAt: new Date().toISOString(),
      clientName: "TechStartup Inc." // Mocked client name
    };

    onCaseCreated(newCase);
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">New Legal Intake</h2>
        <p className="text-slate-500">Describe your situation. Our AI will structure it for lawyers.</p>
      </div>

      <div className="space-y-6">
        {/* Step 1: Input */}
        <div className={`transition-opacity duration-300 ${analysis ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            What do you need help with?
          </label>
          <textarea
            className="w-full h-40 p-4 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none resize-none shadow-sm text-slate-800 placeholder:text-slate-400"
            placeholder="e.g., I'm raising a Seed round and need a convertible note reviewed. Also, my co-founder is leaving and we don't have a vesting agreement in place..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={!!analysis}
          />
          {!analysis && (
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || description.length < 20}
              className="mt-4 w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 px-6 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isAnalyzing ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-blue-400" /> Generate Case Brief
                </>
              )}
            </button>
          )}
        </div>

        {/* Step 2: Review Analysis */}
        {analysis && (
          <div className="animate-fade-in bg-white rounded-2xl border border-blue-100 shadow-xl overflow-hidden">
            <div className="bg-blue-50/50 p-4 border-b border-blue-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-blue-800 font-semibold">
                <Sparkles className="w-5 h-5" />
                AI Generated Brief
              </div>
              <button onClick={() => setAnalysis(null)} className="text-sm text-blue-600 hover:underline">Edit Original</button>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Title</label>
                <div className="text-lg font-bold text-slate-900">{analysis.title}</div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Summary</label>
                <p className="text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100 mt-1">
                  {analysis.summary}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Key Legal Issues</label>
                  <ul className="mt-2 space-y-2">
                    {analysis.keyIssues.map((issue, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                        <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        {issue}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="space-y-4">
                   <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Category</label>
                    <div className="mt-1 inline-block px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                        {analysis.suggestedCategory}
                    </div>
                   </div>
                   <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Est. Budget</label>
                    <div className="mt-1 text-slate-900 font-medium">
                        {analysis.estimatedBudget}
                    </div>
                   </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 flex justify-end gap-3 border-t border-slate-100">
              <button
                onClick={onCancel}
                className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handlePostCase}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 shadow-lg shadow-blue-600/20"
              >
                Post Case to Marketplace <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};