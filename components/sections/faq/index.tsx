"use client";
import React, { useId, useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import type { FaqItem, TemplateProps } from "../../templates/types";

const DynamicFaqAccordion: React.FC<{ item: FaqItem }> = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);
  const reactId = useId();
  const answerId = `dtfaq-answer-${reactId}`;
  return (
    <div className="dt-faq-item" style={{ border: "1px solid color-mix(in srgb, var(--dt-primary) 20%, transparent)", borderRadius: "var(--dt-radius)", overflow: "hidden" }}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={answerId}
        style={{ width: "100%", padding: "1rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", background: "transparent", cursor: "pointer", fontFamily: "var(--dt-body-font)", color: "var(--dt-text)", fontWeight: 600, textAlign: "left", gap: "1rem" }}
      >
        <span style={{ fontSize: "0.9rem" }}>{item.question}</span>
        {isOpen ? <ChevronUp style={{ width: 18, height: 18, flexShrink: 0, color: "var(--dt-primary)" }} /> : <ChevronDown style={{ width: 18, height: 18, flexShrink: 0, opacity: 0.4 }} />}
      </button>
      {isOpen && (
        <div id={answerId} style={{ padding: "0 1.5rem 1.25rem", fontSize: "0.875rem", lineHeight: 1.7, color: "var(--dt-text-muted)", borderTop: "1px solid color-mix(in srgb, var(--dt-primary) 15%, transparent)", background: "color-mix(in srgb, var(--dt-primary) 3%, transparent)" }}>
          {item.answer}
        </div>
      )}
    </div>
  );
};

export default function FaqSectionInner({ faq }: { faq: TemplateProps["content"]["faq"] }) {
  const py = { paddingTop: "var(--dt-spacing)", paddingBottom: "var(--dt-spacing)" } as any;
  return (
    <section id="faq" style={{ ...py, padding: `var(--dt-spacing) 1.5rem`, maxWidth: "52rem", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <span style={{ fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--dt-primary)" }}>Pertanyaan Umum</span>
        <h2 style={{ fontFamily: "var(--dt-heading-font)", fontWeight: "var(--dt-heading-weight)" as any, fontSize: "clamp(1.35rem, 4.5cqw, 2.25rem)", color: "var(--dt-text)", marginTop: "0.5rem" }}>{faq.title}</h2>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {faq.items?.map((item, idx) => <DynamicFaqAccordion key={idx} item={item} />)}
      </div>
    </section>
  );
}
