"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Property = new Schema(
  {
    PropertyType: {
      Purpose: { type: String },
      Rent_Frequency: { type: String },
      Completion_Status: { type: String },
    },
    Residential: { type: String },
    Description: { type: String },
    location: { type: String },
    Area: { type: String },
    Price: { type: String },
    Beds_Baths: {
      Beds: { type: String },
      Baths:{type: String},
    },
    email: { type: String },
    mobile: { type: String },
    image: { type: [] },
    Agent_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: "",
    },
    loc: { type: { type: String, default: "Point" }, coordinates: [Number] },
  },
  {
    timestamps: true,
  }
);
const favorite_property = new Schema(
  {
    userid: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    propertyid: { type: mongoose.Schema.Types.ObjectId, ref: "Property" },
    status: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);
const userSave_property = new Schema(
  {
    userid: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    propertyid: { type: mongoose.Schema.Types.ObjectId, ref: "Property" },
    Agent_id: { type: mongoose.Schema.Types.ObjectId, ref: "user",default:null },
    Name: { type: String },
    status: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);


module.exports.Property = mongoose.model("Property", Property);
module.exports.favorite_property = mongoose.model("favorite_property", favorite_property);
module.exports.userSave_property = mongoose.model("userSave_property",userSave_property);