import express from "express";
import fs from "fs";
const router = express.Router();

import * as connectionRequest from "../db/connection.js";
import * as photoQueries from "../db/queries/photoqueries.js";
import * as firebase from "../firebase/firebase.js";
router.get("/photos/:email", async (req, res) => {
  let { email } = req.params;
  // await firebase.uploadFile("/public/user_photos/apps.png", "apps2.png");
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
router.post("/photos/add", async (req, res) => {
  const { email, img, name } = req.body;
  let imgpath;
  let regex;
  let matches;
  let ext;
  let data;
  let buffer;

  try {
    regex = /^data:.+\/(.+);base64,(.*)$/;
    matches = img.match(regex);
    ext = matches[1];
    data = matches[2];
    buffer = Buffer.from(data, "base64");
    imgpath = email + "_" + name + "_" + Date.now() + "." + ext;
    fs.writeFileSync(`./public/user_photos/${imgpath}`, buffer);
    imgpath = await firebase.uploadFile(
      `/public/user_photos/${imgpath}`,
      imgpath
    );
    let connection = connectionRequest.connectionRequest();
    connection.query(
      photoQueries.addPhoto(email, name, imgpath),
      (err, dbres, fields) => {
        if (err) {
          console.log(err);
          res.status(500).send({ err });
        } else {
          res.status(201).send({ dbres });
        }
        return connection.destroy();
      }
    );
  } catch (err) {
    console.log(err);
  }
});

export default router;
