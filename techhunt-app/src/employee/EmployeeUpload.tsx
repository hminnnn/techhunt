import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { GrowlProvider } from "../common/Growl";
import { UserService } from "../service/userService";
import * as labels from "../resources/labels.json";
import { Dialog } from "primereact/dialog";

interface AppProps {
  uploadCallback: Function;
}
export function EmployeeUpload(props: AppProps) {
  const userService = new UserService();
  const [growlType, setGrowlType] = useState<string>("");
  const [growlMsg, setGrowlMsg] = useState<string>("");
  const [uploadFile, setUploadFile] = useState<File | null>();

  const fileUpload = (e: any) => {
    setUploadFile(e.target.files[0]);
  };

  const uploadCSV = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (uploadFile === undefined || uploadFile === null) {
      window.alert(labels.page.users.alert.selectfile);
      return;
    }
    userService
      .uploadUsers(uploadFile)
      .then((res) => {
        setGrowlType("success");
        setGrowlMsg(labels.growl.success.upload);
        props.uploadCallback(true);
      })
      .catch((err) => {
        setGrowlType("error");
        setGrowlMsg(err);
      });
  };

  const clearGrowl = (done: boolean) => {
    if (done) {
      setGrowlMsg("");
      setGrowlType("");
    }
  };

  return (
    <Row>
      <GrowlProvider message={growlMsg} type={growlType} growlCallback={clearGrowl} />
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
                  ? labels.page.users.uploadcsvplaceholder
                  : uploadFile?.name}
              </label>
            </div>
          </form>
        </div>
        <div style={{ display: "inline-block" }} className="align-self-center">
          <Button onClick={uploadCSV} className="mx-1">
            {labels.buttons.upload} <i className="fas fa-upload"></i>
          </Button>
        </div>
      </Col>
    </Row>
  );
}
