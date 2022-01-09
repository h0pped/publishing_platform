import mysql from "mysql2";
export const connectionRequest = () => {
  let connection = mysql.createConnection({
    host: process.env.LOCALDB_HOST,
    port: process.env.LOCALDB_PORT,
    user: process.env.LOCALDB_USER,
    database: process.env.LOCALDB_NAME,
    password: process.env.LOCALDB_PASSWORD,
  });
  //Instantiate the connection
  connection.connect(function (err) {
    if (err) {
      console.log(`connectionRequest Failed ${err.stack}`);
    } else {
      console.log(`DB connectionRequest Successful ${connection.threadId}`);
    }
  });

  //return connection object
  return connection;
};
