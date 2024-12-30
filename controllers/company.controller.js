const bcrypt = require("bcrypt");
const { Company } = require("../models");

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

    if (!name || !email || !password) {
      return res.status(400).json({
        status: false,
        message: "All fields are required: name, email, password",
      });
    }

    const existingCompany = await Company.findOne({ where: { email } });

    if (existingCompany) {
      return res.status(400).json({
        status: false,
        message: "Company with this email already exists",
      });
    }
    
    const salt = await bcrypt.genSalt(10)
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

module.exports = {
  getCompanies,
  registerCompany,
};
