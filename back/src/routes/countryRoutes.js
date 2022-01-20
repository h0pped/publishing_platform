import express from "express";
const router = express.Router();

import * as connectionRequest from "../db/connection.js";

import * as countryQueries from "../db/queries/countryqueries.js";

router.get("/countries/all", (req, res) => {
  console.log;
  let connection = connectionRequest.connectionRequest();
  connection.query(countryQueries.getAll(), (err, dbres, fields) => {
    console.log(dbres);
    res.send(dbres);
    connection.destroy();
  });
});

export default router;
