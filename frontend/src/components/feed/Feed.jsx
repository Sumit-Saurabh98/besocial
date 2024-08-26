import FeedCard from "./feedcard/FeedCard";

const Feed = () => {

    const feed = {
    id: 1,
    profileImg: 'https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTAxL3JtNjA5LXNvbGlkaWNvbi13LTAwMi1wLnBuZw.png',
    username: 'john_doe',
    time: '2h',
    postImg: 'https://miro.medium.com/v2/resize:fit:1400/1*zurzWYgv6-4L123HBwzsKA.jpeg',
    likeCount: 150,
    mutualFrndImg1: 'https://via.placeholder.com/50',
    mutualFrndImg2: 'https://via.placeholder.com/50',
    commentCount: 20,
    caption: 'Enjoying the sunset!',
  };
  return (
    <div className="w-full min-h-screen lg:py-7 sm:py-3 flex flex-col lg:flex-row items-start gap-x-20 mt-5 pt-5 mb-5">
      <div className="w-full lg:w-[70%] h-auto relative">
        <div className="w-full h-auto flex items-center justify-center mt-6 mb-6">
          <div className="w-full lg:w-[73%] md:w-[73%] sm:w-[80%]">
            <FeedCard feed={feed}></FeedCard>
            <FeedCard feed={feed}></FeedCard>
            <FeedCard feed={feed}></FeedCard>
          </div>
        </div>
      </div>
      <div className="w-full lg:w-[25%] h-auto lg:block hidden"></div>
    </div>
  );
};

export default Feed;
