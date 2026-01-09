import React, { useState } from 'react';
import { analyzeLegalIntake, IntakeAnalysisResult } from '../services/geminiService';
import { Wand2, LoaderCircle, ArrowRight, Lightbulb } from 'lucide-react';
import { MarketplaceDispute } from '../types';

interface PostDisputeFormProps {
  onSubmit: (disputeData: Omit<MarketplaceDispute, 'id' | 'postedDate' | 'bids' | 'clientName'>) => void;
  onCancel: () => void;
}

export const PostDisputeForm: React.FC<PostDisputeFormProps> = ({ onSubmit, onCancel }) => {
  const [rawDescription, setRawDescription] = useState('');
  const [analysis, setAnalysis] = useState<IntakeAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzed, setIsAnalyzed] = useState(false);

  const handleAnalyze = async () => {
    if (rawDescription.trim().length < 50) {
      alert("Please provide at least 50 characters for a meaningful analysis.");
      return;
    }
    setIsLoading(true);
    const result = await analyzeLegalIntake(rawDescription);
    setAnalysis(result);
    setIsLoading(false);
    setIsAnalyzed(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!analysis) {
        alert("Please analyze the description before submitting.");
        return;
    }
    onSubmit({
        title: analysis.title,
        category: analysis.suggestedCategory,
        description: analysis.summary,
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Post a New Case to the Marketplace</h2>
        <p className="mt-2 text-lg text-slate-600">
          Describe your legal issue, and our AI assistant will help structure it for lawyers to review.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <form onSubmit={handleSubmit}>
          <div className="p-6 md:p-8 space-y-6">
            {/* Step 1: Raw Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
                1. Describe your legal issue in detail
              </label>
              <textarea
                id="description"
                value={rawDescription}
                onChange={(e) => setRawDescription(e.target.value)}
                placeholder="For example: 'A co-founder left my startup after only 6 months but is now demanding their full 25% equity stake, even though we had a 4-year vesting agreement. I need to know how to enforce our contract...'"
                className="w-full h-40 p-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none resize-none transition-colors"
                disabled={isAnalyzed}
              />
               {!isAnalyzed && <p className="text-xs text-slate-500 mt-1">Provide as much context as possible for the best results.</p>}
            </div>

            {/* AI Analysis Button */}
            {!isAnalyzed && (
                 <div className="text-center">
                    <button
                        type="button"
                        onClick={handleAnalyze}
                        disabled={isLoading || rawDescription.trim().length < 20}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mx-auto"
                    >
                        {isLoading ? (
                            <>
                                <LoaderCircle className="w-5 h-5 animate-spin" /> Analyzing...
                            </>
                        ) : (
                            <>
                                <Wand2 className="w-5 h-5" /> Analyze with AI
                            </>
                        )}
                    </button>
                 </div>
            )}
            
            {/* Step 2: AI Analysis Result */}
            {isAnalyzed && analysis && (
                <div className="space-y-6 animate-fade-in">
                    <div className="p-4 bg-emerald-50 border-l-4 border-emerald-500">
                        <h3 className="font-bold text-emerald-900">Analysis Complete!</h3>
                        <p className="text-sm text-emerald-800">Review the AI-generated summary below. You can make edits if needed.</p>
                    </div>

                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2">Case Title</label>
                        <input
                            type="text"
                            id="title"
                            value={analysis.title}
                            onChange={(e) => setAnalysis({ ...analysis, title: e.target.value })}
                            className="w-full p-3 rounded-lg border border-slate-300"
                        />
                    </div>

                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-2">Suggested Legal Category</label>
                        <input
                            type="text"
                            id="category"
                            value={analysis.suggestedCategory}
                            onChange={(e) => setAnalysis({ ...analysis, suggestedCategory: e.target.value })}
                            className="w-full p-3 rounded-lg border border-slate-300"
                        />
                    </div>
                    
                     <div>
                        <label htmlFor="summary" className="block text-sm font-medium text-slate-700 mb-2">Professional Summary</label>
                        <textarea
                            id="summary"
                            value={analysis.summary}
                            onChange={(e) => setAnalysis({ ...analysis, summary: e.target.value })}
                            className="w-full h-24 p-3 rounded-lg border border-slate-300"
                        />
                    </div>

                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <h4 className="font-semibold text-slate-800 flex items-center gap-2 mb-2"><Lightbulb className="w-4 h-4 text-amber-500" /> Key Issues Identified by AI</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-slate-600">
                            {analysis.keyIssues.map((issue, i) => <li key={i}>{issue}</li>)}
                        </ul>
                    </div>

                </div>
            )}

          </div>
          <div className="bg-slate-50 p-4 flex justify-end gap-3 border-t border-slate-100">
            <button type="button" onClick={onCancel} className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium">Cancel</button>
            <button 
                type="submit" 
                disabled={!isAnalyzed}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Post Case to Marketplace <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
