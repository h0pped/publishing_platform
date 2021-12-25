import express from "express";
import chalk from "chalk";
import conutil from "./util/consoleutil.js";
const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());

import { connection } from "./db/connection.js";
import { getAllUsers } from "./db/queries/userqueries.js";
app.get("/", (req, res) => {
  connection.query(getAllUsers(), (err, dbres, fields) => {
    res.send(dbres);
  });
});

app.listen(port, () => {
  console.log(chalk.blue.bold(conutil.SEPARATOR_LINE));
  console.log(chalk.blue.bold(`Listening on ${port}`));
});
