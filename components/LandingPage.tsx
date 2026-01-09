import React from 'react';
import { UserRole } from '../types';
import { ArrowRight, Shield, CheckCircle, Clock } from 'lucide-react';

interface LandingPageProps {
  onLogin: (role: UserRole) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex flex-col justify-center items-center p-6 relative">
      
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-12 items-center">
        
        {/* Left Column: Copy */}
        <div className="space-y-6">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight">
            Fast, transparent<br/>
            <span className="text-blue-600">Legal Advice</span> for everyone.
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            LexBridge connects you with vetted lawyers for fixed-price consultations.
            Describe your issue, pick a time, and get expert advice via Google Meet.
          </p>
          
          <div className="space-y-3 pt-4">
            <div className="flex items-center gap-3 text-slate-700">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              <span>Fixed Prices: ₹499 for 15 min, ₹899 for 30 min</span>
            </div>
            <div className="flex items-center gap-3 text-slate-700">
              <Shield className="w-5 h-5 text-emerald-500" />
              <span>Secure Payments via Stripe/Razorpay</span>
            </div>
            <div className="flex items-center gap-3 text-slate-700">
              <Clock className="w-5 h-5 text-emerald-500" />
              <span>Book a consultation in minutes</span>
            </div>
          </div>
        </div>

        {/* Right Column: Cards */}
        <div className="grid gap-6">
          {/* Client Card */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 hover:shadow-2xl transition-all hover:-translate-y-1 group">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">I need Legal Advice</h2>
            <p className="text-slate-500 mb-6">Get expert advice on contracts, GST, IP, and more.</p>
            <button
              onClick={() => onLogin(UserRole.CLIENT)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              Book a Consultation <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Lawyer Card */}
          <div className="bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-800 hover:shadow-2xl transition-all hover:-translate-y-1 group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Shield className="w-32 h-32 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">I'm a Lawyer</h2>
            <p className="text-slate-400 mb-6">Join our network to consult with individuals and small businesses.</p>
            <button
              onClick={() => onLogin(UserRole.LAWYER)}
              className="w-full bg-white hover:bg-slate-100 text-slate-900 font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              Join the Platform <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-4">
        <button onClick={() => onLogin(UserRole.ADMIN)} className="text-sm text-slate-400 hover:text-slate-600">
          Admin Login
        </button>
      </div>
    </div>
  );
};