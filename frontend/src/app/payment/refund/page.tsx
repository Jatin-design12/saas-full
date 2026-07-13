"use client";
import { useState, useMemo } from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

const CSS = `
.rh-shell { display: flex; min-height: 100vh; background: #F8FAFC; font-family: 'Inter', sans-serif; }
.rh-main { margin-left: 230px; display: flex; flex-direction: column; min-height: 100vh; width: calc(100% - 230px); }
.rh-page { flex: 1; padding: 24px; display: flex; flex-direction: column; gap: 20px; background-color: #FFF; }

/* Header title */
.rh-title-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 4px; }
.rh-h1 { font-size: 24px; font-weight: 800; color: #0F172A; margin: 0 0 6px; letter-spacing: -0.02em; }
.rh-sub { font-size: 13.5px; color: #64748B; margin: 0; font-weight: 400; }

.rh-actions { display: flex; align-items: center; gap: 10px; }
.rh-btn { display: flex; align-items: center; gap: 7px; padding: 9px 16px; background: #fff; border: 1.5px solid #E2E8F0; border-radius: 10px; font-size: 13px; font-weight: 600; color: #475569; cursor: pointer; transition: all .15s; }
.rh-btn:hover { border-color: #2a195c; color: #2a195c; }
.rh-btn-primary { background: #2a195c; color: #fff; border-color: #2a195c; }
.rh-btn-primary:hover { background: #4338CA; border-color: #4338CA; color: #fff; }

/* Tabs bar */
.rh-tabs { display: flex; border-bottom: 1.5px solid #E2E8F0; gap: 28px; margin-bottom: 4px; }
.rh-tab { padding: 12px 8px; font-size: 14px; font-weight: 700; color: #64748B; cursor: pointer; border-bottom: 3px solid transparent; transition: all .15s; margin-bottom: -1.5px; }
.rh-tab:hover { color: #2a195c; }
.rh-tab.active { color: #2a195c; border-bottom-color: #2a195c; }

/* Filter bar panel */
.rh-filter-card { background: #fff; border: 1px solid #E2E8F0; border-radius: 14px; padding: 14px 16px; box-shadow: 0 1px 3px rgba(0,0,0,.02); }
.rh-filter-grid { display: grid; grid-template-columns: 2fr 1.25fr 1.25fr auto; gap: 12px; align-items: center; }
.rh-search-wrap { position: relative; }
.rh-search-input { width: 100%; padding: 10px 12px 10px 38px; border: 1.5px solid #E2E8F0; border-radius: 10px; font-size: 13px; outline: none; transition: border-color .15s; background: #FAFAFA; color: #1E293B; }
.rh-search-input:focus { border-color: #2a195c; background: #fff; }
.rh-search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #94A3B8; display: flex; align-items: center; }

.rh-select { width: 100%; padding: 10px 14px; border: 1.5px solid #E2E8F0; border-radius: 10px; font-size: 13px; font-weight: 500; outline: none; background: #fff; color: #334155; cursor: pointer; appearance: none; -webkit-appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748B' stroke-width='2.5'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' /%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 14px center; background-size: 12px; padding-right: 36px; }
.rh-select:focus { border-color: #2a195c; }

.rh-date-picker { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 10px 14px; border: 1.5px solid #E2E8F0; border-radius: 10px; font-size: 13px; font-weight: 600; background: #fff; color: #334155; cursor: pointer; }
.rh-date-picker:hover { border-color: #2a195c; }
.rh-date-icon { color: #64748B; display: flex; align-items: center; }

.rh-filter-btn { display: flex; align-items: center; gap: 7px; padding: 10px 16px; background: #F1F5F9; border: 1.5px solid transparent; border-radius: 10px; font-size: 13px; font-weight: 700; color: #475569; cursor: pointer; transition: all .15s; }
.rh-filter-btn:hover { background: #E2E8F0; color: #2a195c; }

/* Table styling */
.rh-tcard { background: #fff; border: 1px solid #E2E8F0; border-radius: 14px; box-shadow: 0 1px 3px rgba(0,0,0,.02); overflow: hidden; display: flex; flex-direction: column; }
.rh-dt-wrap { overflow-x: auto; }
.rh-dt { width: 100%; border-collapse: collapse; min-width: 1000px; }
.rh-dt th { font-size: 11px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: .06em; text-align: left; padding: 14px 18px; background: #FAFBFD; border-bottom: 1px solid #E2E8F0; }
.rh-dt th.sortable { cursor: pointer; user-select: none; }
.rh-dt th.sortable:hover { background: #F1F5F9; }
.rh-dt td { padding: 14px 18px; font-size: 13px; color: #334155; border-bottom: 1px solid #F1F5F9; vertical-align: middle; }
.rh-dt tr:last-child td { border-bottom: none; }
.rh-dt tr:hover td { background: #F8FAFC; }

.rh-rider-cell { display: flex; align-items: center; gap: 12px; }
.rh-rider-avatar { width: 36px; height: 36px; border-radius: 50%; object-fit: cover; background: #E2E8F0; display: block; flex-shrink: 0; }
.rh-rider-info { display: flex; flex-direction: column; }
.rh-rider-name { font-size: 13.5px; font-weight: 700; color: #1E293B; }
.rh-rider-code { font-size: 11.5px; color: #64748B; font-weight: 600; text-transform: uppercase; margin-top: 1px; }

.rh-tx-code { font-family: 'SFMono-Regular', Consolas, monospace; font-size: 12px; font-weight: 700; color: #1E293B; }
.rh-ref-code { font-family: 'SFMono-Regular', Consolas, monospace; font-size: 12.5px; font-weight: 600; color: #64748B; }

.rh-pm-cell { display: flex; align-items: center; gap: 10px; }
.rh-pm-logo { width: 32px; height: 20px; object-fit: contain; flex-shrink: 0; display: flex; align-items: center; justify-content: center; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 4px; padding: 2px; }
.rh-pm-info { display: flex; flex-direction: column; }
.rh-pm-name { font-size: 12.5px; font-weight: 700; color: #1E293B; }
.rh-pm-sub { font-size: 11px; color: #64748B; margin-top: 1px; }

.rh-amount { font-weight: 700; font-size: 13.5px; color: #15803D; }
.rh-amount.refunded { color: #EF4444; }

.status-badge { display: inline-flex; align-items: center; padding: 4px 10px; border-radius: 20px; font-size: 11.5px; font-weight: 700; border: 1.5px solid transparent; }
.badge-successful { background: #DCFCE7; color: #15803D; border-color: #BBF7D0; }
.badge-processing { background: #EFF6FF; color: #1D4ED8; border-color: #BFDBFE; }
.badge-failed { background: #FEE2E2; color: #B91C1C; border-color: #FECACA; }

.badge-no-damage { background: #DCFCE7; color: #15803D; border-color: #BBF7D0; }
.badge-damage { background: #FEF3C7; color: #B45309; border-color: #FDE68A; }

.action-view-btn { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; background: #fff; border: 1.5px solid #E2E8F0; border-radius: 8px; font-size: 12px; font-weight: 700; color: #475569; cursor: pointer; transition: all .15s; }
.action-view-btn:hover { border-color: #2a195c; color: #2a195c; background: #F8FAFC; }
.action-process-btn { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; background: #2a195c; border: 1.5px solid #2a195c; border-radius: 8px; font-size: 12px; font-weight: 700; color: #fff; cursor: pointer; transition: all .15s; }
.action-process-btn:hover { background: #4338CA; border-color: #4338CA; }

.rh-tcard-ft { display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; border-top: 1px solid #E2E8F0; background: #FAFBFD; flex-wrap: wrap; gap: 12px; }
.rh-tcard-ft-lbl { font-size: 13px; color: #64748B; font-weight: 500; }
.rh-pg { display: flex; align-items: center; gap: 4px; }
.rh-pgb { width: 32px; height: 32px; border: 1.5px solid #E2E8F0; border-radius: 8px; background: #fff; font-size: 13px; font-weight: 700; color: #475569; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all .15s; }
.rh-pgb:hover:not(:disabled) { border-color: #2a195c; color: #2a195c; }
.rh-pgb.cur { background: #FAF5FF; color: #2a195c; border-color: #2a195c; }
.rh-pgb:disabled { opacity: 0.5; cursor: not-allowed; }
.rh-pg-dots { padding: 0 4px; color: #64748B; font-size: 13px; }

.rh-limit-select { padding: 8px 12px; border: 1.5px solid #E2E8F0; border-radius: 8px; font-size: 12.5px; font-weight: 600; outline: none; background: #fff; color: #475569; cursor: pointer; appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748B' stroke-width='2.5'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' /%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 10px center; background-size: 11px; padding-right: 28px; }

/* Modal overlay styling */
.rh-modal-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.rh-modal-card { background: #fff; border-radius: 16px; width: 440px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04); display: flex; flex-direction: column; overflow: hidden; animation: modalSlide .2s ease-out; }
.rh-modal-hdr { padding: 18px 20px; border-bottom: 1.5px solid #F1F5F9; display: flex; align-items: center; justify-content: space-between; }
.rh-modal-title { font-size: 16px; font-weight: 800; color: #0F172A; }
.rh-modal-close { background: none; border: none; cursor: pointer; color: #94A3B8; display: flex; transition: color .15s; }
.rh-modal-close:hover { color: #475569; }
.rh-modal-body { padding: 20px; display: flex; flex-direction: column; gap: 16px; }
.rh-modal-ft { padding: 16px 20px; background: #FAFBFD; border-top: 1.5px solid #F1F5F9; display: flex; justify-content: flex-end; gap: 8px; }

.modal-row { display: flex; justify-content: space-between; align-items: center; font-size: 13px; }
.modal-lbl { color: #64748B; font-weight: 500; }
.modal-val { font-weight: 700; color: #0F172A; }

.modal-input-wrap { display: flex; flex-direction: column; gap: 6px; }
.modal-input { padding: 10px 12px; border: 1.5px solid #E2E8F0; border-radius: 10px; font-size: 13.5px; outline: none; transition: border-color .15s; font-weight: 700; color: #0F172A; }
.modal-input:focus { border-color: #2a195c; }

@keyframes modalSlide {
  from { transform: translateY(10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
`;

interface PendingRefund {
  id: string;
  rider: { name: string; code: string; avatar: string };
  vehicle: string;
  returnDate: string;
  deposit: number;
  condition: 'No Damage' | 'Damage Charged';
  deductions: number;
}

interface CompletedRefund {
  rider: { name: string; code: string; avatar: string };
  refundDate: string;
  txId: string;
  deposit: number;
  refundAmount: number;
  method: string;
  logoType: 'gpay' | 'visa' | 'phonepe' | 'mastercard' | 'paytm' | 'upi';
  status: 'Successful' | 'Processing' | 'Failed';
}

export default function DepositRefundPage() {
  const [activeTab, setActiveTab] = useState('Pending'); // Pending, Completed
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Pending refunds state
  const [pendingRefunds, setPendingRefunds] = useState<PendingRefund[]>([
    {
      id: 'REF-PND-001',
      rider: { name: 'Amit Patel', code: 'EVB8876', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80' },
      vehicle: 'VH-1024',
      returnDate: '14 June 2026, 02:30 PM',
      deposit: 2000,
      condition: 'No Damage',
      deductions: 0
    },
    {
      id: 'REF-PND-002',
      rider: { name: 'Priya Sharma', code: 'EVS4432', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80' },
      vehicle: 'VH-8890',
      returnDate: '14 June 2026, 11:15 AM',
      deposit: 2500,
      condition: 'Damage Charged',
      deductions: 300
    },
    {
      id: 'REF-PND-003',
      rider: { name: 'Karan Singh', code: 'EVB6543', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80' },
      vehicle: 'VH-3321',
      returnDate: '13 June 2026, 04:50 PM',
      deposit: 2000,
      condition: 'No Damage',
      deductions: 0
    },
    {
      id: 'REF-PND-004',
      rider: { name: 'Riya Verma', code: 'EVS9908', avatar: 'https://images.unsplash.com/photo-1534751516642-a131fed10495?auto=format&fit=crop&w=100&q=80' },
      vehicle: 'VH-5542',
      returnDate: '12 June 2026, 01:20 PM',
      deposit: 2500,
      condition: 'No Damage',
      deductions: 0
    }
  ]);

  // Completed refunds state
  const [completedRefunds, setCompletedRefunds] = useState<CompletedRefund[]>([
    {
      rider: { name: 'Arjun Mehta', code: 'EVB1234', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80' },
      refundDate: '12 June 2026, 11:05 AM',
      txId: 'REF-240612-0001',
      deposit: 2000,
      refundAmount: 2000,
      method: 'Google Pay',
      logoType: 'gpay',
      status: 'Successful'
    },
    {
      rider: { name: 'Neha Singh', code: 'EVS5678', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80' },
      refundDate: '11 June 2026, 10:30 AM',
      txId: 'REF-240611-0002',
      deposit: 2500,
      refundAmount: 2200,
      method: 'Visa **** 4242',
      logoType: 'visa',
      status: 'Successful'
    },
    {
      rider: { name: 'Rahul Kumar', code: 'EVB9012', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80' },
      refundDate: '10 June 2026, 09:20 AM',
      txId: 'REF-240610-0003',
      deposit: 2000,
      refundAmount: 2000,
      method: 'PhonePe',
      logoType: 'phonepe',
      status: 'Successful'
    },
    {
      rider: { name: 'Sneha Reddy', code: 'EVS7890', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80' },
      refundDate: '09 June 2026, 08:45 AM',
      txId: 'REF-240609-0004',
      deposit: 2500,
      refundAmount: 2500,
      method: 'Paytm',
      logoType: 'paytm',
      status: 'Successful'
    }
  ]);

  // Modal State
  const [selectedPending, setSelectedPending] = useState<PendingRefund | null>(null);
  const [damageDeductions, setDamageDeductions] = useState<number>(0);
  const [refundMethod, setRefundMethod] = useState('UPI (Google Pay)');

  const openRefundModal = (r: PendingRefund) => {
    setSelectedPending(r);
    setDamageDeductions(r.deductions);
  };

  const closeRefundModal = () => {
    setSelectedPending(null);
  };

  const handleProcessRefund = () => {
    if (!selectedPending) return;

    const refundAmount = selectedPending.deposit - damageDeductions;
    const newCompleted: CompletedRefund = {
      rider: selectedPending.rider,
      refundDate: new Date().toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }),
      txId: `REF-${Date.now().toString().slice(-8)}`,
      deposit: selectedPending.deposit,
      refundAmount: refundAmount,
      method: refundMethod,
      logoType: refundMethod.toLowerCase().includes('google') ? 'gpay' : refundMethod.toLowerCase().includes('visa') ? 'visa' : 'upi',
      status: 'Successful'
    };

    setCompletedRefunds(prev => [newCompleted, ...prev]);
    setPendingRefunds(prev => prev.filter(item => item.id !== selectedPending.id));
    setSelectedPending(null);
    alert(`Refund of ₹${refundAmount} successfully processed for ${selectedPending.rider.name}!`);
  };

  const filteredPending = useMemo(() => {
    return pendingRefunds.filter(r => {
      const matchSearch =
        r.rider.name.toLowerCase().includes(search.toLowerCase()) ||
        r.rider.code.toLowerCase().includes(search.toLowerCase()) ||
        r.vehicle.toLowerCase().includes(search.toLowerCase());
      
      const matchStatus = statusFilter === 'All' || 
        (statusFilter === 'No Damage' && r.condition === 'No Damage') ||
        (statusFilter === 'Damage Charged' && r.condition === 'Damage Charged');

      return matchSearch && matchStatus;
    });
  }, [pendingRefunds, search, statusFilter]);

  const filteredCompleted = useMemo(() => {
    return completedRefunds.filter(r => {
      const matchSearch =
        r.rider.name.toLowerCase().includes(search.toLowerCase()) ||
        r.rider.code.toLowerCase().includes(search.toLowerCase()) ||
        r.txId.toLowerCase().includes(search.toLowerCase());

      const matchStatus = statusFilter === 'All' || r.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [completedRefunds, search, statusFilter]);

  const getSortIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 6, color: '#94A3B8' }}>
      <polyline points="15 18 12 21 9 18" />
      <polyline points="9 6 12 3 15 6" />
      <line x1="12" y1="3" x2="12" y2="21" />
    </svg>
  );

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

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="rh-shell">
        <Sidebar activePath="/payment/refund" />
        <div className="rh-main">
          <TopBar />
          
          <div className="rh-page">
            {/* Header */}
            <div className="rh-title-row">
              <div>
                <h1 className="rh-h1">Deposit Refunds</h1>
                <p className="rh-sub">Process security deposit refunds for riders returning their vehicles and view complete refund history.</p>
              </div>
              <div className="rh-actions">
                <button className="rh-btn">
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

            {/* Navigation Tabs */}
            <div className="rh-tabs">
              <div 
                className={`rh-tab ${activeTab === 'Pending' ? 'active' : ''}`}
                onClick={() => { setActiveTab('Pending'); setStatusFilter('All'); }}
              >
                Pending Deposits ({pendingRefunds.length})
              </div>
              <div 
                className={`rh-tab ${activeTab === 'Completed' ? 'active' : ''}`}
                onClick={() => { setActiveTab('Completed'); setStatusFilter('All'); }}
              >
                Refund History ({completedRefunds.length})
              </div>
            </div>

            {/* Filter Bar */}
            <div className="rh-filter-card">
              <div className="rh-filter-grid">
                <div className="rh-search-wrap">
                  <span className="rh-search-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    className="rh-search-input"
                    placeholder={activeTab === 'Pending' ? "Search by Rider, Vehicle ID..." : "Search by Rider, Tx ID..."}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <div>
                  <select
                    className="rh-select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    {activeTab === 'Pending' ? (
                      <>
                        <option value="All">All Conditions</option>
                        <option value="No Damage">No Damage</option>
                        <option value="Damage Charged">Damage Charged</option>
                      </>
                    ) : (
                      <>
                        <option value="All">All Statuses</option>
                        <option value="Successful">Successful</option>
                        <option value="Processing">Processing</option>
                        <option value="Failed">Failed</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                <button className="rh-date-picker">
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="rh-date-icon">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                    </span>
                    14 June 2026 - 14 June 2026
                  </span>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 2, color: '#64748B' }}>
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                </div>

                <button className="rh-filter-btn">
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

            {/* Table layout based on active tab */}
            {activeTab === 'Pending' ? (
              <div className="rh-tcard">
                <div className="rh-dt-wrap">
                  <table className="rh-dt">
                    <thead>
                      <tr>
                        <th className="sortable">RIDER / CUSTOMER {getSortIcon()}</th>
                        <th className="sortable">VEHICLE ID {getSortIcon()}</th>
                        <th className="sortable">RETURN DATE & TIME {getSortIcon()}</th>
                        <th className="sortable">SECURITY DEPOSIT {getSortIcon()}</th>
                        <th className="sortable">INSPECTION CONDITION {getSortIcon()}</th>
                        <th>ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPending.length === 0 ? (
                        <tr>
                          <td colSpan={6} style={{ textAlign: 'center', padding: '30px', color: '#64748B' }}>
                            No pending deposits found matching filters.
                          </td>
                        </tr>
                      ) : (
                        filteredPending.map((r, index) => (
                          <tr key={index}>
                            <td>
                              <div className="rh-rider-cell">
                                <img src={r.rider.avatar} alt={r.rider.name} className="rh-rider-avatar" />
                                <div className="rh-rider-info">
                                  <span className="rh-rider-name">{r.rider.name}</span>
                                  <span className="rh-rider-code">{r.rider.code}</span>
                                </div>
                              </div>
                            </td>
                            <td style={{ fontWeight: '700', color: '#0F172A' }}>{r.vehicle}</td>
                            <td style={{ fontWeight: '500' }}>{r.returnDate}</td>
                            <td style={{ fontWeight: '700' }}>₹{r.deposit}</td>
                            <td>
                              <span className={`status-badge badge-${r.condition.toLowerCase().replace(' ', '-')}`}>
                                {r.condition}
                              </span>
                            </td>
                            <td>
                              <button 
                                className="action-process-btn"
                                onClick={() => openRefundModal(r)}
                              >
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M20 11.08V12a8 8 0 1 1-4.8-7.32" />
                                  <polyline points="22 4 12 14.01 9 11.01" />
                                </svg>
                                Refund Deposit
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                
                <div className="rh-tcard-ft">
                  <span className="rh-tcard-ft-lbl">Showing {filteredPending.length} of {pendingRefunds.length} pending records</span>
                </div>
              </div>
            ) : (
              <div className="rh-tcard">
                <div className="rh-dt-wrap">
                  <table className="rh-dt">
                    <thead>
                      <tr>
                        <th className="sortable">RIDER / CUSTOMER {getSortIcon()}</th>
                        <th className="sortable">REFUND DATE & TIME {getSortIcon()}</th>
                        <th className="sortable">REFUND TX ID {getSortIcon()}</th>
                        <th className="sortable">ORIGINAL DEPOSIT {getSortIcon()}</th>
                        <th className="sortable">REFUND AMOUNT {getSortIcon()}</th>
                        <th>REFUND METHOD</th>
                        <th>STATUS</th>
                        <th>ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCompleted.length === 0 ? (
                        <tr>
                          <td colSpan={8} style={{ textAlign: 'center', padding: '30px', color: '#64748B' }}>
                            No refund records found matching filters.
                          </td>
                        </tr>
                      ) : (
                        filteredCompleted.map((r, index) => (
                          <tr key={index}>
                            <td>
                              <div className="rh-rider-cell">
                                <img src={r.rider.avatar} alt={r.rider.name} className="rh-rider-avatar" />
                                <div className="rh-rider-info">
                                  <span className="rh-rider-name">{r.rider.name}</span>
                                  <span className="rh-rider-code">{r.rider.code}</span>
                                </div>
                              </div>
                            </td>
                            <td style={{ fontWeight: '500' }}>{r.refundDate}</td>
                            <td className="rh-tx-code">{r.txId}</td>
                            <td style={{ fontWeight: '500', color: '#64748B' }}>₹{r.deposit}</td>
                            <td>
                              <span className="rh-amount">
                                ₹{r.refundAmount}
                              </span>
                            </td>
                            <td>
                              <div className="rh-pm-cell">
                                <div className="rh-pm-logo">{pmLogo(r.logoType)}</div>
                                <div className="rh-pm-info">
                                  <span className="rh-pm-name">{r.method}</span>
                                </div>
                              </div>
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
                                Receipt
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="rh-tcard-ft">
                  <span className="rh-tcard-ft-lbl">Showing {filteredCompleted.length} of {completedRefunds.length} completed transactions</span>
                  
                  <div className="rh-pg">
                    <button className="rh-pgb" disabled>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="15 18 9 12 15 6" />
                      </svg>
                    </button>
                    <button className="rh-pgb cur">1</button>
                    <button className="rh-pgb" disabled>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Process Refund Modal */}
      {selectedPending && (
        <div className="rh-modal-overlay">
          <div className="rh-modal-card">
            <div className="rh-modal-hdr">
              <span className="rh-modal-title">Process Deposit Refund</span>
              <button className="rh-modal-close" onClick={closeRefundModal}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            
            <div className="rh-modal-body">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#F8FAFC', padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <img src={selectedPending.rider.avatar} alt={selectedPending.rider.name} style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: 800, fontSize: '14px', color: '#0F172A' }}>{selectedPending.rider.name}</span>
                  <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Rider ID: {selectedPending.rider.code}</span>
                </div>
              </div>

              <div className="modal-row">
                <span className="modal-lbl">Vehicle Returned</span>
                <span className="modal-val">{selectedPending.vehicle}</span>
              </div>
              <div className="modal-row">
                <span className="modal-lbl">Return Date</span>
                <span className="modal-val" style={{ fontSize: '12px' }}>{selectedPending.returnDate}</span>
              </div>
              <div className="modal-row">
                <span className="modal-lbl">Inspection Condition</span>
                <span className={`status-badge badge-${selectedPending.condition.toLowerCase().replace(' ', '-')}`}>
                  {selectedPending.condition}
                </span>
              </div>

              <div style={{ borderTop: '1px dashed #E2E8F0', margin: '4px 0' }} />

              <div className="modal-row">
                <span className="modal-lbl">Security Deposit Paid</span>
                <span className="modal-val" style={{ fontSize: '14px' }}>₹{selectedPending.deposit}</span>
              </div>

              <div className="modal-input-wrap">
                <label className="modal-lbl">Damage / Outstanding Deductions (₹)</label>
                <input 
                  type="number" 
                  className="modal-input" 
                  value={damageDeductions}
                  onChange={(e) => setDamageDeductions(Number(e.target.value))}
                  min={0}
                  max={selectedPending.deposit}
                />
              </div>

              <div className="modal-input-wrap">
                <label className="modal-lbl">Refund Destination Method</label>
                <select 
                  className="rh-select" 
                  style={{ width: '100%', background: '#fff' }}
                  value={refundMethod}
                  onChange={(e) => setRefundMethod(e.target.value)}
                >
                  <option>UPI (Google Pay)</option>
                  <option>UPI (PhonePe)</option>
                  <option>UPI (Paytm)</option>
                  <option>Original Visa Card (**** 4242)</option>
                  <option>Original Bank Account</option>
                </select>
              </div>

              <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '14px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#065F46' }}>Total Refund Amount</span>
                <span style={{ fontSize: '18px', fontWeight: 800, color: '#065F46' }}>₹{selectedPending.deposit - damageDeductions}</span>
              </div>
            </div>

            <div className="rh-modal-ft">
              <button className="rh-btn" onClick={closeRefundModal}>Cancel</button>
              <button 
                className="rh-btn rh-btn-primary" 
                onClick={handleProcessRefund}
                disabled={damageDeductions > selectedPending.deposit || damageDeductions < 0}
              >
                Confirm Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
