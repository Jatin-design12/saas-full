const fs = require('fs');
const file = 'C:/Users/Himanshu/Documents/Evegah/saas-full/frontend/src/app/settings/white-label/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Remove Phone Selector Dropdown Bar
const topBarRegex = /\{\/\*\s*Phone Selector Dropdown Bar\s*\*\/\}[\s\S]*?(?=\{\/\*\s*Exact Mobile App Phone Frame\s*\*\/)/;
if (topBarRegex.test(content)) {
  content = content.replace(topBarRegex, '');
  console.log('Removed top bar successfully');
} else {
  console.error('Phone selector dropdown bar not found');
}

// 2. Add Button Position (X & Y) after Corner Radius in Tab 1
const cornerRadiusPattern = `min="0"
                          max="30"
                          value={activeSlide.ctaRadius !== undefined ? activeSlide.ctaRadius : 20}
                          onChange={e => handleUpdateSlide(selectedSlideIdx, 'ctaRadius', Number(e.target.value))}
                          style={{ cursor: 'pointer' }}
                        />
                      </div>
                    </div>
                  </div>
                )}`;

const cornerRadiusPatternCRLF = cornerRadiusPattern.replace(/\n/g, '\r\n');

const buttonOffsetsSnippet = `                      {/* Button Only Position (X & Y Offsets) */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', paddingTop: '10px', borderTop: '1px dashed #E2E8F0' }}>
                        <div className="wl-form-group">
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label className="wl-lbl">Button Offset X (Left/Right)</label>
                            <span style={{ fontSize: '11px', fontWeight: 700, color: '#6366F1' }}>{activeSlide.ctaOffsetX ?? 0}px</span>
                          </div>
                          <input
                            type="range"
                            min="-60"
                            max="120"
                            value={activeSlide.ctaOffsetX ?? 0}
                            onChange={e => handleUpdateSlide(selectedSlideIdx, 'ctaOffsetX', Number(e.target.value))}
                            style={{ cursor: 'pointer' }}
                          />
                        </div>

                        <div className="wl-form-group">
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label className="wl-lbl">Button Offset Y (Up/Down)</label>
                            <span style={{ fontSize: '11px', fontWeight: 700, color: '#6366F1' }}>{activeSlide.ctaOffsetY ?? 0}px</span>
                          </div>
                          <input
                            type="range"
                            min="-60"
                            max="80"
                            value={activeSlide.ctaOffsetY ?? 0}
                            onChange={e => handleUpdateSlide(selectedSlideIdx, 'ctaOffsetY', Number(e.target.value))}
                            style={{ cursor: 'pointer' }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Content Block Position & Depth Effect in Tab 1 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '14px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#0F172A' }}>Content Block Position (Text & Button Together)</span>
                    <span style={{ fontSize: '11px', color: '#64748B' }}>Move entire block</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div className="wl-form-group">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <label className="wl-lbl">Horizontal Offset (X)</label>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#6366F1' }}>{activeSlide.textOffsetX !== undefined ? activeSlide.textOffsetX : 14}px</span>
                      </div>
                      <input
                        type="range"
                        min="-40"
                        max="100"
                        value={activeSlide.textOffsetX !== undefined ? activeSlide.textOffsetX : 14}
                        onChange={e => handleUpdateSlide(selectedSlideIdx, 'textOffsetX', Number(e.target.value))}
                        style={{ cursor: 'pointer' }}
                      />
                    </div>

                    <div className="wl-form-group">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <label className="wl-lbl">Vertical Offset (Y)</label>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#6366F1' }}>{activeSlide.textOffsetY !== undefined ? activeSlide.textOffsetY : 18}px</span>
                      </div>
                      <input
                        type="range"
                        min="-30"
                        max="140"
                        value={activeSlide.textOffsetY !== undefined ? activeSlide.textOffsetY : 18}
                        onChange={e => handleUpdateSlide(selectedSlideIdx, 'textOffsetY', Number(e.target.value))}
                        style={{ cursor: 'pointer' }}
                      />
                    </div>
                  </div>

                  <div className="wl-form-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label className="wl-lbl">Full-Line Title Width Stretch</label>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#6366F1' }}>{activeSlide.textWidthPercent || 94}%</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="100"
                      value={activeSlide.textWidthPercent || 94}
                      onChange={e => handleUpdateSlide(selectedSlideIdx, 'textWidthPercent', Number(e.target.value))}
                      style={{ cursor: 'pointer' }}
                    />
                  </div>
                </div>

                {/* iPhone Depth Effect Toggle Card */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  background: activeSlide.depthEffect ? '#EEF2FF' : '#FFFFFF',
                  border: \`1.5px solid \${activeSlide.depthEffect ? '#6366F1' : '#E2E8F0'}\`,
                  borderRadius: '12px',
                  boxShadow: activeSlide.depthEffect ? '0 2px 8px rgba(99, 102, 241, 0.12)' : 'none',
                  transition: 'all 0.15s ease'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: activeSlide.depthEffect ? '#6366F1' : '#F1F5F9',
                      color: activeSlide.depthEffect ? '#FFFFFF' : '#64748B',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '15px'
                    }}>
                      📱
                    </div>
                    <div>
                      <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#0F172A' }}>
                        iPhone Depth Effect (Text Behind Cutout)
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>
                        Places vehicle cutout in front of the headline text like the iOS lock screen
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleUpdateSlide(selectedSlideIdx, 'depthEffect', !activeSlide.depthEffect)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '20px',
                      border: 'none',
                      background: activeSlide.depthEffect ? '#6366F1' : '#CBD5E1',
                      color: '#FFFFFF',
                      fontSize: '11.5px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    {activeSlide.depthEffect ? 'Active ✓' : 'Disabled'}
                  </button>
                </div>`;

const targetCorner = content.includes(cornerRadiusPatternCRLF) ? cornerRadiusPatternCRLF : cornerRadiusPattern;
if (content.includes(targetCorner)) {
  const repl = content.includes(cornerRadiusPatternCRLF) ? buttonOffsetsSnippet.replace(/\n/g, '\r\n') : buttonOffsetsSnippet;
  content = content.replace(targetCorner, repl);
  console.log('Added button & content block offsets in Tab 1');
} else {
  console.error('Corner radius target not found in Tab 1');
}

// 3. Add iPhone Depth Effect in Tab 4 (Cutout & Layout) as well
const tab4End = `value={activeSlide.cutoutBottom ?? 4}
                      onChange={e => handleUpdateSlide(selectedSlideIdx, 'cutoutBottom', Number(e.target.value))}
                      style={{ cursor: 'pointer' }}
                    />
                  </div>
                </div>
              </div>
            )}`;

const tab4EndCRLF = tab4End.replace(/\n/g, '\r\n');

const tab4DepthCard = `value={activeSlide.cutoutBottom ?? 4}
                      onChange={e => handleUpdateSlide(selectedSlideIdx, 'cutoutBottom', Number(e.target.value))}
                      style={{ cursor: 'pointer' }}
                    />
                  </div>
                </div>

                {/* iPhone Depth Effect Toggle in Tab 4 */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  background: activeSlide.depthEffect ? '#EEF2FF' : '#F8FAFC',
                  border: \`1.5px solid \${activeSlide.depthEffect ? '#6366F1' : '#E2E8F0'}\`,
                  borderRadius: '12px',
                  transition: 'all 0.15s ease'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: activeSlide.depthEffect ? '#6366F1' : '#E2E8F0',
                      color: activeSlide.depthEffect ? '#FFFFFF' : '#64748B',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '15px'
                    }}>
                      📱
                    </div>
                    <div>
                      <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#0F172A' }}>
                        iPhone Depth Effect (Text Behind Cutout)
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>
                        Vehicle cutout renders in front of headline text
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleUpdateSlide(selectedSlideIdx, 'depthEffect', !activeSlide.depthEffect)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '20px',
                      border: 'none',
                      background: activeSlide.depthEffect ? '#6366F1' : '#CBD5E1',
                      color: '#FFFFFF',
                      fontSize: '11.5px',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    {activeSlide.depthEffect ? 'Active ✓' : 'Disabled'}
                  </button>
                </div>
              </div>
            )}`;

const targetTab4 = content.includes(tab4EndCRLF) ? tab4EndCRLF : tab4End;
if (content.includes(targetTab4)) {
  const replTab4 = content.includes(tab4EndCRLF) ? tab4DepthCard.replace(/\n/g, '\r\n') : tab4DepthCard;
  content = content.replace(targetTab4, replTab4);
  console.log('Added depth effect toggle to Tab 4');
} else {
  console.error('Tab 4 end target not found');
}

// 4. Update Cutout zIndex in Mobile Preview: zIndex: 3 -> zIndex: activeSlide.depthEffect ? 6 : 3
content = content.replace(
  'objectFit: \'contain\',\n                          zIndex: 3',
  'objectFit: \'contain\',\n                          zIndex: activeSlide.depthEffect ? 6 : 3'
);
content = content.replace(
  'objectFit: \'contain\',\r\n                          zIndex: 3',
  'objectFit: \'contain\',\r\n                          zIndex: activeSlide.depthEffect ? 6 : 3'
);

// 5. Update Typography block zIndex in Mobile Preview: zIndex: 4 -> zIndex: activeSlide.depthEffect ? 3 : 6
content = content.replace(
  'position: \'relative\',\n                          zIndex: 4,',
  'position: \'relative\',\n                          zIndex: activeSlide.depthEffect ? 3 : 6,'
);
content = content.replace(
  'position: \'relative\',\r\n                          zIndex: 4,',
  'position: \'relative\',\r\n                          zIndex: activeSlide.depthEffect ? 3 : 6,'
);

// 6. Update CTA Button in Mobile Preview to apply ctaOffsetX, ctaOffsetY and zIndex: 10
const oldPreviewCta = `borderRadius: \`\${activeSlide.ctaRadius !== undefined ? activeSlide.ctaRadius : 20}px\`,
                              background: activeSlide.ctaBg || '#2A195C',
                              color: activeSlide.ctaTextColor || '#FFFFFF',
                              fontSize: \`\${Math.round((activeSlide.ctaFontSize || 12) * 0.75)}px\`,
                              fontWeight: 800,
                              width: 'fit-content',
                              boxShadow: '0 2px 6px rgba(0,0,0,0.18)'`;

const oldPreviewCtaCRLF = oldPreviewCta.replace(/\n/g, '\r\n');

const newPreviewCta = `borderRadius: \`\${activeSlide.ctaRadius !== undefined ? activeSlide.ctaRadius : 20}px\`,
                              background: activeSlide.ctaBg || '#2A195C',
                              color: activeSlide.ctaTextColor || '#FFFFFF',
                              fontSize: \`\${Math.round((activeSlide.ctaFontSize || 12) * 0.75)}px\`,
                              fontWeight: 800,
                              width: 'fit-content',
                              boxShadow: '0 2px 6px rgba(0,0,0,0.18)',
                              transform: \`translate(\${activeSlide.ctaOffsetX || 0}px, \${activeSlide.ctaOffsetY || 0}px)\`,
                              zIndex: 10`;

const targetPreviewCta = content.includes(oldPreviewCtaCRLF) ? oldPreviewCtaCRLF : oldPreviewCta;
if (content.includes(targetPreviewCta)) {
  const replCta = content.includes(oldPreviewCtaCRLF) ? newPreviewCta.replace(/\n/g, '\r\n') : newPreviewCta;
  content = content.replace(targetPreviewCta, replCta);
  console.log('Updated CTA button offsets and zIndex in Mobile Preview');
} else {
  console.error('Preview CTA button target not found');
}

fs.writeFileSync(file, content, 'utf8');
console.log('white-label/page.tsx updated successfully');
