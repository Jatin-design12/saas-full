const fs = require('fs');
const filePath = 'C:/Users/Himanshu/Documents/Evegah/saas-full/frontend/src/components/CameraCaptureModal.tsx';
let content = fs.readFileSync(filePath, 'utf8');

const targetHeader = `{hasMultipleCameras && !capturedImage && (`;
const newHeader = `{!capturedImage && !cameraError && (`;

const targetFooter = `<div style={{ width: '60px' }} />`;
const newFooter = `<button
                type="button"
                disabled={isInitializing || !!cameraError}
                onClick={handleToggleFacingMode}
                style={{
                  background: 'rgba(255, 255, 255, 0.12)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#FFFFFF',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: isInitializing || !!cameraError ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'background 0.15s'
                }}
                title="Switch Front/Rear Camera"
              >
                🔄 Flip Cam
              </button>`;

const normalize = s => s.replace(/\r\n/g, '\n');
content = normalize(content);

if (content.includes(normalize(targetHeader))) {
  content = content.replace(normalize(targetHeader), normalize(newHeader));
}
if (content.includes(normalize(targetFooter))) {
  content = content.replace(normalize(targetFooter), normalize(newFooter));
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully patched CameraCaptureModal.tsx');
