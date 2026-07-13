"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.log-shell {
  display: flex;
  align-items: center;
  min-height: 100vh;
  background: #F8F9FF;
  font-family: 'Inter', sans-serif;
  overflow: hidden;
  position: relative;
  padding: 24px 20px;
  box-sizing: border-box;
}

/* Background Wavy Lines */
.log-bg-wave {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 50%;
  height: 250px;
  background: radial-gradient(circle at 10% 120%, rgba(42, 25, 92, 0.06) 0%, rgba(22, 163, 74, 0.04) 50%, transparent 100%);
  pointer-events: none;
  z-index: 1;
}

/* Left Hero Column */
.log-hero {
  flex: 1;
  max-width: 760px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 36px 48px;
  position: relative;
  z-index: 2;
}

.log-logo-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.log-logo-img {
  height: 42px;
  object-fit: contain;
}

.log-hero-content {
  margin-top: -20px;
}

.log-hero-h1 {
  font-size: 38px;
  font-weight: 800;
  color: #0F172A;
  line-height: 1.15;
  margin: 0 0 16px;
}

.log-hero-h1 span {
  color: #16a34a;
}

.log-hero-features {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13.5px;
  color: #64748B;
  font-weight: 600;
  margin-bottom: 40px;
}

.log-feature-dot {
  color: #16a34a;
  font-weight: bold;
}

/* Animated Scooter Area */
.log-scooter-area {
  position: relative;
  width: 100%;
  height: 340px;
  margin-top: 20px;
}

.log-scooter-container {
  display: flex;
  align-items: flex-end;
  position: absolute;
  bottom: 10px;
  left: 0;
  width: 100%;
}

.log-scooter-item {
  position: absolute;
  transition: all 0.8s cubic-bezier(0.25, 1, 0.5, 1);
  filter: drop-shadow(0 20px 30px rgba(15, 23, 42, 0.08));
}

/* Asynchronous floating keyframes */
@keyframes float-sc1 {
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-8px) rotate(-0.5deg); }
  100% { transform: translateY(0px) rotate(0deg); }
}

@keyframes float-sc2 {
  0% { transform: translateY(0px) scale(1.05); }
  50% { transform: translateY(-12px) scale(1.05); }
  100% { transform: translateY(0px) scale(1.05); }
}

@keyframes float-sc3 {
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-7px) rotate(0.5deg); }
  100% { transform: translateY(0px) rotate(0deg); }
}

.sc-left {
  left: 0px;
  z-index: 12;
  width: 190px;
  animation: float-sc1 6s ease-in-out infinite;
}

.sc-mid {
  left: 140px;
  z-index: 10;
  width: 220px;
  animation: float-sc2 7s ease-in-out infinite;
}

.sc-right {
  left: 270px;
  z-index: 13;
  width: 260px;
  animation: float-sc3 5.5s ease-in-out infinite;
}

.log-scooter-img {
  width: 100%;
  height: auto;
  object-fit: contain;
}

/* Floating dynamic badges */
.log-floating-badge {
  position: absolute;
  background: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 25px rgba(42, 25, 92, 0.08);
  border: 1px solid #F1F5F9;
  z-index: 15;
  transition: all 0.3s;
}

@keyframes bounce-badge {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

@keyframes pulse-badge {
  0%, 100% { transform: scale(1); box-shadow: 0 10px 25px rgba(42, 25, 92, 0.08); }
  50% { transform: scale(1.05); box-shadow: 0 10px 25px rgba(22, 163, 74, 0.15); }
}

.badge-pin {
  top: 60px;
  left: 90px;
  width: 36px;
  height: 36px;
  color: #2A195C;
  background: #FAF5FF;
  animation: bounce-badge 4s ease-in-out infinite;
}

.badge-battery {
  top: 15px;
  left: 210px;
  width: 42px;
  height: 42px;
  color: #16A34A;
  background: #ECFDF5;
  animation: pulse-badge 5s ease-in-out infinite;
}

.badge-chart {
  top: 80px;
  left: 370px;
  width: 38px;
  height: 38px;
  color: #2563EB;
  background: #EFF6FF;
  animation: bounce-badge 4.5s ease-in-out infinite 0.5s;
}

.log-bottom-card {
  align-self: flex-start;
  background: #fff;
  border: 1.5px solid #E2E8F0;
  border-radius: 12px;
  padding: 12px 18px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);
  margin-top: auto;
  z-index: 5;
}

.log-shield-ic {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #EEF2FF;
  color: #2A195C;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* Right Login Card Column */
.log-card-col {
  flex: 0.9;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  z-index: 3;
}

.log-card {
  background: #fff;
  border: 1px solid #E2E8F0;
  border-radius: 20px;
  width: 100%;
  max-width: 520px;
  padding: 32px 36px;
  box-shadow: 0 20px 40px -10px rgba(15, 23, 42, 0.05);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.log-card-logo-wrap {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  border: 1px solid #E2E8F0;
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: center;
  margin-bottom: 20px;
  box-shadow: 0 4px 10px rgba(15, 23, 42, 0.02);
}

.log-card-logo-wrap img {
  height: 20px;
  object-fit: contain;
}

.log-card-h2 {
  font-size: 24px;
  font-weight: 800;
  color: #0F172A;
  text-align: center;
  margin: 0;
}

.log-card-subtitle {
  font-size: 13px;
  color: #64748B;
  text-align: center;
  margin-top: 6px;
  margin-bottom: 28px;
  font-weight: 500;
}

/* Form Styles */
.log-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
  z-index: 5;
}

.log-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.log-lbl {
  font-size: 12px;
  font-weight: 700;
  color: #475569;
}

.log-inp-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.log-inp-ic {
  position: absolute;
  left: 12px;
  color: #94A3B8;
  display: flex;
  align-items: center;
}

.log-inp {
  width: 100%;
  padding: 11px 12px 11px 36px;
  border: 1.5px solid #E2E8F0;
  border-radius: 8px;
  font-size: 13px;
  outline: none;
  background: #fff;
  color: #334155;
  font-weight: 500;
  transition: all 0.15s;
}

.log-inp:focus {
  border-color: #2a195c;
  box-shadow: 0 0 0 1px #2a195c;
}

.log-inp-pwd {
  padding-right: 36px;
}

.log-eye-btn {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  color: #94A3B8;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 2px;
}

.log-eye-btn:hover {
  color: #2a195c;
}

/* Options */
.log-opts-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 4px;
  font-size: 12.5px;
}

.log-cb-label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #475569;
  font-weight: 600;
  cursor: pointer;
}

.log-cb {
  width: 16px;
  height: 16px;
  accent-color: #2a195c;
  cursor: pointer;
}

.log-link {
  color: #2a195c;
  text-decoration: none;
  font-weight: 700;
  transition: color 0.15s;
}

.log-link:hover {
  color: #2A195C;
}

/* Submit Button */
.log-submit-btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #2a195c 0%, #2A195C 100%);
  color: #fff;
  font-size: 13.5px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.15s;
  box-shadow: 0 10px 15px -3px rgba(42, 25, 92, 0.2);
}

.log-submit-btn:hover {
  opacity: 0.95;
  transform: translateY(-1px);
}

/* Divider */
.log-divider {
  display: flex;
  align-items: center;
  text-align: center;
  color: #94A3B8;
  font-size: 11px;
  margin: 18px 0;
  font-weight: 500;
}

.log-divider::before,
.log-divider::after {
  content: '';
  flex: 1;
  border-bottom: 1.5px solid #F1F5F9;
}

.log-divider:not(:empty)::before {
  margin-right: 12px;
}

.log-divider:not(:empty)::after {
  margin-left: 12px;
}

/* Google Sign-in */
.log-google-btn {
  width: 100%;
  padding: 11px;
  border: 1.5px solid #E2E8F0;
  border-radius: 8px;
  background: #fff;
  color: #334155;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.15s;
}

.log-google-btn:hover {
  background: #F8FAFC;
  border-color: #CBD5E1;
}

/* Footer info */
.log-footer-text {
  font-size: 12px;
  color: #64748B;
  text-align: center;
  margin-top: 24px;
  font-weight: 500;
}

/* City graphic at card bottom */
.log-city-bg {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 54px;
  opacity: 0.08;
  pointer-events: none;
  background-image: url('/assets/city.png');
  background-repeat: repeat-x;
  background-size: contain;
  background-position: bottom;
  z-index: 1;
}

@media (max-width: 900px) {
  .log-hero { display: none; }
  .log-shell { justify-content: center; padding: 16px; }
  .log-card-col { flex: 1; width: 100%; max-width: 480px; }
  .log-card { padding: 20px; border-radius: 16px; }
}

@media (max-width: 1200px) {
  /* On medium screens keep the hero but limit its width so the card stays centered */
  .log-hero { max-width: 480px; padding: 28px 24px; }
  .log-card { max-width: 520px; padding: 28px; }
  .log-shell { gap: 18px; }
}
`;

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Clear role session on mount
  useEffect(() => {
    localStorage.removeItem("evegah_role");
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/users`);
      
      if (response.ok) {
        const result = await response.json();
        const usersList = result.data || [];
        
        // Match user by email
        const matchedUser = usersList.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
        
        if (matchedUser) {
          const userRole = matchedUser.role;
          let evegahRole = 'employee';
          
          if (userRole === 'Super Admin') {
            evegahRole = 'super_admin';
          } else if (userRole === 'Platform Admin') {
            evegahRole = 'admin';
          } else if (userRole === 'Zone Admin' || userRole === 'Operations Manager') {
            evegahRole = 'zone_manager';
          } else if (userRole === 'Franchise Manager') {
            evegahRole = 'first_time_franchise';
          }
          
          localStorage.setItem("evegah_role", evegahRole);
          localStorage.setItem("evegah_user_name", matchedUser.name);
          localStorage.setItem("evegah_user_email", matchedUser.email);
          if (matchedUser.avatar_url) {
            localStorage.setItem("evegah_user_avatar", matchedUser.avatar_url);
          }

          try {
            const resRoles = await fetch(`${apiUrl}/roles`);
            if (resRoles.ok) {
              const rolesResult = await resRoles.json();
              const matchedRole = rolesResult.data?.find((r: any) => 
                r.name.toLowerCase() === matchedUser.role.toLowerCase() || 
                r.code.toLowerCase() === matchedUser.role.toLowerCase()
              );
              if (matchedRole) {
                localStorage.setItem("evegah_user_permissions", JSON.stringify(matchedRole.permissions || {}));
              } else {
                localStorage.setItem("evegah_user_permissions", JSON.stringify({}));
              }
            }
          } catch (err) {
            console.error('Error fetching roles for permissions:', err);
          }
          
          window.dispatchEvent(new Event("evegah_role_changed"));
          // Redirect super_admin to their own panel, others to main dashboard
          router.push(evegahRole === 'super_admin' ? '/super-admin' : '/');
          return;
        }
      }
      
      // If no matched user was found in the database
      alert("Unauthorized: Access denied. Only registered users can log in to the system.");
    } catch (err) {
      console.error(err);
      alert('Network error. Failed to authenticate user.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="log-shell">
        <div className="log-bg-wave" />
        
        {/* Left column hero with animated scooters and floating badges */}
        <div className="log-hero">
          <div className="log-logo-row">
            <img src="/logo.png" className="log-logo-img" alt="evegah brand" />
          </div>
          
          <div className="log-hero-content">
            <h1 className="log-hero-h1">
              Powering Smart<br />
              <span>Electric Mobility</span>
            </h1>
            
            <div className="log-hero-features">
              <span>Fleet</span>
              <span className="log-feature-dot">•</span>
              <span>Rentals</span>
              <span className="log-feature-dot">•</span>
              <span>Charging</span>
              <span className="log-feature-dot">•</span>
              <span>Analytics</span>
            </div>
            
            {/* Animated Scooters Container */}
            <div className="log-scooter-area">
              {/* Floating badges */}
              <div className="log-floating-badge badge-pin" title="Location Tracking">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              
              <div className="log-floating-badge badge-battery" title="Battery Status: 85%">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect x="1" y="6" width="18" height="12" rx="2" />
                  <line x1="23" y1="11" x2="23" y2="13" />
                  <line x1="6" y1="12" x2="10" y2="12" />
                  <line x1="10" y1="12" x2="14" y2="8" />
                </svg>
              </div>
              
              <div className="log-floating-badge badge-chart" title="Analytics Stats">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="20" x2="18" y2="10" />
                  <line x1="12" y1="20" x2="12" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="14" />
                </svg>
              </div>
              
              <div className="log-scooter-container">
                <div className="log-scooter-item sc-left">
                  <img src="/scooter_preview.png" className="log-scooter-img" alt="Scooter model left" />
                </div>
                <div className="log-scooter-item sc-mid">
                  <img src="/assets/v1.webp" className="log-scooter-img" alt="Scooter model mid" />
                </div>
                <div className="log-scooter-item sc-right">
                  <img src="/assets/v2.webp" className="log-scooter-img" alt="Scooter model right" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="log-bottom-card">
            <div className="log-shield-ic">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <polyline points="9 11 11 13 15 9" />
              </svg>
            </div>
            <div>
              <div style={{ fontWeight: '800', color: '#1E293B', fontSize: '12.5px' }}>Secure. Reliable. Sustainable.</div>
              <div style={{ color: '#64748B', fontSize: '11px', marginTop: '2px', fontWeight: '500' }}>Building the future of electric mobility.</div>
            </div>
          </div>
        </div>
        
        {/* Right column with Login Container Card */}
        <div className="log-card-col">
          <div className="log-card">
            <div className="log-city-bg" />
            
            <div className="log-card-logo-wrap">
              <img src="/logo.png" alt="e" />
            </div>
            
            <h2 className="log-card-h2">Welcome back!</h2>
            <p className="log-card-subtitle">Login to access your evegah dashboard</p>
            
            <form onSubmit={handleLoginSubmit} className="log-form">
              <div className="log-field">
                <label className="log-lbl">Email address</label>
                <div className="log-inp-wrap">
                  <span className="log-inp-ic">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </span>
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="log-inp" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="log-field">
                <label className="log-lbl">Password</label>
                <div className="log-inp-wrap">
                  <span className="log-inp-ic">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </span>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Enter your password" 
                    className="log-inp log-inp-pwd" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button 
                    type="button" 
                    className="log-eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    title="Toggle password view"
                  >
                    {showPassword ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              
              <div className="log-opts-row">
                <label className="log-cb-label">
                  <input type="checkbox" className="log-cb" defaultChecked />
                  <span>Remember me</span>
                </label>
                <a href="#" className="log-link" onClick={(e) => { e.preventDefault(); alert('Please contact system administrator to reset password.'); }}>
                  Forgot password?
                </a>
              </div>
              
              <button type="submit" className="log-submit-btn" disabled={loading}>
                <span>{loading ? 'Logging in...' : 'Login to Dashboard'}</span>
                {!loading && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                )}
              </button>
              
              <div className="log-divider">or continue with</div>
              
              <button 
                type="button" 
                className="log-google-btn"
                onClick={() => {
                  localStorage.setItem("evegah_role", "admin");
                  window.dispatchEvent(new Event("evegah_role_changed"));
                  router.push('/');
                }}
              >
                {/* Google Multicolor logo */}
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.77c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Sign in with Google</span>
              </button>
              
              <div className="log-footer-text">
                Don&apos;t have an account? <a href="#" className="log-link" onClick={(e) => { e.preventDefault(); alert('Please contact system administrator to request account creation.'); }}>Contact Admin</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
