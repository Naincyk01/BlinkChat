import './App.css';
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';
import Login from './pages/Login.jsx';
import SignUp from './pages/SignUp.jsx';
import ChatInterface from './pages/ChatInterface.jsx';
import { ChatProvider } from './context/ChatContext.jsx';

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
  return (
  <ChatProvider>
    <RouterProvider router={appRouter}>
      <AppLayout />
    </RouterProvider>

  </ChatProvider>
    
  )
}

export default App;
