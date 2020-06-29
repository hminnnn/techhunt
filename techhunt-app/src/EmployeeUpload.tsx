import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { UserService } from "./service/userService";

export function EmployeeUpload() {
  const userService = new UserService();

  const [uploadFile, setUploadFile] = useState<File | null>();

  const fileUpload = (e: any) => {
    console.log(e.target.files[0]);

    setUploadFile(e.target.files[0]);
  };

  const uploadCSV = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    
    if (uploadFile === undefined || uploadFile === null) {
      window.alert("Please select a file to upload");
      return;
    }
    userService
      .uploadUsers(uploadFile)
      .then((res) => {
        console.log("uploaded!", res);
      
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Row>
      <Col xs={12}>
        <div style={{ display: "inline-block" }}>
          <form>
            <div className="custom-file">
              <input
                type="file"
                className="custom-file-input"
                id="customFile"
                onChange={fileUpload}
                accept=".csv, text/plain"
              />
              <label className="custom-file-label">
                {uploadFile === undefined || uploadFile === null
                  ? "Upload Employee CSV"
                  : uploadFile?.name}
              </label>
            </div>
          </form>
        </div>
        <div style={{ display: "inline-block" }} className="align-self-center">
          <Button onClick={uploadCSV} className="mx-1">
            Upload <i className="fas fa-upload"></i>
          </Button>
        </div>
      </Col>
    </Row>
  );
}
