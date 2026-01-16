import { createContext, useContext, useState } from "react";

const AvailabilityContext = createContext(null);

const DEFAULT_AVAILABILITY = {
  timezone: "Eastern Time - US & Canada",
  days: {
    monday: { enabled: true, start: "09:00", end: "17:00" },
    tuesday: { enabled: true, start: "09:00", end: "17:00" },
    wednesday: { enabled: true, start: "09:00", end: "17:00" },
    thursday: { enabled: true, start: "09:00", end: "17:00" },
    friday: { enabled: true, start: "09:00", end: "17:00" },
    saturday: { enabled: false },
    sunday: { enabled: false },
  },
};

export function AvailabilityProvider({ children }) {
  const [availability, setAvailability] = useState(DEFAULT_AVAILABILITY);

  const updateDay = (day, data) => {
    setAvailability((prev) => ({
      ...prev,
      days: {
        ...prev.days,
        [day]: { ...prev.days[day], ...data },
      },
    }));
  };

  const updateTimezone = (timezone) => {
    setAvailability((prev) => ({ ...prev, timezone }));
  };

  return (
    <AvailabilityContext.Provider
      value={{ availability, updateDay, updateTimezone }}
    >
      {children}
    </AvailabilityContext.Provider>
  );
}

export function useAvailability() {
  const context = useContext(AvailabilityContext);
  if (!context) {
    throw new Error(
      "useAvailability must be used inside AvailabilityProvider"
    );
  }
  return context;
}
