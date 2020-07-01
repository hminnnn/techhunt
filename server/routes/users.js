var express = require('express');
var router = express.Router();
const User = require('../controllers/user.controller.js')
const UserUpload = require('../controllers/userupload.controller.js')


router.get('/', User.getUsers);
router.get('/all', User.getAllUsers);
router.get('/maxPage', User.getMaxPageNum);
router.post('/upload', UserUpload.uploadUser);

module.exports = router;
