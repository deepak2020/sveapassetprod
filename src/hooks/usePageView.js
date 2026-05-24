import { useEffect } from "react";
import { base44 } from "@/api/base44Client";

export function usePageView(page, properties = {}) {
  useEffect(() => {
    base44.analytics.track({
      eventName: "page_viewed",
      properties: { page, ...properties },
    });
  }, [page]);
}
