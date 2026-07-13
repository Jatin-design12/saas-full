'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { api } from '@/lib/api';

/* ──────────────────────────────────────────────────────────────
   VEHICLE CATALOG & FLEET MANAGEMENT
   ────────────────────────────────────────────────────────────── */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
.vl-shell{display:flex;min-height:100vh;background:#F3F4F9;font-family:Inter,sans-serif;}
.vl-main{margin-left:240px;display:flex;flex-direction:column;min-height:100vh;width:calc(100% - 240px);}
.vl-page{flex:1;padding:0 28px 60px; background-color:#FFF;}

/* breadcrumb */
.vl-bc{display:flex;align-items:center;gap:6px;padding:14px 0 0;font-size:12px;color:#9CA3AF;}
.vl-bc a{color:#9CA3AF;text-decoration:none;}
.vl-bc a:hover{color:#2A195C;}
.vl-bc-sep{color:#D1D5DB;}
.vl-bc-cur{color:#2A195C;font-weight:600;}

/* Header Title row */
.vl-title-row{display:flex;align-items:flex-start;justify-content:space-between;margin:12px 0 18px;gap:16px;}
.vl-h1{font-size:22px;font-weight:800;color:#111827;margin:0 0 4px;}
.vl-sub{font-size:13px;color:#6B7280;margin:0;}
.vl-hdr-actions{display:flex;align-items:center;gap:10px;}
.vl-hdr-btn{display:flex;align-items:center;gap:7px;padding:9px 16px;background:#fff;border:1.5px solid #E5E7EB;border-radius:10px;font-size:13px;font-weight:600;color:#374151;cursor:pointer;font-family:inherit;box-shadow:0 1px 3px rgba(0,0,0,.06);transition:all .15s;}
.vl-hdr-btn:hover{border-color:#2A195C;color:#2A195C;}
.vl-hdr-btn.primary{background:#2A195C;color:#fff;border-color:#2A195C;box-shadow:0 2px 6px rgba(79,70,229,.35);}
.vl-hdr-btn.primary:hover{background:#4338CA;color:#fff;border-color:#4338CA;}
.vl-hdr-btn.danger{background:#EF4444;color:#fff;border-color:#EF4444;box-shadow:0 2px 6px rgba(239,68,68,.35);}
.vl-hdr-btn.danger:hover{background:#DC2626;border-color:#DC2626;}

/* Stats cards (5 in a row) */
.vl-stats-row{display:grid;grid-template-columns:repeat(5,1fr);gap:12px;margin-bottom:20px;}
.vl-stat-card{background:#fff;border:1px solid #E5E7EB;border-radius:12px;padding:12px 14px;display:flex;align-items:center;gap:12px;box-shadow:0 1px 3px rgba(0,0,0,.05);}
.vl-stat-ic{width:36px;height:36px;border-radius:8px;background:#F5F3FF;color:#2A195C;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.vl-stat-info{min-width:0;flex:1;}
.vl-stat-lbl{font-size:10.5px;color:#9CA3AF;font-weight:600;margin-bottom:2px;}
.vl-stat-val{font-size:18px;font-weight:800;color:#111827;line-height:1;}
.vl-dot{width:7px;height:7px;border-radius:50%;display:inline-block;}
.vl-dot.online{background:#10B981;}
.vl-dot.in_ride{background:#2A195C;}
.vl-dot.offline{background:#9CA3AF;}
.vl-dot.low_bat{background:#F59E0B;}

/* Search & filter panel */
.vl-filter-card{background:#fff;border:1px solid #E5E7EB;border-radius:14px;padding:16px 20px;margin-bottom:20px;box-shadow:0 1px 3px rgba(0,0,0,.04);display:flex;align-items:center;justify-content:between;gap:14px;flex-wrap:wrap;}
.vl-search-input-wrap{flex:1;min-width:260px;position:relative;display:flex;align-items:center;}
.vl-search-ic{position:absolute;left:12px;color:#9CA3AF;display:flex;}
.vl-search-input{width:100%;padding:9px 12px 9px 36px;border:1.5px solid #E5E7EB;border-radius:10px;font-size:13.5px;color:#111827;outline:none;background:#FFF;transition:all .15s;font-family:inherit;}
.vl-search-input:focus{border-color:#2A195C;background:#fff;box-shadow:0 0 0 3px rgba(79,70,229,0.08);}
.vl-filter-grp{display:flex;align-items:center;gap:10px;flex-wrap:wrap;}
.vl-select{padding:9px 14px;border:1.5px solid #E5E7EB;border-radius:10px;font-size:13px;color:#374151;background:#fff;font-weight:600;cursor:pointer;outline:none;transition:border-color .15s;font-family:inherit;}
.vl-select:focus{border-color:#2A195C;}

/* List View table */
.vl-table-card{background:#fff;border:1px solid #E5E7EB;border-radius:16px;box-shadow:0 1px 4px rgba(0,0,0,.06);overflow:hidden;}
.vl-table-wrap{width:100%;overflow-x:auto;}
.vl-table{width:100%;border-collapse:collapse;text-align:left;}
.vl-table th{background:#F9FAFB;padding:14px 18px;font-size:11px;font-weight:700;color:#6B7280;text-transform:uppercase;letter-spacing:.05em;border-bottom:1px solid #E5E7EB;}
.vl-table td{padding:14px 18px;font-size:13px;color:#374151;border-bottom:1px solid #F3F4F6;vertical-align:middle;}
.vl-table tr:last-child td{border-bottom:none;}
.vl-table tr:hover td{background:#FAFAFF;}

.vl-veh-cell{display:flex;align-items:center;gap:12px;}
.vl-code{font-size:13.5px;font-weight:800;color:#111827;}
.vl-type{font-size:11px;color:#6B7280;margin-top:2px;font-weight:500;}

.vl-badge{font-size:11px;font-weight:700;padding:3px 9px;border-radius:6px;display:inline-block;}
.vl-badge.online{background:#DCFCE7;color:#16A34A;}
.vl-badge.in_ride{background:#E0E7FF;color:#2A195C;}
.vl-badge.low_bat{background:#FEF3C7;color:#D97706;}
.vl-badge.offline{background:#F3F4F6;color:#6B7280;}

.vl-bat-bar-wrap{display:flex;align-items:center;gap:8px;}
.vl-bat-pct{font-size:12.5px;font-weight:700;color:#111827;width:34px;}
.vl-bat-bar{width:60px;height:6px;background:#E5E7EB;border-radius:3px;overflow:hidden;}
.vl-bat-bar-fill{height:100%;border-radius:3px;}

.vl-actions{display:flex;align-items:center;gap:8px;}
.vl-act-btn{width:32px;height:32px;border-radius:8px;border:1.5px solid #E5E7EB;background:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .15s;text-decoration:none;}

/* Premium colorful actions buttons */
.vl-act-btn.view{color:#10B981;border-color:#D1FAE5;background:#ECFDF5;}
.vl-act-btn.view:hover{background:#D1FAE5;color:#059669;box-shadow:0 2px 4px rgba(16,185,129,0.15);}
.vl-act-btn.edit{color:#8B5CF6;border-color:#EDE9FE;background:#F5F3FF;}
.vl-act-btn.edit:hover{background:#EDE9FE;color:#2A195C;box-shadow:0 2px 4px rgba(139,92,246,0.15);}
.vl-act-btn.delete{color:#EF4444;border-color:#FEE2E2;background:#FEF2F2;}
.vl-act-btn.delete:hover{background:#FEE2E2;color:#DC2626;box-shadow:0 2px 4px rgba(239,68,68,0.15);}

/* Pagination */
.vl-pag-row{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-top:1px solid #E5E7EB;}
.vl-pag-lbl{font-size:12px;color:#6B7280;}
.vl-pag-ctrls{display:flex;align-items:center;gap:6px;}
.vl-pag-btn{padding:6px 12px;border:1.5px solid #E5E7EB;border-radius:8px;background:#fff;font-size:12.5px;font-weight:600;color:#374151;cursor:pointer;}
.vl-pag-btn:hover:not(:disabled){border-color:#2A195C;color:#2A195C;}
.vl-pag-btn:disabled{opacity:0.5;cursor:not-allowed;}
.vl-pag-num{width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:12.5px;font-weight:700;cursor:pointer;}
.vl-pag-num.active{background:#2A195C;color:#fff;}
.vl-pag-num:hover:not(.active){background:#F3F4F6;}
`;

const SI = { fill: 'none', stroke: 'currentColor', strokeWidth: 2.2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
const Sv = (p: React.SVGProps<SVGSVGElement> & { s?: number }) => (
  <svg width={p.s || 14} height={p.s || 14} viewBox="0 0 24 24" {...SI} {...p} />
);

const IPlus    = () => <Sv><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></Sv>;
const IFilter  = () => <Sv><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></Sv>;
const ISearch  = () => <Sv><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></Sv>;
const IScooter = ({ s = 14 }) => <Sv s={s}><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></Sv>;

interface EVListItem {
  code: string;
  type: string;
  battery: number;
  speed: number;
  status: 'Available' | 'In Ride' | 'Maintenance' | 'Low Battery' | 'Offline';
  badgeCls: string;
  renter: string;
  hub: string;
  lastSeen: string;
  imgSrc: string;
  zone: string;
  category?: string;
  vehicleType?: string;
  vehicleModel?: string;
  currentKm?: string;
  totalKm?: string;
}

export default function VehicleListPage() {
  const [vehiclesList, setVehiclesList] = useState<EVListItem[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  // Multi-delete row selections
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);

  const fetchVehicles = () => {
    api.get('/vehicles')
      .then(res => {
        if (res && res.status === 'success' && res.data) {
          const mapped = res.data.map((v: any) => ({
            code: v.code,
            type: v.evegah_model_name || 'Evegah City',
            battery: v.battery_pct || 100,
            speed: parseFloat(v.speed || 0),
            status: v.vehicle_status || 'Available',
            badgeCls: v.vehicle_status === 'Available' ? 'online' : v.vehicle_status === 'In Ride' ? 'in_ride' : v.vehicle_status === 'Maintenance' ? 'low_bat' : 'offline',
            renter: v.renter_name || 'None (Available)',
            hub: v.vehicle_manufacturer || 'Evegah Hub',
            lastSeen: v.last_seen ? new Date(v.last_seen).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now',
            imgSrc: v.vehicle_image || '/City-1.png',
            zone: v.zone || 'Unassigned',
            
            category: v.vehicle_category || 'E-Scooter',
            vehicleType: v.vehicle_type || 'Rental',
            vehicleModel: v.vehicle_model || '',
            currentKm: v.current_km_reading || '0',
            totalKm: v.total_km_covered || '0'
          }));
          setVehiclesList(mapped);
        }
      })
      .catch(err => console.error('Failed to fetch vehicles:', err));
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleDeleteVehicle = (code: string) => {
    if (confirm(`Are you sure you want to delete vehicle ${code}?`)) {
      api.delete(`/vehicles/${code}`)
        .then(() => {
          setSelectedCodes(prev => prev.filter(c => c !== code));
          fetchVehicles();
        })
        .catch(err => console.error('Failed to delete vehicle:', err));
    }
  };

  const handleToggleRow = (code: string) => {
    setSelectedCodes(prev =>
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  const handleToggleAll = (filteredItems: EVListItem[]) => {
    if (selectedCodes.length === filteredItems.length) {
      setSelectedCodes([]);
    } else {
      setSelectedCodes(filteredItems.map(v => v.code));
    }
  };

  const handleMultiDelete = async () => {
    if (confirm(`Are you sure you want to delete the ${selectedCodes.length} selected vehicles?`)) {
      try {
        await Promise.all(selectedCodes.map(code => api.delete(`/vehicles/${code}`)));
        setSelectedCodes([]);
        fetchVehicles();
        alert('Selected vehicles deleted successfully!');
      } catch (err) {
        console.error('Failed to delete some vehicles:', err);
      }
    }
  };

  const filtered = vehiclesList.filter(v => {
    const matchesSearch = v.code.toLowerCase().includes(search.toLowerCase()) || v.renter.toLowerCase().includes(search.toLowerCase()) || v.hub.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || v.status === statusFilter;
    const matchesType = typeFilter === 'All' || v.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="vl-shell">
        <Sidebar activePath="/vehicles/all" />
        <div className="vl-main">
          <TopBar />
          <div className="vl-page">

            {/* Breadcrumb */}
            <div className="vl-bc">
              <Link href="/">Home</Link>
              <span className="vl-bc-sep">›</span>
              <a href="#">Vehicles</a>
              <span className="vl-bc-sep">›</span>
              <span className="vl-bc-cur">Vehicle List</span>
            </div>

            {/* Title Row */}
            <div className="vl-title-row">
              <div>
                <h1 className="vl-h1">Vehicle List</h1>
                <p className="vl-sub">Monitor stats, edit vehicle fields, assign zones, and view details.</p>
              </div>
              <div className="vl-hdr-actions">
                {selectedCodes.length > 0 && (
                  <button className="vl-hdr-btn danger" onClick={handleMultiDelete}>
                    Delete Selected ({selectedCodes.length})
                  </button>
                )}
                <Link href="/vehicles/add" className="vl-hdr-btn primary" style={{ textDecoration: 'none' }}>
                  <IPlus/> Add Vehicle
                </Link>
              </div>
            </div>

            {/* Metric KPI cards */}
            <div className="vl-stats-row">
              {[
                { lbl: 'Total Vehicles', val: vehiclesList.length, ic: <IScooter s={16}/> },
                { lbl: 'Available', val: vehiclesList.filter(v => v.status === 'Available').length, dot: 'online' },
                { lbl: 'In Ride', val: vehiclesList.filter(v => v.status === 'In Ride').length, dot: 'in_ride' },
                { lbl: 'Offline', val: vehiclesList.filter(v => v.status === 'Offline').length, dot: 'offline' },
                { lbl: 'Maintenance', val: vehiclesList.filter(v => v.status === 'Maintenance').length, dot: 'low_bat' }
              ].map(s => (
                <div className="vl-stat-card" key={s.lbl}>
                  <div className="vl-stat-ic">
                    {s.ic ? s.ic : <div className={`vl-dot ${s.dot}`}/>}
                  </div>
                  <div className="vl-stat-info">
                    <div className="vl-stat-lbl">{s.lbl}</div>
                    <div className="vl-stat-val">{s.val}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Search and filter panel */}
            <div className="vl-filter-card">
              <div className="vl-search-input-wrap">
                <span className="vl-search-ic"><ISearch/></span>
                <input 
                  type="text" 
                  className="vl-search-input" 
                  placeholder="Search by Code, Renter name, or Hub..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="vl-filter-grp">
                <select 
                  className="vl-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">All Statuses</option>
                  <option value="Available">Available</option>
                  <option value="In Ride">In Ride</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Low Battery">Low Battery</option>
                  <option value="Offline">Offline</option>
                </select>

                <select 
                  className="vl-select"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="All">All Models</option>
                  <option value="Evegah City">Evegah City</option>
                  <option value="Evegah Mink">Evegah Mink</option>
                  <option value="Evegah Fly">Evegah Fly</option>
                  <option value="Evegah Pro">Evegah Pro</option>
                </select>

                <button className="vl-hdr-btn"><IFilter/> Advanced</button>
              </div>
            </div>

            {/* List View Table */}
            <div className="vl-table-card">
              <div className="vl-table-wrap">
                <table className="vl-table">
                  <thead>
                    <tr>
                      <th style={{ width: '40px', textAlign: 'center' }}>
                        <input 
                          type="checkbox" 
                          checked={filtered.length > 0 && selectedCodes.length === filtered.length} 
                          onChange={() => handleToggleAll(filtered)}
                        />
                      </th>
                      <th>Image</th>
                      <th>Vehicle Number</th>
                      <th>Model Name</th>
                      <th>Zone</th>
                      <th>Status</th>
                      <th>Battery</th>
                      <th>Speed</th>
                      <th>Hub Location / Renter</th>
                      <th>Last Seen</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(v => {
                      const barColor = v.battery < 20 ? '#EF4444' : v.battery < 50 ? '#F59E0B' : '#10B981';
                      const isSelected = selectedCodes.includes(v.code);
                      return (
                        <tr key={v.code} style={isSelected ? { background: '#F8FAFC' } : undefined}>
                          <td style={{ textAlign: 'center' }}>
                            <input 
                              type="checkbox" 
                              checked={isSelected}
                              onChange={() => handleToggleRow(v.code)}
                            />
                          </td>
                          <td>
                            <div className="vl-veh-img-box" style={{ width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
                              <img src={v.imgSrc} alt={v.code} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            </div>
                          </td>
                          <td>
                            <div className="vl-code">{v.code}</div>
                          </td>
                          <td>
                            <div style={{ fontWeight: 600, color: '#1E293B' }}>{v.type}</div>
                          </td>
                          <td>
                            <div style={{ 
                              fontWeight: 700, 
                              color: v.zone === 'Unassigned' ? '#94A3B8' : '#2A195C',
                              fontSize: '12px'
                            }}>
                              {v.zone}
                            </div>
                          </td>
                          <td>
                            <span className={`vl-badge ${v.badgeCls}`}>{v.status}</span>
                          </td>
                          <td>
                            <div className="vl-bat-bar-wrap">
                              <span className="vl-bat-pct">{v.battery}%</span>
                              <div className="vl-bat-bar">
                                <div className="vl-bat-bar-fill" style={{ width: `${v.battery}%`, background: barColor }} />
                              </div>
                            </div>
                          </td>
                          <td>
                            <span style={{ fontWeight: 600 }}>{v.speed} km/h</span>
                          </td>
                          <td>
                            <div>
                              <div style={{ fontWeight: 600, color: '#111827' }}>{v.hub}</div>
                              {v.renter !== 'None (Available)' && (
                                <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>Renter: {v.renter}</div>
                              )}
                            </div>
                          </td>
                          <td style={{ color: '#6B7280', fontWeight: 500 }}>
                            {v.lastSeen}
                          </td>
                          <td>
                            <div className="vl-actions" style={{ justifyContent: 'flex-end' }}>
                              <Link href={`/vehicles/map?code=${v.code}`} className="vl-act-btn view" title="View details on live map">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/><line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="22" x2="12" y2="18"/></svg>
                              </Link>
                              <Link href={`/vehicles/edit?code=${v.code}`} className="vl-act-btn edit" title="Edit vehicle details">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                              </Link>
                              <button className="vl-act-btn delete" title="Delete vehicle" onClick={() => handleDeleteVehicle(v.code)}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={11} style={{ textAlign: 'center', padding: '36px 0', color: '#9CA3AF', fontWeight: 600 }}>
                          No vehicles found matching the selected filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="vl-pag-row">
                <span className="vl-pag-lbl">Showing 1 to {filtered.length} of {filtered.length} entries</span>
                <div className="vl-pag-ctrls">
                  <button className="vl-pag-btn" disabled>Previous</button>
                  <div className="vl-pag-num active">1</div>
                  <button className="vl-pag-btn" disabled>Next</button>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </>
  );
}
