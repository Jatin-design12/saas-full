'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { QRCodeSVG } from 'qrcode.react';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
.nr-shell{display:flex;min-height:100vh;background:#fff;font-family:Inter,sans-serif;}
.nr-main{margin-left:230px;display:flex;flex-direction:column;min-height:100vh;flex:1;min-width:0;background:#fff;}
.nr-page{flex:1;padding:20px 22px 70px;}
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
.rr-pm-card{background:#fff;border:1.5px solid #E5E7EB;border-radius:12px;padding:14px;cursor:pointer;transition:all .15s;position:relative;}
.rr-pm-card:hover{border-color:#2A195C;}
.rr-pm-card.selected{border-color:#2A195C;background:#FAF8FF;box-shadow:0 0 0 1px #2A195C;}
.rr-pm-radio{width:16px;height:16px;border-radius:50%;border:2px solid #D1D5DB;position:absolute;top:12px;right:12px;}
.rr-pm-radio.on{border-color:#2A195C;background:#2A195C;box-shadow:inset 0 0 0 3px #fff;}
.rr-pm-name{font-size:13px;font-weight:700;color:#111827;margin-bottom:2px;}
.rr-pm-sub{font-size:11.5px;color:#6B7280;}

/* ICICI QR Card */
.icici-qr-card {
  background: #FAF8FF;
  border: 1.5px solid #E9D5FF;
  border-radius: 14px;
  padding: 18px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
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

/* ── ICICI Live Status & Pulse ── */
.icici-status-box {
  margin-top: 12px;
  width: 100%;
  max-width: 320px;
}
.icici-pulse-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #EFF6FF;
  border: 1px solid #BFDBFE;
  border-radius: 9px;
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 600;
  color: #1D4ED8;
}
.icici-pulse-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #2563EB;
  box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.7);
  animation: iciciPulse 1.8s infinite;
}
@keyframes iciciPulse {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 8px rgba(37, 99, 235, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(37, 99, 235, 0); }
}
.icici-verified-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  background: #ECFDF5;
  border: 1.5px solid #10B981;
  border-radius: 9px;
  padding: 9px 14px;
  font-size: 12.5px;
  font-weight: 700;
  color: #065F46;
}

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

  // Split and Cash payment
  const [cashAmount, setCashAmount] = useState(0);
  const [staffCollector, setStaffCollector] = useState('Himanshu (Super Admin)');
  const [cashReceipt, setCashReceipt] = useState('');

  // Auto-generate cash voucher when cash or split is selected
  useEffect(() => {
    if (payMethod === 'cash' || payMethod === 'split') {
      if (!cashReceipt) {
        const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const randCode = Math.floor(1000 + Math.random() * 9000);
        setCashReceipt(`CSH-VCHR-${todayStr}-${randCode}`);
      }
    }
  }, [payMethod, cashReceipt]);

  // Dynamic ICICI QR & Polling state
  const [iciciQrString, setIciciQrString] = useState('');
  const [iciciMerchantTranId, setIciciMerchantTranId] = useState('');
  const [iciciRefId, setIciciRefId] = useState('');
  const [splitQrString, setSplitQrString] = useState('');
  const [splitMerchantTranId, setSplitMerchantTranId] = useState('');
  const [splitRefId, setSplitRefId] = useState('');
  const [iciciVpa, setIciciVpa] = useState('EVEGAHUAT@icici');
  const [upiVerified, setUpiVerified] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);

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

  // Fetch active ICICI config
  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    fetch(`${apiUrl}/payments/icici/config`)
      .then(r => r.json())
      .then(d => {
        if (d?.vpa) setIciciVpa(d.vpa);
      })
      .catch(() => {});
  }, []);

  // Zero GST Total
  const totalPayable = Math.max(0, baseRent + deposit - discount);
  const clampedCash = Math.min(totalPayable, Math.max(0, cashAmount));
  const onlineAmount = Math.max(0, totalPayable - clampedCash);

  // Real Dynamic ICICI QR Code for Full UPI
  useEffect(() => {
    if (totalPayable <= 0) return;
    setUpiVerified(false);
    let isMounted = true;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

    fetch(`${apiUrl}/payments/icici/qr`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: totalPayable,
        rider_name: rider?.name || 'Rider',
        mobile: rider?.phone || rider?.mobile || '',
        notes: `Retain Ride - ${rental?.vehicle_name || 'EV'}`,
        purpose: 'retain_ride'
      })
    })
      .then(r => r.json())
      .then(res => {
        if (!isMounted) return;
        const data = res?.data || res;
        const qrStr = res?.qrString || data?.upi_string || data?.qrString || '';
        const mTranId = res?.merchantTranId || data?.tx_id || '';
        const rId = res?.refId || data?.ref_id || mTranId;
        if (res?.vpa) setIciciVpa(res.vpa);
        setIciciQrString(qrStr);
        setIciciMerchantTranId(mTranId);
        setIciciRefId(rId);
      })
      .catch(err => console.error('ICICI QR generation error:', err));

    return () => { isMounted = false; };
  }, [totalPayable, rider?.name, rider?.phone, rental?.vehicle_name]);

  // Real Dynamic ICICI QR Code for Split Online Portion
  useEffect(() => {
    if (onlineAmount <= 0) {
      setSplitQrString('');
      setSplitMerchantTranId('');
      setSplitRefId('');
      return;
    }
    setUpiVerified(false);
    let isMounted = true;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

    fetch(`${apiUrl}/payments/icici/qr`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: onlineAmount,
        rider_name: rider?.name || 'Rider',
        mobile: rider?.phone || rider?.mobile || '',
        notes: `Retain Split - ${rental?.vehicle_name || 'EV'}`,
        purpose: 'retain_ride'
      })
    })
      .then(r => r.json())
      .then(res => {
        if (!isMounted) return;
        const data = res?.data || res;
        const qrStr = res?.qrString || data?.upi_string || data?.qrString || '';
        const mTranId = res?.merchantTranId || data?.tx_id || '';
        const rId = res?.refId || data?.ref_id || mTranId;
        if (res?.vpa) setIciciVpa(res.vpa);
        setSplitQrString(qrStr);
        setSplitMerchantTranId(mTranId);
        setSplitRefId(rId);
      })
      .catch(err => console.error('Split QR error:', err));

    return () => { isMounted = false; };
  }, [onlineAmount, rider?.name, rider?.phone, rental?.vehicle_name]);

  // Automated real-time ICICI payment status polling
  useEffect(() => {
    const activeTxId = payMethod === 'split' ? splitMerchantTranId : iciciMerchantTranId;
    const isOnlineActive = payMethod === 'upi' || (payMethod === 'split' && onlineAmount > 0);

    if (!isOnlineActive || !activeTxId || upiVerified) return;

    let isMounted = true;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

    const checkStatus = async () => {
      if (!isMounted || upiVerified) return;
      try {
        setIsCheckingStatus(true);
        const res = await fetch(`${apiUrl}/payments/icici/status`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ merchantTranId: activeTxId }),
        });
        if (!isMounted) return;
        const data = await res.json();
        const rawStatus = (data?.status || data?.Status || '').toUpperCase();
        if (rawStatus === 'SUCCESS') {
          setUpiVerified(true);
        }
      } catch (e) {
      } finally {
        if (isMounted) setIsCheckingStatus(false);
      }
    };

    const timeout = setTimeout(checkStatus, 1500);
    const interval = setInterval(checkStatus, 2500);

    return () => {
      isMounted = false;
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [payMethod, iciciMerchantTranId, splitMerchantTranId, onlineAmount, upiVerified]);

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
      const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const finalVoucher = cashReceipt || `CSH-VCHR-${todayStr}-${Math.floor(1000 + Math.random() * 9000)}`;
      const paymentData = {
        base_rent: baseRent,
        deposit_amount: deposit,
        discount_amount: discount,
        total_payable: totalPayable,
        payment_method: payMethod === 'cash' ? 'Cash' : (payMethod === 'upi' ? 'ICICI UPI' : (payMethod === 'split' ? 'Split' : 'Wallet')),
        payment_mode: payMethod === 'cash' ? 'Cash' : (payMethod === 'upi' ? 'ICICI UPI' : (payMethod === 'split' ? 'Split' : 'Wallet')),
        cash_amount: payMethod === 'split' ? clampedCash : payMethod === 'cash' ? totalPayable : 0,
        online_amount: payMethod === 'split' ? onlineAmount : payMethod === 'upi' ? totalPayable : 0,
        collector_name: staffCollector,
        cash_voucher_number: (payMethod === 'cash' || payMethod === 'split') ? finalVoucher : null,
        voucher_number: (payMethod === 'cash' || payMethod === 'split') ? finalVoucher : null,
        cash_receipt: (payMethod === 'cash' || payMethod === 'split') ? finalVoucher : null,
        transaction_id: (payMethod === 'cash' || payMethod === 'split') ? finalVoucher : (iciciMerchantTranId || `EVG-${Date.now()}`),
        coupon_code: couponApplied ? coupon : null,
        status: 'Paid',
        payment_status: 'Paid'
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
                          <span>⚡</span> ICICI BANK DYNAMIC UPI QR
                        </div>
                        <div className="icici-qr-frame">
                          {iciciQrString ? (
                            <QRCodeSVG
                              value={iciciQrString}
                              size={164}
                              level="M"
                              includeMargin={false}
                            />
                          ) : (
                            <div style={{ width: 164, height: 164, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', fontSize: 12, fontWeight: 600 }}>
                              Generating ICICI QR...
                            </div>
                          )}
                        </div>
                        <div className="icici-vpa-txt">UPI VPA: {iciciVpa}</div>
                        <div style={{ fontSize: 14, fontWeight: 800, color: '#111827', marginTop: 4 }}>
                          Scan to pay full amount: ₹{totalPayable.toFixed(2)}
                        </div>
                        <div className="icici-ref-txt">Txn Ref: {iciciMerchantTranId || 'EVG-GENERATING...'} | Zero GST</div>
                        <div style={{ fontSize: 11, color: '#6B7280', marginTop: 4 }}>
                          Works with GPay, PhonePe, Paytm, BHIM, ICICI iMobile &amp; all UPI apps
                        </div>

                        <div className="icici-status-box">
                          {upiVerified ? (
                            <div className="icici-verified-badge">
                              <span>✓</span> Payment Verified via ICICI Bank
                            </div>
                          ) : (
                            <div className="icici-pulse-badge">
                              <span className="icici-pulse-dot" />
                              <span>{isCheckingStatus ? 'Verifying with ICICI Bank...' : 'Awaiting customer UPI payment...'}</span>
                            </div>
                          )}
                        </div>
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
                              {splitQrString ? (
                                <QRCodeSVG
                                  value={splitQrString}
                                  size={150}
                                  level="M"
                                  includeMargin={false}
                                />
                              ) : (
                                <div style={{ width: 150, height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', fontSize: 12 }}>
                                  Generating...
                                </div>
                              )}
                            </div>
                            <div className="icici-vpa-txt">Pay Online Portion: ₹{onlineAmount.toFixed(2)}</div>
                            <div className="icici-ref-txt">Txn Ref: {splitMerchantTranId || 'EVG-SPL-PENDING'}</div>

                            <div className="icici-status-box" style={{ maxWidth: 280 }}>
                              {upiVerified ? (
                                <div className="icici-verified-badge">
                                  <span>✓</span> Balance Received via ICICI Bank
                                </div>
                              ) : (
                                <div className="icici-pulse-badge">
                                  <span className="icici-pulse-dot" />
                                  <span>{isCheckingStatus ? 'Verifying with Bank...' : 'Awaiting balance UPI payment...'}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Cash Collection */}
                    {payMethod === 'cash' && (
                      <div style={{ background: '#F8FAFC', border: '1.5px solid #CBD5E1', borderRadius: 12, padding: '18px', marginBottom: 18 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>💵 Direct Desk Cash Collection</div>
                            <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>Collect cash from rider and generate official cash voucher</div>
                          </div>
                          <span style={{ background: '#DCFCE7', color: '#16A34A', border: '1px solid #BBF7D0', borderRadius: 6, fontSize: 11, fontWeight: 700, padding: '3px 10px' }}>
                            ✓ Zero GST
                          </span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                          <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 10, padding: '12px 14px' }}>
                            <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>CASH AMOUNT PAYABLE</div>
                            <div style={{ fontSize: 22, fontWeight: 800, color: '#2A195C', marginTop: 4 }}>₹{totalPayable.toFixed(2)}</div>
                            <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>Rent ₹{baseRent} + Deposit ₹{deposit}</div>
                          </div>

                          <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 10, padding: '12px 14px' }}>
                            <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>OFFICIAL CASH VOUCHER NO.</div>
                            <div style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', marginTop: 6, fontFamily: 'monospace' }}>
                              {cashReceipt || 'CSH-VCHR-GENERATING...'}
                            </div>
                            <div style={{ fontSize: 11, color: '#16A34A', marginTop: 4, fontWeight: 600 }}>Auto-Generated for Ledger</div>
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                          <div>
                            <label style={{ fontSize: 12, fontWeight: 600, color: '#334155', display: 'block', marginBottom: 6 }}>Cash Collected By (Staff)</label>
                            <input
                              className="nr-inp"
                              value={staffCollector}
                              onChange={e => setStaffCollector(e.target.value)}
                            />
                          </div>
                          <div>
                            <label style={{ fontSize: 12, fontWeight: 600, color: '#334155', display: 'block', marginBottom: 6 }}>Custom Voucher / Receipt No. (Optional)</label>
                            <input
                              className="nr-inp"
                              value={cashReceipt}
                              placeholder="e.g. CSH-VCHR-..."
                              onChange={e => setCashReceipt(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Fleet Balance / Wallet */}
                    {payMethod === 'wallet' && (
                      <div style={{ background: '#F8FAFC', border: '1.5px solid #CBD5E1', borderRadius: 12, padding: '18px', marginBottom: 18 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 10 }}>💳 Rider Fleet / Wallet Balance</div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', border: '1px solid #E2E8F0', borderRadius: 10, padding: '12px 16px' }}>
                          <div>
                            <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>AVAILABLE WALLET BALANCE</div>
                            <div style={{ fontSize: 20, fontWeight: 800, color: '#16A34A', marginTop: 2 }}>₹2,500.00</div>
                          </div>
                          <span style={{ background: '#EFF6FF', color: '#2563EB', border: '1px solid #BFDBFE', borderRadius: 6, fontSize: 11.5, fontWeight: 700, padding: '4px 10px' }}>
                            Sufficient Balance Available
                          </span>
                        </div>
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
                  <button
                    className="nr-continue-btn"
                    onClick={handleContinue}
                    disabled={(payMethod === 'upi' || (payMethod === 'split' && onlineAmount > 0)) && !upiVerified}
                    style={{
                      opacity: ((payMethod === 'upi' || (payMethod === 'split' && onlineAmount > 0)) && !upiVerified) ? 0.6 : 1,
                      cursor: ((payMethod === 'upi' || (payMethod === 'split' && onlineAmount > 0)) && !upiVerified) ? 'not-allowed' : 'pointer'
                    }}
                  >
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
