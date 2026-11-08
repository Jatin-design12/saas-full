'use client';

import React, { useState, useEffect, useRef } from 'react';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (imageDataUrl: string) => void;
  title?: string;
  subtitle?: string;
}

export default function CameraCaptureModal({
  isOpen,
  onClose,
  onCapture,
  title = 'Live Camera Capture',
  subtitle = 'Position the document or vehicle clearly inside the frame'
}: CameraCaptureModalProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [hasMultipleCameras, setHasMultipleCameras] = useState<boolean>(false);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [isFlashing, setIsFlashing] = useState<boolean>(false);

  // Stop camera tracks cleanly
  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (_) {}
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // Check available camera devices
  useEffect(() => {
    if (!isOpen) return;
    if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      navigator.mediaDevices.enumerateDevices()
        .then((devices) => {
          const videoDevices = devices.filter((d) => d.kind === 'videoinput');
          setHasMultipleCameras(videoDevices.length > 1);
        })
        .catch(() => {});
    }
  }, [isOpen]);

  // Start video stream whenever modal is open or facingMode changes
  useEffect(() => {
    if (!isOpen) {
      stopStream();
      setCapturedImage(null);
      setCameraError(null);
      return;
    }

    let isCancelled = false;
    setIsInitializing(true);
    setCameraError(null);
    setCapturedImage(null);

    const startCamera = async () => {
      stopStream();

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('Camera API is not supported in this browser environment. Please use manual upload.');
        setIsInitializing(false);
        return;
      }

      try {
        const constraints: MediaStreamConstraints = {
          audio: false,
          video: {
            facingMode: { ideal: facingMode },
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          }
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (isCancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
        setIsInitializing(false);
      } catch (err: any) {
        console.error('Camera access error:', err);
        // Fallback: try without facingMode constraints
        try {
          const fallbackStream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: true
          });
          if (isCancelled) {
            fallbackStream.getTracks().forEach((t) => t.stop());
            return;
          }
          streamRef.current = fallbackStream;
          if (videoRef.current) {
            videoRef.current.srcObject = fallbackStream;
            await videoRef.current.play().catch(() => {});
          }
          setIsInitializing(false);
        } catch (fallbackErr: any) {
          if (!isCancelled) {
            const msg = fallbackErr.name === 'NotAllowedError' || fallbackErr.name === 'PermissionDeniedError'
              ? 'Camera permission denied. Please allow camera access in your browser settings.'
              : fallbackErr.name === 'NotFoundError' || fallbackErr.name === 'DevicesNotFoundError'
              ? 'No camera found on this device. Please connect a webcam or use file upload.'
              : `Unable to access camera: ${fallbackErr.message || 'Unknown error'}`;
            setCameraError(msg);
            setIsInitializing(false);
          }
        }
      }
    };

    startCamera();

    return () => {
      isCancelled = true;
      stopStream();
    };
  }, [isOpen, facingMode]);

  // Flip front/back camera
  const handleToggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Capture snapshot from video element
  const handleSnap = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    // Trigger visual shutter flash
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 200);

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Mirror image if front camera is active
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    setCapturedImage(dataUrl);

    // Pause video to save resources
    try {
      video.pause();
    } catch (_) {}
  };

  // Retake photo
  const handleRetake = () => {
    setCapturedImage(null);
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  // Accept and use photo
  const handleConfirm = () => {
    if (capturedImage) {
      stopStream();
      onCapture(capturedImage);
      onClose();
    }
  };

  // Fallback file picker if camera is blocked
  const handleFallbackFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const res = reader.result as string;
        stopStream();
        onCapture(res);
        onClose();
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'rgba(15, 23, 42, 0.78)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          stopStream();
          onClose();
        }
      }}
    >
      <div
        style={{
          background: '#0F172A',
          color: '#FFFFFF',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '680px',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}
      >
        {/* Shutter Flash Animation */}
        {isFlashing && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: '#FFFFFF',
              zIndex: 100,
              pointerEvents: 'none',
              animation: 'flashFade 0.2s ease-out forwards'
            }}
          />
        )}

        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(30, 41, 59, 0.6)'
          }}
        >
          <div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: capturedImage ? '#10B981' : '#EF4444' }} />
              {title}
            </div>
            <div style={{ fontSize: '11.5px', color: '#94A3B8', marginTop: '2px' }}>
              {subtitle}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {hasMultipleCameras && !capturedImage && (
              <button
                type="button"
                onClick={handleToggleFacingMode}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#FFFFFF',
                  padding: '6px 12px',
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s'
                }}
                title="Switch Camera (Front/Rear)"
              >
                🔄 Flip Cam
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                stopStream();
                onClose();
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                color: '#94A3B8',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 700,
                transition: 'all 0.15s'
              }}
              title="Close Camera"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Viewfinder Area */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '380px',
            background: '#020617',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}
        >
          {cameraError ? (
            <div style={{ padding: '28px', textAlign: 'center', maxWidth: '440px' }}>
              <div style={{ fontSize: '38px', marginBottom: '12px' }}>📷</div>
              <div style={{ fontSize: '14.5px', fontWeight: 700, color: '#F87171', marginBottom: '8px' }}>
                Camera Not Accessible
              </div>
              <div style={{ fontSize: '12.5px', color: '#94A3B8', lineHeight: 1.5, marginBottom: '20px' }}>
                {cameraError}
              </div>
              <label
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  background: '#6366F1',
                  color: '#FFFFFF',
                  borderRadius: '12px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                📁 Choose File From Computer Instead
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFallbackFile}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          ) : isInitializing ? (
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
              />

              {/* Viewfinder Target Framing Guides */}
              <div
                style={{
                  position: 'absolute',
                  inset: '28px',
                  border: '2px dashed rgba(255, 255, 255, 0.4)',
                  borderRadius: '16px',
                  pointerEvents: 'none',
                  boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.28)'
                }}
              >
                {/* 4 Corner Markers */}
                <div style={{ position: 'absolute', top: -3, left: -3, width: 22, height: 22, borderTop: '4px solid #6366F1', borderLeft: '4px solid #6366F1', borderTopLeftRadius: 10 }} />
                <div style={{ position: 'absolute', top: -3, right: -3, width: 22, height: 22, borderTop: '4px solid #6366F1', borderRight: '4px solid #6366F1', borderTopRightRadius: 10 }} />
                <div style={{ position: 'absolute', bottom: -3, left: -3, width: 22, height: 22, borderBottom: '4px solid #6366F1', borderLeft: '4px solid #6366F1', borderBottomLeftRadius: 10 }} />
                <div style={{ position: 'absolute', bottom: -3, right: -3, width: 22, height: 22, borderBottom: '4px solid #6366F1', borderRight: '4px solid #6366F1', borderBottomRightRadius: 10 }} />

                <div
                  style={{
                    position: 'absolute',
                    bottom: '12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(0,0,0,0.6)',
                    backdropFilter: 'blur(4px)',
                    color: '#E2E8F0',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: 600,
                    letterSpacing: '0.02em',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Align document or subject inside frame
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Controls */}
        <div
          style={{
            padding: '16px 24px',
            background: 'rgba(15, 23, 42, 0.95)',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          {capturedImage ? (
            <>
              <button
                type="button"
                onClick={handleRetake}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#FFFFFF',
                  padding: '10px 18px',
                  borderRadius: '12px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                🔄 Retake Photo
              </button>

              <button
                type="button"
                onClick={handleConfirm}
                style={{
                  background: 'linear-gradient(135deg, #10B981, #059669)',
                  border: 'none',
                  color: '#FFFFFF',
                  padding: '10px 24px',
                  borderRadius: '12px',
                  fontSize: '13.5px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                ✓ Use This Photo
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => {
                  stopStream();
                  onClose();
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94A3B8',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: '8px 12px'
                }}
              >
                Cancel
              </button>

              {/* Big Shutter Button */}
              <button
                type="button"
                disabled={isInitializing || !!cameraError}
                onClick={handleSnap}
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: isInitializing || !!cameraError ? '#475569' : '#FFFFFF',
                  border: '4px solid #6366F1',
                  boxShadow: '0 0 0 4px rgba(99, 102, 241, 0.3)',
                  cursor: isInitializing || !!cameraError ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'transform 0.1s, box-shadow 0.15s',
                  position: 'relative'
                }}
                title="Capture Photo"
              >
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    background: isInitializing || !!cameraError ? '#64748B' : '#6366F1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                </div>
              </button>

              <div style={{ width: '60px' }} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
