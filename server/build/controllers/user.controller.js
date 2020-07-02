"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = exports.getAllUsers = exports.getMaxPageNum = void 0;
var UserDAO = __importStar(require("../dao/users.dao"));
exports.getMaxPageNum = function (req, res, next) {
    var limit = 30;
    UserDAO.getAllUsers()
        .then(function (result) {
        var maxPage = Math.ceil(result.length / limit);
        return res.json(maxPage).status(200);
    })
        .catch(function (err) {
        return res.json({ error: "Unable to max page number" }).status(400);
    });
};
exports.getAllUsers = function (req, res, next) {
    UserDAO.getAllUsers()
        .then(function (result) {
        return res.json({ employees: result }).status(200);
    })
        .catch(function (err) {
        return res.json({ error: "Unable to get all users" }).status(400);
    });
};
exports.getUsers = function (req, res, next) {
    var params = req.query;
    console.log("getUsers!", params);
    // validate params
    var err = { error: "Request params are missing or of invalid format." };
    if (!validateGetUserParams(req.query)) {
        return res.status(400).json(err);
    }
    // find
    var minSalary = Number(params.minSalary.trim());
    var maxSalary = Number(params.maxSalary.trim());
    var offset = Number(params.offset.trim());
    var limit = 30;
    var sort = params.sort.trim();
    var search = {
        salary: { $gte: minSalary, $lte: maxSalary },
    };
    console.log("search params::", search, sort, "limit:", limit, "offset:", offset);
    UserDAO.getUsersBySearch(search, sort, limit, offset)
        .then(function (result) {
        return res.json({ employees: result }).status(200);
    })
        .catch(function (e) {
        console.log("error:", e);
        return res.json({ error: "Unable to get users" }).status(400);
    });
};
function validateGetUserParams(params) {
    if (!params.minSalary ||
        !params.maxSalary ||
        !params.offset ||
        !params.limit ||
        !params.sort) {
        return false;
    }
    var sortFields = ["id", "name", "login", "salary"];
    try {
        var minSalary = Number(params.minSalary.trim());
        var maxSalary = Number(params.maxSalary.trim());
        var offset = Number(params.offset.trim());
        var limit = Number(params.limit.trim());
        var sort = params.sort.trim();
        console.log(minSalary, maxSalary, offset, limit, sort);
        if (isNaN(minSalary) || isNaN(maxSalary) || isNaN(offset) || isNaN(limit)) {
            return false;
        }
        sort = sort.replace("-", "");
        if (!sortFields.includes(sort)) {
            return false;
        }
        return true;
    }
    catch (e) {
        return false;
    }
}
