import express from "express";
const router = express.Router();

import { connection } from "../db/connection.js";
import * as userQueries from "../db/queries/userQueries.js";
import fs from "fs";
import chalk from "chalk";

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
});

router.post("/users/signup", (req, res) => {
  const user = req.body;
  if (user.avatar) {
    let regex = /^data:.+\/(.+);base64,(.*)$/;
    let matches = user.avatar.match(regex);
    let ext = matches[1];
    let data = matches[2];
    let buffer = Buffer.from(data, "base64");
    fs.writeFileSync(
      `./public/profile_pics/${user.email}_avatar.` + ext,
      buffer
    );
  }
  res.send(user);
});
export default router;
