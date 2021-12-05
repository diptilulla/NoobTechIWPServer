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

profieRouter.post("/getallcprofilesrole", async (req, res, next) => {
  try {
    var result = await db.query(
      "SELECT * FROM public.cprofile WHERE content ->>'role' ='" +
        req.body.role +
        "';"
    );
    console.log(result.rows);
    if (result.rows) return res.json({ success: true, data: result.rows });
    else return res.json({ success: false, data: "profile does not exist" });
  } catch (err) {
    return res.json({ success: false, data: err.message });
  }
});

profieRouter.get("/getallcprofiles", async (req, res, next) => {
  try {
    var result = await db.query("SELECT * FROM public.cprofile;");
    console.log(result.rows);
    return res.json({ success: true, data: result.rows });
  } catch (err) {
    return res.json({ success: false, data: err.message });
  }
});

profieRouter.post("/getallcprofilesrole", async (req, res, next) => {
  try {
    var result = await db.query(
      "SELECT * FROM public.cprofile WHERE content ->>'role' ='" +
        req.body.role +
        "';"
    );
    console.log(result.rows);
    if (result.rows) return res.json({ success: true, data: result.rows });
    else return res.json({ success: false, data: "profile does not exist" });
  } catch (err) {
    return res.json({ success: false, data: err.message });
  }
});

profieRouter.get("/getallcprofiles", async (req, res, next) => {
  try {
    var result = await db.query("SELECT * FROM public.cprofile;");
    console.log(result.rows);
    return res.json({ success: true, data: result.rows });
  } catch (err) {
    return res.json({ success: false, data: err.message });
  }
});

profieRouter.post("/getsuggestedcprofiles", async (req, res, next) => {
  try {
    var result = await db.query(
      "SELECT * FROM public.cprofile WHERE user_name iLIKE '%" +
        req.body.keyword +
        "%';"
    );
    if (result.rowCount == 0)
      return res.json({ success: false, data: "profile Not Found in DB" });
    return res.json({ success: true, data: result.rows });
  } catch (err) {
    return res.json({ success: false, data: err.message });
  }
});

export default profieRouter;
