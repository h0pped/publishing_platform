import firebaseAdmin from "firebase-admin";
import { v4 as uuidv4 } from "uuid";
import * as pathlib from "path";
const __dirname = pathlib.resolve();

// import serviceAccount from "./publishing-platform-cff1c-firebase-adminsdk-toi9e-d38d224a25.json";

const cred = {
  type: "service_account",
  project_id: "publishing-platform-cff1c",
  private_key_id: "d38d224a25624189aecf1fb7d8c173cfade81916",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDnMSJvNAt4c8PH\nc1ggWZkvIt1BlzfwguRw0skbRXSAuN1i9wlLy7F9VwDcoePd3J2tV6iQawzenCHX\nff8OiftYVBfVH0OZIcE4kMUbX3L65YlDm6Efm38SWzgsRto5K58gYR50ZGg4DCIz\nS3XVe71h/kWpFhj8MtmtRUdQfqWjNwfP7apd7gqptLHhN+3qZIb9NEUdYjG4Vy2/\n7ylDUKSd++6BHkjzcExwndI5mf/IE1o3EDZyqtmmSzFydBWBT9EXwBv801qpWx3M\nwsPudYOfFny2iBJxE9DrKS/ceR9MDcopTW8ffI4jNW1yn4oUWJHhmnVKYfiywYZw\nWPT2aqH5AgMBAAECggEAJEZeW8pzvkuTvXjIrBLC6VV0F/WNLmyrQVShf2jvdb8L\n5ZpTWBQ23i7HkNbJ9SbHispFRZu2YjtnR/OaEILv8BUJxEPqjF1yftigRMI+PUXE\nutnxdw8j6hJsBu57ERtaFW+HosWaYKjuuNOvQnbu6TBHZ9dyxieIZhqHrQaiILCW\nbNfIqX6N3mIRBT9aA7edqxIcnsUFC1XK5DyR0AxjC9m3QSZAHgJUZlhn79pi4NU8\n9MfcKO2eLEtFOUOhj2rmef3hcAYhYWHQK/ewBARVYfgtQGwVaNJTqZgkNqJ5LCUH\nEzgrGvAhVyNeL170VcJIQeBctbwonZnG9JbWIklqcQKBgQD2C1ro8rJ62zierFz7\n3W5eIMffti2tsXIBAlRDDrbugd9e/pyiB4OUXjzDDSJ+K6auxV6CS1b8DWft9/Z5\nLgFmfEyZAnk3ee+RJhgC2eOjM6G5WzNVh59aVQ8Hg0xNctS8USVBd22jz08cLXkz\nf5/jfXJ4YbpW0UQaHBnlnaAhjQKBgQDwi+5O96/9H8UbtoBk6qPSG7Axsr82hL7u\nANxyoBgUDzJdzAKal4SYlk4U98etJdHTQGF99iPD24WYD1gfWVgtl1Wmuu3hxajN\nqJZj4Q1sP//l+K/VqQ6UNsHocoBmCSqiVvGGVNoOK6am16GT+vOiHSORG+r3QNrK\nzFjiKJRpHQKBgQCixFJIxr1RzxJ+zbHZoNvxgygWk7NWM4wipMLPdb2IvPvjIPbH\nrcba8RirRFYsN35WIhVqhqKtrcSyRZaVBd1BSjt2AY/lJlJYqGW8BR61iWOUdoPY\nMhc2MAz4QGDK34tiZSALVhF/C5bfIioK6oQAf62pe6VE571wtGRhZUxYxQKBgQDk\ngBhlnTXpXrePxsKamqX53eF2pFSthlYUom7G2DtnOrRek4BZt9r2U7lig6mDWizC\n3yJ9VEbPM4XpV5IfXXC9BkgPtPxp/qiGjEIoKM3mabk9jQoDDa/SrV1v4O0FgGmm\ngq62K35j/aU2UhmkB7xN4B48JugB7fKouIsqct/gJQKBgBAF63gMJogokmoo5yqm\n9TquNgdSatdLTg5Rxum5Mx6jE86QBHhf3JdZH2QmfatTm35XUGrN6YyKAic5/Q6H\nnbKDovMehdc8eq4LWUu9GEsamfy41Y0DJzyBt3KOhnpWdvBdRYrUuor9YKfyabXQ\n6OVJAjNEcXBNs5sDdS6I+zbp\n-----END PRIVATE KEY-----\n",
  client_email:
    "firebase-adminsdk-toi9e@publishing-platform-cff1c.iam.gserviceaccount.com",
  client_id: "109549936869779126324",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-toi9e%40publishing-platform-cff1c.iam.gserviceaccount.com",
};
const admin = firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(cred),
});
const storageRef = admin
  .storage()
  .bucket(`gs://publishing-platform-cff1c.appspot.com`);

async function uploadFile(path, filename) {
  let storage = await storageRef.upload(pathlib.join(__dirname, path), {
    public: true,
    destination: `/uploads/hashnode/${filename}`,
    metadata: {
      firebaseStorageDownloadTokens: uuidv4(),
    },
  });
  return storage[0].metadata.mediaLink;
}

export { cred, admin, storageRef, uploadFile };
