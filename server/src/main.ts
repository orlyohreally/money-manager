// tslint:disable-next-line
import * as mongoose from "mongoose";
mongoose.connect("mongodb://localhost:27017/money-manager");

import * as express from "express";
import "module-alias/register";
const app: express.Application = express();
const port = 3000;

app.listen(port, () => {
  console.log("Example app listening on port 3000!");
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});
