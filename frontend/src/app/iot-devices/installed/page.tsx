"use client";
import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

const CSS = `
.io-shell { display: flex; min-height: 100vh; background: #F8FAFC; font-family: 'Inter', sans-serif; }
.io-main { margin-left: 230px; display: flex; flex-direction: column; min-height: 100vh; width: calc(100% - 230px); }
.io-page { flex: 1; padding: 24px; display: flex; flex-direction: column; gap: 20px; }

/* KPI Grid */
.io-stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.io-stat-card { background: #fff; border: 1px solid #E2E8F0; border-radius: 14px; padding: 16px; display: flex; align-items: center; gap: 14px; box-shadow: 0 1px 3px rgba(0,0,0,.02); }
.io-stat-ic { width: 42px; height: 42px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 16px; }
.ic-purple { background: #EEF2FF; color: #6366F1; }
.ic-green { background: #ECFDF5; color: #10B981; }
.ic-red { background: #FEF2F2; color: #EF4444; }
.ic-yellow { background: #FFF7ED; color: #F97316; }

.io-stat-info { min-width: 0; flex: 1; }
.io-stat-lbl { font-size: 11px; color: #64748B; font-weight: 600; text-transform: uppercase; letter-spacing: 0.03em; margin-bottom: 2px; }
.io-stat-val { font-size: 24px; font-weight: 800; color: #0F172A; line-height: 1; }

/* Filter bar panel */
.io-filter-card { background: #fff; border: 1px solid #E2E8F0; border-radius: 14px; padding: 14px 16px; box-shadow: 0 1px 3px rgba(0,0,0,.02); }
.io-filter-grid { display: grid; grid-template-columns: 2fr 1.2fr 1.2fr auto; gap: 10px; align-items: center; }
.io-search-wrap { position: relative; }
.io-search-input { width: 100%; padding: 8px 12px 8px 34px; border: 1.5px solid #E2E8F0; border-radius: 8px; font-size: 13px; outline: none; transition: border-color .15s; }
.io-search-input:focus { border-color: #6366F1; }
.io-search-icon { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); color: #94A3B8; }
.io-select { padding: 8px 10px; border: 1.5px solid #E2E8F0; border-radius: 8px; font-size: 13px; outline: none; background: #fff; color: #334155; cursor: pointer; }
.io-select:focus { border-color: #6366F1; }
.io-reset-btn { padding: 8px 14px; background: #fff; border: 1.5px solid #E2E8F0; border-radius: 8px; font-size: 12.5px; font-weight: 700; color: #64748B; cursor: pointer; transition: all .15s; }
.io-reset-btn:hover { border-color: #6366F1; color: #6366F1; }

/* Table styling */
.io-tcard { background: #fff; border: 1px solid #E2E8F0; border-radius: 14px; box-shadow: 0 1px 3px rgba(0,0,0,.02); overflow: hidden; }
.io-dt { width: 100%; border-collapse: collapse; }
.io-dt th { font-size: 11px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: .06em; text-align: left; padding: 12px 16px; background: #F8FAFC; border-bottom: 1px solid #E2E8F0; }
.io-dt td { padding: 12px 16px; font-size: 13px; color: #334155; border-bottom: 1px solid #F1F5F9; vertical-align: middle; }
.io-dt tr:last-child td { border-bottom: none; }
.io-dt tr:hover td { background: #F8FAFC; }

.status-dot { display: inline-flex; align-items: center; gap: 6px; font-size: 12.5px; font-weight: 600; }
.dot-active { width: 7px; height: 7px; border-radius: 50%; background: #10B981; }
.dot-inactive { width: 7px; height: 7px; border-radius: 50%; background: #EF4444; }
`;

export default function InstalledDevicesPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');

  const devices = [
    { id: 'IOT-9182', vehicle: 'EV-12KA-1234', installDate: 'May 10, 2024', zone: 'South Depot Zone', status: 'active' },
    { id: 'IOT-4821', vehicle: 'EV-12KA-5678', installDate: 'May 12, 2024', zone: 'Connaught Place', status: 'active' },
    { id: 'IOT-3011', vehicle: 'EV-12KA-6789', installDate: 'May 14, 2024', zone: 'Koramangala', status: 'inactive' },
    { id: 'IOT-8492', vehicle: 'EV-12KA-9012', installDate: 'May 15, 2024', zone: 'Indiranagar', status: 'active' },
    { id: 'IOT-2741', vehicle: 'EV-12KA-3456', installDate: 'May 18, 2024', zone: 'Banjara Hills', status: 'active' }
  ];

  const filtered = devices.filter(d => {
    const matchesSearch = d.id.toLowerCase().includes(search.toLowerCase()) || d.vehicle.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status === 'all' || d.status === status;
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="io-shell">
        <Sidebar activePath="/iot-devices/installed" />
        <div className="io-main">
          <TopBar title="Installed Devices" subtitle="Monitor and manage all active IoT components on vehicles." showHand={false} />
          
          <div className="io-page">
            <div className="io-stats-row">
              <div className="io-stat-card">
                <span className="io-stat-ic ic-purple">📡</span>
                <div className="io-stat-info">
                  <span className="io-stat-lbl">Total Installed</span>
                  <span className="io-stat-val">1,248</span>
                </div>
              </div>
              <div className="io-stat-card">
                <span className="io-stat-ic ic-green">✓</span>
                <div className="io-stat-info">
                  <span className="io-stat-lbl">Active Signals</span>
                  <span className="io-stat-val">1,220</span>
                </div>
              </div>
              <div className="io-stat-card">
                <span className="io-stat-ic ic-red">✗</span>
                <div className="io-stat-info">
                  <span className="io-stat-lbl">No Signal</span>
                  <span className="io-stat-val">18</span>
                </div>
              </div>
              <div className="io-stat-card">
                <span className="io-stat-ic ic-yellow">⚠</span>
                <div className="io-stat-info">
                  <span className="io-stat-lbl">Low Battery</span>
                  <span className="io-stat-val">10</span>
                </div>
              </div>
            </div>

            <div className="io-filter-card">
              <div className="io-filter-grid">
                <div className="io-search-wrap">
                  <input
                    type="text"
                    className="io-search-input"
                    placeholder="Search by Device ID or Vehicle Reg..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                  <span className="io-search-icon">🔍</span>
                </div>
                <select className="io-select" value={status} onChange={e => setStatus(e.target.value)}>
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <button className="io-reset-btn" onClick={() => { setSearch(''); setStatus('all'); }}>Reset Filters</button>
              </div>
            </div>

            <div className="io-tcard">
              <table className="io-dt">
                <thead>
                  <tr>
                    <th>Device ID</th>
                    <th>Vehicle Reg</th>
                    <th>Install Date</th>
                    <th>Active Zone</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(d => (
                    <tr key={d.id}>
                      <td style={{ fontWeight: '700', color: '#6366F1' }}>{d.id}</td>
                      <td style={{ fontWeight: '600' }}>{d.vehicle}</td>
                      <td>{d.installDate}</td>
                      <td>{d.zone}</td>
                      <td>
                        <span className="status-dot">
                          <span className={d.status === 'active' ? 'dot-active' : 'dot-inactive'} />
                          {d.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
