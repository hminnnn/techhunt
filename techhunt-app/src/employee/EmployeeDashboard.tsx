import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import Pagination from "react-bootstrap/Pagination";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";
import { EmployeeUpload } from "./EmployeeUpload";
import { UserService } from "../service/userService";
import Spinner from "react-bootstrap/Spinner";
import { GrowlProvider } from "../common/Growl";

export class Employees {
  public id: string = "";
  public login: string = "";
  public name: string = "";
  public salary: number = 0;
}

export class SearchParams {
  public minSalary: number = 0;
  public maxSalary: number = 100000;
  public pageNumber: number = 1;
  public sortField: string = "id";
  public limit: number = 30;
}

export function Dashboard() {
  const userService = new UserService();

  const [employees, setEmployees] = useState<Array<Employees>>(new Array<Employees>());
  const [activePage, setActivePage] = useState<Number>(1);
  const [searchParams, setSearchParams] = useState<SearchParams>(new SearchParams());
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [minSalary, setMinSalary] = useState<number>(0);
  const [maxSalary, setMaxSalary] = useState<number>(100000);
  const [maxPage, setMaxPage] = useState<Number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [growlType, setGrowlType] = useState<string>("");
  const [growlMsg, setGrowlMsg] = useState<string>("");

  useEffect(() => {
    // userService.getAllUsers().then((res) => {
    //   console.log(res);
    // });
    userService
      .getMaxPageNum()
      .then((res) => {
        setMaxPage(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    setIsLoading(true);
    search();
  }, [searchParams]);

  const search = () => {
    userService
      .getUsers(searchParams)
      .then((res) => {
        setEmployees(res.employees);
        setIsLoading(false);
      })
      .catch((err) => {
        setGrowlType("error");
        setGrowlMsg(err);
        setIsLoading(false);
        console.log(err);
      });
  };

  const submitSearch = () => {
    setSearchParams({
      ...searchParams,
      maxSalary: maxSalary,
      minSalary: minSalary,
    });
  };

  const resetSearch = async () => {
    setSearchParams(new SearchParams());
    setMaxSalary(0);
    setMinSalary(0);
  };

  const sortColumn = (e: any) => {
    let sortBy = e.target.id;
    if (sortAsc) {
      sortBy = "-" + sortBy;
    }
    setSortAsc(!sortAsc);
    setSearchParams({ ...searchParams, sortField: sortBy });
  };

  const pageChange = (e: any) => {
    if (e.target.text === activePage) {
      return;
    }
    setActivePage(e.target.text);
    setSearchParams({ ...searchParams, pageNumber: e.target.text });
    search();
  };

  const displayPagination = () => {
    let items = [];
    console.log(maxPage);
    for (let number = 1; number <= maxPage; number++) {
      items.push(
        <Pagination.Item key={number} active={number == activePage}>
          {number}
        </Pagination.Item>
      );
    }
    const paginationBasic = (
      <Row>
        <Col>
          <div>
            <Pagination onClick={pageChange}>{items}</Pagination>
            <br />
          </div>
        </Col>{" "}
      </Row>
    );
    return paginationBasic;
  };

  const displayTable = () => {
    let display: any[] = [];
    employees.forEach((employee: Employees) => {
      display.push(
        <tr key={employee.id}>
          <th>{employee.id}</th>
          <th>{employee.login}</th>
          <th>{employee.name}</th>
          <th>{employee.salary}</th>
        </tr>
      );
    });
    return (
      <Table bordered hover>
        <thead>
          <tr>
            <th>ID </th>
            <th onClick={sortColumn} id={"login"}>
              Login
              {}
              <span className="align-self-center" id={"login"}>
                <span className="fas fa-sort sortIcon" id={"login"}></span>
              </span>
            </th>
            <th onClick={sortColumn} id={"name"}>
              Name{" "}
              <span className="align-self-center" id={"name"}>
                <span className="fas fa-sort sortIcon" id={"name"}></span>
              </span>
            </th>
            <th onClick={sortColumn} id={"salary"}>
              Salary{" "}
              <span className="align-self-center" id={"salary"}>
                <span className="fas fa-sort sortIcon" id={"salary"}></span>
              </span>
            </th>
          </tr>
        </thead>
        <tbody>{display}</tbody>
      </Table>
    );
  };

  const uploadCallback = (success: boolean) => {
    if (success) {
      search();
    }
  };

  
  const clearGrowl = (done: boolean) => {
    if (done) {
      setGrowlMsg("");
      setGrowlType("");
    }
  };

  const searchFilters = () => {
    return (
      <Row className="py-4 justify-content-end">
        <Col xs={12} lg={6} className="align-self-center d-flex py-2">
          <EmployeeUpload uploadCallback={uploadCallback} />
        </Col>
        <Col xs={12} lg={2}>
          <div>
            {" "}
            <b>Min Salary</b>
          </div>
          <InputGroup className="mb-3">
            <FormControl
              aria-label="Amount (to the nearest dollar)"
              placeholder="$0"
              value={minSalary}
              onChange={(e) => {
                setMinSalary(Number(e.target.value));
              }}
            />
          </InputGroup>
        </Col>
        <Col xs={12} lg={2}>
          <div>
            <b>Max Salary</b>
          </div>
          <InputGroup className="mb-3">
            <FormControl
              value={maxSalary}
              placeholder="$4000"
              aria-label="Amount (to the nearest dollar)"
              onChange={(e) => {
                setMaxSalary(Number(e.target.value));
              }}
            />
          </InputGroup>
        </Col>

        <Col xs={12} lg={2} className="align-self-center  d-flex ">
          <Button onClick={submitSearch}>Search</Button>
          <Button onClick={resetSearch} className="mx-1">
            Reset
          </Button>
        </Col>
      </Row>
    );
  };

  let display;
  if (isLoading) {
    display = (
      <div className="text-center">
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </div>
    );
  } else {
    display = displayTable();
  }
  return (
    <Col xs={12}>
      <GrowlProvider
        message={growlMsg}
        type={growlType}
        growlCallback={clearGrowl}
      />
      <div className="py-4">
        <h1>Employees</h1>
        {searchFilters()}
        {display}
        {displayPagination()}
      </div>
    </Col>
  );
}
