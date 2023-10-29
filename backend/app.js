const express = require("express");
const app = express();
const port = 5000;
const cors = require("cors");
const multer = require("multer");
var bodyParser = require("body-parser");
const dotenv = require("dotenv");
var mongoose = require("mongoose");
var fs = require("fs");
var path = require("path");
var imgSchema = require("./model.js");

//.env config
dotenv.config();

mongoose.connect(process.env.MONGO_URL).then(console.log("DB Connected"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const upload = multer({ storage: storage });

app.use(cors());

app.post("/image", upload.single("file"), function (req, res) {
  console.log(req.file.imgcontent);
  var img = fs.readFileSync(
    path.join(__dirname + "/images/" + req.file.filename)
  );
  //var encode_img = img.toString("base64");

  var obj = {
    imgname: req.file.filename,
    imgcontent: img, // new Buffer.alloc(encode_img, encode_img.length),
    contentType: req.file.mimetype,
  };
  imgSchema.create(obj).then((err, item) => {
    if (err) {
      //console.log(err);
      res.json({ err });
    } else {
      res.json({});
    }
  });
});

app.post("/image2", function (req, res) {
  console.log("Inside image2");
  console.log(req.file);

  //var encode_img = img.toString("base64");

  /* var obj = {
    imgname: req.file.filename,
    imgcontent: img, // new Buffer.alloc(encode_img, encode_img.length),
    contentType: req.file.mimetype,
  };
  imgSchema.create(obj).then((err, item) => {
    if (err) {
      //console.log(err);
      res.json({ err });
    } else {
      res.json({});
    }
  }); */
  res.json({});
});

app.get("/image", (req, res) => {
  imgSchema.find({}).then((data, err) => {
    if (err) {
      //console.log(err);
    }
    console.log("number of files: " + data.length);

    var img = fs.writeFile(
      path.join(__dirname + "/export/" + data[0].imgname),
      Buffer.from(data[0].imgcontent, "base64"),
      (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("file written successfully");
        }
      }
    );

    res.json(data);
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
