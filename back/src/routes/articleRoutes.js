import express from "express";
const router = express.Router();

import { connection } from "../db/connection.js";
import * as articleQueries from "../db/queries/articlequeries.js";

router.get("/articles/recent", (req, res) => {
  connection.query(articleQueries.getRecentArticles(), (err, dbres, fields) => {
    res.send(dbres);
  });
});

export default router;
