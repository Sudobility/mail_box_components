type PlatformType = 'web' | 'ios' | 'android' | 'macos';

interface PlatformIconProps {
  platform: PlatformType;
  size?: number;
  className?: string;
}

/** Globe icon for Web */
function GlobeIcon({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth={2}
      strokeLinecap='round'
      strokeLinejoin='round'
      className={className}
    >
      <circle cx='12' cy='12' r='10' />
      <path d='M2 12h20' />
      <path d='M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z' />
    </svg>
  );
}

/** Apple icon for iOS/macOS */
function AppleIcon({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill='currentColor'
      className={className}
    >
      <path d='M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z' />
    </svg>
  );
}

/** Android icon */
function AndroidIcon({
  size,
  className,
}: {
  size: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill='currentColor'
      className={className}
    >
      <path d='M17.6 9.48l1.84-3.18c.16-.31.04-.69-.27-.86-.31-.16-.69-.04-.86.27l-1.87 3.24C14.85 8.35 13.47 8 12 8s-2.85.35-4.44.95L5.69 5.71c-.16-.31-.54-.43-.86-.27-.31.16-.43.54-.27.86L6.4 9.48C3.74 11.05 2 13.85 2 17h20c0-3.15-1.74-5.95-4.4-7.52zM7 15.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zm10 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5z' />
    </svg>
  );
}

const PLATFORM_DISPLAY_NAMES: Record<PlatformType, string> = {
  web: 'Web',
  ios: 'iOS',
  android: 'Android',
  macos: 'macOS',
};

export function PlatformIcon({
  platform,
  size = 16,
  className,
}: PlatformIconProps) {
  switch (platform) {
    case 'web':
      return <GlobeIcon size={size} className={className} />;
    case 'ios':
    case 'macos':
      return <AppleIcon size={size} className={className} />;
    case 'android':
      return <AndroidIcon size={size} className={className} />;
  }
}

export function platformDisplayName(platform: PlatformType): string {
  return PLATFORM_DISPLAY_NAMES[platform];
}
