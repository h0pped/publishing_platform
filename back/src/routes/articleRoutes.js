import express from "express";
const router = express.Router();

import { connection } from "../db/connection.js";
import * as articleQueries from "../db/queries/articlequeries.js";

router.get("/articles/recent", (req, res) => {
  connection.query(articleQueries.getRecentArticles(), (err, dbres, fields) => {
    res.send(dbres);
  });
});

const getArticleCategory = (articleID) => {
  return new Promise((resolve, reject) => {
    connection.query(
      articleQueries.getArticleCategory(articleID),
      (err, rows, fields) => {
        if (err) {
          return reject(err);
        }
        resolve(rows[0]);
      }
    );
  });
};
const getArticleTags = (articleId) => {
  return new Promise((resolve, reject) => {
    connection.query(
      articleQueries.getArticleTags(articleId),
      (err, rows, fields) => {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      }
    );
  });
};
const getUserArticles = (email) => {
  return new Promise((resolve, reject) => {
    connection.query(
      articleQueries.getUserArticles(email),
      (err, rows, fields) => {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      }
    );
  });
};
router.get("/articles/byUser/:email", (req, res) => {
  let { email } = req.params;
  getUserArticles(email)
    .then((rows) => {
      let articles = rows;
      Promise.all(
        articles.map((item) => {
          return getArticleCategory(item.ID);
        })
      ).then((data) => {
        console.log(data);
        articles = articles.map((el, index) => {
          el.category = data[index];
          return el;
        });
        Promise.all(
          articles.map((item) => {
            return getArticleTags(item.ID);
          })
        )
          .then((tagsr) => {
            articles = articles.map((item, index) => {
              item.tags = tagsr[index];
              return item;
            });
            return res.send({ articles });
          })
          .catch((err) => res.status(500).send({ err }));
      });
    })
    .catch((err) => res.status(500).send({ err }));
});
export default router;
