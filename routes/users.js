var express = require('express');
var router = express.Router();
var User = require('../controllers/userController.js')
var multer = require('multer');
var upload = multer({ dest: 'uploads/' })

/* GET users listing. */
router.get('/', User.getUsers);
router.get('/all', User.getAllUsers);

router.post('/upload', upload.single('myFile'), User.createUser);

module.exports = router;
