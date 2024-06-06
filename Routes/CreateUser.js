const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
const jwtSecret = process.env.JWT_SECRET;
router.post(
  "/createuser",
  [
    body("email").isEmail(),
    body("name").isLength({ min: 3 }),
    body("password").isLength({ min: 6 }),
  ],
  async (req, res) => {
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(404).json({ errors: errors.array() });
    }
    const salt = await bcrypt.genSalt(10);
    let secPassword = await bcrypt.hash(req.body.password, salt);
    try {
      await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPassword,
        location: req.body.location,
      });
      res.json({ message: "User created successfully" });
    } catch (error) {
      console.log(error);
      res.json({ message: `User Not created ${error.message}` });
    }
  }
);

router.post("/loginuser", async (req, res) => {
  console.log(req.body);
  let email = req.body.email;
  let password = req.body.password;
  try {
    let userData = await User.findOne({ email });
    const pwdCompare = await bcrypt.compare(password, userData.password);
    if (!userData) {
      return res.status(400).json({ message: "No Such User exist" });
    } else if (!pwdCompare) {
      return res.status(404).json({ message: "Wrong password entered" });
    }
    // console.log(userData._id);
    const data = {
      user: {
        id: userData._id,
      },
    };
    const authToken = jwt.sign(data, jwtSecret);
    return res.json({ success: true, authToken: authToken });
  } catch (error) {
    console.log(error);
    res.json({ success: false });
  }
});

module.exports = router;
