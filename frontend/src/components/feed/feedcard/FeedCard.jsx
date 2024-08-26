import {
  FaHeart,
  FaRegComment,
  FaRegPaperPlane,
  FaRegBookmark,
} from "react-icons/fa";
import PropTypes from "prop-types";
import { BsThreeDots } from "react-icons/bs";
import { useState } from "react";
import UnfollowDialog from "@/components/unfollowDialog/UnfollowDialog";
import AllComments from "@/components/allComments/AllComments";
import EmojiPicker, { Theme } from "emoji-picker-react";
import useComponentVisible from "@/hooks/useComponentVisible";
import { Laugh } from "lucide-react";



const FeedCard = ({ feed }) => {
  const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);
  const [comment, setComment] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false)
  const [allCommentsOpen, setAllCommentsOpen] = useState(false)
  FeedCard.propTypes = {
  feed: PropTypes.object.isRequired,
};

const handleComment = (e) =>{
  const trueComment = e.target.value;
  if(trueComment.trim().length>0){
    setComment(trueComment)
  }else{
    setComment("")
  }
}
  return (
    <div className="w-full mx-auto mb-6 bg-white p-4 rounded-lg">
      {/* Profile Picture , Username , Time  */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-x-3">
          <a href="" className="flex items-center">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300">
              <img
                src={feed.profileImg}
                alt="profile-img"
                className="w-full h-full object-cover"
              />
            </div>
          </a>
          <div className="flex items-center gap-x-2">
            <p className="text-black text-sm font-medium">{feed.username}</p>
            <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
            <p className="text-black text-sm">{feed.time}</p>
          </div>
        </div>
        <BsThreeDots className="size-5 hover:cursor-pointer" onClick={() => setDialogOpen(true)}/>
      </div>
      <UnfollowDialog dialogOpen={dialogOpen} setDialogOpen={setDialogOpen}/>
      {/* Post Image */}
      <div className="w-full max-h-[75vh] overflow-hidden rounder-lg mb-3">
        <img
          src={feed.postImg}
          alt={feed.caption}
          className="w-full h-full object-cover"
        />
      </div>

      {/* User Actions - Like, comment share and save  */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-x-3">
          <button
            className="text-black"
          >
           <FaHeart/>
          </button>
          <button className="text-black">
            <FaRegComment onClick={()=>setAllCommentsOpen(!allCommentsOpen)}></FaRegComment>
          </button>
          <button className="text-black">
            <FaRegPaperPlane></FaRegPaperPlane>
          </button>
        </div>

        <button className="text-black">
          <FaRegBookmark></FaRegBookmark>
        </button>
      </div>
      {/* Like Count */}
      <div className="flex items-center gap-x-2 text-base text-black font-medium my-2">
       {feed.likeCount} likes
      </div>

      {/* Caption */}
      <div className="w-full text-sm text-black font-thin mb-2">
        <a href="" className="text-black font-medium pr-2">
          {feed.username}
        </a>
        {feed.caption}
      </div>

      {/* Comment Count */}
      <div className="w-full text-sm text-gray-600 font-thin mb-2">
        <AllComments commentCount={feed.commentCount} allCommentsOpen={allCommentsOpen} setAllCommentsOpen={setAllCommentsOpen}/>
      </div>

      {/* Add Comment  */}
      <div className="w-full flex iteme-center justify-between border-b border-gray-300 pt-2">
        <input
          type="text"
          value={comment}
          onChange={handleComment}
          className="w-full bg-transparent border-none outline-none text-sm text-gray-600 py-2"
          placeholder="Add a Comment ...."
        />
        <div className="text-black flex items-center gap-x-2">
          <div ref={ref} onClick={() => setIsComponentVisible(true)}>
					{isComponentVisible && (
						<EmojiPicker
							theme={Theme.LIGHT}
							onEmojiClick={(emojiObject) => {
								setComment((prev) => prev + emojiObject.emoji);
							}}
							style={{position: "absolute", right: "1.5rem", zIndex: 50 }}
						/>
					)}
					<Laugh className='text-gray-600 dark:text-gray-400' />
				</div>
          {
            comment && <button
            className="bg-blue-500 text-white py-1 px-2 text-sm rounded hover:bg-blue-600"
          >
            Post
          </button>
          }
        </div>
      </div>
    </div>
  );
};
export default FeedCard;
