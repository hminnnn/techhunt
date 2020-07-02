import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import { userRouter } from "./routes/users";
import * as dotenv from "dotenv";
const app = express();

const envPath = process.env.NODE_ENV;
dotenv.config({ path: "./.env." + envPath?.toString() });

console.log(envPath)
console.log(process.env.DB_HOST);
const mongoConnectionStr = process.env.DB_HOST || "";
mongoose.connect("mongodb://192.168.99.100:27017/techhunt", {

// mongoose.connect(mongoConnectionStr, {
  useNewUrlParser: true,
});
const db = mongoose.connection;

db.on("error", (err) => {
  console.error("connection error:", err);
});

app.use(cors());
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({type: 'multipart/form-data'}))
// app.use(bodyParser.raw({type: 'multipart/form-data'}));

app.use("/users", userRouter);

app.listen(5000, function () {
  console.log("listening on 5000");
});
