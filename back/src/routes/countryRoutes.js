import express from "express";
const router = express.Router();

import * as connectionRequest from "../db/connection.js";

import * as countryQueries from "../db/queries/countryqueries.js";

router.get("/countries/all", (req, res) => {
  let connection = connectionRequest.connectionRequest();
  connection.query(countryQueries.getAll(), (err, dbres, fields) => {
    res.send(dbres);
    connection.destroy();
  });
});

export default router;
