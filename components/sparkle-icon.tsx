import type { CSSProperties } from "react";

function MaskIcon({ src, className, style }: { src: string; className?: string; style?: CSSProperties }) {
  return (
    <span
      className={className}
      style={{
        display: "inline-block",
        background: "currentColor",
        maskImage: `url(${src})`,
        maskSize: "contain",
        maskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskImage: `url(${src})`,
        WebkitMaskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        ...style,
      }}
    />
  );
}

export function SparkleIcon({ className, style }: { className?: string; style?: CSSProperties }) {
  return <MaskIcon src="/sparkle.webp" className={className} style={style} />;
}

export function SparkleGenAI({ className, style }: { className?: string; style?: CSSProperties }) {
  return <MaskIcon src="/sparkle-gen-ai.webp" className={className} style={style} />;
}

export function AiRefreshIcon({ className, style }: { className?: string; style?: CSSProperties }) {
  return <MaskIcon src="/ai-refresh/ai-refresh-512.webp" className={className} style={style} />;
}
