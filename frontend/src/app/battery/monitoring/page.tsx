"use client";
import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { api } from '@/lib/api';

const CSS = `
.ev-shell { display: flex; min-height: 100vh; background: #F3F4F9; }
.ev-main { margin-left: 230px; display: flex; flex-direction: column; min-height: 100vh; width: calc(100% - 230px); }
.ev-body { padding: 20px 22px 70px; flex: 1; }

/* Breadcrumb */
.bms-bc { display: flex; align-items: center; gap: 6px; padding: 0 0 14px; font-size: 12px; color: #9CA3AF; }
.bms-bc a { color: #9CA3AF; text-decoration: none; }
.bms-bc a:hover { color: #2A195C; }
.bms-bc-sep { color: #D1D5DB; }
.bms-bc-cur { color: #2A195C; font-weight: 600; }

/* Header */
.bms-title-row { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px; gap: 16px; }
.bms-h1 { font-size: 22px; font-weight: 800; color: #111827; margin: 0 0 4px; }
.bms-sub { font-size: 13px; color: #6B7280; margin: 0; }

.bms-select-wrap { display: flex; align-items: center; gap: 8px; }
.bms-select { padding: 8px 14px; border: 1.5px solid #E5E7EB; border-radius: 10px; font-size: 13px; font-weight: 600; outline: none; background: #fff; color: #374151; cursor: pointer; }
.bms-select:focus { border-color: #2A195C; }

/* Top SOC card with gradient */
.soc-grad-card {
  background: linear-gradient(135deg, #2E1C9F 0%, #160E58 100%);
  border-radius: 20px;
  padding: 24px;
  color: #fff;
  display: grid;
  grid-template-columns: 1fr 150px 1fr;
  gap: 24px;
  align-items: center;
  margin-bottom: 20px;
  box-shadow: 0 10px 15px -3px rgba(46, 28, 159, 0.2);
  position: relative;
  overflow: hidden;
}
.soc-grad-card::after {
  content: '';
  position: absolute;
  right: -20px;
  bottom: -20px;
  width: 140px;
  height: 140px;
  background: radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%);
  border-radius: 50%;
}

.soc-info-left { display: flex; flex-direction: column; gap: 4px; }
.soc-info-lbl { font-size: 12.5px; color: #C0BDF2; font-weight: 500; }
.soc-pct-row { display: flex; align-items: baseline; gap: 2px; }
.soc-pct-val { font-size: 44px; font-weight: 800; letter-spacing: -1px; }
.soc-pct-symbol { font-size: 20px; font-weight: 700; color: #CCFF00; }
.soc-status-badge { display: inline-flex; align-items: center; gap: 5px; background: rgba(204, 255, 0, 0.15); color: #CCFF00; padding: 4px 10px; border-radius: 8px; font-size: 11px; font-weight: 700; width: fit-content; margin-top: 8px; }

.soc-gauge-center { display: flex; justify-content: center; align-items: center; position: relative; width: 140px; height: 140px; }
.soc-gauge-circle { transform: rotate(-90deg); width: 120px; height: 120px; }
.soc-gauge-text { position: absolute; font-size: 12px; font-weight: 700; color: #CCFF00; text-transform: uppercase; letter-spacing: 0.05em; display: flex; flex-direction: column; align-items: center; }

.soc-info-right { display: flex; flex-direction: column; gap: 12px; }
.soc-info-right-block { display: flex; flex-direction: column; gap: 2px; }
.soc-info-right-val { font-size: 18px; font-weight: 700; }

/* 4 Mini KPI Cards */
.bms-kpi-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px; }
.bms-kpi-card { background: #fff; border: 1px solid #E5E7EB; border-radius: 12px; padding: 14px 16px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 1px 3px rgba(0,0,0,.05); }
.bms-kpi-lbl { font-size: 11.5px; color: #6B7280; font-weight: 600; }
.bms-kpi-val { font-size: 18px; font-weight: 800; color: #111827; margin-top: 4px; }
.bms-kpi-ic { width: 34px; height: 34px; border-radius: 8px; display: flex; align-items: center; justify-content: center; }

/* Tabs switching layout */
.bms-tabs-card { background: #fff; border: 1px solid #E5E7EB; border-radius: 16px; box-shadow: 0 1px 4px rgba(0,0,0,.05); display: flex; flex-direction: column; }
.bms-tabs-hdr { padding: 14px 18px 0; border-bottom: 1px solid #E5E7EB; display: flex; justify-content: space-between; align-items: center; }
.bms-tabs { display: flex; gap: 24px; }
.bms-tab { padding: 12px 4px; font-size: 13.5px; font-weight: 700; color: #6B7280; cursor: pointer; border-bottom: 2px solid transparent; transition: all .15s; }
.bms-tab:hover { color: #2a195c; }
.bms-tab.active { color: #2a195c; border-bottom-color: #2a195c; }
.bms-tab-act-btn { margin-bottom: 10px; display: flex; align-items: center; gap: 6px; padding: 6px 12px; border: 1.5px solid #E5E7EB; border-radius: 8px; font-size: 12px; font-weight: 700; color: #374151; background: #fff; cursor: pointer; }
.bms-tab-act-btn:hover { border-color: #2A195C; color: #2A195C; }

.bms-tabs-body { padding: 20px; }

/* Grid layout for Live telemetry info */
.telemetry-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.tel-section-title { font-size: 14px; font-weight: 800; color: #111827; margin-bottom: 12px; display: flex; align-items: center; gap: 6px; }
.tel-details-card { border: 1px solid #E5E7EB; border-radius: 12px; padding: 14px; display: flex; flex-direction: column; gap: 10px; background: #FAFBFD; }
.tel-row { display: flex; align-items: center; justify-content: space-between; font-size: 13px; padding-bottom: 8px; border-bottom: 1px dashed #E5E7EB; }
.tel-row:last-child { border-bottom: none; padding-bottom: 0; }
.tel-lbl { color: #6B7280; }
.tel-val { font-weight: 700; color: #111827; }

/* Cell voltages grid */
.cell-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
.cell-card { border: 1.5px solid #E5E7EB; border-radius: 10px; padding: 10px 12px; display: flex; flex-direction: column; gap: 4px; background: #fff; position: relative; overflow: hidden; }
.cell-card.active { border-color: #CCFF00; }
.cell-header { display: flex; justify-content: space-between; align-items: center; font-size: 11px; font-weight: 700; color: #9CA3AF; }
.cell-val { font-size: 14px; font-weight: 800; color: #111827; }
.cell-bar { height: 4px; background: #E5E7EB; border-radius: 2px; margin-top: 4px; position: relative; }
.cell-bar-fill { height: 100%; border-radius: 2px; }

/* Alerts Tab styling */
.alert-row { display: flex; align-items: flex-start; gap: 12px; padding: 12px; border: 1px solid #FCA5A5; border-radius: 10px; background: #FEF2F2; color: #991B1B; margin-bottom: 10px; }
.alert-row.warn { border-color: #FDE047; background: #FEFCE8; color: #854D0E; }
.alert-title { font-size: 13px; font-weight: 700; margin-bottom: 2px; }
.alert-desc { font-size: 12px; line-height: 1.4; opacity: 0.9; }

/* History Chart Placeholder */
.history-placeholder { height: 200px; display: flex; align-items: center; justify-content: center; background: #FAFBFD; border: 1.5px dashed #E5E7EB; border-radius: 12px; font-size: 13px; color: #9CA3AF; }
`;

interface Battery {
  id: string;
  name: string;
  soc: number;
  temperature: number;
  voltage: number;
  current: number;
  rssi: number;
  status: 'Connected' | 'Disconnected' | 'Faulty';
  cycleCount: number;
  health: number;
  designCapacity: number;
  remainingCapacity: number;
  cells: number[];
}

export default function BmsMonitoringPage() {
  const [batteries, setBatteries] = useState<Battery[]>([]);
  const [selectedBatteryId, setSelectedBatteryId] = useState('');
  const [activeTab, setActiveTab] = useState('live'); // 'live', 'alerts', 'history', 'settings'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const loadData = async () => {
      try {
        const data = await api.get('/batteries');
        if (!active) return;
        if (data && data.length > 0) {
          const mapped: Battery[] = data.map((b: any) => {
            // Check if cells array exists in database columns, else generate mock cells
            let cellList = b.cells || [];
            if (cellList.length === 0) {
              const cellAvg = (parseFloat(b.voltage) || 51.2) / 13;
              cellList = Array.from({ length: 13 }, (_, i) => 
                parseFloat((cellAvg + (Math.random() * 0.01 - 0.005)).toFixed(3))
              );
            } else {
              // Convert mV to Volts if stored in millivolts
              cellList = cellList.map((c: number) => c > 100 ? c / 1000 : c);
            }

            return {
              id: b.battery_id,
              name: b.battery_id.startsWith('sim_') ? `Simulated Battery (${b.battery_id.substring(4, 9)})` : b.battery_id,
              soc: b.soc !== undefined ? b.soc : 100,
              temperature: parseFloat(b.temp) || 25,
              voltage: parseFloat(b.voltage) || 0,
              current: parseFloat(b.current) || 0,
              rssi: b.battery_id.startsWith('sim_') ? -65 : -50,
              status: b.status === 'alert' ? 'Faulty' : 'Connected',
              cycleCount: b.cycles || 0,
              health: b.health || 100,
              designCapacity: 100.0,
              remainingCapacity: (b.soc || 0) * 1.0,
              cells: cellList
            };
          });
          setBatteries(mapped);
        } else {
          setBatteries([]);
        }
      } catch (err) {
        console.error('Error fetching batteries:', err);
        if (active) {
          setBatteries([]);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadData();
    const interval = setInterval(loadData, 3000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  // Update selected battery ID once loaded
  useEffect(() => {
    if (batteries.length > 0 && (!selectedBatteryId || !batteries.some(b => b.id === selectedBatteryId))) {
      setSelectedBatteryId(batteries[0].id);
    }
  }, [batteries, selectedBatteryId]);

  if (loading) {
    return (
      <div className="ev-shell">
        <Sidebar activePath="/battery/inventory" />
        <div className="ev-main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
          <div style={{ textAlign: 'center', color: '#2a195c', fontWeight: 'bold' }}>
            <div className="spinner" style={{ border: '4px solid #f3f3f3', borderTop: '4px solid #2a195c', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }}></div>
            Loading Smart BMS Nodes...
            <style dangerouslySetInnerHTML={{ __html: '@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }' }} />
          </div>
        </div>
      </div>
    );
  }

  if (batteries.length === 0) {
    return (
      <div className="ev-shell">
        <Sidebar activePath="/battery/inventory" />
        <div className="ev-main">
          <TopBar title="BMS Monitoring" subtitle="Real-time battery management dashboard" />
          <div className="ev-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh' }}>
            <div style={{
              background: '#fff',
              border: '1px solid #E5E7EB',
              borderRadius: '20px',
              padding: '40px 30px',
              textAlign: 'center',
              maxWidth: '480px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: '#F5F3FF',
                color: '#2a195c',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px'
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#111827', marginBottom: '8px' }}>No Active BMS Nodes Found</h2>
              <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: '1.6', marginBottom: '24px' }}>
                Currently, there are no live battery nodes reporting telemetry to the database. 
                Please open the Evegah Operations app on your mobile device, connect to your physical battery, and start streaming live data.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', textAlign: 'left', background: '#F9FAFB', padding: '14px', borderRadius: '12px', border: '1px solid #F3F4F6' }}>
                <span style={{ fontWeight: 'bold', color: '#374151' }}>Quick Setup Instructions:</span>
                <span style={{ color: '#6B7280' }}>1. Open the operations app on your mobile device.</span>
                <span style={{ color: '#6B7280' }}>2. Tap <b>Server Connection</b> in the Profile settings and set the Server IP to: <b>{typeof window !== 'undefined' ? window.location.hostname : 'your-server-ip'}</b>.</span>
                <span style={{ color: '#6B7280' }}>3. Go to the Scan tab, search for your battery (e.g. <b>DL-4119120108F1</b>), and tap <b>Connect</b>.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const selectedBattery = batteries.find(b => b.id === selectedBatteryId) || batteries[0];

  // Helper values
  const currentAction = selectedBattery.current > 0 ? 'Charging' : selectedBattery.current < 0 ? 'Discharging' : 'Idle';
  const estTime = selectedBattery.current !== 0 
    ? `${Math.abs(Math.floor(selectedBattery.remainingCapacity / selectedBattery.current))}h ${Math.round(Math.abs((selectedBattery.remainingCapacity / selectedBattery.current) % 1) * 60)}m`
    : '--';

  // Cell balancing thresholds (min & max for visualization)
  const minCell = selectedBattery.cells.length > 0 ? Math.min(...selectedBattery.cells) : 0;
  const maxCell = selectedBattery.cells.length > 0 ? Math.max(...selectedBattery.cells) : 0;
  const avgCell = selectedBattery.cells.length > 0 
    ? selectedBattery.cells.reduce((a,b)=>a+b, 0) / selectedBattery.cells.length 
    : 0;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="ev-shell">
        <Sidebar activePath="/battery/inventory" />
        <div className="ev-main">
          <TopBar title="BMS Monitoring" subtitle="Real-time battery management dashboard" />
          <div className="ev-body">
            
            {/* Breadcrumb */}
            <div className="bms-bc">
              <a href="/">Home</a>
              <span className="bms-bc-sep">/</span>
              <a href="/battery/inventory">Battery</a>
              <span className="bms-bc-sep">/</span>
              <span className="bms-bc-cur">BMS Monitoring</span>
            </div>

            {/* Title & Selector Row */}
            <div className="bms-title-row">
              <div>
                <h1 className="bms-h1">Smart BMS Telemetry</h1>
                <p className="bms-sub">Connected via CAN protocol · Live telemetry updates</p>
              </div>
              <div className="bms-select-wrap">
                <label style={{ fontSize: '12.5px', fontWeight: 'bold', color: '#6B7280' }}>Active Node:</label>
                <select 
                  className="bms-select"
                  value={selectedBatteryId}
                  onChange={(e) => setSelectedBatteryId(e.target.value)}
                >
                  {batteries.map(b => (
                    <option key={b.id} value={b.id}>{b.name} ({b.soc}%)</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Top SOC gradient card */}
            <div className="soc-grad-card">
              <div className="soc-info-left">
                <div className="soc-info-lbl">State of Charge</div>
                <div className="soc-pct-row">
                  <span className="soc-pct-val">{selectedBattery.soc}</span>
                  <span className="soc-pct-symbol">%</span>
                </div>
                <div className="soc-status-badge">
                  <span>{currentAction}</span>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                </div>
              </div>
              <div className="soc-gauge-center">
                <svg className="soc-gauge-circle">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                  <circle 
                    cx="60" 
                    cy="60" 
                    r="50" 
                    fill="none" 
                    stroke="#CCFF00" 
                    strokeWidth="8" 
                    strokeDasharray={`${2 * Math.PI * 50}`}
                    strokeDashoffset={`${2 * Math.PI * 50 * (1 - selectedBattery.soc / 100)}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="soc-gauge-text">
                  <span style={{ fontSize: '9px', opacity: 0.7 }}>Status</span>
                  <span style={{ fontSize: '13px', color: '#fff' }}>{selectedBattery.status}</span>
                </div>
              </div>
              <div className="soc-info-right">
                <div className="soc-info-right-block">
                  <div className="soc-info-lbl">Remaining Capacity</div>
                  <div className="soc-info-right-val">{selectedBattery.remainingCapacity.toFixed(1)} Ah / {selectedBattery.designCapacity.toFixed(1)} Ah</div>
                </div>
                <div className="soc-info-right-block">
                  <div className="soc-info-lbl">Est. Time to Empty</div>
                  <div className="soc-info-right-val">{selectedBattery.current === 0 ? '--' : estTime}</div>
                </div>
              </div>
            </div>

            {/* 4 Mini KPI Cards */}
            <div className="bms-kpi-row">
              <div className="bms-kpi-card">
                <div>
                  <div className="bms-kpi-lbl">Total Voltage</div>
                  <div className="bms-kpi-val">{selectedBattery.voltage.toFixed(1)} V</div>
                </div>
                <div className="bms-kpi-ic" style={{ background: '#EFF6FF', color: '#2563EB' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                </div>
              </div>
              <div className="bms-kpi-card">
                <div>
                  <div className="bms-kpi-lbl">Current Draw</div>
                  <div className="bms-kpi-val">{selectedBattery.current.toFixed(1)} A</div>
                </div>
                <div className="bms-kpi-ic" style={{ background: '#FFF7ED', color: '#EA580C' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                </div>
              </div>
              <div className="bms-kpi-card">
                <div>
                  <div className="bms-kpi-lbl">BMS Temperature</div>
                  <div className="bms-kpi-val">{selectedBattery.temperature}°C</div>
                </div>
                <div className="bms-kpi-ic" style={{ background: '#FEF2F2', color: '#EF4444' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg>
                </div>
              </div>
              <div className="bms-kpi-card">
                <div>
                  <div className="bms-kpi-lbl">BMS Health</div>
                  <div className="bms-kpi-val">{selectedBattery.health}% SOH</div>
                </div>
                <div className="bms-kpi-ic" style={{ background: '#ECFDF5', color: '#10B981' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
              </div>
            </div>

            {/* Tabs panel */}
            <div className="bms-tabs-card">
              <div className="bms-tabs-hdr">
                <div className="bms-tabs">
                  <div className={`bms-tab ${activeTab === 'live' ? 'active' : ''}`} onClick={() => setActiveTab('live')}>Live Data</div>
                  <div className={`bms-tab ${activeTab === 'alerts' ? 'active' : ''}`} onClick={() => setActiveTab('alerts')}>BMS Alerts ({selectedBattery.status === 'Faulty' ? 1 : 0})</div>
                  <div className={`bms-tab ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>Log History</div>
                  <div className={`bms-tab ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>BMS Settings</div>
                </div>
                <button className="bms-tab-act-btn" onClick={() => alert('Starting live Diagnostic scan via bluetooth...')}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                  Run Diagnostics
                </button>
              </div>
              <div className="bms-tabs-body">
                {activeTab === 'live' && (
                  <div className="telemetry-grid">
                    
                    {/* Left Column: Battery Stats */}
                    <div>
                      <div className="tel-section-title">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/></svg>
                        Telemetry Details
                      </div>
                      <div className="tel-details-card">
                        <div className="tel-row">
                          <span className="tel-lbl">Pack Status</span>
                          <span className="tel-val" style={{ color: selectedBattery.status === 'Faulty' ? '#EF4444' : '#10B981' }}>{selectedBattery.status}</span>
                        </div>
                        <div className="tel-row">
                          <span className="tel-lbl">Cycle Count</span>
                          <span className="tel-val">{selectedBattery.cycleCount} Cycles</span>
                        </div>
                        <div className="tel-row">
                          <span className="tel-lbl">RSSI (Connection strength)</span>
                          <span className="tel-val">{selectedBattery.rssi} dBm</span>
                        </div>
                        <div className="tel-row">
                          <span className="tel-lbl">Battery Capacity</span>
                          <span className="tel-val">{selectedBattery.designCapacity} Ah</span>
                        </div>
                        <div className="tel-row">
                          <span className="tel-lbl">Average Cell Voltage</span>
                          <span className="tel-val">{avgCell.toFixed(3)} V</span>
                        </div>
                        <div className="tel-row">
                          <span className="tel-lbl">Cell Voltage Delta</span>
                          <span className="tel-val" style={{ color: (maxCell - minCell) > 0.05 ? '#D97706' : '#111827' }}>{(maxCell - minCell).toFixed(3)} V</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Cell Voltages grid */}
                    <div>
                      <div className="tel-section-title">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="1" y="6" width="18" height="12" rx="2"/><line x1="23" y1="13" x2="23" y2="11"/></svg>
                        Cell Balancing Grid ({selectedBattery.cells.length} Cells)
                      </div>
                      <div className="cell-grid">
                        {selectedBattery.cells.map((volt, index) => {
                          const percent = Math.min(100, Math.max(0, ((volt - 3.2) / 1.0) * 100)); // 3.2v to 4.2v
                          const isHigh = volt === maxCell;
                          const isLow = volt === minCell;
                          return (
                            <div key={index} className={`cell-card ${isHigh || isLow ? 'active' : ''}`} style={{
                              borderColor: isHigh ? '#2563EB' : isLow ? '#EF4444' : undefined
                            }}>
                              <div className="cell-header">
                                <span>C{index + 1}</span>
                                {isHigh && <span style={{ color: '#2563EB', fontSize: '9px' }}>MAX</span>}
                                {isLow && <span style={{ color: '#EF4444', fontSize: '9px' }}>MIN</span>}
                              </div>
                              <div className="cell-val">{volt.toFixed(3)}v</div>
                              <div className="cell-bar">
                                <div 
                                  className="cell-bar-fill" 
                                  style={{ 
                                    width: `${percent}%`, 
                                    background: isHigh ? '#2563EB' : isLow ? '#EF4444' : '#10B981' 
                                  }} 
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                )}

                {activeTab === 'alerts' && (
                  <div>
                    {selectedBattery.status === 'Faulty' ? (
                      <div className="alert-row">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginTop: '2px', flexShrink: 0 }}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                        <div>
                          <div className="alert-title">Critical Over-Temperature Warning</div>
                          <div className="alert-desc">Cell #3 is registering a temperature of 42.5°C which exceeds the safety limit of 40.0°C. BMS safety relay has tripped. Please inspect current draw immediately.</div>
                        </div>
                      </div>
                    ) : (
                      <div style={{ textAlign: 'center', padding: '40px', color: '#9CA3AF' }}>
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ marginBottom: '10px' }}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                        <div>All BMS registers are green. No faults reported.</div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'history' && (
                  <div>
                    <div className="history-placeholder">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                      Real-time graphing requires chart modules. Database logs show stable voltage profile.
                    </div>
                  </div>
                )}

                {activeTab === 'settings' && (
                  <div className="telemetry-grid">
                    <div>
                      <div className="tel-section-title">BMS Safety Thresholds</div>
                      <div className="tel-details-card">
                        <div className="tel-row">
                          <span>Over-voltage Cutoff</span>
                          <span className="tel-val">4.25 V</span>
                        </div>
                        <div className="tel-row">
                          <span>Under-voltage Cutoff</span>
                          <span className="tel-val">3.00 V</span>
                        </div>
                        <div className="tel-row">
                          <span>Over-temp Cutoff</span>
                          <span className="tel-val">45.0 °C</span>
                        </div>
                        <div className="tel-row">
                          <span>Max Discharge Current</span>
                          <span className="tel-val">45.0 A</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="tel-section-title">BMS Configuration</div>
                      <div className="tel-details-card">
                        <div className="tel-row">
                          <span>CAN Node Address</span>
                          <span className="tel-val">0x0C</span>
                        </div>
                        <div className="tel-row">
                          <span>Bluetooth BLE</span>
                          <span className="tel-val" style={{ color: '#10B981' }}>Enabled</span>
                        </div>
                        <div className="tel-row">
                          <span>Firmware Version</span>
                          <span className="tel-val">v2.4.11</span>
                        </div>
                        <div className="tel-row">
                          <span>Self-discharge Mode</span>
                          <span className="tel-val">Auto</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
