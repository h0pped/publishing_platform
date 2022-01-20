"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _fs = _interopRequireDefault(require("fs"));

var connectionRequest = _interopRequireWildcard(require("../db/connection.js"));

var photoQueries = _interopRequireWildcard(require("../db/queries/photoqueries.js"));

var firebase = _interopRequireWildcard(require("../firebase/firebase.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router();

router.get("/photos/:email", function _callee(req, res) {
  var email, connection;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          email = req.params.email;
          _context.next = 3;
          return regeneratorRuntime.awrap(firebase.uploadFile("/public/user_photos/apps.png", "apps2.png"));

        case 3:
          connection = connectionRequest.connectionRequest();
          connection.query(photoQueries.getPhotosByUserID(email), function (err, dbres, fields) {
            if (err) {
              console.log(err);
              res.status(500).send({
                err: err
              });
            } else {
              res.send(dbres);
            }

            return connection.destroy();
          });

        case 5:
        case "end":
          return _context.stop();
      }
    }
  });
});
router.post("/photos/add", function (req, res) {
  var _req$body = req.body,
      email = _req$body.email,
      img = _req$body.img,
      name = _req$body.name;
  var imgpath;
  var regex;
  var matches;
  var ext;
  var data;
  var buffer;

  try {
    regex = /^data:.+\/(.+);base64,(.*)$/;
    matches = img.match(regex);
    ext = matches[1];
    data = matches[2];
    buffer = Buffer.from(data, "base64");
    imgpath = email + "_" + name + "_" + Date.now() + "." + ext;

    _fs["default"].writeFileSync("./public/user_photos/".concat(imgpath), buffer);

    var connection = connectionRequest.connectionRequest();
    connection.query(photoQueries.addPhoto(email, name, imgpath), function (err, dbres, fields) {
      if (err) {
        console.log(err);
        res.status(500).send({
          err: err
        });
      } else {
        res.status(201).send({
          dbres: dbres
        });
      }

      return connection.destroy();
    });
  } catch (err) {
    console.log(err);
  }
});
var _default = router;
exports["default"] = _default;