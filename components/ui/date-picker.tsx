"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function firstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

interface DatePickerProps {
  value: string;
  onChange: (val: string) => void;
  label?: string;
  min?: string;
  max?: string;
}

export function DatePicker({ value, onChange, label = "", min, max }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const parsed = value ? new Date(value + "T00:00:00") : null;
  const [viewYear, setViewYear] = useState(parsed?.getFullYear() ?? new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(parsed?.getMonth() ?? new Date().getMonth());

  useEffect(() => {
    if (parsed) {
      setViewYear(parsed.getFullYear());
      setViewMonth(parsed.getMonth());
    }
  }, [value]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const display = parsed
    ? parsed.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
    : label;

  const clamped = (d: Date) => {
    if (min && d < new Date(min + "T00:00:00")) return false;
    if (max && d > new Date(max + "T00:00:00")) return false;
    return true;
  };

  const days: { d: number; disabled: boolean }[] = [];
  const total = daysInMonth(viewYear, viewMonth);
  const start = firstDayOfMonth(viewYear, viewMonth);
  for (let i = 0; i < start; i++) days.push({ d: 0, disabled: true });
  for (let i = 1; i <= total; i++) {
    const dt = new Date(viewYear, viewMonth, i);
    days.push({ d: i, disabled: !clamped(dt) });
  }

  const select = (d: number) => {
    const y = viewYear;
    const m = String(viewMonth + 1).padStart(2, "0");
    const day = String(d).padStart(2, "0");
    onChange(`${y}-${m}-${day}`);
    setOpen(false);
  };

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(viewYear - 1); setViewMonth(11); }
    else setViewMonth(viewMonth - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(viewYear + 1); setViewMonth(0); }
    else setViewMonth(viewMonth + 1);
  };

  const isSelected = (d: number) => {
    if (!parsed) return false;
    return parsed.getFullYear() === viewYear && parsed.getMonth() === viewMonth && parsed.getDate() === d;
  };

  const isToday = (d: number) => {
    const t = new Date();
    return t.getFullYear() === viewYear && t.getMonth() === viewMonth && t.getDate() === d;
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="px-3 py-2 border rounded-xl text-sm outline-none focus:border-primary bg-card flex items-center gap-2 whitespace-nowrap min-w-[120px]"
      >
        <span className="font-medium">{display}</span>
      </button>

      {open && (
        <div className="absolute top-full mt-1 left-0 z-50 bg-card border border-border rounded-xl shadow-xl p-3 w-[270px]">
          <div className="flex items-center justify-between mb-2">
            <button type="button" onClick={prevMonth} className="p-1 hover:bg-accent rounded-md">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-bold">{MONTHS[viewMonth]} {viewYear}</span>
            <button type="button" onClick={nextMonth} className="p-1 hover:bg-accent rounded-md">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-0.5 text-center text-xs">
            {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((s) => (
              <div key={s} className="py-1 text-muted-foreground font-semibold">{s}</div>
            ))}
            {days.map((d, i) => (
              <button
                key={i}
                type="button"
                disabled={d.disabled || d.d === 0}
                onClick={() => select(d.d)}
                className={cn(
                  "py-1.5 rounded-md text-sm transition-colors",
                  d.disabled || d.d === 0 ? "text-muted-foreground/30 cursor-default" : "hover:bg-accent",
                  isSelected(d.d) && "bg-primary text-primary-foreground font-bold hover:bg-primary",
                  !isSelected(d.d) && isToday(d.d) && "border border-primary/50",
                )}
              >
                {d.d || ""}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
