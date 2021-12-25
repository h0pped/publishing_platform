import mysql from "mysql2";
import chalk from "chalk";

export const connection = mysql.createConnection({
  host: process.env.LOCALDB_HOST,
  port: process.env.LOCALDB_PORT,
  user: process.env.LOCALDB_USER,
  database: process.env.LOCALDB_NAME,
  password: process.env.LOCALDB_PASSWORD,
});
connection.connect(function (err) {
  if (err) {
    return console.error(chalk.red.bold("Error: " + err.message));
  } else {
    console.log(chalk.green.bold("Succcesfull connection to db!"));
  }
});
