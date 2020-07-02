"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadUser = void 0;
var multer_1 = __importDefault(require("multer"));
var fast_csv_1 = require("fast-csv");
var UserDAO = __importStar(require("../dao/users.dao"));
var someoneUploading = false;
var upload = multer_1.default({
    // storage: storage,
    fileFilter: function (req, file, cb) {
        if (file.mimetype !== "text/csv" &&
            file.mimetype !== "application/vnd.ms-excel") {
            console.log("onlyCSV!");
            cb(null, false);
            cb(new Error("Only CSV files are allowed."));
        }
        cb(null, true);
    },
}).single("file");
exports.uploadUser = function (req, res, next) {
    if (someoneUploading) {
        return res.status(400).json({ error: "There is an upload ongoing" });
    }
    someoneUploading = true;
    upload(req, res, function (err) {
        var failUpload = false;
        if (err instanceof multer_1.default.MulterError) {
            // multer error
            console.log("multer err:", err);
            failUpload = true;
        }
        else if (err) {
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
        var file = req.file;
        validateEmployeeCSV(file.buffer)
            .then(function (employeesToCreate) {
            insertNewUsersToDB(employeesToCreate)
                .then(function (insertRes) {
                console.log("insert success:", insertRes);
                someoneUploading = false;
                return res.status(200).json({ success: "Sucessfully uploaded!" });
            })
                .catch(function (insertErr) {
                console.log("insert failed:", insertErr);
                someoneUploading = false;
                return res.status(400).json({ error: "Error occured" });
            });
        })
            .catch(function (e) {
            console.log("failed reason:", e);
            someoneUploading = false;
            return res.status(400).json({ error: "Invalid CSV" });
        });
    });
};
function validateEmployeeCSV(fileBuffer) {
    return __awaiter(this, void 0, void 0, function () {
        var employeesToCreate, invalidCSVErr_1, bufferStr_1, options_1, endStream;
        return __generator(this, function (_a) {
            employeesToCreate = [];
            try {
                bufferStr_1 = fileBuffer.toString();
                options_1 = {
                    headers: true,
                    comment: "#",
                    strictColumnHandling: true,
                    ignoreEmpty: true,
                };
                endStream = new Promise(function (resolve, reject) {
                    fast_csv_1.parseString(bufferStr_1, options_1)
                        .validate(function (row, cb) {
                        var isValid = row.salary >= 0.0;
                        if (!isValid) {
                            return cb(null, false, "Invalid fields");
                        }
                        return cb(null, true);
                    })
                        .on("error", function (error) { return console.error(error); })
                        .on("data-invalid", function (invalidRow, rowNum, reason) {
                        // Invalid columns / salary
                        console.error("invalidrow:", invalidRow, " rowNum:", rowNum, " reason: " + reason);
                        var errMsg = reason === undefined ? "Invalid columns" : reason;
                        invalidCSVErr_1 = new Error(errMsg);
                    })
                        .on("data", function (validRow) {
                        // Invalid fields
                        if (!validateEmployeeFields(validRow)) {
                            invalidCSVErr_1 = new Error("Invalid fields");
                        }
                        else {
                            employeesToCreate.push(validRow);
                        }
                    })
                        .on("end", function (rowCount) {
                        console.log("Parsed " + rowCount + " rows");
                        // Empty file
                        if (rowCount == 0) {
                            invalidCSVErr_1 = new Error("File empty");
                        }
                        if (invalidCSVErr_1) {
                            reject(invalidCSVErr_1);
                        }
                        else {
                            resolve(employeesToCreate);
                        }
                    });
                });
                // Write to DB if pass all validations
                return [2 /*return*/, endStream
                        .then(function (employeesToCreate) {
                        return employeesToCreate;
                    })
                        .catch(function (err) {
                        throw err;
                    })];
            }
            catch (err) {
                return [2 /*return*/, err];
            }
            return [2 /*return*/];
        });
    });
}
function insertNewUsersToDB(employeeList) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, UserDAO.insertMany(employeeList)];
        });
    });
}
function validateEmployeeFields(employeeObj) {
    var alphaNumericRegex = new RegExp("^[a-zA-Z0-9]+$");
    if (employeeObj.id === "" ||
        employeeObj.login === "" ||
        employeeObj.name === "" ||
        employeeObj.salary === "") {
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
        var salaryNum = Number(employeeObj.salary);
        if (isNaN(salaryNum) || salaryNum < 0) {
            return false;
        }
    }
    catch (e) {
        return false;
    }
    return true;
}
