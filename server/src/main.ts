// tslint:disable-next-line
import "module-alias/register";

import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as express from "express";
import * as mongoose from "mongoose";
import * as path from "path";

import { familiesRouter } from "./services/families";
import { paymentSubjectsRouter } from "./services/payment-subjects";
import { paymentsRouter } from "./services/payments";
import { usersRouter } from "./services/users";

const runServer = async () => {
  const port = process.env.server_port;
  if (!port) {
    process.exit(1);
  }
  await mongoose.connect(process.env.mongodb_uri as string);

  const apiPath = "/api/v1";
  const app: express.Application = express();

  app.listen(port, () => {
    console.log("Example app listening on port 3000!");
  });

  if (process.env.NODE_ENV === "staging") {
    const whitelist = ["localhost:4200", process.env.BACK_END_URL];
    const corsOptions = {
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
      },
      // some legacy browsers (IE11, various SmartTVs) choke on 204
      optionsSuccessStatus: 200
    };
    app.use(cors(corsOptions));
  }

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
