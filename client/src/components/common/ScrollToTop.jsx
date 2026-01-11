import { ArrowUpIcon } from '@heroicons/react/24/outline'

const ScrollToTop = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 p-3 rounded-full bg-pharaoh-gold text-white shadow-lg hover:bg-pharaoh-gold/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pharaoh-gold z-50 transition-all duration-300 animate-bounce"
      aria-label="Scroll to top"
    >
      <ArrowUpIcon className="h-5 w-5" aria-hidden="true" />
    </button>
  )
}

export default ScrollToTop
