"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const admin = new Schema(
  {
    Name: { type: String },
    email: { type: String },
    password: { type: String },

    // catagory: { type: String },
    // image: { type: String },
  },
  {
    timestamps: true,
  }
);
const user = new Schema(
  {
    Name: { type: String },
    email: { type: String },
    password: { type: String },
    mobile: { type: Number },
    otp: { type: Number },
    Experience: { type: String },
    Area: { type: String },
    About: { type: String },
    Upload_id:{type:String},
    type: { type: String },
    AgentStatus:{type:Boolean,default:false},
    image:{type:String,default:""},
    status:{type:Boolean,default:true}
    // catagory: { type: String },
    // image: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports.admin = mongoose.model("admin", admin);
module.exports.user = mongoose.model("user", user);