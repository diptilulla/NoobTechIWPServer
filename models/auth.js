import mongoose from "mongoose";

const authSchema = mongoose.Schema({
    email: String,
    password: String,
});

const Auth = new mongoose.model("Auth", authSchema);

export default Auth;