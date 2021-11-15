import mongoose from "mongoose";

const chatroomSchema = mongoose.Schema({
  user_ids: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  },
  name: { type: String, default: "" },
  timestamp: { type: Date, default: Date.now},
  avatar: { type: String, default: null },
  description: {type: String, default: null},
  interests: {
    type: [String],
    default: [],
  },
});

const Chatroom = new mongoose.model("Chatroom", chatroomSchema);

export default Chatroom;
