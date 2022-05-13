const mongoose = require("mongoose");
const logger = require("../helpers/logger");

const dbUserName = process.env.DBUSER;
const dbPassword = process.env.DBPASS;
const dbCluster = process.env.DBCLUSTER;
const dbName = process.env.DBNAME;

mongoose.connect(
  `mongodb+srv://${dbUserName}:${dbPassword}@${dbCluster}.mongodb.net/${dbName}?retryWrites=true&w=majority`,
  {}
);
mongoose.connection.on("error", (error) => {
  //on ecouteur d'événement de connexion mongoose
  logger.error("mongoose connection error", error);
  process.exit;
});
mongoose.connection.on("connected", () => {
  logger.info("MongoDb via Mongoose is connected");
});
mongoose.connection.on("disconnected", (reason) => {
  logger.info("mongoose disconnected", reason);
});

mongoose.Promise = global.Promise; //prommesses mongoose mêmes promesses que le reste du systeme (async await)
