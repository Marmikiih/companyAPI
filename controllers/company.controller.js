const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Company } = require("../models");
const nodemailer = require("nodemailer");

const getCompanies = async (req, res) => {
  try {
    const allCompanies = await Company.findAll();
    return res.status(200).json({
      status: true,
      message: "COMPANIES",
      data: allCompanies,
    });
  } catch (err) {
    console.error(" Error From Get Company : ", err);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

const registerCompany = async (req, res) => {
  try {    
    const { name, email, password } = req.body;
    const existingCompany = await Company.findOne({ where: { email } });
    if (existingCompany) {
      return res.status(400).json({
        status: false,
        message: "Company with this email already exists",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newCompany = await Company.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      status: true,
      message: "Company registered successfully",
      data: {
        id: newCompany.id,
        name: newCompany.name,
        email: newCompany.email,
      },
    });
  } catch (err) {
    console.error("Error from Register Company:", err);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

const companyLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const company = await Company.findOne({ where: { email } });
    if (!company) {
      return res.status(401).json({
        status: false,
        message: "Invalid Email.",
      });
    }
    const isPasswordValid = await bcrypt.compare(password, company.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: false,
        message: "Password you entered is incorrect.",
      });
    }
    const token = jwt.sign(
      { id: company.id, email: company.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY } 
    );
    return res.status(200).json({
      status: true,
      message: "Login successful.",
      token,
    });
  } catch (err) {
    console.error("Error in companyLogin:", err);
    return res.status(500).json({
      status: false,
      message: "Internal server error.",
    });
  }
};

const getResetPassLink = async (req, res) => {
  const { email } = req.body;
  try {
    // Check if the company exists by email
    const company = await Company.findOne({ where: { email } });

    if (!company) {
      return res.status(404).json({
        status: false,
        message: "Email not found.",
      });
    }

    const resetToken = jwt.sign(
      { id: company.id, email: company.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY } 
    );

    company.resetToken = resetToken;
    await company.save();

    // Setup email transporter using nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASS,
      },
    });

    const mailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: email,
      subject: "Password Reset Request",
      html: `
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                padding: 20px;
                margin: 0;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
              }
              h2 {
                color: #333;
              }
              p {
                font-size: 16px;
                color: #555;
                line-height: 1.6;
              }
              .button {
                display: inline-block;
                padding: 10px 20px;
                background-color: #4CAF50;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
                margin-top: 20px;
              }
              .footer {
                text-align: center;
                font-size: 14px;
                color: #aaa;
                margin-top: 30px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h2>Password Reset Request</h2>
              <p>Dear User,</p>
              <p>We received a request to reset your password. To proceed, please click the link below:</p>
              <a href="http://localhost:5000/reset-password/${resetToken}" class="button">Reset Password</a>
              <p>${resetToken}</p>
              <p>If you did not request this, please ignore this email. Your password will remain unchanged.</p>
              <div class="footer">
                <p>If you have any questions, feel free to contact us.</p>
                <p>Best regards,<br/>Your Company Name</p>
              </div>
            </div>
          </body>
        </html>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.error(error);
      }
      console.log("Email sent: " + info.response);
    });

    return res.status(200).json({
      status: true,
      message: "Email Sent Successfully.",
      resetToken
    });

  } catch (err) {
    console.error("Error in getResetPassLink:", err);
    return res.status(500).json({
      status: false,
      message: "Internal server error.",
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    if(newPassword !== confirmPassword) { 
      return res.status(400).json({
        status: false,
        message: "New password & Confirm Password must be the same.",
      }); 
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const company = await Company.findOne({ where: { id: decoded.id } });
    
    if (!company) {
      return res.status(404).json({
        status: false,
        message: "Company not found.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    company.password = hashedPassword;
    await company.save();

    return res.status(200).json({
      status: true,
      message: "Password has been reset successfully.",
    });
  } catch (err) { 
    console.error("Error in resetPassword:", err);
    return res.status(500).json({
      status: false,
      message: "Internal server error.",
    });
  }
};

module.exports = {
  getCompanies,
  registerCompany,
  companyLogin,
  getResetPassLink,
  resetPassword
};
