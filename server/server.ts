import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import { userRouter } from "./routes/users";
import * as dotenv from "dotenv";

const app = express();
const envPath = process.env.NODE_ENV;
dotenv.config({ path: "./.env." + envPath?.toString() });

console.log(envPath);
console.log(process.env.DB_HOST);
const mongoConnectionStr = process.env.DB_HOST || "";

mongoose
  .connect(mongoConnectionStr, {
    useUnifiedTopology: true, // settings to fix deprecation warning
    useNewUrlParser: true, 
    useCreateIndex: true, 
    useFindAndModify: false
  })
  .then(() => {
    console.log("mongo connection sucess");
  })
  .catch((err) => {
    console.log("mongo connection failed - " + err);
  });


app.use(cors());
app.use(bodyParser.json());

app.use("/users", userRouter);

app.listen(5000, function () {
  console.log("listening on 5000");
});
