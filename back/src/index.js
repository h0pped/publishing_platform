import express from "express";
import chalk from "chalk";
import conutil from "./util/consoleutil.js";
import cors from "cors";
import path from "path";

const app = express();
app.use(cors());

const __dirname = path.resolve();
app.use("/static", express.static(__dirname + "/public"));

const port = process.env.PORT || 3000;

app.use(express.json());

import { connection } from "./db/connection.js";
import { getAllUsers } from "./db/queries/userqueries.js";

//routes
import articleRoutes from "./routes/articleRoutes.js";
// const articleRoutes =  require('./routes')
app.use(articleRoutes);
app.get("/", (req, res) => {
  connection.query(getAllUsers(), (err, dbres, fields) => {
    res.send(dbres);
  });
});

app.listen(port, () => {
  console.log(chalk.blue.bold(conutil.SEPARATOR_LINE));
  console.log(chalk.blue.bold(`Listening on ${port}`));
});
