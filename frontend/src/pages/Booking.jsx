import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BookingDetails from "../components/booking/BookingDetails";
import BookingCalendar from "../components/booking/BookingCalendar";
import { getEventBySlug } from "../services/eventsApi";

export default function Booking() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null); // YYYY-MM-DD
  const [selectedTime, setSelectedTime] = useState(null); // HH:mm
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch event by slug
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const data = await getEventBySlug(slug);
        setEvent(data);
      } catch (err) {
        setError("Event not found");
        console.error("Event fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchEvent();
  }, [slug]);

  const handleSelectDateTime = ({ date, time }) => {
    setSelectedDate(date);
    setSelectedTime(time);
  };

  const handleClose = () => navigate("/scheduling");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
        <div className="bg-white p-8 rounded-lg border border-red-200 max-w-md text-center">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Event Not Found</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleClose}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!event) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-8">
      <div className="relative bg-white w-full max-w-6xl rounded-2xl shadow-lg flex overflow-hidden">
        {/* Close button */}
        <button
          onClick={handleClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 h-10 w-10 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition"
        >
          ✕
        </button>

        {/* LEFT — FORM & DETAILS */}
        <BookingDetails 
          slug={slug} 
          selectedDate={selectedDate}
          selectedTime={selectedTime}
        />

        {/* Divider */}
        <div className="w-px bg-gray-200" />

        {/* RIGHT — CALENDAR */}
        <BookingCalendar onSelectDateTime={handleSelectDateTime} />
      </div>
    </div>
  );
}
