const User = require("../models/userschema");


exports.getAllUsers = function () {
    return User.find({}, { _id: 0 });
}


exports.getUsersBySearch = function (search, sort, limit, skipField) {
    return User.find(search).sort(sort).limit(limit).skip(skipField);
}

exports.insertMany = function (employeeList) {
    return User.insertMany(employeeList);
}