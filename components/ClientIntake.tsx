import React, { useState, useEffect } from 'react';
import { ArrowRight, Clock } from 'lucide-react';
import { Consultation } from '../types';

interface ClientBookingFormProps {
  initialDetails: { category: string, price: number, duration: 15 | 30 };
  onBookConsultation: (details: Omit<Consultation, 'id' | 'clientName' | 'lawyerId' | 'lawyerName' | 'status' | 'scheduledTime' | 'meetLink'>) => void;
  onCancel: () => void;
}

const LEGAL_CATEGORIES = ["Contract", "GST", "IP", "Family", "Employment", "Corporate", "Compliance"];
const TIME_SLOTS = [
  "Tomorrow at 10:00 AM",
  "Tomorrow at 2:00 PM",
  "Day after tomorrow at 11:00 AM",
];

export const ClientBookingForm: React.FC<ClientBookingFormProps> = ({ initialDetails, onBookConsultation, onCancel }) => {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState(initialDetails.category);
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState<15 | 30>(initialDetails.duration);
  const [selectedSlot, setSelectedSlot] = useState('');

  const price = duration === 15 ? 499 : 899;
  const isStep1Valid = category && description.length >= 20;
  
  useEffect(() => {
    setCategory(initialDetails.category);
    setDuration(initialDetails.duration);
  }, [initialDetails]);


  const handleNextStep = () => {
    if (isStep1Valid) setStep(2);
  };

  const handleConfirmBooking = () => {
    // Simulate payment and booking confirmation
    if (!selectedSlot) {
      alert("Please select a time slot.");
      return;
    }
    alert(`Payment of ₹${price} successful!\n\nYour consultation is booked for ${selectedSlot}. A Google Meet link will be sent to you.`);
    onBookConsultation({ category, description, duration, price });
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Confirm Your Consultation</h2>
        <p className="text-slate-500">Provide final details and schedule your session.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Step 1: Issue Details */}
        {step === 1 && (
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Legal Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 rounded-lg border border-slate-300 bg-slate-100 cursor-not-allowed"
                disabled 
              >
                <option value="" disabled>Select a category...</option>
                {LEGAL_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Describe your specific problem</label>
              <textarea
                className="w-full h-32 p-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none resize-none"
                placeholder="e.g., I need a review of a service agreement for my small business..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
               <p className="text-xs text-slate-500 mt-1">Please provide enough detail for the lawyer to prepare.</p>
            </div>
             
             <div className="p-4 rounded-lg border-2 border-blue-600 bg-blue-50 flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-900">{duration} Minute Consultation</p>
                  <p className="text-sm text-blue-800">Selected from marketplace</p>
                </div>
                <p className="text-xl font-bold text-blue-600">₹{price}</p>
              </div>
          </div>
        )}
        
        {/* Step 2: Scheduling & Payment */}
        {step === 2 && (
           <div className="p-6 space-y-6 animate-fade-in">
              <div>
                <h3 className="font-bold text-lg text-slate-900">Select an Available Time Slot</h3>
                <div className="mt-3 space-y-2">
                  {TIME_SLOTS.map(slot => (
                     <div 
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-3 rounded-lg border-2 cursor-pointer flex items-center gap-3 transition-colors ${selectedSlot === slot ? 'border-blue-600 bg-blue-50' : 'border-slate-300'}`}
                     >
                       <Clock className="w-5 h-5 text-slate-500"/>
                       <span className="font-medium text-slate-800">{slot}</span>
                     </div>
                  ))}
                </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-center">
                 <p className="text-slate-600">You will be charged a fixed price of</p>
                 <p className="text-3xl font-bold text-slate-900">₹{price}</p>
                 <p className="text-xs text-slate-500 mt-1">Payment will be processed via Razorpay/Stripe.</p>
              </div>
           </div>
        )}

        {/* Footer Actions */}
        <div className="bg-slate-50 p-4 flex justify-end gap-3 border-t border-slate-100">
          {step === 1 && (
            <>
              <button onClick={onCancel} className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium">Cancel</button>
              <button onClick={handleNextStep} disabled={!isStep1Valid} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                Proceed to Scheduling <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}
          {step === 2 && (
             <>
              <button onClick={() => setStep(1)} className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium">Back</button>
              <button onClick={handleConfirmBooking} disabled={!selectedSlot} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                Confirm & Pay
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};