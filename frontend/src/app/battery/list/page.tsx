"use client";
import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

interface BatteryAsset {
  id: string;
  type: string;
  capacity: string;
  soc: number;
  voltage: number;
  current: number;
  temp: number;
  cycles: number;
  soh: number;
  status: 'available' | 'in_use' | 'charging' | 'maintenance';
  zone: string;
  location: string;
  lastSwap: string;
}

const DEFAULT_BATTERIES: BatteryAsset[] = [
  { id: 'BAT-MJ-60V-01', type: 'Li-ion NMC', capacity: '60V / 30Ah', soc: 98, voltage: 67.2, current: 0.0, temp: 27, cycles: 38, soh: 99, status: 'available', zone: 'Manjalpur Zone', location: 'Manjalpur Hub Dock #01', lastSwap: 'Today, 11:20 AM' },
  { id: 'BAT-MJ-60V-02', type: 'Li-ion NMC', capacity: '60V / 30Ah', soc: 95, voltage: 66.8, current: 0.0, temp: 28, cycles: 42, soh: 98, status: 'available', zone: 'Manjalpur Zone', location: 'Manjalpur Hub Dock #02', lastSwap: 'Today, 09:45 AM' },
  { id: 'BAT-MJ-72V-01', type: 'Li-ion NMC', capacity: '72V / 40Ah', soc: 94, voltage: 83.4, current: 0.0, temp: 29, cycles: 29, soh: 100, status: 'available', zone: 'Manjalpur Zone', location: 'Manjalpur Hub Dock #03', lastSwap: 'Today, 08:30 AM' },
  { id: 'BAT-MJ-60V-03', type: 'Li-ion NMC', capacity: '60V / 30Ah', soc: 84, voltage: 65.1, current: 12.4, temp: 31, cycles: 64, soh: 96, status: 'charging', zone: 'Manjalpur Zone', location: 'Manjalpur Hub Dock #04', lastSwap: 'Yesterday' },
  { id: 'BAT-MJ-60V-04', type: 'Li-ion NMC', capacity: '60V / 30Ah', soc: 72, voltage: 64.2, current: -14.2, temp: 33, cycles: 88, soh: 95, status: 'in_use', zone: 'Manjalpur Zone', location: 'Vehicle GJ06-EV-1025', lastSwap: 'Yesterday, 06:15 PM' },
  { id: 'BAT-MJ-60V-05', type: 'Li-ion NMC', capacity: '60V / 30Ah', soc: 68, voltage: 63.8, current: -11.0, temp: 32, cycles: 94, soh: 94, status: 'in_use', zone: 'Manjalpur Zone', location: 'Vehicle GJ06-EV-1022', lastSwap: '04 Sep 2026' },
  { id: 'BAT-GT-60V-01', type: 'Li-ion NMC', capacity: '60V / 30Ah', soc: 99, voltage: 67.4, current: 0.0, temp: 26, cycles: 21, soh: 100, status: 'available', zone: 'Gotri Zone', location: 'Gotri Station Dock #01', lastSwap: 'Today, 10:10 AM' },
  { id: 'BAT-GT-60V-02', type: 'Li-ion NMC', capacity: '60V / 30Ah', soc: 92, voltage: 66.2, current: 0.0, temp: 28, cycles: 55, soh: 97, status: 'available', zone: 'Gotri Zone', location: 'Gotri Station Dock #02', lastSwap: 'Today, 07:40 AM' },
  { id: 'BAT-GT-72V-01', type: 'Li-ion NMC', capacity: '72V / 40Ah', soc: 100, voltage: 84.0, current: 0.0, temp: 26, cycles: 14, soh: 100, status: 'available', zone: 'Gotri Zone', location: 'Gotri Station Dock #03', lastSwap: 'Yesterday' },
  { id: 'BAT-GT-60V-03', type: 'Li-ion NMC', capacity: '60V / 30Ah', soc: 46, voltage: 61.8, current: 15.0, temp: 34, cycles: 102, soh: 93, status: 'charging', zone: 'Gotri Zone', location: 'Gotri Station Dock #04', lastSwap: '04 Sep 2026' },
  { id: 'BAT-KP-60V-01', type: 'Li-ion NMC', capacity: '60V / 30Ah', soc: 96, voltage: 66.9, current: 0.0, temp: 27, cycles: 32, soh: 99, status: 'available', zone: 'KPGU Zone', location: 'KPGU Campus Hub #01', lastSwap: 'Today, 09:00 AM' },
  { id: 'BAT-AT-60V-01', type: 'Li-ion NMC', capacity: '60V / 30Ah', soc: 97, voltage: 67.0, current: 0.0, temp: 28, cycles: 36, soh: 98, status: 'available', zone: 'Aatapi Zone', location: 'Aatapi Park Hub #01', lastSwap: 'Today, 08:15 AM' }
];

export default function BatteryListPage() {
  const [batteries, setBatteries] = useState<BatteryAsset[]>(DEFAULT_BATTERIES);
  const [selectedZone, setSelectedZone] = useState('All Zones');
  const [statusTab, setStatusTab] = useState<'all' | 'available' | 'in_use' | 'charging' | 'maintenance'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [capacityFilter, setCapacityFilter] = useState('All');
  const [selectedBattery, setSelectedBattery] = useState<BatteryAsset | null>(null);
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Sync active zone from session
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedZone = localStorage.getItem('evegah_active_zone') || localStorage.getItem('evegah_selected_zone') || 'All Zones';
      if (savedZone) setSelectedZone(savedZone);
    }

    const handleZone = (e: any) => {
      const z = e?.detail?.name || (typeof e?.detail === 'string' ? e.detail : 'All Zones');
      if (z) setSelectedZone(z);
    };

    window.addEventListener('evegah_active_zone_changed', handleZone);
    window.addEventListener('evegah_zone_changed', handleZone);
    return () => {
      window.removeEventListener('evegah_active_zone_changed', handleZone);
      window.removeEventListener('evegah_zone_changed', handleZone);
    };
  }, []);

  // Fetch from backend /api/batteries
  useEffect(() => {
    const fetchBatteries = async () => {
      setLoading(true);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const zParam = selectedZone && selectedZone !== 'All Zones' && selectedZone !== 'Multiple Zones'
          ? `?zone=${encodeURIComponent(selectedZone)}`
          : '';
        const res = await fetch(`${apiUrl}/batteries${zParam}`);
        if (res.ok) {
          const result = await res.json();
          const list = Array.isArray(result) ? result : (result?.data || []);
          if (list.length > 0) {
            const mapped: BatteryAsset[] = list.map((b: any, index: number) => ({
              id: b.battery_id || b.id || `BAT-00${index + 1}`,
              type: b.battery_type || 'Li-ion NMC',
              capacity: b.capacity || '60V / 30Ah',
              soc: typeof b.soc === 'number' ? b.soc : parseInt(b.soc) || 90,
              voltage: b.voltage || 67.2,
              current: b.current || 0.0,
              temp: b.temp || 28,
              cycles: b.cycles || 40,
              soh: b.soh ? parseInt(b.soh) : 98,
              status: (b.status || 'available').toLowerCase(),
              zone: b.zone || (selectedZone !== 'All Zones' ? selectedZone : 'Manjalpur Zone'),
              location: b.location || (b.status === 'in_use' ? 'Vehicle Fleet' : `${b.zone || 'Depot'} Swap Dock`),
              lastSwap: b.last_swap || 'Today'
            }));
            setBatteries(mapped);
          }
        }
      } catch (err) {
        // Fallback to DEFAULT_BATTERIES
      } finally {
        setLoading(false);
      }
    };
    fetchBatteries();
  }, [selectedZone]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // KPIs
  const stats = useMemo(() => {
    const total = batteries.length;
    const available = batteries.filter(b => b.status === 'available').length;
    const inUse = batteries.filter(b => b.status === 'in_use').length;
    const charging = batteries.filter(b => b.status === 'charging').length;
    const avgSoc = total > 0 ? Math.round(batteries.reduce((acc, b) => acc + b.soc, 0) / total) : 0;
    const avgSoh = total > 0 ? Math.round(batteries.reduce((acc, b) => acc + b.soh, 0) / total) : 0;
    return { total, available, inUse, charging, avgSoc, avgSoh };
  }, [batteries]);

  // Filtered batteries
  const filteredBatteries = useMemo(() => {
    return batteries.filter(b => {
      // Zone filter
      if (selectedZone && selectedZone !== 'All Zones' && selectedZone !== 'Multiple Zones') {
        if (!b.zone.toLowerCase().includes(selectedZone.toLowerCase())) return false;
      }
      // Status tab
      if (statusTab !== 'all' && b.status !== statusTab) return false;
      // Capacity filter
      if (capacityFilter !== 'All' && !b.capacity.includes(capacityFilter)) return false;
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          b.id.toLowerCase().includes(q) ||
          b.location.toLowerCase().includes(q) ||
          b.zone.toLowerCase().includes(q) ||
          b.capacity.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [batteries, selectedZone, statusTab, capacityFilter, searchQuery]);

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Outfit:wght@500;600;700;800&display=swap');

        .nr-shell {
          display: flex;
          min-height: 100vh;
          background: #F8FAFC;
          font-family: 'Inter', sans-serif;
          color: #0F172A;
        }

        .nr-main {
          margin-left: 230px;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          flex: 1;
          min-width: 0;
          background: #F8FAFC;
        }

        .nr-page {
          flex: 1;
          padding: 20px 24px 60px;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        @media (max-width: 1440px) {
          .nr-page {
            padding: 16px 20px 48px;
            gap: 16px;
          }
        }

        .nr-bc {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #64748B;
        }

        .nr-bc a {
          color: #64748B;
          text-decoration: none;
          font-weight: 500;
        }

        .nr-bc a:hover {
          color: #2A195C;
        }

        .nr-bc-sep {
          color: #CBD5E1;
        }

        .nr-bc-cur {
          color: #2A195C;
          font-weight: 600;
        }

        .nr-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 14px;
        }

        .nr-h1 {
          font-family: 'Outfit', sans-serif;
          font-size: 22px;
          font-weight: 800;
          color: #0F172A;
          margin: 0;
          letter-spacing: -0.02em;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .nr-sub {
          font-size: 12.5px;
          color: #64748B;
          margin: 3px 0 0 0;
        }

        .action-btn-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .nr-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          background: #FFFFFF;
          border: 1px solid #CBD5E1;
          border-radius: 9px;
          font-size: 12.5px;
          font-weight: 600;
          color: #334155;
          cursor: pointer;
          transition: all 0.15s;
        }

        .nr-btn:hover {
          background: #F1F5F9;
          border-color: #94A3B8;
        }

        .nr-btn-primary {
          background: #2A195C;
          border-color: #2A195C;
          color: #FFFFFF;
          box-shadow: 0 2px 6px rgba(42, 25, 92, 0.25);
        }

        .nr-btn-primary:hover {
          background: #3B2382;
        }

        /* KPI Cards */
        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 14px;
        }

        @media (max-width: 1200px) {
          .kpi-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 768px) {
          .kpi-grid {
            grid-template-columns: 1fr;
          }
        }

        .kpi-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 14px 16px;
          display: flex;
          align-items: center;
          gap: 14px;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.03);
          transition: transform 0.15s, box-shadow 0.15s;
        }

        .kpi-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(15, 23, 42, 0.06);
        }

        .kpi-icon-wrap {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .kpi-content {
          min-width: 0;
          flex: 1;
        }

        .kpi-label {
          font-size: 11px;
          font-weight: 700;
          color: #64748B;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .kpi-value {
          font-family: 'Outfit', sans-serif;
          font-size: 24px;
          font-weight: 800;
          color: #0F172A;
          line-height: 1.1;
          margin: 2px 0 1px;
        }

        .kpi-hint {
          font-size: 11px;
          color: #94A3B8;
          font-weight: 500;
        }

        /* Filter Panel */
        .filter-panel {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 14px 18px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.02);
        }

        .filter-tabs-row {
          display: flex;
          align-items: center;
          gap: 6px;
          overflow-x: auto;
          padding-bottom: 2px;
        }

        .filter-tab {
          padding: 7px 14px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          color: #475569;
          background: #F1F5F9;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.15s;
          border: none;
        }

        .filter-tab.active {
          background: #2A195C;
          color: #FFFFFF;
          box-shadow: 0 2px 5px rgba(42, 25, 92, 0.2);
        }

        .filter-tab:hover:not(.active) {
          background: #E2E8F0;
          color: #0F172A;
        }

        .filter-search-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }

        .search-box {
          position: relative;
          flex: 1;
          min-width: 260px;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #94A3B8;
        }

        .search-input {
          width: 100%;
          padding: 8px 12px 8px 36px;
          border: 1px solid #CBD5E1;
          border-radius: 8px;
          font-size: 12.5px;
          color: #0F172A;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.15s;
        }

        .search-input:focus {
          border-color: #2A195C;
        }

        .dropdown-select {
          padding: 8px 12px;
          border: 1px solid #CBD5E1;
          border-radius: 8px;
          font-size: 12.5px;
          color: #334155;
          font-weight: 500;
          background: #FFFFFF;
          outline: none;
          cursor: pointer;
        }

        /* Table Card */
        .battery-table-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.02);
          overflow: hidden;
        }

        .dt-table {
          width: 100%;
          border-collapse: collapse;
        }

        .dt-table th {
          font-size: 11px;
          font-weight: 700;
          color: #64748B;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          text-align: left;
          padding: 12px 16px;
          background: #F8FAFC;
          border-bottom: 1px solid #E2E8F0;
        }

        .dt-table td {
          font-size: 12.5px;
          color: #334155;
          padding: 12px 16px;
          border-bottom: 1px solid #F1F5F9;
          vertical-align: middle;
        }

        .dt-table tr:last-child td {
          border-bottom: none;
        }

        .dt-table tr:hover td {
          background: #F8FAFC;
        }

        .soc-bar-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .soc-progress-track {
          width: 65px;
          height: 7px;
          background: #E2E8F0;
          border-radius: 4px;
          overflow: hidden;
        }

        .soc-progress-fill {
          height: 100%;
          border-radius: 4px;
        }

        .badge-status {
          font-size: 10.5px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 12px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          text-transform: capitalize;
        }

        .badge-available {
          background: #DCFCE7;
          color: #16A34A;
        }

        .badge-in_use {
          background: #E0F2FE;
          color: #0369A1;
        }

        .badge-charging {
          background: #FEF3C7;
          color: #D97706;
        }

        .badge-maintenance {
          background: #FEE2E2;
          color: #B91C1C;
        }

        .toast-banner {
          position: fixed;
          bottom: 24px;
          right: 24px;
          background: #0F172A;
          color: #FFFFFF;
          padding: 12px 20px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          z-index: 9999;
          display: flex;
          align-items: center;
          gap: 8px;
        }
      `}</style>

      <div className="nr-shell">
        <Sidebar activePath="/battery/list" />
        <div className="nr-main">
          <TopBar
            title="Battery Asset & BMS Telematics"
            subtitle={`Real-time telemetry, charge level, swap dock status (${selectedZone}).`}
            showHand={false}
          />

          <div className="nr-page">
            {/* Breadcrumb */}
            <div className="nr-bc">
              <a href="/">Home</a>
              <span className="nr-bc-sep">&gt;</span>
              <a href="/battery/list">Battery &amp; Swapping</a>
              <span className="nr-bc-sep">&gt;</span>
              <span className="nr-bc-cur">Battery Inventory</span>
            </div>

            {/* Title & Actions */}
            <div className="nr-title-row">
              <div>
                <h1 className="nr-h1">
                  BMS Battery Asset Portal
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#16A34A', background: '#DCFCE7', padding: '2px 8px', borderRadius: '12px' }}>
                    Live BMS Stream
                  </span>
                </h1>
                <p className="nr-sub">
                  Live battery intelligence, cell balance, swap history, and pack health across {selectedZone}.
                </p>
              </div>

              <div className="action-btn-group">
                <button
                  className="nr-btn"
                  onClick={() => showToast('Exporting battery inventory CSV...')}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Export CSV
                </button>
                <button
                  className="nr-btn nr-btn-primary"
                  onClick={() => showToast('Opening Add Battery Inward modal...')}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  Register Battery
                </button>
              </div>
            </div>

            {/* Top KPI Cards */}
            <div className="kpi-grid">
              <div className="kpi-card">
                <div className="kpi-icon-wrap" style={{ background: '#FAF5FF', color: '#7C3AED', border: '1px solid #E9D5FF' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <rect x="2" y="7" width="16" height="10" rx="2" />
                    <line x1="22" y1="11" x2="22" y2="13" />
                  </svg>
                </div>
                <div className="kpi-content">
                  <div className="kpi-label">Total Inventory</div>
                  <div className="kpi-value">{stats.total}</div>
                  <div className="kpi-hint">Monitored BMS Packs</div>
                </div>
              </div>

              <div className="kpi-card">
                <div className="kpi-icon-wrap" style={{ background: '#F0FDF4', color: '#16A34A', border: '1px solid #BBF7D0' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div className="kpi-content">
                  <div className="kpi-label">Available for Swap</div>
                  <div className="kpi-value">{stats.available}</div>
                  <div className="kpi-hint">&gt; 90% SoC Ready</div>
                </div>
              </div>

              <div className="kpi-card">
                <div className="kpi-icon-wrap" style={{ background: '#EFF6FF', color: '#2563EB', border: '1px solid #BFDBFE' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <div className="kpi-content">
                  <div className="kpi-label">In Active Use</div>
                  <div className="kpi-value">{stats.inUse}</div>
                  <div className="kpi-hint">In Fleet Scooters</div>
                </div>
              </div>

              <div className="kpi-card">
                <div className="kpi-icon-wrap" style={{ background: '#FFFBEB', color: '#D97706', border: '1px solid #FDE68A' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                </div>
                <div className="kpi-content">
                  <div className="kpi-label">Dock Charging</div>
                  <div className="kpi-value">{stats.charging}</div>
                  <div className="kpi-hint">Fast Charging Bays</div>
                </div>
              </div>

              <div className="kpi-card">
                <div className="kpi-icon-wrap" style={{ background: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </div>
                <div className="kpi-content">
                  <div className="kpi-label">Average Health (SOH)</div>
                  <div className="kpi-value">{stats.avgSoh}%</div>
                  <div className="kpi-hint">Fleet SOH Score</div>
                </div>
              </div>
            </div>

            {/* Filter & Search Panel */}
            <div className="filter-panel">
              <div className="filter-tabs-row">
                {[
                  { key: 'all', label: `All Batteries (${batteries.length})` },
                  { key: 'available', label: `Ready for Swap (${stats.available})` },
                  { key: 'in_use', label: `In Use (${stats.inUse})` },
                  { key: 'charging', label: `Charging (${stats.charging})` },
                  { key: 'maintenance', label: 'Maintenance (0)' }
                ].map(tab => (
                  <button
                    key={tab.key}
                    className={`filter-tab ${statusTab === tab.key ? 'active' : ''}`}
                    onClick={() => setStatusTab(tab.key as any)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="filter-search-row">
                <div className="search-box">
                  <span className="search-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search by Battery ID, Vehicle Number, Hub Location, or Zone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <select
                    className="dropdown-select"
                    value={capacityFilter}
                    onChange={(e) => setCapacityFilter(e.target.value)}
                  >
                    <option value="All">All Capacities</option>
                    <option value="60V">60V / 30Ah</option>
                    <option value="72V">72V / 40Ah</option>
                  </select>

                  <select
                    className="dropdown-select"
                    value={selectedZone}
                    onChange={(e) => setSelectedZone(e.target.value)}
                  >
                    <option value="All Zones">All Zones</option>
                    <option value="Manjalpur Zone">Manjalpur Zone</option>
                    <option value="Gotri Zone">Gotri Zone</option>
                    <option value="KPGU Zone">KPGU Zone</option>
                    <option value="Aatapi Zone">Aatapi Zone</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Battery Asset Table */}
            <div className="battery-table-card">
              <table className="dt-table">
                <thead>
                  <tr>
                    <th>Battery ID &amp; Chemistry</th>
                    <th>Charge Status (SoC)</th>
                    <th>Pack Voltage &amp; Temp</th>
                    <th>SOH Health</th>
                    <th>Charge Cycles</th>
                    <th>Current Location / Vehicle</th>
                    <th>Status</th>
                    <th>Diagnostics</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: '36px', color: '#64748B' }}>
                        Loading real-time BMS battery telemetry...
                      </td>
                    </tr>
                  ) : filteredBatteries.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: '36px', color: '#64748B' }}>
                        No batteries found matching filters for {selectedZone}.
                      </td>
                    </tr>
                  ) : (
                    filteredBatteries.map(bat => {
                      const socColor =
                        bat.soc >= 85 ? '#16A34A' :
                        bat.soc >= 40 ? '#2563EB' :
                        bat.soc >= 20 ? '#F59E0B' : '#EF4444';

                      return (
                        <tr key={bat.id}>
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <strong style={{ color: '#2A195C', fontSize: '13px' }}>{bat.id}</strong>
                              <span style={{ fontSize: '11px', color: '#64748B' }}>{bat.type} &bull; {bat.capacity}</span>
                            </div>
                          </td>

                          <td>
                            <div className="soc-bar-wrap">
                              <strong style={{ fontSize: '13px', width: '38px', color: socColor }}>{bat.soc}%</strong>
                              <div className="soc-progress-track">
                                <div
                                  className="soc-progress-fill"
                                  style={{ width: `${bat.soc}%`, background: socColor }}
                                />
                              </div>
                            </div>
                          </td>

                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <strong>{bat.voltage} V</strong>
                              <span style={{ fontSize: '11px', color: '#64748B' }}>{bat.temp}&deg;C {bat.current !== 0 ? `• ${bat.current}A` : ''}</span>
                            </div>
                          </td>

                          <td>
                            <span style={{ color: '#16A34A', fontWeight: 700 }}>{bat.soh}% SOH</span>
                          </td>

                          <td>
                            <strong>{bat.cycles}</strong>
                            <span style={{ fontSize: '11px', color: '#94A3B8', marginLeft: '3px' }}>cycles</span>
                          </td>

                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span style={{ fontWeight: 600, color: '#0F172A' }}>{bat.location}</span>
                              <span style={{ fontSize: '11px', color: '#0284C7' }}>{bat.zone}</span>
                            </div>
                          </td>

                          <td>
                            <span className={`badge-status badge-${bat.status}`}>
                              {bat.status.replace('_', ' ')}
                            </span>
                          </td>

                          <td>
                            <button
                              className="nr-btn"
                              style={{ padding: '4px 10px', fontSize: '11px' }}
                              onClick={() => {
                                setSelectedBattery(bat);
                                showToast(`Loaded telemetry telemetry for ${bat.id}`);
                              }}
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Diagnostic Modal Drawer */}
            {selectedBattery && (
              <div
                style={{
                  position: 'fixed',
                  inset: 0,
                  background: 'rgba(15, 23, 42, 0.6)',
                  backdropFilter: 'blur(3px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 9999,
                  padding: '20px'
                }}
                onClick={() => setSelectedBattery(null)}
              >
                <div
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '16px',
                    maxWidth: '520px',
                    width: '100%',
                    padding: '24px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#F3E8FF', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        ⚡
                      </div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#1E1548' }}>{selectedBattery.id}</h3>
                        <span style={{ fontSize: '11px', color: '#64748B' }}>BMS Diagnostics &amp; Cell Telemetry</span>
                      </div>
                    </div>
                    <button
                      style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '18px' }}
                      onClick={() => setSelectedBattery(null)}
                    >
                      ✕
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                    <div style={{ background: '#F8FAFC', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                      <span style={{ fontSize: '11px', color: '#64748B' }}>Pack Voltage</span>
                      <div style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>{selectedBattery.voltage} V</div>
                    </div>
                    <div style={{ background: '#F8FAFC', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                      <span style={{ fontSize: '11px', color: '#64748B' }}>State of Charge</span>
                      <div style={{ fontSize: '18px', fontWeight: 800, color: '#16A34A' }}>{selectedBattery.soc}%</div>
                    </div>
                    <div style={{ background: '#F8FAFC', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                      <span style={{ fontSize: '11px', color: '#64748B' }}>Cell Temperature</span>
                      <div style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>{selectedBattery.temp}&deg;C</div>
                    </div>
                    <div style={{ background: '#F8FAFC', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                      <span style={{ fontSize: '11px', color: '#64748B' }}>State of Health</span>
                      <div style={{ fontSize: '18px', fontWeight: 800, color: '#2563EB' }}>{selectedBattery.soh}%</div>
                    </div>
                  </div>

                  <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '12px', color: '#475569', lineHeight: '1.5', marginBottom: '18px' }}>
                    <div><strong>Chemistry:</strong> {selectedBattery.type} ({selectedBattery.capacity})</div>
                    <div><strong>Dock Location:</strong> {selectedBattery.location}</div>
                    <div><strong>Assigned Zone:</strong> {selectedBattery.zone}</div>
                    <div><strong>Last Swap Log:</strong> {selectedBattery.lastSwap}</div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button
                      className="nr-btn"
                      onClick={() => setSelectedBattery(null)}
                    >
                      Close
                    </button>
                    <button
                      className="nr-btn nr-btn-primary"
                      onClick={() => {
                        showToast(`Diagnostic health report generated for ${selectedBattery.id}`);
                        setSelectedBattery(null);
                      }}
                    >
                      Export Diagnostic Report
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {toastMsg && (
        <div className="toast-banner">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <span>{toastMsg}</span>
        </div>
      )}
    </>
  );
}
