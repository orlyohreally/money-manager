import { runServer } from "./server";

const port = parseInt(process.env.PORT as string);
const mongoUri: string = process.env.MONGODB_URI as string;
runServer(port, mongoUri).catch(console.error);
