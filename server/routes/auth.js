const express = require("express");
// const { sign } = require("jsonwebtoken");
const router = express.Router();

//? Import Controller
const { signup, accountActivation } = require("../controllers/auth");

//* Import Validators
const { userSignupValidator } = require("../validators/validatorAuth");
const { runValidation } = require("../validators/index");

router.post("/signup", userSignupValidator, runValidation, signup);
router.post("/account-activation", accountActivation);

module.exports = router;
