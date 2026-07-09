import { useEffect, useMemo, useState } from "react";
import {
  FileText,
  FolderOpen,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";

import type { Folder, OtherInfoItem } from "../types";
import {
  createOtherInfoItem,
  deleteOtherInfoItem,
  getFolders,
  getItems,
  updateOtherInfoItem,
} from "../services/otherInfoService";
import { getOtherInfoItemsByFolderId } from "../utils/otherInfoUtils";

interface OtherInfoPageProps {
  tripId: string;
  canEdit: boolean;
}

interface OtherInfoFormState {
  folderId: string;
  title: string;
  content: string;
}

const createEmptyForm = (folderId: string): OtherInfoFormState => ({
  folderId,
  title: "",
  content: "",
});

const URL_PATTERN = /(https?:\/\/[^\s]+)/g;

const renderContentWithLinks = (content: string) => {
  return content.split("\n").map((line, lineIndex) => {
    const parts = line.split(URL_PATTERN);

    return (
      <span key={`${line}-${lineIndex}`}>
        {parts.map((part, partIndex) => {
          if (!part.match(URL_PATTERN)) {
            return part;
          }

          return (
            <a
              key={`${part}-${partIndex}`}
              href={part}
              target="_blank"
              rel="noreferrer"
              className="break-all font-semibold text-sky-700 underline decoration-sky-300 underline-offset-2 hover:text-sky-900"
            >
              {part}
            </a>
          );
        })}
        {lineIndex < content.split("\n").length - 1 && <br />}
      </span>
    );
  });
};

export const OtherInfoPage = ({ tripId, canEdit }: OtherInfoPageProps) => {
  const folders = useMemo<Folder[]>(() => getFolders(tripId), [tripId]);
  const [items, setItems] = useState<OtherInfoItem[]>(() => getItems(tripId));
  const [activeFolderId, setActiveFolderId] = useState(() => folders[0]?.id ?? "");
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState<OtherInfoFormState>(() =>
    createEmptyForm(folders[0]?.id ?? ""),
  );

  const activeFolder = folders.find((folder) => folder.id === activeFolderId);
  const activeItems = useMemo(
    () => getOtherInfoItemsByFolderId(items, activeFolderId),
    [items, activeFolderId],
  );

  useEffect(() => {
    setItems(getItems(tripId));
    setActiveFolderId(folders[0]?.id ?? "");
    setEditingItemId(null);
    setIsFormOpen(false);
    setForm(createEmptyForm(folders[0]?.id ?? ""));
  }, [folders, tripId]);

  const openCreateForm = () => {
    setEditingItemId(null);
    setForm(createEmptyForm(activeFolderId));
    setIsFormOpen(true);
  };

  const openEditForm = (item: OtherInfoItem) => {
    setEditingItemId(item.id);
    setForm({
      folderId: item.folderId,
      title: item.title,
      content: item.content,
    });
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setEditingItemId(null);
    setIsFormOpen(false);
    setForm(createEmptyForm(activeFolderId));
  };

  const handleSave = () => {
    const title = form.title.trim();
    const content = form.content.trim();

    if (!title || !content || !form.folderId) {
      return;
    }

    const nextItems = editingItemId
      ? updateOtherInfoItem(tripId, editingItemId, {
          folderId: form.folderId,
          title,
          content,
        })
      : createOtherInfoItem(tripId, form.folderId, title, content);

    setItems(nextItems);
    setActiveFolderId(form.folderId);
    closeForm();
  };

  const handleDelete = (item: OtherInfoItem) => {
    setItems(deleteOtherInfoItem(tripId, item.id));

    if (editingItemId === item.id) {
      closeForm();
    }
  };

  return (
    <section className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Reference
          </p>
          <h2 className="text-2xl font-extrabold text-slate-900">旅行資訊</h2>
        </div>

        {canEdit && (
          <button
            type="button"
            onClick={openCreateForm}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-stone-900 text-white shadow-sm transition-colors hover:bg-stone-700"
            aria-label="新增資訊"
            title="新增資訊"
          >
            <Plus size={18} />
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {folders.map((folder) => {
          const isActive = folder.id === activeFolderId;
          const count = getOtherInfoItemsByFolderId(items, folder.id).length;

          return (
            <button
              key={folder.id}
              type="button"
              onClick={() => {
                setActiveFolderId(folder.id);
                if (!editingItemId) {
                  setForm((currentForm) => ({
                    ...currentForm,
                    folderId: folder.id,
                  }));
                }
              }}
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

      {canEdit && isFormOpen && (
        <div className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-800">
              {editingItemId ? "編輯資訊" : "新增資訊"}
            </h3>
            <button
              type="button"
              onClick={closeForm}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
              aria-label="關閉"
              title="關閉"
            >
              <X size={16} />
            </button>
          </div>

          <div className="space-y-3">
            <select
              value={form.folderId}
              onChange={(event) =>
                setForm((currentForm) => ({
                  ...currentForm,
                  folderId: event.target.value,
                }))
              }
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-stone-500"
            >
              {folders.map((folder) => (
                <option key={folder.id} value={folder.id}>
                  {folder.title}
                </option>
              ))}
            </select>

            <input
              value={form.title}
              onChange={(event) =>
                setForm((currentForm) => ({
                  ...currentForm,
                  title: event.target.value,
                }))
              }
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-stone-500"
              placeholder="標題"
            />

            <textarea
              value={form.content}
              onChange={(event) =>
                setForm((currentForm) => ({
                  ...currentForm,
                  content: event.target.value,
                }))
              }
              className="min-h-32 w-full resize-y rounded-lg border border-slate-200 px-3 py-2 text-sm leading-relaxed text-slate-700 outline-none focus:border-stone-500"
              placeholder="內容"
            />

            <button
              type="button"
              onClick={handleSave}
              disabled={!form.title.trim() || !form.content.trim()}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-stone-900 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-stone-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              <Save size={16} />
              儲存
            </button>
          </div>
        </div>
      )}

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
              <div className="mb-2 flex items-start justify-between gap-3">
                <div className="flex items-start gap-2">
                  <FileText className="mt-0.5 text-stone-500" size={18} />
                  <h4 className="text-base font-bold leading-snug text-slate-800">
                    {item.title}
                  </h4>
                </div>

                {canEdit && (
                  <div className="flex shrink-0 gap-1">
                    <button
                      type="button"
                      onClick={() => openEditForm(item)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                      aria-label="編輯"
                      title="編輯"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-rose-50 hover:text-rose-700"
                      aria-label="刪除"
                      title="刪除"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                )}
              </div>
              <div className="text-sm leading-relaxed text-slate-600">
                {renderContentWithLinks(item.content)}
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
};
