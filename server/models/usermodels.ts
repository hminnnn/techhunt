export interface UserParams {
  minSalary: number;
  maxSalary: number;
  offset: number;
  limit: number;
  sort: string;
}

export interface Employee {
  id: string;
  login: string;
  name: string;
  salary: number;
}
