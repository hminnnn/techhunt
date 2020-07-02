import { User } from "../models/userschema";
import { Employee } from "../controllers/userupload.controller";

export const getAllUsers = () => {
  return User.find({}, { _id: 0 });
};

export const getUsersBySearch = (search: any, sort: string, limit: number, skipField: number) => {
  return User.find(search).sort(sort).limit(limit).skip(skipField);
};

export const insertEmployee = (employee: Employee) => {
  const options = { upsert: true };

  const findId = { id: employee.id };
  const updateObj = {
    login: employee.login,
    name: employee.name,
    salary: employee.salary,
  };

  function cb(err: any, result: any) {
    if (err) {
      return err;
    }
    return result;
  }

  return User.findOneAndUpdate(findId, updateObj, options, cb);
};
