/* eslint-disable @typescript-eslint/no-explicit-any */
// FILE: lib/preview-set-by-path.ts
//
// Immutably set a nested value in `obj` by a dotted path of segments where
// numeric segments index into arrays (e.g. ["items", "0", "quote"]).
// Shared by dashboard editor and wizard preview.

export function previewSetByPath(obj: any, segments: string[], value: any): any {
  if (segments.length === 0) return value;
  const [head, ...rest] = segments;
  const isIndex = /^\d+$/.test(head);
  if (rest.length === 0) {
    if (isIndex) {
      const arr = Array.isArray(obj) ? obj.slice() : [];
      arr[Number(head)] = value;
      return arr;
    }
    return { ...(obj ?? {}), [head]: value };
  }
  const next = obj?.[head];
  const child = previewSetByPath(next, rest, value);
  if (isIndex) {
    const arr = Array.isArray(obj) ? obj.slice() : [];
    arr[Number(head)] = child;
    return arr;
  }
  return { ...(obj ?? {}), [head]: child };
}