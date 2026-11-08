'use client';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { api } from '@/lib/api';

/* ──────────────────────────────────────────────────────────────
   RIDE HISTORY PAGE · Modernized to match Vehicle List Page Design
   ────────────────────────────────────────────────────────────── */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@500;600;700;800&display=swap');

.vh-shell { display: flex; min-height: 100vh; background: #F8FAFC; font-family: 'Plus Jakarta Sans', sans-serif; }
.vh-main { margin-left: 240px; display: flex; flex-direction: column; min-height: 100vh; width: calc(100% - 240px); }
.vh-page { flex: 1; padding: 0 28px 48px; background: #FAFAFA; }

/* Breadcrumb */
.vh-bc { display: flex; align-items: center; gap: 6px; padding: 14px 0 0; font-size: 12px; color: #94A3B8; font-weight: 500; }
.vh-bc a { color: #94A3B8; text-decoration: none; transition: color .15s; }
.vh-bc a:hover { color: #6366F1; }
.vh-bc-sep { color: #CBD5E1; }
.vh-bc-cur { color: #0F172A; font-weight: 700; }

/* Title Row */
.vh-title-row { display: flex; align-items: flex-start; justify-content: space-between; margin: 12px 0 18px; gap: 16px; flex-wrap: wrap; }
.vh-h1 { font-family: 'Outfit', sans-serif; font-size: 24px; font-weight: 800; color: #0F172A; margin: 0 0 4px; letter-spacing: -0.02em; }
.vh-sub { font-size: 13px; color: #64748B; margin: 0; }
.vh-hdr-actions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.vh-hdr-btn { display: flex; align-items: center; gap: 6px; padding: 8px 14px; background: #fff; border: 1.5px solid #E2E8F0; border-radius: 10px; font-size: 12.5px; font-weight: 700; color: #334155; cursor: pointer; transition: all .15s; text-decoration: none; }
.vh-hdr-btn:hover { border-color: #6366F1; color: #6366F1; background: #FAF5FF; }

/* KPI Stats cards (matches .vl-stat-card) */
.vh-stats-row { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; margin-bottom: 20px; }
@media (max-width: 1200px) { .vh-stats-row { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 768px) { .vh-stats-row { grid-template-columns: 1fr; } }

.vh-stat-card { background: #fff; border: 1.5px solid #F1F5F9; border-radius: 14px; padding: 14px 16px; display: flex; align-items: center; gap: 14px; box-shadow: 0 1px 3px rgba(0,0,0,.03); transition: transform .15s, box-shadow .15s; }
.vh-stat-card:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,.06); }
.vh-stat-ic { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.vh-stat-info { min-width: 0; flex: 1; }
.vh-stat-lbl { font-size: 10px; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: .06em; margin-bottom: 2px; }
.vh-stat-val { font-family: 'Outfit', sans-serif; font-size: 22px; font-weight: 800; color: #0F172A; line-height: 1.1; }
.vh-stat-trend { font-size: 10.5px; font-weight: 600; margin-top: 3px; display: flex; align-items: center; gap: 3px; }

/* Filter Card (matches .vl-filter-card) */
.vh-filter-card { background: #fff; border: 1.5px solid #F1F5F9; border-radius: 14px; padding: 14px 18px; margin-bottom: 18px; box-shadow: 0 1px 3px rgba(0,0,0,.03); display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.vh-search-wrap { flex: 1; min-width: 240px; position: relative; display: flex; align-items: center; }
.vh-search-ic { position: absolute; left: 12px; color: #94A3B8; display: flex; pointer-events: none; }
.vh-search-input { width: 100%; padding: 8px 12px 8px 36px; border: 1.5px solid #E2E8F0; border-radius: 10px; font-size: 13px; color: #0F172A; outline: none; background: #F8FAFC; transition: all .15s; font-family: inherit; }
.vh-search-input:focus { border-color: #6366F1; background: #fff; box-shadow: 0 0 0 3px rgba(99,102,241,0.08); }
.vh-filter-grp { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.vh-select { padding: 8px 12px; border: 1.5px solid #E2E8F0; border-radius: 10px; font-size: 12.5px; color: #334155; background: #fff; font-weight: 600; cursor: pointer; outline: none; transition: border-color .15s; font-family: inherit; }
.vh-select:focus { border-color: #6366F1; }
.vh-date-input { padding: 7px 12px; border: 1.5px solid #E2E8F0; border-radius: 10px; font-size: 12.5px; color: #334155; background: #fff; outline: none; font-family: inherit; }
.vh-date-input:focus { border-color: #6366F1; }

/* Table View (matches .vl-table-card) */
.vh-table-card { background: #fff; border: 1.5px solid #F1F5F9; border-radius: 16px; box-shadow: 0 1px 4px rgba(0,0,0,.04); overflow: hidden; }
.vh-table-wrap { width: 100%; overflow-x: auto; }
.vh-table { width: 100%; border-collapse: collapse; text-align: left; }
.vh-table th { background: #F8FAFC; padding: 12px 16px; font-size: 10.5px; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: .06em; border-bottom: 1.5px solid #F1F5F9; white-space: nowrap; }
.vh-table td { padding: 13px 16px; font-size: 12.5px; color: #334155; border-bottom: 1px solid #F8FAFC; vertical-align: middle; }
.vh-table tr:hover td { background: #F8FAFC; }

.vh-renter-cell { display: flex; align-items: center; gap: 10px; }
.vh-avatar { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, #6366F1, #8B5CF6); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0; }
.vh-renter-name { font-weight: 700; color: #0F172A; }
.vh-ride-id { font-size: 11px; color: #64748B; margin-top: 1px; font-family: monospace; }

.vh-veh-cell { display: flex; align-items: center; gap: 10px; }
.vh-veh-img-box { width: 36px; height: 36px; border-radius: 8px; background: #F8FAFC; border: 1px solid #E2E8F0; display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0; }
.vh-veh-img { width: 100%; height: 100%; object-fit: contain; }
.vh-veh-code { font-size: 12.5px; font-weight: 700; color: #0F172A; }

.vh-badge { font-size: 11px; font-weight: 700; padding: 3px 9px; border-radius: 6px; display: inline-block; white-space: nowrap; }
.vh-badge.completed { background: #DCFCE7; color: #16A34A; }
.vh-badge.canceled { background: #FEE2E2; color: #EF4444; }
.vh-badge.retained { background: #E0E7FF; color: #4338CA; }

.vh-act-btn { width: 32px; height: 32px; border-radius: 8px; border: 1.5px solid #E2E8F0; background: #fff; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; transition: all .15s; text-decoration: none; color: #475569; }
.vh-act-btn:hover { border-color: #6366F1; color: #6366F1; background: #F5F3FF; }

/* Pagination (matches .vl-pag-row) */
.vh-pag-row { display: flex; align-items: center; justify-content: space-between; padding: 14px 20px; border-top: 1px solid #F1F5F9; }
.vh-pag-lbl { font-size: 12px; color: #64748B; }
.vh-pag-ctrls { display: flex; align-items: center; gap: 6px; }
.vh-pag-btn { padding: 6px 12px; border: 1.5px solid #E2E8F0; border-radius: 8px; background: #fff; font-size: 12px; font-weight: 600; color: #334155; cursor: pointer; }
.vh-pag-btn:hover:not(:disabled) { border-color: #6366F1; color: #6366F1; }
.vh-pag-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.vh-pag-num { width: 30px; height: 30px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; cursor: pointer; }
.vh-pag-num.active { background: #6366F1; color: #fff; }
.vh-pag-num:hover:not(.active) { background: #F8FAFC; }
`;

const SI = { fill: 'none', stroke: 'currentColor', strokeWidth: 2.2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
const Sv = (p: React.SVGProps<SVGSVGElement> & { s?: number }) => (
  <svg width={p.s || 14} height={p.s || 14} viewBox="0 0 24 24" {...SI} {...p} />
);

const ISearch = () => <Sv><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></Sv>;
const IDownload = () => <Sv><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></Sv>;
const IFileText = () => <Sv><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></Sv>;
const IRide = ({ s = 18 }) => <Sv s={s}><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></Sv>;
const ICheckCircle = ({ s = 18 }) => <Sv s={s}><circle cx="12" cy="12" r="10"/><polyline points="9 12 12 15 16 10"/></Sv>;
const IClock = ({ s = 18 }) => <Sv s={s}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></Sv>;
const IRupee = ({ s = 18 }) => <Sv s={s}><line x1="6" y1="3" x2="18" y2="3"/><line x1="6" y1="8" x2="18" y2="8"/><path d="M6 13h4a4 4 0 0 0 0-8"/><path d="M9 13l6 8"/></Sv>;
const IXCircle = ({ s = 18 }) => <Sv s={s}><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></Sv>;

export default function HistoryPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dbRenterList, setDbRenterList] = useState<any[]>([]);

  useEffect(() => {
    api.get('/renters')
      .then(res => {
        if (res && res.data) {
          const historicalOnly = res.data.filter((r: any) => 
            r.status === 'Return' || r.status === 'Extend' || r.status === 'Completed' || r.status === 'Canceled'
          );
          setDbRenterList(historicalOnly);
        }
      })
      .catch(err => console.error(err));
  }, []);

  const historicalRides = useMemo(() => {
    return dbRenterList.map((r) => {
      const isCanceled = r.status === 'Canceled';
      const isRetained = r.status === 'Extend';
      const statusLabel = isCanceled ? 'Canceled' : isRetained ? 'Retained' : 'Completed';
      const badgeCls = isCanceled ? 'canceled' : isRetained ? 'retained' : 'completed';
      const rawRent = parseFloat(r.rent || '0') || 0;

      return {
        rideId: `RID-2026-${String(r.id || '').padStart(4, '0').slice(-4)}`,
        renter: r.rider_name || 'Evegah Rider',
        mobile: r.mobile_number || '',
        code: r.vehicle_id || 'EV-01',
        type: 'Electric Scooter',
        date: r.return_date ? new Date(r.return_date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
        distance: `${((r.id * 3.7) % 12 + 2.5).toFixed(1)} km`,
        duration: `${Math.round(((r.id * 5) % 35) + 12)} mins`,
        fareRaw: rawRent,
        fare: `₹${rawRent.toLocaleString('en-IN')}`,
        payment: 'UPI (Settled)',
        status: statusLabel,
        badgeCls,
        imgSrc: '/City-1.png'
      };
    });
  }, [dbRenterList]);

  const filtered = historicalRides.filter(r => {
    const matchesSearch = r.renter.toLowerCase().includes(search.toLowerCase()) || 
                          r.rideId.toLowerCase().includes(search.toLowerCase()) || 
                          r.code.toLowerCase().includes(search.toLowerCase()) ||
                          r.mobile.includes(search);
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalCompleted = historicalRides.filter(r => r.status === 'Completed').length;
  const totalRetained = historicalRides.filter(r => r.status === 'Retained').length;
  const totalCanceled = historicalRides.filter(r => r.status === 'Canceled').length;
  const totalRevenue = historicalRides.reduce((acc, r) => acc + r.fareRaw, 0);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="vh-shell">
        <Sidebar activePath="/vehicles/history" />
        <div className="vh-main">
          <TopBar />
          <div className="vh-page">

            {/* Breadcrumb */}
            <div className="vh-bc">
              <Link href="/">Home</Link>
              <span className="vh-bc-sep">›</span>
              <Link href="/vehicles/all">Vehicles</Link>
              <span className="vh-bc-sep">›</span>
              <span className="vh-bc-cur">History</span>
            </div>

            {/* Title Row */}
            <div className="vh-title-row">
              <div>
                <h1 className="vh-h1">Ride History</h1>
                <p className="vh-sub">Analyze and browse all past rides, trip logs, and completed bookings.</p>
              </div>
              <div className="vh-hdr-actions">
                <button className="vh-hdr-btn" onClick={() => alert('Exporting ride history report...')}>
                  <IDownload /> Export Reports
                </button>
              </div>
            </div>

            {/* Metric KPI cards matching Vehicle List Card Design */}
            <div className="vh-stats-row">
              {[
                { lbl: 'TOTAL RIDES', val: historicalRides.length, trend: 'Historical Bookings', ic: <IRide s={20}/>, bg: '#2A195C', clr: '#16A34A' },
                { lbl: 'COMPLETED', val: totalCompleted, trend: 'Successfully Closed', ic: <ICheckCircle s={20}/>, bg: '#10B981', clr: '#16A34A' },
                { lbl: 'RETAINED / EXTENDED', val: totalRetained, trend: 'Extended Commutes', ic: <IClock s={20}/>, bg: '#3B82F6', clr: '#16A34A' },
                { lbl: 'TOTAL REVENUE', val: `₹${totalRevenue.toLocaleString('en-IN')}`, trend: 'Fare Collections', ic: <IRupee s={20}/>, bg: '#F59E0B', clr: '#16A34A' },
                { lbl: 'CANCELED', val: totalCanceled, trend: 'Refunded / Void', ic: <IXCircle s={20}/>, bg: '#EF4444', clr: '#EF4444' }
              ].map(s => (
                <div className="vh-stat-card" key={s.lbl}>
                  <div className="vh-stat-ic" style={{ background: s.bg, color: '#fff' }}>
                    {s.ic}
                  </div>
                  <div className="vh-stat-info">
                    <div className="vh-stat-lbl">{s.lbl}</div>
                    <div className="vh-stat-val">{s.val}</div>
                    <div className="vh-stat-trend" style={{ color: s.clr }}>
                      <span style={{ fontSize: 8 }}>▲</span> {s.trend}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Search and filters matching .vl-filter-card */}
            <div className="vh-filter-card">
              <div className="vh-search-wrap">
                <span className="vh-search-ic"><ISearch /></span>
                <input 
                  type="text" 
                  className="vh-search-input" 
                  placeholder="Search by Ride ID, Renter, Mobile, or Scooter Code..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="vh-filter-grp">
                <select 
                  className="vh-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">All Statuses</option>
                  <option value="Completed">Completed Only</option>
                  <option value="Retained">Retained Only</option>
                  <option value="Canceled">Canceled Only</option>
                </select>

                <input type="date" className="vh-date-input" defaultValue="2026-10-01" />
                <span style={{ fontSize: 12, color: '#94A3B8', fontWeight: 600 }}>to</span>
                <input type="date" className="vh-date-input" defaultValue="2026-11-08" />
              </div>
            </div>

            {/* History Table matching .vl-table-card */}
            <div className="vh-table-card">
              <div className="vh-table-wrap">
                <table className="vh-table">
                  <thead>
                    <tr>
                      <th>Ride ID / Renter</th>
                      <th>Vehicle</th>
                      <th>Date &amp; Time</th>
                      <th>Distance</th>
                      <th>Duration</th>
                      <th>Fare &amp; Payment</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(r => (
                      <tr key={r.rideId}>
                        <td>
                          <div className="vh-renter-cell">
                            <div className="vh-avatar">
                              {r.renter.split(' ').map((n: string) => n[0]).slice(0, 2).join('')}
                            </div>
                            <div>
                              <div className="vh-renter-name">{r.renter}</div>
                              <div className="vh-ride-id">{r.rideId}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="vh-veh-cell">
                            <div className="vh-veh-img-box">
                              <img src={r.imgSrc} alt={r.code} className="vh-veh-img" />
                            </div>
                            <span className="vh-veh-code">{r.code}</span>
                          </div>
                        </td>
                        <td style={{ fontWeight: 500, color: '#475569' }}>
                          {r.date}
                        </td>
                        <td style={{ fontWeight: 600 }}>
                          {r.distance}
                        </td>
                        <td style={{ fontWeight: 600 }}>
                          {r.duration}
                        </td>
                        <td>
                          <div>
                            <div style={{ fontWeight: 700, color: r.status === 'Canceled' ? '#94A3B8' : '#0F172A' }}>{r.fare}</div>
                            <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>{r.payment}</div>
                          </div>
                        </td>
                        <td>
                          <span className={`vh-badge ${r.badgeCls}`}>{r.status}</span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
                            <button className="vh-act-btn" title="View Ride Log" onClick={() => alert(`Ride Log for ${r.rideId}`)}>
                              <IFileText />
                            </button>
                            <Link href="/vehicles/map" className="vh-act-btn" title="View Map Path">
                              <Sv><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></Sv>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={8} style={{ textAlign: 'center', padding: '36px 0', color: '#94A3B8', fontWeight: 600 }}>
                          No historical rides found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination matching .vl-pag-row */}
              <div className="vh-pag-row">
                <span className="vh-pag-lbl">Showing 1 to {filtered.length} of {filtered.length} historical entries</span>
                <div className="vh-pag-ctrls">
                  <button className="vh-pag-btn" disabled>Previous</button>
                  <div className="vh-pag-num active">1</div>
                  <button className="vh-pag-btn" disabled>Next</button>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </>
  );
}
