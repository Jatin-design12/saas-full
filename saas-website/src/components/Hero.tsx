'use client';
import React, { useState } from 'react';

interface HeroProps {
  onRequestDemo: () => void;
  onWatchVideo: () => void;
}

export default function Hero({ onRequestDemo, onWatchVideo }: HeroProps) {
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  return (
    <section
      style={{
        paddingTop: '32px',
        paddingBottom: '68px',
        backgroundColor: '#FFFFFF',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Decorative Ambient Radial Glow */}
      <div
        className="animate-pulse-glow"
        style={{
          position: 'absolute',
          top: '-10%',
          right: '5%',
          width: '560px',
          height: '560px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(220, 252, 231, 0.55) 0%, rgba(243, 232, 255, 0.45) 45%, rgba(255, 255, 255, 0) 75%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      <div className="container-custom" style={{ position: 'relative', zIndex: 10 }}>
        {/* Top Text & Showcase Layout */}
        <div className="hero-grid">
          {/* Left Column: Headlines & CTAs */}
          <div className="hero-left">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span className="section-tag" style={{ margin: 0 }}>
                EV FLEET MANAGEMENT PLATFORM
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: 700, color: '#16A34A', background: '#DCFCE7', padding: '2px 9px', borderRadius: '9999px' }}>
                <span className="animate-pulse-dot" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#16A34A' }} />
                Real-Time Telematics
              </span>
            </div>

            <h1
              style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: '52px',
                fontWeight: 900,
                color: '#0F172A',
                lineHeight: 1.08,
                letterSpacing: '-0.025em',
                marginBottom: '16px',
              }}
            >
              India's Smartest EV.
              <br />
              <span style={{ color: '#16A34A' }}>Rental</span> Mobility.
            </h1>

            <p
              style={{
                fontSize: '15.5px',
                color: '#475569',
                lineHeight: 1.6,
                marginBottom: '28px',
                maxWidth: '470px',
                fontWeight: 500,
              }}
            >
              A complete SaaS platform to manage your EV fleet, riders, battery operations, rentals and more — built for a cleaner, smarter and more sustainable future.
            </p>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', marginBottom: '34px' }}>
              <button
                onClick={onRequestDemo}
                className="btn-primary"
                style={{ padding: '13px 26px', fontSize: '14.5px' }}
              >
                Request a Demo
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>

              <button
                onClick={onWatchVideo}
                className="btn-secondary"
                style={{ padding: '12px 22px', fontSize: '14px' }}
              >
                <span
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: '#F3E8FF',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#2A195C',
                  }}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </span>
                Watch Video
              </button>
            </div>

            {/* 4 Benefit Pills Row */}
            <div className="hero-pills-row">
              <div className="benefit-pill">
                <span className="pill-icon-box" style={{ background: '#DCFCE7', color: '#16A34A' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                    <polyline points="17 6 23 6 23 12" />
                  </svg>
                </span>
                <div className="pill-text">
                  <div className="pill-title">Increase</div>
                  <div className="pill-sub">Efficiency</div>
                </div>
              </div>

              <div className="benefit-pill">
                <span className="pill-icon-box" style={{ background: '#DCFCE7', color: '#16A34A' }}>
                  <span style={{ fontSize: '14px', fontWeight: 800 }}>₹</span>
                </span>
                <div className="pill-text">
                  <div className="pill-title">Reduce</div>
                  <div className="pill-sub">Operational Cost</div>
                </div>
              </div>

              <div className="benefit-pill">
                <span className="pill-icon-box" style={{ background: '#DCFCE7', color: '#16A34A' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </span>
                <div className="pill-text">
                  <div className="pill-title">Real-time</div>
                  <div className="pill-sub">Visibility</div>
                </div>
              </div>

              <div className="benefit-pill">
                <span className="pill-icon-box" style={{ background: '#DCFCE7', color: '#16A34A' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M11 20A7 7 0 0 1 4 13C4 8.5 7.5 4 14 3c0 0 0 3-1 6" />
                    <path d="M11 20c4.5 0 8.5-3.5 9.5-10 0 0-3 0-6 1" />
                    <path d="M11 20v-7" />
                  </svg>
                </span>
                <div className="pill-text">
                  <div className="pill-title">Lower Carbon</div>
                  <div className="pill-sub">Footprint</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Animated Device Showcase (Real Laptop + Mobile Mockup) */}
          <div className="hero-right">
            <div className="showcase-wrapper">
              {/* Modern Realistic Laptop Frame with Real Admin Screenshot */}
              <div
                className="laptop-container animate-float-laptop"
                onClick={() => setLightboxImg('/assets/real_admin_dashboard.png')}
                title="Click to view full-size admin dashboard"
              >
                <div className="laptop-lid">
                  {/* Laptop Top Camera & Bezel */}
                  <div className="laptop-camera-bar">
                    <span className="laptop-camera-lens" />
                  </div>
                  <div className="laptop-screen">
                    <img
                      src="/assets/real_admin_dashboard.png"
                      alt="Evegah Real Admin Fleet Dashboard"
                      className="laptop-screen-img"
                    />
                    {/* Floating Zoom Hint Badge */}
                    <div className="screen-zoom-hint">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
                      Inspect Fleet OS
                    </div>
                  </div>
                </div>
                {/* Laptop Base Stand */}
                <div className="laptop-base" />
              </div>

              {/* Modern Smartphone Mockup Overlapping with Real Mobile App Screenshot */}
              <div
                className="phone-container animate-float-mobile"
                onClick={() => setLightboxImg('/assets/real_mobile_app.jpg')}
                title="Click to view full-size mobile app"
              >
                {/* Smartphone Dynamic Island / Speaker */}
                <div className="phone-notch">
                  <div className="phone-speaker" />
                </div>
                <div className="phone-screen">
                  <img
                    src="/assets/real_mobile_app.jpg"
                    alt="Evegah Real Rider Mobile App"
                    className="phone-screen-img"
                  />
                  {/* Floating Zoom Hint Badge */}
                  <div className="phone-zoom-hint">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    Rider App
                  </div>
                </div>
              </div>

              {/* Decorative Handwritten Script Callout with Gentle Sway Animation */}
              <div className="hero-callout-script font-script animate-sway">
                Cleaner Cities<br />
                <span style={{ color: '#16A34A' }}>Brighter Tomorrow</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox for inspecting screenshots in HD */}
      {lightboxImg && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
          onClick={() => setLightboxImg(null)}
        >
          <div
            style={{
              maxWidth: '1050px',
              width: '100%',
              backgroundColor: '#0F172A',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
              position: 'relative',
              border: '1px solid #334155',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', background: '#1E293B', borderBottom: '1px solid #334155' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#F8FAFC' }}>
                {lightboxImg.includes('admin') ? 'Evegah Super Admin Fleet & Subscription Analytics' : 'Evegah Rider Mobile App (Android / iOS)'}
              </span>
              <button
                onClick={() => setLightboxImg(null)}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '16px', padding: '4px' }}
              >
                ✕ Close
              </button>
            </div>
            <div style={{ maxHeight: '80vh', overflowY: 'auto', padding: '10px' }}>
              <img
                src={lightboxImg}
                alt="Full Screenshot"
                style={{ width: '100%', height: 'auto', borderRadius: '8px', display: 'block' }}
              />
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .hero-grid {
          display: grid;
          grid-template-columns: 1fr 1.34fr;
          gap: 36px;
          align-items: center;
        }

        .hero-left {
          z-index: 10;
        }

        .hero-pills-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          max-width: 520px;
        }

        .benefit-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 8px 10px;
          box-shadow: 0 2px 6px rgba(15, 23, 42, 0.03);
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .benefit-pill:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 16px rgba(15, 23, 42, 0.08);
          border-color: #22C55E;
        }

        .pill-icon-box {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .pill-title {
          font-size: 11px;
          font-weight: 700;
          color: #0F172A;
          line-height: 1.2;
        }

        .pill-sub {
          font-size: 10px;
          color: #64748B;
          line-height: 1.1;
        }

        /* Device Showcase */
        .showcase-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Laptop Container */
        .laptop-container {
          width: 100%;
          max-width: 575px;
          filter: drop-shadow(0 25px 45px rgba(15, 23, 42, 0.18));
          cursor: pointer;
          transition: transform 0.3s ease;
        }

        .laptop-container:hover {
          filter: drop-shadow(0 30px 55px rgba(42, 25, 92, 0.25));
        }

        .laptop-lid {
          background: #1E293B;
          border-radius: 16px 16px 2px 2px;
          padding: 8px 8px 6px;
          position: relative;
          box-shadow: inset 0 1px 1.5px rgba(255, 255, 255, 0.25);
        }

        .laptop-camera-bar {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 8px;
          margin-bottom: 4px;
        }

        .laptop-camera-lens {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #334155;
          box-shadow: 0 0 0 1.5px #0F172A;
        }

        .laptop-screen {
          background: #0F172A;
          border-radius: 6px;
          overflow: hidden;
          aspect-ratio: 16 / 10;
          position: relative;
          border: 1px solid #0F172A;
        }

        .laptop-screen-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          image-rendering: -webkit-optimize-contrast;
          transition: transform 0.4s ease;
        }

        .laptop-container:hover .laptop-screen-img {
          transform: scale(1.02);
        }

        .screen-zoom-hint {
          position: absolute;
          bottom: 10px;
          left: 12px;
          background: rgba(15, 23, 42, 0.75);
          backdrop-filter: blur(4px);
          color: #FFFFFF;
          font-size: 10px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          gap: 5px;
          opacity: 0;
          transition: opacity 0.2s ease;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .laptop-container:hover .screen-zoom-hint {
          opacity: 1;
        }

        .laptop-base {
          height: 13px;
          background: linear-gradient(180deg, #94A3B8 0%, #64748B 40%, #475569 100%);
          border-radius: 0 0 16px 16px;
          position: relative;
          box-shadow: 0 10px 22px rgba(15, 23, 42, 0.22);
        }

        .laptop-base::after {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 76px;
          height: 4px;
          background: #334155;
          border-radius: 0 0 5px 5px;
        }

        /* Smartphone Mockup */
        .phone-container {
          position: absolute;
          right: -16px;
          bottom: -18px;
          width: 175px;
          background: #0F172A;
          border-radius: 30px;
          padding: 6px;
          box-shadow: 0 28px 45px -8px rgba(15, 23, 42, 0.45), 0 0 0 1.5px rgba(255, 255, 255, 0.2);
          z-index: 20;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .phone-container:hover {
          transform: translateY(-16px) rotate(0deg) scale(1.05) !important;
          box-shadow: 0 35px 55px -6px rgba(42, 25, 92, 0.45);
        }

        .phone-notch {
          width: 44px;
          height: 8px;
          background: #000000;
          border-radius: 0 0 7px 7px;
          margin: 0 auto 3px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .phone-speaker {
          width: 16px;
          height: 2px;
          background: #334155;
          border-radius: 1px;
        }

        .phone-screen {
          background: #FFFFFF;
          border-radius: 24px;
          overflow: hidden;
          position: relative;
          aspect-ratio: 9 / 19.2;
        }

        .phone-screen-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .phone-zoom-hint {
          position: absolute;
          top: 10px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(4px);
          color: #FFFFFF;
          font-size: 9px;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          gap: 4px;
          white-space: nowrap;
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .phone-container:hover .phone-zoom-hint {
          opacity: 1;
        }

        .hero-callout-script {
          position: absolute;
          right: -36px;
          top: 24px;
          font-size: 20px;
          line-height: 1.1;
          color: #1E293B;
          pointer-events: none;
          text-shadow: 0 1px 2px rgba(255, 255, 255, 0.9);
          z-index: 25;
        }

        /* Responsiveness */
        @media (max-width: 1100px) {
          .hero-grid {
            grid-template-columns: 1fr;
            gap: 46px;
          }
          .hero-left {
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .hero-pills-row {
            margin: 0 auto;
          }
          .hero-callout-script {
            display: none;
          }
        }

        @media (max-width: 640px) {
          .hero-left h1 {
            font-size: 38px !important;
          }
          .hero-pills-row {
            grid-template-columns: repeat(2, 1fr);
          }
          .phone-container {
            width: 135px;
            right: -8px;
            bottom: -8px;
          }
        }
      `}</style>
    </section>
  );
}
