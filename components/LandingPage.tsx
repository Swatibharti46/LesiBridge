import React from 'react';
import { UserRole } from '../types';
import { ArrowRight, Shield, CheckCircle, Clock, Sparkles, Scale } from 'lucide-react';

interface LandingPageProps {
  onLogin: (role: UserRole) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50 -z-10"></div>
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-50 -z-10"></div>

      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-16 items-center">
        
        {/* Left Column: Copy */}
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-xs font-black uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" /> Next-Gen Legal Triage
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-none">
            Enterprise Intel<br/>
            <span className="text-blue-600">Legal Speed.</span>
          </h1>
          
          <p className="text-xl text-slate-600 leading-relaxed max-w-lg">
            NyayaAI connects startups with vetted attorneys through an AI-powered triage system that maps your roadmap before you spend a single rupee.
          </p>
          
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Fixed Pricing</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <Shield className="w-5 h-5 text-blue-500 shrink-0" />
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">AES-256 Vault</span>
            </div>
          </div>
        </div>

        {/* Right Column: Portal Access */}
        <div className="grid gap-6">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-100 hover:shadow-blue-500/10 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Scale className="w-32 h-32" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Client Portal</h2>
            <p className="text-slate-500 mb-8 font-medium">Access AI Document Intel and book expert consultations in minutes.</p>
            <button
              onClick={() => onLogin(UserRole.CLIENT)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 px-4 rounded-[1.5rem] flex items-center justify-center gap-3 transition-all hover:scale-[1.02] shadow-xl shadow-blue-500/20 uppercase tracking-widest text-sm"
            >
              Get Legal Advice <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="bg-slate-900 p-10 rounded-[2.5rem] shadow-2xl border border-slate-800 hover:shadow-indigo-500/10 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Shield className="w-32 h-32 text-white" />
            </div>
            <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Legal Network</h2>
            <p className="text-slate-400 mb-8 font-medium">Join our global network of top-tier attorneys and manage your practice node.</p>
            <button
              onClick={() => onLogin(UserRole.LAWYER)}
              className="w-full bg-white hover:bg-slate-100 text-slate-900 font-black py-5 px-4 rounded-[1.5rem] flex items-center justify-center gap-3 transition-all hover:scale-[1.02] shadow-xl uppercase tracking-widest text-sm"
            >
              Attorney Access <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-10 flex gap-6 items-center">
        <button onClick={() => onLogin(UserRole.ADMIN)} className="text-[10px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-[0.3em] transition-colors">
          Admin Node
        </button>
        <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">v1.0.0 MVP</span>
      </div>
    </div>
  );
};