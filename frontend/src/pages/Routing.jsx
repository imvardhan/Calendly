export default function Routing() {
  return (
    <div className="h-full w-full flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 px-8 py-6">
        <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
          Routing
          <span className="text-gray-400 text-sm cursor-pointer">ⓘ</span>
        </h1>
      </div>

      {/* Empty State */}
      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-md text-center">
          {/* Illustration placeholder */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
            <div className="h-10 w-10 rounded-md bg-blue-500/80" />
          </div>

          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Qualify, route, and schedule meetings from your website
          </h2>

          <p className="text-sm text-gray-600 mb-4">
            Create or import an existing marketing form. Set up screening rules
            that send people to a specific booking page or URL based on their
            responses.
          </p>

          <button className="text-sm text-blue-600 hover:underline mb-6">
            Learn more →
          </button>

          <div>
            <button className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700 transition">
              <span className="text-lg leading-none">+</span>
              New routing form
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
