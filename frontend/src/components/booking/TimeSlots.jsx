import { useState, useEffect } from "react";
import { getAvailableSlots, getBookedSlots } from "../../services/eventsApi";

export default function TimeSlots({ event, selectedDate, onSelectTime }) {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedTime, setSelectedTime] = useState(null);

  useEffect(() => {
    if (!selectedDate || !event) return;

    const fetchSlots = async () => {
      setLoading(true);
      setError("");
      try {
        // Fetch available slots from backend
        const response = await fetch(
          `http://localhost:5000/api/availability/${event.id}?date=${selectedDate}`
        );
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch slots");
        }

        const data = await response.json();
        console.log("Available slots response:", data);
        
        setSlots(data.availableSlots || []);

        if (!data.availableSlots || data.availableSlots.length === 0) {
          setError("No available slots for this date. Please set up availability hours first.");
        }
      } catch (err) {
        setError(err.message || "Failed to fetch available slots");
        console.error("Slot fetch error details:", err);
        setSlots([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [selectedDate, event]);

  const handleSelectSlot = (time) => {
    setSelectedTime(time);
    onSelectTime(time);
  };

  if (!selectedDate) {
    return (
      <div className="text-gray-400 text-sm">
        Select a date to see available times
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-sm text-red-800">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-600 mb-3">Available times:</p>
      <div className="grid grid-cols-3 gap-2">
        {slots.length > 0 ? (
          slots.map((time) => (
            <button
              key={time}
              onClick={() => handleSelectSlot(time)}
              className={`rounded-lg border py-2 px-3 text-sm font-medium transition ${
                selectedTime === time
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
              }`}
            >
              {time}
            </button>
          ))
        ) : (
          <p className="text-sm text-gray-500 col-span-3">No slots available</p>
        )}
      </div>
    </div>
  );
}
