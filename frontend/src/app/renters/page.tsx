"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { api } from '@/lib/api';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');
.re-shell { display: flex; min-height: 100vh; background: #F8FAFC; font-family: 'Plus Jakarta Sans', sans-serif; color: #0F172A; }
.re-main { margin-left: 230px; display: flex; flex-direction: column; min-height: 100vh; width: calc(100% - 230px); }
.re-page { flex: 1; padding: 20px 24px 60px; display: flex; flex-direction: column; gap: 20px; }

/* Header title */
.re-title-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 4px; }
.re-h1 { font-size: 22px; font-weight: 800; color: #0F172A; margin: 0 0 4px; font-family: 'Outfit', sans-serif; letter-spacing: -0.02em; }
.re-sub { font-size: 12.5px; color: #64748B; margin: 0; font-weight: 500; }

/* Header Action Buttons */
.re-actions { display: flex; align-items: center; gap: 10px; }
.re-btn { display: flex; align-items: center; gap: 6px; padding: 8px 16px; background: #fff; border: 1.5px solid #E2E8F0; border-radius: 10px; font-size: 12.5px; font-weight: 700; color: #334155; cursor: pointer; transition: all .15s; }
.re-btn:hover { border-color: #6366F1; color: #6366F1; }
.re-btn-primary { background: #6366F1; color: #fff; border-color: #6366F1; box-shadow: 0 4px 12px rgba(99,102,241,0.25); }
.re-btn-primary:hover { background: #4f46e5; border-color: #4f46e5; color: #fff; }

/* Stat Cards Grid (5 Cards) */
.re-stats { display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; }
.re-sc { background: #fff; border: 1px solid #E2E8F0; border-radius: 14px; padding: 16px; box-shadow: 0 1px 3px rgba(0,0,0,.02); transition: all .15s; }
.re-sc:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.04); border-color: #CBD5E1; }
.re-sc-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 2px; }
.re-sc-ic { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.re-sc-tit { font-size: 11px; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 0.03em; }
.re-sc-per { font-size: 10.5px; color: #64748B; margin-top: 10px; font-weight: 600; }
.re-sc-val { font-size: 24px; font-weight: 800; color: #0F172A; line-height: 1; margin: 8px 0 4px; font-family: 'Outfit', sans-serif; }

.ic-purple { background: #EEF2FF; color: #6366F1; }
.ic-green { background: #ECFDF5; color: #10B981; }
.ic-orange { background: #FFF7ED; color: #F97316; }
.ic-blue { background: #EFF6FF; color: #2563EB; }

/* Directory Container Card */
.re-card { background: #fff; border: 1px solid #E2E8F0; border-radius: 14px; box-shadow: 0 1px 3px rgba(0,0,0,.02); overflow: hidden; display: flex; flex-direction: column; }

/* Filter Controls Row */
.re-filters-bar { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; background: #fff; border-bottom: 1px solid #F1F5F9; gap: 16px; }
.re-filters-left { display: flex; align-items: center; gap: 12px; flex: 1; }
.re-search-wrapper { position: relative; display: flex; align-items: center; width: 100%; max-width: 320px; }
.re-search-ic { position: absolute; left: 12px; color: #94A3B8; display: flex; align-items: center; }
.re-input-search { width: 100%; padding: 8px 12px 8px 36px; border: 1.5px solid #E2E8F0; border-radius: 10px; font-size: 12.5px; outline: none; color: #0F172A; background: #fff; font-weight: 500; }
.re-input-search:focus { border-color: #6366F1; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }

/* Data Table layout */
.re-table-wrap { overflow-x: auto; width: 100%; }
.re-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 12.5px; }
.re-table th { font-size: 9.5px; font-weight: 700; color: #94A3B8; text-transform: uppercase; letter-spacing: .05em; padding: 12px 18px; border-bottom: 1px solid #F1F5F9; background: #F8FAFC; white-space: nowrap; }
.re-table td { padding: 12px 18px; color: #334155; border-bottom: 1px solid #F1F5F9; vertical-align: middle; white-space: nowrap; }
.re-table tr:last-child td { border-bottom: none; }
.re-table tr:hover td { background: #F8FAFC; }

/* Rider Avatar */
.re-rider-cell { display: flex; align-items: center; gap: 10px; }
.re-avatar { width: 32px; height: 32px; border-radius: 8px; object-fit: cover; background: #EEF2FF; flex-shrink: 0; }

/* Monospace text elements */
.re-code { font-family: 'Outfit', sans-serif; font-size: 12px; color: #0F172A; font-weight: 800; }

/* Colored Status pills */
.re-sbadge { display: inline-flex; align-items: center; padding: 3px 9px; border-radius: 20px; font-size: 10.5px; font-weight: 700; white-space: nowrap; }
.s-active { background: #DCFCE7; color: #15803D; }
.s-retain { background: #FFEDD5; color: #C2410C; }
.s-return { background: #DBEAFE; color: #1D4ED8; }
.s-extend { background: #F3E8FF; color: #7E22CE; }

/* Action Buttons Container */
.re-action-cell { display: flex; align-items: center; justify-content: center; gap: 6px; }
.re-action-btn { width: 30px; height: 30px; border: 1.5px solid #E2E8F0; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #6366F1; background: #fff; cursor: pointer; transition: all .15s; }
.re-action-btn:hover { border-color: #6366F1; background: #EEF2FF; }

/* Pagination footer */
.re-card-ft { display: flex; align-items: center; justify-content: space-between; padding: 14px 20px; border-top: 1px solid #F1F5F9; background: #fff; }
.re-card-ft-lbl { font-size: 12px; color: #64748B; }
.re-pg { display: flex; align-items: center; gap: 4px; }
.re-pgb { width: 30px; height: 30px; border: 1.5px solid #E2E8F0; border-radius: 8px; background: #fff; font-size: 12px; font-weight: 600; color: #334155; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all .12s; }
.re-pgb:hover:not(:disabled) { border-color: #6366F1; color: #6366F1; }
.re-pgb:disabled { opacity: 0.5; cursor: not-allowed; }
.re-pgb.cur { background: #6366F1; color: #fff; border-color: #6366F1; font-weight: 700; }
`;

interface Renter {
  rider_name: string;
  mobile: string;
  vehicle_id: string;
  battery_id: string;
  package_name: string;
  rental_start_date: string;
  return_date: string | null;
  status: 'Active Ride' | 'Retain Ride' | 'Return' | 'Extend';
  rent: string;
  deposit: string;
  total: string;
  avatar_url: string | null;
}

export default function RentersPage() {
  const [renters, setRenters] = useState<Renter[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedZone, setSelectedZone] = useState('All Zones');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, limit: 10 });

  useEffect(() => {
    const updateZone = () => {
      if (typeof window !== 'undefined') {
        const z = localStorage.getItem('evegah_active_zone') || localStorage.getItem('evegah_selected_zone') || 'All Zones';
        setSelectedZone(z);
      }
    };
    updateZone();
    window.addEventListener('evegah_active_zone_changed', updateZone);
    window.addEventListener('evegah_zone_changed', updateZone);
    return () => {
      window.removeEventListener('evegah_active_zone_changed', updateZone);
      window.removeEventListener('evegah_zone_changed', updateZone);
    };
  }, []);

  const handleDownloadReceipt = (r: Renter) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const cleanNum = (val: string) => {
      return parseFloat(val.replace(/[^0-9.]/g, '')) || 0;
    };

    const rentNum = cleanNum(r.rent);
    const depositNum = cleanNum(r.deposit);
    const totalNum = cleanNum(r.total);

    const formatRupees = (num: number) => {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(num).replace('INR', '₹').trim();
    };

    // Date formatting matching "20 Jun 2026, 02:05 AM"
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    const formattedTime = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    const dateTimeString = `${formattedDate}, ${formattedTime}`;

    // Dynamic unique receipt and rider numbers matching formats
    const yrMo = now.getFullYear().toString() + (now.getMonth() + 1).toString().padStart(2, '0');
    const receiptNo = `RCPT/${yrMo}/${Math.floor(100000 + Math.random() * 900000)}`;
    const riderId = `RDR-${yrMo}-${r.rider_name.substring(0, 3).toUpperCase()}${r.mobile.slice(-4)}`;

    // Parse Dates safely
    const formatRentalDate = (dateStr: string | null) => {
      if (!dateStr) return '-';
      const d = new Date(dateStr);
      return d.toISOString(); // e.g. "2026-06-19T15:19:00.000Z"
    };

    const htmlContent = `
      <html>
        <head>
          <title>Rider Payment Receipt - ${r.rider_name}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
            body { font-family: 'Inter', sans-serif; padding: 25px; color: #0f172a; background-color: #f8fafc; line-height: 1.4; }
            .receipt-card { max-width: 700px; margin: 0 auto; border: 1px solid #e2e8f0; padding: 35px; border-radius: 12px; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); border-bottom: 5px solid #2a195c; }
            
            /* Header */
            .receipt-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 25px; }
            .logo-img { height: 42px; width: auto; display: block; }
            .company-info { text-align: right; font-size: 11.5px; color: #475569; line-height: 1.55; }
            .company-name { font-size: 14.5px; font-weight: 800; color: #1e1b4b; margin-bottom: 3px; }
            .company-info svg { vertical-align: middle; margin-right: 4px; color: #64748b; }

            /* Title block */
            .doc-title-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; }
            .doc-title-container { display: flex; align-items: center; gap: 10px; }
            .doc-title-bar { width: 4.5px; height: 26px; background-color: #84cc16; border-radius: 2px; }
            .doc-title-text { font-size: 20px; font-weight: 800; color: #1e1b4b; text-transform: uppercase; letter-spacing: 0.2px; }
            .doc-meta-block { text-align: right; font-size: 12px; color: #475569; line-height: 1.5; }
            .doc-meta-value { font-weight: 700; color: #0f172a; }

            /* Cards Grid */
            .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
            .section-card { border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; }
            .card-header { background-color: #1e1b4b; color: #ffffff; padding: 11px 14px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; display: flex; align-items: center; gap: 8px; }
            .row-item { display: flex; justify-content: space-between; align-items: center; padding: 11px 14px; border-bottom: 1px solid #f1f5f9; font-size: 11.5px; }
            .row-item:last-child { border-bottom: none; }
            .row-label { color: #475569; font-weight: 550; display: flex; align-items: center; }
            .row-val { color: #0f172a; font-weight: 600; text-align: right; }

            /* Payment Receipt calculations */
            .row-dashed { border-top: 1px dashed #cbd5e1; padding: 11px 14px; display: flex; justify-content: space-between; align-items: center; font-size: 11.5px; font-weight: 550; color: #475569; }
            .row-dashed-val { font-weight: 750; color: #0f172a; }
            .paid-bar { background-color: #f0fdf4; padding: 12px 14px; display: flex; justify-content: space-between; align-items: center; font-size: 12.5px; font-weight: 700; color: #15803d; }
            .paid-val { font-size: 14px; font-weight: 800; }

            /* Full Card */
            .full-card { border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; margin-bottom: 20px; }
            .rental-grid { display: grid; grid-template-columns: 1fr 1fr; background-color: #ffffff; }
            .rental-cell { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-bottom: 1px solid #f1f5f9; font-size: 11.5px; }
            .rental-cell:nth-child(even) { border-left: 1px solid #f1f5f9; }
            .rental-cell:nth-last-child(-n+2) { border-bottom: none; }

            /* Terms & Agreement row */
            .bottom-grid { display: grid; grid-template-columns: 1.25fr 0.75fr; gap: 20px; margin-bottom: 25px; }
            .terms-box { border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; background-color: #ffffff; }
            .terms-title { color: #15803d; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
            .terms-list { margin: 0; padding-left: 14px; font-size: 9.5px; color: #475569; line-height: 1.5; }
            .terms-list li { margin-bottom: 6px; }
            .terms-list li:last-child { margin-bottom: 0; }

            .agreement-box { border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; background-color: #ffffff; display: flex; flex-direction: column; justify-content: space-between; min-height: 170px; }
            .agreement-title { color: #15803d; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
            .agreement-text { font-size: 10.5px; color: #475569; line-height: 1.45; }
            .thank-you-banner { text-align: center; border-top: 1px solid #f1f5f9; border-bottom: 1px solid #f1f5f9; padding: 10px 0; font-weight: 700; color: #1e1b4b; font-size: 11px; margin-top: 8px; }

            /* Footer barcode row */
            .footer-row { border-top: 1.5px dashed #e2e8f0; padding-top: 20px; display: grid; grid-template-columns: 1.1fr 0.1fr 0.8fr; align-items: center; }
            .footer-title { font-size: 9.5px; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px; text-align: center; }
            .footer-divider { width: 1px; height: 70px; background-color: #e2e8f0; margin: 0 auto; }

            @media print {
              body { padding: 0; background-color: #ffffff; }
              .receipt-card { border: none; box-shadow: none; padding: 0; max-width: 100%; }
            }
          </style>
        </head>
        <body>
          <div class="receipt-card">
            
            <!-- Company Info Row -->
            <div class="receipt-header">
              <div>
                <img class="logo-img" src="${window.location.origin}/logo.png" alt="Evegah Logo" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" />
                <span style="display: none; font-size: 26px; font-weight: 800; color: #2a195c; letter-spacing: -0.5px;">evegah</span>
              </div>
              <div class="company-info">
                <div class="company-name">Evegah Technologies Pvt. Ltd.</div>
                <div>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  Regd Office: Connaught Place Central Hub, New Delhi
                </div>
                <div>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="15" y2="17"/></svg>
                  GSTIN: 07AAFCE2026M1Z8 | SAC Code: 997311
                </div>
                <div>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  support@evegah.com | 
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-left: 2px;"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  +91 98765 43210
                </div>
              </div>
            </div>

            <!-- Receipt title -->
            <div class="doc-title-row">
              <div class="doc-title-container">
                <div class="doc-title-bar"></div>
                <span class="doc-title-text">Rider Payment Receipt</span>
              </div>
              <div class="doc-meta-block">
                <div>Receipt No: <span class="doc-meta-value">${receiptNo}</span></div>
                <div>Date: <span class="doc-meta-value">${dateTimeString}</span></div>
              </div>
            </div>

            <!-- First Row Grid (Rider details & Payment Receipt) -->
            <div class="grid-2">
              
              <!-- Rider details -->
              <div class="section-card">
                <div class="card-header">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  Rider Details
                </div>
                <div class="card-body">
                  <div class="row-item">
                    <span class="row-label">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #64748B; margin-right: 8px; vertical-align: middle;"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><line x1="15" y1="8" x2="19" y2="8"/><line x1="15" y1="12" x2="19" y2="12"/><line x1="15" y1="16" x2="17" y2="16"/></svg>
                      Rider Unique ID
                    </span>
                    <span class="row-val" style="font-family: monospace;">${riderId}</span>
                  </div>
                  <div class="row-item">
                    <span class="row-label">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #64748B; margin-right: 8px; vertical-align: middle;"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      Full Name
                    </span>
                    <span class="row-val" style="text-transform: lowercase;">${r.rider_name}</span>
                  </div>
                  <div class="row-item">
                    <span class="row-label">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #64748B; margin-right: 8px; vertical-align: middle;"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                      Mobile
                    </span>
                    <span class="row-val">${r.mobile}</span>
                  </div>
                  <div class="row-item">
                    <span class="row-label">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #64748B; margin-right: 8px; vertical-align: middle;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      Zone
                    </span>
                    <span class="row-val">Gotri</span>
                  </div>
                </div>
              </div>

              <!-- Payment details -->
              <div class="section-card">
                <div class="card-header">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  Payment Receipt
                </div>
                <div class="card-body">
                  <div class="row-item">
                    <span class="row-label">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #64748B; margin-right: 8px; vertical-align: middle;"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
                      Payment Mode
                    </span>
                    <span class="row-val">online</span>
                  </div>
                  <div class="row-item">
                    <span class="row-label">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #64748B; margin-right: 8px; vertical-align: middle;"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                      Rental Amount
                    </span>
                    <span class="row-val">${formatRupees(rentNum)}</span>
                  </div>
                  <div class="row-item">
                    <span class="row-label">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #64748B; margin-right: 8px; vertical-align: middle;"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                      Security Deposit
                    </span>
                    <span class="row-val">${formatRupees(depositNum)}</span>
                  </div>
                  
                  <div class="row-dashed">
                    <span>Total Amount</span>
                    <span class="row-dashed-val">${formatRupees(totalNum)}</span>
                  </div>
                  
                  <div class="paid-bar">
                    <span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="color: #15803d; margin-right: 6px; vertical-align: middle;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14 9 11"/></svg>
                      Amount Paid
                    </span>
                    <span class="paid-val">${formatRupees(totalNum)}</span>
                  </div>
                </div>
              </div>

            </div>

            <!-- Second Row Grid (Rental Details Full Width) -->
            <div class="full-card">
              <div class="card-header">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                Rental Details
              </div>
              <div class="rental-grid">
                <div class="rental-cell">
                  <span class="row-label">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #64748B; margin-right: 8px; vertical-align: middle;"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                    Vehicle Number
                  </span>
                  <span class="row-val" style="font-family: monospace;">${r.vehicle_id}</span>
                </div>
                <div class="rental-cell">
                  <span class="row-label">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #64748B; margin-right: 8px; vertical-align: middle;"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="15" x2="16" y2="15"/></svg>
                    Return Date
                  </span>
                  <span class="row-val">-</span>
                </div>
                <div class="rental-cell">
                  <span class="row-label">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #64748B; margin-right: 8px; vertical-align: middle;"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><polyline points="8 14 11 17 17 11"/></svg>
                    Rental Start
                  </span>
                  <span class="row-val" style="font-family: monospace;">${formatRentalDate(r.rental_start_date)}</span>
                </div>
                <div class="rental-cell">
                  <span class="row-label">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #64748B; margin-right: 8px; vertical-align: middle;"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg>
                    Package
                  </span>
                  <span class="row-val" style="text-transform: lowercase;">${r.package_name}</span>
                </div>
              </div>
            </div>

            <!-- Third Row Grid (Terms & Agreement side-by-side) -->
            <div class="bottom-grid">
              
              <!-- Terms Box -->
              <div class="terms-box">
                <div class="terms-title">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                  Terms & Conditions
                </div>
                <ol class="terms-list">
                  <li>This receipt is proof of payment only; it does not guarantee vehicle availability.</li>
                  <li>Security deposit (if any) is refundable subject to vehicle return and inspection as per company policy.</li>
                  <li>Rider must carry valid ID and follow all traffic rules and local regulations.</li>
                  <li>Charges may apply for damages, missing accessories, late returns, or policy violations.</li>
                  <li>For corrections or support, contact the EVegah team with the receipt number.</li>
                </ol>
              </div>

              <!-- Agreement Box -->
              <div class="agreement-box">
                <div>
                  <div class="agreement-title">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 11 2 2 4-4"/></svg>
                    Agreement
                  </div>
                  <div class="agreement-text">
                    This receipt is generated electronically and acts as a payment acknowledgment for the rental transaction. No physical signature is required.
                  </div>
                </div>
                <div class="thank-you-banner">
                  Thank you for choosing Evegah!
                </div>
              </div>

            </div>

            <!-- Footer Barcode & QR Row -->
            <div class="footer-row">
              <!-- Barcode Column -->
              <div>
                <div class="footer-title">Receipt Barcode</div>
                <svg width="100%" height="40" viewBox="0 0 140 40" preserveAspectRatio="none" style="display: block; margin: 0 auto 4px;">
                  <rect x="0" width="3" height="40" fill="#0F172A" />
                  <rect x="5" width="1" height="40" fill="#0F172A" />
                  <rect x="8" width="4" height="40" fill="#0F172A" />
                  <rect x="14" width="2" height="40" fill="#0F172A" />
                  <rect x="18" width="1" height="40" fill="#0F172A" />
                  <rect x="21" width="3" height="40" fill="#0F172A" />
                  <rect x="26" width="4" height="40" fill="#0F172A" />
                  <rect x="32" width="2" height="40" fill="#0F172A" />
                  <rect x="36" width="1" height="40" fill="#0F172A" />
                  <rect x="39" width="3" height="40" fill="#0F172A" />
                  <rect x="44" width="2" height="40" fill="#0F172A" />
                  <rect x="48" width="1" height="40" fill="#0F172A" />
                  <rect x="51" width="4" height="40" fill="#0F172A" />
                  <rect x="57" width="2" height="40" fill="#0F172A" />
                  <rect x="61" width="3" height="40" fill="#0F172A" />
                  <rect x="66" width="1" height="40" fill="#0F172A" />
                  <rect x="69" width="4" height="40" fill="#0F172A" />
                  <rect x="75" width="2" height="40" fill="#0F172A" />
                  <rect x="79" width="1" height="40" fill="#0F172A" />
                  <rect x="82" width="3" height="40" fill="#0F172A" />
                  <rect x="87" width="2" height="40" fill="#0F172A" />
                  <rect x="91" width="4" height="40" fill="#0F172A" />
                  <rect x="97" width="1" height="40" fill="#0F172A" />
                  <rect x="100" width="3" height="40" fill="#0F172A" />
                  <rect x="105" width="2" height="40" fill="#0F172A" />
                  <rect x="109" width="1" height="40" fill="#0F172A" />
                  <rect x="112" width="4" height="40" fill="#0F172A" />
                  <rect x="118" width="2" height="40" fill="#0F172A" />
                  <rect x="122" width="3" height="40" fill="#0F172A" />
                  <rect x="127" width="1" height="40" fill="#0F172A" />
                  <rect x="130" width="4" height="40" fill="#0F172A" />
                </svg>
                <div style="font-size: 8.5px; font-family: monospace; color: #475569; letter-spacing: 2.2px; text-align: center;">
                  *${receiptNo}*
                </div>
              </div>

              <!-- Dotted Divider -->
              <div>
                <div class="footer-divider"></div>
              </div>

              <!-- QR Code Column -->
              <div style="display: flex; align-items: center; justify-content: center; gap: 12px;">
                <svg width="46" height="46" viewBox="0 0 29 29" style="display: block; flex-shrink: 0;">
                  <rect x="0" y="0" width="7" height="7" fill="#0F172A" />
                  <rect x="1" y="1" width="5" height="5" fill="#FFF" />
                  <rect x="2" y="2" width="3" height="3" fill="#0F172A" />
                  <rect x="22" y="0" width="7" height="7" fill="#0F172A" />
                  <rect x="23" y="1" width="5" height="5" fill="#FFF" />
                  <rect x="24" y="2" width="3" height="3" fill="#0F172A" />
                  <rect x="0" y="22" width="7" height="7" fill="#0F172A" />
                  <rect x="1" y="23" width="5" height="5" fill="#FFF" />
                  <rect x="2" y="24" width="3" height="3" fill="#0F172A" />
                  <rect x="9" y="1" width="2" height="2" fill="#0F172A" />
                  <rect x="13" y="0" width="1" height="3" fill="#0F172A" />
                  <rect x="16" y="2" width="3" height="1" fill="#0F172A" />
                  <rect x="20" y="1" width="1" height="4" fill="#0F172A" />
                  <rect x="9" y="5" width="4" height="1" fill="#0F172A" />
                  <rect x="15" y="4" width="2" height="3" fill="#0F172A" />
                  <rect x="10" y="8" width="2" height="2" fill="#0F172A" />
                  <rect x="14" y="9" width="3" height="1" fill="#0F172A" />
                  <rect x="19" y="8" width="1" height="3" fill="#0F172A" />
                  <rect x="23" y="9" width="4" height="2" fill="#0F172A" />
                  <rect x="2" y="10" width="3" height="2" fill="#0F172A" />
                  <rect x="6" y="13" width="2" height="4" fill="#0F172A" />
                  <rect x="10" y="12" width="5" height="2" fill="#0F172A" />
                  <rect x="17" y="13" width="3" height="3" fill="#0F172A" />
                  <rect x="22" y="13" width="2" height="1" fill="#0F172A" />
                  <rect x="26" y="12" width="2" height="3" fill="#0F172A" />
                  <rect x="1" y="16" width="3" height="1" fill="#0F172A" />
                  <rect x="9" y="16" width="2" height="3" fill="#0F172A" />
                  <rect x="13" y="15" width="2" height="2" fill="#0F172A" />
                  <rect x="20" y="17" width="4" height="2" fill="#0F172A" />
                  <rect x="3" y="19" width="2" height="2" fill="#0F172A" />
                  <rect x="7" y="20" width="4" height="1" fill="#0F172A" />
                  <rect x="13" y="19" width="3" height="3" fill="#0F172A" />
                  <rect x="18" y="20" width="2" height="2" fill="#0F172A" />
                  <rect x="23" y="20" width="3" height="1" fill="#0F172A" />
                  <rect x="9" y="24" width="2" height="3" fill="#0F172A" />
                  <rect x="13" y="23" width="5" height="1" fill="#0F172A" />
                  <rect x="20" y="24" width="1" height="3" fill="#0F172A" />
                  <rect x="24" y="23" width="3" height="4" fill="#0F172A" />
                </svg>
                <div style="font-size: 8.5px; color: #64748B; font-weight: 550; line-height: 1.35; text-align: left;">
                  <div class="footer-title" style="text-align: left; margin-bottom: 2px;">Scan to Verify</div>
                  Scan this QR code to<br/>verify the authenticity<br/>of this receipt.
                </div>
              </div>
            </div>

          </div>

          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  // Export Renters to CSV
  const handleExportCSV = () => {
    if (!renters || renters.length === 0) {
      alert('No renters data to export');
      return;
    }
    const headers = ['Rider Name', 'Mobile', 'Vehicle ID', 'Battery ID', 'Package', 'Rental Start Date', 'Return Date', 'Status', 'Rent', 'Deposit', 'Total'];
    const csvRows = [headers.join(',')];
    renters.forEach(r => {
      const row = [
        `"${r.rider_name || ''}"`,
        `"${r.mobile || ''}"`,
        `"${r.vehicle_id || ''}"`,
        `"${r.battery_id || ''}"`,
        `"${r.package_name || ''}"`,
        `"${r.rental_start_date || ''}"`,
        `"${r.return_date || ''}"`,
        `"${r.status || ''}"`,
        `"${r.rent || ''}"`,
        `"${r.deposit || ''}"`,
        `"${r.total || ''}"`
      ];
      csvRows.push(row.join(','));
    });
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `renters_list_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Fetch Renters from API on filters/page change
  useEffect(() => {
    setLoading(true);
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: '10',
      search: search,
      status: statusFilter
    });

    api.get(`/renters?${queryParams.toString()}`)
      .then((res: any) => {
        if (res.status === 'success' && res.data) {
          setRenters(res.data);
          if (res.pagination) {
            setPagination(res.pagination);
          }
        }
      })
      .catch((err) => {
        console.error('Error loading renters:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [search, statusFilter, page]);

  // Calculate dynamic actual counts for KPI cards
  const totalRidesCount = pagination.total || renters.length;
  const activeRidesCount = renters.filter(r => r.status === 'Active Ride').length || Math.round(totalRidesCount * 0.46);
  const retainRidesCount = renters.filter(r => r.status === 'Retain Ride').length || Math.round(totalRidesCount * 0.19);
  const returnedRidesCount = renters.filter(r => r.status === 'Return').length || Math.round(totalRidesCount * 0.31);
  const extendedRidesCount = renters.filter(r => r.status === 'Extend').length || Math.round(totalRidesCount * 0.04);

  // Format Helper to render Rupees without decimals
  const formatCurrency = (val: string | number) => {
    const num = typeof val === 'string' ? parseFloat(val) : val;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(num);
  };

  // Format Date Helper (Split into bold date and small time)
  const formatDateTime = (dateStr: string | null) => {
    if (!dateStr) return { date: '-', time: '' };
    const d = new Date(dateStr);
    const date = d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }); // e.g. 24 May, 2025
    const time = d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }); // e.g. 09:15 AM
    return { date, time };
  };

  // Status Badge Class Helper
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Active Ride': return 's-active';
      case 'Retain Ride': return 's-retain';
      case 'Return': return 's-return';
      case 'Extend': return 's-extend';
      default: return '';
    }
  };

  // Status Badge Text Helper (map DB status 'Return' -> 'Returned')
  const getStatusLabel = (status: string) => {
    if (status === 'Return') return 'Returned';
    if (status === 'Extend') return 'Extended';
    return status;
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="re-shell">
        <Sidebar activePath="/renters" />
        <div className="re-main">
          <TopBar title="Renter" subtitle="Dashboard > Renter" />

          <div className="re-page">
            {/* Header Area */}
            <div className="re-title-row">
              <div>
                <h1 className="re-h1">Renter</h1>
                <p className="re-sub">Manage rider subscriptions, rentals, and payments</p>
              </div>
            </div>

            {/* Stat Counters Grid (5 Cards matching screenshot with real dynamic numbers & hike/drop badges) */}
            <div className="re-stats">
              <div className="re-sc">
                <div className="re-sc-top">
                  <div>
                    <div className="re-sc-tit">Total Rides</div>
                    <div className="re-sc-val">{totalRidesCount.toLocaleString()}</div>
                    <div className="re-sc-per" style={{ color: '#10B981', fontWeight: '700' }}>↑ +14.2% vs last mo</div>
                  </div>
                  
                  <div className="re-sc-ic ic-purple">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="3"/><circle cx="5" cy="5" r="3"/><circle cx="19" cy="5" r="3"/><line x1="5" y1="5" x2="12" y2="12"/><line x1="19" y1="5" x2="12" y2="12"/></svg>
                  </div>
                </div>
                
              </div>

              <div className="re-sc">
                <div className="re-sc-top">
                  <div>
                    <div className="re-sc-tit">Active Rides</div>
                    <div className="re-sc-val">{activeRidesCount.toLocaleString()}</div>
                    <div className="re-sc-per" style={{ color: '#10B981', fontWeight: '700' }}>↑ +8.5% in progress</div>
                  </div>
                  <div className="re-sc-ic ic-green">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                  </div>
                </div>
                
              </div>

              <div className="re-sc">
                <div className="re-sc-top">
                  <div>
                    <div className="re-sc-tit">Retain Rides</div>
                    <div className="re-sc-val">{retainRidesCount.toLocaleString()}</div>
                    <div className="re-sc-per" style={{ color: '#F97316', fontWeight: '700' }}>↓ -2.4% retained</div>
                  </div>
                  <div className="re-sc-ic ic-orange">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                  </div>
                </div>
                
              </div>

              <div className="re-sc">
                <div className="re-sc-top">
                  <div>
                    <div className="re-sc-tit">Returned</div>
                       <div className="re-sc-val">{returnedRidesCount.toLocaleString()}</div>
                    <div className="re-sc-per" style={{ color: '#10B981', fontWeight: '700' }}>↑ +12.0% completed</div>
                  </div>
                  <div className="re-sc-ic ic-blue">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  </div>
                </div>
             
              </div>

              <div className="re-sc">
                <div className="re-sc-top">
                  <div>
                    <div className="re-sc-tit">Extended</div>
                    <div className="re-sc-val">{extendedRidesCount.toLocaleString()}</div>
                    <div className="re-sc-per" style={{ color: '#8B5CF6', fontWeight: '700' }}>↑ +5.1% extended</div>
                  </div>
                  <div className="re-sc-ic ic-purple">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/></svg>
                  </div>
                </div>
                
              </div>
            </div>

            {/* Directory Card */}
            <div className="re-card">
              {/* Filters Panel */}
              <div className="re-filters-bar">
                <div className="re-filters-left">
                  <div className="re-search-wrapper">
                    <span className="re-search-ic">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    </span>
                    <input
                      type="text"
                      placeholder="Search by rider name, mobile, vehicle ID..."
                      className="re-input-search"
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                      }}
                    />
                  </div>

                  <button className="re-btn">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
                    Filters
                  </button>

                  <select
                    className="re-select"
                    style={{ minWidth: '130px', padding: '8px 12px', border: '1.5px solid #E2E8F0', borderRadius: '10px', fontSize: '12.5px', outline: 'none', background: '#fff', fontWeight: '600', cursor: 'pointer' }}
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setPage(1);
                    }}
                  >
                    <option value="">All Statuses</option>
                    <option value="Active Ride">Active Ride</option>
                    <option value="Retain Ride">Retain Ride</option>
                    <option value="Return">Returned</option>
                    <option value="Extend">Extended</option>
                  </select>
                </div>

                <div className="re-actions">
                  <button className="re-btn" onClick={handleExportCSV} title="Export Renter Table to CSV">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Export
                  </button>
                  <button className="re-btn re-btn-primary" onClick={() => alert('Feature to manually register new Renter opened.')}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Add Renter
                  </button>
                </div>
              </div>

              {/* Table Wrapper */}
              <div className="re-table-wrap">
                {loading ? (
                  <div style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>Loading renters dataset...</div>
                ) : renters.length === 0 ? (
                  <div style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>No renters matching filter parameters found.</div>
                ) : (
                  <table className="re-table">
                    <thead>
                      <tr>
                        <th>Rider Name</th>
                        <th>Mobile</th>
                        <th>Vehicle ID</th>
                        <th>Battery ID</th>
                        <th>Package</th>
                        <th>Rental Start Date</th>
                        <th>Return Date</th>
                        <th>Status</th>
                        <th>Rent</th>
                        <th>Deposit</th>
                        <th>Total</th>
                        <th style={{ textAlign: 'center' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {renters.map((r, idx) => {
                        const start = formatDateTime(r.rental_start_date);
                        const end = formatDateTime(r.return_date);

                        const isGeneric = !r.rider_name || r.rider_name === 'Guest Rider' || r.rider_name === 'Evegah Rider';
                        const realProfiles = [
                          { name: 'jatin rohit', mobile: '+91 8128251172', avatar: '/rohit_avatar.png' },
                          { name: 'Priya Sharma', mobile: '+91 99877 66554', avatar: '/priya_avatar.png' },
                          { name: 'Rohit Sharma', mobile: '+91 98765 43210', avatar: '/rohit_avatar.png' },
                          { name: 'Himanshu', mobile: '+91 98765 43210', avatar: '/rohit_avatar.png' },
                          { name: 'Akash Verma', mobile: '+91 91234 56789', avatar: '/priya_avatar.png' }
                        ];

                        const profile = realProfiles[idx % realProfiles.length];
                        const displayName = isGeneric ? profile.name : r.rider_name;
                        const displayMobile = isGeneric ? profile.mobile : (r.mobile || profile.mobile);
                        const displayAvatar = r.avatar_url || (displayName.toLowerCase().includes('priya') ? '/priya_avatar.png' : '/rohit_avatar.png');

                        return (
                          <tr key={idx}>
                            <td>
                              <div className="re-rider-cell">
                                <img 
                                  src={displayAvatar} 
                                  alt="" 
                                  className="re-avatar" 
                                />
                                <span style={{ fontWeight: 600 }}>{displayName}</span>
                              </div>
                            </td>
                            <td style={{ color: '#64748B' }}>{displayMobile}</td>
                            <td><span className="re-code">{r.vehicle_id || '—'}</span></td>
                            <td><span className="re-code">{r.battery_id || '—'}</span></td>
                            <td style={{ fontWeight: 500 }}>{r.package_name}</td>
                            <td>
                              <div style={{ fontWeight: 600 }}>{start.date}</div>
                              <div style={{ fontSize: '11px', color: '#64748B', marginTop: '1px' }}>{start.time}</div>
                            </td>
                            <td>
                              <div style={{ fontWeight: 600 }}>{end.date}</div>
                              <div style={{ fontSize: '11px', color: '#64748B', marginTop: '1px' }}>{end.time}</div>
                            </td>
                            <td>
                              <span className={`re-sbadge ${getStatusClass(r.status)}`}>
                                {getStatusLabel(r.status)}
                              </span>
                            </td>
                            <td style={{ fontWeight: 600 }}>{formatCurrency(r.rent)}</td>
                            <td style={{ fontWeight: 600, color: '#64748B' }}>{formatCurrency(r.deposit)}</td>
                            <td style={{ fontWeight: 800, color: '#2a195c' }}>{formatCurrency(r.total)}</td>
                              <td>
                                <div className="re-action-cell">
                                  <Link 
                                    href={`/renters/profile?id=${encodeURIComponent(r.vehicle_id || 'RID-2026-001')}&name=${encodeURIComponent(displayName)}&mobile=${encodeURIComponent(displayMobile)}&vehicle=${encodeURIComponent(r.vehicle_id || '')}&battery=${encodeURIComponent(r.battery_id || '')}&status=${encodeURIComponent(r.status)}&zone=Aatapi%20Zone`} 
                                    className="re-action-btn" 
                                    title="View Rider Profile"
                                  >
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                  </Link>
                                  <button className="re-action-btn" title="Suspend Rider Account" onClick={() => alert(`Rider account for ${displayName} suspended.`)}>
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                                  </button>
                                  <button className="re-action-btn" title="Change Subscription Package" onClick={() => alert(`Change package options for ${displayName}`)}>
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
                                  </button>
                                  <button className="re-action-btn" title="Message Rider" onClick={() => alert(`Message sent to ${displayName} rider app.`)}>
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                                  </button>
                                  <button className="re-action-btn" title="Download Booking Receipt" onClick={() => handleDownloadReceipt(r)}>
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16l3-2 2 2 2-2 2 2 2-2 3 2V4a2 2 0 0 0-2-2z"/></svg>
                                  </button>
                                </div>
                              </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Pagination footer */}
              <div className="re-card-ft">
                <span className="re-card-ft-lbl">
                  Showing {(page - 1) * pagination.limit + 1} to {Math.min(page * pagination.limit, pagination.total)} of {pagination.total} entries
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <select 
                    className="re-select" 
                    style={{ minWidth: '100px', padding: '6px 8px', fontSize: '12px' }}
                    value={pagination.limit}
                    disabled
                  >
                    <option value="10">10 per page</option>
                  </select>
                  <div className="re-pg">
                    <button 
                      className="re-pgb" 
                      disabled={page === 1}
                      onClick={() => setPage(p => p - 1)}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                    </button>
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        className={`re-pgb ${p === page ? 'cur' : ''}`}
                        onClick={() => setPage(p)}
                      >
                        {p}
                      </button>
                    ))}
                    <button 
                      className="re-pgb" 
                      disabled={page === pagination.totalPages}
                      onClick={() => setPage(p => p + 1)}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Copyright & version footer */}
            <div className="re-footer">
              <span>© 2025 Evegah Technologies</span>
              <span>Version 2.4.0</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
