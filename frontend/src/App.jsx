

import './App.css'
import Home from './pages/Home'
import Login from './pages/Login'
import MainLayout from './pages/MainLayout'
import Profile from './pages/Profile'
import Signup from './pages/Signup'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout/>,
    children:[
      {
        path: "/",
        element: <Home/>
      },
      {
        path: "/profile",
        element: <Profile/>
      }
    ]
  },
  {
    path: "/signup",
    element: <Signup/>
  },
  {
    path: "/login",
    element: <Login/>
  }
])

function App() {

  return (
    <>
      <RouterProvider router={browserRouter}/>
    </>
  )
}

export default App
