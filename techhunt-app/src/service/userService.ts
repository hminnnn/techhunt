import axios from "axios";
import { SearchParams } from "../EmployeeDashboard";

export class UserService {
  instance = axios.create({
    // .. where we make our configurations
    baseURL: "http://localhost:5000",
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
      });
    return res;
  }

  async getMaxPageNum() {
    const res = await this.instance.get("/users/maxPage").then((res) => {
      return res.data;
    });
    return res;
  }

  async getAllUsers() {
    const res = await this.instance.get("/users/all").then((res) => {
      return res.data;
    });
    return res;
  }

  async uploadUsers(uploadFile: any) {
    const data = new FormData();
    data.append("file", uploadFile);
    const res = await this.instance.post("/users/upload", data).then((res) => {
      return res.data;
    });
    return res;
  }
}
