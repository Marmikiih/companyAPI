const router = require("express").Router();
const { rootRouter } = require("../helpers/rootRoute");
const companyRoutes = require("./company.route");

router.use(rootRouter);
router.use(companyRoutes);

module.exports = router;
