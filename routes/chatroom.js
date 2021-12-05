import express from "express";
import Chatroom from "../models/chatroom.js";
import Task from "../models/task.js";
import Message from "../models/message.js";

import mong from "mongodb";
import axios from "axios";
const ObjectID = mong.ObjectId;
const chatroomRouter = express.Router();

chatroomRouter.post("/setchatroom", async (req, res, next) => {
  try {
    const chatroom = new Chatroom(req.body);
    chatroom.save(async function (err, docs) {
      if (err) return res.json({ success: false, data: err.message });
      else {
        await axios.post(
          process.env.PUSH_SERVER_LINK + "send-notif-interest",
          {
            interests: req.body.interests,
            body: req.body.description,
            title: `Check out new chatroom: ${req.body.name}`,
            url: `${process.env.FRONTEND_LINK}/chatroom/${docs._id}`
          },
          {
            "Content-Type": "application/json"
          }
        );
        return res.json({ success: true, data: docs });
      }
    });
  } catch (err) {
    return res.json({ success: false, data: err.message });
  }
});

chatroomRouter.post("/joinchatroom", async (req, res, next) => {
  try {
    const { chatroom_id, user_id } = req.body;
    console.log(new ObjectID(user_id));
    Chatroom.findByIdAndUpdate(
      chatroom_id,
      { $push: { user_ids: new ObjectID(user_id) } },
      function (err, docs) {
        if (err) return res.json({ success: false, data: err.message });
        else {
          console.log(docs);
          return res.json({ success: true });
        }
      }
    );
  } catch (err) {
    return res.json({ success: false, data: err.message });
  }
});

chatroomRouter.post("/leavechatroom", async (req, res, next) => {
  try {
    const { _id, user_id } = req.body;
    console.log(new ObjectID(user_id));
    Chatroom.update(
      { _id },
      { $pull: { user_ids: new ObjectID(user_id) } },
      { new: true },
      function (err, docs) {
        if (err) return res.json({ success: false, data: err.message });
        else {
          console.log(docs);
          return res.json({ success: true });
        }
      }
    );
  } catch (err) {
    return res.json({ success: false, data: err.message });
  }
});

chatroomRouter.post("/getchatroom", async (req, res, next) => {
  try {
    const { chatroom_id } = req.body;
    Chatroom.findById(chatroom_id, (err, chatroom) => {
      if (err)
        return res.json({ success: false, data: "chatroom does not exist" });
      else return res.json({ success: true, data: chatroom });
    });
  } catch (err) {
    return res.json({ success: false, data: err.message });
  }
});

chatroomRouter.post("/deletechatroom", async (req, res, next) => {
  try {
    const { chatroom_id } = req.body;
    Task.deleteMany({ chatroom_id }, null, function (err, docs) {
      if (err) return res.json({ success: false, data: err.message });
    });
    Message.deleteMany({ chatroom_id }, null, function (err, docs) {
      if (err) return res.json({ success: false, data: err.message });
    });
    Chatroom.findByIdAndDelete(chatroom_id, (err, chatroom) => {
      if (err) return res.json({ success: false, data: err.message });
      console.log(chatroom);
    });
    return res.json({ success: true });
  } catch (err) {
    return res.json({ success: false, data: err.message });
  }
});

chatroomRouter.get("/getallchatrooms", async (req, res, next) => {
  try {
    Chatroom.find({}, null, { sort: { timestamp: -1 } }, (err, docs) => {
      if (err) return res.json({ success: false, data: err.message });
      if (!docs.length)
        return res.json({ success: false, data: "chatrooms not found" });
      else {
        return res.json({
          success: true,
          data: docs
        });
      }
    });
  } catch (err) {
    return res.json({ success: false, data: err.message });
  }
});

chatroomRouter.post("/getallinterestchatrooms", async (req, res, next) => {
  try {
    const { interests } = req.body;
    Chatroom.find(
      { interests: { $in: interests } },
      null,
      { sort: { timestamp: -1 } },
      // (err, docs) => {
      //   if (err) return res.json({ success: false, data: err.message });
      // }
      function (err, docs) {
        if (err) return res.json({ success: false, data: err.message });
        if (!docs.length)
          return res.json({ success: false, data: "chatrooms not found" });
        else {
          return res.json({
            success: true,
            data: docs
          });
        }
      }
    );
  } catch (err) {
    return res.json({ success: false, data: err.message });
  }
});

chatroomRouter.post("/getalluserchatrooms", async (req, res, next) => {
  try {
    const { user_id } = req.body;
    Chatroom.find(
      { user_ids: new ObjectID(user_id) },
      null,
      { sort: { timestamp: -1 } },
      function (err, docs) {
        if (err) return res.json({ success: false, data: err.message });
        if (!docs.length)
          return res.json({ success: false, data: "chatrooms not found" });
        else {
          console.log(docs);
          return res.json({
            success: true,
            data: docs
          });
        }
      }
    );
  } catch (err) {
    return res.json({ success: false, data: err.message });
  }
});

export default chatroomRouter;
