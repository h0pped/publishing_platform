import mysql from "mysql2";

const connection = mysql.createConnection({
  host: process.env.LOCALDB_HOST,
  port: process.env.LOCALDB_PORT,
  user: process.env.LOCALDB_USER,
  database: process.env.LOCALDB_NAME,
  password: process.env.LOCALDB_PASSWORD,
});
connection.connect(function (err) {
  if (err) {
    return console.error("Error: " + err.message);
  } else {
    console.log("Succcesfull connection to db!");
  }
});
