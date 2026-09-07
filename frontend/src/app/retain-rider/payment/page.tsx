'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
.nr-back-btn{display:flex;align-items:center;gap:7px;padding:10px 20px;background:#fff;border:1.5px solid #E5E7EB;border-radius:10px;font-size:13px;font-weight:600;color:#374151;cursor:pointer;white-space:nowrap;font-family:inherit;box-shadow:0 1px 3px rgba(0,0,0,.06);transition:border-color .15s;flex-shrink:0;text-decoration:none;}
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
.nr-prev-btn{display:flex;align-items:center;gap:6px;padding:10px 18px;background:#fff;border:1.5px solid #E5E7EB;border-radius:10px;font-size:13px;font-weight:600;color:#374151;cursor:pointer;font-family:inherit;transition:border-color .15s;text-decoration:none;}
.nr-prev-btn:hover{border-color:#2A195C;color:#2A195C;}
.nr-continue-btn{display:flex;align-items:center;gap:7px;padding:11px 26px;background:#2A195C;color:#fff;border:none;border-radius:10px;font-size:13.5px;font-weight:700;cursor:pointer;font-family:inherit;transition:background .15s;box-shadow:0 2px 8px rgba(79,70,229,.3);}
.nr-continue-btn:hover{background:#4338CA;}

/* payment methods */
.rr-pm-title{font-size:13px;font-weight:700;color:#111827;margin-bottom:12px;}
.rr-pm-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:18px;}
.rr-pm-card{border:1.5px solid #E5E7EB;border-radius:12px;padding:14px;cursor:pointer;transition:border-color .15s;}
.rr-pm-card.selected{border-color:#2A195C;background:#F5F3FF;}
.rr-pm-card:hover:not(.selected){border-color:#C7D2FE;}
.rr-pm-radio{width:16px;height:16px;border-radius:50%;border:2px solid #E5E7EB;display:flex;align-items:center;justify-content:center;margin-bottom:10px;}
.rr-pm-radio.on{border-color:#2A195C;background:#2A195C;}
.rr-pm-name{font-size:12.5px;font-weight:700;color:#111827;margin-bottom:3px;}
.rr-pm-sub{font-size:11.5px;color:#9CA3AF;}

/* ICICI QR */
.icici-qr-card {
  background: #FDF4FF;
  border: 1.5px solid #F0ABFC;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 18px;
}
.icici-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #701A75;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 20px;
  margin-bottom: 10px;
}
.icici-qr-frame {
  background: #fff;
  padding: 8px;
  border-radius: 10px;
  border: 1.5px solid #E5E7EB;
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);
}
.icici-vpa-txt { font-size: 12.5px; font-weight: 700; color: #701A75; margin-top: 10px; }
.icici-ref-txt { font-size: 11px; color: #64748B; margin-top: 2px; }
.icici-verify-btn {
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 18px;
  background: #10B981;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}
.icici-verify-btn:hover { background: #059669; }

/* Split Payment Box */
.pm-split-box {
  background: #F8FAFC;
  border: 1.5px solid #CBD5E1;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 18px;
}
.pm-split-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.pm-fld { display: flex; flex-direction: column; gap: 4px; margin-bottom: 10px; }
.pm-fld label { font-size: 12px; font-weight: 600; color: #374151; }
.nr-inp {
  padding: 9px 12px; border: 1.5px solid #E5E7EB; border-radius: 8px;
  font-size: 13px; outline: none; font-family: inherit; width: 100%; box-sizing: border-box;
}
.nr-inp:focus { border-color: #2A195C; }

/* Coupon */
.pm-coupon-wrap { display: flex; gap: 9px; margin-bottom: 8px; }
.pm-coupon-inp {
  flex: 1; padding: 10px 13px; border: 1.5px solid #E5E7EB; border-radius: 9px;
  font-size: 13px; outline: none; font-family: inherit;
}
.pm-coupon-btn {
  padding: 10px 20px; background: #2A195C; color: #fff; border: none;
  border-radius: 9px; font-size: 13px; font-weight: 700; cursor: pointer;
}
.pm-coupon-ok {
  display: flex; align-items: center; gap: 8px;
  background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 8px;
  padding: 8px 12px; font-size: 12px; color: #16A34A; font-weight: 600; margin-bottom: 12px;
}
.pm-coupon-err {
  background: #FEF2F2; border: 1px solid #FECACA; border-radius: 8px;
  padding: 8px 12px; font-size: 12px; color: #DC2626; font-weight: 600; margin-bottom: 12px;
}
.pm-coupon-chips { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 14px; }
.pm-coupon-chip {
  padding: 4px 8px; border: 1px dashed #6366F1; border-radius: 6px;
  background: #EEF2FF; color: #4338CA; font-size: 11px; font-weight: 700; cursor: pointer;
}

/* right panel */
.nr-rp{display:flex;flex-direction:column;gap:16px;position:sticky;top:80px;}
.nr-rp-card{background:#fff;border:1px solid #E5E7EB;border-radius:14px;box-shadow:0 1px 4px rgba(0,0,0,.06);overflow:hidden;}
.nr-rp-hdr{display:flex;align-items:center;gap:9px;padding:14px 18px;border-bottom:1px solid #E5E7EB;}
.nr-rp-title{font-size:13.5px;font-weight:700;color:#111827;}
.nr-rp-body{padding:10px 14px 12px;display:flex;flex-direction:column;gap:7px;}
.nr-rp-row{display:flex;align-items:center;justify-content:space-between;padding:9px 12px;font-size:13px;background:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;}
.nr-rp-label{color:#64748B;font-weight:500;} .nr-rp-val{font-weight:700;color:#111827;text-align:right;}
.nr-rp-kyc{background:#DCFCE7;color:#16A34A;border-radius:5px;font-size:11px;font-weight:700;padding:2px 8px;}
.nr-rp-avatar{width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#2A195C,#2A195C);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:800;color:#fff;flex-shrink:0;}
.nr-rp-name{font-size:13.5px;font-weight:800;color:#111827;display:flex;align-items:center;gap:6px;flex-wrap:wrap;}
.nr-rp-sub{font-size:12px;color:#6B7280;}
.nr-rp-divider{height:1px;background:#E2E8F0;margin:2px 0;}
.nr-rp-total{display:flex;align-items:center;justify-content:space-between;padding:12px 14px;margin:2px 0 0;border-radius:10px;background:#F5F3FF;border:1.5px solid #DDD6FE;}
.nr-rp-total-l{font-size:13px;font-weight:700;color:#111827;}
.nr-rp-total-r{font-size:18px;font-weight:800;color:#2A195C;}
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
const IPhone2 = () => <SV s={14}><rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></SV>;
const IReceipt = () => <SV s={14}><path d="M4 2v20l3-1.5L10 22l3-1.5L16 22l3-1.5L22 22V2" /><path d="M10 9H8M16 9h-2M10 14H8M16 14h-2" /></SV>;
const IUser = () => <SV s={14}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></SV>;

const STEPS = [
  { n: 1, label: 'Rider Search', stat: 'Completed', state: 'done' },
  { n: 2, label: 'Rental Details', stat: 'Completed', state: 'done' },
  { n: 3, label: 'Payment & Charges', stat: 'In Progress', state: 'active' },
  { n: 4, label: 'Review & Confirm', stat: 'Pending', state: 'pend' },
];

export default function RetainRiderPaymentPage() {
  const router = useRouter();
  const [rider, setRider] = useState<any>(null);
  const [rental, setRental] = useState<any>(null);
  const [payMethod, setPayMethod] = useState<'upi' | 'split' | 'cash' | 'wallet'>('upi');

  // Amounts
  const [baseRent, setBaseRent] = useState(600);
  const [deposit, setDeposit] = useState(500);
  const [discount, setDiscount] = useState(0);

  // Split payment
  const [cashAmount, setCashAmount] = useState(0);
  const [staffCollector, setStaffCollector] = useState('Himanshu (Super Admin)');

  // ICICI QR
  const [iciciTxId, setIciciTxId] = useState('');
  const [iciciQrUrl, setIciciQrUrl] = useState('');
  const [splitQrUrl, setSplitQrUrl] = useState('');
  const [splitTxId, setSplitTxId] = useState('');
  const [isVerifyingUpi, setIsVerifyingUpi] = useState(false);
  const [upiVerified, setUpiVerified] = useState(false);

  // Coupons
  const [couponsList, setCouponsList] = useState<any[]>([]);
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedRider = localStorage.getItem('evegah_retain_rider');
        if (savedRider) setRider(JSON.parse(savedRider));
        const savedRental = localStorage.getItem('evegah_retain_rental');
        if (savedRental) {
          const parsedRental = JSON.parse(savedRental);
          setRental(parsedRental);
          setBaseRent(Number(parsedRental.plan_rate) || 600);
          setDeposit(Number(parsedRental.deposit_amount) || 500);
        }
      } catch {}
    }
  }, []);

  // Fetch registered coupons
  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    fetch(`${apiUrl}/coupons`)
      .then(res => res.json())
      .then(res => {
        const list = res.data || res.coupons || res;
        if (Array.isArray(list)) {
          setCouponsList(list.filter((c: any) => c.is_active !== false && c.status !== 'inactive'));
        }
      })
      .catch(() => {});
  }, []);

  // Zero GST Total
  const totalPayable = Math.max(0, baseRent + deposit - discount);
  const clampedCash = Math.min(totalPayable, Math.max(0, cashAmount));
  const onlineAmount = Math.max(0, totalPayable - clampedCash);

  // Generate ICICI QR Code
  useEffect(() => {
    if (totalPayable <= 0) return;
    const txId = `EVG-RET-${Date.now()}`;
    setIciciTxId(txId);
    const upiUri = `upi://pay?pa=EVEGAHRIDE@icici&pn=Evegah&am=${totalPayable.toFixed(2)}&cu=INR&tr=${txId}`;
    setIciciQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(upiUri)}`);

    if (onlineAmount > 0) {
      const sTxId = `EVG-SPL-${Date.now()}`;
      setSplitTxId(sTxId);
      const splitUri = `upi://pay?pa=EVEGAHRIDE@icici&pn=Evegah&am=${onlineAmount.toFixed(2)}&cu=INR&tr=${sTxId}`;
      setSplitQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(splitUri)}`);
    }
  }, [totalPayable, onlineAmount]);

  const applyCode = (codeToApply?: string) => {
    const clean = (codeToApply || coupon).trim().toUpperCase();
    if (!clean) return;
    setCouponError('');

    const found = couponsList.find((c: any) => (c.code || '').toUpperCase() === clean);
    if (!found) {
      setCouponError(`Coupon "${clean}" is invalid. Please select a registered coupon.`);
      setCouponApplied(false);
      setDiscount(0);
      return;
    }

    let disc = 0;
    if (found.discount_type === 'percent' || found.type === 'percent') {
      const pct = Number(found.discount_value || found.discount || 0);
      disc = Math.round((baseRent * pct) / 100);
    } else {
      disc = Number(found.discount_value || found.discount || 0);
    }
    disc = Math.min(baseRent, Math.max(0, disc));
    setCoupon(clean);
    setDiscount(disc);
    setCouponApplied(true);
  };

  const handleContinue = () => {
    if (typeof window !== 'undefined') {
      const paymentData = {
        base_rent: baseRent,
        deposit_amount: deposit,
        discount_amount: discount,
        total_payable: totalPayable,
        payment_method: payMethod,
        cash_amount: payMethod === 'split' ? clampedCash : payMethod === 'cash' ? totalPayable : 0,
        online_amount: payMethod === 'split' ? onlineAmount : payMethod === 'upi' ? totalPayable : 0,
        collector_name: staffCollector,
        coupon_code: couponApplied ? coupon : null,
        status: 'Paid',
      };
      localStorage.setItem('evegah_retain_payment', JSON.stringify(paymentData));
      localStorage.setItem('evegah_new_ride_payment', JSON.stringify(paymentData));
    }
    // Directly proceed to review (Step 4), skipping KYC & documents
    router.push('/retain-rider/review');
  };

  const riderName = rider?.name || 'Akash Verma';
  const riderPhone = rider?.phone || '+91 98765 43210';
  const riderId = rider?.id || 'RDR00124';

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="nr-shell">
        <Sidebar activePath="/retain-rider" />
        <div className="nr-main">
          <TopBar title="Retain Rider - Payment & Charges" subtitle="Configure payment method, split options, and ICICI QR" />
          <div className="nr-page">
            <div className="nr-bc">
              <Link href="/">Home</Link><span className="nr-bc-sep">›</span>
              <a href="#">Rides / Rentals</a><span className="nr-bc-sep">›</span>
              <span className="nr-bc-cur">Retain Ride Registration</span>
            </div>
            <div className="nr-title-row">
              <div><h1 className="nr-h1">Retain Ride Registration</h1><p className="nr-sub">Complete payment and charges with Zero GST</p></div>
              <Link href="/renters" className="nr-back-btn"><ILeft /> Back to Rides</Link>
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
                    <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>Payment Method</h2>
                    <p style={{ fontSize: 13, color: '#6B7280', margin: '0 0 18px' }}>Select full UPI (ICICI QR), Split Payment, or Cash for this rental.</p>

                    <div className="rr-pm-grid">
                      {[
                        { id: 'upi', name: 'ICICI QR (UPI)', sub: 'Instant dynamic QR code', icon: <IPhone2 /> },
                        { id: 'split', name: 'Split (Cash + QR)', sub: 'Pay partly in cash & balance online', icon: <ICard /> },
                        { id: 'cash', name: 'Cash Collection', sub: 'Hand-to-hand desk collection', icon: <IWallet /> },
                        { id: 'wallet', name: 'Fleet Balance', sub: 'Adjust from rider account', icon: <IWallet /> },
                      ].map(m => (
                        <div
                          key={m.id}
                          className={`rr-pm-card ${payMethod === m.id ? 'selected' : ''}`}
                          onClick={() => setPayMethod(m.id as any)}
                        >
                          <div className={`rr-pm-radio ${payMethod === m.id ? 'on' : ''}`} />
                          <div style={{ color: payMethod === m.id ? '#2A195C' : '#9CA3AF', marginBottom: 8, display: 'flex' }}>{m.icon}</div>
                          <div className="rr-pm-name">{m.name}</div>
                          <div className="rr-pm-sub">{m.sub}</div>
                        </div>
                      ))}
                    </div>

                    {/* Full ICICI QR */}
                    {payMethod === 'upi' && (
                      <div className="icici-qr-card">
                        <div className="icici-badge">
                          <span>⚡</span> ICICI BANK QR CODE
                        </div>
                        <div className="icici-qr-frame">
                          <img src={iciciQrUrl} alt="ICICI UPI QR" width={160} height={160} />
                        </div>
                        <div className="icici-vpa-txt">UPI VPA: EVEGAHRIDE@icici</div>
                        <div style={{ fontSize: 13.5, fontWeight: 800, color: '#111827', marginTop: 4 }}>
                          Scan to pay full amount: ₹{totalPayable.toFixed(2)}
                        </div>
                        <div className="icici-ref-txt">Txn Ref: {iciciTxId} | Zero GST Applicable</div>
                        <button
                          type="button"
                          className="icici-verify-btn"
                          onClick={() => {
                            setIsVerifyingUpi(true);
                            setTimeout(() => {
                              setIsVerifyingUpi(false);
                              setUpiVerified(true);
                            }, 800);
                          }}
                        >
                          {isVerifyingUpi ? 'Verifying...' : upiVerified ? '✓ Payment Received & Verified' : 'Confirm Payment Received'}
                        </button>
                      </div>
                    )}

                    {/* Split Payment */}
                    {payMethod === 'split' && (
                      <div className="pm-split-box">
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#1E293B', marginBottom: 12 }}>
                          ⚖️ Split Payment (Cash + Online ICICI QR)
                        </div>
                        <div className="pm-split-grid">
                          <div className="pm-fld">
                            <label>Cash Collected (₹)</label>
                            <input
                              type="number"
                              className="nr-inp"
                              min={0}
                              max={totalPayable}
                              value={cashAmount === 0 ? '' : cashAmount}
                              placeholder="Enter cash portion"
                              onChange={e => setCashAmount(Math.max(0, Math.min(totalPayable, Number(e.target.value) || 0)))}
                            />
                          </div>
                          <div className="pm-fld">
                            <label>Remaining Online Portion (₹)</label>
                            <input
                              className="nr-inp"
                              readOnly
                              style={{ background: '#F1F5F9', fontWeight: 700, color: '#2A195C' }}
                              value={`₹${onlineAmount.toFixed(2)}`}
                            />
                          </div>
                        </div>
                        <div className="pm-fld" style={{ marginTop: 10 }}>
                          <label>Collected By</label>
                          <input
                            className="nr-inp"
                            value={staffCollector}
                            onChange={e => setStaffCollector(e.target.value)}
                          />
                        </div>

                        {onlineAmount > 0 && (
                          <div className="icici-qr-card" style={{ marginTop: 14 }}>
                            <div className="icici-badge">⚡ ICICI QR FOR ONLINE BALANCE</div>
                            <div className="icici-qr-frame">
                              <img src={splitQrUrl} alt="Online Balance QR" width={150} height={150} />
                            </div>
                            <div className="icici-vpa-txt">Pay Online Portion: ₹{onlineAmount.toFixed(2)}</div>
                            <div className="icici-ref-txt">Txn Ref: {splitTxId}</div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Coupons */}
                    <div style={{ marginTop: 16 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 8 }}>
                        Apply Coupon (Optional)
                      </div>
                      {!couponApplied ? (
                        <>
                          <div className="pm-coupon-wrap">
                            <input
                              className="pm-coupon-inp"
                              placeholder="Enter coupon code"
                              value={coupon}
                              onChange={e => setCoupon(e.target.value.toUpperCase())}
                            />
                            <button className="pm-coupon-btn" onClick={() => applyCode()}>Apply</button>
                          </div>
                          {couponError && <div className="pm-coupon-err">{couponError}</div>}
                          {couponsList.length > 0 && (
                            <div className="pm-coupon-chips">
                              {couponsList.map((c: any) => (
                                <button
                                  key={c.code}
                                  type="button"
                                  className="pm-coupon-chip"
                                  onClick={() => applyCode(c.code)}
                                >
                                  🏷️ {c.code}
                                </button>
                              ))}
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="pm-coupon-ok">
                          <ICheck s={13} />
                          Coupon <strong>{coupon}</strong> applied successfully! (-₹{discount.toFixed(2)})
                          <button
                            style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#EF4444', fontWeight: 600, cursor: 'pointer' }}
                            onClick={() => { setCouponApplied(false); setDiscount(0); setCoupon(''); }}
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>

                  </div>
                </div>

                <div className="nr-footer-card">
                  <Link href="/retain-rider/rental" className="nr-prev-btn">
                    <ILeft /> Previous
                  </Link>
                  <button className="nr-continue-btn" onClick={handleContinue}>
                    Continue to Review <IArr s={12} />
                  </button>
                </div>
              </div>

              {/* Right Panel */}
              <div className="nr-rp">
                <div className="nr-rp-card">
                  <div className="nr-rp-hdr"><div style={{ color: '#2A195C', display: 'flex' }}><IUser /></div><div className="nr-rp-title">Rider Summary</div></div>
                  <div className="nr-rp-body">
                    <div className="nr-rp-avatar-row">
                      <div className="nr-rp-avatar">{riderName.slice(0, 2).toUpperCase()}</div>
                      <div>
                        <div className="nr-rp-name">{riderName} <span className="nr-rp-kyc">KYC Verified</span></div>
                        <div className="nr-rp-sub">{riderPhone}</div>
                        <div className="nr-rp-sub">{riderId}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="nr-rp-card">
                  <div className="nr-rp-hdr"><div style={{ color: '#2A195C', display: 'flex' }}><IReceipt /></div><div className="nr-rp-title">Payment Summary</div></div>
                  <div className="nr-rp-body">
                    {[
                      { l: 'Assigned Vehicle', v: rental?.vehicle_name || 'Evegah E1' },
                      { l: 'Assigned Battery', v: rental?.battery_id || 'BAT-0098' },
                      { l: 'Rental Plan Rate', v: `₹${baseRent.toFixed(2)}` },
                      { l: 'Refundable Security Deposit', v: `₹${deposit.toFixed(2)}` },
                      ...(discount > 0 ? [{ l: 'Coupon Discount', v: `-₹${discount.toFixed(2)}` }] : []),
                    ].map(r => (
                      <div key={r.l} className="nr-rp-row">
                        <span className="nr-rp-label">{r.l}</span>
                        <span className="nr-rp-val">{r.v}</span>
                      </div>
                    ))}
                    <div className="nr-rp-divider" />
                    <div className="nr-rp-total">
                      <span className="nr-rp-total-l">Total Payable (Zero GST)</span>
                      <span className="nr-rp-total-r">₹{totalPayable.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="nr-rp-card">
                  <div className="nr-rp-hdr"><div style={{ color: '#2A195C', display: 'flex' }}><IUser /></div><div className="nr-rp-title">Need Help?</div></div>
                  <div className="nr-help-body"><div className="nr-help-sub">Facing issues with payment or ICICI QR?</div><button className="nr-help-btn">Contact Support</button></div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
