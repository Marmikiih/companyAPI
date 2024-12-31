const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Company, TeamMember } = require("../models");
const sendMail = require("../helpers/sendEmail");

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

    const emailData = {
      name: company.name,
      resetLink: `http://localhost:5000/reset-password/${resetToken}`,
      subject: "Password Reset Request",
      resetToken,
    };

    // to, subject, templateName, data
    await sendMail(email, emailData.subject, "passwordReset", emailData);

    return res.status(200).json({
      status: true,
      message: "Email Sent Successfully.",
      resetToken,
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

    if (newPassword !== confirmPassword) {
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

// Invite a team member
const inviteTeamMember = async (req, res) => {
  try {
    const { companyId, email } = req.body;

    // Check if the email is already a team member
    const existingMember = await TeamMember.findOne({
      where: { email },
    });

    if (existingMember) {
      return res.status(400).json({
        status: false,
        message: "This email is already assigned to a team member.",
      });
    }

    const company = await Company.findOne({
      where: { id: companyId },
    });

    // Generate an invite token
    const inviteToken = jwt.sign({ email, companyId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY,
    });

    const emailData = {
      companyName: company.name,
      subject: "You're invited to join our company",
      inviteLink: `http://localhost:5000/accept-invite?token=${inviteToken}`,
      inviteToken,
    };

    // to, subject, templateName, data
    await sendMail(email, emailData.subject, "inviteMember", emailData);

    return res.status(200).json({
      status: true,
      message: "Invitation sent successfully.",
      inviteToken
    });

  } catch (err) {
    console.error("Error in inviteTeamMember:", err);
    return res.status(500).json({
      status: false,
      message: "Internal server error.",
    });
  }
};

const acceptInvitationTeamMember = async (req, res) => {
  try {
    const { token, name, password, confirmPassword } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { email, companyId } = decoded;

    const existingMember = await TeamMember.findOne({ where: { email, companyId } });

    if (existingMember) {
      return res.status(400).json({
        status: false,
        message: "You are already a team member of this company.",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        status: false,
        message: "Password & Confirm Password must be the same.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newMember = await TeamMember.create({
      name,
      email,
      password: hashedPassword,
      companyId,
    });

    const company = await Company.findOne({ where: { id: companyId } });

    return res.status(201).json({
      status: true,
      message: `You have successfully joined the ${company.name}.`,
      data: {
        id: newMember.id,
        name: newMember.name,
        email: newMember.email,
      },
    });
    
  } catch (err) {
    console.error("Error in acceptInvite:", err);
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
  resetPassword,
  inviteTeamMember,
  acceptInvitationTeamMember
};
