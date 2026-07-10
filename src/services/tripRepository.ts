import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  SidebarItemConfig,
  TripDetail,
  TripEditorInput,
  TripMeta,
} from "../types";
import {
  readStoredTripRecords,
  upsertStoredTripRecord,
  type StoredTripRecord,
} from "../storage/tripStorage";
import {
  getCloudTripRecords,
  upsertCloudTripRecord,
} from "./tripCloudService";
import { sortTripsByDateDesc } from "../utils/tripHelpers";

const DEFAULT_SIDEBAR_CONFIG: SidebarItemConfig[] = [
  { id: "itinerary", title: "每日詳細行程", type: "itinerary" },
  { id: "checklist", title: "共同檢查清單", type: "checklist" },
  { id: "other_info", title: "其他資訊", type: "otherInfo" },
  { id: "expense", title: "旅費記帳本", type: "expense" },
];

const toSlug = (value: string): string => {
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || "trip";
};

const createTripId = (title: string, departureDate: string): string => {
  const suffix = Date.now().toString(36);
  return `${toSlug(title)}-${departureDate}-${suffix}`;
};

const createDays = (dayCount: number): number[] => {
  return Array.from({ length: dayCount }, (_, index) => index + 1);
};

const createEmptyDaysData = (days: number[]): TripDetail["content"]["daysData"] => {
  return days.reduce<TripDetail["content"]["daysData"]>((result, day) => {
    result[String(day)] = [];
    return result;
  }, {});
};

const normalizeEmails = (emails: string[]): string[] => {
  return Array.from(
    new Set(
      emails
        .map((email) => email.trim().toLowerCase())
        .filter((email) => email.includes("@")),
    ),
  );
};

const fetchJson = async <T>(url: string): Promise<T | null> => {
  const response = await fetch(url);
  if (!response.ok) return null;

  return (await response.json()) as T;
};

const mergeTripRecords = (
  seedTrips: TripMeta[],
  cloudRecords: StoredTripRecord[],
  storedRecords: StoredTripRecord[],
): TripMeta[] => {
  const recordsById = new Map<string, TripMeta>();
  const latestRecordsById = new Map<string, StoredTripRecord>();

  for (const trip of seedTrips) {
    recordsById.set(trip.id, trip);
  }

  for (const record of [...cloudRecords, ...storedRecords]) {
    const currentRecord = latestRecordsById.get(record.meta.id);
    if (!currentRecord || isNewerRecord(record, currentRecord)) {
      latestRecordsById.set(record.meta.id, record);
    }
  }

  for (const record of latestRecordsById.values()) {
    recordsById.set(record.meta.id, record.meta);
  }

  return sortTripsByDateDesc(Array.from(recordsById.values()));
};

const isNewerRecord = (
  candidate: StoredTripRecord,
  current: StoredTripRecord,
): boolean => {
  return new Date(candidate.updatedAt).getTime() >= new Date(current.updatedAt).getTime();
};

const chooseLatestRecord = (
  records: Array<StoredTripRecord | undefined>,
): StoredTripRecord | null => {
  return records.reduce<StoredTripRecord | null>((latestRecord, record) => {
    if (!record) return latestRecord;
    if (!latestRecord || isNewerRecord(record, latestRecord)) return record;
    return latestRecord;
  }, null);
};

export const getTripMetas = async (
  supabase: SupabaseClient,
  basePath: string,
): Promise<TripMeta[]> => {
  const seedUrl = `${basePath}trips/list.json`.replace(/\/+/g, "/");
  const seedTrips = (await fetchJson<TripMeta[]>(seedUrl)) ?? [];
  const cloudRecords = await getCloudTripRecords(supabase);
  const storedRecords = readStoredTripRecords();

  return mergeTripRecords(seedTrips, cloudRecords, storedRecords);
};

export const getTripDetail = async (
  supabase: SupabaseClient,
  basePath: string,
  tripId: string,
  selectedTripMeta?: TripMeta,
): Promise<TripDetail | null> => {
  const storedTrip = readStoredTripRecords().find(
    (record) => record.meta.id === tripId,
  );
  const cloudTrip = (await getCloudTripRecords(supabase)).find(
    (record) => record.meta.id === tripId,
  );
  const latestRecord = chooseLatestRecord([cloudTrip, storedTrip]);
  if (latestRecord) return latestRecord.detail;

  const detailPath = selectedTripMeta?.detailPath || `/trips/${tripId}.json`;
  const url = `${basePath}${detailPath.replace(/^\//, "")}`.replace(/\/+/g, "/");
  return fetchJson<TripDetail>(url);
};

export const createTripRecord = (input: TripEditorInput): StoredTripRecord => {
  const id = createTripId(input.title, input.departureDate);
  const days = createDays(input.dayCount);
  const editorEmails = normalizeEmails(input.editorEmails);
  const meta: TripMeta = {
    id,
    title: input.title.trim(),
    departureDate: input.departureDate,
    participants: input.participants.map((item) => item.trim()).filter(Boolean),
    currencyConfig: {
      code: input.currencyCode.trim().toUpperCase(),
      symbol: input.currencySymbol.trim(),
    },
  };
  const detail: TripDetail = {
    id,
    title: meta.title,
    departureDate: meta.departureDate,
    isPublic: true,
    sidebarConfig: DEFAULT_SIDEBAR_CONFIG,
    content: {
      days,
      custom_tab_1: {
        subtitle: "旅程備忘錄",
        mainText: "",
      },
      checklistData: [],
      daysData: createEmptyDaysData(days),
    },
  };

  return {
    meta,
    detail,
    editorEmails,
    updatedAt: new Date().toISOString(),
  };
};

export const updateTripRecord = (
  tripId: string,
  input: TripEditorInput,
): StoredTripRecord | null => {
  const currentRecord = readStoredTripRecords().find(
    (record) => record.meta.id === tripId,
  );
  if (!currentRecord) return null;

  const days = createDays(input.dayCount);
  const currentDaysData = currentRecord.detail.content.daysData;
  const nextDaysData = days.reduce<TripDetail["content"]["daysData"]>(
    (result, day) => {
      result[String(day)] = currentDaysData[String(day)] ?? [];
      return result;
    },
    {},
  );
  const meta: TripMeta = {
    ...currentRecord.meta,
    title: input.title.trim(),
    departureDate: input.departureDate,
    participants: input.participants.map((item) => item.trim()).filter(Boolean),
    currencyConfig: {
      code: input.currencyCode.trim().toUpperCase(),
      symbol: input.currencySymbol.trim(),
    },
  };
  const detail: TripDetail = {
    ...currentRecord.detail,
    title: meta.title,
    departureDate: meta.departureDate,
    content: {
      ...currentRecord.detail.content,
      days,
      daysData: nextDaysData,
    },
  };

  return {
    meta,
    detail,
    editorEmails: normalizeEmails(input.editorEmails),
    updatedAt: new Date().toISOString(),
  };
};

export const createTripRecordFromExisting = (
  meta: TripMeta,
  detail: TripDetail,
  input: TripEditorInput,
): StoredTripRecord => {
  const days = createDays(input.dayCount);
  const nextDaysData = days.reduce<TripDetail["content"]["daysData"]>(
    (result, day) => {
      result[String(day)] = detail.content.daysData[String(day)] ?? [];
      return result;
    },
    {},
  );
  const nextMeta: TripMeta = {
    ...meta,
    title: input.title.trim(),
    departureDate: input.departureDate,
    participants: input.participants.map((item) => item.trim()).filter(Boolean),
    currencyConfig: {
      code: input.currencyCode.trim().toUpperCase(),
      symbol: input.currencySymbol.trim(),
    },
  };
  const nextDetail: TripDetail = {
    ...detail,
    title: nextMeta.title,
    departureDate: nextMeta.departureDate,
    content: {
      ...detail.content,
      days,
      daysData: nextDaysData,
    },
  };

  return {
    meta: nextMeta,
    detail: nextDetail,
    editorEmails: normalizeEmails(input.editorEmails),
    updatedAt: new Date().toISOString(),
  };
};

export const saveTripRecord = (record: StoredTripRecord): TripMeta[] => {
  const storedRecords = upsertStoredTripRecord(record);
  return sortTripsByDateDesc(storedRecords.map((item) => item.meta));
};

export const saveTripRecordWithCloudSync = async (
  supabase: SupabaseClient,
  record: StoredTripRecord,
): Promise<void> => {
  saveTripRecord(record);
  const syncedRecord = await upsertCloudTripRecord(supabase, record);
  if (syncedRecord) {
    upsertStoredTripRecord({
      ...syncedRecord,
      editorEmails: record.editorEmails,
    });
  }
};

export const getStoredTripEditorEmails = (tripId: string): string[] => {
  return (
    readStoredTripRecords().find((record) => record.meta.id === tripId)
      ?.editorEmails ?? []
  );
};

export const getTripEditorEmails = async (
  supabase: SupabaseClient,
  tripId: string,
): Promise<string[]> => {
  const localEmails = getStoredTripEditorEmails(tripId);

  if (!navigator.onLine) return localEmails;

  const { data, error } = await supabase
    .from("admin_users")
    .select("email")
    .eq("role", "trip_editor")
    .eq("trip_id", tripId);

  if (error) {
    console.warn("Failed to load trip editors", error);
    return localEmails;
  }

  return normalizeEmails([
    ...localEmails,
    ...((data ?? []) as Array<{ email: string }>).map((row) => row.email),
  ]);
};

export const syncTripEditorEmails = async (
  supabase: SupabaseClient,
  tripId: string,
  editorEmails: string[],
): Promise<void> => {
  if (!navigator.onLine) return;

  const normalizedEmails = normalizeEmails(editorEmails);
  const rows = normalizedEmails.map((email) => ({
    email,
    role: "trip_editor",
    trip_id: tripId,
  }));

  const { data: existingRows, error: selectError } = await supabase
    .from("admin_users")
    .select("email")
    .eq("role", "trip_editor")
    .eq("trip_id", tripId);

  if (selectError) {
    console.warn("Failed to load trip editors before sync", selectError);
    return;
  }

  const nextEmailSet = new Set(normalizedEmails);
  const removedEmails = ((existingRows ?? []) as Array<{ email: string }>)
    .map((row) => row.email)
    .filter((email) => !nextEmailSet.has(email));

  if (removedEmails.length > 0) {
    const { error: deleteError } = await supabase
      .from("admin_users")
      .delete()
      .eq("role", "trip_editor")
      .eq("trip_id", tripId)
      .in("email", removedEmails);

    if (deleteError) {
      console.warn("Failed to remove trip editors", deleteError);
    }
  }

  if (rows.length === 0) return;

  const { error: upsertError } = await supabase.from("admin_users").upsert(rows, {
    onConflict: "email,role,trip_id",
  });

  if (upsertError) {
    console.warn("Failed to sync trip editors", upsertError);
  }
};
