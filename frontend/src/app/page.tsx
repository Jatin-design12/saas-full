"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import FranchiseOnboard from "./franchise/onboard/page";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import { api } from "@/lib/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function AnimatedCount({ value }: { value: string | number }) {
  const [displayValue, setDisplayValue] = useState<string | number>(value);

  useEffect(() => {
    const str = String(value);
    const numericMatch = str.match(/[\d.]+/g);
    if (!numericMatch) {
      setDisplayValue(value);
      return;
    }
    const numericStr = numericMatch.join('');
    const target = parseFloat(numericStr);
    if (isNaN(target)) {
      setDisplayValue(value);
      return;
    }
    let start = 0;
    const duration = 1000;
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = progress * (2 - progress);
      const current = Math.floor(start + easeProgress * (target - start));
      let formatted = String(current);
      if (str.includes('₹')) {
        formatted = '₹' + current.toLocaleString('en-IN');
      } else if (str.includes(',')) {
        formatted = current.toLocaleString('en-US');
      } else if (str.includes('%')) {
        formatted = current + '%';
      }
      setDisplayValue(formatted);
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };
    requestAnimationFrame(animate);
  }, [value]);

  return <>{displayValue}</>;
}

/* ──────────────────────────────────────────────────────── */
/* ── UNIFIED 1000% SUPER ADMIN DASHBOARD DESIGN SYSTEM ── */
/* ──────────────────────────────────────────────────────── */
const SUPER_DESIGN_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

.ev-shell {
  display: flex;
  min-height: 100vh;
  background: #F8FAFC;
  font-family: 'Plus Jakarta Sans', sans-serif;
  color: #0F172A;
}

.ev-main {
  margin-left: 230px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: calc(100% - 230px);
  min-width: 0;
}

.ev-body {
  padding: 20px 24px 60px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Sub header Date selection & export */
.sa-sub-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sa-sub-title-group {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.sa-sub-title {
  font-size: 18px;
  font-weight: 800;
  color: #0F172A;
  font-family: 'Outfit', sans-serif;
  letter-spacing: -0.02em;
}

.sa-sub-desc {
  font-size: 12px;
  color: #64748B;
  font-weight: 500;
}

.sa-sub-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.sa-date-box {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  border: 1.5px solid #E2E8F0;
  border-radius: 10px;
  padding: 8px 14px;
  font-size: 12.5px;
  font-weight: 600;
  color: #334155;
  cursor: pointer;
  transition: all 0.15s;
  box-shadow: 0 1px 2px rgba(0,0,0,0.02);
}

.sa-date-box:hover {
  border-color: #6366F1;
}

.sa-export-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #6366F1;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 12.5px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.25);
}

.sa-export-btn:hover {
  background: #4f46e5;
}

/* KPI Cards 5 column row */
.sa-kpi-row-5 {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
}

.sa-kpi-card {
  background: #fff;
  border: 1px solid #E2E8F0;
  border-radius: 14px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
  transition: transform 0.15s, box-shadow 0.15s, border-color 0.15s;
}

.sa-kpi-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.04);
  border-color: #CBD5E1;
}

.sa-kpi-card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.sa-kpi-card-lbl {
  font-size: 11px;
  font-weight: 700;
  color: #64748B;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.sa-kpi-card-ic {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sa-kpi-card-val {
  font-size: 24px;
  font-weight: 800;
  color: #0F172A;
  margin: 10px 0 4px;
  font-family: 'Outfit', sans-serif;
}

.sa-kpi-card-bot {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10.5px;
  font-weight: 600;
  color: #64748B;
}

.sa-kpi-card-trend-up {
  color: #10B981;
  display: flex;
  align-items: center;
  gap: 2px;
  font-weight: 700;
}

.sa-kpi-card-trend-dn {
  color: #EF4444;
  display: flex;
  align-items: center;
  gap: 2px;
  font-weight: 700;
}

/* Grids */
.sa-row-1-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 16px;
}

.sa-row-2-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.sa-row-3-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr 0.8fr;
  gap: 16px;
}

.sa-card {
  background: #fff;
  border: 1px solid #E2E8F0;
  border-radius: 14px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.sa-card-hdr {
  padding: 14px 18px;
  border-bottom: 1px solid #F1F5F9;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sa-card-title {
  font-size: 13.5px;
  font-weight: 800;
  color: #0F172A;
  font-family: 'Outfit', sans-serif;
}

.sa-card-body {
  padding: 18px;
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
}

.sa-select-light {
  padding: 4px 8px;
  border: 1.5px solid #E2E8F0;
  border-radius: 6px;
  font-size: 11.5px;
  font-weight: 600;
  color: #475569;
  outline: none;
  background: #fff;
  cursor: pointer;
}

/* Donut chart styles */
.sa-donut-wrap {
  position: relative;
  width: 120px;
  height: 120px;
  flex-shrink: 0;
}

.sa-donut-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  pointer-events: none;
}

.sa-donut-num {
  font-size: 17px;
  font-weight: 800;
  color: #0f172a;
  line-height: 1;
  font-family: 'Outfit', sans-serif;
}

.sa-donut-lbl {
  font-size: 8px;
  color: #94A3B8;
  margin-top: 2px;
  font-weight: 700;
  text-transform: uppercase;
}

.sa-donut-legends {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  margin-top: 14px;
}

.sa-donut-leg-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 10.5px;
  color: #475569;
  border-bottom: 1px solid #F1F5F9;
  padding-bottom: 4px;
}

.sa-donut-leg-row:last-child {
  border-bottom: none;
}

.sa-donut-leg-left {
  display: flex;
  align-items: center;
  gap: 6px;
}

.sa-donut-leg-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.sa-donut-leg-val {
  font-weight: 700;
  color: #0F172A;
}

/* Rank lists */
.sa-rank-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sa-rank-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
}

.sa-rank-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.sa-rank-circle {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 800;
  color: #fff;
}

.sa-rank-name {
  font-weight: 600;
  color: #334155;
}

.sa-rank-val {
  font-weight: 700;
  color: #0F172A;
}

/* 6 Small KPIs Row */
.sa-kpi-row-6 {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
}

/* Tables */
.sa-table {
  width: 100%;
  border-collapse: collapse;
}

.sa-table th {
  font-size: 9.5px;
  font-weight: 700;
  color: #94A3B8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-align: left;
  padding: 9px 12px;
  background: #F8FAFC;
  border-bottom: 1px solid #F1F5F9;
}

.sa-table td {
  padding: 10px 12px;
  font-size: 12px;
  border-bottom: 1px solid #F1F5F9;
  vertical-align: middle;
  color: #334155;
}

.sa-table tr:last-child td {
  border-bottom: none;
}

.sa-table tr:hover td {
  background: #F8FAFC;
}

.sa-link-all {
  font-size: 11px;
  font-weight: 700;
  color: #6366F1;
  text-decoration: none;
}

.sa-link-all:hover {
  text-decoration: underline;
}

/* Badges */
.sa-badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 8px;
  border-radius: 20px;
  font-size: 10.5px;
  font-weight: 700;
}

.sa-badge-green { background: #DCFCE7; color: #15803D; }
.sa-badge-blue { background: #DBEAFE; color: #1D4ED8; }
.sa-badge-orange { background: #FEF9C3; color: #A16207; }
.sa-badge-purple { background: #F3E8FF; color: #7E22CE; }
.sa-badge-red { background: #FEE2E2; color: #B91C1C; }

/* Role Switcher FAB */
.role-switcher-fab {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%);
  color: #fff;
  border: 1.5px solid rgba(255,255,255,0.15);
  border-radius: 30px;
  padding: 11px 20px;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 12px 25px rgba(15, 23, 42, 0.35);
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: 'Outfit', sans-serif;
}

.role-switcher-fab:hover {
  transform: translateY(-3px) scale(1.03);
  box-shadow: 0 16px 30px rgba(99, 102, 241, 0.4);
  border-color: #6366F1;
}

.role-dropdown-panel {
  position: fixed;
  bottom: 75px;
  right: 24px;
  background: #fff;
  border: 1.5px solid #E2E8F0;
  border-radius: 16px;
  padding: 14px;
  box-shadow: 0 25px 35px -5px rgba(0,0,0,0.2), 0 10px 10px -5px rgba(0,0,0,0.04);
  z-index: 9999;
  width: 250px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.role-dropdown-header {
  font-size: 10px;
  font-weight: 800;
  color: #94A3B8;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding-bottom: 6px;
  border-bottom: 1px solid #F1F5F9;
  margin-bottom: 2px;
}

.role-opt {
  padding: 9px 12px;
  font-size: 12px;
  font-weight: 700;
  color: #334155;
  border: 1px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  text-align: left;
  background: none;
  width: 100%;
  transition: all 0.15s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.role-opt:hover {
  background: #EEF2FF;
  color: #6366F1;
}

.role-opt.act {
  background: #6366F1;
  color: #fff;
}

/* Floating AI Assistant Chatbox */
.ai-chat-fab {
  position: fixed;
  bottom: 24px;
  right: 230px;
  background: linear-gradient(135deg, #6366F1 0%, #4F46E5 100%);
  color: #fff;
  border: none;
  border-radius: 30px;
  padding: 11px 20px;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 10px 25px rgba(99, 102, 241, 0.4);
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: 'Outfit', sans-serif;
}

.ai-chat-fab:hover {
  transform: translateY(-2px) scale(1.03);
  box-shadow: 0 15px 30px rgba(99, 102, 241, 0.5);
}

.ai-chat-panel {
  position: fixed;
  bottom: 75px;
  right: 230px;
  background: #fff;
  border: 1px solid #E2E8F0;
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0,0,0,0.15);
  z-index: 9999;
  width: 360px;
  height: 500px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.ai-chat-header { background: #0F172A; color: #fff; padding: 14px 16px; display: flex; justify-content: space-between; align-items: center; }
.ai-chat-title { font-size: 13.5px; font-weight: 800; margin: 0; display: flex; align-items: center; gap: 6px; font-family: 'Outfit', sans-serif; }
.ai-chat-actions { display: flex; align-items: center; gap: 8px; }
.ai-chat-btn-icon { background: none; border: none; color: #E2E8F0; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 4px; border-radius: 50%; }
.ai-chat-btn-icon:hover { background: rgba(255,255,255,0.1); color: #fff; }
.ai-chat-body { flex: 1; overflow-y: auto; padding: 14px; display: flex; flex-direction: column; gap: 12px; background: #F8FAFC; }
.ai-msg { max-width: 80%; padding: 10px 14px; border-radius: 12px; font-size: 12.5px; line-height: 1.4; font-weight: 500; word-break: break-word; }
.ai-msg-user { background: #6366f1; color: #fff; align-self: flex-end; border-bottom-right-radius: 2px; }
.ai-msg-bot { background: #fff; color: #1E293B; align-self: flex-start; border-bottom-left-radius: 2px; border: 1px solid #E2E8F0; }
.ai-msg-error { background: #FEF2F2; color: #EF4444; align-self: center; border: 1px solid #FEE2E2; text-align: center; }
.ai-chat-footer { padding: 12px; background: #fff; border-top: 1px solid #E2E8F0; display: flex; flex-direction: column; gap: 8px; }
.ai-chat-input-row { display: flex; gap: 8px; }
.ai-chat-inp { flex: 1; padding: 9px 12px; border: 1.5px solid #E2E8F0; border-radius: 8px; font-size: 13px; font-weight: 500; outline: none; }
.ai-chat-inp:focus { border-color: #6366f1; }
.ai-chat-send { padding: 8px 14px; background: #6366f1; color: #fff; border: none; border-radius: 8px; font-size: 12.5px; font-weight: 700; cursor: pointer; }
.ai-chat-quick-tags { display: flex; gap: 6px; overflow-x: auto; padding-bottom: 2px; }
.ai-chat-tag { font-size: 10.5px; font-weight: 700; background: #EEF2FF; color: #6366f1; border: 1px solid #E0E7FF; padding: 4px 8px; border-radius: 15px; cursor: pointer; white-space: nowrap; }

/* Progress bar */
.sa-prog-bar-bg {
  height: 6px;
  background: #E2E8F0;
  border-radius: 3px;
  overflow: hidden;
}
.sa-prog-bar-fill {
  height: 100%;
  background: #6366F1;
  border-radius: 3px;
}
`;

export default function DynamicDashboard() {
  const [role, setRole] = useState<string | null>(null);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const router = useRouter();

  // Chatbox State
  const [showChat, setShowChat] = useState(false);
  const [showChatSettings, setShowChatSettings] = useState(false);
  const [geminiKey, setGeminiKey] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<any[]>([
    { role: 'bot', text: 'Hello! I am your Evegah AI Assistant. I can help you automate dashboard operations like adding vehicles, assigning zones, and configuring pricing.' }
  ]);
  const [isSending, setIsSending] = useState(false);

  const loadRole = () => {
    const storedRole = localStorage.getItem("evegah_role");
    if (!storedRole) {
      router.push("/login");
      return;
    }
    setRole(storedRole);
  };

  useEffect(() => {
    loadRole();
    if (typeof window !== 'undefined') {
      window.addEventListener('evegah_role_changed', loadRole);
      return () => window.removeEventListener('evegah_role_changed', loadRole);
    }
  }, [router]);

  useEffect(() => {
    const savedKey = localStorage.getItem('evegah_gemini_key') || '';
    setGeminiKey(savedKey);
  }, []);

  const handleSwitchRole = (newRoleKey: string, newRoleLabel: string) => {
    localStorage.setItem("evegah_role", newRoleKey);
    localStorage.setItem("evegah_user_role_name", newRoleLabel);
    
    // Set role permissions for sidebar & route access
    const rolePermissionsMap: Record<string, any> = {
      super_admin: null,
      platform_admin: null,
      zone_admin: { Dashboard: { access: true }, Registrations: { access: true }, Vehicles: { access: true }, Riders: { access: true }, 'Zone Management': { access: true }, Maintenance: { access: true }, Reports: { access: true }, Alerts: { access: true }, Attendance: { access: true } },
      operations_manager: { Dashboard: { access: true }, Registrations: { access: true }, Vehicles: { access: true }, Battery: { access: true }, Maintenance: { access: true }, 'IoT Devices': { access: true }, Reports: { access: true }, Alerts: { access: true }, Attendance: { access: true } },
      franchise_manager: { Dashboard: { access: true }, Franchise: { access: true }, Riders: { access: true }, Vehicles: { access: true }, Payments: { access: true }, Reports: { access: true }, Settings: { access: true } },
      battery_technician: { Dashboard: { access: true }, Battery: { access: true }, 'IoT Devices': { access: true }, Maintenance: { access: true }, Alerts: { access: true } },
      support_executive: { Dashboard: { access: true }, Registrations: { access: true }, Riders: { access: true }, Alerts: { access: true }, Announcements: { access: true } },
      fleet_manager: { Dashboard: { access: true }, Vehicles: { access: true }, Maintenance: { access: true }, 'IoT Devices': { access: true }, Reports: { access: true } },
      field_technician: { Dashboard: { access: true }, Battery: { access: true }, Vehicles: { access: true }, Maintenance: { access: true } },
      finance_manager: { Dashboard: { access: true }, Payments: { access: true }, Franchise: { access: true }, Reports: { access: true }, Settings: { access: true } }
    };

    const perms = rolePermissionsMap[newRoleKey];
    if (perms) {
      localStorage.setItem("evegah_user_permissions", JSON.stringify(perms));
    } else {
      localStorage.removeItem("evegah_user_permissions");
    }

    setRole(newRoleKey);
    setShowRoleMenu(false);
    window.dispatchEvent(new Event("evegah_role_changed"));
  };

  const handleSaveKey = (val: string) => {
    setGeminiKey(val);
    localStorage.setItem('evegah_gemini_key', val);
  };

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || chatInput;
    if (!textToSend.trim()) return;

    if (!customPrompt) {
      setChatInput('');
    }

    const userMsg = { role: 'user', text: textToSend };
    setChatMessages(prev => [...prev, userMsg]);
    setIsSending(true);

    try {
      const response = await api.post('/ai/automate', {
        prompt: textToSend,
        geminiKey: geminiKey
      });

      if (response && response.data && response.data.status === 'success') {
        setChatMessages(prev => [...prev, { role: 'bot', text: response.data.reply }]);
        if (response.data.intent !== 'CHITCHAT') {
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      } else {
        setChatMessages(prev => [...prev, { role: 'bot', text: response?.data?.message || 'Failed to execute operation.', isError: true }]);
      }
    } catch (err: any) {
      console.error(err);
      const errMsg = err.response?.data?.message || err.message || 'An error occurred.';
      setChatMessages(prev => [...prev, { role: 'bot', text: errMsg, isError: true }]);
    } finally {
      setIsSending(false);
    }
  };

  if (role === null) return null;

  if (role === "first_time_franchise") {
    return <FranchiseOnboard />;
  }

  const roleList = [
    { key: "super_admin", label: "Super Admin", icon: "👑" },
    { key: "platform_admin", label: "Platform Admin", icon: "🛡️" },
    { key: "zone_admin", label: "Zone Admin", icon: "📍" },
    { key: "operations_manager", label: "Operations Manager", icon: "⚡" },
    { key: "franchise_manager", label: "Franchise Manager", icon: "🏢" },
    { key: "battery_technician", label: "Battery Technician", icon: "🔋" },
    { key: "support_executive", label: "Support Executive", icon: "🎧" },
    { key: "fleet_manager", label: "Fleet Manager", icon: "🛵" },
    { key: "field_technician", label: "Field Technician", icon: "🛠️" },
    { key: "finance_manager", label: "Finance Manager", icon: "💳" },
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: SUPER_DESIGN_CSS }} />

      {/* Floating AI Chatbox FAB */}
      <button className="ai-chat-fab" onClick={() => setShowChat(!showChat)}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        Evegah AI
      </button>

      {showChat && (
        <div className="ai-chat-panel">
          <div className="ai-chat-header">
            <div className="ai-chat-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ color: '#D2FC00' }}>
                <polygon points="12 2 2 22 22 22" />
              </svg>
              Evegah AI Automator
            </div>
            <div className="ai-chat-actions">
              <button className="ai-chat-btn-icon" onClick={() => setShowChatSettings(!showChatSettings)} title="AI Settings">
                ⚙️
              </button>
              <button className="ai-chat-btn-icon" onClick={() => setShowChat(false)}>✕</button>
            </div>
          </div>

          {showChatSettings && (
            <div className="ai-chat-settings" style={{ padding: '10px', background: '#FAF5FF', borderBottom: '1px solid #E9D5FF' }}>
              <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#2A195C' }}>Gemini API Key</label>
              <input 
                type="password" 
                className="ai-chat-inp"
                style={{ width: '100%', padding: '6px', marginTop: '4px', borderRadius: '6px', border: '1px solid #CBD5E1' }}
                placeholder="Enter Gemini API Key..." 
                value={geminiKey} 
                onChange={(e) => handleSaveKey(e.target.value)} 
              />
            </div>
          )}

          <div className="ai-chat-body">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`ai-msg ${msg.role === 'user' ? 'ai-msg-user' : msg.isError ? 'ai-msg-error' : 'ai-msg-bot'}`}>
                {msg.text}
              </div>
            ))}
            {isSending && (
              <div className="ai-msg ai-msg-bot" style={{ fontStyle: 'italic', color: '#94A3B8' }}>
                AI is processing request...
              </div>
            )}
          </div>

          <div className="ai-chat-footer">
            <div className="ai-chat-quick-tags">
              <span className="ai-chat-tag" onClick={() => handleSendMessage("Add vehicle EVM-999 with model Evegah Mink to Gotri Zone")}>Add Mink Vehicle</span>
              <span className="ai-chat-tag" onClick={() => handleSendMessage("Assign vehicle EVM-999 to Aatapi Zone")}>Assign EVM-999</span>
            </div>
            <div className="ai-chat-input-row">
              <input 
                type="text" 
                className="ai-chat-inp" 
                placeholder="Ask AI to automate..." 
                value={chatInput} 
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage();
                }}
              />
              <button className="ai-chat-send" onClick={() => handleSendMessage()} disabled={isSending}>Send</button>
            </div>
          </div>
        </div>
      )}

      {/* Render Selected Role Dashboard */}
      {role === "super_admin" || role === "Super Admin" || role === "platform_admin" || role === "Platform Admin" ? (
        <SuperAdminRoleDashboard />
      ) : role === "zone_admin" || role === "zone_manager" || role === "Zone Admin" ? (
        <ZoneManagerRoleDashboard />
      ) : role === "operations_manager" || role === "Operations Manager" ? (
        <GroundOperationsRoleDashboard />
      ) : role === "support_executive" || role === "Support Executive" ? (
        <SupportExecutiveRoleDashboard />
      ) : role === "franchise_manager" || role === "admin" || role === "Franchise Manager" ? (
        <FranchiseAdminRoleDashboard />
      ) : role === "battery_technician" || role === "technician" || role === "Battery Technician" ? (
        <MaintenanceTechnicianRoleDashboard />
      ) : role === "finance_manager" || role === "finance" || role === "Finance Manager" ? (
        <FinanceAccountsRoleDashboard />
      ) : (
        <GroundOperationsRoleDashboard />
      )}
    </>
  );
}

/* ──────────────────────────────────────────────────────── */
/* ── 1. SUPER ADMIN ROLE DASHBOARD ─────────────────────── */
/* ──────────────────────────────────────────────────────── */
function SuperAdminRoleDashboard() {
  return (
    <div className="ev-shell">
      <Sidebar activePath="/" />
      <div className="ev-main">
        <TopBar title="Super Admin Dashboard" subtitle="Overview of SaaS Tenants, Subscriptions & Revenue Metrics" hideZone={false} />

        <div className="ev-body">
          <div className="sa-sub-header">
            <div className="sa-sub-title-group">
              <h2 className="sa-sub-title">SaaS Platform Performance</h2>
              <span className="sa-sub-desc">Multi-tenant subscription analytics and revenue health overview</span>
            </div>
            <div className="sa-sub-right">
              <div className="sa-date-box">
                <span>01 May 2024 - 31 May 2024</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/></svg>
              </div>
              <button className="sa-export-btn">Export Report</button>
            </div>
          </div>

          <div className="sa-kpi-row-5">
            {[
              { label: 'Total Users', val: '24,568', change: '12.5%', up: true, bg: '#EEF2FF', color: '#6366F1', ic: '👥' },
              { label: 'Total Tenants', val: '248', change: '8.7%', up: true, bg: '#EEF2FF', color: '#4F46E5', ic: '🏢' },
              { label: 'Active Subscriptions', val: '8,932', change: '14.3%', up: true, bg: '#ECFDF5', color: '#10B981', ic: '⚡' },
              { label: 'MRR', val: '₹92,45,680', change: '16.8%', up: true, bg: '#EFF6FF', color: '#2563EB', ic: '₹' },
              { label: 'ARR', val: '₹11,09,48,160', change: '18.9%', up: true, bg: '#ECFDF5', color: '#10B981', ic: '📈' }
            ].map(k => (
              <div key={k.label} className="sa-kpi-card">
                <div className="sa-kpi-card-top">
                  <span className="sa-kpi-card-lbl">{k.label}</span>
                  <span className="sa-kpi-card-ic" style={{ background: k.bg, color: k.color, fontWeight: 'bold' }}>{k.ic}</span>
                </div>
                <div className="sa-kpi-card-val"><AnimatedCount value={k.val} /></div>
                <div className="sa-kpi-card-bot">
                  <span className="sa-kpi-card-trend-up">↑ {k.change}</span>
                  <span>vs last month</span>
                </div>
              </div>
            ))}
          </div>

          <div className="sa-row-1-grid">
            {/* Multi-spline Chart */}
            <div className="sa-card">
              <div className="sa-card-hdr">
                <span className="sa-card-title">Revenue Growth (MRR vs ARR)</span>
                <select className="sa-select-light"><option>This Month</option></select>
              </div>
              <div className="sa-card-body">
                <div style={{ height: '180px', position: 'relative' }}>
                  <Line
                    data={{
                      labels: ['01 May', '06 May', '11 May', '16 May', '21 May', '26 May', '31 May'],
                      datasets: [
                        { label: 'MRR (₹)', data: [45, 70, 50, 60, 55, 63, 90], borderColor: '#6366F1', backgroundColor: 'rgba(99, 102, 241, 0.12)', fill: true, tension: 0.4 },
                        { label: 'ARR (₹)', data: [25, 40, 35, 43, 45, 55, 70], borderColor: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.12)', fill: true, tension: 0.4 }
                      ]
                    }}
                    options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: true, position: 'top' } } }}
                  />
                </div>
              </div>
            </div>

            {/* Doughnut Chart */}
            <div className="sa-card">
              <div className="sa-card-hdr"><span className="sa-card-title">Subscriptions Status</span></div>
              <div className="sa-card-body" style={{ alignItems: 'center' }}>
                <div className="sa-donut-wrap">
                  <Doughnut
                    data={{
                      labels: ['Active', 'Trial', 'Past Due', 'Canceled'],
                      datasets: [{ data: [6543, 1245, 687, 457], backgroundColor: ['#1E3A8A', '#84CC16', '#F97316', '#EF4444'] }]
                    }}
                    options={{ responsive: true, maintainAspectRatio: false, cutout: '70%', plugins: { legend: { display: false } } }}
                  />
                  <div className="sa-donut-center">
                    <span className="sa-donut-num">8,932</span>
                    <span className="sa-donut-lbl">Total</span>
                  </div>
                </div>
                <div className="sa-donut-legends">
                  <div className="sa-donut-leg-row"><span>Active</span><span className="sa-donut-leg-val">6,543 (73.2%)</span></div>
                  <div className="sa-donut-leg-row"><span>Trial</span><span className="sa-donut-leg-val">1,245 (13.9%)</span></div>
                  <div className="sa-donut-leg-row"><span>Past Due</span><span className="sa-donut-leg-val">687 (7.7%)</span></div>
                  <div className="sa-donut-leg-row"><span>Canceled</span><span className="sa-donut-leg-val">457 (5.2%)</span></div>
                </div>
              </div>
            </div>

            {/* Top Plans Rank List */}
            <div className="sa-card">
              <div className="sa-card-hdr">
                <span className="sa-card-title">Top Plans by Revenue</span>
                <a href="/super-admin/subscriptions" className="sa-link-all">View All</a>
              </div>
              <div className="sa-card-body">
                <div className="sa-rank-list">
                  {[
                    { name: 'Enterprise Plan', val: '₹45,67,890', color: '#1E3A8A' },
                    { name: 'Business Plan', val: '₹28,34,560', color: '#10B981' },
                    { name: 'Professional Plan', val: '₹12,45,230', color: '#F59E0B' },
                    { name: 'Starter Plan', val: '₹5,67,890', color: '#6366F1' }
                  ].map((p, idx) => (
                    <div key={p.name} className="sa-rank-row">
                      <div className="sa-rank-left">
                        <span className="sa-rank-circle" style={{ background: p.color }}>{idx + 1}</span>
                        <span className="sa-rank-name">{p.name}</span>
                      </div>
                      <span className="sa-rank-val">{p.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 6 Small KPIs Row */}
          <div className="sa-kpi-row-6">
            {[
              { label: 'New Signups', val: '1,245', change: '14.2%', up: true, bg: '#EEF2FF', color: '#6366F1', ic: '👤' },
              { label: 'Trial Conversions', val: '18.6%', change: '3.2%', up: true, bg: '#ECFDF5', color: '#10B981', ic: '🎯' },
              { label: 'Churn Rate', val: '2.4%', change: '0.6%', up: false, bg: '#FEF2F2', color: '#EF4444', ic: '📉' },
              { label: 'LTV', val: '₹24,850', change: '11.3%', up: true, bg: '#ECFDF5', color: '#10B981', ic: '💎' },
              { label: 'CAC', val: '₹3,250', change: '4.1%', up: false, bg: '#FFF7ED', color: '#F97316', ic: '🏷️' },
              { label: 'Active Tenants', val: '198', change: '9.1%', up: true, bg: '#EEF2FF', color: '#6366F1', ic: '🏬' }
            ].map(k => (
              <div key={k.label} className="sa-kpi-card" style={{ padding: '12px' }}>
                <div className="sa-kpi-card-top">
                  <span className="sa-kpi-card-lbl" style={{ fontSize: '9.5px' }}>{k.label}</span>
                  <span className="sa-kpi-card-ic" style={{ width: '28px', height: '28px', background: k.bg, color: k.color }}>{k.ic}</span>
                </div>
                <div className="sa-kpi-card-val" style={{ fontSize: '18px', margin: '6px 0 2px' }}><AnimatedCount value={k.val} /></div>
                <div className="sa-kpi-card-bot" style={{ fontSize: '9.5px' }}>
                  <span className={k.up ? 'sa-kpi-card-trend-up' : 'sa-kpi-card-trend-dn'}>{k.up ? '↑' : '↓'} {k.change}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Tenants & Subscriptions Tables */}
          <div className="sa-row-3-grid">
            <div className="sa-card">
              <div className="sa-card-hdr">
                <span className="sa-card-title">Tenant Overview</span>
                <a href="/franchise/list" className="sa-link-all">Manage Tenants</a>
              </div>
              <div className="sa-card-body" style={{ padding: 0 }}>
                <table className="sa-table">
                  <thead>
                    <tr><th>Tenant Name</th><th>Plan</th><th>Vehicles</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {[
                      { name: 'Gotri Mobility Hub', plan: 'Enterprise', vehicles: 450, st: 'Active', bg: 'sa-badge-green' },
                      { name: 'Connaught Fleet Ltd', plan: 'Business', vehicles: 320, st: 'Active', bg: 'sa-badge-green' },
                      { name: 'Bangalore EV Rides', plan: 'Business', vehicles: 280, st: 'Active', bg: 'sa-badge-green' },
                      { name: 'Indiranagar Hub', plan: 'Starter', vehicles: 85, st: 'Trial', bg: 'sa-badge-orange' },
                      { name: 'Aatapi Eco Mobility', plan: 'Professional', vehicles: 190, st: 'Active', bg: 'sa-badge-green' }
                    ].map(t => (
                      <tr key={t.name}>
                        <td style={{ fontWeight: '700' }}>{t.name}</td>
                        <td>{t.plan}</td>
                        <td style={{ fontWeight: '600' }}>{t.vehicles} EV</td>
                        <td><span className={`sa-badge ${t.bg}`}>{t.st}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="sa-card">
              <div className="sa-card-hdr">
                <span className="sa-card-title">System Infrastructure Status</span>
                <a href="/settings" className="sa-link-all">System Health</a>
              </div>
              <div className="sa-card-body" style={{ gap: '10px' }}>
                {[
                  { name: 'API Gateway & Services', status: 'Operational', pct: '99.98%' },
                  { name: 'MongoDB / PostgreSQL Cluster', status: 'Operational', pct: '100%' },
                  { name: 'MQTT Broker & IoT Ingestion', status: 'Operational', pct: '99.95%' },
                  { name: 'Push & Notification Service', status: 'Operational', pct: '99.91%' }
                ].map(s => (
                  <div key={s.name} style={{ display: 'flex', flexDirection: 'column', gap: '4px', borderBottom: '1px solid #F1F5F9', paddingBottom: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', fontWeight: '700' }}>
                      <span>{s.name}</span>
                      <span style={{ color: '#10B981' }}>{s.status} ({s.pct})</span>
                    </div>
                    <div className="sa-prog-bar-bg"><div className="sa-prog-bar-fill" style={{ width: s.pct, background: '#10B981' }} /></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="sa-card">
              <div className="sa-card-hdr"><span className="sa-card-title">Quick Actions</span></div>
              <div className="sa-card-body" style={{ gap: '10px' }}>
                <a href="/super-admin/franchise-onboarding" className="sa-export-btn" style={{ justifyContent: 'center' }}>+ Onboard New Franchise</a>
                <a href="/super-admin/subscriptions" className="sa-date-box" style={{ justifyContent: 'center' }}>Configure Subscriptions</a>
                <a href="/super-admin/white-label" className="sa-date-box" style={{ justifyContent: 'center' }}>White Label Branding</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────── */
/* ── 2. FRANCHISE ADMIN ROLE DASHBOARD ─────────────────── */
/* ──────────────────────────────────────────────────────── */
function FranchiseAdminRoleDashboard() {
  return (
    <div className="ev-shell">
      <Sidebar activePath="/" />
      <div className="ev-main">
        <TopBar title="Franchise Admin Dashboard" subtitle="Real-time operations, fleet performance, and zone metrics across your franchise." hideZone={false} />

        <div className="ev-body">
          <div className="sa-sub-header">
            <div className="sa-sub-title-group">
              <h2 className="sa-sub-title">Fleet & Franchise Operations</h2>
              <span className="sa-sub-desc">Live performance summary across all managed zones</span>
            </div>
            <div className="sa-sub-right">
              <div className="sa-date-box">
                <span>Today (May 18, 2024)</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/></svg>
              </div>
              <button className="sa-export-btn">+ Register New Vehicle</button>
            </div>
          </div>

          <div className="sa-kpi-row-5">
            {[
              { label: 'Total Fleet', val: '1,420', change: '10.1%', up: true, bg: '#EEF2FF', color: '#6366F1', ic: '🚲' },
              { label: 'Active Rides', val: '384', change: '15.4%', up: true, bg: '#ECFDF5', color: '#10B981', ic: '⚡' },
              { label: 'Today Revenue', val: '₹1,84,500', change: '12.8%', up: true, bg: '#EFF6FF', color: '#2563EB', ic: '₹' },
              { label: 'Total Riders', val: '12,450', change: '8.3%', up: true, bg: '#F3E8FF', color: '#7E22CE', ic: '👥' },
              { label: 'Active Zones', val: '8', change: '100% Online', up: true, bg: '#ECFDF5', color: '#10B981', ic: '📍' }
            ].map(k => (
              <div key={k.label} className="sa-kpi-card">
                <div className="sa-kpi-card-top">
                  <span className="sa-kpi-card-lbl">{k.label}</span>
                  <span className="sa-kpi-card-ic" style={{ background: k.bg, color: k.color, fontWeight: 'bold' }}>{k.ic}</span>
                </div>
                <div className="sa-kpi-card-val"><AnimatedCount value={k.val} /></div>
                <div className="sa-kpi-card-bot">
                  <span className="sa-kpi-card-trend-up">↑ {k.change}</span>
                  <span>vs yesterday</span>
                </div>
              </div>
            ))}
          </div>

          <div className="sa-row-1-grid">
            <div className="sa-card">
              <div className="sa-card-hdr">
                <span className="sa-card-title">Ride Operations & Revenue Trend</span>
                <select className="sa-select-light"><option>Last 7 Days</option></select>
              </div>
              <div className="sa-card-body">
                <div style={{ height: '180px', position: 'relative' }}>
                  <Line
                    data={{
                      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                      datasets: [
                        { label: 'Rides Completed', data: [310, 420, 380, 510, 620, 780, 850], borderColor: '#6366F1', backgroundColor: 'rgba(99, 102, 241, 0.12)', fill: true, tension: 0.4 },
                        { label: 'Revenue (₹k)', data: [120, 145, 135, 170, 210, 260, 290], borderColor: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.12)', fill: true, tension: 0.4 }
                      ]
                    }}
                    options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: true, position: 'top' } } }}
                  />
                </div>
              </div>
            </div>

            <div className="sa-card">
              <div className="sa-card-hdr"><span className="sa-card-title">Fleet Availability Status</span></div>
              <div className="sa-card-body" style={{ alignItems: 'center' }}>
                <div className="sa-donut-wrap">
                  <Doughnut
                    data={{
                      labels: ['In Ride', 'Available', 'Charging', 'Maintenance'],
                      datasets: [{ data: [384, 716, 220, 100], backgroundColor: ['#6366F1', '#10B981', '#F59E0B', '#EF4444'] }]
                    }}
                    options={{ responsive: true, maintainAspectRatio: false, cutout: '70%', plugins: { legend: { display: false } } }}
                  />
                  <div className="sa-donut-center">
                    <span className="sa-donut-num">1,420</span>
                    <span className="sa-donut-lbl">Fleet</span>
                  </div>
                </div>
                <div className="sa-donut-legends">
                  <div className="sa-donut-leg-row"><span>In Ride</span><span className="sa-donut-leg-val">384 (27%)</span></div>
                  <div className="sa-donut-leg-row"><span>Available</span><span className="sa-donut-leg-val">716 (50%)</span></div>
                  <div className="sa-donut-leg-row"><span>Charging</span><span className="sa-donut-leg-val">220 (15%)</span></div>
                  <div className="sa-donut-leg-row"><span>Maintenance</span><span className="sa-donut-leg-val">100 (8%)</span></div>
                </div>
              </div>
            </div>

            <div className="sa-card">
              <div className="sa-card-hdr">
                <span className="sa-card-title">Top Zones by Rides</span>
                <a href="/zones" className="sa-link-all">View All</a>
              </div>
              <div className="sa-card-body">
                <div className="sa-rank-list">
                  {[
                    { name: 'Gotri Central Zone', val: '812 Rides', color: '#6366F1' },
                    { name: 'Connaught Place Hub', val: '645 Rides', color: '#10B981' },
                    { name: 'Indiranagar Station', val: '510 Rides', color: '#F59E0B' },
                    { name: 'Koramangala Zone', val: '438 Rides', color: '#3B82F6' }
                  ].map((z, idx) => (
                    <div key={z.name} className="sa-rank-row">
                      <div className="sa-rank-left">
                        <span className="sa-rank-circle" style={{ background: z.color }}>{idx + 1}</span>
                        <span className="sa-rank-name">{z.name}</span>
                      </div>
                      <span className="sa-rank-val">{z.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="sa-row-2-grid">
            <div className="sa-card">
              <div className="sa-card-hdr">
                <span className="sa-card-title">Active Fleet Operations</span>
                <a href="/vehicles/active" className="sa-link-all">Live Rides</a>
              </div>
              <div className="sa-card-body" style={{ padding: 0 }}>
                <table className="sa-table">
                  <thead>
                    <tr><th>Vehicle Plate</th><th>Rider Name</th><th>Current Zone</th><th>Battery %</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {[
                      { plate: 'EVM-901', rider: 'Amit Kumar', zone: 'Gotri Zone', battery: '92%', st: 'In Ride', bg: 'sa-badge-blue' },
                      { plate: 'EVM-804', rider: 'Neha Gupta', zone: 'CP Hub', battery: '78%', st: 'In Ride', bg: 'sa-badge-blue' },
                      { plate: 'EVM-755', rider: 'Rohit Singh', zone: 'Indiranagar', battery: '64%', st: 'Available', bg: 'sa-badge-green' },
                      { plate: 'EVM-612', rider: 'Sneha Reddy', zone: 'South Depot', battery: '18%', st: 'Charging', bg: 'sa-badge-orange' }
                    ].map(v => (
                      <tr key={v.plate}>
                        <td style={{ fontWeight: '800', fontFamily: 'Outfit' }}>{v.plate}</td>
                        <td>{v.rider}</td>
                        <td>{v.zone}</td>
                        <td style={{ fontWeight: '700' }}>{v.battery}</td>
                        <td><span className={`sa-badge ${v.bg}`}>{v.st}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="sa-card">
              <div className="sa-card-hdr">
                <span className="sa-card-title">Franchise Staff & Role Assignment</span>
                <a href="/franchise-users" className="sa-link-all">Users & Roles</a>
              </div>
              <div className="sa-card-body" style={{ padding: 0 }}>
                <table className="sa-table">
                  <thead>
                    <tr><th>Staff Member</th><th>Role</th><th>Hub Assigned</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {[
                      { name: 'Karan Malhotra', role: 'Franchise Owner', hub: 'Koramangala Hub', st: 'Active', bg: 'sa-badge-purple' },
                      { name: 'Rohit Sharma', role: 'Operations Mgr', hub: 'South Depot Zone', st: 'Active', bg: 'sa-badge-green' },
                      { name: 'Vikram Singh', role: 'Technician Mgr', hub: 'Indiranagar Hub', st: 'Active', bg: 'sa-badge-blue' }
                    ].map(u => (
                      <tr key={u.name}>
                        <td style={{ fontWeight: '700' }}>{u.name}</td>
                        <td><span className="sa-badge sa-badge-purple">{u.role}</span></td>
                        <td>{u.hub}</td>
                        <td><span className={`sa-badge ${u.bg}`}>{u.st}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────── */
/* ── 3. ZONE MANAGER ROLE DASHBOARD (SUPER ADMIN STYLE) ─── */
/* ──────────────────────────────────────────────────────── */
function ZoneManagerRoleDashboard() {
  return (
    <div className="ev-shell">
      <Sidebar activePath="/" />
      <div className="ev-main">
        <TopBar title="Zone Admin Dashboard" subtitle="Live Zone Monitoring, Battery Swap Cabinets, Fleet Telemetry & Zone Performance" hideZone={false} />

        <div className="ev-body">
          <div className="sa-sub-header">
            <div className="sa-sub-title-group">
              <h2 className="sa-sub-title">Connaught Place Zone Performance</h2>
              <span className="sa-sub-desc">Live geofence telemetry, battery swapping analytics & hub operations</span>
            </div>
            <div className="sa-sub-right">
              <div className="sa-date-box">
                <span>01 May 2024 - 31 May 2024</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/></svg>
              </div>
              <button className="sa-export-btn">Export Zone Report</button>
            </div>
          </div>

          {/* 5 Top KPI Cards */}
          <div className="sa-kpi-row-5">
            {[
              { label: 'Zone Fleet', val: '412 EVs', change: '8.5%', up: true, bg: '#EEF2FF', color: '#6366F1', ic: '🛵' },
              { label: 'Available Batteries', val: '184', change: '94% Charged', up: true, bg: '#ECFDF5', color: '#10B981', ic: '🔋' },
              { label: 'Active Swap Stations', val: '8 / 8', change: '100% Online', up: true, bg: '#ECFDF5', color: '#10B981', ic: '⚡' },
              { label: 'Swaps Today', val: '92 Swaps', change: '12% vs yesterday', up: true, bg: '#F3E8FF', color: '#7E22CE', ic: '🔄' },
              { label: 'Zone Daily Revenue', val: '₹48,200', change: '18% vs last week', up: true, bg: '#EFF6FF', color: '#2563EB', ic: '₹' }
            ].map(k => (
              <div key={k.label} className="sa-kpi-card">
                <div className="sa-kpi-card-top">
                  <span className="sa-kpi-card-lbl">{k.label}</span>
                  <span className="sa-kpi-card-ic" style={{ background: k.bg, color: k.color, fontWeight: 'bold' }}>{k.ic}</span>
                </div>
                <div className="sa-kpi-card-val"><AnimatedCount value={k.val} /></div>
                <div className="sa-kpi-card-bot">
                  <span className="sa-kpi-card-trend-up">↑ {k.change}</span>
                  <span>vs last period</span>
                </div>
              </div>
            ))}
          </div>

          {/* Row 1 Grid: Line Chart, Doughnut Chart, Top Swap Stations */}
          <div className="sa-row-1-grid">
            <div className="sa-card">
              <div className="sa-card-hdr">
                <span className="sa-card-title">Zone Ride Demand & Battery Swaps (24h Trend)</span>
                <select className="sa-select-light"><option>Today</option></select>
              </div>
              <div className="sa-card-body">
                <div style={{ height: '180px', position: 'relative' }}>
                  <Line
                    data={{
                      labels: ['06:00', '09:00', '12:00', '15:00', '18:00', '21:00', '00:00'],
                      datasets: [
                        { label: 'Active Rides', data: [80, 190, 240, 310, 380, 290, 140], borderColor: '#6366F1', backgroundColor: 'rgba(99, 102, 241, 0.12)', fill: true, tension: 0.4 },
                        { label: 'Battery Swaps', data: [12, 35, 48, 62, 92, 54, 20], borderColor: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.12)', fill: true, tension: 0.4 }
                      ]
                    }}
                    options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: true, position: 'top' } } }}
                  />
                </div>
              </div>
            </div>

            <div className="sa-card">
              <div className="sa-card-hdr"><span className="sa-card-title">Battery SOC Distribution</span></div>
              <div className="sa-card-body" style={{ alignItems: 'center' }}>
                <div className="sa-donut-wrap">
                  <Doughnut
                    data={{
                      labels: ['Fully Charged (>80%)', 'Medium (40-80%)', 'Low Battery (<40%)', 'In Charging Station'],
                      datasets: [{ data: [112, 48, 14, 10], backgroundColor: ['#10B981', '#6366F1', '#F97316', '#8B5CF6'] }]
                    }}
                    options={{ responsive: true, maintainAspectRatio: false, cutout: '70%', plugins: { legend: { display: false } } }}
                  />
                  <div className="sa-donut-center">
                    <span className="sa-donut-num">184</span>
                    <span className="sa-donut-lbl">Batteries</span>
                  </div>
                </div>
                <div className="sa-donut-legends">
                  <div className="sa-donut-leg-row"><span>Charged (&gt;80%)</span><span className="sa-donut-leg-val">112 (60.8%)</span></div>
                  <div className="sa-donut-leg-row"><span>Medium (40-80%)</span><span className="sa-donut-leg-val">48 (26.1%)</span></div>
                  <div className="sa-donut-leg-row"><span>Low (&lt;40%)</span><span className="sa-donut-leg-val">14 (7.6%)</span></div>
                  <div className="sa-donut-leg-row"><span>Charging</span><span className="sa-donut-leg-val">10 (5.5%)</span></div>
                </div>
              </div>
            </div>

            <div className="sa-card">
              <div className="sa-card-hdr">
                <span className="sa-card-title">Top Swap Cabinets</span>
                <a href="/battery" className="sa-link-all">View All</a>
              </div>
              <div className="sa-card-body">
                <div className="sa-rank-list">
                  {[
                    { name: 'CP Hub Station A', val: '342 Swaps', color: '#6366F1' },
                    { name: 'CP Metro Gate 2 Cabinet', val: '289 Swaps', color: '#10B981' },
                    { name: 'Janpath Crossing Hub', val: '210 Swaps', color: '#F59E0B' },
                    { name: 'Barakhamba Road Station', val: '154 Swaps', color: '#8B5CF6' }
                  ].map((s, idx) => (
                    <div key={s.name} className="sa-rank-row">
                      <div className="sa-rank-left">
                        <span className="sa-rank-circle" style={{ background: s.color }}>{idx + 1}</span>
                        <span className="sa-rank-name">{s.name}</span>
                      </div>
                      <span className="sa-rank-val">{s.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 6 Small KPIs Row */}
          <div className="sa-kpi-row-6">
            {[
              { label: 'Active Riders Online', val: '315', change: '14.2%', up: true, bg: '#EEF2FF', color: '#6366F1', ic: '👤' },
              { label: 'Avg Swap Time', val: '1.8 min', change: '0.4m faster', up: true, bg: '#ECFDF5', color: '#10B981', ic: '⏱️' },
              { label: 'Geofence Violations', val: '0', change: 'Zero breaches', up: true, bg: '#ECFDF5', color: '#10B981', ic: '🛡️' },
              { label: 'Fleet Uptime', val: '99.2%', change: 'Optimal', up: true, bg: '#ECFDF5', color: '#10B981', ic: '📈' },
              { label: 'Maintenance Pending', val: '3 Bikes', change: 'In workshop', up: false, bg: '#FFF7ED', color: '#F97316', ic: '🛠️' },
              { label: 'Revenue / Rider', val: '₹153', change: '8.4%', up: true, bg: '#EEF2FF', color: '#6366F1', ic: '💳' }
            ].map(k => (
              <div key={k.label} className="sa-kpi-card" style={{ padding: '12px' }}>
                <div className="sa-kpi-card-top">
                  <span className="sa-kpi-card-lbl" style={{ fontSize: '9.5px' }}>{k.label}</span>
                  <span className="sa-kpi-card-ic" style={{ width: '28px', height: '28px', background: k.bg, color: k.color }}>{k.ic}</span>
                </div>
                <div className="sa-kpi-card-val" style={{ fontSize: '18px', margin: '6px 0 2px' }}><AnimatedCount value={k.val} /></div>
                <div className="sa-kpi-card-bot" style={{ fontSize: '9.5px' }}>
                  <span className={k.up ? 'sa-kpi-card-trend-up' : 'sa-kpi-card-trend-dn'}>{k.up ? '↑' : '↓'} {k.change}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Row 3 Data Grid: Fleet Overview & Cabinets */}
          <div className="sa-row-3-grid">
            <div className="sa-card">
              <div className="sa-card-hdr">
                <span className="sa-card-title">Live Zone Fleet Telemetry</span>
                <a href="/vehicles" className="sa-link-all">View All Fleet</a>
              </div>
              <div className="sa-card-body" style={{ padding: 0 }}>
                <table className="sa-table">
                  <thead>
                    <tr><th>Vehicle Plate</th><th>Rider Name</th><th>Battery SOC</th><th>Current Location</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {[
                      { plate: 'EVM-901', rider: 'Amit Kumar', battery: '92%', loc: 'Connaught Inner Circle', st: 'Active Ride', bg: 'sa-badge-green' },
                      { plate: 'EVM-804', rider: 'Neha Gupta', battery: '78%', loc: 'Barakhamba Road', st: 'Active Ride', bg: 'sa-badge-green' },
                      { plate: 'EVM-755', rider: 'Rohit Singh', battery: '64%', loc: 'Janpath Hub', st: 'Available', bg: 'sa-badge-blue' },
                      { plate: 'EVM-612', rider: 'Sneha Reddy', battery: '18%', loc: 'Metro Gate 2 Cabinet', st: 'Charging', bg: 'sa-badge-orange' }
                    ].map(v => (
                      <tr key={v.plate}>
                        <td style={{ fontWeight: '800', fontFamily: 'Outfit' }}>{v.plate}</td>
                        <td>{v.rider}</td>
                        <td style={{ fontWeight: '700' }}>{v.battery}</td>
                        <td>{v.loc}</td>
                        <td><span className={`sa-badge ${v.bg}`}>{v.st}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="sa-card">
              <div className="sa-card-hdr">
                <span className="sa-card-title">Cabinet Capacity & Live Status</span>
                <a href="/battery" className="sa-link-all">Manage Cabinets</a>
              </div>
              <div className="sa-card-body" style={{ gap: '14px' }}>
                {[
                  { name: 'CP Hub Station A', charged: 24, total: 32, pct: '75%', color: '#10B981' },
                  { name: 'CP Metro Gate 2 Cabinet', charged: 14, total: 16, pct: '87%', color: '#10B981' },
                  { name: 'Janpath Crossing Hub', charged: 6, total: 12, pct: '50%', color: '#F59E0B' },
                  { name: 'Barakhamba Road Station', charged: 2, total: 8, pct: '25%', color: '#EF4444' }
                ].map(st => (
                  <div key={st.name} style={{ display: 'flex', flexDirection: 'column', gap: '4px', borderBottom: '1px solid #F1F5F9', paddingBottom: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '700' }}>
                      <span>{st.name}</span>
                      <span style={{ color: st.color }}>{st.charged}/{st.total} Charged ({st.pct})</span>
                    </div>
                    <div className="sa-prog-bar-bg"><div className="sa-prog-bar-fill" style={{ width: st.pct, background: st.color }} /></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────── */
/* ── 4. OPERATIONS MANAGER DASHBOARD (SUPER ADMIN STYLE) ─ */
/* ──────────────────────────────────────────────────────── */
function GroundOperationsRoleDashboard() {
  return (
    <div className="ev-shell">
      <Sidebar activePath="/" />
      <div className="ev-main">
        <TopBar title="Operations Manager Dashboard" subtitle="Real-time Fleet Dispatch, Active Rides, Driver Logistics & On-Field Telemetry" hideZone={false} />

        <div className="ev-body">
          <div className="sa-sub-header">
            <div className="sa-sub-title-group">
              <h2 className="sa-sub-title">Fleet Dispatch & Daily Logistics</h2>
              <span className="sa-sub-desc">Active ride tracking, vehicle dispatch health & field technician coordination</span>
            </div>
            <div className="sa-sub-right">
              <div className="sa-date-box">
                <span>Today (Live Operations)</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/></svg>
              </div>
              <a href="/new-rider" className="sa-export-btn">+ Register New Dispatch</a>
            </div>
          </div>

          {/* 5 Top KPI Cards */}
          <div className="sa-kpi-row-5">
            {[
              { label: 'Total Operations Fleet', val: '1,250 EVs', change: '10.2%', up: true, bg: '#EEF2FF', color: '#6366F1', ic: '🛵' },
              { label: 'Active Rides On-Road', val: '890 Rides', change: '15.4%', up: true, bg: '#ECFDF5', color: '#10B981', ic: '🛣️' },
              { label: 'Swaps Executed Today', val: '1,420 Swaps', change: '9.8%', up: true, bg: '#F3E8FF', color: '#7E22CE', ic: '⚡' },
              { label: 'On-Field Technicians', val: '34 Active', change: '100% On-Duty', up: true, bg: '#EEF2FF', color: '#2563EB', ic: '🛠️' },
              { label: 'Daily Ops Revenue', val: '₹3,45,800', change: '14.1%', up: true, bg: '#ECFDF5', color: '#10B981', ic: '₹' }
            ].map(k => (
              <div key={k.label} className="sa-kpi-card">
                <div className="sa-kpi-card-top">
                  <span className="sa-kpi-card-lbl">{k.label}</span>
                  <span className="sa-kpi-card-ic" style={{ background: k.bg, color: k.color, fontWeight: 'bold' }}>{k.ic}</span>
                </div>
                <div className="sa-kpi-card-val"><AnimatedCount value={k.val} /></div>
                <div className="sa-kpi-card-bot">
                  <span className="sa-kpi-card-trend-up">↑ {k.change}</span>
                  <span>vs last week</span>
                </div>
              </div>
            ))}
          </div>

          {/* Row 1 Grid */}
          <div className="sa-row-1-grid">
            <div className="sa-card">
              <div className="sa-card-hdr">
                <span className="sa-card-title">Fleet Operations & Dispatch Telemetry</span>
                <select className="sa-select-light"><option>Hourly View</option></select>
              </div>
              <div className="sa-card-body">
                <div style={{ height: '180px', position: 'relative' }}>
                  <Line
                    data={{
                      labels: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'],
                      datasets: [
                        { label: 'Dispatched Rides', data: [310, 520, 680, 750, 890, 820, 540], borderColor: '#6366F1', backgroundColor: 'rgba(99, 102, 241, 0.12)', fill: true, tension: 0.4 },
                        { label: 'Swaps Processed', data: [120, 240, 310, 420, 510, 480, 290], borderColor: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.12)', fill: true, tension: 0.4 }
                      ]
                    }}
                    options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: true, position: 'top' } } }}
                  />
                </div>
              </div>
            </div>

            <div className="sa-card">
              <div className="sa-card-hdr"><span className="sa-card-title">Fleet Operational Status</span></div>
              <div className="sa-card-body" style={{ alignItems: 'center' }}>
                <div className="sa-donut-wrap">
                  <Doughnut
                    data={{
                      labels: ['On Active Ride (71%)', 'Available at Hub (18%)', 'In Swap/Charging (7%)', 'Under Maintenance (4%)'],
                      datasets: [{ data: [890, 225, 85, 50], backgroundColor: ['#10B981', '#6366F1', '#F59E0B', '#EF4444'] }]
                    }}
                    options={{ responsive: true, maintainAspectRatio: false, cutout: '70%', plugins: { legend: { display: false } } }}
                  />
                  <div className="sa-donut-center">
                    <span className="sa-donut-num">1,250</span>
                    <span className="sa-donut-lbl">Total EVs</span>
                  </div>
                </div>
                <div className="sa-donut-legends">
                  <div className="sa-donut-leg-row"><span>Active Ride</span><span className="sa-donut-leg-val">890 (71.2%)</span></div>
                  <div className="sa-donut-leg-row"><span>Available</span><span className="sa-donut-leg-val">225 (18.0%)</span></div>
                  <div className="sa-donut-leg-row"><span>Charging</span><span className="sa-donut-leg-val">85 (6.8%)</span></div>
                  <div className="sa-donut-leg-row"><span>Maintenance</span><span className="sa-donut-leg-val">50 (4.0%)</span></div>
                </div>
              </div>
            </div>

            <div className="sa-card">
              <div className="sa-card-hdr">
                <span className="sa-card-title">Top Operating Corridors</span>
                <a href="/zones" className="sa-link-all">View All</a>
              </div>
              <div className="sa-card-body">
                <div className="sa-rank-list">
                  {[
                    { name: 'Gotri to Alkapuri Corridor', val: '420 Trips', color: '#6366F1' },
                    { name: 'CP to Janpath Ring', val: '380 Trips', color: '#10B981' },
                    { name: 'Akota Hub Transit Line', val: '290 Trips', color: '#F59E0B' },
                    { name: 'Subhanpura Express Way', val: '195 Trips', color: '#3B82F6' }
                  ].map((c, idx) => (
                    <div key={c.name} className="sa-rank-row">
                      <div className="sa-rank-left">
                        <span className="sa-rank-circle" style={{ background: c.color }}>{idx + 1}</span>
                        <span className="sa-rank-name">{c.name}</span>
                      </div>
                      <span className="sa-rank-val">{c.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 6 Small KPIs Row */}
          <div className="sa-kpi-row-6">
            {[
              { label: 'Avg Speed', val: '28 km/h', change: 'Safe driving', up: true, bg: '#EEF2FF', color: '#6366F1', ic: '💨' },
              { label: 'Critical Telemetry Alerts', val: '2 Alerts', change: 'Requires check', up: false, bg: '#FEF2F2', color: '#EF4444', ic: '⚠️' },
              { label: 'Low Battery Bikes', val: '14 Bikes', change: 'En route to swap', up: false, bg: '#FFF7ED', color: '#F97316', ic: '🔋' },
              { label: 'Dispatch Efficiency', val: '96.8%', change: 'High performance', up: true, bg: '#ECFDF5', color: '#10B981', ic: '🎯' },
              { label: 'Breakdown Response', val: '8.5 min', change: '2.1m faster', up: true, bg: '#ECFDF5', color: '#10B981', ic: '⏱️' },
              { label: 'Daily Distance Covered', val: '14,850 km', change: '12.4%', up: true, bg: '#EEF2FF', color: '#6366F1', ic: '🛣️' }
            ].map(k => (
              <div key={k.label} className="sa-kpi-card" style={{ padding: '12px' }}>
                <div className="sa-kpi-card-top">
                  <span className="sa-kpi-card-lbl" style={{ fontSize: '9.5px' }}>{k.label}</span>
                  <span className="sa-kpi-card-ic" style={{ width: '28px', height: '28px', background: k.bg, color: k.color }}>{k.ic}</span>
                </div>
                <div className="sa-kpi-card-val" style={{ fontSize: '18px', margin: '6px 0 2px' }}><AnimatedCount value={k.val} /></div>
                <div className="sa-kpi-card-bot" style={{ fontSize: '9.5px' }}>
                  <span className={k.up ? 'sa-kpi-card-trend-up' : 'sa-kpi-card-trend-dn'}>{k.up ? '↑' : '↓'} {k.change}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Table & Field Team Grid */}
          <div className="sa-row-3-grid">
            <div className="sa-card">
              <div className="sa-card-hdr">
                <span className="sa-card-title">Live Dispatch & Fleet Activity</span>
                <a href="/renters" className="sa-link-all">View All Activity</a>
              </div>
              <div className="sa-card-body" style={{ padding: 0 }}>
                <table className="sa-table">
                  <thead>
                    <tr><th>Request ID</th><th>Type</th><th>Rider Name</th><th>Mobile</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {[
                      { id: 'REQ-2024-0518-0012', type: 'New Ride', name: 'Amit Kumar', mob: '+91 98765 43210', st: 'Completed', bg: 'sa-badge-green' },
                      { id: 'REQ-2024-0518-0011', type: 'Retain Ride', name: 'Neha Gupta', mob: '+91 91254 56789', st: 'Pending', bg: 'sa-badge-orange' },
                      { id: 'REQ-2024-0518-0010', type: 'Return Ride', name: 'Rohit Singh', mob: '+91 99876 54321', st: 'In Progress', bg: 'sa-badge-blue' },
                      { id: 'REQ-2024-0518-0009', type: 'Extend Ride', name: 'Sneha Reddy', mob: '+91 87654 32109', st: 'Completed', bg: 'sa-badge-green' }
                    ].map(r => (
                      <tr key={r.id}>
                        <td style={{ fontWeight: '800', fontFamily: 'Outfit' }}>{r.id}</td>
                        <td><span className="sa-badge sa-badge-purple">{r.type}</span></td>
                        <td style={{ fontWeight: '700' }}>{r.name}</td>
                        <td>{r.mob}</td>
                        <td><span className={`sa-badge ${r.bg}`}>{r.st}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="sa-card">
              <div className="sa-card-hdr">
                <span className="sa-card-title">On-Field Tech Teams & Status</span>
                <a href="/users" className="sa-link-all">Manage Team</a>
              </div>
              <div className="sa-card-body" style={{ padding: 0 }}>
                <table className="sa-table">
                  <thead>
                    <tr><th>Tech Name</th><th>Assigned Zone</th><th>Active Task</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {[
                      { name: 'Vikram Singh', zone: 'Gotri Zone', task: 'Battery Swapping', st: 'Active', bg: 'sa-badge-green' },
                      { name: 'Rahul Verma', zone: 'CP Hub Zone', task: 'Motor Inspection', st: 'In Workshop', bg: 'sa-badge-blue' },
                      { name: 'Suresh Mehta', zone: 'Akota Hub', task: 'Fleet Dispatch', st: 'Active', bg: 'sa-badge-green' }
                    ].map(t => (
                      <tr key={t.name}>
                        <td style={{ fontWeight: '700' }}>{t.name}</td>
                        <td>{t.zone}</td>
                        <td>{t.task}</td>
                        <td><span className={`sa-badge ${t.bg}`}>{t.st}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────── */
/* ── 5. SUPPORT EXECUTIVE ROLE DASHBOARD (SUPER ADMIN) ─── */
/* ──────────────────────────────────────────────────────── */
function SupportExecutiveRoleDashboard() {
  return (
    <div className="ev-shell">
      <Sidebar activePath="/" />
      <div className="ev-main">
        <TopBar title="Support Executive Dashboard" subtitle="Customer Tickets, Rider Complaints, Reservation Assistance & Live Support Telemetry" hideZone={false} />

        <div className="ev-body">
          <div className="sa-sub-header">
            <div className="sa-sub-title-group">
              <h2 className="sa-sub-title">Rider Support & Service Telemetry</h2>
              <span className="sa-sub-desc">Real-time rider tickets, complaint resolution status & reservation desk</span>
            </div>
            <div className="sa-sub-right">
              <div className="sa-date-box">
                <span>Today (Support Shift)</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/></svg>
              </div>
              <button className="sa-export-btn">+ Create Support Ticket</button>
            </div>
          </div>

          {/* 5 Top KPI Cards */}
          <div className="sa-kpi-row-5">
            {[
              { label: 'Open Support Tickets', val: '14 Open', change: '18.5%', up: true, bg: '#FEF2F2', color: '#EF4444', ic: '🎧' },
              { label: 'Resolved Today', val: '142 Tickets', change: '12.3%', up: true, bg: '#ECFDF5', color: '#10B981', ic: '✅' },
              { label: 'Avg First Response', val: '1.4 min', change: '0.3m faster', up: true, bg: '#EFF6FF', color: '#2563EB', ic: '⏱️' },
              { label: 'Customer Satisfaction', val: '98.4%', change: '2.1%', up: true, bg: '#EEF2FF', color: '#6366F1', ic: '⭐' },
              { label: 'Active Reservations', val: '320 Active', change: '8.7%', up: true, bg: '#F3E8FF', color: '#7E22CE', ic: '📅' }
            ].map(k => (
              <div key={k.label} className="sa-kpi-card">
                <div className="sa-kpi-card-top">
                  <span className="sa-kpi-card-lbl">{k.label}</span>
                  <span className="sa-kpi-card-ic" style={{ background: k.bg, color: k.color, fontWeight: 'bold' }}>{k.ic}</span>
                </div>
                <div className="sa-kpi-card-val"><AnimatedCount value={k.val} /></div>
                <div className="sa-kpi-card-bot">
                  <span className="sa-kpi-card-trend-up">↑ {k.change}</span>
                  <span>vs last shift</span>
                </div>
              </div>
            ))}
          </div>

          {/* Row 1 Grid */}
          <div className="sa-row-1-grid">
            <div className="sa-card">
              <div className="sa-card-hdr">
                <span className="sa-card-title">Support Ticket Volume & Resolution Speed</span>
                <select className="sa-select-light"><option>Today</option></select>
              </div>
              <div className="sa-card-body">
                <div style={{ height: '180px', position: 'relative' }}>
                  <Line
                    data={{
                      labels: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'],
                      datasets: [
                        { label: 'Incoming Tickets', data: [15, 32, 45, 50, 38, 24, 12], borderColor: '#EF4444', backgroundColor: 'rgba(239, 68, 68, 0.12)', fill: true, tension: 0.4 },
                        { label: 'Resolved Tickets', data: [12, 30, 42, 48, 36, 22, 11], borderColor: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.12)', fill: true, tension: 0.4 }
                      ]
                    }}
                    options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: true, position: 'top' } } }}
                  />
                </div>
              </div>
            </div>

            <div className="sa-card">
              <div className="sa-card-hdr"><span className="sa-card-title">Ticket Categories Breakdown</span></div>
              <div className="sa-card-body" style={{ alignItems: 'center' }}>
                <div className="sa-donut-wrap">
                  <Doughnut
                    data={{
                      labels: ['Unlock Issue (42%)', 'Payment Query (28%)', 'Swap Inquiry (18%)', 'General Info (12%)'],
                      datasets: [{ data: [65, 44, 28, 19], backgroundColor: ['#EF4444', '#6366F1', '#F59E0B', '#10B981'] }]
                    }}
                    options={{ responsive: true, maintainAspectRatio: false, cutout: '70%', plugins: { legend: { display: false } } }}
                  />
                  <div className="sa-donut-center">
                    <span className="sa-donut-num">156</span>
                    <span className="sa-donut-lbl">Today</span>
                  </div>
                </div>
                <div className="sa-donut-legends">
                  <div className="sa-donut-leg-row"><span>Unlock Issue</span><span className="sa-donut-leg-val">65 (41.7%)</span></div>
                  <div className="sa-donut-leg-row"><span>Payment Query</span><span className="sa-donut-leg-val">44 (28.2%)</span></div>
                  <div className="sa-donut-leg-row"><span>Swap Inquiry</span><span className="sa-donut-leg-val">28 (17.9%)</span></div>
                  <div className="sa-donut-leg-row"><span>General Info</span><span className="sa-donut-leg-val">19 (12.2%)</span></div>
                </div>
              </div>
            </div>

            <div className="sa-card">
              <div className="sa-card-hdr">
                <span className="sa-card-title">Top Agent Performers</span>
                <a href="/users" className="sa-link-all">View All</a>
              </div>
              <div className="sa-card-body">
                <div className="sa-rank-list">
                  {[
                    { name: 'Amit Kumar', val: '48 Resolved', color: '#10B981' },
                    { name: 'Neha Singh', val: '42 Resolved', color: '#6366F1' },
                    { name: 'Priya Sharma', val: '36 Resolved', color: '#F59E0B' },
                    { name: 'Suresh Mehta', val: '28 Resolved', color: '#3B82F6' }
                  ].map((a, idx) => (
                    <div key={a.name} className="sa-rank-row">
                      <div className="sa-rank-left">
                        <span className="sa-rank-circle" style={{ background: a.color }}>{idx + 1}</span>
                        <span className="sa-rank-name">{a.name}</span>
                      </div>
                      <span className="sa-rank-val">{a.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 6 Small KPIs Row */}
          <div className="sa-kpi-row-6">
            {[
              { label: 'SLA Adherence', val: '99.1%', change: 'Optimal', up: true, bg: '#ECFDF5', color: '#10B981', ic: '🎯' },
              { label: 'Live Chat Queue', val: '3 Waiting', change: 'In queue', up: false, bg: '#FFF7ED', color: '#F97316', ic: '💬' },
              { label: 'Pending Refunds', val: '₹4,200', change: '2 claims', up: false, bg: '#EEF2FF', color: '#2563EB', ic: '💳' },
              { label: 'Call Volume', val: '86 Calls', change: '9.4%', up: true, bg: '#EEF2FF', color: '#6366F1', ic: '📞' },
              { label: 'Escalated Tickets', val: '1 Escalated', change: 'Level 2', up: false, bg: '#FEF2F2', color: '#EF4444', ic: '🚨' },
              { label: 'App Feedback Score', val: '4.9 / 5', change: 'High rating', up: true, bg: '#ECFDF5', color: '#10B981', ic: '⭐' }
            ].map(k => (
              <div key={k.label} className="sa-kpi-card" style={{ padding: '12px' }}>
                <div className="sa-kpi-card-top">
                  <span className="sa-kpi-card-lbl" style={{ fontSize: '9.5px' }}>{k.label}</span>
                  <span className="sa-kpi-card-ic" style={{ width: '28px', height: '28px', background: k.bg, color: k.color }}>{k.ic}</span>
                </div>
                <div className="sa-kpi-card-val" style={{ fontSize: '18px', margin: '6px 0 2px' }}><AnimatedCount value={k.val} /></div>
                <div className="sa-kpi-card-bot" style={{ fontSize: '9.5px' }}>
                  <span className={k.up ? 'sa-kpi-card-trend-up' : 'sa-kpi-card-trend-dn'}>{k.up ? '↑' : '↓'} {k.change}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Table & Reservations Grid */}
          <div className="sa-row-3-grid">
            <div className="sa-card">
              <div className="sa-card-hdr">
                <span className="sa-card-title">Recent Rider Support Tickets</span>
                <a href="/alerts" className="sa-link-all">View All Tickets</a>
              </div>
              <div className="sa-card-body" style={{ padding: 0 }}>
                <table className="sa-table">
                  <thead>
                    <tr><th>Ticket ID</th><th>Rider Name</th><th>Issue Category</th><th>Priority</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {[
                      { id: '#TCK-9901', rider: 'Rajesh Kumar', category: 'Unlock Scooter Failure', priority: 'High', st: 'In Progress', bg: 'sa-badge-red' },
                      { id: '#TCK-9900', rider: 'Pooja Verma', category: 'Deposit Refund Status', priority: 'Medium', st: 'Open', bg: 'sa-badge-orange' },
                      { id: '#TCK-9899', rider: 'Vikram Singh', category: 'Swap Cabinet Door Jammed', priority: 'High', st: 'Resolved', bg: 'sa-badge-green' },
                      { id: '#TCK-9898', rider: 'Ananya Roy', category: 'Fare Discount Code Inquiry', priority: 'Low', st: 'Resolved', bg: 'sa-badge-green' }
                    ].map(t => (
                      <tr key={t.id}>
                        <td style={{ fontWeight: '800', fontFamily: 'Outfit' }}>{t.id}</td>
                        <td style={{ fontWeight: '700' }}>{t.rider}</td>
                        <td>{t.category}</td>
                        <td><span className={t.priority === 'High' ? 'sa-badge sa-badge-red' : 'sa-badge sa-badge-orange'}>{t.priority}</span></td>
                        <td><span className={`sa-badge ${t.bg}`}>{t.st}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="sa-card">
              <div className="sa-card-hdr">
                <span className="sa-card-title">Upcoming Rider Reservations</span>
                <a href="/renters/reserved" className="sa-link-all">View Desk</a>
              </div>
              <div className="sa-card-body" style={{ padding: 0 }}>
                <table className="sa-table">
                  <thead>
                    <tr><th>Reservation ID</th><th>Customer Name</th><th>Vehicle Type</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {[
                      { id: 'RES-2024-098', name: 'Kunal Shah', type: 'Evegah City E-Scooter', st: 'Confirmed', bg: 'sa-badge-green' },
                      { id: 'RES-2024-097', name: 'Deepak Malhotra', type: 'Evegah Pro Delivery', st: 'Pending Deposit', bg: 'sa-badge-orange' },
                      { id: 'RES-2024-096', name: 'Sunita Sharma', type: 'Evegah Mink Express', st: 'Confirmed', bg: 'sa-badge-green' }
                    ].map(r => (
                      <tr key={r.id}>
                        <td style={{ fontWeight: '800', fontFamily: 'Outfit' }}>{r.id}</td>
                        <td style={{ fontWeight: '700' }}>{r.name}</td>
                        <td>{r.type}</td>
                        <td><span className={`sa-badge ${r.bg}`}>{r.st}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────── */
/* ── 5. MAINTENANCE TECHNICIAN ROLE DASHBOARD ──────────── */
/* ──────────────────────────────────────────────────────── */
function MaintenanceTechnicianRoleDashboard() {
  return (
    <div className="ev-shell">
      <Sidebar activePath="/" />
      <div className="ev-main">
        <TopBar title="Maintenance & Fleet Engineer Dashboard" subtitle="Diagnostic telemetry, IoT device health, work order tickets, and battery swapping maintenance." hideZone={false} />

        <div className="ev-body">
          <div className="sa-sub-header">
            <div className="sa-sub-title-group">
              <h2 className="sa-sub-title">Fleet Diagnostics & Repairs</h2>
              <span className="sa-sub-desc">Active workshop tickets, hardware health, and maintenance schedule</span>
            </div>
            <div className="sa-sub-right">
              <a href="/maintenance" className="sa-export-btn">+ Create Work Order</a>
            </div>
          </div>

          <div className="sa-kpi-row-5">
            {[
              { label: 'In Workshop', val: '14', change: '3 urgent', up: false, bg: '#FEF2F2', color: '#EF4444', ic: '🔧' },
              { label: 'Critical IoT Alerts', val: '3', change: 'Requires attention', up: false, bg: '#FEF2F2', color: '#EF4444', ic: '🚨' },
              { label: 'Resolved Today', val: '86', change: '94% SLA', up: true, bg: '#ECFDF5', color: '#10B981', ic: '✓' },
              { label: 'Active Sensors', val: '1,280', change: '99.8% Online', up: true, bg: '#EEF2FF', color: '#6366F1', ic: '📡' },
              { label: 'Battery Health', val: '98.2%', change: 'Optimal', up: true, bg: '#ECFDF5', color: '#10B981', ic: '🔋' }
            ].map(k => (
              <div key={k.label} className="sa-kpi-card">
                <div className="sa-kpi-card-top">
                  <span className="sa-kpi-card-lbl">{k.label}</span>
                  <span className="sa-kpi-card-ic" style={{ background: k.bg, color: k.color, fontWeight: 'bold' }}>{k.ic}</span>
                </div>
                <div className="sa-kpi-card-val"><AnimatedCount value={k.val} /></div>
                <div className="sa-kpi-card-bot">
                  <span className={k.up ? 'sa-kpi-card-trend-up' : 'sa-kpi-card-trend-dn'}>{k.change}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="sa-card">
            <div className="sa-card-hdr">
              <span className="sa-card-title">Active Work Order Tickets</span>
              <a href="/maintenance" className="sa-link-all">View All Orders</a>
            </div>
            <div className="sa-card-body" style={{ padding: 0 }}>
              <table className="sa-table">
                <thead>
                  <tr><th>Ticket ID</th><th>Vehicle Plate</th><th>Diagnostic Issue</th><th>Priority</th><th>Assigned Engineer</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {[
                    { id: '#WO-9841', plate: 'EVM-402', issue: 'BMS Voltage Unbalance', priority: 'High', tech: 'Vikram Singh', st: 'In Workshop', bg: 'sa-badge-red' },
                    { id: '#WO-9840', plate: 'EVM-319', issue: 'Tire Pressure Sensor Offline', priority: 'Medium', tech: 'Rahul Verma', st: 'Inspecting', bg: 'sa-badge-orange' },
                    { id: '#WO-9839', plate: 'EVM-112', issue: 'Motor Controller Firmware Update', priority: 'Low', tech: 'Vikram Singh', st: 'Completed', bg: 'sa-badge-green' }
                  ].map(w => (
                    <tr key={w.id}>
                      <td style={{ fontWeight: '800', fontFamily: 'Outfit' }}>{w.id}</td>
                      <td style={{ fontWeight: '700' }}>{w.plate}</td>
                      <td>{w.issue}</td>
                      <td><span className={w.priority === 'High' ? 'sa-badge sa-badge-red' : 'sa-badge sa-badge-orange'}>{w.priority}</span></td>
                      <td>{w.tech}</td>
                      <td><span className={`sa-badge ${w.bg}`}>{w.st}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────── */
/* ── 6. FINANCE & ACCOUNTS ROLE DASHBOARD ──────────────── */
/* ──────────────────────────────────────────────────────── */
function FinanceAccountsRoleDashboard() {
  return (
    <div className="ev-shell">
      <Sidebar activePath="/" />
      <div className="ev-main">
        <TopBar title="Finance & Accounts Dashboard" subtitle="Financial analytics, billing collections, subscription payouts, and operational expenses." hideZone={false} />

        <div className="ev-body">
          <div className="sa-sub-header">
            <div className="sa-sub-title-group">
              <h2 className="sa-sub-title">Financial Summary & Revenue Collections</h2>
              <span className="sa-sub-desc">Monthly collections, payouts, and margin performance</span>
            </div>
            <div className="sa-sub-right">
              <a href="/franchise/expenses" className="sa-export-btn">View Expense Reports</a>
            </div>
          </div>

          <div className="sa-kpi-row-5">
            {[
              { label: 'Total Revenue', val: '₹28,45,900', change: '14.2%', up: true, bg: '#ECFDF5', color: '#10B981', ic: '₹' },
              { label: 'Monthly Collections', val: '₹12,40,000', change: '11.8%', up: true, bg: '#EFF6FF', color: '#2563EB', ic: '💳' },
              { label: 'Pending Invoices', val: '₹1,15,000', change: '3 Pending', up: false, bg: '#FFF7ED', color: '#F97316', ic: '📜' },
              { label: 'Franchise Payouts', val: '₹8,90,000', change: 'Processed', up: true, bg: '#EEF2FF', color: '#6366F1', ic: '🏦' },
              { label: 'Net Margin', val: '34.2%', change: 'Optimal', up: true, bg: '#ECFDF5', color: '#10B981', ic: '📊' }
            ].map(k => (
              <div key={k.label} className="sa-kpi-card">
                <div className="sa-kpi-card-top">
                  <span className="sa-kpi-card-lbl">{k.label}</span>
                  <span className="sa-kpi-card-ic" style={{ background: k.bg, color: k.color, fontWeight: 'bold' }}>{k.ic}</span>
                </div>
                <div className="sa-kpi-card-val"><AnimatedCount value={k.val} /></div>
                <div className="sa-kpi-card-bot">
                  <span className="sa-kpi-card-trend-up">↑ {k.change}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="sa-card">
            <div className="sa-card-hdr">
              <span className="sa-card-title">Recent Invoices & Transactions</span>
              <a href="/franchise/expenses" className="sa-link-all">View All</a>
            </div>
            <div className="sa-card-body" style={{ padding: 0 }}>
              <table className="sa-table">
                <thead>
                  <tr><th>Invoice No</th><th>Tenant / Customer</th><th>Payment Mode</th><th>Amount</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {[
                    { id: '#INV-2024-089', tenant: 'Gotri Mobility Hub', mode: 'UPI Direct', amt: '₹1,45,000', st: 'Success', bg: 'sa-badge-green' },
                    { id: '#INV-2024-088', tenant: 'Connaught Fleet Ltd', mode: 'Corporate Card', amt: '₹98,500', st: 'Success', bg: 'sa-badge-green' },
                    { id: '#INV-2024-087', tenant: 'Aatapi Eco Mobility', mode: 'Net Banking', amt: '₹62,000', st: 'Processing', bg: 'sa-badge-blue' }
                  ].map(inv => (
                    <tr key={inv.id}>
                      <td style={{ fontWeight: '800', fontFamily: 'Outfit' }}>{inv.id}</td>
                      <td style={{ fontWeight: '700' }}>{inv.tenant}</td>
                      <td>{inv.mode}</td>
                      <td style={{ fontWeight: '800' }}>{inv.amt}</td>
                      <td><span className={`sa-badge ${inv.bg}`}>{inv.st}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
