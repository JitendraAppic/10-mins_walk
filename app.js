const express = require("express");
const app = express();
var cors = require("cors");
const connectdb = require("./admin/model/db_connect");
var bodyparser = require("body-parser");
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(cors());
//router
var routerdata = require("./admin/router/index");
var userRouter = require("./admin/router/user");
let AgentRouter = require("./admin/router/Agent");
app.use("/admin/", routerdata);

app.use("/user/", userRouter);
app.use("/Agent/", AgentRouter);

app.listen(8701, () => {
  console.log("port runing 8701");
});
