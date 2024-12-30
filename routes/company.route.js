const express = require("express");
const {
  getCompanies,
  registerCompany,
  companyLogin,
  getResetPassLink,
  resetPassword
} = require("../controllers/company.controller");
const validate = require("../middleware/validate");
const {
  createCompanySchema,
  loginCompanySchema,
  emailOnlySchema,
  resetPasswordSchema
} = require("../validation/company.validation");
const router = express.Router();

router.get("/company", getCompanies);
router.post("/company", validate(createCompanySchema), registerCompany);
router.post("/login-company", validate(loginCompanySchema), companyLogin);

// ** Forgot Password Flow   
router.get("/reset-password-link", validate(emailOnlySchema), getResetPassLink); // Get Reset password link from Email
router.post("/reset-password", validate(resetPasswordSchema), resetPassword); // Reset Password

module.exports = router;
