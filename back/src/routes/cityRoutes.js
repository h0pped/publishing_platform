import express from "express";
const router = express.Router();

import { connection } from "../db/connection.js";
import * as cityQueries from "../db/queries/cityQueries.js";

router.get("/cities/byCountryID/:id", (req, res) => {
  connection.query(
    cityQueries.getByCountryID(req.params.id),
    (err, dbres, fields) => {
      res.send(dbres);
    }
  );
});

export default router;
