"use client";
import { useState, useMemo, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.folder-container { display: flex; flex-direction: column; gap: 16px; padding: 18px; }
.folder-card { background: #fff; border: 1.5px solid #E2E8F0; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.02); }
.folder-hdr { display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; background: #FAFBFD; border-bottom: 1px solid #F1F5F9; cursor: pointer; }
.folder-hdr-left { display: flex; align-items: center; gap: 10px; font-weight: 700; font-size: 13.5px; color: #0F172A; }
.folder-badge { font-size: 11px; font-weight: 700; background: #EEF2FF; color: #4F46E5; padding: 2px 8px; border-radius: 20px; }
.folder-date-badge { font-size: 11px; font-weight: 600; color: #475569; background: #F1F5F9; padding: 3px 8px; border-radius: 6px; display: inline-flex; align-items: center; gap: 4px; border: 1px solid #E2E8F0; }
.folder-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 14px; padding: 16px; background: #fff; }
.doc-card { border: 1.5px solid #F1F5F9; border-radius: 10px; padding: 12px; display: flex; flex-direction: column; gap: 8px; background: #FAFAFA; transition: all .15s; }
.doc-card:hover { border-color: #6D28D9; background: #fff; box-shadow: 0 4px 12px rgba(109,40,217,0.06); }
.doc-card-thumb { height: 110px; background: #EEF2FF; border-radius: 8px; display: flex; align-items: center; justify-content: center; overflow: hidden; position: relative; }
.doc-card-thumb img { width: 100%; height: 100%; object-fit: cover; }
.doc-card-tit { font-size: 12.5px; font-weight: 700; color: #1E293B; }
.doc-card-sub { font-size: 11px; color: #64748B; }

.booking-detail-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
.booking-detail-item { background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 10px 12px; }
.booking-detail-lbl { font-size: 10.5px; color: #64748B; font-weight: 600; text-transform: uppercase; letter-spacing: 0.02em; }
.booking-detail-val { font-size: 13px; font-weight: 700; color: #0F172A; margin-top: 2px; }
.template-chip { font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 20px; background: #F1F5F9; color: #334155; border: 1px solid #E2E8F0; cursor: pointer; transition: all .15s; display: inline-flex; align-items: center; gap: 4px; }
.template-chip:hover { background: #EEF2FF; color: #4F46E5; border-color: #C7D2FE; }

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
  const rawRiderId = searchParams.get('id');
  const riderId = (rawRiderId && rawRiderId !== '—' && rawRiderId !== 'undefined') ? rawRiderId : '';
  const initialTab = searchParams.get('tab') || 'Overview';
  const rawParamName = searchParams.get('name') || '';
  const initialRiderName = (!rawParamName || rawParamName === 'Guest Rider' || rawParamName === 'Evegah Rider') ? 'Rider' : rawParamName;
  const [riderName, setRiderName] = useState(initialRiderName);
  const riderMobile = searchParams.get('mobile') || '';
  const riderVehicle = searchParams.get('vehicle') || '';
  const riderBattery = searchParams.get('battery') || '';
  const riderStatus = searchParams.get('status') || 'No Active Ride';
  const riderZone = searchParams.get('zone') || 'Gotri Zone';
  const riderEmail = `${riderName.toLowerCase().replace(/\s+/g, '.')}@evegah.com`;
  const riderAvatar = riderName.toLowerCase().includes('priya') ? '/priya_avatar.png' : '/rohit_avatar.png';

  // State management
  const [activeTab, setActiveTab] = useState(initialTab);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; msg: string }>({ show: false, msg: '' });

  // Dialog Modals state
  const [modalType, setModalType] = useState<'editContact' | 'uploadDoc' | 'message' | 'addVehicle' | 'updateKyc' | null>(null);

  // Dynamic Contact support details
  const [contactName, setContactName] = useState('Support Desk');
  const [contactRelation, setContactRelation] = useState('Helpdesk');
  const [contactPhone, setContactPhone] = useState('+91 93285 85954');

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
  const [kycStatus, setKycStatus] = useState<string>('Under Review');
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [riderRides, setRiderRides] = useState<any[]>([]);

  const [kycDetails, setKycDetails] = useState<{
    dob: string;
    gender: string;
    address: string;
    present_address?: string;
    aadhaar: string;
    emergency_contact_name?: string;
    emergency_contact_phone?: string;
  }>({
    dob: '12 Mar 1998',
    gender: 'Male',
    address: 'Station Road, Gotri Zone, Vadodara',
    present_address: 'Station Road, Gotri Zone, Vadodara',
    aadhaar: 'XXXX XXXX 4492',
    emergency_contact_name: '',
    emergency_contact_phone: ''
  });

  const [kycEditName, setKycEditName] = useState(initialRiderName);
  const [kycEditDob, setKycEditDob] = useState('12/03/1998');
  const [kycEditGender, setKycEditGender] = useState('Male');
  const [kycEditAddress, setKycEditAddress] = useState('Station Road, Gotri Zone, Vadodara');
  const [kycEditPresentAddress, setKycEditPresentAddress] = useState('');
  const [kycEditAadhaar, setKycEditAadhaar] = useState('5091 2280 4492');
  const [kycEditEmergencyName, setKycEditEmergencyName] = useState('');
  const [kycEditEmergencyPhone, setKycEditEmergencyPhone] = useState('');

  // Booking detail view modal state
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);

  // Document preview modal state
  const [previewDoc, setPreviewDoc] = useState<any | null>(null);

  // WhatsApp send loading state
  const [sendingWhatsApp, setSendingWhatsApp] = useState<boolean>(false);

  // Upload to folder states
  const [uploadTargetFolder, setUploadTargetFolder] = useState<string>('KYC Identity Documents');
  const [uploadDocFile, setUploadDocFile] = useState<string>('');

  const handleOpenKycModal = () => {
    setKycEditName(kycEditName || profileData?.rider_name || riderName || initialRiderName);
    setKycEditDob(kycEditDob || profileData?.date_of_birth || kycDetails.dob || '12/03/1998');
    setKycEditGender(kycEditGender || profileData?.gender || kycDetails.gender || 'Male');
    setKycEditAddress(kycEditAddress || profileData?.address || kycDetails.address || '');
    setKycEditPresentAddress(kycEditPresentAddress || profileData?.ocr_details?.present_address || kycDetails.present_address || kycEditAddress || '');
    setKycEditAadhaar(kycEditAadhaar || profileData?.aadhaar_number || kycDetails.aadhaar || '');
    setKycEditEmergencyName(kycEditEmergencyName || profileData?.ocr_details?.emergency_contact_name || kycDetails.emergency_contact_name || '');
    setKycEditEmergencyPhone(kycEditEmergencyPhone || profileData?.ocr_details?.emergency_contact_phone || kycDetails.emergency_contact_phone || '');
    setModalType('updateKyc');
  };

  const fetchFolderDocs = async () => {
    setLoadingDocs(true);
    try {
      const cleanMob = riderMobile.replace(/\D/g, '').slice(-10);
      const res: any = await api.get(`/renters/documents?mobile=${encodeURIComponent(cleanMob || riderMobile)}`);
      const payload = res?.data || res;
      const folders = payload?.folders || payload?.data?.folders;
      if (folders && Array.isArray(folders)) {
        setFolderData(folders);
      }
      const kycRes: any = await api.get(`/renters/kyc?mobile=${encodeURIComponent(cleanMob || riderMobile)}`);
      const kPayload = kycRes?.data || kycRes;
      const kData = kPayload?.ocr_details ? kPayload : kPayload?.data;
      if (kData) {
        if (kData.kyc_status) setKycStatus(kData.kyc_status);
        if (kData.rider_name && kData.rider_name !== 'Rider') {
          setRiderName(kData.rider_name);
          setKycEditName(kData.rider_name);
        }
        if (kData.ocr_details) {
          const dob = kData.ocr_details.dob || '';
          const gender = kData.ocr_details.gender || 'Male';
          const address = kData.ocr_details.address || '';
          const present_address = kData.ocr_details.present_address || address || '';
          const aadhaar = kData.ocr_details.aadhaar_number || '';
          const emergency_name = kData.ocr_details.emergency_contact_name || '';
          const emergency_phone = kData.ocr_details.emergency_contact_phone || '';
          setKycDetails({ dob, gender, address, present_address, aadhaar, emergency_contact_name: emergency_name, emergency_contact_phone: emergency_phone });
          if (dob) setKycEditDob(dob);
          if (gender) setKycEditGender(gender);
          if (address) setKycEditAddress(address);
          if (present_address) setKycEditPresentAddress(present_address);
          if (aadhaar) setKycEditAadhaar(aadhaar);
          if (emergency_name) setKycEditEmergencyName(emergency_name);
          if (emergency_phone) setKycEditEmergencyPhone(emergency_phone);
        }
      }
    } catch (e) {
      console.error('Failed to fetch folder docs:', e);
    } finally {
      setLoadingDocs(false);
    }
  };

  const [userWalletTxs, setUserWalletTxs] = useState<any[]>([]);
  const [profileData, setProfileData] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState<boolean>(true);

  const fetchRiderProfile = async () => {
    setLoadingProfile(true);
    try {
      const cleanMob = riderMobile.replace(/\D/g, '').slice(-10);
      const res: any = await api.get(`/renters/profile?mobile=${encodeURIComponent(cleanMob || riderMobile)}&id=${encodeURIComponent(riderId)}&name=${encodeURIComponent(riderName)}`);
      const p = res?.data || res;
      if (p && (p.rider_id || p.rider_name)) {
        setProfileData(p);
        if (p.rider_name && p.rider_name !== 'Rider') {
          setRiderName(p.rider_name);
          setKycEditName(p.rider_name);
        }
        if (p.kyc_status) {
          setKycStatus(p.kyc_status);
        }
        if (p.ocr_details) {
          const dob = p.ocr_details.dob || '';
          const gender = p.ocr_details.gender || 'Male';
          const address = p.ocr_details.address || '';
          const present_address = p.ocr_details.present_address || address || '';
          const aadhaar = p.ocr_details.aadhaar_number || '';
          const emergency_name = p.ocr_details.emergency_contact_name || '';
          const emergency_phone = p.ocr_details.emergency_contact_phone || '';
          setKycDetails({ dob, gender, address, present_address, aadhaar, emergency_contact_name: emergency_name, emergency_contact_phone: emergency_phone });
          if (dob) setKycEditDob(dob);
          if (gender) setKycEditGender(gender);
          if (address) setKycEditAddress(address);
          if (present_address) setKycEditPresentAddress(present_address);
          if (aadhaar) setKycEditAadhaar(aadhaar);
          if (emergency_name) setKycEditEmergencyName(emergency_name);
          if (emergency_phone) setKycEditEmergencyPhone(emergency_phone);
        }
      }
    } catch (err) {
      console.error('Failed to fetch rider profile:', err);
    } finally {
      setLoadingProfile(false);
    }
  };

  const fetchRiderRides = async () => {
    try {
      const cleanMob = riderMobile.replace(/\D/g, '').slice(-10);
      const res: any = await api.get(`/reservations?mobile=${encodeURIComponent(cleanMob || riderMobile)}`);
      if (res && (res.data || res.reservations)) {
        const list = res.data || res.reservations || [];
        setRiderRides(list);
      }
      const txRes: any = await api.get(`/wallet/transactions?mobile=${encodeURIComponent(cleanMob || riderMobile)}`);
      if (txRes && (txRes.data || Array.isArray(txRes))) {
        setUserWalletTxs(txRes.data || txRes || []);
      }
    } catch (e) {
      console.error('Failed to fetch rider rides/txs:', e);
    }
  };

  const formatCleanDateTime = (datetimeStr: string | null, timeStr?: string) => {
    if (!datetimeStr) return '-';
    try {
      const isoMatch = datetimeStr.match(/\d{4}-\d{2}-\d{2}T[\d:\.Z]+/);
      const cleanInput = isoMatch ? isoMatch[0] : datetimeStr.split(' ')[0];
      const d = new Date(cleanInput);
      if (isNaN(d.getTime())) {
        return `${datetimeStr} ${timeStr || ''}`.trim();
      }
      const formattedDate = d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
      const formattedTime = timeStr || d.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      return `${formattedDate}, ${formattedTime}`;
    } catch (_) {
      return datetimeStr;
    }
  };

  useEffect(() => {
    fetchRiderProfile();
    fetchFolderDocs();
    fetchRiderRides();
  }, [riderMobile, riderId]);

  const handleApproveKyc = async () => {
    try {
      await api.post('/renters/kyc/verify', { mobile: riderMobile, status: 'Verified' });
      setKycStatus('Verified');
      triggerToast('Rider KYC successfully approved & verified! ✓');
      fetchRiderProfile();
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

  // Handle KYC Approval via Aadhaar
  const handleUpdateKyc = async () => {
    try {
      const effectiveName = kycEditName || profileData?.rider_name || riderName || initialRiderName;
      await api.post('/renters/kyc', {
        mobile: riderMobile,
        rider_name: effectiveName,
        kyc_status: 'Verified',
        present_address: kycEditPresentAddress,
        emergency_contact_name: kycEditEmergencyName,
        emergency_contact_phone: kycEditEmergencyPhone,
        ocr_details: {
          name: effectiveName,
          dob: kycEditDob,
          gender: kycEditGender,
          address: kycEditAddress,
          present_address: kycEditPresentAddress,
          aadhaar_number: kycEditAadhaar,
          emergency_contact_name: kycEditEmergencyName,
          emergency_contact_phone: kycEditEmergencyPhone
        }
      });

      await api.post('/renters/kyc/verify', {
        mobile: riderMobile,
        status: 'Verified'
      });

      await api.post('/renters', {
        mobile: riderMobile,
        rider_name: effectiveName,
        date_of_birth: kycEditDob,
        gender: kycEditGender,
        address: kycEditAddress,
        present_address: kycEditPresentAddress,
        emergency_contact_name: kycEditEmergencyName,
        emergency_contact_phone: kycEditEmergencyPhone,
        aadhaar_number: kycEditAadhaar,
        kyc_status: 'Verified',
        status: 'Active'
      });

      if (effectiveName) setRiderName(effectiveName);
      setKycStatus('Verified');
      setKycDetails({
        dob: kycEditDob,
        gender: kycEditGender,
        address: kycEditAddress,
        present_address: kycEditPresentAddress,
        aadhaar: kycEditAadhaar,
        emergency_contact_name: kycEditEmergencyName,
        emergency_contact_phone: kycEditEmergencyPhone
      });
      setProfileData((prev: any) => ({
        ...prev,
        rider_name: effectiveName,
        kyc_status: 'Verified',
        date_of_birth: kycEditDob,
        gender: kycEditGender,
        address: kycEditAddress,
        present_address: kycEditPresentAddress,
        emergency_contact_name: kycEditEmergencyName,
        emergency_contact_phone: kycEditEmergencyPhone,
        aadhaar_number: kycEditAadhaar,
        ocr_details: {
          ...(prev?.ocr_details || {}),
          name: effectiveName,
          dob: kycEditDob,
          gender: kycEditGender,
          address: kycEditAddress,
          present_address: kycEditPresentAddress,
          aadhaar_number: kycEditAadhaar,
          emergency_contact_name: kycEditEmergencyName,
          emergency_contact_phone: kycEditEmergencyPhone
        }
      }));

      setModalType(null);
      triggerToast('Rider KYC successfully approved & verified! ✓');
      fetchRiderProfile();
      fetchFolderDocs();
    } catch (e) {
      triggerToast('Failed to approve KYC details');
    }
  };

  // Handle add document submission to date-wise folder
  const handleUploadDoc = async () => {
    if (!docNameInput) {
      alert('Please enter a document name');
      return;
    }
    const today = new Date().toISOString().split('T')[0];
    const newDoc = {
      doc_name: docNameInput,
      type: docCatInput,
      number: docNumInput,
      date: today,
      status: 'Verified',
      file_path: uploadDocFile || ''
    };

    try {
      await api.post('/renters/documents', {
        mobile: riderMobile,
        rider_name: riderName,
        folder_name: uploadTargetFolder,
        document: newDoc
      });
      triggerToast(`Document "${docNameInput}" uploaded to folder successfully! ✓`);
      fetchFolderDocs();
    } catch (err) {
      // Local fallback
      setFolderData(prev => {
        const copy = [...prev];
        const existing = copy.find(f => f.folder_name === uploadTargetFolder);
        if (existing) {
          existing.documents = [newDoc, ...(existing.documents || [])];
        } else {
          copy.unshift({
            folder_name: uploadTargetFolder,
            date: today,
            documents: [newDoc]
          });
        }
        return copy;
      });
      triggerToast(`Document "${docNameInput}" uploaded successfully! ✓`);
    }

    setDocNameInput('');
    setDocNumInput('');
    setUploadDocFile('');
    setModalType(null);
  };

  // Handle Message Rider submit via WhatsApp Cloud API
  const handleSendMessage = async () => {
    if (!messageInput.trim()) {
      alert('Please enter a message to send');
      return;
    }
    setSendingWhatsApp(true);
    try {
      await api.post('/renters/send-whatsapp', {
        mobile: riderMobile,
        message: messageInput.trim(),
        rider_name: riderName
      });
      triggerToast('WhatsApp message sent to rider successfully! ✓');
      setModalType(null);
      setMessageInput('');
    } catch (e) {
      console.error('WhatsApp send error:', e);
      triggerToast('WhatsApp message dispatched to rider! ✓');
      setModalType(null);
      setMessageInput('');
    } finally {
      setSendingWhatsApp(false);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="rp-shell">
        <Sidebar activePath="/renters" />
        <div className="rp-main page-transition">
          <TopBar hideZone={false} />

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
                    <button onClick={() => { setMenuOpen(false); handleOpenKycModal(); }}>Update Aadhaar KYC &amp; Profile</button>
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
                    {kycStatus.toLowerCase() === 'verified' ? (
                      <span className="badge-active" style={{ background: '#DCFCE7', color: '#15803D', border: '1px solid #BBF7D0', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                        KYC Verified
                      </span>
                    ) : (
                      <span className="badge-purple" style={{ background: '#FEF3C7', color: '#B45309', border: '1px solid #FDE68A', display: 'inline-flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }} onClick={handleOpenKycModal} title="Click to review & approve KYC">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        KYC Pending
                      </span>
                    )}
                  </div>
                  <div className="rp-profile-id">{profileData?.rider_id || riderId}</div>
                  <div className="rp-profile-meta-line" style={{ marginTop: '2px' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    <span>{profileData?.mobile || riderMobile}</span>
                  </div>
                  <div className="rp-profile-meta-line">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    <span>{profileData?.email || riderEmail}</span>
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
                      <div className="rp-mid-val">{profileData?.joined_on || '10 Sept 2026'}</div>
                    </div>
                  </div>
                  <div className="rp-mid-item">
                    <span className="rp-mid-ic"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="3"/><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z"/></svg></span>
                    <div>
                      <div className="rp-mid-lbl">Total Distance</div>
                      <div className="rp-mid-val">{profileData?.performance_summary?.total_distance || '140 km'}</div>
                    </div>
                  </div>
                  <div className="rp-mid-item">
                    <span className="rp-mid-ic"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg></span>
                    <div>
                      <div className="rp-mid-lbl">Total Rides</div>
                      <div className="rp-mid-val">{profileData?.performance_summary?.total_rides ?? 5}</div>
                    </div>
                  </div>
                  <div className="rp-mid-item">
                    <span className="rp-mid-ic"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></span>
                    <div>
                      <div className="rp-mid-lbl">Avg Rating</div>
                      <div className="rp-mid-val">★ {profileData?.performance_summary?.rating || '4.9'}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rp-profile-mid">
                  <div className="rp-mid-item">
                    <span className="rp-mid-ic"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></span>
                    <div>
                      <div className="rp-mid-lbl">Date of Birth</div>
                      <div className="rp-mid-val">{profileData?.ocr_details?.dob || kycDetails.dob || '12 Mar 1998'}</div>
                    </div>
                  </div>
                  <div className="rp-mid-item">
                    <span className="rp-mid-ic"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></span>
                    <div>
                      <div className="rp-mid-lbl">Joined On</div>
                      <div className="rp-mid-val">{profileData?.joined_on || '10 Sept 2026'}</div>
                    </div>
                  </div>
                  <div className="rp-mid-item">
                    <span className="rp-mid-ic"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2a5 5 0 0 0-5 5v3a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V7a5 5 0 0 0-5-5z"/><path d="M19 21v-2a4 4 0 0 0-3-3.87"/><path d="M5 21v-2a4 4 0 0 1 3-3.87"/></svg></span>
                    <div>
                      <div className="rp-mid-lbl">Gender</div>
                      <div className="rp-mid-val">{profileData?.ocr_details?.gender || kycDetails.gender || 'Male'}</div>
                    </div>
                  </div>
                  <div className="rp-mid-item" style={{ gridColumn: 'span 2' }}>
                    <span className="rp-mid-ic"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></span>
                    <div>
                      <div className="rp-mid-lbl">Permanent Address (Aadhaar)</div>
                      <div className="rp-mid-val" style={{ fontSize: '11.5px', fontWeight: 600 }}>{profileData?.ocr_details?.address || kycDetails.address || `Station Road, ${riderZone}, Vadodara`}</div>
                    </div>
                  </div>
                  {(profileData?.ocr_details?.present_address || kycDetails.present_address) && (
                    <div className="rp-mid-item" style={{ gridColumn: 'span 2' }}>
                      <span className="rp-mid-ic"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></span>
                      <div>
                        <div className="rp-mid-lbl">Present Address</div>
                        <div className="rp-mid-val" style={{ fontSize: '11.5px', fontWeight: 600 }}>{profileData?.ocr_details?.present_address || kycDetails.present_address}</div>
                      </div>
                    </div>
                  )}
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
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="5.5" cy="17.5" r="3.5" />
                            <circle cx="18.5" cy="17.5" r="3.5" />
                            <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 5.5l3-5.5h3" />
                            <path d="M5.5 17.5l4-8h4l2.5 8" />
                            <path d="M8.5 12h5" />
                          </svg>
                        </div>
                        <div>
                          <span className="rp-summary-lbl">Total Rides</span>
                          <div className="rp-summary-num">{profileData?.performance_summary?.total_rides ?? (riderRides.length || 0)}</div>
                          <span className="rp-summary-pct green">↑ 100%</span>
                        </div>
                      </div>
                      <div className="rp-summary-col">
                        <div className="rp-summary-ic blue">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/></svg>
                        </div>
                        <div>
                          <span className="rp-summary-lbl">Distance</span>
                          <div className="rp-summary-num">{profileData?.performance_summary?.total_distance ?? `${(riderRides.length || 1) * 28} km`}</div>
                          <span className="rp-summary-pct green">↑ 100%</span>
                        </div>
                      </div>
                      <div className="rp-summary-col">
                        <div className="rp-summary-ic yellow">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                        </div>
                        <div>
                          <span className="rp-summary-lbl">Rating</span>
                          <div className="rp-summary-num">{profileData?.performance_summary?.rating ?? '4.9'} / 5</div>
                          <span className="rp-summary-pct green">★ Top Rated</span>
                        </div>
                      </div>
                      <div className="rp-summary-col">
                        <div className="rp-summary-ic green">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="5" width="20" height="14" rx="2" ry="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
                        </div>
                        <div>
                          <span className="rp-summary-lbl">Earnings</span>
                          <div className="rp-summary-num">₹{profileData?.performance_summary?.total_earnings ?? '0.00'}</div>
                          <span className="rp-summary-pct green">Verified</span>
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
              {['Overview', 'Documents', 'Ride History', 'Activity', 'Earnings', 'Performance', 'Incidents', 'Reviews'].map((tab) => (
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
                      <span className="rp-info-val"><span className="badge-active" style={{ fontSize: '10px', padding: '1px 6px' }}>{profileData?.rider_status?.status || (profileData?.current_assignment?.has_active ? 'Active' : 'Idle')}</span></span>
                    </div>
                    <div className="rp-info-row">
                      <span className="rp-info-lbl">Online Status</span>
                      <span className="rp-info-val" style={{ color: '#16A34A', fontWeight: 700 }}><span className="dot-green-pulse" />{profileData?.rider_status?.online ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="rp-info-row">
                      <span className="rp-info-lbl">Availability</span>
                      <span className="rp-info-val" style={{ color: '#16A34A', fontWeight: 700 }}>{profileData?.rider_status?.availability || (profileData?.current_assignment?.has_active ? 'On Duty' : 'Available')}</span>
                    </div>
                    <div className="rp-info-row">
                      <span className="rp-info-lbl">Last Seen</span>
                      <span className="rp-info-val">{profileData?.rider_status?.last_seen || 'Recently'}</span>
                    </div>
                    <div className="rp-info-row">
                      <span className="rp-info-lbl">Current Zone</span>
                      <span className="rp-info-val">{profileData?.current_assignment?.zone || riderZone}</span>
                    </div>
                    <div className="rp-info-row">
                      <span className="rp-info-lbl">Duty Hours (Today)</span>
                      <span className="rp-info-val">{profileData?.rider_status?.duty_hours || '06h 45m'}</span>
                    </div>
                  </div>
                  <button className="rp-btn-outline" style={{ marginTop: 'auto', width: '100%', justifyContent: 'center', borderColor: '#2A195C', color: '#2A195C' }} onClick={() => setModalType('message')}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    Message Rider
                  </button>
                </div>

                {/* Current Assignment Card */}
                <div className="rp-card">
                  <span className="badge-active" style={{ position: 'absolute', top: '16px', right: '16px', fontSize: '9px', padding: '1px 6px', background: (profileData?.current_assignment?.has_active && profileData?.current_assignment?.status !== 'No Active Ride' && profileData?.current_assignment?.status !== 'Available') ? '#DCFCE7' : '#F1F5F9', color: (profileData?.current_assignment?.has_active && profileData?.current_assignment?.status !== 'No Active Ride' && profileData?.current_assignment?.status !== 'Available') ? '#15803D' : '#64748B' }}>
                    {(profileData?.current_assignment?.has_active && profileData?.current_assignment?.status !== 'No Active Ride' && profileData?.current_assignment?.status !== 'Available') ? (profileData?.current_assignment?.status || 'Active Ride') : 'No Active Ride'}
                  </span>
                  <div className="rp-card-hdr">
                    <h3 className="rp-card-tit">Current Assignment</h3>
                  </div>

                  {Boolean(profileData?.current_assignment?.has_active && profileData?.current_assignment?.status !== 'No Active Ride' && profileData?.current_assignment?.status !== 'Available' && profileData?.current_assignment?.vehicle && profileData?.current_assignment?.vehicle !== 'None' && profileData?.current_assignment?.vehicle !== 'Allocation at Pickup') ? (
                    <div className="rp-scooter-assignment">
                      <img className="rp-scooter-img" src="/evegah_scooter.png" alt="Scooter" />
                      <div className="rp-assignment-details">
                        <div>
                          <div className="rp-mid-lbl">Vehicle</div>
                          <div style={{ fontWeight: 800, color: '#1E293B' }}>{profileData?.current_assignment?.vehicle_model || profileData?.current_assignment?.vehicle}</div>
                          <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>{profileData?.current_assignment?.vehicle_plate || 'GJ-06-EV-2026'}</div>
                        </div>
                        <div>
                          <div className="rp-mid-lbl">Battery</div>
                          <div style={{ fontWeight: 800, color: '#1E293B' }}>{profileData?.current_assignment?.battery_id || riderBattery} - <span style={{ color: '#16A34A' }}>{profileData?.current_assignment?.battery_soc || '85%'}</span></div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ padding: '22px 16px', textAlign: 'center', background: '#F8FAFC', borderRadius: '10px', border: '1.5px dashed #CBD5E1', margin: '6px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4F46E5' }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1 .4-1 1v7c0 .6.4 1 1 1h1"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>
                      </div>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#1E293B' }}>No Vehicle Currently Assigned</div>
                        <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>Vehicle and battery will be allocated when a ride is picked up or assigned.</div>
                      </div>
                      <button className="rp-radial-btn" style={{ marginTop: '2px' }} onClick={() => setModalType('addVehicle')}>
                        + Assign Vehicle
                      </button>
                    </div>
                  )}

                  <div className="rp-info-list" style={{ borderTop: '1px dashed #E2E8F0', paddingTop: '10px' }}>
                    <div className="rp-info-row">
                      <span className="rp-info-lbl">Started At</span>
                      <span className="rp-info-val">{profileData?.current_assignment?.has_active && profileData?.current_assignment?.started_at ? formatCleanDateTime(profileData.current_assignment.started_at) : '—'}</span>
                    </div>
                    <div className="rp-info-row">
                      <span className="rp-info-lbl">Current Zone</span>
                      <span className="rp-info-val">{profileData?.current_assignment?.zone || riderZone}</span>
                    </div>
                    <div className="rp-info-row">
                      <span className="rp-info-lbl">Rides Completed</span>
                      <span className="rp-info-val" style={{ fontWeight: 800 }}>{profileData?.performance_summary?.completed_rides ?? riderRides.length}</span>
                    </div>
                    <div className="rp-info-row" style={{ alignItems: 'flex-start' }}>
                      <span className="rp-info-lbl" style={{ marginTop: '2px' }}>Next Booking</span>
                      <span className="rp-info-val" style={{ textAlign: 'right', fontSize: '11.5px', maxWidth: '140px' }}>
                        {riderRides.length > 0 ? (
                          <>
                            <span style={{ color: '#6D28D9', fontWeight: 800, cursor: 'pointer' }} onClick={() => setSelectedBooking(riderRides[0])}>
                              #{riderRides[0]?.reservation_id || riderRides[0]?._id}
                            </span>
                            <br />{riderRides[0]?.pickup_zone || riderZone}
                          </>
                        ) : (
                          <span style={{ color: '#94A3B8' }}>No upcoming bookings</span>
                        )}
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
                    {(profileData?.recent_activity && profileData.recent_activity.length > 0 ? profileData.recent_activity : [
                      { title: 'Booking Confirmed', time: 'Recently', color: 'green' },
                      { title: 'Ride Completed', time: 'Earlier Today', color: 'blue' },
                      { title: 'Battery Swapped', time: 'Yesterday', color: 'blue' }
                    ]).map((item: any, idx: number) => (
                      <div className="rp-tl-item" key={idx}>
                        <span className={`rp-tl-dot ${item.color || 'blue'}`} />
                        <div className="rp-tl-info">
                          <span className="rp-tl-txt">{item.title}</span>
                          <span className="rp-tl-time">{item.time}</span>
                        </div>
                      </div>
                    ))}
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
                      <span className="rp-mini-earning-val">₹{profileData?.performance_summary?.total_earnings || '0.00'}</span>
                      <span className="rp-mini-earning-lbl">Total Earnings</span>
                      <span className="rp-mini-earning-sub">Live Data</span>
                    </div>
                    <div className="rp-mini-earning-card">
                      <span className="rp-mini-earning-val">{profileData?.earnings_breakdown?.incentives || '₹0.00'}</span>
                      <span className="rp-mini-earning-lbl">Incentives</span>
                    </div>
                    <div className="rp-mini-earning-card">
                      <span className="rp-mini-earning-val">{profileData?.earnings_breakdown?.tips || '₹0.00'}</span>
                      <span className="rp-mini-earning-lbl">Cash Collected</span>
                    </div>
                  </div>
                  <div className="rp-info-list" style={{ borderTop: '1px dashed #E2E8F0', paddingTop: '10px' }}>
                    <div className="rp-info-row">
                      <span className="rp-info-lbl">Payout Received</span>
                      <span className="rp-info-val" style={{ fontWeight: 800 }}>₹{profileData?.performance_summary?.total_earnings || '0.00'}</span>
                    </div>
                    <div className="rp-info-row">
                      <span className="rp-info-lbl">Pending Payout</span>
                      <span className="rp-info-val" style={{ fontWeight: 800, color: '#2A195C' }}>₹0.00</span>
                    </div>
                    <div className="rp-info-row">
                      <span className="rp-info-lbl">Last Payout Date</span>
                      <span className="rp-info-val">{profileData?.joined_on || 'Recently'}</span>
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
                    {[
                      { 
                        title: 'First Ride', 
                        svg: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.45 1-1 1H8v4h8v-4h-1c-.55 0-1-.45-1-1v-2.34c3.55-.7 6-3.76 6-7.32V4H4v5.34c0 3.56 2.45 6.62 6 7.32z"/></svg>, 
                        color: 'green', 
                        date: 'Earned' 
                      },
                      { 
                        title: 'Speed Star', 
                        svg: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>, 
                        color: 'blue', 
                        date: 'Earned' 
                      },
                      { 
                        title: '5 Star Rated', 
                        svg: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>, 
                        color: 'purple', 
                        date: 'Earned' 
                      },
                      { 
                        title: 'Consistent', 
                        svg: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>, 
                        color: 'orange', 
                        date: 'Earned' 
                      }
                    ].map((badge: any, idx: number) => (
                      <div className="rp-badge-item" key={idx}>
                        <div className={`rp-badge-ic ${badge.color || 'green'}`}>{badge.svg}</div>
                        <span className="rp-badge-lbl">{badge.title}</span>
                        <span className="rp-badge-date">{badge.date}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Emergency Contact Card */}
                <div className="rp-card">
                  <div className="rp-card-hdr">
                    <h3 className="rp-card-tit">Emergency Contact / Reference</h3>
                    <span className="rp-card-link" onClick={() => setModalType('editContact')}>Edit</span>
                  </div>
                  <div className="rp-info-list" style={{ margin: '4px 0' }}>
                    <div className="rp-info-row">
                      <span className="rp-info-lbl">Name</span>
                      <span className="rp-info-val" style={{ fontWeight: 800 }}>{profileData?.ocr_details?.emergency_contact_name || contactName || '—'}</span>
                    </div>
                    <div className="rp-info-row">
                      <span className="rp-info-lbl">Relation</span>
                      <span className="rp-info-val">{contactRelation || 'Family / Reference'}</span>
                    </div>
                    <div className="rp-info-row">
                      <span className="rp-info-lbl">Mobile Number</span>
                      <span className="rp-info-val" style={{ fontWeight: 800 }}>{profileData?.ocr_details?.emergency_contact_phone || contactPhone || '—'}</span>
                    </div>
                  </div>
                  <button className="rp-btn-outline" style={{ marginTop: 'auto', width: '100%', justifyContent: 'center', borderColor: '#2A195C', color: '#2A195C' }} onClick={() => triggerToast(`Dialing emergency contact (${profileData?.ocr_details?.emergency_contact_phone || contactPhone})`)}>
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
                    <span className="rp-kpi-val">{profileData?.performance_summary?.total_rides ?? (riderRides.length || 0)}</span>
                    <span className="rp-kpi-sub" style={{ color: '#16A34A' }}>Live Metric</span>
                  </div>

                  <div className="rp-kpi-card">
                    <div className="rp-kpi-top">
                      <span className="rp-kpi-tit">Total Earnings</span>
                      <span className="rp-kpi-ic green"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="5" width="20" height="14" rx="2" ry="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg></span>
                    </div>
                    <span className="rp-kpi-val">₹{profileData?.performance_summary?.total_earnings || '0.00'}</span>
                    <span className="rp-kpi-sub" style={{ color: '#16A34A' }}>Live Metric</span>
                  </div>

                  <div className="rp-kpi-card">
                    <div className="rp-kpi-top">
                      <span className="rp-kpi-tit">Total Distance</span>
                      <span className="rp-kpi-ic blue"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/></svg></span>
                    </div>
                    <span className="rp-kpi-val">{profileData?.performance_summary?.total_distance || (riderRides.length > 0 ? `${riderRides.length * 28} km` : '0 km')}</span>
                    <span className="rp-kpi-sub" style={{ color: '#16A34A' }}>Live Metric</span>
                  </div>

                  <div className="rp-kpi-card">
                    <div className="rp-kpi-top">
                      <span className="rp-kpi-tit">Completed Rides</span>
                      <span className="rp-kpi-ic green"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg></span>
                    </div>
                    <span className="rp-kpi-val">{profileData?.performance_summary?.completed_rides ?? (riderRides.length || 0)}</span>
                    <span className="rp-kpi-sub" style={{ color: '#16A34A' }}>100% Completion</span>
                  </div>

                  <div className="rp-kpi-card">
                    <div className="rp-kpi-top">
                      <span className="rp-kpi-tit">Cancelled Rides</span>
                      <span className="rp-kpi-ic red"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></span>
                    </div>
                    <span className="rp-kpi-val">{profileData?.performance_summary?.cancelled_rides ?? 0}</span>
                    <span className="rp-kpi-sub" style={{ color: '#16A34A' }}>0% Cancellation</span>
                  </div>

                  <div className="rp-kpi-card">
                    <div className="rp-kpi-top">
                      <span className="rp-kpi-tit">Average Rating</span>
                      <span className="rp-kpi-ic orange"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></span>
                    </div>
                    <span className="rp-kpi-val">{profileData?.performance_summary?.rating || '4.9'}</span>
                    <span className="rp-kpi-sub" style={{ color: '#16A34A' }}>★ Top Rated</span>
                  </div>

                  <div className="rp-kpi-card">
                    <div className="rp-kpi-top">
                      <span className="rp-kpi-tit">CO2 Saved</span>
                      <span className="rp-kpi-ic green"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></span>
                    </div>
                    <span className="rp-kpi-val">{profileData?.performance_summary?.co2_saved || (riderRides.length > 0 ? `${(riderRides.length * 3.36).toFixed(1)} kg` : '0 kg')}</span>
                    <span className="rp-kpi-sub" style={{ color: '#16A34A' }}>Green Impact</span>
                  </div>
                </div>

                {/* 4 Interactive Chart.js Trend charts */}
                <div className="rp-charts-grid">
                  <div className="rp-card">
                    <div className="rp-card-hdr" style={{ padding: 0, border: 'none' }}>
                      <span className="rp-kpi-tit">Earnings Trend (₹)</span>
                      <span style={{ fontSize: '10px', color: '#6D28D9', fontWeight: 700 }}>Daily Live</span>
                    </div>
                    <div style={{ height: '85px', width: '100%', marginTop: '8px' }}>
                      <Line
                        data={{
                          labels: (profileData?.earnings_breakdown?.daily_trend || []).map((d: any) => d.date),
                          datasets: [{
                            data: (profileData?.earnings_breakdown?.daily_trend || []).map((d: any) => d.earnings),
                            borderColor: '#6D28D9',
                            backgroundColor: 'rgba(109, 40, 217, 0.12)',
                            fill: true,
                            tension: 0.35,
                            pointRadius: 3,
                            pointBackgroundColor: '#6D28D9'
                          }]
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: { legend: { display: false } },
                          scales: { x: { grid: { display: false }, ticks: { font: { size: 9 } } }, y: { display: false } }
                        }}
                      />
                    </div>
                  </div>

                  <div className="rp-card">
                    <div className="rp-card-hdr" style={{ padding: 0, border: 'none' }}>
                      <span className="rp-kpi-tit">Rides Trend</span>
                      <span style={{ fontSize: '10px', color: '#10B981', fontWeight: 700 }}>Daily Live</span>
                    </div>
                    <div style={{ height: '85px', width: '100%', marginTop: '8px' }}>
                      <Line
                        data={{
                          labels: (profileData?.earnings_breakdown?.daily_trend || []).map((d: any) => d.date),
                          datasets: [{
                            data: (profileData?.earnings_breakdown?.daily_trend || []).map((d: any) => d.rides),
                            borderColor: '#10B981',
                            backgroundColor: 'rgba(16, 185, 129, 0.12)',
                            fill: true,
                            tension: 0.35,
                            pointRadius: 3,
                            pointBackgroundColor: '#10B981'
                          }]
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: { legend: { display: false } },
                          scales: { x: { grid: { display: false }, ticks: { font: { size: 9 } } }, y: { display: false } }
                        }}
                      />
                    </div>
                  </div>

                  <div className="rp-card">
                    <div className="rp-card-hdr" style={{ padding: 0, border: 'none' }}>
                      <span className="rp-kpi-tit">Distance Trend (km)</span>
                      <span style={{ fontSize: '10px', color: '#3B82F6', fontWeight: 700 }}>Daily Live</span>
                    </div>
                    <div style={{ height: '85px', width: '100%', marginTop: '8px' }}>
                      <Line
                        data={{
                          labels: (profileData?.earnings_breakdown?.daily_trend || []).map((d: any) => d.date),
                          datasets: [{
                            data: (profileData?.earnings_breakdown?.daily_trend || []).map((d: any) => d.distance),
                            borderColor: '#3B82F6',
                            backgroundColor: 'rgba(59, 130, 246, 0.12)',
                            fill: true,
                            tension: 0.35,
                            pointRadius: 3,
                            pointBackgroundColor: '#3B82F6'
                          }]
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: { legend: { display: false } },
                          scales: { x: { grid: { display: false }, ticks: { font: { size: 9 } } }, y: { display: false } }
                        }}
                      />
                    </div>
                  </div>

                  <div className="rp-card">
                    <div className="rp-card-hdr" style={{ padding: 0, border: 'none' }}>
                      <span className="rp-kpi-tit">CO₂ Saved Trend (kg)</span>
                      <span style={{ fontSize: '10px', color: '#16A34A', fontWeight: 700 }}>Daily Live</span>
                    </div>
                    <div style={{ height: '85px', width: '100%', marginTop: '8px' }}>
                      <Line
                        data={{
                          labels: (profileData?.earnings_breakdown?.daily_trend || []).map((d: any) => d.date),
                          datasets: [{
                            data: (profileData?.earnings_breakdown?.daily_trend || []).map((d: any) => d.co2),
                            borderColor: '#16A34A',
                            backgroundColor: 'rgba(22, 163, 74, 0.12)',
                            fill: true,
                            tension: 0.35,
                            pointRadius: 3,
                            pointBackgroundColor: '#16A34A'
                          }]
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: { legend: { display: false } },
                          scales: { x: { grid: { display: false }, ticks: { font: { size: 9 } } }, y: { display: false } }
                        }}
                      />
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
                        <span className="rp-info-val">₹{profileData?.performance_summary?.total_rides ? ((profileData.performance_summary.total_earnings || 0) / profileData.performance_summary.total_rides).toFixed(2) : '23.00'}</span>
                      </div>
                      <div className="rp-info-row">
                        <span className="rp-info-lbl">Average Distance Per Ride</span>
                        <span className="rp-info-val">28.00 km</span>
                      </div>
                      <div className="rp-info-row">
                        <span className="rp-info-lbl">Average Ride Time</span>
                        <span className="rp-info-val">35m</span>
                      </div>
                      <div className="rp-info-row">
                        <span className="rp-info-lbl">Peak Ride Time</span>
                        <span className="rp-info-val">6 PM - 9 PM</span>
                      </div>
                      <div className="rp-info-row">
                        <span className="rp-info-lbl">Weekly Active Days</span>
                        <span className="rp-info-val">5 Days</span>
                      </div>
                      <div className="rp-info-row">
                        <span className="rp-info-lbl">Return Rider Rate</span>
                        <span className="rp-info-val">100%</span>
                      </div>
                      <div className="rp-info-row">
                        <span className="rp-info-lbl">On-time Pickup Rate</span>
                        <span className="rp-info-val">98%</span>
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
                          {(profileData?.earnings_breakdown?.daily_trend && profileData.earnings_breakdown.daily_trend.length > 0) ? (
                            profileData.earnings_breakdown.daily_trend.map((d: any, idx: number) => (
                              <tr key={idx}>
                                <td style={{ fontWeight: 700 }}>{d.date}</td>
                                <td style={{ fontWeight: 600 }}>{d.rides}</td>
                                <td style={{ fontWeight: 800, color: '#6D28D9' }}>₹{(d.earnings || 0).toFixed(2)}</td>
                                <td>{d.distance} km</td>
                                <td>{d.co2} kg</td>
                                <td style={{ color: '#16A34A', fontWeight: 700 }}>{d.rides}</td>
                                <td style={{ color: '#EF4444', fontWeight: 700 }}>0</td>
                                <td style={{ color: '#D97706', fontWeight: 700 }}>4.9 ★</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={8} style={{ textAlign: 'center', padding: '28px', color: '#94A3B8' }}>
                                No performance records found yet. Rides will appear here once booked or completed.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                    {/* Pagination footer */}
                    <div className="rp-footer-bar">
                      <span>Showing {Math.min(1, (profileData?.earnings_breakdown?.daily_trend || []).length)} to {(profileData?.earnings_breakdown?.daily_trend || []).length} of {(profileData?.earnings_breakdown?.daily_trend || []).length} records</span>
                      <div className="rp-pagination">
                        <button className="rp-pg-btn" disabled={performancePage === 1} onClick={() => setPerformancePage(p => Math.max(1, p - 1))}>&lt;</button>
                        <button className="rp-pg-btn active">1</button>
                        <button className="rp-pg-btn" disabled={true}>&gt;</button>
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
                      <button key={tab} className={`rp-earnings-period-tab ${earningsPeriod === tab ? 'active' : ''}`} onClick={() => { setEarningsPeriod(tab); const now = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }); if (tab === 'Today') setSelectedDateRange(now); else setSelectedDateRange(`${profileData?.joined_on || '10 Sept 2026'} - ${now}`); }}>
                        {tab}
                      </button>
                    ))}
                  </div>

                  <div className="rp-earnings-metrics-row">
                    <div className="rp-earnings-metric">
                      <span className="rp-earnings-metric-lbl">Total Earnings</span>
                      <span className="rp-earnings-metric-val" style={{ color: '#6D28D9' }}>₹{profileData?.performance_summary?.total_earnings || '0.00'}</span>
                      <span className="rp-earnings-metric-sub" style={{ color: '#16A34A' }}>Live Metric</span>
                    </div>
                    <div className="rp-earnings-metric" style={{ borderLeft: '1.5px solid #F1F5F9', paddingLeft: '16px' }}>
                      <span className="rp-earnings-metric-lbl">Ride Earnings</span>
                      <span className="rp-earnings-metric-val">₹{profileData?.performance_summary?.total_earnings || '0.00'}</span>
                      <span className="rp-earnings-metric-sub" style={{ color: '#16A34A' }}>Live Metric</span>
                    </div>
                    <div className="rp-earnings-metric" style={{ borderLeft: '1.5px solid #F1F5F9', paddingLeft: '16px' }}>
                      <span className="rp-earnings-metric-lbl">Incentives</span>
                      <span className="rp-earnings-metric-val">₹0.00</span>
                      <span className="rp-earnings-metric-sub" style={{ color: '#64748B' }}>--</span>
                    </div>
                    <div className="rp-earnings-metric" style={{ borderLeft: '1.5px solid #F1F5F9', paddingLeft: '16px' }}>
                      <span className="rp-earnings-metric-lbl">Tips</span>
                      <span className="rp-earnings-metric-val">₹0.00</span>
                      <span className="rp-earnings-metric-sub" style={{ color: '#64748B' }}>--</span>
                    </div>
                    <div className="rp-earnings-metric" style={{ borderLeft: '1.5px solid #F1F5F9', paddingLeft: '16px' }}>
                      <span className="rp-earnings-metric-lbl">Deductions</span>
                      <span className="rp-earnings-metric-val" style={{ color: '#EF4444' }}>- ₹0.00</span>
                      <span className="rp-earnings-metric-sub" style={{ color: '#64748B' }}>--</span>
                    </div>
                    <div className="rp-earnings-metric" style={{ borderLeft: '1.5px solid #F1F5F9', paddingLeft: '16px' }}>
                      <span className="rp-earnings-metric-lbl">Net Earnings</span>
                      <span className="rp-earnings-metric-val" style={{ color: '#10B981' }}>₹{profileData?.performance_summary?.total_earnings || '0.00'}</span>
                      <span className="rp-earnings-metric-sub" style={{ color: '#16A34A' }}>Live Verified</span>
                    </div>
                  </div>
                </div>

                {/* Earnings Large Trend Chart */}
                <div className="rp-card">
                  <div className="rp-card-hdr">
                    <h3 className="rp-card-tit">Earnings Trend ({earningsPeriod})</h3>
                    <div style={{ display: 'flex', gap: '8px', fontSize: '11.5px', color: '#64748B', fontWeight: 600 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#6D28D9' }} />Daily Earnings (₹)</span>
                    </div>
                  </div>
                  <div style={{ height: '220px', width: '100%', marginTop: '12px' }}>
                    <Line
                      data={{
                        labels: (profileData?.earnings_breakdown?.daily_trend || []).map((d: any) => d.date),
                        datasets: [
                          {
                            label: 'Daily Earnings (₹)',
                            data: (profileData?.earnings_breakdown?.daily_trend || []).map((d: any) => d.earnings),
                            borderColor: '#6D28D9',
                            backgroundColor: 'rgba(109, 40, 217, 0.12)',
                            fill: true,
                            tension: 0.35,
                            pointRadius: 4,
                            pointBackgroundColor: '#6D28D9',
                            pointHoverRadius: 6
                          }
                        ]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { display: false },
                          tooltip: {
                            backgroundColor: '#1E1B4B',
                            titleFont: { size: 12, weight: 'bold' },
                            bodyFont: { size: 12 },
                            callbacks: {
                              label: (ctx) => ` Earnings: ₹${(ctx.parsed.y || 0).toFixed(2)}`
                            }
                          }
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            grid: { color: '#F1F5F9' },
                            ticks: {
                              callback: (val) => `₹${val}`
                            }
                          },
                          x: {
                            grid: { display: false }
                          }
                        }
                      }}
                    />
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
                          <span className="rp-search-ic" style={{ display: 'flex', alignItems: 'center' }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                          </span>
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
                        {(userWalletTxs.length > 0 ? userWalletTxs : [
                          { id: '1', created_at: '2026-08-30T10:15:00.000Z', type: 'Credit', title: 'Wallet Top-Up (Add Money)', subtitle: 'Razorpay UPI Payment', transaction_id: 'PAY_TOPUP_500', amount: 500.00, status: 'Success' },
                          { id: '2', created_at: '2026-08-29T14:30:00.000Z', type: 'Debit', title: 'EV Ride Rental Fare', subtitle: 'Gotri Zone Package', transaction_id: 'RID_RENT_120', amount: 120.00, status: 'Completed' },
                          { id: '3', created_at: '2026-08-28T11:00:00.000Z', type: 'Credit', title: 'Security Deposit Add', subtitle: 'Refundable Security Deposit', transaction_id: 'PAY_DEP_250', amount: 250.00, status: 'Success' },
                          { id: '4', created_at: '2026-08-27T16:45:00.000Z', type: 'Credit', title: 'Deposit Refund Processed', subtitle: 'Razorpay Instant Refund', transaction_id: 'RFND_250_ROHIT', amount: 250.00, status: 'Success' },
                        ]).map((tx: any, idx: number) => (
                          <tr key={tx.id || idx}>
                            <td style={{ fontWeight: 700 }}>
                              {tx.created_at ? formatCleanDateTime(tx.created_at) : 'Recent'}
                            </td>
                            <td>
                              <span className={`pill-badge ${tx.type === 'Credit' ? 'pill-green' : 'pill-purple'}`}>
                                {tx.type || 'Credit'}
                              </span>
                            </td>
                            <td>
                              <div style={{ fontWeight: 700, color: '#0F172A' }}>{tx.title || 'Wallet Transaction'}</div>
                              <div style={{ fontSize: '11px', color: '#64748B' }}>{tx.subtitle || tx.payment_method || 'Razorpay'}</div>
                            </td>
                            <td style={{ fontFamily: 'monospace', fontWeight: 700 }}>
                              {tx.transaction_id || `TXN-${tx.id || idx + 1}`}
                            </td>
                            <td style={{ fontWeight: 800, color: tx.type === 'Credit' ? '#16A34A' : '#EF4444' }}>
                              {tx.type === 'Credit' ? '+' : '-'}₹{(Number(tx.amount) || 0).toFixed(2)}
                            </td>
                            <td>
                              <span className="pill-badge pill-green">{tx.status || 'Completed'}</span>
                            </td>
                            <td style={{ fontWeight: 700 }}>₹{(1250.00 + (idx * 50)).toFixed(2)}</td>
                            <td style={{ textAlign: 'center' }}>
                              <button 
                                className="rp-radial-btn" 
                                style={{ padding: '2px 6px', margin: 0 }} 
                                onClick={() => alert(`Transaction Details:\nID: ${tx.transaction_id || tx.id}\nTitle: ${tx.title}\nAmount: ₹${tx.amount}\nType: ${tx.type}\nStatus: ${tx.status || 'Success'}`)}
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
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
                    <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#0F172A' }}>Rider Verification &amp; Folder Documents</h3>
                    <p style={{ margin: '4px 0 0', fontSize: '12.5px', color: '#64748B' }}>Date-wise KYC identity proofs, rider selfie photo, licenses, and inspection records.</p>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '8px', background: kycStatus === 'Verified' ? '#DCFCE7' : '#FEF3C7', color: kycStatus === 'Verified' ? '#15803D' : '#D97706', fontWeight: 700, fontSize: '12px' }}>
                      {kycStatus === 'Verified' ? (
                        <>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                          KYC Status: Verified
                        </>
                      ) : (
                        <>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                          KYC Status: Under Review
                        </>
                      )}
                    </div>
                    {kycStatus !== 'Verified' && (
                      <button className="rp-btn-primary" style={{ background: '#16A34A', borderColor: '#16A34A', display: 'flex', alignItems: 'center', gap: '6px' }} onClick={handleOpenKycModal}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                        Approve &amp; Verify KYC
                      </button>
                    )}
                    <button className="rp-btn-outline" onClick={fetchFolderDocs}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
                      Refresh
                    </button>
                    <button className="rp-btn-primary" onClick={() => setModalType('uploadDoc')}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                      Upload to Folder
                    </button>
                  </div>
                </div>

                {loadingDocs ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>Loading folder documents...</div>
                ) : folderData.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>No documents uploaded yet.</div>
                ) : (
                  <div className="folder-container" style={{ padding: 0 }}>
                    {folderData
                      .filter((folder: any) => {
                        if (folder.folder_name === "Pre-Ride Inspection Photos" || folder.folder_name === "Post-Ride Return Inspection") {
                          return Array.isArray(folder.documents) && folder.documents.some((d: any) => d.file_path && d.file_path.trim() !== '');
                        }
                        return true;
                      })
                      .map((folder: any, fIdx: number) => (
                      <div key={fIdx} className="folder-card" style={{ marginBottom: '16px' }}>
                        <div className="folder-hdr">
                          <div className="folder-hdr-left">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                            <span>{folder.folder_name}</span>
                            <span className="folder-badge">{folder.documents?.length || 0} Files</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span className="folder-date-badge">
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                              {folder.date ? formatCleanDateTime(folder.date) : '22 Sep 2026'}
                            </span>
                            <span style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 600 }}>Active Folder</span>
                          </div>
                        </div>

                        <div className="folder-grid">
                          {folder.documents
                            ?.filter((doc: any) => {
                              if (folder.folder_name === "Pre-Ride Inspection Photos" || folder.folder_name === "Post-Ride Return Inspection") {
                                return doc.file_path && doc.file_path.trim() !== '';
                              }
                              return true;
                            })
                            .map((doc: any, dIdx: number) => (
                            <div key={dIdx} className="doc-card">
                              <div className="doc-card-thumb">
                                {doc.file_path && (doc.file_path.startsWith('http') || doc.file_path.startsWith('data:') || doc.file_path.startsWith('/')) ? (
                                  <img 
                                    src={doc.file_path} 
                                    alt={doc.doc_name} 
                                    onError={(e) => { (e.target as any).style.display = 'none'; }}
                                  />
                                ) : (
                                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                                    {doc.doc_name.toLowerCase().includes('selfie') || doc.doc_name.toLowerCase().includes('photo') ? (
                                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                                    ) : doc.doc_name.toLowerCase().includes('license') || doc.doc_name.toLowerCase().includes('aadhaar') ? (
                                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                                    ) : doc.doc_name.toLowerCase().includes('vehicle') || doc.doc_name.toLowerCase().includes('odometer') ? (
                                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1 .4-1 1v7c0 .6.4 1 1 1h1"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>
                                    ) : (
                                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                                    )}
                                    <span style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 600 }}>Verified Asset</span>
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="doc-card-tit">{doc.doc_name}</div>
                                <div className="doc-card-sub">Uploaded on: {doc.date || 'Recent'}</div>
                                {(doc.ocr_aadhaar_no || doc.ocr_number || doc.number) && (
                                  <div style={{ fontSize: '10.5px', color: '#4F46E5', fontWeight: 700, marginTop: '2px' }}>
                                    ID: {doc.ocr_aadhaar_no || doc.ocr_number || doc.number}
                                  </div>
                                )}
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                                <span className={`status-tag ${doc.status === 'Verified' ? 'verified' : 'pending'}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                                  {doc.status === 'Verified' ? (
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                                  ) : (
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                  )}
                                  {doc.status || 'Verified'}
                                </span>
                                <div style={{ display: 'flex', gap: '4px' }}>
                                  <button 
                                    className="rp-pg-btn" 
                                    style={{ width: 'auto', padding: '0 8px', fontSize: '11px', height: '24px', display: 'flex', alignItems: 'center', gap: '4px' }}
                                    onClick={() => setPreviewDoc({ ...doc, folder_name: folder.folder_name })}
                                  >
                                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                    View
                                  </button>
                                  <button 
                                    className="rp-pg-btn" 
                                    style={{ width: 'auto', padding: '0 6px', fontSize: '11px', height: '24px', display: 'flex', alignItems: 'center' }}
                                    title="Download Document"
                                    onClick={() => {
                                      triggerToast(`Downloading ${doc.doc_name}...`);
                                      if (doc.file_path && doc.file_path.startsWith('data:')) {
                                        const a = document.createElement('a');
                                        a.href = doc.file_path;
                                        a.download = `${doc.doc_name.toLowerCase().replace(/\s+/g, '_')}.png`;
                                        a.click();
                                      } else {
                                        window.open(doc.file_path || '/rohit_avatar.png', '_blank');
                                      }
                                    }}
                                  >
                                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                                  </button>
                                </div>
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
                  <button className="rp-btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '4px' }} onClick={() => { setIncidentStatusFilter(''); setIncidentTypeFilter(''); setIncidentsPage(1); }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
                    Reset Filters
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
                              <button className="rp-pg-btn" style={{ width: '24px', height: '24px', padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }} title="View Details" onClick={() => alert(`Incident Details:\nID: ${inc.id}\nType: ${inc.type}\nSeverity: ${inc.severity}\nDescription: ${inc.description}`)}>
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                              </button>
                              <button className="rp-pg-btn" style={{ width: '24px', height: '24px', padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }} title="Message Admin / Team" onClick={() => alert('Opening internal audit chat panel')}>
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                              </button>
                              <button className="rp-pg-btn" style={{ width: '24px', height: '24px', padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }} title="Resolve Incident" onClick={() => {
                                if (inc.status === 'Resolved') {
                                  alert('Incident is already resolved.');
                                  return;
                                }
                                const updated = incidents.map(i => i.id === inc.id ? { ...i, status: 'Resolved' as const } : i);
                                setIncidents(updated);
                                triggerToast(`${inc.id} status marked Resolved.`);
                              }}>
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                              </button>
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

            {activeTab === 'Ride History' && (
              <div className="rp-card">
                <div className="rp-card-hdr">
                  <div>
                    <h3 className="rp-card-tit">Ride History &amp; Booking Logs</h3>
                    <p className="rp-sub" style={{ fontSize: '11.5px', margin: '2px 0 0' }}>All historical vehicle rentals and ride bookings for this rider</p>
                  </div>
                </div>

                <div className="rp-table-wrap" style={{ border: 'none', borderRadius: 0, marginTop: 0 }}>
                  <table className="rp-table">
                    <thead>
                      <tr>
                        <th>Booking ID</th>
                        <th>Vehicle Model</th>
                        <th>Pickup Zone</th>
                        <th>Pickup Datetime</th>
                        <th>Drop Datetime</th>
                        <th>Fare Paid</th>
                        <th>Deposit Option</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {riderRides.length === 0 ? (
                        <tr>
                          <td colSpan={9} style={{ textAlign: 'center', padding: '32px', color: '#64748B' }}>
                            <div>No ride booking records found for this rider.</div>
                          </td>
                        </tr>
                      ) : (
                        riderRides.map((r, idx) => (
                          <tr key={idx} style={{ cursor: 'pointer' }} onClick={() => setSelectedBooking(r)}>
                            <td style={{ fontWeight: 700, fontFamily: 'monospace', color: '#6366F1' }}>
                              <span style={{ textDecoration: 'underline' }}>{r.reservation_id || r._id || `RID-${idx + 101}`}</span>
                            </td>
                            <td style={{ fontWeight: 700 }}>{r.vehicle_id || r.vehicle_model || 'EVM102501'}</td>
                            <td>{r.pickup_zone || riderZone}</td>
                            <td style={{ fontSize: '12px', fontWeight: 600 }}>{formatCleanDateTime(r.pickup_datetime || r.reservation_date, r.reservation_time)}</td>
                            <td style={{ fontSize: '12px', color: '#64748B' }}>{formatCleanDateTime(r.drop_datetime)}</td>
                            <td style={{ fontWeight: 800, color: '#0F172A' }}>₹{r.total_price || r.fare || '1,497.00'}</td>
                            <td style={{ fontSize: '11.5px', color: '#475569' }}>{r.deposit_option || 'Pay Later'}</td>
                            <td>
                              <span className={`pill-badge ${(r.status === 'Active Ride' || r.status === 'Ongoing') ? 'pill-green' : 'pill-purple'}`}>
                                {r.status || 'Confirmed'}
                              </span>
                            </td>
                            <td>
                              <button 
                                className="rp-btn-outline" 
                                style={{ padding: '3px 8px', fontSize: '11px', height: '24px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                                onClick={(e) => { e.stopPropagation(); setSelectedBooking(r); }}
                              >
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                Details
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'Activity' && (
              <div className="rp-card" style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', color: '#4F46E5' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: '0 0 6px 0' }}>Activity Logs</h3>
                <p style={{ fontSize: '13px', margin: 0 }}>Complete system logs of rider operations, checkins, checkouts, swaps and status updates.</p>
                <div style={{ textAlign: 'left', marginTop: '20px', borderTop: '1px solid #E2E8F0', paddingTop: '16px' }}>
                  <div className="rp-timeline">
                    <div className="rp-tl-item">
                      <span className="rp-tl-dot green" />
                      <div className="rp-tl-info">
                        <span className="rp-tl-txt">Rider Checked Out Scooter {profileData?.current_assignment?.vehicle_plate || 'GJ-06-EV-2026'}</span>
                        <span className="rp-tl-time">{profileData?.joined_on || '10 Sept 2026'}, 10:00 AM | {profileData?.current_assignment?.zone || riderZone}</span>
                      </div>
                    </div>
                    <div className="rp-tl-item">
                      <span className="rp-tl-dot blue" />
                      <div className="rp-tl-info">
                        <span className="rp-tl-txt">License and Aadhaar Verified</span>
                        <span className="rp-tl-time">{profileData?.joined_on || '10 Sept 2026'}, 04:30 PM | Verified</span>
                      </div>
                    </div>
                    <div className="rp-tl-item">
                      <span className="rp-tl-dot green" />
                      <div className="rp-tl-info">
                        <span className="rp-tl-txt">Profile Registered &amp; Approved</span>
                        <span className="rp-tl-time">{profileData?.joined_on || '10 Sept 2026'}, 02:15 PM</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Reviews' && (
              <div className="rp-card" style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', color: '#D97706' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: '0 0 6px 0' }}>Customer Reviews</h3>
                <p style={{ fontSize: '13px', margin: 0 }}>Feedback ratings received by {riderName} from delivery customers.</p>
                <div className="rp-info-list" style={{ marginTop: '20px', textAlign: 'left' }}>
                  <div style={{ padding: '12px', border: '1px solid #E2E8F0', borderRadius: '8px', background: '#FAFBFD' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                        5.0 Rating
                      </span>
                      <span style={{ fontSize: '11px', color: '#94A3B8' }}>{profileData?.joined_on || 'Recent'}</span>
                    </div>
                    <p style={{ fontSize: '12px', margin: 0, color: '#475569' }}>"Rider was polite, delivered order quickly and safely!"</p>
                  </div>
                  <div style={{ padding: '12px', border: '1px solid #E2E8F0', borderRadius: '8px', background: '#FAFBFD' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                        4.8 Rating
                      </span>
                      <span style={{ fontSize: '11px', color: '#94A3B8' }}>{profileData?.joined_on || 'Recent'}</span>
                    </div>
                    <p style={{ fontSize: '12px', margin: 0, color: '#475569' }}>"On-time delivery, good service."</p>
                  </div>
                </div>
              </div>
            )}

            {/* Copyright & version footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', borderTop: '1px solid #E2E8F0', fontSize: '11px', color: '#94A3B8', marginTop: '10px' }}>
              <span>Rider ID: {profileData?.rider_id || riderId} | Joined on: {profileData?.joined_on || '10 Sept 2026'}</span>
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
              <h3 className="rp-modal-tit">Upload to Folder</h3>
              <button className="rp-modal-close" onClick={() => setModalType(null)}>×</button>
            </div>
            <div className="rp-modal-body">
              <div className="rp-form-group">
                <label className="rp-form-lbl">Target Date Folder</label>
                <select className="rp-select" style={{ width: '100%' }} value={uploadTargetFolder} onChange={(e) => setUploadTargetFolder(e.target.value)}>
                  <option value="KYC Identity Documents">KYC Identity Documents</option>
                  <option value="Live Selfie & Biometric Verification">Live Selfie &amp; Biometric Verification</option>
                  <option value="Driving License & Agreements">Driving License &amp; Agreements</option>
                  <option value="Pre-Ride Inspection Photos">Pre-Ride Inspection Photos</option>
                  <option value="Post-Ride Return Inspection">Post-Ride Return Inspection</option>
                </select>
              </div>
              <div className="rp-form-group">
                <label className="rp-form-lbl">Document Name</label>
                <input type="text" className="rp-form-inp" placeholder="e.g. Aadhaar Card (Front), Live Selfie" value={docNameInput} onChange={(e) => setDocNameInput(e.target.value)} />
              </div>
              <div className="rp-form-group">
                <label className="rp-form-lbl">Category</label>
                <select className="rp-select" style={{ width: '100%' }} value={docCatInput} onChange={(e) => setDocCatInput(e.target.value)}>
                  <option value="Identity Proof">Identity Proof</option>
                  <option value="Live Photo">Live Photo</option>
                  <option value="Driving License">Driving License</option>
                  <option value="Contract">Rental Agreement</option>
                  <option value="Vehicle Inspection">Vehicle Inspection</option>
                  <option value="Return Inspection">Return Inspection</option>
                </select>
              </div>
              <div className="rp-form-group">
                <label className="rp-form-lbl">Document / Certificate Number (Optional)</label>
                <input type="text" className="rp-form-inp" placeholder="e.g. 5091 2280 4492" value={docNumInput} onChange={(e) => setDocNumInput(e.target.value)} />
              </div>
              <div className="rp-form-group">
                <label className="rp-form-lbl">Select File / Photo</label>
                <input 
                  type="file" 
                  accept="image/*,.pdf" 
                  className="rp-form-inp" 
                  style={{ border: '1.5px dashed #CBD5E1', padding: '10px', background: '#FAFBFD' }} 
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        setUploadDocFile(event.target?.result as string);
                        triggerToast('File selected & encoded successfully');
                      };
                      reader.readAsDataURL(file);
                    }
                  }} 
                />
                {uploadDocFile && (
                  <div style={{ marginTop: '6px', fontSize: '11px', color: '#16A34A', fontWeight: 600 }}>
                    ✓ File attached and ready for upload
                  </div>
                )}
              </div>
            </div>
            <div className="rp-modal-ft">
              <button className="rp-btn-outline" onClick={() => setModalType(null)}>Cancel</button>
              <button className="rp-btn-primary" onClick={handleUploadDoc}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>
                Upload Document
              </button>
            </div>
          </div>
        </div>
      )}

      {modalType === 'message' && (
        <div className="rp-modal-overlay">
          <div className="rp-modal-box">
            <div className="rp-modal-hdr">
              <div>
                <h3 className="rp-modal-tit" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="2.5"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                  Send WhatsApp Message to Rider
                </h3>
                <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '2px' }}>
                  Dispatches directly to rider&apos;s phone via Meta WhatsApp Cloud API
                </div>
              </div>
              <button className="rp-modal-close" onClick={() => setModalType(null)}>×</button>
            </div>
            <div className="rp-modal-body">
              <div className="rp-form-group">
                <label className="rp-form-lbl">Recipient Mobile</label>
                <input type="text" className="rp-form-inp" value={`${riderName} (${profileData?.mobile || riderMobile})`} disabled style={{ background: '#F1F5F9' }} />
              </div>
              <div className="rp-form-group">
                <label className="rp-form-lbl">Quick Templates</label>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
                  <button 
                    type="button" 
                    className="template-chip"
                    onClick={() => setMessageInput(`Hello ${riderName}, your Aadhaar KYC and registration details have been verified & approved on Evegah. You are now ready to ride!`)}
                  >
                    KYC Approved
                  </button>
                  <button 
                    type="button" 
                    className="template-chip"
                    onClick={() => setMessageInput(`Hello ${riderName}, your rental session at ${riderZone} hub is ending soon. Please return vehicle on time to avoid overtime charges.`)}
                  >
                    Ride Reminder
                  </button>
                  <button 
                    type="button" 
                    className="template-chip"
                    onClick={() => setMessageInput(`Hello ${riderName}, your security deposit refund for booking #${riderRides[0]?.reservation_id || 'RID-2026'} has been initiated. Funds will reflect in 24-48 hours.`)}
                  >
                    Deposit Refund
                  </button>
                  <button 
                    type="button" 
                    className="template-chip"
                    onClick={() => setMessageInput(`Hello ${riderName}, your vehicle is ready for pickup at ${riderZone} hub. Please present your booking ID at the counter.`)}
                  >
                    Pickup Ready
                  </button>
                </div>
              </div>
              <div className="rp-form-group">
                <label className="rp-form-lbl">Message Body</label>
                <textarea 
                  className="rp-form-inp" 
                  style={{ minHeight: '110px', resize: 'vertical', fontFamily: 'inherit' }} 
                  placeholder="Type your WhatsApp message to the rider..." 
                  value={messageInput} 
                  onChange={(e) => setMessageInput(e.target.value)} 
                />
              </div>
            </div>
            <div className="rp-modal-ft">
              <button className="rp-btn-outline" onClick={() => setModalType(null)}>Cancel</button>
              <button 
                className="rp-btn-primary" 
                style={{ background: '#25D366', borderColor: '#25D366', display: 'flex', alignItems: 'center', gap: '6px' }} 
                onClick={handleSendMessage}
                disabled={sendingWhatsApp}
              >
                {sendingWhatsApp ? (
                  <span>Sending...</span>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                    Send WhatsApp Message
                  </>
                )}
              </button>
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

      {modalType === 'updateKyc' && (
        <div className="rp-modal-overlay">
          <div className="rp-modal-box">
            <div className="rp-modal-hdr">
              <div>
                <h3 className="rp-modal-tit">Update Aadhaar KYC &amp; Profile</h3>
                <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '2px' }}>
                  Verify details from Aadhaar OCR / Registration form and approve rider KYC
                </div>
              </div>
              <button className="rp-modal-close" onClick={() => setModalType(null)}>×</button>
            </div>
            <div className="rp-modal-body">
              <div className="rp-form-group">
                <label className="rp-form-lbl">Full Name (from Aadhaar)</label>
                <input type="text" className="rp-form-inp" value={kycEditName} onChange={(e) => setKycEditName(e.target.value)} placeholder="Full Name" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="rp-form-group">
                  <label className="rp-form-lbl">Date of Birth</label>
                  <input type="text" className="rp-form-inp" value={kycEditDob} onChange={(e) => setKycEditDob(e.target.value)} placeholder="e.g. 12/03/1998" />
                </div>
                <div className="rp-form-group">
                  <label className="rp-form-lbl">Gender</label>
                  <select className="rp-select" style={{ width: '100%' }} value={kycEditGender} onChange={(e) => setKycEditGender(e.target.value)}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div className="rp-form-group">
                <label className="rp-form-lbl">Permanent Address (from Aadhaar)</label>
                <textarea className="rp-form-inp" style={{ minHeight: '52px', resize: 'vertical' }} value={kycEditAddress} onChange={(e) => setKycEditAddress(e.target.value)} placeholder="Permanent residential address as on Aadhaar" />
              </div>
              <div className="rp-form-group">
                <label className="rp-form-lbl">Present Address (Current Stay)</label>
                <textarea className="rp-form-inp" style={{ minHeight: '52px', resize: 'vertical' }} value={kycEditPresentAddress} onChange={(e) => setKycEditPresentAddress(e.target.value)} placeholder="Present / local residence address in city" />
              </div>
              <div className="rp-form-group">
                <label className="rp-form-lbl">Aadhaar Number (12-Digit)</label>
                <input type="text" className="rp-form-inp" value={kycEditAadhaar} onChange={(e) => setKycEditAadhaar(e.target.value)} placeholder="12-digit Aadhaar Number (e.g. 5091 2280 4492)" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="rp-form-group">
                  <label className="rp-form-lbl">Emergency Reference Name</label>
                  <input type="text" className="rp-form-inp" value={kycEditEmergencyName} onChange={(e) => setKycEditEmergencyName(e.target.value)} placeholder="Family / Friend Name" />
                </div>
                <div className="rp-form-group">
                  <label className="rp-form-lbl">Emergency Reference Mobile</label>
                  <input type="text" className="rp-form-inp" value={kycEditEmergencyPhone} onChange={(e) => setKycEditEmergencyPhone(e.target.value)} placeholder="10-digit mobile number" />
                </div>
              </div>
            </div>
            <div className="rp-modal-ft">
              <button className="rp-btn-outline" onClick={() => setModalType(null)}>Cancel</button>
              <button className="rp-btn-primary" style={{ background: '#16A34A', borderColor: '#16A34A', display: 'flex', alignItems: 'center', gap: '6px' }} onClick={handleUpdateKyc}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                Approve KYC
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="rp-modal-overlay">
          <div className="rp-modal-box" style={{ maxWidth: '580px' }}>
            <div className="rp-modal-hdr">
              <div>
                <h3 className="rp-modal-tit" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>Booking #{selectedBooking.reservation_id || selectedBooking._id || 'RID-001'}</span>
                  <span className={`pill-badge ${(selectedBooking.status === 'Active Ride' || selectedBooking.status === 'Ongoing') ? 'pill-green' : 'pill-purple'}`}>
                    {selectedBooking.status || 'Confirmed'}
                  </span>
                </h3>
                <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '2px' }}>
                  Reserved on {formatCleanDateTime(selectedBooking.created_at || selectedBooking.reservation_date)}
                </div>
              </div>
              <button className="rp-modal-close" onClick={() => setSelectedBooking(null)}>×</button>
            </div>
            <div className="rp-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="booking-detail-grid">
                <div className="booking-detail-item">
                  <div className="booking-detail-lbl">Customer Name</div>
                  <div className="booking-detail-val">{selectedBooking.customer_name || riderName}</div>
                </div>
                <div className="booking-detail-item">
                  <div className="booking-detail-lbl">Contact Phone</div>
                  <div className="booking-detail-val">{selectedBooking.mobile || riderMobile}</div>
                </div>
                <div className="booking-detail-item">
                  <div className="booking-detail-lbl">Vehicle Number</div>
                  <div className="booking-detail-val">{selectedBooking.vehicle_id || selectedBooking.vehicle_number || selectedBooking.vehicle_model || 'EVM102501'}</div>
                </div>
                <div className="booking-detail-item">
                  <div className="booking-detail-lbl">Battery Pack ID</div>
                  <div className="booking-detail-val">{selectedBooking.battery_id || riderBattery}</div>
                </div>
                <div className="booking-detail-item">
                  <div className="booking-detail-lbl">Pickup Zone</div>
                  <div className="booking-detail-val">{selectedBooking.pickup_zone || riderZone}</div>
                </div>
                <div className="booking-detail-item">
                  <div className="booking-detail-lbl">Package Plan</div>
                  <div className="booking-detail-val">{selectedBooking.package_type || 'Daily Standard'}</div>
                </div>
                <div className="booking-detail-item">
                  <div className="booking-detail-lbl">Pickup Datetime</div>
                  <div className="booking-detail-val">{formatCleanDateTime(selectedBooking.pickup_datetime || selectedBooking.reservation_date, selectedBooking.reservation_time)}</div>
                </div>
                <div className="booking-detail-item">
                  <div className="booking-detail-lbl">Drop Datetime</div>
                  <div className="booking-detail-val">{formatCleanDateTime(selectedBooking.drop_datetime)}</div>
                </div>
              </div>

              {/* Pricing breakdown */}
              <div style={{ background: '#FAF5FF', border: '1px solid #E9D5FF', borderRadius: '8px', padding: '12px 14px' }}>
                <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#6D28D9', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Billing &amp; Payment Summary
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#475569', marginBottom: '4px' }}>
                  <span>Rental Fare:</span>
                  <span style={{ fontWeight: 700, color: '#0F172A' }}>₹{selectedBooking.fare || selectedBooking.total_price || '1,497.00'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#475569', marginBottom: '4px' }}>
                  <span>Security Deposit:</span>
                  <span style={{ fontWeight: 700, color: '#0F172A' }}>{selectedBooking.deposit_option === 'Pay Later' ? 'Pay Later (₹0)' : `₹${selectedBooking.deposit || '2,000.00'}`}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#475569', marginBottom: '6px' }}>
                  <span>Payment Method / Status:</span>
                  <span style={{ fontWeight: 700, color: '#16A34A' }}>{selectedBooking.payment_mode || 'ICICI UPI QR'} ({selectedBooking.payment_status || 'Paid'})</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px', fontWeight: 800, color: '#2A195C', borderTop: '1px dashed #DDD6FE', paddingTop: '6px' }}>
                  <span>Total Amount:</span>
                  <span>₹{selectedBooking.total_price || selectedBooking.fare || '1,497.00'}</span>
                </div>
              </div>
            </div>
            <div className="rp-modal-ft">
              <button className="rp-btn-outline" onClick={() => setSelectedBooking(null)}>Close</button>
              <Link href="/ride-operations" className="rp-btn-primary" style={{ textDecoration: 'none' }}>
                Open in Ride Operations
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Document Preview Modal */}
      {previewDoc && (
        <div className="rp-modal-overlay">
          <div className="rp-modal-box" style={{ maxWidth: '620px' }}>
            <div className="rp-modal-hdr">
              <div>
                <h3 className="rp-modal-tit">{previewDoc.doc_name}</h3>
                <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '2px' }}>
                  {previewDoc.folder_name} | Uploaded on {previewDoc.date || 'Recent'}
                </div>
              </div>
              <button className="rp-modal-close" onClick={() => setPreviewDoc(null)}>×</button>
            </div>
            <div className="rp-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ maxHeight: '380px', minHeight: '220px', background: '#0F172A', borderRadius: '10px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {previewDoc.file_path && (previewDoc.file_path.startsWith('http') || previewDoc.file_path.startsWith('data:') || previewDoc.file_path.startsWith('/')) ? (
                  <img 
                    src={previewDoc.file_path} 
                    alt={previewDoc.doc_name} 
                    style={{ maxWidth: '100%', maxHeight: '380px', objectFit: 'contain' }}
                  />
                ) : (
                  <div style={{ color: '#fff', textAlign: 'center', padding: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#818CF8" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                    <div style={{ fontSize: '14px', fontWeight: 600 }}>{previewDoc.doc_name}</div>
                    <div style={{ fontSize: '11px', color: '#94A3B8' }}>Digital Document Record Verified on Blockchain / DB</div>
                  </div>
                )}
              </div>
              <div className="booking-detail-grid">
                <div className="booking-detail-item">
                  <div className="booking-detail-lbl">Document Type</div>
                  <div className="booking-detail-val">{previewDoc.type || 'Identity Proof'}</div>
                </div>
                <div className="booking-detail-item">
                  <div className="booking-detail-lbl">Verification Status</div>
                  <div className="booking-detail-val" style={{ color: '#16A34A' }}>✓ {previewDoc.status || 'Verified'}</div>
                </div>
                {(previewDoc.ocr_aadhaar_no || previewDoc.ocr_number || previewDoc.number) && (
                  <div className="booking-detail-item" style={{ gridColumn: 'span 2' }}>
                    <div className="booking-detail-lbl">Document Number</div>
                    <div className="booking-detail-val">{previewDoc.ocr_aadhaar_no || previewDoc.ocr_number || previewDoc.number}</div>
                  </div>
                )}
              </div>
            </div>
            <div className="rp-modal-ft">
              <button className="rp-btn-outline" onClick={() => setPreviewDoc(null)}>Close</button>
              <button 
                className="rp-btn-primary"
                onClick={() => {
                  triggerToast(`Downloading ${previewDoc.doc_name}...`);
                  if (previewDoc.file_path && previewDoc.file_path.startsWith('data:')) {
                    const a = document.createElement('a');
                    a.href = previewDoc.file_path;
                    a.download = `${previewDoc.doc_name.toLowerCase().replace(/\s+/g, '_')}.png`;
                    a.click();
                  } else {
                    window.open(previewDoc.file_path || '/rohit_avatar.png', '_blank');
                  }
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Download Document
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom feedback toast alert */}
      {toast.show && (
        <div className="rp-toast rp-toast-green" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          <span>{toast.msg}</span>
        </div>
      )}
    </>
  );
}

export default function RiderProfilePage() {
  return (
    <Suspense fallback={
      <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '24px' }}>
          <span className="skeleton-circle" style={{ width: '64px', height: '64px' }} />
          <div>
            <span className="skeleton-box" style={{ width: '180px', height: '20px' }} />
            <div style={{ marginTop: '8px' }}><span className="skeleton-box" style={{ width: '120px', height: '14px' }} /></div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} style={{ background: '#fff', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
              <span className="skeleton-box" style={{ width: '80px', height: '12px' }} />
              <div style={{ marginTop: '8px' }}><span className="skeleton-box" style={{ width: '120px', height: '20px' }} /></div>
            </div>
          ))}
        </div>
      </div>
    }>
      <RiderProfileContent />
    </Suspense>
  );
}
