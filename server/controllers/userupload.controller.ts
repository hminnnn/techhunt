import multer from "multer";
import { ParserRowMap, parseString } from "fast-csv";
import * as UserDAO from "../dao/users.dao";
import { Request, Response, NextFunction } from "express";
import { Employee } from "../models/usermodels";
import * as messages from "../resources/messages.json";

let someoneUploading = false;

const upload = multer({
  // storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "text/csv" && file.mimetype !== "application/vnd.ms-excel") {
      console.log("file is not CSV!");
      cb(null, false);
      cb(new Error(messages.user.upload.error.csvonly));
    }
    cb(null, true);
  },
}).single("file");

export const uploadUser = (req: Request, res: Response, next: NextFunction) => {
  if (someoneUploading) {
    return res.status(400).json({ error: messages.user.upload.error.uploadongoing });
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
      return res.status(400).json({ error: messages.user.upload.error.csvonly});
    }

    // everything went fine
    const file = req.file;

    validateEmployeeCSV(file.buffer)
      .then(async (employeesToCreate: any[]) => {
        try {
          await insertNewUsersToDB(employeesToCreate);
          someoneUploading = false;
          return res.status(200).json({ success: messages.user.upload.success });
        } catch (e) {
          console.log("error: ", e);
          someoneUploading = false;
          return res.status(400).json({ error: messages.user.upload.error.error });
        }
      })
      .catch((e) => {
        console.log("error: ", e);
        someoneUploading = false;
        return res.status(400).json({ error: messages.user.upload.error.invalidcsv });
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
          let errMsg = reason === undefined ? messages.user.upload.error.invalidcolumn : reason;
          invalidCSVErr = new Error(errMsg);
        })
        .on("data", (validRow: Employee) => {
          // Invalid fields
          if (!validateEmployeeFields(validRow)) {
            invalidCSVErr = new Error(messages.user.upload.error.invalidfields);
          } else {
            employeesToCreate.push(validRow);
          }
        })
        .on("end", (rowCount: number) => {
          console.log("Parsed " + rowCount + "rows");
          // Empty file
          if (rowCount === 0) {
            invalidCSVErr = new Error(messages.user.upload.error.emptyfile);
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
  for (let employee of employeeList) {
    await UserDAO.insertEmployee(employee);
  }
  return true;
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
