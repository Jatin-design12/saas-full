'use client';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

const CSS = `
.rr-shell { display: flex; min-height: 100vh; background: #F8FAFC; font-family: 'Inter', sans-serif; }
.rr-main { margin-left: 230px; display: flex; flex-direction: column; min-height: 100vh; width: calc(100% - 230px); }
.rr-page { flex: 1; padding: 24px; display: flex; flex-direction: column; gap: 20px; }

/* Breadcrumb */
.rr-bc { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #64748B; font-weight: 500; }
.rr-bc-sep { color: #94A3B8; }
.rr-bc-cur { color: #2A195C; font-weight: 600; }

/* Title block */
.rr-title-row { display: flex; align-items: center; justify-content: space-between; margin-top: 4px; }
.rr-h1 { font-size: 24px; font-weight: 850; color: #0F172A; margin: 4px 0 2px; letter-spacing: -0.02em; }
.rr-subtitle { font-size: 13px; color: #64748B; font-weight: 500; }

/* Stats Grid */
.rr-stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-top: 4px; }
.rr-stat-card { background: #fff; border: 1.5px solid #E2E8F0; border-radius: 14px; padding: 18px; display: flex; align-items: center; gap: 16px; box-shadow: 0 1px 3px rgba(0,0,0,.01); }
.rr-stat-ic-box { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.rr-stat-val { font-size: 24px; font-weight: 850; color: #0F172A; line-height: 1.1; }
.rr-stat-lbl { font-size: 11px; color: #64748B; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2px; }
.rr-stat-sub { font-size: 11.5px; color: #64748B; font-weight: 500; }

/* Filter Bar */
.rr-filter-bar { display: flex; align-items: center; justify-content: flex-end; gap: 10px; margin-top: 8px; }
.rr-search-box { display: flex; align-items: center; border: 1.5px solid #E2E8F0; border-radius: 10px; background: #fff; padding: 0 12px; gap: 8px; height: 38px; width: 260px; margin-right: auto; }
.rr-search-inp { border: none; outline: none; font-size: 13px; color: #1E293B; width: 100%; font-family: inherit; }
.rr-search-inp::placeholder { color: #94A3B8; }
.rr-select { border: 1.5px solid #E2E8F0; border-radius: 10px; padding: 0 12px; font-size: 13px; color: #475569; background: #fff; height: 38px; cursor: pointer; font-weight: 600; outline: none; transition: border-color .15s; }
.rr-select:focus { border-color: #6366F1; }

.rr-btn { display: flex; align-items: center; gap: 7px; padding: 0 16px; background: #fff; border: 1.5px solid #E2E8F0; border-radius: 10px; font-size: 13px; font-weight: 600; color: #475569; cursor: pointer; transition: all .15s; height: 38px; }
.rr-btn:hover { border-color: #6366F1; color: #6366F1; }
.rr-btn-primary { background: #2a195c; color: #fff; border-color: #2a195c; }
.rr-btn-primary:hover { background: #4338CA; border-color: #4338CA; color: #fff; }

/* Table Section */
.rr-table-card { background: #fff; border: 1.5px solid #E2E8F0; border-radius: 14px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,.01); }
.rr-table { width: 100%; border-collapse: collapse; text-align: left; }
.rr-table th { font-size: 10.5px; font-weight: 700; color: #475569; text-transform: uppercase; padding: 12px 16px; background: #F8FAFC; border-bottom: 1px solid #E2E8F0; letter-spacing: 0.05em; }
.rr-table td { padding: 12px 16px; font-size: 12.5px; color: #1E293B; border-bottom: 1px solid #F1F5F9; vertical-align: middle; }
.rr-table tr:hover td { background: #F8FAFC; }

.rr-table td .rider-info { display: flex; align-items: center; gap: 10px; }
.rr-table td .rider-av { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; color: #fff; overflow: hidden; }
.rr-table td .rider-name { font-weight: 700; color: #0F172A; display: block; line-height: 1.2; }
.rr-table td .rider-phone { font-size: 11px; color: #64748B; font-weight: 500; display: block; margin-top: 1px; }

.rr-table td .vehicle-cat { font-weight: 700; color: #0F172A; display: flex; align-items: center; gap: 6px; }
.rr-table td .vehicle-plate { font-size: 11px; color: #64748B; font-weight: 500; font-family: monospace; display: block; margin-top: 2px; }

.rr-table td .pickup-drop { font-size: 12px; display: flex; flex-direction: column; gap: 2px; }
.rr-table td .zone-item { display: flex; align-items: center; gap: 4px; color: #475569; }

.rr-table td .date-time { display: flex; flex-direction: column; gap: 2px; }
.rr-table td .dt-item { display: flex; align-items: center; gap: 4px; color: #475569; font-weight: 600; }

/* Badges */
.status-badge { display: inline-flex; align-items: center; padding: 4px 10px; border-radius: 6px; font-size: 10.5px; font-weight: 700; letter-spacing: 0.05em; text-transform: capitalize; width: fit-content; }
.badge-upcoming { background: #DCFCE7; color: #16A34A; }
.badge-confirmed { background: #EEF2FF; color: #4F46E5; }
.badge-completed { background: #EFF6FF; color: #2563EB; }
.badge-cancelled { background: #FEE2E2; color: #EF4444; }

.pay-badge { font-weight: 700; display: inline-flex; align-items: center; gap: 4px; font-size: 12px; }
.pay-paid { color: #16A34A; }
.pay-refunded { color: #64748B; }

/* Pagination */
.rr-pagination { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; background: #fff; border-top: 1px solid #E2E8F0; font-size: 12px; color: #64748B; font-weight: 500; }
.rr-pag-btns { display: flex; align-items: center; gap: 6px; }
.rr-pag-btn { width: 28px; height: 28px; border-radius: 6px; border: 1.5px solid #E2E8F0; background: #fff; color: #475569; display: flex; align-items: center; justify-content: center; cursor: pointer; font-weight: 600; transition: all .1s; }
.rr-pag-btn:hover { border-color: #6366F1; color: #6366F1; }
.rr-pag-btn.active { background: #2a195c; border-color: #2a195c; color: #fff; }

/* Modal overlay styling */
.rr-modal-ov { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
.rr-modal-box { background: #fff; border-radius: 16px; border: 1px solid #E2E8F0; width: 100%; max-width: 580px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04); display: flex; flex-direction: column; overflow: hidden; max-height: 90vh; }
.rr-modal-hdr { padding: 16px 20px; border-bottom: 1px solid #F1F5F9; display: flex; align-items: center; justify-content: space-between; }
.rr-modal-tit { font-size: 16px; font-weight: 800; color: #0F172A; }
.rr-modal-close { background: none; border: none; font-size: 20px; color: #94A3B8; cursor: pointer; transition: color .15s; }
.rr-modal-close:hover { color: #EF4444; }
.rr-modal-body { padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 16px; }
.rr-modal-ftr { padding: 14px 20px; border-top: 1px solid #F1F5F9; display: flex; justify-content: flex-end; gap: 10px; background: #F8FAFC; }

/* Simulator Form elements */
.sim-form-group { display: flex; flex-direction: column; gap: 6px; }
.sim-form-lbl { font-size: 12px; color: #475569; font-weight: 650; }
.sim-inp { border: 1.5px solid #E2E8F0; border-radius: 8px; padding: 8px 12px; font-size: 13px; color: #1E293B; outline: none; font-family: inherit; transition: border-color .15s; }
.sim-inp:focus { border-color: #6366F1; }
.sim-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.sim-otp-box { display: flex; gap: 8px; }
.sim-btn-otp { padding: 0 14px; background: #EEF2FF; border: 1.5px solid #C7D2FE; color: #2A195C; border-radius: 8px; font-size: 12.5px; font-weight: 700; cursor: pointer; transition: all 0.15s; white-space: nowrap; }
.sim-btn-otp:hover { background: #2A195C; color: #fff; border-color: #2A195C; }

/* Policies list */
.sim-policies { background: #FAF5FF; border: 1px dashed #D8B4FE; border-radius: 10px; padding: 12px; display: flex; flex-direction: column; gap: 6px; }
.sim-policy-t { font-size: 11.5px; font-weight: 750; color: #2A195C; text-transform: uppercase; letter-spacing: 0.05em; }
.sim-policy-i { font-size: 11.5px; color: #581C87; font-weight: 500; display: flex; justify-content: space-between; }

/* Detail row key-val */
.sim-detail-row { display: flex; justify-content: space-between; align-items: center; border-bottom: 1.5px solid #F8FAFC; padding-bottom: 8px; font-size: 13px; }
.sim-detail-key { color: #64748B; font-weight: 500; }
.sim-detail-val { color: #0F172A; font-weight: 700; }
`;

interface Reservation {
  id: string;
  reservation_id: string;
  customer_name: string;
  mobile: string;
  gov_id: string;
  reservation_date: string;
  reservation_time: string;
  package_type: string;
  vehicle_category: string;
  vehicle_number: string;
  fare: string;
  deposit: string;
  payment_mode: string;
  payment_status: string;
  status: string;
  pickup_zone: string;
  drop_zone: string;
  created_at: string;
}

export function ReservedRidesPageContent({ activePath = "/settings/reserved-rides" }: { activePath?: string }) {
  const [list, setList] = useState<Reservation[]>([]);
  const [stats, setStats] = useState({ total: 128, upcoming: 96, completed: 24, cancelled: 8 });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  // Modals state
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedRes, setSelectedRes] = useState<Reservation | null>(null);

  // Available vehicles/batteries for allocation dropdowns
  const [availableVehicles, setAvailableVehicles] = useState<any[]>([]);
  const [availableBatteries, setAvailableBatteries] = useState<any[]>([]);
  const [allocVehicle, setAllocVehicle] = useState('');
  const [allocBattery, setAllocBattery] = useState('');
  const [simName, setSimName] = useState('');
  const [simMobile, setSimMobile] = useState('');
  const [simOtp, setSimOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [simGovId, setSimGovId] = useState('');
  const [simDate, setSimDate] = useState('2026-06-20');
  const [simTime, setSimTime] = useState('10:00');
  const [simPackage, setSimPackage] = useState('Day');
  const [simCategory, setSimCategory] = useState('SUV');
  const [simPayMode, setSimPayMode] = useState('UPI');

  // Operator state (kept for backward compat)
  const [operatorAllocatedNumber, setOperatorAllocatedNumber] = useState('');

  const fetchReservations = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
      const statusParam = statusFilter ? `&status=${statusFilter}` : '';
      
      const res = await fetch(`${apiUrl}/reservations?page=${page}&limit=10${searchParam}${statusParam}`);
      if (res.ok) {
        const body = await res.json();
        setList(body.data);
        setTotalPages(body.pagination.totalPages);
        if (body.stats) {
          setStats(body.stats);
        }
      }
    } catch (err) {
      console.error('Error fetching reservations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [page, search, statusFilter]);

  // Package fare details helper
  const getFareAndDeposit = () => {
    let baseFare = 200;
    if (simPackage === 'Half Day') baseFare = 500;
    else if (simPackage === 'Day') baseFare = 1000;
    else if (simPackage === 'Weekly') baseFare = 3000;
    else if (simPackage === 'Monthly') baseFare = 8000;

    // SUV multiplies by 1.25, Sedan 1.0, Hatchback 0.85
    let multiplier = 1.0;
    if (simCategory === 'SUV') multiplier = 1.25;
    else if (simCategory === 'Hatchback') multiplier = 0.85;

    const fare = Math.round(baseFare * multiplier);
    const deposit = simPackage === 'Monthly' ? 2000 : 1000;

    return { fare, deposit };
  };

  const handleSendSimOtp = () => {
    if (!simMobile || simMobile.length < 10) {
      alert('Please enter a valid mobile number');
      return;
    }
    setOtpSent(true);
    alert('OTP Sent! (Simulated OTP is: 1234)');
  };

  const handleVerifySimOtp = () => {
    if (simOtp === '1234') {
      setOtpVerified(true);
      alert('Mobile Authenticated successfully!');
    } else {
      alert('Invalid simulated OTP. Enter 1234.');
    }
  };

  const handleCreateSimBooking = async () => {
    if (!otpVerified) {
      alert('Customer authentication by Mobile & OTP is required first.');
      return;
    }
    if (!simName || !simGovId) {
      alert('Please fill in Customer Name and Government ID');
      return;
    }

    const { fare, deposit } = getFareAndDeposit();
    const payload = {
      customer_name: simName,
      mobile: simMobile,
      gov_id: simGovId,
      reservation_date: simDate,
      reservation_time: simTime + ':00',
      package_type: simPackage,
      vehicle_category: simCategory,
      fare,
      deposit,
      payment_mode: simPayMode,
      pickup_zone: 'Connaught Place Zone',
      drop_zone: 'Indira Gandhi Airport'
    };

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const result = await res.json();
        alert(`Reservation successful! Allocated Reservation Number: ${result.data.reservation_id}`);
        // Reset simulator
        setIsSimulatorOpen(false);
        setSimName('');
        setSimMobile('');
        setSimOtp('');
        setOtpSent(false);
        setOtpVerified(false);
        setSimGovId('');
        // Reload list
        fetchReservations();
      } else {
        alert('Failed to book ride');
      }
    } catch (err) {
      alert('Error connecting to backend API');
    }
  };

  const handleCancelBooking = async (resId: string) => {
    if (!confirm('Are you sure you want to cancel this reservation?')) return;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/reservations/${resId}/cancel`, { method: 'POST' });
      if (res.ok) {
        const body = await res.json();
        alert(body.message);
        setIsDetailsOpen(false);
        fetchReservations();
      } else {
        alert('Failed to cancel booking');
      }
    } catch (err) {
      alert('Error connecting to cancel API');
    }
  };

  const openDetailsModal = async (res: Reservation) => {
    setSelectedRes(res);
    setAllocVehicle('');
    setAllocBattery('');
    setIsDetailsOpen(true);

    // Fetch available vehicles and batteries for allocation dropdowns
    if (res.status === 'Upcoming') {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const [vRes, bRes] = await Promise.all([
          fetch(`${apiUrl}/reservations/available-vehicles`),
          fetch(`${apiUrl}/batteries?status=idle`)
        ]);
        if (vRes.ok) {
          const vBody = await vRes.json();
          setAvailableVehicles(vBody.data || []);
        }
        if (bRes.ok) {
          const bBody = await bRes.json();
          setAvailableBatteries(bBody.data || []);
        }
      } catch (err) {
        console.warn('Could not fetch available vehicles/batteries:', err);
      }
    }
  };

  const handleAllocateVehicle = async (resId: string) => {
    if (!allocVehicle) {
      alert('Please select a vehicle to allocate.');
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/reservations/${resId}/allocate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vehicle_number: allocVehicle, battery_id: allocBattery })
      });

      if (res.ok) {
        const body = await res.json();
        alert(`✅ ${body.message || 'Vehicle & Battery allocated! Rider moved to Active Rides.'}`);
        setIsDetailsOpen(false);
        setAllocVehicle('');
        setAllocBattery('');
        fetchReservations();
      } else {
        alert('Failed to allocate vehicle');
      }
    } catch (err) {
      alert('Error connecting to allocation API');
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const formatDateTime = (dateStr: string) => {
    if (!dateStr) return '-';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return dateStr;
    }
  };

  // Mapped avatars by index to give a premium UI
  const getAvatarColor = (idx: number) => {
    const colors = ['#6366F1', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'];
    return colors[idx % colors.length];
  };

  const getFareCalc = getFareAndDeposit();

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="rr-shell">
        <Sidebar activePath={activePath} />
        <div className="rr-main">
          <TopBar title={activePath.includes('renters') || activePath.includes('riders') ? 'Riders' : 'Settings'} subtitle="View and manage reserved rides" showHand={false} />
          <div className="rr-page">

            {/* Breadcrumb */}
            <div className="rr-bc">
              <span>{activePath.includes('renters') || activePath.includes('riders') ? 'Riders' : 'Settings'}</span>
              <span className="rr-bc-sep">&gt;</span>
              <span className="rr-bc-cur">Reserved Rides</span>
            </div>

            {/* Title Row */}
            <div className="rr-title-row">
              <div>
                <h1 className="rr-h1">Reserved Rides</h1>
                <div className="rr-subtitle">View and manage all reserved rides in the system</div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="rr-btn rr-btn-primary" onClick={() => setIsSimulatorOpen(true)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
                  Rider App Simulator
                </button>
              </div>
            </div>

            {/* Stats Summary Row */}
            <div className="rr-stats-grid">
              {/* Card 1 */}
              <div className="rr-stat-card">
                <div className="rr-stat-ic-box" style={{ background: '#F5F3FF', color: '#8B5CF6' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                </div>
                <div>
                  <div className="rr-stat-lbl">Total Rides</div>
                  <div className="rr-stat-val">{stats.total}</div>
                  <div className="rr-stat-sub">All reserved rides</div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="rr-stat-card">
                <div className="rr-stat-ic-box" style={{ background: '#DCFCE7', color: '#16A34A' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <div>
                  <div className="rr-stat-lbl">Upcoming Rides</div>
                  <div className="rr-stat-val" style={{ color: '#16A34A' }}>{stats.upcoming}</div>
                  <div className="rr-stat-sub">Scheduled for future</div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="rr-stat-card">
                <div className="rr-stat-ic-box" style={{ background: '#FFF7ED', color: '#F59E0B' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                </div>
                <div>
                  <div className="rr-stat-lbl">Completed Rides</div>
                  <div className="rr-stat-val" style={{ color: '#F59E0B' }}>{stats.completed}</div>
                  <div className="rr-stat-sub">Successfully completed</div>
                </div>
              </div>

              {/* Card 4 */}
              <div className="rr-stat-card">
                <div className="rr-stat-ic-box" style={{ background: '#FEE2E2', color: '#EF4444' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                </div>
                <div>
                  <div className="rr-stat-lbl">Cancelled Rides</div>
                  <div className="rr-stat-val" style={{ color: '#EF4444' }}>{stats.cancelled}</div>
                  <div className="rr-stat-sub">Cancelled by users</div>
                </div>
              </div>
            </div>

            {/* Filter Bar Row */}
            <div className="rr-filter-bar">
              <div className="rr-search-box">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input 
                  type="text" 
                  className="rr-search-inp" 
                  placeholder="Search by customer, mobile..." 
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                />
              </div>

              <select 
                className="rr-select"
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              >
                <option value="">All Statuses</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>

              <button className="rr-btn" style={{ padding: '0 12px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
                Filters
              </button>

              <button className="rr-btn" onClick={() => alert('Exporting reservation logs to Excel/CSV...')}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Export
              </button>
            </div>

            {/* Table layout */}
            <div className="rr-table-card">
              <table className="rr-table">
                <thead>
                  <tr>
                    <th>Ride ID</th>
                    <th>Customer</th>
                    <th>Ride Details</th>
                    <th>Pickup & Drop</th>
                    <th>Date & Time</th>
                    <th>Status</th>
                    <th>Fare</th>
                    <th>Payment</th>
                    <th>Booked On</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={10} style={{ textAlign: 'center', padding: '30px', color: '#64748B' }}>
                        Loading reservations telemetry...
                      </td>
                    </tr>
                  ) : list.length === 0 ? (
                    <tr>
                      <td colSpan={10} style={{ textAlign: 'center', padding: '30px', color: '#64748B' }}>
                        No reservations found in database matching criteria.
                      </td>
                    </tr>
                  ) : (
                    list.map((res, idx) => {
                      const statLower = res.status.toLowerCase();
                      const payLower = (res.payment_status || '').toLowerCase();
                      return (
                        <tr key={res.id}>
                          <td style={{ fontWeight: '750', color: '#2A195C', fontFamily: 'monospace' }}>
                            {res.reservation_id}
                          </td>
                          <td>
                            <div className="rider-info">
                              <div className="rider-av" style={{ background: getAvatarColor(idx) }}>
                                {res.customer_name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <span className="rider-name">{res.customer_name}</span>
                                <span className="rider-phone">{res.mobile}</span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="vehicle-cat">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                              {res.vehicle_category}
                            </div>
                            <span className="vehicle-plate">{res.vehicle_number || 'Pending Allocation'}</span>
                          </td>
                          <td>
                            <div className="pickup-drop">
                              <div className="zone-item">
                                <span style={{ color: '#10B981' }}>●</span> {res.pickup_zone || 'CP Zone'}
                              </div>
                              <div className="zone-item">
                                <span style={{ color: '#EF4444' }}>▲</span> {res.drop_zone || 'Indira Gandhi Airport'}
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="date-time">
                              <div className="dt-item">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                                {formatDate(res.reservation_date)}
                              </div>
                              <div className="dt-item" style={{ color: '#64748B', fontWeight: '500' }}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                {res.reservation_time.substring(0, 5)}
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className={`status-badge ${
                              statLower === 'upcoming' ? 'badge-upcoming' :
                              statLower === 'confirmed' ? 'badge-confirmed' :
                              statLower === 'completed' ? 'badge-completed' : 'badge-cancelled'
                            }`}>
                              {res.status}
                            </span>
                          </td>
                          <td style={{ fontWeight: '800', color: '#0F172A' }}>
                            ₹{Number(res.fare).toLocaleString('en-IN')}
                          </td>
                          <td>
                            <span className={`pay-badge ${
                              payLower === 'paid' ? 'pay-paid' : 'pay-refunded'
                            }`}>
                              {payLower === 'paid' ? 'Paid' : 'Refunded'}
                            </span>
                          </td>
                          <td style={{ fontSize: '11px', color: '#64748B' }}>
                            {formatDateTime(res.created_at)}
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button 
                                className="rr-pag-btn" 
                                style={{ width: '26px', height: '26px' }}
                                onClick={() => openDetailsModal(res)}
                                title="View details / Allocate vehicle"
                              >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>

              {/* Pagination footer */}
              <div className="rr-pagination">
                <span>Showing {(page - 1) * 10 + 1} to {Math.min(page * 10, stats.total)} of {stats.total} rides</span>
                <div className="rr-pag-btns">
                  <button 
                    className="rr-pag-btn" 
                    onClick={() => setPage(p => Math.max(p - 1, 1))}
                    disabled={page === 1}
                  >
                    &lt;
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button 
                      key={p} 
                      className={`rr-pag-btn ${page === p ? 'active' : ''}`}
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </button>
                  ))}
                  <button 
                    className="rr-pag-btn" 
                    onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                    disabled={page === totalPages}
                  >
                    &gt;
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* RIDER APP SIMULATOR MODAL */}
      {isSimulatorOpen && (
        <div className="rr-modal-ov">
          <div className="rr-modal-box">
            <div className="rr-modal-hdr">
              <span className="rr-modal-tit">📱 Rider Mobile App - Reserve Ride Simulation</span>
              <button className="rr-modal-close" onClick={() => setIsSimulatorOpen(false)}>&times;</button>
            </div>
            <div className="rr-modal-body">
              {/* Authenticate block */}
              <div style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', borderRadius: '12px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span style={{ fontSize: '11px', fontWeight: '850', color: '#2A195C', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Step 1: Customer Authentication by Mobile & OTP
                </span>
                <div className="sim-otp-box">
                  <input 
                    type="text" 
                    className="sim-inp" 
                    placeholder="Enter mobile number" 
                    style={{ flex: 1 }}
                    value={simMobile}
                    onChange={(e) => setSimMobile(e.target.value)}
                    disabled={otpVerified}
                  />
                  <button className="sim-btn-otp" onClick={handleSendSimOtp} disabled={otpVerified}>
                    {otpSent ? 'Resend OTP' : 'Send OTP'}
                  </button>
                </div>

                {otpSent && !otpVerified && (
                  <div className="sim-otp-box" style={{ marginTop: '4px' }}>
                    <input 
                      type="text" 
                      className="sim-inp" 
                      placeholder="Enter OTP (type 1234)" 
                      style={{ flex: 1 }}
                      value={simOtp}
                      onChange={(e) => setSimOtp(e.target.value)}
                    />
                    <button className="sim-btn-otp" style={{ background: '#10B981', color: '#fff', borderColor: '#10B981' }} onClick={handleVerifySimOtp}>
                      Verify OTP
                    </button>
                  </div>
                )}

                {otpVerified && (
                  <span style={{ color: '#16A34A', fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    ✔ Mobile Number Authenticated (+91 {simMobile})
                  </span>
                )}
              </div>

              {/* Form inputs */}
              <div className="sim-grid-2">
                <div className="sim-form-group">
                  <span className="sim-form-lbl">Customer Name</span>
                  <input type="text" className="sim-inp" placeholder="e.g. Rohit Sharma" value={simName} onChange={(e) => setSimName(e.target.value)} />
                </div>
                <div className="sim-form-group">
                  <span className="sim-form-lbl">Government ID Number (Aadhar/PAN)</span>
                  <input type="text" className="sim-inp" placeholder="e.g. GOV123456" value={simGovId} onChange={(e) => setSimGovId(e.target.value)} />
                </div>
              </div>

              <div className="sim-grid-2">
                <div className="sim-form-group">
                  <span className="sim-form-lbl">Reservation Date</span>
                  <input type="date" className="sim-inp" value={simDate} onChange={(e) => setSimDate(e.target.value)} />
                </div>
                <div className="sim-form-group">
                  <span className="sim-form-lbl">Reservation Time</span>
                  <input type="time" className="sim-inp" value={simTime} onChange={(e) => setSimTime(e.target.value)} />
                </div>
              </div>

              <div className="sim-grid-2">
                <div className="sim-form-group">
                  <span className="sim-form-lbl">Package Selection</span>
                  <select className="rr-select" style={{ height: '36px' }} value={simPackage} onChange={(e) => setSimPackage(e.target.value)}>
                    <option value="Hourly">Hourly</option>
                    <option value="Half Day">Half Day</option>
                    <option value="Day">Day</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                </div>
                <div className="sim-form-group">
                  <span className="sim-form-lbl">Vehicle Category</span>
                  <select className="rr-select" style={{ height: '36px' }} value={simCategory} onChange={(e) => setSimCategory(e.target.value)}>
                    <option value="SUV">SUV</option>
                    <option value="Sedan">Sedan</option>
                    <option value="Hatchback">Hatchback</option>
                  </select>
                </div>
              </div>

              <div className="sim-grid-2">
                <div className="sim-form-group">
                  <span className="sim-form-lbl">Payment Mode</span>
                  <select className="rr-select" style={{ height: '36px' }} value={simPayMode} onChange={(e) => setSimPayMode(e.target.value)}>
                    <option value="UPI">UPI</option>
                    <option value="Card">Credit/Debit Card</option>
                    <option value="Net Banking">Net Banking</option>
                  </select>
                </div>
                <div className="sim-form-group" style={{ justifyContent: 'center', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '8px', padding: '6px 12px' }}>
                  <div style={{ fontSize: '11px', color: '#16A34A', fontWeight: '700' }}>Estimated Payment</div>
                  <div style={{ fontSize: '15px', color: '#15803D', fontWeight: '800' }}>
                    Fare: ₹{simCategory ? getFareCalc.fare.toLocaleString('en-IN') : '0'} 
                    <span style={{ fontSize: '11px', color: '#16A34A', fontWeight: '500', marginLeft: '6px' }}>(+₹{getFareCalc.deposit} deposit)</span>
                  </div>
                </div>
              </div>

              {/* Refund options description panel */}
              <div className="sim-policies">
                <span className="sim-policy-t">🛡️ Payment Refund & Cancellation Policy</span>
                <div className="sim-policy-i">
                  <span>Cancellation before 1 day (24 hrs)</span>
                  <span>100% Refund</span>
                </div>
                <div className="sim-policy-i">
                  <span>Cancellation before 1/2 day (12 hrs)</span>
                  <span>90% Refund</span>
                </div>
                <div className="sim-policy-i">
                  <span>Cancellation before 4 hours</span>
                  <span>50% Refund</span>
                </div>
                <div className="sim-policy-i" style={{ borderTop: '1px dashed #E9D5FF', paddingTop: '4px', fontWeight: '700' }}>
                  <span>Cancellation after booking time</span>
                  <span>No Refund</span>
                </div>
              </div>

            </div>
            <div className="rr-modal-ftr">
              <button className="rr-btn" onClick={() => setIsSimulatorOpen(false)}>Cancel</button>
              <button className="rr-btn rr-btn-primary" onClick={handleCreateSimBooking}>Pay & Reserve Ride</button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW DETAILS & VEHICLE ALLOCATION / CANCELLATION MODAL */}
      {isDetailsOpen && selectedRes && (
        <div className="rr-modal-ov">
          <div className="rr-modal-box">
            <div className="rr-modal-hdr">
              <span className="rr-modal-tit">🛡️ Reservation Details & Operator Actions</span>
              <button className="rr-modal-close" onClick={() => { setIsDetailsOpen(false); setSelectedRes(null); setOperatorAllocatedNumber(''); }}>&times;</button>
            </div>
            <div className="rr-modal-body">
              {/* Detailed Summary */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div className="sim-detail-row">
                  <span className="sim-detail-key">Reservation Number</span>
                  <span className="sim-detail-val" style={{ color: '#2A195C', fontFamily: 'monospace' }}>{selectedRes.reservation_id}</span>
                </div>
                <div className="sim-detail-row">
                  <span className="sim-detail-key">Customer Name</span>
                  <span className="sim-detail-val">{selectedRes.customer_name}</span>
                </div>
                <div className="sim-detail-row">
                  <span className="sim-detail-key">Mobile Number</span>
                  <span className="sim-detail-val">{selectedRes.mobile}</span>
                </div>
                <div className="sim-detail-row">
                  <span className="sim-detail-key">Government ID</span>
                  <span className="sim-detail-val" style={{ fontFamily: 'monospace' }}>{selectedRes.gov_id}</span>
                </div>
                <div className="sim-detail-row">
                  <span className="sim-detail-key">Scheduled Ride DateTime</span>
                  <span className="sim-detail-val">{formatDate(selectedRes.reservation_date)} @ {selectedRes.reservation_time.substring(0, 5)}</span>
                </div>
                <div className="sim-detail-row">
                  <span className="sim-detail-key">Package & Vehicle Category</span>
                  <span className="sim-detail-val">{selectedRes.package_type} package / {selectedRes.vehicle_category}</span>
                </div>
                <div className="sim-detail-row">
                  <span className="sim-detail-key">Fare & Deposit paid</span>
                  <span className="sim-detail-val">₹{Number(selectedRes.fare).toLocaleString('en-IN')} fare (+₹{Number(selectedRes.deposit).toLocaleString('en-IN')} dep)</span>
                </div>
                <div className="sim-detail-row">
                  <span className="sim-detail-key">Payment Mode</span>
                  <span className="sim-detail-val">{selectedRes.payment_mode} ({selectedRes.payment_status})</span>
                </div>
                <div className="sim-detail-row">
                  <span className="sim-detail-key">Allocated Vehicle</span>
                  <span className="sim-detail-val" style={{ color: selectedRes.vehicle_number ? '#0F172A' : '#EF4444' }}>
                    {selectedRes.vehicle_number || 'Pending allocation by operator'}
                  </span>
                </div>
                <div className="sim-detail-row">
                  <span className="sim-detail-key">Allocated Battery</span>
                  <span className="sim-detail-val" style={{ color: (selectedRes as any).battery_id ? '#0F172A' : '#94A3B8' }}>
                    {(selectedRes as any).battery_id || 'Not yet assigned'}
                  </span>
                </div>
                <div className="sim-detail-row" style={{ borderBottom: 'none' }}>
                  <span className="sim-detail-key">Current Status</span>
                  <span className="sim-detail-val">
                    <span className={`status-badge ${
                      selectedRes.status.toLowerCase() === 'upcoming' ? 'badge-upcoming' :
                      selectedRes.status.toLowerCase() === 'confirmed' ? 'badge-confirmed' :
                      selectedRes.status.toLowerCase() === 'completed' ? 'badge-completed' : 'badge-cancelled'
                    }`}>
                      {selectedRes.status}
                    </span>
                  </span>
                </div>
              </div>

              {/* Operator vehicle + battery allocation */}
              {selectedRes.status.toLowerCase() === 'upcoming' && (
                <div style={{ background: '#EEF2FF', border: '1.5px solid #C7D2FE', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '4px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '850', color: '#2A195C', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    🛠️ Operator Action: Assign Vehicle & Battery → Move to Active Rides
                  </span>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div className="sim-form-group">
                      <span className="sim-form-lbl">Select Vehicle *</span>
                      <select
                        className="rr-select"
                        style={{ width: '100%' }}
                        value={allocVehicle}
                        onChange={e => setAllocVehicle(e.target.value)}
                      >
                        <option value="">-- Select Available Vehicle --</option>
                        {availableVehicles.length > 0
                          ? availableVehicles.map((v: any) => (
                              <option key={v.code} value={v.code}>
                                {v.code} — {v.evegah_model_name || v.vehicle_category || 'Vehicle'} ({v.zone || 'Unassigned'})
                              </option>
                            ))
                          : <option disabled>No available vehicles found</option>
                        }
                      </select>
                    </div>

                    <div className="sim-form-group">
                      <span className="sim-form-lbl">Select Battery (Optional)</span>
                      <select
                        className="rr-select"
                        style={{ width: '100%' }}
                        value={allocBattery}
                        onChange={e => setAllocBattery(e.target.value)}
                      >
                        <option value="">-- Select Battery --</option>
                        {availableBatteries.length > 0
                          ? availableBatteries.map((b: any) => (
                              <option key={b.battery_id} value={b.battery_id}>
                                {b.battery_id} — {b.soc ?? '?'}% SOC ({b.zone || 'Unassigned'})
                              </option>
                            ))
                          : <option disabled>No idle batteries found</option>
                        }
                      </select>
                    </div>

                    <button
                      className="rr-btn rr-btn-primary"
                      style={{ background: '#10B981', borderColor: '#10B981', alignSelf: 'flex-end' }}
                      onClick={() => handleAllocateVehicle(selectedRes.id)}
                    >
                      ✅ Confirm Allocation & Move to Riders
                    </button>
                  </div>
                </div>
              )}

            </div>
            <div className="rr-modal-ftr" style={{ justifyContent: 'space-between' }}>
              {selectedRes.status.toLowerCase() === 'upcoming' ? (
                <button 
                  className="rr-btn" 
                  style={{ color: '#EF4444', borderColor: '#FCA5A5', background: '#FEF2F2' }}
                  onClick={() => handleCancelBooking(selectedRes.id)}
                >
                  Cancel Booking & Refund
                </button>
              ) : (
                <div />
              )}
              <button 
                className="rr-btn" 
                onClick={() => { setIsDetailsOpen(false); setSelectedRes(null); setAllocVehicle(''); setAllocBattery(''); }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}

export default function ReservedRidesPage() {
  return <ReservedRidesPageContent activePath="/settings/reserved-rides" />;
}
