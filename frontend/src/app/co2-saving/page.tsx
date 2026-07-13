"use client";
import { useState, useMemo, useEffect, useRef } from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import Link from 'next/link';

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
.co-shell { display: flex; min-height: 100vh; background: #F3F4F9; font-family: 'Inter', sans-serif; }
.co-main { margin-left: 230px; display: flex; flex-direction: column; min-height: 100vh; width: calc(100% - 230px); }
.co-page { flex: 1; padding: 20px 22px 70px; display: flex; flex-direction: column; gap: 20px; }

/* Breadcrumb */
.co-bc { display: flex; align-items: center; gap: 6px; font-size: 12.5px; color: #64748B; font-weight: 500; }
.co-bc a { color: #64748B; text-decoration: none; }
.co-bc a:hover { color: #10B981; }
.co-bc-sep { color: #94A3B8; }
.co-bc-cur { color: #10B981; font-weight: 600; }

/* Header title */
.co-title-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 4px; }
.co-h1 { font-size: 22px; font-weight: 800; color: #111827; margin: 0 0 4px; letter-spacing: -0.02em; }
.co-sub { font-size: 13px; color: #6B7280; margin: 0; font-weight: 400; }

.co-actions { display: flex; align-items: center; gap: 10px; }
.co-btn { display: flex; align-items: center; gap: 7px; padding: 10px 18px; background: #fff; border: 1.5px solid #E2E8F0; border-radius: 10px; font-size: 13px; font-weight: 600; color: #475569; cursor: pointer; transition: all .15s; }
.co-btn:hover { border-color: #2a195c; color: #2a195c; }
.co-btn-primary { background: #2a195c; color: #fff; border-color: #2a195c; }
.co-btn-primary:hover { background: #1E1044; border-color: #1E1044; color: #fff; }

/* KPI Grid */
.co-stats-row { display: grid; grid-template-columns: repeat(5, 1fr); gap: 14px; }
.co-stat-card { background: #fff; border: 1px solid #E5E7EB; border-radius: 12px; padding: 15px 16px 13px; box-shadow: 0 1px 3px rgba(0,0,0,.04); display: flex; gap: 12px; align-items: center; }
.co-stat-ic { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.co-stat-info { min-width: 0; flex: 1; }
.co-stat-lbl { font-size: 11px; font-weight: 600; color: #6B7280; display: block; margin-bottom: 2px; text-transform: uppercase; letter-spacing: 0.05em; }
.co-stat-val { font-size: 22px; font-weight: 800; color: #111827; line-height: 1; margin: 4px 0; }
.co-stat-sub { font-size: 10.5px; color: #9CA3AF; margin-top: 1px; }

.ic-green { background: #10B981; color: #fff; }
.ic-emerald { background: #059669; color: #fff; }
.ic-blue { background: #3B82F6; color: #fff; }
.ic-orange { background: #F97316; color: #fff; }
.ic-purple { background: #8B5CF6; color: #fff; }

/* 3-Column Layout Grid for Row 2 */
.co-row-2-grid { display: grid; grid-template-columns: 1.15fr 0.85fr 1fr; gap: 20px; }
.co-card { background: #fff; border: 1px solid #E2E8F0; border-radius: 12px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,.02); display: flex; flex-direction: column; gap: 14px; min-height: 330px; }
.co-card-hdr { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #F1F5F9; padding-bottom: 12px; }
.co-card-tit { font-size: 12px; font-weight: 800; color: #0F172A; text-transform: uppercase; letter-spacing: 0.05em; display: flex; align-items: center; gap: 6px; }

/* Trend Chart */
.co-chart-wrap { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; position: relative; }
.co-chart-title { font-size: 11px; font-weight: 700; color: #64748B; align-self: flex-start; }

/* Donut Chart and Legend */
.co-donut-legend { display: flex; flex-direction: column; gap: 8px; width: 100%; font-size: 11px; font-weight: 600; color: #475569; margin-top: 10px; }
.co-legend-item { display: flex; align-items: center; justify-content: space-between; }
.co-legend-lbl { display: flex; align-items: center; gap: 6px; }
.co-legend-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }

/* Progress bar list */
.co-progress-list { display: flex; flex-direction: column; gap: 12px; }
.co-prog-item { display: flex; flex-direction: column; gap: 4px; }
.co-prog-labels { display: flex; justify-content: space-between; font-size: 12px; font-weight: 600; color: #374151; }
.co-prog-bar-bg { width: 100%; height: 8px; background: #F1F5F9; border-radius: 4px; overflow: hidden; }
.co-prog-bar-val { height: 100%; background: linear-gradient(90deg, #10B981, #34D399); border-radius: 4px; transition: width 0.3s; }

/* Row 3 - 2 Column Grid */
.co-row-3-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; }

/* Details Log Card */
.co-tcard { background: #fff; border: 1px solid #E2E8F0; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,.02); overflow: hidden; display: flex; flex-direction: column; }
.co-filter-bar { display: flex; align-items: center; justify-content: space-between; padding: 14px 20px; background: #fff; border-bottom: 1px solid #E2E8F0; gap: 12px; }
.co-search-wrap { position: relative; width: 240px; }
.co-search-inp { width: 100%; padding: 8px 12px 8px 32px; border: 1.5px solid #E2E8F0; border-radius: 8px; font-size: 12.5px; outline: none; }
.co-search-inp:focus { border-color: #2a195c; }
.co-search-ic { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: #94A3B8; display: flex; align-items: center; }
.co-select { padding: 8px 12px; border: 1.5px solid #E2E8F0; border-radius: 8px; font-size: 12.5px; outline: none; background: #fff; cursor: pointer; }
.co-select:focus { border-color: #2a195c; }

.co-table-wrap { overflow-x: auto; width: 100%; }
.co-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 12.5px; }
.co-table th { font-size: 11px; font-weight: 700; color: #9CA3AF; text-transform: uppercase; letter-spacing: .06em; padding: 12px 16px; background: #FAFBFD; border-bottom: 1px solid #E2E8F0; }
.co-table td { padding: 12px 16px; color: #111827; border-bottom: 1px solid #F3F4F6; }
.co-table tr:hover td { background: #FAFBFC; }

.pill-verified { background: #DCFCE7; color: #16A34A; padding: 3px 8px; border-radius: 20px; font-size: 11px; font-weight: 700; }
.pill-pending { background: #FEF3C7; color: #D97706; padding: 3px 8px; border-radius: 20px; font-size: 11px; font-weight: 700; }

.co-footer-bar { display: flex; align-items: center; justify-content: space-between; padding: 12px 20px; border-top: 1px solid #E2E8F0; background: #fff; font-size: 12px; }
.co-pagination { display: flex; align-items: center; gap: 4px; }
.co-pg-btn { width: 28px; height: 28px; border: 1px solid #E2E8F0; border-radius: 6px; background: #fff; font-size: 12px; font-weight: 550; color: #6B7280; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all .12s; }
.co-pg-btn:hover:not(:disabled) { border-color: #2a195c; color: #2a195c; }
.co-pg-btn.active { background: #2a195c; color: #fff; border-color: #2a195c; font-weight: 600; }
.co-pg-btn:disabled { opacity: 0.5; cursor: not-allowed; }

/* Environmental Impact Card */
.co-env-card { background: linear-gradient(135deg, #2a195c 0%, #15803D 100%); color: #fff; border-radius: 12px; padding: 20px; box-shadow: 0 4px 12px rgba(42, 25, 92, 0.15); display: flex; flex-direction: column; justify-content: space-between; min-height: 350px; position: relative; overflow: hidden; }
.co-env-card::before { content: ''; position: absolute; top: -50%; right: -50%; width: 200px; height: 200px; background: rgba(255, 255, 255, 0.03); border-radius: 50%; pointer-events: none; }
.co-env-hdr { border-bottom: 1px solid rgba(255, 255, 255, 0.15); padding-bottom: 10px; margin-bottom: 10px; }
.co-env-tit { font-size: 12px; font-weight: 850; letter-spacing: 0.05em; text-transform: uppercase; color: #E8F5E9; }
.co-env-graphic { display: flex; justify-content: center; align-items: center; margin: 5px 0; position: relative; }
.co-env-pulse { position: absolute; width: 90px; height: 90px; border-radius: 50%; background: rgba(52, 211, 153, 0.1); animation: co-pulse 2s infinite ease-in-out; }
.co-env-stats { display: flex; flex-direction: column; gap: 8px; z-index: 10; }
.co-env-stat { display: flex; align-items: center; gap: 10px; font-size: 11.5px; font-weight: 500; }
.co-env-bullet { font-size: 14px; color: #34D399; font-weight: bold; }
.co-env-footer { margin-top: 14px; font-size: 11px; text-align: center; color: rgba(255,255,255,0.85); font-style: italic; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 10px; }

/* Toast */
.co-toast { position: fixed; bottom: 24px; right: 24px; background: #0F172A; color: #fff; padding: 12px 20px; border-radius: 10px; display: flex; align-items: center; gap: 10px; font-size: 12.5px; font-weight: 600; z-index: 300; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.3); animation: co-slideup 0.25s cubic-bezier(0.16, 1, 0.3, 1); border-left: 4px solid #10B981; }

@keyframes co-pulse {
  0% { transform: scale(0.9); opacity: 0.3; }
  50% { transform: scale(1.1); opacity: 0.6; }
  100% { transform: scale(0.9); opacity: 0.3; }
}

@keyframes co-slideup { from { transform: translateY(12px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

/* Print Media queries */
@media print {
  body { background: #fff; color: #000; }
  .ev-sb, .ev-tb, .co-actions, .co-bc, .co-filter-bar, .co-footer-bar, .co-pg-btn { display: none !important; }
  .co-main { margin-left: 0 !important; width: 100% !important; }
  .co-page { padding: 0 !important; }
  .co-card, .co-tcard, .co-stat-card { border: none !important; box-shadow: none !important; }
  .co-stats-row { grid-template-columns: repeat(5, 1fr) !important; }
  .co-row-2-grid { grid-template-columns: 1.15fr 0.85fr 1fr !important; }
  .co-row-3-grid { grid-template-columns: 2fr 1fr !important; }
}
@keyframes drawPath {
  to { stroke-dashoffset: 0; }
}
@keyframes scaleIn {
  from { transform: scale(0); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
.animate-draw {
  stroke-dasharray: 600;
  stroke-dashoffset: 600;
  animation: drawPath 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
.animate-scale-in {
  transform-origin: center;
  animation: scaleIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
`;

interface CarbonLog {
  date: string;
  vehicleCount: number;
  swaps: number;
  distance: string;
  fuelSaved: number;
  co2Saved: number;
  status: 'Verified' | 'Pending';
}

const INITIAL_LOGS: CarbonLog[] = [
  { date: '20 May 2026', vehicleCount: 84, swaps: 342, distance: '5,840 km', fuelSaved: 264, co2Saved: 618, status: 'Verified' },
  { date: '19 May 2026', vehicleCount: 82, swaps: 330, distance: '5,680 km', fuelSaved: 258, co2Saved: 604, status: 'Verified' },
  { date: '18 May 2026', vehicleCount: 79, swaps: 312, distance: '5,290 km', fuelSaved: 241, co2Saved: 563, status: 'Verified' },
  { date: '17 May 2026', vehicleCount: 85, swaps: 350, distance: '6,120 km', fuelSaved: 278, co2Saved: 651, status: 'Verified' },
  { date: '16 May 2026', vehicleCount: 75, swaps: 298, distance: '5,010 km', fuelSaved: 227, co2Saved: 532, status: 'Verified' },
  { date: '15 May 2026', vehicleCount: 78, swaps: 306, distance: '5,180 km', fuelSaved: 235, co2Saved: 550, status: 'Verified' },
  { date: '14 May 2026', vehicleCount: 70, swaps: 280, distance: '4,850 km', fuelSaved: 220, co2Saved: 515, status: 'Verified' },
];

export default function Co2SavingPage() {
  const [logs, setLogs] = useState<CarbonLog[]>(INITIAL_LOGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState<{ show: boolean; msg: string }>({ show: false, msg: '' });
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('monthly');

  const triggerToast = (msg: string) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: '' }), 3000);
  };

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchSearch = searchQuery === '' || log.date.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === '' || log.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [logs, searchQuery, statusFilter]);

  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * 5;
    return filteredLogs.slice(start, start + 5);
  }, [filteredLogs, currentPage]);

  const totalPages = Math.ceil(filteredLogs.length / 5) || 1;

  // Stats calculation
  const totalCo2Saved = useMemo(() => logs.reduce((acc, l) => acc + l.co2Saved, 154820), [logs]);
  const totalTreesPlanted = Math.round(totalCo2Saved / 25);
  const totalCarsOffRoad = Math.round(totalCo2Saved / 4100);
  const totalFuelSaved = useMemo(() => logs.reduce((acc, l) => acc + l.fuelSaved, 65880), [logs]);
  const totalSwaps = 12854;

  const chartData = useMemo(() => {
    switch (timeframe) {
      case 'daily':
        return {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
          points: [
            { x: 20, y: 110, val: '520 kg' },
            { x: 72, y: 95, val: '580 kg' },
            { x: 124, y: 100, val: '550 kg' },
            { x: 176, y: 80, val: '640 kg' },
            { x: 228, y: 70, val: '680 kg' },
            { x: 280, y: 55, val: '750 kg' }
          ],
          path: "M 20 110 L 72 95 L 124 100 L 176 80 L 228 70 L 280 55",
          areaPath: "M 20 130 L 20 110 L 72 95 L 124 100 L 176 80 L 228 70 L 280 55 L 280 130 Z",
          yMin: '0', yMid: '400', yMax: '800'
        };
      case 'weekly':
        return {
          labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6'],
          points: [
            { x: 20, y: 100, val: '3.1k kg' },
            { x: 72, y: 90, val: '3.5k kg' },
            { x: 124, y: 80, val: '3.9k kg' },
            { x: 176, y: 65, val: '4.5k kg' },
            { x: 228, y: 50, val: '5.2k kg' },
            { x: 280, y: 35, val: '5.8k kg' }
          ],
          path: "M 20 100 L 72 90 L 124 80 L 176 65 L 228 50 L 280 35",
          areaPath: "M 20 130 L 20 100 L 72 90 L 124 80 L 176 65 L 228 50 L 280 35 L 280 130 Z",
          yMin: '0', yMid: '3k', yMax: '6k'
        };
      case 'monthly':
      default:
        return {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          points: [
            { x: 20, y: 90, val: '1,250 kg' },
            { x: 72, y: 100, val: '1,150 kg' },
            { x: 124, y: 85, val: '1,350 kg' },
            { x: 176, y: 65, val: '1,650 kg' },
            { x: 228, y: 50, val: '1,850 kg' },
            { x: 280, y: 40, val: '2,100 kg' }
          ],
          path: "M 20 90 L 72 100 L 124 85 L 176 65 L 228 50 L 280 40",
          areaPath: "M 20 130 L 20 90 L 72 100 L 124 85 L 176 65 L 228 50 L 280 40 L 280 130 Z",
          yMin: '0', yMid: '1.2k', yMax: '2.4k'
        };
    }
  }, [timeframe]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="co-shell">
        <Sidebar activePath="/co2-saving" />
        <div className="co-main">
          <TopBar title="CO2 Saving" subtitle="Dashboard > Reports > CO2 Saving" />
          <div className="co-page">
            {/* Breadcrumb */}
            <div className="co-bc">
              <Link href="/">Dashboard</Link>
              <span className="co-bc-sep">/</span>
              <span className="co-bc-sep">Reports</span>
              <span className="co-bc-sep">/</span>
              <span className="co-bc-cur">CO2 Saving</span>
            </div>

            {/* Title & Actions */}
            <div className="co-title-row">
              <div>
                <h1 className="co-h1">CO2 Saving Dashboard</h1>
                <p className="co-sub">Track real-time environmental impact, carbon offsets, and equivalent ecological parameters.</p>
              </div>
              <div className="co-actions">
                <button className="co-btn" onClick={handlePrint}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  Export Report
                </button>
                <button className="co-btn-primary co-btn" onClick={() => {
                  const newDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
                  const newLog: CarbonLog = {
                    date: newDate,
                    vehicleCount: 88,
                    swaps: 360,
                    distance: '6,450 km',
                    fuelSaved: 293,
                    co2Saved: 686,
                    status: 'Verified'
                  };
                  setLogs([newLog, ...logs]);
                  setCurrentPage(1);
                  triggerToast(`Log entry added for ${newDate}!`);
                }}>
                  + Add Daily Entry
                </button>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="co-stats-row">
              <div className="co-stat-card">
                <div className="co-stat-ic ic-green">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 21 3c-1 5.5-2.5 7.5-6.1 11.8A7 7 0 0 1 11 20z"/>
                    <path d="M9 11l3 3"/>
                  </svg>
                </div>
                <div className="co-stat-info">
                  <span className="co-stat-lbl">Total CO2 Saved</span>
                  <div className="co-stat-val"><AnimatedCount value={totalCo2Saved.toLocaleString()} /> kg</div>
                  <div className="co-stat-sub">Carbon offset YTD</div>
                </div>
              </div>
              
              <div className="co-stat-card">
                <div className="co-stat-ic ic-emerald">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22v-8M9 18l3-3 3 3M12 14c2.8-1 4.5-3 4.5-6S14 3 12 3s-4.5 2-4.5 5 1.7 5 4.5 6z" />
                  </svg>
                </div>
                <div className="co-stat-info">
                  <span className="co-stat-lbl">Trees Equivalent</span>
                  <div className="co-stat-val"><AnimatedCount value={totalTreesPlanted.toLocaleString()} /></div>
                  <div className="co-stat-sub">Yearly tree absorption</div>
                </div>
              </div>

              <div className="co-stat-card">
                <div className="co-stat-ic ic-blue">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                    <circle cx="7" cy="17" r="2" />
                    <circle cx="17" cy="17" r="2" />
                    <path d="M13 17H9" />
                  </svg>
                </div>
                <div className="co-stat-info">
                  <span className="co-stat-lbl">Cars Off Road</span>
                  <div className="co-stat-val"><AnimatedCount value={totalCarsOffRoad} /></div>
                  <div className="co-stat-sub">Passenger car emissions/yr</div>
                </div>
              </div>

              <div className="co-stat-card">
                <div className="co-stat-ic ic-orange">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 22V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v18" />
                    <path d="M17 22h4v-7a3 3 0 0 0-3-3h-1" />
                    <path d="M9 22h2" />
                    <rect x="6" y="5" width="8" height="5" />
                    <circle cx="19.5" cy="9.5" r="1.5" />
                  </svg>
                </div>
                <div className="co-stat-info">
                  <span className="co-stat-lbl">Fuel Avoided</span>
                  <div className="co-stat-val"><AnimatedCount value={totalFuelSaved.toLocaleString()} /> L</div>
                  <div className="co-stat-sub">Petrol/Diesel offset</div>
                </div>
              </div>

              <div className="co-stat-card">
                <div className="co-stat-ic ic-purple">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                  </svg>
                </div>
                <div className="co-stat-info">
                  <span className="co-stat-lbl">Swaps Contributed</span>
                  <div className="co-stat-val"><AnimatedCount value={totalSwaps.toLocaleString()} /></div>
                  <div className="co-stat-sub">Battery swaps logged</div>
                </div>
              </div>
            </div>

            {/* Row 2: 3-Column Layout Grid */}
            <div className="co-row-2-grid">
              {/* Card 1: Trend line chart */}
              <div className="co-card">
                <div className="co-card-hdr">
                  <h3 className="co-card-tit">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M3 3v18h18"/><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/></svg>
                    CO2 Saved Trend
                  </h3>
                  <select 
                    className="co-select" 
                    style={{ padding: '4px 8px', fontSize: '11.5px', height: '28px' }}
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value as any)}
                  >
                    <option value="daily">Daily View</option>
                    <option value="weekly">Weekly View</option>
                    <option value="monthly">Monthly View</option>
                  </select>
                </div>
                <div className="co-chart-wrap">
                  <span className="co-chart-title">CO2 Saved Over Time (kg)</span>
                  <svg width="100%" height="200" viewBox="0 0 300 150" style={{ overflow: 'visible', marginTop: '20px' }}>
                    <defs>
                      <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    {/* Grid Lines */}
                    <line x1="20" y1="10" x2="280" y2="10" stroke="#F1F5F9" strokeWidth="1" />
                    <line x1="20" y1="40" x2="280" y2="40" stroke="#F1F5F9" strokeWidth="1" />
                    <line x1="20" y1="70" x2="280" y2="70" stroke="#F1F5F9" strokeWidth="1" />
                    <line x1="20" y1="100" x2="280" y2="100" stroke="#F1F5F9" strokeWidth="1" />
                    <line x1="20" y1="130" x2="280" y2="130" stroke="#CBD5E1" strokeWidth="1.5" />

                    {/* Gradient Area under spline curve */}
                    <path className="animate-scale-in" d={chartData.areaPath} fill="url(#areaGrad)" />

                    {/* Trend Line */}
                    <path className="animate-draw" d={chartData.path} fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" />

                    {/* Dots & Labels */}
                    {chartData.points.map((p, i) => (
                      <g key={i}>
                        <circle cx={p.x} cy={p.y} r="4" fill="#fff" stroke="#10B981" strokeWidth="2.2" />
                        <text x={p.x} y={p.y - 10} fontSize="7.5" fill="#10B981" fontWeight="bold" textAnchor="middle">{p.val}</text>
                      </g>
                    ))}

                    {/* X-axis labels */}
                    {chartData.labels.map((lbl, i) => (
                      <text key={i} x={chartData.points[i].x} y="145" fontSize="8.5" fill="#64748B" textAnchor="middle" fontWeight="600">{lbl}</text>
                    ))}

                    {/* Y-axis labels */}
                    <text x="15" y="12" fontSize="7.5" fill="#94A3B8" textAnchor="end" fontWeight="600">{chartData.yMax}</text>
                    <text x="15" y="72" fontSize="7.5" fill="#94A3B8" textAnchor="end" fontWeight="600">{chartData.yMid}</text>
                    <text x="15" y="132" fontSize="7.5" fill="#94A3B8" textAnchor="end" fontWeight="600">{chartData.yMin}</text>
                  </svg>
                </div>
              </div>

              {/* Card 2: Donut Chart with Center Sum */}
              <div className="co-card">
                <div className="co-card-hdr">
                  <h3 className="co-card-tit">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
                    Saved by Source
                  </h3>
                </div>
                <div className="co-chart-wrap">
                  <svg width="130" height="130" viewBox="0 0 36 36" style={{ overflow: 'visible' }}>
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#F1F5F9" strokeWidth="3.2" />
                    {/* Rides Segment - Green 60% */}
                    <circle className="animate-scale-in" cx="18" cy="18" r="15.915" fill="none" stroke="#10B981" strokeWidth="3.2" strokeDasharray="60 40" strokeDashoffset="25" strokeLinecap="round" style={{ transformOrigin: '18px 18px' }} />
                    {/* Hub operations Segment - Blue 25% */}
                    <circle className="animate-scale-in" cx="18" cy="18" r="15.915" fill="none" stroke="#2563EB" strokeWidth="3.2" strokeDasharray="25 75" strokeDashoffset="-35" strokeLinecap="round" style={{ transformOrigin: '18px 18px' }} />
                    {/* Solar Segment - Orange 15% */}
                    <circle className="animate-scale-in" cx="18" cy="18" r="15.915" fill="none" stroke="#EA580C" strokeWidth="3.2" strokeDasharray="15 85" strokeDashoffset="-60" strokeLinecap="round" style={{ transformOrigin: '18px 18px' }} />
                    
                    {/* Center text rendering total */}
                    <text x="18" y="17.5" fontSize="3.8" fill="#111827" fontWeight="800" textAnchor="middle">154,820</text>
                    <text x="18" y="21" fontSize="1.8" fill="#6B7280" fontWeight="600" textAnchor="middle" letterSpacing="0.02em">kg SAVED</text>
                  </svg>

                  <div className="co-donut-legend">
                    <div className="co-legend-item">
                      <span className="co-legend-lbl">
                        <span className="co-legend-dot" style={{ background: '#10B981' }}></span>
                        Rides
                      </span>
                      <span>60%</span>
                    </div>
                    <div className="co-legend-item">
                      <span className="co-legend-lbl">
                        <span className="co-legend-dot" style={{ background: '#2563EB' }}></span>
                        Hub Ops
                      </span>
                      <span>25%</span>
                    </div>
                    <div className="co-legend-item">
                      <span className="co-legend-lbl">
                        <span className="co-legend-dot" style={{ background: '#EA580C' }}></span>
                        Solar Swap
                      </span>
                      <span>15%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: Zone distribution */}
              <div className="co-card">
                <div className="co-card-hdr">
                  <h3 className="co-card-tit">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"/><circle cx="12" cy="10" r="3"/></svg>
                    Zone Distribution
                  </h3>
                </div>
                <div className="co-progress-list" style={{ marginTop: '10px' }}>
                  <div className="co-prog-item">
                    <div className="co-prog-labels">
                      <span>Palika Bazaar, CP Hub</span>
                      <span>85% (131,597 kg)</span>
                    </div>
                    <div className="co-prog-bar-bg">
                      <div className="co-prog-bar-val" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  
                  <div className="co-prog-item">
                    <div className="co-prog-labels">
                      <span>Karol Bagh Hub</span>
                      <span>62% (95,988 kg)</span>
                    </div>
                    <div className="co-prog-bar-bg">
                      <div className="co-prog-bar-val" style={{ width: '62%', background: 'linear-gradient(90deg, #10B981, #60A5FA)' }}></div>
                    </div>
                  </div>

                  <div className="co-prog-item">
                    <div className="co-prog-labels">
                      <span>Jantar Mantar Station</span>
                      <span>45% (69,669 kg)</span>
                    </div>
                    <div className="co-prog-bar-bg">
                      <div className="co-prog-bar-val" style={{ width: '45%', background: 'linear-gradient(90deg, #10B981, #FBBF24)' }}></div>
                    </div>
                  </div>

                  <div className="co-prog-item">
                    <div className="co-prog-labels">
                      <span>Raja Garden Station</span>
                      <span>30% (46,446 kg)</span>
                    </div>
                    <div className="co-prog-bar-bg">
                      <div className="co-prog-bar-val" style={{ width: '30%', background: 'linear-gradient(90deg, #10B981, #F87171)' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 3: 2-Column Grid */}
            <div className="co-row-3-grid">
              
              {/* Details table left */}
              <div className="co-tcard">
                <div className="co-filter-bar">
                  <h3 className="co-card-tit" style={{ borderBottom: 'none', paddingBottom: 0 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                    CO2 Saving Details Log
                  </h3>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <div className="co-search-wrap">
                      <span className="co-search-ic">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                      </span>
                      <input
                        type="text"
                        className="co-search-inp"
                        placeholder="Search log date..."
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                      />
                    </div>
                    <select className="co-select" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}>
                      <option value="">All Statuses</option>
                      <option value="Verified">Verified</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>
                </div>

                <div className="co-table-wrap">
                  <table className="co-table">
                    <thead>
                      <tr>
                        <th>Log Date</th>
                        <th>Fleet Size</th>
                        <th>Swaps</th>
                        <th>Distance</th>
                        <th>Fuel Saved</th>
                        <th>CO2 Offset</th>
                        <th>Status</th>
                        <th style={{ textAlign: 'center' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedLogs.length === 0 ? (
                        <tr>
                          <td colSpan={8} style={{ textAlign: 'center', padding: '24px', color: '#64748B' }}>
                            No logs matched your criteria.
                          </td>
                        </tr>
                      ) : (
                        paginatedLogs.map((log, idx) => (
                          <tr key={idx}>
                            <td style={{ fontWeight: 700 }}>{log.date}</td>
                            <td style={{ fontWeight: 600 }}>{log.vehicleCount} Vehicles</td>
                            <td>{log.swaps} swaps</td>
                            <td style={{ fontWeight: 600 }}>{log.distance}</td>
                            <td style={{ color: '#E65100', fontWeight: 700 }}>{log.fuelSaved} L</td>
                            <td style={{ color: '#2E7D32', fontWeight: 800 }}>{log.co2Saved} kg</td>
                            <td>
                              <span className={log.status === 'Verified' ? 'pill-verified' : 'pill-pending'}>
                                {log.status}
                              </span>
                            </td>
                            <td>
                              <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                                <button className="co-pg-btn" style={{ width: '26px', height: '26px', padding: 0 }} title="Inspect Audit Log" onClick={() => alert(`CO2 Audit Info:\nDate: ${log.date}\nFuel Saved: ${log.fuelSaved} L\nCO2 Saved: ${log.co2Saved} kg\nAudit Factor: 2.34 kg CO2/L offset`)}>
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                </button>
                                <button className="co-pg-btn" style={{ width: '26px', height: '26px', padding: 0 }} title="Recalculate Audit" onClick={() => triggerToast(`Re-audit completed for ${log.date}`)}>
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="co-footer-bar">
                  <span>Showing {(currentPage - 1) * 5 + 1} to {Math.min(currentPage * 5, filteredLogs.length)} of {filteredLogs.length} entries</span>
                  <div className="co-pagination">
                    <button className="co-pg-btn" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                    </button>
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button key={i} className={`co-pg-btn ${currentPage === i + 1 ? 'active' : ''}`} onClick={() => setCurrentPage(i + 1)}>
                        {i + 1}
                      </button>
                    ))}
                    <button className="co-pg-btn" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Environmental Impact globe graphics card right */}
              <div className="co-env-card">
                <div className="co-env-hdr">
                  <h4 className="co-env-tit">Environmental Impact Overview</h4>
                </div>
                
                <div className="co-env-graphic">
                  <div className="co-env-pulse"></div>
                  {/* High quality clean vector wireframe Earth Globe */}
                  <svg width="74" height="74" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="1.5" style={{ zIndex: 10 }}>
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    <path d="M2 12h20M3.6 9h16.8M3.6 15h16.8" />
                  </svg>
                </div>

                <div className="co-env-stats">
                  <div className="co-env-stat">
                    <span className="co-env-bullet">✦</span>
                    <span>Prevents <b>6.2M km</b> of passenger gasoline driving.</span>
                  </div>
                  <div className="co-env-stat">
                    <span className="co-env-bullet">✦</span>
                    <span>Supports daily oxygen needs of <b>12,480 people</b>.</span>
                  </div>
                  <div className="co-env-stat">
                    <span className="co-env-bullet">✦</span>
                    <span>Partners with <b>GreenVolt</b> for battery recycling.</span>
                  </div>
                </div>

                <div className="co-env-footer">
                  "Every battery swap drives zero-emission logistics."
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>

      {toast.show && (
        <div className="co-toast">
          <span>🔔</span>
          <span>{toast.msg}</span>
        </div>
      )}
    </>
  );
}
