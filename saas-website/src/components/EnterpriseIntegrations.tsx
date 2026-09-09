'use client';
import React, { useState } from 'react';

interface EnterpriseIntegrationsProps {
  onRequestDemo?: () => void;
}

export default function EnterpriseIntegrations({ onRequestDemo }: EnterpriseIntegrationsProps) {
  const [activeIntegration, setActiveIntegration] = useState<string>('fleet');

  const hubs = [
    {
      id: 'fleet',
      name: 'Fleet Systems',
      subtitle: 'CAN Bus & IoT Telematics',
      icon: '🚗',
      color: '#4F46E5',
      codeSnippet: `// Evegah Fleet IoT Event Stream
const ev = new EvegahClient({ apiKey: 'evg_live_...' });

ev.on('telemetry.bms', (battery) => {
  console.log('Vehicle GJ06EV2098 SOC:', battery.soc);
  // Trigger automatic rapid swap reservation at < 20%
  if (battery.soc < 20) {
    ev.swaps.reserveNearestLocker(battery.vehicleId);
  }
});`
    },
    {
      id: 'payments',
      name: 'Payment Platforms',
      subtitle: 'Razorpay, ICICI UPI & Stripe',
      icon: '💳',
      color: '#059669',
      codeSnippet: `// Instant Deposit & Dynamic QR Settlement
const settlement = await ev.payments.createEscrow({
  riderId: 'RD-9021',
  amount: 1500,
  deposit: 1000,
  method: 'ICICI_UPI_DYNAMIC_QR'
});`
    },
    {
      id: 'maps',
      name: 'Maps & Navigation',
      subtitle: 'Mapbox, Google Maps, OpenStreet',
      icon: '🗺️',
      color: '#0891B2',
      codeSnippet: `// Geofenced Zone Ingress / Egress
ev.zones.createPolygon({
  zoneName: 'Gotri Campus Zone',
  maxSpeedKmh: 25,
  autoSpeedThrottle: true
});`
    },
    {
      id: 'analytics',
      name: 'Analytics Tools',
      subtitle: 'Mixpanel, BigQuery & Datadog',
      icon: '📊',
      color: '#D97706',
      codeSnippet: `// Push Fleet Carbon Offsets to Data Lake
await ev.analytics.exportMetric({
  metric: 'co2_saved_kg',
  totalAvoidedKg: 1420.50,
  granularity: 'hourly'
});`
    },
    {
      id: 'custom',
      name: 'Custom Integrations',
      subtitle: 'SAP ERP, Webhooks & Salesforce',
      icon: '⚙️',
      color: '#DB2777',
      codeSnippet: `// Webhook Event Dispatcher
app.post('/webhooks/evegah', (req, res) => {
  const { event, data } = req.body;
  if (event === 'ride.completed') syncToSAP(data);
});`
    }
  ];

  const highlights = [
    {
      title: 'RESTful APIs',
      desc: 'Sub-50ms query response latency with robust endpoints, Postman collections and end-to-end type safety.'
    },
    {
      title: 'Real-time Webhooks',
      desc: 'Guaranteed at-least-once delivery for ride start, return inspections, battery swaps, and panic alerts.'
    },
    {
      title: 'Developer SDKs',
      desc: 'Native client libraries for Node.js, Python, Go, Dart/Flutter, and complete Swagger OpenAPI specs.'
    },
    {
      title: 'Enterprise Security',
      desc: '99.99% SLA uptime, multi-tenant zone isolation, AES-256 telemetry encryption, and SOC2 compliance.'
    }
  ];

  const selectedHub = hubs.find(h => h.id === activeIntegration) || hubs[0];

  return (
    <section
      id="enterprise-integrations"
      style={{
        padding: '95px 0 100px',
        background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
        position: 'relative',
        overflow: 'hidden',
        color: '#0F172A'
      }}
    >
      <div className="container-custom">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 52px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '30px', background: '#EEF2FF', border: '1px solid #C7D2FE', marginBottom: '14px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4F46E5', display: 'inline-block' }} />
            <span style={{ fontSize: '11.5px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#4338CA' }}>
              Developer &amp; Enterprise Suite
            </span>
          </div>

          <h2
            style={{
              fontSize: 'clamp(30px, 4.5vw, 46px)',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              margin: '0 0 12px 0',
              color: '#0F172A',
              fontFamily: "'Outfit', sans-serif"
            }}
          >
            Enterprise Ready.{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #0284C7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block'
              }}
            >
              Open APIs.
            </span>
          </h2>

          <p style={{ fontSize: '15.5px', color: '#64748B', margin: '0 0 26px 0', lineHeight: 1.6 }}>
            Seamless Integrations. Connect Evegah with your existing ERPs, payment gateways, and hardware IoT telematics in minutes.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <a
              href="https://documenter.getpostman.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '11px 26px',
                borderRadius: '30px',
                background: '#4F46E5',
                color: '#FFFFFF',
                textDecoration: 'none',
                fontWeight: 800,
                fontSize: '13.5px',
                boxShadow: '0 4px 14px rgba(79, 70, 229, 0.25)',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              View API Docs &rarr;
            </a>

            <button
              type="button"
              onClick={onRequestDemo}
              style={{
                padding: '11px 24px',
                borderRadius: '30px',
                background: '#FFFFFF',
                border: '1.5px solid #E2E8F0',
                color: '#1E293B',
                fontWeight: 700,
                fontSize: '13.5px',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
              }}
            >
              Request API Key
            </button>
          </div>
        </div>

        {/* Interactive Hub Grid (Left Tabs, Right Code Sandbox) */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1.5px solid #E2E8F0',
            borderRadius: '24px',
            padding: '32px',
            boxShadow: '0 16px 36px -8px rgba(15, 23, 42, 0.06)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '32px',
            marginBottom: '48px'
          }}
        >
          {/* Left: Integration Hub Selector */}
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748B', marginBottom: '14px' }}>
              Select Integration Category
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {hubs.map((hub) => {
                const isSelected = activeIntegration === hub.id;
                return (
                  <div
                    key={hub.id}
                    onClick={() => setActiveIntegration(hub.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 18px',
                      borderRadius: '16px',
                      background: isSelected ? '#F8FAFC' : '#FFFFFF',
                      border: isSelected ? `2px solid ${hub.color}` : '1.5px solid #E2E8F0',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: isSelected ? '0 4px 12px rgba(0,0,0,0.04)' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '20px' }}>{hub.icon}</span>
                      <div>
                        <div style={{ fontSize: '14.5px', fontWeight: 800, color: isSelected ? hub.color : '#0F172A' }}>
                          {hub.name}
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748B' }}>{hub.subtitle}</div>
                      </div>
                    </div>

                    <span style={{ fontSize: '12px', fontWeight: 800, color: isSelected ? hub.color : '#94A3B8' }}>
                      {isSelected ? '● Active' : 'Select'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Code Sandbox Terminal inside Clean Card */}
          <div
            style={{
              background: '#0F172A',
              borderRadius: '18px',
              padding: '20px',
              boxShadow: '0 12px 30px rgba(15, 23, 42, 0.15)',
              display: 'flex',
              flexDirection: 'column',
              fontFamily: 'Consolas, Monaco, "Courier New", monospace'
            }}
          >
            {/* Terminal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', paddingBottom: '12px', borderBottom: '1px solid #1E293B' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#EF4444' }} />
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#F59E0B' }} />
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981' }} />
                <span style={{ marginLeft: '10px', fontSize: '11px', color: '#94A3B8', fontFamily: 'sans-serif', fontWeight: 600 }}>
                  {selectedHub.name}.js
                </span>
              </div>

              <span style={{ fontSize: '10px', background: 'rgba(79, 70, 229, 0.25)', color: '#818CF8', padding: '2px 8px', borderRadius: '8px', fontWeight: 700, fontFamily: 'sans-serif' }}>
                v2.4 Live SDK
              </span>
            </div>

            {/* Code Body */}
            <pre style={{ margin: 0, fontSize: '12.5px', lineHeight: 1.6, color: '#E2E8F0', overflowX: 'auto', flex: 1 }}>
              <code>{selectedHub.codeSnippet}</code>
            </pre>

            {/* Quick Test Bar */}
            <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid #1E293B', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: '#10B981', fontFamily: 'sans-serif', fontWeight: 600 }}>
                ● 200 OK &bull; 42ms response
              </span>
              <button
                type="button"
                onClick={() => navigator.clipboard?.writeText(selectedHub.codeSnippet)}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  color: '#FFFFFF',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontSize: '11px',
                  cursor: 'pointer',
                  fontFamily: 'sans-serif',
                  fontWeight: 600
                }}
              >
                Copy Code
              </button>
            </div>
          </div>
        </div>

        {/* 4 Feature Highlights Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '18px',
            marginBottom: '52px'
          }}
        >
          {highlights.map((item) => (
            <div
              key={item.title}
              style={{
                background: '#FFFFFF',
                border: '1.5px solid #E2E8F0',
                borderRadius: '18px',
                padding: '20px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
              }}
            >
              <h4 style={{ fontSize: '15px', fontWeight: 800, margin: '0 0 6px 0', color: '#0F172A' }}>
                {item.title}
              </h4>
              <p style={{ fontSize: '13px', color: '#64748B', margin: 0, lineHeight: 1.5 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>

       
        
      </div>
    </section>
  );
}
