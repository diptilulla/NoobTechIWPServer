// config.js
import dotenv from "dotenv";
dotenv.config({ silent: process.env.NODE_ENV === "production" });

// server.js <- make this your entry point
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import authRouter from "./routes/auth/auth.js";
import profieRouter from "./routes/profile.js";
import chatroomRouter from "./routes/chatroom.js";
import messageRouter from "./routes/message.js";
import { WebSocketServer } from "ws";
import taskRouter from "./routes/task.js";

const wssg = new WebSocketServer({
  port: process.env.SOCKET_PORT_1 || 3002
});
var clientGroups = [];
wssg.on("connection", function connection(ws) {
  ws.on("message", (message) => {
    console.log(message);
    var m = JSON.parse(message);
    if (clientGroups[m["chatroom_id"]] === undefined) {
      clientGroups[m["chatroom_id"]] = new Set();
      clientGroups[m["chatroom_id"]].add(ws);
    } else {
      clientGroups[m["chatroom_id"]].add(ws);
    }

    for (const client of clientGroups[m["chatroom_id"]]) {
      client.send(JSON.stringify(m));
    }
  });
});

const app = express();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
var env = dotenv.config;
//Auth Section
app.use("/auth", authRouter);
//Profile Section
app.use("/profile", profieRouter);
//Chatroom
app.use("/chatroom", chatroomRouter);
//Chatroom -> Messages
app.use("/chatroom/message", messageRouter);
//Chatroom -> Tasks
app.use("/chatroom/task", taskRouter);

const CONNECTION_URL =
  "mongodb+srv://dipti:Mamma6543@cluster0.s0dnh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const PORT = process.env.PORT || 3001;
console.log(process.env.PORT);
mongoose
  .connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))
  )
  .catch((err) => console.log(err.message));

// mongoose.set('useFindAndModify', false);
