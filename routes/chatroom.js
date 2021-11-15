import express from "express";
import Chatroom from "../models/chatroom.js";

import mong from "mongodb";
const ObjectID = mong.ObjectId;
const chatroomRouter = express.Router();

chatroomRouter.post("/setchatroom", async (req, res, next) => {
  try {
    if (req.body._id) {
      const { _id, ...profile } = req.body;
      Profile.findByIdAndUpdate(_id, profile, function (err, docs) {
        if (err) return res.json({ success: false, data: err.message });
        else return res.json({ success: true, data: docs });
      });
    } else {
      const chatroom = new Chatroom(req.body);
      chatroom.save(function (err, docs) {
        if (err) return res.json({ success: false, data: err.message });
        else {
          return res.json({ success: true, data: docs });
        }
      });
    }
  } catch (err) {
    return res.json({ success: false, data: err.message });
  }
});

chatroomRouter.post("/joinchatroom", async (req, res, next) => {
  try {
    const { _id, user_id } = req.body;
    console.log(new ObjectID(user_id));
    Chatroom.update(
      { _id },
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

// chatroomRouter.post('/getchatroom', async (req, res, next) => {
//     try {
//         const {user_id} = req.body;
//         Profile.findOne({user_id}, (err, profile) => {
//             if(err)
//                 return res.json({ success: false, data: "profile does not exist" });
//             else return res.json({ success: true, data: profile });
//         })
//     }
//     catch (err) {
//         return res.json({ "success": false, "data": err.message });
//     }
// });
// chatroomRouter.post('/deletechatroom', async (req, res, next) => {
//   try {
//     const {user_id, profile_id} = req.body;
//     Profile.findByIdAndDelete(profile_id, (err, profile) => {
//         if(err)
//             return res.json({ success: false, data: err.message });
//     });
//     Auth.findByIdAndDelete(user_id, (err, user) => {
//         if(err)
//             return res.json({ success: false, data: err.message });
//     });
//     return res.json({ "success": true });
//   }
//   catch (err) {
//       return res.json({ "success": false, "data": err.message });
//   }
// });

chatroomRouter.get("/getallchatrooms", async (req, res, next) => {
  try {
    Chatroom.find({}, null, { sort: { timestamp: -1 } }, (err, docs) => {
      if (err) return res.json({ success: false, data: err.message });
      if (!docs.length)
        return res.json({ success: false, data: "chatrooms not found" });
      else {
        return res.json({
          success: true,
          data: docs,
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
            data: docs,
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
            data: docs,
          });
        }
      }
    );
  } catch (err) {
    return res.json({ success: false, data: err.message });
  }
});

export default chatroomRouter;
