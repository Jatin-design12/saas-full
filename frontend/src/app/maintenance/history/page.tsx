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

.done-badge { display: inline-flex; align-items: center; gap: 4px; padding: 2px 6px; border-radius: 6px; font-size: 11px; font-weight: 700; text-transform: uppercase; background: #ECFDF5; color: #10B981; }
`;

export default function ServiceHistoryPage() {
  const history = [
    { id: 'SRV-8102', vehicle: 'EV-12KA-1234', type: 'Battery Replacement', date: 'May 05, 2024', cost: '₹14,500', status: 'completed' },
    { id: 'SRV-8094', vehicle: 'EV-12KA-5678', type: 'Rear Axle Alignment', date: 'May 06, 2024', cost: '₹3,200', status: 'completed' },
    { id: 'SRV-8088', vehicle: 'EV-12KA-6789', type: 'Motor Controller Swap', date: 'May 08, 2024', cost: '₹8,400', status: 'completed' },
    { id: 'SRV-8072', vehicle: 'EV-12KA-9012', type: 'General Body Panel Repair', date: 'May 10, 2024', cost: '₹2,500', status: 'completed' }
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="mn-shell">
        <Sidebar activePath="/maintenance/history" />
        <div className="mn-main">
          <TopBar title="Service History" subtitle="View all historical maintenance and service logs." showHand={false} />
          
          <div className="mn-page">
            <div className="mn-stats-row">
              <div className="mn-stat-card">
                <span className="mn-stat-ic ic-green">✓</span>
                <div className="mn-stat-info">
                  <span className="mn-stat-lbl">Resolved Tickets</span>
                  <span className="mn-stat-val">342</span>
                </div>
              </div>
              <div className="mn-stat-card">
                <span className="mn-stat-ic ic-purple">₹</span>
                <div className="mn-stat-info">
                  <span className="mn-stat-lbl">Total Expenses</span>
                  <span className="mn-stat-val">₹2,84,500</span>
                </div>
              </div>
              <div className="mn-stat-card">
                <span className="mn-stat-ic ic-blue">🕒</span>
                <div className="mn-stat-info">
                  <span className="mn-stat-lbl">Avg Resolution</span>
                  <span className="mn-stat-val">4.5 hrs</span>
                </div>
              </div>
              <div className="mn-stat-card">
                <span className="mn-stat-ic ic-yellow">📈</span>
                <div className="mn-stat-info">
                  <span className="mn-stat-lbl">Preventative Rate</span>
                  <span className="mn-stat-val">92%</span>
                </div>
              </div>
            </div>

            <div className="mn-tcard">
              <table className="mn-dt">
                <thead>
                  <tr>
                    <th>Service ID</th>
                    <th>Vehicle Reg</th>
                    <th>Service Type</th>
                    <th>Completion Date</th>
                    <th>Total Cost</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map(h => (
                    <tr key={h.id}>
                      <td style={{ fontWeight: '700', color: '#10B981' }}>{h.id}</td>
                      <td style={{ fontWeight: '600' }}>{h.vehicle}</td>
                      <td style={{ fontWeight: '700' }}>{h.type}</td>
                      <td>{h.date}</td>
                      <td style={{ fontWeight: '800' }}>{h.cost}</td>
                      <td>
                        <span className="done-badge">{h.status}</span>
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
