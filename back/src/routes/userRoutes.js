import express from "express";
const router = express.Router();

import { connection } from "../db/connection.js";
import * as userQueries from "../db/queries/userQueries.js";
import * as cityQueries from "../db/queries/cityQueries.js";
import * as locationQueries from "../db/queries/locationQueries.js";
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
  console.log("aaa");
  const user = req.body;
  let regex;
  let matches;
  let ext;
  let data;
  let buffer;
  let imagepath = "";

  if (user.avatar) {
    try {
      regex = /^data:.+\/(.+);base64,(.*)$/;
      matches = user.avatar.match(regex);
      ext = matches[1];
      data = matches[2];
      buffer = Buffer.from(data, "base64");

      imagepath = user.email + "_avatar." + ext;
      fs.writeFileSync(`./public/profile_pics/${imagepath}`, buffer);
    } catch (err) {
      console.log(err);
    }
  }
  console.log("avatar added");

  connection.query(
    //check if city exists in db
    cityQueries.getByCountryAndTitle(user.countryID, user.city),
    (err, dbres, fields) => {
      console.log(err, dbres);
      if (err === null) {
        const city = dbres[0];
        if (!city) {
          //insert city
          connection.query(
            cityQueries.insertCity(user.countryID, user.city),
            (cityerr, citydbres, cityfields) => {
              if (cityerr === null) {
                let salt = bcrypt.genSaltSync(10);
                let hash = bcrypt.hashSync(user.password, salt);
                //add user
                const userdb = {
                  name: user.name,
                  surname: user.surname,
                  email: user.email,
                  password: hash,
                  description: user.description,
                  genderID: user.genderID,
                  imagepath,
                };
                const userlocation = {
                  countryID: user.countryID,
                  city: user.city,
                  postalCode: user.postalCode,
                  street: user.street,
                  userEmail: user.email,
                };
                connection.query(
                  userQueries.insertNewUser(userdb),
                  (usererr, userdbres, userfields) => {
                    if (usererr === null) {
                      connection.query(
                        locationQueries.insertNewLocation(userlocation),
                        (locationerr, locationdbres, locationfields) => {
                          if (locationerr === null) {
                            return res.status(201).send(user);
                          } else {
                            console.log(locationerr);
                            return res.send({ err: locationerr });
                          }
                        }
                      );
                    } else {
                      return res.status(400).send({ err: usererr.sqlMessage });
                    }
                  }
                );
              }
            }
          );
        } else {
          let salt = bcrypt.genSaltSync(10);
          let hash = bcrypt.hashSync(user.password, salt);
          //add user
          const userdb = {
            name: user.name,
            surname: user.surname,
            email: user.email,
            password: hash,
            description: user.description,
            genderID: user.genderID,
            imagepath,
          };
          const userlocation = {
            countryID: user.countryID,
            city: user.city,
            postalCode: user.postalCode,
            street: user.street,
            userEmail: user.email,
          };
          connection.query(
            userQueries.insertNewUser(userdb),
            (usererr, userdbres, userfields) => {
              if (usererr === null) {
                connection.query(
                  locationQueries.insertNewLocation(userlocation),
                  (locationerr, locationdbres, locationfields) => {
                    if (locationerr === null) {
                      return res.status(201).send(user);
                    } else {
                      console.log(locationerr);
                      return res.send({ err: locationerr });
                    }
                  }
                );
              } else {
                console.log("err");
                return res.status(400).send({ err: usererr.sqlMessage });
              }
            }
          );
        }
      } else {
        console.log(err);
      }
    }
  );
});

router.get("/users/byEmail/:email", (req, res) => {
  console.log(req.params.email);
  if (req.params.email) {
    connection.query(
      userQueries.findByEmail(req.params.email),
      (err, dbres, fields) => {
        if (err === null) {
          let user = dbres[0];
          if (!user) {
            return res.status(404).send({ err: "User was not fount" });
          }
          //get followers/following count
          connection.query(
            userQueries.getFollowersFollowing(user.email),
            (follerr, folldbres, follfields) => {
              if (follerr === null) {
                user = {
                  ...user,
                  followers: folldbres[0].Followers,
                  following: folldbres[0].Following,
                };

                // get socialmedialinks
                connection.query(
                  userQueries.getSocialMediaLinks(user.email),
                  (lerr, lres, lfields) => {
                    if (lerr === null) {
                      user.socials = lres.map((el) => {
                        return {
                          title: el.title,
                          link: el.link,
                        };
                      });
                      return res.status(200).send(user);
                    }
                  }
                );
              }
            }
          );
        }
      }
    );
  }
});
export default router;
