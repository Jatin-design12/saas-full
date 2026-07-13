'use client';
import { useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

/* ──────────────────────────────────────────────────────────────
   NEW RIDE REGISTRATION  ·  Full-width structure
   ────────────────────────────────────────────────────────────── */

const CSS = `
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
.nr-h1 { font-size: 24px; font-weight: 800; color: #111827; line-height: 1.2; margin: 0; }
.nr-sub { font-size: 13px; color: #6B7280; margin-top: 4px; }
.nr-back-btn {
  display: flex; align-items: center; gap: 7px;
  padding: 10px 20px; background: #fff; border: 1.5px solid #E5E7EB;
  border-radius: 10px; font-size: 13px; font-weight: 600; color: #374151;
  cursor: pointer; white-space: nowrap; font-family: inherit;
  box-shadow: 0 1px 3px rgba(0,0,0,.06); transition: border-color .15s, color .15s;
  flex-shrink: 0;
}
.nr-back-btn:hover { border-color: #2a195c; color: #2a195c; }

/* ── stepper ── */
.nr-stepper {
  display: flex; align-items: center;
  background: #fff; border: 1px solid #E5E7EB; border-radius: 14px;
  padding: 18px 24px; margin-bottom: 22px;
  box-shadow: 0 1px 4px rgba(0,0,0,.05);
}
.nr-step-wrap { display: flex; align-items: center; flex: 1; }
.nr-step { display: flex; align-items: center; gap: 10px; }
.nr-step-num {
  width: 32px; height: 32px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 700; flex-shrink: 0;
}
.nr-step-num.active { background: #2a195c; color: #fff; }
.nr-step-num.done   { background: #22C55E; color: #fff; }
.nr-step-num.pend   { background: #fff; color: #9CA3AF; border: 2px solid #E5E7EB; }
.nr-step-label { font-size: 13px; font-weight: 600; color: #111827; white-space: nowrap; }
.nr-step-label.pend { color: #9CA3AF; font-weight: 500; }
.nr-step-stat { font-size: 11.5px; margin-top: 2px; white-space: nowrap; }
.nr-step-stat.active-s { color: #2a195c; }
.nr-step-stat.pend-s   { color: #9CA3AF; }
.nr-step-line { flex: 1; height: 2px; background: #E5E7EB; margin: 0 14px; min-width: 16px; }

/* ── 2-col layout ── */
.nr-layout { display: grid; grid-template-columns: 1fr 296px; gap: 20px; align-items: start; }

/* ─────────────── LEFT COLUMN ─────────────── */

.nr-card {
  background: #fff; border: 1px solid #E5E7EB; border-radius: 14px;
  box-shadow: 0 1px 4px rgba(0,0,0,.06); overflow: hidden; margin-bottom: 16px;
}

/* step card header */
.nr-card-hdr {
  display: flex; align-items: flex-start; justify-content: space-between;
  gap: 16px; padding: 20px 24px 18px; border-bottom: 1px solid #F3F4F6;
}
.nr-card-hdr h2 { font-size: 18px; font-weight: 700; color: #111827; margin: 0 0 4px; }
.nr-card-hdr p  { font-size: 13px; color: #6B7280; margin: 0; }
.nr-pow-row { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
.nr-pow-lbl { font-size: 11px; color: #9CA3AF; white-space: nowrap; }
.nr-digi-brand { display: flex; align-items: center; gap: 5px; }
.nr-digi-name  { font-size: 13.5px; font-weight: 800; color: #1B4FBB; }
.nr-verified-tag { display: inline-flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 600; color: #16A34A; background: #DCFCE7; border: 1px solid #BBF7D0; border-radius: 7px; padding: 4px 12px; white-space: nowrap; }
.nr-manual-tag  { display: inline-flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 600; color: #D97706; background: #FEF3C7; border: 1px solid #FDE68A; border-radius: 7px; padding: 4px 12px; white-space: nowrap; }

/* green recommendation banner */
.nr-green-banner {
  display: flex; align-items: flex-start; gap: 12px;
  background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 10px;
  padding: 14px 18px; margin: 18px 24px 0;
}
.nr-green-ic { width: 22px; height: 22px; background: #22C55E; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; }
.nr-green-t  { font-size: 13.5px; font-weight: 700; color: #15803D; margin-bottom: 3px; }
.nr-green-s  { font-size: 12.5px; color: #16A34A; }

/* method cards grid */
.nr-methods { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; padding: 18px 24px; }
.nr-mc {
  border: 2px solid #E5E7EB; border-radius: 12px; padding: 20px;
  cursor: pointer; transition: border-color .15s, background .15s;
  display: flex; flex-direction: column; min-height: 280px;
}
.nr-mc.sel  { border-color: #2a195c; background: #FAFAFF; }
.nr-mc:hover:not(.sel) { border-color: #C7D2FE; background: #FEFEFF; }
.nr-mc-top  { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; flex-wrap: wrap; }
.nr-radio   { width: 20px; height: 20px; border-radius: 50%; border: 2px solid #D1D5DB; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all .15s; }
.nr-radio.on { border-color: #2a195c; background: #2a195c; }
.nr-radio-dot { width: 8px; height: 8px; border-radius: 50%; background: #fff; }
.nr-mc-title { font-size: 14px; font-weight: 700; color: #111827; }
.nr-rec-badge { background: #EEF2FF; color: #2a195c; border-radius: 5px; font-size: 11px; font-weight: 700; padding: 2px 9px; white-space: nowrap; }
.nr-mc-desc  { font-size: 12.5px; color: #6B7280; margin-bottom: 14px; line-height: 1.5; }
.nr-bullets  { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
.nr-bullet   { display: flex; align-items: center; gap: 9px; font-size: 12.5px; color: #374151; }
.nr-bullet-ic { display: flex; align-items: center; flex-shrink: 0; }

/* DigiLocker illustration */
.nr-digi-illus {
  background: #EEF2FF; border-radius: 10px;
  padding: 16px 12px; display: flex; align-items: center; justify-content: center;
  gap: 16px; margin-bottom: 16px; flex: 1;
}
.nr-doc { width: 54px; height: 70px; background: #fff; border-radius: 7px; border: 2px solid #C7D2FE; display: flex; flex-direction: column; overflow: hidden; flex-shrink: 0; }
.nr-doc-hd { height: 20px; background: #2a195c; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.nr-doc-bd { flex: 1; padding: 5px; display: flex; flex-direction: column; gap: 3px; }
.nr-doc-photo { width: 14px; height: 18px; background: #C7D2FE; border-radius: 2px; margin-bottom: 3px; align-self: flex-end; }
.nr-doc-ln { height: 3px; background: #E5E7EB; border-radius: 2px; }
.nr-digi-logo-badge { width: 54px; height: 54px; background: #fff; border-radius: 12px; border: 1.5px solid #E5E7EB; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }

/* buttons */
.nr-btn-pri {
  width: 100%; padding: 12px; background: #2a195c; color: #fff;
  border-radius: 10px; font-size: 13.5px; font-weight: 700;
  display: flex; align-items: center; justify-content: center; gap: 9px;
  cursor: pointer; border: none; font-family: inherit; transition: background .15s;
}
.nr-btn-pri:hover { background: #4338CA; }
.nr-btn-out {
  width: 100%; padding: 12px; background: #fff; color: #374151;
  border: 1.5px solid #E5E7EB; border-radius: 10px; font-size: 13.5px; font-weight: 600;
  display: flex; align-items: center; justify-content: center; gap: 9px;
  cursor: pointer; font-family: inherit; transition: border-color .15s, color .15s;
  margin-top: auto;
}
.nr-btn-out:hover { border-color: #2a195c; color: #2a195c; }
.nr-mc-note { font-size: 11.5px; color: #9CA3AF; text-align: center; margin-top: 9px; line-height: 1.45; }

/* Do KYC Later */
.nr-later {
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
  background: #FFF8F0; border: 1px solid #FED7AA; border-radius: 12px;
  padding: 16px 20px; margin-bottom: 16px;
}
.nr-later-l { display: flex; align-items: flex-start; gap: 11px; }
.nr-later-ic { color: #F97316; display: flex; align-items: center; flex-shrink: 0; margin-top: 2px; }
.nr-later-t { font-size: 13.5px; font-weight: 700; color: #92400E; margin-bottom: 4px; }
.nr-later-s { font-size: 12.5px; color: #B45309; line-height: 1.5; max-width: 520px; }
.nr-later-btn {
  padding: 9px 20px; background: #fff; border: 1.5px solid #F97316;
  border-radius: 9px; color: #F97316; font-size: 13px; font-weight: 700;
  cursor: pointer; white-space: nowrap; flex-shrink: 0; font-family: inherit;
  transition: background .15s;
}
.nr-later-btn:hover { background: #FFF1E6; }

/* info note */
.nr-info-note {
  display: flex; align-items: flex-start; gap: 10px;
  background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 12px;
  padding: 14px 18px; margin-bottom: 16px;
}
.nr-info-note-t { font-size: 13px; color: #1D4ED8; line-height: 1.5; }

/* footer actions bar */
.nr-footer-actions {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 24px; background: #fff;
  border: 1px solid #E5E7EB; border-radius: 14px;
  box-shadow: 0 1px 4px rgba(0,0,0,.05);
}
.nr-cancel {
  padding: 10px 22px; background: #fff; border: 1.5px solid #E5E7EB;
  border-radius: 10px; font-size: 13px; font-weight: 600; color: #374151;
  cursor: pointer; font-family: inherit; transition: border-color .15s;
}
.nr-cancel:hover { border-color: #9CA3AF; }
.nr-continue {
  padding: 10px 22px; background: #F3F4F6; border: none; border-radius: 10px;
  font-size: 13px; font-weight: 600; color: #9CA3AF; cursor: not-allowed;
  display: flex; align-items: center; gap: 8px; font-family: inherit;
}
.nr-save {
  padding: 10px 22px; background: #2a195c; border: none; border-radius: 10px;
  font-size: 13px; font-weight: 600; color: #fff; cursor: pointer;
  display: flex; align-items: center; gap: 8px; font-family: inherit;
  transition: background .15s;
}
.nr-save:hover { background: #4338CA; }

/* ─────────────── MANUAL FORM ─────────────── */
.nr-form { padding: 20px 24px; }
.nr-sec-hd { font-size: 14px; font-weight: 700; color: #111827; padding-bottom: 12px; border-bottom: 1.5px solid #F3F4F6; margin-bottom: 16px; }
.nr-row    { display: grid; gap: 16px; margin-bottom: 16px; }
.nr-row-3  { grid-template-columns: 1fr 1fr 1fr; }
.nr-row-2  { grid-template-columns: 1fr 1fr; }
.nr-fld label { display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px; }
.nr-fld .req  { color: #EF4444; margin-left: 2px; }
.nr-fld .opt  { color: #9CA3AF; font-size: 11px; font-weight: 400; margin-left: 4px; }
.nr-inp {
  width: 100%; padding: 10px 13px; border: 1.5px solid #E5E7EB; border-radius: 9px;
  font-size: 13px; color: #111827; font-family: inherit; outline: none;
  transition: border-color .15s, box-shadow .15s; background: #fff;
  box-sizing: border-box;
}
.nr-inp::placeholder { color: #9CA3AF; }
.nr-inp:focus { border-color: #2a195c; box-shadow: 0 0 0 3px rgba(79,70,229,.1); }
.nr-sel {
  width: 100%; padding: 10px 13px; border: 1.5px solid #E5E7EB; border-radius: 9px;
  font-size: 13px; color: #111827; font-family: inherit; outline: none;
  transition: border-color .15s; background: #fff; cursor: pointer;
  -webkit-appearance: none; appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2.5' stroke-linecap='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
  background-repeat: no-repeat; background-position: right 12px center; padding-right: 36px;
  box-sizing: border-box;
}
.nr-sel:focus { border-color: #2a195c; box-shadow: 0 0 0 3px rgba(79,70,229,.1); }
.nr-ph {
  display: flex; border: 1.5px solid #E5E7EB; border-radius: 9px;
  overflow: hidden; background: #fff; transition: border-color .15s, box-shadow .15s;
}
.nr-ph:focus-within { border-color: #2a195c; box-shadow: 0 0 0 3px rgba(79,70,229,.1); }
.nr-ph-pre {
  padding: 10px 11px; background: #F9FAFB; border-right: 1.5px solid #E5E7EB;
  font-size: 13px; font-weight: 600; color: #374151;
  display: flex; align-items: center; gap: 5px; white-space: nowrap; flex-shrink: 0;
}
.nr-ph input {
  flex: 1; padding: 10px 13px; border: none; outline: none;
  font-size: 13px; font-family: inherit; background: transparent; min-width: 0;
}
.nr-ph input::placeholder { color: #9CA3AF; }
.nr-inp-wrap { position: relative; }
.nr-inp-wrap .nr-inp { padding-right: 38px; }
.nr-inp-wrap-ic { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: #9CA3AF; pointer-events: none; display: flex; }
.nr-form-note {
  display: flex; align-items: flex-start; gap: 10px;
  background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 10px;
  padding: 13px 16px; margin-top: 6px;
}
.nr-form-note-t { font-size: 13px; color: #1D4ED8; line-height: 1.5; }

/* ─────────────── RIGHT PANEL ─────────────── */
.nr-rp { display: flex; flex-direction: column; gap: 16px; position: sticky; top: 80px; }
.nr-rp-card { background: #fff; border: 1px solid #E5E7EB; border-radius: 14px; box-shadow: 0 1px 4px rgba(0,0,0,.06); overflow: hidden; }
.nr-rp-hdr  { display: flex; align-items: center; gap: 9px; padding: 14px 18px; border-bottom: 1px solid #E5E7EB; }
.nr-rp-hdr-ic { display: flex; align-items: center; flex-shrink: 0; }
.nr-rp-title  { font-size: 13.5px; font-weight: 700; color: #111827; }

/* KYC progress list */
.nr-prog-list { padding: 6px 0 6px; }
.nr-prog-row  { display: flex; align-items: flex-start; gap: 12px; padding: 9px 18px; position: relative; }
.nr-prog-row:not(:last-child)::after {
  content: ''; position: absolute; left: 26px; top: 38px;
  width: 2px; height: calc(100% - 16px); background: #E5E7EB;
}
.nr-prog-row.act::after { background: #2a195c; }
.nr-prog-dot  { width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11.5px; font-weight: 700; flex-shrink: 0; }
.nr-prog-dot.active { background: #2a195c; color: #fff; }
.nr-prog-dot.done   { background: #22C55E; color: #fff; }
.nr-prog-dot.pend   { background: #fff; color: #9CA3AF; border: 2px solid #E5E7EB; }
.nr-prog-name { font-size: 13px; font-weight: 600; color: #111827; margin-top: 2px; }
.nr-prog-name.pend { color: #9CA3AF; font-weight: 500; }
.nr-prog-sub  { font-size: 11.5px; margin-top: 2px; }
.nr-prog-sub.active-s { color: #2a195c; }
.nr-prog-sub.pend-s   { color: #9CA3AF; }

/* why KYC */
.nr-why-list { padding: 10px 0 4px; }
.nr-why-row  { display: flex; align-items: center; gap: 10px; padding: 7px 18px; font-size: 13px; color: #374151; }
.nr-why-ic   { color: #2a195c; display: flex; align-items: center; flex-shrink: 0; }

/* important notes */
.nr-imp-body { padding: 12px 18px 14px; }
.nr-imp-item { display: flex; align-items: flex-start; gap: 7px; font-size: 12.5px; color: #92400E; margin-bottom: 6px; line-height: 1.5; }
.nr-imp-item:last-child { margin-bottom: 0; }

/* need help */
.nr-help-body { padding: 14px 18px 16px; }
.nr-help-sub  { font-size: 13px; color: #6B7280; margin-bottom: 12px; }
.nr-help-btn  {
  width: 100%; padding: 10px; background: #2a195c; color: #fff;
  border-radius: 9px; font-size: 13px; font-weight: 600;
  cursor: pointer; border: none; font-family: inherit; transition: background .15s;
}
.nr-help-btn:hover { background: #4338CA; }
`;

/* ── icons ── */
const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 2 as number, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
const SV = ({ s = 14, children, ...p }: { s?: number; children: React.ReactNode } & React.SVGProps<SVGSVGElement>) => (
  <svg width={s} height={s} viewBox="0 0 24 24" {...S} {...p}>{children}</svg>
);

const ILeft = () => <SV s={13}><polyline points="15 18 9 12 15 6" /></SV>;
const IRight = () => <SV s={13}><polyline points="9 18 15 12 9 6" /></SV>;
const ICheck = ({ s = 13 }: { s?: number }) => <SV s={s}><polyline points="20 6 9 17 4 12" /></SV>;
const IShield = () => <SV s={15}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></SV>;
const IHead = () => <SV s={15}><path d="M3 18v-6a9 9 0 0 1 18 0v6" /><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" /></SV>;
const IInfo = ({ s = 14 }: { s?: number }) => <SV s={s}><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></SV>;
const IClock = ({ s = 14 }: { s?: number }) => <SV s={s}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></SV>;
const ICal = ({ s = 14 }: { s?: number }) => <SV s={s}><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></SV>;
const IArr = ({ s = 12 }: { s?: number }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>;
const IScan = () => <SV s={14}><rect x="2" y="4" width="20" height="16" rx="2" /><line x1="8" y1="10" x2="16" y2="10" /><line x1="8" y1="14" x2="13" y2="14" /></SV>;
const ICircle = () => <SV s={12}><circle cx="12" cy="12" r="10" /></SV>;

/* ── stepper data ── */
const STEPS = [
  { n: 1, label: 'KYC Verification', stat: 'In Progress', active: true },
  { n: 2, label: 'Rental Details', stat: 'Pending', active: false },
  { n: 3, label: 'Payment & Charges', stat: 'Pending', active: false },
  { n: 4, label: 'Documents', stat: 'Pending', active: false },
  { n: 5, label: 'Review & Confirm', stat: 'Pending', active: false },
];

/* ── DigiLocker illustration ── */
const DigiIllus = () => (
  <div className="nr-digi-illus">
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#2a195c', marginBottom: 4 }}>Fetching documents…</div>
      <div style={{ display: 'flex', gap: 10 }}>
        {[0, 1].map(i => (
          <div key={i} className="nr-doc">
            <div className="nr-doc-hd">
              <div style={{ width: 14, height: 9, background: 'rgba(255,255,255,.4)', borderRadius: 2 }} />
            </div>
            <div className="nr-doc-bd">
              <img src="/assets/aadhar.jpg" alt="Aadhaar" className="nr-doc-photo" />
              {[0, 1, 2].map(j => <div key={j} className="nr-doc-ln" style={{ width: j === 2 ? '55%' : '88%' }} />)}
            </div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 10, color: '#6B7280', marginTop: 3 }}>Aadhaar &amp; Driving License</div>
    </div>
    <div className="nr-digi-logo-badge">
      <svg width="36" height="36" viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="10" fill="#1B4FBB" />
        <text x="5" y="33" fontFamily="Arial Black,sans-serif" fontSize="20" fontWeight="900" fill="#fff">Di</text>
        <circle cx="40" cy="14" r="8" fill="#F0B429" />
        <text x="35.5" y="18.5" fontFamily="Arial,sans-serif" fontSize="9" fontWeight="700" fill="#fff">gi</text>
      </svg>
    </div>
  </div>
);

/* ── Manual form ── */
function ManualForm() {
  const chevSvg = (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );

  return (
    <div className="nr-form">
      {/* 1. Personal Details */}
      <div className="nr-sec-hd">1. Personal Details</div>
      <div className="nr-row nr-row-3">
        <div className="nr-fld">
          <label>Full Name<span className="req"> *</span></label>
          <input className="nr-inp" placeholder="Enter full name as per Aadhaar" />
        </div>
        <div className="nr-fld">
          <label>Date of Birth<span className="req"> *</span></label>
          <div className="nr-inp-wrap">
            <input className="nr-inp" placeholder="DD / MM / YYYY" />
            <span className="nr-inp-wrap-ic"><ICal s={14} /></span>
          </div>
        </div>
        <div className="nr-fld">
          <label>Gender<span className="req"> *</span></label>
          <select className="nr-sel">
            <option value="">Select gender</option>
            <option>Male</option><option>Female</option><option>Other</option>
          </select>
        </div>
      </div>

      <div className="nr-row nr-row-3">
        <div className="nr-fld">
          <label>Mobile Number<span className="req"> *</span></label>
          <div className="nr-ph">
            <div className="nr-ph-pre"><span style={{ fontSize: 13 }}>🇮🇳</span>+91 {chevSvg}</div>
            <input placeholder="Enter mobile number" />
          </div>
        </div>
        <div className="nr-fld">
          <label>Email Address<span className="opt">(Optional)</span></label>
          <input className="nr-inp" placeholder="Enter email address" type="email" />
        </div>
        <div className="nr-fld">
          <label>Father / Guardian Name<span className="req"> *</span></label>
          <input className="nr-inp" placeholder="Enter father / guardian name" />
        </div>
      </div>

      <div className="nr-row nr-row-3">
        <div className="nr-fld">
          <label>Aadhaar Number<span className="req"> *</span></label>
          <div className="nr-inp-wrap">
            <input className="nr-inp" placeholder="Enter 12 digit Aadhaar number" maxLength={12} />
            <span className="nr-inp-wrap-ic"><IScan /></span>
          </div>
        </div>
        <div className="nr-fld">
          <label>PAN Number<span className="opt">(Optional)</span></label>
          <input className="nr-inp" placeholder="Enter PAN number" />
        </div>
        <div className="nr-fld">
          <label>Alternate Mobile<span className="opt">(Optional)</span></label>
          <div className="nr-ph">
            <div className="nr-ph-pre"><span style={{ fontSize: 13 }}>🇮🇳</span>+91 {chevSvg}</div>
            <input placeholder="Enter alternate number" />
          </div>
        </div>
      </div>

      {/* 2. Address Details */}
      <div className="nr-sec-hd" style={{ marginTop: 8 }}>2. Address Details</div>
      <div className="nr-row nr-row-2">
        <div className="nr-fld">
          <label>Address Line 1<span className="req"> *</span></label>
          <input className="nr-inp" placeholder="House / Flat / Building, Street" />
        </div>
        <div className="nr-fld">
          <label>Address Line 2<span className="opt">(Optional)</span></label>
          <input className="nr-inp" placeholder="Area / Landmark" />
        </div>
      </div>
      <div className="nr-row nr-row-3">
        <div className="nr-fld">
          <label>City<span className="req"> *</span></label>
          <input className="nr-inp" placeholder="Enter city" />
        </div>
        <div className="nr-fld">
          <label>State<span className="req"> *</span></label>
          <select className="nr-sel">
            <option value="">Select state</option>
            {['Delhi', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Uttar Pradesh', 'Gujarat', 'Rajasthan', 'West Bengal', 'Telangana', 'Kerala'].map(s => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="nr-fld">
          <label>Pincode<span className="req"> *</span></label>
          <input className="nr-inp" placeholder="Enter 6 digit pincode" maxLength={6} />
        </div>
      </div>

      {/* 3. Identity Proof */}
      <div className="nr-sec-hd" style={{ marginTop: 8 }}>3. Identity Proof Details</div>
      <div className="nr-row nr-row-3">
        <div className="nr-fld">
          <label>Identity Type<span className="req"> *</span></label>
          <select className="nr-sel">
            <option value="">Select identity type</option>
            <option>Aadhaar Card</option><option>Driving License</option>
            <option>Voter ID</option><option>Passport</option>
          </select>
        </div>
        <div className="nr-fld">
          <label>Identity Number<span className="req"> *</span></label>
          <input className="nr-inp" placeholder="Enter identity number" />
        </div>
        <div className="nr-fld">
          <label>Issue Date<span className="opt">(Optional)</span></label>
          <div className="nr-inp-wrap">
            <input className="nr-inp" placeholder="DD / MM / YYYY" />
            <span className="nr-inp-wrap-ic"><ICal s={14} /></span>
          </div>
        </div>
      </div>

      <div className="nr-form-note">
        <span style={{ color: '#2563EB', display: 'flex', flexShrink: 0 }}><IInfo s={14} /></span>
        <span className="nr-form-note-t">You can upload documents in the next step. Verification will be completed later.</span>
      </div>
    </div>
  );
}

/* ── Right Panel ── */
const PROG = [
  { n: 1, label: 'KYC Verification', sub: 'In Progress', active: true },
  { n: 2, label: 'Rental Details', sub: 'Pending', active: false },
  { n: 3, label: 'Payment & Charges', sub: 'Pending', active: false },
  { n: 4, label: 'Documents', sub: 'Pending', active: false },
  { n: 5, label: 'Review & Confirm', sub: 'Pending', active: false },
];

function RightPanel({ mode }: { mode: 'select' | 'manual' }) {
  return (
    <div className="nr-rp">
      {/* KYC Progress */}
      <div className="nr-rp-card">
        <div className="nr-rp-hdr">
          <div className="nr-rp-title">KYC Progress</div>
        </div>
        <div className="nr-prog-list">
          {PROG.map((p, i) => (
            <div key={p.n} className={`nr-prog-row ${p.active && i < PROG.length - 1 ? 'act' : ''}`}>
              <div className={`nr-prog-dot ${p.active ? 'active' : 'pend'}`}>{p.n}</div>
              <div>
                <div className={`nr-prog-name ${!p.active ? 'pend' : ''}`}>{p.label}</div>
                <div className={`nr-prog-sub ${p.active ? 'active-s' : 'pend-s'}`}>{p.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Important Notes — manual mode only */}
      {mode === 'manual' && (
        <div className="nr-rp-card">
          <div className="nr-rp-hdr">
            <span className="nr-rp-hdr-ic" style={{ color: '#D97706' }}><IInfo s={14} /></span>
            <div className="nr-rp-title">Important Notes</div>
          </div>
          <div className="nr-imp-body">
            {[
              'Please enter details exactly as per Aadhaar.',
              'Incorrect details may lead to verification failure.',
              'You can edit details before final submission.',
            ].map((n, i) => (
              <div key={i} className="nr-imp-item">
                <span style={{ color: '#D97706', fontWeight: 700, marginTop: 1 }}>•</span>
                <span>{n}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Why KYC is Important */}
      <div className="nr-rp-card">
        <div className="nr-rp-hdr">
          <span className="nr-rp-hdr-ic" style={{ color: '#2a195c' }}><IShield /></span>
          <div className="nr-rp-title">Why KYC is Important?</div>
        </div>
        <div className="nr-why-list">
          {[
            'Ensures rider identity authenticity',
            'Helps prevent fraud and misuse',
            'Complies with government regulations',
            'Ensures a safe experience for everyone',
          ].map(w => (
            <div key={w} className="nr-why-row">
              <span className="nr-why-ic"><ICheck s={14} /></span>
              {w}
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
          <div className="nr-help-sub">Facing issues with KYC?</div>
          <button className="nr-help-btn">Contact Support</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════ */
export default function NewRiderPage() {
  const [mode, setMode] = useState<'select' | 'manual'>('select');
  const [method, setMethod] = useState<'digi' | 'manual'>('digi');

  const goManual = () => { setMethod('manual'); setMode('manual'); };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="nr-shell">
        <Sidebar activePath="/new-rider" />

        <div className="nr-main">
          <TopBar />

          <div className="nr-page">

            {/* ── Breadcrumb ── */}
            <div className="nr-bc">
              <Link href="/"><ILeft /> Home</Link>
              <span className="nr-bc-sep">›</span>
              <a href="#">Rides / Rentals</a>
              <span className="nr-bc-sep">›</span>
              <span className="nr-bc-cur">New Ride Registration</span>
            </div>

            {/* ── Title ── */}
            <div className="nr-title-row">
              <div>
                <h1 className="nr-h1">New Ride Registration</h1>
                <p className="nr-sub">Register a new ride for the rider</p>
              </div>
              <button className="nr-back-btn"><ILeft /> Back to Rides</button>
            </div>

            {/* ── Stepper ── */}
            <div className="nr-stepper">
              {STEPS.map((s, i) => (
                <div key={s.n} className="nr-step-wrap">
                  <div className="nr-step">
                    <div className={`nr-step-num ${s.active ? 'active' : 'pend'}`}>{s.n}</div>
                    <div>
                      <div className={`nr-step-label ${!s.active ? 'pend' : ''}`}>{s.label}</div>
                      <div className={`nr-step-stat ${s.active ? 'active-s' : 'pend-s'}`}>{s.stat}</div>
                    </div>
                  </div>
                  {i < STEPS.length - 1 && <div className="nr-step-line" />}
                </div>
              ))}
            </div>

            {/* ── 2-col layout ── */}
            <div className="nr-layout">

              {/* ─── LEFT COLUMN ─── */}
              <div>
                {/* Step card */}
                <div className="nr-card">

                  {/* Card header */}
                  <div className="nr-card-hdr">
                    <div>
                      <h2>Step 1: KYC Verification</h2>
                      <p>
                        {mode === 'manual'
                          ? 'Fill in the rider details manually. Make sure the information matches the original documents.'
                          : 'Verify rider identity to ensure a safe and compliant onboarding.'}
                      </p>
                    </div>
                    <div className="nr-pow-row">
                      <span className="nr-pow-lbl">Powered by</span>
                      <div className="nr-digi-brand">
                        <svg width="20" height="20" viewBox="0 0 48 48" fill="none">
                          <rect width="48" height="48" rx="8" fill="#1B4FBB" />
                          <text x="5" y="33" fontFamily="Arial Black,sans-serif" fontSize="20" fontWeight="900" fill="#fff">D</text>
                          <circle cx="40" cy="13" r="8" fill="#F0B429" />
                        </svg>
                        <span className="nr-digi-name">DigiLocker</span>
                      </div>
                      {mode === 'manual'
                        ? <div className="nr-manual-tag"><IClock s={12} /> Manual Entry</div>
                        : <div className="nr-verified-tag"><ICheck s={12} /> Verified</div>
                      }
                    </div>
                  </div>

                  {/* Card body */}
                  {mode === 'select' ? (
                    <>
                      {/* Green banner */}
                      <div className="nr-green-banner">
                        <div className="nr-green-ic"><ICheck s={12} /></div>
                        <div>
                          <div className="nr-green-t">Use DigiLocker to verify instantly (Recommended)</div>
                          <div className="nr-green-s">Secure, fast and paperless verification. Details are auto-fetched and cannot be edited.</div>
                        </div>
                      </div>

                      {/* Method selection */}
                      <div className="nr-methods">

                        {/* DigiLocker card */}
                        <div className={`nr-mc ${method === 'digi' ? 'sel' : ''}`} onClick={() => setMethod('digi')}>
                          <div className="nr-mc-top">
                            <div className={`nr-radio ${method === 'digi' ? 'on' : ''}`}>
                              {method === 'digi' && <div className="nr-radio-dot" />}
                            </div>
                            <span className="nr-mc-title">Verify Now with DigiLocker</span>
                            <span className="nr-rec-badge">Recommended</span>
                          </div>
                          <div className="nr-bullets">
                            {['Auto fetch Aadhar and Driving License', 'Secure & government verified', 'Faster onboarding'].map(b => (
                              <div key={b} className="nr-bullet">
                                <span className="nr-bullet-ic" style={{ color: '#2a195c' }}><ICheck s={13} /></span>
                                {b}
                              </div>
                            ))}
                          </div>
                          <DigiIllus />
                          <button className="nr-btn-pri">
                            <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
                              <rect width="48" height="48" rx="8" fill="rgba(255,255,255,.25)" />
                              <text x="5" y="33" fontFamily="Arial Black,sans-serif" fontSize="20" fontWeight="900" fill="#fff">D</text>
                            </svg>
                            Verify with DigiLocker
                          </button>
                          <div className="nr-mc-note">You will be redirected to DigiLocker to fetch your documents</div>
                        </div>

                        {/* Manual card */}
                        <div className={`nr-mc ${method === 'manual' ? 'sel' : ''}`} onClick={() => setMethod('manual')}>
                          <div className="nr-mc-top">
                            <div className={`nr-radio ${method === 'manual' ? 'on' : ''}`}>
                              {method === 'manual' && <div className="nr-radio-dot" />}
                            </div>
                            <span className="nr-mc-title">Enter Details Manually</span>
                          </div>
                          <p className="nr-mc-desc">Fill rider details and upload documents manually.</p>
                          <div className="nr-bullets">
                            {['Enter details manually', 'Upload documents', 'Verification will be done later'].map(b => (
                              <div key={b} className="nr-bullet">
                                <span className="nr-bullet-ic" style={{ color: '#9CA3AF' }}><ICircle /></span>
                                {b}
                              </div>
                            ))}
                          </div>
                          <button
                            className="nr-btn-out"
                            onClick={e => { e.stopPropagation(); goManual(); }}
                          >
                            Enter Manually
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <ManualForm />
                  )}
                </div>

                {/* Do KYC Later (select mode) */}
                {mode === 'select' && (
                  <div className="nr-later">
                    <div className="nr-later-l">
                      <span className="nr-later-ic"><IClock s={18} /></span>
                      <div>
                        <div className="nr-later-t">Do KYC Later</div>
                        <div className="nr-later-s">
                          You can skip KYC verification now and do it later. However, ride will be activated only after successful KYC verification.
                        </div>
                      </div>
                    </div>
                    <button className="nr-later-btn">Do KYC Later</button>
                  </div>
                )}

                {/* Info note (select mode) */}
                {mode === 'select' && (
                  <div className="nr-info-note">
                    <span style={{ color: '#2563EB', display: 'flex', flexShrink: 0 }}><IInfo s={15} /></span>
                    <span className="nr-info-note-t">
                      Note: KYC verification is mandatory before ride activation as per company policy and government regulations.
                    </span>
                  </div>
                )}

                {/* Footer actions */}
                <div className="nr-footer-actions">
                  <button className="nr-cancel">Cancel</button>
                  {mode === 'select' ? (
                    <button className="nr-continue" disabled>
                      Continue to Rental Details <IArr s={12} />
                    </button>
                  ) : (
                    <Link href="/new-rider/rental" style={{ textDecoration: 'none' }}>
                      <button className="nr-save">
                        Save &amp; Continue <IArr s={12} />
                      </button>
                    </Link>
                  )}
                </div>
              </div>

              {/* ─── RIGHT PANEL — always visible ─── */}
              <RightPanel mode={mode} />

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
