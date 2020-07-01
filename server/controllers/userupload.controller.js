const UserDAO = require("../dao/users.dao");
const fs = require('fs');
const csv = require('fast-csv');

// set upload destination and filename
const uploadFolder = './uploads/'
const multer = require('multer');
const fileName = "upload.csv";

const storage = multer.diskStorage({
    destination: uploadFolder,
    filename: function (req, res, cb) {
        cb(null, fileName)
    }
})

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'text/csv' && file.mimetype !== 'application/vnd.ms-excel') {
            console.log("onlyCSV!")
            cb(null, false)
            cb(new Error("Only CSV files are allowed."))
        }
        cb(null, true)
    }
}).single('file');


exports.uploadUser = (req, res, next) => {

    upload(req, res, function (err) {

        let failUpload = false;
        if (err instanceof multer.MulterError) {
            // multer error
            console.log("multer err:", err)
            failUpload = true;
        } else if (err) {
            // unknown err
            console.log("unknown err:", err)
            failUpload = true;
        }
        if (failUpload) {
            console.log("fail upload");
            deleteFile()
            return res.status(400).json({ error: "Only CSV files are allowed." })
        }
        // everything went fine
        const file = req.file;
        console.log("file::", file)
        validateEmployeeCSV(file).then(employeesToCreate => {
            insertNewUsersToDB(employeesToCreate).then(insertRes => {
                // Delete the uploaded file
                deleteFile();
                console.log("insert success:", insertRes)
                return res.status(200).json({ success: "Sucessfully uploaded!" })
            }).catch(insertErr => {
                deleteFile();
                console.log("insert failed:", insertErr)
                return res.status(400).json({ error: "Error occured" })
            })
        }).catch((e) => {
            deleteFile();
            console.log("failed reason:", e)
            return res.status(400).json({ error: "Invalid CSV" })
        })
    })
};

async function deleteFile() {
    fs.unlinkSync(uploadFolder + fileName)
}

async function validateEmployeeCSV(file) {

    let employeesToCreate = [];
    try {
        let invalidCSVErr;
        let stream = fs.createReadStream(uploadFolder + file.filename)
        let parser = csv.parse({ headers: true, comment: '#', strictColumnHandling: true, ignoreEmpty: true });

        var endStream = new Promise((resolve, reject) => {
            stream.pipe(parser).validate((row, cb) => {
                const isValid = row.salary >= 0.0
                if (!isValid) {
                    return cb(null, false, "Invalid fields")
                }
                return cb(null, true)
            })
                .on('error', error => console.error(error))
                .on('data-invalid', (invalidRow, rowNum, reason) => {
                    // Invalid columns / salary
                    console.error("invalidrow:", invalidRow, " rowNum:", rowNum, " reason: " + reason);
                    let errMsg = reason === undefined ? "Invalid columns" : reason;
                    invalidCSVErr = new Error(errMsg);
                })
                .on('data', (validRow) => {
                    // Invalid fields 
                    if (!validateEmployeeFields(validRow)) {
                        invalidCSVErr = new Error("Invalid fields");
                    } else {
                        employeesToCreate.push(validRow)
                    }
                })
                .on('end', rowCount => {
                    console.log(`Parsed ${rowCount} rows`)
                    // Empty file
                    if (rowCount == 0) {
                        invalidCSVErr = new Error("File empty");
                    }
                    if (invalidCSVErr) {
                        reject(invalidCSVErr)
                    } else {
                        resolve(employeesToCreate)
                    }
                })
        });

        // Write to DB if pass all validations
        return endStream.then(employeesToCreate => {
            return employeesToCreate;
        }).catch((err) => {
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
    console.log(employeeObj)
    const alphaNumericRegex = new RegExp("^[a-zA-Z0-9]+$");
    if (employeeObj.id === "" || employeeObj.login === "" || employeeObj.name === "" || employeeObj.salary === "") {
        return false;
    }
    if (!alphaNumericRegex.test(employeeObj.id)) {
        console.error("id fail")
        return false;
    }
    if (!alphaNumericRegex.test(employeeObj.login)) {
        console.error("login fail")
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
