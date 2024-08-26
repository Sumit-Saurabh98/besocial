import { ScrollArea } from "@/components/ui/scroll-area"

const tags = ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6", "tag7", "tag8", "tag9", "tag10", "tag11", "tag12"];

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
// import { useState } from "react";

// eslint-disable-next-line react/prop-types
const AllComments = ({commentCount, allCommentsOpen, setAllCommentsOpen}) => {
    console.log("all comment count", commentCount)
    // const [isOpen, setIsOpen] = useState(false)
  return (
    <Collapsible
      open={allCommentsOpen}
      onOpenChange={setAllCommentsOpen}
      className="w-[100%] space-y-2"
    >
      <div className="flex items-center justify-between space-x-4">
        <CollapsibleTrigger asChild>
        <h4 className="text-sm font-semibold hover:cursor-pointer">
          View all {commentCount} comments
        </h4>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="space-y-2">
        
         <ScrollArea className="h-[20vh] w-[100%] rounded-md border">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
        {tags.map((tag, index) => (
          <div key={index} className="text-sm">
            {tag}
          </div>
        ))}
      </div>
    </ScrollArea>
      </CollapsibleContent>
    </Collapsible>
  )
}

export default AllComments;