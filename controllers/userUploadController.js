const User = require("../models/userSchema");
const fs = require('fs');
const csv = require('fast-csv');

// set upload destination and filename
const uploadFolder = './uploads/'
const multer = require('multer');

const storage = multer.diskStorage({
    destination: uploadFolder,
    filename: function (req, res, cb) {
        const fileName = "upload-" + new Date().getTime() + ".csv";
        cb(null, fileName)
    }
})

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        // if (file.mimetype !== 'text/csv') {
        //   console.log("notcsv!", file.mimetype)
        //   cb(new Error("Only CSV files are allowed."))
        // }
        cb(null, true)
    }
}).single('file');


exports.uploadUser = (req, res, next) => {

    upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            // multer error
            console.log("multer err:", err)
            return res.status(400).json({ error: "Only CSV files are allowed." })

        } else if (err) {
            // unknown err
            console.log("unknown err:", err)
            return res.status(400).json({ error: "Only CSV files are allowed." })
        }

        // everything went fine
        const file = req.file;
        let employeesToCreate = [];
        try {
            let invalidCSVErr;
            let stream = fs.createReadStream(uploadFolder + file.filename)
            let parser = csv.parse({ headers: true, comment: '#', strictColumnHandling: true, ignoreEmpty: true });

            var endStream = new Promise((resolve, reject) => {

                stream.pipe(parser).validate((row, cb) => {
                    const isValid = row.salary >= 0.0
                    if (!isValid) {
                        return cb(null, false, "Invalid salary. Salary cannot be < 0.0")
                    }
                    return cb(null, true)
                })
                    .on('error', error => console.error(error))
                    .on('data-invalid', (invalidRow, rowNum, reason) => {
                        // Invalid columns / salary
                        console.log("invalidrow:", invalidRow, " rowNum:", rowNum, " reason: " + reason);
                        let errMsg = reason === undefined ? "Invalid columns" : reason;
                        invalidCSVErr = new Error(errMsg);
                    })
                    .on('data', (validRow) => {
                        // Invalid fields 
                        if (!isValidEmployeeFields(validRow)) {
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
                            resolve({ error: invalidCSVErr.message })
                        } else {
                            resolve({ success: employeesToCreate })
                        }
                    })
            });

            // Write to DB if pass all validations
            endStream.then(validRes => {
                if (validRes.error !== undefined) {
                    return res.status(400).json(validRes)
                }
                const employeesToCreate = validRes.success;
                insertNewUsersToDB(employeesToCreate).then(insertRes => {
                    // Delete the uploaded file
                    console.log("success:", insertRes)
                    return res.status(200).json({ success: "Sucessfully uploaded!" })
                }).catch(insertErr => {
                    console.log("failed:", insertErr)
                    return res.status(400).json({ error: "Error occured" })
                })
            });

        } catch (e) {
            return res.status(400).json({ error: e })
        }
    })
};

async function insertNewUsersToDB(employeeList) {
    return await User.insertMany(employeeList);
}

function isValidEmployeeFields(employeeObj) {
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
