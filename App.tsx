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
import { summarizeConsultation } from './services/geminiService';
import { User, UserRole, Consultation, ConsultationStatus, LawyerProfile, InternalDispute, DisputeStatus, MarketplaceDispute, Bid } from './types';

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
  },
  {
    id: 'consult-002',
    clientName: 'Alex Founder',
    lawyerId: 'l3',
    lawyerName: 'Amanda Ross',
    category: 'Employment',
    description: 'We need to create a contract for our first freelance hire. The main points are defining the scope of work, payment terms (net 30), and ensuring we own the intellectual property created.',
    duration: 30,
    price: 899,
    status: ConsultationStatus.COMPLETED,
    scheduledTime: 'Yesterday at 2:30 PM',
    meetLink: 'https://meet.google.com/ghi-jkl-mno',
    feedbackGiven: false,
    actionItems: ['Draft freelance agreement using a template', 'Include a clear "Work for Hire" clause', 'Set up payment schedule in accounting software'],
    documents: [{ name: 'Freelancer_Scope_of_Work.pdf', url: '#' }],
  },
   {
    id: 'consult-003',
    clientName: 'Alex Founder',
    lawyerId: 'l1',
    lawyerName: 'Sarah Jenkins, Esq.',
    category: 'Corporate',
    description: 'My co-founder and I need to formalize our equity split. We agreed on 60/40 but need to implement a 4-year vesting schedule with a 1-year cliff. What are the standard terms we should include?',
    duration: 30,
    price: 899,
    status: ConsultationStatus.COMPLETED,
    scheduledTime: 'Last Week',
    meetLink: 'https://meet.google.com/123-456-789',
    feedbackGiven: true,
    summaryNotes: "The lawyer advised on standard vesting terms, including a 1-year cliff and monthly vesting thereafter. Key recommendations were to include acceleration clauses for acquisition scenarios (single trigger vs. double trigger) and to clearly define roles and responsibilities in the founder agreement to prevent future disputes. The importance of filing an 83(b) election was also stressed to avoid potential tax liabilities.",
    actionItems: ['File 83(b) election with IRS within 30 days', 'Draft Founder Agreement with vesting schedule', 'Consult with a tax advisor'],
    documents: [{ name: 'Vesting_Term_Sheet.docx', url: '#' }, { name: 'Sample_Founder_Agreement.pdf', url: '#' }],
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
    bio: 'Sarah is a veteran startup attorney...',
    recentWork: ['Represented Fintech startup in $5M Seed round'],
    barRegistrationNumber: 'SBN-12345',
    availability: ['Mon 10am-1pm', 'Wed 2pm-5pm'],
    status: 'APPROVED',
    ratings: [{ clientName: 'Alex Founder', consultationId: 'consult-003', rating: 5, feedback: "Sarah was incredibly knowledgeable and provided clear, actionable advice on our founder equity structure. Highly recommended!" }]
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
    bio: 'David focuses on IP protection...',
    recentWork: ['Drafted Terms of Service for AI image generator'],
    barRegistrationNumber: 'NY-54321',
    availability: ['Tue 9am-12pm'],
    status: 'APPROVED',
    ratings: [],
  },
  {
    id: 'l3',
    name: 'Amanda Ross',
    firm: 'Ross Employment Law',
    rate: 290,
    rating: 4.7,
    verified: true,
    specialties: ['Employment Law', 'HR Compliance'],
    yearsExperience: 15,
    location: 'Austin, TX',
    education: 'J.D., University of Texas',
    bio: 'Amanda helps remote-first startups...',
    recentWork: ['Created remote work policy for 100+ person team'],
    barRegistrationNumber: 'TX-98765',
    availability: ['Mon-Fri 9am-5pm'],
    status: 'APPROVED',
    ratings: [],
  },
  {
    id: 'l4',
    name: 'Michael Vance',
    firm: 'Vance Legal Group',
    rate: 450,
    rating: 5.0,
    verified: true,
    specialties: ['M&A', 'Exit Strategy'],
    yearsExperience: 20,
    location: 'Boston, MA',
    education: 'J.D., Harvard Law School',
    bio: 'Michael advises on high-stakes mergers...',
    recentWork: ['Lead counsel on $40M acquisition'],
    barRegistrationNumber: 'MA-65432',
    availability: [],
    status: 'PENDING',
    ratings: [],
  },
  {
    id: 'l5',
    name: 'Eleanor Vance',
    firm: 'Corporate Solutions',
    rate: 400,
    rating: 4.9,
    verified: true,
    specialties: ['Corporate Governance'],
    yearsExperience: 18,
    location: 'Chicago, IL',
    education: 'J.D., University of Chicago',
    bio: 'Eleanor is an expert in corporate governance.',
    recentWork: ['Advised on board restructuring'],
    barRegistrationNumber: 'IL-11223',
    availability: [],
    status: 'DEACTIVATED',
    ratings: [],
  }
];

const MOCK_MARKETPLACE_DISPUTES: MarketplaceDispute[] = [
    {
      id: 'disp-m-001',
      title: 'Co-founder Equity Vesting Dispute',
      category: 'Startup Law',
      clientName: 'TechNova Solutions',
      postedDate: '8/1/2024',
      description: 'A co-founder left after 6 months, now claims 25% of the company equity despite a 4-year vesting schedule. Need help enforcing the agreement.',
      bids: [{id: 'b1', lawyerId: 'l1', lawyerName: 'Sarah Jenkins', amount: 25000, proposal: '...', timestamp: ''}],
    },
];


type ClientView = 'DASHBOARD' | 'MARKETPLACE' | 'BOOKING' | 'DIRECTORY' | 'DISPUTE_MARKETPLACE' | 'POST_DISPUTE';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<ClientView>('DASHBOARD');
  const [consultations, setConsultations] = useState<Consultation[]>(MOCK_CONSULTATIONS);
  const [lawyers, setLawyers] = useState<LawyerProfile[]>(MOCK_LAWYERS_INIT);
  const [internalDisputes, setInternalDisputes] = useState<InternalDispute[]>([]);
  const [marketplaceDisputes, setMarketplaceDisputes] = useState<MarketplaceDispute[]>(MOCK_MARKETPLACE_DISPUTES);
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

  const handleLogout = () => {
    setUser(null);
  };

  const handleSwitchRole = () => {
    if (!user) return;
    const roles = [UserRole.CLIENT, UserRole.LAWYER, UserRole.ADMIN];
    const currentIndex = roles.indexOf(user.role);
    const nextRole = roles[(currentIndex + 1) % roles.length];
    handleLogin(nextRole);
  };

  const handleSelectService = (service: { category: string, price: number, duration: 15 | 30 }) => {
    setSelectedService(service);
    setView('BOOKING');
  };
  
  const handleBookConsultation = (details: Omit<Consultation, 'id' | 'clientName' | 'lawyerId' | 'lawyerName' | 'status' | 'scheduledTime' | 'meetLink'>) => {
    const randomLawyer = lawyers.filter(l => l.status === 'APPROVED')[Math.floor(Math.random() * lawyers.filter(l => l.status === 'APPROVED').length)];
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
    setSelectedService(null);
  };

  const handlePostNewDispute = (disputeData: Omit<MarketplaceDispute, 'id' | 'postedDate' | 'bids' | 'clientName'>) => {
    const newDispute: MarketplaceDispute = {
      ...disputeData,
      id: `disp-m-${Math.random().toString(36).substr(2, 9)}`,
      clientName: user?.name || 'Anonymous',
      postedDate: new Date().toLocaleDateString(),
      bids: [],
    };
    setMarketplaceDisputes(prev => [newDispute, ...prev]);
    alert('Your case has been successfully posted to the marketplace!');
    setView('DISPUTE_MARKETPLACE');
  };

  const handleOpenVault = async (consultationId: string) => {
    let consultation = consultations.find(c => c.id === consultationId);
    if (!consultation) return;

    // If summary doesn't exist, generate it
    if (!consultation.summaryNotes) {
      setIsSummaryLoading(true);
      setVaultConsultation(consultation); // Open modal to show loading state
      
      // Simulate lawyer's advice for the demo
      const simulatedAdvice = "The lawyer advised to include a clear 'Work for Hire' clause to ensure IP ownership and to specify net 30 payment terms. They also recommended outlining milestones for deliverables to avoid scope creep.";
      const summary = await summarizeConsultation(consultation.description, simulatedAdvice);
      
      // Update state with the new summary
      const updatedConsultations = consultations.map(c => 
        c.id === consultationId ? { ...c, summaryNotes: summary } : c
      );
      setConsultations(updatedConsultations);
      
      // Update the consultation object for the modal
      consultation = updatedConsultations.find(c => c.id === consultationId)!;
      setVaultConsultation(consultation);
      setIsSummaryLoading(false);
    } else {
      setVaultConsultation(consultation);
    }
  };


  // FIX: Renamed onEnquire to onRequestConsultation and updated signature to match LawyerDirectoryProps
  const handleRequestConsultation = (lawyer: LawyerProfile, timeSlot: string) => {
    alert(`Request for ${lawyer.name} at ${timeSlot} is not implemented yet. Redirecting to the marketplace.`);
    setView('MARKETPLACE');
  };

  const handleRateLawyer = (consultationId: string, rating: number, feedback: string) => {
    const consultation = consultations.find(c => c.id === consultationId);
    if (!consultation || !user) return;

    setConsultations(consultations.map(c => c.id === consultationId ? { ...c, feedbackGiven: true } : c));
    
    setLawyers(lawyers.map(l => {
      if (l.id === consultation.lawyerId) {
        const newRating = {
          rating,
          feedback,
          clientName: user.name,
          consultationId
        };
        const updatedRatings = [...l.ratings, newRating];
        const avgRating = updatedRatings.reduce((acc, r) => acc + r.rating, 0) / updatedRatings.length;
        return { ...l, ratings: updatedRatings, rating: parseFloat(avgRating.toFixed(1)) };
      }
      return l;
    }));

    alert("Thank you for your feedback!");
  };

  const handleRaiseInternalDispute = (consultation: Consultation) => {
    const reason = prompt("Please describe the reason for your dispute:");
    if(reason) {
        const newDispute: InternalDispute = {
            id: `disp-${consultation.id}`,
            consultationId: consultation.id,
            clientName: consultation.clientName,
            lawyerName: consultation.lawyerName,
            reason,
            status: DisputeStatus.OPEN,
        };
        setInternalDisputes(prev => [...prev, newDispute]);
        alert("Dispute raised. An admin will review your case shortly.");
    }
  };

  // ... other admin handlers
  const handleApproveLawyer = (lawyerId: string) => setLawyers(lawyers.map(l => l.id === lawyerId ? { ...l, status: 'APPROVED' } : l));
  const handleRejectLawyer = (lawyerId: string) => setLawyers(lawyers.filter(l => l.id !== lawyerId));
  const handleToggleLawyerStatus = (lawyerId: string) => setLawyers(lawyers.map(l => l.id === lawyerId ? { ...l, status: l.status === 'APPROVED' ? 'DEACTIVATED' : 'APPROVED' } : l));
  const handleResolveInternalDispute = (disputeId: string) => setInternalDisputes(internalDisputes.map(d => d.id === disputeId ? { ...d, status: DisputeStatus.RESOLVED } : d));
  const handleAssignInternalDispute = (disputeId: string, lawyerId: string) => {
      const assignedLawyer = lawyers.find(l => l.id === lawyerId);
      if(assignedLawyer) setInternalDisputes(internalDisputes.map(d => d.id === disputeId ? { ...d, status: DisputeStatus.ASSIGNED, assignedLawyerId: lawyerId, assignedLawyerName: assignedLawyer.name } : d));
  };


  const renderContent = () => {
    if (!user) {
      return <LandingPage onLogin={handleLogin} />;
    }

    const currentLawyer = lawyers.find(l => l.id === user.id);

    switch(user.role) {
      case UserRole.CLIENT:
        if (view === 'DASHBOARD') return <ClientDashboard consultations={consultations.filter(c => c.clientName === user.name)} onNavigate={(v) => setView(v)} onOpenChat={setChatConsultation} onRaiseDispute={handleRaiseInternalDispute} onRateLawyer={handleRateLawyer} onOpenVault={handleOpenVault} />;
        if (view === 'MARKETPLACE') return <ServicesMarketplace onSelectService={handleSelectService} />;
        if (view === 'DISPUTE_MARKETPLACE') return <DisputeMarketplace disputes={marketplaceDisputes} onPostNewDispute={() => setView('POST_DISPUTE')} />;
        if (view === 'POST_DISPUTE') return <PostDisputeForm onSubmit={handlePostNewDispute} onCancel={() => setView('DISPUTE_MARKETPLACE')} />;
        if (view === 'BOOKING' && selectedService) return <ClientBookingForm initialDetails={selectedService} onBookConsultation={handleBookConsultation} onCancel={() => setView('MARKETPLACE')} />;
        // FIX: Changed prop from `onEnquire` to `onRequestConsultation` and passed the correct handler.
        if (view === 'DIRECTORY') return <LawyerDirectory lawyers={lawyers} onRequestConsultation={handleRequestConsultation} />;
        return <ClientDashboard consultations={consultations.filter(c => c.clientName === user.name)} onNavigate={(v) => setView(v)} onOpenChat={setChatConsultation} onRaiseDispute={handleRaiseInternalDispute} onRateLawyer={handleRateLawyer} onOpenVault={handleOpenVault}/>;
      
      case UserRole.LAWYER:
        if (!currentLawyer) return <div>Lawyer profile not found.</div>;
        return <LawyerDashboard 
                  lawyerProfile={currentLawyer}
                  consultations={consultations.filter(c => c.lawyerId === user.id)} 
                  disputes={internalDisputes}
                  availability={currentLawyer.availability} 
                  lawyerId={user.id}
               />;

      case UserRole.ADMIN:
        const totalRevenue = consultations.filter(c=>c.status === ConsultationStatus.COMPLETED).reduce((sum, c) => sum + c.price, 0);
        return <AdminDashboard 
            lawyers={lawyers} 
            disputes={internalDisputes} 
            consultations={consultations}
            totalRevenue={totalRevenue} 
            totalBookings={consultations.length} 
            onApproveLawyer={handleApproveLawyer}
            onRejectLawyer={handleRejectLawyer}
            onToggleLawyerStatus={handleToggleLawyerStatus}
            onResolveDispute={handleResolveInternalDispute}
            onAssignDispute={handleAssignInternalDispute}
        />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar 
        user={user} 
        onLogout={handleLogout} 
        onSwitchRole={handleSwitchRole} 
        onNavigate={(v) => setView(v as ClientView)}
        currentView={view}
      />
      
      <main>
        {renderContent()}
      </main>

      {chatConsultation && <Chat consultation={chatConsultation} onClose={() => setChatConsultation(null)} />}
      {vaultConsultation && <VaultModal consultation={vaultConsultation} isLoadingSummary={isSummaryLoading} onClose={() => setVaultConsultation(null)} />}
    </div>
  );
};

export default App;