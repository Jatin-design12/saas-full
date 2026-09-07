'use client';
import { useState, useEffect } from 'react';
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

/* ── Document upload grid (2 cols for ID + Photo) ── */
.doc-grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; max-width: 660px; }
/* ── Vehicle upload grid (4 angles) ── */
.doc-grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }

/* ── Document card ── */
.doc-card {
  border: 1.5px solid #E5E7EB; border-radius: 12px; overflow: hidden;
  transition: border-color .15s; cursor: default; background: #fff;
}
.doc-card:hover { border-color: #C7D2FE; }
.doc-card-top { padding: 10px 12px 8px; }
.doc-card-icon-row { display: flex; align-items: center; gap: 6px; margin-bottom: 5px; }
.doc-card-icon { width: 28px; height: 28px; border-radius: 7px; background: #EEF2FF; display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: #2a195c; }
.doc-card-label { font-size: 12px; font-weight: 700; color: #111827; line-height: 1.2; }
.doc-card-sub   { font-size: 11px; color: #9CA3AF; }

/* Preview area */
.doc-preview { margin: 0 10px 8px; border-radius: 8px; overflow: hidden; height: 105px; background: #F8FAFC; display: flex; align-items: center; justify-content: center; border: 1px solid #F1F5F9; }
.doc-preview img { width: 100%; height: 100%; object-fit: contain; }

/* doc status bar */
.doc-footer { display: flex; align-items: center; gap: 6px; padding: 7px 10px; border-top: 1px solid #F3F4F6; }
.doc-uploaded { display: flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 600; color: #16A34A; }
.doc-view { font-size: 11px; font-weight: 600; color: #2a195c; cursor: pointer; margin-left: 4px; }
.doc-view:hover { text-decoration: underline; }
.doc-del { display: flex; align-items: center; color: #EF4444; cursor: pointer; margin-left: auto; font-size: 11px; font-weight: 600; gap: 3px; }

/* ── Vehicle image card ── */
.veh-card {
  border: 1.5px solid #E5E7EB; border-radius: 12px; overflow: hidden;
  transition: border-color .15s; background: #fff;
}
.veh-card:hover { border-color: #C7D2FE; }
.veh-card-label { padding: 10px 12px 6px; font-size: 11.5px; font-weight: 700; color: #111827; display: flex; align-items: center; gap: 3px; }
.veh-card-req { color: #EF4444; }
.veh-preview { margin: 0 10px 8px; border-radius: 8px; overflow: hidden; height: 105px; background: #F8FAFC; display: flex; align-items: center; justify-content: center; border: 1px solid #F1F5F9; }
.veh-preview img { width: 100%; height: 100%; object-fit: contain; }
.veh-footer { display: flex; align-items: center; gap: 6px; padding: 7px 10px; border-top: 1px solid #F3F4F6; }

/* ── Terms & Conditions ── */
.doc-terms-box { background: #F9FAFB; border: 1.5px solid #E5E7EB; border-radius: 12px; padding: 18px 20px; }
.doc-cb-row { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 12px; cursor: pointer; }
.doc-cb { width: 18px; height: 18px; border-radius: 5px; border: 2px solid #2a195c; background: #2a195c; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; }
.doc-cb-label { font-size: 13px; color: #374151; line-height: 1.5; font-weight: 500; }
.doc-terms-link { display: inline-flex; align-items: center; gap: 5px; font-size: 13px; font-weight: 600; color: #2a195c; cursor: pointer; border: none; background: none; font-family: inherit; padding: 0; margin-bottom: 14px; }
.doc-terms-link:hover { text-decoration: underline; }
.doc-confirm-banner {
  display: flex; align-items: flex-start; gap: 9px;
  background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 9px;
  padding: 11px 14px; font-size: 12.5px; color: #15803D; line-height: 1.5;
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
.nr-sum-body  { padding: 10px 14px 12px; display: flex; flex-direction: column; gap: 7px; }
.nr-sum-row   { display: flex; align-items: center; justify-content: space-between; padding: 9px 12px; font-size: 13px; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; }
.nr-sum-row-img { display: flex; align-items: center; justify-content: space-between; padding: 9px 12px; font-size: 13px; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; }
.nr-sum-label { color: #64748B; font-weight: 500; }
.nr-sum-val   { font-weight: 700; color: #111827; display: flex; align-items: center; gap: 8px; }
.nr-sum-thumb { width: 34px; height: 26px; border-radius: 5px; overflow: hidden; background: #F3F4F9; display: flex; align-items: center; justify-content: center; border: 1px solid #E5E7EB; }
.nr-sum-divider { height: 1px; background: #E2E8F0; margin: 4px 0; }
.nr-sum-total {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 14px; margin: 4px 0 0; border-radius: 10px; background: #F5F3FF; border: 1.5px solid #DDD6FE;
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

/* ── Document Card with File Upload, Camera Capture & Real Image Preview ── */
interface DocCardProps {
  label: string;
  sub: string;
  defaultImg: string;
  storageKey: string;
}
function DocCard({ label, sub, defaultImg, storageKey }: DocCardProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) setImageSrc(saved);
    } catch (e) {}
  }, [storageKey]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const res = reader.result as string;
        setImageSrc(res);
        try { localStorage.setItem(storageKey, res); } catch (e) {}
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClear = () => {
    setImageSrc(null);
    try { localStorage.removeItem(storageKey); } catch (e) {}
  };

  return (
    <div className="doc-card">
      <div className="doc-card-top">
        <div className="doc-card-icon-row">
          <div className="doc-card-icon"><IFile s={13} /></div>
          <div>
            <div className="doc-card-label">
              {label}<span style={{ color: '#EF4444', marginLeft: 2 }}>*</span>
            </div>
            <div className="doc-card-sub">{sub}</div>
          </div>
        </div>
      </div>
      <div className="doc-preview">
        <img
          src={imageSrc || defaultImg}
          alt={label}
        />
      </div>

      <div style={{ padding: '6px 10px', display: 'flex', gap: '6px', background: '#F8FAFC', borderTop: '1px solid #F1F5F9' }}>
        <label style={{ flex: 1, padding: '5px', background: '#FFF', border: '1.5px solid #CBD5E1', borderRadius: '7px', fontSize: '11px', fontWeight: 700, color: '#334155', cursor: 'pointer', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
          📁 Upload
          <input type="file" accept="image/*,.pdf" onChange={handleFile} style={{ display: 'none' }} />
        </label>
        <label style={{ flex: 1, padding: '5px', background: '#2A195C', border: 'none', borderRadius: '7px', fontSize: '11px', fontWeight: 700, color: '#FFF', cursor: 'pointer', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
          📷 Camera
          <input type="file" accept="image/*" capture="environment" onChange={handleFile} style={{ display: 'none' }} />
        </label>
      </div>

      <div className="doc-footer">
        <span className="doc-uploaded"><ICheck s={11} /> {imageSrc ? 'Uploaded' : 'Ready'}</span>
        {imageSrc && (
          <button
            type="button"
            onClick={handleClear}
            className="doc-del"
            style={{ border: 'none', background: 'none', padding: 0 }}
          >
            <ITrash s={11} /> Clear
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Vehicle Angle Photo Card with Real EV Images ── */
interface VehCardProps {
  label: string;
  defaultImg: string;
  storageKey: string;
}
function VehCard({ label, defaultImg, storageKey }: VehCardProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) setImageSrc(saved);
    } catch (e) {}
  }, [storageKey]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const res = reader.result as string;
        setImageSrc(res);
        try { localStorage.setItem(storageKey, res); } catch (e) {}
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClear = () => {
    setImageSrc(null);
    try { localStorage.removeItem(storageKey); } catch (e) {}
  };

  return (
    <div className="veh-card">
      <div className="veh-card-label">{label}<span className="veh-card-req"> *</span></div>
      <div className="veh-preview">
        <img
          src={imageSrc || defaultImg}
          alt={label}
        />
      </div>
      <div style={{ padding: '6px 10px', display: 'flex', gap: '6px', background: '#F8FAFC', borderTop: '1px solid #F1F5F9' }}>
        <label style={{ flex: 1, padding: '5px', background: '#FFF', border: '1.5px solid #CBD5E1', borderRadius: '7px', fontSize: '11px', fontWeight: 700, color: '#334155', cursor: 'pointer', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
          📁 Upload
          <input type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
        </label>
        <label style={{ flex: 1, padding: '5px', background: '#2A195C', border: 'none', borderRadius: '7px', fontSize: '11px', fontWeight: 700, color: '#FFF', cursor: 'pointer', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
          📷 Camera
          <input type="file" accept="image/*" capture="environment" onChange={handleFile} style={{ display: 'none' }} />
        </label>
      </div>
      <div className="veh-footer">
        <span className="doc-uploaded"><ICheck s={11} /> {imageSrc ? 'Uploaded' : 'Ready'}</span>
        {imageSrc && (
          <button type="button" onClick={handleClear} className="doc-del" style={{ border: 'none', background: 'none', padding: 0 }}>
            <ITrash s={11} /> Clear
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Right Panel ── */
function RightPanel({ rentalData, paymentData }: { rentalData?: any; paymentData?: any }) {
  const CHECKLIST = [
    { l: 'Identity Document (Aadhaar/DL/ID)', s: 'Uploaded' },
    { l: 'Rider Profile Photo', s: 'Uploaded' },
    { l: 'Vehicle Photos (4 Angles)', s: 'Complete' },
    { l: 'Terms & Conditions', s: 'Agreed' },
  ];

  const vehicleNumber = rentalData?.vehicle_code || (rentalData?.vehicle_name?.match(/\((.*?)\)/)?.[1]) || rentalData?.vehicle_name || 'EVM102501';
  const vehicleModel = rentalData?.vehicle_model || rentalData?.vehicle_name?.replace(/\(.*?\)/, '').trim() || 'Evegah City';
  const batteryId = rentalData?.battery_id || 'BAT-MNZ-001';
  const planType = rentalData?.plan_type || 'Daily Plan';
  const baseRent = Number(rentalData?.plan_rate) || 0;
  const duration = Number(rentalData?.total_days) || 1;
  const deposit = Number(rentalData?.deposit_amount ?? 0);
  const discount = Number(paymentData?.discount) || 0;
  const totalPayable = paymentData?.total_payable || Math.max(0, baseRent + deposit - discount);

  return (
    <div className="nr-rp">
      {/* Rental Summary with real thumbnails */}
      <div className="nr-rp-card">
        <div className="nr-rp-hdr">
          <span className="nr-rp-hdr-ic" style={{ color: '#2a195c' }}><IReceipt /></span>
          <div className="nr-rp-title">Rental Summary</div>
        </div>
        <div className="nr-sum-body">
          <div className="nr-sum-row">
            <span className="nr-sum-label">Vehicle Number</span>
            <span className="nr-sum-val" style={{ fontWeight: 600 }}>{vehicleNumber}</span>
          </div>
          <div className="nr-sum-row">
            <span className="nr-sum-label">Vehicle Model</span>
            <span className="nr-sum-val" style={{ fontWeight: 600 }}>{vehicleModel}</span>
          </div>
          <div className="nr-sum-row-img">
            <span className="nr-sum-label">Battery</span>
            <span className="nr-sum-val" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {batteryId}
              <img src="/ev_batttery.png" alt="Battery" style={{ width: 18, height: 24, objectFit: 'contain', borderRadius: 2 }} />
            </span>
          </div>
          {[
            { l: 'Plan', v: `${planType} (${duration} Day${duration > 1 ? 's' : ''})` },
            { l: 'Plan Rate', v: `₹${baseRent.toFixed(2)}` },
            { l: 'Refundable Deposit', v: `₹${deposit.toFixed(2)}` },
            ...(discount > 0 ? [{ l: 'Coupon Discount', v: `-₹${discount.toFixed(2)}` }] : []),
          ].map(r => (
            <div key={r.l} className="nr-sum-row">
              <span className="nr-sum-label">{r.l}</span>
              <span className="nr-sum-val">{r.v}</span>
            </div>
          ))}
          <div className="nr-sum-divider" />
          <div className="nr-sum-total">
            <span className="nr-sum-total-l">Total Payable (Zero GST)</span>
            <span className="nr-sum-total-r">₹{Number(totalPayable).toFixed(2)}</span>
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
  const [rentalData, setRentalData] = useState<any>(null);
  const [paymentData, setPaymentData] = useState<any>(null);

  useEffect(() => {
    try {
      setRentalData(JSON.parse(localStorage.getItem('evegah_new_ride_rental') || '{}'));
      setPaymentData(JSON.parse(localStorage.getItem('evegah_new_ride_payment') || '{}'));
    } catch (e) {}
  }, []);

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
              <Link href="/renters" className="nr-back-btn"><ILeft /> Back to Rides</Link>
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
                    <div className="doc-sec-sub">Upload clear copies of the rider's identity document and profile photo.</div>
                    <div className="doc-grid-2" style={{ marginBottom: 28 }}>
                      <DocCard
                        label="Identity Document"
                        sub="Aadhaar / Driving License / Voter ID / Passport"
                        defaultImg="/assets/aadhar.jpg"
                        storageKey="evegah_doc_identity"
                      />
                      <DocCard
                        label="Profile Photo"
                        sub="Recent passport size photo or live camera capture"
                        defaultImg="/rohit_avatar.png"
                        storageKey="evegah_doc_profile"
                      />
                    </div>

                    {/* 2. Vehicle Images */}
                    <div className="doc-sec-hd">2. Vehicle Images</div>
                    <div className="doc-sec-sub">Upload clear inspection photos of the vehicle from all 4 mandatory angles.</div>
                    <div className="doc-grid-4" style={{ marginBottom: 28 }}>
                      <VehCard label="Front View" defaultImg="/City-1.png" storageKey="evegah_veh_front" />
                      <VehCard label="Rear View" defaultImg="/City-2.png" storageKey="evegah_veh_rear" />
                      <VehCard label="Left Side View" defaultImg="/City-3.png" storageKey="evegah_veh_left" />
                      <VehCard label="Right Side View" defaultImg="/City-4.png" storageKey="evegah_veh_right" />
                    </div>

                    {/* 3. Terms & Conditions */}
                    <div className="doc-sec-hd">3. Rider Terms &amp; Conditions</div>
                    <div className="doc-terms-box">
                      <div className="doc-cb-row" onClick={() => setAgreed(!agreed)}>
                        <div className="doc-cb" style={{ background: agreed ? '#2a195c' : '#fff', borderColor: agreed ? '#2a195c' : '#D1D5DB' }}>
                          {agreed && <ICheck s={11} />}
                        </div>
                        <span className="doc-cb-label">
                          I have read, understood and agree to the{' '}
                          <span style={{ color: '#2a195c', fontWeight: 700 }}>Rider Terms &amp; Conditions</span>, vehicle safety guidelines, and battery usage policy.
                        </span>
                      </div>
                      <button type="button" className="doc-terms-link">
                        View Terms &amp; Conditions <IExt />
                      </button>
                      {agreed && (
                        <div className="doc-confirm-banner">
                          <span style={{ display: 'flex', flexShrink: 0, marginTop: 1, color: '#16A34A' }}><ICheck s={14} /></span>
                          By checking this agreement, I confirm that all rider documents and vehicle images submitted are accurate and legitimate.
                        </div>
                      )}
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
              <RightPanel rentalData={rentalData} paymentData={paymentData} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
