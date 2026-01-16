import { useEffect, useState } from "react";
import BookingForm from "./BookingForm";
import { getEventBySlug } from "../../services/eventsApi";

export default function BookingDetails({ slug, selectedDate, selectedTime }) {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch event details
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const data = await getEventBySlug(slug);
        setEvent(data);
      } catch (err) {
        setError("Failed to load event");
        console.error("Event fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchEvent();
  }, [slug]);

  if (loading) {
    return (
      <div className="w-1/2 p-10 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="w-1/2 p-10">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-1/2 p-10">
      <BookingForm
        event={event}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
      />
    </div>
  );
}
