import { useEffect, useState } from "react";

export default function CreateEventDrawer({
  onClose,
  onCreate,
  onUpdate,
  editingEvent, // 👈 NEW
}) {
  const isEdit = Boolean(editingEvent);

  const [name, setName] = useState("");
  const [duration, setDuration] = useState(30);
  const [location, setLocation] = useState("Google Meet");

  // ✅ PREFILL WHEN EDITING
  useEffect(() => {
    if (editingEvent) {
      setName(editingEvent.name);
      setDuration(editingEvent.duration);
      setLocation(editingEvent.location);
    }
  }, [editingEvent]);

  const handleSubmit = () => {
    const payload = { name, duration, location };

    if (isEdit) {
      onUpdate(editingEvent.id, payload); // ✅ EDIT
    } else {
      onCreate(payload); // ✅ CREATE
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/30 z-40"
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-105 bg-white z-50 shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">
            {isEdit ? "Edit event type" : "Event type"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6 flex-1 overflow-y-auto">
          <div>
            <label className="block text-sm font-medium mb-1">
              Event name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-md px-3 py-2"
            />
            <p className="text-xs text-gray-500 mt-1">
              One-on-One
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Duration
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value={15}>15 min</option>
              <option value={30}>30 min</option>
              <option value={45}>45 min</option>
              <option value={60}>60 min</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Location
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full border rounded-md px-3 py-2"
            >
              <option>Google Meet</option>
              <option>Zoom</option>
              <option>Phone call</option>
              <option>In-person</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Availability
            </label>
            <p className="text-sm text-gray-600">
              Weekdays, 9 am – 5 pm
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex justify-between">
          <button className="text-sm text-gray-500">
            More options
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-6 py-2 rounded-full"
          >
            {isEdit ? "Save changes" : "Create"}
          </button>
        </div>
      </div>
    </>
  );
}
