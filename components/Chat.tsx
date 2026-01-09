import React, { useState } from 'react';
import { Consultation } from '../types';
import { X, Send } from 'lucide-react';

interface ChatProps {
  consultation: Consultation;
  onClose: () => void;
}

interface Message {
  sender: 'You' | 'Lawyer';
  text: string;
  time: string;
}

export const Chat: React.FC<ChatProps> = ({ consultation, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'Lawyer', text: 'Hello! Happy to answer any follow-up questions you may have about our consultation.', time: '10:30 AM' },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSend = () => {
    if (newMessage.trim()) {
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages([...messages, { sender: 'You', text: newMessage, time }]);
      setNewMessage('');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-slate-900">Follow-up with {consultation.lawyerName}</h3>
            <p className="text-xs text-slate-500">Regarding: {consultation.category} Advice</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Message Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex items-end gap-2 ${msg.sender === 'You' ? 'justify-end' : ''}`}>
              {msg.sender === 'Lawyer' && <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">L</div>}
              <div className={`p-3 rounded-lg max-w-xs ${msg.sender === 'You' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-800'}`}>
                <p className="text-sm">{msg.text}</p>
                <p className={`text-xs mt-1 ${msg.sender === 'You' ? 'text-blue-200' : 'text-slate-400'}`}>{msg.time}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button onClick={handleSend} className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
