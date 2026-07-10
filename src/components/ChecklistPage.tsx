import { Check } from "lucide-react";
import type { SupabaseClient } from "@supabase/supabase-js";

import type { ChecklistItem } from "../types";
import { useChecklistState } from "../hooks/useChecklistState";

interface ChecklistPageProps {
  tripId: string;
  checklistData: ChecklistItem[];
  supabase: SupabaseClient;
  canViewSharedChecklist: boolean;
  canToggleSharedChecklist: boolean;
}

export const ChecklistPage = ({
  tripId,
  checklistData,
  supabase,
  canViewSharedChecklist,
  canToggleSharedChecklist,
}: ChecklistPageProps) => {
  const { items, syncStatus, syncError, toggleChecklistItem } =
    useChecklistState(
      tripId,
      checklistData,
      supabase,
      canToggleSharedChecklist,
    );
  const checkedItemIds = items
    .filter((item) => item.isChecked)
    .map((item) => item.id);
  const visibleCheckedItemIds = checkedItemIds.filter((checkedItemId) =>
    items.some((item) => item.id === checkedItemId),
  );
  const categories = Array.from(
    new Set(items.map((item) => item.category)),
  );
  const progressPercent =
    items.length > 0
      ? (visibleCheckedItemIds.length / items.length) * 100
      : 0;

  if (!canViewSharedChecklist) {
    return (
      <div className="text-center py-12 text-slate-400 bg-white border border-dashed border-slate-200 rounded-xl shadow-sm">
        目前角色無法查看共同檢查清單。
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400 bg-white border border-dashed border-slate-200 rounded-xl shadow-sm">
        此行程尚未配置檢查清單。
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
        <div className="flex justify-between items-center mb-2 text-sm font-bold text-slate-700">
          <span>準備進度</span>
          <span className="text-rose-700">
            {Math.round(progressPercent)}% ({visibleCheckedItemIds.length}/
            {items.length})
          </span>
        </div>
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-rose-600 h-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        {!canToggleSharedChecklist && (
          <p className="mt-3 text-xs font-medium text-slate-500">
            目前角色可查看共同檢查清單，但不可勾選。
          </p>
        )}
        {canToggleSharedChecklist && (
          <p className="mt-3 text-xs font-medium text-slate-500">
            {syncStatus === "syncing" && "正在同步共同檢查清單..."}
            {syncStatus === "synced" && "共同檢查清單已同步到雲端。"}
            {syncStatus === "error" && syncError}
            {syncStatus === "local" && "目前資料先保存於本機。"}
          </p>
        )}
      </div>

      {categories.map((category) => (
        <div key={category} className="space-y-2">
          <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-wider pl-1">
            {category}
          </h3>
          <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden divide-y divide-slate-100">
            {items
              .filter((item) => item.category === category)
              .map((item) => {
                const isChecked = item.isChecked;

                return (
                  <button
                    key={item.id}
                    type="button"
                    disabled={!canToggleSharedChecklist}
                    onClick={() => {
                      if (!canToggleSharedChecklist) return;
                      toggleChecklistItem(item.id);
                    }}
                    className={`flex w-full items-center gap-3 p-4 text-left transition-colors select-none ${
                      canToggleSharedChecklist
                        ? "hover:bg-slate-50/80 cursor-pointer"
                        : "cursor-not-allowed bg-slate-50/40"
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                        isChecked
                          ? "bg-rose-600 border-rose-600 text-white shadow-sm scale-105"
                          : "border-slate-300 bg-white"
                      }`}
                    >
                      {isChecked && <Check size={14} strokeWidth={3} />}
                    </span>
                    <span
                      className={`text-sm font-medium transition-all ${
                        isChecked ? "text-slate-400 line-through" : "text-slate-700"
                      }`}
                    >
                      {item.label}
                    </span>
                  </button>
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
};
