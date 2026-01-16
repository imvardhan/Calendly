import { createContext, useContext, useState, useEffect } from "react";

const MeetingsContext = createContext(null);

export function MeetingsProvider({ children }) {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load meetings from backend on mount
  useEffect(() => {
    const loadMeetings = async () => {
      try {
        const response = await fetch("https://calendly-f18f.onrender.com/api/bookings/all");
        if (response.ok) {
          const data = await response.json();
          // Convert backend format to frontend format
          const formattedMeetings = data.map((booking) => ({
            id: booking.id,
            invitee: booking.invitee_name,
            email: booking.invitee_email,
            eventType: booking.event_type_name,
            date: booking.date,
            start: booking.start_time,
            end: booking.end_time,
            location: booking.location || "Google Meet",
          }));
          setMeetings(formattedMeetings);
        }
      } catch (err) {
        console.error("Failed to load meetings:", err);
      } finally {
        setLoading(false);
      }
    };

    loadMeetings();
  }, []);

  const addMeeting = (meeting) => {
    setMeetings((prev) => [...prev, meeting]);
  };

  const removeMeeting = (id) => {
    setMeetings((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <MeetingsContext.Provider
      value={{ meetings, addMeeting, removeMeeting, loading }}
    >
      {children}
    </MeetingsContext.Provider>
  );
}

export function useMeetings() {
  const context = useContext(MeetingsContext);
  if (!context) {
    throw new Error("useMeetings must be used inside MeetingsProvider");
  }
  return context;
}
