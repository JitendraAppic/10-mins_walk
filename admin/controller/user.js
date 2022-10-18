const userModel = require("../model/admin").user;
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const service = require("../../service/jwt");
const addpropity = require("../model/Addproperty").Property;
var jwt = require("jsonwebtoken");
const { user } = require("../model/admin");
let userController = {
  UserRegister: (req, res) => {

    userModel.findOne({ email: req.body.email }, (err, data) => {
      if (data == null) {
        let password = req.body.password;
        bcrypt.genSalt(10, function (err, salt) {
          bcrypt.hash(password, salt, function (err, hash) {
            var payload = {
              Name: req.body.Name,
              email: req.body.email,
              Area: req.body.Area,
              Experience: req.body.Experience,
              About: req.body.About,
              password: hash,
              mobile: req.body.mobile,
              type: req.body.type,
            };

            const userdata = new userModel(payload);
            userdata.save((err, data) => {
              // console.log(err, "1212");
              if (data) {
                try {
                  res.status(200).json({
                    msg: "User Register Successfully",
                    status: true,
                    data: data,
                  });
                } catch (err) {
                  res.status(500).json({
                    msg: "NO data Found",
                    status: false,
                  });
                }
              } else {
                res.status(500).json({
                  msg: "NO data Found",
                  status: false,
                  err: err.message,
                });
              }
            });
          });
        });
      } else {
        res.status(500).json({
          msg: "this user already Register",
          status: false,

        });
      }
    });
  },

  userLogin: async (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    var data = await userModel.findOne({ email: email });
    if (data == null) {
      res.status(200).json({
        msg: "user not Register",
        status: true,
      });
    } else {
      if (data.type == "user") {
        var result = await bcrypt.compare(password, data.password);
        const payload = {
          user_id: data._id,
          email: data.email,
        };

        if (result) {
          let envsecret = service.getSecretToken();
          let token = jwt.sign(payload, envsecret);
          res.status(200).json({
            msg: "User Login Successfully",
            status: true,
            data: data,
            token: token,
          });
        } else {
          res.status(500).json({
            msg: "user email and Password does not match",
            status: false,
          });
        }
      } else {
        var result = await bcrypt.compare(password, data.password);
        const payload = {
          user_id: data._id,
          email: data.email,
        };

        if (result) {
          let envsecret = service.getSecretToken();
          let token = jwt.sign(payload, envsecret);
          res.status(200).json({
            msg: "Agent Login Successfully",
            status: true,
            data: data,
            token: token,
          });
        } else {
          res.status(500).json({
            msg: "Agent email and Password does not match",
            status: false,
          });
        }
      }
    }
  },
  userforgatPassword: async (req, res) => {
    var email = req.body.email;
    userModel.findOne({ email: email }, (err, data) => {
      if (data == null) {
        res.status(201).json({
          msg: "User not Found",
          status: false,
        });
      } else {
        let newOtp = Math.floor(1000 + Math.random() * 9000);
        userModel.findByIdAndUpdate(
          { _id: data._id },
          { $set: { otp: newOtp } },
          (err, data) => {
            let mailTransporter = nodemailer.createTransport({
              service: "gmail",
              auth: {
                user: "jitendrakumar.appic@gmail.com",
                pass: "wdacdnozmmztmpsa",
              },
            });

            let mailDetails = {
              from: "10_Mins_Walk<JitendraKumar.appic@gmail.com>",
              to: email,
              subject: "forgat Password",
              text: "Your One Time Password" + ":" + newOtp,
            };

            mailTransporter.sendMail(mailDetails, function (err, data) {
              if (err) {
                console.log("Error Occurs");
              } else {
                res.status(200).json({
                  msg: "Verification has been sent to your registered email",
                  status: true,
                  data: data,
                });
              }
            });
          }
        );
      }
    });
  },
  verificationOtp: async (req, res) => {
    var data = await userModel.findOne({ otp: req.body.otp });
    try {
      res.status(200).json({
        msg: "Otp verify Successfully",
        status: true,
        data: data,
      });
    } catch {
      res.status(400).json({
        msg: "No Data Found",
        status: false,
      });
    }
  },
  GetUser: async (req, res) => {
    var data = await userModel.find({ type: "user" });
    try {
      res.status(200).json({
        msg: "Get User Successfully",
        status: true,
        data: data,
      });
    } catch (err) {
      res.status(500).json({
        msg: "No data found",
        status: false,
        err: err.message,
      });
    }
  },
  GetAgent: async (req, res) => {
    var data = await userModel.find({ type: "agent" });
    try {
      res.status(200).json({
        msg: "Get Agent Data Successfully",
        status: true,
        data: data,
      });
    } catch (err) {
      res.status(500).json({
        msg: "No data found",
        status: false,
        err: err.message,
      });
    }
  },
  userDelete: async (req, res) => {
    userModel.findByIdAndDelete({ _id: req.query.id }, (err, data) => {
      try {
        if (data.type == "user") {
          res.status(200).json({
            msg: "User Delete Successfully",
            status: true,
            data: data,
          });
        } else {
          res.status(200).json({
            msg: "Agent Delete Successfully",
            status: true,
            data: data,
          });
        }
      } catch (err) {
        res.status(500).json({
          msg: "NO data found",
          status: false,
        });
      }
    });
  },
  useredit: async (req, res) => {
    userModel.findByIdAndUpdate(
      { _id: req.body.id },
      {
        $set: {
          Name: req.body.Name,
          email: req.body.email,
          mobile: req.body.mobile,
        },
      },
      { new: true },
      (err, data) => {
        try {
          if (data.type == "user") {
            res.status(200).json({
              msg: "User Updata Data Successfully",
              status: true,
              data: data,
            });
          } else {
            res.status(200).json({
              msg: "Agent Updata Data Successfully",
              status: true,
              data: data,
            });
          }
        } catch (err) {
          res.status(500).json({
            msg: "NO data found",
            status: false,
          });
        }
      }
    );
  },
  userstatus: async (req, res) => {
    userModel.findOne({ _id: req.query.userid }, (err, data) => {
      if (data.status == true) {
        userModel.findByIdAndUpdate(
          { _id: req.query.userid },
          { $set: { status: false } },
          { new: true },
          (err, data2) => {
            if (data.type == "user") {
              res.status(200).json({
                msg: "User status deactive",
                status: true,
                data: data2,
              });
            } else {
              res.status(200).json({
                msg: "User status deactive",
                status: true,
                data: data2,
              });
            }
          }
        );
      } else {
        userModel.findByIdAndUpdate(
          { _id: req.query.userid },
          { $set: { status: true } },
          { new: true },
          (err, data1) => {
            if (data1.type == "user") {
              res.status(200).json({
                msg: "User status active",
                status: true,
                data: data1,
              });
            } else {
              res.status(200).json({
                msg: "Agent status active",
                status: true,
                data: data1,
              });
            }
          }
        );
      }
    });
  },


  changePassword: async (req, res) => {
    var oldpassword = req.body.oldPassword;
    var newPassword = req.body.newPassword;
    var id = { _id: req.body.id };
    let data = await userModel.findById(id);

    if (data == null) {
      res.status(200).json({
        msg: "User Not found",
        status: true,
      });
    } else {
      bcrypt.compare(oldpassword, data.password, (err, hash_code) => {
        if (hash_code) {
          bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(newPassword, salt, function (err, hash) {
              userModel.findByIdAndUpdate(
                id,
                { $set: { password: hash } },
                { new: true },
                (err, data) => {
                  if (data) {
                    try {
                      res.status(200).json({
                        msg: "Change Password Successfully",
                        status: true,
                        data: data,
                      });
                    } catch (err) {
                      res.status(500).json({
                        msg: "No Data Found",
                        status: false,
                      });
                    }
                  } else {
                    res.status(500).josn({
                      msg: "NO data Found",
                      status: false,
                      err: err.message,
                    });
                  }
                }
              );
            });
          });
        } else {
          return res.status(200).json({
            message: "incorrect old password data",
          });
        }
      });
    }
  },

  //Admin add Property
  addproperty: async (req, res) => {
    const {
      PropertyType,
      Residential,
      Area,
      Price,
      Beds_Baths,
      Description,
      location,
      email,
      mobile,
      Agent_id,
    } = req.body;
    if (req.files) {
      var image = [];
      req.files.map((value) => {
        image.push(value.path);
      });
      var payload = {
        PropertyType: PropertyType,
        Residential: Residential,
        Area: Area,
        email: email,
        mobile: mobile,
        Price: Price,
        Agent_id: Agent_id,
        location: location,
        Description: Description,
        Beds_Baths: Beds_Baths,
        loc: {
          type: req.body.type,
          coordinates: req.body.coordinates,
        },
        image: image,
      };
    } else {
      var payload = {
        PropertyType: PropertyType,
        Residential: Residential,
        Area: Area,
        Price: Price,
        email: email,
        mobile: mobile,
        Agent_id: Agent_id,
        Description: Description,
        Beds_Baths: Beds_Baths,
        location: location,
        loc: {
          type: req.body.type,
          coordinates: req.body.coordinates,
        },
        image: req.body.image,
      };
    }

    try {
      var data = await addpropity.create(payload);
      res.status(200).json({
        msg: "Add DAta Successfully",
        status: true,
        data: data,
      });
    } catch (err) {
      res.status(400).json({
        msg: "No data Found",
        status: false,
        err: err.message,
      });
    }
  },
  getproperty: async (req, res) => {
    var data = await addpropity.find({});
    try {
      res.status(200).json({
        msg: "Get data Successfully",
        status: true,
        data: data,
      });
    } catch (err) {
      res.status(400).json({
        msg: "No data found",
        status: false,
      });
    }
  },
  DeleteProperty: async (req, res) => {
    var data = await addpropity.findByIdAndDelete({ _id: req.body.id });
    try {
      res.status(200).json({
        msg: "Delete Property Successfully",
        status: true,
        data: data,
      });
    } catch (err) {
      res.status(404).json({
        msg: "No Data Found",
        status: false,
      });
    }
  },
  updateProperty: async (req, res) => {
    const {
      PropertyType,
      Residential,
      Area,
      Price,
      Beds_Baths,
      Description,
      location,
      email,
      mobile,
      Agent_id,
    } = req.body;
    if (req.files) {
      var image = [];
      req.files.map((value) => {
        image.push(value.filename);
      });
      var payload = {
        PropertyType: PropertyType,
        Residential: Residential,
        Area: Area,
        Price: Price,
        email: email,
        Agent_id: Agent_id,
        mobile: mobile,
        location: location,
        Description: Description,
        Beds_Baths: Beds_Baths,
        loc: {
          type: req.body.type,
          coordinates: req.body.coordinates,
        },
        image: image,
      };
    } else {
      var payload = {
        PropertyType: PropertyType,
        Residential: Residential,
        Area: Area,
        Price: Price,
        Description: Description,
        Beds_Baths: Beds_Baths,
        email: email,
        Agent_id: Agent_id,
        mobile: mobile,
        location: location,
        loc: {
          type: req.body.type,
          coordinates: req.body.coordinates,
        },
        image: req.body.image,
      };
    }

    try {
      let id = { _id: req.body.id };
      let query = { $set: payload };
      var data = await addpropity.findByIdAndUpdate(id, query, { new: true });
      res.status(200).json({
        msg: "Update Property Successfully",
        status: true,
        data: data,
      });
    } catch (err) {
      res.status(400).json({
        msg: "No data Found",
        status: false,
        err: err.message,
      });
    }
  },
  findproperty: async (req, res) => {
    try {
      var lat = req.body.lat;
      var log = req.body.log;

      var newArea = req.body.Area;
      let newPrice = req.body.Price;
      addpropity.aggregate(
        [
          {
            $geoNear: {
              near: {
                type: "Point",
                coordinates: [Number(log), Number(lat)],
              },
              maxDistance: parseFloat(1000) * 1609,
              distanceField: "dist.calculated",
              spherical: true,
            },
          },
          {
            $match: { Area: { $gte: newArea.minArea, $lte: newArea.maxArea } },
          },
          { $match: { Residential: req.body.Residential } },
          { $match: { PropertyType: req.body.PropertyType } },
          {
            $match: {
              Price: { $gte: newPrice.minPrice, $lte: newPrice.maxPrice },
            },
          },
        ],
        // [
        // {
        //   $geoNear: {
        //     near: {
        //       type: 'Point',
        //       coordinates: [Number(log), Number(lat)],
        //     },
        //     distanceField: 'distance',
        //     distanceMultiplier: 50000,
        //     spherical: false,
        //   },
        // },
        // ],
        (err, data) => {
          if (err) {
            res.status(500).json({
              msg: "error",
              status: false,
              err: err.message,
            });
          } else {
            res.status(200).json({
              msg: "get Data Successfully",
              status: true,
              data: data,
            });
          }
        }
      );
    } catch (err) {
      res.status(400).json({
        msg: "NO data Found",
        status: false,
        err: err.message,
      });
    }

    // var data = await addpropity.find({
    //   Rent: req.body.Rent,
    //   Residential: req.body.Residential,
    //   Area: req.body.Area,
    //   Price: req.body.Price,
    // });
    // try {
    //   res.status(200).json({
    //     msg: "Get data Successfully",
    //     status: true,
    //     data: data,
    //   });
    // } catch (err) {
    //   res.status(500).json({
    //     msg: "no data found",
    //     status: false,
    //   });
    // }
  },
  //qqw
};
module.exports = userController;
