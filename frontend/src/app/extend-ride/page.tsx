'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

const CSS = `
.ex-shell{display:flex;min-height:100vh;background:#F5F7FF}
.ex-main{margin-left:230px;display:flex;flex-direction:column;min-height:100vh;flex:1;min-width:0;background:#F5F7FF}
.ex-body{padding:20px 22px 70px;display:flex;flex-direction:column;gap:18px;flex:1}
.ex-bc{display:flex;align-items:center;gap:7px;font-size:12px;color:#94A3B8}
.ex-bc a{color:#94A3B8;text-decoration:none}
.ex-bc a:hover{color:#2A195C}
.ex-title-row{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;flex-wrap:wrap}
.ex-h1{font-size:24px;font-weight:800;color:#111827;line-height:1.15;margin:0}
.ex-sub{font-size:13px;color:#64748B;margin-top:5px;max-width:760px}
.ex-back-btn{display:inline-flex;align-items:center;gap:8px;padding:10px 16px;background:#fff;border:1px solid #E2E8F0;border-radius:10px;font-size:13px;font-weight:700;color:#334155;cursor:pointer;text-decoration:none;box-shadow:0 1px 3px rgba(15,23,42,.05)}
.ex-grid{display:grid;grid-template-columns:minmax(0,1fr) 320px;gap:18px;align-items:start}
.ex-card{background:#fff;border:1px solid #E5E7EB;border-radius:16px;box-shadow:0 1px 4px rgba(15,23,42,.06);overflow:hidden}
.ex-card-hdr{padding:18px 20px;border-bottom:1px solid #F1F5F9;display:flex;align-items:flex-start;justify-content:space-between;gap:12px}
.ex-card-title{font-size:16px;font-weight:800;color:#111827}
.ex-card-sub{font-size:12.5px;color:#64748B;margin-top:3px}
.ex-card-body{padding:18px 20px}
.ex-ride-chip{display:inline-flex;align-items:center;gap:7px;padding:6px 10px;border-radius:999px;background:#EEF2FF;color:#2A195C;font-size:11.5px;font-weight:800;margin-bottom:14px}
.ex-meta-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-bottom:16px}
.ex-meta{border:1px solid #E5E7EB;border-radius:12px;padding:12px 14px;background:#FAFAFF}
.ex-meta-lbl{font-size:11px;color:#94A3B8;margin-bottom:4px}
.ex-meta-val{font-size:13px;font-weight:800;color:#111827}
.ex-form{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
.ex-field{display:flex;flex-direction:column;gap:6px}
.ex-lbl{font-size:12px;font-weight:700;color:#334155}
.ex-inp,.ex-select,.ex-textarea{width:100%;border:1.5px solid #E2E8F0;border-radius:10px;padding:10px 12px;font-size:13px;font-family:inherit;color:#0F172A;background:#fff;outline:none;transition:border-color .15s,box-shadow .15s}
.ex-inp:focus,.ex-select:focus,.ex-textarea:focus{border-color:#2A195C;box-shadow:0 0 0 3px rgba(79,70,229,.08)}
.ex-select{appearance:none}
.ex-textarea{min-height:112px;resize:vertical}
.ex-field.full{grid-column:1/-1}
.ex-quick-row{display:flex;flex-wrap:wrap;gap:10px;margin-top:4px}
.ex-quick-btn{padding:8px 12px;border-radius:999px;border:1px solid #E2E8F0;background:#fff;color:#475569;font-size:12px;font-weight:700;cursor:pointer;transition:all .15s}
.ex-quick-btn:hover{border-color:#2A195C;color:#2A195C;background:#EEF2FF}
.ex-quick-btn.active{border-color:#2A195C;background:#2A195C;color:#fff}
.ex-summary{display:flex;flex-direction:column;gap:14px;position:sticky;top:80px}
.ex-summary-card{background:#fff;border:1px solid #E5E7EB;border-radius:16px;box-shadow:0 1px 4px rgba(15,23,42,.06);overflow:hidden}
.ex-summary-hdr{padding:16px 18px;border-bottom:1px solid #F1F5F9;display:flex;align-items:center;justify-content:space-between;gap:10px}
.ex-summary-title{font-size:13px;font-weight:800;color:#111827}
.ex-summary-body{padding:14px 18px}
.ex-srow{display:flex;justify-content:space-between;gap:10px;font-size:12.5px;padding:7px 0;border-bottom:1px solid #F8FAFC}
.ex-srow:last-child{border-bottom:none}
.ex-slbl{color:#64748B}
.ex-sval{font-weight:700;color:#111827;text-align:right}
.ex-total{display:flex;justify-content:space-between;align-items:center;margin-top:10px;padding-top:12px;border-top:1px solid #E2E8F0;font-size:13px;font-weight:800;color:#111827}
.ex-total span:last-child{font-size:16px;color:#2A195C}
.ex-note{padding:12px 14px;border-radius:12px;border:1px solid #BBF7D0;background:#F0FDF4;color:#166534;font-size:12.5px;line-height:1.45}
.ex-btn-row{display:flex;justify-content:flex-end;gap:10px;flex-wrap:wrap}
.ex-btn{padding:11px 16px;border-radius:10px;font-size:13.5px;font-weight:800;border:1px solid transparent;cursor:pointer;font-family:inherit}
.ex-btn.secondary{background:#fff;border-color:#E2E8F0;color:#334155}
.ex-btn.primary{background:#2A195C;color:#fff;box-shadow:0 2px 10px rgba(79,70,229,.2)}
.ex-btn.primary:hover{background:#4338CA}
.ex-btn.secondary:hover{border-color:#2A195C;color:#2A195C}
@media (max-width: 1100px){.ex-grid{grid-template-columns:1fr}.ex-summary{position:static}.ex-meta-grid{grid-template-columns:1fr}}
`;

const EXTENSION_OPTIONS = [1, 2, 3, 4, 6];
const REASONS = ['Late return request', 'Rider convenience', 'Road closure', 'Vehicle service delay', 'Other'];

export default function ExtendRidePage() {
  const router = useRouter();
  const [hours, setHours] = useState(2);
  const [reason, setReason] = useState(REASONS[0]);
  const [notes, setNotes] = useState('');

  const baseFare = 180;
  const extensionRate = 45;
  const totalCharge = baseFare + hours * extensionRate;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="ex-shell">
        <Sidebar activePath="/extend-ride" />
        <div className="ex-main">
          <TopBar title="Extend Ride" subtitle="Update ride duration and collect the additional charge" />

          <div className="ex-body">
            <div className="ex-bc">
              <Link href="/">Dashboard</Link>
              <span>›</span>
              <span>Requests</span>
              <span>›</span>
              <span style={{ color: '#2A195C', fontWeight: 700 }}>Extend Ride</span>
            </div>

            <div className="ex-title-row">
              <div>
                <h1 className="ex-h1">Extend Ride</h1>
                <div className="ex-sub">Extend the current ride for a selected number of hours, update the reason, and confirm the additional fare before saving.</div>
              </div>

              <button className="ex-back-btn" onClick={() => router.push('/')}>
                <span>←</span>
                Back to dashboard
              </button>
            </div>

            <div className="ex-grid">
              <div className="ex-card">
                <div className="ex-card-hdr">
                  <div>
                    <div className="ex-card-title">Ride extension details</div>
                    <div className="ex-card-sub">Review the active ride and set the requested extension.</div>
                  </div>
                  <div className="ex-ride-chip">Active ride #EVG-20481</div>
                </div>

                <div className="ex-card-body">
                  <div className="ex-meta-grid">
                    <div className="ex-meta">
                      <div className="ex-meta-lbl">Rider</div>
                      <div className="ex-meta-val">Akash Verma</div>
                    </div>
                    <div className="ex-meta">
                      <div className="ex-meta-lbl">Vehicle</div>
                      <div className="ex-meta-val">EVG-7482</div>
                    </div>
                    <div className="ex-meta">
                      <div className="ex-meta-lbl">Current return time</div>
                      <div className="ex-meta-val">06:30 PM</div>
                    </div>
                  </div>

                  <div className="ex-form">
                    <div className="ex-field">
                      <label className="ex-lbl">Extension hours</label>
                      <input
                        className="ex-inp"
                        type="number"
                        min={1}
                        max={12}
                        value={hours}
                        onChange={(event) => setHours(Math.max(1, Math.min(12, Number(event.target.value) || 1)))}
                      />
                    </div>

                    <div className="ex-field">
                      <label className="ex-lbl">Reason</label>
                      <select className="ex-select" value={reason} onChange={(event) => setReason(event.target.value)}>
                        {REASONS.map((item) => (
                          <option key={item} value={item}>{item}</option>
                        ))}
                      </select>
                    </div>

                    <div className="ex-field full">
                      <label className="ex-lbl">Quick select</label>
                      <div className="ex-quick-row">
                        {EXTENSION_OPTIONS.map((value) => (
                          <button
                            key={value}
                            type="button"
                            className={`ex-quick-btn ${hours === value ? 'active' : ''}`}
                            onClick={() => setHours(value)}
                          >
                            +{value} hour{value > 1 ? 's' : ''}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="ex-field full">
                      <label className="ex-lbl">Notes</label>
                      <textarea
                        className="ex-textarea"
                        value={notes}
                        onChange={(event) => setNotes(event.target.value)}
                        placeholder="Add an operational note for the extension approval"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="ex-summary">
                <div className="ex-summary-card">
                  <div className="ex-summary-hdr">
                    <div className="ex-summary-title">Charge summary</div>
                    <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#16A34A' }}>Approved</div>
                  </div>
                  <div className="ex-summary-body">
                    <div className="ex-srow">
                      <span className="ex-slbl">Base fare</span>
                      <span className="ex-sval">₹{baseFare}</span>
                    </div>
                    <div className="ex-srow">
                      <span className="ex-slbl">Extension fee</span>
                      <span className="ex-sval">₹{hours * extensionRate}</span>
                    </div>
                    <div className="ex-srow">
                      <span className="ex-slbl">Duration</span>
                      <span className="ex-sval">{hours} hour{hours > 1 ? 's' : ''}</span>
                    </div>
                    <div className="ex-srow">
                      <span className="ex-slbl">Reason</span>
                      <span className="ex-sval">{reason}</span>
                    </div>
                    <div className="ex-total">
                      <span>Total charge</span>
                      <span>₹{totalCharge}</span>
                    </div>
                  </div>
                </div>

                <div className="ex-note">
                  This page is now available at <strong>/extend-ride</strong>. It keeps the same shell as the rest of the dashboard and is linked from the home cards.
                </div>

                <div className="ex-btn-row">
                  <Link href="/" style={{ textDecoration: 'none' }}>
                    <button className="ex-btn secondary" type="button">Cancel</button>
                  </Link>
                  <button
                    className="ex-btn primary"
                    type="button"
                    onClick={() => alert(`Ride extended by ${hours} hour(s). Additional charge: ₹${hours * extensionRate}.`) }
                  >
                    Save extension
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}