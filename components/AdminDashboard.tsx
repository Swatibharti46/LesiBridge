import React, { useState } from 'react';
import { LawyerProfile, InternalDispute, DisputeStatus, Consultation, ConsultationStatus } from '../types';
import { DollarSign, Briefcase, Users, ShieldCheck, CheckCircle, XCircle, UserX, UserCheck, Tag, BarChart2 } from 'lucide-react';

interface AdminDashboardProps {
  lawyers: LawyerProfile[];
  disputes: InternalDispute[];
  consultations: Consultation[];
  totalRevenue: number;
  totalBookings: number;
  onApproveLawyer: (lawyerId: string) => void;
  onRejectLawyer: (lawyerId: string) => void;
  onToggleLawyerStatus: (lawyerId: string) => void;
  onResolveDispute: (disputeId: string) => void;
  onAssignDispute: (disputeId: string, lawyerId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  lawyers,
  disputes,
  consultations,
  totalRevenue,
  totalBookings,
  onApproveLawyer,
  onRejectLawyer,
  onToggleLawyerStatus,
  onResolveDispute,
  onAssignDispute
}) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'lawyers' | 'consultations' | 'disputes'>('analytics');
  const [assignment, setAssignment] = useState<{ [disputeId: string]: string }>({});

  const pendingLawyers = lawyers.filter(l => l.status === 'PENDING');
  const approvedLawyers = lawyers.filter(l => l.status === 'APPROVED');
  const deactivatedLawyers = lawyers.filter(l => l.status === 'DEACTIVATED');
  
  const openDisputes = disputes.filter(d => d.status === DisputeStatus.OPEN);
  const assignedDisputes = disputes.filter(d => d.status === DisputeStatus.ASSIGNED);

  const revenueByCategory = consultations
    .filter(c => c.status === ConsultationStatus.COMPLETED)
    .reduce((acc, c) => {
        acc[c.category] = (acc[c.category] || 0) + c.price;
        return acc;
    }, {} as Record<string, number>);

  const StatCard = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) => (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
      <div className="p-3 bg-slate-100 rounded-lg">{icon}</div>
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Admin Dashboard</h2>
      
      <div className="flex flex-wrap gap-2 border-b border-slate-200 mb-6">
        <button onClick={() => setActiveTab('analytics')} className={`px-4 py-2 text-sm font-medium ${activeTab==='analytics' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500'}`}>Analytics</button>
        <button onClick={() => setActiveTab('lawyers')} className={`px-4 py-2 text-sm font-medium ${activeTab==='lawyers' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500'}`}>Manage Lawyers</button>
        <button onClick={() => setActiveTab('consultations')} className={`px-4 py-2 text-sm font-medium ${activeTab==='consultations' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500'}`}>All Consultations</button>
        <button onClick={() => setActiveTab('disputes')} className={`px-4 py-2 text-sm font-medium ${activeTab==='disputes' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500'}`}>Internal Disputes</button>
      </div>

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Main Stats */}
            <StatCard icon={<DollarSign className="w-6 h-6 text-emerald-500" />} label="Total Revenue" value={`₹${totalRevenue.toLocaleString()}`} />
            <StatCard icon={<Briefcase className="w-6 h-6 text-blue-500" />} label="Consultations Booked" value={totalBookings} />
            <StatCard icon={<Users className="w-6 h-6 text-indigo-500" />} label="Active Lawyers" value={approvedLawyers.length} />
            
            {/* Revenue Breakdown */}
            <div className="lg:col-span-3 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><BarChart2 className="w-5 h-5 text-slate-500"/> Revenue by Category</h3>
                <div className="space-y-3">
                    {/* FIX: Changed sort to use array indexes to avoid typescript type inference error on destructured parameters. */}
                    {/* FIX: Replaced destructuring in sort with array indexing to resolve a TypeScript type error where numeric values were not correctly inferred. */}
                    {Object.entries(revenueByCategory).sort((a, b) => b[1] - a[1]).map(([category, revenue]) => (
                        <div key={category} className="flex justify-between items-center text-sm">
                            <p className="flex items-center gap-2"><Tag className="w-4 h-4 text-slate-400"/> <span className="font-medium text-slate-700">{category}</span></p>
                            <p className="font-bold text-slate-900">₹{(revenue as number).toLocaleString()}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      )}

      {activeTab === 'lawyers' && (
         <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h3 className="font-bold text-lg mb-4">Pending Lawyer Applications ({pendingLawyers.length})</h3>
              {pendingLawyers.map(lawyer => (
                <div key={lawyer.id} className="p-4 border border-slate-200 rounded-lg flex flex-col sm:flex-row justify-between items-center gap-2">
                  <div>
                    <p className="font-semibold text-slate-800">{lawyer.name}</p>
                    <p className="text-sm text-slate-500">Bar No: {lawyer.barRegistrationNumber} | Exp: {lawyer.yearsExperience} yrs</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                      <button onClick={() => onApproveLawyer(lawyer.id)} className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-medium rounded-md flex items-center gap-1 hover:bg-emerald-700"><ShieldCheck className="w-4 h-4" /> Approve</button>
                      <button onClick={() => onRejectLawyer(lawyer.id)} className="px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-md flex items-center gap-1 hover:bg-red-700"><XCircle className="w-4 h-4" /> Reject</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h3 className="font-bold text-lg mb-4">Active Lawyers ({approvedLawyers.length})</h3>
               {approvedLawyers.map(lawyer => (
                <div key={lawyer.id} className="p-4 border border-slate-200 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-slate-800">{lawyer.name}</p>
                    <p className="text-sm text-slate-500">Bar No: {lawyer.barRegistrationNumber} | Rating: {lawyer.rating}</p>
                  </div>
                  <button onClick={() => onToggleLawyerStatus(lawyer.id)} className="px-3 py-1.5 bg-amber-500 text-white text-xs font-medium rounded-md flex items-center gap-1 hover:bg-amber-600 shrink-0"><UserX className="w-4 h-4" /> Deactivate</button>
                </div>
              ))}
            </div>

             <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h3 className="font-bold text-lg mb-4">Deactivated Lawyers ({deactivatedLawyers.length})</h3>
               {deactivatedLawyers.map(lawyer => (
                <div key={lawyer.id} className="p-4 border rounded-lg flex justify-between items-center bg-slate-50">
                  <div>
                    <p className="font-semibold text-slate-500 line-through">{lawyer.name}</p>
                    <p className="text-sm text-slate-400">Bar No: {lawyer.barRegistrationNumber}</p>
                  </div>
                  <button onClick={() => onToggleLawyerStatus(lawyer.id)} className="px-3 py-1.5 bg-slate-600 text-white text-xs font-medium rounded-md flex items-center gap-1 hover:bg-slate-700 shrink-0"><UserCheck className="w-4 h-4" /> Reactivate</button>
                </div>
              ))}
            </div>
         </div>
      )}

      {activeTab === 'consultations' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h3 className="font-bold text-lg mb-4">All Consultations</h3>
          <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-slate-500">
                  <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                      <tr>
                          <th scope="col" className="px-6 py-3">Client</th>
                          <th scope="col" className="px-6 py-3">Lawyer</th>
                          <th scope="col" className="px-6 py-3">Details</th>
                          <th scope="col" className="px-6 py-3">Status</th>
                      </tr>
                  </thead>
                  <tbody>
                      {consultations.map(c => (
                          <tr key={c.id} className="bg-white border-b">
                              <td className="px-6 py-4">{c.clientName}</td>
                              <td className="px-6 py-4">{c.lawyerName}</td>
                              <td className="px-6 py-4">{c.category} - ₹{c.price}</td>
                              <td className="px-6 py-4">{c.status}</td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
        </div>
      )}

      {activeTab === 'disputes' && (
         <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h3 className="font-bold text-lg mb-4">Unassigned Internal Disputes ({openDisputes.length})</h3>
              {openDisputes.map(dispute => (
                <div key={dispute.id} className="p-4 border rounded-lg flex justify-between items-center">
                  <div>
                      <p>Case: {dispute.consultationId}</p>
                      <p>"{dispute.reason}"</p>
                  </div>
                  <div className="flex items-center gap-2">
                      <select onChange={(e) => setAssignment({...assignment, [dispute.id]: e.target.value})} className="border p-1">
                          <option>Assign to...</option>
                          {approvedLawyers.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                      </select>
                      <button onClick={() => onAssignDispute(dispute.id, assignment[dispute.id])}>Assign</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h3 className="font-bold text-lg mb-4">In Review ({assignedDisputes.length})</h3>
              {assignedDisputes.map(dispute => (
                 <div key={dispute.id} className="p-4 border rounded-lg flex justify-between items-center">
                   <p>Case: {dispute.consultationId} (Assigned to {dispute.assignedLawyerName})</p>
                   <button onClick={() => onResolveDispute(dispute.id)}>Mark Resolved</button>
                 </div>
              ))}
            </div>
         </div>
      )}
    </div>
  );
};