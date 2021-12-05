import express from "express";
import Message from "../models/message.js";
const messageRouter = express.Router();

messageRouter.post("/setchatroommessage", async (req, res) => {
  try {
    const msg = new Message(req.body);
    msg.save(function (err, docs) {
      if (err) return res.json({ success: false, data: err.message });
      else {
        return res.json({ success: true, data: docs });
      }
    });
  } catch (err) {
    return res.json({ success: false, data: err.message });
  }
});

messageRouter.post("/deletechatroommessage", async (req, res) => {
  try {
    const { _id } = req.body;
    Message.findByIdAndDelete(_id, (err, msg) => {
      if (err) return res.json({ success: false, data: err.message });
    });
  } catch (err) {
    return res.json({ success: false, data: err.message });
  }
});

messageRouter.post("/getallchatroommessages", async (req, res) => {
  try {
    const { chatroom_id } = req.body;
    Message.find({ chatroom_id }, function (err, docs) {
      if (err) return res.json({ success: false, data: err.message });
      else return res.json({ success: true, data: docs });
    });
  } catch (err) {
    return res.json({ success: false, data: err.message });
  }
});

export default messageRouter;
