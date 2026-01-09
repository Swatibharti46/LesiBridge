import React from 'react';
import { Consultation } from '../types';
import { X, Sparkles, ListChecks, Paperclip, LoaderCircle } from 'lucide-react';

interface VaultModalProps {
  consultation: Consultation;
  isLoadingSummary: boolean;
  onClose: () => void;
}

export const VaultModal: React.FC<VaultModalProps> = ({ consultation, isLoadingSummary, onClose }) => {
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-slate-900">Consultation Vault</h3>
            <p className="text-xs text-slate-500">Record for {consultation.category} with {consultation.lawyerName}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {/* AI Summary Section */}
          <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
            <h4 className="font-bold text-blue-900 flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-blue-500" />
              AI-Generated Summary Notes
            </h4>
            {isLoadingSummary ? (
              <div className="flex items-center gap-2 text-slate-500">
                <LoaderCircle className="w-4 h-4 animate-spin" />
                <span>Generating your summary...</span>
              </div>
            ) : (
              <p className="text-sm text-slate-700 whitespace-pre-wrap">{consultation.summaryNotes}</p>
            )}
          </div>
          
          {/* Action Items Section */}
          {consultation.actionItems && consultation.actionItems.length > 0 && (
            <div className="p-4 border border-slate-200 rounded-lg">
              <h4 className="font-bold text-slate-900 flex items-center gap-2 mb-2">
                <ListChecks className="w-5 h-5 text-slate-500" />
                Next-Step Action Plan
              </h4>
              <ul className="space-y-2">
                {consultation.actionItems.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Documents Section */}
          {consultation.documents && consultation.documents.length > 0 && (
             <div className="p-4 border border-slate-200 rounded-lg">
                <h4 className="font-bold text-slate-900 flex items-center gap-2 mb-2">
                  <Paperclip className="w-5 h-5 text-slate-500" />
                  Uploaded Documents
                </h4>
                <div className="space-y-2">
                    {consultation.documents.map((doc, i) => (
                      <a 
                        key={i} 
                        href={doc.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-2 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors"
                      >
                         <span className="text-sm font-medium text-slate-800">{doc.name}</span>
                         <span className="text-xs text-blue-600 font-semibold">Download</span>
                      </a>
                    ))}
                </div>
             </div>
          )}
        </div>
        
        <div className="p-4 bg-slate-50 border-t flex justify-end">
          <button onClick={onClose} className="px-6 py-2 bg-slate-800 text-white font-semibold rounded-lg">Close</button>
        </div>
      </div>
    </div>
  );
};
