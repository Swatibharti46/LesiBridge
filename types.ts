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
  rating: number; // This will now be an average, calculated from ratings
  verified: boolean;
  specialties: string[];
  bio: string;
  yearsExperience: number;
  location: string;
  education: string;
  recentWork: string[];
  barRegistrationNumber: string;
  availability: string[];
  status: 'PENDING' | 'APPROVED' | 'DEACTIVATED';
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
  // New fields for the Consultation Vault
  summaryNotes?: string;
  actionItems?: string[];
  documents?: { name: string; url: string }[];
}

// Renamed from Dispute to clarify its purpose
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

// New Types for the Public Dispute Marketplace
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
  clientName: string; // Could be anonymous
  postedDate: string;
  description: string;
  bids: Bid[];
}