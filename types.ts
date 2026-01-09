
export enum UserRole {
  CLIENT = 'CLIENT',
  LAWYER = 'LAWYER',
  GUEST = 'GUEST',
  ADMIN = 'ADMIN'
}

export enum ConsultationStatus {
  BOOKED = 'Booked',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled'
}

export enum DisputeStatus {
  OPEN = 'Open',
  ASSIGNED = 'Assigned',
  RESOLVED = 'Resolved'
}

export interface SecurityLog {
  id: string;
  event: string;
  timestamp: string;
  severity: 'Low' | 'Medium' | 'High';
  user: string;
}

export interface SystemHealth {
  service: string;
  status: 'Healthy' | 'Degraded' | 'Down';
  latency: string;
}

export interface LawyerRating {
  rating: number;
  feedback: string;
  clientName: string;
  consultationId: string;
}

export interface LawyerProfile {
  id: string;
  name:string;
  firm: string;
  rate: number; 
  rating: number;
  verified: boolean;
  specialties: string[];
  bio: string;
  yearsExperience: number;
  location: string;
  education: string;
  recentWork: string[];
  barRegistrationNumber: string;
  availability: string[];
  status: 'APPROVED' | 'PENDING' | 'DEACTIVATED';
  ratings: LawyerRating[];
}

export interface Consultation {
  id: string;
  clientName: string;
  lawyerId: string;
  lawyerName: string;
  category: string;
  description: string;
  duration: 15 | 30;
  price: 499 | 899;
  status: ConsultationStatus;
  scheduledTime: string;
  meetLink: string;
  feedbackGiven?: boolean;
  summaryNotes?: string;
  actionItems?: string[];
  documents?: { name: string; url: string; encrypted?: boolean }[];
}

export interface InternalDispute {
    id: string;
    consultationId: string;
    clientName: string;
    lawyerName: string;
    reason: string;
    status: DisputeStatus;
    assignedLawyerId?: string;
    assignedLawyerName?: string;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  balance?: number;
}

export interface Bid {
  id: string;
  lawyerId: string;
  lawyerName: string;
  amount: number;
  proposal: string;
  timestamp: string;
}

export interface MarketplaceDispute {
  id: string;
  title: string;
  category: string;
  clientName: string;
  postedDate: string;
  description: string;
  bids: Bid[];
  caseType?: string;
  riskLevel?: 'Low' | 'Medium' | 'High';
  urgency?: 'Low' | 'Medium' | 'High';
  roadmap?: string[];
}
