import React, { useState, useMemo, useEffect, useRef } from "react";
import { 
  Search, 
  ShoppingCart, 
  Menu, 
  X, 
  Star, 
  Plus, 
  Minus, 
  Maximize,
  Shield,
  ChevronRight, 
  ChevronLeft,
  ChevronDown,
  ArrowLeft,
  Home,
  Grid,
  User,
  Heart,
  Check,
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Compass,
  Box,
  Share2,
  Play,
  Youtube,
  Upload,
  Camera,
  Sparkles,
  RefreshCw,
  Trash,
  Trash2,
  Package,
  FileSpreadsheet,
  Edit2,
  ExternalLink,
  Layers,
  Globe,
  Download,
  ShoppingBag,
  Table,
  FileText,
  FileCode,
  Truck,
  ListFilter,
  LayoutGrid,
  BarChart2,
  Users,
  MousePointer2,
  Clock,
  Smartphone,
  Monitor,
  Tablet,
  BarChart,
  Target,
  DollarSign,
  TrendingUp,
  TrendingDown,
  PieChart,
  ClipboardCheck,
  Activity,
  Repeat,
  UserPlus
} from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent, useSpring } from "motion/react";
import { GoogleGenAI, Type } from "@google/genai";
import { PRODUCTS, CATEGORIES, SUBCATEGORIES } from "./data";
import { Product, CartItem } from "./types";
import { AdminSingleProduct } from "./AdminSingleProduct";
import { AdminMassiveImport } from "./AdminMassiveImport";
import { AdminOrders } from "./AdminOrders";
import { AdminCouriers } from "./AdminCouriers";
import { AdminReturns } from "./AdminReturns";
import { AdminUsers } from "./AdminUsers";

// --- Components ---

const CartSplash = ({ trigger, isMenuHidden, count }: { trigger: number; isMenuHidden: boolean; count: number; key?: string }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (trigger > 0 && isMenuHidden) {
      setIsVisible(true);
      const timer = setTimeout(() => setIsVisible(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [trigger, isMenuHidden]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="cart-splash-container"
          initial={{ opacity: 0, x: 200 }}
          animate={{ 
            opacity: 1, 
            x: 0,
            transition: { type: "spring", damping: 20, stiffness: 100 }
          }}
          exit={{ 
            opacity: 0, 
            x: 200,
            transition: { duration: 0.3 }
          }}
          className="fixed bottom-6 right-6 z-[100] flex items-center"
        >
          <div className="relative w-16 h-16 bg-brand-blue rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.3)] flex items-center justify-center border-2 border-brand-yellow">
            {/* Stars Animation */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={`splash-star-${i}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: [0, 1.2, 0],
                  opacity: [0, 1, 0],
                  x: Math.cos(i * 60 * Math.PI / 180) * 50,
                  y: Math.sin(i * 60 * Math.PI / 180) * 50,
                }}
                transition={{ 
                  duration: 1, 
                  delay: i * 0.05,
                  ease: "easeOut"
                }}
                className="absolute"
              >
                <Star className="w-4 h-4 text-brand-yellow fill-brand-yellow" />
              </motion.div>
            ))}
            
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, -10, 10, 0]
              }}
              transition={{ duration: 0.5, repeat: 1 }}
            >
              <ShoppingCart className="w-8 h-8 text-brand-yellow fill-brand-yellow" />
            </motion.div>

            {/* Yellow Bubble for Count (Bolla Gialla) */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="absolute -top-1 -right-1 w-7 h-7 bg-brand-yellow text-brand-dark text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-lg"
            >
              {count}
            </motion.div>

            {/* Splash Ring */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0.5 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="absolute inset-0 rounded-full border-2 border-brand-yellow"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

function ProductCard({ product, onClick, onAddToCart, index }: { product: Product; onClick: () => void; onAddToCart: (p: Product) => void; index: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.5, 
        delay: (index % 4) * 0.1,
        ease: [0.21, 1.02, 0.73, 1]
      }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      layoutId={`product-${product.id}`}
      className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-xl transition-shadow duration-300"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: (index % 4) * 0.1 + 0.2 }}
        onClick={onClick}
        className="aspect-square mb-3 cursor-pointer overflow-hidden rounded-lg bg-gray-50"
      >
        {product.image && (
          <img src={product.image} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition-transform" referrerPolicy="no-referrer" />
        )}
      </motion.div>
      <motion.h3 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: (index % 4) * 0.1 + 0.3 }}
        onClick={onClick}
        className="text-sm font-medium text-brand-dark line-clamp-2 mb-1 cursor-pointer hover:text-brand-yellow"
      >
        {product.name}
      </motion.h3>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: (index % 4) * 0.1 + 0.4 }}
        className="flex items-center gap-1 mb-2"
      >
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star key={`card-star-${i}`} className={`w-3 h-3 ${i < Math.floor(product.rating) ? "text-brand-yellow fill-brand-yellow" : "text-gray-200"}`} />
          ))}
        </div>
        <span className="text-[10px] text-blue-600 font-medium">{product.reviews}</span>
      </motion.div>
      <div className="mt-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: (index % 4) * 0.1 + 0.5 }}
          className="flex items-baseline gap-1 mb-3"
        >
          <span className="text-xs font-bold align-top">€</span>
          <span className="text-xl font-bold">{Math.floor(product.price)}</span>
          <span className="text-xs font-bold">{(product.price % 1).toFixed(2).substring(2)}</span>
        </motion.div>
        <motion.button 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: (index % 4) * 0.1 + 0.6 }}
          onClick={() => onAddToCart(product)}
          className="w-full bg-brand-yellow hover:bg-brand-orange text-brand-dark py-2 rounded-lg text-xs font-bold shadow-sm active:scale-95 transition-all"
        >
          Aggiungi al carrello
        </motion.button>
      </div>
    </motion.div>
  );
}

const ProductSheet = ({ product, onClose, onAddToCart, isDesktop }: { product: Product; onClose: () => void; onAddToCart: (p: Product) => void; isDesktop: boolean; key?: string }) => {
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(product.image);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.offsetWidth * 0.8;
      carouselRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  const relatedProducts = useMemo(() => {
    return PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 8);
  }, [product]);

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
      />
      <motion.div 
        initial={{ y: "100%", x: isDesktop ? "-50%" : 0, opacity: 0 }}
        animate={{ 
          y: isDesktop ? "-50%" : 0, 
          x: isDesktop ? "-50%" : 0,
          opacity: 1,
          top: isDesktop ? "50%" : "5.5rem",
          bottom: isDesktop ? "auto" : 0,
          left: isDesktop ? "50%" : 0
        }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 30, stiffness: 250 }}
        className="fixed inset-x-0 lg:inset-auto bg-white rounded-t-[32px] lg:rounded-[40px] z-50 shadow-2xl flex flex-col lg:h-[85vh] lg:w-[90vw] lg:max-w-6xl overflow-hidden"
      >
        <div 
          onClick={onClose}
          className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto my-3 flex-shrink-0 cursor-pointer hover:bg-gray-300 transition-colors lg:hidden" 
        />
        
        <div className="overflow-y-auto pb-32 px-6 lg:p-10 flex-1">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-start">
            
            {/* COLUMN 1: PHOTOS (5/12) */}
            <div className="lg:col-span-5 lg:sticky lg:top-0">
              {/* Main Image & Gallery */}
              <div 
                className="relative aspect-square rounded-3xl overflow-hidden mb-4 bg-gray-50 border border-gray-100 cursor-pointer group"
                onClick={() => setIsLightboxOpen(true)}
              >
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={activeImage}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    src={activeImage || undefined} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </AnimatePresence>
                
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <div className="bg-white/80 backdrop-blur-md p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                    <Maximize className="w-6 h-6 text-brand-dark" />
                  </div>
                </div>
                
                <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setIsFavorite(!isFavorite); }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg backdrop-blur-md transition-all ${isFavorite ? "bg-red-500 text-white" : "bg-white/80 text-gray-400"}`}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? "fill-white" : ""}`} />
                  </button>
                  <button onClick={(e) => e.stopPropagation()} className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md text-gray-400 flex items-center justify-center shadow-lg">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-3 mb-6 overflow-x-auto no-scrollbar pb-2">
                <button 
                  key="main-thumb"
                  onClick={() => setActiveImage(product.image)}
                  className={`w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${activeImage === product.image ? "border-brand-yellow" : "border-transparent"}`}
                >
                  {product.image && (
                    <img src={product.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  )}
                </button>
                {product.gallery.map((img, idx) => (
                  <button 
                    key={`gallery-${idx}`}
                    onClick={() => setActiveImage(img)}
                    className={`w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${activeImage === img ? "border-brand-yellow" : "border-transparent"}`}
                  >
                    {img && (
                      <img src={img} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    )}
                  </button>
                ))}
                {product.has3D && (
                  <button className="w-16 h-16 rounded-xl bg-brand-blue flex flex-col items-center justify-center text-white flex-shrink-0 group hover:bg-brand-yellow hover:text-brand-dark transition-colors">
                    <Box className="w-6 h-6 mb-1" />
                    <span className="text-[8px] font-bold uppercase">3D View</span>
                  </button>
                )}
              </div>
            </div>

            {/* COLUMN 2: DESCRIPTION & TECH SPECS (4/12) */}
            <div className="lg:col-span-4 space-y-10">
              {/* Info */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-brand-yellow uppercase tracking-widest mb-1">{product.category}</p>
                <h2 className="text-2xl lg:text-3xl font-black text-brand-dark leading-tight">{product.name}</h2>
              </div>

              {/* Description */}
              <div className="space-y-4">
                <h4 className="font-black text-sm uppercase tracking-widest text-brand-dark border-l-4 border-brand-yellow pl-3">Descrizione</h4>
                <div className="text-gray-600 text-sm leading-relaxed space-y-4">
                  <p>{product.description}</p>
                  <p>Progettato per durare nel tempo, questo prodotto unisce materiali di alta qualità a un design funzionale che si adatta a ogni ambiente.</p>
                </div>
              </div>

              {/* Technical Specs */}
              <div className="space-y-6">
                <h4 className="font-black text-sm uppercase tracking-widest text-brand-dark border-l-4 border-brand-yellow pl-3">Caratteristiche</h4>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                      <p className="text-[9px] text-gray-400 uppercase font-black mb-0.5">{key}</p>
                      <p className="text-xs font-bold text-brand-dark">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Video Tutorial */}
              {product.videoUrl && (
                <div className="space-y-4">
                  <h4 className="font-black text-sm uppercase tracking-widest text-brand-dark border-l-4 border-brand-yellow pl-3">Video Tutorial</h4>
                  <a 
                    href={product.videoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group relative block aspect-video w-full rounded-2xl overflow-hidden shadow-lg border border-gray-100"
                  >
                    <img 
                      src={`https://img.youtube.com/vi/${product.videoUrl.includes('v=') ? product.videoUrl.split('v=')[1].split('&')[0] : product.videoUrl.split('/').pop()}/maxresdefault.jpg`} 
                      alt="Thumbnail" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className="w-12 h-12 bg-brand-yellow rounded-full flex items-center justify-center shadow-xl transform group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 text-brand-dark fill-brand-dark ml-0.5" />
                      </div>
                    </div>
                  </a>
                </div>
              )}
            </div>

            {/* COLUMN 3: PRICE & REVIEWS (3/12) */}
            <div className="lg:col-span-3 lg:bg-gray-50/50 lg:p-8 lg:rounded-[32px] lg:border lg:border-gray-100 space-y-8">
              {/* Pricing Card */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-4xl font-black text-brand-blue">€{product.price.toFixed(2)}</span>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-400 line-through">€{(product.price * 1.2).toFixed(2)}</span>
                    <span className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase w-fit">-20% OGGI</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-green-600 font-bold bg-green-50 p-3 rounded-xl border border-green-100">
                  <Shield className="w-4 h-4" />
                  <span>Disponibilità immediata</span>
                </div>
              </div>

              {/* Reviews Summary */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-sm uppercase tracking-widest text-brand-dark">Recensioni</h4>
                  <div className="flex items-center bg-brand-yellow px-2 py-1 rounded-lg">
                    <Star className="w-3 h-3 text-brand-dark fill-brand-dark mr-1" />
                    <span className="text-xs font-black text-brand-dark">{product.rating}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  {[
                    { stars: 5, percentage: 75 },
                    { stars: 4, percentage: 15 },
                    { stars: 3, percentage: 5 },
                  ].map((row) => (
                    <div key={row.stars} className="flex items-center gap-2 text-[10px]">
                      <span className="w-10 font-bold text-gray-500">{row.stars} stelle</span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${row.percentage}%` }}
                          className="h-full bg-brand-yellow"
                        />
                      </div>
                      <span className="w-6 text-right text-gray-400 font-bold uppercase">{row.percentage}%</span>
                    </div>
                  ))}
                </div>

                {/* Individual Review Sample */}
                <div className="pt-6 border-t border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-3 h-3 text-gray-400" />
                    </div>
                    <span className="text-[10px] font-bold text-brand-dark">Marco R. <span className="text-gray-400 font-normal ml-1">Acquisto Verificato</span></span>
                  </div>
                  <p className="text-[11px] text-gray-600 italic leading-relaxed">"Qualità eccezionale, arrivato in 24 ore. BesPoint una garanzia!"</p>
                </div>

                <button className="w-full text-center text-xs font-bold text-blue-600 hover:underline pt-2">Vedi tutte le {product.reviews} recensioni</button>
              </div>
            </div>
          </div>

          {/* Related Products Carousel (Full Width) */}
          <div className="mt-20 pt-10 border-t border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-black text-sm uppercase tracking-widest text-brand-dark border-l-4 border-brand-yellow pl-3">Potrebbe interessarti anche</h4>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => scroll('left')}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-brand-dark hover:bg-brand-yellow transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => scroll('right')}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-brand-dark hover:bg-brand-yellow transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div 
              ref={carouselRef}
              className="flex overflow-x-auto no-scrollbar gap-4 pb-4 snap-x snap-mandatory scroll-smooth"
            >
              {relatedProducts.map((p, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  viewport={{ once: true }}
                  key={p.id} 
                  className="flex-shrink-0 w-44 lg:w-56 snap-start bg-white border border-gray-100 rounded-2xl p-4 shadow-sm group cursor-pointer"
                >
                  <div className="aspect-square rounded-xl overflow-hidden mb-3 bg-gray-50">
                    {p.image && (
                      <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform" referrerPolicy="no-referrer" />
                    )}
                  </div>
                  <h5 className="text-xs font-bold text-brand-dark line-clamp-2 h-10">{p.name}</h5>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-sm font-black text-brand-blue">€{p.price.toFixed(2)}</p>
                    <div className="flex items-center gap-0.5">
                      <Star className="w-3 h-3 text-brand-yellow fill-brand-yellow" />
                      <span className="text-[10px] font-bold">{p.rating}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Bar (Optimized for both) */}
        <div className="bg-white/90 backdrop-blur-xl border-t border-gray-100 p-6 lg:px-12 flex items-center justify-between gap-6 z-20">
          <div className="flex items-center bg-gray-100 rounded-2xl p-1 gap-1">
            <button 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-xl bg-white shadow-sm hover:bg-gray-50 active:scale-90 transition-all"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-10 lg:w-14 text-center font-black text-lg">{quantity}</span>
            <button 
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-xl bg-white shadow-sm hover:bg-gray-50 active:scale-90 transition-all"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex-1 flex items-center gap-4">
            <div className="hidden lg:flex flex-col items-end flex-1 pr-6 border-r border-gray-100">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Totale</span>
              <span className="text-2xl font-black text-brand-blue">€{(product.price * quantity).toFixed(2)}</span>
            </div>
            
            <button 
              onClick={() => {
                for(let i=0; i<quantity; i++) onAddToCart(product);
                onClose();
              }}
              className="flex-[2] bg-brand-yellow hover:bg-brand-orange text-brand-dark h-14 lg:h-16 rounded-2xl font-black flex items-center justify-center gap-3 active:scale-95 transition-all uppercase text-sm tracking-widest shadow-xl shadow-brand-yellow/20"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Aggiungi al carrello</span>
            </button>
            
            <button 
              onClick={onClose}
              className="hidden lg:flex w-14 h-14 lg:w-16 lg:h-16 bg-gray-100 hover:bg-gray-200 text-brand-dark rounded-2xl items-center justify-center transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Fullscreen Lightbox */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center p-4"
          >
            <div className="absolute top-6 right-6 flex gap-4">
              <button 
                onClick={() => setIsLightboxOpen(false)}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-4xl aspect-square sm:aspect-video rounded-2xl overflow-hidden shadow-2xl"
            >
              {activeImage && (
                <img 
                  src={activeImage} 
                  alt={product.name} 
                  className="w-full h-full object-contain bg-black"
                  referrerPolicy="no-referrer"
                />
              )}
            </motion.div>
            
            <div className="mt-8 flex gap-3 overflow-x-auto no-scrollbar max-w-full px-4">
              {[product.image, ...product.gallery].map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${activeImage === img ? "border-brand-yellow" : "border-white/20"}`}
                >
                  {img && (
                    <img src={img} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const CartDrawer = ({ items, onClose, onUpdateQuantity, onRemove }: { 
  items: CartItem[]; 
  onClose: () => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  key?: string;
}) => {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
      />
      <motion.div 
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
      >
        <div className="p-6 flex items-center justify-between border-b border-gray-100">
          <h2 className="text-xl font-bold">Il tuo Carrello</h2>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <ShoppingCart className="w-10 h-10 text-gray-300" />
              </div>
              <p className="text-gray-500 font-medium">Il carrello è vuoto</p>
              <button onClick={onClose} className="mt-4 text-accent font-bold">Inizia lo shopping</button>
            </div>
          ) : (
            items.map((item, idx) => (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={item.id} 
                className="flex gap-4"
              >
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                  {item.image && (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  )}
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-sm line-clamp-1">{item.name}</h4>
                    <p className="text-accent font-bold text-sm">€{item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
                      <button onClick={() => onUpdateQuantity(item.id, -1)} className="p-1 hover:bg-white rounded-md transition-colors"><Minus className="w-3 h-3" /></button>
                      <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                      <button onClick={() => onUpdateQuantity(item.id, 1)} className="p-1 hover:bg-white rounded-md transition-colors"><Plus className="w-3 h-3" /></button>
                    </div>
                    <button onClick={() => onRemove(item.id)} className="text-xs text-red-500 font-medium">Rimuovi</button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="p-6 bg-gray-50 border-t border-gray-100 space-y-4"
          >
            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-medium">Totale</span>
              <span className="text-2xl font-bold">€{total.toFixed(2)}</span>
            </div>
            <button className="w-full bg-brand-yellow hover:bg-brand-orange text-brand-dark h-14 rounded-2xl font-bold text-lg active:scale-95 transition-transform">
              Procedi al Pagamento
            </button>
          </motion.div>
        )}
      </motion.div>
    </>
  );
};

const SideMenu = ({ isOpen, onClose, onSelectCategory, companySettings, pageSettings, onOpenProfile, onOpenOrders, onLogout }: { isOpen: boolean; onClose: () => void; onSelectCategory: (c: string) => void; companySettings: any; pageSettings: any; onOpenProfile?: () => void; onOpenOrders?: () => void; onLogout?: () => void; key?: string }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-80 bg-brand-blue text-white z-[70] shadow-2xl flex flex-col p-6"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <div className={companySettings.imageLogo ? "h-10 flex items-center" : "w-8 h-8 bg-brand-yellow rounded-lg flex items-center justify-center overflow-hidden"}>
                  {companySettings.imageLogo ? (
                    <img src={companySettings.imageLogo} alt="Logo" className="h-full object-contain" referrerPolicy="no-referrer" />
                  ) : companySettings.logo.startsWith('http') ? (
                    <img src={companySettings.logo} alt="Logo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <span className="text-brand-dark font-black text-lg">{companySettings.logo}</span>
                  )}
                </div>
                {!companySettings.imageLogo && (
                  <h2 className="text-xl font-bold tracking-tighter">{companySettings.name}</h2>
                )}
              </div>
              <button onClick={onClose} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6 overflow-y-auto no-scrollbar flex-1">
              <div className="space-y-4">
                <h3 className="text-xs font-black text-brand-yellow uppercase tracking-widest">Account</h3>
                <button 
                  onClick={() => { if (onOpenProfile) onOpenProfile(); onClose(); }}
                  className="flex items-center gap-3 w-full p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                >
                  <User className="w-5 h-5 text-brand-yellow" />
                  <span className="font-bold">Il mio profilo</span>
                </button>
                <button 
                  onClick={() => { if (onOpenOrders) onOpenOrders(); onClose(); }}
                  className="flex items-center gap-3 w-full p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                >
                  <ShoppingCart className="w-5 h-5 text-brand-yellow" />
                  <span className="font-bold">I miei ordini</span>
                </button>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-black text-brand-yellow uppercase tracking-widest">Categorie</h3>
                {pageSettings.categories.map(cat => (
                  <button 
                    key={cat} 
                    onClick={() => {
                      onSelectCategory(cat);
                      onClose();
                    }}
                    className="flex items-center justify-between w-full p-3 hover:bg-white/5 rounded-xl transition-colors"
                  >
                    <span className="font-bold">{cat}</span>
                    <ChevronRight className="w-4 h-4 text-white/40" />
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-black text-brand-yellow uppercase tracking-widest">Supporto</h3>
                <button className="flex items-center gap-3 w-full p-3 hover:bg-white/5 rounded-xl transition-colors">
                  <Phone className="w-5 h-5 text-white/40" />
                  <span className="font-bold">Contattaci</span>
                </button>
                <button className="flex items-center gap-3 w-full p-3 hover:bg-white/5 rounded-xl transition-colors">
                  <Mail className="w-5 h-5 text-white/40" />
                  <span className="font-bold">Email</span>
                </button>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10">
              <button 
                onClick={() => { if (onLogout) onLogout(); onClose(); }}
                className="w-full bg-brand-yellow text-brand-dark py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl active:scale-95 transition-all"
              >
                Esci dal Profilo
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// --- Main App ---

const HERO_IMAGES = [
  "https://picsum.photos/seed/electronics-1/1200/600",
  "https://picsum.photos/seed/electronics-2/1200/600",
  "https://picsum.photos/seed/electronics-3/1200/600",
  "https://picsum.photos/seed/electronics-4/1200/600",
  "https://picsum.photos/seed/electronics-5/1200/600",
];

const PROMO_ITEMS = [
  { id: 1, title: "Nuovi Arrivi", subtitle: "Scopri la collezione", color: "bg-brand-blue", seed: "gadgets" },
  { id: 2, title: "Best Seller", subtitle: "I più amati", color: "bg-brand-yellow", seed: "tech-best" },
  { id: 3, title: "Sconti Flash", subtitle: "Solo per oggi", color: "bg-red-500", seed: "flash" },
  { id: 4, title: "Illuminazione", subtitle: "Luce perfetta", color: "bg-green-600", seed: "light" },
  { id: 5, title: "Audio Pro", subtitle: "Suono puro", color: "bg-purple-600", seed: "audio" },
  { id: 6, title: "Smart Home", subtitle: "Casa connessa", color: "bg-orange-500", seed: "smart" },
  { id: 7, title: "Gaming", subtitle: "Livello pro", color: "bg-indigo-600", seed: "gaming" },
  { id: 8, title: "Accessori", subtitle: "Tutto il resto", color: "bg-gray-800", seed: "acc" },
];

const SlideSection = ({ slides }: { slides: any[] }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) return null;

  const currentSlide = slides[index];

  return (
    <section className="px-4 mb-12">
      <div className="relative aspect-[21/9] rounded-[32px] overflow-hidden shadow-xl group">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full h-full"
          >
            {currentSlide.link ? (
              <a href={currentSlide.link} className="block w-full h-full">
                {currentSlide.url && (
                  <img 
                    src={currentSlide.url} 
                    alt={currentSlide.alt} 
                    title={currentSlide.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                )}
              </a>
            ) : (
              currentSlide.url && (
                <img 
                  src={currentSlide.url} 
                  alt={currentSlide.alt} 
                  title={currentSlide.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              )
            )}
            
            {(currentSlide.title || currentSlide.alt) && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-8">
                <motion.h3 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-2xl font-black text-white uppercase tracking-tighter mb-1"
                >
                  {currentSlide.title}
                </motion.h3>
                <motion.p 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-white/80 text-sm font-bold"
                >
                  {currentSlide.alt}
                </motion.p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {slides.length > 1 && (
          <div className="absolute bottom-4 right-8 flex gap-2 z-20">
            {slides.map((_, i) => (
              <button 
                key={i}
                onClick={() => setIndex(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === index ? "bg-brand-yellow w-6" : "bg-white/40"}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState("Tutti");
  const [selectedSubcategory, setSelectedSubcategory] = useState("Tutti");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(true);
  
  // Auth State
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authStep, setAuthStep] = useState<'email' | 'login' | 'register' | 'profile' | 'edit_profile' | 'orders' | 'support'>('email');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authError, setAuthError] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bespoint_current_user');
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  });
  
  const [profileEditForm, setProfileEditForm] = useState({
    nameFirst: '',
    nameLast: '',
    phone: '',
    addressStreet: '',
    addressCity: '',
    addressZip: '',
    addressProvince: '',
    taxCode: ''
  });
  
  useEffect(() => {
    if (currentUser) {
      setProfileEditForm({
        nameFirst: currentUser.name?.split(' ')[0] || '',
        nameLast: currentUser.name?.split(' ').slice(1).join(' ') || '',
        phone: currentUser.phone || '',
        addressStreet: currentUser.addressStreet || '',
        addressCity: currentUser.addressCity || '',
        addressZip: currentUser.addressZip || '',
        addressProvince: currentUser.addressProvince || '',
        taxCode: currentUser.taxCode || ''
      });
    }
  }, [currentUser, authStep]);
  const [isMobileAdminMenuOpen, setIsMobileAdminMenuOpen] = useState(false);
  const [returnRequests, setReturnRequests] = useState<any[]>(() => {
    const saved = localStorage.getItem('bespoint_returns');
    return saved ? JSON.parse(saved) : [];
  });
  const [showAllSeoCategories, setShowAllSeoCategories] = useState(false);
  const [activeUserView, setActiveUserView] = useState<'profile' | 'returns' | 'return_form'>('profile');
  const [selectedReturnOrder, setSelectedReturnOrder] = useState<any>(null);

  useEffect(() => {
    localStorage.setItem('bespoint_returns', JSON.stringify(returnRequests));
  }, [returnRequests]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [adminActiveTab, setAdminActiveTab] = useState<'dashboard' | 'company' | 'slides' | 'categories' | 'seo' | 'marketing' | 'analytics' | 'products' | 'marketplaces' | 'orders' | 'couriers'>('dashboard');
  const [adminProductView, setAdminProductView] = useState<'list' | 'single' | 'mass'>('list');
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [adminTopIdx, setAdminTopIdx] = useState(0);
  const [adminMidIdx, setAdminMidIdx] = useState(0);
  const [adminBotIdx, setAdminBotIdx] = useState(0);
  const [slideToDelete, setSlideToDelete] = useState<{ id: string; type: string; position: string } | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [addingSubcategoryTo, setAddingSubcategoryTo] = useState<string | null>(null);
  const [newSubcategoryName, setNewSubcategoryName] = useState("");
  const [isDesktop, setIsDesktop] = useState(typeof window !== 'undefined' ? window.innerWidth >= 1024 : true);
  
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [isAiSuggesting, setIsAiSuggesting] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<{ categories: string[], subcategories: Record<string, string[]> } | null>(null);
  
  const [companySettings, setCompanySettings] = useState(() => {
    const saved = localStorage.getItem('companySettings');
    return saved ? JSON.parse(saved) : {
      logo: "B",
      imageLogo: "",
      favicon: "",
      name: "BesPoint",
      legalName: "Bespoint S.r.l.",
      vatNumber: "01234567890",
      sdiCode: "A1B2C3D",
      legalAddress: "Via della Tecnologia 123, Roma",
      phone: "+39 06 1234567",
      email: "info@bespoint.it",
      bioLink: "linktr.ee/bespoint",
      mission: "La tecnologia che si adatta al tuo stile di vita. Scopri l'innovazione senza compromessi.",
      socials: {
        facebook: "https://facebook.com/bespoint",
        instagram: "https://instagram.com/bespoint",
        twitter: "https://twitter.com/bespoint"
      },
      googleVerificationTag: "",
      googleAnalyticsSnippet: "",
      adsTxtContent: "google.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0"
    };
  });

  // Dynamic Favicon Update
  useEffect(() => {
    if (companySettings.favicon) {
      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = companySettings.favicon;
    }
  }, [companySettings.favicon]);

  // Force BesPoint branding if it's still the old one
  useEffect(() => {
    if (companySettings.name === "BESPOINT") {
      setCompanySettings(prev => ({ ...prev, name: "BesPoint" }));
    }
  }, [companySettings.name]);

  const [pageSettings, setPageSettings] = useState(() => {
    const saved = localStorage.getItem('pageSettings');
    const defaultBanners: Record<string, any> = {};
    const defaultHomeSlides: any[] = [];

    // Use CATEGORIES and SUBCATEGORIES from data.ts as initial defaults if not saved
    const initialCategories = CATEGORIES;
    const initialSubcategories = SUBCATEGORIES;

    initialCategories.filter(c => c !== "Tutti").forEach((cat, index) => {
      defaultBanners[cat] = { 
        url: `https://picsum.photos/seed/${cat.toLowerCase()}/1920/600`, 
        alt: cat, 
        title: cat,
        link: "" 
      };

      // Top Slide - Only for the first category
      if (index === 0) {
        defaultHomeSlides.push({
          id: `top-${cat}`,
          url: `https://picsum.photos/seed/${cat.toLowerCase()}-top/1920/1080`,
          alt: `Scopri la nostra selezione di ${cat}`,
          title: cat,
          link: "",
          position: "home_top"
        });
      }

      // Middle Slide - Only for the first category (as per request to delete 2-6)
      if (index === 0) {
        defaultHomeSlides.push({
          id: `mid-${cat}`,
          url: `https://picsum.photos/seed/${cat.toLowerCase()}-mid/1920/600`,
          alt: `Le migliori offerte per ${cat}`,
          title: `Specialisti in ${cat}`,
          link: "",
          position: "home_middle"
        });
      }

      // Bottom Slide - Only for the first category (as per request to delete 2-5)
      if (index === 0) {
        defaultHomeSlides.push({
          id: `bot-${cat}`,
          url: `https://picsum.photos/seed/${cat.toLowerCase()}-bot/1920/600`,
          alt: `Qualità garantita per ${cat}`,
          title: `Il meglio di ${cat}`,
          link: "",
          position: "home_bottom"
        });
      }
    });

    if (saved) {
      const parsed = JSON.parse(saved);
      
      // Ensure categories and subcategories exist in saved settings
      if (!parsed.categories) parsed.categories = initialCategories;
      if (!parsed.subcategories) parsed.subcategories = initialSubcategories;

      // Ensure all current categories exist in saved settings banners
      parsed.categories.filter((c: string) => c !== "Tutti").forEach((cat: string) => {
        if (!parsed.categoryBanners[cat]) {
          parsed.categoryBanners[cat] = { 
            url: `https://picsum.photos/seed/${cat.toLowerCase()}/1920/600`, 
            alt: cat, 
            title: cat,
            link: "" 
          };
        }
      });

      // Prune ALL slide positions to keep only the first one (as per multiple requests to delete 2-6, 2-5)
      
      // Prune top slides
      const topSlides = parsed.homeSlides.filter((s: any) => s.position === 'home_top' || !s.position);
      if (topSlides.length > 1) {
        const otherSlides = parsed.homeSlides.filter((s: any) => s.position !== 'home_top' && s.position);
        parsed.homeSlides = [topSlides[0], ...otherSlides];
      }

      // Prune middle slides
      const midSlides = parsed.homeSlides.filter((s: any) => s.position === 'home_middle');
      if (midSlides.length > 1) {
        const otherSlides = parsed.homeSlides.filter((s: any) => s.position !== 'home_middle');
        parsed.homeSlides = [midSlides[0], ...parsed.homeSlides.filter((s: any) => s.position !== 'home_middle')];
      }

      // Prune bottom slides
      const botSlides = parsed.homeSlides.filter((s: any) => s.position === 'home_bottom');
      if (botSlides.length > 1) {
        const otherSlides = parsed.homeSlides.filter((s: any) => s.position !== 'home_bottom');
        parsed.homeSlides = [botSlides[0], ...parsed.homeSlides.filter((s: any) => s.position !== 'home_bottom')];
      }

      if (!parsed.linkRapidi) {
        parsed.linkRapidi = [
          { id: '1', title: "Nuovi Arrivi", subtitle: "Scopri la collezione", color: "bg-brand-blue", seed: "gadgets", category: "Tutti", subcategory: "Tutti" },
          { id: '2', title: "Best Seller", subtitle: "I più amati", color: "bg-brand-yellow", seed: "tech-best", category: "Tutti", subcategory: "Tutti" },
          { id: '3', title: "Sconti Flash", subtitle: "Solo per oggi", color: "bg-red-500", seed: "flash", category: "Tutti", subcategory: "Tutti" },
          { id: '4', title: "Illuminazione", subtitle: "Luce perfetta", color: "bg-green-600", seed: "light", category: "Illuminazione", subcategory: "Tutti" },
          { id: '5', title: "Audio Pro", subtitle: "Suono puro", color: "bg-purple-600", seed: "audio", category: "Elettronica", subcategory: "Audio" },
          { id: '6', title: "Smart Home", subtitle: "Casa connessa", color: "bg-orange-500", seed: "smart", category: "Sicurezza", subcategory: "Tutti" },
        ];
      }

      return parsed;
    }

    return {
      homeSlides: defaultHomeSlides,
      categoryBanners: defaultBanners,
      categories: initialCategories,
      subcategories: initialSubcategories,
      linkRapidi: [
        { id: '1', title: "Nuovi Arrivi", subtitle: "Scopri la collezione", color: "bg-brand-blue", seed: "gadgets", category: "Tutti", subcategory: "Tutti" },
        { id: '2', title: "Best Seller", subtitle: "I più amati", color: "bg-brand-yellow", seed: "tech-best", category: "Tutti", subcategory: "Tutti" },
        { id: '3', title: "Sconti Flash", subtitle: "Solo per oggi", color: "bg-red-500", seed: "flash", category: "Tutti", subcategory: "Tutti" },
        { id: '4', title: "Illuminazione", subtitle: "Luce perfetta", color: "bg-green-600", seed: "light", category: "Illuminazione", subcategory: "Tutti" },
        { id: '5', title: "Audio Pro", subtitle: "Suono puro", color: "bg-purple-600", seed: "audio", category: "Elettronica", subcategory: "Audio" },
        { id: '6', title: "Smart Home", subtitle: "Casa connessa", color: "bg-orange-500", seed: "smart", category: "Sicurezza", subcategory: "Tutti" },
      ]
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem('companySettings', JSON.stringify(companySettings));
    } catch (e) {
      console.error("Storage Error (Company):", e);
    }
  }, [companySettings]);

  useEffect(() => {
    try {
      localStorage.setItem('pageSettings', JSON.stringify(pageSettings));
    } catch (e) {
      console.error("Storage Error (Page):", e);
      if (e instanceof DOMException && (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
        alert("Errore di memoria: La foto caricata è troppo grande o lo spazio del browser è esaurito. Riduci la dimensione delle immagini.");
      }
    }
  }, [pageSettings]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Max dimensions for compression
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 800;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Compress to JPEG with 0.7 quality
          const compressedUrl = canvas.toDataURL('image/jpeg', 0.7);
          callback(compressedUrl);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };
  const handleAiSuggest = async () => {
    setIsAiSuggesting(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analizza questi prodotti e suggerisci una struttura gerarchica di categorie e sottocategorie. 
        Restituisci un oggetto JSON con un array 'categories' (stringhe) e un oggetto 'subcategories' (che mappa i nomi delle categorie ad array di stringhe).
        Includi solo categorie e sottocategorie rilevanti per i prodotti forniti.
        Prodotti: ${JSON.stringify(PRODUCTS.map(p => ({ name: p.name, category: p.category, subcategory: p.subcategory })))}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              categories: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              subcategories: {
                type: Type.OBJECT,
                properties: {
                  // Dynamic keys are tricky in responseSchema, but we can describe it generally
                }
              }
            },
            required: ["categories", "subcategories"]
          }
        }
      });
      
      const jsonStr = response.text.trim();
      const suggestions = JSON.parse(jsonStr);
      
      // Ensure "Tutti" is in categories
      if (!suggestions.categories.includes("Tutti")) {
        suggestions.categories.unshift("Tutti");
      }
      
      setAiSuggestions(suggestions);
    } catch (error) {
      console.error("AI Suggestion error:", error);
      alert("Errore durante il suggerimento AI. Riprova.");
    } finally {
      setIsAiSuggesting(false);
    }
  };

  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [heroIndex, setHeroIndex] = useState(0);
  const [cartTrigger, setCartTrigger] = useState(0);
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const lastScrollY = useRef(0);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsHeaderHidden(latest > 100);
    lastScrollY.current = latest;
  });

  const adminTopSlides = useMemo(() => pageSettings.homeSlides.filter((s: any) => s.position === 'home_top' || !s.position), [pageSettings.homeSlides]);
  const adminMidSlides = useMemo(() => pageSettings.homeSlides.filter((s: any) => s.position === 'home_middle'), [pageSettings.homeSlides]);
  const adminBotSlides = useMemo(() => pageSettings.homeSlides.filter((s: any) => s.position === 'home_bottom'), [pageSettings.homeSlides]);

  const topSlides = useMemo(() => adminTopSlides.filter((s: any) => s.url), [adminTopSlides]);
  const middleSlides = useMemo(() => adminMidSlides.filter((s: any) => s.url), [adminMidSlides]);
  const bottomSlides = useMemo(() => adminBotSlides.filter((s: any) => s.url), [adminBotSlides]);

  useEffect(() => {
    if (topSlides.length <= 1) {
      setHeroIndex(0);
      return;
    }
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % topSlides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [topSlides.length]);

  useEffect(() => {
    setSelectedSubcategory("Tutti");
  }, [selectedCategory]);

  const filteredProducts = useMemo(() => {
    const filtered = PRODUCTS.filter(p => {
      const matchesCategory = selectedCategory === "Tutti" || p.category === selectedCategory;
      const matchesSubcategory = selectedSubcategory === "Tutti" || p.subcategory === selectedSubcategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSubcategory && matchesSearch;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "newest") return parseInt(b.id) - parseInt(a.id);
      return 0;
    });
  }, [selectedCategory, selectedSubcategory, searchQuery, sortBy]);

  // --- Simulated Backend Auth Methods ---
  const getUsers = () => JSON.parse(localStorage.getItem('bespoint_users') || '[]');
  
  const handleAuthEmailContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!authEmail.includes('@')) {
      setAuthError('Email non valida');
      return;
    }
    const users = getUsers();
    const existing = users.find((u: any) => u.email === authEmail.toLowerCase());
    if (existing) {
      setAuthStep('login');
    } else {
      setAuthStep('register');
    }
  };

  const handleAuthLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const users = getUsers();
    const existing = users.find((u: any) => u.email === authEmail.toLowerCase() && u.password === authPassword);
    if (existing) {
      setCurrentUser(existing);
      localStorage.setItem('bespoint_current_user', JSON.stringify(existing));
      setIsAuthOpen(false);
      setAuthEmail('');
      setAuthPassword('');
      setAuthStep('email');
    } else {
      setAuthError('Password non corretta');
    }
  };

  const handleSaveProfile = () => {
    if (!currentUser) return;
    
    const updatedName = `${profileEditForm.nameFirst} ${profileEditForm.nameLast}`.trim();
    
    // Create updated user object
    const updatedUser = { 
      ...currentUser, 
      name: updatedName || currentUser.name,
      phone: profileEditForm.phone,
      addressStreet: profileEditForm.addressStreet,
      addressCity: profileEditForm.addressCity,
      addressZip: profileEditForm.addressZip,
      addressProvince: profileEditForm.addressProvince,
      taxCode: profileEditForm.taxCode
    };
    
    // Update local state (persisting layout)
    setCurrentUser(updatedUser);
    localStorage.setItem('bespoint_current_user', JSON.stringify(updatedUser)); // Keep session updated
    
    // Update user in DB simulation
    const users = getUsers();
    const updatedUsers = users.map((u: any) => u.email === updatedUser.email ? updatedUser : u);
    localStorage.setItem('bespoint_users', JSON.stringify(updatedUsers));
    
    // Switch view back to profile dashboard
    setAuthStep('profile');
  };

  const handleAuthRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (authName.length < 2 || authPassword.length < 6) {
      setAuthError('Nome o password troppo corti (min 6 car.)');
      return;
    }
    const users = getUsers();
    const newUser = { name: authName, email: authEmail.toLowerCase(), password: authPassword };
    users.push(newUser);
    localStorage.setItem('bespoint_users', JSON.stringify(users));
    setCurrentUser(newUser);
    localStorage.setItem('bespoint_current_user', JSON.stringify(newUser));
    setIsAuthOpen(false);
    setAuthEmail('');
    setAuthPassword('');
    setAuthName('');
    setAuthStep('email');
  };

  const handleGoogleLogin = () => {
    setAuthError('');
    // Simulazione Google OAuth Login
    const mockGoogleEmail = "utente.google@gmail.com";
    const mockGoogleName = "Utente Google";
    const users = getUsers();
    const existing = users.find((u: any) => u.email === mockGoogleEmail);
    if (existing) {
      setCurrentUser(existing);
      localStorage.setItem('bespoint_current_user', JSON.stringify(existing));
      setIsAuthOpen(false);
    } else {
      setAuthEmail(mockGoogleEmail);
      setAuthName(mockGoogleName);
      setAuthStep('register');
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('bespoint_current_user');
    setAuthStep('email');
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setCartTrigger(prev => prev + 1);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  // Smooth scroll-driven animations
  const smoothScrollY = useSpring(scrollY, { stiffness: 100, damping: 30, restDelta: 0.001 });
  
  const heroOpacity = useTransform(smoothScrollY, [0, 150], [1, 0]);
  const heroY = useTransform(smoothScrollY, [0, 150], [0, -40]);

  // Header animations with springs for "weight"
  const headerTopHeightRaw = useTransform(smoothScrollY, [0, 100], [64, 0]);
  const headerTopHeight = useSpring(isDesktop ? useTransform(smoothScrollY, [0, 1], [64, 64]) : headerTopHeightRaw, { stiffness: 400, damping: 40 });
  
  const headerTopOpacityRaw = useTransform(smoothScrollY, [0, 80], [1, 0]);
  const headerTopOpacity = useSpring(isDesktop ? useTransform(smoothScrollY, [0, 1], [1, 1]) : headerTopOpacityRaw, { stiffness: 400, damping: 40 });
  
  const headerTopScaleRaw = useTransform(smoothScrollY, [0, 100], [1, 0.98]);
  const headerTopScale = useSpring(isDesktop ? useTransform(smoothScrollY, [0, 1], [1, 1]) : headerTopScaleRaw, { stiffness: 400, damping: 40 });

  const headerShadowOpacity = useTransform(smoothScrollY, [0, 100], [0, 0.2]);
  const headerBgColor = useTransform(smoothScrollY, [0, 100], ["rgba(10, 10, 10, 1)", "rgba(10, 10, 10, 0.95)"]);
  
  const parallaxY = useTransform(smoothScrollY, [500, 1500], [0, -100]);

  return (
    <div className="min-h-screen pb-24 bg-gray-100">
      {/* Top Bar (Amazon Style) */}
      <div className="bg-gradient-to-r from-neutral-900 via-black to-neutral-900 border-b border-gray-800 text-white px-4 py-2 flex items-center justify-between text-xs font-medium">
        <div className="flex items-center gap-2">
          <span>Consegna a Massimo - {companySettings.legalAddress.split(',').pop()?.trim()}</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Aiuto</span>
          <span>Resi e Ordini</span>
        </div>
      </div>

      {/* Header */}
      <motion.header 
        style={{ 
          boxShadow: useTransform(headerShadowOpacity, (v) => `0 10px 30px -10px rgba(0,0,0,${v})`)
        }}
        className="sticky top-0 z-40 bg-gradient-to-b from-[#111111] to-black"
      >
        {/* Animated Top Section (Logo, Desktop Search, Actions) */}
        <motion.div 
          style={{ height: headerTopHeight, opacity: headerTopOpacity, scale: headerTopScale }}
          className="px-4 flex items-center justify-between gap-4 overflow-hidden origin-top"
        >
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSideMenuOpen(true)}
              className="text-white hover:text-brand-yellow transition-colors"
            >
              <Menu className="w-7 h-7" />
            </button>
            <div className="flex items-center gap-3">
              <div className={companySettings.imageLogo ? "h-10 flex items-center" : "w-8 h-8 bg-brand-yellow rounded-lg flex items-center justify-center overflow-hidden"}>
                {companySettings.imageLogo ? (
                  <img src={companySettings.imageLogo} alt="Logo" className="h-full object-contain" referrerPolicy="no-referrer" />
                ) : companySettings.logo.startsWith('http') ? (
                  <img src={companySettings.logo} alt="Logo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <span className="text-brand-dark font-black text-lg">{companySettings.logo}</span>
                )}
              </div>
              {!companySettings.imageLogo && (
                <h1 className="text-xl font-bold tracking-tight text-white">{companySettings.name}</h1>
              )}
            </div>
          </div>
          
          <div className="flex-1 relative hidden md:block">
            <input 
              type="text" 
              placeholder={`Cerca su ${companySettings.name}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 bg-white rounded-md pl-4 pr-10 text-base md:text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow"
            />
            <button className="absolute right-0 top-0 h-full px-3 bg-brand-yellow rounded-r-md">
              <Search className="w-5 h-5 text-brand-dark" />
            </button>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <button 
              onClick={() => {
                if (currentUser) {
                  setAuthStep('profile');
                } else {
                  setAuthStep('email');
                }
                setIsAuthOpen(true);
              }}
              className="flex flex-col items-center text-white hover:text-brand-yellow transition-colors"
            >
              <User className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase">{currentUser ? currentUser.name.split(' ')[0] : 'Accedi'}</span>
            </button>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center text-white gap-1"
            >
              <motion.div 
                key={cartTrigger}
                animate={cartTrigger > 0 ? { scale: [1, 1.25, 1], rotate: [0, -10, 10, 0] } : {}}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="relative"
              >
                <ShoppingCart className="w-7 h-7" />
                {cartCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-brand-yellow text-brand-dark text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-brand-blue"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </motion.div>
              <span className="text-sm font-bold hidden sm:inline">Carrello</span>
            </button>
          </div>
        </motion.div>

        {/* Secondary Nav / Categories (NOW ABOVE SEARCH) */}
        <div className="bg-brand-blue border-t border-white/10 px-4 py-2 flex items-center text-xs font-bold text-white/90 overflow-hidden">
          {selectedCategory !== "Tutti" && (
            <div className="flex-shrink-0 bg-brand-blue pr-4 z-20 shadow-[10px_0_15px_-5px_rgba(0,0,0,0.3)] relative">
              <button 
                onClick={() => setSelectedCategory("Tutti")}
                className="text-brand-yellow uppercase tracking-widest flex items-center gap-1"
              >
                <ArrowLeft className="w-3 h-3" />
                {selectedCategory}
              </button>
            </div>
          )}
          
          <div className="flex overflow-x-auto no-scrollbar gap-4 items-center flex-1 scroll-smooth">
            {(selectedCategory === "Tutti" ? pageSettings.categories : ["Tutti", ...(pageSettings.subcategories[selectedCategory] || [])]).map((cat, idx) => (
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={`${selectedCategory}-${cat}-${idx}`}
                onClick={() => selectedCategory === "Tutti" ? setSelectedCategory(cat) : setSelectedSubcategory(cat)}
                className={`whitespace-nowrap pb-1 border-b-2 transition-all ${
                  (selectedCategory === "Tutti" ? selectedCategory === cat : selectedSubcategory === cat)
                    ? "border-brand-yellow text-white" 
                    : "border-transparent hover:text-white"
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Mobile Search Bar (NOW BELOW CATEGORIES) */}
        <div className="px-4 py-2 md:hidden border-t border-white/5">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Cerca su Bespoint..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 bg-white rounded-lg pl-4 pr-12 text-base shadow-inner focus:outline-none"
            />
            <button className="absolute right-0 top-0 h-full px-4 bg-brand-yellow rounded-r-lg">
              <Search className="w-5 h-5 text-brand-dark" />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Hero Banner (Amazon Style) */}
      {selectedCategory === "Tutti" ? (
        <motion.section 
          initial={{ height: 0 }}
          animate={{ height: "auto" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          style={{ opacity: heroOpacity, y: heroY }}
          className="relative w-full overflow-hidden mb-8 origin-top"
        >
          <div className="h-64 sm:h-80 w-full relative">
            <div className="absolute inset-0 bg-gradient-to-b from-brand-blue/40 to-transparent z-10" />
            <AnimatePresence mode="wait">
              <motion.div
                key={heroIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="w-full h-full"
              >
                {topSlides[heroIndex]?.link ? (
                  <a href={topSlides[heroIndex].link} className="block w-full h-full">
                    <img 
                      src={topSlides[heroIndex]?.url || "https://picsum.photos/seed/hero/1920/1080"} 
                      alt={topSlides[heroIndex]?.alt || "Hero Context"} 
                      title={topSlides[heroIndex]?.title || ""}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </a>
                ) : (
                  <img 
                    src={topSlides[heroIndex]?.url || "https://picsum.photos/seed/hero/1920/1080"} 
                    alt={topSlides[heroIndex]?.alt || "Hero Context"} 
                    title={topSlides[heroIndex]?.title || ""}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                )}
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 px-6 z-20">
              <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter drop-shadow-lg">
                {topSlides[heroIndex]?.title || "Le scelte migliori per te"}
              </h2>
              <p className="text-sm text-white/90 mb-4 font-bold drop-shadow-md">
                {topSlides[heroIndex]?.alt || "Risparmia fino al 40% su tutta la tecnologia Bespoint."}
              </p>
            </div>
          </div>
        </motion.section>
      ) : (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative w-full h-48 sm:h-64 overflow-hidden mb-8"
        >
          {pageSettings.categoryBanners[selectedCategory]?.link ? (
            <a href={pageSettings.categoryBanners[selectedCategory].link} className="block w-full h-full">
              <img 
                src={pageSettings.categoryBanners[selectedCategory]?.url || `https://picsum.photos/seed/${selectedCategory.toLowerCase()}/1200/600`} 
                alt={pageSettings.categoryBanners[selectedCategory]?.alt || selectedCategory}
                title={pageSettings.categoryBanners[selectedCategory]?.title || selectedCategory}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </a>
          ) : (
            <img 
              src={pageSettings.categoryBanners[selectedCategory]?.url || `https://picsum.photos/seed/${selectedCategory.toLowerCase()}/1200/600`} 
              alt={pageSettings.categoryBanners[selectedCategory]?.alt || selectedCategory}
              title={pageSettings.categoryBanners[selectedCategory]?.title || selectedCategory}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/90 via-brand-dark/40 to-transparent flex flex-col justify-center px-6 sm:px-12 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-4xl sm:text-5xl font-black text-white uppercase tracking-tighter mb-2">
                {pageSettings.categoryBanners[selectedCategory]?.title || selectedCategory}
              </h2>
              <div className="w-16 h-1 bg-brand-yellow mb-4" />
              <p className="text-white/80 font-bold text-sm max-w-md">
                {pageSettings.categoryBanners[selectedCategory]?.alt || `Esplora la nostra selezione premium di prodotti per ${selectedCategory.toLowerCase()}. Qualità garantita Bespoint.`}
              </p>
            </motion.div>
          </div>
        </motion.section>
      )}

      {/* Promo Horizontal Scroll */}
      {selectedCategory === "Tutti" && (
        <>
          <section className="px-4 mb-12">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-between mb-4"
            >
              <h2 className="text-lg font-bold text-brand-dark">Le scelte migliori per te</h2>
              <button className="text-xs font-bold text-blue-600">Vedi tutte</button>
            </motion.div>
            <div className="flex overflow-x-auto lg:grid lg:grid-cols-12 lg:grid-rows-2 lg:h-[450px] no-scrollbar gap-4 pb-4">
              {(pageSettings.linkRapidi || []).map((item: any, idx: number) => (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 100, 
                    damping: 15, 
                    delay: idx * 0.1 
                  }}
                  key={item.id}
                  onClick={() => {
                    setSelectedCategory(item.category || "Tutti");
                    setSelectedSubcategory(item.subcategory || "Tutti");
                  }}
                  className={`${item.color} rounded-2xl p-4 h-40 lg:h-full min-w-[160px] sm:min-w-[200px] flex flex-col justify-between overflow-hidden relative group cursor-pointer flex-shrink-0 shadow-lg ${
                    idx === 0 ? "lg:col-span-4 lg:row-span-2" : 
                    idx === 1 ? "lg:col-span-4 lg:row-span-1" :
                    idx === 2 ? "lg:col-span-4 lg:row-span-1" :
                    idx === 3 ? "lg:col-span-2 lg:row-span-1" :
                    idx === 4 ? "lg:col-span-3 lg:row-span-1" :
                    idx === 5 ? "lg:col-span-3 lg:row-span-1" :
                    "lg:hidden"
                  }`}
                >
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 + 0.2 }}
                    className="z-10"
                  >
                    <h3 className={`${item.color === "bg-brand-yellow" ? "text-brand-dark" : "text-white"} font-bold text-sm mb-1`}>
                      {item.title}
                    </h3>
                    <p className={`${item.color === "bg-brand-yellow" ? "text-brand-blue" : "text-brand-yellow"} text-[10px] font-bold`}>
                      {item.subtitle}
                    </p>
                  </motion.div>
                  <motion.img 
                    initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
                    animate={{ opacity: 0.5, scale: 1, rotate: 0 }}
                    transition={{ delay: idx * 0.1 + 0.3, type: "spring" }}
                    src={`https://picsum.photos/seed/${item.seed}/300/300`} 
                    className="absolute right-[-20px] bottom-[-20px] w-24 h-24 object-cover rounded-full group-hover:scale-110 transition-transform" 
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
              ))}
            </div>
          </section>

          <SlideSection slides={middleSlides} />
        </>
      )}

      {/* Product Grid Section */}
      <section className="px-4 relative z-10 mb-16">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
        >
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-brand-dark">Prodotti in vetrina</h2>
            <span className="text-xs text-gray-400 font-medium">({filteredProducts.length} risultati)</span>
          </div>
          
          <div className="flex items-center gap-3">
            <label htmlFor="sort" className="text-xs font-bold text-gray-500 uppercase tracking-widest">Ordina per:</label>
            <div className="relative">
              <select 
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-10 text-sm font-bold text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-yellow shadow-sm cursor-pointer"
              >
                <option value="newest">Novità</option>
                <option value="price-asc">Prezzo: dal più basso</option>
                <option value="price-desc">Prezzo: dal più alto</option>
                <option value="rating">Valutazione</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <ChevronRight className="w-4 h-4 rotate-90" />
              </div>
            </div>
          </div>
        </motion.div>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full py-12 text-center bg-white rounded-xl shadow-sm">
              <p className="text-gray-400 font-medium">Nessun prodotto trovato</p>
            </div>
          ) : (
            filteredProducts.map((product, index) => (
              <div key={product.id}>
                <ProductCard 
                  product={product} 
                  onClick={() => setSelectedProduct(product)} 
                  onAddToCart={addToCart}
                  index={index}
                />
              </div>
            ))
          )}
        </div>
      </section>

      {selectedCategory === "Tutti" && <SlideSection slides={bottomSlides} />}

      {/* Parallax Floating Banner */}
      {selectedCategory === "Tutti" && (
        <section className="px-4 mb-16 overflow-hidden">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative h-64 rounded-3xl overflow-hidden shadow-2xl border border-white/20"
          >
            <motion.div 
              style={{ y: parallaxY }}
              className="absolute inset-0 w-full h-[120%]"
            >
              <img 
                src="https://picsum.photos/seed/parallax-tech/1200/800" 
                alt="Parallax" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            <div className="absolute inset-0 bg-brand-blue/40 backdrop-blur-[2px] flex flex-col items-center justify-center text-center p-8">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-black text-white uppercase tracking-tighter mb-2 drop-shadow-lg"
              >
                Bespoint Experience
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-white/90 font-bold max-w-md drop-shadow-md mb-6"
              >
                {companySettings.mission}
              </motion.p>
              <motion.button 
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="bg-white text-brand-blue px-8 py-3 rounded-full font-black uppercase text-sm tracking-widest hover:bg-brand-yellow hover:text-brand-dark transition-all transform hover:scale-105 shadow-xl"
              >
                Esplora il Brand
              </motion.button>
            </div>
          </motion.div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-brand-dark text-white pt-16 pb-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-brand-yellow rounded-xl flex items-center justify-center">
                <span className="text-brand-dark font-black text-xl italic">{companySettings.logo}</span>
              </div>
              <h1 className="text-2xl font-black italic tracking-tighter">{companySettings.name}</h1>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              {companySettings.mission}
            </p>
            <div className="flex gap-4">
              <a href={companySettings.socials.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-blue transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href={companySettings.socials.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-blue transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href={companySettings.socials.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-blue transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-brand-yellow">Link Rapidi</h3>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li className="hover:text-white cursor-pointer transition-colors">Chi Siamo</li>
              <li className="hover:text-white cursor-pointer transition-colors">Prodotti</li>
              <li className="hover:text-white cursor-pointer transition-colors">Offerte</li>
              <li className="hover:text-white cursor-pointer transition-colors">Blog</li>
              <li className="hover:text-white cursor-pointer transition-colors">Lavora con noi</li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-brand-yellow">Supporto</h3>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li className="hover:text-white cursor-pointer transition-colors">Centro Assistenza</li>
              <li className="hover:text-white cursor-pointer transition-colors">Spedizioni</li>
              <li className="hover:text-white cursor-pointer transition-colors">Resi e Rimborsi</li>
              <li className="hover:text-white cursor-pointer transition-colors">Privacy Policy</li>
              <li className="hover:text-white cursor-pointer transition-colors">Termini e Condizioni</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-brand-yellow">Contatti</h3>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-brand-blue" />
                <span>{companySettings.legalAddress}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-brand-blue" />
                <span>{companySettings.phone}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-brand-blue" />
                <span>{companySettings.email}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 text-center text-gray-500 text-xs flex flex-col items-center gap-4">
          <p>© 2026 {companySettings.name}. Tutti i diritti riservati - {companySettings.legalName}</p>
          <button 
            onClick={() => setIsAdminOpen(true)}
            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-yellow hover:text-brand-dark transition-all opacity-20 hover:opacity-100"
          >
            <Shield className="w-5 h-5" />
          </button>
        </div>
      </footer>

      {/* Modals & Sheets */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductSheet 
            key="product-sheet"
            product={selectedProduct} 
            onClose={() => setSelectedProduct(null)} 
            onAddToCart={addToCart}
            isDesktop={isDesktop}
          />
        )}
        {isCartOpen && (
          <CartDrawer 
            key="cart-drawer"
            items={cart} 
            onClose={() => setIsCartOpen(false)} 
            onUpdateQuantity={updateQuantity}
            onRemove={removeFromCart}
          />
        )}
        <SideMenu 
          key="side-menu"
          isOpen={isSideMenuOpen} 
          onClose={() => setIsSideMenuOpen(false)} 
          onSelectCategory={setSelectedCategory}
          companySettings={companySettings}
          pageSettings={pageSettings}
          onOpenProfile={() => {
            if (currentUser) {
              setAuthStep('profile');
            } else {
              setAuthStep('email');
            }
            setIsAuthOpen(true);
          }}
          onOpenOrders={() => {
            if (currentUser) {
              setAuthStep('orders');
            } else {
              setAuthStep('email');
            }
            setIsAuthOpen(true);
          }}
          onLogout={logout}
        />
      </AnimatePresence>
        <CartSplash 
          key="cart-splash"
          trigger={cartTrigger} 
          isMenuHidden={isHeaderHidden} 
          count={cartCount} 
        />
        <AnimatePresence>
          {isAdminOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] flex bg-brand-dark/20 backdrop-blur-xl animate-in fade-in duration-500"
            >
              {/* Admin Container */}
              <motion.div 
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300, mass: 1 }}
                className="flex w-full h-full bg-white shadow-2xl relative overflow-hidden"
              >
                {/* Mobile Admin Header */}
                <div className="md:hidden absolute top-0 left-0 right-0 h-16 flex items-center justify-between px-6 border-b border-gray-100 bg-white z-[50]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-brand-yellow" />
                    </div>
                    <h3 className="font-black text-brand-dark uppercase tracking-tighter text-sm">Admin Panel</h3>
                  </div>
                  <button 
                    onClick={() => setIsMobileAdminMenuOpen(!isMobileAdminMenuOpen)}
                    className="p-2 text-brand-dark hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    {isMobileAdminMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                  </button>
                </div>

                {/* Sidebar */}
                <motion.div 
                  initial={{ x: -280 }}
                  animate={{ x: 0 }}
                  className={`${isSidebarCollapsed ? 'w-24' : 'w-72 md:w-80'} h-full bg-brand-dark flex flex-col transition-all duration-500 relative z-20 shadow-2xl ${isMobileAdminMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
                >

            {/* Sidebar Menu */}
            <motion.div 
              initial={false}
              animate={{ 
                width: window.innerWidth < 768 ? (isMobileAdminMenuOpen ? '100%' : 0) : (isSidebarCollapsed ? 80 : 256),
                x: window.innerWidth < 768 && !isMobileAdminMenuOpen ? -300 : 0,
                opacity: window.innerWidth < 768 && !isMobileAdminMenuOpen ? 0 : 1
              }}
              className={`bg-gray-50 border-r border-gray-100 flex flex-col p-6 relative transition-all duration-300 z-40 ${window.innerWidth < 768 ? (isMobileAdminMenuOpen ? 'fixed inset-0 pt-20' : 'hidden') : ''}`}
            >
                <button 
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  className="hidden md:flex absolute -right-3 top-20 w-6 h-6 bg-white border border-gray-100 rounded-full items-center justify-center shadow-sm z-10 hover:bg-brand-yellow transition-colors"
                >
                  {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>

                <div className="hidden md:flex items-center gap-3 mb-10 overflow-hidden">
                  <div className="w-10 h-10 bg-brand-blue rounded-xl flex-shrink-0 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-brand-yellow" />
                  </div>
                  {!isSidebarCollapsed && (
                    <h3 className="font-black text-brand-dark uppercase tracking-tighter whitespace-nowrap">Admin Panel</h3>
                  )}
                </div>
                
                <nav className="space-y-2 flex-1">
                  <button 
                    onClick={() => {
                      setAdminActiveTab('company');
                      setIsMobileAdminMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-4 md:py-3 rounded-2xl font-bold text-sm transition-all ${adminActiveTab === 'company' ? 'bg-brand-yellow text-brand-dark shadow-md' : 'text-gray-400 hover:bg-gray-100'}`}
                  >
                    <Grid className="w-6 h-6 md:w-5 md:h-5 flex-shrink-0" />
                    {(window.innerWidth >= 768 ? !isSidebarCollapsed : true) && <span>Azienda</span>}
                  </button>
                  <button 
                    onClick={() => {
                      setAdminActiveTab('slides');
                      setIsMobileAdminMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-4 md:py-3 rounded-2xl font-bold text-sm transition-all ${adminActiveTab === 'slides' ? 'bg-brand-yellow text-brand-dark shadow-md' : 'text-gray-400 hover:bg-gray-100'}`}
                  >
                    <Play className="w-6 h-6 md:w-5 md:h-5 flex-shrink-0" />
                    {(window.innerWidth >= 768 ? !isSidebarCollapsed : true) && <span>Slide</span>}
                  </button>
                  <button 
                    onClick={() => setAdminActiveTab('seo')}
                    className={`w-full flex items-center gap-3 px-4 py-4 md:py-3 rounded-2xl font-bold text-sm transition-all ${adminActiveTab === 'seo' ? 'bg-brand-yellow text-brand-dark shadow-lg shadow-brand-yellow/20' : 'text-gray-400 hover:bg-gray-50 hover:text-brand-dark'}`}
                  >
                    <Globe className="w-6 h-6 md:w-5 md:h-5 flex-shrink-0" />
                    {(window.innerWidth >= 768 ? !isSidebarCollapsed : true) && <span>SEO & Google</span>}
                  </button>

                  <button 
                    onClick={() => setAdminActiveTab('analytics')}
                    className={`w-full flex items-center gap-3 px-4 py-4 md:py-3 rounded-2xl font-bold text-sm transition-all ${adminActiveTab === 'analytics' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'text-gray-400 hover:bg-gray-50 hover:text-brand-dark'}`}
                  >
                    <BarChart2 className="w-6 h-6 md:w-5 md:h-5 flex-shrink-0" />
                    {(window.innerWidth >= 768 ? !isSidebarCollapsed : true) && <span>Analytics</span>}
                  </button>

                  <button 
                    onClick={() => setAdminActiveTab('marketing')}
                    className={`w-full flex items-center gap-3 px-4 py-4 md:py-3 rounded-2xl font-bold text-sm transition-all ${adminActiveTab === 'marketing' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-gray-400 hover:bg-gray-50 hover:text-brand-dark'}`}
                  >
                    <Target className="w-6 h-6 md:w-5 md:h-5 flex-shrink-0" />
                    {(window.innerWidth >= 768 ? !isSidebarCollapsed : true) && <span>Marketing & Adv</span>}
                  </button>
                  <button 
                    onClick={() => {
                      setAdminActiveTab('categories');
                      setIsMobileAdminMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-4 md:py-3 rounded-2xl font-bold text-sm transition-all ${adminActiveTab === 'categories' ? 'bg-brand-yellow text-brand-dark shadow-md' : 'text-gray-400 hover:bg-gray-100'}`}
                  >
                    <Compass className="w-6 h-6 md:w-5 md:h-5 flex-shrink-0" />
                    {(window.innerWidth >= 768 ? !isSidebarCollapsed : true) && <span>Categorie</span>}
                  </button>
                  <button 
                    onClick={() => {
                      setAdminActiveTab('orders' as any);
                      setIsMobileAdminMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-4 md:py-3 rounded-2xl font-bold text-sm transition-all ${adminActiveTab === 'orders' ? 'bg-brand-yellow text-brand-dark shadow-md' : 'text-gray-400 hover:bg-gray-100'}`}
                  >
                    <ShoppingBag className="w-6 h-6 md:w-5 md:h-5 flex-shrink-0" />
                    {(window.innerWidth >= 768 ? !isSidebarCollapsed : true) && <span>Ordini</span>}
                  </button>
                  <button 
                    onClick={() => {
                      setAdminActiveTab('couriers');
                      setIsMobileAdminMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-4 md:py-3 rounded-2xl font-bold text-sm transition-all ${adminActiveTab === 'couriers' ? 'bg-brand-yellow text-brand-dark shadow-md' : 'text-gray-400 hover:bg-gray-100'}`}
                  >
                    <Truck className="w-6 h-6 md:w-5 md:h-5 flex-shrink-0" />
                    {(window.innerWidth >= 768 ? !isSidebarCollapsed : true) && <span>Corrieri</span>}
                  </button>
                  <button 
                    onClick={() => {
                      setAdminActiveTab('products');
                      setIsMobileAdminMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-4 md:py-3 rounded-2xl font-bold text-sm transition-all ${adminActiveTab === 'products' ? 'bg-brand-yellow text-brand-dark shadow-md' : 'text-gray-400 hover:bg-gray-100'}`}
                  >
                    <Package className="w-6 h-6 md:w-5 md:h-5 flex-shrink-0" />
                    {(window.innerWidth >= 768 ? !isSidebarCollapsed : true) && <span>Prodotti</span>}
                  </button>
                  <button 
                    onClick={() => {
                      setAdminActiveTab('marketplaces');
                      setIsMobileAdminMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-4 md:py-3 rounded-2xl font-bold text-sm transition-all ${adminActiveTab === 'marketplaces' ? 'bg-brand-yellow text-brand-dark shadow-md' : 'text-gray-400 hover:bg-gray-100'}`}
                  >
                    <Globe className="w-6 h-6 md:w-5 md:h-5 flex-shrink-0" />
                    {(window.innerWidth >= 768 ? !isSidebarCollapsed : true) && <span>Marketplaces</span>}
                  </button>
                  <button 
                    onClick={() => {
                      setAdminActiveTab('link_rapidi' as any);
                      setIsMobileAdminMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-4 md:py-3 rounded-2xl font-bold text-sm transition-all ${adminActiveTab === ('link_rapidi' as any) ? 'bg-brand-yellow text-brand-dark shadow-md' : 'text-gray-400 hover:bg-gray-100'}`}
                  >
                    <Box className="w-6 h-6 md:w-5 md:h-5 flex-shrink-0" />
                    {(window.innerWidth >= 768 ? !isSidebarCollapsed : true) && <span>Link Rapidi</span>}
                  </button>
                  <button 
                    onClick={() => {
                      setAdminActiveTab('returns' as any);
                      setIsMobileAdminMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-4 md:py-3 rounded-2xl font-bold text-sm transition-all ${adminActiveTab === 'returns' ? 'bg-red-500 text-white shadow-md' : 'text-gray-400 hover:bg-gray-100'}`}
                  >
                    <RefreshCw className="w-6 h-6 md:w-5 md:h-5 flex-shrink-0" />
                    {(window.innerWidth >= 768 ? !isSidebarCollapsed : true) && <span>Gestione Resi</span>}
                  </button>

                  <button 
                    onClick={() => {
                      setAdminActiveTab('users' as any);
                      setIsMobileAdminMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-4 md:py-3 rounded-2xl font-bold text-sm transition-all ${adminActiveTab === 'users' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:bg-gray-100'}`}
                  >
                    <Users className="w-6 h-6 md:w-5 md:h-5 flex-shrink-0" />
                    {(window.innerWidth >= 768 ? !isSidebarCollapsed : true) && <span>Archivio Utenti</span>}
                  </button>
                </nav>

                <button 
                  onClick={() => setIsAdminOpen(false)}
                  className="mt-auto w-full flex items-center justify-center gap-2 px-4 py-4 md:py-3 rounded-2xl font-bold text-sm text-red-500 hover:bg-red-50 transition-all"
                >
                  <X className="w-6 h-6 md:w-5 md:h-5 flex-shrink-0" />
                  {(window.innerWidth >= 768 ? !isSidebarCollapsed : true) && <span>Esci</span>}
                </button>
            </motion.div>
          </motion.div>

              {/* Content Area */}
              <div className="flex-1 overflow-y-auto p-4 md:p-10 bg-gray-50/50">
                {adminActiveTab === 'dashboard' && (
                  <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="flex justify-between items-end">
                      <div>
                        <h2 className="text-[40px] font-black text-brand-dark leading-none tracking-tighter uppercase">Benvenuto, Boss 👋</h2>
                        <p className="text-sm font-bold text-gray-400 mt-2 uppercase tracking-[0.2em]">Ecco l'andamento del tuo impero BesPoint</p>
                      </div>
                      <div className="hidden md:flex gap-4">
                         <div className="text-right">
                           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tempo reale</p>
                           <p className="text-sm font-black text-brand-dark flex items-center gap-2">
                             <Activity className="w-4 h-4 text-green-500 animate-pulse" />
                             32 Utenti Online
                           </p>
                         </div>
                      </div>
                    </div>

                    {/* Big Stats Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {[
                        { label: 'Fatturato Totale', value: '€128.430', change: '+18%', icon: DollarSign, color: 'text-brand-yellow', bg: 'bg-brand-dark' },
                        { label: 'Ordini Ricevuti', value: '1.243', change: '+12%', icon: ShoppingBag, color: 'text-brand-blue', bg: 'bg-white' },
                        { label: 'Resi Gestiti', value: '12', change: '-5%', icon: Repeat, color: 'text-red-500', bg: 'bg-white' },
                        { label: 'Nuovi Clienti', value: '342', change: '+22%', icon: UserPlus, color: 'text-purple-500', bg: 'bg-white' }
                      ].map((stat, i) => (
                        <div key={i} className={`${stat.bg} ${stat.bg === 'bg-brand-dark' ? 'text-white' : 'text-brand-dark border border-gray-100'} p-8 rounded-[3rem] shadow-xl hover:-translate-y-2 transition-all relative overflow-hidden group`}>
                           <div className="flex justify-between items-start relative z-10">
                              <div className={`p-4 ${stat.bg === 'bg-brand-dark' ? 'bg-white/10' : 'bg-gray-50'} rounded-2xl group-hover:rotate-12 transition-transform`}>
                                <stat.icon className={`w-7 h-7 ${stat.color}`} />
                              </div>
                              <span className={`text-[10px] font-black px-3 py-1.5 rounded-full ${stat.change.startsWith('+') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                {stat.change}
                              </span>
                           </div>
                           <div className="mt-8 relative z-10">
                              <p className={`text-[10px] font-black uppercase tracking-widest ${stat.bg === 'bg-brand-dark' ? 'text-gray-400' : 'text-gray-400'} mb-1`}>{stat.label}</p>
                              <h4 className="text-[34px] font-black tracking-tight">{stat.value}</h4>
                           </div>
                           {stat.bg === 'bg-brand-dark' && <div className="absolute top-0 right-0 w-32 h-32 bg-brand-yellow rounded-full blur-[80px] opacity-20 -mr-10 -mt-10"></div>}
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                       {/* Sales Trend Chart */}
                       <div className="lg:col-span-2 bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-xl space-y-8">
                          <div className="flex justify-between items-center">
                             <h3 className="text-2xl font-black text-brand-dark uppercase tracking-tighter">Andamento Vendite</h3>
                             <div className="flex p-1 bg-gray-50 rounded-xl">
                                {['Settimana', 'Mese', 'Anno'].map(t => (
                                  <button key={t} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${t === 'Mese' ? 'bg-brand-dark text-white shadow-lg' : 'text-gray-400 hover:text-brand-dark'}`}>
                                    {t}
                                  </button>
                                ))}
                             </div>
                          </div>
                          
                          <div className="h-80 flex items-end gap-3 px-4">
                             {[35, 45, 30, 75, 90, 65, 85, 40, 60, 95, 70, 80].map((h, i) => (
                               <div key={i} className="flex-1 flex flex-col items-center gap-4 group cursor-pointer h-full justify-end">
                                  <div className="w-full relative h-[85%] flex items-end">
                                    <motion.div 
                                      initial={{ height: 0 }}
                                      animate={{ height: `${h}%` }}
                                      className="w-full bg-gradient-to-t from-brand-blue/5 to-brand-blue rounded-2xl group-hover:from-brand-yellow group-hover:to-brand-yellow/80 transition-all duration-500 shadow-sm"
                                    />
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-brand-dark text-white px-3 py-1.5 rounded-xl text-[11px] font-black opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap shadow-2xl scale-75 group-hover:scale-100">
                                      €{(h * 1500).toLocaleString()}
                                    </div>
                                  </div>
                                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">M{i+1}</span>
                               </div>
                             ))}
                          </div>
                       </div>

                       {/* Top/Worst Products */}
                       <div className="space-y-6">
                          <div className="bg-brand-dark p-8 rounded-[3rem] text-white shadow-2xl space-y-6">
                             <h3 className="text-lg font-black uppercase tracking-tighter flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-green-400" /> Top Venduti
                             </h3>
                             <div className="space-y-4">
                                {[
                                  { name: 'Lampada Minimal Led', sales: 432, trend: '+12%' },
                                  { name: 'E-Scooter Pro X', sales: 215, trend: '+8%' },
                                  { name: 'Cavo Fibra 10mt', sales: 189, trend: '+15%' }
                                ].map((p, i) => (
                                  <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                                     <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center font-black text-brand-yellow">#{(i+1)}</div>
                                        <div>
                                          <p className="text-xs font-bold leading-none mb-1">{p.name}</p>
                                          <p className="text-[10px] text-gray-500 font-bold">{p.sales} vendite</p>
                                        </div>
                                     </div>
                                     <span className="text-[10px] font-black text-green-400">{p.trend}</span>
                                  </div>
                                ))}
                             </div>
                          </div>

                          <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm space-y-6">
                             <h3 className="text-lg font-black text-brand-dark uppercase tracking-tighter flex items-center gap-2">
                                <TrendingDown className="w-5 h-5 text-red-500" /> Meno Venduti
                             </h3>
                             <div className="space-y-4">
                                {[
                                  { name: 'Cover TPU iPhone 12', sales: 2, trend: '-80%' },
                                  { name: 'Batteria Litio 3V', sales: 5, trend: '-45%' }
                                ].map((p, i) => (
                                  <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                                     <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                           <Box className="w-5 h-5 text-gray-300" />
                                        </div>
                                        <div>
                                          <p className="text-xs font-bold leading-none mb-1 text-gray-700">{p.name}</p>
                                          <p className="text-[10px] text-gray-400 font-bold">{p.sales} vendite</p>
                                        </div>
                                     </div>
                                     <span className="text-[10px] font-black text-red-500">{p.trend}</span>
                                  </div>
                                ))}
                                <button className="w-full py-3 bg-red-50 hover:bg-red-100 text-[10px] font-black uppercase text-red-600 rounded-xl transition-all">Sconto Strategico</button>
                             </div>
                          </div>
                       </div>
                    </div>
                  </div>
                )}
                {adminActiveTab === 'company' && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                    <div className="flex justify-between items-center">
                      <h2 className="text-3xl font-black text-brand-dark uppercase tracking-tighter">Configurazione Azienda</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Basic Info */}
                      <div className="space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-widest text-brand-blue border-l-4 border-brand-yellow pl-3">Brand & Identity</h4>
                        
                        {/* Image Logo Upload */}
                        <div className="space-y-2">
                          <span className="text-xs font-black uppercase tracking-widest text-gray-400">Logo Aziendale (Rettangolo Orizzontale)</span>
                          <div className="flex gap-4 items-start">
                            <label className="flex-1 cursor-pointer group">
                              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-2xl p-6 bg-gray-50 group-hover:bg-gray-100 group-hover:border-brand-yellow transition-all">
                                <Upload className="w-8 h-8 text-brand-blue mb-2" />
                                <span className="text-[10px] font-black uppercase text-gray-500">Seleziona Immagine Logo</span>
                                <input 
                                  type="file" 
                                  className="hidden" 
                                  accept="image/*"
                                  onChange={(e) => handleFileChange(e, (url) => setCompanySettings({...companySettings, imageLogo: url}))}
                                />
                              </div>
                            </label>
                            {companySettings.imageLogo && (
                              <div className="w-32 h-32 bg-white border border-gray-100 rounded-2xl p-2 flex items-center justify-center relative shadow-sm">
                                <img src={companySettings.imageLogo} className="max-w-full max-h-full object-contain" />
                                <button 
                                  onClick={() => setCompanySettings({...companySettings, imageLogo: ""})}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg hover:scale-110 transition-transform"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </div>
                          <p className="text-[9px] text-gray-400 font-bold italic leading-tight">
                            * Caricando un logo immagine, il Nome Brand e il Logo Testo verranno disabilitati nella barra superiore per far spazio alla grafica del logo.
                          </p>
                        </div>

                        {/* Favicon Upload */}
                        <div className="space-y-2">
                          <span className="text-xs font-black uppercase tracking-widest text-gray-400">Favicon (100x100px)</span>
                          <div className="flex gap-4 items-center">
                            <label className="flex-1 cursor-pointer group">
                              <div className="flex items-center gap-4 border-2 border-dashed border-gray-100 rounded-2xl px-6 py-4 bg-gray-50 group-hover:bg-gray-100 group-hover:border-brand-yellow transition-all">
                                <Camera className="w-6 h-6 text-brand-blue" />
                                <span className="text-[10px] font-black uppercase text-gray-500">Carica Favicon</span>
                                <input 
                                  type="file" 
                                  className="hidden" 
                                  accept="image/*"
                                  onChange={(e) => handleFileChange(e, (url) => setCompanySettings({...companySettings, favicon: url}))}
                                />
                              </div>
                            </label>
                            {companySettings.favicon && (
                              <div className="w-14 h-14 bg-white border border-gray-100 rounded-xl p-1 flex items-center justify-center relative shadow-sm">
                                <img src={companySettings.favicon} className="w-full h-full object-contain rounded-lg" />
                                <button 
                                  onClick={() => setCompanySettings({...companySettings, favicon: ""})}
                                  className="absolute -top-1 -right-1 bg-red-500 text-white p-0.5 rounded-full shadow-lg"
                                >
                                  <X className="w-2 h-2" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-2">
                          <label className={`block transition-opacity ${companySettings.imageLogo ? 'opacity-40' : 'opacity-100'}`}>
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Logo (Solo Testo)</span>
                            <input 
                              type="text" 
                              disabled={!!companySettings.imageLogo}
                              value={companySettings.logo}
                              onChange={(e) => setCompanySettings({...companySettings, logo: e.target.value})}
                              className={`mt-1 block w-full bg-gray-50 border-gray-200 rounded-xl px-4 py-3 text-base font-bold focus:ring-brand-yellow focus:border-brand-yellow ${companySettings.imageLogo ? 'cursor-not-allowed' : ''}`}
                            />
                          </label>
                          <label className={`block transition-opacity ${companySettings.imageLogo ? 'opacity-40' : 'opacity-100'}`}>
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Nome Brand (Testo)</span>
                            <input 
                              type="text" 
                              disabled={!!companySettings.imageLogo}
                              value={companySettings.name}
                              onChange={(e) => setCompanySettings({...companySettings, name: e.target.value})}
                              className={`mt-1 block w-full bg-gray-50 border-gray-200 rounded-xl px-4 py-3 text-base font-bold focus:ring-brand-yellow focus:border-brand-yellow ${companySettings.imageLogo ? 'cursor-not-allowed' : ''}`}
                            />
                          </label>
                        </div>
                        <label className="block">
                          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Ragione Sociale</span>
                          <input 
                            type="text" 
                            value={companySettings.legalName}
                            onChange={(e) => setCompanySettings({...companySettings, legalName: e.target.value})}
                            className="mt-1 block w-full bg-gray-50 border-gray-200 rounded-xl px-4 py-3 text-base font-bold focus:ring-brand-yellow focus:border-brand-yellow"
                          />
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <label className="block">
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Partita IVA</span>
                            <input 
                              type="text" 
                              value={companySettings.vatNumber || ''}
                              onChange={(e) => setCompanySettings({...companySettings, vatNumber: e.target.value})}
                              className="mt-1 block w-full bg-gray-50 border-gray-200 rounded-xl px-4 py-3 text-base font-bold focus:ring-brand-yellow focus:border-brand-yellow"
                            />
                          </label>
                          <label className="block">
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Codice Univoco (SDI)</span>
                            <input 
                              type="text" 
                              value={companySettings.sdiCode || ''}
                              onChange={(e) => setCompanySettings({...companySettings, sdiCode: e.target.value})}
                              className="mt-1 block w-full bg-gray-50 border-gray-200 rounded-xl px-4 py-3 text-base font-bold focus:ring-brand-yellow focus:border-brand-yellow uppercase"
                            />
                          </label>
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-widest text-brand-blue border-l-4 border-brand-yellow pl-3">Contatti</h4>
                        <label className="block">
                          <span className="text-xs font-black uppercase tracking-widest text-gray-400">Sede Legale</span>
                          <input 
                            type="text" 
                            value={companySettings.legalAddress}
                            onChange={(e) => setCompanySettings({...companySettings, legalAddress: e.target.value})}
                            className="mt-1 block w-full bg-gray-50 border-gray-200 rounded-xl px-4 py-3 text-base font-bold focus:ring-brand-yellow focus:border-brand-yellow"
                          />
                        </label>
                        <label className="block">
                          <span className="text-xs font-black uppercase tracking-widest text-gray-400">Telefono</span>
                          <input 
                            type="text" 
                            value={companySettings.phone}
                            onChange={(e) => setCompanySettings({...companySettings, phone: e.target.value})}
                            className="mt-1 block w-full bg-gray-50 border-gray-200 rounded-xl px-4 py-3 text-base font-bold focus:ring-brand-yellow focus:border-brand-yellow"
                          />
                        </label>
                        <label className="block">
                          <span className="text-xs font-black uppercase tracking-widest text-gray-400">Email</span>
                          <input 
                            type="email" 
                            value={companySettings.email}
                            onChange={(e) => setCompanySettings({...companySettings, email: e.target.value})}
                            className="mt-1 block w-full bg-gray-50 border-gray-200 rounded-xl px-4 py-3 text-base font-bold focus:ring-brand-yellow focus:border-brand-yellow"
                          />
                        </label>
                      </div>
                    </div>

                    {/* Mission & Bio */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-black uppercase tracking-widest text-brand-blue border-l-4 border-brand-yellow pl-3">Identità</h4>
                      <label className="block">
                        <span className="text-xs font-black uppercase tracking-widest text-gray-400">Mission Aziendale</span>
                        <textarea 
                          rows={3}
                          value={companySettings.mission}
                          onChange={(e) => setCompanySettings({...companySettings, mission: e.target.value})}
                          className="mt-1 block w-full bg-gray-50 border-gray-200 rounded-xl px-4 py-3 text-base font-bold focus:ring-brand-yellow focus:border-brand-yellow"
                        />
                      </label>
                      <label className="block">
                        <span className="text-xs font-black uppercase tracking-widest text-gray-400">Link Bio / Social Linktree</span>
                        <input 
                          type="text" 
                          value={companySettings.bioLink}
                          onChange={(e) => setCompanySettings({...companySettings, bioLink: e.target.value})}
                          className="mt-1 block w-full bg-gray-50 border-gray-200 rounded-xl px-4 py-3 text-base font-bold focus:ring-brand-yellow focus:border-brand-yellow"
                        />
                      </label>
                    </div>

                    {/* Socials */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-black uppercase tracking-widest text-brand-blue border-l-4 border-brand-yellow pl-3">Social Media</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <label className="block">
                          <span className="text-[10px] font-black uppercase text-gray-400">Facebook URL</span>
                          <input 
                            type="text" 
                            value={companySettings.socials.facebook}
                            onChange={(e) => setCompanySettings({...companySettings, socials: {...companySettings.socials, facebook: e.target.value}})}
                            className="mt-1 block w-full bg-gray-50 border-gray-200 rounded-xl px-3 py-2 text-base font-bold focus:ring-brand-yellow focus:border-brand-yellow"
                          />
                        </label>
                        <label className="block">
                          <span className="text-[10px] font-black uppercase text-gray-400">Instagram URL</span>
                          <input 
                            type="text" 
                            value={companySettings.socials.instagram}
                            onChange={(e) => setCompanySettings({...companySettings, socials: {...companySettings.socials, instagram: e.target.value}})}
                            className="mt-1 block w-full bg-gray-50 border-gray-200 rounded-xl px-3 py-2 text-base font-bold focus:ring-brand-yellow focus:border-brand-yellow"
                          />
                        </label>
                        <label className="block">
                          <span className="text-[10px] font-black uppercase text-gray-400">Twitter URL</span>
                          <input 
                            type="text" 
                            value={companySettings.socials.twitter}
                            onChange={(e) => setCompanySettings({...companySettings, socials: {...companySettings.socials, twitter: e.target.value}})}
                            className="mt-1 block w-full bg-gray-50 border-gray-200 rounded-xl px-3 py-2 text-base font-bold focus:ring-brand-yellow focus:border-brand-yellow"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {adminActiveTab === 'marketing' && (
                  <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-700">
                    <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden">
                       <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                       <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                          <div className="text-center md:text-left space-y-4">
                             <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full backdrop-blur-md border border-white/30 text-[10px] font-black uppercase tracking-widest">
                                <Target className="w-3.5 h-3.5" /> Marketing Central
                             </div>
                             <h2 className="text-[50px] font-black leading-none tracking-tighter uppercase">Potenzia le Vendite</h2>
                             <p className="text-lg font-bold text-white/80 max-w-xl">Gestisci le tue campagne Meta e Google Ads direttamente dal pannello BesPoint.</p>
                          </div>
                          <div className="bg-white/10 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/20 text-center min-w-[280px] shadow-2xl">
                             <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-2">Budget Mensile Allocato</p>
                             <p className="text-5xl font-black">€4.500</p>
                             <div className="mt-4 flex items-center justify-center gap-2 text-green-300 font-bold">
                                <TrendingUp className="w-4 h-4" /> +12% vs mese scorso
                             </div>
                          </div>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                       <div className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-xl space-y-8">
                          <div className="flex items-center gap-4">
                             <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner">
                                <Facebook className="w-7 h-7" />
                             </div>
                             <div>
                                <h3 className="text-2xl font-black text-brand-dark uppercase tracking-tighter leading-none">Meta Ads Manager</h3>
                                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">Facebook & Instagram</p>
                             </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                             <div className="p-6 bg-gray-50 rounded-3xl space-y-1">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Impression</p>
                                <p className="text-2xl font-black text-brand-dark">850k</p>
                             </div>
                             <div className="p-6 bg-gray-50 rounded-3xl space-y-1">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Click</p>
                                <p className="text-2xl font-black text-brand-dark">12.4k</p>
                             </div>
                          </div>
                          <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-indigo-600/20 hover:scale-[1.02] transition-all">Configura Pixel & API</button>
                       </div>

                       <div className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-xl space-y-8">
                          <div className="flex items-center gap-4">
                             <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center shadow-inner">
                                <Share2 className="w-7 h-7" />
                             </div>
                             <div>
                                <h3 className="text-2xl font-black text-brand-dark uppercase tracking-tighter leading-none">Google Ads Center</h3>
                                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">Search & Shopping</p>
                             </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                             <div className="p-6 bg-gray-50 rounded-3xl space-y-1">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">ROAS</p>
                                <p className="text-2xl font-black text-brand-dark">4.2x</p>
                             </div>
                             <div className="p-6 bg-gray-50 rounded-3xl space-y-1">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Conversioni</p>
                                <p className="text-2xl font-black text-brand-dark">342</p>
                             </div>
                          </div>
                          <button className="w-full py-4 bg-red-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-red-600/20 hover:scale-[1.02] transition-all">Collega Merchant Center</button>
                       </div>
                    </div>
                  </div>
                )}

                {adminActiveTab === 'seo' && (
                  <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-700">
                    <div className="flex justify-between items-end">
                       <div>
                          <h2 className="text-[40px] font-black text-brand-dark leading-none tracking-tighter uppercase">SEO & Indicizzazione</h2>
                          <p className="text-sm font-bold text-gray-400 mt-2 uppercase tracking-[0.2em]">Ottimizza la tua visibilità sui motori di ricerca</p>
                       </div>
                       <div className="flex gap-3">
                          <button className="px-6 py-3 bg-brand-yellow text-brand-dark rounded-xl font-black uppercase text-xs tracking-widest shadow-lg">Invia Sitemap</button>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                       <div className="lg:col-span-2 space-y-8">
                          <div className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-xl">
                             <h3 className="text-xl font-black text-brand-dark uppercase tracking-tighter mb-8 flex items-center gap-3">
                                <Globe className="w-6 h-6 text-brand-blue" /> Configurazione Meta Tags Globali
                             </h3>
                             <div className="space-y-6">
                                <div className="space-y-2">
                                   <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Meta Title Default</label>
                                   <input type="text" className="w-full bg-gray-50 border-gray-200 rounded-2xl px-5 py-4 font-bold text-brand-dark shadow-inner" placeholder="BesPoint | Il meglio del tech e della casa" />
                                </div>
                                <div className="space-y-2">
                                   <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Meta Description Default</label>
                                   <textarea className="w-full bg-gray-50 border-gray-200 rounded-2xl px-5 py-4 font-bold text-brand-dark shadow-inner" rows={3}></textarea>
                                </div>
                             </div>
                          </div>

                          <div className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-xl">
                             <h3 className="text-xl font-black text-brand-dark uppercase tracking-tighter mb-8 flex items-center gap-3">
                                <Search className="w-6 h-6 text-brand-blue" /> Generatore Snippet URL Automatioco
                             </h3>
                             <div className="p-8 bg-brand-dark rounded-[2rem] text-white space-y-4">
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Esempio Anteprima Google</p>
                                <p className="text-blue-400 text-sm font-bold">https://bespoint.it/categoria/lampade-led</p>
                                <p className="text-lg font-black leading-tight uppercase">Lampade Led Minimal - BesPoint</p>
                                <p className="text-xs text-gray-400 leading-relaxed">Le migliori lampade led dal design unico... acquista ora su BesPoint con spedizione rapida.</p>
                             </div>
                             <div className="mt-8">
                                <button className="flex items-center gap-2 text-brand-blue font-black uppercase text-[10px] tracking-widest hover:text-brand-dark transition-colors">
                                   <Sparkles className="w-4 h-4" /> Rigenera tutti gli slug del catalogo
                                </button>
                             </div>
                          </div>
                       </div>

                       <div className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-xl space-y-8">
                          <h3 className="text-xl font-black text-brand-dark uppercase tracking-tighter flex items-center gap-3">
                             <Activity className="w-6 h-6 text-green-500" /> Health Check SEO
                          </h3>
                          <div className="space-y-6">
                             {[
                               { label: 'Indice Google', val: '85%', color: 'bg-green-500' },
                               { label: 'Mobile Friendly', val: '100%', color: 'bg-green-500' },
                               { label: 'Pagine Duplicate', val: '0', color: 'bg-blue-500' },
                               { label: 'Link Rotti', val: '3', color: 'bg-orange-500' }
                             ].map((h, i) => (
                               <div key={i} className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-gray-500 uppercase">{h.label}</span>
                                  <div className="flex items-center gap-3">
                                     <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div className={`h-full ${h.color}`} style={{ width: h.val === '100%' ? '100%' : h.val }}></div>
                                     </div>
                                     <span className="text-xs font-black text-brand-dark w-10 text-right">{h.val}</span>
                                  </div>
                               </div>
                             ))}
                          </div>
                          <div className="pt-6 border-t border-gray-50">
                             <p className="text-[9px] font-bold text-gray-400 uppercase italic">Ultima scansione: Oggi, 04:30 AM</p>
                          </div>
                       </div>
                    </div>
                  </div>
                )}

                 {/* Duplicated Tab Removed */}

                {adminActiveTab === 'slides' && (
                  <div className="w-full">
                    <div className="space-y-8">
                    <div className="flex justify-between items-center">
                      <h2 className="text-3xl font-black text-brand-dark uppercase tracking-tighter">GESTIONE SLIDE</h2>
                      <button 
                        onClick={() => {
                          const newSlides: any[] = [];
                          const categories = pageSettings.categories.filter(c => c !== "Tutti");
                          
                          // Only one Top Slide (first category)
                          if (categories.length > 0) {
                            const cat = categories[0];
                            newSlides.push({ 
                              id: `top-${cat}-${Date.now()}`, 
                              url: `https://picsum.photos/seed/${cat.toLowerCase()}-top/1920/1080`, 
                              alt: `Scopri ${cat}`, 
                              title: cat, 
                              link: "", 
                              position: "home_top" 
                            });
                          }

                          categories.forEach(cat => {
                            newSlides.push({ 
                              id: `mid-${cat}-${Date.now()}`, 
                              url: `https://picsum.photos/seed/${cat.toLowerCase()}-mid/1920/600`, 
                              alt: `Offerte ${cat}`, 
                              title: `Specialisti in ${cat}`, 
                              link: "", 
                              position: "home_middle" 
                            });
                            newSlides.push({ 
                              id: `bot-${cat}-${Date.now()}`, 
                              url: `https://picsum.photos/seed/${cat.toLowerCase()}-bot/1920/600`, 
                              alt: `Qualità ${cat}`, 
                              title: `Il meglio di ${cat}`, 
                              link: "", 
                              position: "home_bottom" 
                            });
                          });
                          setPageSettings({ ...pageSettings, homeSlides: newSlides });
                        }}
                        className="bg-brand-blue text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-dark transition-all shadow-lg active:scale-95"
                      >
                        Genera Slide per Categoria
                      </button>
                    </div>

                    {/* Home Slides Management */}
                    <div className="space-y-6">
                                    <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 space-y-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                          <h3 className="text-lg font-black text-brand-dark uppercase tracking-tighter flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-brand-yellow rounded-full"></span>
                            Slide Top (Hero)
                          </h3>
                          
                          <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-100 shadow-inner">
                            <div className="flex items-center">
                              <button 
                                onClick={() => setAdminTopIdx(prev => Math.max(0, prev - 1))}
                                disabled={adminTopIdx === 0}
                                className="p-2 text-brand-dark hover:bg-white rounded-xl transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                              >
                                <ChevronLeft className="w-4 h-4" />
                              </button>
                              <div className="px-3 min-w-[60px] text-center">
                                <span className="text-[10px] font-black text-brand-blue uppercase tracking-widest leading-none">
                                  {adminTopSlides.length > 0 ? `${adminTopIdx + 1} / ${adminTopSlides.length}` : '0 / 0'}
                                </span>
                              </div>
                              <button 
                                onClick={() => setAdminTopIdx(prev => Math.min(adminTopSlides.length - 1, prev + 1))}
                                disabled={adminTopIdx >= adminTopSlides.length - 1 || adminTopSlides.length === 0}
                                className="p-2 text-brand-dark hover:bg-white rounded-xl transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                              >
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </div>
                            
                            <div className="w-px h-6 bg-gray-200 mx-1"></div>
                            
                            <button 
                              onClick={() => {
                                const newId = Date.now().toString();
                                setPageSettings({
                                  ...pageSettings,
                                  homeSlides: [...pageSettings.homeSlides, { id: newId, url: "", alt: "", title: "", link: "", position: "home_top" }]
                                });
                                setAdminTopIdx(adminTopSlides.length);
                              }}
                              className="p-2 bg-brand-yellow text-brand-dark rounded-xl hover:shadow-md transition-all active:scale-90"
                              title="Aggiungi Slide"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                            
                            {adminTopSlides.length > 0 && (
                              <button 
                                onClick={() => setSlideToDelete({ id: adminTopSlides[adminTopIdx].id, type: 'Slide Top', position: 'home_top' })}
                                className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all active:scale-90 shadow-sm"
                                title="Elimina Slide Corrente"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-4">
                          {adminTopSlides.length === 0 ? (
                            <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50/30">
                              <Compass className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                              <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Nessuna slide top configurata</p>
                              <button 
                                onClick={() => {
                                  const newId = Date.now().toString();
                                  setPageSettings({
                                    ...pageSettings,
                                    homeSlides: [...pageSettings.homeSlides, { id: newId, url: "", alt: "", title: "", link: "", position: "home_top" }]
                                  });
                                  setAdminTopIdx(0);
                                }}
                                className="mt-4 text-[10px] font-black uppercase tracking-widest text-brand-blue border-b border-brand-blue"
                              >
                                Crea la prima slide
                              </button>
                            </div>
                          ) : (
                            <div key={adminTopSlides[adminTopIdx]?.id} className="bg-gray-50 p-6 rounded-3xl border border-gray-100 animate-in fade-in slide-in-from-right-2 duration-300">
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                  <div className="space-y-1.5">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Sorgente Immagine</label>
                                    <div className="flex gap-2">
                                      <input 
                                        type="text" 
                                        value={adminTopSlides[adminTopIdx]?.url || ""}
                                        onChange={(e) => {
                                          const slideId = adminTopSlides[adminTopIdx].id;
                                          setPageSettings({
                                            ...pageSettings,
                                            homeSlides: pageSettings.homeSlides.map((s: any) => s.id === slideId ? { ...s, url: e.target.value } : s)
                                          });
                                        }}
                                        className="flex-1 bg-white border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-brand-blue focus:border-brand-blue shadow-sm"
                                        placeholder="https://..."
                                      />
                                      <label className="cursor-pointer bg-white border border-gray-200 p-3 rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
                                        <Upload className="w-5 h-5 text-brand-blue" />
                                        <input 
                                          type="file" 
                                          className="hidden" 
                                          accept="image/*"
                                          onChange={(e) => handleFileChange(e, (url) => {
                                            const slideId = adminTopSlides[adminTopIdx].id;
                                            setPageSettings({
                                              ...pageSettings,
                                              homeSlides: pageSettings.homeSlides.map((s: any) => s.id === slideId ? { ...s, url: url } : s)
                                            });
                                          })}
                                        />
                                      </label>
                                    </div>
                                  </div>
                                  <div className="space-y-1.5">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Link Destinazione</label>
                                    <input 
                                      type="text" 
                                      value={adminTopSlides[adminTopIdx]?.link || ""}
                                      onChange={(e) => {
                                        const slideId = adminTopSlides[adminTopIdx].id;
                                        setPageSettings({
                                          ...pageSettings,
                                          homeSlides: pageSettings.homeSlides.map((s: any) => s.id === slideId ? { ...s, link: e.target.value } : s)
                                        });
                                      }}
                                      className="w-full bg-white border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-brand-blue focus:border-brand-blue shadow-sm"
                                      placeholder="/categoria/..."
                                    />
                                  </div>
                                </div>
                                <div className="space-y-4">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                      <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Titolo SEO</label>
                                      <input 
                                        type="text" 
                                        value={adminTopSlides[adminTopIdx]?.title || ""}
                                        onChange={(e) => {
                                          const slideId = adminTopSlides[adminTopIdx].id;
                                          setPageSettings({
                                            ...pageSettings,
                                            homeSlides: pageSettings.homeSlides.map((s: any) => s.id === slideId ? { ...s, title: e.target.value } : s)
                                          });
                                        }}
                                        className="w-full bg-white border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-brand-blue focus:border-brand-blue shadow-sm"
                                      />
                                    </div>
                                    <div className="space-y-1.5">
                                      <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Alt Text SEO</label>
                                      <input 
                                        type="text" 
                                        value={adminTopSlides[adminTopIdx]?.alt || ""}
                                        onChange={(e) => {
                                          const slideId = adminTopSlides[adminTopIdx].id;
                                          setPageSettings({
                                            ...pageSettings,
                                            homeSlides: pageSettings.homeSlides.map((s: any) => s.id === slideId ? { ...s, alt: e.target.value } : s)
                                          });
                                        }}
                                        className="w-full bg-white border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-brand-blue focus:border-brand-blue shadow-sm"
                                      />
                                    </div>
                                  </div>
                                  {adminTopSlides[adminTopIdx]?.url && (
                                    <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-white shadow-lg bg-white group-hover:scale-[1.01] transition-transform">
                                      <img src={adminTopSlides[adminTopIdx].url} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        }
                      </div>
                    </div>

                    {/* MIDDLE SLIDES */}
                      <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 space-y-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                          <h3 className="text-lg font-black text-brand-dark uppercase tracking-tighter flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-brand-blue rounded-full"></span>
                            Slide Middle
                          </h3>
                          
                          <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-100 shadow-inner">
                            <div className="flex items-center">
                              <button 
                                onClick={() => setAdminMidIdx(prev => Math.max(0, prev - 1))}
                                disabled={adminMidIdx === 0}
                                className="p-2 text-brand-dark hover:bg-white rounded-xl transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                              >
                                <ChevronLeft className="w-4 h-4" />
                              </button>
                              <div className="px-3 min-w-[60px] text-center">
                                <span className="text-[10px] font-black text-brand-blue uppercase tracking-widest leading-none">
                                  {adminMidSlides.length > 0 ? `${adminMidIdx + 1} / ${adminMidSlides.length}` : '0 / 0'}
                                </span>
                              </div>
                              <button 
                                onClick={() => setAdminMidIdx(prev => Math.min(adminMidSlides.length - 1, prev + 1))}
                                disabled={adminMidIdx >= adminMidSlides.length - 1 || adminMidSlides.length === 0}
                                className="p-2 text-brand-dark hover:bg-white rounded-xl transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                              >
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </div>
                            
                            <div className="w-px h-6 bg-gray-200 mx-1"></div>
                            
                            <button 
                              onClick={() => {
                                const newId = Date.now().toString();
                                setPageSettings({
                                  ...pageSettings,
                                  homeSlides: [...pageSettings.homeSlides, { id: newId, url: "", alt: "", title: "", link: "", position: "home_middle" }]
                                });
                                setAdminMidIdx(adminMidSlides.length);
                              }}
                              className="p-2 bg-brand-yellow text-brand-dark rounded-xl hover:shadow-md transition-all active:scale-90"
                              title="Aggiungi Slide"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                            
                            {adminMidSlides.length > 0 && (
                              <button 
                                onClick={() => setSlideToDelete({ id: adminMidSlides[adminMidIdx].id, type: 'Slide Middle', position: 'home_middle' })}
                                className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all active:scale-90 shadow-sm"
                                title="Elimina Slide Corrente"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-4">
                          {adminMidSlides.length === 0 ? (
                            <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50/30">
                              <Compass className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                              <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Nessuna slide middle configurata</p>
                            </div>
                          ) : (
                            <div key={adminMidSlides[adminMidIdx]?.id} className="bg-gray-50 p-6 rounded-3xl border border-gray-100 animate-in fade-in slide-in-from-right-2 duration-300">
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                  <div className="space-y-1.5">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Sorgente Immagine</label>
                                    <div className="flex gap-2">
                                      <input 
                                        type="text" 
                                        value={adminMidSlides[adminMidIdx]?.url || ""}
                                        onChange={(e) => {
                                          const slideId = adminMidSlides[adminMidIdx].id;
                                          setPageSettings({
                                            ...pageSettings,
                                            homeSlides: pageSettings.homeSlides.map((s: any) => s.id === slideId ? { ...s, url: e.target.value } : s)
                                          });
                                          }}
                                        className="flex-1 bg-white border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-brand-blue focus:border-brand-blue shadow-sm"
                                        placeholder="https://..."
                                      />
                                      <label className="cursor-pointer bg-white border border-gray-200 p-3 rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
                                        <Upload className="w-5 h-5 text-brand-blue" />
                                        <input 
                                          type="file" 
                                          className="hidden" 
                                          accept="image/*"
                                          onChange={(e) => handleFileChange(e, (url) => {
                                            const slideId = adminMidSlides[adminMidIdx].id;
                                            setPageSettings({
                                              ...pageSettings,
                                              homeSlides: pageSettings.homeSlides.map((s: any) => s.id === slideId ? { ...s, url: url } : s)
                                            });
                                          })}
                                        />
                                      </label>
                                    </div>
                                  </div>
                                  <div className="space-y-1.5">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Link Destinazione</label>
                                    <input 
                                      type="text" 
                                      value={adminMidSlides[adminMidIdx]?.link || ""}
                                      onChange={(e) => {
                                        const slideId = adminMidSlides[adminMidIdx].id;
                                        setPageSettings({
                                          ...pageSettings,
                                          homeSlides: pageSettings.homeSlides.map((s: any) => s.id === slideId ? { ...s, link: e.target.value } : s)
                                        });
                                      }}
                                      className="w-full bg-white border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-brand-blue focus:border-brand-blue shadow-sm"
                                      placeholder="/categoria/..."
                                    />
                                  </div>
                                </div>
                                <div className="space-y-4">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                      <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Titolo SEO</label>
                                      <input 
                                        type="text" 
                                        value={adminMidSlides[adminMidIdx]?.title || ""}
                                        onChange={(e) => {
                                          const slideId = adminMidSlides[adminMidIdx].id;
                                          setPageSettings({
                                            ...pageSettings,
                                            homeSlides: pageSettings.homeSlides.map((s: any) => s.id === slideId ? { ...s, title: e.target.value } : s)
                                          });
                                        }}
                                        className="w-full bg-white border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-brand-blue focus:border-brand-blue shadow-sm"
                                      />
                                    </div>
                                    <div className="space-y-1.5">
                                      <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Alt Text SEO</label>
                                      <input 
                                        type="text" 
                                        value={adminMidSlides[adminMidIdx]?.alt || ""}
                                        onChange={(e) => {
                                          const slideId = adminMidSlides[adminMidIdx].id;
                                          setPageSettings({
                                            ...pageSettings,
                                            homeSlides: pageSettings.homeSlides.map((s: any) => s.id === slideId ? { ...s, alt: e.target.value } : s)
                                          });
                                        }}
                                        className="w-full bg-white border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-brand-blue focus:border-brand-blue shadow-sm"
                                      />
                                    </div>
                                  </div>
                                  {adminMidSlides[adminMidIdx]?.url && (
                                    <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-white shadow-lg bg-white group-hover:scale-[1.01] transition-transform">
                                      <img src={adminMidSlides[adminMidIdx].url} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            )
                          }
                        </div>
                      </div>

                      {/* BOTTOM SLIDES */}
                      <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 space-y-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                          <h3 className="text-lg font-black text-brand-dark uppercase tracking-tighter flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-red-500 rounded-full"></span>
                            Slide Bottom
                          </h3>
                          
                          <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-100 shadow-inner">
                            <div className="flex items-center">
                              <button 
                                onClick={() => setAdminBotIdx(prev => Math.max(0, prev - 1))}
                                disabled={adminBotIdx === 0}
                                className="p-2 text-brand-dark hover:bg-white rounded-xl transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                              >
                                <ChevronLeft className="w-4 h-4" />
                              </button>
                              <div className="px-3 min-w-[60px] text-center">
                                <span className="text-[10px] font-black text-brand-blue uppercase tracking-widest leading-none">
                                  {adminBotSlides.length > 0 ? `${adminBotIdx + 1} / ${adminBotSlides.length}` : '0 / 0'}
                                </span>
                              </div>
                              <button 
                                onClick={() => setAdminBotIdx(prev => Math.min(adminBotSlides.length - 1, prev + 1))}
                                disabled={adminBotIdx >= adminBotSlides.length - 1 || adminBotSlides.length === 0}
                                className="p-2 text-brand-dark hover:bg-white rounded-xl transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                              >
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </div>
                            
                            <div className="w-px h-6 bg-gray-200 mx-1"></div>
                            
                            <button 
                              onClick={() => {
                                const newId = Date.now().toString();
                                setPageSettings({
                                  ...pageSettings,
                                  homeSlides: [...pageSettings.homeSlides, { id: newId, url: "", alt: "", title: "", link: "", position: "home_bottom" }]
                                });
                                setAdminBotIdx(adminBotSlides.length);
                              }}
                              className="p-2 bg-brand-yellow text-brand-dark rounded-xl hover:shadow-md transition-all active:scale-90"
                              title="Aggiungi Slide"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                            
                            {adminBotSlides.length > 0 && (
                              <button 
                                onClick={() => setSlideToDelete({ id: adminBotSlides[adminBotIdx].id, type: 'Slide Bottom', position: 'home_bottom' })}
                                className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all active:scale-90 shadow-sm"
                                title="Elimina Slide Corrente"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-4">
                          {adminBotSlides.length === 0 ? (
                            <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50/30">
                              <Compass className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                              <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Nessuna slide bottom configurata</p>
                            </div>
                          ) : (
                            <div key={adminBotSlides[adminBotIdx]?.id} className="bg-gray-50 p-6 rounded-3xl border border-gray-100 animate-in fade-in slide-in-from-right-2 duration-300">
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                  <div className="space-y-1.5">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Sorgente Immagine</label>
                                    <div className="flex gap-2">
                                      <input 
                                        type="text" 
                                        value={adminBotSlides[adminBotIdx]?.url || ""}
                                        onChange={(e) => {
                                          const slideId = adminBotSlides[adminBotIdx].id;
                                          setPageSettings({
                                            ...pageSettings,
                                            homeSlides: pageSettings.homeSlides.map((s: any) => s.id === slideId ? { ...s, url: e.target.value } : s)
                                          });
                                          }}
                                        className="flex-1 bg-white border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-brand-blue focus:border-brand-blue shadow-sm"
                                        placeholder="https://..."
                                      />
                                      <label className="cursor-pointer bg-white border border-gray-200 p-3 rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
                                        <Upload className="w-5 h-5 text-brand-blue" />
                                        <input 
                                          type="file" 
                                          className="hidden" 
                                          accept="image/*"
                                          onChange={(e) => handleFileChange(e, (url) => {
                                            const slideId = adminBotSlides[adminBotIdx].id;
                                            setPageSettings({
                                              ...pageSettings,
                                              homeSlides: pageSettings.homeSlides.map((s: any) => s.id === slideId ? { ...s, url: url } : s)
                                            });
                                          })}
                                        />
                                      </label>
                                    </div>
                                  </div>
                                  <div className="space-y-1.5">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Link Destinazione</label>
                                    <input 
                                      type="text" 
                                      value={adminBotSlides[adminBotIdx]?.link || ""}
                                      onChange={(e) => {
                                        const slideId = adminBotSlides[adminBotIdx].id;
                                        setPageSettings({
                                          ...pageSettings,
                                          homeSlides: pageSettings.homeSlides.map((s: any) => s.id === slideId ? { ...s, link: e.target.value } : s)
                                        });
                                      }}
                                      className="w-full bg-white border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-brand-blue focus:border-brand-blue shadow-sm"
                                      placeholder="/categoria/..."
                                    />
                                  </div>
                                </div>
                                <div className="space-y-4">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                      <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Titolo SEO</label>
                                      <input 
                                        type="text" 
                                        value={adminBotSlides[adminBotIdx]?.title || ""}
                                        onChange={(e) => {
                                          const slideId = adminBotSlides[adminBotIdx].id;
                                          setPageSettings({
                                            ...pageSettings,
                                            homeSlides: pageSettings.homeSlides.map((s: any) => s.id === slideId ? { ...s, title: e.target.value } : s)
                                          });
                                        }}
                                        className="w-full bg-white border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-brand-blue focus:border-brand-blue shadow-sm"
                                      />
                                    </div>
                                    <div className="space-y-1.5">
                                      <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Alt Text SEO</label>
                                      <input 
                                        type="text" 
                                        value={adminBotSlides[adminBotIdx]?.alt || ""}
                                        onChange={(e) => {
                                          const slideId = adminBotSlides[adminBotIdx].id;
                                          setPageSettings({
                                            ...pageSettings,
                                            homeSlides: pageSettings.homeSlides.map((s: any) => s.id === slideId ? { ...s, alt: e.target.value } : s)
                                          });
                                        }}
                                        className="w-full bg-white border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-brand-blue focus:border-brand-blue shadow-sm"
                                      />
                                    </div>
                                  </div>
                                  {adminBotSlides[adminBotIdx]?.url && (
                                    <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-white shadow-lg bg-white group-hover:scale-[1.01] transition-transform">
                                      <img src={adminBotSlides[adminBotIdx].url} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            )
                          }
                        </div>
                      </div>

                    <div className="space-y-5">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-blue border-l-4 border-brand-yellow pl-3">Banner Categorie</h4>
                      <div className="grid grid-cols-1 gap-4">
                        {Object.keys(pageSettings.categoryBanners).map((catName) => (
                          <div key={catName} className="bg-gray-50 p-5 rounded-2xl border border-gray-100 group hover:border-brand-yellow transition-all">
                            <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
                              <h5 className="text-[10px] font-black text-brand-dark uppercase tracking-widest flex items-center gap-2">
                                <span className="w-1 h-4 bg-brand-yellow rounded-full"></span>
                                {catName}
                              </h5>
                              <span className="text-[8px] font-black uppercase bg-brand-yellow/20 text-brand-dark px-2 py-1 rounded-md">
                                Banner Home Categoria
                              </span>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                              <div className="space-y-3">
                                <div className="space-y-1">
                                  <div className="flex items-center justify-between ml-1">
                                    <span className="text-[8px] font-black uppercase text-gray-400">Sorgente Immagine</span>
                                    <div className="flex gap-2">
                                      <label className="cursor-pointer flex items-center gap-1 text-[8px] font-black uppercase text-brand-blue hover:text-brand-dark transition-colors">
                                        <Upload className="w-2.5 h-2.5" />
                                        <span>Carica</span>
                                        <input 
                                          type="file" 
                                          accept="image/*"
                                          className="hidden"
                                          onChange={(e) => handleFileChange(e, (url) => {
                                            setPageSettings({
                                              ...pageSettings,
                                              categoryBanners: {
                                                ...pageSettings.categoryBanners,
                                                [catName]: { ...pageSettings.categoryBanners[catName], url: url }
                                              }
                                            });
                                          })}
                                        />
                                      </label>
                                      <label className="cursor-pointer flex items-center gap-1 text-[8px] font-black uppercase text-brand-blue hover:text-brand-dark transition-colors">
                                        <Camera className="w-2.5 h-2.5" />
                                        <span>Foto</span>
                                        <input 
                                          type="file" 
                                          accept="image/*"
                                          capture="environment"
                                          className="hidden"
                                          onChange={(e) => handleFileChange(e, (url) => {
                                            setPageSettings({
                                              ...pageSettings,
                                              categoryBanners: {
                                                ...pageSettings.categoryBanners,
                                                [catName]: { ...pageSettings.categoryBanners[catName], url: url }
                                              }
                                            });
                                          })}
                                        />
                                      </label>
                                    </div>
                                  </div>
                                  <input 
                                    type="text" 
                                    value={pageSettings.categoryBanners[catName].url}
                                    onChange={(e) => setPageSettings({
                                      ...pageSettings,
                                      categoryBanners: {
                                        ...pageSettings.categoryBanners,
                                        [catName]: { ...pageSettings.categoryBanners[catName], url: e.target.value }
                                      }
                                    })}
                                    placeholder="https://..."
                                    className="block w-full bg-white border-gray-200 rounded-lg px-3 py-2 text-xs font-bold focus:ring-brand-yellow focus:border-brand-yellow shadow-sm"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[8px] font-black uppercase tracking-widest text-gray-400 ml-1">Link Destinazione (Opzionale)</label>
                                  <input 
                                    type="text" 
                                    value={pageSettings.categoryBanners[catName].link || ""}
                                    onChange={(e) => setPageSettings({
                                      ...pageSettings,
                                      categoryBanners: {
                                        ...pageSettings.categoryBanners,
                                        [catName]: { ...pageSettings.categoryBanners[catName], link: e.target.value }
                                      }
                                    })}
                                    className="block w-full bg-white border-gray-200 rounded-lg px-3 py-2 text-xs font-bold focus:ring-brand-yellow focus:border-brand-yellow shadow-sm"
                                    placeholder="/categoria/..."
                                  />
                                </div>
                              </div>

                              <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="space-y-1">
                                    <label className="text-[8px] font-black uppercase tracking-widest text-gray-400 ml-1">Titolo SEO</label>
                                    <input 
                                      type="text" 
                                      value={pageSettings.categoryBanners[catName].title}
                                      onChange={(e) => setPageSettings({
                                        ...pageSettings,
                                        categoryBanners: {
                                          ...pageSettings.categoryBanners,
                                          [catName]: { ...pageSettings.categoryBanners[catName], title: e.target.value }
                                        }
                                      })}
                                      className="block w-full bg-white border-gray-200 rounded-lg px-3 py-2 text-xs font-bold focus:ring-brand-yellow focus:border-brand-yellow shadow-sm"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[8px] font-black uppercase tracking-widest text-gray-400 ml-1">Alt Text SEO</label>
                                    <input 
                                      type="text" 
                                      value={pageSettings.categoryBanners[catName].alt}
                                      onChange={(e) => setPageSettings({
                                        ...pageSettings,
                                        categoryBanners: {
                                          ...pageSettings.categoryBanners,
                                          [catName]: { ...pageSettings.categoryBanners[catName], alt: e.target.value }
                                        }
                                      })}
                                      className="block w-full bg-white border-gray-200 rounded-lg px-3 py-2 text-xs font-bold focus:ring-brand-yellow focus:border-brand-yellow shadow-sm"
                                    />
                                  </div>
                                </div>
                                {pageSettings.categoryBanners[catName].url && (
                                  <div className="w-full h-24 rounded-2xl overflow-hidden border-2 border-gray-100 bg-white group-hover:scale-[1.02] transition-transform shadow-sm">
                                    <img src={pageSettings.categoryBanners[catName].url} className="w-full h-full object-cover" />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              {adminActiveTab === 'categories' && (
                  <div className="space-y-8">
                    <div className="flex justify-between items-center">
                      <h2 className="text-3xl font-black text-brand-dark uppercase tracking-tighter">Gestione Categorie</h2>
                      <div className="flex gap-2 items-center">
                        <button 
                          onClick={handleAiSuggest}
                          disabled={isAiSuggesting}
                          className="bg-brand-blue text-white px-4 py-2 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-brand-dark transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
                        >
                          {isAiSuggesting ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />} 
                          Suggerimento AI
                        </button>
                        {!isAddingCategory ? (
                          <button 
                            onClick={() => setIsAddingCategory(true)}
                            className="bg-brand-yellow text-brand-dark px-4 py-2 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-brand-orange transition-all shadow-md flex items-center gap-2"
                          >
                            <Plus className="w-3 h-3" /> Aggiungi Categoria
                          </button>
                        ) : (
                          <div className="flex gap-2 items-center">
                            <input 
                              type="text"
                              placeholder="Nome categoria..."
                              value={newCategoryName}
                              onChange={(e) => setNewCategoryName(e.target.value)}
                              className="bg-white border-gray-200 rounded-lg px-3 py-1.5 text-base font-bold focus:ring-brand-yellow focus:border-brand-yellow"
                              autoFocus
                            />
                            <button 
                              onClick={() => {
                                if (newCategoryName && !pageSettings.categories.includes(newCategoryName)) {
                                  setPageSettings({
                                    ...pageSettings,
                                    categories: [...pageSettings.categories, newCategoryName],
                                    subcategories: { ...pageSettings.subcategories, [newCategoryName]: [] },
                                    categoryBanners: { ...pageSettings.categoryBanners, [newCategoryName]: { url: '', alt: '', title: '', link: '' } }
                                  });
                                  setNewCategoryName("");
                                  setIsAddingCategory(false);
                                }
                              }}
                              className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => {
                                setIsAddingCategory(false);
                                setNewCategoryName("");
                              }}
                              className="p-2 bg-gray-100 text-gray-500 rounded-lg hover:bg-gray-200 transition-all"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {aiSuggestions && (
                      <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-brand-yellow/10 p-6 rounded-2xl border-2 border-brand-yellow/30 space-y-4"
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-brand-yellow" />
                            <h3 className="font-black text-brand-dark uppercase tracking-tight">Suggerimenti AI</h3>
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => {
                                setPageSettings({
                                  ...pageSettings,
                                  categories: aiSuggestions.categories,
                                  subcategories: aiSuggestions.subcategories,
                                  categoryBanners: aiSuggestions.categories.filter(c => c !== "Tutti").reduce((acc, cat) => ({
                                    ...acc,
                                    [cat]: pageSettings.categoryBanners[cat] || { url: '', alt: '', title: '', link: '' }
                                  }), {})
                                });
                                setAiSuggestions(null);
                              }}
                              className="bg-brand-yellow text-brand-dark px-4 py-2 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-brand-orange transition-all shadow-md"
                            >
                              Applica Tutto
                            </button>
                            <button 
                              onClick={() => setAiSuggestions(null)}
                              className="bg-white text-gray-400 px-4 py-2 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-gray-50 transition-all border border-gray-100"
                            >
                              Ignora
                            </button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {aiSuggestions.categories.filter(c => c !== "Tutti").map(cat => (
                            <div key={cat} className="bg-white/50 p-3 rounded-xl border border-brand-yellow/20">
                              <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-brand-yellow" />
                                <p className="font-black text-xs text-brand-dark uppercase">{cat}</p>
                              </div>
                              <div className="mt-2 pl-4 flex flex-wrap gap-1 border-l border-brand-yellow/10 ml-0.5">
                                {aiSuggestions.subcategories[cat]?.map(sub => (
                                  <span key={sub} className="text-[9px] font-bold bg-brand-yellow/20 text-brand-dark px-2 py-0.5 rounded-full">{sub}</span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                      <div className="divide-y divide-gray-50">
                        {pageSettings.categories.filter(c => c !== "Tutti").map((cat) => (
                          <div key={cat} className="group">
                            {/* Category Row */}
                            <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                              <div className="flex items-center gap-3">
                                <ChevronDown className="w-4 h-4 text-gray-300" />
                                <div className="w-8 h-8 bg-brand-yellow/10 rounded-lg flex items-center justify-center text-brand-dark">
                                  <Grid className="w-4 h-4" />
                                </div>
                                <h3 className="text-sm font-black text-brand-dark uppercase tracking-tight">{cat}</h3>
                                <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                                  {(pageSettings.subcategories[cat] || []).length} Sottocategorie
                                </span>
                              </div>
                              
                              <div className="flex gap-2 items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                {addingSubcategoryTo === cat ? (
                                  <div className="flex gap-1 items-center mr-2">
                                    <input 
                                      type="text"
                                      placeholder="Nuova sottocategoria..."
                                      value={newSubcategoryName}
                                      onChange={(e) => setNewSubcategoryName(e.target.value)}
                                      className="bg-white border-gray-200 rounded-lg px-2 py-1 text-base font-bold focus:ring-brand-yellow focus:border-brand-yellow w-48"
                                      autoFocus
                                    />
                                    <button 
                                      onClick={() => {
                                        if (newSubcategoryName && !pageSettings.subcategories[cat]?.includes(newSubcategoryName)) {
                                          setPageSettings({
                                            ...pageSettings,
                                            subcategories: {
                                              ...pageSettings.subcategories,
                                              [cat]: [...(pageSettings.subcategories[cat] || []), newSubcategoryName]
                                            }
                                          });
                                          setNewSubcategoryName("");
                                          setAddingSubcategoryTo(null);
                                        }
                                      }}
                                      className="p-1.5 bg-green-500 text-white rounded-md hover:bg-green-600 transition-all"
                                    >
                                      <Check className="w-3 h-3" />
                                    </button>
                                    <button 
                                      onClick={() => {
                                        setAddingSubcategoryTo(null);
                                        setNewSubcategoryName("");
                                      }}
                                      className="p-1.5 bg-gray-100 text-gray-500 rounded-md hover:bg-gray-200 transition-all"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                ) : (
                                  <button 
                                    onClick={() => setAddingSubcategoryTo(cat)}
                                    className="p-2 text-gray-400 hover:text-brand-dark hover:bg-brand-yellow/20 rounded-lg transition-all"
                                    title="Aggiungi Sottocategoria"
                                  >
                                    <Plus className="w-4 h-4" />
                                  </button>
                                )}
                                
                                {categoryToDelete === cat ? (
                                  <div className="flex gap-1 items-center">
                                    <span className="text-[10px] font-bold text-red-500 mr-1">Confermi?</span>
                                    <button 
                                      onClick={() => {
                                        const { [cat]: removedSub, ...remainingSubs } = pageSettings.subcategories;
                                        const { [cat]: removedBanner, ...remainingBanners } = pageSettings.categoryBanners;
                                        setPageSettings({
                                          ...pageSettings,
                                          categories: pageSettings.categories.filter(c => c !== cat),
                                          subcategories: remainingSubs,
                                          categoryBanners: remainingBanners
                                        });
                                        setCategoryToDelete(null);
                                      }}
                                      className="p-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all"
                                    >
                                      <Check className="w-3 h-3" />
                                    </button>
                                    <button 
                                      onClick={() => setCategoryToDelete(null)}
                                      className="p-1.5 bg-gray-100 text-gray-500 rounded-md hover:bg-gray-200 transition-all"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                ) : (
                                  <button 
                                    onClick={() => setCategoryToDelete(cat)}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                    title="Elimina Categoria"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Subcategories List (Vertical Tree) */}
                            <div className="bg-gray-50/50 pl-14 pr-4 py-2 space-y-1">
                              {(pageSettings.subcategories[cat] || []).map((sub) => (
                                <div key={sub} className="flex items-center justify-between py-1.5 group/sub">
                                  <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                                    <span className="text-xs font-bold text-gray-600">{sub}</span>
                                  </div>
                                  <button 
                                    onClick={() => {
                                      setPageSettings({
                                        ...pageSettings,
                                        subcategories: {
                                          ...pageSettings.subcategories,
                                          [cat]: pageSettings.subcategories[cat].filter(s => s !== sub)
                                        }
                                      });
                                    }}
                                    className="p-1 text-gray-300 hover:text-red-500 opacity-0 group-hover/sub:opacity-100 transition-all"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                              {(!pageSettings.subcategories[cat] || pageSettings.subcategories[cat].length === 0) && (
                                <p className="text-[10px] font-bold text-gray-400 italic py-2">Nessuna sottocategoria configurata</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {adminActiveTab === ('link_rapidi' as any) && (
                  <div className="space-y-8">
                    <div className="flex justify-between items-center">
                      <h2 className="text-3xl font-black text-brand-dark uppercase tracking-tighter">Link Rapidi (Promo Box)</h2>
                      <button 
                        onClick={() => {
                          const newId = Date.now().toString();
                          setPageSettings({
                            ...pageSettings,
                            linkRapidi: [...(pageSettings.linkRapidi || []), { 
                              id: newId, 
                              title: "Nuovo Link", 
                              subtitle: "Sottotitolo", 
                              color: "bg-brand-blue", 
                              seed: "new-" + newId,
                              category: "Tutti",
                              subcategory: "Tutti"
                            }]
                          });
                        }}
                        className="bg-brand-yellow text-brand-dark px-4 py-2 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-brand-orange transition-all shadow-md flex items-center gap-2"
                      >
                        <Plus className="w-3 h-3" /> Aggiungi Box
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {(pageSettings.linkRapidi || []).map((item: any, idx: number) => (
                        <div key={item.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 space-y-4 hover:shadow-xl transition-all group overflow-hidden">
                          <div className="flex justify-between items-start">
                            <div className={`${item.color} w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg`}>
                              <Box className="w-6 h-6 text-white" />
                            </div>
                            <button 
                              onClick={() => {
                                setPageSettings({
                                  ...pageSettings,
                                  linkRapidi: pageSettings.linkRapidi.filter((l: any) => l.id !== item.id)
                                });
                              }}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="space-y-3">
                            <label className="block">
                              <span className="text-[10px] font-black uppercase text-gray-400 ml-1">Titolo</span>
                              <input 
                                type="text"
                                value={item.title}
                                onChange={(e) => {
                                  const newLinks = [...pageSettings.linkRapidi];
                                  newLinks[idx] = { ...item, title: e.target.value };
                                  setPageSettings({ ...pageSettings, linkRapidi: newLinks });
                                }}
                                className="mt-1 block w-full bg-gray-50 border-transparent rounded-xl px-4 py-2 text-sm font-bold focus:ring-brand-yellow focus:bg-white"
                              />
                            </label>

                            <label className="block">
                              <span className="text-[10px] font-black uppercase text-gray-400 ml-1">Sottotitolo</span>
                              <input 
                                type="text"
                                value={item.subtitle}
                                onChange={(e) => {
                                  const newLinks = [...(pageSettings.linkRapidi || [])];
                                  newLinks[idx] = { ...item, subtitle: e.target.value };
                                  setPageSettings({ ...pageSettings, linkRapidi: newLinks });
                                }}
                                className="mt-1 block w-full bg-gray-50 border-transparent rounded-xl px-4 py-2 text-sm font-bold focus:ring-brand-yellow focus:bg-white"
                              />
                            </label>

                            <div className="grid grid-cols-2 gap-2">
                              <label className="block">
                                <span className="text-[10px] font-black uppercase text-gray-400 ml-1">Categoria Filtro</span>
                                <select 
                                  value={item.category}
                                  onChange={(e) => {
                                    const newLinks = [...(pageSettings.linkRapidi || [])];
                                    newLinks[idx] = { ...item, category: e.target.value, subcategory: "Tutti" };
                                    setPageSettings({ ...pageSettings, linkRapidi: newLinks });
                                  }}
                                  className="mt-1 block w-full bg-gray-50 border-transparent rounded-xl px-4 py-2 text-xs font-bold focus:ring-brand-yellow"
                                >
                                  {pageSettings.categories.map((c: string) => <option key={c} value={c}>{c}</option>)}
                                </select>
                              </label>

                              <label className="block">
                                <span className="text-[10px] font-black uppercase text-gray-400 ml-1">Sottocategoria</span>
                                <select 
                                  value={item.subcategory}
                                  onChange={(e) => {
                                    const newLinks = [...(pageSettings.linkRapidi || [])];
                                    newLinks[idx] = { ...item, subcategory: e.target.value };
                                    setPageSettings({ ...pageSettings, linkRapidi: newLinks });
                                  }}
                                  className="mt-1 block w-full bg-gray-50 border-transparent rounded-xl px-4 py-2 text-xs font-bold focus:ring-brand-yellow"
                                >
                                  <option value="Tutti">Tutti</option>
                                  {(pageSettings.subcategories[item.category] || []).map((s: string) => <option key={s} value={s}>{s}</option>)}
                                </select>
                              </label>
                            </div>

                            <div className="pt-2">
                              <span className="text-[10px] font-black uppercase text-gray-400 ml-1">Colore Background</span>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {["bg-brand-blue", "bg-brand-yellow", "bg-red-500", "bg-green-600", "bg-purple-600", "bg-orange-500", "bg-indigo-600", "bg-gray-800"].map(color => (
                                  <button 
                                    key={color}
                                    onClick={() => {
                                      const newLinks = [...pageSettings.linkRapidi];
                                      newLinks[idx] = { ...item, color: color };
                                      setPageSettings({ ...pageSettings, linkRapidi: newLinks });
                                    }}
                                    className={`w-6 h-6 rounded-full ${color} border-2 ${item.color === color ? 'border-brand-dark' : 'border-white'} shadow-sm`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {adminActiveTab === 'seo' && (
                  <div className="space-y-8">
                    <h2 className="text-3xl font-black text-brand-dark uppercase tracking-tighter">Configurazione SEO</h2>
                    
                    <div className="grid grid-cols-1 gap-6">
                      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                        <div className="space-y-4">
                          <h3 className="text-lg font-black text-brand-dark uppercase tracking-tighter flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-brand-yellow rounded-full"></span>
                            Meta Tag Globali
                          </h3>
                          <div className="grid grid-cols-1 gap-4">
                            <label className="block">
                              <span className="text-[10px] font-black uppercase text-gray-400 ml-1">Meta Title Principale</span>
                              <input 
                                type="text" 
                                value={companySettings.name}
                                onChange={(e) => setCompanySettings({...companySettings, name: e.target.value})}
                                className="mt-1 block w-full bg-gray-50 border-gray-200 rounded-xl px-4 py-3 text-base font-bold focus:ring-brand-yellow focus:border-brand-yellow"
                                placeholder="Titolo del sito per Google"
                              />
                            </label>
                            <label className="block">
                              <span className="text-[10px] font-black uppercase text-gray-400 ml-1">Meta Description</span>
                              <textarea 
                                rows={4}
                                value={companySettings.mission}
                                onChange={(e) => setCompanySettings({...companySettings, mission: e.target.value})}
                                className="mt-1 block w-full bg-gray-50 border-gray-200 rounded-xl px-4 py-3 text-base font-bold focus:ring-brand-yellow focus:border-brand-yellow"
                                placeholder="Descrizione del sito per i motori di ricerca"
                              />
                            </label>
                          </div>
                        </div>

                        <div className="pt-6 border-t border-gray-50 space-y-4">
                          <h3 className="text-lg font-black text-brand-dark uppercase tracking-tighter flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-brand-blue rounded-full"></span>
                            Parole Chiave (Keywords)
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {["E-commerce", "Moda", "Tecnologia", "Casa", "Sport"].map(tag => (
                              <span key={tag} className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-xs font-bold border border-gray-200">
                                {tag}
                              </span>
                            ))}
                            <button className="px-3 py-1.5 bg-brand-yellow/10 text-brand-dark rounded-full text-xs font-bold border border-brand-yellow/20 hover:bg-brand-yellow transition-all">
                              + Aggiungi Keyword
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="bg-brand-dark p-8 rounded-3xl text-white space-y-4">
                        <div className="flex items-center gap-3">
                          <Sparkles className="w-6 h-6 text-brand-yellow" />
                          <h3 className="text-xl font-black uppercase tracking-tighter">Ottimizzazione AI</h3>
                        </div>
                        <p className="text-gray-400 text-sm font-bold">
                          Utilizza l'intelligenza artificiale per generare meta descrizioni e titoli accattivanti basati sul tuo catalogo prodotti.
                        </p>
                        <button className="bg-brand-yellow text-brand-dark px-6 py-3 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-brand-orange transition-all shadow-lg">
                          Analizza e Suggerisci SEO
                        </button>
                      </div>

                      {/* Google Verification Section */}
                      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                        <div className="space-y-4">
                          <h3 className="text-lg font-black text-brand-dark uppercase tracking-tighter flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-red-500 rounded-full"></span>
                            Proprietà Google & Verifica
                          </h3>
                          <div className="grid grid-cols-1 gap-6">
                            <label className="block">
                              <span className="text-[10px] font-black uppercase text-gray-400 ml-1">Codice HTML di Verifica (Meta Tag)</span>
                              <input 
                                type="text" 
                                value={companySettings.googleVerificationTag || ""}
                                onChange={(e) => setCompanySettings({...companySettings, googleVerificationTag: e.target.value})}
                                className="mt-1 block w-full bg-gray-50 border-gray-200 rounded-xl px-4 py-3 text-sm font-mono focus:ring-brand-yellow focus:border-brand-yellow"
                                placeholder='<meta name="google-site-verification" content="..." />'
                              />
                            </label>
                            
                            <label className="block">
                              <span className="text-[10px] font-black uppercase text-gray-400 ml-1">Snippet Google Analytics / Search Console (Script)</span>
                              <textarea 
                                rows={4}
                                value={companySettings.googleAnalyticsSnippet || ""}
                                onChange={(e) => setCompanySettings({...companySettings, googleAnalyticsSnippet: e.target.value})}
                                className="mt-1 block w-full bg-gray-50 border-gray-200 rounded-xl px-4 py-3 text-sm font-mono focus:ring-brand-yellow focus:border-brand-yellow"
                                placeholder='<!-- Global site tag (gtag.js) - Google Analytics -->'
                              />
                            </label>

                            <label className="block">
                              <span className="text-[10px] font-black uppercase text-gray-400 ml-1">Contenuto ads.txt</span>
                              <textarea 
                                rows={3}
                                value={companySettings.adsTxtContent || ""}
                                onChange={(e) => setCompanySettings({...companySettings, adsTxtContent: e.target.value})}
                                className="mt-1 block w-full bg-gray-50 border-gray-200 rounded-xl px-4 py-3 text-sm font-mono focus:ring-brand-yellow focus:border-brand-yellow"
                                placeholder="google.com, pub-000, DIRECT, ..."
                              />
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* SEO per Categorie */}
                      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                        <div className="space-y-4">
                          <h3 className="text-lg font-black text-brand-dark uppercase tracking-tighter flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-brand-yellow rounded-full"></span>
                            SEO per Categorie (SERP Preview)
                          </h3>
                          <div className="space-y-6">
                            {CATEGORIES.filter(cat => cat !== "Tutti").slice(0, showAllSeoCategories ? CATEGORIES.length : 3).map(cat => (
                              <div key={cat} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-4">
                                <div className="flex justify-between items-center">
                                  <span className="text-xs font-black uppercase text-brand-blue">{cat}</span>
                                  <button className="text-[10px] font-black uppercase text-brand-yellow hover:underline">Autocompila</button>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <input 
                                    className="w-full bg-white border-gray-200 rounded-xl px-4 py-2 text-xs font-bold"
                                    placeholder={`Meta Title per ${cat}...`}
                                    defaultValue={`${cat} di Alta Qualità - Acquista su BesPoint`}
                                  />
                                  <input 
                                    className="w-full bg-white border-gray-200 rounded-xl px-4 py-2 text-xs font-bold"
                                    placeholder={`Meta Description per ${cat}...`}
                                    defaultValue={`Scopri la nostra selezione esclusiva di ${cat}. Qualità garantita, spedizione veloce e i migliori prezzi del mercato.`}
                                  />
                                </div>

                                {/* Google SERP Preview */}
                                <div className="bg-white p-4 rounded-xl border border-gray-200 border-l-4 border-l-blue-600">
                                  <div className="text-[11px] text-[#202124] flex items-center gap-1 mb-1">
                                    <span>https://bespoint.it</span>
                                    <ChevronRight className="w-2.5 h-2.5 text-[#5f6368]" />
                                    <span className="text-[#5f6368]">{cat.toLowerCase()}</span>
                                  </div>
                                  <div className="text-[#1a0dab] text-lg font-medium hover:underline cursor-pointer leading-tight mb-1">
                                    {cat} di Alta Qualità - Acquista su BesPoint
                                  </div>
                                  <div className="text-[#4d5156] text-xs leading-relaxed">
                                    Scopri la nostra selezione esclusiva di {cat}. Qualità garantita, spedizione veloce e i migliori prezzi del mercato.
                                  </div>
                                </div>
                              </div>
                            ))}
                            <button className="w-full py-3 bg-gray-100 hover:bg-gray-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500 transition-all">
                              Vedi tutte le categorie
                            </button>
                          {!showAllSeoCategories && CATEGORIES.length > 3 && (
                            <button 
                              onClick={() => setShowAllSeoCategories(true)}
                              className="w-full py-3 bg-gray-100 hover:bg-gray-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500 transition-all">
                              Vedi tutte le categorie
                            </button>
                          )}
                          {showAllSeoCategories && (
                            <button 
                              onClick={() => setShowAllSeoCategories(false)}
                              className="w-full py-3 bg-gray-100 hover:bg-gray-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500 transition-all">
                              Mostra meno
                            </button>
                          )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {adminActiveTab === 'analytics' && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="text-3xl font-black text-brand-dark uppercase tracking-tighter">Analytics & Traffico</h2>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Monitoraggio in tempo reale del tuo store</p>
                      </div>
                      <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
                        {['Oggi', '7 Giorni', '30 Giorni', 'Anno'].map(t => (
                          <button key={t} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${t === '30 Giorni' ? 'bg-white text-brand-dark shadow-sm' : 'text-gray-400 hover:text-brand-dark'}`}>
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {[
                        { label: 'Visite Totali', value: '12.430', change: '+12.5%', color: 'text-blue-600', icon: Users },
                        { label: 'Impressioni SEO', value: '45.200', change: '+8.2%', color: 'text-purple-600', icon: Search },
                        { label: 'Click Diretti', value: '3.120', change: '+15.4%', color: 'text-green-600', icon: MousePointer2 },
                        { label: 'Permanenza Media', value: '3:45', change: '-2.1%', color: 'text-orange-600', icon: Clock }
                      ].map((stat, i) => (stat && (
                        <div key={i} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                          <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-gray-50 rounded-2xl group-hover:scale-110 transition-transform">
                              <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${stat.change.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                              {stat.change}
                            </span>
                          </div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{stat.label}</p>
                          <h4 className="text-3xl font-black text-brand-dark">{stat.value}</h4>
                        </div>
                      )))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      <div className="lg:col-span-2 bg-brand-dark p-8 rounded-[3rem] text-white space-y-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-yellow rounded-full blur-[100px] opacity-10 -mr-20 -mt-20"></div>
                        <div className="flex justify-between items-center relative z-10">
                          <h3 className="text-xl font-black uppercase tracking-tighter">Traffico Mensile</h3>
                          <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                              <span className="w-3 h-3 rounded-full bg-brand-yellow"></span>
                              <span className="text-[10px] font-bold uppercase text-gray-400">Organico</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                              <span className="text-[10px] font-bold uppercase text-gray-400">Social</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="h-64 flex items-end gap-2 relative z-10 px-4">
                          {[40, 60, 35, 90, 65, 45, 80, 55, 75, 45, 95, 70].map((h, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                              <div className="w-full relative">
                                <motion.div 
                                  initial={{ height: 0 }}
                                  animate={{ height: `${h}%` }}
                                  className="w-full bg-gradient-to-t from-brand-yellow/20 to-brand-yellow rounded-lg group-hover:brightness-125 transition-all shadow-[0_0_15px_rgba(255,214,0,0.2)]"
                                />
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-brand-dark px-2 py-1 rounded text-[10px] font-black opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl">
                                  {h * 120} Visite
                                </div>
                              </div>
                              <span className="text-[8px] font-bold text-gray-500 uppercase tracking-tighter">M{i+1}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm space-y-6">
                        <h3 className="text-xl font-black text-brand-dark uppercase tracking-tighter">Dispositivi</h3>
                        <div className="space-y-6">
                          {[
                            { label: 'Mobile', value: 65, icon: Smartphone, color: 'bg-brand-yellow text-brand-dark' },
                            { label: 'Desktop', value: 30, icon: Monitor, color: 'bg-brand-blue text-white' },
                            { label: 'Tablet', value: 5, icon: Tablet, color: 'bg-gray-100 text-gray-400' }
                          ].map((dev, i) => (
                            <div key={i} className="space-y-2">
                              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                <div className="flex items-center gap-2">
                                  <dev.icon className="w-4 h-4" />
                                  <span>{dev.label}</span>
                                </div>
                                <span>{dev.value}%</span>
                              </div>
                              <div className="h-3 bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${dev.value}%` }}
                                  className={`h-full ${dev.color.split(' ')[0]} rounded-full`}
                                />
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="pt-6 border-t border-gray-50">
                          <label className="block space-y-3">
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">ID Google Analytics (Tracking ID)</span>
                            <div className="relative">
                              <BarChart className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-dark/20 w-5 h-5" />
                              <input 
                                type="text"
                                placeholder="G-XXXXXXXXXX"
                                value={companySettings.googleAnalyticsId || ""}
                                onChange={(e) => setCompanySettings({...companySettings, googleAnalyticsId: e.target.value})}
                                className="w-full pl-16 pr-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl text-base font-black focus:border-brand-yellow focus:bg-white transition-all shadow-inner"
                              />
                            </div>
                            <p className="text-[9px] font-bold text-gray-400 p-2 italic leading-relaxed">
                              * Inserisci il codice di tracciamento per attivare l'invio automatico dei dati a Google.
                            </p>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {adminActiveTab === 'marketing' && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="text-3xl font-black text-brand-dark uppercase tracking-tighter">Marketing & Campagne Adv</h2>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Gestione ROI, Pixel e Performance Canali</p>
                      </div>
                      <div className="flex gap-4">
                        <button className="bg-white border border-gray-100 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-brand-dark shadow-sm hover:bg-gray-50 transition-all flex items-center gap-2">
                           <FileText className="w-4 h-4" /> Report PDF
                        </button>
                        <button className="bg-orange-500 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-orange-500/20 hover:scale-[1.02] transition-all flex items-center gap-2">
                           <Plus className="w-4 h-4" /> Nuova Campagna
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {[
                        { label: 'Spesa Totale (Spend)', value: '€4.250', change: '+5.2%', isPos: false, icon: DollarSign, color: 'text-orange-500', bg: 'bg-orange-50' },
                        { label: 'Valore Vendite (Sales)', value: '€21.840', change: '+22.5%', isPos: true, icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-50' },
                        { label: 'ROAS Totale', value: '5.14x', change: '+0.4x', isPos: true, icon: PieChart, color: 'text-blue-500', bg: 'bg-blue-50' },
                        { label: 'Costo per ACQ (CPA)', value: '€12,50', change: '-4.1%', isPos: true, icon: Target, color: 'text-purple-500', bg: 'bg-purple-50' }
                      ].map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
                           <div className="flex justify-between items-start mb-4">
                              <div className={`p-4 ${stat.bg} rounded-2xl`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                              </div>
                              <div className={`text-[10px] font-black px-2 py-1 rounded-lg ${stat.isPos ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                {stat.change}
                              </div>
                           </div>
                           <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{stat.label}</p>
                           <h4 className="text-3xl font-black text-brand-dark">{stat.value}</h4>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                       <div className="lg:col-span-2 space-y-8">
                          <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm space-y-6">
                             <div className="flex justify-between items-center">
                                <h3 className="text-xl font-black text-brand-dark uppercase tracking-tighter">Campagne Attive</h3>
                                <button className="text-[10px] font-black uppercase text-brand-blue hover:underline">Vedi Tutti i Canali</button>
                             </div>
                             <div className="space-y-4">
                                {[
                                  { name: 'Sconti Primavera 2024', platform: 'Meta', spend: 1200, sales: 6500, roas: 5.4, status: 'Active' },
                                  { name: 'Google Search Brand', platform: 'Google', spend: 450, sales: 3200, roas: 7.1, status: 'Active' },
                                  { name: 'Retargeting Carrello', platform: 'Meta', spend: 850, sales: 4100, roas: 4.8, status: 'Paused' },
                                  { name: 'Performance Max 01', platform: 'Google', spend: 1750, sales: 8040, roas: 4.6, status: 'Active' }
                                ].map((camp, i) => (
                                  <div key={i} className="flex flex-col md:flex-row items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100 group hover:border-brand-yellow/30 transition-all">
                                     <div className="flex items-center gap-4 flex-1">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${camp.platform === 'Meta' ? 'bg-blue-600' : 'bg-white'}`}>
                                           {camp.platform === 'Meta' ? <Facebook className="w-6 h-6 text-white" /> : <div className="text-xs font-black text-blue-500">G</div>}
                                        </div>
                                        <div>
                                           <h5 className="text-sm font-black text-brand-dark leading-none mb-1">{camp.name}</h5>
                                           <span className={`text-[9px] font-bold uppercase ${camp.status === 'Active' ? 'text-green-500':'text-gray-400'}`}>● {camp.status}</span>
                                        </div>
                                     </div>
                                     <div className="grid grid-cols-3 gap-8 mt-4 md:mt-0 text-center md:text-right px-6">
                                        <div>
                                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Spend</p>
                                          <p className="text-sm font-black text-brand-dark">€{camp.spend}</p>
                                        </div>
                                        <div>
                                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Sales</p>
                                          <p className="text-sm font-black text-brand-dark">€{camp.sales}</p>
                                        </div>
                                        <div>
                                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">ROAS</p>
                                          <p className="text-sm font-black text-green-600">{camp.roas}x</p>
                                        </div>
                                     </div>
                                     <button className="p-3 bg-white text-gray-300 rounded-xl hover:text-brand-dark transition-all md:ml-4">
                                        <ChevronDown className="w-4 h-4 rotate-270" />
                                     </button>
                                  </div>
                                ))}
                             </div>
                          </div>
                       </div>

                       <div className="space-y-8">
                          <div className="bg-brand-dark p-8 rounded-[3rem] text-white space-y-8 relative overflow-hidden">
                             <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500 rounded-full blur-[80px] opacity-20 -mr-20 -mt-20"></div>
                             <h3 className="text-xl font-black uppercase tracking-tighter relative z-10 flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-brand-yellow rounded-full"></span> Connessione Canali
                             </h3>
                             
                             <div className="space-y-6 relative z-10">
                                {/* Meta Pixel */}
                                <div className="space-y-3">
                                   <div className="flex items-center justify-between">
                                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Meta Pixel ID</label>
                                      <span className="text-[8px] font-black bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded uppercase">Connected</span>
                                   </div>
                                   <input 
                                     type="text" 
                                     placeholder="Inserisci Pixel ID..." 
                                     className="w-full bg-white/10 border border-white/10 rounded-2xl px-6 py-4 text-xs font-bold text-white focus:ring-brand-yellow focus:border-brand-yellow"
                                     value="92384729384729"
                                     readOnly
                                   />
                                   <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-2 block">Conversion API Token</label>
                                   <input 
                                     type="password" 
                                     placeholder="EAA..." 
                                     className="w-full bg-white/10 border border-white/10 rounded-2xl px-6 py-4 text-xs font-bold text-white focus:ring-brand-yellow focus:border-brand-yellow"
                                     value="••••••••••••••••••••••••"
                                     readOnly
                                   />
                                </div>

                                <div className="w-full h-px bg-white/10"></div>

                                {/* Google Ads */}
                                <div className="space-y-3">
                                   <div className="flex items-center justify-between">
                                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Google Ads Conversion ID</label>
                                   </div>
                                   <input 
                                     type="text" 
                                     placeholder="AW-XXXXXXXXX" 
                                     className="w-full bg-white/10 border border-white/10 rounded-2xl px-6 py-4 text-xs font-bold text-white focus:ring-brand-yellow focus:border-brand-yellow"
                                   />
                                   <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-2 block">Conversion Label</label>
                                   <input 
                                     type="text" 
                                     placeholder="Labl_XXXXXXXX" 
                                     className="w-full bg-white/10 border border-white/10 rounded-2xl px-6 py-4 text-xs font-bold text-white focus:ring-brand-yellow focus:border-brand-yellow"
                                   />
                                </div>

                                <button className="w-full py-5 bg-brand-yellow text-brand-dark rounded-[2rem] text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all">
                                   Salva Configurazione Tracking
                                </button>
                             </div>
                          </div>

                          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-[3rem] text-white space-y-4 shadow-2xl relative overflow-hidden group">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl opacity-10 -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700"></div>
                             <div className="flex items-center gap-3">
                                <Sparkles className="w-6 h-6 text-brand-yellow" />
                                <h3 className="text-xl font-black uppercase tracking-tighter">Suggerimenti AI</h3>
                             </div>
                             <p className="text-white/60 text-xs font-bold leading-relaxed">
                                La tua campagna "Sconti Primavera" ha superato il budget previsto ma mantiene un ROAS eccellente. Suggeriamo di scalare il budget del +25%.
                             </p>
                             <button className="w-full py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all">
                                Applica Ottimizzazione
                             </button>
                          </div>
                       </div>
                    </div>
                  </div>
                )}

                {adminActiveTab === 'products' && (
                  <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
                    <div className="flex justify-between items-center">
                      <h2 className="text-3xl font-black text-brand-dark uppercase tracking-tighter">
                        {adminProductView === 'list' && "Gestione Prodotti"}
                        {adminProductView === 'single' && "Nuovo Prodotto Multi-Canale"}
                        {adminProductView === 'mass' && "Importazione Massiva"}
                      </h2>
                      {adminProductView === 'list' && (
                          <div className="flex gap-4">
                            <div className="relative">
                              <button 
                                onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
                                className="bg-white text-gray-500 px-6 py-3 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-gray-50 border border-gray-100 transition-all flex items-center gap-2 shadow-sm"
                              >
                                <Download className="w-4 h-4" /> Esporta <ChevronDown className={`w-4 h-4 transition-transform ${isExportMenuOpen ? 'rotate-180' : ''}`} />
                              </button>
                              
                              <AnimatePresence>
                                {isExportMenuOpen && (
                                  <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute top-full mt-2 right-0 w-48 bg-white/95 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-2xl z-50 overflow-hidden"
                                  >
                                    {[
                                      { label: 'CSV (Excel)', format: 'csv', icon: FileSpreadsheet },
                                      { label: 'Excel (.xlsx)', format: 'xlsx', icon: Table },
                                      { label: 'PDF Report', format: 'pdf', icon: FileText },
                                      { label: 'JSON Data', format: 'json', icon: FileCode }
                                    ].map((opt) => (
                                      <button 
                                        key={opt.format}
                                        onClick={() => {
                                          if (opt.format === 'csv') {
                                            const headers = "ID,Name,Category,Subcategory,Price,SKU\n";
                                            const rows = PRODUCTS.map(p => `${p.id},"${p.name}","${p.category}","${p.subcategory}",${p.price},BP-${p.id.padStart(4, '0')}`).join("\n");
                                            const blob = new Blob([headers + rows], { type: 'text/csv' });
                                            const url = window.URL.createObjectURL(blob);
                                            const a = document.createElement('a');
                                            a.setAttribute('href', url);
                                            a.setAttribute('download', 'bespoint_catalogo.csv');
                                            a.click();
                                          } else {
                                            alert(`Simulazione esportazione ${opt.label}...`);
                                          }
                                          setIsExportMenuOpen(false);
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-xs font-black uppercase text-gray-500 hover:bg-brand-yellow hover:text-brand-dark transition-all border-b border-gray-50 last:border-none"
                                      >
                                        <opt.icon className="w-4 h-4" /> {opt.label}
                                      </button>
                                    ))}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>

                            <button 
                              onClick={() => setAdminProductView('mass')}
                              className="bg-gray-100 text-gray-600 px-6 py-3 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-green-500 hover:text-white transition-all flex items-center gap-2"
                            >
                              <FileSpreadsheet className="w-4 h-4" /> Importa
                            </button>
                            <button 
                              onClick={() => setAdminProductView('single')}
                              className="bg-brand-dark text-white px-6 py-3 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-brand-yellow hover:text-brand-dark transition-all flex items-center gap-2"
                            >
                              <Plus className="w-4 h-4" /> Crea Nuovo
                            </button>
                          </div>
                      )}
                      {adminProductView !== 'list' && (
                        <button 
                          onClick={() => setAdminProductView('list')}
                          className="bg-gray-100 text-brand-dark px-6 py-3 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-gray-200 transition-all flex items-center gap-2"
                        >
                          <ArrowLeft className="w-4 h-4" /> Torna alla Lista
                        </button>
                      )}
                    </div>
                    
                    {adminProductView === 'list' && (
                      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                              <tr className="bg-gray-50 border-b border-gray-100 text-xs font-black uppercase tracking-widest text-gray-400">
                                <th className="p-4">Prodotto</th>
                                <th className="p-4">Categoria / Variante</th>
                                <th className="p-4">Prezzo Base</th>
                                <th className="p-4 text-center">Canali Attivi</th>
                                <th className="p-4 text-right">Azioni</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {PRODUCTS.map(p => (
                                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                                  <td className="p-4">
                                    <div className="flex items-center gap-4">
                                      <img src={p.image} alt={p.name} className="w-12 h-12 rounded-xl object-cover bg-gray-100" />
                                      <div>
                                        <p className="font-bold text-sm text-brand-dark">{p.name}</p>
                                        <p className="text-xs text-gray-500 font-medium">SKU: BP-{p.id.padStart(4, '0')}</p>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="p-4">
                                    <div className="flex flex-col gap-1">
                                      <span className="text-xs font-bold px-2 py-1 bg-gray-100 text-gray-600 rounded-md w-fit">{p.category}</span>
                                      <span className="text-xs text-gray-500">{p.subcategory}</span>
                                    </div>
                                  </td>
                                  <td className="p-4 font-black text-brand-dark">€{p.price.toFixed(2)}</td>
                                  <td className="p-4">
                                    <div className="flex justify-center gap-2">
                                      {/* Mock market channels */}
                                      <span className="w-6 h-6 rounded-full bg-white border border-gray-100 flex items-center justify-center cursor-help overflow-hidden shadow-sm hover:scale-110 transition-transform" title="Amazon.it Attivo">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg" className="w-4 h-4 object-contain" alt="Amazon" />
                                      </span>
                                      <span className="w-6 h-6 rounded-full bg-white border border-gray-100 flex items-center justify-center cursor-help overflow-hidden shadow-sm hover:scale-110 transition-transform" title="eBay Attivo">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/1/1b/EBay_logo.svg" className="w-4 h-4 object-contain" alt="eBay" />
                                      </span>
                                      <span className="w-6 h-6 rounded-full bg-brand-dark text-brand-yellow flex items-center justify-center cursor-help overflow-hidden shadow-sm hover:scale-110 transition-transform" title="Sito Web Attivo">
                                        <Layers className="w-3 h-3" />
                                      </span>
                                    </div>
                                  </td>
                                  <td className="p-4 text-right">
                                    <button 
                                      onClick={() => setAdminProductView('single')}
                                      className="p-2 text-gray-400 hover:text-brand-yellow hover:bg-brand-dark rounded-lg transition-colors inline-block"
                                      title="Modifica Singolo"
                                    >
                                      <Edit2 className="w-5 h-5" />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {adminProductView === 'single' && (
                      <AdminSingleProduct onBack={() => setAdminProductView('list')} />
                    )}

                    {adminProductView === 'mass' && (
                      <AdminMassiveImport onBack={() => setAdminProductView('list')} />
                    )}
                  </div>
                )}

                {adminActiveTab === 'orders' && (
                  <AdminOrders />
                )}

                {adminActiveTab === 'couriers' && <AdminCouriers />}
                {adminActiveTab === ('returns' as any) && <AdminReturns />}
                {adminActiveTab === ('users' as any) && <AdminUsers />}

                {adminActiveTab === 'marketplaces' && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                    <div>
                      <h2 className="text-3xl font-black text-brand-dark uppercase tracking-tighter mb-2">Integrazione Marketplaces</h2>
                      <p className="text-sm font-bold text-gray-400 font-bold">Configura i connettori API per sincronizzare stock, prezzi e ordini con le piattaforme esterne.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Amazon Config */}
                      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500 rounded-full blur-3xl opacity-5 group-hover:opacity-10 transition-opacity"></div>
                        <div className="flex items-center justify-between mb-8">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center shadow-inner">
                              <Globe className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-black uppercase tracking-tighter">Amazon SP-API</h3>
                          </div>
                          <label className="inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500 relative"></div>
                          </label>
                        </div>
                        <div className="space-y-4">
                          <label className="block">
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block">Seller ID</span>
                            <input type="text" placeholder="A1BCDEFGH2IJK" className="w-full bg-gray-50 border-gray-200 rounded-xl px-4 py-3 text-sm font-bold placeholder:text-gray-300" />
                          </label>
                          <label className="block">
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block">Marketplace Region</span>
                            <select className="w-full bg-gray-50 border-gray-200 rounded-xl px-4 py-3 text-sm font-bold">
                              <option>Europa (Amazon.it)</option>
                              <option>America</option>
                            </select>
                          </label>
                          <button className="w-full bg-brand-dark text-orange-500 px-6 py-3 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-orange-500 hover:text-white transition-all flex items-center justify-center gap-2">
                             Autorizza Canale
                          </button>
                        </div>
                      </div>

                      {/* eBay Config */}
                      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full blur-3xl opacity-5 group-hover:opacity-10 transition-opacity"></div>
                        <div className="flex items-center justify-between mb-8">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center shadow-inner">
                              <ExternalLink className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-black uppercase tracking-tighter">eBay Integration</h3>
                          </div>
                          <label className="inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500 relative"></div>
                          </label>
                        </div>
                        <div className="space-y-4">
                          <label className="block">
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block">RU Name</span>
                            <input type="text" placeholder="BesPoint-BesPoint-..." className="w-full bg-gray-50 border-gray-200 rounded-xl px-4 py-3 text-sm font-bold placeholder:text-gray-300" />
                          </label>
                          <label className="block">
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block">Environment</span>
                            <select className="w-full bg-gray-50 border-gray-200 rounded-xl px-4 py-3 text-sm font-bold">
                              <option>Production (Live)</option>
                              <option>Sandbox (Test)</option>
                            </select>
                          </label>
                          <button className="w-full bg-brand-dark text-blue-500 px-6 py-3 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center gap-2">
                             Collega Account eBay
                          </button>
                        </div>
                      </div>

                      {/* Add More */}
                      <div className="bg-gray-50 rounded-3xl p-8 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-brand-yellow transition-all">
                        <div className="w-16 h-16 bg-white text-gray-400 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:bg-brand-yellow group-hover:text-brand-dark transition-all mb-4">
                          <Plus className="w-8 h-8" />
                        </div>
                        <h3 className="font-black uppercase tracking-widest text-gray-400 group-hover:text-brand-dark transition-colors">Aggiungi Canale</h3>
                        <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase">ManoMano, Temu, B2B VIP Extension</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                  <button 
                    onClick={() => setIsAdminOpen(false)}
                    className="bg-brand-yellow text-brand-dark px-6 py-3 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-brand-orange transition-all shadow-lg hover:-translate-y-1 active:translate-y-0"
                  >
                    Salva Modifiche
                  </button>
                </div>

                {/* Delete Confirmation Modal */}
                <AnimatePresence>
                  {slideToDelete && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-dark/60 backdrop-blur-sm"
                    >
                      <motion.div 
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="bg-white rounded-[2rem] shadow-2xl w-full max-w-sm overflow-hidden"
                      >
                        <div className="bg-red-500 p-8 text-center relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-full h-full opacity-10">
                            <Trash2 className="w-40 h-40 -ml-10 -mt-10 rotate-12" />
                          </div>
                          <div className="relative z-10 flex flex-col items-center">
                            <div className="bg-white/20 p-4 rounded-3xl mb-4 backdrop-blur-md border border-white/30">
                              <Trash2 className="w-10 h-10 text-white" />
                            </div>
                            <h4 className="text-xl font-black text-white uppercase tracking-tighter">Conferma Eliminazione</h4>
                          </div>
                        </div>
                        
                        <div className="p-8 text-center space-y-6">
                          <div className="space-y-2">
                            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Stai per eliminare</p>
                            <p className="text-brand-dark font-black text-lg leading-tight uppercase tracking-tighter">
                              {slideToDelete.type}
                            </p>
                          </div>
                          
                          <p className="text-gray-500 text-sm font-bold leading-relaxed px-4">
                            Questa azione è irreversibile. La slide verrà rimossa definitivamente dal database.
                          </p>
                          
                          <div className="grid grid-cols-2 gap-3 pt-4">
                            <button 
                              onClick={() => setSlideToDelete(null)}
                              className="px-6 py-4 rounded-2xl bg-gray-100 text-gray-500 font-black uppercase text-[10px] tracking-widest hover:bg-gray-200 transition-all active:scale-95"
                            >
                              Annulla
                            </button>
                            <button 
                              onClick={() => {
                                setPageSettings({
                                  ...pageSettings,
                                  homeSlides: pageSettings.homeSlides.filter((s: any) => s.id !== slideToDelete.id)
                                });
                                // Reset indices based on position
                                if (slideToDelete.position === 'home_top') setAdminTopIdx(0);
                                if (slideToDelete.position === 'home_middle') setAdminMidIdx(0);
                                if (slideToDelete.position === 'home_bottom') setAdminBotIdx(0);
                                setSlideToDelete(null);
                              }}
                              className="px-6 py-4 rounded-2xl bg-red-500 text-white font-black uppercase text-[10px] tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-red-500/30 active:scale-95"
                            >
                              Sì, Elimina
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Modal */}
      <AnimatePresence>
        {isAuthOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-start justify-center pt-[5.5rem] pb-4 px-4 bg-brand-dark/80 backdrop-blur-md overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className={`bg-white rounded-[2rem] shadow-2xl w-full ${['profile', 'edit_profile', 'orders', 'support'].includes(authStep) ? 'max-w-4xl' : 'max-w-md'} max-h-[90vh] overflow-y-auto overflow-x-hidden relative transition-all duration-300 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]`}
            >
              <button 
                onClick={() => setIsAuthOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 hover:text-brand-dark transition-colors z-10"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="p-6 md:p-10">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-brand-yellow rounded-2xl mx-auto flex items-center justify-center mb-4 rotate-3 shadow-inner">
                    <User className="w-8 h-8 text-brand-dark -rotate-3" />
                  </div>
                  <h2 className="text-2xl font-black text-brand-dark uppercase tracking-tighter">
                    {authStep === 'profile' ? `Ciao, ${currentUser?.name.split(' ')[0] || 'Utente'}!` : 
                     authStep === 'orders' ? 'I Miei Ordini' : 
                     authStep === 'edit_profile' ? 'Il Mio Profilo' : 
                     authStep === 'support' ? 'Assistenza Clienti' : 
                     authStep === 'email' ? 'Bentornato' : 
                     authStep === 'login' ? 'Inserisci Password' : 
                     'Crea Account'}
                  </h2>
                  <p className="text-gray-500 font-bold text-sm mt-1">
                    {authStep === 'profile' ? 'Gestisci la tua Area Personale' : 
                     authStep === 'orders' ? 'Lo storico dei tuoi acquisti' : 
                     authStep === 'edit_profile' ? 'Aggiorna i dettagli demografici e di fatturazione' : 
                     authStep === 'support' ? 'Siamo qui per aiutarti. Scegli come preferisci contattarci.' : 
                     authStep === 'email' ? 'Accedi o registrati per continuare' : 
                     authStep === 'login' ? `Bentornato, ${authEmail}` : 
                     'Inserisci i tuoi dati per registrarti'}
                  </p>
                </div>

                {authError && (
                  <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-xs font-bold text-center border border-red-100">
                    {authError}
                  </div>
                )}

                {['profile', 'edit_profile', 'orders', 'support'].includes(authStep) && (
                  <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                    {/* Main Content Area */}
                    <div className="flex-1 order-2 md:order-1">
                      {authStep === 'profile' && (
                        <div className="space-y-6">
                          <div className="flex items-center gap-4 bg-gray-50 p-6 rounded-3xl border border-gray-100">
                            <div className="w-16 h-16 bg-brand-blue rounded-full flex items-center justify-center text-white font-black text-2xl shadow-inner uppercase">
                              {currentUser?.name?.charAt(0) || 'U'}
                            </div>
                            <div className="text-left">
                              <p className="text-xl font-black text-brand-dark leading-tight">{currentUser?.name}</p>
                              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mt-1">{currentUser?.email}</p>
                            </div>
                          </div>
                          
                        <>
                          <div className="bg-brand-yellow/10 p-6 rounded-3xl border border-brand-yellow/20 text-center md:text-left">
                            <h3 className="text-brand-dark font-black text-lg mb-2 uppercase tracking-tighter">Benvenuto nella tua Area</h3>
                            <p className="text-sm font-bold text-gray-600 leading-relaxed">Da qui puoi gestire le tue informazioni personali, visualizzare i tuoi ordini e contattare l'assistenza. Usa i collegamenti rapidi per navigare ed impostare i tuoi indirizzi di spedizione principali.</p>
                          </div>
                          
                          <button onClick={() => { setIsAuthOpen(false); }} className="w-full bg-brand-dark hover:bg-brand-yellow hover:text-brand-dark text-white p-4 rounded-xl font-black uppercase text-xs tracking-widest transition-all shadow-lg active:scale-95">
                            Torna allo Shopping
                          </button>
                        </>
                        </div>
                      )}

                      {authStep === 'edit_profile' && (
                        <div className="space-y-4">
                          <form className="space-y-3 text-left" onSubmit={(e) => { e.preventDefault(); handleSaveProfile(); }}>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Nome</label>
                                <input type="text" value={profileEditForm.nameFirst} onChange={e => setProfileEditForm({...profileEditForm, nameFirst: e.target.value})} className="w-full bg-gray-50 border-gray-200 border rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-brand-blue outline-none" placeholder="Es. Mario" />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Cognome</label>
                                <input type="text" value={profileEditForm.nameLast} onChange={e => setProfileEditForm({...profileEditForm, nameLast: e.target.value})} className="w-full bg-gray-50 border-gray-200 border rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-brand-blue outline-none" placeholder="Es. Rossi" />
                              </div>
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Recapito Telefonico</label>
                              <input type="tel" value={profileEditForm.phone} onChange={e => setProfileEditForm({...profileEditForm, phone: e.target.value})} className="w-full bg-gray-50 border-gray-200 border rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-brand-blue focus:bg-white transition-all shadow-inner outline-none" placeholder="+39 333 1234567" />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Email di Accesso (Non modificabile)</label>
                              <div className="w-full bg-gray-100 border-gray-200 border rounded-xl px-4 py-3 text-sm font-bold text-gray-500 cursor-not-allowed">
                                {currentUser?.email}
                              </div>
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Indirizzo / Via e Civico</label>
                              <input type="text" value={profileEditForm.addressStreet} onChange={e => setProfileEditForm({...profileEditForm, addressStreet: e.target.value})} className="w-full bg-gray-50 border-gray-200 border rounded-xl px-4 py-3 text-sm font-bold text-brand-dark focus:ring-2 focus:ring-brand-blue focus:bg-white transition-all shadow-inner outline-none" placeholder="Es. Via Roma, 1"/>
                            </div>
                            <div className="grid grid-cols-6 gap-3">
                              <div className="space-y-1 col-span-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Città</label>
                                <input type="text" value={profileEditForm.addressCity} onChange={e => setProfileEditForm({...profileEditForm, addressCity: e.target.value})} className="w-full bg-gray-50 border-gray-200 border rounded-xl px-4 py-3 text-sm font-bold text-brand-dark focus:ring-2 focus:ring-brand-blue focus:bg-white transition-all shadow-inner outline-none" placeholder="Es. Milano"/>
                              </div>
                              <div className="space-y-1 col-span-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">CAP</label>
                                <input type="text" value={profileEditForm.addressZip} onChange={e => setProfileEditForm({...profileEditForm, addressZip: e.target.value})} className="w-full bg-gray-50 border-gray-200 border rounded-xl px-4 py-3 text-sm font-bold text-brand-dark focus:ring-2 focus:ring-brand-blue focus:bg-white transition-all shadow-inner outline-none" placeholder="20100"/>
                              </div>
                              <div className="space-y-1 col-span-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Prov</label>
                                <input type="text" value={profileEditForm.addressProvince} onChange={e => setProfileEditForm({...profileEditForm, addressProvince: e.target.value})} className="w-full bg-gray-50 border-gray-200 border rounded-xl px-4 py-3 text-sm font-bold uppercase text-brand-dark focus:ring-2 focus:ring-brand-blue focus:bg-white transition-all shadow-inner outline-none" placeholder="MI" maxLength={2} />
                              </div>
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Codice Fiscale / P.IVA</label>
                              <input type="text" value={profileEditForm.taxCode} onChange={e => setProfileEditForm({...profileEditForm, taxCode: e.target.value})} className="w-full bg-gray-50 border-gray-200 border rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-brand-blue focus:bg-white transition-all shadow-inner outline-none uppercase" placeholder="Es. RSSMRA80A01H501U" />
                            </div>
                            <div className="pt-2">
                              <button type="submit" className="w-full bg-brand-blue hover:bg-brand-dark text-white p-4 rounded-xl font-black uppercase text-xs tracking-widest transition-all shadow-lg active:scale-95">
                                Salva Dati Profilo
                              </button>
                            </div>
                          </form>
                        </div>
                      )}

                      {authStep === 'orders' && (
                        <div className="space-y-4 text-center">
                          <div className="py-10 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center justify-center">
                            <Box className="w-12 h-12 text-gray-300 mb-3" />
                            <p className="text-brand-dark font-black text-xl uppercase tracking-tighter">Nessun ordine</p>
                            <p className="text-gray-400 text-sm font-bold px-6 mt-1">Non hai ancora effettuato ordini.<br/>Scopri le novità in vetrina!</p>
                          </div>
                          <button type="button" onClick={() => { setIsAuthOpen(false); }} className="w-full bg-brand-yellow hover:bg-brand-orange text-brand-dark p-4 rounded-xl font-black uppercase text-xs tracking-widest transition-all shadow-lg active:scale-95">
                            Inizia lo Shopping
                          </button>
                        </div>
                      )}

                      {authStep === 'support' && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <a href="mailto:assistenza@bespoint.it" className="bg-white border border-gray-100 rounded-3xl p-6 text-center hover:border-brand-blue hover:shadow-lg transition-all group flex flex-col items-center gap-3">
                              <div className="w-12 h-12 bg-blue-50 text-brand-blue rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Mail className="w-5 h-5" />
                              </div>
                              <div>
                                <h4 className="font-black text-brand-dark uppercase tracking-tighter text-sm">Invia Email</h4>
                                <p className="text-xs text-gray-400 font-bold mt-1">Scrivici dalla tua casella</p>
                              </div>
                            </a>
                            <a href="tel:+390000000000" className="bg-white border border-gray-100 rounded-3xl p-6 text-center hover:border-green-500 hover:shadow-lg transition-all group flex flex-col items-center gap-3">
                              <div className="w-12 h-12 bg-green-50 text-green-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                <MessageCircle className="w-5 h-5" />
                              </div>
                              <div>
                                <h4 className="font-black text-brand-dark uppercase tracking-tighter text-sm">Contatto Telefonico</h4>
                                <p className="text-xs text-gray-400 font-bold mt-1">Parla con il supporto</p>
                              </div>
                            </a>
                          </div>
                          <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 mt-2">
                            <h4 className="font-black text-brand-dark flex items-center gap-2 uppercase tracking-tighter text-sm mb-4">
                              <MessageCircle className="w-4 h-4 text-brand-blue" />
                              Messaggio Diretto Dalla Piattaforma
                            </h4>
                            <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); alert('Messaggio inviato con successo! Ti risponderemo a breve.'); setAuthStep('profile'); }}>
                              <textarea required className="w-full bg-white border-gray-200 border rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-brand-blue outline-none resize-none h-32" placeholder="Scrivi qui la tua richiesta o problema e il nostro team ti risponderà nel più breve tempo possibile..."></textarea>
                              <button type="submit" className="w-full bg-brand-dark hover:bg-brand-blue text-white p-3.5 rounded-xl font-black uppercase text-xs tracking-widest transition-all shadow-lg active:scale-95">
                                Invia Messaggio
                              </button>
                            </form>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Sidebar Links (Right Side Desktop / Bottom Mobile) */}
                    <div className="w-full md:w-80 space-y-4 order-1 md:order-2 md:border-l md:border-gray-100 md:pl-8">
                       <h3 className="hidden md:block text-xs font-black text-gray-300 uppercase tracking-widest ml-1 mb-2">Collegamenti Rapidi</h3>
                      <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                        <button onClick={() => setAuthStep('edit_profile')} className={`p-4 bg-white border ${authStep === 'edit_profile' ? 'border-brand-yellow ring-2 ring-brand-yellow/20' : 'border-gray-100'} rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-brand-yellow/10 hover:border-brand-yellow transition-all group shadow-sm active:scale-95`}>
                          <User className={`w-6 h-6 ${authStep === 'edit_profile' ? 'text-brand-dark' : 'text-brand-blue'} group-hover:text-brand-dark transition-colors`} />
                          <span className="text-[10px] font-black uppercase tracking-widest text-brand-dark text-center leading-tight">Il mio<br/>profilo</span>
                        </button>
                        <button onClick={() => setAuthStep('orders')} className={`p-4 bg-white border ${authStep === 'orders' ? 'border-brand-yellow ring-2 ring-brand-yellow/20' : 'border-gray-100'} rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-brand-yellow/10 hover:border-brand-yellow transition-all group shadow-sm active:scale-95`}>
                          <Box className={`w-6 h-6 ${authStep === 'orders' ? 'text-brand-dark' : 'text-brand-blue'} group-hover:text-brand-dark transition-colors`} />
                          <span className="text-[10px] font-black uppercase tracking-widest text-brand-dark text-center leading-tight">I miei<br/>ordini</span>
                        </button>
                        <button className="p-4 bg-white border border-gray-100 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-brand-yellow/10 hover:border-brand-yellow transition-all group shadow-sm active:scale-95">
                          <MapPin className="w-6 h-6 text-brand-blue group-hover:text-brand-dark transition-colors" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-brand-dark text-center leading-tight">I Miei<br/>Indirizzi</span>
                        </button>
                        <button className="p-4 bg-white border border-gray-100 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-brand-yellow/10 hover:border-brand-yellow transition-all group shadow-sm active:scale-95">
                          <Heart className="w-6 h-6 text-brand-blue group-hover:text-brand-dark transition-colors" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-brand-dark text-center leading-tight">I Miei<br/>Preferiti</span>
                        </button>
                        <button 
                          onClick={() => {
                            if (!currentUser) { setAuthStep('email'); return; }
                            setAuthStep('profile');
                            setActiveUserView('returns');
                          }}
                          className={`p-4 bg-white border ${activeUserView === 'returns' ? 'border-brand-yellow ring-2 ring-brand-yellow/20' : 'border-gray-100'} rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-brand-yellow/10 hover:border-brand-yellow transition-all group shadow-sm active:scale-95`}
                        >
                          <RefreshCw className={`w-6 h-6 ${activeUserView === 'returns' ? 'text-brand-dark' : 'text-brand-blue'} group-hover:text-brand-dark transition-colors`} />
                          <span className="text-[10px] font-black uppercase tracking-widest text-brand-dark text-center leading-tight">Resi e<br/>Rimborsi</span>
                        </button>
                        <button onClick={() => setAuthStep('support')} className={`p-4 bg-white border ${authStep === 'support' ? 'border-brand-yellow ring-2 ring-brand-yellow/20' : 'border-gray-100'} rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-brand-yellow/10 hover:border-brand-yellow transition-all group shadow-sm active:scale-95`}>
                          <MessageCircle className={`w-6 h-6 ${authStep === 'support' ? 'text-brand-dark' : 'text-brand-blue'} group-hover:text-brand-dark transition-colors`} />
                          <span className="text-[10px] font-black uppercase tracking-widest text-brand-dark text-center leading-tight">Assistenza<br/> Clienti</span>
                        </button>
                      </div>

                      <button 
                        onClick={() => { logout(); setIsAuthOpen(false); }}
                        className="w-full mt-4 bg-red-50 hover:bg-red-500 text-red-600 hover:text-white p-3.5 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all"
                      >
                        Disconnetti Dalla Sessione
                      </button>
                    </div>
                  </div>
                )}

                {authStep === 'email' && (
                  <div className="space-y-4">
                    <form onSubmit={handleAuthEmailContinue} className="space-y-4">
                      <div className="space-y-1.5 text-left">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Email</label>
                        <input 
                          type="email" 
                          required
                          value={authEmail}
                          onChange={(e) => setAuthEmail(e.target.value)}
                          className="w-full bg-gray-50 border-gray-200 border rounded-xl px-4 py-4 text-sm font-bold focus:ring-2 focus:ring-brand-blue focus:bg-white transition-all shadow-inner placeholder:text-gray-300 outline-none"
                          placeholder="tu@email.com"
                        />
                      </div>
                      <button 
                        type="submit"
                        className="w-full bg-brand-dark hover:bg-brand-blue text-white p-4 rounded-xl font-black uppercase text-xs tracking-widest transition-all hover:shadow-lg shadow-brand-dark/30 active:scale-95"
                      >
                        Continua
                      </button>
                    </form>

                    <div className="relative py-4">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-100"></div>
                      </div>
                      <div className="relative flex justify-center">
                        <span className="bg-white px-4 text-[10px] font-black uppercase tracking-widest text-gray-300">oppure usa</span>
                      </div>
                    </div>

                    <button 
                      onClick={handleGoogleLogin}
                      className="w-full bg-white border-2 border-gray-100 hover:border-gray-200 text-brand-dark p-4 rounded-xl font-black text-sm transition-all hover:shadow-md active:scale-95 flex justify-center items-center gap-3"
                    >
                      <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5 block" />
                      Continua con Google
                    </button>
                  </div>
                )}

                {authStep === 'login' && (
                  <form onSubmit={handleAuthLogin} className="space-y-4 text-left">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Password</label>
                      <input 
                        type="password" 
                        required
                        autoFocus
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        className="w-full bg-gray-50 border-gray-200 border rounded-xl px-4 py-4 text-sm font-bold focus:ring-2 focus:ring-brand-yellow focus:bg-white transition-all shadow-inner outline-none"
                        placeholder="••••••••"
                      />
                    </div>
                    <button 
                      type="submit"
                      className="w-full bg-brand-yellow hover:bg-brand-orange text-brand-dark p-4 rounded-xl font-black uppercase text-xs tracking-widest transition-all hover:shadow-lg shadow-brand-yellow/30 active:scale-95"
                    >
                      Accedi
                    </button>
                    <button 
                      type="button"
                      onClick={() => setAuthStep('email')}
                      className="w-full text-center text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-brand-blue pt-4 transition-colors"
                    >
                      Torna indietro o cambia email
                    </button>
                  </form>
                )}

                {authStep === 'register' && (
                  <form onSubmit={handleAuthRegister} className="space-y-4 text-left">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Nome Completo</label>
                      <input 
                        type="text" 
                        required
                        autoFocus
                        value={authName}
                        onChange={(e) => setAuthName(e.target.value)}
                        className="w-full bg-gray-50 border-gray-200 border rounded-xl px-4 py-4 text-sm font-bold focus:ring-2 focus:ring-brand-blue focus:bg-white transition-all shadow-inner outline-none"
                        placeholder="Es. Mario Rossi"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Crea Password</label>
                      <input 
                        type="password" 
                        required
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        className="w-full bg-gray-50 border-gray-200 border rounded-xl px-4 py-4 text-sm font-bold focus:ring-2 focus:ring-brand-blue focus:bg-white transition-all shadow-inner outline-none"
                        placeholder="Minimo 6 caratteri"
                      />
                    </div>
                    <button 
                      type="submit"
                      className="w-full bg-brand-blue hover:bg-brand-dark text-white p-4 rounded-xl font-black uppercase text-xs tracking-widest transition-all hover:shadow-lg shadow-brand-blue/30 active:scale-95 mt-2"
                    >
                      Crea Account
                    </button>
                    <button 
                      type="button"
                      onClick={() => setAuthStep('email')}
                      className="w-full text-center text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-brand-blue pt-4 transition-colors"
                    >
                      Torna indietro
                    </button>
                  </form>
                )}

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
