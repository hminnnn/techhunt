import express from "express";
import { uploadUser } from "../controllers/userupload.controller";
import {
  getUsers,
  getAllUsers,
  getMaxPageNum,
} from "../controllers/user.controller";
export const userRouter = express.Router();

userRouter.get("/", getUsers);
userRouter.get("/all", getAllUsers);
userRouter.get("/maxPage", getMaxPageNum);
userRouter.post("/upload", uploadUser);


