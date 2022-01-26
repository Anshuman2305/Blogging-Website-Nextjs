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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 p-5 max-w-7xl mx-auto">
        {posts.map((post) => (
          <Link key={post._id} href={`/post/${post.slug.current}`}>
            <div className="group cursor-pointer rounded-lg overflow-hidden bg-gray-500 text-white">
              <img className="h-60 w-full object-cover group-hover:scale-105 transition-transform duration-200 ease-in-out rounded-t-lg" src={urlFor(post.mainImage).url()!
              } alt="" />
              <div className="flex justify-between p-5 rounded-b-lg items-center">
                <div>
                  <p className="text-lg font-bold">{post.title}</p>
                  <p className="text-xs max-w-[200px]">
                    {post.description} by {post.author.name}
                  </p>
                </div>

                <img className="h-12 w-12 rounded-full border-2" src={urlFor(post.author.image).url()!
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
