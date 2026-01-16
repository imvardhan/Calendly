import { useMeetings } from "../context/MeetingsContext";
import { useMemo, useState } from "react";

export default function Contacts() {
  const { meetings } = useMeetings();
  const [search, setSearch] = useState("");

  // Derive contacts from meetings (Calendly-style)
  const contacts = useMemo(() => {
    const map = new Map();

    meetings.forEach((m) => {
      if (!map.has(m.email)) {
        map.set(m.email, {
          name: m.invitee,
          email: m.email,
          nextMeeting: m.date,
          timezone: "Eastern Time - US & Canada",
          company: "-",
          jobTitle: "-",
          linkedin: "-",
        });
      }
    });

    return Array.from(map.values());
  }, [meetings]);

  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Contacts</h1>
        <button className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white">
          + Add contact
        </button>
      </div>

      {/* Search + actions */}
      <div className="flex items-center gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by name and email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-72 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button className="rounded-lg border px-3 py-2 text-sm text-gray-600">
          Filter
        </button>

        <button className="rounded-lg border px-3 py-2 text-sm text-gray-600">
          Columns
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Name</th>
              <th className="px-4 py-3 text-left font-medium">Email</th>
              <th className="px-4 py-3 text-left font-medium">
                Next meeting date
              </th>
              <th className="px-4 py-3 text-left font-medium">Time zone</th>
              <th className="px-4 py-3 text-left font-medium">Company</th>
              <th className="px-4 py-3 text-left font-medium">Job title</th>
              <th className="px-4 py-3 text-left font-medium">LinkedIn</th>
            </tr>
          </thead>

          <tbody>
            {filteredContacts.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="px-4 py-12 text-center text-gray-500"
                >
                  No contacts found
                </td>
              </tr>
            ) : (
              filteredContacts.map((c) => (
                <tr
                  key={c.email}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3 flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold">
                      {c.name[0]}
                    </div>
                    {c.name}
                  </td>
                  <td className="px-4 py-3">{c.email}</td>
                  <td className="px-4 py-3">{c.nextMeeting}</td>
                  <td className="px-4 py-3">{c.timezone}</td>
                  <td className="px-4 py-3">{c.company}</td>
                  <td className="px-4 py-3">{c.jobTitle}</td>
                  <td className="px-4 py-3">{c.linkedin}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
