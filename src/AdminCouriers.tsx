import React, { useState } from 'react';
import { 
  Truck, 
  Plus, 
  Trash2, 
  Globe, 
  ExternalLink, 
  Info,
  Check,
  X,
  Camera,
  Search,
  RefreshCw,
  Settings2,
  Key,
  ShieldCheck,
  Zap,
  Globe2,
  PackageCheck,
  FileJson,
  Layout,
  CreditCard,
  Edit3,
  User,
  Star,
  Box
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface CourierApiConfig {
  id: string;
  type: 'none' | 'gls' | 'dhl' | 'brt' | 'poste' | 'custom';
  apiKey?: string;
  apiSecret?: string;
  apiEndpoint?: string;
  customerNumber?: string;
  testMode: boolean;
  webhookUrl?: string;
}

interface CourierCharacteristics {
  supportsCashOnDelivery: boolean;
  supportsInsurance: boolean;
  supportsPickup: boolean;
  supportsInternational: boolean;
  maxWeightPerPackage?: number;
  avgDeliveryTime: string;
}

interface Courier {
  id: string;
  name: string;
  logo: string;
  trackingUrl: string;
  contactEmail?: string;
  contactPhone?: string;
  isActive: boolean;
  isDefault: boolean;
  notes?: string;
  apiConfig: CourierApiConfig;
  characteristics: CourierCharacteristics;
}

const INITIAL_COURIERS: Courier[] = [
  { 
    id: 'gls', 
    name: 'GLS Italy', 
    logo: 'gls',
    trackingUrl: 'https://www.gls-italy.com/it/servizi-per-destinatari/ricerca-spedizione?search={trackingId}',
    isActive: true,
    isDefault: true,
    notes: 'Corriere predefinito per spedizioni nazionali.',
    apiConfig: {
      id: 'gls',
      type: 'gls',
      apiKey: 'GLS_API_KEY_DEMO',
      testMode: true
    },
    characteristics: {
      supportsCashOnDelivery: true,
      supportsInsurance: true,
      supportsPickup: true,
      supportsInternational: false,
      maxWeightPerPackage: 30,
      avgDeliveryTime: '24/48h'
    }
  },
  { 
    id: 'dhl', 
    name: 'DHL Express', 
    logo: 'dhl',
    trackingUrl: 'https://www.dhl.com/it-it/home/tracking.html?tracking-id={trackingId}',
    isActive: true,
    isDefault: false,
    notes: 'Utilizzato per spedizioni internazionali express.',
    apiConfig: {
      id: 'dhl',
      type: 'dhl',
      apiKey: 'DHL_EXPRESS_SECRET_DEMO',
      testMode: false
    },
    characteristics: {
      supportsCashOnDelivery: false,
      supportsInsurance: true,
      supportsPickup: true,
      supportsInternational: true,
      maxWeightPerPackage: 70,
      avgDeliveryTime: '12/24h'
    }
  },
  { 
    id: 'brt', 
    name: 'BRT Corriere Espresso', 
    logo: 'brt',
    trackingUrl: 'https://www.brt.it/it/tracking?brtCode={trackingId}',
    isActive: true,
    isDefault: false,
    apiConfig: {
      id: 'brt',
      type: 'brt',
      testMode: true
    },
    characteristics: {
      supportsCashOnDelivery: true,
      supportsInsurance: true,
      supportsPickup: true,
      supportsInternational: true,
      maxWeightPerPackage: 50,
      avgDeliveryTime: '24/72h'
    }
  },
  { 
    id: 'poste', 
    name: 'Poste Italiane', 
    logo: 'poste',
    trackingUrl: 'https://www.poste.it/cerca/index.html#/risultati-spedizioni/{trackingId}',
    isActive: true,
    isDefault: false,
    apiConfig: {
      id: 'poste',
      type: 'poste',
      testMode: false
    },
    characteristics: {
      supportsCashOnDelivery: true,
      supportsInsurance: false,
      supportsPickup: false,
      supportsInternational: true,
      maxWeightPerPackage: 20,
      avgDeliveryTime: '3-5 giorni'
    }
  },
];

export const AdminCouriers = () => {
  const [couriers, setCouriers] = useState<Courier[]>(INITIAL_COURIERS);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditingApi, setIsEditingApi] = useState<string | null>(null);
  const [isEditingDetails, setIsEditingDetails] = useState<Courier | null>(null);
  const [search, setSearch] = useState("");
  
  const [newCourier, setNewCourier] = useState<Partial<Courier>>({
    name: "",
    logo: "gls",
    trackingUrl: "",
    isActive: true,
    isDefault: false,
    apiConfig: {
      id: '',
      type: 'none',
      testMode: true
    },
    characteristics: {
      supportsCashOnDelivery: false,
      supportsInsurance: false,
      supportsPickup: false,
      supportsInternational: false,
      avgDeliveryTime: '24/48h'
    }
  });

  const filteredCouriers = couriers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const addCourier = () => {
    if (newCourier.name) {
      const id = newCourier.name.toLowerCase().replace(/\s+/g, '-');
      setCouriers([...couriers, { 
        ...newCourier as Courier, 
        id: id + Date.now() 
      }]);
      setNewCourier({ 
        name: "", logo: "", trackingUrl: "", isActive: true,
        apiConfig: { id: '', type: 'none', testMode: true },
        characteristics: { supportsCashOnDelivery: false, supportsInsurance: false, supportsPickup: false, supportsInternational: false, avgDeliveryTime: '24/48h' }
      });
      setIsAdding(false);
    }
  };

  const updateCourier = (updated: Courier) => {
    let newCouriers = couriers.map(c => c.id === updated.id ? updated : c);
    
    // If this one is now default, others shouldn't be
    if (updated.isDefault) {
      newCouriers = newCouriers.map(c => c.id === updated.id ? c : { ...c, isDefault: false });
    }
    
    setCouriers(newCouriers);
    setIsEditingDetails(null);
  };

  const updateCourierApi = (id: string, apiConfig: CourierApiConfig) => {
    setCouriers(couriers.map(c => c.id === id ? { ...c, apiConfig } : c));
  };

  const deleteCourier = (id: string) => {
    if (window.confirm("Sei sicuro di voler eliminare questo corriere?")) {
      setCouriers(couriers.filter(c => c.id !== id));
    }
  };

  const toggleStatus = (id: string) => {
    setCouriers(couriers.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c));
  };

  const setDefaultCourier = (id: string) => {
    setCouriers(couriers.map(c => ({
      ...c,
      isDefault: c.id === id
    })));
  };

  const getCourierIcon = (logo: string, className: string = "w-10 h-10") => {
    switch (logo) {
      case 'gls': return <Truck className={`${className} text-blue-600`} />;
      case 'dhl': return <Zap className={`${className} text-yellow-600`} />;
      case 'brt': return <Box className={`${className} text-red-600`} />;
      case 'poste': return <Globe className={`${className} text-yellow-600`} />;
      default: return <Truck className={`${className} text-gray-400`} />;
    }
  };

  const getApiColor = (type: string) => {
    switch (type) {
      case 'none': return 'bg-gray-100 text-gray-400';
      case 'gls': return 'bg-blue-50 text-blue-600';
      case 'dhl': return 'bg-yellow-50 text-yellow-600';
      case 'brt': return 'bg-red-50 text-red-600';
      case 'poste': return 'bg-yellow-50 text-brand-dark';
      default: return 'bg-brand-yellow/20 text-brand-dark';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-brand-dark uppercase tracking-tighter leading-none mb-2">Configurazione Corrieri</h2>
          <div className="flex items-center gap-2">
            <span className="w-8 h-1 bg-brand-yellow rounded-full" />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Automazione Spedizioni & Integrazioni API</p>
          </div>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="group relative bg-brand-dark text-brand-yellow px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all flex items-center gap-3 active:scale-95 overflow-hidden w-full md:w-auto"
        >
          <Plus className="w-5 h-5" />
          <span>Nuovo Corriere</span>
        </button>
      </div>

      {/* Search & Stats Bar */}
      <div className="bg-white p-6 md:p-8 rounded-[3rem] border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="relative w-full md:w-[28rem]">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5 font-bold" />
          <input 
            type="text" 
            placeholder="Cerca un partner logistico..." 
            className="w-full pl-16 pr-6 py-5 bg-gray-50/50 border-2 border-transparent rounded-[2rem] text-sm font-bold focus:ring-4 focus:ring-brand-yellow/10 focus:bg-white focus:border-brand-yellow/30 transition-all font-mono"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-6 md:gap-12 flex-wrap justify-center text-black">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-black text-brand-dark">{couriers.length}</span>
            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Totali</span>
          </div>
          <div className="w-px h-10 bg-gray-100 hidden sm:block" />
          <div className="flex flex-col items-center">
            <span className="text-2xl font-black text-green-500">{couriers.filter(c => c.isActive).length}</span>
            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Attivi</span>
          </div>
          <div className="w-px h-10 bg-gray-100 hidden sm:block" />
          <div className="flex flex-col items-center">
            <span className="text-2xl font-black text-blue-500">{couriers.filter(c => c.apiConfig.type !== 'none').length}</span>
            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Con API</span>
          </div>
        </div>
      </div>

      {/* Add New Courier Modal Overlay */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdding(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-[3rem] border border-gray-100 overflow-hidden"
            >
              <div className="bg-brand-dark p-8 md:p-10 flex justify-between items-center text-white">
                <div>
                  <h3 className="text-2xl font-black text-brand-yellow uppercase tracking-tighter">Nuovo Corriere</h3>
                  <p className="text-xs text-brand-yellow/60 font-bold uppercase tracking-widest mt-1">Configura il profilo logistico</p>
                </div>
                <button onClick={() => setIsAdding(false)} className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all font-sans">
                  <X />
                </button>
              </div>
              
              <div className="p-8 md:p-10 max-h-[70vh] overflow-y-auto no-scrollbar space-y-12 text-black">
                {/* Basic Info */}
                <section className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-yellow flex items-center justify-center">
                      <Truck className="w-4 h-4 text-brand-dark" />
                    </div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-brand-dark">Dati Principali</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Nome Corriere</label>
                       <input 
                         type="text" 
                         placeholder="es: DHL Global"
                         value={newCourier.name}
                         onChange={(e) => setNewCourier({...newCourier, name: e.target.value})}
                         className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:border-brand-yellow transition-all font-mono"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Immagine Logo (URL)</label>
                       <input 
                         type="text" 
                         placeholder="https://..."
                         value={newCourier.logo}
                         onChange={(e) => setNewCourier({...newCourier, logo: e.target.value})}
                         className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:border-brand-yellow transition-all font-mono"
                       />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                       <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Template URL Tracking</label>
                       <input 
                         type="text" 
                         placeholder="https://server.com/track?id={trackingId}"
                         value={newCourier.trackingUrl}
                         onChange={(e) => setNewCourier({...newCourier, trackingUrl: e.target.value})}
                         className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:border-brand-yellow transition-all font-mono"
                       />
                    </div>
                  </div>
                </section>

                {/* Characteristics */}
                <section className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                      <Settings2 className="w-4 h-4 text-white" />
                    </div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-brand-dark">Caratteristiche & Servizi</h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: 'Contrassegno', key: 'supportsCashOnDelivery', icon: CreditCard },
                      { label: 'Assicurazione', key: 'supportsInsurance', icon: ShieldCheck },
                      { label: 'Ritiro Sede', key: 'supportsPickup', icon: PackageCheck },
                      { label: 'Internazionale', key: 'supportsInternational', icon: Globe2 },
                    ].map((feat) => (
                      <button
                        key={feat.key}
                        onClick={() => setNewCourier({
                          ...newCourier,
                          characteristics: { 
                            ...newCourier.characteristics!, 
                            [feat.key]: !((newCourier.characteristics as any)[feat.key]) 
                          }
                        })}
                        className={`flex flex-col items-center gap-3 p-6 rounded-[2rem] border-2 transition-all font-sans ${
                          (newCourier.characteristics as any)[feat.key]
                            ? 'bg-brand-yellow/10 border-brand-yellow text-brand-dark'
                            : 'bg-white border-gray-100 text-gray-300'
                        }`}
                      >
                        <feat.icon className="w-6 h-6" />
                        <span className="text-[9px] font-black uppercase tracking-widest leading-none text-center">{feat.label}</span>
                      </button>
                    ))}
                  </div>
                </section>
              </div>

              <div className="p-8 bg-gray-50 border-t border-gray-100 flex justify-end gap-4">
                <button 
                  onClick={() => setIsAdding(false)}
                  className="px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest text-gray-400 hover:bg-gray-200 transition-all font-sans"
                >
                  Indietro
                </button>
                <button 
                  onClick={addCourier}
                  className="px-12 py-5 bg-brand-dark text-brand-yellow rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-black transition-all font-sans"
                >
                  Conferma & Salva
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Courier Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
        {filteredCouriers.map((courier) => (
          <motion.div 
            layout
            key={courier.id}
            className="group relative bg-white rounded-[3.5rem] border border-gray-100 hover:border-brand-yellow/30 transition-all duration-500 overflow-hidden"
          >
            {/* Status Badge */}
            <div className="absolute top-8 right-8 flex flex-col items-end gap-2">
              <div 
                className={`w-3 h-3 rounded-full border-4 border-white transition-all duration-500 ${courier.isActive ? 'bg-green-500' : 'bg-gray-300'}`} 
                title={courier.isActive ? "Attivo" : "Disabilitato"}
              />
            </div>

            <div className="p-10 space-y-8">
              {/* Top Header */}
              <div className="flex justify-between items-start">
                <div className="relative">
                  {courier.isDefault && (
                    <div className="absolute -top-3 -left-3 bg-brand-yellow text-brand-dark p-1.5 rounded-full border border-white z-10 animate-pulse" title="Corriere Predefinito">
                      <Star className="w-3 h-3 fill-brand-dark" />
                    </div>
                  )}
                  <div 
                    className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center p-4 border border-gray-100 group-hover:bg-white group-hover:scale-110 transition-all duration-700 shadow-inner group-hover:rotate-6 overflow-hidden relative"
                    onClick={() => setDefaultCourier(courier.id)}
                    title="Clicca per rendere predefinito"
                    style={{ cursor: 'pointer' }}
                  >
                    {getCourierIcon(courier.logo, "w-10 h-10")}
                  </div>
                  {courier.apiConfig.type !== 'none' && (
                    <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-2 rounded-xl border border-white">
                      <Zap className="w-3 h-3 fill-white" />
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => setIsEditingDetails(courier)}
                    title="Modifica"
                    className="p-3 bg-gray-50 text-gray-400 hover:bg-brand-yellow hover:text-brand-dark rounded-xl transition-all"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => deleteCourier(courier.id)}
                    className="p-3 bg-red-50 text-red-300 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Title & Info */}
              <div>
                <h3 className="text-xl font-black text-brand-dark h-7 flex items-center truncate uppercase tracking-tighter leading-none">{courier.name}</h3>
                <div className="flex items-center gap-2 mt-3">
                  <span className={`px-2 py-1 rounded-lg text-[7px] font-black uppercase tracking-widest ${getApiColor(courier.apiConfig.type)}`}>
                    API: {courier.apiConfig.type.toUpperCase()}
                  </span>
                  <span className="text-gray-200">|</span>
                  <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1 font-sans">
                    <RefreshCw className="w-2.5 h-2.5" /> {courier.characteristics.avgDeliveryTime}
                  </span>
                </div>
              </div>

              {/* Characteristics Pills */}
              <div className="flex flex-wrap gap-2 py-4 border-y border-gray-50 min-h-[50px]">
                {courier.characteristics.supportsCashOnDelivery && (
                  <span className="bg-green-50 text-green-600 px-2 py-1 rounded-md text-[7px] font-bold uppercase tracking-widest">Contrassegno</span>
                )}
                {courier.characteristics.supportsInsurance && (
                  <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-md text-[7px] font-bold uppercase tracking-widest">Assicurato</span>
                )}
                {courier.characteristics.supportsInternational && (
                  <span className="bg-purple-50 text-purple-600 px-2 py-1 rounded-md text-[7px] font-bold uppercase tracking-widest">Global</span>
                )}
                {courier.characteristics.supportsPickup && (
                  <span className="bg-orange-50 text-orange-600 px-2 py-1 rounded-md text-[7px] font-bold uppercase tracking-widest">Pickup</span>
                )}
              </div>

              {/* Action Bar */}
              <div className="grid grid-cols-1 gap-3 pt-2">
                <button 
                  onClick={() => setIsEditingApi(courier.id)}
                  className="bg-brand-dark text-brand-yellow py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black transition-all group/btn font-sans"
                >
                  <Key className="w-3.5 h-3.5" />
                  Configura API
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => toggleStatus(courier.id)}
                    className={`py-3.5 rounded-xl text-[8px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all font-sans ${
                      courier.isActive 
                        ? 'bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500' 
                        : 'bg-green-50 text-green-600 hover:bg-green-100'
                    }`}
                  >
                    {courier.isActive ? <X className="w-3 h-3" /> : <Check className="w-3 h-3" />}
                    {courier.isActive ? 'Pausa' : 'Attiva'}
                  </button>
                  <a 
                    href={courier.trackingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-gray-50 text-gray-400 hover:bg-white hover:text-brand-dark border border-gray-100 rounded-xl flex items-center justify-center py-3.5 transition-all font-sans"
                  >
                    <Globe className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* API Configuration Sidebar/Modal */}
      <AnimatePresence>
        {isEditingApi && (
          <div className="fixed inset-0 z-[60] flex items-center justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditingApi(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-xl h-full bg-white border-l border-gray-100 flex flex-col text-black"
            >
              <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 rounded-2xl bg-brand-dark flex items-center justify-center">
                    <FileJson className="w-6 h-6 text-brand-yellow" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-brand-dark uppercase tracking-tighter leading-none">Integrazione API</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{couriers.find(c => c.id === isEditingApi)?.name}</p>
                  </div>
                </div>
                <button onClick={() => setIsEditingApi(null)} className="p-3 bg-white hover:bg-gray-100 rounded-xl transition-all font-sans">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-10 no-scrollbar">
                <div className="bg-blue-50 border border-blue-100 p-6 rounded-3xl flex gap-4">
                  <Info className="w-6 h-6 text-blue-500 shrink-0" />
                  <p className="text-xs font-bold text-blue-600 leading-relaxed italic">
                    Inserisci le credenziali fornite dal corriere per abilitare la generazione automatica delle etichette e il tracking automatico.
                  </p>
                </div>

                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Ambiente di Esecuzione</label>
                    <div className="grid grid-cols-2 gap-4">
                      <button 
                        onClick={() => {
                          const courier = couriers.find(c => c.id === isEditingApi);
                          if (courier) updateCourierApi(isEditingApi, { ...courier.apiConfig, testMode: true });
                        }}
                        className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all font-sans ${
                          couriers.find(c => c.id === isEditingApi)?.apiConfig.testMode 
                            ? 'bg-amber-50 border-amber-400 text-amber-600' 
                            : 'bg-white border-gray-100 text-gray-300'
                        }`}
                      >
                        SandBox / Test
                      </button>
                      <button 
                        onClick={() => {
                          const courier = couriers.find(c => c.id === isEditingApi);
                          if (courier) updateCourierApi(isEditingApi, { ...courier.apiConfig, testMode: false });
                        }}
                        className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all font-sans ${
                          !couriers.find(c => c.id === isEditingApi)?.apiConfig.testMode 
                            ? 'bg-green-50 border-green-400 text-green-600' 
                            : 'bg-white border-gray-100 text-gray-300'
                        }`}
                      >
                        Live / Produzione
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Provider API</label>
                    <div className="relative">
                       <select 
                         className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:border-brand-yellow transition-all appearance-none font-mono"
                         value={couriers.find(c => c.id === isEditingApi)?.apiConfig.type || 'none'}
                         onChange={(e) => {
                           const courier = couriers.find(c => c.id === isEditingApi);
                           if (courier) updateCourierApi(isEditingApi, { ...courier.apiConfig, type: e.target.value as any });
                         }}
                       >
                         <option value="none">Nessuna Integrazione</option>
                         <option value="gls">GLS WebService</option>
                         <option value="dhl">DHL Express API</option>
                         <option value="brt">BRT API Gateway</option>
                         <option value="poste">Crononline (Poste)</option>
                         <option value="custom">Custom JSON/REST</option>
                       </select>
                    </div>
                  </div>

                  <div className="space-y-6 text-black">
                    {[
                      { label: 'API Key / User ID', key: 'apiKey', icon: Key },
                      { label: 'API Secret / Password', key: 'apiSecret', icon: ShieldCheck, type: 'password' },
                      { label: 'Endpoint Base URL', key: 'apiEndpoint', icon: Globe },
                      { label: 'Codice Cliente / Account Number', key: 'customerNumber', icon: User },
                    ].map((field) => (
                      <div key={field.key} className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 ml-1">{field.label}</label>
                        <div className="relative">
                          <field.icon className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
                          <input 
                            type={field.type || 'text'}
                            className="w-full pl-14 pr-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:border-brand-yellow focus:bg-white transition-all font-mono"
                            value={(couriers.find(c => c.id === isEditingApi)?.apiConfig as any)[field.key] || ''}
                            onChange={(e) => {
                              const courier = couriers.find(c => c.id === isEditingApi);
                              if (courier) {
                                updateCourierApi(isEditingApi, { ...courier.apiConfig, [field.key]: e.target.value });
                              }
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-6 bg-brand-yellow/5 rounded-3xl border border-brand-yellow/20 space-y-4">
                    <label className="text-[10px] font-black uppercase text-brand-dark/60 ml-1">Webhook URL per Notifiche Tracking</label>
                    <div className="relative">
                      <ExternalLink className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-yellow w-4 h-4" />
                      <input 
                        type="text" 
                        readOnly
                        value={`https://api.bespoint.it/v1/webhooks/shipping/${isEditingApi}`}
                        className="w-full pl-14 pr-12 py-4 bg-white border-2 border-brand-yellow/20 rounded-2xl text-[11px] font-bold text-brand-dark/50"
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <button 
                      onClick={() => {
                        const btn = document.getElementById('test-api-btn');
                        if (btn) {
                          const originalText = btn.innerHTML;
                          btn.innerHTML = '<span class="animate-spin mr-2">◌</span> Test in corso...';
                          btn.style.opacity = '0.7';
                          setTimeout(() => {
                            btn.innerHTML = '<span class="text-green-500 mr-2">✓</span> Connessione Riuscita';
                            btn.style.background = '#f0fdf4';
                            btn.style.borderColor = '#22c55e';
                            setTimeout(() => {
                              btn.innerHTML = originalText;
                              btn.style.opacity = '1';
                              btn.style.background = 'white';
                              btn.style.borderColor = '#e5e7eb';
                            }, 3000);
                          }, 1500);
                        }
                      }}
                      id="test-api-btn"
                      className="w-full py-4 bg-white border-2 border-gray-100 text-brand-dark rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:border-brand-yellow transition-all font-sans font-sans"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Testa Connessione API
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-gray-50 border-t border-gray-100">
                <button 
                  onClick={() => setIsEditingApi(null)}
                  className="w-full bg-brand-dark text-brand-yellow py-5 rounded-[2rem] font-black uppercase text-[10px] tracking-widest transition-all font-sans"
                >
                  Salva Configurazione
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Details Table/Modal */}
      <AnimatePresence>
        {isEditingDetails && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 text-black font-sans">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditingDetails(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-4xl bg-white rounded-[3.5rem] border border-gray-100 overflow-hidden text-black"
            >
              <div className="bg-brand-yellow p-8 md:p-10 flex justify-between items-center">
                <div className="flex gap-4 items-center">
                  <div className="w-14 h-14 rounded-2xl bg-brand-dark flex items-center justify-center shadow-xl">
                    <Edit3 className="w-6 h-6 text-brand-yellow" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-brand-dark uppercase tracking-tighter leading-none">Profilo Corriere</h3>
                    <p className="text-[10px] text-brand-dark/60 font-bold uppercase tracking-widest mt-1">Stai modificando {isEditingDetails.name}</p>
                  </div>
                </div>
                <button onClick={() => setIsEditingDetails(null)} className="w-12 h-12 rounded-2xl bg-brand-dark/10 flex items-center justify-center text-brand-dark hover:bg-brand-dark/20 transition-all font-sans">
                  <X />
                </button>
              </div>
              
              <div className="p-8 md:p-10 max-h-[60vh] overflow-y-auto no-scrollbar grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Nome Visualizzato</label>
                    <input 
                      type="text" 
                      value={isEditingDetails.name}
                      onChange={(e) => setIsEditingDetails({...isEditingDetails, name: e.target.value})}
                      className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-[1.5rem] text-sm font-bold focus:border-brand-yellow focus:bg-white transition-all font-mono"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Icona Logo & Predefinito</label>
                    <div className="flex gap-4 items-center">
                      <div className="w-20 h-20 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center p-2 shrink-0 overflow-hidden shadow-inner">
                        {getCourierIcon(isEditingDetails.logo, "w-8 h-8")}
                      </div>
                      <div className="flex-1 space-y-4">
                        <select 
                          value={isEditingDetails.logo}
                          onChange={(e) => setIsEditingDetails({...isEditingDetails, logo: e.target.value})}
                          className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-[1.5rem] text-sm font-bold focus:border-brand-yellow focus:bg-white transition-all appearance-none font-mono"
                        >
                          <option value="gls">Icona GLS (Truck Blue)</option>
                          <option value="dhl">Icona DHL (Zap Yellow)</option>
                          <option value="brt">Icona BRT (Box Red)</option>
                          <option value="poste">Icona Poste (Globe Yellow)</option>
                        </select>
                        
                        <button
                          onClick={() => setIsEditingDetails({...isEditingDetails, isDefault: !isEditingDetails.isDefault})}
                          className={`w-full flex items-center justify-between px-6 py-4 rounded-[1.5rem] border-2 transition-all font-sans ${
                            isEditingDetails.isDefault 
                              ? 'bg-brand-yellow text-brand-dark border-brand-yellow' 
                              : 'bg-white text-gray-300 border-gray-100'
                          }`}
                        >
                          <span className="text-[9px] font-black uppercase tracking-widest pl-2">Imposta come Predefinito</span>
                          <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${isEditingDetails.isDefault ? 'bg-brand-dark text-brand-yellow' : 'bg-gray-50 text-gray-200'}`}>
                            <Check className="w-3 h-3" />
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Caratteristiche Attive</label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: 'Contrassegno', key: 'supportsCashOnDelivery', icon: CreditCard },
                        { label: 'Assicurazione', key: 'supportsInsurance', icon: ShieldCheck },
                        { label: 'Ritiro Sede', key: 'supportsPickup', icon: PackageCheck },
                        { label: 'Internazionale', key: 'supportsInternational', icon: Globe2 },
                      ].map((feat) => (
                        <button
                          key={feat.key}
                          onClick={() => setIsEditingDetails({
                            ...isEditingDetails,
                            characteristics: { 
                              ...isEditingDetails.characteristics, 
                              [feat.key]: !((isEditingDetails.characteristics as any)[feat.key]) 
                            }
                          })}
                          className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all font-sans ${
                            (isEditingDetails.characteristics as any)[feat.key]
                              ? 'bg-brand-yellow/10 border-brand-yellow text-brand-dark'
                              : 'bg-white border-gray-50 text-gray-300'
                          }`}
                        >
                          <feat.icon className="w-3 h-3" />
                          <span className="text-[8px] font-black uppercase tracking-widest">{feat.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Tempo di Consegna Medio</label>
                    <input 
                      type="text" 
                      value={isEditingDetails.characteristics.avgDeliveryTime}
                      onChange={(e) => setIsEditingDetails({
                        ...isEditingDetails, 
                        characteristics: { ...isEditingDetails.characteristics, avgDeliveryTime: e.target.value }
                      })}
                      className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-[1.5rem] text-sm font-bold focus:border-brand-yellow focus:bg-white transition-all font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="p-8 bg-gray-50 border-t border-gray-100 flex justify-end gap-4">
                 <button 
                  onClick={() => setIsEditingDetails(null)}
                  className="px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest text-gray-400 hover:bg-gray-200 transition-all font-sans"
                >
                  Annulla
                </button>
                <button 
                  onClick={() => updateCourier(isEditingDetails)}
                  className="px-12 py-5 bg-brand-dark text-brand-yellow rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-black transition-all font-sans"
                >
                  Salva Modifiche
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
