"use client";
import React from "react";

/**
 * Marks whether full editor chrome should be shown on the canvas.
 *
 * The dashboard editor keeps every affordance (add/delete tiles, reorder,
 * section labels, ...). The creation wizard only enables inline *text* and
 * *image* editing, so it provides `false` here and the structural chrome
 * components opt out of rendering.
 *
 * Default is `true` so any existing usage outside the wizard is unaffected.
 */
const EditorChromeContext = React.createContext(true);

export const EditorChromeProvider = EditorChromeContext.Provider;

export function useEditorChromeEnabled(): boolean {
  return React.useContext(EditorChromeContext);
}
