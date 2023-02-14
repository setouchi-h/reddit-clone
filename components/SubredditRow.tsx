import { ChevronUpIcon } from "@heroicons/react/24/outline"

type Props = {
  topic: string
  index: number
}

function SubredditRow({ index, topic }: Props) {
  return (
    <div className="flex items-center space-x-2 border-t bg-white px-4 py-2 last:rounded-b">
      <p>{index + 1}</p>
      <ChevronUpIcon className="h-4 w-4 flex-shrink-0 text-green-400" />
    </div>
  )
}

export default SubredditRow
