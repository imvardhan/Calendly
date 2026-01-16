import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEventBySlug } from "../../services/eventsApi";
import TimeSlots from "./TimeSlots";

export default function BookingCalendar({ onSelectDateTime }) {
  const { slug } = useParams();
  const [event, setEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Fetch event by slug
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const data = await getEventBySlug(slug);
        setEvent(data);
      } catch (err) {
        setError("Failed to load event details");
        console.error("Event fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchEvent();
  }, [slug]);

  // Notify parent component when date/time changes
  useEffect(() => {
    if (onSelectDateTime) {
      onSelectDateTime({ date: selectedDate, time: selectedTime });
    }
  }, [selectedDate, selectedTime, onSelectDateTime]);

  const handleSelectDate = (day) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const formattedDate = date.toISOString().split("T")[0];
    setSelectedDate(formattedDate);
    setSelectedTime(null); // Reset time when date changes
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  if (loading) {
    return (
      <div className="w-1/2 p-10 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-1/2 p-10">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="w-1/2 p-10">
        <p className="text-gray-500">Event not found</p>
      </div>
    );
  }

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days = [];

  // Add empty slots for days before month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Add days of month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const monthName = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const isToday = (day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    );
  };

  const isPast = (day) => {
    const today = new Date();
    const checkDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return checkDate < today && !isToday(day);
  };

  return (
    <div className="w-1/2 p-10">
      <h2 className="text-lg font-semibold mb-2">Select a time to book</h2>
      <p className="text-sm text-gray-500 mb-6">Time zone: Eastern Time – US & Canada</p>

      {/* Calendar */}
      <div className="border rounded-lg p-4 bg-white">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handlePrevMonth}
            className="px-2 py-1 rounded hover:bg-gray-100"
          >
            ← Prev
          </button>
          <h3 className="font-semibold">{monthName}</h3>
          <button
            onClick={handleNextMonth}
            className="px-2 py-1 rounded hover:bg-gray-100"
          >
            Next →
          </button>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center text-xs font-semibold text-gray-600">
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, i) => (
            <button
              key={i}
              onClick={() => day && handleSelectDate(day)}
              disabled={!day || isPast(day)}
              className={`
                p-2 rounded text-sm font-medium transition
                ${!day ? "invisible" : ""}
                ${isPast(day) ? "bg-gray-100 text-gray-400 cursor-not-allowed" : ""}
                ${isToday(day) ? "bg-blue-100 border-2 border-blue-600 text-blue-600" : ""}
                ${
                  selectedDate === `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
                    ? "bg-blue-600 text-white"
                    : !isPast(day)
                    ? "border border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                    : ""
                }
              `}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Time Slots */}
      {selectedDate && (
        <div className="mt-8">
          <TimeSlots
            event={event}
            selectedDate={selectedDate}
            onSelectTime={setSelectedTime}
          />
        </div>
      )}
    </div>
  );
}
