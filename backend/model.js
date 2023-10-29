var mongoose = require("mongoose");
var imageSchema = new mongoose.Schema({
  imgname: String,
  imgcontent: Buffer,
  contentType: String,
});

module.exports = mongoose.model("Image", imageSchema);
