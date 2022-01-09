import express from "express";
const router = express.Router();

import * as connectionRequest from "../db/connection.js";
import * as genderQueries from "../db/queries/genderqueries.js";

router.get("/genders/all", (req, res) => {
  let connection = connectionRequest.connectionRequest();
  connection.query(genderQueries.getAll(), (err, dbres, fields) => {
    res.send(dbres);
    connection.destroy();
  });
});

export default router;
