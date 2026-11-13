"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { api } from '@/lib/api';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

.jc-page {
  display: flex;
  min-height: 100vh;
  background: #F6F7FC;
  font-family: 'Plus Jakarta Sans', sans-serif;
  color: #0F172A;
}
.jc-main {
  margin-left: 230px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: calc(100% - 230px);
  min-width: 0;
}
.jc-body {
  flex: 1;
  padding: 20px 26px 64px;
  max-width: 1560px;
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Breadcrumb */
.jc-bc {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12.5px;
  color: #64748B;
  font-weight: 500;
}
.jc-bc-link { color: #64748B; text-decoration: none; font-weight: 600; cursor: pointer; }
.jc-bc-link:hover { color: #2A195C; }
.jc-bc-sep { color: #CBD5E1; }
.jc-bc-cur { color: #2A195C; font-weight: 800; }

/* Header Row */
.jc-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}
.jc-h1-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}
.jc-h1 {
  font-size: 22px;
  font-weight: 900;
  color: #0F172A;
  margin: 0;
  letter-spacing: -0.02em;
}

.jc-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.jc-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s;
}
.jc-btn-outline {
  background: #FFF;
  border: 1.5px solid #E2E8F0;
  color: #334155;
}
.jc-btn-outline:hover { border-color: #2A195C; color: #2A195C; }
.jc-btn-primary {
  background: #2A195C;
  border: 1.5px solid #2A195C;
  color: #FFF;
}
.jc-btn-primary:hover { background: #4338CA; border-color: #4338CA; }

/* Top Vehicle Banner */
.jc-banner {
  background: #FFFFFF;
  border: 1.5px solid #EAECF4;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
  flex-wrap: wrap;
}
.jc-banner-left {
  display: flex;
  align-items: center;
  gap: 16px;
}
.jc-scooter-img {
  width: 72px;
  height: 72px;
  object-fit: contain;
  background: #F8FAFC;
  border-radius: 12px;
  padding: 6px;
  border: 1px solid #EAECF4;
}
.jc-banner-veh-id {
  font-size: 18px;
  font-weight: 900;
  color: #0F172A;
  display: flex;
  align-items: center;
  gap: 8px;
}
.jc-banner-veh-sub {
  font-size: 13px;
  color: #64748B;
  font-weight: 600;
  margin-top: 2px;
}

.jc-banner-grid {
  display: grid;
  grid-template-columns: repeat(4, auto);
  gap: 20px;
}
.jc-banner-info-box {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.jc-banner-info-label {
  font-size: 10px;
  color: #64748B;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.jc-banner-info-val {
  font-size: 13.5px;
  font-weight: 800;
  color: #0F172A;
}

/* 2-Column Responsive Layout */
.jc-layout-grid {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 20px;
  align-items: start;
}

.jc-card {
  background: #FFFFFF;
  border: 1.5px solid #EAECF4;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
  margin-bottom: 20px;
}
.jc-card-title {
  font-size: 15px;
  font-weight: 800;
  color: #0F172A;
  margin: 0 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Badges */
.pill-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 11.5px;
  font-weight: 800;
}
.pill-red { background: #FEF2F2; color: #EF4444; border: 1px solid #FECACA; }
.pill-green { background: #ECFDF5; color: #059669; border: 1px solid #A7F3D0; }
.pill-amber { background: #FFFBEB; color: #B45309; border: 1px solid #FDE68A; }
.pill-blue { background: #EFF6FF; color: #2563EB; border: 1px solid #BFDBFE; }
.pill-gray { background: #F1F5F9; color: #64748B; border: 1px solid #E2E8F0; }

/* Financial breakdown rows */
.jc-cost-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #F1F5F9;
  font-size: 13px;
}
.jc-cost-row:last-child { border-bottom: none; }
.jc-cost-total {
  font-size: 16px;
  font-weight: 900;
  color: #2A195C;
  border-top: 1.5px solid #EAECF4;
  padding-top: 14px;
  margin-top: 8px;
}

@media (max-width: 1080px) {
  .jc-layout-grid { grid-template-columns: 1fr; }
  .jc-banner-grid { grid-template-columns: repeat(2, 1fr); gap: 14px; }
}

@media (max-width: 860px) {
  .jc-page { flex-direction: column; }
  .jc-main { margin-left: 0; width: 100%; }
  .jc-body { padding: 16px; }
  .jc-banner { flex-direction: column; align-items: flex-start; }
}
`;

export default function JobCardDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = (params?.id as string) || '';

  const [jobCard, setJobCard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchJobCard = async () => {
    setLoading(true);
    try {
      const res: any = await api.get(`/maintenance/${id}`);
      const data = res?.data || res;
      setJobCard(data);
    } catch (e) {
      console.error('Failed to load job card:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchJobCard();
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    setUpdating(true);
    try {
      await api.put(`/maintenance/${id}`, { status: newStatus });
      setJobCard((prev: any) => ({ ...prev, status: newStatus }));
      alert(`Job card marked as ${newStatus}!`);
    } catch (e) {
      alert('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const handlePaymentStatusChange = async (newPayStatus: string) => {
    setUpdating(true);
    try {
      await api.put(`/maintenance/${id}`, { rider_payment_status: newPayStatus });
      setJobCard((prev: any) => ({ ...prev, rider_payment_status: newPayStatus }));
      alert(`Payment / Recovery status updated to ${newPayStatus}!`);
    } catch (e) {
      alert('Failed to update payment status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="jc-page">
        <Sidebar activePath="/maintenance/overview" />
        <div className="jc-main">
          <TopBar showHand={false} />
          <div style={{ textAlign: 'center', padding: '100px', color: '#64748B', fontWeight: 600 }}>
            Loading Job Card #{id} from database...
          </div>
        </div>
      </div>
    );
  }

  const isRiderDamage = (jobCard?.fault_type || '').includes('Rider') || !!jobCard?.rider_name;
  const partsExp = Number(jobCard?.parts_cost || 0);
  const laborExp = Number(jobCard?.labor_cost || 0);
  const totalExp = Number(jobCard?.total_cost || jobCard?.estimated_cost || partsExp + laborExp || 0);
  const riderCharge = Number(jobCard?.rider_charge_amount || (isRiderDamage ? totalExp : 0));

  return (
    <div className="jc-page">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <Sidebar activePath="/maintenance/overview" />

      <div className="jc-main">
        <TopBar showHand={false} />

        <div className="jc-body">
          {/* Breadcrumb */}
          <div className="jc-bc">
            <span className="jc-bc-link" onClick={() => router.push('/maintenance/overview')}>Maintenance</span>
            <span className="jc-bc-sep">&gt;</span>
            <span className="jc-bc-link" onClick={() => router.push('/maintenance/overview')}>Job Cards</span>
            <span className="jc-bc-sep">&gt;</span>
            <span className="jc-bc-cur">{jobCard?.job_card_number || jobCard?.ticket_id || id}</span>
          </div>

          {/* Header */}
          <div className="jc-header-row">
            <div className="jc-h1-row">
              <h1 className="jc-h1">Job Card #{jobCard?.job_card_number || jobCard?.ticket_id || id}</h1>
              <span className={`pill-badge ${
                jobCard?.status === 'Completed' ? 'pill-green' : 'pill-blue'
              }`}>
                ● {jobCard?.status || 'Scheduled'}
              </span>
              {isRiderDamage && (
                <span className="pill-badge pill-red">
                  ⚠️ Rider Damage Liability
                </span>
              )}
            </div>
            <div className="jc-actions">
              <button className="jc-btn jc-btn-outline" onClick={() => router.push('/maintenance/overview')}>
                ← Back to Overview
              </button>
              <button className="jc-btn jc-btn-outline" onClick={() => window.print()}>
                🖨️ Print Job Card
              </button>
              {jobCard?.status !== 'Completed' && (
                <button
                  className="jc-btn jc-btn-primary"
                  onClick={() => handleStatusChange('Completed')}
                  disabled={updating}
                >
                  ✓ Mark Work Completed
                </button>
              )}
            </div>
          </div>

          {/* Vehicle Banner */}
          <div className="jc-banner">
            <div className="jc-banner-left">
              <img
                src={
                  jobCard?.vehicle_model?.toLowerCase().includes('mink')
                    ? '/assets/mink.png'
                    : jobCard?.vehicle_model?.toLowerCase().includes('pro')
                    ? '/assets/Pro_Banner.png'
                    : '/assets/city.png'
                }
                className="jc-scooter-img"
                alt="Vehicle"
              />
              <div>
                <div className="jc-banner-veh-id">
                  <span>{jobCard?.vehicle_code || 'EVM5025009'}</span>
                  <span className="pill-badge pill-green">Assigned Unit</span>
                </div>
                <div className="jc-banner-veh-sub">
                  {jobCard?.vehicle_model || 'Evegah City'} • {jobCard?.vehicle_category || 'Electric Scooter'}
                </div>
              </div>
            </div>

            <div className="jc-banner-grid">
              <div className="jc-banner-info-box">
                <span className="jc-banner-info-label">Odometer Reading</span>
                <span className="jc-banner-info-val">{jobCard?.km_reading || '4,280 km'}</span>
              </div>
              <div className="jc-banner-info-box">
                <span className="jc-banner-info-label">Zone Hub</span>
                <span className="jc-banner-info-val">{jobCard?.zone || 'Gotri Zone'}</span>
              </div>
              <div className="jc-banner-info-box">
                <span className="jc-banner-info-label">Assigned Technician</span>
                <span className="jc-banner-info-val">{jobCard?.assigned_technician || 'Ramesh Patel'}</span>
              </div>
              <div className="jc-banner-info-box">
                <span className="jc-banner-info-label">Service Workshop</span>
                <span className="jc-banner-info-val">{jobCard?.service_center || 'Gotri Service Hub'}</span>
              </div>
            </div>
          </div>

          {/* 2-Column Details Layout */}
          <div className="jc-layout-grid">
            {/* Left Column: Scope & Inspection */}
            <div>
              {/* Rider Damage Claim Box (if rider involved) */}
              {isRiderDamage && (
                <div className="jc-card" style={{ borderColor: '#FECACA', background: '#FFFDFD' }}>
                  <div className="jc-card-title">
                    <span style={{ color: '#991B1B', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                      Rider Damage Incident &amp; Recovery Details
                    </span>
                    <span className="pill-badge pill-red">Billable to Rider</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                    <div>
                      <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Responsible Rider</div>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>
                        {jobCard.rider_name}
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>{jobCard.rider_mobile || '+91 8238961974'}</div>
                    </div>

                    <div>
                      <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Ride Reservation ID</div>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: '#2A195C', marginTop: '2px', fontFamily: 'monospace' }}>
                        {jobCard.reservation_id || 'EVR-2C1CF7'}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', borderTop: '1px solid #FEE2E2', paddingTop: '14px' }}>
                    <div>
                      <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Damage Amount Charged</div>
                      <div style={{ fontSize: '18px', fontWeight: 900, color: '#991B1B', marginTop: '2px' }}>
                        ₹{riderCharge.toFixed(2)}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Recovery Status</div>
                      <select
                        style={{ padding: '6px 10px', borderRadius: '8px', border: '1.5px solid #E2E8F0', fontSize: '12.5px', fontWeight: 700, color: '#0F172A', outline: 'none' }}
                        value={jobCard.rider_payment_status || 'Pending Recovery'}
                        onChange={(e) => handlePaymentStatusChange(e.target.value)}
                        disabled={updating}
                      >
                        <option value="Deducted from Deposit">Deducted from Deposit</option>
                        <option value="Paid via UPI">Paid via UPI</option>
                        <option value="Paid via Cash">Paid via Cash</option>
                        <option value="Pending Recovery">Pending Recovery</option>
                        <option value="Waived">Waived</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Technical Inspection & Findings */}
              <div className="jc-card">
                <div className="jc-card-title">
                  <span>Inspection Findings &amp; Damage Remarks</span>
                </div>

                <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '10px', border: '1px solid #EAECF4', fontSize: '13.5px', lineHeight: 1.6, color: '#1E293B', fontWeight: 500 }}>
                  {jobCard?.description || 'Routine service inspection and maintenance procedure.'}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Service Category</div>
                    <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>
                      {jobCard?.issue_category || 'General Service'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Priority Level</div>
                    <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>
                      {jobCard?.priority || 'Medium'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Invoice & Financial Summary */}
            <div>
              <div className="jc-card">
                <div className="jc-card-title">
                  <span>Financial Breakdown</span>
                </div>

                <div className="jc-cost-row">
                  <span style={{ color: '#64748B', fontWeight: 600 }}>Spare Parts:</span>
                  <span style={{ fontWeight: 800, color: '#0F172A' }}>₹{partsExp.toFixed(2)}</span>
                </div>

                <div className="jc-cost-row">
                  <span style={{ color: '#64748B', fontWeight: 600 }}>Labor &amp; Workshop Fee:</span>
                  <span style={{ fontWeight: 800, color: '#0F172A' }}>₹{laborExp.toFixed(2)}</span>
                </div>

                <div className="jc-cost-row jc-cost-total">
                  <span>Total Repair Expense:</span>
                  <span>₹{totalExp.toFixed(2)}</span>
                </div>

                <div style={{ marginTop: '16px', background: '#F8FAFC', padding: '12px', borderRadius: '10px', border: '1px solid #EAECF4' }}>
                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Billed Entity</div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>
                    {isRiderDamage ? `Rider: ${jobCard.rider_name}` : 'Company / Fleet Expense'}
                  </div>
                  <div style={{ fontSize: '11.5px', color: isRiderDamage ? '#059669' : '#64748B', fontWeight: 700, marginTop: '2px' }}>
                    {isRiderDamage ? `Status: ${jobCard.rider_payment_status || 'Pending'}` : 'Absorbed in monthly operational budget'}
                  </div>
                </div>
              </div>

              {/* Workshop Quick Controls */}
              <div className="jc-card">
                <div className="jc-card-title">
                  <span>Update Work Status</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button
                    className="jc-btn jc-btn-outline"
                    style={{ justifyContent: 'center' }}
                    onClick={() => handleStatusChange('In Progress')}
                    disabled={updating}
                  >
                    ⚙️ Mark In Progress
                  </button>
                  <button
                    className="jc-btn jc-btn-outline"
                    style={{ justifyContent: 'center' }}
                    onClick={() => handleStatusChange('Under Maintenance')}
                    disabled={updating}
                  >
                    🛑 Waiting for Parts / Hold
                  </button>
                  <button
                    className="jc-btn jc-btn-primary"
                    style={{ justifyContent: 'center' }}
                    onClick={() => handleStatusChange('Completed')}
                    disabled={updating}
                  >
                    ✓ Work Finished &amp; Vehicle Released
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
