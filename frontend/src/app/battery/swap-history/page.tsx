"use client";
import { useState, useMemo } from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

const CSS = `
.sh-shell { display: flex; min-height: 100vh; background: #F8FAFC; font-family: 'Inter', sans-serif; }
.sh-main { margin-left: 230px; display: flex; flex-direction: column; min-height: 100vh; width: calc(100% - 230px); }
.sh-page { flex: 1; padding: 24px; display: flex; flex-direction: column; gap: 20px; background-color: #FFF; }

/* Breadcrumb */
.sh-bc { display: flex; align-items: center; gap: 6px; font-size: 12.5px; color: #64748B; font-weight: 500; }
.sh-bc a { color: #64748B; text-decoration: none; }
.sh-bc a:hover { color: #6D28D9; }
.sh-bc-sep { color: #94A3B8; }
.sh-bc-cur { color: #6D28D9; font-weight: 600; }

/* Header title */
.sh-title-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; }
.sh-h1 { font-size: 24px; font-weight: 800; color: #0F172A; margin: 0 0 4px; letter-spacing: -0.02em; }
.sh-sub { font-size: 13px; color: #64748B; margin: 0; }

.sh-actions { display: flex; align-items: center; gap: 10px; }
.sh-btn { display: flex; align-items: center; gap: 7px; padding: 9px 16px; background: #fff; border: 1.5px solid #E2E8F0; border-radius: 10px; font-size: 13px; font-weight: 600; color: #475569; cursor: pointer; transition: all .15s; }
.sh-btn:hover { border-color: #6D28D9; color: #6D28D9; }
.sh-btn-primary { background: #6D28D9; color: #fff; border-color: #6D28D9; }
.sh-btn-primary:hover { background: #5B21B6; border-color: #5B21B6; color: #fff; }

/* KPI Grid */
.sh-stats-row { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; }
.sh-stat-card { background: #fff; border: 1px solid #E2E8F0; border-radius: 14px; padding: 16px; display: flex; align-items: center; gap: 12px; box-shadow: 0 1px 3px rgba(0,0,0,.02); position: relative; }
.sh-stat-ic { width: 42px; height: 42px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.ic-purple { background: #8B5CF6; color: #fff; }
.ic-green { background: #10B981; color: #fff; }
.ic-blue { background: #3B82F6; color: #fff; }
.ic-red { background: #EF4444; color: #fff; }
.ic-orange { background: #F97316; color: #fff; }

.sh-stat-info { min-width: 0; flex: 1; }
.sh-stat-lbl { font-size: 11px; color: #64748B; font-weight: 600; text-transform: uppercase; letter-spacing: 0.03em; margin-bottom: 2px; }
.sh-stat-val { font-size: 22px; font-weight: 800; color: #0F172A; line-height: 1; }
.sh-stat-sub { font-size: 11px; color: #64748B; font-weight: 500; margin-top: 4px; display: flex; align-items: center; justify-content: space-between; }
.sh-stat-sub-green { color: #16A34A; font-weight: 600; }
.sh-stat-sub-red { color: #DC2626; font-weight: 600; }

/* Filter bar panel */
.sh-filter-card { background: #fff; border: 1px solid #E2E8F0; border-radius: 14px; padding: 14px 16px; box-shadow: 0 1px 3px rgba(0,0,0,.02); }
.sh-filter-grid { display: grid; grid-template-columns: 2.2fr 1.2fr 1.2fr 1.2fr 1.4fr auto; gap: 10px; align-items: center; }
.sh-search-wrap { position: relative; }
.sh-search-input { width: 100%; padding: 8px 12px 8px 34px; border: 1.5px solid #E2E8F0; border-radius: 8px; font-size: 13px; outline: none; transition: border-color .15s; }
.sh-search-input:focus { border-color: #6D28D9; }
.sh-search-icon { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); color: #94A3B8; }
.sh-select { padding: 8px 10px; border: 1.5px solid #E2E8F0; border-radius: 8px; font-size: 13px; outline: none; background: #fff; color: #334155; cursor: pointer; }
.sh-select:focus { border-color: #6D28D9; }
.sh-reset-btn { padding: 8px 14px; background: #fff; border: 1.5px solid #E2E8F0; border-radius: 8px; font-size: 12.5px; font-weight: 700; color: #64748B; cursor: pointer; transition: all .15s; }
.sh-reset-btn:hover { border-color: #EF4444; color: #EF4444; }

/* Table styling */
.sh-tcard { background: #fff; border: 1px solid #E2E8F0; border-radius: 14px; box-shadow: 0 1px 3px rgba(0,0,0,.02); overflow: hidden; }
.sh-dt { width: 100%; border-collapse: collapse; }
.sh-dt th { font-size: 11px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: .06em; text-align: left; padding: 12px 16px; background: #F8FAFC; border-bottom: 1px solid #E2E8F0; }
.sh-dt td { padding: 12px 16px; font-size: 13px; color: #334155; border-bottom: 1px solid #F1F5F9; vertical-align: middle; }
.sh-dt tr:last-child td { border-bottom: none; }
.sh-dt tr:hover td { background: #F8FAFC; }

.td-id { font-weight: 700; color: #6D28D9; text-decoration: none; cursor: pointer; }
.td-id:hover { text-decoration: underline; }

.status-badge { display: inline-flex; align-items: center; padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; }
.badge-completed { background: #DCFCE7; color: #16A34A; }
.badge-ongoing { background: #EFF6FF; color: #2563EB; }
.badge-failed { background: #FEE2E2; color: #EF4444; }

.action-row { display: flex; align-items: center; gap: 6px; }
.action-btn { width: 26px; height: 26px; border: 1.5px solid #E2E8F0; border-radius: 6px; display: inline-flex; align-items: center; justify-content: center; color: #64748B; background: #fff; cursor: pointer; transition: all .12s; }
.action-btn:hover { border-color: #6D28D9; color: #6D28D9; }

.sh-tcard-ft { display: flex; align-items: center; justify-content: space-between; padding: 12px 18px; border-top: 1px solid #E2E8F0; background: #F8FAFC; }
.sh-tcard-ft-lbl { font-size: 12.5px; color: #64748B; font-weight: 500; }
.sh-pg { display: flex; align-items: center; gap: 4px; }
.sh-pgb { width: 28px; height: 28px; border: 1.5px solid #E2E8F0; border-radius: 6px; background: #fff; font-size: 12.5px; font-weight: 600; color: #475569; display: flex; align-items: center; justify-content: center; cursor: pointer; }
.sh-pgb:hover:not(:disabled) { border-color: #6D28D9; color: #6D28D9; }
.sh-pgb.cur { background: #6D28D9; color: #fff; border-color: #6D28D9; }
.sh-pgb:disabled { opacity: 0.5; cursor: not-allowed; }

/* Custom feedback toast alert */
.sh-toast { position: fixed; bottom: 24px; right: 24px; background: #0F172A; color: #fff; padding: 12px 20px; border-radius: 10px; display: flex; align-items: center; gap: 10px; font-size: 12.5px; font-weight: 600; z-index: 300; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.3); animation: sh-slideup 0.25s cubic-bezier(0.16, 1, 0.3, 1); }
.sh-toast-green { border-left: 4px solid #10B981; }

@keyframes sh-slideup { from { transform: translateY(12px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
`;

interface SwapItem {
  id: string;
  batteryId: string;
  vehiclePlate: string;
  socOld: number;
  socNew: number;
  location: string;
  operator: string;
  duration: string;
  type: 'Automated' | 'Manual Hub';
  status: 'Completed' | 'Ongoing' | 'Failed';
  time: string;
}

const INITIAL_SWAPS: SwapItem[] = [
  { id: 'SW-2024-05892', batteryId: 'BAT-450X-12340001', vehiclePlate: 'DL-01-AB-1234', socOld: 14, socNew: 98, location: 'Palika Bazaar, CP', operator: 'Self-Service', duration: '42s', type: 'Automated', status: 'Completed', time: '20 May 2024, 10:15 AM' },
  { id: 'SW-2024-05891', batteryId: 'BAT-450X-12340002', vehiclePlate: 'DL-01-AB-5678', socOld: 8, socNew: 95, location: 'Karol Bagh', operator: 'Rajesh Sharma', duration: '1m 12s', type: 'Manual Hub', status: 'Completed', time: '20 May 2024, 10:02 AM' },
  { id: 'SW-2024-05890', batteryId: 'BAT-450X-12340003', vehiclePlate: 'DL-01-AB-9012', socOld: 22, socNew: 92, location: 'Palika Bazaar, CP', operator: 'Self-Service', duration: '48s', type: 'Automated', status: 'Completed', time: '20 May 2024, 09:48 AM' },
  { id: 'SW-2024-05889', batteryId: 'BAT-450X-12340004', vehiclePlate: 'DL-01-AB-3456', socOld: 15, socNew: 15, location: 'Raja Garden', operator: 'Amit Singh', duration: '2m 15s', type: 'Manual Hub', status: 'Failed', time: '20 May 2024, 09:30 AM' },
  { id: 'SW-2024-05888', batteryId: 'BAT-450X-12340005', vehiclePlate: 'DL-01-AB-7890', socOld: 19, socNew: 97, location: 'Jantar Mantar, CP', operator: 'Self-Service', duration: '40s', type: 'Automated', status: 'Completed', time: '20 May 2024, 09:12 AM' },
  { id: 'SW-2024-05887', batteryId: 'BAT-450X-12340006', vehiclePlate: 'DL-01-AB-1122', socOld: 5, socNew: 24, location: 'Karol Bagh', operator: 'Rajesh Sharma', duration: '45s', type: 'Manual Hub', status: 'Ongoing', time: '20 May 2024, 09:05 AM' },
  { id: 'SW-2024-05886', batteryId: 'BAT-450X-12340007', vehiclePlate: 'DL-01-AB-4455', socOld: 12, socNew: 96, location: 'Raja Garden', operator: 'Self-Service', duration: '44s', type: 'Automated', status: 'Completed', time: '19 May 2024, 06:40 PM' },
  { id: 'SW-2024-05885', batteryId: 'BAT-450X-12340002', vehiclePlate: 'DL-01-AB-5678', socOld: 17, socNew: 99, location: 'Palika Bazaar, CP', operator: 'Self-Service', duration: '51s', type: 'Automated', status: 'Completed', time: '19 May 2024, 05:22 PM' },
];

export default function SwapHistoryPage() {
  const [swaps, setSwaps] = useState<SwapItem[]>(INITIAL_SWAPS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState<{ show: boolean; msg: string }>({ show: false, msg: '' });

  const triggerToast = (msg: string) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: '' }), 3000);
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('');
    setTypeFilter('');
    setLocationFilter('');
    setCurrentPage(1);
    triggerToast('Filters reset successfully');
  };

  // Filtered dataset
  const filteredSwaps = useMemo(() => {
    return swaps.filter(item => {
      const matchSearch = searchQuery === '' ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.batteryId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.vehiclePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.operator.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === '' || item.status === statusFilter;
      const matchType = typeFilter === '' || item.type === typeFilter;
      const matchLocation = locationFilter === '' || item.location === locationFilter;
      return matchSearch && matchStatus && matchType && matchLocation;
    });
  }, [swaps, searchQuery, statusFilter, typeFilter, locationFilter]);

  // Paginated dataset (5 items per page)
  const paginatedSwaps = useMemo(() => {
    const start = (currentPage - 1) * 5;
    return filteredSwaps.slice(start, start + 5);
  }, [filteredSwaps, currentPage]);

  const totalPages = Math.ceil(filteredSwaps.length / 5) || 1;

  // Calculate metrics based on state
  const totalSwapsCount = swaps.length;
  const completedSwapsCount = swaps.filter(s => s.status === 'Completed').length;
  const ongoingSwapsCount = swaps.filter(s => s.status === 'Ongoing').length;
  const failedSwapsCount = swaps.filter(s => s.status === 'Failed').length;
  const uniqueLocations = Array.from(new Set(swaps.map(s => s.location))).length;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="sh-shell">
        <Sidebar activePath="/battery/swap-history" />
        <div className="sh-main">
          <TopBar />
          <div className="sh-page">
            {/* Breadcrumb */}
            <div className="sh-bc">
              <a href="/">Dashboard</a>
              <span className="sh-bc-sep">/</span>
              <span className="sh-bc-sep">Battery</span>
              <span className="sh-bc-sep">/</span>
              <span className="sh-bc-cur">Swap History</span>
            </div>

            {/* Title & Actions */}
            <div className="sh-title-row">
              <div>
                <h1 className="sh-h1">Battery Swap History</h1>
                <p className="sh-sub">Monitor battery transactions, swap durations, and logs across automated and manual hubs.</p>
              </div>
              <div className="sh-actions">
                <button className="sh-btn" onClick={() => triggerToast('CSV report export queued')}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  Export CSV
                </button>
                <button className="sh-btn-primary sh-btn" onClick={() => {
                  const newId = `SW-2024-0${Math.floor(10000 + Math.random() * 90000)}`;
                  const newSwap: SwapItem = {
                    id: newId,
                    batteryId: 'BAT-450X-12340001',
                    vehiclePlate: 'DL-01-AB-1234',
                    socOld: 12,
                    socNew: 98,
                    location: 'Palika Bazaar, CP',
                    operator: 'Self-Service',
                    duration: '45s',
                    type: 'Automated',
                    status: 'Completed',
                    time: new Date().toLocaleString('en-US', { hour12: true, day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                  };
                  setSwaps([newSwap, ...swaps]);
                  setCurrentPage(1);
                  triggerToast(`Swap transaction ${newId} logged successfully!`);
                }}>
                  + Log Swap
                </button>
              </div>
            </div>

            {/* KPI Summary Row */}
            <div className="sh-stats-row">
              <div className="sh-stat-card">
                <div className="sh-stat-ic ic-purple">⚡</div>
                <div className="sh-stat-info">
                  <span className="sh-stat-lbl">Total Swaps</span>
                  <div className="sh-stat-val">{totalSwapsCount}</div>
                  <div className="sh-stat-sub">Cumulative count</div>
                </div>
              </div>
              <div className="sh-stat-card">
                <div className="sh-stat-ic ic-green">✓</div>
                <div className="sh-stat-info">
                  <span className="sh-stat-lbl">Completed</span>
                  <div className="sh-stat-val">{completedSwapsCount}</div>
                  <div className="sh-stat-sub">
                    <span className="sh-stat-sub-green">
                      {((completedSwapsCount / totalSwapsCount) * 100).toFixed(1)}%
                    </span>
                    <span>success rate</span>
                  </div>
                </div>
              </div>
              <div className="sh-stat-card">
                <div className="sh-stat-ic ic-blue">🔄</div>
                <div className="sh-stat-info">
                  <span className="sh-stat-lbl">Ongoing</span>
                  <div className="sh-stat-val">{ongoingSwapsCount}</div>
                  <div className="sh-stat-sub">In progress active</div>
                </div>
              </div>
              <div className="sh-stat-card">
                <div className="sh-stat-ic ic-red">✕</div>
                <div className="sh-stat-info">
                  <span className="sh-stat-lbl">Failed</span>
                  <div className="sh-stat-val">{failedSwapsCount}</div>
                  <div className="sh-stat-sub">
                    <span className="sh-stat-sub-red">
                      {((failedSwapsCount / totalSwapsCount) * 100).toFixed(1)}%
                    </span>
                    <span>error rate</span>
                  </div>
                </div>
              </div>
              <div className="sh-stat-card">
                <div className="sh-stat-ic ic-orange">📍</div>
                <div className="sh-stat-info">
                  <span className="sh-stat-lbl">Locations</span>
                  <div className="sh-stat-val">{uniqueLocations}</div>
                  <div className="sh-stat-sub">Active stations</div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="sh-filter-card">
              <div className="sh-filter-grid">
                <div className="sh-search-wrap">
                  <span className="sh-search-icon">🔍</span>
                  <input
                    type="text"
                    className="sh-search-input"
                    placeholder="Search Swap ID, Battery, Vehicle..."
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  />
                </div>
                <select className="sh-select" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}>
                  <option value="">All Statuses</option>
                  <option value="Completed">Completed</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Failed">Failed</option>
                </select>
                <select className="sh-select" value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }}>
                  <option value="">All Types</option>
                  <option value="Automated">Automated</option>
                  <option value="Manual Hub">Manual Hub</option>
                </select>
                <select className="sh-select" value={locationFilter} onChange={(e) => { setLocationFilter(e.target.value); setCurrentPage(1); }}>
                  <option value="">All Locations</option>
                  <option value="Palika Bazaar, CP">Palika Bazaar, CP</option>
                  <option value="Karol Bagh">Karol Bagh</option>
                  <option value="Jantar Mantar, CP">Jantar Mantar, CP</option>
                  <option value="Raja Garden">Raja Garden</option>
                </select>
                <div style={{ color: '#94A3B8', fontSize: '12px', fontWeight: 600 }}>
                  Showing {filteredSwaps.length} results
                </div>
                <button className="sh-reset-btn" onClick={resetFilters}>
                  Reset Filters
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="sh-tcard">
              <table className="sh-dt">
                <thead>
                  <tr>
                    <th>Swap Transaction ID</th>
                    <th>Battery ID</th>
                    <th>Vehicle Plate</th>
                    <th>SOC Exchange</th>
                    <th>Location</th>
                    <th>Swap Type</th>
                    <th>Duration</th>
                    <th>Operator</th>
                    <th>Timestamp</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedSwaps.length === 0 ? (
                    <tr>
                      <td colSpan={11} style={{ textAlign: 'center', padding: '30px', color: '#64748B' }}>
                        No swap history matches your filters.
                      </td>
                    </tr>
                  ) : (
                    paginatedSwaps.map((item) => (
                      <tr key={item.id}>
                        <td className="td-id" onClick={() => alert(`Transaction Details:\nID: ${item.id}\nTime: ${item.time}\nStation: ${item.location}\nOperator: ${item.operator}`)}>
                          {item.id}
                        </td>
                        <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{item.batteryId}</td>
                        <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{item.vehiclePlate}</td>
                        <td style={{ fontWeight: 700 }}>
                          <span style={{ color: '#DC2626' }}>{item.socOld}%</span>
                          <span style={{ margin: '0 6px', color: '#94A3B8' }}>→</span>
                          <span style={{ color: '#16A34A' }}>{item.socNew}%</span>
                        </td>
                        <td>{item.location}</td>
                        <td style={{ fontWeight: 600 }}>{item.type}</td>
                        <td>{item.duration}</td>
                        <td style={{ fontWeight: 600 }}>{item.operator}</td>
                        <td style={{ color: '#64748B', fontSize: '12.5px' }}>{item.time}</td>
                        <td>
                          <span className={`status-badge ${item.status === 'Completed' ? 'badge-completed' : item.status === 'Ongoing' ? 'badge-ongoing' : 'badge-failed'}`}>
                            {item.status}
                          </span>
                        </td>
                        <td>
                          <div className="action-row" style={{ justifyContent: 'center' }}>
                            <button className="action-btn" title="View Swap Log" onClick={() => alert(`Swap Transaction ID: ${item.id}\nDuration: ${item.duration}\nOperator: ${item.operator}\nType: ${item.type}\nSOC Delta: ${item.socNew - item.socOld}% increase`)}>👁</button>
                            <button className="action-btn" title="Flag Transaction" onClick={() => {
                              alert(`Transaction ${item.id} has been flagged for review.`);
                              triggerToast(`Flagged transaction ${item.id}.`);
                            }}>🚩</button>
                            <button className="action-btn" title="Mark Fail / Success" onClick={() => {
                              const newStatus = item.status === 'Completed' ? 'Failed' : 'Completed';
                              const updated = swaps.map(s => s.id === item.id ? { ...s, status: newStatus as any } : s);
                              setSwaps(updated);
                              triggerToast(`Status of ${item.id} changed to ${newStatus}.`);
                            }}>🔄</button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* Table Footer / Pagination */}
              <div className="sh-tcard-ft">
                <span className="sh-tcard-ft-lbl">
                  Showing {(currentPage - 1) * 5 + 1} to {Math.min(currentPage * 5, filteredSwaps.length)} of {filteredSwaps.length} logs
                </span>
                <div className="sh-pg">
                  <button className="sh-pgb" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>&lt;</button>
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button key={i} className={`sh-pgb ${currentPage === i + 1 ? 'cur' : ''}`} onClick={() => setCurrentPage(i + 1)}>
                      {i + 1}
                    </button>
                  ))}
                  <button className="sh-pgb" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>&gt;</button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {toast.show && (
        <div className="sh-toast sh-toast-green">
          <span>🔔</span>
          <span>{toast.msg}</span>
        </div>
      )}
    </>
  );
}
