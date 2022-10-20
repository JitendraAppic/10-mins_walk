const admin_model = require("../model/admin").admin;
const bcrypt = require("bcrypt");
const service = require("../../service/jwt");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
let PropertyModel = require("../model/Addproperty").userSave_property
let AdminController = {
  AdminSignup: async (req, res) => {
    const { Name, email, password } = req.body;
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(password, salt, function (err, hash) {
        if (hash) {
          const userdata = new admin_model();
          userdata.Name = Name;
          userdata.email = email;
          userdata.password = hash;
          userdata.save((err, data) => {
            try {
              res.status(200).json({
                msg: "Create Admin data Successfully",
                status: true,
                data: data,
              });
            } catch (err) {
              res.status(500).json({
                msg: "No Data Found",
                status: false,
              });
            }
          });
        } else {
          res.status(500).json({
            msg: "No data Found",
            status: false,
          });
        }
      });
    });
  },
  AdminLogin: async (req, res) => {
    var newpassword = req.body.password;
    let email = req.body.email;
    var data = await admin_model.findOne({ email: email });

    if (data == null) {
      res.json({
        msg: "Email address and/or password you have entered do not match our records.",
        status: false,
      });
    } else {
      var result_hash = await bcrypt.compare(newpassword, data.password);
      const payload = {
        Admin_id: data._id,
        email: data.email,
      };
      if (result_hash) {
         let envsecret = service.getSecretToken();
         let token = jwt.sign(payload, envsecret);

        res.status(200).json({
          msg: "Admin Login Successfully",
          status: true,
          data: data,
          token: token,
        });
      } else {
        res.status(500).json({
          msg: "email id and password does not Match",
          status: false,
        });
      }
    }
  },
  forgotPassword: async (req, res) => {
    var email = req.body.email;
      admin_model.findOne({ email: email }, (err, data) => {

      if (data == null) {
          res.status(201).json({
              msg: "User not Found",
              status:false,
       })
      } else {
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
              text: "Node.js testing mail forgot password" + "asd",
            };

            mailTransporter.sendMail(mailDetails, function (err, data) {
              console.log(err, "2222222222");
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
    });

    },
    resetPassword: async (req, res) => {
        var id = req.body.id
        var newpassword = req.body.newpassword
        var confirm_password = req.body.confirm_password
        if (newpassword !== confirm_password) {
            res.status(200).json({
                msg: 'No password match',
                status:true,
            })
        }if (
          newpassword == "" ||
          confirm_password == "" ||
          newpassword == "undefined" ||
          confirm_password =="undefined"
        ) {
         errors += "Please fill all the fields. All fields are required \n";
        }
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(newpassword, salt, function (err, hash) {
                if (err)  return res.send(err);
                    admin_model.updateOne({ _id: id }, { $set: { password: hash } }, { new: true }, (err, data) => {
                        // console.log(err,"11111111111111");
                           if (err) return res.send(err);
                           return res.status(200).json({
                                msg: 'reset Password Successfully',
                                status: true,
                                data:data
                          })

           });


            });
        })

  },
  assineProperty: async (req, res) => {
    let data = await PropertyModel.findByIdAndUpdate({ _id: req.body.id },{ $set: { Agent_id : req.body.Agentid} },{new:true});
    try {
      res.status(200).json({
        msg: "Assine Property for Agent",
        status: true,
        data:data
       })
    } catch (err) {
      res.status(400).json({
        msg: "NO data Found ",
        status:false
      })
     }


  },

};



module.exports = AdminController;
