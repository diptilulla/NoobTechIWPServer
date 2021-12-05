import mongoose from "mongoose";

const taskSchema = mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  chatroom_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  icon: {
    type: String,
    default: "⭕️"
  },
  status: {
    type: String,
    default: "open"
  },
  timestamp: { type: Date, default: Date.now },
  title: String,
  content: String,
});

const Task = new mongoose.model("Task", taskSchema);

export default Task;
