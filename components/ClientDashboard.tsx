import React, { useState } from 'react';
import { Consultation, ConsultationStatus } from '../types';
import { FileText, Clock, Video, Star, MessageSquare, AlertTriangle, LayoutGrid, ShoppingBag, Gavel, X, Download, Archive } from 'lucide-react';

interface ClientDashboardProps {
  consultations: Consultation[];
  onNavigate: (view: 'MARKETPLACE' | 'DISPUTE_MARKETPLACE' | 'POST_DISPUTE') => void;
  onOpenChat: (consultation: Consultation) => void;
  onRaiseDispute: (consultation: Consultation) => void;
  onRateLawyer: (consultationId: string, rating: number, feedback: string) => void;
  onOpenVault: (consultationId: string) => void;
}

const RatingModal = ({ consultation, onClose, onSubmit }: { consultation: Consultation, onClose: () => void, onSubmit: (rating: number, feedback: string) => void }) => {
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');

    const handleSubmit = () => {
        if (rating === 0) {
            alert("Please select a star rating.");
            return;
        }
        onSubmit(rating, feedback);
        onClose();
    };
    
    return (
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center">
                <h3 className="font-bold text-slate-900">Rate your consultation with {consultation.lawyerName}</h3>
                <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full"><X className="w-5 h-5 text-slate-500" /></button>
            </div>
            <div className="p-6 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Overall Rating</label>
                    <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                           <Star key={i} onClick={() => setRating(i + 1)} className={`w-8 h-8 cursor-pointer transition-colors ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300 hover:text-amber-300'}`} />
                        ))}
                    </div>
                </div>
                 <div>
                    <label htmlFor="feedback" className="block text-sm font-medium text-slate-700 mb-2">Share your experience (optional)</label>
                    <textarea
                        id="feedback"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="What went well? What could be improved?"
                        className="w-full h-24 p-2 border border-slate-300 rounded-lg"
                    />
                </div>
            </div>
             <div className="p-4 bg-slate-50 border-t flex justify-end gap-3">
                <button onClick={onClose} className="px-4 py-2 text-slate-700 font-medium">Cancel</button>
                <button onClick={handleSubmit} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg">Submit Review</button>
             </div>
        </div>
      </div>
    );
};


export const ClientDashboard: React.FC<ClientDashboardProps> = ({ consultations, onNavigate, onOpenChat, onRaiseDispute, onRateLawyer, onOpenVault }) => {
  const [activeTab, setActiveTab] = useState<'consultations'>('consultations');
  const [ratingModalOpen, setRatingModalOpen] = useState<Consultation | null>(null);

  const handleNavigate = (view: 'MARKETPLACE' | 'DISPUTE_MARKETPLACE') => {
    onNavigate(view);
  };
  
  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {ratingModalOpen && <RatingModal consultation={ratingModalOpen} onClose={() => setRatingModalOpen(null)} onSubmit={(rating, feedback) => onRateLawyer(ratingModalOpen.id, rating, feedback)} />}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Client Dashboard</h2>
          <p className="text-slate-500">Manage consultations and legal cases.</p>
        </div>
        <div className="flex gap-2">
            <button 
              onClick={() => handleNavigate('DISPUTE_MARKETPLACE')}
              className="bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 font-semibold py-2.5 px-6 rounded-lg transition-all flex items-center gap-2"
            >
              <Gavel className="w-4 h-4" /> Go to Disputes
            </button>
            <button 
              onClick={() => handleNavigate('MARKETPLACE')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" /> Book a Service
            </button>
        </div>
      </div>

      <div className="flex gap-2 border-b border-slate-200 mb-6">
        <button onClick={() => setActiveTab('consultations')} className={`px-4 py-2 text-sm font-medium flex items-center gap-2 ${activeTab==='consultations' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500'}`}>
            <LayoutGrid className="w-4 h-4" /> My Consultations
        </button>
        <button onClick={() => handleNavigate('MARKETPLACE')} className={`px-4 py-2 text-sm font-medium flex items-center gap-2 text-slate-500`}>
            <ShoppingBag className="w-4 h-4" /> Services Marketplace
        </button>
         <button onClick={() => handleNavigate('DISPUTE_MARKETPLACE')} className={`px-4 py-2 text-sm font-medium flex items-center gap-2 text-slate-500`}>
            <Gavel className="w-4 h-4" /> Dispute Marketplace
        </button>
      </div>

      {activeTab === 'consultations' && (
        <div className="space-y-6">
          {consultations.length === 0 ? (
             <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-200 border-dashed">
               <p className="text-slate-500">You have no booked consultations.</p>
               <button onClick={() => handleNavigate('MARKETPLACE')} className="mt-4 text-blue-600 font-semibold">Browse Services</button>
             </div>
          ) : (
            consultations.map((c) => (
              <div key={c.id} className="bg-white rounded-xl shadow-sm border border-slate-200">
                 <div className="p-6">
                   <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                     <div>
                       <div className="flex items-center gap-3 mb-1">
                         <h3 className="text-lg font-bold text-slate-900">{c.category} Advice</h3>
                         <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                           c.status === ConsultationStatus.BOOKED ? 'bg-blue-100 text-blue-700' :
                           'bg-green-100 text-green-700'
                         }`}>
                           {c.status}
                         </span>
                       </div>
                       <p className="text-sm text-slate-500">
                         {c.duration} min call with <span className="font-medium text-slate-700">{c.lawyerName}</span>
                       </p>
                     </div>
                     <div className="flex items-center gap-4">
                        <div className="text-right">
                           <div className="flex items-center gap-2 text-slate-600">
                              <Clock className="w-4 h-4"/> 
                              <span className="font-medium">{c.scheduledTime}</span>
                           </div>
                           <p className="font-bold text-slate-900 text-lg">₹{c.price}</p>
                        </div>
                        {c.status === ConsultationStatus.BOOKED && (
                          <a href={c.meetLink} target="_blank" rel="noopener noreferrer" className="px-4 py-4 bg-blue-600 text-white rounded-lg flex items-center gap-2 font-medium hover:bg-blue-700">
                             <Video className="w-5 h-5"/>
                          </a>
                        )}
                     </div>
                   </div>
                 </div>
                 {c.status === ConsultationStatus.COMPLETED && (
                  <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-wrap justify-end items-center gap-3">
                      <button onClick={() => onRaiseDispute(c)} className="px-4 py-2 text-sm text-amber-700 font-medium rounded-lg hover:bg-amber-100 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" /> Report Issue
                      </button>
                      {c.feedbackGiven === false ? (
                          <button onClick={() => setRatingModalOpen(c)} className="px-4 py-2 border border-slate-300 bg-white text-slate-600 rounded-lg flex items-center gap-2 font-medium hover:bg-slate-100">
                              <Star className="w-4 h-4"/> Rate Lawyer
                          </button>
                      ) : (
                          <div className="px-4 py-2 text-sm text-green-700 font-medium flex items-center gap-2">
                             <Star className="w-4 h-4 text-green-500" /> Feedback Submitted
                          </div>
                      )}
                      <button 
                        onClick={() => onOpenVault(c.id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 font-medium hover:bg-blue-700"
                      >
                          <Archive className="w-4 h-4"/> Open Vault
                      </button>
                  </div>
                 )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};