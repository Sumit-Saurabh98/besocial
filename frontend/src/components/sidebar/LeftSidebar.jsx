import {
  Heart,
  Home,
  Loader2,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import CreatePost from "../createPost/CreatePost";

const LeftSidebar = () => {
  const [createPostDialogOpen, setCreatePostDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const sidebarItems = [
    {
      icon: <Search />,
      text: "Search",
      link: "/search",
    },
    {
      icon: <TrendingUp />,
      text: "Explore",
      link: "/explore",
    },
    {
      icon: <MessageCircle />,
      text: "Messages",
      link: "/messages",
    },
    {
      icon: <Heart />,
      text: "Notifications",
      link: "/notifications",
    },
    {
      icon: (
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
      link: "/profile",
    },
  ];

  const handleLogout = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:5001/api/v1/user/logout",
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setLoading(false);
        navigate("/login");
      }
    } catch (error) {
      console(error);
      toast(error.response.data.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="w-full h-full relative">
        <Link to="/" className="mb-10 px-2 lg:block sm:hidden md:hidden hidden">
          <img
            src="https://kq-storage.s3.ap-south-1.amazonaws.com/logo.png"
            className="w-28 h-auto"
            alt="Instagram Logo"
          />
        </Link>

        <div className="w-full h-auto flex items-center flex-col gap-y-2">
          <Link
            to="/"
            className="w-full h-auto flex items-center gap-x-4 p-3 bg-transparent hover:bg-gray-300 rounded-md ease-out duration-500 group "
          >
            <Home className="text-2xl" />
            <p className="text-lg lg:block md:hidden sm:hidden hidden ">Home</p>
          </Link>
          <div className="w-full h-auto flex items-center gap-x-4 p-3 bg-transparent hover:bg-gray-300 rounded-md ease-out duration-500 group cursor-pointer" onClick={()=>setCreatePostDialogOpen(!createPostDialogOpen)}>
            <PlusSquare className="text-2xl" />
            <p className="text-lg lg:block md:hidden sm:hidden hidden ">
              Create Post
            </p>
          </div>
          {sidebarItems.map((item) => (
            <Link
              to={item.link}
              key={item.text}
              className="w-full h-auto flex items-center gap-x-4 p-3 bg-transparent hover:bg-gray-300 rounded-md ease-out duration-500 group"
            >
              {item.icon}
              <p className="text-lg lg:block md:hidden sm:hidden hidden ">
                {item.text}
              </p>
            </Link>
          ))}
          <div className="w-full h-auto flex items-center gap-x-4 p-3 bg-transparent hover:bg-gray-300 rounded-md ease-out duration-500 group cursor-pointer">
            <LogOut onClick={handleLogout} className="text-2xl" />
            <p className="text-lg lg:block md:hidden sm:hidden hidden ">
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                "Login"
              )}
            </p>
          </div>
        </div>
      </div>
      <CreatePost createPostDialogOpen = {createPostDialogOpen} setCreatePostDialogOpen={setCreatePostDialogOpen}/>
    </>
  );
};

export default LeftSidebar;
