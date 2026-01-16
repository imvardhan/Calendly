import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMeetings } from "../context/MeetingsContext";

export default function BookingPage() {
  const navigate = useNavigate();
  const { addMeeting } = useMeetings();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleBookMeeting = () => {
    if (!name || !email) {
      alert("Please enter name and email");
      return;
    }

    // Save meeting (frontend mock – backend later)
    addMeeting({
      id: Date.now(),
      invitee: name,
      email,
      eventType: "30 Minute Meeting",
      start: "9:00 am",
      end: "9:30 am",
      date: "Friday, 16 January 2026",
    });

    // Redirect to Meetings page
    navigate("/meetings");
  };

  return (
    <div className="flex h-screen bg-white">
      {/* LEFT: Meeting details + form */}
      <div className="w-1/2 p-8 border-r">
        <p className="text-sm text-gray-500 mb-1">Meeting Details</p>

        <h2 className="text-xl font-semibold mb-4">
          30 Minute Meeting
        </h2>

        <div className="space-y-3 text-sm text-gray-600 mb-6">
          <div>🕒 30 min</div>
          <div>📹 Google Meet web conference</div>
          <div>👤 Megha Vardhan Mirthipati (EST)</div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-md px-3 py-2"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-md px-3 py-2"
              placeholder="you@example.com"
            />
          </div>

          <button className="text-blue-600 text-sm">
            + Add guests
          </button>

          <button
            onClick={handleBookMeeting}
            className="w-full bg-blue-600 text-white py-3 rounded-lg mt-4"
          >
            Book meeting
          </button>
        </div>
      </div>

      {/* RIGHT: Calendar placeholder */}
      <div className="w-1/2 p-8">
        <h2 className="text-lg font-semibold mb-2">
          Select a time to book
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Time zone: Eastern Time – US & Canada
        </p>

        {/* Calendar will go here later */}
        <div className="text-gray-400 text-sm">
          Calendar UI coming next
        </div>
      </div>
    </div>
  );
}
