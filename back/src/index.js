import express from "express";
import chalk from "chalk";
import conutil from "./util/consoleutil.js";
import cors from "cors";
import path from "path";
import bodyParser from "body-parser";

const app = express();
app.use(cors());

const __dirname = path.resolve();
app.use(bodyParser.json({ limit: "50mb" }));
app.use("/static", express.static(__dirname + "/public"));

const port = process.env.PORT || 3000;

app.use(express.json());

import { connection } from "./db/connection.js";
import { getAllUsers } from "./db/queries/userqueries.js";

//routes
import articleRoutes from "./routes/articleRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import countryRoutes from "./routes/countryRoutes.js";
import cityRoutes from "./routes/cityRoutes.js";
import genderRoutes from "./routes/genderRoutes.js";
// const articleRoutes =  require('./routes')
app.use(articleRoutes);
app.use(userRoutes);
app.use(countryRoutes);
app.use(cityRoutes);
app.use(genderRoutes);

app.get("/", (req, res) => {
  connection.query(getAllUsers(), (err, dbres, fields) => {
    res.send(dbres);
  });
});

app.listen(port, () => {
  console.log(chalk.blue.bold(conutil.SEPARATOR_LINE));
  console.log(chalk.blue.bold(`Listening on ${port}`));
});
