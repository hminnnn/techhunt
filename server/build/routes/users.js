"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
var express_1 = __importDefault(require("express"));
var userupload_controller_1 = require("../controllers/userupload.controller");
var user_controller_1 = require("../controllers/user.controller");
exports.userRouter = express_1.default.Router();
exports.userRouter.get("/", user_controller_1.getUsers);
exports.userRouter.get("/all", user_controller_1.getAllUsers);
exports.userRouter.get("/maxPage", user_controller_1.getMaxPageNum);
exports.userRouter.post("/upload", userupload_controller_1.uploadUser);
