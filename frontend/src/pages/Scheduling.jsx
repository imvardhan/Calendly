import { useEffect, useState } from "react";
import {
  fetchEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../services/eventsApi";

import EventCard from "../components/event-types/EventCard";
import CreateEventDrawer from "../components/event-types/CreateEventDrawer";

export default function Scheduling() {
  const [events, setEvents] = useState([]);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const loadEvents = async () => {
    const data = await fetchEvents();
    setEvents(data);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  // Filter events based on search query
  const filteredEvents = events.filter((e) =>
    e.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = async (data) => {
    await createEvent(data);
    setOpenDrawer(false);
    loadEvents();
  };

  const handleUpdate = async (id, data) => {
    await updateEvent(id, data);
    setEditingEvent(null);
    setOpenDrawer(false);
    loadEvents();
  };

  const handleDelete = async (id) => {
    await deleteEvent(id);
    loadEvents();
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Scheduling</h1>
        <button
          onClick={() => {
            setEditingEvent(null);
            setOpenDrawer(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-full"
        >
          + Create
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search schedules..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((e) => (
            <EventCard
              key={e.id}
              event={e}
              onDelete={() => handleDelete(e.id)}
              onEdit={() => {
                setEditingEvent(e);
                setOpenDrawer(true);
              }}
            />
          ))
        ) : (
          <p className="text-gray-500 text-center py-8">
            {searchQuery ? "No schedules found matching your search" : "No schedules created yet"}
          </p>
        )}
      </div>

      {openDrawer && (
        <CreateEventDrawer
          onClose={() => {
            setOpenDrawer(false);
            setEditingEvent(null);
          }}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          editingEvent={editingEvent}
        />
      )}
    </div>
  );
}
