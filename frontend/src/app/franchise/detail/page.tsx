"use client";
import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

const CSS = `
.fd-shell { display: flex; min-height: 100vh; background: #F8FAFC; font-family: 'Inter', sans-serif; }
.fd-main { margin-left: 230px; display: flex; flex-direction: column; min-height: 100vh; width: calc(100% - 230px); }
.fd-page { flex: 1; padding: 24px; display: flex; flex-direction: column; gap: 20px; }

/* Breadcrumb */
.fd-bc { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #64748B; font-weight: 500; }
.fd-bc a { color: #64748B; text-decoration: none; }
.fd-bc a:hover { color: #2A195C; }
.fd-bc-sep { color: #94A3B8; }
.fd-bc-cur { color: #2A195C; font-weight: 600; }

/* Top Header Profile Card */
.fd-profile-card { background: #fff; border: 1px solid #E2E8F0; border-radius: 16px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,.02); display: grid; grid-template-columns: 220px 1.5fr 1.25fr 1fr; gap: 24px; align-items: start; }
.fd-img-box { width: 100%; height: 130px; border-radius: 12px; overflow: hidden; border: 1px solid #E2E8F0; position: relative; }
.fd-img-box img { width: 100%; height: 100%; object-fit: cover; }

.fd-details-col { display: flex; flex-direction: column; gap: 10px; }
.fd-detail-item { display: flex; align-items: center; gap: 8px; font-size: 12.5px; color: #475569; }
.fd-detail-ic { color: #64748B; flex-shrink: 0; display: flex; align-items: center; }
.fd-detail-lbl { font-weight: 500; color: #64748B; width: 100px; flex-shrink: 0; }
.fd-detail-val { font-weight: 600; color: #0F172A; }

.fd-revenue-col { display: flex; flex-direction: column; gap: 12px; border-left: 1px solid #F1F5F9; padding-left: 24px; }
.fd-rev-block { display: flex; flex-direction: column; gap: 2px; }
.fd-rev-lbl { font-size: 11px; color: #64748B; font-weight: 600; text-transform: uppercase; letter-spacing: 0.03em; }
.fd-rev-val { font-size: 20px; font-weight: 800; color: #0F172A; line-height: 1.2; display: flex; align-items: center; gap: 6px; }
.fd-trend-badge { font-size: 11px; font-weight: 700; color: #16A34A; background: #DCFCE7; padding: 2px 6px; border-radius: 4px; display: inline-flex; align-items: center; gap: 2px; }

/* Action buttons */
.fd-actions-row { display: flex; justify-content: space-between; align-items: center; margin-top: -4px; }
.fd-title-wrap { display: flex; align-items: center; gap: 10px; }
.fd-h1 { font-size: 22px; font-weight: 800; color: #0F172A; margin: 0; }
.fd-badge-active { background: #DCFCE7; color: #16A34A; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 6px; text-transform: uppercase; }
.fd-btn-outline { display: flex; align-items: center; gap: 6px; padding: 8px 14px; border: 1.5px solid #E2E8F0; border-radius: 8px; font-size: 12.5px; font-weight: 700; color: #475569; background: #fff; cursor: pointer; transition: all .15s; }
.fd-btn-outline:hover { border-color: #6366F1; color: #6366F1; }

/* Tab panel */
.fd-tabs { display: flex; border-bottom: 1px solid #E2E8F0; gap: 24px; margin-bottom: 8px; }
.fd-tab { padding: 12px 4px; font-size: 13.5px; font-weight: 700; color: #64748B; cursor: pointer; border-bottom: 2px solid transparent; transition: all .15s; }
.fd-tab:hover { color: #2a195c; }
.fd-tab.active { color: #2a195c; border-bottom-color: #2a195c; }

/* Dashboard grid under Overview */
.overview-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.overview-card { background: #fff; border: 1px solid #E2E8F0; border-radius: 14px; padding: 16px; box-shadow: 0 1px 3px rgba(0,0,0,.02); display: flex; flex-direction: column; }
.card-title { font-size: 13px; font-weight: 700; color: #0F172A; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; }

.summary-list { display: flex; flex-direction: column; gap: 8px; }
.summary-item { display: flex; align-items: center; justify-content: space-between; font-size: 12.5px; padding-bottom: 6px; border-bottom: 1px solid #F1F5F9; }
.summary-item:last-child { border-bottom: none; padding-bottom: 0; }
.summary-lbl { color: #64748B; font-weight: 500; display: flex; align-items: center; gap: 6px; }
.summary-val { font-weight: 700; color: #334155; }

.status-check { display: flex; align-items: center; gap: 4px; color: #16A34A; font-weight: 700; font-size: 11px; }

/* Health Donut Gauge */
.health-donut-body { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; height: 100%; }
.health-donut-con { position: relative; width: 100px; height: 100px; display: flex; align-items: center; justify-content: center; }
.health-donut-svg { transform: rotate(-90deg); width: 90px; height: 90px; }
.health-donut-txt { position: absolute; text-align: center; display: flex; flex-direction: column; align-items: center; }
.health-num { font-size: 18px; font-weight: 800; color: #0F172A; }
.health-lbl { font-size: 9px; color: #64748B; font-weight: 600; text-transform: uppercase; }

/* Recent activity list */
.act-list { display: flex; flex-direction: column; gap: 10px; }
.act-item { display: flex; gap: 10px; position: relative; }
.act-item::after { content: ''; position: absolute; left: 5px; top: 12px; bottom: -14px; width: 1px; background: #E2E8F0; }
.act-item:last-child::after { display: none; }
.act-dot { width: 11px; height: 11px; border-radius: 50%; border: 2.5px solid #2a195c; background: #fff; z-index: 1; flex-shrink: 0; margin-top: 2.5px; }
.act-dot.warn { border-color: #F59E0B; }
.act-dot.error { border-color: #EF4444; }
.act-info { min-width: 0; flex: 1; }
.act-txt { font-size: 12px; font-weight: 700; color: #334155; }
.act-time { font-size: 10.5px; color: #94A3B8; margin-top: 1px; font-weight: 500; }

/* Bottom Row Grid split */
.fd-bottom-row { display: grid; grid-template-columns: 1.5fr 1fr 1fr; gap: 16px; }
.bottom-table-card { background: #fff; border: 1px solid #E2E8F0; border-radius: 14px; box-shadow: 0 1px 3px rgba(0,0,0,.02); padding: 16px; display: flex; flex-direction: column; }
.bottom-table-hdr { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.table-title { font-size: 13px; font-weight: 700; color: #0F172A; }
.table-viewall { font-size: 11.5px; font-weight: 700; color: #6366F1; cursor: pointer; }

/* Financial Grid */
.fin-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
.fin-block { background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 10px 12px; }
.fin-lbl { font-size: 10.5px; color: #64748B; font-weight: 600; margin-bottom: 1px; }
.fin-val { font-size: 14.5px; font-weight: 800; color: #0F172A; display: flex; align-items: center; gap: 4px; }
.fin-sub { font-size: 10px; color: #16A34A; font-weight: 700; }
.fin-row-split { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; padding: 10px 0 0; border-top: 1px solid #E2E8F0; }
.fin-mini-block { display: flex; flex-direction: column; }
.fin-mini-lbl { font-size: 9.5px; color: #64748B; font-weight: 600; }
.fin-mini-val { font-size: 12.5px; font-weight: 800; color: #0F172A; }

.tbl-compact { width: 100%; border-collapse: collapse; }
.tbl-compact th { font-size: 10.5px; font-weight: 700; color: #64748B; text-transform: uppercase; padding: 8px; border-bottom: 1px solid #E2E8F0; background: #F8FAFC; text-align: left; }
.tbl-compact td { padding: 8px; font-size: 12px; color: #334155; border-bottom: 1px solid #F1F5F9; }
.tbl-compact tr:last-child td { border-bottom: none; }

.status-dot-txt { display: flex; align-items: center; gap: 4px; font-weight: 700; }
.status-dot { width: 6px; height: 6px; border-radius: 50%; }

/* Documents list */
.docs-list { display: flex; flex-direction: column; gap: 8px; }
.doc-item { display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; }
.doc-info { display: flex; align-items: center; gap: 10px; }
.doc-ic { color: #EF4444; flex-shrink: 0; }
.doc-tit { font-size: 12px; font-weight: 700; color: #334155; }
.doc-date { font-size: 10px; color: #94A3B8; font-weight: 500; margin-top: 1px; }
.doc-action { color: #64748B; background: none; border: none; cursor: pointer; padding: 4px; }
.doc-action:hover { color: #2A195C; }

/* SVG Map simulation */
.map-placeholder { width: 100%; height: 110px; border-radius: 8px; background: #E2E8F0; position: relative; overflow: hidden; border: 1px solid #CBD5E1; }
.map-pulsing-pin { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); display: flex; align-items: center; justify-content: center; }
.map-pin-circle { width: 14px; height: 14px; border-radius: 50%; background: #2A195C; border: 2px solid #fff; box-shadow: 0 0 0 0 rgba(79, 70, 229, 0.7); animation: mapPulse 1.4s infinite cubic-bezier(0.66, 0, 0, 1); }
@keyframes mapPulse { to { box-shadow: 0 0 0 12px rgba(79, 70, 229, 0); } }
`;

interface Activity {
  txt: string;
  time: string;
  type?: 'info' | 'warn' | 'error';
}

const RECENT_ACTIVITIES: Activity[] = [
  { txt: 'Swap Completed - Battery #BAT-450X-12340001', time: '20 May 2024, 11:15 AM' },
  { txt: 'Battery Inward - 12 Batteries added to inventory', time: '20 May 2024, 10:40 AM' },
  { txt: 'Payment Received - ₹2,45,600 Swaps Payout', time: '20 May 2024, 09:30 AM' },
  { txt: 'Inspection Completed - Zone Operations Team', time: '19 May 2024, 04:20 PM' },
  { txt: 'Low Stock Alert - Hub is below safe inventory limit', time: '19 May 2024, 02:10 PM', type: 'warn' }
];

interface DocumentItem {
  name: string;
  date: string;
  type: string;
}

const DOCUMENTS: DocumentItem[] = [
  { name: 'Franchise Agreement', date: '12 Jan 2024', type: 'PDF' },
  { name: 'KYC Documents', date: '12 Jan 2024', type: 'PDF' },
  { name: 'Address Proof', date: '12 Jan 2024', type: 'PDF' },
  { name: 'Bank Details', date: '12 Jan 2024', type: 'PDF' },
  { name: 'Insurance Certificate', date: '12 Jan 2024', type: 'PDF' }
];

interface PerformBattery {
  id: string;
  soh: string;
  swaps: number;
  status: 'Good' | 'Fair';
}

const PERFORMING_BATTERIES: PerformBattery[] = [
  { id: 'BAT-450X-12340001', soh: '95%', swaps: 58, status: 'Good' },
  { id: 'BAT-450X-12340003', soh: '94%', swaps: 56, status: 'Good' },
  { id: 'BAT-450X-12340007', soh: '93%', swaps: 55, status: 'Good' },
  { id: 'BAT-450X-12340012', soh: '92%', swaps: 54, status: 'Good' },
  { id: 'BAT-450X-12340005', soh: '91%', swaps: 53, status: 'Good' }
];

export default function FranchiseDetailPage() {
  const [activeTab, setActiveTab] = useState('Overview');

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="fd-shell">
        <Sidebar activePath="/franchise" />
        <div className="fd-main">
          <TopBar title="Franchise Details" subtitle="CP E-Vegah Hub" />
          <div className="fd-page">

            {/* Breadcrumb */}
            <div className="fd-bc">
              <a href="/">Home</a>
              <span className="fd-bc-sep">&gt;</span>
              <a href="/franchise">Franchise</a>
              <span className="fd-bc-sep">&gt;</span>
              <a href="/franchise">Franchise List</a>
              <span className="fd-bc-sep">&gt;</span>
              <span className="fd-bc-cur">CP E-Vegah Hub (FRN-CP-0001)</span>
            </div>

            {/* Title / Action Row */}
            <div className="fd-actions-row">
              <div className="fd-title-wrap">
                <h1 className="fd-h1">CP E-Vegah Hub</h1>
                <span className="fd-badge-active">Active</span>
                <span style={{ fontSize: '12.5px', color: '#64748B', fontWeight: '500', marginLeft: '6px' }}>FRN-CP-0001 | Battery Swapping + Rental</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="fd-btn-outline" onClick={() => alert('Opening Edit Franchise modal...')}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  Edit Franchise
                </button>
                <button className="fd-btn-outline" onClick={() => alert('More actions: Deactivate, Audit, etc.')}>
                  More Actions
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                </button>
              </div>
            </div>

            {/* Profile Overview Header Card */}
            <div className="fd-profile-card">
              <div className="fd-img-box">
                <img src="/evegah_hub_storefront.png" alt="Hub Storefront" />
              </div>
              
              {/* Middle column: Core store details */}
              <div className="fd-details-col">
                <div className="fd-detail-item">
                  <span className="fd-detail-ic">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </span>
                  <span className="fd-detail-lbl">Owner Name</span>
                  <span className="fd-detail-val">Rahul Sharma</span>
                </div>
                <div className="fd-detail-item">
                  <span className="fd-detail-ic">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  </span>
                  <span className="fd-detail-lbl">Mobile Number</span>
                  <span className="fd-detail-val">+91 98765 43210</span>
                </div>
                <div className="fd-detail-item">
                  <span className="fd-detail-ic">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  </span>
                  <span className="fd-detail-lbl">Email Address</span>
                  <span className="fd-detail-val">rahul.sharma@evegah.com</span>
                </div>
                <div className="fd-detail-item">
                  <span className="fd-detail-ic">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                  </span>
                  <span className="fd-detail-lbl">Zone / Location</span>
                  <span className="fd-detail-val">Connaught Place, Delhi</span>
                </div>
                <div className="fd-detail-item">
                  <span className="fd-detail-ic">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
                  </span>
                  <span className="fd-detail-lbl">Address</span>
                  <span className="fd-detail-val">Shop No. 12, Connaught Place, New Delhi - 110001</span>
                </div>
              </div>

              {/* Right column: Agreement details */}
              <div className="fd-details-col" style={{ borderLeft: '1px solid #F1F5F9', paddingLeft: '24px' }}>
                <div className="fd-detail-item">
                  <span className="fd-detail-lbl">Franchise Type</span>
                  <span className="fd-detail-val">Battery Swapping + Rental</span>
                </div>
                <div className="fd-detail-item">
                  <span className="fd-detail-lbl">Joined On</span>
                  <span className="fd-detail-val">12 Jan 2024</span>
                </div>
                <div className="fd-detail-item">
                  <span className="fd-detail-lbl">Agreement Start</span>
                  <span className="fd-detail-val">12 Jan 2024</span>
                </div>
                <div className="fd-detail-item">
                  <span className="fd-detail-lbl">Agreement End</span>
                  <span className="fd-detail-val">11 Jan 2026</span>
                </div>
                <div className="fd-detail-item">
                  <span className="fd-detail-lbl">Duration</span>
                  <span className="fd-detail-val">2 Years</span>
                </div>
              </div>

              {/* Far right: Revenue indicator */}
              <div className="fd-revenue-col">
                <div className="fd-rev-block">
                  <div className="fd-rev-lbl">Revenue (MTD)</div>
                  <div className="fd-rev-val">
                    ₹3,24,850
                    <span className="fd-trend-badge">
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="18 15 12 9 6 15"/></svg>
                      12.6%
                    </span>
                  </div>
                </div>
                <div className="fd-rev-block">
                  <div className="fd-rev-lbl">Revenue (YTD)</div>
                  <div className="fd-rev-val" style={{ fontSize: '18px' }}>₹32,48,600</div>
                </div>
                <div className="fd-rev-block">
                  <div className="fd-rev-lbl">Total Transactions</div>
                  <div className="fd-rev-val" style={{ fontSize: '18px' }}>1,248</div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs bar */}
            <div className="fd-tabs">
              {['Overview', 'Financials', 'Inventory', 'Batteries', 'Users & Roles', 'Documents', 'Payouts', 'Activity History'].map(tab => (
                <div 
                  key={tab} 
                  className={`fd-tab ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </div>
              ))}
            </div>

            {/* Dashboard content under tabs */}
            {activeTab === 'Overview' ? (
              <>
                <div className="overview-grid">
                  
                  {/* Card 1: Operational Summary */}
                  <div className="overview-card">
                    <div className="card-title">Operational Summary</div>
                    <div className="summary-list">
                      <div className="summary-item">
                        <span className="summary-lbl">Total Batteries (All Status)</span>
                        <span className="summary-val">160</span>
                      </div>
                      <div className="summary-item">
                        <span className="summary-lbl">Batteries In Use</span>
                        <span className="summary-val">98</span>
                      </div>
                      <div className="summary-item">
                        <span className="summary-lbl">Available Batteries</span>
                        <span className="summary-val">52</span>
                      </div>
                      <div className="summary-item">
                        <span className="summary-lbl">Swaps Today</span>
                        <span className="summary-val">24</span>
                      </div>
                      <div className="summary-item">
                        <span className="summary-lbl">Total Swaps (MTD)</span>
                        <span className="summary-val">842</span>
                      </div>
                      <div className="summary-item">
                        <span className="summary-lbl">Utilization Rate</span>
                        <span className="summary-val" style={{ color: '#16A34A' }}>78%</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Franchise Status */}
                  <div className="overview-card">
                    <div className="card-title">Franchise Status</div>
                    <div className="summary-list">
                      <div className="summary-item">
                        <span className="summary-lbl">Status</span>
                        <span className="fd-badge-active" style={{ fontSize: '10px', padding: '2px 6px' }}>Active</span>
                      </div>
                      <div className="summary-item">
                        <span className="summary-lbl">Approval Status</span>
                        <span className="fd-badge-active" style={{ fontSize: '10px', padding: '2px 6px', background: '#E0F2FE', color: '#0369A1' }}>Approved</span>
                      </div>
                      <div className="summary-item">
                        <span className="summary-lbl">KYC Status</span>
                        <span className="status-check">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                          Verified
                        </span>
                      </div>
                      <div className="summary-item">
                        <span className="summary-lbl">Last Inspection</span>
                        <span className="summary-val">15 May 2024</span>
                      </div>
                      <div className="summary-item">
                        <span className="summary-lbl">Next Inspection</span>
                        <span className="summary-val">15 Aug 2024</span>
                      </div>
                      <div className="summary-item">
                        <span className="summary-lbl">Health Score</span>
                        <span className="summary-val" style={{ color: '#16A34A' }}>92%</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Battery Health Overview */}
                  <div className="overview-card">
                    <div className="card-title">Battery Health Overview</div>
                    <div className="health-donut-body">
                      <div className="health-donut-con">
                        <svg className="health-donut-svg" viewBox="0 0 42 42">
                          <circle cx="21" cy="21" r="15.91549430918954" fill="#fff" />
                          <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#E2E8F0" strokeWidth="4.5" />
                          {/* Good (67.5%): green */}
                          <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#10B981" strokeWidth="4.5" strokeDasharray="67.5 32.5" strokeDashoffset="25" />
                          {/* Fair (25.0%): orange */}
                          <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#F59E0B" strokeWidth="4.5" strokeDasharray="25 75" strokeDashoffset="57.5" />
                          {/* Poor (7.5%): red */}
                          <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#EF4444" strokeWidth="4.5" strokeDasharray="7.5 92.5" strokeDashoffset="32.5" />
                        </svg>
                        <div className="health-donut-txt">
                          <span className="health-num">92%</span>
                          <span className="health-lbl">Avg. SoH</span>
                        </div>
                      </div>
                      <div className="bi-legend" style={{ margin: 0 }}>
                        <div className="bi-legend-item">
                          <div className="bi-legend-lbl-wrap"><span className="bi-legend-dot" style={{ background: '#10B981' }} />Good <span style={{ color: '#94A3B8', fontSize: '9px' }}>(80%-100%)</span></div>
                          <div className="bi-legend-val">108 <span style={{ fontWeight: 'normal', color: '#94A3B8' }}>(67.5%)</span></div>
                        </div>
                        <div className="bi-legend-item">
                          <div className="bi-legend-lbl-wrap"><span className="bi-legend-dot" style={{ background: '#F59E0B' }} />Fair <span style={{ color: '#94A3B8', fontSize: '9px' }}>(50%-79%)</span></div>
                          <div className="bi-legend-val">40 <span style={{ fontWeight: 'normal', color: '#94A3B8' }}>(25.0%)</span></div>
                        </div>
                        <div className="bi-legend-item">
                          <div className="bi-legend-lbl-wrap"><span className="bi-legend-dot" style={{ background: '#EF4444' }} />Poor <span style={{ color: '#94A3B8', fontSize: '9px' }}>( &lt;50%)</span></div>
                          <div className="bi-legend-val">12 <span style={{ fontWeight: 'normal', color: '#94A3B8' }}>(7.5%)</span></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 4: Recent Activity */}
                  <div className="overview-card">
                    <div className="card-title">
                      <span>Recent Activity</span>
                      <span className="bi-chart-viewall" onClick={() => setActiveTab('Activity History')}>View All</span>
                    </div>
                    <div className="act-list">
                      {RECENT_ACTIVITIES.map((act, index) => (
                        <div key={index} className="act-item">
                          <span className={`act-dot ${act.type === 'warn' ? 'warn' : act.type === 'error' ? 'error' : ''}`} />
                          <div className="act-info">
                            <div className="act-txt">{act.txt}</div>
                            <div className="act-time">{act.time}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Bottom Row splits: Financial, performing batteries, documents, location details */}
                <div className="fd-bottom-row">
                  
                  {/* Financial Summary */}
                  <div className="bottom-table-card">
                    <div className="bottom-table-hdr">
                      <span className="table-title">Financial Summary</span>
                      <select className="bi-select" style={{ height: '26px', padding: '0 6px', fontSize: '11px' }}>
                        <option>This Month</option>
                      </select>
                    </div>
                    <div className="fin-grid">
                      <div className="fin-block">
                        <div className="fin-lbl">Total Revenue</div>
                        <div className="fin-val">₹3,24,850</div>
                        <span className="fin-sub">↑ 12.6% vs last month</span>
                      </div>
                      <div className="fin-block">
                        <div className="fin-lbl">Total Swaps Revenue</div>
                        <div className="fin-val">₹2,45,600</div>
                        <span className="fin-sub">↑ 10.8% vs last month</span>
                      </div>
                      <div className="fin-block">
                        <div className="fin-lbl">Rental Revenue</div>
                        <div className="fin-val">₹79,250</div>
                        <span className="fin-sub">↑ 15.4% vs last month</span>
                      </div>
                      <div className="fin-block">
                        <div className="fin-lbl">Other Revenue</div>
                        <div className="fin-val">₹0</div>
                        <span className="fin-sub" style={{ color: '#64748B' }}>0% vs last month</span>
                      </div>
                    </div>
                    <div className="fin-row-split">
                      <div className="fin-mini-block">
                        <span className="fin-mini-lbl">Total Payouts</span>
                        <span className="fin-mini-val">₹2,85,000</span>
                      </div>
                      <div className="fin-mini-block">
                        <span className="fin-mini-lbl">Pending Payout</span>
                        <span className="fin-mini-val">₹39,850</span>
                      </div>
                      <div className="fin-mini-block">
                        <span className="fin-mini-lbl">Total Deductions</span>
                        <span className="fin-mini-val">₹5,000</span>
                      </div>
                      <div className="fin-mini-block">
                        <span className="fin-mini-lbl">Net Payable</span>
                        <span className="fin-mini-val" style={{ color: '#6366F1' }}>₹39,850</span>
                      </div>
                    </div>
                    <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
                      <span className="table-viewall" onClick={() => setActiveTab('Payouts')}>View Financial Details →</span>
                    </div>
                  </div>

                  {/* Top Performing Batteries */}
                  <div className="bottom-table-card">
                    <div className="bottom-table-hdr">
                      <span className="table-title">Top Performing Batteries</span>
                      <span className="table-viewall" onClick={() => setActiveTab('Batteries')}>View All</span>
                    </div>
                    <table className="tbl-compact">
                      <thead>
                        <tr>
                          <th>Battery ID</th>
                          <th>SoH</th>
                          <th>Swaps</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {PERFORMING_BATTERIES.map(bat => (
                          <tr key={bat.id}>
                            <td style={{ fontWeight: '700', color: '#6366F1' }}>{bat.id}</td>
                            <td>{bat.soh}</td>
                            <td>{bat.swaps}</td>
                            <td className="status-dot-txt" style={{ color: '#16A34A' }}>
                              <span className="status-dot" style={{ background: '#16A34A' }} />{bat.status}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Documents & Location */}
                  <div className="bottom-table-card">
                    <div className="bottom-table-hdr">
                      <span className="table-title">Franchise Documents</span>
                      <span className="table-viewall" onClick={() => setActiveTab('Documents')}>View All</span>
                    </div>
                    <div className="docs-list">
                      {DOCUMENTS.map((doc, idx) => (
                        <div className="doc-item" key={idx}>
                          <div className="doc-info">
                            <span className="doc-ic">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                            </span>
                            <div>
                              <div className="doc-tit">{doc.name}</div>
                              <div className="doc-date">{doc.date}</div>
                            </div>
                          </div>
                          <button className="doc-action" title="Download Document" onClick={() => alert(`Downloading ${doc.name} PDF...`)}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Map Location & Schedule Footer block */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '16px' }}>
                  <div className="overview-card">
                    <div className="card-title">Location on Map</div>
                    <div className="map-placeholder">
                      {/* SVG Simulated street grid CP map */}
                      <svg width="100%" height="100%" style={{ background: '#E0F2FE' }}>
                        <rect x="0" y="0" width="100%" height="100%" fill="#E9EDF0" />
                        {/* Streets */}
                        <line x1="20" y1="0" x2="20" y2="120" stroke="#fff" strokeWidth="10" />
                        <line x1="0" y1="40" x2="400" y2="40" stroke="#fff" strokeWidth="12" />
                        <line x1="120" y1="0" x2="120" y2="120" stroke="#fff" strokeWidth="10" />
                        <line x1="240" y1="0" x2="240" y2="120" stroke="#fff" strokeWidth="10" />
                        <circle cx="200" cy="50" r="35" fill="none" stroke="#fff" strokeWidth="15" />
                        {/* Parks */}
                        <rect x="35" y="5" width="70" height="30" fill="#DCFCE7" rx="3" />
                        <rect x="260" y="50" width="100" height="50" fill="#DCFCE7" rx="3" />
                        {/* Marker Pin */}
                        <g transform="translate(200, 40)">
                          <circle cx="0" cy="0" r="14" fill="rgba(79, 70, 229, 0.18)" />
                          <circle cx="0" cy="0" r="7" fill="#2A195C" stroke="#fff" strokeWidth="1.8" />
                        </g>
                      </svg>
                      <div style={{ position: 'absolute', bottom: '6px', left: '8px', background: 'rgba(255,255,255,0.9)', padding: '2px 6px', borderRadius: '4px', fontSize: '9.5px', fontWeight: 'bold', border: '1px solid #E2E8F0', color: '#334155' }}>
                        Shop No. 12, Connaught Place, New Delhi
                      </div>
                    </div>
                  </div>
                  <div className="overview-card">
                    <div className="card-title">Working Hours</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, justifyContent: 'center' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                        <span style={{ color: '#64748B', fontWeight: '500' }}>Mon - Sun</span>
                        <span style={{ fontWeight: '700', color: '#0F172A' }}>6:00 AM - 11:00 PM</span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#10B981', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        Open Now
                      </div>
                    </div>
                  </div>
                  <div className="overview-card">
                    <div className="card-title">Contact Person</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, justifyContent: 'center' }}>
                      <div style={{ fontSize: '13.5px', fontWeight: '700', color: '#0F172A' }}>Rahul Sharma</div>
                      <div style={{ fontSize: '11.5px', color: '#64748B', fontWeight: '600' }}>Hub Manager</div>
                      <div style={{ fontSize: '12.5px', color: '#2A195C', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                        +91 98765 43210
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="overview-card" style={{ padding: '30px', textAlign: 'center', color: '#64748B', minHeight: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ marginBottom: '10px' }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  <div>This tab contains the sub-telemetry overview list for {activeTab}. Live metrics and graphs are loaded successfully.</div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}
