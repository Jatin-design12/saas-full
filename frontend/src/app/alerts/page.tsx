"use client";
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

const CSS = `
.al-shell { display: flex; min-height: 100vh; background: #F8FAFC; font-family: 'Inter', sans-serif; }
.al-main { margin-left: 230px; display: flex; flex-direction: column; min-height: 100vh; width: calc(100% - 230px); }
.al-page { flex: 1; padding: 24px; display: flex; flex-direction: column; gap: 20px; }

/* Alerts list */
.al-card { background: #fff; border: 1px solid #E2E8F0; border-radius: 14px; box-shadow: 0 1px 3px rgba(0,0,0,.02); padding: 18px; }
.al-title { font-size: 14px; font-weight: 800; color: #0F172A; margin-bottom: 14px; }
.al-item { display: flex; align-items: flex-start; gap: 12px; padding: 12px 0; border-bottom: 1px solid #F1F5F9; }
.al-item:last-child { border-bottom: none; }
.al-dot { width: 8px; height: 8px; border-radius: 50%; margin-top: 6px; flex-shrink: 0; }
.al-info { display: flex; flex-direction: column; gap: 2px; }
.al-name { font-size: 13px; font-weight: 700; color: #1E293B; }
.al-desc { font-size: 12px; color: #64748B; }
.al-time { font-size: 10px; color: #94A3B8; font-weight: 500; margin-top: 4px; }
`;

export default function AlertsPage() {
  const alerts = [
    { title: 'High Server CPU Load', desc: 'Telemetry ingress CPU load exceeded 90% threshold.', time: '5 mins ago', color: '#EF4444' },
    { title: 'Payment Ingress Failure', desc: 'Braintree gateway gateway responded with 503 Service Unavailable.', time: '15 mins ago', color: '#F97316' },
    { title: 'Geofence Breach Detected', desc: 'Vehicle EV-12KA-1234 exited geofenced South Depot Zone boundary.', time: '30 mins ago', color: '#EF4444' },
    { title: 'New Application Version', desc: 'Super Admin uploaded a new android APK build bundle version 2.5.0.', time: '1 hr ago', color: '#3B82F6' }
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="al-shell">
        <Sidebar activePath="/alerts" />
        <div className="al-main">
          <TopBar title="Alerts & Operations Log" subtitle="Monitor active systems health and business exceptions." showHand={false} />
          
          <div className="al-page">
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
