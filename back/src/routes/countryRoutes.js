import express from "express";
const router = express.Router();

import { connection } from "../db/connection.js";
import * as countryQueries from "../db/queries/countryqueries.js";

router.get("/countries/all", (req, res) => {
  connection.query(countryQueries.getAll(), (err, dbres, fields) => {
    res.send(dbres);
  });
});

export default router;
