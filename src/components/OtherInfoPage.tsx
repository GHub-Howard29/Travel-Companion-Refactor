import { useEffect, useMemo, useState } from "react";
import { FileText, FolderOpen } from "lucide-react";

import type { Folder, OtherInfoItem } from "../types";
import {
  getFolders,
  getItems,
} from "../services/otherInfoService";
import { getOtherInfoItemsByFolderId } from "../utils/otherInfoUtils";

interface OtherInfoPageProps {
  tripId: string;
  introTitle?: string;
  introContent?: string;
}

export const OtherInfoPage = ({
  tripId,
  introTitle,
  introContent,
}: OtherInfoPageProps) => {
  const folders = useMemo<Folder[]>(() => getFolders(tripId), [tripId]);
  const items = useMemo<OtherInfoItem[]>(() => getItems(tripId), [tripId]);
  const [activeFolderId, setActiveFolderId] = useState(() => folders[0]?.id ?? "");

  const activeFolder = folders.find((folder) => folder.id === activeFolderId);
  const activeItems = useMemo(
    () => getOtherInfoItemsByFolderId(items, activeFolderId),
    [items, activeFolderId],
  );
  const hasIntroContent = Boolean(introTitle || introContent);

  useEffect(() => {
    setActiveFolderId(folders[0]?.id ?? "");
  }, [folders]);

  return (
    <section className="space-y-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-stone-500">
          Reference
        </p>
        <h2 className="text-2xl font-extrabold text-slate-900">旅行資訊</h2>
      </div>

      {hasIntroContent && (
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          {introTitle && (
            <h3 className="mb-2 text-base font-bold text-slate-800">
              {introTitle}
            </h3>
          )}
          {introContent && (
            <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600">
              {introContent}
            </p>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {folders.map((folder) => {
          const isActive = folder.id === activeFolderId;
          const count = getOtherInfoItemsByFolderId(items, folder.id).length;

          return (
            <button
              key={folder.id}
              type="button"
              onClick={() => setActiveFolderId(folder.id)}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-bold transition-colors ${
                isActive
                  ? "border-stone-900 bg-stone-900 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-stone-300 hover:bg-stone-50"
              }`}
            >
              <FolderOpen size={16} />
              <span>{folder.title}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                  isActive ? "bg-white/15 text-white" : "bg-slate-100 text-slate-500"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <h3 className="text-sm font-extrabold text-slate-700">
            {activeFolder?.title ?? "旅行資訊"}
          </h3>
          <span className="text-xs font-semibold text-slate-400">
            {activeItems.length} 筆
          </span>
        </div>

        {activeItems.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-200 bg-white px-4 py-10 text-center text-sm text-slate-400">
            這個資料夾目前沒有資訊
          </div>
        ) : (
          activeItems.map((item) => (
            <article
              key={item.id}
              className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="mb-2 flex items-start gap-2">
                <FileText className="mt-0.5 text-stone-500" size={18} />
                <h4 className="text-base font-bold leading-snug text-slate-800">
                  {item.title}
                </h4>
              </div>
              <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600">
                {item.content}
              </p>
            </article>
          ))
        )}
      </div>
    </section>
  );
};
