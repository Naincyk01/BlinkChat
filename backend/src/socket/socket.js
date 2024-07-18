import { Server } from "socket.io";
import { app } from "../app.js";
import { createServer } from "node:http"

const server = createServer(app);

const io = new Server(server)




export { server, io }