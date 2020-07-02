import { User } from "../models/userschema";

export const getAllUsers = () => {
  return User.find({}, { _id: 0 });
};

export const getUsersBySearch = (search, sort, limit, skipField) => {
  return User.find(search).sort(sort).limit(limit).skip(skipField);
};

export const insertMany = (employeeList) => {
  // return User.insertMany(employeeList);
  function cb(err, result) {
    if (err) {
      return err;
    }
    return result;
  }
  const options = { upsert: true };
  for (var employee of employeeList) {
    const findId = { id: employee.id };
    const updateObj = {
      login: employee.login,
      name: employee.name,
      salary: employee.salary,
    };

    return User.findOneAndUpdate(findId, updateObj, options, cb);
  }
};
