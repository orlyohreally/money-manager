// tslint:disable-next-line
import "module-alias/register";

import * as bodyParser from "body-parser";
import * as express from "express";
import * as mongoose from "mongoose";

import { familiesRouter } from "./services";

const runServer = async () => {
  await mongoose.connect("mongodb://localhost:27017/money-manager");

  const apiPath = "/api/v1";
  const app: express.Application = express();
  const port = 3000;

  app.listen(port, () => {
    console.log("Example app listening on port 3000!");
  });

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  app.use(apiPath, familiesRouter);

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });
};

runServer().catch(console.error);
