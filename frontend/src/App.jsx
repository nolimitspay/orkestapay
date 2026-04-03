import { useState, useEffect, useRef } from "react";

const COLORS = {
  bg: "#0a0c10",
  bgCard: "#0f1117",
  bgCardHover: "#141720",
  border: "#1e2330",
  borderLight: "#2a3045",
  accent: "#00d4a0",
  accentDim: "#00d4a020",
  accentHover: "#00e8b0",
  gold: "#f5c842",
  goldDim: "#f5c84215",
  red: "#ff4d4d",
  redDim: "#ff4d4d15",
  blue: "#4d9fff",
  blueDim: "#4d9fff15",
  text: "#e8eaf0",
  textMuted: "#6b7280",
  textDim: "#9ca3af",
  success: "#00d4a0",
  warning: "#f5c842",
  danger: "#ff4d4d",
  processing: "#4d9fff",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@400;500;600;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${COLORS.bg}; color: ${COLORS.text}; font-family: 'Syne', sans-serif; }
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: ${COLORS.bg}; }
  ::-webkit-scrollbar-thumb { background: ${COLORS.border}; border-radius: 2px; }
  .mono { font-family: 'DM Mono', monospace; }

  .layout { display: flex; height: 100vh; overflow: hidden; }

  .sidebar {
    width: 220px; min-width: 220px;
    background: ${COLORS.bgCard};
    border-right: 1px solid ${COLORS.border};
    display: flex; flex-direction: column;
    padding: 0;
    overflow-y: auto;
  }
  .sidebar-logo {
    padding: 24px 20px 20px;
    border-bottom: 1px solid ${COLORS.border};
  }
  .logo-mark {
    display: flex; align-items: center; gap: 10px;
  }
  .logo-icon {
    width: 32px; height: 32px; border-radius: 8px;
    background: ${COLORS.accent};
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; font-weight: 700; color: #000;
  }
  .logo-text { font-size: 15px; font-weight: 700; letter-spacing: 0.02em; }
  .logo-sub { font-size: 10px; color: ${COLORS.textMuted}; letter-spacing: 0.1em; text-transform: uppercase; margin-top: 1px; }

  .nav-section { padding: 16px 12px 8px; }
  .nav-label { font-size: 10px; color: ${COLORS.textMuted}; letter-spacing: 0.12em; text-transform: uppercase; padding: 0 8px; margin-bottom: 6px; }
  .nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 8px 10px; border-radius: 8px; cursor: pointer;
    font-size: 13px; font-weight: 500; color: ${COLORS.textMuted};
    transition: all 0.15s; margin-bottom: 2px; border: none; background: none; width: 100%; text-align: left;
  }
  .nav-item:hover { background: ${COLORS.bgCardHover}; color: ${COLORS.text}; }
  .nav-item.active { background: ${COLORS.accentDim}; color: ${COLORS.accent}; }
  .nav-item .icon { font-size: 14px; width: 18px; text-align: center; }
  .nav-badge {
    margin-left: auto; background: ${COLORS.accent}; color: #000;
    font-size: 10px; font-weight: 700; padding: 1px 6px; border-radius: 20px;
  }

  .main { flex: 1; overflow-y: auto; display: flex; flex-direction: column; }

  .topbar {
    padding: 16px 28px; border-bottom: 1px solid ${COLORS.border};
    display: flex; align-items: center; justify-content: space-between;
    position: sticky; top: 0; background: ${COLORS.bg}; z-index: 10;
  }
  .page-title { font-size: 18px; font-weight: 700; }
  .page-breadcrumb { font-size: 12px; color: ${COLORS.textMuted}; margin-top: 2px; }
  .topbar-actions { display: flex; gap: 10px; align-items: center; }
  .btn {
    padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 600;
    cursor: pointer; border: none; transition: all 0.15s; font-family: 'Syne', sans-serif;
  }
  .btn-primary { background: ${COLORS.accent}; color: #000; }
  .btn-primary:hover { background: ${COLORS.accentHover}; }
  .btn-ghost { background: transparent; color: ${COLORS.textMuted}; border: 1px solid ${COLORS.border}; }
  .btn-ghost:hover { background: ${COLORS.bgCard}; color: ${COLORS.text}; }
  .btn-danger { background: ${COLORS.redDim}; color: ${COLORS.red}; border: 1px solid ${COLORS.red}30; }
  .btn-danger:hover { background: ${COLORS.red}25; }

  .content { padding: 28px; flex: 1; }

  .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 28px; }
  .kpi-card {
    background: ${COLORS.bgCard}; border: 1px solid ${COLORS.border};
    border-radius: 12px; padding: 20px;
    transition: border-color 0.2s;
  }
  .kpi-card:hover { border-color: ${COLORS.borderLight}; }
  .kpi-label { font-size: 11px; color: ${COLORS.textMuted}; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 10px; }
  .kpi-value { font-size: 28px; font-weight: 700; font-family: 'DM Mono', monospace; }
  .kpi-delta { font-size: 12px; margin-top: 6px; display: flex; align-items: center; gap: 4px; }
  .delta-up { color: ${COLORS.success}; }
  .delta-down { color: ${COLORS.danger}; }

  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 28px; }
  .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 28px; }

  .card {
    background: ${COLORS.bgCard}; border: 1px solid ${COLORS.border};
    border-radius: 12px; overflow: hidden;
  }
  .card-header {
    padding: 16px 20px; border-bottom: 1px solid ${COLORS.border};
    display: flex; align-items: center; justify-content: space-between;
  }
  .card-title { font-size: 14px; font-weight: 600; }
  .card-body { padding: 20px; }

  .funnel { display: flex; gap: 0; align-items: stretch; }
  .funnel-step { flex: 1; padding: 16px; border-right: 1px solid ${COLORS.border}; position: relative; }
  .funnel-step:last-child { border-right: none; }
  .funnel-label { font-size: 11px; color: ${COLORS.textMuted}; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 8px; }
  .funnel-count { font-size: 24px; font-weight: 700; font-family: 'DM Mono', monospace; }
  .funnel-pct { font-size: 12px; color: ${COLORS.textMuted}; margin-top: 4px; }
  .funnel-bar { height: 3px; background: ${COLORS.border}; border-radius: 2px; margin-top: 12px; }
  .funnel-bar-fill { height: 100%; background: ${COLORS.accent}; border-radius: 2px; transition: width 0.6s ease; }

  .table-wrap { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th { padding: 10px 16px; text-align: left; font-size: 11px; font-weight: 600; color: ${COLORS.textMuted}; text-transform: uppercase; letter-spacing: 0.08em; border-bottom: 1px solid ${COLORS.border}; }
  td { padding: 12px 16px; border-bottom: 1px solid ${COLORS.border}30; vertical-align: middle; }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: ${COLORS.bgCardHover}; }

  .badge {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600;
  }
  .badge-success { background: ${COLORS.success}20; color: ${COLORS.success}; }
  .badge-danger { background: ${COLORS.danger}20; color: ${COLORS.danger}; }
  .badge-warning { background: ${COLORS.warning}20; color: ${COLORS.warning}; }
  .badge-info { background: ${COLORS.blue}20; color: ${COLORS.blue}; }
  .badge-gray { background: ${COLORS.border}; color: ${COLORS.textMuted}; }

  .tag {
    display: inline-flex; align-items: center;
    padding: 2px 8px; border-radius: 4px; font-size: 11px;
    background: ${COLORS.border}; color: ${COLORS.textDim};
  }

  .progress-bar { height: 6px; background: ${COLORS.border}; border-radius: 3px; overflow: hidden; }
  .progress-fill { height: 100%; border-radius: 3px; transition: width 0.5s ease; }

  .gateway-row { display: flex; align-items: center; gap: 12px; padding: 14px 0; border-bottom: 1px solid ${COLORS.border}30; }
  .gateway-row:last-child { border-bottom: none; }
  .gateway-icon {
    width: 38px; height: 38px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; background: ${COLORS.border};
  }
  .gateway-info { flex: 1; }
  .gateway-name { font-size: 13px; font-weight: 600; }
  .gateway-psp { font-size: 11px; color: ${COLORS.textMuted}; margin-top: 2px; }
  .gateway-traffic { min-width: 120px; }

  .search-input {
    background: ${COLORS.bgCard}; border: 1px solid ${COLORS.border};
    border-radius: 8px; padding: 8px 14px; font-size: 13px;
    color: ${COLORS.text}; font-family: 'Syne', sans-serif; outline: none;
    transition: border-color 0.15s; width: 240px;
  }
  .search-input:focus { border-color: ${COLORS.accent}; }
  .search-input::placeholder { color: ${COLORS.textMuted}; }

  .select-input {
    background: ${COLORS.bgCard}; border: 1px solid ${COLORS.border};
    border-radius: 8px; padding: 8px 14px; font-size: 13px;
    color: ${COLORS.text}; font-family: 'Syne', sans-serif; outline: none;
    cursor: pointer;
  }
  .select-input:focus { border-color: ${COLORS.accent}; }

  .pill-toggle { display: flex; background: ${COLORS.bgCard}; border: 1px solid ${COLORS.border}; border-radius: 8px; overflow: hidden; }
  .pill-btn {
    padding: 6px 14px; font-size: 12px; font-weight: 600; cursor: pointer;
    border: none; background: none; color: ${COLORS.textMuted}; font-family: 'Syne', sans-serif;
    transition: all 0.15s;
  }
  .pill-btn.active { background: ${COLORS.accent}20; color: ${COLORS.accent}; }

  .mini-chart { display: flex; align-items: flex-end; gap: 3px; height: 40px; }
  .mini-bar {
    flex: 1; border-radius: 3px 3px 0 0; background: ${COLORS.accent}40;
    transition: height 0.4s ease, background 0.2s;
    min-width: 4px;
  }
  .mini-bar:hover { background: ${COLORS.accent}; }

  .stat-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid ${COLORS.border}20; }
  .stat-row:last-child { border-bottom: none; }

  .toast {
    position: fixed; bottom: 24px; right: 24px;
    background: ${COLORS.bgCard}; border: 1px solid ${COLORS.border};
    border-radius: 10px; padding: 14px 18px;
    font-size: 13px; z-index: 1000;
    box-shadow: 0 8px 32px #00000060;
    display: flex; align-items: center; gap: 10px;
    animation: slideUp 0.3s ease;
  }
  @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

  .modal-overlay {
    position: fixed; inset: 0; background: #000000b0;
    display: flex; align-items: center; justify-content: center; z-index: 100;
  }
  .modal {
    background: ${COLORS.bgCard}; border: 1px solid ${COLORS.border};
    border-radius: 16px; padding: 28px; width: 480px; max-width: 95vw;
    animation: fadeIn 0.2s ease;
  }
  @keyframes fadeIn { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }
  .modal-title { font-size: 16px; font-weight: 700; margin-bottom: 20px; }
  .form-group { margin-bottom: 16px; }
  .form-label { font-size: 12px; color: ${COLORS.textMuted}; margin-bottom: 6px; display: block; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; }
  .form-input {
    width: 100%; background: ${COLORS.bg}; border: 1px solid ${COLORS.border};
    border-radius: 8px; padding: 10px 14px; font-size: 13px;
    color: ${COLORS.text}; font-family: 'Syne', sans-serif; outline: none;
    transition: border-color 0.15s;
  }
  .form-input:focus { border-color: ${COLORS.accent}; }
  .modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 24px; }

  .empty-state { text-align: center; padding: 48px 20px; color: ${COLORS.textMuted}; }
  .empty-icon { font-size: 40px; margin-bottom: 12px; }
  .empty-text { font-size: 14px; }

  .pulse { animation: pulse 2s infinite; }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

  .dot { width: 7px; height: 7px; border-radius: 50%; display: inline-block; }

  .webhook-item {
    padding: 14px 20px; border-bottom: 1px solid ${COLORS.border}30;
    display: flex; align-items: center; gap: 14px;
  }
  .webhook-item:last-child { border-bottom: none; }
  .webhook-method {
    padding: 3px 8px; border-radius: 4px; font-size: 10px; font-weight: 700;
    font-family: 'DM Mono', monospace; min-width: 44px; text-align: center;
  }
  .method-post { background: ${COLORS.accent}20; color: ${COLORS.accent}; }
  .method-get { background: ${COLORS.blue}20; color: ${COLORS.blue}; }

  .timeline-dot {
    width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0;
    border: 2px solid;
  }
  .timeline-line { width: 1px; background: ${COLORS.border}; flex: 1; min-height: 20px; }

  .rebill-status { display: flex; align-items: center; gap: 6px; }

  @media (max-width: 900px) {
    .kpi-grid { grid-template-columns: repeat(2, 1fr); }
    .grid-2 { grid-template-columns: 1fr; }
  }
`;

const DEMO_PAYMENTS = [
  { id: "pay_001", status: "SUCCEEDED", amount: 25.99, currency: "EUR", gateway: "SQUARE", email: "maria@example.com", date: "03/04/2026 17:32", recovery: false },
  { id: "pay_002", status: "CREATED", amount: 19.99, currency: "EUR", gateway: "SQUARE", email: "pedro@gmail.com", date: "03/04/2026 18:46", recovery: false },
  { id: "pay_003", status: "FAILED", amount: 99.99, currency: "EUR", gateway: "STRIPE", email: "ana@hotmail.com", date: "03/04/2026 16:10", recovery: true },
  { id: "pay_004", status: "CREATED", amount: 25.99, currency: "EUR", gateway: "SQUARE", email: "carlos@gmail.com", date: "03/04/2026 18:33", recovery: true },
  { id: "pay_005", status: "SUCCEEDED", amount: 49.99, currency: "EUR", gateway: "STRIPE", email: "lucia@example.com", date: "03/04/2026 15:55", recovery: false },
  { id: "pay_006", status: "PROCESSING", amount: 19.99, currency: "EUR", gateway: "SQUARE", email: "david@gmail.com", date: "03/04/2026 18:50", recovery: false },
  { id: "pay_007", status: "FAILED", amount: 149.99, currency: "EUR", gateway: "STRIPE", email: "sofia@example.com", date: "03/04/2026 14:20", recovery: true },
  { id: "pay_008", status: "SUCCEEDED", amount: 25.99, currency: "EUR", gateway: "SQUARE", email: "miguel@gmail.com", date: "03/04/2026 17:51", recovery: false },
];

const DEMO_GATEWAYS = [
  { id: 1, name: "SQUARE - servi2u-esp.com", psp: "SQUARE", traffic: 100, active: true },
  { id: 2, name: "Stripe - adsandgrowllc.com", psp: "STRIPE", traffic: 80, active: false },
  { id: 3, name: "Stripe - MONEY ORQUEST", psp: "STRIPE", traffic: 75, active: false },
  { id: 4, name: "STRIPE - servi2u-esp.com", psp: "STRIPE", traffic: 0, active: true },
  { id: 5, name: "STRIPE - codigoabsoluto.com", psp: "STRIPE", traffic: 0, active: true },
];

const DEMO_SHOPS = [
  { id: 1, url: "servi2u-esp.myshopify.com", name: "Servi2U España", active: true, terms: true },
  { id: 2, url: "luxhome.myshopify.com", name: "Lux Home", active: true, terms: false },
];

const DEMO_PIXELS = [
  { id: 1, provider: "META", pixelId: "1455941992874571", name: "pixel ba", date: "27/02/2026", active: true },
  { id: 2, provider: "META", pixelId: "1455941992874571", name: "BALIZA", date: "20/02/2026", active: true },
];

const DEMO_TEMPLATES = [
  { id: 1, name: "Cart recovery", subject: "¡Tu carrito te espera!", active: true, updated: "01/04/2026" },
  { id: 2, name: "Order confirmation", subject: "Pedido confirmado ✓", active: true, updated: "28/03/2026" },
  { id: 3, name: "Tracking update", subject: "Tu pedido está en camino #{{order.id}}", active: true, updated: "15/03/2026" },
];

const DEMO_WEBHOOKS = [
  { id: 1, event: "payment.succeeded", url: "https://hooks.zapier.com/hooks/catch/abc123", active: true, lastTriggered: "hace 2 min", retries: 0 },
  { id: 2, event: "payment.failed", url: "https://api.mysite.com/webhooks/payment", active: true, lastTriggered: "hace 1h", retries: 2 },
  { id: 3, event: "payment.created", url: "https://hooks.slack.com/services/T00/B00/xxx", active: false, lastTriggered: "hace 3d", retries: 0 },
];

const BAR_DATA = [12, 8, 15, 22, 18, 31, 9, 24, 19, 28, 35, 41, 29, 38, 45, 32, 27, 50, 43, 38, 55, 48, 62, 58, 71, 65, 74, 69, 78, 85];

function MiniChart({ data, color = COLORS.accent }) {
  const max = Math.max(...data);
  return (
    <div className="mini-chart">
      {data.map((v, i) => (
        <div key={i} className="mini-bar" style={{ height: `${(v / max) * 100}%`, background: i === data.length - 1 ? color : color + "50" }} />
      ))}
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    SUCCEEDED: ["badge-success", "●", "Pagado"],
    FAILED: ["badge-danger", "●", "Error"],
    PROCESSING: ["badge-info", "●", "Procesando"],
    CREATED: ["badge-gray", "●", "Creado"],
  };
  const [cls, icon, label] = map[status] || ["badge-gray", "●", status];
  return <span className={`badge ${cls}`}>{icon} {label}</span>;
}

function Toast({ message, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, []);
  const colors = { success: COLORS.success, error: COLORS.danger, info: COLORS.blue };
  return (
    <div className="toast">
      <div className="dot" style={{ background: colors[type] || COLORS.accent }} />
      <span>{message}</span>
    </div>
  );
}

export default function MoneyOrquest() {
  const [section, setSection] = useState("dashboard");
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState(null);
  const [payments, setPayments] = useState(DEMO_PAYMENTS);
  const [gateways, setGateways] = useState(DEMO_GATEWAYS);
  const [shops, setShops] = useState(DEMO_SHOPS);
  const [pixels, setPixels] = useState(DEMO_PIXELS);
  const [templates, setTemplates] = useState(DEMO_TEMPLATES);
  const [webhooks, setWebhooks] = useState(DEMO_WEBHOOKS);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [searchPay, setSearchPay] = useState("");
  const [notifOn, setNotifOn] = useState(false);

  const showToast = (message, type = "success") => setToast({ message, type });
  const closeModal = () => setModal(null);

  const navItems = [
    { id: "dashboard", icon: "◈", label: "Dashboard" },
    { id: "payments", icon: "◎", label: "Pagos", badge: payments.filter(p => p.status === "CREATED").length },
    { id: "gateways", icon: "⬡", label: "Pasarelas" },
    { id: "shops", icon: "◫", label: "Tiendas" },
    { id: "webhooks", icon: "⊕", label: "Webhooks" },
    { id: "pixels", icon: "◉", label: "Pixel Manager" },
    { id: "templates", icon: "◻", label: "Email Templates" },
  ];

  const filteredPayments = payments.filter(p => {
    const matchStatus = filterStatus === "ALL" || p.status === filterStatus;
    const matchSearch = !searchPay || p.email.toLowerCase().includes(searchPay.toLowerCase()) || p.id.includes(searchPay);
    return matchStatus && matchSearch;
  });

  const totalRev = payments.filter(p => p.status === "SUCCEEDED").reduce((a, p) => a + p.amount, 0);
  const convRate = (payments.filter(p => p.status === "SUCCEEDED").length / payments.length * 100).toFixed(1);

  return (
    <>
      <style>{css}</style>
      <div className="layout">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="logo-mark">
              <div className="logo-icon">M</div>
              <div>
                <div className="logo-text">OrkestaPay</div>
                <div className="logo-sub">Payment Orchestrator</div>
              </div>
            </div>
          </div>

          <div className="nav-section">
            <div className="nav-label">Principal</div>
            {navItems.map(item => (
              <button key={item.id} className={`nav-item ${section === item.id ? "active" : ""}`} onClick={() => setSection(item.id)}>
                <span className="icon">{item.icon}</span>
                <span>{item.label}</span>
                {item.badge > 0 && <span className="nav-badge">{item.badge}</span>}
              </button>
            ))}
          </div>

          <div style={{ marginTop: "auto", padding: "16px 12px", borderTop: `1px solid ${COLORS.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: COLORS.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#000" }}>A</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600 }}>Admin</div>
                <div style={{ fontSize: 10, color: COLORS.textMuted }}>Plan SCALE</div>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <main className="main">
          {/* DASHBOARD */}
          {section === "dashboard" && (
            <>
              <div className="topbar">
                <div>
                  <div className="page-title">Dashboard</div>
                  <div className="page-breadcrumb">Vista general · Hoy, 3 abril 2026</div>
                </div>
                <div className="topbar-actions">
                  <button className={`btn ${notifOn ? "btn-primary" : "btn-ghost"}`} onClick={() => { setNotifOn(!notifOn); showToast(notifOn ? "Notificaciones desactivadas" : "Notificaciones activadas 🔔", "info"); }}>
                    {notifOn ? "● Notif. ON" : "○ Notif. OFF"}
                  </button>
                </div>
              </div>
              <div className="content">
                <div className="kpi-grid">
                  {[
                    { label: "Facturación hoy", value: `€${totalRev.toFixed(2)}`, delta: "+14.2%", up: true },
                    { label: "Ventas", value: payments.filter(p => p.status === "SUCCEEDED").length, delta: "+3 vs ayer", up: true },
                    { label: "Conv. Rate", value: `${convRate}%`, delta: "-2.1%", up: false },
                    { label: "Rebills hoy", value: 1, delta: "€99.99", up: true },
                  ].map((k, i) => (
                    <div key={i} className="kpi-card">
                      <div className="kpi-label">{k.label}</div>
                      <div className="kpi-value mono">{k.value}</div>
                      <div className={`kpi-delta ${k.up ? "delta-up" : "delta-down"}`}>
                        {k.up ? "↑" : "↓"} {k.delta}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid-2">
                  <div className="card">
                    <div className="card-header">
                      <span className="card-title">Ventas diarias</span>
                      <span style={{ fontSize: 12, color: COLORS.accent }} className="mono">+85 hoy</span>
                    </div>
                    <div className="card-body">
                      <MiniChart data={BAR_DATA} />
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 11, color: COLORS.textMuted }}>
                        <span>1 Mar</span><span>Hoy</span>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <div className="card-header">
                      <span className="card-title">Embudo de conversión</span>
                    </div>
                    <div className="funnel">
                      {[
                        { label: "Sesiones", count: 0, pct: "100%" },
                        { label: "Checkouts", count: 114, pct: "100%" },
                        { label: "Intentos", count: 61, pct: "53.5%" },
                        { label: "Pagos OK", count: 9, pct: "14.8%" },
                      ].map((s, i) => (
                        <div key={i} className="funnel-step">
                          <div className="funnel-label">Step {i + 1}</div>
                          <div className="funnel-count mono">{s.count}</div>
                          <div className="funnel-pct">{s.pct}</div>
                          <div className="funnel-bar">
                            <div className="funnel-bar-fill" style={{ width: s.pct, background: i === 3 ? COLORS.accent : COLORS.blue + "80" }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid-3">
                  <div className="card">
                    <div className="card-header"><span className="card-title">Pasarelas activas</span></div>
                    <div className="card-body" style={{ padding: "8px 20px" }}>
                      {gateways.filter(g => g.active).map(g => (
                        <div key={g.id} className="gateway-row">
                          <div className="gateway-icon">{g.psp === "STRIPE" ? "S" : "□"}</div>
                          <div className="gateway-info">
                            <div className="gateway-name">{g.name.split(" - ")[0]}</div>
                            <div className="gateway-psp">{g.name.split(" - ")[1] || g.psp}</div>
                          </div>
                          <div>
                            <span className="badge badge-success">{g.traffic}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="card">
                    <div className="card-header"><span className="card-title">Distribución PSP</span></div>
                    <div className="card-body">
                      {[{ label: "SQUARE", pct: 100, color: COLORS.accent }, { label: "STRIPE", pct: 0, color: COLORS.blue }].map((p, i) => (
                        <div key={i} style={{ marginBottom: 14 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6 }}>
                            <span>{p.label}</span><span className="mono">{p.pct}%</span>
                          </div>
                          <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${p.pct}%`, background: p.color }} />
                          </div>
                        </div>
                      ))}
                      <div style={{ marginTop: 16, padding: "12px", background: COLORS.bg, borderRadius: 8 }}>
                        <div style={{ fontSize: 11, color: COLORS.textMuted, marginBottom: 4 }}>Total procesado (mes)</div>
                        <div style={{ fontSize: 22, fontWeight: 700 }} className="mono">€1,520.31</div>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <div className="card-header"><span className="card-title">Últimas ventas</span></div>
                    <div>
                      {payments.filter(p => p.status === "SUCCEEDED").slice(0, 4).map(p => (
                        <div key={p.id} style={{ padding: "12px 20px", borderBottom: `1px solid ${COLORS.border}20`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 600 }}>{p.email.split("@")[0]}</div>
                            <div style={{ fontSize: 11, color: COLORS.textMuted }}>{p.date.split(" ")[1]}</div>
                          </div>
                          <span className="mono" style={{ fontSize: 14, fontWeight: 700, color: COLORS.accent }}>€{p.amount}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* PAYMENTS */}
          {section === "payments" && (
            <>
              <div className="topbar">
                <div>
                  <div className="page-title">Pagos</div>
                  <div className="page-breadcrumb">8.652 registros totales</div>
                </div>
                <div className="topbar-actions">
                  <button className="btn btn-ghost" onClick={() => showToast("Exportando a Excel...", "info")}>↓ Exportar</button>
                  <button className="btn btn-primary" onClick={() => setModal("batch")}>⊕ Batch Payment</button>
                </div>
              </div>
              <div className="content">
                <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
                  <input className="search-input" placeholder="Buscar por email o ID..." value={searchPay} onChange={e => setSearchPay(e.target.value)} />
                  <div className="pill-toggle">
                    {["ALL", "SUCCEEDED", "CREATED", "FAILED", "PROCESSING"].map(s => (
                      <button key={s} className={`pill-btn ${filterStatus === s ? "active" : ""}`} onClick={() => setFilterStatus(s)}>
                        {s === "ALL" ? "Todos" : s === "SUCCEEDED" ? "Pagado" : s === "CREATED" ? "Creado" : s === "FAILED" ? "Error" : "Procesando"}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="card">
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Estado</th>
                          <th>Importe</th>
                          <th>Gateway</th>
                          <th>Email</th>
                          <th>Recuperación</th>
                          <th>Fecha</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPayments.map(p => (
                          <tr key={p.id}>
                            <td><StatusBadge status={p.status} /></td>
                            <td><span className="mono" style={{ fontWeight: 600 }}>€{p.amount.toFixed(2)}</span></td>
                            <td><span className="tag">{p.gateway}</span></td>
                            <td style={{ color: COLORS.textDim, fontSize: 12 }}>{p.email}</td>
                            <td>{p.recovery ? <span className="badge badge-info">✉ Cart recovery</span> : <span style={{ color: COLORS.textMuted, fontSize: 12 }}>—</span>}</td>
                            <td style={{ color: COLORS.textMuted, fontSize: 12 }}>{p.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* GATEWAYS */}
          {section === "gateways" && (
            <>
              <div className="topbar">
                <div>
                  <div className="page-title">Pasarelas de pago</div>
                  <div className="page-breadcrumb">{gateways.length} pasarelas configuradas · 3/8 activas</div>
                </div>
                <div className="topbar-actions">
                  <button className="btn btn-primary" onClick={() => setModal("newGateway")}>+ Nueva pasarela</button>
                </div>
              </div>
              <div className="content">
                <div className="card">
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Nombre</th>
                          <th>PSP</th>
                          <th>Tráfico %</th>
                          <th>Estado</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gateways.map(g => (
                          <tr key={g.id}>
                            <td style={{ fontWeight: 600 }}>{g.name}</td>
                            <td>
                              <span className={`badge ${g.psp === "SQUARE" ? "badge-warning" : "badge-info"}`}>{g.psp}</span>
                            </td>
                            <td>
                              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <div className="progress-bar" style={{ width: 80 }}>
                                  <div className="progress-fill" style={{ width: `${g.traffic}%`, background: g.traffic > 50 ? COLORS.accent : COLORS.blue }} />
                                </div>
                                <span className="mono" style={{ fontSize: 12 }}>{g.traffic}%</span>
                              </div>
                            </td>
                            <td>
                              <span className={`badge ${g.active ? "badge-success" : "badge-gray"}`}>
                                {g.active ? "● Activo" : "○ Inactivo"}
                              </span>
                            </td>
                            <td>
                              <div style={{ display: "flex", gap: 8 }}>
                                <button className="btn btn-ghost" style={{ padding: "4px 10px", fontSize: 11 }}
                                  onClick={() => { setGateways(prev => prev.map(x => x.id === g.id ? { ...x, active: !x.active } : x)); showToast(`Pasarela ${g.active ? "desactivada" : "activada"}`); }}>
                                  {g.active ? "Desactivar" : "Activar"}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* SHOPS */}
          {section === "shops" && (
            <>
              <div className="topbar">
                <div>
                  <div className="page-title">Tiendas</div>
                  <div className="page-breadcrumb">{shops.length}/6 tiendas conectadas</div>
                </div>
                <div className="topbar-actions">
                  <button className="btn btn-primary" onClick={() => setModal("newShop")}>+ Nueva tienda</button>
                </div>
              </div>
              <div className="content">
                <div className="card">
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr><th>URL</th><th>Nombre</th><th>Términos propios</th><th>Estado</th><th></th></tr>
                      </thead>
                      <tbody>
                        {shops.map(s => (
                          <tr key={s.id}>
                            <td><span className="mono" style={{ fontSize: 12, color: COLORS.textDim }}>{s.url}</span></td>
                            <td style={{ fontWeight: 600 }}>{s.name}</td>
                            <td>{s.terms ? <span style={{ color: COLORS.success }}>✓</span> : <span style={{ color: COLORS.danger }}>✕</span>}</td>
                            <td><span className={`badge ${s.active ? "badge-success" : "badge-gray"}`}>{s.active ? "Activo" : "Inactivo"}</span></td>
                            <td>
                              <button className="btn btn-danger" style={{ padding: "4px 10px", fontSize: 11 }}
                                onClick={() => { setShops(prev => prev.filter(x => x.id !== s.id)); showToast("Tienda eliminada", "info"); }}>
                                Eliminar
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* WEBHOOKS */}
          {section === "webhooks" && (
            <>
              <div className="topbar">
                <div>
                  <div className="page-title">Webhooks & Notificaciones</div>
                  <div className="page-breadcrumb">{webhooks.filter(w => w.active).length} activos</div>
                </div>
                <div className="topbar-actions">
                  <button className="btn btn-primary" onClick={() => setModal("newWebhook")}>+ Nuevo webhook</button>
                </div>
              </div>
              <div className="content">
                <div className="grid-3" style={{ marginBottom: 20 }}>
                  {[
                    { label: "Disparados hoy", value: "247", color: COLORS.accent },
                    { label: "Tasa de éxito", value: "98.4%", color: COLORS.success },
                    { label: "Reintentos", value: "4", color: COLORS.warning },
                  ].map((s, i) => (
                    <div key={i} className="kpi-card">
                      <div className="kpi-label">{s.label}</div>
                      <div className="kpi-value mono" style={{ fontSize: 22, color: s.color }}>{s.value}</div>
                    </div>
                  ))}
                </div>

                <div className="card">
                  <div className="card-header"><span className="card-title">Endpoints configurados</span></div>
                  {webhooks.map(w => (
                    <div key={w.id} className="webhook-item">
                      <div>
                        <div className={`dot ${w.active ? "pulse" : ""}`} style={{ background: w.active ? COLORS.accent : COLORS.textMuted }} />
                      </div>
                      <span className="webhook-method method-post">POST</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{w.event}</div>
                        <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 2 }} className="mono">{w.url}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 11, color: COLORS.textMuted }}>{w.lastTriggered}</div>
                        {w.retries > 0 && <span className="badge badge-warning" style={{ marginTop: 4 }}>{w.retries} reintentos</span>}
                      </div>
                      <button className="btn btn-ghost" style={{ padding: "4px 10px", fontSize: 11 }}
                        onClick={() => { setWebhooks(prev => prev.map(x => x.id === w.id ? { ...x, active: !x.active } : x)); showToast("Webhook actualizado"); }}>
                        {w.active ? "Pausar" : "Activar"}
                      </button>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 20 }} className="card">
                  <div className="card-header"><span className="card-title">Reintentos automáticos</span></div>
                  <div className="card-body">
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                      {[
                        { label: "Máx. reintentos", value: "5 intentos" },
                        { label: "Backoff", value: "Exponencial (1s, 2s, 4s...)" },
                        { label: "Timeout", value: "30 segundos" },
                        { label: "Alertas", value: "Email si falla 3+ veces" },
                      ].map((s, i) => (
                        <div key={i} className="stat-row">
                          <span style={{ fontSize: 12, color: COLORS.textMuted }}>{s.label}</span>
                          <span style={{ fontSize: 13, fontWeight: 600 }}>{s.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* PIXELS */}
          {section === "pixels" && (
            <>
              <div className="topbar">
                <div>
                  <div className="page-title">Pixel Manager</div>
                  <div className="page-breadcrumb">Meta · TikTok · Pinterest</div>
                </div>
                <div className="topbar-actions">
                  <button className="btn btn-primary" onClick={() => setModal("newPixel")}>+ Nuevo pixel</button>
                </div>
              </div>
              <div className="content">
                <div className="card">
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr><th>Proveedor</th><th>Pixel ID</th><th>Nombre</th><th>Fecha</th><th>Estado</th><th></th></tr>
                      </thead>
                      <tbody>
                        {pixels.map(p => (
                          <tr key={p.id}>
                            <td>
                              <span className={`badge ${p.provider === "META" ? "badge-info" : p.provider === "TIKTOK" ? "badge-danger" : "badge-warning"}`}>
                                {p.provider}
                              </span>
                            </td>
                            <td><span className="mono" style={{ fontSize: 12 }}>{p.pixelId}</span></td>
                            <td style={{ fontWeight: 600 }}>{p.name}</td>
                            <td style={{ color: COLORS.textMuted, fontSize: 12 }}>{p.date}</td>
                            <td><span className={`badge ${p.active ? "badge-success" : "badge-gray"}`}>{p.active ? "Activo" : "Inactivo"}</span></td>
                            <td>
                              <button className="btn btn-danger" style={{ padding: "4px 10px", fontSize: 11 }}
                                onClick={() => { setPixels(prev => prev.filter(x => x.id !== p.id)); showToast("Pixel eliminado", "info"); }}>
                                Eliminar
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* TEMPLATES */}
          {section === "templates" && (
            <>
              <div className="topbar">
                <div>
                  <div className="page-title">Email Templates</div>
                  <div className="page-breadcrumb">Cart Recovery · Order Confirmation · Tracking</div>
                </div>
                <div className="topbar-actions">
                  <button className="btn btn-primary" onClick={() => setModal("newTemplate")}>+ Nueva plantilla</button>
                </div>
              </div>
              <div className="content">
                <div className="card">
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr><th>Nombre</th><th>Asunto</th><th>Estado</th><th>Actualizado</th><th></th></tr>
                      </thead>
                      <tbody>
                        {templates.map(t => (
                          <tr key={t.id}>
                            <td style={{ fontWeight: 600 }}>{t.name}</td>
                            <td style={{ color: COLORS.textDim, fontSize: 12 }}>{t.subject}</td>
                            <td><span className={`badge ${t.active ? "badge-success" : "badge-gray"}`}>{t.active ? "Activo" : "Inactivo"}</span></td>
                            <td style={{ color: COLORS.textMuted, fontSize: 12 }}>{t.updated}</td>
                            <td>
                              <button className="btn btn-ghost" style={{ padding: "4px 10px", fontSize: 11 }}
                                onClick={() => showToast("Editor de plantillas próximamente", "info")}>
                                Editar
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {/* MODALS */}
      {modal === "batch" && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Batch Payment</div>
            <div className="form-group">
              <label className="form-label">Proveedor</label>
              <select className="form-input select-input"><option>STRIPE</option><option>SQUARE</option></select>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Fecha desde</label>
                <input type="date" className="form-input" defaultValue="2026-04-01" />
              </div>
              <div className="form-group">
                <label className="form-label">Fecha hasta</label>
                <input type="date" className="form-input" defaultValue="2026-04-03" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Importe (€)</label>
              <input type="number" className="form-input" placeholder="0.00" />
            </div>
            <div className="form-group">
              <label className="form-label">Descriptor</label>
              <input className="form-input" placeholder="Aparece en el extracto del cliente" />
            </div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={closeModal}>Cancelar</button>
              <button className="btn btn-primary" onClick={() => { closeModal(); showToast("Batch payment ejecutado con éxito"); }}>Ejecutar</button>
            </div>
          </div>
        </div>
      )}

      {modal === "newGateway" && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Nueva pasarela de pago</div>
            <div className="form-group">
              <label className="form-label">Nombre</label>
              <input className="form-input" placeholder="ej: Stripe - mi-cuenta" />
            </div>
            <div className="form-group">
              <label className="form-label">PSP</label>
              <select className="form-input select-input"><option>STRIPE</option><option>SQUARE</option></select>
            </div>
            <div className="form-group">
              <label className="form-label">API Key</label>
              <input className="form-input" type="password" placeholder="sk_live_..." />
            </div>
            <div className="form-group">
              <label className="form-label">Tráfico %</label>
              <input type="number" className="form-input" placeholder="0-100" min={0} max={100} />
            </div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={closeModal}>Cancelar</button>
              <button className="btn btn-primary" onClick={() => { closeModal(); showToast("Pasarela añadida correctamente"); }}>Guardar</button>
            </div>
          </div>
        </div>
      )}

      {modal === "newShop" && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Nueva tienda</div>
            <div className="form-group"><label className="form-label">URL Shopify</label><input className="form-input" placeholder="mi-tienda.myshopify.com" /></div>
            <div className="form-group"><label className="form-label">Nombre</label><input className="form-input" placeholder="Nombre de la tienda" /></div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={closeModal}>Cancelar</button>
              <button className="btn btn-primary" onClick={() => { closeModal(); showToast("Tienda conectada"); }}>Conectar</button>
            </div>
          </div>
        </div>
      )}

      {modal === "newWebhook" && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Nuevo webhook</div>
            <div className="form-group">
              <label className="form-label">Evento</label>
              <select className="form-input select-input">
                <option>payment.succeeded</option><option>payment.failed</option><option>payment.created</option><option>rebill.processed</option>
              </select>
            </div>
            <div className="form-group"><label className="form-label">URL destino</label><input className="form-input" placeholder="https://..." /></div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={closeModal}>Cancelar</button>
              <button className="btn btn-primary" onClick={() => { closeModal(); showToast("Webhook creado"); }}>Crear</button>
            </div>
          </div>
        </div>
      )}

      {modal === "newPixel" && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Nuevo pixel</div>
            <div className="form-group">
              <label className="form-label">Proveedor</label>
              <select className="form-input select-input"><option>META</option><option>TIKTOK</option><option>PINTEREST</option></select>
            </div>
            <div className="form-group"><label className="form-label">Pixel ID</label><input className="form-input" placeholder="123456789012345" /></div>
            <div className="form-group"><label className="form-label">Nombre</label><input className="form-input" placeholder="Nombre del pixel" /></div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={closeModal}>Cancelar</button>
              <button className="btn btn-primary" onClick={() => { closeModal(); showToast("Pixel añadido"); }}>Guardar</button>
            </div>
          </div>
        </div>
      )}

      {modal === "newTemplate" && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Nueva plantilla de email</div>
            <div className="form-group"><label className="form-label">Nombre</label><input className="form-input" placeholder="Nombre interno" /></div>
            <div className="form-group"><label className="form-label">Asunto</label><input className="form-input" placeholder="Asunto del email" /></div>
            <div className="form-group">
              <label className="form-label">Contenido HTML</label>
              <textarea className="form-input" rows={5} placeholder="<html>...</html>" style={{ resize: "vertical" }} />
            </div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={closeModal}>Cancelar</button>
              <button className="btn btn-primary" onClick={() => { closeModal(); showToast("Plantilla guardada"); }}>Guardar</button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}
