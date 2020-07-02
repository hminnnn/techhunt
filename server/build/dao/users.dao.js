"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertMany = exports.getUsersBySearch = exports.getAllUsers = void 0;
var userschema_1 = require("../models/userschema");
exports.getAllUsers = function () {
    return userschema_1.User.find({}, { _id: 0 });
};
exports.getUsersBySearch = function (search, sort, limit, skipField) {
    return userschema_1.User.find(search).sort(sort).limit(limit).skip(skipField);
};
exports.insertMany = function (employeeList) {
    // return User.insertMany(employeeList);
    function cb(err, result) {
        if (err) {
            return err;
        }
        return result;
    }
    var options = { upsert: true };
    for (var _i = 0, employeeList_1 = employeeList; _i < employeeList_1.length; _i++) {
        var employee = employeeList_1[_i];
        var findId = { id: employee.id };
        var updateObj = {
            login: employee.login,
            name: employee.name,
            salary: employee.salary,
        };
        return userschema_1.User.findOneAndUpdate(findId, updateObj, options, cb);
    }
};
