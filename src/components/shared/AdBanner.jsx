import { useEffect, useRef } from "react";

// Replace with your real AdSense publisher ID: ca-pub-XXXXXXXXXXXXXXXXX
const PUBLISHER_ID = "ca-pub-XXXXXXXXXXXXXXXXX";

const AD_SLOTS = {
  // Horizontal banner — use between content sections
  horizontal: "XXXXXXXXXX",
  // Rectangle — use in sidebars or after lessons
  rectangle: "XXXXXXXXXX",
  // In-feed — use between list items
  infeed: "XXXXXXXXXX",
};

/**
 * @param {"horizontal"|"rectangle"|"infeed"} slot
 * @param {string} [className]
 */
export default function AdBanner({ slot = "horizontal", className = "" }) {
  const adRef = useRef(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    try {
      if (window.adsbygoogle && adRef.current) {
        window.adsbygoogle.push({});
        pushed.current = true;
      }
    } catch (e) {
      // AdSense not loaded yet or blocked by ad-blocker
    }
  }, []);

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
        data-ad-slot={AD_SLOTS[slot]}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
