import express from "express";
// import {tokenFunctions.authToken} from "./auth/jwt";
import Auth from "../models/auth.js";
import Profile from "../models/profile.js";
import tokenFunctions from "./auth/jwt.js";

const profieRouter = express.Router();

profieRouter.post("/setprofile", async (req, res, next) => {
  try {
    if (req.body.id !== undefined) {
      const { id, ...profile } = req.body;
      Profile.findByIdAndUpdate(
        id,
        profile,
        { new: true },
        function (err, docs) {
          if (err) return res.json({ success: false, data: err.message });
          else {
            const {
              _doc: { _id, ...otherProfileDetails }
            } = docs;
            return res.json({
              success: true,
              data: { id: _id, ...otherProfileDetails }
            });
          }
        }
      );
    } else {
      const profile = new Profile(req.body);
      profile.save(function (err, profile) {
        if (err) return res.json({ success: false, data: err.message });
        else {
          const {
            _doc: { _id, ...otherProfileDetails }
          } = profile;
          return res.json({
            success: true,
            data: { id: _id, ...otherProfileDetails }
          });
        }
      });
    }
  } catch (err) {
    return res.json({ success: false, data: err.message });
  }
});

profieRouter.post("/getprofile", async (req, res, next) => {
  try {
    const { user_id } = req.body;
    Profile.findOne({ user_id }, (err, profile) => {
      if (err)
        return res.json({ success: false, data: "profile does not exist" });
      else {
        const {
          _doc: { _id, ...otherProfileDetails }
        } = profile;
        return res.json({
          success: true,
          data: { id: _id, ...otherProfileDetails }
        });
      }
    });
  } catch (err) {
    return res.json({ success: false, data: err.message });
  }
});
profieRouter.post("/deleteprofile", async (req, res, next) => {
  try {
    const { user_id, profile_id } = req.body;
    Profile.findByIdAndDelete(profile_id, (err, profile) => {
      if (err) return res.json({ success: false, data: err.message });
    });
    Auth.findByIdAndDelete(user_id, (err, user) => {
      if (err) return res.json({ success: false, data: err.message });
    });
    return res.json({ success: true });
  } catch (err) {
    return res.json({ success: false, data: err.message });
  }
});

export default profieRouter;
