'use client';
import React from 'react';

const STEPS = [
  {
    number: '1',
    title: 'Sign Up',
    desc: 'Create your organization and set up your account.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.4">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    bg: '#DCFCE7',
    numColor: '#16A34A',
  },
  {
    number: '2',
    title: 'Configure',
    desc: 'Add vehicles, zones, users and settings.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2.4">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
    bg: '#F3E8FF',
    numColor: '#7C3AED',
  },
  {
    number: '3',
    title: 'Operate',
    desc: 'Manage riders, rentals, battery swaps and more.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.4">
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
    ),
    bg: '#EFF6FF',
    numColor: '#2563EB',
  },
  {
    number: '4',
    title: 'Grow',
    desc: 'Track performance and scale your business.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2.4">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
    bg: '#EEF2FF',
    numColor: '#4F46E5',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" style={{ padding: '70px 0', backgroundColor: '#F8FAFC', position: 'relative' }}>
      <div className="container-custom">
        {/* Header with Cursive Calligraphy */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '46px', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <span className="section-tag">GET STARTED IN MINUTES</span>
            <h2 className="section-heading">How It Works</h2>
            <p className="section-subheading">
              A simple and powerful platform to get your EV operations running.
            </p>
          </div>

          <div className="how-script-box font-script">
            From Setup to Scale<br />
            <span style={{ color: '#16A34A' }}>We&apos;re with You</span>
          </div>
        </div>

        {/* 4 Steps Horizontal Flow */}
        <div className="steps-wrapper">
          {STEPS.map((step, idx) => (
            <React.Fragment key={step.number}>
              <div className="step-card">
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    backgroundColor: step.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {step.icon}
                </div>

                <div className="step-text-wrap">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: step.numColor }}>
                      {step.number}
                    </span>
                    <h3 style={{ fontSize: '15.5px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                      {step.title}
                    </h3>
                  </div>
                  <p style={{ fontSize: '13px', color: '#64748B', lineHeight: '1.4', margin: 0 }}>
                    {step.desc}
                  </p>
                </div>
              </div>

              {idx < STEPS.length - 1 && (
                <div className="step-arrow" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <style jsx>{`
        .how-script-box {
          font-size: 22px;
          line-height: 1.15;
          color: #334155;
          transform: rotate(-3deg);
          text-align: right;
        }

        .steps-wrapper {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 18px;
          padding: 24px 28px;
          box-shadow: 0 4px 14px rgba(15, 23, 42, 0.02);
        }

        .step-card {
          display: flex;
          align-items: center;
          gap: 14px;
          flex: 1;
          min-width: 0;
        }

        .step-text-wrap {
          min-width: 0;
        }

        .step-arrow {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #CBD5E1;
        }

        @media (max-width: 1024px) {
          .steps-wrapper {
            flex-direction: column;
            align-items: stretch;
            gap: 18px;
            padding: 20px;
          }
          .step-arrow {
            transform: rotate(90deg);
            margin: -4px 0;
          }
        }
      `}</style>
    </section>
  );
}
