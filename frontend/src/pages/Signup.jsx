import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import axios from "axios";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const signUpHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log(input);
    try {
      const response = await axios.post(
        "http://localhost:5001/api/v1/user/register",
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        console.log(response.data);
        toast.success(response.data.message);
        setLoading(false);
        setInput({
          username: "",
          email: "",
          password: "",
        });
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex items-center w-full h-screen justify-center">
      <form
        onSubmit={signUpHandler}
        className="shadow-lg flex flex-col gap-2 p-8"
      >
        <div>
          <h1 className="text-center font-extrabold text-2xl pb-2">BESOCIAL</h1>
          <p className="text-sm text-gray-500 text-center">
            Sign up to see photos & and videos from your friends.
          </p>
        </div>
        <div>
          <label>Username</label>
          <Input
            type="text"
            className="focus-visible:ring-transparent my-2"
            name="username"
            value={input.username}
            onChange={changeEventHandler}
          />
        </div>
        <div>
          <label>Email</label>
          <Input
            type="email"
            className="focus-visible:ring-transparent my-2"
            name="email"
            value={input.email}
            onChange={changeEventHandler}
          />
        </div>
        <div>
          <label>Password</label>
          <Input
            type="password"
            className="focus-visible:ring-transparent my-2"
            name="password"
            value={input.password}
            onChange={changeEventHandler}
          />
        </div>
        <Button type="submit">
          {loading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            "Sign Up"
          )}
        </Button>
        <p className=" pt-2 text-center">
          Already have an account?{" "}
          <Link className="text-blue-600 underline" to="/login">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
