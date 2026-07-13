"use client";
import { useState, useEffect, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import Link from 'next/link';
import { api } from '@/lib/api';

// Helper component for SearchParams inside a Suspense boundary
function PricingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('id');

  const [dbZones, setDbZones] = useState<any[]>([]);

  useEffect(() => {
    api.get('/zones')
      .then(res => {
        if (res && res.data) {
          setDbZones(res.data);
          if (editId) {
            const zone = res.data.find((z: any) => String(z.id) === String(editId));
            if (zone) {
              setSelectedZoneName(zone.name);
              setStatus(zone.status === 'active' ? 'Active' : 'Inactive');
              if (zone.pricing && zone.pricing.pricingModel) {
                setPricingModel(zone.pricing.pricingModel);
                setNotes(zone.pricing.notes || '');
                if (zone.pricing.pricingModel === 'Hourly Based') {
                  setHourlyRows(zone.pricing.hourlyPricing || []);
                } else {
                  setPackages(zone.pricing.packages || []);
                }
              }
            }
          } else if (res.data.length > 0) {
            setSelectedZoneName(res.data[0].name);
          }
        }
      })
      .catch(err => console.error(err));
  }, [editId]);

  const ZONES_LIST = useMemo(() => {
    return dbZones.map(z => ({
      id: String(z.id),
      name: z.name,
      city: z.city || 'N/A'
    }));
  }, [dbZones]);

  const VEHICLE_MODELS = useMemo(() => [
    { name: 'Evegah MINK', image: '/assets/mink.png' },
    { name: 'Evegah CITY', image: '/assets/city.png' },
    { name: 'Evegah Fly', image: '/Fly.png' },
    { name: 'Evegah Pro', image: '/Evegah Pro.png' }
  ], []);

  // Core Page States
  const [selectedZoneName, setSelectedZoneName] = useState('');
  const [status, setStatus] = useState('Active');
  const [pricingModel, setPricingModel] = useState<'Hourly Based' | 'Package Based'>('Hourly Based');
  const [notes, setNotes] = useState('');

  // Hourly Pricing Rows State
  const [hourlyRows, setHourlyRows] = useState<any[]>([]);

  // Package Pricing State
  const [packages, setPackages] = useState<any[]>([]);
  const [isAddingPackage, setIsAddingPackage] = useState(false);
  const [newPkgName, setNewPkgName] = useState('');
  const [newPkgDuration, setNewPkgDuration] = useState('');
  const [newPkgPrice, setNewPkgPrice] = useState('');
  const [newPkgModel, setNewPkgModel] = useState('Evegah MINK');
  const [pkgType, setPkgType] = useState('Daily');

  // Hourly inline form states
  const [isAddingHourly, setIsAddingHourly] = useState(false);
  const [newHourlyModel, setNewHourlyModel] = useState('Evegah MINK');
  const [newHourlyBasePrice, setNewHourlyBasePrice] = useState('');
  const [newHourlyExtraPrice, setNewHourlyExtraPrice] = useState('');
  const [newHourlyGracePeriod, setNewHourlyGracePeriod] = useState('0');
  const [newHourlyRoundingRule, setNewRoundingRule] = useState('Per 15 Minutes');
  const [newHourlyDeposit, setNewHourlyDeposit] = useState('');

  // Package inline form states
  const [newPkgDeposit, setNewPkgDeposit] = useState('');

  const handleAddHourlyRow = () => {
    if (!newHourlyBasePrice || !newHourlyExtraPrice) {
      alert('Please fill out all required fields for the hourly rate.');
      return;
    }
    const matched = VEHICLE_MODELS.find(m => m.name === newHourlyModel);
    const newRow = {
      id: Date.now(),
      model: newHourlyModel,
      basePrice: newHourlyBasePrice,
      extraPrice: newHourlyExtraPrice,
      gracePeriod: newHourlyGracePeriod || '0',
      roundingRule: newHourlyRoundingRule,
      deposit: newHourlyDeposit || '0',
      status: true,
      imgSrc: matched ? matched.image : '/assets/city.png'
    };
    setHourlyRows(prev => [...prev, newRow]);
    setNewHourlyBasePrice('');
    setNewHourlyExtraPrice('');
    setNewHourlyGracePeriod('0');
    setNewHourlyDeposit('');
    setIsAddingHourly(false);
  };

  // Find corresponding city
  const selectedCity = useMemo(() => {
    const zone = ZONES_LIST.find(z => z.name === selectedZoneName);
    return zone ? zone.city : '';
  }, [selectedZoneName, ZONES_LIST]);



  // Handler for saving configuration
  const handleSave = async () => {
    const zone = dbZones.find(z => z.name === selectedZoneName);
    if (!zone) {
      alert("Selected zone not found in database.");
      return;
    }

    const pricingObj: any = {
      pricingModel,
      notes
    };

    if (pricingModel === 'Hourly Based') {
      pricingObj.basePrice = parseFloat(hourlyRows[0]?.basePrice) || 0;
      pricingObj.extraPrice = parseFloat(hourlyRows[0]?.extraPrice) || 0;
      pricingObj.packageDetails = [];
      pricingObj.hourlyPricing = hourlyRows;
      pricingObj.packages = [];
    } else {
      pricingObj.basePrice = null;
      pricingObj.extraPrice = null;
      pricingObj.packageDetails = packages.map(p => `${p.model}: ${p.duration} Days - ₹${p.price}${p.deposit ? ` (Deposit: ₹${p.deposit})` : ''}`);
      pricingObj.hourlyPricing = [];
      pricingObj.packages = packages;
    }

    const payload = {
      ...zone,
      status: status.toLowerCase(),
      pricing: pricingObj
    };

    try {
      const res = await api.put(`/zones/${zone.id}`, payload);
      if (res && res.status === 'success') {
        alert('Zone pricing configured successfully!');
        router.push('/zones/pricing');
      } else {
        alert('Failed to configure pricing: ' + (res.message || 'Unknown error'));
      }
    } catch (err: any) {
      console.error(err);
      alert('Failed to save pricing configuration: ' + (err.message || err));
    }
  };

  // Hourly Rows updates
  const handleHourlyRowChange = (id: number, field: string, value: any) => {
    setHourlyRows(prev => prev.map(row => {
      if (row.id === id) {
        if (field === 'model') {
          const matched = VEHICLE_MODELS.find(m => m.name === value);
          return { ...row, model: value, imgSrc: matched ? matched.image : '/assets/city.png' };
        }
        return { ...row, [field]: value };
      }
      return row;
    }));
  };

  const handleHourlyDelete = (id: number) => {
    setHourlyRows(prev => prev.filter(row => row.id !== id));
  };

  // Package Management
  const handleAddPackage = () => {
    let nameToUse = newPkgName;
    let durationToUse = newPkgDuration;
    if (pkgType === 'Daily') {
      nameToUse = 'Daily';
      durationToUse = '1';
    } else if (pkgType === 'Weekly') {
      nameToUse = 'Weekly';
      durationToUse = '7';
    } else if (pkgType === 'Monthly') {
      nameToUse = 'Monthly';
      durationToUse = '30';
    }

    if (!nameToUse || !durationToUse || !newPkgPrice) {
      alert('Please fill out all fields for the package.');
      return;
    }
    const newPkg = {
      id: Date.now(),
      model: newPkgModel || hourlyRows[0]?.model || 'All Models',
      name: nameToUse,
      duration: parseInt(durationToUse),
      price: parseFloat(newPkgPrice),
      deposit: parseFloat(newPkgDeposit) || 0
    };
    setPackages(prev => [...prev, newPkg]);
    setNewPkgName('Daily');
    setNewPkgDuration('1');
    setPkgType('Daily');
    setNewPkgPrice('');
    setNewPkgDeposit('');
    setIsAddingPackage(false);
  };

  const handlePackageDelete = (id: number) => {
    setPackages(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="zp-page">
      {/* Breadcrumb back */}
      <div className="zp-bc">
        <Link href="/zones/pricing" className="zp-bc-back">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '6px' }}>
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Zone Pricing
        </Link>
      </div>

      {/* Header */}
      <div className="zp-title-row">
        <div>
          <h1 className="zp-h1">Add / Edit Zone Pricing</h1>
          <p className="zp-sub">Configure pricing model and rates for the selected zone.</p>
        </div>
      </div>

      {/* Form Content */}
      <div className="zp-form-layout">
        
        {/* Row 1: Zone Info & Pricing Model Selection */}
        <div className="zp-info-grid">
          {/* Card 1: Zone Information */}
          <div className="zp-card">
            <h2 className="zp-card-title">Zone Information</h2>
            <div className="zp-card-body">
              <div className="zp-form-row">
                <div className="zp-form-group">
                  <label className="zp-form-label">Zone Name</label>
                  <select 
                    className="zp-form-select"
                    value={selectedZoneName}
                    onChange={(e) => setSelectedZoneName(e.target.value)}
                    disabled={!!editId}
                  >
                    {ZONES_LIST.map((zone, idx) => (
                      <option key={idx} value={zone.name}>{zone.name}</option>
                    ))}
                  </select>
                </div>
                <div className="zp-form-group">
                  <label className="zp-form-label">City</label>
                  <input 
                    type="text" 
                    className="zp-form-input" 
                    value={selectedCity}
                    disabled
                  />
                </div>
              </div>

              <div className="zp-form-group" style={{ marginTop: '16px' }}>
                <label className="zp-form-label">Status</label>
                <select 
                  className="zp-form-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Card 2: Pricing Model */}
          <div className="zp-card">
            <h2 className="zp-card-title">Pricing Model</h2>
            <div className="zp-card-body">
              <p className="zp-card-subtitle">Choose how you want to price this zone.</p>
              
              <div className="zp-radio-cards-grid">
                {/* Radio Card 1: Hourly Based */}
                <div 
                  className={`zp-radio-card ${pricingModel === 'Hourly Based' ? 'active' : ''}`}
                  onClick={() => setPricingModel('Hourly Based')}
                >
                  <div className="zp-radio-header">
                    <span className="zp-radio-circle"></span>
                    <span className="zp-radio-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                    </span>
                  </div>
                  <h3 className="zp-radio-title">Hourly Based</h3>
                  <p className="zp-radio-desc">Customers will be charged based on hourly usage with extra time charges.</p>
                </div>

                {/* Radio Card 2: Package Based */}
                <div 
                  className={`zp-radio-card ${pricingModel === 'Package Based' ? 'active' : ''}`}
                  onClick={() => setPricingModel('Package Based')}
                >
                  <div className="zp-radio-header">
                    <span className="zp-radio-circle"></span>
                    <span className="zp-radio-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                        <line x1="12" y1="22.08" x2="12" y2="12" />
                      </svg>
                    </span>
                  </div>
                  <h3 className="zp-radio-title">Package Based</h3>
                  <p className="zp-radio-desc">Customers will be charged based on selected packages.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Dynamic Pricing Card depending on Selected Model */}
        {pricingModel === 'Hourly Based' ? (
          /* Card 3: Hourly Pricing Card */
          <div className="zp-card" style={{ marginTop: '24px' }}>
            <div className="zp-card-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 className="zp-card-title" style={{ margin: 0, borderBottom: 'none', paddingBottom: 0 }}>Hourly Pricing (For Selected Models)</h2>
                <span className="zp-badge zp-badge-hourly">Selected</span>
              </div>
              <button 
                className="zp-btn-add-pkg"
                onClick={() => setIsAddingHourly(true)}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add Hourly Rate
              </button>
            </div>
            
            <div className="zp-card-body" style={{ marginTop: '16px' }}>
              <p className="zp-card-subtitle" style={{ marginTop: 0, marginBottom: '16px' }}>Set dynamic pricing for each model</p>
              
              {isAddingHourly && (
                <div className="zp-pkg-form-box">
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '13.5px', color: '#1E293B', fontWeight: 700 }}>New Hourly Rate Details</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1.2fr auto', gap: '12px', alignItems: 'end' }}>
                    <div className="zp-form-group">
                      <label className="zp-form-label">Model</label>
                      <select 
                        className="zp-form-select"
                        value={newHourlyModel}
                        onChange={(e) => setNewHourlyModel(e.target.value)}
                      >
                        {VEHICLE_MODELS.map((vm, idx) => (
                          <option key={idx} value={vm.name}>{vm.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="zp-form-group">
                      <label className="zp-form-label">Base Price (Per Hour)</label>
                      <input 
                        type="number" 
                        className="zp-form-input" 
                        placeholder="e.g. 80"
                        value={newHourlyBasePrice}
                        onChange={(e) => setNewHourlyBasePrice(e.target.value)}
                      />
                    </div>
                    <div className="zp-form-group">
                      <label className="zp-form-label">Extra Price (Per 15 Min)</label>
                      <input 
                        type="number" 
                        className="zp-form-input" 
                        placeholder="e.g. 10"
                        value={newHourlyExtraPrice}
                        onChange={(e) => setNewHourlyExtraPrice(e.target.value)}
                      />
                    </div>
                    <div className="zp-form-group">
                      <label className="zp-form-label">Grace Period (Mins)</label>
                      <input 
                        type="number" 
                        className="zp-form-input" 
                        placeholder="e.g. 5"
                        value={newHourlyGracePeriod}
                        onChange={(e) => setNewHourlyGracePeriod(e.target.value)}
                      />
                    </div>
                    <div className="zp-form-group">
                      <label className="zp-form-label">Deposit (₹)</label>
                      <input 
                        type="number" 
                        className="zp-form-input" 
                        placeholder="e.g. 500"
                        value={newHourlyDeposit}
                        onChange={(e) => setNewHourlyDeposit(e.target.value)}
                      />
                    </div>
                    <div className="zp-form-group">
                      <label className="zp-form-label">Rounding Rule</label>
                      <select 
                        className="zp-form-select"
                        value={newHourlyRoundingRule}
                        onChange={(e) => setNewRoundingRule(e.target.value)}
                      >
                        <option value="Per 15 Minutes">Per 15 Minutes</option>
                        <option value="Per 30 Minutes">Per 30 Minutes</option>
                        <option value="Per Hour">Per Hour</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="zp-btn-primary" style={{ padding: '10px 14px' }} onClick={handleAddHourlyRow}>Add</button>
                      <button className="zp-btn-cancel-pkg" onClick={() => setIsAddingHourly(false)}>Cancel</button>
                    </div>
                  </div>
                </div>
              )}

              <div className="zp-table-container">
                <table className="zp-table">
                  <thead>
                    <tr>
                      <th style={{ width: '20%' }}>Model</th>
                      <th style={{ width: '15%' }}>Base Price (Per Hour)</th>
                      <th style={{ width: '15%' }}>Deposit (₹)</th>
                      <th style={{ width: '15%' }}>Extra Price (Per Extra 15 Min)</th>
                      <th style={{ width: '15%' }}>Grace Period (Minutes)</th>
                      <th style={{ width: '12%' }}>Rounding Rule</th>
                      <th style={{ width: '8%', textAlign: 'center' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hourlyRows.length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{ textAlign: 'center', padding: '24px', color: '#64748B' }}>
                          No hourly rates configured yet. Click "Add Hourly Rate" to add one.
                        </td>
                      </tr>
                    ) : (
                      hourlyRows.map((row) => (
                        <tr key={row.id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div className="zp-model-img-box">
                                <img src={row.imgSrc} alt={row.model || 'Scooter'} className="zp-model-img" />
                              </div>
                              <select 
                                className="zp-select-inline"
                                value={row.model}
                                onChange={(e) => handleHourlyRowChange(row.id, 'model', e.target.value)}
                                style={{ fontWeight: 700, width: '130px', padding: '4px' }}
                              >
                                {VEHICLE_MODELS.map((vm, idx) => (
                                  <option key={idx} value={vm.name}>{vm.name}</option>
                                ))}
                              </select>
                            </div>
                          </td>
                          <td>
                            <div className="zp-input-currency-wrap">
                              <span className="zp-currency-symbol">₹</span>
                              <input 
                                type="text" 
                                className="zp-input-inline" 
                                value={row.basePrice}
                                onChange={(e) => handleHourlyRowChange(row.id, 'basePrice', e.target.value)}
                              />
                            </div>
                          </td>
                          <td>
                            <div className="zp-input-currency-wrap">
                              <span className="zp-currency-symbol">₹</span>
                              <input 
                                type="text" 
                                className="zp-input-inline" 
                                value={row.deposit || ''}
                                onChange={(e) => handleHourlyRowChange(row.id, 'deposit', e.target.value)}
                              />
                            </div>
                          </td>
                          <td>
                            <div className="zp-input-currency-wrap">
                              <span className="zp-currency-symbol">₹</span>
                              <input 
                                type="text" 
                                className="zp-input-inline" 
                                value={row.extraPrice}
                                onChange={(e) => handleHourlyRowChange(row.id, 'extraPrice', e.target.value)}
                              />
                            </div>
                          </td>
                          <td>
                            <div className="zp-input-inline-wrap">
                              <input 
                                type="text" 
                                className="zp-input-inline" 
                                value={row.gracePeriod}
                                onChange={(e) => handleHourlyRowChange(row.id, 'gracePeriod', e.target.value)}
                              />
                              <div className="zp-input-helper">Free minutes before extra charges apply</div>
                            </div>
                          </td>
                          <td>
                            <select 
                              className="zp-select-inline"
                              value={row.roundingRule}
                              onChange={(e) => handleHourlyRowChange(row.id, 'roundingRule', e.target.value)}
                            >
                              <option value="Per 15 Minutes">Per 15 Minutes</option>
                              <option value="Per 30 Minutes">Per 30 Minutes</option>
                              <option value="Per Hour">Per Hour</option>
                            </select>
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                              <label className="zp-switch">
                                <input 
                                  type="checkbox" 
                                  checked={row.status}
                                  onChange={(e) => handleHourlyRowChange(row.id, 'status', e.target.checked)}
                                />
                                <span className="zp-slider" />
                              </label>
                              
                              <button 
                                className="zp-delete-row-btn"
                                onClick={() => handleHourlyDelete(row.id)}
                              >
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                  <polyline points="3 6 5 6 21 6" />
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          /* Card 4: Package Pricing Card */
          <div className="zp-card" style={{ marginTop: '24px' }}>
            <div className="zp-card-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 className="zp-card-title" style={{ margin: 0, borderBottom: 'none', paddingBottom: 0 }}>Package Pricing</h2>
                <span className="zp-badge zp-badge-package">Selected</span>
              </div>
              <button 
                className="zp-btn-add-pkg"
                onClick={() => {
                  setPkgType('Daily');
                  setNewPkgName('Daily');
                  setNewPkgDuration('1');
                  setIsAddingPackage(true);
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add Package
              </button>
            </div>

            <div className="zp-card-body" style={{ marginTop: '16px' }}>
              <p className="zp-card-subtitle" style={{ marginTop: 0, marginBottom: '16px' }}>Add packages for this zone.</p>

              {/* Inline Package Form */}
              {isAddingPackage && (
                <div className="zp-pkg-form-box">
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '13.5px', color: '#1E293B', fontWeight: 700 }}>New Package Details</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr 1.2fr 1.2fr 1fr 1fr auto', gap: '12px', alignItems: 'end' }}>
                    <div className="zp-form-group">
                      <label className="zp-form-label">Model</label>
                      <select 
                        className="zp-form-select"
                        value={newPkgModel}
                        onChange={(e) => setNewPkgModel(e.target.value)}
                      >
                        {VEHICLE_MODELS.map((vm, idx) => (
                          <option key={idx} value={vm.name}>{vm.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="zp-form-group">
                      <label className="zp-form-label">Package Type</label>
                      <select 
                        className="zp-form-select"
                        value={pkgType}
                        onChange={(e) => {
                          const val = e.target.value;
                          setPkgType(val);
                          if (val === 'Daily') {
                            setNewPkgName('Daily');
                            setNewPkgDuration('1');
                          } else if (val === 'Weekly') {
                            setNewPkgName('Weekly');
                            setNewPkgDuration('7');
                          } else if (val === 'Monthly') {
                            setNewPkgName('Monthly');
                            setNewPkgDuration('30');
                          } else {
                            setNewPkgName('');
                            setNewPkgDuration('');
                          }
                        }}
                      >
                        <option value="Daily">Daily</option>
                        <option value="Weekly">Weekly</option>
                        <option value="Monthly">Monthly</option>
                        <option value="Custom">Custom</option>
                      </select>
                    </div>
                    <div className="zp-form-group">
                      <label className="zp-form-label">Package Name</label>
                      <input 
                        type="text" 
                        className="zp-form-input" 
                        placeholder="e.g. Daily"
                        value={newPkgName}
                        onChange={(e) => setNewPkgName(e.target.value)}
                        disabled={pkgType !== 'Custom'}
                      />
                    </div>
                    <div className="zp-form-group">
                      <label className="zp-form-label">Duration (Days)</label>
                      <input 
                        type="number" 
                        className="zp-form-input" 
                        placeholder="e.g. 1"
                        value={newPkgDuration}
                        onChange={(e) => setNewPkgDuration(e.target.value)}
                        disabled={pkgType !== 'Custom'}
                      />
                    </div>
                    <div className="zp-form-group">
                      <label className="zp-form-label">Price (₹)</label>
                      <input 
                        type="number" 
                        className="zp-form-input" 
                        placeholder="e.g. 199"
                        value={newPkgPrice}
                        onChange={(e) => setNewPkgPrice(e.target.value)}
                      />
                    </div>
                    <div className="zp-form-group">
                      <label className="zp-form-label">Deposit (₹)</label>
                      <input 
                        type="number" 
                        className="zp-form-input" 
                        placeholder="e.g. 500"
                        value={newPkgDeposit}
                        onChange={(e) => setNewPkgDeposit(e.target.value)}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="zp-btn-primary" style={{ padding: '10px 14px' }} onClick={handleAddPackage}>Add</button>
                      <button className="zp-btn-cancel-pkg" onClick={() => setIsAddingPackage(false)}>Cancel</button>
                    </div>
                  </div>
                </div>
              )}

              <div className="zp-table-container">
                <table className="zp-table">
                  <thead>
                    <tr>
                      <th style={{ width: '20%' }}>Model</th>
                      <th style={{ width: '25%' }}>Package Name</th>
                      <th style={{ width: '15%' }}>Duration</th>
                      <th style={{ width: '15%' }}>Price (₹)</th>
                      <th style={{ width: '15%' }}>Deposit (₹)</th>
                      <th style={{ width: '10%', textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {packages.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: '48px 24px', color: '#64748B' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1.5">
                              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                              <line x1="12" y1="22.08" x2="12" y2="12" />
                            </svg>
                            <span style={{ fontWeight: 700, fontSize: '13.5px', color: '#475569', marginTop: '6px' }}>No packages added yet.</span>
                            <span style={{ fontSize: '12px', color: '#94A3B8' }}>Click "Add Package" to create a package.</span>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      packages.map((pkg) => (
                        <tr key={pkg.id}>
                          <td style={{ fontWeight: 700, color: '#2A195C' }}>{pkg.model || 'All Models'}</td>
                          <td style={{ fontWeight: 700 }}>{pkg.name}</td>
                          <td style={{ fontWeight: 600 }}>{pkg.duration} Days</td>
                          <td style={{ fontWeight: 700 }}>₹{pkg.price}</td>
                          <td style={{ fontWeight: 700 }}>₹{pkg.deposit || 0}</td>
                          <td style={{ textAlign: 'center' }}>
                            <button 
                              className="zp-delete-row-btn"
                              onClick={() => handlePackageDelete(pkg.id)}
                            >
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Row 3: Notes (Optional) */}
        <div className="zp-card" style={{ marginTop: '24px' }}>
          <h2 className="zp-card-title">Notes (Optional)</h2>
          <div className="zp-card-body">
            <textarea 
              className="zp-form-textarea"
              maxLength={200}
              placeholder="Add any notes for this pricing configuration..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <div className="zp-char-counter">{notes.length} / 200</div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="zp-footer-buttons">
          <button 
            className="zp-btn-secondary"
            onClick={() => router.push('/zones/pricing')}
          >
            Cancel
          </button>
          <button 
            className="zp-btn-primary" 
            style={{ padding: '10px 24px' }}
            onClick={handleSave}
          >
            Save Pricing
          </button>
        </div>
      </div>
    </div>
  );
}

// Shell component with Sidebar, TopBar and loaded state
export default function NewZonePricingPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .zp-shell { display: flex; min-height: 100vh; background: #F8F9FF; font-family: 'Inter', sans-serif; }
        .zp-main { margin-left: 230px; display: flex; flex-direction: column; min-height: 100vh; width: calc(100% - 230px); }
        .zp-page { flex: 1; padding: 24px; display: flex; flex-direction: column; gap: 20px; }

        /* Breadcrumb back */
        .zp-bc { display: flex; align-items: center; font-size: 13px; font-weight: 500; }
        .zp-bc-back { display: inline-flex; align-items: center; color: #8B5CF6; text-decoration: none; font-weight: 700; transition: color .15s; }
        .zp-bc-back:hover { color: #6D28D9; }

        /* Header title */
        .zp-title-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-top: -4px; }
        .zp-h1 { font-size: 24px; font-weight: 800; color: #0F172A; margin: 0 0 6px; letter-spacing: -0.02em; }
        .zp-sub { font-size: 13.5px; color: #64748B; margin: 0; font-weight: 500; }

        /* Form Layout */
        .zp-form-layout { display: flex; flex-direction: column; margin-top: 4px; }
        .zp-info-grid { display: grid; grid-template-columns: 1fr 1.3fr; gap: 24px; }

        /* Card styles */
        .zp-card { background: #fff; border: 1.5px solid #E5E7EB; border-radius: 12px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,.02); display: flex; flex-direction: column; }
        .zp-card-title { font-size: 14.5px; font-weight: 800; color: #0F172A; margin: 0 0 16px 0; border-bottom: 1.5px solid #F3F4F6; padding-bottom: 12px; }
        .zp-card-subtitle { font-size: 12.5px; color: #64748B; font-weight: 500; margin-top: -8px; margin-bottom: 16px; }

        /* Form elements */
        .zp-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .zp-form-group { display: flex; flex-direction: column; gap: 6px; }
        .zp-form-label { font-size: 12.5px; font-weight: 700; color: #475569; }
        .zp-form-select, .zp-form-input { padding: 9px 12px; border: 1.5px solid #E2E8F0; border-radius: 8px; font-size: 13px; font-weight: 500; color: #1E293B; outline: none; background: #fff; transition: all .15s; }
        .zp-form-select:focus, .zp-form-input:focus { border-color: #2a195c; }
        .zp-form-input:disabled { background: #F8FAFC; color: #64748B; cursor: not-allowed; }

        /* Radio Cards */
        .zp-radio-cards-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .zp-radio-card { border: 1.5px solid #E2E8F0; border-radius: 12px; padding: 16px; cursor: pointer; transition: all .15s; background: #fff; display: flex; flex-direction: column; gap: 8px; }
        .zp-radio-card:hover { border-color: #C7D2FE; }
        .zp-radio-card.active { border-color: #6366F1; background: #F5F7FF; }
        
        .zp-radio-header { display: flex; justify-content: space-between; align-items: center; }
        .zp-radio-circle { width: 16px; height: 16px; border-radius: 50%; border: 1.5px solid #94A3B8; display: flex; align-items: center; justify-content: center; }
        .zp-radio-card.active .zp-radio-circle { border-color: #6366F1; }
        .zp-radio-card.active .zp-radio-circle::after { content: ''; width: 8px; height: 8px; border-radius: 50%; background: #6366F1; display: block; }
        
        .zp-radio-icon { width: 34px; height: 34px; border-radius: 50%; background: #EEF2FF; color: #6366F1; display: flex; align-items: center; justify-content: center; }
        .zp-radio-card.active .zp-radio-icon { background: #E0E7FF; }
        
        .zp-radio-title { font-size: 13.5px; font-weight: 800; color: #0F172A; margin: 0; }
        .zp-radio-desc { font-size: 11px; color: #64748B; margin: 0; line-height: 1.4; font-weight: 500; }

        /* Badges */
        .zp-badge { display: inline-flex; align-items: center; padding: 3px 8px; border-radius: 6px; font-size: 10px; font-weight: 700; text-transform: uppercase; }
        .zp-badge-hourly { background: #DEF7EC; color: #03543F; }
        .zp-badge-package { background: #E1EFFE; color: #1E429F; }

        /* Table */
        .zp-table-container { background: #fff; border: 1.5px solid #E2E8F0; border-radius: 12px; overflow: hidden; }
        .zp-table { width: 100%; border-collapse: collapse; text-align: left; }
        .zp-table th { background: #FAFBFD; border-bottom: 1.5px solid #E2E8F0; padding: 12px 14px; font-size: 10px; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 0.05em; }
        .zp-table td { padding: 12px 14px; border-bottom: 1px solid #E2E8F0; font-size: 13px; color: #1E293B; vertical-align: middle; }
        .zp-table tr:last-child td { border-bottom: none; }
        
        /* Model icon box */
        .zp-model-img-box { width: 34px; height: 22px; border-radius: 4px; display: flex; align-items: center; justify-content: center; background: #F3F4F6; overflow: hidden; }
        .zp-model-img { max-height: 100%; max-width: 100%; object-fit: contain; }

        /* Inputs Inside Table */
        .zp-input-currency-wrap { display: flex; align-items: center; border: 1.5px solid #E2E8F0; border-radius: 8px; padding: 6px 10px; background: #fff; width: 90px; }
        .zp-input-currency-wrap:focus-within { border-color: #2a195c; }
        .zp-currency-symbol { font-size: 12.5px; font-weight: 700; color: #64748B; margin-right: 4px; }
        
        .zp-input-inline { border: none; outline: none; width: 100%; font-size: 12.5px; font-weight: 700; color: #1E293B; font-family: inherit; }
        .zp-input-inline-wrap { display: flex; flex-direction: column; width: 140px; }
        .zp-input-inline-wrap .zp-input-inline { border: 1.5px solid #E2E8F0; border-radius: 8px; padding: 6px 10px; }
        .zp-input-inline-wrap .zp-input-inline:focus { border-color: #2a195c; }
        .zp-input-helper { font-size: 9.5px; color: #94A3B8; font-weight: 500; margin-top: 3px; line-height: 1.2; }

        .zp-select-inline { padding: 6px 8px; border: 1.5px solid #E2E8F0; border-radius: 8px; font-size: 12px; font-weight: 600; color: #475569; background: #fff; cursor: pointer; outline: none; width: 120px; }
        .zp-select-inline:focus { border-color: #2a195c; }

        /* Switch toggle */
        .zp-switch { position: relative; display: inline-block; width: 34px; height: 18px; }
        .zp-switch input { opacity: 0; width: 0; height: 0; }
        .zp-slider { position: absolute; cursor: pointer; inset: 0; background-color: #E2E8F0; border-radius: 34px; transition: .15s; }
        .zp-slider:before { position: absolute; content: ""; height: 14px; width: 14px; left: 2px; bottom: 2px; background-color: white; border-radius: 50%; transition: .15s; }
        .zp-switch input:checked + .zp-slider { background-color: #6366F1; }
        .zp-switch input:checked + .zp-slider:before { transform: translateX(16px); }

        .zp-delete-row-btn { background: none; border: none; cursor: pointer; color: #EF4444; display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 4px; transition: background 0.15s; }
        .zp-delete-row-btn:hover { background: #FEF2F2; }

        /* Package styling */
        .zp-btn-add-pkg { display: inline-flex; align-items: center; gap: 6px; padding: 8px 12px; border: 1.5px solid #DDD6FE; background: #fff; color: #2A195C; border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer; transition: all 0.15s; }
        .zp-btn-add-pkg:hover { background: #FAF5FF; }
        
        .zp-pkg-form-box { background: #FAFBFD; border: 1.5px solid #E2E8F0; border-radius: 10px; padding: 14px; margin-bottom: 16px; }
        .zp-btn-cancel-pkg { padding: 9px 14px; background: #fff; border: 1.5px solid #E2E8F0; color: #475569; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; }
        .zp-btn-cancel-pkg:hover { background: #FAFBFD; }

        /* Notes textarea */
        .zp-form-textarea { width: 100%; height: 70px; padding: 10px 12px; border: 1.5px solid #E2E8F0; border-radius: 8px; font-size: 13px; outline: none; resize: none; font-family: inherit; color: #1E293B; font-weight: 500; }
        .zp-form-textarea:focus { border-color: #2a195c; }
        .zp-char-counter { text-align: right; font-size: 10.5px; color: #94A3B8; font-weight: 600; margin-top: 2px; }

        /* Footer buttons */
        .zp-footer-buttons { display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; padding-top: 16px; border-top: 1.5px solid #F3F4F6; }
        .zp-btn-secondary { padding: 10px 20px; background: #fff; border: 1.5px solid #E2E8F0; border-radius: 8px; font-size: 13px; font-weight: 700; color: #475569; cursor: pointer; transition: all 0.15s; }
        .zp-btn-secondary:hover { background: #FAFBFD; border-color: #94A3B8; }
        .zp-btn-primary { display: inline-flex; align-items: center; gap: 8px; padding: 10px 18px; background: #2a195c; color: #fff; border: 1.5px solid #2a195c; border-radius: 8px; font-size: 13px; font-weight: 700; cursor: pointer; transition: all .15s; }
        .zp-btn-primary:hover { background: #1e1145; border-color: #1e1145; }
      ` }} />
      <div className="zp-shell">
        <Sidebar activePath="/zones/pricing" />
        <div className="zp-main">
          <TopBar 
            title="Hello, Akash" 
            subtitle="Zone Admin" 
            notificationCount={3}
            showSearch={false}
            hideZone={false}
          />
          <Suspense fallback={<div className="zp-page">Loading...</div>}>
            <PricingForm />
          </Suspense>
        </div>
      </div>
    </>
  );
}
