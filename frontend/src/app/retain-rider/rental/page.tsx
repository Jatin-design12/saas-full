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
.nr-back-btn{display:flex;align-items:center;gap:7px;padding:10px 20px;background:#fff;border:1.5px solid #E5E7EB;border-radius:10px;font-size:13px;font-weight:600;color:#374151;cursor:pointer;white-space:nowrap;font-family:inherit;box-shadow:0 1px 3px rgba(0,0,0,.06);transition:border-color .15s;flex-shrink:0;}
.nr-back-btn:hover{border-color:#2A195C;color:#2A195C;}
.nr-stepper{display:flex;align-items:center;background:#fff;border:1px solid #E5E7EB;border-radius:14px;padding:18px 24px;margin-bottom:22px;box-shadow:0 1px 4px rgba(0,0,0,.05);}
.nr-step-wrap{display:flex;align-items:center;flex:1;}
.nr-step{display:flex;align-items:center;gap:10px;}
.nr-step-num{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;flex-shrink:0;}
.nr-step-num.active{background:#2A195C;color:#fff;} .nr-step-num.done{background:#22C55E;color:#fff;} .nr-step-num.pend{background:#fff;color:#9CA3AF;border:2px solid #E5E7EB;}
.nr-step-label{font-size:13px;font-weight:600;color:#111827;white-space:nowrap;}
.nr-step-label.pend{color:#9CA3AF;font-weight:500;}
.nr-step-stat{font-size:11.5px;margin-top:2px;white-space:nowrap;}
.nr-step-stat.active-s{color:#2A195C;} .nr-step-stat.done-s{color:#22C55E;} .nr-step-stat.pend-s{color:#9CA3AF;}
.nr-step-line{flex:1;height:2px;background:#E5E7EB;margin:0 14px;min-width:16px;}
.nr-step-line.done-l{background:#22C55E;}
.nr-layout{display:grid;grid-template-columns:1fr 296px;gap:20px;align-items:start;}
.nr-card{background:#fff;border:1px solid #E5E7EB;border-radius:14px;box-shadow:0 1px 4px rgba(0,0,0,.06);overflow:hidden;margin-bottom:16px;}
.nr-card-hdr{padding:20px 24px 18px;border-bottom:1px solid #F3F4F6;}
.nr-card-hdr h2{font-size:18px;font-weight:700;color:#111827;margin:0 0 4px;}
.nr-card-hdr p{font-size:13px;color:#6B7280;margin:0;}
.nr-card-body{padding:20px 24px;}

/* rider banner */
.rr-rider-banner{display:flex;align-items:center;gap:18px;padding:18px 24px;background:#F9FAFB;border-bottom:1px solid #E5E7EB;}
.rr-banner-avatar{width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,#2A195C,#2A195C);display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:800;color:#fff;flex-shrink:0;}
.rr-banner-name{font-size:18px;font-weight:800;color:#111827;margin-bottom:4px;}
.rr-banner-row{display:flex;align-items:center;gap:6px;font-size:13px;color:#6B7280;margin-bottom:2px;}
.rr-kyc-badge{background:#DCFCE7;color:#16A34A;border:1px solid #BBF7D0;border-radius:6px;font-size:11.5px;font-weight:700;padding:3px 10px;display:inline-flex;align-items:center;gap:4px;}
.rr-banner-stats{display:flex;gap:24px;flex-shrink:0;margin-left:auto;}
.rr-stat-block{text-align:center;}
.rr-stat-num{font-size:20px;font-weight:800;color:#111827;}
.rr-stat-lbl{font-size:11.5px;color:#9CA3AF;}

/* form */
.rr-form-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:18px;}
.rr-field{display:flex;flex-direction:column;gap:5px;}
.rr-label{font-size:12.5px;font-weight:600;color:#374151;}
.rr-label span{color:#EF4444;}
.rr-input-row{display:flex;gap:8px;}
.rr-inp{width:100%;padding:10px 13px;border:1.5px solid #E5E7EB;border-radius:9px;font-size:13px;color:#111827;outline:none;font-family:inherit;transition:border-color .15s;background:#fff;box-sizing:border-box;}
.rr-inp:focus{border-color:#2A195C;box-shadow:0 0 0 3px rgba(79,70,229,.1);}
.rr-select{appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2.5' stroke-linecap='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center;padding-right:32px;cursor:pointer;}

/* vehicle cards */
.rr-vb-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:18px;}
.rr-vb-card{border:1.5px solid #E5E7EB;border-radius:12px;padding:16px;display:flex;flex-direction:column;gap:10px;}
.rr-vb-label{font-size:12.5px;font-weight:700;color:#374151;} .rr-vb-label span{color:#EF4444;}
.rr-vb-inner{display:flex;align-items:center;gap:12px;}
.rr-vb-img{width:60px;height:50px;display:flex;align-items:center;justify-content:center;background:#F3F4F6;border-radius:8px;flex-shrink:0;}
.rr-vb-id{font-size:13px;font-weight:800;color:#111827;}
.rr-vb-name{font-size:12px;color:#6B7280;}
.rr-avail-badge{background:#DCFCE7;color:#16A34A;border-radius:6px;font-size:11px;font-weight:700;padding:2px 8px;display:inline-block;margin-top:2px;}

/* accessories */
.rr-acc-box{border:1.5px solid #E5E7EB;border-radius:10px;padding:14px 18px;margin-bottom:18px;}
.rr-acc-label{font-size:12.5px;font-weight:700;color:#374151;margin-bottom:12px;}
.rr-acc-row{display:flex;align-items:center;gap:0;}
.rr-acc-item{display:flex;align-items:center;gap:8px;padding:8px 14px;cursor:pointer;font-size:13px;color:#374151;flex:1;}
.rr-cb{width:17px;height:17px;border-radius:4px;border:2px solid #E5E7EB;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .15s;}
.rr-cb.checked{background:#2A195C;border-color:#2A195C;}

/* notes */
.rr-textarea{width:100%;padding:10px 13px;border:1.5px solid #E5E7EB;border-radius:9px;font-size:13px;color:#111827;outline:none;font-family:inherit;resize:none;min-height:80px;transition:border-color .15s;box-sizing:border-box;}
.rr-textarea:focus{border-color:#2A195C;box-shadow:0 0 0 3px rgba(79,70,229,.1);}
.rr-char-count{text-align:right;font-size:11.5px;color:#9CA3AF;margin-top:4px;}

/* footer */
.nr-footer-card{background:#fff;border:1px solid #E5E7EB;border-radius:14px;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;box-shadow:0 1px 4px rgba(0,0,0,.06);}
.nr-cancel-btn{display:flex;align-items:center;gap:6px;padding:10px 18px;background:transparent;border:none;font-size:13px;font-weight:600;color:#6B7280;cursor:pointer;font-family:inherit;}
.nr-cancel-btn:hover{color:#EF4444;}
.nr-continue-btn{display:flex;align-items:center;gap:7px;padding:11px 26px;background:#2A195C;color:#fff;border:none;border-radius:10px;font-size:13.5px;font-weight:700;cursor:pointer;font-family:inherit;transition:background .15s;box-shadow:0 2px 8px rgba(79,70,229,.3);}
.nr-continue-btn:hover{background:#4338CA;}

/* right panel */
.nr-rp{display:flex;flex-direction:column;gap:16px;position:sticky;top:80px;}
.nr-rp-card{background:#fff;border:1px solid #E5E7EB;border-radius:14px;box-shadow:0 1px 4px rgba(0,0,0,.06);overflow:hidden;}
.nr-rp-hdr{display:flex;align-items:center;gap:9px;padding:14px 18px;border-bottom:1px solid #E5E7EB;}
.nr-rp-hdr-ic{display:flex;align-items:center;flex-shrink:0;}
.nr-rp-title{font-size:13.5px;font-weight:700;color:#111827;}
.nr-rp-body{padding:10px 14px 12px;display:flex;flex-direction:column;gap:7px;}
.nr-rp-row{display:flex;align-items:center;justify-content:space-between;padding:9px 12px;font-size:13px;background:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;}
.nr-rp-label{color:#64748B;font-weight:500;} .nr-rp-val{font-weight:700;color:#111827;text-align:right;}
.nr-rp-kyc{background:#DCFCE7;color:#16A34A;border-radius:5px;font-size:11px;font-weight:700;padding:2px 8px;}
.nr-rp-avatar-row{display:flex;align-items:center;gap:10px;margin-bottom:6px;}
.nr-rp-avatar{width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#2A195C,#2A195C);display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:800;color:#fff;flex-shrink:0;}
.nr-rp-name{font-size:14px;font-weight:800;color:#111827;} .nr-rp-sub{font-size:12px;color:#6B7280;}
.nr-rp-divider{height:1px;background:#E2E8F0;margin:2px 0;}
.nr-rp-total{display:flex;align-items:center;justify-content:space-between;padding:12px 14px;margin:2px 0 0;border-radius:10px;background:#F5F3FF;border:1.5px solid #DDD6FE;}
.nr-rp-total-l{font-size:13px;font-weight:700;color:#111827;}
.nr-rp-total-r{font-size:17px;font-weight:800;color:#2A195C;}
.nr-help-body{padding:14px 18px 16px;}
.nr-help-sub{font-size:13px;color:#6B7280;margin-bottom:12px;}
.nr-help-btn{width:100%;padding:10px;background:#2A195C;color:#fff;border-radius:9px;font-size:13px;font-weight:600;cursor:pointer;border:none;font-family:inherit;}
.nr-help-btn:hover{background:#4338CA;}
.nr-tips-card{background:#FFF8F0;border:1px solid #FED7AA;border-radius:14px;overflow:hidden;}
.nr-tips-hdr{display:flex;align-items:center;gap:9px;padding:14px 18px;border-bottom:1px solid #FED7AA;}
.nr-tips-body{padding:10px 0 6px;}
.nr-tip-row{display:flex;align-items:flex-start;gap:9px;padding:7px 18px;font-size:12.5px;color:#92400E;line-height:1.5;}
.nr-tip-dot{width:6px;height:6px;border-radius:50%;background:#D97706;flex-shrink:0;margin-top:5px;}
`;

const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 2 as number, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
const SV = ({ s = 14, children, ...p }: { s?: number; children: React.ReactNode } & React.SVGProps<SVGSVGElement>) => (<svg width={s} height={s} viewBox="0 0 24 24" {...S} {...p}>{children}</svg>);
const ILeft = () => <SV s={13}><polyline points="15 18 9 12 15 6" /></SV>;
const ICheck = ({ s = 13 }: { s?: number }) => <SV s={s}><polyline points="20 6 9 17 4 12" /></SV>;
const IArr = ({ s = 12 }: { s?: number }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>;
const IPhone = () => <SV s={13}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.54 3.53 2 2 0 0 1 3.5 1.35h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6.06 6.06l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></SV>;
const IID = () => <SV s={13}><rect x="2" y="4" width="20" height="16" rx="2" /><circle cx="8.5" cy="10" r="2" /><path d="M14 10h4M14 14h4M6 14h5" /></SV>;
const IReceipt = () => <SV s={14}><path d="M4 2v20l3-1.5L10 22l3-1.5L16 22l3-1.5L22 22V2" /><path d="M10 9H8M16 9h-2M10 14H8M16 14h-2" /></SV>;
const IBulb = () => <SV s={14} stroke="#D97706"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" /><path d="M9 18h6" /><path d="M10 22h4" /></SV>;
const IUser = () => <SV s={14}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></SV>;
const IClose = () => <SV s={13}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></SV>;

const MiniScooter = () => (<svg viewBox="0 0 80 50" style={{ width: 60, height: 40 }} fill="none"><circle cx="15" cy="38" r="10" stroke="#2A195C" strokeWidth="2.5" fill="#EEF2FF" /><circle cx="65" cy="38" r="10" stroke="#2A195C" strokeWidth="2.5" fill="#EEF2FF" /><path d="M15 28 L20 15 L45 15 L55 28 Z" fill="#2A195C" opacity="0.9" /><path d="M45 15 L55 10 L60 20 L55 28 Z" fill="#3730A3" /><path d="M20 15 L25 10 L28 15" fill="#6366F1" /><rect x="23" y="10" width="6" height="3" rx="1" fill="#A5B4FC" /><line x1="15" y1="28" x2="65" y2="28" stroke="#2A195C" strokeWidth="2.5" /></svg>);
const MiniBattery = () => (<svg viewBox="0 0 50 70" style={{ width: 36, height: 50 }} fill="none"><rect x="8" y="8" width="34" height="54" rx="5" fill="#1E1B4B" stroke="#2A195C" strokeWidth="2" /><rect x="18" y="2" width="14" height="8" rx="2" fill="#2A195C" /><rect x="12" y="18" width="26" height="5" rx="2" fill="#22C55E" /><rect x="12" y="27" width="26" height="5" rx="2" fill="#22C55E" /><rect x="12" y="36" width="26" height="5" rx="2" fill="#22C55E" /><rect x="12" y="45" width="16" height="5" rx="2" fill="#374151" /></svg>);

/* ── 4 Steps for Retain Rider ── */
const STEPS = [
  { n: 1, label: 'Rider Search', stat: 'Completed', state: 'done' },
  { n: 2, label: 'Rental Details', stat: 'In Progress', state: 'active' },
  { n: 3, label: 'Payment & Charges', stat: 'Pending', state: 'pend' },
  { n: 4, label: 'Review & Confirm', stat: 'Pending', state: 'pend' },
];
const ACCESSORIES = ['Helmet', 'Charger', 'Mobile Holder', 'Rain Cover'];

const VEHICLE_OPTIONS = [
  { id: 'EVM1024012', name: 'Evegah E1', img: '/City-1.png', status: 'Available' },
  { id: 'EV-CTY-098', name: 'Evegah City', img: '/City-2.png', status: 'Available' },
  { id: 'EV-PRO-102', name: 'Evegah Pro', img: '/City-3.png', status: 'Available' },
];

const BATTERY_OPTIONS = [
  { id: 'BAT-0098', name: 'Evegah 60V 30Ah Lithium-ion', img: '/ev_batttery.png' },
  { id: 'BAT-MNZ-001', name: 'Evegah 60V 32Ah Advanced', img: '/ev_batttery.png' },
];

const PLANS: Record<string, { label: string; rate: number; days: number }> = {
  daily: { label: 'Daily Plan', rate: 600, days: 1 },
  weekly: { label: 'Weekly Plan', rate: 2800, days: 7 },
  monthly: { label: 'Monthly Plan', rate: 7500, days: 30 },
};

export default function RetainRiderRentalPage() {
  const router = useRouter();
  const [rider, setRider] = useState<any>(null);
  const [selectedVehicle, setSelectedVehicle] = useState(VEHICLE_OPTIONS[0]);
  const [selectedBattery, setSelectedBattery] = useState(BATTERY_OPTIONS[0]);
  const [planKey, setPlanKey] = useState<'daily'|'weekly'|'monthly'>('daily');
  const [accessories, setAccessories] = useState([true, true, false, false]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('evegah_retain_rider');
        if (saved) {
          const parsed = JSON.parse(saved);
          setRider(parsed);
          if (parsed.vehicle_id) {
            const foundV = VEHICLE_OPTIONS.find(v => v.id === parsed.vehicle_id || v.name === parsed.vehicle);
            if (foundV) setSelectedVehicle(foundV);
          }
          if (parsed.battery_id) {
            const foundB = BATTERY_OPTIONS.find(b => b.id === parsed.battery_id);
            if (foundB) setSelectedBattery(foundB);
          }
        }
      } catch {}
    }
  }, []);

  const toggleAcc = (i: number) => setAccessories(p => { const a = [...p]; a[i] = !a[i]; return a; });

  const activePlan = PLANS[planKey];
  const rentPrice = activePlan.rate;
  const depositAmount = Number(rider?.deposit) || 500;
  const totalAmount = rentPrice + depositAmount;

  const handleContinue = () => {
    if (typeof window !== 'undefined') {
      const rentalData = {
        vehicle_code: selectedVehicle.id,
        vehicle_name: selectedVehicle.name,
        battery_id: selectedBattery.id,
        battery_name: selectedBattery.name,
        plan_type: activePlan.label,
        plan_rate: rentPrice,
        total_days: activePlan.days,
        deposit_amount: depositAmount,
        notes: notes,
        accessories: ACCESSORIES.filter((_, idx) => accessories[idx]),
      };
      localStorage.setItem('evegah_retain_rental', JSON.stringify(rentalData));
      // also seed evegah_new_ride_rental for backward compatibility
      localStorage.setItem('evegah_new_ride_rental', JSON.stringify(rentalData));
    }
    router.push('/retain-rider/payment');
  };

  const riderName = rider?.name || 'Devendra Rana';
  const riderPhone = rider?.phone || '+91 98255 44332';
  const riderId = rider?.id || 'EVR-16EFE6';
  const isFemale = riderName.toLowerCase().includes('priya') || riderName.toLowerCase().includes('kinjal') || riderName.toLowerCase().includes('neha');
  const avatarUrl = rider?.avatar || (isFemale ? '/priya_avatar.png' : '/rohit_avatar.png');

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="nr-shell">
        <Sidebar activePath="/retain-rider" />
        <div className="nr-main">
          <TopBar title="Retain Rider - Rental Details" subtitle="Select vehicle and configure the ride rental" />
          <div className="nr-page">
            <div className="nr-bc">
              <Link href="/">Home</Link><span className="nr-bc-sep">›</span>
              <a href="#">Rides / Rentals</a><span className="nr-bc-sep">›</span>
              <span className="nr-bc-cur">Retain Ride Registration</span>
            </div>
            <div className="nr-title-row">
              <div><h1 className="nr-h1">Retain Ride Registration</h1><p className="nr-sub">Configure vehicle and rental plan for returning rider</p></div>
              <Link href="/renters" className="nr-back-btn"><ILeft /> Back to Rides</Link>
            </div>
            <div className="nr-stepper">
              {STEPS.map((s, i) => (
                <div key={s.n} className="nr-step-wrap">
                  <div className="nr-step">
                    <div className={`nr-step-num ${s.state}`}>{s.state === 'done' ? <ICheck s={13} /> : s.n}</div>
                    <div>
                      <div className={`nr-step-label ${s.state === 'pend' ? 'pend' : ''}`}>{s.label}</div>
                      <div className={`nr-step-stat ${s.state}-s`}>{s.stat}</div>
                    </div>
                  </div>
                  {i < STEPS.length - 1 && <div className={`nr-step-line ${s.state === 'done' ? 'done-l' : ''}`} />}
                </div>
              ))}
            </div>
            <div className="nr-layout">
              <div>
                <div className="nr-card">
                  <div className="rr-rider-banner">
                    <div className="rr-banner-avatar" style={{ position: 'relative', overflow: 'hidden' }}>
                      <img
                        src={avatarUrl}
                        alt={riderName}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        onError={(e: any) => { e.currentTarget.style.display = 'none'; }}
                      />
                      <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 18, zIndex: 0 }}>
                        {riderName.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="rr-banner-name">{riderName}</div>
                      <div className="rr-banner-row"><IPhone /> {riderPhone}</div>
                      <div className="rr-banner-row"><IID /> Rider ID: {riderId}</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, marginLeft: 'auto' }}>
                      <span className="rr-kyc-badge"><ICheck s={11} /> Documents On File</span>
                      <span style={{ fontSize: 11, color: '#9CA3AF' }}>Returning Rider</span>
                    </div>
                  </div>
                  <div className="nr-card-body">
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 14 }}>Rental Configuration</div>
                    <div className="rr-form-grid">
                      <div className="rr-field">
                        <label className="rr-label">Ride Start Date &amp; Time <span>*</span></label>
                        <div className="rr-input-row">
                          <input className="rr-inp" style={{ flex: 1 }} defaultValue="Today, 10:00 AM" />
                        </div>
                      </div>
                      <div className="rr-field">
                        <label className="rr-label">Rental Package Plan <span>*</span></label>
                        <select
                          className="rr-inp rr-select"
                          value={planKey}
                          onChange={e => setPlanKey(e.target.value as any)}
                        >
                          <option value="daily">Daily Plan (1 Day) - ₹600</option>
                          <option value="weekly">Weekly Plan (7 Days) - ₹2,800</option>
                          <option value="monthly">Monthly Plan (30 Days) - ₹7,500</option>
                        </select>
                      </div>
                    </div>

                    <div className="rr-vb-grid">
                      <div className="rr-vb-card">
                        <div className="rr-vb-label">Assigned Vehicle <span>*</span></div>
                        <div className="rr-vb-inner">
                          <div className="rr-vb-img" style={{ background: '#fff', border: '1px solid #E2E8F0' }}>
                            <img src={selectedVehicle.img} alt={selectedVehicle.name} style={{ width: 52, height: 40, objectFit: 'contain' }} />
                          </div>
                          <div>
                            <div className="rr-vb-id">{selectedVehicle.id}</div>
                            <div className="rr-vb-name">{selectedVehicle.name}</div>
                            <span className="rr-avail-badge">Ready for Delivery</span>
                          </div>
                        </div>
                        <select
                          className="rr-inp rr-select"
                          style={{ marginTop: 4 }}
                          value={selectedVehicle.id}
                          onChange={e => {
                            const v = VEHICLE_OPTIONS.find(opt => opt.id === e.target.value);
                            if (v) setSelectedVehicle(v);
                          }}
                        >
                          {VEHICLE_OPTIONS.map(v => (
                            <option key={v.id} value={v.id}>{v.name} ({v.id})</option>
                          ))}
                        </select>
                      </div>

                      <div className="rr-vb-card">
                        <div className="rr-vb-label">Assigned Battery <span>*</span></div>
                        <div className="rr-vb-inner">
                          <div className="rr-vb-img" style={{ background: '#fff', border: '1px solid #E2E8F0' }}>
                            <img src={selectedBattery.img} alt={selectedBattery.name} style={{ width: 26, height: 40, objectFit: 'contain' }} />
                          </div>
                          <div>
                            <div className="rr-vb-id">{selectedBattery.id}</div>
                            <div className="rr-vb-name">{selectedBattery.name}</div>
                            <span className="rr-avail-badge">100% Charged</span>
                          </div>
                        </div>
                        <select
                          className="rr-inp rr-select"
                          style={{ marginTop: 4 }}
                          value={selectedBattery.id}
                          onChange={e => {
                            const b = BATTERY_OPTIONS.find(opt => opt.id === e.target.value);
                            if (b) setSelectedBattery(b);
                          }}
                        >
                          {BATTERY_OPTIONS.map(b => (
                            <option key={b.id} value={b.id}>{b.name} ({b.id})</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="rr-acc-box">
                      <div className="rr-acc-label">Included Accessories</div>
                      <div className="rr-acc-row">
                        {ACCESSORIES.map((a, i) => (
                          <div key={a} className="rr-acc-item" onClick={() => toggleAcc(i)}>
                            <div className={`rr-cb ${accessories[i] ? 'checked' : ''}`}>{accessories[i] && <ICheck s={11} />}</div>{a}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="rr-label" style={{ display: 'block', marginBottom: 6 }}>Additional Notes (Optional)</label>
                      <textarea className="rr-textarea" placeholder="Enter notes for this retain ride..." maxLength={200} value={notes} onChange={e => setNotes(e.target.value)} />
                      <div className="rr-char-count">{notes.length} / 200</div>
                    </div>
                  </div>
                </div>

                <div className="nr-footer-card">
                  <Link href="/retain-rider" className="nr-cancel-btn" style={{ textDecoration: 'none' }}>
                    <ILeft /> Back to Search
                  </Link>
                  <button className="nr-continue-btn" onClick={handleContinue}>
                    Save &amp; Continue <IArr s={12} />
                  </button>
                </div>
              </div>

              <div className="nr-rp">
                <div className="nr-rp-card">
                  <div className="nr-rp-hdr"><span className="nr-rp-hdr-ic" style={{ color: '#2A195C' }}><IReceipt /></span><div className="nr-rp-title">Rental Summary</div></div>
                  <div className="nr-rp-body">
                    <div className="nr-rp-avatar-row">
                      <div className="nr-rp-avatar" style={{ position: 'relative', overflow: 'hidden' }}>
                        <img
                          src={avatarUrl}
                          alt={riderName}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                          onError={(e: any) => { e.currentTarget.style.display = 'none'; }}
                        />
                        <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 14, zIndex: 0 }}>
                          {riderName.slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div><div className="nr-rp-name">{riderName}</div><div className="nr-rp-sub">{riderPhone}</div></div>
                    </div>
                    {[
                      { l: 'Rider ID', v: riderId },
                      { l: 'KYC Status', v: <span className="nr-rp-kyc">Verified On File</span> },
                      { l: 'Vehicle', v: `${selectedVehicle.name} (${selectedVehicle.id})` },
                      { l: 'Battery', v: selectedBattery.id },
                      { l: 'Plan Rate', v: `₹${rentPrice.toFixed(2)}` },
                      { l: 'Security Deposit', v: `₹${depositAmount.toFixed(2)}` },
                    ].map(r => (
                      <div key={r.l} className="nr-rp-row">
                        <span className="nr-rp-label">{r.l}</span>
                        <span className="nr-rp-val">{r.v}</span>
                      </div>
                    ))}
                    <div className="nr-rp-divider" />
                    <div className="nr-rp-total">
                      <span className="nr-rp-total-l">Est. Total (Zero GST)</span>
                      <span className="nr-rp-total-r">₹{totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <div className="nr-tips-card">
                  <div className="nr-tips-hdr"><span style={{ color: '#D97706', display: 'flex' }}><IBulb /></span><div style={{ fontSize: '13.5px', fontWeight: 700, color: '#92400E' }}>Tips</div></div>
                  <div className="nr-tips-body">
                    {['Vehicle and battery are synced with active zone inventory.', 'Security Deposit is 100% refundable upon vehicle return.', 'Returning riders do not need to re-upload identity documents.'].map((t, i) => (
                      <div key={i} className="nr-tip-row"><div className="nr-tip-dot" />{t}</div>
                    ))}
                  </div>
                </div>
                <div className="nr-rp-card">
                  <div className="nr-rp-hdr"><span className="nr-rp-hdr-ic" style={{ color: '#2A195C' }}><IUser /></span><div className="nr-rp-title">Need Help?</div></div>
                  <div className="nr-help-body"><div className="nr-help-sub">Facing issues in selecting vehicle or battery?</div><button className="nr-help-btn">Contact Support</button></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
