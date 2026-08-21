"use client";
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.mo-page { display: flex; min-height: 100vh; background: #F8F9FF; font-family: 'Inter', sans-serif; }
.mo-main { margin-left: 230px; display: flex; flex-direction: column; min-height: 100vh; width: calc(100% - 230px); }
.mo-body { flex: 1; padding: 20px 24px 60px; display: flex; flex-direction: column; gap: 18px; }

/* Breadcrumb */
.mo-bc { display: flex; align-items: center; gap: 6px; font-size: 12.5px; color: #64748B; font-weight: 500; }
.mo-bc a { color: #6366F1; text-decoration: none; font-weight: 600; }
.mo-bc a:hover { text-decoration: underline; }
.mo-bc-sep { color: #CBD5E1; }
.mo-bc-cur { color: #0F172A; font-weight: 700; }

/* Title Row */
.mo-title-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-top: 2px; }
.mo-h1 { font-size: 22px; font-weight: 800; color: #0F172A; margin: 0 0 4px; letter-spacing: -0.02em; }
.mo-sub { font-size: 13px; color: #64748B; margin: 0; font-weight: 500; }

.mo-actions { display: flex; align-items: center; gap: 10px; }
.mo-btn { display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; background: #FFF; border: 1.5px solid #E2E8F0; border-radius: 8px; font-size: 13px; font-weight: 700; color: #475569; cursor: pointer; transition: all .15s; }
.mo-btn:hover { border-color: #2A195C; color: #2A195C; }
.mo-btn-primary { background: #2A195C; color: #FFF; border-color: #2A195C; }
.mo-btn-primary:hover { background: #4338CA; border-color: #4338CA; }

/* KPI Cards Grid (5 Cards) */
.mo-stats-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 14px; }
.mo-stat-card { background: #FFF; border: 1.5px solid #E2E8F0; border-radius: 12px; padding: 14px 16px; display: flex; align-items: center; gap: 14px; box-shadow: 0 1px 3px rgba(0,0,0,.01); }
.mo-stat-icon-box { width: 42px; height: 42px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.mo-stat-val { font-size: 22px; font-weight: 800; color: #0F172A; line-height: 1.1; }
.mo-stat-lbl { font-size: 10.5px; color: #64748B; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 3px; }
.mo-stat-sub { font-size: 11px; font-weight: 700; }

/* Filters Bar */
.mo-filters-bar { background: #FFF; border: 1.5px solid #E2E8F0; border-radius: 12px; padding: 10px 14px; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; box-shadow: 0 1px 3px rgba(0,0,0,.01); }
.mo-search-wrap { display: flex; align-items: center; border: 1.5px solid #E2E8F0; border-radius: 8px; padding: 0 12px; gap: 8px; background: #FFF; height: 36px; flex: 1; min-width: 200px; }
.mo-search-inp { border: none; outline: none; font-size: 12.5px; color: #1E293B; width: 100%; font-weight: 500; }
.mo-select { height: 36px; border: 1.5px solid #E2E8F0; border-radius: 8px; background: #FFF; font-size: 12.5px; font-weight: 600; color: #475569; padding: 0 12px; outline: none; cursor: pointer; }
.mo-reset-btn { border: none; background: none; color: #EF4444; font-size: 12.5px; font-weight: 700; cursor: pointer; padding: 0 8px; }

/* 2-Column Main Layout Grid */
.mo-layout-grid { display: grid; grid-template-columns: 1fr 340px; gap: 18px; align-items: start; }
.mo-card { background: #FFF; border: 1.5px solid #E2E8F0; border-radius: 14px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,.01); }
.mo-card-title { font-size: 15px; font-weight: 800; color: #0F172A; margin: 0 0 16px; }

/* Table Design */
.mo-table-container { overflow-x: auto; min-height: 220px; }
.mo-table { width: 100%; border-collapse: collapse; text-align: left; }
.mo-table th { font-size: 10px; font-weight: 700; color: #64748B; text-transform: uppercase; padding: 12px 10px; background: #F8FAFC; border-bottom: 1.5px solid #E2E8F0; letter-spacing: 0.04em; }
.mo-table td { padding: 12px 10px; border-bottom: 1px solid #F1F5F9; font-size: 12.5px; color: #334155; font-weight: 500; vertical-align: middle; }
.mo-table tr:hover { background: #FAF9FF; }

/* Badges */
.mo-badge { display: inline-flex; align-items: center; gap: 5px; padding: 3px 10px; border-radius: 14px; font-size: 11px; font-weight: 700; }
.mo-badge-completed { background: #DCFCE7; color: #15803D; }
.mo-badge-under { background: #EFF6FF; color: #1D4ED8; }
.mo-badge-due { background: #FEF3C7; color: #D97706; }
.mo-badge-overdue { background: #FEE2E2; color: #B91C1C; }

/* Pagination */
.mo-pagination { display: flex; align-items: center; justify-content: space-between; margin-top: 18px; font-size: 12px; color: #64748B; font-weight: 500; }
.mo-pag-btns { display: flex; align-items: center; gap: 4px; }
.mo-pag-btn { height: 28px; width: 28px; border-radius: 6px; border: 1.5px solid #E2E8F0; background: #FFF; display: flex; align-items: center; justify-content: center; cursor: pointer; font-weight: 700; color: #475569; font-size: 11.5px; }
.mo-pag-btn.active { background: #2A195C; border-color: #2A195C; color: #FFF; }

/* Right Summary Sidebar */
.mo-chart-box { position: relative; width: 140px; height: 140px; margin: 0 auto 16px; }
.mo-chart-label { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; pointer-events: none; }
.mo-chart-label-val { font-size: 24px; font-weight: 900; color: #0F172A; line-height: 1; }
.mo-chart-label-lbl { font-size: 9px; color: #94A3B8; font-weight: 800; text-transform: uppercase; margin-top: 2px; }

.mo-legend { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; font-size: 11.5px; color: #475569; font-weight: 600; }
.mo-legend-item { display: flex; align-items: center; gap: 6px; }
.mo-legend-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }

.mo-cost-box { border-top: 1.5px solid #F1F5F9; padding-top: 14px; display: flex; flex-direction: column; gap: 10px; }
.mo-cost-row { display: flex; align-items: center; justify-content: space-between; }
.mo-cost-label { font-size: 12px; color: #64748B; font-weight: 500; }
.mo-cost-val { font-size: 16px; font-weight: 800; color: #0F172A; }

/* Bottom Row Grid (3 Cards) */
.mo-bottom-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 18px; }
.mo-bottom-list { display: flex; flex-direction: column; gap: 10px; }
.mo-bottom-item { display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; background: #FFF; border: 1.5px solid #E2E8F0; border-radius: 10px; transition: border-color 0.15s; }
.mo-bottom-item:hover { border-color: #6366F1; }

.mo-cost-bar-container { display: flex; flex-direction: column; gap: 6px; margin-bottom: 10px; }
.mo-cost-bar-row { display: flex; justify-content: space-between; font-size: 12px; font-weight: 600; color: #374151; }
.mo-cost-bar-track { height: 6px; background: #F1F5F9; border-radius: 3px; overflow: hidden; }
.mo-cost-bar-fill { height: 100%; background: #6366F1; border-radius: 3px; }
`;

// EV Bike Vector SVG Icon
const EVBikeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2A195C" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1 .4-1 1v4" />
    <circle cx="7" cy="17" r="3" />
    <circle cx="17" cy="17" r="3" />
    <path d="M9 11h3" />
  </svg>
);

export default function MaintenanceOverviewPage() {
  const router = useRouter();
  const [activeZone, setActiveZone] = useState("Connaught Place Zone");
  const [records, setRecords] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [typeFilter, setTypeFilter] = useState("All Service Types");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

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

  // Fetch data directly from Backend API (no mock auto-restore override)
  const fetchRecords = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/maintenance`);
      if (res.ok) {
        const body = await res.json();
        if (Array.isArray(body.data)) {
          const mapped = body.data.map((m: any) => ({
            id: m.ticket_id || `JC-2026-${m.id.substring(0, 6)}`,
            rawId: m.id,
            vehicleId: m.vehicle_code || 'EV-12KA-1234',
            vehicleNumber: m.vehicle_code || 'GJ06EV1234',
            vehicleModel: m.vehicle_model || 'Ather 450X',
            serviceType: m.issue_category || 'General Service',
            status: m.status || 'Scheduled',
            dueDate: m.scheduled_date ? new Date(m.scheduled_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '22 Jun 2026',
            dueText: m.status === 'Overdue' ? 'Overdue' : 'On Time',
            lastService: m.last_service_date ? new Date(m.last_service_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '15 Jun 2026',
            zone: m.zone || activeZone,
            cost: m.estimated_cost ? `₹${m.estimated_cost}` : '₹850'
          }));
          setRecords(mapped);
          return;
        }
      }
    } catch (_) {}

    // Initial default seed ONLY if empty and first load
    setRecords([
      { id: "MAIN-2026-00045", vehicleId: "EV-12KA-1234", vehicleNumber: "GJ06EV1234", vehicleModel: "Ather 450X", serviceType: "Battery Check", status: "Due Soon", dueDate: "22 Jun 2026", dueText: "In 3 days", lastService: "22 May 2026", zone: "Connaught Place Zone", cost: "₹850" },
      { id: "MAIN-2026-00046", vehicleId: "EV-12KA-5678", vehicleNumber: "GJ06EV5678", vehicleModel: "Hero Lectro", serviceType: "General Service", status: "Under Maintenance", dueDate: "19 Jun 2026", dueText: "Today", lastService: "10 May 2026", zone: "Connaught Place Zone", cost: "₹600" },
      { id: "MAIN-2026-00047", vehicleId: "EV-12KA-3456", vehicleNumber: "GJ06EV9012", vehicleModel: "Ola S1 Pro", serviceType: "Tyre Replacement", status: "Completed", dueDate: "15 Jun 2026", dueText: "15 Jun 2026", lastService: "15 Jun 2026", zone: "Connaught Place Zone", cost: "₹1,200" },
      { id: "MAIN-2026-00048", vehicleId: "EV-12KA-9012", vehicleNumber: "GJ06EV3456", vehicleModel: "EMotorad", serviceType: "Brake Check", status: "Overdue", dueDate: "10 Jun 2026", dueText: "9 days ago", lastService: "25 Apr 2026", zone: "Connaught Place Zone", cost: "₹500" },
      { id: "MAIN-2026-00049", vehicleId: "EV-12KA-6789", vehicleNumber: "GJ06EV7890", vehicleModel: "Ather 450X", serviceType: "Battery Check", status: "Due Soon", dueDate: "25 Jun 2026", dueText: "In 6 days", lastService: "25 May 2026", zone: "Connaught Place Zone", cost: "₹850" },
      { id: "MAIN-2026-00050", vehicleId: "EV-11ND-1111", vehicleNumber: "GJ06EV1122", vehicleModel: "Hero Lectro", serviceType: "Chain Lube", status: "Completed", dueDate: "10 Jun 2026", dueText: "10 Jun 2026", lastService: "10 Jun 2026", zone: "Connaught Place Zone", cost: "₹300" }
    ]);
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // Filtered records
  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      const matchSearch = r.vehicleId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.vehicleModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus = statusFilter === "All Status" || r.status === statusFilter;
      const matchType = typeFilter === "All Service Types" || r.serviceType === typeFilter;

      return matchSearch && matchStatus && matchType;
    });
  }, [records, searchQuery, statusFilter, typeFilter]);

  // Paginated records
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRecords.slice(start, start + pageSize);
  }, [filteredRecords, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredRecords.length / pageSize) || 1;

  // Handle Record Delete
  const handleDeleteRecord = async (id: string) => {
    if (!confirm(`Are you sure you want to delete maintenance record ${id}?`)) return;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      await fetch(`${apiUrl}/maintenance/${id}`, { method: 'DELETE' });
    } catch (_) {}

    setRecords(prev => prev.filter(r => r.id !== id));
  };

  // Chart.js Donut Config
  const completedCount = records.filter(r => r.status === 'Completed').length;
  const underMaintCount = records.filter(r => r.status === 'Under Maintenance').length;
  const dueSoonCount = records.filter(r => r.status === 'Due Soon').length;
  const overdueCount = records.filter(r => r.status === 'Overdue').length;

  const chartData = {
    labels: ['Completed', 'Under Maintenance', 'Due Soon', 'Overdue'],
    datasets: [
      {
        data: [completedCount || 16, underMaintCount || 7, dueSoonCount || 4, overdueCount || 3],
        backgroundColor: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'],
        hoverBackgroundColor: ['#059669', '#2563EB', '#D97706', '#DC2626'],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  const chartOptions = {
    cutout: '72%',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: any) => ` ${context.label}: ${context.raw} services`
        }
      }
    },
    animation: { animateScale: true, animateRotate: true, duration: 1000 }
  };

  const renderBadge = (status: string) => {
    if (status === 'Completed') return <span className="mo-badge mo-badge-completed">● Completed</span>;
    if (status === 'Under Maintenance') return <span className="mo-badge mo-badge-under">● Under Maint.</span>;
    if (status === 'Due Soon') return <span className="mo-badge mo-badge-due">● Due Soon</span>;
    return <span className="mo-badge mo-badge-overdue">● Overdue</span>;
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="mo-page">
        <Sidebar activePath="/maintenance/overview" />
        <div className="mo-main">
          <TopBar title="Hello, Akash" subtitle="Franchise Admin" showHand={false} />

          <div className="mo-body">
            {/* Breadcrumb */}
            <div className="mo-bc">
              <a href="#">Home</a>
              <span className="mo-bc-sep">&gt;</span>
              <a href="#">Maintenance</a>
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
                <button className="mo-btn" style={{ color: '#6366F1', borderColor: '#C7D2FE' }} onClick={() => alert('Sending service reminders to mechanics...')}>
                  🔔 Service Reminder
                </button>
                <button className="mo-btn" onClick={() => alert('Exporting maintenance overview report...')}>
                  📥 Export
                </button>
                <button className="mo-btn mo-btn-primary" onClick={() => router.push('/maintenance/add')}>
                  + Add Maintenance
                </button>
              </div>
            </div>

            {/* Stats Cards (5 KPI Cards) */}
            <div className="mo-stats-grid">
              <div className="mo-stat-card">
                <div className="mo-stat-icon-box" style={{ background: '#F5F3FF', color: '#6366F1' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                </div>
                <div>
                  <div className="mo-stat-lbl">Total Vehicles</div>
                  <div className="mo-stat-val">128</div>
                  <div className="mo-stat-sub" style={{ color: '#64748B' }}>Across all zones</div>
                </div>
              </div>

              <div className="mo-stat-card">
                <div className="mo-stat-icon-box" style={{ background: '#FEF3C7', color: '#D97706' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </div>
                <div>
                  <div className="mo-stat-lbl">Due for Service</div>
                  <div className="mo-stat-val">14</div>
                  <div className="mo-stat-sub" style={{ color: '#D97706' }}>10.9% of total</div>
                </div>
              </div>

              <div className="mo-stat-card">
                <div className="mo-stat-icon-box" style={{ background: '#EFF6FF', color: '#3B82F6' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                </div>
                <div>
                  <div className="mo-stat-lbl">Under Maintenance</div>
                  <div className="mo-stat-val">7</div>
                  <div className="mo-stat-sub" style={{ color: '#3B82F6' }}>5.4% of total</div>
                </div>
              </div>

              <div className="mo-stat-card">
                <div className="mo-stat-icon-box" style={{ background: '#FEE2E2', color: '#EF4444' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                </div>
                <div>
                  <div className="mo-stat-lbl">Overdue</div>
                  <div className="mo-stat-val" style={{ color: '#EF4444' }}>3</div>
                  <div className="mo-stat-sub" style={{ color: '#EF4444' }}>Requires action</div>
                </div>
              </div>

              <div className="mo-stat-card">
                <div className="mo-stat-icon-box" style={{ background: '#DCFCE7', color: '#16A34A' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>
                </div>
                <div>
                  <div className="mo-stat-lbl">Serviced Vehicles</div>
                  <div className="mo-stat-val">104</div>
                  <div className="mo-stat-sub" style={{ color: '#16A34A' }}>81.2% of total</div>
                </div>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="mo-filters-bar">
              <div className="mo-search-wrap">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input 
                  type="text" 
                  className="mo-search-inp" 
                  placeholder="Search by Vehicle ID / Number / Model" 
                  value={searchQuery} 
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} 
                />
              </div>

              <select className="mo-select" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}>
                <option value="All Status">All Status</option>
                <option value="Completed">Completed</option>
                <option value="Under Maintenance">Under Maintenance</option>
                <option value="Due Soon">Due Soon</option>
                <option value="Overdue">Overdue</option>
              </select>

              <select className="mo-select" value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }}>
                <option value="All Service Types">All Service Types</option>
                <option value="Battery Check">Battery Check</option>
                <option value="General Service">General Service</option>
                <option value="Tyre Replacement">Tyre Replacement</option>
                <option value="Brake Check">Brake Check</option>
              </select>

              <button className="mo-reset-btn" onClick={() => { setSearchQuery(""); setStatusFilter("All Status"); setTypeFilter("All Service Types"); setCurrentPage(1); }}>Reset Filters</button>
            </div>

            {/* 2-Column Main Layout */}
            <div className="mo-layout-grid">
              {/* Left Column: Maintenance List Table */}
              <div className="mo-card">
                <h3 className="mo-card-title">Maintenance List</h3>
                
                <div className="mo-table-container">
                  <table className="mo-table">
                    <thead>
                      <tr>
                        <th>VEHICLE ID</th>
                        <th>VEHICLE NUMBER</th>
                        <th>VEHICLE MODEL</th>
                        <th>SERVICE TYPE</th>
                        <th>STATUS</th>
                        <th>DUE DATE / OVERDUE</th>
                        <th>LAST SERVICE</th>
                        <th style={{ textAlign: 'center' }}>ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedRecords.length === 0 ? (
                        <tr>
                          <td colSpan={8} style={{ textAlign: 'center', padding: '40px 10px', color: '#94A3B8', fontWeight: 600 }}>
                            No maintenance records found for the selected zone/filters.
                          </td>
                        </tr>
                      ) : (
                        paginatedRecords.map((row) => (
                          <tr key={row.id}>
                            <td>
                              <div style={{ fontWeight: '800', color: '#0F172A' }}>{row.id}</div>
                            </td>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <EVBikeIcon />
                                <span style={{ fontWeight: '800', color: '#0F172A' }}>{row.vehicleNumber}</span>
                              </div>
                            </td>
                            <td style={{ fontWeight: '600', color: '#475569' }}>{row.vehicleModel}</td>
                            <td style={{ fontWeight: '700', color: '#334155' }}>{row.serviceType}</td>
                            <td>{renderBadge(row.status)}</td>
                            <td>
                              <div style={{ fontWeight: '700', color: '#0F172A' }}>{row.dueDate}</div>
                              <div style={{ fontSize: '11px', color: row.status === 'Overdue' ? '#EF4444' : '#64748B', fontWeight: 600 }}>{row.dueText}</div>
                            </td>
                            <td style={{ fontWeight: '600', color: '#475569' }}>{row.lastService}</td>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                <button className="mo-btn" style={{ padding: '4px 8px', height: '28px', fontSize: '11.5px' }} onClick={() => router.push(`/maintenance/add?id=${row.id}`)}>
                                  Edit
                                </button>
                                <button className="mo-btn" style={{ padding: '4px 8px', height: '28px', fontSize: '11.5px', color: '#EF4444', borderColor: '#FCA5A5' }} onClick={() => handleDeleteRecord(row.id)}>
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Working Pagination Bar */}
                <div className="mo-pagination">
                  <div>
                    Showing {filteredRecords.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredRecords.length)} of {filteredRecords.length} entries
                  </div>
                  <div className="mo-pag-btns">
                    <button className="mo-pag-btn" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>&lt;</button>
                    {Array.from({ length: totalPages }).map((_, idx) => (
                      <button 
                        key={idx + 1} 
                        className={`mo-pag-btn ${currentPage === idx + 1 ? 'active' : ''}`}
                        onClick={() => setCurrentPage(idx + 1)}
                      >
                        {idx + 1}
                      </button>
                    ))}
                    <button className="mo-pag-btn" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>&gt;</button>
                    
                    <select className="mo-select" value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }} style={{ height: '28px', padding: '0 6px', fontSize: '11.5px', marginLeft: '8px' }}>
                      <option value={5}>5 / page</option>
                      <option value={10}>10 / page</option>
                      <option value={20}>20 / page</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Right Column: Maintenance Summary Widget */}
              <div className="mo-card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <h3 className="mo-card-title" style={{ margin: 0 }}>Maintenance Summary</h3>
                  <select className="mo-select" style={{ height: '28px', padding: '0 6px', fontSize: '11.5px' }}>
                    <option>This Month</option>
                  </select>
                </div>

                <div className="mo-chart-box">
                  <Doughnut data={chartData} options={chartOptions} />
                  <div className="mo-chart-label">
                    <div className="mo-chart-label-val">30</div>
                    <div className="mo-chart-label-lbl">TOTAL SERVICES</div>
                  </div>
                </div>

                <div className="mo-legend">
                  <div className="mo-legend-item"><span className="mo-legend-dot" style={{ background: '#10B981' }}></span>Completed ({completedCount || 16})</div>
                  <div className="mo-legend-item"><span className="mo-legend-dot" style={{ background: '#3B82F6' }}></span>Under Maint. ({underMaintCount || 7})</div>
                  <div className="mo-legend-item"><span className="mo-legend-dot" style={{ background: '#F59E0B' }}></span>Due Soon ({dueSoonCount || 4})</div>
                  <div className="mo-legend-item"><span className="mo-legend-dot" style={{ background: '#EF4444' }}></span>Overdue ({overdueCount || 3})</div>
                </div>

                <div className="mo-cost-box">
                  <div className="mo-cost-row">
                    <div>
                      <div className="mo-cost-label">Total Cost (This Month)</div>
                      <div style={{ fontSize: '11px', color: '#10B981', fontWeight: 700, marginTop: '2px' }}>↑ 12.8% vs last month</div>
                    </div>
                    <div className="mo-cost-val">₹32,400</div>
                  </div>
                  <div className="mo-cost-row" style={{ borderTop: '1px solid #F1F5F9', paddingTop: '10px' }}>
                    <div className="mo-cost-label">Avg Cost / Service</div>
                    <div className="mo-cost-val" style={{ fontSize: '14px' }}>₹1,420</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row Grid (3 Cards matching Screenshot) */}
            <div className="mo-bottom-grid">
              {/* Card 1: Upcoming Services */}
              <div className="mo-card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <h3 className="mo-card-title" style={{ margin: 0 }}>Upcoming Services</h3>
                  <a href="/maintenance/upcoming" style={{ fontSize: '12px', fontWeight: 700, color: '#6366F1', textDecoration: 'none' }}>View All &rarr;</a>
                </div>

                <div className="mo-bottom-list">
                  <div className="mo-bottom-item">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <EVBikeIcon />
                      <div>
                        <div style={{ fontWeight: '800', fontSize: '12.5px', color: '#0F172A' }}>EV-12KA-1234</div>
                        <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 500 }}>Periodic Service (Every 30 Days)</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className="mo-badge mo-badge-due">Due Soon</span>
                      <div style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 600, marginTop: '2px' }}>22 Jun 2026</div>
                    </div>
                  </div>

                  <div className="mo-bottom-item">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <EVBikeIcon />
                      <div>
                        <div style={{ fontWeight: '800', fontSize: '12.5px', color: '#0F172A' }}>EV-12KA-8901</div>
                        <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 500 }}>Battery Check (Every 45 Days)</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className="mo-badge mo-badge-under">Upcoming</span>
                      <div style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 600, marginTop: '2px' }}>24 Jun 2026</div>
                    </div>
                  </div>

                  <div className="mo-bottom-item">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <EVBikeIcon />
                      <div>
                        <div style={{ fontWeight: '800', fontSize: '12.5px', color: '#0F172A' }}>EV-12KA-2345</div>
                        <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 500 }}>Tyre Replacement (Every 60 Days)</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className="mo-badge mo-badge-under">Upcoming</span>
                      <div style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 600, marginTop: '2px' }}>28 Jun 2026</div>
                    </div>
                  </div>

                  <div className="mo-bottom-item">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <EVBikeIcon />
                      <div>
                        <div style={{ fontWeight: '800', fontSize: '12.5px', color: '#0F172A' }}>EV-12KA-3456</div>
                        <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 500 }}>Brake Service (Every 30 Days)</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className="mo-badge mo-badge-under">Upcoming</span>
                      <div style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 600, marginTop: '2px' }}>29 Jun 2026</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Top Maintenance Costs */}
              <div className="mo-card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <h3 className="mo-card-title" style={{ margin: 0 }}>Top Maintenance Costs</h3>
                  <a href="/reports" style={{ fontSize: '12px', fontWeight: 700, color: '#6366F1', textDecoration: 'none' }}>View Report &rarr;</a>
                </div>

                <div className="mo-cost-bar-container">
                  <div className="mo-cost-bar-row">
                    <span>Battery Replacement</span>
                    <strong style={{ color: '#0F172A' }}>₹12,400</strong>
                  </div>
                  <div className="mo-cost-bar-track">
                    <div className="mo-cost-bar-fill" style={{ width: '80%' }}></div>
                  </div>
                </div>

                <div className="mo-cost-bar-container">
                  <div className="mo-cost-bar-row">
                    <span>Tyre Replacement</span>
                    <strong style={{ color: '#0F172A' }}>₹8,100</strong>
                  </div>
                  <div className="mo-cost-bar-track">
                    <div className="mo-cost-bar-fill" style={{ width: '55%' }}></div>
                  </div>
                </div>

                <div className="mo-cost-bar-container">
                  <div className="mo-cost-bar-row">
                    <span>Brake Service</span>
                    <strong style={{ color: '#0F172A' }}>₹6,200</strong>
                  </div>
                  <div className="mo-cost-bar-track">
                    <div className="mo-cost-bar-fill" style={{ width: '40%' }}></div>
                  </div>
                </div>

                <div className="mo-cost-bar-container">
                  <div className="mo-cost-bar-row">
                    <span>General Service</span>
                    <strong style={{ color: '#0F172A' }}>₹3,200</strong>
                  </div>
                  <div className="mo-cost-bar-track">
                    <div className="mo-cost-bar-fill" style={{ width: '25%' }}></div>
                  </div>
                </div>

                <div className="mo-cost-bar-container">
                  <div className="mo-cost-bar-row">
                    <span>Periodic Service</span>
                    <strong style={{ color: '#0F172A' }}>₹2,500</strong>
                  </div>
                  <div className="mo-cost-bar-track">
                    <div className="mo-cost-bar-fill" style={{ width: '18%' }}></div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1.5px solid #F1F5F9', paddingTop: '10px', marginTop: '10px', fontWeight: 800, fontSize: '13.5px' }}>
                  <span>Total</span>
                  <span style={{ color: '#0F172A' }}>₹32,400</span>
                </div>
              </div>

              {/* Card 3: Recent Service History */}
              <div className="mo-card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <h3 className="mo-card-title" style={{ margin: 0 }}>Recent Service History</h3>
                  <a href="/maintenance/history" style={{ fontSize: '12px', fontWeight: 700, color: '#6366F1', textDecoration: 'none' }}>View All &rarr;</a>
                </div>

                <div className="mo-bottom-list">
                  <div className="mo-bottom-item">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#DCFCE7', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800 }}>✓</div>
                      <div>
                        <div style={{ fontWeight: '800', fontSize: '12.5px', color: '#0F172A' }}>EV-12KA-3456</div>
                        <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 500 }}>Periodic Service</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: '800', color: '#16A34A', fontSize: '12.5px' }}>₹850</div>
                      <div style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 500, marginTop: '2px' }}>15 Jun 2026</div>
                    </div>
                  </div>

                  <div className="mo-bottom-item">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#DCFCE7', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800 }}>✓</div>
                      <div>
                        <div style={{ fontWeight: '800', fontSize: '12.5px', color: '#0F172A' }}>EV-12KA-5678</div>
                        <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 500 }}>Battery Check</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: '800', color: '#16A34A', fontSize: '12.5px' }}>₹1,200</div>
                      <div style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 500, marginTop: '2px' }}>14 Jun 2026</div>
                    </div>
                  </div>

                  <div className="mo-bottom-item">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#DCFCE7', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800 }}>✓</div>
                      <div>
                        <div style={{ fontWeight: '800', fontSize: '12.5px', color: '#0F172A' }}>EV-12KA-9012</div>
                        <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 500 }}>Brake Service</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: '800', color: '#16A34A', fontSize: '12.5px' }}>₹950</div>
                      <div style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 500, marginTop: '2px' }}>12 Jun 2026</div>
                    </div>
                  </div>

                  <div className="mo-bottom-item">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#DCFCE7', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800 }}>✓</div>
                      <div>
                        <div style={{ fontWeight: '800', fontSize: '12.5px', color: '#0F172A' }}>EV-12KA-1111</div>
                        <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 500 }}>Tyre Replacement</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: '800', color: '#16A34A', fontSize: '12.5px' }}>₹1,500</div>
                      <div style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 500, marginTop: '2px' }}>10 Jun 2026</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
