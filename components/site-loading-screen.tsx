"use client";

/**
 * Re-export dari webjoz-ui — single source of truth ada di package webjoz-ui.
 * File ini dipertahankan untuk backward compatibility import path di web/.
 */
export { SiteLoadingScreen as default } from "webjoz-ui";
export type { LoadingScreenVisualConfig, PreloaderStyle } from "webjoz-ui";
export { resolvePreloaderConfig } from "webjoz-ui";
