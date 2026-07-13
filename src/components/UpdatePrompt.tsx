/**
 * PWA 更新提示元件
 *
 * 只負責顯示版本資訊與更新按鈕。
 * Service Worker 更新流程由 useAppUpdate 控制。
 */
import { RefreshCw, X } from "lucide-react";

type UpdatePromptProps = {
  isOpen: boolean;
  currentVersion: string;
  latestVersion: string;
  releaseDate: string;
  releaseNotes: string[];
  forceUpdate: boolean;
  onUpdate: () => void;
  onDismiss: () => void;
};

export function UpdatePrompt({
  isOpen,
  currentVersion,
  latestVersion,
  releaseDate,
  releaseNotes,
  forceUpdate,
  onUpdate,
  onDismiss,
}: UpdatePromptProps) {
  if (!isOpen) return null;

  const updateMessage = forceUpdate
    ? "本次更新必須安裝才能繼續使用"
    : "可以馬上更新，也可以稍後再更新";
  const primaryActionLabel = forceUpdate ? "立即更新" : "馬上更新";
  const secondaryActionLabel = "稍後更新";

  return (
    <div className="fixed inset-0 z-[80] flex h-[100dvh] items-end justify-center bg-black/30 px-4 py-4 sm:items-center sm:px-6">
      <div className="flex max-h-[calc(100dvh-2rem)] w-full max-w-md flex-col overflow-hidden rounded-xl border border-emerald-100 bg-white shadow-2xl shadow-slate-900/20">
        <div className="shrink-0 flex items-start justify-between gap-3 border-b border-slate-100 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
              <RefreshCw size={17} />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900">發現新版本</h2>
              <p className="text-xs text-slate-500">
                {updateMessage}
              </p>
            </div>
          </div>
          {!forceUpdate && (
            <button
              type="button"
              onClick={onDismiss}
              aria-label="稍後更新"
              title="稍後更新"
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4">
          <div className="grid grid-cols-[72px_1fr] gap-x-3 gap-y-1 text-sm">
            <span className="font-semibold text-slate-500">目前版本：</span>
            <span className="font-bold text-slate-800">{currentVersion}</span>
            <span className="font-semibold text-slate-500">最新版：</span>
            <span className="font-bold text-emerald-700">{latestVersion}</span>
            <span className="font-semibold text-slate-500">發布日期：</span>
            <span className="font-bold text-slate-800">{releaseDate}</span>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-bold text-slate-800">本次更新內容：</h3>
            <ul className="space-y-1 text-sm leading-relaxed text-slate-600">
              {releaseNotes.map((note) => (
                <li key={note} className="flex gap-2">
                  <span className="text-emerald-600">•</span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-800">
            更新會清除 App 暫存並重新載入頁面。已儲存的旅程、清單、記帳與附件資料不會被清除；如果現在有尚未儲存的資料，請先儲存後再更新，避免重新載入後遺失。
          </div>
        </div>

        <div
          className={`shrink-0 grid min-h-[68px] gap-2 border-t border-slate-100 bg-white p-3 ${
            forceUpdate ? "grid-cols-1" : "grid-cols-2"
          }`}
        >
          {!forceUpdate && (
            <button
              type="button"
              onClick={onDismiss}
              className="flex min-h-11 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold leading-none text-slate-600 hover:bg-slate-50"
            >
              {secondaryActionLabel}
            </button>
          )}
          <button
            type="button"
            onClick={onUpdate}
            className="flex min-h-11 items-center justify-center rounded-lg bg-emerald-700 px-3 text-sm font-bold leading-none text-white hover:bg-emerald-800"
          >
            {primaryActionLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
