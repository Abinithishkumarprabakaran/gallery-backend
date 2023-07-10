import express from "express";
import { MongoClient } from "mongodb";
import * as dotenv from 'dotenv';
import userRouter from './router/users.router.js';
import cors from 'cors';

dotenv.config();

export  const app = express();
const PORT = process.env.PORT;

const client = new MongoClient(process.env.MONGO_URL);
await client.connect();
console.log("Mongo is Connected!");

app.use(cors())

app.use(express.json())

app.get("/", function(request, response) {
  response.send("Hello, I'm a Server");
});

app.use("/users", userRouter);

app.listen(PORT, () => console.log(`Server in ${PORT} has Started`));

export { client }