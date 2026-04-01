import React, { useState } from "react";
import { 
  RefreshCw, 
  Search, 
  Filter, 
  Plus, 
  ChevronRight, 
  MessageCircle, 
  Truck, 
  DollarSign, 
  Tag, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Eye, 
  MoreVertical,
  Mail,
  Smartphone,
  MapPin,
  Box,
  Package,
  ArrowRight,
  AlertTriangle,
  Activity
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ReturnRequest {
    id: string;
    orderId: string;
    customer: string;
    customerEmail: string;
    date: string;
    product: {
        id: string;
        name: string;
        price: number;
        image: string;
    };
    reason: string;
    details: string;
    status: 'pending' | 'processing' | 'approved' | 'rejected' | 'completed';
    resolution?: 'refund' | 'replacement' | 'coupon' | 'none';
    messages: { role: 'user' | 'admin', text: string, date: string }[];
    history: { status: string, date: string, note?: string }[];
}

const MOCK_RETURNS: ReturnRequest[] = [
    {
        id: "RET-9901",
        orderId: "BP-2026-881",
        customer: "Marco Rossi",
        customerEmail: "marco.rossi@example.com",
        date: "31 Mar 2026",
        product: {
            id: "1",
            name: "Faretto LED Incasso 10W",
            price: 12.90,
            image: "https://picsum.photos/seed/led1/100/100"
        },
        reason: "Prodotto Difettoso",
        details: "Il faretto non si accende dopo l'installazione. Ho provato due alimentatori diversi.",
        status: "pending",
        messages: [
            { role: 'user', text: "Salve, il prodotto è arrivato non funzionante. Vorrei un cambio.", date: "31 Mar 2026 10:00" }
        ],
        history: [
            { status: "Richiesta Creata", date: "31 Mar 2026 10:00" }
        ]
    },
    {
        id: "RET-9900",
        orderId: "BP-2026-872",
        customer: "Antonio Bruno",
        customerEmail: "antonio.b@gmail.com",
        date: "30 Mar 2026",
        product: {
            id: "2",
            name: "Pannello LED 60x60",
            price: 45.00,
            image: "https://picsum.photos/seed/panel1/100/100"
        },
        reason: "Ripensamento",
        details: "Le dimensioni non sono adatte al mio soffitto, vorrei restituirlo per un rimborso.",
        status: "processing",
        resolution: "refund",
        messages: [
            { role: 'user', text: "Vorrei restituire il pannello, è troppo grande.", date: "30 Mar 2026 09:15" },
            { role: 'admin', text: "Certamente, abbiamo inoltrato la richiesta al magazzino.", date: "30 Mar 2026 11:30" }
        ],
        history: [
            { status: "Richiesta Creata", date: "30 Mar 2026 09:15" },
            { status: "In Lavorazione", date: "30 Mar 2026 11:30", note: "Verifica integrità imballaggio richiesta" }
        ]
    }
];

export const AdminReturns = () => {
    const [returns, setReturns] = useState<ReturnRequest[]>(MOCK_RETURNS);
    const [selectedRequest, setSelectedRequest] = useState<ReturnRequest | null>(null);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [adminMsg, setAdminMsg] = useState("");

    const filteredReturns = returns.filter(r => {
        const matchesFilter = filter === 'all' || r.status === filter;
        const matchesSearch = r.customer.toLowerCase().includes(search.toLowerCase()) || 
                              r.id.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const updateStatus = (id: string, status: ReturnRequest['status'], note?: string) => {
        const now = new Date().toLocaleString('it-IT');
        setReturns(prev => prev.map(r => r.id === id ? {
            ...r,
            status,
            history: [...r.history, { status: `Stato: ${status}`, date: now, note }]
        } : r));
        if (selectedRequest?.id === id) {
            setSelectedRequest(prev => prev ? {...prev, status, history: [...prev.history, { status: `Stato: ${status}`, date: now, note }]} : null);
        }
    };

    const addMessage = (id: string, text: string) => {
        const now = new Date().toLocaleString('it-IT');
        setReturns(prev => prev.map(r => r.id === id ? {
            ...r,
            messages: [...r.messages, { role: 'admin', text, date: now }]
        } : r));
        if (selectedRequest?.id === id) {
            setSelectedRequest(prev => prev ? {...prev, messages: [...prev.messages, { role: 'admin', text, date: now }]} : null);
        }
        setAdminMsg("");
    };

    const getStatusStyle = (status: string) => {
        switch(status) {
            case 'pending': return "bg-orange-100 text-orange-600 border-orange-200";
            case 'processing': return "bg-blue-100 text-blue-600 border-blue-200";
            case 'approved': return "bg-green-100 text-green-600 border-green-200";
            case 'rejected': return "bg-red-100 text-red-600 border-red-200";
            case 'completed': return "bg-gray-100 text-gray-600 border-gray-200";
            default: return "bg-gray-50 text-gray-400";
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Page Title */}
            <div className="mb-2">
                <h2 className="text-3xl font-black text-brand-dark uppercase tracking-tighter">Gestione Resi & Rimborsi</h2>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Gestisci contestazioni, riparazioni e rientri merce</p>
            </div>

            {/* Filter Bar */}
            <div className="flex bg-gray-100 p-1.5 rounded-2xl border border-gray-200 w-fit">
                {['all', 'pending', 'processing', 'completed'].map(f => (
                    <button 
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-white text-brand-dark' : 'text-gray-400 hover:text-brand-dark'}`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-black">
                {/* List */}
                <div className="lg:col-span-12">
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row gap-4 justify-between items-center bg-gray-50/50 text-black">
                            <div className="relative w-full md:w-96">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5 font-bold" />
                                <input 
                                    type="text" 
                                    placeholder="Cerca per ID Reso, Ordine o Cliente..." 
                                    className="w-full pl-12 pr-4 py-4 bg-white border-transparent rounded-2xl text-sm font-bold focus:ring-4 focus:ring-brand-yellow/20 transition-all font-mono"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-3">
                                <button className="p-4 bg-white border border-gray-200 rounded-2xl text-gray-400 hover:text-brand-dark hover:border-brand-yellow transition-all">
                                    <Filter className="w-5 h-5" />
                                </button>
                                <button className="px-6 py-4 bg-brand-dark text-brand-yellow rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-brand-yellow hover:text-brand-dark transition-all flex items-center gap-2">
                                    <RefreshCw className="w-4 h-4" />
                                    Aggiorna Lista
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto text-black">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-100 italic bg-brand-dark text-brand-yellow">
                                        <th className="p-6 text-[10px] font-black uppercase tracking-widest pl-10 border-r border-white/5">ID Reso / Data</th>
                                        <th className="p-6 text-[10px] font-black uppercase tracking-widest border-r border-white/5">Ordine</th>
                                        <th className="p-6 text-[10px] font-black uppercase tracking-widest border-r border-white/5">Cliente</th>
                                        <th className="p-6 text-[10px] font-black uppercase tracking-widest border-r border-white/5">Motivazione</th>
                                        <th className="p-6 text-[10px] font-black uppercase tracking-widest border-r border-white/5 text-center">Stato</th>
                                        <th className="p-6"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 italic">
                                    {filteredReturns.map(req => (
                                        <tr key={req.id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="p-6 pl-10">
                                                <div>
                                                    <p className="font-black text-brand-dark text-base tracking-tighter">{req.id}</p>
                                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{req.date}</p>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <div className="flex items-center gap-2">
                                                    <Tag className="w-3 h-3 text-gray-300" />
                                                    <span className="text-xs font-black text-brand-dark uppercase tracking-tight">{req.orderId}</span>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <div>
                                                    <p className="font-black text-brand-dark text-sm leading-tight">{req.customer}</p>
                                                    <p className="text-[10px] font-bold text-gray-400">{req.customerEmail}</p>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <span className="text-[10px] font-black text-brand-dark uppercase p-2 bg-gray-100 rounded-lg border border-gray-200">
                                                    {req.reason}
                                                </span>
                                            </td>
                                            <td className="p-6 text-center">
                                                <span className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(req.status)}`}>
                                                    {req.status}
                                                </span>
                                            </td>
                                            <td className="p-6 text-right">
                                                <button 
                                                    onClick={() => setSelectedRequest(req)}
                                                    className="p-3 bg-brand-yellow text-brand-dark rounded-xl hover:scale-110 active:scale-95 transition-all shadow-md"
                                                >
                                                    <Eye className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Detail Overlay */}
            <AnimatePresence>
                {selectedRequest && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedRequest(null)}
                            className="fixed inset-0 bg-brand-dark/40 backdrop-blur-md z-[100]"
                        />
                        <motion.div 
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
                            className="fixed top-0 right-0 bottom-0 w-full max-w-2xl bg-[#f8f9fa] z-[110] border-l border-gray-100 flex flex-col text-black"
                        >
                            {/* Header */}
                            <div className="p-8 bg-brand-dark text-brand-yellow flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-4 mb-2">
                                        <h2 className="text-3xl font-black tracking-tighter uppercase">{selectedRequest.id}</h2>
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(selectedRequest.status)}`}>
                                            {selectedRequest.status}
                                        </span>
                                    </div>
                                    <p className="text-xs font-bold opacity-60 uppercase tracking-widest flex items-center gap-2">
                                        Contestazione su Ordine {selectedRequest.orderId}
                                    </p>
                                </div>
                                <button 
                                    onClick={() => setSelectedRequest(null)}
                                    className="p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all"
                                >
                                    <RefreshCw className="w-6 h-6 text-white" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar text-black">
                                {/* Problem Summary */}
                                <div className="bg-red-50 p-6 rounded-[2rem] border-2 border-red-100">
                                    <div className="flex gap-4">
                                        <div className="p-4 bg-red-500 text-white rounded-2xl h-fit">
                                            <AlertTriangle className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-black text-red-600 uppercase tracking-widest mb-2">Descrizione del Problema</h3>
                                            <p className="text-sm font-bold text-red-900 leading-relaxed italic border-l-4 border-red-200 pl-4">
                                                "{selectedRequest.details}"
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Order & Product Context */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-black">
                                    <div className="bg-white p-6 rounded-[2rem] border border-gray-100">
                                        <div className="flex items-center gap-2 text-brand-dark mb-4">
                                            <Package className="w-4 h-4" />
                                            <h3 className="text-[10px] font-black uppercase tracking-widest">Merce in Contestazione</h3>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                                                <img src={selectedRequest.product.image} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex flex-col justify-center">
                                                <p className="font-black text-brand-dark text-sm leading-tight mb-1">{selectedRequest.product.name}</p>
                                                <p className="text-xs font-bold text-brand-dark/40">SKU: BP-{selectedRequest.product.id.padStart(4, '0')}</p>
                                                <p className="text-lg font-black text-brand-dark mt-2">€{selectedRequest.product.price.toFixed(2)}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 text-black">
                                        <div className="flex items-center gap-2 text-brand-dark mb-4">
                                            <Smartphone className="w-4 h-4" />
                                            <h3 className="text-[10px] font-black uppercase tracking-widest">Dettaglio Cliente</h3>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-brand-dark border border-gray-100">
                                                    <Mail className="w-4 h-4" />
                                                </div>
                                                <span className="text-xs font-bold text-brand-dark truncate">{selectedRequest.customerEmail}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-brand-dark border border-gray-100">
                                                    <MapPin className="w-4 h-4" />
                                                </div>
                                                <span className="text-xs font-bold text-brand-dark">Verbania (VB), Italia</span>
                                            </div>
                                            <button className="w-full py-2 bg-brand-yellow/20 text-brand-dark text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-brand-yellow/40 transition-all font-sans">Vedi Storico Cliente</button>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Center */}
                                <div className="space-y-6 pt-1 border-t border-gray-200 text-black">
                                    <div className="flex items-center gap-2 text-brand-dark">
                                        <Activity className="w-4 h-4" />
                                        <h3 className="text-[10px] font-black uppercase tracking-widest">Centro Risoluzioni & Workflow</h3>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <button 
                                            onClick={() => updateStatus(selectedRequest.id, 'processing', "Preso in carico dall'amministratore")}
                                            className="p-6 bg-white border border-gray-100 rounded-[2rem] hover:border-brand-yellow transition-all group flex flex-col gap-3"
                                        >
                                            <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform border border-blue-100">
                                                <Truck className="w-6 h-6" />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-brand-dark">Ritiro Merce</p>
                                                <p className="text-[9px] font-bold text-gray-400">Prenota ritiro con corriere</p>
                                            </div>
                                        </button>

                                        <button 
                                            onClick={() => updateStatus(selectedRequest.id, 'approved', "Autorizzato invio nuovo prodotto")}
                                            className="p-6 bg-white border border-gray-100 rounded-[2rem] hover:border-green-400 transition-all group flex flex-col gap-3"
                                        >
                                            <div className="w-12 h-12 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform border border-green-100">
                                                <Plus className="w-6 h-6" />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-brand-dark">Nuovo Invio</p>
                                                <p className="text-[9px] font-bold text-gray-400">Invia prodotto sostitutivo</p>
                                            </div>
                                        </button>

                                        <button 
                                            onClick={() => updateStatus(selectedRequest.id, 'approved', "Processato rimborso parziale")}
                                            className="p-6 bg-white border border-gray-100 rounded-[2rem] hover:border-brand-orange transition-all group flex flex-col gap-3"
                                        >
                                            <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform border border-orange-100">
                                                <DollarSign className="w-6 h-6" />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-brand-dark">Rimborso</p>
                                                <p className="text-[9px] font-bold text-gray-400">Genera accredito o rimborso</p>
                                            </div>
                                        </button>

                                        <button 
                                            onClick={() => updateStatus(selectedRequest.id, 'processing', "Generato codice sconto di compensazione")}
                                            className="p-6 bg-white border border-gray-100 rounded-[2rem] hover:border-purple-400 transition-all group flex flex-col gap-3"
                                        >
                                            <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform border border-purple-100">
                                                <Tag className="w-6 h-6" />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-brand-dark">Codice Sconto</p>
                                                <p className="text-[9px] font-bold text-gray-400">Emetti coupon per disservizio</p>
                                            </div>
                                        </button>
                                    </div>
                                </div>

                                {/* Chat System */}
                                <div className="space-y-6 pt-1 border-t border-gray-200 text-black">
                                    <div className="flex items-center gap-2 text-brand-dark">
                                        <MessageCircle className="w-4 h-4" />
                                        <h3 className="text-[10px] font-black uppercase tracking-widest">Comunicazioni Automatiche & Messaggi</h3>
                                    </div>

                                    <div className="bg-gray-50/50 p-6 rounded-[2.5rem] border border-gray-100 space-y-4">
                                        <div className="max-h-60 overflow-y-auto space-y-4 pr-4 custom-scrollbar flex flex-col">
                                            {selectedRequest.messages.map((m, i) => (
                                                <div key={i} className={`flex flex-col ${m.role === 'admin' ? 'items-end' : 'items-start'}`}>
                                                    <div className={`max-w-[80%] p-4 rounded-3xl text-sm font-bold border ${m.role === 'admin' ? 'bg-brand-dark text-white rounded-tr-none border-transparent' : 'bg-white text-brand-dark border-gray-100 rounded-tl-none'}`}>
                                                        {m.text}
                                                    </div>
                                                    <span className="text-[8px] font-black uppercase tracking-widest text-gray-300 mt-2 px-2">{m.date}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="pt-4 border-t border-gray-100 space-y-4">
                                            <div className="flex gap-2">
                                                {["Inoltrato a magazzino", "Merce verificata", "In attesa foto"].map(t => (
                                                    <button 
                                                        key={t}
                                                        onClick={() => setAdminMsg(t)}
                                                        className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-[8px] font-black uppercase tracking-widest text-gray-400 hover:border-brand-yellow hover:text-brand-dark transition-all font-sans"
                                                    >
                                                        {t}
                                                    </button>
                                                ))}
                                            </div>
                                            <div className="relative">
                                                <textarea 
                                                    placeholder="Scrivi una risposta al cliente..."
                                                    className="w-full bg-white border-2 border-gray-100 rounded-[2rem] p-6 pr-16 text-sm font-bold focus:border-brand-yellow transition-all font-mono resize-none h-32"
                                                    value={adminMsg}
                                                    onChange={(e) => setAdminMsg(e.target.value)}
                                                />
                                                <button 
                                                    onClick={() => addMessage(selectedRequest.id, adminMsg)}
                                                    className="absolute right-4 bottom-4 p-4 bg-brand-yellow text-brand-dark rounded-2xl hover:scale-110 active:scale-95 transition-all shadow-md"
                                                >
                                                    <ArrowRight className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Operations Timeline */}
                                <div className="space-y-6 pt-1 border-t border-gray-200 text-black">
                                    <div className="flex items-center gap-2 text-brand-dark">
                                        <Clock className="w-4 h-4" />
                                        <h3 className="text-[10px] font-black uppercase tracking-widest">Cronologia Operazioni & Log</h3>
                                    </div>
                                    <div className="space-y-6 pl-4 border-l-2 border-gray-100 ml-2">
                                        {selectedRequest.history.slice().reverse().map((h, i) => (
                                            <div key={i} className="relative">
                                                <div className="absolute -left-[26px] top-0 w-4 h-4 rounded-full bg-white border-2 border-brand-yellow z-10 transition-all group-hover:scale-110"></div>
                                                <div className="bg-white p-4 rounded-2xl border border-gray-50 hover:border-brand-yellow/30 transition-all">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <p className="text-[10px] font-black uppercase tracking-tight text-brand-dark">{h.status}</p>
                                                        <span className="text-[8px] font-bold text-gray-300">{h.date}</span>
                                                    </div>
                                                    {h.note && <p className="text-[10px] font-bold text-gray-400 italic">"{h.note}"</p>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="p-8 bg-white border-t border-gray-100 grid grid-cols-2 gap-4">
                                <button 
                                    onClick={() => updateStatus(selectedRequest.id, 'rejected', "Richiesta non conforme alle politiche di reso")}
                                    className="py-4 bg-gray-50 text-gray-400 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white hover:text-red-500 transition-all border border-transparent hover:border-red-100 font-sans"
                                >
                                    Rifiuta Reso
                                </button>
                                <button 
                                    onClick={() => updateStatus(selectedRequest.id, 'completed', "Pratica chiusa con successo")}
                                    className="py-4 bg-brand-dark text-brand-yellow rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2 font-sans"
                                >
                                    <CheckCircle2 className="w-4 h-4" />
                                    Chiudi Pratica
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};
