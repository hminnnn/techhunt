import axios from "axios";
import { SearchParams } from "../employee/EmployeeDashboard";

const envPath = process.env.NODE_ENV;
let baseUrl = process.env.REACT_APP_BACKEND_CONN;

console.log("envPath:", envPath);
console.log("baseUrl:", baseUrl);

export class UserService {
  instance = axios.create({
    // .. where we make our configurations
    baseURL: baseUrl,
  });

  async getUsers(searchParams: SearchParams) {
    const offset = 30 * (searchParams.pageNumber - 1);
    const res = await this.instance
      .get(
        "/users?minSalary=" +
          searchParams.minSalary +
          "&maxSalary=" +
          searchParams.maxSalary +
          "&offset=" +
          offset +
          "&limit=" +
          searchParams.limit +
          "&sort=" +
          searchParams.sortField
      )

      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        throw err.response.data.error;
      });
    return res;
  }

  async getAllUsers() {
    const res = await this.instance
      .get("/users/all")
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        if (err.response !== undefined) {
          throw err.response.data.error;
        }
          throw new Error("Error")
      });
    return res;
  }

  async uploadUsers(uploadFile: any) {
    const data = new FormData();
    data.append("file", uploadFile);
    const res = await this.instance
      .post("/users/upload", data)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        throw err.response.data.error;
      });
    return res;
  }
}
