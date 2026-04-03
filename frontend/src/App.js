import { useState, useEffect, useCallback } from 'react';
import { gatewaysApi, paymentsApi, subscriptionsApi, batchApi, shopsApi, webhooksApi, pixelsApi, templatesApi } from './api';

// ── Design tokens ────────────────────────────────────────────────────────────
const C = {
  bg: '#0a0c10', card: '#0f1117', cardHover: '#141720',
  border: '#1e2330', borderLight: '#2a3045',
  accent: '#00d4a0', accentDim: '#00d4a018', accentHover: '#00e8b0',
  gold: '#f5c842', red: '#ff4d4d', blue: '#4d9fff',
  text: '#e8eaf0', muted: '#6b7280', dim: '#9ca3af',
};

const css = `
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@400;500;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{background:${C.bg};color:${C.text};font-family:'Syne',sans-serif}
::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:${C.bg}}::-webkit-scrollbar-thumb{background:${C.border};border-radius:2px}
.mono{font-family:'DM Mono',monospace}
.layout{display:flex;height:100vh;overflow:hidden}
.sidebar{width:220px;min-width:220px;background:${C.card};border-right:1px solid ${C.border};display:flex;flex-direction:column;overflow-y:auto}
.logo-wrap{padding:22px 20px 18px;border-bottom:1px solid ${C.border}}
.logo-row{display:flex;align-items:center;gap:10px}
.logo-icon{width:32px;height:32px;border-radius:8px;background:${C.accent};display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:700;color:#000}
.logo-name{font-size:15px;font-weight:700}
.logo-sub{font-size:10px;color:${C.muted};letter-spacing:.1em;text-transform:uppercase;margin-top:1px}
.nav{padding:14px 12px 8px}
.nav-label{font-size:10px;color:${C.muted};letter-spacing:.12em;text-transform:uppercase;padding:0 8px;margin-bottom:6px}
.nav-item{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:8px;cursor:pointer;font-size:13px;font-weight:500;color:${C.muted};transition:all .15s;margin-bottom:2px;border:none;background:none;width:100%;text-align:left;font-family:'Syne',sans-serif}
.nav-item:hover{background:${C.cardHover};color:${C.text}}
.nav-item.active{background:${C.accentDim};color:${C.accent}}
.nav-icon{font-size:14px;width:18px;text-align:center}
.nav-badge{margin-left:auto;background:${C.accent};color:#000;font-size:10px;font-weight:700;padding:1px 6px;border-radius:20px}
.user-row{margin-top:auto;padding:14px 12px;border-top:1px solid ${C.border};display:flex;align-items:center;gap:10px}
.avatar{width:28px;height:28px;border-radius:50%;background:${C.accent};display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#000;flex-shrink:0}
.main{flex:1;overflow-y:auto;display:flex;flex-direction:column}
.topbar{padding:16px 28px;border-bottom:1px solid ${C.border};display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;background:${C.bg};z-index:10}
.page-title{font-size:18px;font-weight:700}
.breadcrumb{font-size:12px;color:${C.muted};margin-top:2px}
.topbar-actions{display:flex;gap:10px;align-items:center}
.btn{padding:8px 16px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;border:none;transition:all .15s;font-family:'Syne',sans-serif}
.btn-primary{background:${C.accent};color:#000}.btn-primary:hover{background:${C.accentHover}}
.btn-ghost{background:transparent;color:${C.muted};border:1px solid ${C.border}}.btn-ghost:hover{background:${C.card};color:${C.text}}
.btn-danger{background:#ff4d4d18;color:${C.red};border:1px solid #ff4d4d30}.btn-danger:hover{background:#ff4d4d25}
.btn-sm{padding:5px 12px;font-size:12px}
.content{padding:24px 28px;flex:1}
.kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px}
.kpi{background:${C.card};border:1px solid ${C.border};border-radius:12px;padding:20px;transition:border-color .2s}
.kpi:hover{border-color:${C.borderLight}}
.kpi-label{font-size:11px;color:${C.muted};text-transform:uppercase;letter-spacing:.1em;margin-bottom:10px}
.kpi-value{font-size:26px;font-weight:700;font-family:'DM Mono',monospace}
.kpi-delta{font-size:12px;margin-top:6px}
.up{color:${C.accent}}.down{color:${C.red}}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:24px}
.grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-bottom:24px}
.card{background:${C.card};border:1px solid ${C.border};border-radius:12px;overflow:hidden}
.card-head{padding:14px 20px;border-bottom:1px solid ${C.border};display:flex;align-items:center;justify-content:space-between}
.card-title{font-size:14px;font-weight:600}
.card-body{padding:20px}
.table-wrap{overflow-x:auto}
table{width:100%;border-collapse:collapse;font-size:13px}
th{padding:10px 16px;text-align:left;font-size:11px;font-weight:600;color:${C.muted};text-transform:uppercase;letter-spacing:.08em;border-bottom:1px solid ${C.border}}
td{padding:11px 16px;border-bottom:1px solid ${C.border}20;vertical-align:middle}
tr:last-child td{border-bottom:none}
tr:hover td{background:${C.cardHover}}
.badge{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600}
.badge-ok{background:#00d4a018;color:${C.accent}}
.badge-fail{background:#ff4d4d18;color:${C.red}}
.badge-warn{background:#f5c84218;color:${C.gold}}
.badge-info{background:#4d9fff18;color:${C.blue}}
.badge-gray{background:${C.border};color:${C.muted}}
.tag{display:inline-flex;align-items:center;padding:2px 8px;border-radius:4px;font-size:11px;background:${C.border};color:${C.dim}}
.progress{height:6px;background:${C.border};border-radius:3px;overflow:hidden}
.progress-fill{height:100%;border-radius:3px;transition:width .5s}
.form-group{margin-bottom:14px}
.form-label{font-size:11px;color:${C.muted};margin-bottom:5px;display:block;font-weight:600;text-transform:uppercase;letter-spacing:.05em}
.form-input{width:100%;background:${C.bg};border:1px solid ${C.border};border-radius:8px;padding:9px 12px;font-size:13px;color:${C.text};font-family:'Syne',sans-serif;outline:none;transition:border-color .15s}
.form-input:focus{border-color:${C.accent}}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.filters{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-bottom:18px}
.search{background:${C.card};border:1px solid ${C.border};border-radius:8px;padding:8px 12px;font-size:13px;color:${C.text};font-family:'Syne',sans-serif;outline:none;width:240px}
.search:focus{border-color:${C.accent}}
.pill-group{display:flex;background:${C.card};border:1px solid ${C.border};border-radius:8px;overflow:hidden}
.pill{padding:6px 12px;font-size:12px;font-weight:600;cursor:pointer;border:none;background:none;color:${C.muted};font-family:'Syne',sans-serif;transition:all .15s}
.pill.active{background:${C.accentDim};color:${C.accent}}
.modal-bg{position:fixed;inset:0;background:#000000b0;display:flex;align-items:center;justify-content:center;z-index:100}
.modal{background:${C.card};border:1px solid ${C.border};border-radius:16px;padding:28px;width:480px;max-width:95vw;animation:fadeIn .2s ease}
@keyframes fadeIn{from{opacity:0;transform:scale(.97)}to{opacity:1;transform:scale(1)}}
.modal-title{font-size:16px;font-weight:700;margin-bottom:20px}
.modal-actions{display:flex;gap:10px;justify-content:flex-end;margin-top:22px}
.toast{position:fixed;bottom:24px;right:24px;background:${C.card};border:1px solid ${C.border};border-radius:10px;padding:12px 18px;font-size:13px;z-index:200;display:flex;align-items:center;gap:10px;animation:slideUp .3s ease}
@keyframes slideUp{from{transform:translateY(16px);opacity:0}to{transform:translateY(0);opacity:1}}
.dot{width:7px;height:7px;border-radius:50%;display:inline-block;flex-shrink:0}
.pulse{animation:pulse 1.8s infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
.mini-bars{display:flex;align-items:flex-end;gap:2px;height:44px}
.mini-bar{flex:1;border-radius:2px 2px 0 0;transition:height .4s,background .2s;min-width:4px}
.stat-line{display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid ${C.border}20}
.stat-line:last-child{border-bottom:none}
.empty{text-align:center;padding:40px;color:${C.muted};font-size:14px}
.connect-banner{background:linear-gradient(135deg,${C.accentDim},${C.border});border:1px solid ${C.accent}40;border-radius:12px;padding:20px 24px;margin-bottom:24px;display:flex;align-items:center;justify-content:space-between;gap:16px}
.connect-title{font-size:15px;font-weight:700;margin-bottom:4px}
.connect-sub{font-size:12px;color:${C.muted}}
.step-list{counter-reset:step}
.step{display:flex;gap:14px;padding:14px 0;border-bottom:1px solid ${C.border}20}
.step:last-child{border-bottom:none}
.step-num{width:28px;height:28px;border-radius:50%;background:${C.accentDim};color:${C.accent};display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0;border:1px solid ${C.accent}40}
.step-body{flex:1}
.step-title{font-size:13px;font-weight:600;margin-bottom:4px}
.step-desc{font-size:12px;color:${C.muted};line-height:1.6}
.code-block{background:${C.bg};border:1px solid ${C.border};border-radius:8px;padding:12px 16px;font-family:'DM Mono',monospace;font-size:12px;color:${C.accent};margin-top:8px;white-space:pre-wrap;line-height:1.6}
.section-tabs{display:flex;gap:2px;background:${C.bg};border:1px solid ${C.border};border-radius:8px;padding:3px;margin-bottom:20px}
.section-tab{padding:6px 14px;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;border:none;background:none;color:${C.muted};font-family:'Syne',sans-serif;transition:all .15s}
.section-tab.active{background:${C.card};color:${C.text}}
`;

// ── Reusable Components ──────────────────────────────────────────────────────

function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3200); return () => clearTimeout(t); }, [onClose]);
  const colors = { success: C.accent, error: C.red, info: C.blue, warning: C.gold };
  return <div className="toast"><div className="dot" style={{ background: colors[type] || C.accent }} />{msg}</div>;
}

function Modal({ title, onClose, children }) {
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-title">{title}</div>
        {children}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    SUCCEEDED: ['badge-ok', '● Pagado'], ACTIVE: ['badge-ok', '● Activo'],
    FAILED: ['badge-fail', '● Error'], CANCELLED: ['badge-fail', '● Cancelado'],
    PROCESSING: ['badge-info', '● Procesando'], PAUSED: ['badge-warn', '● Pausado'],
    CREATED: ['badge-gray', '● Creado'], INACTIVE: ['badge-gray', '○ Inactivo'],
  };
  const [cls, label] = map[status] || ['badge-gray', status];
  return <span className={`badge ${cls}`}>{label}</span>;
}

function MiniChart({ data }) {
  const max = Math.max(...data, 1);
  return (
    <div className="mini-bars">
      {data.map((v, i) => (
        <div key={i} className="mini-bar"
          style={{ height: `${(v / max) * 100}%`, background: i === data.length - 1 ? C.accent : C.accent + '40' }} />
      ))}
    </div>
  );
}

// ── PAGES ────────────────────────────────────────────────────────────────────

function Dashboard({ showToast }) {
  const [kpis, setKpis] = useState(null);
  useEffect(() => {
    paymentsApi.getKpis().then(setKpis).catch(() => setKpis({ totalRevenue: '0', todayRevenue: '0', todaySales: 0, activeSubscriptions: 0, conversionRate: '0', totalPayments: 0 }));
  }, []);

  const mockBars = [8, 15, 12, 22, 18, 29, 11, 24, 19, 31, 27, 38, 33, 42, 35, 28, 45, 39, 52, 48, 41, 58, 53, 66, 61, 70, 64, 74, 68, 80];

  if (!kpis) return <div className="content"><div style={{ color: C.muted, padding: 40 }}>Cargando dashboard…</div></div>;

  return (
    <div className="content">
      <div className="kpis">
        {[
          { label: 'Revenue hoy', value: `€${parseFloat(kpis.todayRevenue || 0).toFixed(2)}`, delta: '↑ vs ayer', up: true },
          { label: 'Ventas hoy', value: kpis.todaySales || 0, delta: 'pagos completados', up: true },
          { label: 'Suscripciones', value: kpis.activeSubscriptions || 0, delta: 'activas ahora', up: true },
          { label: 'Conv. Rate', value: `${kpis.conversionRate || 0}%`, delta: 'de intentos → éxito', up: true },
        ].map((k, i) => (
          <div key={i} className="kpi">
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value mono">{k.value}</div>
            <div className={`kpi-delta ${k.up ? 'up' : 'down'}`}>{k.delta}</div>
          </div>
        ))}
      </div>

      <div className="grid2">
        <div className="card">
          <div className="card-head"><span className="card-title">Pagos diarios (30d)</span><span style={{ fontSize: 12, color: C.accent }} className="mono">↑ tendencia</span></div>
          <div className="card-body">
            <MiniChart data={mockBars} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11, color: C.muted }}>
              <span>Hace 30d</span><span>Hoy</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-head"><span className="card-title">Resumen total</span></div>
          <div className="card-body">
            {[
              { k: 'Revenue total', v: `€${parseFloat(kpis.totalRevenue || 0).toFixed(2)}` },
              { k: 'Pagos totales', v: kpis.totalPayments || 0 },
              { k: 'Pagos exitosos', v: kpis.succeededPayments || 0 },
              { k: 'Suscripciones activas', v: kpis.activeSubscriptions || 0 },
            ].map((s, i) => (
              <div key={i} className="stat-line">
                <span style={{ fontSize: 13, color: C.muted }}>{s.k}</span>
                <span className="mono" style={{ fontWeight: 700 }}>{s.v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="connect-banner">
        <div>
          <div className="connect-title">🔌 Conecta tus pasarelas para ver datos reales</div>
          <div className="connect-sub">Ve a Pasarelas → Añadir pasarela → introduce tus credenciales de Stripe, Square o TailoredPayments</div>
        </div>
        <button className="btn btn-primary" onClick={() => showToast('Ir a sección Pasarelas', 'info')}>Ver pasarelas →</button>
      </div>
    </div>
  );
}

function Payments({ showToast }) {
  const [payments, setPayments] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    paymentsApi.getAll().then(d => { setPayments(d.payments || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = payments.filter(p => {
    const ms = filter === 'ALL' || p.status === filter;
    const mq = !search || p.email?.toLowerCase().includes(search.toLowerCase()) || p.id?.includes(search);
    return ms && mq;
  });

  return (
    <div className="content">
      <div className="filters">
        <input className="search" placeholder="Buscar email o ID..." value={search} onChange={e => setSearch(e.target.value)} />
        <div className="pill-group">
          {['ALL', 'SUCCEEDED', 'CREATED', 'FAILED', 'PROCESSING'].map(s => (
            <button key={s} className={`pill ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>
              {s === 'ALL' ? 'Todos' : s === 'SUCCEEDED' ? 'Pagados' : s === 'CREATED' ? 'Creados' : s === 'FAILED' ? 'Fallidos' : 'Procesando'}
            </button>
          ))}
        </div>
        <button className="btn btn-ghost btn-sm" onClick={() => showToast('Exportando...', 'info')}>↓ Excel</button>
      </div>
      <div className="card">
        {loading ? <div className="empty">Cargando pagos...</div> : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Estado</th><th>Importe</th><th>Gateway</th><th>PSP</th><th>Email</th><th>Fecha</th><th>Acciones</th></tr></thead>
              <tbody>
                {filtered.length === 0 && <tr><td colSpan={7}><div className="empty">Sin pagos. Conecta una pasarela para empezar.</div></td></tr>}
                {filtered.map(p => (
                  <tr key={p.id}>
                    <td><StatusBadge status={p.status} /></td>
                    <td><span className="mono" style={{ fontWeight: 700 }}>€{parseFloat(p.amount || 0).toFixed(2)}</span></td>
                    <td><span className="tag">{p.gateway || '—'}</span></td>
                    <td><span className={`badge ${p.psp === 'STRIPE' ? 'badge-info' : p.psp === 'SQUARE' ? 'badge-warn' : 'badge-gray'}`}>{p.psp || '—'}</span></td>
                    <td style={{ color: C.dim, fontSize: 12 }}>{p.email || '—'}</td>
                    <td style={{ color: C.muted, fontSize: 12 }}>{p.createdAt ? new Date(p.createdAt).toLocaleString('es-ES') : '—'}</td>
                    <td>
                      {p.status === 'SUCCEEDED' && (
                        <button className="btn btn-danger btn-sm" onClick={() => {
                          paymentsApi.refund(p.id).then(() => { showToast('Reembolso procesado', 'success'); load(); }).catch(e => showToast(e.message, 'error'));
                        }}>Reembolsar</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div style={{ marginTop: 12, color: C.muted, fontSize: 12 }}>{filtered.length} de {payments.length} pagos</div>
    </div>
  );
}

function Gateways({ showToast }) {
  const [gateways, setGateways] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name: '', psp: 'STRIPE', trafficPct: 0, active: true, credentials: {} });
  const [credFields, setCredFields] = useState({ secretKey: '', webhookSecret: '' });

  useEffect(() => { gatewaysApi.getAll().then(setGateways).catch(() => setGateways([])); }, []);

  const save = () => {
    const data = { ...form, credentials: getPspCredentials() };
    gatewaysApi.create(data).then(g => {
      setGateways(prev => [...prev, g]);
      setModal(false);
      showToast('Pasarela añadida ✓', 'success');
    }).catch(e => showToast(e.message, 'error'));
  };

  const toggle = (gw) => {
    gatewaysApi.update(gw.id, { active: !gw.active }).then(updated => {
      setGateways(prev => prev.map(g => g.id === gw.id ? updated : g));
      showToast(`Pasarela ${updated.active ? 'activada' : 'desactivada'}`, 'success');
    });
  };

  const remove = (id) => {
    if (!window.confirm('¿Eliminar esta pasarela?')) return;
    gatewaysApi.delete(id).then(() => { setGateways(prev => prev.filter(g => g.id !== id)); showToast('Eliminada', 'info'); });
  };

  const getPspCredentials = () => {
    if (form.psp === 'STRIPE') return { secretKey: credFields.secretKey, webhookSecret: credFields.webhookSecret };
    if (form.psp === 'SQUARE') return { accessToken: credFields.secretKey, locationId: credFields.locationId, environment: credFields.environment || 'production' };
    if (form.psp === 'TAILORED') return { apiKey: credFields.secretKey, merchantId: credFields.merchantId, baseUrl: credFields.baseUrl };
    return {};
  };

  const pspFields = {
    STRIPE: [
      { key: 'secretKey', label: 'Secret Key', placeholder: 'sk_live_...' },
      { key: 'webhookSecret', label: 'Webhook Secret', placeholder: 'whsec_...' },
    ],
    SQUARE: [
      { key: 'secretKey', label: 'Access Token', placeholder: 'EAAAxxxxx...' },
      { key: 'locationId', label: 'Location ID', placeholder: 'LXXXXXXXXX' },
      { key: 'environment', label: 'Entorno', placeholder: 'production / sandbox' },
    ],
    TAILORED: [
      { key: 'secretKey', label: 'API Key', placeholder: 'tp_live_...' },
      { key: 'merchantId', label: 'Merchant ID', placeholder: 'MERCHANT_xxx' },
      { key: 'baseUrl', label: 'Base URL', placeholder: 'https://api.tailoredpayments.com/v1' },
    ],
  };

  return (
    <div className="content">
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Nombre</th><th>PSP</th><th>Tráfico</th><th>Estado</th><th>Acciones</th></tr></thead>
            <tbody>
              {gateways.length === 0 && <tr><td colSpan={5}><div className="empty">Sin pasarelas. Añade tu primera pasarela arriba.</div></td></tr>}
              {gateways.map(g => (
                <tr key={g.id}>
                  <td style={{ fontWeight: 600 }}>{g.name}</td>
                  <td><span className={`badge ${g.psp === 'STRIPE' ? 'badge-info' : g.psp === 'SQUARE' ? 'badge-warn' : 'badge-ok'}`}>{g.psp}</span></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="progress" style={{ width: 80 }}>
                        <div className="progress-fill" style={{ width: `${g.trafficPct || 0}%`, background: C.accent }} />
                      </div>
                      <span className="mono" style={{ fontSize: 12 }}>{g.trafficPct || 0}%</span>
                    </div>
                  </td>
                  <td><StatusBadge status={g.active ? 'ACTIVE' : 'INACTIVE'} /></td>
                  <td style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => toggle(g)}>{g.active ? 'Pausar' : 'Activar'}</button>
                    <button className="btn btn-danger btn-sm" onClick={() => remove(g.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <Modal title="Nueva pasarela de pago" onClose={() => setModal(false)}>
          <div className="form-group">
            <label className="form-label">Nombre</label>
            <input className="form-input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="ej: Stripe - cuenta principal" />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">PSP</label>
              <select className="form-input" value={form.psp} onChange={e => setForm(p => ({ ...p, psp: e.target.value }))}>
                <option value="STRIPE">Stripe</option>
                <option value="SQUARE">Square</option>
                <option value="TAILORED">TailoredPayments</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Tráfico %</label>
              <input type="number" className="form-input" min={0} max={100} value={form.trafficPct} onChange={e => setForm(p => ({ ...p, trafficPct: +e.target.value }))} />
            </div>
          </div>
          {pspFields[form.psp]?.map(f => (
            <div key={f.key} className="form-group">
              <label className="form-label">{f.label}</label>
              <input type={f.key.toLowerCase().includes('key') || f.key.toLowerCase().includes('token') || f.key.toLowerCase().includes('secret') ? 'password' : 'text'}
                className="form-input" placeholder={f.placeholder}
                value={credFields[f.key] || ''}
                onChange={e => setCredFields(p => ({ ...p, [f.key]: e.target.value }))} />
            </div>
          ))}
          <div className="modal-actions">
            <button className="btn btn-ghost" onClick={() => setModal(false)}>Cancelar</button>
            <button className="btn btn-primary" onClick={save}>Guardar pasarela</button>
          </div>
        </Modal>
      )}
      {/* Trigger for modal comes from topbar button passed via prop – handled in App */}
      <div style={{ marginTop: 12 }}>
        <button className="btn btn-primary" onClick={() => setModal(true)}>+ Añadir pasarela</button>
      </div>
    </div>
  );
}

function Subscriptions({ showToast }) {
  const [subs, setSubs] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ customerId: '', amount: '', currency: 'EUR', interval: 'month', intervalCount: 1, trialDays: 0, metadata: {} });
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    subscriptionsApi.getAll().then(d => { setSubs(d.subscriptions || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);

  const create = () => {
    subscriptionsApi.create(form).then(() => { showToast('Suscripción creada ✓', 'success'); setModal(false); load(); }).catch(e => showToast(e.message, 'error'));
  };

  const cancel = (id) => {
    if (!window.confirm('¿Cancelar suscripción?')) return;
    subscriptionsApi.cancel(id).then(() => { showToast('Suscripción cancelada', 'info'); load(); }).catch(e => showToast(e.message, 'error'));
  };

  return (
    <div className="content">
      <div style={{ marginBottom: 18 }}>
        <button className="btn btn-primary" onClick={() => setModal(true)}>+ Nueva suscripción</button>
      </div>
      <div className="card">
        {loading ? <div className="empty">Cargando...</div> : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Estado</th><th>Cliente</th><th>Importe</th><th>Intervalo</th><th>Gateway</th><th>Próximo cobro</th><th>Acciones</th></tr></thead>
              <tbody>
                {subs.length === 0 && <tr><td colSpan={7}><div className="empty">Sin suscripciones activas.</div></td></tr>}
                {subs.map(s => (
                  <tr key={s.id}>
                    <td><StatusBadge status={s.status} /></td>
                    <td style={{ fontSize: 12, color: C.dim }}>{s.customerId || '—'}</td>
                    <td><span className="mono" style={{ fontWeight: 700 }}>€{parseFloat(s.amount || 0).toFixed(2)}</span></td>
                    <td><span className="tag">cada {s.intervalCount} {s.interval}</span></td>
                    <td><span className="tag">{s.gateway || '—'}</span></td>
                    <td style={{ fontSize: 12, color: C.muted }}>{s.nextBillingDate ? new Date(s.nextBillingDate).toLocaleDateString('es-ES') : '—'}</td>
                    <td style={{ display: 'flex', gap: 6 }}>
                      {s.status === 'ACTIVE' && <button className="btn btn-ghost btn-sm" onClick={() => subscriptionsApi.pause(s.id).then(() => { showToast('Pausada', 'info'); load(); })}>Pausar</button>}
                      {s.status === 'PAUSED' && <button className="btn btn-ghost btn-sm" onClick={() => subscriptionsApi.resume(s.id).then(() => { showToast('Reanudada', 'success'); load(); })}>Reanudar</button>}
                      <button className="btn btn-danger btn-sm" onClick={() => cancel(s.id)}>Cancelar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
        <Modal title="Nueva suscripción" onClose={() => setModal(false)}>
          <div className="form-group"><label className="form-label">Customer ID (del PSP)</label><input className="form-input" placeholder="cus_xxx o ID del cliente" value={form.customerId} onChange={e => setForm(p => ({ ...p, customerId: e.target.value }))} /></div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Importe</label><input type="number" className="form-input" placeholder="9.99" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} /></div>
            <div className="form-group"><label className="form-label">Moneda</label>
              <select className="form-input" value={form.currency} onChange={e => setForm(p => ({ ...p, currency: e.target.value }))}><option>EUR</option><option>USD</option><option>GBP</option></select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Intervalo</label>
              <select className="form-input" value={form.interval} onChange={e => setForm(p => ({ ...p, interval: e.target.value }))}><option value="day">Diario</option><option value="week">Semanal</option><option value="month">Mensual</option><option value="year">Anual</option></select>
            </div>
            <div className="form-group"><label className="form-label">Días de prueba</label><input type="number" className="form-input" placeholder="0" value={form.trialDays} onChange={e => setForm(p => ({ ...p, trialDays: +e.target.value }))} /></div>
          </div>
          <div className="modal-actions">
            <button className="btn btn-ghost" onClick={() => setModal(false)}>Cancelar</button>
            <button className="btn btn-primary" onClick={create}>Crear suscripción</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function BatchPayment({ showToast }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ psp: 'STRIPE', dateFrom: '', dateTo: '', amount: '', currency: 'EUR', description: '' });
  const [customers, setCustomers] = useState([]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCustomers = () => {
    setLoading(true);
    batchApi.fetchCustomers({ psp: form.psp, dateFrom: form.dateFrom, dateTo: form.dateTo })
      .then(d => { setCustomers(d.customers || []); setStep(2); setLoading(false); })
      .catch(e => { showToast(e.response?.data?.error || e.message, 'error'); setLoading(false); });
  };

  const charge = () => {
    if (!window.confirm(`¿Cobrar €${form.amount} a ${customers.filter(c => c.hasMethod).length} clientes?`)) return;
    setLoading(true);
    const ids = customers.filter(c => c.hasMethod).map(c => c.id);
    batchApi.charge({ customerIds: ids, amount: +form.amount, currency: form.currency, description: form.description })
      .then(r => { setResults(r); setStep(3); setLoading(false); })
      .catch(e => { showToast(e.response?.data?.error || e.message, 'error'); setLoading(false); });
  };

  return (
    <div className="content">
      <div className="section-tabs">
        {['1. Configurar', '2. Clientes', '3. Resultado'].map((t, i) => (
          <button key={i} className={`section-tab ${step === i + 1 ? 'active' : ''}`}>{t}</button>
        ))}
      </div>

      {step === 1 && (
        <div className="card" style={{ maxWidth: 520 }}>
          <div className="card-head"><span className="card-title">Configuración del batch</span></div>
          <div className="card-body">
            <div className="form-group"><label className="form-label">PSP</label>
              <select className="form-input" value={form.psp} onChange={e => setForm(p => ({ ...p, psp: e.target.value }))}><option value="STRIPE">Stripe</option><option value="SQUARE">Square</option><option value="TAILORED">TailoredPayments</option></select>
            </div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Clientes desde</label><input type="date" className="form-input" value={form.dateFrom} onChange={e => setForm(p => ({ ...p, dateFrom: e.target.value }))} /></div>
              <div className="form-group"><label className="form-label">Hasta</label><input type="date" className="form-input" value={form.dateTo} onChange={e => setForm(p => ({ ...p, dateTo: e.target.value }))} /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Importe (€)</label><input type="number" className="form-input" placeholder="9.99" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} /></div>
              <div className="form-group"><label className="form-label">Moneda</label>
                <select className="form-input" value={form.currency} onChange={e => setForm(p => ({ ...p, currency: e.target.value }))}><option>EUR</option><option>USD</option></select>
              </div>
            </div>
            <div className="form-group"><label className="form-label">Descripción</label><input className="form-input" placeholder="Ej: Cobro mensual plan Pro" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} /></div>
            <button className="btn btn-primary" onClick={fetchCustomers} disabled={loading}>{loading ? 'Cargando…' : 'Ver clientes →'}</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="card">
          <div className="card-head">
            <span className="card-title">Clientes encontrados: {customers.length}</span>
            <div style={{ display: 'flex', gap: 10 }}>
              <span style={{ fontSize: 12, color: C.accent }}>{customers.filter(c => c.hasMethod).length} con método de pago</span>
              <button className="btn btn-ghost btn-sm" onClick={() => setStep(1)}>← Atrás</button>
              <button className="btn btn-primary btn-sm" onClick={charge} disabled={loading || !customers.filter(c => c.hasMethod).length}>{loading ? 'Procesando…' : `Cobrar €${form.amount} a ${customers.filter(c => c.hasMethod).length}`}</button>
            </div>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>#</th><th>Email</th><th>Nombre</th><th>Método de pago</th></tr></thead>
              <tbody>
                {customers.map((c, i) => (
                  <tr key={c.id}>
                    <td style={{ color: C.muted, fontSize: 12 }}>{i + 1}</td>
                    <td style={{ fontSize: 12 }}>{c.email}</td>
                    <td style={{ fontSize: 12, color: C.dim }}>{c.name || '—'}</td>
                    <td><span className={`badge ${c.hasMethod ? 'badge-ok' : 'badge-fail'}`}>{c.hasMethod ? `✓ ${c.methodCount} tarjeta(s)` : '✗ Sin método'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {step === 3 && results && (
        <div>
          <div className="kpis" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
            <div className="kpi"><div className="kpi-label">Total procesados</div><div className="kpi-value mono">{results.total}</div></div>
            <div className="kpi"><div className="kpi-label">Exitosos</div><div className="kpi-value mono up">{results.success}</div></div>
            <div className="kpi"><div className="kpi-label">Fallidos</div><div className="kpi-value mono down">{results.failed}</div></div>
          </div>
          <div className="card">
            <div className="table-wrap">
              <table>
                <thead><tr><th>Cliente ID</th><th>Estado</th><th>Detalle</th></tr></thead>
                <tbody>
                  {results.results?.map((r, i) => (
                    <tr key={i}>
                      <td style={{ fontSize: 12 }} className="mono">{r.customerId}</td>
                      <td><StatusBadge status={r.status === 'success' ? 'SUCCEEDED' : 'FAILED'} /></td>
                      <td style={{ fontSize: 12, color: C.muted }}>{r.paymentId || r.error || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <button className="btn btn-ghost" style={{ marginTop: 16 }} onClick={() => { setStep(1); setResults(null); setCustomers([]); }}>← Nuevo batch</button>
        </div>
      )}
    </div>
  );
}

function Webhooks({ showToast }) {
  const [hooks, setHooks] = useState([]);
  const [logs, setLogs] = useState([]);
  const [tab, setTab] = useState('endpoints');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ url: '', events: ['payment.succeeded'], active: true });

  const load = useCallback(() => {
    webhooksApi.getAll().then(d => setHooks(Array.isArray(d) ? d : [])).catch(() => setHooks([]));
    webhooksApi.getLogs().then(d => setLogs(Array.isArray(d) ? d : [])).catch(() => setLogs([]));
  }, []);
  useEffect(() => { load(); }, [load]);

  const EVENTS = ['payment.succeeded', 'payment.failed', 'payment.created', 'subscription.created', 'subscription.cancelled', 'batch.completed', 'rebill.success', '*'];

  const save = () => {
    webhooksApi.create(form).then(() => { showToast('Webhook creado ✓', 'success'); setModal(false); load(); }).catch(e => showToast(e.message, 'error'));
  };

  return (
    <div className="content">
      <div className="section-tabs">
        {['endpoints', 'logs'].map(t => <button key={t} className={`section-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{t === 'endpoints' ? 'Endpoints' : 'Logs'}</button>)}
      </div>

      {tab === 'endpoints' && (
        <>
          <div style={{ marginBottom: 16 }}><button className="btn btn-primary" onClick={() => setModal(true)}>+ Nuevo webhook</button></div>
          <div className="card">
            {hooks.length === 0 ? <div className="empty">Sin webhooks configurados.</div> : (
              <div className="table-wrap"><table>
                <thead><tr><th>URL</th><th>Eventos</th><th>Estado</th><th>Acciones</th></tr></thead>
                <tbody>
                  {hooks.map(h => (
                    <tr key={h.id}>
                      <td style={{ fontSize: 12 }} className="mono">{h.url}</td>
                      <td>{(h.events || []).map(e => <span key={e} className="tag" style={{ marginRight: 4 }}>{e}</span>)}</td>
                      <td><StatusBadge status={h.active ? 'ACTIVE' : 'INACTIVE'} /></td>
                      <td style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => webhooksApi.update(h.id, { active: !h.active }).then(() => { showToast('Actualizado', 'info'); load(); })}>{h.active ? 'Pausar' : 'Activar'}</button>
                        <button className="btn btn-danger btn-sm" onClick={() => webhooksApi.delete(h.id).then(() => { showToast('Eliminado', 'info'); load(); })}>Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table></div>
            )}
          </div>
        </>
      )}

      {tab === 'logs' && (
        <div className="card">
          {logs.length === 0 ? <div className="empty">Sin logs todavía. Los webhooks aparecerán aquí.</div> : (
            <div className="table-wrap"><table>
              <thead><tr><th>Evento</th><th>Estado</th><th>Intento</th><th>Fecha</th></tr></thead>
              <tbody>
                {logs.slice(0, 50).map(l => (
                  <tr key={l.id}>
                    <td><span className="tag">{l.event}</span></td>
                    <td><StatusBadge status={l.status === 'delivered' ? 'SUCCEEDED' : 'FAILED'} /></td>
                    <td style={{ color: C.muted, fontSize: 12 }}>#{l.attempt}</td>
                    <td style={{ color: C.muted, fontSize: 12 }}>{l.createdAt ? new Date(l.createdAt).toLocaleString('es-ES') : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table></div>
          )}
        </div>
      )}

      {modal && (
        <Modal title="Nuevo webhook endpoint" onClose={() => setModal(false)}>
          <div className="form-group"><label className="form-label">URL destino</label><input className="form-input" placeholder="https://tu-app.com/webhooks/orkesta" value={form.url} onChange={e => setForm(p => ({ ...p, url: e.target.value }))} /></div>
          <div className="form-group">
            <label className="form-label">Eventos (selecciona los que quieres recibir)</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 6 }}>
              {EVENTS.map(ev => (
                <button key={ev} type="button"
                  className={`pill ${form.events.includes(ev) ? 'active' : ''}`}
                  style={{ border: `1px solid ${C.border}`, borderRadius: 6 }}
                  onClick={() => setForm(p => ({ ...p, events: p.events.includes(ev) ? p.events.filter(e => e !== ev) : [...p.events, ev] }))}>
                  {ev}
                </button>
              ))}
            </div>
          </div>
          <div className="modal-actions">
            <button className="btn btn-ghost" onClick={() => setModal(false)}>Cancelar</button>
            <button className="btn btn-primary" onClick={save}>Crear webhook</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function SimpleList({ apiObj, columns, createFields, title, showToast }) {
  const [items, setItems] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({});

  const load = useCallback(() => { apiObj.getAll().then(d => setItems(Array.isArray(d) ? d : [])).catch(() => setItems([])); }, [apiObj]);
  useEffect(() => { load(); }, [load]);

  const save = () => { apiObj.create(form).then(() => { showToast('Creado ✓', 'success'); setModal(false); load(); }).catch(e => showToast(e.message, 'error')); };
  const del = (id) => { apiObj.delete(id).then(() => { showToast('Eliminado', 'info'); load(); }).catch(e => showToast(e.message, 'error')); };

  return (
    <div className="content">
      <div style={{ marginBottom: 16 }}><button className="btn btn-primary" onClick={() => { setForm({}); setModal(true); }}>+ {title}</button></div>
      <div className="card">
        {items.length === 0 ? <div className="empty">Sin registros.</div> : (
          <div className="table-wrap"><table>
            <thead><tr>{columns.map(c => <th key={c.key}>{c.label}</th>)}<th>Acciones</th></tr></thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  {columns.map(c => (
                    <td key={c.key}>{c.render ? c.render(item[c.key], item) : <span style={{ fontSize: 13 }}>{item[c.key] || '—'}</span>}</td>
                  ))}
                  <td><button className="btn btn-danger btn-sm" onClick={() => del(item.id)}>Eliminar</button></td>
                </tr>
              ))}
            </tbody>
          </table></div>
        )}
      </div>
      {modal && (
        <Modal title={title} onClose={() => setModal(false)}>
          {createFields.map(f => (
            <div key={f.key} className="form-group">
              <label className="form-label">{f.label}</label>
              {f.type === 'select' ? (
                <select className="form-input" value={form[f.key] || ''} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}>{f.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
              ) : (
                <input className="form-input" type={f.type || 'text'} placeholder={f.placeholder} value={form[f.key] || ''} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
              )}
            </div>
          ))}
          <div className="modal-actions">
            <button className="btn btn-ghost" onClick={() => setModal(false)}>Cancelar</button>
            <button className="btn btn-primary" onClick={save}>Guardar</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [section, setSection] = useState('dashboard');
  const [toast, setToast] = useState(null);
  const showToast = useCallback((msg, type = 'success') => setToast({ msg, type }), []);

  const navItems = [
    { id: 'dashboard', icon: '◈', label: 'Dashboard' },
    { id: 'payments', icon: '◎', label: 'Pagos' },
    { id: 'subscriptions', icon: '↺', label: 'Suscripciones' },
    { id: 'batch', icon: '⊞', label: 'Batch Payment' },
    { id: 'gateways', icon: '⬡', label: 'Pasarelas' },
    { id: 'webhooks', icon: '⊕', label: 'Webhooks' },
    { id: 'shops', icon: '◫', label: 'Tiendas' },
    { id: 'pixels', icon: '◉', label: 'Pixels' },
    { id: 'templates', icon: '◻', label: 'Email Templates' },
  ];

  const titles = { dashboard: 'Dashboard', payments: 'Pagos', subscriptions: 'Suscripciones', batch: 'Batch Payment', gateways: 'Pasarelas de pago', webhooks: 'Webhooks', shops: 'Tiendas', pixels: 'Pixel Manager', templates: 'Email Templates' };

  return (
    <>
      <style>{css}</style>
      <div className="layout">
        <aside className="sidebar">
          <div className="logo-wrap">
            <div className="logo-row">
              <div className="logo-icon">O</div>
              <div><div className="logo-name">OrkestaPay</div><div className="logo-sub">Payment Orchestrator</div></div>
            </div>
          </div>
          <nav className="nav">
            <div className="nav-label">Menú principal</div>
            {navItems.map(item => (
              <button key={item.id} className={`nav-item ${section === item.id ? 'active' : ''}`} onClick={() => setSection(item.id)}>
                <span className="nav-icon">{item.icon}</span><span>{item.label}</span>
              </button>
            ))}
          </nav>
          <div className="user-row">
            <div className="avatar">A</div>
            <div><div style={{ fontSize: 12, fontWeight: 600 }}>Admin</div><div style={{ fontSize: 10, color: C.muted }}>orkestapay.local</div></div>
          </div>
        </aside>
        <main className="main">
          <div className="topbar">
            <div><div className="page-title">{titles[section]}</div><div className="breadcrumb">OrkestaPay · {titles[section]}</div></div>
          </div>
          {section === 'dashboard' && <Dashboard showToast={showToast} />}
          {section === 'payments' && <Payments showToast={showToast} />}
          {section === 'subscriptions' && <Subscriptions showToast={showToast} />}
          {section === 'batch' && <BatchPayment showToast={showToast} />}
          {section === 'gateways' && <Gateways showToast={showToast} />}
          {section === 'webhooks' && <Webhooks showToast={showToast} />}
          {section === 'shops' && <SimpleList showToast={showToast} apiObj={shopsApi} title="Nueva tienda" columns={[{ key: 'name', label: 'Nombre' }, { key: 'url', label: 'URL' }, { key: 'active', label: 'Estado', render: v => <StatusBadge status={v ? 'ACTIVE' : 'INACTIVE'} /> }]} createFields={[{ key: 'name', label: 'Nombre de la tienda', placeholder: 'Mi Tienda' }, { key: 'url', label: 'URL Shopify', placeholder: 'mitienda.myshopify.com' }]} />}
          {section === 'pixels' && <SimpleList showToast={showToast} apiObj={pixelsApi} title="Nuevo pixel" columns={[{ key: 'provider', label: 'Proveedor', render: v => <span className={`badge ${v === 'META' ? 'badge-info' : 'badge-warn'}`}>{v}</span> }, { key: 'pixelId', label: 'Pixel ID' }, { key: 'name', label: 'Nombre' }]} createFields={[{ key: 'provider', label: 'Proveedor', type: 'select', options: [{ value: 'META', label: 'Meta (Facebook)' }, { value: 'TIKTOK', label: 'TikTok' }, { value: 'PINTEREST', label: 'Pinterest' }] }, { key: 'pixelId', label: 'Pixel ID', placeholder: '1234567890' }, { key: 'name', label: 'Nombre', placeholder: 'Mi pixel principal' }]} />}
          {section === 'templates' && <SimpleList showToast={showToast} apiObj={templatesApi} title="Nueva plantilla" columns={[{ key: 'name', label: 'Nombre' }, { key: 'subject', label: 'Asunto' }, { key: 'active', label: 'Estado', render: v => <StatusBadge status={v ? 'ACTIVE' : 'INACTIVE'} /> }]} createFields={[{ key: 'name', label: 'Nombre interno', placeholder: 'Cart Recovery' }, { key: 'subject', label: 'Asunto del email', placeholder: '¡Tu carrito te espera!' }, { key: 'html', label: 'HTML del email', placeholder: '<h1>Hola {{name}}</h1>...' }]} />}
        </main>
      </div>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}
