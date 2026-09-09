'use client';
import React, { useState } from 'react';

interface FeaturesProps {
  onRequestDemo: (featureName?: string) => void;
}

const CORE_FEATURES = [
  {
    id: 'fleet',
    title: 'Fleet Management',
    description: 'Track, monitor and manage your entire EV fleet in real time with precision GPS and remote lock.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.2">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
    bgColor: '#EFF6FF',
    badge: 'Live GPS',
  },
  {
    id: 'riders',
    title: 'Rider Management',
    description: 'Onboard, verify and manage riders with instant Aadhaar/DL verification and ride history.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0284C7" strokeWidth="2.2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    bgColor: '#F0F9FF',
    badge: '60s KYC',
  },
  {
    id: 'battery',
    title: 'Battery Operations',
    description: 'Manage battery inventory, swaps, charge cycles, SOH health index and thermal diagnostics.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.2">
        <rect x="2" y="7" width="16" height="10" rx="2" ry="2" />
        <line x1="22" y1="11" x2="22" y2="13" />
        <line x1="6" y1="11" x2="6" y2="13" />
        <line x1="10" y1="11" x2="10" y2="13" />
      </svg>
    ),
    bgColor: '#F0FDF4',
    badge: 'Smart BMS',
  },
  {
    id: 'rental',
    title: 'Rental & Booking',
    description: 'Flexible rental plans (Daily, Weekly, Monthly) with automated security deposit refunds.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2.2">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    bgColor: '#FAF5FF',
    badge: 'Flexible Plans',
  },
  {
    id: 'maintenance',
    title: 'Maintenance Management',
    description: 'Automated service schedules, digital job cards, spare parts inventory and mechanic logs.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9333EA" strokeWidth="2.2">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
    bgColor: '#FAF5FF',
    badge: 'Zero Downtime',
  },
  {
    id: 'billing',
    title: 'Payments & Billing',
    description: 'Automated billing, GST invoices, multi-gateway integration and instant ICICI corporate payouts.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0D9488" strokeWidth="2.2">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    ),
    bgColor: '#F0FDFA',
    badge: 'Auto Settlement',
  },
  {
    id: 'analytics',
    title: 'Analytics & Reports',
    description: 'Real-time revenue metrics, fleet utilization, CO2 carbon credits and automated audit exports.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2.2">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
    bgColor: '#FFFBEB',
    badge: 'Real-Time Insights',
  },
  {
    id: 'multilocation',
    title: 'Multi-Location Support',
    description: 'Manage multiple zones, franchise stations, master depots and cities from a unified console.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.2">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    bgColor: '#ECFDF5',
    badge: 'Multi-Zone',
  },
];

const DEEP_DIVE_MODULES = [
  {
    id: 'telematics',
    tabName: 'Fleet Telematics & Geofencing',
    tagline: 'Precision 2-Second GPS Tracking with Geofence Perimeter Security',
    description: 'Monitor vehicle velocity, battery depletion rates, rider route corridors, and instant unauthorized movement alerts. Remotely immobilize scooters if geofence perimeter is breached.',
    metrics: [
      { label: 'GPS Ping Rate', val: '2.0 sec' },
      { label: 'Location Accuracy', val: '< 2.5 meters' },
      { label: 'Remote Immobilizer', val: '< 500 ms SLA' },
      { label: 'Geofence Breach Alert', val: 'Instant SMS & Push' },
    ],
    checklist: [
      'Multi-Polygon geofenced zone boundary definitions',
      'Remote speed governor (City: 25 km/h, Cargo: 45 km/h)',
      'Crash, fall & abrupt deceleration IMU sensor alerts',
      'Over-The-Air (FOTA) telemetry firmware upgrades',
    ],
    previewTitle: 'Fleet Telematics Console',
    previewBadge: 'Live Stream Active',
  },
  {
    id: 'bms',
    tabName: 'BMS Battery Swap Station Hub',
    tagline: 'Intelligent Cabinet Locker Management with Health-Index Diagnostics',
    description: 'Connects directly with your battery swap stations. Manages 8-bay locker cabinets, authenticates riders via QR scan in under 60 seconds, and measures individual cell voltages and temperatures.',
    metrics: [
      { label: 'Swap Turnaround', val: '< 55 seconds' },
      { label: 'Cabinet Bays', val: '8 Docks / Station' },
      { label: 'Thermal Safety Cutoff', val: '48°C Trigger' },
      { label: 'Avg. Battery SOH', val: '97.2% Fleet Health' },
    ],
    checklist: [
      'Automated locker door latch release upon rider verification',
      'Dual-chemistry support (60V / 30Ah & 72V / 40Ah Li-ion)',
      'Cell imbalance and degraded string auto-isolation',
      'Automated swap invoicing linked to rider digital wallet',
    ],
    previewTitle: 'Smart Swap Dock Telemetry',
    previewBadge: '6 Bays Ready for Swap',
  },
  {
    id: 'kyc',
    tabName: 'Automated Rider Onboarding & KYC',
    tagline: 'Frictionless Paperless Onboarding Verified in Under 60 Seconds',
    description: 'Integrated with government identity databases for instant Aadhaar QR verification, DigiLocker KYC, and driving license validation. Eliminates fraud and physical paperwork.',
    metrics: [
      { label: 'Verification Speed', val: '< 60 Seconds' },
      { label: 'KYC Success Rate', val: '98.6%' },
      { label: 'Document Fraud Catch', val: '100% Zero-Trust' },
      { label: 'Digital Agreement', val: 'Auto E-Sign' },
    ],
    checklist: [
      'Aadhaar OCR & live biometric selfie match',
      'Driving License status verification via Parivahan API',
      'Custom deposit rules and risk scoring algorithm',
      'Instant WhatsApp rental confirmation and onboarding receipt',
    ],
    previewTitle: 'Automated KYC Engine',
    previewBadge: 'DigiLocker Verified',
  },
  {
    id: 'billing',
    tabName: 'Subscriptions & ICICI Settlements',
    tagline: 'Automated Multi-Tenant Billing with Instant Split Payouts',
    description: 'Handle recurring daily, weekly, monthly packages with automated security deposit refunds and franchise commission splits directly disbursed through ICICI E-Collect.',
    metrics: [
      { label: 'Payment Methods', val: 'UPI, Cards, NetBanking' },
      { label: 'Franchise Split', val: 'Automated Daily/Monthly' },
      { label: 'Deposit Refund SLA', val: 'Instant on Return' },
      { label: 'GST Compliance', val: 'Auto E-Invoices' },
    ],
    checklist: [
      'Daily, Weekly, and Monthly rental package plans',
      'Automated security deposit deduction and instant return credit',
      'Multi-franchise commission split calculation and disbursement',
      'Automated reconciliation with bank statement export',
    ],
    previewTitle: 'Financial Billing & Payout Hub',
    previewBadge: 'ICICI E-Collect Integrated',
  },
];

export default function Features({ onRequestDemo }: FeaturesProps) {
  const [activeModule, setActiveModule] = useState(0);

  return (
    <section id="features" style={{ padding: '75px 0', backgroundColor: '#FFFFFF', position: 'relative' }}>
      <div className="container-custom">
        {/* Section Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '38px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span className="section-tag">BUILT FOR SCALE</span>
            <h2 className="section-heading">Enterprise Features</h2>
            <p className="section-subheading">
              Everything you need to operate, automate, and grow your EV fleet business.
            </p>
          </div>

          <button
            onClick={() => onRequestDemo('All Enterprise Features')}
            className="btn-secondary"
            style={{ padding: '10px 22px', fontSize: '13.5px' }}
          >
            Explore All Features
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>

        {/* 4x2 Feature Grid (from Reference Design) */}
        <div className="features-grid">
          {CORE_FEATURES.map((feat) => (
            <div
              key={feat.title}
              className="feature-card"
              onClick={() => onRequestDemo(feat.title)}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    backgroundColor: feat.bgColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'transform 0.2s ease',
                  }}
                  className="feat-icon-box"
                >
                  {feat.icon}
                </div>
                <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#64748B', background: '#F1F5F9', padding: '2px 8px', borderRadius: '9999px' }}>
                  {feat.badge}
                </span>
              </div>

              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>
                {feat.title}
              </h3>
              <p style={{ fontSize: '13px', color: '#64748B', lineHeight: '1.5', margin: 0 }}>
                {feat.description}
              </p>
            </div>
          ))}
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            FEATURE DEEP-DIVE EXPLORER (Requested by User)
            ═══════════════════════════════════════════════════════════════ */}
        <div className="deep-dive-box">
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <span className="section-tag">ARCHITECTURE DEEP DIVE</span>
            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '26px', fontWeight: 800, color: '#0F172A', margin: '4px 0' }}>
              Built for Real Indian EV Operations &amp; Extreme Scale
            </h3>
            <p style={{ fontSize: '14px', color: '#64748B', maxWidth: '600px', margin: '0 auto' }}>
              Click through the modules below to see how Evegah handles real-world fleet telemetry, battery swaps, and automated payouts.
            </p>
          </div>

          {/* Module Selector Tabs */}
          <div className="module-tabs-nav">
            {DEEP_DIVE_MODULES.map((mod, idx) => (
              <button
                key={mod.id}
                onClick={() => setActiveModule(idx)}
                className={`module-tab-btn ${activeModule === idx ? 'active' : ''}`}
              >
                {mod.tabName}
              </button>
            ))}
          </div>

          {/* Active Module Detailed Showcase Card */}
          {(() => {
            const mod = DEEP_DIVE_MODULES[activeModule];
            return (
              <div className="module-showcase-card">
                <div className="module-left-info">
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, color: '#16A34A', background: '#DCFCE7', padding: '2px 10px', borderRadius: '9999px', marginBottom: '10px' }}>
                    <span className="animate-pulse-dot" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#16A34A' }} />
                    {mod.previewBadge}
                  </div>

                  <h4 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '22px', fontWeight: 800, color: '#0F172A', lineHeight: 1.25, marginBottom: '8px' }}>
                    {mod.tagline}
                  </h4>
                  <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: '1.6', marginBottom: '20px' }}>
                    {mod.description}
                  </p>

                  {/* 4 Metric Pills */}
                  <div className="module-metrics-grid">
                    {mod.metrics.map((m) => (
                      <div key={m.label} className="mod-metric-box">
                        <span className="mod-metric-label">{m.label}</span>
                        <strong className="mod-metric-val">{m.val}</strong>
                      </div>
                    ))}
                  </div>

                  {/* Checklist */}
                  <div className="mod-checklist">
                    {mod.checklist.map((item) => (
                      <div key={item} className="mod-check-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => onRequestDemo(mod.tabName)}
                    className="btn-primary"
                    style={{ marginTop: '22px', width: 'fit-content', padding: '11px 22px', fontSize: '13.5px' }}
                  >
                    Schedule Walkthrough for this Feature →
                  </button>
                </div>

                {/* Right Interactive Preview Display */}
                <div className="module-right-preview">
                  <div className="preview-terminal-frame">
                    <div className="preview-bar">
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444' }} />
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#F59E0B' }} />
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }} />
                      </div>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#CBD5E1' }}>{mod.previewTitle}</span>
                    </div>

                    <div className="preview-body">
                      {mod.id === 'telematics' && (
                        <div className="telematics-mock">
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <div>
                              <strong style={{ fontSize: '13px', color: '#FFFFFF' }}>GJ06-EV-1025</strong>
                              <div style={{ fontSize: '10px', color: '#94A3B8' }}>Evegah City 60V • Rider: Rakesh Solanki</div>
                            </div>
                            <span style={{ fontSize: '10px', fontWeight: 800, color: '#22C55E', background: 'rgba(34, 197, 94, 0.18)', padding: '2px 8px', borderRadius: '4px' }}>
                              INSIDE GEOFENCE
                            </span>
                          </div>

                          <div style={{ background: '#0F172A', borderRadius: '8px', padding: '12px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                            <div>
                              <span style={{ fontSize: '9.5px', color: '#64748B' }}>SPEED</span>
                              <div style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF' }}>34 km/h</div>
                            </div>
                            <div>
                              <span style={{ fontSize: '9.5px', color: '#64748B' }}>BATTERY SOC</span>
                              <div style={{ fontSize: '16px', fontWeight: 800, color: '#22C55E' }}>88%</div>
                            </div>
                            <div>
                              <span style={{ fontSize: '9.5px', color: '#64748B' }}>RANGE EST.</span>
                              <div style={{ fontSize: '16px', fontWeight: 800, color: '#38BDF8' }}>74 km</div>
                            </div>
                          </div>

                          <div style={{ fontSize: '11px', color: '#94A3B8', borderTop: '1px solid #334155', paddingTop: '8px' }}>
                            📍 GPS: 22.2882° N, 73.1974° E &bull; Heading: North-West &bull; Signal: -62 dBm LTE-M
                          </div>
                        </div>
                      )}

                      {mod.id === 'bms' && (
                        <div className="bms-mock">
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <div>
                              <strong style={{ fontSize: '13px', color: '#FFFFFF' }}>Station Cabinet #01</strong>
                              <div style={{ fontSize: '10px', color: '#94A3B8' }}>Manjalpur Hub &bull; 8 Locker Bays</div>
                            </div>
                            <span style={{ fontSize: '10px', fontWeight: 800, color: '#22C55E', background: 'rgba(34, 197, 94, 0.18)', padding: '2px 8px', borderRadius: '4px' }}>
                              STATION ONLINE
                            </span>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', marginBottom: '10px' }}>
                            {[
                              { bay: 'Bay 1', soc: '100%', status: 'Ready', color: '#22C55E' },
                              { bay: 'Bay 2', soc: '98%', status: 'Ready', color: '#22C55E' },
                              { bay: 'Bay 3', soc: '95%', status: 'Ready', color: '#22C55E' },
                              { bay: 'Bay 4', soc: '84%', status: 'Charging', color: '#F59E0B' },
                              { bay: 'Bay 5', soc: '68%', status: 'Charging', color: '#F59E0B' },
                              { bay: 'Bay 6', soc: '100%', status: 'Ready', color: '#22C55E' },
                              { bay: 'Bay 7', soc: 'Empty', status: 'Inward', color: '#64748B' },
                              { bay: 'Bay 8', soc: '100%', status: 'Ready', color: '#22C55E' },
                            ].map((b) => (
                              <div key={b.bay} style={{ background: '#0F172A', padding: '6px', borderRadius: '6px', textAlign: 'center' }}>
                                <span style={{ fontSize: '8.5px', color: '#64748B' }}>{b.bay}</span>
                                <div style={{ fontSize: '11px', fontWeight: 800, color: b.color }}>{b.soc}</div>
                              </div>
                            ))}
                          </div>

                          <div style={{ fontSize: '10.5px', color: '#94A3B8', borderTop: '1px solid #334155', paddingTop: '8px' }}>
                            ⚡ Swaps Completed Today: <strong>48 Swaps</strong> &bull; Avg Swap Duration: <strong>42 secs</strong>
                          </div>
                        </div>
                      )}

                      {mod.id === 'kyc' && (
                        <div className="kyc-mock">
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <div>
                              <strong style={{ fontSize: '13px', color: '#FFFFFF' }}>Instant KYC Engine</strong>
                              <div style={{ fontSize: '10px', color: '#94A3B8' }}>Zero Manual Intervention</div>
                            </div>
                            <span style={{ fontSize: '10px', fontWeight: 800, color: '#22C55E', background: 'rgba(34, 197, 94, 0.18)', padding: '2px 8px', borderRadius: '4px' }}>
                              VERIFIED APPROVED
                            </span>
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '10px' }}>
                            {[
                              { doc: 'Aadhaar QR Verified', status: 'UIDAI Authenticated', pass: true },
                              { doc: 'Driving License Status', status: 'Parivahan Validated (Active)', pass: true },
                              { doc: 'Facial Biometric Match', status: '99.4% Face Confidence', pass: true },
                              { doc: 'E-Sign Rental Contract', status: 'IP & Timestamp Signed', pass: true },
                            ].map((k) => (
                              <div key={k.doc} style={{ background: '#0F172A', padding: '6px 10px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '11px', color: '#FFFFFF', fontWeight: 600 }}>{k.doc}</span>
                                <span style={{ fontSize: '9.5px', color: '#22C55E', fontWeight: 700 }}>✓ {k.status}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {mod.id === 'billing' && (
                        <div className="billing-mock">
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <div>
                              <strong style={{ fontSize: '13px', color: '#FFFFFF' }}>ICICI Payout Ledger</strong>
                              <div style={{ fontSize: '10px', color: '#94A3B8' }}>Automated Corporate Disbursement</div>
                            </div>
                            <span style={{ fontSize: '10px', fontWeight: 800, color: '#38BDF8', background: 'rgba(56, 189, 248, 0.18)', padding: '2px 8px', borderRadius: '4px' }}>
                              E-COLLECT API
                            </span>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '10px' }}>
                            <div style={{ background: '#0F172A', padding: '8px', borderRadius: '6px' }}>
                              <span style={{ fontSize: '9.5px', color: '#64748B' }}>DAILY REVENUE</span>
                              <div style={{ fontSize: '14px', fontWeight: 800, color: '#22C55E' }}>₹68,450</div>
                            </div>
                            <div style={{ background: '#0F172A', padding: '8px', borderRadius: '6px' }}>
                              <span style={{ fontSize: '9.5px', color: '#64748B' }}>FRANCHISE SPLIT</span>
                              <div style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF' }}>₹17,112</div>
                            </div>
                            <div style={{ background: '#0F172A', padding: '8px', borderRadius: '6px' }}>
                              <span style={{ fontSize: '9.5px', color: '#64748B' }}>DEPOSIT POOL</span>
                              <div style={{ fontSize: '14px', fontWeight: 800, color: '#A855F7' }}>₹5,40,000</div>
                            </div>
                          </div>

                          <div style={{ fontSize: '10.5px', color: '#94A3B8', borderTop: '1px solid #334155', paddingTop: '8px' }}>
                            🏦 Next Settlement: <strong>Friday, 10:00 AM IST</strong> &bull; Bank: <strong>ICICI Corporate CMS</strong>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      <style jsx>{`
        .features-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 50px;
        }

        .feature-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 16px;
          padding: 24px 20px;
          box-shadow: 0 2px 6px rgba(15, 23, 42, 0.02);
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
        }

        .feature-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 28px rgba(15, 23, 42, 0.08);
          border-color: #2A195C;
        }

        .feature-card:hover :global(.feat-icon-box) {
          transform: scale(1.1);
        }

        /* Deep Dive Box */
        .deep-dive-box {
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 24px;
          padding: 36px 32px;
        }

        .module-tabs-nav {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 28px;
        }

        .module-tab-btn {
          padding: 10px 20px;
          border-radius: 9999px;
          font-size: 13px;
          font-weight: 700;
          color: #475569;
          background: #FFFFFF;
          border: 1.5px solid #CBD5E1;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .module-tab-btn:hover {
          border-color: #2A195C;
          color: #2A195C;
        }

        .module-tab-btn.active {
          background: #2A195C;
          color: #FFFFFF;
          border-color: #2A195C;
          box-shadow: 0 4px 12px rgba(42, 25, 92, 0.25);
        }

        .module-showcase-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 20px;
          padding: 36px 34px;
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 36px;
          align-items: center;
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.04);
        }

        .module-metrics-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          margin-bottom: 18px;
        }

        .mod-metric-box {
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          padding: 10px 12px;
          display: flex;
          flex-direction: column;
        }

        .mod-metric-label {
          font-size: 10px;
          font-weight: 700;
          color: #64748B;
          text-transform: uppercase;
        }

        .mod-metric-val {
          font-size: 16px;
          font-weight: 800;
          color: #0F172A;
          margin-top: 2px;
        }

        .mod-checklist {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .mod-check-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #334155;
          font-weight: 500;
        }

        /* Preview Terminal Frame */
        .preview-terminal-frame {
          background: #1E293B;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 16px 36px rgba(15, 23, 42, 0.2);
          border: 1px solid #334155;
        }

        .preview-bar {
          background: #0F172A;
          padding: 10px 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #334155;
        }

        .preview-body {
          padding: 18px;
        }

        @media (max-width: 1024px) {
          .features-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .module-showcase-card {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .features-grid {
            grid-template-columns: 1fr;
          }
          .deep-dive-box {
            padding: 24px 16px;
          }
          .module-showcase-card {
            padding: 20px 16px;
          }
        }
      `}</style>
    </section>
  );
}
