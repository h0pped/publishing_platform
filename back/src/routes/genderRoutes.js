import express from "express";
const router = express.Router();

import { connection } from "../db/connection.js";
import * as genderQueries from "../db/queries/genderqueries.js";

router.get("/genders/all", (req, res) => {
  connection.query(genderQueries.getAll(), (err, dbres, fields) => {
    res.send(dbres);
  });
});

export default router;
