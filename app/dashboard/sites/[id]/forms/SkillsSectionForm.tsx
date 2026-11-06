"use client";

import React from "react";
import { Plus, Trash2, Layers, Wrench } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { SidebarField } from "@/components/sidebar-field";
import { IconPicker, CollapsibleGroup, SIDEBAR_FIELD_CLASS } from "./shared";
import type { BaseSectionFormProps } from "./types";
import type { SkillGroup, SkillItem } from "@/components/templates/types";

export function SkillsSectionForm({
  content,
  updateField,
  fieldUndoStacks,
  undoField,
}: BaseSectionFormProps) {
  const { t } = useI18n();
  const groups: SkillGroup[] = content.skills?.groups || [];

  const handleUpdateGroups = (nextGroups: SkillGroup[]) => {
    updateField("skills", "groups", nextGroups);
  };

  const handleAddGroup = () => {
    const nextGroups: SkillGroup[] = [
      ...groups,
      {
        name: "Kategori Baru",
        items: [{ label: "Skill Baru", level: "intermediate", icon: null }],
      },
    ];
    handleUpdateGroups(nextGroups);
  };

  const handleRemoveGroup = (gIdx: number) => {
    const nextGroups = groups.filter((_, idx) => idx !== gIdx);
    handleUpdateGroups(nextGroups);
  };

  const handleGroupNameChange = (gIdx: number, name: string) => {
    const nextGroups = [...groups];
    nextGroups[gIdx] = { ...nextGroups[gIdx], name };
    handleUpdateGroups(nextGroups);
  };

  const handleAddItem = (gIdx: number) => {
    const nextGroups = [...groups];
    const items = [...(nextGroups[gIdx].items || [])];
    items.push({ label: "Skill Baru", level: "intermediate", icon: null });
    nextGroups[gIdx] = { ...nextGroups[gIdx], items };
    handleUpdateGroups(nextGroups);
  };

  const handleRemoveItem = (gIdx: number, iIdx: number) => {
    const nextGroups = [...groups];
    const items = (nextGroups[gIdx].items || []).filter((_, idx) => idx !== iIdx);
    nextGroups[gIdx] = { ...nextGroups[gIdx], items };
    handleUpdateGroups(nextGroups);
  };

  const handleItemChange = (gIdx: number, iIdx: number, patch: Partial<SkillItem>) => {
    const nextGroups = [...groups];
    const items = [...(nextGroups[gIdx].items || [])];
    items[iIdx] = { ...items[iIdx], ...patch };
    nextGroups[gIdx] = { ...nextGroups[gIdx], items };
    handleUpdateGroups(nextGroups);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-primary/20 bg-primary/10 px-3 py-2.5 text-[12px] leading-relaxed text-primary">
        <p className="font-semibold text-primary">🛠️ Section Keahlian &amp; Toolkit</p>
        <p className="mt-1 text-primary/80">
          Tampilkan teknologi, stack bahasa pemrograman, tools desain, atau keahlian spesifik Anda untuk memikat calon klien dan perekrut.
        </p>
      </div>

      <div className="space-y-3">
        <SidebarField
          section="skills"
          fieldKey="eyebrow"
          label="Eyebrow (Label Atas)"
          value={content.skills?.eyebrow || ""}
          onChange={(val) => updateField("skills", "eyebrow", val)}
          placeholder="KEAHLIAN"
          undoCount={fieldUndoStacks?.["skills.eyebrow"]?.length}
          onUndo={() => undoField?.("skills", "eyebrow")}
        />
        <SidebarField
          section="skills"
          fieldKey="title"
          label="Judul Section"
          value={content.skills?.title || ""}
          onChange={(val) => updateField("skills", "title", val)}
          placeholder="Toolkit & Keahlian"
          undoCount={fieldUndoStacks?.["skills.title"]?.length}
          onUndo={() => undoField?.("skills", "title")}
        />
        <SidebarField
          section="skills"
          fieldKey="subtitle"
          label="Subjudul (Opsional)"
          value={content.skills?.subtitle || ""}
          onChange={(val) => updateField("skills", "subtitle", val)}
          placeholder="Teknologi dan tools yang saya gunakan sehari-hari."
          undoCount={fieldUndoStacks?.["skills.subtitle"]?.length}
          onUndo={() => undoField?.("skills", "subtitle")}
        />
      </div>

      {/* GROUPS LIST */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
            Daftar Kategori Keahlian
          </label>
          <button
            type="button"
            onClick={handleAddGroup}
            className="flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Tambah Kategori
          </button>
        </div>

        {groups.length === 0 ? (
          <div className="p-4 border border-dashed border-border rounded-xl text-center text-[12px] text-sidebar-muted-foreground">
            Belum ada kategori keahlian. Klik <b>Tambah Kategori</b> di atas.
          </div>
        ) : (
          groups.map((group, gIdx) => (
            <CollapsibleGroup
              key={gIdx}
              label={`${group.name || `Kategori #${gIdx + 1}`} (${(group.items || []).length})`}
              defaultOpen={true}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1">
                    <label className="text-[10px] text-sidebar-muted-foreground mb-1 block">
                      Nama Kategori
                    </label>
                    <input
                      type="text"
                      value={group.name || ""}
                      onChange={(e) => handleGroupNameChange(gIdx, e.target.value)}
                      placeholder="Contoh: Frontend, Backend, UI/UX"
                      className={`${SIDEBAR_FIELD_CLASS} border-border text-sidebar-foreground`}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveGroup(gIdx)}
                    className="text-red-400 hover:text-red-300 text-[11px] flex items-center gap-1 cursor-pointer pt-4 shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Hapus Kategori
                  </button>
                </div>

                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-sidebar-subtle-foreground">
                      Item Skill ({(group.items || []).length})
                    </span>
                    <button
                      type="button"
                      onClick={() => handleAddItem(gIdx)}
                      className="text-[10px] font-semibold text-primary hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" /> Tambah Skill
                    </button>
                  </div>

                  {(group.items || []).map((item, iIdx) => (
                    <div
                      key={iIdx}
                      className="p-2.5 border border-border rounded-lg bg-muted/40 space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <input
                          type="text"
                          value={item.label || ""}
                          onChange={(e) => handleItemChange(gIdx, iIdx, { label: e.target.value })}
                          placeholder="Nama skill (misal: Next.js)"
                          className="flex-1 px-2 py-1 border border-border rounded text-[12px] outline-none focus:border-primary/60 bg-transparent text-sidebar-foreground"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(gIdx, iIdx)}
                          className="text-red-400 hover:text-red-300 p-1 cursor-pointer"
                          title="Hapus skill"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2 items-center">
                        <div>
                          <label className="text-[10px] text-sidebar-muted-foreground mb-0.5 block">
                            Kemahiran (Opsional)
                          </label>
                          <select
                            value={item.level || ""}
                            onChange={(e) =>
                              handleItemChange(gIdx, iIdx, {
                                level: (e.target.value as any) || undefined,
                              })
                            }
                            className="w-full px-2 py-1 border border-border rounded text-[11px] outline-none focus:border-primary/60 bg-transparent text-sidebar-foreground cursor-pointer"
                          >
                            <option value="" className="bg-[#1a1d26] text-white">Tanpa Level</option>
                            <option value="beginner" className="bg-[#1a1d26] text-white">Pemula (Beginner)</option>
                            <option value="intermediate" className="bg-[#1a1d26] text-white">Menengah (Intermediate)</option>
                            <option value="expert" className="bg-[#1a1d26] text-white">Mahir (Expert)</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] text-sidebar-muted-foreground mb-0.5 block">
                            Ikon (Opsional)
                          </label>
                          <IconPicker
                            value={item.icon || ""}
                            onChange={(iconName) => handleItemChange(gIdx, iIdx, { icon: iconName })}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CollapsibleGroup>
          ))
        )}
      </div>
    </div>
  );
}
