import { validateEmployeeFields } from "../controllers/userupload.controller";
import { Employee } from "../models/usermodels";

test("valid employee object - non english name", () => {
  const employee: Employee = {
    id: "12345abcde",
    login: "12345abcde",
    name: "你好",
    salary: 123.45,
  };
  expect(validateEmployeeFields(employee)).toBe(true);
});

test("valid employee object - salary = 0", () => {
  const employee: Employee = {
    id: "hello12345",
    login: "12345abcde",
    name: "hello",
    salary: 0,
  };
  expect(validateEmployeeFields(employee)).toBe(true);
});

test("invalid employee object - not alphanum id - non english", () => {
  const employee: Employee = {
    id: "你好",
    login: "12345abcde",
    name: "hello",
    salary: 123.45,
  };
  expect(validateEmployeeFields(employee)).toBe(false);
});

test("invalid employee object - not alphanum id - special char", () => {
  const employee: Employee = {
    id: "hello!!!",
    login: "12345abcde",
    name: "hello",
    salary: 123.45,
  };
  expect(validateEmployeeFields(employee)).toBe(false);
});

test("invalid employee object - not alphanum login - non english" , () => {
  const employee: Employee = {
    id: "hello12345",
    login: "12345abcde你好",
    name: "hello",
    salary: 123.45,
  };
  expect(validateEmployeeFields(employee)).toBe(false);
});

test("invalid employee object - not alphanum login - special char", () => {
  const employee: Employee = {
    id: "hello12345",
    login: "hello!!!",
    name: "hello",
    salary: 123.45,
  };
  expect(validateEmployeeFields(employee)).toBe(false);
});

test("invalid employee object - salary < 0", () => {
  const employee: Employee = {
    id: "hello12345",
    login: "12345abcde",
    name: "hello",
    salary: -2,
  };
  expect(validateEmployeeFields(employee)).toBe(false);
});
