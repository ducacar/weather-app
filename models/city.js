const mongoose = require("mongoose");

const citySchema = new mongoose.Schema({
  name: String,
});

const CityModel = mongoose.model("City", citySchema);

module.exports = CityModel;
