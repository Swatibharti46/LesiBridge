import React, { useState } from 'react';
import { CaseData, CaseStatus, Bid } from '../types';
import { FileText, MessageSquare, ShieldCheck, CreditCard } from 'lucide-react';

interface ClientDashboardProps {
  cases: CaseData[];
  onNewCase: () => void;
  onAcceptBid: (caseId: string, bidId: string) => void;
}

export const ClientDashboard: React.FC<ClientDashboardProps> = ({ cases, onNewCase, onAcceptBid }) => {
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');

  // Filter cases based on active tab logic for demo purposes
  // In a real app, this would be more strict
  const displayCases = cases.filter(c => activeTab === 'active' ? c.status !== CaseStatus.COMPLETED : c.status === CaseStatus.COMPLETED);

  const handleEscrowPayment = (caseId: string, bid: Bid) => {
    // Simulate Stripe Flow
    const confirmed = window.confirm(`Proceed to payment gateway?\n\nTransfer $${bid.amount} to Escrow for ${bid.lawyerName}?`);
    if (confirmed) {
        onAcceptBid(caseId, bid.id);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">My Legal Cases</h2>
          <p className="text-slate-500">Manage your intakes and proposals.</p>
        </div>
        <button 
          onClick={onNewCase}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
        >
          <FileText className="w-4 h-4" /> New Case Intake
        </button>
      </div>

      <div className="flex gap-6 border-b border-slate-200 mb-6">
        <button 
          onClick={() => setActiveTab('active')}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'active' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Active Cases
        </button>
        <button 
          onClick={() => setActiveTab('completed')}
           className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'completed' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Past History
        </button>
      </div>

      <div className="space-y-6">
        {displayCases.length === 0 ? (
           <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-200 border-dashed">
             <p className="text-slate-500">No cases found in this view.</p>
           </div>
        ) : (
          displayCases.map((c) => (
            <div key={c.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
               {/* Header */}
               <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                 <div className="flex justify-between items-start">
                   <div>
                     <div className="flex items-center gap-3 mb-1">
                       <h3 className="text-lg font-bold text-slate-900">{c.title}</h3>
                       <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                         c.status === CaseStatus.OPEN ? 'bg-green-100 text-green-700' :
                         c.status === CaseStatus.PENDING_ESCROW ? 'bg-amber-100 text-amber-700' :
                         'bg-slate-100 text-slate-600'
                       }`}>
                         {c.status}
                       </span>
                     </div>
                     <p className="text-sm text-slate-500">Created: {new Date(c.createdAt).toLocaleDateString()}</p>
                   </div>
                   <div className="text-right">
                      {c.bids.length > 0 && c.status === CaseStatus.OPEN && (
                         <div className="animate-pulse text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                           {c.bids.length} Lawyer Proposal{c.bids.length !== 1 ? 's' : ''} Received
                         </div>
                      )}
                   </div>
                 </div>
               </div>

               {/* Content */}
               <div className="p-6">
                  <div className="mb-6">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">AI Summary</h4>
                    <p className="text-slate-700 text-sm bg-slate-50 p-3 rounded border border-slate-100">{c.aiSummary}</p>
                  </div>

                  {/* Bids Section */}
                  {c.status === CaseStatus.OPEN && (
                    <div>
                      <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-blue-500" /> Proposals
                      </h4>
                      {c.bids.length === 0 ? (
                        <p className="text-slate-400 text-sm italic">Waiting for lawyers to review your case...</p>
                      ) : (
                        <div className="grid gap-4 md:grid-cols-2">
                          {c.bids.map(bid => (
                            <div key={bid.id} className="border border-slate-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                               <div className="flex justify-between items-center mb-2">
                                 <span className="font-bold text-slate-800">{bid.lawyerName}</span>
                                 <span className="font-bold text-emerald-600">${bid.amount}</span>
                               </div>
                               <p className="text-xs text-slate-500 mb-4 italic">"{bid.message}"</p>
                               <button 
                                 onClick={() => handleEscrowPayment(c.id, bid)}
                                 className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded flex items-center justify-center gap-2"
                               >
                                 <ShieldCheck className="w-3 h-3" /> Hire & Deposit Escrow
                               </button>
                               <p className="text-[10px] text-center text-slate-400 mt-2">
                                 Funds held securely until job complete
                               </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {c.status === CaseStatus.PENDING_ESCROW && (
                     <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4 flex items-center gap-4">
                        <div className="p-3 bg-white rounded-full border border-emerald-100 shadow-sm">
                          <CreditCard className="w-6 h-6 text-emerald-500" />
                        </div>
                        <div>
                          <h4 className="font-bold text-emerald-900">Funds in Escrow</h4>
                          <p className="text-sm text-emerald-700">The lawyer has been notified to start work. Funds will be released upon completion.</p>
                        </div>
                     </div>
                  )}
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};