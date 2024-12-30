const path = require("path");
const nodemailer = require("nodemailer");
const ejs = require("ejs");
const fs = require("fs");

const sendMail = async (to, subject, templateName, data) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASS,
      },
    });

    const templatePath = path.join(
      path.resolve(__dirname, ".."), 
      "templates",
      `${templateName}.ejs`
    );

    const template = fs.readFileSync(templatePath, "utf-8");
    const htmlContent = ejs.render(template, data);

    const mailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to,
      subject,
      html: htmlContent,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.error(error);
      }
      console.log("Email sent: " + info.response);
    });
  } catch (error) {
    console.log(error);
    throw new Error(error?.message);
  }
};

module.exports = sendMail;
