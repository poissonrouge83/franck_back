require("dotenv").config();
const logger = require("./helpers/logger");
const express = require("express");
const bodyParser = require("body-parser"); //rajoute .body sur l'objet request
const cors = require("cors"); //permet d'outrepasser une faille de sécurité en dev
const errorHandler = require("./middlewares/errorHandler");
const { jwtMiddleware } = require("./middlewares/authentication");

require("./services/db");

const app = express();

const port = process.env.PORT || 3000;

const publicAuthRoutes = require("./routes/user/public-routes");
const privateAuthRoutes = require("./routes/user/private-routes");
const publicQuoteRoutes = require("./routes/quote/public-routes");
const privateQuoteRoutes = require("./routes/quote/private-routes");

app.use(cors()); //app.use (express maintenant tu utilises...) => definit les middleware dans l'ordre à utiliser

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.use("/", publicAuthRoutes); // '/' >>> root ou racine
app.use("/user", jwtMiddleware(), privateAuthRoutes);
app.use("/quote", publicQuoteRoutes);
app.use("/quote", jwtMiddleware(), privateQuoteRoutes);

// Handle errors.
app.use(errorHandler);

app.listen(port, () => {
  logger.info(`Server started on port ${port}.`);
});
