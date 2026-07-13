'use client';
import { useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

/* ──────────────────────────────────────────────────────────────
   STEP 4 · DOCUMENTS — pixel-perfect
   ────────────────────────────────────────────────────────────── */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');

/* ── shell & layout ── */
.nr-shell { display: flex; min-height: 100vh; background: #F3F4F9; }
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

/* ── outer 2-col ── */
.nr-layout { display: grid; grid-template-columns: 1fr 296px; gap: 20px; align-items: start; }

/* ── card ── */
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

/* ── info banner ── */
.doc-banner {
  display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
  background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 10px;
  padding: 11px 18px; margin: 0 0 20px; font-size: 12.5px; color: #1D4ED8;
}
.doc-banner-sep { color: #BFDBFE; font-size: 14px; }

/* ── section header ── */
.doc-sec-body { padding: 20px 24px; }
.doc-sec-hd { font-size: 14px; font-weight: 700; color: #111827; margin-bottom: 4px; }
.doc-sec-sub { font-size: 12.5px; color: #6B7280; margin-bottom: 16px; }

/* ── Document upload grid (5 cols) ── */
.doc-grid-5 { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; }
.doc-grid-6 { display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px; }

/* ── Document card ── */
.doc-card {
  border: 1.5px solid #E5E7EB; border-radius: 12px; overflow: hidden;
  transition: border-color .15s; cursor: default;
}
.doc-card:hover { border-color: #C7D2FE; }
.doc-card-top { padding: 10px 12px 8px; }
.doc-card-icon-row { display: flex; align-items: center; gap: 6px; margin-bottom: 5px; }
.doc-card-icon { width: 28px; height: 28px; border-radius: 7px; background: #EEF2FF; display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: #2a195c; }
.doc-card-label { font-size: 11.5px; font-weight: 700; color: #111827; line-height: 1.2; }
.doc-card-sub   { font-size: 10.5px; color: #9CA3AF; }

/* Preview area */
.doc-preview { margin: 0 10px 8px; border-radius: 8px; overflow: hidden; height: 76px; background: #F9FAFB; display: flex; align-items: center; justify-content: center; }

/* doc status bar */
.doc-footer { display: flex; align-items: center; gap: 6px; padding: 7px 10px; border-top: 1px solid #F3F4F6; }
.doc-uploaded { display: flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 600; color: #16A34A; }
.doc-view { font-size: 11px; font-weight: 600; color: #2a195c; cursor: pointer; margin-left: 4px; }
.doc-view:hover { text-decoration: underline; }
.doc-del { display: flex; align-items: center; color: #EF4444; cursor: pointer; margin-left: auto; }

/* ── Vehicle image card ── */
.veh-card {
  border: 1.5px solid #E5E7EB; border-radius: 12px; overflow: hidden;
  transition: border-color .15s;
}
.veh-card:hover { border-color: #C7D2FE; }
.veh-card-label { padding: 10px 12px 6px; font-size: 11.5px; font-weight: 700; color: #111827; display: flex; align-items: center; gap: 3px; }
.veh-card-req { color: #EF4444; }
.veh-preview { margin: 0 10px 8px; border-radius: 8px; overflow: hidden; height: 72px; background: #F3F4F9; display: flex; align-items: center; justify-content: center; }
.veh-footer { display: flex; align-items: center; gap: 6px; padding: 7px 10px; border-top: 1px solid #F3F4F6; }

/* ── Terms & Signature ── */
.doc-terms-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
.doc-cb-row { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 12px; cursor: pointer; }
.doc-cb { width: 18px; height: 18px; border-radius: 5px; border: 2px solid #2a195c; background: #2a195c; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; }
.doc-cb-label { font-size: 13px; color: #374151; line-height: 1.5; }
.doc-terms-link { display: inline-flex; align-items: center; gap: 5px; font-size: 13px; font-weight: 600; color: #2a195c; cursor: pointer; border: none; background: none; font-family: inherit; padding: 0; margin-bottom: 14px; }
.doc-terms-link:hover { text-decoration: underline; }
.doc-confirm-banner {
  display: flex; align-items: flex-start; gap: 9px;
  background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 9px;
  padding: 11px 14px; font-size: 12.5px; color: #15803D; line-height: 1.5;
}

/* signature pad */
.doc-sig-label { font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 8px; }
.doc-sig-label .req { color: #EF4444; margin-left: 2px; }
.doc-sig-pad {
  width: 100%; height: 120px; background: #fff;
  border: 1.5px solid #E5E7EB; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  position: relative; overflow: hidden; box-sizing: border-box;
}
.doc-sig-text {
  font-family: 'Dancing Script', cursive;
  font-size: 38px; font-weight: 700; color: #1E1B4B; opacity: 0.88;
  user-select: none; letter-spacing: -0.5px;
}
.doc-sig-line { position: absolute; bottom: 22px; left: 20px; right: 20px; height: 1px; background: #E5E7EB; }
.doc-sig-clear { display: flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 600; color: #6B7280; cursor: pointer; border: none; background: none; font-family: inherit; padding: 6px 0 0; transition: color .15s; }
.doc-sig-clear:hover { color: #EF4444; }

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
.nr-sum-row   { display: flex; align-items: center; justify-content: space-between; padding: 7px 18px; font-size: 13px; }
.nr-sum-row-img { display: flex; align-items: center; justify-content: space-between; padding: 5px 18px; font-size: 13px; }
.nr-sum-label { color: #6B7280; }
.nr-sum-val   { font-weight: 600; color: #111827; display: flex; align-items: center; gap: 8px; }
.nr-sum-thumb { width: 34px; height: 26px; border-radius: 5px; overflow: hidden; background: #F3F4F9; display: flex; align-items: center; justify-content: center; border: 1px solid #E5E7EB; }
.nr-sum-divider { height: 1px; background: #F3F4F6; margin: 4px 0; }
.nr-sum-total {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 18px; margin: 8px 12px 12px; border-radius: 10px; background: #F5F3FF;
}
.nr-sum-total-l { font-size: 13px; font-weight: 700; color: #111827; }
.nr-sum-total-r { font-size: 18px; font-weight: 800; color: #2a195c; }

/* checklist */
.doc-checklist-body { padding: 6px 0 10px; }
.doc-cl-row { display: flex; align-items: center; justify-content: space-between; padding: 7px 18px; font-size: 12.5px; }
.doc-cl-label { color: #374151; }
.doc-cl-status { display: flex; align-items: center; gap: 5px; color: #16A34A; font-weight: 600; font-size: 11.5px; }

.nr-help-body { padding: 14px 18px 16px; }
.nr-help-sub  { font-size: 13px; color: #6B7280; margin-bottom: 12px; line-height: 1.5; }
.nr-help-btn  { width: 100%; padding: 10px; background: #2a195c; color: #fff; border-radius: 9px; font-size: 13px; font-weight: 600; cursor: pointer; border: none; font-family: inherit; transition: background .15s; }
.nr-help-btn:hover { background: #4338CA; }
`;

/* ── SVG Helpers ── */
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
const IFile = ({ s = 14 }: { s?: number }) => <SV s={s}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></SV>;
const ITrash = ({ s = 12 }: { s?: number }) => <SV s={s}><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" /></SV>;
const IExt = () => <SV s={12}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></SV>;
const ICamera = ({ s = 18 }: { s?: number }) => <SV s={s}><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></SV>;
const ICheckList = () => <SV s={14}><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></SV>;
const IPen = () => <SV s={13}><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" /></SV>;

/* ── Stepper ── */
const STEPS = [
  { n: 1, label: 'KYC Verification', stat: 'Completed', state: 'done' },
  { n: 2, label: 'Rental Details', stat: 'Completed', state: 'done' },
  { n: 3, label: 'Payment & Charges', stat: 'Completed', state: 'done' },
  { n: 4, label: 'Documents', stat: 'In Progress', state: 'active' },
  { n: 5, label: 'Review & Confirm', stat: 'Pending', state: 'pend' },
];

/* ── Document thumbnail placeholders ── */
const AadhaarThumb = () => (
  <svg viewBox="0 0 140 76" fill="none" style={{ width: '100%', height: '100%' }}>
    <rect width="140" height="76" fill="#EFF6FF" />
    <rect width="140" height="16" fill="#1D4ED8" />
    <text x="8" y="11" fontFamily="Arial" fontSize="7" fontWeight="bold" fill="white">🇮🇳 AADHAAR</text>
    <text x="90" y="11" fontFamily="Arial" fontSize="6" fill="rgba(255,255,255,0.8)">Unique ID Authority</text>
    <rect x="8" y="22" width="26" height="34" rx="3" fill="#DBEAFE" stroke="#93C5FD" strokeWidth="0.8" />
    <circle cx="21" cy="34" r="7" fill="#3B82F6" />
    <path d="M10 50 Q21 44 32 50" fill="#3B82F6" opacity="0.6" />
    <rect x="42" y="23" width="58" height="4" rx="1.5" fill="#1D4ED8" opacity="0.7" />
    <rect x="42" y="31" width="44" height="3" rx="1" fill="#93C5FD" />
    <rect x="42" y="37" width="36" height="3" rx="1" fill="#93C5FD" />
    <rect x="42" y="43" width="50" height="3" rx="1" fill="#93C5FD" />
    <rect x="8" y="62" width="24" height="8" rx="2" fill="#BFDBFE" />
    <rect x="36" y="62" width="24" height="8" rx="2" fill="#BFDBFE" />
    <rect x="64" y="62" width="24" height="8" rx="2" fill="#BFDBFE" />
    <text x="8" y="68" fontFamily="monospace" fontSize="5" fill="#1D4ED8">1234</text>
    <text x="36" y="68" fontFamily="monospace" fontSize="5" fill="#1D4ED8">5678</text>
    <text x="64" y="68" fontFamily="monospace" fontSize="5" fill="#1D4ED8">9012</text>
    <rect x="104" y="60" width="28" height="10" rx="2" fill="#DBEAFE" stroke="#93C5FD" strokeWidth="0.5" />
  </svg>
);

const DLThumb = () => (
  <svg viewBox="0 0 140 76" fill="none" style={{ width: '100%', height: '100%' }}>
    <rect width="140" height="76" fill="#FFFBEB" />
    <rect width="140" height="16" fill="#D97706" />
    <text x="8" y="11" fontFamily="Arial" fontSize="7" fontWeight="bold" fill="white">DRIVING LICENCE</text>
    <text x="100" y="11" fontFamily="Arial" fontSize="5.5" fill="rgba(255,255,255,0.9)">TRANSPORT DEPT</text>
    <rect x="8" y="22" width="26" height="34" rx="3" fill="#FDE68A" stroke="#FCD34D" strokeWidth="0.8" />
    <circle cx="21" cy="33" r="7" fill="#F59E0B" />
    <path d="M10 49 Q21 43 32 49" fill="#F59E0B" opacity="0.6" />
    <rect x="42" y="23" width="60" height="4" rx="1.5" fill="#92400E" opacity="0.7" />
    <rect x="42" y="31" width="46" height="3" rx="1" fill="#FCD34D" />
    <rect x="42" y="37" width="36" height="3" rx="1" fill="#FCD34D" />
    <rect x="42" y="43" width="52" height="3" rx="1" fill="#FCD34D" />
    <text x="8" y="68" fontFamily="Arial" fontSize="5.5" fill="#92400E" fontWeight="bold">DL No: MH02-20200123456</text>
    <text x="8" y="73" fontFamily="Arial" fontSize="5" fill="#B45309">Valid: 01/01/2030</text>
  </svg>
);

const PANThumb = () => (
  <svg viewBox="0 0 140 76" fill="none" style={{ width: '100%', height: '100%' }}>
    <rect width="140" height="76" fill="#fff" stroke="#E5E7EB" strokeWidth="0.5" />
    <rect x="0" y="0" width="140" height="13" fill="#1E1B4B" />
    <text x="8" y="9" fontFamily="Arial" fontSize="6.5" fontWeight="bold" fill="white">INCOME TAX DEPARTMENT — GOVT. OF INDIA</text>
    <text x="8" y="22" fontFamily="Arial" fontSize="5" fill="#4B5563">Permanent Account Number Card</text>
    <rect x="8" y="26" width="26" height="34" rx="3" fill="#F3F4F6" stroke="#E5E7EB" strokeWidth="0.8" />
    <circle cx="21" cy="38" r="7" fill="#6B7280" />
    <path d="M10 54 Q21 48 32 54" fill="#6B7280" opacity="0.5" />
    <text x="40" y="36" fontFamily="monospace" fontSize="10" fontWeight="bold" fill="#1E1B4B" letterSpacing="2">ABCDE1234F</text>
    <rect x="40" y="42" width="52" height="3" rx="1" fill="#D1D5DB" />
    <rect x="40" y="48" width="38" height="3" rx="1" fill="#D1D5DB" />
    <text x="8" y="72" fontFamily="Arial" fontSize="5" fill="#6B7280">Signature on file</text>
    <rect x="60" y="64" width="36" height="8" rx="2" fill="#F9FAFB" stroke="#E5E7EB" strokeWidth="0.5" />
    <text x="68" y="70" fontFamily="Arial" fontSize="4.5" fontStyle="italic" fill="#374151">John Doe</text>
  </svg>
);

const AddressThumb = () => (
  <svg viewBox="0 0 140 76" fill="none" style={{ width: '100%', height: '100%' }}>
    <rect width="140" height="76" fill="#F9FAFB" />
    <rect x="8" y="8" width="124" height="14" rx="2" fill="#E5E7EB" />
    <text x="16" y="18" fontFamily="Arial" fontSize="7" fontWeight="bold" fill="#374151">ELECTRICITY BILL — MAY 2024</text>
    <rect x="8" y="28" width="90" height="3" rx="1" fill="#D1D5DB" />
    <rect x="8" y="34" width="70" height="3" rx="1" fill="#D1D5DB" />
    <rect x="8" y="40" width="80" height="3" rx="1" fill="#D1D5DB" />
    <rect x="8" y="46" width="56" height="3" rx="1" fill="#D1D5DB" />
    <rect x="8" y="54" width="108" height="1" fill="#E5E7EB" />
    <text x="8" y="63" fontFamily="Arial" fontSize="5.5" fill="#6B7280">Amount Due:</text>
    <text x="55" y="63" fontFamily="Arial" fontSize="6" fontWeight="bold" fill="#111827">₹ 1,240.00</text>
    <rect x="8" y="66" width="60" height="3" rx="1" fill="#D1D5DB" />
  </svg>
);

const ProfileThumb = () => (
  <svg viewBox="0 0 140 76" fill="none" style={{ width: '100%', height: '100%' }}>
    <rect width="140" height="76" fill="#F0F4FF" />
    <circle cx="70" cy="28" r="18" fill="#C7D2FE" />
    <circle cx="70" cy="22" r="10" fill="#818CF8" />
    <path d="M40 72 Q70 54 100 72" fill="#818CF8" opacity="0.7" />
    <path d="M36 76 Q70 56 104 76" fill="#A5B4FC" opacity="0.5" />
  </svg>
);

/* ── Vehicle thumbnails (scooter from different angles) ── */
const VehicleThumb = ({ label, dark = false }: { label: string; dark?: boolean }) => (
  <svg viewBox="0 0 130 72" fill="none" style={{ width: '100%', height: '100%' }}>
    <rect width="130" height="72" fill={dark ? '#111827' : '#F3F4F9'} />
    {/* Simple scooter silhouette */}
    <circle cx="32" cy="50" r="14" fill={dark ? '#374151' : '#D1D5DB'} />
    <circle cx="32" cy="50" r="9" fill={dark ? '#4B5563' : '#E5E7EB'} />
    <circle cx="32" cy="50" r="4" fill={dark ? '#6B7280' : '#9CA3AF'} />
    <circle cx="98" cy="50" r="14" fill={dark ? '#374151' : '#D1D5DB'} />
    <circle cx="98" cy="50" r="9" fill={dark ? '#4B5563' : '#E5E7EB'} />
    <circle cx="98" cy="50" r="4" fill={dark ? '#6B7280' : '#9CA3AF'} />
    <path d="M32 36 L46 18 L84 14 L100 36 Z" fill={dark ? '#2a195c' : '#818CF8'} />
    <path d="M84 14 L102 32 L100 36 L96 36 L82 20 L78 14 Z" fill={dark ? '#3730A3' : '#6366F1'} />
    <rect x="45" y="36" width="54" height="5" fill={dark ? '#374151' : '#9CA3AF'} rx="1" />
    <text x="65" y="67" fontFamily="Arial" fontSize="7" textAnchor="middle" fill={dark ? '#9CA3AF' : '#6B7280'}>{label}</text>
  </svg>
);

const OdometerThumb = () => (
  <svg viewBox="0 0 130 72" fill="none" style={{ width: '100%', height: '100%' }}>
    <rect width="130" height="72" fill="#111827" />
    <circle cx="65" cy="36" r="28" fill="#1F2937" stroke="#374151" strokeWidth="1.5" />
    <circle cx="65" cy="36" r="22" fill="#111827" />
    {/* Speedometer arc */}
    <path d="M43 54 A22 22 0 0 1 65 14 A22 22 0 0 1 87 54" stroke="#374151" strokeWidth="2" fill="none" />
    <path d="M43 54 A22 22 0 0 1 65 14 A22 22 0 0 1 72 16" stroke="#22C55E" strokeWidth="2.5" fill="none" />
    <text x="65" y="40" textAnchor="middle" fontFamily="monospace" fontSize="13" fontWeight="bold" fill="white">000256</text>
    <text x="65" y="50" textAnchor="middle" fontFamily="Arial" fontSize="5.5" fill="#9CA3AF">km</text>
    <text x="65" y="66" textAnchor="middle" fontFamily="Arial" fontSize="6" fill="#6B7280">Odometer Reading</text>
  </svg>
);

const ChassisThumb = () => (
  <svg viewBox="0 0 130 72" fill="none" style={{ width: '100%', height: '100%' }}>
    <rect width="130" height="72" fill="#1F2937" />
    <rect x="15" y="20" width="100" height="32" rx="4" fill="#374151" />
    <rect x="18" y="23" width="94" height="26" rx="3" fill="#4B5563" />
    <text x="65" y="40" textAnchor="middle" fontFamily="monospace" fontSize="9" fontWeight="bold" fill="white" letterSpacing="1">MH3T4EVG9YZ</text>
    <text x="65" y="50" textAnchor="middle" fontFamily="Arial" fontSize="6" fill="#9CA3AF">123456789</text>
    <text x="65" y="64" textAnchor="middle" fontFamily="Arial" fontSize="6" fill="#6B7280">Chassis No.</text>
  </svg>
);

/* ── Scooter thumbnail for right panel ── */
const SmallScooter = () => (
  <svg viewBox="0 0 60 36" fill="none" style={{ width: 34, height: 20 }}>
    <circle cx="10" cy="26" r="9" fill="#374151" />
    <circle cx="10" cy="26" r="6" fill="#6B7280" />
    <circle cx="50" cy="26" r="9" fill="#374151" />
    <circle cx="50" cy="26" r="6" fill="#6B7280" />
    <path d="M10 17 L18 5 L42 3 L52 17 Z" fill="#2a195c" />
    <rect x="20" y="17" width="32" height="3" fill="#374151" rx="1" />
  </svg>
);

const SmallBattery = () => (
  <svg viewBox="0 0 24 36" fill="none" style={{ width: 20, height: 28 }}>
    <rect x="3" y="7" width="18" height="27" rx="3" fill="#1F2937" />
    <rect x="8" y="3" width="8" height="5" rx="2" fill="#374151" />
    <rect x="5" y="11" width="14" height="4" rx="1" fill="#22C55E" />
    <rect x="5" y="17" width="14" height="4" rx="1" fill="#22C55E" />
    <rect x="5" y="23" width="14" height="4" rx="1" fill="#4B5563" />
  </svg>
);

/* ── Document card component ── */
interface DocCardProps { label: string; sub: string; optional?: boolean; thumb: React.ReactNode; }
function DocCard({ label, sub, optional, thumb }: DocCardProps) {
  return (
    <div className="doc-card">
      <div className="doc-card-top">
        <div className="doc-card-icon-row">
          <div className="doc-card-icon"><IFile s={13} /></div>
          <div>
            <div className="doc-card-label">
              {label}{!optional && <span style={{ color: '#EF4444', marginLeft: 2 }}>*</span>}
              {optional && <span style={{ color: '#9CA3AF', fontSize: 9.5, fontWeight: 400, marginLeft: 3 }}>(Optional)</span>}
            </div>
            <div className="doc-card-sub">{sub}</div>
          </div>
        </div>
      </div>
      <div className="doc-preview">{thumb}</div>
      <div className="doc-footer">
        <span className="doc-uploaded"><ICheck s={11} /> Uploaded</span>
        <span className="doc-view">View</span>
        <span className="doc-del"><ITrash s={11} /></span>
      </div>
    </div>
  );
}

/* ── Vehicle card ── */
interface VehCardProps { label: string; thumb: React.ReactNode; }
function VehCard({ label, thumb }: VehCardProps) {
  return (
    <div className="veh-card">
      <div className="veh-card-label">{label}<span className="veh-card-req"> *</span></div>
      <div className="veh-preview">{thumb}</div>
      <div className="veh-footer">
        <span className="doc-uploaded"><ICheck s={11} /> Uploaded</span>
        <span className="doc-view">View</span>
        <span className="doc-del"><ITrash s={11} /></span>
      </div>
    </div>
  );
}

/* ── Right Panel ── */
function RightPanel() {
  const CHECKLIST = [
    { l: 'Aadhaar Card', s: 'Uploaded' },
    { l: 'Driving License', s: 'Uploaded' },
    { l: 'PAN Card', s: 'Uploaded' },
    { l: 'Address Proof', s: 'Uploaded' },
    { l: 'Profile Photo', s: 'Uploaded' },
    { l: 'Vehicle Images', s: 'Complete' },
    { l: 'Terms & Signature', s: 'Completed' },
  ];
  return (
    <div className="nr-rp">
      {/* Rental Summary with thumbnails */}
      <div className="nr-rp-card">
        <div className="nr-rp-hdr">
          <span className="nr-rp-hdr-ic" style={{ color: '#2a195c' }}><IReceipt /></span>
          <div className="nr-rp-title">Rental Summary</div>
        </div>
        <div className="nr-sum-body">
          <div className="nr-sum-row-img">
            <span className="nr-sum-label">Vehicle</span>
            <span className="nr-sum-val">
              Evegah E1
              <span className="nr-sum-thumb"><SmallScooter /></span>
            </span>
          </div>
          <div className="nr-sum-row-img">
            <span className="nr-sum-label">Battery</span>
            <span className="nr-sum-val">
              60V 30Ah
              <span className="nr-sum-thumb"><SmallBattery /></span>
            </span>
          </div>
          {[
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

      {/* Document Checklist */}
      <div className="nr-rp-card">
        <div className="nr-rp-hdr">
          <span className="nr-rp-hdr-ic" style={{ color: '#2a195c' }}><ICheckList /></span>
          <div className="nr-rp-title">Document Checklist</div>
        </div>
        <div className="doc-checklist-body">
          {CHECKLIST.map(c => (
            <div key={c.l} className="doc-cl-row">
              <span className="doc-cl-label">{c.l}</span>
              <span className="doc-cl-status"><ICheck s={11} /> {c.s}</span>
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
          <div className="nr-help-sub">Facing issues uploading documents or have any questions?</div>
          <button className="nr-help-btn">Contact Support</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════ */
export default function DocumentsPage() {
  const [agreed, setAgreed] = useState(true);
  const [sigCleared, setSigCleared] = useState(false);

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

            {/* 2-col outer */}
            <div className="nr-layout">
              <div>
                {/* Main Card */}
                <div className="nr-card">
                  <div className="nr-card-hdr">
                    <div>
                      <h2>Step 4: Documents</h2>
                      <p>Upload rider documents, vehicle images and accept terms &amp; conditions.</p>
                    </div>
                  </div>

                  <div className="doc-sec-body">
                    {/* Info banner */}
                    <div className="doc-banner">
                      <span style={{ display: 'flex', flexShrink: 0 }}><IInfo s={14} /></span>
                      <span>Accepted formats: JPG, PNG, PDF</span>
                      <span className="doc-banner-sep">|</span>
                      <span>Max file size: 5MB per file</span>
                    </div>

                    {/* 1. Rider Documents */}
                    <div className="doc-sec-hd">1. Rider Documents</div>
                    <div className="doc-sec-sub">Upload clear copies of the rider's identification documents.</div>
                    <div className="doc-grid-5" style={{ marginBottom: 28 }}>
                      <DocCard label="Aadhaar Card" sub="Front side" thumb={<AadhaarThumb />} />
                      <DocCard label="Driving License" sub="Valid driving license" thumb={<DLThumb />} />
                      <DocCard label="PAN Card" sub="Upload PAN card" optional thumb={<PANThumb />} />
                      <DocCard label="Address Proof" sub="Any one address proof" thumb={<AddressThumb />} />
                      <DocCard label="Profile Photo" sub="Recent passport size photo" thumb={<ProfileThumb />} />
                    </div>

                    {/* 2. Vehicle Images */}
                    <div className="doc-sec-hd">2. Vehicle Images</div>
                    <div className="doc-sec-sub">Upload clear photos of the vehicle from all required angles.</div>
                    <div className="doc-grid-6" style={{ marginBottom: 28 }}>
                      <VehCard label="Front View" thumb={<VehicleThumb label="Front" />} />
                      <VehCard label="Rear View" thumb={<VehicleThumb label="Rear" dark />} />
                      <VehCard label="Left Side View" thumb={<VehicleThumb label="Left" />} />
                      <VehCard label="Right Side View" thumb={<VehicleThumb label="Right" dark />} />
                      <VehCard label="Odometer View" thumb={<OdometerThumb />} />
                      <VehCard label="Chassis Number" thumb={<ChassisThumb />} />
                    </div>

                    {/* 3. Terms & Signature */}
                    <div className="doc-sec-hd">3. Rider Terms &amp; Conditions</div>
                    <div className="doc-terms-grid">
                      {/* Left */}
                      <div>
                        <div className="doc-cb-row" onClick={() => setAgreed(!agreed)}>
                          <div className="doc-cb" style={{ background: agreed ? '#2a195c' : '#fff', borderColor: agreed ? '#2a195c' : '#D1D5DB' }}>
                            {agreed && <ICheck s={11} />}
                          </div>
                          <span className="doc-cb-label">
                            I have read, understood and agree to the{' '}
                            <span style={{ color: '#2a195c', fontWeight: 600 }}>Rider Terms &amp; Conditions.</span>
                          </span>
                        </div>
                        <button className="doc-terms-link">
                          View Terms &amp; Conditions <IExt />
                        </button>
                        {agreed && (
                          <div className="doc-confirm-banner">
                            <span style={{ display: 'flex', flexShrink: 0, marginTop: 1, color: '#16A34A' }}><ICheck s={14} /></span>
                            By signing above, I confirm that all the information provided is true and correct. Any false information may lead to registration cancellation.
                          </div>
                        )}
                      </div>

                      {/* Right — Signature */}
                      <div>
                        <div className="doc-sig-label">Rider Signature<span className="req"> *</span></div>
                        <div className="doc-sig-pad">
                          {!sigCleared && (
                            <span className="doc-sig-text">Akash Verma</span>
                          )}
                          <div className="doc-sig-line" />
                        </div>
                        <button className="doc-sig-clear" onClick={() => setSigCleared(!sigCleared)}>
                          <IPen /> {sigCleared ? 'Sign' : 'Clear'}
                        </button>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Footer */}
                <div className="nr-footer-actions">
                  <Link href="/new-rider/payment" className="nr-prev-btn"><ILeft /> Previous</Link>
                  <Link href="/new-rider/review" className="nr-continue-btn">
                    Continue to Review &amp; Confirm <IArr s={12} />
                  </Link>
                </div>
              </div>

              {/* Right Panel */}
              <RightPanel />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
