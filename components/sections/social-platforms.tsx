"use client";
import React from "react";

interface PlatformDef {
  label: string;
  color: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  urlPattern?: string;
}

const InstagramIcon = ({ className, size = 16 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);

const FacebookIcon = ({ className, size = 16 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);

const TwitterIcon = ({ className, size = 16 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
);

const YoutubeIcon = ({ className, size = 16 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>
);

const LinkedinIcon = ({ className, size = 16 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
);

const TikTokIcon = ({ className, size = 16 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
);

const PinterestIcon = ({ className, size = 16 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" x2="12" y1="6" y2="20"/><path d="M8 10c2-2 4-1 6 0s4 1 6 0"/><path d="M8 14c2 2 4 1 6 0s4-1 6 0"/></svg>
);

const WhatsAppIcon = ({ className, size = 16 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"/></svg>
);

const TelegramIcon = ({ className, size = 16 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="22 2 11 13"/><path d="M22 2L15 22l-4-9-9-4z"/></svg>
);

const DiscordIcon = ({ className, size = 16 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><path d="M7.5 7.5c3.5-1 5.5-1 9 0"/><path d="M7 16.5c3.5 1 5.5 1 9 0"/><path d="M16 3c3 1 5 3 5 7 0 8-4 11-9 11S3 18 3 10c0-4 2-6 5-7"/></svg>
);

const GithubIcon = ({ className, size = 16 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
);

export const SOCIAL_PLATFORMS: Record<string, PlatformDef> = {
  instagram: {
    label: "Instagram",
    color: "#E4405F",
    icon: InstagramIcon,
  },
  facebook: {
    label: "Facebook",
    color: "#1877F2",
    icon: FacebookIcon,
  },
  twitter: {
    label: "Twitter / X",
    color: "#000000",
    icon: TwitterIcon,
  },
  youtube: {
    label: "YouTube",
    color: "#FF0000",
    icon: YoutubeIcon,
  },
  linkedin: {
    label: "LinkedIn",
    color: "#0A66C2",
    icon: LinkedinIcon,
  },
  tiktok: {
    label: "TikTok",
    color: "#000000",
    icon: TikTokIcon,
  },
  pinterest: {
    label: "Pinterest",
    color: "#BD081C",
    icon: PinterestIcon,
  },
  whatsapp: {
    label: "WhatsApp",
    color: "#25D366",
    icon: WhatsAppIcon,
  },
  telegram: {
    label: "Telegram",
    color: "#26A5E4",
    icon: TelegramIcon,
  },
  discord: {
    label: "Discord",
    color: "#5865F2",
    icon: DiscordIcon,
  },
  github: {
    label: "GitHub",
    color: "#333333",
    icon: GithubIcon,
  },
};

export const POPULAR_PLATFORMS = Object.keys(SOCIAL_PLATFORMS);

export function SocialIcon({ platform, className, size = 16 }: { platform: string; className?: string; size?: number }) {
  const def = SOCIAL_PLATFORMS[platform];
  if (!def) return null;
  const Icon = def.icon;
  return <Icon className={className} size={size} />;
}

export function SocialPlatformSelect({ value, onChange, className }: { value: string; onChange: (v: string) => void; className?: string }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={className || "w-full px-2 py-1.5 border rounded-md text-[12px] outline-none focus:border-primary/60 bg-transparent"}
    >
      <option value="">-- Pilih Platform --</option>
      {POPULAR_PLATFORMS.map((key) => (
        <option key={key} value={key}>{SOCIAL_PLATFORMS[key].label}</option>
      ))}
      <option value="__custom__">Lainnya...</option>
    </select>
  );
}
