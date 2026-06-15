import { useEffect, useRef, useState } from "react";

const PUBLISHER_ID = "ca-pub-3746039055875209";

const AD_SLOTS = {
  // Horizontal banner — use between content sections
  horizontal: "XXXXXXXXXX",
  // Rectangle — use in sidebars or after lessons
  rectangle: "XXXXXXXXXX",
  // In-feed — use between list items
  infeed: "XXXXXXXXXX",
};

// A slot is only real once a numeric AdSense slot id is filled in (not the
// "XXXXXXXXXX" placeholder). Until then we render nothing, so the page has no
// empty reserved ad space.
const isConfigured = (slotId) => !!slotId && !/^X+$/i.test(slotId);

/**
 * @param {"horizontal"|"rectangle"|"infeed"} slot
 * @param {string} [className]
 */
export default function AdBanner({ slot = "horizontal", className = "" }) {
  const adRef = useRef(null);
  const pushed = useRef(false);
  const [collapsed, setCollapsed] = useState(false);
  const slotId = AD_SLOTS[slot];

  useEffect(() => {
    if (pushed.current || !isConfigured(slotId)) return;
    try {
      if (window.adsbygoogle && adRef.current) {
        window.adsbygoogle.push({});
        pushed.current = true;
        // If AdSense doesn't serve an ad, collapse so there's no blank gap.
        const t = setTimeout(() => {
          if (adRef.current?.getAttribute("data-ad-status") === "unfilled") setCollapsed(true);
        }, 2500);
        return () => clearTimeout(t);
      }
    } catch {
      // AdSense not loaded yet or blocked by an ad-blocker
    }
  }, [slotId]);

  // Not configured (placeholder) or no ad served → take up no space.
  if (!isConfigured(slotId) || collapsed) return null;

  const styles = {
    horizontal: { display: "block", minHeight: 90 },
    rectangle: { display: "block", minHeight: 250 },
    infeed: { display: "block", minHeight: 120 },
  };

  return (
    <div className={`my-4 overflow-hidden ${className}`} aria-label="Advertisement">
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={styles[slot] ?? styles.horizontal}
        data-ad-client={PUBLISHER_ID}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
