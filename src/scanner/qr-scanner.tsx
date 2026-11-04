import React, { useCallback, useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';
import { cn } from '../lib/utils';

export interface QRScannerProps {
  /** Called with the decoded QR value once a code is read. */
  onScan: (value: string) => void;
  /** Cancel/close affordance (top-left). The button is hidden when omitted. */
  onClose?: () => void;
  /** Instruction line shown near the bottom. */
  instruction?: string;
  /** Label for the top-left cancel button. Default "Cancel". */
  cancelLabel?: string;
  /** Label for the photo-capture fallback button. Default "Take a photo". */
  captureLabel?: string;
  /** Message shown when the camera cannot be opened. */
  errorText?: string;
  /** Optional extra classes for the root element. */
  className?: string;
}

// Drawable sources we decode from. Spelled out (rather than the DOM
// `CanvasImageSource` alias) so the lint config's global allow-list recognises
// each name.
type DrawSource = HTMLVideoElement | HTMLImageElement | HTMLCanvasElement;

// Structural shape of the live camera stream — avoids naming the `MediaStream`
// global, which the lint config's allow-list does not include. The real object
// returned by getUserMedia satisfies this.
interface MediaStreamLike {
  getTracks: () => { stop: () => void }[];
}

// `BarcodeDetector` is still not in the DOM lib typings, so describe the slice
// of the API we use. We feature-detect before touching it.
interface BarcodeDetectorLike {
  detect: (source: DrawSource) => Promise<{ rawValue: string }[]>;
}
interface BarcodeDetectorCtor {
  new (options?: { formats?: string[] }): BarcodeDetectorLike;
  getSupportedFormats?: () => Promise<string[]>;
}

/**
 * Full-screen web QR scanner. Opens the rear camera via `getUserMedia` and
 * decodes frames continuously (preferring the native `BarcodeDetector`, falling
 * back to jsQR). When the camera is unavailable or denied, it falls back to a
 * `<input type="file" accept="image/*" capture="environment">` so the browser's
 * own camera/photo picker supplies a still to decode. Either path calls
 * `onScan(value)` with the decoded string.
 */
export function QRScanner({
  onScan,
  onClose,
  instruction,
  cancelLabel = 'Cancel',
  captureLabel = 'Take a photo',
  errorText = 'Unable to open the camera. Take a photo instead.',
  className,
}: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStreamLike | null>(null);
  const rafRef = useRef<number | null>(null);
  const detectorRef = useRef<BarcodeDetectorLike | null>(null);
  const scannedRef = useRef(false);
  const [cameraFailed, setCameraFailed] = useState(false);

  // Fire onScan at most once per mount so a value isn't delivered on every frame.
  const emit = useCallback(
    (value: string) => {
      if (scannedRef.current) return;
      scannedRef.current = true;
      onScan(value);
    },
    [onScan]
  );

  const stopCamera = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;
  }, []);

  // Decode a drawable source (the live <video> or a loaded <img>). Returns the
  // decoded value, or null when nothing is found.
  const decodeFromCanvas = useCallback(
    async (
      source: DrawSource,
      width: number,
      height: number
    ): Promise<string | null> => {
      if (!width || !height) return null;

      if (detectorRef.current) {
        try {
          const codes = await detectorRef.current.detect(source);
          if (codes[0]?.rawValue) return codes[0].rawValue;
          return null;
        } catch {
          // Fall through to jsQR on a detector error.
        }
      }

      const canvas = canvasRef.current ?? document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return null;
      ctx.drawImage(source, 0, 0, width, height);
      const { data } = ctx.getImageData(0, 0, width, height);
      const result = jsQR(data, width, height);
      return result?.data ?? null;
    },
    []
  );

  // Continuous scan loop over the live camera frames.
  const scanFrame = useCallback(() => {
    const video = videoRef.current;
    if (!video || scannedRef.current) return;
    if (video.readyState >= video.HAVE_ENOUGH_DATA) {
      void decodeFromCanvas(video, video.videoWidth, video.videoHeight).then(
        value => {
          if (value) {
            emit(value);
            stopCamera();
          }
        }
      );
    }
    rafRef.current = requestAnimationFrame(scanFrame);
  }, [decodeFromCanvas, emit, stopCamera]);

  // Open the camera on mount; fall back to file capture on any failure.
  useEffect(() => {
    let cancelled = false;

    const Ctor = (
      globalThis as unknown as {
        BarcodeDetector?: BarcodeDetectorCtor;
      }
    ).BarcodeDetector;

    const setupDetector = async () => {
      if (!Ctor) return;
      try {
        const formats = (await Ctor.getSupportedFormats?.()) ?? ['qr_code'];
        if (formats.includes('qr_code')) {
          detectorRef.current = new Ctor({ formats: ['qr_code'] });
        }
      } catch {
        detectorRef.current = null;
      }
    };

    const start = async () => {
      await setupDetector();
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error('getUserMedia unavailable');
        }
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }
        streamRef.current = stream;
        const video = videoRef.current;
        if (video) {
          video.srcObject = stream;
          video.setAttribute('playsinline', 'true');
          await video.play().catch(() => undefined);
          rafRef.current = requestAnimationFrame(scanFrame);
        }
      } catch {
        if (!cancelled) setCameraFailed(true);
      }
    };

    void start();

    return () => {
      cancelled = true;
      stopCamera();
    };
  }, [scanFrame, stopCamera]);

  // Decode a still chosen through the file/camera picker.
  const handleFile = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        void decodeFromCanvas(img, img.naturalWidth, img.naturalHeight).then(
          value => {
            URL.revokeObjectURL(url);
            if (value) emit(value);
          }
        );
      };
      img.onerror = () => URL.revokeObjectURL(url);
      img.src = url;
      // Allow re-selecting the same file to retry.
      event.target.value = '';
    },
    [decodeFromCanvas, emit]
  );

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex flex-col bg-black text-white',
        className
      )}
    >
      {!cameraFailed && (
        <video
          ref={videoRef}
          className='absolute inset-0 h-full w-full object-cover'
          muted
          playsInline
        />
      )}

      {cameraFailed && (
        <div className='absolute inset-0 flex flex-col items-center justify-center gap-6 px-8 text-center'>
          <p className='text-base'>{errorText}</p>
          <button
            type='button'
            className='rounded-xl bg-white px-6 py-3 font-medium text-black'
            onClick={() => fileInputRef.current?.click()}
          >
            {captureLabel}
          </button>
        </div>
      )}

      {/* Scan frame — centred, mirrors the native scanner's overlay. */}
      {!cameraFailed && (
        <div className='pointer-events-none absolute inset-0 flex items-center justify-center'>
          <div className='h-64 w-64 rounded-2xl border-2 border-white/90' />
        </div>
      )}

      {onClose && (
        <button
          type='button'
          aria-label={cancelLabel}
          className='absolute left-4 top-4 z-10 px-2 py-1 text-base font-medium'
          style={{ top: 'max(1rem, env(safe-area-inset-top))' }}
          onClick={() => {
            stopCamera();
            onClose();
          }}
        >
          {cancelLabel}
        </button>
      )}

      {!!instruction && (
        <div
          className='pointer-events-none absolute inset-x-0 bottom-0 px-6 text-center text-base'
          style={{ paddingBottom: 'max(2rem, env(safe-area-inset-bottom))' }}
        >
          {instruction}
        </div>
      )}

      <canvas ref={canvasRef} className='hidden' />
      <input
        ref={fileInputRef}
        type='file'
        accept='image/*'
        capture='environment'
        className='hidden'
        onChange={handleFile}
      />
    </div>
  );
}
