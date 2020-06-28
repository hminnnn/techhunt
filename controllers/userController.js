
var User = require("../models/userSchema");

exports.createUser = (req, res) => {
  const file = req.file;
  console.log(req)
  console.log(file)
  var user = {
    id: req.body.id,
    login: req.body.login,
    name: req.body.name,
    salary: req.body.salary,
  };
  // User.create(user, (err, user) => {
  //   if (err) {
  //     res.json({
  //       error: err,
  //     });
  //   }
  //   res.json({
  //     message: "Hero created successfully",
  //   });
  // });
};


exports.getAllUsers = function (req, res, next) {
  const limit = 30;
  User.find({}, { _id: 0 }).limit(limit).then(result => {
    console.log("all:", { employees: result })
    return res.json({ employees: result }).status(200)
  })
}

exports.getUsers = function (req, res, next) {
  const params = req.query;
  console.log("getUsers!" ,params);

  // validate params
  const err = { error: "Request params are missing or of invalid format." }
  if (!validateGetUserParams(req.query)) {
    return res.status(400).json(err);
  }

  // find
  const minSalary = Number(params.minSalary.trim())
  const maxSalary = Number(params.maxSalary.trim());
  const offset = Number(params.offset.trim());
  const limit = 30;
  const sort = params.sort.trim();

  const search = {
    salary: { $gte: minSalary },
    salary: { $lte: maxSalary },
  }

  let skipField = 0;
  if (offset > 0) {
    skipField = limit + offset;
  }

  User.find(search).sort(sort).limit(limit).skip(skipField).then(result => {
    console.log(result)
    return res.json({ employees: result }).status(200)
  }).catch(e => {
    console.log("error:", e)
  })

};

function validateGetUserParams(params) {
  if (!params.minSalary || !params.maxSalary || !params.offset || !params.limit || !params.sort) {
    return false;
  }

  const sortFields = ["id", "name", "login", "salary"]

  try {
    const minSalary = Number(params.minSalary.trim())
    const maxSalary = Number(params.maxSalary.trim());
    const offset = Number(params.offset.trim());
    const limit = Number(params.limit.trim());
    let sort = params.sort.trim();

    console.log(minSalary, maxSalary, offset, limit, sort)

    if (isNaN(minSalary) || isNaN(maxSalary) || isNaN(offset) || isNaN(limit)) {
      return false
    }

    sort = sort.replace('-', '');
    if (!sortFields.includes(sort)) {
      return false;
    }
    return true;

  } catch (e) {
    return false;
  }


}