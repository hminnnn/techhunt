"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var mongoose_1 = __importDefault(require("mongoose"));
var cors_1 = __importDefault(require("cors"));
var users_1 = require("./routes/users");
var app = express_1.default();
mongoose_1.default.connect("mongodb://localhost:27017/techhunt", {
    useNewUrlParser: true,
});
var db = mongoose_1.default.connection;
db.on("error", function (err) {
    console.error("connection error:", err);
});
app.use(cors_1.default());
app.use(body_parser_1.default.json());
// app.use(bodyParser.urlencoded({type: 'multipart/form-data'}))
// app.use(bodyParser.raw({type: 'multipart/form-data'}));
app.use("/users", users_1.userRouter);
app.listen(5000, function () {
    console.log("listening on 5000");
});
