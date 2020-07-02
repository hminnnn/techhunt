

import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import { userRouter } from './routes/users';
const app = express();
mongoose.connect("mongodb://localhost:27017/techhunt", {
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
