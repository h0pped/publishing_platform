import express from "express";
const router = express.Router();

import * as connectionRequest from "../db/connection.js";
import * as userQueries from "../db/queries/userQueries.js";
import * as cityQueries from "../db/queries/cityQueries.js";
import * as locationQueries from "../db/queries/locationQueries.js";
import fs from "fs";
import chalk from "chalk";

import bcrypt from "bcryptjs";
router.post("/users/findByCredentials", (req, res) => {
  console.log("QUERY");
  let connection = connectionRequest.connectionRequest();
  connection.query(
    userQueries.findByEmail(req.body.email),
    (err, dbres, fields) => {
      if (err === null) {
        const user = dbres[0];
        if (!user) {
          res.send({ err: "Invalid Credentials" });
          connection.destroy();
        } else {
          bcrypt
            .compare(req.body.password, user.password)
            .then((passres) => {
              if (passres) {
                res.send(user);
                connection.destroy();
              } else throw "Invalid Credentials";
            })
            .catch((err) => {
              res.status(400).send({ err });
              connection.destroy();
            });
        }
      } else {
        console.log(err);
        connection.destroy();
      }
    }
  );
});

router.post("/users/signup", (req, res) => {
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
  let connection = connectionRequest.connectionRequest();
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
                            res.status(201).send(user);
                            return connection.destroy();
                          } else {
                            console.log(locationerr);
                            res.send({ err: locationerr });
                            return connection.destroy();
                          }
                        }
                      );
                    } else {
                      res.status(400).send({ err: usererr.sqlMessage });
                      return connection.destroy();
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
                      res.status(201).send(user);
                      return connection.destroy();
                    } else {
                      console.log(locationerr);
                      res.send({ err: locationerr });
                      return connection.destroy();
                    }
                  }
                );
              } else {
                console.log("err");

                res.status(400).send({ err: usererr.sqlMessage });
                return connection.destroy();
              }
              connection.destroy();
            }
          );
        }
      } else {
        console.log(err);
      }
    }
  );
  connection.destroy();
});

const findUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    let connection = connectionRequest.connectionRequest();
    connection.query(userQueries.findByEmail(email), (err, res, fields) => {
      if (err) {
        reject(err);
        return connection.destroy();
      }
      resolve(res[0]);
      return connection.destroy();
    });
  });
};
const findUserByID = (id) => {
  return new Promise((resolve, reject) => {
    let connection = connectionRequest.connectionRequest();
    connection.query(userQueries.findByID(id), (err, res, fields) => {
      if (err) {
        reject(err);
        return connection.destroy();
      }
      resolve(res[0]);
      return connection.destroy();
    });
  });
};
const findUserFollowers = (email) => {
  return new Promise((resolve, reject) => {
    let connection = connectionRequest.connectionRequest();
    connection.query(
      userQueries.getFollowersFollowing(email),
      (err, res, fields) => {
        if (err) {
          reject(err);
          return connection.destroy();
        }
        resolve(res[0]);
        return connection.destroy();
      }
    );
  });
};
const findUserSocialMedia = (email) => {
  return new Promise((resolve, reject) => {
    let connection = connectionRequest.connectionRequest();
    connection.query(
      userQueries.getSocialMediaLinks(email),
      (err, res, fields) => {
        if (err) {
          reject(err);
          return connection.destroy();
        }
        resolve(res);
        return connection.destroy();
      }
    );
  });
};
router.get("/users/byEmail/:email", (req, res) => {
  const { email } = req.params;
  if (email) {
    let user;
    findUserByEmail(email)
      .then((userdata) => {
        user = userdata;
        return findUserFollowers(email);
      })
      .then((followersdata) => {
        user = {
          ...user,
          followers: followersdata.Followers,
          following: followersdata.Following,
        };
        return findUserSocialMedia(email);
      })
      .then((links) => {
        user.socials = links.map((l) => {
          return {
            title: l.title,
            link: l.link,
          };
        });
        res.send(user);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({ err });
      });
  }
});
router.get("/users/byID/:id", (req, res) => {
  const { id } = req.params;
  if (id) {
    let user;
    let email;
    findUserByID(id)
      .then((userData) => {
        user = userData;
        email = user.email;
        console.log(user);
        return findUserFollowers(email);
      })
      .then((followersdata) => {
        user = {
          ...user,
          followers: followersdata.Followers,
          following: followersdata.Following,
        };
        return findUserSocialMedia(email);
      })
      .then((links) => {
        user.socials = links.map((l) => {
          return {
            title: l.title,
            link: l.link,
          };
        });
        res.send(user);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({ err });
      });
  }
});
export default router;
