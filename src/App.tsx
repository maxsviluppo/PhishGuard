/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { AppData, AppStatus, UrgencyLevel, Todo } from "./types";
import { LED } from "./components/LED";
import { Trigger } from "./components/Trigger";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { auth, db } from "./firebase";
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  setDoc,
  serverTimestamp,
  orderBy,
  getDocFromServer
} from "firebase/firestore";

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      let errorMessage = "Si è verificato un errore inaspettato.";
      try {
        const parsed = JSON.parse(this.state.error?.message || "");
        if (parsed.error && parsed.error.includes("insufficient permissions")) {
          errorMessage = "Permessi insufficienti per eseguire l'operazione.";
        }
      } catch (e) {
        // Not a JSON error
      }

      return (
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-6 bg-zinc-950 text-white">
          <AlertTriangle className="w-16 h-16 text-red-500" />
          <div className="space-y-2">
            <h2 className="text-2xl font-black tracking-tighter uppercase">ERRORE DI SISTEMA</h2>
            <p className="text-zinc-500 text-sm max-w-md mx-auto">{errorMessage}</p>
          </div>
          <Button onClick={() => window.location.reload()} className="btn-3d-primary h-12 px-8 font-black tracking-widest rounded-xl">
            RICARICA APPLICAZIONE
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut,
  User,
  setPersistence,
  browserLocalPersistence,
  signInAnonymously,
  signInWithRedirect,
  getRedirectResult
} from "firebase/auth";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Settings,
  Shield,
  Menu,
  Users,
  Ban,
  UserX,
  Plus, 
  Download, 
  Upload, 
  Trash2, 
  ExternalLink, 
  Github, 
  Globe, 
  LayoutDashboard,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Search,
  ChevronRight,
  ChevronLeft,
  X,
  Brain,
  Zap,
  Flame,
  Database,
  Triangle,
  Activity,
  Image,
  Link as LinkIcon,
  LogIn,
  LogOut,
  User as UserIcon,
  Smartphone
} from "lucide-react";

const STATUS_ORDER: Record<AppStatus, number> = {
  maintenance: 0,
  production: 1,
  testing: 2,
  development: 3,
  ideation: 4,
};

const URGENCY_ORDER: Record<UrgencyLevel, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

const STATUS_COLORS: Record<AppStatus, "green" | "blue" | "yellow" | "purple" | "red"> = {
  ideation: "blue",
  development: "yellow",
  testing: "purple",
  production: "green",
  maintenance: "red",
};

const STATUS_LABELS: Record<AppStatus, string> = {
  ideation: "IDEAZIONE",
  development: "SVILUPPO",
  testing: "TESTING",
  production: "PRODUZIONE",
  maintenance: "MANUTENZIONE",
};

const URGENCY_COLORS: Record<UrgencyLevel, string> = {
  low: "bg-blue-500/20 text-blue-400",
  medium: "bg-yellow-500/20 text-yellow-400",
  high: "bg-orange-500/20 text-orange-400",
  critical: "bg-red-500/20 text-red-400",
};

const URGENCY_LABELS: Record<UrgencyLevel, string> = {
  low: "BASSA",
  medium: "MEDIA",
  high: "ALTA",
  critical: "URGENTE",
};

export default function App() {
  const [apps, setApps] = useState<AppData[]>([]);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [importText, setImportText] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [appToDeleteId, setAppToDeleteId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isDevBypass, setIsDevBypass] = useState(false);
  const [showRedirectLogin, setShowRedirectLogin] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auth Listener
  useEffect(() => {
    console.log("Initializing Auth Listener...");
    
    // Ensure persistence is set to local
    setPersistence(auth, browserLocalPersistence).catch(err => console.error("Persistence Error:", err));

    // Handle redirect result
    getRedirectResult(auth).then((result) => {
      if (result?.user) {
        console.log("Redirect Login Success:", result.user.email);
        setUser(result.user);
      }
    }).catch((error) => {
      console.error("Redirect Result Error:", error);
    });

    // Fallback timeout: if auth doesn't respond in 10s, force ready state
    const timeoutId = setTimeout(() => {
      if (!isAuthReady) {
        console.warn("Auth initialization timed out, forcing ready state.");
        setIsAuthReady(true);
      }
    }, 10000);

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("Auth State Changed:", currentUser ? "User Logged In" : "No User");
      setUser(currentUser);
      setIsAuthReady(true);
      clearTimeout(timeoutId);
    }, (error) => {
      console.error("Auth Listener Error:", error);
      setIsAuthReady(true); 
      clearTimeout(timeoutId);
    });
    
    return () => {
      unsubscribe();
      clearTimeout(timeoutId);
    };
  }, []);

  // Firestore Listener
  useEffect(() => {
    if (!isAuthReady) return;

    const path = "apps";
    console.log("Setting up Firestore Listener for apps...");
    
    // Fetch all apps for the open home view
    const q = query(collection(db, path), orderBy("updatedAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const appsData = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      })) as AppData[];
      setApps(appsData);
    }, (error) => {
      console.error("Firestore Apps Error:", error);
      console.error("Current Path:", path);
      console.error("Current User:", user?.uid || "Not logged in");
    });

    return () => unsubscribe();
  }, [isAuthReady]);

  // Users Listener (Admin)
  useEffect(() => {
    if (!user || (user.email !== 'castromassimo@gmail.com' && !isDevBypass)) return;

    const path = "users";
    console.log("Setting up Admin Users Listener...");
    const q = query(collection(db, path), orderBy("lastLogin", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      console.error("Users Listener Error (Admin):", error);
      // Soft error: don't throw to avoid crashing the app for a secondary feature
    });

    return () => unsubscribe();
  }, [user, isDevBypass]);

  // Track user login
  useEffect(() => {
    if (user) {
      const path = `users/${user.uid}`;
      const userRef = doc(db, "users", user.uid);
      setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        lastLogin: serverTimestamp(),
        isBlocked: false
      }, { merge: true }).catch(error => {
        handleFirestoreError(error, OperationType.WRITE, path);
      });
    }
  }, [user]);

  // Test connection
  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error) {
          if (error.message.includes('the client is offline') || error.message.includes('unavailable')) {
            console.error("Firestore connection issue detected. Please verify your Firebase project and database status.");
          }
        }
      }
    }
    testConnection();
  }, []);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error("Login Error:", error);
      if (error.code === 'auth/popup-blocked') {
        setShowRedirectLogin(true);
        alert("Il popup è stato bloccato. Puoi abilitarlo nella barra degli indirizzi del browser o provare l'accesso con reindirizzamento qui sotto.");
      } else {
        alert("Errore durante l'accesso: " + error.message);
      }
    }
  };

  const loginWithRedirect = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithRedirect(auth, provider);
    } catch (error: any) {
      console.error("Redirect Login Error:", error);
      alert("Errore durante il reindirizzamento: " + error.message);
    }
  };

  // Manual Login for Admin (Emergency Bypass)
  const adminManualLogin = async () => {
    const secret = window.prompt("Inserisci il codice di accesso rapido:");
    // Simple bypass for the owner in preview mode
    if (secret === "admin2026") {
      try {
        // Use anonymous auth to get a valid session UID
        await signInAnonymously(auth);
        setIsDevBypass(true);
        alert("Accesso di emergenza attivato.");
      } catch (error) {
        console.error(error);
        alert("Errore durante l'accesso di emergenza.");
      }
    } else {
      alert("Codice errato.");
    }
  };

  const logout = () => signOut(auth);

  const selectedApp = apps.find(a => a.id === selectedAppId);

  const addApp = async () => {
    const newAppData: Omit<AppData, 'id'> & { userId: string } = {
      name: "Nuova Applicazione",
      status: "ideation",
      description: "",
      notes: "",
      urgency: "medium",
      clientStatus: "",
      devPlatform: {
        github: "",
        vercel: "",
        domain: "",
        hosting: "",
      },
      googleServices: {
        hasProperty: false,
        ads: false,
        admob: false,
        adsense: false,
        analytics: false,
      },
      platformUsage: {
        github: false,
        studioAi: false,
        antigravity: false,
        vercel: false,
        supabase: false,
        firebase: false,
        neon: false,
        domain: false,
        android: false,
        ios: false,
      },
      todos: [],
      gallery: [],
      siteUrl: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: user?.uid || "public",
    };

    try {
      const path = "apps";
      const docRef = await addDoc(collection(db, path), newAppData);
      setSelectedAppId(docRef.id);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, "apps");
    }
  };

  const updateApp = async (id: string, updates: Partial<AppData>) => {
    try {
      const path = `apps/${id}`;
      const appRef = doc(db, "apps", id);
      await updateDoc(appRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `apps/${id}`);
    }
  };

  const deleteApp = (id: string) => {
    setAppToDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (appToDeleteId) {
      try {
        const path = `apps/${appToDeleteId}`;
        await deleteDoc(doc(db, "apps", appToDeleteId));
        if (selectedAppId === appToDeleteId) setSelectedAppId(null);
        setIsDeleteDialogOpen(false);
        setAppToDeleteId(null);
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `apps/${appToDeleteId}`);
      }
    }
  };

  const handleImport = async () => {
    if (!user) return;
    const lines = importText.split("\n").filter(l => l.trim());
    
    for (const line of lines) {
      const name = line.trim();
      const newAppData = {
        name,
        status: "ideation",
        description: "",
        notes: "",
        urgency: "medium",
        clientStatus: "",
        devPlatform: { github: "", vercel: "", domain: "", hosting: "" },
        googleServices: { hasProperty: false, ads: false, admob: false, adsense: false, analytics: false },
        platformUsage: {
          github: false,
          studioAi: false,
          antigravity: false,
          vercel: false,
          supabase: false,
          firebase: false,
          neon: false,
          domain: false,
          android: false,
          ios: false,
        },
        todos: [],
        gallery: [],
        siteUrl: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: user.uid,
      };
      try {
        await addDoc(collection(db, "apps"), newAppData);
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, "apps");
      }
    }
    
    setIsImportOpen(false);
    setImportText("");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedApp) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        updateApp(selectedApp.id, { gallery: [...selectedApp.gallery, url] });
      };
      reader.readAsDataURL(file);
    }
  };

  const formatUrl = (url: string) => {
    if (!url) return "";
    const trimmed = url.trim();
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
    return `https://${trimmed}`;
  };

  const filteredApps = apps
    .filter(a => 
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      // First by urgency (critical first)
      if (a.urgency !== b.urgency) {
        return URGENCY_ORDER[a.urgency] - URGENCY_ORDER[b.urgency];
      }
      // Then by status (production/maintenance first)
      return STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
    });

  const deleteUser = async (userId: string) => {
    if (window.confirm("Eliminare definitivamente questo utente?")) {
      try {
        await deleteDoc(doc(db, "users", userId));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `users/${userId}`);
      }
    }
  };

  const toggleBlockUser = async (userId: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, "users", userId), { isBlocked: !currentStatus });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${userId}`);
    }
  };

  return (
    <ErrorBoundary>
      <div className="flex flex-col md:flex-row h-[100dvh] text-white overflow-hidden font-sans touch-pan-y app-bg">
      {/* Dynamic Background Lights */}
      <div className="dynamic-bg-light light-1" />
      <div className="dynamic-bg-light light-2" />

      {!isAuthReady ? (
        <div className="flex-1 flex flex-col items-center justify-center z-50">
          <div className="w-16 h-16 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mb-4" />
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-cyan-500 animate-pulse">INIZIALIZZAZIONE SISTEMA...</p>
          <button 
            onClick={adminManualLogin}
            className="mt-8 text-[8px] text-zinc-800 hover:text-zinc-600 uppercase tracking-widest font-bold transition-colors"
          >
            Accesso Emergenza
          </button>
        </div>
      ) : (
        <>
          {/* Sidebar - App List */}
          <div className={`w-full md:w-80 border-r border-white/5 hidden md:flex flex-col glass-panel z-20`}>
        <div className="p-6 border-b border-white/5 space-y-6">
          <div className="flex items-center justify-between">
            <h1 
              onClick={() => setSelectedAppId(null)}
              className="text-xl font-black tracking-tighter flex items-center gap-2 text-zinc-100 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <LayoutDashboard className="w-5 h-5 text-zinc-400" />
              <span className="neon-text-cyan animate-neon-pulse">
                APPManager
              </span>
            </h1>
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="hidden md:block text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-100">{user.displayName}</p>
                    <p className="text-[8px] font-bold text-zinc-500">{user.email}</p>
                  </div>
                  <Button onClick={logout} variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-white/5">
                    <LogOut className="w-4 h-4 led-cyan-glow" />
                  </Button>
                </div>
              ) : (
                <Button onClick={loginWithRedirect} variant="outline" size="icon" className="h-9 w-9 btn-3d-primary border-none">
                  <LogIn className="w-4 h-4" />
                </Button>
              )}
              <div className="flex gap-3">
                <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
                  <DialogTrigger render={<Button variant="outline" size="icon" className="h-9 w-9 btn-3d-primary border-none" />}>
                    <Upload className="w-4 h-4" />
                  </DialogTrigger>
                  <DialogContent className="bg-zinc-950 border-white/5 text-white shadow-2xl max-h-[90dvh] overflow-y-auto custom-scrollbar touch-pan-y overscroll-contain">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-black tracking-tight uppercase">IMPORTA APP</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Inserisci nomi (uno per riga)</p>
                      <Textarea 
                        value={importText}
                        onChange={(e) => setImportText(e.target.value)}
                        placeholder="Nome App 1&#10;Nome App 2&#10;..."
                        className="min-h-[200px] bg-zinc-800/60 border-white/10 focus:border-cyan-500/50 text-white rounded-xl resize-none"
                      />
                      <Button onClick={handleImport} className="w-full btn-3d-primary h-12 font-black tracking-widest sticky bottom-0">
                        IMPORTA DATI
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button onClick={addApp} variant="ghost" size="icon" className="h-9 w-9 btn-3d-black border-none">
                  <Plus className="w-4 h-4" />
                </Button>
                {(user?.email === 'castromassimo@gmail.com' || isDevBypass) && (
                  <Button onClick={() => setIsAdminOpen(true)} variant="ghost" size="icon" className="h-9 w-9 btn-3d-black border-none">
                    <Shield className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
            <Input 
              placeholder="CERCA PROGETTI..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-zinc-800/60 border-white/10 focus:border-cyan-500/50 h-10 text-xs uppercase tracking-widest rounded-xl"
            />
          </div>
        </div>

        <ScrollArea className="flex-1 touch-pan-y custom-scrollbar">
          <div className="p-3 space-y-2">
            {filteredApps.map(app => (
              <button
                key={app.id}
                onClick={() => setSelectedAppId(app.id)}
                className={`w-full p-4 text-left transition-all rounded-xl group relative border border-transparent ${selectedAppId === app.id ? 'bg-white/10 border-white/10 shadow-lg' : 'hover:bg-white/5'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black tracking-widest uppercase truncate pr-4 text-zinc-100">
                    {app.name}
                  </span>
                  <LED color={STATUS_COLORS[app.status]} />
                </div>
                <div className="flex items-center gap-2">
                  {app.urgency === 'critical' && (
                    <Badge variant="outline" className="text-[9px] px-2 py-0.5 border-none uppercase font-black rounded-full bg-red-500/20 text-red-400">
                      URGENTE
                    </Badge>
                  )}
                  <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">
                    {new Date(app.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {selectedApp ? <>
            <div className="p-6 md:p-8 border-b border-white/5 flex items-center justify-between glass-panel">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setSelectedAppId(null)}
                    className="md:hidden p-2 -ml-2 text-zinc-400 hover:text-white"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <Input 
                    value={selectedApp.name}
                    onChange={(e) => updateApp(selectedApp.id, { name: e.target.value })}
                    className="text-2xl md:text-3xl font-black tracking-tighter bg-transparent border-none p-0 h-auto focus-visible:ring-0 w-full uppercase text-zinc-100"
                  />
                  <div className="flex items-center gap-3">
                    <LED color={STATUS_COLORS[selectedApp.status]} className="w-4 h-4" />
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteApp(selectedApp.id);
                      }}
                      className="h-10 w-10 btn-3d-danger border-none"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <Tabs defaultValue="progress" className="flex-1 flex flex-col min-h-0 overflow-hidden">
              <div className="px-4 md:px-8 border-b border-white/5 bg-zinc-950/40 shrink-0">
                <TabsList className="bg-transparent h-24 p-0 gap-3 overflow-x-auto custom-scrollbar touch-pan-x overscroll-x-contain items-center flex flex-nowrap w-full no-scrollbar md:scrollbar-thin">
                  <TabsTrigger value="progress" className="shrink-0 data-[state=active]:btn-3d-primary data-[state=active]:text-white data-[state=active]:scale-105 rounded-xl h-12 px-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 transition-all border border-white/5 hover:bg-white/5">STATO AVANZAMENTO</TabsTrigger>
                  <TabsTrigger value="identity" className="shrink-0 data-[state=active]:btn-3d-primary data-[state=active]:text-white data-[state=active]:scale-105 rounded-xl h-12 px-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 transition-all border border-white/5 hover:bg-white/5">IDENTITÀ GIOCO</TabsTrigger>
                  <TabsTrigger value="platforms" className="shrink-0 data-[state=active]:btn-3d-primary data-[state=active]:text-white data-[state=active]:scale-105 rounded-xl h-12 px-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 transition-all border border-white/5 hover:bg-white/5">PIATTAFORME</TabsTrigger>
                  <TabsTrigger value="google" className="shrink-0 data-[state=active]:btn-3d-primary data-[state=active]:text-white data-[state=active]:scale-105 rounded-xl h-12 px-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 transition-all border border-white/5 hover:bg-white/5">GOOGLE</TabsTrigger>
                  <TabsTrigger value="gallery" className="shrink-0 data-[state=active]:btn-3d-primary data-[state=active]:text-white data-[state=active]:scale-105 rounded-xl h-12 px-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 transition-all border border-white/5 hover:bg-white/5">GALLERIA</TabsTrigger>
                  <TabsTrigger value="tasks" className="shrink-0 data-[state=active]:btn-3d-primary data-[state=active]:text-white data-[state=active]:scale-105 rounded-xl h-12 px-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 transition-all border border-white/5 hover:bg-white/5">TASK</TabsTrigger>
                </TabsList>
              </div>

              <div className="flex-1 relative min-h-0">
                <TabsContent value="progress" className="absolute inset-0 m-0 overflow-hidden data-[state=active]:flex flex-col bg-gradient-to-b from-slate-900/50 to-slate-950/50">
                  <ScrollArea className="h-full w-full custom-scrollbar">
                    <div className="p-6 md:p-8 pb-40 max-w-md mx-auto space-y-10">
                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">FASI DI SVILUPPO</label>
                        <div className="flex flex-col gap-3">
                          {(Object.keys(STATUS_COLORS) as AppStatus[]).map(status => (
                            <Button
                              key={status}
                              variant="outline"
                              onClick={() => updateApp(selectedApp.id, { status })}
                              className={`h-14 justify-start gap-4 border-white/5 uppercase text-[10px] tracking-widest font-black rounded-xl transition-all ${selectedApp.status === status ? 'bg-white/10 border-white/20 shadow-inner scale-[1.02]' : 'hover:bg-white/5'}`}
                            >
                              <LED color={STATUS_COLORS[status]} active={selectedApp.status === status} className="w-3 h-3" />
                              {STATUS_LABELS[status]}
                            </Button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">PRIORITÀ</label>
                        <Trigger 
                          label="URGENTE" 
                          checked={selectedApp.urgency === 'critical'}
                          onCheckedChange={(checked) => updateApp(selectedApp.id, { urgency: checked ? 'critical' : 'medium' })}
                          className="rounded-2xl h-20 px-8"
                        />
                      </div>
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="identity" className="absolute inset-0 m-0 overflow-hidden data-[state=active]:flex flex-col bg-gradient-to-b from-slate-900/50 to-slate-950/50">
                  <ScrollArea className="h-full w-full custom-scrollbar">
                    <div className="p-6 md:p-8 pb-40 max-w-4xl mx-auto space-y-10">
                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">DESCRIZIONE GIOCO</label>
                        <Textarea 
                          value={selectedApp.description}
                          onChange={(e) => updateApp(selectedApp.id, { description: e.target.value })}
                          placeholder="DESCRIVI L'IDENTITÀ DEL GIOCO..."
                          className="min-h-[200px] info-container text-sm p-6 leading-relaxed"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 flex items-center gap-2">
                            {selectedApp.clientStatus && <LED color="green" className="w-2 h-2" />}
                            COMMITTENTE
                          </label>
                          <Input 
                            value={selectedApp.clientStatus}
                            onChange={(e) => updateApp(selectedApp.id, { clientStatus: e.target.value })}
                            placeholder="NOME COMMITTENTE..."
                            className="info-container uppercase text-xs tracking-widest h-14 px-6"
                          />
                        </div>
                        <div className="space-y-4">
                          <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">NOTE</label>
                          <Input 
                            value={selectedApp.notes}
                            onChange={(e) => updateApp(selectedApp.id, { notes: e.target.value })}
                            placeholder="NOTE AGGIUNTIVE..."
                            className="info-container text-xs h-14 px-6"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 flex items-center gap-2">
                          {selectedApp.siteUrl && <LED color="green" className="w-2 h-2" />}
                          SITO WEB
                        </label>
                        <div className="flex gap-3">
                          <Input 
                            value={selectedApp.siteUrl}
                            onChange={(e) => updateApp(selectedApp.id, { siteUrl: e.target.value })}
                            placeholder="https://www.esempio.it"
                            className="info-container text-sm h-14 px-6 flex-1"
                          />
                          {selectedApp.siteUrl && (
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => window.open(formatUrl(selectedApp.siteUrl), '_blank')}
                              className="h-14 w-14 rounded-xl border-white/5 bg-slate-950/40 hover:bg-white/5 text-zinc-400 hover:text-white transition-all"
                            >
                              <ExternalLink className="w-6 h-6" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="platforms" className="absolute inset-0 m-0 overflow-hidden data-[state=active]:flex flex-col bg-gradient-to-b from-slate-900/50 to-slate-950/50">
                  <ScrollArea className="h-full w-full custom-scrollbar">
                    <div className="p-6 md:p-8 pb-40 max-w-4xl mx-auto space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          { label: "GITHUB", key: "github", icon: Github },
                          { label: "STUDIO AI GOOGLE", key: "studioAi", icon: Brain },
                          { label: "ANTIGRAVITY GOOGLE", key: "antigravity", icon: Activity },
                          { label: "VERCEL", key: "vercel", icon: Triangle },
                          { label: "SUPABASE", key: "supabase", icon: Database },
                          { label: "FIREBASE", key: "firebase", icon: Flame },
                          { label: "NEON", key: "neon", icon: Zap },
                          { label: "DOMINIO", key: "domain", icon: Globe },
                          { label: "ANDROID", key: "android", icon: Smartphone },
                          { label: "IOS", key: "ios", icon: Smartphone },
                        ].map((platform) => (
                          <div key={platform.key} className="flex items-center gap-4 p-2">
                            <platform.icon className="w-5 h-5 text-zinc-500 shrink-0" />
                            <Trigger 
                              label={platform.label} 
                              checked={(selectedApp.platformUsage as any)[platform.key]}
                              onCheckedChange={(checked) => updateApp(selectedApp.id, { platformUsage: { ...selectedApp.platformUsage, [platform.key]: checked } })}
                              className="rounded-2xl h-16 px-6 flex-1"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="google" className="absolute inset-0 m-0 overflow-hidden data-[state=active]:flex flex-col bg-gradient-to-b from-slate-900/50 to-slate-950/50">
                  <ScrollArea className="h-full w-full custom-scrollbar">
                    <div className="p-6 md:p-8 pb-40 max-w-4xl mx-auto space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Trigger 
                          label="GOOGLE PROPERTY" 
                          checked={selectedApp.googleServices.hasProperty}
                          onCheckedChange={(checked) => updateApp(selectedApp.id, { googleServices: { ...selectedApp.googleServices, hasProperty: checked } })}
                          className="rounded-2xl h-16 px-6"
                        />
                        {[
                          { label: "ADS", key: "ads" },
                          { label: "ADMOB", key: "admob" },
                          { label: "ADSENSE", key: "adsense" },
                          { label: "ANALYTICS", key: "analytics" },
                        ].map((service) => (
                          <Trigger 
                            key={service.key}
                            label={`GOOGLE ${service.label}`} 
                            checked={(selectedApp.googleServices as any)[service.key]}
                            onCheckedChange={(checked) => updateApp(selectedApp.id, { googleServices: { ...selectedApp.googleServices, [service.key]: checked } })}
                            className="rounded-2xl h-16 px-6"
                          />
                        ))}
                      </div>
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="gallery" className="absolute inset-0 m-0 overflow-hidden data-[state=active]:flex flex-col bg-gradient-to-b from-slate-900/50 to-slate-950/50">
                  <ScrollArea className="h-full w-full custom-scrollbar">
                    <div className="p-6 md:p-8 pb-40 max-w-4xl mx-auto space-y-8">
                      <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-4">
                          <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">IMPORTA DA SISTEMA</label>
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            ref={fileInputRef} 
                            onChange={handleFileUpload}
                          />
                          <Button 
                            variant="ghost"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full h-16 btn-3d-black border-none rounded-2xl flex items-center justify-center gap-3"
                          >
                            <Image className="w-5 h-5" />
                            SFOGLIA FILE
                          </Button>
                        </div>
                        <div className="space-y-4">
                          <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">CARICA DA URL</label>
                          <div className="flex gap-2">
                            <Input 
                              placeholder="INCOLLA URL..."
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  const url = e.currentTarget.value;
                                  if (url) {
                                    updateApp(selectedApp.id, { gallery: [...selectedApp.gallery, url] });
                                    e.currentTarget.value = "";
                                  }
                                }
                              }}
                              className="info-container uppercase text-[10px] tracking-widest h-16 px-6 font-bold flex-1"
                            />
                            <Button 
                              variant="outline"
                              size="icon"
                              className="h-16 w-16 rounded-2xl border-white/5 bg-slate-950/40"
                              onClick={() => {
                                const input = document.querySelector('input[placeholder="INCOLLA URL..."]') as HTMLInputElement;
                                if (input.value) {
                                  updateApp(selectedApp.id, { gallery: [...selectedApp.gallery, input.value] });
                                  input.value = "";
                                }
                              }}
                            >
                              <LinkIcon className="w-5 h-5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {selectedApp.gallery.length === 0 && (
                          <div className="col-span-full p-16 border-2 border-dashed border-white/5 rounded-3xl text-center">
                            <p className="text-[10px] text-zinc-600 uppercase tracking-[0.4em] font-black">NESSUNA IMMAGINE CARICATA</p>
                          </div>
                        )}
                        {selectedApp.gallery.map((url, index) => (
                          <div key={index} className="relative group aspect-video rounded-xl overflow-hidden border border-white/10 shadow-lg">
                            <img src={url} alt={`Gallery ${index}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Button 
                                variant="destructive" 
                                size="icon" 
                                onClick={() => updateApp(selectedApp.id, { gallery: selectedApp.gallery.filter((_, i) => i !== index) })}
                                className="h-8 w-8 btn-3d-danger border-none"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>

                <TabsContent value="tasks" className="absolute inset-0 m-0 overflow-hidden data-[state=active]:flex flex-col bg-gradient-to-b from-slate-900/50 to-slate-950/50">
                  <ScrollArea className="h-full w-full custom-scrollbar">
                    <div className="p-6 md:p-8 pb-40 max-w-4xl mx-auto space-y-8">
                      <div className="flex items-center gap-4">
                      <Input 
                        placeholder="AGGIUNGI NUOVO TASK + INVIO"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const task = e.currentTarget.value;
                            if (task) {
                              const newTodo: Todo = { id: crypto.randomUUID(), task, completed: false };
                              updateApp(selectedApp.id, { todos: [...selectedApp.todos, newTodo] });
                              e.currentTarget.value = "";
                            }
                          }
                        }}
                        className="info-container uppercase text-xs tracking-[0.2em] h-14 px-6 font-bold"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      {selectedApp.todos.length === 0 && (
                        <div className="p-16 border-2 border-dashed border-white/5 rounded-3xl text-center">
                          <p className="text-[10px] text-zinc-600 uppercase tracking-[0.4em] font-black">SISTEMA IDLE: NESSUN TASK</p>
                        </div>
                      )}
                      {selectedApp.todos.map(todo => (
                        <div key={todo.id} className="flex items-center justify-between p-5 info-container group transition-all hover:bg-slate-700/80">
                          <div className="flex items-center gap-5">
                            <button 
                              onClick={() => updateApp(selectedApp.id, { 
                                todos: selectedApp.todos.map(t => t.id === todo.id ? { ...t, completed: !t.completed } : t) 
                              })}
                              className="transition-transform active:scale-90"
                            >
                              {todo.completed ? <CheckCircle2 className="w-6 h-6 text-green-500" /> : <Circle className="w-6 h-6 text-zinc-700" />}
                            </button>
                            <span className={`text-xs uppercase tracking-widest font-bold ${todo.completed ? 'line-through text-zinc-600' : 'text-zinc-200'}`}>
                              {todo.task}
                            </span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => updateApp(selectedApp.id, { 
                              todos: selectedApp.todos.filter(t => t.id !== todo.id) 
                            })}
                            className="opacity-0 group-hover:opacity-100 h-10 w-10 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl"
                          >
                            <X className="w-5 h-5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollArea>
                </TabsContent>
              </div>
            </Tabs>
          </>
        : (
          <ScrollArea className="flex-1 touch-pan-y custom-scrollbar h-full">
            <div className="p-6 md:p-12 pb-32 max-w-7xl mx-auto space-y-12">
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <h2 className="text-4xl font-black tracking-tighter uppercase text-zinc-100 hidden md:block">I TUOI PROGETTI</h2>
                  <div className="md:hidden flex items-center justify-between w-full">
                    <h1 className="text-3xl font-black tracking-tighter flex items-center gap-2 text-zinc-100">
                      <LayoutDashboard className="w-8 h-8 text-zinc-400" />
                      <span className="neon-text-cyan animate-neon-pulse">
                        APPManager
                      </span>
                    </h1>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger render={
                          <Button variant="ghost" size="icon" className="h-10 w-10 btn-3d-black border-none rounded-xl">
                            <Menu className="w-5 h-5 led-cyan-glow" />
                          </Button>
                        } />
                        <DialogContent className="bg-zinc-950/90 backdrop-blur-xl border-white/5 text-white shadow-2xl p-8 max-w-[300px] rounded-3xl">
                          <div className="flex flex-col items-center gap-8">
                            <div className="grid grid-cols-2 gap-6">
                              <button 
                                onClick={() => { addApp(); }}
                                className="flex flex-col items-center gap-2 group"
                              >
                                <div className="w-16 h-16 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform led-cyan-glow-border">
                                  <Plus className="w-8 h-8 text-cyan-400" />
                                </div>
                                <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400">NUOVO</span>
                              </button>

                              <button 
                                onClick={() => { setIsImportOpen(true); }}
                                className="flex flex-col items-center gap-2 group"
                              >
                                <div className="w-16 h-16 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform led-cyan-glow-border">
                                  <Upload className="w-8 h-8 text-cyan-400" />
                                </div>
                                <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400">IMPORTA</span>
                              </button>

                              {(user?.email === 'castromassimo@gmail.com' || isDevBypass) && (
                                <button 
                                  onClick={() => { setIsAdminOpen(true); }}
                                  className="flex flex-col items-center gap-2 group col-span-2"
                                >
                                  <div className="w-16 h-16 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform led-cyan-glow-border">
                                    <Shield className="w-8 h-8 text-cyan-400" />
                                  </div>
                                  <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400">ADMIN PANEL</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      {user ? (
                        <Button onClick={logout} variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-white/5">
                          <LogOut className="w-5 h-5 led-cyan-glow" />
                        </Button>
                      ) : (
                        <Button onClick={loginWithRedirect} variant="outline" size="icon" className="h-10 w-10 btn-3d-primary border-none">
                          <LogIn className="w-5 h-5" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative md:hidden flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-zinc-500" />
                      <Input 
                        placeholder="CERCA..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 bg-zinc-800/40 border-white/5 h-10 text-[10px] uppercase tracking-widest rounded-xl w-full"
                      />
                    </div>
                    <Badge variant="outline" className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20 px-4 py-1 font-black tracking-widest shrink-0">
                      {apps.length} TOTALI
                    </Badge>
                  </div>
                </div>
                <p className="text-[10px] text-zinc-500 uppercase tracking-[0.4em] font-bold">GESTISCI E MONITORA IL TUO PORTFOLIO APPLICATIVO</p>
              </div>

              {apps.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-20 space-y-8 border-2 border-dashed border-white/5 rounded-3xl">
                  <div className="w-24 h-24 bg-zinc-950/50 rounded-2xl border border-white/5 flex items-center justify-center relative shadow-2xl">
                    <LayoutDashboard className="w-12 h-12 text-zinc-800" />
                    <div className="absolute -top-2 -right-2">
                      <LED color="red" className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h2 className="text-xl font-black tracking-tighter uppercase text-zinc-100">NESSUN PROGETTO TROVATO</h2>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-[0.4em] font-bold">INIZIA CREANDO IL TUO PRIMO PROGETTO</p>
                  </div>
                  <Button onClick={addApp} variant="ghost" className="btn-3d-black h-14 px-10 font-black tracking-[0.2em] rounded-2xl border-none">
                    CREA NUOVO PROGETTO
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredApps.map(app => (
                    <button
                      key={app.id}
                      onClick={() => setSelectedAppId(app.id)}
                      className="group relative flex flex-col p-6 info-container hover:bg-slate-700/60 transition-all hover:scale-[1.02] text-left border-white/5 hover:border-cyan-500/30"
                    >
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                          <LED color={STATUS_COLORS[app.status]} className="w-3 h-3" />
                          <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">
                            {STATUS_LABELS[app.status]}
                          </span>
                        </div>
                        {app.urgency === 'critical' && (
                          <div className="flex items-center gap-2">
                            <LED color="red" className="w-2 h-2 animate-pulse" />
                            <Badge variant="outline" className="text-[9px] px-2 py-0.5 border-none uppercase font-black rounded-full bg-red-500/20 text-red-400">
                              URGENTE
                            </Badge>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <h3 className="text-lg font-black tracking-tight uppercase text-zinc-100 truncate group-hover:text-cyan-400 transition-colors">
                          {app.name}
                        </h3>
                        {app.siteUrl && (
                          <div 
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(formatUrl(app.siteUrl), '_blank');
                            }}
                            className="p-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:border-cyan-400 transition-all shrink-0 led-cyan-glow-border group/link shadow-[0_0_15px_rgba(34,211,238,0.1)] hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]"
                            title="ACCEDI AL SITO"
                          >
                            <ExternalLink className="w-5 h-5 led-cyan-glow group-hover/link:scale-110 transition-transform" />
                          </div>
                        )}
                      </div>
                      
                      <p className="text-xs text-zinc-500 line-clamp-2 mb-4 h-8">
                        {app.description || "Nessuna descrizione disponibile."}
                      </p>

                      {app.notes && (
                        <div className="mb-6 p-3 bg-black/40 rounded-xl border border-white/10">
                          <p className="text-[12px] text-zinc-200 line-clamp-2 italic leading-relaxed">
                            "{app.notes}"
                          </p>
                        </div>
                      )}

                      <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                        <span className="text-[9px] text-zinc-600 uppercase tracking-widest font-bold">
                          ULTIMO AGGIORNAMENTO
                        </span>
                        <span className="text-[9px] text-zinc-400 uppercase tracking-widest font-black">
                          {new Date(app.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </button>
                  ))}
                  
                  <button
                    onClick={addApp}
                    className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/5 rounded-2xl hover:border-cyan-500/30 hover:bg-white/5 transition-all group min-h-[200px]"
                  >
                    <div className="w-12 h-12 rounded-full bg-zinc-950 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Plus className="w-6 h-6 text-zinc-500 group-hover:text-cyan-400" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 group-hover:text-cyan-400">NUOVO PROGETTO</span>
                  </button>
                </div>
              )}

              {apps.length > 0 && (
                <div className="space-y-6 pt-12">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-black tracking-tighter uppercase text-zinc-100">RIEPILOGO TABELLARE</h2>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-[0.4em] font-bold">PANORAMICA RAPIDA DELLO STATO DI TUTTI I PROGETTI</p>
                  </div>
                  
                  <div className="info-container overflow-hidden rounded-2xl border-white/5">
                    <Table>
                      <TableHeader className="bg-zinc-900/50">
                        <TableRow className="border-white/5 hover:bg-transparent">
                          <TableHead className="text-[10px] font-black uppercase tracking-widest text-zinc-400">PROGETTO</TableHead>
                          <TableHead className="text-[10px] font-black uppercase tracking-widest text-zinc-400">STATO</TableHead>
                          <TableHead className="text-[10px] font-black uppercase tracking-widest text-zinc-400">URGENZA</TableHead>
                          <TableHead className="text-[10px] font-black uppercase tracking-widest text-zinc-400 md:hidden">NOTE</TableHead>
                          <TableHead className="text-[10px] font-black uppercase tracking-widest text-zinc-400 text-right">ULTIMO AGGIORNAMENTO</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredApps.map((app) => (
                          <TableRow 
                            key={app.id} 
                            className="border-white/5 hover:bg-white/5 cursor-pointer transition-colors"
                            onClick={() => setSelectedAppId(app.id)}
                          >
                            <TableCell className="font-black text-xs uppercase tracking-tight text-zinc-100">{app.name}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <LED color={STATUS_COLORS[app.status]} className="w-2 h-2" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{STATUS_LABELS[app.status]}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {app.urgency === 'critical' ? (
                                <Badge variant="outline" className="text-[8px] px-2 py-0 border-none uppercase font-black rounded-full bg-red-500/20 text-red-400">
                                  URGENTE
                                </Badge>
                              ) : (
                                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">-</span>
                              )}
                            </TableCell>
                            <TableCell className="md:hidden">
                              <span className="text-[11px] font-bold text-zinc-300 uppercase truncate max-w-[80px] block">
                                {app.notes || "-"}
                              </span>
                            </TableCell>
                            <TableCell className="text-right text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                              {new Date(app.updatedAt).toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </div>
  <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-zinc-950 border-white/5 text-white shadow-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-black tracking-tight uppercase flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              CONFERMA ELIMINAZIONE
            </DialogTitle>
          </DialogHeader>
          <div className="py-6 space-y-4">
            <p className="text-sm text-zinc-400 leading-relaxed">
              Sei sicuro di voler eliminare definitivamente questo progetto? Questa azione non può essere annullata.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setIsDeleteDialogOpen(false)}
                className="h-12 border-white/5 hover:bg-white/5 uppercase text-[10px] font-black tracking-widest rounded-xl"
              >
                ANNULLA
              </Button>
              <Button 
                variant="destructive" 
                onClick={confirmDelete}
                className="h-12 btn-3d-danger border-none uppercase text-[10px] font-black tracking-widest rounded-xl"
              >
                ELIMINA ORA
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isAdminOpen} onOpenChange={setIsAdminOpen}>
        <DialogContent className="bg-zinc-950 border-white/5 text-white shadow-2xl max-w-4xl max-h-[90dvh] overflow-hidden flex flex-col p-0">
          <DialogHeader className="p-6 border-b border-white/5">
            <DialogTitle className="text-xl font-black tracking-tight uppercase flex items-center gap-3">
              <Shield className="w-6 h-6 text-cyan-500" />
              PANNELLO DI CONTROLLO ADMIN
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-6">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/5 hover:bg-transparent">
                      <TableHead className="text-[10px] font-black uppercase tracking-widest text-zinc-400">UTENTE</TableHead>
                      <TableHead className="text-[10px] font-black uppercase tracking-widest text-zinc-400">EMAIL</TableHead>
                      <TableHead className="text-[10px] font-black uppercase tracking-widest text-zinc-400">ULTIMO ACCESSO</TableHead>
                      <TableHead className="text-[10px] font-black uppercase tracking-widest text-zinc-400 text-right">AZIONI</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((u) => (
                      <TableRow key={u.id} className="border-white/5 hover:bg-white/5">
                        <TableCell className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center overflow-hidden">
                            {u.photoURL ? <img src={u.photoURL} alt="" className="w-full h-full object-cover" /> : <UserIcon className="w-4 h-4 text-zinc-500" />}
                          </div>
                          <span className="font-black text-xs uppercase tracking-tight text-zinc-100">{u.displayName || 'Utente'}</span>
                        </TableCell>
                        <TableCell className="text-[10px] font-bold text-zinc-400">{u.email}</TableCell>
                        <TableCell className="text-[10px] font-bold text-zinc-500">
                          {u.lastLogin?.toDate ? u.lastLogin.toDate().toLocaleString() : 'N/A'}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => toggleBlockUser(u.id, u.isBlocked)}
                              className={`h-8 w-8 rounded-lg ${u.isBlocked ? 'text-red-500 bg-red-500/10' : 'text-zinc-500 hover:text-yellow-500'}`}
                            >
                              <Ban className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => deleteUser(u.id)}
                              className="h-8 w-8 rounded-lg text-zinc-500 hover:text-red-500"
                            >
                              <UserX className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
        </>
      )}
      </div>
    </ErrorBoundary>
  );
}
