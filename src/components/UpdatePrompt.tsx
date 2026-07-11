import { RefreshCw, X } from "lucide-react";

type UpdatePromptProps = {
  isOpen: boolean;
  currentVersion: string;
  latestVersion: string;
  releaseNotes: string[];
  onUpdate: () => void;
  onDismiss: () => void;
};

export function UpdatePrompt({
  isOpen,
  currentVersion,
  latestVersion,
  releaseNotes,
  onUpdate,
  onDismiss,
}: UpdatePromptProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[80] px-4 pb-4 sm:bottom-6 sm:px-6">
      <div className="mx-auto max-w-md rounded-xl border border-emerald-100 bg-white shadow-2xl shadow-slate-900/20">
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
              <RefreshCw size={17} />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900">發現新版本</h2>
              <p className="text-xs text-slate-500">更新後會重新載入並進入新版</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onDismiss}
            aria-label="稍後更新"
            title="稍後更新"
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-3 px-4 py-4">
          <div className="grid grid-cols-[72px_1fr] gap-x-3 gap-y-1 text-sm">
            <span className="font-semibold text-slate-500">目前版本：</span>
            <span className="font-bold text-slate-800">{currentVersion}</span>
            <span className="font-semibold text-slate-500">最新版：</span>
            <span className="font-bold text-emerald-700">{latestVersion}</span>
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
        </div>

        <div className="grid grid-cols-2 gap-2 border-t border-slate-100 p-3">
          <button
            type="button"
            onClick={onDismiss}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50"
          >
            稍後更新
          </button>
          <button
            type="button"
            onClick={onUpdate}
            className="rounded-lg bg-emerald-700 px-3 py-2 text-sm font-bold text-white hover:bg-emerald-800"
          >
            立即更新
          </button>
        </div>
      </div>
    </div>
  );
}
