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

.up-shell {
  display: flex;
  min-height: 100vh;
  background: #F6F7FC;
  font-family: 'Plus Jakarta Sans', sans-serif;
  color: #0F172A;
}
.up-main {
  margin-left: 230px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: calc(100% - 230px);
  min-width: 0;
}
.up-page {
  flex: 1;
  padding: 20px 26px 64px;
  max-width: 1560px;
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
}

/* Breadcrumb */
.up-bc {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12.5px;
  color: #64748B;
  font-weight: 500;
  margin-bottom: 6px;
}
.up-bc a { color: #64748B; text-decoration: none; font-weight: 600; }
.up-bc a:hover { color: #2A195C; }
.up-bc-sep { color: #CBD5E1; }
.up-bc-cur { color: #2A195C; font-weight: 800; }

/* Header & Action bar */
.up-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}
.up-h1 {
  font-size: 22px;
  font-weight: 900;
  color: #0F172A;
  margin: 0 0 4px;
  letter-spacing: -0.02em;
}
.up-sub {
  font-size: 13px;
  color: #64748B;
  margin: 0;
  font-weight: 500;
}

.up-hdr-btns {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.up-btn-outline {
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
.up-btn-outline:hover { border-color: #2A195C; color: #2A195C; background: #FAF9FF; }
.up-btn-primary {
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
.up-btn-primary:hover { background: #4338CA; border-color: #4338CA; }

/* Filter Controls Row */
.up-filter-row {
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
.up-search-box {
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
.up-search-box input {
  border: none;
  outline: none;
  width: 100%;
  font-size: 12.5px;
  color: #0F172A;
  font-family: inherit;
  font-weight: 600;
}
.up-select {
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
.up-layout {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 20px;
  align-items: start;
}

/* Table Container */
.up-table-card {
  background: #fff;
  border: 1.5px solid #EAECF4;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,.02);
}
.up-tbl-wrap {
  overflow-x: auto;
}
.up-tbl {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 12.5px;
  min-width: 860px;
}
.up-tbl th {
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
.up-tbl td {
  padding: 13px 14px;
  font-size: 12.5px;
  color: #1E293B;
  border-bottom: 1px solid #F1F5F9;
  vertical-align: middle;
}
.up-tbl tr:hover td { background: #FAF9FF; }

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

/* Right Summary Card */
.up-summary-box {
  background: #fff;
  border: 1.5px solid #EAECF4;
  border-radius: 14px;
  padding: 18px;
  box-shadow: 0 1px 3px rgba(0,0,0,.02);
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.up-sum-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12.5px;
}

@media (max-width: 1120px) {
  .up-layout { grid-template-columns: 1fr; }
}

@media (max-width: 860px) {
  .up-shell { flex-direction: column; }
  .up-main { margin-left: 0; width: 100%; }
  .up-page { padding: 16px; }
}
`;

export default function UpcomingMaintenancePage() {
  const router = useRouter();
  const [upcomingList, setUpcomingList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All Priorities');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchUpcoming = async () => {
    setLoading(true);
    try {
      const res: any = await api.get('/maintenance');
      const list = res?.data || (Array.isArray(res) ? res : []);
      // Filter to upcoming / active repairs
      const filtered = list.filter((r: any) =>
        ['scheduled', 'in progress', 'under maintenance', 'due soon'].includes((r.status || '').toLowerCase())
      );
      setUpcomingList(filtered);
    } catch (err) {
      console.error('Error fetching upcoming services:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpcoming();
  }, []);

  const filteredServices = useMemo(() => {
    return upcomingList.filter((row) => {
      if (priorityFilter !== 'All Priorities' && row.priority !== priorityFilter) {
        return false;
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
  }, [upcomingList, priorityFilter, search]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="up-shell">
        <Sidebar activePath="/maintenance/upcoming" />
        <div className="up-main">
          <TopBar showHand={false} />

          <div className="up-page">
            {/* Breadcrumb */}
            <div className="up-bc">
              <Link href="/maintenance/overview">Home</Link>
              <span className="up-bc-sep">&gt;</span>
              <span>Maintenance</span>
              <span className="up-bc-sep">&gt;</span>
              <span className="up-bc-cur">Upcoming &amp; Scheduled Services</span>
            </div>

            {/* Header */}
            <div className="up-header">
              <div>
                <h1 className="up-h1">Upcoming &amp; Scheduled Maintenance</h1>
                <p className="up-sub">
                  Monitor active workshop repairs, scheduled inspections, and rider damage claims in queue.
                </p>
              </div>
              <div className="up-hdr-btns">
                <button className="up-btn-outline" onClick={fetchUpcoming}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
                  Refresh
                </button>
                <button className="up-btn-primary" onClick={() => setIsModalOpen(true)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  + Create Job Card
                </button>
              </div>
            </div>

            {/* Same KPI Strip as Renter page */}
            <MaintenanceKpiStrip />

            {/* Filter Row */}
            <div className="up-filter-row">
              <div className="up-search-box">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input
                  type="text"
                  placeholder="Search by Vehicle, Rider, Priority, Tech..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <button onClick={() => setSearch('')} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#94A3B8' }}>×</button>
                )}
              </div>

              <select className="up-select" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
                <option value="All Priorities">All Priorities</option>
                <option value="Critical / Urgent">Critical / Urgent</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            {/* 2-Column Responsive Layout */}
            <div className="up-layout">
              {/* Left Column: Upcoming Work Orders */}
              <div>
                <div className="up-table-card">
                  <div className="up-tbl-wrap">
                    {loading ? (
                      <div style={{ textAlign: 'center', padding: '40px', color: '#64748B', fontWeight: 600 }}>
                        Loading upcoming work orders...
                      </div>
                    ) : filteredServices.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '40px', color: '#64748B', fontWeight: 600 }}>
                        No upcoming or active maintenance jobs found.
                      </div>
                    ) : (
                      <table className="up-tbl">
                        <thead>
                          <tr>
                            <th>Job Card / Target Date</th>
                            <th>Vehicle &amp; Model</th>
                            <th>Rider &amp; Liability</th>
                            <th>Repair Scope</th>
                            <th>Est. Expense</th>
                            <th>Status &amp; Tech</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredServices.map((row) => {
                            const isRdr = (row.fault_type || '').includes('Rider') || !!row.rider_name;
                            const totalExp = Number(row.total_cost || row.estimated_cost || 0);
                            const dueDateStr = row.due_date ? new Date(row.due_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : 'Due Soon';

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
                                    Target: {dueDateStr}
                                  </div>
                                </td>

                                <td>
                                  <div style={{ fontWeight: 800, color: '#0F172A' }}>
                                    {row.vehicle_code}
                                  </div>
                                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>
                                    {row.vehicle_model}
                                  </div>
                                </td>

                                <td>
                                  {isRdr ? (
                                    <div>
                                      <div style={{ fontWeight: 800, color: '#0F172A' }}>
                                        {row.rider_name}
                                      </div>
                                      <span className="pill-badge pill-red">⚠️ Rider Liable</span>
                                    </div>
                                  ) : (
                                    <div>
                                      <span className="pill-badge pill-gray">🛡️ Fleet Periodic</span>
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
                                </td>

                                <td>
                                  <span className={`pill-badge ${
                                    row.priority === 'Critical / Urgent' ? 'pill-red' : 'pill-amber'
                                  }`}>
                                    {row.status} • {row.priority}
                                  </span>
                                  <div style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 600, marginTop: '2px' }}>
                                    Tech: {row.assigned_technician?.split(' ')[0] || 'Unassigned'}
                                  </div>
                                </td>

                                <td style={{ textAlign: 'right' }}>
                                  <button
                                    className="up-btn-outline"
                                    style={{ padding: '4px 8px', fontSize: '11px', height: '26px' }}
                                    onClick={() => router.push(`/maintenance/job-cards/${row.job_card_number || row.ticket_id || row.id}`)}
                                  >
                                    Job Card
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

              {/* Right Column: Workshop Capacity Summary */}
              <div>
                <div className="up-summary-box">
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2A195C" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    Workshop Active Queue
                  </div>

                  <div className="up-sum-row">
                    <span style={{ color: '#64748B', fontWeight: 600 }}>Active in Workshop:</span>
                    <span style={{ fontWeight: 800, color: '#2A195C' }}>{filteredServices.length} Units</span>
                  </div>

                  <div className="up-sum-row">
                    <span style={{ color: '#64748B', fontWeight: 600 }}>Critical / Urgent:</span>
                    <span style={{ fontWeight: 800, color: '#EF4444' }}>
                      {filteredServices.filter(s => s.priority === 'Critical / Urgent' || s.priority === 'High').length}
                    </span>
                  </div>

                  <div className="up-sum-row">
                    <span style={{ color: '#64748B', fontWeight: 600 }}>Rider Billable Repairs:</span>
                    <span style={{ fontWeight: 800, color: '#B45309' }}>
                      {filteredServices.filter(s => s.rider_name).length}
                    </span>
                  </div>

                  <div style={{ borderTop: '1px solid #EAECF4', paddingTop: '10px', marginTop: '6px' }} className="up-sum-row">
                    <span style={{ fontWeight: 800, color: '#0F172A' }}>Estimated Workshop Total:</span>
                    <span style={{ fontSize: '16px', fontWeight: 900, color: '#2A195C' }}>
                      ₹{filteredServices.reduce((sum, r) => sum + Number(r.total_cost || r.estimated_cost || 0), 0).toLocaleString()}
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
        onSuccess={fetchUpcoming}
      />
    </>
  );
}
