'use client';
import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { api } from '@/lib/api';


/* ──────────────────────────────────────────────────────────────
   VEHICLE MAP PAGE  ·  Real-Time Tracking (Leaflet)
   ────────────────────────────────────────────────────────────── */

declare global {
  interface Window {
    L: any;
  }
}
declare var L: any;

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
.vm-shell{display:flex;min-height:100vh;background:#F3F4F9;font-family:Inter,sans-serif;}
.vm-main{margin-left:240px;display:flex;flex-direction:column;min-height:100vh;width:calc(100% - 240px);}
.vm-page{flex:1;padding:0 28px 60px; background-color:#FFF;}

/* breadcrumb */
.vm-bc{display:flex;align-items:center;gap:6px;padding:14px 0 0;font-size:12px;color:#9CA3AF;}
.vm-bc a{color:#9CA3AF;text-decoration:none;}
.vm-bc a:hover{color:#2A195C;}
.vm-bc-sep{color:#D1D5DB;}
.vm-bc-cur{color:#2A195C;font-weight:600;}

/* Header Title row */
.vm-title-row{display:flex;align-items:flex-start;justify-content:space-between;margin:12px 0 18px;gap:16px;}
.vm-h1{font-size:22px;font-weight:800;color:#111827;margin:0 0 4px;}
.vm-sub{font-size:13px;color:#6B7280;margin:0;}
.vm-hdr-actions{display:flex;align-items:center;gap:10px;}
.vm-select-dropdown{padding:9px 14px;border:1.5px solid #E5E7EB;border-radius:10px;font-size:13px;color:#374151;background:#fff;font-weight:600;cursor:pointer;outline:none;transition:border-color .15s;}
.vm-select-dropdown:focus{border-color:#2A195C;}
.vm-hdr-btn{display:flex;align-items:center;gap:7px;padding:9px 16px;background:#fff;border:1.5px solid #E5E7EB;border-radius:10px;font-size:13px;font-weight:600;color:#374151;cursor:pointer;font-family:inherit;box-shadow:0 1px 3px rgba(0,0,0,.06);transition:all .15s;}
.vm-hdr-btn:hover{border-color:#2A195C;color:#2A195C;}

/* Stats cards (6 in a row) */
.vm-stats-row{display:grid;grid-template-columns:repeat(6,1fr);gap:12px;margin-bottom:20px;}
.vm-stat-card{background:#fff;border:1px solid #E5E7EB;border-radius:12px;padding:12px 14px;display:flex;align-items:center;gap:12px;box-shadow:0 1px 3px rgba(0,0,0,.05);}
.vm-stat-ic{width:36px;height:36px;border-radius:8px;background:#F5F3FF;color:#2A195C;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.vm-stat-info{min-width:0;flex:1;}
.vm-stat-lbl{font-size:10.5px;color:#9CA3AF;font-weight:600;margin-bottom:2px;display:flex;align-items:center;gap:5px;}
.vm-stat-val{font-size:18px;font-weight:800;color:#111827;line-height:1;}
.vm-dot{width:7px;height:7px;border-radius:50%;display:inline-block;}
.vm-dot.online{background:#10B981;}
.vm-dot.in_ride{background:#2A195C;}
.vm-dot.offline{background:#9CA3AF;}
.vm-dot.low_bat{background:#F59E0B;}
.vm-dot.locked{background:#EF4444;}

/* Main Map + Panel Layout grid */
.vm-layout-grid{display:grid;grid-template-columns:1fr 310px;gap:20px;margin-bottom:20px;align-items:start;}

/* Map Container Card */
.vm-map-card{background:#fff;border:1px solid #E5E7EB;border-radius:16px;box-shadow:0 1px 4px rgba(0,0,0,.06);overflow:hidden;position:relative;height:520px;}
.vm-map-bg{width:100%;height:100%;position:relative;}

/* Floating map controls (left side) */
.vm-map-ctrls{position:absolute;top:20px;left:20px;display:flex;flex-direction:column;gap:8px;z-index:1000;}
.vm-ctrl-btn{width:40px;height:48px;border-radius:10px;background:#fff;border:1px solid #E5E7EB;box-shadow:0 2px 8px rgba(0,0,0,.08);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;cursor:pointer;color:#4B5563;font-size:9px;font-weight:700;transition:all .15s;}
.vm-ctrl-btn:hover{color:#2A195C;border-color:#C7D2FE;}
.vm-ctrl-btn.active{background:#2A195C;color:#fff;border-color:#2A195C;}
.vm-ctrl-btn-icon{display:flex;}

/* Zoom buttons (bottom-left) */
.vm-zoom-ctrls{position:absolute;bottom:20px;left:20px;display:flex;flex-direction:column;gap:6px;z-index:1000;}
.vm-zoom-btn{width:36px;height:36px;border-radius:8px;background:#fff;border:1px solid #E5E7EB;box-shadow:0 2px 8px rgba(0,0,0,.08);display:flex;align-items:center;justify-content:center;cursor:pointer;color:#374151;font-size:18px;font-weight:700;transition:all .15s;}
.vm-zoom-btn:hover{border-color:#2A195C;color:#2A195C;}

/* Map Loading Overlay */
.vm-map-loading{position:absolute;inset:0;background:rgba(243,244,249,0.9);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:20;font-size:14px;color:#2A195C;font-weight:600;gap:12px;}
.vm-map-search{position:absolute;top:20px;right:20px;z-index:1000;display:flex;align-items:center;background:#fff;border:1.5px solid #E2E8F0;border-radius:10px;padding:6px 12px;width:220px;box-shadow:0 4px 12px rgba(0,0,0,.08);}
.vm-map-search-input{border:none;font-size:12.5px;outline:none;width:100%;color:#1E293B;font-weight:500;margin-left:8px;}
.vm-search-dropdown{position:absolute;top:46px;left:0;right:0;background:#fff;border:1px solid #E2E8F0;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,.08);max-height:150px;overflow-y:auto;z-index:1010;}
.vm-search-item{padding:8px 12px;font-size:12px;color:#334155;cursor:pointer;border-bottom:1px solid #F1F5F9;text-align:left;}
.vm-search-item:last-child{border-bottom:none;}
.vm-search-item:hover{background:#F5F3FF;color:#2a195c;}
.vm-search-item-empty{padding:8px 12px;font-size:12px;color:#94A3B8;text-align:center;}
.vm-spinner{width:32px;height:32px;border:3px solid #E5E7EB;border-top-color:#2A195C;border-radius:50%;animation:spin 0.8s linear infinite;}
@keyframes spin{to{transform:rotate(360deg);}}
.vm-3d-marker{animation:float-3d 2s ease-in-out infinite;transition:transform .2s;}
.selected-pulse{transform:scale(1.15);filter:drop-shadow(0px 0px 8px rgba(124,58,237,0.6)) !important;}
@keyframes float-3d{0%,100%{transform:translateY(0px);}50%{transform:translateY(-5px);}}

/* Map pin tags overlay */
.vm-pin-overlay{display:flex;flex-direction:column;align-items:center;position:relative;}
.vm-pin-overlay.selected{z-index:8;}
.vm-pin-label{background:#fff;border:1px solid #E5E7EB;box-shadow:0 2px 6px rgba(0,0,0,.15);border-radius:8px;padding:4px 8px;font-size:10.5px;font-weight:700;color:#111827;white-space:nowrap;margin-bottom:4px;display:flex;flex-direction:column;align-items:center;}
.vm-pin-sub{font-size:9px;color:#9CA3AF;margin-top:1px;font-weight:500;}
.vm-pin-orb{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,.25);border:2px solid #fff;transition:transform .2s;color:#fff;}
.vm-pin-orb.online{background:#10B981;}
.vm-pin-orb.in_ride{background:#2A195C;}
.vm-pin-orb.offline{background:#9CA3AF;}
.vm-pin-orb.low_bat{background:#F59E0B;}
.vm-pin-orb.selected-ring{box-shadow:0 0 0 4px rgba(79,70,229,0.3), 0 2px 6px rgba(0,0,0,0.25);}
.scooter-pin-live { transition: transform 1s linear !important; }
.scooter-pin-playback { transition: transform 0.1s linear !important; }

/* 3D premium effect for vehicle preview */
.vm-veh-img-wrap-3d {
  width: 100%;
  height: 180px;
  background: radial-gradient(circle at 50% 120%, #F5F3FF 0%, #FFFFFF 80%);
  border: 1px solid #E2E8F0;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02), inset 0 -4px 10px rgba(139, 92, 246, 0.03);
  perspective: 600px;
}
.vm-veh-img-3d {
  height: 120px;
  width: auto;
  object-fit: contain;
  animation: float-3d-heavy 4s ease-in-out infinite;
  filter: drop-shadow(0 20px 15px rgba(15, 23, 42, 0.15));
}
@keyframes float-3d-heavy {
  0%, 100% { transform: translateY(0px) rotateY(10deg); }
  50% { transform: translateY(-8px) rotateY(-10deg); }
}
.vm-live-status-tag {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.2);
  color: #059669;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 10.5px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
  z-index: 5;
}
.vm-live-dot-pulse {
  width: 6px;
  height: 6px;
  background-color: #10B981;
  border-radius: 50%;
  animation: status-pulse 1.5s infinite;
}
@keyframes status-pulse {
  0% { transform: scale(0.9); opacity: 1; }
  50% { transform: scale(1.4); opacity: 0.4; }
  100% { transform: scale(0.9); opacity: 1; }
}

/* Right Side Panel Selected vehicle details */
.vm-side-panel{background:#fff;border:1px solid #E5E7EB;border-radius:16px;box-shadow:0 1px 4px rgba(0,0,0,.06);overflow:hidden;height:520px;display:flex;flex-direction:column;}
.vm-side-hdr{padding:14px 16px;border-bottom:1px solid #E5E7EB;display:flex;align-items:center;justify-content:space-between;}
.vm-side-title{font-size:14px;font-weight:700;color:#111827;}
.vm-side-body{padding:14px 16px;flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:12px;}
.vm-veh-brief{display:flex;align-items:center;gap:12px;background:#F9FAFB;border-radius:10px;padding:10px 12px;border:1px solid #E5E7EB;}
.vm-veh-img-wrap{width:46px;height:46px;border-radius:8px;background:#fff;border:1px solid #E5E7EB;display:flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0;}
.vm-veh-img{width:100%;height:100%;object-fit:contain;}
.vm-veh-badge{font-size:11px;font-weight:700;padding:2px 8px;border-radius:6px;display:inline-block;}
.vm-veh-badge.online{background:#DCFCE7;color:#16A34A;}
.vm-veh-badge.low_bat{background:#FEF3C7;color:#D97706;}
.vm-veh-badge.offline{background:#F3F4F6;color:#6B7280;}

.vm-spec-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
.vm-spec-box{display:flex;flex-direction:column;gap:2px;}
.vm-spec-lbl{font-size:10.5px;color:#9CA3AF;font-weight:600;}
.vm-spec-val{font-size:12.5px;font-weight:700;color:#111827;}

/* Action grid (2x4 buttons) */
.vm-action-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:2px;}
.vm-act-btn{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;padding:8px 4px;border:1.5px solid #E5E7EB;border-radius:8px;background:#fff;cursor:pointer;transition:all .15s;}
.vm-act-btn:hover{border-color:#2A195C;color:#2A195C;background:#F5F3FF;}
.vm-act-btn-lbl{font-size:9.5px;font-weight:700;color:#374151;}

/* Ride details section */
.vm-ride-sec{border-top:1px solid #F3F4F6;padding-top:10px;display:flex;flex-direction:column;gap:6px;}
.vm-ride-sec-tit{font-size:11.5px;font-weight:700;color:#6B7280;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px;}
.vm-ride-row{display:flex;justify-content:space-between;align-items:center;font-size:12px;}
.vm-ride-lbl{color:#6B7280;}
.vm-ride-val{font-weight:600;color:#111827;text-align:right;}
.vm-ride-val-dot{display:flex;align-items:center;gap:6px;}

.vm-cta-btn{width:100%;padding:10px;background:#2A195C;color:#fff;border-radius:8px;font-size:12.5px;font-weight:700;cursor:pointer;border:none;font-family:inherit;text-align:center;text-decoration:none;box-shadow:0 2px 6px rgba(79,70,229,.35);transition:background .15s;margin-top:auto;}
.vm-cta-btn:hover{background:#4338CA;}

/* Bottom Grid cards */
.vm-bottom-grid{display:grid;grid-template-columns:1fr 1.3fr 1.1fr;gap:20px;}
.vm-bot-card{background:#fff;border:1px solid #E5E7EB;border-radius:16px;box-shadow:0 1px 4px rgba(0,0,0,.06);overflow:hidden;height:350px;display:flex;flex-direction:column;}
.vm-bot-hdr{padding:14px 18px;border-bottom:1px solid #E5E7EB;display:flex;align-items:center;justify-content:space-between;}
.vm-bot-title{font-size:13.5px;font-weight:700;color:#111827;}
.vm-bot-body{padding:14px 18px;flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:12px;}

/* Timeline elements */
.vm-timeline{display:flex;flex-direction:column;gap:0;position:relative;padding-left:18px;}
.vm-timeline::before{content:'';position:absolute;left:4px;top:6px;bottom:6px;width:1.5px;background:#E5E7EB;}
.vm-tl-item{display:flex;align-items:flex-start;justify-content:space-between;padding-bottom:14px;position:relative;}
.vm-tl-item:last-child{padding-bottom:0;}
.vm-tl-item::before{content:'';position:absolute;left:-18px;top:5px;width:9px;height:9px;border-radius:50%;border:2px solid #fff;box-shadow:0 1px 3px rgba(0,0,0,.2);z-index:2;}
.vm-tl-item.online::before{background:#10B981;}
.vm-tl-item.warning::before{background:#F59E0B;}
.vm-tl-item.in_ride::before{background:#2A195C;}
.vm-tl-time{font-size:10.5px;color:#9CA3AF;font-weight:600;width:64px;flex-shrink:0;}
.vm-tl-content{flex:1;min-width:0;padding-left:8px;}
.vm-tl-tit{font-size:12px;font-weight:700;color:#111827;margin-bottom:2px;}
.vm-tl-sub{font-size:11px;color:#6B7280;}

/* Playback map & controls */
.vm-pb-map{height:165px;border-radius:10px;overflow:hidden;position:relative;border:1px solid #E5E7EB;}
.vm-pb-ctrls{border-top:1px solid #F3F4F6;padding-top:12px;display:flex;flex-direction:column;gap:10px;}
.vm-pb-slider-row{display:flex;align-items:center;gap:12px;}
.vm-pb-slider{flex:1;height:5px;border-radius:3px;background:#E5E7EB;position:relative;cursor:pointer;}
.vm-pb-fill{height:100%;border-radius:3px;background:#2A195C;}
.vm-pb-knob{position:absolute;top:-4px;width:13px;height:13px;border-radius:50%;background:#fff;border:2px solid #2A195C;box-shadow:0 1px 3px rgba(0,0,0,.3);cursor:pointer;transform:translateX(-50%);}
.vm-pb-time-lbl{font-size:10.5px;color:#6B7280;font-weight:600;min-width:68px;text-align:right;font-family:monospace;}
.vm-pb-buttons{display:flex;align-items:center;justify-content:space-between;}
.vm-pb-btn-group{display:flex;align-items:center;gap:12px;}
.vm-play-btn{width:32px;height:32px;border-radius:50%;background:#2A195C;color:#fff;border:none;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 2px 6px rgba(79,70,229,.3);}
.vm-play-btn:hover{background:#4338CA;}

/* Active rides list items */
.vm-ride-item{display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid #F9FAFB;}
.vm-ride-item:last-child{border-bottom:none;}
.vm-ride-avatar{width:30px;height:30px;border-radius:50%;background:linear-gradient(135deg,#6366F1,#8B5CF6);color:#fff;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;}
.vm-ride-info{flex:1;min-width:0;}
.vm-ride-name-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:1px;}
.vm-ride-name{font-size:12px;font-weight:700;color:#111827;}
.vm-ride-code{font-size:11px;color:#2A195C;font-weight:700;}
.vm-ride-path{font-size:10.5px;color:#6B7280;display:flex;align-items:center;gap:4px;}
.vm-ride-badge{font-size:9.5px;font-weight:700;background:#EEF2FF;color:#2A195C;padding:2px 7px;border-radius:5px;}

/* Leaflet overrides */
.custom-map-label{border:none !important;background:none !important;}
.map-lbl{border:none !important;background:none !important;}
.kb-pin{border:none !important;background:none !important;}
.pm-pin{border:none !important;background:none !important;}
.scooter-live-pin{border:none !important;background:none !important;}
`;

/* ── SVG Icons ── */
const SI = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
const Sv = (p: React.SVGProps<SVGSVGElement> & { s?: number }) => (
  <svg width={p.s || 14} height={p.s || 14} viewBox="0 0 24 24" {...SI} {...p} />
);

const ILocate   = () => <Sv><circle cx="12" cy="12" r="10"/><line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/><line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="22" x2="12" y2="18"/></Sv>;
const IFilter   = () => <Sv><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></Sv>;
const IRefresh  = () => <Sv><path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></Sv>;
const IScooter  = ({ s = 14 }) => <Sv s={s}><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></Sv>;
const ILock     = () => <Sv><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></Sv>;
const IUnlock   = () => <Sv><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></Sv>;
const ISun      = () => <Sv><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></Sv>;
const IMoon     = () => <Sv><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></Sv>;
const IVolume   = () => <Sv><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></Sv>;
const IPower    = () => <Sv><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></Sv>;
const IMsg      = () => <Sv><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></Sv>;
const ICalendar = () => <Sv><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></Sv>;
const IPlay     = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>;
const IPause    = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>;
const IVolumeX  = () => <Sv><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></Sv>;
const IDots     = () => <Sv><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></Sv>;
const IShield   = () => <Sv><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></Sv>;
const IBarChart = ({ s = 14 }: { s?: number }) => <Sv s={s}><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></Sv>;

const formatElapsed = (secs: number) => {
  const m = String(Math.floor(secs / 60)).padStart(2, '0');
  const s = String(secs % 60).padStart(2, '0');
  return `${m}:${s}`;
};

/* ── Datasets ── */
interface EVData {
  code: string;
  status: 'Online' | 'Offline' | 'Low Battery' | 'In Ride' | 'Available' | 'Maintenance';
  badgeCls: string;
  type: string;
  battery: number;
  speed: number;
  lastUpdated: string;
  rideId: string;
  renter: string;
  pickup: string;
  destination: string;
  distance: string;
  duration: string;
  imgSrc: string;
  timeline: { time: string; tit: string; sub: string; type: string }[];
  lat: number;
  lng: number;
  playbackPoints: { lat: number; lng: number }[];
}
const EV_LIST: Record<string, EVData> = {};

const STATS = [
  { lbl: 'Total Vehicles', val: 120, ic: <IScooter s={16}/> },
  { lbl: 'Online', val: 72, dot: 'online' },
  { lbl: 'In Ride', val: 18, dot: 'in_ride' },
  { lbl: 'Offline', val: 28, dot: 'offline' },
  { lbl: 'Low Battery', val: 8, dot: 'low_bat' },
  { lbl: 'Locked', val: 6, dot: 'locked' }
];

export default function VehicleMapPage() {
  const [dbEVList, setDbEVList] = useState<Record<string, EVData>>({});
  const [loading, setLoading] = useState(true);
  const [selectedEV, setSelectedEV] = useState<string>('');
  const [mapMode, setMapMode] = useState<'live'|'history'|'geo'|'heat'>('live');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [pbProgress, setPbProgress] = useState(0);
  const [pbSpeed, setPbSpeed] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  const activeEvList = useMemo(() => {
    return dbEVList;
  }, [dbEVList]);

  // Load database vehicles and logs
  useEffect(() => {
    const fetchDbData = async () => {
      try {
        setLoading(true);
        const res = await api.get('/vehicles');
        if (res && res.status === 'success' && res.data) {
          const RENTER_NAMES = ['Rahul Sharma', 'Aarav Verma', 'Pooja Kapoor', 'Vikram Mehta', 'Neha Singh', 'Amit Kumar', 'Neha Gupta', 'Rohit Singh', 'Sneha Reddy', 'Vikram Patel'];
          const PICKUPS = ['Palika Bazaar, CP', 'Karol Bagh', 'Rajendra Place', 'Nehru Place', 'Janpath'];
          const DESTINATIONS = ['Pragati Maidan Gate 1', 'India Gate', 'Lajpat Nagar', 'Rajendra Place', 'Supreme Court'];
          const DISTANCES = ['5.2 km', '7.1 km', '9.4 km', '0 km', '3.2 km'];
          const DURATIONS = ['18 mins', '24 mins', '35 mins', '0 mins', '11 mins'];

          const mapList: Record<string, EVData> = {};
          res.data.forEach((v: any, index: number) => {
            let lat = parseFloat(v.lat);
            let lng = parseFloat(v.lng);
            if (isNaN(lat) || isNaN(lng)) {
              lat = 28.6304 + ((index % 5) * 0.003 - 0.006);
              lng = 77.2177 + ((index % 5) * 0.003 - 0.006);
            }

            const status = v.status || 'Online';
            const badgeCls = status === 'In Ride' ? 'online' : status === 'Online' ? 'online' : status === 'Low Battery' ? 'low_bat' : 'offline';

            // Simulate playback points for visualization loop
            const points = [
              { lat, lng },
              { lat: lat + 0.0003, lng: lng + 0.0004 },
              { lat: lat + 0.0006, lng: lng + 0.0006 },
              { lat: lat + 0.0004, lng: lng + 0.0009 },
              { lat: lat - 0.0001, lng: lng + 0.0005 },
              { lat, lng }
            ];

            const diffMins = Math.floor((Date.now() - new Date(v.last_seen || Date.now()).getTime()) / 60000);
            const lastUpdated = diffMins <= 0 ? 'Just now' : diffMins === 1 ? '1 min ago' : `${diffMins} mins ago`;

            const pickup = PICKUPS[index % PICKUPS.length];
            const destination = DESTINATIONS[index % DESTINATIONS.length];

            const timeline = [
              {
                time: new Date(v.last_seen || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                tit: status === 'In Ride' ? 'Ride Active' : 'Device Active',
                sub: `Location: ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
                type: status === 'In Ride' ? 'in_ride' : 'online'
              }
            ];

            mapList[v.code] = {
              code: v.code,
              status,
              badgeCls,
              type: v.evegah_model_name || 'Evegah City',
              battery: v.battery_pct || 100,
              speed: status === 'In Ride' ? 25 : 0,
              lastUpdated,
              rideId: status === 'In Ride' ? `RID-2026-${v.code.slice(-4)}` : 'None',
              renter: v.renter_name || 'None (Available)',
              pickup,
              destination,
              distance: DISTANCES[index % DISTANCES.length],
              duration: DURATIONS[index % DURATIONS.length],
              imgSrc: v.vehicle_image || '/City-1.png',
              timeline,
              lat,
              lng,
              playbackPoints: points
            };
          });

          setDbEVList(mapList);

          // Select first vehicle code
          const firstKey = Object.keys(mapList)[0];
          if (firstKey) {
            setSelectedEV(firstKey);
          }
        }
      } catch (err) {
        console.error('Error fetching live vehicles:', err);
      } finally {
        setLoading(false);
      }
    };

    if (leafletLoaded) {
      fetchDbData();
    }
  }, [leafletLoaded]);

  const filteredEVs = useMemo(() => {
    return Object.values(activeEvList).filter(ev =>
      ev.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, activeEvList]);

  const handleSearchSelect = (code: string, lat: number, lng: number) => {
    setSelectedEV(code);
    setSearchQuery(code);
    setShowSearchDropdown(false);
    if (mainMapInstance.current) {
      mainMapInstance.current.setView([lat, lng], 17.5);
    }
  };

  const currentEVData = activeEvList[selectedEV] || Object.values(activeEvList)[0] || {
    code: 'N/A',
    status: 'Offline',
    badgeCls: 'offline',
    type: 'N/A',
    battery: 0,
    speed: 0,
    lastUpdated: 'Never',
    rideId: 'None',
    renter: 'None',
    pickup: 'N/A',
    destination: 'N/A',
    distance: '0 km',
    duration: '0 mins',
    imgSrc: '/3d_scooter_rider.png',
    timeline: [],
    lat: 28.6304,
    lng: 77.2177,
    playbackPoints: []
  };
  const timerRef = useRef<NodeJS.Timeout|null>(null);

  // Maps Refs
  const mainMapInstance = useRef<any>(null);
  const pbMapInstance = useRef<any>(null);
  const LRef = useRef<any>(null);

  const mainMarkers = useRef<Record<string, any>>({});
  const mainPathPolylines = useRef<any[]>([]);
  const pbPolyline = useRef<any>(null);
  const pbMarkerInstance = useRef<any>(null);
  const cpGeofencePolygon = useRef<any>(null);

  // Dynamic Leaflet Loader
  useEffect(() => {
    if (window.L) {
      LRef.current = window.L;
      setLeafletLoaded(true);
      return;
    }
    
    // Load CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);
    
    // Load JS
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    script.onload = () => {
      LRef.current = (window as any).L;
      setLeafletLoaded(true);
    };
    document.head.appendChild(script);
  }, []);

  // Playback Interval timer
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setPbProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return prev + 1 * pbSpeed;
        });
      }, 100);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, pbSpeed]);

  const togglePlayback = () => setIsPlaying(!isPlaying);
  const resetPlayback = () => {
    setIsPlaying(false);
    setPbProgress(0);
  };

  // Interpolate coordinates for Playback Map Marker
  const getPlaybackMarkerPos = () => {
    const pts = currentEVData.playbackPoints;
    if (!pts || pts.length === 0) return { lat: 28.6304, lng: 77.2177 };
    const idx = Math.min(pts.length - 1, Math.floor((pbProgress / 100) * (pts.length - 1)));
    const nextIdx = Math.min(pts.length - 1, idx + 1);
    const t = ((pbProgress / 100) * (pts.length - 1)) - idx;
    return {
      lat: pts[idx].lat + t * (pts[nextIdx].lat - pts[idx].lat),
      lng: pts[idx].lng + t * (pts[nextIdx].lng - pts[idx].lng)
    };
  };

  const markerPos = getPlaybackMarkerPos();

  // Leaflet Maps Initialization
  useEffect(() => {
    if (!leafletLoaded || !LRef.current) return;
    const L = LRef.current;
    
    const mapContainer = document.getElementById("main-leaflet-map");
    if (mapContainer && !mapContainer.classList.contains("leaflet-container")) {
      mainMapInstance.current = L.map("main-leaflet-map", {
        zoomControl: false,
        attributionControl: false
      }).setView([28.6304, 77.2177], 17.5);
      
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(mainMapInstance.current);
      
      // CP Geofence circle
      cpGeofencePolygon.current = L.circle([28.6304, 77.2177], {
        color: '#2A195C',
        fillColor: '#2A195C',
        fillOpacity: 0.12,
        radius: 650,
        weight: 1.5,
        dashArray: '5, 5'
      }).addTo(mainMapInstance.current);

      L.marker([28.6304, 77.2177], {
        icon: L.divIcon({
          className: 'custom-map-label',
          html: '<div style="font-size:12px;font-weight:800;color:#3730A3;text-align:center;">Connaught<br>Place</div>',
          iconSize: [80, 40],
          iconAnchor: [40, 20]
        })
      }).addTo(mainMapInstance.current);
    }
    
    const pbMapContainer = document.getElementById("playback-leaflet-map");
    if (pbMapContainer && !pbMapContainer.classList.contains("leaflet-container")) {
      pbMapInstance.current = L.map("playback-leaflet-map", {
        zoomControl: false,
        attributionControl: false
      }).setView([28.6304, 77.2177], 17.5);
      
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(pbMapInstance.current);
      
      pbPolyline.current = L.polyline([], {
        color: '#2A195C',
        weight: 4,
        opacity: 0.9
      }).addTo(pbMapInstance.current);
      
      // Playback Marker
      const dotIcon = L.divIcon({
        className: 'scooter-pin-playback pb-marker-dot',
        html: `
          <div class="vm-pin-overlay selected">
            <div class="vm-3d-marker selected-pulse" style="width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; filter: drop-shadow(0px 3px 6px rgba(0,0,0,0.25));">
              <img src="/3d_scooter_rider.png" style="width: 100%; height: 100%; object-fit: contain;" alt="scooter" />
            </div>
          </div>
        `,
        iconSize: [48, 48],
        iconAnchor: [24, 24]
      });
      pbMarkerInstance.current = L.marker([28.6304, 77.2177], { icon: dotIcon }).addTo(pbMapInstance.current);
    }

    return () => {
      if (mainMapInstance.current) {
        try {
          mainMapInstance.current.remove();
        } catch (e) {
          console.error('Error removing main map:', e);
        }
        mainMapInstance.current = null;
      }
      if (pbMapInstance.current) {
        try {
          pbMapInstance.current.remove();
        } catch (e) {
          console.error('Error removing playback map:', e);
        }
        pbMapInstance.current = null;
      }
    };
  }, [leafletLoaded]);

  // Main Map Elements & Markers Update
  useEffect(() => {
    if (!leafletLoaded || !mainMapInstance.current || !LRef.current) return;
    const L = LRef.current;
    
    // Clear old main markers
    Object.values(mainMarkers.current).forEach((m: any) => mainMapInstance.current.removeLayer(m));
    mainMarkers.current = {};
    
    // Clear old paths
    mainPathPolylines.current.forEach((p: any) => mainMapInstance.current.removeLayer(p));
    mainPathPolylines.current = [];
    
    // Add markers
    Object.values(activeEvList).forEach(ev => {
      const isSel = ev.code === selectedEV;
      const statusColor = ev.status === 'In Ride' ? '#2A195C' : ev.status === 'Available' ? '#10B981' : ev.status === 'Maintenance' ? '#EF4444' : '#9CA3AF';
      
      const pinIcon = L.divIcon({
        className: 'scooter-pin-live',
        html: `
          <div class="vm-pin-overlay ${isSel ? 'selected' : ''}">
            <div class="vm-pin-label">
              ${ev.code}
              <span class="vm-pin-sub" style="color: ${statusColor}; font-weight: 700; display: flex; align-items: center; gap: 3px; justify-content: center;">
                <span style="width: 5px; height: 5px; border-radius: 50%; background-color: ${statusColor}; display: inline-block; animation: ${ev.status === 'In Ride' ? 'status-pulse 1.2s infinite' : 'none'};"></span>
                ${ev.status}
              </span>
            </div>
            <div class="vm-3d-marker ${isSel ? 'selected-pulse' : ''}" style="width: 54px; height: 54px; display: flex; align-items: center; justify-content: center; filter: drop-shadow(0px 4px 8px rgba(0,0,0,0.35));">
              <img src="${ev.imgSrc || '/City-1.png'}" style="width: 100%; height: 100%; object-fit: contain;" alt="model icon" />
            </div>
          </div>
        `,
        iconSize: [60, 90],
        iconAnchor: [30, 90]
      });
      
      const m = L.marker([ev.lat, ev.lng], { icon: pinIcon }).addTo(mainMapInstance.current);
      m.on('click', () => {
        setSelectedEV(ev.code);
        resetPlayback();
      });
      
      mainMarkers.current[ev.code] = m;
    });

    // Show/Hide Geofence
    if (cpGeofencePolygon.current) {
      if (mapMode === 'live' || mapMode === 'geo') {
        cpGeofencePolygon.current.addTo(mainMapInstance.current);
      } else {
        mainMapInstance.current.removeLayer(cpGeofencePolygon.current);
      }
    }
    
    // Draw live paths on main map
    if (mapMode === 'live') {
      const currentEV = activeEvList[selectedEV];
      const pts = (currentEV && currentEV.playbackPoints && currentEV.playbackPoints.length > 0)
        ? currentEV.playbackPoints.map(p => [p.lat, p.lng])
        : [
            [28.6448, 77.1888],
            [28.6422, 77.2144],
            [28.6304, 77.2177]
          ];
      const path1 = L.polyline(pts, {
        color: '#2A195C',
        weight: 3.5,
        opacity: 0.8,
        dashArray: '5, 5'
      }).addTo(mainMapInstance.current);
      mainPathPolylines.current.push(path1);
    }
    
    // Pan to selected vehicle
    const currentEV = activeEvList[selectedEV];
    if (currentEV) {
      mainMapInstance.current.panTo([currentEV.lat, currentEV.lng]);
    }
  }, [leafletLoaded, selectedEV, mapMode, activeEvList]);

  // Bottom Playback Map Update
  useEffect(() => {
    if (!leafletLoaded || !pbMapInstance.current || !LRef.current) return;
    const L = LRef.current;
    
    const currentEV = activeEvList[selectedEV] || Object.values(activeEvList)[0] || currentEVData;
    
    if (pbPolyline.current && currentEV && currentEV.playbackPoints) {
      const latlngs = currentEV.playbackPoints.map(p => [p.lat, p.lng]);
      pbPolyline.current.setLatLngs(latlngs);
      
      if (latlngs.length > 0) {
        pbMapInstance.current.fitBounds(pbPolyline.current.getBounds(), { padding: [20, 20] });
      }
    }
  }, [leafletLoaded, selectedEV, activeEvList]);

  // Playback Marker Position Update
  useEffect(() => {
    if (!leafletLoaded || !pbMarkerInstance.current) return;
    pbMarkerInstance.current.setLatLng([markerPos.lat, markerPos.lng]);
  }, [leafletLoaded, markerPos]);

  // Vehicle real-time moving simulation animation loop
  useEffect(() => {
    if (!leafletLoaded || Object.keys(activeEvList).length === 0) return;
    
    // Track step coordinates for each vehicle
    const vehicleSteps: Record<string, number> = {};
    Object.keys(activeEvList).forEach(code => {
      vehicleSteps[code] = 0;
    });

    const interval = setInterval(() => {
      Object.keys(activeEvList).forEach(code => {
        const marker = mainMarkers.current[code];
        if (!marker) return;

        const ev = activeEvList[code];
        const pts = ev.playbackPoints;
        if (!pts || pts.length === 0) return;

        let currentStep = vehicleSteps[code] || 0;
        currentStep += 0.05; // slowly advance index
        if (currentStep >= pts.length - 1) {
          currentStep = 0; // loop
        }
        vehicleSteps[code] = currentStep;

        const idx = Math.floor(currentStep);
        const nextIdx = (idx + 1) % pts.length;
        const t = currentStep - idx;

        const lat = pts[idx].lat + t * (pts[nextIdx].lat - pts[idx].lat);
        const lng = pts[idx].lng + t * (pts[nextIdx].lng - pts[idx].lng);

        marker.setLatLng([lat, lng]);
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [leafletLoaded, activeEvList]);

  // Programmatic Zoom controls
  const handleZoomIn = () => {
    if (mainMapInstance.current) mainMapInstance.current.zoomIn();
  };
  const handleZoomOut = () => {
    if (mainMapInstance.current) mainMapInstance.current.zoomOut();
  };
  const handleRecenter = () => {
    if (mainMapInstance.current) {
      const currentEV = activeEvList[selectedEV];
      if (currentEV) {
        mainMapInstance.current.setView([currentEV.lat, currentEV.lng], 14);
      }
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="vm-shell">
        <Sidebar activePath="/vehicles/map"/>
        <div className="vm-main">
          <TopBar/>
          <div className="vm-page">

            {/* Breadcrumb */}
            <div className="vm-bc">
              <Link href="/">Home</Link>
              <span className="vm-bc-sep">›</span>
              <a href="#">Vehicles</a>
              <span className="vm-bc-sep">›</span>
              <span className="vm-bc-cur">Map</span>
            </div>

            {/* Title Row */}
            <div className="vm-title-row">
              <div>
                <h1 className="vm-h1">Vehicle Map</h1>
                <p className="vm-sub">Track vehicles in real-time, view history and perform actions.</p>
              </div>
              <div className="vm-hdr-actions">
                <select className="vm-select-dropdown">
                  <option>All Vehicles</option>
                  <option>Scooters Only</option>
                  <option>Batteries Only</option>
                </select>
                <button className="vm-hdr-btn"><IFilter/> Filters</button>
                <button className="vm-hdr-btn" onClick={() => window.location.reload()}><IRefresh/> Refresh</button>
              </div>
            </div>

            {/* Metric KPI cards */}
            <div className="vm-stats-row">
              {STATS.map(s => (
                <div className="vm-stat-card" key={s.lbl}>
                  <div className="vm-stat-ic">
                    {s.ic ? s.ic : <div className={`vm-dot ${s.dot}`}/>}
                  </div>
                  <div className="vm-stat-info">
                    <div className="vm-stat-lbl">{s.lbl}</div>
                    <div className="vm-stat-val">{s.val}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Main Layout Grid */}
            <div className="vm-layout-grid">
              
              {/* Left Column: Map */}
              <div className="vm-map-card">
                {/* Loader overlay */}
                {!leafletLoaded && (
                  <div className="vm-map-loading">
                    <div className="vm-spinner" />
                    Loading interactive Leaflet Map...
                  </div>
                )}
                
                {/* Real Leaflet Map Div */}
                <div id="main-leaflet-map" style={{ width: '100%', height: '100%', background: '#E5E7EB' }} />

                {/* Floating Map Search Bar (Top Right) */}
                {leafletLoaded && (
                  <div className="vm-map-search">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: '#9CA3AF', flexShrink: 0 }}>
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                      type="text"
                      className="vm-map-search-input"
                      placeholder="Search vehicle..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowSearchDropdown(true);
                      }}
                      onFocus={() => setShowSearchDropdown(true)}
                      onBlur={() => setTimeout(() => setShowSearchDropdown(false), 200)}
                    />
                    {showSearchDropdown && searchQuery && (
                      <div className="vm-search-dropdown">
                        {filteredEVs.length === 0 ? (
                          <div className="vm-search-item-empty">No vehicles found</div>
                        ) : (
                          filteredEVs.map((ev: any) => (
                            <div
                              key={ev.code}
                              className="vm-search-item"
                              onClick={() => handleSearchSelect(ev.code, ev.lat, ev.lng)}
                            >
                              <span style={{ fontWeight: 700 }}>{ev.code}</span>
                              <span style={{ fontSize: '10px', color: '#9CA3AF' }}> ({ev.status})</span>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                )}
                
                {/* Floating map controls (left side) */}
                <div className="vm-map-ctrls">
                  <div className={`vm-ctrl-btn ${mapMode==='live'?'active':''}`} onClick={() => setMapMode('live')}>
                    <span className="vm-ctrl-btn-icon"><ILocate/></span>
                    Live
                  </div>
                  <div className={`vm-ctrl-btn ${mapMode==='history'?'active':''}`} onClick={() => setMapMode('history')}>
                    <span className="vm-ctrl-btn-icon"><ICalendar/></span>
                    History
                  </div>
                  <div className={`vm-ctrl-btn ${mapMode==='geo'?'active':''}`} onClick={() => setMapMode('geo')}>
                    <span className="vm-ctrl-btn-icon"><IShield/></span>
                    Geofences
                  </div>
                  <div className={`vm-ctrl-btn ${mapMode==='heat'?'active':''}`} onClick={() => setMapMode('heat')}>
                    <span className="vm-ctrl-btn-icon"><IBarChart/></span>
                    Heatmap
                  </div>
                </div>

                {/* Zoom controls */}
                <div className="vm-zoom-ctrls">
                  <div className="vm-zoom-btn" onClick={handleZoomIn}>+</div>
                  <div className="vm-zoom-btn" onClick={handleZoomOut}>-</div>
                  <div className="vm-zoom-btn" style={{ fontSize: 13 }} onClick={handleRecenter}><ILocate/></div>
                </div>
              </div>

              {/* Right Column: Side details Panel */}
              <div className="vm-side-panel">
                <div className="vm-side-hdr">
                  <div className="vm-side-title">Selected Vehicle</div>
                  <div style={{ color: '#9CA3AF', fontSize: 13, cursor: 'pointer' }} onClick={() => setSelectedEV(Object.keys(activeEvList)[0] || 'EV-12KA-1234')}>✕</div>
                </div>
                <div className="vm-side-body">
                  
                  {/* Brief Info with 3D Image & Live Running Status */}
                  <div className="vm-veh-img-wrap-3d">
                    {currentEVData.status === 'In Ride' ? (
                      <div className="vm-live-status-tag">
                        <div className="vm-live-dot-pulse" style={{ backgroundColor: '#10B981' }} />
                        Running ({currentEVData.speed || '25'} km/h)
                      </div>
                    ) : currentEVData.status === 'Available' ? (
                      <div className="vm-live-status-tag" style={{ color: '#8B5CF6', background: 'rgba(139, 92, 246, 0.1)', borderColor: 'rgba(139, 92, 246, 0.2)' }}>
                        <div className="vm-live-dot-pulse" style={{ backgroundColor: '#8B5CF6' }} />
                        Available
                      </div>
                    ) : (
                      <div className="vm-live-status-tag" style={{ color: '#64748B', background: 'rgba(100, 116, 139, 0.1)', borderColor: 'rgba(100, 116, 139, 0.2)' }}>
                        <div className="vm-live-dot-pulse" style={{ backgroundColor: '#64748B' }} />
                        Offline
                      </div>
                    )}
                    <img className="vm-veh-img-3d" src={currentEVData.imgSrc} alt={currentEVData.code}/>
                  </div>

                  <div className="vm-veh-brief" style={{ marginTop: '4px' }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: '#111827', marginBottom: 2 }}>{currentEVData.code}</div>
                      <span className={`vm-veh-badge ${currentEVData.badgeCls}`}>{currentEVData.status}</span>
                    </div>
                  </div>

                  {/* Speed/Battery specs */}
                  <div className="vm-spec-grid">
                    <div className="vm-spec-box">
                      <span className="vm-spec-lbl">Vehicle Type</span>
                      <span className="vm-spec-val">{currentEVData.type}</span>
                    </div>
                    <div className="vm-spec-grid">
                      <span className="vm-spec-lbl">Battery Level</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                        <span className="vm-spec-val">{currentEVData.battery}%</span>
                        <div style={{ flex: 1, height: 6, background: '#E5E7EB', borderRadius: 3, overflow: 'hidden', width: 44 }}>
                          <div style={{ 
                            height: '100%', 
                            background: currentEVData.battery < 20 ? '#EF4444' : currentEVData.battery < 50 ? '#F59E0B' : '#10B981', 
                            width: `${currentEVData.battery}%` 
                          }}/>
                        </div>
                      </div>
                    </div>
                    <div className="vm-spec-box">
                      <span className="vm-spec-lbl">Current Speed</span>
                      <span className="vm-spec-val">{currentEVData.speed} km/h</span>
                    </div>
                    <div className="vm-spec-box">
                      <span className="vm-spec-lbl">Last Updated</span>
                      <span className="vm-spec-val">{currentEVData.lastUpdated}</span>
                    </div>
                    <div className="vm-spec-box">
                      <span className="vm-spec-lbl">Current Ride</span>
                      <Link href={`/vehicles/detail`} className="vm-spec-val" style={{ color: '#2A195C', textDecoration: 'underline' }}>{currentEVData.rideId}</Link>
                    </div>
                    <div className="vm-spec-box">
                      <span className="vm-spec-lbl">Renter</span>
                      <span className="vm-spec-val">{currentEVData.renter}</span>
                    </div>
                  </div>

                  {/* Actions Grid */}
                  <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: 10 }}>
                    <span className="vm-ride-sec-tit">Vehicle Actions</span>
                    <div className="vm-action-grid">
                      <div className="vm-act-btn"><ILock/><span className="vm-act-btn-lbl">Lock</span></div>
                      <div className="vm-act-btn"><IUnlock/><span className="vm-act-btn-lbl">Unlock</span></div>
                      <div className="vm-act-btn"><ISun/><span className="vm-act-btn-lbl">Lights On</span></div>
                      <div className="vm-act-btn"><IMoon/><span className="vm-act-btn-lbl">Lights Off</span></div>
                      <div className="vm-act-btn"><IVolume/><span className="vm-act-btn-lbl">Horn</span></div>
                      <div className="vm-act-btn" onClick={handleRecenter}><ILocate/><span className="vm-act-btn-lbl">Locate</span></div>
                      <div className="vm-act-btn"><IPower/><span className="vm-act-btn-lbl">Restart</span></div>
                      <div className="vm-act-btn"><IDots/><span className="vm-act-btn-lbl">More</span></div>
                    </div>
                  </div>

                  {/* Current Ride Info */}
                  <div className="vm-ride-sec">
                    <span className="vm-ride-sec-tit">Ride Details (Current)</span>
                    <div className="vm-ride-row">
                      <span className="vm-ride-lbl">Pickup Time</span>
                      <span className="vm-ride-val">10:15 AM</span>
                    </div>
                    <div className="vm-ride-row">
                      <span className="vm-ride-lbl">Start Location</span>
                      <span className="vm-ride-val vm-ride-val-dot">
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981' }}/>
                        {currentEVData.pickup}
                      </span>
                    </div>
                    <div className="vm-ride-row">
                      <span className="vm-ride-lbl">Destination</span>
                      <span className="vm-ride-val vm-ride-val-dot">
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#2A195C' }}/>
                        {currentEVData.destination}
                      </span>
                    </div>
                    <div className="vm-ride-row">
                      <span className="vm-ride-lbl">Distance</span>
                      <span className="vm-ride-val">{currentEVData.distance}</span>
                    </div>
                    <div className="vm-ride-row">
                      <span className="vm-ride-lbl">Ride Duration</span>
                      <span className="vm-ride-val">{currentEVData.duration}</span>
                    </div>
                  </div>

                  {/* Full Details CTA */}
                  <Link href={`/vehicles/detail`} className="vm-cta-btn">View Ride Details</Link>
                </div>
              </div>

            </div>

            {/* Bottom Cards Section */}
            <div className="vm-bottom-grid">
              
              {/* Timeline Card */}
              <div className="vm-bot-card">
                <div className="vm-bot-hdr">
                  <div className="vm-bot-title">Vehicle History ({currentEVData.code})</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: '#2A195C', fontWeight: 600 }}>
                    <ICalendar/> 20 May 2024
                  </div>
                </div>
                <div className="vm-bot-body">
                  <div className="vm-timeline">
                    {currentEVData.timeline.map((t, idx) => (
                      <div className={`vm-tl-item ${t.type}`} key={idx}>
                        <span className="vm-tl-time">{t.time}</span>
                        <div className="vm-tl-content">
                          <div className="vm-tl-tit">{t.tit}</div>
                          <div className="vm-tl-sub">{t.sub}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Playback Card */}
              <div className="vm-bot-card">
                <div className="vm-bot-hdr">
                  <div className="vm-bot-title">Path Playback</div>
                  <a href="#" style={{ fontSize: 11.5, color: '#2A195C', fontWeight: 700, textDecoration: 'none' }}>Full History</a>
                </div>
                <div className="vm-bot-body">
                  
                  {/* Playback map box */}
                  <div className="vm-pb-map">
                    {/* Leaflet Map element for Path Playback */}
                    <div id="playback-leaflet-map" style={{ width: '100%', height: '100%', background: '#F3F4F9' }} />
                  </div>

                  {/* Playback controls */}
                  <div className="vm-pb-ctrls">
                    <div className="vm-pb-slider-row">
                      <div 
                        className="vm-pb-slider"
                        onClick={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const pct = Math.floor(((e.clientX - rect.left) / rect.width) * 100);
                          setPbProgress(Math.max(0, Math.min(100, pct)));
                        }}
                      >
                        <div className="vm-pb-fill" style={{ width: `${pbProgress}%` }}/>
                        <div className="vm-pb-knob" style={{ left: `${pbProgress}%` }}/>
                      </div>
                      <span className="vm-pb-time-lbl">
                        {formatElapsed(Math.floor((pbProgress / 100) * 1455))} / 24:15
                      </span>
                    </div>

                    <div className="vm-pb-buttons">
                      <div className="vm-pb-btn-group">
                        <button className="vm-play-btn" onClick={togglePlayback}>
                          {isPlaying ? <IPause/> : <IPlay/>}
                        </button>
                        <button style={{ background: 'none', border: 'none', color: '#4B5563', cursor: 'pointer' }} onClick={() => setPbProgress(0)}>
                          <IRefresh/>
                        </button>
                        <button style={{ background: 'none', border: 'none', color: '#4B5563', cursor: 'pointer' }} onClick={() => setIsMuted(!isMuted)}>
                          {isMuted ? <IVolumeX/> : <IVolume/>}
                        </button>
                      </div>
                      
                      {/* Playback speed selector */}
                      <select 
                        style={{ padding: '4px 8px', border: '1px solid #E5E7EB', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
                        value={pbSpeed}
                        onChange={(e) => setPbSpeed(Number(e.target.value))}
                      >
                        <option value={1}>1x Speed</option>
                        <option value={2}>2x Speed</option>
                        <option value={4}>4x Speed</option>
                      </select>
                    </div>
                  </div>

                </div>
              </div>

              {/* Active Rides List */}
              <div className="vm-bot-card">
                <div className="vm-bot-hdr">
                  <div className="vm-bot-title">Active Rides ({Object.keys(activeEvList).length})</div>
                  <Link href="/vehicles/active" style={{ fontSize: 11.5, color: '#2A195C', fontWeight: 700, textDecoration: 'none' }}>View All</Link>
                </div>
                <div className="vm-bot-body">
                  
                  {Object.values(activeEvList).map(ev => {
                    const initials = ev.renter.split(' ').map(n=>n[0]).join('');
                    return (
                      <div className="vm-ride-item" key={ev.code}>
                        <div className="vm-ride-avatar">{initials}</div>
                        <div className="vm-ride-info">
                          <div className="vm-ride-name-row">
                            <span className="vm-ride-name">{ev.renter}</span>
                            <span className="vm-ride-code">{ev.code}</span>
                          </div>
                          <div className="vm-ride-path">
                            <span>{ev.pickup}</span>
                            <span>→</span>
                            <span>{ev.destination}</span>
                          </div>
                        </div>
                        <span className="vm-ride-badge">In Ride</span>
                      </div>
                    );
                  })}

                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </>
  );
}
