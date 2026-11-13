'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import MaintenanceKpiStrip from '@/components/MaintenanceKpiStrip';
import CreateJobCardModal from '@/components/CreateJobCardModal';
import { api } from '@/lib/api';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

.all-shell {
  display: flex;
  min-height: 100vh;
  background: #F6F7FC;
  font-family: 'Plus Jakarta Sans', sans-serif;
  color: #0F172A;
}
.all-main {
  margin-left: 230px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: calc(100% - 230px);
  min-width: 0;
}
.all-page {
  flex: 1;
  padding: 20px 26px 64px;
  max-width: 1560px;
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
}

/* Breadcrumb */
.all-bc {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12.5px;
  color: #64748B;
  font-weight: 500;
  margin-bottom: 6px;
}
.all-bc a { color: #64748B; text-decoration: none; font-weight: 600; }
.all-bc a:hover { color: #2A195C; }
.all-bc-sep { color: #CBD5E1; }
.all-bc-cur { color: #2A195C; font-weight: 800; }

/* Header & Action bar */
.all-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}
.all-h1 {
  font-size: 22px;
  font-weight: 900;
  color: #0F172A;
  margin: 0 0 4px;
  letter-spacing: -0.02em;
}
.all-sub {
  font-size: 13px;
  color: #64748B;
  margin: 0;
  font-weight: 500;
}

.all-hdr-btns {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.all-btn-outline {
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
.all-btn-outline:hover { border-color: #2A195C; color: #2A195C; background: #FAF9FF; }
.all-btn-primary {
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
.all-btn-primary:hover { background: #4338CA; border-color: #4338CA; }

/* Filter Controls Row */
.all-filter-row {
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
.all-search-box {
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
.all-search-box input {
  border: none;
  outline: none;
  width: 100%;
  font-size: 12.5px;
  color: #0F172A;
  font-family: inherit;
  font-weight: 600;
}
.all-select {
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

/* Tabs Bar */
.all-tabs-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}
.all-tab-btn {
  background: #fff;
  border: 1.5px solid #E2E8F0;
  font-size: 12.5px;
  font-weight: 700;
  color: #64748B;
  cursor: pointer;
  padding: 7px 14px;
  border-radius: 10px;
  transition: all .15s;
}
.all-tab-btn:hover { color: #0F172A; border-color: #CBD5E1; }
.all-tab-btn.active { background: #2A195C; border-color: #2A195C; color: #fff; }

/* Table Container */
.all-table-card {
  background: #fff;
  border: 1.5px solid #EAECF4;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,.02);
}
.all-tbl-wrap {
  overflow-x: auto;
}
.all-tbl {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 12.5px;
  min-width: 860px;
}
.all-tbl th {
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
.all-tbl td {
  padding: 13px 14px;
  font-size: 12.5px;
  color: #1E293B;
  border-bottom: 1px solid #F1F5F9;
  vertical-align: middle;
}
.all-tbl tr:hover td { background: #FAF9FF; }

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

@media (max-width: 860px) {
  .all-shell { flex-direction: column; }
  .all-main { margin-left: 0; width: 100%; }
  .all-page { padding: 16px; }
}
`;

export default function AllMaintenancePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'all' | 'rider_damage' | 'under_maintenance' | 'completed'>('all');
  const [recordsList, setRecordsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [serviceTypeFilter, setServiceTypeFilter] = useState('All Service Types');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res: any = await api.get('/maintenance');
      const list = res?.data || (Array.isArray(res) ? res : []);
      setRecordsList(list);
    } catch (err) {
      console.error('Error fetching maintenance work orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this maintenance record?')) return;
    try {
      await api.delete(`/maintenance/${id}`);
      fetchOrders();
    } catch (_) {
      alert('Failed to delete maintenance order');
    }
  };

  const filteredRecords = useMemo(() => {
    return recordsList.filter((row) => {
      // Tab filter
      if (activeTab === 'rider_damage') {
        const isRdr = (row.fault_type || '').includes('Rider') || !!row.rider_name;
        if (!isRdr) return false;
      } else if (activeTab === 'under_maintenance') {
        const s = (row.status || '').toLowerCase();
        if (!['under maintenance', 'in progress', 'scheduled'].includes(s)) return false;
      } else if (activeTab === 'completed') {
        const s = (row.status || '').toLowerCase();
        if (!['completed', 'resolved'].includes(s)) return false;
      }

      // Status filter dropdown
      if (statusFilter !== 'All Status' && row.status !== statusFilter) {
        return false;
      }

      // Type filter dropdown
      if (serviceTypeFilter !== 'All Service Types' && row.issue_category !== serviceTypeFilter) {
        return false;
      }

      // Search filter
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
  }, [recordsList, activeTab, statusFilter, serviceTypeFilter, search]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="all-shell">
        <Sidebar activePath="/maintenance/all" />
        <div className="all-main">
          <TopBar showHand={false} />

          <div className="all-page">
            {/* Breadcrumb */}
            <div className="all-bc">
              <Link href="/maintenance/overview">Home</Link>
              <span className="all-bc-sep">&gt;</span>
              <span>Maintenance</span>
              <span className="all-bc-sep">&gt;</span>
              <span className="all-bc-cur">All Work Orders</span>
            </div>

            {/* Header */}
            <div className="all-header">
              <div>
                <h1 className="all-h1">All Maintenance Orders</h1>
                <p className="all-sub">
                  Complete fleet maintenance work orders, rider damage liabilities, and repair expenses.
                </p>
              </div>
              <div className="all-hdr-btns">
                <button className="all-btn-outline" onClick={fetchOrders}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
                  Refresh
                </button>
                <button className="all-btn-primary" onClick={() => setIsModalOpen(true)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  + Create Job Card
                </button>
              </div>
            </div>

            {/* KPI Cards Strip matching Renter page */}
            <MaintenanceKpiStrip
              activeFilter={activeTab}
              onCardClick={(t) => {
                if (t === 'rider_damage') setActiveTab('rider_damage');
                else if (t === 'under_maintenance') setActiveTab('under_maintenance');
                else if (t === 'completed') setActiveTab('completed');
                else setActiveTab('all');
              }}
            />

            {/* Filter Row */}
            <div className="all-filter-row">
              <div className="all-search-box">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input
                  type="text"
                  placeholder="Search by Job Card, Vehicle, Rider, Technician..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <button onClick={() => setSearch('')} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#94A3B8' }}>×</button>
                )}
              </div>

              <select className="all-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="All Status">All Statuses</option>
                <option value="Scheduled">Scheduled</option>
                <option value="In Progress">In Progress</option>
                <option value="Under Maintenance">Under Maintenance</option>
                <option value="Completed">Completed</option>
              </select>

              <select className="all-select" value={serviceTypeFilter} onChange={(e) => setServiceTypeFilter(e.target.value)}>
                <option value="All Service Types">All Service Categories</option>
                <option value="Body & Panel Damage">Body &amp; Panel Damage</option>
                <option value="Brake Lever & Indicator">Brake Lever &amp; Indicator</option>
                <option value="Headlamp & Visor Impact">Headlamp &amp; Visor</option>
                <option value="Mudguard & Tail Lamp">Mudguard &amp; Tail Lamp</option>
                <option value="Tyre Tread & Puncture Repair">Tyre Tread &amp; Puncture</option>
                <option value="10,000 km Periodic Service">10,000 km Periodic Service</option>
              </select>
            </div>

            {/* Tabs */}
            <div className="all-tabs-bar">
              <button className={`all-tab-btn ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>
                All Work Orders ({recordsList.length})
              </button>
              <button className={`all-tab-btn ${activeTab === 'rider_damage' ? 'active' : ''}`} onClick={() => setActiveTab('rider_damage')}>
                ⚠️ Rider Damages ({recordsList.filter(r => (r.fault_type || '').includes('Rider') || r.rider_name).length})
              </button>
              <button className={`all-tab-btn ${activeTab === 'under_maintenance' ? 'active' : ''}`} onClick={() => setActiveTab('under_maintenance')}>
                ⚙️ Under Maintenance ({recordsList.filter(r => ['under maintenance', 'in progress', 'scheduled'].includes((r.status || '').toLowerCase())).length})
              </button>
              <button className={`all-tab-btn ${activeTab === 'completed' ? 'active' : ''}`} onClick={() => setActiveTab('completed')}>
                ✓ Completed ({recordsList.filter(r => ['completed', 'resolved'].includes((r.status || '').toLowerCase())).length})
              </button>
            </div>

            {/* Table */}
            <div className="all-table-card">
              <div className="all-tbl-wrap">
                {loading ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#64748B', fontWeight: 600 }}>
                    Loading maintenance records from database...
                  </div>
                ) : filteredRecords.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#64748B', fontWeight: 600 }}>
                    No maintenance records found.
                  </div>
                ) : (
                  <table className="all-tbl">
                    <thead>
                      <tr>
                        <th>Job Card / Ticket</th>
                        <th>Vehicle &amp; Model</th>
                        <th>Rider &amp; Liability</th>
                        <th>Damage / Service Scope</th>
                        <th>Expense &amp; Recovery</th>
                        <th>Status</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRecords.map((row) => {
                        const isRdr = (row.fault_type || '').includes('Rider') || !!row.rider_name;
                        const totalExp = Number(row.total_cost || row.estimated_cost || 0);

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
                                {row.zone || 'Gotri Zone'}
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
                              <div style={{ fontSize: '11px', color: '#64748B', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {row.description}
                              </div>
                            </td>

                            <td>
                              <div style={{ fontWeight: 800, color: '#0F172A' }}>
                                ₹{totalExp.toFixed(2)}
                              </div>
                              {isRdr ? (
                                <div style={{ marginTop: '2px' }}>
                                  <span className={`pill-badge ${
                                    row.rider_payment_status === 'Paid via UPI' || row.rider_payment_status === 'Deducted from Deposit'
                                      ? 'pill-green'
                                      : 'pill-amber'
                                  }`}>
                                    {row.rider_payment_status || 'Pending Recovery'}
                                  </span>
                                </div>
                              ) : (
                                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>
                                  Fleet Budget
                                </div>
                              )}
                            </td>

                            <td>
                              <span className={`pill-badge ${
                                row.status === 'Completed' || row.status === 'Resolved'
                                  ? 'pill-green'
                                  : row.status === 'Under Maintenance' || row.status === 'In Progress'
                                  ? 'pill-blue'
                                  : 'pill-amber'
                              }`}>
                                ● {row.status || 'Scheduled'}
                              </span>
                              <div style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 600, marginTop: '2px' }}>
                                Tech: {row.assigned_technician?.split(' ')[0] || 'Assigned'}
                              </div>
                            </td>

                            <td style={{ textAlign: 'right' }}>
                              <div style={{ display: 'inline-flex', gap: '6px' }} onClick={(e) => e.stopPropagation()}>
                                <button
                                  className="all-btn-outline"
                                  style={{ padding: '4px 8px', fontSize: '11px', height: '26px' }}
                                  onClick={() => router.push(`/maintenance/job-cards/${row.job_card_number || row.ticket_id || row.id}`)}
                                >
                                  View
                                </button>
                                <button
                                  className="all-btn-outline"
                                  style={{ padding: '4px 8px', fontSize: '11px', height: '26px', color: '#EF4444', borderColor: '#FECACA' }}
                                  onClick={(e) => handleDelete(row.id || row.ticket_id, e)}
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
        </div>
      </div>

      <CreateJobCardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchOrders}
      />
    </>
  );
}
