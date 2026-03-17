/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  ShieldQuestion, 
  Upload, 
  Link as LinkIcon, 
  User, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle,
  Loader2,
  ArrowRight,
  Info,
  RefreshCcw,
  Mail
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Markdown from 'react-markdown';
import { analyzeMessage, AnalysisResult, parseEmailContent } from './services/geminiService';

export default function App() {
  const [text, setText] = useState('');
  const [sender, setSender] = useState('');
  const [links, setLinks] = useState('');
  const [urlToAnalyze, setUrlToAnalyze] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isParsingEmail, setIsParsingEmail] = useState(false);
  const [isFetchingGmail, setIsFetchingGmail] = useState(false);
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'ok' | 'error'>('checking');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch('/api/health');
        if (res.ok) setBackendStatus('ok');
        else setBackendStatus('error');
      } catch (e) {
        setBackendStatus('error');
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30s

    const checkGoogleStatus = async () => {
      try {
        const res = await fetch('/api/auth/google/status');
        const data = await res.json();
        setIsGoogleConnected(data.connected);
      } catch (e) {
        console.error("Failed to check Google status");
      }
    };
    checkGoogleStatus();

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'GOOGLE_AUTH_SUCCESS') {
        setIsGoogleConnected(true);
      }
    };
    window.addEventListener('message', handleMessage);

    return () => {
      clearInterval(interval);
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const handleGoogleConnect = async () => {
    try {
      const res = await fetch('/api/auth/google/url');
      const { url } = await res.json();
      window.open(url, 'google_auth', 'width=600,height=700');
    } catch (e) {
      setError('Impossibile avviare la connessione con Google.');
    }
  };

  const handleGoogleLogout = async () => {
    await fetch('/api/auth/google/logout', { method: 'POST' });
    setIsGoogleConnected(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEmailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsParsingEmail(true);
      setError(null);
      try {
        const text = await file.text();
        const data = await parseEmailContent(text);
        setText(data.body);
        setSender(data.sender);
        setLinks(data.links.join(', '));
      } catch (err) {
        setError('Errore durante la lettura del file e-mail. Assicurati che sia un file .eml o di testo valido.');
        console.error(err);
      } finally {
        setIsParsingEmail(false);
        if (emailInputRef.current) emailInputRef.current.value = '';
      }
    }
  };

  const handleAnalyze = async () => {
    let contentToAnalyze = text;
    let senderToAnalyze = sender;

    if (urlToAnalyze) {
      setIsAnalyzing(true);
      setError(null);
      
      // Check if it's a Gmail URL
      if (urlToAnalyze.includes('mail.google.com')) {
        if (!isGoogleConnected) {
          setError('Per analizzare un URL di Gmail, devi prima collegare il tuo account Google.');
          setIsAnalyzing(false);
          return;
        }
        
        setIsFetchingGmail(true);
        try {
          const res = await fetch('/api/gmail/fetch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: urlToAnalyze })
          });
          const data = await res.json();
          if (data.error) throw new Error(data.error);
          
          contentToAnalyze = data.content;
          senderToAnalyze = data.metadata.from;
          setText(data.content);
          setSender(data.metadata.from);
        } catch (err: any) {
          setError(err.message || 'Errore durante il recupero dell\'email da Gmail.');
          setIsAnalyzing(false);
          setIsFetchingGmail(false);
          return;
        } finally {
          setIsFetchingGmail(false);
        }
      }
    }

    if (!contentToAnalyze && !image && !urlToAnalyze) {
      setError('Per favore, inserisci un testo, carica un\'immagine o incolla un URL da analizzare.');
      setIsAnalyzing(false);
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const linkList = links.split(',').map(l => l.trim()).filter(l => l !== '');
      const analysis = await analyzeMessage(
        contentToAnalyze, 
        senderToAnalyze, 
        linkList, 
        image || undefined,
        urlToAnalyze && !urlToAnalyze.includes('mail.google.com') ? urlToAnalyze : undefined
      );
      setResult(analysis);
    } catch (err) {
      setError('Si è verificato un errore durante l\'analisi. Riprova.');
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setText('');
    setSender('');
    setLinks('');
    setUrlToAnalyze('');
    setImage(null);
    setResult(null);
    setError(null);
  };

  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    setTooltipPos({ x: e.clientX, y: e.clientY });
  };

  const getThreatColor = (level: string) => {
    switch (level) {
      case 'Low': return 'text-emerald-500 bg-emerald-50 border-emerald-200';
      case 'Medium': return 'text-amber-500 bg-amber-50 border-amber-200';
      case 'High': return 'text-orange-500 bg-orange-50 border-orange-200';
      case 'Critical': return 'text-red-500 bg-red-50 border-red-200';
      default: return 'text-slate-500 bg-slate-50 border-slate-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 50) return 'text-amber-500';
    if (score >= 30) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-indigo-100">
      {/* Developer Setup Overlay (Only if keys are missing) */}
      {!isGoogleConnected && !process.env.GOOGLE_CLIENT_ID && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-3">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-amber-800 text-sm font-medium">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>
                <strong>Configurazione Richiesta:</strong> Per analizzare gli URL di Gmail, devi configurare le API di Google nei <strong>Settings</strong> di AI Studio.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <a 
                href="https://console.cloud.google.com/apis/credentials/oauthclient" 
                target="_blank" 
                rel="noreferrer"
                className="text-xs bg-amber-200 hover:bg-amber-300 text-amber-900 px-3 py-1.5 rounded-lg font-bold transition-colors"
              >
                Ottieni Chiavi
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-200">
                <ShieldAlert className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900">
                Phish<span className="text-indigo-600">Guard</span>
              </h1>
              <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                backendStatus === 'ok' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                backendStatus === 'error' ? 'bg-red-50 text-red-600 border-red-100' : 
                'bg-slate-50 text-slate-400 border-slate-100'
              }`}>
                <div className={`w-1.5 h-1.5 rounded-full ${
                  backendStatus === 'ok' ? 'bg-emerald-500 animate-pulse' : 
                  backendStatus === 'error' ? 'bg-red-500' : 
                  'bg-slate-300'
                }`} />
                {backendStatus === 'ok' ? 'Online' : backendStatus === 'error' ? 'Offline' : 'Checking'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {isGoogleConnected ? (
              <div className="flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                  G
                </div>
                <div className="hidden sm:block">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Account</p>
                  <p className="text-xs font-bold text-slate-700">Google Connesso</p>
                </div>
                <button 
                  onClick={handleGoogleLogout}
                  className="text-slate-400 hover:text-red-500 transition-colors"
                  title="Disconnetti Google"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button 
                onClick={handleGoogleConnect}
                className="bg-white border border-slate-200 hover:border-indigo-300 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 shadow-sm transition-all flex items-center gap-2"
              >
                <div className="w-4 h-4 bg-indigo-600 rounded-full flex items-center justify-center text-[10px] text-white">G</div>
                Connetti Google
              </button>
            )}
            <button 
              onClick={reset}
              className="text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <RefreshCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Nuova Analisi</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <section className="space-y-6">
            {/* Email Import & Guide */}
            <div className="glass-card rounded-3xl p-8 transition-all hover:shadow-2xl hover:shadow-indigo-100/50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-3 text-slate-800">
                  <div className="p-2 bg-indigo-50 rounded-lg">
                    <Mail className="w-5 h-5 text-indigo-600" />
                  </div>
                  Importa da E-mail
                </h2>
                <div className="group relative">
                  <button className="p-2 bg-slate-100 rounded-full text-slate-500 hover:text-indigo-600 transition-all hover:rotate-12">
                    <Info className="w-4 h-4" />
                  </button>
                  <div className="absolute right-0 top-full mt-3 w-72 p-5 bg-white rounded-2xl shadow-2xl border border-slate-100 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all z-30 text-sm text-slate-600 space-y-3 pointer-events-none">
                    <p className="font-black text-slate-900 border-b border-slate-100 pb-2">Guida all'esportazione</p>
                    <div className="space-y-2">
                      <p><span className="font-bold text-indigo-600">Gmail:</span> Apri l'email, clicca su <span className="bg-slate-100 px-1 rounded">⋮</span> e seleziona <span className="italic">"Scarica messaggio"</span>.</p>
                      <p><span className="font-bold text-indigo-600">Outlook:</span> Vai su <span className="italic">"File" &gt; "Salva con nome"</span> e scegli il formato <span className="font-mono text-[10px] bg-slate-100 px-1 rounded">.eml</span>.</p>
                      <p><span className="font-bold text-indigo-600">Apple Mail:</span> <span className="italic">"File" &gt; "Salva come..."</span> e scegli <span className="italic">"Sorgente messaggio"</span>.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div 
                onClick={() => emailInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-500 flex flex-col items-center justify-center gap-4 group/drop ${isParsingEmail ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30'}`}
              >
                <input 
                  type="file" 
                  ref={emailInputRef}
                  onChange={handleEmailUpload}
                  accept=".eml,.txt"
                  className="hidden"
                />
                {isParsingEmail ? (
                  <>
                    <div className="relative">
                      <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
                      <Mail className="w-5 h-5 text-indigo-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <p className="text-sm text-indigo-600 font-black tracking-wide animate-pulse">ESTRAZIONE INTELLIGENTE...</p>
                  </>
                ) : (
                  <>
                    <div className="p-4 bg-indigo-50 rounded-2xl group-hover/drop:scale-110 transition-transform duration-500 shadow-sm">
                      <Mail className="w-8 h-8 text-indigo-600" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-base font-bold text-slate-800">Trascina qui il file .eml</p>
                      <p className="text-xs text-slate-500 font-medium">I dati verranno analizzati istantaneamente</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="glass-card rounded-3xl p-8 shadow-sm">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-slate-800">
                <div className="p-2 bg-indigo-50 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-indigo-600" />
                </div>
                Dettagli Messaggio
              </h2>
              
              <div className="space-y-4">
                {/* Text Input */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Contenuto del Messaggio</label>
                  <textarea 
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Incolla qui il testo dell'email o dell'SMS..."
                    className="w-full h-32 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none bg-slate-50"
                  />
                </div>

                {/* Sender Input */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Mittente (Nome o Email)</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text"
                      value={sender}
                      onChange={(e) => setSender(e.target.value)}
                      placeholder="es. Poste Italiane <info@poste-sicura.it>"
                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-slate-50"
                    />
                  </div>
                </div>

                {/* Links Input */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Analizza da URL (Web Email o Link Sospetto)</label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text"
                      value={urlToAnalyze}
                      onChange={(e) => setUrlToAnalyze(e.target.value)}
                      placeholder="Incolla l'URL di Gmail o un link da verificare..."
                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-slate-50"
                    />
                  </div>
                  {urlToAnalyze.includes('mail.google.com') && !isGoogleConnected && (
                    <p className="text-[10px] text-amber-600 mt-1 font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Connetti Google in alto per analizzare questo URL di Gmail
                    </p>
                  )}
                </div>

                {/* Links Input */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Link nel Messaggio (separati da virgola)</label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text"
                      value={links}
                      onChange={(e) => setLinks(e.target.value)}
                      placeholder="https://bit.ly/..., https://poste-it.com/..."
                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-slate-50"
                    />
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Screenshot del Messaggio (Opzionale)</label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${image ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-indigo-400 hover:bg-slate-50'}`}
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    {image ? (
                      <div className="relative inline-block">
                        <img src={image} alt="Preview" className="max-h-40 rounded-lg shadow-sm" />
                        <button 
                          onClick={(e) => { e.stopPropagation(); setImage(null); }}
                          className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md border border-slate-200 hover:text-red-500"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <div className="p-3 bg-white rounded-full shadow-sm">
                          <Upload className="w-6 h-6 text-indigo-600" />
                        </div>
                        <p className="text-sm text-slate-600">Trascina un'immagine o clicca per caricare</p>
                        <p className="text-xs text-slate-400">PNG, JPG fino a 5MB</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <button 
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full mt-8 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 disabled:from-slate-300 disabled:to-slate-300 text-white font-black py-5 rounded-2xl shadow-xl shadow-indigo-200 transition-all duration-300 flex items-center justify-center gap-3 group active:scale-[0.98]"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    ANALISI IN CORSO...
                  </>
                ) : (
                  <>
                    ANALIZZA ORA
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                  </>
                )}
              </button>

              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-600 text-sm">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <p>{error}</p>
                </div>
              )}
            </div>

            <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
              <h3 className="text-indigo-900 font-semibold flex items-center gap-2 mb-2">
                <Info className="w-5 h-5" />
                Come funziona?
              </h3>
              <p className="text-indigo-700 text-sm leading-relaxed">
                PhishGuard AI utilizza modelli di intelligenza artificiale avanzati per analizzare il contenuto visivo e testuale dei messaggi. Confronta i mittenti, verifica la struttura dei link e identifica pattern comuni utilizzati nelle truffe informatiche per darti un parere esperto in pochi secondi.
              </p>
            </div>
          </section>

          {/* Results Section */}
          <section>
            <AnimatePresence mode="wait">
              {isAnalyzing ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-2xl p-12 shadow-sm border border-slate-200 h-full flex flex-col items-center justify-center text-center space-y-6"
                >
                  <div className="relative">
                    <div className="w-24 h-24 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
                    <ShieldQuestion className="w-10 h-10 text-indigo-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-slate-900">Analisi Intelligente</h3>
                    <p className="text-slate-500 max-w-xs mx-auto">
                      Stiamo verificando link, mittente e contenuto per proteggere la tua identità digitale...
                    </p>
                  </div>
                </motion.div>
              ) : result ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6"
                >
                  {/* Score Card */}
                  <div className="glass-card rounded-3xl p-10 shadow-sm text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <ShieldAlert className="w-32 h-32" />
                    </div>
                    
                    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8 border-2 ${getThreatColor(result.threatLevel)}`}>
                      LIVELLO: {result.threatLevel}
                    </div>
                    
                    <div 
                      className="relative inline-block mb-8 cursor-help"
                      onMouseEnter={() => setShowTooltip(true)}
                      onMouseLeave={() => setShowTooltip(false)}
                      onMouseMove={handleMouseMove}
                    >
                      <svg className="w-40 h-40 transform -rotate-90 filter drop-shadow-lg overflow-visible">
                        <circle
                          cx="80"
                          cy="80"
                          r="72"
                          stroke="currentColor"
                          strokeWidth="10"
                          fill="transparent"
                          className="text-slate-100"
                        />
                        <motion.circle
                          cx="80"
                          cy="80"
                          r="72"
                          stroke="currentColor"
                          strokeWidth={showTooltip ? 14 : 10}
                          fill="transparent"
                          strokeDasharray={452.4}
                          initial={{ strokeDashoffset: 452.4 }}
                          animate={{ 
                            strokeDashoffset: 452.4 - (452.4 * result.reliabilityScore) / 100,
                            opacity: showTooltip ? 1 : 0.9
                          }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className={`${getScoreColor(result.reliabilityScore)} transition-[stroke-width] duration-300`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                        <span className={`text-4xl font-black tracking-tighter ${getScoreColor(result.reliabilityScore)}`}>
                          {result.reliabilityScore}%
                        </span>
                        <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mt-1">TRUST</p>
                      </div>

                      <AnimatePresence>
                        {showTooltip && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.5, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.5, y: 10 }}
                            style={{ 
                              position: 'fixed',
                              left: tooltipPos.x + 15,
                              top: tooltipPos.y - 40,
                              zIndex: 100
                            }}
                            className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-xl pointer-events-none flex items-center gap-2"
                          >
                            <div className={`w-2 h-2 rounded-full ${getScoreColor(result.reliabilityScore).replace('text-', 'bg-')}`} />
                            Punteggio Esatto: {result.reliabilityScore}/100
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <h3 className="text-2xl font-black text-slate-900 mb-4">Esito Analisi</h3>
                    <div className="text-slate-600 text-base leading-relaxed prose prose-slate max-w-none font-medium">
                      <Markdown>{result.summary}</Markdown>
                    </div>
                  </div>

                  {/* Red Flags */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                    <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-amber-500" />
                      Segnali di Allarme
                    </h4>
                    <ul className="space-y-3">
                      {result.redFlags.map((flag, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                          <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                          {flag}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Detailed Analysis */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
                      <h4 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-2">
                        <User className="w-4 h-4 text-indigo-500" />
                        Analisi Mittente
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed italic">
                        {result.senderAnalysis}
                      </p>
                    </div>
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
                      <h4 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-2">
                        <LinkIcon className="w-4 h-4 text-indigo-500" />
                        Analisi Link
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed italic">
                        {result.linkAnalysis}
                      </p>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="bg-indigo-600 rounded-2xl p-6 shadow-lg shadow-indigo-200 text-white">
                    <h4 className="font-bold mb-4 flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5" />
                      Cosa ti consigliamo
                    </h4>
                    <ul className="space-y-3">
                      {result.recommendations.map((rec, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm font-medium">
                          <CheckCircle2 className="w-4 h-4 text-indigo-200 shrink-0 mt-0.5" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ) : (
                <div className="bg-white rounded-2xl p-12 shadow-sm border border-slate-200 h-full flex flex-col items-center justify-center text-center space-y-6 border-dashed">
                  <div className="p-6 bg-slate-50 rounded-full">
                    <ShieldQuestion className="w-12 h-12 text-slate-300" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-slate-400">In attesa di analisi</h3>
                    <p className="text-slate-400 max-w-xs mx-auto text-sm">
                      Inserisci i dettagli del messaggio a sinistra per iniziare la verifica di sicurezza.
                    </p>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-4 py-12 text-center">
        <p className="text-slate-400 text-xs">
          PhishGuard AI utilizza l'intelligenza artificiale per fornire stime di sicurezza. 
          Non inserire mai i tuoi dati personali in link sospetti anche se l'affidabilità è alta.
        </p>
      </footer>
    </div>
  );
}
