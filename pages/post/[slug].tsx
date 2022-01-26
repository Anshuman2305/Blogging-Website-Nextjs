import { GetStaticProps } from 'next'
import Header from '../../components/header'
import { sanityClient, urlFor } from '../../sanity'
import { Post } from '../../typings'
import PortableText from 'react-portable-text'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useState } from 'react'
import Footer from '../../components/footer'

interface IFormInput {
  _id: string
  name: string
  email: string
  comment: string
}

interface Props {
  post: Post[]
}

function Post({ post }: Props) {

  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>()

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    fetch('/api/createComment', {
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then(() => {
        console.log(data);
        setSubmitted(true);
      })
      .catch((err) => {
        console.log(err);
        setSubmitted(false);
      })
  }

  return (
    <main className=" bg-white overflow-hidden">
      <Header />

      <img
        className="mx-auto h-80 w-full max-w-7xl object-cover xl:rounded-lg"
        src={urlFor(post.mainImage).url()!}
        alt=""
      />

      <article className="mx-auto max-w-7xl p-5 font-serif text-xl">
        <h1 className="mt-10 mb-3 text-4xl md:text-6xl font-bold">{post.title}</h1>
        <h2 className="mb-2 text-xl font-light text-gray-500">
          {post.description}
        </h2>
        <div className="mt-4 flex items-center space-x-2">
          <img
            className="h-10 w-10 md:h-16 md:w-16 rounded-full"
            src={urlFor(post.author.image).url()!}
            alt=""
          />
          <p className="text-sm md:text-lg font-extralight">
            Blog post by{' '}
            <span className="font-bold text-green-500">{post.author.name}</span>{' '}
            - Published at {new Date(post._createdAt).toLocaleString()}
          </p>
        </div>
        <div className="mt-10">
          <PortableText
            className=" text-justify"
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
            content={post.body}
            serializers={{
              h1: (props: any) => (
                <h1 className="my-5 text-3xl font-bold" {...props} />
              ),
              h2: (props: any) => (
                <h1 className="my-5 text-xl font-bold" {...props} />
              ),
              li: ({ children }: any) => (
                <li className="ml-4 list-disc">{children}</li>
              ),
              link: ({ href, children }: any) => (
                <a href={href} target="_blank" className="text-blue-500 hover:underline">
                  {children}
                </a>
              ),
            }}
          />
        </div>
      </article>
      <hr className="mx-auto my-5 max-w-lg border border-gray-300" />

      {submitted ? (
        <div className="flex flex-col p-10 my-10 mx-auto max-w-2xl bg-slate-500 text-white">
          <h3 className="text-2xl font-bold">
            Thank you for Submitting your Comment !
          </h3>
          <p>
            Once it has been approved, It will appear below.
          </p>
        </div>
      ): (
        
        <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto mb-10 flex max-w-2xl flex-col p-5 "
      >
        <h3 className="text-sm text-blue-500">Enjoyed this Article?</h3>
        <h4 className="text-2xl font-bold">Leave a Comment Below!</h4>
        <hr className="mt-2 py-3" />

        <input {...register('_id')} type="hidden" name="_id" value={post._id} />

        <label className="mb-5 block">
          <span className="text-gray-700">Name</span>
          <input
            {...register('name', { required: true })}
            className="form-input mt-1 block w-full rounded border py-2 px-3 shadow outline-none ring-blue-500 focus:ring"
            type="text"
            placeholder="Name..."
          />
        </label>

        <label className="mb-5 block">
          <span className="text-gray-700">Email</span>
          <input
            {...register('email', { required: true })}
            className="form-input mt-1 block w-full rounded border py-2 px-3 shadow outline-none ring-blue-500 focus:ring"
            type="email"
            placeholder="Email..."
          />
        </label>

        <label className="mb-5 block">
          <span className="text-gray-700">Comment</span>
          <textarea
            {...register('comment', { required: true })}
            className="form-textarea mt-1 block w-full rounded border py-2 px-3 shadow outline-none ring-blue-500 focus:ring "
            rows={8}
            placeholder="Enter your Comment ..."
          />
        </label>

        {/*error will occur when field validation will failed*/}

        <div className="flex flex-col p-5">
          {errors.name && (
            <span className="text-red-500">- Name Field is Required</span>
          )}
          {errors.comment && (
            <span className="text-red-500">- Comment Field is Required</span>
          )}
          {errors.email && (
            <span className="text-red-500">- Email Field is Required</span>
          )}
        </div>

        <input
          type="submit"
          className="focus:shadow-outline cursor-pointer rounded bg-blue-500 py-2 px-4 shadow hover:bg-blue-400 focus:outline-none text-white"
        />
      </form>

      )}

      {/* Comments */}

      <div className="flex flex-col p-10 my-10 max-w-2xl mx-auto md:border-4">
        <h3 className="text-2xl">Comments</h3>
        <hr className="pb-2" />
        
        {post.comments.map((comment) =>(
          <div key={comment._id}>
            <p><span className="text-blue-500">{comment.name}: </span>{comment.comment}</p>
          </div>
        ))}

      </div>

      <Footer />
    </main>
  )
}

export default Post

export const getStaticPaths = async () => {
  const query = `*[_type == "post"]{
        id,
        slug {
            current
        }
      }`

  const posts = await sanityClient.fetch(query)

  const paths = posts.map((post: Post) => ({
    params: {
      slug: post.slug.current,
    },
  }))

  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `*[_type == "post" && slug.current == $slug][0]{
        _id,
        _createdAt,
        title,
        author-> {
            name,
            image
        },
        'comments': *[
            _type =="comment" &&
            post._ref == ^._id &&
            approved == true ],
            description,
            mainImage,
            slug,
            body
      }`

  const post = await sanityClient.fetch(query, {
    slug: params?.slug,
  })

  if (!post) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      post,
    },
    revalidate: 60, //this will flush the cache after 60 sec
  }
}
