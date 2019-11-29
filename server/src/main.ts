// tslint:disable-next-line
import "module-alias/register";

import * as bodyParser from "body-parser";
import * as express from "express";
import * as mongoose from "mongoose";

import { familiesRouter } from "./services/families";
import { usersRouter } from "./services/users";

const runServer = async () => {
  await mongoose.connect("mongodb://localhost:27017/money-manager");

  const apiPath = "/api/v1";
  const app: express.Application = express();
  const port = 3000;

  app.listen(port, () => {
    console.log("Example app listening on port 3000!");
  });

  app.use(bodyParser.json({ limit: "10mb" }));
  app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

  app.use(apiPath, familiesRouter);
  app.use(apiPath, usersRouter);
};

runServer().catch(console.error);
