
import React, { useState, useRef } from 'react';
import { explainLegalDocument, analyzeDocumentImage, DocumentExplanationResult } from '../services/geminiService';
import { FileText, Search, LoaderCircle, AlertTriangle, ShieldCheck, ListTodo, Camera, Upload, Trash2, Tag } from 'lucide-react';

export const DocumentExplainer: React.FC = () => {
  const [docText, setDocText] = useState('');
  const [result, setResult] = useState<DocumentExplanationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadMode, setUploadMode] = useState<'text' | 'image'>('text');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setUploadMode('image');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    setIsLoading(true);
    try {
      let res: DocumentExplanationResult;
      if (uploadMode === 'image' && selectedImage) {
        const base64Data = selectedImage.split(',')[1];
        const mimeType = selectedImage.split(';')[0].split(':')[1];
        res = await analyzeDocumentImage(base64Data, mimeType);
      } else {
        if (docText.length < 50) {
          alert("Please paste at least 50 characters of text.");
          setIsLoading(false);
          return;
        }
        res = await explainLegalDocument(docText);
      }
      setResult(res);
    } catch (e) {
      alert("Failed to analyze document. Please ensure the image is clear or the text is valid.");
    } finally {
      setIsLoading(false);
    }
  };

  const clear = () => {
    setDocText('');
    setSelectedImage(null);
    setResult(null);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">AI Document Intel</h2>
        <p className="text-slate-500 mt-2 text-lg">Scan physical notices or paste contract text for an instant summary.</p>
        
        <div className="mt-6 flex justify-center gap-2">
           <button 
            onClick={() => setUploadMode('text')} 
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${uploadMode === 'text' ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-500 border border-slate-200'}`}
           >
             Text Mode
           </button>
           <button 
            onClick={() => setUploadMode('image')} 
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${uploadMode === 'image' ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-500 border border-slate-200'}`}
           >
             Scan Mode (Form Recognizer)
           </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Left: Input */}
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl overflow-hidden relative">
            {uploadMode === 'text' ? (
              <textarea
                value={docText}
                onChange={(e) => setDocText(e.target.value)}
                placeholder="Paste the content of a legal notice, contract, or court summon here..."
                className="w-full h-[500px] p-4 rounded-2xl border border-slate-100 bg-slate-50 focus:ring-4 focus:ring-blue-100 outline-none resize-none text-sm leading-relaxed"
              />
            ) : (
              <div className="h-[500px] flex flex-col items-center justify-center border-4 border-dashed border-slate-100 rounded-2xl bg-slate-50">
                {selectedImage ? (
                  <div className="relative w-full h-full p-4">
                    <img src={selectedImage} alt="Selected document" className="w-full h-full object-contain rounded-lg" />
                    <button onClick={() => setSelectedImage(null)} className="absolute top-6 right-6 p-2 bg-rose-500 text-white rounded-full shadow-lg hover:bg-rose-600">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center p-8">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Camera className="w-10 h-10 text-blue-600" />
                    </div>
                    <p className="font-bold text-slate-700 text-xl mb-2">Ready to scan?</p>
                    <p className="text-slate-500 mb-6 max-w-xs mx-auto">Upload a photo of your legal document to extract clauses and deadlines automatically.</p>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2 mx-auto"
                    >
                      <Upload className="w-5 h-5" /> Choose File
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                  </div>
                )}
              </div>
            )}
            
            <div className="mt-6 flex gap-3">
              <button onClick={clear} className="p-4 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
                <Trash2 className="w-6 h-6" />
              </button>
              <button
                onClick={handleAnalyze}
                disabled={isLoading || (uploadMode === 'text' && docText.length < 50) || (uploadMode === 'image' && !selectedImage)}
                className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 shadow-xl hover:bg-slate-800 transition-all"
              >
                {isLoading ? <LoaderCircle className="animate-spin" /> : <Search className="w-5 h-5" />}
                Analyze Document Intelligence
              </button>
            </div>
          </div>
        </div>

        {/* Right: Results */}
        <div className="space-y-6">
          {!result && !isLoading && (
            <div className="h-full flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-slate-200 shadow-sm text-slate-400">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <FileText className="w-12 h-12 opacity-20" />
              </div>
              <p className="text-center font-bold text-slate-900 text-xl">Analysis Awaiting</p>
              <p className="text-center mt-2 max-w-xs">Upload or paste your document to see the AI breakdown.</p>
            </div>
          )}

          {isLoading && (
            <div className="h-full flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-slate-200 shadow-sm">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-blue-100 rounded-full"></div>
                <div className="absolute inset-0 w-20 h-20 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
              </div>
              <p className="mt-6 font-bold text-slate-900 text-xl">Neural Document Parsing...</p>
              <p className="text-slate-500 mt-2">Extracting clauses and risk factors using Gemini Vision.</p>
            </div>
          )}

          {result && (
            <div className="animate-fade-in space-y-6">
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
                <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-4 text-lg">
                  <ShieldCheck className="w-6 h-6 text-emerald-500" />
                  Executive Summary
                </h3>
                <p className="text-slate-700 leading-relaxed">{result.laymanSummary}</p>
                
                {result.extractedMetadata && Object.keys(result.extractedMetadata).length > 0 && (
                  <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap gap-2">
                    {Object.entries(result.extractedMetadata).map(([k, v]) => (
                      <div key={k} className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-600 flex items-center gap-2">
                        <Tag className="w-3 h-3" /> {k}: {v}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="p-6 bg-rose-50 border border-rose-100 rounded-2xl">
                  <h4 className="font-bold text-rose-900 flex items-center gap-2 mb-4">
                    <AlertTriangle className="w-5 h-5" /> Regulatory & Risk Factors
                  </h4>
                  <ul className="space-y-3">
                    {result.risks.map((r, i) => (
                      <li key={i} className="flex gap-2 text-sm text-rose-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-6 bg-blue-50 border border-blue-100 rounded-2xl">
                  <h4 className="font-bold text-blue-900 flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5" /> Critical Timelines
                  </h4>
                  <ul className="space-y-3">
                    {result.deadlines.map((d, i) => (
                      <li key={i} className="flex gap-2 text-sm text-blue-800 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-6 bg-slate-900 rounded-2xl shadow-xl shadow-slate-200">
                  <h4 className="font-bold text-white flex items-center gap-2 mb-4">
                    <ListTodo className="w-5 h-5 text-blue-400" /> Recommended Action Plan
                  </h4>
                  <ul className="space-y-3">
                    {result.recommendedSteps.map((s, i) => (
                      <li key={i} className="flex gap-2 text-sm text-slate-300">
                        <div className="w-5 h-5 bg-slate-800 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">{i+1}</div>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
