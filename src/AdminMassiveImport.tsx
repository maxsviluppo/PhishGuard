import React, { useState, useRef } from "react";
import { Upload, FileSpreadsheet, Check, X, ArrowRight, AlertCircle, Table, ChevronLeft, Layers, MoreHorizontal, Edit2 } from "lucide-react";
import { AdminSingleProduct } from "./AdminSingleProduct";

type ImportStep = 'upload' | 'mapping' | 'preview' | 'success';

interface FieldMapping {
  internal: string;
  label: string;
  required: boolean;
  fileColumn: string;
}

export const AdminMassiveImport = ({ onBack }: { onBack: () => void }) => {
  const [step, setStep] = useState<ImportStep>('upload');
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileHeaders, setFileHeaders] = useState<string[]>([]);
  const [mappings, setMappings] = useState<FieldMapping[]>([
    { internal: 'sku', label: 'Codice SKU Master', required: true, fileColumn: '' },
    { internal: 'ean', label: 'Codice EAN', required: false, fileColumn: '' },
    { internal: 'name', label: 'Nome Prodotto', required: true, fileColumn: '' },
    { internal: 'description', label: 'Descrizione (HTML/Text)', required: false, fileColumn: '' },
    { internal: 'category', label: 'Categoria (Root)', required: true, fileColumn: '' },
    { internal: 'subcategory', label: 'Sottocategoria (Sub)', required: false, fileColumn: '' },
    { internal: 'lvl3', label: 'Livello 3', required: false, fileColumn: '' },
    { internal: 'lvl4', label: 'Livello 4', required: false, fileColumn: '' },
    { internal: 'cost', label: 'Costo d\'Acquisto', required: true, fileColumn: '' },
    { internal: 'price', label: 'Prezzo Vendita (B2C)', required: false, fileColumn: '' },
    { internal: 'priceB2B', label: 'Prezzo VIP (B2B)', required: false, fileColumn: '' },
    { internal: 'variants', label: 'Varianti (Colori/Taglie)', required: false, fileColumn: '' },
    { internal: 'videoUrl', label: 'URL Video Youtube', required: false, fileColumn: '' },
    { internal: 'has3D', label: 'Abilita 3D/AR (Si/No)', required: false, fileColumn: '' },
    { internal: 'amazonTitle', label: 'Override Titolo Amazon', required: false, fileColumn: '' },
    { internal: 'amazonDesc', label: 'Descrizione Amazon', required: false, fileColumn: '' },
    { internal: 'ebayTitle', label: 'Override Titolo eBay', required: false, fileColumn: '' },
    { internal: 'ebayDesc', label: 'Descrizione eBay', required: false, fileColumn: '' },
  ]);
  
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    
    // Simulo il parsing dell'header (qui andrebbe xlsx o papaparse)
    // Per ora facciamo mock di una struttura CSV/Excel
    setTimeout(() => {
      setFileHeaders(['ID', 'Codice Prodotto', 'Barcode', 'Titolo Prodotto', 'Categoria', 'Prezzo Fornitore', 'Prezzo Shop', 'Note', 'Amazon SEO Title']);
      setStep('mapping');
    }, 1200);
  };

  const handleMappingChange = (internal: string, column: string) => {
    setMappings(prev => prev.map(m => m.internal === internal ? { ...m, fileColumn: column } : m));
  };

  const startPreview = () => {
    const mockData = [
      { id: 1, sku: 'TS-RED-01', name: 'T-Shirt Rossa Cotone', cost: '12.50', category: 'Abbigliamento', status: 'ready' },
      { id: 2, sku: 'TS-BLU-02', name: 'T-Shirt Blu Cotone', cost: '13.00', category: 'Abbigliamento', status: 'ready' },
      { id: 3, sku: 'LK-003', name: 'Lampada Kyara Gold', cost: '45.00', category: 'Illuminazione', status: 'incomplete' },
    ];
    setPreviewData(mockData);
    setSelectedRows(mockData.map((_, i) => i));
    setStep('preview');
  };

  const toggleSelect = (index: number) => {
    setSelectedRows(prev => prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]);
  };

  const toggleSelectAll = () => {
    setSelectedRows(selectedRows.length === previewData.length ? [] : previewData.map((_, i) => i));
  };

  const finalizeImport = () => {
    setStep('success');
  };

  return (
    <div className="bg-white rounded-[2.5rem] p-8 lg:p-12 border border-gray-100 shadow-xl space-y-10 animate-in slide-in-from-bottom-8 duration-500 relative min-h-[500px]">
      
      {/* Header */}
      <div className="flex justify-between items-center pb-6 border-b border-gray-100">
        <div>
          <h2 className="text-3xl font-black text-brand-dark uppercase tracking-tighter mb-1">Importazione Massiva</h2>
          <p className="text-sm font-bold text-gray-400">Aggiorna il catalogo tramite file .csv, .xls, .xlsx o .txt.</p>
        </div>
        <button onClick={onBack} className="p-3 bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all">
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Stepper Wizard Indicator */}
      <div className="flex items-center justify-center gap-4 max-w-2xl mx-auto py-4">
        {[
          { id: 'upload', icon: Upload, label: 'Carica' },
          { id: 'mapping', icon: Layers, label: 'Mappa' },
          { id: 'preview', icon: Table, label: 'Anteprima' },
          { id: 'success', icon: Check, label: 'Fine' }
        ].map((s, i, arr) => (
          <React.Fragment key={s.id}>
            <div className={`flex flex-col items-center gap-1 ${step === s.id ? 'text-brand-yellow saturate-150' : 'text-gray-300'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${step === s.id ? 'bg-brand-dark shadow-lg ring-4 ring-brand-yellow/20 translate-y-[-2px]' : 'bg-gray-100'}`}>
                <s.icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest">{s.label}</span>
            </div>
            {i < arr.length - 1 && <div className={`h-[2px] flex-1 min-w-[30px] rounded-full transition-all ${arr.indexOf(arr.find(x => x.id === step)!) > i ? 'bg-brand-yellow' : 'bg-gray-100'}`} />}
          </React.Fragment>
        ))}
      </div>

      {/* CONTENT: Upload Phase */}
      {step === 'upload' && (
        <div className="max-w-3xl mx-auto">
          <label className="group relative flex flex-col items-center justify-center w-full h-[400px] border-4 border-dashed border-gray-100 rounded-[3rem] hover:border-brand-yellow hover:bg-brand-yellow/5 transition-all cursor-pointer overflow-hidden p-12 text-center">
            <input type="file" className="hidden" accept=".csv,.xls,.xlsx,.txt" onChange={handleFileUpload} />
            <div className="w-24 h-24 bg-brand-yellow/20 text-brand-yellow rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <FileSpreadsheet className="w-12 h-12" />
            </div>
            <h3 className="text-2xl font-black text-brand-dark uppercase tracking-tighter mb-2">Trascina il file o clicca qui</h3>
            <p className="text-gray-400 font-bold max-w-sm mb-8">Supporta formati Excel (.xlsx), CSV e file di testo delimitati.</p>
            <div className="flex gap-4">
               <span className="px-4 py-2 bg-gray-100 text-gray-400 rounded-xl text-xs font-black uppercase">CSV</span>
               <span className="px-4 py-2 bg-gray-100 text-gray-400 rounded-xl text-xs font-black uppercase">XLS / XLSX</span>
               <span className="px-4 py-2 bg-gray-100 text-gray-400 rounded-xl text-xs font-black uppercase">TXT</span>
            </div>
          </label>
        </div>
      )}

      {/* CONTENT: Mapping Phase */}
      {step === 'mapping' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in fade-in zoom-in-95 duration-500">
           <div className="lg:col-span-5 space-y-6">
             <div className="bg-brand-dark p-8 rounded-[2rem] text-white space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-yellow text-brand-dark rounded-full text-[10px] font-black uppercase">File Rilevato</div>
                <h3 className="text-2xl font-black tracking-tighter">{fileName}</h3>
                <p className="text-sm text-gray-400 font-bold">Abbiamo rilevato <span className="text-white font-black">{fileHeaders.length} colonne</span> nell\'header del tuo file.</p>
                <div className="pt-4 border-t border-white/10 flex flex-wrap gap-2 text-[8px] font-bold uppercase text-gray-500">
                  {fileHeaders.map(h => <span key={h} className="bg-white/5 px-2 py-1 rounded border border-white/10">{h}</span>)}
                </div>
             </div>
             
             <div className="bg-orange-50 border border-orange-200 p-6 rounded-2xl flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-orange-500 flex-shrink-0" />
                <p className="text-sm text-orange-800 font-medium">Assicurati che le colonne obbligatorie (SKU, Nome, Categoria, Costo) siano associate correttamente per evitare errori durante l\'importazione.</p>
             </div>
           </div>

           <div className="lg:col-span-7">
              <div className="bg-gray-50 rounded-[2rem] p-8 border border-gray-100 space-y-6">
                <h3 className="text-xl font-black text-brand-dark uppercase tracking-tighter border-b border-gray-200 pb-4">Associazione Colonne</h3>
                <div className="space-y-4">
                  {mappings.map((m) => (
                    <div key={m.internal} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${m.required ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-gray-300'}`} />
                        <span className="text-xs font-black text-brand-dark uppercase tracking-widest">{m.label}</span>
                        {m.required && <span className="text-[8px] text-red-500 font-black uppercase">(Req)</span>}
                      </div>
                      <select 
                        value={m.fileColumn}
                        onChange={(e) => handleMappingChange(m.internal, e.target.value)}
                        className={`w-full bg-white rounded-xl border px-4 py-3 text-sm font-bold transition-all focus:ring-4 focus:ring-brand-yellow/20 ${m.fileColumn ? 'border-brand-yellow text-brand-dark' : 'border-gray-200 text-gray-400'}`}
                      >
                        <option value="">-- Seleziona Colonna --</option>
                        {fileHeaders.map(h => <option key={h} value={h}>{h}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
                
                <div className="pt-8 flex justify-end">
                  <button 
                    disabled={mappings.filter(m => m.required && !m.fileColumn).length > 0}
                    onClick={startPreview}
                    className="group bg-brand-yellow text-brand-dark px-10 py-5 rounded-2xl font-black uppercase text-sm tracking-widest shadow-xl hover:bg-yellow-400 transition-all flex items-center gap-4 disabled:opacity-30 disabled:hover:scale-100 disabled:cursor-not-allowed hover:scale-[1.05]"
                  >
                    Genera Anteprima <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </button>
                </div>
              </div>
           </div>
        </div>
      )}

      {/* CONTENT: Review Queue Phase */}
      {step === 'preview' && (
        <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
           {editingIndex !== null ? (
              <div className="animate-in zoom-in-95 duration-300 ring-4 ring-brand-yellow/30 rounded-[3rem] overflow-hidden shadow-2xl">
                <div className="bg-brand-dark p-4 flex justify-between items-center">
                   <h4 className="text-white font-black uppercase text-xs tracking-widest px-4">Rifinitura Prodotto: {previewData[editingIndex].sku}</h4>
                   <button onClick={() => setEditingIndex(null)} className="text-brand-yellow hover:text-white transition-colors flex items-center gap-2 text-[10px] font-black uppercase"><X className="w-4 h-4"/> Chiudi Editor</button>
                </div>
                <AdminSingleProduct onBack={() => setEditingIndex(null)} initialData={previewData[editingIndex]} />
              </div>
           ) : (
            <>
              <div className="flex items-center justify-between">
                  <button onClick={() => setStep('mapping')} className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase hover:text-brand-dark transition-colors">
                    <ChevronLeft className="w-4 h-4" /> Torna alla mappatura
                  </button>
                  <div className="flex gap-4 text-right items-center">
                    <div className="px-4 py-2 bg-yellow-50 rounded-xl border border-yellow-100 flex flex-col">
                       <span className="text-[8px] font-black uppercase text-brand-orange">Selezionati</span>
                       <span className="text-sm font-black text-brand-dark">{selectedRows.length} / {previewData.length}</span>
                    </div>
                  </div>
              </div>

              <div className="overflow-x-auto border border-gray-100 rounded-3xl shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="p-5 w-10">
                          <input type="checkbox" checked={selectedRows.length === previewData.length} onChange={toggleSelectAll} className="w-4 h-4 rounded border-gray-300 text-brand-yellow focus:ring-brand-yellow" />
                        </th>
                        {mappings.slice(0, 5).map(m => (
                          <th key={m.internal} className="p-5 text-[10px] font-black uppercase tracking-widest text-gray-400">{m.label}</th>
                        ))}
                        <th className="p-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Stato</th>
                        <th className="p-5"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {previewData.map((row, i) => (
                        <tr key={i} className={`hover:bg-gray-50/50 transition-colors ${selectedRows.includes(i) ? 'bg-brand-yellow/5' : ''}`}>
                          <td className="p-5">
                            <input type="checkbox" checked={selectedRows.includes(i)} onChange={() => toggleSelect(i)} className="w-4 h-4 rounded border-gray-300 text-brand-yellow focus:ring-brand-yellow" />
                          </td>
                          <td className="p-5 text-sm font-bold text-brand-dark">{row.sku}</td>
                          <td className="p-5 text-sm font-bold text-brand-dark">{row.name.substring(0, 20)}...</td>
                          <td className="p-5 text-sm font-bold text-brand-dark">{row.category}</td>
                          <td className="p-5 text-sm font-bold text-brand-dark">€{row.cost}</td>
                          <td className="p-5">
                            {row.status === 'ready' ? (
                              <span className="px-2 py-1 bg-green-100 text-green-600 rounded text-[9px] font-black uppercase">Verificato</span>
                            ) : (
                              <span className="px-2 py-1 bg-orange-100 text-orange-600 rounded text-[9px] font-black uppercase">Dati Mancanti</span>
                            )}
                          </td>
                          <td className="p-5 text-right">
                             <div className="flex justify-end gap-2">
                               <button 
                                 onClick={() => setEditingIndex(i)}
                                 className="p-2 bg-white text-gray-400 hover:text-brand-orange hover:shadow-md rounded-lg transition-all"
                                 title="Rifinisci Prodotto"
                               >
                                 <Edit2 className="w-4 h-4" />
                               </button>
                             </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between bg-brand-dark p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
                <div className="absolute right-0 top-0 w-64 h-64 bg-brand-yellow rounded-full blur-[120px] opacity-10"></div>
                <div className="relative z-10">
                  <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Pronto per il lancio?</h3>
                  <p className="text-gray-400 font-bold">Verranno importati solo i <span className="text-brand-yellow underline decoration-brand-yellow/30">{selectedRows.length} prodotti selezionati</span>.</p>
                </div>
                <button 
                  disabled={selectedRows.length === 0}
                  onClick={finalizeImport} 
                  className="relative z-10 bg-brand-yellow text-brand-dark px-12 py-6 rounded-[2rem] font-black uppercase text-lg tracking-widest shadow-2xl hover:scale-110 active:scale-95 transition-all disabled:opacity-30 disabled:hover:scale-100"
                >
                    Conferma e Sincronizza
                </button>
              </div>
            </>
           )}
        </div>
      )}

      {/* CONTENT: Success Phase */}
      {step === 'success' && (
        <div className="flex flex-col items-center justify-center h-[500px] text-center animate-in zoom-in-95 duration-500">
          <div className="w-32 h-32 bg-green-500 text-white rounded-full flex items-center justify-center mb-8 shadow-[0_20px_50px_rgba(34,197,94,0.3)] bounce-in">
            <Check className="w-16 h-16 stroke-[4]" />
          </div>
          <h2 className="text-5xl font-black text-brand-dark uppercase tracking-tighter mb-4">Importazione Completata!</h2>
          <p className="text-xl text-gray-400 font-bold max-w-md mb-12">Il catalogo è stato aggiornato correttamente. 3.450 prodotti sono ora attivi nei tuoi canali.</p>
          <div className="flex gap-4">
             <button onClick={() => setStep('upload')} className="px-8 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-gray-200 transition-all">Nuovo Import</button>
             <button onClick={onBack} className="px-10 py-5 bg-brand-dark text-brand-yellow rounded-2xl font-black uppercase text-sm tracking-widest hover:scale-105 transition-all shadow-xl">Torna alla Lista</button>
          </div>
        </div>
      )}

    </div>
  );
};
