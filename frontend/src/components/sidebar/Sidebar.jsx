import { NavLink, useNavigate } from "react-router-dom";

const links = [
  { name: "Scheduling", path: "/scheduling" },
  { name: "Meetings", path: "/meetings" },
  { name: "Availability", path: "/availability" },
  { name: "Contacts", path: "/contacts" },
  { name: "Workflows", path: "/workflows" },
  { name: "Integrations & apps", path: "/integrations" },
  { name: "Routing", path: "/routing" },
];

export default function Sidebar() {
  const navigate = useNavigate();

  const handleCreate = () => {
    navigate("/scheduling");
  };

  return (
    <aside className="w-64 bg-white border-r px-4 py-6">
      <div className="mb-6 font-bold text-xl text-blue-600">
        Calendly
      </div>

      <button
        onClick={handleCreate}
        className="w-full mb-6 py-2 border rounded-full text-blue-600 border-blue-600 hover:bg-blue-50 transition"
      >
        + Create
      </button>

      <nav className="space-y-1">
        {links.map((l) => (
          <NavLink
            key={l.name}
            to={l.path}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md text-sm ${
                isActive
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            {l.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
