
import React from 'react';
import { Consultation } from '../types';
import { X, Sparkles, ListChecks, Paperclip, LoaderCircle, ShieldCheck, Lock, Key } from 'lucide-react';

interface VaultModalProps {
  consultation: Consultation;
  isLoadingSummary: boolean;
  onClose: () => void;
}

export const VaultModal: React.FC<VaultModalProps> = ({ consultation, isLoadingSummary, onClose }) => {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Enterprise Security Header */}
        <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-xl">
              <ShieldCheck className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="font-black text-lg tracking-tight">Encrypted Consultation Vault</h3>
              <div className="flex items-center gap-2 text-[10px] font-black text-blue-400 uppercase tracking-widest">
                <Lock className="w-3 h-3" /> AES-256 Cloud Protection Active
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-all">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <div className="flex-1 p-8 overflow-y-auto space-y-8 bg-slate-50/50">
          {/* AI Summary Section */}
          <div className="p-6 bg-white border border-blue-100 rounded-3xl shadow-xl shadow-blue-500/5 relative">
            <div className="absolute top-0 right-6 -translate-y-1/2 flex items-center gap-1.5 px-3 py-1 bg-white border border-blue-100 rounded-full shadow-sm text-[10px] font-black text-blue-600 uppercase">
              <Key className="w-3 h-3" /> Managed Key: NY-VAULT-PROD
            </div>
            <h4 className="font-black text-slate-900 flex items-center gap-2 mb-4 text-lg">
              <Sparkles className="w-5 h-5 text-blue-500" />
              Intelligence Briefing
            </h4>
            {isLoadingSummary ? (
              <div className="flex flex-col items-center py-8 gap-4">
                <LoaderCircle className="w-10 h-10 text-blue-500 animate-spin" />
                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Decrypting & Summarizing...</span>
              </div>
            ) : (
              <p className="text-sm text-slate-700 leading-relaxed font-medium whitespace-pre-wrap">{consultation.summaryNotes}</p>
            )}
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Action Items Section */}
            <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm">
              <h4 className="font-black text-slate-900 flex items-center gap-2 mb-4 text-sm uppercase tracking-widest">
                <ListChecks className="w-5 h-5 text-emerald-500" />
                Action Protocol
              </h4>
              <div className="space-y-3">
                {consultation.actionItems?.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                    <input type="checkbox" className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                    <span className="text-xs font-bold text-slate-600 leading-relaxed">{item}</span>
                  </div>
                )) || <p className="text-xs text-slate-400 italic">No specific action items listed.</p>}
              </div>
            </div>

            {/* Documents Section */}
            <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm">
              <h4 className="font-black text-slate-900 flex items-center gap-2 mb-4 text-sm uppercase tracking-widest">
                <Paperclip className="w-5 h-5 text-blue-500" />
                Stored Assets
              </h4>
              <div className="space-y-3">
                  {consultation.documents?.map((doc, i) => (
                    <a 
                      key={i} 
                      href={doc.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all border border-transparent hover:border-blue-100"
                    >
                       <div className="flex items-center gap-2 overflow-hidden">
                         <div className="p-1.5 bg-white rounded-lg border border-slate-100 shrink-0">
                           <Lock className="w-3 h-3 text-slate-400" />
                         </div>
                         <span className="text-xs font-black text-slate-700 truncate">{doc.name}</span>
                       </div>
                       <span className="text-[10px] font-black text-blue-600 uppercase shrink-0">Access</span>
                    </a>
                  )) || <p className="text-xs text-slate-400 italic">No files attached to this session.</p>}
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-slate-50 border-t flex justify-end">
          <button onClick={onClose} className="px-8 py-3 bg-slate-900 text-white font-black rounded-2xl text-sm uppercase tracking-widest hover:bg-slate-800 shadow-xl transition-all">
            Securely Close
          </button>
        </div>
      </div>
    </div>
  );
};
