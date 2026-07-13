'use client';
import { useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

/* ──────────────────────────────────────────────────────────────
   STEP 2 · RENTAL DETAILS — pixel-perfect
   ────────────────────────────────────────────────────────────── */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

/* ── shell & layout ── */
.nr-shell { display: flex; min-height: 100vh; background: #F3F4F9; font-family: Inter, sans-serif; }
.nr-main  { margin-left: 240px; display: flex; flex-direction: column; min-height: 100vh; width: calc(100% - 240px); }
.nr-page  { flex: 1; padding: 0 28px 80px; background-color: #FFF;}

/* ── breadcrumb ── */
.nr-bc { display: flex; align-items: center; gap: 7px; padding: 14px 0 0; font-size: 12px; color: #9CA3AF; }
.nr-bc a { color: #9CA3AF; display: flex; align-items: center; gap: 4px; text-decoration: none; transition: color .15s; }
.nr-bc a:hover { color: #2a195c; }
.nr-bc-sep { color: #D1D5DB; }
.nr-bc-cur { color: #2a195c; font-weight: 600; }

/* ── title row ── */
.nr-title-row { display: flex; align-items: flex-start; justify-content: space-between; margin: 14px 0 20px; gap: 16px; }
.nr-h1  { font-size: 24px; font-weight: 800; color: #111827; line-height: 1.2; margin: 0; }
.nr-sub { font-size: 13px; color: #6B7280; margin-top: 4px; }
.nr-back-btn {
  display: flex; align-items: center; gap: 7px;
  padding: 10px 20px; background: #fff; border: 1.5px solid #E5E7EB;
  border-radius: 10px; font-size: 13px; font-weight: 600; color: #374151;
  cursor: pointer; white-space: nowrap; font-family: inherit;
  box-shadow: 0 1px 3px rgba(0,0,0,.06); transition: border-color .15s, color .15s; flex-shrink: 0;
}
.nr-back-btn:hover { border-color: #2a195c; color: #2a195c; }

/* ── stepper ── */
.nr-stepper {
  display: flex; align-items: center;
  background: #fff; border: 1px solid #E5E7EB; border-radius: 14px;
  padding: 18px 24px; margin-bottom: 22px; box-shadow: 0 1px 4px rgba(0,0,0,.05);
}
.nr-step-wrap  { display: flex; align-items: center; flex: 1; }
.nr-step       { display: flex; align-items: center; gap: 10px; }
.nr-step-num   { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; flex-shrink: 0; }
.nr-step-num.active { background: #2a195c; color: #fff; }
.nr-step-num.done   { background: #22C55E; color: #fff; }
.nr-step-num.pend   { background: #fff; color: #9CA3AF; border: 2px solid #E5E7EB; }
.nr-step-label      { font-size: 13px; font-weight: 600; color: #111827; white-space: nowrap; }
.nr-step-label.pend { color: #9CA3AF; font-weight: 500; }
.nr-step-stat       { font-size: 11.5px; margin-top: 2px; white-space: nowrap; }
.nr-step-stat.done-s   { color: #22C55E; }
.nr-step-stat.active-s { color: #2a195c; }
.nr-step-stat.pend-s   { color: #9CA3AF; }
.nr-step-line { flex: 1; height: 2px; background: #E5E7EB; margin: 0 14px; min-width: 16px; }
.nr-step-line.done-l { background: #22C55E; }

/* ── outer 2-col layout ── */
.nr-layout { display: grid; grid-template-columns: 1fr 296px; gap: 20px; align-items: start; }

/* ── card shell ── */
.nr-card {
  background: #fff; border: 1px solid #E5E7EB; border-radius: 14px;
  box-shadow: 0 1px 4px rgba(0,0,0,.06); overflow: hidden; margin-bottom: 16px;
}
.nr-card-hdr {
  display: flex; align-items: flex-start; justify-content: space-between;
  gap: 16px; padding: 20px 24px 18px; border-bottom: 1px solid #F3F4F6;
}
.nr-card-hdr h2 { font-size: 18px; font-weight: 700; color: #111827; margin: 0 0 4px; }
.nr-card-hdr p  { font-size: 13px; color: #6B7280; margin: 0; }

/* ── 3-column panel grid ── */
.rd-3col { display: grid; grid-template-columns: 1fr 1fr 1fr; }
.rd-panel { padding: 20px 22px; }
.rd-panel:not(:last-child) { border-right: 1px solid #F3F4F6; }

/* panel header */
.rd-ph { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.rd-ph-title { font-size: 13px; font-weight: 700; color: #374151; }
.rd-avail {
  background: #DCFCE7; color: #16A34A; border: 1px solid #BBF7D0;
  border-radius: 6px; font-size: 11px; font-weight: 700; padding: 3px 10px;
}

/* image area */
.rd-img-wrap { display: flex; justify-content: center; align-items: center; min-height: 110px; margin-bottom: 12px; }

/* vehicle name + type */
.rd-veh-name { font-size: 14.5px; font-weight: 800; color: #111827; margin-bottom: 2px; }
.rd-veh-type { font-size: 12px; color: #6B7280; margin-bottom: 14px; }

/* spec rows */
.rd-spec { display: flex; align-items: center; justify-content: space-between; padding: 7px 0; border-bottom: 1px solid #F9FAFB; font-size: 12.5px; }
.rd-spec:last-child { border-bottom: none; }
.rd-spec-l { color: #6B7280; }
.rd-spec-v { font-weight: 600; color: #111827; }

/* change dropdown */
.rd-chg-sel {
  width: 100%; margin-top: 14px; padding: 9px 13px;
  border: 1.5px solid #E5E7EB; border-radius: 9px;
  font-size: 13px; color: #374151; font-family: inherit; cursor: pointer;
  outline: none; background: #fff; transition: border-color .15s;
  appearance: none; -webkit-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2.5' stroke-linecap='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
  background-repeat: no-repeat; background-position: right 12px center; padding-right: 36px;
  box-sizing: border-box;
}
.rd-chg-sel:focus { border-color: #2a195c; box-shadow: 0 0 0 3px rgba(79,70,229,.1); }

/* plan panel */
.rd-plan-sel {
  width: 100%; padding: 9px 13px; border: 1.5px solid #E5E7EB; border-radius: 9px;
  font-size: 13px; color: #111827; font-family: inherit; cursor: pointer;
  outline: none; background: #fff; transition: border-color .15s;
  appearance: none; -webkit-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2.5' stroke-linecap='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
  background-repeat: no-repeat; background-position: right 12px center; padding-right: 36px;
  box-sizing: border-box; font-weight: 600; margin-bottom: 12px;
}
.rd-plan-sel:focus { border-color: #2a195c; box-shadow: 0 0 0 3px rgba(79,70,229,.1); }
.rd-price-box { background: #FAFAFF; border: 1px solid #E0E7FF; border-radius: 10px; padding: 14px 16px; margin-bottom: 14px; }
.rd-price-amount { font-size: 22px; font-weight: 800; color: #111827; line-height: 1.1; }
.rd-price-unit { font-size: 13px; color: #6B7280; font-weight: 500; }
.rd-price-from { font-size: 12px; color: #9CA3AF; margin-top: 4px; }
.rd-feature { display: flex; align-items: center; gap: 8px; font-size: 12.5px; color: #374151; margin-bottom: 8px; }
.rd-feature-ic-green { color: #22C55E; display: flex; flex-shrink: 0; }
.rd-feature-ic-amber { color: #F59E0B; display: flex; flex-shrink: 0; }
.rd-view-plans { font-size: 12.5px; color: #2a195c; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; border: none; background: none; font-family: inherit; padding: 0; margin-top: 6px; text-decoration: none; }
.rd-view-plans:hover { text-decoration: underline; }

/* ── Ride Timing card ── */
.rd-timing-hdr { display: flex; align-items: flex-start; gap: 10px; padding: 18px 24px 14px; border-bottom: 1px solid #F3F4F6; }
.rd-timing-hdr-ic { color: #2a195c; display: flex; flex-shrink: 0; margin-top: 1px; }
.rd-timing-title { font-size: 14px; font-weight: 700; color: #111827; margin-bottom: 3px; }
.rd-timing-sub { font-size: 12.5px; color: #6B7280; }
.rd-timing-body { padding: 20px 24px; }
.rd-timing-grid { display: grid; grid-template-columns: 1fr 1fr auto; gap: 20px; align-items: end; }
.rd-fld label { display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 7px; }
.rd-fld .req { color: #EF4444; margin-left: 2px; }
.rd-dt-row { display: grid; grid-template-columns: 1fr auto; gap: 10px; }
.nr-inp {
  width: 100%; padding: 10px 13px; border: 1.5px solid #E5E7EB; border-radius: 9px;
  font-size: 13px; color: #111827; font-family: inherit; outline: none;
  transition: border-color .15s, box-shadow .15s; background: #fff; box-sizing: border-box;
}
.nr-inp::placeholder { color: #9CA3AF; }
.nr-inp:focus { border-color: #2a195c; box-shadow: 0 0 0 3px rgba(79,70,229,.1); }
.nr-inp-wrap { position: relative; }
.nr-inp-wrap .nr-inp { padding-right: 36px; }
.nr-inp-wrap-ic { position: absolute; right: 11px; top: 50%; transform: translateY(-50%); color: #9CA3AF; pointer-events: none; display: flex; }
.rd-dur-box {
  background: #F5F3FF; border: 1px solid #DDD6FE; border-radius: 12px;
  padding: 14px 20px; text-align: center; min-width: 115px;
}
.rd-dur-lbl { font-size: 11px; color: #6B7280; margin-bottom: 5px; font-weight: 500; }
.rd-dur-val { font-size: 22px; font-weight: 800; color: #2a195c; line-height: 1.1; }
.rd-dur-sub { font-size: 11.5px; color: #9CA3AF; margin-top: 3px; }
.rd-timing-note {
  display: flex; align-items: flex-start; gap: 10px;
  background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 10px;
  padding: 11px 16px; margin-top: 16px; font-size: 12.5px; color: #1D4ED8; line-height: 1.5;
}

/* ── Footer ── */
.nr-footer-actions {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 24px; background: #fff;
  border: 1px solid #E5E7EB; border-radius: 14px;
  box-shadow: 0 1px 4px rgba(0,0,0,.05);
}
.nr-prev-btn {
  display: flex; align-items: center; gap: 7px;
  padding: 10px 22px; background: #fff; border: 1.5px solid #E5E7EB;
  border-radius: 10px; font-size: 13px; font-weight: 600; color: #374151;
  cursor: pointer; font-family: inherit; transition: border-color .15s, color .15s;
  text-decoration: none;
}
.nr-prev-btn:hover { border-color: #2a195c; color: #2a195c; }
.nr-continue-btn {
  display: flex; align-items: center; gap: 8px;
  padding: 11px 28px; background: #2a195c; border: none;
  border-radius: 10px; font-size: 13px; font-weight: 700; color: #fff;
  cursor: pointer; font-family: inherit; transition: background .15s;
  text-decoration: none;
}
.nr-continue-btn:hover { background: #4338CA; }

/* ─── RIGHT PANEL ─── */
.nr-rp { display: flex; flex-direction: column; gap: 16px; position: sticky; top: 80px; }
.nr-rp-card { background: #fff; border: 1px solid #E5E7EB; border-radius: 14px; box-shadow: 0 1px 4px rgba(0,0,0,.06); overflow: hidden; }
.nr-rp-hdr  { display: flex; align-items: center; gap: 9px; padding: 14px 18px; border-bottom: 1px solid #E5E7EB; }
.nr-rp-hdr-ic { display: flex; align-items: center; flex-shrink: 0; }
.nr-rp-title  { font-size: 13.5px; font-weight: 700; color: #111827; }
.nr-sum-body  { padding: 4px 0 8px; }
.nr-sum-row   { display: flex; align-items: center; justify-content: space-between; padding: 8px 18px; font-size: 13px; }
.nr-sum-label { color: #6B7280; }
.nr-sum-val   { font-weight: 600; color: #111827; }
.nr-sum-divider { height: 1px; background: #F3F4F6; margin: 4px 0; }
.nr-sum-total {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 18px; margin: 8px 12px 12px; border-radius: 10px; background: #F5F3FF;
}
.nr-sum-total-l { font-size: 13px; font-weight: 700; color: #111827; }
.nr-sum-total-r { font-size: 18px; font-weight: 800; color: #2a195c; }
.nr-imp-body { padding: 12px 18px 14px; }
.nr-imp-item { display: flex; align-items: flex-start; gap: 7px; font-size: 12.5px; color: #92400E; margin-bottom: 6px; line-height: 1.5; }
.nr-imp-item:last-child { margin-bottom: 0; }
.nr-help-body { padding: 14px 18px 16px; }
.nr-help-sub  { font-size: 13px; color: #6B7280; margin-bottom: 12px; }
.nr-help-btn  { width: 100%; padding: 10px; background: #2a195c; color: #fff; border-radius: 9px; font-size: 13px; font-weight: 600; cursor: pointer; border: none; font-family: inherit; transition: background .15s; }
.nr-help-btn:hover { background: #4338CA; }
`;

/* ── SVG icons ── */
const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 2 as number, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
const SV = ({ s = 14, children, ...p }: { s?: number; children: React.ReactNode } & React.SVGProps<SVGSVGElement>) => (
  <svg width={s} height={s} viewBox="0 0 24 24" {...S} {...p}>{children}</svg>
);
const ILeft = () => <SV s={13}><polyline points="15 18 9 12 15 6" /></SV>;
const ICheck = ({ s = 13 }: { s?: number }) => <SV s={s}><polyline points="20 6 9 17 4 12" /></SV>;
const IInfo = ({ s = 14 }: { s?: number }) => <SV s={s}><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></SV>;
const IHead = () => <SV s={15}><path d="M3 18v-6a9 9 0 0 1 18 0v6" /><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" /></SV>;
const IArr = ({ s = 12 }: { s?: number }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>;
const IReceipt = () => <SV s={14}><path d="M14 2H6a2 2 0 0 0-2 2v16l3-2 2 2 2-2 2 2 2-2 3 2V4a2 2 0 0 0-2-2z" /><line x1="8" y1="9" x2="16" y2="9" /><line x1="8" y1="13" x2="12" y2="13" /></SV>;
const IClock = ({ s = 16 }: { s?: number }) => <SV s={s}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></SV>;
const ICal = ({ s = 14 }: { s?: number }) => <SV s={s}><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></SV>;

/* ── Scooter SVG ── */
const ScooterSVG = () => (
  <svg viewBox="0 0 260 170" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxWidth: 190, height: 'auto' }}>
    <ellipse cx="128" cy="162" rx="98" ry="5" fill="#E5E7EB" />
    {/* Rear wheel */}
    <circle cx="52" cy="126" r="34" fill="#1F2937" />
    <circle cx="52" cy="126" r="24" fill="#374151" />
    <circle cx="52" cy="126" r="13" fill="#6B7280" />
    <circle cx="52" cy="126" r="5" fill="#9CA3AF" />
    {[0, 60, 120, 180, 240, 300].map(a => (
      <line key={a} x1={52 + 13 * Math.cos(a * Math.PI / 180)} y1={126 + 13 * Math.sin(a * Math.PI / 180)} x2={52 + 24 * Math.cos(a * Math.PI / 180)} y2={126 + 24 * Math.sin(a * Math.PI / 180)} stroke="#9CA3AF" strokeWidth="1.5" />
    ))}
    {/* Front wheel */}
    <circle cx="206" cy="126" r="34" fill="#1F2937" />
    <circle cx="206" cy="126" r="24" fill="#374151" />
    <circle cx="206" cy="126" r="13" fill="#6B7280" />
    <circle cx="206" cy="126" r="5" fill="#9CA3AF" />
    {[0, 60, 120, 180, 240, 300].map(a => (
      <line key={a} x1={206 + 13 * Math.cos(a * Math.PI / 180)} y1={126 + 13 * Math.sin(a * Math.PI / 180)} x2={206 + 24 * Math.cos(a * Math.PI / 180)} y2={126 + 24 * Math.sin(a * Math.PI / 180)} stroke="#9CA3AF" strokeWidth="1.5" />
    ))}
    {/* Main body */}
    <path d="M52 92 L80 44 L168 37 L210 92 Z" fill="#2a195c" />
    {/* Rear section */}
    <path d="M52 92 L80 44 L88 44 L67 92 Z" fill="#3730A3" />
    {/* Front section */}
    <path d="M168 37 L210 85 L210 92 L202 92 L178 54 L160 37 Z" fill="#3730A3" />
    {/* Seat */}
    <path d="M100 40 L166 35 L164 27 L98 33 Z" fill="#1E1B4B" rx="3" />
    {/* Handle stem */}
    <rect x="199" y="46" width="7" height="48" fill="#374151" rx="3" />
    {/* Handlebars */}
    <rect x="188" y="44" width="24" height="7" fill="#374151" rx="3.5" />
    <rect x="184" y="40" width="7" height="14" fill="#374151" rx="3.5" />
    <rect x="203" y="40" width="7" height="14" fill="#374151" rx="3.5" />
    {/* Windscreen */}
    <path d="M168 37 L186 46 L193 62 L177 55 Z" fill="#BFDBFE" opacity="0.55" />
    {/* Headlight */}
    <ellipse cx="205" cy="84" rx="11" ry="8" fill="#FEF9C3" />
    <ellipse cx="205" cy="84" rx="7" ry="5" fill="#FEF08A" />
    {/* Rear light */}
    <rect x="52" y="76" width="8" height="11" rx="3" fill="#FCA5A5" />
    {/* Footboard */}
    <rect x="95" y="93" width="112" height="10" fill="#374151" rx="2" />
    {/* Body panel */}
    <path d="M108 60 L162 55 L166 74 L108 80 Z" fill="#3730A3" opacity="0.45" />
    {/* Logo */}
    <text x="136" y="70" fontFamily="Arial, sans-serif" fontSize="10" fontWeight="bold" fill="white" textAnchor="middle" opacity="0.9">EVEGAH E1</text>
    {/* Kickstand */}
    <rect x="155" y="103" width="4" height="22" fill="#6B7280" rx="2" transform="rotate(8 155 103)" />
  </svg>
);

/* ── Battery SVG ── */
const BatterySVG = () => (
  <svg viewBox="0 0 110 160" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 'auto', height: 110, margin: '0 auto', display: 'block' }}>
    <rect x="18" y="28" width="74" height="122" rx="10" fill="#1F2937" />
    <rect x="21" y="31" width="68" height="116" rx="8" fill="#111827" />
    {/* Terminal */}
    <rect x="40" y="16" width="30" height="16" rx="5" fill="#374151" />
    <rect x="44" y="10" width="22" height="8" rx="3" fill="#4B5563" />
    {/* Cells */}
    <rect x="27" y="44" width="56" height="14" rx="3" fill="#22C55E" />
    <rect x="27" y="63" width="56" height="14" rx="3" fill="#22C55E" />
    <rect x="27" y="82" width="56" height="14" rx="3" fill="#22C55E" />
    <rect x="27" y="101" width="56" height="14" rx="3" fill="#16A34A" opacity="0.6" />
    <rect x="27" y="120" width="56" height="14" rx="3" fill="#4B5563" />
    {/* Separator lines */}
    <line x1="27" y1="58" x2="83" y2="58" stroke="#374151" strokeWidth="0.8" />
    <line x1="27" y1="77" x2="83" y2="77" stroke="#374151" strokeWidth="0.8" />
    <line x1="27" y1="96" x2="83" y2="96" stroke="#374151" strokeWidth="0.8" />
    <line x1="27" y1="115" x2="83" y2="115" stroke="#374151" strokeWidth="0.8" />
    {/* Lightning bolt */}
    <path d="M60 60 L48 78 L58 78 L50 96 L68 76 L58 76 L66 60 Z" fill="#FCD34D" />
    {/* Label */}
    <text x="55" y="148" textAnchor="middle" fontFamily="Arial" fontSize="8.5" fontWeight="bold" fill="#6B7280">60V / 30Ah</text>
  </svg>
);

/* ── Stepper ── */
const STEPS = [
  { n: 1, label: 'KYC Verification', stat: 'Completed', state: 'done' },
  { n: 2, label: 'Rental Details', stat: 'In Progress', state: 'active' },
  { n: 3, label: 'Payment & Charges', stat: 'Pending', state: 'pend' },
  { n: 4, label: 'Documents', stat: 'Pending', state: 'pend' },
  { n: 5, label: 'Review & Confirm', stat: 'Pending', state: 'pend' },
];

/* ── Right Panel ── */
function RightPanel({ selectedModel }: { selectedModel: 'city' | 'mink' | 'v2' }) {
  const vehicleName = selectedModel === 'city' ? 'Evegah City' : selectedModel === 'mink' ? 'Evegah Mink' : 'Evegah E2';
  return (
    <div className="nr-rp">
      {/* Rental Summary */}
      <div className="nr-rp-card">
        <div className="nr-rp-hdr">
          <span className="nr-rp-hdr-ic" style={{ color: '#2a195c' }}><IReceipt /></span>
          <div className="nr-rp-title">Rental Summary</div>
        </div>
        <div className="nr-sum-body">
          {[
            { l: 'Vehicle', v: vehicleName },
            { l: 'Battery', v: 'Evegah 60V 30Ah' },
            { l: 'Plan', v: 'Daily Plan' },
            { l: 'Plan Rate (Daily)', v: '₹600.00' },
            { l: 'Expected Duration', v: '1 Day' },
          ].map(r => (
            <div key={r.l} className="nr-sum-row">
              <span className="nr-sum-label">{r.l}</span>
              <span className="nr-sum-val">{r.v}</span>
            </div>
          ))}
          <div className="nr-sum-divider" />
          <div className="nr-sum-row">
            <span className="nr-sum-label">Est. Sub Total</span>
            <span className="nr-sum-val">₹600.00</span>
          </div>
          <div className="nr-sum-row">
            <span className="nr-sum-label">GST (18%)</span>
            <span className="nr-sum-val">₹108.00</span>
          </div>
          <div className="nr-sum-total">
            <span className="nr-sum-total-l">Est. Total Payable</span>
            <span className="nr-sum-total-r">₹708.00</span>
          </div>
        </div>
      </div>

      {/* Important Note */}
      <div className="nr-rp-card">
        <div className="nr-rp-hdr">
          <span className="nr-rp-hdr-ic" style={{ color: '#D97706' }}><IInfo s={14} /></span>
          <div className="nr-rp-title">Important Note</div>
        </div>
        <div className="nr-imp-body">
          {[
            'Plan and rates are subject to change as per company policy.',
            'Actual charges may vary based on the final return time.',
          ].map((n, i) => (
            <div key={i} className="nr-imp-item">
              <span style={{ color: '#D97706', fontWeight: 700, marginTop: 1 }}>•</span>
              <span>{n}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Need Help */}
      <div className="nr-rp-card">
        <div className="nr-rp-hdr">
          <span className="nr-rp-hdr-ic" style={{ color: '#2a195c' }}><IHead /></span>
          <div className="nr-rp-title">Need Help?</div>
        </div>
        <div className="nr-help-body">
          <div className="nr-help-sub">Facing issues with rental details?</div>
          <button className="nr-help-btn">Contact Support</button>
        </div>
      </div>
    </div>
  );
}

const VEHICLE_MODELS = {
  city: {
    name: 'Evegah City',
    type: 'Electric Scooter',
    image: '/city.png',
    specs: [
      { l: 'Top Speed', v: '25 km/h' },
      { l: 'Range', v: '60 km/charge' },
      { l: 'Battery Type', v: 'Li-ion' },
    ],
  },
  mink: {
    name: 'Evegah Mink',
    type: 'Electric Scooter',
    image: '/mink.png',
    specs: [
      { l: 'Top Speed', v: '45 km/h' },
      { l: 'Range', v: '90 km/charge' },
      { l: 'Battery Type', v: 'Li-ion (Removable)' },
    ],
  },
  v2: {
    name: 'Evegah E2',
    type: 'Electric Scooter',
    image: '/v2.webp',
    specs: [
      { l: 'Top Speed', v: '65 km/h' },
      { l: 'Range', v: '120 km/charge' },
      { l: 'Battery Type', v: 'Li-ion (Dual)' },
    ],
  },
};

/* ═══════════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════════ */
export default function RentalDetailsPage() {
  const [selectedModel, setSelectedModel] = useState<'city' | 'mink' | 'v2'>('city');
  const vehicle = VEHICLE_MODELS[selectedModel];
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="nr-shell">
        <Sidebar activePath="/new-rider" />
        <div className="nr-main">
          <TopBar />
          <div className="nr-page">

            {/* Breadcrumb */}
            <div className="nr-bc">
              <Link href="/"><ILeft /> Home</Link>
              <span className="nr-bc-sep">›</span>
              <a href="#">Rides / Rentals</a>
              <span className="nr-bc-sep">›</span>
              <span className="nr-bc-cur">New Ride Registration</span>
            </div>

            {/* Title */}
            <div className="nr-title-row">
              <div>
                <h1 className="nr-h1">New Ride Registration</h1>
                <p className="nr-sub">Register a new ride for the rider</p>
              </div>
              <button className="nr-back-btn"><ILeft /> Back to Rides</button>
            </div>

            {/* Stepper */}
            <div className="nr-stepper">
              {STEPS.map((s, i) => (
                <div key={s.n} className="nr-step-wrap">
                  <div className="nr-step">
                    <div className={`nr-step-num ${s.state}`}>
                      {s.state === 'done' ? <ICheck s={13} /> : s.n}
                    </div>
                    <div>
                      <div className={`nr-step-label ${s.state === 'pend' ? 'pend' : ''}`}>{s.label}</div>
                      <div className={`nr-step-stat ${s.state}-s`}>{s.stat}</div>
                    </div>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`nr-step-line ${s.state === 'done' ? 'done-l' : ''}`} />
                  )}
                </div>
              ))}
            </div>

            {/* 2-col outer layout */}
            <div className="nr-layout">
              <div>
                {/* ── 3-Column Selection Card ── */}
                <div className="nr-card">
                  <div className="rd-3col">

                    {/* 1. Select Vehicle */}
                    <div className="rd-panel">
                      <div className="rd-ph">
                        <span className="rd-ph-title">1. Select Vehicle</span>
                        <span className="rd-avail">Available</span>
                      </div>
                      <div className="rd-img-wrap">
                        <img
                          src={vehicle.image}
                          alt={vehicle.name}
                          style={{ maxHeight: '110px', maxWidth: '100%', objectFit: 'contain' }}
                        />
                      </div>
                      <div className="rd-veh-name">{vehicle.name}</div>
                      <div className="rd-veh-type">{vehicle.type}</div>
                      {vehicle.specs.map(r => (
                        <div key={r.l} className="rd-spec">
                          <span className="rd-spec-l">{r.l}</span>
                          <span className="rd-spec-v">{r.v}</span>
                        </div>
                      ))}
                      <select
                        className="rd-chg-sel"
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value as 'city' | 'mink' | 'v2')}
                      >
                        <option value="city">Evegah City</option>
                        <option value="mink">Evegah Mink</option>
                        <option value="v2">Evegah E2</option>
                      </select>
                    </div>

                    {/* 2. Select Battery */}
                    <div className="rd-panel">
                      <div className="rd-ph">
                        <span className="rd-ph-title">2. Select Battery</span>
                        <span className="rd-avail">Available</span>
                      </div>
                      <div className="rd-img-wrap">
                        <BatterySVG />
                      </div>
                      <div className="rd-veh-name">Evegah 60V 30Ah</div>
                      <div className="rd-veh-type">Portable Battery</div>
                      {[
                        { l: 'Type', v: 'Li-ion' },
                        { l: 'Capacity', v: '60V / 30Ah' },
                        { l: 'Swappable', v: 'Yes' },
                      ].map(r => (
                        <div key={r.l} className="rd-spec">
                          <span className="rd-spec-l">{r.l}</span>
                          <span className="rd-spec-v">{r.v}</span>
                        </div>
                      ))}
                      <select className="rd-chg-sel">
                        <option>Change Battery</option>
                        <option>Evegah 72V 40Ah</option>
                        <option>Evegah 48V 20Ah</option>
                      </select>
                    </div>

                    {/* 3. Select Rental Plan */}
                    <div className="rd-panel">
                      <div className="rd-ph">
                        <span className="rd-ph-title">3. Select Rental Plan</span>
                      </div>
                      <select className="rd-plan-sel">
                        <option>Daily Plan</option>
                        <option>Weekly Plan</option>
                        <option>Monthly Plan</option>
                      </select>
                      <div className="rd-price-box">
                        <div>
                          <span className="rd-price-amount">₹600.00</span>
                          <span className="rd-price-unit"> / Day</span>
                        </div>
                        <div className="rd-price-from">24 hours from activation</div>
                      </div>
                      {[
                        { label: 'Unlimited kms', green: true },
                        { label: 'Battery swap included', green: true },
                        { label: 'Roadside assistance', green: true },
                        { label: 'GST included', green: false },
                      ].map(f => (
                        <div key={f.label} className="rd-feature">
                          {f.green
                            ? <span className="rd-feature-ic-green"><ICheck s={13} /></span>
                            : <span className="rd-feature-ic-amber"><IInfo s={13} /></span>
                          }
                          {f.label}
                        </div>
                      ))}
                      <button className="rd-view-plans">View all plans <IArr s={11} /></button>
                    </div>

                  </div>
                </div>

                {/* ── Ride Timing Card ── */}
                <div className="nr-card">
                  <div className="rd-timing-hdr">
                    <span className="rd-timing-hdr-ic"><IClock s={18} /></span>
                    <div>
                      <div className="rd-timing-title">Ride Timing</div>
                      <div className="rd-timing-sub">Set expected ride start and return time.</div>
                    </div>
                  </div>
                  <div className="rd-timing-body">
                    <div className="rd-timing-grid">
                      {/* Start */}
                      <div className="rd-fld">
                        <label>Expected Start Date &amp; Time<span className="req" style={{ color: '#EF4444', marginLeft: 2 }}> *</span></label>
                        <div className="rd-dt-row">
                          <div className="nr-inp-wrap">
                            <input className="nr-inp" defaultValue="20/05/2024" placeholder="DD/MM/YYYY" />
                            <span className="nr-inp-wrap-ic"><ICal s={14} /></span>
                          </div>
                          <div className="nr-inp-wrap" style={{ width: 115 }}>
                            <input className="nr-inp" defaultValue="10:00 AM" placeholder="HH:MM" />
                            <span className="nr-inp-wrap-ic"><IClock s={13} /></span>
                          </div>
                        </div>
                      </div>
                      {/* Return */}
                      <div className="rd-fld">
                        <label>Expected Return Date &amp; Time<span style={{ color: '#EF4444', marginLeft: 2 }}> *</span></label>
                        <div className="rd-dt-row">
                          <div className="nr-inp-wrap">
                            <input className="nr-inp" defaultValue="21/05/2024" placeholder="DD/MM/YYYY" />
                            <span className="nr-inp-wrap-ic"><ICal s={14} /></span>
                          </div>
                          <div className="nr-inp-wrap" style={{ width: 115 }}>
                            <input className="nr-inp" defaultValue="10:00 AM" placeholder="HH:MM" />
                            <span className="nr-inp-wrap-ic"><IClock s={13} /></span>
                          </div>
                        </div>
                      </div>
                      {/* Duration */}
                      <div className="rd-dur-box">
                        <div className="rd-dur-lbl">Total Duration</div>
                        <div className="rd-dur-val">1 Day</div>
                        <div className="rd-dur-sub">(24 Hours)</div>
                      </div>
                    </div>
                    <div className="rd-timing-note">
                      <span style={{ color: '#2563EB', display: 'flex', flexShrink: 0 }}><IInfo s={14} /></span>
                      <span>The actual return time may vary. Final charges will be calculated as per the plan and duration.</span>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="nr-footer-actions">
                  <Link href="/new-rider" className="nr-prev-btn"><ILeft /> Previous</Link>
                  <Link href="/new-rider/payment" className="nr-continue-btn">
                    Continue to Payment &amp; Charges <IArr s={12} />
                  </Link>
                </div>
              </div>

              {/* Right Panel */}
              <RightPanel selectedModel={selectedModel} />
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
