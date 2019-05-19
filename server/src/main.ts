// tslint:disable-next-line
import "module-alias/register";

import * as express from "express";
import * as mongoose from "mongoose";

const runServer = async () => {
  await mongoose.connect("mongodb://localhost:27017/money-manager");

  const app: express.Application = express();
  const port = 3000;

  app.listen(port, () => {
    console.log("Example app listening on port 3000!");
  });

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });
};

runServer().catch(console.error);
