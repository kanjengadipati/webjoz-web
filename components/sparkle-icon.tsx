import React from "react";

function MaskIcon({ src, className, style }: { src: string; className?: string; style?: React.CSSProperties }) {
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

export function SparkleIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <MaskIcon src="/sparkle.png" className={className} style={style} />;
}

export function SparkleGenAI({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <MaskIcon src="/sparkle-gen-ai.png" className={className} style={style} />;
}
