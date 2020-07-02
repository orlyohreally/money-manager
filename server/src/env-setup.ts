import * as dotenv from "dotenv";
import * as path from "path";

export function setupEnv() {
  const envFile = path.join(
    __dirname,
    process.env.NODE_ENV === "testing" ? "../.env.test" : "../.env"
  );
  dotenv.config({ path: envFile });
}
