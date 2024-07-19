import './App.css';
import {io} from "socket.io-client";

function App() {
  const socket =io("http://localhost:9000")
  return <div className="bg-green-300 h-16 border-2 border-gray-950">BlinkChat</div>;
}

export default App;
