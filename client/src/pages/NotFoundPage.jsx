import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-papyrus px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
      <div className="mx-auto max-w-max">
        <main className="sm:flex">
          <p className="text-4xl font-bold tracking-tight text-pharaoh-gold sm:text-5xl">404</p>
          <div className="sm:ml-6">
            <div className="sm:border-l sm:border-gray-200 sm:pl-6">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Page not found</h1>
              <p className="mt-1 text-base text-gray-500">The page you're looking for has vanished like ancient treasures.</p>
            </div>
            <div className="mt-10 flex space-x-3 sm:border-l sm:border-transparent sm:pl-6">
              <Link
                to="/"
                className="inline-flex items-center rounded-md border border-transparent bg-pharaoh-gold px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-pharaoh-gold/90 focus:outline-none focus:ring-2 focus:ring-pharaoh-gold focus:ring-offset-2"
              >
                Go back home
              </Link>
              <Link
                to="/destinations"
                className="inline-flex items-center rounded-md border border-transparent bg-nile-blue px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-nile-blue/90 focus:outline-none focus:ring-2 focus:ring-nile-blue focus:ring-offset-2"
              >
                Explore destinations
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
