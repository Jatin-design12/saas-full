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
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');
.vl-shell{display:flex;min-height:100vh;background:#F8FAFC;font-family:'Plus Jakarta Sans',sans-serif;color:#0F172A;}
.vl-main{margin-left:230px;display:flex;flex-direction:column;min-height:100vh;width:calc(100% - 230px);}
.vl-page{flex:1;padding:20px 24px 60px;}

/* breadcrumb */
.vl-bc{display:flex;align-items:center;gap:6px;font-size:12px;color:#64748B;font-weight:500;margin-bottom:8px;}
.vl-bc a{color:#64748B;text-decoration:none;}
.vl-bc a:hover{color:#6366F1;}
.vl-bc-sep{color:#CBD5E1;}
.vl-bc-cur{color:#0F172A;font-weight:700;}

/* Header Title row */
.vl-title-row{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:20px;gap:16px;}
.vl-h1{font-size:22px;font-weight:800;color:#0F172A;margin:0 0 4px;font-family:'Outfit',sans-serif;letter-spacing:-0.02em;}
.vl-sub{font-size:12.5px;color:#64748B;margin:0;font-weight:500;}
.vl-hdr-actions{display:flex;align-items:center;gap:10px;}
.vl-hdr-btn{display:flex;align-items:center;gap:6px;padding:8px 16px;background:#fff;border:1.5px solid #E2E8F0;border-radius:10px;font-size:12.5px;font-weight:700;color:#334155;cursor:pointer;transition:all .15s;}
.vl-hdr-btn:hover{border-color:#6366F1;color:#6366F1;}
.vl-hdr-btn.primary{background:#6366F1;color:#fff;border-color:#6366F1;box-shadow:0 4px 12px rgba(99,102,241,0.25);}
.vl-hdr-btn.primary:hover{background:#4f46e5;color:#fff;border-color:#4f46e5;}
.vl-hdr-btn.danger{background:#EF4444;color:#fff;border-color:#EF4444;box-shadow:0 4px 12px rgba(239,68,68,0.25);}
.vl-hdr-btn.danger:hover{background:#dc2626;border-color:#dc2626;}

/* Stats cards (5 in a row) */
.vl-stats-row{display:grid;grid-template-columns:repeat(5,1fr);gap:16px;margin-bottom:20px;}
.vl-stat-card{background:#fff;border:1px solid #E2E8F0;border-radius:14px;padding:16px;display:flex;align-items:center;gap:14px;box-shadow:0 1px 3px rgba(0,0,0,.02);transition:all .15s;}
.vl-stat-card:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(0,0,0,0.04);border-color:#CBD5E1;}
.vl-stat-ic{width:38px;height:38px;border-radius:10px;background:#EEF2FF;color:#6366F1;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-weight:800;}
.vl-stat-info{min-width:0;flex:1;}
.vl-stat-lbl{font-size:11px;color:#64748B;font-weight:700;text-transform:uppercase;letter-spacing:0.03em;margin-bottom:2px;}
.vl-stat-val{font-size:24px;font-weight:800;color:#0F172A;line-height:1;font-family:'Outfit',sans-serif;}

/* Search & filter panel */
.vl-filter-card{background:#fff;border:1px solid #E2E8F0;border-radius:14px;padding:16px 20px;margin-bottom:20px;box-shadow:0 1px 3px rgba(0,0,0,.02);display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;}
.vl-search-input-wrap{flex:1;min-width:260px;position:relative;display:flex;align-items:center;}
.vl-search-ic{position:absolute;left:12px;color:#94A3B8;display:flex;}
.vl-search-input{width:100%;padding:9px 12px 9px 36px;border:1.5px solid #E2E8F0;border-radius:10px;font-size:13px;color:#0F172A;outline:none;background:#FFF;transition:all .15s;font-weight:500;}
.vl-search-input:focus{border-color:#6366F1;box-shadow:0 0 0 3px rgba(99,102,241,0.1);}
.vl-filter-grp{display:flex;align-items:center;gap:10px;flex-wrap:wrap;}
.vl-select{padding:8px 14px;border:1.5px solid #E2E8F0;border-radius:10px;font-size:12.5px;color:#334155;background:#fff;font-weight:600;cursor:pointer;outline:none;transition:border-color .15s;}
.vl-select:focus{border-color:#6366F1;}

/* List View table */
.vl-table-card{background:#fff;border:1px solid #E2E8F0;border-radius:14px;box-shadow:0 1px 3px rgba(0,0,0,.02);overflow:hidden;}
.vl-table-wrap{width:100%;overflow-x:auto;}
.vl-table{width:100%;border-collapse:collapse;text-align:left;}
.vl-table th{background:#F8FAFC;padding:12px 16px;font-size:9.5px;font-weight:700;color:#94A3B8;text-transform:uppercase;letter-spacing:.05em;border-bottom:1px solid #F1F5F9;}
.vl-table td{padding:12px 16px;font-size:12.5px;color:#334155;border-bottom:1px solid #F1F5F9;vertical-align:middle;}
.vl-table tr:last-child td{border-bottom:none;}
.vl-table tr:hover td{background:#F8FAFC;}

.vl-veh-cell{display:flex;align-items:center;gap:12px;}
.vl-code{font-size:13.5px;font-weight:800;color:#0F172A;font-family:'Outfit',sans-serif;}
.vl-type{font-size:11px;color:#64748B;margin-top:2px;font-weight:500;}

.vl-badge{font-size:10.5px;font-weight:700;padding:3px 9px;border-radius:20px;display:inline-block;}
.vl-badge.online{background:#DCFCE7;color:#15803D;}
.vl-badge.in_ride{background:#DBEAFE;color:#1D4ED8;}
.vl-badge.low_bat{background:#FEF9C3;color:#A16207;}
.vl-badge.offline{background:#F1F5F9;color:#64748B;}

.vl-bat-bar-wrap{display:flex;align-items:center;gap:8px;}
.vl-bat-pct{font-size:12px;font-weight:700;color:#0F172A;width:34px;}
.vl-bat-bar{width:60px;height:6px;background:#E2E8F0;border-radius:3px;overflow:hidden;}
.vl-bat-bar-fill{height:100%;border-radius:3px;}

.vl-actions{display:flex;align-items:center;gap:8px;}
.vl-act-btn{width:32px;height:32px;border-radius:8px;border:1.5px solid #E2E8F0;background:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .15s;text-decoration:none;}
.vl-act-btn.view{color:#10B981;border-color:#ECFDF5;background:#ECFDF5;}
.vl-act-btn.view:hover{background:#D1FAE5;color:#059669;}
.vl-act-btn.edit{color:#6366F1;border-color:#EEF2FF;background:#EEF2FF;}
.vl-act-btn.edit:hover{background:#E0E7FF;color:#4f46e5;}
.vl-act-btn.delete{color:#EF4444;border-color:#FEF2F2;background:#FEF2F2;}
.vl-act-btn.delete:hover{background:#FEE2E2;color:#dc2626;}

.vl-pag-row{display:flex;align-items:center;justify-content:space-between;padding:14px 20px;border-top:1px solid #F1F5F9;}
.vl-pag-lbl{font-size:12px;color:#64748B;}
.vl-pag-ctrls{display:flex;align-items:center;gap:6px;}
.vl-pag-btn{padding:6px 12px;border:1.5px solid #E2E8F0;border-radius:8px;background:#fff;font-size:12px;font-weight:600;color:#334155;cursor:pointer;}
.vl-pag-btn:hover:not(:disabled){border-color:#6366F1;color:#6366F1;}
.vl-pag-btn:disabled{opacity:0.5;cursor:not-allowed;}
.vl-pag-num{width:30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;cursor:pointer;}
.vl-pag-num.active{background:#6366F1;color:#fff;}
.vl-pag-num:hover:not(.active){background:#F8FAFC;}
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
  const [selectedZone, setSelectedZone] = useState('All Zones');
  const [zonesList, setZonesList] = useState<string[]>(['All Zones']);

  useEffect(() => {
    api.get('/zones').then((res: any) => {
      if (res && res.data) {
        const names = res.data.map((z: any) => z.name || z.locality).filter(Boolean);
        setZonesList(['All Zones', ...new Set<string>(names)]);
      }
    }).catch(() => {});
  }, []);

  // Multi-delete row selections
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);

  // Vehicle Models & Media Modal State
  const [isModelModalOpen, setIsModelModalOpen] = useState(false);
  const [isSavingModel, setIsSavingModel] = useState(false);
  const [modelFormData, setModelFormData] = useState({
    name: 'Evegah City',
    category: 'E-Vehicle',
    tagline: 'Stylish. Powerful. Eco-friendly.',
    rating: '4.6',
    reviewsCount: '128',
    description: 'Evegah City is built for the modern commuter. It combines performance, comfort and style with zero emissions.',
    range: '90–110 km',
    topSpeed: '60 km/h',
    batteryCapacity: '2.3 kWh',
    brakes: 'Disc Brakes (Front & Rear)',
    motorPower: '2500 W',
    batteryType: 'Lithium-ion',
    wheelSize: '12 inch',
    waterResistance: 'IP67',
    chargingTime: '4 – 5 Hours',
    loadCapacity: '150 kg',
    warranty: '1 Year Warranty',
    mainImage: 'assets/City-1.png',
    videoUrl: 'assets/ev_video.mp4',
    galleryImagesStr: 'assets/City-1.png, assets/ev_baroda.png, assets/mink_banner.png, assets/Pro_Banner.png',
  });

  const handleSaveModelData = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingModel(true);
    try {
      const galleryList = modelFormData.galleryImagesStr
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      await api.post('/vehicles/models', {
        ...modelFormData,
        galleryImages: galleryList
      });
      alert(`Model specs & media for "${modelFormData.name}" updated successfully!`);
      setIsModelModalOpen(false);
    } catch (err: any) {
      alert(`Failed to save model specs: ${err.message || err}`);
    } finally {
      setIsSavingModel(false);
    }
  };

  useEffect(() => {
    const updateZone = () => {
      if (typeof window !== 'undefined') {
        const z = localStorage.getItem('evegah_active_zone') || localStorage.getItem('evegah_selected_zone') || 'All Zones';
        setSelectedZone(z);
      }
    };
    updateZone();
    window.addEventListener('evegah_active_zone_changed', updateZone);
    window.addEventListener('evegah_zone_changed', updateZone);
    return () => {
      window.removeEventListener('evegah_active_zone_changed', updateZone);
      window.removeEventListener('evegah_zone_changed', updateZone);
    };
  }, []);

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
    const matchesZone = !selectedZone || selectedZone === 'All Zones' || v.zone.toLowerCase().trim() === selectedZone.toLowerCase().trim();
    const matchesSearch = v.code.toLowerCase().includes(search.toLowerCase()) || v.renter.toLowerCase().includes(search.toLowerCase()) || v.hub.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || v.status === statusFilter;
    const matchesType = typeFilter === 'All' || v.type === typeFilter;
    return matchesZone && matchesSearch && matchesStatus && matchesType;
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
                <p className="vl-sub">
                  Monitor stats, edit vehicle fields, assign zones, and view details.
                  {selectedZone && selectedZone !== 'All Zones' && (
                    <span style={{ marginLeft: '8px', color: '#6366F1', fontWeight: 'bold' }}>
                      📍 Filtered by: {selectedZone}
                    </span>
                  )}
                </p>
              </div>
              <div className="vl-hdr-actions">
                {selectedCodes.length > 0 && (
                  <button className="vl-hdr-btn danger" onClick={handleMultiDelete}>
                    Delete Selected ({selectedCodes.length})
                  </button>
                )}
                <Link 
                  href="/vehicles/models"
                  className="vl-hdr-btn" 
                  style={{ borderColor: '#8B5CF6', color: '#8B5CF6', background: '#F5F3FF', textDecoration: 'none' }}
                >
                  ⚡ Vehicle Models & Media
                </Link>
                <Link href="/vehicles/add" className="vl-hdr-btn primary" style={{ textDecoration: 'none' }}>
                  <IPlus/> Add Vehicle
                </Link>
              </div>
            </div>

            {/* Metric KPI cards */}
            <div className="vl-stats-row">
              {[
                { lbl: 'Total Vehicles', val: filtered.length, ic: <IScooter s={16}/> },
                { lbl: 'Available', val: filtered.filter(v => v.status === 'Available').length, dot: 'online' },
                { lbl: 'In Ride', val: filtered.filter(v => v.status === 'In Ride').length, dot: 'in_ride' },
                { lbl: 'Offline', val: filtered.filter(v => v.status === 'Offline').length, dot: 'offline' },
                { lbl: 'Maintenance', val: filtered.filter(v => v.status === 'Maintenance').length, dot: 'low_bat' }
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
                  value={selectedZone}
                  onChange={(e) => setSelectedZone(e.target.value)}
                >
                  {zonesList.map(z => (
                    <option key={z} value={z}>{z}</option>
                  ))}
                </select>

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

        {/* --- VEHICLE MODELS & MEDIA DETAILS MANAGER MODAL --- */}
        {isModelModalOpen && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '20px'
          }}>
            <div style={{
              background: '#fff',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '750px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: '1px solid #E2E8F0',
              padding: '24px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid #F1F5F9', paddingBottom: '14px' }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#0F172A' }}>
                    ⚡ Vehicle Models & Media Manager
                  </h2>
                  <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#64748B' }}>
                    Configure specs, video URL, tagline, rating, and gallery images for each model.
                  </p>
                </div>
                <button 
                  onClick={() => setIsModelModalOpen(false)}
                  style={{ background: '#F1F5F9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveModelData} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Model Selection Dropdown */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Vehicle Model Name</label>
                    <select 
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1.5px solid #E2E8F0', fontSize: '13px', fontWeight: 600 }}
                      value={modelFormData.name}
                      onChange={(e) => {
                        const name = e.target.value;
                        if (name === 'Evegah City') {
                          setModelFormData({
                            name: 'Evegah City',
                            category: 'E-Vehicle',
                            tagline: 'Stylish. Powerful. Eco-friendly.',
                            rating: '4.6',
                            reviewsCount: '128',
                            description: 'Evegah City is built for the modern commuter. It combines performance, comfort and style with zero emissions.',
                            range: '90–110 km',
                            topSpeed: '60 km/h',
                            batteryCapacity: '2.3 kWh',
                            brakes: 'Disc Brakes (Front & Rear)',
                            motorPower: '2500 W',
                            batteryType: 'Lithium-ion',
                            wheelSize: '12 inch',
                            waterResistance: 'IP67',
                            chargingTime: '4 – 5 Hours',
                            loadCapacity: '150 kg',
                            warranty: '1 Year Warranty',
                            mainImage: 'assets/City-1.png',
                            videoUrl: 'assets/ev_video.mp4',
                            galleryImagesStr: 'assets/City-1.png, assets/ev_baroda.png, assets/mink_banner.png, assets/Pro_Banner.png'
                          });
                        } else if (name === 'Evegah Pro') {
                          setModelFormData({
                            name: 'Evegah Pro',
                            category: 'E-Scooter',
                            tagline: 'High Speed Performance EV Scooter.',
                            rating: '4.8',
                            reviewsCount: '215',
                            description: 'Evegah Pro delivers ultimate power and range for highway and long-distance commuting.',
                            range: '110–130 km',
                            topSpeed: '75 km/h',
                            batteryCapacity: '3.1 kWh',
                            brakes: 'CBS Brakes (Front & Rear)',
                            motorPower: '3200 W',
                            batteryType: 'Advanced LiFePO4',
                            wheelSize: '12 inch',
                            waterResistance: 'IP68',
                            chargingTime: '3 – 4 Hours',
                            loadCapacity: '180 kg',
                            warranty: '2 Years Warranty',
                            mainImage: 'assets/Pro_Banner.png',
                            videoUrl: 'assets/ev_video.mp4',
                            galleryImagesStr: 'assets/Pro_Banner.png, assets/fleet_bg_pro.jpg, assets/city.png'
                          });
                        } else if (name === 'Evegah Fly') {
                          setModelFormData({
                            name: 'Evegah Fly',
                            category: 'E-Moped',
                            tagline: 'Lightweight & Agile City Moped.',
                            rating: '4.5',
                            reviewsCount: '94',
                            description: 'Evegah Fly is engineered for effortless maneuverability and instant swappable battery support.',
                            range: '40–60 km',
                            topSpeed: '25 km/h',
                            batteryCapacity: '1.2 kWh',
                            brakes: 'Front Disc & Rear Drum',
                            motorPower: '1200 W',
                            batteryType: 'Swappable Li-ion',
                            wheelSize: '10 inch',
                            waterResistance: 'IP65',
                            chargingTime: '2.5 – 3 Hours',
                            loadCapacity: '120 kg',
                            warranty: '1 Year Warranty',
                            mainImage: 'assets/fly-1.png',
                            videoUrl: 'assets/ev_video.mp4',
                            galleryImagesStr: 'assets/fly-1.png, assets/fleet_bg_cycle.jpg, assets/city-white.png'
                          });
                        } else if (name === 'Evegah Mink') {
                          setModelFormData({
                            name: 'Evegah Mink',
                            category: 'E-Cargo',
                            tagline: 'Heavy-Duty Cargo & Delivery EV.',
                            rating: '4.7',
                            reviewsCount: '156',
                            description: 'Evegah Mink is built for commercial delivery and cargo transport with high load capacity.',
                            range: '70–90 km',
                            topSpeed: '45 km/h',
                            batteryCapacity: '2.0 kWh',
                            brakes: 'Dual Heavy Disc Brakes',
                            motorPower: '2000 W',
                            batteryType: 'High-Capacity Li-ion',
                            wheelSize: '12 inch',
                            waterResistance: 'IP67',
                            chargingTime: '4 Hours',
                            loadCapacity: '220 kg',
                            warranty: '2 Years Warranty',
                            mainImage: 'assets/mink.png',
                            videoUrl: 'assets/ev_video.mp4',
                            galleryImagesStr: 'assets/mink.png, assets/mink_banner.png, assets/MINK.png'
                          });
                        }
                      }}
                    >
                      <option value="Evegah City">Evegah City</option>
                      <option value="Evegah Pro">Evegah Pro</option>
                      <option value="Evegah Fly">Evegah Fly</option>
                      <option value="Evegah Mink">Evegah Mink</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Category Badge</label>
                    <input 
                      type="text" 
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1.5px solid #E2E8F0', fontSize: '13px' }}
                      value={modelFormData.category}
                      onChange={(e) => setModelFormData({ ...modelFormData, category: e.target.value })}
                    />
                  </div>
                </div>

                {/* Tagline & Ratings */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Tagline</label>
                    <input 
                      type="text" 
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1.5px solid #E2E8F0', fontSize: '13px' }}
                      value={modelFormData.tagline}
                      onChange={(e) => setModelFormData({ ...modelFormData, tagline: e.target.value })}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Rating (★)</label>
                    <input 
                      type="text" 
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1.5px solid #E2E8F0', fontSize: '13px' }}
                      value={modelFormData.rating}
                      onChange={(e) => setModelFormData({ ...modelFormData, rating: e.target.value })}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Reviews Count</label>
                    <input 
                      type="text" 
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1.5px solid #E2E8F0', fontSize: '13px' }}
                      value={modelFormData.reviewsCount}
                      onChange={(e) => setModelFormData({ ...modelFormData, reviewsCount: e.target.value })}
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Overview Description</label>
                  <textarea 
                    rows={2} 
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1.5px solid #E2E8F0', fontSize: '13px', fontFamily: 'inherit' }}
                    value={modelFormData.description}
                    onChange={(e) => setModelFormData({ ...modelFormData, description: e.target.value })}
                  />
                </div>

                {/* Technical Specifications Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '2px' }}>Range</label>
                    <input type="text" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px' }} value={modelFormData.range} onChange={(e) => setModelFormData({ ...modelFormData, range: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '2px' }}>Top Speed</label>
                    <input type="text" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px' }} value={modelFormData.topSpeed} onChange={(e) => setModelFormData({ ...modelFormData, topSpeed: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '2px' }}>Battery Capacity</label>
                    <input type="text" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px' }} value={modelFormData.batteryCapacity} onChange={(e) => setModelFormData({ ...modelFormData, batteryCapacity: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '2px' }}>Brakes</label>
                    <input type="text" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px' }} value={modelFormData.brakes} onChange={(e) => setModelFormData({ ...modelFormData, brakes: e.target.value })} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '2px' }}>Motor Power</label>
                    <input type="text" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px' }} value={modelFormData.motorPower} onChange={(e) => setModelFormData({ ...modelFormData, motorPower: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '2px' }}>Charging Time</label>
                    <input type="text" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px' }} value={modelFormData.chargingTime} onChange={(e) => setModelFormData({ ...modelFormData, chargingTime: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '2px' }}>Load Capacity</label>
                    <input type="text" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px' }} value={modelFormData.loadCapacity} onChange={(e) => setModelFormData({ ...modelFormData, loadCapacity: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '2px' }}>Warranty</label>
                    <input type="text" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px' }} value={modelFormData.warranty} onChange={(e) => setModelFormData({ ...modelFormData, warranty: e.target.value })} />
                  </div>
                </div>

                {/* Media Section: Images & Video */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '4px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Main Vehicle Graphic Path/URL</label>
                    <input 
                      type="text" 
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1.5px solid #E2E8F0', fontSize: '13px' }}
                      value={modelFormData.mainImage}
                      onChange={(e) => setModelFormData({ ...modelFormData, mainImage: e.target.value })}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Video URL / Asset Path</label>
                    <input 
                      type="text" 
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1.5px solid #E2E8F0', fontSize: '13px' }}
                      value={modelFormData.videoUrl}
                      onChange={(e) => setModelFormData({ ...modelFormData, videoUrl: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Gallery Images (Comma Separated)</label>
                  <input 
                    type="text" 
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1.5px solid #E2E8F0', fontSize: '13px' }}
                    value={modelFormData.galleryImagesStr}
                    onChange={(e) => setModelFormData({ ...modelFormData, galleryImagesStr: e.target.value })}
                  />
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                  <button 
                    type="button" 
                    onClick={() => setIsModelModalOpen(false)}
                    style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid #CBD5E1', background: '#fff', color: '#475569', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSavingModel}
                    style={{ padding: '10px 24px', borderRadius: '10px', border: 'none', background: '#6366F1', color: '#fff', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)' }}
                  >
                    {isSavingModel ? 'Saving...' : 'Save Model Specs & Media'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
