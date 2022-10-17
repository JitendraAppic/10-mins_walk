const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://10_Mins_Walk:10_Mins_Walk@cluster0.0phhhzl.mongodb.net/test",
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    }
  )
  .then(() => console.log("DB Connected!"))
  .catch((err) => ("Could not connect to mongodb", err));

mongoose.set("debug", true);
