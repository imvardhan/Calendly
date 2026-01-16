import { useState, useEffect } from "react";

const DAYS_OF_WEEK = [
  { key: "monday", label: "M", name: "Monday" },
  { key: "tuesday", label: "T", name: "Tuesday" },
  { key: "wednesday", label: "W", name: "Wednesday" },
  { key: "thursday", label: "T", name: "Thursday" },
  { key: "friday", label: "F", name: "Friday" },
  { key: "saturday", label: "S", name: "Saturday" },
  { key: "sunday", label: "S", name: "Sunday" },
];

const TIMEZONES = [
  "Eastern Time - US & Canada",
  "Central Time - US & Canada",
  "Mountain Time - US & Canada",
  "Pacific Time - US & Canada",
  "London",
  "Paris",
  "Tokyo",
];

export default function Availability() {
  const [timezone, setTimezone] = useState("Eastern Time - US & Canada");
  const [availability, setAvailability] = useState({
    monday: { enabled: true, startTime: "09:00", endTime: "17:00" },
    tuesday: { enabled: true, startTime: "09:00", endTime: "17:00" },
    wednesday: { enabled: true, startTime: "09:00", endTime: "17:00" },
    thursday: { enabled: true, startTime: "09:00", endTime: "17:00" },
    friday: { enabled: true, startTime: "09:00", endTime: "17:00" },
    saturday: { enabled: false, startTime: "", endTime: "" },
    sunday: { enabled: false, startTime: "", endTime: "" },
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [eventTypeId, setEventTypeId] = useState(null);
  const [error, setError] = useState("");

  // Load event type and availability on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch("https://calendly-f18f.onrender.comapi/events");
        const events = await response.json();
        if (events && events.length > 0) {
          const id = events[0].id;
          setEventTypeId(id);
          await loadAvailability(id);
        } else {
          setError("No event type selected");
        }
      } catch (err) {
        console.error("Failed to fetch event types:", err);
        setError("Failed to load event types. Make sure the backend is running.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const loadAvailability = async (id) => {
    try {
      const response = await fetch(
        `https://calendly-f18f.onrender.com/api/availability/${id}/settings`
      );
      if (response.ok) {
        const data = await response.json();
        // Build availability object from response
        const newAvailability = { ...availability };
        if (data.days) {
          Object.entries(data.days).forEach(([day, info]) => {
            newAvailability[day] = {
              enabled: info.enabled || false,
              startTime: info.start_time || "09:00",
              endTime: info.end_time || "17:00",
            };
          });
          setAvailability(newAvailability);
        }
      }
    } catch (err) {
      console.error("Failed to load availability:", err);
      // Use default if endpoint doesn't exist yet
    }
  };

  const handleTimeChange = (day, field, value) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  };

  const handleRemoveDay = (day) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        enabled: false,
        startTime: "",
        endTime: "",
      },
    }));
  };

  const handleAddHours = (day) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        enabled: true,
        startTime: "09:00",
        endTime: "17:00",
      },
    }));
  };

  const handleSave = async () => {
    if (!eventTypeId) {
      setError("No event type selected");
      return;
    }

    setSaving(true);
    setError("");
    setSaved(false);

    try {
      const response = await fetch(
        `https://calendly-f18f.onrender.com/api/availability/${eventTypeId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            days: Object.fromEntries(
              Object.entries(availability).map(([day, data]) => [
                day,
                {
                  enabled: data.enabled,
                  start: data.enabled ? data.startTime : null,
                  end: data.enabled ? data.endTime : null,
                },
              ])
            ),
          }),
        }
      );

      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to save availability");
      }
    } catch (err) {
      console.error("Error saving availability:", err);
      setError("Error saving availability");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-8 bg-white flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 bg-white">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Availability</h1>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {saved && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800 font-medium">
            ✓ Availability saved successfully
          </p>
        </div>
      )}

      {/* Timezone Section */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Time zone
        </label>
        <select
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {TIMEZONES.map((tz) => (
            <option key={tz} value={tz}>
              {tz}
            </option>
          ))}
        </select>
      </div>

      {/* Days of Week */}
      <div className="space-y-4">
        {DAYS_OF_WEEK.map(({ key, label, name }) => {
          const dayData = availability[key];
          const isEnabled = dayData.enabled;

          return (
            <div
              key={key}
              className={`flex items-center gap-4 p-4 border rounded-lg transition ${
                isEnabled
                  ? "border-gray-200 hover:bg-gray-50"
                  : "border-gray-100 bg-gray-50"
              }`}
            >
              {/* Day Badge */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold shrink-0 ${
                  isEnabled ? "bg-blue-500" : "bg-gray-300"
                }`}
              >
                {label}
              </div>

              {/* Day Name */}
              <div className="min-w-24">
                <p className="font-medium text-gray-900">{name}</p>
              </div>

              {/* Time Inputs (only show if enabled) */}
              {isEnabled && (
                <div className="flex items-center gap-4 flex-1">
                  <input
                    type="time"
                    value={dayData.startTime}
                    onChange={(e) =>
                      handleTimeChange(key, "startTime", e.target.value)
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <span className="text-gray-500">−</span>
                  <input
                    type="time"
                    value={dayData.endTime}
                    onChange={(e) =>
                      handleTimeChange(key, "endTime", e.target.value)
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveDay(key)}
                    className="ml-auto text-gray-400 hover:text-gray-600 text-xl transition"
                    title="Remove availability"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Add Hours Button (only show if disabled) */}
              {!isEnabled && (
                <button
                  onClick={() => handleAddHours(key)}
                  className="ml-auto text-blue-600 hover:text-blue-700 font-medium text-sm transition"
                >
                  + Add hours
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Save Button */}
      <div className="mt-8">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
