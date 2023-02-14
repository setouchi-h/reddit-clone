import {
  ArrowDownIcon,
  ArrowUpIcon,
  BookmarkIcon,
  ChatBubbleLeftEllipsisIcon,
  EllipsisHorizontalIcon,
  GiftIcon,
  ShareIcon,
} from "@heroicons/react/24/outline"
import Avatar from "./Avatar"
import TimeAgo from "react-timeago"
import Link from "next/link"
import { Jelly } from "@uiball/loaders"
import { useSession } from "next-auth/react"
import { toast } from "react-hot-toast"
import { useEffect, useState } from "react"
import { useMutation, useQuery } from "@apollo/client"
import { GET_VOTES_BY_POST_ID } from "../graphql/queries"
import { ADD_VOTE } from "../graphql/mutations"

type Props = {
  post: Post
}

function Post({ post }: Props) {
  const [vote, setVote] = useState<boolean>()
  const { data: session } = useSession()

  const { data, error } = useQuery(GET_VOTES_BY_POST_ID, {
    variables: {
      id: post?.id,
    },
  })

  const [addVote] = useMutation(ADD_VOTE, {
    refetchQueries: [GET_VOTES_BY_POST_ID, "getVote"],
  })

  const upVote = async (isUpvote: boolean) => {
    if (!session) {
      toast("❕You need to sign in to Vote!")
      return
    }

    if (vote && isUpvote) return
    if (vote === false && !isUpvote) return

    await addVote({
      variables: {
        post_id: post.id,
        username: session?.user?.name,
        upvote: isUpvote,
        created_at: new Date(Date.now()).toISOString(),
      },
    })
  }

  useEffect(() => {
    const votes: Vote[] = data?.getVote

    const vote = votes?.find((vote) => vote.username == session?.user?.name)?.upvote

    setVote(vote)
  }, [data])

  const displayVotes = (data: any) => {
    const votes: Vote[] = data?.getVote
    const displayNum = votes?.reduce(
      (total, vote) => (vote.upvote ? (total += 1) : (total -= 1)),
      0  
    )

    if (votes?.length === 0) return 0

    if (displayNum === 0) {
      return votes[0].upvote ? 1 : -1
    }

    return displayNum
  }

  if (!post)
    return (
      <div className="flex w-full items-center justify-center p-10 text-xl">
        <Jelly size={50} color="#FF4501" />
      </div>
    )

  return (
    <Link href={`/post/${post.id}`}>
      <div className="rounded-md flex cursor-pointer border border-gray-300 bg-white shadow-sm hover:border hover:border-gray-600 mb-4">
        {/* Votes */}
        <div className="flex flex-col items-center justify-start space-y-1 rounded-l-md bg-gray-50 p-4 text-gray-400">
          <ArrowUpIcon
            onClick={() => upVote(true)}
            className={`voteButton hover:text-red-400 ${vote && "text-red-400"}`}
          />
          <p className="text-xs font-bold text-black">{displayVotes(data)}</p>
          <ArrowDownIcon
            onClick={() => upVote(false)}
            className={`voteButton hover:text-blue-400 ${vote === false && "text-blue-400"}`}
          />
        </div>
        <div className="p-3 pb-1 ">
          {/* Header */}
          <div className="flex items-center space-x-2">
            <Avatar seed={post.subreddit?.topic} />
            <p className="text-xs text-gray-400">
              <Link href={`/subreddit/${post.subreddit?.topic}`}>
                <span className="font-bold text-black hover:text-blue-400 hover:underline">
                  r/{post.subreddit?.topic}
                </span>
              </Link>{" "}
              ・ Posted by u/{post.username} <TimeAgo date={post.created_at} />
            </p>
          </div>

          {/* Body */}
          <div className="py-4">
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="mt-2 text-sm font-light">{post.body}</p>
          </div>

          {/* Image */}
          <img className="w-full" src={post.image} alt="" />

          {/* Footer */}
          <div className="flex space-x-4 text-gray-400">
            <div className="postButton">
              <ChatBubbleLeftEllipsisIcon className="h-6 w-6" />
              <p className="">{post.comment.length} Comments</p>
            </div>
            <div className="postButton">
              <GiftIcon className="h-6 w-6" />
              <p className="hidden sm:inline">Award</p>
            </div>
            <div className="postButton">
              <ShareIcon className="h-6 w-6" />
              <p className="hidden sm:inline">Share</p>
            </div>
            <div className="postButton">
              <BookmarkIcon className="h-6 w-6" />
              <p className="hidden sm:inline">Save</p>
            </div>
            <div className="postButton">
              <EllipsisHorizontalIcon className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default Post
