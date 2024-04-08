const express = require('express');
const app = express();
const fs = require('fs');
const cors = require('cors');
const multer = require('multer');
const Joi = require('joi');

app.use(cors());
app.use(express.static("public"));
app.use(express.json());

const craftsData = fs.readFileSync("crafts.json", "utf8");
const crafts = JSON.parse(craftsData);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/images/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/api/crafts", (req, res) => {
  res.json(crafts);
});

app.post("/api/crafts", upload.single("image"), (req, res) => {
  const result = validateCraft(req.body);

  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  const newCraft = {
    name: req.body.name,
    description: req.body.description,
    image: req.file.filename,
    supplies: req.body.supplies.split(",")
  };

  crafts.push(newCraft);
  fs.writeFileSync("crafts.json", JSON.stringify(crafts, null, 2));

  res.json(newCraft);
});

const validateCraft = (craft) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    description: Joi.string().min(3).required(),
    supplies: Joi.string().min(3).required()
  });

  return schema.validate(craft);
};

app.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});
