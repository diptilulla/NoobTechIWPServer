import express from "express";
import Chatroom from "../models/chatroom.js";
import Task from "../models/task.js";
const taskRouter = express.Router();

taskRouter.post("/settask", async (req, res) => {
  try {
    const task = new Task(req.body);
    task.save(function (err, doc) {
      if (err) return res.json({ success: false, data: err.message });
      else {
        const { _id, chatroom_id } = doc;
        Chatroom.findByIdAndUpdate(
          chatroom_id,
          { $push: { tasks: _id } },
          { new: true },
          function (err, docs) {
            if (err) return res.json({ success: false, data: err.message });
          }
        );
      }
      return res.json({ success: true, data: doc });
    });
  } catch (err) {
    return res.json({ success: false, data: err.message });
  }
});

taskRouter.put("/movetask", async (req, res) => {
  try {
    const { chatroom_id, task_arr } = req.body;
    Chatroom.findByIdAndUpdate(
      chatroom_id,
      { tasks: task_arr },
      { new: true },
      (err, doc) => {
        if (err) return res.json({ success: false, data: err.message });
        return res.json({
          success: true,
          data: doc.tasks
        });
      }
    );
  } catch (err) {
    return res.json({ success: false, data: err.message });
  }
});

taskRouter.put("/droptask", async (req, res) => {
  try {
    const { _id, task_arr, ...task } = req.body;
    Task.findByIdAndUpdate(_id, task, { new: true }, (err, docs) => {
      if (err) return res.json({ success: false, data: err.message });
      else {
        Chatroom.findByIdAndUpdate(
          task.chatroom_id,
          { tasks: task_arr },
          { new: true },
          (err, doc) => {
            if (err) return res.json({ success: false, data: err.message });
            else
              return res.json({
                success: true,
                data: {
                  data: docs,
                  task_arr: doc.tasks
                }
              });
          }
        );
      }
    });
  } catch (err) {
    return res.json({ success: false, data: err.message });
  }
});

taskRouter.post("/deletetask", async (req, res) => {
  try {
    const { _id, chatroom_id } = req.body;
    Task.findByIdAndDelete(_id, (err, t) => {
      if (err) return res.json({ success: false, data: err.message });
    });
    Chatroom.findByIdAndUpdate(
      chatroom_id,
      { $pull: { tasks: _id } },
      (err, docs) => {
        if (err) return res.json({ success: false, data: err.message });
      }
    );
    return res.json({ success: true });
  } catch (err) {
    return res.json({ success: false, data: err.message });
  }
});

taskRouter.post("/getallchatroomtasks", async (req, res) => {
  try {
    const { chatroom_id } = req.body;
    Task.find(
      { chatroom_id },
      null,
      { sort: { ind: 1 } },
      function (err, docs) {
        if (err) return res.json({ success: false, data: err.message });
        else {
          return res.json({ success: true, data: docs });
        }
      }
    );
  } catch (err) {
    return res.json({ success: false, data: err.message });
  }
});

export default taskRouter;
