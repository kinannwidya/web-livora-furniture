// Newsletter section component
export default function Newsletter() {
  return (
    <section className="max-w-7xl mx-auto px-6 md:px-20 mb-10 md:mb-16">
      <div className="bg-gray-900 text-gray-100 p-6 md:p-12">
        <div className="md:flex items-center justify-between gap-8">
          {/* Left: text content */}
          <div className="mb-6 md:mb-0">
            <h3 className="text-xl md:text-2xl font-bold">
              Join our newsletter
            </h3>
            <p className="text-sm text-gray-300 mt-1">
              Get updates on new collections & exclusive promos. 10% discount
              for new customers ✨
            </p>
          </div>

          {/* Right: fake form (just a button placeholder) */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="w-full md:w-auto"
          >
            <button
              type="button"
              className="px-5 py-3 bg-white text-gray-900 font-semibold hover:bg-gray-100 w-full md:w-auto"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
