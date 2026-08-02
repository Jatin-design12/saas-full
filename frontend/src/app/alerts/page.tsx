"use client";
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');

.al-shell { display: flex; min-height: 100vh; background: #F8FAFC; font-family: 'Plus Jakarta Sans', sans-serif; color: #0F172A; }
.al-main { margin-left: 230px; display: flex; flex-direction: column; min-height: 100vh; width: calc(100% - 230px); }
.al-page { flex: 1; padding: 20px 24px 60px; display: flex; flex-direction: column; gap: 20px; }

/* KPI Grid */
.al-stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.al-stat-card { background: #fff; border: 1px solid #E2E8F0; border-radius: 14px; padding: 16px; display: flex; align-items: center; gap: 14px; box-shadow: 0 1px 3px rgba(0,0,0,.02); transition: all .15s; }
.al-stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.04); border-color: #CBD5E1; }
.al-stat-ic { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-weight: 800; }
.ic-red { background: #FEF2F2; color: #EF4444; }
.ic-orange { background: #FFF7ED; color: #F97316; }
.ic-blue { background: #EFF6FF; color: #2563EB; }
.ic-green { background: #ECFDF5; color: #10B981; }

.al-stat-info { min-width: 0; flex: 1; }
.al-stat-lbl { font-size: 10.5px; color: #64748B; font-weight: 700; text-transform: uppercase; letter-spacing: 0.03em; margin-bottom: 2px; }
.al-stat-val { font-size: 24px; font-weight: 800; color: #0F172A; line-height: 1; font-family: 'Outfit', sans-serif; }

/* Alerts list */
.al-card { background: #fff; border: 1px solid #E2E8F0; border-radius: 14px; box-shadow: 0 1px 3px rgba(0,0,0,.02); padding: 20px; }
.al-title { font-size: 15px; font-weight: 800; color: #0F172A; margin-bottom: 16px; font-family: 'Outfit', sans-serif; }
.al-item { display: flex; align-items: flex-start; gap: 14px; padding: 14px 0; border-bottom: 1px solid #F1F5F9; }
.al-item:last-child { border-bottom: none; }
.al-dot { width: 10px; height: 10px; border-radius: 50%; margin-top: 5px; flex-shrink: 0; }
.al-info { display: flex; flex-direction: column; gap: 2px; }
.al-name { font-size: 13.5px; font-weight: 700; color: #0F172A; }
.al-desc { font-size: 12.5px; color: #64748B; font-weight: 500; }
.al-time { font-size: 11px; color: #94A3B8; font-weight: 600; margin-top: 4px; }
`;

export default function AlertsPage() {
  const alerts = [
    { title: 'High Server CPU Load', desc: 'Telemetry ingress CPU load exceeded 90% threshold.', time: '5 mins ago', color: '#EF4444' },
    { title: 'Payment Ingress Failure', desc: 'Braintree gateway responded with 503 Service Unavailable.', time: '15 mins ago', color: '#F97316' },
    { title: 'Geofence Breach Detected', desc: 'Vehicle EV-12KA-1234 exited geofenced South Depot Zone boundary.', time: '30 mins ago', color: '#EF4444' },
    { title: 'New Application Version', desc: 'Super Admin uploaded a new android APK build bundle version 2.5.0.', time: '1 hr ago', color: '#2563EB' }
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="al-shell">
        <Sidebar activePath="/alerts" />
        <div className="al-main">
          <TopBar title="Alerts & Operations Log" subtitle="Monitor active systems health and business exceptions." showHand={false} />
          
          <div className="al-page">
            <div className="al-stats-row">
              <div className="al-stat-card">
                <span className="al-stat-ic ic-red">🚨</span>
                <div className="al-stat-info">
                  <span className="al-stat-lbl">Critical Alerts</span>
                  <span className="al-stat-val">2</span>
                </div>
              </div>
              <div className="al-stat-card">
                <span className="al-stat-ic ic-orange">⚠️</span>
                <div className="al-stat-info">
                  <span className="al-stat-lbl">Warnings</span>
                  <span className="al-stat-val">1</span>
                </div>
              </div>
              <div className="al-stat-card">
                <span className="al-stat-ic ic-blue">ℹ️</span>
                <div className="al-stat-info">
                  <span className="al-stat-lbl">Info Logs</span>
                  <span className="al-stat-val">1</span>
                </div>
              </div>
              <div className="al-stat-card">
                <span className="al-stat-ic ic-green">✓</span>
                <div className="al-stat-info">
                  <span className="al-stat-lbl">Resolved Today</span>
                  <span className="al-stat-val">14</span>
                </div>
              </div>
            </div>

            <div className="al-card">
              <div className="al-title">Live Systems Feed</div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {alerts.map((a, idx) => (
                  <div className="al-item" key={idx}>
                    <span className="al-dot" style={{ background: a.color }} />
                    <div className="al-info">
                      <span className="al-name">{a.title}</span>
                      <span className="al-desc">{a.desc}</span>
                      <span className="al-time">{a.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

