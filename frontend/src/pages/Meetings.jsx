import { useState, useMemo } from "react";
import { useMeetings } from "../context/MeetingsContext";

export default function Meetings() {
  const { meetings, removeMeeting } = useMeetings();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [rescheduleMode, setRescheduleMode] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [rescheduleError, setRescheduleError] = useState("");
  const [rescheduleLoading, setRescheduleLoading] = useState(false);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  // Filter meetings by tab
  const filteredMeetings = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return meetings.filter((meeting) => {
      const meetingDate = new Date(meeting.date);
      meetingDate.setHours(0, 0, 0, 0);

      if (activeTab === "upcoming") {
        return meetingDate >= today;
      } else if (activeTab === "past") {
        return meetingDate < today;
      } else if (activeTab === "dateRange") {
        if (!dateRange.start || !dateRange.end) return false;
        const start = new Date(dateRange.start);
        const end = new Date(dateRange.end);
        return meetingDate >= start && meetingDate <= end;
      }
      return true;
    });
  }, [meetings, activeTab, dateRange]);

  // Group by date
  const groupedMeetings = useMemo(() => {
    const grouped = {};
    filteredMeetings.forEach((meeting) => {
      const dateKey = meeting.date;
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(meeting);
    });
    return grouped;
  }, [filteredMeetings]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // Check if meeting is in the past
  const isPastMeeting = (meeting) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const meetingDate = new Date(meeting.date);
    meetingDate.setHours(0, 0, 0, 0);
    return meetingDate < today;
  };

  const handleDeleteMeeting = (id) => {
    if (confirm("Are you sure you want to delete this meeting?")) {
      removeMeeting(id);
      setSelectedMeeting(null);
    }
  };

  const handleReschedule = async () => {
    if (!rescheduleDate || !rescheduleTime) {
      setRescheduleError("Please select both date and time");
      return;
    }

    setRescheduleLoading(true);
    setRescheduleError("");

    try {
      // Calculate end time based on event duration
      const [hours, minutes] = rescheduleTime.split(":").map(Number);
      const endMinutes = hours * 60 + minutes + 30; // Assuming 30 min default
      const endHours = Math.floor(endMinutes / 60);
      const endMins = endMinutes % 60;
      const endTime = `${String(endHours).padStart(2, "0")}:${String(endMins).padStart(2, "0")}`;

      const response = await fetch(
        `http://localhost:5000/api/bookings/${selectedMeeting.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            date: rescheduleDate,
            startTime: rescheduleTime,
            endTime: endTime,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to reschedule");
      }

      // Update the meeting in the context
      const updatedMeeting = {
        ...selectedMeeting,
        date: rescheduleDate,
        start: rescheduleTime,
        end: endTime,
      };

      // Update meeting in list (simple approach - update selected meeting and trigger re-render)
      setSelectedMeeting(updatedMeeting);
      setRescheduleMode(false);
      setRescheduleDate("");
      setRescheduleTime("");

      // Show success message
      alert("Meeting rescheduled successfully!");
    } catch (err) {
      setRescheduleError(err.message);
      console.error("Reschedule error:", err);
    } finally {
      setRescheduleLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Meetings</h1>

        <div className="flex items-center gap-3">
          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white">
            <option>My Calendly</option>
          </select>

          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">Show buffers</span>
            <input type="checkbox" defaultChecked className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Tabs & Controls */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`pb-3 text-sm font-medium transition ${
              activeTab === "upcoming"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Upcoming
          </button>

          <button
            onClick={() => setActiveTab("past")}
            className={`pb-3 text-sm font-medium transition ${
              activeTab === "past"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Past
          </button>

          <button
            onClick={() => setActiveTab("dateRange")}
            className={`pb-3 text-sm font-medium transition ${
              activeTab === "dateRange"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Date Range
          </button>
        </div>

        <div className="flex gap-2">
          <button className="border border-gray-300 rounded-full px-4 py-2 text-sm font-medium hover:bg-gray-100 transition">
            Export
          </button>
          <button className="border border-gray-300 rounded-full px-4 py-2 text-sm font-medium hover:bg-gray-100 transition">
            Filter
          </button>
        </div>
      </div>

      {/* Date Range Picker */}
      {activeTab === "dateRange" && (
        <div className="mb-6 bg-white p-4 rounded-lg border border-gray-200 flex gap-4">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) =>
                setDateRange({ ...dateRange, start: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) =>
                setDateRange({ ...dateRange, end: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
        </div>
      )}

      {/* Meetings List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {Object.keys(groupedMeetings).length === 0 ? (
          <div className="py-16 text-center text-gray-500">
            {activeTab === "upcoming" && "No upcoming meetings"}
            {activeTab === "past" && "No past meetings"}
            {activeTab === "dateRange" &&
              "No meetings in the selected date range"}
          </div>
        ) : (
          <>
            {Object.entries(groupedMeetings)
              .sort(([dateA], [dateB]) =>
                activeTab === "past"
                  ? new Date(dateB) - new Date(dateA)
                  : new Date(dateA) - new Date(dateB)
              )
              .map(([date, dateMeetings]) => (
                <div key={date}>
                  {/* Date Header */}
                  <div className="px-6 py-3 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-700">
                    {formatDate(date)}
                  </div>

                  {/* Meetings for this date */}
                  {dateMeetings.map((meeting) => (
                    <div
                      key={meeting.id}
                      className="flex items-center justify-between px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition last:border-b-0"
                    >
                      {/* Left - Time & Color */}
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-4 h-4 rounded-full bg-purple-500 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900">
                            {meeting.start} – {meeting.end}
                          </p>
                        </div>
                      </div>

                      {/* Middle - Name & Event Type */}
                      <div className="flex-1 px-6 min-w-0">
                        <p className="text-sm font-semibold text-gray-900">
                          {meeting.invitee}
                        </p>
                        <p className="text-sm text-gray-600">
                          Event type{" "}
                          <span className="font-medium text-gray-900">
                            {meeting.eventType}
                          </span>
                        </p>
                      </div>

                      {/* Right - Hosts & Details Button */}
                      <div className="flex items-center gap-4 text-right shrink-0">
                        <p className="text-sm text-gray-600">
                          1 host | 0 non-hosts
                        </p>
                        <button
                          onClick={() => setSelectedMeeting(meeting)}
                          className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ))}

            {/* Footer */}
            <div className="py-4 text-center text-sm text-gray-500 border-t border-gray-200">
              You've reached the end of the list
            </div>
          </>
        )}
      </div>

      {/* Details Modal */}
      {selectedMeeting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                Meeting Details
              </h2>
              <button
                onClick={() => setSelectedMeeting(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Past Event Badge */}
              {isPastMeeting(selectedMeeting) && (
                <div className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-2">
                  <p className="text-sm text-gray-600 font-medium">
                    ⏰ This event has passed
                  </p>
                </div>
              )}

              {/* Header Info */}
              <div>
                <p className="text-sm text-gray-500 mb-1">
                  {selectedMeeting.start} am – {selectedMeeting.end} am
                </p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {selectedMeeting.invitee}
                </h3>
                <p className="text-gray-600 mt-1">
                  Event type{" "}
                  <span className="font-semibold text-gray-900">
                    {selectedMeeting.eventType}
                  </span>
                </p>
              </div>

              {/* Hosts */}
              <div>
                <p className="text-sm text-gray-500">1 host | 0 non-hosts</p>
              </div>

              {/* Invitee */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="font-semibold text-gray-900 mb-3">INVITEE</h4>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">{selectedMeeting.invitee}</span>
                  </p>
                  <p className="text-sm text-gray-600">{selectedMeeting.email}</p>
                </div>
              </div>

              {/* Location */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="font-semibold text-gray-900 mb-3">LOCATION</h4>
                <p className="text-sm text-gray-600">
                  This is a Google Meet web conference.{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    Join now
                  </a>
                </p>
              </div>

              {/* Time Zone */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="font-semibold text-gray-900 mb-3">
                  INVITEE TIME ZONE
                </h4>
                <p className="text-sm text-gray-600">
                  Eastern Time - US & Canada
                </p>
              </div>

              {/* Date & Time */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="font-semibold text-gray-900 mb-3">
                  DATE & TIME
                </h4>
                <p className="text-sm text-gray-600">
                  {formatDate(selectedMeeting.date)} at{" "}
                  <span className="font-medium">{selectedMeeting.start}</span>
                </p>
              </div>

              {/* Meeting Host */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="font-semibold text-gray-900 mb-3">
                  MEETING HOST
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Host will attend this meeting
                </p>
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold">
                  M
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t border-gray-200 pt-6 flex gap-3">
                <button
                  onClick={() => setRescheduleMode(true)}
                  disabled={isPastMeeting(selectedMeeting)}
                  className={`flex-1 border rounded-lg py-2 text-sm font-medium transition ${
                    isPastMeeting(selectedMeeting)
                      ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                  title={isPastMeeting(selectedMeeting) ? "Cannot reschedule past meetings" : ""}
                >
                  ↻ Reschedule
                </button>
                <button
                  onClick={() => handleDeleteMeeting(selectedMeeting.id)}
                  className="flex-1 border border-red-300 rounded-lg py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition"
                >
                  🗑 Cancel
                </button>
              </div>

              {/* Footer */}
              <div className="text-xs text-gray-500 pt-4 border-t border-gray-200">
                <p>
                  Created 15 January 2026 by{" "}
                  <span className="text-blue-600 hover:underline cursor-pointer">
                    Megha Vardhan Mirthipati
                  </span>
                </p>
              </div>
            </div>

            {/* Reschedule Modal Overlay */}
            {rescheduleMode && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4">
                <div className="bg-white rounded-2xl max-w-md w-full p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Reschedule Meeting
                  </h3>

                  {/* Date Input */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Date
                    </label>
                    <input
                      type="date"
                      value={rescheduleDate}
                      onChange={(e) => setRescheduleDate(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    />
                  </div>

                  {/* Time Input */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Time
                    </label>
                    <input
                      type="time"
                      value={rescheduleTime}
                      onChange={(e) => setRescheduleTime(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    />
                  </div>

                  {/* Error Message */}
                  {rescheduleError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-800">{rescheduleError}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setRescheduleMode(false);
                        setRescheduleError("");
                      }}
                      className="flex-1 border border-gray-300 rounded-lg py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleReschedule}
                      disabled={rescheduleLoading}
                      className={`flex-1 rounded-lg py-2 text-sm font-medium text-white transition ${
                        rescheduleLoading
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      {rescheduleLoading ? "Rescheduling..." : "Reschedule"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
