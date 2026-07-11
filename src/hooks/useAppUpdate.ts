import { useCallback, useEffect, useRef, useState } from "react";
import { registerSW } from "virtual:pwa-register";

import { APP_VERSION, RELEASE_NOTES } from "../config/appVersion";

type UpdateServiceWorker = (reloadPage?: boolean) => Promise<void>;

export const useAppUpdate = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const dismissedRef = useRef(false);
  const updateServiceWorkerRef = useRef<UpdateServiceWorker | null>(null);

  useEffect(() => {
    updateServiceWorkerRef.current = registerSW({
      immediate: true,
      onNeedRefresh() {
        if (!dismissedRef.current) {
          setUpdateAvailable(true);
        }
      },
      onNeedReload() {
        window.location.reload();
      },
      onRegisterError(error: unknown) {
        console.warn("PWA Service Worker registration failed.", error);
      },
    });
  }, []);

  const update = useCallback(() => {
    void updateServiceWorkerRef.current?.(true);
  }, []);

  const dismiss = useCallback(() => {
    dismissedRef.current = true;
    setUpdateAvailable(false);
  }, []);

  return {
    updateAvailable,
    currentVersion: APP_VERSION,
    latestVersion: APP_VERSION,
    releaseNotes: RELEASE_NOTES,
    update,
    dismiss,
  };
};
