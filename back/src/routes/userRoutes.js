import express from "express";
const router = express.Router();

import { connection } from "../db/connection.js";
import * as userQueries from "../db/queries/userQueries.js";

import bcrypt from "bcryptjs";
router.post("/users/findByCredentials", (req, res) => {
  connection.query(
    userQueries.findByEmail(req.body.email),
    (err, dbres, fields) => {
      if (err === null) {
        const user = dbres[0];
        if (!user) {
          res.send({ err: "Invalid Credentials" });
        } else {
          bcrypt
            .compare(req.body.password, user.password)
            .then((passres) => {
              if (passres) res.send(user);
              else throw "Invalid Credentials";
            })
            .catch((err) => res.status(400).send({ err }));
        }
      }
    }
  );

  //   connection.query(articleQueries.getRecentArticles(), (err, dbres, fields) => {
  //     res.send(dbres);
  //   });
});

export default router;