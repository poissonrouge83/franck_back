const express = require("express");
const jwt = require("jsonwebtoken");
const logger = require("../../helpers/logger");
const UserModel = require("../../models/user");

const router = express.Router();
router.post("/register", async (req, res) => {
  if (!req.body.email || !req.body.password) {
    logger.info("for registration email and password are required", {
      request: req,
    });
    res
      .status(400)
      .json({ message: "For registration email and password are required" });
  }

  let userIsOk = false;
  let preValidatedEmails;
  if (process.env.USER_MAILS) {
    preValidatedEmails = process.env.USER_MAILS.split(",");
  } else {
    logger.error("no prevalidated emails in env");
    res.status(403).json({ reason: "invalid Email" });
  }
  for (let i = 0; i < preValidatedEmails.length; i++) {
    if (preValidatedEmails[i] === req.body.email) {
      userIsOk = true;
    }
  }
  if (!userIsOk) {
    res.status(403).send("this email can't register");
    //TODO: throw error ?
    return;
  }

  let user = await UserModel.findOne({ email: req.body.email });
  if (user) {
    logger.warn("user already registered\n", { request: req.body });
    res.status(409).json({ message: "user already registered" });
  }
  logger.error("req.body register:", req.body);
  user = await UserModel.create({
    email: req.body.email,
    password: req.body.password,
  });
  res.json({ registered: user.email });
});

router.post("/login", async (req, res) => {
  if (!req.body.email || !req.body.password) {
    logger.info("Error. Email and Password are Required", {
      request: req,
    });
    res.status(400).json({ message: "Error. Email and Password are Required" });
  }
  let user = await UserModel.findOne({
    email: req.body.email,
  });

  if (!user) {
    logger.error("login attempt failed", { requestBody: req.body });
    res.status(400).json({ message: "Error. Wrong email" });
  }
  if (await !user.isPasswordValid(req.body.password)) {
    logger.error("wrong password");
    res.status(401).json({ message: "password is invalid" });
  } else {
    const token = jwt.sign(
      {
        email: user.email,
        status: "debug user",
      },
      process.env.JWT_SECRET,
      { expiresIn: "3 days" } //pas besoin de se loger pendant 3 jours (duree de validite du token)
    );
    res.json({ access_token: token }); //renvoi le token au front
  }
});

router.delete("/user-flush", async (req, res) => {
  //FIXME: debug function to remove before prod
  const result = await UserModel.deleteMany({}); //selectionne toute la selection des users en BD
  logger.info(result);
  res.json({ ok: true });
});

module.exports = router;
