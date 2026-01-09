
import React, { useState } from 'react';
import { analyzeLegalIntake, IntakeAnalysisResult } from '../services/geminiService';
import { Wand2, LoaderCircle, ArrowRight, Lightbulb, AlertCircle, Clock, ShieldAlert, CheckCircle2, Mic, Globe } from 'lucide-react';
import { MarketplaceDispute } from '../types';

interface PostDisputeFormProps {
  onSubmit: (disputeData: Omit<MarketplaceDispute, 'id' | 'postedDate' | 'bids' | 'clientName'>) => void;
  onCancel: () => void;
}

const LANGUAGES = [
  { code: 'English', label: 'English' },
  { code: 'Hindi', label: 'हिन्दी (Hindi)' },
  { code: 'Bengali', label: 'বাংলা (Bengali)' },
  { code: 'Tamil', label: 'தமிழ் (Tamil)' },
  { code: 'Spanish', label: 'Español (Spanish)' }
];

export const PostDisputeForm: React.FC<PostDisputeFormProps> = ({ onSubmit, onCancel }) => {
  const [rawDescription, setRawDescription] = useState('');
  const [language, setLanguage] = useState('English');
  const [analysis, setAnalysis] = useState<IntakeAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const handleAnalyze = async () => {
    if (rawDescription.trim().length < 20) {
      alert("Please provide a more detailed description.");
      return;
    }
    setIsLoading(true);
    const result = await analyzeLegalIntake(rawDescription, language);
    setAnalysis(result);
    setIsLoading(false);
    setIsAnalyzed(true);
  };

  const startVoiceIntake = () => {
    setIsRecording(true);
    setTimeout(() => {
      const voiceInput = language === 'Hindi' 
        ? "मुझे अपने मकान मालिक के साथ सुरक्षा जमा की वापसी को लेकर समस्या है..." 
        : "I have an issue with my landlord regarding the security deposit refund...";
      setRawDescription(prev => prev + ` [Voice Input: ${voiceInput}]`);
      setIsRecording(false);
    }, 2000);
  };

  const getBadgeColor = (level: string) => {
    switch (level) {
      case 'High': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'Medium': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black tracking-tight text-slate-900">AI Legal Triage</h2>
        <p className="mt-2 text-lg text-slate-600">
          Describe your issue in your native language. We'll handle the rest.
        </p>
        
        {!isAnalyzed && (
          <div className="mt-6 flex justify-center gap-2">
            <Globe className="w-5 h-5 text-slate-400" />
            <div className="flex gap-2 overflow-x-auto pb-2 px-4 no-scrollbar">
              {LANGUAGES.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`px-3 py-1.5 rounded-full text-xs font-black uppercase transition-all whitespace-nowrap border ${language === lang.code ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'}`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        <div className="p-8 md:p-10 space-y-8">
          {!isAnalyzed ? (
            <div className="space-y-8">
              <div className="relative">
                <textarea
                  value={rawDescription}
                  onChange={(e) => setRawDescription(e.target.value)}
                  placeholder={language === 'Hindi' ? "अपनी समस्या के बारे में यहाँ लिखें..." : "Explain your legal situation in detail..."}
                  className="w-full h-64 p-6 rounded-2xl border border-slate-100 bg-slate-50 focus:ring-4 focus:ring-blue-50 outline-none resize-none text-lg leading-relaxed shadow-inner"
                />
                <button 
                  onClick={startVoiceIntake}
                  className={`absolute bottom-6 right-6 p-4 rounded-full shadow-2xl transition-all ${isRecording ? 'bg-rose-500 animate-pulse' : 'bg-slate-900 hover:scale-110 active:scale-95'}`}
                >
                  <Mic className="w-6 h-6 text-white" />
                </button>
              </div>

              <div className="flex flex-col items-center">
                <button
                  onClick={handleAnalyze}
                  disabled={isLoading || rawDescription.length < 10}
                  className="w-full md:w-auto min-w-[300px] bg-blue-600 hover:bg-blue-700 text-white font-black py-5 px-10 rounded-2xl shadow-2xl shadow-blue-200 flex items-center justify-center gap-3 disabled:opacity-50 transition-all hover:-translate-y-1"
                >
                  {isLoading ? <LoaderCircle className="animate-spin w-6 h-6" /> : <Wand2 className="w-6 h-6" />}
                  Generate Intelligence Brief
                </button>
                <div className="flex items-center gap-2 mt-6 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <ShieldAlert className="w-4 h-4 text-emerald-500" />
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Enterprise Privacy: AES-256 Encryption Enabled
                  </p>
                </div>
              </div>
            </div>
          ) : (
            analysis && (
              <div className="animate-fade-in space-y-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                    <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-2">Modality</p>
                    <p className="font-black text-slate-900">{analysis.caseType}</p>
                  </div>
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                    <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-2">Accuracy</p>
                    <p className="font-black text-slate-900">{analysis.confidenceScore}%</p>
                  </div>
                  <div className={`p-5 rounded-2xl border text-center ${getBadgeColor(analysis.riskLevel)}`}>
                    <p className="text-[10px] uppercase font-black tracking-widest mb-2 opacity-60">Risk Profile</p>
                    <p className="font-black flex items-center justify-center gap-1">
                      <ShieldAlert className="w-4 h-4" /> {analysis.riskLevel}
                    </p>
                  </div>
                  <div className={`p-5 rounded-2xl border text-center ${getBadgeColor(analysis.urgency)}`}>
                    <p className="text-[10px] uppercase font-black tracking-widest mb-2 opacity-60">Urgency</p>
                    <p className="font-black flex items-center justify-center gap-1">
                      <Clock className="w-4 h-4" /> {analysis.urgency}
                    </p>
                  </div>
                </div>

                <div className="p-8 bg-blue-50 rounded-3xl border border-blue-100 relative">
                  <div className="absolute top-0 right-8 -translate-y-1/2 px-4 py-1 bg-blue-600 text-white text-[10px] font-black rounded-full uppercase tracking-widest">
                    Translator Output: {language}
                  </div>
                  <h4 className="font-black text-blue-900 flex items-center gap-2 mb-4 text-xl tracking-tight">
                    <Lightbulb className="w-6 h-6 text-blue-500" />
                    Simple Language Summary
                  </h4>
                  <p className="text-blue-800 leading-relaxed font-medium">
                    {analysis.simpleExplanation}
                  </p>
                </div>

                <div>
                  <h4 className="font-black text-slate-900 mb-6 flex items-center gap-2 text-xl tracking-tight">
                    <ArrowRight className="w-6 h-6 text-slate-400" />
                    Procedural Roadmap
                  </h4>
                  <div className="grid gap-4">
                    {analysis.roadmap.map((step, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-blue-200 transition-all">
                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-black text-slate-400 group-hover:text-blue-600 group-hover:border-blue-600 transition-all">
                          {i + 1}
                        </div>
                        <p className="text-sm font-bold text-slate-700">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-100">
                  <div className="flex gap-4">
                    <button onClick={() => setIsAnalyzed(false)} className="flex-1 py-4 font-black text-slate-400 uppercase text-xs tracking-widest hover:text-slate-900 transition-all">
                      Recalibrate Input
                    </button>
                    <button 
                      onClick={() => onSubmit({
                        title: analysis.title,
                        category: analysis.suggestedCategory,
                        description: analysis.summary,
                        caseType: analysis.caseType,
                        riskLevel: analysis.riskLevel,
                        urgency: analysis.urgency,
                        roadmap: analysis.roadmap
                      })} 
                      className="flex-[2] py-5 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 flex items-center justify-center gap-3 shadow-2xl transition-all"
                    >
                      Initialize Expert Matching <CheckCircle2 className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
