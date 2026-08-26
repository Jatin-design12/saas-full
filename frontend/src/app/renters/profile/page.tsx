"use client";
import { useState, useMemo, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import Link from 'next/link';
import { api } from '@/lib/api';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.folder-container { display: flex; flex-direction: column; gap: 16px; padding: 18px; }
.folder-card { background: #fff; border: 1.5px solid #E2E8F0; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.02); }
.folder-hdr { display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; background: #FAFBFD; border-bottom: 1px solid #F1F5F9; cursor: pointer; }
.folder-hdr-left { display: flex; align-items: center; gap: 10px; font-weight: 700; font-size: 13.5px; color: #0F172A; }
.folder-badge { font-size: 11px; font-weight: 700; background: #EEF2FF; color: #4F46E5; padding: 2px 8px; border-radius: 20px; }
.folder-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 14px; padding: 16px; background: #fff; }
.doc-card { border: 1.5px solid #F1F5F9; border-radius: 10px; padding: 12px; display: flex; flex-direction: column; gap: 8px; background: #FAFAFA; transition: all .15s; }
.doc-card:hover { border-color: #6D28D9; background: #fff; box-shadow: 0 4px 12px rgba(109,40,217,0.06); }
.doc-card-thumb { height: 110px; background: #EEF2FF; border-radius: 8px; display: flex; align-items: center; justify-content: center; overflow: hidden; position: relative; }
.doc-card-thumb img { width: 100%; height: 100%; object-fit: cover; }
.doc-card-tit { font-size: 12.5px; font-weight: 700; color: #1E293B; }
.doc-card-sub { font-size: 11px; color: #64748B; }

.rp-shell { display: flex; min-height: 100vh; background: #F8F9FC; font-family: 'Inter', sans-serif; }
.rp-main { margin-left: 230px; display: flex; flex-direction: column; min-height: 100vh; width: calc(100% - 230px); }
.rp-page { flex: 1; padding: 20px 24px 70px; display: flex; flex-direction: column; gap: 20px; }

/* Breadcrumb styling */
.rp-bc { display: flex; align-items: center; gap: 6px; font-size: 12.5px; color: #64748B; font-weight: 500; margin-bottom: 2px; }
.rp-bc a { color: #6D28D9; text-decoration: none; font-weight: 600; transition: color .15s; }
.rp-bc a:hover { color: #4C1D95; }
.rp-bc-sep { color: #CBD5E1; font-weight: 600; }
.rp-bc-cur { color: #1E293B; font-weight: 700; }

/* Actions row */
.rp-actions-row { display: flex; justify-content: space-between; align-items: center; margin-top: -6px; }
.rp-h1 { font-size: 23px; font-weight: 800; color: #0F172A; margin: 0; letter-spacing: -0.02em; }
.rp-sub { font-size: 13px; color: #64748B; margin: 4px 0 0 0; font-weight: 400; }
.rp-btn-wrap { display: flex; gap: 10px; position: relative; }
.rp-btn-outline { display: flex; align-items: center; gap: 8px; padding: 8px 16px; border: 1.5px solid #E2E8F0; border-radius: 8px; font-size: 12.5px; font-weight: 600; color: #475569; background: #fff; cursor: pointer; transition: all .15s; }
.rp-btn-outline:hover { border-color: #6D28D9; color: #6D28D9; background: #FAF5FF; }
.rp-btn-primary { display: flex; align-items: center; gap: 8px; padding: 8px 16px; background: #6D28D9; color: #fff; border: 1.5px solid #6D28D9; border-radius: 8px; font-size: 12.5px; font-weight: 600; cursor: pointer; transition: all .15s; }
.rp-btn-primary:hover { background: #5B21B6; border-color: #5B21B6; }

/* Dropdown Menu actions */
.rp-actions-dropdown { position: absolute; top: 100%; right: 0; margin-top: 6px; background: #fff; border: 1px solid #E2E8F0; border-radius: 8px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05); z-index: 100; min-width: 170px; display: flex; flex-direction: column; padding: 4px; }
.rp-actions-dropdown button { width: 100%; padding: 8px 12px; font-size: 12.5px; font-weight: 500; color: #334155; border: none; background: none; border-radius: 6px; cursor: pointer; text-align: left; transition: all .15s; }
.rp-actions-dropdown button:hover { background: #F5F3FF; color: #6D28D9; }

/* Main Profile Header Card */
.rp-profile-card { background: #fff; border: 1.5px solid #E2E8F0; border-radius: 16px; padding: 22px; display: grid; grid-template-columns: 1.15fr 1.35fr 1fr; gap: 24px; align-items: start; box-shadow: 0 1px 3px rgba(0,0,0,.02); }
.rp-profile-left { display: flex; gap: 18px; align-items: center; }
.rp-avatar-circle { width: 100px; height: 100px; border-radius: 50%; overflow: hidden; background: #EEF2FF; border: 1.5px solid #E2E8F0; display: flex; align-items: center; justify-content: center; flex-shrink: 0; position: relative; }
.rp-avatar-circle img { width: 100%; height: 100%; object-fit: cover; }
.rp-profile-details { display: flex; flex-direction: column; gap: 4px; }
.rp-profile-name-row { display: flex; align-items: center; gap: 8px; }
.rp-profile-name { font-size: 19px; font-weight: 800; color: #0F172A; }
.badge-active { background: #DCFCE7; color: #15803D; font-size: 10.5px; font-weight: 700; padding: 2px 8px; border-radius: 6px; border: 1px solid #BBF7D0; }
.badge-purple { background: #F3E8FF; color: #2A195C; font-size: 10.5px; font-weight: 700; padding: 2px 8px; border-radius: 6px; border: 1px solid #E9D5FF; }
.rp-profile-id { font-size: 12px; color: #64748B; font-weight: 500; font-family: monospace; }
.rp-profile-meta-line { font-size: 12.5px; color: #475569; font-weight: 500; display: flex; align-items: center; gap: 4px; }
.rp-profile-meta-line span { font-weight: 600; color: #1E293B; }

.rp-profile-mid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px 16px; border-left: 1.5px solid #F1F5F9; border-right: 1.5px solid #F1F5F9; padding: 0 24px; min-height: 100px; align-content: center; }
.rp-mid-item { display: flex; align-items: flex-start; gap: 8px; }
.rp-mid-ic { color: #2A195C; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px; }
.rp-mid-lbl { font-size: 11px; color: #64748B; font-weight: 500; text-transform: uppercase; letter-spacing: 0.02em; }
.rp-mid-val { font-size: 12.5px; font-weight: 700; color: #1E293B; margin-top: 1px; }

/* Header right cards */
.rp-header-summary-card { display: flex; flex-direction: column; gap: 12px; height: 100%; justify-content: center; }
.rp-summary-title { font-size: 12px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.05em; margin: 0; }
.rp-summary-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
.rp-summary-col { display: flex; gap: 8px; padding: 8px 10px; border-radius: 10px; border: 1px solid #E2E8F0; background: #FAFBFD; align-items: center; }
.rp-summary-ic { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.rp-summary-ic.purple { background: #8B5CF6; color: #fff; }
.rp-summary-ic.blue { background: #3B82F6; color: #fff; }
.rp-summary-ic.yellow { background: #F59E0B; color: #fff; }
.rp-summary-ic.green { background: #10B981; color: #fff; }
.rp-summary-lbl { font-size: 10.5px; color: #64748B; font-weight: 500; }
.rp-summary-num { font-size: 13.5px; font-weight: 800; color: #0F172A; line-height: 1.1; }
.rp-summary-pct { font-size: 9px; font-weight: 700; display: inline-flex; align-items: center; margin-top: 2px; }
.rp-summary-pct.green {  color: #23cc1e; }

/* Radial progress chart details */
.rp-radial-box { display: flex; align-items: center; gap: 16px; border: 1.5px solid #E2E8F0; border-radius: 12px; padding: 12px 16px; background: #FAFBFD; height: 100%; justify-content: space-between; }
.rp-radial-txt { display: flex; flex-direction: column; gap: 2px; }
.rp-radial-tit { font-size: 13.5px; font-weight: 700; color: #1E293B; }
.rp-radial-desc { font-size: 11px; color: #64748B; line-height: 1.3; }
.rp-radial-btn { font-size: 11px; font-weight: 700; color: #6D28D9; border: 1.5px solid #6D28D9; border-radius: 6px; padding: 4px 8px; background: #fff; cursor: pointer; transition: all .15s; margin-top: 4px; align-self: flex-start; }
.rp-radial-btn:hover { background: #FAF5FF; }
.rp-radial-svg { position: relative; width: 66px; height: 66px; display: flex; align-items: center; justify-content: center; }
.rp-radial-svg-val { position: absolute; font-size: 13px; font-weight: 800; color: #0F172A; }

/* Tabs bar */
.rp-tabs { display: flex; border-bottom: 1.5px solid #E2E8F0; gap: 24px; margin-bottom: 8px; }
.rp-tab { padding: 10px 4px; font-size: 13px; font-weight: 700; color: #64748B; cursor: pointer; border-bottom: 3px solid transparent; transition: all .15s; margin-bottom: -1.5px; }
.rp-tab:hover { color: #6D28D9; }
.rp-tab.active { color: #6D28D9; border-bottom-color: #6D28D9; }

/* Grid Layouts */
.rp-layout-3col { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.rp-layout-2col-split { display: grid; grid-template-columns: 1fr 1.6fr; gap: 20px; }
.rp-card { background: #fff; border: 1.5px solid #E2E8F0; border-radius: 12px; padding: 18px; box-shadow: 0 1px 3px rgba(0,0,0,.02); display: flex; flex-direction: column; gap: 14px; position: relative; }
.rp-card-hdr { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #F1F5F9; padding-bottom: 10px; margin-bottom: 2px; }
.rp-card-tit { font-size: 13.5px; font-weight: 800; color: #0F172A; text-transform: uppercase; letter-spacing: 0.03em; display: flex; align-items: center; gap: 6px; }
.rp-card-link { font-size: 12px; font-weight: 700; color: #6D28D9; text-decoration: none; cursor: pointer; }
.rp-card-link:hover { text-decoration: underline; }

/* Status table detail */
.rp-info-list { display: flex; flex-direction: column; gap: 11px; }
.rp-info-row { display: flex; justify-content: space-between; align-items: center; font-size: 12.5px; }
.rp-info-lbl { color: #64748B; font-weight: 600; display: flex; align-items: center; gap: 6px; }
.rp-info-val { font-weight: 700; color: #1E293B; }
.dot-green { display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #16A34A; margin-right: 4px; }
.dot-green-pulse { display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #16A34A; position: relative; margin-right: 6px; vertical-align: middle; }
.dot-green-pulse::after { content: ''; position: absolute; inset: -4px; border-radius: 50%; border: 2px solid #16A34A; opacity: 0.6; animation: rp-pulse 1.5s infinite; }
@keyframes rp-pulse { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(2.2); opacity: 0; } }

/* Assignment Scooter Info */
.rp-scooter-assignment { display: flex; gap: 16px; align-items: center; margin: 4px 0; }
.rp-scooter-img { width: 90px; height: 75px; object-fit: contain; flex-shrink: 0; background: #FAF9FF; border-radius: 8px; padding: 4px; }
.rp-assignment-details { flex: 1; display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px 12px; font-size: 12.5px; }

/* Timelines */
.rp-timeline { display: flex; flex-direction: column; gap: 14px; position: relative; padding-left: 12px; margin-top: 4px; }
.rp-timeline::before { content: ''; position: absolute; left: 3.5px; top: 6px; bottom: 6px; width: 1.5px; background: #E2E8F0; }
.rp-tl-item { display: flex; justify-content: space-between; align-items: flex-start; position: relative; gap: 10px; }
.rp-tl-dot { width: 8px; height: 8px; border-radius: 50%; background: #CBD5E1; border: 2px solid #fff; position: absolute; left: -12px; top: 4px; box-shadow: 0 0 0 2px #E2E8F0; }
.rp-tl-dot.green { background: #10B981; color: #fff; }
.rp-tl-dot.blue { background: #3B82F6; color: #fff; }
.rp-tl-dot.yellow { background: #F59E0B; color: #fff; }
.rp-tl-info { display: flex; flex-direction: column; gap: 1px; }
.rp-tl-txt { font-size: 12.5px; color: #1E293B; font-weight: 600; }
.rp-tl-time { font-size: 11px; color: #94A3B8; font-weight: 500; }

/* Badges Achievements */
.rp-badge-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; text-align: center; }
.rp-badge-item { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 8px; border-radius: 8px; border: 1.2px solid #E2E8F0; background: #FAFBFD; transition: transform .15s; }
.rp-badge-item:hover { transform: translateY(-2px); border-color: #C084FC; background: #FAF5FF; }
.rp-badge-ic { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
.rp-badge-ic.green { background: #10B981; color: #fff; }
.rp-badge-ic.blue { background: #3B82F6; color: #fff; }
.rp-badge-ic.purple { background: #8B5CF6; color: #fff; }
.rp-badge-ic.orange { background: #F97316; color: #fff; }
.rp-badge-lbl { font-size: 11px; font-weight: 700; color: #1E293B; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 100%; }
.rp-badge-date { font-size: 9px; color: #94A3B8; font-weight: 500; }

/* Mini earnings grid */
.rp-mini-earnings { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.rp-mini-earning-card { border: 1px solid #E2E8F0; border-radius: 8px; padding: 10px 12px; background: #FAFBFD; display: flex; flex-direction: column; gap: 2px; }
.rp-mini-earning-val { font-size: 16px; font-weight: 800; color: #0F172A; }
.rp-mini-earning-lbl { font-size: 10px; color: #64748B; font-weight: 500; }
.rp-mini-earning-sub { font-size: 9px; color: #16A34A; font-weight: 700; display: inline-flex; align-items: center; }

/* KPI Grid for Performance tab */
.rp-kpi-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 10px; width: 100%; }
.rp-kpi-card { background: #fff; border: 1.5px solid #E2E8F0; border-radius: 12px; padding: 12px; display: flex; flex-direction: column; box-shadow: 0 1px 3px rgba(0,0,0,.02); }
.rp-kpi-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px; }
.rp-kpi-tit { font-size: 10.5px; font-weight: 600; color: #64748B; text-transform: uppercase; letter-spacing: 0.02em; }
.rp-kpi-ic { width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.rp-kpi-ic.purple { background: #8B5CF6; color: #fff; }
.rp-kpi-ic.green { background: #10B981; color: #fff; }
.rp-kpi-ic.blue { background: #3B82F6; color: #fff; }
.rp-kpi-ic.orange { background: #F97316; color: #fff; }
.rp-kpi-ic.red { background: #EF4444; color: #fff; }
.rp-kpi-val { font-size: 18px; font-weight: 800; color: #0F172A; margin: 4px 0 2px; }
.rp-kpi-sub { font-size: 9px; font-weight: 700; }

/* Custom trend charts grid */
.rp-charts-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }

/* Tables general */
.rp-table-wrap { overflow-x: auto; border: 1px solid #E2E8F0; border-radius: 10px; margin-top: 4px; }
.rp-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 12.5px; }
.rp-table th { font-size: 10.5px; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 0.04em; padding: 10px 14px; background: #FAFBFD; border-bottom: 1px solid #E2E8F0; }
.rp-table td { padding: 10px 14px; border-bottom: 1px solid #F1F5F9; color: #334155; }
.rp-table tr:last-child td { border-bottom: none; }
.rp-table tr:hover td { background: #FAFCFF; }

/* Pills badges */
.pill-badge { display: inline-flex; align-items: center; padding: 2px 8px; border-radius: 20px; font-size: 10.5px; font-weight: 700; white-space: nowrap; }
.pill-purple { background: #F3E8FF; color: #2A195C; }
.pill-orange { background: #FFF7ED; color: #C2410C; }
.pill-blue { background: #EFF6FF; color: #1D4ED8; }
.pill-green { background: #ECFDF5; color: #15803D; }
.pill-red { background: #FEE2E2; color: #B91C1C; }

/* Incident severity badges */
.sev-badge { display: inline-flex; align-items: center; padding: 2px 8px; border-radius: 6px; font-size: 10.5px; font-weight: 700; }
.sev-high { background: #FEE2E2; color: #EF4444; border: 1px solid #FCA5A5; }
.sev-medium { background: #FFF7ED; color: #F97316; border: 1px solid #FFDDAD; }
.sev-low { background: #ECFDF5; color: #10B981; border: 1px solid #A7F3D0; }

/* Filter header toolbar inside tab */
.rp-tab-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.rp-tab-title { font-size: 15px; font-weight: 800; color: #0F172A; margin: 0; }
.rp-tab-subtitle { font-size: 12px; color: #64748B; margin: 2px 0 0 0; }
.rp-tab-tools { display: flex; gap: 8px; align-items: center; }

/* Earnings Page filters row */
.rp-earnings-filters { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border: 1.5px solid #E2E8F0; border-radius: 12px; background: #fff; gap: 16px; }
.rp-earnings-period-tabs { display: flex; gap: 4px; background: #F1F5F9; padding: 3px; border-radius: 8px; }
.rp-earnings-period-tab { border: none; padding: 6px 12px; font-size: 11.5px; font-weight: 700; color: #475569; background: transparent; border-radius: 6px; cursor: pointer; transition: all .1s; }
.rp-earnings-period-tab:hover { color: #0F172A; }
.rp-earnings-period-tab.active { background: #fff; color: #6D28D9; box-shadow: 0 1px 2px rgba(0,0,0,0.06); }
.rp-earnings-metrics-row { display: flex; gap: 20px; flex: 1; justify-content: flex-end; align-items: center; }
.rp-earnings-metric { display: flex; flex-direction: column; gap: 2px; }
.rp-earnings-metric-val { font-size: 14.5px; font-weight: 800; color: #0F172A; }
.rp-earnings-metric-lbl { font-size: 9.5px; color: #64748B; font-weight: 600; text-transform: uppercase; letter-spacing: 0.02em; }
.rp-earnings-metric-sub { font-size: 9px; font-weight: 700; display: inline-flex; align-items: center; }

/* Filter bar in lists tables */
.rp-list-filter-bar { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: #FAFBFD; border-bottom: 1.5px solid #E2E8F0; border-radius: 10px 10px 0 0; gap: 12px; }
.rp-search-wrapper { position: relative; display: flex; align-items: center; width: 240px; }
.rp-search-ic { position: absolute; left: 10px; color: #94A3B8; display: flex; align-items: center; }
.rp-search-inp { width: 100%; padding: 6px 10px 6px 30px; border: 1.5px solid #E2E8F0; border-radius: 8px; font-size: 12px; outline: none; font-weight: 500; }
.rp-search-inp:focus { border-color: #6D28D9; }
.rp-select { padding: 6px 10px; border: 1.5px solid #E2E8F0; border-radius: 8px; font-size: 12px; outline: none; background: #fff; color: #334155; font-weight: 500; cursor: pointer; }
.rp-select:focus { border-color: #6D28D9; }

/* Footer summary pagination */
.rp-footer-bar { display: flex; align-items: center; justify-content: space-between; padding: 10px 16px; border-top: 1.5px solid #E2E8F0; background: #FAFBFD; border-radius: 0 0 10px 10px; font-size: 12px; }
.rp-pagination { display: flex; align-items: center; gap: 4px; }
.rp-pg-btn { width: 26px; height: 26px; border: 1.2px solid #E2E8F0; border-radius: 6px; background: #fff; font-size: 11.5px; font-weight: 600; color: #475569; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all .12s; }
.rp-pg-btn:hover:not(:disabled) { border-color: #6D28D9; color: #6D28D9; }
.rp-pg-btn.active { background: #6D28D9; color: #fff; border-color: #6D28D9; }
.rp-pg-btn:disabled { opacity: 0.4; cursor: not-allowed; }

/* Popups / Dialogs style */
.rp-modal-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(2px); z-index: 200; display: flex; align-items: center; justify-content: center; animation: rp-fadein 0.15s ease-out; }
.rp-modal-box { background: #fff; border-radius: 16px; border: 1px solid #E2E8F0; width: 440px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.15), 0 10px 10px -5px rgba(0,0,0,0.04); display: flex; flex-direction: column; overflow: hidden; animation: rp-pop 0.2s cubic-bezier(0.16, 1, 0.3, 1); }
.rp-modal-hdr { padding: 16px 20px; border-bottom: 1.5px solid #F1F5F9; display: flex; justify-content: space-between; align-items: center; }
.rp-modal-tit { font-size: 15px; font-weight: 800; color: #0F172A; margin: 0; }
.rp-modal-close { border: none; background: none; font-size: 18px; color: #94A3B8; cursor: pointer; transition: color .15s; }
.rp-modal-close:hover { color: #64748B; }
.rp-modal-body { padding: 20px; display: flex; flex-direction: column; gap: 14px; }
.rp-modal-ft { padding: 14px 20px; border-top: 1.5px solid #F1F5F9; background: #FAFBFD; display: flex; justify-content: flex-end; gap: 8px; }

.rp-form-group { display: flex; flex-direction: column; gap: 4px; }
.rp-form-lbl { font-size: 11.5px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.02em; }
.rp-form-inp { width: 100%; padding: 8px 12px; border: 1.5px solid #E2E8F0; border-radius: 8px; font-size: 13px; outline: none; font-weight: 500; }
.rp-form-inp:focus { border-color: #6D28D9; }

/* Custom alert toast */
.rp-toast { position: fixed; bottom: 24px; right: 24px; background: #0F172A; color: #fff; padding: 12px 20px; border-radius: 10px; display: flex; align-items: center; gap: 10px; font-size: 12.5px; font-weight: 600; z-index: 300; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.3); animation: rp-slideup 0.25s cubic-bezier(0.16, 1, 0.3, 1); }
.rp-toast-green { border-left: 4px solid #10B981; }

@keyframes rp-fadein { from { opacity: 0; } to { opacity: 1; } }
@keyframes rp-pop { from { transform: scale(0.96); opacity: 0; } to { transform: scale(1); opacity: 1; } }
@keyframes rp-slideup { from { transform: translateY(12px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

/* Verification icons */
.status-tag { display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: 20px; font-size: 10.5px; font-weight: 700; }
.status-tag.verified { background: #ECFDF5; color: #047857; }
.status-tag.pending { background: #FEF3C7; color: #D97706; }
`;

interface DocumentItem {
  name: string;
  category: string;
  number: string;
  issueDate: string;
  expiryDate: string;
  status: 'Verified' | 'Pending';
}

const INITIAL_DOCS: DocumentItem[] = [
  { name: 'Aadhaar Card', category: 'Identity Proof', number: 'XXXX XXXX 5678', issueDate: '10 Jan 2020', expiryDate: '-', status: 'Verified' },
  { name: 'Driving License', category: 'License', number: 'DL-08-2020-1234567', issueDate: '15 Aug 2020', expiryDate: '14 Aug 2030', status: 'Verified' },
  { name: 'Vehicle Insurance', category: 'Insurance', number: 'INS-2024-458712', issueDate: '01 Apr 2024', expiryDate: '31 Mar 2025', status: 'Verified' },
  { name: 'Vehicle RC', category: 'Vehicle Document', number: 'RC-2024-789456', issueDate: '20 Feb 2024', expiryDate: '-', status: 'Verified' },
  { name: 'Bank Passbook', category: 'Bank Document', number: 'XXXX-XXXX-1234', issueDate: '05 Mar 2024', expiryDate: '-', status: 'Verified' },
  { name: 'Medical Certificate', category: 'Certificate', number: 'MED-2024-00125', issueDate: '22 Feb 2024', expiryDate: '21 Feb 2025', status: 'Pending' },
  { name: 'Police Verification', category: 'Verification', number: 'PV-2024-03659', issueDate: '18 Jan 2024', expiryDate: '-', status: 'Verified' },
];

interface RiderVehicle {
  name: string;
  type: string;
  plate: string;
  batteryId: string;
  status: 'Active' | 'Inactive';
  assignedOn: string;
  lastRide: string;
  lastRideDist: string;
  img: string;
}

const INITIAL_VEHICLES: RiderVehicle[] = [
  { name: 'Ola S1 Pro', type: 'Electric Scooter', plate: 'DL-01-AB-1234', batteryId: 'BAT-2024-45871', status: 'Active', assignedOn: '15 Jan 2024 10:30 AM', lastRide: '20 May 2024 09:15 AM', lastRideDist: '12.5 km', img: '🛵' },
  { name: 'TVS iQube', type: 'Electric Scooter', plate: 'DL-01-AB-5678', batteryId: 'BAT-2024-45872', status: 'Active', assignedOn: '20 Feb 2024 11:20 AM', lastRide: '19 May 2024 08:45 PM', lastRideDist: '18.7 km', img: '🛵' },
  { name: 'Ather 450X', type: 'Electric Scooter', plate: 'DL-01-AB-9012', batteryId: 'BAT-2024-45873', status: 'Active', assignedOn: '10 Mar 2024 09:15 AM', lastRide: '20 May 2024 07:30 AM', lastRideDist: '22.1 km', img: '🛵' },
  { name: 'Bajaj Chetak', type: 'Electric Scooter', plate: 'DL-01-AB-3456', batteryId: 'BAT-2024-45874', status: 'Active', assignedOn: '05 Apr 2024 02:45 PM', lastRide: '18 May 2024 06:10 PM', lastRideDist: '15.3 km', img: '🛵' },
  { name: 'Mahindra Treo', type: 'Electric 3 Wheeler', plate: 'DL-01-AB-7890', batteryId: 'BAT-2024-45875', status: 'Active', assignedOn: '22 Apr 2024 11:05 AM', lastRide: '19 May 2024 05:40 PM', lastRideDist: '35.6 km', img: '🛺' },
  { name: 'Hero Electric Optima', type: 'Electric Scooter', plate: 'DL-01-AB-1122', batteryId: 'BAT-2024-45876', status: 'Inactive', assignedOn: '30 Nov 2023 01:20 PM', lastRide: '-', lastRideDist: '', img: '🛵' },
];

interface IncidentItem {
  id: string;
  type: string;
  severity: 'High' | 'Medium' | 'Low';
  description: string;
  reportedOn: string;
  status: 'Open' | 'In Review' | 'Resolved';
  reportedBy: string;
}

const INITIAL_INCIDENTS: IncidentItem[] = [
  { id: 'INC-2024-1258', type: 'Traffic Violation', severity: 'High', description: 'Over speeding detected (72 km/h in 40 km/h zone)', reportedOn: '20 May 2024, 09:15 AM', status: 'Open', reportedBy: 'System' },
  { id: 'INC-2024-1241', type: 'Unsafe Driving', severity: 'Medium', description: 'Sharp braking and aggressive acceleration', reportedOn: '19 May 2024, 04:32 PM', status: 'In Review', reportedBy: 'System' },
  { id: 'INC-2024-1187', type: 'Battery Misuse', severity: 'Low', description: 'Battery swapped before 25% (policy violation)', reportedOn: '17 May 2024, 11:05 AM', status: 'Resolved', reportedBy: 'System' },
  { id: 'INC-2024-1123', type: 'Zone Violation', severity: 'High', description: 'Entered restricted zone (Red Zone)', reportedOn: '15 May 2024, 08:45 PM', status: 'Resolved', reportedBy: 'System' },
  { id: 'INC-2024-1099', type: 'Customer Complaint', severity: 'Medium', description: 'Customer reported rude behaviour', reportedOn: '13 May 2024, 02:20 PM', status: 'Resolved', reportedBy: 'Customer' },
  { id: 'INC-2024-1065', type: 'Helmet Violation', severity: 'Low', description: 'Rider captured without helmet', reportedOn: '11 May 2024, 10:10 AM', status: 'Resolved', reportedBy: 'System' },
  { id: 'INC-2024-1001', type: 'Document Issue', severity: 'Low', description: 'Driving license expired', reportedOn: '09 May 2024, 09:30 AM', status: 'Resolved', reportedBy: 'Admin' },
  { id: 'INC-2024-0958', type: 'Punctuality Issue', severity: 'Medium', description: 'Frequently cancelling rides after acceptance', reportedOn: '07 May 2024, 06:15 PM', status: 'Open', reportedBy: 'System' },
];

function RiderProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const riderId = searchParams.get('id') || 'RID-2026-001';
  const initialTab = searchParams.get('tab') || 'Overview';
  const rawParamName = searchParams.get('name') || '';
  const riderName = (!rawParamName || rawParamName === 'Guest Rider' || rawParamName === 'Evegah Rider') ? 'jatin rohit' : rawParamName;
  const riderMobile = searchParams.get('mobile') || '+91 8128251172';
  const riderVehicle = searchParams.get('vehicle') || 'EVM1024001';
  const riderBattery = searchParams.get('battery') || 'BAT-GOTRI-01';
  const riderStatus = searchParams.get('status') || 'Active Ride';
  const riderZone = searchParams.get('zone') || 'Aatapi Zone';
  const riderEmail = `${riderName.toLowerCase().replace(/\s+/g, '.')}@evegah.com`;
  const riderAvatar = riderName.toLowerCase().includes('priya') ? '/priya_avatar.png' : '/rohit_avatar.png';

  // State management
  const [activeTab, setActiveTab] = useState(initialTab);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; msg: string }>({ show: false, msg: '' });

  // Dialog Modals state
  const [modalType, setModalType] = useState<'editContact' | 'uploadDoc' | 'message' | 'addVehicle' | null>(null);

  // Dynamic Contact support details
  const [contactName, setContactName] = useState('Suresh Kumar');
  const [contactRelation, setContactRelation] = useState('Father');
  const [contactPhone, setContactPhone] = useState('+91 98765 12345');

  // Input states for modal forms
  const [editNameInput, setEditNameInput] = useState(contactName);
  const [editRelationInput, setEditRelationInput] = useState(contactRelation);
  const [editPhoneInput, setEditPhoneInput] = useState(contactPhone);

  const [docNameInput, setDocNameInput] = useState('');
  const [docCatInput, setDocCatInput] = useState('Identity Proof');
  const [docNumInput, setDocNumInput] = useState('');

  const [messageInput, setMessageInput] = useState('');

  // Input states for Add Vehicle modal
  const [newVehicleName, setNewVehicleName] = useState('');
  const [newVehicleType, setNewVehicleType] = useState('Electric Scooter');
  const [newVehiclePlate, setNewVehiclePlate] = useState('');
  const [newVehicleBattery, setNewVehicleBattery] = useState('');

  // Period / Date filter states
  const [earningsPeriod, setEarningsPeriod] = useState<'Today' | 'This Week' | 'This Month' | 'This Quarter' | 'Custom'>('This Month');
  const [selectedDateRange, setSelectedDateRange] = useState('01 May 2024 - 21 May 2024');

  // Pagination states
  const [performancePage, setPerformancePage] = useState(1);
  const [earningsPage, setEarningsPage] = useState(1);
  const [docsPage, setDocsPage] = useState(1);
  const [incidentsPage, setIncidentsPage] = useState(1);
  const [vehiclesPage, setVehiclesPage] = useState(1);

  // Filter lists in memory
  const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCS);
  const [docStatusFilter, setDocStatusFilter] = useState('');
  const [docCatFilter, setDocCatFilter] = useState('');

  const [folderData, setFolderData] = useState<any[]>([]);
  const [kycStatus, setKycStatus] = useState<string>('Verified');
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<{ title: string; image?: string; details?: string } | null>(null);

  const fetchFolderDocs = async () => {
    setLoadingDocs(true);
    try {
      const res = await api.get(`/renters/documents?mobile=${encodeURIComponent(riderMobile)}`);
      if (res.data && res.data.data && res.data.data.folders) {
        setFolderData(res.data.data.folders);
      }
      const kycRes = await api.get(`/renters/kyc?mobile=${encodeURIComponent(riderMobile)}`);
      if (kycRes.data && kycRes.data.data && kycRes.data.data.kyc_status) {
        setKycStatus(kycRes.data.data.kyc_status);
      }
    } catch (e) {
      console.error('Failed to fetch folder docs:', e);
    } finally {
      setLoadingDocs(false);
    }
  };

  useEffect(() => {
    fetchFolderDocs();
  }, [riderMobile]);

  const handleApproveKyc = async () => {
    try {
      await api.post('/renters/kyc/verify', { mobile: riderMobile, status: 'Verified' });
      setKycStatus('Verified');
      triggerToast('Rider KYC successfully approved & verified! ✓');
      fetchFolderDocs();
    } catch (e) {
      triggerToast('Failed to approve KYC');
    }
  };

  const [incidents, setIncidents] = useState<IncidentItem[]>(INITIAL_INCIDENTS);
  const [incidentStatusFilter, setIncidentStatusFilter] = useState('');
  const [incidentTypeFilter, setIncidentTypeFilter] = useState('');

  const [vehicles, setVehicles] = useState<RiderVehicle[]>(INITIAL_VEHICLES);
  const [vehicleSearchQuery, setVehicleSearchQuery] = useState('');
  const [vehicleStatusFilter, setVehicleStatusFilter] = useState('');
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState('');

  // Trigger toast helper
  const triggerToast = (msg: string) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: '' }), 3000);
  };

  // Switch tab utility
  const switchTab = (tabName: string) => {
    setActiveTab(tabName);
    setPerformancePage(1);
    setEarningsPage(1);
    setDocsPage(1);
    setIncidentsPage(1);
    setVehiclesPage(1);
    window.history.pushState(null, '', `/renters/profile?id=${riderId}&tab=${tabName}`);
  };

  // Date filters for Earnings
  const earningsMetrics = useMemo(() => {
    switch (earningsPeriod) {
      case 'Today':
        return { total: '₹480.00', ride: '₹420.00', inc: '₹40.00', tips: '₹20.00', ded: '- ₹0.00', net: '₹480.00', totalDeliveries: 4, distance: '32 km' };
      case 'This Week':
        return { total: '₹3,840.50', ride: '₹3,450.00', inc: '₹120.00', tips: '₹270.50', ded: '- ₹40.00', net: '₹3,800.50', totalDeliveries: 34, distance: '210 km' };
      case 'This Quarter':
        return { total: '₹56,420.00', ride: '₹51,200.00', inc: '₹3,400.00', tips: '₹1,820.00', ded: '- ₹480.00', net: '₹55,940.00', totalDeliveries: 420, distance: '1,950 km' };
      case 'Custom':
        return { total: '₹12,450.00', ride: '₹11,100.00', inc: '₹750.00', tips: '₹600.00', ded: '- ₹150.00', net: '₹12,300.00', totalDeliveries: 84, distance: '450 km' };
      case 'This Month':
      default:
        return { total: '₹6,450.75', ride: '₹6,050.00', inc: '₹250.00', tips: '₹150.75', ded: '- ₹120.00', net: '₹6,330.75', totalDeliveries: 126, distance: '654 km' };
    }
  }, [earningsPeriod]);

  // Filter actions for Documents list
  const filteredDocs = useMemo(() => {
    return documents.filter(d => {
      const matchStatus = docStatusFilter === '' || d.status === docStatusFilter;
      const matchCat = docCatFilter === '' || d.category === docCatFilter;
      return matchStatus && matchCat;
    });
  }, [documents, docStatusFilter, docCatFilter]);

  const paginatedDocs = useMemo(() => {
    const start = (docsPage - 1) * 5;
    return filteredDocs.slice(start, start + 5);
  }, [filteredDocs, docsPage]);

  // Filter actions for Incidents list
  const filteredIncidents = useMemo(() => {
    return incidents.filter(i => {
      const matchStatus = incidentStatusFilter === '' || i.status === incidentStatusFilter;
      const matchType = incidentTypeFilter === '' || i.type === incidentTypeFilter;
      return matchStatus && matchType;
    });
  }, [incidents, incidentStatusFilter, incidentTypeFilter]);

  const paginatedIncidents = useMemo(() => {
    const start = (incidentsPage - 1) * 5;
    return filteredIncidents.slice(start, start + 5);
  }, [filteredIncidents, incidentsPage]);

  // Filter actions for Vehicles list
  const filteredVehicles = useMemo(() => {
    return vehicles.filter(v => {
      const matchSearch = vehicleSearchQuery === '' || 
        v.name.toLowerCase().includes(vehicleSearchQuery.toLowerCase()) || 
        v.plate.toLowerCase().includes(vehicleSearchQuery.toLowerCase()) ||
        v.batteryId.toLowerCase().includes(vehicleSearchQuery.toLowerCase());
      const matchStatus = vehicleStatusFilter === '' || v.status === vehicleStatusFilter;
      const matchType = vehicleTypeFilter === '' || v.type === vehicleTypeFilter;
      return matchSearch && matchStatus && matchType;
    });
  }, [vehicles, vehicleSearchQuery, vehicleStatusFilter, vehicleTypeFilter]);

  const paginatedVehicles = useMemo(() => {
    const start = (vehiclesPage - 1) * 5;
    return filteredVehicles.slice(start, start + 5);
  }, [filteredVehicles, vehiclesPage]);

  // Handle adding a vehicle
  const handleAddVehicle = () => {
    if (!newVehicleName || !newVehiclePlate || !newVehicleBattery) {
      alert('Please fill out all fields for the new vehicle');
      return;
    }
    // Check if plate already exists to prevent duplicate entry
    if (vehicles.some(v => v.plate.toLowerCase() === newVehiclePlate.toLowerCase())) {
      alert('A vehicle with this plate number is already registered.');
      return;
    }
    const newV: RiderVehicle = {
      name: newVehicleName,
      type: newVehicleType,
      plate: newVehiclePlate.toUpperCase(),
      batteryId: newVehicleBattery.toUpperCase(),
      status: 'Active' as const,
      assignedOn: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' 10:00 AM',
      lastRide: '-',
      lastRideDist: '',
      img: newVehicleType === 'Electric 3 Wheeler' ? '🛺' : '🛵',
    };
    setVehicles([newV, ...vehicles]);
    setNewVehicleName('');
    setNewVehiclePlate('');
    setNewVehicleBattery('');
    setModalType(null);
    triggerToast(`Vehicle ${newVehiclePlate.toUpperCase()} assigned successfully!`);
  };

  // Handle emergency contact save
  const handleSaveContact = () => {
    setContactName(editNameInput);
    setContactRelation(editRelationInput);
    setContactPhone(editPhoneInput);
    setModalType(null);
    triggerToast('Emergency contact details updated successfully!');
  };

  // Handle add document submission
  const handleUploadDoc = () => {
    if (!docNameInput || !docNumInput) {
      alert('Please fill out all document fields');
      return;
    }
    const newDoc: DocumentItem = {
      name: docNameInput,
      category: docCatInput,
      number: docNumInput,
      issueDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      expiryDate: '-',
      status: 'Pending',
    };
    setDocuments([newDoc, ...documents]);
    setDocNameInput('');
    setDocNumInput('');
    setModalType(null);
    triggerToast('Document uploaded and sent for verification!');
  };

  // Handle Message Rider submit
  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    setModalType(null);
    setMessageInput('');
    triggerToast('Message dispatched to rider dashboard!');
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="rp-shell">
        <Sidebar activePath="/renters" />
        <div className="rp-main">
          <TopBar title="Hello, Akash" subtitle="Zone Employee" leftAvatarText="AV" hideZone={false} />

          <div className="rp-page">
            {/* Breadcrumbs */}
            <div className="rp-bc">
              <Link href="/renters">Riders</Link>
              <span className="rp-bc-sep">&gt;</span>
              {activeTab === 'Overview' ? (
                <span className="rp-bc-cur">Rider Profile</span>
              ) : (
                <>
                  <span style={{ cursor: 'pointer', color: '#6D28D9', fontWeight: 600 }} onClick={() => switchTab('Overview')}>Rider Profile</span>
                  <span className="rp-bc-sep">&gt;</span>
                  <span className="rp-bc-cur">{activeTab}</span>
                </>
              )}
            </div>

            {/* Title & Actions Row */}
            <div className="rp-actions-row">
              <div>
                <h1 className="rp-h1">{activeTab}</h1>
                <p className="rp-sub">
                  {activeTab === 'Performance' && 'Track and analyze rider performance, efficiency and impact'}
                  {activeTab === 'Earnings' && 'Overview of rider earnings and payouts'}
                  {activeTab === 'Overview' && 'View and manage rider information and activity'}
                  {activeTab === 'Documents' && 'View and manage rider documents and certificates'}
                  {activeTab === 'Incidents' && 'Track and manage incidents reported for this rider'}
                  {activeTab === 'Vehicles' && 'Historical logs of scooters rented by this rider'}
                  {activeTab === 'Activity' && 'Detailed system and operations logs'}
                  {activeTab === 'Reviews' && 'Customer reviews and overall rating metrics'}
                </p>
              </div>

              <div className="rp-btn-wrap">
                <button className="rp-btn-outline" onClick={() => setMenuOpen(!menuOpen)}>
                  ... More Actions
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                </button>

                {menuOpen && (
                  <div className="rp-actions-dropdown">
                    <button onClick={() => { setMenuOpen(false); alert('Rider suspended successfully'); }}>Suspend Rider</button>
                    <button onClick={() => { setMenuOpen(false); alert('Package changes initialized'); }}>Change Package</button>
                    <button onClick={() => { setMenuOpen(false); setModalType('editContact'); }}>Edit Contacts</button>
                    <button onClick={() => { setMenuOpen(false); alert('Rider account flagged'); }}>Flag Account</button>
                  </div>
                )}

                {activeTab === 'Performance' && (
                  <button className="rp-btn-primary" onClick={() => triggerToast('Performance report downloaded!')}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Export
                  </button>
                )}
                {activeTab === 'Earnings' && (
                  <button className="rp-btn-primary" onClick={() => triggerToast('Earnings spreadsheet exported!')}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Export
                  </button>
                )}
                {activeTab === 'Incidents' && (
                  <button className="rp-btn-primary" onClick={() => triggerToast('Incident history downloaded!')}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Export
                  </button>
                )}
                {activeTab === 'Vehicles' && (
                  <button className="rp-btn-primary" onClick={() => setModalType('addVehicle')}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Add Vehicle
                  </button>
                )}
              </div>
            </div>

            {/* Profile Info Header Card (Grid Layout) */}
            <div className="rp-profile-card">
              {/* Left Column: Profile Avatar + Core ID info */}
              <div className="rp-profile-left">
                <div className="rp-avatar-circle">
                  <img src={riderAvatar} alt={riderName} />
                </div>
                <div className="rp-profile-details">
                  <div className="rp-profile-name-row">
                    <span className="rp-profile-name">{riderName}</span>
                    <span className="badge-active">{riderStatus}</span>
                  </div>
                  <div className="rp-profile-id">{riderId}</div>
                  <div className="rp-profile-meta-line" style={{ marginTop: '2px' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    <span>{riderMobile}</span>
                  </div>
                  <div className="rp-profile-meta-line">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    <span>{riderEmail}</span>
                  </div>
                </div>
              </div>

              {/* Middle Column: Detailed demographic details */}
              {(activeTab === 'Performance' || activeTab === 'Incidents' || activeTab === 'Earnings') ? (
                <div className="rp-profile-mid">
                  <div className="rp-mid-item">
                    <span className="rp-mid-ic"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></span>
                    <div>
                      <div className="rp-mid-lbl">Joined On</div>
                      <div className="rp-mid-val">15 Jan 2024</div>
                    </div>
                  </div>
                  <div className="rp-mid-item">
                    <span className="rp-mid-ic"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="3"/><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z"/></svg></span>
                    <div>
                      <div className="rp-mid-lbl">Total Distance</div>
                      <div className="rp-mid-val">4,256 km</div>
                    </div>
                  </div>
                  <div className="rp-mid-item">
                    <span className="rp-mid-ic"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg></span>
                    <div>
                      <div className="rp-mid-lbl">Total Rides</div>
                      <div className="rp-mid-val">156</div>
                    </div>
                  </div>
                  <div className="rp-mid-item">
                    <span className="rp-mid-ic"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></span>
                    <div>
                      <div className="rp-mid-lbl">Avg Rating</div>
                      <div className="rp-mid-val">★ 4.7</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rp-profile-mid">
                  <div className="rp-mid-item">
                    <span className="rp-mid-ic"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></span>
                    <div>
                      <div className="rp-mid-lbl">Date of Birth</div>
                      <div className="rp-mid-val">12 Mar 1998</div>
                    </div>
                  </div>
                  <div className="rp-mid-item">
                    <span className="rp-mid-ic"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></span>
                    <div>
                      <div className="rp-mid-lbl">Joined On</div>
                      <div className="rp-mid-val">15 Jan 2024</div>
                    </div>
                  </div>
                  <div className="rp-mid-item">
                    <span className="rp-mid-ic"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2a5 5 0 0 0-5 5v3a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V7a5 5 0 0 0-5-5z"/><path d="M19 21v-2a4 4 0 0 0-3-3.87"/><path d="M5 21v-2a4 4 0 0 1 3-3.87"/></svg></span>
                    <div>
                      <div className="rp-mid-lbl">Gender</div>
                      <div className="rp-mid-val">Male</div>
                    </div>
                  </div>
                  <div className="rp-mid-item" style={{ gridColumn: 'span 2' }}>
                    <span className="rp-mid-ic"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></span>
                    <div>
                      <div className="rp-mid-lbl">Address</div>
                      <div className="rp-mid-val" style={{ fontSize: '11.5px', fontWeight: 600 }}>Station Road, {riderZone}, Vadodara</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Right Column Summary Widget (adapts based on tab) */}
              <div className="rp-header-right-panel">
                {activeTab === 'Overview' && (
                  <div className="rp-header-summary-card">
                    <h4 className="rp-summary-title">Performance Summary (This Month)</h4>
                    <div className="rp-summary-grid">
                      <div className="rp-summary-col">
                        <div className="rp-summary-ic purple">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                        </div>
                        <div>
                          <span className="rp-summary-lbl">Deliveries</span>
                          <div className="rp-summary-num">126</div>
                          <span className="rp-summary-pct green">↑ 12.5%</span>
                        </div>
                      </div>
                      <div className="rp-summary-col">
                        <div className="rp-summary-ic blue">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/></svg>
                        </div>
                        <div>
                          <span className="rp-summary-lbl">Distance</span>
                          <div className="rp-summary-num">654 km</div>
                          <span className="rp-summary-pct green">↑ 8.3%</span>
                        </div>
                      </div>
                      <div className="rp-summary-col">
                        <div className="rp-summary-ic yellow">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                        </div>
                        <div>
                          <span className="rp-summary-lbl">Rating</span>
                          <div className="rp-summary-num">4.8 / 5</div>
                          <span className="rp-summary-pct green">↑ 0.2</span>
                        </div>
                      </div>
                      <div className="rp-summary-col">
                        <div className="rp-summary-ic green">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="5" width="20" height="14" rx="2" ry="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
                        </div>
                        <div>
                          <span className="rp-summary-lbl">Earnings</span>
                          <div className="rp-summary-num">₹18,450</div>
                          <span className="rp-summary-pct green">↑ 15.6%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'Performance' && (
                  <div className="rp-radial-box">
                    <div className="rp-radial-txt">
                      <div className="rp-radial-tit">Performance Score</div>
                      <div className="rp-radial-desc">
                        <span style={{ fontWeight: 800, color: '#16A34A' }}>Excellent</span>
                        <br />Keep up the great work!
                      </div>
                      <button className="rp-radial-btn" onClick={() => alert('Performance breakdown detail loading...')}>View Details</button>
                    </div>
                    <div className="rp-radial-svg">
                      <svg width="66" height="66" viewBox="0 0 36 36">
                        <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#E2E8F0" strokeWidth="3.5" />
                        <path className="circle" strokeDasharray="87, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#2A195C" strokeWidth="3.5" strokeLinecap="round" />
                      </svg>
                      <span className="rp-radial-svg-val">87%</span>
                    </div>
                  </div>
                )}

                {activeTab === 'Earnings' && (
                  <div className="rp-header-summary-card">
                    <h4 className="rp-summary-title">Earnings Summary</h4>
                    <div className="rp-summary-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
                      <div className="rp-summary-col">
                        <div className="rp-summary-ic purple"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg></div>
                        <div>
                          <span className="rp-summary-lbl" style={{ fontSize: '9px' }}>Total Earnings</span>
                          <div className="rp-summary-num" style={{ fontSize: '12.5px' }}>₹18,560.75</div>
                        </div>
                      </div>
                      <div className="rp-summary-col">
                        <div className="rp-summary-ic green"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="5" width="20" height="14" rx="2" ry="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg></div>
                        <div>
                          <span className="rp-summary-lbl" style={{ fontSize: '9px' }}>Total Payouts</span>
                          <div className="rp-summary-num" style={{ fontSize: '12.5px' }}>₹16,200.00</div>
                        </div>
                      </div>
                      <div className="rp-summary-col" style={{ gridColumn: 'span 2' }}>
                        <div className="rp-summary-ic yellow"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div>
                        <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <span className="rp-summary-lbl" style={{ fontSize: '9px' }}>Pending Balance</span>
                            <div className="rp-summary-num" style={{ fontSize: '13px' }}>₹2,360.75</div>
                          </div>
                          <span className="badge-purple" style={{ fontSize: '9px', padding: '1px 6px' }}>On Hold</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'Documents' && (
                  <div className="rp-radial-box">
                    <div className="rp-radial-txt">
                      <div className="rp-radial-tit">Document Storage</div>
                      <div className="rp-radial-desc">
                        <span style={{ fontWeight: 800, color: '#2563EB' }}>7.8 GB</span> / 10 GB
                        <br />Storage capacity used
                      </div>
                      <button className="rp-radial-btn" onClick={() => alert('Storage configuration dashboard loading...')}>Manage Storage</button>
                    </div>
                    <div className="rp-radial-svg">
                      <svg width="66" height="66" viewBox="0 0 36 36">
                        <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#E2E8F0" strokeWidth="3.5" />
                        <path className="circle" strokeDasharray="78, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#2563EB" strokeWidth="3.5" strokeLinecap="round" />
                      </svg>
                      <span className="rp-radial-svg-val">78%</span>
                    </div>
                  </div>
                )}

                {activeTab === 'Incidents' && (
                  <div className="rp-header-summary-card">
                    <h4 className="rp-summary-title">Incidents Summary</h4>
                    <div className="rp-summary-grid">
                      <div className="rp-summary-col" style={{ padding: '6px 8px' }}>
                        <div>
                          <span className="rp-summary-lbl" style={{ fontSize: '9px' }}>Total Cases</span>
                          <div className="rp-summary-num" style={{ color: '#EF4444' }}>08</div>
                        </div>
                      </div>
                      <div className="rp-summary-col" style={{ padding: '6px 8px' }}>
                        <div>
                          <span className="rp-summary-lbl" style={{ fontSize: '9px' }}>Open</span>
                          <div className="rp-summary-num" style={{ color: '#F59E0B' }}>02</div>
                        </div>
                      </div>
                      <div className="rp-summary-col" style={{ padding: '6px 8px' }}>
                        <div>
                          <span className="rp-summary-lbl" style={{ fontSize: '9px' }}>In Review</span>
                          <div className="rp-summary-num" style={{ color: '#2563EB' }}>01</div>
                        </div>
                      </div>
                      <div className="rp-summary-col" style={{ padding: '6px 8px' }}>
                        <div>
                          <span className="rp-summary-lbl" style={{ fontSize: '9px' }}>Resolved</span>
                          <div className="rp-summary-num" style={{ color: '#10B981' }}>06</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'Vehicles' && (
                  <div className="rp-header-summary-card">
                    <div className="rp-summary-grid">
                      <div className="rp-summary-col">
                        <div className="rp-summary-ic purple">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="5.5" cy="17.5" r="2.5"/><circle cx="18.5" cy="17.5" r="2.5"/><path d="M15 6h1a2 2 0 0 1 2 2v2M3 17.5V11a3 3 0 0 1 3-3h9M12 17.5V8"/></svg>
                        </div>
                        <div>
                          <span className="rp-summary-lbl">Total Vehicles</span>
                          <div className="rp-summary-num">6</div>
                          <span style={{ fontSize: '8px', color: '#6D28D9', display: 'block', cursor: 'pointer', fontWeight: 600 }}>View all vehicles</span>
                        </div>
                      </div>
                      <div className="rp-summary-col">
                        <div className="rp-summary-ic green">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="5" r="3"/><circle cx="5" cy="19" r="3"/><circle cx="19" cy="19" r="3"/><path d="M12 8l-5 8M12 8l5 8"/></svg>
                        </div>
                        <div>
                          <span className="rp-summary-lbl">Active Vehicles</span>
                          <div className="rp-summary-num">5</div>
                          <span className="rp-summary-pct green">83.3% of total</span>
                        </div>
                      </div>
                      <div className="rp-summary-col">
                        <div className="rp-summary-ic yellow">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 0 0-3-3.87"/><path d="M9 21v-2a4 4 0 0 0-3-3.87"/><circle cx="12" cy="7" r="4"/></svg>
                        </div>
                        <div>
                          <span className="rp-summary-lbl">Inactive Vehicles</span>
                          <div className="rp-summary-num">1</div>
                          <span className="rp-summary-pct" style={{ color: '#64748B' }}>16.7% of total</span>
                        </div>
                      </div>
                      <div className="rp-summary-col">
                        <div className="rp-summary-ic blue">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                        </div>
                        <div>
                          <span className="rp-summary-lbl">Total Distance</span>
                          <div className="rp-summary-num" style={{ fontSize: '12.5px' }}>4,256 km</div>
                          <span style={{ fontSize: '8px', color: '#64748B', display: 'block', fontWeight: 600 }}>All time distance</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Default fallback right card (e.g. for placeholder tabs) */}
                {['Activity', 'Reviews'].includes(activeTab) && (
                  <div className="rp-radial-box" style={{ justifyContent: 'center', textAlign: 'center', padding: '16px' }}>
                    <div>
                      <div className="rp-radial-tit" style={{ color: '#2A195C', fontSize: '15px' }}>Evegah Portal</div>
                      <div className="rp-radial-desc" style={{ marginTop: '4px' }}>Rider profile detail database file loaded successfully</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tab Swi Bar */}
            <div className="rp-tabs">
              {['Overview', 'Documents', 'Vehicles', 'Activity', 'Earnings', 'Performance', 'Incidents', 'Reviews'].map((tab) => (
                <div key={tab} className={`rp-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => switchTab(tab)}>
                  {tab}
                </div>
              ))}
            </div>

            {/* Tab contents */}
            {activeTab === 'Overview' && (
              <div className="rp-layout-3col">
                {/* Rider Status Card */}
                <div className="rp-card">
                  <div className="rp-card-hdr">
                    <h3 className="rp-card-tit">Rider Status</h3>
                  </div>
                  <div className="rp-info-list">
                    <div className="rp-info-row">
                      <span className="rp-info-lbl">Status</span>
                      <span className="rp-info-val"><span className="badge-active" style={{ fontSize: '10px', padding: '1px 6px' }}>Active</span></span>
                    </div>
                    <div className="rp-info-row">
                      <span className="rp-info-lbl">Online Status</span>
                      <span className="rp-info-val" style={{ color: '#16A34A', fontWeight: 700 }}><span className="dot-green-pulse" />Yes</span>
                    </div>
                    <div className="rp-info-row">
                      <span className="rp-info-lbl">Availability</span>
                      <span className="rp-info-val" style={{ color: '#16A34A', fontWeight: 700 }}>Available</span>
                    </div>
                    <div className="rp-info-row">
                      <span className="rp-info-lbl">Last Seen</span>
                      <span className="rp-info-val">20 May 2024, 11:35 AM</span>
                    </div>
                    <div className="rp-info-row">
                      <span className="rp-info-lbl">Current Zone</span>
                      <span className="rp-info-val">{riderZone}</span>
                    </div>
                    <div className="rp-info-row">
                      <span className="rp-info-lbl">Duty Hours (Today)</span>
                      <span className="rp-info-val">06h 45m</span>
                    </div>
                  </div>
                  <button className="rp-btn-outline" style={{ marginTop: 'auto', width: '100%', justifyContent: 'center', borderColor: '#2A195C', color: '#2A195C' }} onClick={() => setModalType('message')}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    Message Rider
                  </button>
                </div>

                {/* Current Assignment Card */}
                <div className="rp-card">
                  <span className="badge-active" style={{ position: 'absolute', top: '16px', right: '16px', fontSize: '9px', padding: '1px 6px' }}>On Duty</span>
                  <div className="rp-card-hdr">
                    <h3 className="rp-card-tit">Current Assignment</h3>
                  </div>
                  <div className="rp-scooter-assignment">
                    <img className="rp-scooter-img" src="/evegah_scooter.png" alt="Scooter" />
                    <div className="rp-assignment-details">
                      <div>
                        <div className="rp-mid-lbl">Vehicle</div>
                        <div style={{ fontWeight: 800, color: '#1E293B' }}>{riderVehicle}</div>
                      </div>
                      <div>
                        <div className="rp-mid-lbl">Battery</div>
                        <div style={{ fontWeight: 800, color: '#1E293B' }}>{riderBattery} - <span style={{ color: '#16A34A' }}>78%</span></div>
                      </div>
                    </div>
                  </div>
                  <div className="rp-info-list" style={{ borderTop: '1px dashed #E2E8F0', paddingTop: '10px' }}>
                    <div className="rp-info-row">
                      <span className="rp-info-lbl">Started At</span>
                      <span className="rp-info-val">20 May 2024, 09:15 AM</span>
                    </div>
                    <div className="rp-info-row">
                      <span className="rp-info-lbl">Current Zone</span>
                      <span className="rp-info-val">{riderZone}</span>
                    </div>
                    <div className="rp-info-row">
                      <span className="rp-info-lbl">Deliveries Completed</span>
                      <span className="rp-info-val" style={{ fontWeight: 800 }}>14</span>
                    </div>
                    <div className="rp-info-row" style={{ alignItems: 'flex-start' }}>
                      <span className="rp-info-lbl" style={{ marginTop: '2px' }}>Next Delivery</span>
                      <span className="rp-info-val" style={{ textAlign: 'right', fontSize: '11.5px', maxWidth: '140px' }}>
                        <span style={{ color: '#6D28D9', fontWeight: 800 }}>#ORD-124578</span>
                        <br />Shivaji Stadium, Delhi
                      </span>
                    </div>
                  </div>
                </div>

                {/* Recent Activity Card */}
                <div className="rp-card">
                  <div className="rp-card-hdr">
                    <h3 className="rp-card-tit">Recent Activity</h3>
                    <span className="rp-card-link" onClick={() => switchTab('Activity')}>View All</span>
                  </div>
                  <div className="rp-timeline">
                    <div className="rp-tl-item">
                      <span className="rp-tl-dot green" />
                      <div className="rp-tl-info">
                        <span className="rp-tl-txt">Go Online</span>
                        <span className="rp-tl-time">20 May 2024, 09:00 AM</span>
                      </div>
                    </div>
                    <div className="rp-tl-item">
                      <span className="rp-tl-dot blue" />
                      <div className="rp-tl-info">
                        <span className="rp-tl-txt">Delivery Completed</span>
                        <span className="rp-tl-time">20 May 2024, 10:15 AM</span>
                      </div>
                    </div>
                    <div className="rp-tl-item">
                      <span className="rp-tl-dot blue" />
                      <div className="rp-tl-info">
                        <span className="rp-tl-txt">Battery Swapped</span>
                        <span className="rp-tl-time">20 May 2024, 11:05 AM</span>
                      </div>
                    </div>
                    <div className="rp-tl-item">
                      <span className="rp-tl-dot blue" />
                      <div className="rp-tl-info">
                        <span className="rp-tl-txt">Delivery Completed</span>
                        <span className="rp-tl-time">20 May 2024, 11:25 AM</span>
                      </div>
                    </div>
                    <div className="rp-tl-item">
                      <span className="rp-tl-dot yellow" />
                      <div className="rp-tl-info">
                        <span className="rp-tl-txt">Rating Received (5 ★)</span>
                        <span className="rp-tl-time">20 May 2024, 11:30 AM</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Earnings Overview Card */}
                <div className="rp-card">
                  <div className="rp-card-hdr">
                    <h3 className="rp-card-tit">Earnings Overview</h3>
                    <select className="rp-select" style={{ fontSize: '10.5px', padding: '3px 8px' }} value={earningsPeriod} onChange={(e: any) => setEarningsPeriod(e.target.value)}>
                      <option value="This Month">This Month</option>
                      <option value="Today">Today</option>
                      <option value="This Week">This Week</option>
                      <option value="This Quarter">This Quarter</option>
                    </select>
                  </div>
                  <div className="rp-mini-earnings">
                    <div className="rp-mini-earning-card">
                      <span className="rp-mini-earning-val">{earningsMetrics.total}</span>
                      <span className="rp-mini-earning-lbl">Total Earnings</span>
                      <span className="rp-mini-earning-sub">↑ 15.6%</span>
                    </div>
                    <div className="rp-mini-earning-card">
                      <span className="rp-mini-earning-val">{earningsMetrics.inc}</span>
                      <span className="rp-mini-earning-lbl">Incentives</span>
                    </div>
                    <div className="rp-mini-earning-card">
                      <span className="rp-mini-earning-val">{earningsMetrics.tips}</span>
                      <span className="rp-mini-earning-lbl">Cash Collected</span>
                    </div>
                  </div>
                  <div className="rp-info-list" style={{ borderTop: '1px dashed #E2E8F0', paddingTop: '10px' }}>
                    <div className="rp-info-row">
                      <span className="rp-info-lbl">Payout Received</span>
                      <span className="rp-info-val" style={{ fontWeight: 800 }}>{earningsPeriod === 'This Month' ? '₹16,300' : '₹0.00'}</span>
                    </div>
                    <div className="rp-info-row">
                      <span className="rp-info-lbl">Pending Payout</span>
                      <span className="rp-info-val" style={{ fontWeight: 800, color: '#2A195C' }}>{earningsMetrics.inc}</span>
                    </div>
                    <div className="rp-info-row">
                      <span className="rp-info-lbl">Last Payout Date</span>
                      <span className="rp-info-val">15 May 2024</span>
                    </div>
                  </div>
                </div>

                {/* Badges & Achievements Card */}
                <div className="rp-card">
                  <div className="rp-card-hdr">
                    <h3 className="rp-card-tit">Badges &amp; Achievements</h3>
                    <span className="rp-card-link" onClick={() => alert('Opening badges configuration gallery...')}>View All</span>
                  </div>
                  <div className="rp-badge-grid">
                    <div className="rp-badge-item">
                      <div className="rp-badge-ic green">🏆</div>
                      <span className="rp-badge-lbl">100 Rides</span>
                      <span className="rp-badge-date">10 Feb 2024</span>
                    </div>
                    <div className="rp-badge-item">
                      <div className="rp-badge-ic blue">⚡</div>
                      <span className="rp-badge-lbl">Speed Star</span>
                      <span className="rp-badge-date">25 Feb 2024</span>
                    </div>
                    <div className="rp-badge-item">
                      <div className="rp-badge-ic purple">⭐</div>
                      <span className="rp-badge-lbl">5 Star Rated</span>
                      <span className="rp-badge-date">05 Mar 2024</span>
                    </div>
                    <div className="rp-badge-item">
                      <div className="rp-badge-ic orange">🔥</div>
                      <span className="rp-badge-lbl">Consistent</span>
                      <span className="rp-badge-date">15 Apr 2024</span>
                    </div>
                  </div>
                </div>

                {/* Emergency Contact Card */}
                <div className="rp-card">
                  <div className="rp-card-hdr">
                    <h3 className="rp-card-tit">Emergency Contact</h3>
                    <span className="rp-card-link" onClick={() => setModalType('editContact')}>Edit</span>
                  </div>
                  <div className="rp-info-list" style={{ margin: '4px 0' }}>
                    <div className="rp-info-row">
                      <span className="rp-info-lbl">Name</span>
                      <span className="rp-info-val" style={{ fontWeight: 800 }}>{contactName}</span>
                    </div>
                    <div className="rp-info-row">
                      <span className="rp-info-lbl">Relation</span>
                      <span className="rp-info-val">{contactRelation}</span>
                    </div>
                    <div className="rp-info-row">
                      <span className="rp-info-lbl">Mobile Number</span>
                      <span className="rp-info-val" style={{ fontWeight: 800 }}>{contactPhone}</span>
                    </div>
                  </div>
                  <button className="rp-btn-outline" style={{ marginTop: 'auto', width: '100%', justifyContent: 'center', borderColor: '#2A195C', color: '#2A195C' }} onClick={() => triggerToast(`Dialing emergency contact Suresh Kumar (+91 ${contactPhone})`)}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    Call Now
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'Performance' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* 7 KPI Indicators */}
                <div className="rp-kpi-grid">
                  <div className="rp-kpi-card">
                    <div className="rp-kpi-top">
                      <span className="rp-kpi-tit">Total Rides</span>
                      <span className="rp-kpi-ic purple"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg></span>
                    </div>
                    <span className="rp-kpi-val">156</span>
                    <span className="rp-kpi-sub" style={{ color: '#16A34A' }}>↑ 12.5% vs last month</span>
                  </div>

                  <div className="rp-kpi-card">
                    <div className="rp-kpi-top">
                      <span className="rp-kpi-tit">Total Earnings</span>
                      <span className="rp-kpi-ic green"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="5" width="20" height="14" rx="2" ry="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg></span>
                    </div>
                    <span className="rp-kpi-val">₹18,560.75</span>
                    <span className="rp-kpi-sub" style={{ color: '#16A34A' }}>↑ 14.8% vs last month</span>
                  </div>

                  <div className="rp-kpi-card">
                    <div className="rp-kpi-top">
                      <span className="rp-kpi-tit">Total Distance</span>
                      <span className="rp-kpi-ic blue"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/></svg></span>
                    </div>
                    <span className="rp-kpi-val">4,256 km</span>
                    <span className="rp-kpi-sub" style={{ color: '#16A34A' }}>↑ 10.2% vs last month</span>
                  </div>

                  <div className="rp-kpi-card">
                    <div className="rp-kpi-top">
                      <span className="rp-kpi-tit">Completed Rides</span>
                      <span className="rp-kpi-ic green"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg></span>
                    </div>
                    <span className="rp-kpi-val">142</span>
                    <span className="rp-kpi-sub" style={{ color: '#16A34A' }}>91.0% Completion</span>
                  </div>

                  <div className="rp-kpi-card">
                    <div className="rp-kpi-top">
                      <span className="rp-kpi-tit">Cancelled Rides</span>
                      <span className="rp-kpi-ic red"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></span>
                    </div>
                    <span className="rp-kpi-val">14</span>
                    <span className="rp-kpi-sub" style={{ color: '#EF4444' }}>9.0% Cancellation</span>
                  </div>

                  <div className="rp-kpi-card">
                    <div className="rp-kpi-top">
                      <span className="rp-kpi-tit">Average Rating</span>
                      <span className="rp-kpi-ic orange"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></span>
                    </div>
                    <span className="rp-kpi-val">4.7</span>
                    <span className="rp-kpi-sub" style={{ color: '#16A34A' }}>↑ 0.2 vs last month</span>
                  </div>

                  <div className="rp-kpi-card">
                    <div className="rp-kpi-top">
                      <span className="rp-kpi-tit">CO2 Saved</span>
                      <span className="rp-kpi-ic green"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></span>
                    </div>
                    <span className="rp-kpi-val">125.6 kg</span>
                    <span className="rp-kpi-sub" style={{ color: '#16A34A' }}>↑ 15.3% vs last month</span>
                  </div>
                </div>

                {/* 4 SVG Trend charts */}
                <div className="rp-charts-grid">
                  <div className="rp-card">
                    <div className="rp-card-hdr" style={{ padding: 0, border: 'none' }}>
                      <span className="rp-kpi-tit">Earnings Trend</span>
                      <select className="rp-select" style={{ fontSize: '10px', padding: '2px 6px' }} disabled><option>Earnings</option></select>
                    </div>
                    <svg viewBox="0 0 100 45" style={{ width: '100%', height: '80px', marginTop: '10px' }}>
                      <defs>
                        <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#2A195C" stopOpacity="0.25"/>
                          <stop offset="100%" stopColor="#2A195C" stopOpacity="0.0"/>
                        </linearGradient>
                      </defs>
                      <path d="M0,45 L0,22 Q15,12 30,28 T60,15 T90,20 L100,10 L100,45 Z" fill="url(#purpleGrad)" />
                      <path d="M0,22 Q15,12 30,28 T60,15 T90,20 L100,10" fill="none" stroke="#2A195C" strokeWidth="1.5" strokeLinecap="round" />
                      <circle cx="100" cy="10" r="1.5" fill="#2A195C" />
                    </svg>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#94A3B8', fontWeight: 600 }}>
                      <span>01 May</span>
                      <span>11 May</span>
                      <span>21 May</span>
                    </div>
                  </div>

                  <div className="rp-card">
                    <div className="rp-card-hdr" style={{ padding: 0, border: 'none' }}>
                      <span className="rp-kpi-tit">Rides Trend</span>
                      <select className="rp-select" style={{ fontSize: '10px', padding: '2px 6px' }} disabled><option>Rides</option></select>
                    </div>
                    <svg viewBox="0 0 100 45" style={{ width: '100%', height: '80px', marginTop: '10px' }}>
                      <path d="M0,45 L0,28 Q15,22 30,32 T60,18 T90,26 L100,12 L100,45 Z" fill="url(#purpleGrad)" />
                      <path d="M0,28 Q15,22 30,32 T60,18 T90,26 L100,12" fill="none" stroke="#2A195C" strokeWidth="1.5" strokeLinecap="round" />
                      <circle cx="100" cy="12" r="1.5" fill="#2A195C" />
                    </svg>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#94A3B8', fontWeight: 600 }}>
                      <span>01 May</span>
                      <span>11 May</span>
                      <span>21 May</span>
                    </div>
                  </div>

                  <div className="rp-card">
                    <div className="rp-card-hdr" style={{ padding: 0, border: 'none' }}>
                      <span className="rp-kpi-tit">Distance Trend (km)</span>
                      <select className="rp-select" style={{ fontSize: '10px', padding: '2px 6px' }} disabled><option>Distance</option></select>
                    </div>
                    <svg viewBox="0 0 100 45" style={{ width: '100%', height: '80px', marginTop: '10px' }}>
                      <path d="M0,45 L0,30 Q15,18 30,26 T60,22 T90,14 L100,18 L100,45 Z" fill="url(#purpleGrad)" />
                      <path d="M0,30 Q15,18 30,26 T60,22 T90,14 L100,18" fill="none" stroke="#2A195C" strokeWidth="1.5" strokeLinecap="round" />
                      <circle cx="100" cy="18" r="1.5" fill="#2A195C" />
                    </svg>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#94A3B8', fontWeight: 600 }}>
                      <span>01 May</span>
                      <span>11 May</span>
                      <span>21 May</span>
                    </div>
                  </div>

                  <div className="rp-card">
                    <div className="rp-card-hdr" style={{ padding: 0, border: 'none' }}>
                      <span className="rp-kpi-tit">CO₂ Saved Trend (kg)</span>
                      <select className="rp-select" style={{ fontSize: '10px', padding: '2px 6px' }} disabled><option>CO₂ Saved</option></select>
                    </div>
                    <svg viewBox="0 0 100 45" style={{ width: '100%', height: '80px', marginTop: '10px' }}>
                      <path d="M0,45 L0,26 Q15,32 30,20 T60,28 T90,15 L100,8 L100,45 Z" fill="url(#purpleGrad)" />
                      <path d="M0,26 Q15,32 30,20 T60,28 T90,15 L100,8" fill="none" stroke="#2A195C" strokeWidth="1.5" strokeLinecap="round" />
                      <circle cx="100" cy="8" r="1.5" fill="#2A195C" />
                    </svg>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#94A3B8', fontWeight: 600 }}>
                      <span>01 May</span>
                      <span>11 May</span>
                      <span>21 May</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Row split: Metrics & breakdown table */}
                <div className="rp-layout-2col-split">
                  <div className="rp-card">
                    <div className="rp-card-hdr">
                      <h3 className="rp-card-tit">Performance Metrics</h3>
                    </div>
                    <div className="rp-info-list" style={{ margin: '6px 0' }}>
                      <div className="rp-info-row">
                        <span className="rp-info-lbl">Average Earnings Per Ride</span>
                        <span className="rp-info-val">₹119.24</span>
                      </div>
                      <div className="rp-info-row">
                        <span className="rp-info-lbl">Average Distance Per Ride</span>
                        <span className="rp-info-val">27.28 km</span>
                      </div>
                      <div className="rp-info-row">
                        <span className="rp-info-lbl">Average Ride Time</span>
                        <span className="rp-info-val">32m</span>
                      </div>
                      <div className="rp-info-row">
                        <span className="rp-info-lbl">Peak Ride Time</span>
                        <span className="rp-info-val">6 PM - 9 PM</span>
                      </div>
                      <div className="rp-info-row">
                        <span className="rp-info-lbl">Weekly Active Days</span>
                        <span className="rp-info-val">6 Days</span>
                      </div>
                      <div className="rp-info-row">
                        <span className="rp-info-lbl">Return Rider Rate</span>
                        <span className="rp-info-val">78%</span>
                      </div>
                      <div className="rp-info-row">
                        <span className="rp-info-lbl">On-time Pickup Rate</span>
                        <span className="rp-info-val">93%</span>
                      </div>
                    </div>
                  </div>

                  <div className="rp-card">
                    <div className="rp-card-hdr">
                      <h3 className="rp-card-tit">Daily Performance Breakdown</h3>
                    </div>
                    <div className="rp-table-wrap">
                      <table className="rp-table">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Rides</th>
                            <th>Earnings</th>
                            <th>Distance</th>
                            <th>CO₂ Saved</th>
                            <th>Completed</th>
                            <th>Cancelled</th>
                            <th>Rating</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td style={{ fontWeight: 700 }}>21 May 2024</td>
                            <td style={{ fontWeight: 600 }}>18</td>
                            <td style={{ fontWeight: 800, color: '#6D28D9' }}>₹2,145.50</td>
                            <td>481 km</td>
                            <td>14.2 kg</td>
                            <td style={{ color: '#16A34A', fontWeight: 700 }}>17</td>
                            <td style={{ color: '#EF4444', fontWeight: 700 }}>1</td>
                            <td style={{ color: '#D97706', fontWeight: 700 }}>4.8 ★</td>
                          </tr>
                          <tr>
                            <td style={{ fontWeight: 700 }}>20 May 2024</td>
                            <td style={{ fontWeight: 600 }}>22</td>
                            <td style={{ fontWeight: 800, color: '#6D28D9' }}>₹2,560.75</td>
                            <td>602 km</td>
                            <td>16.8 kg</td>
                            <td style={{ color: '#16A34A', fontWeight: 700 }}>20</td>
                            <td style={{ color: '#EF4444', fontWeight: 700 }}>2</td>
                            <td style={{ color: '#D97706', fontWeight: 700 }}>4.7 ★</td>
                          </tr>
                          <tr>
                            <td style={{ fontWeight: 700 }}>19 May 2024</td>
                            <td style={{ fontWeight: 600 }}>16</td>
                            <td style={{ fontWeight: 800, color: '#6D28D9' }}>₹1,785.25</td>
                            <td>436 km</td>
                            <td>12.1 kg</td>
                            <td style={{ color: '#16A34A', fontWeight: 700 }}>15</td>
                            <td style={{ color: '#EF4444', fontWeight: 700 }}>1</td>
                            <td style={{ color: '#D97706', fontWeight: 700 }}>4.6 ★</td>
                          </tr>
                          <tr>
                            <td style={{ fontWeight: 700 }}>18 May 2024</td>
                            <td style={{ fontWeight: 600 }}>20</td>
                            <td style={{ fontWeight: 800, color: '#6D28D9' }}>₹2,380.00</td>
                            <td>548 km</td>
                            <td>15.3 kg</td>
                            <td style={{ color: '#16A34A', fontWeight: 700 }}>18</td>
                            <td style={{ color: '#EF4444', fontWeight: 700 }}>2</td>
                            <td style={{ color: '#D97706', fontWeight: 700 }}>4.8 ★</td>
                          </tr>
                          <tr>
                            <td style={{ fontWeight: 700 }}>17 May 2024</td>
                            <td style={{ fontWeight: 600 }}>15</td>
                            <td style={{ fontWeight: 800, color: '#6D28D9' }}>₹1,650.25</td>
                            <td>392 km</td>
                            <td>11.2 kg</td>
                            <td style={{ color: '#16A34A', fontWeight: 700 }}>14</td>
                            <td style={{ color: '#EF4444', fontWeight: 700 }}>1</td>
                            <td style={{ color: '#D97706', fontWeight: 700 }}>4.5 ★</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    {/* Pagination footer */}
                    <div className="rp-footer-bar">
                      <span>Showing {(performancePage - 1) * 5 + 1} to {performancePage * 5} of 21 days</span>
                      <div className="rp-pagination">
                        <button className="rp-pg-btn" disabled={performancePage === 1} onClick={() => setPerformancePage(p => p - 1)}>&lt;</button>
                        <button className={`rp-pg-btn ${performancePage === 1 ? 'active' : ''}`} onClick={() => setPerformancePage(1)}>1</button>
                        <button className={`rp-pg-btn ${performancePage === 2 ? 'active' : ''}`} onClick={() => setPerformancePage(2)}>2</button>
                        <button className={`rp-pg-btn ${performancePage === 3 ? 'active' : ''}`} onClick={() => setPerformancePage(3)}>3</button>
                        <span>...</span>
                        <button className="rp-pg-btn" onClick={() => setPerformancePage(5)}>5</button>
                        <button className="rp-pg-btn" disabled={performancePage === 5} onClick={() => setPerformancePage(p => p + 1)}>&gt;</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Earnings' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Earnings Period Selector & Metric Header */}
                <div className="rp-earnings-filters">
                  <div className="rp-earnings-period-tabs">
                    {(['Today', 'This Week', 'This Month', 'This Quarter', 'Custom'] as const).map((tab) => (
                      <button key={tab} className={`rp-earnings-period-tab ${earningsPeriod === tab ? 'active' : ''}`} onClick={() => { setEarningsPeriod(tab); if (tab === 'Today') setSelectedDateRange('20 May 2024'); else setSelectedDateRange('01 May 2024 - 21 May 2024'); }}>
                        {tab}
                      </button>
                    ))}
                  </div>

                  <div className="rp-earnings-metrics-row">
                    <div className="rp-earnings-metric">
                      <span className="rp-earnings-metric-lbl">Total Earnings</span>
                      <span className="rp-earnings-metric-val" style={{ color: '#6D28D9' }}>{earningsMetrics.total}</span>
                      <span className="rp-earnings-metric-sub" style={{ color: '#16A34A' }}>↑ 12.5% vs last period</span>
                    </div>
                    <div className="rp-earnings-metric" style={{ borderLeft: '1.5px solid #F1F5F9', paddingLeft: '16px' }}>
                      <span className="rp-earnings-metric-lbl">Ride Earnings</span>
                      <span className="rp-earnings-metric-val">{earningsMetrics.ride}</span>
                      <span className="rp-earnings-metric-sub" style={{ color: '#16A34A' }}>↑ 10.8%</span>
                    </div>
                    <div className="rp-earnings-metric" style={{ borderLeft: '1.5px solid #F1F5F9', paddingLeft: '16px' }}>
                      <span className="rp-earnings-metric-lbl">Incentives</span>
                      <span className="rp-earnings-metric-val">{earningsMetrics.inc}</span>
                      <span className="rp-earnings-metric-sub" style={{ color: '#16A34A' }}>↑ 8.2%</span>
                    </div>
                    <div className="rp-earnings-metric" style={{ borderLeft: '1.5px solid #F1F5F9', paddingLeft: '16px' }}>
                      <span className="rp-earnings-metric-lbl">Tips</span>
                      <span className="rp-earnings-metric-val">{earningsMetrics.tips}</span>
                      <span className="rp-earnings-metric-sub" style={{ color: '#16A34A' }}>↑ 15.3%</span>
                    </div>
                    <div className="rp-earnings-metric" style={{ borderLeft: '1.5px solid #F1F5F9', paddingLeft: '16px' }}>
                      <span className="rp-earnings-metric-lbl">Deductions</span>
                      <span className="rp-earnings-metric-val" style={{ color: '#EF4444' }}>{earningsMetrics.ded}</span>
                      <span className="rp-earnings-metric-sub" style={{ color: '#EF4444' }}>↑ 3.2%</span>
                    </div>
                    <div className="rp-earnings-metric" style={{ borderLeft: '1.5px solid #F1F5F9', paddingLeft: '16px' }}>
                      <span className="rp-earnings-metric-lbl">Net Earnings</span>
                      <span className="rp-earnings-metric-val" style={{ color: '#10B981' }}>{earningsMetrics.net}</span>
                      <span className="rp-earnings-metric-sub" style={{ color: '#16A34A' }}>↑ 11.7%</span>
                    </div>
                  </div>
                </div>

                {/* Earnings Large Trend SVG chart */}
                <div className="rp-card">
                  <div className="rp-card-hdr">
                    <h3 className="rp-card-tit">Earnings Trend ({earningsPeriod})</h3>
                    <div style={{ display: 'flex', gap: '8px', fontSize: '11.5px', color: '#64748B', fontWeight: 600 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#6D28D9' }} />Daily Earnings (₹)</span>
                    </div>
                  </div>
                  <svg viewBox="0 0 600 130" style={{ width: '100%', height: '180px', marginTop: '10px' }}>
                    <defs>
                      <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2A195C" stopOpacity="0.28"/>
                        <stop offset="100%" stopColor="#2A195C" stopOpacity="0.0"/>
                      </linearGradient>
                    </defs>
                    {/* Grid lines */}
                    <line x1="0" y1="20" x2="600" y2="20" stroke="#F1F5F9" strokeWidth="1" />
                    <line x1="0" y1="50" x2="600" y2="50" stroke="#F1F5F9" strokeWidth="1" />
                    <line x1="0" y1="80" x2="600" y2="80" stroke="#F1F5F9" strokeWidth="1" />
                    <line x1="0" y1="110" x2="600" y2="110" stroke="#F1F5F9" strokeWidth="1" />

                    <path d="M0,130 L0,90 Q75,70 150,95 T300,50 T450,75 L600,60 L600,130 Z" fill="url(#trendGrad)" />
                    <path d="M0,90 Q75,70 150,95 T300,50 T450,75 L600,60" fill="none" stroke="#2A195C" strokeWidth="2.5" strokeLinecap="round" />
                    <circle cx="600" cy="60" r="3" fill="#2A195C" />
                  </svg>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94A3B8', fontWeight: 600, padding: '0 4px' }}>
                    <span>01 May</span>
                    <span>05 May</span>
                    <span>09 May</span>
                    <span>13 May</span>
                    <span>17 May</span>
                    <span>21 May</span>
                  </div>
                </div>

                {/* Earnings Transactions Table */}
                <div className="rp-card">
                  <div className="rp-card-hdr" style={{ border: 'none', padding: 0 }}>
                    <div>
                      <h3 className="rp-card-tit">Earnings Transactions</h3>
                      <p className="rp-tab-subtitle" style={{ margin: '2px 0 0 0' }}>All earnings and payout transactions</p>
                    </div>
                  </div>

                  <div className="rp-table-wrap" style={{ border: 'none', borderRadius: 0, marginTop: '8px' }}>
                    {/* Inner filter tools */}
                    <div className="rp-list-filter-bar" style={{ borderRadius: '10px 10px 0 0' }}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <div className="rp-search-wrapper">
                          <span className="rp-search-ic">🔍</span>
                          <input type="text" className="rp-search-inp" placeholder="Search transactions..." disabled />
                        </div>
                        <select className="rp-select" disabled>
                          <option>All Transactions</option>
                        </select>
                        <select className="rp-select" disabled>
                          <option>All Statuses</option>
                        </select>
                      </div>
                      <button className="rp-btn-outline" style={{ padding: '5px 12px', fontSize: '11.5px' }} onClick={() => alert('Filter drawer opened')}>
                        Filter
                      </button>
                    </div>

                    <table className="rp-table">
                      <thead>
                        <tr>
                          <th>Date &amp; Time</th>
                          <th>Type</th>
                          <th>Description</th>
                          <th>Ride ID / Reference</th>
                          <th>Amount</th>
                          <th>Status</th>
                          <th>Balance After</th>
                          <th style={{ textAlign: 'center' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style={{ fontWeight: 700 }}>20 May 2024, 09:15 AM</td>
                          <td><span className="pill-badge pill-purple">Ride Earnings</span></td>
                          <td>Ride fare - 9.2 km</td>
                          <td style={{ fontFamily: 'monospace' }}>RD-1256</td>
                          <td style={{ fontWeight: 800, color: '#16A34A' }}>₹120.00</td>
                          <td><span className="pill-badge pill-green">Completed</span></td>
                          <td style={{ fontWeight: 700 }}>₹2,360.75</td>
                          <td style={{ textAlign: 'center' }}><button className="rp-radial-btn" style={{ padding: '2px 6px', margin: 0 }} onClick={() => alert('Transaction Detail:\nID: RD-1256\nAmount: ₹120.00\nType: Ride Earnings\nStatus: Completed')}>View</button></td>
                        </tr>
                        <tr>
                          <td style={{ fontWeight: 700 }}>20 May 2024, 09:15 AM</td>
                          <td><span className="pill-badge pill-orange">Incentive</span></td>
                          <td>Peak hour incentive</td>
                          <td style={{ fontFamily: 'monospace' }}>INC-4587</td>
                          <td style={{ fontWeight: 800, color: '#16A34A' }}>₹40.00</td>
                          <td><span className="pill-badge pill-green">Completed</span></td>
                          <td style={{ fontWeight: 700 }}>₹2,240.75</td>
                          <td style={{ textAlign: 'center' }}><button className="rp-radial-btn" style={{ padding: '2px 6px', margin: 0 }} onClick={() => alert('Transaction Detail:\nID: INC-4587\nAmount: ₹40.00\nType: Incentive\nStatus: Completed')}>View</button></td>
                        </tr>
                        <tr>
                          <td style={{ fontWeight: 700 }}>19 May 2024, 08:45 PM</td>
                          <td><span className="pill-badge pill-blue">Tips</span></td>
                          <td>Customer tip</td>
                          <td style={{ fontFamily: 'monospace' }}>TIP-9876</td>
                          <td style={{ fontWeight: 800, color: '#16A34A' }}>₹30.00</td>
                          <td><span className="pill-badge pill-green">Completed</span></td>
                          <td style={{ fontWeight: 700 }}>₹2,200.75</td>
                          <td style={{ textAlign: 'center' }}><button className="rp-radial-btn" style={{ padding: '2px 6px', margin: 0 }} onClick={() => alert('Transaction Detail:\nID: TIP-9876\nAmount: ₹30.00\nType: Customer Tips\nStatus: Completed')}>View</button></td>
                        </tr>
                        <tr>
                          <td style={{ fontWeight: 700 }}>18 May 2024, 07:30 PM</td>
                          <td><span className="pill-badge pill-green">Payout</span></td>
                          <td>Payout to bank **** 4567</td>
                          <td style={{ fontFamily: 'monospace' }}>PAYOUT-2345</td>
                          <td style={{ fontWeight: 800, color: '#EF4444' }}>- ₹2,000.00</td>
                          <td><span className="pill-badge pill-blue">Paid</span></td>
                          <td style={{ fontWeight: 700 }}>₹2,170.75</td>
                          <td style={{ textAlign: 'center' }}><button className="rp-radial-btn" style={{ padding: '2px 6px', margin: 0 }} onClick={() => alert('Transaction Detail:\nID: PAYOUT-2345\nAmount: -₹2,000.00\nType: Bank Payout\nStatus: Paid')}>View</button></td>
                        </tr>
                        <tr>
                          <td style={{ fontWeight: 700 }}>18 May 2024, 07:15 PM</td>
                          <td><span className="pill-badge pill-red">Deduction</span></td>
                          <td>Platform fee (5%)</td>
                          <td style={{ fontFamily: 'monospace' }}>DEDUCT-1122</td>
                          <td style={{ fontWeight: 800, color: '#EF4444' }}>- ₹25.00</td>
                          <td><span className="pill-badge pill-green">Completed</span></td>
                          <td style={{ fontWeight: 700 }}>₹4,170.75</td>
                          <td style={{ textAlign: 'center' }}><button className="rp-radial-btn" style={{ padding: '2px 6px', margin: 0 }} onClick={() => alert('Transaction Detail:\nID: DEDUCT-1122\nAmount: -₹25.00\nType: Platform Deduction\nStatus: Completed')}>View</button></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination footer */}
                  <div className="rp-footer-bar">
                    <span>Showing {(earningsPage - 1) * 5 + 1} to {earningsPage * 5} of 28 transactions</span>
                    <div className="rp-pagination">
                      <button className="rp-pg-btn" disabled={earningsPage === 1} onClick={() => setEarningsPage(p => p - 1)}>&lt;</button>
                      <button className={`rp-pg-btn ${earningsPage === 1 ? 'active' : ''}`} onClick={() => setEarningsPage(1)}>1</button>
                      <button className={`rp-pg-btn ${earningsPage === 2 ? 'active' : ''}`} onClick={() => setEarningsPage(2)}>2</button>
                      <button className={`rp-pg-btn ${earningsPage === 3 ? 'active' : ''}`} onClick={() => setEarningsPage(3)}>3</button>
                      <span>...</span>
                      <button className="rp-pg-btn" onClick={() => setEarningsPage(6)}>6</button>
                      <button className="rp-pg-btn" disabled={earningsPage === 6} onClick={() => setEarningsPage(p => p + 1)}>&gt;</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Documents' && (
              <div className="rp-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#0F172A' }}>Rider Verification & Folder Documents</h3>
                    <p style={{ margin: '4px 0 0', fontSize: '12.5px', color: '#64748B' }}>Folder-wise KYC identity proofs, vehicle pre/post ride condition photos, and licenses.</p>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '8px', background: kycStatus === 'Verified' ? '#DCFCE7' : '#FEF3C7', color: kycStatus === 'Verified' ? '#15803D' : '#D97706', fontWeight: 700, fontSize: '12px' }}>
                      {kycStatus === 'Verified' ? '✓ KYC Status: Verified' : '⌛ KYC Status: Under Review'}
                    </div>
                    {kycStatus !== 'Verified' && (
                      <button className="rp-btn-primary" style={{ background: '#10B981', borderColor: '#10B981' }} onClick={handleApproveKyc}>
                        ✓ Approve & Verify KYC
                      </button>
                    )}
                    <button className="rp-btn-outline" onClick={fetchFolderDocs}>
                      ↺ Refresh
                    </button>
                    <button className="rp-btn-primary" onClick={() => setModalType('uploadDoc')}>
                      + Upload to Folder
                    </button>
                  </div>
                </div>

                {loadingDocs ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>Loading folder documents...</div>
                ) : folderData.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>No documents uploaded yet.</div>
                ) : (
                  <div className="folder-container" style={{ padding: 0 }}>
                    {folderData.map((folder: any, fIdx: number) => (
                      <div key={fIdx} className="folder-card" style={{ marginBottom: '16px' }}>
                        <div className="folder-hdr">
                          <div className="folder-hdr-left">
                            <span style={{ fontSize: '18px' }}>📁</span>
                            <span>{folder.folder_name}</span>
                            <span className="folder-badge">{folder.documents?.length || 0} Files</span>
                          </div>
                          <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>Active Folder</span>
                        </div>

                        <div className="folder-grid">
                          {folder.documents?.map((doc: any, dIdx: number) => (
                            <div key={dIdx} className="doc-card">
                              <div className="doc-card-thumb">
                                {doc.file_path && doc.file_path.startsWith('http') ? (
                                  <img src={doc.file_path} alt={doc.doc_name} />
                                ) : (
                                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                    <span style={{ fontSize: '32px' }}>
                                      {doc.doc_name.toLowerCase().includes('selfie') ? '🤳' : doc.doc_name.toLowerCase().includes('license') ? '🪪' : doc.doc_name.toLowerCase().includes('vehicle') ? '🛵' : '📄'}
                                    </span>
                                    <span style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>Verified Asset</span>
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="doc-card-tit">{doc.doc_name}</div>
                                <div className="doc-card-sub">Uploaded on: {doc.date || 'Recent'}</div>
                                {doc.ocr_aadhaar_no && (
                                  <div style={{ fontSize: '10.5px', color: '#4F46E5', fontWeight: 700, marginTop: '2px' }}>
                                    Aadhaar: {doc.ocr_aadhaar_no}
                                  </div>
                                )}
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                                <span className={`status-tag ${doc.status === 'Verified' ? 'verified' : 'pending'}`}>
                                  {doc.status === 'Verified' ? '✓' : '⌛'} {doc.status || 'Verified'}
                                </span>
                                <button 
                                  className="rp-pg-btn" 
                                  style={{ width: 'auto', padding: '0 8px', fontSize: '11px', height: '24px' }}
                                  onClick={() => alert(`Document: ${doc.doc_name}\nFolder: ${folder.folder_name}\nStatus: ${doc.status || 'Verified'}\nDate: ${doc.date || '2026-08-19'}`)}
                                >
                                  👁 View
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'Incidents' && (
              <div className="rp-card">
                <div className="rp-list-filter-bar">
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <select className="rp-select" value={incidentStatusFilter} onChange={(e) => { setIncidentStatusFilter(e.target.value); setIncidentsPage(1); }}>
                      <option value="">All Statuses</option>
                      <option value="Open">Open</option>
                      <option value="In Review">In Review</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                    <select className="rp-select" value={incidentTypeFilter} onChange={(e) => { setIncidentTypeFilter(e.target.value); setIncidentsPage(1); }}>
                      <option value="">All Types</option>
                      <option value="Traffic Violation">Traffic Violation</option>
                      <option value="Unsafe Driving">Unsafe Driving</option>
                      <option value="Battery Misuse">Battery Misuse</option>
                      <option value="Zone Violation">Zone Violation</option>
                      <option value="Customer Complaint">Customer Complaint</option>
                      <option value="Helmet Violation">Helmet Violation</option>
                      <option value="Document Issue">Document Issue</option>
                      <option value="Punctuality Issue">Punctuality Issue</option>
                    </select>
                  </div>
                  <button className="rp-btn-outline" onClick={() => { setIncidentStatusFilter(''); setIncidentTypeFilter(''); setIncidentsPage(1); }}>
                    ↺ Reset Filters
                  </button>
                </div>

                <div className="rp-table-wrap" style={{ border: 'none', borderRadius: 0, marginTop: 0 }}>
                  <table className="rp-table">
                    <thead>
                      <tr>
                        <th>Incident ID</th>
                        <th>Type</th>
                        <th>Severity</th>
                        <th>Description</th>
                        <th>Reported On</th>
                        <th>Status</th>
                        <th>Reported By</th>
                        <th style={{ textAlign: 'center' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedIncidents.map((inc, idx) => (
                        <tr key={idx}>
                          <td style={{ fontWeight: 700, fontFamily: 'monospace' }}>{inc.id}</td>
                          <td><span className="pill-badge pill-purple">{inc.type}</span></td>
                          <td>
                            <span className={`sev-badge ${inc.severity === 'High' ? 'sev-high' : inc.severity === 'Medium' ? 'sev-medium' : 'sev-low'}`}>
                              {inc.severity}
                            </span>
                          </td>
                          <td style={{ fontWeight: 600, color: '#1E293B' }}>{inc.description}</td>
                          <td>{inc.reportedOn}</td>
                          <td>
                            <span className={`pill-badge ${inc.status === 'Resolved' ? 'pill-green' : inc.status === 'In Review' ? 'pill-blue' : 'pill-orange'}`}>
                              {inc.status}
                            </span>
                          </td>
                          <td style={{ fontWeight: 700 }}>{inc.reportedBy}</td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                              <button className="rp-pg-btn" style={{ width: '24px', height: '24px', padding: 0 }} title="View Details" onClick={() => alert(`Incident Details:\nID: ${inc.id}\nType: ${inc.type}\nSeverity: ${inc.severity}\nDescription: ${inc.description}`)}>👁</button>
                              <button className="rp-pg-btn" style={{ width: '24px', height: '24px', padding: 0 }} title="Message Admin / Team" onClick={() => alert('Opening internal audit chat panel')}>💬</button>
                              <button className="rp-pg-btn" style={{ width: '24px', height: '24px', padding: 0 }} title="Resolve Incident" onClick={() => {
                                if (inc.status === 'Resolved') {
                                  alert('Incident is already resolved.');
                                  return;
                                }
                                const updated = incidents.map(i => i.id === inc.id ? { ...i, status: 'Resolved' as const } : i);
                                setIncidents(updated);
                                triggerToast(`${inc.id} status marked Resolved.`);
                              }}>✓</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="rp-footer-bar">
                  <span>Showing {(incidentsPage - 1) * 5 + 1} to {Math.min(incidentsPage * 5, filteredIncidents.length)} of {filteredIncidents.length} cases</span>
                  <div className="rp-pagination">
                    <button className="rp-pg-btn" disabled={incidentsPage === 1} onClick={() => setIncidentsPage(p => p - 1)}>&lt;</button>
                    {Array.from({ length: Math.ceil(filteredIncidents.length / 5) }).map((_, i) => (
                      <button key={i} className={`rp-pg-btn ${incidentsPage === (i + 1) ? 'active' : ''}`} onClick={() => setIncidentsPage(i + 1)}>{i + 1}</button>
                    ))}
                    <button className="rp-pg-btn" disabled={incidentsPage === Math.ceil(filteredIncidents.length / 5)} onClick={() => setIncidentsPage(p => p + 1)}>&gt;</button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Vehicles' && (
              <div className="rp-card">
                <div className="rp-list-filter-bar">
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <div className="rp-search-wrapper">
                      <span className="rp-search-ic">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                      </span>
                      <input
                        type="text"
                        className="rp-search-inp"
                        placeholder="Search plate, battery, model..."
                        value={vehicleSearchQuery}
                        onChange={(e) => { setVehicleSearchQuery(e.target.value); setVehiclesPage(1); }}
                      />
                    </div>
                    <select className="rp-select" value={vehicleStatusFilter} onChange={(e) => { setVehicleStatusFilter(e.target.value); setVehiclesPage(1); }}>
                      <option value="">All Statuses</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                    <select className="rp-select" value={vehicleTypeFilter} onChange={(e) => { setVehicleTypeFilter(e.target.value); setVehiclesPage(1); }}>
                      <option value="">All Types</option>
                      <option value="Electric Scooter">Electric Scooter</option>
                      <option value="Electric 3 Wheeler">Electric 3 Wheeler</option>
                    </select>
                  </div>
                  <button className="rp-btn-outline" onClick={() => { setVehicleSearchQuery(''); setVehicleStatusFilter(''); setVehicleTypeFilter(''); setVehiclesPage(1); }}>
                    ↺ Reset Filters
                  </button>
                </div>

                <div className="rp-table-wrap" style={{ border: 'none', borderRadius: 0, marginTop: 0 }}>
                  <table className="rp-table">
                    <thead>
                      <tr>
                        <th>Vehicle Name & Type</th>
                        <th>Plate Number</th>
                        <th>Battery ID</th>
                        <th>Status</th>
                        <th>Assigned On</th>
                        <th>Last Ride</th>
                        <th>Distance</th>
                        <th style={{ textAlign: 'center' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedVehicles.length === 0 ? (
                        <tr>
                          <td colSpan={8} style={{ textAlign: 'center', padding: '24px', color: '#64748B' }}>
                            No vehicles found matching the filters.
                          </td>
                        </tr>
                      ) : (
                        paginatedVehicles.map((v, idx) => (
                          <tr key={idx}>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '20px' }}>{v.img}</span>
                                <div>
                                  <div style={{ fontWeight: 700, color: '#0F172A' }}>{v.name}</div>
                                  <div style={{ fontSize: '10.5px', color: '#64748B' }}>{v.type}</div>
                                </div>
                              </div>
                            </td>
                            <td style={{ fontWeight: 700, fontFamily: 'monospace' }}>{v.plate}</td>
                            <td style={{ fontFamily: 'monospace' }}>{v.batteryId}</td>
                            <td>
                              <span className={`pill-badge ${v.status === 'Active' ? 'pill-green' : 'pill-orange'}`}>
                                {v.status}
                              </span>
                            </td>
                            <td>{v.assignedOn}</td>
                            <td>{v.lastRide}</td>
                            <td style={{ fontWeight: 600 }}>{v.lastRideDist || '-'}</td>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                <button className="rp-pg-btn" style={{ width: '24px', height: '24px', padding: 0 }} title="View Details" onClick={() => alert(`Vehicle Details:\nName: ${v.name}\nType: ${v.type}\nPlate: ${v.plate}\nBattery ID: ${v.batteryId}\nStatus: ${v.status}\nAssigned On: ${v.assignedOn}\nLast Ride: ${v.lastRide}\nLast Ride Distance: ${v.lastRideDist}`)}>👁</button>
                                <button className="rp-pg-btn" style={{ width: '24px', height: '24px', padding: 0 }} title="Toggle Status" onClick={() => {
                                  const updatedStatus = (v.status === 'Active' ? 'Inactive' : 'Active') as 'Active' | 'Inactive';
                                  const updated = vehicles.map(x => x.plate === v.plate ? { ...x, status: updatedStatus } : x);
                                  setVehicles(updated);
                                  triggerToast(`${v.plate} status changed to ${updatedStatus}.`);
                                }}>🔄</button>
                                <button className="rp-pg-btn" style={{ width: '24px', height: '24px', padding: 0 }} title="Unassign Vehicle" onClick={() => {
                                  if (confirm(`Are you sure you want to unassign vehicle ${v.name} (${v.plate})?`)) {
                                    const updated = vehicles.filter(x => x.plate !== v.plate);
                                    setVehicles(updated);
                                    triggerToast(`Vehicle ${v.plate} unassigned successfully.`);
                                  }
                                }}>✕</button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="rp-footer-bar">
                  <span>Showing {(vehiclesPage - 1) * 5 + 1} to {Math.min(vehiclesPage * 5, filteredVehicles.length)} of {filteredVehicles.length} vehicles</span>
                  <div className="rp-pagination">
                    <button className="rp-pg-btn" disabled={vehiclesPage === 1} onClick={() => setVehiclesPage(p => p - 1)}>&lt;</button>
                    {Array.from({ length: Math.ceil(filteredVehicles.length / 5) }).map((_, i) => (
                      <button key={i} className={`rp-pg-btn ${vehiclesPage === (i + 1) ? 'active' : ''}`} onClick={() => setVehiclesPage(i + 1)}>{i + 1}</button>
                    ))}
                    <button className="rp-pg-btn" disabled={vehiclesPage === Math.ceil(filteredVehicles.length / 5)} onClick={() => setVehiclesPage(p => p + 1)}>&gt;</button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Activity' && (
              <div className="rp-card" style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>
                <div style={{ fontSize: '42px', marginBottom: '12px' }}>📊</div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: '0 0 6px 0' }}>Activity Logs</h3>
                <p style={{ fontSize: '13px', margin: 0 }}>Complete system logs of rider operations, checkins, checkouts, swaps and status updates.</p>
                <div style={{ textAlign: 'left', marginTop: '20px', borderTop: '1px solid #E2E8F0', paddingTop: '16px' }}>
                  <div className="rp-timeline">
                    <div className="rp-tl-item">
                      <span className="rp-tl-dot green" />
                      <div className="rp-tl-info">
                        <span className="rp-tl-txt">Rider Checked Out Scooter EV-12KA-1234</span>
                        <span className="rp-tl-time">15 Jan 2024, 10:00 AM | CP Zone Hub 1</span>
                      </div>
                    </div>
                    <div className="rp-tl-item">
                      <span className="rp-tl-dot blue" />
                      <div className="rp-tl-info">
                        <span className="rp-tl-txt">License and Aadhaar Verified</span>
                        <span className="rp-tl-time">14 Jan 2024, 04:30 PM | Verified by Admin (Akash Verma)</span>
                      </div>
                    </div>
                    <div className="rp-tl-item">
                      <span className="rp-tl-dot green" />
                      <div className="rp-tl-info">
                        <span className="rp-tl-txt">Profile Registered &amp; Approved</span>
                        <span className="rp-tl-time">14 Jan 2024, 02:15 PM</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Reviews' && (
              <div className="rp-card" style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>
                <div style={{ fontSize: '42px', marginBottom: '12px' }}>⭐</div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: '0 0 6px 0' }}>Customer Reviews</h3>
                <p style={{ fontSize: '13px', margin: 0 }}>Feedback ratings received by Rahul Kumar from delivery customers.</p>
                <div className="rp-info-list" style={{ marginTop: '20px', textAlign: 'left' }}>
                  <div style={{ padding: '12px', border: '1px solid #E2E8F0', borderRadius: '8px', background: '#FAFBFD' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 800, color: '#0F172A' }}>★ 5.0 Rating</span>
                      <span style={{ fontSize: '11px', color: '#94A3B8' }}>20 May 2024</span>
                    </div>
                    <p style={{ fontSize: '12px', margin: 0, color: '#475569' }}>"Rider was polite, delivered order quickly and safely!"</p>
                  </div>
                  <div style={{ padding: '12px', border: '1px solid #E2E8F0', borderRadius: '8px', background: '#FAFBFD' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 800, color: '#0F172A' }}>★ 4.5 Rating</span>
                      <span style={{ fontSize: '11px', color: '#94A3B8' }}>19 May 2024</span>
                    </div>
                    <p style={{ fontSize: '12px', margin: 0, color: '#475569' }}>"On-time delivery, good service."</p>
                  </div>
                </div>
              </div>
            )}

            {/* Copyright & version footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', borderTop: '1px solid #E2E8F0', fontSize: '11px', color: '#94A3B8', marginTop: '10px' }}>
              <span>Rider ID: RID-2024-000578 | Created on: 15 Jan 2024</span>
              <span>Evegah SaaS Platform v2.4.0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dialog Modals */}
      {modalType === 'editContact' && (
        <div className="rp-modal-overlay">
          <div className="rp-modal-box">
            <div className="rp-modal-hdr">
              <h3 className="rp-modal-tit">Edit Emergency Contact</h3>
              <button className="rp-modal-close" onClick={() => setModalType(null)}>×</button>
            </div>
            <div className="rp-modal-body">
              <div className="rp-form-group">
                <label className="rp-form-lbl">Full Name</label>
                <input type="text" className="rp-form-inp" value={editNameInput} onChange={(e) => setEditNameInput(e.target.value)} />
              </div>
              <div className="rp-form-group">
                <label className="rp-form-lbl">Relation</label>
                <input type="text" className="rp-form-inp" value={editRelationInput} onChange={(e) => setEditRelationInput(e.target.value)} />
              </div>
              <div className="rp-form-group">
                <label className="rp-form-lbl">Mobile Number</label>
                <input type="text" className="rp-form-inp" value={editPhoneInput} onChange={(e) => setEditPhoneInput(e.target.value)} />
              </div>
            </div>
            <div className="rp-modal-ft">
              <button className="rp-btn-outline" onClick={() => setModalType(null)}>Cancel</button>
              <button className="rp-btn-primary" onClick={handleSaveContact}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {modalType === 'uploadDoc' && (
        <div className="rp-modal-overlay">
          <div className="rp-modal-box">
            <div className="rp-modal-hdr">
              <h3 className="rp-modal-tit">Upload Document</h3>
              <button className="rp-modal-close" onClick={() => setModalType(null)}>×</button>
            </div>
            <div className="rp-modal-body">
              <div className="rp-form-group">
                <label className="rp-form-lbl">Document Name</label>
                <input type="text" className="rp-form-inp" placeholder="e.g. Aadhaar Card, Driving License" value={docNameInput} onChange={(e) => setDocNameInput(e.target.value)} />
              </div>
              <div className="rp-form-group">
                <label className="rp-form-lbl">Category</label>
                <select className="rp-select" style={{ width: '100%' }} value={docCatInput} onChange={(e) => setDocCatInput(e.target.value)}>
                  <option value="Identity Proof">Identity Proof</option>
                  <option value="License">License</option>
                  <option value="Insurance">Insurance</option>
                  <option value="Vehicle Document">Vehicle Document</option>
                  <option value="Bank Document">Bank Document</option>
                  <option value="Certificate">Certificate</option>
                  <option value="Verification">Verification</option>
                </select>
              </div>
              <div className="rp-form-group">
                <label className="rp-form-lbl">Document / Certificate Number</label>
                <input type="text" className="rp-form-inp" placeholder="e.g. DL-08-2020..." value={docNumInput} onChange={(e) => setDocNumInput(e.target.value)} />
              </div>
              <div className="rp-form-group">
                <label className="rp-form-lbl">Select File</label>
                <input type="file" className="rp-form-inp" style={{ border: 'none', padding: '4px 0' }} onChange={() => triggerToast('File attachment pre-processed')} />
              </div>
            </div>
            <div className="rp-modal-ft">
              <button className="rp-btn-outline" onClick={() => setModalType(null)}>Cancel</button>
              <button className="rp-btn-primary" onClick={handleUploadDoc}>Upload</button>
            </div>
          </div>
        </div>
      )}

      {modalType === 'message' && (
        <div className="rp-modal-overlay">
          <div className="rp-modal-box">
            <div className="rp-modal-hdr">
              <h3 className="rp-modal-tit">Send Message to Rider</h3>
              <button className="rp-modal-close" onClick={() => setModalType(null)}>×</button>
            </div>
            <div className="rp-modal-body">
              <div className="rp-form-group">
                <label className="rp-form-lbl">Recipients</label>
                <input type="text" className="rp-form-inp" value="Rahul Kumar (RID-2024-000578)" disabled />
              </div>
              <div className="rp-form-group">
                <label className="rp-form-lbl">Message Body</label>
                <textarea className="rp-form-inp" style={{ minHeight: '100px', resize: 'vertical', fontFamily: 'inherit' }} placeholder="Type your message here..." value={messageInput} onChange={(e) => setMessageInput(e.target.value)} />
              </div>
            </div>
            <div className="rp-modal-ft">
              <button className="rp-btn-outline" onClick={() => setModalType(null)}>Cancel</button>
              <button className="rp-btn-primary" onClick={handleSendMessage}>Send Message</button>
            </div>
          </div>
        </div>
      )}

      {modalType === 'addVehicle' && (
        <div className="rp-modal-overlay">
          <div className="rp-modal-box">
            <div className="rp-modal-hdr">
              <h3 className="rp-modal-tit">Assign New Vehicle</h3>
              <button className="rp-modal-close" onClick={() => setModalType(null)}>×</button>
            </div>
            <div className="rp-modal-body">
              <div className="rp-form-group">
                <label className="rp-form-lbl">Vehicle Name / Model</label>
                <input type="text" className="rp-form-inp" placeholder="e.g. Ather 450X, Ola S1 Pro" value={newVehicleName} onChange={(e) => setNewVehicleName(e.target.value)} />
              </div>
              <div className="rp-form-group">
                <label className="rp-form-lbl">Vehicle Type</label>
                <select className="rp-select" style={{ width: '100%' }} value={newVehicleType} onChange={(e) => setNewVehicleType(e.target.value)}>
                  <option value="Electric Scooter">Electric Scooter</option>
                  <option value="Electric 3 Wheeler">Electric 3 Wheeler</option>
                </select>
              </div>
              <div className="rp-form-group">
                <label className="rp-form-lbl">Plate Number</label>
                <input type="text" className="rp-form-inp" placeholder="e.g. DL-01-AB-1234" value={newVehiclePlate} onChange={(e) => setNewVehiclePlate(e.target.value)} />
              </div>
              <div className="rp-form-group">
                <label className="rp-form-lbl">Battery ID</label>
                <input type="text" className="rp-form-inp" placeholder="e.g. BAT-2024-99887" value={newVehicleBattery} onChange={(e) => setNewVehicleBattery(e.target.value)} />
              </div>
            </div>
            <div className="rp-modal-ft">
              <button className="rp-btn-outline" onClick={() => setModalType(null)}>Cancel</button>
              <button className="rp-btn-primary" onClick={handleAddVehicle}>Assign Vehicle</button>
            </div>
          </div>
        </div>
      )}

      {/* Custom feedback toast alert */}
      {toast.show && (
        <div className="rp-toast rp-toast-green">
          <span>🔔</span>
          <span>{toast.msg}</span>
        </div>
      )}
    </>
  );
}

export default function RiderProfilePage() {
  return (
    <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>Loading Rider Profile details...</div>}>
      <RiderProfileContent />
    </Suspense>
  );
}
