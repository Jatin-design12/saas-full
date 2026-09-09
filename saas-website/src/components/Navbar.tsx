'use client';
import React, { useState, useEffect } from 'react';

interface NavbarProps {
  onRequestDemo: () => void;
}

export default function Navbar({ onRequestDemo }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.94)' : '#FFFFFF',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid #E2E8F0' : '1px solid transparent',
        transition: 'all 0.25s ease',
      }}
    >
      <div className="container-custom" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '76px' }}>
        {/* Brand Logo */}
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <img
            src="/assets/evegah_logo_clean.png"
            alt="Evegah"
            style={{ height: '36px', width: 'auto', objectFit: 'contain' }}
          />
        </a>

        {/* Center Nav Links */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '32px',
          }}
          className="desktop-nav"
        >
          {[
            { label: 'Product', href: '#features' },
            { label: 'Solutions', href: '#features' },
            { label: 'Enterprise', href: '#features' },
            { label: 'Pricing', href: '#pricing' },
            { label: 'Resources', href: '#how-it-works' },
            { label: 'Contact', href: '#contact' },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#475569',
                textDecoration: 'none',
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#2A195C')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#475569')}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right CTA Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }} className="desktop-actions">
          <a
            href="http://localhost:3000/login"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '9px 20px',
              fontSize: '13.5px',
              fontWeight: 700,
              color: '#334155',
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #CBD5E1',
              borderRadius: '9999px',
              textDecoration: 'none',
              transition: 'all 0.15s ease',
              display: 'inline-flex',
              alignItems: 'center',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#2A195C';
              e.currentTarget.style.color = '#2A195C';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#CBD5E1';
              e.currentTarget.style.color = '#334155';
            }}
          >
            Login
          </a>

          <button
            onClick={onRequestDemo}
            className="btn-primary"
            style={{ padding: '10px 22px', fontSize: '13.5px' }}
          >
            Request a Demo
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="mobile-toggle"
          aria-label="Toggle Navigation"
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            color: '#1E293B',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            {mobileMenuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="17" x2="20" y2="17" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderTop: '1px solid #F1F5F9',
            padding: '16px 24px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.06)',
          }}
        >
          {['Product', 'Solutions', 'Enterprise', 'Pricing', 'Resources', 'Contact'].map((label) => (
            <a
              key={label}
              href={`#${label.toLowerCase()}`}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                fontSize: '15px',
                fontWeight: 600,
                color: '#334155',
                textDecoration: 'none',
                padding: '6px 0',
              }}
            >
              {label}
            </a>
          ))}
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <a
              href="http://localhost:3000/login"
              style={{
                flex: 1,
                textAlign: 'center',
                padding: '10px',
                border: '1px solid #CBD5E1',
                borderRadius: '8px',
                fontWeight: 700,
                color: '#334155',
                textDecoration: 'none',
              }}
            >
              Login
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onRequestDemo();
              }}
              style={{
                flex: 1.4,
                textAlign: 'center',
                padding: '10px',
                backgroundColor: '#2A195C',
                color: '#FFFFFF',
                borderRadius: '8px',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Request a Demo
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @media (max-width: 900px) {
          :global(.desktop-nav),
          :global(.desktop-actions) {
            display: none !important;
          }
          :global(.mobile-toggle) {
            display: block !important;
          }
        }
      `}</style>
    </header>
  );
}
