"use client";
export const dynamic = 'force-dynamic';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Plus+Jakarta+Sans:wght@600;700;800&family=Playfair+Display:wght@700&family=Space+Mono:wght@700&display=swap');

.ev-shell { display: flex; min-height: 100vh; background: #F3F4F9; font-family: 'Inter', sans-serif; }
.ev-main { margin-left: var(--ev-sidebar-width, 240px); display: flex; flex-direction: column; min-height: 100vh; width: calc(100% - var(--ev-sidebar-width, 240px)); }
.ev-body { padding: 20px 22px 50px; flex: 1; display: flex; flex-direction: column; gap: 20px; }

/* Top Bar Styling */
.sa-tb { background: #fff; padding: 14px 24px; border-bottom: 1.5px solid #E2E8F0; display: flex; justify-content: space-between; align-items: center; }
.sa-tb-hello { font-size: 18px; font-weight: 800; color: #1E293B; margin: 0; }
.sa-tb-sub { font-size: 12px; color: #64748B; margin: 4px 0 0 0; }
.sa-tb-right { display: flex; align-items: center; gap: 16px; }
.sa-tb-prof { display: flex; align-items: center; gap: 10px; }
.sa-tb-prof-av { width: 34px; height: 34px; border-radius: 50%; background: #2a195c; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; }
.sa-tb-prof-info { display: flex; flex-direction: column; }
.sa-tb-prof-name { font-size: 13px; font-weight: 700; color: #1E293B; }
.sa-tb-prof-role { font-size: 11px; color: #64748B; }

/* Breadcrumbs */
.fr-bc { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #64748B; font-weight: 500; }
.fr-bc a { color: #64748B; text-decoration: none; }
.fr-bc a:hover { color: #2a195c; }
.fr-bc-sep { color: #94A3B8; }
.fr-bc-cur { color: #2a195c; font-weight: 700; }

/* White Label Header */
.wl-hdr { display: flex; justify-content: space-between; align-items: flex-start; }
.wl-title-h1 { font-size: 22px; font-weight: 800; color: #1E293B; margin: 0; }
.wl-title-sub { font-size: 12.5px; color: #64748B; margin-top: 4px; }
.wl-hdr-actions { display: flex; gap: 10px; }

.wl-btn { display: flex; align-items: center; gap: 6px; padding: 9px 16px; border: 1.5px solid #E2E8F0; border-radius: 10px; font-size: 12.5px; font-weight: 700; color: #475569; background: #fff; cursor: pointer; transition: all 0.15s; font-family: inherit; }
.wl-btn:hover { border-color: #6366F1; color: #6366F1; }
.wl-btn-primary { background: #6366F1; color: #fff; border-color: #6366F1; }
.wl-btn-primary:hover { background: #2A195C; border-color: #2A195C; }

/* Tabs Selector */
.wl-tabs { display: flex; border-bottom: 1.5px solid #E2E8F0; gap: 24px; margin-top: 6px; }
.wl-tab { font-size: 12.5px; font-weight: 700; color: #64748B; padding-bottom: 10px; cursor: pointer; background: none; border-top: none; border-left: none; border-right: none; border-bottom: 2px solid transparent; transition: all 0.15s; font-family: inherit; }
.wl-tab:hover { color: #0F172A; }
.wl-tab.act { color: #6366F1; border-color: #6366F1; }

/* Layout Grid */
.wl-layout { display: grid; grid-template-columns: 1fr 350px; gap: 20px; align-items: start; }
.wl-panel { background: #fff; border: 1px solid #E2E8F0; border-radius: 14px; box-shadow: 0 1px 3px rgba(0,0,0,0.03); overflow: hidden; display: flex; flex-direction: column; }
.wl-panel-hdr { padding: 14px 18px; border-bottom: 1px solid #F1F5F9; display: flex; align-items: center; justify-content: space-between; }
.wl-panel-tit { font-size: 13.5px; font-weight: 700; color: #0F172A; }
.wl-panel-body { padding: 20px; display: flex; flex-direction: column; gap: 16px; }

/* Form components */
.wl-form-sec { display: flex; flex-direction: column; gap: 12px; }
.wl-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.wl-form-group { display: flex; flex-direction: column; gap: 6px; }
.wl-form-group.full { grid-column: span 2; }
.wl-lbl { font-size: 11.5px; font-weight: 700; color: #475569; }
.wl-lbl span { color: #EF4444; }
.wl-inp { padding: 9px 12px; border: 1.5px solid #E2E8F0; border-radius: 8px; font-size: 13px; outline: none; background: #fff; color: #1E293B; transition: border-color 0.15s; font-family: inherit; }
.wl-inp:focus { border-color: #6366F1; }
.wl-inp::placeholder { color: #94A3B8; }
.wl-select { cursor: pointer; }

/* Logo upload items */
.logo-upload-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; border: 1.5px solid #E2E8F0; border-radius: 8px; background: #FAFBFD; }
.logo-preview-box { width: 100px; height: 32px; border-radius: 6px; border: 1px solid #E2E8F0; background: #fff; display: flex; align-items: center; justify-content: center; overflow: hidden; padding: 4px; }
.logo-preview-box img { max-width: 100%; max-height: 100%; object-fit: contain; }

/* Color pickers */
.color-picker-row { display: flex; align-items: center; gap: 10px; }
.color-picker-box { width: 28px; height: 28px; border-radius: 6px; border: 1.5px solid #E2E8F0; cursor: pointer; overflow: hidden; display: flex; align-items: center; justify-content: center; }
.color-picker-box input { opacity: 0; width: 100%; height: 100%; cursor: pointer; }

/* Preview Right Panels */
.prev-tabs { display: flex; gap: 12px; border-bottom: 1.5px solid #E2E8F0; padding-bottom: 6px; margin-bottom: 12px; }
.prev-tab { font-size: 11.5px; font-weight: 700; color: #64748B; cursor: pointer; border: none; background: none; padding-bottom: 4px; border-bottom: 2px solid transparent; }
.prev-tab.act { color: #6366F1; border-color: #6366F1; }

/* Mocks Previews */
.mock-dashboard { border: 1.5px solid #E2E8F0; border-radius: 8px; padding: 12px; display: flex; flex-direction: column; gap: 10px; background: #F8FAFC; transform: scale(0.98); transform-origin: top center; }
.mock-kpis { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
.mock-kpi { background: #fff; border: 1px solid #E2E8F0; border-radius: 6px; padding: 8px; display: flex; flex-direction: column; gap: 2px; }
.mock-kpi-lbl { font-size: 8px; color: #64748B; font-weight: 600; }
.mock-kpi-val { font-size: 12px; font-weight: 800; color: #0F172A; }
.mock-kpi-sub { font-size: 8px; color: #10B981; font-weight: 600; }

.mock-app-screen { width: 100%; height: 260px; border-radius: 12px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #fff; padding: 24px; text-align: center; position: relative; overflow: hidden; }
.mock-app-inp { width: 100%; padding: 8px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.3); background: rgba(255,255,255,0.15); font-size: 11px; margin-top: 14px; text-align: center; color: #fff; outline: none; }
.mock-app-inp::placeholder { color: rgba(255,255,255,0.7); }

/* Switch switches */
.wl-switch-wrap { display: flex; align-items: center; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #F1F5F9; }
.wl-switch-wrap:last-child { border-bottom: none; }
.wl-switch-lbl { font-size: 12px; font-weight: 700; color: #334155; }
.switch-slider { width: 32px; height: 18px; background: #CBD5E1; border-radius: 20px; position: relative; cursor: pointer; transition: background 0.15s; }
.switch-slider::after { content: ''; position: absolute; width: 14px; height: 14px; border-radius: 50%; background: #fff; top: 2px; left: 2px; transition: transform 0.15s; }
.switch-inp { display: none; }
.switch-inp:checked + .switch-slider { background: #10B981; }
.switch-inp:checked + .switch-slider::after { transform: translateX(14px); }

/* Email preview */
.mock-email { border: 1.5px solid #E2E8F0; border-radius: 10px; background: #fff; display: flex; flex-direction: column; overflow: hidden; font-size: 11px; }
.mock-email-hdr { padding: 12px; text-align: center; color: #fff; font-weight: bold; }
.mock-email-body { padding: 20px; color: #334155; line-height: 1.5; }

/* Domain cards */
.domain-card { border: 1.5px solid #E2E8F0; border-radius: 10px; padding: 12px 16px; background: #F8FAFC; display: flex; align-items: center; justify-content: space-between; }
.domain-subcard { background: #fff; border: 1px solid #E2E8F0; border-radius: 8px; padding: 12px; display: flex; flex-direction: column; gap: 4px; flex: 1; text-align: center; }

/* Browser Mockup */
.browser-mock { border: 2px solid #E2E8F0; border-radius: 10px; overflow: hidden; background: #fff; }
.browser-bar { background: #FAFBFD; border-bottom: 1.5px solid #E2E8F0; padding: 6px 12px; display: flex; align-items: center; gap: 8px; }
.browser-dot { width: 8px; height: 8px; border-radius: 50%; background: #CBD5E1; }
.browser-url { background: #fff; border: 1px solid #E2E8F0; border-radius: 6px; padding: 3px 10px; font-size: 10.5px; color: #64748B; flex: 1; text-align: center; font-family: monospace; }
.browser-screen { height: 260px; background: #F3F4F9; display: flex; align-items: center; justify-content: center; padding: 20px; }

/* Invoice Preview Layout */
.invoice-paper { background: #fff; border: 1px solid #E2E8F0; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); padding: 20px; font-size: 10.5px; color: #334155; line-height: 1.4; }
.invoice-hdr { display: flex; justify-content: space-between; border-bottom: 1.5px solid #E2E8F0; padding-bottom: 10px; margin-bottom: 12px; }
.invoice-tit { font-size: 15px; font-weight: 800; color: #0F172A; }
.invoice-table { width: 100%; border-collapse: collapse; margin-top: 12px; }
.invoice-table th { background: #F8FAFC; border-bottom: 1.5px solid #E2E8F0; padding: 6px 8px; font-size: 9px; text-transform: uppercase; text-align: left; }
.invoice-table td { padding: 8px; border-bottom: 1px solid #F1F5F9; }
.invoice-sum { display: flex; justify-content: flex-end; margin-top: 12px; }
.invoice-sum-table { width: 180px; }
.invoice-sum-table td { padding: 4px 0; }

/* Badge tags */
.wl-tag { display: inline-flex; align-items: center; gap: 4px; background: #F1F5F9; color: #475569; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
.wl-tag-del { border: none; background: none; color: #EF4444; cursor: pointer; font-size: 12px; padding: 0; }

.badge-pill { font-size: 9px; padding: 2px 8px; border-radius: 12px; font-weight: 800; text-transform: uppercase; }
.badge-active { background: #ECFDF5; color: #10B981; }
.badge-expired { background: #FEE2E2; color: #EF4444; }


/* App Slider Studio Enhanced */
.slider-studio-hdr { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
.slider-studio-title { display: flex; align-items: center; gap: 8px; }
.slider-studio-title h2 { font-size: 20px; font-weight: 800; color: #0F172A; margin: 0; }
.slider-new-badge { font-size: 11px; font-weight: 700; background: #EDE9FE; color: #6366F1; padding: 2px 8px; border-radius: 12px; }
.slider-subtabs { display: flex; gap: 8px; border-bottom: 1.5px solid #F1F5F9; padding-bottom: 12px; margin-bottom: 16px; }
.slider-subtab { display: flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 8px; border: 1.5px solid transparent; font-size: 12.5px; font-weight: 700; color: #64748B; background: transparent; cursor: pointer; transition: all 0.15s; }
.slider-subtab:hover { background: #F8FAFC; color: #1E293B; }
.slider-subtab.act { background: #6366F1; color: #FFFFFF; }
.slider-subtab.act svg { stroke: #FFFFFF; }
.slider-card-item { display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; border: 1.5px solid #E2E8F0; border-radius: 10px; background: #FFFFFF; cursor: pointer; transition: all 0.15s; }
.slider-card-item:hover { border-color: #CBD5E1; background: #F8FAFC; }
.slider-card-item.act { border-color: #6366F1; background: #F5F3FF; box-shadow: 0 2px 8px rgba(99, 102, 241, 0.12); }
.quick-style-card { flex: 1; padding: 10px 8px; border: 1.5px solid #E2E8F0; border-radius: 10px; cursor: pointer; text-align: center; transition: all 0.15s; background: #FFFFFF; }
.quick-style-card:hover { border-color: #6366F1; }
.quick-style-card.act { border-color: #6366F1; background: #F5F3FF; }
.quick-style-preview { height: 32px; border-radius: 6px; margin-bottom: 6px; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; }

/* App Sliders Manager Styles */
.slider-mgmt-wrap { display: flex; flex-direction: column; gap: 16px; }
.slider-screen-pills { display: flex; gap: 6px; background: #F1F5F9; padding: 4px; border-radius: 10px; width: fit-content; }
.slider-screen-btn { padding: 7px 16px; border-radius: 8px; border: none; font-size: 12.5px; font-weight: 700; cursor: pointer; color: #64748B; background: transparent; transition: all 0.15s; }
.slider-screen-btn.act { background: #fff; color: #1E293B; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
.slider-card-box { border: 1.5px solid #E2E8F0; border-radius: 14px; padding: 18px; background: #FAFBFD; display: flex; flex-direction: column; gap: 14px; position: relative; transition: all 0.15s; }
.slider-card-box.active-card { border-color: #6366F1; background: #FFFFFF; box-shadow: 0 4px 12px rgba(99,102,241,0.08); }
.slider-card-head { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #F1F5F9; padding-bottom: 12px; }
.slider-num-badge { width: 24px; height: 24px; border-radius: 12px; background: #1E293B; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; }
.slider-asset-drop { border: 1.5px dashed #CBD5E1; border-radius: 10px; padding: 12px; display: flex; align-items: center; gap: 12px; background: #F8FAFC; cursor: pointer; transition: all 0.15s; }
.slider-asset-drop:hover { border-color: #6366F1; background: #F1F5F9; }
.slider-asset-thumb { width: 68px; height: 46px; border-radius: 6px; border: 1px solid #CBD5E1; object-fit: cover; background: #fff; }
.phone-mock-frame { width: 310px; height: 570px; border: 10px solid #0F172A; border-radius: 40px; background: #000; box-shadow: 0 16px 36px rgba(0,0,0,0.22); position: relative; overflow: hidden; display: flex; flex-direction: column; margin: 0 auto; }
.phone-mock-notch { width: 100px; height: 18px; background: #0F172A; border-bottom-left-radius: 12px; border-bottom-right-radius: 12px; position: absolute; top: 0; left: 50%; transform: translateX(-50%); z-index: 30; }
.phone-mock-screen { flex: 1; background: #F4F6FB; position: relative; display: flex; flex-direction: column; overflow: hidden; }
.phone-hero-slider { height: 250px; width: 100%; position: relative; overflow: hidden; background: #F8FAFC; }
.phone-slide-bg { width: 100%; height: 100%; object-fit: cover; position: absolute; top: 0; left: 0; }
.phone-slide-grad { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(90deg, rgba(255,255,255,0.94) 0%, rgba(255,255,255,0.72) 55%, transparent 100%); }
.phone-slide-copy { position: absolute; left: 14px; bottom: 18px; z-index: 10; max-width: 60%; }
.phone-tag-badge { display: inline-flex; align-items: center; gap: 4px; padding: 2px 7px; border-radius: 6px; background: rgba(30,27,75,0.08); border: 1px solid rgba(30,27,75,0.18); font-size: 8px; font-weight: 900; color: #1E1B4B; letter-spacing: 0.5px; margin-bottom: 4px; }
.phone-slide-h1 { font-size: 14.5px; font-weight: 900; color: #0F172A; line-height: 1.22; margin: 0 0 3px 0; letter-spacing: -0.3px; }
.phone-slide-p { font-size: 9px; font-weight: 700; color: #475569; margin: 0 0 8px 0; line-height: 1.3; }
.phone-slide-cta { display: inline-block; padding: 5px 12px; border-radius: 12px; background: #1E1B4B; color: #fff; font-size: 9px; font-weight: 800; border: none; }
.phone-slide-front { position: absolute; right: 2px; bottom: 0px; height: 155px; max-width: 150px; object-fit: contain; z-index: 8; }
.phone-dots { position: absolute; right: 12px; bottom: 8px; z-index: 15; display: flex; gap: 4px; align-items: center; }
.phone-dot { width: 5px; height: 5px; border-radius: 50%; background: rgba(15,23,42,0.22); }
.phone-dot.act { width: 14px; border-radius: 4px; background: #1E1B4B; }
`;

function normalizeImageUrl(url?: string): string {
  if (!url) return '';
  const s = String(url).trim();
  if (!s) return '';
  if (s.includes('1792349713724') || s.includes('1792349720008')) return '';
  if (s.startsWith('/uploads/')) return `/api${s}`;
  if (s.includes('evegah.cloud/uploads/')) return s.replace('evegah.cloud/uploads/', 'evegah.cloud/api/uploads/');
  return s;
}

const compressImageForUpload = (file: File, isCutout: boolean): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (re) => {
      const rawDataUrl = (re.target?.result as string) || '';
      if (!rawDataUrl) return resolve('');
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          // Mobile screens are 390-430px wide, so 960px is already crisp 2.5x Retina
          const maxDim = isCutout ? 480 : 960;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) return resolve(rawDataUrl);

          ctx.drawImage(img, 0, 0, width, height);

          let mime = isCutout ? 'image/png' : 'image/jpeg';
          let quality = isCutout ? 0.8 : 0.78;
          let compressed = canvas.toDataURL(mime, quality);

          // Guarantee payload is strictly under 600 KB to never trigger Nginx 1MB 413 error
          const MAX_BASE64_LEN = 600 * 1024;
          let attempts = 0;
          while (compressed.length > MAX_BASE64_LEN && attempts < 5 && width > 240) {
            attempts++;
            width = Math.round(width * 0.78);
            height = Math.round(height * 0.78);
            canvas.width = width;
            canvas.height = height;
            ctx.clearRect(0, 0, width, height);
            ctx.drawImage(img, 0, 0, width, height);
            if (!isCutout && quality > 0.45) quality -= 0.12;
            compressed = canvas.toDataURL(mime, quality);
          }

          resolve(compressed);
        } catch (_) {
          resolve(rawDataUrl);
        }
      };
      img.onerror = () => resolve(rawDataUrl);
      img.src = rawDataUrl;
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
};

export default function WhiteLabelManagement() {
  const [activeTab, setActiveTab] = useState('brand');
  
  // Brand Identity states
  const [companyName, setCompanyName] = useState('E-Vegah Mobility Private Limited');
  const [platformName, setPlatformName] = useState('Evegah');
  const [tagline, setTagline] = useState('Smart. Green. Reliable.');
  const [supportEmail, setSupportEmail] = useState('support@evegah.com');
  const [supportPhone, setSupportPhone] = useState('+91 98765 43210');
  
  const [primaryColor, setPrimaryColor] = useState('#6C38FF');
  const [secondaryColor, setSecondaryColor] = useState('#00B67A');
  const [accentColor, setAccentColor] = useState('#FF8A00');
  const [fontFamily, setFontFamily] = useState('Inter');
  const [buttonStyle, setButtonStyle] = useState('rounded');
  const [copyrightText, setCopyrightText] = useState('© 2024 Evegah. All rights reserved.');
  const [footerDesc, setFooterDesc] = useState('Evegah provides sustainable battery swapping solutions to power a cleaner and greener future.');
  const [quickLinks, setQuickLinks] = useState([
    { label: 'Privacy Policy', url: '#' },
    { label: 'Terms & Conditions', url: '#' },
    { label: 'Refund Policy', url: '#' }
  ]);
  const [newLinkLabel, setNewLinkLabel] = useState('');

  // Domain & App states
  const [primaryDomain, setPrimaryDomain] = useState('dashboard.evegah.com');
  const [appName, setAppName] = useState('Evegah Rider');
  const [packageName, setPackageName] = useState('io.ionic.evegah');
  const [appVersion, setAppVersion] = useState('2.4.1');
  const [activeAppTab, setActiveAppTab] = useState('android');

  // Invoice & Docs states
  const [invoiceTitle, setInvoiceTitle] = useState('Tax Invoice');
  const [invoicePrefix, setInvoicePrefix] = useState('INV');
  const [invoiceFooter, setInvoiceFooter] = useState('Thank you for choosing Evegah. Smart. Green. Reliable.');
  const [gstNo, setGstNo] = useState('07ABCDE1234F1Z5');
  const [panNo, setPanNo] = useState('ABCDE1234F');
  const [invoiceAddress, setInvoiceAddress] = useState('Shop No. 12, Gotri Road, Vadodara - 390021, Gujarat, India');
  const [activeInvoiceTab, setActiveInvoiceTab] = useState('invoice');

  // Preview tab state
  const [brandPreviewTab, setBrandPreviewTab] = useState('dashboard');

  // SMTP Settings
  const [smtpServer, setSmtpServer] = useState('smtp.evegah.com');
  const [smtpPort, setSmtpPort] = useState('587');
  const [smtpUser, setSmtpUser] = useState('smtp@evegah.com');

  // Custom code inputs
  const [customCSS, setCustomCSS] = useState('');
  const [customJS, setCustomJS] = useState('');

  // App Sliders state (Home & Rent dynamic banners)
  const [sliderScreen, setSliderScreen] = useState<'rent' | 'home'>('rent');
  const [editorSubTab, setEditorSubTab] = useState<'content' | 'typography' | 'background' | 'cutout'>('content');
  const [selectedSlideIdx, setSelectedSlideIdx] = useState<number>(0);
  const [homeSliders, setHomeSliders] = useState<any[]>([
    {
      id: 'slide_home_1',
      tag: 'Slider 1',
      title: 'Ride Smarter, Go Farther',
      subtitle: 'High-performance electric vehicles designed for delivery and daily city commute.',
      cta: 'Rent EV Now',
      bg: '',
      front: '',
      active: true
    },
    {
      id: 'slide_home_2',
      tag: 'Slider 2',
      title: 'Swap & Go in 60s',
      subtitle: 'Never wait for charging. Fast automated battery swapping stations across Vadodara.',
      cta: 'Find Station',
      bg: '',
      front: '',
      active: true
    },
    {
      id: 'slide_home_3',
      tag: 'Slider 3',
      title: 'Zero Emission Mobility',
      subtitle: 'Reduce carbon footprint with certified green energy battery swaps.',
      cta: 'Explore Fleet',
      bg: '',
      front: '',
      active: true
    }
  ]);
  const [rentSliders, setRentSliders] = useState<any[]>([
    {
      id: 'slide_rent_1',
      tag: 'Slider 1',
      title: 'Rent at L&T Knowledge City',
      subtitle: 'Instant unlock at Main Gate hub. Smooth ride to office.',
      cta: 'Book This Zone',
      bg: '',
      front: '',
      active: true
    },
    {
      id: 'slide_rent_2',
      tag: 'Slider 2',
      title: 'Parul University Campus Fleet',
      subtitle: 'Zero deposit student & staff plans. Swap batteries inside campus.',
      cta: 'Select Campus Zone',
      bg: '',
      front: '',
      active: true
    },
    {
      id: 'slide_rent_3',
      tag: 'Slider 3',
      title: 'Zepto Dark Store Hub',
      subtitle: 'High payload commercial EVs. Unlimited battery swaps.',
      cta: 'Start Earning',
      bg: '',
      front: '',
      active: true
    }
  ]);
  const [isSavingSliders, setIsSavingSliders] = useState<boolean>(false);
  const [sliderSaveMsg, setSliderSaveMsg] = useState<string>('');
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const res = await fetch('/api/settings/app_slider');
        if (res.ok) {
          const json = await res.json();
          if (json && (json.success || json.status === 'success') && json.data) {
            const val = json.data.value || json.data;
            if (Array.isArray(val.home_sliders) && val.home_sliders.length > 0) {
              setHomeSliders(val.home_sliders.map((s: any) => ({
                ...s,
                bg: normalizeImageUrl(s.bg),
                front: normalizeImageUrl(s.front),
              })));
            }
            if (Array.isArray(val.rent_sliders) && val.rent_sliders.length > 0) {
              setRentSliders(val.rent_sliders.map((s: any) => ({
                ...s,
                bg: normalizeImageUrl(s.bg),
                front: normalizeImageUrl(s.front),
              })));
            }
          }
        }
      } catch (err) {
        console.error('Failed to load sliders from settings:', err);
      }
    };
    fetchSliders();
  }, []);

  const currentSliderList = sliderScreen === 'home' ? homeSliders : rentSliders;
  const setCurrentSliderList = (updater: any) => {
    if (sliderScreen === 'home') {
      setHomeSliders(updater);
    } else {
      setRentSliders(updater);
    }
  };

  const handleUpdateSlide = (idx: number, field: string, val: any) => {
    setCurrentSliderList((prev: any[]) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: val };
      return copy;
    });
  };

  const handleAddSlide = () => {
    const nextIdx = currentSliderList.length + 1;
    const newSlide = {
      id: `slide_${sliderScreen}_${Date.now()}`,
      tag: `Slider ${nextIdx}`,
      title: `Special EV Campaign ${nextIdx}`,
      subtitle: 'High-performance electric mobility with seamless battery swap access.',
      cta: 'Explore Details',
      bg: '',
      front: '',
      active: true
    };
    setCurrentSliderList((prev: any[]) => [...prev, newSlide]);
    setSelectedSlideIdx(currentSliderList.length);
  };

  const handleDeleteSlide = (idx: number) => {
    if (currentSliderList.length <= 1) {
      alert('You must keep at least 1 slide in the carousel.');
      return;
    }
    setCurrentSliderList((prev: any[]) => prev.filter((_, i) => i !== idx));
    if (selectedSlideIdx >= idx && selectedSlideIdx > 0) {
      setSelectedSlideIdx(selectedSlideIdx - 1);
    }
  };

  const handleRemoveSliderFile = async (slideIdx: number, field: 'bg' | 'front') => {
    const previousUrl = currentSliderList[slideIdx]?.[field];
    handleUpdateSlide(slideIdx, field, '');
    if (previousUrl) {
      try {
        await fetch('/api/settings/delete-asset', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: previousUrl })
        });
      } catch (_) {}
    }
  };

  const handleUploadSliderFile = async (slideIdx: number, field: 'bg' | 'front', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previousUrl = currentSliderList[slideIdx]?.[field] || '';

    setUploadingField(`${slideIdx}-${field}`);
    try {
      const isCutout = field === 'front';
      const compressedDataUrl = await compressImageForUpload(file, isCutout);
      if (!compressedDataUrl) throw new Error('Could not read image file');

      const res = await fetch('/api/settings/upload-asset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: compressedDataUrl,
          dataUrl: compressedDataUrl,
          name: file.name,
          filename: file.name,
          previousUrl: previousUrl
        })
      });
      const resJson = await res.json();
      if ((resJson.success || resJson.status === 'success') && resJson.url) {
        const cleanUrl = normalizeImageUrl(resJson.url);
        handleUpdateSlide(slideIdx, field, cleanUrl);
      } else {
        alert('Asset upload failed: ' + (resJson.message || resJson.error || 'Server error'));
      }
    } catch (err: any) {
      alert('Upload error: ' + err.message);
    } finally {
      setUploadingField(null);
    }
  };

  const handleSaveSliders = async () => {
    setIsSavingSliders(true);
    setSliderSaveMsg('');
    try {
      const res = await fetch('/api/settings/app_slider', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          value: {
            home_sliders: homeSliders,
            rent_sliders: rentSliders
          }
        })
      });
      const data = await res.json();
      if (data.success || data.status === 'success') {
        setSliderSaveMsg('App sliders successfully saved & published to mobile app!');
        setTimeout(() => setSliderSaveMsg(''), 5000);
      } else {
        alert('Failed to save sliders: ' + (data.error || data.message || 'Unknown error'));
      }
    } catch (err: any) {
      alert('Error saving sliders: ' + err.message);
    } finally {
      setIsSavingSliders(false);
    }
  };


  const addQuickLink = () => {
    if (!newLinkLabel) return;
    setQuickLinks([...quickLinks, { label: newLinkLabel, url: '#' }]);
    setNewLinkLabel('');
  };

  const removeQuickLink = (idx: number) => {
    setQuickLinks(quickLinks.filter((_, i) => i !== idx));
  };

  // PDF report and rider receipt generator function
  const handleDownloadPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const isReceipt = activeInvoiceTab === 'receipt';

    const htmlContent = `
      <html>
        <head>
          <title>${isReceipt ? 'Rider Receipt' : invoiceTitle} - ${companyName}</title>
          <style>
            body { font-family: 'Inter', sans-serif; padding: 40px; color: #334155; line-height: 1.5; }
            .inv-card { max-width: 800px; margin: 0 auto; border: 1px solid #E2E8F0; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
            .inv-header { display: flex; justify-content: space-between; border-bottom: 2px solid #E2E8F0; padding-bottom: 20px; }
            .inv-title { font-size: 26px; font-weight: 800; color: #0F172A; }
            .company-info { font-size: 11.5px; line-height: 1.5; text-align: right; }
            .bill-to { margin-top: 30px; display: flex; justify-content: space-between; font-size: 13px; }
            .inv-table { width: 100%; border-collapse: collapse; margin-top: 30px; }
            .inv-table th { background: #F8FAFC; border-bottom: 2px solid #E2E8F0; padding: 12px 10px; font-size: 11px; text-transform: uppercase; text-align: left; color: #64748B; }
            .inv-table td { border-bottom: 1px solid #F1F5F9; padding: 12px 10px; font-size: 12.5px; }
            .inv-summary { display: flex; justify-content: flex-end; margin-top: 30px; }
            .inv-summary-table { width: 260px; font-size: 13px; }
            .inv-summary-table td { padding: 6px 0; }
            .footer-banner { margin-top: 60px; text-align: center; font-size: 12px; color: #64748B; border-top: 1px solid #E2E8F0; padding-top: 20px; }
            .sign-block { margin-top: 40px; display: flex; flex-direction: column; align-items: flex-end; }
            .sign-line { width: 180px; border-top: 1px solid #64748B; margin-top: 40px; }
            @media print {
              body { padding: 0; }
              .inv-card { border: none; box-shadow: none; padding: 0; }
            }
          </style>
        </head>
        <body>
          <div class="inv-card">
            <div class="inv-header">
              <div>
                <div class="inv-title">${isReceipt ? 'Rider Swap Receipt' : invoiceTitle}</div>
                <div style="font-size: 13px; margin-top: 6px; font-weight: bold; color: ${primaryColor};">
                  ${isReceipt ? 'RCPT' : invoicePrefix}-2024-000123
                </div>
              </div>
              <div class="company-info">
                <strong>${companyName}</strong><br/>
                ${invoiceAddress}<br/>
                GSTIN: ${gstNo} | PAN: ${panNo}
              </div>
            </div>

            <div class="bill-to">
              <div>
                <strong style="color: #64748B; text-transform: uppercase; font-size: 11px; display: block; margin-bottom: 4px;">Bill To:</strong>
                <strong>Rahul Sharma</strong><br/>
                Gotri Road, Vadodara - 390021<br/>
                Mobile: +91 98765 43210
              </div>
              <div style="text-align: right;">
                <strong>Date of Issue:</strong> 20 Jun 2024<br/>
                ${isReceipt ? '' : '<strong>Due Date:</strong> 30 Jun 2024<br/>'}
                <strong>Place of Supply:</strong> Supply Zone (07)
              </div>
            </div>

            <table class="inv-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>HSN/SAC</th>
                  <th style="text-align: center;">Qty</th>
                  <th style="text-align: right;">Rate (₹)</th>
                  <th style="text-align: right;">Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                ${isReceipt ? `
                  <tr>
                    <td>Battery Swap Service Fee (60V 45Ah Pack)</td>
                    <td>9987</td>
                    <td style="text-align: center;">1</td>
                    <td style="text-align: right;">250.00</td>
                    <td style="text-align: right;">250.00</td>
                  </tr>
                  <tr>
                    <td>Rider Wallet Top-up Accent</td>
                    <td>9987</td>
                    <td style="text-align: center;">1</td>
                    <td style="text-align: right;">1,000.00</td>
                    <td style="text-align: right;">1,000.00</td>
                  </tr>
                ` : `
                  <tr>
                    <td>EV Battery Pack 60V 45Ah</td>
                    <td>8507</td>
                    <td style="text-align: center;">1</td>
                    <td style="text-align: right;">25,000.00</td>
                    <td style="text-align: right;">25,000.00</td>
                  </tr>
                  <tr>
                    <td>Battery Charger 60V 10A</td>
                    <td>8504</td>
                    <td style="text-align: center;">1</td>
                    <td style="text-align: right;">2,500.00</td>
                    <td style="text-align: right;">2,500.00</td>
                  </tr>
                  <tr>
                    <td>Installation & Services</td>
                    <td>9987</td>
                    <td style="text-align: center;">1</td>
                    <td style="text-align: right;">1,000.00</td>
                    <td style="text-align: right;">1,000.00</td>
                  </tr>
                `}
              </tbody>
            </table>

            <div class="inv-summary">
              <table class="inv-summary-table">
                <tr>
                  <td>Sub Total:</td>
                  <td style="text-align: right; font-weight: bold;">₹${isReceipt ? '1,250.00' : '28,500.00'}</td>
                </tr>
                <tr>
                  <td>CGST (9%):</td>
                  <td style="text-align: right;">₹${isReceipt ? '112.50' : '2,565.00'}</td>
                </tr>
                <tr>
                  <td>SGST (9%):</td>
                  <td style="text-align: right;">₹${isReceipt ? '112.50' : '2,565.00'}</td>
                </tr>
                <tr style="border-top: 1.5px solid #000; font-weight: bold; font-size: 15px;">
                  <td style="padding-top: 10px;">Total Amount:</td>
                  <td style="text-align: right; padding-top: 10px; color: ${primaryColor};">₹${isReceipt ? '1,475.00' : '33,630.00'}</td>
                </tr>
              </table>
            </div>

            <div class="sign-block">
              <div style="font-family: 'Georgia', serif; font-size: 16px; font-style: italic;">Akash Verma</div>
              <div class="sign-line"></div>
              <span style="font-size: 11px; color: #64748B; font-weight: bold; margin-top: 6px;">Authorized Signatory</span>
            </div>

            <div class="footer-banner">
              ${invoiceFooter}
            </div>
          </div>

          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            }
          </script>
        </body>
      </html>
    `;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const handleSave = () => {
    if (activeTab === 'mobile' || activeTab === 'sliders') {
      handleSaveSliders();
    } else {
      alert('White-label portal configuration details successfully saved and deployed!');
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="ev-shell">
        <Sidebar activePath="/settings/white-label" />
        <div className="ev-main">
          
          <TopBar 
            title="White Label Management" 
            subtitle="Customize your brand identity across platform, mobile apps, invoices and communications." 
          />

          <div className="ev-body">
            
            {/* Breadcrumb */}
            <div className="fr-bc">
              <a href="/">Home</a>
              <span className="fr-bc-sep">&gt;</span>
              <a href="/settings">Settings</a>
              <span className="fr-bc-sep">&gt;</span>
              <span className="fr-bc-cur">White Label</span>
            </div>

            {/* Stepper / Tab headers */}
            <div className="wl-tabs">
              {[
                { key: 'brand', label: 'Brand Identity' },
                { key: 'domain', label: 'Domain & App' },
                { key: 'sliders', label: 'App Sliders' },
                { key: 'email', label: 'Email & Notifications' },
                { key: 'invoice', label: 'Invoice & Docs' },
                { key: 'advanced', label: 'Advanced' }
              ].map(t => (
                <button 
                  key={t.key} 
                  className={`wl-tab ${activeTab === t.key ? 'act' : ''}`}
                  onClick={() => setActiveTab(t.key)}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Title section with Save action */}
            <div className="wl-hdr" style={{ marginTop: '4px' }}>
              <div>
                <h2 className="wl-title-h1">White Label Settings</h2>
                <p className="wl-title-sub">Configure platform logos, SMTP receipts and client portals settings.</p>
              </div>
              <div className="wl-hdr-actions">
                <button className="wl-btn" onClick={() => alert('Opening live site preview...')}>Preview Live Site ↗</button>
                <button className="wl-btn wl-btn-primary" onClick={handleSave}>Save & Publish</button>
              </div>
            </div>

            {/* Render active tab content */}
            {activeTab === 'brand' && (
              <div className="wl-layout">
                {/* Left Forms column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  
                  {/* Brand info */}
                  <div className="wl-panel">
                    <div className="wl-panel-hdr">
                      <span className="wl-panel-tit">Brand Information</span>
                    </div>
                    <div className="wl-panel-body">
                      <div className="wl-form-group">
                        <label className="wl-lbl">Company Name <span>*</span></label>
                        <input type="text" className="wl-inp" value={companyName} onChange={e => setCompanyName(e.target.value)} />
                      </div>
                      <div className="wl-form-row">
                        <div className="wl-form-group">
                          <label className="wl-lbl">Platform Name <span>*</span></label>
                          <input type="text" className="wl-inp" value={platformName} onChange={e => setPlatformName(e.target.value)} />
                        </div>
                        <div className="wl-form-group">
                          <label className="wl-lbl">Tagline</label>
                          <input type="text" className="wl-inp" value={tagline} onChange={e => setTagline(e.target.value)} />
                        </div>
                      </div>
                      <div className="wl-form-row">
                        <div className="wl-form-group">
                          <label className="wl-lbl">Support Email <span>*</span></label>
                          <input type="email" className="wl-inp" value={supportEmail} onChange={e => setSupportEmail(e.target.value)} />
                        </div>
                        <div className="wl-form-group">
                          <label className="wl-lbl">Support Phone <span>*</span></label>
                          <input type="text" className="wl-inp" value={supportPhone} onChange={e => setSupportPhone(e.target.value)} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Logo Icon Management */}
                  <div className="wl-panel">
                    <div className="wl-panel-hdr">
                      <span className="wl-panel-tit">Logo & Icon Management</span>
                    </div>
                    <div className="wl-panel-body" style={{ gap: '10px' }}>
                      {[
                        { label: 'Light Logo', desc: 'Used on light backgrounds (min 200x50px)' },
                        { label: 'Dark Logo', desc: 'Used on dark backgrounds (min 200x50px)' },
                        { label: 'Favicon (32x32)', desc: 'Used in browser tabs (ICO/PNG format)' },
                        { label: 'Mobile Splash Logo', desc: 'Used on app loading screens (PNG/SVG format)' }
                      ].map(logo => (
                        <div className="logo-upload-row" key={logo.label}>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '12px', fontWeight: '700', color: '#1E293B' }}>{logo.label}</span>
                            <span style={{ fontSize: '10px', color: '#64748B' }}>{logo.desc}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div className="logo-preview-box" style={{ background: logo.label === 'Dark Logo' ? '#1E293B' : '#fff' }}>
                              <span style={{ fontSize: '9px', fontWeight: 'bold', color: logo.label === 'Dark Logo' ? '#fff' : primaryColor }}>{platformName}</span>
                            </div>
                            <button className="wl-btn" style={{ padding: '6px 12px', fontSize: '11px' }}>Upload</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Theme Customization */}
                  <div className="wl-panel">
                    <div className="wl-panel-hdr">
                      <span className="wl-panel-tit">Theme Customization</span>
                    </div>
                    <div className="wl-panel-body">
                      <div className="wl-form-row">
                        <div className="wl-form-group">
                          <label className="wl-lbl">Primary Color</label>
                          <div className="color-picker-row">
                            <span className="color-picker-box" style={{ background: primaryColor }}>
                              <input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} />
                            </span>
                            <input type="text" className="wl-inp" style={{ flex: 1 }} value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} />
                          </div>
                        </div>
                        <div className="wl-form-group">
                          <label className="wl-lbl">Secondary Color</label>
                          <div className="color-picker-row">
                            <span className="color-picker-box" style={{ background: secondaryColor }}>
                              <input type="color" value={secondaryColor} onChange={e => setSecondaryColor(e.target.value)} />
                            </span>
                            <input type="text" className="wl-inp" style={{ flex: 1 }} value={secondaryColor} onChange={e => setSecondaryColor(e.target.value)} />
                          </div>
                        </div>
                      </div>

                      <div className="wl-form-row">
                        <div className="wl-form-group">
                          <label className="wl-lbl">Accent Color</label>
                          <div className="color-picker-row">
                            <span className="color-picker-box" style={{ background: accentColor }}>
                              <input type="color" value={accentColor} onChange={e => setAccentColor(e.target.value)} />
                            </span>
                            <input type="text" className="wl-inp" style={{ flex: 1 }} value={accentColor} onChange={e => setAccentColor(e.target.value)} />
                          </div>
                        </div>
                        <div className="wl-form-group">
                          <label className="wl-lbl">Font Family</label>
                          <select className="wl-inp wl-select" value={fontFamily} onChange={e => setFontFamily(e.target.value)}>
                            <option>Inter</option>
                            <option>Roboto</option>
                            <option>Outfit</option>
                          </select>
                        </div>
                      </div>

                      <div className="wl-form-row">
                        <div className="wl-form-group">
                          <label className="wl-lbl">Button Style</label>
                          <div style={{ display: 'flex', gap: '14px', padding: '6px 0' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                              <input type="radio" checked={buttonStyle === 'rounded'} onChange={() => setButtonStyle('rounded')} />
                              Rounded
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                              <input type="radio" checked={buttonStyle === 'square'} onChange={() => setButtonStyle('square')} />
                              Square
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Social and Contact links */}
                  <div className="wl-panel">
                    <div className="wl-panel-hdr">
                      <span className="wl-panel-tit">Social & Contact Links</span>
                    </div>
                    <div className="wl-panel-body">
                      {[
                        { label: 'Website', placeholder: 'https://www.evegah.com' },
                        { label: 'Facebook', placeholder: 'https://facebook.com/evegah' },
                        { label: 'Instagram', placeholder: 'https://instagram.com/evegah' },
                        { label: 'LinkedIn', placeholder: 'https://linkedin.com/company/evegah' }
                      ].map(link => (
                        <div className="wl-form-group" key={link.label}>
                          <label className="wl-lbl">{link.label}</label>
                          <input type="text" className="wl-inp" placeholder={link.placeholder} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer configuration */}
                  <div className="wl-panel">
                    <div className="wl-panel-hdr">
                      <span className="wl-panel-tit">Footer Configuration</span>
                    </div>
                    <div className="wl-panel-body">
                      <div className="wl-form-group">
                        <label className="wl-lbl">Copyright Text</label>
                        <input type="text" className="wl-inp" value={copyrightText} onChange={e => setCopyrightText(e.target.value)} />
                      </div>
                      <div className="wl-form-group">
                        <label className="wl-lbl">Footer Description</label>
                        <textarea className="wl-inp" style={{ height: '60px', resize: 'none' }} value={footerDesc} onChange={e => setFooterDesc(e.target.value)} />
                      </div>
                      <div className="wl-form-group">
                        <label className="wl-lbl">Quick Links</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                          {quickLinks.map((link, idx) => (
                            <span key={idx} className="wl-tag">
                              {link.label}
                              <button className="wl-tag-del" onClick={() => removeQuickLink(idx)}>×</button>
                            </span>
                          ))}
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <input 
                            type="text" 
                            className="wl-inp" 
                            placeholder="Add new link label" 
                            style={{ flex: 1 }} 
                            value={newLinkLabel} 
                            onChange={e => setNewLinkLabel(e.target.value)} 
                          />
                          <button className="wl-btn wl-btn-primary" onClick={addQuickLink}>+ Add</button>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Right Preview column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  
                  {/* Live preview */}
                  <div className="wl-panel">
                    <div className="wl-panel-hdr">
                      <span className="wl-panel-tit">Live Brand Preview</span>
                    </div>
                    <div className="wl-panel-body">
                      <div className="prev-tabs">
                        <button className={`prev-tab ${brandPreviewTab === 'dashboard' ? 'act' : ''}`} onClick={() => setBrandPreviewTab('dashboard')}>Dashboard</button>
                        <button className={`prev-tab ${brandPreviewTab === 'rider' ? 'act' : ''}`} onClick={() => setBrandPreviewTab('rider')}>Rider App</button>
                      </div>

                      {brandPreviewTab === 'dashboard' ? (
                        <div className="mock-dashboard">
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', fontWeight: 'bold' }}>
                            <span style={{ color: primaryColor, fontSize: '12px' }}>{platformName}</span>
                            <span>Akash Verma</span>
                          </div>
                          <div className="mock-kpis">
                            <div className="mock-kpi">
                              <span className="mock-kpi-lbl">Revenue MTD</span>
                              <span className="mock-kpi-val">₹28,75,450</span>
                              <span className="mock-kpi-sub">↑ 16.2%</span>
                            </div>
                            <div className="mock-kpi">
                              <span className="mock-kpi-lbl">Franchises</span>
                              <span className="mock-kpi-val">42</span>
                              <span className="mock-kpi-sub">↑ 10.2%</span>
                            </div>
                            <div className="mock-kpi">
                              <span className="mock-kpi-lbl">Total Rides</span>
                              <span className="mock-kpi-val">1,842</span>
                              <span className="mock-kpi-sub">↑ 12.5%</span>
                            </div>
                          </div>
                          <button style={{ width: '100%', padding: '6px', background: primaryColor, color: '#fff', border: 'none', borderRadius: buttonStyle === 'rounded' ? '20px' : '4px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>
                            Primary Button
                          </button>
                        </div>
                      ) : (
                        <div className="mock-app-screen" style={{ background: `linear-gradient(135deg, ${primaryColor} 0%, #1e1b4b 100%)` }}>
                          <div style={{ fontSize: '18px', fontWeight: '800', marginBottom: '4px' }}>{platformName}</div>
                          <div style={{ fontSize: '9px', opacity: 0.8 }}>{tagline}</div>
                          <input type="text" className="mock-app-inp" placeholder="Enter Mobile Number" disabled />
                          <button style={{ width: '100%', padding: '8px', background: secondaryColor, color: '#fff', border: 'none', borderRadius: buttonStyle === 'rounded' ? '20px' : '4px', fontSize: '10px', fontWeight: 'bold', marginTop: '10px' }}>
                            Get OTP
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Brand Color Preview */}
                  <div className="wl-panel">
                    <div className="wl-panel-hdr">
                      <span className="wl-panel-tit">Brand Color Preview</span>
                    </div>
                    <div className="wl-panel-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '9px', color: '#64748B', fontWeight: 'bold' }}>Primary</span>
                        <div style={{ height: '34px', background: primaryColor, borderRadius: '6px' }} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '9px', color: '#64748B', fontWeight: 'bold' }}>Secondary</span>
                        <div style={{ height: '34px', background: secondaryColor, borderRadius: '6px' }} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '9px', color: '#64748B', fontWeight: 'bold' }}>Accent</span>
                        <div style={{ height: '34px', background: accentColor, borderRadius: '6px' }} />
                      </div>
                    </div>
                  </div>

                  {/* Typography Preview */}
                  <div className="wl-panel">
                    <div className="wl-panel-hdr">
                      <span className="wl-panel-tit">Typography Preview</span>
                    </div>
                    <div className="wl-panel-body" style={{ fontFamily: fontFamily }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <strong style={{ fontSize: '24px' }}>Aa</strong>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{fontFamily}</span>
                          <span style={{ fontSize: '10px', color: '#64748B' }}>The quick brown fox jumps over the lazy dog.</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Button Preview */}
                  <div className="wl-panel">
                    <div className="wl-panel-hdr">
                      <span className="wl-panel-tit">Button Preview</span>
                    </div>
                    <div className="wl-panel-body" style={{ display: 'flex', gap: '12px' }}>
                      <button style={{ flex: 1, padding: '9px', background: primaryColor, color: '#fff', border: 'none', borderRadius: buttonStyle === 'rounded' ? '20px' : '4px', fontSize: '11px', fontWeight: 'bold' }}>
                        Primary Button
                      </button>
                      <button style={{ flex: 1, padding: '9.5px', background: '#fff', border: `1.5px solid ${secondaryColor}`, color: secondaryColor, borderRadius: buttonStyle === 'rounded' ? '20px' : '4px', fontSize: '11px', fontWeight: 'bold' }}>
                        Secondary Button
                      </button>
                    </div>
                  </div>

                  {/* Modules visibility */}
                  <div className="wl-panel">
                    <div className="wl-panel-hdr">
                      <span className="wl-panel-tit">Platform Modules Visibility</span>
                    </div>
                    <div className="wl-panel-body" style={{ padding: '10px 16px' }}>
                      {[
                        { label: 'Battery Swapping', checked: true },
                        { label: 'Vehicle Rental', checked: true },
                        { label: 'Rider App Portal', checked: true },
                        { label: 'Franchise Management', checked: true },
                        { label: 'System Analytics & Reports', checked: true },
                        { label: 'Announcements Module', checked: true }
                      ].map(mod => (
                        <div className="wl-switch-wrap" key={mod.label}>
                          <span className="wl-switch-lbl">{mod.label}</span>
                          <label style={{ display: 'flex' }}>
                            <input type="checkbox" className="switch-inp" defaultChecked={mod.checked} />
                            <span className="switch-slider" />
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Email branding preview */}
                  <div className="wl-panel">
                    <div className="wl-panel-hdr">
                      <span className="wl-panel-tit">Email Branding Preview</span>
                    </div>
                    <div className="wl-panel-body">
                      <div className="mock-email">
                        <div className="mock-email-hdr" style={{ background: primaryColor }}>
                          {platformName}
                        </div>
                        <div className="mock-email-body">
                          <strong>Hi [User Name],</strong><br/>
                          <p style={{ margin: '8px 0 14px' }}>This is a system generated transactional email from the platform.</p>
                          <span>Thank you,<br/><strong>{platformName} Team</strong></span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {activeTab === 'domain' && (
              <div className="wl-layout">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  
                  {/* Domain Configuration */}
                  <div className="wl-panel">
                    <div className="wl-panel-hdr">
                      <span className="wl-panel-tit">Domain Management</span>
                      <button className="wl-btn wl-btn-primary" style={{ padding: '6px 12px', fontSize: '11px' }} onClick={() => alert('Initializing DNS management...')}>Manage DNS</button>
                    </div>
                    <div className="wl-panel-body">
                      <div className="wl-form-group">
                        <label className="wl-lbl">Primary Portal URL</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <input type="text" className="wl-inp" style={{ flex: 1 }} value={primaryDomain} onChange={e => setPrimaryDomain(e.target.value)} />
                          <span className="badge-pill badge-active" style={{ display: 'inline-flex', alignItems: 'center', height: '34px' }}>Verified</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                        <div className="domain-subcard">
                          <span style={{ fontSize: '10px', color: '#64748B', fontWeight: 'bold' }}>DNS Setup</span>
                          <span style={{ fontSize: '14px', fontWeight: '800', color: '#10B981', display: 'block', marginTop: '4px' }}>Verified</span>
                        </div>
                        <div className="domain-subcard">
                          <span style={{ fontSize: '10px', color: '#64748B', fontWeight: 'bold' }}>SSL Certificate</span>
                          <span style={{ fontSize: '14px', fontWeight: '800', color: '#3B82F6', display: 'block', marginTop: '4px' }}>Active</span>
                        </div>
                        <div className="domain-subcard">
                          <span style={{ fontSize: '10px', color: '#64748B', fontWeight: 'bold' }}>SSL Expiry</span>
                          <span style={{ fontSize: '11px', fontWeight: '800', color: '#8B5CF6', display: 'block', marginTop: '6px' }}>15 May 2025 (89d)</span>
                        </div>
                        <div className="domain-subcard">
                          <span style={{ fontSize: '10px', color: '#64748B', fontWeight: 'bold' }}>HTTPS Redirect</span>
                          <span style={{ fontSize: '14px', fontWeight: '800', color: '#10B981', display: 'block', marginTop: '4px' }}>Enabled</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Subdomain Configurations */}
                  <div className="wl-panel">
                    <div className="wl-panel-hdr">
                      <span className="wl-panel-tit">Subdomain Configuration (Optional)</span>
                      <button className="wl-btn" style={{ padding: '6px 12px', fontSize: '11.5px', color: '#6366F1', borderColor: '#6366F1' }} onClick={() => alert('New subdomain popup')}>+ Add Sub Domain</button>
                    </div>
                    <div className="wl-panel-body" style={{ padding: 0 }}>
                      <table className="sub-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ background: '#F8FAFC' }}>
                            <th style={{ fontSize: '10px', padding: '10px 16px', textTransform: 'uppercase', textAlign: 'left', color: '#94A3B8' }}>Sub Domain</th>
                            <th style={{ fontSize: '10px', padding: '10px', textTransform: 'uppercase', textAlign: 'left', color: '#94A3B8' }}>Module</th>
                            <th style={{ fontSize: '10px', padding: '10px', textTransform: 'uppercase', textAlign: 'left', color: '#94A3B8' }}>Status</th>
                            <th style={{ fontSize: '10px', padding: '10px', textTransform: 'uppercase', textAlign: 'right', color: '#94A3B8', paddingRight: '16px' }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { sd: 'rider.evegah.com', mod: 'Rider App', st: 'Active' },
                            { sd: 'franchise.evegah.com', mod: 'Franchise Portal', st: 'Active' },
                            { sd: 'api.evegah.com', mod: 'API Services', st: 'Active' },
                            { sd: 'docs.evegah.com', mod: 'Documentation', st: 'Inactive' }
                          ].map(row => (
                            <tr key={row.sd}>
                              <td style={{ padding: '12px 16px', fontSize: '12.5px', fontWeight: 'bold' }}>{row.sd}</td>
                              <td style={{ padding: '12px 10px', fontSize: '12.5px', color: '#475569' }}>{row.mod}</td>
                              <td style={{ padding: '12px 10px' }}>
                                <span className={`badge-pill ${row.st === 'Active' ? 'badge-active' : 'badge-expired'}`} style={{ fontSize: '9px', padding: '2px 8px' }}>{row.st}</span>
                              </td>
                              <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', marginRight: '8px' }}>✏</button>
                                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444' }}>🗑</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Mobile App Configuration */}
                  <div className="wl-panel">
                    <div className="wl-panel-hdr">
                      <span className="wl-panel-tit">Mobile App Configuration</span>
                    </div>
                    <div className="wl-panel-body">
                      <div className="prev-tabs">
                        <button className={`prev-tab ${activeAppTab === 'android' ? 'act' : ''}`} onClick={() => setActiveAppTab('android')}>Android App</button>
                        <button className={`prev-tab ${activeAppTab === 'ios' ? 'act' : ''}`} onClick={() => setActiveAppTab('ios')}>iOS App</button>
                      </div>

                      <div className="wl-form-row">
                        <div className="wl-form-group">
                          <label className="wl-lbl">App Name <span>*</span></label>
                          <input type="text" className="wl-inp" value={appName} onChange={e => setAppName(e.target.value)} />
                        </div>
                        <div className="wl-form-group">
                          <label className="wl-lbl">Package Name / Bundle ID <span>*</span></label>
                          <input type="text" className="wl-inp" value={packageName} onChange={e => setPackageName(e.target.value)} />
                        </div>
                      </div>

                      <div className="wl-form-row">
                        <div className="wl-form-group">
                          <label className="wl-lbl">Version <span>*</span></label>
                          <input type="text" className="wl-inp" value={appVersion} onChange={e => setAppVersion(e.target.value)} />
                        </div>
                        <div className="wl-form-group">
                          <label className="wl-lbl">Minimum OS Version <span>*</span></label>
                          <select className="wl-inp wl-select">
                            <option>{activeAppTab === 'android' ? 'Android 7.0 (API 24)' : 'iOS 13.0'}</option>
                            <option>{activeAppTab === 'android' ? 'Android 8.0 (API 26)' : 'iOS 14.0'}</option>
                          </select>
                        </div>
                      </div>

                      <div className="wl-form-row" style={{ marginTop: '10px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <span className="wl-lbl">App Icon</span>
                          <div style={{ border: '1.5px dashed #CBD5E1', borderRadius: '8px', padding: '16px', textAlign: 'center', background: '#F8FAFC', cursor: 'pointer' }}>
                            <span style={{ fontSize: '18px' }}>📤</span>
                            <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#2A195C', marginTop: '4px' }}>Upload Icon</div>
                            <span style={{ fontSize: '8.5px', color: '#94A3B8' }}>PNG, 512x512px</span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <span className="wl-lbl">Splash Screen</span>
                          <div style={{ border: '1.5px dashed #CBD5E1', borderRadius: '8px', padding: '16px', textAlign: 'center', background: '#F8FAFC', cursor: 'pointer' }}>
                            <span style={{ fontSize: '18px' }}>📤</span>
                            <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#2A195C', marginTop: '4px' }}>Upload Splash</div>
                            <span style={{ fontSize: '8.5px', color: '#94A3B8' }}>PNG, 1080x1920px</span>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                        <button className="wl-btn wl-btn-primary" onClick={() => alert('Mobile app configuration saved!')}>Save App Details</button>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Right side custom domain preview */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  
                  <div className="wl-panel">
                    <div className="wl-panel-hdr">
                      <span className="wl-panel-tit">App Download Information</span>
                    </div>
                    <div className="wl-panel-body" style={{ gap: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                        <div>
                          <strong>Android App</strong>
                          <span className="badge-pill badge-active" style={{ marginLeft: '6px' }}>Active</span>
                        </div>
                        <a href="#" style={{ color: '#6366F1', textDecoration: 'none', fontWeight: 'bold' }}>Play Store ↗</a>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                        <div>
                          <strong>iOS App</strong>
                          <span className="badge-pill badge-active" style={{ marginLeft: '6px' }}>Active</span>
                        </div>
                        <a href="#" style={{ color: '#6366F1', textDecoration: 'none', fontWeight: 'bold' }}>App Store ↗</a>
                      </div>
                    </div>
                  </div>

                  <div className="wl-panel">
                    <div className="wl-panel-hdr">
                      <span className="wl-panel-tit">Custom Domain Preview</span>
                    </div>
                    <div className="wl-panel-body">
                      <div className="browser-mock">
                        <div className="browser-bar">
                          <span className="browser-dot" />
                          <span className="browser-dot" />
                          <span className="browser-dot" />
                          <span className="browser-url">https://{primaryDomain}</span>
                        </div>
                        <div className="browser-screen">
                          <div style={{ background: primaryColor, borderRadius: '8px', padding: '20px', width: '100%', maxWidth: '200px', color: '#fff', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                            <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Welcome Back!</span>
                            <div style={{ background: '#fff', color: '#000', padding: '6px', borderRadius: '4px', marginTop: '16px', fontSize: '10px' }}>Sign In</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="wl-panel">
                    <div className="wl-panel-hdr">
                      <span className="wl-panel-tit">Domain Setup Guide</span>
                    </div>
                    <div className="wl-panel-body" style={{ fontSize: '11.5px', color: '#475569', gap: '10px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <span style={{ background: '#EEF2FF', color: '#6366F1', width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 'bold', flexShrink: 0 }}>1</span>
                        <span>Add CNAME record pointing to <code>cname.evegah.com</code> in DNS settings.</span>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <span style={{ background: '#EEF2FF', color: '#6366F1', width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 'bold', flexShrink: 0 }}>2</span>
                        <span>SSL certificates are automatically generated and renewed.</span>
                      </div>
                    </div>
                  </div>

                  <div className="wl-panel" style={{ display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'flex-start', background: '#FAF5FF', borderColor: '#E9D5FF', padding: '16px' }}>
                    <span style={{ fontSize: '18px' }}>📞</span>
                    <div style={{ fontSize: '11.5px', color: '#6B7280', lineHeight: '1.4' }}>
                      <strong style={{ display: 'block', color: '#2A195C', marginBottom: '2px' }}>Need Help?</strong>
                      Facing issues with custom domain setup?
                      <button style={{ marginTop: '8px', display: 'block', padding: '6px 12px', background: '#2A195C', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => alert('Contacting network team...')}>Contact Support</button>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {activeTab === 'sliders' && (() => {
  const activeSlide = currentSliderList[selectedSlideIdx] || currentSliderList[0] || {};
  const currentTag = activeSlide.badgeText || activeSlide.tag || `Slider ${selectedSlideIdx + 1}`;
  const currentTitle = activeSlide.title || '';
  const currentSub = activeSlide.subtitle !== undefined ? activeSlide.subtitle : (activeSlide.sub || '');
  const currentCta = activeSlide.cta || '';
  
  const showBadge = activeSlide.showBadge !== false && Boolean(currentTag.trim());
  const showTitle = activeSlide.showTitle !== false && Boolean(currentTitle.trim());
  const showSubtitle = activeSlide.showSubtitle !== false && Boolean(currentSub.trim());
  const showCta = activeSlide.showCta !== false && Boolean(currentCta.trim());
  const hasTextInPreview = showBadge || showTitle || showSubtitle || showCta;

  const fontStyle = activeSlide.fontStyle || 'signature';
  let fontFamStyle: React.CSSProperties = { fontFamily: "'Caveat', cursive", fontWeight: 700 };
  if (fontStyle === 'sans') {
    fontFamStyle = { fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 };
  } else if (fontStyle === 'bold') {
    fontFamStyle = { fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.5px' };
  } else if (fontStyle === 'serif') {
    fontFamStyle = { fontFamily: "'Playfair Display', serif", fontWeight: 700 };
  } else if (fontStyle === 'mono') {
    fontFamStyle = { fontFamily: "'Space Mono', monospace", fontWeight: 700 };
  }

  const applyQuickStyle = (preset: string) => {
    if (preset === 'default') {
      handleUpdateSlide(selectedSlideIdx, 'quickStyle', 'default');
      handleUpdateSlide(selectedSlideIdx, 'fontStyle', 'signature');
      handleUpdateSlide(selectedSlideIdx, 'badgeBg', '#6366F1');
      handleUpdateSlide(selectedSlideIdx, 'badgeTextColor', '#FFFFFF');
      handleUpdateSlide(selectedSlideIdx, 'ctaBg', '#2A195C');
      handleUpdateSlide(selectedSlideIdx, 'ctaTextColor', '#FFFFFF');
      handleUpdateSlide(selectedSlideIdx, 'overlayColor', '#FFFFFF');
      handleUpdateSlide(selectedSlideIdx, 'overlayOpacity', 65);
    } else if (preset === 'festive') {
      handleUpdateSlide(selectedSlideIdx, 'quickStyle', 'festive');
      handleUpdateSlide(selectedSlideIdx, 'fontStyle', 'signature');
      handleUpdateSlide(selectedSlideIdx, 'badgeBg', '#D97706');
      handleUpdateSlide(selectedSlideIdx, 'badgeTextColor', '#FFFFFF');
      handleUpdateSlide(selectedSlideIdx, 'ctaBg', '#B45309');
      handleUpdateSlide(selectedSlideIdx, 'ctaTextColor', '#FFFFFF');
      handleUpdateSlide(selectedSlideIdx, 'overlayColor', '#FFFBEB');
      handleUpdateSlide(selectedSlideIdx, 'overlayOpacity', 50);
    } else if (preset === 'minimal') {
      handleUpdateSlide(selectedSlideIdx, 'quickStyle', 'minimal');
      handleUpdateSlide(selectedSlideIdx, 'fontStyle', 'sans');
      handleUpdateSlide(selectedSlideIdx, 'badgeBg', '#F1F5F9');
      handleUpdateSlide(selectedSlideIdx, 'badgeTextColor', '#334155');
      handleUpdateSlide(selectedSlideIdx, 'ctaBg', '#0F172A');
      handleUpdateSlide(selectedSlideIdx, 'ctaTextColor', '#FFFFFF');
      handleUpdateSlide(selectedSlideIdx, 'overlayColor', '#FFFFFF');
      handleUpdateSlide(selectedSlideIdx, 'overlayOpacity', 80);
    } else if (preset === 'bold') {
      handleUpdateSlide(selectedSlideIdx, 'quickStyle', 'bold');
      handleUpdateSlide(selectedSlideIdx, 'fontStyle', 'bold');
      handleUpdateSlide(selectedSlideIdx, 'badgeBg', '#EF4444');
      handleUpdateSlide(selectedSlideIdx, 'badgeTextColor', '#FFFFFF');
      handleUpdateSlide(selectedSlideIdx, 'ctaBg', '#DC2626');
      handleUpdateSlide(selectedSlideIdx, 'ctaTextColor', '#FFFFFF');
      handleUpdateSlide(selectedSlideIdx, 'overlayColor', '#000000');
      handleUpdateSlide(selectedSlideIdx, 'overlayOpacity', 40);
    } else if (preset === 'modern') {
      handleUpdateSlide(selectedSlideIdx, 'quickStyle', 'modern');
      handleUpdateSlide(selectedSlideIdx, 'fontStyle', 'sans');
      handleUpdateSlide(selectedSlideIdx, 'badgeBg', '#3B82F6');
      handleUpdateSlide(selectedSlideIdx, 'badgeTextColor', '#FFFFFF');
      handleUpdateSlide(selectedSlideIdx, 'ctaBg', '#2563EB');
      handleUpdateSlide(selectedSlideIdx, 'ctaTextColor', '#FFFFFF');
      handleUpdateSlide(selectedSlideIdx, 'overlayColor', '#EFF6FF');
      handleUpdateSlide(selectedSlideIdx, 'overlayOpacity', 60);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* 1. Header Row */}
      <div className="slider-studio-hdr">
        <div>
          <div className="slider-studio-title">
            <h2>App Slider Studio</h2>
            <span className="slider-new-badge">New</span>
          </div>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748B' }}>
            Create and manage promotional sliders for Rider App screens with real-time preview.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            className="wl-btn"
            onClick={() => alert('Live preview synchronized in right mobile panel!')}
            style={{ fontSize: '12.5px', fontWeight: 700 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
              <line x1="12" y1="18" x2="12.01" y2="18" />
            </svg>
            <span>Preview in App</span>
          </button>

          <button
            type="button"
            className="wl-btn"
            onClick={() => {
              localStorage.setItem('slider_draft_' + sliderScreen, JSON.stringify(currentSliderList));
              alert('Slider configuration successfully saved as draft locally!');
            }}
            style={{ fontSize: '12.5px', fontWeight: 700 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            <span>Save as Draft</span>
          </button>

          <button
            type="button"
            className="wl-btn wl-btn-primary"
            onClick={handleSaveSliders}
            disabled={isSavingSliders}
            style={{ fontSize: '12.5px', fontWeight: 700, background: '#6366F1', borderColor: '#6366F1' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            <span>{isSavingSliders ? 'Publishing...' : 'Save & Publish'}</span>
          </button>
        </div>
      </div>

      {/* 2. Screen Switcher Capsule */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div className="slider-screen-pills" style={{ background: '#E2E8F0', padding: '4px', borderRadius: '12px' }}>
          <button
            type="button"
            className={`slider-screen-btn ${sliderScreen === 'rent' ? 'act' : ''}`}
            onClick={() => { setSliderScreen('rent'); setSelectedSlideIdx(0); }}
            style={{ fontSize: '13px', fontWeight: 700, padding: '8px 18px', borderRadius: '9px' }}
          >
            Rent Screen Sliders <span style={{ marginLeft: '6px', padding: '2px 8px', borderRadius: '12px', background: sliderScreen === 'rent' ? '#EDE9FE' : '#CBD5E1', color: sliderScreen === 'rent' ? '#6366F1' : '#475569', fontSize: '11px', fontWeight: 800 }}>{rentSliders.length}</span>
          </button>
          <button
            type="button"
            className={`slider-screen-btn ${sliderScreen === 'home' ? 'act' : ''}`}
            onClick={() => { setSliderScreen('home'); setSelectedSlideIdx(0); }}
            style={{ fontSize: '13px', fontWeight: 700, padding: '8px 18px', borderRadius: '9px' }}
          >
            Home Screen Sliders <span style={{ marginLeft: '6px', padding: '2px 8px', borderRadius: '12px', background: sliderScreen === 'home' ? '#EDE9FE' : '#CBD5E1', color: sliderScreen === 'home' ? '#6366F1' : '#475569', fontSize: '11px', fontWeight: 800 }}>{homeSliders.length}</span>
          </button>
        </div>
      </div>

      {sliderSaveMsg && (
        <div style={{ background: '#ECFDF5', border: '1.5px solid #A7F3D0', padding: '12px 16px', borderRadius: '10px', color: '#065F46', fontSize: '12.5px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <span>{sliderSaveMsg}</span>
        </div>
      )}

      {/* 3. Three Column Studio Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '270px 1fr 380px', gap: '20px', alignItems: 'start' }}>
        
        {/* Column 1: Manage Sliders List */}
        <div className="wl-panel" style={{ borderRadius: '16px' }}>
          <div className="wl-panel-hdr" style={{ padding: '14px 16px' }}>
            <span style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>Manage Sliders</span>
            <button
              type="button"
              onClick={handleAddSlide}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 12px',
                borderRadius: '8px',
                background: '#6366F1',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '11.5px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              + Add Slide
            </button>
          </div>

          <div className="wl-panel-body" style={{ padding: '12px', gap: '10px' }}>
            {currentSliderList.map((slide: any, idx: number) => {
              const isSelected = selectedSlideIdx === idx;
              const isActive = slide.active !== false;
              const slideThumbBg = slide.bg ? normalizeImageUrl(slide.bg) : '';
              const slideThumbFront = slide.front ? normalizeImageUrl(slide.front) : '';

              return (
                <div
                  key={slide.id || idx}
                  className={`slider-card-item ${isSelected ? 'act' : ''}`}
                  onClick={() => setSelectedSlideIdx(idx)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {/* Drag Handle */}
                    <span style={{ color: '#94A3B8', cursor: 'grab', fontSize: '14px', userSelect: 'none' }}>⋮⋮</span>

                    {/* Thumbnail */}
                    <div style={{
                      width: '46px',
                      height: '34px',
                      borderRadius: '6px',
                      border: '1px solid #E2E8F0',
                      background: slideThumbBg ? `url(${slideThumbBg}) center/cover` : '#F1F5F9',
                      position: 'relative',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {slideThumbFront ? (
                        <img
                          src={slideThumbFront}
                          alt="cutout"
                          style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                          onError={e => { (e.target as any).style.display = 'none'; }}
                        />
                      ) : !slideThumbBg ? (
                        <span style={{ fontSize: '8px', color: '#94A3B8', fontWeight: 700 }}>EV</span>
                      ) : null}
                    </div>

                    {/* Label & Active Pill */}
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>
                        Slider {idx + 1}
                      </div>
                      <span style={{
                        fontSize: '9.5px',
                        fontWeight: 700,
                        color: isActive ? '#10B981' : '#94A3B8',
                        background: isActive ? '#ECFDF5' : '#F1F5F9',
                        padding: '1px 6px',
                        borderRadius: '6px',
                        display: 'inline-block',
                        marginTop: '2px'
                      }}>
                        {isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  {/* 3-dots action button */}
                  <div style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => {
                        const action = confirm(`Slider ${idx + 1}: Click OK to duplicate this slide, or Cancel to delete it.`);
                        if (action) {
                          const dup = { ...slide, id: `slide_${sliderScreen}_${Date.now()}`, tag: `${slide.tag || ''} (Copy)` };
                          setCurrentSliderList((prev: any[]) => [...prev, dup]);
                        } else {
                          handleDeleteSlide(idx);
                        }
                      }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', fontSize: '16px', padding: '4px' }}
                      title="Slide Options"
                    >
                      ⋮
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Column 2: Edit Slide Form */}
        <div className="wl-panel" style={{ borderRadius: '16px' }}>
          {/* Header of Edit Slide */}
          <div className="wl-panel-hdr" style={{ padding: '16px 20px', borderBottom: '1px solid #F1F5F9' }}>
            <span style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A' }}>
              Edit Slide – Slider {selectedSlideIdx + 1}
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>Active</span>
                <input
                  type="checkbox"
                  className="switch-inp"
                  checked={activeSlide.active !== false}
                  onChange={e => handleUpdateSlide(selectedSlideIdx, 'active', e.target.checked)}
                />
                <span className="switch-slider" />
              </label>

              <button
                type="button"
                className="wl-tag-del"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  background: '#FEE2E2',
                  color: '#DC2626',
                  fontWeight: 700,
                  fontSize: '12px'
                }}
                onClick={() => handleDeleteSlide(selectedSlideIdx)}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
                <span>Delete</span>
              </button>
            </div>
          </div>

          <div className="wl-panel-body" style={{ padding: '20px' }}>
            {/* 4 Sub-Tabs */}
            <div className="slider-subtabs">
              <button
                type="button"
                className={`slider-subtab ${editorSubTab === 'content' ? 'act' : ''}`}
                onClick={() => setEditorSubTab('content')}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9"/>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                </svg>
                <span>Content</span>
              </button>

              <button
                type="button"
                className={`slider-subtab ${editorSubTab === 'typography' ? 'act' : ''}`}
                onClick={() => setEditorSubTab('typography')}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="4 7 4 4 20 4 20 7"/>
                  <line x1="9" y1="20" x2="15" y2="20"/>
                  <line x1="12" y1="4" x2="12" y2="20"/>
                </svg>
                <span>Typography</span>
              </button>

              <button
                type="button"
                className={`slider-subtab ${editorSubTab === 'background' ? 'act' : ''}`}
                onClick={() => setEditorSubTab('background')}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
                <span>Background</span>
              </button>

              <button
                type="button"
                className={`slider-subtab ${editorSubTab === 'cutout' ? 'act' : ''}`}
                onClick={() => setEditorSubTab('cutout')}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 2 7 12 12 22 7 12 2"/>
                  <polyline points="2 17 12 22 22 17"/>
                  <polyline points="2 12 12 17 22 12"/>
                </svg>
                <span>Cutout & Layout</span>
              </button>
            </div>

            {/* TAB 1: CONTENT */}
            {editorSubTab === 'content' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A' }}>Texts & Button</span>

                {/* Show Badge Row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '130px', flexShrink: 0, cursor: 'pointer' }}>
                    <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#1E293B' }}>Show Badge</span>
                    <input
                      type="checkbox"
                      className="switch-inp"
                      checked={activeSlide.showBadge !== false}
                      onChange={e => handleUpdateSlide(selectedSlideIdx, 'showBadge', e.target.checked)}
                    />
                    <span className="switch-slider" />
                  </label>

                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                      type="text"
                      className="wl-inp"
                      style={{ flex: 1 }}
                      placeholder="Badge Text (e.g. Festival Rental Offer)"
                      value={activeSlide.badgeText || activeSlide.tag || ''}
                      onChange={e => {
                        handleUpdateSlide(selectedSlideIdx, 'badgeText', e.target.value);
                        handleUpdateSlide(selectedSlideIdx, 'tag', e.target.value);
                      }}
                      disabled={activeSlide.showBadge === false}
                    />

                    {/* Color Swatches */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }} title="Badge Background Color">
                      <span style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 600 }}>BG</span>
                      <input
                        type="color"
                        value={activeSlide.badgeBg || '#6366F1'}
                        onChange={e => handleUpdateSlide(selectedSlideIdx, 'badgeBg', e.target.value)}
                        style={{ width: '28px', height: '28px', borderRadius: '6px', border: '1px solid #CBD5E1', cursor: 'pointer', padding: 0 }}
                        disabled={activeSlide.showBadge === false}
                      />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }} title="Badge Text Color">
                      <span style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 600 }}>Text</span>
                      <input
                        type="color"
                        value={activeSlide.badgeTextColor || '#FFFFFF'}
                        onChange={e => handleUpdateSlide(selectedSlideIdx, 'badgeTextColor', e.target.value)}
                        style={{ width: '28px', height: '28px', borderRadius: '6px', border: '1px solid #CBD5E1', cursor: 'pointer', padding: 0 }}
                        disabled={activeSlide.showBadge === false}
                      />
                    </div>
                  </div>
                </div>

                {/* Show Title Row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '130px', flexShrink: 0, cursor: 'pointer' }}>
                    <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#1E293B' }}>Show Title</span>
                    <input
                      type="checkbox"
                      className="switch-inp"
                      checked={activeSlide.showTitle !== false}
                      onChange={e => handleUpdateSlide(selectedSlideIdx, 'showTitle', e.target.checked)}
                    />
                    <span className="switch-slider" />
                  </label>

                  <div style={{ flex: 1, position: 'relative' }}>
                    <input
                      type="text"
                      className="wl-inp"
                      style={{ width: '100%', paddingRight: '56px' }}
                      placeholder="Title / Headline (e.g. This Diwali Ride Green)"
                      value={activeSlide.title || ''}
                      onChange={e => handleUpdateSlide(selectedSlideIdx, 'title', e.target.value)}
                      disabled={activeSlide.showTitle === false}
                    />
                    <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '10.5px', color: '#94A3B8', fontWeight: 600 }}>
                      {(activeSlide.title || '').length} / 40
                    </span>
                  </div>
                </div>

                {/* Show Subtitle Row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '130px', flexShrink: 0, cursor: 'pointer' }}>
                    <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#1E293B' }}>Show Subtitle</span>
                    <input
                      type="checkbox"
                      className="switch-inp"
                      checked={activeSlide.showSubtitle !== false}
                      onChange={e => handleUpdateSlide(selectedSlideIdx, 'showSubtitle', e.target.checked)}
                    />
                    <span className="switch-slider" />
                  </label>

                  <div style={{ flex: 1, position: 'relative' }}>
                    <input
                      type="text"
                      className="wl-inp"
                      style={{ width: '100%', paddingRight: '56px' }}
                      placeholder="Subtitle / Description (e.g. with Evegah)"
                      value={activeSlide.subtitle !== undefined ? activeSlide.subtitle : (activeSlide.sub || '')}
                      onChange={e => {
                        handleUpdateSlide(selectedSlideIdx, 'subtitle', e.target.value);
                        handleUpdateSlide(selectedSlideIdx, 'sub', e.target.value);
                      }}
                      disabled={activeSlide.showSubtitle === false}
                    />
                    <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '10.5px', color: '#94A3B8', fontWeight: 600 }}>
                      {(activeSlide.subtitle || activeSlide.sub || '').length} / 60
                    </span>
                  </div>
                </div>

                {/* Show CTA Button Row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '130px', flexShrink: 0, cursor: 'pointer' }}>
                    <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#1E293B' }}>Show CTA Button</span>
                    <input
                      type="checkbox"
                      className="switch-inp"
                      checked={activeSlide.showCta !== false}
                      onChange={e => handleUpdateSlide(selectedSlideIdx, 'showCta', e.target.checked)}
                    />
                    <span className="switch-slider" />
                  </label>

                  <div style={{ flex: 1, display: 'flex', gap: '10px' }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                      <input
                        type="text"
                        className="wl-inp"
                        style={{ width: '100%', paddingRight: '56px' }}
                        placeholder="Button Text (e.g. Book Your Ride Today)"
                        value={activeSlide.cta || ''}
                        onChange={e => handleUpdateSlide(selectedSlideIdx, 'cta', e.target.value)}
                        disabled={activeSlide.showCta === false}
                      />
                      <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '10.5px', color: '#94A3B8', fontWeight: 600 }}>
                        {(activeSlide.cta || '').length} / 30
                      </span>
                    </div>

                    <select
                      className="wl-inp wl-select"
                      style={{ width: '150px' }}
                      value={activeSlide.ctaLink || (sliderScreen === 'home' ? 'Rent Screen' : 'Vehicle Selection')}
                      onChange={e => handleUpdateSlide(selectedSlideIdx, 'ctaLink', e.target.value)}
                      disabled={activeSlide.showCta === false}
                    >
                      <option value="Rent Screen">Rent Screen</option>
                      <option value="Home Screen">Home Screen</option>
                      <option value="Vehicle Map">Vehicle Map</option>
                      <option value="Battery Swap">Battery Swap</option>
                      <option value="Wallet">Wallet</option>
                      <option value="Customer Support">Customer Support</option>
                    </select>
                  </div>
                </div>

                {/* Quick Style Presets */}
                <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A' }}>Quick Style</span>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
                    {[
                      { key: 'default', label: 'Default', bg: 'linear-gradient(135deg, #E0E7FF 0%, #EDE9FE 100%)' },
                      { key: 'festive', label: 'Festive', bg: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)' },
                      { key: 'minimal', label: 'Minimal', bg: 'linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 100%)' },
                      { key: 'bold', label: 'Bold', bg: 'linear-gradient(135deg, #FEE2E2 0%, #FED7AA 100%)' },
                      { key: 'modern', label: 'Modern', bg: 'linear-gradient(135deg, #DBEAFE 0%, #EDE9FE 100%)' }
                    ].map(style => (
                      <div
                        key={style.key}
                        className={`quick-style-card ${(activeSlide.quickStyle || 'default') === style.key ? 'act' : ''}`}
                        onClick={() => applyQuickStyle(style.key)}
                      >
                        <div className="quick-style-preview" style={{ background: style.bg }}>
                          {(activeSlide.quickStyle || 'default') === style.key && (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                          )}
                        </div>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#334155' }}>{style.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: TYPOGRAPHY */}
            {editorSubTab === 'typography' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A' }}>Typography & Font Style</span>

                {/* Font Selector Cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label className="wl-lbl">Headline Font Style</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                    {[
                      { key: 'signature', label: 'Signature Script', preview: 'Signature Script', style: { fontFamily: "'Caveat', cursive", fontSize: '18px' } },
                      { key: 'sans', label: 'Modern Sans', preview: 'Modern Sans', style: { fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '13px', fontWeight: 700 } },
                      { key: 'bold', label: 'Bold Display', preview: 'BOLD DISPLAY', style: { fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '12.5px', fontWeight: 900 } },
                      { key: 'serif', label: 'Elegant Serif', preview: 'Elegant Serif', style: { fontFamily: "'Playfair Display', serif", fontSize: '14px', fontWeight: 700 } },
                      { key: 'mono', label: 'Monospace', preview: 'Monospace', style: { fontFamily: "'Space Mono', monospace", fontSize: '12px' } }
                    ].map(f => (
                      <div
                        key={f.key}
                        onClick={() => handleUpdateSlide(selectedSlideIdx, 'fontStyle', f.key)}
                        style={{
                          padding: '12px 10px',
                          border: '1.5px solid',
                          borderColor: (activeSlide.fontStyle || 'signature') === f.key ? '#6366F1' : '#E2E8F0',
                          borderRadius: '10px',
                          background: (activeSlide.fontStyle || 'signature') === f.key ? '#F5F3FF' : '#FFFFFF',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '4px'
                        }}
                      >
                        <span style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 700 }}>{f.label}</span>
                        <span style={{ ...f.style, color: '#1E293B', lineHeight: 1.2 }}>{f.preview}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Font Sizes & Colors */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="wl-form-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label className="wl-lbl">Title Font Size</label>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#6366F1' }}>{activeSlide.titleFontSize || 26}px</span>
                    </div>
                    <input
                      type="range"
                      min="16"
                      max="48"
                      value={activeSlide.titleFontSize || 26}
                      onChange={e => handleUpdateSlide(selectedSlideIdx, 'titleFontSize', Number(e.target.value))}
                      style={{ cursor: 'pointer' }}
                    />
                  </div>

                  <div className="wl-form-group">
                    <label className="wl-lbl">Title Font Color</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="color"
                        value={activeSlide.titleColor || '#1E1B4B'}
                        onChange={e => handleUpdateSlide(selectedSlideIdx, 'titleColor', e.target.value)}
                        style={{ width: '34px', height: '34px', borderRadius: '6px', border: '1px solid #CBD5E1', cursor: 'pointer', padding: 0 }}
                      />
                      <input
                        type="text"
                        className="wl-inp"
                        style={{ flex: 1, padding: '7px 10px', fontSize: '12px' }}
                        value={activeSlide.titleColor || '#1E1B4B'}
                        onChange={e => handleUpdateSlide(selectedSlideIdx, 'titleColor', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="wl-form-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label className="wl-lbl">Subtitle Font Size</label>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#6366F1' }}>{activeSlide.subFontSize || 12}px</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="24"
                      value={activeSlide.subFontSize || 12}
                      onChange={e => handleUpdateSlide(selectedSlideIdx, 'subFontSize', Number(e.target.value))}
                      style={{ cursor: 'pointer' }}
                    />
                  </div>

                  <div className="wl-form-group">
                    <label className="wl-lbl">Subtitle Color</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="color"
                        value={activeSlide.subColor || '#475569'}
                        onChange={e => handleUpdateSlide(selectedSlideIdx, 'subColor', e.target.value)}
                        style={{ width: '34px', height: '34px', borderRadius: '6px', border: '1px solid #CBD5E1', cursor: 'pointer', padding: 0 }}
                      />
                      <input
                        type="text"
                        className="wl-inp"
                        style={{ flex: 1, padding: '7px 10px', fontSize: '12px' }}
                        value={activeSlide.subColor || '#475569'}
                        onChange={e => handleUpdateSlide(selectedSlideIdx, 'subColor', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: BACKGROUND */}
            {editorSubTab === 'background' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A' }}>Background Artwork & Overlay</span>

                {/* BG Image Asset */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label className="wl-lbl">Background Image Asset</label>
                  <div className="slider-asset-drop" onClick={e => e.stopPropagation()}>
                    {activeSlide.bg ? (
                      <img
                        src={normalizeImageUrl(activeSlide.bg)}
                        alt="Background preview"
                        className="slider-asset-thumb"
                        onError={(e: any) => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <div style={{ width: '68px', height: '46px', borderRadius: '6px', background: '#F1F5F9', border: '1px solid #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9.5px', color: '#64748B', fontWeight: 600 }}>
                        Default BG
                      </div>
                    )}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <label style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: 700, color: '#4F46E5' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="17 8 12 3 7 8"/>
                            <line x1="12" y1="3" x2="12" y2="15"/>
                          </svg>
                          <span>{uploadingField === `${selectedSlideIdx}-bg` ? 'Uploading...' : 'Upload BG Photo'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={e => handleUploadSliderFile(selectedSlideIdx, 'bg', e)}
                          />
                        </label>
                        {activeSlide.bg ? (
                          <button
                            type="button"
                            onClick={() => handleRemoveSliderFile(selectedSlideIdx, 'bg')}
                            style={{ fontSize: '11px', color: '#EF4444', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', padding: '1px 6px' }}
                            title="Clear image"
                          >
                            Clear
                          </button>
                        ) : null}
                      </div>
                      <input
                        type="text"
                        className="wl-inp"
                        style={{ fontSize: '11.5px', padding: '6px 10px' }}
                        placeholder="or paste image URL"
                        value={activeSlide.bg || ''}
                        onChange={e => handleUpdateSlide(selectedSlideIdx, 'bg', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Overlay Opacity Slider & Color */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: '16px', background: '#F8FAFC', padding: '14px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <div className="wl-form-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label className="wl-lbl">Overlay Opacity Adjust</label>
                      <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#6366F1' }}>{activeSlide.overlayOpacity !== undefined ? activeSlide.overlayOpacity : 65}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={activeSlide.overlayOpacity !== undefined ? activeSlide.overlayOpacity : 65}
                      onChange={e => handleUpdateSlide(selectedSlideIdx, 'overlayOpacity', Number(e.target.value))}
                      style={{ cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '10.5px', color: '#64748B' }}>Slide down to 0% for pure clear photo, or up to 100% for solid backdrop.</span>
                  </div>

                  <div className="wl-form-group">
                    <label className="wl-lbl">Overlay Tint</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="color"
                        value={activeSlide.overlayColor || '#FFFFFF'}
                        onChange={e => handleUpdateSlide(selectedSlideIdx, 'overlayColor', e.target.value)}
                        style={{ width: '34px', height: '34px', borderRadius: '6px', border: '1px solid #CBD5E1', cursor: 'pointer', padding: 0 }}
                      />
                      <input
                        type="text"
                        className="wl-inp"
                        style={{ flex: 1, padding: '7px 8px', fontSize: '11px' }}
                        value={activeSlide.overlayColor || '#FFFFFF'}
                        onChange={e => handleUpdateSlide(selectedSlideIdx, 'overlayColor', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: CUTOUT & LAYOUT */}
            {editorSubTab === 'cutout' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A' }}>Front Cutout Asset & Dimensions</span>

                {/* Cutout Asset */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label className="wl-lbl">Front Asset Cutout (Scooter / Mascot / Rider PNG)</label>
                  <div className="slider-asset-drop" onClick={e => e.stopPropagation()}>
                    {activeSlide.front ? (
                      <img
                        src={normalizeImageUrl(activeSlide.front)}
                        alt="Front cutout preview"
                        className="slider-asset-thumb"
                        style={{ objectFit: 'contain' }}
                        onError={(e: any) => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <div style={{ width: '68px', height: '46px', borderRadius: '6px', background: '#F1F5F9', border: '1px solid #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9.5px', color: '#64748B', fontWeight: 600 }}>
                        Default EV
                      </div>
                    )}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <label style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: 700, color: '#4F46E5' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="17 8 12 3 7 8"/>
                            <line x1="12" y1="3" x2="12" y2="15"/>
                          </svg>
                          <span>{uploadingField === `${selectedSlideIdx}-front` ? 'Uploading...' : 'Upload Cutout PNG'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={e => handleUploadSliderFile(selectedSlideIdx, 'front', e)}
                          />
                        </label>
                        {activeSlide.front ? (
                          <button
                            type="button"
                            onClick={() => handleRemoveSliderFile(selectedSlideIdx, 'front')}
                            style={{ fontSize: '11px', color: '#EF4444', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', padding: '1px 6px' }}
                            title="Clear cutout"
                          >
                            Clear
                          </button>
                        ) : null}
                      </div>
                      <input
                        type="text"
                        className="wl-inp"
                        style={{ fontSize: '11.5px', padding: '6px 10px' }}
                        placeholder="or paste image URL"
                        value={activeSlide.front || ''}
                        onChange={e => handleUpdateSlide(selectedSlideIdx, 'front', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Cutout Dimensions (Width, Height, Scale, X/Y) */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="wl-form-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label className="wl-lbl">Cutout Width (Length)</label>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#6366F1' }}>{activeSlide.cutoutWidth || 270}px</span>
                    </div>
                    <input
                      type="range"
                      min="120"
                      max="380"
                      value={activeSlide.cutoutWidth || 270}
                      onChange={e => handleUpdateSlide(selectedSlideIdx, 'cutoutWidth', Number(e.target.value))}
                      style={{ cursor: 'pointer' }}
                    />
                  </div>

                  <div className="wl-form-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label className="wl-lbl">Cutout Height</label>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#6366F1' }}>{activeSlide.cutoutHeight || 240}px</span>
                    </div>
                    <input
                      type="range"
                      min="120"
                      max="360"
                      value={activeSlide.cutoutHeight || 240}
                      onChange={e => handleUpdateSlide(selectedSlideIdx, 'cutoutHeight', Number(e.target.value))}
                      style={{ cursor: 'pointer' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  <div className="wl-form-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label className="wl-lbl">Scale</label>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#6366F1' }}>{activeSlide.cutoutScale || 1.0}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="1.8"
                      step="0.05"
                      value={activeSlide.cutoutScale !== undefined ? activeSlide.cutoutScale : 1.0}
                      onChange={e => handleUpdateSlide(selectedSlideIdx, 'cutoutScale', Number(e.target.value))}
                      style={{ cursor: 'pointer' }}
                    />
                  </div>

                  <div className="wl-form-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label className="wl-lbl">Position X (Right)</label>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#6366F1' }}>{activeSlide.cutoutRight ?? 0}px</span>
                    </div>
                    <input
                      type="range"
                      min="-40"
                      max="80"
                      value={activeSlide.cutoutRight ?? 0}
                      onChange={e => handleUpdateSlide(selectedSlideIdx, 'cutoutRight', Number(e.target.value))}
                      style={{ cursor: 'pointer' }}
                    />
                  </div>

                  <div className="wl-form-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label className="wl-lbl">Position Y (Bottom)</label>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#6366F1' }}>{activeSlide.cutoutBottom ?? 4}px</span>
                    </div>
                    <input
                      type="range"
                      min="-20"
                      max="60"
                      value={activeSlide.cutoutBottom ?? 4}
                      onChange={e => handleUpdateSlide(selectedSlideIdx, 'cutoutBottom', Number(e.target.value))}
                      style={{ cursor: 'pointer' }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Column 3: 100% Identical Mobile Preview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="wl-panel" style={{ borderRadius: '16px', position: 'sticky', top: '20px' }}>
            <div className="wl-panel-hdr" style={{ padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>Mobile Preview</span>
              </div>
              <span className="badge-pill badge-active" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
                Live Preview
              </span>
            </div>

            <div className="wl-panel-body" style={{ alignItems: 'center', background: '#F8FAFC', padding: '14px 12px' }}>
              {/* Phone Selector Dropdown Bar */}
              <div style={{ width: '100%', maxWidth: '320px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <select className="wl-inp" style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '8px', background: '#FFFFFF', fontWeight: 600 }}>
                  <option>iPhone 15 (390 x 844)</option>
                  <option>Pixel 8 (412 x 892)</option>
                  <option>Galaxy S24 (384 x 824)</option>
                </select>

                <div style={{ display: 'flex', gap: '4px' }}>
                  <button type="button" style={{ border: '1px solid #CBD5E1', background: '#FFF', borderRadius: '6px', padding: '4px 6px', cursor: 'pointer' }} title="Rotate">
                    📱
                  </button>
                  <button type="button" style={{ border: '1px solid #CBD5E1', background: '#FFF', borderRadius: '6px', padding: '4px 6px', cursor: 'pointer' }} title="Expand">
                    ⛶
                  </button>
                </div>
              </div>

              {/* Exact Mobile App Phone Frame */}
              <div className="phone-mock-frame" style={{ width: '315px', height: '610px', borderRadius: '42px', border: '10px solid #1E293B', background: '#FFFFFF' }}>
                {/* Dynamic Island */}
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '90px',
                  height: '24px',
                  borderRadius: '16px',
                  background: '#000000',
                  zIndex: 40
                }} />

                <div className="phone-mock-screen" style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#FAFAFD', position: 'relative', overflowY: 'auto' }}>
                  {/* Status Bar */}
                  <div style={{ height: '36px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '0 20px 4px', fontSize: '10px', fontWeight: 800, color: '#0F172A', zIndex: 30 }}>
                    <span>9:41</span>
                    <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                      <svg width="12" height="10" viewBox="0 0 16 12" fill="#0F172A">
                        <rect x="0" y="8" width="2.5" height="4" rx="0.5"/>
                        <rect x="4" y="6" width="2.5" height="6" rx="0.5"/>
                        <rect x="8" y="3" width="2.5" height="9" rx="0.5"/>
                        <rect x="12" y="0" width="2.5" height="12" rx="0.5"/>
                      </svg>
                      <svg width="12" height="10" viewBox="0 0 16 12" fill="#0F172A">
                        <path d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
                        <path d="M4.5 5.5a5 5 0 017 0" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                        <path d="M2 3a8.5 8.5 0 0112 0" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                      </svg>
                      <svg width="16" height="9" viewBox="0 0 22 12" fill="none" stroke="#0F172A" strokeWidth="1.5">
                        <rect x="1" y="1" width="17" height="10" rx="2.5"/>
                        <rect x="3" y="3" width="11" height="6" rx="1" fill="#0F172A"/>
                        <path d="M19 4v4" strokeLinecap="round"/>
                      </svg>
                    </div>
                  </div>

                  {/* App Screen Header */}
                  {sliderScreen === 'rent' ? (
                    <div style={{ padding: '6px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 25 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '26px', height: '26px', borderRadius: '13px', background: 'rgba(255,255,255,0.95)', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800, color: '#0F172A' }}>
                          ‹
                        </div>
                        <div>
                          <div style={{ fontSize: '12px', fontWeight: 900, color: '#0F172A' }}>Rent EV</div>
                          <div style={{ fontSize: '8px', color: '#64748B' }}>Vadodara Knowledge City</div>
                        </div>
                      </div>
                      <span style={{ fontSize: '8px', fontWeight: 800, background: 'rgba(99,102,241,0.08)', color: '#6366F1', padding: '2px 6px', borderRadius: '10px', border: '1px solid rgba(99,102,241,0.2)' }}>
                        ● Active Zone
                      </span>
                    </div>
                  ) : (
                    <div style={{ padding: '6px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 25 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.9)', padding: '3px 8px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="#6366F1">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                        </svg>
                        <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#0F172A' }}>Gotri, Vadodara ⌄</span>
                      </div>
                      <div style={{ width: '24px', height: '24px', borderRadius: '12px', background: 'rgba(255,255,255,0.9)', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="2">
                          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                        </svg>
                      </div>
                    </div>
                  )}

                  {/* HERO SLIDER CONTAINER (Exact Aspect Ratio) */}
                  <div className="phone-hero-slider" style={{ height: '280px', position: 'relative', overflow: 'hidden' }}>
                    {/* Background Image */}
                    {activeSlide.bg ? (
                      <img
                        src={normalizeImageUrl(activeSlide.bg)}
                        alt="Slide BG"
                        className="phone-slide-bg"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }}
                      />
                    ) : (
                      <div
                        className="phone-slide-bg"
                        style={{
                          width: '100%',
                          height: '100%',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          background: sliderScreen === 'rent'
                            ? 'radial-gradient(circle at 80% 20%, #EDE9FE 0%, #E0E7FF 40%, #F1F5F9 100%)'
                            : 'radial-gradient(circle at 80% 20%, #CCFBF1 0%, #E0E7FF 40%, #F8FAFC 100%)'
                        }}
                      />
                    )}

                    {/* Dynamic Overlay Gradient with Adjustable Opacity */}
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: `linear-gradient(to right, ${activeSlide.overlayColor || '#FFFFFF'}, transparent)`,
                        opacity: (activeSlide.overlayOpacity !== undefined ? Number(activeSlide.overlayOpacity) : 65) / 100,
                        pointerEvents: 'none',
                        zIndex: 2
                      }}
                    />

                    {/* Front Cutout Asset */}
                    {activeSlide.front ? (
                      <img
                        src={normalizeImageUrl(activeSlide.front)}
                        alt="Cutout"
                        style={{
                          position: 'absolute',
                          right: `${activeSlide.cutoutRight ?? 0}px`,
                          bottom: `${activeSlide.cutoutBottom ?? 4}px`,
                          width: `${(activeSlide.cutoutWidth || 270) * (activeSlide.cutoutScale || 1.0) * 0.7}px`,
                          height: `${(activeSlide.cutoutHeight || 240) * (activeSlide.cutoutScale || 1.0) * 0.7}px`,
                          objectFit: 'contain',
                          zIndex: 3
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          position: 'absolute',
                          right: `${activeSlide.cutoutRight ?? 0}px`,
                          bottom: `${activeSlide.cutoutBottom ?? 4}px`,
                          width: `${180 * (activeSlide.cutoutScale || 1.0)}px`,
                          height: `${160 * (activeSlide.cutoutScale || 1.0)}px`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          zIndex: 3
                        }}
                      >
                        <svg width="100%" height="100%" viewBox="0 0 200 180" fill="none">
                          <circle cx="50" cy="140" r="28" fill="#1E1B4B" stroke="#6C38FF" strokeWidth="5"/>
                          <circle cx="50" cy="140" r="14" fill="#E2E8F0"/>
                          <circle cx="155" cy="140" r="28" fill="#1E1B4B" stroke="#6C38FF" strokeWidth="5"/>
                          <circle cx="155" cy="140" r="14" fill="#E2E8F0"/>
                          <path d="M45 130 Q70 120 100 125 L145 130" stroke="#0F172A" strokeWidth="11" strokeLinecap="round"/>
                          <path d="M75 125 L95 85 L140 100 L145 130 Z" fill="#6C38FF"/>
                          <path d="M60 85 Q90 80 115 85" stroke="#1E1B4B" strokeWidth="9" strokeLinecap="round"/>
                          <path d="M135 125 L160 50" stroke="#0F172A" strokeWidth="7" strokeLinecap="round"/>
                          <path d="M148 48 L170 48" stroke="#1E1B4B" strokeWidth="5" strokeLinecap="round"/>
                          <circle cx="168" cy="52" r="5" fill="#00D26A"/>
                        </svg>
                      </div>
                    )}

                    {/* Left Typography & CTA: Rendered ONLY if text/button enabled */}
                    {hasTextInPreview ? (
                      <div
                        style={{
                          position: 'relative',
                          zIndex: 4,
                          padding: '16px 14px',
                          maxWidth: '65%',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px'
                        }}
                      >
                        {/* Badge */}
                        {showBadge && (
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '2px 8px',
                              borderRadius: '12px',
                              background: activeSlide.badgeBg || '#6366F1',
                              color: activeSlide.badgeTextColor || '#FFFFFF',
                              fontSize: '8.5px',
                              fontWeight: 800,
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                              width: 'fit-content'
                            }}
                          >
                            {currentTag}
                          </span>
                        )}

                        {/* Title */}
                        {showTitle && (
                          <h3
                            style={{
                              margin: 0,
                              fontSize: `${Math.round((activeSlide.titleFontSize || 26) * 0.72)}px`,
                              color: activeSlide.titleColor || '#1E1B4B',
                              lineHeight: 1.15,
                              whiteSpace: 'pre-line',
                              ...fontFamStyle
                            }}
                          >
                            {currentTitle}
                          </h3>
                        )}

                        {/* Subtitle */}
                        {showSubtitle && (
                          <p
                            style={{
                              margin: 0,
                              fontSize: `${Math.round((activeSlide.subFontSize || 12) * 0.75)}px`,
                              color: activeSlide.subColor || '#475569',
                              lineHeight: 1.3,
                              fontWeight: 500
                            }}
                          >
                            {currentSub}
                          </p>
                        )}

                        {/* CTA Button */}
                        {showCta && (
                          <div
                            style={{
                              marginTop: '4px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '5px 12px',
                              borderRadius: '20px',
                              background: activeSlide.ctaBg || '#2A195C',
                              color: activeSlide.ctaTextColor || '#FFFFFF',
                              fontSize: '9.5px',
                              fontWeight: 800,
                              width: 'fit-content',
                              boxShadow: '0 2px 6px rgba(0,0,0,0.18)'
                            }}
                          >
                            <span>{currentCta}</span>
                            <span>➔</span>
                          </div>
                        )}
                      </div>
                    ) : null}

                    {/* Pagination Dots */}
                    <div style={{ position: 'absolute', bottom: '8px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '5px', zIndex: 10 }}>
                      {currentSliderList.map((_: any, dIdx: number) => (
                        <span
                          key={dIdx}
                          style={{
                            width: selectedSlideIdx === dIdx ? '16px' : '5px',
                            height: '5px',
                            borderRadius: '3px',
                            background: selectedSlideIdx === dIdx ? '#6366F1' : 'rgba(0,0,0,0.2)',
                            transition: 'all 0.2s'
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Body Content below slider (Exact Mobile Screen Replica) */}
                  {sliderScreen === 'rent' ? (
                    <div style={{ flex: 1, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {/* Operational hours notice */}
                      <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '5px 8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#10B981', flexShrink: 0 }} />
                        <span style={{ fontSize: '8px', fontWeight: 700, color: '#334155' }}>Operational: 06:00 AM – 11:00 PM (Daily)</span>
                      </div>

                      {/* Rental Schedule Card */}
                      <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <span style={{ fontSize: '8.5px', fontWeight: 800, color: '#0F172A' }}>Select Rental Schedule</span>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                          <div style={{ background: '#F8FAFC', borderRadius: '6px', padding: '5px', border: '1px solid #F1F5F9' }}>
                            <div style={{ fontSize: '6.5px', color: '#64748B', fontWeight: 800 }}>PICKUP</div>
                            <div style={{ fontSize: '8px', fontWeight: 800, color: '#0F172A' }}>Today, 10:00 AM</div>
                          </div>
                          <div style={{ background: '#F8FAFC', borderRadius: '6px', padding: '5px', border: '1px solid #F1F5F9' }}>
                            <div style={{ fontSize: '6.5px', color: '#64748B', fontWeight: 800 }}>DROPOFF</div>
                            <div style={{ fontSize: '8px', fontWeight: 800, color: '#0F172A' }}>Tomorrow, 10:00 AM</div>
                          </div>
                        </div>
                      </div>

                      {/* Action button */}
                      <div style={{ background: '#6366F1', color: '#FFFFFF', borderRadius: '10px', padding: '9px', textAlign: 'center', fontSize: '10px', fontWeight: 800, marginTop: '2px', boxShadow: '0 3px 8px rgba(99,102,241,0.25)' }}>
                        Search Available EVs ➔
                      </div>
                    </div>
                  ) : (
                    <div style={{ flex: 1, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {/* HomeScreen Zone Card */}
                      <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '9px' }}>📍</span>
                          <span style={{ fontSize: '9px', fontWeight: 800, color: '#0F172A' }}>Gotri Zone, Vadodara</span>
                        </div>
                        <div style={{ background: '#F8FAFC', borderRadius: '6px', padding: '5px 8px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', fontSize: '7.5px', color: '#64748B' }}>
                          <span>Ride Start: Nov 8, 05:04 PM</span>
                          <span>Ride End: Nov 9, 05:04 PM</span>
                        </div>
                        <div style={{ background: '#EDE9FE', color: '#6366F1', borderRadius: '8px', padding: '6px', textAlign: 'center', fontSize: '9px', fontWeight: 800 }}>
                          Rent Your EV ➔
                        </div>
                      </div>

                      {/* Fleet List Header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px' }}>
                        <span style={{ fontSize: '8.5px', fontWeight: 800, color: '#0F172A' }}>Choose your <strong>EV Ride</strong></span>
                        <span style={{ fontSize: '7.5px', color: '#6366F1', fontWeight: 700 }}>View All ›</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
})()}`


            {activeTab === 'email' && (
              <div className="wl-layout">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  
                  {/* SMTP Server Configuration */}
                  <div className="wl-panel">
                    <div className="wl-panel-hdr">
                      <span className="wl-panel-tit">SMTP Server Setup</span>
                    </div>
                    <div className="wl-panel-body">
                      <div className="wl-form-row">
                        <div className="wl-form-group">
                          <label className="wl-lbl">SMTP Server <span>*</span></label>
                          <input type="text" className="wl-inp" value={smtpServer} onChange={e => setSmtpServer(e.target.value)} />
                        </div>
                        <div className="wl-form-group">
                          <label className="wl-lbl">SMTP Port <span>*</span></label>
                          <input type="text" className="wl-inp" value={smtpPort} onChange={e => setSmtpPort(e.target.value)} />
                        </div>
                      </div>
                      <div className="wl-form-row">
                        <div className="wl-form-group">
                          <label className="wl-lbl">Username <span>*</span></label>
                          <input type="text" className="wl-inp" value={smtpUser} onChange={e => setSmtpUser(e.target.value)} />
                        </div>
                        <div className="wl-form-group">
                          <label className="wl-lbl">Password <span>*</span></label>
                          <input type="password" className="wl-inp" defaultValue="••••••••" />
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <button className="wl-btn" onClick={() => alert('Sending test email...')}>Send Test Email</button>
                        <button className="wl-btn wl-btn-primary" onClick={() => alert('SMTP settings saved!')}>Save SMTP</button>
                      </div>
                    </div>
                  </div>

                  {/* Email Templates */}
                  <div className="wl-panel">
                    <div className="wl-panel-hdr">
                      <span className="wl-panel-tit">Custom Email Templates</span>
                    </div>
                    <div className="wl-panel-body">
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {[
                          { name: 'Welcome Email Template', trigger: 'Trigger: On Rider Onboarding' },
                          { name: 'Swap Invoice Receipt Template', trigger: 'Trigger: On Battery Swap' },
                          { name: 'Password Reset Verification', trigger: 'Trigger: On Forgot Password' },
                          { name: 'Monthly Bill Summary Template', trigger: 'Trigger: Monthly Cycles' }
                        ].map((tpl, i) => (
                          <div className="logo-upload-row" key={i}>
                            <div>
                              <strong>{tpl.name}</strong>
                              <div style={{ fontSize: '10px', color: '#64748B', marginTop: '2px' }}>{tpl.trigger}</div>
                            </div>
                            <button className="wl-btn" style={{ padding: '6px 12px' }} onClick={() => alert(`Opening template editor for: ${tpl.name}`)}>Edit Template ✏</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="wl-panel">
                    <div className="wl-panel-hdr">
                      <span className="wl-panel-tit">Notification Channels</span>
                    </div>
                    <div className="wl-panel-body">
                      {[
                        { label: 'Email Notifications', checked: true },
                        { label: 'SMS Gateway Alerts', checked: true },
                        { label: 'WhatsApp Receipts Integration', checked: false },
                        { label: 'Firebase Push Notifications', checked: true }
                      ].map((item, idx) => (
                        <div className="wl-switch-wrap" key={idx}>
                          <span className="wl-switch-lbl">{item.label}</span>
                          <label style={{ display: 'flex' }}>
                            <input type="checkbox" className="switch-inp" defaultChecked={item.checked} />
                            <span className="switch-slider" />
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'invoice' && (
              <div className="wl-layout">
                {/* Left Invoice config */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  
                  <div className="wl-panel">
                    <div className="wl-panel-hdr">
                      <span className="wl-panel-tit">Invoice & Receipt Customization</span>
                    </div>
                    <div className="wl-panel-body">
                      <div className="wl-form-group">
                        <label className="wl-lbl">Invoice Title <span>*</span></label>
                        <input type="text" className="wl-inp" value={invoiceTitle} onChange={e => setInvoiceTitle(e.target.value)} />
                      </div>
                      <div className="wl-form-row">
                        <div className="wl-form-group">
                          <label className="wl-lbl">Invoice Prefix <span>*</span></label>
                          <input type="text" className="wl-inp" value={invoicePrefix} onChange={e => setInvoicePrefix(e.target.value)} />
                        </div>
                        <div className="wl-form-group">
                          <label className="wl-lbl">GST Number <span>*</span></label>
                          <input type="text" className="wl-inp" value={gstNo} onChange={e => setGstNo(e.target.value)} />
                        </div>
                      </div>
                      <div className="wl-form-row">
                        <div className="wl-form-group">
                          <label className="wl-lbl">PAN Number <span>*</span></label>
                          <input type="text" className="wl-inp" value={panNo} onChange={e => setPanNo(e.target.value)} />
                        </div>
                      </div>
                      <div className="wl-form-group">
                        <label className="wl-lbl">Company Billing Address <span>*</span></label>
                        <input type="text" className="wl-inp" value={invoiceAddress} onChange={e => setInvoiceAddress(e.target.value)} />
                      </div>
                      <div className="wl-form-group">
                        <label className="wl-lbl">Footer Declaration / Policy Text</label>
                        <textarea className="wl-inp" style={{ height: '60px', resize: 'none' }} value={invoiceFooter} onChange={e => setInvoiceFooter(e.target.value)} />
                      </div>
                    </div>
                  </div>

                  <div className="wl-panel">
                    <div className="wl-panel-hdr">
                      <span className="wl-panel-tit">Document Templates</span>
                    </div>
                    <div className="wl-panel-body" style={{ gridTemplateColumns: 'repeat(3, 1fr)', display: 'grid', gap: '12px' }}>
                      {[
                        { label: 'Tax Invoice', active: true },
                        { label: 'Customer Receipt', active: true },
                        { label: 'Quotation / Estimate', active: false }
                      ].map(doc => (
                        <div key={doc.label} style={{ padding: '12px', border: '1.5px solid #E2E8F0', borderRadius: '8px', background: '#F8FAFC', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 'bold' }}>{doc.label}</span>
                          <span style={{ fontSize: '9px', color: doc.active ? '#10B981' : '#64748B', fontWeight: '700' }}>{doc.active ? 'Template Active' : 'Inactive'}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Right Column Invoice Live PDF Preview */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="wl-panel">
                    <div className="wl-panel-hdr">
                      <span className="wl-panel-tit">Live Template Preview</span>
                      <button className="wl-btn wl-btn-primary" style={{ padding: '4px 10px', fontSize: '11px' }} onClick={handleDownloadPDF}>
                        Generate PDF
                      </button>
                    </div>
                    <div className="wl-panel-body">
                      
                      <div className="prev-tabs">
                        <button className={`prev-tab ${activeInvoiceTab === 'invoice' ? 'act' : ''}`} onClick={() => setActiveInvoiceTab('invoice')}>Tax Invoice</button>
                        <button className={`prev-tab ${activeInvoiceTab === 'receipt' ? 'act' : ''}`} onClick={() => setActiveInvoiceTab('receipt')}>Swap Receipt</button>
                      </div>

                      {/* Invoice paper design */}
                      <div className="invoice-paper">
                        <div className="invoice-hdr">
                          <div>
                            <span className="invoice-tit">{activeInvoiceTab === 'receipt' ? 'Rider Receipt' : invoiceTitle}</span>
                            <span style={{ display: 'block', fontSize: '9px', color: '#64748B', fontWeight: 'bold', marginTop: '2px' }}>
                              {activeInvoiceTab === 'receipt' ? 'RCPT' : invoicePrefix}-2024-000123
                            </span>
                          </div>
                          <div style={{ textAlign: 'right', fontSize: '9px' }}>
                            <strong>{companyName}</strong><br/>
                            GSTIN: {gstNo}
                          </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9.5px', borderBottom: '1px dashed #E2E8F0', paddingBottom: '8px' }}>
                          <div>
                            <strong>Bill To:</strong><br/>
                            Rahul Sharma<br/>
                            Delhi - 110001
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            Date: 20 Jun 2024
                          </div>
                        </div>

                        {/* Invoice Table */}
                        <table className="invoice-table">
                          <thead>
                            <tr>
                              <th>Description</th>
                              <th style={{ textAlign: 'center' }}>Qty</th>
                              <th style={{ textAlign: 'right' }}>Rate (₹)</th>
                              <th style={{ textAlign: 'right' }}>Total (₹)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {activeInvoiceTab === 'receipt' ? (
                              <>
                                <tr>
                                  <td>Battery Swap Service Fee (60V 45Ah Pack)</td>
                                  <td style={{ textAlign: 'center' }}>1</td>
                                  <td style={{ textAlign: 'right' }}>250.00</td>
                                  <td style={{ textAlign: 'right' }}>250.00</td>
                                </tr>
                                <tr>
                                  <td>Rider Wallet Top-up Accent</td>
                                  <td style={{ textAlign: 'center' }}>1</td>
                                  <td style={{ textAlign: 'right' }}>1,000.00</td>
                                  <td style={{ textAlign: 'right' }}>1,000.00</td>
                                </tr>
                              </>
                            ) : (
                              <>
                                <tr>
                                  <td>EV Battery Pack 60V 45Ah</td>
                                  <td style={{ textAlign: 'center' }}>1</td>
                                  <td style={{ textAlign: 'right' }}>25,000.00</td>
                                  <td style={{ textAlign: 'right' }}>25,000.00</td>
                                </tr>
                                <tr>
                                  <td>Battery Charger 60V 10A</td>
                                  <td style={{ textAlign: 'center' }}>1</td>
                                  <td style={{ textAlign: 'right' }}>2,500.00</td>
                                  <td style={{ textAlign: 'right' }}>2,500.00</td>
                                </tr>
                              </>
                            )}
                          </tbody>
                        </table>

                        <div className="invoice-sum">
                          <table className="invoice-sum-table">
                            <tr>
                              <td>Sub Total:</td>
                              <td style={{ textAlign: 'right', fontWeight: 'bold' }}>₹{activeInvoiceTab === 'receipt' ? '1,250.00' : '27,500.00'}</td>
                            </tr>
                            <tr>
                              <td>CGST (9%):</td>
                              <td style={{ textAlign: 'right' }}>₹{activeInvoiceTab === 'receipt' ? '112.50' : '2,475.00'}</td>
                            </tr>
                            <tr>
                              <td>SGST (9%):</td>
                              <td style={{ textAlign: 'right' }}>₹{activeInvoiceTab === 'receipt' ? '112.50' : '2,475.00'}</td>
                            </tr>
                            <tr style={{ borderTop: '1px solid #000', fontWeight: 'bold' }}>
                              <td style={{ paddingTop: '6px' }}>Total Payable:</td>
                              <td style={{ textAlign: 'right', paddingTop: '6px', color: primaryColor }}>₹{activeInvoiceTab === 'receipt' ? '1,475.00' : '32,450.00'}</td>
                            </tr>
                          </table>
                        </div>

                      </div>

                    </div>
                  </div>
                </div>

              </div>
            )}

            {activeTab === 'advanced' && (
              <div className="wl-layout">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  
                  {/* Code Injection */}
                  <div className="wl-panel">
                    <div className="wl-panel-hdr">
                      <span className="wl-panel-tit">Custom Code Injection (CSS/JS)</span>
                    </div>
                    <div className="wl-panel-body">
                      <div className="wl-form-group">
                        <label className="wl-lbl">Head Custom CSS</label>
                        <textarea 
                          className="wl-inp" 
                          style={{ height: '80px', fontFamily: 'monospace', fontSize: '12px' }} 
                          placeholder="/* Add style overrides here */"
                          value={customCSS}
                          onChange={e => setCustomCSS(e.target.value)}
                        />
                      </div>
                      <div className="wl-form-group">
                        <label className="wl-lbl">Body Script Inject (Analytics / Trackers)</label>
                        <textarea 
                          className="wl-inp" 
                          style={{ height: '80px', fontFamily: 'monospace', fontSize: '12px' }} 
                          placeholder="<script> // Analytics tools </script>"
                          value={customJS}
                          onChange={e => setCustomJS(e.target.value)}
                        />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button className="wl-btn wl-btn-primary" onClick={() => alert('Custom injection scripts saved!')}>Save Scripts</button>
                      </div>
                    </div>
                  </div>

                  {/* System Settings */}
                  <div className="wl-panel">
                    <div className="wl-panel-hdr">
                      <span className="wl-panel-tit">System Maintenance Operations</span>
                    </div>
                    <div className="wl-panel-body" style={{ gap: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <strong style={{ fontSize: '12.5px', color: '#1E293B', display: 'block' }}>Maintenance Mode</strong>
                          <span style={{ fontSize: '11px', color: '#64748B' }}>Enable this to show a maintenance page to all users.</span>
                        </div>
                        <label style={{ display: 'flex' }}>
                          <input type="checkbox" className="switch-inp" />
                          <span className="switch-slider" />
                        </label>
                      </div>
                      <div style={{ display: 'flex', gap: '10px', borderTop: '1px solid #F1F5F9', paddingTop: '16px' }}>
                        <button className="wl-btn" style={{ flex: 1, borderColor: '#EF4444', color: '#EF4444' }} onClick={() => alert('Purged application cache!')}>Purge Cache</button>
                        <button className="wl-btn" style={{ flex: 1 }} onClick={() => alert('Database export started...')}>Export Database Backups</button>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* General bottom notification banner */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11.5px', color: '#475569', background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '10px 14px', borderRadius: '8px' }}>
              <span>ℹ</span>
              <span>Changes will be applied to the platform after publishing.</span>
            </div>

          </div>

        </div>
      </div>
    </>
  );
}
