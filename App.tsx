import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { ClientDashboard } from './components/ClientDashboard';
import { ClientIntake } from './components/ClientIntake';
import { LawyerDashboard } from './components/LawyerDashboard';
import { User, UserRole, CaseData, CaseStatus, Bid } from './types';

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

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<'DASHBOARD' | 'INTAKE'>('DASHBOARD');
  const [cases, setCases] = useState<CaseData[]>(MOCK_EXISTING_CASES);

  const handleLogin = (role: UserRole) => {
    setUser({
      id: role === UserRole.CLIENT ? 'client-1' : 'lawyer-1',
      name: role === UserRole.CLIENT ? 'Alex Founder' : 'Jessica Pearson',
      role: role
    });
    setView('DASHBOARD');
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

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar user={user} onLogout={handleLogout} onSwitchRole={handleSwitchRole} />
      
      <main>
        {!user ? (
          <LandingPage onLogin={handleLogin} />
        ) : (
          <>
            {user.role === UserRole.CLIENT && (
              <>
                {view === 'DASHBOARD' && (
                  <ClientDashboard 
                    cases={cases.filter(c => c.clientName === 'TechStartup Inc.' || c.id === 'case-002')} // Filter for demo
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