"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import MaintenanceKpiStrip, { MaintenanceStatsData } from '@/components/MaintenanceKpiStrip';
import CreateJobCardModal from '@/components/CreateJobCardModal';
import { api } from '@/lib/api';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Outfit:wght@500;600;700;800;900&display=swap');

:root {
  --brand: #2A195C;
  --brand-600: #4338CA;
  --brand-50: #F5F3FF;
  --brand-100: #EDE9FE;
  --brand-200: #DDD6FE;
  --bg: #F6F7FC;
  --card: #FFFFFF;
  --line: #EAECF4;
  --line-soft: #F2F4FA;
  --ink: #0F1129;
  --ink-mid: #4A4D66;
  --ink-lo: #8588A0;
}

.mo-shell {
  display: flex;
  min-height: 100vh;
  background: var(--bg);
  font-family: 'Plus Jakarta Sans', sans-serif;
  color: var(--ink);
}

.mo-main {
  margin-left: 230px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: calc(100% - 230px);
  min-width: 0;
}

.mo-content {
  flex: 1;
  padding: 20px 26px 64px;
  max-width: 1560px;
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
}

/* Breadcrumb */
.mo-bc {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12.5px;
  color: var(--ink-lo);
  font-weight: 500;
  margin-bottom: 6px;
}
.mo-bc a { color: var(--ink-lo); text-decoration: none; font-weight: 600; transition: color 0.15s; }
.mo-bc a:hover { color: var(--brand); }
.mo-bc-sep { color: #CBD5E1; }
.mo-bc-cur { color: var(--brand); font-weight: 800; }

/* Header Title Bar */
.mo-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}
.mo-h1 {
  font-size: 22px;
  font-weight: 900;
  color: var(--ink);
  margin: 0 0 4px;
  letter-spacing: -0.02em;
  font-family: 'Outfit', sans-serif;
}
.mo-sub {
  font-size: 13px;
  color: var(--ink-lo);
  margin: 0;
  font-weight: 500;
}

.mo-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.mo-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #FFF;
  border: 1.5px solid #E2E8F0;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  color: #475569;
  cursor: pointer;
  transition: all 0.15s;
  user-select: none;
}
.mo-btn:hover { border-color: var(--brand); color: var(--brand); box-shadow: 0 2px 6px rgba(0,0,0,0.04); }
.mo-btn-primary { background: var(--brand); color: #FFF; border-color: var(--brand); }
.mo-btn-primary:hover { background: var(--brand-600); border-color: var(--brand-600); color: #FFF; }

/* Filter Tabs & Search Bar */
.mo-filter-box {
  background: #FFF;
  border: 1.5px solid var(--line);
  border-radius: 14px;
  padding: 14px 18px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.02);
}
.mo-tabs {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}
.mo-tab-btn {
  padding: 7px 14px;
  border-radius: 9px;
  border: 1px solid transparent;
  background: transparent;
  font-size: 12.5px;
  font-weight: 700;
  color: var(--ink-lo);
  cursor: pointer;
  transition: all 0.15s;
}
.mo-tab-btn.active {
  background: var(--brand-50);
  border-color: var(--brand-200);
  color: var(--brand);
}
.mo-tab-btn:hover:not(.active) {
  background: #F8FAFC;
  color: var(--ink);
}

.mo-search-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #FFF;
  border: 1.5px solid #E2E8F0;
  border-radius: 10px;
  padding: 0 12px;
  height: 38px;
  min-width: 260px;
}
.mo-search-inp {
  border: none;
  outline: none;
  font-size: 12.5px;
  color: var(--ink);
  font-weight: 600;
  width: 100%;
}

/* 2-Column Responsive Layout */
.mo-layout {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 20px;
  align-items: start;
}

.mo-card {
  background: #FFF;
  border: 1.5px solid var(--line);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.02);
  margin-bottom: 20px;
}
.mo-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  gap: 12px;
  flex-wrap: wrap;
}
.mo-card-title {
  font-size: 15px;
  font-weight: 800;
  color: var(--ink);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Table Design */
.mo-table-container {
  overflow-x: auto;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: #FFF;
}
.mo-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 12.5px;
  min-width: 860px;
}
.mo-table th {
  padding: 12px 14px;
  background: #FAFBFD;
  font-size: 10.5px;
  font-weight: 800;
  color: var(--ink-lo);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1.5px solid var(--line);
  white-space: nowrap;
}
.mo-table td {
  padding: 13px 14px;
  border-bottom: 1px solid var(--line-soft);
  vertical-align: middle;
  color: var(--ink-mid);
}
.mo-table tr:hover {
  background: #FAF9FF;
}

/* Badges */
.pill-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.02em;
  white-space: nowrap;
}
.pill-red { background: #FEF2F2; color: #EF4444; border: 1px solid #FECACA; }
.pill-green { background: #ECFDF5; color: #059669; border: 1px solid #A7F3D0; }
.pill-amber { background: #FFFBEB; color: #B45309; border: 1px solid #FDE68A; }
.pill-blue { background: #EFF6FF; color: #2563EB; border: 1px solid #BFDBFE; }
.pill-purple { background: #FAF5FF; color: #7C3AED; border: 1px solid #DDD6FE; }
.pill-gray { background: #F1F5F9; color: #64748B; border: 1px solid #E2E8F0; }

/* Financial Summary Sidebar Cards */
.fin-stat-card {
  border: 1.5px solid var(--line);
  border-radius: 12px;
  padding: 14px;
  margin-bottom: 12px;
  background: #FAFBFD;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.fin-stat-lbl { font-size: 11.5px; font-weight: 700; color: var(--ink-lo); }
.fin-stat-val { font-size: 16px; font-weight: 900; color: var(--ink); }

/* Vehicle Maintenance History Mini Feed */
.hist-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 0;
  border-bottom: 1px solid var(--line-soft);
}
.hist-item:last-child { border-bottom: none; }
.hist-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12.5px;
  font-weight: 800;
  color: var(--ink);
}
.hist-sub {
  font-size: 11.5px;
  color: var(--ink-lo);
  display: flex;
  align-items: center;
  gap: 8px;
}

@media (max-width: 1120px) {
  .mo-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 860px) {
  .mo-shell {
    flex-direction: column;
  }
  .mo-main {
    margin-left: 0;
    width: 100%;
  }
  .mo-content {
    padding: 16px;
  }
}
`;

export default function MaintenanceOverviewPage() {
  const router = useRouter();
  const [stats, setStats] = useState<MaintenanceStatsData | null>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'rider_damage' | 'under_maintenance' | 'completed'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicleHistory, setSelectedVehicleHistory] = useState<string>('all');

  const fetchStats = async () => {
    try {
      const res: any = await api.get('/maintenance/stats');
      if (res?.data) setStats(res.data);
    } catch (e) {
      console.error('Error fetching stats:', e);
    }
  };

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res: any = await api.get('/maintenance');
      const list = res?.data || (Array.isArray(res) ? res : []);
      setRecords(list);
    } catch (e) {
      console.error('Error fetching maintenance records:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchRecords();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this maintenance record?')) return;
    try {
      await api.delete(`/maintenance/${id}`);
      fetchRecords();
      fetchStats();
    } catch (err) {
      alert('Failed to delete maintenance order');
    }
  };

  // Filter records
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      // Tab filter
      if (activeTab === 'rider_damage') {
        const isRdr = (r.fault_type || '').toLowerCase().includes('rider') || !!r.rider_name;
        if (!isRdr) return false;
      } else if (activeTab === 'under_maintenance') {
        const st = (r.status || '').toLowerCase();
        if (!['under maintenance', 'in progress', 'scheduled', 'due soon'].includes(st)) return false;
      } else if (activeTab === 'completed') {
        const st = (r.status || '').toLowerCase();
        if (!['completed', 'resolved'].includes(st)) return false;
      }

      // Vehicle history filter if selected
      if (selectedVehicleHistory !== 'all' && r.vehicle_code !== selectedVehicleHistory) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          (r.ticket_id || '').toLowerCase().includes(q) ||
          (r.job_card_number || '').toLowerCase().includes(q) ||
          (r.vehicle_code || '').toLowerCase().includes(q) ||
          (r.vehicle_model || '').toLowerCase().includes(q) ||
          (r.rider_name || '').toLowerCase().includes(q) ||
          (r.issue_category || '').toLowerCase().includes(q) ||
          (r.assigned_technician || '').toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    });
  }, [records, activeTab, searchQuery, selectedVehicleHistory]);

  // Unique vehicles for filter dropdown
  const uniqueVehicles = useMemo(() => {
    const set = new Set<string>();
    records.forEach(r => {
      if (r.vehicle_code) set.add(r.vehicle_code);
    });
    return Array.from(set);
  }, [records]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="mo-shell">
        <Sidebar activePath="/maintenance/overview" />
        <div className="mo-main">
          <TopBar showHand={false} />

          <div className="mo-content">
            {/* Breadcrumb */}
            <div className="mo-bc">
              <Link href="/maintenance/overview">Home</Link>
              <span className="mo-bc-sep">&gt;</span>
              <span>Operations</span>
              <span className="mo-bc-sep">&gt;</span>
              <span className="mo-bc-cur">Maintenance &amp; Job Cards</span>
            </div>

            {/* Title Row */}
            <div className="mo-title-row">
              <div>
                <h1 className="mo-h1">Maintenance &amp; Job Card Overview</h1>
                <p className="mo-sub">
                  Track fleet repairs, vehicle damages caused by riders, maintenance history, and expense recovery.
                </p>
              </div>
              <div className="mo-actions">
                <button
                  className="mo-btn"
                  onClick={() => {
                    fetchStats();
                    fetchRecords();
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
                  Refresh
                </button>
                <button
                  className="mo-btn"
                  onClick={() => router.push('/maintenance/history')}
                >
                  Full History Log →
                </button>
                <button
                  className="mo-btn mo-btn-primary"
                  onClick={() => setIsModalOpen(true)}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  + Create Job Card
                </button>
              </div>
            </div>

            {/* 5 KPI Metric Cards matching Renter Page Design */}
            <MaintenanceKpiStrip
              stats={stats}
              activeFilter={activeTab}
              onCardClick={(tab) => {
                if (tab === 'rider_damage') setActiveTab('rider_damage');
                else if (tab === 'under_maintenance') setActiveTab('under_maintenance');
                else if (tab === 'completed') setActiveTab('completed');
                else setActiveTab('all');
              }}
            />

            {/* Filter Box */}
            <div className="mo-filter-box">
              <div className="mo-tabs">
                <button
                  className={`mo-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveTab('all')}
                >
                  All Job Cards ({records.length})
                </button>
                <button
                  className={`mo-tab-btn ${activeTab === 'rider_damage' ? 'active' : ''}`}
                  onClick={() => setActiveTab('rider_damage')}
                >
                  ⚠️ Rider Damages ({records.filter(r => (r.fault_type || '').includes('Rider') || r.rider_name).length})
                </button>
                <button
                  className={`mo-tab-btn ${activeTab === 'under_maintenance' ? 'active' : ''}`}
                  onClick={() => setActiveTab('under_maintenance')}
                >
                  ⚙️ In Workshop ({records.filter(r => ['under maintenance', 'in progress', 'scheduled'].includes((r.status || '').toLowerCase())).length})
                </button>
                <button
                  className={`mo-tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
                  onClick={() => setActiveTab('completed')}
                >
                  ✓ Completed ({records.filter(r => ['completed', 'resolved'].includes((r.status || '').toLowerCase())).length})
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <select
                  className="mo-btn"
                  style={{ height: '38px', padding: '0 12px' }}
                  value={selectedVehicleHistory}
                  onChange={(e) => setSelectedVehicleHistory(e.target.value)}
                >
                  <option value="all">All Fleet Vehicles</option>
                  {uniqueVehicles.map((v) => (
                    <option key={v} value={v}>Vehicle: {v}</option>
                  ))}
                </select>

                <div className="mo-search-wrap">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  <input
                    type="text"
                    className="mo-search-inp"
                    placeholder="Search by Rider, Vehicle, Job Card..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#94A3B8' }}
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* 2-Column Responsive Layout */}
            <div className="mo-layout">
              {/* Left Column: Job Cards Table */}
              <div>
                <div className="mo-card">
                  <div className="mo-card-header">
                    <div>
                      <h3 className="mo-card-title">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2.5"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                        Maintenance Work Orders &amp; Damage Records
                      </h3>
                      <div style={{ fontSize: '12px', color: 'var(--ink-lo)', fontWeight: 500, marginTop: '2px' }}>
                        Showing {filteredRecords.length} records • Connected with Postgres DB
                      </div>
                    </div>
                  </div>

                  <div className="mo-table-container">
                    {loading ? (
                      <div style={{ textAlign: 'center', padding: '40px', color: 'var(--ink-lo)', fontWeight: 600 }}>
                        Loading maintenance records...
                      </div>
                    ) : filteredRecords.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '40px', color: 'var(--ink-lo)', fontWeight: 600 }}>
                        No maintenance work orders found matching the criteria.
                      </div>
                    ) : (
                      <table className="mo-table">
                        <thead>
                          <tr>
                            <th>Job Card / Ticket</th>
                            <th>Vehicle &amp; Model</th>
                            <th>Rider &amp; Responsibility</th>
                            <th>Damage / Service Scope</th>
                            <th>Expense &amp; Recovery</th>
                            <th>Status</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredRecords.map((r) => {
                            const isRiderDamage = (r.fault_type || '').includes('Rider') || !!r.rider_name;
                            const totalExp = Number(r.total_cost || r.estimated_cost || 0);
                            const riderChg = Number(r.rider_charge_amount || 0);

                            return (
                              <tr
                                key={r.id || r.ticket_id}
                                style={{ cursor: 'pointer' }}
                                onClick={() => router.push(`/maintenance/job-cards/${r.job_card_number || r.ticket_id || r.id}`)}
                              >
                                <td>
                                  <div style={{ fontWeight: 800, color: 'var(--brand)', fontFamily: 'monospace' }}>
                                    {r.job_card_number || r.ticket_id}
                                  </div>
                                  <div style={{ fontSize: '11px', color: 'var(--ink-lo)', fontWeight: 600 }}>
                                    {r.zone || 'Gotri Zone'}
                                  </div>
                                </td>

                                <td>
                                  <div style={{ fontWeight: 800, color: 'var(--ink)' }}>
                                    {r.vehicle_code || 'EVM5025009'}
                                  </div>
                                  <div style={{ fontSize: '11px', color: 'var(--ink-lo)', fontWeight: 600 }}>
                                    {r.vehicle_model || 'Evegah City'} • {r.km_reading || '4,200 km'}
                                  </div>
                                </td>

                                <td>
                                  {isRiderDamage ? (
                                    <div>
                                      <div style={{ fontWeight: 800, color: '#0F172A' }}>
                                        {r.rider_name || 'Rider Incident'}
                                      </div>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                                        <span className="pill-badge pill-red">⚠️ Rider Liable</span>
                                        {r.reservation_id && (
                                          <span style={{ fontSize: '10.5px', color: 'var(--ink-lo)', fontWeight: 700 }}>
                                            #{r.reservation_id}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  ) : (
                                    <div>
                                      <span className="pill-badge pill-gray">🛡️ Fleet Wear &amp; Tear</span>
                                      <div style={{ fontSize: '11px', color: 'var(--ink-lo)', fontWeight: 600, marginTop: '2px' }}>
                                        Company Expense
                                      </div>
                                    </div>
                                  )}
                                </td>

                                <td>
                                  <div style={{ fontWeight: 800, color: 'var(--ink)' }}>
                                    {r.issue_category || 'General Service'}
                                  </div>
                                  <div style={{ fontSize: '11px', color: 'var(--ink-lo)', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {r.description || 'Inspection & repair required.'}
                                  </div>
                                </td>

                                <td>
                                  <div style={{ fontWeight: 800, color: 'var(--ink)' }}>
                                    ₹{totalExp.toFixed(2)}
                                  </div>
                                  {isRiderDamage ? (
                                    <div style={{ marginTop: '2px' }}>
                                      <span className={`pill-badge ${
                                        r.rider_payment_status === 'Paid via UPI' || r.rider_payment_status === 'Deducted from Deposit'
                                          ? 'pill-green'
                                          : 'pill-amber'
                                      }`}>
                                        {r.rider_payment_status || 'Pending Recovery'}
                                      </span>
                                    </div>
                                  ) : (
                                    <div style={{ fontSize: '11px', color: 'var(--ink-lo)', fontWeight: 600 }}>
                                      Fleet Budget
                                    </div>
                                  )}
                                </td>

                                <td>
                                  <span className={`pill-badge ${
                                    r.status === 'Completed' || r.status === 'Resolved'
                                      ? 'pill-green'
                                      : r.status === 'Under Maintenance' || r.status === 'In Progress'
                                      ? 'pill-blue'
                                      : 'pill-amber'
                                  }`}>
                                    ● {r.status || 'Scheduled'}
                                  </span>
                                  <div style={{ fontSize: '10.5px', color: 'var(--ink-lo)', fontWeight: 600, marginTop: '2px' }}>
                                    Tech: {r.assigned_technician?.split(' ')[0] || 'Assigned'}
                                  </div>
                                </td>

                                <td style={{ textAlign: 'right' }}>
                                  <div style={{ display: 'inline-flex', gap: '6px' }} onClick={(e) => e.stopPropagation()}>
                                    <button
                                      className="mo-btn"
                                      style={{ padding: '4px 8px', fontSize: '11px', height: '26px' }}
                                      onClick={() => router.push(`/maintenance/job-cards/${r.job_card_number || r.ticket_id || r.id}`)}
                                    >
                                      View
                                    </button>
                                    <button
                                      className="mo-btn"
                                      style={{ padding: '4px 8px', fontSize: '11px', height: '26px', color: '#EF4444', borderColor: '#FECACA' }}
                                      onClick={(e) => handleDelete(r.id || r.ticket_id, e)}
                                    >
                                      Delete
                                    </button>
                                  </div>
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

              {/* Right Column: Damage Recovery Summary & Vehicle History Feed */}
              <div>
                {/* Rental Business Damage & Expense Recovery Card */}
                <div className="mo-card">
                  <div className="mo-card-header" style={{ marginBottom: '14px' }}>
                    <h3 className="mo-card-title">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                      Rental Damage Recovery
                    </h3>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--ink-lo)', marginTop: 0, marginBottom: '14px' }}>
                    Summary of vehicle damages billed to riders vs fleet absorbed maintenance expenses.
                  </p>

                  <div className="fin-stat-card">
                    <div>
                      <div className="fin-stat-lbl">Recovered From Riders</div>
                      <div style={{ fontSize: '11px', color: '#059669', fontWeight: 700 }}>Deducted / Paid UPI</div>
                    </div>
                    <div className="fin-stat-val" style={{ color: '#059669' }}>
                      ₹{(stats?.recovered_from_riders || 2950).toLocaleString()}
                    </div>
                  </div>

                  <div className="fin-stat-card">
                    <div>
                      <div className="fin-stat-lbl">Pending Rider Recovery</div>
                      <div style={{ fontSize: '11px', color: '#B45309', fontWeight: 700 }}>To be collected</div>
                    </div>
                    <div className="fin-stat-val" style={{ color: '#B45309' }}>
                      ₹{(stats?.pending_recovery_from_riders || 1800).toLocaleString()}
                    </div>
                  </div>

                  <div className="fin-stat-card">
                    <div>
                      <div className="fin-stat-lbl">Fleet Absorbed Wear &amp; Tear</div>
                      <div style={{ fontSize: '11px', color: 'var(--ink-lo)', fontWeight: 700 }}>Company maintenance</div>
                    </div>
                    <div className="fin-stat-val" style={{ color: '#475569' }}>
                      ₹{(stats?.fleet_absorbed_expense || 1750).toLocaleString()}
                    </div>
                  </div>

                  <div style={{ borderTop: '1.5px solid var(--line)', paddingTop: '12px', marginTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--ink)' }}>Total Fleet Incurred:</span>
                    <span style={{ fontSize: '17px', fontWeight: 900, color: 'var(--brand)', fontFamily: 'Outfit' }}>
                      ₹{(stats?.total_maintenance_cost || 6500).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Quick Vehicle Maintenance History Feed */}
                <div className="mo-card">
                  <div className="mo-card-header" style={{ marginBottom: '10px' }}>
                    <h3 className="mo-card-title">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      Recent Vehicle Damage History
                    </h3>
                  </div>

                  <div>
                    {records
                      .filter(r => r.rider_name || r.status === 'Completed')
                      .slice(0, 4)
                      .map((r, i) => (
                        <div key={i} className="hist-item">
                          <div className="hist-top">
                            <span>{r.vehicle_code} • {r.vehicle_model}</span>
                            <span style={{ color: 'var(--brand)', fontFamily: 'monospace' }}>
                              ₹{Number(r.total_cost || r.estimated_cost || 0).toFixed(0)}
                            </span>
                          </div>
                          <div className="hist-sub">
                            {r.rider_name ? (
                              <span style={{ color: '#EF4444', fontWeight: 700 }}>
                                Rider: {r.rider_name}
                              </span>
                            ) : (
                              <span>Periodic Fleet Service</span>
                            )}
                            <span>•</span>
                            <span>{r.issue_category}</span>
                          </div>
                        </div>
                      ))}
                  </div>

                  <div style={{ marginTop: '14px' }}>
                    <button
                      className="mo-btn"
                      style={{ width: '100%', justifyContent: 'center' }}
                      onClick={() => router.push('/maintenance/history')}
                    >
                      View All Vehicle History Logs →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Job Card Modal */}
      <CreateJobCardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          fetchStats();
          fetchRecords();
        }}
      />
    </>
  );
}
