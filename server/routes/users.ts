import express from "express";
import { uploadUser } from "../controllers/userupload.controller";
import {
  getUsers,
  getAllUsers,
} from "../controllers/user.controller";

export const userRouter = express.Router();

userRouter.get("/", getUsers);
userRouter.get("/all", getAllUsers);
userRouter.post("/upload", uploadUser);


