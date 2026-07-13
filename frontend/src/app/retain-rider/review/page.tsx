'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

/* ──────────────────────────────────────────────────────────────
   STEP 5 · RETAIN RIDER - REVIEW & CONFIRM
   ────────────────────────────────────────────────────────────── */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Dancing+Script:wght@700&display=swap');

/* ── shell & layout ── */
.nr-shell { display: flex; min-height: 100vh; background: #fff; font-family: Inter, sans-serif; }
.nr-main  { margin-left: 230px; display: flex; flex-direction: column; min-height: 100vh; flex: 1; min-width: 0; background: #fff; }
.nr-page  { flex: 1; padding: 20px 22px 70px; background-color: #FFF;}

/* ── breadcrumb ── */
.nr-bc { display: flex; align-items: center; gap: 7px; padding: 14px 0 0; font-size: 12px; color: #9CA3AF; }
.nr-bc a { color: #9CA3AF; display: flex; align-items: center; gap: 4px; text-decoration: none; transition: color .15s; }
.nr-bc a:hover { color: #2A195C; }
.nr-bc-sep { color: #D1D5DB; }
.nr-bc-cur { color: #2A195C; font-weight: 600; }

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
.nr-back-btn:hover { border-color: #2A195C; color: #2A195C; }

/* ── stepper ── */
.nr-stepper {
  display: flex; align-items: center;
  background: #fff; border: 1px solid #E5E7EB; border-radius: 14px;
  padding: 18px 24px; margin-bottom: 22px; box-shadow: 0 1px 4px rgba(0,0,0,.05);
}
.nr-step-wrap  { display: flex; align-items: center; flex: 1; }
.nr-step       { display: flex; align-items: center; gap: 10px; }
.nr-step-num   { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; flex-shrink: 0; }
.nr-step-num.active { background: #2A195C; color: #fff; }
.nr-step-num.done   { background: #22C55E; color: #fff; }
.nr-step-num.pend   { background: #fff; color: #9CA3AF; border: 2px solid #E5E7EB; }
.nr-step-label      { font-size: 13px; font-weight: 600; color: #111827; white-space: nowrap; }
.nr-step-label.pend { color: #9CA3AF; font-weight: 500; }
.nr-step-stat       { font-size: 11.5px; margin-top: 2px; white-space: nowrap; }
.nr-step-stat.done-s   { color: #22C55E; }
.nr-step-stat.active-s { color: #2A195C; }
.nr-step-stat.pend-s   { color: #9CA3AF; }
.nr-step-line { flex: 1; height: 2px; background: #E5E7EB; margin: 0 14px; min-width: 16px; }
.nr-step-line.done-l { background: #22C55E; }

/* ── outer 2-col layout ── */
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
.nr-prev-btn:hover { border-color: #2A195C; color: #2A195C; }
.nr-continue-btn {
  display: flex; align-items: center; gap: 8px;
  padding: 11px 28px; background: #2A195C; border: none;
  border-radius: 10px; font-size: 13px; font-weight: 700; color: #fff;
  cursor: pointer; font-family: inherit; transition: background .15s;
  text-decoration: none;
  box-shadow: 0 2px 8px rgba(79,70,229,.3);
}
.nr-continue-btn:hover { background: #4338CA; }

/* ─── RIGHT PANEL ─── */
.nr-rp { display: flex; flex-direction: column; gap: 16px; position: sticky; top: 80px; }
.nr-rp-card { background: #fff; border: 1px solid #E5E7EB; border-radius: 14px; box-shadow: 0 1px 4px rgba(0,0,0,.06); overflow: hidden; }
.nr-rp-hdr  { display: flex; align-items: center; gap: 9px; padding: 14px 18px; border-bottom: 1px solid #E5E7EB; }
.nr-rp-hdr-ic { display: flex; align-items: center; flex-shrink: 0; color: #2A195C; }
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
.nr-sum-total-r { font-size: 18px; font-weight: 800; color: #2A195C; }

/* checklist */
.doc-checklist-body { padding: 6px 0 10px; }
.doc-cl-row { display: flex; align-items: center; justify-content: space-between; padding: 7px 18px; font-size: 12.5px; }
.doc-cl-label { color: #374151; }
.doc-cl-status { display: flex; align-items: center; gap: 5px; color: #16A34A; font-weight: 600; font-size: 11.5px; }

.nr-help-body { padding: 14px 18px 16px; }
.nr-help-sub  { font-size: 13px; color: #6B7280; margin-bottom: 12px; line-height: 1.5; }
.nr-help-btn  { width: 100%; padding: 10px; background: #2A195C; color: #fff; border-radius: 9px; font-size: 13px; font-weight: 600; cursor: pointer; border: none; font-family: inherit; transition: background .15s; }
.nr-help-btn:hover { background: #4338CA; }

/* ─── REVIEW-SPECIFIC ─── */
.rv-top3 { display: grid; grid-template-columns: 1.2fr 1fr 1fr; }
.rv-sec { padding: 20px 22px; }
.rv-sec:not(:last-child) { border-right: 1px solid #F3F4F6; }
.rv-sec-hdr { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.rv-sec-title { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 700; color: #111827; }
.rv-edit-btn { color: #2A195C; font-size: 12px; font-weight: 600; cursor: pointer; border: none; background: none; display: flex; align-items: center; gap: 4px; font-family: inherit; }
.rv-row { display: flex; align-items: flex-start; justify-content: space-between; padding: 7px 0; border-bottom: 1px solid #F9FAFB; font-size: 12.5px; }
.rv-row-l { color: #6B7280; }
.rv-row-v { font-weight: 600; color: #111827; text-align: right; }
.rv-divider { height: 1px; background: #F3F4F6; }
.rv-total-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 0 0; margin-top: 6px; border-top: 1.5px solid #E5E7EB; }
.rv-total-l { font-size: 13px; font-weight: 800; color: #111827; }
.rv-total-v { font-size: 20px; font-weight: 800; color: #2A195C; }
.rv-vb-inner { display: grid; grid-template-columns: 1fr 170px; gap: 24px; }
.rv-veh-thumbs { display: grid; grid-template-columns: repeat(6, 1fr); gap: 8px; margin-top: 10px; }
.rv-thumb { border-radius: 8px; overflow: hidden; height: 60px; border: 1px solid #E5E7EB; }
.rv-thumb-lbl { font-size: 10px; color: #9CA3AF; text-align: center; margin-top: 4px; }
.rv-bat-name { font-size: 13.5px; font-weight: 800; color: #111827; margin-bottom: 8px; margin-top: 8px; }
.rv-doc-row { display: flex; align-items: center; gap: 8px; padding: 5.5px 0; font-size: 12.5px; }
.rv-confirm-banner { display: flex; align-items: flex-start; gap: 10px; background: #F0FDF4; border-top: 1px solid #BBF7D0; padding: 14px 22px; font-size: 13px; color: #15803D; line-height: 1.5; }
.rv-sig-pad { width: 100%; height: 90px; background: #fff; border: 1.5px solid #E5E7EB; border-radius: 10px; display: flex; align-items: center; justify-content: center; overflow: hidden; position: relative; }
.rv-sig-text { font-family: 'Dancing Script', cursive; font-size: 34px; font-weight: 700; color: #1E1B4B; opacity: 0.88; }
.rv-sig-line { position: absolute; bottom: 18px; left: 16px; right: 16px; height: 1px; background: #E5E7EB; }
.rv-footer-note { font-size: 11.5px; color: #9CA3AF; text-align: right; margin-top: 5px; }
.rv-bottom-2col { display: grid; grid-template-columns: 1fr 1fr; }

/* Modal styles */
.success-modal-overlay {
  position: fixed; inset: 0; background: rgba(0, 0, 0, 0.4);
  display: flex; align-items: center; justify-content: center; z-index: 1000;
  backdrop-filter: blur(4px);
}
.success-modal {
  background: #fff; border-radius: 16px; padding: 30px; width: 100%; max-width: 420px;
  text-align: center; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);
  animation: modalScale 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}
@keyframes modalScale {
  0% { transform: scale(0.9); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
.success-modal-ic {
  width: 56px; height: 56px; border-radius: 50%; background: #DCFCE7;
  color: #16A34A; display: flex; align-items: center; justify-content: center;
  margin: 0 auto 16px; font-size: 28px;
}
.success-modal-title { font-size: 18px; font-weight: 800; color: #111827; margin-bottom: 8px; }
.success-modal-sub { font-size: 13px; color: #6B7280; line-height: 1.5; margin-bottom: 24px; }
.success-modal-btn {
  width: 100%; padding: 12px; background: #2A195C; color: #fff; border: none;
  border-radius: 10px; font-size: 13.5px; font-weight: 700; cursor: pointer;
  box-shadow: 0 4px 12px rgba(79,70,229,0.3); transition: background .15s;
}
.success-modal-btn:hover { background: #4338CA; }
`;

/* ── SVG Helpers ── */
const strokeBase = { fill: 'none', stroke: 'currentColor', strokeWidth: 2 as number, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
const SV = ({ s = 14, children, ...p }: { s?: number; children: React.ReactNode } & React.SVGProps<SVGSVGElement>) => (
  <svg width={s} height={s} viewBox="0 0 24 24" {...strokeBase} {...p}>{children}</svg>
);

const ILeft = () => <SV s={13}><polyline points="15 18 9 12 15 6" /></SV>;
const ICheck = ({ s = 13 }: { s?: number }) => <SV s={s}><polyline points="20 6 9 17 4 12" /></SV>;
const IHead = () => <SV s={15}><path d="M3 18v-6a9 9 0 0 1 18 0v6" /><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" /></SV>;
const IArr = ({ s = 12 }: { s?: number }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>;
const IReceipt = ({ s = 14 }: { s?: number }) => <SV s={s}><path d="M14 2H6a2 2 0 0 0-2 2v16l3-2 2 2 2-2 2 2 2-2 3 2V4a2 2 0 0 0-2-2z" /><line x1="8" y1="9" x2="16" y2="9" /><line x1="8" y1="13" x2="12" y2="13" /></SV>;
const IFile = ({ s = 14 }: { s?: number }) => <SV s={s}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></SV>;
const IUser = ({ s = 14 }: { s?: number }) => <SV s={s}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></SV>;
const IClipboard = ({ s = 14 }: { s?: number }) => <SV s={s}><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" ry="1" /></SV>;
const IShield = ({ s = 14 }: { s?: number }) => <SV s={s}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></SV>;
const ICheckList = () => <SV s={14}><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></SV>;
const IPen = () => <SV s={13}><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" /></SV>;
const IExt = () => <SV s={12}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></SV>;

/* ── Stepper ── */
const STEPS = [
  { n: 1, label: 'Rider Search', stat: 'Completed', state: 'done' },
  { n: 2, label: 'Rental Details', stat: 'Completed', state: 'done' },
  { n: 3, label: 'Payment & Charges', stat: 'Completed', state: 'done' },
  { n: 4, label: 'Documents', stat: 'Completed', state: 'done' },
  { n: 5, label: 'Review & Confirm', stat: 'In Progress', state: 'active' },
];

/* ── Vehicle thumbnails ── */
const VehicleThumb = ({ label, dark = false }: { label: string; dark?: boolean }) => (
  <svg viewBox="0 0 130 72" fill="none" style={{ width: '100%', height: '100%' }}>
    <rect width="130" height="72" fill={dark ? '#111827' : '#F3F4F9'} />
    <circle cx="32" cy="50" r="14" fill={dark ? '#374151' : '#D1D5DB'} />
    <circle cx="32" cy="50" r="9" fill={dark ? '#4B5563' : '#E5E7EB'} />
    <circle cx="32" cy="50" r="4" fill={dark ? '#6B7280' : '#9CA3AF'} />
    <circle cx="98" cy="50" r="14" fill={dark ? '#374151' : '#D1D5DB'} />
    <circle cx="98" cy="50" r="9" fill={dark ? '#4B5563' : '#E5E7EB'} />
    <circle cx="98" cy="50" r="4" fill={dark ? '#6B7280' : '#9CA3AF'} />
    <path d="M32 36 L46 18 L84 14 L100 36 Z" fill={dark ? '#2A195C' : '#818CF8'} />
    <path d="M84 14 L102 32 L100 36 L96 36 L82 20 L78 14 Z" fill={dark ? '#4338ca' : '#6366F1'} />
    <rect x="45" y="36" width="54" height="5" fill={dark ? '#374151' : '#9CA3AF'} rx="1" />
    <text x="65" y="67" fontFamily="Arial" fontSize="7" textAnchor="middle" fill={dark ? '#9CA3AF' : '#6B7280'}>{label}</text>
  </svg>
);

const OdometerThumb = () => (
  <svg viewBox="0 0 130 72" fill="none" style={{ width: '100%', height: '100%' }}>
    <rect width="130" height="72" fill="#111827" />
    <circle cx="65" cy="36" r="28" fill="#1F2937" stroke="#374151" strokeWidth="1.5" />
    <circle cx="65" cy="36" r="22" fill="#111827" />
    <path d="M43 54 A22 22 0 0 1 65 14 A22 22 0 0 1 87 54" stroke="#374151" strokeWidth="2" fill="none" />
    <path d="M43 54 A22 22 0 0 1 65 14 A22 22 0 0 1 72 16" stroke="#22C55E" strokeWidth="2.5" fill="none" />
    <text x="65" y="40" textAnchor="middle" fontFamily="monospace" fontSize="13" fontWeight="bold" fill="white">012480</text>
    <text x="65" y="50" textAnchor="middle" fontFamily="Arial" fontSize="5.5" fill="#9CA3AF">km</text>
    <text x="65" y="66" textAnchor="middle" fontFamily="Arial" fontSize="6" fill="#6B7280">Odometer Reading</text>
  </svg>
);

const ChassisThumb = () => (
  <svg viewBox="0 0 130 72" fill="none" style={{ width: '100%', height: '100%' }}>
    <rect width="130" height="72" fill="#1F2937" />
    <rect x="15" y="20" width="100" height="32" rx="4" fill="#374151" />
    <rect x="18" y="23" width="94" height="26" rx="3" fill="#4B5563" />
    <text x="65" y="40" textAnchor="middle" fontFamily="monospace" fontSize="9" fontWeight="bold" fill="white" letterSpacing="1">M5G4R8E10V4</text>
    <text x="65" y="50" textAnchor="middle" fontFamily="Arial" fontSize="6" fill="#9CA3AF">789012345</text>
    <text x="65" y="64" textAnchor="middle" fontFamily="Arial" fontSize="6" fill="#6B7280">Chassis No.</text>
  </svg>
);

const SmallScooter = () => (
  <svg viewBox="0 0 60 36" fill="none" style={{ width: 34, height: 20 }}>
    <circle cx="10" cy="26" r="9" fill="#374151" />
    <circle cx="10" cy="26" r="6" fill="#6B7280" />
    <circle cx="50" cy="26" r="9" fill="#374151" />
    <circle cx="50" cy="26" r="6" fill="#6B7280" />
    <path d="M10 17 L18 5 L42 3 L52 17 Z" fill="#2A195C" />
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

const BatterySVG = () => (
  <svg viewBox="0 0 60 100" fill="none" style={{ width: 48, height: 80 }}>
    <rect x="18" y="0" width="24" height="12" rx="5" fill="#374151" />
    <rect x="4" y="10" width="52" height="88" rx="8" fill="#1F2937" />
    <rect x="4" y="10" width="52" height="88" rx="8" stroke="#374151" strokeWidth="1.5" />
    <rect x="10" y="18" width="40" height="14" rx="3" fill="#22C55E" />
    <rect x="10" y="36" width="40" height="14" rx="3" fill="#22C55E" />
    <rect x="10" y="54" width="40" height="14" rx="3" fill="#22C55E" />
    <rect x="10" y="72" width="40" height="14" rx="3" fill="#4B5563" />
    <text x="30" y="28" textAnchor="middle" fontFamily="monospace" fontSize="8" fontWeight="bold" fill="white">100%</text>
  </svg>
);

/* ── Right Panel ── */
function RightPanel() {
  const CHECKLIST = [
    { l: 'Aadhaar Card', s: 'Verified (File)' },
    { l: 'Driving License', s: 'Verified (File)' },
    { l: 'PAN Card', s: 'Verified (File)' },
    { l: 'Address Proof', s: 'Verified (File)' },
    { l: 'Profile Photo', s: 'Verified (File)' },
    { l: 'Vehicle Images', s: 'Complete (6)' },
    { l: 'Terms & Signature', s: 'Completed' },
  ];
  return (
    <div className="nr-rp">
      {/* Rental Summary */}
      <div className="nr-rp-card">
        <div className="nr-rp-hdr">
          <span className="nr-rp-hdr-ic"><IReceipt /></span>
          <div className="nr-rp-title">Ride Summary</div>
        </div>
        <div className="nr-sum-body">
          <div className="nr-sum-row-img">
            <span className="nr-sum-label">Vehicle</span>
            <span className="nr-sum-val">
              Ola S1 Pro
              <span className="nr-sum-thumb"><SmallScooter /></span>
            </span>
          </div>
          <div className="nr-sum-row-img">
            <span className="nr-sum-label">Battery</span>
            <span className="nr-sum-val">
              BAT-0098 (60V 30Ah)
              <span className="nr-sum-thumb"><SmallBattery /></span>
            </span>
          </div>
          {[
            { l: 'Rental Plan', v: 'Monthly' },
            { l: 'Expected Duration', v: '1 Month' },
            { l: 'GST (18%)', v: '₹171.00' },
            { l: 'Deposit Applied', v: '-₹500.00' }
          ].map(r => (
            <div key={r.l} className="nr-sum-row">
              <span className="nr-sum-label">{r.l}</span>
              <span className="nr-sum-val" style={{ color: r.l === 'Deposit Applied' ? '#22C55E' : undefined }}>{r.v}</span>
            </div>
          ))}
          <div className="nr-sum-divider" />
          <div className="nr-sum-total">
            <span className="nr-sum-total-l">Final Payable</span>
            <span className="nr-sum-total-r">₹621.00</span>
          </div>
        </div>
      </div>

      {/* Document Checklist */}
      <div className="nr-rp-card">
        <div className="nr-rp-hdr">
          <span className="nr-rp-hdr-ic"><ICheckList /></span>
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
          <span className="nr-rp-hdr-ic"><IHead /></span>
          <div className="nr-rp-title">Need Help?</div>
        </div>
        <div className="nr-help-body">
          <div className="nr-help-sub">Facing issues with review &amp; confirmation?</div>
          <button className="nr-help-btn">Contact Support</button>
        </div>
      </div>
    </div>
  );
}

export default function RetainRiderReviewPage() {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const handleConfirmSubmit = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    router.push('/');
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="nr-shell">
        <Sidebar activePath="/retain-rider" />
        <div className="nr-main">
          <TopBar title="Retain Rider - Review & Confirm" subtitle="Review the rider, rental, and payment details before confirming" />
          <div className="nr-page">

            {/* Breadcrumb */}
            <div className="nr-bc">
              <Link href="/"><ILeft /> Home</Link>
              <span className="nr-bc-sep">›</span>
              <a href="#">Rides / Rentals</a>
              <span className="nr-bc-sep">›</span>
              <span className="nr-bc-cur">Retain Ride Registration</span>
            </div>

            {/* Title */}
            <div className="nr-title-row">
              <div>
                <h1 className="nr-h1">Retain Ride Registration</h1>
                <p className="nr-sub">Review all details before confirming the registration</p>
              </div>
              <button className="nr-back-btn" onClick={() => router.push('/')}><ILeft /> Back to Rides</button>
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
                      <h2>Step 5: Review &amp; Confirm</h2>
                      <p>Review all rider and rental details before confirming the registration.</p>
                    </div>
                  </div>

                  {/* ── Section Row 1: Rider / Rental / Payment ── */}
                  <div className="rv-top3">
                    {/* 1. Rider Details */}
                    <div className="rv-sec">
                      <div className="rv-sec-hdr">
                        <div className="rv-sec-title">
                          <span style={{ color: '#2A195C', display: 'flex' }}><IUser s={15} /></span>
                          Rider Details
                        </div>
                        <Link href="/retain-rider" className="rv-edit-btn" style={{ textDecoration: 'none' }}><IPen /> Edit</Link>
                      </div>
                      {[
                        { l: 'Name', v: 'Akash Verma' },
                        { l: 'Mobile Number', v: '+91 98765 43210' },
                        { l: 'Rider ID', v: 'RDR00124' },
                        { l: 'Last Ride', v: '18 May 2024' },
                        { l: 'KYC Status', v: 'Verified (On File)' },
                        { l: 'Verified on', v: '12 Mar 2024' },
                      ].map(r => (
                        <div key={r.l} className="rv-row">
                          <span className="rv-row-l">{r.l}</span>
                          <span className="rv-row-v" style={{ color: r.l === 'KYC Status' ? '#16A34A' : undefined }}>{r.v}</span>
                        </div>
                      ))}
                    </div>

                    {/* 2. Rental Details */}
                    <div className="rv-sec">
                      <div className="rv-sec-hdr">
                        <div className="rv-sec-title">
                          <span style={{ color: '#2A195C', display: 'flex' }}><IClipboard s={15} /></span>
                          Rental Details
                        </div>
                        <Link href="/retain-rider/rental" className="rv-edit-btn" style={{ textDecoration: 'none' }}><IPen /> Edit</Link>
                      </div>
                      {[
                        { l: 'Vehicle', v: 'Ola S1 Pro (EVM1024012)' },
                        { l: 'Battery', v: 'BAT-0098 (60V 30Ah)' },
                        { l: 'Plan', v: 'Monthly' },
                        { l: 'Expected Duration', v: '1 Month' },
                        { l: 'Expected Return', v: '20 Jun 2024, 10:00 AM' },
                        { l: 'Purpose of Ride', v: 'Personal Use' },
                      ].map(r => (
                        <div key={r.l} className="rv-row">
                          <span className="rv-row-l">{r.l}</span>
                          <span className="rv-row-v">{r.v}</span>
                        </div>
                      ))}
                    </div>

                    {/* 3. Payment Summary */}
                    <div className="rv-sec">
                      <div className="rv-sec-hdr">
                        <div className="rv-sec-title">
                          <span style={{ color: '#2A195C', display: 'flex' }}><IReceipt s={15} /></span>
                          Payment Summary
                        </div>
                        <Link href="/retain-rider/payment" className="rv-edit-btn" style={{ textDecoration: 'none' }}><IPen /> Edit</Link>
                      </div>
                      {[
                        { l: 'Vehicle Rent (Monthly)', v: '₹600.00' },
                        { l: 'Battery Rent (Monthly)', v: '₹300.00' },
                        { l: 'Accessories', v: '₹50.00' },
                        { l: 'Taxes (18% GST)', v: '₹171.00' },
                        { l: 'Deposit Applied', v: '-₹500.00' }
                      ].map(r => (
                        <div key={r.l} className="rv-row">
                          <span className="rv-row-l">{r.l}</span>
                          <span className="rv-row-v" style={{ color: r.l === 'Deposit Applied' ? '#22C55E' : undefined }}>{r.v}</span>
                        </div>
                      ))}
                      <div className="rv-total-row">
                        <span className="rv-total-l">Final Payable</span>
                        <span className="rv-total-v">₹621.00</span>
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="rv-divider" />

                  {/* ── Section Row 2: Vehicle & Battery ── */}
                  <div className="rv-sec">
                    <div className="rv-sec-hdr">
                      <div className="rv-sec-title">
                        <span style={{ color: '#2A195C', display: 'flex' }}><IShield s={15} /></span>
                        Vehicle &amp; Battery
                      </div>
                      <Link href="/retain-rider/rental" className="rv-edit-btn" style={{ textDecoration: 'none' }}><IPen /> Edit</Link>
                    </div>
                    <div className="rv-vb-inner">
                      {/* Left: Vehicle Images */}
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', marginBottom: 2 }}>Vehicle Images</div>
                        <div className="rv-veh-thumbs">
                          {[
                            { label: 'Front View', dark: false },
                            { label: 'Rear View', dark: true },
                            { label: 'Left Side', dark: false },
                            { label: 'Right Side', dark: true },
                            { label: 'Odometer', dark: false, odo: true },
                            { label: 'Chassis No.', dark: false, chassis: true },
                          ].map(t => (
                            <div key={t.label}>
                              <div className="rv-thumb">
                                {t.odo
                                  ? <OdometerThumb />
                                  : t.chassis
                                    ? <ChassisThumb />
                                    : <VehicleThumb label="" dark={t.dark} />
                                }
                              </div>
                              <div className="rv-thumb-lbl">{t.label}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                      {/* Right: Battery */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', paddingLeft: 8, borderLeft: '1px solid #F3F4F6' }}>
                        <BatterySVG />
                        <div className="rv-bat-name">BAT-0098</div>
                        {[
                          { l: 'Type', v: 'Li-ion' },
                          { l: 'Capacity', v: '60V / 30Ah' },
                          { l: 'Status', v: 'Available' },
                        ].map(r => (
                          <div key={r.l} className="rv-row" style={{ width: '100%' }}>
                            <span className="rv-row-l">{r.l}</span>
                            <span className="rv-row-v" style={{ color: r.l === 'Status' ? '#16A34A' : undefined }}>{r.v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="rv-divider" />

                  {/* ── Section Row 3: Documents + Terms ── */}
                  <div className="rv-bottom-2col">
                    {/* 1. Documents Summary */}
                    <div className="rv-sec" style={{ borderRight: '1px solid #F3F4F6' }}>
                      <div className="rv-sec-hdr">
                        <div className="rv-sec-title">
                          <span style={{ color: '#2A195C', display: 'flex' }}><IFile s={15} /></span>
                          Documents Summary
                        </div>
                        <Link href="/retain-rider/documents" className="rv-edit-btn" style={{ textDecoration: 'none' }}><IPen /> Edit</Link>
                      </div>
                      {[
                        { l: 'Aadhaar Card', v: 'Verified (File)' },
                        { l: 'Driving License', v: 'Verified (File)' },
                        { l: 'PAN Card', v: 'Verified (File)' },
                        { l: 'Address Proof', v: 'Verified (File)' },
                        { l: 'Profile Photo', v: 'Verified (File)' },
                        { l: 'Vehicle Images', v: 'Uploaded (6)' },
                        { l: 'Terms & Signature', v: 'Signed' },
                      ].map(r => (
                        <div key={r.l} className="rv-doc-row">
                          <span style={{ display: 'flex', color: '#16A34A', flexShrink: 0 }}><ICheck s={13} /></span>
                          <span style={{ flex: 1, color: '#374151' }}>{r.l}</span>
                          <span style={{ color: '#16A34A', fontWeight: 600, fontSize: 11.5 }}>{r.v}</span>
                        </div>
                      ))}
                    </div>

                    {/* 2. Terms & Conditions */}
                    <div className="rv-sec">
                      <div className="rv-sec-hdr">
                        <div className="rv-sec-title">
                          <span style={{ color: '#2A195C', display: 'flex' }}><IShield s={15} /></span>
                          Terms &amp; Conditions
                        </div>
                        <Link href="/retain-rider/documents" className="rv-edit-btn" style={{ textDecoration: 'none' }}><IPen /> Edit</Link>
                      </div>
                      {/* Checkbox row */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
                        <div style={{
                          width: 18, height: 18, borderRadius: 5, border: '2px solid #2A195C',
                          background: '#2A195C', display: 'flex', alignItems: 'center',
                          justifyContent: 'center', flexShrink: 0, marginTop: 1
                        }}>
                          <ICheck s={11} />
                        </div>
                        <span style={{ fontSize: 13, color: '#374151', lineHeight: 1.5 }}>
                          I have read, understood and agree to the{' '}
                          <span style={{ color: '#2A195C', fontWeight: 600 }}>Rider Terms &amp; Conditions.</span>
                        </span>
                      </div>
                      <button style={{
                        display: 'inline-flex', alignItems: 'center', gap: 5,
                        fontSize: 13, fontWeight: 600, color: '#2A195C',
                        cursor: 'pointer', border: 'none', background: 'none',
                        fontFamily: 'inherit', padding: 0, marginBottom: 14
                      }}>
                        View Terms &amp; Conditions <IExt />
                      </button>
                      {/* Signature */}
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
                        Rider Signature <span style={{ color: '#EF4444' }}>*</span>
                      </div>
                      <div className="rv-sig-pad">
                        <span className="rv-sig-text">Akash Verma</span>
                        <div className="rv-sig-line" />
                      </div>
                    </div>
                  </div>

                  {/* Confirmation Banner */}
                  <div className="rv-confirm-banner">
                    <span style={{ display: 'flex', flexShrink: 0, marginTop: 1, color: '#16A34A' }}>
                      <ICheck s={16} />
                    </span>
                    By clicking &quot;Confirm &amp; Submit&quot;, I confirm that all the information provided is true and correct.
                  </div>
                </div>

                {/* Footer */}
                <div className="nr-footer-actions">
                  <Link href="/retain-rider/documents" className="nr-prev-btn" style={{ textDecoration: 'none' }}><ILeft /> Previous</Link>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <button className="nr-continue-btn" onClick={handleConfirmSubmit}>
                      Confirm &amp; Submit <IArr s={12} />
                    </button>
                    <div className="rv-footer-note">You will not be able to edit after submission.</div>
                  </div>
                </div>
              </div>

              {/* Right Panel */}
              <RightPanel />
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showModal && (
        <div className="success-modal-overlay">
          <div className="success-modal">
            <div className="success-modal-ic">
              <ICheck s={28} />
            </div>
            <h3 className="success-modal-title">Registration Confirmed</h3>
            <p className="success-modal-sub">
              Rider registration and retain request for Akash Verma has been successfully confirmed.
              The new ride ID is <strong>RID20240521008</strong>.
            </p>
            <button className="success-modal-btn" onClick={handleCloseModal}>
              Go to Dashboard
            </button>
          </div>
        </div>
      )}
    </>
  );
}
