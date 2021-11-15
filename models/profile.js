import mongoose from "mongoose";

const profileSchema = mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  user_name: { type: String, default: "" },
  profile_img: { type: String, default: null },
  interests: {
    type: [String],
    default: [],
  },
});

const Profile = new mongoose.model("Profile", profileSchema);

export default Profile;
