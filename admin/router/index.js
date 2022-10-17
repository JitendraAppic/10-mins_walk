var express = require("express");
var cors = require("cors");
var router = express.Router();
var auth = require("../../service/jwt");
let admin = require('../controller/admin');
let userdata = require('../controller/user');
let AgentController = require('../controller/Agent');
router.post("/AdminSignUp", admin.AdminSignup);
router.post("/Login", admin.AdminLogin);
router.post("/forgotPassword", admin.forgotPassword);
router.post("/resetPassword", admin.resetPassword);
const multer = require("multer");
const path = require("path");

const path1 = path.join(__dirname + "/public/upload");
// const redis = require("../Controller/blockUploade").radis_post;
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, path1);
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 4 }, //4mb
});
const profile = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 4 }, //4mb
});

//users
router.post("/UserRegister", userdata.UserRegister);
router.post("/userLogin", userdata.userLogin);
router.post("/changePassword", userdata.changePassword);
router.post("/userforgatPassword", userdata.userforgatPassword);
router.get("/GetUser", auth.adminAuthAuthenticated, userdata.GetUser);
router.get("/GetAgent", auth.adminAuthAuthenticated, userdata.GetAgent);
router.post("/userDelete",auth.adminAuthAuthenticated, userdata.userDelete);
router.post("/usereditData", auth.adminAuthAuthenticated, userdata.useredit);
router.post("/userstatus", auth.adminAuthAuthenticated, userdata.userstatus);
router.post("/verificationOtp",auth.adminAuthAuthenticated,userdata.verificationOtp);
//add propity
router.post("/addproperty",auth.adminAuthAuthenticated,upload.array('image'), userdata.addproperty);
router.get("/getproperty", auth.adminAuthAuthenticated, userdata.getproperty);
router.delete("/DeleteProperty", auth.adminAuthAuthenticated, userdata.DeleteProperty);
router.put("/UpdataProperty",auth.adminAuthAuthenticated,upload.array('image'), userdata.updateProperty)
router.get("/findproperty", userdata.findproperty);

//agent routes
router.post("/Profile",auth.adminAuthAuthenticated,profile.single('image'), AgentController.AddProfile);
router.post("/favorite_property", AgentController.favorite_property);
module.exports = router;