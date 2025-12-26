import React, { useState } from 'react';
import { CaseData, CaseStatus, Bid } from '../types';
import { Briefcase, Clock, DollarSign, CheckCircle2 } from 'lucide-react';

interface LawyerDashboardProps {
  cases: CaseData[];
  onPlaceBid: (caseId: string, amount: number, message: string) => void;
}

export const LawyerDashboard: React.FC<LawyerDashboardProps> = ({ cases, onPlaceBid }) => {
  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const [bidAmount, setBidAmount] = useState<string>('');
  const [bidMessage, setBidMessage] = useState<string>('');

  const availableCases = cases.filter(c => c.status === CaseStatus.OPEN);

  const handleSubmitBid = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCase && bidAmount) {
      onPlaceBid(selectedCase, parseFloat(bidAmount), bidMessage);
      setSelectedCase(null);
      setBidAmount('');
      setBidMessage('');
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Marketplace</h2>
          <p className="text-slate-500">Find new cases fitting your expertise.</p>
        </div>
        <div className="flex gap-4">
           <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm text-sm">
             <span className="text-slate-500 block text-xs">Platform Fee</span>
             <span className="font-bold text-emerald-600">0% (Early Bird)</span>
           </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Case List */}
        <div className="lg:col-span-2 space-y-4">
          {availableCases.length === 0 ? (
             <div className="bg-white p-12 text-center rounded-xl border border-slate-200 border-dashed">
                <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900">No open cases</h3>
                <p className="text-slate-500">Check back later for new startup clients.</p>
             </div>
          ) : (
            availableCases.map((c) => (
              <div key={c.id} className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-700 mb-2">
                        {c.keyIssues[0] || "General Law"}
                      </span>
                      <h3 className="text-xl font-bold text-slate-900">{c.title}</h3>
                    </div>
                    <div className="text-right">
                       <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Est. Budget</span>
                       <div className="font-medium text-slate-900">{c.suggestedBudgetRange}</div>
                    </div>
                  </div>
                  
                  <p className="text-slate-600 mb-4 line-clamp-2">{c.aiSummary}</p>
                  
                  <div className="flex items-center gap-6 text-sm text-slate-500 mb-6">
                    <div className="flex items-center gap-1">
                       <Clock className="w-4 h-4" /> Posted {new Date(c.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                       <Briefcase className="w-4 h-4" /> {c.clientName}
                    </div>
                  </div>

                  {selectedCase === c.id ? (
                    <form onSubmit={handleSubmitBid} className="bg-slate-50 p-4 rounded-lg border border-slate-200 animate-fade-in">
                      <h4 className="font-semibold text-slate-800 mb-3">Submit Proposal</h4>
                      <div className="grid grid-cols-2 gap-4 mb-3">
                         <div>
                           <label className="block text-xs font-medium text-slate-600 mb-1">Fixed Price ($)</label>
                           <input 
                              type="number" 
                              required
                              className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                              value={bidAmount}
                              onChange={(e) => setBidAmount(e.target.value)}
                           />
                         </div>
                         <div>
                           <label className="block text-xs font-medium text-slate-600 mb-1">Turnaround (Days)</label>
                           <input type="number" className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 5" />
                         </div>
                      </div>
                      <div className="mb-3">
                        <label className="block text-xs font-medium text-slate-600 mb-1">Message to Client</label>
                        <textarea 
                          className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none h-20 resize-none"
                          placeholder="Why are you the right fit?"
                          value={bidMessage}
                          onChange={(e) => setBidMessage(e.target.value)}
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                         <button 
                           type="button" 
                           onClick={() => setSelectedCase(null)}
                           className="px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900"
                         >
                           Cancel
                         </button>
                         <button 
                           type="submit"
                           className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
                         >
                           Send Proposal
                         </button>
                      </div>
                    </form>
                  ) : (
                    <button
                      onClick={() => setSelectedCase(c.id)}
                      className="w-full py-2.5 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-colors flex items-center justify-center gap-2"
                    >
                      View Details & Bid
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Sidebar Stats */}
        <div className="hidden lg:block space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4">Lawyer Stats</h3>
            <div className="space-y-4">
               <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                 <span className="text-slate-600">Win Rate</span>
                 <span className="font-bold text-slate-900">12%</span>
               </div>
               <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                 <span className="text-slate-600">Total Earnings</span>
                 <span className="font-bold text-slate-900">$4,250</span>
               </div>
               <div className="flex justify-between items-center">
                 <span className="text-slate-600">Pending Bids</span>
                 <span className="font-bold text-slate-900">2</span>
               </div>
            </div>
          </div>

          <div className="bg-blue-900 p-6 rounded-xl shadow-lg text-white relative overflow-hidden">
             <div className="relative z-10">
               <h3 className="font-bold text-lg mb-2">Verification Badge</h3>
               <p className="text-blue-200 text-sm mb-4">You are a verified attorney on LexBridge.</p>
               <div className="flex items-center gap-2 text-emerald-400 font-bold">
                 <CheckCircle2 className="w-5 h-5" /> Active
               </div>
             </div>
             <div className="absolute -bottom-4 -right-4 text-blue-800 opacity-20 rotate-12">
               <Briefcase className="w-32 h-32" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};