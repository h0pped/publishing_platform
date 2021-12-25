import express from "express";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
import "./db/connection.js";
app.get("/", (req, res) => {
  res.send({ anime: "aaa" });
});

app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
