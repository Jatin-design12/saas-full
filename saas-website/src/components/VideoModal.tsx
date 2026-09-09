'use client';
import React from 'react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VideoModal({ isOpen, onClose }: VideoModalProps) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#0F172A',
          borderRadius: '20px',
          maxWidth: '780px',
          width: '100%',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          position: 'relative',
          border: '1px solid #334155',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar */}
        <div
          style={{
            padding: '16px 20px',
            backgroundColor: '#1E293B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #334155',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#EF4444' }} />
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#F59E0B' }} />
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981' }} />
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#F1F5F9', marginLeft: '8px' }}>
              Evegah EV Fleet OS Platform Walkthrough (2026 Edition)
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#94A3B8',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            ✕
          </button>
        </div>

        {/* Video Preview Canvas */}
        <div style={{ padding: '24px', textAlign: 'center', color: '#FFFFFF' }}>
          <div
            style={{
              aspectRatio: '16 / 9',
              borderRadius: '12px',
              backgroundColor: '#1E1548',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <img
              src="/assets/evegah_hero_scene_hd.png"
              alt="Fleet Overview"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: 0.35,
              }}
            />
            <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '50%',
                  backgroundColor: '#22C55E',
                  color: '#0F172A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 0 10px rgba(34, 197, 94, 0.25)',
                  cursor: 'pointer',
                }}
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              </div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '20px', fontWeight: 800 }}>
                End-to-End EV Fleet &amp; Battery Telematics
              </div>
              <div style={{ fontSize: '13px', color: '#CBD5E1', maxWidth: '420px' }}>
                Live GPS geofencing, automated battery swap lockers, instant rider onboarding, and ICICI automated payouts.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
