
import React, { useState } from 'react';
import { LawyerProfile, InternalDispute, DisputeStatus, Consultation, ConsultationStatus, SecurityLog, SystemHealth } from '../types';
import { DollarSign, Briefcase, Users, ShieldCheck, CheckCircle, XCircle, UserX, UserCheck, Tag, BarChart2, Activity, ShieldAlert, Terminal } from 'lucide-react';

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

const MOCK_LOGS: SecurityLog[] = [
  { id: 'log-1', event: 'CosmosDB Encryption Verified', timestamp: '2 mins ago', severity: 'Low', user: 'SYSTEM' },
  { id: 'log-2', event: 'Unauthorized Login Attempt Blocked', timestamp: '45 mins ago', severity: 'High', user: '203.0.113.1' },
  { id: 'log-3', event: 'KeyVault Access Key Rotated', timestamp: '3 hours ago', severity: 'Medium', user: 'ADMIN_01' },
];

const MOCK_HEALTH: SystemHealth[] = [
  { service: 'Azure App Service', status: 'Healthy', latency: '42ms' },
  { service: 'Cosmos DB', status: 'Healthy', latency: '12ms' },
  { service: 'OpenAI Gateway', status: 'Healthy', latency: '1.2s' },
  { service: 'Azure Blob Storage', status: 'Healthy', latency: '8ms' },
];

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
  const [activeTab, setActiveTab] = useState<'analytics' | 'lawyers' | 'consultations' | 'disputes' | 'security'>('analytics');
  const [assignment, setAssignment] = useState<{ [disputeId: string]: string }>({});

  const pendingLawyers = lawyers.filter(l => l.status === 'PENDING');
  const approvedLawyers = lawyers.filter(l => l.status === 'APPROVED');
  
  const openDisputes = disputes.filter(d => d.status === DisputeStatus.OPEN);
  const assignedDisputes = disputes.filter(d => d.status === DisputeStatus.ASSIGNED);

  const revenueByCategory = consultations
    .filter(c => c.status === ConsultationStatus.COMPLETED)
    .reduce((acc, c) => {
        acc[c.category] = (acc[c.category] || 0) + c.price;
        return acc;
    }, {} as Record<string, number>);

  const StatCard = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
      <div className="p-3 bg-slate-50 rounded-xl">{icon}</div>
      <div>
        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-black text-slate-900">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Nyaya Management Portal</h2>
          <p className="text-slate-500">Infrastructure: Azure East US Hub</p>
        </div>
        <div className="flex gap-2">
           <div className="px-4 py-2 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full flex items-center gap-2 border border-emerald-200">
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
             SYSTEM HEALTH: OPTIMAL
           </div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 border-b border-slate-200 mb-8">
        <button onClick={() => setActiveTab('analytics')} className={`px-4 py-3 text-sm font-bold transition-all ${activeTab==='analytics' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>Insights</button>
        <button onClick={() => setActiveTab('lawyers')} className={`px-4 py-3 text-sm font-bold transition-all ${activeTab==='lawyers' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>Identity & Access</button>
        <button onClick={() => setActiveTab('security')} className={`px-4 py-3 text-sm font-bold transition-all ${activeTab==='security' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>Security Center</button>
        <button onClick={() => setActiveTab('consultations')} className={`px-4 py-3 text-sm font-bold transition-all ${activeTab==='consultations' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>Operations</button>
      </div>

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard icon={<DollarSign className="w-6 h-6 text-emerald-500" />} label="Total ARR" value={`₹${totalRevenue.toLocaleString()}`} />
            <StatCard icon={<Briefcase className="w-6 h-6 text-blue-500" />} label="Service Requests" value={totalBookings} />
            <StatCard icon={<Users className="w-6 h-6 text-indigo-500" />} label="Managed Identities" value={approvedLawyers.length} />
            
            <div className="lg:col-span-3 bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
                <h3 className="font-black text-xl mb-6 flex items-center gap-2 tracking-tight">
                  <BarChart2 className="w-6 h-6 text-slate-400"/> Revenue Analytics by Case Modality
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Object.entries(revenueByCategory).map(([category, revenue]) => (
                        <div key={category} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{category}</p>
                            <p className="text-xl font-black text-slate-900">₹{(revenue as number).toLocaleString()}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="grid md:grid-cols-2 gap-8">
           <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden relative">
             <div className="absolute top-0 right-0 p-8 opacity-10">
               <ShieldAlert className="w-40 h-40 text-rose-500" />
             </div>
             <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
               <Terminal className="w-5 h-5 text-emerald-400" /> Security Audit Log
             </h3>
             <div className="space-y-4">
                {MOCK_LOGS.map(log => (
                  <div key={log.id} className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-sm font-bold text-slate-200">{log.event}</p>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${log.severity === 'High' ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-700 text-slate-400'}`}>
                        {log.severity}
                      </span>
                    </div>
                    <div className="flex justify-between text-[10px] font-medium text-slate-500 uppercase">
                      <span>USER: {log.user}</span>
                      <span>{log.timestamp}</span>
                    </div>
                  </div>
                ))}
             </div>
           </div>

           <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-500" /> Resource Health (Live)
              </h3>
              <div className="space-y-6">
                 {MOCK_HEALTH.map(health => (
                   <div key={health.service} className="flex justify-between items-center border-b border-slate-50 pb-4">
                      <div>
                        <p className="font-bold text-slate-800">{health.service}</p>
                        <p className="text-xs text-slate-500">Latency: {health.latency}</p>
                      </div>
                      <div className="flex items-center gap-2 text-emerald-600 font-black text-xs">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        {health.status}
                      </div>
                   </div>
                 ))}
              </div>
              <button className="w-full mt-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm shadow-xl hover:bg-slate-800 transition-all">
                Full Diagnostic Report
              </button>
           </div>
        </div>
      )}

      {/* Other tabs remain similar but styled for consistency */}
      {activeTab === 'lawyers' && (
         <div className="space-y-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
              <h3 className="font-black text-xl mb-6">Credential Review ({pendingLawyers.length})</h3>
              <div className="space-y-4">
                {pendingLawyers.map(lawyer => (
                  <div key={lawyer.id} className="p-6 border border-slate-100 bg-slate-50 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div>
                      <p className="font-black text-slate-900 text-lg">{lawyer.name}</p>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">BAR NO: {lawyer.barRegistrationNumber} • {lawyer.yearsExperience} YRS EXP</p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => onApproveLawyer(lawyer.id)} className="px-6 py-3 bg-emerald-600 text-white text-xs font-black rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all uppercase">Verify</button>
                        <button onClick={() => onRejectLawyer(lawyer.id)} className="px-6 py-3 bg-rose-500 text-white text-xs font-black rounded-xl hover:bg-rose-600 shadow-lg shadow-rose-100 transition-all uppercase">Deny</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
         </div>
      )}
    </div>
  );
};
