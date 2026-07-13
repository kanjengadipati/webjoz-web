function MaskIcon({ src, className }: { src: string; className?: string }) {
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
      }}
    />
  );
}

export function SparkleIcon({ className }: { className?: string }) {
  return <MaskIcon src="/sparkle.png" className={className} />;
}

export function SparkleGenAI({ className }: { className?: string }) {
  return <MaskIcon src="/sparkle-gen-ai.png" className={className} />;
}
