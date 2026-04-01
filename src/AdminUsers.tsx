import React, { useState } from "react";
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  ExternalLink, 
  Eye, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  ShoppingBag, 
  RefreshCw, 
  DollarSign, 
  Star, 
  MessageSquare, 
  ArrowRight, 
  Clock, 
  Package, 
  ShieldCheck, 
  Activity,
  MoreVertical,
  ChevronRight,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    joinDate: string;
    totalOrders: number;
    totalSpent: number;
    totalReturns: number;
    lastActive: string;
    status: 'active' | 'inactive' | 'vip';
    avatar?: string;
    notes?: string;
    history: { id: string, date: string, type: string, amount: number, status: string }[];
}

const MOCK_USERS: Customer[] = [
    {
        id: "USR-001",
        name: "Marco Rossi",
        email: "marco.rossi@example.com",
        phone: "+39 333 1234567",
        address: "Via Roma 12, 00100 Roma (RM)",
        joinDate: "12 Gen 2026",
        totalOrders: 15,
        totalSpent: 1250.40,
        totalReturns: 1,
        lastActive: "Oggi",
        status: "vip",
        avatar: "https://i.pravatar.cc/150?u=marco",
        notes: "Cliente fedele, preferisce spedizioni con GLS.",
        history: [
            { id: "BP-2026-881", date: "30 Mar 2026", type: "Ordine", amount: 124.50, status: "pending" },
            { id: "RET-9901", date: "31 Mar 2026", type: "Reso", amount: 12.90, status: "pending" },
            { id: "BP-2026-850", date: "15 Mar 2026", type: "Ordine", amount: 45.00, status: "completed" }
        ]
    },
    {
        id: "USR-002",
        name: "Giulia Bianchi",
        email: "giulia.b@email.it",
        phone: "+39 347 9876543",
        address: "Corso Milano 45, 20100 Milano (MI)",
        joinDate: "02 Feb 2026",
        totalOrders: 4,
        totalSpent: 340.00,
        totalReturns: 0,
        lastActive: "Ieri",
        status: "active",
        avatar: "https://i.pravatar.cc/150?u=giulia",
        history: [
            { id: "BP-2026-880", date: "30 Mar 2026", type: "Ordine", amount: 89.00, status: "completed" }
        ]
    }
];

export const AdminUsers = () => {
    const [users, setUsers] = useState<Customer[]>(MOCK_USERS);
    const [selectedUser, setSelectedUser] = useState<Customer | null>(null);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    const filteredUsers = users.filter(u => {
        const matchesFilter = filter === 'all' || u.status === filter;
        const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || 
                              u.email.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const getStatusStyle = (status: string) => {
        switch(status) {
            case 'vip': return "bg-amber-100 text-amber-600 border-amber-200";
            case 'active': return "bg-green-100 text-green-600 border-green-200";
            case 'inactive': return "bg-gray-100 text-gray-600 border-gray-200";
            default: return "bg-gray-50 text-gray-400";
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Page Title */}
            <div className="mb-2">
                <h2 className="text-3xl font-black text-brand-dark uppercase tracking-tighter">Archivio Utenti</h2>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Gestione database clienti e cronologia acquisti</p>
            </div>

            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: "Clienti Totali", val: "1.284", sub: "+45 questo mese", icon: Users, color: "text-brand-dark" },
                    { label: "Utenti VIP", val: "156", sub: "Spesa > €1000", icon: Star, color: "text-amber-500" },
                    { label: "Tasso Ritenzione", val: "68%", sub: "+5% vs l'anno scorso", icon: Activity, color: "text-blue-500" },
                    { label: "Valore Medio", val: "€78.50", sub: "Per singolo ordine", icon: DollarSign, color: "text-green-500" },
                ].map((s, i) => (
                    <div key={i} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 transition-all relative overflow-hidden group">
                        <div className={`absolute top-0 right-0 w-24 h-24 ${s.color.replace('text-', 'bg-')}/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:scale-150 transition-transform`}></div>
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-2xl ${s.color.replace('text-', 'bg-')}/10 ${s.color}`}>
                                <s.icon className="w-6 h-6" />
                            </div>
                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{s.label}</span>
                        </div>
                        <h3 className="text-3xl font-black text-brand-dark tracking-tighter">{s.val}</h3>
                        <p className="text-[10px] font-black uppercase tracking-widest text-green-500 mt-1">{s.sub}</p>
                    </div>
                ))}
            </div>

            {/* Main Library */}
            <div className="bg-white rounded-[3rem] border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center bg-gray-50/50 gap-6">
                    <div className="relative w-full md:w-[500px]">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5 font-bold" />
                        <input 
                            type="text" 
                            placeholder="Cerca cliente per nome, email, cellulare o ID..." 
                            className="w-full pl-16 pr-6 py-5 bg-white border-transparent rounded-[2.5rem] text-sm font-bold focus:ring-4 focus:ring-brand-yellow/20 transition-all font-mono"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-4">
                        <div className="flex bg-white p-1 rounded-[2rem] border border-gray-200">
                           {['all', 'vip', 'active', 'inactive'].map(f => (
                               <button 
                                   key={f}
                                   onClick={() => setFilter(f)}
                                   className={`px-5 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-brand-dark text-brand-yellow' : 'text-gray-400 hover:text-brand-dark'}`}
                               >
                                   {f}
                               </button>
                           ))}
                        </div>
                        <button className="p-5 bg-brand-yellow text-brand-dark rounded-full hover:scale-110 active:scale-95 transition-all">
                            <Download className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-brand-dark text-brand-yellow">
                                <th className="p-6 text-[10px] font-black uppercase tracking-widest pl-10 border-r border-white/5 whitespace-nowrap">Utente</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-widest border-r border-white/5 text-center">Stato</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-widest border-r border-white/5 text-right whitespace-nowrap">Spesa Totale</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-widest border-r border-white/5 text-center whitespace-nowrap">Ordini / Resi</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-widest">Ultima Attività</th>
                                <th className="p-6"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 italic">
                            {filteredUsers.map(user => (
                                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="p-6 pl-10">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-100 group-hover:scale-110 transition-transform">
                                                <img src={user.avatar} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="font-black text-brand-dark text-base tracking-tighter leading-none">{user.name}</p>
                                                <p className="text-[10px] font-bold text-gray-400 mt-1">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6 text-center">
                                        <span className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(user.status)}`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="p-6 text-right">
                                        <p className="text-base font-black text-brand-dark">€{user.totalSpent.toFixed(2)}</p>
                                    </td>
                                    <td className="p-6 text-center">
                                        <div className="flex flex-col items-center">
                                            <span className="text-xs font-black text-brand-dark tracking-tighter">{user.totalOrders} Ordini</span>
                                            {user.totalReturns > 0 && <span className="text-[8px] font-bold text-red-500 uppercase tracking-widest">{user.totalReturns} Resi</span>}
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <p className="text-[10px] font-black text-brand-blue uppercase tracking-widest">{user.lastActive}</p>
                                        <p className="text-[9px] font-bold text-gray-300">Da {user.joinDate}</p>
                                    </td>
                                    <td className="p-6 text-right">
                                        <button 
                                            onClick={() => setSelectedUser(user)}
                                            className="p-4 bg-gray-50 text-gray-400 rounded-2xl hover:bg-brand-yellow hover:text-brand-dark transition-all"
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Overlay User Profile */}
            <AnimatePresence>
                {selectedUser && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedUser(null)}
                            className="fixed inset-0 bg-brand-dark/60 backdrop-blur-md z-[120]"
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="fixed top-12 bottom-12 left-1/2 -ml-[450px] w-[900px] bg-white z-[130] rounded-[4rem] border border-gray-100 flex overflow-hidden max-h-[800px]"
                        >
                            {/* Sidebar Detail */}
                            <div className="w-[350px] bg-gray-50 border-r border-gray-100 flex flex-col p-10">
                                <div className="text-center mb-10">
                                    <div className="w-40 h-40 rounded-full overflow-hidden border border-white mx-auto mb-6">
                                        <img src={selectedUser.avatar} className="w-full h-full object-cover" />
                                    </div>
                                    <h2 className="text-3xl font-black text-brand-dark tracking-tighter uppercase leading-none">{selectedUser.name}</h2>
                                    <p className="text-xs font-bold text-brand-blue uppercase tracking-widest mt-3 flex items-center justify-center gap-2">
                                        <ShieldCheck className="w-4 h-4" />
                                        Cliente {selectedUser.status}
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    <div className="p-6 bg-white rounded-3xl border border-gray-200">
                                        <h4 className="text-[10px] font-black uppercase text-gray-300 tracking-widest mb-4">Dettagli Contatto</h4>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <Mail className="w-4 h-4 text-brand-dark" />
                                                <span className="text-xs font-bold text-brand-dark truncate">{selectedUser.email}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Phone className="w-4 h-4 text-brand-dark" />
                                                <span className="text-xs font-bold text-brand-dark">{selectedUser.phone}</span>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <MapPin className="w-4 h-4 text-brand-dark mt-0.5" />
                                                <span className="text-xs font-bold text-brand-dark leading-relaxed">{selectedUser.address}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 bg-brand-dark text-brand-yellow rounded-3xl">
                                        <div className="flex justify-between items-center mb-4">
                                            <h4 className="text-[10px] font-black uppercase tracking-widest opacity-60">Insight Finanziario</h4>
                                            <TrendingUp className="w-4 h-4" />
                                        </div>
                                        <h2 className="text-3xl font-black tracking-tighter">€{selectedUser.totalSpent.toFixed(2)}</h2>
                                        <p className="text-[10px] font-bold opacity-60 mt-1 uppercase tracking-widest">Totale Acquistato</p>
                                    </div>
                                </div>
                                
                                <div className="mt-auto">
                                   <button className="w-full py-4 bg-white border-2 border-brand-dark rounded-2xl font-black uppercase text-xs tracking-widest text-brand-dark hover:bg-brand-dark hover:text-brand-yellow transition-all">Contatta Cliente</button>
                                </div>
                            </div>

                            {/* Main Detail Area */}
                            <div className="flex-1 flex flex-col p-12 overflow-y-auto custom-scrollbar">
                                <div className="flex justify-between items-center mb-10">
                                    <h3 className="text-2xl font-black text-brand-dark uppercase tracking-tighter">Timeline Attività</h3>
                                    <div className="flex gap-2">
                                        <span className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-brand-dark">{selectedUser.totalOrders} Ordini</span>
                                        <span className="px-4 py-2 bg-red-50 border border-red-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-500">{selectedUser.totalReturns} Resi</span>
                                    </div>
                                </div>

                                <div className="space-y-8 relatvie">
                                    <div className="absolute left-6 top-10 bottom-10 w-0.5 bg-gray-50"></div>
                                    {selectedUser.history.map((h, i) => (
                                        <div key={i} className="flex gap-6 relative group">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 z-10 transition-transform group-hover:scale-110 ${h.type === 'Ordine' ? 'bg-brand-yellow text-brand-dark' : 'bg-red-500 text-white'}`}>
                                                {h.type === 'Ordine' ? <ShoppingBag className="w-5 h-5" /> : <RefreshCw className="w-5 h-5" />}
                                            </div>
                                            <div className="flex-1 bg-gray-50 p-6 rounded-[2rem] border border-white flex items-center justify-between group-hover:border-brand-yellow/30 transition-all">
                                                <div>
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <h4 className="font-black text-brand-dark uppercase tracking-tighter">{h.type}: {h.id}</h4>
                                                        <span className="text-[8px] font-black uppercase tracking-widest bg-white px-2 py-1 rounded-md text-gray-400 border border-gray-100">{h.status}</span>
                                                    </div>
                                                    <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest flex items-center gap-2">
                                                       <Calendar className="w-3 h-3" />
                                                       Registrato il {h.date}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-lg font-black text-brand-dark">€{h.amount.toFixed(2)}</p>
                                                    <button className="text-[9px] font-black text-brand-blue uppercase tracking-widest mt-1 hover:underline">Vedi Documento</button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-12 p-8 bg-amber-50 rounded-[2.5rem] border-2 border-amber-100 border-dashed">
                                    <div className="flex gap-4">
                                        <AlertCircle className="w-6 h-6 text-amber-500" />
                                        <div>
                                            <h4 className="text-xs font-black uppercase tracking-widest text-amber-600 mb-2">Note Amministrative</h4>
                                            <p className="text-sm font-bold text-amber-900 italic">
                                                {selectedUser.notes || "Nessuna nota particolare per questo utente."}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <button 
                                onClick={() => setSelectedUser(null)}
                                className="absolute top-8 right-8 p-4 bg-brand-dark text-brand-yellow rounded-2xl hover:scale-110 active:scale-95 transition-all z-50 border border-white/10"
                            >
                                <ArrowRight className="w-6 h-6 rotate-180" />
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};
