"use client";
import { useState, useEffect, useRef } from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

function AnimatedCount({ value }: { value: string | number }) {
  const [displayValue, setDisplayValue] = useState<string | number>(value);

  useEffect(() => {
    const str = String(value);
    const numericMatch = str.match(/[\d.]+/g);
    if (!numericMatch) {
      setDisplayValue(value);
      return;
    }
    const numericStr = numericMatch.join('');
    const target = parseFloat(numericStr);
    if (isNaN(target)) {
      setDisplayValue(value);
      return;
    }
    let start = 0;
    const duration = 1000;
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = progress * (2 - progress);
      const current = Math.floor(start + easeProgress * (target - start));
      let formatted = String(current);
      if (str.includes('₹')) {
        formatted = '₹' + current.toLocaleString('en-IN');
      } else if (str.includes(',')) {
        formatted = current.toLocaleString('en-US');
      } else if (str.includes('%')) {
        formatted = current + '%';
      }
      setDisplayValue(formatted);
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };
    requestAnimationFrame(animate);
  }, [value]);

  return <>{displayValue}</>;
}

const CSS = `
.rep-shell { display: flex; min-height: 100vh; background: #F8FAFC; font-family: 'Inter', sans-serif; }
.rep-main { margin-left: 230px; display: flex; flex-direction: column; min-height: 100vh; width: calc(100% - 230px); }
.rep-page { flex: 1; padding: 24px; display: flex; flex-direction: column; gap: 20px; }

/* Custom top bar profile and zone switcher info */
.rep-top-info { display: flex; align-items: center; justify-content: space-between; padding: 14px 24px; background: #fff; border-bottom: 1px solid #E2E8F0; }
.rep-user-greet { display: flex; align-items: center; gap: 10px; }
.rep-user-avatar { width: 34px; height: 34px; border-radius: 50%; object-fit: cover; background: #EEF2FF; }
.rep-user-text { display: flex; flex-direction: column; }
.rep-user-name { font-size: 13.5px; font-weight: 700; color: #1E293B; }
.rep-user-role { font-size: 11.5px; color: #64748B; }

.rep-top-actions { display: flex; align-items: center; gap: 16px; }
.rep-zone-select { display: flex; align-items: center; gap: 8px; padding: 8px 14px; border: 1.5px solid #E2E8F0; border-radius: 10px; font-size: 13px; font-weight: 600; color: #334155; background: #fff; cursor: pointer; }
.rep-bell-btn { position: relative; width: 36px; height: 36px; border-radius: 50%; border: 1.5px solid #E2E8F0; display: flex; align-items: center; justify-content: center; color: #475569; background: #fff; cursor: pointer; }
.rep-bell-badge { position: absolute; top: -2px; right: -2px; width: 16px; height: 16px; border-radius: 50%; background: #2a195c; color: #fff; font-size: 9px; font-weight: 700; display: flex; align-items: center; justify-content: center; border: 2px solid #fff; }

/* Header title */
.rep-title-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-top: 4px; }
.rep-h1 { font-size: 24px; font-weight: 800; color: #0F172A; margin: 0 0 6px; letter-spacing: -0.02em; }
.rep-sub { font-size: 13.5px; color: #64748B; margin: 0; font-weight: 400; }

.rep-actions { display: flex; align-items: center; gap: 10px; }
.rep-btn { display: flex; align-items: center; gap: 7px; padding: 10px 16px; background: #fff; border: 1.5px solid #E2E8F0; border-radius: 10px; font-size: 13px; font-weight: 600; color: #475569; cursor: pointer; transition: all .15s; }
.rep-btn:hover { border-color: #2a195c; color: #2a195c; }
.rep-btn-primary { background: #2a195c; color: #fff; border-color: #2a195c; }
.rep-btn-primary:hover { background: #4338CA; border-color: #4338CA; color: #fff; }

/* Report categories tabs */
.rep-tabs-card { border-bottom: 1px solid #E2E8F0; margin-bottom: 4px; overflow-x: auto; }
.rep-tabs-list { display: flex; gap: 24px; }
.rep-tab { padding: 12px 4px 14px; font-size: 13.5px; font-weight: 600; color: #64748B; cursor: pointer; border-bottom: 2.5px solid transparent; transition: all .15s; white-space: nowrap; background: transparent; border-top: none; border-left: none; border-right: none; }
.rep-tab:hover { color: #2a195c; }
.rep-tab.active { color: #2a195c; border-color: #2a195c; font-weight: 700; }

/* Filters card */
.rep-filter-card { background: #fff; border: 1px solid #E2E8F0; border-radius: 14px; padding: 14px 16px; box-shadow: 0 1px 3px rgba(0,0,0,.02); }
.rep-filter-grid { display: grid; grid-template-columns: 1fr 1fr 1.25fr 1.5fr auto auto auto; gap: 12px; align-items: center; }
.rep-select { width: 100%; padding: 10px 14px; border: 1.5px solid #E2E8F0; border-radius: 10px; font-size: 13px; font-weight: 500; outline: none; background: #fff; color: #334155; cursor: pointer; appearance: none; -webkit-appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748B' stroke-width='2.5'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' /%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 14px center; background-size: 12px; padding-right: 36px; }
.rep-select:focus { border-color: #2a195c; }

.rep-date-picker { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 10px 14px; border: 1.5px solid #E2E8F0; border-radius: 10px; font-size: 13px; font-weight: 600; background: #fff; color: #334155; cursor: pointer; }
.rep-date-picker:hover { border-color: #2a195c; }
.rep-date-icon { color: #64748B; display: flex; align-items: center; }

.rep-filter-btn { display: flex; align-items: center; justify-content: center; width: 38px; height: 38px; background: #F1F5F9; border: 1.5px solid transparent; border-radius: 10px; font-size: 13px; color: #475569; cursor: pointer; transition: all .15s; }
.rep-filter-btn:hover { background: #E2E8F0; color: #2a195c; }

.rep-reset-btn { padding: 10px 18px; background: #fff; border: 1.5px solid #E2E8F0; border-radius: 10px; font-size: 13px; font-weight: 700; color: #64748B; cursor: pointer; transition: all .15s; }
.rep-reset-btn:hover { border-color: #EF4444; color: #EF4444; }
.rep-apply-btn { padding: 10px 20px; background: #2a195c; border: 1.5px solid #2a195c; border-radius: 10px; font-size: 13px; font-weight: 700; color: #fff; cursor: pointer; transition: all .15s; }
.rep-apply-btn:hover { background: #4338CA; border-color: #4338CA; }

/* KPI indicator row */
.rep-kpis-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; }
.rep-kpi-card { background: #fff; border: 1px solid #E2E8F0; border-radius: 14px; padding: 16px; display: flex; align-items: center; gap: 12px; box-shadow: 0 1px 3px rgba(0,0,0,.02); }
.rep-kpi-ic { width: 42px; height: 42px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.ic-purple { background: #8B5CF6; color: #fff; }
.ic-green { background: #10B981; color: #fff; }
.ic-blue { background: #3B82F6; color: #fff; }
.ic-orange { background: #F97316; color: #fff; }
.ic-red { background: #EF4444; color: #fff; }

.rep-kpi-info { display: flex; flex-direction: column; flex: 1; min-width: 0; }
.rep-kpi-lbl { font-size: 11.5px; color: #64748B; font-weight: 600; margin-bottom: 4px; }
.rep-kpi-val { font-size: 20px; font-weight: 800; color: #0F172A; line-height: 1.1; }
.rep-kpi-delta { font-size: 11.5px; margin-top: 6px; font-weight: 600; display: flex; align-items: center; gap: 3px; }
.delta-up { color: #16A34A; }
.delta-down { color: #EF4444; }
.delta-lbl { color: #94A3B8; font-weight: 400; margin-left: 2px; }

/* Charts Layout Grid */
.rep-charts-grid { display: grid; grid-template-columns: 2fr 1.2fr 1fr; gap: 16px; }
.rep-chart-card { background: #fff; border: 1px solid #E2E8F0; border-radius: 14px; padding: 16px; box-shadow: 0 1px 3px rgba(0,0,0,.02); display: flex; flex-direction: column; }
.rep-chart-hdr { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.rep-chart-tit { font-size: 14px; font-weight: 700; color: #0F172A; }

.rep-chart-viewall { font-size: 11px; font-weight: 700; color: #6366F1; text-decoration: none; cursor: pointer; }
.rep-chart-viewall:hover { text-decoration: underline; }

.rep-chart-body { display: flex; align-items: center; justify-content: center; flex: 1; min-height: 180px; }

/* Donut Legend styles */
.rep-donut-layout { display: flex; flex-direction: column; align-items: center; gap: 14px; width: 100%; }
.rep-donut-vis { position: relative; width: 120px; height: 120px; display: flex; align-items: center; justify-content: center; }
.rep-donut-center { position: absolute; text-align: center; width: 80px; }
.rep-donut-num { font-size: 13.5px; font-weight: 800; color: #1E293B; word-break: break-all; }
.rep-donut-lbl { font-size: 10px; color: #64748B; margin-top: 1px; font-weight: 500; }
.rep-donut-legend { width: 100%; display: flex; flex-direction: column; gap: 6px; }
.rep-leg-item { display: flex; align-items: center; justify-content: space-between; font-size: 11.5px; }
.rep-leg-l { display: flex; align-items: center; gap: 6px; }
.rep-leg-dot { width: 8px; height: 8px; border-radius: 50%; }
.rep-leg-name { color: #64748B; font-weight: 500; }
.rep-leg-val { font-weight: 700; color: #1E293B; }
.rep-leg-pct { color: #94A3B8; font-weight: 400; margin-left: 2px; }

/* Table styling */
.rep-tcard { background: #fff; border: 1px solid #E2E8F0; border-radius: 14px; box-shadow: 0 1px 3px rgba(0,0,0,.02); overflow: hidden; display: flex; flex-direction: column; }
.rep-tcard-hdr { display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; border-bottom: 1px solid #E2E8F0; }
.rep-tcard-tit { font-size: 14.5px; font-weight: 700; color: #1E293B; }
.rep-tbl-wrap { overflow-x: auto; }
.rep-tbl { width: 100%; border-collapse: collapse; min-width: 1000px; }
.rep-tbl th { font-size: 11px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: .06em; text-align: left; padding: 12px 16px; background: #FAFBFD; border-bottom: 1px solid #E2E8F0; }
.rep-tbl td { padding: 12px 16px; font-size: 13px; color: #334155; border-bottom: 1px solid #F1F5F9; vertical-align: middle; }
.rep-tbl tr:last-child td { border-bottom: none; }
.rep-tbl tr:hover td { background: #F8FAFC; }

.rep-tbl-strong { font-weight: 700; color: #1E293B; }

.rep-three-dots { background: none; border: none; font-size: 16px; color: #94A3B8; cursor: pointer; padding: 4px; display: inline-flex; align-items: center; justify-content: center; }
.rep-three-dots:hover { color: #2a195c; }

.rep-tcard-ft { display: flex; align-items: center; justify-content: space-between; padding: 12px 18px; border-top: 1px solid #E2E8F0; background: #FAFBFD; }
.rep-tcard-ft-lbl { font-size: 13px; color: #64748B; font-weight: 500; }
.rep-pg { display: flex; align-items: center; gap: 4px; }
.rep-pgb { width: 28px; height: 28px; border: 1.5px solid #E2E8F0; border-radius: 6px; background: #fff; font-size: 12.5px; font-weight: 700; color: #475569; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all .15s; }
.rep-pgb:hover:not(:disabled) { border-color: #2a195c; color: #2a195c; }
.rep-pgb.cur { background: #2a195c; color: #fff; border-color: #2a195c; }
.rep-pgb:disabled { opacity: 0.5; cursor: not-allowed; }

.rep-limit-select { padding: 6px 10px; border: 1.5px solid #E2E8F0; border-radius: 6px; font-size: 12px; font-weight: 600; outline: none; background: #fff; color: #475569; cursor: pointer; appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748B' stroke-width='2.5'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' /%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 8px center; background-size: 10px; padding-right: 24px; }

@keyframes drawPath {
  to { stroke-dashoffset: 0; }
}
@keyframes growBar {
  from { transform: scaleY(0); }
  to { transform: scaleY(1); }
}
@keyframes scaleIn {
  from { transform: scale(0); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
.animate-draw {
  stroke-dasharray: 200;
  stroke-dashoffset: 200;
  animation: drawPath 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
.animate-draw-large {
  stroke-dasharray: 1200;
  stroke-dashoffset: 1200;
  animation: drawPath 1.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
.animate-scale-in {
  transform-origin: center;
  animation: scaleIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
.animate-grow-bar {
  transform-origin: bottom;
  animation: growBar 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
`;

// Dynamic tab structures
interface KPI {
  label: string;
  value: string;
  delta: string;
  trend: 'up' | 'down';
  theme: 'purple' | 'green' | 'blue' | 'orange' | 'red';
  iconText: string;
  iconSvg?: React.ReactNode;
}

interface Slice {
  name: string;
  val: string;
  pct: string;
  color: string;
  dashArray: string;
  dashOffset: string;
}

interface ChartData {
  lineTitle: string;
  linePath: string;
  linePoints: { cx: number; cy: number }[];
  lineXLabels: string[];
  lineYValues: string[];
  donutTitle: string;
  donutTotal: string;
  donutSlices: Slice[];
  barTitle: string;
  barHeights: number[];
  barXLabels: string[];
}

interface TableData {
  title: string;
  headers: string[];
  rows: (string | number)[][];
}

interface TabConfig {
  subtitle: string;
  kpis: KPI[];
  charts: ChartData;
  table: TableData;
}

const TABS_CONFIG: Record<string, TabConfig> = {
  'Franchise Report': {
    subtitle: 'View and analyze franchise performance and operational insights.',
    kpis: [
      { label: 'Total Revenue (MTD)', value: '₹3,24,850', delta: '12.6%', trend: 'up', theme: 'purple', iconText: '₹' },
      { label: 'Total Rentals (MTD)', value: '1,248', delta: '9.4%', trend: 'up', theme: 'green', iconText: '', iconSvg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M17 2.1l4 4-4 4M3 21.9l-4-4 4-4" /><path d="M21 6.1H9a4 4 0 0 0-4 4v5m-2 1.8h12a4 4 0 0 0 4-4v-5" /></svg> },
      { label: 'Total Transactions (MTD)', value: '2,156', delta: '8.7%', trend: 'up', theme: 'blue', iconText: '', iconSvg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="2" y="5" width="20" height="14" rx="2" ry="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg> },
      { label: 'Total Battery Swaps (MTD)', value: '842', delta: '11.8%', trend: 'up', theme: 'orange', iconText: '', iconSvg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="1" y="6" width="18" height="12" rx="2" /><line x1="23" y1="13" x2="23" y2="11" /><polyline points="7 12 11 8 11 12 15 12" /></svg> },
      { label: 'Overdue Rentals', value: '56', delta: '5.2%', trend: 'up', theme: 'red', iconText: '', iconSvg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg> }
    ],
    charts: {
      lineTitle: 'Revenue Overview',
      linePath: 'M 10 140 Q 90 120 170 80 T 330 90 T 490 40',
      linePoints: [{ cx: 10, cy: 140 }, { cx: 90, cy: 120 }, { cx: 170, cy: 80 }, { cx: 250, cy: 95 }, { cx: 330, cy: 90 }, { cx: 410, cy: 110 }, { cx: 490, cy: 40 }],
      lineXLabels: ['14 May', '15 May', '16 May', '17 May', '18 May', '19 May', '20 May'],
      lineYValues: ['₹0', '₹25k', '₹50k', '₹75k', '₹100k'],
      donutTitle: 'Revenue by Franchise',
      donutTotal: '₹3.24L',
      donutSlices: [
        { name: 'Connaught Place', val: '₹1.24L', pct: '38.3%', color: '#2A195C', dashArray: '38.3 61.7', dashOffset: '0' },
        { name: 'Karol Bagh', val: '₹98K', pct: '30.2%', color: '#3B82F6', dashArray: '30.2 69.8', dashOffset: '-38.3' },
        { name: 'Paharganj', val: '₹76K', pct: '23.7%', color: '#EAB308', dashArray: '23.7 76.3', dashOffset: '-68.5' },
        { name: 'Rajendra Place', val: '₹24K', pct: '7.5%', color: '#10B981', dashArray: '7.5 92.5', dashOffset: '-92.2' },
        { name: 'Pragati Maidan', val: '₹840', pct: '0.3%', color: '#F97316', dashArray: '0.3 99.7', dashOffset: '-99.7' }
      ],
      barTitle: 'Rental Trend',
      barHeights: [78, 84, 94, 108, 98, 102, 115],
      barXLabels: ['14 May', '15 May', '16 May', '17 May', '18 May', '19 May', '20 May']
    },
    table: {
      title: 'Franchise Performance',
      headers: ['Franchise Name', 'Total Vehicles', 'Total Rentals', 'Total Revenue (₹)', 'Total Transactions', 'Battery Swaps', 'Utilization Rate', 'Collection %', 'Overdue Rentals'],
      rows: [
        ['Connaught Place', 160, 180, '₹1,24,560', 620, 245, '74.6%', '98.2%', 8],
        ['Karol Bagh', 152, 152, '₹98,230', 480, 190, '71.2%', '96.5%', 6],
        ['Paharganj', 120, 120, '₹76,890', 392, 152, '68.4%', '95.1%', 12],
        ['Rajendra Place', 98, 98, '₹24,450', 210, 98, '65.1%', '97.3%', 5],
        ['Pragati Maidan', 86, 86, '₹840', 54, 45, '61.3%', '94.8%', 25]
      ]
    }
  },
  'Vehicle Report': {
    subtitle: 'Track fleet utilization, vehicle statuses, and average active cycles.',
    kpis: [
      { label: 'Total Fleet Size', value: '616', delta: '5.4%', trend: 'up', theme: 'blue', iconText: '', iconSvg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg> },
      { label: 'Active Vehicles', value: '458', delta: '8.2%', trend: 'up', theme: 'green', iconText: '', iconSvg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg> },
      { label: 'Idle Vehicles', value: '122', delta: '4.1%', trend: 'down', theme: 'purple', iconText: '', iconSvg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg> },
      { label: 'Under Maintenance', value: '36', delta: '12.5%', trend: 'down', theme: 'orange', iconText: '', iconSvg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg> },
      { label: 'Avg Fleet Utilization', value: '74.8%', delta: '3.2%', trend: 'up', theme: 'purple', iconText: '', iconSvg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> }
    ],
    charts: {
      lineTitle: 'Fleet Utilization Trend (%)',
      linePath: 'M 10 120 Q 90 110 170 90 T 330 60 T 490 70',
      linePoints: [{ cx: 10, cy: 120 }, { cx: 90, cy: 110 }, { cx: 170, cy: 90 }, { cx: 250, cy: 75 }, { cx: 330, cy: 60 }, { cx: 410, cy: 80 }, { cx: 490, cy: 70 }],
      lineXLabels: ['14 May', '15 May', '16 May', '17 May', '18 May', '19 May', '20 May'],
      lineYValues: ['0%', '25%', '50%', '75%', '100%'],
      donutTitle: 'Fleet Share by Category',
      donutTotal: '616 Qty',
      donutSlices: [
        { name: 'Electric Scooter', val: '385', pct: '62.5%', color: '#2A195C', dashArray: '62.5 37.5', dashOffset: '0' },
        { name: 'Cargo EV', val: '150', pct: '24.3%', color: '#3B82F6', dashArray: '24.3 75.7', dashOffset: '-62.5' },
        { name: 'Electric Cycle', val: '81', pct: '13.2%', color: '#EAB308', dashArray: '13.2 86.8', dashOffset: '-86.8' }
      ],
      barTitle: 'Avg Distance Covered (km)',
      barHeights: [65, 72, 85, 94, 88, 92, 105],
      barXLabels: ['14 May', '15 May', '16 May', '17 May', '18 May', '19 May', '20 May']
    },
    table: {
      title: 'Vehicle Fleet Utilization',
      headers: ['Vehicle ID', 'Vehicle Number', 'Category', 'Manufacturer', 'Battery ID', 'Current SoC', 'Utilization (hrs/day)', 'Status', 'Last Active'],
      rows: [
        ['EV-SC-001', 'KA01AB1234', 'Electric Scooter', 'Evegah', 'BAT-001', '85%', '14.2 hrs', 'Available', '2 mins ago'],
        ['EV-SC-002', 'KA01AB1235', 'Electric Scooter', 'Evegah', 'BAT-002', '12%', '11.5 hrs', 'Assigned', '1 hr ago'],
        ['EV-CG-012', 'KA01CD5678', 'Cargo EV', 'Mahindra', 'BAT-089', '94%', '18.0 hrs', 'Available', 'Just Now'],
        ['EV-SC-003', 'KA01AB1236', 'Electric Scooter', 'Evegah', 'BAT-003', '0%', '0.0 hrs', 'Maintenance', '1 day ago'],
        ['EV-CY-105', 'KA01EF9012', 'Electric Cycle', 'Hero', 'BAT-156', '45%', '8.4 hrs', 'Available', '15 mins ago']
      ]
    }
  },
  'Rental Report': {
    subtitle: 'Analyze user bookings, average trip durations, and rental packages.',
    kpis: [
      { label: 'Active Rentals', value: '384', delta: '10.2%', trend: 'up', theme: 'green', iconText: '', iconSvg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
      { label: 'Completed Rentals', value: '912', delta: '7.6%', trend: 'up', theme: 'blue', iconText: '', iconSvg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> },
      { label: 'Avg Lease Period', value: '14.5 Days', delta: '0.0%', trend: 'up', theme: 'purple', iconText: '', iconSvg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
      { label: 'Booking Conversion', value: '88.4%', delta: '2.1%', trend: 'up', theme: 'orange', iconText: '', iconSvg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="10"/><path d="M16 12l-4-4-4 4M12 8v8"/></svg> },
      { label: 'Overdue Returns', value: '18', delta: '8.5%', trend: 'down', theme: 'red', iconText: '', iconSvg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg> }
    ],
    charts: {
      lineTitle: 'Booking Volume Over Time',
      linePath: 'M 10 130 Q 90 90 170 100 T 330 70 T 490 50',
      linePoints: [{ cx: 10, cy: 130 }, { cx: 90, cy: 90 }, { cx: 170, cy: 100 }, { cx: 250, cy: 80 }, { cx: 330, cy: 70 }, { cx: 410, cy: 60 }, { cx: 490, cy: 50 }],
      lineXLabels: ['14 May', '15 May', '16 May', '17 May', '18 May', '19 May', '20 May'],
      lineYValues: ['0', '200', '400', '600', '800'],
      donutTitle: 'Rental Package Share',
      donutTotal: '1,296 total',
      donutSlices: [
        { name: 'Weekly Pro', val: '585', pct: '45.2%', color: '#2A195C', dashArray: '45.2 54.8', dashOffset: '0' },
        { name: 'Monthly Starter', val: '395', pct: '30.5%', color: '#3B82F6', dashArray: '30.5 69.5', dashOffset: '-45.2' },
        { name: 'Daily Lite', val: '198', pct: '15.3%', color: '#EAB308', dashArray: '15.3 84.7', dashOffset: '-75.7' },
        { name: 'Hourly Swap', val: '118', pct: '9.0%', color: '#10B981', dashArray: '9.0 91.0', dashOffset: '-91.0' }
      ],
      barTitle: 'Rentals by Station Hub',
      barHeights: [90, 80, 75, 60, 45, 55, 65],
      barXLabels: ['CP', 'Karol Bagh', 'Paharganj', 'Rajendra Pl', 'Pragati M', 'Noida 62', 'Gurgaon']
    },
    table: {
      title: 'Rental Bookings Log',
      headers: ['Booking ID', 'Customer Name', 'Contact', 'Vehicle ID', 'Package', 'Start Date', 'Expected Return', 'Security Deposit', 'Status'],
      rows: [
        ['RID-2026-0012', 'Rohit Sharma', '+91 98765 43210', 'EV-SC-001', 'Weekly Pro', '15 Jun 2026', '22 Jun 2026', '₹1,000', 'Active Ride'],
        ['RID-2026-0011', 'Neha Gupta', '+91 91254 56789', 'EV-SC-002', 'Monthly Starter', '18 May 2026', '18 Jun 2026', '₹2,000', 'Returned'],
        ['RID-2026-0010', 'Amit Kumar', '+91 99876 54321', 'EV-CG-012', 'Monthly Business', '01 Jun 2026', '01 Jul 2026', '₹3,000', 'Active Ride'],
        ['RID-2026-0009', 'Sneha Reddy', '+91 87654 32109', 'EV-CY-105', 'Daily Lite', '19 Jun 2026', '20 Jun 2026', '₹500', 'Extend'],
        ['RID-2026-0008', 'Vikram Patel', '+91 78945 61230', 'EV-SC-004', 'Weekly Pro', '10 Jun 2026', '17 Jun 2026', '₹1,000', 'Returned']
      ]
    }
  },
  'Battery Report': {
    subtitle: 'Monitor smart IoT battery inventory, swap triggers, and temperatures.',
    kpis: [
      { label: 'Total Battery Packs', value: '850', delta: '3.8%', trend: 'up', theme: 'purple', iconText: '', iconSvg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="1" y="6" width="18" height="12" rx="2" /><line x1="23" y1="13" x2="23" y2="11" /><polyline points="7 12 11 8 11 12 15 12" /></svg> },
      { label: 'Batteries In-Use', value: '642', delta: '6.2%', trend: 'up', theme: 'green', iconText: '', iconSvg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
      { label: 'Avg Health (SoH)', value: '94.2%', delta: '0.5%', trend: 'down', theme: 'blue', iconText: '', iconSvg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
      { label: 'Batteries Charging', value: '168', delta: '2.5%', trend: 'down', theme: 'orange', iconText: '', iconSvg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> },
      { label: 'Low SoC Alerts (<20%)', value: '24', delta: '14.2%', trend: 'down', theme: 'red', iconText: '', iconSvg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg> }
    ],
    charts: {
      lineTitle: 'Daily Swap Frequency',
      linePath: 'M 10 150 Q 90 130 170 90 T 330 80 T 490 35',
      linePoints: [{ cx: 10, cy: 150 }, { cx: 90, cy: 130 }, { cx: 170, cy: 90 }, { cx: 250, cy: 95 }, { cx: 330, cy: 80 }, { cx: 410, cy: 60 }, { cx: 490, cy: 35 }],
      lineXLabels: ['14 May', '15 May', '16 May', '17 May', '18 May', '19 May', '20 May'],
      lineYValues: ['0', '100', '200', '300', '400'],
      donutTitle: 'SoH Health Ranges',
      donutTotal: '850 Packs',
      donutSlices: [
        { name: 'Excellent (>90%)', val: '619', pct: '72.8%', color: '#10B981', dashArray: '72.8 27.2', dashOffset: '0' },
        { name: 'Good (80-90%)', val: '155', pct: '18.2%', color: '#3B82F6', dashArray: '18.2 81.8', dashOffset: '-72.8' },
        { name: 'Fair (70-80%)', val: '55', pct: '6.5%', color: '#EAB308', dashArray: '6.5 93.5', dashOffset: '-91.0' },
        { name: 'Maintenance (<70%)', val: '21', pct: '2.5%', color: '#EF4444', dashArray: '2.5 97.5', dashOffset: '-97.5' }
      ],
      barTitle: 'Temperature Range Detail (°C)',
      barHeights: [74, 78, 86, 92, 85, 80, 75],
      barXLabels: ['14 May', '15 May', '16 May', '17 May', '18 May', '19 May', '20 May']
    },
    table: {
      title: 'Battery Health and SoC Diagnostics',
      headers: ['Battery ID', 'Status', 'State of Charge', 'State of Health', 'Voltage', 'Current', 'Cycles', 'Current Station', 'Last Swap'],
      rows: [
        ['BAT-450X-12340001', 'Idle', '85%', '98%', '51.2V', '2.1A', 42, 'Connaught Place', '1 hr ago'],
        ['BAT-450X-12340002', 'Assigned', '12%', '95%', '48.1V', '8.4A', 105, 'Karol Bagh', '12 mins ago'],
        ['BAT-450X-12340003', 'Charging', '94%', '99%', '53.4V', '-15.0A', 14, 'Connaught Place', '30 mins ago'],
        ['BAT-450X-12340004', 'Alert', '8%', '72%', '46.2V', '0.0A', 280, 'Paharganj', '2 days ago'],
        ['BAT-450X-12340005', 'Assigned', '45%', '91%', '49.5V', '4.2A', 198, 'Rajendra Place', '4 hrs ago']
      ]
    }
  },
  'Financial Report': {
    subtitle: 'Track revenue collections, outstanding balances, and gross margins.',
    kpis: [
      { label: 'Gross Earnings', value: '₹8,24,560', delta: '14.2%', trend: 'up', theme: 'purple', iconText: '₹' },
      { label: 'Rental Income', value: '₹5,12,340', delta: '11.5%', trend: 'up', theme: 'green', iconText: '₹' },
      { label: 'Swap Charges', value: '₹1,84,220', delta: '16.8%', trend: 'up', theme: 'blue', iconText: '₹' },
      { label: 'Refunded Deposits', value: '₹84,000', delta: '5.4%', trend: 'down', theme: 'orange', iconText: '₹' },
      { label: 'Outstanding Dues', value: '₹44,000', delta: '8.2%', trend: 'down', theme: 'red', iconText: '₹' }
    ],
    charts: {
      lineTitle: 'Revenue Collections',
      linePath: 'M 10 110 Q 90 90 170 60 T 330 80 T 490 30',
      linePoints: [{ cx: 10, cy: 110 }, { cx: 90, cy: 90 }, { cx: 170, cy: 60 }, { cx: 250, cy: 70 }, { cx: 330, cy: 80 }, { cx: 410, cy: 50 }, { cx: 490, cy: 30 }],
      lineXLabels: ['14 May', '15 May', '16 May', '17 May', '18 May', '19 May', '20 May'],
      lineYValues: ['₹0', '₹50k', '₹100k', '₹150k', '₹200k'],
      donutTitle: 'Revenue Streams Share',
      donutTotal: '₹8.24L',
      donutSlices: [
        { name: 'Rent Subscriptions', val: '₹5.12L', pct: '62.1%', color: '#2A195C', dashArray: '62.1 37.9', dashOffset: '0' },
        { name: 'Battery Swaps', val: '₹1.84L', pct: '22.3%', color: '#3B82F6', dashArray: '22.3 77.7', dashOffset: '-62.1' },
        { name: 'Penalty Fees', val: '₹87K', pct: '10.6%', color: '#EAB308', dashArray: '10.6 89.4', dashOffset: '-84.4' },
        { name: 'Security Deposits', val: '₹41K', pct: '5.0%', color: '#10B981', dashArray: '5.0 95.0', dashOffset: '-95.0' }
      ],
      barTitle: 'Refunds vs Collections',
      barHeights: [80, 85, 95, 105, 98, 100, 110],
      barXLabels: ['14 May', '15 May', '16 May', '17 May', '18 May', '19 May', '20 May']
    },
    table: {
      title: 'Financial Transactions Overview',
      headers: ['Transaction ID', 'Customer', 'Reference Type', 'Payment Mode', 'Rental Package', 'Total Amount', 'Net Tax', 'Status', 'Date'],
      rows: [
        ['TXN-2026-8890', 'Rohit Sharma', 'Booking Deposit', 'UPI', 'Weekly Pro', '₹2,500.00', '₹228.81', 'Paid', 'Today'],
        ['TXN-2026-8889', 'Neha Gupta', 'Monthly Rent', 'Card', 'Monthly Starter', '₹5,000.00', '₹762.71', 'Paid', 'Yesterday'],
        ['TXN-2026-8888', 'Mohit Singh', 'Rental Extension', 'UPI', 'Daily Lite', '₹500.00', '₹76.27', 'Paid', 'Yesterday'],
        ['TXN-2026-8887', 'Arjun Sharma', 'Deposit Refund', 'UPI', 'Weekly Pro', '-₹1,000.00', '₹0.00', 'Refunded', '2 days ago'],
        ['TXN-2026-8886', 'Swati Sharma', 'Penalty Fee', 'Cash', 'Daily Lite', '₹250.00', '₹38.14', 'Paid', '2 days ago']
      ]
    }
  },
  'Maintenance Report': {
    subtitle: 'Monitor reported breakdowns, component failures, and service resolution times.',
    kpis: [
      { label: 'Total Tickets', value: '142', delta: '6.2%', trend: 'down', theme: 'purple', iconText: '', iconSvg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
      { label: 'Pending Repairs', value: '28', delta: '12.4%', trend: 'down', theme: 'red', iconText: '', iconSvg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> },
      { label: 'In Progress', value: '14', delta: '0.0%', trend: 'up', theme: 'orange', iconText: '', iconSvg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg> },
      { label: 'Resolved Tickets', value: '100', delta: '18.6%', trend: 'up', theme: 'green', iconText: '', iconSvg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="20 6 9 17 4 12"/></svg> },
      { label: 'Spare Parts Cost', value: '₹45,200', delta: '3.4%', trend: 'down', theme: 'blue', iconText: '₹' }
    ],
    charts: {
      lineTitle: 'Reported Breakdown Issues',
      linePath: 'M 10 140 Q 90 120 170 110 T 330 90 T 490 60',
      linePoints: [{ cx: 10, cy: 140 }, { cx: 90, cy: 120 }, { cx: 170, cy: 110 }, { cx: 250, cy: 95 }, { cx: 330, cy: 90 }, { cx: 410, cy: 80 }, { cx: 490, cy: 60 }],
      lineXLabels: ['14 May', '15 May', '16 May', '17 May', '18 May', '19 May', '20 May'],
      lineYValues: ['0', '10', '20', '30', '40'],
      donutTitle: 'Component Failures',
      donutTotal: '142 Cases',
      donutSlices: [
        { name: 'Battery BMS', val: '55', pct: '38.5%', color: '#2A195C', dashArray: '38.5 61.5', dashOffset: '0' },
        { name: 'Tire Puncture', val: '40', pct: '28.2%', color: '#3B82F6', dashArray: '28.2 71.8', dashOffset: '-38.5' },
        { name: 'Brake/Cable', val: '26', pct: '18.7%', color: '#EAB308', dashArray: '18.7 81.3', dashOffset: '-66.7' },
        { name: 'GPS Sensor', val: '16', pct: '11.2%', color: '#10B981', dashArray: '11.2 88.8', dashOffset: '-85.4' },
        { name: 'Body Panel', val: '5', pct: '3.4%', color: '#F97316', dashArray: '3.4 96.6', dashOffset: '-96.6' }
      ],
      barTitle: 'Avg Resolution Time (Hours)',
      barHeights: [70, 75, 82, 90, 84, 80, 85],
      barXLabels: ['BMS', 'Brake', 'Tire', 'GPS', 'Body', 'Lights', 'Battery']
    },
    table: {
      title: 'Service Tickets Log',
      headers: ['Ticket ID', 'Vehicle ID', 'Issue Category', 'Severity', 'Reported Date', 'Assigned Tech', 'Parts Replaced', 'Cost (₹)', 'Status'],
      rows: [
        ['TKT-2026-091', 'EV-SC-003', 'Battery Overheating', 'Critical', '18 Jun 2026', 'Amit Kumar', 'BMS Module', '₹8,500', 'In Progress'],
        ['TKT-2026-090', 'EV-SC-005', 'Brake Cable Loose', 'Medium', '17 Jun 2026', 'Rajesh L.', 'Brake Cable', '₹450', 'Resolved'],
        ['TKT-2026-089', 'EV-SC-008', 'Rear Tire Puncture', 'Low', '17 Jun 2026', 'Rajesh L.', 'Rear Tube', '₹350', 'Resolved'],
        ['TKT-2026-088', 'EV-CG-012', 'GPS Module Failure', 'High', '16 Jun 2026', 'Suresh K.', 'GPS Antenna', '₹2,200', 'Pending'],
        ['TKT-2026-087', 'EV-CY-105', 'Chain Slip/Repair', 'Low', '15 Jun 2026', 'Amit Kumar', 'Chain Lubricant', '₹150', 'Resolved']
      ]
    }
  },
  'User Activity Report': {
    subtitle: 'Understand DAU/MAU trends, registered riders, and support tickets.',
    kpis: [
      { label: 'Total Registered', value: '2,850', delta: '12.6%', trend: 'up', theme: 'blue', iconText: '', iconSvg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg> },
      { label: 'Daily Active (DAU)', value: '1,450', delta: '15.4%', trend: 'up', theme: 'green', iconText: '', iconSvg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M20 8v6M23 11h-6"/></svg> },
      { label: 'Monthly Active (MAU)', value: '2,120', delta: '9.2%', trend: 'up', theme: 'purple', iconText: '', iconSvg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg> },
      { label: 'New Registrations', value: '340', delta: '8.7%', trend: 'up', theme: 'orange', iconText: '', iconSvg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg> },
      { label: 'Support Tickets', value: '64', delta: '18.2%', trend: 'down', theme: 'red', iconText: '', iconSvg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> }
    ],
    charts: {
      lineTitle: 'Daily Active Users (DAU)',
      linePath: 'M 10 130 Q 90 100 170 80 T 330 60 T 490 40',
      linePoints: [{ cx: 10, cy: 130 }, { cx: 90, cy: 100 }, { cx: 170, cy: 80 }, { cx: 250, cy: 75 }, { cx: 330, cy: 60 }, { cx: 410, cy: 55 }, { cx: 490, cy: 40 }],
      lineXLabels: ['14 May', '15 May', '16 May', '17 May', '18 May', '19 May', '20 May'],
      lineYValues: ['0', '500', '1k', '1.5k', '2k'],
      donutTitle: 'Riders by Platform',
      donutTotal: '2,850 total',
      donutSlices: [
        { name: 'Rider App (Android)', val: '1,545', pct: '54.2%', color: '#2A195C', dashArray: '54.2 45.8', dashOffset: '0' },
        { name: 'Rider App (iOS)', val: '878', pct: '30.8%', color: '#3B82F6', dashArray: '30.8 69.2', dashOffset: '-54.2' },
        { name: 'BMS Mobile App', val: '299', pct: '10.5%', color: '#EAB308', dashArray: '10.5 89.5', dashOffset: '-85.0' },
        { name: 'Admin Portal', val: '128', pct: '4.5%', color: '#10B981', dashArray: '4.5 95.5', dashOffset: '-95.5' }
      ],
      barTitle: 'Weekly Rides per User',
      barHeights: [62, 70, 78, 85, 92, 98, 106],
      barXLabels: ['1 ride', '2 rides', '3 rides', '4 rides', '5 rides', '6 rides', '7+ rides']
    },
    table: {
      title: 'Rider Activity Analytics',
      headers: ['Rider ID', 'Name', 'Contact', 'Joined Date', 'Total Rides', 'Total Distance', 'Wallet Balance', 'Status', 'Last Active'],
      rows: [
        ['RID-0081', 'Rohit Sharma', '+91 98765 43210', '10 Jan 2026', '42 rides', '384 km', '₹450.00', 'Active', '2 mins ago'],
        ['RID-0082', 'Neha Gupta', '+91 91254 56789', '15 Feb 2026', '95 rides', '812 km', '₹1,200.00', 'Active', '1 hr ago'],
        ['RID-0083', 'Amit Kumar', '+91 99876 54321', '01 Mar 2026', '12 rides', '105 km', '₹50.00', 'Idle', '1 day ago'],
        ['RID-0084', 'Swati Sharma', '+91 66654 33221', '12 Apr 2026', '2 rides', '12 km', '₹0.00', 'Inactive', '2 weeks ago'],
        ['RID-0085', 'Vikram Patel', '+91 78945 61230', '20 Apr 2026', '56 rides', '514 km', '₹620.00', 'Active', '4 hrs ago']
      ]
    }
  }
};

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('Franchise Report');

  const tabs = [
    'Franchise Report',
    'Vehicle Report',
    'Rental Report',
    'Battery Report',
    'Financial Report',
    'Maintenance Report',
    'User Activity Report'
  ];

  const currentTabConfig = TABS_CONFIG[activeTab] || TABS_CONFIG['Franchise Report'];

  const handleExportPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const config = TABS_CONFIG[activeTab] || TABS_CONFIG['Franchise Report'];

    const tableHeaderHtml = config.table.headers.map(h => `<th>${h}</th>`).join('');
    const tableRowsHtml = config.table.rows.map(row => {
      return `<tr>${row.map((cell, cidx) => {
        const isStrong = cidx === 0 || (activeTab === 'Franchise Report' && cidx === 3) || (activeTab === 'Financial Report' && cidx === 5);
        return `<td class="${isStrong ? 'strong-cell' : ''}">${cell}</td>`;
      }).join('')}</tr>`;
    }).join('');

    const kpisHtml = config.kpis.map(kpi => `
      <div class="kpi-card">
        <div class="kpi-lbl">${kpi.label}</div>
        <div class="kpi-val">${kpi.value}</div>
        <div class="kpi-delta">${kpi.delta} vs last month</div>
      </div>
    `).join('');

    const htmlContent = `
      <html>
        <head>
          <title>${activeTab} - Evegah SaaS Platform</title>
          <style>
            body { font-family: 'Inter', sans-serif; padding: 30px; color: #1E293B; background: #fff; line-height: 1.5; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #2a195c; padding-bottom: 16px; margin-bottom: 24px; }
            .logo { font-size: 22px; font-weight: 800; color: #2a195c; }
            .title-info { text-align: right; }
            .report-title { font-size: 18px; font-weight: 800; color: #0F172A; }
            .report-date { font-size: 11px; color: #64748B; margin-top: 4px; }
            .subtitle { font-size: 13px; color: #475569; margin-bottom: 20px; font-style: italic; }
            
            /* KPIs Grid */
            .kpis-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; margin-bottom: 24px; }
            .kpi-card { border: 1px solid #E2E8F0; padding: 12px; border-radius: 8px; background: #FAFBFD; text-align: center; }
            .kpi-lbl { font-size: 9.5px; color: #64748B; font-weight: 600; text-transform: uppercase; margin-bottom: 6px; }
            .kpi-val { font-size: 16px; font-weight: 800; color: #0F172A; }
            .kpi-delta { font-size: 9px; color: #10B981; margin-top: 4px; font-weight: bold; }

            /* Charts Layout */
            .charts-section { display: grid; grid-template-columns: 1.5fr 1fr; gap: 20px; margin-bottom: 24px; page-break-inside: avoid; }
            .chart-box { border: 1px solid #E2E8F0; border-radius: 8px; padding: 16px; background: #fff; }
            .chart-title { font-size: 12px; font-weight: 700; color: #0F172A; margin-bottom: 12px; border-bottom: 1px solid #F1F5F9; padding-bottom: 6px; }
            
            /* Donut Chart representation */
            .donut-layout { display: flex; align-items: center; gap: 20px; }
            .donut-vis { position: relative; width: 120px; height: 120px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
            .donut-legend { width: 100%; display: flex; flex-direction: column; gap: 6px; }
            .legend-item { display: flex; justify-content: space-between; font-size: 10.5px; }
            .legend-name { color: #64748B; }
            .legend-val { font-weight: 700; color: #1E293B; }

            /* Table Styles */
            .table-section { margin-top: 20px; }
            .table-title { font-size: 13px; font-weight: 700; color: #0F172A; margin-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; font-size: 10.5px; }
            th { background: #F8FAFC; border-bottom: 2px solid #CBD5E1; color: #475569; font-weight: 700; text-transform: uppercase; text-align: left; padding: 8px 10px; }
            td { border-bottom: 1px solid #E2E8F0; padding: 8px 10px; color: #334155; }
            tr:nth-child(even) td { background: #FAFBFD; }
            .strong-cell { font-weight: 700; color: #0F172A; }

            @media print {
              body { padding: 0; }
              .charts-section { page-break-inside: avoid; }
              table { page-break-inside: auto; }
              tr { page-break-inside: avoid; page-break-after: auto; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">Evegah</div>
            <div class="title-info">
              <div class="report-title">${activeTab}</div>
              <div class="report-date">Zone: Connaught Place Zone | Date: 20 May 2024</div>
            </div>
          </div>
          
          <div class="subtitle">${config.subtitle}</div>

          <div class="kpis-grid">
            ${kpisHtml}
          </div>

          <div class="charts-section">
            <div class="chart-box">
              <div class="chart-title">${config.charts.lineTitle}</div>
              <svg width="100%" height="150" viewBox="0 0 500 180" style="overflow: visible;">
                <line x1="0" y1="160" x2="500" y2="160" stroke="#F1F5F9" stroke-width="1" />
                <line x1="0" y1="120" x2="500" y2="120" stroke="#F1F5F9" stroke-width="1" />
                <line x1="0" y1="80" x2="500" y2="80" stroke="#F1F5F9" stroke-width="1" />
                <line x1="0" y1="40" x2="500" y2="40" stroke="#F1F5F9" stroke-width="1" />
                <line x1="0" y1="10" x2="500" y2="10" stroke="#F1F5F9" stroke-width="1" />
                
                <path d="${config.charts.linePath}" fill="none" stroke="#2A195C" stroke-width="2.5" />
                ${config.charts.linePoints.map(pt => `<circle cx="${pt.cx}" cy="${pt.cy}" r="4" fill="#fff" stroke="#2A195C" stroke-width="2" />`).join('')}
                
                ${config.charts.lineXLabels.map((lbl, idx) => `
                  <text x="${10 + idx * 80}" y="178" font-size="10.5" fill="#64748B" text-anchor="middle">${lbl}</text>
                `).join('')}
              </svg>
            </div>

            <div class="chart-box">
              <div class="chart-title">${config.charts.donutTitle}</div>
              <div class="donut-layout">
                <div class="donut-vis">
                  <svg width="120" height="120" viewBox="0 0 36 36" style="transform: rotate(-90deg); overflow: visible;">
                    ${config.charts.donutSlices.map(slice => `
                      <circle
                        cx="18"
                        cy="18"
                        r="15.91"
                        fill="transparent"
                        stroke="${slice.color}"
                        stroke-width="4.2"
                        stroke-dasharray="${slice.dashArray}"
                        stroke-dashoffset="${slice.dashOffset}"
                      />
                    `).join('')}
                  </svg>
                  <div style="position: absolute; text-align: center; width: 120px; top: 48px; left: 0; font-family: sans-serif;">
                    <div style="font-size: 13.5px; font-weight: 800; color: #1E293B;">${config.charts.donutTotal}</div>
                    <div style="font-size: 9px; color: #64748B; margin-top: 1px; font-weight: 500; text-transform: uppercase;">Total</div>
                  </div>
                </div>
                <div class="donut-legend">
                  ${config.charts.donutSlices.map(slice => `
                    <div class="legend-item">
                      <span class="legend-name">${slice.name}</span>
                      <span class="legend-val">${slice.val} (${slice.pct})</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          </div>

          <div class="table-section">
            <div class="table-title">${config.table.title}</div>
            <table>
              <thead>
                <tr>${tableHeaderHtml}</tr>
              </thead>
              <tbody>
                ${tableRowsHtml}
              </tbody>
            </table>
          </div>

          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const getKpiIconThemeClass = (theme: string) => {
    switch (theme) {
      case 'purple': return 'ic-purple';
      case 'green': return 'ic-green';
      case 'blue': return 'ic-blue';
      case 'orange': return 'ic-orange';
      case 'red': return 'ic-red';
      default: return 'ic-purple';
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="rep-shell">
        <Sidebar activePath="/reports" />
        <div className="rep-main">
          {/* Custom Top bar for user welcome & zone */}
          <div className="rep-top-info">
            <div className="rep-user-greet">
              <div className="rep-user-avatar" style={{ background: '#2a195c', color: '#fff', fontSize: '13px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: '2px' }}>
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div className="rep-user-text">
                <span className="rep-user-name">Hello, Akash 👋</span>
                <span className="rep-user-role">Zone Employee</span>
              </div>
            </div>

            <div className="rep-top-actions">
              <button className="rep-zone-select">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                Connaught Place Zone
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              <button className="rep-bell-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                <span className="rep-bell-badge">3</span>
              </button>
            </div>
          </div>

          <div className="rep-page">
            {/* Page Title */}
            <div className="rep-title-row">
              <div>
                <h1 className="rep-h1">Reports</h1>
                <p className="rep-sub">{currentTabConfig.subtitle}</p>
              </div>
              <div className="rep-actions">
                <button className="rep-btn">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2a195c" strokeWidth="2.5" style={{ marginRight: 2 }}>
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Create Custom Report
                </button>
                <button className="rep-btn">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" style={{ marginRight: 2 }}>
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  Schedule Report
                </button>
                <button className="rep-btn rep-btn-primary" onClick={handleExportPDF}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" style={{ marginRight: 2 }}>
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Export Report
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginLeft: 4 }}>
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Category tabs */}
            <div className="rep-tabs-card">
              <div className="rep-tabs-list">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    className={`rep-tab ${activeTab === tab ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Filters panel */}
            <div className="rep-filter-card">
              <div className="rep-filter-grid">
                <div>
                  <select className="rep-select" defaultValue="All Zones">
                    <option>All Zones</option>
                    <option>Connaught Place Zone</option>
                  </select>
                </div>
                <div>
                  <select className="rep-select" defaultValue="All Franchise">
                    <option>All Franchise</option>
                    <option>Connaught Place Hub</option>
                  </select>
                </div>
                <div>
                  <select className="rep-select" defaultValue="Performance Summary">
                    <option>Performance Summary</option>
                    <option>Financial Summary</option>
                  </select>
                </div>
                <button className="rep-date-picker">
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="rep-date-icon">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                    </span>
                    20 May 2024 - 20 May 2024
                  </span>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: '#64748B' }}>
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                <button className="rep-filter-btn">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" />
                    <line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" />
                    <line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" /><line x1="17" y1="16" x2="23" y2="16" />
                  </svg>
                </button>
                <button className="rep-reset-btn">Reset</button>
                <button className="rep-apply-btn">Apply Filters</button>
              </div>
            </div>

            {/* KPI Cards Row */}
            <div className="rep-kpis-grid">
              {currentTabConfig.kpis.map((kpi, idx) => (
                <div key={idx} className="rep-kpi-card">
                  <div className={`rep-kpi-ic ${getKpiIconThemeClass(kpi.theme)}`}>
                    {kpi.iconText ? (
                      <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{kpi.iconText}</span>
                    ) : (
                      kpi.iconSvg
                    )}
                  </div>
                  <div className="rep-kpi-info">
                    <span className="rep-kpi-lbl">{kpi.label}</span>
                    <span className="rep-kpi-val"><AnimatedCount value={kpi.value} /></span>
                    <span className={`rep-kpi-delta ${kpi.trend === 'up' && kpi.delta !== '0.0%' ? 'delta-up' : kpi.trend === 'down' ? 'delta-down' : ''}`} style={kpi.delta === '0.0%' ? { color: '#64748B' } : undefined}>
                      {kpi.delta !== '0.0%' && (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points={kpi.trend === 'up' ? "18 15 12 9 6 15" : "6 9 12 15 18 9"} />
                        </svg>
                      )}
                      {kpi.delta}
                      <span className="delta-lbl">vs last month</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts Row */}
            <div className="rep-charts-grid">
              {/* Chart 1: Spline chart */}
              <div className="rep-chart-card">
                <div className="rep-chart-hdr">
                  <span className="rep-chart-tit">{currentTabConfig.charts.lineTitle}</span>
                </div>
                <div className="rep-chart-body">
                  <svg width="100%" height="180" viewBox="0 0 500 180" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                    {/* Grid Lines */}
                    <line x1="0" y1="160" x2="500" y2="160" stroke="#F1F5F9" strokeWidth="1" />
                    <line x1="0" y1="120" x2="500" y2="120" stroke="#F1F5F9" strokeWidth="1" />
                    <line x1="0" y1="80" x2="500" y2="80" stroke="#F1F5F9" strokeWidth="1" />
                    <line x1="0" y1="40" x2="500" y2="40" stroke="#F1F5F9" strokeWidth="1" />
                    <line x1="0" y1="10" x2="500" y2="10" stroke="#F1F5F9" strokeWidth="1" />

                    {/* Gradient fill */}
                    <defs>
                      <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2A195C" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#2A195C" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Path Area */}
                    <path
                      d={`${currentTabConfig.charts.linePath} L 490 160 L 10 160 Z`}
                      fill="url(#purpleGrad)"
                    />

                    {/* Spline Path Line */}
                    <path
                      className="animate-draw-large"
                      d={currentTabConfig.charts.linePath}
                      fill="none"
                      stroke="#2A195C"
                      strokeWidth="2.5"
                    />

                    {/* Data Points */}
                    {currentTabConfig.charts.linePoints.map((pt, index) => (
                      <circle key={index} cx={pt.cx} cy={pt.cy} r="4.5" fill="#fff" stroke="#2A195C" strokeWidth="2.5" />
                    ))}

                    {/* Labels */}
                    {currentTabConfig.charts.lineXLabels.map((lbl, idx) => (
                      <text key={idx} x={10 + idx * 80} y="178" fontSize="10.5" fill="#64748B" textAnchor="middle">{lbl}</text>
                    ))}

                    {/* Y values */}
                    {currentTabConfig.charts.lineYValues.map((val, idx) => (
                      <text key={idx} x="-8" y={163 - idx * 37.5} fontSize="9.5" fill="#94A3B8" textAnchor="end">{val}</text>
                    ))}
                  </svg>
                </div>
              </div>

              {/* Chart 2: Donut chart */}
              <div className="rep-chart-card">
                <div className="rep-chart-hdr">
                  <span className="rep-chart-tit">{currentTabConfig.charts.donutTitle}</span>
                </div>
                <div className="rep-chart-body">
                  <div className="rep-donut-layout">
                    <div className="rep-donut-vis">
                      <svg className="animate-scale-in" width="120" height="120" viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}>
                        {currentTabConfig.charts.donutSlices.map((slice, index) => (
                          <circle
                            key={index}
                            cx="18"
                            cy="18"
                            r="15.91"
                            fill="transparent"
                            stroke={slice.color}
                            strokeWidth="4.2"
                            strokeDasharray={slice.dashArray}
                            strokeDashoffset={slice.dashOffset}
                          />
                        ))}
                      </svg>
                      <div className="rep-donut-center">
                        <div className="rep-donut-num">{currentTabConfig.charts.donutTotal}</div>
                        <div className="rep-donut-lbl">Total</div>
                      </div>
                    </div>

                    <div className="rep-donut-legend">
                      {currentTabConfig.charts.donutSlices.map((slice, index) => (
                        <div key={index} className="rep-leg-item">
                          <div className="rep-leg-l">
                            <span className="rep-leg-dot" style={{ background: slice.color }} />
                            <span className="rep-leg-name">{slice.name}</span>
                          </div>
                          <span className="rep-leg-val">{slice.val} <span className="rep-leg-pct">({slice.pct})</span></span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Chart 3: Bar chart */}
              <div className="rep-chart-card">
                <div className="rep-chart-hdr">
                  <span className="rep-chart-tit">{currentTabConfig.charts.barTitle}</span>
                  <select className="rep-limit-select" style={{ border: 'none', background: 'transparent', paddingRight: '18px', padding: '0', fontSize: '11px', fontWeight: 'bold', color: '#64748B' }}>
                    <option>Last 7 Days</option>
                  </select>
                </div>
                <div className="rep-chart-body">
                  <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '130px', borderBottom: '1px solid #E2E8F0', paddingBottom: '4px', width: '100%' }}>
                      {currentTabConfig.charts.barHeights.map((h, index) => (
                        <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '1' }}>
                          <div className="animate-grow-bar" style={{ height: `${h}px`, width: '14px', background: 'linear-gradient(180deg, #2A195C 0%, #2a195c 100%)', borderRadius: '4px 4px 0 0' }} />
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#94A3B8' }}>
                      {currentTabConfig.charts.barXLabels.map((lbl, idx) => (
                        <span key={idx} style={{ flex: '1', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={lbl}>{lbl}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance/Details Table */}
            <div className="rep-tcard">
              <div className="rep-tcard-hdr">
                <span className="rep-tcard-tit">{currentTabConfig.table.title}</span>
                <button className="rep-btn" style={{ padding: '6px 12px', fontSize: '12px' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" style={{ marginRight: 2 }}>
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Export
                </button>
              </div>

              <div className="rep-tbl-wrap">
                <table className="rep-tbl">
                  <thead>
                    <tr>
                      {currentTabConfig.table.headers.map((hdr, idx) => (
                        <th key={idx}>{hdr}</th>
                      ))}
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentTabConfig.table.rows.map((row, index) => (
                      <tr key={index}>
                        {row.map((cell, cidx) => {
                          const isStrong = cidx === 0 || (activeTab === 'Franchise Report' && cidx === 3) || (activeTab === 'Financial Report' && cidx === 5);
                          return (
                            <td key={cidx} className={isStrong ? "rep-tbl-strong" : ""}>
                              {cell}
                            </td>
                          );
                        })}
                        <td>
                          <button className="rep-three-dots" type="button">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                              <circle cx="12" cy="12" r="1" />
                              <circle cx="19" cy="12" r="1" />
                              <circle cx="5" cy="12" r="1" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              <div className="rep-tcard-ft">
                <span className="rep-tcard-ft-lbl">Showing 1 to {currentTabConfig.table.rows.length} of {currentTabConfig.table.rows.length} entries</span>
                <div className="rep-pg">
                  <button className="rep-pgb" disabled type="button">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </button>
                  <button className="rep-pgb cur" type="button">1</button>
                  <button className="rep-pgb" disabled type="button">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </div>

                <div>
                  <select className="rep-limit-select" defaultValue="10">
                    <option value="10">10 per page</option>
                    <option value="25">25 per page</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
