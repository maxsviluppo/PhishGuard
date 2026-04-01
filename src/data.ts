import { Product } from "./types";

export const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Faretto LED Incasso 10W",
    price: 12.90,
    category: "Illuminazione",
    subcategory: "Interni",
    image: "https://picsum.photos/seed/led1/800/800",
    description: "Faretto LED da incasso ad alta efficienza energetica, ideale per cartongesso. Luce bianca naturale 4000K.",
    rating: 4.8,
    reviews: 124,
    specs: {
      "Potenza": "10W",
      "Lumen": "900lm",
      "Colore": "4000K",
      "Diametro": "120mm"
    },
    gallery: [
      "https://picsum.photos/seed/led1-1/800/800",
      "https://picsum.photos/seed/led1-2/800/800",
      "https://picsum.photos/seed/led1-3/800/800"
    ],
    has3D: true,
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    isFeatured: true
  },
  {
    id: "2",
    name: "Kit Antifurto Wireless Pro",
    price: 249.00,
    category: "Sicurezza",
    subcategory: "Allarmi",
    image: "https://picsum.photos/seed/alarm1/800/800",
    description: "Sistema di allarme wireless completo con sensori di movimento, contatti porta e sirena esterna. Gestibile da app.",
    rating: 4.9,
    reviews: 86,
    specs: {
      "Connettività": "Wi-Fi / GSM",
      "Sensori inclusi": "4",
      "Batteria": "Fino a 2 anni",
      "App": "iOS / Android"
    },
    gallery: [
      "https://picsum.photos/seed/alarm1-1/800/800",
      "https://picsum.photos/seed/alarm1-2/800/800",
      "https://picsum.photos/seed/alarm1-3/800/800"
    ],
    has3D: true,
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    isFeatured: true
  },
  {
    id: "3",
    name: "Trapano Avvitatore 18V",
    price: 89.90,
    category: "Bricolage",
    subcategory: "Elettroutensili",
    image: "https://picsum.photos/seed/drill1/800/800",
    description: "Trapano avvitatore a batteria 18V con 2 batterie incluse. Mandrino autoserrante e luce LED integrata.",
    rating: 4.7,
    reviews: 215,
    specs: {
      "Voltaggio": "18V",
      "Coppia max": "45Nm",
      "Batterie": "2x 2.0Ah",
      "Velocità": "0-1500 rpm"
    },
    gallery: [
      "https://picsum.photos/seed/drill1-1/800/800",
      "https://picsum.photos/seed/drill1-2/800/800",
      "https://picsum.photos/seed/drill1-3/800/800"
    ],
    has3D: true,
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  },
  {
    id: "4",
    name: "Tagliaerba Elettrico 1200W",
    price: 115.00,
    category: "Giardinaggio",
    subcategory: "Tagliaerba",
    image: "https://picsum.photos/seed/mower1/800/800",
    description: "Tagliaerba elettrico compatto e leggero, perfetto per giardini di piccole e medie dimensioni. Altezza taglio regolabile.",
    rating: 4.5,
    reviews: 54,
    specs: {
      "Potenza": "1200W",
      "Larghezza taglio": "32cm",
      "Cesto": "30L",
      "Peso": "8kg"
    },
    gallery: [
      "https://picsum.photos/seed/mower1-1/800/800",
      "https://picsum.photos/seed/mower1-2/800/800",
      "https://picsum.photos/seed/mower1-3/800/800"
    ],
    has3D: true,
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    isFeatured: true
  },
  {
    id: "5",
    name: "Smartphone X100 Pro",
    price: 699.00,
    category: "Elettronica",
    subcategory: "Smartphone",
    image: "https://picsum.photos/seed/phone1/800/800",
    description: "Smartphone di ultima generazione con display OLED 120Hz, tripla fotocamera da 50MP e ricarica ultra-rapida.",
    rating: 4.9,
    reviews: 312,
    specs: {
      "Display": "6.7\" OLED",
      "Processore": "Octa-core 3.2GHz",
      "RAM": "12GB",
      "Memoria": "256GB"
    },
    gallery: [
      "https://picsum.photos/seed/phone1-1/800/800",
      "https://picsum.photos/seed/phone1-2/800/800",
      "https://picsum.photos/seed/phone1-3/800/800"
    ],
    has3D: true,
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  },
  {
    id: "6",
    name: "Smart TV 4K 55\"",
    price: 449.00,
    category: "Elettronica",
    subcategory: "TV",
    image: "https://picsum.photos/seed/tv1/800/800",
    description: "Smart TV 4K HDR con sistema operativo integrato, supporto per tutte le principali app di streaming e audio Dolby Atmos.",
    rating: 4.6,
    reviews: 156,
    specs: {
      "Risoluzione": "4K UHD",
      "Pannello": "LED HDR10+",
      "Audio": "20W Dolby",
      "Smart TV": "Android TV"
    },
    gallery: [
      "https://picsum.photos/seed/tv1-1/800/800",
      "https://picsum.photos/seed/tv1-2/800/800",
      "https://picsum.photos/seed/tv1-3/800/800"
    ],
    has3D: true,
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    isFeatured: true
  },
  {
    id: "7",
    name: "Striscia LED RGB 5mt",
    price: 19.90,
    category: "Illuminazione",
    subcategory: "Strisce LED",
    image: "https://picsum.photos/seed/ledstrip1/800/800",
    description: "Striscia LED RGB multicolore con telecomando e alimentatore inclusi. Adesivo 3M sul retro per facile installazione.",
    rating: 4.6,
    reviews: 312,
    specs: {
      "Lunghezza": "5 metri",
      "LED": "300 SMD 5050",
      "Protezione": "IP65",
      "Controllo": "Telecomando IR"
    },
    gallery: [
      "https://picsum.photos/seed/ledstrip1-1/800/800",
      "https://picsum.photos/seed/ledstrip1-2/800/800",
      "https://picsum.photos/seed/ledstrip1-3/800/800"
    ],
    has3D: true,
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  },
  {
    id: "8",
    name: "Telecamera Wi-Fi Esterna",
    price: 59.00,
    category: "Sicurezza",
    subcategory: "Telecamere",
    image: "https://picsum.photos/seed/cam1/800/800",
    description: "Telecamera di sicurezza per esterni con visione notturna a colori e rilevamento umano AI. Audio bidirezionale.",
    rating: 4.8,
    reviews: 142,
    specs: {
      "Risoluzione": "2K QHD",
      "Visione Notturna": "Fino a 30m",
      "Storage": "MicroSD / Cloud",
      "Impermeabilità": "IP67"
    },
    gallery: [
      "https://picsum.photos/seed/cam1-1/800/800",
      "https://picsum.photos/seed/cam1-2/800/800",
      "https://picsum.photos/seed/cam1-3/800/800"
    ],
    has3D: true,
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  }
];

export const CATEGORIES = ["Tutti", "Illuminazione", "Sicurezza", "Bricolage", "Giardinaggio", "Elettronica"];

export const SUBCATEGORIES: Record<string, string[]> = {
  "Illuminazione": ["Interni", "Esterni", "Strisce LED", "Lampadine", "Smart Light"],
  "Sicurezza": ["Allarmi", "Telecamere", "Serrature Smart", "Sensori"],
  "Elettronica": ["Smartphone", "TV", "Audio", "Informatica"],
  "Bricolage": ["Elettroutensili", "Utensili a mano", "Vernici", "Ferramenta"],
  "Giardinaggio": ["Tagliaerba", "Irrigazione", "Arredo", "Attrezzi"]
};
