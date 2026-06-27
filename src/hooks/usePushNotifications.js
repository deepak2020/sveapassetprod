import { useEffect, useState, useCallback } from "react";
import { base44 } from "@/api/base44Client";

// VAPID public key returned by the backend is base64url-encoded.
// Push API needs it as a Uint8Array.
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
  return outputArray;
}

function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

export function usePushNotifications() {
  const [supported, setSupported] = useState(false);
  const [permission, setPermission] = useState("default");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Detect support + register SW + check current subscription state
  useEffect(() => {
    const isSupported =
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      "PushManager" in window &&
      "Notification" in window;
    setSupported(isSupported);
    if (!isSupported) return;

    setPermission(Notification.permission);

    (async () => {
      try {
        const reg = await navigator.serviceWorker.register("/sw.js");
        const existing = await reg.pushManager.getSubscription();
        setSubscribed(!!existing);
      } catch (e) {
        // SW registration can fail in some dev/preview environments — non-fatal
        console.warn("[push] SW register failed:", e?.message);
      }
    })();
  }, []);

  const subscribe = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        throw new Error("Push notifications are not supported in this browser.");
      }

      // Ask permission
      const perm = await Notification.requestPermission();
      setPermission(perm);
      if (perm !== "granted") {
        throw new Error(perm === "denied"
          ? "Permission was blocked. Enable notifications in your browser settings."
          : "Permission was not granted."
        );
      }

      // Fetch public VAPID key
      const { data } = await base44.functions.invoke("getVapidPublicKey", {});
      if (!data?.publicKey) throw new Error("Missing VAPID public key");

      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(data.publicKey),
      });

      const json = sub.toJSON();
      await base44.functions.invoke("savePushSubscription", {
        endpoint: sub.endpoint,
        p256dh: json.keys?.p256dh || arrayBufferToBase64(sub.getKey("p256dh")),
        auth: json.keys?.auth || arrayBufferToBase64(sub.getKey("auth")),
        user_agent: navigator.userAgent,
      });
      setSubscribed(true);
      base44.analytics.track({ eventName: "push_opt_in_success" });
      return true;
    } catch (e) {
      setError(e.message || "Could not enable notifications.");
      base44.analytics.track({ eventName: "push_opt_in_error", properties: { message: e.message?.slice(0, 80) || "" } });
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const unsubscribe = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await base44.functions.invoke("deletePushSubscription", { endpoint: sub.endpoint });
        await sub.unsubscribe();
      }
      setSubscribed(false);
      base44.analytics.track({ eventName: "push_opt_out" });
    } catch (e) {
      setError(e.message || "Could not disable notifications.");
    } finally {
      setLoading(false);
    }
  }, []);

  return { supported, permission, subscribed, loading, error, subscribe, unsubscribe };
}