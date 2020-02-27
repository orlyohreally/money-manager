// tslint:disable-next-line
import "module-alias/register";

import * as bodyParser from "body-parser";
import * as express from "express";
import * as mongoose from "mongoose";
import * as path from "path";
import { familiesRouter } from "./services/families";
import { paymentSubjectsRouter } from "./services/payment-subjects";
import { paymentsRouter } from "./services/payments";
import { usersRouter } from "./services/users";

const runServer = async () => {
  // const port = process.env.port;
  // if (!port) {
  //   console.log("port is not set");
  //   process.exit(1);
  // }
  await mongoose.connect(process.env.mongodb_uri as string);

  const apiPath = "/api/v1";
  const app: express.Application = express();

  app.listen(80, () => {
    console.log("Example app listening on port 3000!");
  });

  app.use(bodyParser.json({ limit: "10mb" }));
  app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

  app.use(apiPath, familiesRouter);
  app.use(apiPath, paymentSubjectsRouter);
  app.use(apiPath, paymentsRouter);
  app.use(apiPath, usersRouter);

  if (process.env.NODE_ENV === "production") {
    app.use(express.static(`${__dirname}/assets/frontend`));

    app.get("/*", (req, res) => {
      res.sendFile(path.join(`${__dirname}/assets/frontend/index.html`));
    });
  }
};

runServer().catch(console.error);
