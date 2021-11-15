import jwt from "jsonwebtoken";
import JwtModel from "../../models/jwt.js";
import Auth from "../../models/auth.js";

let tokenFunctions = {};
tokenFunctions.authToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null)
      return res.json({
        success: false,
        data: "Invalid Token or Authorization Header",
      });

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, accessId) => {
      if (err)
        return res.json({
          success: false,
          data: "Token Signature Invalid",
        });
      else next();
    });
  } catch (err) {
    return res.json({ success: false, data: err.message });
  }
};

tokenFunctions.refreshToken = async (req, res, next) => {
  try {
    const { refresh_token } = req.body;
    if (refresh_token == null)
      return res.json({ success: false, data: "Invalid Token or Data" });

    Jwt.findOne({ token: refresh_token }, (err, token) => {
      if (err)
        return res.json({ success: false, data: "Token Not Found in DB" });
    });

    jwt.verify(
      refresh_token,
      process.env.REFRESH_TOKEN_SECRET,
      (err, accessId) => {
        if (err)
          return res.json({ success: false, data: "Token Signature Invalid" });

        const access_token = jwt.sign(
          { timestamp: Date.now() },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "60m" }
        );
        const data = jwt.sign(
          { success: true, accessToken: access_token },
          process.env.REQUEST_KEY,
          { expiresIn: "5m" }
        );
        return res.json({ data: data });
      }
    );
  } catch (err) {
    return res.json({ success: false, data: err.message });
  }
  next();
};

tokenFunctions.createToken  = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    var idx = "";

    Auth.findOne({ email, password }, function (err, userauth) {
      if (err) {
        return res.json({ success: false, data: "Credential Not Found in DB" });
      }
      else{
        idx = userauth.id;
      } 
    });
    // if (req.body.type === "epass") {
    //   var result = await db.query(
    //     "SELECT * FROM public.auth WHERE password='" +
    //       req.body.password +
    //       "' AND email='" +
    //       req.body.email +
    //       "';"
    //   );
    //   if (result.rowCount == 0)
    //     return res.json({
    //       success: false,
    //       data: "Credential Not Found in DB-1",
    //     });
    // } else {
    //   var result = await db.query(
    //     "SELECT * FROM public.auth WHERE email='" + req.body.email + "';"
    //   );
    //   if (result.rowCount == 0)
    //     return res.json({
    //       success: false,
    //       data: "Credential Not Found in DB-2",
    //     });
    // }
    
    // var result = await db.query(
    //   "SELECT id FROM public.user WHERE email='" + req.body.email + "';"
    // );
    // if (result.rowCount == 0)
    //   return res.json({ success: false, data: "Credential Not Found in DB-3" });
    console.log(process.env.ACCESS_TOKEN_SECRET);
    const access_token = jwt.sign(
      { timestamp: Date.now() },
      "7EE49C857A94778B5329E896417B3BA2251377208821D41EB80961C1B31FDE6816DE195ECB7F4598566F1E096345B91DD0F88B6BD8D8B2965006AC6375CF32D3",
      { expiresIn: "60m" }
    );
    

    const refresh_token = jwt.sign(
      { timestamp: Date.now() },
      "EFF2D78A9D9635EEB63641D6533FFF31574D536615B6B85126D8726CAB361B9681606E3110F397E34BB5BBC61C84CCC74A6A72977EF6A4A87297A63940A2B815",
      { expiresIn: "1440m" }
    );

    // var result = await db.query(
    //   "INSERT INTO public.jwt(token) VALUES ('" + refresh_token + "');"
    // );
    const newtoken = new JwtModel({
      token: refresh_token,
    });
    newtoken.save(function(err, docs) {
      if (err)
        return res.json({
          success: false,
          data: "Unable to Store refresh token in DB",
        });
    });
    // if (result.rowCount == 0)
    //   return res.json({
    //     success: false,
    //     data: "Unable to Store refresh token in DB",
    //   });
    // console.log("S");
    const data = jwt.sign(
      {
        success: true,
        accessToken: access_token,
        refreshToken: refresh_token,
        id: idx,
      },
      "aa",
      { expiresIn: "5m" }
    );
    return res.json({ data: data });
  } catch (err) {
    return res.json({ success: false, data: err.message });
  }
};

tokenFunctions.deleteToken = async (req, res, next) => {
  try {
    const refresh_token = req.body.refreshToken;
    if (refresh_token == null)
      return res.json({ success: false, data: "Invalid Token or Data" });
    // var result = await db.query(
    //   "DELETE FROM public.jwt WHERE token='" + refresh_token + "';"
    // );
    Jwt.findOne({ token: refresh_token }, (err, token) => {
      if (err) return res.json({ success: false, data: err.message });
    });
    res.json({ success: true });
  } catch (err) {
    return res.json({ success: false, data: err.message });
  }
};

export default tokenFunctions;