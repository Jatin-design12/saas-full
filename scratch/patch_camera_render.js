const fs = require('fs');
const filePath = 'C:/Users/Himanshu/Documents/Evegah/saas-full/frontend/src/components/CameraCaptureModal.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Replace startCamera constraints
const oldConstraints = `        const constraints: MediaStreamConstraints = {
          audio: false,
          video: {
            facingMode: { ideal: facingMode },
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          }
        };`;

const newConstraints = `        const constraints: MediaStreamConstraints = {
          audio: false,
          video: {
            facingMode: facingMode === 'environment' ? { ideal: 'environment' } : 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        };`;

const oldVideoSection = `          ) : isInitializing ? (
            <div style={{ textAlign: 'center', color: '#94A3B8' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  border: '3px solid rgba(255,255,255,0.15)',
                  borderTopColor: '#6366F1',
                  borderRadius: '50%',
                  margin: '0 auto 12px',
                  animation: 'spin 0.8s linear infinite'
                }}
              />
              <div style={{ fontSize: '13px', fontWeight: 600 }}>Activating camera feed...</div>
            </div>
          ) : capturedImage ? (
            <div style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000000' }}>
              <img
                src={capturedImage}
                alt="Captured Snapshot"
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain'
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  background: 'rgba(16, 185, 129, 0.9)',
                  color: '#FFFFFF',
                  padding: '4px 10px',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                ✓ Snapshot Ready
              </div>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transform: facingMode === 'user' ? 'scaleX(-1)' : 'none'
                }}
              />`;

const newVideoSection = `          ) : capturedImage ? (
            <div style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000000' }}>
              <img
                src={capturedImage}
                alt="Captured Snapshot"
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain'
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  background: 'rgba(16, 185, 129, 0.9)',
                  color: '#FFFFFF',
                  padding: '4px 10px',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                ✓ Snapshot Ready
              </div>
            </div>
          ) : (
            <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
              {isInitializing && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 20,
                    background: '#020617',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#94A3B8'
                  }}
                >
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      border: '3px solid rgba(255,255,255,0.15)',
                      borderTopColor: '#6366F1',
                      borderRadius: '50%',
                      margin: '0 auto 12px',
                      animation: 'spin 0.8s linear infinite'
                    }}
                  />
                  <div style={{ fontSize: '13px', fontWeight: 600 }}>Activating camera feed...</div>
                </div>
              )}

              <video
                ref={(el) => {
                  videoRef.current = el;
                  if (el && streamRef.current && el.srcObject !== streamRef.current) {
                    el.srcObject = streamRef.current;
                    el.play().catch(() => {});
                  }
                }}
                autoPlay
                playsInline
                muted
                onLoadedMetadata={() => {
                  setIsInitializing(false);
                  videoRef.current?.play().catch(() => {});
                }}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transform: facingMode === 'user' ? 'scaleX(-1)' : 'none'
                }}
              />`;

const oldEnd = `                  Align document or subject inside frame
                </div>
              </div>
            </>
          )}`;

const newEnd = `                  Align document or subject inside frame
                </div>
              </div>
            </div>
          )}`;

const normalize = s => s.replace(/\r\n/g, '\n');
content = normalize(content);

if (content.includes(normalize(oldConstraints))) {
  content = content.replace(normalize(oldConstraints), normalize(newConstraints));
}
if (content.includes(normalize(oldVideoSection))) {
  content = content.replace(normalize(oldVideoSection), normalize(newVideoSection));
}
if (content.includes(normalize(oldEnd))) {
  content = content.replace(normalize(oldEnd), normalize(newEnd));
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully patched CameraCaptureModal.tsx video rendering');
