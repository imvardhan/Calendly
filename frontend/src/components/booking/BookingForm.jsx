import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMeetings } from "../../context/MeetingsContext";

export default function BookingForm({ event, selectedDate, selectedTime }) {
  const navigate = useNavigate();
  const { addMeeting } = useMeetings();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Calculate end time based on duration
  const calculateEndTime = (startTime, durationMinutes) => {
    const [hours, minutes] = startTime.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes + durationMinutes;
    const endHours = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;
    return `${String(endHours).padStart(2, "0")}:${String(endMinutes).padStart(
      2,
      "0"
    )}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Validate inputs
      if (!name.trim() || !email.trim()) {
        throw new Error("Please fill in all fields");
      }

      if (!selectedDate || !selectedTime) {
        throw new Error("Please select a date and time");
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error("Please enter a valid email address");
      }

      // Calculate end time
      const endTime = calculateEndTime(selectedTime, event.duration);

      // Prepare booking data
      const bookingData = {
        eventTypeId: event.id,
        inviteeName: name,
        inviteeEmail: email,
        date: selectedDate,
        startTime: selectedTime,
        endTime: endTime,
      };

      console.log("Submitting booking:", bookingData);

      // Create booking via backend
      const response = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error: ${response.status}`);
      }

      const booking = await response.json();
      console.log("Booking created:", booking);

      // Add to meetings context (for frontend display)
      addMeeting({
        id: booking.id,
        invitee: name,
        email,
        eventType: event.name,
        start: selectedTime,
        end: endTime,
        date: selectedDate,
      });

      setSuccess(true);

      // Redirect to meetings page after 1 second
      setTimeout(() => {
        navigate("/meetings");
      }, 1000);
    } catch (err) {
      setError(err.message);
      console.error("Booking error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Meeting Details */}
      <div>
        <p className="text-sm text-gray-500 mb-1">Meeting Details</p>
        <h2 className="text-2xl font-semibold mb-6">{event.name}</h2>

        <div className="space-y-3 text-sm text-gray-600 mb-8">
          <div>🕒 {event.duration} min</div>
          <div>📍 {event.location}</div>
          {selectedDate && selectedTime && (
            <>
              <div>📅 {selectedDate}</div>
              <div>
                🕐 {selectedTime} -{" "}
                {calculateEndTime(selectedTime, event.duration)}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Form Fields */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Name *
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          placeholder="Your name"
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email *
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          placeholder="you@example.com"
          disabled={loading}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            ✓ Booking confirmed! Redirecting...
          </p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || success || !selectedDate || !selectedTime}
        className={`w-full py-3 rounded-lg font-medium transition ${
          loading
            ? "bg-gray-400 text-white cursor-not-allowed"
            : success
            ? "bg-green-600 text-white"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        {loading ? "Booking..." : success ? "✓ Booking Confirmed" : "Book meeting"}
      </button>

      <button type="button" className="text-blue-600 text-sm w-full hover:underline">
        + Add guests
      </button>
    </form>
  );
}
