const express = require("express");
const router = express.Router();

router.get("/company", (req, res) => {
    
  return res.status(200).json({
    status: true,
    message: "COMPANY",
  });
});

module.exports = router;