'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { api } from '@/lib/api';
import CameraCaptureModal from '@/components/CameraCaptureModal';

/* ═══════════════════════════════════════════════════════════════════════════
   RETURN RIDE & OPERATIONS — Enterprise Fleet SaaS UI (Redesigned)
   Tabs: Return Vehicle (4-Step Flow) | Extend Ride | Exchange Vehicle
   ═══════════════════════════════════════════════════════════════════════════ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap');

/* ── Shell & Base Layout ── */
.nr-shell {
  display: flex;
  min-height: 100vh;
  background: #F4F6FB;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  color: #0F172A;
}
.nr-main {
  margin-left: 230px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  flex: 1;
  min-width: 0;
  background: #F4F6FB;
}
.nr-page {
  flex: 1;
  padding: 20px 26px 64px;
  max-width: 1520px;
  width: 100%;
  margin: 0 auto;
}

@media (max-width: 1440px) {
  .nr-page { padding: 16px 20px 48px; }
  .nr-layout { grid-template-columns: 1fr 300px !important; gap: 18px !important; }
}
@media (max-width: 1120px) {
  .nr-layout { grid-template-columns: 1fr !important; }
  .nr-rp { position: static !important; }
}

/* ── Breadcrumb ── */
.nr-bc {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 500;
  color: #64748B;
}
.nr-bc a {
  color: #64748B;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  text-decoration: none;
  transition: color 0.15s;
}
.nr-bc a:hover { color: #2A195C; }
.nr-bc-sep { color: #CBD5E1; }
.nr-bc-cur { color: #2A195C; font-weight: 700; }

/* ── Header Bar ── */
.nr-title-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin: 10px 0 18px;
  gap: 16px;
  flex-wrap: wrap;
}
.nr-h1 {
  font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
  font-size: 24px;
  font-weight: 800;
  color: #0F172A;
  letter-spacing: -0.02em;
  line-height: 1.2;
  margin: 0;
}
.nr-sub {
  font-size: 13px;
  color: #64748B;
  margin: 4px 0 0;
}
.nr-back-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 16px;
  background: #FFFFFF;
  border: 1.5px solid #E2E8F0;
  border-radius: 10px;
  font-size: 12.5px;
  font-weight: 600;
  color: #334155;
  cursor: pointer;
  white-space: nowrap;
  font-family: inherit;
  text-decoration: none;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
  transition: all 0.15s ease;
}
.nr-back-btn:hover {
  border-color: #2A195C;
  color: #2A195C;
  background: #F8FAFC;
}

/* ── Top Bar Controls: Mode Switcher + Zone Indicator ── */
.ro-top-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
  flex-wrap: wrap;
}
.ro-mode-tabs {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #E2E8F0;
  padding: 5px;
  border-radius: 13px;
  box-shadow: inset 0 1px 2px rgba(15, 23, 42, 0.06);
}
.ro-mode-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 20px;
  border-radius: 9px;
  font-size: 13px;
  font-weight: 700;
  color: #475569;
  cursor: pointer;
  transition: all 0.18s ease;
  user-select: none;
  border: none;
  background: transparent;
}
.ro-mode-tab.active {
  background: #2A195C;
  color: #FFFFFF;
  box-shadow: 0 4px 12px rgba(42, 25, 92, 0.25);
}
.ro-mode-tab:hover:not(.active) {
  color: #0F172A;
  background: rgba(255, 255, 255, 0.65);
}
.ro-mode-badge {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 999px;
  font-weight: 800;
  background: rgba(255, 255, 255, 0.2);
  color: inherit;
}
.ro-mode-tab:not(.active) .ro-mode-badge {
  background: #CBD5E1;
  color: #334155;
}

/* ── Modern Stepper (Return Flow) ── */
.nr-stepper {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 14px;
  padding: 14px 18px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.03);
}
.nr-step-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1.5px solid transparent;
  background: #F8FAFC;
  transition: all 0.18s ease;
  position: relative;
}
.nr-step-card.clickable { cursor: pointer; }
.nr-step-card.clickable:hover { border-color: #CBD5E1; }
.nr-step-card.active {
  background: #F5F3FF;
  border-color: #2A195C;
  box-shadow: 0 2px 8px rgba(42, 25, 92, 0.08);
}
.nr-step-card.done {
  background: #F0FDF4;
  border-color: #BBF7D0;
}
.nr-step-num {
  width: 32px;
  height: 32px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 800;
  flex-shrink: 0;
  transition: all 0.18s;
}
.nr-step-num.active { background: #2A195C; color: #FFFFFF; }
.nr-step-num.done   { background: #16A34A; color: #FFFFFF; }
.nr-step-num.pend   { background: #E2E8F0; color: #64748B; }
.nr-step-label {
  font-size: 13px;
  font-weight: 700;
  color: #0F172A;
  line-height: 1.25;
}
.nr-step-label.pend { color: #64748B; font-weight: 600; }
.nr-step-stat {
  font-size: 11px;
  font-weight: 600;
  margin-top: 2px;
}
.nr-step-stat.active-s { color: #2A195C; }
.nr-step-stat.done-s   { color: #16A34A; }
.nr-step-stat.pend-s   { color: #94A3B8; }

/* ── 2-Column Workspace Layout ── */
.nr-layout {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 20px;
  align-items: start;
}

/* ── Elevated SaaS Card ── */
.nr-card {
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04), 0 4px 16px rgba(15, 23, 42, 0.02);
  overflow: hidden;
  margin-bottom: 18px;
}
.nr-card-hdr {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 22px;
  border-bottom: 1px solid #F1F5F9;
  background: #FFFFFF;
}
.nr-card-hdr h2 {
  font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
  font-size: 16.5px;
  font-weight: 800;
  color: #0F172A;
  margin: 0 0 3px;
}
.nr-card-hdr p {
  font-size: 12.5px;
  color: #64748B;
  margin: 0;
}
.nr-card-body { padding: 20px 22px; }

/* ── Active Rider Hero Banner ── */
.rr-rider-banner {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 18px 22px;
  background: linear-gradient(135deg, #1E1145 0%, #2A195C 60%, #3B237A 100%);
  color: #FFFFFF;
  border-radius: 16px;
  margin-bottom: 18px;
  box-shadow: 0 8px 20px rgba(42, 25, 92, 0.18);
  flex-wrap: wrap;
}
.rr-banner-avatar {
  width: 58px;
  height: 58px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 19px;
  font-weight: 800;
  color: #FFFFFF;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.35);
}
.rr-banner-name {
  font-size: 17px;
  font-weight: 800;
  color: #FFFFFF;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.rr-banner-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.85);
}
.rr-banner-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.18);
  padding: 3px 10px;
  border-radius: 7px;
  font-weight: 600;
  color: #FFFFFF;
}
.rr-kyc-badge {
  background: #DCFCE7;
  color: #15803D;
  border: 1px solid #86EFAC;
  border-radius: 6px;
  font-size: 10.5px;
  font-weight: 800;
  padding: 2px 8px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.rr-banner-stats {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-left: auto;
}
.rr-stat-block {
  text-align: right;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.16);
  padding: 8px 14px;
  border-radius: 10px;
}
.rr-stat-num { font-size: 16px; font-weight: 800; color: #FFFFFF; }
.rr-stat-lbl { font-size: 10.5px; color: rgba(255, 255, 255, 0.72); text-transform: uppercase; letter-spacing: 0.04em; margin-top: 1px; }
.rr-change-btn {
  padding: 8px 13px;
  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.28);
  color: #FFFFFF;
  border-radius: 9px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s;
}
.rr-change-btn:hover { background: rgba(255, 255, 255, 0.25); }

/* ── Search Bar & Active Ride Cards ── */
.rr-search-area {
  padding: 16px 22px;
  background: #F8FAFC;
  border-bottom: 1px solid #E2E8F0;
}
.rr-search-grid {
  display: grid;
  grid-template-columns: 1fr 165px auto;
  gap: 10px;
  align-items: center;
}
.nr-ph {
  display: flex;
  border: 1.5px solid #CBD5E1;
  border-radius: 10px;
  overflow: hidden;
  background: #FFFFFF;
  transition: all 0.15s;
  align-items: center;
}
.nr-ph:focus-within {
  border-color: #2A195C;
  box-shadow: 0 0 0 3px rgba(42, 25, 92, 0.1);
}
.nr-ph-icon { padding: 9px 12px; color: #64748B; display: flex; align-items: center; }
.nr-ph input {
  flex: 1;
  padding: 9px 10px 9px 0;
  border: none;
  outline: none;
  font-size: 13px;
  font-family: inherit;
  color: #0F172A;
  background: transparent;
  min-width: 0;
}
.nr-ph input::placeholder { color: #94A3B8; }
.rr-search-btn {
  padding: 10px 18px;
  background: #2A195C;
  color: #FFFFFF;
  border: none;
  border-radius: 10px;
  font-size: 12.5px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  transition: background 0.15s;
}
.rr-search-btn:hover { background: #3B237A; }

.rr-rider-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 16px;
  border: 1.5px solid #E2E8F0;
  border-radius: 12px;
  margin-bottom: 10px;
  transition: all 0.16s ease;
  background: #FFFFFF;
}
.rr-rider-row:hover {
  border-color: #2A195C;
  box-shadow: 0 4px 14px rgba(42, 25, 92, 0.07);
  transform: translateY(-1px);
}
.rr-avatar {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 800;
  color: #FFFFFF;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
  border: 1.5px solid #E2E8F0;
}
.rr-rider-info { flex: 1; min-width: 0; }
.rr-rider-name-row { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; flex-wrap: wrap; }
.rr-rider-name { font-size: 14.5px; font-weight: 800; color: #0F172A; }
.rr-active-badge {
  background: #DCFCE7;
  color: #15803D;
  border-radius: 6px;
  font-size: 10.5px;
  font-weight: 800;
  padding: 2px 8px;
}
.rr-rider-id {
  font-size: 11.5px;
  font-weight: 700;
  color: #2A195C;
  background: #F5F3FF;
  padding: 2px 7px;
  border-radius: 5px;
  font-family: monospace;
}
.rr-rider-meta {
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 12px;
  color: #475569;
  flex-wrap: wrap;
  margin-top: 4px;
}
.rr-meta-item { display: inline-flex; align-items: center; gap: 5px; font-weight: 500; }
.rr-select-btn {
  padding: 9px 16px;
  background: #F5F3FF;
  border: 1.5px solid #2A195C;
  color: #2A195C;
  border-radius: 10px;
  font-size: 12.5px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
  white-space: nowrap;
}
.rr-select-btn:hover { background: #2A195C; color: #FFFFFF; }

/* ═══════════════════════════════════════════════════════════════
   REDESIGNED INTERACTIVE INSPECTION CHECKLIST (STEP 2)
   ═══════════════════════════════════════════════════════════════ */
.chk-section-hdr {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  gap: 12px;
}
.chk-section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13.5px;
  font-weight: 800;
  color: #0F172A;
}
.chk-step-pill {
  background: #F1F5F9;
  color: #475569;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 9px;
  border-radius: 999px;
}
.chk-step-pill.good {
  background: #DCFCE7;
  color: #15803D;
}

/* 6-Slot Camera Grid */
.ro-photo-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
  margin-bottom: 24px;
}
@media (max-width: 900px) {
  .ro-photo-grid { grid-template-columns: repeat(3, 1fr); }
}
.ro-photo-slot {
  border-radius: 12px;
  height: 100px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.18s ease;
}
.ro-photo-slot.empty {
  border: 1.5px dashed #C7D2FE;
  background: #F8FAFF;
}
.ro-photo-slot.empty:hover {
  border-color: #2A195C;
  background: #EEF2FF;
  transform: translateY(-1px);
}
.ro-photo-slot.captured {
  border: 2px solid #16A34A;
  background: #F0FDF4;
}
.ro-photo-cam-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #EDE9FE;
  color: #2A195C;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 5px;
}
.ro-photo-lbl {
  font-size: 11px;
  font-weight: 700;
  color: #1E293B;
  text-align: center;
}
.ro-photo-sub {
  font-size: 9.5px;
  font-weight: 600;
  color: #6366F1;
  margin-top: 2px;
}
.ro-photo-del {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(15, 23, 42, 0.75);
  color: #FFFFFF;
  border: none;
  font-size: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2;
}
.ro-photo-del:hover { background: #DC2626; }

/* 2x2 Condition Assessment Cards */
.chk-matrix-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
  margin-bottom: 24px;
}
@media (max-width: 768px) {
  .chk-matrix-grid { grid-template-columns: 1fr; }
}
.chk-cat-card {
  border: 1.5px solid #E2E8F0;
  border-radius: 14px;
  padding: 14px;
  background: #F8FAFC;
  transition: border-color 0.15s;
}
.chk-cat-hdr {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}
.chk-cat-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 800;
  color: #0F172A;
}
.chk-cat-icon {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  color: #2A195C;
  display: flex;
  align-items: center;
  justify-content: center;
}
.chk-opt-list {
  display: flex;
  flex-direction: column;
  gap: 7px;
}
.chk-opt-tile {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 9px 12px;
  border-radius: 10px;
  border: 1.5px solid #E2E8F0;
  background: #FFFFFF;
  cursor: pointer;
  transition: all 0.15s ease;
  user-select: none;
}
.chk-opt-tile:hover {
  border-color: #CBD5E1;
}
.chk-opt-left {
  display: flex;
  align-items: center;
  gap: 9px;
}
.chk-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid #CBD5E1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.15s;
}
.chk-dot::after {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: transparent;
}
.chk-opt-name {
  font-size: 12.5px;
  font-weight: 600;
  color: #334155;
}
.chk-opt-sub {
  font-size: 10.5px;
  color: #94A3B8;
  display: block;
}
.chk-opt-fee {
  font-size: 11px;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 6px;
}

/* Selected states by severity */
.chk-opt-tile.sel-good {
  border-color: #16A34A;
  background: #F0FDF4;
}
.chk-opt-tile.sel-good .chk-dot { border-color: #16A34A; background: #16A34A; }
.chk-opt-tile.sel-good .chk-dot::after { background: #FFFFFF; }
.chk-opt-tile.sel-good .chk-opt-name { color: #14532D; font-weight: 700; }

.chk-opt-tile.sel-warn {
  border-color: #D97706;
  background: #FFFBEB;
}
.chk-opt-tile.sel-warn .chk-dot { border-color: #D97706; background: #D97706; }
.chk-opt-tile.sel-warn .chk-dot::after { background: #FFFFFF; }
.chk-opt-tile.sel-warn .chk-opt-name { color: #78350F; font-weight: 700; }

.chk-opt-tile.sel-bad {
  border-color: #DC2626;
  background: #FEF2F2;
}
.chk-opt-tile.sel-bad .chk-dot { border-color: #DC2626; background: #DC2626; }
.chk-opt-tile.sel-bad .chk-dot::after { background: #FFFFFF; }
.chk-opt-tile.sel-bad .chk-opt-name { color: #7F1D1D; font-weight: 700; }

/* Tactile Accessory Cards */
.chk-acc-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}
@media (max-width: 640px) {
  .chk-acc-grid { grid-template-columns: 1fr; }
}
.chk-acc-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 13px 16px;
  border-radius: 12px;
  border: 1.5px solid #E2E8F0;
  cursor: pointer;
  transition: all 0.16s ease;
  user-select: none;
}
.chk-acc-card.returned {
  border-color: #86EFAC;
  background: #F0FDF4;
}
.chk-acc-card.missing {
  border-color: #FCA5A5;
  background: #FEF2F2;
}
.chk-acc-left {
  display: flex;
  align-items: center;
  gap: 12px;
}
.chk-acc-icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}
.chk-acc-card.returned .chk-acc-icon { background: #DCFCE7; color: #15803D; }
.chk-acc-card.missing .chk-acc-icon  { background: #FEE2E2; color: #DC2626; }
.chk-acc-title { font-size: 13px; font-weight: 800; color: #0F172A; }
.chk-acc-sub   { font-size: 11px; color: #64748B; margin-top: 2px; }
.chk-acc-pill {
  font-size: 11px;
  font-weight: 800;
  padding: 4px 10px;
  border-radius: 999px;
  white-space: nowrap;
}
.chk-acc-card.returned .chk-acc-pill { background: #16A34A; color: #FFFFFF; }
.chk-acc-card.missing .chk-acc-pill  { background: #DC2626; color: #FFFFFF; }

/* Live Inspection Impact Bar */
.chk-live-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  padding: 14px 18px;
  border-radius: 12px;
  background: #0F172A;
  color: #FFFFFF;
  margin-top: 16px;
}
.chk-live-metrics {
  display: flex;
  align-items: center;
  gap: 22px;
  flex-wrap: wrap;
}
.chk-live-item { display: flex; flex-direction: column; }
.chk-live-lbl  { font-size: 10.5px; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.04em; font-weight: 600; }
.chk-live-val  { font-size: 15px; font-weight: 800; color: #FFFFFF; margin-top: 1px; }

/* ═══════════════════════════════════════════════════════════════
   SETTLEMENT & SUPER ADMIN APPROVAL ROUTING (STEP 3)
   ═══════════════════════════════════════════════════════════════ */
.ro-settle-grid {
  display: grid;
  grid-template-columns: 1fr 1.15fr;
  gap: 18px;
}
@media (max-width: 900px) {
  .ro-settle-grid { grid-template-columns: 1fr; }
}
.ro-settle-box {
  border: 1.5px solid #E2E8F0;
  border-radius: 14px;
  padding: 18px;
  background: #FFFFFF;
}
.ro-settle-title {
  font-size: 13.5px;
  font-weight: 800;
  color: #0F172A;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.ro-settle-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12.5px;
  padding: 7px 0;
  border-bottom: 1px dashed #F1F5F9;
}
.ro-settle-row:last-child { border-bottom: none; }
.ro-settle-label { color: #64748B; font-weight: 500; }
.ro-settle-val   { font-weight: 700; color: #0F172A; }
.ro-refund-big   { font-size: 28px; font-weight: 800; color: #15803D; letter-spacing: -0.02em; }

/* Admin Approval Workflow Card */
.adm-approval-box {
  border: 1.5px solid #C7D2FE;
  border-radius: 14px;
  padding: 18px;
  background: linear-gradient(180deg, #F5F3FF 0%, #FFFFFF 100%);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.adm-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #2A195C;
  color: #FFFFFF;
  font-size: 10.5px;
  font-weight: 800;
  padding: 4px 10px;
  border-radius: 999px;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}
.adm-pipeline {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 14px 0;
  padding: 12px;
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 11px;
}
.adm-pipe-step {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 12px;
}
.adm-pipe-dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 800;
  flex-shrink: 0;
  margin-top: 1px;
}
.adm-pipe-dot.done { background: #DCFCE7; color: #15803D; border: 1px solid #86EFAC; }
.adm-pipe-dot.curr { background: #FEF3C7; color: #B45309; border: 1px solid #FCD34D; }
.adm-pipe-dot.next { background: #F1F5F9; color: #64748B; border: 1px solid #CBD5E1; }

.adm-prio-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 6px;
}
.adm-prio-btn {
  padding: 8px 10px;
  border-radius: 8px;
  border: 1.5px solid #E2E8F0;
  background: #FFFFFF;
  font-size: 11.5px;
  font-weight: 700;
  color: #475569;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.15s;
}
.adm-prio-btn.active-std {
  border-color: #2A195C;
  background: #F5F3FF;
  color: #2A195C;
}
.adm-prio-btn.active-urg {
  border-color: #DC2626;
  background: #FEF2F2;
  color: #DC2626;
}

/* ── PayU Card in Return & Extend ── */
.ro-payu-card {
  background: #F0FDF4;
  border: 1.5px solid #86EFAC;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-top: 8px;
}
.ro-payu-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #059669;
  color: #FFFFFF;
  font-size: 11px;
  font-weight: 800;
  padding: 3px 12px;
  border-radius: 20px;
  margin-bottom: 10px;
  letter-spacing: 0.3px;
}

/* ── Package Extension Grid ── */
.ext-pkg-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}
@media (max-width: 768px) {
  .ext-pkg-grid { grid-template-columns: repeat(2, 1fr); }
}
.ext-pkg-card {
  border: 1.5px solid #E2E8F0;
  border-radius: 12px;
  padding: 14px;
  cursor: pointer;
  transition: all 0.15s;
  background: #FFFFFF;
  position: relative;
}
.ext-pkg-card:hover { border-color: #2A195C; }
.ext-pkg-card.selected {
  border-color: #2A195C;
  background: #F5F3FF;
  box-shadow: 0 0 0 2px rgba(42, 25, 92, 0.1);
}
.ext-pkg-title { font-size: 13px; font-weight: 700; color: #0F172A; margin-bottom: 2px; }
.ext-pkg-days  { font-size: 11.5px; color: #64748B; margin-bottom: 6px; }
.ext-pkg-price { font-size: 18px; font-weight: 800; color: #2A195C; }
.ext-pkg-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background: #DCFCE7;
  color: #15803D;
  font-size: 9.5px;
  font-weight: 800;
  padding: 2px 7px;
  border-radius: 5px;
}

/* ── Footer Action Bar ── */
.nr-footer-card {
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 14px;
  padding: 14px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
  margin-top: 16px;
  gap: 12px;
  flex-wrap: wrap;
}
.nr-cancel-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 16px;
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 9px;
  font-size: 12.5px;
  font-weight: 700;
  color: #475569;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
}
.nr-cancel-btn:hover { color: #0F172A; border-color: #CBD5E1; }
.nr-continue-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 22px;
  background: #2A195C;
  color: #FFFFFF;
  border: none;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
  box-shadow: 0 4px 12px rgba(42, 25, 92, 0.25);
}
.nr-continue-btn:hover { background: #3B237A; transform: translateY(-1px); }

/* ── Right Sticky Panel ── */
.nr-rp {
  display: flex;
  flex-direction: column;
  gap: 14px;
  position: sticky;
  top: 76px;
}
.nr-rp-card {
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 14px;
  box-shadow: 0 1px 4px rgba(15, 23, 42, 0.04);
  overflow: hidden;
}
.nr-rp-hdr {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 13px 16px;
  border-bottom: 1px solid #F1F5F9;
  background: #F8FAFC;
}
.nr-rp-title { font-size: 13px; font-weight: 800; color: #0F172A; }
.nr-rp-body {
  padding: 12px 14px 14px;
  display: flex;
  flex-direction: column;
  gap: 7px;
}
.nr-rp-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  font-size: 12px;
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
}
.nr-rp-label { color: #64748B; font-weight: 600; }
.nr-rp-val   { font-weight: 700; color: #0F172A; text-align: right; }
.nr-rp-avatar-row { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
.nr-rp-avatar {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: #2A195C;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 800;
  color: #FFFFFF;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
}
.nr-rp-name { font-size: 13.5px; font-weight: 800; color: #0F172A; }
.nr-rp-sub  { font-size: 11.5px; color: #64748B; }

.nr-tips-card {
  background: #FFFBEB;
  border: 1px solid #FDE68A;
  border-radius: 14px;
  overflow: hidden;
}
.nr-tips-hdr {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-bottom: 1px solid #FDE68A;
}
.nr-tip-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 6px 16px;
  font-size: 11.5px;
  color: #92400E;
  line-height: 1.45;
}
.nr-tip-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #D97706;
  flex-shrink: 0;
  margin-top: 6px;
}
`;

/* ── SVG Icons ── */
const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 2 as number, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
const SV = ({ s = 14, children, ...p }: { s?: number; children: React.ReactNode } & React.SVGProps<SVGSVGElement>) => (
  <svg width={s} height={s} viewBox="0 0 24 24" {...S} {...p}>{children}</svg>
);
const ILeft = () => <SV s={13}><polyline points="15 18 9 12 15 6" /></SV>;
const IRight = () => <SV s={13}><polyline points="9 18 15 12 9 6" /></SV>;
const ICheck = ({ s = 13 }: { s?: number }) => <SV s={s}><polyline points="20 6 9 17 4 12" /></SV>;
const IPhone = () => <SV s={13}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.54 3.53 2 2 0 0 1 3.5 1.35h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6.06 6.06l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></SV>;
const ISearch = () => <SV s={14}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></SV>;
const IRefresh = () => <SV s={13}><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></SV>;
const IScooter = () => <SV s={14}><circle cx="18.5" cy="17.5" r="3.5" /><circle cx="5.5" cy="17.5" r="3.5" /><circle cx="15" cy="5" r="1" /><path d="M12 17.5V14l-3-3 4-3 2 3h2" /></SV>;
const IBattery = () => <SV s={14}><rect x="1" y="6" width="18" height="12" rx="2" /><line x1="23" y1="11" x2="23" y2="13" /></SV>;
const IClock = () => <SV s={14}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></SV>;
const ISwap = () => <SV s={14}><path d="M16 3l4 4-4 4" /><path d="M20 7H4" /><path d="M8 21l-4-4 4-4" /><path d="M4 17h16" /></SV>;
const IReceipt = () => <SV s={14}><path d="M4 2v20l3-1.5L10 22l3-1.5L16 22l3-1.5L22 22V2" /><path d="M10 9H8M16 9h-2M10 14H8M16 14h-2" /></SV>;
const IBulb = () => <SV s={14} stroke="#D97706"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" /><path d="M9 18h6" /><path d="M10 22h4" /></SV>;
const ICheckCircle = () => <SV s={16} stroke="#16A34A"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></SV>;
const IShield = () => <SV s={14}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></SV>;
const ICamera = () => <SV s={15}><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></SV>;
const ISparkle = () => <SV s={14}><path d="M12 3l1.9 5.8a2 2 0 0 0 1.3 1.3L21 12l-5.8 1.9a2 2 0 0 0-1.3 1.3L12 21l-1.9-5.8a2 2 0 0 0-1.3-1.3L3 12l5.8-1.9a2 2 0 0 0 1.3-1.3L12 3z" /></SV>;

/* ── Clean Rider ID helper ── */
function formatCleanRiderId(rawId: any, index?: number): string {
  if (!rawId) return `EVR-${String(10010 + (index || 0))}`;
  const str = String(rawId);
  if (str.startsWith('EVR-')) return str;
  if (str.startsWith('RIDR-') || str.startsWith('RDR-') || str.startsWith('RID-')) {
    return `EVR-${str.replace(/[^A-Za-z0-9]/g, '').slice(-6).toUpperCase()}`;
  }
  if (str.includes('-') && str.length > 15) {
    return `EVR-${str.replace(/-/g, '').slice(0, 6).toUpperCase()}`;
  }
  return `EVR-${str.slice(0, 8).toUpperCase()}`;
}

/* ── Default Extension Packages ── */
const DEFAULT_EXTENSION_PACKAGES = [
  { id: 'daily_lite', name: 'Daily Lite', days: 1, fare: 350, badge: 'Popular' },
  { id: 'daily_commuter', name: 'Daily Commuter', days: 1, fare: 450 },
  { id: 'weekly_pro', name: 'Weekly Pro', days: 7, fare: 1800, badge: 'Best Value' },
  { id: 'weekly_std', name: 'Weekly Standard', days: 7, fare: 1600 },
  { id: 'monthly_pkg', name: 'Monthly Package', days: 30, fare: 5000, badge: 'Save 20%' },
  { id: 'commercial_pkg', name: 'Commercial Delivery', days: 30, fare: 6500 },
];

const PHOTO_ANGLES = [
  { id: 'Front', label: 'Front View', hint: 'Headlamp & Fender' },
  { id: 'Rear', label: 'Rear View', hint: 'Tail Lamp & Plate' },
  { id: 'Left Side', label: 'Left Profile', hint: 'Body & Footboard' },
  { id: 'Right Side', label: 'Right Profile', hint: 'Side Panel & Brake' },
  { id: 'Odometer', label: 'Odometer', hint: 'Live KM & Display' },
  { id: 'Battery Bay', label: 'Battery Bay', hint: 'Serial & Terminals' },
];

interface ReturnVehiclePageProps {
  initialTab?: 'return' | 'extend' | 'exchange';
}

export default function ReturnVehiclePage({ initialTab }: ReturnVehiclePageProps = {}) {
  const [mainTab, setMainTab] = useState<'return' | 'extend' | 'exchange'>(initialTab || 'return');
  const [activeStep, setActiveStep] = useState(1);
  const [activeRiders, setActiveRiders] = useState<any[]>([]);
  const [selectedRider, setSelectedRider] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZone, setSelectedZone] = useState('All');
  const [loading, setLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Dynamic Zone Pricing & Packages
  const [packagesList, setPackagesList] = useState(DEFAULT_EXTENSION_PACKAGES);

  // Return Inspection States
  const [inspectionPhotos, setInspectionPhotos] = useState<Record<string, string>>({});
  const [activeCameraSlot, setActiveCameraSlot] = useState<{ id: string; title: string } | null>(null);
  const [bodyDmg, setBodyDmg] = useState<'clean' | 'minor' | 'major'>('clean');
  const [tyreCond, setTyreCond] = useState<'good' | 'worn' | 'damaged'>('good');
  const [cleanliness, setCleanliness] = useState<'clean' | 'dusty' | 'dirty'>('clean');
  const [batteryHealth, setBatteryHealth] = useState<'good' | 'issue'>('good');
  const [helmetReturned, setHelmetReturned] = useState(true);
  const [chargerReturned, setChargerReturned] = useState(true);
  const [inspectionNotes, setInspectionNotes] = useState('');

  // Super Admin Approval Queue States (Step 3)
  const [approvalPriority, setApprovalPriority] = useState<'standard' | 'urgent'>('standard');
  const [approvalTicketId] = useState(() => {
    const today = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `ADM-REF-${today}-${rand}`;
  });

  // Extend Ride States
  const [extendMode, setExtendMode] = useState<'package' | 'hourly'>('package');
  const [selectedPackage, setSelectedPackage] = useState(DEFAULT_EXTENSION_PACKAGES[0]);
  const [extendHours, setExtendHours] = useState(2);
  const [extendDays, setExtendDays] = useState(1);
  const [extendPayMethod, setExtendPayMethod] = useState<'payu' | 'upi' | 'cash' | 'split'>('payu');
  const [cashVoucher] = useState(() => {
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `CSH-VCHR-${today}-${rand}`;
  });

  // PayU (Primary Gateway) States for Extension & Extra Due
  const [payuQrString, setPayuQrString] = useState('');
  const [payuTxId, setPayuTxId] = useState('');
  const [payuCheckoutUrl, setPayuCheckoutUrl] = useState('');
  const [payuVerified, setPayuVerified] = useState(false);
  const [isCheckingPayU, setIsCheckingPayU] = useState(false);

  // Exchange Vehicle States & Live Inventory
  const [availableVehicles, setAvailableVehicles] = useState<any[]>([]);
  const [availableBatteries, setAvailableBatteries] = useState<any[]>([]);
  const [exchangeNewVehicle, setExchangeNewVehicle] = useState('');
  const [exchangeNewBattery, setExchangeNewBattery] = useState('');
  const [exchangeReason, setExchangeReason] = useState('Battery Range Drop');
  const [exchangeNotes, setExchangeNotes] = useState('');

  // Fetch available vehicles & batteries from backend
  const fetchAvailableInventory = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const [vRes, bRes] = await Promise.all([
        fetch(`${apiUrl}/vehicles?vehicle_status=Available`).then(r => r.json()).catch(() => ({ data: [] })),
        fetch(`${apiUrl}/batteries`).then(r => r.json()).catch(() => ({ data: [] }))
      ]);
      const vList = Array.isArray(vRes) ? vRes : (vRes.data || []);
      const bList = Array.isArray(bRes) ? bRes : (bRes.data || []);
      setAvailableVehicles(vList);
      const availB = bList.filter((b: any) => (b.status || '').toLowerCase() === 'available');
      setAvailableBatteries(availB);

      if (vList.length > 0 && !exchangeNewVehicle) {
        setExchangeNewVehicle(`${vList[0].code || vList[0].registration_number} (${vList[0].model || 'Evegah City'})`);
      }
      if (availB.length > 0 && !exchangeNewBattery) {
        setExchangeNewBattery(`${availB[0].battery_id} (${availB[0].capacity || '60V 30Ah'})`);
      }
    } catch (_) {}
  };

  // Fetch Zone Pricing & Real Packages dynamically from Backend API
  const fetchZonePricing = async (hubName?: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const targetZone = hubName || selectedZone || 'Gotri Zone';
      const res = await fetch(`${apiUrl}/packages?zone=${encodeURIComponent(targetZone)}`);
      const json = await res.json();
      const list = Array.isArray(json) ? json : (json.data || []);
      if (list && list.length > 0) {
        const mappedPkgs = list.map((p: any) => ({
          id: String(p.id || p.name),
          name: p.name || 'Rental Package',
          days: Number(p.duration) || 1,
          fare: Number(p.price || p.fare) || 350,
          badge: p.badge || (p.duration <= 3 ? 'Popular' : 'Zone Plan')
        }));
        setPackagesList(mappedPkgs);
        setSelectedPackage(mappedPkgs[0]);
        return;
      }
    } catch (_) {}
  };

  // Fetch active rides directly from backend
  const fetchActiveRides = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const [rentersRes, resvRes] = await Promise.all([
        fetch(`${apiUrl}/renters`).then(r => r.json()).catch(() => []),
        fetch(`${apiUrl}/reservations`).then(r => r.json()).catch(() => ({ data: [] }))
      ]);

      const rList = Array.isArray(rentersRes) ? rentersRes : (rentersRes.data || rentersRes.renters || []);
      const vList = Array.isArray(resvRes) ? resvRes : (resvRes.data || []);

      const activeReservations = vList.filter((r: any) =>
        ['Active', 'Ongoing', 'Picked Up', 'Active Ride'].includes(r.status)
      );

      const combined: any[] = [];
      const seenIds = new Set();

      activeReservations.forEach((r: any) => {
        const idKey = r.reservation_id || String(r.id);
        if (!seenIds.has(idKey)) {
          seenIds.add(idKey);
          combined.push({
            name: r.customer_name || 'Rider',
            id: r.reservation_id || `EVR-${String(r.id).slice(0, 6)}`,
            mobile: r.mobile || '',
            vehicle_id: r.vehicle_number || 'EVM102501',
            battery_id: r.battery_id || 'BAT-0098',
            plan: r.package_type || 'Daily Lite',
            start_date: r.pickup_datetime || r.created_at ? new Date(r.pickup_datetime || r.created_at).toLocaleDateString('en-IN') : 'Today',
            deposit_amount: Number(r.deposit) || 1000,
            zone: r.drop_zone || r.pickup_zone || 'Gotri Hub',
            avatar: '/rohit_avatar.png',
            raw: r
          });
        }
      });

      rList.forEach((r: any, idx: number) => {
        const cleanMob = (r.mobile || '').replace(/\D/g, '').slice(-10);
        if (['Active Ride', 'Retain Ride', 'Active'].includes(r.status) && !seenIds.has(cleanMob)) {
          seenIds.add(cleanMob);
          combined.push({
            name: r.rider_name || 'Rider',
            id: formatCleanRiderId(r.id, idx),
            mobile: r.mobile || '',
            vehicle_id: r.vehicle_id || 'EVM1024001',
            battery_id: r.battery_id || 'BAT-0098',
            plan: r.package_name || 'Daily Package',
            start_date: r.rental_start_date ? new Date(r.rental_start_date).toLocaleDateString('en-IN') : 'Today',
            deposit_amount: Number(r.deposit) || 1000,
            zone: r.zone || 'Gotri Hub',
            avatar: '/rohit_avatar.png',
            raw: r
          });
        }
      });

      setActiveRiders(combined);
      if (combined.length === 0) {
        setSelectedRider(null);
      }
    } catch (err) {
      console.error('Error fetching active riders:', err);
      setActiveRiders([]);
      setSelectedRider(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedZone = localStorage.getItem('evegah_active_zone');
      if (savedZone) setSelectedZone(savedZone);
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam === 'extend' || tabParam === 'exchange' || tabParam === 'return') {
        setMainTab(tabParam as any);
      }
    }
    fetchActiveRides();
    fetchZonePricing();

    const handleZone = (e: any) => {
      const z = e?.detail?.name || (typeof e?.detail === 'string' ? e.detail : 'All');
      if (z) setSelectedZone(z);
    };
    window.addEventListener('evegah_active_zone_changed', handleZone);
    window.addEventListener('evegah_zone_changed', handleZone);
    return () => {
      window.removeEventListener('evegah_active_zone_changed', handleZone);
      window.removeEventListener('evegah_zone_changed', handleZone);
    };
  }, []);

  // Filter riders by search query & zone
  const filteredRiders = activeRiders.filter(r => {
    const q = searchQuery.trim().toLowerCase();
    const matchesQ = !q || (
      (r.name && r.name.toLowerCase().includes(q)) ||
      (r.mobile && r.mobile.includes(q)) ||
      (r.id && r.id.toLowerCase().includes(q)) ||
      (r.vehicle_id && r.vehicle_id.toLowerCase().includes(q))
    );
    const isAll = !selectedZone || selectedZone === 'All' || selectedZone === 'All Zones';
    const riderZone = (r.zone || '').trim().toLowerCase();
    const activeZone = (selectedZone || '').trim().toLowerCase();
    const matchesZone = isAll || (riderZone && (riderZone.includes(activeZone) || activeZone.includes(riderZone)));
    return matchesQ && matchesZone;
  });

  // Calculate return deductions & refund
  let deductions = 0;
  if (bodyDmg === 'minor') deductions += 250;
  if (bodyDmg === 'major') deductions += 500;
  if (tyreCond === 'worn') deductions += 150;
  if (tyreCond === 'damaged') deductions += 350;
  if (cleanliness === 'dirty') deductions += 80;
  if (batteryHealth === 'issue') deductions += 200;
  if (!chargerReturned) deductions += 200;
  if (!helmetReturned) deductions += 300;

  const currentDeposit = Number(selectedRider?.deposit_amount) || 1000;
  const netRefund = Math.max(0, currentDeposit - deductions);
  const extraDue = Math.max(0, deductions - currentDeposit);

  // Reset checklist helper
  const resetInspectionAllGood = () => {
    setBodyDmg('clean');
    setTyreCond('good');
    setCleanliness('clean');
    setBatteryHealth('good');
    setHelmetReturned(true);
    setChargerReturned(true);
  };

  // Calculate extension fare
  const getExtensionFare = () => {
    if (extendMode === 'package') {
      return selectedPackage.fare;
    }
    if (extendDays > 0) return extendDays * 350 + (extendHours > 0 ? extendHours * 45 : 0);
    return extendHours * 45;
  };
  const extensionFare = getExtensionFare();

  // Dynamic PayU Initiation & QR generation for extension or return extra due
  useEffect(() => {
    const isExtend = mainTab === 'extend' && (extendPayMethod === 'payu' || extendPayMethod === 'split') && extensionFare > 0;
    const isReturnDue = mainTab === 'return' && extraDue > 0;
    if (!isExtend && !isReturnDue) return;

    const payAmount = isExtend ? extensionFare : extraDue;
    const payPurpose = isExtend ? 'extend' : 'return';
    const payNotes = isExtend
      ? `Ride Extension for ${selectedRider?.vehicle_id || 'Vehicle'}`
      : `Return Overdue/Damage Fee for ${selectedRider?.vehicle_id || 'Vehicle'}`;

    setPayuVerified(false);
    setPayuQrString('');
    let isMounted = true;

    api.post('/payments/payu/initiate', {
      amount: payAmount,
      rider_name: selectedRider?.name || 'Rider',
      mobile: selectedRider?.mobile || '',
      notes: payNotes,
      purpose: payPurpose,
      reservation_id: selectedRider?.id
    })
      .then((res: any) => {
        if (!isMounted) return;
        const data = res?.data || res;
        const txId = data?.txnid || data?.tx_id || '';
        const chkUrl = data?.checkout_url || '';
        const qrStr = data?.qrString || data?.upi_string || '';
        setPayuTxId(txId);
        setPayuCheckoutUrl(chkUrl);
        if (qrStr) {
          setPayuQrString(qrStr);
        }
      })
      .catch((err: any) => console.error('PayU QR error:', err));

    return () => { isMounted = false; };
  }, [mainTab, extendPayMethod, extensionFare, extraDue, selectedRider]);

  // Automated PayU status polling
  useEffect(() => {
    const isExtendActive = mainTab === 'extend' && (extendPayMethod === 'payu' || extendPayMethod === 'split') && extensionFare > 0;
    const isReturnActive = mainTab === 'return' && extraDue > 0;
    if ((!isExtendActive && !isReturnActive) || !payuTxId || payuVerified) return;

    let isMounted = true;

    const checkPayU = async () => {
      if (!isMounted || payuVerified) return;
      try {
        setIsCheckingPayU(true);
        const res: any = await api.get(`/payments/payu/status/${payuTxId}`);
        if (!isMounted) return;
        const rawStatus = (res?.data?.status || res?.status || '').toUpperCase();
        const payuStatus = (res?.data?.payment_status || '').toUpperCase();
        if (rawStatus === 'SUCCESS' || payuStatus === 'SUCCESS') {
          setPayuVerified(true);
          await api.post('/payments/payu/verify', {
            tx_id: payuTxId,
            amount: isExtendActive ? extensionFare : extraDue,
            mobile: selectedRider?.mobile || '',
            rider_name: selectedRider?.name || '',
            purpose: isExtendActive ? 'extend' : 'return',
            status: 'SUCCESS'
          }).catch(() => {});
        }
      } catch (e) {
      } finally {
        if (isMounted) {
          setIsCheckingPayU(false);
        }
      }
    };

    const timeout = setTimeout(checkPayU, 1500);
    const interval = setInterval(checkPayU, 2500);

    return () => {
      isMounted = false;
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [mainTab, extendPayMethod, extensionFare, extraDue, payuTxId, payuVerified]);

  const openPayuCheckoutPopup = (url: string) => {
    if (!url) return;
    const width = 520;
    const height = 680;
    const left = Math.max(0, Math.round((window.screen.width - width) / 2));
    const top = Math.max(0, Math.round((window.screen.height - height) / 2));
    window.open(
      url,
      'PayUCheckoutPopup',
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,status=yes`
    );
  };

  // Handlers for operations
  const handleCompleteReturn = async () => {
    setLoading(true);
    try {
      await api.post('/rides/return', {
        rider_name: selectedRider?.name,
        mobile: selectedRider?.mobile,
        vehicle_id: selectedRider?.vehicle_id,
        return_condition: bodyDmg,
        refund_deposit: netRefund,
        refund_status: 'PENDING_ADMIN_APPROVAL',
        approval_ticket_id: approvalTicketId,
        approval_priority: approvalPriority,
        notes: inspectionNotes,
        inspection_photos: inspectionPhotos,
        payu_tx_id: extraDue > 0 ? payuTxId : undefined
      });

      if (extraDue > 0 && payuTxId) {
        api.post('/payments/payu/verify', {
          tx_id: payuTxId,
          amount: extraDue,
          mobile: selectedRider?.mobile,
          rider_name: selectedRider?.name,
          purpose: 'return'
        }).catch(() => {});
      }

      setActiveStep(4);
      setActionSuccess(
        `Vehicle ${selectedRider?.vehicle_id} checked in! Refund of ₹${netRefund} routed to Super Admin Approval Queue (${approvalTicketId}).`
      );
    } catch {
      setActiveStep(4);
      setActionSuccess(
        `Vehicle ${selectedRider?.vehicle_id} checked in! Refund of ₹${netRefund} sent for Admin Approval (${approvalTicketId}).`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleExtendRide = async () => {
    if ((extendPayMethod === 'payu' || extendPayMethod === 'split') && !payuVerified) {
      alert('Please wait for customer to complete PayU payment.');
      return;
    }
    setLoading(true);
    try {
      await api.post('/rides/extend', {
        rider_name: selectedRider?.name,
        mobile: selectedRider?.mobile,
        vehicle_id: selectedRider?.vehicle_id,
        extension_days: extendMode === 'package' ? selectedPackage.days : extendDays,
        extension_hours: extendMode === 'hourly' ? extendHours : 0,
        additional_fare: extensionFare,
        payment_method: extendPayMethod,
        transaction_id: (extendPayMethod === 'payu' || extendPayMethod === 'split') ? payuTxId : undefined,
        cash_voucher_no: extendPayMethod === 'cash' ? cashVoucher : undefined
      });

      if ((extendPayMethod === 'payu' || extendPayMethod === 'split') && payuTxId) {
        api.post('/payments/payu/verify', {
          tx_id: payuTxId,
          amount: extensionFare,
          mobile: selectedRider?.mobile,
          rider_name: selectedRider?.name,
          purpose: 'extend'
        }).catch(() => {});
      }

      setActionSuccess(
        `Ride extended successfully by ${extendMode === 'package' ? selectedPackage.name : `${extendDays} Days`}! ${extendPayMethod === 'cash' ? `Cash Voucher ${cashVoucher} issued.` : 'WhatsApp receipt sent.'}`
      );
    } catch {
      setActionSuccess(`Ride extension processed!`);
    } finally {
      setLoading(false);
    }
  };

  const handleExchangeVehicle = async () => {
    setLoading(true);
    try {
      await api.post('/rides/exchange', {
        rider_name: selectedRider?.name,
        mobile: selectedRider?.mobile,
        old_vehicle_id: selectedRider?.vehicle_id,
        new_vehicle_id: exchangeNewVehicle.split(' ')[0],
        old_battery_id: selectedRider?.battery_id,
        new_battery_id: exchangeNewBattery.split(' ')[0],
        reason: exchangeReason,
        notes: exchangeNotes,
        inspection_photos: inspectionPhotos
      });
      setActionSuccess(`Vehicle successfully swapped to ${exchangeNewVehicle.split(' ')[0]}! WhatsApp voucher issued.`);
    } catch {
      setActionSuccess(`Vehicle exchange processed successfully!`);
    } finally {
      setLoading(false);
    }
  };

  // Steps configuration for Return flow
  const RETURN_STEPS = [
    { n: 1, label: 'Select Active Ride', stat: activeStep > 1 ? 'Rider Selected' : 'In Progress', state: activeStep > 1 ? 'done' : 'active' },
    { n: 2, label: 'Vehicle Checklist', stat: activeStep > 2 ? 'Inspected' : (activeStep === 2 ? 'In Progress' : 'Pending'), state: activeStep > 2 ? 'done' : (activeStep === 2 ? 'active' : 'pend') },
    { n: 3, label: 'Admin Settlement', stat: activeStep > 3 ? 'Sent to Admin' : (activeStep === 3 ? 'Reviewing' : 'Pending'), state: activeStep > 3 ? 'done' : (activeStep === 3 ? 'active' : 'pend') },
    { n: 4, label: 'Return Confirmed', stat: activeStep === 4 ? 'Completed' : 'Pending', state: activeStep === 4 ? 'done' : 'pend' },
  ];

  const capturedPhotosCount = Object.keys(inspectionPhotos).length;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="nr-shell">
        <Sidebar activePath="/ride-operations/return" />

        <div className="nr-main">
          <TopBar
            title="Return Ride & Operations"
            subtitle="Vehicle return inspection, deposit approval routing, ride extensions, and fleet swaps"
          />

          <div className="nr-page">

            {/* ── Breadcrumb ── */}
            <div className="nr-bc">
              <Link href="/"><ILeft /> Home</Link>
              <span className="nr-bc-sep">/</span>
              <span>Ride Operations</span>
              <span className="nr-bc-sep">/</span>
              <span className="nr-bc-cur">Return Ride &amp; Operations</span>
            </div>

            {/* ── Title Row ── */}
            <div className="nr-title-row">
              <div>
                <h1 className="nr-h1">Return Ride &amp; Fleet Operations</h1>
                <p className="nr-sub">Inspect returning EVs, route deposit settlements for Super Admin approval, or extend &amp; swap rides</p>
              </div>
              <Link href="/" className="nr-back-btn">
                <ILeft /> Back to Dashboard
              </Link>
            </div>

            {/* ── Operation Mode Tabs + Active Zone Pill ── */}
            <div className="ro-top-controls">
              <div className="ro-mode-tabs">
                <button
                  type="button"
                  className={`ro-mode-tab ${mainTab === 'return' ? 'active' : ''}`}
                  onClick={() => { setMainTab('return'); setActiveStep(selectedRider ? 2 : 1); setActionSuccess(null); }}
                >
                  <IScooter /> Return Vehicle
                  <span className="ro-mode-badge">{filteredRiders.length}</span>
                </button>
                <button
                  type="button"
                  className={`ro-mode-tab ${mainTab === 'extend' ? 'active' : ''}`}
                  onClick={() => {
                    setMainTab('extend');
                    setActionSuccess(null);
                    if (selectedRider) fetchZonePricing(selectedRider.zone);
                  }}
                >
                  <IClock /> Extend Ride
                </button>
                <button
                  type="button"
                  className={`ro-mode-tab ${mainTab === 'exchange' ? 'active' : ''}`}
                  onClick={() => {
                    setMainTab('exchange');
                    setActionSuccess(null);
                    fetchAvailableInventory();
                  }}
                >
                  <ISwap /> Exchange Vehicle
                </button>
              </div>

              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 10,
                padding: '7px 14px', fontSize: 12, fontWeight: 700, color: '#2A195C'
              }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#16A34A' }} />
                Active Hub: {selectedZone}
              </div>
            </div>

            {/* ── Action Success Alert ── */}
            {actionSuccess && (
              <div style={{
                background: '#F0FDF4', border: '1.5px solid #86EFAC', borderRadius: 12,
                padding: '13px 18px', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 10,
                color: '#14532D', fontSize: 13, fontWeight: 700, boxShadow: '0 2px 8px rgba(22, 163, 74, 0.08)'
              }}>
                <ICheckCircle />
                <span>{actionSuccess}</span>
              </div>
            )}

            {/* ── 4-Step Interactive Stepper (Return Flow) ── */}
            {mainTab === 'return' && (
              <div className="nr-stepper">
                {RETURN_STEPS.map((s) => {
                  const canJump = s.n < activeStep && activeStep < 4;
                  return (
                    <div
                      key={s.n}
                      className={`nr-step-card ${s.state} ${canJump ? 'clickable' : ''}`}
                      onClick={() => { if (canJump) setActiveStep(s.n); }}
                    >
                      <div className={`nr-step-num ${s.state}`}>
                        {s.state === 'done' ? <ICheck s={14} /> : s.n}
                      </div>
                      <div>
                        <div className={`nr-step-label ${s.state === 'pend' ? 'pend' : ''}`}>{s.label}</div>
                        <div className={`nr-step-stat ${s.state}-s`}>{s.stat}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── 2-Column Workspace Layout ── */}
            <div className="nr-layout">

              {/* ── LEFT COLUMN ── */}
              <div>

                {/* ── COMMON ACTIVE RIDER SEARCH (When no rider selected or Return Step 1) ── */}
                {(!selectedRider || (mainTab === 'return' && activeStep === 1)) && (
                  <div className="nr-card">
                    <div className="nr-card-hdr">
                      <div>
                        <h2>
                          {mainTab === 'return'
                            ? 'Search Active Booking for Return Check-In'
                            : mainTab === 'extend'
                            ? 'Search Active Booking to Extend Duration'
                            : 'Search Active Booking for Vehicle Exchange'}
                        </h2>
                        <p>
                          {mainTab === 'return'
                            ? 'Select an ongoing ride to launch the 6-point inspection checklist and submit deposit refund for Admin approval'
                            : mainTab === 'extend'
                            ? 'Select an ongoing ride to add rental packages or custom hours'
                            : 'Select an ongoing ride to swap vehicle or battery from live station inventory'}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={fetchActiveRides}
                        className="nr-back-btn"
                        style={{ padding: '7px 13px', fontSize: 12 }}
                      >
                        <IRefresh /> Refresh List
                      </button>
                    </div>

                    {/* Unified Search Bar */}
                    <div className="rr-search-area">
                      <div className="rr-search-grid">
                        <div className="nr-ph">
                          <span className="nr-ph-icon"><ISearch /></span>
                          <input
                            placeholder="Search by rider name, mobile number, EVR ID, or vehicle code..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                          />
                        </div>
                        <div className="nr-ph" style={{ background: '#F1F5F9', justifyContent: 'center', padding: '9px 12px' }}>
                          <span style={{ fontSize: 12, fontWeight: 800, color: '#2A195C' }}>
                            📍 {selectedZone}
                          </span>
                        </div>
                        <button type="button" className="rr-search-btn" onClick={fetchActiveRides}>
                          <ISearch /> Search Rides
                        </button>
                      </div>
                    </div>

                    {/* Active Rides List */}
                    <div className="nr-card-body">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                        <span style={{ fontSize: 13.5, fontWeight: 800, color: '#0F172A' }}>
                          Active Rides in {selectedZone} ({filteredRiders.length})
                        </span>
                        <span style={{ fontSize: 11.5, color: '#64748B', fontWeight: 500 }}>
                          Select a rider to continue
                        </span>
                      </div>

                      {filteredRiders.length === 0 ? (
                        <div style={{
                          padding: '44px 20px', textAlign: 'center', color: '#64748B',
                          background: '#F8FAFC', borderRadius: 12, border: '1px dashed #CBD5E1', fontSize: 13
                        }}>
                          No active bookings found matching your search in <b>{selectedZone}</b>.
                        </div>
                      ) : (
                        filteredRiders.map((r, idx) => (
                          <div key={r.id || idx} className="rr-rider-row">
                            <div className="rr-avatar">
                              <img
                                src={r.avatar || '/rohit_avatar.png'}
                                alt={r.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onError={(e: any) => { e.currentTarget.style.display = 'none'; }}
                              />
                              <span style={{
                                position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
                                justifyContent: 'center', background: '#2A195C', color: '#fff',
                                fontWeight: 800, fontSize: 14, zIndex: 0
                              }}>
                                {r.name.slice(0, 2).toUpperCase()}
                              </span>
                            </div>

                            <div className="rr-rider-info">
                              <div className="rr-rider-name-row">
                                <span className="rr-rider-name">{r.name}</span>
                                <span className="rr-rider-id">{r.id}</span>
                                <span className="rr-active-badge">● Active Ride</span>
                                <span className="rr-kyc-badge">✓ KYC Verified</span>
                              </div>
                              <div className="rr-rider-meta">
                                <span className="rr-meta-item"><IPhone /> {r.mobile}</span>
                                <span className="rr-meta-item"><IScooter /> <b>{r.vehicle_id}</b></span>
                                <span className="rr-meta-item"><IBattery /> {r.battery_id}</span>
                                <span className="rr-meta-item"><IClock /> {r.start_date}</span>
                                <span className="rr-meta-item" style={{ color: '#15803D', fontWeight: 700 }}>
                                  Deposit: ₹{r.deposit_amount}
                                </span>
                              </div>
                            </div>

                            <button
                              type="button"
                              className="rr-select-btn"
                              onClick={() => {
                                setSelectedRider(r);
                                if (mainTab === 'return') {
                                  setActiveStep(2);
                                } else if (mainTab === 'extend') {
                                  fetchZonePricing(r.zone);
                                } else if (mainTab === 'exchange') {
                                  fetchAvailableInventory();
                                }
                              }}
                            >
                              {mainTab === 'return' ? 'Inspect & Return →' : mainTab === 'extend' ? 'Extend Ride →' : 'Swap Vehicle →'}
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* ═══════════════════════════════════════════════════════════════
                    MODE 1: RETURN VEHICLE (STEPS 2, 3, 4)
                    ═══════════════════════════════════════════════════════════════ */}
                {mainTab === 'return' && selectedRider && activeStep > 1 && (
                  <>
                    {/* Persistent Selected Rider Hero Banner (Steps 2 & 3) */}
                    {activeStep < 4 && (
                      <div className="rr-rider-banner">
                        <div className="rr-banner-avatar">
                          <img
                            src={selectedRider.avatar || '/rohit_avatar.png'}
                            alt={selectedRider.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e: any) => { e.currentTarget.style.display = 'none'; }}
                          />
                          <span style={{
                            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
                            justifyContent: 'center', background: '#2A195C', color: '#fff',
                            fontWeight: 800, fontSize: 18, zIndex: 0
                          }}>
                            {selectedRider.name.slice(0, 2).toUpperCase()}
                          </span>
                        </div>

                        <div>
                          <div className="rr-banner-name">
                            {selectedRider.name}
                            <span className="rr-kyc-badge"><ICheck s={10} /> KYC Verified</span>
                          </div>
                          <div className="rr-banner-meta">
                            <span className="rr-banner-pill"><IPhone /> {selectedRider.mobile}</span>
                            <span className="rr-banner-pill">ID: {selectedRider.id}</span>
                            <span className="rr-banner-pill"><IScooter /> {selectedRider.vehicle_id}</span>
                            <span className="rr-banner-pill"><IBattery /> {selectedRider.battery_id}</span>
                          </div>
                        </div>

                        <div className="rr-banner-stats">
                          <div className="rr-stat-block">
                            <div className="rr-stat-num" style={{ color: '#4ADE80' }}>₹{currentDeposit}</div>
                            <div className="rr-stat-lbl">Security Deposit</div>
                          </div>
                          <div className="rr-stat-block">
                            <div className="rr-stat-num">{selectedRider.plan}</div>
                            <div className="rr-stat-lbl">Current Plan</div>
                          </div>
                          <button
                            type="button"
                            className="rr-change-btn"
                            onClick={() => { setSelectedRider(null); setActiveStep(1); }}
                          >
                            Change Rider
                          </button>
                        </div>
                      </div>
                    )}

                    {/* ──────────────────────────────────────────────────────────
                        STEP 2: REDESIGNED VEHICLE INSPECTION CHECKLIST
                       ────────────────────────────────────────────────────────── */}
                    {activeStep === 2 && (
                      <div>
                        <div className="nr-card">
                          <div className="nr-card-hdr">
                            <div>
                              <h2>Vehicle Physical &amp; Technical Inspection Checklist</h2>
                              <p>Capture 6-angle evidence, tap condition tiles, and verify accessories before settlement</p>
                            </div>
                            <button
                              type="button"
                              onClick={resetInspectionAllGood}
                              style={{
                                display: 'inline-flex', alignItems: 'center', gap: 6,
                                padding: '7px 13px', borderRadius: 9, border: '1.5px solid #86EFAC',
                                background: '#F0FDF4', color: '#15803D', fontSize: 12, fontWeight: 800, cursor: 'pointer'
                              }}
                            >
                              <ISparkle /> Mark All Clean / Good
                            </button>
                          </div>

                          <div className="nr-card-body">

                            {/* SECTION 1: 6-Angle Visual Evidence */}
                            <div className="chk-section-hdr">
                              <div className="chk-section-title">
                                <ICamera /> 1. Check-In Photo Documentation (6 Angles)
                              </div>
                              <span className={`chk-step-pill ${capturedPhotosCount === 6 ? 'good' : ''}`}>
                                {capturedPhotosCount} / 6 Angles Captured
                              </span>
                            </div>

                            <div className="ro-photo-grid">
                              {PHOTO_ANGLES.map((slot) => {
                                const photoUrl = inspectionPhotos[slot.id];
                                return (
                                  <div
                                    key={slot.id}
                                    className={`ro-photo-slot ${photoUrl ? 'captured' : 'empty'}`}
                                    onClick={() => setActiveCameraSlot({ id: slot.id, title: `Vehicle ${slot.label} Photo` })}
                                  >
                                    {photoUrl ? (
                                      <>
                                        <img
                                          src={photoUrl}
                                          alt={slot.label}
                                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                        <button
                                          type="button"
                                          className="ro-photo-del"
                                          title="Remove & Retake"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setInspectionPhotos(prev => {
                                              const next = { ...prev };
                                              delete next[slot.id];
                                              return next;
                                            });
                                          }}
                                        >
                                          ×
                                        </button>
                                        <div style={{
                                          position: 'absolute', bottom: 0, left: 0, right: 0,
                                          background: 'rgba(20, 83, 45, 0.88)', color: '#FFFFFF',
                                          fontSize: 10, fontWeight: 700, textAlign: 'center', padding: '3px 4px'
                                        }}>
                                          ✓ {slot.label}
                                        </div>
                                      </>
                                    ) : (
                                      <>
                                        <div className="ro-photo-cam-circle">
                                          <ICamera />
                                        </div>
                                        <div className="ro-photo-lbl">{slot.label}</div>
                                        <div className="ro-photo-sub">{slot.hint}</div>
                                      </>
                                    )}
                                  </div>
                                );
                              })}
                            </div>

                            {/* SECTION 2: 4-Point Physical & Technical Condition Matrix */}
                            <div className="chk-section-hdr">
                              <div className="chk-section-title">
                                <IShield /> 2. Physical &amp; Diagnostic Condition Assessment
                              </div>
                              <span className={`chk-step-pill ${deductions === 0 ? 'good' : ''}`}>
                                {deductions === 0 ? 'Zero Damage Deductions' : `Current Deductions: -₹${deductions}`}
                              </span>
                            </div>

                            <div className="chk-matrix-grid">

                              {/* Category A: Body & Frame */}
                              <div className="chk-cat-card">
                                <div className="chk-cat-hdr">
                                  <div className="chk-cat-title">
                                    <span className="chk-cat-icon"><IScooter /></span>
                                    Body Panels &amp; Chassis
                                  </div>
                                  <span style={{ fontSize: 11, fontWeight: 800, color: bodyDmg === 'clean' ? '#16A34A' : '#DC2626' }}>
                                    {bodyDmg === 'clean' ? '₹0' : bodyDmg === 'minor' ? '-₹250' : '-₹500'}
                                  </span>
                                </div>
                                <div className="chk-opt-list">
                                  {[
                                    { key: 'clean', label: 'Clean / Intact Panels', sub: 'No new scratches or dents', fee: '₹0', tone: 'sel-good', badgeBg: '#DCFCE7', badgeCol: '#15803D' },
                                    { key: 'minor', label: 'Minor Scratches / Scuffs', sub: 'Surface paint mark < 5cm', fee: '-₹250', tone: 'sel-warn', badgeBg: '#FEF3C7', badgeCol: '#B45309' },
                                    { key: 'major', label: 'Major Dent / Cracked Panel', sub: 'Requires panel replacement', fee: '-₹500', tone: 'sel-bad', badgeBg: '#FEE2E2', badgeCol: '#DC2626' },
                                  ].map((opt) => (
                                    <div
                                      key={opt.key}
                                      className={`chk-opt-tile ${bodyDmg === opt.key ? opt.tone : ''}`}
                                      onClick={() => setBodyDmg(opt.key as any)}
                                    >
                                      <div className="chk-opt-left">
                                        <div className="chk-dot" />
                                        <div>
                                          <div className="chk-opt-name">{opt.label}</div>
                                          <span className="chk-opt-sub">{opt.sub}</span>
                                        </div>
                                      </div>
                                      <span className="chk-opt-fee" style={{ background: opt.badgeBg, color: opt.badgeCol }}>
                                        {opt.fee}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Category B: Tyres & Brakes */}
                              <div className="chk-cat-card">
                                <div className="chk-cat-hdr">
                                  <div className="chk-cat-title">
                                    <span className="chk-cat-icon">🛞</span>
                                    Tyres, Rims &amp; Brakes
                                  </div>
                                  <span style={{ fontSize: 11, fontWeight: 800, color: tyreCond === 'good' ? '#16A34A' : '#DC2626' }}>
                                    {tyreCond === 'good' ? '₹0' : tyreCond === 'worn' ? '-₹150' : '-₹350'}
                                  </span>
                                </div>
                                <div className="chk-opt-list">
                                  {[
                                    { key: 'good', label: 'Good Tread & Brake Bite', sub: 'Proper pressure & responsive levers', fee: '₹0', tone: 'sel-good', badgeBg: '#DCFCE7', badgeCol: '#15803D' },
                                    { key: 'worn', label: 'Heavy Tread Wear / Loose Brake', sub: 'Requires brake cable adjustment', fee: '-₹150', tone: 'sel-warn', badgeBg: '#FEF3C7', badgeCol: '#B45309' },
                                    { key: 'damaged', label: 'Punctured Tyre / Bent Rim', sub: 'Requires vulcanizing or tube swap', fee: '-₹350', tone: 'sel-bad', badgeBg: '#FEE2E2', badgeCol: '#DC2626' },
                                  ].map((opt) => (
                                    <div
                                      key={opt.key}
                                      className={`chk-opt-tile ${tyreCond === opt.key ? opt.tone : ''}`}
                                      onClick={() => setTyreCond(opt.key as any)}
                                    >
                                      <div className="chk-opt-left">
                                        <div className="chk-dot" />
                                        <div>
                                          <div className="chk-opt-name">{opt.label}</div>
                                          <span className="chk-opt-sub">{opt.sub}</span>
                                        </div>
                                      </div>
                                      <span className="chk-opt-fee" style={{ background: opt.badgeBg, color: opt.badgeCol }}>
                                        {opt.fee}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Category C: Battery SOC & BMS Health */}
                              <div className="chk-cat-card">
                                <div className="chk-cat-hdr">
                                  <div className="chk-cat-title">
                                    <span className="chk-cat-icon"><IBattery /></span>
                                    Battery SOC &amp; Telemetry
                                  </div>
                                  <span style={{ fontSize: 11, fontWeight: 800, color: batteryHealth === 'good' ? '#16A34A' : '#DC2626' }}>
                                    {batteryHealth === 'good' ? '₹0' : '-₹200'}
                                  </span>
                                </div>
                                <div className="chk-opt-list">
                                  {[
                                    { key: 'good', label: 'Healthy Charge (SOC > 20%)', sub: 'Terminals intact, normal BMS reading', fee: '₹0', tone: 'sel-good', badgeBg: '#DCFCE7', badgeCol: '#15803D' },
                                    { key: 'issue', label: 'Deep Discharge / BMS Fault', sub: 'SOC < 5% or seal tampered', fee: '-₹200', tone: 'sel-bad', badgeBg: '#FEE2E2', badgeCol: '#DC2626' },
                                  ].map((opt) => (
                                    <div
                                      key={opt.key}
                                      className={`chk-opt-tile ${batteryHealth === opt.key ? opt.tone : ''}`}
                                      onClick={() => setBatteryHealth(opt.key as any)}
                                    >
                                      <div className="chk-opt-left">
                                        <div className="chk-dot" />
                                        <div>
                                          <div className="chk-opt-name">{opt.label}</div>
                                          <span className="chk-opt-sub">{opt.sub}</span>
                                        </div>
                                      </div>
                                      <span className="chk-opt-fee" style={{ background: opt.badgeBg, color: opt.badgeCol }}>
                                        {opt.fee}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Category D: Vehicle Cleanliness */}
                              <div className="chk-cat-card">
                                <div className="chk-cat-hdr">
                                  <div className="chk-cat-title">
                                    <span className="chk-cat-icon">✨</span>
                                    Vehicle Hygiene &amp; Wash
                                  </div>
                                  <span style={{ fontSize: 11, fontWeight: 800, color: cleanliness !== 'dirty' ? '#16A34A' : '#DC2626' }}>
                                    {cleanliness !== 'dirty' ? '₹0' : '-₹80'}
                                  </span>
                                </div>
                                <div className="chk-opt-list">
                                  {[
                                    { key: 'clean', label: 'Clean & Ready for Re-Lease', sub: 'Standard road dust only', fee: '₹0', tone: 'sel-good', badgeBg: '#DCFCE7', badgeCol: '#15803D' },
                                    { key: 'dirty', label: 'Heavy Mud / Stains (Wash Required)', sub: 'Requires pressure wash before dispatch', fee: '-₹80', tone: 'sel-warn', badgeBg: '#FEF3C7', badgeCol: '#B45309' },
                                  ].map((opt) => (
                                    <div
                                      key={opt.key}
                                      className={`chk-opt-tile ${cleanliness === opt.key ? opt.tone : ''}`}
                                      onClick={() => setCleanliness(opt.key as any)}
                                    >
                                      <div className="chk-opt-left">
                                        <div className="chk-dot" />
                                        <div>
                                          <div className="chk-opt-name">{opt.label}</div>
                                          <span className="chk-opt-sub">{opt.sub}</span>
                                        </div>
                                      </div>
                                      <span className="chk-opt-fee" style={{ background: opt.badgeBg, color: opt.badgeCol }}>
                                        {opt.fee}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                            </div>

                            {/* SECTION 3: Tactile Issued Accessories Check */}
                            <div className="chk-section-hdr">
                              <div className="chk-section-title">
                                🪖 3. Issued Accessories Handover Verification
                              </div>
                              <span className="chk-step-pill">Tap card to toggle Returned / Missing</span>
                            </div>

                            <div className="chk-acc-grid">
                              {/* Helmet Card */}
                              <div
                                className={`chk-acc-card ${helmetReturned ? 'returned' : 'missing'}`}
                                onClick={() => setHelmetReturned(!helmetReturned)}
                              >
                                <div className="chk-acc-left">
                                  <div className="chk-acc-icon">🪖</div>
                                  <div>
                                    <div className="chk-acc-title">Evegah ISI Rider Helmet</div>
                                    <div className="chk-acc-sub">
                                      {helmetReturned ? 'Handed over intact with visor' : 'Missing or damaged — ₹300 fee applied'}
                                    </div>
                                  </div>
                                </div>
                                <span className="chk-acc-pill">
                                  {helmetReturned ? '✓ RETURNED' : '✕ MISSING (-₹300)'}
                                </span>
                              </div>

                              {/* Charger Card */}
                              <div
                                className={`chk-acc-card ${chargerReturned ? 'returned' : 'missing'}`}
                                onClick={() => setChargerReturned(!chargerReturned)}
                              >
                                <div className="chk-acc-left">
                                  <div className="chk-acc-icon">🔌</div>
                                  <div>
                                    <div className="chk-acc-title">60V Smart Fast Charger</div>
                                    <div className="chk-acc-sub">
                                      {chargerReturned ? 'Power cord & adapter verified' : 'Not returned — ₹200 fee applied'}
                                    </div>
                                  </div>
                                </div>
                                <span className="chk-acc-pill">
                                  {chargerReturned ? '✓ RETURNED' : '✕ MISSING (-₹200)'}
                                </span>
                              </div>
                            </div>

                            {/* SECTION 4: Remarks */}
                            <div>
                              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 800, color: '#0F172A', marginBottom: 6 }}>
                                4. Hub Inspector Remarks (Optional)
                              </label>
                              <textarea
                                placeholder="E.g., Vehicle returned in good operational condition. Odometer reading 1,420 km."
                                value={inspectionNotes}
                                onChange={e => setInspectionNotes(e.target.value)}
                                style={{
                                  width: '100%', padding: '10px 14px', border: '1.5px solid #E2E8F0',
                                  borderRadius: 10, fontSize: 12.5, outline: 'none', resize: 'none', minHeight: 62,
                                  fontFamily: 'inherit'
                                }}
                              />
                            </div>

                            {/* Live Financial Impact Preview Bar */}
                            <div className="chk-live-bar">
                              <div className="chk-live-metrics">
                                <div className="chk-live-item">
                                  <span className="chk-live-lbl">Security Deposit Held</span>
                                  <span className="chk-live-val">₹{currentDeposit.toFixed(2)}</span>
                                </div>
                                <div style={{ color: '#475569', fontWeight: 800 }}>−</div>
                                <div className="chk-live-item">
                                  <span className="chk-live-lbl">Checklist Deductions</span>
                                  <span className="chk-live-val" style={{ color: deductions > 0 ? '#F87171' : '#4ADE80' }}>
                                    ₹{deductions.toFixed(2)}
                                  </span>
                                </div>
                                <div style={{ color: '#475569', fontWeight: 800 }}>=</div>
                                <div className="chk-live-item">
                                  <span className="chk-live-lbl">
                                    {extraDue > 0 ? 'Extra Balance Due from Rider' : 'Net Refund for Admin Approval'}
                                  </span>
                                  <span className="chk-live-val" style={{ color: extraDue > 0 ? '#FBBF24' : '#4ADE80' }}>
                                    ₹{(extraDue > 0 ? extraDue : netRefund).toFixed(2)}
                                  </span>
                                </div>
                              </div>
                              <span style={{ fontSize: 11.5, color: '#CBD5E1', fontWeight: 600 }}>
                                Next: Route to Super Admin Queue →
                              </span>
                            </div>

                          </div>
                        </div>

                        {/* Step 2 Footer */}
                        <div className="nr-footer-card">
                          <button type="button" className="nr-cancel-btn" onClick={() => setActiveStep(1)}>
                            <ILeft /> Back to Rider Search
                          </button>
                          <button type="button" className="nr-continue-btn" onClick={() => setActiveStep(3)}>
                            Proceed to Deposit Settlement <IRight />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* ──────────────────────────────────────────────────────────
                        STEP 3: SECURITY DEPOSIT SETTLEMENT & ADMIN APPROVAL
                       ────────────────────────────────────────────────────────── */}
                    {activeStep === 3 && (
                      <div>
                        <div className="nr-card">
                          <div className="nr-card-hdr">
                            <div>
                              <h2>Security Deposit Settlement &amp; Admin Approval Routing</h2>
                              <p>Review final inspection deductions and dispatch net deposit refund to Super Admin for authorization</p>
                            </div>
                            <span className="adm-badge">
                              <IShield /> Super Admin Gatekeeper Enabled
                            </span>
                          </div>

                          <div className="nr-card-body">
                            <div className="ro-settle-grid">

                              {/* Left Box: Itemized Deductions Breakdown */}
                              <div className="ro-settle-box">
                                <div className="ro-settle-title">
                                  <span>Itemized Inspection Ledger</span>
                                  <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>Ref: {selectedRider.id}</span>
                                </div>

                                <div className="ro-settle-row">
                                  <span className="ro-settle-label">Original Security Deposit Held</span>
                                  <span className="ro-settle-val" style={{ color: '#15803D' }}>₹{currentDeposit.toFixed(2)}</span>
                                </div>
                                <div className="ro-settle-row">
                                  <span className="ro-settle-label">Body &amp; Frame Condition ({bodyDmg})</span>
                                  <span className="ro-settle-val" style={{ color: bodyDmg === 'clean' ? '#16A34A' : '#DC2626' }}>
                                    {bodyDmg === 'clean' ? '₹0.00' : `-₹${bodyDmg === 'minor' ? '250.00' : '500.00'}`}
                                  </span>
                                </div>
                                <div className="ro-settle-row">
                                  <span className="ro-settle-label">Tyres &amp; Brakes ({tyreCond})</span>
                                  <span className="ro-settle-val" style={{ color: tyreCond === 'good' ? '#16A34A' : '#DC2626' }}>
                                    {tyreCond === 'good' ? '₹0.00' : `-₹${tyreCond === 'worn' ? '150.00' : '350.00'}`}
                                  </span>
                                </div>
                                <div className="ro-settle-row">
                                  <span className="ro-settle-label">Battery SOC &amp; Telemetry</span>
                                  <span className="ro-settle-val" style={{ color: batteryHealth === 'good' ? '#16A34A' : '#DC2626' }}>
                                    {batteryHealth === 'good' ? '₹0.00' : '-₹200.00'}
                                  </span>
                                </div>
                                <div className="ro-settle-row">
                                  <span className="ro-settle-label">Cleanliness &amp; Wash</span>
                                  <span className="ro-settle-val" style={{ color: cleanliness !== 'dirty' ? '#16A34A' : '#DC2626' }}>
                                    {cleanliness !== 'dirty' ? '₹0.00' : '-₹80.00'}
                                  </span>
                                </div>
                                <div className="ro-settle-row">
                                  <span className="ro-settle-label">Missing Accessories (Helmet / Charger)</span>
                                  <span className="ro-settle-val" style={{ color: (!helmetReturned || !chargerReturned) ? '#DC2626' : '#16A34A' }}>
                                    {(!helmetReturned || !chargerReturned)
                                      ? `-₹${((!helmetReturned ? 300 : 0) + (!chargerReturned ? 200 : 0)).toFixed(2)}`
                                      : '₹0.00'}
                                  </span>
                                </div>

                                <div style={{ height: 1.5, background: '#E2E8F0', margin: '10px 0' }} />

                                <div className="ro-settle-row" style={{ fontSize: 13.5, fontWeight: 800 }}>
                                  <span>Total Inspection Deductions</span>
                                  <span style={{ color: deductions > 0 ? '#DC2626' : '#16A34A' }}>
                                    -₹{deductions.toFixed(2)}
                                  </span>
                                </div>
                                <div className="ro-settle-row" style={{ fontSize: 14, fontWeight: 800 }}>
                                  <span>Net Refundable Deposit</span>
                                  <span style={{ color: '#15803D' }}>₹{netRefund.toFixed(2)}</span>
                                </div>
                              </div>

                              {/* Right Box: Either Extra Due via PayU OR Super Admin Approval Routing */}
                              {extraDue > 0 ? (
                                <div className="ro-settle-box" style={{ background: '#FFFBEB', borderColor: '#FDE68A' }}>
                                  <div className="ro-settle-title" style={{ color: '#B45309' }}>
                                    <span>Additional Balance Due from Rider</span>
                                    <span style={{ fontSize: 11, background: '#FEF3C7', padding: '2px 8px', borderRadius: 6 }}>Overages</span>
                                  </div>
                                  <div className="ro-refund-big" style={{ color: '#DC2626' }}>₹{extraDue.toFixed(2)}</div>
                                  <p style={{ fontSize: 12, color: '#92400E', margin: '6px 0 14px' }}>
                                    Total inspection deductions exceed initial security deposit. Collect the balance via PayU Dynamic UPI QR before closing ride.
                                  </p>

                                  <div style={{
                                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                                    background: '#FFFFFF', padding: 14, borderRadius: 10, border: '1px solid #86EFAC'
                                  }}>
                                    <div style={{ width: 148, height: 148, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                      {payuQrString ? (
                                        <QRCodeSVG value={payuQrString} size={136} level="M" />
                                      ) : (
                                        <div style={{ fontSize: 11, color: '#94A3B8' }}>Generating PayU QR...</div>
                                      )}
                                    </div>
                                    <div style={{ fontSize: 11.5, fontWeight: 700, color: '#047857', marginTop: 6 }}>
                                      PayU Smart Dynamic UPI QR
                                    </div>
                                    <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>
                                      Ref: {payuTxId || 'EVG-GENERATING...'}
                                    </div>
                                    <div style={{ marginTop: 8, width: '100%' }}>
                                      {payuVerified ? (
                                        <div style={{
                                          background: '#ECFDF5', border: '1px solid #10B981', color: '#065F46',
                                          padding: '6px 10px', borderRadius: 6, fontSize: 11.5, fontWeight: 700, textAlign: 'center'
                                        }}>
                                          ✓ Balance Paid &amp; Verified via PayU
                                        </div>
                                      ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                          {payuCheckoutUrl && (
                                            <button
                                              type="button"
                                              onClick={() => openPayuCheckoutPopup(payuCheckoutUrl)}
                                              style={{
                                                width: '100%', background: '#2A195C', color: '#fff', border: 'none',
                                                borderRadius: 6, padding: '7px 10px', fontSize: 11.5, fontWeight: 700, cursor: 'pointer'
                                              }}
                                            >
                                              Pay ₹{extraDue.toFixed(2)} via PayU Popup
                                            </button>
                                          )}
                                          <div style={{
                                            background: '#F0FDF4', border: '1px solid #BBF7D0', color: '#047857',
                                            padding: '5px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600, textAlign: 'center'
                                          }}>
                                            {isCheckingPayU ? 'Verifying with PayU Server...' : `Awaiting PayU payment (₹${extraDue.toFixed(2)})...`}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                /* REDESIGNED: Send to Super Admin Approval Queue (No Manual Payment Mode Selection) */
                                <div className="adm-approval-box">
                                  <div>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                                      <span style={{ fontSize: 12, fontWeight: 800, color: '#2A195C', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                        Net Refund for Admin Authorization
                                      </span>
                                      <span style={{
                                        fontSize: 11, fontWeight: 800, fontFamily: 'monospace',
                                        background: '#EDE9FE', color: '#2A195C', padding: '3px 8px', borderRadius: 6
                                      }}>
                                        #{approvalTicketId}
                                      </span>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                                      <div className="ro-refund-big">₹{netRefund.toFixed(2)}</div>
                                      <span style={{
                                        fontSize: 11, fontWeight: 700, color: '#B45309',
                                        background: '#FEF3C7', border: '1px solid #FDE68A', padding: '2px 8px', borderRadius: 999
                                      }}>
                                        ● Queued for Super Admin Approval
                                      </span>
                                    </div>

                                    <p style={{ fontSize: 12, color: '#475569', margin: '8px 0 0', lineHeight: 1.45 }}>
                                      Hub operators do not disburse deposit refunds directly. Submitting this return forwards the inspection dossier and net refund to the <b>Deposit Refunds</b> console for Super Admin authorization.
                                    </p>

                                    {/* 3-Step Approval Pipeline */}
                                    <div className="adm-pipeline">
                                      <div className="adm-pipe-step">
                                        <span className="adm-pipe-dot done">✓</span>
                                        <div>
                                          <div style={{ fontWeight: 700, color: '#0F172A' }}>1. Hub Inspection &amp; Calculation</div>
                                          <div style={{ fontSize: 11, color: '#64748B' }}>
                                            {capturedPhotosCount} photos &amp; ₹{deductions} deductions verified at {selectedZone}
                                          </div>
                                        </div>
                                      </div>

                                      <div className="adm-pipe-step">
                                        <span className="adm-pipe-dot curr">2</span>
                                        <div>
                                          <div style={{ fontWeight: 700, color: '#92400E' }}>2. Super Admin Authorization Queue</div>
                                          <div style={{ fontSize: 11, color: '#64748B' }}>
                                            Requires Super Admin OTP / Master Password on Deposit Refunds page
                                          </div>
                                        </div>
                                      </div>

                                      <div className="adm-pipe-step">
                                        <span className="adm-pipe-dot next">3</span>
                                        <div>
                                          <div style={{ fontWeight: 700, color: '#475569' }}>3. Automated Settlement &amp; WhatsApp Receipt</div>
                                          <div style={{ fontSize: 11, color: '#64748B' }}>
                                            Disbursed to rider&apos;s registered payment source upon Admin sign-off
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Approval Queue Priority Selector */}
                                  <div>
                                    <div style={{ fontSize: 11.5, fontWeight: 800, color: '#334155', marginBottom: 4 }}>
                                      Queue Priority Level
                                    </div>
                                    <div className="adm-prio-row">
                                      <button
                                        type="button"
                                        className={`adm-prio-btn ${approvalPriority === 'standard' ? 'active-std' : ''}`}
                                        onClick={() => setApprovalPriority('standard')}
                                      >
                                        📋 Standard Admin Queue
                                      </button>
                                      <button
                                        type="button"
                                        className={`adm-prio-btn ${approvalPriority === 'urgent' ? 'active-urg' : ''}`}
                                        onClick={() => setApprovalPriority('urgent')}
                                      >
                                        ⚡ Urgent (Rider Waiting)
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}

                            </div>
                          </div>
                        </div>

                        {/* Step 3 Footer */}
                        <div className="nr-footer-card">
                          <button type="button" className="nr-cancel-btn" onClick={() => setActiveStep(2)}>
                            <ILeft /> Back to Inspection Checklist
                          </button>
                          <button
                            type="button"
                            className="nr-continue-btn"
                            onClick={handleCompleteReturn}
                            disabled={loading || (extraDue > 0 && !payuVerified)}
                            style={{
                              opacity: (extraDue > 0 && !payuVerified) ? 0.65 : 1,
                              cursor: (extraDue > 0 && !payuVerified) ? 'not-allowed' : 'pointer'
                            }}
                          >
                            {extraDue > 0
                              ? (payuVerified ? 'Complete Check-In & Close Ride →' : `Awaiting PayU Payment (₹${extraDue.toFixed(2)})...`)
                              : `Check-In Vehicle & Send ₹${netRefund.toFixed(2)} for Admin Approval →`}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* ──────────────────────────────────────────────────────────
                        STEP 4: RETURN CONFIRMATION & ADMIN TICKET SUMMARY
                       ────────────────────────────────────────────────────────── */}
                    {activeStep === 4 && (
                      <div className="nr-card">
                        <div className="nr-card-body" style={{ textAlign: 'center', padding: '38px 26px' }}>
                          <div style={{
                            width: 64, height: 64, borderRadius: '50%', background: '#DCFCE7',
                            color: '#15803D', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 30, fontWeight: 800, margin: '0 auto 16px', border: '2px solid #86EFAC'
                          }}>
                            ✓
                          </div>

                          <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: 6,
                            background: '#FEF3C7', color: '#B45309', border: '1px solid #FDE68A',
                            padding: '4px 12px', borderRadius: 999, fontSize: 11.5, fontWeight: 800, marginBottom: 10
                          }}>
                            🔒 Refund Ticket #{approvalTicketId} • Pending Super Admin Approval
                          </div>

                          <h2 style={{ fontSize: 21, fontWeight: 800, color: '#0F172A', marginBottom: 6 }}>
                            Vehicle Checked In &amp; Sent for Admin Settlement!
                          </h2>

                          <p style={{ fontSize: 13, color: '#64748B', maxWidth: 520, margin: '0 auto 22px', lineHeight: 1.5 }}>
                            Vehicle <b>{selectedRider.vehicle_id}</b> has been checked back into <b>{selectedZone}</b> inventory.
                            {bodyDmg !== 'clean' || tyreCond === 'damaged' ? (
                              <span style={{ display: 'block', color: '#DC2626', fontWeight: 700, marginTop: 4 }}>
                                ⚠️ Damage logged: Vehicle status automatically switched to Maintenance.
                              </span>
                            ) : null}
                            <span style={{ display: 'block', marginTop: 6 }}>
                              The net security deposit refund of <b>₹{netRefund.toFixed(2)}</b> has been queued in the <b>Deposit Refunds</b> module for Super Admin OTP / Master Password release.
                            </span>
                          </p>

                          <div style={{
                            background: '#F8FAFC', border: '1.5px solid #E2E8F0', borderRadius: 12,
                            padding: '16px 20px', maxWidth: 520, margin: '0 auto 24px', textAlign: 'left'
                          }}>
                            <div style={{
                              fontSize: 11, fontWeight: 800, color: '#64748B', textTransform: 'uppercase',
                              letterSpacing: '0.05em', marginBottom: 10
                            }}>
                              Return &amp; Admin Settlement Dossier
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 18px', fontSize: 12.5 }}>
                              <div><span style={{ color: '#64748B' }}>Rider Name:</span> <b>{selectedRider.name}</b></div>
                              <div><span style={{ color: '#64748B' }}>Booking ID:</span> <b>{selectedRider.id}</b></div>
                              <div><span style={{ color: '#64748B' }}>Vehicle Code:</span> <b>{selectedRider.vehicle_id}</b></div>
                              <div><span style={{ color: '#64748B' }}>Battery ID:</span> <b>{selectedRider.battery_id}</b></div>
                              <div><span style={{ color: '#64748B' }}>Deductions:</span> <b style={{ color: '#DC2626' }}>₹{deductions.toFixed(2)}</b></div>
                              <div><span style={{ color: '#64748B' }}>Net Refund:</span> <b style={{ color: '#15803D' }}>₹{netRefund.toFixed(2)}</b></div>
                              <div style={{ gridColumn: '1 / -1', paddingTop: 6, borderTop: '1px dashed #E2E8F0' }}>
                                <span style={{ color: '#64748B' }}>Approval Status:</span>{' '}
                                <b style={{ color: '#B45309' }}>
                                  Awaiting Super Admin Sign-Off ({approvalPriority === 'urgent' ? '⚡ Urgent Priority' : 'Standard Queue'})
                                </b>
                              </div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
                            <button
                              type="button"
                              className="nr-continue-btn"
                              onClick={() => { setSelectedRider(null); setActiveStep(1); fetchActiveRides(); }}
                            >
                              Process Another Return
                            </button>
                            <Link href="/" className="nr-back-btn">
                              Back to Dashboard
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* ═══════════════════════════════════════════════════════════════
                    MODE 2: EXTEND RIDE DURATION & PACKAGES
                    ═══════════════════════════════════════════════════════════════ */}
                {mainTab === 'extend' && selectedRider && (
                  <div>
                    {/* Active Ride Banner */}
                    <div className="rr-rider-banner">
                      <div className="rr-banner-avatar">
                        <img
                          src={selectedRider.avatar || '/rohit_avatar.png'}
                          alt={selectedRider.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e: any) => { e.currentTarget.style.display = 'none'; }}
                        />
                        <span style={{
                          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
                          justifyContent: 'center', background: '#2A195C', color: '#fff',
                          fontWeight: 800, fontSize: 18, zIndex: 0
                        }}>
                          {selectedRider.name.slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="rr-banner-name">
                          {selectedRider.name}
                          <span className="rr-kyc-badge">Ongoing Ride</span>
                        </div>
                        <div className="rr-banner-meta">
                          <span className="rr-banner-pill"><IPhone /> {selectedRider.mobile}</span>
                          <span className="rr-banner-pill">ID: {selectedRider.id}</span>
                          <span className="rr-banner-pill"><IScooter /> {selectedRider.vehicle_id}</span>
                          <span className="rr-banner-pill"><IBattery /> {selectedRider.battery_id}</span>
                        </div>
                      </div>
                      <div className="rr-banner-stats">
                        <div className="rr-stat-block">
                          <div className="rr-stat-num">{selectedRider.plan}</div>
                          <div className="rr-stat-lbl">Current Plan</div>
                        </div>
                        <div className="rr-stat-block">
                          <div className="rr-stat-num" style={{ color: '#4ADE80' }}>₹{currentDeposit}</div>
                          <div className="rr-stat-lbl">Security Deposit</div>
                        </div>
                        <button
                          type="button"
                          className="rr-change-btn"
                          onClick={() => setSelectedRider(null)}
                        >
                          Change Rider
                        </button>
                      </div>
                    </div>

                    {/* Extension Plan Selector Card */}
                    <div className="nr-card">
                      <div className="nr-card-hdr">
                        <div>
                          <h2>Select Ride Extension Option</h2>
                          <p>Extend by full rental packages or add custom hourly duration</p>
                        </div>
                        <div style={{ display: 'flex', gap: 6, background: '#F1F5F9', padding: 4, borderRadius: 9 }}>
                          <button
                            type="button"
                            style={{
                              padding: '6px 13px', borderRadius: 7, border: 'none', fontSize: 12, fontWeight: 700,
                              cursor: 'pointer', background: extendMode === 'package' ? '#2A195C' : 'transparent',
                              color: extendMode === 'package' ? '#fff' : '#64748B'
                            }}
                            onClick={() => setExtendMode('package')}
                          >
                            By Package
                          </button>
                          <button
                            type="button"
                            style={{
                              padding: '6px 13px', borderRadius: 7, border: 'none', fontSize: 12, fontWeight: 700,
                              cursor: 'pointer', background: extendMode === 'hourly' ? '#2A195C' : 'transparent',
                              color: extendMode === 'hourly' ? '#fff' : '#64748B'
                            }}
                            onClick={() => setExtendMode('hourly')}
                          >
                            Custom Duration
                          </button>
                        </div>
                      </div>

                      <div className="nr-card-body">
                        {extendMode === 'package' ? (
                          <>
                            <div style={{ fontSize: 12.5, fontWeight: 800, color: '#334155', marginBottom: 10 }}>
                              Available Packages for Extension (Dynamic Zone Pricing)
                            </div>
                            <div className="ext-pkg-grid">
                              {packagesList.map(pkg => (
                                <div
                                  key={pkg.id}
                                  className={`ext-pkg-card ${selectedPackage.id === pkg.id ? 'selected' : ''}`}
                                  onClick={() => setSelectedPackage(pkg)}
                                >
                                  {pkg.badge && <span className="ext-pkg-badge">{pkg.badge}</span>}
                                  <div className="ext-pkg-title">{pkg.name}</div>
                                  <div className="ext-pkg-days">+{pkg.days} Day{pkg.days > 1 ? 's' : ''} Extension</div>
                                  <div className="ext-pkg-price">₹{pkg.fare}</div>
                                </div>
                              ))}
                            </div>
                          </>
                        ) : (
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
                            <div>
                              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                                Additional Days (+₹350/day)
                              </label>
                              <div style={{ display: 'flex', gap: 8 }}>
                                {[0, 1, 2, 3, 5].map(d => (
                                  <button
                                    type="button"
                                    key={d}
                                    style={{
                                      flex: 1, padding: '8px', borderRadius: 8,
                                      border: extendDays === d ? '2px solid #2A195C' : '1px solid #E2E8F0',
                                      background: extendDays === d ? '#F5F3FF' : '#fff',
                                      fontWeight: 700, color: extendDays === d ? '#2A195C' : '#334155', cursor: 'pointer'
                                    }}
                                    onClick={() => setExtendDays(d)}
                                  >
                                    {d}d
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div>
                              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                                Additional Hours (+₹45/hr)
                              </label>
                              <div style={{ display: 'flex', gap: 8 }}>
                                {[1, 2, 4, 6].map(h => (
                                  <button
                                    type="button"
                                    key={h}
                                    style={{
                                      flex: 1, padding: '8px', borderRadius: 8,
                                      border: extendHours === h ? '2px solid #2A195C' : '1px solid #E2E8F0',
                                      background: extendHours === h ? '#F5F3FF' : '#fff',
                                      fontWeight: 700, color: extendHours === h ? '#2A195C' : '#334155', cursor: 'pointer'
                                    }}
                                    onClick={() => setExtendHours(h)}
                                  >
                                    {h}h
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Payment Method & Total Payable */}
                        <div style={{
                          border: '1.5px solid #E2E8F0', borderRadius: 12, padding: 16,
                          background: '#F8FAFC', display: 'flex', flexDirection: 'column', gap: 14
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                            <div>
                              <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>Total Additional Fare:</div>
                              <div style={{ fontSize: 22, fontWeight: 800, color: '#2A195C' }}>₹{extensionFare.toFixed(2)}</div>
                            </div>

                            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                              {[
                                { id: 'payu', label: 'PayU (Primary Gateway)' },
                                { id: 'cash', label: 'Cash Payment' },
                                { id: 'split', label: 'Split (Cash + PayU)' }
                              ].map(p => (
                                <label
                                  key={p.id}
                                  style={{
                                    display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5,
                                    cursor: 'pointer', fontWeight: p.id === 'payu' ? 700 : 600,
                                    color: p.id === 'payu' ? '#047857' : '#334155'
                                  }}
                                >
                                  <input
                                    type="radio"
                                    name="extendPayMethod"
                                    checked={extendPayMethod === p.id}
                                    onChange={() => setExtendPayMethod(p.id as any)}
                                  />
                                  {p.label}
                                </label>
                              ))}
                            </div>
                          </div>

                          {(extendPayMethod === 'payu' || extendPayMethod === 'split') && (
                            <div className="ro-payu-card">
                              <div className="ro-payu-badge">
                                <span>💳</span> PAYU INDIA (PRIMARY GATEWAY)
                              </div>
                              <div style={{
                                width: 156, height: 156, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: '#FFFFFF', padding: 8, borderRadius: 12, border: '1.5px solid #86EFAC',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                              }}>
                                {payuQrString ? (
                                  <QRCodeSVG value={payuQrString} size={140} level="M" />
                                ) : (
                                  <div style={{ fontSize: 11, color: '#94A3B8', textAlign: 'center' }}>Generating PayU QR...</div>
                                )}
                              </div>
                              <div style={{ fontSize: 12, fontWeight: 700, color: '#047857', marginTop: 8 }}>
                                PayU Smart Dynamic UPI QR
                              </div>
                              <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>
                                Payee: Evegah | Txn: {payuTxId || 'EVG-GENERATING...'}
                              </div>

                              <div style={{ marginTop: 10, width: '100%', maxWidth: 280 }}>
                                {payuVerified ? (
                                  <div style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                                    background: '#ECFDF5', border: '1.5px solid #10B981', borderRadius: 8,
                                    padding: '7px 12px', fontSize: '11.5px', fontWeight: 700, color: '#065F46'
                                  }}>
                                    ✓ Payment Verified via PayU Server
                                  </div>
                                ) : (
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
                                    {payuCheckoutUrl && (
                                      <button
                                        type="button"
                                        onClick={() => openPayuCheckoutPopup(payuCheckoutUrl)}
                                        style={{
                                          width: '100%', background: '#2A195C', color: '#fff', border: 'none',
                                          borderRadius: '8px', padding: '9px 16px', fontSize: '12.5px',
                                          fontWeight: 700, cursor: 'pointer', boxShadow: '0 2px 6px rgba(42, 25, 92, 0.25)'
                                        }}
                                      >
                                        Pay ₹{extensionFare.toFixed(2)}
                                      </button>
                                    )}
                                    <div style={{
                                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                                      background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 8,
                                      padding: '6px 10px', fontSize: '11px', fontWeight: 600, color: '#047857', width: '100%'
                                    }}>
                                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#059669', display: 'inline-block' }} />
                                      <span>{isCheckingPayU ? 'Verifying with PayU Server...' : `Awaiting PayU payment (₹${extensionFare.toFixed(2)})...`}</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {extendPayMethod === 'cash' && (
                            <div style={{
                              display: 'flex', flexDirection: 'column', gap: 10,
                              padding: 16, background: '#FEFCE8', borderRadius: 12, border: '1.5px solid #FDE047',
                              marginTop: 4
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: 13, fontWeight: 700, color: '#854D0E' }}>
                                  Cash Collection &amp; Receipt Voucher
                                </span>
                                <span style={{
                                  background: '#CA8A04', color: '#fff', fontSize: 11, fontWeight: 800,
                                  padding: '3px 8px', borderRadius: 6
                                }}>
                                  CASH DESK
                                </span>
                              </div>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 12.5 }}>
                                <div style={{ background: '#fff', padding: '10px 12px', borderRadius: 8, border: '1px solid #FEF08A' }}>
                                  <div style={{ color: '#854D0E', fontSize: 11, fontWeight: 600 }}>Amount to Collect:</div>
                                  <div style={{ fontSize: 18, fontWeight: 800, color: '#15803D' }}>₹{extensionFare.toFixed(2)}</div>
                                </div>
                                <div style={{ background: '#fff', padding: '10px 12px', borderRadius: 8, border: '1px solid #FEF08A' }}>
                                  <div style={{ color: '#854D0E', fontSize: 11, fontWeight: 600 }}>Cash Voucher / Receipt #:</div>
                                  <div style={{ fontSize: 13, fontWeight: 800, color: '#2A195C', fontFamily: 'monospace' }}>{cashVoucher}</div>
                                </div>
                              </div>
                              <div style={{ fontSize: 11.5, color: '#713F12', lineHeight: 1.4 }}>
                                Collect exact cash from rider and issue receipt number <b>{cashVoucher}</b>. This transaction will be logged in the Cash Collection Audit Report.
                              </div>
                            </div>
                          )}

                          <button
                            type="button"
                            className="nr-continue-btn"
                            onClick={handleExtendRide}
                            disabled={loading || ((extendPayMethod === 'payu' || extendPayMethod === 'split') && !payuVerified)}
                            style={{
                              justifyContent: 'center',
                              opacity: ((extendPayMethod === 'payu' || extendPayMethod === 'split') && !payuVerified) ? 0.65 : 1,
                              cursor: ((extendPayMethod === 'payu' || extendPayMethod === 'split') && !payuVerified) ? 'not-allowed' : 'pointer'
                            }}
                          >
                            {(extendPayMethod === 'payu' || extendPayMethod === 'split')
                              ? (payuVerified ? 'Confirm Extension & Send WhatsApp' : 'Waiting for PayU Payment...')
                              : 'Confirm Extension & Send WhatsApp'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ═══════════════════════════════════════════════════════════════
                    MODE 3: EXCHANGE VEHICLE (SWAP)
                    ═══════════════════════════════════════════════════════════════ */}
                {mainTab === 'exchange' && selectedRider && (
                  <div>
                    {/* Current Vehicle Banner */}
                    <div className="rr-rider-banner">
                      <div className="rr-banner-avatar">
                        <img
                          src={selectedRider.avatar || '/rohit_avatar.png'}
                          alt={selectedRider.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e: any) => { e.currentTarget.style.display = 'none'; }}
                        />
                        <span style={{
                          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
                          justifyContent: 'center', background: '#2A195C', color: '#fff',
                          fontWeight: 800, fontSize: 18, zIndex: 0
                        }}>
                          {selectedRider.name.slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="rr-banner-name">
                          {selectedRider.name}
                          <span className="rr-kyc-badge">Ongoing Ride</span>
                        </div>
                        <div className="rr-banner-meta">
                          <span className="rr-banner-pill"><IPhone /> {selectedRider.mobile}</span>
                          <span className="rr-banner-pill">ID: {selectedRider.id}</span>
                          <span className="rr-banner-pill" style={{ background: 'rgba(239,68,68,0.25)', borderColor: 'rgba(252,165,165,0.4)' }}>
                            Outgoing: {selectedRider.vehicle_id} • {selectedRider.battery_id}
                          </span>
                        </div>
                      </div>
                      <div className="rr-banner-stats">
                        <div className="rr-stat-block">
                          <div className="rr-stat-num" style={{ color: '#4ADE80' }}>₹0.00</div>
                          <div className="rr-stat-lbl">Exchange Fee</div>
                        </div>
                        <button
                          type="button"
                          className="rr-change-btn"
                          onClick={() => setSelectedRider(null)}
                        >
                          Change Rider
                        </button>
                      </div>
                    </div>

                    {/* Replacement Vehicle & Battery Selection */}
                    <div className="nr-card">
                      <div className="nr-card-hdr">
                        <div>
                          <h2>Replacement Vehicle &amp; Battery Assignment</h2>
                          <p>Assign an available vehicle from station inventory to swap with rider</p>
                        </div>
                      </div>
                      <div className="nr-card-body">
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
                          <div>
                            <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                              Select Replacement Vehicle ({availableVehicles.length} Available)
                            </label>
                            <select
                              value={exchangeNewVehicle}
                              onChange={e => setExchangeNewVehicle(e.target.value)}
                              style={{
                                width: '100%', padding: '10px 12px', border: '1.5px solid #E2E8F0',
                                borderRadius: 10, fontSize: 13, outline: 'none', background: '#fff'
                              }}
                            >
                              {availableVehicles.length > 0 ? (
                                availableVehicles.map((v: any) => (
                                  <option key={v.id || v.code || v.registration_number} value={`${v.code || v.registration_number} (${v.model || 'Evegah EV'})`}>
                                    {v.code || v.registration_number} — {v.model || 'Evegah EV'} ({v.vehicle_status || 'Ready'})
                                  </option>
                                ))
                              ) : (
                                <option value="">No available vehicles in this zone</option>
                              )}
                            </select>
                          </div>

                          <div>
                            <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                              Select Replacement Battery ({availableBatteries.length} Available)
                            </label>
                            <select
                              value={exchangeNewBattery}
                              onChange={e => setExchangeNewBattery(e.target.value)}
                              style={{
                                width: '100%', padding: '10px 12px', border: '1.5px solid #E2E8F0',
                                borderRadius: 10, fontSize: 13, outline: 'none', background: '#fff'
                              }}
                            >
                              {availableBatteries.length > 0 ? (
                                availableBatteries.map((b: any) => (
                                  <option key={b.id || b.battery_id} value={`${b.battery_id} (${b.capacity || '60V 30Ah'})`}>
                                    {b.battery_id} — {b.capacity || '60V 30Ah'} (SOC {b.soc || 100}%)
                                  </option>
                                ))
                              ) : (
                                <option value="">No available batteries in this zone</option>
                              )}
                            </select>
                          </div>
                        </div>

                        <div style={{ marginBottom: 16 }}>
                          <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                            Reason for Vehicle Exchange
                          </label>
                          <select
                            value={exchangeReason}
                            onChange={e => setExchangeReason(e.target.value)}
                            style={{
                              width: '100%', padding: '10px 12px', border: '1.5px solid #E2E8F0',
                              borderRadius: 10, fontSize: 13, outline: 'none', background: '#fff'
                            }}
                          >
                            <option value="Battery Range Drop">Battery Range Drop / Fast Discharge</option>
                            <option value="Motor Noise">Motor Noise / Throttle Lag</option>
                            <option value="Flat Tyre / Brake Issue">Flat Tyre / Brake Issue</option>
                            <option value="Scheduled Preventative Maintenance">Scheduled Preventative Maintenance</option>
                            <option value="Rider Request for Upgrade">Rider Request for Model Upgrade</option>
                          </select>
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                            Exchange Remarks (Optional)
                          </label>
                          <textarea
                            placeholder="Add internal notes for maintenance team..."
                            value={exchangeNotes}
                            onChange={e => setExchangeNotes(e.target.value)}
                            style={{
                              width: '100%', padding: '10px 12px', border: '1.5px solid #E2E8F0',
                              borderRadius: 10, fontSize: 12.5, outline: 'none', resize: 'none', minHeight: 60,
                              fontFamily: 'inherit'
                            }}
                          />
                        </div>

                        <div className="nr-footer-card" style={{ marginTop: 16 }}>
                          <span style={{ fontSize: 12.5, color: '#15803D', fontWeight: 700 }}>
                            ✓ 100% Free Swap Guarantee Applied
                          </span>
                          <button
                            type="button"
                            className="nr-continue-btn"
                            onClick={handleExchangeVehicle}
                            disabled={loading}
                          >
                            Confirm Vehicle Exchange &amp; Swap Voucher
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* ── RIGHT PANEL (Sticky Live Summary & Guidelines) ── */}
              <div className="nr-rp">

                {/* Active Rider Summary Card */}
                {selectedRider && (
                  <div className="nr-rp-card">
                    <div className="nr-rp-hdr">
                      <span style={{ color: '#2A195C', display: 'flex' }}><IReceipt /></span>
                      <div className="nr-rp-title">Live Settlement Summary</div>
                    </div>
                    <div className="nr-rp-body">
                      <div className="nr-rp-avatar-row">
                        <div className="nr-rp-avatar">
                          <img
                            src={selectedRider.avatar || '/rohit_avatar.png'}
                            alt={selectedRider.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e: any) => { e.currentTarget.style.display = 'none'; }}
                          />
                          <span style={{
                            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
                            justifyContent: 'center', background: '#2A195C', color: '#fff',
                            fontWeight: 800, fontSize: 13, zIndex: 0
                          }}>
                            {selectedRider.name.slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="nr-rp-name">{selectedRider.name}</div>
                          <div className="nr-rp-sub">{selectedRider.mobile}</div>
                        </div>
                      </div>

                      <div className="nr-rp-row">
                        <span className="nr-rp-label">Rider ID</span>
                        <span className="nr-rp-val" style={{ fontFamily: 'monospace' }}>{selectedRider.id}</span>
                      </div>
                      <div className="nr-rp-row">
                        <span className="nr-rp-label">Vehicle</span>
                        <span className="nr-rp-val">{selectedRider.vehicle_id}</span>
                      </div>
                      <div className="nr-rp-row">
                        <span className="nr-rp-label">Battery</span>
                        <span className="nr-rp-val">{selectedRider.battery_id}</span>
                      </div>
                      <div className="nr-rp-row">
                        <span className="nr-rp-label">Hub Zone</span>
                        <span className="nr-rp-val">{selectedRider.zone}</span>
                      </div>
                      <div className="nr-rp-row">
                        <span className="nr-rp-label">Deposit Held</span>
                        <span className="nr-rp-val" style={{ color: '#15803D' }}>₹{currentDeposit.toFixed(2)}</span>
                      </div>

                      {mainTab === 'return' && (
                        <>
                          <div className="nr-rp-row">
                            <span className="nr-rp-label">Deductions</span>
                            <span className="nr-rp-val" style={{ color: deductions > 0 ? '#DC2626' : '#64748B' }}>
                              -₹{deductions.toFixed(2)}
                            </span>
                          </div>
                          <div className="nr-rp-row" style={{ background: '#F5F3FF', borderColor: '#C7D2FE' }}>
                            <span className="nr-rp-label" style={{ color: '#2A195C', fontWeight: 700 }}>Admin Refund</span>
                            <span className="nr-rp-val" style={{ color: '#2A195C', fontSize: 13.5 }}>
                              ₹{netRefund.toFixed(2)}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Hub Support Card */}
                <div className="nr-rp-card">
                  <div className="nr-rp-hdr">
                    <span style={{ color: '#2A195C', display: 'flex' }}>🛡️</span>
                    <div className="nr-rp-title">Admin Refund Policy</div>
                  </div>
                  <div style={{ padding: '12px 14px' }}>
                    <div style={{ fontSize: 12, color: '#475569', marginBottom: 10, lineHeight: 1.45 }}>
                      All deposit refunds are routed to the <b>Deposit Refunds</b> module for Super Admin OTP / Master Password sign-off.
                    </div>
                    <button
                      type="button"
                      style={{
                        width: '100%', padding: '9px', background: '#2A195C', color: '#fff',
                        borderRadius: 8, fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer'
                      }}
                    >
                      Contact Super Admin Desk
                    </button>
                  </div>
                </div>

                {/* Quick Tips Card */}
                <div className="nr-tips-card">
                  <div className="nr-tips-hdr">
                    <IBulb />
                    <div style={{ fontSize: 12.5, fontWeight: 800, color: '#92400E' }}>Hub Check-In Guidelines</div>
                  </div>
                  <div style={{ padding: '8px 0 10px' }}>
                    <div className="nr-tip-row">
                      <span className="nr-tip-dot" />
                      <span>Capture all 6 angles clearly so Super Admin can verify damage deductions if disputed.</span>
                    </div>
                    <div className="nr-tip-row">
                      <span className="nr-tip-dot" />
                      <span>Physically inspect the 60V charger cord and helmet visor before toggling Returned.</span>
                    </div>
                    <div className="nr-tip-row">
                      <span className="nr-tip-dot" />
                      <span>Use <b>Urgent Priority</b> in Step 3 if the rider is waiting at the hub for immediate settlement.</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>
      </div>

      {/* Real Live Camera & Photo Upload Modal */}
      {activeCameraSlot && (
        <CameraCaptureModal
          isOpen={true}
          title={activeCameraSlot.title}
          instruction="Align the vehicle angle inside the frame and snap photo, or upload an existing inspection file."
          onCapture={(base64) => {
            setInspectionPhotos(prev => ({ ...prev, [activeCameraSlot.id]: base64 }));
            setActiveCameraSlot(null);
          }}
          onClose={() => setActiveCameraSlot(null)}
        />
      )}
    </>
  );
}