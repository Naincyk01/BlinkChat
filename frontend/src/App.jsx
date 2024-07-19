import './App.css';
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';
// import {io} from "socket.io-client";
import Login from './pages/Login.jsx';
import SignIn from './pages/SignIn.jsx';

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
        path:"signin",
        element:<SignIn/>
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
