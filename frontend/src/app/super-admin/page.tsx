"use client";
import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
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
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

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
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

.ev-shell {
  display: flex;
  min-height: 100vh;
  background: #F8FAFC;
  font-family: 'Plus Jakarta Sans', sans-serif;
  color: #0F172A;
}

.ev-main {
  margin-left: 230px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: calc(100% - 230px);
  min-width: 0;
}

.ev-body {
  padding: 20px 24px 60px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Custom Super Admin Top Bar */
.sa-tb {
  height: 70px;
  background: #fff;
  border-bottom: 1px solid #E2E8F0;
  display: flex;
  align-items: center;
  padding: 0 24px;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 90;
}

.sa-tb-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.sa-tb-hamburger {
  width: 36px;
  height: 36px;
  border: 1.5px solid #E2E8F0;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  cursor: pointer;
  background: #fff;
}

.sa-tb-hamburger span {
  display: block;
  width: 14px;
  height: 1.8px;
  background: #64748B;
  border-radius: 2px;
}

.sa-tb-greeting {
  display: flex;
  flex-direction: column;
}

.sa-tb-welcome {
  font-size: 11.5px;
  color: #64748B;
  font-weight: 500;
}

.sa-tb-title-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.sa-tb-user-title {
  font-size: 16px;
  font-weight: 800;
  color: #0F172A;
  font-family: 'Outfit', sans-serif;
}

.sa-tb-check {
  width: 15px;
  height: 15px;
  background: #22C55E;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 9px;
  font-weight: bold;
}

.sa-tb-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.sa-tb-zone-select {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border: 1.5px solid #E2E8F0;
  border-radius: 10px;
  background: #fff;
  cursor: pointer;
  font-size: 12.5px;
  font-weight: 600;
  color: #334155;
  transition: all 0.15s;
}

.sa-tb-zone-select:hover {
  border-color: #6366F1;
}

.sa-tb-bell {
  width: 38px;
  height: 38px;
  border: 1.5px solid #E2E8F0;
  border-radius: 10px;
  background: #fff;
  color: #64748B;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  transition: all 0.15s;
}

.sa-tb-bell:hover {
  border-color: #6366F1;
  color: #6366F1;
}

.sa-tb-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 16px;
  height: 16px;
  background: #6366F1;
  color: #fff;
  font-size: 9px;
  font-weight: 700;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #fff;
}

.sa-tb-profile-avatar {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: #0F172A;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 13px;
  font-family: 'Outfit', sans-serif;
}

/* Sub header Date selection & export */
.sa-sub-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
}

.sa-date-box {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  border: 1.5px solid #E2E8F0;
  border-radius: 10px;
  padding: 8px 14px;
  font-size: 12.5px;
  font-weight: 600;
  color: #334155;
  cursor: pointer;
  transition: all 0.15s;
}

.sa-date-box:hover {
  border-color: #6366F1;
}

.sa-export-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #6366F1;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 12.5px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s;
}

.sa-export-btn:hover {
  background: #4f46e5;
}

/* KPI Cards 5 column row */
.sa-kpi-row-5 {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
}

.sa-kpi-card {
  background: #fff;
  border: 1px solid #E2E8F0;
  border-radius: 14px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
}

.sa-kpi-card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.sa-kpi-card-lbl {
  font-size: 11px;
  font-weight: 700;
  color: #64748B;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.sa-kpi-card-ic {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sa-kpi-card-val {
  font-size: 24px;
  font-weight: 800;
  color: #0F172A;
  margin: 10px 0 4px;
  font-family: 'Outfit', sans-serif;
}

.sa-kpi-card-bot {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10.5px;
  font-weight: 600;
  color: #64748B;
}

.sa-kpi-card-trend-up {
  color: #10B981;
  display: flex;
  align-items: center;
  gap: 2px;
  font-weight: 700;
}

/* Row 1 layouts */
.sa-row-1-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 16px;
}

.sa-card {
  background: #fff;
  border: 1px solid #E2E8F0;
  border-radius: 14px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.sa-card-hdr {
  padding: 14px 18px;
  border-bottom: 1px solid #F1F5F9;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sa-card-title {
  font-size: 13.5px;
  font-weight: 800;
  color: #0F172A;
}

.sa-card-body {
  padding: 18px;
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
}

/* Donut chart styles */
.sa-donut-wrap {
  position: relative;
  width: 110px;
  height: 110px;
  flex-shrink: 0;
}

.sa-donut-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  pointer-events: none;
}

.sa-donut-num {
  font-size: 16px;
  font-weight: 800;
  color: #0f172a;
  line-height: 1;
  font-family: 'Outfit', sans-serif;
}

.sa-donut-lbl {
  font-size: 8px;
  color: #94A3B8;
  margin-top: 2px;
  font-weight: 700;
  text-transform: uppercase;
}

.sa-donut-legends {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  margin-top: 14px;
}

.sa-donut-leg-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 10.5px;
  color: #475569;
  border-bottom: 1px solid #F1F5F9;
  padding-bottom: 4px;
}

.sa-donut-leg-row:last-child {
  border-bottom: none;
}

.sa-donut-leg-left {
  display: flex;
  align-items: center;
  gap: 6px;
}

.sa-donut-leg-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.sa-donut-leg-val {
  font-weight: 700;
  color: #0F172A;
}

/* Rank lists */
.sa-rank-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sa-rank-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
}

.sa-rank-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.sa-rank-circle {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9.5px;
  font-weight: 800;
  color: #fff;
}

.sa-rank-name {
  font-weight: 600;
  color: #334155;
}

.sa-rank-val {
  font-weight: 700;
  color: #0F172A;
}

/* Row 2: 6 small KPIs */
.sa-kpi-row-6 {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
}

/* Row 3: 3 columns layout */
.sa-row-3-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr 0.8fr;
  gap: 16px;
}

/* Table styles */
.sa-table {
  width: 100%;
  border-collapse: collapse;
}

.sa-table th {
  font-size: 9.5px;
  font-weight: 700;
  color: #94A3B8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-align: left;
  padding: 8px 10px;
  background: #F8FAFC;
  border-bottom: 1px solid #F1F5F9;
}

.sa-table td {
  padding: 9px 10px;
  font-size: 11.5px;
  border-bottom: 1px solid #F1F5F9;
  vertical-align: middle;
  color: #334155;
}

.sa-table tr:last-child td {
  border-bottom: none;
}

.sa-table tr:hover td {
  background: #F8FAFC;
}

.sa-link-all {
  font-size: 11px;
  font-weight: 700;
  color: #6366F1;
  text-decoration: none;
}

.sa-link-all:hover {
  text-decoration: underline;
}

/* Progress row */
.sa-prog-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 12px;
}

.sa-prog-row:last-child {
  margin-bottom: 0;
}

.sa-prog-top {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  font-weight: 700;
  color: #475569;
}

.sa-prog-bar-bg {
  height: 6px;
  background: #E2E8F0;
  border-radius: 3px;
  overflow: hidden;
}

.sa-prog-bar-fill {
  height: 100%;
  background: #6366F1;
  border-radius: 3px;
}

/* Row 4: 3 columns layout */
.sa-row-4-grid {
  display: grid;
  grid-template-columns: 1fr 1.2fr 1fr;
  gap: 16px;
}

.sa-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sa-list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #F1F5F9;
  padding-bottom: 8px;
}

.sa-list-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.sa-list-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sa-list-icon {
  width: 26px;
  height: 26px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.sa-list-info {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.sa-list-title {
  font-size: 11.5px;
  font-weight: 700;
  color: #1E293B;
}

.sa-list-desc {
  font-size: 9.5px;
  color: #64748B;
}

.sa-list-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.sa-list-val {
  font-size: 11.5px;
  font-weight: 700;
  color: #0F172A;
}

.sa-list-time {
  font-size: 9px;
  color: #94A3B8;
  font-weight: 500;
}

/* Indicators */
.sa-alert-indicator {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.sa-select-light {
  padding: 4px 8px;
  border: 1.5px solid #E2E8F0;
  border-radius: 6px;
  font-size: 11.5px;
  font-weight: 600;
  color: #475569;
  outline: none;
  background: #fff;
  cursor: pointer;
}

@keyframes drawPath {
  to { stroke-dashoffset: 0; }
}

.animate-draw-line {
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: drawPath 1.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
`;

export default function SuperAdminDashboard() {
  const [selectedRange] = useState('01 May 2024 - 31 May 2024');
  const [saUserName, setSaUserName] = useState('Super Admin');
  const [saUserInitials, setSaUserInitials] = useState('SA');

  useEffect(() => {
    const loadUser = () => {
      const name = localStorage.getItem('evegah_user_name') || 'Super Admin';
      setSaUserName(name);
      setSaUserInitials(name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2));
    };
    loadUser();
    if (typeof window !== 'undefined') {
      window.addEventListener('evegah_role_changed', loadUser);
      return () => window.removeEventListener('evegah_role_changed', loadUser);
    }
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="ev-shell">
        <Sidebar activePath="/super-admin" />
        <div className="ev-main">
          
          {/* Top Bar matching screenshot */}
          <header className="sa-tb">
            <div className="sa-tb-left">
              <button className="sa-tb-hamburger">
                <span />
                <span />
                <span />
              </button>
              <div className="sa-tb-greeting">
                <span className="sa-tb-welcome">Welcome back,</span>
                <div className="sa-tb-title-row">
                  <h1 className="sa-tb-user-title">{saUserName}</h1>
                  <span className="sa-tb-check">✓</span>
                </div>
              </div>
            </div>
            
            <div className="sa-tb-right">
              <div className="sa-tb-zone-select">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2.5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>All Zones</span>
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="3">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>

              <button className="sa-tb-bell">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                <span className="sa-tb-badge">12</span>
              </button>

              <div className="sa-tb-profile-avatar" style={{ background: '#1E1B4B' }}>
                {saUserInitials}
              </div>
            </div>
          </header>

          <div className="ev-body">
            
            {/* Sub-header Actions row */}
            <div className="sa-sub-header">
              <div className="sa-date-box">
                <span>{selectedRange}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <button className="sa-export-btn">Export Report</button>
            </div>

            {/* KPI Cards Row (5 columns) */}
            <div className="sa-kpi-row-5">
              {[
                { label: 'Total Users', value: '24,568', change: '12.5%', icon: (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>
                ), bg: '#EEF2FF', color: '#6366F1' },
                { label: 'Total Tenants', value: '248', change: '8.7%', icon: (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 5v3h-7V8z"/></svg>
                ), bg: '#EEF2FF', color: '#4F46E5' },
                { label: 'Active Subscriptions', value: '8,932', change: '14.3%', icon: (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                ), bg: '#ECFDF5', color: '#10B981' },
                { label: 'MRR', value: '₹92,45,680', change: '16.8%', icon: (
                  <span style={{ fontSize: '13px', fontWeight: '800' }}>₹</span>
                ), bg: '#EFF6FF', color: '#2563EB' },
                { label: 'ARR', value: '₹11,09,48,160', change: '18.9%', icon: (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="12" y1="4" x2="12" y2="20"/></svg>
                ), bg: '#ECFDF5', color: '#10B981' }
              ].map(k => (
                <div key={k.label} className="sa-kpi-card">
                  <div className="sa-kpi-card-top">
                    <span className="sa-kpi-card-lbl">{k.label}</span>
                    <span className="sa-kpi-card-ic" style={{ background: k.bg, color: k.color }}>{k.icon}</span>
                  </div>
                  <div className="sa-kpi-card-val"><AnimatedCount value={k.value} /></div>
                  <div className="sa-kpi-card-bot">
                    <span className="sa-kpi-card-trend-up">↑ {k.change}</span>
                    <span>from last month</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Row 1 Grid: Revenue Overview, Subscription Status, Top Plans */}
            <div className="sa-row-1-grid">
              
              {/* Revenue Overview */}
              <div className="sa-card">
                <div className="sa-card-hdr">
                  <span className="sa-card-title">Revenue Overview</span>
                  <select className="sa-select-light">
                    <option>This Month</option>
                  </select>
                </div>
                <div className="sa-card-body">
                  <div style={{ display: 'flex', gap: '12px', fontSize: '10.5px', marginBottom: '12px', fontWeight: '700' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#6366F1' }} />
                      <span style={{ color: '#475569' }}>MRR</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10B981' }} />
                      <span style={{ color: '#475569' }}>ARR</span>
                    </div>
                  </div>

                  {/* Real double spline line chart */}
                  <div style={{ flex: 1, position: 'relative', height: '140px' }}>
                    <Line
                      data={{
                        labels: ['01 May', '06 May', '11 May', '16 May', '21 May', '26 May', '31 May'],
                        datasets: [
                          {
                            label: 'MRR',
                            data: [45, 70, 50, 60, 55, 63, 90],
                            borderColor: '#6366F1',
                            backgroundColor: 'rgba(99, 102, 241, 0.15)',
                            fill: true,
                            tension: 0.4,
                            borderWidth: 2,
                            pointRadius: 3,
                            pointBackgroundColor: '#6366F1',
                          },
                          {
                            label: 'ARR',
                            data: [25, 40, 35, 43, 45, 55, 70],
                            borderColor: '#10B981',
                            backgroundColor: 'rgba(16, 185, 129, 0.15)',
                            fill: true,
                            tension: 0.4,
                            borderWidth: 2,
                            pointRadius: 3,
                            pointBackgroundColor: '#10B981',
                          }
                        ]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { display: false }
                        },
                        scales: {
                          x: {
                            grid: { display: false },
                            ticks: { font: { size: 9 }, color: '#94A3B8' }
                          },
                          y: {
                            grid: { color: '#F1F5F9' },
                            ticks: {
                              font: { size: 9 },
                              color: '#94A3B8',
                              callback: (val) => `${val}K`
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Subscription Status Donut Chart */}
              <div className="sa-card">
                <div className="sa-card-hdr">
                  <span className="sa-card-title">Subscription Status</span>
                </div>
                <div className="sa-card-body" style={{ alignItems: 'center', justifyContent: 'center' }}>
                  <div className="sa-donut-wrap">
                    <Doughnut
                      data={{
                        labels: ['Active', 'Trial', 'Past Due', 'Canceled'],
                        datasets: [
                          {
                            data: [6543, 1245, 687, 457],
                            backgroundColor: ['#1E3A8A', '#84CC16', '#F97316', '#EF4444'],
                            borderWidth: 2,
                            borderColor: '#fff',
                            hoverOffset: 4,
                          }
                        ]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        cutout: '70%',
                        plugins: {
                          legend: { display: false }
                        }
                      }}
                    />
                    <div className="sa-donut-center">
                      <span className="sa-donut-num">8,932</span>
                      <span className="sa-donut-lbl">Total</span>
                    </div>
                  </div>

                  <div className="sa-donut-legends">
                    {[
                      { color: '#1E3A8A', label: 'Active', count: '6,543', pct: '73.2%' },
                      { color: '#84CC16', label: 'Trial', count: '1,245', pct: '13.9%' },
                      { color: '#F97316', label: 'Past Due', count: '687', pct: '7.7%' },
                      { color: '#EF4444', label: 'Canceled', count: '457', pct: '5.2%' }
                    ].map(l => (
                      <div className="sa-donut-leg-row" key={l.label}>
                        <div className="sa-donut-leg-left">
                          <span className="sa-donut-leg-dot" style={{ background: l.color }} />
                          <span>{l.label}</span>
                        </div>
                        <span className="sa-donut-leg-val">
                          {l.count} <span style={{ color: '#94A3B8', fontWeight: '500' }}>({l.pct})</span>
                        </span>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: 'auto', alignSelf: 'flex-end', paddingTop: '8px' }}>
                    <a href="/super-admin/subscriptions" className="sa-link-all" style={{ fontSize: '10px' }}>View Details</a>
                  </div>
                </div>
              </div>

              {/* Top Plans by Revenue */}
              <div className="sa-card">
                <div className="sa-card-hdr">
                  <span className="sa-card-title">Top Plans by Revenue</span>
                  <a href="/super-admin/subscriptions" className="sa-link-all">View All</a>
                </div>
                <div className="sa-card-body" style={{ justifyContent: 'center' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', marginBottom: '14px', borderBottom: '1px solid #F1F5F9', paddingBottom: '6px' }}>
                    <span>Plan</span>
                    <span>Revenue</span>
                  </div>
                  <div className="sa-rank-list">
                    {[
                      { name: 'Enterprise Plan', val: '₹45,67,890', color: '#1E3A8A' },
                      { name: 'Business Plan', val: '₹28,34,560', color: '#10B981' },
                      { name: 'Professional Plan', val: '₹12,45,230', color: '#F59E0B' },
                      { name: 'Starter Plan', val: '₹5,67,890', color: '#6366F1' }
                    ].map((plan, idx) => (
                      <div className="sa-rank-row" key={plan.name}>
                        <div className="sa-rank-left">
                          <span className="sa-rank-circle" style={{ background: plan.color }}>{idx + 1}</span>
                          <span className="sa-rank-name">{plan.name}</span>
                        </div>
                        <span className="sa-rank-val">{plan.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* Row 2: 6 small KPIs */}
            <div className="sa-kpi-row-6">
              {[
                { label: 'New Signups', val: '1,245', change: '14.2%', up: true, icon: (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" /></svg>
                ), bg: '#EEF2FF', color: '#6366F1' },
                { label: 'Trial Conversions', val: '18.6%', change: '3.2%', up: true, icon: (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="4 17 10 11 4 5"/><polyline points="12 19 20 11 12 3"/></svg>
                ), bg: '#ECFDF5', color: '#10B981' },
                { label: 'Churn Rate', val: '2.4%', change: '0.6%', up: false, icon: (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                ), bg: '#FEF2F2', color: '#EF4444' },
                { label: 'LTV', val: '₹24,850', change: '11.3%', up: true, icon: (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                ), bg: '#ECFDF5', color: '#10B981' },
                { label: 'CAC', val: '₹3,250', change: '4.1%', up: false, icon: (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
                ), bg: '#FFF7ED', color: '#F97316' },
                { label: 'Active Tenants', val: '198', change: '9.1%', up: true, icon: (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                ), bg: '#EEF2FF', color: '#6366F1' }
              ].map(k => (
                <div key={k.label} className="sa-kpi-card" style={{ padding: '14px 12px' }}>
                  <div className="sa-kpi-card-top">
                    <span className="sa-kpi-card-lbl" style={{ fontSize: '9px' }}>{k.label}</span>
                    <span className="sa-kpi-card-ic" style={{ width: '28px', height: '28px', background: k.bg, color: k.color }}>{k.icon}</span>
                  </div>
                  <div className="sa-kpi-card-val" style={{ fontSize: '18px', margin: '6px 0 2px' }}><AnimatedCount value={k.val} /></div>
                  <div className="sa-kpi-card-bot" style={{ fontSize: '9px' }}>
                    <span style={{ color: k.up ? '#10B981' : '#EF4444', fontWeight: '700' }}>{k.up ? '↑' : '↓'} {k.change}</span>
                    <span>vs last month</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Row 3: Tenant Growth Chart, Revenue by Zone Table, Platform Usage */}
            <div className="sa-row-3-grid">
              
              {/* Tenant Growth chart */}
              <div className="sa-card">
                <div className="sa-card-hdr">
                  <span className="sa-card-title">Tenant Growth</span>
                  <select className="sa-select-light">
                    <option>This Month</option>
                  </select>
                </div>
                <div className="sa-card-body">
                  <div style={{ flex: 1, position: 'relative', height: '140px' }}>
                    <Line
                      data={{
                        labels: ['01 May', '08 May', '15 May', '22 May', '31 May'],
                        datasets: [
                          {
                            label: 'Tenants',
                            data: [100, 150, 140, 190, 240],
                            borderColor: '#6366F1',
                            backgroundColor: 'rgba(99, 102, 241, 0.15)',
                            fill: true,
                            tension: 0.4,
                            borderWidth: 2,
                            pointRadius: 4,
                            pointBackgroundColor: '#6366F1',
                          }
                        ]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { display: false }
                        },
                        scales: {
                          x: {
                            grid: { display: false },
                            ticks: { font: { size: 9 }, color: '#94A3B8' }
                          },
                          y: {
                            grid: { color: '#F1F5F9' },
                            ticks: { font: { size: 9 }, color: '#94A3B8' }
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Revenue by Zone Table */}
              <div className="sa-card">
                <div className="sa-card-hdr">
                  <span className="sa-card-title">Revenue by Zone</span>
                  <a href="/super-admin/zones" className="sa-link-all">View All</a>
                </div>
                <div className="sa-card-body" style={{ padding: 0 }}>
                  <table className="sa-table">
                    <thead>
                      <tr>
                        <th>Zone</th>
                        <th>Tenants</th>
                        <th>MRR</th>
                        <th>Growth</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { zone: 'Connaught Place', tenants: 48, mrr: '₹18,45,680', growth: '+22.4%' },
                        { zone: 'Koramangala', tenants: 36, mrr: '₹14,23,580', growth: '+18.7%' },
                        { zone: 'Indiranagar', tenants: 28, mrr: '₹10,45,230', growth: '+16.3%' },
                        { zone: 'Banjara Hills', tenants: 22, mrr: '₹8,21,450', growth: '+12.8%' },
                        { zone: 'Salt Lake', tenants: 18, mrr: '₹5,67,890', growth: '+10.9%' }
                      ].map((row, idx) => (
                        <tr key={idx}>
                          <td style={{ fontWeight: '700' }}>{row.zone}</td>
                          <td style={{ fontWeight: '600', color: '#475569' }}>{row.tenants}</td>
                          <td style={{ fontWeight: '700' }}>{row.mrr}</td>
                          <td style={{ color: '#10B981', fontWeight: '700' }}>{row.growth}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Platform Usage progress cards */}
              <div className="sa-card">
                <div className="sa-card-hdr">
                  <span className="sa-card-title">Platform Usage</span>
                  <a href="/super-admin/system-monitoring" className="sa-link-all">View All</a>
                </div>
                <div className="sa-card-body" style={{ justifyContent: 'center' }}>
                  {[
                    { label: 'API Calls', cur: '78.6M', max: '100M', pct: 78.6 },
                    { label: 'Storage Used', cur: '428 GB', max: '1 TB', pct: 42.8 },
                    { label: 'Bandwidth', cur: '2.4 TB', max: '5 TB', pct: 48.0 },
                    { label: 'Emails Sent', cur: '1.2M', max: '2M', pct: 60.0 },
                    { label: 'Active Integrations', cur: '64', max: '100', pct: 64.0 }
                  ].map(p => (
                    <div className="sa-prog-row" key={p.label}>
                      <div className="sa-prog-top">
                        <span>{p.label}</span>
                        <span>{p.cur} <span style={{ color: '#94A3B8', fontWeight: 'normal' }}>/ {p.max}</span></span>
                      </div>
                      <div className="sa-prog-bar-bg">
                        <div className="sa-prog-bar-fill" style={{ width: `${p.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Row 4: Recent Transactions, Recent Signups, Alerts */}
            <div className="sa-row-4-grid">
              
              {/* Recent Transactions */}
              <div className="sa-card">
                <div className="sa-card-hdr">
                  <span className="sa-card-title">Recent Transactions</span>
                  <a href="/super-admin/saas-revenue" className="sa-link-all">View All</a>
                </div>
                <div className="sa-card-body" style={{ padding: '12px 14px' }}>
                  <div className="sa-list">
                    {[
                      { title: 'Payment from TechCorp Solutions', desc: 'Enterprise Plan subscription', val: '₹45,67,890', time: '2 min ago', bg: '#ECFDF5', color: '#10B981', symbol: '✓' },
                      { title: 'Subscription renewal - Business Plan', desc: 'GreenMove Mobility subscription', val: '₹28,34,560', time: '15 min ago', bg: '#F5F3FF', color: '#8B5CF6', symbol: '↻' },
                      { title: 'Payment from DesignStudio', desc: 'Professional Plan subscription', val: '₹12,45,230', time: '32 min ago', bg: '#ECFDF5', color: '#10B981', symbol: '✓' }
                    ].map((row, idx) => (
                      <div className="sa-list-item" key={idx}>
                        <div className="sa-list-left">
                          <span className="sa-list-icon" style={{ background: row.bg, color: row.color, fontWeight: 'bold' }}>{row.symbol}</span>
                          <div className="sa-list-info">
                            <span className="sa-list-title">{row.title}</span>
                            <span className="sa-list-desc">{row.desc}</span>
                          </div>
                        </div>
                        <div className="sa-list-right">
                          <span className="sa-list-val">{row.val}</span>
                          <span className="sa-list-time">{row.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Signups */}
              <div className="sa-card">
                <div className="sa-card-hdr">
                  <span className="sa-card-title">Recent Signups</span>
                  <a href="/super-admin/tenants" className="sa-link-all">View All</a>
                </div>
                <div className="sa-card-body" style={{ padding: '12px 14px' }}>
                  <div className="sa-list">
                    {[
                      { name: 'John Doe', email: 'john@techcorp.com', zone: 'Connaught Place', time: '2 min ago', initials: 'JD' },
                      { name: 'Sarah Johnson', email: 'sarah@nextgen.com', zone: 'Koramangala', time: '15 min ago', initials: 'SJ' },
                      { name: 'Mike Brown', email: 'mike@designstudio.com', zone: 'Indiranagar', time: '32 min ago', initials: 'MB' }
                    ].map((row, idx) => (
                      <div className="sa-list-item" key={idx}>
                        <div className="sa-list-left">
                          <span className="sa-list-icon" style={{ background: '#EEF2FF', color: '#6366F1', fontWeight: 'bold', fontSize: '10.5px' }}>{row.initials}</span>
                          <div className="sa-list-info">
                            <span className="sa-list-title">{row.name}</span>
                            <span className="sa-list-desc">{row.email}</span>
                          </div>
                        </div>
                        <div className="sa-list-right">
                          <span className="sa-list-val" style={{ fontSize: '11px', color: '#475569' }}>{row.zone}</span>
                          <span className="sa-list-time">{row.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Alerts */}
              <div className="sa-card">
                <div className="sa-card-hdr">
                  <span className="sa-card-title">Alerts</span>
                  <a href="/super-admin/system-monitoring" className="sa-link-all">View All</a>
                </div>
                <div className="sa-card-body" style={{ padding: '12px 14px' }}>
                  <div className="sa-list">
                    {[
                      { title: 'High server load detected in Koramangala zone', time: '5 min ago', color: '#EF4444' },
                      { title: 'Payment failure rate is above 5%', time: '15 min ago', color: '#F97316' },
                      { title: 'Trial conversion rate dropped by 10%', time: '45 min ago', color: '#F97316' },
                      { title: 'New update available for SAAS Add-ons', time: '1 hr ago', color: '#3B82F6' }
                    ].map((row, idx) => (
                      <div className="sa-list-item" key={idx}>
                        <div className="sa-list-left">
                          <span className="sa-alert-indicator" style={{ background: row.color }} />
                          <div className="sa-list-info">
                            <span className="sa-list-title" style={{ fontWeight: '600' }}>{row.title}</span>
                          </div>
                        </div>
                        <div className="sa-list-right">
                          <span className="sa-list-time">{row.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </>
  );
}
