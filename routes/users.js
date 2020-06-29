var express = require('express');
var router = express.Router();
const User = require('../controllers/userController.js')
const UserUpload = require('../controllers/userUploadController.js')

/* GET users listing. */
router.get('/', User.getUsers);
router.get('/all', User.getAllUsers);

router.post('/upload', UserUpload.uploadUser);

module.exports = router;
