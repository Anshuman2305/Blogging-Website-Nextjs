import Link from 'next/link'

function Header() {
  return (
    <header className="flex justify-between p-5 max-w-7xl mx-auto">
      <div className="inline-flex items-center space-x-5">
        <Link href="/">
          <img
            className="w-20 cursor-pointer object-contain"
            src="https://www.nicepng.com/png/full/363-3634406_am-logo-logo.png"
            alt=""
          />
        </Link>
        <div className="hidden items-center space-x-5 md:inline-flex">
          <h3>About</h3>
          <h3>Contact</h3>
          <h3
            className="rounded-full bg-gray-700 px-4
            py-1 text-white cursor-pointer hover:bg-gray-300 hover:text-black"
          >
            Follow
          </h3>
        </div>
      </div>

      <div className="flex items-center space-x-5 text-gray-700 cursor-pointer">
        <h3>Sign In</h3>
        <h3 className="rounded-full border-2 border-gray-700 px-4 py-1 cursor-pointer hover:bg-gray-300">
          Get Started
        </h3>
      </div>
    </header>
  )
}

export default Header
