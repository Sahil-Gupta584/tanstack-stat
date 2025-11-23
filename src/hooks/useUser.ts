import { useEffect, useState } from "react";

export const useTimeZones = () => {
  const [timeZones, setTimeZones] = useState<
    {
      value: string;
      label: string;
    }[]
  >([]);

  useEffect(() => {
    const updateTimeZones = () => {
      const now = new Date();
      const zones = Intl.supportedValuesOf("timeZone").map(
        (timeZone: string) => {
          try {
            // Format the time in this timezone
            const timeStr = now.toLocaleTimeString("en-US", {
              timeZone,
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            });

            return {
              value: timeZone,
              label: timeStr,
            };
          } catch {
            return {
              value: timeZone,
              label: timeZone,
            };
          }
        }
      );

      // Sort timezones alphabetically
      zones.sort((a, b) => a.label.localeCompare(b.label));
      setTimeZones(zones);
    };

    // Initial update
    updateTimeZones();

    // Update every minute to keep times current
    const interval = setInterval(updateTimeZones, 60000);

    return () => clearInterval(interval);
  }, []);

  return timeZones;
};
