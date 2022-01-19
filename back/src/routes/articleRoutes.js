import express from "express";
const router = express.Router();

import fs from "fs";

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
    console.log("ARTICLE", articleQueries.getArticleCategory(articleID));
    connection.query(
      articleQueries.getArticleCategory(articleID),
      (err, rows, fields) => {
        if (err) {
          connection.destroy();
          reject(err);
        }

        console.log(rows);
        if (rows) {
          connection.destroy();

          resolve(rows[0]);
        } else {
          connection.destroy();

          reject("ERROR ");
        }
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
          connection.destroy();
          return reject(err);
        }
        connection.destroy();
        resolve(rows);
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
          connection.destroy();
          return reject(err);
        }
        connection.destroy();
        resolve(rows[0]);
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
          connection.destroy();
          return reject(err);
        }
        connection.destroy();
        resolve(rows);
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
          connection.destroy();
          return reject(err);
        }
        connection.destroy();
        resolve(rows);
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
          connection.destroy();
          return reject(err);
        }
        connection.destroy();
        resolve(rows);
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
          connection.destroy();
          return reject(err);
        }
        connection.destroy();
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
          if (section.gallery) {
            return getGalleryImages(section.gallery.ID);
          } else {
            return [];
          }
        })
      );
    })
    .then((photos) => {
      article.sections = article.sections.map((section, index) => {
        if (section.gallery) {
          section.gallery.photos = photos[index];
        }
        return section;
      });
      res.send(article);
    })
    .catch((err) => {
      console.log(err);
      res.send({ err: err.message });
    });
});

const createArticle = (article) => {
  let imgpath;
  let regex;
  let matches;
  let ext;
  let data;
  let buffer;
  if (article.img) {
    try {
      regex = /^data:.+\/(.+);base64,(.*)$/;
      matches = article.img.match(regex);
      ext = matches[1];
      data = matches[2];
      buffer = Buffer.from(data, "base64");
      imgpath = article.email + "_" + Date.now() + "." + ext;
      fs.writeFileSync(`./public/article_thumbnails/${imgpath}`, buffer);
      article.imgpath = imgpath;
    } catch (err) {
      console.log(err);
    }
  }
  return new Promise((resolve, reject) => {
    let connection = connectionRequest.connectionRequest();

    connection.query(
      articleQueries.createArticle(article),
      (err, rows, fields) => {
        if (err) {
          connection.destroy();
          return reject(err);
        }
        connection.destroy();
        console.log(rows);
        resolve(rows.insertId);
      }
    );
  });
};
const addTag = (tag) => {
  return new Promise((resolve, reject) => {
    let connection = connectionRequest.connectionRequest();
    connection.query(articleQueries.createTag(tag), (err, rows, fields) => {
      // if (err) {
      //   resolve(err);
      //   connection.destroy();
      // }
      // if (err) {
      //   console.log(err);
      // }
      connection.destroy();
      resolve(rows);
    });
  });
};
const linkTag = (tag, articleID) => {
  return new Promise((resolve, reject) => {
    let connection = connectionRequest.connectionRequest();
    connection.query(
      articleQueries.linkTag(tag, articleID),
      (err, rows, fields) => {
        if (err) {
          connection.destroy();
          resolve(err);
        }
        connection.destroy();
        resolve(rows);
      }
    );
  });
};
const addSection = (section, articleID, order) => {
  return new Promise((resolve, reject) => {
    let connection = connectionRequest.connectionRequest();
    connection.query(
      articleQueries.addSection(section, articleID, order),
      (err, rows, fields) => {
        if (err) {
          console.log(err);
          connection.destroy();
          return reject(err);
        }
        console.log("ROWS", rows);
        connection.destroy();
        resolve(rows.insertId);
      }
    );
  });
};
const addSectionGallery = (gallery, sectionID) => {
  return new Promise((resolve, reject) => {
    let connection = connectionRequest.connectionRequest();
    console.log(articleQueries.addSectionGallery(gallery, sectionID));
    connection.query(
      articleQueries.addSectionGallery(gallery, sectionID),
      (err, rows, fields) => {
        if (err) {
          connection.destroy();
          return reject(err);
        }
        connection.destroy();
        resolve(rows.insertId);
      }
    );
  });
};

const linkPhotoWithGallery = (photoID, galleryID, title, alt, source) => {
  return new Promise((resolve, reject) => {
    let connection = connectionRequest.connectionRequest();

    connection.query(
      articleQueries.linkPhotoWithGallery(
        photoID,
        galleryID,
        title,
        alt,
        source
      )
    ),
      (err, rows, fields) => {
        if (err) {
          connection.destroy();
          reject(err);
        }
        connection.destroy();
        resolve(rows);
      };
  });
};

router.post("/articles/add", async (req, res) => {
  try {
    let article = req.body;
    let articleRes = await createArticle(article);
    let tags = await Promise.all(article.tags.map((tag) => addTag(tag)));
    let links = await Promise.all(
      article.tags.map((tag) => linkTag(tag, articleRes))
    );
    article.sections.forEach(async (section, index) => {
      const sectionID = await addSection(section, articleRes, index + 1);
      console.log(section);
      if (section.gallery) {
        try {
          let galleryID = await addSectionGallery(section.gallery, sectionID);
          section.gallery.photos.forEach(async (photo) => {
            await linkPhotoWithGallery(
              photo.id,
              galleryID,
              photo.title,
              photo.alternative,
              photo.source
            );
          });
        } catch (err) {
          console.log(err);
        }
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).err({ err });
  }
  res.status(201).send({ article });
});
export default router;
