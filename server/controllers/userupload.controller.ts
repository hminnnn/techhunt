import multer from "multer";
import { ParserRowMap, parseString } from "fast-csv";
import * as UserDAO from "../dao/users.dao";

let someoneUploading = false;

const upload = multer({
  // storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype !== "text/csv" &&
      file.mimetype !== "application/vnd.ms-excel"
    ) {
      console.log("onlyCSV!");
      cb(null, false);
      cb(new Error("Only CSV files are allowed."));
    }
    cb(null, true);
  },
}).single("file");

export const uploadUser = (req, res, next) => {
  if (someoneUploading) {
    return res.status(400).json({ error: "There is an upload ongoing" });
  }

  someoneUploading = true;

  upload(req, res, function (err) {
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
      console.log("fail upload");
      someoneUploading = false;
      return res.status(400).json({ error: "Only CSV files are allowed." });
    }
    // everything went fine
    const file = req.file;

    validateEmployeeCSV(file.buffer)
      .then((employeesToCreate) => {
        insertNewUsersToDB(employeesToCreate)
          .then((insertRes) => {
            console.log("insert success:", insertRes);
            someoneUploading = false;
            return res.status(200).json({ success: "Sucessfully uploaded!" });
          })
          .catch((insertErr) => {
            console.log("insert failed:", insertErr);
            someoneUploading = false;
            return res.status(400).json({ error: "Error occured" });
          });
      })
      .catch((e) => {
        console.log("failed reason:", e);
        someoneUploading = false;
        return res.status(400).json({ error: "Invalid CSV" });
      });
  });
};

async function validateEmployeeCSV(fileBuffer) {
  let employeesToCreate: any[] = [];
  try {
    let invalidCSVErr;
    const bufferStr = fileBuffer.toString();
    const options = {
      headers: true,
      comment: "#",
      strictColumnHandling: true,
      ignoreEmpty: true,
    };
    var endStream = new Promise((resolve, reject) => {
      
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
          console.error(
            "invalidrow:",
            invalidRow,
            " rowNum:",
            rowNum,
            " reason: " + reason
          );
          let errMsg = reason === undefined ? "Invalid columns" : reason;
          invalidCSVErr = new Error(errMsg);
        })
        .on("data", (validRow: any) => {
          // Invalid fields
          if (!validateEmployeeFields(validRow)) {
            invalidCSVErr = new Error("Invalid fields");
          } else {
            employeesToCreate.push(validRow);
          }
        })
        .on("end", (rowCount) => {
          console.log(`Parsed ${rowCount} rows`);
          // Empty file
          if (rowCount == 0) {
            invalidCSVErr = new Error("File empty");
          }
          if (invalidCSVErr) {
            reject(invalidCSVErr);
          } else {
            resolve(employeesToCreate);
          }
        });
    });

    // Write to DB if pass all validations
    return endStream
      .then((employeesToCreate) => {
        return employeesToCreate;
      })
      .catch((err) => {
        throw err;
      });
  } catch (err) {
    return err;
  }
}

async function insertNewUsersToDB(employeeList) {
  return UserDAO.insertMany(employeeList);
}

function validateEmployeeFields(employeeObj) {
  const alphaNumericRegex = new RegExp("^[a-zA-Z0-9]+$");
  if (
    employeeObj.id === "" ||
    employeeObj.login === "" ||
    employeeObj.name === "" ||
    employeeObj.salary === ""
  ) {
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
}
