"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _fs = _interopRequireDefault(require("fs"));

var connectionRequest = _interopRequireWildcard(require("../db/connection.js"));

var articleQueries = _interopRequireWildcard(require("../db/queries/articlequeries.js"));

var firebase = _interopRequireWildcard(require("../firebase/firebase.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var router = _express["default"].Router();

router.get("/articles/recent", function (req, res) {
  var connection = connectionRequest.connectionRequest();
  connection.query(articleQueries.getRecentArticles(), function (err, dbres, fields) {
    res.send(dbres);
    connection.destroy();
  });
});

var getArticleCategory = function getArticleCategory(articleID) {
  return new Promise(function (resolve, reject) {
    var connection = connectionRequest.connectionRequest();
    console.log("ARTICLE", articleQueries.getArticleCategory(articleID));
    connection.query(articleQueries.getArticleCategory(articleID), function (err, rows, fields) {
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
    });
  });
};

var getArticleTags = function getArticleTags(articleId) {
  var connection = connectionRequest.connectionRequest();
  return new Promise(function (resolve, reject) {
    connection.query(articleQueries.getArticleTags(articleId), function (err, rows, fields) {
      if (err) {
        connection.destroy();
        return reject(err);
      }

      connection.destroy();
      resolve(rows);
    });
  });
};

var getArticle = function getArticle(articleID) {
  return new Promise(function (resolve, reject) {
    var connection = connectionRequest.connectionRequest();
    connection.query(articleQueries.getArticleByID(articleID), function (err, rows, fields) {
      if (err) {
        console.log(err);
        connection.destroy();
        return reject(err);
      }

      connection.destroy();
      resolve(rows[0]);
    });
  });
};

var getArticleSections = function getArticleSections(articleID) {
  return new Promise(function (resolve, reject) {
    var connection = connectionRequest.connectionRequest();
    connection.query(articleQueries.getArticleSectionsByID(articleID), function (err, rows, fields) {
      if (err) {
        connection.destroy();
        return reject(err);
      }

      connection.destroy();
      resolve(rows);
    });
  });
};

var getSectionGallery = function getSectionGallery(sectionID) {
  return new Promise(function (resolve, reject) {
    var connection = connectionRequest.connectionRequest();
    connection.query(articleQueries.getSectionGallery(sectionID), function (err, rows, fields) {
      if (err) {
        connection.destroy();
        return reject(err);
      }

      connection.destroy();
      resolve(rows);
    });
  });
};

var getGalleryImages = function getGalleryImages(galleryID) {
  return new Promise(function (resolve, reject) {
    var connection = connectionRequest.connectionRequest();
    connection.query(articleQueries.getGalleryPhotos(galleryID), function (err, rows, fields) {
      if (err) {
        connection.destroy();
        return reject(err);
      }

      connection.destroy();
      resolve(rows);
    });
  });
};

var getUserArticles = function getUserArticles(email) {
  return new Promise(function (resolve, reject) {
    var connection = connectionRequest.connectionRequest();
    connection.query(articleQueries.getUserArticles(email), function (err, rows, fields) {
      if (err) {
        connection.destroy();
        return reject(err);
      }

      connection.destroy();
      resolve(rows);
    });
  });
};

router.get("/articles/byUser/:email", function (req, res) {
  var email = req.params.email;
  getUserArticles(email).then(function (rows) {
    var articles = rows;
    Promise.all(articles.map(function (item) {
      return getArticleCategory(item.ID);
    })).then(function (data) {
      articles = articles.map(function (el, index) {
        el.category = data[index];
        return el;
      });
      Promise.all(articles.map(function (item) {
        return getArticleTags(item.ID);
      })).then(function (tagsr) {
        articles = articles.map(function (item, index) {
          item.tags = tagsr[index];
          return item;
        });
        return res.send({
          articles: articles
        });
      })["catch"](function (err) {
        return res.status(500).send({
          err: err
        });
      });
    });
  })["catch"](function (err) {
    return res.status(500).send({
      err: err
    });
  });
});
router.get("/articles/byID/:id", function (req, res) {
  var id = req.params.id;
  var article;
  getArticle(id).then(function (data) {
    if (data) {
      article = data;
      return getArticleCategory(id);
    }
  }).then(function (category) {
    article.category = category;
    return getArticleTags(id);
  }).then(function (tags) {
    article.tags = tags;
    return getArticleSections(id);
  }).then(function (sections) {
    article.sections = sections;
    console.log(article.sections);
    return Promise.all(article.sections.map(function (section) {
      return getSectionGallery(section.ID);
    }));
  }).then(function (galleries) {
    article.sections = article.sections.map(function (section, index) {
      return _objectSpread({}, section, {
        gallery: galleries[index][0]
      });
    });
    return Promise.all(article.sections.map(function (section) {
      if (section.gallery) {
        return getGalleryImages(section.gallery.ID);
      } else {
        return [];
      }
    }));
  }).then(function (photos) {
    article.sections = article.sections.map(function (section, index) {
      if (section.gallery) {
        section.gallery.photos = photos[index];
      }

      return section;
    });
    res.send(article);
  })["catch"](function (err) {
    console.log(err);
    res.send({
      err: err.message
    });
  });
});

var createArticle = function createArticle(article) {
  var imgpath, regex, matches, ext, data, buffer;
  return regeneratorRuntime.async(function createArticle$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (!article.img) {
            _context.next = 17;
            break;
          }

          _context.prev = 1;
          regex = /^data:.+\/(.+);base64,(.*)$/;
          matches = article.img.match(regex);
          ext = matches[1];
          data = matches[2];
          buffer = Buffer.from(data, "base64");
          imgpath = article.email + "_" + Date.now() + "." + ext;

          _fs["default"].writeFileSync("./public/article_thumbnails/".concat(imgpath), buffer);

          _context.next = 11;
          return regeneratorRuntime.awrap(firebase.uploadFile("/public/article_thumbnails/".concat(imgpath), imgpath));

        case 11:
          article.imgpath = _context.sent;
          _context.next = 17;
          break;

        case 14:
          _context.prev = 14;
          _context.t0 = _context["catch"](1);
          console.log(_context.t0);

        case 17:
          return _context.abrupt("return", new Promise(function (resolve, reject) {
            var connection = connectionRequest.connectionRequest();
            connection.query(articleQueries.createArticle(article), function (err, rows, fields) {
              if (err) {
                connection.destroy();
                return reject(err);
              }

              connection.destroy();
              console.log(rows);
              resolve(rows.insertId);
            });
          }));

        case 18:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 14]]);
};

var addTag = function addTag(tag) {
  return new Promise(function (resolve, reject) {
    var connection = connectionRequest.connectionRequest();
    connection.query(articleQueries.createTag(tag), function (err, rows, fields) {
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

var linkTag = function linkTag(tag, articleID) {
  return new Promise(function (resolve, reject) {
    var connection = connectionRequest.connectionRequest();
    connection.query(articleQueries.linkTag(tag, articleID), function (err, rows, fields) {
      if (err) {
        connection.destroy();
        resolve(err);
      }

      connection.destroy();
      resolve(rows);
    });
  });
};

var addSection = function addSection(section, articleID, order) {
  return new Promise(function (resolve, reject) {
    var connection = connectionRequest.connectionRequest();
    connection.query(articleQueries.addSection(section, articleID, order), function (err, rows, fields) {
      if (err) {
        console.log(err);
        connection.destroy();
        return reject(err);
      }

      console.log("ROWS", rows);
      connection.destroy();
      resolve(rows.insertId);
    });
  });
};

var addSectionGallery = function addSectionGallery(gallery, sectionID) {
  return new Promise(function (resolve, reject) {
    var connection = connectionRequest.connectionRequest();
    console.log(articleQueries.addSectionGallery(gallery, sectionID));
    connection.query(articleQueries.addSectionGallery(gallery, sectionID), function (err, rows, fields) {
      if (err) {
        connection.destroy();
        return reject(err);
      }

      connection.destroy();
      resolve(rows.insertId);
    });
  });
};

var linkPhotoWithGallery = function linkPhotoWithGallery(photoID, galleryID, title, alt, source) {
  return new Promise(function (resolve, reject) {
    var connection = connectionRequest.connectionRequest();
    connection.query(articleQueries.linkPhotoWithGallery(photoID, galleryID, title, alt, source)), function (err, rows, fields) {
      if (err) {
        connection.destroy();
        reject(err);
      }

      connection.destroy();
      resolve(rows);
    };
  });
};

router.post("/articles/add", function _callee3(req, res) {
  var article, articleRes, tags, links;
  return regeneratorRuntime.async(function _callee3$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          article = req.body;
          _context4.next = 4;
          return regeneratorRuntime.awrap(createArticle(article));

        case 4:
          articleRes = _context4.sent;
          _context4.next = 7;
          return regeneratorRuntime.awrap(Promise.all(article.tags.map(function (tag) {
            return addTag(tag);
          })));

        case 7:
          tags = _context4.sent;
          _context4.next = 10;
          return regeneratorRuntime.awrap(Promise.all(article.tags.map(function (tag) {
            return linkTag(tag, articleRes);
          })));

        case 10:
          links = _context4.sent;
          article.sections.forEach(function _callee2(section, index) {
            var sectionID, galleryID;
            return regeneratorRuntime.async(function _callee2$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    _context3.next = 2;
                    return regeneratorRuntime.awrap(addSection(section, articleRes, index + 1));

                  case 2:
                    sectionID = _context3.sent;
                    console.log(section);

                    if (!section.gallery) {
                      _context3.next = 15;
                      break;
                    }

                    _context3.prev = 5;
                    _context3.next = 8;
                    return regeneratorRuntime.awrap(addSectionGallery(section.gallery, sectionID));

                  case 8:
                    galleryID = _context3.sent;
                    section.gallery.photos.forEach(function _callee(photo) {
                      return regeneratorRuntime.async(function _callee$(_context2) {
                        while (1) {
                          switch (_context2.prev = _context2.next) {
                            case 0:
                              _context2.next = 2;
                              return regeneratorRuntime.awrap(linkPhotoWithGallery(photo.id, galleryID, photo.title, photo.alternative, photo.source));

                            case 2:
                            case "end":
                              return _context2.stop();
                          }
                        }
                      });
                    });
                    _context3.next = 15;
                    break;

                  case 12:
                    _context3.prev = 12;
                    _context3.t0 = _context3["catch"](5);
                    console.log(_context3.t0);

                  case 15:
                  case "end":
                    return _context3.stop();
                }
              }
            }, null, null, [[5, 12]]);
          });
          _context4.next = 18;
          break;

        case 14:
          _context4.prev = 14;
          _context4.t0 = _context4["catch"](0);
          console.error(_context4.t0);
          res.status(500).err({
            err: _context4.t0
          });

        case 18:
          res.status(201).send();

        case 19:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 14]]);
});
var _default = router;
exports["default"] = _default;