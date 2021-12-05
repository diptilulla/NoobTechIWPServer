import express from "express";
import tokenFunctions from "./jwt.js";
import Auth from "../../models/auth.js";

const authRouter = express.Router();

authRouter.get("/isauth", tokenFunctions.authToken, async (req, res, next) => {
  res.json({ success: true });
});

authRouter.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    Auth.findOne({ email }, (err, userauth) => {
      if (userauth)
        return res.json({ success: false, data: "User already exists" });
    });
    const userauth = new Auth({
      email,
      password
    });
    userauth.save((err, docs) => {
      if (err) return res.json({ success: false, data: err.message });
      else {
        return res.json({ success: true, data: { id: docs.id } });
      }
    });
  } catch (err) {
    return res.json({ success: false, data: err.message });
  }
});
authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    Auth.findOne({ email, password }, (err, userauth) => {
      if (err)
        return res.json({ success: false, data: "Credentials are wrong" });
      else {
        if (userauth)
          return res.json({ success: true, data: { id: userauth.id } });
        else return res.json({ success: false, data: "Credentials are wrong" });
      }
    });
  } catch (err) {
    return res.json({ success: false, data: err.message });
  }
});

authRouter.post(
  "/refresh",
  tokenFunctions.refreshToken,
  async (req, res, next) => {}
);

authRouter.post(
  "/logout",
  tokenFunctions.deleteToken,
  async (req, res, next) => {}
);

export default authRouter;
