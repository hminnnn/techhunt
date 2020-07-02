import multer from "multer";
import { ParserRowMap, parseString } from "fast-csv";
import * as UserDAO from "../dao/users.dao";
import e, { Request, Response, NextFunction } from "express";

export interface Employee {
  id: string;
  login: string;
  name: string;
  salary: number;
}

let someoneUploading = false;

const upload = multer({
  // storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "text/csv" && file.mimetype !== "application/vnd.ms-excel") {
      console.log("onlyCSV!");
      cb(null, false);
      cb(new Error("Only CSV files are allowed."));
    }
    cb(null, true);
  },
}).single("file");

export const uploadUser = (req: Request, res: Response, next: NextFunction) => {
  if (someoneUploading) {
    return res.status(400).json({ error: "There is an upload ongoing" });
  }

  someoneUploading = true;

  upload(req, res, function (err: any) {
    let failUpload = false;
    if (err instanceof multer.MulterError) {
      // multer error
      console.log("multer err:", err);
      failUpload = true;
    } else if (err) {
      // unknown err
      console.log("unknown err:", err);
      failUpload = true;
    }
    if (failUpload) {
      someoneUploading = false;
      return res.status(400).json({ error: "Only CSV files are allowed." });
    }

    // everything went fine
    const file = req.file;

    validateEmployeeCSV(file.buffer)
      .then((employeesToCreate) => {
        insertNewUsersToDB(employeesToCreate)
          .then((insertRes) => {
            someoneUploading = false;
            return res.status(200).json({ success: "Sucessfully uploaded!" });
          })
          .catch((insertErr) => {
            someoneUploading = false;
            return res.status(400).json({ error: "Error occured" });
          });
      })
      .catch((e) => {
        someoneUploading = false;
        return res.status(400).json({ error: "Invalid CSV" });
      });
  });
};

const validateEmployeeCSV = async (fileBuffer: Buffer) => {
  let employeesToCreate: any[] = [];

  try {

    let invalidCSVErr: any;
    const bufferStr = fileBuffer.toString();
    const options = {
      headers: true,
      comment: "#",
      strictColumnHandling: true,
      ignoreEmpty: true,
    };

    var validateCSV = new Promise((resolve, reject) => {
      parseString(bufferStr, options)
        .validate((row: ParserRowMap<any>, cb) => {
          const isValid = row.salary >= 0.0;
          if (!isValid) {
            return cb(null, false, "Invalid fields");
          }
          return cb(null, true);
        })
        .on("error", (error) => console.error(error))
        .on("data-invalid", (invalidRow, rowNum, reason) => {
          // Invalid columns / salary
          console.error("invalidrow:", invalidRow, " rowNum:", rowNum, " reason: " + reason);
          let errMsg = reason === undefined ? "Invalid columns" : reason;
          invalidCSVErr = new Error(errMsg);
        })
        .on("data", (validRow: Employee) => {
          // Invalid fields
          if (!validateEmployeeFields(validRow)) {
            invalidCSVErr = new Error("Invalid fields");
          } else {
            employeesToCreate.push(validRow);
          }
        })
        .on("end", (rowCount: number) => {
          console.log("Parsed " + rowCount + "rows");
          // Empty file
          if (rowCount === 0) {
            invalidCSVErr = new Error("File empty");
          }
          if (invalidCSVErr) {
            reject(invalidCSVErr);
          } else {
            resolve(employeesToCreate);
          }
        });
    });

    return validateCSV
      .then((employeesToCreate) => {
        return employeesToCreate;
      })
      .catch((err) => {
        throw err;
      });
  } catch (err) {
    return err;
  }
};

const insertNewUsersToDB = async (employeeList: any[]) => {
  try {
    for (let employee of employeeList) {
      UserDAO.insertEmployee(employee);
    }
    return true;
  } catch (e) {
    return e;
  }
};

const validateEmployeeFields = (employeeObj: Employee) => {
  const alphaNumericRegex = new RegExp("^[a-zA-Z0-9]+$");
  if (employeeObj.id === "" || employeeObj.login === "" || employeeObj.name === "") {
    return false;
  }
  if (!alphaNumericRegex.test(employeeObj.id)) {
    console.error("id fail");
    return false;
  }
  if (!alphaNumericRegex.test(employeeObj.login)) {
    console.error("login fail");
    return false;
  }

  try {
    const salaryNum = Number(employeeObj.salary);
    if (isNaN(salaryNum) || salaryNum < 0) {
      return false;
    }
  } catch (e) {
    return false;
  }

  return true;
};
