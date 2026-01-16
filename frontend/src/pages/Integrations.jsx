export default function Integrations() {
  return (
    <div className="p-8">
      {/* Header */}
      <h1 className="text-2xl font-semibold mb-6">
        Integrations & apps
      </h1>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-gray-200 mb-8">
        <button className="pb-3 text-sm font-medium text-blue-600 border-b-2 border-blue-600">
          Discover (43)
        </button>
        <button className="pb-3 text-sm font-medium text-gray-500">
          Manage (2)
        </button>
      </div>

      {/* Featured */}
      <h2 className="text-sm font-semibold text-gray-700 mb-4">
        Featured
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <FeaturedCard
          title="Calendly for Chrome"
          description="One-click access to Calendly anywhere on the web"
          bg="bg-blue-600"
          icon="🌐"
        />
        <FeaturedCard
          title="Microsoft Teams Chat"
          description="Get personal notifications for your Calendly events"
          bg="bg-purple-600"
          icon="💬"
        />
      </div>

      {/* Search + Sort */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <input
          placeholder="Find integrations, apps, and more"
          className="w-80 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button className="ml-auto rounded-lg border px-4 py-2 text-sm text-gray-600">
          Most popular ▾
        </button>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <IntegrationCard
          name="Zoom"
          description="Include Zoom details in your Calendly events."
          badge="Admin"
        />
        <IntegrationCard
          name="Salesforce"
          description="Create and update records as meetings are scheduled."
          badge="Admin"
        />
        <IntegrationCard
          name="Google Meet"
          description="Include Google Meet details in your Calendly events."
          status="Connected"
        />
        <IntegrationCard
          name="HubSpot"
          description="Sync meeting data to your CRM."
          badge="Admin"
        />
        <IntegrationCard
          name="Google Calendar"
          description="Add events to your calendar and prevent double-booking."
          status="Connected"
        />
        <IntegrationCard
          name="Outlook Calendar Plug-in"
          description="Add events to your desktop calendar."
        />
        <IntegrationCard
          name="Microsoft Teams Conferencing"
          description="Include Teams conferencing details in your events."
        />
        <IntegrationCard
          name="Calendly for Chrome"
          description="Access and share availability on any web page."
        />
      </div>
    </div>
  );
}

/* ---------------- Components ---------------- */

function FeaturedCard({ title, description, bg, icon }) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl p-6 text-white ${bg}`}
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-sm opacity-90">{description}</p>
    </div>
  );
}

function IntegrationCard({ name, description, status, badge }) {
  return (
    <div className="rounded-xl border bg-white p-5 hover:shadow-sm transition">
      <div className="flex items-start justify-between mb-3">
        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold">
          {name[0]}
        </div>

        {status && (
          <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
            {status}
          </span>
        )}

        {badge && (
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
            {badge}
          </span>
        )}
      </div>

      <h4 className="text-sm font-semibold mb-1">{name}</h4>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}
