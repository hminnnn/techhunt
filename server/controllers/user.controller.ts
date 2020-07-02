import * as UserDAO from "../dao/users.dao";

export const getMaxPageNum = function (req, res, next) {
  const limit = 30;
  UserDAO.getAllUsers()
    .then((result) => {
      const maxPage = Math.ceil(result.length / limit);
      return res.json(maxPage).status(200);
    })
    .catch((err) => {
      return res.json({ error: "Unable to max page number" }).status(400);
    });
};

export const getAllUsers = function (req, res, next) {
  UserDAO.getAllUsers()
    .then((result) => {
      return res.json({ employees: result }).status(200);
    })
    .catch((err) => {
      return res.json({ error: "Unable to get all users" }).status(400);
    });
};

export const getUsers = function (req, res, next) {
  const params = req.query;
  console.log("getUsers!", params);

  // validate params
  const err = { error: "Request params are missing or of invalid format." };
  if (!validateGetUserParams(req.query)) {
    return res.status(400).json(err);
  }

  // find
  const minSalary = Number(params.minSalary.trim());
  const maxSalary = Number(params.maxSalary.trim());
  const offset = Number(params.offset.trim());
  const limit = 30;
  const sort = params.sort.trim();
  const search = {
    salary: { $gte: minSalary, $lte: maxSalary },
  };

  console.log(
    "search params::",
    search,
    sort,
    "limit:",
    limit,
    "offset:",
    offset
  );
  UserDAO.getUsersBySearch(search, sort, limit, offset)
    .then((result) => {
      return res.json({ employees: result }).status(200);
    })
    .catch((e) => {
      console.log("error:", e);
      return res.json({ error: "Unable to get users" }).status(400);
    });
};

function validateGetUserParams(params) {
  if (
    !params.minSalary ||
    !params.maxSalary ||
    !params.offset ||
    !params.limit ||
    !params.sort
  ) {
    return false;
  }

  const sortFields = ["id", "name", "login", "salary"];

  try {
    const minSalary = Number(params.minSalary.trim());
    const maxSalary = Number(params.maxSalary.trim());
    const offset = Number(params.offset.trim());
    const limit = Number(params.limit.trim());
    let sort = params.sort.trim();

    console.log(minSalary, maxSalary, offset, limit, sort);

    if (isNaN(minSalary) || isNaN(maxSalary) || isNaN(offset) || isNaN(limit)) {
      return false;
    }

    sort = sort.replace("-", "");
    if (!sortFields.includes(sort)) {
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
}
