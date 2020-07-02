import * as UserDAO from "../dao/users.dao";
import { Response, Request, NextFunction } from "express";

interface UserParams {
  minSalary: number;
  maxSalary: number;
  offset: number;
  limit: number;
  sort: string;
}

export const getMaxPageNum = function (req: Request, res: Response, next: NextFunction) {
  const limit = 30;
  UserDAO.getAllUsers()
    .then((result) => {
      const maxPage: number = Math.ceil(result.length / limit);
      return res.status(200).json(maxPage);
    })
    .catch((err) => {
      return res.json({ error: "Unable to max page number" }).status(400);
    });
};

export const getAllUsers = function (req: Request, res: Response, next: NextFunction) {
  UserDAO.getAllUsers()
    .then((result) => {
      return res.json({ employees: result }).status(200);
    })
    .catch((err) => {
      return res.json({ error: "Unable to get all users" }).status(400);
    });
};


export const getUsers = function (req: Request, res: Response, next: NextFunction) {
  // validate params
  const err = { error: "Request params are missing or of invalid format." };
  const params = validateGetUserParams(req.query);
  if (params === null) {
    return res.status(400).json(err);
  }

  // find
  const limit = 30;
  const sort = params.sort.trim();
  const search = {
    salary: { $gte: params.minSalary, $lte: params.maxSalary },
  };

  // console.log("search params::", search, sort, "limit:", limit, "offset:", params.offset);
  
  UserDAO.getUsersBySearch(search, sort, limit, params.offset)
    .then((result) => {
      return res.json({ employees: result }).status(200);
    })
    .catch((e) => {
      console.log("error:", e);
      return res.json({ error: "Unable to get users" }).status(400);
    });
};

function validateGetUserParams(queryParams:any) {
  if (!queryParams.minSalary || !queryParams.maxSalary || !queryParams.offset || !queryParams.limit || !queryParams.sort) {
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
