import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import authRouter from "./routes/auth/auth.js";
import profieRouter from "./routes/profile.js";
import dotenv from "dotenv";
import chatroomRouter from "./routes/chatroom.js";

const app = express();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
var env = dotenv.config;
//Auth Section
app.use('/auth', authRouter);
//Profile Section
app.use('/profile', profieRouter);
//Chatroom
app.use('/chatroom', chatroomRouter);

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
