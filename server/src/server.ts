// tslint:disable-next-line
import "module-alias/register";

import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as express from "express";
import * as swaggerGenerator from "express-swagger-generator";
import { Server } from "http";
import * as mongoose from "mongoose";
import * as path from "path";

import { apiDocumentationService } from "./services/api-documentation";
import { familiesRouter } from "./services/families";
import { paymentSubjectsRouter } from "./services/payment-subjects";
import { paymentsRouter } from "./services/payments";
import { testingRouter } from "./services/testing";
import { usersRouter } from "./services/users";

export const runServer = async (
  port: number,
  mongoUri: string
): Promise<Server> => {
  if (!port) {
    process.exit(1);
  }
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  });

  const apiPath = "/api/v1";
  const app: express.Application = express();

  const server = app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
  });
  if (process.env.NODE_ENV === "staging") {
    const whitelist = ["http://localhost:4200", process.env.BACK_END_URL];
    const corsOptions = {
      exposedHeaders: ["Authorization"],
      origin: (
        origin: string | undefined,
        callback: (err: Error | null, allow?: boolean) => void
      ) => {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
          // tslint:disable-next-line: no-null-keyword
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      }
    };
    app.use(cors(corsOptions));
  }

  app.use(bodyParser.json({ limit: "10mb" }));
  app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

  app.use(apiPath, usersRouter);
  app.use(apiPath, paymentSubjectsRouter);
  app.use(apiPath, familiesRouter);
  app.use(apiPath, paymentsRouter);

  if (["development", "staging"].indexOf(process.env.NODE_ENV as string) > -1) {
    app.use(apiPath, testingRouter);
  }

  swaggerGenerator(app)(apiDocumentationService.options);

  app.use(express.static(`${__dirname}/assets/frontend`));

  app.get("/*", (req, res) => {
    res.sendFile(path.join(`${__dirname}/assets/frontend/index.html`));
  });
  console.log("Running server");
  return server;
};
