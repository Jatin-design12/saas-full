"use client";
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');

.ev-tb{height:70px;background:#fff;border-bottom:1px solid #E2E8F0;display:flex;align-items:center;padding:0 24px;gap:16px;position:sticky;top:0;z-index:90;flex-shrink:0;width:100%;box-sizing:border-box;font-family:'Plus Jakarta Sans',sans-serif}
.ev-tb-hamburger{width:36px;height:36px;border:1.5px solid #E2E8F0;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;cursor:pointer;background:#fff;transition:all 0.15s;flex-shrink:0}
.ev-tb-hamburger:hover{border-color:#6366F1;background:#F8FAFC}
.ev-tb-hamburger span{display:block;width:14px;height:1.8px;background:#64748B;border-radius:2px}
.ev-tb-user{display:flex;align-items:center;gap:12px}
.ev-tb-av{width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,#0F172A,#1E1B4B);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;color:#fff;flex-shrink:0;overflow:hidden;position:relative;font-family:'Outfit',sans-serif}
.ev-tb-av img{width:100%;height:100%;object-fit:cover}
.ev-tb-hello{font-size:16px;font-weight:800;color:#0F172A;font-family:'Outfit',sans-serif;letter-spacing:-0.01em;display:flex;align-items:center;gap:6px}
.ev-tb-check{width:15px;height:15px;background:#22C55E;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;color:#fff;font-size:9px;font-weight:bold}
.ev-tb-role{font-size:11.5px;color:#64748B;font-weight:500}
.ev-tb-spacer{flex:1}
.ev-tb-zone{display:flex;align-items:center;gap:8px;padding:8px 14px;border:1.5px solid #E2E8F0;border-radius:10px;background:#fff;cursor:pointer;font-size:12.5px;font-weight:600;color:#334155;transition:all 0.15s;box-shadow:0 1px 2px rgba(0,0,0,0.02)}
.ev-tb-zone:hover{border-color:#6366F1}
.ev-tb-zone-t{font-size:12.5px;font-weight:600;color:#334155}
.ev-tb-bell{width:38px;height:38px;border:1.5px solid #E2E8F0;border-radius:10px;background:#fff;color:#64748B;display:flex;align-items:center;justify-content:center;cursor:pointer;position:relative;transition:all 0.15s;flex-shrink:0}
.ev-tb-bell:hover{border-color:#6366F1;color:#6366F1}
.ev-tb-bell-dot{position:absolute;top:-4px;right:-4px;width:16px;height:16px;background:#6366F1;color:#fff;font-size:9px;font-weight:700;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid #fff}
.ev-tb-search-wrap{display:flex;align-items:center;border:1.5px solid #E2E8F0;border-radius:10px;padding:8px 14px;gap:8px;background:#FFF;width:420px;transition:border-color 0.15s;margin-left:16px}
.ev-tb-search-wrap:focus-within{border-color:#6366F1;box-shadow:0 0 0 3px rgba(99,102,241,0.1)}
.ev-tb-search-inp{border:none;outline:none;font-size:12.5px;color:#1E293B;width:100%;font-family:inherit;font-weight:500}
.ev-tb-search-inp::placeholder{color:#94A3B8}
.ev-tb-search-kb{border:1px solid #E2E8F0;border-radius:4px;padding:2px 5px;font-size:9.5px;color:#64748B;font-weight:700;background:#F8FAFC;white-space:nowrap;display:flex;align-items:center;justify-content:center;gap:2px}
.ev-tb-profile{display:flex;align-items:center;gap:10px;padding:6px 12px;border:1.5px solid #E2E8F0;border-radius:10px;cursor:pointer;background:#fff;transition:all 0.15s}
.ev-tb-profile:hover{border-color:#6366F1;background:#F8FAFC}
.ev-tb-zone-dd{position:absolute;top:48px;right:0;background:#FFF;border:1.5px solid #E2E8F0;border-radius:12px;padding:6px;box-shadow:0 20px 25px -5px rgba(0,0,0,0.15);z-index:100;width:220px;display:flex;flex-direction:column;gap:2px;max-height:280px;overflow-y:auto}
.ev-tb-zone-opt{padding:8px 12px;font-size:12.5px;font-weight:600;border:none;border-radius:6px;text-align:left;cursor:pointer;width:100%;transition:all 0.15s}
`;

const IBell = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);
const IPin = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const IChevD = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

interface TopBarProps {
  title?: string;
  subtitle?: string;
  showHand?: boolean;
  hideLeftAvatar?: boolean;
  leftAvatarText?: string;
  showSearch?: boolean;
  searchPlaceholder?: string;
  notificationCount?: number;
  userName?: string;
  userRole?: string;
  userAvatar?: string;
  hideZone?: boolean;
  onToggle?: () => void;
}

function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function roleLabel(rawRole: string | null): string {
  if (rawRole === 'super_admin') return 'Super Admin';
  if (rawRole === 'admin') return 'Platform Admin';
  if (rawRole === 'zone_manager') return 'Zone Admin';
  if (rawRole === 'first_time_franchise') return 'Franchise Admin';
  if (rawRole === 'employee') return 'Zone Employee';
  return rawRole || 'User';
}

export default function TopBar({
  title,
  subtitle,
  showHand = false,
  hideLeftAvatar = true,
  leftAvatarText,
  showSearch = false,
  searchPlaceholder = "Search...",
  notificationCount = 1,
  userAvatar: propAvatar,
  hideZone = false,
  onToggle,
}: TopBarProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Always read from localStorage for logged-in user
  const [sessionName, setSessionName] = useState('');
  const [sessionRole, setSessionRole] = useState('');
  const [sessionAvatar, setSessionAvatar] = useState('');

  const [zoneDropdownOpen, setZoneDropdownOpen] = useState(false);
  const [activeZone, setActiveZone] = useState('');
  const [zonesList, setZonesList] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const fetchNotifications = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/notifications`);
      if (res.ok) {
        const body = await res.json();
        setNotifications(body.data || []);
        setUnreadCount(body.unreadCount || 0);
      }
    } catch (_) {}
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Load session from localStorage
  const loadSession = () => {
    if (typeof window === 'undefined') return;
    const name = localStorage.getItem('evegah_user_name') || '';
    const rawRole = localStorage.getItem('evegah_role') || '';
    const avatar = localStorage.getItem('evegah_user_avatar') || '';
    const zone = localStorage.getItem('evegah_active_zone') || '';
    setSessionName(name);
    setSessionRole(roleLabel(rawRole));
    setSessionAvatar(avatar);
    setActiveZone(zone);
  };

  // Fetch zones from backend
  const fetchZones = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/zones`);
      if (res.ok) {
        const data = await res.json();
        const zones: any[] = Array.isArray(data) ? data : (data.data || []);
        const names = zones.map((z: any) => z.name).filter(Boolean);
        if (names.length > 0) {
          setZonesList(names);
          // Auto-select first zone if none selected
          const current = localStorage.getItem('evegah_active_zone');
          if (!current && names[0]) {
            localStorage.setItem('evegah_active_zone', names[0]);
            setActiveZone(names[0]);
          }
        }
      }
    } catch (e) {
      console.warn('TopBar: Could not fetch zones from backend');
    }
  };

  useEffect(() => {
    loadSession();
    fetchZones();
    if (typeof window !== 'undefined') {
      window.addEventListener('evegah_role_changed', loadSession);
      window.addEventListener('evegah_active_zone_changed', loadSession);
      return () => {
        window.removeEventListener('evegah_role_changed', loadSession);
        window.removeEventListener('evegah_active_zone_changed', loadSession);
      };
    }
  }, []);

  // Permission route guard
  useEffect(() => {
    const getPermissionKeyForPath = (path: string): string => {
      if (path === '/' || path.startsWith('/dashboard')) return 'Dashboard';
      if (path.startsWith('/new-rider') || path.startsWith('/retain-rider') || path.startsWith('/return-ride') || path.startsWith('/extend-ride') || path.startsWith('/franchise-users')) return 'Registrations';
      if (path.startsWith('/vehicles')) return 'Vehicles';
      if (path.startsWith('/renters') || path.startsWith('/riders')) return 'Riders';
      if (path.startsWith('/battery')) return 'Battery';
      if (path.startsWith('/maintenance')) return 'Maintenance';
      if (path.startsWith('/iot-devices')) return 'IoT Devices';
      if (path.startsWith('/payment') || path.startsWith('/payments')) return 'Payments';
      if (path.startsWith('/reports')) return 'Reports';
      if (path.startsWith('/alerts')) return 'Alerts';
      if (path.startsWith('/zones')) return 'Zone Management';
      if (path.startsWith('/franchise')) return 'Franchise';
      if (path.startsWith('/settings')) return 'Settings';
      if (path.startsWith('/users') || path.startsWith('/roles')) return 'Settings';
      return '';
    };

    if (typeof window !== 'undefined') {
      const rawRole = localStorage.getItem('evegah_role');
      if (rawRole === 'super_admin') return; // super admin bypasses all

      const stored = localStorage.getItem('evegah_user_permissions');
      if (stored) {
        try {
          const permissions = JSON.parse(stored);
          const permKey = getPermissionKeyForPath(pathname);
          if (permKey) {
            const perm = permissions[permKey];
            if (perm && perm.access === false) {
              alert(`Access Denied: You do not have permission to access ${permKey}.`);
              router.push('/');
            }
          }
        } catch (e) {
          console.error('Error parsing permissions in TopBar route guard:', e);
        }
      }
    }
  }, [pathname, router]);

  // Displayed name for left greeting: prefer prop title, otherwise session
  const displayTitle = title || (sessionName ? `Hello, ${sessionName.split(' ')[0]}` : 'Hello');
  const displaySubtitle = subtitle || sessionRole;
  const displayAvatar = propAvatar || sessionAvatar;
  const initials = sessionName ? getInitials(sessionName) : '?';

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <header className="ev-tb">
        {/* Hamburger */}
        <div className="ev-tb-hamburger" onClick={() => onToggle?.()}>
          <span />
          <span />
          <span />
        </div>

        {/* Left greeting / page title */}
        {!hideLeftAvatar && (
          <div className="ev-tb-user">
            <div className="ev-tb-av">
              {displayAvatar ? (
                <img src={displayAvatar} alt={displayTitle} style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                leftAvatarText || initials
              )}
            </div>
            <div>
              <div className="ev-tb-hello">{displayTitle} {showHand && '👋'}</div>
              <div className="ev-tb-role">{displaySubtitle}</div>
            </div>
          </div>
        )}
        {hideLeftAvatar && title && (
          <div>
            <div className="ev-tb-hello">{title}</div>
            {subtitle && <div className="ev-tb-role">{subtitle}</div>}
          </div>
        )}

        {/* Optional Search Bar */}
        {showSearch && (
          <div className="ev-tb-search-wrap">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input type="text" className="ev-tb-search-inp" placeholder={searchPlaceholder} />
            <div className="ev-tb-search-kb">
              <span>⌘</span>
              <span>K</span>
            </div>
          </div>
        )}

        <div className="ev-tb-spacer" />

        {/* Zone selector — fetched from backend */}
        {!hideZone && (
          <div style={{ position: 'relative' }}>
            <div className="ev-tb-zone" onClick={() => setZoneDropdownOpen(!zoneDropdownOpen)}>
              <span style={{ color: '#2a195c' }}><IPin /></span>
              <span className="ev-tb-zone-t">{activeZone || 'Select Zone'}</span>
              <span style={{ color: '#9CA3AF' }}><IChevD /></span>
            </div>
            {zoneDropdownOpen && (
              <div className="ev-tb-zone-dd">
                {zonesList.length === 0 && (
                  <div style={{ padding: '10px 12px', fontSize: '12px', color: '#94A3B8' }}>Loading zones...</div>
                )}
                {zonesList.map(z => (
                  <button
                    key={z}
                    className="ev-tb-zone-opt"
                    onClick={() => {
                      localStorage.setItem('evegah_active_zone', z);
                      window.dispatchEvent(new Event('evegah_active_zone_changed'));
                      window.dispatchEvent(new Event('evegah_zone_changed'));
                      setActiveZone(z);
                      setZoneDropdownOpen(false);
                    }}
                    type="button"
                    style={{
                      color: activeZone === z ? '#FFF' : '#374151',
                      background: activeZone === z ? '#2a195c' : 'transparent',
                    }}
                  >
                    {z}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Bell Notifications */}
        <div style={{ position: 'relative' }}>
          <button className="ev-tb-bell" onClick={() => setIsNotifOpen(!isNotifOpen)}>
            <IBell />
            {unreadCount > 0 && (
              <span className="ev-tb-bell-dot">{unreadCount}</span>
            )}
          </button>

          {isNotifOpen && (
            <div className="ev-tb-zone-dd" style={{ width: '320px', padding: '10px', right: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', paddingBottom: '6px', borderBottom: '1px solid #E2E8F0' }}>
                <span style={{ fontSize: '13px', fontWeight: '800', color: '#0F172A' }}>🔔 Live Telemetry Alerts</span>
                {unreadCount > 0 && (
                  <button
                    style={{ fontSize: '10.5px', color: '#6366F1', fontWeight: '700', border: 'none', background: 'none', cursor: 'pointer' }}
                    onClick={async () => {
                      try {
                        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
                        await fetch(`${apiUrl}/notifications/mark-read`, { method: 'POST' });
                        setUnreadCount(0);
                        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                      } catch (_) {}
                    }}
                  >
                    Mark read
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <div style={{ fontSize: '11.5px', color: '#94A3B8', textAlign: 'center', padding: '12px 0' }}>No new notifications</div>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} style={{ background: n.read ? '#FAFBFD' : '#EEF2FF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '800', color: '#0F172A' }}>{n.title}</span>
                      <span style={{ fontSize: '11px', color: '#475569' }}>{n.message}</span>
                      <span style={{ fontSize: '9.5px', color: '#94A3B8', marginTop: '2px' }}>
                        {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right User Profile — always shows logged-in user */}
        <div className="ev-tb-profile" onClick={() => {}}>
          <div className="ev-tb-av" style={{ background: sessionAvatar ? 'transparent' : 'linear-gradient(135deg,#2A195C,#6366F1)', width: '32px', height: '32px', fontSize: '10px' }}>
            {sessionAvatar ? (
              <img src={sessionAvatar} alt={sessionName} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              initials
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#111827', lineHeight: 1.2 }}>
              {sessionName || 'User'}
            </span>
            <span style={{ fontSize: '10.5px', color: '#9CA3AF', marginTop: '1px' }}>
              {sessionRole}
            </span>
          </div>
          <span style={{ color: '#9CA3AF', marginLeft: '4px' }}><IChevD /></span>
        </div>
      </header>
    </>
  );
}
