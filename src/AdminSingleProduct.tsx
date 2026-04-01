import React, { useState } from "react";
import { Package, X, Trash2, Layers, Globe, ExternalLink, Camera, Plus, Check, RefreshCw, Search, ChevronDown, Truck, Info } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CATEGORIES, SUBCATEGORIES } from "./data";

export const AdminSingleProduct = ({ onBack, initialData }: { onBack: () => void, initialData?: any }) => {
  const [baseCost, setBaseCost] = useState<number>(Number(initialData?.cost) || 10);
  const [b2cMarkup, setB2cMarkup] = useState<number>(Number(initialData?.markup) || 30);
  const [b2bMarkup, setB2bMarkup] = useState<number>(10);
  
  const [manualB2c, setManualB2c] = useState<string>(initialData?.price || "");
  const [manualB2b, setManualB2b] = useState<string>("");

  const [isAmazonActive, setIsAmazonActive] = useState<boolean>(true);
  const [isEbayActive, setIsEbayActive] = useState<boolean>(false);
  const [selectedCourier, setSelectedCourier] = useState<string>("GLS Italy");
  const [isCourierDropdownOpen, setIsCourierDropdownOpen] = useState<boolean>(false);
  const [isFeatured, setIsFeatured] = useState<boolean>(initialData?.isFeatured || false);

  // Core Data States
  const [title, setTitle] = useState<string>(initialData?.name || "");
  const [sku, setSku] = useState<string>(initialData?.sku || "");
  const [ean, setEan] = useState<string>(initialData?.ean || "");
  const [productDescription, setProductDescription] = useState<string>(initialData?.description || "");

  // Sync isFeatured if initialData changes Externally
  React.useEffect(() => {
    if (initialData) {
      setIsFeatured(initialData.isFeatured || false);
    }
  }, [initialData?.isFeatured]);

  const COURIER_OPTIONS = [
    { name: "GLS Italy", details: "Nazionale Standard — Arrivo 24/48h" },
    { name: "DHL Express", details: "Internazionale / Express Priority — Arrivo 12/24h" },
    { name: "BRT Corriere Espresso", details: "Bartolini — Indirizzi Particolari & Carichi Voluminosi" },
    { name: "Poste Italiane", details: "Economy & Punti Ritiro — Arrivo 3-5gg" },
  ];

  const b2cPrice = manualB2c ? parseFloat(manualB2c) : baseCost * (1 + b2cMarkup / 100);
  const b2bPrice = manualB2b ? parseFloat(manualB2b) : baseCost * (1 + b2bMarkup / 100);

  const [gallery, setGallery] = useState<string[]>([]);
  const [specs, setSpecs] = useState<{key: string, value: string}[]>([{key: "", value: ""}]);
  
  // NEW: State for Master Stock (Simple Product)
  const [masterStock, setMasterStock] = useState<number>(initialData?.stock || 0);
  const [masterAllocations, setMasterAllocations] = useState({ amazon: 0, ebay: 0 });

  // UPDATED: Variants State with detailed inventory
  const [variants, setVariants] = useState<{
    id: string, 
    type: 'Colore' | 'Taglia', 
    value: string, 
    sku: string, 
    totalStock: number,
    allocations: { amazon: number, ebay: number }
  }[]>([]);

  const [amazonMarkup, setAmazonMarkup] = useState<number>(Number(initialData?.amazonMarkup) || 15);
  const [amazonManualPrice, setAmazonManualPrice] = useState<string>(initialData?.amazonPrice || "");
  const [ebayMarkup, setEbayMarkup] = useState<number>(Number(initialData?.ebayMarkup) || 11);
  const [ebayManualPrice, setEbayManualPrice] = useState<string>(initialData?.ebayPrice || "");

  const [videoUrl, setVideoUrl] = useState<string>(initialData?.videoUrl || "");
  const [description, setDescription] = useState<string>(initialData?.description || "");
  const [amazonTitle, setAmazonTitle] = useState<string>(initialData?.amazonTitle || "");
  const [ebayTitle, setEbayTitle] = useState<string>(initialData?.ebayTitle || "");

  const amazonPrice = amazonManualPrice ? parseFloat(amazonManualPrice) : baseCost * (1 + amazonMarkup / 100);
  const ebayPrice = ebayManualPrice ? parseFloat(ebayManualPrice) : baseCost * (1 + ebayMarkup / 100);

  const handleManualPrice = (val: string, type: 'b2c' | 'b2b' | 'amazon' | 'ebay') => {
    if (type === 'b2c') setManualB2c(val);
    if (type === 'b2b') setManualB2b(val);
    if (type === 'amazon') setAmazonManualPrice(val);
    if (type === 'ebay') setEbayManualPrice(val);
  };

  return (
    <div className="bg-white rounded-[2.5rem] p-8 lg:p-12 border border-gray-100 shadow-xl space-y-10 animate-in slide-in-from-bottom-8 duration-500 relative">
      <button onClick={onBack} className="absolute top-8 right-8 p-3 bg-gray-50 text-gray-500 hover:bg-brand-yellow hover:text-brand-dark rounded-xl transition-all">
        <X className="w-6 h-6" />
      </button>
      
      <div>
        <h2 className="text-3xl font-black text-brand-dark uppercase tracking-tighter mb-2">Creazione Prodotto Master</h2>
        <p className="text-sm font-bold text-gray-400">Dati completi per il sito eCommerce e sincronizzazione avanzata canali (B2C, B2B, Marketplace).</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Colonna Centrale: Dati Principali */}
        <div className="lg:col-span-8 space-y-8">
          
          <div className="space-y-6">
            <label className="block">
              <span className="text-[10px] font-black uppercase tracking-widest text-brand-blue mb-1 block">Titolo Prodotto (DB Interno & Sito) *</span>
              <input 
                type="text" 
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Titolo gestionale per sito web..." 
                className="w-full bg-gray-50 border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-brand-blue focus:border-brand-blue" 
              />
            </label>
            <label className="block">
              <span className="text-[10px] font-black uppercase tracking-widest text-brand-blue mb-1 block">Descrizione Prodotto</span>
              <textarea 
                rows={4} 
                value={productDescription}
                onChange={e => setProductDescription(e.target.value)}
                placeholder="Decrizione per il sito ecommerce..." 
                className="w-full bg-gray-50 border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-brand-blue focus:border-brand-blue resize-none"
              ></textarea>
            </label>
            
            {/* Frontend Specs: 3D, Video, Specifiche */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
               <label className="block">
                 <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block">URL Video Youtube (Opzionale)</span>
                 <input type="text" placeholder="https://youtube.com/..." className="w-full bg-white border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-brand-yellow focus:border-brand-yellow" />
               </label>
                 <div className="flex items-center gap-3 pt-6">
                   <label className="inline-flex items-center cursor-pointer">
                     <input 
                       type="checkbox" 
                       className="sr-only peer" 
                       checked={isFeatured} 
                       onChange={e => {
                         setIsFeatured(e.target.checked);
                         if (initialData) initialData.isFeatured = e.target.checked;
                       }} 
                     />
                     <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-yellow relative"></div>
                   </label>
                   <span className="text-[10px] font-black uppercase tracking-widest text-brand-dark">Metti in Vetrina (Home)</span>
                 </div>
                 <div className="flex items-center gap-3 pt-6">
                   <label className="inline-flex items-center cursor-pointer">
                     <input type="checkbox" className="sr-only peer" />
                     <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500 relative"></div>
                   </label>
                   <span className="text-[10px] font-black uppercase tracking-widest text-purple-600">Modello Vista 3D / AR</span>
                 </div>
            </div>
            
            <div className="space-y-3 pt-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-brand-blue block">Specifiche Tecniche per Tabella (Sito)</span>
              {specs.map((s, i) => (
                <div key={i} className="flex gap-2">
                  <input type="text" value={s.key} onChange={e => {
                    const newSpecs = [...specs]; newSpecs[i].key = e.target.value; setSpecs(newSpecs);
                  }} placeholder="Proprietà (es. Peso)" className="flex-1 bg-white border-gray-200 rounded-lg px-3 py-2 text-sm font-bold" />
                  <input type="text" value={s.value} onChange={e => {
                    const newSpecs = [...specs]; newSpecs[i].value = e.target.value; setSpecs(newSpecs);
                  }} placeholder="Valore (es. 2Kg)" className="flex-1 bg-white border-gray-200 rounded-lg px-3 py-2 text-sm font-bold" />
                  <button onClick={() => setSpecs(specs.filter((_, idx) => idx !== i))} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4"/></button>
                </div>
              ))}
              <button onClick={() => setSpecs([...specs, {key:"", value:""}])} className="text-[10px] font-black uppercase text-brand-blue hover:text-brand-yellow transition-colors bg-brand-blue/5 px-3 py-2 rounded-lg">+ Aggiungi Riga Specifica</button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-black uppercase tracking-widest text-brand-dark border-b border-gray-100 pb-3 flex items-center gap-2"><Package className="w-5 h-5 text-gray-400"/> Identificativi & Core</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <label className="lg:col-span-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-blue mb-1 block">SKU Master *</span>
                <input 
                  type="text" 
                  value={sku}
                  onChange={e => setSku(e.target.value)}
                  placeholder="TSHIRT-01" 
                  className="w-full bg-gray-50 border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-brand-blue" 
                />
              </label>
              <label className="lg:col-span-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-blue mb-1 block">EAN</span>
                <input 
                  type="text" 
                  value={ean}
                  onChange={e => setEan(e.target.value)}
                  placeholder="801234..." 
                  className="w-full bg-gray-50 border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-brand-blue" 
                />
              </label>
              
              {/* Quantità Principale (per prodotti semplici) */}
              {variants.length === 0 && (
                <div className={`lg:col-span-2 grid gap-2 ${isAmazonActive && isEbayActive ? 'grid-cols-4' : (isAmazonActive || isEbayActive ? 'grid-cols-3' : 'grid-cols-2')}`}>
                  <label className="block">
                    <span className="text-[10px] font-black uppercase tracking-widest text-green-600 mb-1 block">Stock Totale</span>
                    <input type="number" value={masterStock} onChange={e => setMasterStock(Number(e.target.value))} className="w-full bg-green-50 border-green-100 rounded-xl px-4 py-3 text-sm font-black text-green-700" />
                  </label>
                  {isAmazonActive && (
                    <label className="block">
                      <span className="text-[10px] font-black uppercase tracking-widest text-orange-600 mb-1 block">Amazon</span>
                      <input type="number" value={masterAllocations.amazon} onChange={e => setMasterAllocations({...masterAllocations, amazon: Number(e.target.value)})} className="w-full bg-orange-50 border-orange-100 rounded-xl px-4 py-3 text-sm font-black text-orange-700" />
                    </label>
                  )}
                  {isEbayActive && (
                    <label className="block">
                      <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-1 block">eBay</span>
                      <input type="number" value={masterAllocations.ebay} onChange={e => setMasterAllocations({...masterAllocations, ebay: Number(e.target.value)})} className="w-full bg-blue-50 border-blue-100 rounded-xl px-4 py-3 text-sm font-black text-blue-700" />
                    </label>
                  )}
                  <label className="block">
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-1 block">Web Shop</span>
                    <div className="w-full bg-indigo-50 border-indigo-100 rounded-xl px-4 py-3 text-sm font-black text-indigo-700">
                      {Math.max(0, masterStock - (isAmazonActive ? masterAllocations.amazon : 0) - (isEbayActive ? masterAllocations.ebay : 0))}
                    </div>
                  </label>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-black uppercase tracking-widest text-brand-dark border-b border-gray-100 pb-3 flex items-center gap-2">
              <Plus className="w-5 h-5 text-gray-400"/> Varianti & Stock Canali
            </h3>
            <div className="space-y-4">
              {variants.map((v, i) => {
                const amazonQuota = isAmazonActive ? v.allocations.amazon : 0;
                const ebayQuota = isEbayActive ? v.allocations.ebay : 0;
                const webStock = Math.max(0, v.totalStock - (amazonQuota + ebayQuota));
                
                // Dinamic grid cols based on active channels
                let gridCols = 2; // Totale + Web Shop
                if (isAmazonActive) gridCols++;
                if (isEbayActive) gridCols++;

                return (
                  <div key={v.id} className="bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100 space-y-4 transition-all hover:bg-white hover:shadow-xl group">
                    <div className="flex gap-3 items-start">
                      <select 
                        value={v.type}
                        onChange={e => {
                          const newV = [...variants]; newV[i].type = e.target.value as 'Colore' | 'Taglia'; setVariants(newV);
                        }}
                        className="w-28 bg-white border-gray-200 rounded-lg px-2 py-2 text-[10px] font-black uppercase tracking-tighter"
                      >
                        <option>Colore</option>
                        <option>Taglia</option>
                      </select>
                      <input 
                        type="text" 
                        value={v.value}
                        onChange={e => {
                          const newV = [...variants]; newV[i].value = e.target.value; setVariants(newV);
                        }}
                        placeholder={v.type === 'Colore' ? "Colore" : "Taglia"} 
                        className="w-32 bg-white border-gray-200 rounded-lg px-3 py-2 text-xs font-black uppercase" 
                      />
                      <input 
                        type="text"
                        value={v.sku}
                        onChange={e => {
                          const newV = [...variants]; newV[i].sku = e.target.value; setVariants(newV);
                        }}
                        placeholder="SKU"
                        className="w-32 bg-white border-gray-200 rounded-lg px-3 py-2 text-[10px] font-bold"
                      />
                      <div className={`flex-[1.5] grid gap-2 bg-white/50 p-2 rounded-2xl border border-gray-100 items-end`} style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}>
                         <div className="flex flex-col gap-1">
                            <span className="text-[7px] font-black text-gray-400 uppercase tracking-widest text-center leading-none">Totale</span>
                            <input type="number" value={v.totalStock} onChange={e => {
                              const newV = [...variants]; newV[i].totalStock = Number(e.target.value); setVariants(newV);
                            }} className="w-full h-8 bg-white border-gray-100 rounded-lg px-1 py-1 text-[11px] font-black text-center focus:ring-1 focus:ring-brand-blue" />
                         </div>
                         {isAmazonActive && (
                           <div className="flex flex-col gap-1">
                              <span className="text-[7px] font-black text-orange-600 uppercase tracking-widest text-center leading-none">Amazon</span>
                              <input type="number" value={v.allocations.amazon} onChange={e => {
                                const newV = [...variants]; newV[i].allocations.amazon = Number(e.target.value); setVariants(newV);
                              }} className="w-full h-8 bg-orange-50 border-orange-100 rounded-lg px-1 py-1 text-[11px] font-black text-center text-orange-600 focus:ring-1 focus:ring-orange-500" />
                           </div>
                         )}
                         {isEbayActive && (
                           <div className="flex flex-col gap-1">
                              <span className="text-[7px] font-black text-blue-600 uppercase tracking-widest text-center leading-none">eBay</span>
                              <input type="number" value={v.allocations.ebay} onChange={e => {
                                const newV = [...variants]; newV[i].allocations.ebay = Number(e.target.value); setVariants(newV);
                              }} className="w-full h-8 bg-blue-50 border-blue-100 rounded-lg px-1 py-1 text-[11px] font-black text-center text-blue-600 focus:ring-1 focus:ring-blue-500" />
                           </div>
                         )}
                         <div className="flex flex-col gap-1">
                            <span className="text-[7px] font-black text-indigo-600 uppercase tracking-widest text-center leading-none">Web Shop</span>
                            <div className="w-full h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center text-[11px] font-black shadow-sm">
                              {webStock}
                            </div>
                         </div>
                      </div>
                      <button onClick={() => setVariants(variants.filter((_, idx) => idx !== i))} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all pt-3"><Trash2 className="w-4 h-4"/></button>
                    </div>
                  </div>
                );
              })}
              
              <div className="flex justify-center pt-2">
                <button 
                  onClick={() => setVariants([...variants, {
                    id: Math.random().toString(36).substr(2, 9),
                    type: 'Colore', 
                    value: "", 
                    sku: "", 
                    totalStock: 0,
                    allocations: { amazon: 0, ebay: 0 }
                  }])} 
                  className="group flex items-center gap-3 px-6 py-4 bg-gray-50 hover:bg-brand-yellow hover:text-brand-dark rounded-3xl border-2 border-dashed border-gray-200 hover:border-brand-yellow transition-all duration-300"
                >
                  <Plus className="w-5 h-5 text-gray-400 group-hover:text-brand-dark" />
                  <span className="text-xs font-black uppercase tracking-widest text-gray-500 group-hover:text-brand-dark">Aggiungi Nuova Variante con gestione Canali</span>
                </button>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-black uppercase tracking-widest text-brand-dark border-b border-gray-100 pb-3 flex items-center gap-2"><Layers className="w-5 h-5 text-gray-400"/> Tassonomia Avanzata</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <label className="block">
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1 block">Livello 1 (Root)</span>
                <select className="w-full bg-gray-50 border-gray-200 rounded-xl px-3 py-2 text-xs font-bold focus:ring-brand-blue focus:border-brand-blue">
                  {CATEGORIES.filter(c => c !== "Tutti").map(c => <option key={c}>{c}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1 block">Livello 2 (Sub)</span>
                <select className="w-full bg-gray-50 border-gray-200 rounded-xl px-3 py-2 text-xs font-bold focus:ring-brand-blue focus:border-brand-blue">
                  {SUBCATEGORIES["Illuminazione"]?.map((s: string) => <option key={s}>{s}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1 block">Livello 3 (Optional)</span>
                <input type="text" placeholder="es. Led Integrato" className="w-full bg-white border-gray-200 rounded-xl px-3 py-2 text-xs font-bold placeholder:text-gray-300" />
              </label>
              <label className="block">
                 <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1 block">Livello 4 (Deep)</span>
                 <input type="text" placeholder="N/A" className="w-full bg-white border-gray-200 rounded-xl px-3 py-2 text-xs font-bold placeholder:text-gray-300" />
              </label>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-black uppercase tracking-widest text-brand-dark border-b border-gray-100 pb-3 flex items-center gap-2"><Globe className="w-5 h-5 text-gray-400"/> Sincronizzazione Marketplace (Overrides)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Amazon Block */}
              <div className="bg-gradient-to-br from-white to-orange-50 rounded-2xl p-6 border border-orange-100 shadow-sm relative overflow-hidden group hover:border-orange-300 transition-all flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500 rounded-full blur-3xl opacity-10 -mr-10 -mt-10"></div>
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-2 text-orange-500 shadow flex items-center justify-center rounded-xl"><Globe className="w-5 h-5" /></div>
                    <span className="font-black text-brand-dark uppercase tracking-tight">Amazon.it</span>
                  </div>
                  <label className="inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={isAmazonActive} onChange={e => setIsAmazonActive(e.target.checked)} />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500 relative shadow-inner"></div>
                  </label>
                </div>
                <div className="space-y-4 relative z-10">
                  <label className="block">
                    <span className="text-[10px] font-black uppercase tracking-widest text-orange-600 mb-1 block">Titolo Ottimizzato SEO</span>
                    <input type="text" value={amazonTitle} onChange={e => setAmazonTitle(e.target.value)} placeholder="Override per Amazon..." className="w-full bg-white border-orange-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-orange-500 focus:border-orange-500" />
                  </label>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Costo riferimento:</span>
                    <span className="text-[9px] font-black text-brand-dark">€{baseCost.toFixed(2)}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="block">
                      <span className="text-[10px] font-black uppercase tracking-widest text-orange-600 mb-1 block">Ricarico (%)</span>
                      <input type="number" value={amazonMarkup} onChange={e => setAmazonMarkup(Number(e.target.value))} className="w-full bg-white border-orange-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-orange-500 focus:border-orange-500" />
                    </label>
                    <label className="block relative">
                      <span className="text-[10px] font-black uppercase tracking-widest text-orange-600 mb-1 block">Prezzo Finale (Manuale)</span>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-400 font-bold">€</span>
                        <input type="number" value={amazonManualPrice || (amazonPrice ? amazonPrice.toFixed(2) : "0.00")} onChange={e => setAmazonManualPrice(e.target.value)} className={`w-full bg-orange-500 text-white border-none rounded-xl pl-7 pr-2 py-3 text-sm font-black focus:ring-2 focus:ring-orange-300 ${amazonManualPrice ? 'ring-2 ring-orange-200' : ''}`} />
                        {amazonManualPrice && <button onClick={() => setAmazonManualPrice("")} className="absolute -bottom-4 right-0 text-[8px] font-black text-orange-600 uppercase">Reset</button>}
                      </div>
                    </label>
                  </div>
                  <label className="block">
                    <span className="text-[10px] font-black uppercase tracking-widest text-orange-600 mb-1 block">Esenzione GTIN</span>
                    <select className="w-full bg-white border-orange-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-orange-500 focus:border-orange-500">
                      <option>Nessuna (EAN Base)</option>
                      <option>Sì, approvata su Brand</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-[10px] font-black uppercase tracking-widest text-orange-600 mb-1 block">Descrizione Ottimizzata Amazon</span>
                    <textarea rows={3} placeholder="Descrizione specifica per Amazon (Bullet points ecc)..." className="w-full bg-white border-orange-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-orange-500 focus:border-orange-500 resize-none"></textarea>
                  </label>
                </div>
              </div>

              {/* eBay Block */}
              <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 border border-blue-100 shadow-sm relative overflow-hidden group hover:border-blue-300 transition-all flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full blur-3xl opacity-10 -mr-10 -mt-10"></div>
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-2 text-blue-500 shadow flex items-center justify-center rounded-xl"><ExternalLink className="w-5 h-5" /></div>
                    <span className="font-black text-brand-dark uppercase tracking-tight">eBay</span>
                  </div>
                  <label className="inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={isEbayActive} onChange={e => setIsEbayActive(e.target.checked)} />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500 relative shadow-inner"></div>
                  </label>
                </div>
                <div className="space-y-4 relative z-10">
                  <label className="block">
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-1 block">Titolo + Sottotitolo Store</span>
                    <input type="text" placeholder="Titolo per inserzione eBay..." className="w-full bg-white border-blue-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-blue-500 focus:border-blue-500" />
                  </label>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Costo riferimento:</span>
                    <span className="text-[9px] font-black text-brand-dark">€{baseCost.toFixed(2)}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="block">
                      <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-1 block">Ricarico (%)</span>
                      <input type="number" value={ebayMarkup} onChange={e => setEbayMarkup(Number(e.target.value))} className="w-full bg-white border-blue-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-blue-500 focus:border-blue-500" />
                    </label>
                    <label className="block relative">
                      <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-1 block">Prezzo Finale (Manuale)</span>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 font-bold">€</span>
                        <input type="number" value={ebayManualPrice || ebayPrice.toFixed(2)} onChange={e => handleManualPrice(e.target.value, 'ebay')} className={`w-full bg-blue-500 text-white border-none rounded-xl pl-7 pr-2 py-3 text-sm font-black focus:ring-2 focus:ring-blue-300 ${ebayManualPrice ? 'ring-2 ring-blue-200' : ''}`} />
                        {ebayManualPrice && <button onClick={() => setEbayManualPrice("")} className="absolute -bottom-4 right-0 text-[8px] font-black text-blue-600 uppercase">Reset</button>}
                      </div>
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="block">
                      <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-1 block">Comm. (%)</span>
                      <input type="number" defaultValue="11" className="w-full bg-white border-blue-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-blue-500 focus:border-blue-500" />
                    </label>
                    <label className="block">
                      <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-1 block">Condizioni</span>
                      <select className="w-full bg-white border-blue-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-blue-500 focus:border-blue-500">
                        <option>Nuovo</option>
                        <option>Usato</option>
                      </select>
                    </label>
                  </div>
                  <label className="block">
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-1 block">Descrizione Ottimizzata eBay</span>
                    <textarea rows={3} placeholder="HTML/Descrizione specifica per eBay..." className="w-full bg-white border-blue-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-blue-500 focus:border-blue-500 resize-none"></textarea>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3 mt-10">
               <h3 className="text-lg font-black uppercase tracking-widest text-brand-dark flex items-center gap-2">
                 <Search className="w-5 h-5 text-gray-400"/> SEO & Google Search Console
               </h3>
               <button 
                onClick={() => {
                  const titleInput = document.getElementById('seo-title') as HTMLInputElement;
                  const descInput = document.getElementById('seo-desc') as HTMLTextAreaElement;
                  const prodTitle = (document.querySelector('input[placeholder="Titolo gestionale per sito web..."]') as HTMLInputElement)?.value;
                  const prodDesc = (document.querySelector('textarea[placeholder="Decrizione per il sito ecommerce..."]') as HTMLTextAreaElement)?.value;
                  
                  if (titleInput && prodTitle) titleInput.value = `${prodTitle} | Acquista su BesPoint`;
                  if (descInput && prodDesc) descInput.value = prodDesc.substring(0, 155) + "...";
                }}
                className="text-[10px] font-black uppercase bg-brand-yellow/10 text-brand-dark px-3 py-1.5 rounded-lg border border-brand-yellow/20 hover:bg-brand-yellow transition-all"
               >
                 Auto-Genera SEO
               </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
               <label className="block">
                 <span className="text-[10px] font-black uppercase tracking-widest text-brand-blue mb-1 block">Meta Title (Sito Web)</span>
                 <input id="seo-title" type="text" placeholder="Titolo SEO ottimizzato per Google..." className="w-full bg-gray-50 border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-brand-blue focus:border-brand-blue" />
               </label>
               <label className="block">
                 <span className="text-[10px] font-black uppercase tracking-widest text-brand-blue mb-1 block">Meta Description (Sito Web)</span>
                 <textarea id="seo-desc" rows={3} placeholder="Descrizione persuasiva per aumentare i click sui motori di ricerca..." className="w-full bg-gray-50 border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-brand-blue focus:border-brand-blue resize-none"></textarea>
               </label>

               <div className="bg-white p-6 rounded-3xl border-2 border-dashed border-gray-100 space-y-3">
                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-300">Anteprima Risultato Google (Desktop)</span>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-[11px] text-[#202124]">
                       <span>https://bespoint.it</span>
                       <ChevronDown className="w-2.5 h-2.5 text-[#5f6368] rotate-270" />
                       <span className="text-[#5f6368]">prodotti</span>
                    </div>
                    <div className="text-xl text-[#1a0dab] hover:underline cursor-pointer font-medium leading-tight mb-1">
                      {amazonTitle || "Titolo Prodotto Ottimizzato | BesPoint Shop"}
                    </div>
                    <p className="text-[12px] text-[#4d5156] leading-relaxed line-clamp-2">
                       {description.substring(0, 160) || "Questa è la descrizione che apparirà su Google. Deve essere accattivante per convincere gli utenti a cliccare sul tuo prodotto."}
                    </p>
                  </div>
               </div>
            </div>
          </div>

          {/* Sezione Logistica - FULL WIDTH BLOCK spostata alla fine */}
          <div className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm space-y-8 mt-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-[1.5rem] bg-indigo-500 flex items-center justify-center shadow-xl shadow-indigo-500/20">
                <Truck className="w-7 h-7 text-white" />
              </div>
              <div>
                <h4 className="text-xl font-black uppercase tracking-tighter text-brand-dark leading-none">Logistica & Partner di Spedizione</h4>
                <div className="flex items-center gap-2 mt-2">
                   <span className="w-6 h-1 bg-indigo-500 rounded-full" />
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Configurazione Automazione Consegne</p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="relative group">
                <span className="text-[11px] font-black uppercase tracking-[0.25em] text-gray-400 mb-3 ml-2 block group-hover:text-indigo-500 transition-colors">Corriere Predefinito per questo Prodotto (Sito & Marketplace)</span>
                <div 
                  className="relative cursor-pointer"
                  onClick={() => setIsCourierDropdownOpen(!isCourierDropdownOpen)}
                >
                  <div className="w-full pl-8 pr-16 py-6 bg-gray-50 border-2 border-transparent rounded-[2rem] text-base font-medium focus:border-indigo-500 bg-white shadow-inner flex items-center">
                    <span className="font-extrabold mr-2 tracking-tighter uppercase">{selectedCourier}</span>
                    <span className="text-gray-400 text-sm italic font-normal">
                      — {COURIER_OPTIONS.find(c => c.name === selectedCourier)?.details.split(' — ')[1] || COURIER_OPTIONS.find(c => c.name === selectedCourier)?.details}
                    </span>
                  </div>
                  <div className="absolute right-8 top-1/2 -translate-y-1/2 p-3 bg-indigo-500 rounded-2xl shadow-lg border border-indigo-400 transition-transform group-hover:scale-110">
                    <ChevronDown className={`w-5 h-5 text-white transition-transform duration-300 ${isCourierDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>
                </div>

                <AnimatePresence>
                  {isCourierDropdownOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute left-0 right-0 bottom-[calc(100%+12px)] bg-white border border-gray-100 rounded-[2.5rem] shadow-2xl p-4 z-50 space-y-2 origin-bottom"
                    >
                      {COURIER_OPTIONS.map((option) => (
                        <button
                          key={option.name}
                          onClick={() => {
                            setSelectedCourier(option.name);
                            setIsCourierDropdownOpen(false);
                          }}
                          className={`w-full text-left px-6 py-4 rounded-[1.5rem] transition-all flex items-center ${selectedCourier === option.name ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'hover:bg-gray-50 text-gray-700'}`}
                        >
                          <span className={`${selectedCourier === option.name ? 'font-black' : 'font-extrabold'} text-sm tracking-tighter uppercase mr-3`}>
                            {option.name}
                          </span>
                          <span className={`text-xs ${selectedCourier === option.name ? 'text-white/70' : 'text-gray-400'} font-medium italic`}>
                            {option.details}
                          </span>
                          {selectedCourier === option.name && <Check className="ml-auto w-5 h-5" />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <div 
                className="flex items-center gap-6 bg-indigo-50/30 p-8 rounded-[2.5rem] border border-indigo-100/50"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                <div className="w-14 h-14 rounded-[1.2rem] bg-white flex items-center justify-center shrink-0 shadow-md">
                  <Info className="w-8 h-8 text-indigo-500" />
                </div>
                <div className="text-[13px] font-medium text-indigo-700/80 italic leading-relaxed tracking-tight">
                  <span className="font-extrabold uppercase">Logistica Attiva:</span> L'impostazione rifletterà la logistica principale di questo prodotto sul frontend. 
                  In caso di checkout Multi-Corriere, il sistema darà priorità a questa configurazione per il calcolo volumetrico e delle commissioni.
                </div>
              </div>
            </div>
          </div>
          
        </div>

        {/* Colonna DX: Media & Pricing Engine */}
        <div className="lg:col-span-4 space-y-6 flex flex-col">
          <div className="sticky top-28 space-y-8">
            
            {/* Galleria Media */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <h3 className="text-sm font-black uppercase tracking-widest text-brand-dark mb-4 flex items-center justify-between">
                Galleria Media 
                <span className="text-[10px] font-bold text-gray-400">{gallery.length}/6 Max</span>
              </h3>
              <div className="grid grid-cols-3 gap-2">
                 {gallery.map((img, i) => (
                    <div key={i} className={`aspect-square bg-gray-200 rounded-xl relative group overflow-hidden border-2 ${i===0 ? 'border-brand-yellow':'border-transparent'}`}>
                      <img src={img} className="w-full h-full object-cover" alt="" />
                      {i === 0 && <div className="absolute bottom-0 inset-x-0 bg-brand-yellow text-brand-dark text-[8px] font-black uppercase text-center py-0.5">Focus</div>}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <button onClick={() => setGallery(g => g.filter((_, idx) => idx !== i))} className="p-1.5 bg-red-500 text-white rounded-full hover:scale-110 transition-transform"><Trash2 className="w-3 h-3" /></button>
                      </div>
                    </div>
                 ))}
                 {gallery.length < 6 && (
                   <button 
                     onClick={() => setGallery([...gallery, `https://picsum.photos/seed/${Math.round(Math.random()*1000)}/500/500`])}
                     className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl hover:border-brand-blue hover:bg-brand-blue/5 transition-all text-gray-400 hover:text-brand-blue group cursor-pointer"
                   >
                     <Plus className="w-6 h-6 group-hover:scale-110 transition-transform mb-1" />
                     <span className="text-[8px] font-black uppercase text-center">Aggiungi</span>
                   </button>
                 )}
              </div>
            </div>

            {/* Pricing Engine */}
            <div className="bg-brand-dark rounded-2xl p-6 shadow-2xl relative overflow-hidden ring-4 ring-brand-yellow/20">
               <div className="absolute top-0 right-0 w-32 h-32 bg-brand-yellow rounded-full blur-3xl opacity-10"></div>
               <h3 className="text-sm font-black uppercase tracking-widest text-white mb-6 flex items-center gap-2 relative z-10"><RefreshCw className="w-4 h-4 text-brand-yellow"/> Motore Prezzi Dinamico</h3>
               
               <div className="space-y-6 relative z-10">
                  <label className="block">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-300 mb-1 block">Costo Base d'Acquisto</span>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-black text-gray-400">€</span>
                      <input type="number" value={baseCost} onChange={e => setBaseCost(Number(e.target.value))} className="w-full bg-black/40 border border-gray-700 text-white rounded-xl pl-8 pr-4 py-3 text-lg font-black focus:ring-brand-yellow focus:border-brand-yellow transition-all" />
                    </div>
                  </label>
                  
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-4">
                     <div>
                       <div className="flex justify-between items-center mb-1">
                          <label className="text-[10px] font-black uppercase tracking-widest text-brand-yellow">Ricarico B2C Sito (%)</label>
                          <label className="text-[10px] font-black uppercase tracking-widest text-white">Prezzo Pubblico (Override)</label>
                       </div>
                       <div className="flex gap-2">
                          <div className="relative w-1/3">
                             <input type="number" value={b2cMarkup} onChange={e => setB2cMarkup(Number(e.target.value))} className="w-full bg-black text-white border border-gray-700 rounded-lg px-2 py-2 text-sm font-bold text-center focus:border-brand-yellow focus:ring-brand-yellow" />
                          </div>
                          <div className="relative w-2/3">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-brand-dark/50">€</span>
                            <input type="number" value={manualB2c || b2cPrice.toFixed(2)} onChange={e => handleManualPrice(e.target.value, 'b2c')} placeholder={b2cPrice.toFixed(2)} className={`w-full bg-brand-yellow text-brand-dark border-none rounded-lg pl-8 pr-2 py-2 text-base font-black text-right shadow-inner focus:ring-2 focus:ring-white transition-all ${manualB2c ? 'ring-2 ring-white ring-offset-2 ring-offset-brand-dark' : ''}`} />
                            {manualB2c && <button onClick={() => setManualB2c("")} className="absolute right-0 -bottom-5 text-[8px] text-gray-400 hover:text-white uppercase font-black tracking-wider transition-colors">Reset Calcolatore</button>}
                          </div>
                       </div>
                     </div>

                     <div className="pt-2 border-t border-white/10 mt-4">
                       <div className="flex justify-between items-center mb-1">
                          <label className="text-[10px] font-black uppercase tracking-widest text-blue-400 mt-2">Ricarico VIP B2B (%)</label>
                          <label className="text-[10px] font-black uppercase tracking-widest text-white mt-2">Prezzo Rivenditori (Override)</label>
                       </div>
                       <div className="flex gap-2">
                          <div className="relative w-1/3">
                             <input type="number" value={b2bMarkup} onChange={e => setB2bMarkup(Number(e.target.value))} className="w-full bg-black text-white border border-gray-700 rounded-lg px-2 py-2 text-sm font-bold text-center focus:border-blue-500 focus:ring-blue-500" />
                          </div>
                          <div className="relative w-2/3">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-white/50">€</span>
                            <input type="number" value={manualB2b || b2bPrice.toFixed(2)} onChange={e => handleManualPrice(e.target.value, 'b2b')} placeholder={b2bPrice.toFixed(2)} className={`w-full bg-blue-500 text-white border-none rounded-lg pl-8 pr-2 py-2 text-base font-black text-right shadow-inner focus:ring-2 focus:ring-white transition-all ${manualB2b ? 'ring-2 ring-white ring-offset-2 ring-offset-brand-dark' : ''}`} />
                            {manualB2b && <button onClick={() => setManualB2b("")} className="absolute right-0 -bottom-5 text-[8px] text-gray-400 hover:text-white uppercase font-black tracking-wider transition-colors">Reset Calcolatore</button>}
                          </div>
                       </div>
                     </div>
                  </div>
               </div>
            </div>

            <button className="w-full bg-brand-yellow text-brand-dark px-8 py-5 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-yellow-400 hover:scale-[1.02] shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95">
              <Check className="w-6 h-6" />
              Salva e Pubblica
            </button>
            
          </div>
        </div>
      </div>
    </div>
  );
};
