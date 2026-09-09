'use client';
import React from 'react';

interface ContactCTAProps {
  onRequestDemo: () => void;
}

export default function ContactCTA({ onRequestDemo }: ContactCTAProps) {
  return (
    <section id="contact" style={{ padding: '70px 0', backgroundColor: '#FFFFFF' }}>
      <div className="container-custom">
        <div className="contact-card-dual">
          {/* Left Dark Column */}
          <div className="contact-left-col">
            <h2 className="contact-heading">
              Let&apos;s Build a Cleaner Tomorrow
            </h2>
            <p className="contact-subtext">
              Get in touch with our team to learn how Evegah can power your EV fleet operations.
            </p>
            <button
              onClick={onRequestDemo}
              className="contact-btn-white"
            >
              Contact Us
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>

          {/* Right White Column */}
          <div className="contact-right-col">
            {/* Direct Contact Info */}
            <div className="contact-channels-wrap">
              <div className="contact-channel-item">
                <div className="channel-icon-wrap">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2A195C" strokeWidth="2">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>
                <div>
                  <div className="channel-label">Email Us</div>
                  <a href="mailto:sales@evegah.com" className="channel-value">info@evegah.com</a>
                </div>
              </div>

              <div className="contact-channel-item">
                <div className="channel-icon-wrap">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2A195C" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div>
                  <div className="channel-label">Call Us</div>
                  <a href="tel:+919876543210" className="channel-value">+91 89809 66677 </a>
                </div>
              </div>

              <div className="contact-channel-item">
                <div className="channel-icon-wrap">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2A195C" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div>
                  <div className="channel-label">Our Office</div>
                  <div className="channel-value" style={{ textDecoration: 'none' }}>
                    Office-10 Royal Nandish,Gotri<br />Vadodara, Gujarat, India
                  </div>
                </div>
              </div>
            </div>

            {/* EV Scooter Scene Graphic */}
            <div className="ev-scene-box">
              <img
                src="/assets/scooter_charger_scene.png"
                alt="Evegah Smart EV Scooter & Charging Station"
                className="ev-scene-img"
              />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .contact-card-dual {
          display: grid;
          grid-template-columns: 1.15fr 1.85fr;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 16px 36px rgba(15, 23, 42, 0.08);
          border: 1px solid #E2E8F0;
        }

        .contact-left-col {
          background: linear-gradient(145deg, #1E1548 0%, #2A195C 100%);
          padding: 44px 38px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          color: #FFFFFF;
        }

        .contact-heading {
          font-family: 'Outfit', sans-serif;
          font-size: 28px;
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: 12px;
          color: #FFFFFF;
        }

        .contact-subtext {
          font-size: 14px;
          color: #CBD5E1;
          line-height: 1.55;
          margin-bottom: 26px;
        }

        .contact-btn-white {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: #FFFFFF;
          color: #1E1548;
          font-weight: 800;
          font-size: 13.5px;
          border-radius: 9999px;
          border: none;
          cursor: pointer;
          width: fit-content;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .contact-btn-white:hover {
          background: #F8FAFC;
          transform: translateY(-1px);
        }

        .contact-right-col {
          background: #FFFFFF;
          padding: 36px 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          position: relative;
        }

        .contact-channels-wrap {
          display: flex;
          flex-direction: column;
          gap: 20px;
          z-index: 5;
        }

        .contact-channel-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .channel-icon-wrap {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: #F3E8FF;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .channel-label {
          font-size: 11px;
          font-weight: 700;
          color: #64748B;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .channel-value {
          font-size: 13.5px;
          font-weight: 700;
          color: #0F172A;
          text-decoration: none;
          line-height: 1.3;
        }

        .channel-value:hover {
          color: #2A195C;
        }

        .ev-scene-box {
          max-width: 220px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ev-scene-img {
          width: 100%;
          height: auto;
          object-fit: contain;
          filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.08));
        }

        @media (max-width: 900px) {
          .contact-card-dual {
            grid-template-columns: 1fr;
          }
          .contact-right-col {
            flex-direction: column;
            align-items: flex-start;
            padding: 30px 24px;
          }
          .ev-scene-box {
            align-self: center;
            max-width: 200px;
          }
        }
      `}</style>
    </section>
  );
}
