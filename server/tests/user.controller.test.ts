import { validateGetUserParams } from "../controllers/user.controller";
import { UserParams } from "../models/usermodels";

test("invalid parameters - empty obj", () => {
  const paramObj = {};
  expect(validateGetUserParams(paramObj)).toBeNull();
});

test("invalid parameters - sort", () => {
  const paramObj = {
    minSalary: 0.0,
    maxSalary: 100.0,
    offset: 0,
    limit: 0,
    sort: "logins",
  };
  expect(validateGetUserParams(paramObj)).toBeNull();
});

test("invalid parameters - salary not number", () => {
  const paramObj = {
    minSalary: "a",
    maxSalary: 100.0,
    offset: 0,
    limit: 0,
    sort: "-login",
  };
  expect(validateGetUserParams(paramObj)).toBeNull();
});

test("invalid parameters - offset not number", () => {
  const paramObj = {
    minSalary: 0,
    maxSalary: 100.0,
    offset: "a  ",
    limit: 0,
    sort: "-login",
  };
  expect(validateGetUserParams(paramObj)).toBeNull();
});

