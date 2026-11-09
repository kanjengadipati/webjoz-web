/**
 * Client-side feature flags configuration.
 * Allows toggling features via NEXT_PUBLIC_ env vars with safe defaults.
 */

export const FEATURE_FLAGS = {
  /**
   * Theme customization panel at /create wizard.
   * Defaults to true in all environments unless explicitly disabled.
   */
  THEME_PANEL: process.env.NEXT_PUBLIC_FEATURE_THEME_PANEL !== "false",
};

