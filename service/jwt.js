const jwt = require("jsonwebtoken");
// const querystring = require('querystring');
var CacherLogic;
var fs = require("fs");

const adminModel = require('../admin/model/admin').admin;
const userModel = require("../admin/model/admin").user;

class CommonServices {
  constructor() {}
  adminAuthAuthenticated(req, res, next) {
    res.header(
      "Access-Control-Allow-Methods",
      "GET,PUT,POST,DELETE,PATCH,OPTIONS"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type,Authorization, Accept"
    );
    const token = req.header("Authorization");
    if (!token) {
      res.status(200).json({
        status: false,
        message: "Please Login",
      });
      return;
    } else {
      try {
        const verified = jwt.verify(
          token,
          "AcdHz3LjemqvI872qrBpLY4B6SU3h56MexbzQpfWl1I1UgLzghtypLkUkl"
        );
        req.user = verified;

        adminModel.find({ _id: req.user.Admin_id }, (err, rows) => {
          if (rows.length > 0) {
            if (
              rows[0].active != undefined &&
              rows[0].active != null &&
              rows[0].active != ""
            ) {
              if (rows[0].active == true) {
                req.user.email = rows[0].email;
                next();
              } else {
                res.status(401).json({
                  status: false,
                  message: "You Are Blocked!",
                });
                return;
              }
            } else {
              next();
            }
          } else {
            res.status(401).json({
              status: false,
              message: "Invalid Token",
            });
            return;
          }
        });
      } catch (err) {
        res.status(401).json({
          status: false,
          message: "Invalid Token",
          error: err.message,
        });
        return;
      }
    }
  }
  ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      req.flash("error_msg", "You are not logged in");
      res.redirect("/");
    }
  }
  apiAuthenticated(req, res, next) {
    res.header(
      "Access-Control-Allow-Methods",
      "GET,PUT,POST,DELETE,PATCH,OPTIONS"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type,Authorization, Accept"
    );
    next();
  }
  userAuthAuthenticated(req, res, next) {
    res.header(
      "Access-Control-Allow-Methods",
      "GET,PUT,POST,DELETE,PATCH,OPTIONS"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type,Authorization, Accept"
    );
    const token = req.header("Authorization");
    if (!token) {
      res.status(200).json({
        status: false,
        message: "Please Login",
      });
      return;
    } else {
      try {
        const verified = jwt.verify(
          token,
          "AcdHz3LjemqvI872qrBpLY4B6SU3h56MexbzQpfWl1I1UgLzghtypLkUkl"
        );
        req.user = verified;
      
        userModel.find({ _id: req.user.user_id }, (err, rows) => {
          if (rows.length > 0) {
            if (
              rows[0].active != undefined &&
              rows[0].active != null &&
              rows[0].active != ""
            ) {
              if (rows[0].active == true) {
                req.user.email = rows[0].email;
                next();
              } else {
                res.status(401).json({
                  status: false,
                  message: "You Are Blocked!",
                });
                return;
              }
            } else {
              next();
            }
          } else {
            res.status(401).json({
              status: false,
              message: "Invalid Token",
            });
            return;
          }
        });
      } catch (err) {
        res.status(401).json({
          status: false,
          message: "Invalid Token",
        });
        return;
      }
    }
  }
  getSecretToken() {
    return "AcdHz3LjemqvI872qrBpLY4B6SU3h56MexbzQpfWl1I1UgLzghtypLkUkl";
  }
  fileReadWrite(source, destination, cb) {
    fs.readFile(source, function (err, data) {
      console.log("read err ", err);
      if (err) {
        cb(true, "read");
      } else {
        fs.writeFile(destination, data, function (err) {
          console.log("write err ", err);
          if (err) {
            cb(true, "write");
          } else {
            cb(null);
          }
        });
      }
    });
  }
}
module.exports = new CommonServices();
