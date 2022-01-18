import express from "express";
const router = express.Router();

import * as connectionRequest from "../db/connection.js";
import * as categoryQueries from "../db/queries/categoryqueries.js";

router.get("/categories/all", (req, res) => {
  let connection = connectionRequest.connectionRequest();
  connection.query(categoryQueries.getAllCategories(), (err, dbres, fields) => {
    res.send(dbres);
    connection.destroy();
  });
});

export default router;
