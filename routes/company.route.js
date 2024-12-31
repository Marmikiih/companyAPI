const express = require("express");
const router = express.Router();
const validate = require("../middleware/validate");
const {
  getCompanies,
  registerCompany,
  companyLogin,
  getResetPassLink,
  resetPassword,
  inviteTeamMember,
  acceptInvitationTeamMember
} = require("../controllers/company.controller");
const {
  createCompanySchema,
  loginCompanySchema,
  emailOnlySchema,
  resetPasswordSchema,
  inviteMemberSchema,
  acceptInvitationSchema
} = require("../validation/company.validation");
const AuthenticateUser = require("../middleware/auth");

router.get("/company", AuthenticateUser, getCompanies);
router.post("/company", validate(createCompanySchema), registerCompany);
router.post("/login-company", validate(loginCompanySchema), companyLogin);

// ** Forgot Password Flow   
router.get("/reset-password-link", validate(emailOnlySchema), getResetPassLink); // Get Reset password link from Email
router.post("/reset-password", validate(resetPasswordSchema), resetPassword); // Reset Password

// ** Invite New Team members using Email Flow 
router.post("/invite-team-member", AuthenticateUser, validate(inviteMemberSchema), inviteTeamMember);
router.post("/team-member-accept-invitation", validate(acceptInvitationSchema), acceptInvitationTeamMember); 

module.exports = router;
