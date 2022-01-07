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
const getArticle = (articleID) => {
  return new Promise((resolve, reject) => {
    connection.query(
      articleQueries.getArticleByID(articleID),
      (err, rows, fields) => {
        if (err) {
          return reject(err);
        }
        resolve(rows[0]);
      }
    );
  });
};
const getArticleSections = (articleID) => {
  return new Promise((resolve, reject) => {
    connection.query(
      articleQueries.getArticleSectionsByID(articleID),
      (err, rows, fields) => {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      }
    );
  });
};
const getSectionGallery = (sectionID) => {
  return new Promise((resolve, reject) => {
    connection.query(
      articleQueries.getSectionGallery(sectionID),
      (err, rows, fields) => {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      }
    );
  });
};
const getGalleryImages = (galleryID) => {
  return new Promise((resolve, reject) => {
    connection.query(
      articleQueries.getGalleryPhotos(galleryID),
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
router.get("/articles/byID/:id", (req, res) => {
  let { id } = req.params;
  let article;
  getArticle(id)
    .then((data) => {
      if (data) {
        article = data;
        return getArticleCategory(id);
      }
    })
    .then((category) => {
      article.category = category;
      return getArticleTags(id);
    })
    .then((tags) => {
      article.tags = tags;
      return getArticleSections(id);
    })
    .then((sections) => {
      article.sections = sections;
      return Promise.all(
        article.sections.map((section) => {
          return getSectionGallery(section.ID);
        })
      );
    })
    .then((galleries) => {
      article.sections = article.sections.map((section, index) => {
        return { ...section, gallery: galleries[index][0] };
      });
      return Promise.all(
        article.sections.map((section) => {
          return getGalleryImages(section.gallery.ID);
        })
      );
    })
    .then((photos) => {
      article.sections = article.sections.map((section, index) => {
        section.gallery.photos = photos[index];
        return section;
      });
      res.send(article);
    })
    .catch((err) => {
      console.log(err);
      res.send({ err: err.message });
    });
});
export default router;
