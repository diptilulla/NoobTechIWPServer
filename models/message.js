import mongoose from "mongoose";

const messageSchema = mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  chatroom_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  user_name: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  content: { type: String, default: null },
});

const Message = new mongoose.model("Message", messageSchema);

export default Message;
