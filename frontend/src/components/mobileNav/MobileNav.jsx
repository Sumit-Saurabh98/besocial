import { Heart, Home, MessageCircle, Search, SquarePlus, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import CreatePost from "../createPost/CreatePost";
import { useState } from "react";

const MobileNav = () => {
   const [createPostDialogOpen, setCreatePostDialogOpen] = useState(false);

    const sidebarItems = [
    {
      icon: <Search />,
      text: "Search",
      link: "/search"
    },
    {
      icon: <TrendingUp />,
      text: "Explore",
      link: "/explore"
    },
    {
      icon: <MessageCircle />,
      text: "Messages",
      link: "/messages"
    },
    {
      icon: <Heart />,
      text: "Notifications",
      link: "/notifications"
    },
    {
      icon: (
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
      link:"/profile"
    }
  ];


  return (
    <>
      <div>
        <div className="w-full h-auto">
          <div className="w-full h-auto flex items-center gap-px-2">
            <Link
              to="/"
              className="w-full h-auto flex items-center gap-x-4 p-3 bg-transparent hover:bg-gray-300 rounded-md ease-out duration-500 group "
            >
              <Home className="text-xl"/>
            </Link>
            <div className="w-full h-auto flex items-center gap-x-4 p-3 bg-transparent hover:bg-gray-300 rounded-md ease-out duration-500 group">
              <SquarePlus className="text-xl" onClick={() => setCreatePostDialogOpen(!createPostDialogOpen)} />
            </div>
            {sidebarItems.map((item) => (
              <Link
                to={item.link}
                key={item.text}
                className="w-full h-auto flex items-center gap-x-4 p-3 bg-transparent hover:bg-gray-300 rounded-md ease-out duration-500 group "
              >
                {item.icon}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="hidden">
        <CreatePost createPostDialogOpen={createPostDialogOpen} setCreatePostDialogOpen={setCreatePostDialogOpen}/>
      </div>
    </>
  );
};

export default MobileNav;