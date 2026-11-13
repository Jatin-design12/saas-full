"use client";
import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface CreateJobCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateJobCardModal({ isOpen, onClose, onSuccess }: CreateJobCardModalProps) {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [riders, setRiders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [vehicleCode, setVehicleCode] = useState('EVM5025009');
  const [vehicleModel, setVehicleModel] = useState('Evegah City');
  const [vehicleCategory, setVehicleCategory] = useState('Electric Scooter');
  const [kmReading, setKmReading] = useState('4,500 km');

  const [isRiderDamage, setIsRiderDamage] = useState(true);
  const [riderName, setRiderName] = useState('GANAVA SANDIPBHAI RASULBHAI');
  const [riderMobile, setRiderMobile] = useState('+91 8238961974');
  const [reservationId, setReservationId] = useState('EVR-2C1CF7');
  const [faultType, setFaultType] = useState('Rider Damage');
  const [liability, setLiability] = useState('Rider Liable');
  const [riderChargeAmount, setRiderChargeAmount] = useState(1200);
  const [riderPaymentStatus, setRiderPaymentStatus] = useState('Deducted from Deposit');

  const [issueCategory, setIssueCategory] = useState('Body & Panel Damage');
  const [priority, setPriority] = useState('High');
  const [description, setDescription] = useState('Left side body panel cracked and side-view mirror damaged upon vehicle return check-in.');
  const [assignedTechnician, setAssignedTechnician] = useState('Ramesh Patel');
  const [serviceCenter, setServiceCenter] = useState('Gotri Service Hub');
  const [zone, setZone] = useState('Gotri Zone');

  const [partsCost, setPartsCost] = useState(800);
  const [laborCost, setLaborCost] = useState(400);

  // Auto calculate total
  const totalCost = (Number(partsCost) || 0) + (Number(laborCost) || 0);

  // Fetch real vehicles and active riders from backend
  useEffect(() => {
    if (!isOpen) return;
    const loadData = async () => {
      setLoading(true);
      try {
        const [vRes, rRes]: any = await Promise.all([
          api.get('/vehicles').catch(() => ({ data: [] })),
          api.get('/reservations').catch(() => ({ data: [] }))
        ]);
        const vList = Array.isArray(vRes) ? vRes : (vRes?.data || []);
        const rList = Array.isArray(rRes) ? rRes : (rRes?.data || []);

        if (vList.length > 0) {
          setVehicles(vList);
        }
        if (rList.length > 0) {
          setRiders(rList);
        }
      } catch (_) {}
      finally {
        setLoading(false);
      }
    };
    loadData();
  }, [isOpen]);

  // Update vehicle info when vehicle select changes
  const handleVehicleSelect = (code: string) => {
    setVehicleCode(code);
    const found = vehicles.find((v: any) => {
      const vNum = v.registration_number || v.vehicle_number || v.code || v.id;
      return vNum === code;
    });
    if (found) {
      setVehicleModel(found.evegah_model_name || found.model || 'Evegah City');
      setZone(found.assigned_zone_name || found.zone || 'Gotri Zone');
    }
  };

  // Pre-fill rider details if selected from active reservations
  const handleRiderSelect = (resvId: string) => {
    setReservationId(resvId);
    const found = riders.find((r: any) => (r.reservation_id || String(r.id)) === resvId);
    if (found) {
      setRiderName(found.customer_name || found.rider_name || 'Rider');
      setRiderMobile(found.mobile || '');
      if (found.vehicle_number) {
        setVehicleCode(found.vehicle_number);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/maintenance', {
        vehicle_code: vehicleCode,
        vehicle_model: vehicleModel,
        vehicle_category: vehicleCategory,
        km_reading: kmReading,
        issue_category: issueCategory,
        description,
        assigned_technician: assignedTechnician,
        service_center: serviceCenter,
        zone,
        priority,
        status: 'In Progress',
        parts_cost: Number(partsCost) || 0,
        labor_cost: Number(laborCost) || 0,
        total_cost: totalCost,
        estimated_cost: totalCost,
        rider_name: isRiderDamage ? riderName : null,
        rider_mobile: isRiderDamage ? riderMobile : null,
        reservation_id: isRiderDamage ? reservationId : null,
        fault_type: isRiderDamage ? faultType : 'Normal Wear & Tear',
        liability: isRiderDamage ? liability : 'Company / Fleet',
        rider_charge_amount: isRiderDamage ? (Number(riderChargeAmount) || totalCost) : 0,
        rider_payment_status: isRiderDamage ? riderPaymentStatus : 'N/A (Fleet Expense)'
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Failed to create job card:', err);
      alert('Error creating job card: ' + (err.message || 'Server error'));
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="jc-overlay" onClick={onClose}>
      <style>{`
        .jc-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(4px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }
        .jc-modal {
          background: #ffffff;
          border-radius: 18px;
          width: 100%;
          max-width: 820px;
          max-height: 92vh;
          overflow-y: auto;
          box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.25);
          border: 1px solid #E2E8F0;
          display: flex;
          flex-direction: column;
        }
        .jc-header {
          padding: 20px 24px;
          border-bottom: 1px solid #EDEFF5;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: linear-gradient(180deg, #FAFBFD 0%, #FFFFFF 100%);
        }
        .jc-title {
          font-size: 18px;
          font-weight: 800;
          color: #0F172A;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .jc-close {
          border: none;
          background: #F1F5F9;
          color: #64748B;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          font-size: 18px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s;
        }
        .jc-close:hover {
          background: #E2E8F0;
          color: #0F172A;
        }
        .jc-body {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .jc-section-title {
          font-size: 13px;
          font-weight: 800;
          color: #2A195C;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .jc-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .jc-grid-3 {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 16px;
        }
        .jc-form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .jc-label {
          font-size: 12px;
          font-weight: 700;
          color: #334155;
        }
        .jc-input, .jc-select, .jc-textarea {
          border: 1.5px solid #E2E8F0;
          border-radius: 10px;
          padding: 9px 12px;
          font-size: 13px;
          color: #0F172A;
          background: #FFFFFF;
          outline: none;
          transition: border-color 0.15s;
          font-family: inherit;
        }
        .jc-input:focus, .jc-select:focus, .jc-textarea:focus {
          border-color: #2A195C;
          box-shadow: 0 0 0 3px rgba(42, 25, 92, 0.08);
        }
        .jc-toggle-box {
          background: #F8FAFC;
          border: 1.5px solid #E2E8F0;
          border-radius: 12px;
          padding: 14px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
        }
        .jc-footer {
          padding: 16px 24px;
          border-top: 1px solid #EDEFF5;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
          background: #FAFBFD;
        }
        .jc-btn-cancel {
          padding: 10px 18px;
          border: 1.5px solid #CBD5E1;
          border-radius: 10px;
          background: #FFFFFF;
          font-size: 13px;
          font-weight: 700;
          color: #475569;
          cursor: pointer;
        }
        .jc-btn-submit {
          padding: 10px 24px;
          border: none;
          border-radius: 10px;
          background: #2A195C;
          color: #FFFFFF;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          transition: background 0.15s;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .jc-btn-submit:hover {
          background: #4338CA;
        }
        @media (max-width: 640px) {
          .jc-grid-2, .jc-grid-3 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="jc-modal" onClick={(e) => e.stopPropagation()}>
        <div className="jc-header">
          <h3 className="jc-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2A195C" strokeWidth="2.5">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
            Create Maintenance Job Card &amp; Damage Claim
          </h3>
          <button className="jc-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="jc-body">
            {/* ── Vehicle Details ── */}
            <div>
              <div className="jc-section-title">
                <span>1. Vehicle Information</span>
              </div>
              <div className="jc-grid-3">
                <div className="jc-form-group">
                  <label className="jc-label">Vehicle Number *</label>
                  <select
                    className="jc-select"
                    value={vehicleCode}
                    onChange={(e) => handleVehicleSelect(e.target.value)}
                    required
                  >
                    <option value="EVM5025009">EVM5025009 (Evegah City • Gotri Zone)</option>
                    <option value="EVM1024012">EVM1024012 (Evegah City • Gotri Zone)</option>
                    <option value="EVM5025006">EVM5025006 (Evegah City • Gotri Zone)</option>
                    <option value="SFN602611">SFN602611 (Evegah City • Daman SF)</option>
                    <option value="EVM502614">EVM502614 (Evegah Mink • Gotri Zone)</option>
                    <option value="EVM1024018">EVM1024018 (Evegah Pro • Gotri Zone)</option>
                    {vehicles.map((v: any, i: number) => {
                      const code = v.registration_number || v.vehicle_number || v.code || `EVM50${i}01`;
                      if (['EVM5025009', 'EVM1024012', 'EVM5025006', 'SFN602611', 'EVM502614', 'EVM1024018'].includes(code)) return null;
                      return (
                        <option key={v.id || i} value={code}>
                          {code} ({v.evegah_model_name || v.model || 'Evegah EV'})
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="jc-form-group">
                  <label className="jc-label">Model</label>
                  <input
                    type="text"
                    className="jc-input"
                    value={vehicleModel}
                    onChange={(e) => setVehicleModel(e.target.value)}
                    required
                  />
                </div>

                <div className="jc-form-group">
                  <label className="jc-label">Odometer / Current KM</label>
                  <input
                    type="text"
                    className="jc-input"
                    value={kmReading}
                    onChange={(e) => setKmReading(e.target.value)}
                    placeholder="e.g. 4,280 km"
                  />
                </div>
              </div>
            </div>

            {/* ── Rider Responsibility & Liability ── */}
            <div>
              <div className="jc-toggle-box" onClick={() => setIsRiderDamage(!isRiderDamage)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input
                    type="checkbox"
                    checked={isRiderDamage}
                    onChange={(e) => setIsRiderDamage(e.target.checked)}
                    style={{ width: '18px', height: '18px', accentColor: '#2A195C', cursor: 'pointer' }}
                  />
                  <div>
                    <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0F172A' }}>
                      Rider Damage Incident (Billable to Rider)
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748B' }}>
                      Check if vehicle was damaged by the rider during rental period to track liability and recover expense.
                    </div>
                  </div>
                </div>
                <span style={{ fontSize: '12px', fontWeight: 800, color: isRiderDamage ? '#EF4444' : '#64748B' }}>
                  {isRiderDamage ? '⚠️ Rider Liable' : '🛡️ Fleet Expense'}
                </span>
              </div>

              {isRiderDamage && (
                <div style={{ marginTop: '14px', background: '#FEF2F2', border: '1.5px solid #FECACA', borderRadius: '12px', padding: '16px' }}>
                  <div className="jc-grid-3">
                    <div className="jc-form-group">
                      <label className="jc-label" style={{ color: '#991B1B' }}>Rider Name *</label>
                      <input
                        type="text"
                        className="jc-input"
                        value={riderName}
                        onChange={(e) => setRiderName(e.target.value)}
                        placeholder="Rider full name"
                        required={isRiderDamage}
                      />
                    </div>

                    <div className="jc-form-group">
                      <label className="jc-label" style={{ color: '#991B1B' }}>Rider Mobile</label>
                      <input
                        type="text"
                        className="jc-input"
                        value={riderMobile}
                        onChange={(e) => setRiderMobile(e.target.value)}
                        placeholder="+91 9XXXXXXXXX"
                      />
                    </div>

                    <div className="jc-form-group">
                      <label className="jc-label" style={{ color: '#991B1B' }}>Ride / Reservation ID</label>
                      <input
                        type="text"
                        className="jc-input"
                        value={reservationId}
                        onChange={(e) => setReservationId(e.target.value)}
                        placeholder="e.g. EVR-2C1CF7"
                      />
                    </div>
                  </div>

                  <div className="jc-grid-3" style={{ marginTop: '12px' }}>
                    <div className="jc-form-group">
                      <label className="jc-label" style={{ color: '#991B1B' }}>Damage Liability</label>
                      <select
                        className="jc-select"
                        value={liability}
                        onChange={(e) => setLiability(e.target.value)}
                      >
                        <option value="Rider Liable">Rider Liable (100% Recovery)</option>
                        <option value="Shared 50-50">Shared 50-50</option>
                        <option value="Insurance Claim">Insurance Claim</option>
                        <option value="Company / Fleet">Company / Fleet Absorbed</option>
                      </select>
                    </div>

                    <div className="jc-form-group">
                      <label className="jc-label" style={{ color: '#991B1B' }}>Rider Charge Amount (₹)</label>
                      <input
                        type="number"
                        className="jc-input"
                        value={riderChargeAmount}
                        onChange={(e) => setRiderChargeAmount(Number(e.target.value))}
                        placeholder="Amount to collect"
                      />
                    </div>

                    <div className="jc-form-group">
                      <label className="jc-label" style={{ color: '#991B1B' }}>Recovery Status</label>
                      <select
                        className="jc-select"
                        value={riderPaymentStatus}
                        onChange={(e) => setRiderPaymentStatus(e.target.value)}
                      >
                        <option value="Deducted from Deposit">Deducted from Deposit</option>
                        <option value="Paid via UPI">Paid via UPI / PayU</option>
                        <option value="Paid via Cash">Paid via Cash</option>
                        <option value="Pending Recovery">Pending Recovery</option>
                        <option value="Waived">Waived / Forgiven</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── Maintenance & Service Scope ── */}
            <div>
              <div className="jc-section-title">
                <span>2. Service Scope &amp; Workshop Details</span>
              </div>
              <div className="jc-grid-3">
                <div className="jc-form-group">
                  <label className="jc-label">Issue Category *</label>
                  <select
                    className="jc-select"
                    value={issueCategory}
                    onChange={(e) => setIssueCategory(e.target.value)}
                  >
                    <option value="Body & Panel Damage">Body &amp; Panel Damage</option>
                    <option value="Brake Lever & Indicator">Brake Lever &amp; Indicator</option>
                    <option value="Headlamp & Visor Impact">Headlamp &amp; Visor Impact</option>
                    <option value="Mudguard & Tail Lamp">Mudguard &amp; Tail Lamp</option>
                    <option value="Tyre Tread & Puncture Repair">Tyre Tread &amp; Puncture Repair</option>
                    <option value="10,000 km Periodic Service">10,000 km Periodic Service</option>
                    <option value="Battery Check & BMS">Battery Check &amp; BMS</option>
                    <option value="Motor & Wiring Controller">Motor &amp; Wiring Controller</option>
                  </select>
                </div>

                <div className="jc-form-group">
                  <label className="jc-label">Priority</label>
                  <select
                    className="jc-select"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    <option value="Critical / Urgent">Critical / Urgent</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div className="jc-form-group">
                  <label className="jc-label">Assigned Technician</label>
                  <select
                    className="jc-select"
                    value={assignedTechnician}
                    onChange={(e) => setAssignedTechnician(e.target.value)}
                  >
                    <option value="Ramesh Patel">Ramesh Patel (Master EV Mechanic)</option>
                    <option value="Suresh Yadav">Suresh Yadav (Electrical &amp; BMS)</option>
                    <option value="Krunal Parmar">Krunal Parmar (Body &amp; Chassis)</option>
                  </select>
                </div>
              </div>

              <div className="jc-form-group" style={{ marginTop: '14px' }}>
                <label className="jc-label">Damage Description &amp; Technical Notes *</label>
                <textarea
                  className="jc-textarea"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed inspection findings, damaged components, replacement parts required..."
                  required
                />
              </div>
            </div>

            {/* ── Costs & Estimation ── */}
            <div>
              <div className="jc-section-title">
                <span>3. Financial Estimation</span>
              </div>
              <div className="jc-grid-3">
                <div className="jc-form-group">
                  <label className="jc-label">Spare Parts Cost (₹)</label>
                  <input
                    type="number"
                    className="jc-input"
                    value={partsCost}
                    onChange={(e) => setPartsCost(Number(e.target.value))}
                  />
                </div>

                <div className="jc-form-group">
                  <label className="jc-label">Labor &amp; Service Charge (₹)</label>
                  <input
                    type="number"
                    className="jc-input"
                    value={laborCost}
                    onChange={(e) => setLaborCost(Number(e.target.value))}
                  />
                </div>

                <div className="jc-form-group">
                  <label className="jc-label">Total Expense (₹)</label>
                  <div style={{ padding: '9px 12px', background: '#F8FAFC', borderRadius: '10px', border: '1.5px solid #E2E8F0', fontWeight: 800, fontSize: '15px', color: '#0F172A' }}>
                    ₹{totalCost.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="jc-footer">
            <button type="button" className="jc-btn-cancel" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="jc-btn-submit" disabled={submitting}>
              {submitting ? 'Creating Job Card...' : '✓ Generate Job Card & Log Maintenance'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
