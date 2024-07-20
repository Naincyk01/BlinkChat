import './App.css';
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';
// import {io} from "socket.io-client";
import Login from './pages/Login.jsx';
import SignUp from './pages/SignUp.jsx';
import ChatInterface from './pages/ChatInterface.jsx';

const AppLayout = () => {
  return (
    <div className="h-screen w-full">
      <Outlet/>
    </div>
  );
}

const appRouter = createBrowserRouter([
  {
    path:"/",
    element:<AppLayout/>,
    children:[
      {
        path:"/",
        element:<Login/>
      },
      {
        path:"signup",
        element:<SignUp/>
      },
      {
        path:"chatinterface",
        element:<ChatInterface/>
      },
    ]
  }
])

const App = () => {
  // const socket =io("http://localhost:9000")
  return (
  
      <RouterProvider router ={appRouter}/>
    
  )
}

export default App;
