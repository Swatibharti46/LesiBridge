import React, { useState } from 'react';
import { LawyerProfile } from '../types';
import { Star, ShieldCheck, MapPin, Briefcase, GraduationCap, X, Check, MessageCircle, Clock } from 'lucide-react';

interface LawyerDirectoryProps {
  lawyers: LawyerProfile[];
  onRequestConsultation: (lawyer: LawyerProfile, timeSlot: string) => void;
}

export const LawyerDirectory: React.FC<LawyerDirectoryProps> = ({ lawyers, onRequestConsultation }) => {
  const [selectedLawyer, setSelectedLawyer] = useState<LawyerProfile | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string>('');

  const handleCardClick = (lawyer: LawyerProfile) => {
    setSelectedSlot(''); // Reset slot selection when opening modal
    setSelectedLawyer(lawyer);
  };
  
  const approvedLawyers = lawyers.filter(l => l.status === 'APPROVED');

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Attorney Directory</h2>
        <p className="text-slate-500">Browse vetted and approved startup lawyers for a consultation.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {approvedLawyers.map((lawyer) => (
          <div 
            key={lawyer.id} 
            onClick={() => handleCardClick(lawyer)}
            className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group overflow-hidden flex flex-col"
          >
            <div className="p-6 flex-1">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold text-lg">
                    {lawyer.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{lawyer.name}</h3>
                    <div className="text-xs text-slate-500 flex items-center gap-1">
                      <Briefcase className="w-3 h-3" /> {lawyer.firm}
                    </div>
                  </div>
                </div>
                {lawyer.verified && (
                  <div className="text-emerald-500" title="Verified Attorney">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {lawyer.specialties.slice(0, 3).map((spec, idx) => (
                  <span key={idx} className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-md font-medium">
                    {spec}
                  </span>
                ))}
                {lawyer.specialties.length > 3 && (
                  <span className="text-xs px-2 py-1 bg-slate-50 text-slate-500 rounded-md">+{lawyer.specialties.length - 3}</span>
                )}
              </div>
              
              <p className="text-sm text-slate-600 line-clamp-3 mb-4">
                {lawyer.bio}
              </p>

              <div className="flex items-center gap-4 text-sm text-slate-500 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="font-bold text-slate-900">{lawyer.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Briefcase className="w-4 h-4" />
                  <span>{lawyer.yearsExperience} Yrs Exp.</span>
                </div>
                <div className="flex items-center gap-1 ml-auto font-bold text-slate-900">
                  ${lawyer.rate}/hr
                </div>
              </div>
            </div>
            
            <div className="bg-slate-50 p-3 border-t border-slate-100 flex justify-center">
               <button className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-2">
                 <MessageCircle className="w-4 h-4" /> View Profile & Book
               </button>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedLawyer && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
            <div className="p-6 md:p-8 overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                 <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-2xl">
                      {selectedLawyer.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">{selectedLawyer.name}</h2>
                      <div className="flex items-center gap-2 text-slate-500">
                        <MapPin className="w-4 h-4" /> {selectedLawyer.location}
                      </div>
                    </div>
                 </div>
                 <button onClick={() => setSelectedLawyer(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                   <X className="w-6 h-6 text-slate-400" />
                 </button>
              </div>

              <div className="space-y-6">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" /> Available Time Slots
                  </h3>
                  {selectedLawyer.availability.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedLawyer.availability.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => setSelectedSlot(slot)}
                          className={`p-2 rounded-lg border text-sm text-left font-medium transition-colors ${
                            selectedSlot === slot
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 bg-slate-100 p-3 rounded-lg">
                      This lawyer has not listed their availability. Please check back later.
                    </p>
                  )}
                </div>

                <p className="text-slate-600 leading-relaxed text-sm">{selectedLawyer.bio}</p>
                {/* Other details can be added here if needed */}
              </div>
            </div>

            <div className="mt-auto p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
              <button onClick={() => setSelectedLawyer(null)} className="px-4 py-2 text-slate-600 font-medium hover:text-slate-900">
                Close
              </button>
              <button 
                onClick={() => {
                  if (selectedLawyer) {
                    onRequestConsultation(selectedLawyer, selectedSlot);
                  }
                  setSelectedLawyer(null);
                }}
                disabled={!selectedSlot}
                className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold flex items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MessageCircle className="w-4 h-4" /> Request Consultation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};