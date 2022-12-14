var express = require("express");
var cors = require("cors");
var router = express.Router();
const newpath = require("path");
let multer = require("multer");
var auth = require("../../service/jwt");
let admin = require("../controller/admin");
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


const profile = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 4 }, //4mb
});

// user onbording
router.post("/userLogin", userdata.userLogin);
router.post("/UserRegister", userdata.UserRegister);

//user profile
router.post("/Profile",auth.userAuthAuthenticated,profile.single("image"), AgentController.AddProfile);


//agent routes
router.get("/findproperty", userdata.findproperty);
router.post("/saveProperty", auth.userAuthAuthenticated,userdata.saveProperty);
router.get("/getSaveProperty", userdata.getSaveProperty);
router.post("/favorite_property",AgentController.favorite_property);
module.exports = router;
