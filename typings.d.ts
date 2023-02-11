type Comment = {
  username: string
  text: string
  post_id: number
  id: number
  created_at: string
}

type Vote = {
  username: string
  upvote: boolean
  post_id: number
  id: number
  created_at: string
}

type Subreddit = {
  topic: string
  id: number
  created_at: string
}

type Post = {
    vote: vote[]
    username: string
    title: string
    subreddit_id: number
    subreddit: subreddit
    image: string
    id: number
    created_at: number
    comment: comment[]
    body: string
  }
