const express = require("express");
const logger = require("../../helpers/logger");
const UserModel = require("../../models/user");
const router = express.Router();

router.get("/profile", async (req, res) => {
  logger.debug({ user: req.user, query: req.query });
  const user = await UserModel.findOne({ email: req.user.email });
  logger.debug("user: ", user._id.toString());
  res.json({
    message: "You made it to the secure route",
    user: req.user,
    token: req.query.secret_token,
  });
});

router.delete("/delete", async (req, res) => {
  logger.debug("request for deleting user", req.body, req.headers);
  const deletedUser = {}; //await UserModel.deleteOne({ email: req.body.email });
  res.json(deletedUser);
});

router.get("/count", async (req, res) => {
  //FIXME: debug function to remove before prod
  const count = await UserModel.estimatedDocumentCount({});
  logger.info("user count:", count);
  res.json({ count });
});

module.exports = router;
