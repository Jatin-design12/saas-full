'use client';
import React, { useState } from 'react';

interface IndustrySolutionsProps {
  onRequestDemo?: () => void;
}

export default function IndustrySolutions({ onRequestDemo }: IndustrySolutionsProps) {
  const [activeTab, setActiveTab] = useState<number>(0);

  const industries = [
    {
      id: 'delivery',
      title: 'Delivery & Logistics',
      tagline: 'Faster deliveries. Zero fuel downtime.',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      ),
      color: '#4F46E5',
      lightBg: '#EEF2FF',
      glowLight: 'rgba(79, 70, 229, 0.15)',
      statValue: '42%',
      statLabel: 'Lower Cost per Delivery',
      description: 'Equip your delivery fleet with high-payload electric scooters and automated swap stations to eliminate charging downtime and slash delivery expenses.',
      features: ['60-second rapid battery swap', 'Real-time GPS delivery proof', 'Automated maintenance scheduling'],
      image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=700&auto=format&fit=crop&q=80'
    },
    {
      id: 'tourism',
      title: 'Tourism & Hospitality',
      tagline: 'Sustainable travel experiences for guests.',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
      color: '#0891B2',
      lightBg: '#ECFEFF',
      glowLight: 'rgba(8, 145, 178, 0.15)',
      statValue: '4.9★',
      statLabel: 'Guest Satisfaction Rating',
      description: 'Delight resort guests and tourists with premium zero-emission EV rentals, curated scenic geo-tours, and seamless keyless smartphone unlock.',
      features: ['QR-code hotel lobby unlock', 'Custom geofenced speed zones', 'Self-guided tourist routes'],
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=700&auto=format&fit=crop&q=80'
    },
    {
      id: 'campus',
      title: 'Campus Mobility',
      tagline: 'Safe, smart micro-mobility across campus.',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
      ),
      color: '#059669',
      lightBg: '#ECFDF5',
      glowLight: 'rgba(5, 150, 105, 0.15)',
      statValue: '100%',
      statLabel: 'Geofenced Safety Control',
      description: 'Connect university campuses and corporate tech parks with safe micro-mobility, automated student passes, and speed-capped zones.',
      features: ['Virtual designated parking bays', 'Student ID card & OTP auth', 'Zero campus vehicle accidents'],
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=700&auto=format&fit=crop&q=80'
    },
    {
      id: 'corporate',
      title: 'Corporate & Commercial',
      tagline: 'Modern EV mobility for workplaces.',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      ),
      color: '#DB2777',
      lightBg: '#FDF2F8',
      glowLight: 'rgba(219, 39, 119, 0.15)',
      statValue: '2.4T',
      statLabel: 'CO₂ Saved Per Company/Yr',
      description: 'Empower modern enterprise teams with zero-emission daily commutes, automated tax-deductible ESG reporting, and executive fleet sharing.',
      features: ['Corporate SSO & billing', 'Monthly ESG carbon certificates', 'Dedicated corporate hub stations'],
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=700&auto=format&fit=crop&q=80'
    },
    {
      id: 'sharing',
      title: 'Rental & Sharing',
      tagline: 'Accessible EV rentals for everyone.',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="7" r="4" />
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          <path d="M21 21v-2a4 4 0 0 0-3-3.85" />
        </svg>
      ),
      color: '#D97706',
      lightBg: '#FFFBEB',
      glowLight: 'rgba(217, 119, 6, 0.15)',
      statValue: '98.5%',
      statLabel: 'Fleet Utilization Rate',
      description: 'Launch your own branded public scooter-sharing or daily rental franchise with automated deposit settlements and AI demand forecasting.',
      features: ['Dynamic zone surge pricing', 'Instant Aadhaar/DL KYC check', 'Multi-franchise revenue split'],
      image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=700&auto=format&fit=crop&q=80'
    }
  ];

  return (
    <section
      id="industries"
      style={{
        padding: '90px 0 85px',
        background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 60%, #FFFFFF 100%)',
        position: 'relative',
        overflow: 'hidden',
        color: '#0F172A'
      }}
    >
      {/* Subtle ambient light accents */}
      <div
        style={{
          position: 'absolute',
          top: '15%',
          left: '-10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.05) 0%, rgba(255,255,255,0) 70%)',
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          right: '-10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(14, 165, 233, 0.05) 0%, rgba(255,255,255,0) 70%)',
          pointerEvents: 'none'
        }}
      />

      <div className="container-custom" style={{ position: 'relative', zIndex: 2 }}>
        {/* Section Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '44px', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '30px', background: '#EEF2FF', border: '1px solid #C7D2FE', marginBottom: '14px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4F46E5', display: 'inline-block' }} />
              <span style={{ fontSize: '11.5px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#4338CA' }}>
                Diverse Ecosystem
              </span>
            </div>

            <h2
              style={{
                fontSize: 'clamp(28px, 4vw, 42px)',
                fontWeight: 900,
                letterSpacing: '-0.03em',
                margin: '0 0 10px 0',
                color: '#0F172A',
                fontFamily: "'Outfit', sans-serif"
              }}
            >
              Built for{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #0284C7 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: 'inline-block'
                }}
              >
                Every Industry
              </span>
            </h2>
            <p style={{ fontSize: '15px', color: '#64748B', margin: 0, maxWidth: '580px', lineHeight: 1.6 }}>
              Tailored EV mobility solutions for diverse fleets and communities. From hyper-local delivery networks to campus zones and luxury resorts.
            </p>
          </div>

          <button
            type="button"
            onClick={onRequestDemo}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 22px',
              borderRadius: '30px',
              background: '#FFFFFF',
              border: '1.5px solid #E2E8F0',
              color: '#1E293B',
              fontSize: '13.5px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#4F46E5';
              e.currentTarget.style.color = '#4F46E5';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(79, 70, 229, 0.12)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#E2E8F0';
              e.currentTarget.style.color = '#1E293B';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
            }}
          >
            <span>Explore All Industries</span>
            <span style={{ fontSize: '16px' }}>&rarr;</span>
          </button>
        </div>

        {/* 5 Industry Interactive Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(215px, 1fr))',
            gap: '16px',
            marginBottom: '36px'
          }}
        >
          {industries.map((ind, idx) => {
            const isSelected = activeTab === idx;
            return (
              <div
                key={ind.id}
                onClick={() => setActiveTab(idx)}
                style={{
                  position: 'relative',
                  background: isSelected ? '#FFFFFF' : '#FFFFFF',
                  border: isSelected ? `2px solid ${ind.color}` : '1.5px solid #E2E8F0',
                  borderRadius: '20px',
                  padding: '24px 20px',
                  cursor: 'pointer',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: isSelected
                    ? `0 14px 28px -6px ${ind.glowLight}, 0 2px 6px rgba(0,0,0,0.04)`
                    : '0 2px 8px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '210px',
                  transform: isSelected ? 'translateY(-4px)' : 'none'
                }}
                onMouseEnter={e => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = '#CBD5E1';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 18px rgba(0,0,0,0.06)';
                  }
                }}
                onMouseLeave={e => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = '#E2E8F0';
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.03)';
                  }
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        background: ind.lightBg,
                        color: ind.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: `1px solid ${ind.color}33`
                      }}
                    >
                      {ind.icon}
                    </div>

                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 800,
                        padding: '3px 9px',
                        borderRadius: '14px',
                        background: isSelected ? ind.color : '#F1F5F9',
                        color: isSelected ? '#FFFFFF' : '#475569'
                      }}
                    >
                      {ind.statValue}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 6px 0', color: '#0F172A', letterSpacing: '-0.01em' }}>
                    {ind.title}
                  </h3>
                  <p style={{ fontSize: '12.5px', color: '#64748B', margin: 0, lineHeight: 1.45 }}>
                    {ind.tagline}
                  </p>
                </div>

                <div style={{ marginTop: '18px', paddingTop: '12px', borderTop: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '11.5px', color: isSelected ? ind.color : '#64748B', fontWeight: 700 }}>
                    {isSelected ? 'Selected' : 'Explore'}
                  </span>
                  <span style={{ fontSize: '13px', color: isSelected ? ind.color : '#94A3B8', fontWeight: 700 }}>&rarr;</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic Detail Focus Card for Active Industry (Light Theme) */}
        {industries[activeTab] && (
          <div
            style={{
              background: '#FFFFFF',
              border: `1.5px solid #E2E8F0`,
              borderRadius: '24px',
              padding: '34px 38px',
              boxShadow: '0 16px 36px -8px rgba(15, 23, 42, 0.08)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Soft accent bar on top of the card */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: `linear-gradient(90deg, ${industries[activeTab].color}, #818CF8)`
              }}
            />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', borderRadius: '16px', background: industries[activeTab].lightBg, color: industries[activeTab].color, fontSize: '12px', fontWeight: 800, marginBottom: '14px', border: `1px solid ${industries[activeTab].color}33` }}>
                  <span>●</span> Industry Focus &bull; {industries[activeTab].title}
                </div>

                <h3 style={{ fontSize: '24px', fontWeight: 900, color: '#0F172A', margin: '0 0 12px 0', fontFamily: "'Outfit', sans-serif" }}>
                  {industries[activeTab].tagline}
                </h3>

                <p style={{ fontSize: '14.5px', color: '#475569', lineHeight: 1.6, margin: '0 0 20px 0' }}>
                  {industries[activeTab].description}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                  {industries[activeTab].features.map((feat, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: industries[activeTab].lightBg, color: industries[activeTab].color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 'bold', flexShrink: 0 }}>
                        ✓
                      </span>
                      <span style={{ fontSize: '13.5px', color: '#1E293B', fontWeight: 600 }}>{feat}</span>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={onRequestDemo}
                  style={{
                    padding: '12px 28px',
                    borderRadius: '30px',
                    background: industries[activeTab].color,
                    color: '#FFFFFF',
                    border: 'none',
                    fontWeight: 800,
                    fontSize: '14px',
                    cursor: 'pointer',
                    boxShadow: `0 4px 16px ${industries[activeTab].glowLight}`,
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = `0 8px 24px ${industries[activeTab].glowLight}`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = `0 4px 16px ${industries[activeTab].glowLight}`;
                  }}
                >
                  Deploy for {industries[activeTab].title} &rarr;
                </button>
              </div>

              {/* Stat & Image Showcase */}
              <div style={{ position: 'relative' }}>
                <div
                  style={{
                    borderRadius: '18px',
                    overflow: 'hidden',
                    height: '240px',
                    border: '1.5px solid #E2E8F0',
                    position: 'relative',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.06)'
                  }}
                >
                  <img
                    src={industries[activeTab].image}
                    alt={industries[activeTab].title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.1) 60%)' }} />
                  <div style={{ position: 'absolute', bottom: '16px', left: '18px', right: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                      <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#CBD5E1', fontWeight: 700 }}>Key Impact Benchmark</div>
                      <div style={{ fontSize: '19px', fontWeight: 900, color: '#FFFFFF' }}>{industries[activeTab].statLabel}</div>
                    </div>
                    <div style={{ fontSize: '32px', fontWeight: 900, color: '#38BDF8', fontFamily: "'Outfit', sans-serif" }}>
                      {industries[activeTab].statValue}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
