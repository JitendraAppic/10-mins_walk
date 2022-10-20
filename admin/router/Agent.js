var express = require("express");
var cors = require("cors");
var router = express.Router();
const newpath = require("path");
let multer = require("multer");
var auth = require("../../service/jwt");

let userdata = require("../controller/user");
let AgentController = require("../controller/Agent");

const path1 = newpath.join(__dirname + "/public/upload");
// const redis = require("../Controller/blockUploade").radis_post;
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, path1);
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + file.originalname);
  },
});

const Uploade_id = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 4 }, //4mb
});


// user onbording
router.post("/AgentLogin", userdata.userLogin);
router.post("/AgentSignUp",Uploade_id.single("uploade_id"),userdata.UserRegister);




module.exports = router;
