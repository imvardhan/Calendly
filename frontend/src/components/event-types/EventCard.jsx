import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EventCard({ event, onDelete, onEdit }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const handleCopyLink = async () => {
    try {
      const bookingLink = `${window.location.origin}/book/${event.slug}`;
      await navigator.clipboard.writeText(bookingLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  return (
    <div
      className="relative flex justify-between items-center 
      rounded-xl border border-gray-200 bg-white
      px-6 py-5 shadow-sm hover:shadow-md transition group"
    >
      {/* Purple edge */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-purple-500 rounded-l-xl" />

      {/* LEFT CONTENT */}
      <div className="pl-4">
        <h3 className="font-semibold text-gray-900 text-base">
          {event.name}
        </h3>

        <p className="text-sm text-gray-600 mt-1">
          {event.duration} min · {event.location} · One-on-One
        </p>
      </div>

      {/* RIGHT ACTIONS */}
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
        <button
          onClick={() => navigate(`/book/${event.slug}`)}
          className="text-sm px-4 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200"
        >
          Book meeting
        </button>

        <button
          onClick={handleCopyLink}
          className={`text-sm px-4 py-1.5 rounded-full transition ${
            copied
              ? "bg-green-100 text-green-700 border border-green-300"
              : "border border-gray-300 hover:bg-gray-50"
          }`}
        >
          {copied ? "✓ Copied" : "Copy link"}
        </button>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100"
        >
          ⋮
        </button>

        {/* MENU */}
        {menuOpen && (
          <div className="absolute right-6 top-16 w-52 bg-white border border-gray-200 rounded-xl shadow-lg text-sm z-20">
            <button
              onClick={() => navigate(`/book/${event.slug}`)}
              className="block w-full text-left px-4 py-2 hover:bg-gray-50"
            >
              View booking page
            </button>

            <button
              onClick={() => {
                setMenuOpen(false);
                onEdit(event);
              }}
              className="block w-full text-left px-4 py-2 hover:bg-gray-50"
            >
              Edit
            </button>

            <button
              onClick={() => onDelete(event.id)}
              className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
