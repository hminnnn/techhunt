import * as UserDAO from "../dao/users.dao";
import { Response, Request, NextFunction } from "express";
import { UserParams } from "../models/usermodels";
import * as messages from "../resources/messages.json";

const limit = 30;


export const getAllUsers = async function (req: Request, res: Response, next: NextFunction) {

  // find
  const sort = "id"
  const search = {
  };

  // console.log("search params::", search, sort, "limit:", limit, "offset:", params.offset);
  try {
    const maxPageRes = await UserDAO.getUsersBySearch(search, sort, 0, 0);
    const maxPage = getMaxPageNumFromResults(maxPageRes);
    const results = await UserDAO.getUsersBySearch(search, sort, 0, 0);
    return res.json({ results: results, maxPage: maxPage }).status(200);
  } catch (e) {
    console.log("error:", e);
    return res.json({ error: messages.user.get.error.error }).status(400);
  }

};

// export const getAllUsers = function (req: Request, res: Response, next: NextFunction) {
//   UserDAO.getAllUsers()
//     .then((result) => {
//       return res.json({ results: result }).status(200);
//     })
//     .catch((err) => {
//       return res.json({ error: messages.user.get.error.error }).status(400);
//     });
// };

export const getUsers = async function (req: Request, res: Response, next: NextFunction) {
  // validate params
  const err = { error: messages.user.get.error.searchparams };
  const params = validateGetUserParams(req.query);
  if (params === null) {
    return res.status(400).json(err);
  }

  // find
  const sort = params.sort.trim();
  const search = {
    salary: { $gte: params.minSalary, $lte: params.maxSalary },
  };

  // console.log("search params::", search, sort, "limit:", limit, "offset:", params.offset);
  try {
    const maxPageRes = await UserDAO.getUsersBySearch(search, sort, 0, 0);
    const maxPage = getMaxPageNumFromResults(maxPageRes);
    const results = await UserDAO.getUsersBySearch(search, sort, limit, params.offset);
    return res.json({ results: results, maxPage: maxPage }).status(200);
  } catch (e) {
    console.log("error:", e);
    return res.json({ error: messages.user.get.error.error }).status(400);
  }

};

function getMaxPageNumFromResults(results: any[]) {
  return Math.ceil(results.length / limit);
}

function validateGetUserParams(queryParams: any) {
  if (
    !queryParams.minSalary ||
    !queryParams.maxSalary ||
    !queryParams.offset ||
    !queryParams.limit ||
    !queryParams.sort
  ) {
    return null;
  }

  const sortFields = ["id", "name", "login", "salary"];

  try {
    const minSalary = parseFloat(queryParams.minSalary.trim());
    const maxSalary = parseFloat(queryParams.maxSalary.trim());
    const offset = parseInt(queryParams.offset.trim());
    const limit = parseInt(queryParams.limit.trim());
    let sortCheck = queryParams.sort.trim();

    if (isNaN(minSalary) || isNaN(maxSalary) || isNaN(offset) || isNaN(limit)) {
      return null;
    }

    sortCheck = sortCheck.replace("-", "");
    if (!sortFields.includes(sortCheck)) {
      return null;
    }

    const userParams: UserParams = {
      minSalary: minSalary,
      maxSalary: maxSalary,
      offset: offset,
      limit: limit,
      sort: queryParams.sort,
    };
    return userParams;
  } catch (e) {
    return null;
  }
}
