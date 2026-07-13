"use client";
import { useState, useMemo } from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

const CSS = `
.ph-shell { display: flex; min-height: 100vh; background: #F8FAFC; font-family: 'Inter', sans-serif; }
.ph-main { margin-left: 230px; display: flex; flex-direction: column; min-height: 100vh; width: calc(100% - 230px); }
.ph-page { flex: 1; padding: 24px; display: flex; flex-direction: column; gap: 20px; background-color: #FFF; }

/* Header title */
.ph-title-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 4px; }
.ph-h1 { font-size: 24px; font-weight: 800; color: #0F172A; margin: 0 0 6px; letter-spacing: -0.02em; }
.ph-sub { font-size: 13.5px; color: #64748B; margin: 0; font-weight: 400; }

.ph-actions { display: flex; align-items: center; gap: 10px; }
.ph-btn { display: flex; align-items: center; gap: 7px; padding: 9px 16px; background: #fff; border: 1.5px solid #E2E8F0; border-radius: 10px; font-size: 13px; font-weight: 600; color: #475569; cursor: pointer; transition: all .15s; }
.ph-btn:hover { border-color: #2a195c; color: #2a195c; }
.ph-btn-primary { background: #2a195c; color: #fff; border-color: #2a195c; }
.ph-btn-primary:hover { background: #4338CA; border-color: #4338CA; color: #fff; }

/* Filter bar panel */
.ph-filter-card { background: #fff; border: 1px solid #E2E8F0; border-radius: 14px; padding: 14px 16px; box-shadow: 0 1px 3px rgba(0,0,0,.02); }
.ph-filter-grid { display: grid; grid-template-columns: 2fr 1.25fr 1.25fr 1.25fr 1.25fr auto; gap: 12px; align-items: center; }
.ph-search-wrap { position: relative; }
.ph-search-input { width: 100%; padding: 10px 12px 10px 38px; border: 1.5px solid #E2E8F0; border-radius: 10px; font-size: 13px; outline: none; transition: border-color .15s; background: #FAFAFA; color: #1E293B; }
.ph-search-input:focus { border-color: #2a195c; background: #fff; }
.ph-search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #94A3B8; display: flex; align-items: center; }

.ph-date-picker { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 10px 14px; border: 1.5px solid #E2E8F0; border-radius: 10px; font-size: 13px; font-weight: 600; background: #fff; color: #334155; cursor: pointer; }
.ph-date-picker:hover { border-color: #2a195c; }
.ph-date-icon { color: #64748B; display: flex; align-items: center; }

.ph-select { width: 100%; padding: 10px 14px; border: 1.5px solid #E2E8F0; border-radius: 10px; font-size: 13px; font-weight: 500; outline: none; background: #fff; color: #334155; cursor: pointer; appearance: none; -webkit-appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748B' stroke-width='2.5'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' /%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 14px center; background-size: 12px; padding-right: 36px; }
.ph-select:focus { border-color: #2a195c; }

.ph-filter-btn { display: flex; align-items: center; gap: 7px; padding: 10px 16px; background: #F1F5F9; border: 1.5px solid transparent; border-radius: 10px; font-size: 13px; font-weight: 700; color: #475569; cursor: pointer; transition: all .15s; }
.ph-filter-btn:hover { background: #E2E8F0; color: #2a195c; }

/* Table styling */
.ph-tcard { background: #fff; border: 1px solid #E2E8F0; border-radius: 14px; box-shadow: 0 1px 3px rgba(0,0,0,.02); overflow: hidden; display: flex; flex-direction: column; }
.ph-dt-wrap { overflow-x: auto; }
.ph-dt { width: 100%; border-collapse: collapse; min-width: 1000px; }
.ph-dt th { font-size: 11px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: .06em; text-align: left; padding: 14px 18px; background: #FAFBFD; border-bottom: 1px solid #E2E8F0; }
.ph-dt th.sortable { cursor: pointer; user-select: none; }
.ph-dt th.sortable:hover { background: #F1F5F9; }
.ph-dt td { padding: 14px 18px; font-size: 13px; color: #334155; border-bottom: 1px solid #F1F5F9; vertical-align: middle; }
.ph-dt tr:last-child td { border-bottom: none; }
.ph-dt tr:hover td { background: #F8FAFC; }

.ph-rider-cell { display: flex; align-items: center; gap: 12px; }
.ph-rider-avatar { width: 36px; height: 36px; border-radius: 50%; object-fit: cover; background: #E2E8F0; display: block; flex-shrink: 0; }
.ph-rider-info { display: flex; flex-direction: column; }
.ph-rider-name { font-size: 13.5px; font-weight: 700; color: #1E293B; }
.ph-rider-code { font-size: 11.5px; color: #64748B; font-weight: 600; text-transform: uppercase; margin-top: 1px; }

.ph-tx-code { font-family: 'SFMono-Regular', Consolas, monospace; font-size: 12px; font-weight: 700; color: #1E293B; }
.ph-ref-code { font-family: 'SFMono-Regular', Consolas, monospace; font-size: 12.5px; font-weight: 600; color: #64748B; }

.ph-type-cell { display: flex; align-items: center; gap: 8px; font-weight: 600; font-size: 12.5px; }
.ph-type-icon { display: flex; align-items: center; justify-content: center; width: 20px; height: 20px; flex-shrink: 0; }
.type-rental { color: #3B82F6; }
.type-swap { color: #10B981; }
.type-refund { color: #F59E0B; }

.ph-pm-cell { display: flex; align-items: center; gap: 10px; }
.ph-pm-logo { width: 32px; height: 20px; object-fit: contain; flex-shrink: 0; display: flex; align-items: center; justify-content: center; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 4px; padding: 2px; }
.ph-pm-info { display: flex; flex-direction: column; }
.ph-pm-name { font-size: 12.5px; font-weight: 700; color: #1E293B; }
.ph-pm-sub { font-size: 11px; color: #64748B; margin-top: 1px; }

.ph-amount { font-weight: 700; font-size: 13.5px; color: #1E293B; }
.ph-amount.refunded { color: #EF4444; }

.status-badge { display: inline-flex; align-items: center; padding: 4px 10px; border-radius: 20px; font-size: 11.5px; font-weight: 700; border: 1.5px solid transparent; }
.badge-successful { background: #DCFCE7; color: #15803D; border-color: #BBF7D0; }
.badge-refunded { background: #F3E8FF; color: #7E22CE; border-color: #E9D5FF; }
.badge-failed { background: #FEE2E2; color: #B91C1C; border-color: #FECACA; }

.action-view-btn { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; background: #fff; border: 1.5px solid #E2E8F0; border-radius: 8px; font-size: 12px; font-weight: 700; color: #475569; cursor: pointer; transition: all .15s; }
.action-view-btn:hover { border-color: #2a195c; color: #2a195c; background: #F8FAFC; }

.ph-tcard-ft { display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; border-top: 1px solid #E2E8F0; background: #FAFBFD; flex-wrap: wrap; gap: 12px; }
.ph-tcard-ft-lbl { font-size: 13px; color: #64748B; font-weight: 500; }
.ph-pg { display: flex; align-items: center; gap: 4px; }
.ph-pgb { width: 32px; height: 32px; border: 1.5px solid #E2E8F0; border-radius: 8px; background: #fff; font-size: 13px; font-weight: 700; color: #475569; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all .15s; }
.ph-pgb:hover:not(:disabled) { border-color: #2a195c; color: #2a195c; }
.ph-pgb.cur { background: #FAF5FF; color: #2a195c; border-color: #2a195c; }
.ph-pgb:disabled { opacity: 0.5; cursor: not-allowed; }
.ph-pg-dots { padding: 0 4px; color: #64748B; font-size: 13px; }

.ph-limit-select { padding: 8px 12px; border: 1.5px solid #E2E8F0; border-radius: 8px; font-size: 12.5px; font-weight: 600; outline: none; background: #fff; color: #475569; cursor: pointer; appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748B' stroke-width='2.5'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' /%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 10px center; background-size: 11px; padding-right: 28px; }
`;

interface RecordRow {
  rider: { name: string; code: string; avatar: string };
  dateTime: string;
  txId: string;
  type: 'Rental' | 'Swap' | 'Refund';
  refId: string;
  pm: { name: string; sub: string; logoType: 'gpay' | 'visa' | 'phonepe' | 'mastercard' | 'paytm' | 'upi' };
  amount: number;
  status: 'Successful' | 'Refunded' | 'Failed';
}

const INITIAL_RECORDS: RecordRow[] = [
  {
    rider: { name: 'Arjun Mehta', code: 'EVB1234', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80' },
    dateTime: '18 May 2024, 11:05 AM',
    txId: 'TXN-240518-0001',
    type: 'Rental',
    refId: 'INV-240518-0012',
    pm: { name: 'UPI', sub: 'Google Pay', logoType: 'gpay' },
    amount: 120,
    status: 'Successful'
  },
  {
    rider: { name: 'Neha Singh', code: 'EVS5678', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80' },
    dateTime: '18 May 2024, 10:30 AM',
    txId: 'TXN-240518-0002',
    type: 'Swap',
    refId: 'BS-240518-0120',
    pm: { name: 'Card', sub: 'Visa **** 4242', logoType: 'visa' },
    amount: 60,
    status: 'Successful'
  },
  {
    rider: { name: 'Rahul Kumar', code: 'EVB9012', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80' },
    dateTime: '18 May 2024, 09:20 AM',
    txId: 'TXN-240518-0003',
    type: 'Rental',
    refId: 'INV-240518-0014',
    pm: { name: 'UPI', sub: 'PhonePe', logoType: 'phonepe' },
    amount: 80,
    status: 'Successful'
  },
  {
    rider: { name: 'Sneha Reddy', code: 'EVS7890', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80' },
    dateTime: '18 May 2024, 08:45 AM',
    txId: 'TXN-240518-0004',
    type: 'Refund',
    refId: 'REF-240518-0006',
    pm: { name: 'Original Payment', sub: 'UPI', logoType: 'upi' },
    amount: -120,
    status: 'Refunded'
  },
  {
    rider: { name: 'Amit Kumar', code: 'EVS6789', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80' },
    dateTime: '18 May 2024, 07:40 AM',
    txId: 'TXN-240518-0005',
    type: 'Rental',
    refId: 'INV-240518-0017',
    pm: { name: 'Card', sub: 'Mastercard **** 8888', logoType: 'mastercard' },
    amount: 40,
    status: 'Successful'
  },
  {
    rider: { name: 'Pooja Sharma', code: 'EVB2345', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80' },
    dateTime: '18 May 2024, 07:10 AM',
    txId: 'TXN-240518-0006',
    type: 'Rental',
    refId: 'INV-240518-0018',
    pm: { name: 'UPI', sub: 'Paytm', logoType: 'paytm' },
    amount: 0,
    status: 'Failed'
  },
  {
    rider: { name: 'Rohit Verma', code: 'EVS8901', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=100&q=80' },
    dateTime: '18 May 2024, 06:50 AM',
    txId: 'TXN-240518-0007',
    type: 'Swap',
    refId: 'BS-240518-0119',
    pm: { name: 'UPI', sub: 'Google Pay', logoType: 'gpay' },
    amount: 60,
    status: 'Successful'
  },
  {
    rider: { name: 'Vikram Patel', code: 'EVS1234', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&q=80' },
    dateTime: '18 May 2024, 06:20 AM',
    txId: 'TXN-240518-0008',
    type: 'Refund',
    refId: 'REF-240518-0007',
    pm: { name: 'Original Payment', sub: 'Card', logoType: 'visa' },
    amount: -60,
    status: 'Refunded'
  },
  {
    rider: { name: 'Kavya Singh', code: 'EVS5678', avatar: 'https://images.unsplash.com/photo-1534751516642-a131fed10495?auto=format&fit=crop&w=100&q=80' },
    dateTime: '18 May 2024, 05:55 AM',
    txId: 'TXN-240518-0009',
    type: 'Rental',
    refId: 'INV-240518-0020',
    pm: { name: 'UPI', sub: 'PhonePe', logoType: 'phonepe' },
    amount: 120,
    status: 'Successful'
  },
  {
    rider: { name: 'Manish Yadav', code: 'EVS3456', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=100&q=80' },
    dateTime: '18 May 2024, 05:30 AM',
    txId: 'TXN-240518-0010',
    type: 'Swap',
    refId: 'BS-240518-0118',
    pm: { name: 'Card', sub: 'Visa **** 1111', logoType: 'visa' },
    amount: 60,
    status: 'Successful'
  }
];

export default function PaymentHistoryPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [methodFilter, setMethodFilter] = useState('All');

  // Filter logic
  const filteredRecords = useMemo(() => {
    return INITIAL_RECORDS.filter(r => {
      const matchSearch =
        r.rider.name.toLowerCase().includes(search.toLowerCase()) ||
        r.rider.code.toLowerCase().includes(search.toLowerCase()) ||
        r.txId.toLowerCase().includes(search.toLowerCase()) ||
        r.refId.toLowerCase().includes(search.toLowerCase());

      const matchType = typeFilter === 'All' || r.type === typeFilter;
      const matchStatus = statusFilter === 'All' || r.status === statusFilter;
      
      let matchMethod = true;
      if (methodFilter !== 'All') {
        if (methodFilter === 'UPI') matchMethod = r.pm.name === 'UPI' || r.pm.sub.includes('Pay');
        else if (methodFilter === 'Card') matchMethod = r.pm.name === 'Card' || r.pm.sub.includes('Visa') || r.pm.sub.includes('Mastercard');
      }

      return matchSearch && matchType && matchStatus && matchMethod;
    });
  }, [search, typeFilter, statusFilter, methodFilter]);

  const pmLogo = (type: string) => {
    switch (type) {
      case 'gpay':
        return (
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="22" height="10" viewBox="0 0 200 85" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M29.5 3.3C21.7 3.3 14 6.3 8.3 11.9L16.2 19.8C20 16 25 14 30.5 14C41 14 49 22 49 32.5C49 43 41 51 30.5 51C25 51 20 49 16.2 45.2L8.3 53.1C14 58.7 21.7 61.7 29.5 61.7C46.5 61.7 60 48.2 60 31.2C60 14.2 46.5 3.3 29.5 3.3Z" fill="#EA4335" />
              <path d="M82.8 19.5L69.5 56.5H82.8L86.2 46H103L106.3 56.5H119.5L106.2 19.5H82.8ZM89.5 36L94.5 22L99.5 36H89.5Z" fill="#4285F4" />
              <path d="M129.5 19.5L139.5 44.5L149.5 19.5H163.5L146.5 56.5L132.5 56.5L115.5 19.5H129.5Z" fill="#FBBC05" />
            </svg>
          </span>
        );
      case 'visa':
        return (
          <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#1A1F71', fontStyle: 'italic', letterSpacing: '-0.5px' }}>VISA</span>
        );
      case 'phonepe':
        return (
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#5f259f', borderRadius: '3px', width: '16px', height: '16px', color: '#fff', fontSize: '10px', fontWeight: 'bold' }}>pe</span>
        );
      case 'mastercard':
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#EB001B', display: 'inline-block' }} />
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#F79E1B', display: 'inline-block', marginLeft: '-4px' }} />
          </div>
        );
      case 'paytm':
        return (
          <span style={{ fontSize: '10px', fontWeight: '800', color: '#00B9F1' }}>paytm</span>
        );
      case 'upi':
      default:
        return (
          <span style={{ fontSize: '9px', fontWeight: '800', color: '#097939', border: '1px solid #097939', padding: '1px 2px', borderRadius: '2px', lineHeight: 1 }}>UPI</span>
        );
    }
  };

  const getSortIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 6, color: '#94A3B8' }}>
      <polyline points="15 18 12 21 9 18" />
      <polyline points="9 6 12 3 15 6" />
      <line x1="12" y1="3" x2="12" y2="21" />
    </svg>
  );

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="ph-shell">
        <Sidebar activePath="/payment/history" />
        <div className="ph-main">
          <TopBar />
          
          <div className="ph-page">
            {/* Header */}
            <div className="ph-title-row">
              <div>
                <h1 className="ph-h1">Payment History</h1>
                <p className="ph-sub">View and track all payments received for rentals, battery swaps, refunds and invoices.</p>
              </div>
              <div className="ph-actions">
                <button className="ph-btn">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Export
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 2 }}>
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="ph-filter-card">
              <div className="ph-filter-grid">
                <div className="ph-search-wrap">
                  <span className="ph-search-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    className="ph-search-input"
                    placeholder="Search by Rider Name, Transaction ID, ..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <button className="ph-date-picker">
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="ph-date-icon">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                    </span>
                    18 May 2024 - 18 May 2024
                  </span>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 2, color: '#64748B' }}>
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                <div>
                  <select
                    className="ph-select"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                  >
                    <option value="All">All Types</option>
                    <option value="Rental">Rental Payment</option>
                    <option value="Swap">Battery Swap</option>
                    <option value="Refund">Refund</option>
                  </select>
                </div>

                <div>
                  <select
                    className="ph-select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="All">All Status</option>
                    <option value="Successful">Successful</option>
                    <option value="Refunded">Refunded</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>

                <div>
                  <select
                    className="ph-select"
                    value={methodFilter}
                    onChange={(e) => setMethodFilter(e.target.value)}
                  >
                    <option value="All">All Methods</option>
                    <option value="UPI">UPI Payments</option>
                    <option value="Card">Card Payments</option>
                  </select>
                </div>

                <button className="ph-filter-btn">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="4" y1="21" x2="4" y2="14" />
                    <line x1="4" y1="10" x2="4" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12" y2="3" />
                    <line x1="20" y1="21" x2="20" y2="16" />
                    <line x1="20" y1="12" x2="20" y2="3" />
                    <line x1="1" y1="14" x2="7" y2="14" />
                    <line x1="9" y1="8" x2="15" y2="8" />
                    <line x1="17" y1="16" x2="23" y2="16" />
                  </svg>
                  More Filters
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="ph-tcard">
              <div className="ph-dt-wrap">
                <table className="ph-dt">
                  <thead>
                    <tr>
                      <th className="sortable">RIDER / CUSTOMER {getSortIcon()}</th>
                      <th className="sortable">DATE & TIME {getSortIcon()}</th>
                      <th className="sortable">TRANSACTION ID {getSortIcon()}</th>
                      <th>TYPE</th>
                      <th>REFERENCE ID</th>
                      <th>PAYMENT METHOD</th>
                      <th>AMOUNT</th>
                      <th>STATUS</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecords.length === 0 ? (
                      <tr>
                        <td colSpan={9} style={{ textAlign: 'center', padding: '30px', color: '#64748B' }}>
                          No records found matching filters.
                        </td>
                      </tr>
                    ) : (
                      filteredRecords.map((r, index) => (
                        <tr key={index}>
                          <td>
                            <div className="ph-rider-cell">
                              <img src={r.rider.avatar} alt={r.rider.name} className="ph-rider-avatar" />
                              <div className="ph-rider-info">
                                <span className="ph-rider-name">{r.rider.name}</span>
                                <span className="ph-rider-code">{r.rider.code}</span>
                              </div>
                            </div>
                          </td>
                          <td style={{ fontWeight: '500' }}>{r.dateTime}</td>
                          <td className="ph-tx-code">{r.txId}</td>
                          <td>
                            <div className="ph-type-cell">
                              {r.type === 'Rental' && (
                                <>
                                  <span className="ph-type-icon type-rental">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                      <circle cx="5.5" cy="17.5" r="2.5" />
                                      <circle cx="18.5" cy="17.5" r="2.5" />
                                      <path d="M15 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm-3 5.5V14m-3.5-3.5H15M8.5 10.5L12 6.5l3.5 4" />
                                    </svg>
                                  </span>
                                  Rental Payment
                                </>
                              )}
                              {r.type === 'Swap' && (
                                <>
                                  <span className="ph-type-icon type-swap">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                      <rect x="2" y="7" width="16" height="10" rx="2" ry="2" />
                                      <line x1="22" y1="11" x2="22" y2="13" />
                                    </svg>
                                  </span>
                                  Battery Swap
                                </>
                              )}
                              {r.type === 'Refund' && (
                                <>
                                  <span className="ph-type-icon type-refund">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                      <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                                    </svg>
                                  </span>
                                  Refund
                                </>
                              )}
                            </div>
                          </td>
                          <td className="ph-ref-code">{r.refId}</td>
                          <td>
                            <div className="ph-pm-cell">
                              <div className="ph-pm-logo">{pmLogo(r.pm.logoType)}</div>
                              <div className="ph-pm-info">
                                <span className="ph-pm-name">{r.pm.name}</span>
                                <span className="ph-pm-sub">{r.pm.sub}</span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className={`ph-amount ${r.amount < 0 ? 'refunded' : ''}`}>
                              {r.amount < 0 ? `-₹${Math.abs(r.amount)}` : `₹${r.amount}`}
                            </span>
                          </td>
                          <td>
                            <span className={`status-badge badge-${r.status.toLowerCase()}`}>
                              {r.status}
                            </span>
                          </td>
                          <td>
                            <button className="action-view-btn">
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                              </svg>
                              View
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              <div className="ph-tcard-ft">
                <span className="ph-tcard-ft-lbl">Showing 1 to {filteredRecords.length} of 324 records</span>
                
                <div className="ph-pg">
                  <button className="ph-pgb" disabled>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </button>
                  <button className="ph-pgb cur">1</button>
                  <button className="ph-pgb">2</button>
                  <button className="ph-pgb">3</button>
                  <span className="ph-pg-dots">...</span>
                  <button className="ph-pgb">33</button>
                  <button className="ph-pgb">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </div>

                <div>
                  <select className="ph-limit-select" defaultValue="10">
                    <option value="10">10 per page</option>
                    <option value="25">25 per page</option>
                    <option value="50">50 per page</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
