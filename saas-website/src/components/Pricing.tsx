'use client';
import React, { useState } from 'react';

interface PricingProps {
  onRequestDemo: (planName?: string) => void;
}

export default function Pricing({ onRequestDemo }: PricingProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <section id="pricing" style={{ padding: '75px 0', backgroundColor: '#FFFFFF' }}>
      <div className="container-custom">
        {/* Header & Toggle */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '42px', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <span className="section-tag">FLEXIBLE PLANS FOR EVERY BUSINESS</span>
            <h2 className="section-heading">Simple, Transparent Pricing</h2>
            <p className="section-subheading">
              Choose a plan that fits your needs. Upgrade as you grow.
            </p>
          </div>

          {/* Monthly / Yearly Toggle Pill */}
          <div className="billing-pill-toggle">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`billing-toggle-btn ${billingCycle === 'monthly' ? 'active' : ''}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`billing-toggle-btn ${billingCycle === 'yearly' ? 'active' : ''}`}
            >
              Yearly
              <span className="discount-tag">Save 20%</span>
            </button>
          </div>
        </div>

        {/* 4 Pricing Cards Grid */}
        <div className="pricing-grid">
          {/* Plan 1: Starter */}
          <div className="pricing-card">
            <div className="card-top">
              <h3 className="plan-name">Starter</h3>
              <p className="plan-subtitle">For small fleets and startups</p>
              <div className="plan-price-wrap">
                <span className="plan-price">
                  {billingCycle === 'monthly' ? '₹4,999' : '₹3,999'}
                </span>
                <span className="plan-cycle">/month</span>
              </div>
            </div>

            <ul className="plan-features-list">
              <li>
                <svg className="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                Up to 50 vehicles
              </li>
              <li>
                <svg className="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                Basic features
              </li>
              <li>
                <svg className="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                Email support
              </li>
            </ul>

            <button
              onClick={() => onRequestDemo('Starter Plan')}
              className="plan-btn-outline"
            >
              Get Started
            </button>
          </div>

          {/* Plan 2: Growth (Most Popular) */}
          <div className="pricing-card popular-card">
            <div className="popular-badge">Most Popular</div>

            <div className="card-top">
              <h3 className="plan-name">Growth</h3>
              <p className="plan-subtitle">For growing businesses</p>
              <div className="plan-price-wrap">
                <span className="plan-price">
                  {billingCycle === 'monthly' ? '₹9,999' : '₹7,999'}
                </span>
                <span className="plan-cycle">/month</span>
              </div>
            </div>

            <ul className="plan-features-list">
              <li>
                <svg className="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                Up to 200 vehicles
              </li>
              <li>
                <svg className="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                Advanced features
              </li>
              <li>
                <svg className="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                Multi-zone support
              </li>
              <li>
                <svg className="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                Priority support
              </li>
            </ul>

            <button
              onClick={() => onRequestDemo('Growth Plan')}
              className="plan-btn-primary"
            >
              Start Free Trial
            </button>
          </div>

          {/* Plan 3: Business */}
          <div className="pricing-card">
            <div className="card-top">
              <h3 className="plan-name">Business</h3>
              <p className="plan-subtitle">For established operators</p>
              <div className="plan-price-wrap">
                <span className="plan-price">
                  {billingCycle === 'monthly' ? '₹19,999' : '₹15,999'}
                </span>
                <span className="plan-cycle">/month</span>
              </div>
            </div>

            <ul className="plan-features-list">
              <li>
                <svg className="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                Up to 500 vehicles
              </li>
              <li>
                <svg className="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                All premium features
              </li>
              <li>
                <svg className="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                Custom reports
              </li>
              <li>
                <svg className="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                Dedicated support
              </li>
            </ul>

            <button
              onClick={() => onRequestDemo('Business Plan')}
              className="plan-btn-outline"
            >
              Contact Sales
            </button>
          </div>

          {/* Plan 4: Enterprise */}
          <div className="pricing-card">
            <div className="card-top">
              <h3 className="plan-name">Enterprise</h3>
              <p className="plan-subtitle">For large fleets &amp; franchises</p>
              <div className="plan-price-wrap">
                <span className="plan-price" style={{ fontSize: '26px' }}>
                  Custom Pricing
                </span>
              </div>
            </div>

            <ul className="plan-features-list">
              <li>
                <svg className="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                Unlimited vehicles
              </li>
              <li>
                <svg className="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                White-label solution
              </li>
              <li>
                <svg className="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                API access
              </li>
              <li>
                <svg className="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                Dedicated account manager
              </li>
            </ul>

            <button
              onClick={() => onRequestDemo('Enterprise Plan')}
              className="plan-btn-outline"
            >
              Talk to Us
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .billing-pill-toggle {
          display: flex;
          align-items: center;
          background: #F1F5F9;
          border-radius: 9999px;
          padding: 4px;
          border: 1px solid #E2E8F0;
        }

        .billing-toggle-btn {
          padding: 8px 18px;
          border-radius: 9999px;
          font-size: 13px;
          font-weight: 700;
          color: #475569;
          background: transparent;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s ease;
        }

        .billing-toggle-btn.active {
          background: #2A195C;
          color: #FFFFFF;
          box-shadow: 0 2px 8px rgba(42, 25, 92, 0.25);
        }

        .discount-tag {
          font-size: 10.5px;
          background: #22C55E;
          color: #FFFFFF;
          padding: 2px 7px;
          border-radius: 9999px;
          font-weight: 800;
        }

        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          align-items: stretch;
        }

        .pricing-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 18px;
          padding: 28px 24px;
          display: flex;
          flex-direction: column;
          position: relative;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .pricing-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
        }

        .popular-card {
          border-color: #2A195C;
          box-shadow: 0 8px 24px rgba(42, 25, 92, 0.12);
        }

        .popular-badge {
          position: absolute;
          top: -12px;
          right: 20px;
          background: #22C55E;
          color: #FFFFFF;
          font-size: 11px;
          font-weight: 800;
          padding: 3px 10px;
          border-radius: 9999px;
          box-shadow: 0 2px 6px rgba(34, 197, 94, 0.35);
        }

        .card-top {
          margin-bottom: 24px;
          padding-bottom: 20px;
          border-bottom: 1px solid #F1F5F9;
        }

        .plan-name {
          font-family: 'Outfit', sans-serif;
          font-size: 20px;
          font-weight: 800;
          color: #0F172A;
          margin-bottom: 4px;
        }

        .plan-subtitle {
          font-size: 12.5px;
          color: #64748B;
          margin-bottom: 16px;
        }

        .plan-price-wrap {
          display: flex;
          align-items: baseline;
          gap: 4px;
        }

        .plan-price {
          font-family: 'Outfit', sans-serif;
          font-size: 32px;
          font-weight: 900;
          color: #0F172A;
          letter-spacing: -0.02em;
        }

        .plan-cycle {
          font-size: 13px;
          color: #64748B;
          font-weight: 600;
        }

        .plan-features-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 28px;
          flex: 1;
        }

        .plan-features-list li {
          display: flex;
          align-items: center;
          gap: 9px;
          font-size: 13px;
          color: #334155;
          font-weight: 500;
        }

        .check-icon {
          flex-shrink: 0;
        }

        .plan-btn-outline {
          width: 100%;
          padding: 11px;
          border-radius: 9999px;
          font-size: 13.5px;
          font-weight: 700;
          color: #1E293B;
          background: #FFFFFF;
          border: 1.5px solid #CBD5E1;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .plan-btn-outline:hover {
          border-color: #2A195C;
          color: #2A195C;
          background: #F8FAFC;
        }

        .plan-btn-primary {
          width: 100%;
          padding: 11px;
          border-radius: 9999px;
          font-size: 13.5px;
          font-weight: 700;
          color: #FFFFFF;
          background: #2A195C;
          border: none;
          cursor: pointer;
          transition: all 0.15s ease;
          box-shadow: 0 4px 12px rgba(42, 25, 92, 0.3);
        }

        .plan-btn-primary:hover {
          background: #3B2382;
          transform: translateY(-1px);
        }

        @media (max-width: 1024px) {
          .pricing-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .pricing-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
