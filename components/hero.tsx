function Hero() {
  return (
    <div
      className="mx-auto flex max-w-6xl justify-between bg-[#d2c3fd] 
    p-5 text-black xl:rounded-xl mt-5 shadow-lg"
    >
      <div>
        <h1 className="max-w-xl p-5 font-serif text-4xl md:text-6xl">
          Welcome to my Blog
        </h1>
        <h2 className="pb-5 pl-5">
          This is a fully functional Bloging Site built using{' '}
          <a href="https://www.sanity.io/" target="_blank" className="underline">
            Sanity.io
          </a>{' '}
          and{' '}
          <a href="https://nextjs.org/" target="_blank" className="underline">
            Next.js
          </a>
          .
        </h2>
      </div>
      <img
        className="relative bottom-12 hidden max-h-40 lg:inline-flex"
        src="https://clipart-best.com/img/pen/pen-clip-art-4.png"
        alt=""
      />
    </div>
  )
}

export default Hero
