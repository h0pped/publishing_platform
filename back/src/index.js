import express from "express";
import chalk from "chalk";
import conutil from "./util/consoleutil.js";
import cors from "cors";
import path from "path";
import bodyParser from "body-parser";
import fs from "fs";

const app = express();
app.use(cors());

const __dirname = path.resolve();
app.use(bodyParser.json({ limit: "50mb" }));
app.use("/static", express.static(path.join(__dirname, "/public")));

const directoryPath = path.join(__dirname, "/public");
//passsing directoryPath and callback function
fs.readdir(directoryPath, function (err, files) {
  //handling error
  if (err) {
    return console.log("Unable to scan directory: " + err);
  }
  //listing all files using forEach
  files.forEach(function (file) {
    // Do whatever you want to do with the file
    console.log(file);
  });
});
const port = process.env.PORT || 3000;

app.use(express.json());

import * as connectionRequest from "./db/connection.js";
import { getAllUsers } from "./db/queries/userqueries.js";

//routes
import articleRoutes from "./routes/articleRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import countryRoutes from "./routes/countryRoutes.js";
import cityRoutes from "./routes/cityRoutes.js";
import genderRoutes from "./routes/genderRoutes.js";
import photoRoutes from "./routes/photoRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
// const articleRoutes =  require('./routes')
app.use(articleRoutes);
app.use(userRoutes);
app.use(countryRoutes);
app.use(cityRoutes);
app.use(genderRoutes);
app.use(photoRoutes);
app.use(categoryRoutes);

app.get("/", (req, res) => {
  console.log("aaa");
  let connection = connectionRequest.connectionRequest();
  connection.query(getAllUsers(), (err, dbres, fields) => {
    res.send(dbres);
  });
});

app.listen(port, () => {
  console.log(chalk.blue.bold(conutil.SEPARATOR_LINE));
  console.log(chalk.blue.bold(`Listening on ${port}`));
});
