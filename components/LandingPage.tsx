import React from 'react';
import { UserRole } from '../types';
import { ArrowRight, Shield, CheckCircle, Clock } from 'lucide-react';

interface LandingPageProps {
  onLogin: (role: UserRole) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex flex-col justify-center items-center p-6">
      
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-12 items-center">
        
        {/* Left Column: Copy */}
        <div className="space-y-6">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight">
            Legal help for <br/>
            <span className="text-blue-600">Startups</span> made simple.
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            LexBridge connects founders with vetted startup lawyers. 
            Describe your problem, get AI-summarized briefs, and receive fixed-fee bids within hours.
          </p>
          
          <div className="space-y-3 pt-4">
            <div className="flex items-center gap-3 text-slate-700">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              <span>AI-Powered Intake Briefs</span>
            </div>
            <div className="flex items-center gap-3 text-slate-700">
              <Shield className="w-5 h-5 text-emerald-500" />
              <span>Bank-Grade Escrow Payments</span>
            </div>
            <div className="flex items-center gap-3 text-slate-700">
              <Clock className="w-5 h-5 text-emerald-500" />
              <span>Get bids in under 24 hours</span>
            </div>
          </div>
        </div>

        {/* Right Column: Cards */}
        <div className="grid gap-6">
          {/* Client Card */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 hover:shadow-2xl transition-all hover:-translate-y-1 group">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">I'm a Founder</h2>
            <p className="text-slate-500 mb-6">Describe your legal issue and receive bids from top attorneys.</p>
            <button
              onClick={() => onLogin(UserRole.CLIENT)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              Post a Case <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Lawyer Card */}
          <div className="bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-800 hover:shadow-2xl transition-all hover:-translate-y-1 group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Shield className="w-32 h-32 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">I'm a Lawyer</h2>
            <p className="text-slate-400 mb-6">Access a curated stream of high-quality startup legal cases.</p>
            <button
              onClick={() => onLogin(UserRole.LAWYER)}
              className="w-full bg-white hover:bg-slate-100 text-slate-900 font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              Find Clients <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-xs text-slate-500 mt-4 text-center">
              0% Platform Fees for first 50 lawyers (Early Bird)
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};