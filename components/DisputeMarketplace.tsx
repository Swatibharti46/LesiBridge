import React from 'react';
import { MarketplaceDispute } from '../types';
import { Briefcase, Calendar, Tag, PlusCircle, Gavel } from 'lucide-react';

interface DisputeMarketplaceProps {
  disputes: MarketplaceDispute[];
  onPostNewDispute: () => void;
}

const DisputeCard: React.FC<{ dispute: MarketplaceDispute }> = ({ dispute }) => {
  const avgBid = dispute.bids.length > 0
    ? dispute.bids.reduce((acc, bid) => acc + bid.amount, 0) / dispute.bids.length
    : 0;

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between">
      <div>
        <h3 className="font-bold text-lg text-slate-900">{dispute.title}</h3>
        <div className="flex items-center gap-4 text-xs text-slate-500 mt-2 mb-4">
          <div className="flex items-center gap-1.5">
            <Tag className="w-3 h-3" />
            <span>{dispute.category}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Briefcase className="w-3 h-3" />
            <span>Posted by {dispute.clientName}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3 h-3" />
            <span>{dispute.postedDate}</span>
          </div>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
          {dispute.description}
        </p>
      </div>
      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-800">{dispute.bids.length} Bid(s)</p>
          {dispute.bids.length > 0 ? (
             <p className="text-xs text-slate-500">Avg. Bid: ₹{avgBid.toLocaleString()}</p>
          ) : (
             <p className="text-xs text-slate-500">No bids yet</p>
          )}
        </div>
        <button className="px-4 py-2 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-700 transition-colors text-sm flex items-center gap-2">
           <Gavel className="w-4 h-4" /> View Bids
        </button>
      </div>
    </div>
  );
};


export const DisputeMarketplace: React.FC<DisputeMarketplaceProps> = ({ disputes, onPostNewDispute }) => {
  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Disputes Marketplace</h2>
          <p className="mt-1 text-lg text-slate-600">
            Find legal representation or opportunities.
          </p>
        </div>
        <button
          onClick={onPostNewDispute}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
        >
          <PlusCircle className="w-5 h-5" /> Post a New Dispute
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {disputes.map((dispute) => (
          <DisputeCard key={dispute.id} dispute={dispute} />
        ))}
      </div>
    </div>
  );
};