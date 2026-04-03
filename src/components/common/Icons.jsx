import React from 'react';

function IconBase({ children, size = 20, strokeWidth = 1.8, ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function DropletIcon({ size = 20, ...props }) {
  return (
    <IconBase size={size} {...props}>
      <path d="M12 2.75c2.4 3.31 5.5 6.53 5.5 10.25a5.5 5.5 0 1 1-11 0c0-3.72 3.1-6.94 5.5-10.25Z" />
    </IconBase>
  );
}

export function HomeIcon({ size = 20, ...props }) {
  return (
    <IconBase size={size} {...props}>
      <path d="M4.5 10.5 12 4l7.5 6.5" />
      <path d="M6.5 9.5V20h11V9.5" />
      <path d="M10 20v-5h4v5" />
    </IconBase>
  );
}

export function StepsIcon({ size = 20, ...props }) {
  return (
    <IconBase size={size} {...props}>
      <path d="M9.5 4.5c1.7 0 3 1.3 3 3 0 1.2-.7 2.2-1.7 2.7l1.2 2.8c.4.9.1 1.9-.6 2.4l-1.8 1.4c-.7.6-1 1.5-.7 2.4l.5 1.3" />
      <path d="M15.5 8.5c1.5 0 2.7 1.2 2.7 2.7 0 .9-.4 1.8-1.1 2.3l-1.7 1.3c-.8.6-1.2 1.6-.9 2.6l.4 1.1" />
    </IconBase>
  );
}

export function ScaleIcon({ size = 20, ...props }) {
  return (
    <IconBase size={size} {...props}>
      <path d="M6 5.5h12a3 3 0 0 1 3 3V17a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V8.5a3 3 0 0 1 3-3Z" />
      <path d="M8.5 10.5a3.5 3.5 0 0 1 7 0" />
      <path d="m12 10.5 2.2-1.8" />
    </IconBase>
  );
}

export function NewsIcon({ size = 20, ...props }) {
  return (
    <IconBase size={size} {...props}>
      <path d="M6 4.5h10a2 2 0 0 1 2 2V19H8a2 2 0 0 1-2-2V4.5Z" />
      <path d="M6 17a2 2 0 0 1-2-2V7.5" />
      <path d="M9 9h6" />
      <path d="M9 12.5h6" />
      <path d="M9 16h4" />
    </IconBase>
  );
}

export function UserIcon({ size = 20, ...props }) {
  return (
    <IconBase size={size} {...props}>
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5.5 19a6.5 6.5 0 0 1 13 0" />
    </IconBase>
  );
}

export function BellIcon({ size = 20, ...props }) {
  return (
    <IconBase size={size} {...props}>
      <path d="M6.5 9.5a5.5 5.5 0 1 1 11 0c0 3 .9 4.4 1.8 5.5H4.7c.9-1.1 1.8-2.5 1.8-5.5Z" />
      <path d="M10 18.5a2 2 0 0 0 4 0" />
    </IconBase>
  );
}

export function MenuDotsIcon({ size = 20, ...props }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true" {...props}>
      <circle cx="12" cy="5" r="1.9" />
      <circle cx="12" cy="12" r="1.9" />
      <circle cx="12" cy="19" r="1.9" />
    </svg>
  );
}

export function SparkIcon({ size = 20, ...props }) {
  return (
    <IconBase size={size} {...props}>
      <path d="m13 2-1.6 5H7l4.6 2.7L10 15l4.8-3 4.2.9-2.6-4.2L20 4l-5.1 1.1L13 2Z" />
    </IconBase>
  );
}

export function CupIcon({ size = 20, ...props }) {
  return (
    <IconBase size={size} {...props}>
      <path d="M7 10h9v4.2A3.8 3.8 0 0 1 12.2 18H10.8A3.8 3.8 0 0 1 7 14.2V10Z" />
      <path d="M16 11h1.2a1.8 1.8 0 0 1 0 3.6H16" />
      <path d="M8 20h8" />
      <path d="M9 4.5c.9.8.9 1.7 0 2.5" />
      <path d="M12 3.5c1 1 1 2.1 0 3.2" />
      <path d="M15 4.5c.9.8.9 1.7 0 2.5" />
    </IconBase>
  );
}

export function ChartIcon({ size = 20, ...props }) {
  return (
    <IconBase size={size} {...props}>
      <path d="M5 19.5V6.5" />
      <path d="M10 19.5v-9" />
      <path d="M15 19.5v-6" />
      <path d="M20 19.5V4.5" />
      <path d="M3.5 19.5h17" />
    </IconBase>
  );
}

export function StatsIcon({ size = 20, ...props }) {
  return (
    <IconBase size={size} {...props}>
      <path d="M5 5.5h5v5H5Z" />
      <path d="M14 5.5h5v5h-5Z" />
      <path d="M5 14.5h5v5H5Z" />
      <path d="M14 14.5h5v5h-5Z" />
    </IconBase>
  );
}

export function CalendarIcon({ size = 20, ...props }) {
  return (
    <IconBase size={size} {...props}>
      <path d="M6 4v3" />
      <path d="M18 4v3" />
      <path d="M4 8.5h16" />
      <rect x="4" y="5.5" width="16" height="14" rx="3" />
    </IconBase>
  );
}

export function WaveIcon({ size = 20, ...props }) {
  return (
    <IconBase size={size} {...props}>
      <path d="M4 8c1.5 1.2 2.5 1.2 4 0s2.5-1.2 4 0 2.5 1.2 4 0 2.5-1.2 4 0" />
      <path d="M4 12c1.5 1.2 2.5 1.2 4 0s2.5-1.2 4 0 2.5 1.2 4 0 2.5-1.2 4 0" />
      <path d="M4 16c1.5 1.2 2.5 1.2 4 0s2.5-1.2 4 0 2.5 1.2 4 0 2.5-1.2 4 0" />
    </IconBase>
  );
}

export function ArrowRightIcon({ size = 20, ...props }) {
  return (
    <IconBase size={size} {...props}>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </IconBase>
  );
}

export function TargetIcon({ size = 20, ...props }) {
  return (
    <IconBase size={size} {...props}>
      <circle cx="12" cy="12" r="7.5" />
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 2.5v2.2" />
      <path d="M21.5 12h-2.2" />
      <path d="M12 19.3v2.2" />
      <path d="M2.5 12h2.2" />
    </IconBase>
  );
}
