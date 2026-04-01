import React, { useState } from "react";
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Download, 
  ExternalLink, 
  Eye, 
  Truck, 
  CheckCircle2, 
  Clock, 
  XCircle,
  MoreVertical,
  Globe,
  ChevronRight,
  X,
  CreditCard,
  MapPin,
  User,
  Package,
  Calendar,
  AlertCircle,
  ChevronDown,
  Hash,
  Printer,
  FileText,
  Tag,
  Box,
  Zap,
  RefreshCw,
  Layers
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const COURIERS = [
  { id: 'gls', name: 'GLS Italy', logo: 'gls' },
  { id: 'dhl', name: 'DHL Express', logo: 'dhl' },
  { id: 'brt', name: 'BRT Corriere Espresso', logo: 'brt' },
  { id: 'poste', name: 'Poste Italiane', logo: 'poste' },
];

export const INITIAL_ORDERS = [
  { id: "BP-2026-881", date: "30 Mar 2026", customer: "Marco Rossi", email: "marco.rossi@example.com", channel: "amazon", total: 124.50, status: "pending", itemsCount: 2, address: "Via Roma 12, 00100 Roma (RM)", payment: "Mastercard **** 4492", trackingId: "", items: [{ id: "1", name: "Faretto LED Incasso 10W", qty: 2, price: 12.90, image: "https://picsum.photos/seed/led1/100/100" }, { id: "7", name: "Striscia LED RGB 5mt", qty: 1, price: 19.90, image: "https://picsum.photos/seed/ledstrip1/100/100" }] },
  { id: "BP-2026-880", date: "30 Mar 2026", customer: "Giulia Bianchi", email: "giulia.b@email.it", channel: "website", total: 89.00, status: "shipped", itemsCount: 1, address: "Corso Milano 45, 20100 Milano (MI)", payment: "PayPal", trackingId: "CH123456789IT", items: [{ id: "3", name: "Trapano Avvitatore 18V", qty: 1, price: 89.90, image: "https://picsum.photos/seed/drill1/100/100" }] },
  { id: "BP-2026-879", date: "29 Mar 2026", customer: "eBay User_99", email: "ebay_user@test.com", channel: "ebay", total: 210.00, status: "delivered", itemsCount: 3, address: "Piazza Garibaldi 1, 80100 Napoli (NA)", payment: "Visa **** 1122", trackingId: "EB987654321IT", items: [] },
  { id: "BP-2026-878", date: "29 Mar 2026", customer: "Alessandro Verri", email: "averri@outlook.it", channel: "amazon", total: 45.90, status: "cancelled", itemsCount: 1, address: "Via Dante 8, 50100 Firenze (FI)", payment: "Amazon Pay", trackingId: "", items: [] },
  { id: "BP-2026-877", date: "28 Mar 2026", customer: "Elena Neri", email: "elena.neri@gmail.com", channel: "website", total: 320.00, status: "shipped", itemsCount: 4, address: "Via Mazzini 22, 10100 Torino (TO)", payment: "Bonifico", trackingId: "BW556677889IT", carrierId: "gls", items: [] },
  { id: "BP-2026-876", date: "28 Mar 2026", customer: "Luca Moretti", email: "l.moretti@email.com", channel: "amazon", total: 55.00, status: "pending", itemsCount: 1, address: "Via Veneto 10, Roma", payment: "Amex", trackingId: "", items: [] },
  { id: "BP-2026-875", date: "27 Mar 2026", customer: "Sara Esposito", email: "sara.e@gmail.com", channel: "ebay", total: 12.90, status: "delivered", itemsCount: 1, address: "Via Toledo 200, Napoli", payment: "Mastercard", trackingId: "IT123123123", items: [] },
  { id: "BP-2026-874", date: "27 Mar 2026", customer: "Pietro Galli", email: "p.galli@test.it", channel: "website", total: 450.00, status: "pending", itemsCount: 5, address: "Via Emilia 1, Parma", payment: "PayPal", trackingId: "", items: [] },
  { id: "BP-2026-873", date: "26 Mar 2026", customer: "Chiara Romano", email: "chiara.r@email.com", channel: "amazon", total: 33.40, status: "shipped", itemsCount: 2, address: "Viale Monza 120, Milano", payment: "Visa", trackingId: "GLS9898987", items: [] },
  { id: "BP-2026-872", date: "26 Mar 2026", customer: "Antonio Bruno", email: "antonio.b@gmail.com", channel: "ebay", total: 110.00, status: "delivered", itemsCount: 2, address: "Via dei Mille 5, Palermo", payment: "Mastercard", trackingId: "EB00012354", items: [] },
  { id: "BP-2026-871", date: "25 Mar 2026", customer: "Marta Greco", email: "marta.g@outlook.com", channel: "website", total: 78.50, status: "delivered", itemsCount: 1, address: "Via Appia 3, Latina", payment: "Visa", trackingId: "P12312399", items: [] },
  { id: "BP-2026-870", date: "25 Mar 2026", customer: "Fabio Colombo", email: "f.colombo@gmail.com", channel: "amazon", total: 19.90, status: "cancelled", itemsCount: 1, address: "Via Larga 2, Milano", payment: "PayPal", trackingId: "", items: [] },
  { id: "BP-2026-869", date: "24 Mar 2026", customer: "Sofia Costa", email: "sofia.costa@email.it", channel: "ebay", total: 245.00, status: "shipped", itemsCount: 3, address: "Via Garibaldi 10, Genova", payment: "Visa", trackingId: "BRT11223344", items: [] },
  { id: "BP-2026-868", date: "24 Mar 2026", customer: "Lorenzo Ricci", email: "lorenzo.r@gmail.com", channel: "website", total: 67.20, status: "pending", itemsCount: 1, address: "Via Roma 100, Firenze", payment: "Amazon Pay", trackingId: "", items: [] },
  { id: "BP-2026-867", date: "23 Mar 2026", customer: "Alice Fontana", email: "alice.f@email.com", channel: "amazon", total: 129.90, status: "delivered", itemsCount: 2, address: "Corso Italia 5, Bologna", payment: "Mastercard", trackingId: "DH00998877", items: [] },
  { id: "BP-2026-866", date: "23 Mar 2026", customer: "Davide Leone", email: "davide.l@gmail.com", channel: "ebay", total: 8.50, status: "delivered", itemsCount: 1, address: "Via San Marco 14, Venezia", payment: "PayPal", trackingId: "IT998877665", items: [] },
  { id: "BP-2026-865", date: "22 Mar 2026", customer: "Anna De Luca", email: "anna.dl@email.it", channel: "website", total: 540.00, status: "shipped", itemsCount: 6, address: "Via Libertà 20, Bari", payment: "Bonifico", trackingId: "PST33445566", carrierId: "poste", items: [] },
  { id: "BP-2026-864", date: "22 Mar 2026", customer: "Giorgio Manzi", email: "g.manzi@gmail.com", channel: "amazon", total: 99.00, status: "cancelled", itemsCount: 1, address: "Via del Corso 30, Roma", payment: "Visa", trackingId: "", items: [] },
  { id: "BP-2026-863", date: "21 Mar 2026", customer: "Paola Serra", email: "paola.s@outlook.it", channel: "ebay", total: 45.20, status: "delivered", itemsCount: 2, address: "Via Dante 12, Cagliari", payment: "Mastercard", trackingId: "EB554433221", items: [] },
  { id: "BP-2026-862", date: "21 Mar 2026", customer: "Ruggero Riva", email: "r.riva@email.com", channel: "website", total: 15.00, status: "delivered", itemsCount: 1, address: "Via Valtellina 8, Sondrio", payment: "Visa", trackingId: "IT887766554", items: [] },
  { id: "BP-2026-861", date: "20 Mar 2026", customer: "Silvia Galli", email: "silvia.g@gmail.com", channel: "amazon", total: 32.10, status: "pending", itemsCount: 1, address: "Via dei Laghi 4, Como", payment: "PayPal", trackingId: "", items: [] },
  { id: "BP-2026-860", date: "20 Mar 2026", customer: "Roberto Pozzi", email: "r.pozzi@email.it", channel: "ebay", total: 21.00, status: "delivered", itemsCount: 1, address: "Via Matteotti 3, Varese", payment: "Mastercard", trackingId: "IT111222333", items: [] },
];

interface AdminOrdersProps {
  orders: any[];
  setOrders: React.Dispatch<React.SetStateAction<any[]>>;
  pageSettings?: any;
}

export const AdminOrders = ({ 
  orders, 
  setOrders,
  pageSettings
}: AdminOrdersProps) => {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [carrierSelectorId, setCarrierSelectorId] = useState<string | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [channelFilter, setChannelFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [trackingModalOrder, setTrackingModalOrder] = useState<any | null>(null);
  const [tempTrackingId, setTempTrackingId] = useState("");


  const parseOrderDate = (dateStr: string) => {
    // Gestisce formati come "30 Mar 2026", "01 apr 2026", "15 Mag 2026" ecc.
    const months: { [key: string]: number } = {
      'jan': 0, 'gen': 0,
      'feb': 1,
      'mar': 2,
      'apr': 3,
      'may': 4, 'mag': 4,
      'jun': 5, 'giu': 5,
      'jul': 6, 'lug': 6,
      'aug': 7, 'ago': 7,
      'sep': 8, 'set': 8,
      'oct': 9, 'ott': 9,
      'nov': 10,
      'dec': 11, 'dic': 11
    };
    const parts = dateStr.replace('.', '').split(' '); // Rimuove eventuali punti (es. "apr.")
    if (parts.length !== 3) return new Date();
    const day = parseInt(parts[0]);
    const monthKey = parts[1].toLowerCase().substring(0, 3);
    const month = months[monthKey] !== undefined ? months[monthKey] : 0;
    const year = parseInt(parts[2]);
    return new Date(year, month, day);
  };

  const selectedOrder = orders.find(o => o.id === selectedOrderId);

  const handleStatusChange = (order: any, newStatus: string) => {
    if (newStatus === 'shipped') {
      setTrackingModalOrder(order);
      setTempTrackingId(order.trackingId || "");
    } else {
      updateOrderStatus(order.id, newStatus);
    }
  };

  const confirmShipping = () => {
    if (!trackingModalOrder) return;
    updateOrderStatus(trackingModalOrder.id, 'shipped');
    updateTrackingId(trackingModalOrder.id, tempTrackingId);
    setTrackingModalOrder(null);
    setTempTrackingId("");
  };

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setIsUpdatingStatus(true);
    setUpdatingOrderId(orderId);
    setTimeout(() => {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      setIsUpdatingStatus(false);
      setUpdatingOrderId(null);
    }, 800);
  };

  const updateTrackingId = (orderId: string, trackingId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, trackingId } : o));
  };

  const updateOrderCarrier = (orderId: string, carrierId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, carrierId } : o));
    setCarrierSelectorId(null);
  };

  // ── RESET TUTTI I FILTRI ───────────────────────────────────────────
  const resetAllFilters = () => {
    setFilter('all');
    setSearch('');
    setStartDate('');
    setEndDate('');
    setChannelFilter('all');
    setPaymentFilter('all');
  };

  const isAnyFilterActive = filter !== 'all' || search !== '' || startDate !== '' || endDate !== '' || channelFilter !== 'all' || paymentFilter !== 'all';

  // ── STAMPA PIU' ORDINI SELEZIONATI (= filtrati) — un ordine per pagina ────
  const handlePrintSelectedOrders = () => {
    const ordersToPrint = filteredOrders;
    if (ordersToPrint.length === 0) return;

    const win = window.open('', '_blank', 'width=900,height=750');
    if (!win) return;

    const statusLabel = (s: string) =>
      s === 'pending' ? 'In Attesa' : s === 'shipped' ? 'In Spedizione' : s === 'delivered' ? 'Consegnato' : 'Annullato';
    const statusBg = (s: string) =>
      s === 'pending' ? '#fff7ed' : s === 'shipped' ? '#eff6ff' : s === 'delivered' ? '#f0fdf4' : '#fef2f2';
    const statusColor = (s: string) =>
      s === 'pending' ? '#ea580c' : s === 'shipped' ? '#2563eb' : s === 'delivered' ? '#16a34a' : '#dc2626';

    const orderPageHTML = (order: any, isLast: boolean) => {
      const items = order.items || [];
      const itemsHTML = items.map((item: any) => `
        <tr>
          <td style="padding:8px 4px;border-bottom:1px solid #f0f0f0;">
            ${item.image
              ? `<img src="${item.image}" style="width:36px;height:36px;object-fit:contain;border-radius:4px;border:1px solid #eee;"/>`
              : '<div style="width:36px;height:36px;background:#f5f5f5;border-radius:4px;"></div>'}
          </td>
          <td style="padding:8px 4px;border-bottom:1px solid #f0f0f0;">
            <strong style="font-size:12px;color:#0a0a0a;">${item.name}</strong>
            <div style="font-size:9px;color:#aaa;text-transform:uppercase;letter-spacing:1px;">SKU-${String(item.id).padStart(4,'0')}</div>
          </td>
          <td style="padding:8px 4px;border-bottom:1px solid #f0f0f0;text-align:center;font-size:12px;">&euro;${Number(item.price).toFixed(2)}</td>
          <td style="padding:8px 4px;border-bottom:1px solid #f0f0f0;text-align:center;">
            <span style="background:#f5f5f5;border-radius:4px;padding:2px 8px;font-size:11px;font-weight:900;">${item.qty}</span>
          </td>
          <td style="padding:8px 4px;border-bottom:1px solid #f0f0f0;text-align:right;font-weight:900;font-size:12px;">&euro;${(Number(item.price)*Number(item.qty)).toFixed(2)}</td>
        </tr>
      `).join('');

      const emptyRow = items.length === 0
        ? '<tr><td colspan="5" style="padding:24px;text-align:center;color:#aaa;font-size:11px;">Dettaglio prodotti non disponibile</td></tr>'
        : '';

      const courierName = COURIERS.find(c => c.id === order.carrierId)?.name || '—';

      return `
<div style="padding:28px 32px;${!isLast ? 'page-break-after:always;' : ''}">
  <!-- HEADER -->
  <div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:16px;border-bottom:3px solid #ffd600;margin-bottom:20px;">
    <div style="display:flex;align-items:center;gap:14px;">
      <div style="width:52px;height:52px;background:#ffd600;border-radius:10px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:22px;font-style:italic;">B</div>
      <div>
        <div style="font-weight:900;font-size:20px;text-transform:uppercase;letter-spacing:-0.5px;font-style:italic;">BesPoint</div>
        <div style="font-size:9px;color:#888;text-transform:uppercase;letter-spacing:1px;margin-top:2px;">Documento Interno — Riepilogo Ordine</div>
      </div>
    </div>
    <div style="text-align:right;">
      <div style="font-size:9px;color:#888;text-transform:uppercase;letter-spacing:1px;">N° Ordine</div>
      <div style="font-size:22px;font-weight:900;letter-spacing:-1px;">${order.id}</div>
      <div style="font-size:9px;color:#888;text-transform:uppercase;margin-top:2px;">${order.date} via ${order.channel}</div>
    </div>
  </div>

  <!-- STATO -->
  <div style="background:${statusBg(order.status)};border:1px solid ${statusColor(order.status)}33;border-radius:8px;padding:10px 16px;margin-bottom:16px;display:flex;justify-content:space-between;align-items:center;">
    <div style="font-size:9px;color:#888;text-transform:uppercase;letter-spacing:1px;">Stato Ordine</div>
    <div style="font-weight:900;font-size:13px;color:${statusColor(order.status)};text-transform:uppercase;letter-spacing:1px;">${statusLabel(order.status)}</div>
  </div>

  <!-- CLIENTE + INDIRIZZO -->
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px;">
    <div style="background:#fafafa;border:1px solid #eee;border-radius:8px;padding:12px;">
      <div style="font-size:8px;font-weight:900;text-transform:uppercase;letter-spacing:1px;color:#888;margin-bottom:6px;">Cliente</div>
      <div style="font-weight:900;font-size:14px;">${order.customer}</div>
      <div style="font-size:10px;color:#555;margin-top:2px;">${order.email}</div>
      <div style="font-size:10px;color:#2563eb;font-weight:700;">${order.phone || '—'}</div>
    </div>
    <div style="background:#fafafa;border:1px solid #eee;border-radius:8px;padding:12px;">
      <div style="font-size:8px;font-weight:900;text-transform:uppercase;letter-spacing:1px;color:#888;margin-bottom:6px;">Destinazione merce</div>
      <div style="font-weight:700;font-size:12px;">${order.address}</div>
      ${order.notes ? `<div style="font-size:9px;color:#ca8a04;margin-top:6px;font-weight:700;">NOTE: ${order.notes}</div>` : ''}
    </div>
  </div>

  <!-- PAGAMENTO + CORRIERE -->
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px;">
    <div style="background:#0a0a0a;color:white;border-radius:8px;padding:10px 16px;">
      <div style="font-size:8px;color:#888;text-transform:uppercase;letter-spacing:1px;">Metodo di Pagamento</div>
      <div style="font-weight:900;font-size:13px;color:#ffd600;margin-top:4px;">${order.payment || '—'}</div>
    </div>
    <div style="background:#f8fafc;border:1px solid #eee;border-radius:8px;padding:10px 16px;">
      <div style="font-size:8px;color:#888;text-transform:uppercase;letter-spacing:1px;">Corriere</div>
      <div style="font-weight:900;font-size:13px;color:#0a0a0a;margin-top:4px;">${courierName}</div>
      ${order.trackingId ? `<div style="font-size:9px;color:#2563eb;font-weight:700;margin-top:2px;">Track: ${order.trackingId}</div>` : ''}
    </div>
  </div>

  <!-- PRODOTTI -->
  <table style="width:100%;border-collapse:collapse;">
    <thead><tr style="background:#f5f5f5;">
      <th style="padding:8px 4px;font-size:9px;color:#888;text-transform:uppercase;letter-spacing:1px;font-weight:700;width:44px;"></th>
      <th style="padding:8px 4px;font-size:9px;color:#888;text-transform:uppercase;letter-spacing:1px;font-weight:700;text-align:left;">Articolo</th>
      <th style="padding:8px 4px;font-size:9px;color:#888;text-transform:uppercase;letter-spacing:1px;font-weight:700;text-align:center;">Prezzo</th>
      <th style="padding:8px 4px;font-size:9px;color:#888;text-transform:uppercase;letter-spacing:1px;font-weight:700;text-align:center;">Qt</th>
      <th style="padding:8px 4px;font-size:9px;color:#888;text-transform:uppercase;letter-spacing:1px;font-weight:700;text-align:right;">Totale</th>
    </tr></thead>
    <tbody>${itemsHTML}${emptyRow}</tbody>
  </table>

  <!-- TOTALI -->
  <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px;margin-top:16px;padding-top:12px;border-top:2px solid #f0f0f0;">
    <div style="display:flex;justify-content:space-between;width:200px;font-size:10px;color:#888;">
      <span>Subtotale</span><span style="color:#0a0a0a;font-weight:700;">&euro;${order.total.toFixed(2)}</span>
    </div>
    <div style="display:flex;justify-content:space-between;width:200px;font-size:10px;color:#16a34a;font-weight:700;">
      <span>Spedizione</span><span>&euro;0,00</span>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;width:220px;background:#ffd600;padding:10px 16px;border-radius:10px;margin-top:4px;">
      <span style="font-weight:900;font-size:10px;text-transform:uppercase;letter-spacing:1px;">Totale Ordine</span>
      <span style="font-weight:900;font-size:18px;">&euro;${order.total.toFixed(2)}</span>
    </div>
  </div>

  <!-- FOOTER -->
  <div style="margin-top:28px;padding-top:10px;border-top:1px solid #eee;font-size:8px;color:#aaa;display:flex;justify-content:space-between;">
    <span>Documento interno — ${new Date().toLocaleString('it-IT')}</span>
    <span>BesPoint Admin — ${order.id}</span>
  </div>
</div>`;
    };

    const allPagesHTML = ordersToPrint.map((o, i) => orderPageHTML(o, i === ordersToPrint.length - 1)).join('\n');

    win.document.write(`<!DOCTYPE html>
<html lang="it"><head><meta charset="UTF-8">
<title>Ordini Selezionati — BesPoint (${ordersToPrint.length})</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');
  * { margin:0;padding:0;box-sizing:border-box; }
  body { font-family:'Inter',sans-serif;color:#0a0a0a;background:white; }
  @media print {
    @page { size:A4 portrait;margin:0; }
    body { background:white; }
  }
</style></head>
<body>${allPagesHTML}</body></html>`);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 800);
  };

  const handlePrintList = () => {
    const win = window.open('', '_blank', 'width=1000,height=750');
    if (!win) return;

    const statusLabel = (s: string) =>
      s === 'pending' ? 'In Attesa' : s === 'shipped' ? 'Spedito' : s === 'delivered' ? 'Consegnato' : 'Annullato';
    const statusColor = (s: string) =>
      s === 'pending' ? '#ea580c' : s === 'shipped' ? '#2563eb' : s === 'delivered' ? '#16a34a' : '#dc2626';

    const filterSummary = [
      filter !== 'all' ? `Stato: ${statusLabel(filter)}` : null,
      channelFilter !== 'all' ? `Canale: ${channelFilter}` : null,
      paymentFilter !== 'all' ? `Pagamento: ${paymentFilter}` : null,
      (startDate || endDate) ? `Date: ${startDate || '...'} → ${endDate || '...'}` : null,
      search ? `Ricerca: "${search}"` : null,
    ].filter(Boolean).join(' | ');

    const rowsHTML = filteredOrders.map((o, i) => `
      <tr style="background:${i % 2 === 0 ? '#fff' : '#fafafa'}">
        <td style="padding:10px 6px;font-size:11px;font-weight:900;color:#0a0a0a;border-bottom:1px solid #f0f0f0;">${o.id}</td>
        <td style="padding:10px 6px;font-size:10px;font-weight:700;color:#555;border-bottom:1px solid #f0f0f0;">${o.date}</td>
        <td style="padding:10px 6px;border-bottom:1px solid #f0f0f0;">
          <div style="font-weight:900;font-size:11px;color:#0a0a0a;">${o.customer}</div>
          <div style="font-size:9px;color:#aaa;">${o.email}</div>
        </td>
        <td style="padding:10px 6px;font-size:10px;font-weight:900;text-transform:uppercase;color:#0a0a0a;border-bottom:1px solid #f0f0f0;">${o.channel}</td>
        <td style="padding:10px 6px;font-size:10px;color:#555;border-bottom:1px solid #f0f0f0;">${o.payment || '—'}</td>
        <td style="padding:10px 6px;font-size:10px;color:#555;border-bottom:1px solid #f0f0f0;">${o.trackingId || '—'}</td>
        <td style="padding:10px 6px;text-align:right;font-weight:900;font-size:12px;color:#0a0a0a;border-bottom:1px solid #f0f0f0;">€${o.total.toFixed(2)}</td>
        <td style="padding:10px 6px;text-align:center;border-bottom:1px solid #f0f0f0;">
          <span style="font-size:9px;font-weight:900;text-transform:uppercase;letter-spacing:1px;padding:3px 8px;border-radius:99px;border:1px solid;color:${statusColor(o.status)};border-color:${statusColor(o.status)};">${statusLabel(o.status)}</span>
        </td>
      </tr>
    `).join('');

    const totalFiltered = filteredOrders.reduce((s, o) => s + o.total, 0);

    win.document.write(`<!DOCTYPE html>
<html lang="it"><head><meta charset="UTF-8">
<title>Lista Ordini — BesPoint</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');
  * { margin:0;padding:0;box-sizing:border-box; }
  body { font-family:'Inter',sans-serif;color:#0a0a0a;padding:28px 32px;background:white; }
  table { width:100%;border-collapse:collapse; }
  @media print { @page { size:A4 landscape;margin:10mm 12mm; } body { padding:0; } }
</style></head><body>
<div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:14px;border-bottom:3px solid #ffd600;margin-bottom:18px;">
  <div>
    <div style="font-weight:900;font-size:22px;text-transform:uppercase;letter-spacing:-1px;font-style:italic;">BesPoint</div>
    <div style="font-size:9px;color:#888;text-transform:uppercase;letter-spacing:1px;margin-top:3px;">Lista Ordini — Generata il ${new Date().toLocaleDateString('it-IT', {day:'2-digit',month:'long',year:'numeric'})}</div>
    ${filterSummary ? `<div style="font-size:9px;color:#2563eb;font-weight:700;margin-top:4px;">Filtri attivi: ${filterSummary}</div>` : ''}
  </div>
  <div style="text-align:right;">
    <div style="font-size:11px;color:#888;">Ordini visualizzati</div>
    <div style="font-size:28px;font-weight:900;">${filteredOrders.length}</div>
    <div style="font-size:11px;color:#888;">Totale: <strong style="color:#0a0a0a">€${totalFiltered.toFixed(2)}</strong></div>
  </div>
</div>
<table>
  <thead><tr style="background:#0a0a0a;">
    <th style="padding:10px 6px;font-size:9px;font-weight:900;text-transform:uppercase;letter-spacing:1px;color:#ffd600;text-align:left;">ID Ordine</th>
    <th style="padding:10px 6px;font-size:9px;font-weight:900;text-transform:uppercase;letter-spacing:1px;color:#ffd600;text-align:left;">Data</th>
    <th style="padding:10px 6px;font-size:9px;font-weight:900;text-transform:uppercase;letter-spacing:1px;color:#ffd600;text-align:left;">Cliente</th>
    <th style="padding:10px 6px;font-size:9px;font-weight:900;text-transform:uppercase;letter-spacing:1px;color:#ffd600;text-align:left;">Canale</th>
    <th style="padding:10px 6px;font-size:9px;font-weight:900;text-transform:uppercase;letter-spacing:1px;color:#ffd600;text-align:left;">Pagamento</th>
    <th style="padding:10px 6px;font-size:9px;font-weight:900;text-transform:uppercase;letter-spacing:1px;color:#ffd600;text-align:left;">Tracking</th>
    <th style="padding:10px 6px;font-size:9px;font-weight:900;text-transform:uppercase;letter-spacing:1px;color:#ffd600;text-align:right;">Totale</th>
    <th style="padding:10px 6px;font-size:9px;font-weight:900;text-transform:uppercase;letter-spacing:1px;color:#ffd600;text-align:center;">Stato</th>
  </tr></thead>
  <tbody>${rowsHTML}</tbody>
</table>
<div style="margin-top:20px;padding-top:12px;border-top:2px solid #f0f0f0;display:flex;justify-content:flex-end;">
  <div style="background:#ffd600;padding:10px 24px;border-radius:10px;display:flex;gap:24px;align-items:center;">
    <span style="font-size:10px;font-weight:900;text-transform:uppercase;">Totale Complessivo</span>
    <span style="font-size:20px;font-weight:900;">€${totalFiltered.toFixed(2)}</span>
  </div>
</div>
</body></html>`);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 600);
  };

  // ── STAMPA SINGOLO ORDINE (formato Proforma) ─────────────────────────
  const handlePrintSingleOrder = (order: any) => {
    const win = window.open('', '_blank', 'width=900,height=700');
    if (!win) return;

    const itemsHTML = (order.items || []).map((item: any) => `
      <tr>
        <td style="padding:8px 4px;border-bottom:1px solid #f0f0f0;">
          ${item.image ? `<img src="${item.image}" style="width:36px;height:36px;object-fit:contain;border-radius:4px;border:1px solid #eee;"/>` : '<div style="width:36px;height:36px;background:#f5f5f5;border-radius:4px;"></div>'}
        </td>
        <td style="padding:8px 4px;border-bottom:1px solid #f0f0f0;">
          <strong style="font-size:12px;color:#0a0a0a;">${item.name}</strong>
          <div style="font-size:9px;color:#aaa;text-transform:uppercase;letter-spacing:1px;">SKU-${String(item.id).padStart(4,'0')}</div>
        </td>
        <td style="padding:8px 4px;border-bottom:1px solid #f0f0f0;text-align:center;font-size:12px;">€${Number(item.price).toFixed(2)}</td>
        <td style="padding:8px 4px;border-bottom:1px solid #f0f0f0;text-align:center;">
          <span style="background:#f5f5f5;border-radius:4px;padding:2px 8px;font-size:11px;font-weight:900;">${item.qty}</span>
        </td>
        <td style="padding:8px 4px;border-bottom:1px solid #f0f0f0;text-align:right;font-weight:900;font-size:12px;">€${(Number(item.price)*Number(item.qty)).toFixed(2)}</td>
      </tr>
    `).join('');

    const emptyItemsHTML = (order.items || []).length === 0
      ? `<tr><td colspan="5" style="padding:24px;text-align:center;color:#aaa;font-size:11px;">Dettaglio prodotti non disponibile</td></tr>`
      : '';

    const courierName = COURIERS.find(c => c.id === order.carrierId)?.name || '—';
    const statusLabel = order.status === 'pending' ? 'In Attesa' : order.status === 'shipped' ? 'In Spedizione' : order.status === 'delivered' ? 'Consegnato' : 'Annullato';
    const statusBg = order.status === 'pending' ? '#fff7ed' : order.status === 'shipped' ? '#eff6ff' : order.status === 'delivered' ? '#f0fdf4' : '#fef2f2';
    const statusColor = order.status === 'pending' ? '#ea580c' : order.status === 'shipped' ? '#2563eb' : order.status === 'delivered' ? '#16a34a' : '#dc2626';

    win.document.write(`<!DOCTYPE html>
<html lang="it"><head><meta charset="UTF-8">
<title>Ordine ${order.id} — BesPoint</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');
  * { margin:0;padding:0;box-sizing:border-box; }
  body { font-family:'Inter',sans-serif;color:#0a0a0a;padding:28px 32px;background:white; }
  table { width:100%;border-collapse:collapse; }
  @media print { @page { size:A4 portrait;margin:12mm 14mm; } body { padding:0; } }
</style></head><body>
<!-- HEADER -->
<div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:16px;border-bottom:3px solid #ffd600;margin-bottom:20px;">
  <div style="display:flex;align-items:center;gap:14px;">
    <div style="width:52px;height:52px;background:#ffd600;border-radius:10px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:22px;font-style:italic;">B</div>
    <div>
      <div style="font-weight:900;font-size:20px;text-transform:uppercase;letter-spacing:-0.5px;font-style:italic;">BesPoint</div>
      <div style="font-size:9px;color:#888;text-transform:uppercase;letter-spacing:1px;margin-top:2px;">Documento Interno — Riepilogo Ordine</div>
    </div>
  </div>
  <div style="text-align:right;">
    <div style="font-size:9px;color:#888;text-transform:uppercase;letter-spacing:1px;">N° Ordine</div>
    <div style="font-size:22px;font-weight:900;letter-spacing:-1px;">${order.id}</div>
    <div style="font-size:9px;color:#888;text-transform:uppercase;margin-top:2px;">${order.date} via ${order.channel}</div>
  </div>
</div>
<!-- STATO ORDINE -->
<div style="background:${statusBg};border:1px solid ${statusColor}22;border-radius:8px;padding:10px 16px;margin-bottom:16px;display:flex;justify-content:space-between;align-items:center;">
  <div style="font-size:9px;color:#888;text-transform:uppercase;letter-spacing:1px;">Stato Ordine</div>
  <div style="font-weight:900;font-size:14px;color:${statusColor};text-transform:uppercase;letter-spacing:1px;">${statusLabel}</div>
</div>
<!-- ANAGRAFICA + SPEDIZIONE -->
<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px;">
  <div style="background:#fafafa;border:1px solid #eee;border-radius:8px;padding:12px;">
    <div style="font-size:8px;font-weight:900;text-transform:uppercase;letter-spacing:1px;color:#888;margin-bottom:6px;">Cliente</div>
    <div style="font-weight:900;font-size:14px;">${order.customer}</div>
    <div style="font-size:10px;color:#555;margin-top:2px;">${order.email}</div>
    <div style="font-size:10px;color:#2563eb;font-weight:700;">${order.phone || '—'}</div>
  </div>
  <div style="background:#fafafa;border:1px solid #eee;border-radius:8px;padding:12px;">
    <div style="font-size:8px;font-weight:900;text-transform:uppercase;letter-spacing:1px;color:#888;margin-bottom:6px;">Destinazione merce</div>
    <div style="font-weight:700;font-size:12px;">${order.address}</div>
    ${order.notes ? `<div style="font-size:9px;color:#ca8a04;margin-top:6px;font-weight:700;">NOTE: ${order.notes}</div>` : ''}
  </div>
</div>
<!-- PAGAMENTO + CORRIERE -->
<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px;">
  <div style="background:#0a0a0a;color:white;border-radius:8px;padding:10px 16px;">
    <div style="font-size:8px;color:#888;text-transform:uppercase;letter-spacing:1px;">Metodo di Pagamento</div>
    <div style="font-weight:900;font-size:13px;color:#ffd600;margin-top:4px;">${order.payment || '—'}</div>
  </div>
  <div style="background:#f8fafc;border:1px solid #eee;border-radius:8px;padding:10px 16px;">
    <div style="font-size:8px;color:#888;text-transform:uppercase;letter-spacing:1px;">Corriere</div>
    <div style="font-weight:900;font-size:13px;color:#0a0a0a;margin-top:4px;">${courierName}</div>
    ${order.trackingId ? `<div style="font-size:9px;color:#2563eb;font-weight:700;margin-top:2px;">Track: ${order.trackingId}</div>` : ''}
  </div>
</div>
<!-- PRODOTTI -->
<table>
  <thead><tr style="background:#f5f5f5;">
    <th style="padding:8px 4px;font-size:9px;color:#888;text-transform:uppercase;letter-spacing:1px;font-weight:700;width:44px;"></th>
    <th style="padding:8px 4px;font-size:9px;color:#888;text-transform:uppercase;letter-spacing:1px;font-weight:700;text-align:left;">Articolo</th>
    <th style="padding:8px 4px;font-size:9px;color:#888;text-transform:uppercase;letter-spacing:1px;font-weight:700;text-align:center;">Prezzo</th>
    <th style="padding:8px 4px;font-size:9px;color:#888;text-transform:uppercase;letter-spacing:1px;font-weight:700;text-align:center;">Qt</th>
    <th style="padding:8px 4px;font-size:9px;color:#888;text-transform:uppercase;letter-spacing:1px;font-weight:700;text-align:right;">Totale</th>
  </tr></thead>
  <tbody>${itemsHTML}${emptyItemsHTML}</tbody>
</table>
<!-- TOTALI -->
<div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px;margin-top:16px;padding-top:12px;border-top:2px solid #f0f0f0;">
  <div style="display:flex;justify-content:space-between;width:200px;font-size:10px;color:#888;">
    <span>Subtotale</span><span style="color:#0a0a0a;font-weight:700;">€${order.total.toFixed(2)}</span>
  </div>
  <div style="display:flex;justify-content:space-between;width:200px;font-size:10px;color:#16a34a;font-weight:700;">
    <span>Spedizione</span><span>€0,00</span>
  </div>
  <div style="display:flex;justify-content:space-between;align-items:center;width:220px;background:#ffd600;padding:10px 16px;border-radius:10px;margin-top:4px;">
    <span style="font-weight:900;font-size:10px;text-transform:uppercase;letter-spacing:1px;">Totale Ordine</span>
    <span style="font-weight:900;font-size:18px;">€${order.total.toFixed(2)}</span>
  </div>
</div>
<!-- FOOTER -->
<div style="margin-top:32px;padding-top:12px;border-top:1px solid #eee;font-size:8px;color:#aaa;display:flex;justify-content:space-between;">
  <span>Documento interno — Generato il ${new Date().toLocaleString('it-IT')}</span>
  <span>BesPoint Admin — ${order.id}</span>
</div>
</body></html>`);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 600);
  };


  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'pending': return "bg-orange-100 text-orange-600 border-orange-200";
      case 'shipped': return "bg-blue-100 text-blue-600 border-blue-200";
      case 'delivered': return "bg-green-100 text-green-600 border-green-200";
      case 'cancelled': return "bg-red-100 text-red-600 border-red-200";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const getChannelIcon = (channel: string) => {
    const c = (channel || "").toLowerCase();
    switch(c) {
      case 'amazon': return <img src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg" className="w-4 h-4" alt="Amazon" />;
      case 'ebay': return <img src="https://upload.wikimedia.org/wikipedia/commons/1/1b/EBay_logo.svg" className="w-4 h-4" alt="eBay" />;
      case 'tiktok': return <img src="https://upload.wikimedia.org/wikipedia/commons/a/a2/TikTok_logo.svg" className="w-4 h-4" alt="TikTok" />;
      case 'web':
      case 'website': return <Globe className="w-4 h-4 text-brand-dark" />;
      default: return <ShoppingBag className="w-4 h-4 text-brand-blue" />;
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesFilter = filter === 'all' || o.status === filter;
    const matchesSearch = o.customer.toLowerCase().includes(search.toLowerCase()) || 
                          o.id.toLowerCase().includes(search.toLowerCase());
    
    // Filtro Data
    let matchesDate = true;
    if (startDate || endDate) {
      const orderDate = parseOrderDate(o.date);
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0,0,0,0);
        if (orderDate < start) matchesDate = false;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23,59,59,999);
        if (orderDate > end) matchesDate = false;
      }
    }

    // Filtro Canale con Sincronizzazione Real Backend Categories
    let matchesChannel = true;
    if (channelFilter !== 'all') {
      const orderChan = (o.channel || "").toLowerCase();
      if (channelFilter === 'web' || channelFilter === 'website') {
        matchesChannel = orderChan === 'web' || orderChan === 'website';
      } else {
        matchesChannel = orderChan === channelFilter.toLowerCase();
      }
    }

    // Filtro Pagamento
    let matchesPayment = true;
    if (paymentFilter !== 'all') {
      // mapping payment names based on simulation or initial data
      if (paymentFilter === 'bonifico') matchesPayment = o.payment?.toLowerCase().includes('bonifico') || o.paymentType === 'bank';
      else if (paymentFilter === 'cod') matchesPayment = o.payment?.toLowerCase().includes('contrassegno') || o.paymentType === 'cod';
      else if (paymentFilter === 'stripe') matchesPayment = o.payment?.toLowerCase().includes('stripe') || o.paymentType === 'stripe';
      else if (paymentFilter === 'paypal') matchesPayment = o.payment?.toLowerCase().includes('paypal') || o.paymentType === 'paypal';
    }

    return matchesFilter && matchesSearch && matchesDate && matchesChannel && matchesPayment;
  });

  const getCourierIcon = (logo: string, className: string = "w-10 h-10") => {
    switch (logo) {
      case 'gls': return <Truck className={`${className} text-blue-600`} />;
      case 'dhl': return <Zap className={`${className} text-yellow-600`} />;
      case 'brt': return <Box className={`${className} text-red-600`} />;
      case 'poste': return <Globe className={`${className} text-yellow-600`} />;
      default: return <Truck className={`${className} text-gray-400`} />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Page Title */}
      <div className="mb-2">
        <h2 className="text-3xl font-black text-brand-dark uppercase tracking-tighter">Gestione Ordini</h2>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Monitora e gestisci le spedizioni del tuo store</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Ordini Totali", val: orders.length.toString(), sub: "+12% vs ieri", icon: ShoppingBag, color: "text-brand-dark" },
          { label: "In Attesa", val: orders.filter(o => o.status === 'pending').length.toString(), sub: "Da spedire oggi", icon: Clock, color: "text-orange-500" },
          { label: "In Consegna", val: orders.filter(o => o.status === 'shipped').length.toString(), sub: "In transito", icon: Truck, color: "text-blue-500" },
          { label: "Completati", val: orders.filter(o => o.status === 'delivered').length.toString(), sub: "Mese Corrente", icon: CheckCircle2, color: "text-green-500" },
        ].map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-gray-100 transition-all group overflow-hidden relative">
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

      <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-xl shadow-brand-dark/5 space-y-8">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8 border-b border-gray-100 pb-8">
          <div className="relative w-full lg:w-[35rem] group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 w-6 h-6 group-focus-within:text-brand-dark transition-colors" />
            <input 
              type="text" 
              placeholder="Cerca ordine, cliente, SKU o n. tracking..." 
              className="w-full pl-16 pr-6 py-5 bg-gray-50 border-transparent rounded-[2rem] text-sm font-bold focus:ring-8 focus:ring-brand-yellow/10 focus:bg-white focus:border-brand-yellow/30 transition-all shadow-inner"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <button onClick={handlePrintList} className="px-8 py-5 bg-brand-dark text-brand-yellow rounded-2xl hover:bg-black active:scale-95 transition-all flex items-center gap-3 shadow-lg shadow-brand-dark/20">
              <Printer className="w-5 h-5" />
              <span className="text-[11px] font-black uppercase tracking-widest whitespace-nowrap">Stampa Lista</span>
            </button>
            <button
              onClick={handlePrintSelectedOrders}
              disabled={filteredOrders.length === 0}
              title={`Stampa ${filteredOrders.length} ordini filtrati (uno per pagina)`}
              className={`px-6 py-5 rounded-2xl active:scale-95 transition-all flex items-center gap-3 border-2 relative ${
                filteredOrders.length > 0
                  ? 'bg-white border-brand-dark text-brand-dark hover:bg-brand-dark hover:text-brand-yellow shadow-lg shadow-brand-dark/10'
                  : 'bg-gray-50 border-gray-200 text-gray-300 cursor-not-allowed'
              }`}
            >
              <FileText className="w-5 h-5" />
              <span className="text-[11px] font-black uppercase tracking-widest whitespace-nowrap">Stampa Dettaglio</span>
              {filteredOrders.length > 0 && (
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-brand-yellow text-brand-dark rounded-full text-[10px] font-black flex items-center justify-center shadow-md">
                  {filteredOrders.length}
                </span>
              )}
            </button>
            <button onClick={() => {
                const headers = ["ID", "Data", "Cliente", "Email", "Piattaforma", "Totale", "Stato", "Metodo Pagamento", "Tracking", "Indirizzo"];
                const rows = filteredOrders.map(o => [o.id, o.date, `"${o.customer}"`, o.email, o.channel, o.total.toFixed(2), o.status, o.payment || "N/A", o.trackingId || "", `"${o.address}"`]);
                const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
                const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.setAttribute('hidden', ''); a.setAttribute('href', url);
                a.setAttribute('download', `ordini_bespoint_${new Date().toISOString().split('T')[0]}.csv`);
                document.body.appendChild(a); a.click(); document.body.removeChild(a);
              }} className="px-8 py-5 bg-white border-2 border-brand-dark text-brand-dark rounded-2xl hover:bg-gray-50 active:scale-95 transition-all flex items-center gap-3">
              <FileText className="w-5 h-5 text-green-600" />
              <span className="text-[11px] font-black uppercase tracking-widest whitespace-nowrap">Esporta CSV</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          {/* Reset Filtri */}
          <AnimatePresence>
            {isAnyFilterActive && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8, x: -10 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: -10 }}
                onClick={resetAllFilters}
                className="flex items-center gap-2 px-4 py-2.5 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-100 active:scale-95 transition-all"
              >
                <X className="w-3.5 h-3.5" />
                Reset Filtri
              </motion.button>
            )}
          </AnimatePresence>
          <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100 items-center">
            <Tag className="w-4 h-4 text-gray-400 ml-3 mr-1" />
            <div className="flex">
              {['all', 'pending', 'shipped', 'cancelled'].map((f) => (
                <button 
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-brand-dark text-brand-yellow shadow-lg' : 'text-gray-400 hover:text-brand-dark'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="h-8 w-px bg-gray-200 hidden lg:block mx-2"></div>
          <div className="flex items-center gap-3 bg-gray-50 px-5 py-3 rounded-2xl border border-gray-100 hover:border-gray-300 transition-all">
             <Calendar className="w-5 h-5 text-brand-dark" />
             <div className="flex items-center gap-3">
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest focus:ring-0 p-0 w-28 text-brand-dark" title="Da" />
                <span className="text-gray-300 font-bold">→</span>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest focus:ring-0 p-0 w-28 text-brand-dark" title="A" />
             </div>
             {(startDate || endDate) && (
               <button onClick={() => { setStartDate(""); setEndDate(""); }} className="p-1.5 hover:bg-gray-200 rounded-full transition-colors">
                 <X className="w-4 h-4 text-gray-400" />
               </button>
             )}
          </div>
          <div className="flex bg-gray-50 px-5 py-3 rounded-2xl border border-gray-100 items-center hover:border-gray-300 transition-all">
             <Layers className="w-5 h-5 text-brand-dark mr-2" />
             <select 
               value={channelFilter}
               onChange={(e) => { 
                 setChannelFilter(e.target.value); 
                 if (e.target.value !== 'web' && e.target.value !== 'website') setPaymentFilter('all'); 
               }}
               className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest focus:ring-0 p-0 cursor-pointer text-brand-dark font-black"
             >
                <option value="all">🌐 Tutti i Canali</option>
                <option value="web">💻 Sito Web Direct</option>
                {(pageSettings?.enabledMarketplaces || ["Amazon", "eBay"]).map((m: string) => (
                   <option key={m} value={m.toLowerCase()}>
                     {m === "Amazon" ? "📦" : m === "eBay" ? "🛍️" : m === "TikTok" ? "📱" : "🔌"} {m} Market
                   </option>
                 ))}
             </select>
          </div>
          <AnimatePresence>
            {(channelFilter === 'web' || channelFilter === 'website') && (
              <motion.div initial={{ opacity: 0, scale: 0.9, x: -20 }} animate={{ opacity: 1, scale: 1, x: 0 }} exit={{ opacity: 0, scale: 0.9, x: -20 }} className="flex bg-brand-yellow/10 px-5 py-3 rounded-2xl border-2 border-brand-yellow/30 items-center shadow-lg shadow-brand-yellow/5">
                 <CreditCard className="w-5 h-5 text-brand-dark mr-2" />
                 <select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)} className="bg-transparent border-none text-[11px] font-black uppercase tracking-widest focus:ring-0 p-0 cursor-pointer text-brand-dark font-black">
                    <option value="all">Tutti i Metodi</option>
                    <option value="bonifico">🏦 Bonifico Bancario</option>
                    <option value="cod">📦 Contrassegno (COD)</option>
                    <option value="stripe">💳 Stripe / Carta</option>
                    <option value="paypal">🅿️ PayPal</option>
                 </select>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-700">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-brand-dark text-brand-yellow">
              <th className="p-5 text-[10px] font-black uppercase tracking-widest pl-10 border-r border-white/5">ID Ordine / Data</th>
              <th className="p-5 text-[10px] font-black uppercase tracking-widest border-r border-white/5">Canale</th>
              <th className="p-5 text-[10px] font-black uppercase tracking-widest border-r border-white/5">Cliente</th>
              <th className="p-5 text-[10px] font-black uppercase tracking-widest border-r border-white/5 text-right">Totale</th>
              <th className="p-5 text-[10px] font-black uppercase tracking-widest border-r border-white/5 text-center">Stato</th>
              <th className="p-5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="p-5 pl-10">
                   <div>
                     <p className="font-black text-brand-dark text-lg tracking-tighter">{order.id}</p>
                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{order.date}</p>
                   </div>
                </td>
                <td className="p-5">
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                       {getChannelIcon(order.channel)}
                     </div>
                     <span className="text-xs font-black text-brand-dark uppercase tracking-tight">{order.channel}</span>
                   </div>
                </td>
                <td className="p-5">
                   <div>
                     <p className="font-black text-brand-dark text-sm">{order.customer}</p>
                     <p className="text-xs font-bold text-gray-400">{order.itemsCount} {order.itemsCount > 1 ? 'Articoli' : 'Articolo'}</p>
                   </div>
                </td>
                <td className="p-5 text-right">
                   <p className="text-lg font-black text-brand-dark">€{order.total.toFixed(2)}</p>
                </td>
                 <td className="p-5">
                    <div className="flex justify-center">
                      <div className="relative group/status-list">
                        <button className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border flex items-center gap-2 hover:scale-105 transition-all ${getStatusStyle(order.status)}`}>
                          {updatingOrderId === order.id ? <RefreshCw className="w-3 h-3 animate-spin" /> : order.status}
                          <ChevronDown className="w-3 h-3" />
                        </button>
                        <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 w-32 bg-white rounded-xl border border-gray-100 overflow-hidden opacity-0 invisible group-hover/status-list:opacity-100 group-hover/status-list:visible transition-all z-20 shadow-2xl">
                           {['pending', 'shipped', 'delivered', 'cancelled'].map(s => (
                             <button 
                               key={s}
                               onClick={() => handleStatusChange(order, s)}
                               className={`w-full px-4 py-3 text-left text-[9px] font-black uppercase tracking-widest transition-colors ${order.status === s ? 'bg-gray-50 text-brand-dark' : 'text-gray-400 hover:bg-brand-yellow hover:text-brand-dark'}`}
                             >
                               {s}
                             </button>
                           ))}
                        </div>
                      </div>
                    </div>
                 </td>
                <td className="p-5 text-right">
                   <div className="flex justify-end gap-3 transition-all">
                     <button onClick={() => setSelectedOrderId(order.id)} className="p-3 bg-brand-yellow text-brand-dark rounded-xl hover:scale-110 active:scale-95 transition-all text-[10px] font-black uppercase tracking-widest flex items-center gap-2" title="Vedi Dettagli"><Eye className="w-5 h-5" /></button>
                     <div className="relative">
                       <button onClick={() => setCarrierSelectorId(order.id === carrierSelectorId ? null : order.id)} className={`p-3 rounded-xl hover:scale-110 active:scale-95 transition-all flex items-center gap-2 border border-transparent ${order.carrierId ? 'bg-brand-yellow text-brand-dark' : 'bg-gray-100 text-gray-400 border-gray-200'}`} title="Corriere"><Truck className="w-5 h-5" /></button>
                       <AnimatePresence>
                         {carrierSelectorId === order.id && (
                           <motion.div initial={{ opacity: 0, scale: 0.9, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 10 }} className="absolute bottom-full mb-4 right-0 w-[450px] bg-white rounded-3xl border border-gray-100 p-6 z-50 overflow-hidden">
                             <p className="text-[10px] font-black uppercase tracking-widest text-brand-dark mb-4 px-2">Scegli Corriere</p>
                             <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                               {COURIERS.map(c => (
                                 <button key={c.id} onClick={() => updateOrderCarrier(order.id, c.id)} className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all ${order.carrierId === c.id ? 'bg-brand-yellow text-brand-dark' : 'hover:bg-gray-50'}`}>
                                   <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center p-1 border border-gray-100">{getCourierIcon(c.logo, "w-5 h-5")}</div>
                                   <span className="text-[10px] font-black uppercase tracking-tight truncate">{c.name}</span>
                                 </button>
                               ))}
                             </div>
                           </motion.div>
                         )}
                       </AnimatePresence>
                     </div>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center">
           <p className="text-xs font-bold text-gray-400 uppercase">Mostrando <strong className="text-brand-dark">{filteredOrders.length}</strong> di {orders.length} ordini{isAnyFilterActive ? ' (filtrati)' : ''}</p>
           <div className="flex gap-2">
              <button disabled className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-[10px] font-black uppercase text-gray-300">Prec</button>
              <button className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-[10px] font-black uppercase text-brand-dark hover:border-brand-yellow transition-colors">Succ</button>
           </div>
        </div>
      </div>

      <AnimatePresence>
        {trackingModalOrder && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setTrackingModalOrder(null)}
              className="fixed inset-0 bg-brand-dark/20 backdrop-blur-sm z-[150]"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-[3rem] p-10 z-[160] shadow-2xl border border-gray-100"
            >
               <div className="flex flex-col items-center text-center space-y-6">
                 <div className="w-20 h-20 bg-brand-yellow rounded-3xl flex items-center justify-center shadow-xl shadow-brand-yellow/20">
                   <Truck className="w-10 h-10 text-brand-dark" />
                 </div>
                 <div>
                   <h3 className="text-2xl font-black text-brand-dark uppercase tracking-tighter">Inserisci Tracking</h3>
                   <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mt-1">Ordine #{trackingModalOrder.id}</p>
                 </div>

                 <div className="w-full relative group">
                   <Tag className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-300 group-focus-within:text-brand-dark transition-colors" />
                   <input 
                     type="text" 
                     placeholder="ID Spedizione (es. IT123456789)"
                     className="w-full pl-16 pr-6 py-5 bg-gray-50 border-transparent rounded-2xl text-base font-black focus:ring-8 focus:ring-brand-yellow/10 focus:bg-white focus:border-brand-yellow/30 transition-all shadow-inner"
                     value={tempTrackingId}
                     onChange={(e) => setTempTrackingId(e.target.value)}
                     autoFocus
                     onKeyDown={(e) => { if (e.key === 'Enter') confirmShipping(); }}
                   />
                 </div>

                 <div className="grid grid-cols-2 gap-4 w-full">
                   <button 
                     onClick={() => setTrackingModalOrder(null)}
                     className="py-4 bg-gray-50 text-gray-400 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-gray-100 transition-all active:scale-95"
                   >
                     Annulla
                   </button>
                   <button 
                     onClick={confirmShipping}
                     className="py-4 bg-brand-dark text-brand-yellow rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-black transition-all shadow-lg active:scale-95"
                   >
                     Conferma Spedito
                   </button>
                 </div>
               </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedOrder && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrderId(null)}
              className="fixed inset-0 bg-brand-dark/40 backdrop-blur-md z-[100]"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-2xl bg-white z-[110] border-l border-gray-100 flex flex-col"
            >
              {/* Header */}
              <div className="p-8 bg-brand-dark text-brand-yellow flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-3xl font-black tracking-tighter uppercase">{selectedOrder.id}</h2>
                    <div className="relative group/status">
                      <button className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border flex items-center gap-2 ${getStatusStyle(selectedOrder.status)}`}>
                        {updatingOrderId === selectedOrder.id ? <RefreshCw className="w-3 h-3 animate-spin" /> : selectedOrder.status}
                        <ChevronDown className="w-3 h-3" />
                      </button>
                      <div className="absolute top-full mt-2 left-0 w-48 bg-white rounded-2xl border border-gray-100 overflow-hidden opacity-0 invisible group-hover/status:opacity-100 group-hover/status:visible transition-all z-20">
                         {['pending', 'shipped', 'delivered', 'cancelled'].map(s => (
                           <button 
                             key={s}
                             onClick={() => handleStatusChange(selectedOrder, s)}
                             className="w-full px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-brand-dark hover:bg-brand-yellow transition-colors"
                           >
                             {s}
                           </button>
                         ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs font-bold opacity-60 uppercase tracking-widest flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    Effettuato il {selectedOrder.date} via {selectedOrder.channel}
                  </p>
                </div>
                <button 
                  onClick={() => setSelectedOrderId(null)}
                  className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
                
                {/* Customer Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4 pt-1 border-t-2 border-gray-50">
                    <div className="flex items-center gap-2 text-brand-dark">
                      <User className="w-4 h-4" />
                      <h3 className="text-xs font-black uppercase tracking-widest">Informazioni Cliente</h3>
                    </div>
                    <div>
                      <p className="font-black text-lg text-brand-dark leading-tight">{selectedOrder.customer}</p>
                      <p className="text-sm font-bold text-gray-400">{selectedOrder.email}</p>
                    </div>
                  </div>

                  <div className="space-y-4 pt-1 border-t-2 border-gray-50">
                    <div className="flex items-center gap-2 text-brand-dark">
                      <MapPin className="w-4 h-4" />
                      <h3 className="text-xs font-black uppercase tracking-widest">Indirizzo Spedizione</h3>
                    </div>
                    <p className="text-sm font-bold text-brand-dark leading-relaxed">
                      {selectedOrder.address}
                    </p>
                  </div>
                </div>

                {/* Logistics & Carriers */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-1 border-t-2 border-gray-50">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-brand-dark">
                      <Hash className="w-4 h-4" />
                      <h3 className="text-xs font-black uppercase tracking-widest">Tracking Info</h3>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="relative flex-1">
                        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                        <input 
                          type="text" 
                          placeholder="Tracking ID..."
                          className="w-full pl-12 pr-4 py-4 bg-gray-50 border-transparent rounded-2xl text-sm font-bold focus:ring-4 focus:ring-brand-yellow/20 focus:bg-white transition-all"
                          value={selectedOrder.trackingId}
                          onChange={(e) => updateTrackingId(selectedOrder.id, e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-brand-dark">
                      <Truck className="w-4 h-4" />
                      <h3 className="text-xs font-black uppercase tracking-widest">Corriere</h3>
                    </div>
                    <div className="relative group/carrier-modal">
                      <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-white transition-all text-left">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center p-1 border border-gray-100">
                            {selectedOrder.carrierId ? (
                              getCourierIcon(COURIERS.find(c => c.id === selectedOrder.carrierId)?.logo || "default", "w-6 h-6")
                            ) : (
                              <Truck className="w-5 h-5 text-gray-300" />
                            )}
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-brand-dark">
                              {COURIERS.find(c => c.id === selectedOrder.carrierId)?.name || 'NON ASSEGNATO'}
                            </p>
                          </div>
                        </div>
                        <ChevronDown className="w-4 h-4 text-gray-300" />
                      </button>
                      
                      <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-2xl border border-gray-100 overflow-hidden opacity-0 invisible group-hover/carrier-modal:opacity-100 group-hover/carrier-modal:visible transition-all z-20 p-2">
                        {COURIERS.map(c => (
                          <button 
                            key={c.id}
                            onClick={() => updateOrderCarrier(selectedOrder.id, c.id)}
                            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${selectedOrder.carrierId === c.id ? 'bg-brand-yellow text-brand-dark' : 'hover:bg-gray-50'}`}
                          >
                          <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center p-1 border border-gray-100">
                            {getCourierIcon(c.logo, "w-4 h-4")}
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-tight">{c.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="space-y-4 pt-1 border-t-2 border-gray-50">
                  <div className="flex items-center gap-2 text-brand-dark">
                    <CreditCard className="w-4 h-4" />
                    <h3 className="text-xs font-black uppercase tracking-widest">Pagamento</h3>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-brand-dark" />
                    </div>
                    <span className="font-black text-[10px] text-brand-dark uppercase tracking-tight">{selectedOrder.payment}</span>
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-6 pt-1 border-t-2 border-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-brand-dark">
                      <Package className="w-4 h-4" />
                      <h3 className="text-xs font-black uppercase tracking-widest">Articoli ({selectedOrder.itemsCount})</h3>
                    </div>
                    <span className="text-xs font-black text-brand-dark uppercase tracking-widest p-2 bg-brand-yellow rounded-lg">Tot: €{selectedOrder.total.toFixed(2)}</span>
                  </div>
                  
                  <div className="space-y-4">
                    {selectedOrder.items.length > 0 ? selectedOrder.items.map((item: any) => (
                      <div key={item.id} className="flex gap-4 p-4 rounded-3xl border border-gray-100 hover:border-brand-yellow/30 transition-all group bg-white">
                        <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0 group-hover:scale-105 transition-transform">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                          <h4 className="font-black text-brand-dark text-sm leading-tight mb-1">{item.name}</h4>
                          <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-2">SKU: BP-{item.id.padStart(4, '0')}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-gray-400">{item.qty} x €{item.price.toFixed(2)}</span>
                            <span className="font-black text-brand-dark">€{(item.qty * item.price).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    )) : (
                      <div className="flex flex-col items-center justify-center py-10 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
                        <AlertCircle className="w-10 h-10 text-gray-300 mb-2" />
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Dettaglio prodotti non disponibile</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Timeline Placeholder */}
                <div className="space-y-6 pt-1 border-t-2 border-gray-50">
                   <div className="flex items-center gap-2 text-brand-dark">
                      <Clock className="w-4 h-4" />
                      <h3 className="text-xs font-black uppercase tracking-widest">Cronologia Stato</h3>
                    </div>
                    <div className="space-y-6 pl-2">
                       {[
                         { status: 'Pagamento Ricevuto', time: '30 Mar 2026 - 10:42', completed: true },
                         { status: 'In Lavorazione', time: '30 Mar 2026 - 11:15', completed: true },
                         { status: 'Spedito', time: selectedOrder.status === 'shipped' || selectedOrder.status === 'delivered' ? '30 Mar 2026 - 14:30' : '-', completed: selectedOrder.status === 'shipped' || selectedOrder.status === 'delivered' },
                       ].map((step, idx) => (
                         <div key={idx} className="flex gap-4 relative">
                           {idx < 2 && <div className="absolute left-[11px] top-6 w-[2px] h-10 bg-gray-100"></div>}
                           <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 ${step.completed ? 'bg-brand-yellow border-brand-yellow' : 'bg-white border-gray-100'}`}>
                              {step.completed && <CheckCircle2 className="w-3 h-3 text-brand-dark" />}
                           </div>
                           <div>
                             <p className={`text-xs font-black uppercase tracking-tight ${step.completed ? 'text-brand-dark' : 'text-gray-300'}`}>{step.status}</p>
                             <p className="text-[10px] font-bold text-gray-400 tracking-wider">{step.time}</p>
                           </div>
                         </div>
                       ))}
                    </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-8 bg-gray-50 border-t border-gray-100 grid grid-cols-2 gap-4">
                <button
                  onClick={() => handlePrintSingleOrder(selectedOrder)}
                  className="py-4 bg-white border-2 border-brand-dark rounded-2xl font-black uppercase text-xs tracking-widest text-brand-dark hover:bg-brand-dark hover:text-brand-yellow transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <Printer className="w-4 h-4" />
                  Stampa Proforma
                </button>
                <button 
                  onClick={() => handleStatusChange(selectedOrder, 'shipped')}
                  disabled={selectedOrder.status === 'delivered' || selectedOrder.status === 'cancelled' || isUpdatingStatus}
                  className="py-4 bg-brand-yellow text-brand-dark rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-brand-orange transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:grayscale"
                >
                  {isUpdatingStatus ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Truck className="w-4 h-4" />}
                  Segna come Spedito
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {/* Print View (Only visible when printing) */}
      <div className="hidden print:block print:fixed print:inset-0 print:bg-white print:z-[9999] p-10">
        <div className="flex justify-between items-start mb-10">
          <div>
            <h1 className="text-4xl font-black text-brand-dark tracking-tighter uppercase italic">BESPOINT</h1>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-2">Export Ordini - {new Date().toLocaleDateString('it-IT')}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black uppercase tracking-widest text-brand-dark">Totale Ordini</p>
            <p className="text-2xl font-black text-brand-dark">€{orders.reduce((acc, o) => acc + o.total, 0).toFixed(2)}</p>
          </div>
        </div>

        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-brand-dark">
              <th className="py-4 text-left text-[10px] font-black uppercase tracking-tight">Immagine</th>
              <th className="py-4 text-left text-[10px] font-black uppercase tracking-tight">ID / Data</th>
              <th className="py-4 text-left text-[10px] font-black uppercase tracking-tight">Cliente</th>
              <th className="py-4 text-left text-[10px] font-black uppercase tracking-tight">Canale</th>
              <th className="py-4 text-left text-[10px] font-black uppercase tracking-tight">Corriere</th>
              <th className="py-4 text-left text-[10px] font-black uppercase tracking-tight text-right">Totale</th>
              <th className="py-4 text-center text-[10px] font-black uppercase tracking-tight">Stato</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredOrders.map(o => (
              <tr key={o.id} className="page-break-inside-avoid">
                <td className="py-6 pr-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 flex items-center justify-center p-1">
                    {o.items[0]?.image ? (
                      <img src={o.items[0].image} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <Package className="w-6 h-6 text-gray-300" />
                    )}
                  </div>
                </td>
                <td className="py-6">
                  <p className="font-black text-xs text-brand-dark">{o.id}</p>
                  <p className="text-[8px] font-bold text-gray-400">{o.date}</p>
                </td>
                <td className="py-6">
                  <p className="font-black text-xs text-brand-dark leading-tight">{o.customer}</p>
                  <p className="text-[8px] font-bold text-gray-400">{o.email}</p>
                </td>
                <td className="py-6">
                  <p className="text-[8px] font-black uppercase tracking-widest text-brand-dark">{o.channel}</p>
                </td>
                <td className="py-6">
                  <p className="text-[8px] font-black uppercase tracking-widest text-brand-dark">
                    {COURIERS.find(c => c.id === o.carrierId)?.name || 'DA DEFINIRE'}
                  </p>
                </td>
                <td className="py-6 text-right">
                  <p className="font-black text-xs text-brand-dark">€{o.total.toFixed(2)}</p>
                </td>
                <td className="py-6 text-center">
                  <span className="text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full border border-gray-100">
                    {o.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="mt-10 pt-10 border-t border-gray-100 flex justify-between items-end">
          <div className="flex gap-10">
            <div className="space-y-1">
              <p className="text-[8px] font-black uppercase text-gray-300">Generato il</p>
              <p className="text-[10px] font-black text-brand-dark">{new Date().toLocaleString('it-IT')}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[8px] font-black uppercase text-gray-300">Pagine</p>
              <p className="text-[10px] font-black text-brand-dark">1 di 1</p>
            </div>
          </div>
          <div className="text-right italic">
            <p className="text-xs font-black text-brand-dark tracking-tighter">Powered by BesPoint Admin</p>
          </div>
        </div>
      </div>

    </div>
  );
};
