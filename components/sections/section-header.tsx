"use client";
import React from "react";
import { InlineText, type InlineTextProps } from "../templates/shared";

type InlineEditingProps = Pick<
  InlineTextProps,
  "onUpdateField" | "isEditorMode" | "isSelected" | "collapseSheetForInlineEdit" | "onEditingStateChange"
>;

export interface SectionHeaderProps extends InlineEditingProps {
  section: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  wrapperClassName?: string;
  wrapperStyle?: React.CSSProperties;
  eyebrowWrapperClassName?: string;
  eyebrowWrapperStyle?: React.CSSProperties;
  eyebrowClassName?: string;
  eyebrowStyle?: React.CSSProperties;
  titleAs?: React.ElementType;
  titleClassName?: string;
  titleStyle?: React.CSSProperties;
  subtitleAs?: React.ElementType;
  subtitleClassName?: string;
  subtitleStyle?: React.CSSProperties;
  subtitleMultiline?: boolean;
  divider?: boolean;
  dividerClassName?: string;
  dividerStyle?: React.CSSProperties;
  dividerPlacement?: "end" | "beforeSubtitle";
}

const DEFAULT_DIVIDER_STYLE: React.CSSProperties = {
  width: "3rem",
  height: "3px",
  background: "var(--dt-primary)",
  borderRadius: "4px",
  margin: "0.75rem auto 0",
};

export function pillEyebrowStyle(accent: string): React.CSSProperties {
  return {
    display: "inline-block",
    fontSize: "0.7rem",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.18em",
    color: accent,
    background: `color-mix(in srgb, ${accent} 10%, transparent)`,
    padding: "0.45rem 0.85rem",
    borderRadius: "9999px",
  };
}

export function headerTitleStyle(fontFamily: string, fontWeight: string, color: string): React.CSSProperties {
  return {
    fontFamily,
    fontWeight: fontWeight as React.CSSProperties["fontWeight"],
    fontSize: "clamp(1.5rem, 5cqw, 2.5rem)",
    color,
    marginTop: "0.85rem",
    lineHeight: 1.15,
  };
}

export function headerDividerStyle(accent: string): React.CSSProperties {
  return { width: "3rem", height: "3px", background: accent, borderRadius: "4px", margin: "0.75rem auto 0" };
}

export function SectionHeader({
  section,
  eyebrow,
  title,
  subtitle,
  wrapperClassName,
  wrapperStyle,
  eyebrowWrapperClassName,
  eyebrowWrapperStyle,
  eyebrowClassName,
  eyebrowStyle,
  titleAs = "h2",
  titleClassName,
  titleStyle,
  subtitleAs = "p",
  subtitleClassName,
  subtitleStyle,
  subtitleMultiline = false,
  divider = false,
  dividerClassName,
  dividerStyle,
  dividerPlacement = "end",
  onUpdateField,
  isEditorMode,
  isSelected,
  collapseSheetForInlineEdit,
  onEditingStateChange,
}: SectionHeaderProps) {
  const eyebrowEl = (
    <InlineText
      section={section}
      fieldKey="eyebrow"
      value={eyebrow}
      as="span"
      className={eyebrowClassName}
      style={eyebrowStyle}
      onUpdateField={onUpdateField}
      isEditorMode={isEditorMode}
      isSelected={isSelected}
      collapseSheetForInlineEdit={collapseSheetForInlineEdit}
      onEditingStateChange={onEditingStateChange}
    />
  );

  const dividerEl = (
    <div
      className={dividerClassName}
      style={dividerStyle ?? (dividerClassName ? undefined : DEFAULT_DIVIDER_STYLE)}
    />
  );

  return (
    <div className={wrapperClassName} style={wrapperStyle}>
      {eyebrow !== undefined &&
        (eyebrowWrapperStyle || eyebrowWrapperClassName ? (
          <span className={eyebrowWrapperClassName} style={eyebrowWrapperStyle}>
            {eyebrowEl}
          </span>
        ) : (
          eyebrowEl
        ))}
      <InlineText
        section={section}
        fieldKey="title"
        value={title}
        as={titleAs}
        className={titleClassName}
        style={titleStyle}
        onUpdateField={onUpdateField}
        isEditorMode={isEditorMode}
        isSelected={isSelected}
        collapseSheetForInlineEdit={collapseSheetForInlineEdit}
        onEditingStateChange={onEditingStateChange}
      />
      {divider && dividerPlacement === "beforeSubtitle" && dividerEl}
      {subtitle !== undefined && (
        <InlineText
          section={section}
          fieldKey="subtitle"
          value={subtitle}
          as={subtitleAs}
          className={subtitleClassName}
          style={subtitleStyle}
          multiline={subtitleMultiline}
          onUpdateField={onUpdateField}
          isEditorMode={isEditorMode}
          isSelected={isSelected}
          collapseSheetForInlineEdit={collapseSheetForInlineEdit}
          onEditingStateChange={onEditingStateChange}
        />
      )}
      {divider && dividerPlacement === "end" && dividerEl}
    </div>
  );
}
