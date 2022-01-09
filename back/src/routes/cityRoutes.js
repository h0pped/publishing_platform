import express from "express";
const router = express.Router();

import * as connectionRequest from "../db/connection.js";
import * as cityQueries from "../db/queries/cityQueries.js";

router.get("/cities/byCountryID/:id", (req, res) => {
  let connection = connectionRequest.connectionRequest();
  connection.query(
    cityQueries.getByCountryID(req.params.id),
    (err, dbres, fields) => {
      res.send(dbres);
      connection.destroy();
    }
  );
});

export default router;
