export default function Workflows() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-2xl font-semibold mb-4">Workflows</h1>

        <select className="w-48 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>My Calendly</option>
        </select>
      </div>

      <div className="flex items-center mb-8 ">
        <div className="flex-1 border-t border-gray-300 " />
      </div>


      {/* Empty State */}
      <div className="flex flex-col items-center text-center mb-16">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-blue-50">
          <svg
            className="h-12 w-12 text-blue-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15A2.25 2.25 0 012.25 17.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15A2.25 2.25 0 002.25 6.75m19.5 0l-9.75 6.75L2.25 6.75"
            />
          </svg>
        </div>

        <h2 className="text-lg font-semibold mb-2">
          Automate your meeting communications
        </h2>

        <p className="max-w-md text-sm text-gray-600 mb-3">
          Workflows help you reduce no-shows and have more productive meetings.
          Plus, automated emails and texts save you time before and after events.
        </p>

        <button className="text-sm text-blue-600 hover:underline">
          Learn more
        </button>
      </div>

      {/* Divider */}
      <div className="flex items-center mb-8">
        <div className="flex-1 border-t  border-gray-300" />
        <span className="mx-4 text-sm text-gray-500">
          Start with a workflow template
        </span>
        <div className="flex-1 border-t" />
      </div>

      {/* Workflow Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {/* Card 1 */}
        <WorkflowCard
          title="Email reminder to invitee"
          description="Reduce no-shows — send automated email reminders to invitees"
          iconBg="bg-green-50"
          iconColor="text-green-600"
        />

        {/* Card 2 */}
        <WorkflowCard
          title="Text cancellation notification to host"
          description="Keep hosts up-to-date with canceled events"
          iconBg="bg-red-50"
          iconColor="text-red-600"
        />

        {/* Card 3 */}
        <WorkflowCard
          title="Send thank you email"
          description="Build relationships with a quick thanks"
          iconBg="bg-orange-50"
          iconColor="text-orange-600"
        />
      </div>

      {/* Footer CTA */}
      <div className="mt-10 flex justify-center">
        <button className="rounded-full border border-gray-300 px-5 py-2 text-sm text-gray-700 hover:bg-gray-50">
          See all workflows
        </button>
      </div>
    </div>
  );
}

function WorkflowCard({ title, description, iconBg, iconColor }) {
  return (
    <div className="rounded-xl border bg-white p-6 hover:shadow-sm transition">
      <div
        className={`mb-4 flex h-10 w-10 items-center justify-center rounded-full ${iconBg}`}
      >
        <svg
          className={`h-5 w-5 ${iconColor}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15A2.25 2.25 0 012.25 17.25V6.75"
          />
        </svg>
      </div>

      <h3 className="text-sm font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{description}</p>

      <button className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
        Add workflow
      </button>
    </div>
  );
}
