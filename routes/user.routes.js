import express from "express";
import { tambahuser, login } from "../controllers/user.controllers.js";
import { authenticateToken } from "../middlware/VerifyTokens.js";

const routerUser = express.Router();

routerUser.post("/", tambahuser);
routerUser.post("/login", login);
routerUser.get("/dashboard", authenticateToken, (req, res) => {
  res.send("Welcome to the dashboard!");
});

export default routerUser;
