import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../../context/AuthContext'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Destinations', href: '/destinations' },
  { name: 'Itinerary Planner', href: '/itinerary-planner' },
  { name: 'Cultural Insights', href: '/cultural-insights' },
  { name: 'Community', href: '/forum' },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Navbar() {
  const { isAuthenticated, currentUser, logout } = useAuth()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <Disclosure as="nav" className={classNames(
      'fixed w-full z-50 transition-all duration-300',
      scrolled ? 'bg-white shadow-md' : 'bg-transparent'
    )}>
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="flex flex-shrink-0 items-center">
                  <Link to="/" className="flex items-center">
                    <span className={classNames(
                      "text-2xl font-extrabold tracking-wide transition-colors duration-300",
                      scrolled ? "text-pharaoh-gold" : "text-pharaoh-gold"
                    )}>
                      Ray7 Masr
                    </span>
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  {navigation.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      className={({ isActive }) => classNames(
                        isActive
                          ? 'border-pharaoh-gold text-pharaoh-gold'
                          : 'border-transparent text-gray-700 hover:border-gray-300 hover:text-gray-900',
                        'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium'
                      )}
                    >
                      {item.name}
                    </NavLink>
                  ))}
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                {isAuthenticated ? (
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-pharaoh-gold focus:ring-offset-2">
                        <span className="sr-only">Open user menu</span>
                        {currentUser?.profileImage ? (
                          <img
                            className="h-8 w-8 rounded-full"
                            src={currentUser.profileImage}
                            alt={currentUser.name}
                          />
                        ) : (
                          <UserCircleIcon className="h-8 w-8 text-gray-400" aria-hidden="true" />
                        )}
                      </Menu.Button>
                    </div>
                    <Transition
                      enter="transition ease-out duration-200"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/profile"
                              className={classNames(
                                active ? 'bg-gray-100' : '',
                                'block px-4 py-2 text-sm text-gray-700'
                              )}
                            >
                              Your Profile
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/itinerary-planner"
                              className={classNames(
                                active ? 'bg-gray-100' : '',
                                'block px-4 py-2 text-sm text-gray-700'
                              )}
                            >
                              Your Itineraries
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={logout}
                              className={classNames(
                                active ? 'bg-gray-100' : '',
                                'block w-full text-left px-4 py-2 text-sm text-gray-700'
                              )}
                            >
                              Sign out
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                ) : (
                  <div className="flex items-center space-x-4">
                    <Link
                      to="/login"
                      className="text-gray-700 hover:text-pharaoh-gold px-3 py-2 text-sm font-medium"
                    >
                      Log in
                    </Link>
                    <Link
                      to="/register"
                      className="bg-pharaoh-gold text-white hover:bg-pharaoh-gold/90 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Sign up
                    </Link>
                  </div>
                )}
              </div>
              <div className="-mr-2 flex items-center sm:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-pharaoh-gold">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden bg-white shadow-md">
            <div className="space-y-1 pb-3 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as={NavLink}
                  to={item.href}
                  className={({ isActive }) => classNames(
                    isActive
                      ? 'bg-pharaoh-gold/10 border-pharaoh-gold text-pharaoh-gold'
                      : 'border-transparent text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900',
                    'block border-l-4 py-2 pl-3 pr-4 text-base font-medium'
                  )}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
            <div className="border-t border-gray-200 pb-3 pt-4">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center px-4">
                    <div className="flex-shrink-0">
                      {currentUser?.profileImage ? (
                        <img
                          className="h-10 w-10 rounded-full"
                          src={currentUser.profileImage}
                          alt={currentUser.name}
                        />
                      ) : (
                        <UserCircleIcon className="h-10 w-10 text-gray-400" aria-hidden="true" />
                      )}
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-800">{currentUser?.name}</div>
                      <div className="text-sm font-medium text-gray-500">{currentUser?.email}</div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1">
                    <Disclosure.Button
                      as={Link}
                      to="/profile"
                      className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Your Profile
                    </Disclosure.Button>
                    <Disclosure.Button
                      as={Link}
                      to="/itinerary-planner"
                      className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Your Itineraries
                    </Disclosure.Button>
                    <Disclosure.Button
                      as="button"
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Sign out
                    </Disclosure.Button>
                  </div>
                </>
              ) : (
                <div className="mt-3 space-y-1">
                  <Disclosure.Button
                    as={Link}
                    to="/login"
                    className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Log in
                  </Disclosure.Button>
                  <Disclosure.Button
                    as={Link}
                    to="/register"
                    className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Sign up
                  </Disclosure.Button>
                </div>
              )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}
