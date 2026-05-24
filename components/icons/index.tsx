import type { SVGAttributes } from "react";
import { cn } from "@/lib/utils";

type IconSize = "sm" | "md" | "lg";

type IconProps = SVGAttributes<SVGSVGElement> & {
  size?: IconSize;
};

const ICON_SIZE: Record<IconSize, string> = {
  sm: "size-4",
  md: "size-5",
  lg: "size-8",
};

function IconShell({ size = "md", className, children, ...props }: IconProps) {
  return (
    <svg
      className={cn(ICON_SIZE[size], className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function SunIcon(props: IconProps) {
  return (
    <IconShell {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </IconShell>
  );
}

export function MoonIcon(props: IconProps) {
  return (
    <IconShell {...props}>
      <path d="M21 14.5A8.5 8.5 0 0 1 9.5 3 7 7 0 1 0 21 14.5Z" />
    </IconShell>
  );
}

export function BookOpenIcon(props: IconProps) {
  return (
    <IconShell {...props}>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a4 4 0 0 0-4-4H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a4 4 0 0 1 4-4h6z" />
    </IconShell>
  );
}

export function LockIcon(props: IconProps) {
  return (
    <IconShell {...props}>
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </IconShell>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <IconShell {...props}>
      <path d="m5 13 4 4L19 7" />
    </IconShell>
  );
}

export function AlertIcon(props: IconProps) {
  return (
    <IconShell {...props}>
      <path d="M12 8v5" />
      <path d="M12 16h.01" />
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
    </IconShell>
  );
}

export function InfoIcon(props: IconProps) {
  return (
    <IconShell {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </IconShell>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <IconShell {...props}>
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-10 6L2 7" />
    </IconShell>
  );
}

export function WhatsAppIcon(props: IconProps) {
  return (
    <IconShell {...props}>
      <path d="M4.8 19.2 6 15.8a8 8 0 1 1 3 2.6z" />
      <path d="M9.4 8.7c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.7 1.6c.1.3.1.5-.1.7l-.4.5c.7 1.2 1.6 2 2.8 2.6l.5-.5c.2-.2.5-.3.8-.1l1.5.7c.3.1.4.3.4.6v.4c0 .4-.2.7-.6.9-.6.3-1.3.4-2.2.2-2.8-.6-5.4-3.1-6.1-5.8-.2-.8-.1-1.4.2-1.8Z" />
    </IconShell>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <IconShell {...props}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </IconShell>
  );
}

export function EmptyChartIcon(props: IconProps) {
  return (
    <IconShell {...props}>
      <path d="M4 17.5 9 12l4 3 7-8" />
      <path d="M4 19h16" />
    </IconShell>
  );
}
