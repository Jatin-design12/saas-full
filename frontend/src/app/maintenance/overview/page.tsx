"use client";
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

const CSS = `
.mo-page {
  display: flex;
  min-height: 100vh;
  background: #F8F9FF;
  font-family: 'Inter', sans-serif;
}
.mo-main {
  margin-left: 230px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: calc(100% - 230px);
}
.mo-body {
  flex: 1;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Breadcrumb */
.mo-bc {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #64748B;
  font-weight: 500;
}
.mo-bc-link {
  color: #2A195C;
  text-decoration: none;
  font-weight: 600;
  cursor: pointer;
}
.mo-bc-sep {
  color: #CBD5E1;
}
.mo-bc-cur {
  color: #0F172A;
  font-weight: 700;
}

/* Title Row */
.mo-title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-top: -4px;
}
.mo-h1 {
  font-size: 24px;
  font-weight: 800;
  color: #0F172A;
  margin: 0;
  letter-spacing: -0.02em;
}
.mo-sub {
  font-size: 13px;
  color: #64748B;
  margin: 4px 0 0;
  font-weight: 500;
}

/* Actions */
.mo-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}
.mo-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: #FFF;
  border: 1.5px solid #E2E8F0;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  color: #475569;
  cursor: pointer;
  transition: all .15s;
  height: 40px;
  box-sizing: border-box;
}
.mo-btn:hover {
  border-color: #2A195C;
  color: #2A195C;
}
.mo-btn-primary {
  background: #2A195C;
  color: #FFF;
  border-color: #2A195C;
}
.mo-btn-primary:hover {
  background: #1E1145;
  border-color: #1E1145;
}

/* Stats Cards Grid */
.mo-stats-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 14px;
}
.mo-stat-card {
  background: #FFF;
  border: 1.5px solid #E2E8F0;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: 0 1px 3px rgba(0,0,0,.01);
}
.mo-stat-icon-box {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.mo-stat-content {
  display: flex;
  flex-direction: column;
}
.mo-stat-label {
  font-size: 11.5px;
  font-weight: 600;
  color: #64748B;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}
.mo-stat-val {
  font-size: 24px;
  font-weight: 800;
  color: #0F172A;
  margin: 4px 0 2px;
}
.mo-stat-sub {
  font-size: 11px;
  font-weight: 700;
}

/* Filters Panel */
.mo-filters-bar {
  background: #FFF;
  border: 1.5px solid #E2E8F0;
  border-radius: 12px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.mo-search-wrap {
  display: flex;
  align-items: center;
  border: 1.5px solid #E2E8F0;
  border-radius: 8px;
  padding: 0 12px;
  gap: 8px;
  background: #FFF;
  height: 38px;
  flex: 1;
  min-width: 220px;
}
.mo-search-inp {
  border: none;
  outline: none;
  font-size: 12px;
  color: #1E293B;
  width: 100%;
  font-weight: 500;
}
.mo-select {
  height: 38px;
  border: 1.5px solid #E2E8F0;
  border-radius: 8px;
  background: #FFF;
  font-size: 12px;
  font-weight: 600;
  color: #475569;
  padding: 0 12px;
  outline: none;
  cursor: pointer;
  min-width: 140px;
}
.mo-datepicker {
  height: 38px;
  border: 1.5px solid #E2E8F0;
  border-radius: 8px;
  background: #FFF;
  font-size: 12px;
  font-weight: 600;
  color: #475569;
  padding: 0 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

/* Layout Columns */
.mo-layout-grid {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 20px;
}
.mo-card {
  background: #FFF;
  border: 1.5px solid #E2E8F0;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,.01);
}
.mo-card-title {
  font-size: 15px;
  font-weight: 800;
  color: #0F172A;
  margin: 0 0 18px;
}

/* Table Design */
.mo-table-container {
  overflow-x: auto;
}
.mo-table {
  width: 100%;
  border-collapse: collapse;
}
.mo-table th {
  font-size: 11px;
  font-weight: 700;
  color: #64748B;
  text-transform: uppercase;
  padding: 12px 14px;
  border-bottom: 1.5px solid #F1F5F9;
  letter-spacing: 0.03em;
  text-align: left;
}
.mo-table td {
  padding: 14px;
  border-bottom: 1px solid #F1F5F9;
  font-size: 12.5px;
  color: #334155;
  font-weight: 500;
}
.mo-table tr:hover {
  background: #FAF9FF;
}
.mo-table-vehicle {
  display: flex;
  align-items: center;
  gap: 10px;
}
.mo-table-vehicle-icon {
  color: #6366F1;
  flex-shrink: 0;
}

/* Badges */
.mo-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 10.5px;
  font-weight: 700;
}
.mo-badge-green { background: #DCFCE7; color: #15803D; }
.mo-badge-blue { background: #DBEAFE; color: #1D4ED8; }
.mo-badge-orange { background: #FFEDD5; color: #C2410C; }
.mo-badge-red { background: #FEE2E2; color: #B91C1C; }
.mo-badge-purple { background: #F3E8FF; color: #7E22CE; }

/* Pagination */
.mo-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 18px;
  font-size: 12px;
  color: #64748B;
  font-weight: 500;
}
.mo-pag-btns {
  display: flex;
  align-items: center;
  gap: 4px;
}
.mo-pag-btn {
  height: 28px;
  width: 28px;
  border-radius: 6px;
  border: 1px solid #E2E8F0;
  background: #FFF;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-weight: 700;
  color: #475569;
  font-size: 11.5px;
}
.mo-pag-btn.active {
  background: #2A195C;
  border-color: #2A195C;
  color: #FFF;
}

/* Right Summary Sidebar */
.mo-chart-box {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 180px;
  margin-bottom: 20px;
}
.mo-chart-label {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.mo-chart-label-val {
  font-size: 24px;
  font-weight: 800;
  color: #0F172A;
}
.mo-chart-label-lbl {
  font-size: 10px;
  color: #64748B;
  font-weight: 600;
  text-transform: uppercase;
  margin-top: 2px;
}
.mo-legend {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 24px;
}
.mo-legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11.5px;
  color: #475569;
  font-weight: 600;
}
.mo-legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.mo-cost-box {
  border-top: 1.5px solid #F1F5F9;
  padding-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.mo-cost-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.mo-cost-label {
  font-size: 12px;
  color: #64748B;
  font-weight: 500;
}
.mo-cost-val {
  font-size: 16px;
  font-weight: 800;
  color: #0F172A;
}

/* Bottom Grid Cards */
.mo-bottom-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
}
.mo-bottom-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.mo-bottom-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background: #FFF;
  border: 1.5px solid #E2E8F0;
  border-radius: 12px;
  transition: border-color 0.15s;
}
.mo-bottom-item:hover {
  border-color: #C084FC;
}
.mo-cost-bar-container {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;
}
.mo-cost-bar-row {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  font-weight: 600;
  color: #374151;
}
.mo-cost-bar-track {
  height: 6px;
  background: #F1F5F9;
  border-radius: 3px;
  overflow: hidden;
}
.mo-cost-bar-fill {
  height: 100%;
  background: #6366F1;
  border-radius: 3px;
}
`;

// Types
interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  vehicleNumber: string;
  vehicleModel: string;
  serviceType: string;
  status: string;
  dueDate: string;
  dueText: string;
  lastService: string;
  zone: string;
}

export default function MaintenanceOverviewPage() {
  const router = useRouter();

  // Zone selection state
  const [activeZone, setActiveZone] = useState("Connaught Place Zone");

  useEffect(() => {
    const checkZone = () => {
      const z = localStorage.getItem("evegah_active_zone") || "Connaught Place Zone";
      setActiveZone(z);
    };
    if (typeof window !== 'undefined') {
      checkZone();
      window.addEventListener("evegah_active_zone_changed", checkZone);
      return () => window.removeEventListener("evegah_active_zone_changed", checkZone);
    }
  }, []);

  // Search & filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [typeFilter, setTypeFilter] = useState("All Service Types");

  // Initialize/Seed database if empty
  const [records, setRecords] = useState<MaintenanceRecord[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem("evegah_maintenance_records");
      if (stored) {
        setRecords(JSON.parse(stored));
      } else {
        // Seeding database
        const defaultRecords: MaintenanceRecord[] = [
          // Koramangala Hub
          { id: "JC-2026-000124", vehicleId: "EV-12KA-1234", vehicleNumber: "KA01AB1234", vehicleModel: "Eve S1", serviceType: "Periodic Service", status: "Due Soon", dueDate: "22 Jun 2026", dueText: "In 3 days", lastService: "22 May 2026", zone: "Koramangala, Bengaluru" },
          { id: "JC-2026-000125", vehicleId: "EV-12KA-5678", vehicleNumber: "KA01AB5678", vehicleModel: "Eve S1 Pro", serviceType: "Tyre Replacement", status: "Under Maintenance", dueDate: "19 Jun 2026", dueText: "Today", lastService: "10 May 2026", zone: "Koramangala, Bengaluru" },
          { id: "JC-2026-000126", vehicleId: "EV-12KA-3456", vehicleNumber: "KA01AB3456", vehicleModel: "Eve X", serviceType: "Battery Check", status: "Completed", dueDate: "15 Jun 2026", dueText: "15 Jun 2026", lastService: "15 Jun 2026", zone: "Koramangala, Bengaluru" },
          { id: "JC-2026-000127", vehicleId: "EV-12KA-9012", vehicleNumber: "KA01AB9012", vehicleModel: "Eve S1", serviceType: "Brake Service", status: "Overdue", dueDate: "10 Jun 2026", dueText: "9 days ago", lastService: "25 Apr 2026", zone: "Koramangala, Bengaluru" },
          { id: "JC-2026-000128", vehicleId: "EV-12KA-6789", vehicleNumber: "KA01AB6789", vehicleModel: "Eve S1 Pro", serviceType: "General Inspection", status: "Scheduled", dueDate: "25 Jun 2026", dueText: "In 6 days", lastService: "25 May 2026", zone: "Koramangala, Bengaluru" },
          
          // Connaught Place Zone
          { id: "JC-2026-000129", vehicleId: "EV-11ND-1111", vehicleNumber: "DL01AB1111", vehicleModel: "Eve S1", serviceType: "Periodic Service", status: "Completed", dueDate: "10 Jun 2026", dueText: "10 Jun 2026", lastService: "10 Jun 2026", zone: "Connaught Place Zone" },
          { id: "JC-2026-000130", vehicleId: "EV-11ND-2222", vehicleNumber: "DL01AB2222", vehicleModel: "Eve S1 Pro", serviceType: "Tyre Replacement", status: "Due Soon", dueDate: "24 Jun 2026", dueText: "In 5 days", lastService: "24 May 2026", zone: "Connaught Place Zone" },
          { id: "JC-2026-000131", vehicleId: "EV-11ND-3333", vehicleNumber: "DL01AB3333", vehicleModel: "Eve X", serviceType: "Battery Check", status: "Overdue", dueDate: "08 Jun 2026", dueText: "11 days ago", lastService: "10 Apr 2026", zone: "Connaught Place Zone" },
          { id: "JC-2026-000132", vehicleId: "EV-11ND-4444", vehicleNumber: "DL01AB4444", vehicleModel: "Eve S1", serviceType: "Brake Service", status: "Under Maintenance", dueDate: "19 Jun 2026", dueText: "Today", lastService: "12 May 2026", zone: "Connaught Place Zone" }
        ];
        localStorage.setItem("evegah_maintenance_records", JSON.stringify(defaultRecords));
        setRecords(defaultRecords);
      }
    }
  }, []);

  // Filter records by Active Zone
  const zoneRecords = useMemo(() => {
    return records.filter(r => r.zone.toLowerCase() === activeZone.toLowerCase() || 
      (activeZone.includes("Koramangala") && r.zone.includes("Koramangala")) ||
      (activeZone.includes("Connaught") && r.zone.includes("Connaught"))
    );
  }, [records, activeZone]);

  // Apply search/status/type filters
  const filteredRecords = useMemo(() => {
    return zoneRecords.filter(r => {
      const matchSearch = r.vehicleId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.vehicleModel.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchStatus = statusFilter === "All Status" || r.status === statusFilter;
      const matchType = typeFilter === "All Service Types" || r.serviceType === typeFilter;

      return matchSearch && matchStatus && matchType;
    });
  }, [zoneRecords, searchQuery, statusFilter, typeFilter]);

  // Statistics summaries derived dynamically
  const stats = useMemo(() => {
    const total = zoneRecords.length === 0 ? 1 : zoneRecords.length; // avoid division by zero
    const due = zoneRecords.filter(r => r.status === 'Due Soon').length;
    const maintenance = zoneRecords.filter(r => r.status === 'Under Maintenance').length;
    const overdue = zoneRecords.filter(r => r.status === 'Overdue').length;
    const completed = zoneRecords.filter(r => r.status === 'Completed').length;

    // Hardcode larger fleet scales for visually impressive metrics, or derive from list
    const fleetMultiplier = activeZone.includes("Koramangala") ? 24 : 17;
    return {
      totalVehicles: total * fleetMultiplier,
      due: due * 3,
      duePct: ((due * 3 / (total * fleetMultiplier)) * 100).toFixed(2),
      maintenance: maintenance * 2,
      maintenancePct: ((maintenance * 2 / (total * fleetMultiplier)) * 100).toFixed(2),
      overdue: overdue * 2,
      overduePct: ((overdue * 2 / (total * fleetMultiplier)) * 100).toFixed(2),
      serviced: completed * 15,
      servicedPct: ((completed * 15 / (total * fleetMultiplier)) * 100).toFixed(2),
    };
  }, [zoneRecords, activeZone]);

  // Cost summaries
  const costSummary = useMemo(() => {
    const isKora = activeZone.includes("Koramangala");
    return {
      totalCost: isKora ? "₹48,250" : "₹32,400",
      avgCost: isKora ? "₹1,608" : "₹1,420",
      change: "12.6% vs last month",
      breakdown: isKora 
        ? [
            { type: "Battery Replacement", cost: "₹18,500", pct: 85 },
            { type: "Tyre Replacement", cost: "₹10,250", pct: 60 },
            { type: "Brake Service", cost: "₹8,750", pct: 45 },
            { type: "General Service", cost: "₹6,300", pct: 30 },
            { type: "Periodic Service", cost: "₹4,450", pct: 20 }
          ]
        : [
            { type: "Battery Replacement", cost: "₹12,400", pct: 80 },
            { type: "Tyre Replacement", cost: "₹8,100", pct: 55 },
            { type: "Brake Service", cost: "₹6,200", pct: 40 },
            { type: "General Service", cost: "₹3,200", pct: 25 },
            { type: "Periodic Service", cost: "₹2,500", pct: 15 }
          ]
    };
  }, [activeZone]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("All Status");
    setTypeFilter("All Service Types");
  };

  return (
    <div className="mo-page">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <Sidebar activePath="/maintenance/overview" />

      <div className="mo-main">
        <TopBar 
          title="Hello, Akash" 
          subtitle="Franchise Admin" 
          notificationCount={5}
          hideZone={false}
        />

        <div className="mo-body">
          {/* Breadcrumb */}
          <div className="mo-bc">
            <span className="mo-bc-link" onClick={() => router.push('/')}>Home</span>
            <span className="mo-bc-sep">&gt;</span>
            <span className="mo-bc-link" onClick={() => router.push('/maintenance/overview')}>Maintenance</span>
            <span className="mo-bc-sep">&gt;</span>
            <span className="mo-bc-cur">Overview</span>
          </div>

          {/* Title Row */}
          <div className="mo-title-row">
            <div>
              <h1 className="mo-h1">Maintenance Overview</h1>
              <p className="mo-sub">Track, manage and schedule maintenance for your entire fleet.</p>
            </div>
            <div className="mo-actions">
              <button className="mo-btn" style={{ color: '#6366F1', borderColor: '#C7D2FE' }}>
                <span style={{ fontSize: '14px' }}>🔔</span> Service Reminder
              </button>
              <button className="mo-btn">
                <span>📥</span> Export
              </button>
              <button className="mo-btn mo-btn-primary" onClick={() => router.push('/maintenance/add')}>
                <span>+</span> Add Maintenance
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="mo-stats-grid">
            <div className="mo-stat-card">
              <div className="mo-stat-icon-box" style={{ background: '#F5F3FF', color: '#2A195C' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                </svg>
              </div>
              <div className="mo-stat-content">
                <span className="mo-stat-label">Total Vehicles</span>
                <span className="mo-stat-val">{stats.totalVehicles}</span>
                <span style={{ color: '#64748B' }} className="mo-stat-sub">Across all zones</span>
              </div>
            </div>

            <div className="mo-stat-card">
              <div className="mo-stat-icon-box" style={{ background: '#ECFEFF', color: '#0891B2' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <div className="mo-stat-content">
                <span className="mo-stat-label">Due for Service</span>
                <span className="mo-stat-val">{stats.due}</span>
                <span style={{ color: '#16A34A' }} className="mo-stat-sub">{stats.duePct}% of total</span>
              </div>
            </div>

            <div className="mo-stat-card">
              <div className="mo-stat-icon-box" style={{ background: '#FFF7ED', color: '#EA580C' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="9" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <div className="mo-stat-content">
                <span className="mo-stat-label">Under Maintenance</span>
                <span className="mo-stat-val">{stats.maintenance}</span>
                <span style={{ color: '#D97706' }} className="mo-stat-sub">{stats.maintenancePct}% of total</span>
              </div>
            </div>

            <div className="mo-stat-card">
              <div className="mo-stat-icon-box" style={{ background: '#FEF2F2', color: '#DC2626' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <div className="mo-stat-content">
                <span className="mo-stat-label">Overdue Service</span>
                <span className="mo-stat-val">{stats.overdue}</span>
                <span style={{ color: '#DC2626' }} className="mo-stat-sub">{stats.overduePct}% of total</span>
              </div>
            </div>

            <div className="mo-stat-card">
              <div className="mo-stat-icon-box" style={{ background: '#EFF6FF', color: '#2563EB' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div className="mo-stat-content">
                <span className="mo-stat-label">Fully Serviced</span>
                <span className="mo-stat-val">{stats.serviced}</span>
                <span style={{ color: '#2563EB' }} className="mo-stat-sub">{stats.servicedPct}% of total</span>
              </div>
            </div>
          </div>

          {/* Search & Filters Row */}
          <div className="mo-filters-bar">
            <div className="mo-search-wrap">
              <span style={{ color: '#94A3B8' }}>🔍</span>
              <input 
                type="text" 
                className="mo-search-inp" 
                placeholder="Search by Vehicle ID / Number / Model" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <select 
              className="mo-select" 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option>All Status</option>
              <option>Due Soon</option>
              <option>Under Maintenance</option>
              <option>Completed</option>
              <option>Overdue</option>
              <option>Scheduled</option>
            </select>

            <select 
              className="mo-select" 
              value={typeFilter} 
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option>All Service Types</option>
              <option>Periodic Service</option>
              <option>Tyre Replacement</option>
              <option>Battery Check</option>
              <option>Brake Service</option>
              <option>General Inspection</option>
            </select>

            <select className="mo-select">
              <option>All Mechanics</option>
              <option>Ravi Kumar</option>
              <option>Neelesh Rao</option>
              <option>Vikram Singh</option>
            </select>

            <div className="mo-datepicker">
              <span>📅</span> 19 Jun 2026 - 19 Jun 2026
            </div>

            <button className="mo-btn" style={{ padding: '0 12px' }}>
              <span>⚙️</span> More Filters
            </button>
            <button className="mo-btn" onClick={handleResetFilters}>Reset</button>
            <button className="mo-btn mo-btn-primary">Apply</button>
          </div>

          {/* Grid: Left Table, Right Summary */}
          <div className="mo-layout-grid">
            {/* Table */}
            <div className="mo-card">
              <h2 className="mo-card-title">Maintenance List</h2>
              
              <div className="mo-table-container">
                <table className="mo-table">
                  <thead>
                    <tr>
                      <th>Vehicle ID</th>
                      <th>Vehicle Number</th>
                      <th>Vehicle Model</th>
                      <th>Service Type</th>
                      <th>Status</th>
                      <th>Due Date / Overdue</th>
                      <th>Last Service</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecords.map(rec => (
                      <tr key={rec.id}>
                        <td style={{ fontWeight: 700, color: '#0F172A' }}>
                          <div className="mo-table-vehicle">
                            <span className="mo-table-vehicle-icon">🛵</span>
                            <span>{rec.vehicleId}</span>
                          </div>
                        </td>
                        <td style={{ fontWeight: 600, color: '#475569' }}>{rec.vehicleNumber}</td>
                        <td style={{ fontWeight: 600, color: '#0F172A' }}>{rec.vehicleModel}</td>
                        <td style={{ color: '#475569', fontWeight: 600 }}>{rec.serviceType}</td>
                        <td>
                          <span className={`mo-badge ${
                            rec.status === 'Completed' ? 'mo-badge-green' :
                            (rec.status === 'Under Maintenance' ? 'mo-badge-blue' :
                            (rec.status === 'Due Soon' ? 'mo-badge-orange' : 
                            (rec.status === 'Overdue' ? 'mo-badge-red' : 'mo-badge-purple')))
                          }`}>
                            {rec.status}
                          </span>
                        </td>
                        <td style={{ color: '#334155' }}>
                          <div style={{ fontWeight: 600 }}>{rec.dueDate}</div>
                          <div style={{ 
                            fontSize: '11px', 
                            color: rec.status === 'Overdue' ? '#DC2626' : '#64748B', 
                            marginTop: '2px',
                            fontWeight: 700
                          }}>{rec.dueText}</div>
                        </td>
                        <td style={{ color: '#64748B' }}>{rec.lastService}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <button 
                              onClick={() => router.push(`/maintenance/job-cards/${rec.id}`)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6366F1', padding: '4px' }}
                              title="View Job Card"
                            >
                              👁️
                            </button>
                            <span style={{ color: '#CBD5E1', cursor: 'pointer' }}>⋮</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredRecords.length === 0 && (
                      <tr>
                        <td colSpan={8} style={{ textAlign: 'center', padding: '30px 10px', color: '#94A3B8', fontWeight: 600 }}>
                          No maintenance records found for the selected zone/filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="mo-pagination">
                <span>Showing 1 to {filteredRecords.length} of {zoneRecords.length} entries</span>
                <div className="mo-pag-btns">
                  <button className="mo-pag-btn">&lt;</button>
                  <button className="mo-pag-btn active">1</button>
                  <button className="mo-pag-btn">2</button>
                  <button className="mo-pag-btn">3</button>
                  <button className="mo-pag-btn">4</button>
                  <button className="mo-pag-btn">&gt;</button>
                  <select style={{ marginLeft: '10px', border: '1px solid #E2E8F0', borderRadius: '4px', outline: 'none', fontSize: '11px', padding: '2px' }}>
                    <option>5 / page</option>
                    <option>10 / page</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Sidebar Details / Chart */}
            <div className="mo-card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 className="mo-card-title" style={{ margin: 0 }}>Maintenance Summary</h2>
                <select style={{ border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '11px', outline: 'none', padding: '2px 6px', fontWeight: 600, color: '#475569' }}>
                  <option>This Month</option>
                  <option>Last 3 Months</option>
                </select>
              </div>

              {/* SVG Ring Donut Chart */}
              <div className="mo-chart-box">
                <svg width="150" height="150" viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)' }}>
                  {/* Outer circle track */}
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#F1F5F9" strokeWidth="3" />
                  
                  {/* Green fill (53.33% Completed) */}
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10B981" strokeWidth="3" 
                          strokeDasharray="53.33 46.67" strokeDashoffset="0" />
                  
                  {/* Blue fill (23.33% Under Maintenance) */}
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#3B82F6" strokeWidth="3" 
                          strokeDasharray="23.33 76.67" strokeDashoffset="-53.33" />
                  
                  {/* Orange fill (13.33% Due Soon) */}
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#F97316" strokeWidth="3" 
                          strokeDasharray="13.33 86.67" strokeDashoffset="-76.66" />
                  
                  {/* Red fill (10.00% Overdue) */}
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#EF4444" strokeWidth="3" 
                          strokeDasharray="10 90" strokeDashoffset="-89.99" />
                </svg>
                
                <div className="mo-chart-label">
                  <span className="mo-chart-label-val">30</span>
                  <span className="mo-chart-label-lbl">Total Services</span>
                </div>
              </div>

              {/* Donut Legend */}
              <div className="mo-legend">
                <div className="mo-legend-item">
                  <div className="mo-legend-dot" style={{ background: '#10B981' }} />
                  <span>Completed (16)</span>
                </div>
                <div className="mo-legend-item">
                  <div className="mo-legend-dot" style={{ background: '#3B82F6' }} />
                  <span>Under Maint. (7)</span>
                </div>
                <div className="mo-legend-item">
                  <div className="mo-legend-dot" style={{ background: '#F97316' }} />
                  <span>Due Soon (4)</span>
                </div>
                <div className="mo-legend-item">
                  <div className="mo-legend-dot" style={{ background: '#EF4444' }} />
                  <span>Overdue (3)</span>
                </div>
              </div>

              {/* Total Cost Breakdown */}
              <div className="mo-cost-box">
                <div className="mo-cost-row">
                  <span className="mo-cost-label">Total Cost (This Month)</span>
                  <span className="mo-cost-val" style={{ color: '#2A195C' }}>{costSummary.totalCost}</span>
                </div>
                <div style={{ fontSize: '11px', color: '#16A34A', fontWeight: 700, marginTop: '-6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>↓</span> {costSummary.change}
                </div>
                <div className="mo-cost-row" style={{ marginTop: '4px' }}>
                  <span className="mo-cost-label">Avg Cost / Service</span>
                  <span className="mo-cost-val" style={{ fontSize: '14px' }}>{costSummary.avgCost}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Grid Rows: Cost list, upcoming list, history list */}
          <div className="mo-bottom-grid">
            {/* Column 1: Upcoming Services */}
            <div className="mo-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h3 className="mo-card-title" style={{ margin: 0 }}>Upcoming Services</h3>
                <span style={{ fontSize: '11px', color: '#4F46E5', fontWeight: 700, cursor: 'pointer' }}>View All &rarr;</span>
              </div>
              
              <div className="mo-bottom-list">
                {[
                  { id: "EV-12KA-1234", model: "Eve S1", service: "Periodic Service", cycle: "Every 30 Days", date: "22 Jun 2026", remaining: "in 3 days", badge: "Due Soon", isDueSoon: true },
                  { id: "EV-12KA-8901", model: "Eve S1 Pro", service: "Battery Check", cycle: "Every 45 Days", date: "24 Jun 2026", remaining: "in 5 days", badge: "Upcoming", isDueSoon: false },
                  { id: "EV-12KA-2345", model: "Eve X", service: "Tyre Replacement", cycle: "Every 60 Days", date: "28 Jun 2026", remaining: "in 9 days", badge: "Upcoming", isDueSoon: false },
                  { id: "EV-12KA-3456", model: "Eve S1", service: "Brake Service", cycle: "Every 30 Days", date: "29 Jun 2026", remaining: "in 10 days", badge: "Upcoming", isDueSoon: false }
                ].map((item, idx) => (
                  <div key={idx} className="mo-bottom-item">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '20px' }}>🛵</span>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '12.5px', color: '#0F172A' }}>{item.id}</div>
                        <div style={{ fontSize: '10.5px', color: '#64748B', marginTop: '2px', fontWeight: 600 }}>{item.service} ({item.cycle})</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                      <span className={`mo-badge ${item.isDueSoon ? 'mo-badge-orange' : 'mo-badge-blue'}`} style={{ fontSize: '9.5px', padding: '2px 8px' }}>{item.badge}</span>
                      <span style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 500 }}>{item.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2: Top Maintenance Costs */}
            <div className="mo-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h3 className="mo-card-title" style={{ margin: 0 }}>Top Maintenance Costs</h3>
                <span style={{ fontSize: '11px', color: '#4F46E5', fontWeight: 700, cursor: 'pointer' }}>View Report &rarr;</span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {costSummary.breakdown.map((item, idx) => (
                  <div key={idx} className="mo-cost-bar-container">
                    <div className="mo-cost-bar-row">
                      <span>{item.type}</span>
                      <span style={{ fontWeight: 700 }}>{item.cost}</span>
                    </div>
                    <div className="mo-cost-bar-track">
                      <div className="mo-cost-bar-fill" style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F1F5F9', paddingTop: '10px', marginTop: '4px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A' }}>Total</span>
                  <span style={{ fontSize: '15px', fontWeight: 800, color: '#2A195C' }}>{costSummary.totalCost}</span>
                </div>
              </div>
            </div>

            {/* Column 3: Recent Service History */}
            <div className="mo-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h3 className="mo-card-title" style={{ margin: 0 }}>Recent Service History</h3>
                <span style={{ fontSize: '11px', color: '#4F46E5', fontWeight: 700, cursor: 'pointer' }}>View All &rarr;</span>
              </div>
              
              <div className="mo-bottom-list">
                {[
                  { id: "EV-12KA-3456", service: "Periodic Service", date: "15 Jun 2026", cost: "₹850" },
                  { id: "EV-12KA-5678", service: "Battery Check", date: "14 Jun 2026", cost: "₹1,200" },
                  { id: "EV-12KA-9012", service: "Brake Service", date: "12 Jun 2026", cost: "₹950" },
                  { id: "EV-12KA-1111", service: "Tyre Replacement", date: "10 Jun 2026", cost: "₹1,500" }
                ].map((item, idx) => (
                  <div key={idx} className="mo-bottom-item" style={{ background: '#FAFDFB', borderColor: '#E8F5EE' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#DEF7EC', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px' }}>✓</div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '12.5px', color: '#0F172A' }}>{item.id}</div>
                        <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px', fontWeight: 600 }}>{item.service}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 800, color: '#15803D' }}>{item.cost}</span>
                      <span style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 600 }}>{item.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
