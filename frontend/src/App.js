import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { gatewaysApi, paymentsApi, subscriptionsApi, batchApi, shopsApi, webhooksApi, pixelsApi, templatesApi } from './api';

const G = {
  black: '#06050A',
  card: '#0D0B14',
  cardHover: '#12101A',
  border: '#1E1A2E',
  borderGold: '#C9A84C40',
  gold: '#C9A84C',
  goldLight: '#E8C96A',
  goldBright: '#F5D98A',
  goldDim: '#C9A84C18',
  goldGlow: '#C9A84C30',
  white: '#F0EDE8',
  muted: '#6B6580',
  dim: '#9990B8',
  red: '#E84B4B',
  redDim: '#E84B4B18',
  green: '#4BE8A0',
  greenDim: '#4BE8A018',
  blue: '#4B9FE8',
  blueDim: '#4B9FE818',
};

const css = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=DM+Mono:wght@300;400;500&family=Outfit:wght@300;400;500;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --gold: ${G.gold};
  --gold-light: ${G.goldLight};
  --gold-bright: ${G.goldBright};
}

body {
  background: ${G.black};
  color: ${G.white};
  font-family: 'Outfit', sans-serif;
  overflow-x: hidden;
}

::-webkit-scrollbar { width: 3px; }
::-webkit-scrollbar-track { background: ${G.black}; }
::-webkit-scrollbar-thumb { background: ${G.borderGold}; border-radius: 2px; }

.mono { font-family: 'DM Mono', monospace; }
.serif { font-family: 'Cormorant Garamond', serif; }

/* ── NOISE TEXTURE OVERLAY ── */
body::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 9999;
  opacity: 0.4;
}

/* ── GOLD SHIMMER ANIMATION ── */
@keyframes shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}
@keyframes goldPulse {
  0%, 100% { opacity: 1; box-shadow: 0 0 20px ${G.goldGlow}; }
  50% { opacity: 0.8; box-shadow: 0 0 40px ${G.gold}50; }
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes slideIn {
  from { opacity: 0; transform: translateX(-12px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
@keyframes borderFlow {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
}

/* ── LAYOUT ── */
.layout { display: flex; height: 100vh; overflow: hidden; }

/* ── SIDEBAR ── */
.sidebar {
  width: 240px;
  min-width: 240px;
  background: ${G.card};
  border-right: 1px solid ${G.border};
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}
.sidebar::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, ${G.gold}, transparent);
  animation: borderFlow 3s ease-in-out infinite;
}
.sidebar-top {
  padding: 28px 20px 24px;
  border-bottom: 1px solid ${G.border};
}
.logo-wrap { display: flex; align-items: center; gap: 12px; }
.logo-icon {
  width: 38px; height: 38px;
  border-radius: 10px;
  background: linear-gradient(135deg, ${G.gold}, ${G.goldBright});
  display: flex; align-items: center; justify-content: center;
  font-family: 'Cormorant Garamond', serif;
  font-size: 20px; font-weight: 700; color: #000;
  box-shadow: 0 4px 20px ${G.goldGlow};
  animation: goldPulse 4s ease-in-out infinite;
}
.logo-name {
  font-family: 'Cormorant Garamond', serif;
  font-size: 18px; font-weight: 600;
  background: linear-gradient(135deg, ${G.goldLight}, ${G.goldBright});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 0.02em;
}
.logo-sub { font-size: 10px; color: ${G.muted}; letter-spacing: 0.15em; text-transform: uppercase; margin-top: 1px; }

.nav { padding: 16px 12px; flex: 1; overflow-y: auto; }
.nav-section-label {
  font-size: 9px; color: ${G.muted}; letter-spacing: 0.18em;
  text-transform: uppercase; padding: 0 10px; margin: 16px 0 8px;
  font-family: 'DM Mono', monospace;
}
.nav-item {
  display: flex; align-items: center; gap: 10px;
  padding: 9px 12px; border-radius: 10px;
  cursor: pointer; font-size: 13px; font-weight: 500;
  color: ${G.muted}; transition: all 0.2s;
  margin-bottom: 2px; border: none; background: none;
  width: 100%; text-align: left; font-family: 'Outfit', sans-serif;
  position: relative;
}
.nav-item:hover { background: ${G.cardHover}; color: ${G.dim}; }
.nav-item.active {
  background: ${G.goldDim};
  color: ${G.goldLight};
  border: 1px solid ${G.borderGold};
}
.nav-item.active::before {
  content: '';
  position: absolute;
  left: 0; top: 50%; transform: translateY(-50%);
  width: 3px; height: 60%;
  background: linear-gradient(180deg, ${G.gold}, ${G.goldBright});
  border-radius: 0 2px 2px 0;
}
.nav-icon { font-size: 15px; width: 20px; text-align: center; opacity: 0.8; }
.nav-badge {
  margin-left: auto;
  background: linear-gradient(135deg, ${G.gold}, ${G.goldBright});
  color: #000; font-size: 9px; font-weight: 700;
  padding: 2px 7px; border-radius: 20px;
  font-family: 'DM Mono', monospace;
}

.sidebar-user {
  padding: 16px 20px;
  border-top: 1px solid ${G.border};
  display: flex; align-items: center; gap: 10px;
}
.user-avatar {
  width: 32px; height: 32px; border-radius: 50%;
  background: linear-gradient(135deg, ${G.gold}, ${G.goldBright});
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 700; color: #000;
  font-family: 'Cormorant Garamond', serif;
  box-shadow: 0 2px 12px ${G.goldGlow};
  flex-shrink: 0;
}
.user-name { font-size: 12px; font-weight: 600; color: ${G.white}; }
.user-role { font-size: 10px; color: ${G.muted}; margin-top: 1px; }
.logout-btn {
  margin-left: auto; background: none; border: none;
  color: ${G.muted}; cursor: pointer; font-size: 16px;
  padding: 4px; border-radius: 6px; transition: all 0.2s;
  display: flex; align-items: center;
}
.logout-btn:hover { color: ${G.red}; background: ${G.redDim}; }

/* ── MAIN ── */
.main { flex: 1; overflow-y: auto; display: flex; flex-direction: column; background: ${G.black}; }

.topbar {
  padding: 18px 32px;
  border-bottom: 1px solid ${G.border};
  display: flex; align-items: center; justify-content: space-between;
  position: sticky; top: 0; background: ${G.black}; z-index: 10;
  backdrop-filter: blur(10px);
}
.page-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 24px; font-weight: 600;
  background: linear-gradient(135deg, ${G.white}, ${G.dim});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.breadcrumb { font-size: 11px; color: ${G.muted}; margin-top: 2px; letter-spacing: 0.05em; }
.topbar-right { display: flex; gap: 10px; align-items: center; }

/* ── BUTTONS ── */
.btn {
  padding: 8px 18px; border-radius: 8px;
  font-size: 12px; font-weight: 600; cursor: pointer;
  border: none; transition: all 0.2s;
  font-family: 'Outfit', sans-serif; letter-spacing: 0.03em;
}
.btn-gold {
  background: linear-gradient(135deg, ${G.gold}, ${G.goldBright});
  color: #000; box-shadow: 0 4px 16px ${G.goldGlow};
}
.btn-gold:hover { box-shadow: 0 6px 24px ${G.gold}50; transform: translateY(-1px); }
.btn-ghost {
  background: transparent; color: ${G.muted};
  border: 1px solid ${G.border};
}
.btn-ghost:hover { background: ${G.cardHover}; color: ${G.white}; border-color: ${G.borderGold}; }
.btn-danger {
  background: ${G.redDim}; color: ${G.red};
  border: 1px solid ${G.red}30;
}
.btn-danger:hover { background: ${G.red}25; }
.btn-sm { padding: 5px 12px; font-size: 11px; }

/* ── CONTENT ── */
.content { padding: 28px 32px; flex: 1; animation: fadeUp 0.3s ease; }

/* ── KPI CARDS ── */
.kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 28px; }
.kpi-card {
  background: ${G.card};
  border: 1px solid ${G.border};
  border-radius: 14px; padding: 22px;
  position: relative; overflow: hidden;
  transition: all 0.3s;
  cursor: default;
}
.kpi-card::before {
  content: '';
  position: absolute; top: 0; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent, ${G.gold}60, transparent);
  opacity: 0; transition: opacity 0.3s;
}
.kpi-card:hover { border-color: ${G.borderGold}; transform: translateY(-2px); }
.kpi-card:hover::before { opacity: 1; }
.kpi-label {
  font-size: 10px; color: ${G.muted}; text-transform: uppercase;
  letter-spacing: 0.15em; margin-bottom: 12px;
  font-family: 'DM Mono', monospace;
}
.kpi-value {
  font-size: 30px; font-weight: 300;
  font-family: 'Cormorant Garamond', serif;
  background: linear-gradient(135deg, ${G.white}, ${G.goldLight});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
}
.kpi-delta { font-size: 11px; margin-top: 8px; display: flex; align-items: center; gap: 4px; font-family: 'DM Mono', monospace; }
.delta-up { color: ${G.green}; }
.delta-down { color: ${G.red}; }
.kpi-icon {
  position: absolute; right: 18px; top: 18px;
  font-size: 28px; opacity: 0.06;
}

/* ── CARDS ── */
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 28px; }
.grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 28px; }

.card {
  background: ${G.card};
  border: 1px solid ${G.border};
  border-radius: 14px; overflow: hidden;
}
.card-head {
  padding: 16px 22px;
  border-bottom: 1px solid ${G.border};
  display: flex; align-items: center; justify-content: space-between;
}
.card-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 16px; font-weight: 600; color: ${G.white};
  letter-spacing: 0.02em;
}
.card-body { padding: 22px; }

/* ── TABLES ── */
.table-wrap { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; font-size: 13px; }
th {
  padding: 10px 18px; text-align: left;
  font-size: 9px; font-weight: 500; color: ${G.muted};
  text-transform: uppercase; letter-spacing: 0.15em;
  border-bottom: 1px solid ${G.border};
  font-family: 'DM Mono', monospace;
}
td { padding: 13px 18px; border-bottom: 1px solid ${G.border}30; vertical-align: middle; }
tr:last-child td { border-bottom: none; }
tr:hover td { background: ${G.cardHover}; }

/* ── BADGES ── */
.badge {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 3px 10px; border-radius: 20px;
  font-size: 10px; font-weight: 600;
  font-family: 'DM Mono', monospace; letter-spacing: 0.05em;
}
.badge-gold { background: ${G.goldDim}; color: ${G.goldLight}; border: 1px solid ${G.borderGold}; }
.badge-green { background: ${G.greenDim}; color: ${G.green}; }
.badge-red { background: ${G.redDim}; color: ${G.red}; }
.badge-blue { background: ${G.blueDim}; color: ${G.blue}; }
.badge-gray { background: ${G.border}; color: ${G.muted}; }
.tag {
  display: inline-flex; align-items: center;
  padding: 2px 8px; border-radius: 5px;
  font-size: 10px; font-family: 'DM Mono', monospace;
  background: ${G.border}; color: ${G.dim};
}

/* ── PROGRESS ── */
.progress { height: 4px; background: ${G.border}; border-radius: 2px; overflow: hidden; }
.progress-fill {
  height: 100%; border-radius: 2px;
  background: linear-gradient(90deg, ${G.gold}, ${G.goldBright});
  transition: width 0.6s ease;
}

/* ── MINI CHART ── */
.mini-bars { display: flex; align-items: flex-end; gap: 3px; height: 52px; }
.mini-bar {
  flex: 1; border-radius: 3px 3px 0 0;
  background: ${G.gold}30;
  transition: all 0.4s ease; min-width: 4px;
}
.mini-bar:last-child { background: linear-gradient(180deg, ${G.goldBright}, ${G.gold}); }
.mini-bar:hover { background: ${G.gold}80; }

/* ── FORMS ── */
.form-group { margin-bottom: 16px; }
.form-label {
  font-size: 10px; color: ${G.muted}; margin-bottom: 7px;
  display: block; font-weight: 500;
  text-transform: uppercase; letter-spacing: 0.12em;
  font-family: 'DM Mono', monospace;
}
.form-input {
  width: 100%;
  background: ${G.black};
  border: 1px solid ${G.border};
  border-radius: 8px; padding: 10px 14px;
  font-size: 13px; color: ${G.white};
  font-family: 'Outfit', sans-serif; outline: none;
  transition: all 0.2s;
}
.form-input:focus { border-color: ${G.gold}60; box-shadow: 0 0 0 3px ${G.goldDim}; }
.form-input::placeholder { color: ${G.muted}; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

/* ── SEARCH & FILTERS ── */
.filters { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; margin-bottom: 20px; }
.search {
  background: ${G.card}; border: 1px solid ${G.border};
  border-radius: 8px; padding: 9px 14px;
  font-size: 13px; color: ${G.white};
  font-family: 'Outfit', sans-serif; outline: none; width: 260px;
  transition: all 0.2s;
}
.search:focus { border-color: ${G.gold}60; }
.search::placeholder { color: ${G.muted}; }
.pill-group {
  display: flex; background: ${G.card};
  border: 1px solid ${G.border}; border-radius: 8px; overflow: hidden;
}
.pill {
  padding: 7px 14px; font-size: 11px; font-weight: 600;
  cursor: pointer; border: none; background: none;
  color: ${G.muted}; font-family: 'Outfit', sans-serif;
  transition: all 0.15s; letter-spacing: 0.03em;
}
.pill.active { background: ${G.goldDim}; color: ${G.goldLight}; }

/* ── MODAL ── */
.modal-bg {
  position: fixed; inset: 0; background: #00000090;
  display: flex; align-items: center; justify-content: center;
  z-index: 100; backdrop-filter: blur(6px);
}
.modal {
  background: ${G.card};
  border: 1px solid ${G.borderGold};
  border-radius: 16px; padding: 32px;
  width: 500px; max-width: 95vw;
  animation: fadeUp 0.25s ease;
  box-shadow: 0 24px 80px #00000080, 0 0 0 1px ${G.gold}20;
}
.modal-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 20px; font-weight: 600; margin-bottom: 24px;
  background: linear-gradient(135deg, ${G.white}, ${G.goldLight});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 24px; }

/* ── TOAST ── */
.toast {
  position: fixed; bottom: 28px; right: 28px;
  background: ${G.card};
  border: 1px solid ${G.borderGold};
  border-radius: 12px; padding: 14px 20px;
  font-size: 13px; z-index: 200;
  display: flex; align-items: center; gap: 10px;
  animation: fadeUp 0.3s ease;
  box-shadow: 0 12px 40px #00000060, 0 0 0 1px ${G.gold}15;
}
.toast-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }

/* ── SECTION TABS ── */
.section-tabs {
  display: flex; gap: 2px;
  background: ${G.card}; border: 1px solid ${G.border};
  border-radius: 10px; padding: 4px; margin-bottom: 22px;
  width: fit-content;
}
.section-tab {
  padding: 7px 18px; border-radius: 7px;
  font-size: 12px; font-weight: 500; cursor: pointer;
  border: none; background: none; color: ${G.muted};
  font-family: 'Outfit', sans-serif; transition: all 0.15s;
  letter-spacing: 0.03em;
}
.section-tab.active { background: ${G.goldDim}; color: ${G.goldLight}; }

/* ── EMPTY STATE ── */
.empty {
  text-align: center; padding: 48px 20px;
  color: ${G.muted}; font-size: 13px; line-height: 1.8;
}
.empty-icon { font-size: 36px; margin-bottom: 12px; opacity: 0.4; }

/* ── STAT LINE ── */
.stat-line {
  display: flex; justify-content: space-between; align-items: center;
  padding: 11px 0; border-bottom: 1px solid ${G.border}20;
}
.stat-line:last-child { border-bottom: none; }

/* ── DOT PULSE ── */
.dot { width: 7px; height: 7px; border-radius: 50%; display: inline-block; flex-shrink: 0; }
.pulse { animation: pulse 2s ease-in-out infinite; }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }

/* ── GATEWAY ROW ── */
.gateway-psp-icon {
  width: 36px; height: 36px; border-radius: 8px;
  background: ${G.goldDim}; border: 1px solid ${G.borderGold};
  display: flex; align-items: center; justify-content: center;
  font-size: 14px; font-weight: 700; color: ${G.goldLight};
  font-family: 'Cormorant Garamond', serif;
}

/* ── CONNECT BANNER ── */
.connect-banner {
  background: linear-gradient(135deg, ${G.goldDim}, ${G.border}80);
  border: 1px solid ${G.borderGold};
  border-radius: 14px; padding: 22px 28px;
  margin-bottom: 24px;
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
}

@media (max-width: 900px) {
  .kpi-grid { grid-template-columns: repeat(2, 1fr); }
  .grid-2 { grid-template-columns: 1fr; }
  .grid-3 { grid-template-columns: 1fr; }
}
`;

// ── LOGIN SCREEN ────────────────────────────────────────────────────────────

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!email || !password) { setError('Completa todos los campos'); return; }
    setLoading(true); setError('');
    try {
      const { data } = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      onLogin(data.user);
    } catch (e) {
      setError(e.response?.data?.error || 'Error de conexión con el servidor');
    }
    setLoading(false);
  };

  const loginCss = `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600&family=DM+Mono:wght@400&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: ${G.black}; }
    @keyframes floatUp { 0% { transform: translateY(0) scale(1); opacity: 0.3; } 100% { transform: translateY(-100vh) scale(0.5); opacity: 0; } }
    @keyframes shimmerText {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }
    @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes goldPulse { 0%, 100% { box-shadow: 0 0 30px ${G.gold}40; } 50% { box-shadow: 0 0 60px ${G.gold}60; } }
    .particle {
      position: absolute; border-radius: 50%;
      background: ${G.gold}; animation: floatUp linear infinite;
    }
  `;

  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    size: `${Math.random() * 4 + 2}px`,
    duration: `${Math.random() * 10 + 8}s`,
    delay: `${Math.random() * 10}s`,
    opacity: Math.random() * 0.4 + 0.1,
  }));

  return (
    <div style={{
      minHeight: '100vh', background: G.black,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Outfit, sans-serif', position: 'relative', overflow: 'hidden'
    }}>
      <style>{loginCss}</style>

      {/* Particles */}
      {particles.map(p => (
        <div key={p.id} className="particle" style={{
          left: p.left, width: p.size, height: p.size,
          animationDuration: p.duration, animationDelay: p.delay,
          opacity: p.opacity, bottom: '-10px',
        }} />
      ))}

      {/* Background glow */}
      <div style={{
        position: 'absolute', top: '30%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600, height: 600,
        background: `radial-gradient(circle, ${G.gold}08 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      {/* Card */}
      <div style={{
        background: G.card,
        border: `1px solid ${G.borderGold}`,
        borderRadius: 20, padding: '48px 44px',
        width: 420, maxWidth: '95vw',
        animation: 'fadeUp 0.5s ease',
        boxShadow: `0 32px 100px #00000080, 0 0 0 1px ${G.gold}10`,
        position: 'relative', zIndex: 1,
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14,
            background: `linear-gradient(135deg, ${G.gold}, ${G.goldBright})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 28, fontWeight: 700, color: '#000',
            animation: 'goldPulse 3s ease-in-out infinite',
          }}>N</div>
          <div style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 26, fontWeight: 600,
            background: `linear-gradient(135deg, ${G.goldLight}, ${G.goldBright}, ${G.gold})`,
            backgroundSize: '200% 200%',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: 'shimmerText 3s ease infinite',
            letterSpacing: '0.02em',
          }}>NoLimitsPay</div>
          <div style={{ fontSize: 11, color: G.muted, marginTop: 4, letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'DM Mono, monospace' }}>
            Payment Orchestrator
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${G.gold}40, transparent)`, marginBottom: 32 }} />

        {/* Fields */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 10, color: G.muted, display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.15em', fontFamily: 'DM Mono, monospace' }}>Email</label>
          <input
            type="email" value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submit()}
            style={{
              width: '100%', background: G.black,
              border: `1px solid ${G.border}`, borderRadius: 10,
              padding: '12px 16px', fontSize: 13, color: G.white,
              fontFamily: 'Outfit, sans-serif', outline: 'none',
              transition: 'all 0.2s',
            }}
            onFocus={e => e.target.style.borderColor = `${G.gold}60`}
            onBlur={e => e.target.style.borderColor = G.border}
            placeholder="admin@nolimitspay.com"
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 10, color: G.muted, display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.15em', fontFamily: 'DM Mono, monospace' }}>Contraseña</label>
          <input
            type="password" value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submit()}
            style={{
              width: '100%', background: G.black,
              border: `1px solid ${G.border}`, borderRadius: 10,
              padding: '12px 16px', fontSize: 13, color: G.white,
              fontFamily: 'Outfit, sans-serif', outline: 'none',
              transition: 'all 0.2s',
            }}
            onFocus={e => e.target.style.borderColor = `${G.gold}60`}
            onBlur={e => e.target.style.borderColor = G.border}
            placeholder="••••••••••"
          />
        </div>

        {error && (
          <div style={{
            color: G.red, fontSize: 12, marginBottom: 16,
            textAlign: 'center', padding: '8px 12px',
            background: G.redDim, borderRadius: 8,
            border: `1px solid ${G.red}30`,
            fontFamily: 'DM Mono, monospace',
          }}>{error}</div>
        )}

        <button
          onClick={submit} disabled={loading}
          style={{
            width: '100%',
            background: loading ? G.border : `linear-gradient(135deg, ${G.gold}, ${G.goldBright})`,
            color: loading ? G.muted : '#000',
            border: 'none', borderRadius: 10,
            padding: '13px', fontSize: 13, fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: 'Outfit, sans-serif',
            letterSpacing: '0.05em',
            boxShadow: loading ? 'none' : `0 6px 24px ${G.gold}40`,
            transition: 'all 0.2s',
          }}
        >
          {loading ? 'Verificando...' : 'Acceder al Dashboard'}
        </button>

        <div style={{ marginTop: 20, textAlign: 'center', fontSize: 10, color: G.muted, fontFamily: 'DM Mono, monospace', letterSpacing: '0.1em' }}>
          ACCESO RESTRINGIDO · SOLO PERSONAL AUTORIZADO
        </div>
      </div>
    </div>
  );
}

// ── COMPONENTS ───────────────────────────────────────────────────────────────

function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  const colors = { success: G.green, error: G.red, info: G.blue, warning: G.gold };
  return (
    <div className="toast">
      <div className="toast-dot" style={{ background: colors[type] || G.gold }} />
      <span style={{ fontSize: 13 }}>{msg}</span>
    </div>
  );
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
    SUCCEEDED: ['badge-green', '● Pagado'],
    ACTIVE: ['badge-gold', '● Activo'],
    FAILED: ['badge-red', '● Error'],
    CANCELLED: ['badge-red', '● Cancelado'],
    PROCESSING: ['badge-blue', '● Procesando'],
    PAUSED: ['badge-gray', '⏸ Pausado'],
    CREATED: ['badge-gray', '● Creado'],
    INACTIVE: ['badge-gray', '○ Inactivo'],
  };
  const [cls, label] = map[status] || ['badge-gray', status];
  return <span className={`badge ${cls}`}>{label}</span>;
}

function MiniChart({ data }) {
  const max = Math.max(...data, 1);
  return (
    <div className="mini-bars">
      {data.map((v, i) => (
        <div key={i} className="mini-bar" style={{ height: `${(v / max) * 100}%` }} />
      ))}
    </div>
  );
}

// ── PAGES ────────────────────────────────────────────────────────────────────

function Dashboard({ showToast }) {
  const [kpis, setKpis] = useState(null);
  const bars = [5, 12, 8, 19, 14, 24, 10, 21, 17, 28, 22, 34, 29, 38, 31, 26, 42, 35, 48, 41, 38, 52, 47, 58, 54, 63, 57, 68, 62, 74];

  useEffect(() => {
    paymentsApi.getKpis()
      .then(setKpis)
      .catch(() => setKpis({ totalRevenue: '0', todayRevenue: '0', todaySales: 0, activeSubscriptions: 0, conversionRate: '0', totalPayments: 0, succeededPayments: 0 }));
  }, []);

  if (!kpis) return (
    <div className="content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
      <div style={{ textAlign: 'center', color: G.muted }}>
        <div style={{ fontSize: 24, marginBottom: 8, animation: 'spin 1.5s linear infinite', display: 'inline-block' }}>◌</div>
        <div style={{ fontSize: 12, fontFamily: 'DM Mono, monospace', letterSpacing: '0.1em' }}>CARGANDO DATOS...</div>
      </div>
    </div>
  );

  return (
    <div className="content">
      <div className="kpi-grid">
        {[
          { label: 'Revenue hoy', value: `€${parseFloat(kpis.todayRevenue || 0).toFixed(2)}`, delta: '↑ acumulado hoy', up: true, icon: '◈' },
          { label: 'Ventas completadas', value: kpis.todaySales || 0, delta: 'pagos exitosos', up: true, icon: '◎' },
          { label: 'Suscripciones', value: kpis.activeSubscriptions || 0, delta: 'activas ahora mismo', up: true, icon: '↺' },
          { label: 'Conv. Rate', value: `${kpis.conversionRate || 0}%`, delta: 'intentos convertidos', up: true, icon: '◉' },
        ].map((k, i) => (
          <div key={i} className="kpi-card">
            <div className="kpi-icon">{k.icon}</div>
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value mono">{k.value}</div>
            <div className={`kpi-delta ${k.up ? 'delta-up' : 'delta-down'}`}>{k.delta}</div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-head">
            <span className="card-title">Actividad de pagos</span>
            <span style={{ fontSize: 11, color: G.gold, fontFamily: 'DM Mono, monospace' }}>Últimos 30 días</span>
          </div>
          <div className="card-body">
            <MiniChart data={bars} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: 10, color: G.muted, fontFamily: 'DM Mono, monospace', letterSpacing: '0.08em' }}>
              <span>Hace 30d</span><span>Hoy</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-head"><span className="card-title">Resumen global</span></div>
          <div className="card-body">
            {[
              { k: 'Revenue total acumulado', v: `€${parseFloat(kpis.totalRevenue || 0).toFixed(2)}` },
              { k: 'Total transacciones', v: kpis.totalPayments || 0 },
              { k: 'Transacciones exitosas', v: kpis.succeededPayments || 0 },
              { k: 'Suscripciones activas', v: kpis.activeSubscriptions || 0 },
            ].map((s, i) => (
              <div key={i} className="stat-line">
                <span style={{ fontSize: 12, color: G.muted }}>{s.k}</span>
                <span className="mono" style={{ fontWeight: 500, color: G.white }}>{s.v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="connect-banner">
        <div>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 17, fontWeight: 600, marginBottom: 5, color: G.goldLight }}>
            ⚡ Conecta tus pasarelas para activar el sistema
          </div>
          <div style={{ fontSize: 12, color: G.muted }}>
            Ve a Pasarelas → Nueva pasarela → introduce tus credenciales de Stripe, Square o TailoredPayments
          </div>
        </div>
        <button className="btn btn-gold" style={{ whiteSpace: 'nowrap' }}>Configurar ahora →</button>
      </div>
    </div>
  );
}

function Payments({ showToast }) {
  const [payments, setPayments] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    paymentsApi.getAll()
      .then(d => { setPayments(d.payments || []); setLoading(false); })
      .catch(() => setLoading(false));
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
        <input className="search" placeholder="🔍 Buscar por email o ID..." value={search} onChange={e => setSearch(e.target.value)} />
        <div className="pill-group">
          {['ALL', 'SUCCEEDED', 'CREATED', 'FAILED', 'PROCESSING'].map(s => (
            <button key={s} className={`pill ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>
              {s === 'ALL' ? 'Todos' : s === 'SUCCEEDED' ? 'Pagados' : s === 'CREATED' ? 'Creados' : s === 'FAILED' ? 'Fallidos' : 'Procesando'}
            </button>
          ))}
        </div>
        <button className="btn btn-ghost btn-sm" onClick={() => showToast('Exportando a Excel...', 'info')}>↓ Exportar</button>
      </div>

      <div className="card">
        {loading ? <div className="empty"><div className="empty-icon">◌</div>Cargando transacciones...</div> : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Estado</th><th>Importe</th><th>Gateway</th><th>PSP</th>
                  <th>Email cliente</th><th>Fecha</th><th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr><td colSpan={7}>
                    <div className="empty">
                      <div className="empty-icon">◎</div>
                      Sin transacciones. Conecta una pasarela para empezar.
                    </div>
                  </td></tr>
                )}
                {filtered.map(p => (
                  <tr key={p.id}>
                    <td><StatusBadge status={p.status} /></td>
                    <td>
                      <span className="mono" style={{ fontWeight: 600, color: G.goldLight, fontSize: 14 }}>
                        €{parseFloat(p.amount || 0).toFixed(2)}
                      </span>
                    </td>
                    <td><span className="tag">{p.gateway || '—'}</span></td>
                    <td>
                      <span className={`badge ${p.psp === 'STRIPE' ? 'badge-blue' : p.psp === 'SQUARE' ? 'badge-gold' : 'badge-gray'}`}>
                        {p.psp || '—'}
                      </span>
                    </td>
                    <td style={{ color: G.dim, fontSize: 12 }}>{p.email || '—'}</td>
                    <td style={{ color: G.muted, fontSize: 11, fontFamily: 'DM Mono, monospace' }}>
                      {p.createdAt ? new Date(p.createdAt).toLocaleString('es-ES') : '—'}
                    </td>
                    <td>
                      {p.status === 'SUCCEEDED' && (
                        <button className="btn btn-danger btn-sm" onClick={() => {
                          paymentsApi.refund(p.id)
                            .then(() => { showToast('Reembolso procesado ✓', 'success'); load(); })
                            .catch(e => showToast(e.message, 'error'));
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
      <div style={{ marginTop: 10, color: G.muted, fontSize: 11, fontFamily: 'DM Mono, monospace' }}>
        {filtered.length} de {payments.length} transacciones
      </div>
    </div>
  );
}

function Gateways({ showToast }) {
  const [gateways, setGateways] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name: '', psp: 'STRIPE', trafficPct: 0, active: true });
  const [creds, setCreds] = useState({ secretKey: '', webhookSecret: '', locationId: '', environment: 'production', merchantId: '', baseUrl: '' });

  useEffect(() => {
    gatewaysApi.getAll().then(setGateways).catch(() => setGateways([]));
  }, []);

  const pspFields = {
    STRIPE: [
      { key: 'secretKey', label: 'Secret Key', placeholder: 'sk_live_...' },
      { key: 'webhookSecret', label: 'Webhook Secret', placeholder: 'whsec_...' },
    ],
    SQUARE: [
      { key: 'secretKey', label: 'Access Token', placeholder: 'EAAAxxxxx...' },
      { key: 'locationId', label: 'Location ID', placeholder: 'LXXXXXXXXX' },
      { key: 'environment', label: 'Entorno', placeholder: 'production' },
    ],
    TAILORED: [
      { key: 'secretKey', label: 'API Key', placeholder: 'tp_live_...' },
      { key: 'merchantId', label: 'Merchant ID', placeholder: 'MERCHANT_xxx' },
      { key: 'baseUrl', label: 'Base URL', placeholder: 'https://api.tailoredpayments.com/v1' },
    ],
  };

  const getCredentials = () => {
    if (form.psp === 'STRIPE') return { secretKey: creds.secretKey, webhookSecret: creds.webhookSecret };
    if (form.psp === 'SQUARE') return { accessToken: creds.secretKey, locationId: creds.locationId, environment: creds.environment };
    return { apiKey: creds.secretKey, merchantId: creds.merchantId, baseUrl: creds.baseUrl };
  };

  const save = () => {
    gatewaysApi.create({ ...form, credentials: getCredentials() })
      .then(g => { setGateways(prev => [...prev, g]); setModal(false); showToast('Pasarela añadida ✓', 'success'); })
      .catch(e => showToast(e.message, 'error'));
  };

  const toggle = (gw) => {
    gatewaysApi.update(gw.id, { active: !gw.active })
      .then(u => { setGateways(prev => prev.map(g => g.id === gw.id ? u : g)); showToast(`Pasarela ${u.active ? 'activada' : 'pausada'}`, 'success'); });
  };

  const remove = (id) => {
    if (!window.confirm('¿Eliminar esta pasarela?')) return;
    gatewaysApi.delete(id).then(() => { setGateways(prev => prev.filter(g => g.id !== id)); showToast('Eliminada', 'info'); });
  };

  return (
    <div className="content">
      <div style={{ marginBottom: 20 }}>
        <button className="btn btn-gold" onClick={() => setModal(true)}>+ Nueva pasarela</button>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Nombre</th><th>PSP</th><th>Tráfico %</th><th>Estado</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {gateways.length === 0 && (
                <tr><td colSpan={5}>
                  <div className="empty">
                    <div className="empty-icon">⬡</div>
                    Sin pasarelas configuradas. Añade tu primera pasarela.
                  </div>
                </td></tr>
              )}
              {gateways.map(g => (
                <tr key={g.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div className="gateway-psp-icon">{g.psp?.[0] || '?'}</div>
                      <span style={{ fontWeight: 600, fontSize: 13 }}>{g.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${g.psp === 'STRIPE' ? 'badge-blue' : g.psp === 'SQUARE' ? 'badge-gold' : 'badge-green'}`}>
                      {g.psp}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div className="progress" style={{ width: 100 }}>
                        <div className="progress-fill" style={{ width: `${g.trafficPct || 0}%` }} />
                      </div>
                      <span className="mono" style={{ fontSize: 13, color: G.goldLight, minWidth: 36 }}>{g.trafficPct || 0}%</span>
                    </div>
                  </td>
                  <td><StatusBadge status={g.active ? 'ACTIVE' : 'INACTIVE'} /></td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => toggle(g)}>{g.active ? 'Pausar' : 'Activar'}</button>
                      <button className="btn btn-danger btn-sm" onClick={() => remove(g.id)}>Eliminar</button>
                    </div>
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
            <label className="form-label">Nombre identificador</label>
            <input className="form-input" placeholder="ej: Stripe — cuenta principal" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Proveedor (PSP)</label>
              <select className="form-input" value={form.psp} onChange={e => setForm(p => ({ ...p, psp: e.target.value }))}>
                <option value="STRIPE">Stripe</option>
                <option value="SQUARE">Square</option>
                <option value="TAILORED">TailoredPayments</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">% de tráfico</label>
              <input type="number" className="form-input" min={0} max={100} value={form.trafficPct} onChange={e => setForm(p => ({ ...p, trafficPct: +e.target.value }))} />
            </div>
          </div>
          {pspFields[form.psp]?.map(f => (
            <div key={f.key} className="form-group">
              <label className="form-label">{f.label}</label>
              <input
                type={f.key.includes('Key') || f.key.includes('Token') || f.key.includes('Secret') ? 'password' : 'text'}
                className="form-input" placeholder={f.placeholder}
                value={creds[f.key] || ''}
                onChange={e => setCreds(p => ({ ...p, [f.key]: e.target.value }))}
              />
            </div>
          ))}
          <div className="modal-actions">
            <button className="btn btn-ghost" onClick={() => setModal(false)}>Cancelar</button>
            <button className="btn btn-gold" onClick={save}>Guardar pasarela</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Subscriptions({ showToast }) {
  const [subs, setSubs] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ customerId: '', amount: '', currency: 'EUR', interval: 'month', intervalCount: 1, trialDays: 0 });
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    subscriptionsApi.getAll()
      .then(d => { setSubs(d.subscriptions || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);

  const create = () => {
    subscriptionsApi.create(form)
      .then(() => { showToast('Suscripción creada ✓', 'success'); setModal(false); load(); })
      .catch(e => showToast(e.message, 'error'));
  };

  return (
    <div className="content">
      <div style={{ marginBottom: 20 }}>
        <button className="btn btn-gold" onClick={() => setModal(true)}>+ Nueva suscripción</button>
      </div>
      <div className="card">
        {loading ? <div className="empty"><div className="empty-icon">◌</div>Cargando...</div> : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Estado</th><th>Cliente</th><th>Importe</th><th>Intervalo</th><th>Gateway</th><th>Próximo cobro</th><th>Acciones</th></tr></thead>
              <tbody>
                {subs.length === 0 && <tr><td colSpan={7}><div className="empty"><div className="empty-icon">↺</div>Sin suscripciones activas.</div></td></tr>}
                {subs.map(s => (
                  <tr key={s.id}>
                    <td><StatusBadge status={s.status} /></td>
                    <td style={{ fontSize: 12, color: G.dim, fontFamily: 'DM Mono, monospace' }}>{s.customerId || '—'}</td>
                    <td><span className="mono" style={{ fontWeight: 600, color: G.goldLight }}>€{parseFloat(s.amount || 0).toFixed(2)}</span></td>
                    <td><span className="tag">cada {s.intervalCount} {s.interval}</span></td>
                    <td><span className="tag">{s.gateway || '—'}</span></td>
                    <td style={{ fontSize: 11, color: G.muted, fontFamily: 'DM Mono, monospace' }}>{s.nextBillingDate ? new Date(s.nextBillingDate).toLocaleDateString('es-ES') : '—'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {s.status === 'ACTIVE' && <button className="btn btn-ghost btn-sm" onClick={() => subscriptionsApi.pause(s.id).then(() => { showToast('Pausada', 'info'); load(); })}>Pausar</button>}
                        {s.status === 'PAUSED' && <button className="btn btn-ghost btn-sm" onClick={() => subscriptionsApi.resume(s.id).then(() => { showToast('Reanudada', 'success'); load(); })}>Reanudar</button>}
                        <button className="btn btn-danger btn-sm" onClick={() => { if (window.confirm('¿Cancelar?')) subscriptionsApi.cancel(s.id).then(() => { showToast('Cancelada', 'info'); load(); }); }}>Cancelar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {modal && (
        <Modal title="Nueva suscripción recurrente" onClose={() => setModal(false)}>
          <div className="form-group"><label className="form-label">Customer ID</label><input className="form-input" placeholder="cus_xxx" value={form.customerId} onChange={e => setForm(p => ({ ...p, customerId: e.target.value }))} /></div>
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
            <button className="btn btn-gold" onClick={create}>Crear suscripción</button>
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
    const eligible = customers.filter(c => c.hasMethod);
    if (!window.confirm(`¿Cobrar €${form.amount} a ${eligible.length} clientes?`)) return;
    setLoading(true);
    batchApi.charge({ customerIds: eligible.map(c => c.id), amount: +form.amount, currency: form.currency, description: form.description })
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
        <div className="card" style={{ maxWidth: 540 }}>
          <div className="card-head"><span className="card-title">Configuración del batch</span></div>
          <div className="card-body">
            <div className="form-group"><label className="form-label">Proveedor</label>
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
            <div className="form-group"><label className="form-label">Descripción</label><input className="form-input" placeholder="Cobro mensual plan Pro" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} /></div>
            <button className="btn btn-gold" onClick={fetchCustomers} disabled={loading}>{loading ? 'Cargando clientes...' : 'Ver clientes →'}</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="card">
          <div className="card-head">
            <span className="card-title">Clientes encontrados: {customers.length}</span>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: G.gold, fontFamily: 'DM Mono, monospace' }}>{customers.filter(c => c.hasMethod).length} con método de pago</span>
              <button className="btn btn-ghost btn-sm" onClick={() => setStep(1)}>← Atrás</button>
              <button className="btn btn-gold btn-sm" onClick={charge} disabled={loading || !customers.filter(c => c.hasMethod).length}>{loading ? 'Procesando...' : `Cobrar €${form.amount}`}</button>
            </div>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>#</th><th>Email</th><th>Nombre</th><th>Método de pago</th></tr></thead>
              <tbody>
                {customers.map((c, i) => (
                  <tr key={c.id}>
                    <td style={{ color: G.muted, fontSize: 11, fontFamily: 'DM Mono, monospace' }}>{i + 1}</td>
                    <td style={{ fontSize: 12 }}>{c.email}</td>
                    <td style={{ fontSize: 12, color: G.dim }}>{c.name || '—'}</td>
                    <td><span className={`badge ${c.hasMethod ? 'badge-green' : 'badge-red'}`}>{c.hasMethod ? `✓ ${c.methodCount} tarjeta(s)` : '✗ Sin método'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {step === 3 && results && (
        <div>
          <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', maxWidth: 600 }}>
            <div className="kpi-card"><div className="kpi-label">Total procesados</div><div className="kpi-value">{results.total}</div></div>
            <div className="kpi-card"><div className="kpi-label">Exitosos</div><div className="kpi-value" style={{ color: G.green }}>{results.success}</div></div>
            <div className="kpi-card"><div className="kpi-label">Fallidos</div><div className="kpi-value" style={{ color: G.red }}>{results.failed}</div></div>
          </div>
          <div className="card">
            <div className="table-wrap">
              <table>
                <thead><tr><th>Cliente ID</th><th>Estado</th><th>Detalle</th></tr></thead>
                <tbody>
                  {results.results?.map((r, i) => (
                    <tr key={i}>
                      <td style={{ fontSize: 11, fontFamily: 'DM Mono, monospace' }}>{r.customerId}</td>
                      <td><StatusBadge status={r.status === 'success' ? 'SUCCEEDED' : 'FAILED'} /></td>
                      <td style={{ fontSize: 11, color: G.muted, fontFamily: 'DM Mono, monospace' }}>{r.paymentId || r.error || '—'}</td>
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

function SimpleList({ apiObj, columns, createFields, title, showToast }) {
  const [items, setItems] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({});

  const load = useCallback(() => {
    apiObj.getAll().then(d => setItems(Array.isArray(d) ? d : [])).catch(() => setItems([]));
  }, [apiObj]);
  useEffect(() => { load(); }, [load]);

  const save = () => {
    apiObj.create(form)
      .then(() => { showToast('Creado ✓', 'success'); setModal(false); load(); })
      .catch(e => showToast(e.message, 'error'));
  };

  const del = (id) => {
    if (!window.confirm('¿Eliminar?')) return;
    apiObj.delete(id).then(() => { showToast('Eliminado', 'info'); load(); }).catch(e => showToast(e.message, 'error'));
  };

  return (
    <div className="content">
      <div style={{ marginBottom: 20 }}>
        <button className="btn btn-gold" onClick={() => { setForm({}); setModal(true); }}>+ {title}</button>
      </div>
      <div className="card">
        {items.length === 0 ? <div className="empty"><div className="empty-icon">◻</div>Sin registros. Añade el primero.</div> : (
          <div className="table-wrap">
            <table>
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
            </table>
          </div>
        )}
      </div>
      {modal && (
        <Modal title={title} onClose={() => setModal(false)}>
          {createFields.map(f => (
            <div key={f.key} className="form-group">
              <label className="form-label">{f.label}</label>
              {f.type === 'select' ? (
                <select className="form-input" value={form[f.key] || ''} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}>
                  {f.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              ) : (
                <input className="form-input" type={f.type || 'text'} placeholder={f.placeholder} value={form[f.key] || ''} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
              )}
            </div>
          ))}
          <div className="modal-actions">
            <button className="btn btn-ghost" onClick={() => setModal(false)}>Cancelar</button>
            <button className="btn btn-gold" onClick={save}>Guardar</button>
          </div>
        </Modal>
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

  const EVENTS = ['payment.succeeded', 'payment.failed', 'payment.created', 'subscription.created', 'subscription.cancelled', 'batch.completed', '*'];

  const load = useCallback(() => {
    webhooksApi.getAll().then(d => setHooks(Array.isArray(d) ? d : [])).catch(() => setHooks([]));
    webhooksApi.getLogs().then(d => setLogs(Array.isArray(d) ? d : [])).catch(() => setLogs([]));
  }, []);
  useEffect(() => { load(); }, [load]);

  const save = () => {
    webhooksApi.create(form).then(() => { showToast('Webhook creado ✓', 'success'); setModal(false); load(); }).catch(e => showToast(e.message, 'error'));
  };

  return (
    <div className="content">
      <div className="section-tabs">
        {['endpoints', 'logs'].map(t => <button key={t} className={`section-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{t === 'endpoints' ? 'Endpoints' : 'Logs de entregas'}</button>)}
      </div>

      {tab === 'endpoints' && (
        <>
          <div style={{ marginBottom: 16 }}><button className="btn btn-gold" onClick={() => setModal(true)}>+ Nuevo webhook</button></div>
          <div className="card">
            {hooks.length === 0 ? <div className="empty"><div className="empty-icon">⊕</div>Sin webhooks configurados.</div> : (
              <div className="table-wrap"><table>
                <thead><tr><th>URL destino</th><th>Eventos</th><th>Estado</th><th>Acciones</th></tr></thead>
                <tbody>
                  {hooks.map(h => (
                    <tr key={h.id}>
                      <td style={{ fontSize: 11, fontFamily: 'DM Mono, monospace', color: G.dim }}>{h.url}</td>
                      <td>{(h.events || []).map(e => <span key={e} className="tag" style={{ marginRight: 4, marginBottom: 2 }}>{e}</span>)}</td>
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
          {logs.length === 0 ? <div className="empty"><div className="empty-icon">◎</div>Sin logs todavía.</div> : (
            <div className="table-wrap"><table>
              <thead><tr><th>Evento</th><th>Estado</th><th>Intento</th><th>Fecha</th></tr></thead>
              <tbody>
                {logs.slice(0, 50).map(l => (
                  <tr key={l.id}>
                    <td><span className="tag">{l.event}</span></td>
                    <td><StatusBadge status={l.status === 'delivered' ? 'SUCCEEDED' : 'FAILED'} /></td>
                    <td style={{ color: G.muted, fontSize: 11, fontFamily: 'DM Mono, monospace' }}>#{l.attempt}</td>
                    <td style={{ color: G.muted, fontSize: 11, fontFamily: 'DM Mono, monospace' }}>{l.createdAt ? new Date(l.createdAt).toLocaleString('es-ES') : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table></div>
          )}
        </div>
      )}

      {modal && (
        <Modal title="Nuevo webhook endpoint" onClose={() => setModal(false)}>
          <div className="form-group"><label className="form-label">URL destino</label><input className="form-input" placeholder="https://tu-app.com/webhooks" value={form.url} onChange={e => setForm(p => ({ ...p, url: e.target.value }))} /></div>
          <div className="form-group">
            <label className="form-label">Eventos a escuchar</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
              {EVENTS.map(ev => (
                <button key={ev} type="button"
                  className={`pill ${form.events.includes(ev) ? 'active' : ''}`}
                  style={{ border: `1px solid ${G.border}`, borderRadius: 6 }}
                  onClick={() => setForm(p => ({ ...p, events: p.events.includes(ev) ? p.events.filter(e => e !== ev) : [...p.events, ev] }))}>
                  {ev}
                </button>
              ))}
            </div>
          </div>
          <div className="modal-actions">
            <button className="btn btn-ghost" onClick={() => setModal(false)}>Cancelar</button>
            <button className="btn btn-gold" onClick={save}>Crear webhook</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── ROOT APP ─────────────────────────────────────────────────────────────────

export default function App() {
  const [user, setUser] = useState(() => {
    try { const s = localStorage.getItem('user'); return s ? JSON.parse(s) : null; } catch { return null; }
  });
  const [section, setSection] = useState('dashboard');
  const [toast, setToast] = useState(null);
  const showToast = useCallback((msg, type = 'success') => setToast({ msg, type }), []);

  if (!user) return <Login onLogin={setUser} />;

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

  const titles = {
    dashboard: 'Dashboard', payments: 'Pagos', subscriptions: 'Suscripciones',
    batch: 'Batch Payment', gateways: 'Pasarelas de pago', webhooks: 'Webhooks',
    shops: 'Tiendas Shopify', pixels: 'Pixel Manager', templates: 'Email Templates',
  };

  const logout = () => { localStorage.clear(); setUser(null); };

  return (
    <>
      <style>{css}</style>
      <div className="layout">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="sidebar-top">
            <div className="logo-wrap">
              <div className="logo-icon">N</div>
              <div>
                <div className="logo-name">NoLimitsPay</div>
                <div className="logo-sub">Orchestrator</div>
              </div>
            </div>
          </div>

          <nav className="nav">
            <div className="nav-section-label">Principal</div>
            {navItems.slice(0, 5).map(item => (
              <button key={item.id} className={`nav-item ${section === item.id ? 'active' : ''}`} onClick={() => setSection(item.id)}>
                <span className="nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
            <div className="nav-section-label" style={{ marginTop: 8 }}>Integraciones</div>
            {navItems.slice(5).map(item => (
              <button key={item.id} className={`nav-item ${section === item.id ? 'active' : ''}`} onClick={() => setSection(item.id)}>
                <span className="nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="sidebar-user">
            <div className="user-avatar">{user.name?.[0]?.toUpperCase() || 'A'}</div>
            <div>
              <div className="user-name">{user.name || 'Admin'}</div>
              <div className="user-role">{user.role === 'admin' ? '★ Administrador' : 'Usuario'}</div>
            </div>
            <button className="logout-btn" onClick={logout} title="Cerrar sesión">⏻</button>
          </div>
        </aside>

        {/* MAIN */}
        <main className="main">
          <div className="topbar">
            <div>
              <div className="page-title">{titles[section]}</div>
              <div className="breadcrumb">NoLimitsPay · {titles[section]} · {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
            </div>
            <div className="topbar-right">
              <div style={{ fontSize: 11, color: G.muted, fontFamily: 'DM Mono, monospace', padding: '6px 12px', background: G.card, borderRadius: 8, border: `1px solid ${G.border}` }}>
                <span className="dot pulse" style={{ background: G.green, marginRight: 6 }} />
                Sistema operativo
              </div>
            </div>
          </div>

          {section === 'dashboard' && <Dashboard showToast={showToast} />}
          {section === 'payments' && <Payments showToast={showToast} />}
          {section === 'subscriptions' && <Subscriptions showToast={showToast} />}
          {section === 'batch' && <BatchPayment showToast={showToast} />}
          {section === 'gateways' && <Gateways showToast={showToast} />}
          {section === 'webhooks' && <Webhooks showToast={showToast} />}
          {section === 'shops' && (
            <SimpleList showToast={showToast} apiObj={shopsApi} title="Nueva tienda Shopify"
              columns={[
                { key: 'name', label: 'Nombre' },
                { key: 'url', label: 'URL Shopify', render: v => <span className="mono" style={{ fontSize: 11, color: G.dim }}>{v}</span> },
                { key: 'active', label: 'Estado', render: v => <StatusBadge status={v ? 'ACTIVE' : 'INACTIVE'} /> }
              ]}
              createFields={[
                { key: 'name', label: 'Nombre de la tienda', placeholder: 'Mi Tienda' },
                { key: 'url', label: 'URL Shopify', placeholder: 'mitienda.myshopify.com' }
              ]}
            />
          )}
          {section === 'pixels' && (
            <SimpleList showToast={showToast} apiObj={pixelsApi} title="Nuevo pixel"
              columns={[
                { key: 'provider', label: 'Proveedor', render: v => <span className={`badge ${v === 'META' ? 'badge-blue' : v === 'TIKTOK' ? 'badge-red' : 'badge-gold'}`}>{v}</span> },
                { key: 'pixelId', label: 'Pixel ID', render: v => <span className="mono" style={{ fontSize: 11 }}>{v}</span> },
                { key: 'name', label: 'Nombre' },
              ]}
              createFields={[
                { key: 'provider', label: 'Proveedor', type: 'select', options: [{ value: 'META', label: 'Meta (Facebook)' }, { value: 'TIKTOK', label: 'TikTok' }, { value: 'PINTEREST', label: 'Pinterest' }] },
                { key: 'pixelId', label: 'Pixel ID', placeholder: '1234567890' },
                { key: 'name', label: 'Nombre', placeholder: 'Pixel principal' },
              ]}
            />
          )}
          {section === 'templates' && (
            <SimpleList showToast={showToast} apiObj={templatesApi} title="Nueva plantilla"
              columns={[
                { key: 'name', label: 'Nombre' },
                { key: 'subject', label: 'Asunto', render: v => <span style={{ fontSize: 12, color: G.dim }}>{v}</span> },
                { key: 'active', label: 'Estado', render: v => <StatusBadge status={v ? 'ACTIVE' : 'INACTIVE'} /> },
              ]}
              createFields={[
                { key: 'name', label: 'Nombre interno', placeholder: 'Cart Recovery' },
                { key: 'subject', label: 'Asunto del email', placeholder: '¡Tu carrito te espera!' },
                { key: 'html', label: 'Contenido HTML', placeholder: '<h1>Hola {{name}}</h1>' },
              ]}
            />
          )}
        </main>
      </div>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}
