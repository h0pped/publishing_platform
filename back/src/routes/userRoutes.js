import express from "express";
const router = express.Router();

import * as connectionRequest from "../db/connection.js";
import * as userQueries from "../db/queries/userqueries.js";
import * as cityQueries from "../db/queries/cityqueries.js";
import * as locationQueries from "../db/queries/locationqueries.js";
import fs from "fs";
import chalk from "chalk";
import * as firebase from "../firebase/firebase.js";

import bcrypt from "bcryptjs";

const checkCity = (countryID, city) => {
  return new Promise((resolve, reject) => {
    let connection = connectionRequest.connectionRequest();
    connection.query(
      cityQueries.getByCountryAndTitle(countryID, city),
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
const insertCity = (countryID, city) => {
  return new Promise((resolve, reject) => {
    let connection = connectionRequest.connectionRequest();
    connection.query(
      cityQueries.insertCity(countryID, city),
      (err, res, fields) => {
        if (err) {
          console.log(err);
          reject(err);
          return connection.destroy();
        }
        console.log("city insert");
        resolve(res[0]);
        return connection.destroy();
      }
    );
  });
};
const insertNewUser = (user) => {
  return new Promise((resolve, reject) => {
    let connection = connectionRequest.connectionRequest();
    connection.query(userQueries.insertNewUser(user), (err, res, fields) => {
      if (err) {
        reject(err);
        return connection.destroy();
      }
      console.log("INSERTION RES", res);
      resolve(res[0]);
      return connection.destroy();
    });
  });
};
const insertLocation = (location) => {
  return new Promise((resolve, reject) => {
    let connection = connectionRequest.connectionRequest();
    connection.query(
      locationQueries.insertNewLocation(location),
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

const getCountryAndCity = (userID) => {
  return new Promise((resolve, reject) => {
    let connection = connectionRequest.connectionRequest();
    connection.query(
      locationQueries.getCountryAndCity(userID),
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
router.post("/users/signup", async (req, res) => {
  const user = req.body;
  let regex;
  let matches;
  let ext;
  let data;
  let buffer;
  let imagepath = "";

  if (user) {
    if (user.avatar) {
      try {
        regex = /^data:.+\/(.+);base64,(.*)$/;
        matches = user.avatar.match(regex);
        ext = matches[1];
        data = matches[2];
        buffer = Buffer.from(data, "base64");
        let imgpath = user.email + "_avatar." + ext;
        fs.writeFileSync(`./public/profile_pics/${imgpath}`, buffer);
        imagepath = await firebase.uploadFile(
          `/public/profile_pics/${imgpath}`,
          imgpath
        );
        console.log(imagepath);
      } catch (err) {
        console.log(err);
      }
    }
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(user.password, salt);
    console.log(imagepath);

    const userdb = {
      name: user.name,
      surname: user.surname,
      email: user.email,
      password: hash,
      description: user.description,
      genderID: user.genderID,
      imagepath,
    };
    try {
      let city = await checkCity(user.countryID, user.city);
      // console.log(city);
      if (city) {
        await insertNewUser(userdb);
      } else {
        await insertCity(user.countryID, user.city);
        await insertNewUser(userdb);
      }
      const userlocation = {
        countryID: user.countryID,
        city: user.city,
        postalCode: user.postalCode,
        street: user.street,
        userEmail: user.email,
      };
      await insertLocation(userlocation);
      return res.status(201).send(user);
    } catch (err) {
      console.log(err);
      return res.status(500).send(err);
    }

    // checkCity(user.countryID, user.city)
    //   .then((data) => {
    //     if (!data) {
    //       // Insert new City
    //       insertCity(user.countryID, user.city).then((d) => {
    //         console.log("insert new city", d);
    //         return insertNewUser(userdb);
    //       });
    //     } else {
    //       console.log("city exists");

    //       return insertNewUser(userdb);
    //     }
    //   })
    //   .then((data) => {
    //     const userlocation = {
    //       countryID: user.countryID,
    //       city: user.city,
    //       postalCode: user.postalCode,
    //       street: user.street,
    //       userEmail: user.email,
    //     };
    //     return insertLocation(userlocation);
    //   })
    //   .then((data) => {
    //     res.status(201).send(user);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     res.status(500).send({ err });
    //   });
  }
});
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
        return getCountryAndCity(user.id);
      })
      .then((countryAndCity) => {
        user.location = {
          city: countryAndCity.city,
          country: countryAndCity.country,
        };
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
        return getCountryAndCity(user.id);
      })
      .then((countryAndCity) => {
        user.location = {
          city: countryAndCity.city,
          country: countryAndCity.country,
        };
        res.send(user);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({ err });
      });
  }
});
export default router;
