"use client";
import { useState, useMemo } from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.bs-shell { display: flex; min-height: 100vh; background: #F8F9FF; font-family: 'Inter', sans-serif; }
.bs-main { margin-left: 230px; display: flex; flex-direction: column; min-height: 100vh; width: calc(100% - 230px); }

/* ── Content Wrap ── */
.bs-content-wrap { display: grid; grid-template-columns: 1fr 340px; gap: 24px; padding: 24px; flex: 1; }
.bs-left-col { display: flex; flex-direction: column; gap: 24px; }
.bs-right-col { display: flex; flex-direction: column; gap: 24px; }

/* ── Card Styling ── */
.bs-card { background: #FFF; border: 1px solid #E2E8F0; border-radius: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.02); padding: 24px; display: flex; flex-direction: column; gap: 20px; }
.bs-card-title { font-size: 15px; font-weight: 800; color: #0F172A; margin: 0; }
.bs-card-sub { font-size: 12.5px; color: #64748B; margin-top: 2px; }

/* ── Form Section ── */
.bs-form-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.bs-form-field { display: flex; flex-direction: column; gap: 6px; }
.bs-form-lbl { font-size: 12.5px; font-weight: 700; color: #475569; }
.bs-inp { width: 100%; padding: 10px 12px; border: 1.5px solid #E2E8F0; border-radius: 8px; font-size: 13px; outline: none; background: #fff; color: #334155; transition: border-color .15s; font-weight: 500; }
.bs-inp:focus { border-color: #2a195c; box-shadow: 0 0 0 1px #2a195c; }
.bs-select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748B' stroke-width='2.5'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' /%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; background-size: 11px; padding-right: 32px; cursor: pointer; }

/* Dropdown specific highlights */
.bs-inp.remove-active { border-color: #FCA5A5; color: #B91C1C; background: #FEF2F2; font-weight: 700; }
.bs-inp.add-active { border-color: #A7F3D0; color: #047857; background: #F0FDF4; font-weight: 700; }

.bs-notes-row { display: flex; gap: 16px; align-items: flex-end; }
.bs-notes-field { flex: 1; display: flex; flex-direction: column; gap: 6px; }
.bs-notes-input { width: 100%; padding: 10px 12px; border: 1.5px solid #E2E8F0; border-radius: 8px; font-size: 13px; outline: none; background: #fff; color: #334155; font-family: inherit; }
.bs-notes-input:focus { border-color: #2a195c; }
.bs-btn-save { padding: 10px 24px; background: #2a195c; color: #FFF; border: none; border-radius: 8px; font-size: 13px; font-weight: 700; cursor: pointer; transition: background 0.15s; height: 38px; display: flex; align-items: center; justify-content: center; white-space: nowrap; }
.bs-btn-save:hover { background: #4338CA; }

/* ── Comparison Widget ── */
.bs-comparison-row { display: flex; align-items: center; justify-content: space-between; position: relative; }
.bs-comp-card { flex: 1; border-radius: 12px; padding: 20px; display: flex; flex-direction: column; gap: 14px; position: relative; min-height: 220px; }
.bs-comp-card.removed { background: #FFF8F8; border: 1px solid #FEE2E2; }
.bs-comp-card.added { background: #F8FDF9; border: 1px solid #E8F5E9; }

.bs-comp-hdr { display: flex; align-items: center; gap: 8px; font-size: 13.5px; font-weight: 700; }
.bs-comp-hdr.removed { color: #B91C1C; }
.bs-comp-hdr.added { color: #047857; }
.bs-dot { width: 8px; height: 8px; border-radius: 50%; }
.bs-dot.red { background: #EF4444; color: #fff; }
.bs-dot.green { background: #10B981; color: #fff; }

.bs-comp-list { display: flex; flex-direction: column; gap: 12px; }
.bs-comp-item { display: flex; align-items: center; font-size: 13px; line-height: 1.5; }
.bs-comp-lbl { color: #64748B; width: 110px; font-weight: 500; }
.bs-comp-val { color: #0F172A; font-weight: 700; width: 60px; }
.bs-comp-progress-wrap { flex: 1; display: flex; align-items: center; }
.bs-progress-track { height: 6px; width: 120px; background: #E2E8F0; border-radius: 3px; overflow: hidden; }
.bs-progress-fill { height: 100%; border-radius: 3px; }
.bs-progress-fill.red { background: #EF4444; color: #fff; }
.bs-progress-fill.orange { background: #F97316; color: #fff; }
.bs-progress-fill.green { background: #10B981; color: #fff; }

.bs-comp-badge { font-size: 11px; font-weight: 700; padding: 4px 8px; border-radius: 4px; align-self: flex-start; margin-top: auto; }
.bs-comp-badge.red { background: #EF4444; color: #fff; }
.bs-comp-badge.green { background: #10B981; color: #fff; }

.bs-exchange-circle { width: 44px; height: 44px; background: #FFF; border: 1px solid #E2E8F0; box-shadow: 0 4px 12px rgba(0,0,0,0.06); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #2a195c; z-index: 10; margin: 0 -22px; flex-shrink: 0; cursor: pointer; transition: transform 0.2s; }
.bs-exchange-circle:hover { transform: rotate(180deg); }

/* ── Select New Battery Table ── */
.bs-table-hdr-row { display: flex; align-items: center; justify-content: space-between; border-bottom: 1.5px solid #F1F5F9; padding-bottom: 14px; margin-bottom: 14px; }
.bs-table-title { font-size: 15px; font-weight: 800; color: #0F172A; }
.bs-table-actions { display: flex; gap: 8px; align-items: center; }
.bs-table-search-wrap { display: flex; align-items: center; border: 1px solid #E2E8F0; border-radius: 8px; padding: 6px 12px; gap: 6px; background: #FFF; width: 220px; }
.bs-table-search-inp { border: none; outline: none; font-size: 12.5px; color: #1E293B; width: 100%; }
.bs-table-filter-btn { border: 1px solid #E2E8F0; background: #FFF; border-radius: 8px; padding: 6px 12px; display: flex; align-items: center; gap: 6px; font-size: 12.5px; color: #475569; font-weight: 600; cursor: pointer; }

.bs-table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
.bs-table th { font-size: 11px; font-weight: 700; color: #94A3B8; text-transform: uppercase; letter-spacing: .05em; text-align: left; padding: 10px 16px; background: #FFF; border-bottom: 1.5px solid #E2E8F0; }
.bs-table td { padding: 12px 16px; font-size: 13px; color: #334155; border-bottom: 1px solid #F1F5F9; vertical-align: middle; }
.bs-table tr.selected { background: #F0FDF4; }
.bs-table tr.selected td { border-bottom-color: #DCFCE7; }

.bs-radio-btn { width: 16px; height: 16px; border-radius: 50%; border: 1.5px solid #CBD5E1; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.15s; }
.bs-radio-btn.selected { border-color: #16A34A; background: #16A34A; color: #FFF; }
.bs-radio-btn-dot { width: 6px; height: 6px; background: #FFF; border-radius: 50%; }

.bs-battery-badge { display: flex; align-items: center; gap: 6px; font-weight: 600; }
.bs-battery-badge.green { background: #10B981; color: #fff; }
.bs-shield-badge { display: flex; align-items: center; gap: 4px; font-weight: 600; color: #16A34A; }

.bs-status-badge { display: inline-flex; align-items: center; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: 700; }
.bs-status-badge.green { background: #10B981; color: #fff; }

.bs-select-btn { border: 1.5px solid #E2E8F0; background: #FFF; border-radius: 6px; padding: 6px 16px; font-size: 12px; font-weight: 700; color: #2a195c; cursor: pointer; transition: all 0.15s; min-width: 80px; text-align: center; }
.bs-select-btn.selected { background: #FAF5FF; border-color: #E9D5FF; color: #2A195C; cursor: default; }
.bs-select-btn:hover:not(.selected) { border-color: #2a195c; background: #F8FAFC; }

.bs-table-ft { display: flex; align-items: center; justify-content: space-between; }
.bs-table-ft-lbl { font-size: 12px; color: #94A3B8; }
.bs-pagination { display: flex; align-items: center; gap: 4px; }
.bs-pag-btn { width: 28px; height: 28px; border: 1px solid #E2E8F0; border-radius: 6px; background: #FFF; font-size: 12px; font-weight: 600; color: #64748B; display: flex; align-items: center; justify-content: center; cursor: pointer; }
.bs-pag-btn.active { background: #2a195c; color: #FFF; border-color: #2a195c; }
.bs-pag-btn:disabled { opacity: 0.5; cursor: not-allowed; }

/* ── Bottom Buttons ── */
.bs-bottom-actions { display: flex; justify-content: space-between; margin-top: 12px; }
.bs-btn-outline { border: 1.5px solid #CBD5E1; background: #FFF; border-radius: 8px; padding: 12px 24px; font-size: 13.5px; font-weight: 700; color: #475569; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.15s; }
.bs-btn-outline:hover { background: #F8FAFC; border-color: #94A3B8; }
.bs-btn-primary { background: #2a195c; color: #FFF; border: none; border-radius: 8px; padding: 12px 24px; font-size: 13.5px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: background 0.15s; }
.bs-btn-primary:hover { background: #4338CA; }

/* ── Right Panel Summaries ── */
.bs-summary-card { background: #FFF; border: 1px solid #E2E8F0; border-radius: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.02); padding: 20px; display: flex; flex-direction: column; gap: 16px; }
.bs-summary-hdr { display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 800; color: #2a195c; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1.5px solid #F1F5F9; padding-bottom: 12px; }
.bs-summary-body { display: flex; flex-direction: column; gap: 12px; }
.bs-summary-row { display: flex; justify-content: space-between; align-items: flex-start; font-size: 13px; }
.bs-summary-lbl { color: #64748B; font-weight: 500; }
.bs-summary-val { color: #0F172A; font-weight: 700; text-align: right; }
.bs-summary-val.battery-low { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
.bs-low-indicator { display: flex; align-items: center; gap: 4px; font-size: 11px; color: #EF4444; font-weight: 700; }

/* ── Payment Details ── */
.bs-pay-title-sec { font-size: 24px; font-weight: 900; color: #2a195c; margin: 4px 0 12px; letter-spacing: -0.5px; }
.bs-pay-methods { display: flex; flex-direction: column; gap: 10px; margin-top: 8px; }
.bs-pay-method-card { border: 1.5px solid #E2E8F0; border-radius: 10px; padding: 12px 14px; display: flex; align-items: center; gap: 10px; background: #FFF; cursor: pointer; transition: all 0.15s; }
.bs-pay-method-card.active { border-color: #2A195C; background: #FAF5FF; }
.bs-pay-method-text { font-size: 13px; font-weight: 700; color: #1E293B; }
.bs-pay-radio { width: 16px; height: 16px; border-radius: 50%; border: 1.5px solid #CBD5E1; display: flex; align-items: center; justify-content: center; margin-left: auto; }
.bs-pay-radio.active { border-color: #2A195C; background: #2A195C; }
.bs-pay-radio-dot { width: 6px; height: 6px; background: #FFF; border-radius: 50%; }

/* QR Scan Code Block */
.bs-qr-container { border: 1.5px solid #E9D5FF; border-radius: 12px; padding: 20px; display: flex; flex-direction: column; align-items: center; gap: 12px; background: #FFF; margin-top: 16px; }
.bs-qr-text { font-size: 10.5px; font-weight: 800; color: #2a195c; text-transform: uppercase; letter-spacing: 0.05em; text-align: center; }
.bs-qr-box { width: 140px; height: 140px; border: 1.5px solid #E2E8F0; padding: 8px; border-radius: 8px; display: flex; align-items: center; justify-content: center; position: relative; background: #FFF; }
.bs-qr-logo-center { position: absolute; width: 26px; height: 26px; background: #FFF; border-radius: 4px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
.bs-qr-id { font-size: 11px; font-weight: 700; color: #475569; letter-spacing: 0.5px; }

/* Provider logos */
.bs-providers-row { display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 4px; width: 100%; flex-wrap: wrap; }
.bs-provider-tag { font-size: 8.5px; font-weight: 800; padding: 2px 5px; border-radius: 4px; border: 1px solid #E2E8F0; color: #475569; text-transform: uppercase; }
.bs-provider-tag.gpay { color: #4285F4; border-color: #D2E3FC; background: #E8F0FE; text-transform: none; font-weight: 700; }
.bs-provider-tag.phonepe { color: #5F259F; border-color: #E8DAF5; background: #F3ECF9; text-transform: none; }
.bs-provider-tag.paytm { color: #002970; border-color: #CCEFFF; background: #E6F7FF; text-transform: none; font-weight: 900; }
.bs-provider-tag.bhim { color: #F2A900; border-color: #FFF3D6; background: #FFFBF0; }
.bs-provider-tag.upi { color: #0A5F38; border-color: #D1E7DD; background: #E2F0D9; font-weight: 900; }

/* ── Coupon Styling ── */
.bs-coupon-input { flex: 1; padding: 8px 12px; border: 1.5px solid #E2E8F0; border-radius: 8px; font-size: 12.5px; outline: none; }
.bs-coupon-input:focus { border-color: #2a195c; }
.bs-coupon-btn { padding: 8px 16px; background: #fff; border: 1.5px solid #2a195c; border-radius: 8px; font-size: 12.5px; font-weight: 700; color: #2a195c; cursor: pointer; transition: all 0.15s; }
.bs-coupon-btn:hover { background: #2a195c; color: #fff; }
`;

interface RiderData {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
  removedBattery: {
    id: string;
    charge: number;
    health: number;
    cycles: number;
    range: number;
  };
}

const RIDERS: Record<string, RiderData> = {
  "Amit Kumar": {
    id: "RIDER-001",
    name: "Amit Kumar",
    phone: "+91 9876543210",
    vehicle: "Ola S1 Pro (EVM1024012)",
    removedBattery: { id: "BAT-0098", charge: 18, health: 82, cycles: 212, range: 12 }
  },
  "Rohit Singh": {
    id: "RIDER-002",
    name: "Rohit Singh",
    phone: "+91 9987654321",
    vehicle: "Ola S1 Pro (EVM1023258)",
    removedBattery: { id: "BAT-0076", charge: 22, health: 91, cycles: 156, range: 15 }
  },
  "Neha Patel": {
    id: "RIDER-003",
    name: "Neha Patel",
    phone: "+91 9125456789",
    vehicle: "Ather 450X (EVM1021123)",
    removedBattery: { id: "BAT-0064", charge: 15, health: 85, cycles: 198, range: 10 }
  }
};

interface BatteryData {
  id: string;
  soc: number;
  health: number;
  cycles: number;
  range: number;
  status: string;
}

const BATTERIES: BatteryData[] = [
  { id: "BAT-0199", soc: 100, health: 96, cycles: 98, range: 60, status: "Available" },
  { id: "BAT-0200", soc: 98, health: 95, cycles: 105, range: 58, status: "Available" },
  { id: "BAT-0201", soc: 99, health: 94, cycles: 110, range: 59, status: "Available" },
  { id: "BAT-0202", soc: 97, health: 92, cycles: 101, range: 57, status: "Available" },
];

/* ── Vector Icons ── */
const ISearch = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const IFunnel = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

const IBatteryCharge = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="6" width="18" height="12" rx="2" />
    <line x1="23" y1="13" x2="23" y2="11" />
    <line x1="6" y1="12" x2="14" y2="12" />
  </svg>
);

const ICheckShield = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 11 11 13 15 9" />
  </svg>
);

const IDoc = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

const ICard = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2" ry="2" />
    <line x1="2" y1="10" x2="22" y2="10" />
  </svg>
);

const ICancel = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const IExchange = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l.56-.56" />
    <polyline points="17 14 11 20 5 14" />
  </svg>
);

const IQrCode = () => (
  <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor">
    {/* Outer corners */}
    <rect x="1" y="1" width="7" height="7" fill="none" stroke="currentColor" strokeWidth="2" />
    <rect x="3" y="3" width="3" height="3" />
    <rect x="16" y="1" width="7" height="7" fill="none" stroke="currentColor" strokeWidth="2" />
    <rect x="18" y="3" width="3" height="3" />
    <rect x="1" y="16" width="7" height="7" fill="none" stroke="currentColor" strokeWidth="2" />
    <rect x="3" y="18" width="3" height="3" />
    
    {/* Random QR code pixels */}
    <rect x="10" y="1" width="2" height="2" />
    <rect x="13" y="3" width="2" height="2" />
    <rect x="10" y="6" width="4" height="2" />
    
    <rect x="2" y="10" width="2" height="4" />
    <rect x="6" y="10" width="2" height="2" />
    <rect x="10" y="10" width="4" height="4" />
    <rect x="16" y="10" width="2" height="2" />
    <rect x="20" y="10" width="2" height="4" />
    
    <rect x="10" y="16" width="2" height="4" />
    <rect x="13" y="18" width="2" height="4" />
    <rect x="16" y="16" width="4" height="2" />
    <rect x="18" y="20" width="4" height="2" />
    
    {/* Center clear area for logo */}
    <rect x="9" y="9" width="6" height="6" fill="#FFF" />
  </svg>
);

export default function BatterySwapPage() {
  const [selectedRiderName, setSelectedRiderName] = useState<string>('Amit Kumar');
  const [vehicleNo, setVehicleNo] = useState<string>('Ola S1 Pro (EVM1024012)');
  const [batteryRemove, setBatteryRemove] = useState<string>('BAT-0098 (18%)');
  const [batteryAdd, setBatteryAdd] = useState<string>('BAT-0199 (100% Charged)');
  const [notes, setNotes] = useState<string>('');
  
  // Selected Battery from Table
  const [selectedBatteryId, setSelectedBatteryId] = useState<string>('BAT-0199');
  const [paymentMode, setPaymentMode] = useState<string>('UPI');

  // Coupon states
  const [couponCode, setCouponCode] = useState<string>('');
  const [discount, setDiscount] = useState<number>(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string>('');
  const [couponError, setCouponError] = useState<string>('');

  const selectedRider: RiderData = RIDERS[selectedRiderName] || RIDERS["Amit Kumar"];

  // Bidirectional link: table selection updates Added Card and Form Add select box
  const selectedBattery = useMemo(() => {
    return BATTERIES.find(b => b.id === selectedBatteryId) || BATTERIES[0];
  }, [selectedBatteryId]);

  // Handle Select Rider
  const handleRiderSelect = (name: string) => {
    setSelectedRiderName(name);
    const rider = RIDERS[name];
    if (rider) {
      setVehicleNo(rider.vehicle);
      setBatteryRemove(`${rider.removedBattery.id} (${rider.removedBattery.charge}%)`);
    }
  };

  // Handle Battery Add dropdown select (updates table state bidirectionally)
  const handleBatteryAddChange = (val: string) => {
    setBatteryAdd(val);
    const idMatch = val.match(/BAT-\d+/);
    if (idMatch) {
      setSelectedBatteryId(idMatch[0]);
    }
  };

  // Handle Select Battery from Table (updates dropdown value bidirectionally)
  const handleSelectBatteryFromTable = (id: string) => {
    setSelectedBatteryId(id);
    const bat = BATTERIES.find(b => b.id === id);
    if (bat) {
      setBatteryAdd(`${bat.id} (${bat.soc}% Charged)`);
    }
  };

  const handleApplyCoupon = () => {
    setCouponError('');
    const code = couponCode.trim().toUpperCase();
    if (code === 'SWAP10') {
      setDiscount(10);
      setAppliedCoupon('SWAP10');
    } else if (code === 'EVEGAH20') {
      setDiscount(20);
      setAppliedCoupon('EVEGAH20');
    } else if (code === '') {
      setDiscount(0);
      setAppliedCoupon('');
    } else {
      setDiscount(0);
      setAppliedCoupon('');
      setCouponError('Invalid coupon code');
    }
  };

  const handleSaveSwap = () => {
    alert(`Rider battery swap saved for ${selectedRiderName}!`);
  };

  const handleProceedPayment = () => {
    const finalAmount = 80 - discount;
    alert(`Battery swap payment of ₹${finalAmount.toFixed(2)} completed successfully via ${paymentMode}!`);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="bs-shell">
        
        {/* Navigation Sidebar */}
        <Sidebar activePath="/battery-swap" />

        <div className="bs-main">
          
          {/* Header Bar */}
          <TopBar 
            title="Battery Swap" 
            subtitle="Complete your battery swap and payment" 
            showSearch={true}
            searchPlaceholder="Search by rider name, mobile, vehicle or booking ID..."
            notificationCount={6}
            userName="Priya Sharma"
            userRole="Employee"
            userAvatar="/priya_avatar.png"
            hideZone={true}
            hideLeftAvatar={true}
            showHand={false}
          />

          {/* Double Column Page Content */}
          <div className="bs-content-wrap">
            
            {/* Left Column (Forms, Comparisons, Table) */}
            <div className="bs-left-col">
              
              {/* Form Card: Rider & Vehicle Details */}
              <div className="bs-card">
                <h2 className="bs-card-title">Rider &amp; Vehicle Details</h2>
                
                <div className="bs-form-grid">
                  {/* Select Rider */}
                  <div className="bs-form-field">
                    <label className="bs-form-lbl">Select Rider *</label>
                    <select 
                      className="bs-inp bs-select"
                      value={selectedRiderName}
                      onChange={(e) => handleRiderSelect(e.target.value)}
                    >
                      <option value="Amit Kumar">Amit Kumar (+91 9876543210)</option>
                      <option value="Rohit Singh">Rohit Singh (+91 9987654321)</option>
                      <option value="Neha Patel">Neha Patel (+91 9125456789)</option>
                    </select>
                  </div>

                  {/* Vehicle Number */}
                  <div className="bs-form-field">
                    <label className="bs-form-lbl">Vehicle Number *</label>
                    <select 
                      className="bs-inp bs-select"
                      value={vehicleNo}
                      onChange={(e) => setVehicleNo(e.target.value)}
                    >
                      <option value={selectedRider.vehicle}>{selectedRider.vehicle}</option>
                    </select>
                  </div>

                  {/* Battery REMOVE dropdown (red highlights) */}
                  <div className="bs-form-field">
                    <label className="bs-form-lbl">Battery REMOVE *</label>
                    <select 
                      className="bs-inp bs-select remove-active"
                      value={batteryRemove}
                      onChange={(e) => setBatteryRemove(e.target.value)}
                    >
                      <option value={`${selectedRider.removedBattery.id} (${selectedRider.removedBattery.charge}%)`}>
                        {selectedRider.removedBattery.id} ({selectedRider.removedBattery.charge}%)
                      </option>
                    </select>
                  </div>

                  {/* Battery ADD dropdown (green highlights) */}
                  <div className="bs-form-field">
                    <label className="bs-form-lbl">Battery ADD *</label>
                    <select 
                      className="bs-inp bs-select add-active"
                      value={batteryAdd}
                      onChange={(e) => handleBatteryAddChange(e.target.value)}
                    >
                      <option value="BAT-0199 (100% Charged)">BAT-0199 (100% Charged)</option>
                      <option value="BAT-0200 (98% Charged)">BAT-0200 (98% Charged)</option>
                      <option value="BAT-0201 (99% Charged)">BAT-0201 (99% Charged)</option>
                      <option value="BAT-0202 (97% Charged)">BAT-0202 (97% Charged)</option>
                    </select>
                  </div>
                </div>

                {/* Notes and Save Swap Inline Row */}
                <div className="bs-notes-row">
                  <div className="bs-notes-field">
                    <label className="bs-form-lbl">Notes (Optional)</label>
                    <input 
                      type="text"
                      className="bs-notes-input"
                      placeholder="Type any notes here..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                  <button className="bs-btn-save" onClick={handleSaveSwap}>Save Swap</button>
                </div>
              </div>

              {/* Side-by-Side Comparison Widget */}
              <div className="bs-comparison-row">
                
                {/* Battery Removed Card */}
                <div className="bs-comp-card removed">
                  <div className="bs-comp-hdr removed">
                    <span className="bs-dot red" />
                    <span>Battery Removed</span>
                    <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 'normal' }}>(To be Returned)</span>
                  </div>
                  
                  <div className="bs-comp-list">
                    <div className="bs-comp-item">
                      <span className="bs-comp-lbl">Battery ID</span>
                      <span className="bs-comp-val">{selectedRider.removedBattery.id}</span>
                    </div>
                    <div className="bs-comp-item">
                      <span className="bs-comp-lbl">Charge (SOC)</span>
                      <span className="bs-comp-val">{selectedRider.removedBattery.charge}%</span>
                      <div className="bs-comp-progress-wrap">
                        <div className="bs-progress-track">
                          <div className="bs-progress-fill red" style={{ width: `${selectedRider.removedBattery.charge}%` }} />
                        </div>
                      </div>
                    </div>
                    <div className="bs-comp-item">
                      <span className="bs-comp-lbl">Health</span>
                      <span className="bs-comp-val">{selectedRider.removedBattery.health}%</span>
                      <div className="bs-comp-progress-wrap">
                        <div className="bs-progress-track">
                          <div className="bs-progress-fill orange" style={{ width: `${selectedRider.removedBattery.health}%` }} />
                        </div>
                      </div>
                    </div>
                    <div className="bs-comp-item">
                      <span className="bs-comp-lbl">Cycles</span>
                      <span className="bs-comp-val">{selectedRider.removedBattery.cycles}</span>
                    </div>
                    <div className="bs-comp-item">
                      <span className="bs-comp-lbl">Est. Range</span>
                      <span className="bs-comp-val">{selectedRider.removedBattery.range} km</span>
                    </div>
                  </div>

                  <span className="bs-comp-badge red">Low Battery</span>
                </div>

                {/* Overlapping Exchange Icon */}
                <div className="bs-exchange-circle">
                  <IExchange />
                </div>

                {/* Battery Added Card */}
                <div className="bs-comp-card added">
                  <div className="bs-comp-hdr added">
                    <span className="bs-dot green" />
                    <span>Battery Added</span>
                    <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 'normal' }}>(Provided)</span>
                  </div>
                  
                  <div className="bs-comp-list">
                    <div className="bs-comp-item">
                      <span className="bs-comp-lbl">Battery ID</span>
                      <span className="bs-comp-val">{selectedBattery.id}</span>
                    </div>
                    <div className="bs-comp-item">
                      <span className="bs-comp-lbl">Charge (SOC)</span>
                      <span className="bs-comp-val">{selectedBattery.soc}%</span>
                      <div className="bs-comp-progress-wrap">
                        <div className="bs-progress-track">
                          <div className="bs-progress-fill green" style={{ width: `${selectedBattery.soc}%` }} />
                        </div>
                      </div>
                    </div>
                    <div className="bs-comp-item">
                      <span className="bs-comp-lbl">Health</span>
                      <span className="bs-comp-val">{selectedBattery.health}%</span>
                      <div className="bs-comp-progress-wrap">
                        <div className="bs-progress-track">
                          <div className="bs-progress-fill green" style={{ width: `${selectedBattery.health}%` }} />
                        </div>
                      </div>
                    </div>
                    <div className="bs-comp-item">
                      <span className="bs-comp-lbl">Cycles</span>
                      <span className="bs-comp-val">{selectedBattery.cycles}</span>
                    </div>
                    <div className="bs-comp-item">
                      <span className="bs-comp-lbl">Est. Range</span>
                      <span className="bs-comp-val">{selectedBattery.range} km</span>
                    </div>
                  </div>

                  <span className="bs-comp-badge green">Fully Charged</span>
                </div>
              </div>

              {/* Table Card: Select New Battery */}
              <div className="bs-card">
                <div className="bs-table-hdr-row">
                  <h3 className="bs-table-title">Select New Battery</h3>
                  
                  <div className="bs-table-actions">
                    <div className="bs-table-search-wrap">
                      <ISearch />
                      <input type="text" className="bs-table-search-inp" placeholder="Search battery ID..." />
                    </div>
                    <button className="bs-table-filter-btn">
                      <IFunnel />
                      <span>Filter</span>
                    </button>
                  </div>
                </div>

                <table className="bs-table">
                  <thead>
                    <tr>
                      <th style={{ width: '40px' }} />
                      <th>Battery ID</th>
                      <th>SOC (Charge)</th>
                      <th>Health</th>
                      <th>Cycles</th>
                      <th>Est. Range</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {BATTERIES.map((bat) => {
                      const isSelected = selectedBatteryId === bat.id;
                      return (
                        <tr key={bat.id} className={isSelected ? 'selected' : ''}>
                          <td>
                            <div 
                              className={`bs-radio-btn ${isSelected ? 'selected' : ''}`}
                              onClick={() => handleSelectBatteryFromTable(bat.id)}
                            >
                              {isSelected && <span className="bs-radio-btn-dot" />}
                            </div>
                          </td>
                          <td style={{ fontWeight: 700 }}>{bat.id}</td>
                          <td>
                            <div className="bs-battery-badge green">
                              <IBatteryCharge />
                              <span>{bat.soc}%</span>
                            </div>
                          </td>
                          <td>
                            <div className="bs-shield-badge">
                              <ICheckShield />
                              <span>{bat.health}%</span>
                            </div>
                          </td>
                          <td>{bat.cycles}</td>
                          <td>{bat.range} km</td>
                          <td>
                            <span className="bs-status-badge green">{bat.status}</span>
                          </td>
                          <td>
                            <button 
                              className={`bs-select-btn ${isSelected ? 'selected' : ''}`}
                              onClick={() => handleSelectBatteryFromTable(bat.id)}
                            >
                              {isSelected ? 'Selected' : 'Select'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* Table Footer / Pagination */}
                <div className="bs-table-ft">
                  <span className="bs-table-ft-lbl">Showing 1 to 4 of 24 batteries</span>
                  
                  <div className="bs-pagination">
                    <button className="bs-pag-btn" disabled>&lt;</button>
                    <button className="bs-pag-btn active">1</button>
                    <button className="bs-pag-btn">2</button>
                    <button className="bs-pag-btn">3</button>
                    <span style={{ margin: '0 4px', color: '#94A3B8', fontSize: '12.5px', fontWeight: 'bold' }}>...</span>
                    <button className="bs-pag-btn">6</button>
                    <button className="bs-pag-btn">&gt;</button>
                  </div>
                </div>
              </div>

              {/* Bottom Buttons Action Row */}
              <div className="bs-bottom-actions">
                <button className="bs-btn-outline">
                  <ICancel />
                  <span>Cancel Swap</span>
                </button>
                <button className="bs-btn-primary" onClick={handleProceedPayment}>
                  <span>Proceed to Payment</span>
                  <IArrowRight />
                </button>
              </div>

            </div>

            {/* Right Column (Summary & Payment Blocks) */}
            <div className="bs-right-col">
              
              {/* Swap Summary */}
              <div className="bs-summary-card">
                <div className="bs-summary-hdr">
                  <IDoc />
                  <span>Swap Summary</span>
                </div>
                
                <div className="bs-summary-body">
                  <div className="bs-summary-row">
                    <span className="bs-summary-lbl">Swap Reason</span>
                    <div className="bs-summary-val battery-low">
                      <span>Battery Low</span>
                      <div className="bs-low-indicator">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <rect x="2" y="7" width="16" height="10" rx="2" />
                          <line x1="22" y1="11" x2="22" y2="13" />
                        </svg>
                        <span>18%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bs-summary-row">
                    <span className="bs-summary-lbl">Swap Station</span>
                    <span className="bs-summary-val">Akota EV Zone</span>
                  </div>

                  <div className="bs-summary-row">
                    <span className="bs-summary-lbl">Swap Fee</span>
                    <span className="bs-summary-val">₹{(80 - discount).toFixed(2)}</span>
                  </div>

                  <div className="bs-summary-row">
                    <span className="bs-summary-lbl">Swap Date &amp; Time</span>
                    <span className="bs-summary-val">May 16, 2024, 10:45 AM</span>
                  </div>

                  <div className="bs-summary-row">
                    <span className="bs-summary-lbl">Performed By</span>
                    <span className="bs-summary-val">Priya Sharma</span>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="bs-summary-card">
                <div className="bs-summary-hdr">
                  <ICard />
                  <span>Payment Details</span>
                </div>
                
                <div className="bs-summary-body" style={{ gap: '4px' }}>
                  <span className="bs-summary-lbl" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Amount to Pay</span>
                  <div className="bs-pay-title-sec">₹{(80 - discount).toFixed(2)}</div>
                </div>

                <div className="bs-summary-body">
                  <span className="bs-summary-lbl" style={{ fontWeight: '700', color: '#1E293B', fontSize: '13px' }}>Select Payment Method</span>
                  
                  <div className="bs-pay-methods">
                    {/* UPI Scan & Pay */}
                    <div 
                      className={`bs-pay-method-card ${paymentMode === 'UPI' ? 'active' : ''}`}
                      onClick={() => setPaymentMode('UPI')}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2A195C" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                      <span className="bs-pay-method-text">UPI (Scan &amp; Pay)</span>
                      <div className={`bs-pay-radio ${paymentMode === 'UPI' ? 'active' : ''}`}>
                        {paymentMode === 'UPI' && <span className="bs-pay-radio-dot" />}
                      </div>
                    </div>

                    {/* Cash */}
                    <div 
                      className={`bs-pay-method-card ${paymentMode === 'Cash' ? 'active' : ''}`}
                      onClick={() => setPaymentMode('Cash')}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.5"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/></svg>
                      <span className="bs-pay-method-text">Cash</span>
                      <div className={`bs-pay-radio ${paymentMode === 'Cash' ? 'active' : ''}`}>
                        {paymentMode === 'Cash' && <span className="bs-pay-radio-dot" />}
                      </div>
                    </div>

                    {/* Debit/Credit Card */}
                    <div 
                      className={`bs-pay-method-card ${paymentMode === 'Card' ? 'active' : ''}`}
                      onClick={() => setPaymentMode('Card')}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.5"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
                      <span className="bs-pay-method-text">Debit / Credit Card</span>
                      <div className={`bs-pay-radio ${paymentMode === 'Card' ? 'active' : ''}`}>
                        {paymentMode === 'Card' && <span className="bs-pay-radio-dot" />}
                      </div>
                    </div>

                    {/* E-Wallets */}
                    <div 
                      className={`bs-pay-method-card ${paymentMode === 'Wallets' ? 'active' : ''}`}
                      onClick={() => setPaymentMode('Wallets')}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.5"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h14v4"/><path d="M4 6v12a2 2 0 0 0 2 2h14v-4"/><rect x="14" y="11" width="8" height="4" rx="1"/></svg>
                      <span className="bs-pay-method-text">E-Wallets</span>
                      <div className={`bs-pay-radio ${paymentMode === 'Wallets' ? 'active' : ''}`}>
                        {paymentMode === 'Wallets' && <span className="bs-pay-radio-dot" />}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Coupon Code Section */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid #F1F5F9', paddingTop: '14px', marginTop: '4px' }}>
                  <span className="bs-summary-lbl" style={{ fontWeight: '700', color: '#1E293B', fontSize: '13px' }}>Coupon Code</span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input 
                      type="text" 
                      className="bs-coupon-input" 
                      placeholder="Enter code (e.g. SWAP10)" 
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <button className="bs-coupon-btn" onClick={handleApplyCoupon}>Apply</button>
                  </div>
                  {appliedCoupon && (
                    <div style={{ fontSize: '11.5px', color: '#16A34A', fontWeight: 'bold' }}>
                      Coupon Applied! Discount of ₹{discount}.00
                    </div>
                  )}
                  {couponError && (
                    <div style={{ fontSize: '11.5px', color: '#EF4444', fontWeight: 'bold' }}>
                      {couponError}
                    </div>
                  )}
                </div>

                {/* QR Code Container (renders only if UPI selected) */}
                {paymentMode === 'UPI' && (
                  <div className="bs-qr-container">
                    <span className="bs-qr-text">Scan &amp; Pay using any UPI app</span>
                    
                    <div className="bs-qr-box">
                      <div style={{ color: '#0F0A2E' }}>
                        <IQrCode />
                      </div>
                      
                      <div className="bs-qr-logo-center">
                        <span style={{ fontSize: '9px', fontWeight: '900', fontStyle: 'italic', letterSpacing: '-0.5px' }}>
                          <span style={{ color: '#0054A6' }}>U</span>
                          <span style={{ color: '#F37021' }}>P</span>
                          <span style={{ color: '#16A34A' }}>I</span>
                        </span>
                      </div>
                    </div>

                    <span className="bs-qr-id">UPI ID: evegah@upi</span>

                    {/* Pay Providers logos */}
                    <div className="bs-providers-row">
                      <div className="bs-provider-tag gpay">
                        <span style={{ color: '#4285F4' }}>G</span>
                        <span style={{ color: '#EA4335' }}>P</span>
                        <span style={{ color: '#FBBC05' }}>a</span>
                        <span style={{ color: '#34A853' }}>y</span>
                      </div>
                      <div className="bs-provider-tag phonepe">PhonePe</div>
                      <div className="bs-provider-tag paytm">paytm</div>
                      <div className="bs-provider-tag bhim">BHIM</div>
                      <div className="bs-provider-tag upi">UPI</div>
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>

      </div>
    </>
  );
}
