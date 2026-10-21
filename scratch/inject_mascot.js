const fs = require('fs');

let content = fs.readFileSync('frontend/src/app/page.tsx', 'utf8');

const mascotComponent = `
function MascotBanner({ userName, roleName }) {
  return (
    <div className="ev-mascot-banner">
      <div className="ev-mascot-content">
        <h2 className="ev-mascot-title">Welcome back, {userName}! 👋</h2>
        <p className="ev-mascot-desc">Here is your {roleName} overview for today. Your platform is operating smoothly.</p>
        <button className="ev-btn-primary" style={{marginTop: "12px", background: "#10B981", borderColor: "#10B981"}}>View Live Fleet</button>
      </div>
      <div className="ev-mascot-image-container">
        <img src="/assets/scooter_hero_scene.png" alt="Evegah Mascot" className="ev-mascot-image" />
      </div>
    </div>
  );
}
`;

const cssString = `
/* ── Premium Mascot Banner ── */
.ev-mascot-banner {
  background: linear-gradient(135deg, #2A195C 0%, #1e1142 100%);
  border-radius: 16px;
  padding: 32px 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 30px -10px rgba(42, 25, 92, 0.4);
}
.ev-mascot-banner::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -10%;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(255,255,255,0) 70%);
  border-radius: 50%;
  pointer-events: none;
}
.ev-mascot-content {
  color: #fff;
  z-index: 2;
  max-width: 60%;
  animation: rowFadeIn 0.5s ease-out forwards;
}
.ev-mascot-title {
  font-family: 'Outfit', sans-serif;
  font-size: 28px;
  font-weight: 800;
  margin-bottom: 8px;
  letter-spacing: -0.02em;
}
.ev-mascot-desc {
  font-size: 15px;
  color: #cbd5e1;
  font-weight: 400;
  line-height: 1.5;
}
.ev-mascot-image-container {
  position: absolute;
  right: 20px;
  bottom: -20px;
  width: 320px;
  height: auto;
  z-index: 2;
  pointer-events: none;
}
.ev-mascot-image {
  width: 100%;
  height: auto;
  filter: drop-shadow(0 20px 20px rgba(0,0,0,0.3));
  animation: mascotFloat 6s ease-in-out infinite;
  transform-origin: bottom center;
}
@keyframes mascotFloat {
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-12px) rotate(1deg); }
  100% { transform: translateY(0px) rotate(0deg); }
}
`;

// Insert the MascotBanner component before "export default function DynamicDashboard"
if (!content.includes('function MascotBanner')) {
  content = content.replace('export default function DynamicDashboard', mascotComponent + '\nexport default function DynamicDashboard');
}

// Append CSS to SUPER_DESIGN_CSS
if (!content.includes('.ev-mascot-banner')) {
  content = content.replace('.sa-prog-bar-fill {', cssString + '\n.sa-prog-bar-fill {');
}

// Now insert <MascotBanner /> into SuperAdminRoleDashboard
// Replacing `<div className="ev-body">` with `<div className="ev-body"><MascotBanner .../>` but only for the first occurrence in SuperAdminRoleDashboard
const searchStr = '<h2 className="sa-sub-title">SaaS Platform Performance</h2>';
if (content.includes(searchStr) && !content.includes('roleName="Super Admin"')) {
  content = content.replace(
    '<div className="ev-body">\\n            <div className="sa-sub-header">\\n              <div className="sa-sub-title-group">\\n                <h2 className="sa-sub-title">SaaS Platform Performance</h2>',
    '<div className="ev-body">\\n            <MascotBanner userName={typeof window !== "undefined" ? localStorage.getItem("evegah_user_name") || "Admin" : "Admin"} roleName="Super Admin" />\\n            <div className="sa-sub-header">\\n              <div className="sa-sub-title-group">\\n                <h2 className="sa-sub-title">SaaS Platform Performance</h2>'
  );
}

// Franchise
if (content.includes('<h2 className="sa-sub-title">Franchise Hub Analytics</h2>') && !content.includes('roleName="Franchise Manager"')) {
  content = content.replace(
    '<div className="ev-body">\\n            <div className="sa-sub-header">\\n              <div className="sa-sub-title-group">\\n                <h2 className="sa-sub-title">Franchise Hub Analytics</h2>',
    '<div className="ev-body">\\n            <MascotBanner userName={typeof window !== "undefined" ? localStorage.getItem("evegah_user_name") || "Admin" : "Admin"} roleName="Franchise Manager" />\\n            <div className="sa-sub-header">\\n              <div className="sa-sub-title-group">\\n                <h2 className="sa-sub-title">Franchise Hub Analytics</h2>'
  );
}

// Zone Admin
if (content.includes('<h2 className="sa-sub-title">Zone Operations Overview</h2>') && !content.includes('roleName="Zone Admin"')) {
  content = content.replace(
    '<div className="ev-body">\\n            <div className="sa-sub-header">\\n              <div className="sa-sub-title-group">\\n                <h2 className="sa-sub-title">Zone Operations Overview</h2>',
    '<div className="ev-body">\\n            <MascotBanner userName={typeof window !== "undefined" ? localStorage.getItem("evegah_user_name") || "Admin" : "Admin"} roleName="Zone Admin" />\\n            <div className="sa-sub-header">\\n              <div className="sa-sub-title-group">\\n                <h2 className="sa-sub-title">Zone Operations Overview</h2>'
  );
}

fs.writeFileSync('frontend/src/app/page.tsx', content, 'utf8');
console.log('Mascot Banner injected successfully.');
