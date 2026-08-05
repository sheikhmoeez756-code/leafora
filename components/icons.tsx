import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function base(props: IconProps): IconProps {
  return {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    ...props,
  };
}

export function LeafIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 21c-4.5-1.5-7-5-7-9.5C5 6 8.5 3 12 3s7 3 7 8.5c0 4.5-2.5 8-7 9.5Z" />
      <path d="M12 21V8m0 5 3-2.5M12 11 9 8.5" />
    </svg>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

export function CartIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3 4h2l2.4 12.2A1.6 1.6 0 0 0 9 17.5h8.4a1.6 1.6 0 0 0 1.58-1.3L20.6 8H6" />
      <circle cx="9.5" cy="20.5" r="1" />
      <circle cx="17" cy="20.5" r="1" />
    </svg>
  );
}

export function HeartIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 20.5C7 16.5 3.5 13.3 3.5 9.6 3.5 7 5.5 5 8 5c1.6 0 3.1.8 4 2.1C12.9 5.8 14.4 5 16 5c2.5 0 4.5 2 4.5 4.6 0 3.7-3.5 6.9-8.5 10.9Z" />
    </svg>
  );
}

export function HomeIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m4 11 8-7 8 7v8.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19.5Z" />
      <path d="M9.5 21v-6h5v6" />
    </svg>
  );
}

export function UserIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 20.5c1.5-3.5 4.2-5 7.5-5s6 1.5 7.5 5" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 12h16m-6-6 6 6-6 6" />
    </svg>
  );
}

export function ArrowLeftIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M20 12H4m6-6-6 6 6 6" />
    </svg>
  );
}

export function StarIcon(props: IconProps) {
  return (
    <svg {...base({ fill: "currentColor", stroke: "none", ...props })}>
      <path d="m12 2.5 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9Z" />
    </svg>
  );
}

export function DropIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 3.5S6 10 6 14.5a6 6 0 0 0 12 0C18 10 12 3.5 12 3.5Z" />
    </svg>
  );
}

export function SunIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5V5m0 14v2.5M2.5 12H5m14 0h2.5M5.3 5.3 7 7m10 10 1.7 1.7M18.7 5.3 17 7M7 17l-1.7 1.7" />
    </svg>
  );
}

export function HumidityIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M7 16.5a4.5 4.5 0 0 1 .8-8.9 5.5 5.5 0 0 1 10.6 1.4A3.7 3.7 0 0 1 17.5 16" />
      <path d="M9.5 19.5v.01M12.5 21v.01M15.5 19.5v.01" />
    </svg>
  );
}

export function PawIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="7" cy="9" r="1.7" />
      <circle cx="12" cy="6.5" r="1.7" />
      <circle cx="17" cy="9" r="1.7" />
      <path d="M12 11.5c2.6 0 5 2.1 5 4.6 0 1.6-1.2 2.6-2.7 2.4-1-.1-1.6-.5-2.3-.5s-1.3.4-2.3.5C8.2 18.7 7 17.7 7 16.1c0-2.5 2.4-4.6 5-4.6Z" />
    </svg>
  );
}

export function TrashIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4.5 6.5h15M9.5 6V4.5A1.5 1.5 0 0 1 11 3h2a1.5 1.5 0 0 1 1.5 1.5V6M6.5 6.5l.8 12.6A1.5 1.5 0 0 0 8.8 20.5h6.4a1.5 1.5 0 0 0 1.5-1.4l.8-12.6" />
      <path d="M10 10.5v6m4-6v6" />
    </svg>
  );
}

export function MinusIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M5.5 12h13" />
    </svg>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 5.5v13M5.5 12h13" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m4.5 12.5 5 5 10-11" />
    </svg>
  );
}

export function GridIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="4" y="4" width="7" height="7" rx="1.5" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" />
    </svg>
  );
}
