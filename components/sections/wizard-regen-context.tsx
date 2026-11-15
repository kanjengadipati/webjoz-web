"use client";
import React from "react";

/**
 * Provides the "regen" handler for wizard preview (editorChrome=false).
 * When user clicks the refresh icon on inline text, this handler fires
 * (shows login-required toast in wizard). Dashboard editor doesn't set this.
 */
interface WizardRegenContextValue {
  onRegen: (() => void) | null;
}

const WizardRegenContext = React.createContext<WizardRegenContextValue>({ onRegen: null });

export const WizardRegenProvider = WizardRegenContext.Provider;

export function useWizardRegen(): (() => void) | null {
  return React.useContext(WizardRegenContext).onRegen;
}