"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uploadFile = uploadFile;
exports.storageRef = exports.admin = exports.cred = void 0;

var _firebaseAdmin = _interopRequireDefault(require("firebase-admin"));

var _uuid = require("uuid");

var pathlib = _interopRequireWildcard(require("path"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _dirname = pathlib.resolve(); // import serviceAccount from "./publishing-platform-cff1c-firebase-adminsdk-toi9e-d38d224a25.json";


var cred = {
  type: "service_account",
  project_id: "publishing-platform-cff1c",
  private_key_id: "d38d224a25624189aecf1fb7d8c173cfade81916",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDnMSJvNAt4c8PH\nc1ggWZkvIt1BlzfwguRw0skbRXSAuN1i9wlLy7F9VwDcoePd3J2tV6iQawzenCHX\nff8OiftYVBfVH0OZIcE4kMUbX3L65YlDm6Efm38SWzgsRto5K58gYR50ZGg4DCIz\nS3XVe71h/kWpFhj8MtmtRUdQfqWjNwfP7apd7gqptLHhN+3qZIb9NEUdYjG4Vy2/\n7ylDUKSd++6BHkjzcExwndI5mf/IE1o3EDZyqtmmSzFydBWBT9EXwBv801qpWx3M\nwsPudYOfFny2iBJxE9DrKS/ceR9MDcopTW8ffI4jNW1yn4oUWJHhmnVKYfiywYZw\nWPT2aqH5AgMBAAECggEAJEZeW8pzvkuTvXjIrBLC6VV0F/WNLmyrQVShf2jvdb8L\n5ZpTWBQ23i7HkNbJ9SbHispFRZu2YjtnR/OaEILv8BUJxEPqjF1yftigRMI+PUXE\nutnxdw8j6hJsBu57ERtaFW+HosWaYKjuuNOvQnbu6TBHZ9dyxieIZhqHrQaiILCW\nbNfIqX6N3mIRBT9aA7edqxIcnsUFC1XK5DyR0AxjC9m3QSZAHgJUZlhn79pi4NU8\n9MfcKO2eLEtFOUOhj2rmef3hcAYhYWHQK/ewBARVYfgtQGwVaNJTqZgkNqJ5LCUH\nEzgrGvAhVyNeL170VcJIQeBctbwonZnG9JbWIklqcQKBgQD2C1ro8rJ62zierFz7\n3W5eIMffti2tsXIBAlRDDrbugd9e/pyiB4OUXjzDDSJ+K6auxV6CS1b8DWft9/Z5\nLgFmfEyZAnk3ee+RJhgC2eOjM6G5WzNVh59aVQ8Hg0xNctS8USVBd22jz08cLXkz\nf5/jfXJ4YbpW0UQaHBnlnaAhjQKBgQDwi+5O96/9H8UbtoBk6qPSG7Axsr82hL7u\nANxyoBgUDzJdzAKal4SYlk4U98etJdHTQGF99iPD24WYD1gfWVgtl1Wmuu3hxajN\nqJZj4Q1sP//l+K/VqQ6UNsHocoBmCSqiVvGGVNoOK6am16GT+vOiHSORG+r3QNrK\nzFjiKJRpHQKBgQCixFJIxr1RzxJ+zbHZoNvxgygWk7NWM4wipMLPdb2IvPvjIPbH\nrcba8RirRFYsN35WIhVqhqKtrcSyRZaVBd1BSjt2AY/lJlJYqGW8BR61iWOUdoPY\nMhc2MAz4QGDK34tiZSALVhF/C5bfIioK6oQAf62pe6VE571wtGRhZUxYxQKBgQDk\ngBhlnTXpXrePxsKamqX53eF2pFSthlYUom7G2DtnOrRek4BZt9r2U7lig6mDWizC\n3yJ9VEbPM4XpV5IfXXC9BkgPtPxp/qiGjEIoKM3mabk9jQoDDa/SrV1v4O0FgGmm\ngq62K35j/aU2UhmkB7xN4B48JugB7fKouIsqct/gJQKBgBAF63gMJogokmoo5yqm\n9TquNgdSatdLTg5Rxum5Mx6jE86QBHhf3JdZH2QmfatTm35XUGrN6YyKAic5/Q6H\nnbKDovMehdc8eq4LWUu9GEsamfy41Y0DJzyBt3KOhnpWdvBdRYrUuor9YKfyabXQ\n6OVJAjNEcXBNs5sDdS6I+zbp\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-toi9e@publishing-platform-cff1c.iam.gserviceaccount.com",
  client_id: "109549936869779126324",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-toi9e%40publishing-platform-cff1c.iam.gserviceaccount.com"
};
exports.cred = cred;

var admin = _firebaseAdmin["default"].initializeApp({
  credential: _firebaseAdmin["default"].credential.cert(cred)
});

exports.admin = admin;
var storageRef = admin.storage().bucket("gs://publishing-platform-cff1c.appspot.com");
exports.storageRef = storageRef;

function uploadFile(path, filename) {
  var storage;
  return regeneratorRuntime.async(function uploadFile$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(storageRef.upload(pathlib.join(_dirname, path), {
            "public": true,
            destination: "/uploads/hashnode/".concat(filename),
            metadata: {
              firebaseStorageDownloadTokens: (0, _uuid.v4)()
            }
          }));

        case 2:
          storage = _context.sent;
          return _context.abrupt("return", storage[0].metadata.mediaLink);

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
}