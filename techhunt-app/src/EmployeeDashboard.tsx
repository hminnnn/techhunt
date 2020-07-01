import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import Pagination from "react-bootstrap/Pagination";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";
import { EmployeeUpload } from "./EmployeeUpload";
import { UserService } from "./service/userService";

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

  const [employees, setEmployees] = useState<Array<Employees>>(
    new Array<Employees>()
  );
  const [activePage, setActivePage] = useState<Number>(1);
  const [searchParams, setSearchParams] = useState<SearchParams>(
    new SearchParams()
  );
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [minSalary, setMinSalary] = useState<number>(0);
  const [maxSalary, setMaxSalary] = useState<number>(100000);
  const [maxPage, setMaxPage] = useState<Number>(1);

  useEffect(() => {
    userService.getAllUsers().then((res) => {
      console.log(res);
    });
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
    search();
  }, [searchParams]);

  const search = () => {
    userService
      .getUsers(searchParams)
      .then((res) => {
        setEmployees(res.employees);
      })
      .catch((err) => {
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

  // const fileUpload = (e: any) => {
  //   console.log(e.target.files);

  //   setUploadFile(e.target.files[0]);
  // };

  // const uploadCSV = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
  //   e.preventDefault();
  //   if (uploadFile === undefined || uploadFile === null) {
  //     window.alert("Please select a file to upload");
  //     return;
  //   }
  //   userService
  //     .uploadUsers(uploadFile)
  //     .then((res) => {
  //       console.log("uploaded!", res);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  const searchFilters = () => {
    return (
      <Row className="py-4 justify-content-end">
        <Col xs={12} lg={6} className="align-self-center d-flex py-2">
          {/* <form>
            <div className="custom-file">
              <input
                type="file"
                className="custom-file-input"
                id="customFile"
                onChange={fileUpload}
                accept=".csv"
              />
              <label className="custom-file-label">
                {uploadFile === undefined || uploadFile === null
                  ? "Upload Employee CSV"
                  : uploadFile?.name}
              </label>
            </div>
          </form>
          <Button onClick={uploadCSV} className="mx-1">
            Upload <i className="fas fa-upload"></i>
          </Button> */}
          <EmployeeUpload />
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

  return (
    <Col xs={10}>
      <div className="py-4">
        <h1>Employees</h1>
        {searchFilters()}
        {displayTable()}
        {displayPagination()}
      </div>
    </Col>
  );
}
