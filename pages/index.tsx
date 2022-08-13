import Head from 'next/head'
import Link from 'next/link'
import Footer from '../components/footer'
import Header from '../components/header'
import Hero from '../components/hero'
import { sanityClient, urlFor } from '../sanity'
import { Post } from '../typings'

interface Props {
  posts: Post[]
}

export default function Home({ posts }: Props) {
  console.log(posts)
  return (
    <div>
      <Head>
        <title>My Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <Hero />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 mt-5 md:mt-10 max-w-6xl mx-auto p-5 md:p-0">
        {posts.map((post) => (
          <Link key={post._id} href={`/post/${post.slug.current}`}>
            <div className="group cursor-pointer rounded-lg overflow-hidden bg-[#d2c3fd] text-white shadow-lg mt-5">
              <div className="h-60 w-full overflow-hidden">
                <img className="h-60 w-full object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out rounded-t-lg" src={urlFor(post.mainImage).url()!
                } alt="" />
              </div>

              <div className="flex justify-between p-5 rounded-b-lg ">
                <div className="items-center">
                  <p className="text-lg font-bold text-[#242424]">{post.title}</p>
                  <p className="text-xs text-[#27202e] max-w-[200px] mt-2">{post.description}</p>
                  <p className="text-xs max-w-fit bg-[#9084c9] text-[#fff] p-1 pl-2 pr-2 mt-3 rounded-full">by {post.author.name}</p>
                </div>

                <img className="h-16 w-16 rounded-full border-4 border-[#b4abe2]" src={urlFor(post.author.image).url()!
                } alt="" />
              </div>
            </div>
          </Link>
        ))}
      </div>
      <Footer />
    </div>
  )
}

export const getServerSideProps = async () => {
  const query = `*[_type == "post"]{
    id,
    title,
    author-> {
    name,
    image,
     },
  description,
  mainImage,
  slug
  }`

  const posts = await sanityClient.fetch(query)

  return {
    props: {
      posts,
    },
  }
}
