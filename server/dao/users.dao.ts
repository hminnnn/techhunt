import { User } from "../schema/userschema";
import { Employee } from "../models/usermodels";

export const getAllUsers = () => {
  return User.find({}, { _id: 0 });
};

export const getUsersBySearch = (search: any, sort: string, limit: number, skipField: number) => {
  return User.find(search).sort(sort).limit(limit).skip(skipField);
};

export const insertEmployee = async (employee: Employee) => {
  const options = { upsert: true };

  const findId = { id: employee.id };
  const updateObj = {
    login: employee.login,
    name: employee.name,
    salary: employee.salary,
  };

  function cb(err: any, result: any) {
    if (err) {
      return new Error(err.message);
    }
    return result;
  }

  return await User.findOneAndUpdate(findId, updateObj, options, cb);
};
