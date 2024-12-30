const express = require("express");
const {
  getCompanies,
  registerCompany,
} = require("../controllers/company.controller");
const router = express.Router();

router.get("/company", getCompanies);
router.post("/company", registerCompany);

module.exports = router;
