// Import user model
const User = require("../models/user");
const jwt = require("jsonwebtoken");
// SandGrid
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// exports.signup = (req, res) => {
//   console.log('REQ BODY MESSAGE', req.body);
//     res.json({
//       data: "Sign Up Endpoint hits here successfully",
//     });
//   }

// exports.signup = (req, res) => {
//   const { name, email, password } = req.body;

//   User.findOne({ email }).exec((err, user) => {
//     if (user) {
//       return res.status(400).json({
//         error: "Email is already existed",
//       });
//     }
//   });
//   let newUser = new User({ name, email, password });
//   newUser.save((err, success) => {
//     if (err) {
//       console.log("SIGN UP ERROR", err);
//       return res.status(400).json({
//         error: err,
//       });
//     }
//     res.json({
//       message: "Signup Success! Please Sign in",
//     });
//   });
// };

exports.signup = (req, res) => {
  const { name, email, password } = req.body;

  User.findOne({ email }).exec((err, user) => {
    if (user) {
      return res.status(400).json({
        error: "Email is taken",
      });
    }

    const token = jwt.sign(
      { name, email, password },
      process.env.JWT_ACCOUNT_ACTIVATION,
      { expiresIn: "10m" }
    );

    //* Email Activation Data
    const emailData = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Account activation link`,
      html: `
          <h1>Please use the following link to activate your account</h1>
          <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
          <hr />
          <p>This email may contain sensetive information</p>
          <p>${process.env.CLIENT_URL}</p>
      `,
    };
    // Send Email
    sgMail
      .send(emailData)
      .then((sent) => {
        // console.log('SIGNUP EMAIL SENT', sent)
        return res.json({
          message: `Email has been sent to ${email}. Follow the instruction to activate your account`,
        });
      })
      .catch((err) => {
        // console.log('SIGNUP EMAIL SENT ERROR', err)
        return res.json({
          message: err.message,
        });
      });
  });
};

// Account Activation
exports.accountActivation = (req, res) => {
  const { token } = req.body;

  if (token) {
      jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, function(err, decoded) {
          if (err) {
              console.log('JWT VERIFY IN ACCOUNT ACTIVATION ERROR', err);
              return res.status(401).json({
                  error: 'Expired link. Signup again'
              });
          }

          const { name, email, password } = jwt.decode(token);

          const user = new User({ name, email, password });

          user.save((err, user) => {
              if (err) {
                  console.log('SAVE USER IN ACCOUNT ACTIVATION ERROR', err);
                  return res.status(401).json({
                      error: 'Error saving user in database. Try signup again'
                  });
              }
              return res.json({
                  message: 'Signup success. Please signin.'
              });
          });
      });
  } else {
      return res.json({
          message: 'Something went wrong. Try again.'
      });
  }
};
