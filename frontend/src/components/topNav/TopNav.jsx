import axios from "axios"
import { Loader2, Search } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"



const TopNav = ()=>{
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleLogout = async () =>{
        try {
            setLoading(true)
            const response = await axios.get('http://localhost:5001/api/v1/user/logout', {
                withCredentials: true})

            if(response.data.success){
                toast.success(response.data.message)
                setLoading(false)
               navigate("/login")
            }
        } catch (error) {
            console(error);
            toast(error.response.data.message)
            setLoading(false)
        }finally{
            setLoading(false)
        }
    }
    return(
        <div className="w-full h-auto flex items-center justify-center bg-light">
            <div className="relative w-full py-2">
                <input type="text" placeholder="Search" className="w-full bg-gray-200 rounded-full px-4 py-2 text-sm text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-blue-600" />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    <Search></Search>
                </button>
            </div>
            <button onClick={handleLogout} className="bg-red-500 ml-2 px-4 py-2 text-white rounded cursor-pointer hover:bg-red-600">{loading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            "Login"
          )}</button>
        </div>
    )
}
export default TopNav
