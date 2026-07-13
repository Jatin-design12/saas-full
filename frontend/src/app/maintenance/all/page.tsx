"use client";
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

const CSS = `
.mn-shell { display: flex; min-height: 100vh; background: #F8FAFC; font-family: 'Inter', sans-serif; }
.mn-main { margin-left: 230px; display: flex; flex-direction: column; min-height: 100vh; width: calc(100% - 230px); }
.mn-page { flex: 1; padding: 24px; display: flex; flex-direction: column; gap: 20px; }

/* KPI Grid */
.mn-stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.mn-stat-card { background: #fff; border: 1px solid #E2E8F0; border-radius: 14px; padding: 16px; display: flex; align-items: center; gap: 14px; box-shadow: 0 1px 3px rgba(0,0,0,.02); }
.mn-stat-ic { width: 42px; height: 42px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 16px; }
.ic-purple { background: #EEF2FF; color: #6366F1; }
.ic-green { background: #ECFDF5; color: #10B981; }
.ic-red { background: #FEF2F2; color: #EF4444; }
.ic-yellow { background: #FFF7ED; color: #F97316; }

.mn-stat-info { min-width: 0; flex: 1; }
.mn-stat-lbl { font-size: 11px; color: #64748B; font-weight: 600; text-transform: uppercase; letter-spacing: 0.03em; margin-bottom: 2px; }
.mn-stat-val { font-size: 24px; font-weight: 800; color: #0F172A; line-height: 1; }

/* Table styling */
.mn-tcard { background: #fff; border: 1px solid #E2E8F0; border-radius: 14px; box-shadow: 0 1px 3px rgba(0,0,0,.02); overflow: hidden; }
.mn-dt { width: 100%; border-collapse: collapse; }
.mn-dt th { font-size: 11px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: .06em; text-align: left; padding: 12px 16px; background: #F8FAFC; border-bottom: 1px solid #E2E8F0; }
.mn-dt td { padding: 12px 16px; font-size: 13px; color: #334155; border-bottom: 1px solid #F1F5F9; vertical-align: middle; }
.mn-dt tr:last-child td { border-bottom: none; }
.mn-dt tr:hover td { background: #F8FAFC; }

.t-badge { display: inline-flex; align-items: center; gap: 4px; padding: 2px 6px; border-radius: 6px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
.t-open { background: #FEF2F2; color: #EF4444; }
.t-inprogress { background: #FFF7ED; color: #F97316; }
.t-completed { background: #ECFDF5; color: #10B981; }
`;

export default function AllMaintenancePage() {
  const tickets = [
    { id: 'SRV-8271', vehicle: 'EV-12KA-1234', type: 'Brake Fluid Flush', date: 'May 20, 2024', status: 'open' },
    { id: 'SRV-8272', vehicle: 'EV-12KA-5678', type: 'Tire Thread Check', date: 'May 22, 2024', status: 'in progress' },
    { id: 'SRV-8102', vehicle: 'EV-12KA-1234', type: 'Battery Replacement', date: 'May 05, 2024', status: 'completed' },
    { id: 'SRV-8094', vehicle: 'EV-12KA-5678', type: 'Rear Axle Alignment', date: 'May 06, 2024', status: 'completed' }
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="mn-shell">
        <Sidebar activePath="/maintenance/all" />
        <div className="mn-main">
          <TopBar title="All Maintenance Records" subtitle="Track all historical and currently active maintenance entries." showHand={false} />
          
          <div className="mn-page">
            <div className="mn-stats-row">
              <div className="mn-stat-card">
                <span className="mn-stat-ic ic-purple">⚙</span>
                <div className="mn-stat-info">
                  <span className="mn-stat-lbl">Total Records</span>
                  <span className="mn-stat-val">356</span>
                </div>
              </div>
              <div className="mn-stat-card">
                <span className="mn-stat-ic ic-red">🚨</span>
                <div className="mn-stat-info">
                  <span className="mn-stat-lbl">Open Tasks</span>
                  <span className="mn-stat-val">4</span>
                </div>
              </div>
              <div className="mn-stat-card">
                <span className="mn-stat-ic ic-yellow">🕒</span>
                <div className="mn-stat-info">
                  <span className="mn-stat-lbl">Active Services</span>
                  <span className="mn-stat-val">8</span>
                </div>
              </div>
              <div className="mn-stat-card">
                <span className="mn-stat-ic ic-green">✓</span>
                <div className="mn-stat-info">
                  <span className="mn-stat-lbl">Completed</span>
                  <span className="mn-stat-val">344</span>
                </div>
              </div>
            </div>

            <div className="mn-tcard">
              <table className="mn-dt">
                <thead>
                  <tr>
                    <th>Record ID</th>
                    <th>Vehicle Reg</th>
                    <th>Service Type</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map(t => (
                    <tr key={t.id}>
                      <td style={{ fontWeight: '700', color: '#6366F1' }}>{t.id}</td>
                      <td style={{ fontWeight: '600' }}>{t.vehicle}</td>
                      <td style={{ fontWeight: '700' }}>{t.type}</td>
                      <td>{t.date}</td>
                      <td>
                        <span className={`t-badge ${t.status === 'open' ? 't-open' : t.status === 'in progress' ? 't-inprogress' : 't-completed'}`}>
                          {t.status}
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
