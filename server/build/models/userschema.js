"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var Schema = mongoose_1.default.Schema;
var usersSchema = new Schema({
    id: {
        type: String,
        unique: true,
        required: true,
    },
    login: {
        type: String,
        unique: true,
        required: true,
    },
    name: {
        type: String,
        unique: false,
        required: true,
    },
    salary: {
        type: Number,
        unique: false,
        required: true,
    },
}, {
    collection: 'employees',
    timestamps: true,
});
usersSchema.method({
    toJson: function () {
        var obj = this.toObject();
        delete obj._id;
        return obj;
    }
});
// module.exports = usersSchema;
exports.User = mongoose_1.default.model("User", usersSchema); // register schema with model
