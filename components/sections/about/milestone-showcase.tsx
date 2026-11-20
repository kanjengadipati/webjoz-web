"use client";
import React from "react";
import { Flag, Award, Users, Rocket, Sparkles, Plus, Trash2 } from "lucide-react";
import { InlineText } from "../../templates/shared";
import type { AboutVariantProps } from "./classic";

const defaultMilestones = [
  { year: "2018", title: "Berdiri", description: "Mulai melayani pelanggan dengan integritas." },
  { year: "2020", title: "Ekspansi", description: "Perluasan jangkauan dan peningkatan kapasitas." },
  { year: "2023", title: "Transformasi Digital", description: "Layanan modern dengan standar teknologi terkini." },
  { year: "Sekarang", title: "Inovasi Berkelanjutan", description: "Terus bertumbuh bersama ribuan klien." },
];

const milestoneIcons = [Flag, Rocket, Award, Users, Sparkles];

export default function AboutMilestoneShowcase({
  about: a,
  onUpdateField,
  isEditorMode,
  isSelected,
  collapseSheetForInlineEdit,
  onEditingStateChange,
  onAddItem,
  language = "id",
}: AboutVariantProps) {
  const isEN = language.toLowerCase().startsWith("en");
  const py = { paddingTop: "var(--dt-spacing)", paddingBottom: "var(--dt-spacing)" } as any;
  const milestones = a.milestones && a.milestones.length > 0 ? a.milestones : defaultMilestones;

  return (
    <section
      id="about"
      className="group"
      style={{
        ...py,
        padding: `var(--dt-spacing) 1.5rem`,
        maxWidth: "76rem",
        margin: "0 auto",
      }}
    >
      {/* Top Header: Eyebrow, Title, Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-end mb-12 lg:mb-16">
        <div className="lg:col-span-7 flex flex-col gap-3">
          <div className="inline-block">
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                color: "var(--dt-primary)",
              }}
            >
              <InlineText
                section="about"
                fieldKey="eyebrow"
                value={a.eyebrow || (isEN ? "Our Journey" : "Perjalanan Kami")}
                placeholder={isEN ? "Add label..." : "Tambah label..."}
                onUpdateField={onUpdateField}
                isEditorMode={isEditorMode}
                isSelected={isSelected}
                as="span"
                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                onEditingStateChange={onEditingStateChange}
              />
            </span>
          </div>

          <div className="w-full">
            <InlineText
              section="about"
              fieldKey="title"
              value={a.title}
              onUpdateField={onUpdateField}
              isEditorMode={isEditorMode}
              isSelected={isSelected}
              as="h2"
              multiline={true}
              style={{
                fontFamily: "var(--dt-heading-font)",
                fontWeight: "var(--dt-heading-weight)" as any,
                fontSize: "clamp(1.75rem, 4cqw, 2.75rem)",
                color: "var(--dt-text)",
                lineHeight: 1.2,
                margin: 0,
                display: "block",
              }}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={onEditingStateChange}
            />
          </div>
        </div>

        <div className="lg:col-span-5">
          <InlineText
            section="about"
            fieldKey="body"
            value={a.body}
            onUpdateField={onUpdateField}
            isEditorMode={isEditorMode}
            isSelected={isSelected}
            multiline={true}
            as="p"
            style={{
              color: "var(--dt-text-muted)",
              lineHeight: 1.7,
              margin: 0,
              fontSize: "0.975rem",
              whiteSpace: "pre-line",
            }}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            onEditingStateChange={onEditingStateChange}
          />
        </div>
      </div>

      {/* Horizontal Milestone Strip */}
      <div className="relative">
        {/* Continuous horizontal track line (visible on md+) */}
        <div
          aria-hidden="true"
          className="hidden md:block absolute top-[28px] left-6 right-6 h-[2px]"
          style={{
            background:
              "linear-gradient(90deg, var(--dt-primary) 0%, color-mix(in srgb, var(--dt-primary) 30%, transparent) 100%)",
          }}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
          {milestones.map((m, idx) => {
            const Icon = milestoneIcons[idx % milestoneIcons.length] ?? Sparkles;
            return (
              <div
                key={idx}
                className="flex flex-col gap-3 group/item relative p-5 md:p-0 md:bg-transparent rounded-xl"
                style={{
                  background: "var(--dt-surface, #ffffff)",
                  border: "1px solid var(--dt-card-border, rgba(0,0,0,0.06))",
                }}
              >
                {/* Node icon & dot */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover/item:scale-110 shadow-sm"
                    style={{
                      background: "var(--dt-surface, #ffffff)",
                      border: "2px solid var(--dt-primary)",
                      color: "var(--dt-primary)",
                    }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--dt-heading-font)",
                      fontWeight: 800,
                      fontSize: "1.35rem",
                      color: "var(--dt-primary)",
                    }}
                  >
                    <InlineText
                      section="about"
                      fieldKey={`milestones.${idx}.year`}
                      value={m.year}
                      placeholder={isEN ? "Year..." : "Tahun..."}
                      onUpdateField={onUpdateField}
                      isEditorMode={isEditorMode}
                      isSelected={isSelected}
                      as="span"
                      collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                      onEditingStateChange={onEditingStateChange}
                    />
                  </span>
                </div>

                {/* Milestone Title & Description */}
                <div className="flex flex-col gap-1 mt-1">
                  <h3
                    style={{
                      fontFamily: "var(--dt-heading-font)",
                      fontWeight: 700,
                      fontSize: "1.1rem",
                      color: "var(--dt-text)",
                      margin: 0,
                    }}
                  >
                    <InlineText
                      section="about"
                      fieldKey={`milestones.${idx}.title`}
                      value={m.title}
                      placeholder={isEN ? "Milestone title..." : "Judul pencapaian..."}
                      onUpdateField={onUpdateField}
                      isEditorMode={isEditorMode}
                      isSelected={isSelected}
                      as="span"
                      collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                      onEditingStateChange={onEditingStateChange}
                    />
                  </h3>
                  {(m.description || isEditorMode) && (
                    <p
                      style={{
                        fontSize: "0.85rem",
                        color: "var(--dt-text-muted)",
                        lineHeight: 1.5,
                        margin: 0,
                      }}
                    >
                      <InlineText
                        section="about"
                        fieldKey={`milestones.${idx}.description`}
                        value={m.description || ""}
                        placeholder={isEN ? "Milestone description..." : "Deskripsi pencapaian..."}
                        onUpdateField={onUpdateField}
                        isEditorMode={isEditorMode}
                        isSelected={isSelected}
                        as="span"
                        collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                        onEditingStateChange={onEditingStateChange}
                      />
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
