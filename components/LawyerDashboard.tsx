import React, { useState } from 'react';
import { Consultation, ConsultationStatus, InternalDispute, LawyerProfile } from '../types';
import { Briefcase, Clock, DollarSign, Calendar, AlertTriangle, Star, MessageSquareText } from 'lucide-react';

interface LawyerDashboardProps {
  lawyerProfile: LawyerProfile;
  consultations: Consultation[];
  disputes: InternalDispute[];
  availability: string[];
  lawyerId: string;
}

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center">
    {[...Array(5)].map((_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} />
    ))}
  </div>
);

export const LawyerDashboard: React.FC<LawyerDashboardProps> = ({ lawyerProfile, consultations, disputes, availability, lawyerId }) => {
  const [activeTab, setActiveTab] = useState<'schedule' | 'earnings' | 'disputes' | 'reputation'>('schedule');

  const upcomingConsultations = consultations.filter(c => c.status === ConsultationStatus.BOOKED);
  const completedConsultations = consultations.filter(c => c.status === ConsultationStatus.COMPLETED);
  const totalEarnings = completedConsultations.reduce((sum, c) => sum + c.price, 0);
  const assignedDisputes = disputes.filter(d => d.assignedLawyerId === lawyerId);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Lawyer Dashboard</h2>
          <p className="text-slate-500">Manage your schedule, track earnings, and view your reputation.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="flex gap-6 border-b border-slate-200 mb-6">
            <button
              onClick={() => setActiveTab('schedule')}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'schedule' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              Schedule
            </button>
            <button
              onClick={() => setActiveTab('earnings')}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'earnings' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              Earnings
            </button>
             <button
              onClick={() => setActiveTab('reputation')}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'reputation' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              Reputation
            </button>
            <button
              onClick={() => setActiveTab('disputes')}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'disputes' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              Internal Disputes
            </button>
          </div>

          {/* Schedule View */}
          {activeTab === 'schedule' && (
            <div className="space-y-6">
              <h3 className="font-bold text-slate-900 text-lg">Upcoming Consultations</h3>
              {upcomingConsultations.map(c => (
                <div key={c.id} className="bg-white p-4 rounded-lg border border-slate-200 flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-slate-800">{c.category}: {c.duration} min call</p>
                    <p className="text-sm text-slate-500">With {c.clientName}</p>
                    <p className="text-sm text-slate-500 font-medium mt-1">{c.scheduledTime}</p>
                  </div>
                  <a href={c.meetLink} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">Join Meet</a>
                </div>
              ))}
            </div>
          )}

          {/* Earnings View */}
          {activeTab === 'earnings' && (
            <div className="space-y-6">
              <h3 className="font-bold text-slate-900 text-lg">Completed Consultations</h3>
              {completedConsultations.map(c => (
                <div key={c.id} className="bg-white p-4 rounded-lg border border-slate-200 flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-slate-800">{c.category}: {c.duration} min call</p>
                    <p className="text-sm text-slate-500">With {c.clientName} on {new Date(c.scheduledTime).toLocaleDateString()}</p>
                  </div>
                  <div className="font-bold text-emerald-600">+ ₹{c.price}</div>
                </div>
              ))}
            </div>
          )}

          {/* Reputation View */}
          {activeTab === 'reputation' && (
            <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg border border-slate-200 flex items-center justify-around text-center">
                    <div>
                        <p className="text-3xl font-bold text-slate-900">{lawyerProfile.rating.toFixed(1)}</p>
                        <p className="text-sm text-slate-500">Overall Rating</p>
                    </div>
                     <div>
                        <p className="text-3xl font-bold text-slate-900">{lawyerProfile.ratings.length}</p>
                        <p className="text-sm text-slate-500">Total Reviews</p>
                    </div>
                </div>
              <h3 className="font-bold text-slate-900 text-lg">Client Feedback</h3>
              {lawyerProfile.ratings.length === 0 ? (
                 <p className="text-slate-500">No feedback received yet.</p>
              ): (
                lawyerProfile.ratings.map(r => (
                  <div key={r.consultationId} className="bg-white p-4 rounded-lg border border-slate-200">
                     <div className="flex justify-between items-center mb-2">
                        <p className="font-semibold text-slate-800">{r.clientName}</p>
                        <StarRating rating={r.rating} />
                     </div>
                     <p className="text-sm italic text-slate-600">"{r.feedback}"</p>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Disputes View */}
          {activeTab === 'disputes' && (
             <div className="space-y-6">
               <h3 className="font-bold text-slate-900 text-lg">Assigned Internal Disputes</h3>
               {assignedDisputes.map(d => (
                 <div key={d.id} className="bg-white p-4 rounded-lg border border-amber-300">
                   <p className="font-semibold text-slate-800">Case: {d.consultationId}</p>
                   <p className="text-sm text-slate-500">Client: {d.clientName} vs. Lawyer: {d.lawyerName}</p>
                   <p className="text-sm italic text-slate-600 mt-2">"{d.reason}"</p>
                   <button className="mt-3 px-3 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-md">Review Case Details</button>
                 </div>
               ))}
             </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-500"/>
              Payouts
            </h3>
            <div className="space-y-4">
              <div className="text-center bg-slate-50 p-4 rounded-lg">
                <span className="text-xs text-slate-500 uppercase tracking-wide">Total Earnings</span>
                <p className="text-3xl font-bold text-slate-900">₹{totalEarnings.toLocaleString()}</p>
              </div>
              <button className="w-full py-2 bg-slate-900 text-white rounded-lg font-medium">
                View Payout History
              </button>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              Manage Availability
            </h3>
            <div className="space-y-2">
              {availability.map((slot, i) => (
                <div key={i} className="bg-slate-50 p-2 rounded text-sm text-slate-700">{slot}</div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50">
              Update Slots
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};