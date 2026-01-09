import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { ClientDashboard } from './components/ClientDashboard';
import { ClientBookingForm } from './components/ClientIntake';
import { LawyerDashboard } from './components/LawyerDashboard';
import { LawyerDirectory } from './components/LawyerDirectory';
import { AdminDashboard } from './components/AdminDashboard';
import { Chat } from './components/Chat';
import { ServicesMarketplace } from './components/ServicesMarketplace';
import { DisputeMarketplace } from './components/DisputeMarketplace';
import { PostDisputeForm } from './components/PostDisputeForm';
import { VaultModal } from './components/VaultModal';
import { DocumentExplainer } from './components/DocumentExplainer';
import { summarizeConsultation } from './services/geminiService';
import { User, UserRole, Consultation, ConsultationStatus, LawyerProfile, InternalDispute, DisputeStatus, MarketplaceDispute } from './types';
import { Sparkles, FileSearch, ShieldCheck } from 'lucide-react';

const MOCK_CONSULTATIONS: Consultation[] = [
  {
    id: 'consult-001',
    clientName: 'Alex Founder',
    lawyerId: 'l2',
    lawyerName: 'David Chen',
    category: 'IP',
    description: 'Question about trademarking our new company logo.',
    duration: 15,
    price: 499,
    status: ConsultationStatus.BOOKED,
    scheduledTime: 'Today at 4:00 PM',
    meetLink: 'https://meet.google.com/xyz-abc-def',
  }
];

const MOCK_LAWYERS_INIT: LawyerProfile[] = [
  {
    id: 'l1',
    name: 'Sarah Jenkins, Esq.',
    firm: 'Jenkins & Partners',
    rate: 350,
    rating: 5.0,
    verified: true,
    specialties: ['Corporate Law', 'Startup Finance', 'IP'],
    yearsExperience: 12,
    location: 'San Francisco, CA',
    education: 'J.D., Stanford Law School',
    bio: 'Sarah is a veteran startup attorney specializing in late-stage equity financing.',
    recentWork: ['Represented Fintech startup in $5M Seed round'],
    barRegistrationNumber: 'SBN-12345',
    availability: ['Tomorrow at 10:00 AM', 'Tomorrow at 2:00 PM'],
    status: 'APPROVED',
    ratings: []
  },
  {
    id: 'l2',
    name: 'David Chen',
    firm: 'TechLegal Solutions',
    rate: 275,
    rating: 4.8,
    verified: true,
    specialties: ['Intellectual Property', 'SaaS Contracts', 'Data Privacy'],
    yearsExperience: 8,
    location: 'New York, NY',
    education: 'J.D., Columbia University',
    bio: 'David focuses on IP protection and complex SaaS licensing agreements.',
    recentWork: ['Drafted Terms of Service for AI image generator'],
    barRegistrationNumber: 'NY-54321',
    availability: ['Day after tomorrow at 11:00 AM'],
    status: 'APPROVED',
    ratings: [],
  },
  {
    id: 'l3',
    name: 'Rohit Sharma',
    firm: 'Nyaya Associates',
    rate: 200,
    rating: 4.5,
    verified: false,
    specialties: ['Tax Law', 'GST Compliance', 'Employment'],
    yearsExperience: 5,
    location: 'Mumbai, IN',
    education: 'LL.B., NLSIU Bangalore',
    bio: 'Expert in Indian tax regulation and startup compliance frameworks.',
    recentWork: ['Assisted in GST restructuring for a logistics startup'],
    barRegistrationNumber: 'MAH-99887',
    availability: ['Tomorrow at 4:00 PM'],
    status: 'PENDING',
    ratings: [],
  }
];

type ClientView = 'DASHBOARD' | 'MARKETPLACE' | 'BOOKING' | 'DIRECTORY' | 'DISPUTE_MARKETPLACE' | 'POST_DISPUTE' | 'EXPLAINER';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<ClientView>('DASHBOARD');
  const [consultations, setConsultations] = useState<Consultation[]>(MOCK_CONSULTATIONS);
  const [lawyers, setLawyers] = useState<LawyerProfile[]>(MOCK_LAWYERS_INIT);
  const [marketplaceDisputes, setMarketplaceDisputes] = useState<MarketplaceDispute[]>([]);
  const [chatConsultation, setChatConsultation] = useState<Consultation | null>(null);
  const [selectedService, setSelectedService] = useState<{ category: string, price: number, duration: 15 | 30 } | null>(null);
  const [vaultConsultation, setVaultConsultation] = useState<Consultation | null>(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);

  const handleLogin = (role: UserRole) => {
    let userName = 'Admin User';
    if(role === UserRole.CLIENT) userName = 'Alex Founder';
    if(role === UserRole.LAWYER) userName = 'Jessica Pearson';

    setUser({
      id: role === UserRole.LAWYER ? 'l1' : role.toLowerCase() + '-1',
      name: userName,
      role: role
    });
    setView('DASHBOARD');
  };

  const handleLogout = () => setUser(null);
  
  const handleSwitchRole = () => {
    if (!user) return;
    const roles = [UserRole.CLIENT, UserRole.LAWYER, UserRole.ADMIN];
    const currentIndex = roles.indexOf(user.role);
    const nextRole = roles[(currentIndex + 1) % roles.length];
    handleLogin(nextRole);
  };

  const handleBookConsultation = (details: any) => {
    const approvedLawyers = lawyers.filter(l => l.status === 'APPROVED');
    const randomLawyer = approvedLawyers[Math.floor(Math.random() * approvedLawyers.length)] || lawyers[0];
    const newConsultation: Consultation = {
      ...details,
      id: `consult-${Math.random().toString(36).substr(2, 9)}`,
      clientName: user?.name || 'Client',
      lawyerId: randomLawyer.id,
      lawyerName: randomLawyer.name,
      status: ConsultationStatus.BOOKED,
      scheduledTime: 'Tomorrow at 10:00 AM',
      meetLink: 'https://meet.google.com/new-link',
      feedbackGiven: false,
    };
    setConsultations(prev => [newConsultation, ...prev]);
    setView('DASHBOARD');
  };

  const handlePostNewDispute = (disputeData: any) => {
    const newDispute: MarketplaceDispute = {
      ...disputeData,
      id: `disp-m-${Math.random().toString(36).substr(2, 9)}`,
      clientName: user?.name || 'Anonymous',
      postedDate: new Date().toLocaleDateString(),
      bids: [],
    };
    setMarketplaceDisputes(prev => [newDispute, ...prev]);
    setView('DISPUTE_MARKETPLACE');
  };

  const handleOpenVault = async (consultationId: string) => {
    let consultation = consultations.find(c => c.id === consultationId);
    if (!consultation) return;
    setVaultConsultation(consultation);
    if (!consultation.summaryNotes) {
      setIsSummaryLoading(true);
      const summary = await summarizeConsultation(consultation.description, "AI simulated advice: Ensure all contract clauses are reviewable under regional law.");
      setConsultations(prev => prev.map(c => c.id === consultationId ? { ...c, summaryNotes: summary } : c));
      setVaultConsultation({ ...consultation, summaryNotes: summary });
      setIsSummaryLoading(false);
    }
  };

  const handleApproveLawyer = (id: string) => {
    setLawyers(prev => prev.map(l => l.id === id ? { ...l, status: 'APPROVED', verified: true } : l));
  };

  const handleRejectLawyer = (id: string) => {
    setLawyers(prev => prev.map(l => l.id === id ? { ...l, status: 'DEACTIVATED' } : l));
  };

  const renderContent = () => {
    if (!user) return <LandingPage onLogin={handleLogin} />;

    switch(user.role) {
      case UserRole.CLIENT:
        if (view === 'EXPLAINER') return <DocumentExplainer />;
        if (view === 'POST_DISPUTE') return <PostDisputeForm onSubmit={handlePostNewDispute} onCancel={() => setView('DISPUTE_MARKETPLACE')} />;
        if (view === 'MARKETPLACE') return <ServicesMarketplace onSelectService={(s) => { setSelectedService(s); setView('BOOKING'); }} />;
        if (view === 'DISPUTE_MARKETPLACE') return <DisputeMarketplace disputes={marketplaceDisputes} onPostNewDispute={() => setView('POST_DISPUTE')} />;
        if (view === 'DIRECTORY') return <LawyerDirectory lawyers={lawyers} onRequestConsultation={() => setView('BOOKING')} />;
        if (view === 'BOOKING' && selectedService) return <ClientBookingForm initialDetails={selectedService} onBookConsultation={handleBookConsultation} onCancel={() => setView('MARKETPLACE')} />;
        return <ClientDashboard consultations={consultations.filter(c => c.clientName === user.name)} onNavigate={(v: any) => setView(v)} onOpenChat={setChatConsultation} onRaiseDispute={() => {}} onRateLawyer={() => {}} onOpenVault={handleOpenVault} />;
      
      case UserRole.LAWYER:
        return <LawyerDashboard lawyerProfile={lawyers.find(l => l.id === user.id) || lawyers[0]} consultations={consultations} disputes={[]} availability={[]} lawyerId={user.id} />;
      
      case UserRole.ADMIN:
        return <AdminDashboard lawyers={lawyers} disputes={[]} consultations={consultations} totalRevenue={1398} totalBookings={consultations.length} onApproveLawyer={handleApproveLawyer} onRejectLawyer={handleRejectLawyer} onToggleLawyerStatus={() => {}} onResolveDispute={() => {}} onAssignDispute={() => {}} />;
      default: return <LandingPage onLogin={handleLogin} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar 
        user={user} 
        onLogout={handleLogout} 
        onSwitchRole={handleSwitchRole} 
        onNavigate={(v: any) => setView(v)}
        currentView={view}
      />
      
      {user?.role === UserRole.CLIENT && (
        <div className="bg-slate-900 border-b border-slate-800 py-3 shadow-xl overflow-hidden relative">
          <div className="max-w-7xl mx-auto px-4 flex gap-4 overflow-x-auto no-scrollbar relative z-10">
            <button 
              onClick={() => setView('POST_DISPUTE')} 
              className={`flex items-center gap-2 text-xs font-black px-5 py-2 rounded-full transition-all shrink-0 uppercase tracking-widest ${view === 'POST_DISPUTE' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white'}`}
            >
              <Sparkles className="w-3.5 h-3.5" /> AI Legal Triage
            </button>
            <button 
              onClick={() => setView('EXPLAINER')} 
              className={`flex items-center gap-2 text-xs font-black px-5 py-2 rounded-full transition-all shrink-0 uppercase tracking-widest ${view === 'EXPLAINER' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white'}`}
            >
              <FileSearch className="w-3.5 h-3.5" /> Document Intel
            </button>
            <div className="ml-auto hidden md:flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-tighter">Azure Security Shield: Active</span>
            </div>
          </div>
        </div>
      )}

      <main className="animate-fade-in">{renderContent()}</main>

      {chatConsultation && <Chat consultation={chatConsultation} onClose={() => setChatConsultation(null)} />}
      {vaultConsultation && <VaultModal consultation={vaultConsultation} isLoadingSummary={isSummaryLoading} onClose={() => setVaultConsultation(null)} />}
    </div>
  );
};

export default App;