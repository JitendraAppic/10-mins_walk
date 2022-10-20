const AgentModel = require("../model/admin").user
const favoriteProperty = require("../model/Addproperty").favorite_property;
let AgentController = {
    AddProfile: async(req, res) => {
        const { Name, mobile,id } = req.body;
        if (req.file) {

            var image = req.file.path;
            var payload = {
              Name: Name,
              mobile: mobile,
              image: image,
            };
        } else {
            var payload = {
              Name: Name,
              mobile: mobile,
              image: req.body.image,
            };
        }
        let AgentID = { _id: id };
        let query = {$set:payload}
        var data = await AgentModel.findByIdAndUpdate(AgentID, query, { new: true });
        try {
            res.status(200).json({
                mag: "Add Profile Successfully",
                status: true,
                data:data
            })
        } catch (err) {
            res.status(500).json({
                mag: "No Data Found",
                status:false
            })
        }
    },
    favorite_property: async (req, res) => {
        var agent = req.body;
      var newdata = await favoriteProperty.findOne({ propertyid: agent.propertyid });
      if (newdata == null) {
        var data = await favoriteProperty.create(agent);
        try {
          res.status(200).json({
            mag: "Add favorite_property",
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
        res.status(500).json({
          msg: "no Data Found",
          status:false
       })
      }

    },
 }
 module.exports = AgentController;