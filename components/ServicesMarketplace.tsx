import React from 'react';
import { Briefcase, FileText, BrainCircuit, Building, Handshake } from 'lucide-react';

interface Service {
  title: string;
  description: string;
  price: 499 | 899;
  duration: 15 | 30;
  category: string;
}

interface ServiceCategory {
  name: string;
  icon: React.ReactNode;
  services: Service[];
}

const marketplaceServices: ServiceCategory[] = [
  {
    name: 'Contracts & Agreements',
    icon: <FileText className="w-6 h-6 text-blue-500" />,
    services: [
      { title: 'Review a SaaS Agreement', description: 'Ensure terms are fair and protect your interests.', price: 899, duration: 30, category: 'Contract' },
      { title: 'Draft an Employment Offer Letter', description: 'Standard offer letter for a new hire.', price: 499, duration: 15, category: 'Employment' },
      { title: 'Non-Disclosure Agreement (NDA)', description: 'Create an NDA for sensitive discussions.', price: 499, duration: 15, category: 'Contract' },
    ]
  },
  {
    name: 'Intellectual Property',
    icon: <BrainCircuit className="w-6 h-6 text-indigo-500" />,
    services: [
      { title: 'Trademark Registration Advice', description: 'Understand the process for trademarking your brand.', price: 499, duration: 15, category: 'IP' },
      { title: 'IP Licensing Query', description: 'Discuss licensing your intellectual property to others.', price: 899, duration: 30, category: 'IP' },
    ]
  },
  {
    name: 'Company Formation',
    icon: <Building className="w-6 h-6 text-emerald-500" />,
    services: [
      { title: 'Choosing a Business Structure', description: 'LLC, S-Corp, C-Corp? Get advice on what is best.', price: 899, duration: 30, category: 'Corporate' },
      { title: 'Founder Equity & Vesting', description: 'Discuss how to split equity among co-founders.', price: 899, duration: 30, category: 'Corporate' },
    ]
  },
  {
    name: 'Compliance',
    icon: <Handshake className="w-6 h-6 text-rose-500" />,
    services: [
      { title: 'GST Registration & Compliance', description: 'Understand your GST obligations as a startup.', price: 499, duration: 15, category: 'GST' },
      { title: 'B2B SaaS Legal Requirements', description: 'High-level overview of compliance for B2B SaaS.', price: 899, duration: 30, category: 'Compliance' },
    ]
  }
];

interface ServicesMarketplaceProps {
  onSelectService: (service: Omit<Service, 'title' | 'description'>) => void;
}

export const ServicesMarketplace: React.FC<ServicesMarketplaceProps> = ({ onSelectService }) => {
  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Legal Services Marketplace</h2>
        <p className="mt-2 text-lg text-slate-600">
          Select a fixed-price service to get started with a vetted lawyer.
        </p>
      </div>

      <div className="space-y-12">
        {marketplaceServices.map((category) => (
          <div key={category.name}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-slate-100 rounded-lg">{category.icon}</div>
              <h3 className="text-xl font-bold text-slate-800">{category.name}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.services.map((service) => (
                <div key={service.title} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-blue-500 hover:shadow-lg transition-all">
                  <div>
                    <h4 className="font-bold text-slate-900">{service.title}</h4>
                    <p className="text-sm text-slate-500 mt-2 mb-4">{service.description}</p>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-2xl font-bold text-slate-900">₹{service.price}</span>
                    <button
                      onClick={() => onSelectService({ category: service.category, price: service.price, duration: service.duration })}
                      className="px-4 py-2 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-700 transition-colors text-sm"
                    >
                      Select Service
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
