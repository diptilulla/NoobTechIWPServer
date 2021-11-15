import mongoose from "mongoose";

const jwtSchema = mongoose.Schema({
    token: String,
});

const JwtModel = new mongoose.model("JwtModel", jwtSchema);

export default JwtModel;