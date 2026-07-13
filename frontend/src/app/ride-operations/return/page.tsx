'use client';
import { useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

/* ═══════════════════════════════════════════════════════════════
   RIDE OPERATIONS – RETURN VEHICLE  (Employee Portal)
   4 Steps: Search Rider → Vehicle Inspection → Settlement → Return Confirmation
   ═══════════════════════════════════════════════════════════════ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
.emp-shell{display:flex;height:100vh;overflow:hidden;background:#fff;font-family:Inter,sans-serif;}

/* ── Sidebar ── */
.emp-sb{width:224px;border-right:1px solid #E5E7EB;display:flex;flex-direction:column;height:100vh;overflow-y:auto;flex-shrink:0;background:#fff;}
.emp-sb-logo{display:flex;align-items:center;gap:10px;padding:15px 18px;border-bottom:1px solid #F3F4F6;}
.emp-logo-ic{width:32px;height:32px;background:linear-gradient(135deg,#2A195C,#2A195C);border-radius:8px;display:flex;align-items:center;justify-content:center;}
.emp-logo-text{font-size:19px;font-weight:800;color:#111827;letter-spacing:-.5px;}
.emp-logo-text span{color:#2A195C;}
.emp-ham{width:32px;height:32px;display:flex;align-items:center;justify-content:center;border-radius:8px;cursor:pointer;flex-shrink:0;margin-left:auto;}
.emp-sb-section{padding:12px 12px 0;}
.emp-sb-sec-lbl{font-size:10.5px;font-weight:700;color:#9CA3AF;text-transform:uppercase;letter-spacing:.06em;padding:0 8px;margin-bottom:5px;display:block;}
.emp-sb-item{display:flex;align-items:center;gap:9px;padding:8px 10px;border-radius:8px;font-size:13.5px;font-weight:500;color:#374151;cursor:pointer;margin-bottom:2px;transition:all .15s;text-decoration:none;}
.emp-sb-item.active{background:#EEF2FF;color:#2A195C;font-weight:700;}
.emp-sb-item:hover:not(.active){background:#F9FAFB;color:#111827;}
.emp-sb-footer{margin-top:auto;padding:12px 14px;border-top:1px solid #F3F4F6;}
.emp-need-help{background:#F9FAFB;border:1px solid #E5E7EB;border-radius:10px;padding:12px;margin-bottom:10px;}
.emp-need-help-ic{width:28px;height:28px;border-radius:50%;background:#EEF2FF;display:flex;align-items:center;justify-content:center;color:#2A195C;margin-bottom:7px;}
.emp-need-help-title{font-size:12.5px;font-weight:700;color:#111827;margin-bottom:2px;}
.emp-need-help-sub{font-size:11px;color:#6B7280;margin-bottom:8px;}
.emp-raise-ticket{display:flex;align-items:center;gap:5px;font-size:12px;font-weight:700;color:#2A195C;cursor:pointer;text-decoration:none;}
.emp-raise-ticket:hover{text-decoration:underline;}
.emp-version{font-size:10.5px;color:#9CA3AF;text-align:center;padding-top:10px;}

/* ── Main area ── */
.emp-main{margin-left:230px;flex:1;display:flex;flex-direction:column;overflow:hidden;min-width:0;background:#fff;}

/* ── Topbar ── */
.emp-topbar{display:flex;align-items:center;padding:10px 20px;background:#fff;border-bottom:1px solid #E5E7EB;gap:14px;flex-shrink:0;}
.emp-page-info{flex-shrink:0;}
.emp-page-title{font-size:17px;font-weight:800;color:#111827;}
.emp-page-sub{font-size:11.5px;color:#6B7280;margin-top:1px;}
.emp-search-bar{flex:1;max-width:420px;display:flex;align-items:center;gap:9px;padding:8px 14px;background:#F9FAFB;border:1px solid #E5E7EB;border-radius:10px;color:#9CA3AF;font-size:13px;cursor:text;}
.emp-search-inp{flex:1;border:none;background:none;outline:none;font-size:13px;color:#374151;font-family:inherit;}
.emp-search-inp::placeholder{color:#9CA3AF;}
.emp-topbar-right{display:flex;align-items:center;gap:10px;margin-left:auto;flex-shrink:0;}
.emp-notif-btn{position:relative;width:36px;height:36px;border-radius:9px;background:#F9FAFB;border:1px solid #E5E7EB;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#6B7280;}
.emp-notif-badge{position:absolute;top:-4px;right:-4px;width:16px;height:16px;border-radius:50%;background:#EF4444;font-size:9.5px;font-weight:800;color:#fff;display:flex;align-items:center;justify-content:center;border:2px solid #fff;}
.emp-user-chip{display:flex;align-items:center;gap:8px;padding:4px 12px 4px 4px;border:1px solid #E5E7EB;border-radius:24px;cursor:pointer;}
.emp-user-av{width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#2A195C,#2A195C);display:flex;align-items:center;justify-content:center;font-size:11.5px;font-weight:800;color:#fff;flex-shrink:0;}
.emp-user-name{font-size:12.5px;font-weight:700;color:#111827;}
.emp-user-role{font-size:10.5px;color:#9CA3AF;}

/* ── Tabs ── */
.emp-tabs{display:flex;background:#fff;border-bottom:1px solid #E5E7EB;flex-shrink:0;}
.emp-tab{display:flex;align-items:center;gap:8px;padding:13px 22px;font-size:13.5px;font-weight:600;color:#6B7280;cursor:pointer;border-bottom:2.5px solid transparent;transition:all .15s;white-space:nowrap;}
.emp-tab.active{color:#2A195C;border-bottom-color:#2A195C;}
.emp-tab:hover:not(.active){color:#374151;}

/* ── Content split ── */
.emp-content-wrap{flex:1;overflow:hidden;display:grid;grid-template-columns:1fr 300px;}
.emp-step-area{overflow-y:auto;padding:20px 22px 40px;}
.emp-rp-area{border-left:1px solid #E5E7EB;overflow-y:auto;background:#fff;}

/* ── Stepper ── */
.ro-stepper{display:flex;align-items:center;margin-bottom:22px;}
.ro-sw{display:flex;align-items:center;flex:1;}
.ro-step{display:flex;align-items:center;gap:8px;}
.ro-sc{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12.5px;font-weight:800;flex-shrink:0;}
.ro-sc.done{background:#2A195C;color:#fff;}
.ro-sc.act{background:#2A195C;color:#fff;}
.ro-sc.pend{background:#fff;border:2px solid #D1D5DB;color:#9CA3AF;}
.ro-sn{font-size:12.5px;font-weight:700;color:#111827;white-space:nowrap;}
.ro-sn.pend{color:#6B7280;font-weight:500;}
.ro-ss{font-size:11px;margin-top:2px;white-space:nowrap;}
.ro-ss.done{color:#22C55E;}
.ro-ss.act{color:#2A195C;}
.ro-ss.pend{color:#9CA3AF;}
.ro-sl{flex:1;height:2px;background:#E5E7EB;margin:0 10px;min-width:12px;}
.ro-sl.done{background:#22C55E;}

/* ── Rider card (steps 2-4) ── */
.ro-rider-card{background:#fff;border:1px solid #E5E7EB;border-radius:12px;padding:16px 20px;margin-bottom:18px;display:flex;align-items:center;gap:16px;}
.ro-rider-av-wrap{flex-shrink:0;}
.ro-rider-info{flex-shrink:0;min-width:170px;}
.ro-rider-name{font-size:15px;font-weight:800;color:#111827;display:flex;align-items:center;gap:8px;margin-bottom:5px;}
.ro-kyc-badge{background:#DCFCE7;color:#16A34A;border:1px solid #BBF7D0;border-radius:6px;font-size:10.5px;font-weight:700;padding:2px 8px;display:inline-flex;align-items:center;gap:3px;}
.ro-rider-meta{display:flex;align-items:center;gap:6px;font-size:12px;color:#6B7280;margin-bottom:3px;}
.ro-divider-v{width:1px;background:#E5E7EB;height:60px;flex-shrink:0;}
.ro-ride-info-col{display:flex;flex-direction:column;gap:4px;padding:0 16px;}
.ro-ride-info-label{font-size:11.5px;color:#9CA3AF;}
.ro-ride-info-val{font-size:13px;font-weight:700;color:#111827;}
.ro-active-badge{background:#DCFCE7;color:#16A34A;border-radius:5px;font-size:11px;font-weight:700;padding:2px 8px;display:inline-block;}
.ro-delay-badge{background:#FEE2E2;color:#EF4444;border-radius:5px;font-size:11px;font-weight:700;padding:2px 8px;display:inline-block;}
.ro-late-text{color:#EF4444;font-weight:700;}

/* ── Search step ── */
.ro-search-card{background:#fff;border:1px solid #E5E7EB;border-radius:12px;overflow:hidden;margin-bottom:16px;}
.ro-search-hdr{padding:14px 20px;border-bottom:1px solid #F3F4F6;display:flex;align-items:flex-start;justify-content:space-between;gap:10px;}
.ro-search-title{font-size:15px;font-weight:800;color:#111827;}
.ro-search-sub{font-size:12px;color:#6B7280;margin-top:3px;}
.ro-qr-btn{display:flex;align-items:center;gap:7px;padding:8px 16px;background:#fff;border:1.5px solid #E5E7EB;border-radius:9px;font-size:13px;font-weight:600;color:#374151;cursor:pointer;font-family:inherit;white-space:nowrap;flex-shrink:0;transition:border-color .15s;}
.ro-qr-btn:hover{border-color:#2A195C;color:#2A195C;}
.ro-search-body{padding:18px 20px;}
.ro-search-form{display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;margin-bottom:14px;}
.ro-form-field{display:flex;flex-direction:column;gap:4px;}
.ro-form-num{font-size:11.5px;font-weight:600;color:#6B7280;display:flex;align-items:center;gap:5px;margin-bottom:2px;}
.ro-form-num-ic{width:18px;height:18px;border-radius:50%;background:#2A195C;color:#fff;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;flex-shrink:0;}
.ro-inp{display:flex;align-items:center;gap:8px;padding:9px 13px;border:1.5px solid #E5E7EB;border-radius:9px;font-size:13px;color:#374151;font-family:inherit;background:#fff;cursor:text;}
.ro-inp input{flex:1;border:none;outline:none;font-size:13px;color:#374151;font-family:inherit;background:none;}
.ro-inp input::placeholder{color:#C4C9D4;}
.ro-inp.sel{cursor:pointer;justify-content:space-between;}
.ro-info-note{display:flex;align-items:flex-start;gap:8px;font-size:12.5px;color:#6B7280;background:#F9FAFB;border:1px solid #E5E7EB;border-radius:8px;padding:9px 13px;margin-bottom:16px;}
.ro-search-btn{display:flex;align-items:center;gap:8px;padding:10px 28px;background:#2A195C;color:#fff;border:none;border-radius:10px;font-size:13.5px;font-weight:700;cursor:pointer;font-family:inherit;transition:background .15s;}
.ro-search-btn:hover{background:#4338CA;}
.ro-search-btn-row{display:flex;justify-content:flex-end;}
.ro-results-hdr{font-size:14px;font-weight:700;color:#2A195C;margin-bottom:4px;}
.ro-results-sub{font-size:12px;color:#6B7280;margin-bottom:14px;}
.ro-result-card{border:1px solid #E5E7EB;border-radius:10px;padding:14px 18px;margin-bottom:10px;}
.ro-result-inner{display:flex;align-items:center;gap:14px;margin-bottom:12px;}
.ro-result-av{width:52px;height:52px;border-radius:50%;overflow:hidden;flex-shrink:0;border:2px solid #E0E7FF;}
.ro-result-info{flex-shrink:0;min-width:160px;}
.ro-result-name{font-size:13.5px;font-weight:800;color:#111827;display:flex;align-items:center;gap:7px;margin-bottom:4px;}
.ro-result-meta{display:flex;align-items:center;gap:5px;font-size:12px;color:#6B7280;margin-bottom:3px;}
.ro-result-details{display:grid;grid-template-columns:auto auto auto auto;gap:0 28px;flex:1;}
.ro-detail-lbl{font-size:11px;color:#9CA3AF;}
.ro-detail-val{font-size:12.5px;font-weight:700;color:#111827;margin-top:1px;}
.ro-select-rider-btn{width:100%;padding:11px;background:#fff;border:1.5px solid #2A195C;border-radius:9px;font-size:13.5px;font-weight:700;color:#2A195C;cursor:pointer;font-family:inherit;transition:all .2s;display:flex;align-items:center;justify-content:center;gap:7px;}
.ro-select-rider-btn:hover{background:#2A195C;color:#fff;}
.ro-recent-hdr{font-size:13.5px;font-weight:700;color:#111827;margin:18px 0 10px;}
.ro-recent-table{width:100%;border-collapse:collapse;}
.ro-recent-table th{text-align:left;font-size:11.5px;font-weight:600;color:#9CA3AF;border-bottom:1px solid #E5E7EB;padding:7px 0;}
.ro-recent-table td{font-size:12.5px;color:#374151;padding:9px 0;border-bottom:1px solid #F3F4F6;}
.ro-recent-table tr:last-child td{border-bottom:none;}
.ro-search-again{font-size:12.5px;font-weight:700;color:#2A195C;cursor:pointer;}
.ro-search-again:hover{text-decoration:underline;}

/* ── Vehicle Inspection step ── */
.ro-inspect-hdr{font-size:14.5px;font-weight:800;color:#111827;margin-bottom:3px;}
.ro-inspect-sub{font-size:12px;color:#6B7280;margin-bottom:14px;}
.ro-photo-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:10px;margin-bottom:20px;}
.ro-photo-slot{border-radius:10px;overflow:hidden;position:relative;height:88px;cursor:pointer;border:1.5px solid #E5E7EB;}
.ro-photo-slot-add{border-radius:10px;height:88px;border:1.5px dashed #C7D2FE;background:#F5F3FF;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;cursor:pointer;transition:border-color .15s;}
.ro-photo-slot-add:hover{border-color:#2A195C;background:#EEF2FF;}
.ro-photo-retake{position:absolute;bottom:4px;right:4px;width:22px;height:22px;border-radius:50%;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;}
.ro-photo-lbl{font-size:10.5px;color:#6B7280;text-align:center;margin-top:5px;}
.ro-photo-add-lbl{font-size:11px;font-weight:600;color:#2A195C;}

/* Vehicle Condition */
.ro-condition-grid{display:grid;grid-template-columns:1fr 1fr 1fr 1fr auto;gap:16px;margin-bottom:16px;}
.ro-cond-group{display:flex;flex-direction:column;gap:8px;}
.ro-cond-title{font-size:12px;font-weight:700;color:#374151;margin-bottom:4px;}
.ro-radio-row{display:flex;align-items:center;gap:7px;font-size:13px;color:#374151;cursor:pointer;}
.ro-radio{width:16px;height:16px;border-radius:50%;border:2px solid #E5E7EB;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .15s;}
.ro-radio.on{border-color:#2A195C;background:#2A195C;}
.ro-radio.on::after{content:'';width:6px;height:6px;border-radius:50%;background:#fff;}
.ro-checklist{display:flex;flex-direction:column;gap:8px;padding-left:16px;border-left:1px solid #E5E7EB;}
.ro-cl-row{display:flex;align-items:center;justify-content:space-between;gap:20px;font-size:12.5px;color:#374151;}
.ro-cl-check{display:flex;align-items:center;gap:5px;color:#22C55E;font-size:12px;font-weight:700;}
.ro-notes-area{width:100%;padding:10px 13px;border:1.5px solid #E5E7EB;border-radius:9px;font-size:13px;color:#111827;outline:none;font-family:inherit;resize:none;min-height:70px;transition:border-color .15s;}
.ro-notes-area:focus{border-color:#2A195C;box-shadow:0 0 0 3px rgba(79,70,229,.1);}
.ro-notes-count{text-align:right;font-size:11.5px;color:#9CA3AF;margin-top:3px;}

/* ── Settlement step ── */
.ro-settlement-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:18px;margin-bottom:20px;}
.ro-settle-col{display:flex;flex-direction:column;gap:10px;}
.ro-settle-col-title{font-size:13px;font-weight:700;color:#111827;margin-bottom:6px;}
.ro-settle-row{display:flex;justify-content:space-between;align-items:center;font-size:12.5px;}
.ro-settle-label{color:#6B7280;}
.ro-settle-val{font-weight:600;color:#111827;}
.ro-settle-val.red { background: #EF4444; color: #fff; }
.ro-settle-divider{height:1px;background:#E5E7EB;margin:6px 0;}
.ro-settle-total-row{display:flex;justify-content:space-between;align-items:center;font-size:13.5px;font-weight:800;color:#111827;}
.ro-settle-total-val{font-size:16px;font-weight:800;color:#EF4444;}
.ro-refund-amount{font-size:20px;font-weight:800;color:#111827;}
.ro-settle-note{display:flex;align-items:flex-start;gap:7px;font-size:12px;color:#6B7280;background:#F0FDF4;border:1px solid #BBF7D0;border-radius:7px;padding:8px 11px;margin-top:8px;}
.ro-pm-row{display:flex;align-items:center;gap:14px;margin-top:8px;}
.ro-pm-opt{display:flex;align-items:center;gap:7px;font-size:13px;color:#374151;cursor:pointer;}
.ro-upi-row{display:flex;gap:8px;margin-top:10px;}
.ro-upi-inp{flex:1;padding:9px 13px;border:1.5px solid #E5E7EB;border-radius:9px;font-size:13px;color:#111827;outline:none;font-family:inherit;transition:border-color .15s;}
.ro-upi-inp:focus{border-color:#2A195C;}
.ro-verify-btn{padding:9px 16px;background:#2A195C;color:#fff;border:none;border-radius:9px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;white-space:nowrap;}
.ro-upi-success{display:flex;align-items:center;gap:6px;font-size:12px;font-weight:700;color:#16A34A;background:#F0FDF4;border:1px solid #BBF7D0;border-radius:7px;padding:7px 11px;margin-top:8px;}

/* ── Return Confirmation step ── */
.ro-confirm-banner{display:flex;align-items:flex-start;gap:12px;background:#F0FDF4;border:1px solid #BBF7D0;border-radius:12px;padding:14px 18px;margin-bottom:18px;}
.ro-confirm-ic{width:36px;height:36px;border-radius:50%;background:#22C55E;display:flex;align-items:center;justify-content:center;color:#fff;flex-shrink:0;}
.ro-confirm-title{font-size:14.5px;font-weight:800;color:#166534;}
.ro-confirm-sub{font-size:13px;color:#15803D;margin-top:3px;}
.ro-return-summary-grid{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:16px;margin-bottom:20px;}
.ro-rs-col{display:flex;flex-direction:column;gap:8px;}
.ro-rs-title{font-size:12.5px;font-weight:700;color:#111827;margin-bottom:6px;}
.ro-rs-row{display:flex;justify-content:space-between;align-items:center;font-size:12px;}
.ro-rs-label{color:#6B7280;}
.ro-rs-val{font-weight:600;color:#111827;}
.ro-rs-val.red { background: #EF4444; color: #fff; }
.ro-rs-val.total{font-size:15px;font-weight:800;color:#EF4444;}
.ro-rs-val.refund{font-size:16px;font-weight:800;color:#111827;}
.ro-returned-badge{background:#DCFCE7;color:#16A34A;border-radius:5px;font-size:11px;font-weight:700;padding:2px 8px;}
.ro-rs-divider{height:1px;background:#E5E7EB;margin:4px 0;}
.ro-refund-ready{display:flex;align-items:center;gap:6px;font-size:12px;font-weight:700;color:#16A34A;background:#F0FDF4;border:1px solid #BBF7D0;border-radius:7px;padding:7px 11px;margin-top:8px;}
.ro-confirm-check-row{display:flex;align-items:flex-start;gap:10px;margin-bottom:20px;font-size:13px;color:#374151;line-height:1.6;padding:14px 18px;border:1.5px solid #C7D2FE;border-radius:10px;background:#F5F3FF;}
.ro-cb-sq{width:20px;height:20px;border-radius:5px;background:#2A195C;border-color:#2A195C;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px;cursor:pointer;}
.ro-confirm-final-btn{display:flex;align-items:center;gap:8px;padding:12px 28px;background:#2A195C;color:#fff;border:none;border-radius:11px;font-size:14px;font-weight:800;cursor:pointer;font-family:inherit;box-shadow:0 2px 10px rgba(79,70,229,.35);transition:background .15s;}
.ro-confirm-final-btn:hover{background:#4338CA;}

/* ── Footer nav ── */
.ro-footer{display:flex;align-items:center;justify-content:space-between;padding:14px 22px;background:#fff;border-top:1px solid #E5E7EB;flex-shrink:0;}
.ro-back-btn{display:flex;align-items:center;gap:7px;padding:9px 18px;background:#fff;border:1.5px solid #E5E7EB;border-radius:10px;font-size:13px;font-weight:600;color:#374151;cursor:pointer;font-family:inherit;transition:border-color .15s;}
.ro-back-btn:hover{border-color:#6B7280;}
.ro-next-btn{display:flex;align-items:center;gap:8px;padding:10px 24px;background:#2A195C;color:#fff;border:none;border-radius:10px;font-size:13.5px;font-weight:700;cursor:pointer;font-family:inherit;transition:background .15s;box-shadow:0 2px 8px rgba(79,70,229,.3);}
.ro-next-btn:hover{background:#4338CA;}
.ro-next-btn.disabled{background:#E5E7EB;color:#9CA3AF;box-shadow:none;cursor:not-allowed;}

/* ── Right Panel ── */
.ro-rp{padding:16px 16px 20px;}
.ro-rp-card{background:#fff;border:1px solid #E5E7EB;border-radius:12px;overflow:hidden;margin-bottom:14px;}
.ro-rp-hdr{display:flex;align-items:center;gap:8px;padding:12px 16px;border-bottom:1px solid #E5E7EB;}
.ro-rp-ic{display:flex;align-items:center;color:#2A195C;flex-shrink:0;}
.ro-rp-title{font-size:13px;font-weight:700;color:#111827;}
.ro-rp-body{padding:12px 16px 14px;}
.ro-rp-rider-hdr{display:flex;align-items:flex-start;gap:10px;margin-bottom:10px;padding-bottom:10px;border-bottom:1px solid #F3F4F6;}
.ro-rp-av{width:46px;height:46px;border-radius:50%;overflow:hidden;flex-shrink:0;border:2px solid #E0E7FF;}
.ro-rp-rider-name{font-size:13.5px;font-weight:800;color:#111827;display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:3px;}
.ro-rp-meta{display:flex;align-items:center;gap:5px;font-size:11.5px;color:#6B7280;margin-bottom:2px;}
.ro-rp-row{display:flex;justify-content:space-between;align-items:flex-start;padding:5.5px 0;border-bottom:1px solid #F9FAFB;font-size:12px;}
.ro-rp-row:last-child{border-bottom:none;}
.ro-rp-label{color:#6B7280;}
.ro-rp-val{font-weight:600;color:#111827;text-align:right;}
.ro-rp-val.red { background: #EF4444; color: #fff; }
.ro-rp-val.green { background: #10B981; color: #fff; }
.ro-status-done{background:#EEF2FF;color:#2A195C;border-radius:5px;font-size:10.5px;font-weight:700;padding:2px 7px;}
.ro-status-active{background:#DCFCE7;color:#16A34A;border-radius:5px;font-size:10.5px;font-weight:700;padding:2px 7px;}
.ro-status-completed{background:#F3F4F6;color:#6B7280;border-radius:5px;font-size:10.5px;font-weight:700;padding:2px 7px;}
.ro-qa-btn{display:flex;align-items:center;gap:8px;width:100%;padding:10px 14px;background:#F9FAFB;border:1px solid #E5E7EB;border-radius:9px;font-size:12.5px;font-weight:600;color:#374151;cursor:pointer;font-family:inherit;margin-bottom:7px;transition:border-color .15s;}
.ro-qa-btn:last-child{margin-bottom:0;}
.ro-qa-btn:hover{border-color:#2A195C;color:#2A195C;}
.ro-help-sub{font-size:12.5px;color:#6B7280;margin-bottom:10px;}
.ro-contact-btn{width:100%;padding:9px;background:#2A195C;color:#fff;border-radius:9px;font-size:12.5px;font-weight:700;cursor:pointer;border:none;font-family:inherit;display:flex;align-items:center;justify-content:center;gap:7px;}
.ro-contact-btn:hover{background:#4338CA;}
`;

/* ── Icons ── */
const S={fill:'none',stroke:'currentColor',strokeWidth:2 as number,strokeLinecap:'round' as const,strokeLinejoin:'round' as const};
const SV=({s=14,children,...p}:{s?:number;children:React.ReactNode}&React.SVGProps<SVGSVGElement>)=>(<svg width={s} height={s} viewBox="0 0 24 24" {...S} {...p}>{children}</svg>);
const ILeft    = ()=><SV s={13}><polyline points="15 18 9 12 15 6"/></SV>;
const IRight   = ({s=14}:{s?:number})=><SV s={s}><polyline points="9 18 15 12 9 6"/></SV>;
const ICheck   = ({s=13,c}:{s?:number;c?:string})=><SV s={s} stroke={c||'currentColor'}><polyline points="20 6 9 17 4 12"/></SV>;
const IGrid    = ()=><SV s={13}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></SV>;
const ICar     = ({s=13}:{s?:number})=><SV s={s}><path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v9a2 2 0 0 1-2 2h-3"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></SV>;
const IRefresh = ({s=13}:{s?:number})=><SV s={s}><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></SV>;
const ISwap    = ()=><SV s={13}><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/></SV>;
const IBell    = ()=><SV s={14}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></SV>;
const ISearch  = ()=><SV s={14}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></SV>;
const IQR      = ()=><SV s={13}><rect x="3" y="3" width="5" height="5"/><rect x="16" y="3" width="5" height="5"/><rect x="3" y="16" width="5" height="5"/><rect x="9" y="9" width="5" height="5"/><line x1="14" y1="9" x2="21" y2="9"/><line x1="9" y1="14" x2="9" y2="21"/><line x1="14" y1="14" x2="21" y2="14"/><line x1="14" y1="21" x2="21" y2="21"/></SV>;
const IPhone   = ()=><SV s={12}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.54 3.53 2 2 0 0 1 3.5 1.35h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6.06 6.06l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></SV>;
const IID      = ()=><SV s={12}><rect x="2" y="4" width="20" height="16" rx="2"/><circle cx="8.5" cy="10" r="2"/><path d="M14 10h4M14 14h4M6 14h5"/></SV>;
const IUser    = ()=><SV s={13}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></SV>;
const ICamera  = ({s=14,c}:{s?:number;c?:string})=><SV s={s} stroke={c||'currentColor'}><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></SV>;
const IInfo    = ()=><SV s={13}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></SV>;
const IDl      = ({s=13}:{s?:number})=><SV s={s}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></SV>;
const IEye     = ({s=13}:{s?:number})=><SV s={s}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></SV>;
const IMsg     = ()=><SV s={13}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></SV>;
const ICal     = ()=><SV s={13}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></SV>;
const IHam     = ()=><SV s={18} stroke="#374151"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></SV>;
const IHelp    = ()=><SV s={14}><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></SV>;
const ILightning=()=><SV s={13}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></SV>;
const ICalPlus =()=><SV s={13}><path d="M21 13V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="19" y1="16" x2="19" y2="22"/><line x1="16" y1="19" x2="22" y2="19"/></SV>;
const IArr     = ()=><svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;

/* ── Rider Avatar SVG (Amit Kumar) ── */
const AvatarSVG = ({size=52}:{size?:number}) => (
  <svg viewBox="0 0 100 100" fill="none" style={{width:size,height:size}}>
    <circle cx="50" cy="50" r="50" fill="#D4C5B5"/>
    <ellipse cx="50" cy="96" rx="38" ry="26" fill="#4B5563"/>
    <rect x="43" y="66" width="14" height="18" rx="2" fill="#7B4F2E"/>
    <circle cx="50" cy="52" r="23" fill="#7B4F2E"/>
    <path d="M27 44 Q30 26 50 24 Q70 26 73 44 Q70 30 50 30 Q30 30 27 44Z" fill="#1a0800"/>
    <circle cx="27" cy="52" r="5" fill="#6B4226"/>
    <circle cx="73" cy="52" r="5" fill="#6B4226"/>
    <path d="M36 41 Q43 38 50 41" stroke="#1a0800" strokeWidth="2" fill="none" strokeLinecap="round"/>
    <path d="M50 41 Q57 38 64 41" stroke="#1a0800" strokeWidth="2" fill="none" strokeLinecap="round"/>
    <circle cx="41" cy="48" r="3" fill="#1a0800"/>
    <circle cx="59" cy="48" r="3" fill="#1a0800"/>
    <circle cx="42" cy="47" r="1.1" fill="white" opacity="0.6"/>
    <circle cx="60" cy="47" r="1.1" fill="white" opacity="0.6"/>
    <path d="M47 55 Q50 57.5 53 55" stroke="#5A3015" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <path d="M34 60 Q38 73 50 77 Q62 73 66 60 Q62 70 50 72 Q38 70 34 60Z" fill="#1a0800" opacity="0.9"/>
    <path d="M37 55 Q35 63 34 65 Q37 67 38 61Z" fill="#1a0800" opacity="0.6"/>
    <path d="M63 55 Q65 63 66 65 Q63 67 62 61Z" fill="#1a0800" opacity="0.6"/>
  </svg>
);

/* ── Vehicle photo placeholders ── */
const PhotoFront = () => (
  <svg viewBox="0 0 120 88" fill="none" style={{width:'100%',height:'100%',display:'block'}}>
    <rect width="120" height="88" fill="#0f172a"/>
    <ellipse cx="60" cy="78" rx="45" ry="6" fill="#020617" opacity="0.6"/>
    <rect x="40" y="22" width="40" height="38" rx="6" fill="#1e293b"/>
    <rect x="46" y="27" width="28" height="14" rx="3" fill="#3b82f6" opacity="0.7"/>
    <circle cx="35" cy="66" r="12" stroke="#60a5fa" strokeWidth="3" fill="#0f172a"/>
    <circle cx="35" cy="66" r="5" fill="#1d4ed8"/>
    <circle cx="85" cy="66" r="12" stroke="#60a5fa" strokeWidth="3" fill="#0f172a"/>
    <circle cx="85" cy="66" r="5" fill="#1d4ed8"/>
    <ellipse cx="60" cy="36" rx="9" ry="6" fill="#fde68a" opacity="0.85"/>
    <line x1="35" y1="50" x2="85" y2="50" stroke="#1e293b" strokeWidth="2.5"/>
  </svg>
);
const PhotoSide = () => (
  <svg viewBox="0 0 120 88" fill="none" style={{width:'100%',height:'100%',display:'block'}}>
    <rect width="120" height="88" fill="#0f172a"/>
    <ellipse cx="60" cy="80" rx="52" ry="6" fill="#020617" opacity="0.5"/>
    <path d="M20 45 L30 25 L75 22 L95 35 L100 50 L20 52Z" fill="#1e3a5f"/>
    <path d="M30 25 L40 22 L75 20 L75 22Z" fill="#2563eb" opacity="0.5"/>
    <circle cx="30" cy="64" r="13" stroke="#60a5fa" strokeWidth="3" fill="#0f172a"/>
    <circle cx="30" cy="64" r="5" fill="#1d4ed8"/>
    <circle cx="90" cy="64" r="13" stroke="#60a5fa" strokeWidth="3" fill="#0f172a"/>
    <circle cx="90" cy="64" r="5" fill="#1d4ed8"/>
    <rect x="85" y="35" width="16" height="10" rx="2" fill="#fde68a" opacity="0.6"/>
    <rect x="18" y="38" width="8" height="6" rx="1" fill="#ef4444" opacity="0.5"/>
  </svg>
);
const PhotoRear = () => (
  <svg viewBox="0 0 120 88" fill="none" style={{width:'100%',height:'100%',display:'block'}}>
    <rect width="120" height="88" fill="#0f172a"/>
    <ellipse cx="60" cy="78" rx="45" ry="6" fill="#020617" opacity="0.6"/>
    <rect x="35" y="22" width="50" height="42" rx="6" fill="#1e293b"/>
    <rect x="40" y="30" width="16" height="8" rx="2" fill="#ef4444" opacity="0.7"/>
    <rect x="64" y="30" width="16" height="8" rx="2" fill="#ef4444" opacity="0.7"/>
    <rect x="44" y="42" width="32" height="14" rx="3" fill="#0f172a"/>
    <circle cx="35" cy="66" r="12" stroke="#60a5fa" strokeWidth="3" fill="#0f172a"/>
    <circle cx="35" cy="66" r="5" fill="#1d4ed8"/>
    <circle cx="85" cy="66" r="12" stroke="#60a5fa" strokeWidth="3" fill="#0f172a"/>
    <circle cx="85" cy="66" r="5" fill="#1d4ed8"/>
  </svg>
);
const PhotoOdo = () => (
  <svg viewBox="0 0 120 88" fill="none" style={{width:'100%',height:'100%',display:'block'}}>
    <rect width="120" height="88" fill="#0f172a"/>
    <rect x="18" y="22" width="84" height="44" rx="6" fill="#111827" stroke="#1e293b" strokeWidth="1.5"/>
    <text x="60" y="52" textAnchor="middle" fontSize="24" fontWeight="800" fontFamily="monospace" fill="#22c55e">12345</text>
    <text x="60" y="64" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#4ade80" opacity="0.6">km</text>
    <rect x="26" y="28" width="4" height="3" rx="1" fill="#4ade80" opacity="0.4"/>
    <rect x="90" y="28" width="4" height="3" rx="1" fill="#4ade80" opacity="0.4"/>
  </svg>
);
const PhotoBattery = () => (
  <svg viewBox="0 0 120 88" fill="none" style={{width:'100%',height:'100%',display:'block'}}>
    <rect width="120" height="88" fill="#0f172a"/>
    <rect x="28" y="18" width="64" height="52" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="1.5"/>
    <rect x="48" y="12" width="24" height="8" rx="3" fill="#334155"/>
    <rect x="34" y="26" width="52" height="8" rx="2" fill="#22c55e" opacity="0.9"/>
    <rect x="34" y="38" width="52" height="8" rx="2" fill="#22c55e" opacity="0.7"/>
    <rect x="34" y="50" width="34" height="8" rx="2" fill="#4b5563"/>
    <text x="60" y="74" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#22c55e">60V 30Ah</text>
  </svg>
);

/* ── STEPS definition ── */
type StepState = 'done'|'act'|'pend';
interface StepDef { n:number; label:string; stat:string; state:StepState; }
const getSteps = (cur:number): StepDef[] => [
  {n:1,label:'Search Rider',       stat:cur>1?'Completed':'In Progress',   state:cur>1?'done':cur===1?'act':'pend'},
  {n:2,label:'Vehicle Inspection', stat:cur>2?'Completed':cur===2?'In Progress':'Pending', state:cur>2?'done':cur===2?'act':'pend'},
  {n:3,label:'Settlement',         stat:cur>3?'Completed':cur===3?'In Progress':'Pending', state:cur>3?'done':cur===3?'act':'pend'},
  {n:4,label:'Return Confirmation',stat:cur===4?'In Progress':'Pending',   state:cur===4?'act':'pend'},
];

/* ══════════ PAGE ══════════ */
export default function ReturnVehiclePage() {
  const [step, setStep]             = useState(1);
  const [mainTab, setMainTab]       = useState<'extend'|'return'|'exchange'>('return');
  const [bodyDmg, setBodyDmg]       = useState<'none'|'minor'|'major'>('none');
  const [tyre, setTyre]             = useState<'good'|'worn'|'damaged'>('good');
  const [clean, setClean]           = useState<'clean'|'average'|'dirty'>('clean');
  const [battery, setBattery]       = useState<'good'|'issue'>('good');
  const [charger, setCharger]       = useState(true);
  const [helmet, setHelmet]         = useState(true);
  const [key, setKey]               = useState(true);
  const [docs, setDocs]             = useState(true);
  const [notes, setNotes]           = useState('');
  const [settlNotes, setSettlNotes] = useState('');
  const [payMethod, setPayMethod]   = useState<'upi'|'bank'>('upi');
  const [upiId, setUpiId]           = useState('amitkumar@upi');
  const [upiVerified, setUpiVerified] = useState(true);
  const [confirmed, setConfirmed]   = useState(false);

  const steps = getSteps(step);

  /* ─── Rider info summary (steps 2-4) ─── */
  const RiderInfoCard = ({showActual=false}:{showActual?:boolean}) => (
    <div className="ro-rider-card">
      <div className="ro-rider-av-wrap"><AvatarSVG size={56}/></div>
      <div className="ro-rider-info">
        <div className="ro-rider-name">Amit Kumar <span className="ro-kyc-badge"><ICheck s={10} c="#16A34A"/> KYC Verified</span></div>
        <div className="ro-rider-meta"><IPhone/> +91 98765 43210</div>
        <div className="ro-rider-meta"><IID/> Rider ID: RIDR00234</div>
      </div>
      <div className="ro-divider-v"/>
      <div className="ro-ride-info-col">
        <div className="ro-detail-lbl">Ride ID</div>
        <div className="ro-detail-val" style={{fontSize:12}}>RID20240518001</div>
        <div style={{marginTop:6}} className="ro-detail-lbl">Vehicle</div>
        <div className="ro-detail-val">EVM1024012</div>
        <div style={{marginTop:6}} className="ro-detail-lbl">Battery</div>
        <div className="ro-detail-val">BAT-0098 (60V 30Ah)</div>
      </div>
      <div className="ro-divider-v"/>
      <div className="ro-ride-info-col">
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',columnGap:24,rowGap:6}}>
          <div><div className="ro-detail-lbl">Ride Start</div><div className="ro-detail-val">May 16, 2024, 10:30 AM</div></div>
          <div><div className="ro-detail-lbl">Plan</div><div className="ro-detail-val">Monthly Plan</div></div>
          <div><div className="ro-detail-lbl">Expected Return</div><div className="ro-detail-val">May 18, 2024, 10:30 AM</div></div>
          <div><div className="ro-detail-lbl">Security Deposit</div><div className="ro-detail-val" style={{color:'#22C55E'}}>₹500</div></div>
          {showActual && <>
            <div><div className="ro-detail-lbl">Actual Return</div><div className="ro-detail-val ro-late-text">May 18, 2024, 02:45 PM</div></div>
            <div><div className="ro-detail-lbl">Delay</div><div className="ro-detail-val"><span className="ro-delay-badge">4h 15m</span></div></div>
          </>}
          <div><div className="ro-detail-lbl">Ride Status</div><div style={{marginTop:3}}><span className="ro-active-badge">Active</span></div></div>
        </div>
      </div>
    </div>
  );

  /* ─── Step 1: Search Rider ─── */
  const Step1 = () => (
    <div className="ro-search-card">
      <div className="ro-search-hdr">
        <div>
          <div className="ro-search-title">Search Rider</div>
          <div className="ro-search-sub">Search for a rider using the details below</div>
        </div>
        <button className="ro-qr-btn"><IQR/> Scan QR Code</button>
      </div>
      <div className="ro-search-body">
        <div className="ro-search-form">
          <div className="ro-form-field">
            <div className="ro-form-num"><div className="ro-form-num-ic">1</div> First Name</div>
            <div className="ro-inp"><IUser/><input placeholder="Enter first name"/></div>
          </div>
          <div className="ro-form-field">
            <div className="ro-form-num"><div className="ro-form-num-ic">2</div> Mobile Number</div>
            <div className="ro-inp"><IPhone/><input placeholder="Enter mobile number"/></div>
          </div>
          <div className="ro-form-field">
            <div className="ro-form-num"><div className="ro-form-num-ic">3</div> Rider Is</div>
            <div className="ro-inp sel">
              <span style={{color:'#9CA3AF',fontSize:13}}>Select rider type</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>
        </div>
        <div className="ro-info-note"><IInfo/> Make sure the rider has an active return request or the vehicle is eligible for return.</div>
        <div className="ro-search-btn-row"><button className="ro-search-btn"><ISearch/> Search Rider</button></div>

        {/* Results */}
        <div style={{marginTop:20}}>
          <div className="ro-results-hdr">Search Results</div>
          <div className="ro-results-sub">Showing matching rider(s)</div>
          <div className="ro-result-card">
            <div className="ro-result-inner">
              <div className="ro-result-av"><AvatarSVG size={52}/></div>
              <div className="ro-result-info">
                <div className="ro-result-name">Amit Kumar <span className="ro-kyc-badge"><ICheck s={10} c="#16A34A"/> KYC Verified</span></div>
                <div className="ro-result-meta"><IPhone/> +91 98765 43210</div>
                <div className="ro-result-meta"><IID/> Rider ID: RIDR00234</div>
              </div>
              <div className="ro-result-details">
                <div>
                  <div className="ro-detail-lbl">Current Vehicle</div>
                  <div className="ro-detail-val">EVM1024012</div>
                  <div style={{marginTop:4}}><span className="ro-active-badge">Active</span></div>
                </div>
                <div>
                  <div className="ro-detail-lbl">Ride Start</div>
                  <div className="ro-detail-val">May 16, 2024, 10:30 AM</div>
                </div>
                <div>
                  <div className="ro-detail-lbl">Plan</div>
                  <div className="ro-detail-val">Monthly Plan</div>
                </div>
                <div>
                  <div className="ro-detail-lbl">Expected Return</div>
                  <div className="ro-detail-val">May 18, 2024, 10:30 AM</div>
                  <div className="ro-detail-lbl" style={{marginTop:4}}>Security Deposit</div>
                  <div className="ro-detail-val" style={{color:'#22C55E'}}>₹500</div>
                </div>
              </div>
            </div>
            <button className="ro-select-rider-btn" onClick={()=>setStep(2)}>Select This Rider</button>
          </div>
        </div>

        {/* Recent searches */}
        <div className="ro-recent-hdr">Recent Searches</div>
        <table className="ro-recent-table">
          <thead>
            <tr>
              <th>First Name</th><th>Mobile Number</th><th>Rider ID</th><th>Rider Type</th><th>Last Activity</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {[
              {name:'Amit Kumar', mob:'+91 98765 43210', id:'RIDR00234', type:'Primary Rider', last:'2 mins ago'},
              {name:'Neha Singh',  mob:'+91 91234 56789', id:'RIDR00987', type:'Additional Rider', last:'15 mins ago'},
              {name:'Rohit Verma', mob:'+91 99887 66554', id:'RIDR00456', type:'Primary Rider', last:'1 hour ago'},
            ].map(r=>(
              <tr key={r.id}>
                <td style={{fontWeight:600,color:'#111827'}}>{r.name}</td>
                <td>{r.mob}</td><td>{r.id}</td><td>{r.type}</td><td>{r.last}</td>
                <td><span className="ro-search-again">Search Again</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  /* ─── Step 2: Vehicle Inspection ─── */
  const Step2 = () => {
    const photos = [
      {lbl:'Front View',     el:<PhotoFront/>},
      {lbl:'Left Side View', el:<PhotoSide/>},
      {lbl:'Right Side View',el:<PhotoSide/>},
      {lbl:'Rear View',      el:<PhotoRear/>},
      {lbl:'Odometer Photo', el:<PhotoOdo/>},
      {lbl:'Battery Photo',  el:<PhotoBattery/>},
    ];
    const Rd=({val,cur,set}:{val:string;cur:string;set:(v:string)=>void})=>(
      <div className="ro-radio-row" onClick={()=>set(val)}>
        <div className={`ro-radio ${cur===val?'on':''}`}/>
        <span style={{textTransform:'capitalize'}}>{val.replace('-',' ')}</span>
      </div>
    );
    return(
      <>
        <RiderInfoCard/>
        <div className="ro-inspect-hdr">Return Inspection</div>
        <div className="ro-inspect-sub">Please inspect the vehicle and add required images</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:10,marginBottom:20}}>
          {photos.map((p,i)=>(
            <div key={i}>
              <div className="ro-photo-slot">
                {p.el}
                <div className="ro-photo-retake"><ICamera s={11} c="#fff"/></div>
              </div>
              <div className="ro-photo-lbl">{p.lbl}</div>
            </div>
          ))}
          <div>
            <div className="ro-photo-slot-add">
              <ICamera s={22} c="#9CA3AF"/>
              <div className="ro-photo-add-lbl">Add More</div>
            </div>
          </div>
        </div>

        <div style={{fontSize:14,fontWeight:700,color:'#111827',marginBottom:6}}>Vehicle Condition</div>
        <div className="ro-condition-grid">
          <div className="ro-cond-group">
            <div className="ro-cond-title">Body Scratch / Damage</div>
            <Rd val="none"  cur={bodyDmg==='none'?'none':bodyDmg} set={v=>setBodyDmg(v as typeof bodyDmg)}/>
            <Rd val="minor" cur={bodyDmg} set={v=>setBodyDmg(v as typeof bodyDmg)}/>
            <Rd val="major" cur={bodyDmg} set={v=>setBodyDmg(v as typeof bodyDmg)}/>
          </div>
          <div className="ro-cond-group">
            <div className="ro-cond-title">Tyres Condition</div>
            <Rd val="good"    cur={tyre} set={v=>setTyre(v as typeof tyre)}/>
            <Rd val="worn"    cur={tyre} set={v=>setTyre(v as typeof tyre)}/>
            <Rd val="damaged" cur={tyre} set={v=>setTyre(v as typeof tyre)}/>
          </div>
          <div className="ro-cond-group">
            <div className="ro-cond-title">Vehicle Cleanliness</div>
            <Rd val="clean"   cur={clean} set={v=>setClean(v as typeof clean)}/>
            <Rd val="average" cur={clean} set={v=>setClean(v as typeof clean)}/>
            <Rd val="dirty"   cur={clean} set={v=>setClean(v as typeof clean)}/>
          </div>
          <div className="ro-cond-group">
            <div className="ro-cond-title">Battery Condition</div>
            <Rd val="good"  cur={battery} set={v=>setBattery(v as typeof battery)}/>
            <Rd val="issue" cur={battery} set={v=>setBattery(v as typeof battery)}/>
          </div>
          <div className="ro-checklist">
            {([
              {lbl:'Charger Returned', val:charger, set:setCharger},
              {lbl:'Helmet Returned',  val:helmet,  set:setHelmet},
              {lbl:'Key Returned',     val:key,     set:setKey},
              {lbl:'Documents Returned',val:docs,   set:setDocs},
            ]).map(c=>(
              <div key={c.lbl} className="ro-cl-row">
                <span style={{display:'flex',alignItems:'center',gap:5,cursor:'pointer',color:'#374151',fontSize:12.5}} onClick={()=>c.set(!c.val)}>
                  <div style={{width:16,height:16,borderRadius:4,background:c.val?'#2A195C':'transparent',border:`2px solid ${c.val?'#2A195C':'#D1D5DB'}`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                    {c.val && <ICheck s={10} c="#fff"/>}
                  </div>
                  {c.lbl}
                </span>
                {c.val && <div className="ro-cl-check"><ICheck s={10}/> Yes</div>}
              </div>
            ))}
          </div>
        </div>

        <div style={{fontSize:13,fontWeight:700,color:'#374151',marginBottom:6}}>Additional Notes (Optional)</div>
        <textarea className="ro-notes-area" placeholder="Write any additional notes about the vehicle condition..." value={notes} onChange={e=>setNotes(e.target.value)} maxLength={300}/>
        <div className="ro-notes-count">{notes.length} / 300</div>
      </>
    );
  };

  /* ─── Step 3: Settlement ─── */
  const Step3 = () => (
    <>
      <RiderInfoCard showActual/>
      <div style={{fontSize:16,fontWeight:800,color:'#111827',marginBottom:3}}>Settlement Summary</div>
      <div style={{fontSize:12,color:'#6B7280',marginBottom:16}}>Review charges, deposit adjustment and refund (if any)</div>
      <div style={{background:'#fff',border:'1px solid #E5E7EB',borderRadius:12,padding:'18px 20px',marginBottom:14}}>
        <div className="ro-settlement-grid">
          {/* Charges Breakdown */}
          <div className="ro-settle-col">
            <div className="ro-settle-col-title">Charges Breakdown</div>
            {[
              {l:'Delay Charge (4h 15m)', v:'₹120'},
              {l:'Vehicle Scratch (Minor)',v:'₹250'},
              {l:'Cleaning Fee',           v:'₹50'},
              {l:'Other Charges',          v:'₹0'},
            ].map(r=>(
              <div key={r.l} className="ro-settle-row"><span className="ro-settle-label">{r.l}</span><span className="ro-settle-val">{r.v}</span></div>
            ))}
            <div className="ro-settle-divider"/>
            <div className="ro-settle-total-row">
              <span>Total Deductions</span>
              <span className="ro-settle-total-val">₹420</span>
            </div>
            <div className="ro-settle-note"><IInfo/> Charges are calculated as per policy</div>
          </div>

          {/* Deposit Adjustment */}
          <div className="ro-settle-col" style={{borderLeft:'1px solid #E5E7EB',paddingLeft:18}}>
            <div className="ro-settle-col-title">Deposit Adjustment</div>
            {[
              {l:'Security Deposit',  v:'₹500'},
              {l:'Total Deductions',  v:'- ₹420'},
            ].map(r=>(
              <div key={r.l} className="ro-settle-row"><span className="ro-settle-label">{r.l}</span><span className="ro-settle-val">{r.v}</span></div>
            ))}
            <div className="ro-settle-divider"/>
            <div className="ro-settle-row">
              <span style={{fontWeight:700,color:'#374151'}}>Refund Amount</span>
              <span style={{fontSize:20,fontWeight:800,color:'#111827'}}>₹80</span>
            </div>
            <div className="ro-settle-note" style={{marginTop:10}}><ICheck s={11} c="#16A34A"/><span style={{color:'#16A34A',fontWeight:700}}>₹420 will be deducted from deposit</span></div>
          </div>

          {/* Refund Details */}
          <div className="ro-settle-col" style={{borderLeft:'1px solid #E5E7EB',paddingLeft:18}}>
            <div className="ro-settle-col-title">Refund Details</div>
            <div className="ro-settle-row">
              <span className="ro-settle-label">Refund Amount</span>
              <span style={{fontSize:20,fontWeight:800,color:'#111827'}}>₹80</span>
            </div>
            <div style={{fontSize:13,fontWeight:700,color:'#374151',marginTop:10,marginBottom:6}}>Refund Method</div>
            <div className="ro-pm-row">
              <div className="ro-pm-opt" onClick={()=>setPayMethod('upi')}>
                <div className={`ro-radio ${payMethod==='upi'?'on':''}`}/>
                <span>UPI</span>
              </div>
              <div className="ro-pm-opt" onClick={()=>setPayMethod('bank')}>
                <div className={`ro-radio ${payMethod==='bank'?'on':''}`}/>
                <span>Bank Transfer</span>
              </div>
            </div>
            {payMethod==='upi' && (
              <>
                <div style={{fontSize:12,color:'#6B7280',marginTop:8,marginBottom:4}}>UPI ID</div>
                <div className="ro-upi-row">
                  <input className="ro-upi-inp" value={upiId} onChange={e=>{setUpiId(e.target.value);setUpiVerified(false);}} placeholder="Enter UPI ID"/>
                  <button className="ro-verify-btn" onClick={()=>setUpiVerified(true)}>Verify</button>
                </div>
                {upiVerified && <div className="ro-upi-success"><ICheck s={13}/> UPI ID verified successfully</div>}
              </>
            )}
          </div>
        </div>
      </div>

      <div style={{fontSize:13,fontWeight:700,color:'#374151',marginBottom:6}}>Additional Notes (Optional)</div>
      <textarea className="ro-notes-area" placeholder="Write any additional notes about the settlement..." value={settlNotes} onChange={e=>setSettlNotes(e.target.value)} maxLength={300}/>
      <div className="ro-notes-count">{settlNotes.length} / 300</div>
    </>
  );

  /* ─── Step 4: Return Confirmation ─── */
  const Step4 = () => (
    <>
      <div className="ro-confirm-banner">
        <div className="ro-confirm-ic"><ICheck s={18}/></div>
        <div>
          <div className="ro-confirm-title">All set to complete the return</div>
          <div className="ro-confirm-sub">Please review the summary and confirm to close this return.</div>
        </div>
      </div>

      <RiderInfoCard showActual/>

      <div style={{fontSize:15,fontWeight:800,color:'#111827',marginBottom:14}}>Return Summary</div>
      <div style={{background:'#fff',border:'1px solid #E5E7EB',borderRadius:12,padding:'18px 20px',marginBottom:16}}>
        <div className="ro-return-summary-grid">
          {/* Deductions */}
          <div className="ro-rs-col">
            <div className="ro-rs-title">Deductions</div>
            {[
              {l:'Delay Charge (4h 15m)', v:'₹120'},
              {l:'Vehicle Scratch (Minor)',v:'₹250'},
              {l:'Cleaning Fee',           v:'₹50'},
              {l:'Other Charges',          v:'₹0'},
            ].map(r=>(
              <div key={r.l} className="ro-rs-row"><span className="ro-rs-label">{r.l}</span><span className="ro-rs-val">{r.v}</span></div>
            ))}
            <div className="ro-rs-divider"/>
            <div className="ro-rs-row">
              <span style={{fontWeight:700,color:'#374151',fontSize:12.5}}>Total Deductions</span>
              <span className="ro-rs-val total">₹420</span>
            </div>
          </div>

          {/* Deposits & Refunds */}
          <div className="ro-rs-col" style={{borderLeft:'1px solid #E5E7EB',paddingLeft:14}}>
            <div className="ro-rs-title">Deposits &amp; Refunds</div>
            {[
              {l:'Security Deposit', v:'₹500'},
              {l:'Total Deductions', v:'- ₹420'},
            ].map(r=>(
              <div key={r.l} className="ro-rs-row"><span className="ro-rs-label">{r.l}</span><span className="ro-rs-val">{r.v}</span></div>
            ))}
            <div className="ro-rs-divider"/>
            <div className="ro-rs-row">
              <span style={{fontWeight:700,fontSize:12.5,color:'#374151'}}>Refund Amount</span>
              <span className="ro-rs-val refund">₹80</span>
            </div>
          </div>

          {/* Returned Items */}
          <div className="ro-rs-col" style={{borderLeft:'1px solid #E5E7EB',paddingLeft:14}}>
            <div className="ro-rs-title">Returned Items</div>
            {['Vehicle','Battery','Charger','Helmet','Keys','Documents'].map(item=>(
              <div key={item} className="ro-rs-row">
                <span className="ro-rs-label">{item}</span>
                <span className="ro-returned-badge">Returned</span>
              </div>
            ))}
          </div>

          {/* Payment to Rider */}
          <div className="ro-rs-col" style={{borderLeft:'1px solid #E5E7EB',paddingLeft:14}}>
            <div className="ro-rs-title">Payment to Rider</div>
            <div style={{fontSize:12,color:'#6B7280',marginBottom:2}}>Refund Amount</div>
            <div style={{fontSize:22,fontWeight:800,color:'#111827',marginBottom:8}}>₹80</div>
            <div className="ro-rs-row"><span className="ro-rs-label">Payment Method</span></div>
            <div style={{fontSize:13,fontWeight:700,color:'#111827',margin:'2px 0 6px'}}>UPI</div>
            <div style={{fontSize:12,color:'#6B7280',marginBottom:2}}>UPI ID</div>
            <div style={{fontSize:13,fontWeight:700,color:'#111827',marginBottom:10}}>amitkumar@upi</div>
            <div className="ro-refund-ready"><ICheck s={12}/> Refund ready to be paid</div>
          </div>
        </div>
      </div>

      <div className="ro-confirm-check-row">
        <div className="ro-cb-sq" onClick={()=>setConfirmed(p=>!p)}>
          {confirmed && <ICheck s={12} c="#fff"/>}
        </div>
        <div>
          <div style={{fontWeight:700,color:'#111827'}}>I have verified all returned items and details are correct.</div>
          <div style={{color:'#6B7280',fontSize:12}}>By confirming, the return will be closed and refund (if any) will be processed.</div>
        </div>
      </div>
    </>
  );

  /* ─── Right Panel ─── */
  const RightPanel = () => (
    <div className="ro-rp">
      {/* Rider Summary */}
      <div className="ro-rp-card">
        <div className="ro-rp-hdr"><span className="ro-rp-ic"><IUser/></span><div className="ro-rp-title">Rider Summary</div></div>
        <div className="ro-rp-body">
          <div className="ro-rp-rider-hdr">
            <div className="ro-rp-av"><AvatarSVG size={46}/></div>
            <div>
              <div className="ro-rp-rider-name">Amit Kumar <span className="ro-kyc-badge"><ICheck s={9} c="#16A34A"/> KYC Verified</span></div>
              <div className="ro-rp-meta"><IPhone/> +91 98765 43210</div>
              <div className="ro-rp-meta"><IID/> Rider ID: RIDR00234</div>
            </div>
          </div>
          {[
            {l:'Total Rides',     v:'12'},
            {l:'Completed Rides', v:'8'},
            {l:'Pending Rides',   v:'1'},
            {l:'Rental Plan',     v:'Monthly Plan'},
            {l:'Security Deposit',v:<span style={{color:'#22C55E',fontWeight:700}}>₹500</span>},
          ].map(r=>(
            <div key={r.l} className="ro-rp-row"><span className="ro-rp-label">{r.l}</span><span className="ro-rp-val">{r.v}</span></div>
          ))}
        </div>
      </div>

      {/* Ride Summary */}
      <div className="ro-rp-card">
        <div className="ro-rp-hdr"><span className="ro-rp-ic"><ICal/></span><div className="ro-rp-title">{step===1?'Current Ride Overview':'Ride Summary'}</div></div>
        <div className="ro-rp-body">
          <div className="ro-rp-row"><span className="ro-rp-label">Ride Start</span><span className="ro-rp-val">May 16, 2024, 10:30 AM</span></div>
          <div className="ro-rp-row"><span className="ro-rp-label">Expected Return</span><span className="ro-rp-val">May 18, 2024, 10:30 AM</span></div>
          {step>=3 && <div className="ro-rp-row"><span className="ro-rp-label">Actual Return</span><span className="ro-rp-val red">May 18, 2024, 02:45 PM</span></div>}
          {step>=3 && <div className="ro-rp-row"><span className="ro-rp-label">Ride Duration</span><span className="ro-rp-val">2d 4h 15m</span></div>}
          {step>=4 && <div className="ro-rp-row"><span className="ro-rp-label">Total Distance</span><span className="ro-rp-val">123.45 km</span></div>}
          <div className="ro-rp-row"><span className="ro-rp-label">Plan</span><span className="ro-rp-val">Monthly Plan</span></div>
          {step===1 && <><div className="ro-rp-row"><span className="ro-rp-label">Current Vehicle</span><span className="ro-rp-val">Ola S1 Pro (EVM1024012)</span></div>
            <div className="ro-rp-row"><span className="ro-rp-label">Odometer</span><span className="ro-rp-val">12,345 km</span></div>
            <div className="ro-rp-row"><span className="ro-rp-label">Battery SOH</span><span className="ro-rp-val">89%</span></div></>}
          <div className="ro-rp-row"><span className="ro-rp-label">Security Deposit</span><span className="ro-rp-val green">₹500</span></div>
          {step>=3 && <div className="ro-rp-row"><span className="ro-rp-label">Refund Amount</span><span className="ro-rp-val green">₹80</span></div>}
          <div className="ro-rp-row"><span className="ro-rp-label">Status</span><span>{step>=4?<span className="ro-status-completed">Completed</span>:<span className="ro-status-active">Active</span>}</span></div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="ro-rp-card">
        <div className="ro-rp-hdr"><span className="ro-rp-ic"><ILightning/></span><div className="ro-rp-title">Quick Actions</div></div>
        <div className="ro-rp-body">
          {step>=4 && <button className="ro-qa-btn"><IDl/> Download Return Receipt</button>}
          <button className="ro-qa-btn"><IEye/> View Ride Details</button>
          <button className="ro-qa-btn"><IPhone/> Call Rider</button>
          <button className="ro-qa-btn"><IMsg/> Chat with Rider</button>
        </div>
      </div>

      {/* Need Help */}
      <div className="ro-rp-card">
        <div className="ro-rp-hdr"><span className="ro-rp-ic"><IHelp/></span><div className="ro-rp-title">Need Help?</div></div>
        <div className="ro-rp-body">
          <div className="ro-help-sub">Facing issues with return?</div>
          <button className="ro-contact-btn"><IHelp/> Contact Support</button>
        </div>
      </div>
    </div>
  );

  /* ─── Render ─── */
  return (
    <>
      <style dangerouslySetInnerHTML={{__html:CSS}}/>
      <div className="emp-shell">
        <Sidebar activePath="/return-ride" />

        {/* ── Main ── */}
        <div className="emp-main">
          <TopBar title="Return Ride" subtitle="Complete the ride and initiate return" showHand={false} />

          {/* Tabs */}
          <div className="emp-tabs">
            <div className={`emp-tab ${mainTab==='extend'?'active':''}`} onClick={()=>setMainTab('extend')}>
              <ICalPlus/> Extend Ride
            </div>
            <div className={`emp-tab ${mainTab==='return'?'active':''}`} onClick={()=>setMainTab('return')}>
              <IRefresh/> Return Vehicle
            </div>
            <div className={`emp-tab ${mainTab==='exchange'?'active':''}`} onClick={()=>setMainTab('exchange')}>
              <ISwap/> Exchange Vehicle
            </div>
          </div>

          {/* Content split */}
          <div className="emp-content-wrap">
            {/* Main content */}
            <div style={{display:'flex',flexDirection:'column',overflow:'hidden'}}>
              <div className="emp-step-area" style={{flex:1,overflowY:'auto'}}>
                {/* Stepper */}
                <div className="ro-stepper">
                  {getSteps(step).map((s,i)=>(
                    <div key={s.n} className="ro-sw">
                      <div className="ro-step">
                        <div className={`ro-sc ${s.state}`}>
                          {s.state==='done' ? <ICheck s={12} c="#fff"/> : s.n}
                        </div>
                        <div>
                          <div className={`ro-sn ${s.state==='pend'?'pend':''}`}>{s.label}</div>
                          <div className={`ro-ss ${s.state}`}>
                            {s.state==='done'?'Completed ✓':s.state==='act'?'In Progress':'Pending ○'}
                          </div>
                        </div>
                      </div>
                      {i<3 && <div className={`ro-sl ${s.state==='done'?'done':''}`}/>}
                    </div>
                  ))}
                </div>

                {/* Step content */}
                {step===1 && <Step1/>}
                {step===2 && <Step2/>}
                {step===3 && <Step3/>}
                {step===4 && <Step4/>}
              </div>

              {/* Footer navigation */}
              <div className="ro-footer">
                {step===1
                  ? <Link href="/ride-operations" style={{textDecoration:'none'}}><button className="ro-back-btn"><ILeft/> Back</button></Link>
                  : <button className="ro-back-btn" onClick={()=>setStep(p=>p-1)}><ILeft/> Back</button>
                }
                {step===4
                  ? <button
                      className={`ro-confirm-final-btn ${!confirmed?'':''}` }
                      style={{opacity:confirmed?1:.5,cursor:confirmed?'pointer':'not-allowed'}}
                      onClick={()=>{if(confirmed)alert('Return confirmed & ride closed!');}}
                    >
                      Confirm Return &amp; Close Ride <ICheck s={16} c="#fff"/>
                    </button>
                  : step===1
                    ? <button className="ro-next-btn disabled" style={{opacity:.4,cursor:'not-allowed'}}>Next: Vehicle Inspection <IRight s={13}/></button>
                    : <button className="ro-next-btn" onClick={()=>setStep(p=>p+1)}>
                        Next: {step===2?'Settlement':step===3?'Return Confirmation':''} <IRight s={13}/>
                      </button>
                }
              </div>
            </div>

            {/* Right Panel */}
            <div className="ro-rp-area">
              <RightPanel/>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
