import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { ClientDashboard } from './components/ClientDashboard';
import { ClientIntake } from './components/ClientIntake';
import { LawyerDashboard } from './components/LawyerDashboard';
import { LawyerDirectory } from './components/LawyerDirectory';
import { User, UserRole, CaseData, CaseStatus, Bid, LawyerProfile } from './types';

const MOCK_EXISTING_CASES: CaseData[] = [
  {
    id: 'case-001',
    title: 'SaaS Terms of Service & Privacy Policy',
    rawDescription: 'Need standard terms for B2B SaaS',
    aiSummary: 'Drafting of Terms of Service and Privacy Policy for a B2B SaaS platform handling non-sensitive data. Requires GDPR compliance clauses.',
    keyIssues: ['GDPR Compliance', 'Liability Limitation', 'Data Processing'],
    suggestedBudgetRange: '$800 - $1,200',
    status: CaseStatus.OPEN,
    clientName: 'AlphaStream AI',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    bids: []
  },
  {
    id: 'case-002',
    title: 'Co-Founder Equity Split Dispute',
    rawDescription: 'My cofounder left and wants 50%',
    aiSummary: 'Advisory on equity reclamation regarding a departing co-founder demanding 50% equity. No formal vesting schedule was signed.',
    keyIssues: ['IP Assignment', 'Equity Vesting', 'Separation Agreement'],
    suggestedBudgetRange: '$1,500 - $3,000',
    status: CaseStatus.OPEN,
    clientName: 'Stealth Mode Startup',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    bids: [
        { id: 'bid-1', lawyerId: 'l1', lawyerName: 'Sarah Jenkins, Esq.', amount: 2000, message: 'Expert in founder disputes. I can handle this efficiently.', date: new Date().toISOString() }
    ]
  }
];

const MOCK_LAWYERS: LawyerProfile[] = [
  {
    id: 'l1',
    name: 'Sarah Jenkins, Esq.',
    firm: 'Jenkins & Partners',
    rate: 350,
    rating: 4.9,
    verified: true,
    specialties: ['Corporate Law', 'Startup Finance', 'IP'],
    yearsExperience: 12,
    location: 'San Francisco, CA',
    education: 'J.D., Stanford Law School',
    bio: 'Sarah is a veteran startup attorney who has guided over 50 startups from formation to Series B. She specializes in cap table management, fundraising diligence, and co-founder dispute resolution.',
    recentWork: [
      'Represented Fintech startup in $5M Seed round',
      'Restructured equity for pre-IPO SaaS company',
      'Successfully negotiated co-founder exit for health-tech firm'
    ]
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
    bio: 'David focuses on IP protection and commercial contracts for software companies. He previously worked as in-house counsel for a major cloud provider and understands the operational needs of scaling tech firms.',
    recentWork: [
      'Drafted Terms of Service for AI image generator',
      'Filed 15+ software patents in 2023',
      'Managed GDPR compliance audit for EU expansion'
    ]
  },
  {
    id: 'l3',
    name: 'Amanda Ross',
    firm: 'Ross Employment Law',
    rate: 300,
    rating: 4.7,
    verified: true,
    specialties: ['Employment Law', 'HR Compliance', 'Contractor Agreements'],
    yearsExperience: 15,
    location: 'Austin, TX',
    education: 'J.D., University of Texas',
    bio: 'Amanda helps remote-first startups navigate complex employment regulations across state lines. She ensures your hiring documents are ironclad and compliant with California and New York labor laws.',
    recentWork: [
      'Created remote work policy for 100+ person distributed team',
      'Defended startup in contractor misclassification suit',
      'Designed equity compensation plans for early employees'
    ]
  },
  {
    id: 'l4',
    name: 'Michael Vance',
    firm: 'Vance Legal Group',
    rate: 450,
    rating: 5.0,
    verified: true,
    specialties: ['M&A', 'Exit Strategy', 'Corporate Governance'],
    yearsExperience: 20,
    location: 'Boston, MA',
    education: 'J.D., Harvard Law School',
    bio: 'Michael advises on high-stakes mergers and acquisitions. If you are looking to sell your startup or acquire a competitor, Michael brings two decades of negotiation experience to the table.',
    recentWork: [
      'Lead counsel on $40M acquisition of AI startup',
      'Advised board on hostile takeover defense',
      'Structured cross-border merger with UK firm'
    ]
  }
];

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<'DASHBOARD' | 'INTAKE' | 'DIRECTORY'>('DASHBOARD');
  const [cases, setCases] = useState<CaseData[]>(MOCK_EXISTING_CASES);

  const handleLogin = (role: UserRole) => {
    setUser({
      id: role === UserRole.CLIENT ? 'client-1' : 'lawyer-1',
      name: role === UserRole.CLIENT ? 'Alex Founder' : 'Jessica Pearson',
      role: role
    });
    // Reset view based on role
    if (role === UserRole.CLIENT) {
        setView('DASHBOARD');
    } else {
        setView('DASHBOARD'); // Lawyer only has dashboard for now
    }
  };

  const handleLogout = () => {
    setUser(null);
    setView('DASHBOARD');
  };

  const handleSwitchRole = () => {
    if (!user) return;
    const newRole = user.role === UserRole.CLIENT ? UserRole.LAWYER : UserRole.CLIENT;
    handleLogin(newRole);
  };

  const handleCreateCase = (newCase: CaseData) => {
    setCases([newCase, ...cases]);
    setView('DASHBOARD');
  };

  const handlePlaceBid = (caseId: string, amount: number, message: string) => {
    const newBid: Bid = {
      id: Math.random().toString(36).substr(2, 9),
      lawyerId: user?.id || 'unknown',
      lawyerName: user?.name || 'Unknown Lawyer',
      amount,
      message,
      date: new Date().toISOString()
    };

    setCases(prevCases => prevCases.map(c => {
      if (c.id === caseId) {
        return { ...c, bids: [...c.bids, newBid] };
      }
      return c;
    }));
  };

  const handleAcceptBid = (caseId: string, bidId: string) => {
    setCases(prevCases => prevCases.map(c => {
        if(c.id === caseId) {
            return { ...c, status: CaseStatus.PENDING_ESCROW };
        }
        return c;
    }));
  };

  const handleEnquireLawyer = (lawyer: LawyerProfile) => {
    alert(`Enquiry sent to ${lawyer.name}.\n\nThey will receive your profile and contact you shortly regarding a consultation.`);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar 
        user={user} 
        onLogout={handleLogout} 
        onSwitchRole={handleSwitchRole} 
        onNavigate={(v) => setView(v)}
        currentView={view}
      />
      
      <main>
        {!user ? (
          <LandingPage onLogin={handleLogin} />
        ) : (
          <>
            {user.role === UserRole.CLIENT && (
              <>
                {view === 'DASHBOARD' && (
                  <ClientDashboard 
                    cases={cases.filter(c => c.clientName === 'TechStartup Inc.' || c.id === 'case-002')} 
                    onNewCase={() => setView('INTAKE')} 
                    onAcceptBid={handleAcceptBid}
                  />
                )}
                {view === 'INTAKE' && (
                  <ClientIntake 
                    onCaseCreated={handleCreateCase} 
                    onCancel={() => setView('DASHBOARD')} 
                  />
                )}
                {view === 'DIRECTORY' && (
                  <LawyerDirectory 
                    lawyers={MOCK_LAWYERS}
                    onEnquire={handleEnquireLawyer}
                  />
                )}
              </>
            )}

            {user.role === UserRole.LAWYER && (
              <LawyerDashboard 
                cases={cases} 
                onPlaceBid={handlePlaceBid}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default App;