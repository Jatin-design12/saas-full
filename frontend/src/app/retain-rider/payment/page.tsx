'use client';
import { useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
.nr-shell{display:flex;min-height:100vh;background:#fff;font-family:Inter,sans-serif;}
.nr-main{margin-left:230px;display:flex;flex-direction:column;min-height:100vh;flex:1;min-width:0;background:#fff;}
.nr-page{flex:1;padding:20px 22px 70px; background-color: #FFF;}
.nr-bc{display:flex;align-items:center;gap:7px;padding:14px 0 0;font-size:12px;color:#9CA3AF;}
.nr-bc a{color:#9CA3AF;text-decoration:none;} .nr-bc a:hover{color:#2A195C;} .nr-bc-sep{color:#D1D5DB;} .nr-bc-cur{color:#2A195C;font-weight:600;}
.nr-title-row{display:flex;align-items:flex-start;justify-content:space-between;margin:14px 0 20px;gap:16px;}
.nr-h1{font-size:24px;font-weight:800;color:#111827;line-height:1.2;margin:0;}
.nr-sub{font-size:13px;color:#6B7280;margin-top:4px;}
.nr-back-btn{display:flex;align-items:center;gap:7px;padding:10px 20px;background:#fff;border:1.5px solid #E5E7EB;border-radius:10px;font-size:13px;font-weight:600;color:#374151;cursor:pointer;white-space:nowrap;font-family:inherit;box-shadow:0 1px 3px rgba(0,0,0,.06);transition:border-color .15s;flex-shrink:0;}
.nr-back-btn:hover{border-color:#2A195C;color:#2A195C;}
.nr-stepper{display:flex;align-items:center;background:#fff;border:1px solid #E5E7EB;border-radius:14px;padding:18px 24px;margin-bottom:22px;box-shadow:0 1px 4px rgba(0,0,0,.05);}
.nr-step-wrap{display:flex;align-items:center;flex:1;}
.nr-step{display:flex;align-items:center;gap:10px;}
.nr-step-num{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;flex-shrink:0;}
.nr-step-num.active{background:#2A195C;color:#fff;} .nr-step-num.done{background:#22C55E;color:#fff;} .nr-step-num.pend{background:#fff;color:#9CA3AF;border:2px solid #E5E7EB;}
.nr-step-label{font-size:13px;font-weight:600;color:#111827;white-space:nowrap;} .nr-step-label.pend{color:#9CA3AF;font-weight:500;}
.nr-step-stat{font-size:11.5px;margin-top:2px;white-space:nowrap;}
.nr-step-stat.active-s{color:#2A195C;} .nr-step-stat.done-s{color:#22C55E;} .nr-step-stat.pend-s{color:#9CA3AF;}
.nr-step-line{flex:1;height:2px;background:#E5E7EB;margin:0 14px;min-width:16px;} .nr-step-line.done-l{background:#22C55E;}
.nr-layout{display:grid;grid-template-columns:1fr 296px;gap:20px;align-items:start;}
.nr-card{background:#fff;border:1px solid #E5E7EB;border-radius:14px;box-shadow:0 1px 4px rgba(0,0,0,.06);overflow:hidden;margin-bottom:16px;}
.nr-card-body{padding:20px 24px;}
.nr-footer-card{background:#fff;border:1px solid #E5E7EB;border-radius:14px;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;box-shadow:0 1px 4px rgba(0,0,0,.06);}
.nr-prev-btn{display:flex;align-items:center;gap:6px;padding:10px 18px;background:#fff;border:1.5px solid #E5E7EB;border-radius:10px;font-size:13px;font-weight:600;color:#374151;cursor:pointer;font-family:inherit;transition:border-color .15s;}
.nr-prev-btn:hover{border-color:#2A195C;color:#2A195C;}
.nr-continue-btn{display:flex;align-items:center;gap:7px;padding:11px 26px;background:#2A195C;color:#fff;border:none;border-radius:10px;font-size:13.5px;font-weight:700;cursor:pointer;font-family:inherit;transition:background .15s;box-shadow:0 2px 8px rgba(79,70,229,.3);}
.nr-continue-btn:hover{background:#4338CA;}
/* charges */
.rr-table{width:100%;border-collapse:collapse;margin-bottom:18px;}
.rr-table th{text-align:left;font-size:11.5px;font-weight:700;color:#9CA3AF;text-transform:uppercase;letter-spacing:.05em;padding:10px 14px;background:#F9FAFB;border-bottom:1.5px solid #E5E7EB;}
.rr-table th:last-child{text-align:right;}
.rr-table td{padding:11px 14px;border-bottom:1px solid #F3F4F6;font-size:13px;color:#374151;}
.rr-table td:last-child{text-align:right;font-weight:600;}
.rr-table tr:last-child td{border-bottom:none;}
.rr-total-row td{background:#F5F3FF;font-weight:800;font-size:14px;color:#111827;}
.rr-total-row td:last-child{color:#2A195C;font-size:18px;}
/* deposit */
.rr-deposit-card{border:1.5px solid #C7D2FE;border-radius:12px;overflow:hidden;margin-bottom:14px;display:flex;}
.rr-deposit-left{background:#EEF2FF;padding:16px 20px;flex:0 0 230px;border-right:1px solid #C7D2FE;display:flex;flex-direction:column;gap:4px;}
.rr-deposit-label{font-size:13px;font-weight:700;color:#3730A3;display:flex;align-items:center;gap:7px;}
.rr-deposit-sub{font-size:11.5px;color:#6B7280;}
.rr-deposit-amount{font-size:18px;font-weight:800;color:#2A195C;margin-top:4px;}
.rr-deposit-right{flex:1;padding:16px 20px;display:flex;align-items:center;justify-content:space-between;gap:12px;}
.rr-deposit-saving{font-size:13px;font-weight:800;color:#22C55E;}
.rr-toggle{width:42px;height:24px;border-radius:12px;position:relative;cursor:pointer;flex-shrink:0;transition:background .2s;}
.rr-toggle-knob{position:absolute;top:3px;width:18px;height:18px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.2);transition:left .2s;}
/* final */
.rr-final-card{border:1.5px solid #E5E7EB;border-radius:12px;padding:16px 20px;display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;}
.rr-final-left{display:flex;align-items:center;gap:10px;}
.rr-final-ic{width:36px;height:36px;border-radius:9px;background:#EEF2FF;display:flex;align-items:center;justify-content:center;color:#2A195C;flex-shrink:0;}
.rr-final-label{font-size:13px;font-weight:700;color:#374151;}
.rr-final-amount{font-size:26px;font-weight:800;color:#111827;}
.rr-deposit-applied{font-size:12px;font-weight:700;color:#22C55E;}
/* payment methods */
.rr-pm-title{font-size:13px;font-weight:700;color:#111827;margin-bottom:12px;}
.rr-pm-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;}
.rr-pm-card{border:1.5px solid #E5E7EB;border-radius:12px;padding:14px;cursor:pointer;transition:border-color .15s;}
.rr-pm-card.selected{border-color:#2A195C;background:#F5F3FF;}
.rr-pm-card:hover:not(.selected){border-color:#C7D2FE;}
.rr-pm-radio{width:16px;height:16px;border-radius:50%;border:2px solid #E5E7EB;display:flex;align-items:center;justify-content:center;margin-bottom:10px;}
.rr-pm-radio.on{border-color:#2A195C;background:#2A195C;}
.rr-pm-name{font-size:12.5px;font-weight:700;color:#111827;margin-bottom:3px;}
.rr-pm-sub{font-size:11.5px;color:#9CA3AF;}
/* rp */
.nr-rp{display:flex;flex-direction:column;gap:16px;position:sticky;top:80px;}
.nr-rp-card{background:#fff;border:1px solid #E5E7EB;border-radius:14px;box-shadow:0 1px 4px rgba(0,0,0,.06);overflow:hidden;}
.nr-rp-hdr{display:flex;align-items:center;gap:9px;padding:14px 18px;border-bottom:1px solid #E5E7EB;}
.nr-rp-title{font-size:13.5px;font-weight:700;color:#111827;}
.nr-rp-body{padding:12px 18px 14px;}
.nr-rp-row{display:flex;align-items:flex-start;justify-content:space-between;padding:6.5px 0;border-bottom:1px solid #F9FAFB;font-size:12.5px;}
.nr-rp-row:last-child{border-bottom:none;} .nr-rp-label{color:#6B7280;} .nr-rp-val{font-weight:600;color:#111827;text-align:right;}
.nr-rp-kyc{background:#DCFCE7;color:#16A34A;border-radius:5px;font-size:11px;font-weight:700;padding:2px 8px;}
.nr-rp-avatar{width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#2A195C,#2A195C);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:800;color:#fff;flex-shrink:0;}
.nr-rp-name{font-size:13.5px;font-weight:800;color:#111827;display:flex;align-items:center;gap:6px;flex-wrap:wrap;}
.nr-rp-sub{font-size:12px;color:#6B7280;}
.nr-help-body{padding:14px 18px 16px;} .nr-help-sub{font-size:13px;color:#6B7280;margin-bottom:12px;}
.nr-help-btn{width:100%;padding:10px;background:#2A195C;color:#fff;border-radius:9px;font-size:13px;font-weight:600;cursor:pointer;border:none;font-family:inherit;}
.nr-help-btn:hover{background:#4338CA;}
`;

const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 2 as number, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
const SV = ({ s = 14, children, ...p }: { s?: number; children: React.ReactNode } & React.SVGProps<SVGSVGElement>) => (<svg width={s} height={s} viewBox="0 0 24 24" {...S} {...p}>{children}</svg>);
const ILeft = () => <SV s={13}><polyline points="15 18 9 12 15 6" /></SV>;
const ICheck = ({ s = 13 }: { s?: number }) => <SV s={s}><polyline points="20 6 9 17 4 12" /></SV>;
const IArr = ({ s = 12 }: { s?: number }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>;
const IWallet = () => <SV s={16}><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M16 10h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1z" /></SV>;
const ICard = () => <SV s={14}><rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" /></SV>;
const IBank = () => <SV s={14}><line x1="3" y1="22" x2="21" y2="22" /><line x1="6" y1="18" x2="6" y2="11" /><line x1="10" y1="18" x2="10" y2="11" /><line x1="14" y1="18" x2="14" y2="11" /><line x1="18" y1="18" x2="18" y2="11" /><polygon points="12 2 20 7 4 7" /></SV>;
const IPhone2 = () => <SV s={14}><rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></SV>;
const IReceipt = () => <SV s={14}><path d="M4 2v20l3-1.5L10 22l3-1.5L16 22l3-1.5L22 22V2" /><path d="M10 9H8M16 9h-2M10 14H8M16 14h-2" /></SV>;
const IUser = () => <SV s={14}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></SV>;

const STEPS = [
  { n: 1, label: 'Rider Search', stat: 'Completed', state: 'done' },
  { n: 2, label: 'Rental Details', stat: 'Completed', state: 'done' },
  { n: 3, label: 'Payment & Charges', stat: 'In Progress', state: 'active' },
  { n: 4, label: 'Documents', stat: 'Pending', state: 'pend' },
  { n: 5, label: 'Review & Confirm', stat: 'Pending', state: 'pend' },
];
const CHARGES = [
  { n: '1', desc: 'Vehicle Rent (Monthly)', amount: '600.00' },
  { n: '2', desc: 'Battery Rent (Monthly)', amount: '300.00' },
  { n: '3', desc: 'Accessories', amount: '50.00' },
  { n: '4', desc: 'GST (18%)', amount: '171.00' },
];

export default function RetainRiderPaymentPage() {
  const [payMethod, setPayMethod] = useState('upi');
  const [depositApplied, setDepositApplied] = useState(true);
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="nr-shell">
        <Sidebar activePath="/retain-rider" />
        <div className="nr-main">
          <TopBar title="Retain Rider - Payment & Charges" subtitle="Review charges and confirm payment method" />
          <div className="nr-page">
            <div className="nr-bc">
              <Link href="/">Home</Link><span className="nr-bc-sep">›</span><a href="#">Rides / Rentals</a><span className="nr-bc-sep">›</span><span className="nr-bc-cur">Retain Ride Registration</span>
            </div>
            <div className="nr-title-row">
              <div><h1 className="nr-h1">Retain Ride Registration</h1><p className="nr-sub">Search and select an existing rider to create a new ride</p></div>
              <button className="nr-back-btn"><ILeft /> Back to Rides</button>
            </div>
            <div className="nr-stepper">
              {STEPS.map((s, i) => (
                <div key={s.n} className="nr-step-wrap">
                  <div className="nr-step">
                    <div className={`nr-step-num ${s.state}`}>{s.state === 'done' ? <ICheck s={13} /> : s.n}</div>
                    <div><div className={`nr-step-label ${s.state === 'pend' ? 'pend' : ''}`}>{s.label}</div><div className={`nr-step-stat ${s.state}-s`}>{s.stat}</div></div>
                  </div>
                  {i < STEPS.length - 1 && <div className={`nr-step-line ${s.state === 'done' ? 'done-l' : ''}`} />}
                </div>
              ))}
            </div>
            <div className="nr-layout">
              <div>
                <div className="nr-card">
                  <div className="nr-card-body">
                    <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>Payment &amp; Charges</h2>
                    <p style={{ fontSize: 13, color: '#6B7280', margin: '0 0 18px' }}>Review charges, apply deposit (if any) and proceed to payment.</p>
                    <table className="rr-table">
                      <thead><tr><th>#</th><th>Description</th><th>Amount (₹)</th></tr></thead>
                      <tbody>
                        {CHARGES.map(c => (
                          <tr key={c.n}><td style={{ color: '#9CA3AF' }}>{c.n}</td><td>{c.desc}</td><td>₹{c.amount}</td></tr>
                        ))}
                        <tr className="rr-total-row">
                          <td colSpan={2}>Total Amount</td>
                          <td>₹1,121.00</td>
                        </tr>
                      </tbody>
                    </table>
                    <div className="rr-deposit-card">
                      <div className="rr-deposit-left">
                        <div className="rr-deposit-label"><ICard /> Deposit (If Applicable)</div>
                        <div className="rr-deposit-sub">Security Deposit on File</div>
                        <div className="rr-deposit-amount">₹500.00</div>
                      </div>
                      <div className="rr-deposit-right">
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>Apply Deposit to this Ride</div>
                          <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>Deposit will be adjusted from total amount</div>
                          {depositApplied && <div className="rr-deposit-saving" style={{ marginTop: 6 }}>Saving ₹500.00</div>}
                        </div>
                        <div className="rr-toggle" style={{ background: depositApplied ? '#2A195C' : '#D1D5DB' }} onClick={() => setDepositApplied(p => !p)}>
                          <div className="rr-toggle-knob" style={{ left: depositApplied ? 21 : 3 }} />
                        </div>
                      </div>
                    </div>
                    <div className="rr-final-card">
                      <div className="rr-final-left">
                        <div className="rr-final-ic"><IWallet /></div>
                        <div>
                          <div className="rr-final-label">Final Amount Payable</div>
                          <div className="rr-final-amount">₹ {depositApplied ? '621.00' : '1,121.00'}</div>
                        </div>
                      </div>
                      {depositApplied && <div className="rr-deposit-applied">✓ Deposit Applied: ₹500.00</div>}
                    </div>
                    <div className="rr-pm-title">Payment Method</div>
                    <div className="rr-pm-grid">
                      {[
                        { id: 'upi', name: 'UPI / QR Code', sub: 'Pay using any UPI app', icon: <IPhone2 /> },
                        { id: 'net', name: 'Net Banking', sub: 'Pay using your bank account', icon: <IBank /> },
                        { id: 'card', name: 'Debit / Credit Card', sub: 'Pay using any card', icon: <ICard /> },
                        { id: 'wallet', name: 'Wallet', sub: 'Pay using wallet balance', icon: <IWallet /> },
                      ].map(m => (
                        <div key={m.id} className={`rr-pm-card ${payMethod === m.id ? 'selected' : ''}`} onClick={() => setPayMethod(m.id)}>
                          <div className={`rr-pm-radio ${payMethod === m.id ? 'on' : ''}`} />
                          <div style={{ color: payMethod === m.id ? '#2A195C' : '#9CA3AF', marginBottom: 8, display: 'flex' }}>{m.icon}</div>
                          <div className="rr-pm-name">{m.name}</div>
                          <div className="rr-pm-sub">{m.sub}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="nr-footer-card">
                  <Link href="/retain-rider/rental" style={{ textDecoration: 'none' }}><button className="nr-prev-btn"><ILeft /> Previous</button></Link>
                  <Link href="/retain-rider/documents" style={{ textDecoration: 'none' }}><button className="nr-continue-btn">Save &amp; Continue <IArr s={12} /></button></Link>
                </div>
              </div>
              <div className="nr-rp">
                <div className="nr-rp-card">
                  <div className="nr-rp-hdr"><div style={{ color: '#2A195C', display: 'flex' }}><IUser /></div><div className="nr-rp-title">Rider Summary</div></div>
                  <div className="nr-rp-body">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, paddingBottom: 10, borderBottom: '1px solid #F3F4F6' }}>
                      <div className="nr-rp-avatar">AV</div>
                      <div>
                        <div className="nr-rp-name">Akash Verma <span className="nr-rp-kyc">KYC</span></div>
                        <div className="nr-rp-sub">+91 98765 43210</div>
                        <div className="nr-rp-sub">RDR00124</div>
                      </div>
                    </div>
                    {[{ l: 'Last Ride', v: '18 May 2024' }, { l: 'Total Rides', v: '24' }].map(r => (
                      <div key={r.l} className="nr-rp-row"><span className="nr-rp-label">{r.l}</span><span className="nr-rp-val">{r.v}</span></div>
                    ))}
                  </div>
                </div>
                <div className="nr-rp-card">
                  <div className="nr-rp-hdr"><div style={{ color: '#2A195C', display: 'flex' }}><IReceipt /></div><div className="nr-rp-title">Ride Summary</div></div>
                  <div className="nr-rp-body">
                    {[{ l: 'Ride Start', v: '21 May 2024' }, { l: 'Expected Return', v: '20 Jun 2024' }, { l: 'Rental Plan', v: 'Monthly' }].map(r => (
                      <div key={r.l} className="nr-rp-row"><span className="nr-rp-label">{r.l}</span><span className="nr-rp-val">{r.v}</span></div>
                    ))}
                    <div style={{ margin: '10px 0', height: 1, background: '#F3F4F6' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                      <span style={{ color: '#6B7280' }}>Total Payable</span>
                      <span style={{ fontWeight: 800, color: '#2A195C', fontSize: 15 }}>₹{depositApplied ? '621.00' : '1,121.00'}</span>
                    </div>
                  </div>
                </div>
                <div className="nr-rp-card">
                  <div className="nr-rp-hdr"><div style={{ color: '#2A195C', display: 'flex' }}><IUser /></div><div className="nr-rp-title">Need Help?</div></div>
                  <div className="nr-help-body"><div className="nr-help-sub">Facing issues with payment?</div><button className="nr-help-btn">Contact Support</button></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
