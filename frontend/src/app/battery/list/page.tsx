"use client";
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

const CSS = `
.ba-shell { display: flex; min-height: 100vh; background: #F8FAFC; font-family: 'Inter', sans-serif; }
.ba-main { margin-left: 230px; display: flex; flex-direction: column; min-height: 100vh; width: calc(100% - 230px); }
.ba-page { flex: 1; padding: 24px; display: flex; flex-direction: column; gap: 20px; }

/* Table styling */
.ba-tcard { background: #fff; border: 1px solid #E2E8F0; border-radius: 14px; box-shadow: 0 1px 3px rgba(0,0,0,.02); overflow: hidden; }
.ba-dt { width: 100%; border-collapse: collapse; }
.ba-dt th { font-size: 11px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: .06em; text-align: left; padding: 12px 16px; background: #F8FAFC; border-bottom: 1px solid #E2E8F0; }
.ba-dt td { padding: 12px 16px; font-size: 13px; color: #334155; border-bottom: 1px solid #F1F5F9; vertical-align: middle; }
.ba-dt tr:last-child td { border-bottom: none; }
.ba-dt tr:hover td { background: #F8FAFC; }

.status-dot { display: inline-flex; align-items: center; gap: 6px; font-size: 12.5px; font-weight: 600; }
.dot-healthy { width: 7px; height: 7px; border-radius: 50%; background: #10B981; }
.dot-charging { width: 7px; height: 7px; border-radius: 50%; background: #3B82F6; }
`;

export default function BatteryListPage() {
  const batteries = [
    { id: 'BAT-0921', soc: '98%', cycles: 42, health: '100%', status: 'Healthy', location: 'In Vehicle EV-12' },
    { id: 'BAT-0922', soc: '45%', cycles: 128, health: '96%', status: 'Charging', location: 'Station Slot 03' },
    { id: 'BAT-0923', soc: '82%', cycles: 84, health: '98%', status: 'Healthy', location: 'In Vehicle EV-18' }
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="ba-shell">
        <Sidebar activePath="/battery/list" />
        <div className="ba-main">
          <TopBar title="Battery Asset List" subtitle="Audit all BMS battery units across stations and vehicles." showHand={false} />
          
          <div className="ba-page">
            <div className="ba-tcard">
              <table className="ba-dt">
                <thead>
                  <tr>
                    <th>Battery ID</th>
                    <th>Charge Status (SoC)</th>
                    <th>Charge Cycles</th>
                    <th>SOH Health</th>
                    <th>Current Location</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {batteries.map(b => (
                    <tr key={b.id}>
                      <td style={{ fontWeight: '700', color: '#6366F1' }}>{b.id}</td>
                      <td style={{ fontWeight: '800' }}>{b.soc}</td>
                      <td>{b.cycles}</td>
                      <td style={{ fontWeight: '700', color: '#10B981' }}>{b.health}</td>
                      <td style={{ fontWeight: '600', color: '#475569' }}>{b.location}</td>
                      <td>
                        <span className="status-dot">
                          <span className={b.status === 'Healthy' ? 'dot-healthy' : 'dot-charging'} />
                          {b.status}
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
