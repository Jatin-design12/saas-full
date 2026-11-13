'use client';
import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import MaintenanceKpiStrip from '@/components/MaintenanceKpiStrip';
import CreateJobCardModal from '@/components/CreateJobCardModal';
import { api } from '@/lib/api';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

.his-shell {
  display: flex;
  min-height: 100vh;
  background: #F6F7FC;
  font-family: 'Plus Jakarta Sans', sans-serif;
  color: #0F172A;
}
.his-main {
  margin-left: 230px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: calc(100% - 230px);
  min-width: 0;
}
.his-page {
  flex: 1;
  padding: 20px 26px 64px;
  max-width: 1560px;
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
}

/* Breadcrumb */
.his-bc {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12.5px;
  color: #64748B;
  font-weight: 500;
  margin-bottom: 6px;
}
.his-bc a { color: #64748B; text-decoration: none; font-weight: 600; }
.his-bc a:hover { color: #2A195C; }
.his-bc-sep { color: #CBD5E1; }
.his-bc-cur { color: #2A195C; font-weight: 800; }

/* Header & Action bar */
.his-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}
.his-h1 {
  font-size: 22px;
  font-weight: 900;
  color: #0F172A;
  margin: 0 0 4px;
  letter-spacing: -0.02em;
}
.his-sub {
  font-size: 13px;
  color: #64748B;
  margin: 0;
  font-weight: 500;
}

.his-hdr-btns {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.his-btn-outline {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 8px 16px;
  background: #fff;
  border: 1.5px solid #E2E8F0;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  color: #334155;
  cursor: pointer;
  transition: all .15s;
}
.his-btn-outline:hover { border-color: #2A195C; color: #2A195C; background: #FAF9FF; }
.his-btn-primary {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 8px 18px;
  background: #2A195C;
  border: 1.5px solid #2A195C;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  color: #fff;
  cursor: pointer;
  transition: all .15s;
}
.his-btn-primary:hover { background: #4338CA; border-color: #4338CA; }

/* Filter Controls Row */
.his-filter-row {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #fff;
  border: 1.5px solid #EAECF4;
  border-radius: 14px;
  padding: 12px 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,.02);
  flex-wrap: wrap;
  margin-bottom: 20px;
}
.his-search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1.5;
  min-width: 240px;
  border: 1.5px solid #E2E8F0;
  border-radius: 9px;
  padding: 0 12px;
  height: 38px;
  background: #fff;
}
.his-search-box input {
  border: none;
  outline: none;
  width: 100%;
  font-size: 12.5px;
  color: #0F172A;
  font-family: inherit;
  font-weight: 600;
}
.his-select {
  border: 1.5px solid #E2E8F0;
  border-radius: 9px;
  padding: 0 12px;
  height: 38px;
  font-size: 12.5px;
  color: #334155;
  font-weight: 700;
  background: #fff;
  outline: none;
  cursor: pointer;
}

/* 2-Column Responsive Layout */
.his-layout {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 20px;
  align-items: start;
}

/* Table Container */
.his-table-card {
  background: #fff;
  border: 1.5px solid #EAECF4;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,.02);
}
.his-tbl-wrap {
  overflow-x: auto;
}
.his-tbl {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 12.5px;
  min-width: 860px;
}
.his-tbl th {
  font-size: 10.5px;
  font-weight: 800;
  color: #64748B;
  text-transform: uppercase;
  padding: 13px 14px;
  background: #FAFBFD;
  border-bottom: 1.5px solid #EAECF4;
  letter-spacing: 0.05em;
  white-space: nowrap;
}
.his-tbl td {
  padding: 13px 14px;
  font-size: 12.5px;
  color: #1E293B;
  border-bottom: 1px solid #F1F5F9;
  vertical-align: middle;
}
.his-tbl tr:hover td { background: #FAF9FF; }

/* Status Badges */
.pill-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 800;
  white-space: nowrap;
}
.pill-red { background: #FEF2F2; color: #EF4444; border: 1px solid #FECACA; }
.pill-green { background: #ECFDF5; color: #059669; border: 1px solid #A7F3D0; }
.pill-amber { background: #FFFBEB; color: #B45309; border: 1px solid #FDE68A; }
.pill-blue { background: #EFF6FF; color: #2563EB; border: 1px solid #BFDBFE; }
.pill-gray { background: #F1F5F9; color: #64748B; border: 1px solid #E2E8F0; }

/* Vehicle Summary Card */
.veh-summary-box {
  background: #fff;
  border: 1.5px solid #EAECF4;
  border-radius: 14px;
  padding: 18px;
  box-shadow: 0 1px 3px rgba(0,0,0,.02);
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.veh-sum-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12.5px;
}
.veh-sum-val {
  font-weight: 800;
  color: #0F172A;
}

@media (max-width: 1120px) {
  .his-layout { grid-template-columns: 1fr; }
}

@media (max-width: 860px) {
  .his-shell { flex-direction: column; }
  .his-main { margin-left: 0; width: 100%; }
  .his-page { padding: 16px; }
}
`;

export default function MaintenanceHistoryPage() {
  const router = useRouter();
  const [historyList, setHistoryList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [vehicleFilter, setVehicleFilter] = useState('All');
  const [faultFilter, setFaultFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res: any = await api.get('/maintenance');
      const list = res?.data || (Array.isArray(res) ? res : []);
      setHistoryList(list);
    } catch (err) {
      console.error('Error fetching maintenance history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const uniqueVehicles = useMemo(() => {
    const set = new Set<string>();
    historyList.forEach(r => {
      if (r.vehicle_code) set.add(r.vehicle_code);
    });
    return Array.from(set);
  }, [historyList]);

  const filteredHistory = useMemo(() => {
    return historyList.filter(row => {
      if (vehicleFilter !== 'All' && row.vehicle_code !== vehicleFilter) {
        return false;
      }
      if (faultFilter === 'rider_damage') {
        const isRdr = (row.fault_type || '').includes('Rider') || !!row.rider_name;
        if (!isRdr) return false;
      } else if (faultFilter === 'fleet') {
        const isRdr = (row.fault_type || '').includes('Rider') || !!row.rider_name;
        if (isRdr) return false;
      }

      if (search.trim()) {
        const q = search.toLowerCase();
        const matches =
          (row.ticket_id || '').toLowerCase().includes(q) ||
          (row.job_card_number || '').toLowerCase().includes(q) ||
          (row.vehicle_code || '').toLowerCase().includes(q) ||
          (row.vehicle_model || '').toLowerCase().includes(q) ||
          (row.rider_name || '').toLowerCase().includes(q) ||
          (row.issue_category || '').toLowerCase().includes(q) ||
          (row.assigned_technician || '').toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [historyList, vehicleFilter, faultFilter, search]);

  // Aggregate metrics for selected vehicle or all
  const summaryMetrics = useMemo(() => {
    let totalExpense = 0;
    let riderRecovered = 0;
    let pendingRecovery = 0;
    let riderIncidentsCount = 0;

    filteredHistory.forEach(r => {
      const cost = Number(r.total_cost || r.estimated_cost || 0);
      totalExpense += cost;
      const isRdr = (r.fault_type || '').includes('Rider') || !!r.rider_name;
      if (isRdr) {
        riderIncidentsCount++;
        const charge = Number(r.rider_charge_amount || cost);
        if (r.rider_payment_status === 'Paid via UPI' || r.rider_payment_status === 'Deducted from Deposit') {
          riderRecovered += charge;
        } else if (r.rider_payment_status === 'Pending Recovery') {
          pendingRecovery += charge;
        }
      }
    });

    return { totalExpense, riderRecovered, pendingRecovery, riderIncidentsCount };
  }, [filteredHistory]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="his-shell">
        <Sidebar activePath="/maintenance/history" />
        <div className="his-main">
          <TopBar showHand={false} />

          <div className="his-page">
            {/* Breadcrumb */}
            <div className="his-bc">
              <Link href="/maintenance/overview">Home</Link>
              <span className="his-bc-sep">&gt;</span>
              <span>Maintenance</span>
              <span className="his-bc-sep">&gt;</span>
              <span className="his-bc-cur">Vehicle Maintenance History</span>
            </div>

            {/* Header */}
            <div className="his-header">
              <div>
                <h1 className="his-h1">Vehicle Maintenance &amp; Damage History</h1>
                <p className="his-sub">
                  Complete historical log of repairs, damages caused by riders, expense allocation, and billing recovery.
                </p>
              </div>
              <div className="his-hdr-btns">
                <button className="his-btn-outline" onClick={fetchHistory}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
                  Refresh
                </button>
                <button className="his-btn-primary" onClick={() => setIsModalOpen(true)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  + Create Job Card
                </button>
              </div>
            </div>

            {/* Same KPI Strip as Renter page */}
            <MaintenanceKpiStrip />

            {/* Filters Row */}
            <div className="his-filter-row">
              <div className="his-search-box">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input
                  type="text"
                  placeholder="Search by Vehicle, Rider Name, Issue, Tech..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <button onClick={() => setSearch('')} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#94A3B8' }}>×</button>
                )}
              </div>

              <select className="his-select" value={vehicleFilter} onChange={(e) => setVehicleFilter(e.target.value)}>
                <option value="All">All Fleet Vehicles ({uniqueVehicles.length})</option>
                {uniqueVehicles.map((v) => (
                  <option key={v} value={v}>Vehicle: {v}</option>
                ))}
              </select>

              <select className="his-select" value={faultFilter} onChange={(e) => setFaultFilter(e.target.value)}>
                <option value="All">All Liability Types</option>
                <option value="rider_damage">⚠️ Rider Damage Incidents Only</option>
                <option value="fleet">🛡️ Normal Wear &amp; Tear / Fleet</option>
              </select>
            </div>

            {/* 2-Column Responsive Layout */}
            <div className="his-layout">
              {/* Left Column: History Table */}
              <div>
                <div className="his-table-card">
                  <div className="his-tbl-wrap">
                    {loading ? (
                      <div style={{ textAlign: 'center', padding: '40px', color: '#64748B', fontWeight: 600 }}>
                        Loading maintenance history...
                      </div>
                    ) : filteredHistory.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '40px', color: '#64748B', fontWeight: 600 }}>
                        No maintenance history logs found.
                      </div>
                    ) : (
                      <table className="his-tbl">
                        <thead>
                          <tr>
                            <th>Job Card / Date</th>
                            <th>Vehicle &amp; Model</th>
                            <th>Rider &amp; Responsibility</th>
                            <th>Issue / Damage</th>
                            <th>Expense Breakdown</th>
                            <th>Recovery Status</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredHistory.map((row) => {
                            const isRdr = (row.fault_type || '').includes('Rider') || !!row.rider_name;
                            const totalExp = Number(row.total_cost || row.estimated_cost || 0);
                            const partsExp = Number(row.parts_cost || 0);
                            const laborExp = Number(row.labor_cost || 0);
                            const dateStr = row.created_at ? new Date(row.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Recent';

                            return (
                              <tr
                                key={row.id || row.ticket_id}
                                style={{ cursor: 'pointer' }}
                                onClick={() => router.push(`/maintenance/job-cards/${row.job_card_number || row.ticket_id || row.id}`)}
                              >
                                <td>
                                  <div style={{ fontWeight: 800, color: '#2A195C', fontFamily: 'monospace' }}>
                                    {row.job_card_number || row.ticket_id}
                                  </div>
                                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>
                                    {dateStr}
                                  </div>
                                </td>

                                <td>
                                  <div style={{ fontWeight: 800, color: '#0F172A' }}>
                                    {row.vehicle_code}
                                  </div>
                                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>
                                    {row.vehicle_model} • {row.km_reading || '4,200 km'}
                                  </div>
                                </td>

                                <td>
                                  {isRdr ? (
                                    <div>
                                      <div style={{ fontWeight: 800, color: '#0F172A' }}>
                                        {row.rider_name}
                                      </div>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                                        <span className="pill-badge pill-red">⚠️ Rider Liable</span>
                                        {row.reservation_id && (
                                          <span style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 700 }}>
                                            #{row.reservation_id}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  ) : (
                                    <div>
                                      <span className="pill-badge pill-gray">🛡️ Fleet Wear &amp; Tear</span>
                                      <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, marginTop: '2px' }}>
                                        Company Expense
                                      </div>
                                    </div>
                                  )}
                                </td>

                                <td>
                                  <div style={{ fontWeight: 800, color: '#0F172A' }}>
                                    {row.issue_category}
                                  </div>
                                  <div style={{ fontSize: '11px', color: '#64748B', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {row.description}
                                  </div>
                                </td>

                                <td>
                                  <div style={{ fontWeight: 800, color: '#0F172A' }}>
                                    ₹{totalExp.toFixed(2)}
                                  </div>
                                  <div style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 600 }}>
                                    Parts: ₹{partsExp} | Labor: ₹{laborExp}
                                  </div>
                                </td>

                                <td>
                                  {isRdr ? (
                                    <span className={`pill-badge ${
                                      row.rider_payment_status === 'Paid via UPI' || row.rider_payment_status === 'Deducted from Deposit'
                                        ? 'pill-green'
                                        : 'pill-amber'
                                    }`}>
                                      {row.rider_payment_status || 'Pending Recovery'}
                                    </span>
                                  ) : (
                                    <span className="pill-badge pill-gray">Fleet Absorbed</span>
                                  )}
                                </td>

                                <td style={{ textAlign: 'right' }}>
                                  <button
                                    className="his-btn-outline"
                                    style={{ padding: '4px 8px', fontSize: '11px', height: '26px' }}
                                    onClick={() => router.push(`/maintenance/job-cards/${row.job_card_number || row.ticket_id || row.id}`)}
                                  >
                                    View Job Card
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Historical Expense & Rider Damage Summary */}
              <div>
                <div className="veh-summary-box">
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2A195C" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/></svg>
                    {vehicleFilter === 'All' ? 'Fleet Maintenance Summary' : `Vehicle ${vehicleFilter} Summary`}
                  </div>

                  <div className="veh-sum-row">
                    <span style={{ color: '#64748B', fontWeight: 600 }}>Total Records:</span>
                    <span className="veh-sum-val">{filteredHistory.length}</span>
                  </div>

                  <div className="veh-sum-row">
                    <span style={{ color: '#64748B', fontWeight: 600 }}>Rider Damage Incidents:</span>
                    <span className="veh-sum-val" style={{ color: '#EF4444' }}>{summaryMetrics.riderIncidentsCount}</span>
                  </div>

                  <div className="veh-sum-row">
                    <span style={{ color: '#64748B', fontWeight: 600 }}>Recovered from Riders:</span>
                    <span className="veh-sum-val" style={{ color: '#059669' }}>₹{summaryMetrics.riderRecovered.toLocaleString()}</span>
                  </div>

                  <div className="veh-sum-row">
                    <span style={{ color: '#64748B', fontWeight: 600 }}>Pending Recovery:</span>
                    <span className="veh-sum-val" style={{ color: '#B45309' }}>₹{summaryMetrics.pendingRecovery.toLocaleString()}</span>
                  </div>

                  <div style={{ borderTop: '1px solid #EAECF4', paddingTop: '10px', marginTop: '6px' }} className="veh-sum-row">
                    <span style={{ fontWeight: 800, color: '#0F172A' }}>Total Repairs Incurred:</span>
                    <span style={{ fontSize: '16px', fontWeight: 900, color: '#2A195C' }}>
                      ₹{summaryMetrics.totalExpense.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CreateJobCardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchHistory}
      />
    </>
  );
}
