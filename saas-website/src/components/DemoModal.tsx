'use client';
import React, { useState } from 'react';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPlan?: string;
}

export default function DemoModal({ isOpen, onClose, initialPlan }: DemoModalProps) {
  const [fullName, setFullName] = useState('');
  const [workEmail, setWorkEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [orgName, setOrgName] = useState('');
  const [fleetSize, setFleetSize] = useState('51-200 vehicles');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(6px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={handleReset}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          maxWidth: '480px',
          width: '100%',
          padding: '32px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleReset}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#94A3B8',
            padding: '4px',
          }}
          aria-label="Close modal"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '24px 8px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#DCFCE7',
                color: '#16A34A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
              }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '22px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
              Demo Request Received!
            </h3>
            <p style={{ fontSize: '14px', color: '#64748B', lineHeight: '1.5', marginBottom: '24px' }}>
              Thank you, <strong>{fullName || 'Fleet Manager'}</strong>. Our EV solutions specialist will contact you at <strong>{workEmail}</strong> within 2 business hours.
            </p>
            <button onClick={handleReset} className="btn-primary" style={{ width: '100%' }}>
              Done
            </button>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <span className="section-tag" style={{ marginBottom: '4px' }}>GET IN TOUCH</span>
              <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '22px', fontWeight: 800, color: '#0F172A', margin: '0 0 4px' }}>
                Request a Personalized Demo
              </h3>
              <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
                See how Evegah powers your EV fleet, battery swaps, and rider app in one integrated platform.
              </p>
              {initialPlan && (
                <div style={{ marginTop: '8px', display: 'inline-block', backgroundColor: '#F3E8FF', color: '#2A195C', fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '6px' }}>
                  Interested in: {initialPlan}
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '13.5px',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Work Email *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. rahul@evmobility.com"
                  value={workEmail}
                  onChange={(e) => setWorkEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '13.5px',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '13.5px',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Organization</label>
                  <input
                    type="text"
                    placeholder="e.g. GreenMobility Pvt"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '13.5px',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Fleet Size</label>
                <select
                  value={fleetSize}
                  onChange={(e) => setFleetSize(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '13.5px',
                    outline: 'none',
                    backgroundColor: '#FFFFFF',
                  }}
                >
                  <option value="1-50 vehicles">1 - 50 EV Scooters / Bikes</option>
                  <option value="51-200 vehicles">51 - 200 EV Vehicles</option>
                  <option value="201-500 vehicles">201 - 500 EV Vehicles</option>
                  <option value="500+ vehicles">500+ Enterprise Fleet</option>
                </select>
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
                style={{ width: '100%', marginTop: '6px', borderRadius: '10px', padding: '12px' }}
              >
                {loading ? 'Submitting Request...' : 'Schedule Personalized Demo'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
