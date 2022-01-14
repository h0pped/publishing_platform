import express from "express";
const router = express.Router();

import * as connectionRequest from "../db/connection.js";
import * as photoQueries from "../db/queries/photoQueries.js";
router.get("/photos/:email", (req, res) => {
  let { email } = req.params;
  let connection = connectionRequest.connectionRequest();
  connection.query(
    photoQueries.getPhotosByUserID(email),
    (err, dbres, fields) => {
      if (err) {
        console.log(err);
        res.status(500).send({ err });
      } else {
        res.send(dbres);
      }
      return connection.destroy();
    }
  );
});

export default router;
