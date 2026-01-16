const BASE_URL = "http://localhost:5000/api/events";
const BOOKINGS_URL = "http://localhost:5000/api/bookings";
const AVAILABILITY_URL = "http://localhost:5000/api/availability";

// ============ EVENTS ============
export async function fetchEvents() {
  const res = await fetch(BASE_URL);
  return res.json();
}

export async function getEventBySlug(slug) {
  const res = await fetch(`${BASE_URL}/slug/${slug}`);
  if (!res.ok) throw new Error("Event not found");
  return res.json();
}

export async function createEvent(data) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateEvent(id, data) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update event");
  return res.json();
}

export async function deleteEvent(id) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete event");
  return res.json();
}

// ============ BOOKINGS ============
export async function createBooking(bookingData) {
  const res = await fetch(BOOKINGS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bookingData),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to create booking");
  }
  return res.json();
}

export async function getBookedSlots(eventTypeId) {
  const res = await fetch(`${BOOKINGS_URL}/${eventTypeId}`);
  if (!res.ok) throw new Error("Failed to fetch booked slots");
  return res.json();
}

// ============ AVAILABILITY ============
export async function getAvailableSlots(eventTypeId, date) {
  const res = await fetch(
    `${AVAILABILITY_URL}/${eventTypeId}?date=${date}`
  );
  if (!res.ok) throw new Error("Failed to fetch available slots");
  return res.json();
}
