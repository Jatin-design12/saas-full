'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

/* ──────────────────────────────────────────────────────────────
   EMPLOYEE ATTENDANCE  ·  Clock-In / Clock-Out
   ────────────────────────────────────────────────────────────── */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@700&display=swap');
.at-shell{display:flex;min-height:100vh;background:#F3F4F9;font-family:Inter,sans-serif;}
.at-main{margin-left:240px;display:flex;flex-direction:column;min-height:100vh;width:calc(100% - 240px);}
.at-page{flex:1;padding:0 28px 60px;}

/* breadcrumb */
.at-bc{display:flex;align-items:center;gap:6px;padding:14px 0 0;font-size:12px;color:#9CA3AF;}
.at-bc a{color:#9CA3AF;text-decoration:none;}
.at-bc a:hover{color:#2A195C;}
.at-bc-sep{color:#D1D5DB;}
.at-bc-cur{color:#2A195C;font-weight:600;}

/* title */
.at-title-row{display:flex;align-items:flex-start;justify-content:space-between;margin:12px 0 22px;gap:16px;}
.at-h1{font-size:22px;font-weight:800;color:#111827;margin:0 0 4px;}
.at-sub{font-size:13px;color:#6B7280;margin:0;}
.at-export-btn{display:flex;align-items:center;gap:7px;padding:9px 18px;background:#fff;border:1.5px solid #E5E7EB;border-radius:10px;font-size:13px;font-weight:600;color:#374151;cursor:pointer;font-family:inherit;box-shadow:0 1px 3px rgba(0,0,0,.06);transition:border-color .15s;}
.at-export-btn:hover{border-color:#2A195C;color:#2A195C;}

/* top 3-col grid */
.at-top-grid{display:grid;grid-template-columns:1.4fr 1fr 1fr;gap:18px;margin-bottom:20px;}

/* clock-in card */
.at-clock-card{background:#fff;border:1px solid #E5E7EB;border-radius:16px;box-shadow:0 1px 6px rgba(0,0,0,.07);overflow:hidden;}
.at-clock-inner{padding:24px 26px 20px;}
.at-clock-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;}
.at-clock-title{font-size:13px;font-weight:700;color:#111827;}
.at-status-pill{display:flex;align-items:center;gap:6px;padding:5px 12px;border-radius:20px;font-size:12px;font-weight:700;}
.at-status-pill.in{background:#DCFCE7;color:#16A34A;}
.at-status-pill.out{background:#F3F4F6;color:#6B7280;}
.at-status-pill.break{background:#FEF3C7;color:#92400E;}
.at-status-dot{width:7px;height:7px;border-radius:50%;}
.at-status-dot.in{background:#16A34A;}
.at-status-dot.out{background:#9CA3AF;}
.at-status-dot.break{background:#D97706;}

.at-current-time{font-family:'JetBrains Mono',monospace;font-size:38px;font-weight:700;color:#111827;margin:12px 0 2px;}
.at-current-date{font-size:13.5px;color:#6B7280;margin-bottom:20px;}

.at-clock-info{display:flex;flex-direction:column;gap:10px;border-top:1px solid #F3F4F6;padding-top:16px;margin-bottom:20px;}
.at-info-row{display:flex;align-items:center;justify-content:space-between;font-size:13px;}
.at-info-label{color:#6B7280;display:flex;align-items:center;gap:7px;}
.at-info-val{font-weight:600;color:#111827;}
.at-info-val.elapsed{font-family:'JetBrains Mono',monospace;font-size:14px;color:#2A195C;}
.at-info-val.break-t{font-family:'JetBrains Mono',monospace;color:#D97706;}

.at-btn-row{display:flex;gap:12px;margin-bottom:22px;}
.at-clockin-btn{flex:1;display:flex;align-items:center;justify-content:center;gap:8px;padding:12px;border:none;border-radius:10px;font-size:14px;font-weight:700;color:#fff;cursor:pointer;font-family:inherit;box-shadow:0 4px 10px rgba(0,0,0,.08);transition:opacity .15s;}
.at-clockin-btn.do-in{background:linear-gradient(135deg,#10B981,#059669);box-shadow:0 4px 12px rgba(16,185,129,.35);}
.at-clockin-btn.do-out{background:linear-gradient(135deg,#EF4444,#DC2626);box-shadow:0 4px 12px rgba(239,68,68,.35);}
.at-break-btn{flex:0 0 100px;display:flex;align-items:center;justify-content:center;gap:6px;padding:12px;background:#fff;border:1.5px solid #F59E0B;color:#D97706;border-radius:10px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;transition:background .15s;}
.at-break-btn:hover{background:#FEF3C7;}
.at-break-end-btn{flex:0 0 100px;display:flex;align-items:center;justify-content:center;gap:6px;padding:12px;background:#FEF3C7;border:1.5px solid #F59E0B;color:#D97706;border-radius:10px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;transition:background .15s;}
.at-break-end-btn:hover{background:#FDE68A;}

.at-timeline{border-top:1px solid #F3F4F6;padding-top:16px;}
.at-tl-label{font-size:12px;color:#9CA3AF;margin-bottom:8px;}
.at-tl-bar-bg{height:8px;background:#E5E7EB;border-radius:4px;overflow:hidden;margin-bottom:6px;}
.at-tl-bar-work{height:100%;background:linear-gradient(90deg,#2A195C,#2A195C);border-radius:4px;transition:width .5s;}
.at-tl-ticks{display:flex;justify-content:space-between;}
.at-tl-tick{font-size:10px;color:#9CA3AF;}

/* summary card */
.at-summary-card{background:#fff;border:1px solid #E5E7EB;border-radius:16px;padding:20px;box-shadow:0 1px 6px rgba(0,0,0,.06);display:flex;flex-direction:column;gap:12px;}
.at-summary-title{font-size:13px;font-weight:700;color:#111827;display:flex;align-items:center;gap:7px;margin-bottom:6px;border-bottom:1px solid #F3F4F6;padding-bottom:10px;}
.at-stat-item{display:flex;align-items:center;justify-content:space-between;font-size:12.5px;padding-bottom:2px;}
.at-stat-label{color:#6B7280;display:flex;align-items:center;gap:6px;}
.at-stat-val{font-weight:700;color:#111827;}
.at-stat-val.green { background: #10B981; color: #fff; }
.at-stat-val.amber{color:#D97706;}

/* streak card */
.at-streak-card{background:linear-gradient(135deg,#2A195C,#2A195C);border-radius:16px;padding:20px;color:#fff;box-shadow:0 4px 14px rgba(79,70,229,.3);}
.at-streak-title{font-size:13px;font-weight:700;color:rgba(255,255,255,.8);display:flex;align-items:center;gap:7px;margin-bottom:12px;}
.at-streak-num{font-size:42px;font-weight:800;line-height:1;margin-bottom:4px;}
.at-streak-lbl{font-size:11.5px;color:rgba(255,255,255,.85);margin-bottom:16px;}
.at-streak-divider{height:1px;background:rgba(255,255,255,.15);margin-bottom:14px;}
.at-streak-stat-row{display:grid;grid-template-columns:1fr 1fr;gap:12px 8px;}
.at-streak-stat{display:flex;flex-direction:column;gap:3px;}
.at-streak-stat-label{font-size:10px;color:rgba(255,255,255,.75);}
.at-streak-stat-val{font-size:12.5px;font-weight:700;}

/* weekly card */
.at-week-card{background:#fff;border:1px solid #E5E7EB;border-radius:16px;padding:20px 24px;box-shadow:0 1px 6px rgba(0,0,0,.06);margin-bottom:20px;}
.at-week-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;border-bottom:1px solid #F3F4F6;padding-bottom:12px;}
.at-week-title{font-size:14px;font-weight:700;color:#111827;display:flex;align-items:center;gap:7px;}
.at-week-nav{display:flex;align-items:center;gap:10px;}
.at-week-nav-btn{width:28px;height:28px;border:1.5px solid #E5E7EB;border-radius:6px;background:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#374151;}
.at-week-nav-btn:hover{border-color:#2A195C;color:#2A195C;}
.at-week-range{font-size:12.5px;font-weight:600;color:#374151;}
.at-week-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:10px;}
.at-day-col{border:1px solid #F3F4F6;border-radius:10px;padding:12px 6px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:8px;}
.at-day-name{font-size:11px;font-weight:700;color:#9CA3AF;text-transform:uppercase;}
.at-day-dot-wrap{height:20px;display:flex;align-items:center;justify-content:center;}
.at-day-date{font-size:12.5px;font-weight:700;color:#111827;}
.at-day-hours{font-size:11px;color:#6B7280;font-weight:500;}

/* history table */
.at-hist-card{background:#fff;border:1px solid #E5E7EB;border-radius:16px;box-shadow:0 1px 6px rgba(0,0,0,.06);overflow:hidden;}
.at-hist-hdr{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid #E5E7EB;}
.at-hist-title{font-size:14.5px;font-weight:700;color:#111827;}
.at-hist-table{width:100%;border-collapse:collapse;}
.at-hist-table th{text-align:left;font-size:11.5px;font-weight:700;color:#9CA3AF;text-transform:uppercase;letter-spacing:.05em;padding:10px 20px;background:#F9FAFB;border-bottom:1.5px solid #E5E7EB;}
.at-hist-table td{padding:12px 20px;border-bottom:1px solid #F3F4F6;font-size:13px;color:#374151;vertical-align:middle;}
.at-hist-table tr:hover td{background:#FAFAFA;}
.at-hist-duration{font-family:'JetBrains Mono',monospace;font-weight:700;color:#111827;}
`;

/* ── Helpers & Icons ── */
const strokeBase = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
const SV = ({ s = 14, children, ...p }: { s?: number; children: React.ReactNode } & React.SVGProps<SVGSVGElement>) => (
  <svg width={s} height={s} viewBox="0 0 24 24" {...strokeBase} {...p}>{children}</svg>
);

const IClock = ({ s = 14 }) => <SV s={s}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></SV>;
const IDownload = ({ s = 14 }) => <SV s={s}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></SV>;
const ILogIn = ({ s = 14 }) => <SV s={s}><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" /></SV>;
const ILogOut = ({ s = 14 }) => <SV s={s}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></SV>;
const ICoffee = ({ s = 14 }) => <SV s={s}><path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" /><line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" /></SV>;
const IBarChart = ({ s = 14 }) => <SV s={s}><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></SV>;
const ITrend = ({ s = 14 }) => <SV s={s}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></SV>;
const ICalendar = ({ s = 14 }) => <SV s={s}><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></SV>;
const IFire = ({ s = 14 }) => <SV s={s}><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" /></SV>;
const IUser = ({ s = 14 }) => <SV s={s}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></SV>;
const ILeft = () => <SV s={13}><polyline points="15 18 9 12 15 6"/></SV>;
const IRight = () => <SV s={13}><polyline points="9 18 15 12 9 6"/></SV>;
const ICheck = ({ s = 13 }) => <SV s={s}><polyline points="20 6 9 17 4 12" /></SV>;

const formatTime12 = (d: Date) => {
  let h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, '0');
  const s = String(d.getSeconds()).padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  h = h ? h : 12;
  return `${String(h).padStart(2, '0')}:${m}:${s} ${ampm}`;
};

const formatDate = (d: Date) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}, ${days[d.getDay()]}`;
};

const formatShort = (d: Date | null) => {
  if (!d) return '--:--';
  let h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  h = h ? h : 12;
  return `${String(h).padStart(2, '0')}:${m} ${ampm}`;
};

const formatElapsed = (secs: number) => {
  const h = String(Math.floor(secs / 3600)).padStart(2, '0');
  const m = String(Math.floor((secs % 3600) / 60)).padStart(2, '0');
  const s = String(secs % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
};

function DayDot({ type }: { type: string }) {
  const colors: Record<string, string> = {
    present: '#22C55E',
    absent: '#EF4444',
    leave: '#F59E0B',
    today: '#2A195C',
    holiday: '#9CA3AF',
  };
  return <div style={{ width: 8, height: 8, borderRadius: '50%', background: colors[type] || '#E5E7EB' }} />;
}

function StatusBadge({ s }: { s: string }) {
  const styleMap: Record<string, { bg: string; text: string }> = {
    present: { bg: '#DCFCE7', text: '#16A34A' },
    absent: { bg: '#FEE2E2', text: '#EF4444' },
    leave: { bg: '#FEF3C7', text: '#D97706' },
    half_day: { bg: '#EFF6FF', text: '#2563EB' },
  };
  const val = styleMap[s] || { bg: '#F3F4F6', text: '#6B7280' };
  const label = s === 'half_day' ? 'Half Day' : s.charAt(0).toUpperCase() + s.slice(1);
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px',
      borderRadius: 12, fontSize: 11.5, fontWeight: 700, background: val.bg, color: val.text
    }}>
      {label}
    </span>
  );
}

const WEEK_DAYS = [
  { name: 'Mon', date: '27 May', hours: '08:15', type: 'present' },
  { name: 'Tue', date: '28 May', hours: '08:45', type: 'present' },
  { name: 'Wed', date: '29 May', hours: '09:12', type: 'present' },
  { name: 'Thu', date: '30 May', hours: '08:30', type: 'present' },
  { name: 'Fri', date: '31 May', hours: '08:05', type: 'present' },
  { name: 'Sat', date: '1 Jun',  hours: '04:10', type: 'leave' },
  { name: 'Sun', date: '2 Jun',  hours: '--:--', type: 'holiday' },
];

const HIST = [
  { date: '31 May 2024', day: 'Friday', cin: '09:02 AM', cout: '05:07 PM', duration: '08h 05m', break: '45m', status: 'present' },
  { date: '30 May 2024', day: 'Thursday', cin: '08:55 AM', cout: '05:25 PM', duration: '08h 30m', break: '50m', status: 'present' },
  { date: '29 May 2024', day: 'Wednesday', cin: '08:48 AM', cout: '06:00 PM', duration: '09h 12m', break: '1h 10m', status: 'present' },
  { date: '28 May 2024', day: 'Tuesday', cin: '09:05 AM', cout: '05:50 PM', duration: '08h 45m', break: '40m', status: 'present' },
  { date: '27 May 2024', day: 'Monday', cin: '08:50 AM', cout: '05:05 PM', duration: '08h 15m', break: '30m', status: 'present' },
];

/* ═══ Attendance Content (embeddable) ═══ */
export const AttendanceCSS = CSS;

export function AttendanceContent() {
  const [clockedIn,    setClockedIn]    = useState(false);
  const [onBreak,      setOnBreak]      = useState(false);
  const [clockInTime,  setClockInTime]  = useState<Date|null>(null);
  const [elapsedSecs,  setElapsedSecs]  = useState(0);
  const [breakSecs,    setBreakSecs]    = useState(0);
  const [totalBreak,   setTotalBreak]   = useState(0);
  const [currentTime,  setCurrentTime]  = useState(new Date());
  const [sessions, setSessions] = useState<{in:Date;out?:Date}[]>([]);

  useEffect(()=>{
    const id = setInterval(()=>{
      setCurrentTime(new Date());
      if(clockedIn && !onBreak) setElapsedSecs(p=>p+1);
      if(onBreak) setBreakSecs(p=>p+1);
    },1000);
    return ()=>clearInterval(id);
  },[clockedIn,onBreak]);

  const handleClockIn = ()=>{
    const now = new Date();
    setClockedIn(true);
    setClockInTime(now);
    setElapsedSecs(0);
    setBreakSecs(0);
    setTotalBreak(0);
    setSessions(p=>[...p,{in:now}]);
  };

  const handleClockOut = ()=>{
    const now = new Date();
    setClockedIn(false);
    setOnBreak(false);
    setSessions(p=>{
      const s=[...p];
      s[s.length-1]={...s[s.length-1],out:now};
      return s;
    });
  };

  const handleBreakStart = ()=>{ setOnBreak(true); };
  const handleBreakEnd   = ()=>{ setOnBreak(false); setTotalBreak(p=>p+breakSecs); setBreakSecs(0); };

  const workSecs = elapsedSecs;
  const totalBreakSecs = totalBreak + (onBreak ? breakSecs : 0);
  const netWork = Math.max(0, workSecs - totalBreakSecs);
  const workDayTarget = 8*3600;
  const progressPct = Math.min(100, (netWork/workDayTarget)*100);

  const status = !clockedIn ? 'out' : onBreak ? 'break' : 'in';
  const statusLabel = !clockedIn ? 'Clocked Out' : onBreak ? 'On Break' : 'Clocked In';

  return (
    <div className="at-page">
      {/* Breadcrumb */}
      <div className="at-bc">
        <Link href="/">Home</Link><span className="at-bc-sep">›</span>
        <a href="#">HR &amp; Employees</a><span className="at-bc-sep">›</span>
        <span className="at-bc-cur">Attendance</span>
      </div>

      {/* Title */}
      <div className="at-title-row">
        <div>
          <h1 className="at-h1">Attendance &amp; Time Tracking</h1>
          <p className="at-sub">Track your daily work hours, breaks and attendance history</p>
        </div>
        <button className="at-export-btn"><IDownload/> Export Report</button>
      </div>

      {/* TOP GRID */}
      <div className="at-top-grid">
        {/* Clock-In Card */}
        <div className="at-clock-card">
          <div className="at-clock-inner">
            <div className="at-clock-header">
              <span className="at-clock-title"><IClock s={13}/> Attendance Tracker</span>
              <div className={`at-status-pill ${status}`}>
                <div className={`at-status-dot ${status}`}/>
                {statusLabel}
              </div>
            </div>

            <div className="at-current-time">{formatTime12(currentTime)}</div>
            <div className="at-current-date">{formatDate(currentTime)}</div>

            <div className="at-clock-info">
              {clockedIn && (
                <div className="at-info-row">
                  <span className="at-info-label"><ILogIn s={13}/> Clocked In At</span>
                  <span className="at-info-val">{formatShort(clockInTime)}</span>
                </div>
              )}
              <div className="at-info-row">
                <span className="at-info-label"><IClock s={13}/> {clockedIn?'Working Time':'Total Today'}</span>
                <span className={`at-info-val elapsed`}>{formatElapsed(clockedIn?workSecs:0)}</span>
              </div>
              {clockedIn && (
                <div className="at-info-row">
                  <span className="at-info-label"><ICoffee s={13}/> Break Time</span>
                  <span className={`at-info-val break-t`}>{formatElapsed(totalBreakSecs)}</span>
                </div>
              )}
            </div>

            <div className="at-btn-row">
              {!clockedIn ? (
                <button className="at-clockin-btn do-in" onClick={handleClockIn}><ILogIn s={16}/> Clock In</button>
              ) : (
                <>
                  <button className="at-clockin-btn do-out" onClick={handleClockOut}><ILogOut s={16}/> Clock Out</button>
                  {!onBreak ? (
                    <button className="at-break-btn" onClick={handleBreakStart}><ICoffee s={14}/> Break</button>
                  ) : (
                    <button className="at-break-end-btn" onClick={handleBreakEnd}><ILogIn s={14}/> Resume</button>
                  )}
                </>
              )}
            </div>

            <div className="at-timeline">
              <div className="at-tl-label">Work Progress (8hr target)</div>
              <div className="at-tl-bar-bg"><div className="at-tl-bar-work" style={{width:`${progressPct}%`}}/></div>
              <div className="at-tl-ticks">{['9AM','11AM','1PM','3PM','5PM','7PM'].map(t=>(<span key={t} className="at-tl-tick">{t}</span>))}</div>
            </div>
          </div>
        </div>

        {/* Today's Summary */}
        <div className="at-summary-card">
          <div className="at-summary-title"><IBarChart/> Today's Summary</div>
          <div className="at-stat-item"><div className="at-stat-label"><IClock s={12}/> Net Work Time</div><div className={`at-stat-val ${clockedIn?'green':''}`}>{formatElapsed(netWork)}</div></div>
          <div className="at-stat-item"><div className="at-stat-label"><ICoffee s={12}/> Break Time</div><div className="at-stat-val amber">{formatElapsed(totalBreakSecs)}</div></div>
          <div className="at-stat-item"><div className="at-stat-label"><ITrend s={12}/> Overtime</div><div className={`at-stat-val ${netWork>workDayTarget?'green':''}`}>{netWork>workDayTarget?formatElapsed(netWork-workDayTarget):'00:00:00'}</div></div>
          <div className="at-stat-item"><div className="at-stat-label"><IUser s={12}/> Sessions Today</div><div className="at-stat-val">{sessions.length || '0'}</div></div>
          <div className="at-stat-item"><div className="at-stat-label"><ICalendar s={12}/> Target Hours</div><div className="at-stat-val" style={{color:'#6B7280'}}>08:00:00</div></div>

          <div style={{marginTop:12,padding:'10px 14px',background:'#F9FAFB',borderRadius:10,fontSize:12,color:'#6B7280',lineHeight:1.6}}>
            <div style={{fontWeight:700,color:'#374151',marginBottom:4}}>Progress</div>
            <div style={{height:8,background:'#E5E7EB',borderRadius:4,overflow:'hidden'}}>
              <div style={{height:'100%',background:'linear-gradient(90deg,#2A195C,#2A195C)',borderRadius:4,width:`${progressPct.toFixed(1)}%`,transition:'width .5s'}}/>
            </div>
            <div style={{marginTop:4,textAlign:'right',fontSize:11,fontWeight:700,color:'#2A195C'}}>{progressPct.toFixed(0)}% of daily target</div>
          </div>
        </div>

        {/* Streak Card */}
        <div className="at-streak-card">
          <div className="at-streak-title"><IFire/> Attendance Streak</div>
          <div className="at-streak-num">12</div>
          <div className="at-streak-lbl">Consecutive days present</div>
          <div className="at-streak-divider"/>
          <div className="at-streak-stat-row">
            <div className="at-streak-stat"><span className="at-streak-stat-label">This Month</span><span className="at-streak-stat-val">22/24 days</span></div>
            <div className="at-streak-stat"><span className="at-streak-stat-label">Avg. Hours/Day</span><span className="at-streak-stat-val">08:34</span></div>
            <div className="at-streak-stat"><span className="at-streak-stat-label">Late Arrivals</span><span className="at-streak-stat-val">2</span></div>
            <div className="at-streak-stat"><span className="at-streak-stat-label">Overtime Hours</span><span className="at-streak-stat-val">06:45</span></div>
            <div className="at-streak-stat"><span className="at-streak-stat-label">Leaves Used</span><span className="at-streak-stat-val">2 / 12</span></div>
          </div>
        </div>
      </div>

      {/* Weekly calendar */}
      <div className="at-week-card">
        <div className="at-week-hdr"><span className="at-week-title"><ICalendar s={14}/> This Week's Attendance</span>
          <div className="at-week-nav"><button className="at-week-nav-btn"><ILeft/></button><span className="at-week-range">27 May – 2 Jun 2024</span><button className="at-week-nav-btn"><IRight/></button></div>
        </div>
        <div className="at-week-grid">{WEEK_DAYS.map(d=>(<div key={d.name} className="at-day-col"><div className="at-day-name">{d.name}</div><div className={`at-day-dot-wrap ${d.type}`}><DayDot type={d.type}/></div><div className="at-day-date">{d.date}</div><div className="at-day-hours">{d.hours}</div></div>))}</div>
        <div style={{display:'flex',alignItems:'center',gap:16,marginTop:18,paddingTop:14,borderTop:'1px solid #F3F4F6',flexWrap:'wrap'}}>
          {[{color:'#22C55E',bg:'#DCFCE7',label:'Present'},{color:'#EF4444',bg:'#FEE2E2',label:'Absent'},{color:'#F59E0B',bg:'#FEF3C7',label:'Leave'},{color:'#2A195C',bg:'#EEF2FF',label:'Today'},{color:'#9CA3AF',bg:'#F3F4F6',label:'Holiday'}].map(l=>(<div key={l.label} style={{display:'flex',alignItems:'center',gap:5,fontSize:12,color:'#6B7280'}}><div style={{width:12,height:12,borderRadius:3,background:l.bg,border:`1.5px solid ${l.color}`}}/>{l.label}</div>))}
        </div>
      </div>

      {/* Attendance history */}
      <div className="at-hist-card">
        <div className="at-hist-hdr"><span className="at-hist-title">Attendance History</span><button className="at-export-btn" style={{padding:'7px 14px',fontSize:12.5}}><IDownload/> Export</button></div>
        <table className="at-hist-table">
          <thead><tr><th>Date</th><th>Clock In</th><th>Clock Out</th><th>Work Duration</th><th>Break</th><th>Status</th></tr></thead>
          <tbody>{HIST.map((h,i)=>(<tr key={i}><td><div style={{fontWeight:600,color:'#111827'}}>{h.date}</div><div style={{fontSize:11,color:'#9CA3AF'}}>{h.day}</div></td><td>{h.cin!=='--'?<span style={{display:'flex',alignItems:'center',gap:5}}><ILogIn s={12}/>{h.cin}</span>:<span style={{color:'#D1D5DB'}}>—</span>}</td><td>{h.cout!=='--'?<span style={{display:'flex',alignItems:'center',gap:5}}><ILogOut s={12}/>{h.cout}</span>:<span style={{color:'#D1D5DB'}}>—</span>}</td><td><span className="at-hist-duration">{h.duration}</span></td><td style={{color:'#9CA3AF'}}>{h.break!=='--'?h.break:'—'}</td><td><StatusBadge s={h.status}/></td></tr>))}</tbody>
        </table>
      </div>
    </div>
  );
}

/* ═══ PAGE (full) ═══ */
export default function AttendancePage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html:CSS}}/>
      <div className="at-shell">
        <Sidebar activePath="/attendance"/>
        <div className="at-main">
          <TopBar/>
          <AttendanceContent/>
        </div>
      </div>
    </>
  );
}
