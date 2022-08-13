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
  post: Post
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

  var date = Date.parse(post._createdAt);

  function format(date: string | number | Date) {
    date = new Date(date);

    var day = ('0' + date.getDate()).slice(-2);
    var month = ('0' + (date.getMonth() + 1)).slice(-2);
    var year = date.getFullYear();

    return day + '-' + month + '-' + year;
  }

  return (
    <main className="overflow-hidden">
      <Header />



      <article className="mx-auto max-w-6xl md:p-5 font-serif text-xl">
        <div className="bg-[#d2c3fd] p-6 py-10 md:p-10 md:rounded-lg shadow-lg text-center justify-center items-center flex flex-col">
          <h1 className="mb-3 text-2xl md:text-6xl font-bold">{post.title}</h1>
          <h2 className="mb-2 text-xl font-light text-[#3f3f3f]">
            {post.description}
          </h2>
          <div className="mt-4 flex space-x-2 bg-[#b4a3df] max-w-fit p-2 pr-5 pl-5 rounded-full">
            <p className="text-xs md:text-lg font-extralight">
              By {' '}{post.author.name}{' '}
              - Published on {format(post._createdAt)}
            </p>
          </div>

        </div>

        <div className="md:mt-10 md:p-24 md:pt-16 pb-16 p-8 bg-[#fff] md:rounded-lg md:border-2">
          <PortableText
            className="text-justify"
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
            content={post.body}
            serializers={{
              h1: (props: any) => (
                <h1 className="my-5 text-xl md:text-3xl font-bold" {...props} />
              ),
              h2: (props: any) => (
                <h1 className="my-5 text-xl font-bold" {...props} />
              ),
              normal: (props: any) => (
                <h1 className="my-5 text-[#444444] leading-[1.8em]" {...props} />
              ),
              li: ({ children }: any) => (
                <li className="ml-10 list-disc text-[#444444] leading-[1.8em]">{children}</li>
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
        <div className="flex flex-col p-10 my-10 mx-auto max-w-2xl bg-[#d2c3fd] text-[#000] rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold">
            Thank you for Submitting your Comment !
          </h3>
          <p>
            Once it has been approved, It will appear below.
          </p>
        </div>
      ) : (

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto mb-10 flex max-w-3xl flex-col p-10 md:border-2 md:rounded-2xl md:bg-[#f3f3f3]"
        >
          <h3 className="text-sm text-blue-500">Enjoyed this Article?</h3>
          <h4 className="text-2xl font-bold">Leave a Comment Below!</h4>
          <hr className="mt-2 py-3" />

          <input {...register('_id')} type="hidden" name="_id" value={post._id} />

          <label className="mb-5 block">
            <span className="text-gray-700">Name</span>
            <input
              {...register('name', { required: true })}
              className="form-input mt-1 block w-full rounded-full py-2 px-3 outline-none bg-[#e9e9e9] border-2 border-[#ccc] placeholder:text-[#7c7c7c]"
              type="text"
              placeholder="Name..."
            />
          </label>

          <label className="mb-5 block">
            <span className="text-gray-700">Email</span>
            <input
              {...register('email', { required: true })}
              className="form-input mt-1 block w-full rounded-full py-2 px-3 outline-none bg-[#e9e9e9] border-2 border-[#ccc] placeholder:text-[#7c7c7c]"
              type="email"
              placeholder="Email..."
            />
          </label>

          <label className="block">
            <span className="text-gray-700">Comment</span>
            <textarea
              {...register('comment', { required: true })}
              className="form-textarea mt-1 block w-full rounded-xl py-2 px-3 outline-none bg-[#e9e9e9] border-2 border-[#ccc] placeholder:text-[#7c7c7c]"
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
            className="cursor-pointer rounded-full bg-[#c4c4c4] py-2 px-4 hover:bg-[#000] focus:outline-none text-black hover:text-white  ease-in-out duration-300"
          />
        </form>

      )}

      {/* Comments */}

      <div className="flex flex-col p-10 my-10 max-w-2xl mx-auto md:border-2 rounded-2xl">
        <h3 className="text-2xl">Comments</h3>
        <hr className="pb-2" />

        {post.comments.map((comment) => (
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
