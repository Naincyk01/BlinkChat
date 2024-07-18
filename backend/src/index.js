import dotenv from "dotenv"
import { app } from "./app.js"
import connectDB from "./db/index.js"
import { server } from './socket/socket.js';

dotenv.config({
  path: "./env"
})

connectDB()
.then(() => {
  server.on('ERROR', error => {
    console.log('Error: ', error);
    throw error;
  });
    server.listen(process.env.PORT || 9000, () => {
      console.log(`Server is running at port :${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connect failed !!!", err);
  });
