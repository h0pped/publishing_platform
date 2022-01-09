import express from "express";
const router = express.Router();

import * as connectionRequest from "../db/connection.js";
import * as articleQueries from "../db/queries/articlequeries.js";

router.get("/articles/recent", (req, res) => {
  let connection = connectionRequest.connectionRequest();
  connection.query(articleQueries.getRecentArticles(), (err, dbres, fields) => {
    res.send(dbres);
    connection.destroy();
  });
});

const getArticleCategory = (articleID) => {
  return new Promise((resolve, reject) => {
    let connection = connectionRequest.connectionRequest();
    connection.query(
      articleQueries.getArticleCategory(articleID),
      (err, rows, fields) => {
        if (err) {
          reject(err);
          connection.destroy();
        }
        resolve(rows[0]);
        connection.destroy();
      }
    );
  });
};
const getArticleTags = (articleId) => {
  let connection = connectionRequest.connectionRequest();
  return new Promise((resolve, reject) => {
    connection.query(
      articleQueries.getArticleTags(articleId),
      (err, rows, fields) => {
        if (err) {
          reject(err);
          connection.destroy();
        }
        resolve(rows);
        connection.destroy();
      }
    );
  });
};
const getArticle = (articleID) => {
  return new Promise((resolve, reject) => {
    let connection = connectionRequest.connectionRequest();
    connection.query(
      articleQueries.getArticleByID(articleID),
      (err, rows, fields) => {
        if (err) {
          console.log(err);
          reject(err);
          return connection.destroy();
        }
        console.log(rows);
        resolve(rows[0]);
        connection.destroy();
      }
    );
  });
};
const getArticleSections = (articleID) => {
  return new Promise((resolve, reject) => {
    let connection = connectionRequest.connectionRequest();
    connection.query(
      articleQueries.getArticleSectionsByID(articleID),
      (err, rows, fields) => {
        if (err) {
          reject(err);
          connection.destroy();
        }
        resolve(rows);
        connection.destroy();
      }
    );
  });
};
const getSectionGallery = (sectionID) => {
  return new Promise((resolve, reject) => {
    let connection = connectionRequest.connectionRequest();

    connection.query(
      articleQueries.getSectionGallery(sectionID),
      (err, rows, fields) => {
        if (err) {
          reject(err);
          connection.destroy();
        }
        resolve(rows);
        connection.destroy();
      }
    );
  });
};
const getGalleryImages = (galleryID) => {
  return new Promise((resolve, reject) => {
    let connection = connectionRequest.connectionRequest();

    connection.query(
      articleQueries.getGalleryPhotos(galleryID),
      (err, rows, fields) => {
        if (err) {
          reject(err);
          connection.destroy();
        }
        resolve(rows);
        connection.destroy();
      }
    );
  });
};
const getUserArticles = (email) => {
  return new Promise((resolve, reject) => {
    let connection = connectionRequest.connectionRequest();

    connection.query(
      articleQueries.getUserArticles(email),
      (err, rows, fields) => {
        if (err) {
          reject(err);
          connection.destroy();
        }
        resolve(rows);
        connection.destroy();
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
      console.log(article.sections);
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
