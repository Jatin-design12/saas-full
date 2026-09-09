'use client';
import React from 'react';

const PARTNERS = [
  {
    name: 'ZYPP Electric',
    logo: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ fontSize: '20px', fontWeight: 900, color: '#16A34A', letterSpacing: '-0.02em' }}>⚡ZYPP</span>
      </div>
    ),
  },
  {
    name: 'Bounce',
    logo: (
      <span style={{ fontSize: '22px', fontWeight: 900, color: '#E11D48', letterSpacing: '-0.03em' }}>bounce</span>
    ),
  },
  {
    name: 'Rapido',
    logo: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#FACC15', padding: '3px 8px', borderRadius: '6px' }}>
        <span style={{ fontSize: '15px', fontWeight: 900, color: '#000000', letterSpacing: '0.04em' }}>RAPIDO</span>
      </div>
    ),
  },
  {
    name: 'Lectrix',
    logo: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <span style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#22C55E' }} />
        <span style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', letterSpacing: '0.06em' }}>LECTRIX</span>
      </div>
    ),
  },
  {
    name: 'Altigreen',
    logo: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#16A34A"><polygon points="12 2 22 20 2 20 12 2"/></svg>
        <span style={{ fontSize: '16.5px', fontWeight: 900, color: '#16A34A', letterSpacing: '0.02em' }}>ALTIGREEN</span>
      </div>
    ),
  },
  {
    name: 'BluSmart Mobility',
    logo: (
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <span style={{ fontSize: '19px', fontWeight: 900, color: '#0284C7', letterSpacing: '-0.02em' }}>BLU</span>
        <span style={{ fontSize: '7.5px', fontWeight: 800, color: '#0284C7', letterSpacing: '0.06em' }}>SMART MOBILITY</span>
      </div>
    ),
  },
  {
    name: 'Yulu',
    logo: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <span style={{ width: '18px', height: '18px', borderRadius: '50%', border: '3.5px solid #06B6D4' }} />
        <span style={{ fontSize: '20px', fontWeight: 900, color: '#06B6D4', letterSpacing: '-0.02em' }}>yulu</span>
      </div>
    ),
  },
];

export default function SocialProof() {
  return (
    <section style={{ padding: '65px 0 50px', backgroundColor: '#F8FAFC', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
      <div className="container-custom">
        {/* Top Header & 4 Key Metric Counters */}
        <div className="metrics-header-grid">
          <div>
            <span className="section-tag">TRUSTED PLATFORM</span>
            <h2 className="section-heading" style={{ fontSize: '28px', marginBottom: '6px' }}>
              Powering EV Businesses Across India
            </h2>
            <p className="section-subheading" style={{ fontSize: '14px' }}>
              Join leading companies who trust Evegah for their EV operations.
            </p>
          </div>

          {/* 4 Stat Counters */}
          <div className="stats-counters-row">
            <div className="stat-counter-item">
              <div className="stat-num">500+</div>
              <div className="stat-label">Active Fleets</div>
            </div>
            <div className="stat-counter-item">
              <div className="stat-num">50,000+</div>
              <div className="stat-label">Riders Managed</div>
            </div>
            <div className="stat-counter-item">
              <div className="stat-num">1M+</div>
              <div className="stat-label">Battery Swaps</div>
            </div>
            <div className="stat-counter-item">
              <div className="stat-num">99.9%</div>
              <div className="stat-label">Uptime</div>
            </div>
          </div>
        </div>

        {/* Brand Logos Row */}
        <div className="partners-strip">
          {PARTNERS.map((partner) => (
            <div key={partner.name} className="partner-logo-box">
              {partner.logo}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .metrics-header-grid {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 30px;
          margin-bottom: 40px;
        }

        .stats-counters-row {
          display: flex;
          align-items: center;
          gap: 36px;
        }

        .stat-counter-item {
          text-align: left;
        }

        .stat-num {
          font-family: 'Outfit', sans-serif;
          font-size: 28px;
          font-weight: 800;
          color: #0F172A;
          line-height: 1.1;
        }

        .stat-label {
          font-size: 11.5px;
          font-weight: 600;
          color: #64748B;
          margin-top: 2px;
        }

        .partners-strip {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          flex-wrap: wrap;
          padding-top: 24px;
          border-top: 1px solid #E2E8F0;
        }

        .partner-logo-box {
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.88;
          transition: opacity 0.2s ease, transform 0.2s ease;
          padding: 8px 12px;
        }

        .partner-logo-box:hover {
          opacity: 1;
          transform: translateY(-2px);
        }

        @media (max-width: 900px) {
          .stats-counters-row {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            width: 100%;
          }
          .partners-strip {
            justify-content: center;
            gap: 20px;
          }
        }
      `}</style>
    </section>
  );
}
