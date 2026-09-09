'use client';
import React, { useState } from 'react';

interface MobilityInYourHandsProps {
  onRequestDemo?: () => void;
}

export default function MobilityInYourHands({ onRequestDemo }: MobilityInYourHandsProps) {
  const [activeScreen, setActiveScreen] = useState<number>(1);

  const screens = [
    {
      id: 'map',
      title: 'Find Nearby Vehicles',
      badge: 'GPS Radar Scan',
      screenContent: (
        <div style={{ height: '100%', background: '#F8FAFC', color: '#0F172A', padding: '16px 14px', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A' }}>Nearby Evegah Hubs</div>
            <span style={{ fontSize: '10px', background: '#DCFCE7', color: '#15803D', padding: '2px 8px', borderRadius: '12px', fontWeight: 800 }}>
              ● 8 Available
            </span>
          </div>

          {/* Simulated Clean Light Map Canvas */}
          <div
            style={{
              flex: 1,
              borderRadius: '14px',
              background: '#F1F5F9',
              border: '1.5px solid #E2E8F0',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {/* Soft Map Street Grid */}
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(#E2E8F0 1.5px, transparent 1.5px), linear-gradient(90deg, #E2E8F0 1.5px, transparent 1.5px)', backgroundSize: '28px 28px' }} />

            {/* Park / Greenery Zone */}
            <div style={{ position: 'absolute', top: '10%', right: '10%', width: '70px', height: '60px', background: 'rgba(34, 197, 94, 0.12)', borderRadius: '12px', border: '1px solid rgba(34, 197, 94, 0.2)' }} />

            {/* User Location Pin */}
            <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#4F46E5', border: '3px solid #FFFFFF', position: 'absolute', top: '52%', left: '48%', boxShadow: '0 2px 10px rgba(79, 70, 229, 0.4)', zIndex: 3 }} />
            <div style={{ width: '46px', height: '46px', borderRadius: '50%', background: 'rgba(79, 70, 229, 0.18)', position: 'absolute', top: '45%', left: '41%' }} />

            {/* EV Pins */}
            <div style={{ position: 'absolute', top: '24%', left: '26%', background: '#059669', color: '#fff', fontSize: '9.5px', fontWeight: 800, padding: '3px 8px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '4px', boxShadow: '0 4px 10px rgba(5, 150, 105, 0.3)' }}>
              ⚡ 98%
            </div>
            <div style={{ position: 'absolute', top: '34%', right: '18%', background: '#059669', color: '#fff', fontSize: '9.5px', fontWeight: 800, padding: '3px 8px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '4px', boxShadow: '0 4px 10px rgba(5, 150, 105, 0.3)' }}>
              ⚡ 100%
            </div>
            <div style={{ position: 'absolute', bottom: '22%', left: '22%', background: '#D97706', color: '#fff', fontSize: '9.5px', fontWeight: 800, padding: '3px 8px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '4px', boxShadow: '0 4px 10px rgba(217, 119, 6, 0.3)' }}>
              ⚡ 76%
            </div>
          </div>

          {/* Bottom Card */}
          <div style={{ marginTop: '12px', background: '#FFFFFF', borderRadius: '12px', padding: '10px 12px', border: '1.5px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A' }}>Evegah City &bull; Gotri Hub</div>
                <div style={{ fontSize: '10px', color: '#64748B' }}>120m away &bull; Estimated 110 km range</div>
              </div>
              <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#059669' }}>₹80/hr</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'ride',
      title: 'Ready to Ride',
      badge: 'Keyless NFC/QR Unlock',
      screenContent: (
        <div style={{ height: '100%', background: '#FFFFFF', color: '#0F172A', padding: '16px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B' }}>Vehicle #GJ06EV2098</span>
              <span style={{ fontSize: '10px', background: '#EEF2FF', color: '#4F46E5', padding: '2px 8px', borderRadius: '10px', fontWeight: 800 }}>
                Bluetooth Linked
              </span>
            </div>

            <div style={{ textAlign: 'center', margin: '6px 0 12px' }}>
              {/* Scooter SVG graphic */}
              <div style={{ width: '100px', height: '100px', margin: '0 auto', background: '#F8FAFC', borderRadius: '50%', border: '1.5px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="5.5" cy="17.5" r="3.5" />
                  <circle cx="18.5" cy="17.5" r="3.5" />
                  <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 5.5l3-5.5h3" />
                  <path d="M5.5 17.5l4-8h4l2.5 8" />
                  <path d="M8.5 12h5" />
                </svg>
              </div>

              <h4 style={{ fontSize: '15px', fontWeight: 800, margin: '6px 0 2px', color: '#0F172A' }}>Evegah Mink Pro</h4>
              <p style={{ fontSize: '10.5px', color: '#64748B', margin: 0 }}>Smart Dual-Battery Telemetry</p>
            </div>

            {/* Battery & Range Info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
              <div style={{ background: '#F8FAFC', borderRadius: '10px', padding: '8px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                <div style={{ fontSize: '9px', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>Battery SOC</div>
                <div style={{ fontSize: '16px', fontWeight: 900, color: '#059669' }}>94%</div>
              </div>
              <div style={{ background: '#F8FAFC', borderRadius: '10px', padding: '8px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                <div style={{ fontSize: '9px', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>Est. Range</div>
                <div style={{ fontSize: '16px', fontWeight: 900, color: '#4F46E5' }}>98 km</div>
              </div>
            </div>
          </div>

          <button
            style={{
              width: '100%',
              padding: '11px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
              color: '#FFFFFF',
              border: 'none',
              fontWeight: 800,
              fontSize: '12.5px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)'
            }}
          >
            Unlock &amp; Start Ride &rarr;
          </button>
        </div>
      )
    },
    {
      id: 'active',
      title: 'Active Ride Telemetry',
      badge: 'Live Smart BMS',
      screenContent: (
        <div style={{ height: '100%', background: '#FFFFFF', color: '#0F172A', padding: '16px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '10px', background: '#DCFCE7', color: '#15803D', padding: '2px 8px', borderRadius: '10px', fontWeight: 800 }}>
                ● Trip in Progress
              </span>
              <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 700 }}>18 min elapsed</span>
            </div>

            <div style={{ textAlign: 'center', margin: '8px 0 14px' }}>
              <div style={{ fontSize: '32px', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em', fontFamily: "'Outfit', sans-serif" }}>
                24 <span style={{ fontSize: '13px', color: '#64748B', fontWeight: 600 }}>km/h</span>
              </div>
              <div style={{ fontSize: '10.5px', color: '#059669', fontWeight: 800 }}>Eco Mode Active &bull; Safe Zone</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '12px' }}>
              <div style={{ background: '#F8FAFC', borderRadius: '10px', padding: '7px 4px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                <div style={{ fontSize: '8.5px', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>Distance</div>
                <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#0F172A' }}>6.2 km</div>
              </div>
              <div style={{ background: '#F8FAFC', borderRadius: '10px', padding: '7px 4px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                <div style={{ fontSize: '8.5px', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>Battery</div>
                <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#059669' }}>88%</div>
              </div>
              <div style={{ background: '#F8FAFC', borderRadius: '10px', padding: '7px 4px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                <div style={{ fontSize: '8.5px', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>CO₂ Saved</div>
                <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#4F46E5' }}>0.48 kg</div>
              </div>
            </div>
          </div>

          <button
            style={{
              width: '100%',
              padding: '11px',
              borderRadius: '12px',
              background: '#0F172A',
              color: '#FFFFFF',
              border: 'none',
              fontWeight: 800,
              fontSize: '12px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(15, 23, 42, 0.2)'
            }}
          >
            Lock &amp; End Ride
          </button>
        </div>
      )
    }
  ];

  const featureList = [
    {
      title: 'Find nearby vehicles',
      desc: 'Real-time GPS radar detects available battery-charged EVs within 250m with instant reservation.',
      icon: '📍'
    },
    {
      title: 'Real-time tracking',
      desc: 'Sub-second telemetry monitoring, live speed capping, safe zone alerts, and anti-theft smart locks.',
      icon: '📡'
    },
    {
      title: 'Easy booking & payments',
      desc: '1-click UPI, Apple Pay, Google Pay, dynamic QR codes, and automatic deposit reconciliation.',
      icon: '💳'
    },
    {
      title: 'Ride history and rewards',
      desc: 'Track trip miles, earn green commute credits, redeem battery swaps, and download tax invoices.',
      icon: '🎁'
    },
    {
      title: 'A cleaner tomorrow, together',
      desc: 'Live personal carbon offset calculator showing kilograms of CO₂ avoided and trees planted.',
      icon: '🌱'
    }
  ];

  return (
    <section
      id="mobile-app"
      style={{
        padding: '95px 0 90px',
        background: 'linear-gradient(180deg, #F8FAFC 0%, #EEF2F6 50%, #F8FAFC 100%)',
        position: 'relative',
        overflow: 'hidden',
        color: '#0F172A'
      }}
    >
      <div className="container-custom">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 52px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '30px', background: '#DCFCE7', border: '1px solid #86EFAC', marginBottom: '14px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#059669', display: 'inline-block' }} />
            <span style={{ fontSize: '11.5px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#166534' }}>
              Rider Mobile Experience
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
            Mobility{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #059669 0%, #0284C7 50%, #4F46E5 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block'
              }}
            >
              in Your Hands
            </span>
          </h2>
          <p style={{ fontSize: '15.5px', color: '#64748B', margin: '0 auto 28px', maxWidth: '600px', lineHeight: 1.6 }}>
            Designed for riders, field technicians, and hub operators. Native iOS and Android apps with sub-second keyless unlock and real-time battery swap navigation.
          </p>

          {/* App Store & Google Play Badges */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 22px',
                borderRadius: '14px',
                background: '#0F172A',
                color: '#FFFFFF',
                boxShadow: '0 4px 14px rgba(15, 23, 42, 0.15)',
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.64 1.35-.57.65-1.07 1.72-.94 2.74 1.01.08 2.04-.49 2.66-1.24z"/>
              </svg>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '9.5px', textTransform: 'uppercase', letterSpacing: '0.04em', opacity: 0.8 }}>Download on the</div>
                <div style={{ fontSize: '13.5px', fontWeight: 800 }}>App Store</div>
              </div>
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 22px',
                borderRadius: '14px',
                background: '#0F172A',
                color: '#FFFFFF',
                boxShadow: '0 4px 14px rgba(15, 23, 42, 0.15)',
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.609 1.814L13.792 12 3.61 22.186a1.99 1.99 0 0 1-.22-.315V2.13c.066-.112.14-.219.22-.315zm11.547 11.548l2.25 2.25-11.455 6.554 9.205-8.804zm2.96-1.708l3.197 1.831a1.27 1.27 0 0 1 0 2.21l-3.197 1.83-2.186-2.186 2.186-2.685zm-2.96-1.708L5.951 1.142l11.455 6.554-2.25 2.25z"/>
              </svg>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '9.5px', textTransform: 'uppercase', letterSpacing: '0.04em', opacity: 0.8 }}>Get it on</div>
                <div style={{ fontSize: '13.5px', fontWeight: 800 }}>Google Play</div>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Showcase: Interactive Feature List + Triple Phone Frames */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'center' }}>
          
          {/* Left: Interactive Feature Pills */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {featureList.map((feat, idx) => {
              const isSelected = activeScreen === (idx % 3);
              return (
                <div
                  key={feat.title}
                  onClick={() => setActiveScreen(idx % 3)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px',
                    padding: '16px 20px',
                    borderRadius: '18px',
                    background: isSelected ? '#FFFFFF' : '#FFFFFF',
                    border: isSelected ? '2px solid #4F46E5' : '1.5px solid #E2E8F0',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    boxShadow: isSelected
                      ? '0 10px 24px -4px rgba(79, 70, 229, 0.12), 0 2px 6px rgba(0,0,0,0.02)'
                      : '0 2px 6px rgba(0,0,0,0.02)',
                    transform: isSelected ? 'translateX(6px)' : 'none'
                  }}
                  onMouseEnter={e => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = '#CBD5E1';
                      e.currentTarget.style.transform = 'translateX(4px)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = '#E2E8F0';
                      e.currentTarget.style.transform = 'none';
                    }
                  }}
                >
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      background: isSelected ? '#EEF2FF' : '#F8FAFC',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                      flexShrink: 0,
                      border: isSelected ? '1px solid #C7D2FE' : '1px solid #E2E8F0'
                    }}
                  >
                    {feat.icon}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <h4 style={{ fontSize: '15.5px', fontWeight: 800, margin: '0 0 4px 0', color: isSelected ? '#4F46E5' : '#0F172A' }}>
                        {feat.title}
                      </h4>
                      {isSelected && (
                        <span style={{ fontSize: '10px', background: '#EEF2FF', color: '#4F46E5', fontWeight: 800, padding: '2px 8px', borderRadius: '10px' }}>
                          Previewing
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '13px', color: '#64748B', margin: 0, lineHeight: 1.5 }}>
                      {feat.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Sleek Smartphone Mockup Carousel */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
            
            {/* Background Soft Glow */}
            <div
              style={{
                position: 'absolute',
                width: '320px',
                height: '480px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(79, 70, 229, 0.12) 0%, rgba(255,255,255,0) 70%)',
                pointerEvents: 'none'
              }}
            />

            {/* Smartphone Device Frame (Sleek Modern Hardware) */}
            <div
              style={{
                width: '285px',
                height: '560px',
                background: '#0F172A',
                borderRadius: '44px',
                padding: '10px',
                boxShadow: '0 25px 60px -15px rgba(15, 23, 42, 0.25), 0 0 0 2px #334155, 0 0 0 4px #0F172A',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Dynamic Island / Speaker Notch */}
              <div
                style={{
                  position: 'absolute',
                  top: '18px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '85px',
                  height: '20px',
                  background: '#0F172A',
                  borderRadius: '14px',
                  zIndex: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  padding: '0 8px'
                }}
              >
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#1E293B', border: '1px solid #334155' }} />
              </div>

              {/* Screen Inner Bezel */}
              <div
                style={{
                  flex: 1,
                  background: '#FFFFFF',
                  borderRadius: '34px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  paddingTop: '28px',
                  position: 'relative'
                }}
              >
                {screens[activeScreen]?.screenContent}
              </div>

              {/* Home Indicator Bar */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '14px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '100px',
                  height: '4px',
                  background: 'rgba(255,255,255,0.4)',
                  borderRadius: '4px'
                }}
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
